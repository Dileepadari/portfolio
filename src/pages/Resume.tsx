import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  Upload, 
  Eye, 
  Edit,
  Phone,
  Mail,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Calendar,
  Award,
  BookOpen,
  Code,
  Users,
  Star,
  ExternalLink
} from "lucide-react";

interface Education {
  id: string;
  degree: string;
  institution: string;
  duration: string;
  gpa?: string;
  location: string;
  coursework?: string[];
}

interface Experience {
  id: string;
  title: string;
  company: string;
  duration: string;
  location: string;
  description: string[];
  technologies?: string[];
}

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  github?: string;
}

interface Skill {
  category: string;
  skills: string[];
}

const personalInfo = {
  name: "Your Name",
  title: "Computer Science Student & Full-Stack Developer",
  email: "your.email@example.com",
  phone: "+1 (555) 123-4567",
  location: "City, State, Country",
  website: "yourwebsite.com",
  linkedin: "linkedin.com/in/yourprofile",
  github: "github.com/yourusername",
  summary: "Passionate Computer Science student with strong foundation in full-stack development, data structures, and algorithms. Experienced in building scalable web applications using modern technologies. Seeking opportunities to contribute to innovative projects and grow as a software engineer."
};

const education: Education[] = [
  {
    id: "1",
    degree: "Bachelor of Technology in Computer Science",
    institution: "Your University",
    duration: "2021 - 2025",
    gpa: "3.8/4.0",
    location: "City, State",
    coursework: [
      "Data Structures & Algorithms",
      "Database Management Systems",
      "Operating Systems",
      "Computer Networks",
      "Software Engineering",
      "Machine Learning",
      "Web Development",
      "Mobile App Development"
    ]
  }
];

const experience: Experience[] = [
  {
    id: "1",
    title: "Software Development Intern",
    company: "TechCorp Solutions",
    duration: "Jun 2024 - Aug 2024",
    location: "Remote",
    description: [
      "Developed and maintained React-based dashboard applications serving 10,000+ users",
      "Implemented RESTful APIs using Node.js and Express, improving response times by 30%",
      "Collaborated with cross-functional teams using Agile methodologies",
      "Contributed to code reviews and followed best practices for clean, maintainable code",
      "Built automated testing suites increasing code coverage to 85%"
    ],
    technologies: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS", "Docker"]
  },
  {
    id: "2",
    title: "Frontend Developer",
    company: "Freelance",
    duration: "Jan 2024 - Present",
    location: "Remote",
    description: [
      "Built responsive web applications for 5+ clients using React and Next.js",
      "Designed and implemented user interfaces with modern CSS frameworks",
      "Integrated third-party APIs and payment systems",
      "Delivered projects on time with 100% client satisfaction rate"
    ],
    technologies: ["React", "Next.js", "Tailwind CSS", "JavaScript", "Stripe API"]
  }
];

const projects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with user authentication, payment integration, and admin dashboard. Features shopping cart, order management, and real-time inventory tracking.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "JWT", "Express"],
    github: "https://github.com/username/ecommerce",
    link: "https://myecommerce.com"
  },
  {
    id: "2",
    title: "Machine Learning Classifier",
    description: "Image classification model using TensorFlow and Python. Achieved 94% accuracy on CIFAR-10 dataset with data augmentation and transfer learning techniques.",
    technologies: ["Python", "TensorFlow", "OpenCV", "NumPy", "Jupyter", "Scikit-learn"],
    github: "https://github.com/username/ml-classifier"
  },
  {
    id: "3",
    title: "Real-time Chat Application",
    description: "WebSocket-based chat application with rooms, direct messaging, file sharing, and user presence indicators. Supports real-time communication for 100+ concurrent users.",
    technologies: ["React", "Socket.io", "Node.js", "MongoDB", "Redis"],
    github: "https://github.com/username/chat-app",
    link: "https://mychatapp.com"
  }
];

const skills: Skill[] = [
  {
    category: "Programming Languages",
    skills: ["JavaScript", "TypeScript", "Python", "Java", "C++", "SQL", "HTML", "CSS"]
  },
  {
    category: "Frontend Development",
    skills: ["React", "Next.js", "Vue.js", "Angular", "Tailwind CSS", "Bootstrap", "SASS", "Redux"]
  },
  {
    category: "Backend Development",
    skills: ["Node.js", "Express", "FastAPI", "Spring Boot", "REST APIs", "GraphQL", "Microservices"]
  },
  {
    category: "Databases",
    skills: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "SQLite", "Firebase"]
  },
  {
    category: "Tools & Technologies",
    skills: ["Git", "Docker", "AWS", "Kubernetes", "Linux", "CI/CD", "Jest", "Webpack"]
  },
  {
    category: "Machine Learning",
    skills: ["TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "Matplotlib", "Jupyter"]
  }
];

const achievements = [
  "Winner - University Hackathon 2024 (AI-powered Learning Assistant)",
  "Dean's List Recognition - Fall 2023, Spring 2024",
  "Open Source Contributor - 5+ repositories with 200+ stars combined",
  "Google Code-in Finalist 2023",
  "Published research paper on Machine Learning optimization techniques"
];

