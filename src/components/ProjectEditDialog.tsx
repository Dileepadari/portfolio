/**
 * The project editor, as a self-contained dialog.
 *
 * Lives here rather than inside the Projects page because the project detail
 * page needs the same editor: an admin reading a project's own page is exactly
 * where they notice something is wrong with it, and sending them back to the
 * grid to fix it is the kind of friction that means it never gets fixed.
 *
 * The dialog always loads the **complete** row before rendering the form. The
 * list query omits the showcase columns, so a project object taken from the
 * grid has empty galleries and no README, and saving that would write the
 * emptiness back over real content.
 */

import { useState } from "react";
import { Loader2, Save, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageUploadField } from "@/components/ImageUploadField";
import { GalleryField } from "@/components/GalleryField";
import { adminApi } from "@/lib/adminApi";
import { preventAccidentalDialogClose } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useFullProject, type Project } from "@/hooks/usePortfolioData";
import { projectCategories } from "@/lib/projectCategories";

function JsonListField({
  id,
  label,
  hint,
  value,
  error,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        className="font-mono text-xs"
        placeholder={hint}
        aria-invalid={!!error}
      />
      {error ? (
        <p className="mt-1 text-xs text-destructive">{error}</p>
      ) : (
        <p className="mt-1 text-xs text-muted-foreground">
          A JSON array. Leave blank to omit the section. Shape: <code>{hint}</code>
        </p>
      )}
    </div>
  );
}

interface ProjectEditFormProps {
  project: Project;
  onSave: (data: Partial<Project>) => void;
  onCancel: () => void;
}

