import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePersonalInfo } from "@/hooks/usePortfolioData";
import { useAdmin } from "@/hooks/useAdmin";
import { FileText, Edit } from "lucide-react";

export const ReadmeCard = () => {
  const { data: personalInfo } = usePersonalInfo();
  const { isAdmin } = useAdmin();

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            README.md
          </div>
          {isAdmin && (
            <Button size="sm" variant="secondary">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none dark:prose-invert">
          <h2>👋 Hi there! I'm {personalInfo?.name || "a Developer"}</h2>
          
          <p>{personalInfo?.bio || "A passionate developer building amazing things."}</p>
          
          <h3>🚀 What I'm working on</h3>
          <ul>
            <li>Building full-stack web applications</li>
            <li>Exploring new technologies and frameworks</li>
            <li>Contributing to open source projects</li>
          </ul>
          
          <h3>💻 Tech Stack</h3>
          <p>I work with modern technologies including React, TypeScript, Node.js, and more.</p>
          
          <h3>📫 How to reach me</h3>
          <p>Feel free to connect with me through any of the social links in my profile!</p>
          
          <h3>⚡ Fun fact</h3>
          <p>I love solving complex problems and turning ideas into reality through code.</p>
        </div>
      </CardContent>
    </Card>
  );
};