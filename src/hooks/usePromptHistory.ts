import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface HistoryItem {
  id: string;
  prompt: string;
  mode: "text" | "image";
  timestamp: Date;
}

export const usePromptHistory = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch history on mount
  useEffect(() => {
    if (!user) {
      setHistory([]);
      setIsLoading(false);
      return;
    }

    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("prompt_history")
          .select("id, prompt, mode, created_at")
          .order("created_at", { ascending: false })
          .limit(20);

        if (error) {
          console.error("Error fetching history:", error);
          return;
        }

        const items: HistoryItem[] = (data || []).map((row) => ({
          id: row.id,
          prompt: row.prompt,
          mode: row.mode as "text" | "image",
          timestamp: new Date(row.created_at),
        }));

        setHistory(items);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  const addToHistory = useCallback(
    async (prompt: string, mode: "text" | "image") => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("prompt_history")
          .insert({
            user_id: user.id,
            prompt,
            mode,
          })
          .select("id, prompt, mode, created_at")
          .single();

        if (error) {
          console.error("Error saving to history:", error);
          return;
        }

        const newItem: HistoryItem = {
          id: data.id,
          prompt: data.prompt,
          mode: data.mode as "text" | "image",
          timestamp: new Date(data.created_at),
        };

        setHistory((prev) => [newItem, ...prev].slice(0, 20));
      } catch (error) {
        console.error("Error saving to history:", error);
      }
    },
    [user]
  );

  const clearHistory = useCallback(async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from("prompt_history")
        .delete()
        .eq("user_id", user.id);

      if (error) {
        console.error("Error clearing history:", error);
        toast.error("Failed to clear history");
        return;
      }

      setHistory([]);
      toast.success("History cleared");
    } catch (error) {
      console.error("Error clearing history:", error);
      toast.error("Failed to clear history");
    }
  }, [user]);

  return {
    history,
    isLoading,
    addToHistory,
    clearHistory,
  };
};
