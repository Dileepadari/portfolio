-- Tasks/Schedules were the built-in task-and-calendar manager behind
-- Schedule.tsx. The user now manages tasks/scheduling in a separate app
-- (WorkOS) and confirmed dropping the existing 11 tasks / 14 schedule rows
-- here rather than exporting them — this app no longer needs the feature.

drop table if exists public.schedules cascade;
drop table if exists public.tasks cascade;
