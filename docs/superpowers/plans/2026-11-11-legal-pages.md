# Páginas legais (Privacidade e Termos) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Acrescentar as páginas públicas `/privacidade` e `/termos`, com texto em PT e EN guardado no CMS (editável), ligadas a partir do rodapé.

**Architecture:** Duas páginas novas do CMS (`privacy`, `terms`) seguem o padrão de `home`/`areas`/`blog`: seed na API, rotas e componente partilhado `LegalPage` no frontend (só classes e componentes já existentes), e rotas indexáveis no servidor de SEO. O seed é idempotente, por isso não há migração de schema.

**Tech Stack:** FastAPI + SQLAlchemy async + SQLite + pytest (`../marysite-api`); React 19 + react-router + i18next + Vitest + Testing Library; Express (`server/seo`).

## Global Constraints

- **O design do site público não pode mudar.** Só se reutilizam classes e componentes que já existem; nenhum componente existente muda de aspeto. O `Footer.tsx` não é editado.
- Rotas: `/privacidade` e `/termos`. Slugs do CMS: `privacy` e `terms`.
- Texto em PT e EN seedados; o EN fica oculto enquanto `I18N=false`.
- HTML do corpo só com as tags que o sanitizer permite: `strong, em, u, a, br, p, ul, ol, li, h2, h3` e atributos `href, target, rel`.
- Dados em falta ficam como marcadores visíveis entre parênteses retos (`[NIF]`, `[Morada]`...). O texto é um rascunho informativo e não aconselhamento jurídico.
- Sem analytics nem cookies de rastreio. O texto tem de dizer a verdade sobre `localStorage` (idioma, cópia do conteúdo) e o cookie técnico `refresh_token` (HttpOnly, só no login de gestão).
- **Ordem de deploy:** API publicada e, numa base já em uso, `python -m app.scripts.seed_legal` (só as páginas legais, nunca o seed completo) executado **antes** de publicar o frontend e o servidor de SEO. Ver «Ordem de deploy» no spec.
- **Sem commits** neste plano: o utilizador faz os seus próprios commits. Cada tarefa termina com os testes dessa tarefa a passar.
- Comandos da API correm em `/Users/dariodourado/Desktop/Projectos/Mariline-Web/marysite-api` com `.venv/bin/python -m pytest`; os do frontend em `/Users/dariodourado/Desktop/Projectos/Mariline-Web/marysite` com `npm`.
- Mensagens de interface e comentários em português europeu, como no resto do código.

## File Structure

**API (`marysite-api`)**
- Modify `app/models/page.py`: `PAGE_SLUGS`.
- Create `app/seed_data/legal.py`: texto PT/EN das duas páginas.
- Modify `app/seed_data/pages.py`: registar páginas e SEO inicial.
- Modify `app/seed_data/site.py`: URLs do rodapé para bases novas.
- Modify `app/scripts/seed.py`: `seed_legal_links` para bases já existentes.
- Modify `tests/test_seed.py`, `tests/test_auth.py`, `tests/test_users.py`.

**Frontend (`marysite`)**
- Modify `src/types/cms/cms.types.ts`, `src/lib/cms/loadContent.ts` (+ `.test.ts`): slugs e cache v2.
- Modify `src/lib/adminMessages.ts`, `src/components/cms/EditToolbar.tsx`: rótulos da matriz e botão de SEO nas páginas novas.
- Create `src/pages/Legal/LegalPage.tsx`, `Privacy.tsx`, `Terms.tsx`, `LegalPage.test.tsx`.
- Modify `src/routes/routes.config.tsx`.

**Servidor de SEO (`marysite/server/seo`)**
- Modify `routes.ts`, `meta.ts`, `html.ts`, `jsonld.ts`, `seo.test.ts`.

**Docs**
- Modify `docs/cms-content-map.md`, `docs/seo/metadata-map.md`.

---

### Task 1: API — páginas `privacy` e `terms` no CMS

**Files:**
- Modify: `marysite-api/app/models/page.py:6`
- Create: `marysite-api/app/seed_data/legal.py`
- Modify: `marysite-api/app/seed_data/pages.py`
- Modify: `marysite-api/app/seed_data/site.py:29-30`
- Modify: `marysite-api/app/scripts/seed.py`
- Test: `marysite-api/tests/test_seed.py`, `marysite-api/tests/test_auth.py:141`, `marysite-api/tests/test_users.py:31`

**Interfaces:**
- Produces: `PAGE_SLUGS == ("site", "home", "areas", "blog", "privacy", "terms")`; páginas públicas `GET /api/v1/public/pages/privacy` e `/terms`, cada uma com uma secção cujo `key` é o slug e os itens `title` (text), `updated` (text), `intro` (inline), `body` (richtext); `seed_legal_links(db: AsyncSession) -> None`.
- Frontend e servidor de SEO consomem exatamente estes slugs e chaves (`privacy.title`, `privacy.updated`, `privacy.intro`, `privacy.body`, e o mesmo para `terms`).

- [ ] **Step 1: Escrever os testes que falham**

Em `tests/test_seed.py`, acrescentar `ContentSection` ao import existente:

```python
from app.models.content import ContentItem, ContentItemTranslation, ContentSection
```

e acrescentar no fim do ficheiro:

