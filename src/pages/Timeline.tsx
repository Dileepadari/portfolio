import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GitCommit, 
  GitPullRequest, 
  Star, 
  GitFork, 
  Calendar,
  Clock,
  Zap,
  Code,
  Users,
  Award,
  BookOpen,
  Briefcase
} from "lucide-react";

interface TimelineEvent {
  id: string;
  type: 'commit' | 'project' | 'achievement' | 'education' | 'work' | 'contribution';
  title: string;
  description: string;
  date: string;
  repository?: string;
  language?: string;
  languageColor?: string;
  tags?: string[];
  link?: string;
  impact?: string;
}

const timelineEvents: TimelineEvent[] = [
  {
    id: "1",
    type: "achievement",
    title: "Won University Hackathon",
    description: "First place in the annual university hackathon with an AI-powered student learning assistant",
    date: "2024-01-20",
    tags: ["AI", "React", "Python", "OpenAI"],
    impact: "500+ participants"
  },
  {
    id: "2", 
    type: "project",
    title: "Launched E-Commerce Platform",
    description: "Built and deployed a full-stack e-commerce solution with payment integration and admin dashboard",
    date: "2024-01-15",
    repository: "ecommerce-platform",
    language: "JavaScript",
    languageColor: "#f1e05a",
    tags: ["React", "Node.js", "MongoDB", "Stripe"],
    link: "https://github.com/username/ecommerce"
  },
  {
    id: "3",
    type: "contribution",
    title: "Open Source Contribution to React Router",
    description: "Fixed critical bug in route matching algorithm, merged PR with 2.5K+ stars",
    date: "2024-01-10",
    repository: "react-router",
    language: "TypeScript",
    languageColor: "#2b7489",
    tags: ["TypeScript", "React", "Open Source"],
    link: "https://github.com/remix-run/react-router"
  },
  {
    id: "4",
    type: "education",
    title: "Started Data Structures & Algorithms Course",
    description: "Began advanced DSA course focusing on competitive programming and interview preparation",
    date: "2024-01-05",
    tags: ["Algorithms", "Computer Science", "Problem Solving"]
  },
  {
    id: "5",
    type: "work",
    title: "Frontend Developer Internship",
    description: "Started internship at TechCorp, working on React-based dashboard applications",
    date: "2023-12-01",
    tags: ["React", "TypeScript", "Professional Experience"],
    impact: "3 month internship"
  },
  {
    id: "6",
    type: "commit",
    title: "Major refactor of ML classifier project",
    description: "Improved model accuracy from 87% to 94% through feature engineering and hyperparameter tuning",
    date: "2023-11-28",
    repository: "ml-classifier",
    language: "Python",
    languageColor: "#3572A5",
    tags: ["Machine Learning", "Python", "TensorFlow"]
  },
  {
    id: "7",
    type: "achievement",
    title: "Dean's List Recognition",
    description: "Achieved Dean's List for academic excellence in Computer Science program",
    date: "2023-11-15",
    tags: ["Academic Achievement", "Computer Science"],
    impact: "Top 5% of class"
  },
  {
    id: "8",
    type: "project",
    title: "Real-time Chat Application",
    description: "Built WebSocket-based chat app with rooms, direct messaging, and file sharing",
    date: "2023-11-01",
    repository: "chat-application",
    language: "TypeScript",
    languageColor: "#2b7489",
    tags: ["Socket.io", "React", "Node.js", "Real-time"],
    link: "https://github.com/username/chat-app"
  },
  {
    id: "9",
    type: "education",
    title: "Completed Web Development Bootcamp",
    description: "Intensive 12-week bootcamp covering full-stack development with modern technologies",
    date: "2023-10-15",
    tags: ["Full-Stack", "Web Development", "Bootcamp"],
    impact: "300+ hours"
  },
  {
    id: "10",
    type: "contribution",
    title: "Documentation improvements for Vue.js",
    description: "Contributed to Vue.js documentation with code examples and tutorials",
    date: "2023-09-20",
    repository: "vuejs/docs",
    language: "Vue",
    languageColor: "#4FC08D",
    tags: ["Vue.js", "Documentation", "Open Source"]
  }
];

