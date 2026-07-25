-- Stage 5: replace the "task request" contact-form hack — structured fields
-- were serialized into a contact_messages.message text blob (prefixed with
-- "Task: ", "Priority: ", etc.) and re-parsed with brittle string matching.
-- Real columns now, same as everything else.

create table public.task_requests (
  id uuid primary key default gen_random_uuid(),
  requester_name text not null,
  requester_email text not null,
  title text not null,
  description text,
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  category text not null default 'project' check (category in ('academic', 'project', 'personal', 'work')),
  due_date date,
  due_time text,
  estimated_duration text,
  budget text,
  additional_notes text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.task_requests enable row level security;

create policy "Anyone can submit a task request"
  on public.task_requests for insert
  with check (true);
-- No select/update/delete policy — admin-only, via the admin gateway
-- (service role), same pattern as contact_messages.

create trigger update_task_requests_updated_at
  before update on public.task_requests
  for each row execute function public.update_updated_at_column();
