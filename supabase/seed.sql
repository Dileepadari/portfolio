-- Local development seed. GENERATED - do not edit by hand.
--
--   node scripts/build-seed.mjs
--
-- A mirror of the hosted project's **public** content, read with the anon key,
-- so a local `supabase db reset` reproduces the real site rather than a toy
-- fixture. 139 rows across 9 tables.
--
-- Because it is read as anon, it contains exactly what any visitor to the live
-- site can already see. Draft posts, the contact inbox and the admin user table
-- are invisible to that role and cannot appear here.
--
-- Applied by `supabase db reset`. Never applied to the hosted project.

insert into public.personal_info (name, title, bio, location, email, phone, website, linkedin, github, instagram, youtube, twitter, avatar_url, medium, codeforces, highlights, resume_url) values
  ('Dileep Kumar Adari', 'Software Engineer @ Chubb | B.Tech CS (Honors) @ IIITH<br />GSoC 2026 Mentor & 2025 Contributor @ Joomla!', 'Software Engineer at Chubb and open-source enthusiast specializing in full-stack engineering, distributed systems, and human-centered software design. I architect scalable cloud-native applications using React, Next.js, FastAPI, RabbitMQ, and modern web technologies, with a strong focus on high availability, performance, and intuitive user experiences. Passionate about solving complex distributed systems challenges and mentoring open-source contributors.', 'Visakhapatnam, Andhra Pradesh, India', 'adaridileep@gmail.com', '+91 7330701217', 'https://dileepadari.dev', 'https://www.linkedin.com/in/a-dk/', 'https://github.com/Dileepadari', 'https://www.instagram.com/dileepadari', 'https://www.youtube.com/@dileepadari5182', 'https://twitter.com/Dileepadari1', '', 'https://medium.com/@adaridileep/about', 'https://codeforces.com/profile/adaridileep', '[{"icon":"Layers","title":"Full-Stack & Distributed Systems","description":"Architecting resilient, scalable web platforms, APIs, and event-driven microservices using React, Next.js, FastAPI, RabbitMQ, and PostgreSQL."},{"icon":"GitBranch","title":"Open Source Leadership & Mentorship","description":"Google Summer of Code 2025 Contributor & 2026 Mentor at Joomla! CMS, engineering visual graph workflow engines and driving community collaboration."},{"icon":"Palette","title":"Human-Centered Design & HCI","description":"Applied research at SERC Lab under Dr. Raman Saxena, applying design thinking, usability engineering, and accessibility across enterprise systems with 4,000+ users."},{"icon":"Server","title":"SRE & Cloud Reliability","description":"Engineering high-availability cloud infrastructure, observability telemetry, and fault-tolerant distributed systems at Chubb."}]'::jsonb, null)
on conflict do nothing;

