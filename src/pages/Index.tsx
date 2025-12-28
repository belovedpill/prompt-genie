import { useState } from "react";
import { Zap } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import { TextModeForm } from "@/components/TextModeForm";
import { ImageModeForm } from "@/components/ImageModeForm";
import { OutputCard } from "@/components/OutputCard";
import { HistorySidebar, HistoryItem } from "@/components/HistorySidebar";
import { PromptTemplates, Template } from "@/components/PromptTemplates";

const Index = () => {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

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

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleModeChange = (newMode: "text" | "image") => {
    setMode(newMode);
    setSelectedTemplate(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex">
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
            <ModeToggle mode={mode} onModeChange={handleModeChange} />
          </div>

          {/* Form & Output */}
          <main className="flex-1 px-6 md:px-8 pb-8">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="glass-panel p-6 md:p-8 space-y-6">
                <PromptTemplates mode={mode} onSelectTemplate={handleSelectTemplate} />
                <div className="border-t border-border/30" />
                {mode === "text" ? (
                  <TextModeForm onGenerate={handleGenerate} template={selectedTemplate} />
                ) : (
                  <ImageModeForm onGenerate={handleGenerate} template={selectedTemplate} />
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

      {/* Footer */}
      <footer className="py-4 px-6 border-t border-border/30">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Created by{" "}
            <a
              href="https://github.com/belovedpill"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              belovedpill
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
