import React, { useEffect, useState } from 'react';

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

  // Initialize particles
  useEffect(() => {
    const colors = ['#FF69B4', '#FF1493', '#FFB6C1', '#FFC0CB', '#DA70D6'];
    
    const newParticles: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 24 + 12,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      opacity: Math.random() * 0.6 + 0.4,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));

    setParticles(newParticles);
  }, []);

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
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

          // Mouse interaction
          const mouseDistance = Math.sqrt(
            Math.pow(mouseX - newX, 2) + Math.pow(mouseY - newY, 2)
          );
          
          if (mouseDistance < 100) {
            const force = (100 - mouseDistance) / 100;
            const angle = Math.atan2(newY - mouseY, newX - mouseX);
            newX += Math.cos(angle) * force * 2;
            newY += Math.sin(angle) * force * 2;
          }

          return {
            ...particle,
            x: newX,
            y: newY
          };
        })
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, [mouseX, mouseY]);

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