export function ProjectEditForm({ project, onSave, onCancel }: ProjectEditFormProps) {
  const [formData, setFormData] = useState({
    title: project.title || '',
    slug: project.slug || '',
    tagline: project.tagline || '',
    description: project.description || '',
    github_url: project.github_url || '',
    live_url: project.live_url || '',
    demo_url: project.demo_url || '',
    docs_url: project.docs_url || '',
    image_url: project.image_url || '',
    image_url_light: project.image_url_light || '',
    hero_url: project.hero_url || '',
    hero_url_light: project.hero_url_light || '',
    overview: project.overview || '',
    problem: project.problem || '',
    architecture: project.architecture || '',
    getting_started: project.getting_started || '',
    readme: project.readme || '',
    project_role: project.project_role || '',
    timeline: project.timeline || '',
    status: project.status || '',
    language: project.language || '',
    language_color: project.language_color || '',
    featured: project.featured || false,
    is_contributed: project.is_contributed || false,
    tags: project.tags?.join(', ') || '',
    category: project.category || '',
    order_index: project.order_index || 0,
    stars: project.stars || 0,
    forks: project.forks || 0,
  });

  // The three structured lists are edited as JSON. A textarea of JSON is not a
  // lovely editor, but these are shapes with two or three keys each and the
  // alternative is three bespoke repeatable-row widgets; the parse error is
  // shown inline so a typo cannot be saved as null.
  // Galleries are ordered lists, so they are their own state rather than a
  // comma-separated string inside formData.
  const [gallery, setGallery] = useState<string[]>(project.images ?? []);
  const [galleryLight, setGalleryLight] = useState<string[]>(project.images_light ?? []);

  const [jsonFields, setJsonFields] = useState({
    features: project.features?.length ? JSON.stringify(project.features, null, 2) : '',
    metrics: project.metrics?.length ? JSON.stringify(project.metrics, null, 2) : '',
    tech_stack: project.tech_stack?.length ? JSON.stringify(project.tech_stack, null, 2) : '',
  });
  const [jsonErrors, setJsonErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Clean up list-type fields
    const parseList = (str: string) =>
      str ? str.split(',').map(s => s.trim()).filter(Boolean) : [];

    // An empty string is not the same as "no value": the detail page decides
    // whether to render a section by whether its column is null, so a blank
    // field has to become null or every section would render empty.
    const orNull = (value: string) => (value.trim() ? value : null);

    const parsed: Record<string, unknown> = {};
    const errors: Record<string, string> = {};
    for (const [key, raw] of Object.entries(jsonFields)) {
      if (!raw.trim()) {
        parsed[key] = null;
        continue;
      }
      try {
        const value = JSON.parse(raw);
        if (!Array.isArray(value)) throw new Error('must be a JSON array');
        parsed[key] = value;
      } catch (error) {
        errors[key] = error instanceof Error ? error.message : 'invalid JSON';
      }
    }
    if (Object.keys(errors).length > 0) {
      setJsonErrors(errors);
      return;
    }
    setJsonErrors({});

    const submissionData = {
      ...formData,
      ...parsed,
      tags: parseList(formData.tags),
      images: gallery.filter(Boolean),
      images_light: galleryLight.filter(Boolean),
      // Slug is what the detail page is addressed by, so derive one rather than
      // leaving the project unreachable when the field is left blank.
      slug: (formData.slug.trim() ||
        formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')) || null,
      github_url: orNull(formData.github_url),
      live_url: orNull(formData.live_url),
      demo_url: orNull(formData.demo_url),
      docs_url: orNull(formData.docs_url),
      image_url: orNull(formData.image_url),
      image_url_light: orNull(formData.image_url_light),
      hero_url: orNull(formData.hero_url),
      hero_url_light: orNull(formData.hero_url_light),
      tagline: orNull(formData.tagline),
      overview: orNull(formData.overview),
      problem: orNull(formData.problem),
      architecture: orNull(formData.architecture),
      getting_started: orNull(formData.getting_started),
      readme: orNull(formData.readme),
      project_role: orNull(formData.project_role),
      timeline: orNull(formData.timeline),
      status: orNull(formData.status),
      category: orNull(formData.category),
      language: orNull(formData.language),
      language_color: orNull(formData.language_color),
    };

    onSave(submissionData as Partial<Project>);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : type === 'number'
          ? parseInt(value) || 0
          : value,
    }));
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      {/* Title + Language */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Project Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="My Awesome Project"
            required
          />
        </div>
        <div>
          <Label htmlFor="language">Language</Label>
          <Input
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            placeholder="TypeScript"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Project description"
          rows={3}
          required
        />
      </div>

      {/* URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="github_url">GitHub URL</Label>
          <Input
            id="github_url"
            name="github_url"
            value={formData.github_url}
            onChange={handleChange}
            placeholder="https://github.com/username/repo"
          />
        </div>
        <div>
          <Label htmlFor="live_url">Live URL</Label>
          <Input
            id="live_url"
            name="live_url"
            value={formData.live_url}
            onChange={handleChange}
            placeholder="https://example.com"
          />
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Imagery. Every image is a dark/light pair and the light half is    */}
      {/* optional: leave it blank and the dark one is used in both themes,  */}
      {/* which is the right answer for a photo or a theme-neutral diagram.  */}
      {/* ---------------------------------------------------------------- */}
      <div className="rounded-lg border border-border p-4 space-y-4">
        <p className="text-sm font-medium">Imagery</p>

        {/* lg, not sm: each of these is a thumbnail plus two buttons, which
            does not fit two-across in a dialog until the viewport is wide. */}
        <div className="grid gap-4 lg:grid-cols-2">
          <ImageUploadField
            label="Card image (dark)"
            value={formData.image_url}
            onChange={(url) => setFormData(prev => ({ ...prev, image_url: url }))}
            fileType="images"
          />
          <ImageUploadField
            label="Card image (light, optional)"
            value={formData.image_url_light}
            onChange={(url) => setFormData(prev => ({ ...prev, image_url_light: url }))}
            fileType="images"
          />
          <ImageUploadField
            label="Detail banner (dark)"
            value={formData.hero_url}
            onChange={(url) => setFormData(prev => ({ ...prev, hero_url: url }))}
            fileType="images"
          />
          <ImageUploadField
            label="Detail banner (light, optional)"
            value={formData.hero_url_light}
            onChange={(url) => setFormData(prev => ({ ...prev, hero_url_light: url }))}
            fileType="images"
          />
        </div>

        <GalleryField
          label="Gallery, dark"
          value={gallery}
          onChange={setGallery}
          hint="Shown on the detail page. Every entry can be uploaded or pasted."
        />

        <GalleryField
          label="Gallery, light (optional)"
          value={galleryLight}
          onChange={setGalleryLight}
          hint="Paired to the dark gallery by position. A shorter list is fine: the missing entries fall back to their dark twin."
        />
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Showcase content. Everything here is optional, and the detail page  */}
      {/* omits the section for anything left blank rather than rendering an  */}
      {/* empty heading. Blank is a valid answer.                             */}
      {/* ---------------------------------------------------------------- */}
      <div className="rounded-lg border border-border p-4 space-y-4">
        <div>
          <p className="text-sm font-medium">Showcase: for the reader</p>
          <p className="text-xs text-muted-foreground">
            The upper half of the detail page. Someone deciding whether this project is interesting.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="slug">URL slug</Label>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="derived from the title when blank"
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Input
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              placeholder="Shipped, In progress, Archived"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="tagline">Tagline</Label>
          <Input
            id="tagline"
            name="tagline"
            value={formData.tagline}
            onChange={handleChange}
            placeholder="One line, shown under the title"
          />
        </div>

        <div>
          <Label htmlFor="overview">Overview (markdown)</Label>
          <Textarea
            id="overview"
            name="overview"
            value={formData.overview}
            onChange={handleChange}
            rows={4}
            placeholder="What it is, in a paragraph or two"
          />
        </div>

        <div>
          <Label htmlFor="problem">The problem (markdown)</Label>
          <Textarea
            id="problem"
            name="problem"
            value={formData.problem}
            onChange={handleChange}
            rows={4}
            placeholder="Why it exists. What was wrong before it."
          />
        </div>

        <JsonListField
          id="features"
          label="Features"
          hint='[{ "title": "Live dashboard", "description": "Every sensor, judged" }]'
          value={jsonFields.features}
          error={jsonErrors.features}
          onChange={(value) => setJsonFields(prev => ({ ...prev, features: value }))}
        />

        <JsonListField
          id="metrics"
          label="Headline numbers"
          hint='[{ "label": "Tests", "value": "176" }]'
          value={jsonFields.metrics}
          error={jsonErrors.metrics}
          onChange={(value) => setJsonFields(prev => ({ ...prev, metrics: value }))}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="project_role">Your role</Label>
            <Input
              id="project_role"
              name="project_role"
              value={formData.project_role}
              onChange={handleChange}
              placeholder="Sole author, Backend, Team of four"
            />
          </div>
          <div>
            <Label htmlFor="timeline">Timeline</Label>
            <Input
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              placeholder="Aug 2026 - present"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border p-4 space-y-4">
        <div>
          <p className="text-sm font-medium">Showcase: for developers</p>
          <p className="text-xs text-muted-foreground">
            The lower half, below the divider. Someone who has decided to build or read it.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="demo_url">Demo URL</Label>
            <Input
              id="demo_url"
              name="demo_url"
              value={formData.demo_url}
              onChange={handleChange}
              placeholder="https://example.com/demo"
            />
          </div>
          <div>
            <Label htmlFor="docs_url">Docs URL</Label>
            <Input
              id="docs_url"
              name="docs_url"
              value={formData.docs_url}
              onChange={handleChange}
              placeholder="https://example.com/docs"
            />
          </div>
        </div>

        <JsonListField
          id="tech_stack"
          label="Tech stack"
          hint='[{ "name": "React 18", "role": "Frontend" }]'
          value={jsonFields.tech_stack}
          error={jsonErrors.tech_stack}
          onChange={(value) => setJsonFields(prev => ({ ...prev, tech_stack: value }))}
        />

        <div>
          <Label htmlFor="architecture">Architecture (markdown)</Label>
          <Textarea
            id="architecture"
            name="architecture"
            value={formData.architecture}
            onChange={handleChange}
            rows={6}
            placeholder="How the pieces fit. A fenced code block renders as a diagram."
          />
        </div>

        <div>
          <Label htmlFor="getting_started">Getting started (markdown)</Label>
          <Textarea
            id="getting_started"
            name="getting_started"
            value={formData.getting_started}
            onChange={handleChange}
            rows={6}
            placeholder="Clone, install, run"
          />
        </div>

        <div>
          <Label htmlFor="readme">README (markdown)</Label>
          <Textarea
            id="readme"
            name="readme"
            value={formData.readme}
            onChange={handleChange}
            rows={14}
            className="font-mono text-xs"
            placeholder="Paste the project's README here"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            Rendered in full at the bottom of the detail page. Not synced from GitHub: this is the
            curated copy, so it works for contributed and private repos too.
          </p>
        </div>
      </div>

      {/* Language Color */}
      <div>
        <Label htmlFor="language_color">Language Color</Label>
        <div className="flex gap-2 items-center">
          <Input
            type="color"
            id="language_color"
            name="language_color"
            value={formData.language_color || '#3178c6'}
            onChange={handleChange}
            className="w-20 h-10 p-1 cursor-pointer"
          />
          <Input
            type="text"
            value={formData.language_color}
            onChange={handleChange}
            name="language_color"
            placeholder="#3178c6"
            className="flex-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="web, frontend, mobile"
          />
        </div>
        <div>
          <Label htmlFor="category">Project Category</Label>
          <Select
            value={formData.category || ''}
            onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {projectCategories.slice(1).map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "iot" ? "IoT & Embedded Systems" :
                    category.split(' ').map(word =>
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Order Index, Stars, Forks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="order_index">Order Index</Label>
          <Input
            type="number"
            id="order_index"
            name="order_index"
            value={formData.order_index}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="stars">Stars</Label>
          <Input
            type="number"
            id="stars"
            name="stars"
            value={formData.stars}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
        <div>
          <Label htmlFor="forks">Forks</Label>
          <Input
            type="number"
            id="forks"
            name="forks"
            value={formData.forks}
            onChange={handleChange}
            placeholder="0"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="rounded"
          />
          <Label htmlFor="featured">Featured project</Label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="is_contributed"
            name="is_contributed"
            checked={formData.is_contributed}
            onChange={handleChange}
            className="rounded"
          />
          <Label htmlFor="is_contributed">Contributed to (not owned by me)</Label>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-4">
        <Button type="submit" size="sm" className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
          Cancel
        </Button>
      </div>
    </form>
  );
}

