import type { IComment } from "@/graphql";

import styles from "./CommentCard.module.scss";

export const CommentCard = ({ comment }: { comment: IComment }) => {
  return (
    <article className={styles.card}>
      <div className={styles.authorRow}>
        <span className={styles.authorName}>{comment.name}</span>
        <span className={styles.authorEmail}>({comment.email})</span>
      </div>
      <p className={styles.body}>{comment.body}</p>
    </article>
  );
}
