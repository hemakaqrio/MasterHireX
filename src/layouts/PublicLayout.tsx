import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/navigation/PublicNavbar';
import Footer from '../components/shared/Footer';

const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <PublicNavbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;