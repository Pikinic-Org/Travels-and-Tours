"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/text-field";
import { commentSchema, getFieldErrors } from "@/lib/validation";
import { cn } from "@/lib/utils";

type Comment = {
  id: string;
  name: string;
  body: string;
  createdAt: string;
};

function storageKey(slug: string) {
  return `pikinic-tt-comments-${slug}`;
}

function formatCommentDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export function CommentsSection({ slug }: { slug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(slug));
      if (raw) setComments(JSON.parse(raw));
    } catch {
      // ignore malformed/unavailable storage — comments just start empty
    }
    setReady(true);
  }, [slug]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(storageKey(slug), JSON.stringify(comments));
    } catch {
      // storage unavailable (private mode, quota) — comments still work in-memory
    }
  }, [comments, ready, slug]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fieldErrors = getFieldErrors(commentSchema, { name, body });
    if (fieldErrors) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    const comment: Comment = {
      id: `${Date.now()}`,
      name: name.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    };
    setComments((prev) => [...prev, comment]);
    setName("");
    setBody("");
  }

  if (!ready) return null;

  return (
    <div className="mt-16 border-t border-border-primary pt-10">
      <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">
        Comments{comments.length > 0 ? ` (${comments.length})` : ""}
      </h2>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <TextField
          label="Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          error={errors.name}
        />
        <div>
          <label
            htmlFor="comment-body"
            className="text-xs font-semibold uppercase tracking-widest text-text-tertiary"
          >
            Comment
          </label>
          <textarea
            id="comment-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            placeholder="Share your thoughts…"
            className={cn(
              "mt-2 w-full rounded-[2px] border bg-transparent px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600",
              errors.body ? "border-red-500" : "border-border-primary"
            )}
          />
          {errors.body && <p className="mt-1.5 text-xs text-red-600">{errors.body}</p>}
        </div>
        <Button type="submit" size="md" variant="primary">
          Post Comment
        </Button>
      </form>

      {comments.length > 0 && (
        <div className="mt-10 divide-y divide-border-primary">
          {comments.map((comment) => (
            <div key={comment.id} className="py-6 first:pt-0">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[2px] bg-green-700 text-xs font-bold uppercase text-neutral-0">
                  {comment.name.slice(0, 1)}
                </span>
                <div>
                  <p className="text-sm font-semibold text-text-primary">{comment.name}</p>
                  <p className="text-xs text-text-tertiary">{formatCommentDate(comment.createdAt)}</p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{comment.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
