import { useState, useEffect } from 'react';
import HeroSection from './components/HeroSection';
import MainContent from './components/MainContent';
import FloatingParticles from './components/FloatingParticles';
import AudioPlayer from './components/AudioPlayer';
import SecurityManager from './utils/security';

function App() {
  const [showMainContent, setShowMainContent] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const security = SecurityManager.getInstance();

  useEffect(() => {
    // Güvenlik önlemlerini başlat
    security.startAntiDebug();
    
    // Sayfa yüklendiğinde session kontrolü
    if (security.isValidSession()) {
      setIsAuthenticated(true);
    }

    // Mobil cihazlarda mouse tracking'i devre dışı bırak
    const isMobile = window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMobile) {
        // Throttle mouse movement updates
        requestAnimationFrame(() => {
          setMousePosition({ x: e.clientX, y: e.clientY });
        });
      }
    };

    // Sayfa kapatılırken session temizle
    const handleBeforeUnload = () => {
      if (!isAuthenticated) {
        security.logout();
      }
    };

    // Visibility change - sekme değiştirildiğinde kontrol
    const handleVisibilityChange = () => {
      if (document.hidden && isAuthenticated) {
        // Sekme gizlendiğinde session süresini kontrol et
        setTimeout(() => {
          if (!security.isValidSession()) {
            setIsAuthenticated(false);
            setShowMainContent(false);
          }
        }, 100);
      }
    };

    if (!isMobile) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      if (!isMobile) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, security]);

  const handleScrollTrigger = () => {
    // Scroll trigger'dan önce session kontrolü
    if (security.isValidSession()) {
      setShowMainContent(true);
    } else {
      setIsAuthenticated(false);
      setShowMainContent(false);
    }
  };

  const handleAuthentication = (success: boolean) => {
    setIsAuthenticated(success);
  };

  return (
    <div className={`relative min-h-screen overflow-x-hidden ${!isAuthenticated ? 'overflow-y-hidden' : ''}`}>
      {/* Background Particles */}
      <FloatingParticles mouseX={mousePosition.x} mouseY={mousePosition.y} isVisible={!showMainContent} />
      
      {/* Audio Player */}
      <AudioPlayer />
      
      {/* Hero Section */}
      <HeroSection 
        onScrollTrigger={handleScrollTrigger} 
        onAuthentication={handleAuthentication}
        isAuthenticated={isAuthenticated}
      />
      
      {/* Main Content */}
      <MainContent isVisible={showMainContent} />
    </div>
  );
}

export default App;