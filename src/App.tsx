/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QueryClientProvider } from '@tanstack/react-query';
import { I18nextProvider } from 'react-i18next';
import i18n from './lib/i18n.ts';
import { AuthProvider } from './lib/auth/AuthProvider.tsx';
import { authClient } from './lib/auth/session.ts';
import { EditModeProvider } from './components/cms/EditModeProvider.tsx';
import { CmsProvider } from './lib/cms/CmsProvider.tsx';
import { queryClient } from './lib/queryClient.ts';
import { AppRouter } from './routes/index.tsx';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <CmsProvider>
          <AuthProvider client={authClient}>
            <EditModeProvider>
              <AppRouter />
            </EditModeProvider>
          </AuthProvider>
        </CmsProvider>
      </I18nextProvider>
    </QueryClientProvider>
  );
}
