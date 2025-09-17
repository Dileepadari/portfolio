import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Link as LinkIcon, Building, Mail, Globe, Edit } from "lucide-react";
import profileAvatar from "@/assets/profile-avatar.jpg";

interface ProfileCardProps {
  name?: string;
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  email?: string;
  followers?: number;
  following?: number;
}

export function ProfileCard({
  name = "Your Name",
  username = "yourusername",
  bio = "A passionate developer building amazing things.",
  location = "Your Location",
  website = "yourwebsite.com",
  company = "Your Company",
  email = "you@email.com",
  followers = 42,
  following = 58
}: ProfileCardProps) {
  return (
    <div className="w-full max-w-sm">
      <div className="mb-6">
        <Avatar className="profile-avatar w-64 h-64 mx-auto mb-4">
          <AvatarImage src={profileAvatar} alt={name} />
          <AvatarFallback className="text-6xl font-semibold">
            {name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        
        <div className="text-center mb-4">
          <h1 className="github-heading text-2xl font-bold mb-1">{name}</h1>
          <p className="github-text text-xl">{username}</p>
        </div>
        
        <p className="github-text text-base leading-relaxed mb-4">{bio}</p>
        
        <Button 
          className="github-btn github-btn-secondary w-full mb-4 h-8 text-sm"
          variant="secondary"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit profile
        </Button>
      </div>
      
      <div className="space-y-3 mb-6">
        {company && (
          <div className="flex items-center text-sm github-text">
            <Building className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{company}</span>
          </div>
        )}
        
        {location && (
          <div className="flex items-center text-sm github-text">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span>{location}</span>
          </div>
        )}
        
        {email && (
          <div className="flex items-center text-sm">
            <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
            <a href={`mailto:${email}`} className="github-link text-sm">
              {email}
            </a>
          </div>
        )}
        
        {website && (
          <div className="flex items-center text-sm">
            <Globe className="w-4 h-4 mr-2 flex-shrink-0" />
            <a href={`https://${website}`} className="github-link text-sm" target="_blank" rel="noopener noreferrer">
              {website}
            </a>
          </div>
        )}
      </div>
      
      <div className="flex space-x-4 text-sm">
        <span className="profile-stat">
          <strong className="text-foreground">{followers}</strong> followers
        </span>
        <span className="profile-stat">
          <strong className="text-foreground">{following}</strong> following
        </span>
      </div>
      
      <div className="mt-6">
        <h3 className="github-heading text-base font-semibold mb-3">Achievements</h3>
        <div className="flex space-x-2">
          <div className="achievement-badge bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <span className="text-lg">🏆</span>
          </div>
          <div className="achievement-badge bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
            <span className="text-lg">⭐</span>
          </div>
          <div className="achievement-badge bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
            <span className="text-lg">🚀</span>
          </div>
          <div className="achievement-badge bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center">
            <span className="text-lg">💎</span>
          </div>
        </div>
      </div>
    </div>
  );
}