export function Timeline() {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'commit': return <GitCommit className="w-4 h-4" />;
      case 'project': return <Code className="w-4 h-4" />;
      case 'achievement': return <Award className="w-4 h-4" />;
      case 'education': return <BookOpen className="w-4 h-4" />;
      case 'work': return <Briefcase className="w-4 h-4" />;
      case 'contribution': return <GitPullRequest className="w-4 h-4" />;
      default: return <Zap className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'commit': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      case 'project': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'achievement': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'education': return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
      case 'work': return 'text-pink-400 bg-pink-400/10 border-pink-400/20';
      case 'contribution': return 'text-orange-400 bg-orange-400/10 border-orange-400/20';
      default: return 'text-[#8b949e] bg-[#8b949e]/10 border-[#8b949e]/20';
    }
  };

  const stats = {
    totalEvents: timelineEvents.length,
    projects: timelineEvents.filter(e => e.type === 'project').length,
    achievements: timelineEvents.filter(e => e.type === 'achievement').length,
    contributions: timelineEvents.filter(e => e.type === 'contribution').length,
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: '#0d1117', color: '#e6edf3'}}>
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-[#e6edf3]">Timeline</h1>
          <p className="text-[#8b949e] text-lg">My journey in tech, one milestone at a time</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-[#21262d] border-[#30363d]">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-[#e6edf3]">{stats.totalEvents}</div>
              <div className="text-sm text-[#8b949e]">Total Events</div>
            </CardContent>
          </Card>
          <Card className="bg-[#21262d] border-[#30363d]">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{stats.projects}</div>
              <div className="text-sm text-[#8b949e]">Projects</div>
            </CardContent>
          </Card>
          <Card className="bg-[#21262d] border-[#30363d]">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{stats.achievements}</div>
              <div className="text-sm text-[#8b949e]">Achievements</div>
            </CardContent>
          </Card>
          <Card className="bg-[#21262d] border-[#30363d]">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-400">{stats.contributions}</div>
              <div className="text-sm text-[#8b949e]">Contributions</div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-[#30363d]"></div>
          
          <div className="space-y-6">
            {timelineEvents.map((event, index) => (
              <div key={event.id} className="relative flex items-start gap-6">
                {/* Timeline dot */}
                <div className={`relative flex-shrink-0 w-16 h-16 rounded-full border-2 ${getEventColor(event.type)} flex items-center justify-center z-10`}>
                  {getEventIcon(event.type)}
                </div>
                
                {/* Event card */}
                <Card className="flex-1 bg-[#21262d] border-[#30363d] hover:border-[#58a6ff] transition-all duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={`${getEventColor(event.type)} capitalize`}>
                            {event.type}
                          </Badge>
                          <div className="flex items-center gap-1 text-xs text-[#8b949e]">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-[#e6edf3] mb-2">
                          {event.title}
                        </h3>
                        
                        <p className="text-[#8b949e] leading-relaxed mb-3">
                          {event.description}
                        </p>
                        
                        {event.repository && (
                          <div className="flex items-center gap-2 mb-3 text-sm">
                            <Code className="w-4 h-4 text-[#8b949e]" />
                            <span className="text-[#58a6ff]">{event.repository}</span>
                            {event.language && (
                              <div className="flex items-center gap-1">
                                <div 
                                  className="w-3 h-3 rounded-full" 
                                  style={{ backgroundColor: event.languageColor }}
                                />
                                <span className="text-[#8b949e]">{event.language}</span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {event.impact && (
                          <div className="flex items-center gap-1 mb-3 text-sm text-yellow-400">
                            <Zap className="w-3 h-3" />
                            <span>{event.impact}</span>
                          </div>
                        )}
                        
                        {event.tags && event.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {event.tags.map((tag) => (
                              <Badge 
                                key={tag} 
                                variant="outline" 
                                className="bg-transparent text-[#8b949e] border-[#30363d] text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>
        </div>
        
        {/* Activity Graph Placeholder */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4 text-[#e6edf3]">Activity Overview</h2>
          <Card className="bg-[#21262d] border-[#30363d] p-6">
            <div className="text-center text-[#8b949e]">
              <GitCommit className="w-8 h-8 mx-auto mb-2" />
              <p>Activity graph coming soon...</p>
              <p className="text-sm mt-1">Track daily commits, contributions, and project milestones</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}