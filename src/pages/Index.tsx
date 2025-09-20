import { ProfileCard } from "@/components/ProfileCard";
import { ReadmeCard } from "@/components/ReadmeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePersonalInfo, useProjects, useSkills } from "@/hooks/usePortfolioData";
import { Github, ExternalLink, Star, Code, Zap, Calendar } from "lucide-react";

const Index = () => {
  const { data: personalInfo } = usePersonalInfo();
  const { data: projects } = useProjects();
  const { data: skills } = useSkills();

  const featuredProjects = projects?.filter(p => p.featured).slice(0, 3) || [];
  const skillsByCategory = skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>) || {};

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
    <div className="min-h-screen" style={{backgroundColor: '#0d1117', color: '#e6edf3'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar - Profile Info */}
          <aside className="lg:w-80 flex-shrink-0">
            <div className="fade-in">
              <ProfileCard />
            </div>
          </aside>
          
          {/* Main Content */}
          <main className="flex-1 min-w-0 space-y-8">
            {/* README Section */}
            <div className="slide-up">
              <ReadmeCard />
            </div>

            {/* Featured Projects */}
            {featuredProjects.length > 0 && (
              <div className="slide-up">
                <Card className="bg-[#21262d] border-[#30363d]">
                  <CardHeader>
                    <CardTitle className="text-[#e6edf3] flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-400" />
                      Featured Projects
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {featuredProjects.map((project) => (
                        <div key={project.id} className="bg-[#0d1117] rounded-lg p-4 border border-[#30363d]">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold text-[#58a6ff] hover:underline cursor-pointer">
                              {project.title}
                            </h3>
                            <div className="flex gap-2">
                              {project.github_url && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#30363d]"
                                  asChild
                                >
                                  <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                                    <Github className="w-3 h-3" />
                                  </a>
                                </Button>
                              )}
                              {project.live_url && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-[#8b949e] hover:text-[#e6edf3] hover:bg-[#30363d]"
                                  asChild
                                >
                                  <a href={project.live_url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-3 h-3" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                          <p className="text-[#8b949e] text-sm leading-relaxed mb-3">
                            {project.description}
                          </p>
                          {project.technologies && (
                            <div className="flex flex-wrap gap-1.5">
                              {project.technologies.map((tech) => (
                                <Badge 
                                  key={tech} 
                                  variant="secondary" 
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
              </div>
            )}

            {/* Skills Overview */}
            {Object.keys(skillsByCategory).length > 0 && (
              <div className="slide-up">
                <Card className="bg-[#21262d] border-[#30363d]">
                  <CardHeader>
                    <CardTitle className="text-[#e6edf3] flex items-center gap-2">
                      <Code className="w-5 h-5" />
                      Technical Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {Object.entries(skillsByCategory).slice(0, 3).map(([category, categorySkills]) => (
                        <div key={category}>
                          <h4 className="text-sm font-medium text-[#e6edf3] mb-2">{category}</h4>
                          <div className="flex flex-wrap gap-1">
                            {categorySkills.slice(0, 8).map((skill) => (
                              <Badge 
                                key={skill.id} 
                                variant="outline" 
                                className="bg-[#388bfd]/10 text-[#58a6ff] border-[#388bfd]/20 text-xs"
                              >
                                {skill.skill_name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
