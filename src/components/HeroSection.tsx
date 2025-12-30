import { useEffect, useRef, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  color: string;
  opacity: number;
  vx: number;
  vy: number;
  angle: number;
  speed: number;
  wobbleSpeed: number;
  wobbleAmplitude: number;
}

const COLORS = [
  "rgba(94, 200, 200, 1)",   // teal
  "rgba(255, 127, 102, 1)",  // coral
  "rgba(240, 195, 80, 1)",   // mustard
  "rgba(100, 149, 237, 1)",  // blue
  "rgba(255, 150, 180, 1)",  // pink
];

export const HeroSection = ({ onStart }: { onStart?: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const [isMobile, setIsMobile] = useState(false);

  const createParticles = useCallback((width: number, height: number) => {
    const particleCount = isMobile ? 60 : 120;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.2 + Math.random() * 0.4;

      particles.push({
        x,
        y,
        baseX: x,
        baseY: y,
        size: 2 + Math.random() * 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: 0.3 + Math.random() * 0.5,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        angle,
        speed,
        wobbleSpeed: 0.01 + Math.random() * 0.02,
        wobbleAmplitude: 20 + Math.random() * 40,
      });
    }

    return particles;
  }, [isMobile]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || "ontouchstart" in window);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      particlesRef.current = createParticles(window.innerWidth, window.innerHeight);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let time = 0;

    const animate = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#1f2233");
      gradient.addColorStop(1, "#2a2d44");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      time += 0.01;

      particlesRef.current.forEach((particle) => {
        // Natural diagonal drift with wobble
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Add subtle wobble for organic motion
        const wobbleX = Math.sin(time * particle.wobbleSpeed * 10 + particle.angle) * 0.3;
        const wobbleY = Math.cos(time * particle.wobbleSpeed * 10 + particle.angle) * 0.3;
        particle.x += wobbleX;
        particle.y += wobbleY;

        // Mouse repulsion (only on desktop)
        if (!isMobile) {
          const dx = particle.x - mouseRef.current.x;
          const dy = particle.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 150;

          if (distance < maxDistance && distance > 0) {
            const force = (1 - distance / maxDistance) * 3;
            const pushX = (dx / distance) * force;
            const pushY = (dy / distance) * force;
            particle.x += pushX;
            particle.y += pushY;
          }
        }

        // Wrap around screen edges smoothly
        if (particle.x > width + 50) particle.x = -50;
        if (particle.x < -50) particle.x = width + 50;
        if (particle.y > height + 50) particle.y = -50;
        if (particle.y < -50) particle.y = height + 50;

        // Draw particle with glow effect
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        
        // Outer glow
        const glowGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        glowGradient.addColorStop(0, particle.color.replace("1)", "0.6)"));
        glowGradient.addColorStop(1, particle.color.replace("1)", "0)"));
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Core particle
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [createParticles, isMobile]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isMobile) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 };
  }, []);

  return (
    <div
      className="relative w-full h-screen overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Foreground Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-6">
        <div className="text-center space-y-6 animate-hero-fade-in">
          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-light tracking-tight text-white">
            <span className="block animate-hero-title-1">Seeing</span>
            <span className="block animate-hero-title-2">Theory</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl md:text-2xl text-white/70 font-light max-w-lg mx-auto leading-relaxed animate-hero-subtitle">
            A visual introduction to probability and statistics.
          </p>

          {/* CTA Button */}
          <div className="pt-4 animate-hero-button">
            <Button
              onClick={onStart}
              className="bg-white hover:bg-white/90 text-slate-900 font-medium px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]"
            >
              Start
            </Button>
          </div>
        </div>
      </div>

      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(31,34,51,0.4)_100%)]" />
    </div>
  );
};
