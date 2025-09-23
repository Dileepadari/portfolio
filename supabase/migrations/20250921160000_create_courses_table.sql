-- Create courses table
CREATE TABLE IF NOT EXISTS public.courses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    institution TEXT,
    completion_date DATE,
    certificate_url TEXT,
    is_favorite BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS (Row Level Security)
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access on courses" ON public.courses
    FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert, update, delete
CREATE POLICY "Allow authenticated users to modify courses" ON public.courses
    FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER handle_courses_updated_at BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Insert sample data
INSERT INTO public.courses (name, description, institution, completion_date, is_favorite, order_index) VALUES
('Data Structures & Algorithms', 'Comprehensive course covering fundamental data structures and algorithms', 'Online Course', '2023-12-15', true, 1),
('Web Development', 'Full-stack web development using modern technologies', 'Bootcamp', '2023-11-20', true, 2),
('Machine Learning', 'Introduction to machine learning concepts and practical applications', 'University', '2024-01-10', true, 3),
('Database Management Systems', 'Relational database design and SQL optimization', 'University', '2023-05-15', false, 4),
('Software Engineering', 'Software development lifecycle and best practices', 'University', '2023-12-01', false, 5),
('Computer Networks', 'Network protocols and distributed systems', 'University', '2023-04-20', false, 6),
('Operating Systems', 'System programming and OS internals', 'University', '2023-03-25', false, 7),
('Object-Oriented Programming', 'OOP principles and design patterns', 'University', '2022-12-10', false, 8),
('Computer Architecture', 'Hardware-software interface and system design', 'University', '2022-11-15', false, 9),
('Discrete Mathematics', 'Mathematical foundations for computer science', 'University', '2022-09-30', false, 10),
('Statistics & Probability', 'Statistical analysis and probability theory', 'University', '2022-08-20', false, 11);