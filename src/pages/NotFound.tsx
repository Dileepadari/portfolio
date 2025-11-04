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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-purple-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating code symbols */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-green-600 dark:text-green-400 opacity-20 animate-pulse"
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
            className="absolute text-cyan-600 dark:text-cyan-300 opacity-10 animate-bounce"
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
            <h1 className={`text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 transform ${isAnimating ? 'animate-bounce' : ''}`}
                style={{ textShadow: '3px 3px 0px #000, -1px -1px 0px #000, 1px -1px 0px #000, -1px 1px 0px #000' }}>
              404
            </h1>
            {/* Comic book style effects */}
            <div className="absolute -top-4 -right-4 text-yellow-500 dark:text-yellow-300 text-2xl animate-spin">
              <Zap className="w-8 h-8" />
            </div>
            <div className="absolute -bottom-2 -left-4 text-red-500 dark:text-red-400 text-3xl animate-pulse">
              <Flame className="w-10 h-10" />
            </div>
            <div className="absolute top-1/2 -right-8 text-blue-600 dark:text-blue-400 text-xl animate-bounce">
              <Code className="w-6 h-6" />
            </div>
          </div>

          {/* Comic speech bubble */}
          <div 
            className="relative bg-gray-50 dark:bg-white rounded-3xl p-6 mb-8 shadow-2xl border-4 border-gray-300 dark:border-black transition-transform duration-300 ease-out cursor-pointer"
            style={{ transform: bubbleTransform }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[20px] border-r-[20px] border-t-[20px] border-l-transparent border-r-transparent border-t-gray-50 dark:border-t-white"></div>
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[22px] border-r-[22px] border-t-[22px] border-l-transparent border-r-transparent border-t-gray-300 dark:border-t-black"></div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-black mb-4"
                style={{ textShadow: '2px 2px 0px #888' }}>
              WHOOPS! Lost in Cyberspace!
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-800 mb-4 font-semibold">
              I LOVE CODING but even I can't find this page!
            </p>
            <p className="text-md text-gray-600 dark:text-gray-600 italic">
              Looks like this route got deleted in a git rebase gone CRAZY!
            </p>
          </div>

          {/* Animated code snippet */}
          <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 mb-8 font-mono text-left border-2 border-green-600 dark:border-green-400 shadow-lg shadow-green-600/20 dark:shadow-green-400/20">
            <div className="flex items-center mb-2">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="ml-4 text-gray-600 dark:text-gray-400 text-sm">terminal.js</span>
            </div>
            <div className="text-green-700 dark:text-green-400">
              <span className="text-blue-600 dark:text-blue-400">$</span> {codeSnippets[currentSnippet]}
              <span className="animate-pulse">|</span>
            </div>
          </div>

          {/* Crazy developer persona */}
          <div className="mb-8">
            <div className="flex justify-center mb-4">
              <Code className="w-16 h-16 text-gray-800 dark:text-white animate-bounce" />
            </div>
            <p className="text-xl text-gray-800 dark:text-white font-bold mb-2">
              Meanwhile, the developer is probably:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-lg">
              <span className="bg-purple-500 dark:bg-purple-600 px-4 py-2 rounded-full text-white animate-pulse flex items-center gap-2">
                <Coffee className="w-4 h-4" /> Drinking coffee
              </span>
              <span className="bg-blue-500 dark:bg-blue-600 px-4 py-2 rounded-full text-white animate-pulse flex items-center gap-2" style={{animationDelay: '0.5s'}}>
                <Bug className="w-4 h-4" /> Fixing bugs
              </span>
              <span className="bg-green-500 dark:bg-green-600 px-4 py-2 rounded-full text-white animate-pulse flex items-center gap-2" style={{animationDelay: '1s'}}>
                <Music className="w-4 h-4" /> Listening to lo-fi
              </span>
              <span className="bg-yellow-500 dark:bg-yellow-600 px-4 py-2 rounded-full text-white dark:text-black animate-pulse flex items-center gap-2" style={{animationDelay: '1.5s'}}>
                <Pizza className="w-4 h-4" /> Ordering pizza
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <Button 
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 dark:from-blue-600 dark:to-blue-700 dark:hover:from-blue-700 dark:hover:to-blue-800 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Button>
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              className="border-2 border-gray-400 dark:border-white text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white hover:text-gray-900 dark:hover:text-gray-900 font-semibold px-8 py-3 rounded-lg transition-all duration-200 hover:shadow-lg flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </div>

          {/* Fun footer */}
          <div className="mt-12 text-gray-600 dark:text-gray-300">
            <p className="text-sm italic">
              "There are only 10 types of people: those who understand binary and those who don't... 
              and apparently those who can't find pages!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
