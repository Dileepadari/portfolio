-- Create profiles table for user authentication
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create portfolio data tables
CREATE TABLE public.personal_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL DEFAULT 'Dileep Adari',
  title TEXT NOT NULL DEFAULT 'Computer Science Student & Full-Stack Developer',
  bio TEXT NOT NULL DEFAULT 'A passionate web developer and programmer. My journey revolves around the enchanting world of software engineering, where I thrive on turning ideas into reality through the art of coding.',
  location TEXT DEFAULT 'Visakhapatnam, Andhra Pradesh',
  email TEXT DEFAULT 'rs200302@rguktsklm.ac.in',
  phone TEXT DEFAULT '+91 7330701217',
  website TEXT DEFAULT 'dileepadari.dev',
  linkedin TEXT DEFAULT 'https://www.linkedin.com/in/dileep-kumar-adari-298169252',
  github TEXT DEFAULT 'https://github.com/dileepadari',
  instagram TEXT DEFAULT 'https://www.instagram.com/dileepadari',
  youtube TEXT DEFAULT 'https://www.youtube.com/@dileepadari5182/featured',
  twitter TEXT DEFAULT 'https://twitter.com/Dileepadari1',
  medium TEXT,
  codeforces TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.education (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  duration TEXT NOT NULL,
  gpa TEXT,
  location TEXT,
  description TEXT,
  coursework TEXT[],
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.experience (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  duration TEXT NOT NULL,
  location TEXT,
  description TEXT[],
  technologies TEXT[],
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT[],
  github_url TEXT,
  live_url TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.skills (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  proficiency INTEGER DEFAULT 80,
  icon_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date_achieved DATE,
  certificate_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  image_url TEXT,
  published BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = $1 AND is_admin = true
  );
$$;

-- RLS policies for portfolio data - viewable by everyone, editable by admin
CREATE POLICY "Personal info viewable by everyone" ON public.personal_info FOR SELECT USING (true);
CREATE POLICY "Personal info editable by admin" ON public.personal_info FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Education viewable by everyone" ON public.education FOR SELECT USING (true);
CREATE POLICY "Education editable by admin" ON public.education FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Experience viewable by everyone" ON public.experience FOR SELECT USING (true);
CREATE POLICY "Experience editable by admin" ON public.experience FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Projects viewable by everyone" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Projects editable by admin" ON public.projects FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Skills viewable by everyone" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Skills editable by admin" ON public.skills FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Achievements viewable by everyone" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Achievements editable by admin" ON public.achievements FOR ALL USING (public.is_admin(auth.uid()));

CREATE POLICY "Blog posts viewable by everyone" ON public.blog_posts FOR SELECT USING (published = true OR public.is_admin(auth.uid()));
CREATE POLICY "Blog posts editable by admin" ON public.blog_posts FOR ALL USING (public.is_admin(auth.uid()));

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_personal_info_updated_at BEFORE UPDATE ON public.personal_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON public.education FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON public.experience FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON public.skills FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON public.achievements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, is_admin)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.email),
    NEW.email = 'rs200302@rguktsklm.ac.in' -- Make Dileep admin
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert initial portfolio data
INSERT INTO public.personal_info (name, title, bio, location, email, phone, website, linkedin, github, instagram, youtube, twitter, medium, codeforces) VALUES (
  'Dileep Adari',
  'Computer Science Student & Full-Stack Developer | GSoC''25 Joomla! CMS',
  'A passionate web developer and programmer. My journey revolves around the enchanting world of software engineering, where I thrive on turning ideas into reality through the art of coding. With a keen interest in crafting digital solutions, my focus is on creating seamless and innovative experiences.',
  'Visakhapatnam, Andhra Pradesh',
  'rs200302@rguktsklm.ac.in',
  '+91 7330701217',
  'dileepadari.dev',
  'https://www.linkedin.com/in/dileep-kumar-adari-298169252',
  'https://github.com/dileepadari',
  'https://www.instagram.com/dileepadari',
  'https://www.youtube.com/@dileepadari5182/featured',
  'https://twitter.com/Dileepadari1',
  'https://medium.com/@dileepadari',
  'https://codeforces.com/profile/dileepadari'
);

-- Insert education data
INSERT INTO public.education (degree, institution, duration, gpa, location, description, coursework, order_index) VALUES 
(
  'B.Tech in Computer Science & Engineering',
  'International Institute of Information Technology, Hyderabad',
  '2022 - Present',
  '7.08 CGPA (current)',
  'Hyderabad, Telangana',
  '7th Semester student pursuing Bachelor of Technology in Computer Science',
  ARRAY['Data Structures and Algorithms', 'Operating Systems and Networks', 'Introduction to Software Systems', 'Design and Analysis Software Systems', 'Algorithm Analysis and Design', 'Computer Organization and Architecture', 'Database Management System', 'Internet of Things', 'Intro to Information Security', 'Machine and Data Learning', 'Computer Graphics', 'Embeded Systems workshop'],
  1
),
(
  'Pre University Course',
  'Rajiv Gandhi University of Knowledge Technology, Srikakulam',
  '2020 - 2022',
  '9.35 CGPA',
  'Srikakulam, Andhra Pradesh',
  'Completed Pre University Course with excellent academic performance',
  ARRAY[],
  2
),
(
  'SSC - Secondary School Certificate',
  'Prasanthi Nikethan M.V.V.S Murthy ENG MED High School, Anakapalli',
  '2008 - 2020',
  '10 CGPA',
  'Anakapalli, Andhra Pradesh',
  'Completed secondary education with perfect grade',
  ARRAY[],
  3
);

