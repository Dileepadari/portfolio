import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useState } from "react";
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
  Languages,
  Edit,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  Settings
} from "lucide-react";
import { usePersonalInfo, useEducation, useExperience, useSkills, useAchievements, useCourses, PersonalInfo, Education, Experience, Skill, Achievement, Course } from "@/hooks/usePortfolioData";
import { useAdmin } from "@/hooks/useAdmin";
import { supabase } from "@/integrations/supabase/client";
import profileAvatar from "@/assets/dileepadari.png";

export function Profile() {
  const { data: personalInfo, refetch: refetchPersonalInfo } = usePersonalInfo();
  const { data: education, refetch: refetchEducation } = useEducation();
  const { data: experience, refetch: refetchExperience } = useExperience();
  const { data: skills, refetch: refetchSkills } = useSkills();
  const { data: achievements, refetch: refetchAchievements } = useAchievements();
  const { data: courses, refetch: refetchCourses } = useCourses();
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  
  const [editingPersonalInfo, setEditingPersonalInfo] = useState(false);
  const [editingEducation, setEditingEducation] = useState<string | null>(null);
  const [editingExperience, setEditingExperience] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  
  // Add New states
  const [addingExperience, setAddingExperience] = useState(false);
  const [addingSkill, setAddingSkill] = useState(false);
  const [addingEducation, setAddingEducation] = useState(false);
  const [addingAchievement, setAddingAchievement] = useState(false);
  const [addingCourse, setAddingCourse] = useState(false);

  // Update functions
  const updatePersonalInfo = async (updatedInfo: Partial<typeof personalInfo>) => {
    try {
      const { error } = await supabase
        .from('personal_info')
        .update(updatedInfo)
        .eq('id', personalInfo.id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Personal information updated successfully!",
      });
      
      refetchPersonalInfo();
      setEditingPersonalInfo(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update personal information.",
        variant: "destructive",
      });
    }
  };

  const updateEducation = async (id: string, updatedEducation: Partial<Education>) => {
    try {
      const { error } = await supabase
        .from('education')
        .update(updatedEducation)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Education updated successfully!",
      });
      
      refetchEducation();
      setEditingEducation(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update education.",
        variant: "destructive",
      });
    }
  };

  const updateExperience = async (id: string, updatedExperience: Partial<Experience>) => {
    try {
      const { error } = await supabase
        .from('experience')
        .update(updatedExperience)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Experience updated successfully!",
      });
      
      refetchExperience();
      setEditingExperience(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update experience.",
        variant: "destructive",
      });
    }
  };

  const updateSkill = async (id: string, updatedSkill: Partial<Skill>) => {
    try {
      const { error } = await supabase
        .from('skills')
        .update(updatedSkill)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Skill updated successfully!",
      });
      
      refetchSkills();
      setEditingSkill(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update skill.",
        variant: "destructive",
      });
    }
  };

  const updateAchievement = async (id: string, updatedAchievement: Partial<Achievement>) => {
    try {
      const { error } = await supabase
        .from('achievements')
        .update(updatedAchievement)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Achievement updated successfully!",
      });
      
      refetchAchievements();
      setEditingAchievement(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update achievement.",
        variant: "destructive",
      });
    }
  };

  const updateCourse = async (id: string, updatedCourse: Partial<Course>) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update(updatedCourse)
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Course updated successfully!",
      });
      
      refetchCourses();
      setEditingCourse(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update course.",
        variant: "destructive",
      });
    }
  };

  // Add functions
  const addExperience = async (newExperience: Omit<Experience, 'id'>) => {
    try {
      const { error } = await supabase
        .from('experience')
        .insert([newExperience]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Experience added successfully!",
      });
      
      refetchExperience();
      setAddingExperience(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add experience.",
        variant: "destructive",
      });
    }
  };

  const addSkill = async (newSkill: Omit<Skill, 'id'>) => {
    try {
      const { error } = await supabase
        .from('skills')
        .insert([newSkill]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Skill added successfully!",
      });
      
      refetchSkills();
      setAddingSkill(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add skill.",
        variant: "destructive",
      });
    }
  };

  const addEducation = async (newEducation: Omit<Education, 'id'>) => {
    try {
      const { error } = await supabase
        .from('education')
        .insert([newEducation]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Education added successfully!",
      });
      
      refetchEducation();
      setAddingEducation(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add education.",
        variant: "destructive",
      });
    }
  };

  const addAchievement = async (newAchievement: Omit<Achievement, 'id'>) => {
    try {
      const { error } = await supabase
        .from('achievements')
        .insert([newAchievement]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Achievement added successfully!",
      });
      
      refetchAchievements();
      setAddingAchievement(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add achievement.",
        variant: "destructive",
      });
    }
  };

  const addCourse = async (newCourse: Omit<Course, 'id'>) => {
    try {
      const { error } = await supabase
        .from('courses')
        .insert([newCourse]);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Course added successfully!",
      });
      
      refetchCourses();
      setAddingCourse(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add course.",
        variant: "destructive",
      });
    }
  };

  // Delete functions
  const deleteExperience = async (id: string) => {
    try {
      const { error } = await supabase
        .from('experience')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Experience deleted successfully!",
      });
      
      refetchExperience();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete experience.",
        variant: "destructive",
      });
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      const { error } = await supabase
        .from('skills')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Skill deleted successfully!",
      });
      
      refetchSkills();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete skill.",
        variant: "destructive",
      });
    }
  };

  const deleteEducation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('education')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Education deleted successfully!",
      });
      
      refetchEducation();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete education.",
        variant: "destructive",
      });
    }
  };

  const deleteAchievement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('achievements')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Achievement deleted successfully!",
      });
      
      refetchAchievements();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete achievement.",
        variant: "destructive",
      });
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Course deleted successfully!",
      });
      
      refetchCourses();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete course.",
        variant: "destructive",
      });
    }
  };

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
                  className="w-24 h-24 sm:w-48 sm:h-48 lg:w-64 lg:h-64 rounded-full object-cover border-4 border-border"
                />
              </div>
              
              <div className="flex-1 w-full text-center lg:text-left">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                      {personalInfo?.name}
                    </h1>
                  </div>
                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    {isAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingPersonalInfo(!editingPersonalInfo)}
                        title={editingPersonalInfo ? "Cancel Edit" : "Edit Profile"}
                      >
                        {editingPersonalInfo ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                      </Button>
                    )}
                  </div>
                </div>
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
            {editingPersonalInfo && isAdmin ? (
              <PersonalInfoEditForm 
                personalInfo={personalInfo} 
                onSave={updatePersonalInfo}
                onCancel={() => setEditingPersonalInfo(false)}
              />
            ) : (
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
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Experience */}
            <Card className="bg-card border-border">
              <CardHeader className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold flex items-center text-foreground">
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Experience
                  </h2>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAddingExperience(true)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
                  
                  <div className="space-y-6">
                    {addingExperience && isAdmin && (
                      <div className="relative flex items-start">
                        <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-primary rounded-full border-4 border-background shrink-0">
                          <Plus className="w-3 h-3 text-primary-foreground" />
                        </div>
                        <div className="ml-6 flex-1">
                          <ExperienceEditForm
                            experience={{
                              id: '',
                              title: '',
                              company: '',
                              duration: '',
                              location: '',
                              description: [],
                              technologies: [],
                              order_index: 0
                            }}
                            onSave={(data) => addExperience(data as Omit<Experience, 'id'>)}
                            onCancel={() => setAddingExperience(false)}
                          />
                        </div>
                      </div>
                    )}
                    {experience.map((exp, index) => (
                      <div key={exp.id} className="relative flex items-start">
                        {/* Timeline dot */}
                        <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-primary rounded-full border-4 border-background shrink-0 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/30">
                          <div className="w-2 h-2 bg-primary-foreground rounded-full transition-all duration-300 hover:scale-125"></div>
                        </div>
                        
                        {/* Content */}
                        <div className="ml-6 flex-1">
                          {editingExperience === exp.id && isAdmin ? (
                            <ExperienceEditForm
                              experience={exp}
                              onSave={(data) => updateExperience(exp.id, data)}
                              onCancel={() => setEditingExperience(null)}
                            />
                          ) : (
                            <div>
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-foreground text-sm sm:text-base">{exp.title}</h3>
                                  <p className="text-primary font-medium text-sm sm:text-base">{exp.company}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs sm:text-sm text-muted-foreground shrink-0 bg-muted px-3 py-1.5 rounded-full transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-105 cursor-default">{exp.duration}</span>
                                  {isAdmin && (
                                    <div className="flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setEditingExperience(exp.id)}
                                        className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground"
                                      >
                                        <Edit2 className="w-3 h-3" />
                                      </Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Experience</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to delete "{exp.title}" at {exp.company}? This action cannot be undone.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => deleteExperience(exp.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                              Delete
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  )}
                                </div>
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
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold flex items-center text-foreground">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Education
                  </h2>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAddingEducation(true)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
                  
                  <div className="space-y-6">
                    {addingEducation && isAdmin && (
                      <div className="relative flex items-start">
                        <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-primary rounded-full border-4 border-background shrink-0">
                          <Plus className="w-3 h-3 text-primary-foreground" />
                        </div>
                        <div className="ml-6 flex-1">
                          <EducationEditForm
                            education={{
                              id: '',
                              degree: '',
                              institution: '',
                              duration: '',
                              location: '',
                              gpa: '',
                              description: '',
                              order_index: 0
                            }}
                            onSave={(data) => addEducation(data as Omit<Education, 'id'>)}
                            onCancel={() => setAddingEducation(false)}
                          />
                        </div>
                      </div>
                    )}
                    {education.map((edu, index) => (
                      <div key={edu.id} className="relative flex items-start">
                        {/* Timeline dot */}
                        <div className="relative z-10 flex items-center justify-center w-8 h-8 bg-primary rounded-full border-4 border-background shrink-0 transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-primary/30">
                          <GraduationCap className="w-3 h-3 text-primary-foreground transition-all duration-300 hover:scale-110" />
                        </div>
                        
                        {/* Content */}
                        <div className="ml-6 flex-1">
                          {editingEducation === edu.id ? (
                            <EducationEditForm
                              education={edu}
                              onSave={(data) => updateEducation(edu.id, data)}
                              onCancel={() => setEditingEducation(null)}
                            />
                          ) : (
                            <>
                              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-foreground text-sm sm:text-base">{edu.degree}</h3>
                                  <p className="text-primary text-sm sm:text-base">{edu.institution}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs sm:text-sm text-muted-foreground shrink-0 bg-muted px-3 py-1.5 rounded-full transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-105 cursor-default">{edu.duration}</span>
                                  {isAdmin && (
                                    <div className="flex gap-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setEditingEducation(edu.id)}
                                        className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground"
                                      >
                                        <Edit2 className="w-3 h-3" />
                                      </Button>
                                      <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                          >
                                            <Trash2 className="w-3 h-3" />
                                          </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                          <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Education</AlertDialogTitle>
                                            <AlertDialogDescription>
                                              Are you sure you want to delete "{edu.degree}" from {edu.institution}? This action cannot be undone.
                                            </AlertDialogDescription>
                                          </AlertDialogHeader>
                                          <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => deleteEducation(edu.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                              Delete
                                            </AlertDialogAction>
                                          </AlertDialogFooter>
                                        </AlertDialogContent>
                                      </AlertDialog>
                                    </div>
                                  )}
                                </div>
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
                            </>
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
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold flex items-center text-foreground">
                    <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Courses & Certifications
                  </h2>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAddingCourse(true)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {courses.map((course, index) => (
                    <div 
                      key={course.id}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-all duration-300 hover:scale-105 cursor-default animate-in fade-in-0 slide-in-from-bottom-1 group"
                      style={{
                        animationDelay: `${index * 80}ms`,
                        animationDuration: '500ms'
                      }}
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <span className="font-medium text-foreground text-sm">{course.name}</span>
                        {course.is_favorite && (
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500 shrink-0" />
                        )}
                      </div>
                      {isAdmin && (
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            onClick={() => {
                              setEditingCourse(course);
                            }}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-muted-foreground/20"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 hover:bg-destructive/20 text-destructive"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Course</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{course.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteCourse(course.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
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
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold flex items-center text-foreground">
                    <Code className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Skills
                  </h2>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAddingSkill(true)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {addingSkill && isAdmin && (
                  <div className="bg-muted rounded-lg p-4 border border-border">
                    <h3 className="font-semibold text-foreground mb-3 text-sm sm:text-base">Add New Skill</h3>
                    <div className="space-y-3">
                      <form onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const skillData = {
                          skill_name: formData.get('skill_name') as string,
                          category: formData.get('category') as string,
                          proficiency: parseInt(formData.get('proficiency') as string) || 80,
                          order_index: 0
                        };
                        addSkill(skillData as Omit<Skill, 'id'>);
                      }} className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                            <Label htmlFor="skill_name" className="text-xs">Skill Name</Label>
                            <Input
                              id="skill_name"
                              name="skill_name"
                              placeholder="React"
                              className="text-sm"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="category" className="text-xs">Category</Label>
                            <Input
                              id="category"
                              name="category"
                              placeholder="Frontend"
                              className="text-sm"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="proficiency" className="text-xs">Proficiency (0-100)</Label>
                            <Input
                              id="proficiency"
                              name="proficiency"
                              type="number"
                              min="0"
                              max="100"
                              defaultValue="80"
                              className="text-sm"
                              required
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button type="submit" size="sm" className="flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Save
                          </Button>
                          <Button type="button" variant="outline" size="sm" onClick={() => setAddingSkill(false)}>
                            <X className="w-4 h-4" />
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-foreground mb-2 sm:mb-3 text-sm sm:text-base">{category}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-2">
                      {categorySkills.map((skill, skillIndex) => (
                        <div key={skill.id} className="relative group">
                          {editingSkill === skill.id && isAdmin ? (
                            <SkillEditForm
                              skill={skill}
                              onSave={(data) => updateSkill(skill.id, data)}
                              onCancel={() => setEditingSkill(null)}
                            />
                          ) : (
                            <div
                              className="bg-background border border-border rounded-lg px-2 py-1.5 text-center transition-all duration-200 hover:border-primary hover:shadow-sm hover:shadow-primary/10 hover:-translate-y-0.5 cursor-default animate-in fade-in-0 slide-in-from-bottom-1"
                              style={{
                                animationDelay: `${skillIndex * 80}ms`,
                                animationDuration: '500ms'
                              }}
                            >
                              <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                                {skill.skill_name}
                              </span>
                              {isAdmin && (
                                <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-6 h-6 p-0 bg-background border border-border shadow-sm hover:bg-primary hover:text-primary-foreground"
                                    onClick={() => setEditingSkill(skill.id)}
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-6 h-6 p-0 bg-background border border-border shadow-sm hover:bg-destructive hover:text-destructive-foreground"
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Skill</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete "{skill.skill_name}" from {skill.category}? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => deleteSkill(skill.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                          Delete
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              )}
                            </div>
                          )}
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
                <div className="flex items-center justify-between">
                  <h2 className="text-lg sm:text-xl font-bold flex items-center text-foreground">
                    <Award className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Achievements
                  </h2>
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAddingAchievement(true)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
                {addingAchievement && isAdmin && (
                  <div className="border-b border-border pb-3 sm:pb-4 mb-3 sm:mb-4">
                    <h3 className="font-semibold text-foreground mb-3 text-sm sm:text-base">Add New Achievement</h3>
                    <AchievementEditForm
                      achievement={{
                        id: '',
                        title: '',
                        description: '',
                        date_achieved: '',
                        order_index: 0
                      }}
                      onSave={(data) => addAchievement(data as Omit<Achievement, 'id'>)}
                      onCancel={() => setAddingAchievement(false)}
                    />
                  </div>
                )}
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="border-b border-border last:border-b-0 pb-3 sm:pb-4 last:pb-0">
                    {editingAchievement === achievement.id ? (
                      <AchievementEditForm
                        achievement={achievement}
                        onSave={(data) => updateAchievement(achievement.id, data)}
                        onCancel={() => setEditingAchievement(null)}
                      />
                    ) : (
                      <>
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
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
                          {isAdmin && (
                            <div className="flex gap-1 ml-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingAchievement(achievement.id)}
                                className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground"
                              >
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Achievement</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete "{achievement.title}"? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteAchievement(achievement.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          )}
                        </div>
                      </>
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

      {/* Add Course Dialog */}
      {addingCourse && (
        <Dialog open={addingCourse} onOpenChange={setAddingCourse}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Course</DialogTitle>
            </DialogHeader>
            <CourseEditForm
              course={{
                id: '',
                name: '',
                description: '',
                institution: '',
                completion_date: '',
                certificate_url: '',
                is_favorite: false,
                order_index: 0
              }}
              onSave={(data) => addCourse(data as Omit<Course, 'id'>)}
              onCancel={() => setAddingCourse(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Course Dialog */}
      {editingCourse && (
        <Dialog open={!!editingCourse} onOpenChange={() => setEditingCourse(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
            </DialogHeader>
            <CourseEditForm
              course={editingCourse}
              onSave={(data) => updateCourse(editingCourse.id, data)}
              onCancel={() => setEditingCourse(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Edit Form Components
interface PersonalInfoEditFormProps {
  personalInfo: PersonalInfo;
  onSave: (data: Partial<PersonalInfo>) => void;
  onCancel: () => void;
}

function PersonalInfoEditForm({ personalInfo, onSave, onCancel }: PersonalInfoEditFormProps) {
  const [formData, setFormData] = useState({
    name: personalInfo?.name || '',
    title: personalInfo?.title || '',
    bio: personalInfo?.bio || '',
    location: personalInfo?.location || '',
    email: personalInfo?.email || '',
    phone: personalInfo?.phone || '',
    website: personalInfo?.website || '',
    linkedin: personalInfo?.linkedin || '',
    github: personalInfo?.github || '',
    twitter: personalInfo?.twitter || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your full name"
          />
        </div>
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Your professional title"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          placeholder="Tell us about yourself..."
          rows={4}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City, Country"
          />
        </div>
        <div>
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="LinkedIn username"
          />
        </div>
        <div>
          <Label htmlFor="github">GitHub</Label>
          <Input
            id="github"
            name="github"
            value={formData.github}
            onChange={handleChange}
            placeholder="GitHub username"
          />
        </div>
        <div>
          <Label htmlFor="twitter">Twitter</Label>
          <Input
            id="twitter"
            name="twitter"
            value={formData.twitter}
            onChange={handleChange}
            placeholder="Twitter handle"
          />
        </div>
      </div>
      
      <div className="flex gap-2 pt-4">
        <Button type="submit" className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Experience Edit Form Component
interface ExperienceEditFormProps {
  experience: Experience;
  onSave: (data: Partial<Experience>) => void;
  onCancel: () => void;
}

function ExperienceEditForm({ experience, onSave, onCancel }: ExperienceEditFormProps) {
  const [formData, setFormData] = useState({
    title: experience.title || '',
    company: experience.company || '',
    duration: experience.duration || '',
    location: experience.location || '',
    description: experience.description ? experience.description.join('\n') : '',
    technologies: experience.technologies ? experience.technologies.join(', ') : '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      description: formData.description ? formData.description.split('\n').filter(line => line.trim()) : [],
      technologies: formData.technologies ? formData.technologies.split(',').map(tech => tech.trim()).filter(tech => tech) : [],
    };
    onSave(submissionData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-muted rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Senior Software Engineer"
            required
          />
        </div>
        <div>
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Company Name"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="Jan 2023 - Present"
            required
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City, Country"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description (one line per bullet point)</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Led development of React applications..."
          rows={4}
        />
      </div>
      
      <div>
        <Label htmlFor="technologies">Technologies (comma-separated)</Label>
        <Input
          id="technologies"
          name="technologies"
          value={formData.technologies}
          onChange={handleChange}
          placeholder="React, TypeScript, Node.js, PostgreSQL"
        />
      </div>
      
      <div className="flex gap-2 pt-2">
        <Button type="submit" size="sm" className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Education Edit Form Component
interface EducationEditFormProps {
  education: Education;
  onSave: (data: Partial<Education>) => void;
  onCancel: () => void;
}

function EducationEditForm({ education, onSave, onCancel }: EducationEditFormProps) {
  const [formData, setFormData] = useState({
    degree: education.degree || '',
    institution: education.institution || '',
    duration: education.duration || '',
    location: education.location || '',
    gpa: education.gpa || '',
    description: education.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      gpa: formData.gpa || null,
      location: formData.location || null,
      description: formData.description || null,
    };
    onSave(submissionData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-muted rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="degree">Degree</Label>
          <Input
            id="degree"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            placeholder="Bachelor of Technology"
            required
          />
        </div>
        <div>
          <Label htmlFor="institution">Institution</Label>
          <Input
            id="institution"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            placeholder="University Name"
            required
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            name="duration"
            value={formData.duration}
            onChange={handleChange}
            placeholder="2019 - 2023"
            required
          />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City, Country"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="gpa">GPA (optional)</Label>
        <Input
          id="gpa"
          name="gpa"
          value={formData.gpa}
          onChange={handleChange}
          placeholder="3.8/4.0"
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Relevant coursework, achievements, etc."
          rows={3}
        />
      </div>
      
      <div className="flex gap-2 pt-2">
        <Button type="submit" size="sm" className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Achievement Edit Form Component
interface AchievementEditFormProps {
  achievement: Achievement;
  onSave: (data: Partial<Achievement>) => void;
  onCancel: () => void;
}

function AchievementEditForm({ achievement, onSave, onCancel }: AchievementEditFormProps) {
  const [formData, setFormData] = useState({
    title: achievement.title || '',
    description: achievement.description || '',
    date_achieved: achievement.date_achieved ? new Date(achievement.date_achieved).toISOString().split('T')[0] : '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      description: formData.description || null,
      date_achieved: formData.date_achieved || null,
    };
    onSave(submissionData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-muted rounded-lg">
      <div>
        <Label htmlFor="title">Achievement Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Achievement title"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description of the achievement"
          rows={3}
        />
      </div>
      
      <div>
        <Label htmlFor="date_achieved">Date Achieved (optional)</Label>
        <Input
          id="date_achieved"
          name="date_achieved"
          type="date"
          value={formData.date_achieved}
          onChange={handleChange}
        />
      </div>
      
      <div className="flex gap-2 pt-2">
        <Button type="submit" size="sm" className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Course Edit Form Component
interface CourseEditFormProps {
  course: Course;
  onSave: (data: Partial<Course>) => void;
  onCancel: () => void;
}

function CourseEditForm({ course, onSave, onCancel }: CourseEditFormProps) {
  const [formData, setFormData] = useState({
    name: course.name || '',
    description: course.description || '',
    institution: course.institution || '',
    completion_date: course.completion_date ? new Date(course.completion_date).toISOString().split('T')[0] : '',
    certificate_url: course.certificate_url || '',
    is_favorite: course.is_favorite || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = {
      ...formData,
      description: formData.description || null,
      institution: formData.institution || null,
      completion_date: formData.completion_date || null,
      certificate_url: formData.certificate_url || null,
    };
    onSave(submissionData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-muted rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Course Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Data Structures & Algorithms"
            required
          />
        </div>
        <div>
          <Label htmlFor="institution">Institution (optional)</Label>
          <Input
            id="institution"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            placeholder="University/Platform"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Course description and key learnings"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="completion_date">Completion Date (optional)</Label>
          <Input
            id="completion_date"
            name="completion_date"
            type="date"
            value={formData.completion_date}
            onChange={handleChange}
          />
        </div>
        <div>
          <Label htmlFor="certificate_url">Certificate URL (optional)</Label>
          <Input
            id="certificate_url"
            name="certificate_url"
            value={formData.certificate_url}
            onChange={handleChange}
            placeholder="https://..."
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_favorite"
          name="is_favorite"
          checked={formData.is_favorite}
          onChange={handleChange}
          className="rounded"
        />
        <Label htmlFor="is_favorite">Mark as favorite</Label>
      </div>
      
      <div className="flex gap-2 pt-2">
        <Button type="submit" size="sm" className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Skill Edit Form Component
interface SkillEditFormProps {
  skill: Skill;
  onSave: (data: Partial<Skill>) => void;
  onCancel: () => void;
}

function SkillEditForm({ skill, onSave, onCancel }: SkillEditFormProps) {
  const [formData, setFormData] = useState({
    skill_name: skill.skill_name || '',
    category: skill.category || '',
    proficiency: skill.proficiency || 50,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'proficiency' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="absolute inset-0 bg-background border border-border rounded-lg p-2 shadow-lg z-10">
      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          <Input
            name="skill_name"
            value={formData.skill_name}
            onChange={handleChange}
            placeholder="Skill name"
            className="text-xs h-6"
            required
          />
        </div>
        <div>
          <Input
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Category"
            className="text-xs h-6"
            required
          />
        </div>
        <div>
          <Input
            name="proficiency"
            type="number"
            min="0"
            max="100"
            value={formData.proficiency}
            onChange={handleChange}
            placeholder="Proficiency %"
            className="text-xs h-6"
          />
        </div>
        <div className="flex gap-1 pt-1">
          <Button type="submit" size="sm" className="h-6 px-2 text-xs">
            <Save className="w-3 h-3" />
          </Button>
          <Button type="button" variant="outline" size="sm" className="h-6 px-2 text-xs" onClick={onCancel}>
            <X className="w-3 h-3" />
          </Button>
        </div>
      </form>
    </div>
  );
}