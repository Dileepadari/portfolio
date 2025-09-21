import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { usePersonalInfo } from "@/hooks/usePortfolioData";
import { useAdmin } from "@/hooks/useAdmin";
import { MapPin, Mail, Phone, Globe, Linkedin, Github, Edit } from "lucide-react";

export const ProfileCard = () => {
  const { data: personalInfo } = usePersonalInfo();
  const { isAdmin } = useAdmin();

  if (!personalInfo) return null;

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={personalInfo.avatar_url || "/placeholder.svg"}
              alt={personalInfo.name}
              className="w-32 h-32 rounded-full border-4 border-border object-cover"
            />
            {isAdmin && (
              <Button
                size="sm"
                variant="secondary"
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full p-0"
              >
                <Edit className="w-3 h-3" />
              </Button>
            )}
          </div>
          <h1 className="text-2xl font-bold text-foreground mt-4 text-center">
            {personalInfo.name}
            {isAdmin && (
              <Button size="sm" variant="ghost" className="ml-2 p-1">
                <Edit className="w-3 h-3" />
              </Button>
            )}
          </h1>
          <p className="text-muted-foreground text-center">
            {personalInfo.title}
            {isAdmin && (
              <Button size="sm" variant="ghost" className="ml-1 p-1">
                <Edit className="w-3 h-3" />
              </Button>
            )}
          </p>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {personalInfo.bio}
            {isAdmin && (
              <Button size="sm" variant="ghost" className="ml-2 p-1">
                <Edit className="w-3 h-3" />
              </Button>
            )}
          </p>
        </div>

        {/* Contact Info */}
        <div className="space-y-3 mb-6">
          {personalInfo.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{personalInfo.location}</span>
              {isAdmin && (
                <Button size="sm" variant="ghost" className="p-1">
                  <Edit className="w-3 h-3" />
                </Button>
              )}
            </div>
          )}
          {personalInfo.email && (
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <a href={`mailto:${personalInfo.email}`} className="hover:text-primary">
                {personalInfo.email}
              </a>
              {isAdmin && (
                <Button size="sm" variant="ghost" className="p-1">
                  <Edit className="w-3 h-3" />
                </Button>
              )}
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>{personalInfo.phone}</span>
              {isAdmin && (
                <Button size="sm" variant="ghost" className="p-1">
                  <Edit className="w-3 h-3" />
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="space-y-2">
          {personalInfo.website && (
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href={`https://${personalInfo.website}`} target="_blank" rel="noopener noreferrer">
                <Globe className="w-4 h-4 mr-2" />
                {personalInfo.website}
              </a>
            </Button>
          )}
          {personalInfo.linkedin && (
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </a>
            </Button>
          )}
          {personalInfo.github && (
            <Button variant="outline" className="w-full justify-start" asChild>
              <a href={personalInfo.github} target="_blank" rel="noopener noreferrer">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};