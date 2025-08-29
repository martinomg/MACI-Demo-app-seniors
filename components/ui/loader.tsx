import React from 'react';
import { Icon } from '@iconify/react';
import './loader.css';

export interface LoaderProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
  text?: string;
  className?: string;
  size?: number;
}

const Loader: React.FC<LoaderProps> = ({ 
  variant = 'spinner', 
  text,
  className = '',
  size = 32
}) => {
  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return (
          <Icon 
            icon="eos-icons:three-dots-loading" 
            width={size} 
            height={size}
            className="text-primary animate-pulse"
          />
        );
      case 'pulse':
        return (
          <Icon 
            icon="svg-spinners:pulse-3" 
            width={size} 
            height={size}
            className="text-primary"
          />
        );
      case 'bars':
        return (
          <Icon 
            icon="svg-spinners:bars-scale-fade" 
            width={size} 
            height={size}
            className="text-primary"
          />
        );
      case 'spinner':
      default:
        return (
          <Icon 
            icon="svg-spinners:90-ring-with-bg" 
            width={size} 
            height={size}
            className="text-primary"
          />
        );
    }
  };

  return (
    <div className={`loader-container ${className}`.trim()}>
      {renderLoader()}
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export { Loader };