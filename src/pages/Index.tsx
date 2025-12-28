import { useState } from "react";
import { Zap } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import { TextModeForm } from "@/components/TextModeForm";
import { ImageModeForm } from "@/components/ImageModeForm";
import { OutputCard } from "@/components/OutputCard";
import { HistorySidebar, HistoryItem } from "@/components/HistorySidebar";

const Index = () => {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleGenerate = (prompt: string) => {
    setGeneratedPrompt(prompt);

    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      prompt,
      mode,
      timestamp: new Date(),
    };

    setHistory((prev) => [newItem, ...prev].slice(0, 5));
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen flex">
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="p-6 md:p-8">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm text-muted-foreground mb-4">
              <Zap className="w-4 h-4 text-primary" />
              <span>AI Prompt Generator</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="gradient-text">PromptForge</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Craft perfect prompts for ChatGPT, Gemini, Midjourney, and Flux with ease
            </p>
          </div>
        </header>

        {/* Mode Toggle */}
        <div className="px-6 md:px-8 pb-6">
          <ModeToggle mode={mode} onModeChange={setMode} />
        </div>

        {/* Form & Output */}
        <main className="flex-1 px-6 md:px-8 pb-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="glass-panel p-6 md:p-8">
              {mode === "text" ? (
                <TextModeForm onGenerate={handleGenerate} />
              ) : (
                <ImageModeForm onGenerate={handleGenerate} />
              )}
            </div>

            <OutputCard prompt={generatedPrompt} mode={mode} />
          </div>
        </main>
      </div>

      {/* History Sidebar - Hidden on mobile, visible on lg+ */}
      <aside className="hidden lg:block w-80 border-l border-border">
        <HistorySidebar history={history} onClear={handleClearHistory} />
      </aside>
    </div>
  );
};

export default Index;
