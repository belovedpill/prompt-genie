import { useState, useEffect } from "react";
import { Sparkles, Image, Sun, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Template } from "./PromptTemplates";

interface ImageModeFormProps {
  onGenerate: (prompt: string) => void;
  template?: Template | null;
}

const styles = [
  { value: "photorealistic", label: "Photorealistic", icon: "📷" },
  { value: "anime", label: "Anime", icon: "🎌" },
  { value: "oil-painting", label: "Oil Painting", icon: "🎨" },
  { value: "3d-render", label: "3D Render", icon: "🎮" },
  { value: "polaroid", label: "Polaroid", icon: "📸" },
  { value: "watercolor", label: "Watercolor", icon: "🖌️" },
  { value: "digital-art", label: "Digital Art", icon: "💻" },
  { value: "pencil-sketch", label: "Pencil Sketch", icon: "✏️" },
];

const lightings = [
  { value: "cinematic", label: "Cinematic" },
  { value: "natural", label: "Natural" },
  { value: "neon", label: "Neon" },
  { value: "studio", label: "Studio" },
  { value: "golden-hour", label: "Golden Hour" },
  { value: "dramatic", label: "Dramatic" },
  { value: "soft", label: "Soft" },
];

const aspectRatios = [
  { value: "16:9", label: "16:9 (Landscape)" },
  { value: "1:1", label: "1:1 (Square)" },
  { value: "9:16", label: "9:16 (Portrait)" },
  { value: "4:3", label: "4:3 (Standard)" },
  { value: "21:9", label: "21:9 (Ultrawide)" },
];

export const ImageModeForm = ({ onGenerate, template }: ImageModeFormProps) => {
  const [subject, setSubject] = useState("");
  const [style, setStyle] = useState("");
  const [lighting, setLighting] = useState("");
  const [aspectRatio, setAspectRatio] = useState("");

  useEffect(() => {
    if (template) {
      if (template.subject) setSubject(template.subject);
      if (template.style) setStyle(template.style);
      if (template.lighting) setLighting(template.lighting);
      if (template.aspectRatio) setAspectRatio(template.aspectRatio);
    }
  }, [template]);

  const handleGenerate = () => {
    if (!subject.trim()) return;

    const selectedStyle = styles.find((s) => s.value === style);
    const selectedLighting = lightings.find((l) => l.value === lighting);
    const selectedRatio = aspectRatios.find((r) => r.value === aspectRatio);

    let prompt = `/imagine prompt: ${subject.trim()}`;

    if (selectedStyle) {
      prompt += `, ${selectedStyle.label} style`;
    }

    if (selectedLighting) {
      prompt += `, ${selectedLighting.label} lighting`;
    }

    prompt += ", highly detailed, 8k, masterpiece";

    if (selectedRatio) {
      prompt += ` --ar ${selectedRatio.value}`;
    }

    prompt += " --v 6.0";

    onGenerate(prompt);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          Subject
        </label>
        <Textarea
          placeholder="Describe your image subject... (e.g., 'A cyberpunk city at night with flying cars')"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="min-h-[120px] bg-input border-border focus:border-primary/50 focus:shadow-glow transition-all duration-300 resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Image className="w-4 h-4 text-primary" />
            Style
          </label>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger className="bg-input border-border focus:border-primary/50 focus:shadow-glow transition-all duration-300">
              <SelectValue placeholder="Select style..." />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {styles.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  <span className="flex items-center gap-2">
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Sun className="w-4 h-4 text-primary" />
            Lighting
          </label>
          <Select value={lighting} onValueChange={setLighting}>
            <SelectTrigger className="bg-input border-border focus:border-primary/50 focus:shadow-glow transition-all duration-300">
              <SelectValue placeholder="Select lighting..." />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {lightings.map((l) => (
                <SelectItem key={l.value} value={l.value}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Maximize2 className="w-4 h-4 text-primary" />
            Aspect Ratio
          </label>
          <Select value={aspectRatio} onValueChange={setAspectRatio}>
            <SelectTrigger className="bg-input border-border focus:border-primary/50 focus:shadow-glow transition-all duration-300">
              <SelectValue placeholder="Select ratio..." />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {aspectRatios.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={handleGenerate}
        disabled={!subject.trim()}
        size="lg"
        className="w-full"
      >
        <Sparkles className="w-5 h-5" />
        Generate Prompt
      </Button>
    </div>
  );
};