/**
 * Loads the complete project row, then shows the form.
 */
function EditProjectLoader({
  id,
  onSave,
  onCancel,
}: {
  id: string;
  onSave: (data: Partial<Project>) => void;
  onCancel: () => void;
}) {
  const { data, loading, error } = useFullProject(id);

  if (loading || (!data && !error)) {
    return (
      <div className="space-y-3 py-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4 py-6 text-center">
        <p className="text-sm text-destructive">
          Could not load this project{error ? `: ${error}` : ""}.
        </p>
        <Button type="button" variant="outline" onClick={onCancel}>
          Close
        </Button>
      </div>
    );
  }

  return <ProjectEditForm project={data} onSave={onSave} onCancel={onCancel} />;
}

interface ProjectEditDialogProps {
  projectId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Called after a successful save, so the caller can refetch. */
  onSaved?: () => void;
}

export function ProjectEditDialog({ projectId, open, onOpenChange, onSaved }: ProjectEditDialogProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const save = async (data: Partial<Project>) => {
    if (!projectId) return;
    try {
      setSaving(true);
      await adminApi.update("projects", projectId, data);
      toast({ title: "Saved", description: "Project updated." });
      onSaved?.();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Could not save",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!projectId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto" {...preventAccidentalDialogClose}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Edit Project
            {saving && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </DialogTitle>
        </DialogHeader>
        <EditProjectLoader id={projectId} onSave={save} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
