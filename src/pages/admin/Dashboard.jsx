import { Link } from 'react-router-dom';
import {
  Package,
  FolderTree,
  Tag,
  Megaphone,
  TrendingUp,
  Eye,
  DollarSign,
  ShoppingBag,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { Button } from '../../components/common';
import { useBakery } from '../../context/BakeryContext';
import './Dashboard.css';

const Dashboard = () => {
  const { products, categories, activeSpecials, activePromotions } = useBakery();

  // Calculate statistics
  const stats = [
    {
      label: 'Total Products',
      value: products.length,
      icon: Package,
      color: '#5c3d2e',
      change: '+12%',
      changeType: 'positive',
    },
    {
      label: 'Categories',
      value: categories.length,
      icon: FolderTree,
      color: '#7a5240',
      change: null,
    },
    {
      label: 'Active Specials',
      value: activeSpecials.length,
      icon: Tag,
      color: '#dc2626',
      change: '3 expiring soon',
      changeType: 'warning',
    },
    {
      label: 'Promotions',
      value: activePromotions.length,
      icon: Megaphone,
      color: '#16a34a',
      change: '+2 this month',
      changeType: 'positive',
    },
  ];

  const quickActions = [
    { label: 'Add Product', path: '/admin/products/new', icon: Package },
    { label: 'New Category', path: '/admin/categories/new', icon: FolderTree },
    { label: 'Create Special', path: '/admin/specials/new', icon: Tag },
    { label: 'Add Promotion', path: '/admin/promotions/new', icon: Megaphone },
  ];

  const recentProducts = products.slice(0, 5);
console.log('product here', recentProducts)
  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening with your bakery.</p>
        </div>
        <Button icon={Plus}>
          <Link to="/admin/products/new" style={{ color: 'inherit', textDecoration: 'none' }}>
            Add Product
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
              {stat.change && (
                <span className={`stat-change ${stat.changeType}`}>
                  {stat.change}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <section className="quick-actions-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.path} className="quick-action-card">
              <div className="action-icon">
                <action.icon size={24} />
              </div>
              <span>{action.label}</span>
              <ArrowRight size={18} className="action-arrow" />
            </Link>
          ))}
        </div>
      </section>

      <div className="dashboard-grid">
        {/* Recent Products */}
        <section className="recent-section">
          <div className="section-header">
            <h2 className="section-title">Recent Products</h2>
            <Link to="/admin/products" className="view-all-link">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="recent-list">
            {recentProducts.map((product) => (
              <div key={product.id} className="recent-item">
                <div className="item-image">
                  {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} />
                  ) : (
                    <div className="image-placeholder">
                      <ShoppingBag size={20} />
                    </div>
                  )}
                </div>
                <div className="item-info">
                  <span className="item-name">{product.name}</span>
                  <span className="item-category">
                    {categories.find(c => c.id === product.categoryId)?.name || 'Uncategorized'}
                  </span>
                </div>
                {product.price = Number(product.price)}
                <span className="item-price">${product.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Active Promotions */}
        <section className="promotions-section">
          <div className="section-header">
            <h2 className="section-title">Active Promotions</h2>
            <Link to="/admin/promotions" className="view-all-link">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="promo-list">
            {activePromotions.length > 0 ? (
              activePromotions.slice(0, 3).map((promo) => (
                <div key={promo.id} className="promo-item">
                  <div
                    className="promo-color"
                    style={{ backgroundColor: promo.backgroundColor || '#f8e8d4' }}
                  />
                  <div className="promo-info">
                    <span className="promo-name">{promo.name}</span>
                    <span className="promo-title">{promo.title}</span>
                  </div>
                  <span className={`promo-status ${promo.active ? 'active' : ''}`}>
                    {promo.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <Megaphone size={32} />
                <p>No active promotions</p>
                <Link to="/admin/promotions/new">Create one</Link>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Activity Overview */}
      <section className="activity-section">
        <h2 className="section-title">Activity Overview</h2>
        <div className="activity-placeholder">
          <TrendingUp size={48} />
          <p>Analytics dashboard coming soon</p>
          <span>Track your bakery's performance with detailed charts and insights</span>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
