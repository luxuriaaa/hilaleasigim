import React, { useEffect, useState } from 'react';
import PixelHeart from './PixelHeart';
import SecurityManager from '../utils/security';

interface HeroSectionProps {
  onScrollTrigger: () => void;
  onAuthentication: (success: boolean) => void;
  isAuthenticated: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onScrollTrigger, onAuthentication, isAuthenticated }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [password, setPassword] = useState('');
  const [showPasswordInput, setShowPasswordInput] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0);
  const security = SecurityManager.getInstance();

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!isAuthenticated) return; // Scroll sadece authenticated olduğunda çalışır
      
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY > 50) {
            setIsVisible(false);
            onScrollTrigger();
          } else if (scrollY <= 50) {
            setIsVisible(true);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [onScrollTrigger, isAuthenticated]);

  // Lock timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLocked && lockTimeRemaining > 0) {
      interval = setInterval(() => {
        setLockTimeRemaining(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            setErrorMessage('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockTimeRemaining]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      return;
    }

    const result = security.authenticate(password);
    
    if (result.success) {
      onAuthentication(true);
      setShowPasswordInput(false);
      setErrorMessage('');
      setPassword('');
    } else {
      setPassword('');
      setErrorMessage(result.message);
      
      if (result.lockTime) {
        setIsLocked(true);
        setLockTimeRemaining(result.lockTime);
      }
      
      // Error mesajını 3 saniye sonra temizle (eğer lock yoksa)
      if (!result.lockTime) {
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      }
    }
  };

  return (
    <div
      className={`fixed inset-0 z-10 flex items-center justify-center transition-all duration-1000 ${
        isVisible 
          ? 'opacity-100 scale-100' 
          : 'opacity-0 scale-110 pointer-events-none'
      }`}
      style={{
        background: 'linear-gradient(135deg, #FFE5F1 0%, #FFB6C1 30%, #FFC0CB 60%, #E6E6FA 100%)',
      }}
    >
      {/* Romantic glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-pink-200/30 via-transparent to-transparent"></div>
      
      <div className="text-center">
        <div className="mb-8 relative">
          <PixelHeart 
            size={240} 
            className="mx-auto drop-shadow-2xl hover:scale-105 transition-transform duration-700"
            animated={true}
            animationDelay={500}
          />
          {/* Enhanced glow layers with stronger contrast */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-80 h-80 bg-gradient-to-r from-red-400/40 to-pink-400/40 rounded-full blur-3xl animate-pulse"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-64 bg-gradient-to-r from-red-500/30 to-pink-500/30 rounded-full blur-2xl animate-pulse" style={{animationDelay: '0.3s'}}></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 bg-gradient-to-r from-red-600/25 to-pink-600/25 rounded-full blur-xl animate-pulse" style={{animationDelay: '0.6s'}}></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-32 bg-gradient-to-r from-red-700/20 to-pink-700/20 rounded-full blur-lg animate-pulse" style={{animationDelay: '0.9s'}}></div>
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-light text-pink-800 mb-4 tracking-wide animate-fade-in">
          Hoş Geldin
        </h1>
        
        {!isAuthenticated && showPasswordInput ? (
          <div className="animate-fade-in-delay">
            <p className="text-pink-600 text-lg md:text-xl font-light opacity-80 mb-8">
              Kalbimi açmak için gizli anahtarı gir
            </p>
            <form onSubmit={handlePasswordSubmit} className="max-w-sm mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isLocked ? "Kilitli..." : "Gizli anahtar..."}
                  disabled={isLocked}
                  className={`w-full px-6 py-3 rounded-full border-2 bg-white/80 backdrop-blur-sm text-pink-800 placeholder-pink-400 focus:outline-none transition-all duration-300 text-center font-light ${
                    isLocked 
                      ? 'border-red-300 bg-red-50/80 cursor-not-allowed' 
                      : errorMessage 
                        ? 'border-red-400 focus:border-red-500' 
                        : 'border-pink-300 focus:border-pink-500 focus:bg-white/90'
                  }`}
                  autoFocus={!isLocked}
                />
              </div>
              
              {/* Error/Lock Message */}
              {(errorMessage || isLocked) && (
                <div className={`mt-3 text-sm font-medium ${isLocked ? 'text-red-600' : 'text-red-500'}`}>
                  {isLocked ? (
                    <div className="flex items-center justify-center gap-2">
                      <span>🔒</span>
                      <span>{lockTimeRemaining} saniye kilitli</span>
                    </div>
                  ) : (
                    errorMessage
                  )}
                </div>
              )}
              
              <button
                type="submit"
                disabled={isLocked}
                className={`mt-4 px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-lg ${
                  isLocked
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-pink-400 to-pink-500 text-white hover:from-pink-500 hover:to-pink-600 hover:scale-105 hover:shadow-xl'
                }`}
              >
                {isLocked ? 'Kilitli' : 'Aç'}
              </button>
            </form>
          </div>
        ) : isAuthenticated ? (
          <div className="animate-fade-in-delay">
            <p className="text-pink-600 text-lg md:text-xl font-light opacity-80 animate-fade-in-delay">
              Kalbime girmek için kaydır
            </p>
            <div className="mt-12 animate-bounce">
              <div className="w-6 h-10 border-2 border-pink-400 rounded-full mx-auto">
                <div className="w-1 h-3 bg-pink-400 rounded-full mx-auto mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default HeroSection;