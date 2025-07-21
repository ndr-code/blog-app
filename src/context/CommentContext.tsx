'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

interface CommentDialogContextType {
  open: boolean;
  postId: string | null;
  openModal: (postId: string) => void;
  closeModal: () => void;
}

const CommentDialogContext = createContext<
  CommentDialogContextType | undefined
>(undefined);

export const useCommentDialog = () => {
  const ctx = useContext(CommentDialogContext);
  if (!ctx)
    throw new Error('useCommentDialog must be used within CommentProvider');
  return ctx;
};

export const CommentProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [postId, setPostId] = useState<string | null>(null);

  const openModal = (id: string) => {
    setPostId(id);
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
    setPostId(null);
  };

  return (
    <CommentDialogContext.Provider
      value={{ open, postId, openModal, closeModal }}
    >
      {children}
    </CommentDialogContext.Provider>
  );
};
