import styles from "./Error.module.css"

const Error = ({error}:{error: string}) => {
  return (
    <div className={styles.errorContainer}>{error}</div>
  )
}
export default Error