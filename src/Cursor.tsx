import styles from './Cursor.module.css';

export function Cursor() {
  return (
    <>
      <div className={styles.cursor}>
        <span className={styles.bar} />
        <span className={`${styles.bar} ${styles.rotated}`} />
      </div>
    </>
  );
}
