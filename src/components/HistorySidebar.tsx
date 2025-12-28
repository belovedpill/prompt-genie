import { History, FileText, Palette, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export interface HistoryItem {
  id: string;
  prompt: string;
  mode: "text" | "image";
  timestamp: Date;
}

interface HistorySidebarProps {
  history: HistoryItem[];
  onClear: () => void;
}

export const HistorySidebar = ({ history, onClear }: HistorySidebarProps) => {
  const handleCopy = async (prompt: string) => {
    await navigator.clipboard.writeText(prompt);
    toast.success("Prompt copied!");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="glass-panel h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          <span className="font-medium">History</span>
        </div>
        {history.length > 0 && (
          <Button variant="ghost" size="sm" onClick={onClear}>
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {history.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No history yet</p>
          </div>
        ) : (
          history.map((item, index) => (
            <div
              key={item.id}
              className={cn(
                "group p-3 rounded-lg bg-secondary/30 border border-border hover:border-primary/30 transition-all duration-300 cursor-pointer",
                index === 0 && "animate-slide-up"
              )}
              onClick={() => handleCopy(item.prompt)}
            >
              <div className="flex items-center gap-2 mb-2">
                {item.mode === "text" ? (
                  <FileText className="w-4 h-4 text-primary" />
                ) : (
                  <Palette className="w-4 h-4 text-primary" />
                )}
                <span className="text-xs text-muted-foreground">
                  {formatTime(item.timestamp)}
                </span>
                <Copy className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
              </div>
              <p className="text-xs text-foreground/80 line-clamp-3 font-mono">
                {item.prompt}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