insert into public.projects (title, description, github_url, live_url, image_url, images, featured, order_index, is_contributed, stars, forks, language, language_color, category, tags, slug, image_url_light, hero_url, hero_url_light, images_light, tagline, overview, problem, features, metrics, tech_stack, architecture, getting_started, readme, docs_url, demo_url, project_role, timeline, status) values
  ('NFSDrive', 'A distributed network file system written from scratch in C over POSIX sockets, with a central naming server, multi-threaded storage servers, asynchronous replication and automated failover.', 'https://github.com/Dileepadari/NFSDrive', null, 'https://mystorage.dileepadari.dev/images/portfolio/ccee3f83-b73f-4234-a4e0-f878ead06f2e-errors.png', array['https://mystorage.dileepadari.dev/images/portfolio/ccee3f83-b73f-4234-a4e0-f878ead06f2e-errors.png', 'https://mystorage.dileepadari.dev/images/portfolio/5749e4a9-79fc-4f92-981f-afd8a05a3aa4-files.png', 'https://mystorage.dileepadari.dev/images/portfolio/fce51d98-a9eb-442e-a7d9-6a409e386604-namespace.png', 'https://mystorage.dileepadari.dev/images/portfolio/95fb6f78-26e4-4604-ba85-ff12104d29c2-readwrite.png'], false, 4, false, 0, 0, 'C', '#555555', 'distributed systems', array['C', 'POSIX', 'TCP Sockets', 'Concurrency', 'Distributed Systems', 'Fault Tolerance'], 'nfsdrive', 'https://mystorage.dileepadari.dev/images/portfolio/34e5f4fb-8052-43db-a3e3-ad3d80857070-errors.png', 'https://mystorage.dileepadari.dev/images/portfolio/5749e4a9-79fc-4f92-981f-afd8a05a3aa4-files.png', 'https://mystorage.dileepadari.dev/images/portfolio/5bf63bf2-a017-47c8-bf00-88e479c02c03-files.png', array['https://mystorage.dileepadari.dev/images/portfolio/34e5f4fb-8052-43db-a3e3-ad3d80857070-errors.png', 'https://mystorage.dileepadari.dev/images/portfolio/5bf63bf2-a017-47c8-bf00-88e479c02c03-files.png', 'https://mystorage.dileepadari.dev/images/portfolio/f5521fcd-58cb-4c55-811c-0a7d36ddffb6-namespace.png', 'https://mystorage.dileepadari.dev/images/portfolio/66d37d9a-1edc-4cd8-90e0-c376878a6b06-readwrite.png'], 'A distributed network file system in C. Files live on storage servers spread across machines, a naming server tracks which server holds what, and clients work against one shared namespace without knowing or caring where a file sits.', 'Every export is mounted into a single path tree. A client reads
`/data/reports/q3.csv` the same way whether that file is on one server or one of
fifty, and it keeps working when the server holding it goes down.

That sentence is easy to write and hard to mean. Making it true is three
problems that only exist once the file system is distributed: the namespace has
to be rebuilt from the servers themselves after a naming server restart, because
nothing else knows the truth; a write has to hold exclusion across a thread
handoff, because the acknowledgement goes out before the commit lands; and a
storage server that dies has to be noticed by something other than the client
waiting on it.

The interesting code is therefore not the file operations. It is the registry,
the heartbeats, the replication, and the locking - and all of it is concurrent,
which is why this repository runs its test suite three times: once normally,
once under the address and undefined-behaviour sanitizers, and once under
ThreadSanitizer.

For architecture, the wire protocol, and setup, see **[DEVDOC.md](./DEVDOC.md)**.', null, '[{"title":"One namespace across many servers","description":"- Each storage server exports a local directory at a mount point, and everything under it appears in the global tree at that point. - Clients address files by global path only. Nothing in a client command names a host, a port, or a directory on disk. - ls lists the whole namespace, or any subtree of it, across every server. - Adding a storage server while the system is running makes its files available immediately. No restart, no configuration change anywhere else. - The naming server can be restarted underneath a running cluster. Storage servers notice and re-register themselves, and the namespace rebuilds within a few seconds without anyone touching them."},{"title":"File operations","description":"- create, mkdir, delete, rmdir, copy, read, write, put, echo and stat. - create builds any missing parent directories, so making a file several levels deep is one command. - copy handles files and whole directory trees, including copying between two different storage servers, and copying into an existing directory places the source inside it rather than replacing it. - read prints to stdout or saves to a local file; write appends, put replaces. Both take a local file or stdin."},{"title":"Files of any size","description":"- Transfers are streamed in chunks, so a file is never held in memory in one piece and there is no size beyond which a transfer stops working. - A large write is acknowledged as soon as the data is safely on disk, with the final commit finishing in the background. The client is told which of the two happened rather than being left to guess. - Writes are staged and swapped into place atomically. A transfer that dies half way leaves the previous contents intact rather than a truncated file."},{"title":"Concurrent access","description":"- Many clients can read the same file at once. - One writer at a time per file. A second writer is told the file is busy immediately instead of being left to wait. - Locking is per file, so a slow write to one file does not block anything on another."},{"title":"Redundancy and failover","description":"- A storage server can run as a replica of another. It mirrors the primary''s namespace and contents. - A replica joining a primary that already holds files is seeded with them, rather than starting empty and staying behind. - Every change to a primary is mirrored to its replicas, including file contents written directly by clients. - When a primary stops answering, reads are served from a live replica and the replica is promoted so writes keep working. When the primary comes back it reclaims its namespace. - A write is never accepted by a stand-in replica that has not been promoted, because the primary would come back not knowing about it."},{"title":"Operational visibility","description":"- servers shows every storage server: endpoint, mount point, online state, whether it is a primary or a replica, and how many paths it holds. - Every component logs to stderr and optionally to a file, with one line per event and a configurable level. - Errors are named, not numbered at the user: \"directory not empty\" rather than a bare code, with the code alongside for scripts."},{"title":"Built for scripting","description":"- Any command can be run directly from the shell, not just from the interactive prompt: nfs-client read /data/notes.txt. - Exit status is zero on success and non-zero on failure, so commands compose in a script without output parsing. - --quiet suppresses progress notes so stdout carries only the result."}]'::jsonb, '[{"label":"Tests","value":"113"},{"label":"Scenarios","value":"56"}]'::jsonb, '[{"name":"C11"},{"name":"POSIX threads"},{"name":"GNU Make"}]'::jsonb, null, '```bash
make
```

Then, in three terminals:

```bash
bin/nfs-naming-server
bin/nfs-storage-server --root ~/nfs-data --port 8801 --mount /data
bin/nfs-client
```

```
nfs> create /data/notes.txt
nfs> echo /data/notes.txt hello there
nfs> read /data/notes.txt
hello there
nfs> ls /data
```

Full setup, including replicas and multi-machine deployment, is in
[DEVDOC.md](./DEVDOC.md#local-development).', null, null, null, null, null, 'Shipped'),
  ('WorkOS', 'An all-in-one team workspace featuring Notion-style block editing, Kanban project boards, task dependency management, meeting agendas, encrypted secret storage, and real-time collaboration.', 'https://github.com/Dileepadari/workos', 'https://workos.dileepadari.dev', null, '{}', false, 7, false, 0, 0, 'TypeScript', '#3178c6', 'web development', array['React 19', 'Vite', 'Tailwind CSS', 'Supabase', 'Radix UI', 'Block Editor'], 'workos', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
  ('RT-HRM', 'A real-time heart rate monitoring solution over Bluetooth Low Energy, pairing an Android application with a PHP-based web dashboard for viewing the readings.', 'https://github.com/Dileepadari/RT-HRM', null, null, null, false, 33, false, 0, 0, 'Kotlin', '#A97BFF', 'mobile development', null, 'rt-hrm', null, null, null, null, 'A comprehensive, real-time BLE heart rate monitoring solution featuring an Android application and a PHP-based web dashboard.', null, null, null, null, null, null, null, null, null, null, null, null, null),
  ('Jagruthi', 'A campus-deployed, voice-first conversational AI running on Raspberry Pi', 'https://github.com/Dileepadari/jagruthi', null, null, null, false, 34, false, 0, 0, 'Python', '#3572A5', 'iot', null, 'jagruthi', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
  ('MiniShell', 'A POSIX-compliant Unix shell in C supporting command piping, multi-level I/O redirection, custom built-ins (warp, peek, seek, proclore), background job controls, and signal handlers.', 'https://github.com/Dileepadari/MiniShell', null, 'https://mystorage.dileepadari.dev/images/portfolio/a1ce8750-0df9-4ad9-a883-d59b04ebe8f9-builtins.png', array['https://mystorage.dileepadari.dev/images/portfolio/a1ce8750-0df9-4ad9-a883-d59b04ebe8f9-builtins.png', 'https://mystorage.dileepadari.dev/images/portfolio/a2485639-4e6a-4382-89f0-5d921f031e3b-errors.png', 'https://mystorage.dileepadari.dev/images/portfolio/ee619cc8-48b2-4cdf-8da1-3541bd9e0004-help.png', 'https://mystorage.dileepadari.dev/images/portfolio/432c3099-9ea9-49a6-9628-72f602dc1356-history.png', 'https://mystorage.dileepadari.dev/images/portfolio/620b8de1-d346-4d38-aa9f-00b3290995e9-jobs.png', 'https://mystorage.dileepadari.dev/images/portfolio/743ff6da-15e9-46b1-a4ff-87102b67287e-pipelines.png'], false, 12, false, 0, 0, 'C', '#555555', 'systems programming', array['C', 'POSIX', 'System Calls', 'Process Management', 'Command Piping', 'I/O Redirection'], 'minishell', 'https://mystorage.dileepadari.dev/images/portfolio/16534b39-a7ee-439c-be54-f2307f943e41-builtins.png', 'https://mystorage.dileepadari.dev/images/portfolio/a2485639-4e6a-4382-89f0-5d921f031e3b-errors.png', 'https://mystorage.dileepadari.dev/images/portfolio/afe0ace8-567d-4bb5-ac8e-c0594cb1ace6-errors.png', array['https://mystorage.dileepadari.dev/images/portfolio/16534b39-a7ee-439c-be54-f2307f943e41-builtins.png', 'https://mystorage.dileepadari.dev/images/portfolio/afe0ace8-567d-4bb5-ac8e-c0594cb1ace6-errors.png', 'https://mystorage.dileepadari.dev/images/portfolio/6f1457e4-5cbd-4bbb-8d3c-e8a5a762dcee-help.png', 'https://mystorage.dileepadari.dev/images/portfolio/18df0a00-9d7d-465a-92ec-c9ed99cda1d8-history.png', 'https://mystorage.dileepadari.dev/images/portfolio/852e44e0-a677-460e-9649-289f882ea44e-jobs.png', 'https://mystorage.dileepadari.dev/images/portfolio/c98b09e2-a930-45a0-a2f3-5c07796358de-pipelines.png'], 'A Unix shell for Linux, written in C: pipelines, redirection, real job control, a hand-written line editor, and builtins with names of their own.', 'Writing a shell is the exercise that makes the operating system stop being an
abstraction. Every feature is a system call with an edge case attached: a
pipeline is `fork`, `pipe` and `dup2` in the right order; a background job is a
process group, a `setpgid` race between parent and child, and a `SIGCHLD`
handler that must not call anything unsafe; Ctrl-C is terminal ownership rather
than a keystroke.

MiniShell is a working shell rather than a demo of those calls. It has line
editing with history and tab completion, real job control with process groups
and terminal handover, and a set of builtins with names of their own: `warp` for
cd, `peek` for ls, `seek` for find, `proclore` for process details, `pastevents`
for history.

The part worth pointing at is the testing. A shell is hard to test because the
interesting half only exists when stdin is a terminal - the prompt, the line
editor, Ctrl-C, job control. So the suite opens a **pseudo-terminal**, types at
it, and waits for what should come back. That is what makes the 22 interactive
checks possible, and it is the same machinery the session images below are
captured with.', null, '[{"title":"Command language","description":"- Pipelines of any length: peek -la | grep .md | wc -l - Redirection with <, > and >>, on any command in a pipeline - Several commands per line with ;, and background execution with & - Single quotes, double quotes and backslash escapes, with the usual rules: echo ''a $b'' prints a $b, echo \"a $HOME\" expands - Variables: $HOME, ${HOME}, $? for the last exit status, $$ for the shell''s pid - Filename patterns: peek .md, warp src//, cat log?.txt. A pattern that matches nothing is passed through untouched rather than vanishing - ~ and ~user expand to the shell home and to that account''s home"},{"title":"Builtins","description":"Anything that is not a builtin is looked up on PATH."},{"title":"Job control","description":"- sleep 30 & runs in the background and prints a job number - Ctrl-C interrupts the foreground job and leaves the shell running - Ctrl-Z stops it and hands you back the prompt; activities then shows it as Stopped, and bg 1 or fg 1 picks it up again - Finished background jobs are reported before the next prompt, with how they ended: [1] done, [1] exited with 2, [1] terminated by Terminated - A command that takes more than two seconds has its name and duration shown in the next prompt: <you@machine:~ sleep : 5s>"},{"title":"Line editing","description":"The prompt is a real editor, not a raw read:"},{"title":"Running non-interactively","description":"Piped and -c input skip the editor and read plain lines, which is what makes the shell scriptable and testable."}]'::jsonb, '[{"label":"Checks","value":"246"}]'::jsonb, '[{"name":"C11"},{"name":"Linux"},{"name":"GNU Make"}]'::jsonb, null, '```sh
make          # builds bin/minishell
./bin/minishell
```

The prompt shows your user, host and working directory:

```
<you@machine:~/projects>
```

`~` is the directory the shell was started in, not your account''s home. Type
`help` for the builtin list, `help <name>` for one of them, and `exit` or Ctrl-D
to leave.', null, null, null, null, null, 'Shipped'),
  ('GridWatch', 'An IoT-enabled energy monitoring and conservation system combining smart sensor data telemetry, interactive consumption dashboards, and remote appliance switching to prevent grid overload.', 'https://github.com/Dileepadari/GridWatch', 'https://gridwatch.dileepadari.dev', 'https://mystorage.dileepadari.dev/images/portfolio/b64dfbd4-6a04-412f-900f-3000fb3292e5-01-dashboard.png', array['https://mystorage.dileepadari.dev/images/portfolio/b64dfbd4-6a04-412f-900f-3000fb3292e5-01-dashboard.png', 'https://mystorage.dileepadari.dev/images/portfolio/158588bd-7799-4946-b27a-6ef2dacaa0c1-02-health.png', 'https://mystorage.dileepadari.dev/images/portfolio/8d6a230f-072a-45f3-9d10-15ccfe5fe74f-03-statistics.png', 'https://mystorage.dileepadari.dev/images/portfolio/9e39b5d2-b3f8-40c0-a99c-7c7596c36b4e-04-circuits.png', 'https://mystorage.dileepadari.dev/images/portfolio/a4b54453-11ab-4ccd-a18e-815cea53cdde-05-notifications.png', 'https://mystorage.dileepadari.dev/images/portfolio/4aee29a5-9bc2-4248-9551-2daf174e4d78-06-profile.png'], false, 14, false, 0, 0, 'Python', '#3572A5', 'iot', array['IoT', 'Flask', 'Energy Monitoring', 'Sensors', 'Appliance Control', 'Visualization'], 'gridwatch', 'https://mystorage.dileepadari.dev/images/portfolio/b56b4c88-67e6-47bc-b1df-ce3b8291b3bb-01-dashboard.png', 'https://mystorage.dileepadari.dev/images/portfolio/158588bd-7799-4946-b27a-6ef2dacaa0c1-02-health.png', 'https://mystorage.dileepadari.dev/images/portfolio/069c1417-3ef9-4a64-81c7-35851f6e360c-02-health.png', array['https://mystorage.dileepadari.dev/images/portfolio/b56b4c88-67e6-47bc-b1df-ce3b8291b3bb-01-dashboard.png', 'https://mystorage.dileepadari.dev/images/portfolio/069c1417-3ef9-4a64-81c7-35851f6e360c-02-health.png', 'https://mystorage.dileepadari.dev/images/portfolio/d71beefb-3cb8-4fe5-a11c-50a6b02042cd-03-statistics.png', 'https://mystorage.dileepadari.dev/images/portfolio/64656d74-715e-4abf-86f3-aa349d80c565-04-circuits.png', 'https://mystorage.dileepadari.dev/images/portfolio/85828dbb-fe45-4089-a257-5d5c3133d54e-05-notifications.png', 'https://mystorage.dileepadari.dev/images/portfolio/84100222-70e7-49ab-a03c-ed6b892192b9-06-profile.png'], 'A web front end for a smart energy grid rig: it shows what every appliance on the circuit is doing, scores its condition, raises alerts when something looks wrong, and lets a resident switch appliances on and off from anywhere.', 'A teaching rig is only useful if you can see what it is doing, and hardware has a
habit of being unavailable exactly when you want to demonstrate it. The boards
are off, the gateway is down, the channel has not been written to for a week.

So the interesting design decision here is that **GridWatch never has nothing to
show**. It reads live telemetry when the channel answers, falls back to the last
cached reading when it does not, and falls back again to a deterministic
simulation derived from each appliance''s rated draw. The badges at the top of
every page say which of the three you are looking at, so a simulated reading is
never mistaken for a real one.

The health score works the same way: it is not a sensor value but a comparison
between what an appliance is drawing and what it should draw at its current
setting. That is what makes "Motor_1 is drawing power while switched off,
possible power theft" something the app can say on its own.', null, '[{"title":"Dashboard","description":"- Every appliance as a card: power, speed, direction, current draw, temperature. - Switch power, speed and direction from the card. The change is pushed to the hardware and the page updates without a reload. - Summary tiles for appliances on, total draw, overall health and the age of the most recent reading. - The page keeps polling in the background, and stops while the tab is hidden."},{"title":"Health","description":"- A condition score of 1 to 3 per appliance, shown as a chart and as a table. - The rig reports 0 for appliances it has not scored; those gaps are filled in and labelled rather than left blank."},{"title":"Statistics","description":"- Current draw per appliance over time, all series on one axis with a shared crosshair. - Latest, minimum, maximum and mean per appliance underneath."},{"title":"Notifications","description":"- Raised automatically: an appliance drawing power while switched off reads as theft; draw drifting from the rated current reads as wear. - The same alert is not raised twice within half an hour. - Mark individual alerts read or unread, or clear them all."},{"title":"Profile","description":"- Change the ThingSpeak channel, field number and API keys. - Set the appliance list and its load-shedding order. - Change your password. - See the last ten control commands and whether they were delivered."},{"title":"Administration","description":"- An administrator sees every resident: channel, appliances on, total draw, health, unread alerts and whether their data is live."}]'::jsonb, '[{"label":"Quality","value":"pytest 48 tests"}]'::jsonb, '[{"name":"Python 3.11+"},{"name":"Flask"},{"name":"SQLite"},{"name":"ThingSpeak"}]'::jsonb, null, null, null, null, null, null, null, 'Shipped'),
  ('rgbOS', 'Source project. Description not yet written.', 'https://github.com/Dileepadari/rgbOs', 'https://rgbos.dileepadari.dev', null, null, false, 39, false, 0, 0, 'TypeScript', '#3178c6', 'web development', null, 'rgbos', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
  ('BlogNest', 'A modern blogging CMS with rich markdown writing tools, draft management, categorical organization, tag discovery, nested comment discussions, and visitor bookmarks.', 'https://github.com/Dileepadari/BlogNest', null, 'https://mystorage.dileepadari.dev/images/portfolio/6a26f2be-e9ae-404f-954f-1624e45525fa-01-home.png', array['https://mystorage.dileepadari.dev/images/portfolio/6a26f2be-e9ae-404f-954f-1624e45525fa-01-home.png', 'https://mystorage.dileepadari.dev/images/portfolio/1cce5250-7b04-4a10-9dbf-94582b4c85e8-02-all-posts.png', 'https://mystorage.dileepadari.dev/images/portfolio/f3320359-6ea6-4ae0-950c-1104c323a2be-03-post.png', 'https://mystorage.dileepadari.dev/images/portfolio/304be536-9e88-4ce5-84ea-1e38e300fb3b-04-comments.png', 'https://mystorage.dileepadari.dev/images/portfolio/073b44cf-35dd-44b8-8791-0c74065f46a0-05-dashboard.png', 'https://mystorage.dileepadari.dev/images/portfolio/41fcd139-c705-47b7-8d69-7618d33cda45-06-editor.png', 'https://mystorage.dileepadari.dev/images/portfolio/6a7a588d-fafd-48df-aa70-ed17901f931f-07-categories.png', 'https://mystorage.dileepadari.dev/images/portfolio/bfe66eff-eb72-4dfd-a798-c90956530b4b-08-author.png'], false, 18, false, 0, 0, 'JavaScript', '#f1e05a', 'web development', array['React', 'Node.js', 'Express', 'MongoDB', 'Markdown', 'Blogging'], 'blognest', 'https://mystorage.dileepadari.dev/images/portfolio/f3e9853b-2b48-4a54-a007-67fdf1a05d99-01-home.png', 'https://mystorage.dileepadari.dev/images/portfolio/1cce5250-7b04-4a10-9dbf-94582b4c85e8-02-all-posts.png', 'https://mystorage.dileepadari.dev/images/portfolio/c0c73027-2bbb-4b32-8273-d7d4a1665eec-02-all-posts.png', array['https://mystorage.dileepadari.dev/images/portfolio/f3e9853b-2b48-4a54-a007-67fdf1a05d99-01-home.png', 'https://mystorage.dileepadari.dev/images/portfolio/c0c73027-2bbb-4b32-8273-d7d4a1665eec-02-all-posts.png', 'https://mystorage.dileepadari.dev/images/portfolio/b50469b8-c21c-4947-92dc-757ad5895e56-03-post.png', 'https://mystorage.dileepadari.dev/images/portfolio/3bfb3a01-ac95-4618-a924-4b6938662f0d-04-comments.png', 'https://mystorage.dileepadari.dev/images/portfolio/cf6ad948-4551-41f0-8c4c-a62b96eadeba-05-dashboard.png', 'https://mystorage.dileepadari.dev/images/portfolio/3952ec4f-e2b9-4dc9-a91f-0078afea2410-06-editor.png', 'https://mystorage.dileepadari.dev/images/portfolio/2fd13c92-506f-4592-aeeb-4ee59c43386b-07-categories.png', 'https://mystorage.dileepadari.dev/images/portfolio/43dbbd5b-e979-4e93-9068-1dd90f8d7d68-08-author.png'], 'A full stack blogging platform: write in a rich text editor, publish or keep it a draft, and let readers comment, reply, like, bookmark and follow.', 'A blog is the standard "full stack" exercise, and most versions of it stop at create, read, update and delete over a posts table. The parts that make a blog actually usable are the ones that get skipped, and they are where the interesting decisions live.

A draft has to be genuinely invisible: not just filtered from listings, but returning 404 to anyone who guesses the URL, while still loading for its author in the editor. A published permalink has to survive its title being edited, or every link anyone shared breaks. A rich text editor writes HTML into a database that later feeds `dangerouslySetInnerHTML`, so there is exactly one place the sanitiser can go and exactly one way to get it wrong. A comment thread needs a depth rule, because "reply to a reply to a reply" has no natural end. Deleting a post on MongoDB means deleting its replies before its comments, because there are no cascades to lean on.

BlogNest is built around getting those right, and the reasoning for each is written down in [DEVDOC.md](./DEVDOC.md) rather than left in the code for the next person to reverse engineer.', 'It started as the standard Next.js blog tutorial and kept going past the point where the tutorial stops.

The turns that changed it were all the same shape: a feature that looks like one field turns out to be a rule. Adding drafts meant deciding what a draft URL does for a stranger. Adding an editor meant deciding where HTML gets sanitised, and the answer is on the way in, once, rather than on every render. Adding likes and comment counts meant deciding whether to count rows on every request or denormalise a counter and keep it honest, and the counter won because sorting by "most discussed" is a query you cannot write against a count you compute in application code.

The result is a blog you can actually run, with the awkward cases handled rather than avoided.', '[{"title":"Writing and publishing a post","description":"Write in the header, or New post from the dashboard."},{"title":"Commenting","description":"Comments are open on any published post to anyone signed in. Replies go one level deep: a reply to a reply attaches to the same root, because an unbounded thread has no sensible layout at 390px wide."},{"title":"Liking, saving and following","description":"Like is public and drives the most-liked ordering. Save is a private bookmark, collected under Dashboard > Bookmarks. Follow an author from their profile or from any byline, and their follower count updates immediately."},{"title":"Your dashboard","description":"Dashboard shows published count, drafts, total views, likes, comments received, followers and bookmarks saved."},{"title":"Searching","description":"The header search shows the top six matches as you type. Press enter for the full library, where you can search titles, body text and tags together, filter by category, and sort by newest, oldest, most read or most discussed."}]'::jsonb, null, '[{"name":"Next.js 14"},{"name":"React 18"},{"name":"Prisma"},{"name":"MongoDB"},{"name":"NextAuth"},{"name":"Zod"},{"name":"e2e"}]'::jsonb, null, 'You need Node 18 or newer and a MongoDB **replica set**. Prisma needs a replica set for transactions; Atlas gives you one by default, and [DEVDOC.md](./DEVDOC.md#local-development) has the local Docker one-liner.

```bash
git clone https://github.com/Dileepadari/BlogNest.git
cd BlogNest
npm install
cp .env.example .env      # set DATABASE_URL and NEXTAUTH_SECRET
npm run db:push           # create the collections and indexes
npm run db:seed           # 4 authors, 12 posts, comments, likes, bookmarks
npm run dev               # http://localhost:3000
```

### Demo accounts

`npm run db:seed` creates four authors with a term of posts, comments, likes, bookmarks and follows between them.

| Role | Email | Password |
|---|---|---|
| Admin | `demo@example.com` | `DemoPass123!` |
| User | `maya@example.com` | `DemoPass123!` |
| User | `tomas@example.com` | `DemoPass123!` |
| User | `reader@example.com` | `DemoPass123!` |

Every address is under `example.com`, which RFC 2606 reserves for exactly this.

### End to end checks

```bash
npm run dev          # in one terminal
./scripts/e2e.sh     # 50 checks against the real HTTP API
```

The script signs in through NextAuth, exercises the guards, writes and deletes its own throwaway account, and is safe to run repeatedly. Do not point it at production.', null, null, null, null, null, 'Shipped'),
  ('RookDB', 'A lightweight, high-performance relational database storage engine implemented in Rust, featuring custom buffer pool management, slotted-page heap files, concurrency control, and query execution operators.', 'https://github.com/Dileepadari/RookDB', 'https://rookdb.github.io/RookDB/', null, '{}', true, 1, true, 0, 0, 'Rust', '#dea584', 'distributed systems', array['Rust', 'Storage Engine', 'Buffer Manager', 'Heap Files', 'Query Execution', 'DBMS'], 'rookdb', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
  ('IIIT Resources', 'A collaborative repository for IIIT Hyderabad students to discover, index, upvote and share lecture notes, previous exam papers, assignment solutions and reference links by course.', 'https://github.com/Dileepadari/NeverMind-HACKIIITH', null, null, '{}', false, 16, false, 0, 0, 'TypeScript', '#3178c6', 'web development', array['Next.js', 'React', 'Prisma', 'PostgreSQL', 'Full-Stack', 'Community Portal'], 'iiit-resources', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
  ('Trendify', 'An automated trend scraping engine that captures real-time trending topics on X, records timestamped snapshots with egress routing details, and provides historical trend comparison charts.', 'https://github.com/Dileepadari/Trendify', null, null, '{}', false, 35, false, 0, 0, 'Python', '#3572A5', 'backend', array['Python', 'Flask', 'Web Scraping', 'Analytics', 'Trend Tracking'], 'trendify', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
  ('Music Mania', 'A web platform for music enthusiasts to search the iTunes catalogue, create personalized playlists, rate songs and albums, and share community reviews.', 'https://github.com/Dileepadari/MusicMania', null, null, '{}', false, 36, false, 0, 0, 'Python', '#3572A5', 'web development', array['Python', 'Flask', 'SQLite', 'iTunes API', 'Music Reviews'], 'music-mania', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, 'Shipped'),
  ('TimeTrack', 'A drift-resistant web stopwatch using high-resolution timestamps (performance.now()) to maintain precision even across background browser tab throttling, featuring lap analytics and CSV exports.', 'https://github.com/Dileepadari/TimeTrack', null, null, '{}', false, 37, false, 0, 0, 'TypeScript', '#3178c6', 'web development', array['React', 'Vite', 'Tailwind CSS', 'Stopwatch', 'Export Utility'], 'timetrack', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
  ('IIITH Resources Hub', 'Source project. Description not yet written.', 'https://github.com/Dileepadari/resources.iiit.ac.in', null, null, null, false, 44, false, 0, 0, 'JavaScript', '#f1e05a', 'web development', null, 'iiith-resources-hub', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
  ('WellnessHub', 'A terminal-inspired productivity and wellness console consolidating fitness, health metrics, insurance and personal finance into dense tables with inline sparklines and streak tracking.', 'https://github.com/Dileepadari/WellnessHub', null, null, '{}', false, 20, false, 0, 0, 'TypeScript', '#3178c6', 'web development', array['React', 'Tailwind CSS', 'Sparklines', 'Gamification', 'Habit Tracking'], 'wellnesshub', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
  ('VoteArena', 'A zero-friction real-time audience voting system for conferences and classrooms. Participants scan a QR code without registration to submit votes that update live on the main display wall.', 'https://github.com/Dileepadari/VoteArena', null, null, '{}', false, 22, false, 0, 0, 'JavaScript', '#f1e05a', 'web development', array['React', 'Vite', 'Express', 'WebSockets', 'Real-Time Polling'], 'votearena', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
  ('Virtual Labs VS Code Web Extension', 'A custom web extension for VS Code enabling 1,000+ educators and students to author, validate, test, and deploy interactive Virtual Labs science simulation experiments directly within the browser.', 'https://github.com/Dileepadari/virtual_web_trial', 'https://marketplace.visualstudio.com/items?itemName=Virtual-Labs.VirtualLabs', null, '{}', false, 11, false, 0, 0, 'TypeScript', '#3178c6', 'developer tools', array['TypeScript', 'VS Code Extension API', 'Webpack', 'Virtual Labs', 'Web IDE'], 'virtual-labs-vs-code-web-extension', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
  ('TurtleArt Generator', 'A collection of 35 procedural geometric artworks generated using Python standard turtle library, featuring CLI customization, dynamic palette generation, and vector SVG exports.', 'https://github.com/Dileepadari/Turtle_projects', null, null, '{}', false, 38, false, 0, 0, 'Python', '#3572A5', 'creative coding', array['Python', 'Generative Art', 'Turtle Graphics', 'SVG Export', 'Algorithms'], 'turtleart-generator', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
  ('MoneyOS', 'A comprehensive personal finance and budget manager tracking expenses, categorical income, long-term savings goals, recurring EMI schedules, group expense splits, and live net worth calculations.', 'https://github.com/Dileepadari/MoneyOs', 'https://moneyos.dileepadari.dev', 'https://mystorage.dileepadari.dev/images/portfolio/971dc4bd-cc18-4878-a2d9-a403a8b5b509-01-dashboard.png', array['https://mystorage.dileepadari.dev/images/portfolio/971dc4bd-cc18-4878-a2d9-a403a8b5b509-01-dashboard.png', 'https://mystorage.dileepadari.dev/images/portfolio/be09e7bc-af91-459d-abdb-18a80821c917-02-transactions.png', 'https://mystorage.dileepadari.dev/images/portfolio/f8ad7501-d73b-4ca4-813e-1b058aa34f91-03-accounts.png', 'https://mystorage.dileepadari.dev/images/portfolio/5aedc276-a25b-44a3-a098-09f2c259cba1-04-reports.png', 'https://mystorage.dileepadari.dev/images/portfolio/c9943089-0519-4848-93f5-0a8186df85a1-05-budgets.png', 'https://mystorage.dileepadari.dev/images/portfolio/72d04d65-f1d9-4769-a6c8-6de1e4e0e074-06-goals.png', 'https://mystorage.dileepadari.dev/images/portfolio/aebb3e1d-af04-47d5-b2cc-83e8b1c832dc-07-emis-loans.png', 'https://mystorage.dileepadari.dev/images/portfolio/71fc2fed-2d69-4a33-9f0c-e12327006f98-08-subscriptions.png', 'https://mystorage.dileepadari.dev/images/portfolio/889d833a-984d-4198-9f2b-7f453e14bda1-09-bill-reminders.png', 'https://mystorage.dileepadari.dev/images/portfolio/ae1dc265-ee99-4de9-891d-f7b4ebfd1911-10-settings.png'], false, 9, false, 0, 0, 'TypeScript', '#3178c6', 'web development', array['React', 'Tailwind CSS', 'Radix UI', 'Vite', 'Financial Analytics', 'Budgeting'], 'moneyos', 'https://mystorage.dileepadari.dev/images/portfolio/97873fc4-863d-4901-a441-70e494ad9fea-01-dashboard.png', 'https://mystorage.dileepadari.dev/images/portfolio/be09e7bc-af91-459d-abdb-18a80821c917-02-transactions.png', 'https://mystorage.dileepadari.dev/images/portfolio/4daefb7c-90b8-4223-8cea-890cf1114fe3-02-transactions.png', array['https://mystorage.dileepadari.dev/images/portfolio/97873fc4-863d-4901-a441-70e494ad9fea-01-dashboard.png', 'https://mystorage.dileepadari.dev/images/portfolio/4daefb7c-90b8-4223-8cea-890cf1114fe3-02-transactions.png', 'https://mystorage.dileepadari.dev/images/portfolio/0f2e2092-8aae-4c70-95d7-0c3a4d126794-03-accounts.png', 'https://mystorage.dileepadari.dev/images/portfolio/8abfde4e-a3c6-4bb2-91df-02cbb7b4c755-04-reports.png', 'https://mystorage.dileepadari.dev/images/portfolio/3f5d36d0-edef-4c78-b00b-ef043ae3734d-05-budgets.png', 'https://mystorage.dileepadari.dev/images/portfolio/7cce4eeb-8671-4a61-b05d-83859c3ba988-06-goals.png', 'https://mystorage.dileepadari.dev/images/portfolio/93eb3b1f-6292-4a10-a468-eade0608e6fc-07-emis-loans.png', 'https://mystorage.dileepadari.dev/images/portfolio/ede4d82f-48f5-4b1c-9588-3c9c4089bd44-08-subscriptions.png', 'https://mystorage.dileepadari.dev/images/portfolio/d83899ad-2b53-4fc8-bfb7-0014fe2b55f3-09-bill-reminders.png', 'https://mystorage.dileepadari.dev/images/portfolio/f988a129-5a5d-4e2e-a772-716a068c0920-10-settings.png'], 'A personal finance manager for how money actually moves in India: UPI wallets, credit card statement cycles, EMIs, and bills you split with friends.', 'Most expense trackers assume money is a single pile that goes down when you spend. Real money is not shaped like that. It sits across a bank account, a salary account, a UPI wallet and a credit card, and each of those behaves differently. Spending on a card does not reduce what you can spend today; it creates an obligation with its own due date, weeks away.

That gap is where budgeting apps quietly mislead you. Bill the whole outstanding card balance on one day and a purchase made the day after the statement closed gets demanded a fortnight early. Sum the card balance into "total balance" and a single swipe looks like cash leaving your pocket. Drop uncategorised spend from the category chart and the chart no longer adds up to the total printed above it. MoneyOS is built around getting exactly these cases right.

It also handles the obligations that arrive without you doing anything: an EMI instalment, a subscription renewal, an autopaid card statement. Those are tracked with real amortisation schedules and real statement cycles, so "what do I owe in the next 15 days" is a question the dashboard can answer honestly instead of approximately.', 'Two things the author kept hitting, both visible in how the app is built:

**Credit cards were always wrong.** Every tracker treated a card as one balance with one due date. A real card has two dates: the statement day that closes a cycle, and the due day by which that closed cycle must be paid. Anything swiped after the statement closes belongs to next month''s bill, however large it already is. MoneyOS models both dates, and the accounts screen shows the split directly: what is billed, and what is not yet billed.

**Splitting a bill broke the numbers.** Paying ₹5,800 for a group dinner and getting ₹4,350 back is not ₹5,800 of spending. The ledger records what actually left your account, and keeps the group total and headcount alongside it, so reports can say both "you spent ₹1,450" and "you fronted ₹14,240 across group hangouts this year".

<!-- TODO: inspiration - if there is a specific story behind starting this (a month the numbers did not add up, a card bill that surprised you), it belongs here. Ask before writing one. -->', '[{"title":"Logging a transaction","description":"The green + button is on every screen. Pick Expense, Income or Transfer at the top of the dialog; the fields change to match, so a transfer asks for a destination account and an expense asks for a category."},{"title":"Splitting a bill with friends","description":"In the transaction dialog, turn on Group expense. Enter what the whole bill came to and how many people shared it, then put your own share in the amount field."},{"title":"Setting up a credit card","description":"Add an account of type Credit card, then fill in three things:"},{"title":"Tracking a loan or EMI","description":"EMIs and Bills > EMIs and Loans > Add loan. Enter the principal, annual rate, tenure and the account it debits. Suggest computes the standard EMI from those numbers if you do not have the figure to hand."},{"title":"Subscriptions and bill reminders","description":"Both live under EMIs and Bills, and they answer different questions."},{"title":"Budgets","description":"Budgets > New budget. Pick a category and a monthly limit. Progress is measured against the calendar month, and going over is shown in red with the overspend amount rather than a bar quietly stopping at 100%."},{"title":"Goals","description":"Goals > New goal. Give it a target amount and optionally a target date. MoneyOS shows the monthly contribution needed to hit that date. Add contribution moves the goal forward."},{"title":"Reading the reports","description":"Reports covers day, week, month, year or a custom range. Four tiles across the top, then income against expense over time and spend by category, then budget against actual."},{"title":"Theming","description":"Settings > Appearance. Light or dark, six accent palettes, and a custom colour if none fit. The choice is stored per device."},{"title":"Exporting your data","description":"Settings > Export. CSV for a spreadsheet, JSON for anything else. Your data is yours and it is not locked in."}]'::jsonb, null, '[{"name":"React 19"},{"name":"TypeScript"},{"name":"Vite"},{"name":"Tailwind 4"},{"name":"Supabase"},{"name":"PostgreSQL"},{"name":"Deno"},{"name":"Recharts"}]'::jsonb, null, 'You need Node 20.19 or newer and a backend to point at. For the full setup, including running the database and edge function yourself, see **[DEVDOC.md](./DEVDOC.md)**.

```bash
git clone https://github.com/delhiprojects000/MoneyOs.git
cd MoneyOs
npm install
cp .env.example .env      # then set VITE_SUPABASE_URL
npm run dev               # http://localhost:5173
```

### Demo account

`npm run seed:demo` fills a demo account with four months of realistic data: five accounts including a credit card mid-cycle, 38 transactions, two loans, seven subscriptions, five bill reminders, five budgets and four goals. That is the exact state every screenshot above was taken in.

| Field | Value |
|---|---|
| Username | `demo` |
| Password | `DemoPass123!` |

The seed script refuses to run against any account other than the demo ones, so it cannot touch real data.', null, null, null, null, null, 'Shipped'),
  ('RGUKT Attendance Management System', 'A mobile-optimized attendance management system designed for RGUKT faculty, featuring period-wise student logging, automated attendance percentages, Excel imports/exports, and parent alert reports.', 'https://github.com/Dileepadari/Attendance_management_system_php', null, 'https://mystorage.dileepadari.dev/images/portfolio/3aedc578-1d34-4ee7-918c-0463ec14b55a-01-mark-attendance.png', array['https://mystorage.dileepadari.dev/images/portfolio/3aedc578-1d34-4ee7-918c-0463ec14b55a-01-mark-attendance.png', 'https://mystorage.dileepadari.dev/images/portfolio/27341af2-58a4-4be0-9070-0a6afeff18ee-02-student-report.png', 'https://mystorage.dileepadari.dev/images/portfolio/6afec184-f092-4f9f-8773-04f174a87e43-03-class-report.png', 'https://mystorage.dileepadari.dev/images/portfolio/7b0d61d4-0d63-4e75-a6c5-9ef805427dad-04-edit-sheets.png', 'https://mystorage.dileepadari.dev/images/portfolio/ef31387d-00cc-4b7c-a6be-b311c23bdb97-05-about.png', 'https://mystorage.dileepadari.dev/images/portfolio/09f296fb-e2ac-48b7-96f0-cd9b960d1019-06-sign-in.png'], false, 42, false, 0, 0, 'PHP', '#4F5D95', 'web development', array['PHP', 'MySQL', 'Google Sheets API', 'Education Management', 'Reporting'], 'rgukt-attendance-management-system', 'https://mystorage.dileepadari.dev/images/portfolio/aa002ff1-86c2-4e7a-8ed0-cea161781b69-01-mark-attendance.png', 'https://mystorage.dileepadari.dev/images/portfolio/27341af2-58a4-4be0-9070-0a6afeff18ee-02-student-report.png', 'https://mystorage.dileepadari.dev/images/portfolio/7cd09e80-97ba-461d-8a36-93781c3c469c-02-student-report.png', array['https://mystorage.dileepadari.dev/images/portfolio/aa002ff1-86c2-4e7a-8ed0-cea161781b69-01-mark-attendance.png', 'https://mystorage.dileepadari.dev/images/portfolio/7cd09e80-97ba-461d-8a36-93781c3c469c-02-student-report.png', 'https://mystorage.dileepadari.dev/images/portfolio/d5ea1702-54ad-4e2e-a0b5-c951fccd8f65-03-class-report.png', 'https://mystorage.dileepadari.dev/images/portfolio/7f4f7409-43c7-4b33-ad7b-810e46eca8d4-04-edit-sheets.png', 'https://mystorage.dileepadari.dev/images/portfolio/aec6f5c3-5d8d-48f8-a6d4-4158742ae726-05-about.png', 'https://mystorage.dileepadari.dev/images/portfolio/dcf525e0-3e02-4c54-8ea3-59d7c0303a20-06-sign-in.png'], 'A class attendance register for teachers who file attendance from a phone between periods. PHP and MySQL in front, a Google Sheets workbook as the attendance database.', 'A college already has a spreadsheet. It knows how to read one, how to share one, and how to back one up. What it does not have is a good way for a teacher to fill one in from a phone, standing in a corridor, in the two minutes between periods.

That is the whole problem this solves. The attendance database stays a Google Sheets workbook, which means the data outlives the app: if this project disappears tomorrow, the register is still a spreadsheet the department can open. What the app adds is the part a spreadsheet is bad at, namely marking 24 students in a few taps, refusing to file the same period twice, and turning columns of ones and zeros into "who is below 75% in Physics".

The server in the middle earns its place twice over. It is where the sign-in check actually happens, rather than being a screen you can skip past. And it means a workbook URL never reaches the browser: the page asks for a class by name, and PHP decides whether you may see it.', 'This is the server-backed sibling of [the static version](https://github.com/Dileepadari/Attendance_Management_System). Same idea, same sheets, and the differences are all things the static one could not do:

**A sign-in that keeps people out.** The static version had a login form, but everything it protected was reachable by typing the URL. Here the session check runs on the server before any sheet is read or written.

**Workbook URLs that stay server-side.** In the static version the sheet endpoint was in the JavaScript, which means anyone with the page had full write access to the workbook. Now `api.php` holds them.

**Filing the same period twice is caught.** The check runs on the server, so two teachers filing the same class cannot both slip past it. A duplicate row silently doubles a class''s session count and quietly halves everyone''s percentage, which is the kind of bug nobody notices until results are published.', '[{"title":"Marking attendance","description":"Using it. Pick a class and subject and press Load register. Everyone starts present, so a normal day is a few taps on the absentees and a save."},{"title":"Reports","description":"Using it. Student report totals every subject for one student and lists the exact dates and periods they missed, grouped by day. A subject whose sheet cannot be read shows as one unavailable row rather than blanking the whole report."},{"title":"Working with the sheets","description":"Using it. Edit sheets links into the workbook behind any class, for the corrections this app deliberately does not do: renaming a student, adding a column, deleting a row filed by mistake. The page also documents the layout the app expects, so a hand edit does not break the next report."},{"title":"Running without any sheets","description":"Using it. Nothing. It is the default. The app runs on demo data generated by PHP: rosters are stable per class, a term of attendance is backfilled so reports have something to show, and anything you mark is written to a local JSON file. Nothing leaves the server."},{"title":"Signing in","description":"Using it. Teacher accounts live in the users table; the local seed creates demo / DemoPass123!."},{"title":"Light and dark","description":"Using it. The toggle sits in the header, and on the sign-in card. It follows your system setting until you pick a side, after which your choice sticks across pages and visits. The choice is applied before first paint, so there is no flash of the wrong theme."}]'::jsonb, null, '[{"name":"PHP 8.1+"},{"name":"MySQL / MariaDB"},{"name":"Google Sheets"},{"name":"ES Modules"},{"name":"No build step"}]'::jsonb, null, 'PHP 8.1+ and MySQL or MariaDB. No framework, no Composer, no build step.

```bash
cp config.example.php config.local.php   # then fill in your database details
mysql -u <user> -p <database> < schema.sql
mysql -u <user> -p <database> < seed.sql   # local only: creates demo / DemoPass123!
php -S 127.0.0.1:8100 router.php
php tests/run.php
```

Then open <http://127.0.0.1:8100/login.php>. It runs on demo data out of the box, so you can skip straight to using it. Pointing it at your own workbooks is in [DEVDOC.md](./DEVDOC.md#local-development).', null, null, null, null, null, 'Shipped'),
  ('PlantIQ', 'An IoT-driven precision agriculture platform interfacing ESP32 microcontrollers and six environmental sensors to detect plant hydration, nutrient deficiencies, and climate stress with 95% accuracy.', 'https://github.com/Dileepadari/PlantIQ', 'https://greenplant.dileepadari.dev', 'https://mystorage.dileepadari.dev/images/portfolio/84fa2974-3804-4cc2-abd7-cfa63db457d4-alerts.png', array['https://mystorage.dileepadari.dev/images/portfolio/84fa2974-3804-4cc2-abd7-cfa63db457d4-alerts.png', 'https://mystorage.dileepadari.dev/images/portfolio/008eb644-6728-4891-8853-d056aebfd916-analysis.png', 'https://mystorage.dileepadari.dev/images/portfolio/1f207fe5-cc68-42f3-a44a-49942f39d072-circuit.png', 'https://mystorage.dileepadari.dev/images/portfolio/9ce0b911-7e53-4153-8fdc-1eddccaa3155-dashboard.png', 'https://mystorage.dileepadari.dev/images/portfolio/e2332229-e482-4656-90df-2d787f1a6efe-history.png', 'https://mystorage.dileepadari.dev/images/portfolio/dd77c7fb-e038-4c61-991a-42a15b6aaa44-settings.png', 'https://mystorage.dileepadari.dev/images/portfolio/9de25d48-3d89-4020-8c9b-f333da29b2f5-statistics.png'], false, 13, false, 0, 0, 'Python', '#3572A5', 'iot', array['Flask', 'ESP32', 'ThingSpeak', 'OM2M', 'IoT Sensors', 'Real-Time Telemetry'], 'plantiq', 'https://mystorage.dileepadari.dev/images/portfolio/c99da3fa-d933-45b6-91da-7dc353609168-alerts.png', 'https://mystorage.dileepadari.dev/images/portfolio/008eb644-6728-4891-8853-d056aebfd916-analysis.png', 'https://mystorage.dileepadari.dev/images/portfolio/ac85b78e-b75a-48f3-ac8f-01538207754b-analysis.png', array['https://mystorage.dileepadari.dev/images/portfolio/c99da3fa-d933-45b6-91da-7dc353609168-alerts.png', 'https://mystorage.dileepadari.dev/images/portfolio/ac85b78e-b75a-48f3-ac8f-01538207754b-analysis.png', 'https://mystorage.dileepadari.dev/images/portfolio/83d46792-eb99-481b-a3c5-7ed77bc00051-circuit.png', 'https://mystorage.dileepadari.dev/images/portfolio/93226731-ce0f-49a6-bbaa-f244b4130f7e-dashboard.png', 'https://mystorage.dileepadari.dev/images/portfolio/0246e65f-bc09-40e7-9cd2-b9cb744f37ef-history.png', 'https://mystorage.dileepadari.dev/images/portfolio/72902da3-2639-4d2b-8a60-5b208cec3ef4-settings.png', 'https://mystorage.dileepadari.dev/images/portfolio/0d7c85a5-e9d0-4b09-ae75-8455aed2ebb7-statistics.png'], 'A plant health monitor for an experimental farm. Six sensors on an ESP32 watch a plant''s air, soil and light; PlantIQ reads them back, judges every value against the safe range for that species, and raises an alert the moment one drifts out.', 'A plant tells you it is in trouble long before it looks like it.

Under pathogen attack a plant changes the volatile organic compounds it releases
into the air, and it does that days before a leaf yellows or a stem wilts. By the
time a farmer can see the problem, the useful window has usually closed.

That is the whole argument for this project. A VOC sensor read **alongside**
temperature, humidity, soil moisture, light and CO2 catches the shift while there
is still something to do about it. Any one of those readings on its own is noise:
VOC rises when it is hot, moisture falls when it is windy. It is the combination,
judged against a range that belongs to *that species*, that means anything.

So PlantIQ is not a sensor dashboard that happens to show plants. It is a
threshold engine with a dashboard attached, and the thresholds are per-species
because 30C is a comfortable afternoon for a Mango and a slow death for a Fern.', 'An IoT course project at IIIT Hyderabad, under Aakashavani, built by four people
around one breadboard.

The original was a single Flask file, a database committed straight into the
repository, and a dashboard that showed numbers without saying whether they were
good numbers. It worked, in the sense that readings arrived. What it could not do
was answer the only question that matters standing in a field: **is this plant
all right?**

Everything since has been in service of that one question. The per-species
threshold table came first, then the traffic-light status on every reading, then
alerts pushed from the firmware the instant a value crosses rather than whenever
somebody next opens the page. The rewrite into a package, the tests, and the
removal of that committed database came later, and are described honestly in
[not_for_you.md](./not_for_you.md).', '[{"title":"Live dashboard","description":"Every sensor as a tile with a bar showing where the reading sits in its range, the VOC trend below, a threshold table on the left and the newest alerts on the right. One glance answers the question the whole project exists for."},{"title":"Per-species thresholds","description":"Six safe ranges per plant: temperature, humidity, soil moisture, light, VOC and CO2. Mango, Cactus, Rose, Basil, Orchid and Fern ship with the app, in src/plantiq/data/plants.json."},{"title":"Threshold analysis","description":"The six readings against your plant''s safe ranges, each marked Healthy or Out of range, with a count of each at the top and an explanation of what the combination means."},{"title":"Per-sensor charts","description":"One chart per sensor across your chosen window, each with the current value pinned in its header. Hover any point for the exact value and time."},{"title":"History and CSV export","description":"Pick two dates and load every reading the device recorded in between. Missing sensor values render as -- rather than zero, because zero is a reading and a gap is not."},{"title":"Device alerts","description":"The ESP32 does its own threshold comparison and POSTs to /api/alerts the moment a value crosses, authenticated with a shared token. The site stores it, colours it by severity, and counts what is still open in the sidebar."},{"title":"Offline honesty","description":"If the channel is unreachable or the device has not reported recently, every page says so and labels the numbers as the most recent on the channel rather than current ones."},{"title":"Circuit reference","description":"What each sensor is, how it measures, how it connects to the ESP32, and the system diagram from breadboard through ThingSpeak to this dashboard."},{"title":"Accounts","description":"Sign up with a username, name, email and password, choose the plant you are growing, and that choice drives every judgement the site makes for you."},{"title":"Light and dark","description":"Both ship, both are written and checked rather than one being derived from the other. The toggle is in the top bar and your choice is remembered in that browser; with no choice made, PlantIQ follows the operating system."}]'::jsonb, '[{"label":"Quality","value":"pytest 55 tests"}]'::jsonb, '[{"name":"Python 3.10+"},{"name":"Flask 3"},{"name":"SQLite"},{"name":"ESP32"},{"name":"ThingSpeak MQTT"}]'::jsonb, '```
  ESP32  ──MQTT──▶  ThingSpeak channel
    │                     │
    │ HTTP POST           │ HTTP GET (cached 20s)
    │ /api/alerts         ▼
    └──────────────▶  Flask app ──▶ SQLite (users, plants, notifications)
                          │
                          ▼
                      Browser (Jinja pages + /api/* JSON)
```

The device is the only writer of sensor data, and it writes to ThingSpeak, not
to this app. PlantIQ owns three things: accounts, the per-species threshold
profiles, and the alert log. It never stores a sensor reading, which is why
there is no ingest endpoint for readings and no table for them.', 'Requires Python 3.10 or newer.

```sh
git clone git@github.com:Dileepadari/PlantIQ.git
cd PlantIQ
python -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env      # then fill it in
python src/wsgi.py        # http://127.0.0.1:5000
```

There is no database in the repository and no seeding step. The first start
creates the schema and loads the plant profiles, and the first account you
register is yours.

To point it at live hardware, set `PLANTIQ_TS_CHANNEL` and `PLANTIQ_TS_READ_KEY`
for your own ThingSpeak channel, and `PLANTIQ_DEVICE_TOKEN` to match the
firmware. [DEVDOC.md](./DEVDOC.md#environment) lists every variable.

The firmware is `Arduino/ESW_Project.ino`. Copy `Arduino/secrets.example.h` to
`Arduino/secrets.h` and fill it in; `secrets.h` is gitignored and must stay that
way.

### Tests

```sh
pip install -r requirements-dev.txt
pytest -q      # 55 tests, no network
ruff check src tests
```', null, null, null, null, null, 'Shipped'),
  ('Old Portfolio Archive', 'My first portfolio, kept online as an archive: hand-written HTML and CSS with no framework at all, plus a second config-driven version of the same site built on Jinja.', 'https://github.com/Dileepadari/Dileepadari.github.io', 'https://dileepadari.github.io/', null, null, false, 45, false, 2, 0, 'HTML', '#e34c26', 'web development', null, 'old-portfolio-archive', null, null, null, null, 'My first portfolio, kept online as an archive. Hand-written HTML and CSS with no framework, plus a second config-driven version built on Jinja.', null, null, null, null, '[{"name":"HTML5"},{"name":"CSS3"},{"name":"Jinja"},{"name":"GitHub Pages"},{"name":"Status"}]'::jsonb, null, null, null, null, null, null, null, 'Shipped'),
  ('MessCheck', 'A food safety inspection checklist for the IIITH mess. Tick what you verified, comment on what needs follow-up, and the visit is saved as a record carrying its own compliance score.', 'https://github.com/Dileepadari/MessCheck', 'https://messfeedback.pythonanywhere.com', 'https://mystorage.dileepadari.dev/images/portfolio/ed98702d-b60c-4cc1-875e-d0bcfa2b59bd-about.png', array['https://mystorage.dileepadari.dev/images/portfolio/ed98702d-b60c-4cc1-875e-d0bcfa2b59bd-about.png', 'https://mystorage.dileepadari.dev/images/portfolio/2551cc86-e6e4-4ee0-94f4-f5a0d5b74b81-checklist.png', 'https://mystorage.dileepadari.dev/images/portfolio/a59ca309-882f-44fc-9fef-38c4ebc31401-fields.png', 'https://mystorage.dileepadari.dev/images/portfolio/d617c8f9-651c-4e97-b330-dcc8b266112d-home.png', 'https://mystorage.dileepadari.dev/images/portfolio/d6b33930-952a-4f74-b694-13e1e50afc9b-record-detail.png', 'https://mystorage.dileepadari.dev/images/portfolio/532ca45f-3a2e-4c00-b998-017434420edf-records.png'], false, 25, false, 2, 0, 'Python', '#3572A5', 'web development', array['feedback', 'inspection', 'mess'], 'messcheck', 'https://mystorage.dileepadari.dev/images/portfolio/39cb58a6-1bda-4f51-a602-05e699fa44e3-about.png', 'https://mystorage.dileepadari.dev/images/portfolio/2551cc86-e6e4-4ee0-94f4-f5a0d5b74b81-checklist.png', 'https://mystorage.dileepadari.dev/images/portfolio/c0d72637-eae7-4f76-a6f3-b6c0947c3c0b-checklist.png', array['https://mystorage.dileepadari.dev/images/portfolio/39cb58a6-1bda-4f51-a602-05e699fa44e3-about.png', 'https://mystorage.dileepadari.dev/images/portfolio/c0d72637-eae7-4f76-a6f3-b6c0947c3c0b-checklist.png', 'https://mystorage.dileepadari.dev/images/portfolio/6e05dbe2-560b-4d8d-8988-e8d4efeaeb5f-fields.png', 'https://mystorage.dileepadari.dev/images/portfolio/cc55a055-c1df-4ae2-97c9-83814d27b3db-home.png', 'https://mystorage.dileepadari.dev/images/portfolio/394dce97-7963-4f3b-9c28-d69d8aca18a5-record-detail.png', 'https://mystorage.dileepadari.dev/images/portfolio/a8ce3b41-9c83-4a11-af05-1d4712eadb15-records.png'], 'A food safety inspection checklist for the IIITH mess. Tick what you verified, comment on what needs follow-up, and the visit is saved as a record with a compliance score.', 'A mess inspection is a small piece of work that goes wrong in a boring way: the form is
paper, the paper circulates, and by the time anyone asks "was the chimney filter cleaned
last month?" the answer is in a folder somebody took home.

MessCheck replaces the paper form. An inspector opens the checklist, ticks what they
verified, comments on what needs follow-up, and the visit is saved with a compliance score
that can be compared with the previous one.

Two decisions do most of the work. **The checklist is data, not code** - fields live in a
table, so a new risk becomes a new field rather than a code change, and reordering them to
follow the inspector''s walking route is a drag rather than a deploy. And **every field
carries a comment box, whatever its type**, because the useful part of an inspection is
rarely the tick: it is the sentence explaining why two staff were at the counter without
hairnets.

The score deliberately counts only checkbox items. A fridge temperature is recorded but not
scored, because there is no single correct answer to count, and a score that quietly folds
in a judgement call is a score nobody trusts.', null, '[{"title":"Running a check","description":"- Start from the home page by entering a date and your name, or open the blank form directly - Fields are grouped into collapsible categories so a long checklist stays manageable - Every field carries a comment box, whatever its type, for context that does not fit a tick - A progress bar counts verified items as you work down the form - The form validates the date, time and inspector name before saving, and hands back what you typed if something is wrong"},{"title":"Records","description":"- Every record shows a compliance score: the share of checkbox items that were verified - Scores are colour coded - green at 80% and above, amber from 50%, red below - Search by inspector name and filter by date range - Each record has three tabs: view the answers, edit them, or delete the record - Editing can untick a box, and the change sticks - Deleting asks you to retype the inspector''s name, and the button stays disabled until it matches - Export one record, or the whole filtered list, as CSV"},{"title":"Managing the checklist","description":"- Add, rename, retype, reorder and delete the fields the form is built from - Three field types: checkbox (scored), short text and number (recorded, not scored) - Categories group the form into sections; typing a category that does not exist creates it - Deleting a field also removes the answers recorded against it, and says so first - Renaming or moving a field leaves existing answers untouched"},{"title":"Interface","description":"- Works on a phone: the nav becomes a drawer and record tables stack into labelled cards - Light and dark themes, following the system setting until you pick one - Records print cleanly - navigation, tabs and buttons drop out, and all tabs expand"}]'::jsonb, '[{"label":"Quality","value":"pytest 35 tests"}]'::jsonb, '[{"name":"Python 3.11+"},{"name":"Flask 3"},{"name":"SQLite"},{"name":"Jinja"}]'::jsonb, null, '```bash
python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
.venv/bin/python app.py
```

Then open http://127.0.0.1:5000. The database is created and seeded with a default checklist
on first run.

A fresh database has the checklist but no visits, so the records screens are empty. To look
around something that has been in use:

```bash
.venv/bin/flask --app app seed-demo    # 14 weekly visits, scored and commented
```

Full setup and deployment notes are in [DEVDOC.md](./DEVDOC.md#local-development).', null, null, null, null, null, 'Shipped'),
  ('ShopFlow', 'A resilient, distributed e-commerce backend where microservices communicate over RabbitMQ event streams, with transactional outbox patterns, dead-letter retries and chaos injection testing.', 'https://github.com/Dileepadari/shopflow', null, 'https://mystorage.dileepadari.dev/images/portfolio/project-shopflow-cover.png', '{}', true, 2, false, 0, 0, 'Python', '#3572A5', 'distributed systems', array['FastAPI', 'RabbitMQ', 'PostgreSQL', 'Docker', 'Event-Driven', 'Chaos Testing'], 'shopflow', null, 'https://mystorage.dileepadari.dev/images/portfolio/project-shopflow-cover.png', null, null, 'Distributed Order Processing & Notification System', null, null, null, null, '[{"name":"RabbitMQ"},{"name":"Python"},{"name":"React"},{"name":"Docker Compose"}]'::jsonb, null, '**You need:** Docker Desktop, or Docker Engine with the Compose plugin. Nothing
else: no Python, no Node, no local RabbitMQ.

```bash
git clone https://github.com/Dileepadari/shopflow.git
cd shopflow
cp .env.example .env          # optional; sensible defaults are built in
docker compose up --build -d
```

The first build takes a few minutes while images download. Then open:

### **http://localhost:3000**

Give it about a minute to settle: the cluster forms, `cluster_init` declares the
topology, and only then do the consumers start. To watch that happen:

```bash
docker compose logs -f cluster_init
```

Once `docker compose ps` shows everything up and `cluster_init` has exited with
code 0, you are ready.

---', null, null, null, null, null, 'Shipped'),
  ('CampusIssues', 'A campus complaint and feedback portal: students raise what is broken, staff get the queue, the deadlines and the record they need to fix it.', 'https://github.com/Dileepadari/CampusIssues', null, 'https://mystorage.dileepadari.dev/images/portfolio/846b298c-81bb-4e66-8b04-1a20fabfd3a8-01-dashboard.png', array['https://mystorage.dileepadari.dev/images/portfolio/846b298c-81bb-4e66-8b04-1a20fabfd3a8-01-dashboard.png', 'https://mystorage.dileepadari.dev/images/portfolio/8741039f-9d2e-472b-b4d6-cc4b9c72594c-02-complaints.png', 'https://mystorage.dileepadari.dev/images/portfolio/38a6d11e-5fbe-4ac7-8bde-dec01ab6c542-03-board.png', 'https://mystorage.dileepadari.dev/images/portfolio/4b0d880f-2f4c-45e6-8322-af7ace109346-04-analytics.png', 'https://mystorage.dileepadari.dev/images/portfolio/1984247e-1802-4772-b2b3-465bc94b10d2-05-complaint-detail.png', 'https://mystorage.dileepadari.dev/images/portfolio/721be941-3a72-44cb-b40d-9c0a870a20f0-06-new-complaint.png', 'https://mystorage.dileepadari.dev/images/portfolio/adfb5c4f-7d6b-4288-9be8-3d99217fd85f-07-people.png', 'https://mystorage.dileepadari.dev/images/portfolio/884d2df0-4319-44d2-8d21-df138d429547-08-landing.png'], false, 27, false, 0, 0, 'TypeScript', '#3178c6', 'web development', null, 'campusissues', 'https://mystorage.dileepadari.dev/images/portfolio/b4eaf8c9-a166-43ab-9de8-a469e3eea337-01-dashboard.png', 'https://mystorage.dileepadari.dev/images/portfolio/8741039f-9d2e-472b-b4d6-cc4b9c72594c-02-complaints.png', 'https://mystorage.dileepadari.dev/images/portfolio/7deb56c9-1828-4128-bd87-3595ee50f122-02-complaints.png', array['https://mystorage.dileepadari.dev/images/portfolio/b4eaf8c9-a166-43ab-9de8-a469e3eea337-01-dashboard.png', 'https://mystorage.dileepadari.dev/images/portfolio/7deb56c9-1828-4128-bd87-3595ee50f122-02-complaints.png', 'https://mystorage.dileepadari.dev/images/portfolio/acdbf890-3daf-4fda-9556-bacf4239888b-03-board.png', 'https://mystorage.dileepadari.dev/images/portfolio/0ae0a04b-ac59-467a-9232-7071c9f572b0-04-analytics.png', 'https://mystorage.dileepadari.dev/images/portfolio/ffce4809-f252-41df-baf4-a0254dc624f2-05-complaint-detail.png', 'https://mystorage.dileepadari.dev/images/portfolio/e670ae1f-90bc-41db-afe7-b67eb0ac22ad-06-new-complaint.png', 'https://mystorage.dileepadari.dev/images/portfolio/272144f0-7a97-4a5e-9d21-856a2e8d7c76-07-people.png', 'https://mystorage.dileepadari.dev/images/portfolio/e1f49b40-6a91-45ff-9f15-02340c5ca475-08-landing.png'], 'A campus complaint and feedback portal: students raise what is broken, staff get the queue, the deadlines and the record they need to fix it.', 'Most campus complaint systems are a form that sends an email, and an email has no state. Nobody can tell you whether anyone read it, who owns it now, or whether the thing you reported three weeks ago is still someone''s problem. So people stop reporting, and the college concludes there were no problems.

What turns a form into a system is the boring middle: a deadline that is set when the complaint is filed rather than when someone gets round to it, a routing rule that puts a broken lab machine in front of IT rather than in a shared inbox, a status that only moves through transitions that make sense, and a record that survives the person who handled it leaving.

CampusIssues is built around that middle. Raising a complaint takes a minute and gives you a tracking code you can check without an account. Everything after that is designed so a queue cannot quietly rot: response targets by priority, overdue flagged wherever a complaint appears, unassigned counted on the dashboard, and a written outcome required before anything can be closed.', 'Two details drove the design, and both come from watching complaint systems fail rather than from a spec.

**Anonymity and followability are usually opposites.** If you let someone report a problem without their name attached, they normally lose the ability to follow it. So the honest complaints, the ones about a person or a department, get filed with a name or not at all. CampusIssues splits it: every submission returns a tracking code that works with no account, so anonymous and followable are independent. Anonymous hides your name from other students but not from the staff who may need to follow up, which is the only version of anonymity that still lets a problem get fixed.

**A deadline that starts when work starts is not a deadline.** Response targets are computed from the submission time, and changing priority re-derives them from that same submission time. Raising a complaint from medium to urgent pulls the deadline in; it never grants extra time. Without that rule, priority becomes a way to reset the clock.', '[{"title":"Raising and tracking","description":"- Twelve categories, each routed to a named department (IT Services, Hostel Administration, Campus Security, and so on) - Four priorities, each with its own response target: urgent 24h, high 3d, medium 7d, low 14d. The deadline is set at submission and shown on every card - Attachments: PNG, JPEG, WebP or PDF, up to four files of 4 MB each - Two independent privacy switches. Anonymous hides your name from other students but not from the staff handling it, because they may need to follow up. Private keeps the complaint off the community board entirely - Edit a complaint until staff start work on it. After that, add a comment instead - Withdraw your own complaint at any time while it is open"},{"title":"Community board","description":"- Complaints published to the board are visible to every signed-in student - Upvote one instead of filing a duplicate, so a shared problem carries weight - You cannot upvote your own complaint"},{"title":"For staff","description":"- The full queue with search across title, description, tracking ID and location, plus filters on status, category, priority and assignee, and six sort orders including \"due soonest\" - Assignment to any active staff member. Picking up an untriaged complaint moves it to under review automatically - Changing priority re-derives the deadline from the submission time, so raising priority pulls the deadline in rather than granting extra time - Internal notes on the thread, marked as such and hidden from the student - Status changes follow a fixed workflow. Only the transitions that make sense from the current state are offered - Overdue complaints are flagged everywhere they appear"},{"title":"Dashboards and analytics","description":"- Students see what they filed, what is still open, what was resolved and the average rating they gave - Staff see open volume, overdue count, unassigned count and the share of complaints resolved within target - A 30-day chart of submitted against resolved: when the lines diverge, the queue is growing faster than it is being cleared - Breakdowns by category, status and priority, plus a per-staff workload table with average resolution time - Summary export as CSV"},{"title":"Everything else","description":"- Notifications for assignment, replies, status changes and reopens, with an unread count in the header - Light, dark and system themes, applied before first paint so there is no flash - Full data export as JSON. Students get their own complaints, staff get the whole record - Public tracking page that returns status and progress but never an identity or an internal note"}]'::jsonb, null, '[{"name":"Piece","role":"Choice"},{"name":"Build","role":"Vite 8, @vitejs/plugin-react-swc"},{"name":"UI","role":"React 19, TypeScript 5.9 (strict), React Router 7"},{"name":"Styling","role":"Tailwind CSS v4 via @tailwindcss/vite, CSS-first config (there is no tailwind.config.ts)"},{"name":"Components","role":"shadcn/ui \"new-york\", Radix primitives, lucide-react icons"},{"name":"Server state","role":"TanStack Query 5"},{"name":"Forms","role":"react-hook-form with zod 4 resolvers"},{"name":"Charts","role":"Recharts 3 for the time series; the ranked breakdowns are plain HTML tables"},{"name":"Toasts","role":"sonner"}]'::jsonb, '```mermaid
flowchart TD
  PAGES["Pages<br/>src/pages"]
  HOOKS["src/hooks/useComplaints.ts<br/>TanStack Query, cache invalidation, toasts"]
  API["src/lib/api.ts<br/>the trust boundary"]
  VAL["src/lib/types.ts<br/>Zod schemas"]
  CRYPTO["src/lib/crypto.ts<br/>PBKDF2, ids, tracking codes"]
  DB["src/lib/db.ts"]
  IDB[("IndexedDB<br/>one JSON document")]
  SEED["src/lib/seed.ts<br/>first-run demo data"]

  PAGES --> HOOKS --> API
  API --> VAL
  API --> CRYPTO
  API --> DB --> IDB
  DB --> SEED
```

The important line is `api.ts`. Components never touch the database, never compute a permission and never decide whether a status change is legal. Every one of those decisions lives in one file, expressed the way a server would express it, so the port to a real backend is a rewrite of that file''s internals rather than a hunt through the UI.', 'No backend, no database to install, no environment file. The app seeds itself on first run.

```bash
git clone https://github.com/Dileepadari/CampusIssues.git
cd CampusIssues
npm install
npm run dev          # http://localhost:5173
```

### Demo accounts

The seed creates an admin, staff across several departments, students, and sixteen complaints spread across every category, priority and status so the queue and the analytics both have something to show. The login screen lists these and fills the form when you click one.

| Role | Email | Password |
|---|---|---|
| Administrator | `admin@campus.edu` | `Admin@1234` |
| Staff | `maintenance@campus.edu` | `Staff@1234` |
| Student | `student@campus.edu` | `Student@1234` |

Nothing leaves your browser. **Settings** has a reset that wipes the local database and re-seeds it.

### Checks

```bash
npm run lint
npx tsc -b --noEmit
npm run build
```', null, null, null, null, null, 'Shipped'),
  ('PlaceTrack (Placement Navigator)', 'A placement intelligence portal for IIIT Hyderabad tracking company visit history, compensation, eligibility criteria, drive schedules and student interview experiences across seasons.', 'https://github.com/Dileepadari/placement-navigator', 'https://placements.dileepadari.dev/', 'https://mystorage.dileepadari.dev/images/portfolio/f88cb66e-818e-42b5-9e20-e89034db3739-analytics.png', array['https://mystorage.dileepadari.dev/images/portfolio/f88cb66e-818e-42b5-9e20-e89034db3739-analytics.png', 'https://mystorage.dileepadari.dev/images/portfolio/300b518a-df2a-4075-b011-eaa7ea19b8f7-calendar.png', 'https://mystorage.dileepadari.dev/images/portfolio/9c01d7f6-9464-4afc-9a1b-52ced87fc636-companies.png', 'https://mystorage.dileepadari.dev/images/portfolio/643b9ef5-b064-4148-8270-8648f129d817-company.png', 'https://mystorage.dileepadari.dev/images/portfolio/5c3dbee4-8758-4a06-9ee9-0529f5fe670b-home.png', 'https://mystorage.dileepadari.dev/images/portfolio/eea169d3-ab41-4f26-94c7-26470ff43ed6-profile.png'], true, 3, false, 0, 0, 'TypeScript', '#3178c6', 'web development', array['Next.js', 'React', 'Tailwind CSS', 'Supabase', 'Placement Analytics'], 'placetrack-placement-navigator', 'https://mystorage.dileepadari.dev/images/portfolio/37b0018c-2c88-464f-964f-0ea3af09b9bc-analytics.png', 'https://mystorage.dileepadari.dev/images/portfolio/300b518a-df2a-4075-b011-eaa7ea19b8f7-calendar.png', 'https://mystorage.dileepadari.dev/images/portfolio/a064fc99-c98e-4d66-bbc2-5db358512f4b-calendar.png', array['https://mystorage.dileepadari.dev/images/portfolio/37b0018c-2c88-464f-964f-0ea3af09b9bc-analytics.png', 'https://mystorage.dileepadari.dev/images/portfolio/a064fc99-c98e-4d66-bbc2-5db358512f4b-calendar.png', 'https://mystorage.dileepadari.dev/images/portfolio/3e166eff-6e25-4006-abae-9b6bdf7309fa-companies.png', 'https://mystorage.dileepadari.dev/images/portfolio/f1a4d502-9da5-4f42-978d-09359e2c7f5a-company.png', 'https://mystorage.dileepadari.dev/images/portfolio/5cf87daa-ea73-4ff7-bb62-dc6c26e4ecba-home.png', 'https://mystorage.dileepadari.dev/images/portfolio/38eb7c8f-0029-4c51-809c-e7995b2067e3-profile.png'], 'Placement tracking for IIIT Hyderabad. Companies, schedules, eligibility, and the interview experiences and questions students contribute after each drive.', 'Placement season runs on rumour. A registration deadline is announced in one
WhatsApp group, the CGPA cutoff in another, and what the interview was actually
like exists only in the memory of whoever sat it last year. Miss the message and
you miss the drive.

PlaceTrack puts the schedule and the eligibility in one place, and then does the
harder half: it keeps the **interview experiences and questions** from the
students who sat each drive, attached to the company they belong to, so next
year''s batch reads them instead of asking around.

The design decision worth naming is that **the whole site is an archive as well
as a noticeboard**. A season selector scopes every page, so 2023-24 can be read
exactly as it stood, and a company page shows what that employer paid and how
many it took in each previous year. A noticeboard that forgets is only useful for
a fortnight.', 'It started as a spreadsheet.

Every batch at IIIT Hyderabad ends up with one: a shared sheet where somebody
types in each company as it is announced, and everybody else adds a column. It
works for about three weeks. Then two people edit the same row, the CTC column
holds `11 LPA` next to `INR 34,05,000` next to `~26`, nobody can remember whether
a blank date means "not announced" or "nobody filled it in", and the interview
notes have moved to a Google Doc that is linked from a WhatsApp message nobody
can find.

The sheet is not the problem. The problem is that a sheet cannot answer "which
drives are open right now", cannot keep last year''s version while you edit this
year''s, and has no idea who wrote which line. Everything here is a consequence of
those three: a computed phase instead of a status column, seasons instead of a
new file each year, and an author on every contribution.

The messy CTC strings survived on purpose. They are in the seed data, and the
parser handles all of them, because the alternative was refusing input that a
person in a hurry would actually type.', '[{"title":"Seasons","description":"The whole site is an archive as well as a noticeboard. The year selector in the header scopes every page at once, and the choice lands in the URL as ?season=, so a link to a past year opens on that year for whoever you send it to."},{"title":"Company list","description":"The drive calendar: registration deadlines, PPT / OA / interview slots, CGPA cutoffs, CTC breakdowns, roles, bond terms, and how many people were selected."},{"title":"Company page","description":"One drive in full, plus a history strip showing what that employer paid and how many they took in each previous season. Below the details sit the experiences, questions, documents and discussion for that drive."},{"title":"Interview experiences","description":"Round-by-round writeups from the students who actually sat the drive, with difficulty, outcome and advice. This is the part a spreadsheet cannot hold and the part next year''s batch actually needs."},{"title":"Question bank","description":"Questions asked in each company''s rounds, tagged by topic and by round type (DSA, system design, behavioural, HR, puzzle), with an optional answer."},{"title":"Discussion and voting","description":"Comments on companies and on individual contributions, with a vote per person on each. Useful for the questions a writeup does not answer, and for surfacing the experience worth reading first when a company has fifteen."},{"title":"Documents","description":"JDs, offer letters, OA question papers, feedback forms and your own resume. Metadata lives in Postgres, the bytes on a self-hosted CDN (see DEVDOC.md)."},{"title":"Bookmarks and applications","description":"Two separate things on purpose. A bookmark is \"keep an eye on this\". An application is \"I am in this process\", and carries a stage: interested, applied, shortlisted, OA, interviewing, offered, rejected, withdrawn, accepted."},{"title":"Calendar feed","description":"Every deadline, PPT, OA and interview slot for the current season as an .ics feed you subscribe to once, in a personal token URL that keeps updating."},{"title":"Analytics","description":"CTC distribution across the season, offers over time, phase breakdown, and the companies taking the most people. Charts read the theme tokens, so they are legible in both modes rather than being a light-mode image on a dark page."},{"title":"Command palette","description":"Ctrl/Cmd + K from anywhere. Jumps to any company by name, or to any page."},{"title":"CSV import and export","description":"Export any filtered view to CSV. Import a whole season from one, with a downloadable template that carries exactly the accepted columns."}]'::jsonb, '[{"label":"Quality","value":"Vitest 176 tests"}]'::jsonb, '[{"name":"React 18","role":"Frontend"},{"name":"TypeScript","role":"Frontend"},{"name":"Vite","role":"Frontend"},{"name":"React Router 6","role":"Frontend"},{"name":"Tailwind CSS","role":"UI"},{"name":"shadcn/ui","role":"UI"},{"name":"Radix primitives","role":"UI"},{"name":"Supabase Postgres behind a Deno edge function","role":"Data"},{"name":"TanStack Query","role":"Data"},{"name":"Accounts in Postgres","role":"Auth"},{"name":"bcrypt via pgcrypto","role":"Auth"},{"name":"HS256 tokens the API issues itself","role":"Auth"},{"name":"react-hook-form + zod","role":"Forms"},{"name":"Self-hosted CDN at mystorage.dileepadari.dev via a Supabase Edge Function","role":"File storage"},{"name":"Vercel","role":"Hosting"}]'::jsonb, '```
Browser (Vite/React SPA on Vercel)
  │  Authorization: Bearer <our own HS256 JWT>
  ▼
Edge Function  /functions/v1/placements      <-- the entire API
  │              holds SUPABASE_SERVICE_ROLE_KEY
  │              holds PLACEMENTS_JWT_SECRET
  │
  ├──► Postgres (hosted project jwaqisnpxkavkkjzvutl)
  │      app_users / auth_sessions  - bcrypt via pgcrypto
  │      companies / experiences / questions / profiles / attachments
  │
  └──► https://supabase.dileepadari.dev/functions/v1/upload
         (self-hosted stack on an Oracle VM; 60s {is_admin} JWT)
         │
         └──► /mnt/storage/public-cdn, served by Caddy at
              https://mystorage.dileepadari.dev/{images,documents}/placements/*
```

Data lives in the hosted Supabase project. Files live on a self-hosted box. The
two are deliberately separate: file bytes are large, cheap to serve from a VM
already paid for, and would otherwise burn the project''s free-tier storage quota.', 'Requires Node 22+.

```sh
git clone git@github.com:Dileepadari/placement-navigator.git
cd placement-navigator
npm install
cp .env.example .env    # then fill it in - see below
npm run dev             # http://localhost:8080
```

### Environment

`.env` needs three browser-side values to run the app:

```sh
VITE_SUPABASE_PROJECT_ID="..."
VITE_SUPABASE_URL="https://<ref>.supabase.co"
VITE_SUPABASE_ANON_KEY="..."
```

The anon key is public by design: it ships in the JS bundle, and all it does is
satisfy the `apikey` header the Supabase gateway wants in front of the edge
function. It reaches no data on its own. Three further values
(`SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`, `SUPABASE_SERVICE_ROLE_KEY`)
are only needed to run migrations or deploy edge functions; they have no `VITE_`
prefix, so they are never bundled. [DEVDOC.md](./DEVDOC.md#environment) says where
each one comes from.', null, null, null, null, null, 'Shipped'),
  ('FeedStack', 'A self-hosted RSS and Atom reader that polls your feeds on a schedule and lands everything new in one list you can organise, search, star and read from a browser or an Android phone.', 'https://github.com/Dileepadari/FeedStack', null, 'https://mystorage.dileepadari.dev/images/portfolio/84a245a6-89aa-4662-b121-d97ab0a3cb72-01-reader.png', array['https://mystorage.dileepadari.dev/images/portfolio/84a245a6-89aa-4662-b121-d97ab0a3cb72-01-reader.png', 'https://mystorage.dileepadari.dev/images/portfolio/7e8d6249-55cf-42a7-ad68-83e542835a5b-02-settings.png', 'https://mystorage.dileepadari.dev/images/portfolio/54f21d51-22dd-4a87-b21c-b4fdf0bec3f9-03-users.png', 'https://mystorage.dileepadari.dev/images/portfolio/0cfa875f-af0d-4915-8f50-df6dcb182c11-04-import-export.png', 'https://mystorage.dileepadari.dev/images/portfolio/5e398fcd-c7d4-4d60-89e1-a6ada73fb706-05-duplicate-detector.png'], false, 19, false, 0, 0, 'Java', '#b07219', 'web development', null, 'feedstack', 'https://mystorage.dileepadari.dev/images/portfolio/9b59fc12-d63d-4bbc-a08d-0631ba5b3945-01-reader.png', 'https://mystorage.dileepadari.dev/images/portfolio/7e8d6249-55cf-42a7-ad68-83e542835a5b-02-settings.png', 'https://mystorage.dileepadari.dev/images/portfolio/c473b4cb-31cd-4d72-8425-1ec4704d6cd2-02-settings.png', array['https://mystorage.dileepadari.dev/images/portfolio/9b59fc12-d63d-4bbc-a08d-0631ba5b3945-01-reader.png', 'https://mystorage.dileepadari.dev/images/portfolio/c473b4cb-31cd-4d72-8425-1ec4704d6cd2-02-settings.png', 'https://mystorage.dileepadari.dev/images/portfolio/ee7e917b-6530-4394-bb53-31ef4d2ccbb2-03-users.png', 'https://mystorage.dileepadari.dev/images/portfolio/520bf0f8-e9ce-41d8-8028-d811a5741ef2-04-import-export.png', 'https://mystorage.dileepadari.dev/images/portfolio/71d21da1-31e2-450c-acda-ecaede52ebd9-05-duplicate-detector.png'], 'A self-hosted RSS and Atom reader. Subscribe to feeds, FeedStack polls them on a schedule, and everything new lands in one list you can organise, search, star and read from a browser or an Android phone.', 'A feed reader is a deceptively good subject for a refactoring exercise, which is
what this started as. It has a scheduler, a parser for two formats that disagree
with each other, a full-text index, a REST API, a web client and a mobile client,
and none of those can be faked. There is nowhere to hide a design smell.

The parts worth reading are the ones that had to survive being changed. Feed
polling is a scheduled job that has to cope with feeds that are slow, malformed,
gone, or returning a redirect chain; a reader that falls over on one bad feed is
useless. Article state is per user, so the same article is unread for one person
and starred by another. And the Lucene index has to stay in step with the
database without either one blocking a request, which is why the work happens on
Guava events rather than inline.

Part two added the features on top of that: a summariser, a daily report, and a
duplicate detector for the same story arriving through three different feeds.', null, '[{"title":"Reading","description":"- Subscribe to any RSS or Atom feed by URL - Unread counts per subscription, per category, and across everything - Mark a single article, a whole subscription, or a whole category as read - Star articles you want to come back to, with a separate starred view - Full text search across every article you have ever received - Keyboard shortcuts for moving through the article list - Themes, including a dark theme and a high contrast theme - Eleven interface languages"},{"title":"Organising","description":"- Group subscriptions into categories, and fold categories you are not using - Import an existing setup from an OPML file, and export yours back out - Feed favicons are fetched and cached so the list stays scannable"},{"title":"Clients","description":"- Web interface, laid out for desktop and for phones - Native Android app in reader-android - A REST API that both clients use, so you can drive it from your own scripts"},{"title":"Added in part two","description":"All merged into master as of v2.0.0:"}]'::jsonb, null, '[{"name":"Java 8"},{"name":"Maven"},{"name":"Jetty"},{"name":"Lucene"},{"name":"Android client"}]'::jsonb, null, null, null, null, null, null, null, 'Shipped'),
  ('AuthModule', 'Drop-in email and password authentication for Express applications: registration, login, logout, session handling, route guards, and an optional set of ready-made pages.', 'https://github.com/Dileepadari/AuthModule', null, null, null, false, 24, false, 0, 0, 'JavaScript', '#f1e05a', 'web development', null, 'authmodule', null, null, null, null, 'Drop-in email and password authentication for Express: registration, login, logout, session handling, route guards, and an optional set of ready-made pages.', 'Every Express project starts by rewriting the same authentication. Hash a password, store a user, set a session, guard a route, build two forms. It is a couple of hundred lines that look easy and are quietly full of ways to get it wrong.

The ways are specific and this module closes each one. A login that returns "no such user" for an unknown email hands an attacker a list of which addresses are registered, so this one answers the same error either way, and compares against a dummy hash when the email is unknown so the timing matches too. A session that keeps its id across login lets an attacker who planted a known id ride the victim''s session, so this one regenerates on every successful login. A cookie readable from JavaScript is one XSS away from being stolen, so this one is `httpOnly`, `sameSite=lax`, and `secure` in production.

None of that is novel. It is just the part that gets skipped when authentication is the thing standing between you and the feature you actually wanted to build.', 'It started as a standalone login and signup site, one of those projects where the auth *is* the project. Then the next project needed the same thing, and copying the folder across meant every fix had to be made twice.

So it became a module. The original site is still here as `examples/demo-app.js`, which is both the demo and the shortest complete example of wiring the module into an app. That is also why the bundled pages exist at all: they were the product first, and they were worth keeping rather than throwing away.

The design constraint that followed from being a module rather than a site: it must never take over. It renders its templates through EJS directly instead of `res.render`, so it cannot overwrite the host app''s view engine. It parses bodies on its own router only. It mounts its own session middleware, unless you tell it not to. Everything is one option away from being yours instead.', '[{"title":"Adding it to a project","description":"await mongoose.connect(process.env.MONGODB_URI);"},{"title":"Using it without the pages","description":"Set mode: \"api\" and the module never renders HTML. POST /auth/login takes JSON and answers JSON, which is what a React or mobile front end wants."},{"title":"Choosing a store","description":"A store is any object with findByEmail, findById and create. Two ship with the module:"},{"title":"Guarding routes","description":"requireAuth answers a browser with a redirect and a script with 401 UNAUTHENTICATED, decided by the same Accept negotiation the router uses. It sends anonymous visitors to redirects.login, which defaults to ./login relative to wherever the router is mounted."},{"title":"Reacting to auth events","description":"Hooks are awaited, so a throw fails the request. Wrap anything that may fail if you would rather it did not."},{"title":"Using a different hasher","description":"Pass any object with hash(plain) and compare(plain, hash):"}]'::jsonb, null, '[{"name":"Node.js 18+"},{"name":"Express 4"},{"name":"bcrypt"},{"name":"MongoDB"},{"name":"EJS"},{"name":"Playwright"}]'::jsonb, null, '```bash
git clone https://github.com/Dileepadari/AuthModule.git
cd AuthModule
npm install
cp .env.example .env      # set SESSION_SECRET
npm start                 # http://localhost:3000
```

The demo runs with no database at all: without `MONGODB_URI` it uses the in-memory store. Set `MONGODB_URI` to use MongoDB instead.

### Demo account

There is no seeded account, because registration is the thing being demonstrated. Register any email; the convention the screenshots use is:

| Field | Value |
|---|---|
| Email | `demo@example.com` |
| Password | `DemoPass123!` |

### Tests

```bash
npm test          # 48 unit and integration tests, Node''s own runner
npm run test:e2e  # 16 Playwright tests against the demo app
npm run test:all  # both
```', null, null, null, null, null, 'Shipped'),
  ('RGUKT Attendance (Node)', 'A class attendance register for RGUKT-AP, Srikakulam Campus, built for teachers filing attendance from a phone between periods. A Google Sheets workbook is the database.', 'https://github.com/Dileepadari/Attendance_Management_System', null, 'https://mystorage.dileepadari.dev/images/portfolio/f64561f3-a03b-45bd-b57f-6d9a6c87fb1f-01-mark-attendance.png', array['https://mystorage.dileepadari.dev/images/portfolio/f64561f3-a03b-45bd-b57f-6d9a6c87fb1f-01-mark-attendance.png', 'https://mystorage.dileepadari.dev/images/portfolio/f7334cfb-adb8-4a9d-bc98-e8725d00a582-02-student-report.png', 'https://mystorage.dileepadari.dev/images/portfolio/88a5aaf0-2e3a-4021-894c-8006dcff383a-03-class-report.png', 'https://mystorage.dileepadari.dev/images/portfolio/db307950-9ec1-403f-a8f1-5301fbc29996-04-edit-sheets.png', 'https://mystorage.dileepadari.dev/images/portfolio/1b7154ec-b06f-4045-b494-7ac075d7ce2d-05-about.png', 'https://mystorage.dileepadari.dev/images/portfolio/5226285c-adf5-456e-a2f4-bd01f40284c0-06-sign-in.png'], false, 43, false, 0, 0, 'JavaScript', '#f1e05a', 'web development', null, 'rgukt-attendance-node', 'https://mystorage.dileepadari.dev/images/portfolio/b4cbe0d7-49b1-4048-b02a-382310f96aed-01-mark-attendance.png', 'https://mystorage.dileepadari.dev/images/portfolio/f7334cfb-adb8-4a9d-bc98-e8725d00a582-02-student-report.png', 'https://mystorage.dileepadari.dev/images/portfolio/462e9b1d-ee3b-4d3f-a99c-5bee2b62fa18-02-student-report.png', array['https://mystorage.dileepadari.dev/images/portfolio/b4cbe0d7-49b1-4048-b02a-382310f96aed-01-mark-attendance.png', 'https://mystorage.dileepadari.dev/images/portfolio/462e9b1d-ee3b-4d3f-a99c-5bee2b62fa18-02-student-report.png', 'https://mystorage.dileepadari.dev/images/portfolio/51d94f27-0293-4843-8b22-a4b5412ea687-03-class-report.png', 'https://mystorage.dileepadari.dev/images/portfolio/2719605d-7ba5-4847-8dea-ff427804a95c-04-edit-sheets.png', 'https://mystorage.dileepadari.dev/images/portfolio/9cad29a3-51a4-4890-a4a2-b4d8dd81d258-05-about.png', 'https://mystorage.dileepadari.dev/images/portfolio/edab344d-0c0b-4af0-a62e-af29142a20bd-06-sign-in.png'], 'A class attendance register for RGUKT-AP, Srikakulam Campus, built for teachers filing attendance from a phone between periods. A Google Sheets workbook is the database.', 'A college already has Google Sheets. It already knows how to read a spreadsheet, already knows who has access, and already has it backed up. That makes a spreadsheet a better attendance database than anything needing a server, a hosting bill and someone to keep it alive after the person who built it graduates.

What a spreadsheet is bad at is being used on a phone in the two minutes between periods. Scrolling a wide grid sideways to find the right student column, on a handset, while thirty people wait, is not something anyone does twice. So this is the interface layer: it reads and writes the same workbooks, and nobody has to touch the grid.

The design follows from that. Everyone starts present, because on a normal day only a handful are not, and a register should be a few taps rather than forty. Marks are drafted into the browser as you go, because signal in a classroom is not a given and losing a half-filed register is worse than not starting one. Filing the same period twice asks first, because the sheet appends and a double entry silently halves everyone''s percentage.', 'The first version, in 2022, was four HTML pages with the logic inline: a nine-branch `if/else` per page mapping a class to a sheet URL, `if (passwd == "admin")` for the login, and `fetch(url)` with no timeout, no status check and no `catch`. It worked, on a laptop, on good wifi, for the person who wrote it.

It stopped working the way that kind of code does. A rate-limited response from the sheet API is a JSON object rather than an array, so `Object.keys(data[0])` threw inside an unawaited async function and the page sat on a spinner with nothing in the console anyone would look at. A student who joined mid-term counted as absent for every session before they enrolled, because a blank cell went through `Number(undefined)` and came out `NaN`. The last student in a class was silently dropped whenever a workbook had no `period` column.

This version is the same idea rebuilt: one config, pure functions for the sheet maths, 98 tests over them, and every failure turned into a sentence a teacher can act on. The full list of what changed and why is in [not_for_you.md](./not_for_you.md).', '[{"title":"Filing a register","description":"Mark attendance, pick course, semester, section and subject, then Load register."},{"title":"Reading a student''s attendance","description":"Student report, pick the class, pick the student, Build report."},{"title":"Finding who is short","description":"Class report, pick the class and subject, Build report."},{"title":"Fixing something the app will not","description":"Edit sheets opens the workbook behind a class. Renaming a student, adding a column, deleting a row filed by mistake: those are spreadsheet operations, and doing them in the spreadsheet is safer than a button that half-implements them."},{"title":"Running on demo data","description":"The app defaults to a generated roster held in your browser. Rosters are stable between reloads, there is a term of backfilled attendance so the reports have something to show, and nothing is sent anywhere."},{"title":"Switching theme","description":"The toggle sits in the header, and on the sign-in card. It follows your system setting until you pick a side, after which the choice sticks across pages and visits."}]'::jsonb, null, '[{"name":"JavaScript ESM"},{"name":"HTML5"},{"name":"CSS3"},{"name":"Google Sheets"},{"name":"build step"}]'::jsonb, null, 'No build step, no dependencies to install for the site itself. Any static server will do.

```bash
git clone https://github.com/Dileepadari/Attendance_Management_System.git
cd Attendance_Management_System
npm start          # serves on http://localhost:8080 and opens the sign-in page
```

### Demo account

| Field | Value |
|---|---|
| Username | `admin` |
| Password | `admin` |

**Change this before deploying.** The sign-in is a convenience gate for shared staffroom machines, not a security boundary: the check runs in the browser against a hash shipped in `config.js`, so anyone who can open devtools is past it. What actually protects the data is the Google account permissions on the workbooks. [DEVDOC.md](./DEVDOC.md#auth-model) has the threat model and how to set a new password.

### Tests

```bash
npm test           # 98 tests on the Node test runner
npm run lint       # syntax check every tracked JavaScript file
npm run check:links  # every local href and src resolves
```', null, null, null, null, null, 'Shipped'),
  ('Enhanced Xv6 Shell & Kernel Enhancements', 'Kernel and shell modifications to MIT''s xv6 teaching OS: Multi-Level Feedback Queue, First-Come First-Served and Priority-Based schedulers, plus network socket system calls.', 'https://github.com/Dileepadari/Enhanced-Xv6-Shell', null, null, '{}', false, 5, false, 0, 0, 'C', '#555555', 'systems programming', array['C', 'Xv6', 'Operating Systems', 'Kernel Scheduling', 'MLFQ', 'System Calls'], 'enhanced-xv6-shell-kernel-enhancements', null, null, null, null, 'A modified xv6 RISC-V kernel with four interchangeable CPU schedulers, and a set of socket programs that ends in a reliable transport built on top of UDP.', null, null, null, '[{"label":"Tests","value":"30"}]'::jsonb, '[{"name":"C"},{"name":"RISC"},{"name":"QEMU"},{"name":"built with"}]'::jsonb, null, 'You need a RISC-V cross compiler, QEMU and `expect` for the kernel, and any C
compiler for the network programs. [DEVDOC.md](./DEVDOC.md#local-setup) has
the exact packages.

```sh', null, null, null, null, null, 'Shipped'),
  ('SplitMate', 'A smart expense management web app utilizing min-cash-flow graph algorithms to simplify multi-party shared expenses into the minimum possible transactions.', 'https://github.com/Dileepadari/SplitMate', null, null, '{}', false, 21, false, 0, 0, 'Python', '#3572A5', 'web development', array['Flask', 'SQLAlchemy', 'Graph Algorithms', 'Expense Tracking', 'Debt Simplification'], 'splitmate', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
  ('Conference Room Booking API', 'A high-performance RESTful API for conference room scheduling, conflict resolution, automated waitlist management, attendee invitations, and calendar synchronization.', 'https://github.com/Dileepadari/ConferenceRoomAPI', 'https://conference-api.dileepadari.dev', null, '{}', false, 23, false, 0, 0, 'JavaScript', '#f1e05a', 'web development', array['Node.js', 'Express', 'REST API', 'Booking System', 'Scheduling'], 'conference-room-booking-api', null, null, null, null, 'A REST API for conference sign-ups, where the interesting part is the waitlist: when someone cancels, the freed seat is offered to whoever has waited longest, and it is held for them for exactly one hour.', 'Booking a seat is easy. Everything around a **full** conference is where booking systems
get quietly wrong, and that is what this one is about.

A waitlist that only records an order is not much use. The moment a seat is freed it has to
go to somebody, and the two obvious designs both fail. Give it to whoever claims it first
and the queue is decorative. Hold it for the person at the front forever and one
unresponsive user blocks everyone behind them.

So a freed seat here is **offered**, not given: the person at the front has one hour to
take it, or until the conference starts if that comes sooner. Miss the window and the offer
passes down the queue and you go to the back, which is a real cost without being an
eviction. The seat is consumed the moment it is offered, which is the property that makes
double booking impossible: a seat is always either free, held by a confirmed booking, or
held by an offer that has not yet expired.

The clash rules exist for the same reason. A user cannot hold two bookings for conferences
that run at the same time, but back-to-back conferences are fine: one ending exactly as the
next begins is not an overlap. Getting that boundary wrong is the difference between a
schedule that works and one that rejects a perfectly reasonable day.', 'It started as a take-home brief with action-style endpoints (`POST /add-conference`,
`POST /book-conference`) and a single-file implementation. Two things changed.

**The rules turned out to be the whole problem.** Slots, waitlists, offer expiry and
schedule clashes interact, and each one is a place to be subtly wrong. So the logic moved
into `src/services`, with controllers reduced to parsing a request and serialising a
result, and it is covered by 116 tests. The time-dependent behaviour takes an injectable
`at: Date` rather than reading the clock, so expiry can be tested without waiting an hour.

**The original routes still work.** REST aliases (`POST /conferences`, `POST /bookings`)
sit beside them because they read better, but nothing was removed. A URL that worked
against the first version still works.', '[{"title":"Conferences","description":"- Create a conference with a name, location, topics, a start and end time, and a number of seats - Names are unique and matched without regard to case, so \"Tech Conf\" and \"tech conf\" are the same conference - A conference cannot run longer than 12 hours, cannot end before it starts, and cannot be created once it is already over - Browse every conference, or fetch one by name along with its live seat count and queue length"},{"title":"Search and suggestions","description":"- Filter conferences by location (a case-insensitive substring), by topic, by a time window, and by whether seats are left - Filters combine, so \"AI conferences in San Francisco next week that still have room\" is one request - A time window matches any conference that overlaps it, so a conference already under way still shows up - Suggestions rank conferences by how many of a user''s interests they cover, skipping ones that have started and ones the user already holds a booking for"},{"title":"Booking","description":"- Book a seat if one is free, otherwise join the waitlist and see your position in it - A user cannot hold two bookings for the same conference, or two conferences that run at the same time - Back-to-back conferences are fine: one ending exactly as the next begins is not a clash - Booking closes the moment a conference starts"},{"title":"Waitlist","description":"- Cancelling a seat offers it to the front of the queue straight away - The person offered a seat has one hour to confirm, or until the conference starts if that comes first - An unconfirmed offer lapses and passes to the next person, and the one who missed it goes to the back of the queue rather than losing their place entirely - Cancelling while merely waitlisted just leaves the queue; it never frees a seat that was not held"}]'::jsonb, '[{"label":"Tests","value":"116"},{"label":"Runtime deps","value":"2"}]'::jsonb, '[{"name":"TypeScript"},{"name":"Node 18+"},{"name":"Express 4"},{"name":"ESLint"}]'::jsonb, null, 'Node 18 or newer. No database, no configuration, nothing to provision.

```bash
npm install
npm run dev        # http://localhost:8000, or set PORT
```

Everything is held in memory, so the data resets when the process restarts. That is a
deliberate scope choice rather than an unfinished one: the point of the project is the
booking rules, and a store interface sits in `src/store` for whenever it is not.

```bash
npm test           # 116 tests
npm run typecheck
npm run lint
npm run build      # dist/, run with npm start
```

Full setup, the request and response shape of every route, and deployment notes are in
[DEVDOC.md](./DEVDOC.md#local-development).', null, null, null, null, null, 'Shipped'),
  ('LifeBook', 'Your life is a book and every day is one page. LifeBook turns what you study, how you sleep, what you commit to and what you reflect on into a single dated page you can later hold in print.', 'https://github.com/Dileepadari/LifeBook', null, 'https://mystorage.dileepadari.dev/images/portfolio/44b3a824-1ba4-4107-8099-d3c8150575ac-analytics.png', array['https://mystorage.dileepadari.dev/images/portfolio/44b3a824-1ba4-4107-8099-d3c8150575ac-analytics.png', 'https://mystorage.dileepadari.dev/images/portfolio/3462b3e9-23bc-431d-8059-846137a6a002-badges.png', 'https://mystorage.dileepadari.dev/images/portfolio/477c6da3-3ed7-4727-9eb0-ef86428b45cd-challenges.png', 'https://mystorage.dileepadari.dev/images/portfolio/a5c6ab06-30d9-4daf-b2ed-31eee796e2bf-dashboard.png', 'https://mystorage.dileepadari.dev/images/portfolio/3d5d2fcd-d6cf-454b-bc18-60ce2e64a363-feed.png', 'https://mystorage.dileepadari.dev/images/portfolio/9e5ee07c-cb44-46c3-8f1b-b81c6e101060-feeling-low.png', 'https://mystorage.dileepadari.dev/images/portfolio/e670c805-498c-4824-bcfe-0b41e39934e0-journal.png', 'https://mystorage.dileepadari.dev/images/portfolio/89198923-9906-4379-b9c4-45e321817616-lifebook-shelf.png', 'https://mystorage.dileepadari.dev/images/portfolio/a195def3-65ff-467c-901c-68354de5aba7-lifepage.png', 'https://mystorage.dileepadari.dev/images/portfolio/0b966e75-8e7a-4581-b41b-66aa9e0b698e-motivation.png', 'https://mystorage.dileepadari.dev/images/portfolio/ec4f2081-85fe-4e2d-8454-6306ab990d64-plan-day.png', 'https://mystorage.dileepadari.dev/images/portfolio/2534f6f4-8611-4d51-9ff5-fcdf383f9240-resources.png', 'https://mystorage.dileepadari.dev/images/portfolio/c1a0c3fe-40da-4fe0-a853-6c6da1340087-settings.png', 'https://mystorage.dileepadari.dev/images/portfolio/f3a0e5c5-6738-4d21-8246-0ed898c87016-study.png', 'https://mystorage.dileepadari.dev/images/portfolio/b2d312b6-64c0-4174-941f-c304ea48079c-wellness.png'], false, 29, false, 0, 0, 'TypeScript', '#3178c6', 'web development', null, 'lifebook', 'https://mystorage.dileepadari.dev/images/portfolio/2d67dda6-8488-4471-9324-4c8bef93bdf6-analytics.png', 'https://mystorage.dileepadari.dev/images/portfolio/3462b3e9-23bc-431d-8059-846137a6a002-badges.png', 'https://mystorage.dileepadari.dev/images/portfolio/cfa55d2b-d322-46b5-9a54-ca759aca3005-badges.png', array['https://mystorage.dileepadari.dev/images/portfolio/2d67dda6-8488-4471-9324-4c8bef93bdf6-analytics.png', 'https://mystorage.dileepadari.dev/images/portfolio/cfa55d2b-d322-46b5-9a54-ca759aca3005-badges.png', 'https://mystorage.dileepadari.dev/images/portfolio/52666635-ee77-4105-8860-f65b92d62231-challenges.png', 'https://mystorage.dileepadari.dev/images/portfolio/1dc0353a-2aad-4580-a932-6adedeee3901-dashboard.png', 'https://mystorage.dileepadari.dev/images/portfolio/dcfa090d-da67-4dce-abb7-70a25a206a5f-feed.png', 'https://mystorage.dileepadari.dev/images/portfolio/cde28eac-eb16-439f-869e-9de21e6672b5-feeling-low.png', 'https://mystorage.dileepadari.dev/images/portfolio/14916bb2-9ec8-4141-945d-62198bded067-journal.png', 'https://mystorage.dileepadari.dev/images/portfolio/f7d65b5f-b0c3-42ce-830c-6d67d2957600-lifebook-shelf.png', 'https://mystorage.dileepadari.dev/images/portfolio/17678b77-b522-4a17-a944-421582d2f3df-lifepage.png', 'https://mystorage.dileepadari.dev/images/portfolio/cf0ad03c-e708-41e2-ab01-c54126062dc6-motivation.png', 'https://mystorage.dileepadari.dev/images/portfolio/cc5f73c5-4e5e-46ee-bd47-da6f76ef4eba-plan-day.png', 'https://mystorage.dileepadari.dev/images/portfolio/972b9abb-b0e5-4441-8524-772e50d6f373-resources.png', 'https://mystorage.dileepadari.dev/images/portfolio/244783d1-c86e-425d-a8f4-9d00214609f7-settings.png', 'https://mystorage.dileepadari.dev/images/portfolio/d3ccc064-0a3a-4658-8f33-22d6c7160dd3-study.png', 'https://mystorage.dileepadari.dev/images/portfolio/fb51d77d-b489-4065-8210-0b65bd50ddd4-wellness.png'], 'Your life is a book, and every day is one page. LifeBook turns what you study, how you sleep, what you commit to and what you reflect on into a single dated page - and enough pages into a book you can hold in print.', 'Students are told to work harder and sleep better and stop scrolling, and none of that advice lands, because nobody knows what they are currently doing. Ask how many hours you studied last week, how many of the tasks you planned you actually closed, or whether your bad days follow bad nights, and the honest answer is a shrug.

LifeBook is the instrument. Every screen exists to produce one number or one sentence about a real day: minutes actually sat through rather than planned, tasks moved to Done rather than asserted, hours slept, mood checked in, a line written down. Then it closes the day by writing that into a page you can read - what happened, what went well, what slipped, and the single most useful thing to change tomorrow.

The point of making the output a *book* rather than a dashboard is that a dashboard is something you glance at and a book is something you read. Thirty pages in, the trend is not a chart you have to interpret; it is a run of days in your own numbers, with your own journal quoted back at you, and it is uncomfortable in a way a bar chart never manages.', 'LifeBook is the built version of a 2024 Design Thinking study on student study-life balance by Ashwani Raj, G Yuvaraj and Adari Dileep - 22 in-depth interviews, a survey, and a review of 15 papers on study technique, time management, extracurriculars and student wellbeing.

The finding the whole product exists to answer, verbatim from the interview analysis:

> They dont measure their life hence cant see their improvements/backlogs.

Supporting findings the app is shaped around: most students did no exercise or mindfulness at all, could not delay gratification, had no organised study schedule, did shallow rather than deep work, and treated motivation as all-or-nothing. Almost none of them were tracking any of it.

Every feature traces back to one of those. Spaced repetition and the focus timer answer shallow work; the challenge hub answers delayed gratification; Health Booster answers the exercise and sleep findings; the Motivation Hub is written for the day the motivation has already gone rather than for the day it is high.', '[{"title":"Close the day","description":"One button, on every screen. It reads that day''s sessions, tasks, sleep, movement, habits, mood and journal, and writes a dated page."},{"title":"Just say it","description":"A small assistant sits in the corner of every screen. Tell it about your day the way you would tell a friend - \"slept 5 hours, finished the problem set, still haven''t done the ML assignment, need to book the exam slot\" - and it files the whole thing: to-dos onto the board, finished things as completed, the ones you missed as an honest backlog, the sleep and screen time into Health Booster, the study block into your focus history, the mood into your check-ins, the gratitude into your journal."},{"title":"Study Now","description":"A real focus timer that writes a real row: planned versus actual minutes, technique, subject, an honest focus rating and an interruption count. That rating is the number every insight about your focus is built from."},{"title":"Plan your day","description":"A drag-and-drop board across To do, Ongoing, Blocked and Done. Moving a card into Done is what stamps completion, so \"tasks completed\" is measured rather than asserted."},{"title":"Health Booster","description":"Sleep, movement, water, screen time, mindfulness, daylight and breakfast, each against a target you set yourself."},{"title":"Personal Journal","description":"A rotating daily prompt, a gratitude list, wins and things to improve."},{"title":"Challenge Hub","description":"Eight challenges, each aimed at a specific finding from the research: Deep Study, 5 AM, Digital Detox, Meditation, Social, Eat Well, Workout, Revise Right."},{"title":"Feeling Low?","description":"A mood check-in with trigger tags, three coping actions with evidence behind them, a full-screen breathing exercise, and an SOS panel holding your own emergency contacts alongside verified Indian helplines."},{"title":"Analytics","description":"Focus over time, focus by weekday, time by subject, and the correlations from your own logs - whether your focus really does track last night''s sleep, whether screen time really is costing you."},{"title":"Your LifeBook","description":"The book opens as a spread - yesterday on the left, today on the right - and turns like one. The sheet hinges on the spine rather than sliding, carries one page on each face, loses light as it stands up and casts a shadow across whatever it passes over, so a turn advances two pages the way a real book does."},{"title":"Resources, Motivation, Feed and Badges","description":"Resources holds your notes in one tagged, searchable place; the text ones are indexed and can be fed to the generators. Motivation Hub carries quotes, affirmations and stories drawn from the research, plus your own goal board with dates against each goal. Your Feed is the research behind LifeBook digested into readable posts you can save, alongside anything anyone on your instance writes. Badges are thirteen markers measured from real rows - none of them can be clicked into existence."}]'::jsonb, null, '[{"name":"React 19","role":"Frontend"},{"name":"Vite 7","role":"Frontend"},{"name":"TypeScript","role":"Frontend"},{"name":"Tailwind v4","role":"Frontend"},{"name":"shadcn/ui on Radix","role":"Frontend"},{"name":"TanStack Query","role":"Frontend"},{"name":"Node 20+","role":"Backend"},{"name":"Express 4","role":"Backend"},{"name":"better-sqlite3 (synchronous","role":"Backend"},{"name":"single file)","role":"Backend"},{"name":"bcryptjs","role":"Backend"},{"name":"jsonwebtoken","role":"Backend"}]'::jsonb, null, '```sh
npm install
cp .env.example .env    # optional - LifeBook runs fine with none of it set
npm run dev
```

Then open <http://localhost:8082> and create an account. The API runs on <http://localhost:4000>; `npm run dev` starts both.

A brand new account has an empty book, which is correct but shows very little - the reader, the trends and the correlations only say anything once there is a run of days behind them. To look around a book that already has some life in it:

```sh
npm run seed:demo       # user: demo, password: lifebook123
```

That writes 24 days of study blocks, sleep, tasks, habits, moods and journal entries, a study library with decks due for review, then generates a LifePage for each day through the same engine the app uses. The days are shaped, not random: there is a slump in the middle and an exam push at the end, and focus follows the previous night''s sleep and screen time - so the analytics have something true to report rather than noise. Add `-- --reset` to rebuild the account from scratch.

For a single-process deployment:

```sh
npm run build
npm start               # serves the built app and the API together on :4000
```', null, null, null, null, null, 'Shipped'),
  ('Digital Library System', 'An online community library allowing readers to discover digital texts, upload books, request additions, and undergo peer review before catalog approval.', 'https://github.com/Dileepadari/DigitalLibrary', null, 'https://mystorage.dileepadari.dev/images/portfolio/c64be7dd-2923-4f3b-88e8-37f4d2fd280e-01-browse.png', array['https://mystorage.dileepadari.dev/images/portfolio/c64be7dd-2923-4f3b-88e8-37f4d2fd280e-01-browse.png', 'https://mystorage.dileepadari.dev/images/portfolio/83b8cf70-2e7e-4994-a695-4356ce327a8c-02-book.png', 'https://mystorage.dileepadari.dev/images/portfolio/8b435dce-3765-4e13-801a-5a4f8e34f180-03-categories.png', 'https://mystorage.dileepadari.dev/images/portfolio/231a732d-1885-4275-badd-f88c75f7b42a-04-add-book.png', 'https://mystorage.dileepadari.dev/images/portfolio/004f8e19-dfb4-4113-85d4-da5c6a2242a8-05-admin.png', 'https://mystorage.dileepadari.dev/images/portfolio/3d42fec5-99a1-4cf0-a31c-051955199288-06-search.png'], false, 41, false, 0, 0, 'PHP', '#4F5D95', 'web development', array['PHP', 'MySQL', 'Bootstrap', 'Library Management', 'Peer Review'], 'digital-library-system', 'https://mystorage.dileepadari.dev/images/portfolio/7cd1d05d-f2dc-49f8-8215-2801a1e9bf3c-01-browse.png', 'https://mystorage.dileepadari.dev/images/portfolio/83b8cf70-2e7e-4994-a695-4356ce327a8c-02-book.png', 'https://mystorage.dileepadari.dev/images/portfolio/599a1584-4263-45d6-b77e-66a733c30521-02-book.png', array['https://mystorage.dileepadari.dev/images/portfolio/7cd1d05d-f2dc-49f8-8215-2801a1e9bf3c-01-browse.png', 'https://mystorage.dileepadari.dev/images/portfolio/599a1584-4263-45d6-b77e-66a733c30521-02-book.png', 'https://mystorage.dileepadari.dev/images/portfolio/9114e2f0-3008-4b9b-aaf0-1a3d0ea98cfa-03-categories.png', 'https://mystorage.dileepadari.dev/images/portfolio/e3891fc8-942b-4373-bc49-1240a4f719c3-04-add-book.png', 'https://mystorage.dileepadari.dev/images/portfolio/ced2289d-79a6-4ca2-818c-854f1e19ca68-05-admin.png', 'https://mystorage.dileepadari.dev/images/portfolio/1e15f12a-72d3-4061-9183-a574f275cf4a-06-search.png'], 'An open source digital library that a community fills in together. Members find books, read them in the browser, ask for the ones that are missing and upload the ones they have. Librarians review everything before it goes public.', 'A community that wants a shared library has two bad options. Put the files in a
drive folder, and within a year nobody can find anything and nobody knows what is
allowed to be there. Or use a hosted platform, and the collection lives at
somebody else''s discretion, under somebody else''s takedown policy.

This is the third option: a library the community actually runs, on its own MySQL
and its own disk, with no build step and no cloud account.

The design problem that follows is trust. If anyone can upload, the collection
fills with duplicates, mislabelled files and things that should not be there. So
**nothing a member uploads is public until a librarian approves it**, uploads are
deduplicated by content hash rather than filename, and every administrative action
is written to an audit log. A takedown process exists because a public library
needs one before it needs it.

The rest follows from wanting people to keep using it: an in-browser reader so a
book does not have to be downloaded to be read, search *inside* PDFs and not just
across titles, requests with votes so the gap between what people want and what is
there is visible, and covers rendered from page one of a PDF because a wall of
identical file icons is not a library.', null, null, '[{"label":"Quality","value":"PHPUnit 440 tests"}]'::jsonb, '[{"name":"PHP 8.2+"},{"name":"MySQL 8"},{"name":"Docker"},{"name":"PHPStan"},{"name":"No build step"}]'::jsonb, null, 'PHP 8.2 or newer, MySQL 8 or MariaDB, and Composer. No build step and no cloud
account.

```bash
composer install
cp .env.example .env                  # set the database details
php cli/console.php key:generate
php cli/console.php migrate
php cli/console.php db:seed           # 13 public domain books
php cli/console.php storage:init
php cli/console.php serve             # http://127.0.0.1:8000
```

Or with Docker:

```bash
docker compose up --build
```

**Install a PDF renderer** if you want covers. `CoverGenerator` shells out to
Imagick, `pdftoppm` (poppler-utils) or Ghostscript, in that order, and a host with
none of them silently makes no covers. The Docker image installs poppler-utils for
you; anywhere else it is on you.

Then register through the sign-up form and promote yourself:

```bash
php cli/console.php user:promote you@example.com admin
```

Full setup, the data model, the permission system and deployment notes are in
[DEVDOC.md](./DEVDOC.md).', null, null, null, null, null, 'Shipped'),
  ('Joomla! Workflow Graph Editor', 'An interactive drag-and-connect workflow graph editor built during Google Summer of Code 2025, turning multi-step editorial approval pipelines into a flowchart for Joomla CMS users.', 'https://github.com/Dileepadari/joomla-cms/tree/6.1-dev', 'https://www.joomla.org/', null, '{}', true, 0, true, 0, 0, 'Vue.js', '#41b883', 'web development', array['Vue.js', 'VueFlow', 'PHP', 'Joomla CMS', 'GSoC 2025', 'Workflows', 'UI/UX'], 'joomla-workflow-graph-editor', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
  ('FaceClone', 'A comprehensive social media web application featuring user profiles, dynamic news feeds, story broadcasting, instant direct messaging, groups, and friendship connections.', 'https://github.com/Dileepadari/Facebook_using_php', null, 'https://mystorage.dileepadari.dev/images/portfolio/416f23b4-0103-497a-93ff-75716f9117f2-01-feed.png', array['https://mystorage.dileepadari.dev/images/portfolio/416f23b4-0103-497a-93ff-75716f9117f2-01-feed.png', 'https://mystorage.dileepadari.dev/images/portfolio/fe2133ae-9e4f-4d15-8c13-6e75bfceefdb-02-profile.png', 'https://mystorage.dileepadari.dev/images/portfolio/ccca40f2-7ab9-4222-ab48-8474efa91e83-03-groups.png', 'https://mystorage.dileepadari.dev/images/portfolio/21f265fc-b0af-409a-8770-ea7e83ee7f58-04-marketplace.png', 'https://mystorage.dileepadari.dev/images/portfolio/3eb28a13-40c7-4132-8a7d-fa8428782ec4-05-events.png', 'https://mystorage.dileepadari.dev/images/portfolio/e41d8b46-cd14-4118-a59b-ff6bb3f12044-06-friends.png'], false, 40, false, 0, 0, 'PHP', '#4F5D95', 'web development', array['PHP', 'MySQL', 'JavaScript', 'Social Network', 'Real-Time Messaging'], 'faceclone', 'https://mystorage.dileepadari.dev/images/portfolio/16b7fe83-df03-4151-84d4-54b07943bffc-01-feed.png', 'https://mystorage.dileepadari.dev/images/portfolio/fe2133ae-9e4f-4d15-8c13-6e75bfceefdb-02-profile.png', 'https://mystorage.dileepadari.dev/images/portfolio/3af22c19-af60-4b2f-a307-85aeb0b53e77-02-profile.png', array['https://mystorage.dileepadari.dev/images/portfolio/16b7fe83-df03-4151-84d4-54b07943bffc-01-feed.png', 'https://mystorage.dileepadari.dev/images/portfolio/3af22c19-af60-4b2f-a307-85aeb0b53e77-02-profile.png', 'https://mystorage.dileepadari.dev/images/portfolio/34f2cab8-112d-4306-a484-3da852e96a3d-03-groups.png', 'https://mystorage.dileepadari.dev/images/portfolio/84c9b87e-127d-4449-8ced-a7554e308e2a-04-marketplace.png', 'https://mystorage.dileepadari.dev/images/portfolio/0488b109-8ea1-44a6-9bde-11c0b21ace86-05-events.png', 'https://mystorage.dileepadari.dev/images/portfolio/277b6c35-2f37-4b84-9ee0-0540bd50fc4d-06-friends.png'], 'A social network you can run on your own machine: posts, stories, reactions, comments, friends, groups, messaging, marketplace and events, wired end to end against a real database with no mocked data.', 'Cloning a social network''s *look* is a weekend. Cloning what makes one hard is not, and
that is the part this is for.

The hard part is that **visibility is a per-viewer question asked on every read**. A post
has an audience, its author has a default, the group it was posted to has its own rules,
and the person reading it may be a friend, a friend of a friend, a group member, or nobody.
Cache that decision and you leak. So it is decided at read time, every time: changing a
post''s audience takes effect for every reader immediately.

The second hard part is that nothing here is a stub. Uploads write real files with real
MIME checks and real size limits. Reactions, comments, shares, stories that expire, group
membership, marketplace listings and message threads all sit in a real schema with real
foreign keys. There are no fixtures pretending to be a backend, which means the awkward
cases (deleting a post that has been shared, a story that expires mid-session, a friend
request from someone who already blocked you) have to actually be handled.

And it is built with **no framework and no Composer dependencies at all**: a hand-written
router, a small PDO layer, plain PHP views. That is a deliberate constraint. It means every
piece of behaviour is visible in this repository rather than delegated to a package, which
is the only reason a codebase like this is worth reading.', null, '[{"title":"Feed and posts","description":"- Write a post with text, up to eight photos or videos, a feeling and a location - Put a short text post on one of eight gradient backgrounds, the way Facebook does - Pick an audience per post: Public, Friends, or Only me - React with any of the seven reactions; hover the Like button to open the reaction picker - Comment, reply to a comment, react to a comment, edit and delete your own - Share a post to your own timeline with your own commentary attached - Save a post to read later, and delete or edit anything you wrote - The feed loads more posts as you scroll, without a page change"},{"title":"Stories","description":"- Post a photo story, or a text story on a gradient background - Stories expire 24 hours after posting and disappear from every tray automatically - The story viewer runs timed progress bars, advances on its own, and chains from one person to the next; tap either side to step back and forward - Your own stories show how many people have seen them"},{"title":"Profile","description":"- Cover photo and profile photo, both replaceable in place - Intro panel: bio, work, education, current city, hometown, relationship, website - Tabs for posts, about, friends, photos and groups - Followers and following lists"},{"title":"Friends","description":"- Send, cancel, accept and decline friend requests - Unfriend, follow without friending, and block - People You May Know, ranked by how many friends you have in common - Blocking is symmetric: a blocked person disappears from your feed, search and profile, and any existing friendship is removed"},{"title":"Groups","description":"- Create a public or private group with a cover photo and description - Public groups let anyone join instantly; private groups queue a request for an admin - Post inside a group, invite friends, review join requests - Admin, moderator and member roles, with an admin able to promote, demote or remove - The last admin cannot leave without the group being handed to someone else"},{"title":"Messenger","description":"- One conversation per pair, created the first time you message someone - Send text and photo attachments; new messages arrive without a reload - Unread badges in the top bar and per conversation, and an active-now indicator"},{"title":"Notifications","description":"- Reactions, comments, replies, friend requests, shares, group activity and messages - A dropdown in the top bar and a full page, both with read/unread state - Every notification type can be switched off in settings, which stops it being created"},{"title":"Search","description":"- Typeahead in the top bar, plus a results page split into people, posts and groups - Hashtags and @mentions in post text are linked and searchable"},{"title":"Marketplace and events","description":"- List an item with a price, category, location and photo; mark it sold or delete it - Message a seller directly from a listing - Create events, RSVP as going or interested, and see who else is attending"},{"title":"Settings","description":"- Account: name, username, email, password, deactivate, delete - Privacy: default post audience, who can friend you, who can message you, activity status - Notifications: a switch per notification type - Display: light, dark, or follow the system - Blocking: see and undo everyone you have blocked"}]'::jsonb, null, '[{"name":"PHP 8.1+"},{"name":"MariaDB / MySQL"},{"name":"Vanilla JS"},{"name":"No framework"},{"name":"No Composer deps"}]'::jsonb, null, 'PHP 8.1 or newer with `pdo_mysql`, `gd`, `mbstring` and `fileinfo`, plus MariaDB or MySQL.
No framework, no Composer, no build step, nothing to install but the database.

```bash
php bin/console.php doctor          # extensions, permissions and the connection
php bin/console.php install --seed  # schema and demo data
php -S localhost:8000 -t public server.php
```

`server.php` is not optional: it is the router the built-in server needs. See
[DEVDOC.md](./DEVDOC.md) for why.

Then sign in as `dileep@faceclone.test` with password `password123`. Every seeded
account uses the same password, and `.test` is a reserved domain, so none of them
is a real address.

Database credentials come from `config/config.example.php`, overridden by
`config/config.local.php` (git-ignored) and then by `FACECLONE_*` environment
variables. Full setup is in [DEVDOC.md](./DEVDOC.md#local-development).', null, null, null, null, null, 'Shipped'),
  ('IIITH Web Hunt', 'A team competition for IIIT Hyderabad: teams race to find and claim websites across the campus''s domains, scoring points for every site they are first to reach.', 'https://github.com/Dileepadari/IIITHWebHunt', null, null, null, false, 28, false, 0, 0, 'TypeScript', '#3178c6', 'web development', array['iiith', 'web-hunt', 'websites'], 'iiith-web-hunt', null, null, null, null, 'A team competition for IIIT Hyderabad: teams race to find and claim websites across the campus''s domains, scoring points for every site they are first to reach.', 'The hard part of a scavenger hunt for websites is that **the answer list cannot be
complete**. Nobody knows every hostname under `iiit.ac.in`, so a hunt scored purely
against a fixed list punishes the teams who are actually good at the game: they find a
real site nobody thought of and get nothing for it.

So a submission that is not on the list is resolved live and counted if it exists. That
turns the scoring problem into a URL identity problem, which is where the real work is:
`students.iiit.ac.in`, `https://students.iiit.ac.in/`, `HTTPS://Students.IIIT.ac.in` and
`students.iiit.ac.in/index.html` are one site, and the client and the server have to agree
on that or a team gets charged for a duplicate. The normalisation rules live in
`shared/url.ts` precisely so both ends use the same code.

The second constraint is the venue. This runs at a campus event on a LAN, often with no
route to the internet, which is why every font and icon is bundled into the image rather
than pulled from a CDN.', null, '[{"title":"Submitting a site","description":"- Type a URL in any shape. HTTPS://Students.IIIT.ac.in/ , students.iiit.ac.in and www.students.iiit.ac.in/#about are all the same target: leading and trailing spaces, spaces inside the address, capitals, http/https, a www. prefix, a trailing slash, a port, a query string and a fragment are all ignored before matching. - The form shows the canonical form it will submit, before you submit it. - Deep links count. If the admin listed cvit.iiit.ac.in and you submit cvit.iiit.ac.in/projects/2024, you have still found the site."},{"title":"Sites nobody listed","description":"- A guess for an iiit.ac.in site that is not on the list is verified live. If it answers, it joins the hunt and scores full points, and is flagged in the admin panel as player-discovered. - This is the point of the game: the list is a starting set, not the whole map."},{"title":"Scoring","description":"The rule behind the table: points are only deducted for a guess that can be proven wrong. Anything uncertain scores zero rather than risking a penalty for a correct answer."},{"title":"Anti-spam","description":"- One submission per team every 2 seconds, enforced on the server. The submit button shows the remaining wait, so a double-click or a held Enter key cannot drain a score. - Resubmitting anything already settled is always free."},{"title":"Live updates","description":"- Leaderboard, recent activity and stats update over a websocket as other teams play. - The countdown ticks in real time and the game ends by itself when the clock runs out."}]'::jsonb, null, '[{"name":"TypeScript"},{"name":"React"},{"name":"Express"},{"name":"PostgreSQL"},{"name":"Drizzle"},{"name":"Docker"}]'::jsonb, null, '```bash
cp .env.example .env      # fill in DATABASE_URL, SESSION_SECRET and ADMIN_PASSWORD
docker compose up -d
```

First boot needs `SEED_DATABASE=true` and an `ADMIN_PASSWORD` in `.env` to create the
admin account, which is the only way into the admin panel.

Or without Docker, against a Postgres you already have:

```bash
npm install
cp .env.example .env      # fill in DATABASE_URL and SESSION_SECRET
npm run db:push
npm run db:seed           # creates the admin and the starter website list
npm run dev               # http://localhost:5000
```

`npm run dev` and `npm run db:seed` read `.env` directly (Node''s
`--env-file-if-exists`), so the same file works for both the Docker and the
non-Docker route. Requires **Node 22.9 or newer** for that flag.

More detail is in [DEVDOC.md](./DEVDOC.md).', null, null, null, null, null, 'Shipped'),
  ('Foodie', 'A simple, easy-to-use food delivery app built entirely with Kotlin and Jetpack Compose on the principle of MVVM with Modern Android Architecture Components.', 'https://github.com/Dileepadari/Foodie', null, null, null, false, 32, false, 0, 0, 'Kotlin', '#A97BFF', 'mobile development', null, 'foodie', null, null, null, null, 'A simple, easy-to-use food delivery app built entirely with Kotlin and Jetpack Compose on the principle of MVVM with Modern Android Architecture Components.', null, null, null, null, null, null, null, null, null, null, null, null, null),
  ('TourismToolKit', 'An AI-powered multilingual travel platform for India: real-time speech translation across 13 languages, document OCR, cultural etiquette guides and offline emergency support via Bhashini.', 'https://github.com/Dileepadari/TourismToolKit', 'https://tourismtoolkit.dileepadari.dev', null, '{}', false, 8, true, 0, 0, 'Next.js', '#613583', 'web development', array['Next.js', 'FastAPI', 'Bhashini AI', 'Speech Recognition', 'OCR', 'Multilingual'], 'tourismtoolkit', null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null),
  ('Connected Car Fleet Management', 'A vehicle fleet telematics API covering VIN registries, live sensor telemetry for speed, fuel, battery and engine temperature, geofence boundary alerts and fleet health analytics.', 'https://github.com/Dileepadari/connected_car_fleet', null, null, '{}', false, 10, false, 0, 0, 'Python', '#3572A5', 'backend', array['FastAPI', 'Pydantic', 'Telemetry Streaming', 'Geofencing', 'Vehicle Analytics', 'REST API'], 'connected-car-fleet-management', null, null, null, null, 'A REST API for a fleet of connected vehicles: register them, stream telemetry, and the service turns that stream into alerts and fleet-level analytics on its own.', 'A fleet does not have a data problem, it has an attention problem. Six vehicles
pushing a reading every few minutes is trivial to store and impossible to watch.
Somebody has to notice that one van has been silent since Tuesday and another is
about to run dry, and noticing is the part software should be doing.

So the interesting behaviour here is not the registry or the ingest endpoint,
both of which are ordinary. It is that **every reading is evaluated as it
arrives**, against rules that know the vehicle: a speed violation is measured
against that vehicle''s own limit where one is set, not a fleet-wide number, and a
low-fuel alert on a battery electric vehicle means something different from the
same percentage on a diesel van.

Alerts then have a lifecycle rather than being a log line. An alert is raised
once, acknowledged by a person, and resolved when the condition clears. Without
that an operator gets the same warning every thirty seconds until they stop
reading warnings altogether, which is the failure mode that makes alerting
systems worthless.

The analytics exist for the same reason: a fleet health score, a 24 hour activity
summary and a breakdown by severity are there so the first question of the
morning ("what needs me today?") has one endpoint rather than six.', null, null, '[{"label":"Quality","value":"pytest 70 tests"}]'::jsonb, '[{"name":"Python 3.11+"},{"name":"FastAPI"},{"name":"Pydantic 2"},{"name":"Ruff"}]'::jsonb, null, 'Python 3.11 or newer. No database and nothing to provision: state is JSON on
disk, under `FLEET_DATA_DIR`.

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements-dev.txt

uvicorn app.main:app --reload          # http://localhost:8000
python scripts/seed_demo_data.py       # a six vehicle fleet with real alerts
```

Then open <http://localhost:8000/docs> for Swagger UI, or
<http://localhost:8000/redoc> for the reference-style version.

The seed script registers six vehicles across four fleets and pushes a day of
telemetry through the real ingest endpoint, so the alerts are genuinely raised by
the rules rather than inserted. The fleet is chosen so every rule has something to
show: a speeder, a vehicle low on charge, one throwing a diagnostic trouble code,
and one that stopped reporting two days ago. It finishes by printing the health
report.

```bash
pytest -q                # 70 tests
ruff check . && ruff format --check .
pip-audit -r requirements.txt
```', null, null, null, null, null, 'Shipped'),
  ('ChatWrap', 'One chat interface for every model. Bring your own API keys, keep every conversation in a database you control, and run the whole thing wherever you like.', 'https://github.com/Dileepadari/ChatWrap', null, 'https://mystorage.dileepadari.dev/images/portfolio/ec1ca211-7399-45ca-ac1e-7dac1ba654ac-01-chat.png', array['https://mystorage.dileepadari.dev/images/portfolio/ec1ca211-7399-45ca-ac1e-7dac1ba654ac-01-chat.png', 'https://mystorage.dileepadari.dev/images/portfolio/9f09a320-057a-4840-8857-feb944cfad47-02-personas.png', 'https://mystorage.dileepadari.dev/images/portfolio/f879f287-bdc2-4fc9-8394-b3d8b579f669-03-prompts.png', 'https://mystorage.dileepadari.dev/images/portfolio/38d47240-5d8f-4102-b462-886d2ee1516b-04-usage.png', 'https://mystorage.dileepadari.dev/images/portfolio/7dfcf80e-684d-4daa-9fb8-36c28f9c48c6-05-settings.png', 'https://mystorage.dileepadari.dev/images/portfolio/f0417b45-2793-44e1-b1bf-3b275305710b-06-keys.png', 'https://mystorage.dileepadari.dev/images/portfolio/a52760df-c7fe-4f5f-99c2-adf2e48f280d-07-models.png', 'https://mystorage.dileepadari.dev/images/portfolio/976c71b8-7e16-42e8-9f67-85503ada6aef-08-search.png'], false, 17, false, 0, 0, 'TypeScript', '#3178c6', 'web development', array['ai', 'aichat', 'chat', 'wrapper'], 'chatwrap', 'https://mystorage.dileepadari.dev/images/portfolio/298a1f74-df2e-46c7-8758-03be90bd81ef-01-chat.png', 'https://mystorage.dileepadari.dev/images/portfolio/9f09a320-057a-4840-8857-feb944cfad47-02-personas.png', 'https://mystorage.dileepadari.dev/images/portfolio/c57d1d29-68c8-457e-8f00-d3b938f6f0bc-02-personas.png', array['https://mystorage.dileepadari.dev/images/portfolio/298a1f74-df2e-46c7-8758-03be90bd81ef-01-chat.png', 'https://mystorage.dileepadari.dev/images/portfolio/c57d1d29-68c8-457e-8f00-d3b938f6f0bc-02-personas.png', 'https://mystorage.dileepadari.dev/images/portfolio/0a7d3334-1bf1-47d4-aae4-9ec7a683d4f1-03-prompts.png', 'https://mystorage.dileepadari.dev/images/portfolio/addb5ab8-7725-4c9c-9357-0bc60f91df6e-04-usage.png', 'https://mystorage.dileepadari.dev/images/portfolio/a7b248c2-bcbd-45f9-aba7-36cb6683d6b3-05-settings.png', 'https://mystorage.dileepadari.dev/images/portfolio/a9a7c0f0-e979-4054-b18b-12c9b8ad61b8-06-keys.png', 'https://mystorage.dileepadari.dev/images/portfolio/4eb63b15-4d70-4800-a7a2-6cbc15c85e60-07-models.png', 'https://mystorage.dileepadari.dev/images/portfolio/cf1c6926-40af-498c-9899-79e26203e30f-08-search.png'], 'One chat interface for every model. Bring your own API keys, keep your conversations in a database you control, and run it anywhere.', 'Every model vendor ships its own chat app, and each one is a separate tab, a separate subscription, and a separate silo holding your conversation history. Switching from Claude to GPT to Gemini in the middle of a problem means re-explaining the problem three times.

ChatWrap puts them behind one interface with one history. You paste in your own provider keys, so requests are billed to your accounts at cost rather than to a per-seat subscription, and the conversations land in a Postgres database you run. Nothing is intermediated by a service that can change its terms, its pricing, or its retention policy.

That has a practical consequence beyond principle: because the keys are yours and the storage is yours, the same conversation can be continued on a different model. Ask a cheap fast model to draft, switch to a stronger one for the part that is hard, and keep it all in one thread. The **Usage** page then shows what each of those choices actually cost, which is the number that per-seat pricing hides.', 'ChatWrap started as a fork of [Vercel''s Next.js AI Chatbot template](https://github.com/vercel/ai-chatbot), which is an excellent starting point and a deliberately minimal one: a single provider, no key management, no way to organise anything.

The gap between that and something worth using daily turned out to be mostly about ownership and organisation rather than about the chat itself:

**Keys had to be per user and encrypted.** A self-hosted chat app where the operator''s key serves every visitor is a bill waiting to happen. Keys are encrypted with AES-256-GCM before they touch the database and are never sent back to the browser, so a user sees only the last four characters of their own key.

**History had to survive being useful.** After a few hundred conversations, a flat reverse-chronological list is not navigable. Folders, pinning, archiving and full-text search across message bodies came out of actually living with the flat list first.

**Repeating yourself is the real cost.** Personas (a saved system prompt with a name) and saved prompts (a snippet recalled by typing `/`) both exist because the same context was being retyped several times a day.', '[{"title":"Chat with any model","description":"Anthropic, OpenAI, Google, xAI, any OpenAI-compatible endpoint, local models through Ollama, and the Vercel AI Gateway are all in one catalogue. The picker groups models by provider and labels each with its context window and what it can do: vision, reasoning, tool use, PDFs."},{"title":"Bring your own API keys","description":"Requests run on your provider account, at the provider''s own prices, with no markup and no seat licence."},{"title":"Organise your conversations","description":"A flat list of every conversation you have ever had stops being navigable at around a hundred entries. There are four separate tools here because they solve different problems."},{"title":"Personas and saved prompts","description":"Two different kinds of repetition, so two different tools."},{"title":"Artifacts","description":"Ask for a document, a code file or a spreadsheet and it opens in a panel beside the conversation rather than scrolling away in the transcript."},{"title":"See what you are spending","description":"Per-seat pricing hides what a conversation costs. Paying at cost means you can see it, so the app shows it."},{"title":"Own your data","description":"Using it. Settings, Data exports everything your account holds, chats, messages, documents, personas and saved prompts, as one JSON file. The same page deletes your account and everything attached to it. Because the database is yours, neither of those depends on anyone''s export policy."}]'::jsonb, null, '[{"name":"Choice","role":"Layer"},{"name":"Next.js 15","role":"Framework"},{"name":"App Router","role":"Framework"},{"name":"React 19","role":"Framework"},{"name":"TypeScript","role":"Language"},{"name":"strict","role":"Language"},{"name":"AI SDK 5 with per-provider packages (@ai-sdk/anthropic","role":"Models"},{"name":"-openai","role":"Models"},{"name":"-google","role":"Models"},{"name":"-xai","role":"Models"},{"name":"-openai-compatible","role":"Models"},{"name":"-gateway)","role":"Models"},{"name":"Postgres via Drizzle ORM and postgres","role":"Database"},{"name":"Auth.js (next-auth v5) with credentials and anonymous guest sessions","role":"Auth"},{"name":"Tailwind CSS v4","role":"Styling"},{"name":"shadcn/ui on Radix primitives","role":"Styling"},{"name":"Vercel Blob or the local filesystem","role":"Storage"},{"name":"behind one interface","role":"Storage"},{"name":"Redis","role":"Cache"},{"name":"optional","role":"Cache"}]'::jsonb, '### Model resolution

`lib/ai/models.ts` is the single source of truth. Every model has a namespaced
id, `<provider>/<model>`, which is what gets stored on chats and usage rows, so
a provider renaming a model never silently changes what a row means.

`lib/ai/providers.ts` turns an id into an AI SDK language model:

```
resolveLanguageModel(id, credentials, role)
  -> look up the model in the catalogue
  -> pick the credential: the user''s key first, then the server''s env var
  -> construct the provider client and return the model
```

If neither the user nor the server has a credential it throws
`MissingProviderKeyError`, which `app/(chat)/api/chat/route.ts` turns into a
`unauthorized:model` response telling the user to add a key.

`role` (`chat`, `title`, `artifact`) only matters under test, where the stubs in
`lib/ai/models.mock.ts` stand in for real providers.

To add a model, add an entry to `chatModels`. To add a provider, add it to
`providers`, extend `ProviderId`, and add a branch to `buildModel` and
`serverKey`.

### Request flow for a message

```
components/chat.tsx
  -> POST /api/chat  { id, message, selectedChatModel, selectedVisibilityType, personaId }
     -> validate the body (Zod, model id constrained to the catalogue)
     -> rate limit by user id
     -> check the entitlement for this user type and model
     -> load the user''s decrypted keys and settings
     -> resolve the language model
     -> create the chat if it does not exist, titling it from the first message
     -> assemble the system prompt: base + standing instructions + persona + artifacts + geo
     -> streamText with the artifact tools
     -> stream back, then persist messages, chat context and a UsageEvent
```

### Prompt assembly

`lib/ai/prompts.ts` composes the system prompt in a fixed order - base prompt,
the user''s standing instructions, the chat''s persona, artifact instructions,
then request geography. Stable content comes first so a provider''s prompt cache
is not invalidated by the volatile parts.

### API key encryption

Users'' provider keys are encrypted with AES-256-GCM in `lib/crypto.ts` and
stored as `v1:<iv>:<authTag>:<ciphertext>`, all base64. GCM authenticates, so a
tampered row fails to decrypt rather than returning garbage.

`ENCRYPTION_KEY` may be a base64-encoded 32-byte key or any passphrase, which is
hashed to 32 bytes. **Rotating it makes every stored key unreadable**; keys that
fail to decrypt are skipped rather than breaking the request, so the user sees
"no key configured" and can re-enter theirs.

The plaintext never leaves the server. `GET /api/keys` returns metadata only:
provider, a four-character hint, and timestamps.

### Storage

`lib/storage/index.ts` picks a driver: `blob` (Vercel Blob) or `local` (disk
under `STORAGE_LOCAL_DIR`). `STORAGE_DRIVER=auto` uses Blob when
`BLOB_READ_WRITE_TOKEN` is set and disk otherwise. Both return the same shape.

Local files are served by `app/(chat)/api/files/[...path]/route.ts`, which
requires a session and resolves the path against the storage root, rejecting
anything that escapes it.

### Rate limiting

`lib/rate-limit.ts` implements fixed windows. With `REDIS_URL` set the counters
are shared across instances; without it they are per-process, which is correct
for a single-instance deployment. A Redis failure degrades to the in-process
path rather than failing the request. Named limits live in `limits`.

### Errors

`lib/errors.ts` defines `ChatSDKError` as `type:surface`, for example
`forbidden:model`. `visibilityBySurface` decides whether the cause is returned
to the client or only logged - database errors are always logged, never
returned. Add a surface by extending `Surface`, adding it to
`visibilityBySurface`, and giving it messages in `getMessageByErrorCode`.', 'With Docker:

```bash
cp .env.example .env', null, null, null, null, null, 'Shipped'),
  ('MyWeather', 'A modern, fully functional Android weather application built entirely with Kotlin and Jetpack Compose, showing current conditions and the days ahead.', 'https://github.com/Dileepadari/MyWeather', null, null, null, false, 31, false, 0, 0, 'Kotlin', '#A97BFF', 'mobile development', null, 'myweather', null, null, null, null, 'A beautiful, modern, and fully functional Android Weather application built entirely with Kotlin and Jetpack Compose.', null, null, null, null, null, null, null, null, null, null, null, null, null),
  ('CanteenX', 'A high-throughput food ordering platform unifying campus vendors, students and administrators, with real-time order tracking, inventory management and instant payments over FastAPI and GraphQL.', 'https://github.com/Dileepadari/CanteenX', 'https://smartcanteen.dileepadari.dev/', 'https://mystorage.dileepadari.dev/images/portfolio/dad1c074-bf87-4367-814a-a2547477fa8d-01-home.jpg', array['https://mystorage.dileepadari.dev/images/portfolio/dad1c074-bf87-4367-814a-a2547477fa8d-01-home.jpg', 'https://mystorage.dileepadari.dev/images/portfolio/2b8c2aae-4b0b-4e9a-9201-4d78e2d845a1-02-menu.jpg', 'https://mystorage.dileepadari.dev/images/portfolio/26ccc5cd-dc18-439b-8219-6116fc9fae79-03-canteens.jpg', 'https://mystorage.dileepadari.dev/images/portfolio/06d3c7fd-6cf6-48cd-8a24-a77b0fa675e1-04-orders.jpg', 'https://mystorage.dileepadari.dev/images/portfolio/910fb3a2-3cde-4cac-8896-39ecd1d204b4-05-wallet.jpg', 'https://mystorage.dileepadari.dev/images/portfolio/84dad0c7-1843-474f-aff5-45323da4d442-06-vendor-dashboard.jpg', 'https://mystorage.dileepadari.dev/images/portfolio/4b690aa6-c93e-49fe-b103-e1402e2b6773-07-vendor-queue.jpg', 'https://mystorage.dileepadari.dev/images/portfolio/0392cedc-b3a9-409a-969f-dce1009ca818-08-admin.jpg'], false, 6, false, 0, 0, 'TypeScript', '#3178c6', 'web development', array['FastAPI', 'React', 'GraphQL', 'TailwindCSS', 'PostgreSQL'], 'canteenx', 'https://mystorage.dileepadari.dev/images/portfolio/a471fbe5-b154-492e-84ab-85fea0d8c04a-01-home.jpg', 'https://mystorage.dileepadari.dev/images/portfolio/2b8c2aae-4b0b-4e9a-9201-4d78e2d845a1-02-menu.jpg', 'https://mystorage.dileepadari.dev/images/portfolio/d7deaad1-b717-461f-bbf8-eace1090eee7-02-menu.jpg', array['https://mystorage.dileepadari.dev/images/portfolio/a471fbe5-b154-492e-84ab-85fea0d8c04a-01-home.jpg', 'https://mystorage.dileepadari.dev/images/portfolio/d7deaad1-b717-461f-bbf8-eace1090eee7-02-menu.jpg', 'https://mystorage.dileepadari.dev/images/portfolio/d771a603-3e4e-40c9-b54d-94cadaf59f09-03-canteens.jpg', 'https://mystorage.dileepadari.dev/images/portfolio/6056f112-fa0d-4ba2-9834-de0d68964c94-04-orders.jpg', 'https://mystorage.dileepadari.dev/images/portfolio/dbf82f15-359c-4001-959e-21ae1c4c7447-05-wallet.jpg', 'https://mystorage.dileepadari.dev/images/portfolio/b1ad176e-1906-46d4-8a18-bf0867cbaf1c-06-vendor-dashboard.jpg', 'https://mystorage.dileepadari.dev/images/portfolio/9daaf432-a935-4d03-8f2f-c2f1ad7155e0-07-vendor-queue.jpg', 'https://mystorage.dileepadari.dev/images/portfolio/cb55d28f-8b63-42c9-8378-1efe9fb57750-08-admin.jpg'], 'Order ahead from your campus canteens, pay digitally, watch your order being made, and collect it without queueing.', 'The lunch rush on a campus is a queueing problem, not a cooking problem. The kitchen can make a dosa in four minutes; the student spends twenty standing in a line, mostly waiting for the people in front to decide and pay. Ordering ahead removes the line, but only if the app is trustworthy enough that people actually rely on it.

Trustworthy here means specific things, and they are the parts that are easy to get wrong. Prices must come from the server, so a crafted request cannot buy a large coffee at small-coffee prices. An order must not be marked paid because a browser said so; the gateway''s signed webhook is the only authority. A status must not be able to jump from pending to completed, or skip backwards, because a vendor tapped the wrong control. And "is this canteen open" has to be computed in campus local time from a weekly schedule, not from whatever timezone the server happens to run in.

CanteenX is built around those constraints, and the code says so: option prices are looked up server-side from the menu, payments settle on a signed idempotent webhook, and the status graph is a literal `dict` of allowed transitions that the ordering service enforces.', 'The previous build worked in a demo and failed in the ways that only show up with real users.

The audit that started this rewrite found that **5 of 23 GraphQL queries carried any permission policy at all**, and that `getAllOrders(userId:)` would return any user''s order history to an anonymous caller. `Order.status` was a free-text column, so the codebase had written "Pending", "pending", "Paid" and "Completed" for overlapping concepts and no query could filter it reliably. The seed script hardcoded credentials and wrote the placeholder Razorpay key `rzp_test_YOUR_KEY_ID` into every merchant row, which silently switched the whole payment system into a mock that approved everything.

So the rewrite is organised around making those categories of mistake hard to repeat. Permissions are declarative classes that **every** field must name, including `AllowAny`, so an unpoliced field is a visible omission rather than an invisible default. Every status is an enum with an explicit transition table. Prices, customization pricing and totals are computed in one shared module used by both the cart and the order, so a basket and the order it becomes cannot disagree.', '[{"title":"Browse every canteen on campus","description":"live open/closed status derived from each canteen''s weekly schedule (in campus local time, not UTC), ratings, search, and per-category filtering."},{"title":"Real customization","description":"sizes, add-ons, spice levels and a note for the kitchen. Option prices are looked up server-side from the menu; the client only ever sends option ids, so a crafted request cannot change what an item costs."},{"title":"One cart, on the server","description":"it follows you between phone and laptop, holds items from a single canteen, and tells you before checkout if something has sold out."},{"title":"Payments that actually verify","description":"UPI and cards through Razorpay with server-side HMAC signature checking, plus a signed, idempotent webhook as the authoritative confirmation. Orders are never marked paid on a client''s say-so. There is also an internal wallet for one-tap repeat orders."},{"title":"Live order tracking","description":"the kitchen moves your order from confirmed to preparing to ready, and your screen updates over a WebSocket the moment it happens. No refreshing, no polling."},{"title":"Notifications that reach you","description":"persisted server-side and pushed live, so a status change finds you even if the tab was closed when it happened."},{"title":"Pre-orders and catering","description":"schedule a pickup time, or request a bulk order for an event and accept the canteen''s quote."},{"title":"Reviews and complaints","description":"both anchored to a real completed order, with a response flow the canteen and admins can work through."},{"title":"Vendor console","description":"live order queue, menu management with image upload, server-backed stock counts, promo codes, catering quotes, and revenue analytics."},{"title":"Admin console","description":"canteens, users and roles, complaint triage, and CSV-exportable reports."},{"title":"Light and dark themes","description":", keyboard-navigable, and usable on a phone - including the vendor and admin consoles."}]'::jsonb, null, '[{"name":"React 18","role":"Frontend"},{"name":"TypeScript","role":"Frontend"},{"name":"Vite","role":"Frontend"},{"name":"React Router","role":"Frontend"},{"name":"Apollo Client","role":"Frontend"},{"name":"Tailwind CSS v4","role":"Frontend"},{"name":"FastAPI","role":"Backend"},{"name":"Strawberry GraphQL","role":"Backend"},{"name":"async SQLAlchemy 2.0","role":"Backend"},{"name":"PostgreSQL","role":"Backend"},{"name":"Alembic","role":"Backend"},{"name":"GraphQL subscriptions over graphql-ws","role":"Real-time"},{"name":"Razorpay","role":"Payments"},{"name":"self-hosted object storage","role":"Storage"},{"name":"CSRF double-submit","role":"Auth"},{"name":"argon2 hashing","role":"Auth"},{"name":"and CAS single sign-on","role":"Auth"},{"name":"GitHub Actions - lint","role":"CI"},{"name":"type-check","role":"CI"},{"name":"migration drift check","role":"CI"}]'::jsonb, '```mermaid
flowchart TD
  WEB["React SPA<br/>frontend/src"]
  APOLLO["Apollo Client<br/>generated hooks from codegen"]
  GQL["Strawberry GraphQL<br/>app/api/graphql"]
  PERM["permissions.py<br/>role policies, every field named"]
  REST["REST<br/>app/api/rest: payments, uploads"]
  SVC["Domain services<br/>app/domain/services"]
  PRICE["pricing.py<br/>option validation and totals"]
  MODELS["SQLAlchemy models<br/>app/db/models"]
  PG[("PostgreSQL")]
  ALEMBIC["Alembic<br/>the only schema authority"]
  RZP["Razorpay"]
  WS["WebSocket subscriptions"]

  WEB --> APOLLO --> GQL
  GQL --> PERM
  GQL --> SVC
  REST --> SVC
  SVC --> PRICE
  SVC --> MODELS --> PG
  ALEMBIC --> PG
  REST -- "signed idempotent webhook" --> RZP
  SVC -- "order status events" --> WS --> WEB
```

Two layers of authorization, deliberately separated. **Permission classes** gate by role and are
declarative and cheap. **Services** enforce object-level ownership, because "is this order yours"
needs the loaded row and cannot live in a permission class.

`app/domain/pricing.py` is shared by the cart and the ordering service, so a basket total and the
order it becomes are computed by the same code. Prices are never taken from the client: only
option ids are, and their deltas are looked up here.', 'Everything runs from one compose file. You need Docker, and nothing else.

```bash
git clone https://github.com/Dileepadari/CanteenX.git
cd CanteenX
docker compose up --build          # db, api on :8000, web on :8080
```

Migrations run as a release step before the API starts, so the schema is always current. Then seed:

```bash
docker compose exec api python -m scripts.seed
```

For running the pieces natively, environment variables and deployment, see **[DEVDOC.md](./DEVDOC.md)**.

### Demo accounts

The seed builds 4 canteens with full menus, promotions, and **one order in every status** so the order list, the kitchen queue and both dashboards have real data rather than empty states.

| Role | Email | Password |
|---|---|---|
| Admin | `admin@canteenx.dev` | `$SEED_PASSWORD` |
| Vendor | `vendor1@canteenx.dev` | `$SEED_PASSWORD` |
| Student | `student@canteenx.dev` | `$SEED_PASSWORD` |

`SEED_PASSWORD` defaults to `canteenx-dev-2026` in development and is read from the environment, never from a literal in the repository.

### Tests

```bash
cd backend
pytest                # 32 tests: ordering, payments, authorization, regressions
```', null, null, null, null, null, 'Shipped'),
  ('ManagePEC', 'A management application for a university Physical Education Centre: students, staff, sports, fitness challenges, equipment and the money behind them, over a web app and a terminal front end.', 'https://github.com/Dileepadari/ManagePEC', null, 'https://mystorage.dileepadari.dev/images/portfolio/bc376774-de31-4c48-aab3-37028f7eb41a-analysis.png', array['https://mystorage.dileepadari.dev/images/portfolio/bc376774-de31-4c48-aab3-37028f7eb41a-analysis.png', 'https://mystorage.dileepadari.dev/images/portfolio/7b1794b1-4b01-47c8-9e62-7811224f7c49-challenges.png', 'https://mystorage.dileepadari.dev/images/portfolio/385fa55a-420e-4797-ad3b-04e1356728ca-dashboard.png', 'https://mystorage.dileepadari.dev/images/portfolio/cc19b2ae-f49b-4830-a66e-9d7020dad4b2-equipment.png', 'https://mystorage.dileepadari.dev/images/portfolio/2efd09e1-20a2-4a37-8258-1a3d24fb34c8-query-console.png', 'https://mystorage.dileepadari.dev/images/portfolio/872bdf3f-18f1-4e8b-8c44-ec95502e7a56-saved-queries.png', 'https://mystorage.dileepadari.dev/images/portfolio/e1cb66c5-3146-44e8-9655-8778a98bfdca-sports.png', 'https://mystorage.dileepadari.dev/images/portfolio/84f26c9a-8e72-4552-866b-9d791eb21167-staff.png', 'https://mystorage.dileepadari.dev/images/portfolio/c8cfddb9-4d11-4872-8aca-df9749a9eeb4-students.png'], false, 26, false, 0, 0, 'Python', '#3572A5', 'web development', null, 'managepec', 'https://mystorage.dileepadari.dev/images/portfolio/3252fd9a-9fb9-40cb-8eec-e1ac2af7b598-analysis.png', 'https://mystorage.dileepadari.dev/images/portfolio/7b1794b1-4b01-47c8-9e62-7811224f7c49-challenges.png', 'https://mystorage.dileepadari.dev/images/portfolio/6270e5e5-29a4-4c94-baf6-63635ba07160-challenges.png', array['https://mystorage.dileepadari.dev/images/portfolio/3252fd9a-9fb9-40cb-8eec-e1ac2af7b598-analysis.png', 'https://mystorage.dileepadari.dev/images/portfolio/6270e5e5-29a4-4c94-baf6-63635ba07160-challenges.png', 'https://mystorage.dileepadari.dev/images/portfolio/346a535d-226c-4e92-a49d-e98437d179e4-dashboard.png', 'https://mystorage.dileepadari.dev/images/portfolio/acc5a427-9eeb-4dcc-b298-797c07f252b0-equipment.png', 'https://mystorage.dileepadari.dev/images/portfolio/f51ae930-a1f4-454c-b223-53a1b7765415-query-console.png', 'https://mystorage.dileepadari.dev/images/portfolio/028d5280-27b6-4405-9db1-84f5d73ee302-saved-queries.png', 'https://mystorage.dileepadari.dev/images/portfolio/b81a0fd9-9ba4-441a-b749-891b4b94ca4f-sports.png', 'https://mystorage.dileepadari.dev/images/portfolio/7ebe8200-52e8-49c5-9384-f423135db50e-staff.png', 'https://mystorage.dileepadari.dev/images/portfolio/7b4ce4e3-1827-458a-94dd-45c5c91e1162-students.png'], 'A management application for a university Physical Education Centre - students, staff, sports, fitness challenges, equipment and the money behind them, with a web app and a terminal front end over the same database.', 'A physical education centre is a small organisation with a genuinely awkward
data problem. A student is three records, not one - a person, an academic
enrolment and a sport assignment - and adding one has to write all three or
none. A sport has a capacity that must never be exceeded, a venue, a trainer who
may have left, and equipment bought out of a fund release that has to stay on
the books after the equipment is retired. None of that fits in a spreadsheet
without somebody eventually keying a student into a full sport, or deleting a
sport and taking twenty students'' records with it.

So the rules live in the database and in one repository layer, not in whichever
screen happens to be in front of you. Retiring a sport clears the reference and
keeps every student, staff post and piece of equipment that pointed at it.
Overfilling a sport is refused. Making someone their own supervisor is refused.
A challenge that ends before it starts is refused. The web app and the terminal
front end both go through the same checks, so the answer does not depend on
which one you happened to open.

The query console exists for the same reason from the other direction: the
people who run the centre have real questions that nobody wrote a screen for.
They can run SQL without a shell account on the server, and a statement that
would change data is shown back to them before it runs rather than after.', 'It grew out of the Data and Applications course project (Physical Education
Centre, team Samachara_Kendhram) and is now a working application: the schema
was corrected, the SQL was rewritten to be parameterised, the Flask skeleton was
finished, and the whole thing is covered by tests. See
[docs/CHANGES-FROM-PHASE4.md](docs/CHANGES-FROM-PHASE4.md) for the full list.

Developer setup, architecture and data model live in [DEVDOC.md](DEVDOC.md).', null, '[{"label":"Quality","value":"pytest 216 tests"}]'::jsonb, '[{"name":"Python 3.11+"},{"name":"Flask 3"},{"name":"SQLite"},{"name":"MySQL"},{"name":"Jinja"}]'::jsonb, null, '```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

python -m managepec.cli init-db     # creates data/pec.db with sample data
python run.py                       # http://127.0.0.1:5000
```

No database server is needed. SQLite is the default; MySQL is a config change
away if you want the original setup.

The sample data is a working centre rather than a placeholder: 120 students
across eight departments, 26 staff, 14 sports with uneven enrolment, 12
challenges, 40 pieces of equipment in several maintenance states and a year of
fund releases. That is what makes the charts, the paging and the "students
without a sport" list say anything.

Running the tests:

```bash
python -m pytest -q                 # 216 tests, about a minute
```', null, null, null, null, null, 'Shipped'),
  ('Medico Extractor', 'An intelligent medical document processing engine converting degraded faxes, referral letters, and doctor handwritten notes into validated, structured JSON payloads using computer vision and NLP pipelines.', 'https://github.com/Dileepadari/Medico_Extractor', null, 'https://mystorage.dileepadari.dev/images/portfolio/c5a9a323-3b00-4f45-af40-6c8d66e8abd5-advanced.png', array['https://mystorage.dileepadari.dev/images/portfolio/c5a9a323-3b00-4f45-af40-6c8d66e8abd5-advanced.png', 'https://mystorage.dileepadari.dev/images/portfolio/2d2fa3ef-e1cd-45f6-8fe3-370a953d7105-api-docs.png', 'https://mystorage.dileepadari.dev/images/portfolio/590c9b18-7c41-4e1f-8f56-bca17fb71cc4-extract-flow.png', 'https://mystorage.dileepadari.dev/images/portfolio/2dc7b157-3f30-4bc6-b746-539eaae8d3cb-rejected-file.png', 'https://mystorage.dileepadari.dev/images/portfolio/1ed237cb-f390-4f6e-b062-533dad7c3e9b-results.png', 'https://mystorage.dileepadari.dev/images/portfolio/b64fa6d2-dcee-4092-a2e6-ec29dd7f7811-upload.png'], false, 15, false, 0, 0, 'Python', '#3572A5', 'ai/ml', array['Python', 'OCR', 'Document AI', 'FastAPI', 'Computer Vision', 'Data Extraction'], 'medico-extractor', 'https://mystorage.dileepadari.dev/images/portfolio/e393f75a-fbe2-4582-ae05-43f0b86e7797-advanced.png', 'https://mystorage.dileepadari.dev/images/portfolio/2d2fa3ef-e1cd-45f6-8fe3-370a953d7105-api-docs.png', 'https://mystorage.dileepadari.dev/images/portfolio/ab18878d-7673-483b-af78-a3118d82d07f-api-docs.png', array['https://mystorage.dileepadari.dev/images/portfolio/e393f75a-fbe2-4582-ae05-43f0b86e7797-advanced.png', 'https://mystorage.dileepadari.dev/images/portfolio/ab18878d-7673-483b-af78-a3118d82d07f-api-docs.png', 'https://mystorage.dileepadari.dev/images/portfolio/a31d270f-70fc-461d-b059-b66a2bbf17f5-extract-flow.png', 'https://mystorage.dileepadari.dev/images/portfolio/d48de8ee-d9fd-4840-b0ff-2156be938468-rejected-file.png', 'https://mystorage.dileepadari.dev/images/portfolio/fd02e627-4e32-43ba-847a-a7a934c3a9bd-results.png', 'https://mystorage.dileepadari.dev/images/portfolio/94c97b8c-028e-43f5-b40e-7500da3624b5-upload.png'], 'Turn a medical referral - a clean PDF or a smudged fax - into structured JSON in a few seconds.', 'Referral intake is copy-and-paste work: someone opens a fax, finds the patient''s
name, hunts for the member ID, squints at the referring provider''s phone number,
and retypes all of it into another system. Every one of those hops is a chance to
transpose a digit in a member ID, and a wrong member ID is a denied claim weeks
later that somebody then has to chase.

Medico Extractor does that first pass. Drop in a document, get back the fields -
and the ones it genuinely cannot find come back empty rather than invented.

That last part is the whole design. A referral intake tool that guesses is worse
than no tool at all: a blank field gets checked by a human, and a plausible wrong
one does not. So the model is instructed to transcribe rather than infer, the
response is validated against a typed schema before it leaves the server, and an
absent field is an empty string every time.', null, '[{"title":"Reads scans, not just text PDFs.","description":"Faxes, phone photos and native PDFs all go"},{"title":"Returns a fixed shape, every time.","description":"The response is validated against a typed"},{"title":"Never guesses.","description":"A field that isn''t in the document comes back as \"\". An"},{"title":"Keeps nothing.","description":"Uploads live in memory for the length of the request. Nothing"},{"title":"Comes with a UI.","description":"A drag-and-drop page is served at / - no build step, no"}]'::jsonb, '[{"label":"Quality","value":"pytest 88 tests"}]'::jsonb, '[{"name":"Python 3.11+"},{"name":"FastAPI"},{"name":"Pydantic 2"},{"name":"Gemini"},{"name":"LangChain"},{"name":"Docker"}]'::jsonb, 'One FastAPI process. No database, no queue, no object storage - state would only
be PHI at rest, and there is nothing here that needs to outlive a request.

```
browser / API client
        │  multipart POST  (PDF or image)
        ▼
┌─────────────────────────────────────────────────────────┐
│ FastAPI (app/main.py)                                   │
│                                                          │
│  RequestContextMiddleware   request id, access log       │
│  SecurityHeadersMiddleware  nosniff, DENY, no-store, HSTS│
│  CORSMiddleware / GZip                                   │
│                                                          │
│  /healthz  /readyz          routers/health.py            │
│  /api/v1/extract            routers/extraction.py        │
│     ├── verify_api_key            security.py            │
│     ├── enforce_rate_limit        security.py            │
│     ├── read_upload               services/documents.py  │
│     └── ReferralExtractor.extract services/extractor.py  │
│                                          │               │
└──────────────────────────────────────────┼───────────────┘
                                           ▼
                              Gemini (structured output)
```

Three ideas hold the design together:

**Documents are never trusted and never persisted.** `services/documents.py` reads
the upload in 64 KiB chunks, aborts the moment it crosses the size limit, and
classifies the file by its magic bytes - the client''s `Content-Type` is only a
hint. The bytes then live in one `ValidatedDocument` for the length of the
request and are dropped.

**The model returns a type, not text.** `ExtractedReferralData` is handed to
LangChain''s `with_structured_output`, so Gemini fills in a schema rather than
producing prose that we then have to parse. Sending the document straight to a
multimodal model also removes the entire OCR pipeline (Tesseract, Poppler,
`pdf2image`, `PyPDF2`) that an earlier version of this project needed.

**Everything request-scoped hangs off `app.state`.** Settings, the extractor and
the rate limiter are attached in `create_app()`, so there are no module-level
globals, and tests can build as many differently-configured apps as they like in
one process.', null, null, null, null, null, null, 'Shipped'),
  ('FinLearn', 'A financial literacy app for informal workers in India, built for a cheap Android phone and for readers more at home in Hindi or Telugu. Everything runs on the device: no server, no network.', 'https://github.com/Dileepadari/FinLearn', null, 'https://mystorage.dileepadari.dev/images/portfolio/30e905d0-1a8c-48be-b658-c3eb943f0868-01-home.png', array['https://mystorage.dileepadari.dev/images/portfolio/30e905d0-1a8c-48be-b658-c3eb943f0868-01-home.png', 'https://mystorage.dileepadari.dev/images/portfolio/f0936b84-26a5-447e-9509-f8e3b6583828-02-learn.png', 'https://mystorage.dileepadari.dev/images/portfolio/76563455-8729-45c2-8aef-6f7d42bb03a7-03-games.png', 'https://mystorage.dileepadari.dev/images/portfolio/b45e44ff-5f2a-4c7e-be92-faf68d227606-04-community.png', 'https://mystorage.dileepadari.dev/images/portfolio/cac48fd0-148d-48f9-9235-32882af54b09-05-profile.png', 'https://mystorage.dileepadari.dev/images/portfolio/d37a43fa-f48c-4f23-8154-abfcaa5d3b7a-06-reels.png'], false, 30, false, 0, 0, 'TypeScript', '#3178c6', 'web development', null, 'finlearn', 'https://mystorage.dileepadari.dev/images/portfolio/e92492cb-e4d5-4613-a938-d90487eb1b0a-01-home.png', 'https://mystorage.dileepadari.dev/images/portfolio/f0936b84-26a5-447e-9509-f8e3b6583828-02-learn.png', 'https://mystorage.dileepadari.dev/images/portfolio/50baac3c-2e83-42b6-92dc-808eb1786665-02-learn.png', array['https://mystorage.dileepadari.dev/images/portfolio/e92492cb-e4d5-4613-a938-d90487eb1b0a-01-home.png', 'https://mystorage.dileepadari.dev/images/portfolio/50baac3c-2e83-42b6-92dc-808eb1786665-02-learn.png', 'https://mystorage.dileepadari.dev/images/portfolio/b5f13300-dd8b-4b9c-b171-5cb1d9921fc5-03-games.png', 'https://mystorage.dileepadari.dev/images/portfolio/e79dba62-89bf-4413-b31e-33ad84060008-04-community.png', 'https://mystorage.dileepadari.dev/images/portfolio/9ddb9864-9768-4be2-8255-656f08206b1b-05-profile.png', 'https://mystorage.dileepadari.dev/images/portfolio/56b2eeb3-fd94-49ed-940a-a258f075985e-06-reels.png'], 'A financial literacy app for informal workers in India, built for someone on a cheap Android phone who reads Hindi or Telugu more comfortably than English. Everything runs on the device: no server, no cloud account, no network call after the first load.', 'The people this is for are the ones financial apps are worst at. They are paid
in cash, often weekly. They have a phone but not much data. They read a second
language slowly, and an app that assumes otherwise is an app they close.

So the constraints came first and the features second. **Everything is on the
device**, which is why it works on a train, in a village with patchy signal, and
on a phone with no data left. Nothing is uploaded, which also means there is no
account to lose and no privacy conversation to have: the footer says "FinLearn
saves everything on your device. Nothing is sent anywhere" because that is
literally true.

The rest follows from who is reading. Lessons are short enough to finish in one
sitting, because the reading is the effort. Every screen has **Read aloud**,
because being able to read is not the same as reading comfortably. The money in
the examples is rupees at amounts these jobs actually pay. And the games are
rehearsals for the situations that cost people money: spotting a scam call,
splitting one month''s pay, deciding whether an EMI is worth it.

The onboarding asks five questions before showing anything, which is unusual and
deliberate: a lesson about EMIs is useless to someone who has never borrowed.', null, '[{"title":"Learning","description":"- Short lessons grouped into six topics: money basics, saving, budgeting, loans and debt, growing money, and spotting scams - Each lesson mixes a written explanation, a story from someone in a similar situation, a short video, and a quiz - Lessons resume exactly where you left off, including mid-quiz - Every lesson, question and story has a read-aloud button that speaks it in your language"},{"title":"Reels","description":"- Full-screen vertical videos, one swipe apart - Each reel carries a written summary and key points, so it still works with the sound off - Like, save, and jump straight to the lesson the reel is drawn from - Watching a reel to the end earns XP once, not every time you scroll past it"},{"title":"Games","description":"Six 3D games. Nothing in them costs real money."},{"title":"Community","description":"- A feed of stories, questions and tips from other people in similar work - Post your own, comment on others, save the ones worth coming back to - Connect with people and message them"},{"title":"Progress","description":"- Every reward is celebrated: a quick pill for small wins, a full screen with confetti for a first, a badge, a level up, a streak milestone or a game result - Coins, XP and levels earned from lessons, reels, games and community posts - A daily streak, and three daily tasks that change every day - Twelve badges, awarded from what you have actually done rather than announced and forgotten - A progress chart by topic, plus everything you liked and saved in one place"},{"title":"Look and feel","description":"- Warm paper surfaces and indigo ink, modelled on the ledger a shopkeeper actually keeps, rather than a screen of cold grey cards - Anek and Baloo, two families drawn for Latin, Devanagari and Telugu together, so the app reads the same in every language - Marigold means one thing only: a reward - Built to stay readable on a cheap screen in direct sunlight"},{"title":"Accessibility","description":"- Three languages, complete: English, Hindi and Telugu. Switching changes the lessons too, not only the buttons - Read-aloud on lessons, questions and game instructions - Text size control, light and dark themes, and a reduce-animation setting - Every button carries a visible label, never an icon on its own - Touch targets are at least 44px, and the layout works from a 320px phone to a 2560px monitor"},{"title":"Your data","description":"- Everything is stored on the device. Nothing is uploaded - Your PIN is hashed, never stored as you typed it - Settings has a button to download a copy of all your data, and one to erase it"}]'::jsonb, '[{"label":"Quality","value":"Vitest 133 tests"}]'::jsonb, '[{"name":"React 19"},{"name":"TypeScript"},{"name":"Vite"},{"name":"PWA offline"}]'::jsonb, null, 'See **[DEVDOC.md](./DEVDOC.md#local-development)**.', null, null, null, null, null, 'Shipped')
on conflict do nothing;

insert into public.experience (title, company, duration, location, description, technologies, order_index) values
  ('Tech Team Member', 'Club Council, IIIT Hyderabad', 'August 2023 - April 2026', 'Hyderabad, Telangana', array['Maintaining and modernizing club web infrastructure, centralized servers, and event registration portals for all student organizations across campus.', 'Architected responsive web applications using Next.js, FastAPI, and Tailwind CSS to boost campus-wide student engagement during major festivals.', 'Provided end-to-end technical support and infrastructure scaling during high-traffic hackathons and collegiate events.'], array['Next.js', 'React', 'FastAPI', 'Tailwind CSS', 'Server Deployment'], 5),
  ('Social Media Team Head', 'National Service Scheme (NSS), IIIT Hyderabad', 'July 2023 - July 2025', 'Hyderabad, Telangana', array['Directed the NSS digital outreach and media initiatives, driving student volunteer engagement for community service, blood donation, and literacy drives.', 'Managed event logistics, cross-functional volunteer coordination, and promotional campaigns across university channels.'], array['Leadership', 'Community Outreach', 'Event Management', 'Digital Strategy'], 6),
  ('GSoC 2026 Mentor & 2025 Contributor', 'Joomla! CMS (Google Summer of Code)', 'May 2025 - Present', 'Remote', array['Mentoring Google Summer of Code 2026 contributors, guiding architectural system design, code reviews, and community engagement for Joomla! CMS workflows.', 'Engineered the interactive Workflow Graph Editor during GSoC 2025 using Vue.js and VueFlow, enabling visual management of article lifecycle stages and transitions.', 'Consolidated complex multi-step workflows spanning 6-7 pages into a single, cohesive drag-and-connect visual interface, improving authoring efficiency by 300%.'], array['Vue.js', 'VueFlow', 'PHP', 'Joomla Framework', 'Open Source', 'JavaScript'], 1),
  ('Undergraduate Researcher', 'SERC Lab, IIIT Hyderabad', 'April 2024 - Present', 'Hyderabad, Telangana', array['Investigating principles of applied human-centered design (HCD) and human-computer interaction (HCI) under Dr. Raman Saxena to optimize software usability and workflows.', 'Enhanced institute ERP systems serving 4,000+ students, faculty, and staff by conducting usability testing, cognitive walkthroughs, and accessibility compliance.', 'Streamlined multi-step administrative workflows across 10+ operational use cases, measurably elevating user satisfaction and task completion speeds.'], array['Human-Centered Design', 'Usability Testing', 'HCI', 'Design Thinking', 'Accessibility', 'Figma'], 2),
  ('Software Engineering Intern', 'Virtual Labs', 'January 2024 - April 2024', 'Hyderabad, Telangana', array['Architected and built the Virtual Labs Authoring Environment VS Code Web Extension using TypeScript, Webpack, and VS Code Extension APIs, supporting 1,000+ students.', 'Integrated automated GitHub deployment, experiment schema validation, and security sandbox features, reducing author setup time by 80%.', 'Facilitated weekly client feedback cycles, iteratively delivering 10+ core product features within a strict 70-day sprint cycle.'], array['TypeScript', 'Webpack', 'VS Code Extensions', 'Node.js', 'GitHub Actions'], 3),
  ('Web Administrator', 'IT Office, IIIT Hyderabad', 'August 2023 - Present', 'Hyderabad, Telangana', array['Ensuring high availability, security hardening, and reliability for critical university web portals serving 1,000+ daily active campus users.', 'Streamlined continuous deployment pipelines, monitoring server health, and proactively diagnosing and resolving 10-30 technical issues monthly.', 'Designed and launched event portals, conference microsites, and administrative web tools with responsive UI and accessibility standards.'], array['Web Development', 'Nginx', 'Apache', 'Linux', 'Full-Stack Development', 'Server Admin'], 4),
  ('Site Reliability Engineer', 'Chubb Business Services India', 'June 2026 - Present', 'Hyderabad, India', array['Architecting and maintaining enterprise-grade, high-availability cloud infrastructure and observability telemetry using Dynatrace, OpenTelemetry, and Python.', 'Engineering automated incident detection, performance monitoring, and site reliability workflows to ensure maximum uptime across mission-critical services.', 'Collaborating with cross-functional distributed teams to drive resilient system architecture, CI/CD automation, and cloud-native standards.'], array['.NET', 'Python', 'SRE', 'Dynatrace', 'OpenTelemetry', 'Docker', 'CI/CD'], 0)
on conflict do nothing;

insert into public.education (degree, institution, duration, gpa, location, description, coursework, order_index) values
  ('B.Tech in Computer Science & Engineering (Honors)', 'International Institute of Information Technology, Hyderabad (IIIT-H)', '2022 - 2026', '7.08 CGPA', 'Hyderabad, Telangana', 'Bachelor of Technology in Computer Science & Engineering with Honors. Focused on Distributed Systems, Cloud Architecture, Human-Centered Software Design, and Systems Programming.', array['Data Structures and Algorithms', 'Operating Systems and Networks', 'Database Management Systems', 'Distributed Systems', 'Design and Analysis of Software Systems', 'Algorithm Analysis and Design', 'Computer Organization and Architecture', 'Internet of Things', 'Information Security', 'Machine Data and Learning', 'Computer Graphics', 'Principles of Programming Languages', 'Embedded Systems Workshop', 'Human-Computer Interaction'], 1),
  ('Pre University Course (MPC)', 'Rajiv Gandhi University of Knowledge Technologies (RGUKT), Srikakulam', '2020 - 2022', '9.35 CGPA', 'Srikakulam, Andhra Pradesh', 'Completed 2-year Pre-University Course in Mathematics, Physics, and Chemistry with academic distinction.', array['Mathematics', 'Physics', 'Chemistry', 'Intro to Computing'], 2),
  ('Secondary School Certificate (SSC)', 'Prasanthi Nikethan M.V.V.S Murthy English Medium High School, Anakapalli', '2008 - 2020', '10.0 CGPA', 'Anakapalli, Andhra Pradesh', 'Completed secondary education with a perfect 10.0 CGPA (Grade A+ with Distinction).', array['Mathematics', 'Physical Sciences', 'Biological Sciences', 'Social Studies'], 3)
on conflict do nothing;

insert into public.skills (category, skill_name, proficiency, icon_url, order_index) values
  ('Programming Languages', 'Python', 95, null, 1),
  ('Programming Languages', 'TypeScript', 90, null, 2),
  ('Programming Languages', 'JavaScript', 95, null, 3),
  ('Programming Languages', 'C', 90, null, 4),
  ('Programming Languages', 'C++', 85, null, 5),
  ('Programming Languages', 'Rust', 80, null, 6),
  ('Programming Languages', 'PHP', 80, null, 7),
  ('Programming Languages', 'SQL', 90, null, 8),
  ('Programming Languages', 'Bash / Shell', 85, null, 9),
  ('Frontend Development', 'React', 95, null, 10),
  ('Frontend Development', 'Next.js', 90, null, 11),
  ('Frontend Development', 'Vue.js', 85, null, 12),
  ('Frontend Development', 'Tailwind CSS', 95, null, 13),
  ('Frontend Development', 'HTML5', 98, null, 14),
  ('Frontend Development', 'CSS3', 92, null, 15),
  ('Frontend Development', 'Radix UI / shadcn', 90, null, 16),
  ('Frontend Development', 'Bootstrap', 80, null, 17),
  ('Backend Development', 'FastAPI', 92, null, 18),
  ('Backend Development', 'Node.js', 88, null, 19),
  ('Backend Development', 'Express.js', 88, null, 20),
  ('Backend Development', 'Flask', 85, null, 21),
  ('Backend Development', 'RabbitMQ', 85, null, 22),
  ('Backend Development', 'REST APIs', 95, null, 23),
  ('Backend Development', 'GraphQL', 82, null, 24),
  ('Backend Development', 'Deno / Edge Functions', 85, null, 25),
  ('Database', 'PostgreSQL', 90, null, 26),
  ('Database', 'MySQL', 88, null, 27),
  ('Database', 'SQLite', 88, null, 28),
  ('Database', 'MongoDB', 82, null, 29),
  ('Database', 'Redis', 80, null, 30),
  ('Database', 'Prisma', 85, null, 31),
  ('Database', 'Supabase', 92, null, 32),
  ('Devops', 'Docker', 88, null, 33),
  ('Devops', 'Git & GitHub Actions', 92, null, 34),
  ('Devops', 'Linux', 90, null, 35),
  ('Devops', 'Dynatrace & OpenTelemetry', 82, null, 36),
  ('Devops', 'Nginx', 82, null, 37),
  ('Devops', 'Apache', 78, null, 38),
  ('Devops', 'PM2', 80, null, 39),
  ('Tools & Technologies', 'VS Code', 95, null, 40),
  ('Tools & Technologies', 'Postman', 90, null, 41),
  ('Tools & Technologies', 'Vim', 80, null, 42),
  ('Tools & Technologies', 'Arduino / IoT Sensors', 82, null, 43),
  ('Tools & Technologies', 'Joomla! CMS', 90, null, 44),
  ('Tools & Technologies', 'WordPress', 85, null, 45),
  ('Design', 'Human-Centered Design (HCD)', 92, null, 46),
  ('Design', 'Usability Testing & HCI', 90, null, 47),
  ('Design', 'Figma', 85, null, 48),
  ('Design', 'Design Thinking', 88, null, 49)
on conflict do nothing;

insert into public.courses (name, description, institution, completion_date, certificate_url, is_favorite, order_index) values
  ('Software Engineering', 'Design patterns, agile development, CI/CD, modular architecture and testing.', 'IIIT Hyderabad', null, null, true, 1),
  ('Design Thinking', 'Human-centered design process, empathy mapping, ideation, and rapid prototyping.', 'IIIT Hyderabad', null, null, true, 2),
  ('Operating Systems & Networks', 'Kernel architecture, process scheduling, concurrency, virtual memory, and TCP/IP stack.', 'IIIT Hyderabad', null, null, true, 3),
  ('Design & Analysis of Software Systems', 'Software architecture paradigms, UML modeling, refactoring, and clean code principles.', 'IIIT Hyderabad', null, null, true, 4),
  ('Distributed Systems & Storage', 'Consensus algorithms, replication, fault tolerance, RPCs, and distributed file systems.', 'IIIT Hyderabad', null, null, true, 5),
  ('User Interaction & Usability of Digital Products', 'HCI principles, heuristic evaluation, usability metrics, and accessibility guidelines.', 'IIIT Hyderabad', null, null, true, 6),
  ('Algorithm Analysis & Design', 'Asymptotic complexity, dynamic programming, greedy methods, graph algorithms, and NP-completeness.', 'IIIT Hyderabad', null, null, true, 7),
  ('Data Structures & Algorithms', 'Trees, heaps, hash tables, disjoint sets, and algorithmic problem-solving paradigms.', 'IIIT Hyderabad', null, null, true, 8),
  ('Database Management Systems', 'Relational algebra, SQL, query optimization, indexing (B+ trees), and ACID transactions.', 'IIIT Hyderabad', null, null, true, 9),
  ('Internet of Things', 'Microcontroller programming (ESP32/Arduino), MQTT/HTTP protocols, sensor integration, and cloud platforms.', 'IIIT Hyderabad', null, null, false, 10),
  ('Introduction to Information Security', 'Cryptography primitives, network security, authentication mechanisms, and vulnerability analysis.', 'IIIT Hyderabad', null, null, false, 11),
  ('Machine, Data and Learning', 'Statistical learning, regression, classification, clustering, and neural network foundations.', 'IIIT Hyderabad', null, null, false, 12),
  ('Data Analytics', 'Exploratory data analysis, predictive modeling, data visualization, and pipeline processing.', 'IIIT Hyderabad', null, null, false, 13),
  ('Computer Systems Organization', 'Instruction set architectures (RISC/MIPS), pipelining, cache memory hierarchy, and digital logic.', 'IIIT Hyderabad', null, null, false, 14),
  ('Digital Systems & Microcontrollers', 'Combinational and sequential logic design, state machines, microcontrollers, and assembly programming.', 'IIIT Hyderabad', null, null, false, 15),
  ('Principles of Programming Languages', 'Syntax and semantics, functional programming, type systems, and interpreter construction.', 'IIIT Hyderabad', null, null, false, 16),
  ('Embedded Systems Workshop', 'Hands-on firmware development, hardware timers, interrupts, and serial communication (I2C/SPI).', 'IIIT Hyderabad', null, null, false, 17),
  ('Computer Graphics', '2D/3D transformations, rendering pipelines, ray tracing, OpenGL, and shader programming.', 'IIIT Hyderabad', null, null, false, 18),
  ('Social Science Perspective in HCI', 'Qualitative user research, contextual inquiry, socio-technical systems, and ethics in computing.', 'IIIT Hyderabad', null, null, false, 19),
  ('Business Fundamentals', 'Entrepreneurship, market research, financial modeling, and product-market fit strategies.', 'IIIT Hyderabad', null, null, false, 20)
on conflict do nothing;

insert into public.achievements (title, description, date_achieved, certificate_url, order_index) values
  ('Codeforces Pupil & Competitive Programming Milestone', 'Achieved a peak rating of 1300 (Pupil) on Codeforces, actively solving complex algorithmic problem sets spanning dynamic programming, graph algorithms, and data structures.', '2024-05-01', 'https://codeforces.com/profile/adaridileep', 1),
  ('Study With Us C Programming Certification', 'Completed rigorous C Programming and Systems Foundations coursework offered by the RGUKT collegiate academic initiative.', '2022-05-01', null, 4),
  ('District Level Silver Medal in International Mathematics Olympiad', 'Secured a Silver Medal at the district level in the International Mathematics Olympiad, recognizing top mathematical problem-solving skills.', '2016-08-01', null, 6),
  ('Google Summer of Code (GSoC) 2025 Contributor & 2026 Mentor', 'Successfully completed GSoC 2025 with Joomla! CMS, engineering the visual Workflow Graph Editor. Appointed as GSoC 2026 Mentor to guide incoming contributors.', '2025-08-01', 'https://raw.githubusercontent.com/Dileepadari/Dileepadari.github.io/main/certificates/Dileep_GSoC_completion.pdf', 0),
  ('Bharat Intern Full-Stack Development Certification', 'Completed a comprehensive virtual internship building full-stack web applications and APIs, earning top performance certification.', '2024-01-01', 'https://raw.githubusercontent.com/Dileepadari/Dileepadari.github.io/main/certificates/Dileep_Bharat_Intern_completion.pdf', 2),
  ('DevTown Web Development Certification & Appreciation', 'Earned certification with special appreciation in the DevTown Web Development Bootcamp, building full-stack applications and RESTful architectures.', '2022-05-01', 'https://raw.githubusercontent.com/Dileepadari/Dileepadari.github.io/main/certificates/Dileep_devtown_appreciation.pdf', 3),
  ('Shape AI Python & Cyber Security Certification', 'Completed an intensive bootcamp in core Python programming, networking principles, and information security fundamentals with certification upon examination.', '2021-06-01', 'https://raw.githubusercontent.com/Dileepadari/Dileepadari.github.io/main/certificates/Dileep_devtown_cybersecurity_completion.pdf', 5)
on conflict do nothing;

insert into public.languages (name, level, proficiency, order_index) values
  ('Telugu', 'Native', 100, 1),
  ('English', 'Fluent', 90, 2),
  ('Hindi', 'Conversational', 75, 3)
on conflict do nothing;

insert into public.blog_posts (title, slug, content, excerpt, image_url, published, tags, order_index, images, external_link) values
  ('Reflecting on Building the VS Code Web Extension: A Student’s Journey', 'reflecting-on-building-the-vs-code-web-extension-a-students-journey', 'External content', 'A reflective journey through building a web-based version of the Virtual Labs VS Code extension - exploring challenges like bundling Node modules, GitHub API limits, and transforming a desktop tool into a seamless browser experience.', 'https://miro.medium.com/v2/resize:fit:640/format:webp/1*sT9hFmszNvBP5qiTiEeOUw.png', true, array['VS Code Extensions', 'Web Extensions', 'Virtual Labs', 'Software Development', 'Journey', 'Open Source', 'IIIT Hyderabad'], 0, null, 'https://medium.com/p/772936a7fbcc'),
  ('Workflows Made Visible: Introducing Joomla''s Workflow Graph Editor', 'workflows-made-visible-introducing-joomlas-workflow-graph-editor', 'External content', 'Discover Joomla’s new Workflow Graph Editor - a visual, drag-and-connect way to design and manage workflows. Built with Vue.js and VueFlow, it turns complex approval processes into intuitive flowcharts for admins and authors alike.', 'https://magazine.joomla.org/images/easyblog_articles/3791/September-GSOC-Dileepkuma_20250916-190432_1.jpg', true, array['Joomla', 'Workflow', 'Graph Editor', 'Vue.js', 'VueFlow', 'Open Source', 'CMS', 'Content Management', 'Visualization', 'Google Summer of Code'], 1, null, 'https://magazine.joomla.org/all-issues/september-2025/workflows-made-visible-introducing-joomla%E2%80%99s-workflow-graph-editor'),
  ('Joomla! Workflows, Reimagined: My GSoC Journey from Form Fields to Flowcharts', 'joomla-workflows-reimagined-my-gsoc-journey-from-form-fields-to-flowcharts', 'External content', 'A behind-the-scenes look at building Joomla’s new visual Workflow Graph Editor during GSoC - from scattered form fields to a sleek, interactive flowchart experience.', 'https://magazine.joomla.org/images/easyblog_articles/3756/August-JCM-JoomlaWorkflowsReimagined1124.jpg', true, array['Google Summer of Code', 'Joomla', 'Workflow', 'Graph Editor', 'Vue.js', 'UI/UX Design', 'CMS'], 3, null, 'https://magazine.joomla.org/all-issues/august-2025/joomla-workflows-reimagined-my-gsoc-journey-from-form-fields-to-flowcharts')
on conflict do nothing;
