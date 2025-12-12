import { useState } from 'react';
import { X, Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import './SiteBanner.css';

const SiteBanner = ({
  id,
  title,
  message,
  type = 'info',
  dismissible = true,
  link,
  linkText = 'Learn More',
  onDismiss,
  className = '',
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const iconMap = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle,
    error: AlertCircle,
  };

  const Icon = iconMap[type] || Info;

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.(id);
    // Store in localStorage to remember dismissed banners
    if (id) {
      const dismissed = JSON.parse(localStorage.getItem('dismissedBanners') || '[]');
      localStorage.setItem('dismissedBanners', JSON.stringify([...dismissed, id]));
    }
  };

  if (isDismissed) return null;

  return (
    <div className={`site-banner site-banner-${type} ${className}`}>
      <div className="site-banner-content">
        <Icon className="site-banner-icon" size={20} />
        <div className="site-banner-text">
          {title && <strong>{title}</strong>}
          {title && message && ' - '}
          {message}
          {link && (
            <a href={link} className="site-banner-link">
              {linkText}
            </a>
          )}
        </div>
      </div>
      {dismissible && (
        <button
          className="site-banner-dismiss"
          onClick={handleDismiss}
          aria-label="Dismiss banner"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default SiteBanner;
