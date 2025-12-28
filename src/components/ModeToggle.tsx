import { FileText, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModeToggleProps {
  mode: "text" | "image";
  onModeChange: (mode: "text" | "image") => void;
}

export const ModeToggle = ({ mode, onModeChange }: ModeToggleProps) => {
  return (
    <div className="flex items-center justify-center">
      <div className="glass-panel p-1.5 flex gap-1">
        <button
          onClick={() => onModeChange("text")}
          className={cn(
            "flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-300",
            mode === "text"
              ? "bg-primary text-primary-foreground shadow-glow"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          )}
        >
          <FileText className="w-5 h-5" />
          <span>Text Mode</span>
        </button>
        <button
          onClick={() => onModeChange("image")}
          className={cn(
            "flex items-center gap-3 px-6 py-3 rounded-lg font-medium transition-all duration-300",
            mode === "image"
              ? "bg-primary text-primary-foreground shadow-glow"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
          )}
        >
          <Palette className="w-5 h-5" />
          <span>Image Mode</span>
        </button>
      </div>
    </div>
  );
};
