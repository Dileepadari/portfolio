-- Local development and screenshot data.
--
-- Applied by `supabase db reset`, never to the hosted project. Nothing here is
-- a real person's data: the account is a demo one and the projects are the
-- author's own public repositories, described from their public READMEs.
--
-- Two of the projects are deliberately incomplete. The detail page omits a
-- section when its column is null rather than rendering an empty heading, and
-- that behaviour is only visible if something exercises it.
--
-- Image URLs point at raw.githubusercontent, at screenshots committed in those
-- repositories. Real, public, and stable, so the seed does not need binaries of
-- its own and the dark/light pairing can be seen rather than described.

insert into public.personal_info (name, title, bio, location, email, github, linkedin, website)
values (
  'Dileep Adari',
  'Software engineer',
  'I build things that have to keep working when nobody is watching: distributed
   file systems, monitoring for greenhouses, placement trackers for a campus of
   several thousand. Mostly backend, happiest at the boundary between a program
   and the physical thing it is responsible for.',
  'Hyderabad, India',
  'demo@example.com',
  'https://github.com/Dileepadari',
  'https://linkedin.com/in/dileepadari',
  'https://dileepadari.dev'
)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- A fully populated project: every section on the detail page has content.
-- ---------------------------------------------------------------------------
insert into public.projects (
  title, slug, tagline, description, overview, problem,
  github_url, live_url, docs_url,
  image_url, image_url_light, hero_url, hero_url_light, images, images_light,
  features, metrics, tech_stack,
  architecture, getting_started, readme,
  project_role, timeline, status,
  language, language_color, tags, category,
  featured, order_index, stars, forks
) values (
  'NFSDrive',
  'nfsdrive',
  'A distributed network file system in C11, with replication and failover',
  'Storage servers export mounts, a naming server tracks which server owns what, and clients work against one namespace.',
  'NFSDrive is a network file system built from scratch in C11. **Storage servers**
export local directories as mounts. A **naming server** keeps the map from paths
to the server that owns them. **Clients** see one namespace and never need to
know which machine a file is actually on.

Everything is threaded: worker pools on both server roles, heartbeats to detect a
dead storage server, and asynchronous writes that acknowledge before the commit
lands.',
  'The interesting part of a network file system is not reading a file. It is what
happens when the machine holding it goes away mid-write, and whether the client
finds out in a way it can act on.

Most teaching implementations return an error and stop. This one replicates each
mount, promotes a replica when a heartbeat lapses, and keeps the write path
correct across the handoff, which is where all the difficulty actually lives.',
  'https://github.com/Dileepadari/NFSDrive',
  null,
  null,
  'https://raw.githubusercontent.com/Dileepadari/NFSDrive/main/docs/screenshots/dark/namespace.png',
  'https://raw.githubusercontent.com/Dileepadari/NFSDrive/main/docs/screenshots/light/namespace.png',
  'https://raw.githubusercontent.com/Dileepadari/NFSDrive/main/docs/screenshots/dark/readwrite.png',
  'https://raw.githubusercontent.com/Dileepadari/NFSDrive/main/docs/screenshots/light/readwrite.png',
  array[
    'https://raw.githubusercontent.com/Dileepadari/NFSDrive/main/docs/screenshots/dark/namespace.png',
    'https://raw.githubusercontent.com/Dileepadari/NFSDrive/main/docs/screenshots/dark/readwrite.png',
    'https://raw.githubusercontent.com/Dileepadari/NFSDrive/main/docs/screenshots/dark/files.png',
    'https://raw.githubusercontent.com/Dileepadari/NFSDrive/main/docs/screenshots/dark/errors.png'
  ],
  array[
    'https://raw.githubusercontent.com/Dileepadari/NFSDrive/main/docs/screenshots/light/namespace.png',
    'https://raw.githubusercontent.com/Dileepadari/NFSDrive/main/docs/screenshots/light/readwrite.png',
    'https://raw.githubusercontent.com/Dileepadari/NFSDrive/main/docs/screenshots/light/files.png',
    'https://raw.githubusercontent.com/Dileepadari/NFSDrive/main/docs/screenshots/light/errors.png'
  ],
  '[
    {"title": "One namespace across servers", "description": "Clients address paths, never machines. The naming server resolves ownership on every operation."},
    {"title": "Replication and failover", "description": "Each mount has a replica. A lapsed heartbeat promotes it, and in-flight writes survive the promotion."},
    {"title": "Asynchronous writes", "description": "Large writes acknowledge on staging and commit on a separate thread, with the exclusion held across the handoff."},
    {"title": "LRU path cache", "description": "The naming server caches recent lookups, so a hot directory does not become a bottleneck."},
    {"title": "Concurrent readers, exclusive writers", "description": "A hand-built lock table: many readers or one writer per path, releasable by a thread other than the one that took it."},
    {"title": "Structured error codes", "description": "Every failure reaches the client as a code it can branch on, not as a closed socket."}
  ]'::jsonb,
  '[
    {"label": "Language", "value": "C11"},
    {"label": "Processes", "value": "4"},
    {"label": "Data races", "value": "0"},
    {"label": "CI", "value": "41s"}
  ]'::jsonb,
  '[
    {"name": "C11", "role": "Everything"},
    {"name": "POSIX threads", "role": "Worker pools, heartbeats, async commit"},
    {"name": "BSD sockets", "role": "Transport"},
    {"name": "ThreadSanitizer", "role": "Race detection in CI"},
    {"name": "GNU Make", "role": "Build"},
    {"name": "GitHub Actions", "role": "Build, test, sanitize"}
  ]'::jsonb,
  '```
        client
          |  one namespace, path-addressed
          v
    naming server  ----- heartbeats ----->  storage server 1  (/data)
      path -> owner                          storage server 2  (/archive)
      LRU cache                              replica of /data
          |
          +-- promotes a replica when a heartbeat lapses
