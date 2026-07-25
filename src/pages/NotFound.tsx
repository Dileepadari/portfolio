import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Code, Coffee, Bug, Music, Pizza, Zap, Flame } from "lucide-react";

export default function NotFound() {
  const location = useLocation();
  const [isAnimating, setIsAnimating] = useState(false);
  const [bubbleTransform, setBubbleTransform] = useState("rotate(0deg)");

  useEffect(() => {
    setIsAnimating(true);
  }, [location.pathname]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const deltaX = (mouseX - centerX) / rect.width;
    const deltaY = (mouseY - centerY) / rect.height;

    const rotateY = deltaX * 15; // Max 15 degrees
    const rotateX = -deltaY * 10; // Max 10 degrees
    const rotate = deltaX * 5; // Base rotation

    setBubbleTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotate(${rotate}deg)`);
  };

  const handleMouseLeave = () => {
    setBubbleTransform("rotate(0deg)");
  };

  const codeSnippets = [
    "console.log('Lost in the matrix!');",
    "if (page.exists()) { return page; } else { return '404'; }",
    "// TODO: Find this page",
    "function findPage() { return 'Still searching...'; }",
    "while(true) { code(); sleep(); repeat(); }",
  ];

  const [currentSnippet, setCurrentSnippet] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSnippet((prev) => (prev + 1) % codeSnippets.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [codeSnippets.length]);

  const persona = [
    { icon: Coffee, label: "Drinking coffee", delay: "0s" },
    { icon: Bug, label: "Fixing bugs", delay: "0.5s" },
    { icon: Music, label: "Listening to lo-fi", delay: "1s" },
    { icon: Pizza, label: "Ordering pizza", delay: "1.5s" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Elements - same accent color as the rest of the
          site (tracks whichever color palette is active) instead of a fixed
          hue, so this page doesn't visually break away from the theme. */}
      <div className="absolute inset-0">
        {/* Floating code symbols */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-primary/20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              fontSize: `${Math.random() * 20 + 10}px`,
            }}
          >
            {['</>', '{}', '[]', '()', '&&', '||', '=>', '++'][Math.floor(Math.random() * 8)]}
          </div>
        ))}

        {/* Binary rain effect */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`binary-${i}`}
            className="absolute text-muted-foreground/20 animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`,
            }}
          >
            {Math.random() > 0.5 ? '1' : '0'}
          </div>
        ))}
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Comic-style 404 */}
          <div className="relative mb-8">
            <h1 className={`text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 ${isAnimating ? 'animate-bounce' : ''}`}>
              404
            </h1>
            {/* Comic book style effects */}
            <div className="absolute -top-4 -right-4 text-primary animate-spin">
              <Zap className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-2 -left-4 text-destructive animate-pulse">
              <Flame className="w-10 h-10" />
            </div>
            <div className="absolute top-1/2 -right-8 text-primary animate-bounce">
              <Code className="w-6 h-6" />
            </div>
          </div>

          {/* Comic speech bubble */}
          <div
            className="relative bg-card border border-border rounded-3xl p-6 mb-8 shadow-2xl transition-transform duration-300 ease-out cursor-pointer"
            style={{ transform: bubbleTransform }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[20px] border-r-[20px] border-t-[20px] border-l-transparent border-r-transparent border-t-card"></div>
            <div className="absolute -bottom-[19px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[22px] border-r-[22px] border-t-[22px] border-l-transparent border-r-transparent border-t-border -z-10"></div>

            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              WHOOPS! Lost in Cyberspace!
            </h2>
            <p className="text-lg text-foreground/90 mb-4 font-semibold">
              I LOVE CODING but even I can't find this page!
            </p>
            <p className="text-md text-muted-foreground italic">
              Looks like this route got deleted in a git rebase gone CRAZY!
            </p>
          </div>

          {/* Animated code snippet */}
          <div className="bg-muted rounded-lg p-4 mb-8 font-mono text-left border border-border">
            <div className="flex items-center mb-2">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-destructive rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="ml-4 text-muted-foreground text-sm">terminal.js</span>
            </div>
            <div className="text-foreground">
              <span className="text-primary">$</span> {codeSnippets[currentSnippet]}
              <span className="animate-pulse">|</span>
            </div>
          </div>

          {/* Crazy developer persona */}
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              <Code className="w-16 h-16 text-foreground animate-bounce" />
            </div>
            <p className="text-xl text-foreground font-bold mb-2">
              Meanwhile, the developer is probably:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-lg">
              {persona.map(({ icon: Icon, label, delay }) => (
                <span
                  key={label}
                  className="bg-secondary text-secondary-foreground px-4 py-2 rounded-full animate-pulse flex items-center gap-2 border border-border"
                  style={{ animationDelay: delay }}
                >
                  <Icon className="w-4 h-4 text-primary" /> {label}
                </span>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <Button onClick={() => window.location.href = '/'} size="lg">
              <Home className="w-4 h-4" />
              Return Home
            </Button>
            <Button onClick={() => window.history.back()} variant="outline" size="lg">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>

          {/* Fun footer */}
          <div className="mt-12 text-muted-foreground">
            <p className="text-sm italic">
              "There are only 10 types of people: those who understand binary and those who don't...
              and apparently those who can't find pages!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
