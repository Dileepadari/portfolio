-- Removes the temporary diagnostic functions used to discover that RLS was
-- disabled on projects/contact_messages — not needed going forward.
drop function if exists public.__diag_policies2(text);
drop function if exists public.__diag_rls_enabled(text);
