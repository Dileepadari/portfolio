import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Github, 
  User, 
  FolderGit2, 
  BookOpen, 
  Calendar,
  FileText,
  LogOut,
  LogIn,
  Clock
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navigation() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  
  const handleSignOut = async () => {
    await signOut();
  };

  const navItems = [
    { path: "/", label: "Overview", icon: User },
    { path: "/repositories", label: "Repositories", icon: FolderGit2 },
    { path: "/projects", label: "Projects", icon: Github },
    { path: "/blog", label: "Blog", icon: BookOpen },
    { path: "/timeline", label: "Timeline", icon: Clock, adminOnly: true },
    { path: "/schedule", label: "Schedule", icon: Calendar, adminOnly: true },
    { path: "/resume", label: "Resume", icon: FileText },
  ];

  // Filter nav items based on admin status
  const visibleNavItems = navItems.filter(item => 
    !item.adminOnly || (item.adminOnly && isAdmin)
  );

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <nav className="flex space-x-8">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:border-b-2 hover:border-border"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                  {item.adminOnly && <span className="ml-1 text-xs bg-primary text-primary-foreground px-1 rounded">Admin</span>}
                </Link>
              );
            })}
          </nav>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Welcome, {user.email}
                  {isAdmin && <span className="ml-1 text-xs bg-primary text-primary-foreground px-1 rounded">Admin</span>}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/auth" className="text-muted-foreground hover:text-foreground">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}