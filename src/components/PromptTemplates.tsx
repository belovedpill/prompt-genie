import { FileText, ShoppingBag, MessageCircle, Mail, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Template {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  coreTask?: string;
  persona?: string;
  format?: string;
  subject?: string;
  style?: string;
  lighting?: string;
  aspectRatio?: string;
}

interface PromptTemplatesProps {
  mode: "text" | "image";
  onSelectTemplate: (template: Template) => void;
}

const textTemplates: Template[] = [
  {
    id: "blog-post",
    name: "Blog Post",
    icon: <FileText className="w-4 h-4" />,
    description: "SEO-optimized blog article",
    coreTask: "Write an engaging, SEO-optimized blog post about [topic] that includes an introduction, 3-5 main sections with subheadings, and a compelling conclusion with a call-to-action",
    persona: "creative-writer",
    format: "essay",
  },
  {
    id: "social-media",
    name: "Social Media",
    icon: <MessageCircle className="w-4 h-4" />,
    description: "Viral social media content",
    coreTask: "Create an engaging social media post about [topic] that hooks the reader in the first line, provides value, and ends with a question to encourage engagement",
    persona: "marketing-guru",
    format: "bullet-points",
  },
  {
    id: "product-description",
    name: "Product Description",
    icon: <ShoppingBag className="w-4 h-4" />,
    description: "Compelling product copy",
    coreTask: "Write a persuasive product description for [product name] that highlights key features, benefits, and unique selling points to convert browsers into buyers",
    persona: "marketing-guru",
    format: "bullet-points",
  },
  {
    id: "email-campaign",
    name: "Email Campaign",
    icon: <Mail className="w-4 h-4" />,
    description: "Converting email sequence",
    coreTask: "Write a compelling email that grabs attention with a strong subject line, delivers value in the body, and includes a clear call-to-action for [purpose]",
    persona: "marketing-guru",
    format: "essay",
  },
  {
    id: "ad-copy",
    name: "Ad Copy",
    icon: <Megaphone className="w-4 h-4" />,
    description: "High-converting ad text",
    coreTask: "Create punchy, high-converting ad copy for [product/service] that captures attention, highlights the main benefit, and drives action within character limits",
    persona: "marketing-guru",
    format: "bullet-points",
  },
];

const imageTemplates: Template[] = [
  {
    id: "product-photo",
    name: "Product Photo",
    icon: <ShoppingBag className="w-4 h-4" />,
    description: "E-commerce product shot",
    subject: "A sleek [product] on a minimalist white background with soft shadows",
    style: "photorealistic",
    lighting: "studio",
    aspectRatio: "1:1",
  },
  {
    id: "social-banner",
    name: "Social Banner",
    icon: <MessageCircle className="w-4 h-4" />,
    description: "Eye-catching social header",
    subject: "Abstract geometric shapes with vibrant gradients for a modern social media banner",
    style: "digital-art",
    lighting: "neon",
    aspectRatio: "16:9",
  },
  {
    id: "blog-hero",
    name: "Blog Hero",
    icon: <FileText className="w-4 h-4" />,
    description: "Blog post header image",
    subject: "A creative illustration representing [topic] with depth and visual interest",
    style: "digital-art",
    lighting: "cinematic",
    aspectRatio: "16:9",
  },
  {
    id: "portrait",
    name: "Portrait",
    icon: <Mail className="w-4 h-4" />,
    description: "Professional portrait style",
    subject: "A professional headshot of a person with a clean, modern aesthetic",
    style: "photorealistic",
    lighting: "natural",
    aspectRatio: "4:3",
  },
  {
    id: "story-cover",
    name: "Story Cover",
    icon: <Megaphone className="w-4 h-4" />,
    description: "Vertical story/reel cover",
    subject: "A dynamic, attention-grabbing scene with bold colors and dramatic composition",
    style: "3d-render",
    lighting: "dramatic",
    aspectRatio: "9:16",
  },
];

export const PromptTemplates = ({ mode, onSelectTemplate }: PromptTemplatesProps) => {
  const templates = mode === "text" ? textTemplates : imageTemplates;

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Quick Templates</p>
      <div className="flex flex-wrap gap-2">
        {templates.map((template) => (
          <Button
            key={template.id}
            variant="outline"
            size="sm"
            onClick={() => onSelectTemplate(template)}
            className="gap-2 bg-input/50 border-border/50 hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300"
          >
            {template.icon}
            <span>{template.name}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
