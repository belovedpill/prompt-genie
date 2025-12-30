import { useState } from "react";
import { Sparkles, Zap, LogOut, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/ModeToggle";
import { TextModeForm } from "@/components/TextModeForm";
import { ImageModeForm } from "@/components/ImageModeForm";
import { OutputCard } from "@/components/OutputCard";
import { HistorySidebar } from "@/components/HistorySidebar";
import { PromptTemplates, Template } from "@/components/PromptTemplates";
import { AnimatedTitle } from "@/components/AnimatedTitle";
import { UserManual } from "@/components/UserManual";
import { AsciiBackground } from "@/components/AsciiBackground";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { usePromptHistory } from "@/hooks/usePromptHistory";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const isGuest = window.location.search.includes("guest=true");
  const { history, addToHistory, clearHistory } = usePromptHistory();
  const [mode, setMode] = useState<"text" | "image">("text");
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [reusedPrompt, setReusedPrompt] = useState<string>("");

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
    }
  };

  const handleGenerate = async (prompt: string) => {
    setGeneratedPrompt(prompt);
    setReusedPrompt("");
    if (!isGuest && user) {
      await addToHistory(prompt, mode);
    }
  };

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setReusedPrompt("");
  };

  const handleModeChange = (newMode: "text" | "image") => {
    setMode(newMode);
    setSelectedTemplate(null);
    setReusedPrompt("");
  };

  const handleSelectFromHistory = (prompt: string, historyMode: "text" | "image") => {
    setMode(historyMode);
    setReusedPrompt(prompt);
    setSelectedTemplate(null);
  };

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-[#0a0a0f]">
      {/* ASCII Background */}
      <AsciiBackground />
      
      {/* Gradient overlay for depth */}
      <div className="fixed inset-0 pointer-events-none z-[1] bg-gradient-to-b from-transparent via-[#0a0a0f]/30 to-[#0a0a0f]/60" />

      {/* Main Content */}
      <div className="flex-1 flex relative z-10">
        <div className="flex-1 flex flex-col relative z-10">
          {/* Header */}
          <header className="p-6 md:p-8">
            <div className="max-w-4xl mx-auto">
              {/* User Info & Actions */}
              <div className="flex justify-between items-center mb-4 opacity-0 animate-slide-down" style={{ animationFillMode: "forwards" }}>
                <UserManual />
                <div className="flex items-center gap-3">
                  {user ? (
                    <>
                      <span className="text-sm text-muted-foreground hidden sm:inline">
                        {user.email}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSignOut}
                        className="gap-2 hover:border-primary/50 transition-all duration-300"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:inline">Sign Out</span>
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate("/auth")}
                      className="gap-2 hover:border-primary/50 transition-all duration-300"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Sign In</span>
                    </Button>
                  )}
                </div>
              </div>

              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-sm text-muted-foreground mb-4 opacity-0 animate-scale-bounce stagger-1 animate-border-glow" style={{ animationFillMode: "forwards" }}>
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  <span>AI-Powered Prompt Generator</span>
                  <Zap className="w-4 h-4 text-primary animate-pulse" />
                </div>
                <AnimatedTitle />
                <p className="text-lg text-muted-foreground max-w-xl mx-auto opacity-0 animate-fade-in-up stagger-3" style={{ animationFillMode: "forwards" }}>
                  Craft perfect prompts for ChatGPT, Gemini, Midjourney, and Flux with AI enhancement
                </p>
                {isGuest && (
                  <p className="text-sm text-primary/70 opacity-0 animate-fade-in stagger-4" style={{ animationFillMode: "forwards" }}>
                    Guest mode - Sign in to save your history
                  </p>
                )}
              </div>
            </div>
          </header>

          {/* Mode Toggle */}
          <div className="px-6 md:px-8 pb-6 opacity-0 animate-scale-in stagger-4" style={{ animationFillMode: "forwards" }}>
            <ModeToggle mode={mode} onModeChange={handleModeChange} />
          </div>

          {/* Form & Output */}
          <main className="flex-1 px-6 md:px-8 pb-8">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="glass-panel p-6 md:p-8 space-y-6 opacity-0 animate-scale-bounce stagger-5 hover-glow transition-all duration-500" style={{ animationFillMode: "forwards" }}>
                <PromptTemplates mode={mode} onSelectTemplate={handleSelectTemplate} />
                <div className="border-t border-border/30" />
                {mode === "text" ? (
                  <TextModeForm onGenerate={handleGenerate} template={selectedTemplate} initialPrompt={reusedPrompt} />
                ) : (
                  <ImageModeForm onGenerate={handleGenerate} template={selectedTemplate} initialPrompt={reusedPrompt} />
                )}
              </div>

              <OutputCard prompt={generatedPrompt} mode={mode} />
            </div>
          </main>
        </div>

        {/* History Sidebar - Hidden on mobile, visible on lg+ */}
        {!isGuest && user && (
          <aside className="hidden lg:block w-80 border-l border-border opacity-0 animate-slide-left" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
            <HistorySidebar history={history} onClear={clearHistory} onSelectPrompt={handleSelectFromHistory} />
          </aside>
        )}
      </div>

      {/* Footer */}
      <footer className="py-4 px-6 border-t border-border/30 relative z-10 opacity-0 animate-fade-in stagger-6" style={{ animationFillMode: "forwards" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            Created by{" "}
            <a
              href="https://github.com/belovedpill"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors font-medium animate-text-glow"
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
