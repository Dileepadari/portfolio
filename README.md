# Git-Folio Showcase - Portfolio Website

A modern, dynamic portfolio website built with React, TypeScript, and Supabase. Features a complete content management system with admin controls for projects, blog posts, timeline events, and more.

## 🚀 Features

- **Dynamic Timeline** - Interactive timeline with admin CRUD operations
- **Blog System** - Full blog with engagement features (likes, comments)
- **Project Showcase** - GitHub-style project cards with stats
- **Admin Dashboard** - Complete content management system
- **Authentication** - Secure user authentication with role-based access
- **Responsive Design** - Beautiful UI with dark/light theme support

## 🛠️ Technologies

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Deployment**: Vercel/Netlify ready

## 📦 Setup Instructions

### 1. Clone Repository
```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
```

### 2. Supabase Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the migrations in order:
   ```sql
   -- Run these in your Supabase SQL Editor in chronological order:
   -- 1. Base schema (profiles, projects, blog, etc.)
   supabase/migrations/20250919195538_22934239-ca60-47d5-ab50-5c4c0ed82ca2.sql
   
   -- 2. Add image support
   supabase/migrations/20250920101121_34013fc8-96aa-4626-8029-2f92150e043d.sql
   
   -- 3. Enhanced projects with GitHub-style features
   supabase/migrations/20250920120000_enhance_projects_table.sql
   
   -- 4. Task management system
   supabase/migrations/20250921154816_955af339-d139-4a6a-9118-e2a83b82a04c.sql
   
   -- 5. Courses table
   supabase/migrations/20250921160000_create_courses_table.sql
   
   -- 6. Blog external links
   supabase/migrations/20250921200000_add_external_link_to_blog_posts.sql
   
   -- 7. Blog engagement features
   supabase/migrations/20250921220000_create_blog_engagement_tables.sql
   
   -- 8. Cleanup unused features
   supabase/migrations/20250922000000_cleanup_blog_shares.sql
   
   -- 9. Timeline functionality (all-in-one setup)
   complete_timeline_setup.sql
   ```

### 3. Environment Setup
Create `.env.local`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Optional Sample Data
```sql
-- Run this for sample blog content:
sample_blog_data.sql
```

### 5. Admin Setup
1. Sign up through your app
2. In Supabase SQL Editor, set yourself as admin:
   ```sql
   UPDATE profiles SET is_admin = true WHERE email = 'your-email@example.com';
   ```

## 🗂️ Project Structure

```
src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── integrations/       # Supabase client and types
├── layouts/            # Layout components
├── pages/              # Main page components
├── providers/          # Context providers
└── lib/                # Utilities

supabase/
└── migrations/         # Database migrations (chronological order)

SQL Files:
├── complete_timeline_setup.sql    # Timeline feature setup
└── sample_blog_data.sql          # Optional blog content
```

## 🎯 Development

```sh
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
```

## 📝 License

MIT License - feel free to use this project as a template for your own portfolio!

---

## Project Info

**URL**: https://lovable.dev/projects/28db4d20-0212-4f36-b0f6-a6cfac011cc7

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/28db4d20-0212-4f36-b0f6-a6cfac011cc7) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase (Database & Authentication)

## Timeline Feature Setup

This portfolio includes a dynamic Timeline feature with full CRUD functionality. To set it up:

1. **Database Setup**: Run the `complete_timeline_setup.sql` file in your Supabase SQL Editor
2. **Admin Access**: Uncomment and run the admin setup section in the SQL file to grant yourself admin permissions
3. **Timeline Management**: Once set up, admins can add, edit, and delete timeline events through the web interface

The Timeline feature includes:
- ✅ Dynamic timeline events (projects, achievements, education, work, etc.)
- ✅ Admin-only CRUD operations with proper authentication
- ✅ Row Level Security (RLS) policies
- ✅ Sample data for testing
- ✅ Activity statistics integration

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/28db4d20-0212-4f36-b0f6-a6cfac011cc7) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