```python
async def footer_legal_items(db) -> dict[str, ContentItem]:
    rows = await db.execute(
        select(ContentItem)
        .join(ContentSection, ContentItem.section_id == ContentSection.id)
        .where(ContentSection.key == "footer", ContentItem.ref.in_(("privacy", "terms")))
        .execution_options(populate_existing=True)
    )
    return {item.ref: item for item in rows.scalars()}


async def test_legal_pages_are_seeded_in_pt_and_en(client, db, seed_images, monkeypatch):
    monkeypatch.setattr(type(settings), "locales", property(lambda self: ["pt", "en"]))
    await run_seed(db)
    for slug in ("privacy", "terms"):
        body = (await client.get(f"/api/v1/public/pages/{slug}")).json()
        assert [s["key"] for s in body["sections"]] == [slug]
        items = {i["key"]: i for i in body["sections"][0]["items"]}
        assert set(items) == {"title", "updated", "intro", "body"}
        assert items["body"]["kind"] == "richtext" and items["intro"]["kind"] == "inline"
        for locale in ("pt", "en"):
            assert items["title"]["value"][locale]
            assert items["body"]["value"][locale].startswith("<h2>")
            assert body["seo"][locale]["title"] and body["seo"][locale]["description"]


async def test_legal_bodies_only_use_tags_the_sanitizer_allows(client, db, seed_images, monkeypatch):
    import re

    monkeypatch.setattr(type(settings), "locales", property(lambda self: ["pt", "en"]))
    await run_seed(db)
    allowed = {"strong", "em", "u", "a", "br", "p", "ul", "ol", "li", "h2", "h3"}
    for slug in ("privacy", "terms"):
        body = (await client.get(f"/api/v1/public/pages/{slug}")).json()
        html = next(i for i in body["sections"][0]["items"] if i["key"] == "body")["value"]
        for locale, text in html.items():
            tags = set(re.findall(r"</?([a-z0-9]+)", text))
            assert tags <= allowed, f"{slug}.{locale}: {tags - allowed}"


async def test_seed_points_footer_legal_links_to_the_new_pages(db, seed_images):
    await run_seed(db)
    links = await footer_legal_items(db)
    assert {ref: item.link_url for ref, item in links.items()} == {"privacy": "/privacidade", "terms": "/termos"}


async def test_seed_migrates_old_hash_links_but_keeps_edited_urls(db, seed_images):
    await run_seed(db)
    links = await footer_legal_items(db)
    links["privacy"].link_url = "#"  # base criada antes das páginas novas
    links["terms"].link_url = "https://exemplo.pt/termos-antigos"  # editado pela cliente
    await db.commit()
    await run_seed(db)
    links = await footer_legal_items(db)
    assert links["privacy"].link_url == "/privacidade"
    assert links["terms"].link_url == "https://exemplo.pt/termos-antigos"
```

Em `tests/test_auth.py` linha 141 e `tests/test_users.py` linha 31, trocar a lista esperada de páginas:

```python
assert body["pages"] == ["site", "home", "areas", "blog", "privacy", "terms"]
```

(no `test_users.py` a asserção é `body["capabilities"] == ["text"] and body["pages"] == [...]`; mantém-se a primeira metade e troca-se só a lista de páginas pela de cima.)

- [ ] **Step 2: Correr os testes e confirmar que falham**

Run: `cd /Users/dariodourado/Desktop/Projectos/Mariline-Web/marysite-api && .venv/bin/python -m pytest tests/test_seed.py tests/test_auth.py tests/test_users.py -q`
Expected: FAIL (as páginas `privacy`/`terms` não existem; `KeyError`/404 e listas de páginas diferentes).

- [ ] **Step 3: Acrescentar os slugs**

`app/models/page.py`, linha 6:

```python
PAGE_SLUGS = ("site", "home", "areas", "blog", "privacy", "terms")
```

- [ ] **Step 4: Escrever o conteúdo em `app/seed_data/legal.py`**

