import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Edit, FileText } from "lucide-react";
import { usePersonalInfo } from "@/hooks/usePortfolioData";

export function ReadmeCard() {
  const { data: personalInfo } = usePersonalInfo();

  if (!personalInfo) {
    return (
      <Card className="github-card">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const title = `Hi, I'm ${personalInfo.name}! 👋`;
  const content = `
**💻 Passionate about Coding** | **🎨 Exploring Design Thinking** | **📚 IIIT Hyderabad Student** | **🌏 Joomla! CMS @GSoC'25**

**🎓 B.Tech in Computer Science** | **📅 7th Semester** | **🌍 From ${personalInfo.location}**

---

### 🔍 What I'm Up To

I'm diving deep into **Design Thinking** and also enhancing my skills in **coding**. I thrive on bringing creative ideas to life and solving complex problems through innovative design and technology.

### 🌱 Current Focus

Actively learning and applying **Design Thinking** methodologies while pursuing my academic journey at **IIIT Hyderabad**. Always on the lookout for opportunities to expand my knowledge and skills!

### 🤝 Looking for Collaborations

I'm eager to collaborate on **projects** that blend innovative thinking with practical coding skills. Together, we can make a significant impact!

### 📫 Let's Connect

Feel free to reach out to me via [email](mailto:${personalInfo.email})—I'm open to interesting conversations and new opportunities!
  `;
  return (
    <Card className="github-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm github-text">README.md</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
        >
          <Edit className="w-3 h-3" />
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="prose prose-invert max-w-none">
          <h2 className="github-heading text-xl font-bold mb-4 flex items-center">
            {title}
          </h2>
          
          <div className="space-y-4 github-text text-sm leading-relaxed">
            {content.split('\n\n').map((paragraph, index) => {
              if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**')) {
                return (
                  <div key={index} className="flex flex-wrap gap-2 my-3">
                    {paragraph.split(' | ').map((badge, badgeIndex) => (
                      <span
                        key={badgeIndex}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[hsl(var(--github-accent-emphasis)/0.1)] text-[hsl(var(--github-accent-emphasis))] border border-[hsl(var(--github-accent-emphasis)/0.2)]"
                      >
                        {badge.replace(/\*\*/g, '')}
                      </span>
                    ))}
                  </div>
                );
              }
              
              if (paragraph.trim().startsWith('### ')) {
                return (
                  <h3 key={index} className="github-heading text-lg font-semibold mt-6 mb-2 flex items-center">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              
              if (paragraph.trim() === '---') {
                return <hr key={index} className="my-6 border-[hsl(var(--github-border-default))]" />;
              }
              
              return (
                <p key={index} className="github-text leading-relaxed">
                  {paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>').split('<').map((part, partIndex) => {
                    if (part.includes('strong')) {
                      const content = part.split('>')[1];
                      return <strong key={partIndex} className="text-foreground font-semibold">{content}</strong>;
                    }
                    return part;
                  })}
                </p>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}