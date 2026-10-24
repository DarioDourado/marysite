import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar.tsx';
import { Footer } from './Footer.tsx';
import { ScrollManager } from './ScrollManager.tsx';
import { WhatsAppFloat } from '@/src/components/ui/WhatsAppFloat.tsx';
import { AttrDrawer } from '@/src/components/cms/AttrDrawer.tsx';
import { EditToolbar } from '@/src/components/cms/EditToolbar.tsx';

export const Layout = () => (
  <div className="min-h-screen bg-background selection:bg-primary/20 selection:text-primary-dark">
    <ScrollManager />
    <Navbar />
    <main>
      <Outlet />
    </main>
    <Footer />
    <WhatsAppFloat />
    <EditToolbar />
    <AttrDrawer />
  </div>
);
