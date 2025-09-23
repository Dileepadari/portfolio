import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Heart,
  MessageSquare,
  Send,
  Reply,
  Trash2,
  ExternalLink,
  Copy,
  Eye
} from "lucide-react";
import { 
  BlogPost, 
  useBlogPosts, 
  useBlogComments, 
  useBlogLike,
  addBlogComment, 
  deleteBlogComment
} from "@/hooks/usePortfolioData";
import { useAuth } from "@/hooks/useAuth";
import 'highlight.js/styles/github-dark.css'; // You can change this theme

export function BlogPostView() {
  const { slug } = useParams<{ slug: string }>();
  const { data: blogPosts, loading: postsLoading } = useBlogPosts();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [newComment, setNewComment] = useState('');
  const [replyToComment, setReplyToComment] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [authorName, setAuthorName] = useState(user?.user_metadata?.full_name || '');
  const [authorEmail, setAuthorEmail] = useState(user?.email || '');
  const [submittingComment, setSubmittingComment] = useState(false);

  const { data: comments, loading: commentsLoading, refetch: refetchComments } = useBlogComments(post?.id || '');
  const { isLiked, likeCount, toggleLike, loading: likeLoading } = useBlogLike(post?.id || '');

  useEffect(() => {
    if (!postsLoading && blogPosts && slug) {
      const foundPost = blogPosts.find(p => p.slug === slug && p.published);
      setPost(foundPost || null);
    }
  }, [blogPosts, slug, postsLoading]);

  // Redirect to external link if post has one
  if (post?.external_link) {
    window.open(post.external_link, '_blank', 'noopener,noreferrer');
    return <Navigate to="/blog" replace />;
  }

  const handleAddComment = async () => {
    if (!post || !newComment.trim() || !authorName.trim()) return;

    try {
      setSubmittingComment(true);
      await addBlogComment({
        blog_post_id: post.id,
        author_name: authorName.trim(),
        author_email: authorEmail.trim() || undefined,
        content: newComment.trim(),
        user_id: user?.id,
        is_approved: true,
        parent_comment_id: undefined
      });

      setNewComment('');
      toast({ title: "Success", description: "Comment added successfully!" });
      refetchComments();
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to add comment", 
        variant: "destructive" 
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleAddReply = async (parentCommentId: string) => {
    if (!post || !replyContent.trim() || !authorName.trim()) return;

    try {
      setSubmittingComment(true);
      await addBlogComment({
        blog_post_id: post.id,
        parent_comment_id: parentCommentId,
        author_name: authorName.trim(),
        author_email: authorEmail.trim() || undefined,
        content: replyContent.trim(),
        user_id: user?.id,
        is_approved: true
      });

      setReplyContent('');
      setReplyToComment(null);
      toast({ title: "Success", description: "Reply added successfully!" });
      refetchComments();
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to add reply", 
        variant: "destructive" 
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteBlogComment(commentId);
      toast({ title: "Success", description: "Comment deleted successfully!" });
      refetchComments();
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to delete comment", 
        variant: "destructive" 
      });
    }
  };

  const handleCopyLink = async () => {
    if (!post) return;

    try {
      const url = window.location.href;
      await navigator.clipboard.writeText(url);
      toast({ title: "Success", description: "Link copied to clipboard!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to copy link", variant: "destructive" });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const estimateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (postsLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-lg">Loading blog post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Blog Post Not Found</h1>
          <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog">
            <Button className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-4 sm:p-6">
        {/* Navigation */}
        <div className="mb-6">
          <Link to="/blog">
            <Button variant="ghost" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <article className="mb-8">
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {(post.tags || []).map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
                {post.excerpt}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.created_at)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{estimateReadingTime(post.content)} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  <span>{likeCount} likes</span>
                </div>
              </div>

              {/* Engagement Actions */}
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleLike}
                  disabled={likeLoading}
                  className={`flex items-center gap-2 ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{likeCount}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{comments.length}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  title="Copy link"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.image_url && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img 
                src={post.image_url} 
                alt={post.title}
                className="w-full h-64 sm:h-80 object-cover"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </article>

        <Separator className="my-8" />

        {/* Comments Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <MessageSquare className="w-6 h-6" />
            Comments ({comments.length})
          </h2>

          {/* Add Comment Form */}
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <h3 className="text-lg font-semibold">Leave a Comment</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="authorName">Name *</Label>
                    <Input
                      id="authorName"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="authorEmail">Email (optional)</Label>
                    <Input
                      id="authorEmail"
                      type="email"
                      value={authorEmail}
                      onChange={(e) => setAuthorEmail(e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="newComment">Comment *</Label>
                  <Textarea
                    id="newComment"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows={4}
                    required
                  />
                </div>
                
                <Button 
                  onClick={handleAddComment}
                  disabled={submittingComment || !newComment.trim() || !authorName.trim()}
                  className="flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {submittingComment ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Comments List */}
          {commentsLoading ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">Loading comments...</div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">No comments yet. Be the first to comment!</div>
            </div>
          ) : (
            <div className="space-y-6">
              {comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  currentUser={user}
                  onReply={setReplyToComment}
                  onDelete={handleDeleteComment}
                  replyToComment={replyToComment}
                  replyContent={replyContent}
                  setReplyContent={setReplyContent}
                  onAddReply={handleAddReply}
                  submittingComment={submittingComment}
                  authorName={authorName}
                  authorEmail={authorEmail}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

interface CommentCardProps {
  comment: any;
  currentUser: any;
  onReply: (commentId: string | null) => void;
  onDelete: (commentId: string) => void;
  replyToComment: string | null;
  replyContent: string;
  setReplyContent: (content: string) => void;
  onAddReply: (parentCommentId: string) => void;
  submittingComment: boolean;
  authorName: string;
  authorEmail: string;
}

function CommentCard({ 
  comment, 
  currentUser, 
  onReply, 
  onDelete, 
  replyToComment, 
  replyContent, 
  setReplyContent, 
  onAddReply, 
  submittingComment,
  authorName,
  authorEmail
}: CommentCardProps) {
  const canDelete = currentUser && (currentUser.id === comment.user_id);
  const showReplyForm = replyToComment === comment.id;

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.author_name}`} />
            <AvatarFallback>{comment.author_name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="font-semibold text-foreground">{comment.author_name}</h4>
                <p className="text-xs text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReply(showReplyForm ? null : comment.id)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Reply className="w-4 h-4" />
                </Button>
                
                {canDelete && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this comment? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(comment.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
            
            <p className="text-foreground leading-relaxed mb-2">{comment.content}</p>
            
            {/* Reply Form */}
            {showReplyForm && (
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <Label htmlFor={`reply-${comment.id}`}>Reply to {comment.author_name}</Label>
                <Textarea
                  id={`reply-${comment.id}`}
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write your reply..."
                  rows={3}
                  className="mt-2"
                />
                <div className="flex justify-end gap-2 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onReply(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => onAddReply(comment.id)}
                    disabled={submittingComment || !replyContent.trim() || !authorName.trim()}
                  >
                    {submittingComment ? 'Posting...' : 'Post Reply'}
                  </Button>
                </div>
              </div>
            )}
            
            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="mt-4 space-y-4 pl-4 border-l-2 border-border">
                {comment.replies.map((reply: any) => (
                  <CommentCard
                    key={reply.id}
                    comment={reply}
                    currentUser={currentUser}
                    onReply={onReply}
                    onDelete={onDelete}
                    replyToComment={replyToComment}
                    replyContent={replyContent}
                    setReplyContent={setReplyContent}
                    onAddReply={onAddReply}
                    submittingComment={submittingComment}
                    authorName={authorName}
                    authorEmail={authorEmail}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}