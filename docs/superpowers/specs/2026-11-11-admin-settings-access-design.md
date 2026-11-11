# Admin com acesso às Configurações, perfil próprio e gestão de perfis

Data: 2026-11-11 · Estado: âmbito acordado em conversa (admin gere editores e admins; perfil próprio = nome e password); desenho a implementar.

## Objetivo

O role `admin` passa a poder: abrir as Configurações (ligação no menu), criar e gerir perfis de editor e de admin, e editar o seu próprio nome e password. Hoje só o `superuser` acede e a API responde 403 ao admin em `/admin/settings/users`.

Fora de âmbito: alterar o e-mail de login, mudar o próprio role/estado, e qualquer alteração ao design do site público.

## Regras (aplicadas no servidor; a UI só as espelha)

| Ação do admin | Regra |
|---|---|
| Listar utilizadores | Vê editores e admins; **superusers não aparecem** |
| Criar | Só `editor` ou `admin`; criar `superuser` → 403 |
| Atribuir permissões | Só o que ele próprio tem. Valor **novo** que não possui → 403. Sem valores explícitos, as predefinições do role são limitadas às dele |
| Editar outro perfil (nome, role, ativo, permissões) | Só se o alvo e o novo role forem `editor`/`admin`; alvo `superuser` ou novo role `superuser` → 403 |
| Repor password de outro perfil | Só alvos `editor`/`admin`; alvo `superuser` → 403 |
| Editar-se a si próprio pela gestão (editar, ativar/desativar, repor password) | 403: usa o perfil próprio |
| Último superuser ativo | Regra existente mantém-se |

«Valor novo» na edição = o que o alvo ainda não tinha. Assim um admin com menos permissões consegue guardar o nome de um editor que já tinha `images`, sem lhe conseguir dar `images`.

O superuser mantém o comportamento atual (inclui repor a própria password pela gestão).

O admin pode repor a password de outro admin: é o que foi pedido, e permite tomar essa conta. Fica na tabela de auditoria que já existe (`user`, `password_reset`).

## API (`marysite-api`)

- `routers/admin_users.py`: dependência de `require_superuser` para `require_staff` (admin e superuser; editor e anónimo continuam recusados); o `actor` passa a ser `require_staff`.
- `services/user_service.py`:
  - `list_users(actor)` filtra superusers para o admin;
  - `create`, `update` e `reset_password` aplicam a tabela acima com `ApiError(403, "FORBIDDEN", …)`; a validação de valores desconhecidos (422) corre antes da de permissões (403);
  - `update_profile(user, display_name)` e `change_password(user, current, new, keep_family_id)` (novos), ambos com auditoria (`profile_update`, `password_change`).
- `routers/auth.py` (autenticado por Bearer, só `require_staff`):
  - `PATCH /auth/me` com `{displayName}` devolve `UserResponse`;
  - `POST /auth/me/password` com `{currentPassword, newPassword}` devolve 204. Password atual errada devolve **400** com `code: "INVALID_CURRENT_PASSWORD"` (nunca 401: o cliente de sessão trata 401 como sessão expirada). Nova password com 10 a 256 caracteres (422 se não). Revoga os refresh tokens do utilizador **exceto a sessão atual**, identificada pelo cookie `refresh_token` (que o navegador já envia a `/api/v1/auth`); sem cookie válido revoga todos.
- `repositories/refresh_token_repository.py`: `revoke_all_except_family(user_id, family_id)`.
- `schemas/user.py`: `ProfileUpdate`, `PasswordChange`.

## Frontend (`marysite`)

- `routes/routes.config.tsx`: `/admin/settings` passa de `superuserOnly` para `staffOnly`.
- Menu: a ligação «Configurações» aparece para admin e superuser em `AdminShell.tsx` e `EditToolbar.tsx` (os dois sítios onde hoje só o superuser a vê).
- `lib/auth/authClient.ts`: `updateUser(next)` atualiza o utilizador em memória (o nome na barra muda sem recarregar).
- `lib/cms/errorKey.ts`: `400` + `INVALID_CURRENT_PASSWORD` mapeia para `admin.error.wrongPassword`.
- `types/users`: `profileFormSchema` e `passwordChangeSchema`.
- `services/transporters/users`: `updateProfile` e `changePassword`; `hooks/users`: `useUpdateProfile` e `useChangePassword`.
- `pages/Admin/Settings/`:
  - `ProfileDialog.tsx` (novo): nome e mudança de password (atual e nova), no estilo de `ResetPasswordDialog`;
  - `Settings.tsx`: botão «O meu perfil» ao lado de «Novo utilizador»;
  - `UsersTable.tsx`: para um admin, a sua própria linha mostra só «O meu perfil» em vez de editar, repor password e ativar/desativar;
  - `UserFormDialog.tsx`: para um admin o select de role só oferece editor e admin, e as predefinições de permissões ficam limitadas às dele;
  - `PermissionMatrix.tsx`: props opcionais `allowedCapabilities` e `allowedPages`; o que o admin não tem fica desativado, exceto o que o alvo já tinha.
- `lib/adminMessages.ts`: textos novos (`myProfile`, `profileSaved`, `currentPassword`, `changePassword`, `passwordChanged`, `error.wrongPassword`).

O design do site público não muda. A área de gestão reutiliza `Modal`, `input` e `btn-primary`.

## Testes

- **pytest (`tests/test_admin_settings.py`)**: acesso (admin sim; editor 403; anónimo 401); superusers ocultos; criação e limites de role e permissões; edição e reposição de password com alvo superuser, alvo próprio e promoção a superuser; «valor novo»; `PATCH /auth/me` (admin, editor 403); `POST /auth/me/password` (400 com atual errada, 422 com nova curta, 204 e login com a nova, sessão atual mantida e outras revogadas). O teste que dizia «só o superuser acede» passa a «admin acede, editor não».
- **vitest**: `PermissionMatrix` com `allowed*`; `UsersTable` com linha própria; `UserFormDialog` sem opção superuser para admin; `ProfileDialog`; `authClient.updateUser`; `errorKey`.
- **Gates**: `pytest`, `npm run lint`, `npm test`, `npm run build`; verificação no navegador do menu e das Configurações com um admin de teste.

## Riscos

- Escalada de privilégios: mitigada pelas regras no servidor e pelos testes de cada fronteira.
- Admin repor a password de outro admin: aceite, auditado.
- Sessões após mudar a password: as outras são revogadas; a atual mantém-se.
