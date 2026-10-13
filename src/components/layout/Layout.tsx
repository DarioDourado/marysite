import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.tsx';
import { Footer } from './Footer.tsx';
import { ScrollManager } from './ScrollManager.tsx';

export const Layout = () => (
  <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary-dark">
    <ScrollManager />
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
  </div>
);
