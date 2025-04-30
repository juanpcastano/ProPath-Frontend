import styles from "./Error.module.css";

const Error = ({ error }: { error: string | undefined }) => {
  return (
    <div className={styles.errorContainer}>
      <p className={styles.errorText}>{error}</p>
    </div>
  );
};
export default Error;
