-- Per-student per-task progress tracking
CREATE TABLE public.student_task_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  task_id TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  success_count INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Not Started',
  last_played_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (student_id, task_id)
);

ALTER TABLE public.student_task_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read student_task_progress"
ON public.student_task_progress FOR SELECT TO public USING (true);

CREATE POLICY "Public insert student_task_progress"
ON public.student_task_progress FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Public update student_task_progress"
ON public.student_task_progress FOR UPDATE TO public USING (true);

CREATE POLICY "Public delete student_task_progress"
ON public.student_task_progress FOR DELETE TO public USING (true);

CREATE INDEX idx_stp_student ON public.student_task_progress(student_id);
CREATE INDEX idx_stp_task ON public.student_task_progress(task_id);