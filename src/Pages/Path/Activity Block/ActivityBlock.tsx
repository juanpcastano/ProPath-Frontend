import { useState } from "react";
import { Activity } from "../../../models/path.model";
import styles from "./ActivityBlock.module.css";

interface ActivityProps {
  editingActivity: string;
  activity: Activity;
  pathId: string;
  actionable: boolean;
  handleDelete: (id: string) => void;
  handleSetEditingActivity: (id: string) => void;
  handleCommentSubmit: (id: string, comment: string) => void;
  handleSaveEdit: (updatedActivity: Activity) => void;
}

const ActivityBlock = ({
  editingActivity,
  activity,
  pathId,
  actionable,
  handleDelete,
  handleCommentSubmit,
  handleSetEditingActivity,
  handleSaveEdit,
}: ActivityProps) => {
  const today = new Date().toISOString().split("T")[0];
  const [editingInitialDate, setEditingInitialDate] = useState(today);
  const [state, setState] = useState<string>(activity.state)

  if (state == "E") {
    setState("En Curso")
  }
  if (state == "P") {
    setState("Pendiente")
  }
  if (state == "C") {
    setState("En Curso")
  }
  if (editingActivity != activity.id) {
    return (
      <div className={`${styles.mainContainer}`} key={activity.id}>
        <div className={styles.separator}>
          <div className={styles.infoContainer}>
            <h2 className={`${styles.noMarginTop}`}>{activity.name}</h2>
            <p>{activity.description}</p>
            <p>{"Horas Necesarias: " + activity.hours}</p>
            <p>{"Presupuesto: $" + activity.budget}</p>
            <p>
              {"Fecha De Inicio: " +
                new Date(activity.initialDate).toLocaleDateString()}
            </p>
            <p>
              {"Fecha De Finalización: " +
                new Date(activity.finalDate).toLocaleDateString()}
            </p>
            <p className={styles.noMarginBot}>
              <strong>{"Estado: " + state}</strong>
            </p>
          </div>
          {actionable && (
            <div className={styles.buttonsContainer}>
              <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
              />
              <span
                className={`material-symbols-outlined ${styles.deleteButton} ${styles.button}`}
                onClick={() => handleDelete(activity.id)}
              >
                delete
              </span>
              <span
                className={`material-symbols-outlined ${styles.editButton} ${styles.button}`}
                onClick={() => {
                  handleSetEditingActivity(activity.id);
                }}
              >
                edit
              </span>
            </div>
          )}
        </div>
        {activity.comments && activity.comments.length > 0 && (
          <div className={styles.commentsContainer}>
            {activity.comments.map((comment) => (
              <>
                <hr className={`${styles.noMarginTop} ${styles.noMarginBot}`} />
                <div key={comment.id} className={styles.comment}>
                  <p>
                    <strong>{comment.authorName}</strong>: {comment.message}
                  </p>
                  <small>{new Date(comment.date).toLocaleString()}</small>
                </div>
              </>
            ))}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const commentMessage = formData.get("comment") as string;
            handleCommentSubmit(activity.id, commentMessage);
            e.currentTarget.reset();
          }}
        >
          <textarea
            name="comment"
            id="comment"
            placeholder="Añade un comentario..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                const commentMessage = e.currentTarget.value;
                handleCommentSubmit(activity.id, commentMessage);
                e.currentTarget.value = "";
              }
            }}
          ></textarea>
        </form>
      </div>
    );
  } else {
    return (
      <>
        <div
          className={`${styles.mainContainer}`}
          key={`editing-${activity.id}`}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const updatedActivity: Activity = {
                id: activity.id,
                name: formData.get("name") as string,
                description: formData.get("description") as string,
                hours: Number(formData.get("hours")),
                initialDate: new Date(formData.get("initialDate") as string),
                finalDate: new Date(formData.get("finalDate") as string),
                budget: Number(formData.get("budget")),
                state: activity.state,
                pathId: pathId,
                comments: activity.comments,
              };
              handleSaveEdit(updatedActivity);
              e.currentTarget.reset();
            }}
          >
            <div className={styles.formGroup}>
              <label htmlFor="name">Nombre:</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                autoComplete="off"
                defaultValue={activity.name}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Descripción:</label>
              <textarea
                id="description"
                name="description"
                required
                autoComplete="off"
                defaultValue={activity.description}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="initialDate">Fecha Inicial:</label>
                <input
                  className={styles.activityInputDate}
                  type="date"
                  id="initialDate"
                  name="initialDate"
                  required
                  defaultValue={
                    new Date(activity.initialDate).toISOString().split("T")[0]
                  }
                  onChange={(e) => setEditingInitialDate(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="finalDate">Fecha Final:</label>
                <input
                  className={styles.activityInputDate}
                  type="date"
                  id="finalDate"
                  name="finalDate"
                  min={editingInitialDate}
                  defaultValue={
                    new Date(activity.finalDate).toISOString().split("T")[0]
                  }
                  required
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="hours">Horas:</label>
                <input
                  type="number"
                  id="hours"
                  name="hours"
                  min="0"
                  defaultValue={activity.hours}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="budget">Presupuesto:</label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  min="0"
                  defaultValue={activity.budget}
                  required
                />
              </div>
            </div>
            <div className={`${styles.formGroup}`}>
              <div className={styles.editButtons}>
                <button
                  type="submit"
                  className={`${styles.button} dark-gradient-primary`}
                >
                  Guardar
                </button>
                <button
                  className={`${styles.button} dark-gradient-secondary`}
                  onClick={() => {
                    handleSetEditingActivity("");
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      </>
    );
  }
};
export default ActivityBlock;
