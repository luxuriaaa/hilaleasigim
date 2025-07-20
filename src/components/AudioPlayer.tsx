import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set volume to maximum
    audio.volume = 1.0;

    // Handle audio events
    const handleCanPlay = () => {
      setIsLoaded(true);
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

    const handleError = () => {
      console.log('Audio loading error');
      setIsLoaded(false);
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    if (isPlaying) {
      audio.play().catch((error) => {
        console.log('Play failed:', error);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, isLoaded]);



  // Otomatik müzik başlatma - sayfa yüklendiğinde
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    const startMusic = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        console.log('Music started successfully');
      } catch (error) {
        console.log('Autoplay failed, waiting for user interaction');
      }
    };

    startMusic();
  }, [isLoaded]);

  // Kullanıcı etkileşimi ile müzik başlatma (tıklama, tuş basma, scroll)
  useEffect(() => {
    const handleUserInteraction = async () => {
      const audio = audioRef.current;
      if (!audio || !isLoaded || !audio.paused) return;

      try {
        await audio.play();
        setIsPlaying(true);
        console.log('Music started after user interaction');
        
        // Event listener'ları kaldır
        removeAllListeners();
      } catch (error) {
        console.log('Failed to start music after user interaction:', error);
      }
    };

    const removeAllListeners = () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
      window.removeEventListener('scroll', handleUserInteraction);
    };

    // Tüm kullanıcı etkileşimi event listener'larını ekle
    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('scroll', handleUserInteraction);
    window.addEventListener('scroll', handleUserInteraction);

    return removeAllListeners;
  }, [isLoaded]);

  const togglePlayPause = () => {
    if (!isLoaded) return;
    setIsPlaying(!isPlaying);
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
      {!isLoaded && (
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

      {/* Music status indicator */}
      {isLoaded && !isPlaying && (
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