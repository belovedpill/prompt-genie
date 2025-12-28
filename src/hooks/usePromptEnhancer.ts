import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const usePromptEnhancer = () => {
  const [isEnhancing, setIsEnhancing] = useState(false);

  const enhancePrompt = async (prompt: string, mode: "text" | "image"): Promise<string> => {
    if (!prompt.trim()) return prompt;

    setIsEnhancing(true);
    try {
      const { data, error } = await supabase.functions.invoke("enhance-prompt", {
        body: { prompt, mode },
      });

      if (error) {
        console.error("Enhancement error:", error);
        toast.error("Failed to enhance prompt. Using original.");
        return prompt;
      }

      if (data?.error) {
        toast.error(data.error);
        return prompt;
      }

      toast.success("Prompt enhanced with AI!");
      return data.enhancedPrompt || prompt;
    } catch (error) {
      console.error("Enhancement error:", error);
      toast.error("Failed to enhance prompt. Using original.");
      return prompt;
    } finally {
      setIsEnhancing(false);
    }
  };

  return { enhancePrompt, isEnhancing };
};
