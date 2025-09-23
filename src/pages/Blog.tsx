import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Calendar, 
  Clock, 
  MessageSquare, 
  Heart,
  BookOpen,
  Tag,
  TrendingUp,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  ExternalLink
} from "lucide-react";

import { BlogPost, useBlogPosts, addBlogPost, updateBlogPost, deleteBlogPost, useBlogEngagement } from "@/hooks/usePortfolioData";
import { useAdmin } from "@/hooks/useAdmin";

const categories = ["All", "Frontend Development", "Backend Development", "Data Science", "Personal", "Career"];

export function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  
  const { data: blogPosts, loading, error, refetch } = useBlogPosts();
  const { isAdmin } = useAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (post.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTag = selectedTag === "" || (post.tags || []).includes(selectedTag);
    
    return matchesSearch && matchesTag && post.published;
  });

  const featuredPosts = blogPosts.filter(p => p.published).slice(0, 2); // Show first 2 as featured
  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags || [])));
  const popularTags = allTags.slice(0, 10);

  const handleAddPost = async (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await addBlogPost(postData);
      toast({ title: "Success", description: "Blog post added successfully!" });
      setShowAddForm(false);
      refetch();
    } catch (error) {
      toast({ title: "Error", description: "Failed to add blog post", variant: "destructive" });
    }
  };

  const handleUpdatePost = async (id: string, updates: Partial<BlogPost>) => {
    try {
      await updateBlogPost(id, updates);
      toast({ title: "Success", description: "Blog post updated successfully!" });
      setEditingPost(null);
      refetch();
    } catch (error) {
      toast({ title: "Error", description: "Failed to update blog post", variant: "destructive" });
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deleteBlogPost(id);
      toast({ title: "Success", description: "Blog post deleted successfully!" });
      refetch();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete blog post", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-lg">Loading blog posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-lg text-red-500">Error loading blog posts: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
              Blog & Articles
            </h1>
            {isAdmin && (
              <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add New Post
              </Button>
            )}
          </div>
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
                <FeaturedPostCard key={post.id} post={post} isAdmin={isAdmin} onEdit={setEditingPost} onDelete={handleDeletePost} navigate={navigate} />
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
              </div>
            </div>

            {/* Blog Posts */}
            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <BlogPostCard key={post.id} post={post} isAdmin={isAdmin} onEdit={setEditingPost} onDelete={handleDeletePost} navigate={navigate} />
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
                      <span className="text-muted-foreground">Published Posts</span>
                      <span className="text-foreground font-semibold">
                        {blogPosts.filter(p => p.published).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Tags</span>
                      <span className="text-foreground font-semibold">
                        {allTags.length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Add/Edit Forms */}
        {showAddForm && (
          <BlogPostForm
            onSave={handleAddPost}
            onCancel={() => setShowAddForm(false)}
            allTags={allTags}
          />
        )}

        {editingPost && (
          <BlogPostForm
            post={editingPost}
            onSave={(postData) => handleUpdatePost(editingPost.id, postData)}
            onCancel={() => setEditingPost(null)}
            allTags={allTags}
          />
        )}
      </div>
    </div>
  );
}

interface FeaturedPostCardProps {
  post: BlogPost;
  isAdmin: boolean;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
  navigate: (path: string) => void;
}

function FeaturedPostCard({ post, isAdmin, onEdit, onDelete, navigate }: FeaturedPostCardProps) {
  const firstTag = post.tags?.[0] || "Uncategorized";
  
  const handleCardClick = () => {
    if (post.external_link) {
      window.open(post.external_link, '_blank', 'noopener,noreferrer');
    } else {
      navigate(`/blog/${post.slug}`);
    }
  };
  
  return (
    <Card className="bg-card border-border hover:border-primary transition-all duration-200 ring-1 ring-yellow-400/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge className="bg-yellow-400/10 text-yellow-400 border-yellow-400/20">Featured</Badge>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {firstTag}
            </Badge>
            {post.external_link && (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                External
              </Badge>
            )}
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(post);
                }}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{post.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(post.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
        <div onClick={handleCardClick} className="cursor-pointer">
          <h3 className="text-xl font-semibold text-primary hover:underline mb-2 flex items-center gap-2">
            {post.title}
            {post.external_link && <ExternalLink className="w-4 h-4" />}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {post.excerpt || "No excerpt available"}
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(post.tags || []).map((tag) => (
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
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>5 min read</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <EngagementCounts blogPostId={post.id} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface BlogPostCardProps {
  post: BlogPost;
  isAdmin: boolean;
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
  navigate: (path: string) => void;
}

function BlogPostCard({ post, isAdmin, onEdit, onDelete, navigate }: BlogPostCardProps) {
  const firstTag = post.tags?.[0] || "Uncategorized";
  
  const handleCardClick = () => {
    if (post.external_link) {
      window.open(post.external_link, '_blank', 'noopener,noreferrer');
    } else {
      navigate(`/blog/${post.slug}`);
    }
  };
  
  return (
    <Card className="bg-card border-border hover:border-primary transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {firstTag}
            </Badge>
            {post.external_link && (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20 flex items-center gap-1">
                <ExternalLink className="w-3 h-3" />
                External
              </Badge>
            )}
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(post);
                }}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
              >
                <Edit2 className="w-3 h-3" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{post.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(post.id)}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
        <div onClick={handleCardClick} className="cursor-pointer">
          <h3 className="text-xl font-semibold text-primary hover:underline mb-2 flex items-center gap-2">
            {post.title}
            {post.external_link && <ExternalLink className="w-4 h-4" />}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {post.excerpt || "No excerpt available"}
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(post.tags || []).map((tag) => (
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
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>5 min read</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <EngagementCounts blogPostId={post.id} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface BlogPostFormProps {
  post?: BlogPost;
  onSave: (postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  allTags: string[];
}

function BlogPostForm({ post, onSave, onCancel, allTags }: BlogPostFormProps) {
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [content, setContent] = useState(post?.content || "");
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [externalLink, setExternalLink] = useState(post?.external_link || "");
  const [imageUrl, setImageUrl] = useState(post?.image_url || "");
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [published, setPublished] = useState(post?.published ?? false);
  const [orderIndex, setOrderIndex] = useState(post?.order_index || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !slug.trim()) {
      return;
    }

    // For external links, content is optional
    if (!externalLink.trim() && !content.trim()) {
      return;
    }

    onSave({
      title: title.trim(),
      slug: slug.trim(),
      content: content.trim() || "External content",
      excerpt: excerpt.trim() || undefined,
      external_link: externalLink.trim() || undefined,
      image_url: imageUrl.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      published,
      order_index: orderIndex,
      images: undefined
    });
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const generateSlugFromTitle = () => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    setSlug(slug);
  };

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{post ? 'Edit Blog Post' : 'Add New Blog Post'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog post title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <div className="flex gap-2">
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="url-friendly-slug"
                  required
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generateSlugFromTitle}
                  className="whitespace-nowrap"
                >
                  Generate
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short description of the blog post"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="externalLink">External Link (Optional)</Label>
            <Input
              id="externalLink"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              placeholder="https://example.com/your-external-blog-post"
            />
            <p className="text-sm text-muted-foreground">
              If provided, clicking this blog post will redirect to this URL instead of showing internal content.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">{externalLink ? 'Content (Optional for external links)' : 'Content *'}</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog post content here..."
              rows={12}
              required={!externalLink}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Featured Image URL</Label>
            <Input
              id="imageUrl"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            
            {allTags.length > 0 && (
              <div className="mb-2">
                <Label className="text-sm text-muted-foreground">Suggested tags:</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {allTags.filter(tag => !tags.includes(tag)).slice(0, 10).map((tag) => (
                    <Button
                      key={tag}
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setTags([...tags, tag])}
                      className="h-6 px-2 text-xs"
                    >
                      + {tag}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTag(tag)}
                    className="h-4 w-4 p-0 hover:bg-transparent"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="orderIndex">Order Index</Label>
              <Input
                id="orderIndex"
                type="number"
                value={orderIndex}
                onChange={(e) => setOrderIndex(parseInt(e.target.value) || 0)}
                placeholder="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="rounded"
                />
                Published
              </Label>
              <p className="text-sm text-muted-foreground">
                {published ? "This post will be visible to visitors" : "This post will be saved as draft"}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              {post ? 'Update' : 'Create'} Post
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface EngagementCountsProps {
  blogPostId: string;
}

function EngagementCounts({ blogPostId }: EngagementCountsProps) {
  const { counts, loading } = useBlogEngagement(blogPostId);

  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Heart className="w-3 h-3" />
          <span>-</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageSquare className="w-3 h-3" />
          <span>-</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        <Heart className="w-3 h-3" />
        <span>{counts.likes}</span>
      </div>
      <div className="flex items-center gap-1">
        <MessageSquare className="w-3 h-3" />
        <span>{counts.comments}</span>
      </div>
    </div>
  );
}