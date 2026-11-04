"use client";

import type { IUser } from "@/graphql";

import { Input, SubmitButton } from "@/components/atoms";

import styles from "./CommentComposer.module.scss";

interface ICommentComposerProps {
  currentUser?: IUser | null;
  action: (formData: FormData) => Promise<void>;
}

export const CommentComposer = ({
  currentUser,
  action,
}: ICommentComposerProps) => {
  return (
    <form action={action} className={styles.form}>
      <div className={styles.formRow}>
        {currentUser ? (
          <p className={styles.commentingAs}>
            Commenting as <strong>{currentUser.name}</strong>
          </p>
        ) : (
          <>
            <Input name="name" placeholder="Your name" required />
            <Input
              name="email"
              type="email"
              placeholder="Email address"
              required
            />
          </>
        )}
      </div>
      <textarea
        name="body"
        className={styles.textarea}
        placeholder="Write a comment…"
        rows={3}
        required
      />
      <p className={styles.hint}>
        Comment added optimistically — rolls back if the server fails.
      </p>
      <SubmitButton label="Add Comment" loadingLabel="Posting…" />
    </form>
  );
};
