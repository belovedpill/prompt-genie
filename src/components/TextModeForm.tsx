import { useState, useEffect } from "react";
import { Sparkles, User, FileCode } from "lucide-react";
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

  useEffect(() => {
    if (template) {
      if (template.coreTask) setCoreTask(template.coreTask);
      if (template.persona) setPersona(template.persona);
      if (template.format) setFormat(template.format);
    }
  }, [template]);

  const handleGenerate = () => {
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

    onGenerate(prompt.trim());
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

      <Button
        onClick={handleGenerate}
        disabled={!coreTask.trim()}
        size="lg"
        className="w-full"
      >
        <Sparkles className="w-5 h-5" />
        Generate Prompt
      </Button>
    </div>
  );
};
