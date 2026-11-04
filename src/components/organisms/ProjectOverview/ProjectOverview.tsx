import type { ITodo, IUser } from "@/graphql";

import styles from "./ProjectOverview.module.scss";
import commonStyles from "@/app/styles/dashboard-common.module.scss";

interface IProjectOverviewProps {
  users: IUser[];
  groups: Map<string | null, ITodo[]>;
}

export const ProjectOverview = ({ users, groups }: IProjectOverviewProps) => {
  return (
    <section className={styles.projectGroups} aria-labelledby="projects-title">
      <div className={styles.groupsHeader}>
        <div>
          <p className={commonStyles.eyebrow}>OVERVIEW</p>
          <h2 className={styles.groupsTitle} id="projects-title">
            Your projects
          </h2>
        </div>
        <span className={styles.mutedCaption}>Organized by owner</span>
      </div>
      <div className={styles.groupsGrid}>
        {[...groups.entries()].map(([userId, groupTodos]) => {
          const ownerName =
            users.find((user) => user.id === userId)?.name ?? "Unknown Project";

          return (
            <div key={userId ?? "unassigned"} className={styles.groupCard}>
              <div className={styles.groupHeader}>
                <span className={styles.projectAvatar} aria-hidden="true">
                  {(userId ? ownerName : "Unassigned").slice(0, 1).toUpperCase()}
                </span>
                <div>
                  <h3 className={styles.groupTitle}>
                    {userId ? ownerName : "Unassigned"}
                  </h3>
                  <span className={styles.groupCount}>
                    {groupTodos.length} task{groupTodos.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <div className={styles.groupTasks}>
                {groupTodos.slice(0, 3).map((todo) => (
                  <div key={todo.id} className={styles.miniTask}>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      readOnly
                      aria-label={todo.title}
                      className={styles.miniCheckbox}
                    />
                    <span className={styles.miniTitle}>{todo.title}</span>
                  </div>
                ))}
                {groupTodos.length > 3 && (
                  <span className={styles.groupMore}>
                    +{groupTodos.length - 3} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {groups.size === 0 && (
        <p className={styles.emptyProjects}>
          No projects have tasks for this account yet.
        </p>
      )}
    </section>
  );
}
