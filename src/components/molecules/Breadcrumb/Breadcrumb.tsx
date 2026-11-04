import Link from "next/link";
  
import styles from "./Breadcrumb.module.scss";

export const Breadcrumb = ({ taskId }: { taskId: string }) => {
  return (
    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
      <ol className={styles.items}>
        <li className={styles.item}>
          <Link href="/" className={styles.link}>
            Home
          </Link>
        </li>
        <li className={styles.separator} aria-hidden="true">
          /
        </li>
        <li className={styles.item} aria-current="page">
          Tasks
        </li>
        <li className={styles.separator} aria-hidden="true">
          /
        </li>
        <li className={styles.current} aria-current="page">
          Task #{taskId}
        </li>
      </ol>
    </nav>
  );
};
