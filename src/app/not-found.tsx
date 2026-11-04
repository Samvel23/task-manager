// src/app/not-found.tsx
import Link from "next/link";
import styles from "./styles/not-found.module.scss";

const NotFound = () => {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.scene}>
        <div className={`${styles.cloud} ${styles.cloud1}`} />
        <div className={`${styles.cloud} ${styles.cloud2}`} />
        <div className={`${styles.mountain} ${styles.mountain1}`} />
        <div className={`${styles.mountain} ${styles.mountain2}`} />
        <div className={`${styles.hill} ${styles.hill1}`} />
        <div className={`${styles.hill} ${styles.hill2}`} />
        <div className={styles.path} />
      </div>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Page Not Found</h2>
        <p className={styles.description}>
          The page or task resource you are looking for does not exist.
        </p>
        <Link href="/" className={styles.homeButton}>
          <span className={styles.buttonIcon}>&#x2B06;</span>
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
