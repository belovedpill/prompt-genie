import { useEffect, useRef, useCallback, useState } from "react";
import { Button } from "@/components/ui/button";

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  color: string;
  vx: number;
  vy: number;
}

const STAR_COLORS = [
  "rgba(147, 197, 253, 1)",   // light blue
  "rgba(196, 181, 253, 1)",   // lavender
  "rgba(252, 211, 77, 1)",    // gold
  "rgba(167, 243, 208, 1)",   // mint
  "rgba(255, 255, 255, 1)",   // white
];

export const HeroSection = ({ onStart }: { onStart?: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const starsRef = useRef<Star[]>([]);
  const animationRef = useRef<number>();
  const [isMobile, setIsMobile] = useState(false);

  const createStars = useCallback((width: number, height: number) => {
    const starCount = isMobile ? 80 : 150;
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;

      stars.push({
        x,
        y,
        size: 3 + Math.random() * 5,
        opacity: 0.4 + Math.random() * 0.6,
        twinkleSpeed: 0.02 + Math.random() * 0.04,
        twinklePhase: Math.random() * Math.PI * 2,
        color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      });
    }

    return stars;
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
      starsRef.current = createStars(window.innerWidth, window.innerHeight);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let time = 0;

    const animate = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Deep dark gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, "#0a0a0f");
      gradient.addColorStop(0.5, "#0d0d15");
      gradient.addColorStop(1, "#0a0a0f");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      time += 0.016;

      starsRef.current.forEach((star) => {
        // Gentle drift
        star.x += star.vx;
        star.y += star.vy;

        // Mouse repulsion (only on desktop)
        if (!isMobile) {
          const dx = star.x - mouseRef.current.x;
          const dy = star.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 120;

          if (distance < maxDistance && distance > 0) {
            const force = (1 - distance / maxDistance) * 2;
            star.x += (dx / distance) * force;
            star.y += (dy / distance) * force;
          }
        }

        // Wrap around screen edges
        if (star.x > width + 20) star.x = -20;
        if (star.x < -20) star.x = width + 20;
        if (star.y > height + 20) star.y = -20;
        if (star.y < -20) star.y = height + 20;

        // Twinkling effect
        const twinkle = Math.sin(time * star.twinkleSpeed * 60 + star.twinklePhase) * 0.5 + 0.5;
        const currentOpacity = star.opacity * (0.5 + twinkle * 0.5);
        const currentSize = star.size * (0.8 + twinkle * 0.4);

        ctx.save();

        // Outer glow
        const glowSize = currentSize * 4;
        const outerGlow = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, glowSize
        );
        outerGlow.addColorStop(0, star.color.replace("1)", `${currentOpacity * 0.4})`));
        outerGlow.addColorStop(0.3, star.color.replace("1)", `${currentOpacity * 0.15})`));
        outerGlow.addColorStop(1, star.color.replace("1)", "0)"));
        
        ctx.fillStyle = outerGlow;
        ctx.beginPath();
        ctx.arc(star.x, star.y, glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Inner bright core
        const coreGlow = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, currentSize
        );
        coreGlow.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
        coreGlow.addColorStop(0.5, star.color.replace("1)", `${currentOpacity * 0.8})`));
        coreGlow.addColorStop(1, star.color.replace("1)", "0)"));
        
        ctx.fillStyle = coreGlow;
        ctx.beginPath();
        ctx.arc(star.x, star.y, currentSize, 0, Math.PI * 2);
        ctx.fill();

        // Star cross rays for larger stars
        if (star.size > 5) {
          ctx.globalAlpha = currentOpacity * 0.3;
          ctx.strokeStyle = star.color;
          ctx.lineWidth = 1;
          
          // Horizontal ray
          ctx.beginPath();
          ctx.moveTo(star.x - currentSize * 2, star.y);
          ctx.lineTo(star.x + currentSize * 2, star.y);
          ctx.stroke();
          
          // Vertical ray
          ctx.beginPath();
          ctx.moveTo(star.x, star.y - currentSize * 2);
          ctx.lineTo(star.x, star.y + currentSize * 2);
          ctx.stroke();
        }

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
  }, [createStars, isMobile]);

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
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight">
            <span className="block animate-hero-title-1 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(147,197,253,0.5)]">
              Promtit
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl sm:text-2xl md:text-3xl text-white/80 font-light max-w-2xl mx-auto leading-relaxed animate-hero-subtitle">
            Make your thought greatest.
          </p>

          {/* CTA Button */}
          <div className="pt-6 animate-hero-button">
            <Button
              onClick={onStart}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 hover:from-blue-400 hover:via-purple-400 hover:to-cyan-400 text-white font-semibold px-10 py-7 text-xl rounded-full transition-all duration-300 hover:scale-105 shadow-[0_0_40px_rgba(147,197,253,0.4)] hover:shadow-[0_0_60px_rgba(147,197,253,0.6)]"
            >
              Start Creating
            </Button>
          </div>
        </div>
      </div>

      {/* Subtle vignette overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,15,0.6)_100%)]" />
    </div>
  );
};