```

The naming server never holds file data. It answers "who owns this path" and gets
out of the way; the client then talks to the storage server directly, so the
naming server is not on the data path and cannot become its bottleneck.',
  '```sh
make
./bin/nfs-naming-server --port 8080

# In another terminal, per storage server:
./bin/nfs-storage-server --root ./data --port 8081 --mount /data -n 8080

# Then:
./bin/nfs-client -n 8080
nfs> ls /
```

`make test` runs the unit suite; `tests/integration/run.sh` boots a whole
cluster, exercises failover, and tears it down with a bounded wait.',
  '# NFSDrive

A distributed network file system in C11.

## What it is

Storage servers export directories as mounts. A naming server tracks which
server owns which path. Clients work against a single namespace and never
address a machine directly.

## Building

```sh
make            # binaries into bin/
make test       # unit tests
```

## Running a cluster

Start the naming server first, then any number of storage servers, then a
client. See `Getting started` above for the exact commands.

## Design notes

- **The naming server is not on the data path.** It answers ownership queries
  and the client then talks to the storage server directly.
- **Replication is per mount, not per file.** A storage server registers as a
  replica of another mount and receives every committed write for it.
- **Failover is heartbeat driven.** Three missed beats promotes the replica.
- **The lock table is a mutex, a condition variable, a reader count and a
  writer flag** rather than a `pthread_rwlock_t`, because an asynchronous write
  is released by a different thread than the one that acquired it, and
  unlocking an rwlock from another thread is undefined behaviour.

## Testing

`tests/integration/run.sh` starts a four-process cluster, kills a storage
server mid-write, and asserts the client sees the replica. CI additionally
runs the whole thing under ThreadSanitizer with `halt_on_error=1`.

## License

MIT.',
  'Sole author',
  'Sep 2023 - Nov 2023',
  'Shipped',
  'C',
  '#555555',
  array['distributed-systems', 'c', 'threading', 'filesystem', 'replication'],
  'distributed systems',
  true, 1, 12, 3
) on conflict do nothing;

-- ---------------------------------------------------------------------------
-- A partially populated project: no README, no architecture, no gallery. The
-- developer half of the page should shrink to just the tech stack.
-- ---------------------------------------------------------------------------
insert into public.projects (
  title, slug, tagline, description, overview,
  github_url, image_url, image_url_light, images, images_light,
  features, tech_stack,
  language, language_color, tags, category,
  featured, order_index, stars, forks, status
) values (
  'PlantIQ',
  'plantiq',
  'Six sensors on an ESP32, judged against a safe range per plant species',
  'A plant health monitor for an experimental farm, with alerts pushed from the firmware the moment a reading crosses a threshold.',
  'A plant under pathogen attack changes the volatile organic compounds it releases
days before a leaf yellows. PlantIQ reads VOC alongside temperature, humidity,
soil moisture, light and CO2, and judges each against the safe range for the
species being grown.',
  'https://github.com/Dileepadari/PlantIQ',
  'https://raw.githubusercontent.com/Dileepadari/PlantIQ/main/docs/screenshots/dark/dashboard.png',
  'https://raw.githubusercontent.com/Dileepadari/PlantIQ/main/docs/screenshots/light/dashboard.png',
  array[
    'https://raw.githubusercontent.com/Dileepadari/PlantIQ/main/docs/screenshots/dark/dashboard.png',
    'https://raw.githubusercontent.com/Dileepadari/PlantIQ/main/docs/screenshots/dark/statistics.png',
    'https://raw.githubusercontent.com/Dileepadari/PlantIQ/main/docs/screenshots/dark/analysis.png',
    'https://raw.githubusercontent.com/Dileepadari/PlantIQ/main/docs/screenshots/dark/alerts.png'
  ],
  array[
    'https://raw.githubusercontent.com/Dileepadari/PlantIQ/main/docs/screenshots/light/dashboard.png',
    'https://raw.githubusercontent.com/Dileepadari/PlantIQ/main/docs/screenshots/light/statistics.png',
    'https://raw.githubusercontent.com/Dileepadari/PlantIQ/main/docs/screenshots/light/analysis.png',
    'https://raw.githubusercontent.com/Dileepadari/PlantIQ/main/docs/screenshots/light/alerts.png'
  ],
  '[
    {"title": "Per-species thresholds", "description": "Six safe ranges per plant. 30C is a comfortable afternoon for a Mango and a slow death for a Fern."},
    {"title": "Device-pushed alerts", "description": "The firmware compares thresholds itself and POSTs the moment one is crossed."},
    {"title": "Offline honesty", "description": "A silent device is reported as silent. A monitoring page that quietly shows stale numbers is worse than one showing none."}
  ]'::jsonb,
  '[
    {"name": "Flask", "role": "Web application"},
    {"name": "SQLite", "role": "Storage"},
    {"name": "ESP32", "role": "Firmware"},
    {"name": "ThingSpeak MQTT", "role": "Telemetry transport"}
  ]'::jsonb,
  'Python', '#3572A5',
  array['iot', 'esp32', 'flask', 'sensors'],
  'iot',
  true, 2, 4, 1, 'Shipped'
) on conflict do nothing;

-- ---------------------------------------------------------------------------
-- The minimum a project can be: a title and a description. The detail page
-- should render a header and stop, with no developer half at all.
-- ---------------------------------------------------------------------------
insert into public.projects (
  title, slug, description, github_url, language, language_color,
  tags, category, featured, order_index
) values (
  'MiniShell',
  'minishell',
  'A POSIX-ish shell in C: pipelines, redirection, job control, and a few builtins that had no business being as hard as they were.',
  'https://github.com/Dileepadari/MiniShell',
  'C', '#555555',
  array['c', 'shell', 'systems'],
  'distributed systems',
  false, 3
) on conflict do nothing;
