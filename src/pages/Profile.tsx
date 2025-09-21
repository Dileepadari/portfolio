import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
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
  Code,
  BookOpen,
  Trophy,
  FolderOpen,
  User,
  Layers,
  Palette,
  Monitor,
  GitBranch,
  Star,
  Languages
} from "lucide-react";
import { usePersonalInfo, useEducation, useExperience, useSkills, useAchievements } from "@/hooks/usePortfolioData";
import profileAvatar from "@/assets/dileepadari.png";

export function Profile() {
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
      <div className="max-w-6xl mx-auto p-3 sm:p-6">
        {/* Header */}
        <Card className="mb-6 sm:mb-8 bg-card border-border">
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8 items-center lg:items-start">
              <div className="relative self-center shrink-0">
                <img 
                  src={personalInfo?.avatar_url || profileAvatar} 
                  alt={personalInfo?.name}
                  className="w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 rounded-full object-cover border-4 border-border"
                />
              </div>
              
              <div className="flex-1 w-full text-center lg:text-left">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  {personalInfo?.name}
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-lg text-muted-foreground mb-4 leading-relaxed">
                  {personalInfo?.title}
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <a 
                    href={`tel:${personalInfo?.phone}`} 
                    className="flex items-center lg:justify-start justify-center text-sm md:text-base text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    <Phone className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-2 shrink-0" />
                    {personalInfo?.phone}
                  </a>
                  <a 
                    href={`mailto:${personalInfo?.email}`} 
                    className="flex items-center lg:justify-start justify-center text-sm md:text-base text-muted-foreground hover:text-primary transition-colors cursor-pointer break-all"
                  >
                    <Mail className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-2 shrink-0" />
                    <span className="truncate">{personalInfo?.email}</span>
                  </a>
                  <a 
                    href={`${personalInfo?.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center lg:justify-start justify-center text-sm md:text-base text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    <Globe className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-2 shrink-0" />
                    <span className="truncate">{personalInfo?.website}</span>
                  </a>
                  <a 
                    href={`https://maps.google.com/?q=${encodeURIComponent(personalInfo?.location || '')}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center lg:justify-start justify-center text-sm md:text-base text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-2 shrink-0" />
                    <span className="truncate">{personalInfo?.location}</span>
                  </a>
                </div>

                <div className="flex flex-wrap lg:justify-start justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10 px-2 sm:px-3 md:px-4" asChild>
                    <a href={personalInfo?.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline sm:hidden md:inline">LinkedIn</span>
                      <span className="hidden sm:inline md:hidden">LI</span>
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10 px-2 sm:px-3 md:px-4" asChild>
                    <a href={personalInfo?.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline sm:hidden md:inline">GitHub</span>
                      <span className="hidden sm:inline md:hidden">GH</span>
                    </a>
                  </Button>
                  {personalInfo?.medium && (
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10 px-2 sm:px-3 md:px-4" asChild>
                      <a href={personalInfo?.medium} target="_blank" rel="noopener noreferrer">
                        <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
                        <span className="hidden xs:inline sm:hidden md:inline">Medium</span>
                        <span className="hidden sm:inline md:hidden">MD</span>
                      </a>
                    </Button>
                  )}
                  {personalInfo?.codeforces && (
                    <Button variant="outline" size="sm" className="text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10 px-2 sm:px-3 md:px-4" asChild>
                      <a href={personalInfo?.codeforces} target="_blank" rel="noopener noreferrer">
                        <Trophy className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
                        <span className="hidden xs:inline sm:hidden md:inline">Codeforces</span>
                        <span className="hidden sm:inline md:hidden">CF</span>
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm md:text-base h-8 sm:h-9 md:h-10 px-2 sm:px-3 md:px-4" asChild>
                    <a href={personalInfo?.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline sm:hidden md:inline">Portfolio</span>
                      <span className="hidden sm:inline md:hidden">Web</span>
                    </a>
                  </Button>
                </div>

                <div className="flex flex-row xs:flex-row lg:justify-start justify-center gap-2 sm:gap-3">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-xs sm:text-sm md:text-base h-8 sm:h-10 md:h-11 px-3 sm:px-4 md:px-6" asChild>
                    <Link to="/projects">
                      <FolderOpen className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline sm:hidden md:inline">View All Projects</span>
                      <span className="sm:inline md:hidden">Projects</span>
                    </Link>
                  </Button>
                  
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm md:text-base h-8 sm:h-10 md:h-11 px-3 sm:px-4 md:px-6">
                    <Download className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 mr-1 sm:mr-2" />
                    <span className="hidden xs:inline sm:hidden md:inline">Download Resume</span>
                    <span className="sm:inline md:hidden">Resume</span>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Introduction Section */}
        <Card className="mb-6 sm:mb-8 bg-card border-border">
          <CardHeader className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold flex items-center text-foreground">
              <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              About Me
            </h2>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              <p>
                Passionate <span className="text-foreground font-medium">software engineer</span> focused on transforming complex problems into elegant, scalable solutions. I bridge technical excellence with business impact, delivering meaningful outcomes through innovative development.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-start space-x-3">
                  <Layers className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">FullStack Development</h3>
                    <p className="text-sm">Strong foundation in web development, creating user-friendly and scalable web applications.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Palette className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Design Thinking</h3>
                    <p className="text-sm">Incorporating design principles and user-centric methodologies to create innovative solutions.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Monitor className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">UI/UX</h3>
                    <p className="text-sm">Crafting intuitive and visually appealing interfaces, focusing on usability and responsive design.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <GitBranch className="w-5 h-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Exploring Open Source</h3>
                    <p className="text-sm">Rebuilding open-source projects and exploring new technologies to enhance development skills.</p>
                  </div>
                </div>
              </div>
              
              <p className="text-center pt-4 border-t border-border">
                <span className="text-foreground font-medium">Ready to collaborate</span> on impactful projects and contribute to forward-thinking teams.
              </p>
              
              <div className="flex justify-center pt-1">
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  <Link to="/contact" className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Me
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Experience */}
            <Card className="bg-card border-border">
              <CardHeader className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold flex items-center text-foreground">
                  <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Experience
                </h2>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
                  
                  <div className="space-y-6">
                    {experience.map((exp, index) => (
                      <div key={exp.id} className="relative flex items-start">
                        {/* Timeline dot */}
                        <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-primary rounded-full border-4 border-background shrink-0 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/30">
                          <div className="w-2 h-2 bg-primary-foreground rounded-full transition-all duration-300 hover:scale-125"></div>
                        </div>
                        
                        {/* Content */}
                        <div className="ml-6 flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground text-sm sm:text-base">{exp.title}</h3>
                              <p className="text-primary font-medium text-sm sm:text-base">{exp.company}</p>
                            </div>
                            <span className="text-xs sm:text-sm text-muted-foreground shrink-0 bg-muted px-3 py-1.5 rounded-full transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-105 cursor-default">{exp.duration}</span>
                          </div>
                          {exp.location && (
                            <p className="text-xs sm:text-sm text-muted-foreground mb-3">{exp.location}</p>
                          )}
                          {exp.description && (
                            <p className="text-xs sm:text-sm text-muted-foreground mb-3 leading-relaxed">
                              {exp.description.join(' ')}
                            </p>
                          )}
                          {exp.technologies && (
                            <div className="flex flex-wrap gap-2">
                              {exp.technologies.map((tech, techIndex) => (
                                <Badge 
                                  key={tech} 
                                  variant="secondary" 
                                  className="text-xs rounded-md px-3 py-1 transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-primary hover:text-primary-foreground transform hover:-translate-y-0.5 cursor-default animate-in fade-in-0 slide-in-from-bottom-1"
                                  style={{
                                    animationDelay: `${techIndex * 100}ms`,
                                    animationDuration: '600ms'
                                  }}
                                >
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card className="bg-card border-border">
              <CardHeader className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold flex items-center text-foreground">
                  <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Education
                </h2>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
                  
                  <div className="space-y-6">
                    {education.map((edu, index) => (
                      <div key={edu.id} className="relative flex items-start">
                        {/* Timeline dot */}
                        <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-primary rounded-full border-4 border-background shrink-0 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/30">
                          <GraduationCap className="w-3 h-3 text-primary-foreground transition-all duration-300 hover:scale-110" />
                        </div>
                        
                        {/* Content */}
                        <div className="ml-6 flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground text-sm sm:text-base">{edu.degree}</h3>
                              <p className="text-primary text-sm sm:text-base">{edu.institution}</p>
                            </div>
                            <span className="text-xs sm:text-sm text-muted-foreground shrink-0 bg-muted px-3 py-1.5 rounded-full transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-105 cursor-default">{edu.duration}</span>
                          </div>
                          {edu.location && (
                            <p className="text-xs sm:text-sm text-muted-foreground mb-2">{edu.location}</p>
                          )}
                          {edu.gpa && (
                            <p className="text-xs sm:text-sm text-muted-foreground mb-2">GPA: {edu.gpa}</p>
                          )}
                          {edu.description && (
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{edu.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Courses */}
            <Card className="bg-card border-border">
              <CardHeader className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold flex items-center text-foreground">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Courses & Certifications
                </h2>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { name: "Data Structures & Algorithms", favorite: true },
                    { name: "Web Development", favorite: true },
                    { name: "Machine Learning", favorite: true },
                    { name: "Database Management Systems", favorite: false },
                    { name: "Software Engineering", favorite: false },
                    { name: "Computer Networks", favorite: false },
                    { name: "Operating Systems", favorite: false },
                    { name: "Object-Oriented Programming", favorite: false },
                    { name: "Computer Architecture", favorite: false },
                    { name: "Discrete Mathematics", favorite: false },
                    { name: "Statistics & Probability", favorite: false }
                  ].map((course, index) => (
                    <div 
                      key={course.name}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-all duration-300 hover:scale-105 cursor-default animate-in fade-in-0 slide-in-from-bottom-1"
                      style={{
                        animationDelay: `${index * 80}ms`,
                        animationDuration: '500ms'
                      }}
                    >
                      <span className="font-medium text-foreground text-sm">{course.name}</span>
                      {course.favorite && (
                        <Star className="w-4 h-4 fill-yellow-500 text-yellow-500 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Skills */}
            <Card className="bg-card border-border">
              <CardHeader className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold flex items-center text-foreground">
                  <Code className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Skills
                </h2>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">{category}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-2">
                      {categorySkills.map((skill, skillIndex) => (
                        <div
                          key={skill.id} 
                          className="bg-background border border-border rounded-lg px-2 py-1.5 text-center transition-all duration-200 hover:border-primary hover:shadow-sm hover:shadow-primary/10 hover:-translate-y-0.5 cursor-default animate-in fade-in-0 slide-in-from-bottom-1"
                          style={{
                            animationDelay: `${skillIndex * 80}ms`,
                            animationDuration: '500ms'
                          }}
                        >
                          <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                            {skill.skill_name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="bg-card border-border">
              <CardHeader className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold flex items-center text-foreground">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Achievements
                </h2>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="border-b border-border last:border-b-0 pb-3 sm:pb-4 last:pb-0">
                    <h3 className="font-semibold text-foreground text-sm sm:text-base">{achievement.title}</h3>
                    {achievement.description && (
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">{achievement.description}</p>
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

            {/* Languages */}
            <Card className="bg-card border-border">
              <CardHeader className="p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold flex items-center text-foreground">
                  <Languages className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Languages
                </h2>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3">
                  {[
                    { name: "Telugu", level: "Native", proficiency: 100 },
                    { name: "English", level: "Fluent", proficiency: 90 },
                    { name: "Hindi", level: "Conversational", proficiency: 75 }
                  ].map((language, index) => (
                    <div key={language.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-foreground text-sm sm:text-base">{language.name}</span>
                        <span className="text-xs text-muted-foreground">{language.level}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${language.proficiency}%`,
                            animationDelay: `${index * 200}ms`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}