-- Insert experience data
INSERT INTO public.experience (title, company, duration, location, description, technologies, order_index) VALUES 
(
  'Undergraduate Researcher',
  'SERC lab, IIITH',
  'April 2024 - Present',
  'Hyderabad, Telangana',
  ARRAY[
    'Conducting research under Dr. Raman Saxena focusing on human-centered design and design thinking methodologies',
    'Completed a summer project that provided valuable insights into gathering user opinions/problems on present existing Institute Management system',
    'Applied design thinking to create effective, user-friendly solutions for complex problems',
    'Engaged in continuous research and development of innovative design methodologies'
  ],
  ARRAY['Design Thinking', 'User Research', 'Human-Computer Interaction', 'UX Research'],
  1
),
(
  'Software Intern (Virtual Labs)',
  'Virtual Labs Project',
  'January 2024 - April 2024',
  'Remote',
  ARRAY[
    'Collaborated on the development of a VS Code Web Extension for a Virtual Labs Authoring Environment',
    'Used a tech stack that included TypeScript, Webpack, and various APIs',
    'Engaged in continuous meetings with clients, honing ability to interact effectively',
    'Gathered valuable feedback and understood the project process flow comprehensively',
    'Contributed to improving the overall user experience of the Virtual Labs platform'
  ],
  ARRAY['TypeScript', 'Webpack', 'VS Code Extensions', 'JavaScript', 'APIs'],
  2
),
(
  'Web Admin',
  'IT Office IIITH',
  'August 2023 – Present',
  'Hyderabad, Telangana',
  ARRAY[
    'Maintaining and updating university websites under the supervision of the IT Office',
    'Creating & designing new web pages for events and announcements',
    'Ensuring website functionality and user experience optimization',
    'Managing content updates and technical maintenance'
  ],
  ARRAY['HTML', 'CSS', 'JavaScript', 'Web Development', 'Content Management'],
  3
),
(
  'Tech Team Member',
  'Club Council & Student Life Committee (IIIT Hyderabad)',
  'August 2023 – Present',
  'Hyderabad, Telangana',
  ARRAY[
    'Maintaining clubs websites and servers for various student organizations',
    'Adding new features to improve user engagement and experience',
    'Providing technical support for club activities and events',
    'Collaborating with different clubs to meet their technical requirements'
  ],
  ARRAY['Web Development', 'Server Management', 'Full-Stack Development', 'Technical Support'],
  4
);

-- Insert skills data
INSERT INTO public.skills (category, skill_name, proficiency, order_index) VALUES 
('Programming Languages', 'Python', 90, 1),
('Programming Languages', 'JavaScript', 85, 2),
('Programming Languages', 'C', 80, 3),
('Programming Languages', 'HTML5', 95, 4),
('Programming Languages', 'CSS3', 90, 5),
('Programming Languages', 'PHP', 75, 6),
('Frontend Development', 'React', 85, 7),
('Frontend Development', 'Bootstrap', 80, 8),
('Frontend Development', 'Responsive Design', 90, 9),
('Backend Development', 'Flask', 75, 10),
('Backend Development', 'APIs', 80, 11),
('Database', 'MySQL', 80, 12),
('Database', 'MongoDB', 75, 13),
('Database', 'SQLite', 85, 14),
('Tools & Technologies', 'Git', 85, 15),
('Tools & Technologies', 'Linux', 80, 16),
('Tools & Technologies', 'Arduino', 70, 17),
('Tools & Technologies', 'LaTeX', 75, 18),
('Design', 'Photoshop', 70, 19),
('Design', 'Design Thinking', 85, 20),
('Other', 'Vim', 75, 21),
('Other', 'Moodle', 70, 22);

-- Insert achievements data
INSERT INTO public.achievements (title, description, date_achieved, order_index) VALUES 
(
  'Bharat Intern Certification',
  'Received a certificate from Bharat Intern for a virtual Internship program in which I built two websites based on FullStack Development.',
  '2024-01-01',
  1
),
(
  'Study with US Certification',
  'Study With Us is an initiative from RGUKT students in AP where they offer different programming courses where I completed the C Programming Course.',
  '2022-05-01',
  2
),
(
  'DevTown Certification in Web Development Bootcamp',
  'In the bootcamp, I completed the given tasks of building a facebook clone and a netflix clone which gave me great experience of learning web dev.',
  '2022-05-01',
  3
),
(
  'Shape AI Certification for Python and Cyber Security',
  'In the workshop, started with python and the flow of teaching ended with cyber security basics, I learnt very good basics from it and they provided me with a certificate after an exam.',
  '2021-06-01',
  4
),
(
  'District Level Silver Medal in International Mathematics Olympiad',
  'Secured a silver medal in the International Mathematics Olympiad conducted at the district level after School level.',
  '2016-08-01',
  5
);