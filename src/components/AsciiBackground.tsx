import { useEffect, useRef, useCallback, useState } from "react";

interface AsciiChar {
  x: number;
  y: number;
  char: string;
  opacity: number;
  size: number;
  vx: number;
  vy: number;
  fadeSpeed: number;
  fadePhase: number;
  color: string;
}

const ASCII_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*(){}[]|;:',.<>?/~`+-=_";

const CHAR_COLORS = [
  "rgba(59, 130, 246, 1)",    // blue
  "rgba(139, 92, 246, 1)",    // purple
  "rgba(6, 182, 212, 1)",     // cyan
  "rgba(99, 102, 241, 1)",    // indigo
  "rgba(168, 85, 247, 1)",    // violet
];

export const AsciiBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const charsRef = useRef<AsciiChar[]>([]);
  const animationRef = useRef<number>();
  const [isMobile, setIsMobile] = useState(false);

  const createChars = useCallback((width: number, height: number) => {
    const charCount = isMobile ? 60 : 100;
    const chars: AsciiChar[] = [];

    for (let i = 0; i < charCount; i++) {
      chars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        char: ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)],
        opacity: 0.1 + Math.random() * 0.3,
        size: 14 + Math.random() * 20,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        fadeSpeed: 0.01 + Math.random() * 0.02,
        fadePhase: Math.random() * Math.PI * 2,
        color: CHAR_COLORS[Math.floor(Math.random() * CHAR_COLORS.length)],
      });
    }

    return chars;
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
      charsRef.current = createChars(window.innerWidth, window.innerHeight);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let time = 0;
    let charChangeTimer = 0;

    const animate = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Clear with transparent background
      ctx.clearRect(0, 0, width, height);

      time += 0.016;
      charChangeTimer += 0.016;

      // Randomly change characters periodically
      if (charChangeTimer > 0.5) {
        charChangeTimer = 0;
        const randomIndex = Math.floor(Math.random() * charsRef.current.length);
        charsRef.current[randomIndex].char = ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)];
      }

      charsRef.current.forEach((charObj) => {
        // Gentle drift
        charObj.x += charObj.vx;
        charObj.y += charObj.vy;

        // Mouse interaction (only on desktop)
        if (!isMobile) {
          const dx = charObj.x - mouseRef.current.x;
          const dy = charObj.y - mouseRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 100;

          if (distance < maxDistance && distance > 0) {
            const force = (1 - distance / maxDistance) * 1.5;
            charObj.x += (dx / distance) * force;
            charObj.y += (dy / distance) * force;
          }
        }

        // Wrap around screen edges
        if (charObj.x > width + 30) charObj.x = -30;
        if (charObj.x < -30) charObj.x = width + 30;
        if (charObj.y > height + 30) charObj.y = -30;
        if (charObj.y < -30) charObj.y = height + 30;

        // Pulsing opacity
        const pulse = Math.sin(time * charObj.fadeSpeed * 60 + charObj.fadePhase) * 0.5 + 0.5;
        const currentOpacity = charObj.opacity * (0.5 + pulse * 0.5);

        ctx.save();
        ctx.globalAlpha = currentOpacity;
        ctx.font = `${charObj.size}px "JetBrains Mono", "Fira Code", monospace`;
        ctx.fillStyle = charObj.color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // Subtle glow effect
        ctx.shadowColor = charObj.color;
        ctx.shadowBlur = 8;
        
        ctx.fillText(charObj.char, charObj.x, charObj.y);
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
  }, [createChars, isMobile]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isMobile) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 };
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
    />
  );
};
