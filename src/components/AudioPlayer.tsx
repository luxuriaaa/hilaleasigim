import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set volume to maximum
    audio.volume = 1.0;

    // Handle audio events
    const handleLoadStart = () => {
      setIsLoading(true);
      setHasError(false);
    };

    const handleCanPlay = () => {
      setIsLoaded(true);
      setIsLoading(false);
      setHasError(false);
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleError = (e: Event) => {
      console.error('Audio loading error:', e);
      setIsLoaded(false);
      setIsLoading(false);
      setHasError(true);
    };

    const handleLoadedData = () => {
      setIsLoaded(true);
      setIsLoading(false);
    };

    // Add event listeners
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Start loading
    audio.load();

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  // Otomatik müzik başlatma - sadece yüklendikten sonra
  useEffect(() => {
    if (!isLoaded) return;

    const audio = audioRef.current;
    if (!audio) return;

    const startMusic = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.log('Autoplay failed, waiting for user interaction');
        // Autoplay failed, will wait for user interaction
      }
    };

    // Küçük bir gecikme ile başlat
    const timer = setTimeout(startMusic, 100);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  // Kullanıcı etkileşimi ile müzik başlatma
  useEffect(() => {
    if (!isLoaded || isPlaying) return;

    const handleUserInteraction = async () => {
      const audio = audioRef.current;
      if (!audio || !audio.paused) return;

      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error('Failed to start music on user interaction:', error);
      }
    };

    // Event listener'ları ekle
    document.addEventListener('click', handleUserInteraction, { once: true, passive: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true, passive: true });

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [isLoaded, isPlaying]);

  const togglePlayPause = async () => {
    if (!isLoaded || hasError) return;
    
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Toggle play/pause failed:', error);
      setIsPlaying(false);
    }
  };



  return (
    <div className="fixed top-6 right-6 z-50">
      {/* Main Audio Player Container */}
      <div className="flex items-center gap-3">
        {/* Song Info - Only show when playing */}
        {isPlaying && isLoaded && (
          <div className="hidden md:flex items-center gap-3 bg-white/20 backdrop-blur-lg border border-white/30 rounded-full px-4 py-2 animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-pink-700 font-medium">Şimdi Çalıyor</span>
            </div>
          </div>
        )}

        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          disabled={!isLoaded}
          className={`bg-gradient-to-r from-pink-400 to-rose-400 backdrop-blur-lg border border-white/30 rounded-full p-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 ${
            isLoaded 
              ? 'text-white hover:from-pink-500 hover:to-rose-500 cursor-pointer' 
              : 'text-gray-400 cursor-not-allowed opacity-50'
          }`}
          title={isLoaded ? (isPlaying ? 'Müziği Duraklat' : 'Müziği Çal') : 'Yükleniyor...'}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
      </div>
      
      {/* Audio Element */}
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="/song.flac"
      />

      {/* Loading Indicator */}
      {isLoading && !hasError && (
        <div className="absolute top-full right-0 mt-2 bg-white/90 backdrop-blur-lg border border-pink-200 rounded-lg px-3 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-pink-400 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-1 h-1 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
            <span className="text-xs text-pink-700 font-medium">Müzik yükleniyor...</span>
          </div>
        </div>
      )}

      {/* Error Indicator */}
      {hasError && (
        <div className="absolute top-full right-0 mt-2 bg-red-100 backdrop-blur-lg border border-red-200 rounded-lg px-3 py-2 shadow-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            <span className="text-xs text-red-700 font-medium">Müzik yüklenemedi</span>
          </div>
        </div>
      )}

      {/* Music status indicator */}
      {isLoaded && !isPlaying && !hasError && (
        <div className="absolute top-full right-0 mt-2 bg-gradient-to-r from-pink-100 to-rose-100 backdrop-blur-lg border border-pink-200 rounded-lg px-3 py-2 shadow-lg animate-pulse">
          <div className="flex items-center gap-2">
            <Play size={12} className="text-pink-600" />
            <span className="text-xs text-pink-700 font-medium">Müzik duraklatıldı</span>
          </div>
        </div>
      )}


    </div>
  );
};

export default AudioPlayer;