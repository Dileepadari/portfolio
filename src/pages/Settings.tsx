/**
 * Admin settings: site-wide strings, the contact inbox, and appearance.
 *
 * @module admin
 */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings as SettingsIcon, Plus, Trash2, Save } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import { useSiteSettings, AdminQuickLink } from "@/hooks/usePortfolioData";
import { useToast } from "@/hooks/use-toast";
import { SettingsSkeleton } from "@/components/skeletons/pages";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

export function Settings() {
  useDocumentMeta("Settings | Dileep Adari");
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { settings, loading, updateSetting } = useSiteSettings();
  const { toast } = useToast();

  const [footerText, setFooterText] = useState("");
  const [footerGithubUrl, setFooterGithubUrl] = useState("");
  const [authTitle, setAuthTitle] = useState("");
  const [authDescription, setAuthDescription] = useState("");
  const [quickLinks, setQuickLinks] = useState<AdminQuickLink[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFooterText(settings.footer_text || "");
    setFooterGithubUrl(settings.footer_github_url || "");
    setAuthTitle(settings.auth_title || "");
    setAuthDescription(settings.auth_description || "");
    setQuickLinks(settings.admin_quick_links || []);
  }, [settings]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await Promise.all([
        updateSetting("footer_text", footerText),
        updateSetting("footer_github_url", footerGithubUrl),
        updateSetting("auth_title", authTitle),
        updateSetting("auth_description", authDescription),
        updateSetting("admin_quick_links", quickLinks.filter((l) => l.label && l.url)),
      ]);
      toast({ title: "Saved", description: "Site settings updated successfully." });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save settings.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (adminLoading || loading) {
    return <SettingsSkeleton />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <SettingsIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-foreground mb-2">This page is private</h1>
          <p className="text-muted-foreground mb-6">Site settings are only available to the site owner.</p>
          <Button asChild>
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6 fade-in">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <SettingsIcon className="w-6 h-6" />
          Site Settings
        </h1>

        <Card className="bg-card border-border">
          <CardHeader>
            <h2 className="font-semibold text-foreground">Footer</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="footer_text">Footer text</Label>
              <Input id="footer_text" value={footerText} onChange={(e) => setFooterText(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="footer_github_url">Footer GitHub link</Label>
              <Input id="footer_github_url" value={footerGithubUrl} onChange={(e) => setFooterGithubUrl(e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <h2 className="font-semibold text-foreground">Sign-in page</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="auth_title">Title</Label>
              <Input id="auth_title" value={authTitle} onChange={(e) => setAuthTitle(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="auth_description">Description</Label>
              <Textarea
                id="auth_description"
                value={authDescription}
                onChange={(e) => setAuthDescription(e.target.value)}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-foreground">Admin quick links</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setQuickLinks((prev) => [...prev, { label: "", url: "" }])}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Shown in the "Admin" menu in the site header - for links to other tools you use (e.g. WorkOS).
            </p>
            {quickLinks.map((link, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={link.label}
                  onChange={(e) =>
                    setQuickLinks((prev) => prev.map((l, i) => (i === index ? { ...l, label: e.target.value } : l)))
                  }
                  placeholder="Label"
                  className="w-1/3"
                />
                <Input
                  value={link.url}
                  onChange={(e) =>
                    setQuickLinks((prev) => prev.map((l, i) => (i === index ? { ...l, url: e.target.value } : l)))
                  }
                  placeholder="https://..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuickLinks((prev) => prev.filter((_, i) => i !== index))}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button onClick={handleSave} disabled={saving} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save all settings"}
        </Button>
      </div>
    </div>
  );
}
