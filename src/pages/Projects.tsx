import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  ExternalLink, 
  Github, 
  Star, 
  GitFork, 
  Eye,
  Calendar,
  Users,
  Code,
  Zap
} from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  githubUrl?: string;
  liveUrl?: string;
  tags: string[];
  stars: number;
  forks: number;
  language: string;
  languageColor: string;
  lastUpdated: string;
  status: 'completed' | 'in-progress' | 'planned';
  type: 'personal' | 'academic' | 'freelance' | 'open-source';
  featured: boolean;
}

const projects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with React, Node.js, and MongoDB. Features include user authentication, payment integration, and admin dashboard.",
    githubUrl: "https://github.com/username/ecommerce",
    liveUrl: "https://myecommerce.com",
    tags: ["React", "Node.js", "MongoDB", "Stripe", "JWT"],
    stars: 127,
    forks: 23,
    language: "JavaScript",
    languageColor: "#f1e05a",
    lastUpdated: "2 days ago",
    status: "completed",
    type: "personal",
    featured: true
  },
  {
    id: "2",
    title: "Machine Learning Classifier",
    description: "Image classification model using TensorFlow and Python. Achieved 94% accuracy on CIFAR-10 dataset.",
    githubUrl: "https://github.com/username/ml-classifier",
    tags: ["Python", "TensorFlow", "OpenCV", "NumPy", "Jupyter"],
    stars: 89,
    forks: 15,
    language: "Python",
    languageColor: "#3572A5",
    lastUpdated: "1 week ago",
    status: "completed",
    type: "academic",
    featured: true
  },
  {
    id: "3",
    title: "Real-time Chat Application",
    description: "WebSocket-based chat app with rooms, direct messaging, and file sharing capabilities.",
    githubUrl: "https://github.com/username/chat-app",
    liveUrl: "https://mychatapp.com",
    tags: ["React", "Socket.io", "Node.js", "Express", "MongoDB"],
    stars: 45,
    forks: 8,
    language: "TypeScript",
    languageColor: "#2b7489",
    lastUpdated: "3 days ago",
    status: "in-progress",
    type: "personal",
    featured: false
  },
  {
    id: "4",
    title: "Student Management System",
    description: "Academic project for managing student records, grades, and attendance with role-based access control.",
    githubUrl: "https://github.com/username/student-mgmt",
    tags: ["Java", "Spring Boot", "MySQL", "Thymeleaf", "Bootstrap"],
    stars: 32,
    forks: 12,
    language: "Java",
    languageColor: "#b07219",
    lastUpdated: "2 weeks ago",
    status: "completed",
    type: "academic",
    featured: false
  }
];

export function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = selectedType === "all" || project.type === selectedType;
    const matchesStatus = selectedStatus === "all" || project.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const featuredProjects = projects.filter(p => p.featured);

  return (
    <div className="min-h-screen" style={{backgroundColor: '#0d1117', color: '#e6edf3'}}>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[#e6edf3]">Projects</h1>
          <p className="text-[#8b949e] text-lg">Building the future, one commit at a time</p>
        </div>

        {/* Featured Projects */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center text-[#e6edf3]">
            <Star className="w-5 h-5 mr-2 text-yellow-400" />
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} featured />
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b949e]" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#21262d] border-[#30363d] text-[#e6edf3] placeholder-[#8b949e]"
                />
              </div>
            </div>
            
            <Tabs value={selectedType} onValueChange={setSelectedType} className="w-auto">
              <TabsList className="bg-[#21262d] border-[#30363d]">
                <TabsTrigger value="all" className="text-[#8b949e] data-[state=active]:text-[#e6edf3]">All</TabsTrigger>
                <TabsTrigger value="personal" className="text-[#8b949e] data-[state=active]:text-[#e6edf3]">Personal</TabsTrigger>
                <TabsTrigger value="academic" className="text-[#8b949e] data-[state=active]:text-[#e6edf3]">Academic</TabsTrigger>
                <TabsTrigger value="open-source" className="text-[#8b949e] data-[state=active]:text-[#e6edf3]">Open Source</TabsTrigger>
              </TabsList>
            </Tabs>

            <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="w-auto">
              <TabsList className="bg-[#21262d] border-[#30363d]">
                <TabsTrigger value="all" className="text-[#8b949e] data-[state=active]:text-[#e6edf3]">All Status</TabsTrigger>
                <TabsTrigger value="completed" className="text-[#8b949e] data-[state=active]:text-[#e6edf3]">Completed</TabsTrigger>
                <TabsTrigger value="in-progress" className="text-[#8b949e] data-[state=active]:text-[#e6edf3]">In Progress</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-[#8b949e] text-lg">No projects found matching your criteria</div>
          </div>
        )}
      </div>
    </div>
  );
}

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

function ProjectCard({ project, featured = false }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in-progress': return 'text-yellow-400';
      case 'planned': return 'text-blue-400';
      default: return 'text-[#8b949e]';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Zap className="w-3 h-3" />;
      case 'in-progress': return <Code className="w-3 h-3" />;
      case 'planned': return <Calendar className="w-3 h-3" />;
      default: return null;
    }
  };

  return (
    <Card className={`bg-[#21262d] border-[#30363d] hover:border-[#58a6ff] transition-all duration-200 ${featured ? 'ring-1 ring-yellow-400/20' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-[#58a6ff] hover:underline cursor-pointer">
                {project.title}
              </h3>
              {featured && <Star className="w-4 h-4 text-yellow-400 fill-current" />}
            </div>
            <p className="text-[#8b949e] text-sm leading-relaxed mb-3">
              {project.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="secondary" 
              className="bg-[#388bfd]/10 text-[#58a6ff] border-[#388bfd]/20 text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-[#8b949e]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: project.languageColor }}
              />
              <span>{project.language}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3" />
              <span>{project.stars}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <GitFork className="w-3 h-3" />
              <span>{project.forks}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 ${getStatusColor(project.status)}`}>
              {getStatusIcon(project.status)}
              <span className="capitalize">{project.status.replace('-', ' ')}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="text-xs text-[#8b949e]">
            Updated {project.lastUpdated}
          </div>
          
          <div className="flex gap-2">
            {project.githubUrl && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#30363d]"
                asChild
              >
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                  <Github className="w-3 h-3" />
                </a>
              </Button>
            )}
            
            {project.liveUrl && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#30363d]"
                asChild
              >
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}