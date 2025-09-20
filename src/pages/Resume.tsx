import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Mail, 
  Globe, 
  Linkedin, 
  Github, 
  Twitter,
  Download,
  Phone,
  Calendar,
  GraduationCap,
  Briefcase,
  Award,
  Code
} from "lucide-react";
import { usePersonalInfo, useEducation, useExperience, useSkills, useAchievements } from "@/hooks/usePortfolioData";
import profileAvatar from "@/assets/profile-avatar.jpg";

export function Resume() {
  const { data: personalInfo } = usePersonalInfo();
  const { data: education } = useEducation();
  const { data: experience } = useExperience();
  const { data: skills } = useSkills();
  const { data: achievements } = useAchievements();

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  if (!personalInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <Card className="mb-8 bg-card border-border">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="relative">
                <img 
                  src={personalInfo.avatar_url || profileAvatar} 
                  alt={personalInfo.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-border"
                />
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {personalInfo.name}
                </h1>
                <p className="text-xl text-muted-foreground mb-4">
                  {personalInfo.title}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {personalInfo.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 mr-2" />
                    {personalInfo.phone}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 mr-2" />
                    {personalInfo.email}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Globe className="w-4 h-4 mr-2" />
                    {personalInfo.website}
                  </div>
                </div>

                <div className="flex gap-3 mb-6">
                  <Button variant="outline" size="sm" asChild>
                    <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href={personalInfo.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-4 h-4 mr-2" />
                      Portfolio
                    </a>
                  </Button>
                </div>

                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Download className="w-4 h-4 mr-2" />
                  Download Resume
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Experience */}
            <Card className="bg-card border-border">
              <CardHeader>
                <h2 className="text-xl font-bold flex items-center text-foreground">
                  <Briefcase className="w-5 h-5 mr-2" />
                  Experience
                </h2>
              </CardHeader>
              <CardContent className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-foreground">{exp.title}</h3>
                        <p className="text-primary font-medium">{exp.company}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{exp.duration}</span>
                    </div>
                    {exp.location && (
                      <p className="text-sm text-muted-foreground mb-3">{exp.location}</p>
                    )}
                    {exp.description && (
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        {exp.description.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <span className="mr-2">•</span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                    {exp.technologies && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {exp.technologies.map((tech) => (
                          <Badge key={tech} variant="secondary" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="bg-card border-border">
              <CardHeader>
                <h2 className="text-xl font-bold flex items-center text-foreground">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Education
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="font-semibold text-foreground">{edu.degree}</h3>
                        <p className="text-primary">{edu.institution}</p>
                      </div>
                      <span className="text-sm text-muted-foreground">{edu.duration}</span>
                    </div>
                    {edu.location && (
                      <p className="text-sm text-muted-foreground">{edu.location}</p>
                    )}
                    {edu.gpa && (
                      <p className="text-sm text-muted-foreground">GPA: {edu.gpa}</p>
                    )}
                    {edu.description && (
                      <p className="text-sm text-muted-foreground mt-2">{edu.description}</p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Skills */}
            <Card className="bg-card border-border">
              <CardHeader>
                <h2 className="text-xl font-bold flex items-center text-foreground">
                  <Code className="w-5 h-5 mr-2" />
                  Skills
                </h2>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-foreground mb-3">{category}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {categorySkills.map((skill) => (
                        <Badge 
                          key={skill.id} 
                          variant="secondary" 
                          className="justify-center text-xs py-1"
                        >
                          {skill.skill_name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-card border-border">
              <CardHeader>
                <h2 className="text-xl font-bold flex items-center text-foreground">
                  <Award className="w-5 h-5 mr-2" />
                  Achievements
                </h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="border-b border-border last:border-b-0 pb-4 last:pb-0">
                    <h3 className="font-semibold text-foreground">{achievement.title}</h3>
                    {achievement.description && (
                      <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                    )}
                    {achievement.date_achieved && (
                      <p className="text-xs text-muted-foreground mt-2">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {new Date(achievement.date_achieved).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}