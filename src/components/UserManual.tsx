import { useState } from "react";
import { 
  Book, 
  Sparkles, 
  Zap, 
  AlertCircle, 
  ChevronRight,
  X,
  FileText,
  Image,
  Clock,
  Wand2,
  Copy,
  MousePointer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ExampleView {
  title: string;
  description: string;
  input: string;
  output: string;
}

const textExamples: ExampleView[] = [
  {
    title: "Blog Post Generation",
    description: "Create SEO-optimized content",
    input: "Write a blog post about sustainable living tips",
    output: "Act as a Creative Writer. Your task is to write an engaging, SEO-optimized blog post about sustainable living that includes an introduction, 5 main sections with subheadings covering topics like reducing plastic waste, energy conservation, sustainable shopping, composting basics, and eco-friendly transportation, followed by a compelling conclusion with a call-to-action..."
  },
  {
    title: "Code Documentation",
    description: "Generate technical documentation",
    input: "Document this React hook for user authentication",
    output: "Act as a Coding Expert. Your task is to create comprehensive documentation for the useAuth React hook that includes: purpose and overview, parameters and return values, usage examples with code snippets, error handling patterns, and best practices for implementation..."
  },
];

const imageExamples: ExampleView[] = [
  {
    title: "Product Photography",
    description: "E-commerce ready images",
    input: "A sleek wireless headphone on white background",
    output: "/imagine prompt: A premium wireless headphone with matte black finish, floating on a pristine white background with soft diffused shadows, studio lighting creating subtle highlights on the ear cups, product photography style, highly detailed, 8k, masterpiece --ar 1:1 --v 6.0"
  },
  {
    title: "Fantasy Landscape",
    description: "Creative artwork generation",
    input: "A magical forest with glowing mushrooms",
    output: "/imagine prompt: An enchanted mystical forest at twilight with bioluminescent mushrooms casting ethereal blue and purple glow, ancient twisted trees with luminous bark, fireflies dancing in the misty air, digital art style, cinematic lighting, highly detailed, 8k, masterpiece --ar 16:9 --v 6.0"
  },
];

const aiLimitations = [
  {
    title: "Context Window",
    description: "AI can process up to ~8000 tokens per request. Very long prompts may be truncated.",
  },
  {
    title: "Response Time",
    description: "Enhancement typically takes 2-5 seconds. Complex prompts may take longer.",
  },
  {
    title: "Accuracy",
    description: "AI suggestions are meant to enhance, not replace your creative direction. Always review outputs.",
  },
  {
    title: "Rate Limits",
    description: "To ensure fair usage, there may be temporary limits on rapid consecutive requests.",
  },
];

export const UserManual = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"guide" | "examples" | "limits">("guide");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 text-muted-foreground hover:text-primary transition-colors duration-300"
        >
          <Book className="w-4 h-4" />
          <span className="hidden sm:inline">User Guide</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden glass-panel border-border/50 p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-primary/10 animate-pulse-glow">
              <Book className="w-5 h-5 text-primary" />
            </div>
            <span className="gradient-text font-semibold">PromptForge Guide</span>
          </DialogTitle>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex gap-1 px-6 pt-4">
          {[
            { id: "guide", label: "Quick Start", icon: Zap },
            { id: "examples", label: "Examples", icon: FileText },
            { id: "limits", label: "AI Limits", icon: AlertCircle },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "gap-2 transition-all duration-300",
                activeTab === tab.id 
                  ? "bg-primary/10 text-primary border-b-2 border-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Quick Start Guide */}
          {activeTab === "guide" && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Getting Started
                </h3>
                
                <div className="space-y-3">
                  {[
                    { step: 1, icon: MousePointer, title: "Choose Your Mode", desc: "Select Text mode for ChatGPT/Gemini prompts or Image mode for Midjourney/Flux" },
                    { step: 2, icon: FileText, title: "Select a Template", desc: "Use quick templates to jumpstart your prompt or start from scratch" },
                    { step: 3, icon: Wand2, title: "Describe Your Task", desc: "Enter your core task or subject with as much detail as you'd like" },
                    { step: 4, icon: Zap, title: "Generate & Copy", desc: "Hit generate and copy your enhanced prompt to use anywhere" },
                  ].map((item, index) => (
                    <div 
                      key={item.step} 
                      className="flex gap-4 p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all duration-300 opacity-0 animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 font-medium">
                          <item.icon className="w-4 h-4 text-primary" />
                          {item.title}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Pro Tip: History Reuse</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Click any item in your history sidebar to instantly load it as a starting point for a new prompt.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Examples */}
          {activeTab === "examples" && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Text Prompt Examples
                </h3>
                {textExamples.map((example, index) => (
                  <div 
                    key={index} 
                    className="p-4 rounded-lg bg-secondary/30 border border-border/50 space-y-3 opacity-0 animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{example.title}</span>
                      <span className="text-xs text-muted-foreground">{example.description}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ChevronRight className="w-3 h-3" /> Your Input
                      </div>
                      <p className="text-sm bg-input/50 p-2 rounded border border-border/30 font-mono">
                        {example.input}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-primary">
                        <Sparkles className="w-3 h-3" /> AI Enhanced Output
                      </div>
                      <p className="text-sm bg-primary/5 p-2 rounded border border-primary/20 font-mono line-clamp-3">
                        {example.output}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <Image className="w-5 h-5 text-primary" />
                  Image Prompt Examples
                </h3>
                {imageExamples.map((example, index) => (
                  <div 
                    key={index} 
                    className="p-4 rounded-lg bg-secondary/30 border border-border/50 space-y-3 opacity-0 animate-slide-up"
                    style={{ animationDelay: `${(index + 2) * 0.1}s`, animationFillMode: "forwards" }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{example.title}</span>
                      <span className="text-xs text-muted-foreground">{example.description}</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <ChevronRight className="w-3 h-3" /> Your Input
                      </div>
                      <p className="text-sm bg-input/50 p-2 rounded border border-border/30 font-mono">
                        {example.input}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-primary">
                        <Sparkles className="w-3 h-3" /> AI Enhanced Output
                      </div>
                      <p className="text-sm bg-primary/5 p-2 rounded border border-primary/20 font-mono line-clamp-3">
                        {example.output}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Limitations */}
          {activeTab === "limits" && (
            <div className="space-y-6 animate-fade-in">
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  AI Capabilities & Limitations
                </h3>
                
                <div className="grid gap-3">
                  {aiLimitations.map((limit, index) => (
                    <div 
                      key={index} 
                      className="p-4 rounded-lg bg-secondary/30 border border-border/50 hover:border-primary/30 transition-all duration-300 opacity-0 animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 animate-pulse" />
                        <div>
                          <p className="font-medium">{limit.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{limit.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">Important Note</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      AI-generated content should always be reviewed before use. The AI enhances your prompts based on patterns but may occasionally produce unexpected results.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
