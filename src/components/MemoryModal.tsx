import React, { useState, useEffect } from 'react';
import { X, Heart, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import PixelHeart from './PixelHeart';
import { memories } from '../data/memories';

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  memoryNumber: number;
}

const MemoryModal: React.FC<MemoryModalProps> = ({ isOpen, onClose, memoryNumber }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [imageAspectRatio, setImageAspectRatio] = useState<number>(16 / 9);



  const currentMemory = memories[memoryNumber - 1];

  // Minimum swipe distance
  const minSwipeDistance = 50;

  // Auto-play functionality with animation
  useEffect(() => {
    if (!isAutoPlay || !currentMemory.photos) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPhotoIndex((prev) =>
          prev === currentMemory.photos.length - 1 ? 0 : prev + 1
        );
        setIsTransitioning(false);
      }, 150);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, currentMemory.photos]);

  // Reset photo index when memory changes
  useEffect(() => {
    setCurrentPhotoIndex(0);
  }, [memoryNumber]);

  // Handle image load to get aspect ratio
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    setImageAspectRatio(aspectRatio);
  };

  const nextPhoto = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPhotoIndex((prev) =>
        prev === currentMemory.photos.length - 1 ? 0 : prev + 1
      );
      setIsTransitioning(false);
    }, 150);
  };

  const prevPhoto = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPhotoIndex((prev) =>
        prev === 0 ? currentMemory.photos.length - 1 : prev - 1
      );
      setIsTransitioning(false);
    }, 150);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlay(!isAutoPlay);
  };

  // Touch handlers for mobile swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextPhoto();
    } else if (isRightSwipe) {
      prevPhoto();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 animate-scale-in overflow-hidden">
      {/* Romantic background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating hearts */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <Heart size={16 + Math.random() * 24} className="text-pink-400" />
          </div>
        ))}

        {/* Soft light orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Close button - fixed position */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-60 p-3 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 border border-pink-200"
      >
        <X size={20} className="text-rose-600" />
      </button>

      {/* Scrollable content */}
      <div className="h-full overflow-y-auto overflow-x-hidden">
        <div className="min-h-screen flex flex-col items-center justify-center p-6 py-20">
          <div className="max-w-4xl w-full text-center space-y-12">
            {/* Large heart with romantic glow */}
            <div className="relative mb-16">
              <div className="relative z-10">
                <PixelHeart size={180} className="mx-auto animate-pulse drop-shadow-2xl text-rose-500" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 bg-gradient-to-r from-pink-300/40 to-rose-300/40 rounded-full blur-3xl animate-pulse"></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 bg-gradient-to-r from-rose-400/30 to-pink-400/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>

            {/* Title with romantic styling */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-transparent bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text mb-6 tracking-wide animate-fade-in leading-tight">
                {currentMemory.title}
              </h1>

              <div className="flex items-center justify-center space-x-4">
                <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent flex-1 max-w-32"></div>
                <Heart size={16} className="text-rose-400 animate-pulse" />
                <div className="h-px bg-gradient-to-r from-transparent via-pink-300 to-transparent flex-1 max-w-32"></div>
              </div>

              <p className="text-rose-500 text-lg md:text-xl italic animate-fade-in-delay font-medium">
                {currentMemory.date}
              </p>
            </div>

            {/* Instagram-style Photo Gallery */}
            <div className="mb-16 rounded-3xl overflow-hidden shadow-2xl max-w-4xl mx-auto relative">
              <div
                className="relative w-full bg-gradient-to-br from-rose-100 via-pink-100 to-purple-100 transition-all duration-500"
                style={{ aspectRatio: imageAspectRatio }}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {/* Photo Container with Animation */}
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={currentMemory.photos[currentPhotoIndex]}
                    alt={`${currentMemory.title} - Photo ${currentPhotoIndex + 1}`}
                    onLoad={handleImageLoad}
                    className={`w-full h-full object-cover transition-all duration-500 ${isTransitioning
                      ? 'opacity-0 scale-110 blur-sm'
                      : 'opacity-100 scale-100 blur-0'
                      }`}
                  />

                  {/* Transition overlay for smooth effect */}
                  {isTransitioning && (
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-200/50 via-rose-200/50 to-purple-200/50 animate-pulse"></div>
                  )}
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>

                {/* Navigation Arrows - Hidden on mobile */}
                <button
                  onClick={prevPhoto}
                  className="hidden md:flex absolute left-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 items-center justify-center"
                >
                  <ChevronLeft size={20} className="text-rose-600" />
                </button>

                <button
                  onClick={nextPhoto}
                  className="hidden md:flex absolute right-4 top-1/2 transform -translate-y-1/2 p-3 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110 items-center justify-center"
                >
                  <ChevronRight size={20} className="text-rose-600" />
                </button>

                {/* Mobile Swipe Indicator */}

                {/* Auto-play Control */}
                <button
                  onClick={toggleAutoPlay}
                  className="absolute top-4 left-4 p-3 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-110"
                >
                  {isAutoPlay ? (
                    <Pause size={16} className="text-rose-600" />
                  ) : (
                    <Play size={16} className="text-rose-600" />
                  )}
                </button>

                {/* Photo Counter */}
                <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm font-medium">
                  {currentPhotoIndex + 1} / {currentMemory.photos.length}
                </div>

                {/* Photo Indicators with Animation */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                  {currentMemory.photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (index !== currentPhotoIndex) {
                          setIsTransitioning(true);
                          setTimeout(() => {
                            setCurrentPhotoIndex(index);
                            setIsTransitioning(false);
                          }, 150);
                        }
                      }}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentPhotoIndex
                        ? 'bg-white shadow-lg scale-125'
                        : 'bg-white/50 hover:bg-white/80'
                        }`}
                    />
                  ))}
                </div>

                {/* Memory Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="flex items-center gap-3">
                    <PixelHeart size={32} className="text-pink-300 animate-pulse" />
                    <div>
                    </div>
                  </div>
                </div>

                {/* Progress Bar for Auto-play */}
                {isAutoPlay && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                    <div
                      className="h-full bg-gradient-to-r from-pink-400 to-rose-400 transition-all duration-75 ease-linear"
                      style={{
                        width: isTransitioning ? '100%' : '0%',
                        animation: isTransitioning ? 'none' : 'progress 5s linear infinite'
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>

            {/* Memory text with elegant styling */}
            <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-pink-100">
              <div className="relative">
                <div className="absolute -top-4 -left-4 text-6xl text-rose-300 font-serif">"</div>
                <div className="absolute -bottom-8 -right-4 text-6xl text-rose-300 font-serif">"</div>
                <p className="text-rose-700 text-xl md:text-2xl lg:text-3xl leading-relaxed font-light italic animate-fade-in-delay text-center px-8">
                  {currentMemory.text}
                </p>
              </div>
            </div>

            {/* Decorative hearts with romantic animation */}
            <div className="flex justify-center mt-20 space-x-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="relative">
                  <div style={{ animationDelay: `${i * 0.3}s` }}>
                    <PixelHeart
                      size={40}
                      className="animate-pulse hover:scale-125 transition-transform duration-300 text-rose-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-rose-300/20 rounded-full blur-lg animate-pulse" style={{ animationDelay: `${i * 0.3}s` }}></div>
                </div>
              ))}
            </div>

            {/* Bottom spacing for scroll */}
            <div className="h-20"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryModal;