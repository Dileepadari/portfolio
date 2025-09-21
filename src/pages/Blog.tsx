import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Heart,
  Share,
  BookOpen,
  Tag,
  TrendingUp
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  category: string;
  likes: number;
  comments: number;
  featured: boolean;
  status: 'published' | 'draft';
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Building Scalable React Applications: Lessons from Production",
    excerpt: "After building several large-scale React applications, I've learned valuable lessons about architecture, state management, and performance optimization.",
    content: "Full blog post content here...",
    publishedAt: "2024-01-15",
    readTime: 8,
    tags: ["React", "Architecture", "Performance", "Best Practices"],
    category: "Frontend Development",
    likes: 124,
    comments: 18,
    featured: true,
    status: 'published'
  },
  {
    id: "2",
    title: "My Journey from Computer Science Student to Full-Stack Developer",
    excerpt: "Sharing my experiences, challenges, and learnings during my B.Tech in Computer Science and how I transitioned into professional development.",
    content: "Full blog post content here...",
    publishedAt: "2024-01-10",
    readTime: 6,
    tags: ["Career", "Education", "Personal Growth", "Computer Science"],
    category: "Personal",
    likes: 89,
    comments: 25,
    featured: true,
    status: 'published'
  },
  {
    id: "3",
    title: "Understanding Machine Learning Algorithms: A Practical Guide",
    excerpt: "Deep dive into popular ML algorithms with practical examples and implementation details for computer science students.",
    content: "Full blog post content here...",
    publishedAt: "2024-01-05",
    readTime: 12,
    tags: ["Machine Learning", "Python", "Algorithms", "Data Science"],
    category: "Data Science",
    likes: 156,
    comments: 32,
    featured: false,
    status: 'published'
  },
  {
    id: "4",
    title: "Optimizing Database Queries: PostgreSQL Performance Tips",
    excerpt: "Practical tips and techniques for optimizing database performance in real-world applications.",
    content: "Full blog post content here...",
    publishedAt: "2023-12-28",
    readTime: 10,
    tags: ["Database", "PostgreSQL", "Performance", "Backend"],
    category: "Backend Development",
    likes: 78,
    comments: 14,
    featured: false,
    status: 'published'
  }
];

const categories = ["All", "Frontend Development", "Backend Development", "Data Science", "Personal", "Career"];

export function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTag, setSelectedTag] = useState("");

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesTag = selectedTag === "" || post.tags.includes(selectedTag);
    
    return matchesSearch && matchesCategory && matchesTag && post.status === 'published';
  });

  const featuredPosts = blogPosts.filter(p => p.featured && p.status === 'published');
  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags)));
  const popularTags = allTags.slice(0, 10); // Most popular tags

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Blog & Articles
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sharing insights, experiences, and lessons learned from my journey in software development
          </p>
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              Featured Articles
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <FeaturedPostCard key={post.id} post={post} />
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filters */}
            <div className="mb-6">
              <div className="flex flex-col gap-4 mb-4">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search blog posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                  <TabsList className="bg-muted border-border flex-wrap h-auto p-1">
                    {categories.map((category) => (
                      <TabsTrigger 
                        key={category} 
                        value={category} 
                        className="text-muted-foreground data-[state=active]:text-foreground data-[state=active]:bg-background text-sm"
                      >
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {/* Blog Posts */}
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-muted-foreground text-lg">No blog posts found matching your criteria</div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Popular Tags */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-foreground flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-primary" />
                    Popular Tags
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <Button
                        key={tag}
                        variant={selectedTag === tag ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setSelectedTag(selectedTag === tag ? "" : tag)}
                        className="h-7 px-2 text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card className="bg-card border-border">
                <CardHeader className="pb-3">
                  <h3 className="text-lg font-semibold text-foreground">Blog Stats</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Posts</span>
                      <span className="text-foreground font-semibold">{blogPosts.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Likes</span>
                      <span className="text-foreground font-semibold">
                        {blogPosts.reduce((sum, post) => sum + post.likes, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Comments</span>
                      <span className="text-foreground font-semibold">
                        {blogPosts.reduce((sum, post) => sum + post.comments, 0)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface FeaturedPostCardProps {
  post: BlogPost;
}

function FeaturedPostCard({ post }: FeaturedPostCardProps) {
  return (
    <Card className="bg-card border-border hover:border-primary transition-all duration-200 ring-1 ring-yellow-400/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2">
          <Badge className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20">Featured</Badge>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            {post.category}
          </Badge>
        </div>
        <h3 className="text-xl font-semibold text-primary hover:underline cursor-pointer mb-2">
          {post.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {post.excerpt}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="bg-transparent text-muted-foreground border-border text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{post.readTime} min read</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{post.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              <span>{post.comments}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface BlogPostCardProps {
  post: BlogPost;
}

function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Card className="bg-card border-border hover:border-primary transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            {post.category}
          </Badge>
          {post.featured && (
            <Badge className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20">Featured</Badge>
          )}
        </div>
        <h3 className="text-xl font-semibold text-primary hover:underline cursor-pointer mb-2">
          {post.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {post.excerpt}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="bg-transparent text-muted-foreground border-border text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{post.readTime} min read</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{post.likes}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              <span>{post.comments}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Share className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}