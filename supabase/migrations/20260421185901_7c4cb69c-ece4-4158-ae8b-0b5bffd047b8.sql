ALTER TABLE public.students
  ADD COLUMN IF NOT EXISTS assigned_task text,
  ADD COLUMN IF NOT EXISTS success_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS progress_percent integer NOT NULL DEFAULT 0;