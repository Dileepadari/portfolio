/**
 * An ordered list of image URLs, each of which can be uploaded or pasted.
 *
 * The gallery used to be one text input holding a comma-separated string, which
 * made three things impossible: seeing what you had, reordering it, and
 * removing one entry without editing a sentence-long line by hand. It also had
 * no per-entry choice between uploading a file and pasting a link, which the
 * single-image fields have had all along.
 *
 * Order is meaningful: the light gallery is paired to the dark one by position,
 * so entry n of each is the same screenshot.
 */

import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, Link as LinkIcon, Loader2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminApi } from "@/lib/adminApi";
import { useToast } from "@/hooks/use-toast";

interface GalleryFieldProps {
  label: string;
  hint?: string;
  value: string[];
  onChange: (next: string[]) => void;
}

export function GalleryField({ label, hint, value, onChange }: GalleryFieldProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const replaceAt = (index: number, url: string) =>
    onChange(value.map((v, i) => (i === index ? url : v)));

  const removeAt = (index: number) => onChange(value.filter((_, i) => i !== index));

  const move = (index: number, delta: number) => {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;
    try {
      setUploading(true);
      // Sequential, not Promise.all: the upload endpoint is a single small box
      // and a dozen parallel writes is how you find that out the hard way.
      const urls: string[] = [];
      for (const file of files) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        urls.push(await adminApi.upload(file, {
          fileType: "images",
          fileName: `${crypto.randomUUID()}-${safeName}`,
        }));
      }
      onChange([...value, ...urls]);
      toast({ title: "Uploaded", description: `${urls.length} image${urls.length === 1 ? "" : "s"} added.` });
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

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label>{label}</Label>
        <div className="flex gap-1">
          <div className="relative inline-flex">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
              onChange={handleFiles}
            />
            <Button type="button" variant="outline" size="sm" disabled={uploading} tabIndex={-1} className="pointer-events-none">
              {uploading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <Upload className="mr-2 h-3 w-3" />}
              {uploading ? "Uploading" : "Upload"}
            </Button>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange([...value, ""])}>
            <LinkIcon className="mr-2 h-3 w-3" />
            Add URL
          </Button>
        </div>
      </div>

      {value.length === 0 ? (
        <p className="rounded-md border border-dashed border-border px-3 py-4 text-center text-xs text-muted-foreground">
          No images yet. Upload files, or add a URL.
        </p>
      ) : (
        <ul className="space-y-2">
          {value.map((url, index) => (
            <li key={`${index}-${url}`} className="flex items-center gap-2">
              <span className="w-5 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                {index + 1}
              </span>
              {url ? (
                <img
                  src={url}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="h-10 w-14 shrink-0 rounded border border-border object-cover"
                />
              ) : (
                <span className="flex h-10 w-14 shrink-0 items-center justify-center rounded border border-dashed border-border text-[10px] text-muted-foreground">
                  empty
                </span>
              )}
              <Input
                value={url}
                onChange={(e) => replaceAt(index, e.target.value)}
                placeholder="https://mystorage.dileepadari.dev/images/portfolio/..."
                className="text-xs"
              />
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0"
                      aria-label="Move up" disabled={index === 0} onClick={() => move(index, -1)}>
                <ArrowUp className="h-3 w-3" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0"
                      aria-label="Move down" disabled={index === value.length - 1} onClick={() => move(index, 1)}>
                <ArrowDown className="h-3 w-3" />
              </Button>
              <Button type="button" variant="ghost" size="icon" className="h-8 w-8 shrink-0"
                      aria-label="Remove" onClick={() => removeAt(index)}>
                <X className="h-3 w-3" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
