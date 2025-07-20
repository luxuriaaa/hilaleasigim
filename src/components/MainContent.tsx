import React, { useEffect, useRef, useState } from 'react';
import ContentSection from './ContentSection';
import PixelHeart from './PixelHeart';
import MemoryModal from './MemoryModal';
import { memories } from '../data/memories';

interface MainContentProps {
  isVisible: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ isVisible }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedMemory, setSelectedMemory] = useState<number | null>(null);



  useEffect(() => {
    if (isVisible && contentRef.current) {
      const elements = contentRef.current.querySelectorAll('.animate-on-scroll');
      
      // Use requestAnimationFrame for better performance
      let timeoutId: NodeJS.Timeout;
      elements.forEach((el, index) => {
        timeoutId = setTimeout(() => {
          requestAnimationFrame(() => {
            el.classList.add('animate-slide-up');
          });
        }, index * 150); // Reduced delay for faster loading
      });
      
      return () => clearTimeout(timeoutId);
    }
  }, [isVisible]);

  const openMemory = (memoryNumber: number) => {
    setSelectedMemory(memoryNumber);
  };

  const closeMemory = () => {
    setSelectedMemory(null);
  };
  return (
    <>
      <div
        ref={contentRef}
        className={`relative z-5 min-h-screen transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          }`}
        style={{
          background: 'linear-gradient(180deg, #FFE5F1 0%, #F8F4FF 30%, #FFF0F5 70%, #E6E6FA 100%)',
          paddingTop: '100vh',
        }}
      >
        <div className="container mx-auto px-6 py-20 max-w-4xl">
          {/* About Section */}
          <div className="animate-on-scroll opacity-0 mb-16">
            <ContentSection title="Hikayemiz" backgroundStyle="glass">
              <div className="space-y-6">
                <p className="text-pink-700 text-lg leading-relaxed font-light">
                  Burada her piksel bir aşk hikayesi anlatıyor.
                </p>
                <div className="flex items-center gap-4">
                  <PixelHeart size={32} />
                  <p className="text-pink-600 italic font-light">
                    "Gürültü dolu bir dünyada, duyduğum tek şey sensin."
                  </p>
                </div>
              </div>
            </ContentSection>
          </div>

          {/* Love Letter Section */}
          <div className="animate-on-scroll opacity-0 mb-16">
            <ContentSection title="Anılarımız" backgroundStyle="gradient">
              <div className="space-y-6">
                <p className="text-pink-800 text-lg leading-relaxed font-light italic">
                  "Sevgili ziyaretçim, çok değerli bir şeye rastladın.
                  Yıldız tozu gibi parıldayan anların koleksiyonu.
                  Buradaki her şey Aşk ile işlendi."
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/50 transition-all duration-300">
                    <h3 className="text-pink-700 font-medium mb-3">💗</h3>
                    <p className="text-pink-600 text-sm font-light">
                      Her piksel bir amaçla nefes alır. Her animasyon benim duygumu taşır.
                    </p>
                  </div>
                  <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/50 transition-all duration-300">
                    <h3 className="text-pink-700 font-medium mb-3">💞</h3>
                    <p className="text-pink-600 text-sm font-light">
                      Bu sayfadaki okuyacağın her metin kalbimle, en içten dürüstlükle, özenle yazıldı.
                    </p>
                  </div>
                </div>
              </div>
            </ContentSection>
          </div>

          {/* Memories Section */}
          <div className="animate-on-scroll opacity-0 mb-16">
            <ContentSection title="Değerli Anılar" backgroundStyle="solid">
              <p className="text-pink-700 text-center mb-8 font-light italic">
                "Kalbimde yaşayan hikayeleri açmak için her anıya tıkla..."
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="group cursor-pointer" onClick={() => openMemory(i)}>
                    <div className="relative rounded-2xl overflow-hidden h-64 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                      {/* Cover Image with lazy loading */}
                      <img
                        src={memories[i - 1].photos[0]}
                        alt={`Memory ${i} cover`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />

                      {/* Pink Filter */}
                      <div className="absolute inset-0 bg-pink-400/30 mix-blend-multiply"></div>

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="flex items-center gap-3 mb-2">
                          <PixelHeart size={24} className="text-pink-300 group-hover:animate-pulse" />
                          <p className="text-white font-medium text-lg">
                            {memories[i - 1].title}
                          </p>
                        </div>
                        <p className="text-pink-200 text-sm opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                          Keşfetmek için tıkla
                        </p>
                      </div>

                      {/* Hover effect */}
                      <div className="absolute inset-0 bg-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                ))}
              </div>
            </ContentSection>
          </div>

          {/* Contact Section */}
          <div className="animate-on-scroll opacity-0">
            <ContentSection title="Hikayemizi Yazalım" backgroundStyle="glass">
              <div className="text-center">
                <p className="text-pink-700 text-lg mb-8 font-light italic">
                  "Her güzel hikaye tek bir kelimeyle başlar, her aşk basit bir merhaba ile..."
                </p>
              </div>
            </ContentSection>
          </div>
        </div>

        {/* Signature */}
        <div className="text-center py-12">
          <div className="text-6xl text-pink-600 transform -rotate-2"
            style={{
              fontFamily: '"Style Script", cursive',
              fontWeight: 'normal',
              color: '#db2777',
              filter: 'contrast(1.3)'
            }}>
            ayparçam
          </div>
        </div>
      </div>

      {/* Memory Modal */}
      <MemoryModal
        isOpen={selectedMemory !== null}
        onClose={closeMemory}
        memoryNumber={selectedMemory || 1}
      />
    </>
  );
};

export default MainContent;