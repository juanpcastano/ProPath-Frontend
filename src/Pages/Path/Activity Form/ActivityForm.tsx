import { useState } from "react";
import { Activity } from "../../../models/path.model";
import { generateUUID } from "../../../services/uuidGenerator";
import styles from "./ActivityForm.module.css";

interface ActivityFormProps {
  pathId: string;
  availableHours: number;
  HandleAddActivity: (activity: Activity) => void;
}

const ActivityForm = ({ pathId, HandleAddActivity, availableHours }: ActivityFormProps) => {
  const today = new Date().toISOString().split("T")[0];
  const [initialDate, setInitialDate] = useState(today);
  return (
    <div className={`${styles.mainContainer}`}>
      <h2 className={styles.noMarginTop}>Añadir Actividad</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const newActivity: Activity = {
            id: generateUUID(),
            name: formData.get("name") as string,
            description: formData.get("description") as string,
            hours: Number(formData.get("hours")),
            initialDate: new Date(formData.get("initialDate") as string),
            finalDate: new Date(formData.get("finalDate") as string),
            budget: Number(formData.get("budget")),
            state: "Pendiente",
            pathId: pathId,
            comments: [],
          };
          HandleAddActivity(newActivity);
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
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Descripción:</label>
          <textarea
            id="description"
            name="description"
            required
            autoComplete="off"
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
              defaultValue={today}
              onChange={(e) => setInitialDate(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="finalDate">Fecha Final:</label>
            <input
              className={styles.activityInputDate}
              type="date"
              id="finalDate"
              name="finalDate"
              min={initialDate}
              required
            />
          </div>
        </div>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="hours">Horas:</label>
            <input type="number" id="hours" name="hours" min="0" max={availableHours} required />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="budget">Presupuesto:</label>
            <input type="number" id="budget" name="budget" min="0" required />
          </div>
        </div>
        <div className={styles.formGroup}>
          <button
            type="submit"
            className={`${styles.button} dark-gradient-primary`}
          >
            Añadir Actividad
          </button>
        </div>
      </form>
    </div>
  );
};
export default ActivityForm;
