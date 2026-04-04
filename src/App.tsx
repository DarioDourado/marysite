/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Navbar } from './components/layout/Navbar.tsx';
import { Home } from './pages/Home/Home.tsx';
import { Footer } from './components/layout/Footer.tsx';
import { I18nextProvider } from 'react-i18next';
import i18n from './lib/i18n.ts';

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary-dark">
        <Navbar />
        <main>
          <Home />
        </main>
        <Footer />
      </div>
    </I18nextProvider>
  );
}

