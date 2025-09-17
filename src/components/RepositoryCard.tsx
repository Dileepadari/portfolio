import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, GitFork, Circle } from "lucide-react";

interface RepositoryCardProps {
  name: string;
  description?: string;
  language?: string;
  languageColor?: string;
  stars?: number;
  forks?: number;
  isPrivate?: boolean;
  updatedAt?: string;
  tags?: string[];
}

export function RepositoryCard({
  name,
  description,
  language = "TypeScript",
  languageColor = "#3178c6",
  stars = 0,
  forks = 0,
  isPrivate = false,
  updatedAt = "2 days ago",
  tags = []
}: RepositoryCardProps) {
  return (
    <div className="repo-card p-4 h-full flex flex-col">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <h3 className="github-heading text-base font-semibold github-link truncate">
            {name}
          </h3>
          {isPrivate && (
            <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-muted-foreground/30 text-muted-foreground">
              Private
            </Badge>
          )}
        </div>
      </div>
      
      {description && (
        <p className="github-text text-sm mb-3 line-clamp-2 flex-1">
          {description}
        </p>
      )}
      
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs px-2 py-0.5 bg-[hsl(var(--github-accent-emphasis)/0.1)] text-[hsl(var(--github-accent-emphasis))] border-[hsl(var(--github-accent-emphasis)/0.2)] hover:bg-[hsl(var(--github-accent-emphasis)/0.2)]"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}
      
      <div className="flex items-center justify-between text-xs github-text mt-auto">
        <div className="flex items-center space-x-4">
          {language && (
            <div className="flex items-center">
              <Circle 
                className="repo-language-dot" 
                style={{ color: languageColor }} 
                fill="currentColor"
              />
              <span>{language}</span>
            </div>
          )}
          
          {stars > 0 && (
            <div className="flex items-center space-x-1 hover:text-[hsl(var(--github-link))] transition-colors cursor-pointer">
              <Star className="w-3 h-3" />
              <span>{stars}</span>
            </div>
          )}
          
          {forks > 0 && (
            <div className="flex items-center space-x-1 hover:text-[hsl(var(--github-link))] transition-colors cursor-pointer">
              <GitFork className="w-3 h-3" />
              <span>{forks}</span>
            </div>
          )}
        </div>
        
        <span className="text-muted-foreground">Updated {updatedAt}</span>
      </div>
    </div>
  );
}