export function Resume() {
  const [activeSection, setActiveSection] = useState("preview");

  return (
    <div className="min-h-screen" style={{backgroundColor: '#0d1117', color: '#e6edf3'}}>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[#e6edf3]">Resume</h1>
          <p className="text-[#8b949e] text-lg">Professional experience and qualifications</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Button className="bg-[#238636] hover:bg-[#2ea043] text-white">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
          <Button variant="secondary" className="bg-[#21262d] border-[#30363d] text-[#e6edf3] hover:bg-[#30363d]">
            <Upload className="w-4 h-4 mr-2" />
            Upload Resume
          </Button>
          <Button variant="ghost" className="text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#30363d]">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="ghost" className="text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#30363d]">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>

        {/* Resume Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card className="bg-[#21262d] border-[#30363d]">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h1 className="text-3xl font-bold text-[#e6edf3] mb-2">{personalInfo.name}</h1>
                  <p className="text-lg text-[#58a6ff] mb-4">{personalInfo.title}</p>
                  
                  <div className="flex flex-wrap justify-center gap-4 text-sm text-[#8b949e]">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      <span>{personalInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      <span>{personalInfo.phone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{personalInfo.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      <span>{personalInfo.website}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-center gap-4 mt-4">
                    <a href={`https://${personalInfo.linkedin}`} className="text-[#58a6ff] hover:underline">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href={`https://${personalInfo.github}`} className="text-[#58a6ff] hover:underline">
                      <Github className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                
                <Separator className="bg-[#30363d] my-4" />
                
                <div>
                  <h3 className="text-lg font-semibold text-[#e6edf3] mb-3">Professional Summary</h3>
                  <p className="text-[#8b949e] leading-relaxed">{personalInfo.summary}</p>
                </div>
              </CardContent>
            </Card>

            {/* Experience */}
            <Card className="bg-[#21262d] border-[#30363d]">
              <CardHeader>
                <h2 className="text-xl font-bold text-[#e6edf3] flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Professional Experience
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={exp.id} className={index > 0 ? "border-t border-[#30363d] pt-6" : ""}>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <h3 className="text-lg font-semibold text-[#e6edf3]">{exp.title}</h3>
                        <span className="text-sm text-[#8b949e]">{exp.duration}</span>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                        <p className="text-[#58a6ff] font-medium">{exp.company}</p>
                        <span className="text-sm text-[#8b949e]">{exp.location}</span>
                      </div>
                      <ul className="space-y-1 mb-3">
                        {exp.description.map((item, i) => (
                          <li key={i} className="text-[#8b949e] text-sm">• {item}</li>
                        ))}
                      </ul>
                      {exp.technologies && (
                        <div className="flex flex-wrap gap-1">
                          {exp.technologies.map((tech) => (
                            <Badge 
                              key={tech} 
                              variant="outline" 
                              className="bg-[#388bfd]/10 text-[#58a6ff] border-[#388bfd]/20 text-xs"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Projects */}
            <Card className="bg-[#21262d] border-[#30363d]">
              <CardHeader>
                <h2 className="text-xl font-bold text-[#e6edf3] flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  Key Projects
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {projects.map((project, index) => (
                    <div key={project.id} className={index > 0 ? "border-t border-[#30363d] pt-6" : ""}>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-[#e6edf3]">{project.title}</h3>
                        <div className="flex gap-2">
                          {project.github && (
                            <a href={project.github} target="_blank" rel="noopener noreferrer">
                              <Github className="w-4 h-4 text-[#8b949e] hover:text-[#e6edf3]" />
                            </a>
                          )}
                          {project.link && (
                            <a href={project.link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 text-[#8b949e] hover:text-[#e6edf3]" />
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-[#8b949e] text-sm leading-relaxed mb-3">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech) => (
                          <Badge 
                            key={tech} 
                            variant="outline" 
                            className="bg-[#388bfd]/10 text-[#58a6ff] border-[#388bfd]/20 text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Education */}
            <Card className="bg-[#21262d] border-[#30363d]">
              <CardHeader>
                <h2 className="text-xl font-bold text-[#e6edf3] flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Education
                </h2>
              </CardHeader>
              <CardContent>
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-semibold text-[#e6edf3] text-sm">{edu.degree}</h3>
                    <p className="text-[#58a6ff] text-sm">{edu.institution}</p>
                    <p className="text-[#8b949e] text-xs">{edu.duration}</p>
                    <p className="text-[#8b949e] text-xs">{edu.location}</p>
                    {edu.gpa && (
                      <p className="text-[#8b949e] text-xs">GPA: {edu.gpa}</p>
                    )}
                    {edu.coursework && (
                      <div className="mt-2">
                        <p className="text-[#e6edf3] text-xs font-medium mb-1">Relevant Coursework:</p>
                        <div className="flex flex-wrap gap-1">
                          {edu.coursework.slice(0, 6).map((course) => (
                            <Badge 
                              key={course} 
                              variant="outline" 
                              className="bg-transparent text-[#8b949e] border-[#30363d] text-xs"
                            >
                              {course}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="bg-[#21262d] border-[#30363d]">
              <CardHeader>
                <h2 className="text-xl font-bold text-[#e6edf3] flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Technical Skills
                </h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {skills.map((skillGroup) => (
                    <div key={skillGroup.category}>
                      <h4 className="text-sm font-medium text-[#e6edf3] mb-2">{skillGroup.category}</h4>
                      <div className="flex flex-wrap gap-1">
                        {skillGroup.skills.map((skill) => (
                          <Badge 
                            key={skill} 
                            variant="outline" 
                            className="bg-[#388bfd]/10 text-[#58a6ff] border-[#388bfd]/20 text-xs"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-[#21262d] border-[#30363d]">
              <CardHeader>
                <h2 className="text-xl font-bold text-[#e6edf3] flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Achievements
                </h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {achievements.map((achievement, index) => (
                    <li key={index} className="text-[#8b949e] text-sm flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}