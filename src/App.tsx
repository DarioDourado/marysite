/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { I18nextProvider } from 'react-i18next';
import i18n from './lib/i18n.ts';
import { AppRouter } from './routes/index.tsx';

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <AppRouter />
    </I18nextProvider>
  );
}
