import type { ITodo } from "@/graphql";

import styles from "./TaskSummary.module.scss";

export const TaskSummary = ({ todo }: { todo: ITodo }) =>  {
  return (
    <article className={styles.detailsCard}>
      <div className={styles.detailsTopline}>
        <p className={styles.eyebrow}>TASK DETAILS</p>
        <span
          className={`${styles.statusBadge} ${todo.completed ? styles.complete : styles.open}`}
        >
          {todo.completed ? "Completed" : "In progress"}
        </span>
      </div>
      <h1 className={styles.title}>{todo.title}</h1>
      <p className={styles.description}>
        {todo.completed
          ? "This task is complete. Nice work."
          : "Keep moving forward at your own pace."}
      </p>
      {todo.user && (
        <div className={styles.owner}>
          <span className={styles.ownerAvatar} aria-hidden="true">
            {todo.user.name.slice(0, 1).toUpperCase()}
          </span>
          <div>
            <span className={styles.ownerLabel}>Project owner</span>
            <span className={styles.ownerName}>{todo.user.name}</span>
          </div>
        </div>
      )}
    </article>
  );
}
