import { useEffect, useState } from "react";

export const AnimatedTitle = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight overflow-hidden">
      <span className="inline-flex">
        {"Prompt".split("").map((char, i) => (
          <span
            key={`prompt-${i}`}
            className={`inline-block gradient-text transition-all duration-500 ${
              mounted
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            style={{
              transitionDelay: `${i * 50}ms`,
            }}
          >
            {char}
          </span>
        ))}
      </span>
      <span className="inline-block w-3" />
      <span className="inline-flex">
        {"It".split("").map((char, i) => (
          <span
            key={`it-${i}`}
            className={`inline-block text-primary animate-pulse-glow transition-all duration-500 ${
              mounted
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-8 scale-50"
            }`}
            style={{
              transitionDelay: `${(i + 7) * 50 + 200}ms`,
              textShadow: "0 0 30px hsl(192 95% 55% / 0.8), 0 0 60px hsl(192 95% 55% / 0.4)",
            }}
          >
            {char}
          </span>
        ))}
      </span>
    </h1>
  );
};
