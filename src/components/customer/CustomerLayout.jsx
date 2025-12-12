import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { SiteBanner } from '../common';
import { useBakery } from '../../context/BakeryContext';
import './CustomerLayout.css';

const CustomerLayout = () => {
  const { activeBanners } = useBakery();

  return (
    <div className="customer-layout">
      {activeBanners.map((banner) => (
        <SiteBanner
          key={banner.id}
          id={banner.id}
          title={banner.title}
          message={banner.message}
          type={banner.type}
          dismissible={banner.dismissible}
          link={banner.link}
          linkText={banner.linkText}
        />
      ))}
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default CustomerLayout;
