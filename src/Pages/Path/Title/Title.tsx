import { useState } from "react";
import styles from "./Title.module.css";
import { useDispatch } from "react-redux";
import { updatePath } from "../../../Redux/States/path";

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
  const [editing, setEditing] = useState(false);
  const dispatch = useDispatch();
  return (
    <div className={styles.mainContainer}>
      <div className={styles.title}>
        {!editing ? (
          <div className={styles.separator}>
            <div className={styles.titleContainer}>
              <h1 className={styles.noMarginTop}>{name}</h1>
              <p className={styles.description}>{description}</p>
            </div>
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
          </div>
        ) : (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                dispatch(
                  updatePath({
                    name: formData.get("name") as string,
                    description: formData.get("description") as string,
                    state: "R",
                  })
                );
                setEditing(false)
                e.currentTarget.reset();
              }}
            >
              <div className={styles.formContainer}>
                <input
                  type="text"
                  placeholder="Nombre De tu path"
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
                  placeholder="Descripción de tu nuevo path"
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
                    onClick={() => {setEditing(false)}}
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
