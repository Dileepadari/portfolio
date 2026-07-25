-- Removes a temporary diagnostic function used to debug an RLS-propagation
-- delay while verifying the task_requests migration — not needed going forward.
drop function if exists public.__diag_policies(text);
