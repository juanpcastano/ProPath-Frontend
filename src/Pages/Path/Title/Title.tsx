import { useState } from "react";
import styles from "./Title.module.css";

interface TitleProps {
  pathId: string;
  name: string;
  description: string;
  state: string;
  totalHours: number;
  maxHours: number;
  pathState: string;
  coachId?: string;
  loading?: boolean;
  totalBudget: number;
  isMyPath: boolean;
  amICoachOfThisPath: boolean;
  handleSendPath: () => void;
  handleUnsendPath: () => void;
  handleApprovePath: () => void;
  handleRejectPath: () => void;
  handleEditTitle: ({
    id,
    name,
    description,
  }: {
    id: string;
    name: string;
    description: string;
  }) => void;
  actionable: boolean;
}

const Title = ({
  pathId,
  name,
  description,
  state,
  totalHours,
  maxHours,
  pathState,
  coachId,
  loading,
  totalBudget,
  isMyPath,
  amICoachOfThisPath,
  handleSendPath,
  handleUnsendPath,
  handleApprovePath,
  handleRejectPath,
  handleEditTitle,
  actionable,
}: TitleProps) => {
  const [editing, setEditing] = useState(false);
  return (
    <div className={styles.mainContainer}>
      <div className={styles.title}>
        {!editing ? (
          <div className={styles.separator}>
            <div className={styles.titleContainer}>
              <h1 className={styles.noMarginTop}>{name}</h1>
              <p className={styles.description}>{description}</p>
            </div>

            {actionable && (
              <>
                <link
                  rel="stylesheet"
                  href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
                />
                <span
                  className={`material-symbols-outlined ${styles.editButton} ${styles.button}`}
                  onClick={() => {
                    setEditing(true);
                  }}
                >
                  edit
                </span>
              </>
            )}
          </div>
        ) : (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const path = {
                  id: pathId,
                  name: formData.get("name") as string,
                  description: formData.get("description") as string,
                };
                setEditing(false);
                handleEditTitle(path);
              }}
            >
              <div className={styles.formContainer}>
                <input
                  type="text"
                  placeholder="Nombre de tu path"
                  defaultValue={name}
                  className={styles.titleInput}
                  id="name"
                  name="name"
                  required
                  autoComplete="off"
                ></input>
                <textarea
                  name="description"
                  id="description"
                  placeholder="Descripción de tu Path"
                  defaultValue={description}
                  rows={4}
                  required
                ></textarea>
                <div className={styles.buttonsContainer}>
                  <button
                    type="submit"
                    className={`${styles.button} dark-gradient-primary `}
                  >
                    <p className={styles.text}>Guardar</p>
                  </button>
                  <button
                    className={`${styles.button} dark-gradient-secondary`}
                    onClick={() => {
                      setEditing(false);
                    }}
                  >
                    <p className={styles.text}>Cancelar</p>
                  </button>
                </div>
              </div>
            </form>
          </>
        )}

        <p>
          Horas Totales: {totalHours}/{maxHours}
        </p>
        <p>Presupuesto Total: ${totalBudget}</p>
      </div>

      {state == "R" && isMyPath && (
        <button
          onClick={() => {
            setEditing(false);
            handleSendPath();
          }}
          disabled={loading || !coachId || totalHours < maxHours}
          className={`${styles.button} ${
            coachId && totalHours >= maxHours
              ? "dark-gradient-primary"
              : styles.inactive
          }`}
        >
          <p className={styles.text}>
            {!loading
              ? coachId
                ? totalHours >= maxHours
                  ? "Enviar path a mi coach"
                  : "Completa las horas necesarias"
                : "Aún no tienes un coach asignado"
              : "Cargando..."}
          </p>
        </button>
      )}
      {amICoachOfThisPath && !isMyPath && pathState == "M" && (
        <>
          <button
            className={`${styles.button} ${"dark-gradient-primary"}`}
            onClick={() => {
              handleApprovePath();
            }}
          >
            Aceptar Propuesta
          </button>
          <button
            className={`${styles.button} ${"dark-gradient-secondary"}`}
            onClick={() => {
              handleRejectPath();
            }}
          >
            Rechazar Propuesta
          </button>
        </>
      )}

      {state == "M" && isMyPath && (
        <button
          onClick={() => {
            handleUnsendPath();
          }}
          className={`${styles.button} ${"dark-gradient-secondary"}`}
        >
          <p className={styles.text}>
            {!loading ? "Cancelar Envío" : "Cargando..."}
          </p>
        </button>
      )}
    </div>
  );
};
export default Title;
