import styles from "./Title.module.css"

interface TitleProps {
    name: string,
    description: string,
    totalHours: number,
    minHours: number,
    totalBudget: number,
    handleSendPath: () => void;
}

const Title = ({name,description,totalHours, minHours,totalBudget, handleSendPath}:TitleProps) => {
  return (
    <div className={styles.mainContainer}>
          <div className={styles.title}>
            <h1 className={styles.noMarginTop}>{name}</h1>
            <p className={styles.description}>{description}</p>
            <p>
              Horas Totales: {totalHours}/{minHours}
            </p>
            <p>Presupuesto Total: ${totalBudget}</p>
          </div>
          <button
            onClick={() => {
              handleSendPath();
            }}
            className={`${styles.button} ${
              totalHours >= minHours ? "dark-gradient-primary" : styles.inactive
            }`}
          >
            <p className={styles.text}>
              {totalHours >= minHours
                ? "Enviar path a mi coach"
                : "Completa el mínimo de horas"}
            </p>
          </button>
        </div>
  )
}
export default Title