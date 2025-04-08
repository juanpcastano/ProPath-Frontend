import styles from "./Title.module.css";

interface TitleProps {
  name: string;
  description: string;
  state: string;
  totalHours: number;
  maxHours: number;
  totalBudget: number;
  handleSendPath: () => void;
  handleUnsendPath: () => void;
}

const Title = ({
  name,
  description,
  state,
  totalHours,
  maxHours,
  totalBudget,
  handleSendPath,
  handleUnsendPath,
}: TitleProps) => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.title}>
        <h1 className={styles.noMarginTop}>{name}</h1>
        <p className={styles.description}>{description}</p>
        <p>
          Horas Totales: {totalHours}/{maxHours}
        </p>
        <p>Presupuesto Total: ${totalBudget}</p>
      </div>

      {state == "R" && (
        <button
          onClick={() => {
            handleSendPath();
          }}
          className={`${styles.button} ${
            totalHours >= maxHours ? "dark-gradient-primary" : styles.inactive
          }`}
        >
          <p className={styles.text}>
            {totalHours >= maxHours
              ? "Enviar path a mi coach"
              : "Completa las horas necesarias"}
          </p>
        </button>
      )}

      {state == "M" && (
        <button
          onClick={() => {
            handleUnsendPath();
          }}
          className={`${styles.button} ${"dark-gradient-secondary"}`}
        >
          <p className={styles.text}>Cancelar Envío</p>
        </button>
      )}
    </div>
  );
};
export default Title;
