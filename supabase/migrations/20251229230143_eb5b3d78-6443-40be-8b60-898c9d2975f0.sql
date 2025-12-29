-- Create prompt_history table
CREATE TABLE public.prompt_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('text', 'image')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.prompt_history ENABLE ROW LEVEL SECURITY;

-- Users can only view their own history
CREATE POLICY "Users can view their own history"
ON public.prompt_history
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own history
CREATE POLICY "Users can insert their own history"
ON public.prompt_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their own history
CREATE POLICY "Users can delete their own history"
ON public.prompt_history
FOR DELETE
USING (auth.uid() = user_id);

-- Index for faster user queries
CREATE INDEX idx_prompt_history_user_id ON public.prompt_history(user_id);
CREATE INDEX idx_prompt_history_created_at ON public.prompt_history(created_at DESC);