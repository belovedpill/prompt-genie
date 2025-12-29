import { History, FileText, Palette, RotateCcw, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { HistoryItem } from "@/hooks/usePromptHistory";

interface HistorySidebarProps {
  history: HistoryItem[];
  onClear: () => void;
  onSelectPrompt?: (prompt: string, mode: "text" | "image") => void;
}

export const HistorySidebar = ({ history, onClear, onSelectPrompt }: HistorySidebarProps) => {
  const handleReuse = (item: HistoryItem) => {
    if (onSelectPrompt) {
      onSelectPrompt(item.prompt, item.mode as "text" | "image");
      toast.success("Prompt loaded! Edit and regenerate.");
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  return (
    <div className="glass-panel h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between opacity-0 animate-slide-left" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <History className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium">History</span>
        </div>
        {history.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear} className="hover:text-destructive transition-colors">
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {history.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
              <History className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-sm">No history yet</p>
            <p className="text-xs mt-1 text-muted-foreground/70">Generated prompts will appear here</p>
          </div>
        ) : (
          history.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "group p-3 rounded-lg bg-secondary/30 border border-border cursor-pointer transition-all duration-300",
                "hover:border-primary/50 hover:bg-primary/5 hover-lift",
                "opacity-0 animate-slide-left"
              )}
              style={{ animationDelay: `${0.1 + index * 0.05}s`, animationFillMode: "forwards" }}
              onClick={() => handleReuse(item)}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 rounded bg-primary/10">
                  {item.mode === "text" ? (
                    <FileText className="w-3 h-3 text-primary" />
                  ) : (
                    <Palette className="w-3 h-3 text-primary" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatTime(item.timestamp)}
                </span>
                <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-2">
                  <RotateCcw className="w-3 h-3 text-primary" />
                  <span className="text-xs text-primary font-medium">Reuse</span>
                </div>
              </div>
              <p className="text-xs text-foreground/80 line-clamp-3 font-mono leading-relaxed">
                {item.prompt}
              </p>
            </div>
          ))
        )}
      </div>

      {history.length > 0 && (
        <div className="p-3 border-t border-border/50 opacity-0 animate-fade-in" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3 text-primary" />
            <span>Click any item to reuse it</span>
          </div>
        </div>
      )}
    </div>
  );
};