```python
# Texto legal inicial (rascunho). Editável no CMS. Marcadores [entre parênteses retos] são dados que
# a cliente tem de preencher antes de publicar. Só tags que o sanitizer permite (h2, h3, p, ul, ol, li, strong, em, a, br).
from app.seed_data.markers import Inline, Rich

PRIVACY_PT = Rich(
    "<h2>1. Quem é o responsável pelo tratamento</h2>"
    "<p>O responsável pelo tratamento dos seus dados pessoais é <strong>Mariline Bôto</strong>, psicóloga clínica, "
    "NIF [NIF], com morada em [Morada]. Pode contactar-me por e-mail em "
    "<a href=\"mailto:marilineboto.psi@gmail.com\">marilineboto.psi@gmail.com</a> ou por WhatsApp para o (+351) 965 608 731.</p>"
    "<h2>2. Que dados recolho</h2>"
    "<p>Recolho apenas os dados que me fornece quando preenche os formulários de marcação e de contacto deste site "
    "ou quando me contacta diretamente:</p>"
    "<ul><li>nome, e-mail e telemóvel;</li><li>preferência de horário e motivo da consulta;</li>"
    "<li>o assunto e a mensagem que escrever.</li></ul>"
    "<p>O motivo da consulta pode revelar dados de saúde, que são dados de categoria especial. Só os trato com o seu "
    "consentimento explícito. Se preferir, não detalhe o motivo no formulário e fale comigo diretamente.</p>"
    "<h2>3. Para que uso os dados e com que fundamento</h2>"
    "<ul><li><strong>Responder aos seus pedidos e marcar consultas:</strong> diligências pré-contratuais a seu pedido e o seu consentimento;</li>"
    "<li><strong>Prestar o acompanhamento psicológico:</strong> execução do contrato e obrigações deontológicas e legais.</li></ul>"
    "<p>Não uso os seus dados para publicidade nem tomo decisões automatizadas sobre si.</p>"
    "<h2>4. Durante quanto tempo guardo os dados</h2>"
    "<p>Os pedidos feitos pelo site são conservados durante [prazo de conservação dos pedidos] e depois apagados. Os dados "
    "do processo clínico são conservados pelo prazo exigido pela lei e pelas regras deontológicas da profissão.</p>"
    "<h2>5. Quem tem acesso aos dados</h2>"
    "<p>Os pedidos feitos pelo site ficam guardados na base de dados do site e só são vistos por quem gere o site. "
    "O alojamento do site e da base de dados é assegurado por [fornecedor de alojamento], que trata os dados em meu nome. "
    "As consultas online realizam-se por videochamada (Google Meet). Não vendo nem cedo os seus dados a terceiros "
    "para fins de marketing.</p>"
    "<h2>6. Cookies e armazenamento no seu navegador</h2>"
    "<p>Este site <strong>não usa cookies de rastreio, de análise ou de publicidade</strong>. Guarda no seu navegador, "
    "através de <em>localStorage</em>, apenas a preferência de idioma e uma cópia do conteúdo do site para o abrir mais depressa. "
    "Quem inicia sessão na área de gestão recebe ainda um cookie técnico de sessão, necessário ao seu funcionamento. "
    "Estes dados não são usados para o identificar nem para o seguir.</p>"
    "<h2>7. Os seus direitos</h2>"
    "<p>Pode, a qualquer momento, pedir o acesso, a retificação, o apagamento, a limitação do tratamento e a portabilidade dos seus dados, "
    "opor-se ao tratamento e retirar o consentimento (sem afetar o que foi feito antes). Para isso, escreva-me para "
    "<a href=\"mailto:marilineboto.psi@gmail.com\">marilineboto.psi@gmail.com</a>. Respondo no prazo máximo de um mês.</p>"
    "<h2>8. Reclamações</h2>"
    "<p>Se considerar que o tratamento dos seus dados viola a lei, pode apresentar reclamação à Comissão Nacional de Proteção de Dados "
    "(<a href=\"https://www.cnpd.pt\" target=\"_blank\" rel=\"noopener noreferrer\">www.cnpd.pt</a>).</p>"
    "<h2>9. Segurança e menores</h2>"
    "<p>Adoto medidas técnicas e organizativas para proteger os dados contra acesso, perda ou divulgação indevidos. "
    "Este site destina-se a maiores de 18 anos; o acompanhamento de menores exige o consentimento de quem exerce as responsabilidades parentais.</p>"
    "<h2>10. Alterações a esta política</h2>"
    "<p>Posso atualizar esta política. A data da última atualização está indicada no topo da página.</p>"
)

PRIVACY_EN = Rich(
    "<h2>1. Who is responsible for processing</h2>"
    "<p>The controller of your personal data is <strong>Mariline Bôto</strong>, clinical psychologist, "
    "tax number [NIF], address [Morada]. You can reach me by e-mail at "
    "<a href=\"mailto:marilineboto.psi@gmail.com\">marilineboto.psi@gmail.com</a> or on WhatsApp at (+351) 965 608 731.</p>"
    "<h2>2. What data I collect</h2>"
    "<p>I only collect the data you give me when you fill in the booking and contact forms on this site, "
    "or when you contact me directly:</p>"
    "<ul><li>name, e-mail and mobile number;</li><li>preferred time and reason for the session;</li>"
    "<li>the subject and message you write.</li></ul>"
    "<p>The reason for the session may reveal health data, which is a special category of data. I only process it with your "
    "explicit consent. If you prefer, do not give details in the form and speak to me directly.</p>"
    "<h2>3. Why I use the data and on what legal basis</h2>"
    "<ul><li><strong>Replying to your requests and booking sessions:</strong> steps taken at your request before a contract, and your consent;</li>"
    "<li><strong>Providing psychological support:</strong> performance of the contract and professional and legal obligations.</li></ul>"
    "<p>I do not use your data for advertising and I do not make automated decisions about you.</p>"
    "<h2>4. How long I keep the data</h2>"
    "<p>Requests made through the site are kept for [retention period for requests] and then deleted. Clinical records "
    "are kept for the period required by law and by the ethical rules of the profession.</p>"
    "<h2>5. Who has access to the data</h2>"
    "<p>Requests made through the site are stored in the site's database and are only seen by the people who manage the site. "
    "Hosting of the site and database is provided by [hosting provider], which processes data on my behalf. "
    "Online sessions take place by video call (Google Meet). I do not sell or hand over your data to third parties "
    "for marketing purposes.</p>"
    "<h2>6. Cookies and storage in your browser</h2>"
    "<p>This site <strong>does not use tracking, analytics or advertising cookies</strong>. It stores in your browser, "
    "using <em>localStorage</em>, only your language preference and a copy of the site content so it opens faster. "
    "People who sign in to the management area also receive a technical session cookie, which is needed for it to work. "
    "This data is not used to identify or follow you.</p>"
    "<h2>7. Your rights</h2>"
    "<p>At any time you can ask for access, rectification, erasure, restriction of processing and portability of your data, "
    "object to processing and withdraw your consent (without affecting what was done before). To do so, write to "
    "<a href=\"mailto:marilineboto.psi@gmail.com\">marilineboto.psi@gmail.com</a>. I reply within one month.</p>"
    "<h2>8. Complaints</h2>"
    "<p>If you believe the processing of your data breaches the law, you can lodge a complaint with the Portuguese data protection authority, the "
    "Comissão Nacional de Proteção de Dados "
    "(<a href=\"https://www.cnpd.pt\" target=\"_blank\" rel=\"noopener noreferrer\">www.cnpd.pt</a>).</p>"
    "<h2>9. Security and minors</h2>"
    "<p>I use technical and organisational measures to protect data against unauthorised access, loss or disclosure. "
    "This site is intended for people aged 18 or over; supporting minors requires the consent of whoever holds parental responsibility.</p>"
    "<h2>10. Changes to this policy</h2>"
    "<p>I may update this policy. The date of the last update is shown at the top of the page.</p>"
)

TERMS_PT = Rich(
    "<h2>1. Âmbito</h2>"
    "<p>Estes termos aplicam-se à utilização deste site e à marcação e realização de consultas de psicologia clínica com "
    "<strong>Mariline Bôto</strong>, NIF [NIF], com morada em [Morada]. Ao usar o site ou ao marcar uma consulta, aceita estes termos.</p>"
    "<h2>2. Natureza do serviço</h2>"
    "<p>As consultas são de psicologia clínica e realizam-se online, por videochamada (Google Meet). A primeira sessão tem a duração "
    "aproximada de 1h30 e as seguintes cerca de 50 minutos. O conteúdo deste site é informativo e <strong>não substitui "
    "uma avaliação ou um acompanhamento clínico</strong>.</p>"
    "<p><strong>Em caso de urgência ou risco para a sua vida ou a de outra pessoa, não use este site:</strong> ligue 112 ou a linha SNS 24 (808 24 24 24).</p>"
    "<h2>3. Marcações, cancelamentos e faltas</h2>"
    "<p>As marcações fazem-se pelo formulário do site, por e-mail ou por WhatsApp e ficam confirmadas por mensagem minha. "
    "[Política de cancelamento e faltas: prazo mínimo de aviso e condições de cobrança.]</p>"
    "<h2>4. Valores e pagamento</h2>"
    "<p>Os valores e as modalidades de acompanhamento estão descritos nas perguntas frequentes da página inicial. "
    "[Condições de pagamento: quando e como é feito o pagamento e emissão de recibo.]</p>"
    "<h2>5. Sigilo e deontologia</h2>"
    "<p>Exerço a profissão de acordo com o Código Deontológico da Ordem dos Psicólogos Portugueses (cédula profissional n.º [n.º de cédula]). "
    "O que partilha comigo nas consultas é confidencial, com as exceções previstas na lei e no código deontológico.</p>"
    "<h2>6. Propriedade intelectual</h2>"
    "<p>Os textos, imagens e o logótipo deste site pertencem a Mariline Bôto ou são usados com autorização. "
    "Não podem ser copiados ou reutilizados sem autorização prévia.</p>"
    "<h2>7. Limitação de responsabilidade</h2>"
    "<p>Faço o possível para manter o site disponível e correto, mas não garanto que esteja sempre livre de interrupções ou erros. "
    "Não sou responsável pelo conteúdo de sites de terceiros para os quais o site possa ter ligações.</p>"
    "<h2>8. Proteção de dados</h2>"
    "<p>O tratamento dos seus dados pessoais está descrito na <a href=\"/privacidade\">Política de Privacidade</a>.</p>"
    "<h2>9. Lei aplicável e litígios</h2>"
    "<p>Estes termos regem-se pela lei portuguesa. Pode apresentar reclamações no "
    "<a href=\"https://www.livroreclamacoes.pt\" target=\"_blank\" rel=\"noopener noreferrer\">Livro de Reclamações Eletrónico</a>. "
    "Para a resolução de litígios de consumo, pode recorrer a uma entidade de resolução alternativa de litígios: [entidade RAL competente]. "
    "O foro competente é o da comarca de [comarca].</p>"
    "<h2>10. Alterações aos termos</h2>"
    "<p>Posso atualizar estes termos. A data da última atualização está indicada no topo da página.</p>"
)

TERMS_EN = Rich(
    "<h2>1. Scope</h2>"
    "<p>These terms apply to the use of this site and to booking and attending clinical psychology sessions with "
    "<strong>Mariline Bôto</strong>, tax number [NIF], address [Morada]. By using the site or booking a session, you accept these terms.</p>"
    "<h2>2. Nature of the service</h2>"
    "<p>Sessions are clinical psychology sessions held online by video call (Google Meet). The first session lasts about "
    "1h30 and the following ones about 50 minutes. The content of this site is informative and <strong>does not replace "
    "a clinical assessment or treatment</strong>.</p>"
    "<p><strong>In an emergency, or if your life or someone else's is at risk, do not use this site:</strong> call 112 or the SNS 24 line (808 24 24 24).</p>"
    "<h2>3. Bookings, cancellations and missed sessions</h2>"
    "<p>Bookings are made through the site form, by e-mail or by WhatsApp and are confirmed by a message from me. "
    "[Cancellation and no-show policy: minimum notice and charging conditions.]</p>"
    "<h2>4. Fees and payment</h2>"
    "<p>Fees and support options are described in the frequently asked questions on the home page. "
    "[Payment conditions: when and how payment is made and receipts are issued.]</p>"
    "<h2>5. Confidentiality and ethics</h2>"
    "<p>I practise in accordance with the Code of Ethics of the Portuguese Psychologists' Association (Ordem dos Psicólogos Portugueses; professional licence no. [licence number]). "
    "What you share with me in sessions is confidential, with the exceptions set out in law and in the code of ethics.</p>"
    "<h2>6. Intellectual property</h2>"
    "<p>The texts, images and logo on this site belong to Mariline Bôto or are used with permission. "
    "They may not be copied or reused without prior permission.</p>"
    "<h2>7. Limitation of liability</h2>"
    "<p>I do my best to keep the site available and accurate, but I do not guarantee it will always be free of interruptions or errors. "
    "I am not responsible for the content of third-party sites the site may link to.</p>"
    "<h2>8. Data protection</h2>"
    "<p>The processing of your personal data is described in the <a href=\"/privacidade\">Privacy Policy</a>.</p>"
    "<h2>9. Governing law and disputes</h2>"
    "<p>These terms are governed by Portuguese law. You can make complaints through the "
    "<a href=\"https://www.livroreclamacoes.pt\" target=\"_blank\" rel=\"noopener noreferrer\">Electronic Complaints Book</a>. "
    "For consumer disputes you can use an alternative dispute resolution body: [competent ADR body]. "
    "The competent court is that of [district].</p>"
    "<h2>10. Changes to the terms</h2>"
    "<p>I may update these terms. The date of the last update is shown at the top of the page.</p>"
)

PT = {
    "privacy": {
        "title": "Política de Privacidade",
        "updated": "Última atualização: 11 de novembro de 2026",
        "intro": Inline("Explico aqui que dados pessoais recolho através deste site, para que os uso e como pode exercer os seus direitos."),
        "body": PRIVACY_PT,
    },
    "terms": {
        "title": "Termos e Condições",
        "updated": "Última atualização: 11 de novembro de 2026",
        "intro": Inline("Estas são as condições de utilização do site e de marcação e realização das consultas de psicologia."),
        "body": TERMS_PT,
    },
}

EN = {
    "privacy": {
        "title": "Privacy Policy",
        "updated": "Last updated: 11 November 2026",
        "intro": Inline("Here I explain what personal data I collect through this site, what I use it for and how you can exercise your rights."),
        "body": PRIVACY_EN,
    },
    "terms": {
        "title": "Terms and Conditions",
        "updated": "Last updated: 11 November 2026",
        "intro": Inline("These are the conditions for using the site and for booking and attending psychology sessions."),
        "body": TERMS_EN,
    },
}
```

