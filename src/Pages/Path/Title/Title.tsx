import { useState } from "react";
import styles from "./Title.module.css";

interface TitleProps {
  pathId: string;
  name: string;
  authorName: string;
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
  isEditingPage: boolean;
  editable: boolean;
  aproving: boolean;
}

type PathState = "R" | "M" | "A" | "E" | "F";

const Title = ({
  pathId,
  name,
  authorName,
  description,
  state,
  totalHours,
  maxHours,
  coachId,
  loading,
  totalBudget,
  isMyPath,
  handleSendPath,
  handleUnsendPath,
  handleApprovePath,
  handleRejectPath,
  handleEditTitle,
  isEditingPage,
  editable,
  aproving,
}: TitleProps) => {
  const [editing, setEditing] = useState(false);
  const stateMap: Record<PathState, string> = {
    R: "Propuesta en desarrollo",
    M: "En espera de aprovación del coach",
    A: "En espera de aprovación del administrador",
    E: "En curso",
    F: "Finalizado",
  };
  return (
    <div className={styles.mainContainer}>
      <div className={styles.title}>
        {!editing ? (
          <div className={styles.separator}>
            <div className={styles.titleContainer}>
              <h1 className={styles.noMarginTop}>{name}</h1>
              <p className={styles.description}>{description}</p>
            </div>

            {editable && (
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
          <strong>Nombre: {authorName}</strong>
        </p>
        <p>
          <strong>Estado: {stateMap[state as PathState]}</strong>
        </p>
        <p>
          Horas Totales: {totalHours}/{maxHours}
        </p>
        <p>Presupuesto Total: ${totalBudget}</p>
      </div>

      {editable && isMyPath && (
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
      {aproving && (
        <>
          <div className={styles.aprovingButtonsContainer}>
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
          </div>
        </>
      )}

      {isEditingPage && state == "M" && (
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
