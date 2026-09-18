/**
 * The site header: brand, routes, theme toggle, accent picker and the admin
 * menu.
 *
 * Also the only place the accent palette is chosen, which is why the picker
 * lives here rather than under Settings: it is a look-at-it-while-you-change-it
 * control, and the header is visible on every page.
 *
 * @module app
 */

import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { COLOR_PALETTES, applyColorPalette } from "@/lib/colorPalettes";
import { useTheme } from "@/providers/ThemeProvider";
import { Dialog, DialogContent } from '@/components/ui/dialog';

function ColorPaletteSelector() {
  const { resolvedTheme } = useTheme();
  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem('color-palette');
    return saved ? parseInt(saved) : 0;
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    applyColorPalette(COLOR_PALETTES[selected], resolvedTheme);
    localStorage.setItem('color-palette', String(selected));
  }, [selected, resolvedTheme]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <button
          className={`w-7 h-7 rounded-full border-2 border-border flex items-center justify-center focus:outline-none transition-all duration-200 ml-2 ${open ? 'ring-2 ring-primary' : ''}`}
          style={{ background: COLOR_PALETTES[selected][resolvedTheme].primary }}
          title="Change color palette"
          onClick={() => setOpen(true)}
          aria-label="Change color palette"
        >
          <span className="w-4 h-4 rounded-full" style={{ background: COLOR_PALETTES[selected][resolvedTheme].accent }} />
        </button>
        <DialogContent>
          <DialogTitle className="text-lg font-semibold mb-2">Select Color Palette</DialogTitle>
          <div className="p-4">
            <div className="flex flex-wrap gap-3">
              {COLOR_PALETTES.map((palette, idx) => (
                <button
                  key={palette.name}
                  className={`w-10 h-10 rounded-full border-2 border-border flex items-center justify-center focus:outline-none transition-all duration-200 ${selected === idx ? 'ring-2 ring-primary' : ''}`}
                  style={{ background: palette[resolvedTheme].primary }}
                  title={palette.name}
                  onClick={() => { setSelected(idx); setOpen(false); }}
                  aria-label={palette.name}
                >
                  <span className="w-5 h-5 rounded-full" style={{ background: palette[resolvedTheme].accent }} />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Github,
  User,
  BookOpen,
  LogOut,
  LogIn,
  Settings,
  ChevronDown,
  Menu,
  X,
  UserCircle,
  Rocket,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
import { useSiteSettings } from "@/hooks/usePortfolioData";
import { ThemeToggle } from "@/components/ThemeToggle";

// Import logo images
import logoDark from "@/assets/adk_dev_logo_dark.png"; // For light mode
import logoLight from "@/assets/adk_dev_logo_light.png"; // For dark mode  
import { DialogTitle } from "@radix-ui/react-dialog";

export function Navigation() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { isAdmin } = useAdmin();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const getUserInitials = (username: string) => {
    return username
      .split(/[.\s_-]/)
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2) || username.slice(0, 2).toUpperCase();
  };

  const navItems = [
    { path: "/", label: "Overview", icon: User },
    { path: "/projects", label: "Projects", icon: Github },
    { path: "/blog", label: "Blog", icon: BookOpen },
    { path: "/contact", label: "Contact", icon: UserCircle },
  ];

  const { settings } = useSiteSettings();

  const adminItems = [
    { type: 'internal' as const, path: '/settings', label: 'Site Settings', icon: Settings },
    ...(settings.admin_quick_links || []).map((link) => ({
      type: 'external' as const,
      path: link.url,
      label: link.label,
      icon: Rocket,
    })),
  ];

  const isAdminPath = (path: string) => {
    return adminItems.some(item => item.path === path);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex items-center justify-between h-16 w-full">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 flex-shrink-0 group">
              {/* Responsive Logo - full size on desktop, medium on tablet, small on mobile */}
              <div className="relative h-20 md:h-24 lg:h-28 w-auto max-w-56 md:max-w-64 lg:max-w-72 overflow-hidden rounded-lg flex items-center justify-center bg-transparent">
                <img
                  src={logoDark}
                  alt="ADK Dev Logo"
                  className="h-full w-auto object-contain object-center dark:opacity-0"
                  style={{ imageRendering: 'auto' }}
                />
                <img
                  src={logoLight}
                  alt="ADK Dev Logo"
                  className="absolute inset-0 h-full w-auto object-contain object-center opacity-0 dark:opacity-100"
                  style={{ imageRendering: 'auto' }}
                />
              </div>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden min-w-0 flex-1 justify-center md:flex md:gap-3 lg:gap-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`group relative inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out rounded-lg ${isActive
                      ? "text-primary bg-primary/10 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }`}
                  >
                    <Icon className={`w-4 h-4 mr-2 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-105"
                      }`} />
                    {item.label}
                    {/* Animated underline */}
                    <span className={`absolute bottom-0 left-1/2 h-0.5 bg-primary transition-all duration-300 ease-out ${isActive
                      ? "w-3/4 -translate-x-1/2"
                      : "w-0 -translate-x-1/2 group-hover:w-1/2"
                      }`} />
                  </Link>
                );
              })}

              {/* Desktop Admin Dropdown Menu */}
              {isAdmin && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`group relative inline-flex items-center px-3 py-2 text-sm font-medium transition-all duration-300 ease-in-out rounded-lg ${isAdminPath(location.pathname)
                        ? "text-primary bg-primary/10 shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                        }`}
                    >
                      <Settings className={`w-4 h-4 mr-2 transition-transform duration-300 ${isAdminPath(location.pathname) ? "scale-110 rotate-90" : "group-hover:scale-105 group-hover:rotate-45"
                        }`} />
                      Admin
                      <ChevronDown className={`w-3 h-3 ml-1 transition-transform duration-300 ${isAdminPath(location.pathname) ? "rotate-180" : "group-hover:rotate-180"
                        }`} />
                      {/* Animated underline */}
                      <span className={`absolute bottom-0 left-1/2 h-0.5 bg-primary transition-all duration-300 ease-out ${isAdminPath(location.pathname)
                        ? "w-3/4 -translate-x-1/2"
                        : "w-0 -translate-x-1/2 group-hover:w-1/2"
                        }`} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48 animate-in slide-in-from-top-2 duration-300">
                    {adminItems.map((item) => {
                      const Icon = item.icon;
                      const itemClassName = "group flex items-center w-full px-3 py-2 rounded-md transition-all duration-200 hover:bg-accent hover:text-accent-foreground";
                      const content = (
                        <>
                          <Icon className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-105" />
                          <span className="transition-transform duration-200 group-hover:translate-x-1">
                            {item.label}
                          </span>
                        </>
                      );

                      return (
                        <DropdownMenuItem key={item.path} asChild>
                          {item.type === 'internal' ? (
                            <Link to={item.path} className={itemClassName}>{content}</Link>
                          ) : (
                            <a href={item.path} target="_blank" rel="noopener noreferrer" className={itemClassName}>
                              {content}
                            </a>
                          )}
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </nav>

            {/* Right side - Desktop & Mobile */}
            {/* shrink-0 and a tighter gap: at exactly 768px the nav links and
                this cluster both appear, and together they were 70px wider than
                the viewport. The palette picker waits for lg, where there is
                room for it. */}
            <div className="flex shrink-0 items-center gap-2 lg:gap-3">

              {/* Theme Toggle - Desktop only */}
              <div className="hidden md:block">
                <ThemeToggle />
              </div>
              {/* Color Palette Selector - wide screens only */}
              <div className="hidden lg:block">
                <ColorPaletteSelector />
              </div>

              {/* Desktop User Section */}
              <div className="hidden md:block">
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-10 w-10 rounded-full p-0 hover:bg-accent transition-colors duration-200"
                      >
                        <Avatar className="h-9 w-9 border-2 border-transparent hover:border-primary/20 transition-colors duration-200">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                            {getUserInitials(user.username)}
                          </AvatarFallback>
                        </Avatar>
                        {isAdmin && (
                          <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                            A
                          </span>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 animate-in slide-in-from-top-2 duration-300">
                      <div className="flex items-center justify-start gap-2 p-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                            {getUserInitials(user.username)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.username}</p>
                          {isAdmin && (
                            <p className="text-xs text-primary font-medium">Administrator</p>
                          )}
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Button
                          variant="ghost"
                          onClick={handleSignOut}
                          className="w-full justify-start text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button variant="ghost" size="sm" asChild>
                    <Link
                      to="/auth"
                      className="group relative inline-flex items-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-all duration-300 ease-in-out rounded-lg"
                    >
                      <LogIn className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-1" />
                      Sign In
                      <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 bg-primary transition-all duration-300 ease-out group-hover:w-1/2" />
                    </Link>
                  </Button>
                )}
              </div>

              {/* Mobile User Section - Hidden */}
              <div className="hidden">
                {/* Profile icon hidden in mobile - user info is now in mobile menu */}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2"
                  aria-label="Toggle mobile menu"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
                  ) : (
                    <Menu className="w-6 h-6 transition-transform duration-300" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen
            ? "max-h-screen opacity-100 pb-4"
            : "max-h-0 opacity-0 overflow-hidden"
            }`}>
            <div className="w-full max-h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden scrollbar-hide">
              <nav className="flex flex-col space-y-2 pt-4 border-t border-border w-full">
              {/* Mobile Profile Section */}
              {user && (
                <div className="px-4 py-3 mb-2 bg-accent/20 rounded-lg mx-2 overflow-hidden">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-10 w-10 border-2 border-primary/20 flex-shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                        {getUserInitials(user.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <div className="flex items-center gap-2 min-w-0">
                        <p className="text-sm font-medium leading-none truncate flex-1 min-w-0">{user.username}</p>
                        {isAdmin && (
                          <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full flex-shrink-0">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 truncate">Welcome back!</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 flex-shrink-0"
                      onClick={closeMobileMenu}
                      asChild
                    >
                      <Link to="/">
                        <Settings className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`group flex items-center px-4 py-3 text-sm font-medium transition-all duration-300 ease-in-out rounded-lg ${isActive
                      ? "text-primary bg-primary/10 shadow-sm border-l-4 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:border-l-4 hover:border-accent"
                      }`}
                  >
                    <Icon className={`w-5 h-5 mr-3 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-105"
                      }`} />
                    {item.label}
                    {isActive && (
                      <span className="ml-auto w-2 h-2 bg-primary rounded-full animate-pulse" />
                    )}
                  </Link>
                );
              })}

              {/* Mobile Theme and Color Settings */}
              <div className="pt-2 border-t border-border">
                <div className="px-4 py-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Appearance
                  </span>
                </div>
                <div className="flex items-center justify-between px-6 py-3">
                  <span className="text-sm font-medium text-muted-foreground">Theme</span>
                  <ThemeToggle />
                </div>
                <div className="flex items-center justify-between px-6 py-3">
                  <span className="text-sm font-medium text-muted-foreground">Color Palette</span>
                  <ColorPaletteSelector />
                </div>
              </div>

              {/* Mobile Admin Section */}
              {isAdmin && (
                <div className="pt-2 border-t border-border">
                  <div className="px-4 py-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Admin Panel
                    </span>
                  </div>
                  {adminItems.map((item) => {
                    const Icon = item.icon;
                    const itemClassName = "group flex items-center px-6 py-3 text-sm font-medium transition-all duration-300 ease-in-out rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/50 hover:border-l-4 hover:border-accent";
                    const content = (
                      <>
                        <Icon className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:scale-105" />
                        {item.label}
                      </>
                    );

                    return item.type === 'internal' ? (
                      <Link key={item.path} to={item.path} onClick={closeMobileMenu} className={itemClassName}>
                        {content}
                      </Link>
                    ) : (
                      <a
                        key={item.path}
                        href={item.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={closeMobileMenu}
                        className={itemClassName}
                      >
                        {content}
                      </a>
                    );
                  })}
                </div>
              )}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Take-me-up, sitting just above Cherry (who stands in the bottom-right
          corner) so the two don't overlap. */}
      <button
        onClick={handleScrollToTop}
        className="fixed bottom-44 right-6 z-40 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/80 transition-all duration-200 flex items-center justify-center"
        aria-label="Take Me Up"
      >
        <Rocket className="w-6 h-6" style={{ transform: 'rotate(-45deg)' }} />
      </button>
    </>
  );
}