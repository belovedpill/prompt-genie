import { useState } from "react";
import { Copy, Check, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface OutputCardProps {
  prompt: string | null;
  mode: "text" | "image";
}

export const OutputCard = ({ prompt, mode }: OutputCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!prompt) return;

    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    toast.success("Prompt copied to clipboard!");

    setTimeout(() => setCopied(false), 2000);
  };

  if (!prompt) {
    return (
      <div className="glass-panel p-8 text-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
            <Wand2 className="w-8 h-8 text-primary/50" />
          </div>
          <p className="text-lg">
            Your generated prompt will appear here
          </p>
          <p className="text-sm">
            Fill in the form above and click generate
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel-hover p-6 space-y-4 animate-slide-up neon-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-sm font-medium text-primary">
            {mode === "text" ? "Text Prompt" : "Image Prompt"}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>
      <div className="p-4 rounded-lg bg-secondary/30 border border-border">
        <p className="font-mono text-sm leading-relaxed text-foreground whitespace-pre-wrap">
          {prompt}
        </p>
      </div>
    </div>
  );
};
