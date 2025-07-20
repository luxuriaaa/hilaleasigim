import React from 'react';

interface ContentSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  backgroundStyle?: 'glass' | 'gradient' | 'solid';
}

const ContentSection: React.FC<ContentSectionProps> = ({ 
  title, 
  children, 
  className = '',
  backgroundStyle = 'glass'
}) => {
  const getBackgroundClass = () => {
    switch (backgroundStyle) {
      case 'glass':
        return 'bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl';
      case 'gradient':
        return 'bg-gradient-to-br from-pink-100/80 to-lavender-100/80 shadow-lg';
      case 'solid':
        return 'bg-white/90 shadow-lg';
      default:
        return 'bg-white/20 backdrop-blur-lg border border-white/30 shadow-xl';
    }
  };

  return (
    <div className={`relative z-40 p-8 md:p-12 rounded-3xl ${getBackgroundClass()} ${className}`}>
      <h2 className="text-3xl md:text-4xl font-light text-pink-800 mb-6 tracking-wide">
        {title}
      </h2>
      {children}
    </div>
  );
};

export default ContentSection;