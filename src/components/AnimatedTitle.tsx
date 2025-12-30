import { useEffect, useState } from "react";

export const AnimatedTitle = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight overflow-hidden">
      <span className="inline-flex">
        {"Promt".split("").map((char, i) => (
          <span
            key={`promt-${i}`}
            className={`inline-block bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent transition-all duration-500 ${
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
      <span className="inline-flex">
        {"it".split("").map((char, i) => (
          <span
            key={`it-${i}`}
            className={`inline-block text-primary transition-all duration-500 ${
              mounted
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-8 scale-50"
            }`}
            style={{
              transitionDelay: `${(i + 5) * 50 + 200}ms`,
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
