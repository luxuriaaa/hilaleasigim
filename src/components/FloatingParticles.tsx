import React, { useEffect, useState, useCallback, useMemo } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

interface FloatingParticlesProps {
  mouseX: number;
  mouseY: number;
  isVisible: boolean;
}

const FloatingParticles: React.FC<FloatingParticlesProps> = ({ mouseX, mouseY, isVisible }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Memoize colors array
  const colors = useMemo(() => ['#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB', '#DA70D6'], []);

  // Initialize particles with reduced count for mobile
  useEffect(() => {
    const particleCount = isMobile ? 8 : 15; // Reduced from 30
    
    const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * (isMobile ? 16 : 20) + 8, // Smaller on mobile
      speedX: (Math.random() - 0.5) * (isMobile ? 1 : 1.5),
      speedY: (Math.random() - 0.5) * (isMobile ? 1 : 1.5),
      opacity: Math.random() * 0.4 + 0.3, // Reduced opacity
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    setParticles(newParticles);
  }, [isMobile, colors]);

  // Optimized animation with requestAnimationFrame
  const animateParticles = useCallback(() => {
    setParticles(prevParticles => 
      prevParticles.map(particle => {
        let newX = particle.x + particle.speedX;
        let newY = particle.y + particle.speedY;

        // Bounce off edges
        if (newX <= 0 || newX >= window.innerWidth) {
          particle.speedX *= -1;
          newX = Math.max(0, Math.min(window.innerWidth, newX));
        }
        if (newY <= 0 || newY >= window.innerHeight) {
          particle.speedY *= -1;
          newY = Math.max(0, Math.min(window.innerHeight, newY));
        }

        // Reduced mouse interaction for mobile
        if (!isMobile) {
          const mouseDistance = Math.sqrt(
            Math.pow(mouseX - newX, 2) + Math.pow(mouseY - newY, 2)
          );
          
          if (mouseDistance < 80) {
            const force = (80 - mouseDistance) / 80;
            const angle = Math.atan2(newY - mouseY, newX - mouseX);
            newX += Math.cos(angle) * force * 1.5;
            newY += Math.sin(angle) * force * 1.5;
          }
        }

        return {
          ...particle,
          x: newX,
          y: newY
        };
      })
    );
  }, [mouseX, mouseY, isMobile]);

  useEffect(() => {
    if (!isVisible) return;
    
    let animationId: number;
    let lastTime = 0;
    const targetFPS = isMobile ? 30 : 60; // Lower FPS on mobile
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        animateParticles();
        lastTime = currentTime;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [animateParticles, isVisible, isMobile]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute transition-all duration-75 ease-linear"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Simple heart using Unicode character */}
          <div
            className="animate-pulse select-none"
            style={{
              fontSize: `${particle.size}px`,
              opacity: particle.opacity,
              color: particle.color,
              textShadow: 'none',
            }}
          >
            ♥
          </div>
        </div>
      ))}
    </div>
  );
};

export default FloatingParticles;