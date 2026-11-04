// src/app/loading.tsx
import styles from "./styles/loading.module.scss";

const Loading = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinnerWrapper}>
        <div className={styles.spinner} />
      </div>
      <p className={styles.loadingText}>Loading TaskFlow</p>
      <p className={styles.loadingSubtext}>Preparing your dashboard&hellip;</p>
    </div>
  );
};

export default Loading;
