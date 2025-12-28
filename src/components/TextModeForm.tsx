import { useState, useEffect } from "react";
import { Sparkles, User, FileCode, Wand2, Loader2 } from "lucide-react";
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
import { usePromptEnhancer } from "@/hooks/usePromptEnhancer";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface TextModeFormProps {
  onGenerate: (prompt: string) => void;
  template?: Template | null;
}

const personas = [
  { value: "coding-expert", label: "Coding Expert", icon: "💻" },
  { value: "marketing-guru", label: "Marketing Guru", icon: "📈" },
  { value: "creative-writer", label: "Creative Writer", icon: "✍️" },
  { value: "lawyer", label: "Lawyer", icon: "⚖️" },
  { value: "data-analyst", label: "Data Analyst", icon: "📊" },
  { value: "teacher", label: "Teacher", icon: "🎓" },
];

const formats = [
  { value: "bullet-points", label: "Bullet Points" },
  { value: "table", label: "Table" },
  { value: "essay", label: "Essay" },
  { value: "code", label: "Code" },
  { value: "step-by-step", label: "Step-by-Step Guide" },
  { value: "summary", label: "Summary" },
];

export const TextModeForm = ({ onGenerate, template }: TextModeFormProps) => {
  const [coreTask, setCoreTask] = useState("");
  const [persona, setPersona] = useState("");
  const [format, setFormat] = useState("");
  const [enhanceWithAI, setEnhanceWithAI] = useState(true);
  const { enhancePrompt, isEnhancing } = usePromptEnhancer();

  useEffect(() => {
    if (template) {
      if (template.coreTask) setCoreTask(template.coreTask);
      if (template.persona) setPersona(template.persona);
      if (template.format) setFormat(template.format);
    }
  }, [template]);

  const handleGenerate = async () => {
    if (!coreTask.trim()) return;

    const selectedPersona = personas.find((p) => p.value === persona);
    const selectedFormat = formats.find((f) => f.value === format);

    let prompt = "";

    if (selectedPersona) {
      prompt += `Act as a ${selectedPersona.label}. `;
    }

    prompt += `Your task is to ${coreTask.trim()}. `;

    if (selectedFormat) {
      prompt += `Constraint: Ensure the output is in ${selectedFormat.label} format.`;
    }

    const finalPrompt = enhanceWithAI 
      ? await enhancePrompt(prompt.trim(), "text")
      : prompt.trim();

    onGenerate(finalPrompt);
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          Core Task
        </label>
        <Textarea
          placeholder="Describe what you want the AI to do... (e.g., 'Write a blog post about sustainable living')"
          value={coreTask}
          onChange={(e) => setCoreTask(e.target.value)}
          className="min-h-[120px] bg-input border-border focus:border-primary/50 focus:shadow-glow transition-all duration-300 resize-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <User className="w-4 h-4 text-primary" />
            Persona
          </label>
          <Select value={persona} onValueChange={setPersona}>
            <SelectTrigger className="bg-input border-border focus:border-primary/50 focus:shadow-glow transition-all duration-300">
              <SelectValue placeholder="Select a persona..." />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {personas.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  <span className="flex items-center gap-2">
                    <span>{p.icon}</span>
                    <span>{p.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-medium text-foreground">
            <FileCode className="w-4 h-4 text-primary" />
            Output Format
          </label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger className="bg-input border-border focus:border-primary/50 focus:shadow-glow transition-all duration-300">
              <SelectValue placeholder="Select a format..." />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {formats.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* AI Enhancement Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg bg-primary/5 border border-primary/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Wand2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <Label htmlFor="ai-enhance" className="text-sm font-medium cursor-pointer">
              AI Enhancement
            </Label>
            <p className="text-xs text-muted-foreground">
              Automatically improve your prompt with AI
            </p>
          </div>
        </div>
        <Switch
          id="ai-enhance"
          checked={enhanceWithAI}
          onCheckedChange={setEnhanceWithAI}
        />
      </div>

      <Button
        onClick={handleGenerate}
        disabled={!coreTask.trim() || isEnhancing}
        size="lg"
        className="w-full group relative overflow-hidden"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        {isEnhancing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Enhancing with AI...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5 group-hover:animate-pulse" />
            Generate Prompt
          </>
        )}
      </Button>
    </div>
  );
};