Nota para quem executa: `PT`/`EN` são dicionários por secção (chave da secção → itens), como em `blog.py`. Aqui cada página tem uma única secção com o nome do slug, por isso `pages.py` regista `legal.PT["privacy"]` e `legal.EN["privacy"]` embrulhados no formato `{"privacy": {...}}`.

- [ ] **Step 5: Registar as páginas e o SEO inicial em `app/seed_data/pages.py`**

Trocar a linha de import e o dicionário `PAGES`:

```python
from app.seed_data import areas, blog, home, legal, site

# Ordem das secções dentro de cada página e conteúdo PT/EN de cada uma
PAGES = {
    "site": (site.PT, site.EN),
    "home": (home.PT, home.EN),
    "areas": (areas.PT, areas.EN),
    "blog": (blog.PT, blog.EN),
    "privacy": ({"privacy": legal.PT["privacy"]}, {"privacy": legal.EN["privacy"]}),
    "terms": ({"terms": legal.PT["terms"]}, {"terms": legal.EN["terms"]}),
}
```

E acrescentar no fim de `SEO_SOURCES`, depois da entrada `"blog"`:

```python
    "privacy": (
        {"pt": "Política de Privacidade | Mariline Bôto", "en": "Privacy Policy | Mariline Bôto"},
        {
            "pt": "Saiba que dados pessoais são recolhidos neste site, para que servem, durante quanto tempo são guardados e como exercer os seus direitos RGPD.",
            "en": "Find out what personal data this site collects, what it is used for, how long it is kept and how to exercise your GDPR rights.",
        },
    ),
    "terms": (
        {"pt": "Termos e Condições | Mariline Bôto", "en": "Terms and Conditions | Mariline Bôto"},
        {
            "pt": "Condições de utilização do site e de marcação e realização das consultas de psicologia clínica online com Mariline Bôto.",
            "en": "Conditions for using the site and for booking and attending online clinical psychology sessions with Mariline Bôto.",
        },
    ),
```

