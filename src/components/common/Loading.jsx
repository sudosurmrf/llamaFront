import { Loader2 } from 'lucide-react';
import './Loading.css';

const Loading = ({
  size = 'medium',
  text = 'Loading...',
  fullScreen = false,
  className = '',
}) => {
  const sizeMap = {
    small: 24,
    medium: 40,
    large: 56,
  };

  if (fullScreen) {
    return (
      <div className="loading-fullscreen">
        <div className="loading-content">
          <Loader2 className="loading-spinner" size={sizeMap[size]} />
          {text && <span className="loading-text">{text}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className={`loading loading-${size} ${className}`}>
      <Loader2 className="loading-spinner" size={sizeMap[size]} />
      {text && <span className="loading-text">{text}</span>}
    </div>
  );
};

export default Loading;
