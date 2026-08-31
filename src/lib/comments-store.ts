import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Comment = {
  id: string;
  name: string;
  body: string;
  createdAt: string;
};

type CommentsState = {
  commentsBySlug: Record<string, Comment[]>;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  addComment: (slug: string, comment: Comment) => void;
};

export const useCommentsStore = create<CommentsState>()(
  persist(
    (set, get) => ({
      commentsBySlug: {},
      hasHydrated: false,
      setHasHydrated: (value) => set({ hasHydrated: value }),
      addComment: (slug, comment) => {
        const current = get().commentsBySlug[slug] ?? [];
        set({ commentsBySlug: { ...get().commentsBySlug, [slug]: [...current, comment] } });
      },
    }),
    {
      name: "pikinic-tt-comments",
      partialize: (state) => ({ commentsBySlug: state.commentsBySlug }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
