import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Link as LinkIcon, X, Loader2, FileText } from "lucide-react";
import { adminApi } from "@/lib/adminApi";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadFieldProps {
  label?: string;
  value?: string;
  fallbackUrl?: string;
  onChange: (url: string) => void;
  /** "images" gets a preview thumbnail; "documents" (PDFs, certificates) gets a file-link instead. */
  fileType?: "images" | "documents";
}

/**
 * A single field for "give this a URL, or upload a file to get one" -
 * uploads go through the admin Edge Function (which holds the Oracle
 * storage secret), never directly from the browser.
 */
export function ImageUploadField({ label, value, fallbackUrl, onChange, fileType = "images" }: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputId = useRef(`file-input-${Math.random().toString(36).slice(2, 9)}`).current;
  const { toast } = useToast();

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;

    try {
      setUploading(true);
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const url = await adminApi.upload(file, {
        fileType,
        fileName: `${crypto.randomUUID()}-${sanitizedName}`,
      });
      onChange(url);
      toast({ title: "Uploaded", description: "File uploaded successfully." });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const previewSrc = value || fallbackUrl;

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}

      <div className="flex items-center gap-3">
        {fileType === "images" && previewSrc ? (
          <img
            src={previewSrc}
            alt={label || "Uploaded image"}
            loading="lazy"
            decoding="async"
            className="w-14 h-14 rounded-md object-cover border border-border shrink-0"
          />
        ) : fileType === "documents" && value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 rounded-md border border-border shrink-0 flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
          >
            <FileText className="w-6 h-6" />
          </a>
        ) : (
          <div className="w-14 h-14 rounded-md border border-dashed border-border shrink-0 flex items-center justify-center text-muted-foreground text-xs">
            None
          </div>
        )}

        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex gap-2">
            <div className="relative inline-flex">
              <input
                ref={fileInputRef}
                type="file"
                accept={fileType === "images" ? "image/*" : "image/*,.pdf,.doc,.docx"}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                disabled={uploading}
                onChange={handleFileSelected}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                tabIndex={-1}
                className="pointer-events-none"
              >
                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                {uploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowUrlInput((prev) => !prev)}
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Or paste URL
            </Button>
            {value && (
              <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {showUrlInput && (
            <Input
              value={value || ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="text-sm"
            />
          )}
        </div>
      </div>
    </div>
  );
}