- [ ] **Step 6: Apontar as ligações do rodapé para bases novas**

`app/seed_data/site.py`, linhas 29-30:

```python
        "privacy": Link("Política de Privacidade", "/privacidade"),
        "terms": Link("Termos e Condições", "/termos"),
```

- [ ] **Step 7: Migrar as ligações `#` das bases já existentes em `app/scripts/seed.py`**

Acrescentar antes de `async def run_seed`:

```python
LEGAL_LINKS = {"privacy": "/privacidade", "terms": "/termos"}


async def seed_legal_links(db: AsyncSession) -> None:
    """Bases criadas antes das páginas legais têm `#` no rodapé: passam para as páginas novas.
    Um URL já editado no CMS nunca é alterado."""
    rows = await db.execute(
        select(ContentItem)
        .join(ContentSection, ContentItem.section_id == ContentSection.id)
        .where(
            ContentSection.key == "footer",
            ContentItem.ref.in_(LEGAL_LINKS),
            ContentItem.link_url == "#",
        )
    )
    for item in rows.scalars():
        item.link_url = LEGAL_LINKS[item.ref]
```

e em `run_seed`, entre o ciclo das páginas e `seed_superuser`:

```python
    for slug in PAGE_SLUGS:
        await seed_page(ctx, slug)
    await seed_legal_links(db)
    created_user = await seed_superuser(db)
```

(`ContentSection` e `select` já estão importados no ficheiro.)

- [ ] **Step 8: Correr a suite da API e confirmar que passa**

Run: `cd /Users/dariodourado/Desktop/Projectos/Mariline-Web/marysite-api && .venv/bin/python -m pytest -q`
Expected: tudo PASS (incluindo `test_seed_is_idempotent`: o relatório do seed não mudou). Se algum teste fixar a lista de páginas noutro sítio, atualizá-lo para incluir `privacy` e `terms`.

---

### Task 2: Frontend — slugs, cache v2 e rótulos de gestão

**Files:**
- Modify: `marysite/src/types/cms/cms.types.ts:58`
- Modify: `marysite/src/lib/cms/loadContent.ts:19-30`
- Modify: `marysite/src/lib/cms/loadContent.test.ts`
- Modify: `marysite/src/lib/adminMessages.ts:78`
- Modify: `marysite/src/components/cms/EditToolbar.tsx:10`

**Interfaces:**
- Consumes: slugs da Task 1.
- Produces: `PAGE_SLUGS` e `PageSlug` com `'privacy' | 'terms'`; `CmsContent.pages.privacy` e `.terms`; chave de cache `cms:content:v2`.

- [ ] **Step 1: Escrever o teste que falha**

Em `src/lib/cms/loadContent.test.ts`, acrescentar dentro do `describe` (o ficheiro já importa `describe, expect, it, vi, beforeEach`):

```ts
  it('stores every page, including the legal ones, in the v2 cache', async () => {
    await loadCmsContent();
    const raw = JSON.parse(window.localStorage.getItem('cms:content:v2') ?? 'null');
    expect(Object.keys(raw.pages)).toEqual([...PAGE_SLUGS]);
    expect(Object.keys(raw.pages)).toEqual(expect.arrayContaining(['privacy', 'terms']));
  });

  it('ignores a v1 cache that predates the legal pages', async () => {
    window.localStorage.setItem('cms:content:v1', JSON.stringify({ config, pages: {} }));
    vi.mocked(cmsTransporter.getConfig).mockRejectedValue(failure());
    await expect(loadCmsContent()).rejects.toBeTruthy();
  });
```

- [ ] **Step 2: Correr e confirmar que falha**

Run: `cd /Users/dariodourado/Desktop/Projectos/Mariline-Web/marysite && npx vitest run src/lib/cms/loadContent.test.ts`
Expected: FAIL (`cms:content:v2` inexistente).

- [ ] **Step 3: Implementar**

`src/types/cms/cms.types.ts`, linha 58:

```ts
export const PAGE_SLUGS = ['site', 'home', 'areas', 'blog', 'privacy', 'terms'] as const;
```

`src/lib/cms/loadContent.ts`, trocar a chave e o schema:

```ts
const CACHE_KEY = 'cms:content:v2';

const cacheSchema = z.object({
  config: cmsConfigSchema,
  pages: z.object({
    site: pageResponseSchema,
    home: pageResponseSchema,
    areas: pageResponseSchema,
    blog: pageResponseSchema,
    privacy: pageResponseSchema,
    terms: pageResponseSchema,
  }),
});
```

`src/lib/adminMessages.ts`, linha 78:

```ts
      page: { site: 'Site e rodapé', home: 'Início', areas: 'Áreas', blog: 'Blog', privacy: 'Política de Privacidade', terms: 'Termos e Condições' },
```

`src/components/cms/EditToolbar.tsx`, linha 10:

```ts
const PATH_SLUGS: Record<string, string> = {
  '/': 'home', '/areas': 'areas', '/blog': 'blog', '/privacidade': 'privacy', '/termos': 'terms',
};
```

- [ ] **Step 4: Correr e confirmar que passa; verificar tipos**

Run: `npx vitest run src/lib/cms/loadContent.test.ts && npm run lint`
Expected: PASS. Se o `tsc` apontar sítios que constroem `Record<PageSlug, …>` sem as chaves novas (por exemplo em testes), acrescentar `privacy` e `terms` com `page('privacy', [])` / `page('terms', [])`, ou o equivalente do ficheiro.

---

### Task 3: Frontend — componente `LegalPage`, páginas e rotas

**Files:**
- Create: `marysite/src/pages/Legal/LegalPage.tsx`
- Create: `marysite/src/pages/Legal/Privacy.tsx`
- Create: `marysite/src/pages/Legal/Terms.tsx`
- Create: `marysite/src/pages/Legal/LegalPage.test.tsx`
- Modify: `marysite/src/routes/routes.config.tsx`

**Interfaces:**
- Consumes: `useSeo(slug: PageSlug)` de `@/src/hooks/cms/index.ts`; `Cms`, `RichHtml`, `FadeIn`; chaves `${slug}.title|updated|intro|body`.
- Produces: `LegalPage({ slug }: { slug: 'privacy' | 'terms' })`, `Privacy`, `Terms` (exports nomeados) e as rotas `privacidade` e `termos`.

- [ ] **Step 1: Escrever o teste que falha**

`src/pages/Legal/LegalPage.test.tsx`:

```tsx
import { screen } from '@testing-library/react';
import { LazyMotion, domAnimation } from 'motion/react';
import { describe, expect, it } from 'vitest';
import { page, renderWithCms, section, text } from '@/src/test/harness.tsx';
import { LegalPage } from './LegalPage.tsx';

const privacy = page('privacy', [
  section('privacy', [
    text('title', 'Política de Privacidade'),
    text('updated', 'Última atualização: 11 de novembro de 2026'),
    text('intro', 'Explico que <strong>dados</strong> recolho', 'inline'),
    text('body', '<h2>1. Responsável</h2><p>Mariline Bôto</p><script>window.hacked = 1</script>', 'richtext'),
  ]),
]);

const renderLegal = (slug: 'privacy' | 'terms', pages = [privacy]) =>
  renderWithCms(
    <LazyMotion features={domAnimation} strict>
      <LegalPage slug={slug} />
    </LazyMotion>,
    { pages },
  );

describe('LegalPage', () => {
  it('shows the title as the page heading, the update date and the intro', () => {
    renderLegal('privacy');
    expect(screen.getByRole('heading', { level: 1, name: 'Política de Privacidade' })).toBeInTheDocument();
    expect(screen.getByText('Última atualização: 11 de novembro de 2026')).toBeInTheDocument();
    expect(screen.getByText('dados').tagName).toBe('STRONG');
  });

  it('renders the CMS body as HTML and strips anything the sanitizer does not allow', () => {
    const { container } = renderLegal('privacy');
    expect(screen.getByRole('heading', { level: 2, name: '1. Responsável' })).toBeInTheDocument();
    expect(screen.getByText('Mariline Bôto')).toBeInTheDocument();
    expect(container.querySelector('script')).toBeNull();
  });

  it('reads the keys of the slug it receives', () => {
    const terms = page('terms', [section('terms', [
      text('title', 'Termos e Condições'), text('updated', 'x'), text('intro', 'y', 'inline'), text('body', '<h2>1. Âmbito</h2>', 'richtext'),
    ])]);
    renderLegal('terms', [terms]);
    expect(screen.getByRole('heading', { level: 1, name: 'Termos e Condições' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: '1. Âmbito' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Correr e confirmar que falha**

Run: `npx vitest run src/pages/Legal/LegalPage.test.tsx`
Expected: FAIL (`Cannot find module './LegalPage.tsx'`).

- [ ] **Step 3: Implementar o componente e os wrappers**

`src/pages/Legal/LegalPage.tsx`:

```tsx
import { Cms } from '@/src/components/cms/Cms.tsx';
import { RichHtml } from '@/src/components/cms/RichHtml.tsx';
import { FadeIn } from '@/src/components/ui/FadeIn.tsx';
import { useSeo } from '@/src/hooks/cms/index.ts';

export type LegalSlug = 'privacy' | 'terms';

interface LegalPageProps {
  slug: LegalSlug;
}

/** Página de texto legal: cabeçalho e corpo vêm do CMS (secção com o nome do slug). */
export const LegalPage = ({ slug }: LegalPageProps) => {
  useSeo(slug);

  return (
    <section className="pt-12 md:pt-14 min-h-screen bg-muted">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <FadeIn className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <h1 className="text-4xl md:text-6xl font-serif font-normal text-foreground mb-6 tracking-tight">
            <Cms k={`${slug}.title`} />
          </h1>
          <p className="text-sm uppercase tracking-widest text-primary-dark mb-6">
            <Cms k={`${slug}.updated`} />
          </p>
          <p className="text-lg md:text-xl text-text-light leading-relaxed">
            <Cms k={`${slug}.intro`} />
          </p>
        </FadeIn>
        <div className="bg-surface rounded-tile border border-line shadow-card px-6 py-10 md:px-12 md:py-14">
          <RichHtml
            k={`${slug}.body`}
            className="text-lg text-text-light leading-relaxed [&_h2:not(:first-child)]:mt-10"
          />
        </div>
      </div>
    </section>
  );
};
```

`src/pages/Legal/Privacy.tsx`:

```tsx
import { LegalPage } from './LegalPage.tsx';

export const Privacy = () => <LegalPage slug="privacy" />;
```

`src/pages/Legal/Terms.tsx`:

```tsx
import { LegalPage } from './LegalPage.tsx';

export const Terms = () => <LegalPage slug="terms" />;
```

- [ ] **Step 4: Registar as rotas em `src/routes/routes.config.tsx`**

Depois da linha do `Blog` (`const Blog = lazy(...)`):

```tsx
const Privacy = lazy(() => import('@/src/pages/Legal/Privacy.tsx').then((m) => ({ default: m.Privacy })));
const Terms = lazy(() => import('@/src/pages/Legal/Terms.tsx').then((m) => ({ default: m.Terms })));
```

e nos `children` do `Layout`, antes da rota `'*'`:

```tsx
      { path: 'privacidade', element: withSuspense(Privacy) },
      { path: 'termos', element: withSuspense(Terms) },
```

- [ ] **Step 5: Correr os testes e os tipos**

Run: `npx vitest run src/pages/Legal/LegalPage.test.tsx && npm run lint`
Expected: PASS.

---

### Task 4: Servidor de SEO — rotas, sitemap, noscript e breadcrumb

**Files:**
- Modify: `marysite/server/seo/routes.ts:5-19`
- Modify: `marysite/server/seo/meta.ts:33`
- Modify: `marysite/server/seo/html.ts` (função `noscriptBlock` e novo `legalBody`)
- Modify: `marysite/server/seo/jsonld.ts:86`
- Test: `marysite/server/seo/seo.test.ts`

**Interfaces:**
- Consumes: slugs e chaves da Task 1 e 2 (`privacy.title`, `privacy.updated`, `privacy.intro`, `privacy.body`).
- Produces: `PublicRoute['slug']` com `'privacy' | 'terms'`; rotas `/privacidade` e `/termos` indexáveis.

- [ ] **Step 1: Escrever os testes que falham**

Em `server/seo/seo.test.ts`, acrescentar ao objeto `pages` (depois da entrada `blog`):

```ts
  privacy: page('privacy', 'Política de Privacidade | Mariline', 'Descrição da privacidade', [
    section('privacy', [
      item('title', 'Política de Privacidade'), item('updated', 'Última atualização: 11 de novembro de 2026'),
      item('intro', 'Introdução da política'),
      item('body', '<h2>1. Responsável</h2><p>Mariline Bôto</p><script>x</script>', 'richtext'),
    ]),
  ]),
  terms: page('terms', 'Termos e Condições | Mariline', 'Descrição dos termos', [
    section('terms', [
      item('title', 'Termos e Condições'), item('updated', 'Última atualização: 11 de novembro de 2026'),
      item('intro', 'Introdução dos termos'), item('body', '<h2>1. Âmbito</h2><p>Texto</p>', 'richtext'),
    ]),
  ]),
```

Acrescentar ao `describe('rotas', …)`:

```ts
  it('classifica as páginas legais como públicas e indexáveis', () => {
    const routes = publicRoutes({ indexBlog: false });
    expect(classify('/privacidade', routes).route?.slug).toBe('privacy');
    expect(classify('/termos', routes).route?.indexable).toBe(true);
  });
```

Acrescentar ao `describe('robots.txt e sitemap.xml', …)`:

```ts
  it('inclui as páginas legais no sitemap', () => {
    const xml = seo.sitemap(req);
    expect(xml).toContain('<loc>https://exemplo.pt/privacidade</loc>');
    expect(xml).toContain('<loc>https://exemplo.pt/termos</loc>');
  });
```

Acrescentar ao `describe('render', …)`:

```ts
  it('privacidade: metadados, breadcrumb com o título da página e noscript sem HTML perigoso', async () => {
    const { html, status } = await seo.render(template, req, '/privacidade');
    expect(status).toBe(200);
    expect(html).toContain('<title>Política de Privacidade | Mariline</title>');
    expect(html).toContain('<link rel="canonical" href="https://exemplo.pt/privacidade">');
    expect(html).toContain('content="index, follow, max-image-preview:large"');
    expect(html).toContain('"name":"Política de Privacidade"');
    expect(html).toMatch(/<noscript><main>[\s\S]*<h1>Política de Privacidade<\/h1>/);
    expect(html).toContain('Mariline Bôto');
    expect(html).not.toContain('<script>x</script>');
  });

  it('termos: canonical e noscript com o título', async () => {
    const { html } = await seo.render(template, req, '/termos');
    expect(html).toContain('<link rel="canonical" href="https://exemplo.pt/termos">');
    expect(html).toMatch(/<noscript><main>[\s\S]*<h1>Termos e Condições<\/h1>/);
  });
```

E atualizar a asserção existente do `seo-indexable` na `home`:

```ts
    expect(html).toContain('name="seo-indexable" content="/,/areas,/privacidade,/termos"');
```

- [ ] **Step 2: Correr e confirmar que falha**

Run: `cd /Users/dariodourado/Desktop/Projectos/Mariline-Web/marysite && npx vitest run server/seo/seo.test.ts`
Expected: FAIL (rotas desconhecidas, sitemap sem as páginas).

- [ ] **Step 3: `routes.ts`**

```ts
export interface PublicRoute {
  path: string;
  /** Página do CMS de onde vêm o título e a descrição. */
  slug: 'home' | 'areas' | 'blog' | 'privacy' | 'terms';
  /** Se entra no sitemap e no índice. O blog fica fora enquanto não tiver artigos. */
  indexable: boolean;
}
```

e em `publicRoutes`:

```ts
export const publicRoutes = ({ indexBlog }: RouteOptions): PublicRoute[] => [
  { path: '/', slug: 'home', indexable: true },
  { path: '/areas', slug: 'areas', indexable: true },
  { path: '/blog', slug: 'blog', indexable: indexBlog },
  { path: '/privacidade', slug: 'privacy', indexable: true },
  { path: '/termos', slug: 'terms', indexable: true },
];
```

- [ ] **Step 4: `meta.ts` linha 33**

Garantir o import do tipo (`import type { Classified, PublicRoute } from './routes.ts';` — acrescentar `PublicRoute` ao import que já existe de `./routes.ts`) e trocar a assinatura:

```ts
const imageFor = (content: SeoContent | null, siteUrl: string, slug: PublicRoute['slug']) => {
```

- [ ] **Step 5: `html.ts`**

Acrescentar depois de `blogBody`:

```ts
const legalBody = (content: SeoContent, slug: 'privacy' | 'terms'): string => {
  const t = (path: string) => textAt(content.texts, path);
  // O corpo vem em HTML do CMS: no noscript só interessa o texto, por isso passa por htmlToText e escapa
  return [h(1, t(`${slug}.title`)), p(t(`${slug}.updated`)), p(t(`${slug}.intro`)), p(htmlToText(t(`${slug}.body`)))].join('\n');
};

const bodyFor = (slug: PublicRoute['slug'], content: SeoContent): string => {
  if (slug === 'home') return homeBody(content);
  if (slug === 'areas') return areasBody(content);
  if (slug === 'privacy' || slug === 'terms') return legalBody(content, slug);
  return blogBody(content);
};
```

e em `noscriptBlock` trocar a linha do `const body = …` por:

```ts
  const body = bodyFor(classified.route.slug, content);
```

Acrescentar o tipo ao import de rotas (`import type { Classified, PublicRoute } from './routes.ts';`). `htmlToText` já é importado no topo do ficheiro.

- [ ] **Step 6: `jsonld.ts` linha 86**

Acrescentar antes de `buildJsonLd`:

```ts
// Chave do CMS com o nome de cada página no breadcrumb
const BREADCRUMB_KEY: Record<PublicRoute['slug'], string> = {
  home: 'nav.home',
  areas: 'areasPage.title',
  blog: 'blog.title',
  privacy: 'privacy.title',
  terms: 'terms.title',
};
```

trocar o import de rotas por `import type { Classified, PublicRoute } from './routes.ts';` e a linha do segundo elemento do breadcrumb por:

```ts
        { '@type': 'ListItem', position: 2, name: t(BREADCRUMB_KEY[classified.route.slug]), item: meta.canonical },
```

- [ ] **Step 7: Correr os testes do servidor e os tipos**

Run: `npx vitest run server/seo && npm run lint`
Expected: PASS.

---

### Task 5: Documentação, verificação completa e verificação visual

**Files:**
- Modify: `marysite/docs/cms-content-map.md`
- Modify: `marysite/docs/seo/metadata-map.md`
- Modify: `marysite/docs/superpowers/specs/2026-11-11-legal-pages-design.md` (uma linha)

**Interfaces:**
- Consumes: tudo das Tasks 1-4.

- [ ] **Step 1: Corrigir o spec**

No spec, na secção Frontend, a linha do `LegalPage` fica a dizer `bg-muted` em vez de `bg-surface` no `<section>` (como as Áreas), para o cartão `bg-surface` se destacar:

```
  - `<section className="pt-12 md:pt-14 min-h-screen bg-muted">`, o fundo que as Áreas usam atrás dos cartões;
```

- [ ] **Step 2: Documentar no mapa de conteúdo**

Em `docs/cms-content-map.md`, no fim, acrescentar:

```markdown
## Páginas `privacy` e `terms`

Páginas legais (`/privacidade` e `/termos`). Cada uma tem uma secção com o nome do slug.

| Secção | Conteúdo | Tipo | Chaves | Imagem |
|---|---|---|---|---|
| privacy | Título, data da última atualização, introdução, corpo | text, text, inline, richtext | `privacy.title`, `privacy.updated`, `privacy.intro`, `privacy.body` | Não |
| terms | Título, data da última atualização, introdução, corpo | text, text, inline, richtext | `terms.title`, `terms.updated`, `terms.intro`, `terms.body` | Não |

Os marcadores entre parênteses retos (`[NIF]`, `[Morada]`...) são dados a preencher antes de publicar. O corpo só aceita `h2`, `h3`, `p`, `ul`, `ol`, `li`, `strong`, `em`, `a`.
```

- [ ] **Step 3: Documentar o SEO**

Em `docs/seo/metadata-map.md`, acrescentar duas linhas à tabela de metadados, depois da linha de `/blog`, com o mesmo formato das anteriores:

```markdown
| `/privacidade` | Política de Privacidade \| Mariline Bôto | Saiba que dados pessoais são recolhidos neste site, para que servem, durante quanto tempo são guardados e como exercer os seus direitos RGPD. | Política de Privacidade | `https://<SITE_URL>/privacidade` | Idem |
| `/termos` | Termos e Condições \| Mariline Bôto | Condições de utilização do site e de marcação e realização das consultas de psicologia clínica online com Mariline Bôto. | Termos e Condições | `https://<SITE_URL>/termos` | Idem |
```

(Se a tabela tiver mais colunas do que estas seis, preencher as restantes com o mesmo critério das linhas existentes.)

- [ ] **Step 4: Gates completos**

Run (API): `cd /Users/dariodourado/Desktop/Projectos/Mariline-Web/marysite-api && .venv/bin/python -m pytest -q`
Run (frontend): `cd /Users/dariodourado/Desktop/Projectos/Mariline-Web/marysite && npm run lint && npm test && npm run build`
Expected: tudo PASS, build sem erros.

- [ ] **Step 5: Semear a base de desenvolvimento e ver as páginas**

A base local `marysite-api/data/app.db` já está semeada: o seed só acrescenta o que falta e nunca reescreve edições.

Run: `cd /Users/dariodourado/Desktop/Projectos/Mariline-Web/marysite-api && .venv/bin/python -m app.scripts.seed`
Expected: `seed.done` com `items_created` > 0.

Arrancar a API e o frontend como descrito no README de cada projeto (guardar o PID de cada processo; nunca `pkill -f` largo, só `kill <PID>`). Com Chromium headless (executablePath do `chromium_headless_shell` em `~/Library/Caches/ms-playwright`), abrir:
- `/privacidade` e `/termos` em 1280×900 e 390×844;
- `/`, `/areas` e `/blog` para confirmar que o aspeto não mudou;
- o rodapé, para confirmar que as duas ligações levam às páginas novas.

Expected: títulos, data e corpo visíveis; sem erros na consola; nenhuma diferença visual nas páginas existentes.

- [ ] **Step 6: Relatório final ao utilizador**

Listar: o que foi feito, o resultado dos gates, e o que fica por decidir: preencher os marcadores `[...]` do texto, revisão jurídica, a ordem de deploy (API e seed antes do frontend), os utilizadores que já existem não terem acesso às páginas novas no CMS até o superuser lho dar, e os formulários de marcação e de contacto não terem uma caixa de consentimento (acrescentá-la mudaria o design, por isso não foi feito).

---

## Self-Review

**Cobertura do spec**
- CMS `privacy`/`terms`, PT e EN: Task 1.
- Passo de seed dos links do rodapé que só troca `#`: Task 1, steps 6-7.
- Sem migração Alembic: Task 1 (apenas seed).
- `PAGE_SLUGS` e cache v2 no frontend: Task 2.
- `LegalPage`, wrappers, rotas lazy: Task 3.
- `routes.ts`, `meta.ts`, `html.ts`, `jsonld.ts` do SEO: Task 4. `content.ts` não muda (já percorre `PAGE_SLUGS`).
- Rodapé sem alterações de código: Task 5 verifica visualmente.
- Itens que o spec não previa e que o plano cobre: `EditToolbar.PATH_SLUGS` (botão de SEO nas páginas novas) e rótulos de `PermissionMatrix` (`adminMessages.ts`), na Task 2; dois testes existentes da API que fixavam a lista de páginas, na Task 1.
- Ordem de deploy, riscos e relatório final: Global Constraints e Task 5 step 6.

**Placeholders:** os `[...]` do texto legal são dados em falta da cliente, intencionais e visíveis; não são placeholders de plano. Não há "TBD" nem passos sem código.

**Consistência de tipos:** os slugs (`privacy`, `terms`), as chaves (`title`, `updated`, `intro`, `body`), `LegalSlug`, `PublicRoute['slug']`, `seed_legal_links` e a chave de cache `cms:content:v2` usam o mesmo nome em todas as tarefas.
