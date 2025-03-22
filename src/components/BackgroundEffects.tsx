import React, { useEffect, useRef } from 'react';
import '../styles/BackgroundEffects.css';

const BackgroundEffects: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Create particles
    const particles: Particle[] = [];
    const particleCount = 20; // Further reduced for better performance

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      fadeDirection: number;
      fadeSpeed: number;
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5, // Smaller particles
        speedX: (Math.random() - 0.5) * 0.2, // Even slower movement
        speedY: (Math.random() - 0.5) * 0.2, // Even slower movement
        opacity: Math.random() * 0.15, // More transparent
        fadeDirection: Math.random() > 0.5 ? 1 : -1,
        fadeSpeed: Math.random() * 0.002, // Slower fading
      });
    }

    // Animate with a lower frame rate for better performance
    let animationFrameId: number;
    let lastDrawTime = 0;
    const fpsInterval = 1000 / 30; // Limit to 30 FPS

    const draw = (timestamp: number) => {
      const elapsed = timestamp - lastDrawTime;

      if (elapsed > fpsInterval) {
        lastDrawTime = timestamp - (elapsed % fpsInterval);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw dust particles
        particles.forEach((p) => {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(180, 160, 140, ${p.opacity})`;
          ctx.fill();
          
          // Move particles
          p.x += p.speedX;
          p.y += p.speedY;
          
          // Fade in and out
          p.opacity += p.fadeDirection * p.fadeSpeed;
          
          // Reverse fade direction at opacity limits
          if (p.opacity >= 0.15 || p.opacity <= 0.05) {
            p.fadeDirection *= -1;
          }
          
          // Wrap around the screen
          if (p.x < 0) p.x = canvas.width;
          if (p.x > canvas.width) p.x = 0;
          if (p.y < 0) p.y = canvas.height;
          if (p.y > canvas.height) p.y = 0;
        });
        
        // Very rare, subtle flashes - reduced frequency
        if (Math.random() > 0.999) {
          ctx.fillStyle = `rgba(255, 0, 0, ${Math.random() * 0.008})`;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    animationFrameId = requestAnimationFrame(draw);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="background-effects">
      <canvas ref={canvasRef} className="effects-canvas"></canvas>
      <div className="noise-overlay"></div>
    </div>
  );
};

export default BackgroundEffects; 