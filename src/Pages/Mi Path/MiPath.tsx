import { useSelector } from "react-redux";
import { useState } from "react";
import { AppStore } from "../../Redux/store";

import { useDispatch } from "react-redux";
import { updateUser } from "../../Redux/States/user";
import styles from "./MiPath.module.css";

import { Activity, Path } from "../../models/path.model";

const MiPath = () => {
  const path: Path = {
    id: "0",
    name: "Path de mejora profesional",
    description: "path buenaso",
    state: "path buenaso",
    totalBudget: 0,
    totalHours: 0,
    activities: [],
  };
  const dispatch = useDispatch();
  const userState = useSelector((store: AppStore) => store.user);
  const [activities, setActivities] = useState<Activity[]>(path.activities);

  function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
  const crearPath = () => {
    let pathId = generateUUID();

    dispatch(updateUser({ pathId: pathId }));
  };

  const addActivity = (activity: Activity) => {
    setActivities([...activities, activity]);
    console.log(activities);
  };

  if (!userState.pathId) {
    return (
      <>
        <div className={styles.container}>
          <p className={styles.label}>
            Parece ser que no tienes un path registrado, crea uno y añade
            actividades
          </p>
          <button
            onClick={() => {
              crearPath();
            }}
            className={`${styles.button} dark-gradient-green `}
          >
            <p className={styles.text}>Crear Path</p>
          </button>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className={styles.mainContainer}>
          <div className={styles.title}>
            <h1>{path.name}</h1>
          </div>

          <hr />

          {activities.map((Activity, key) => {
            let ParsedKey = key+1
            return (
              <div className={styles.activityContainer}>
                <h1>{"Actividad " + ParsedKey + " "}</h1>
                <h1>{Activity.name}</h1>
                <p>{"Descripción: " + Activity.description}</p>
                <p>{"Horas Necesarias: " + Activity.hours}</p>
                <p>{"Presupuesto: " + Activity.budget}</p>
                <p>{"Fecha De Inicio: " + Activity.initialDate}</p>
                <p>{"Fecha De Finalización: " + Activity.finalDate}</p>
                <p>
                  <strong>{"Estado: " + Activity.state}</strong>
                </p>
              </div>
            );
          })}

          <hr />
          <div className={styles.activityform}>
            <h2>Añadir Actividad</h2>
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
                  state: formData.get("state") as string,
                  pathId: userState.pathId,
                };
                addActivity(newActivity);
                e.currentTarget.reset();
              }}
            >
              <div className={styles.formGroup}>
                <label htmlFor="name">Nombre:</label>
                <input type="text" id="name" name="name" required />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="description">Descripción:</label>
                <input id="description" name="description" required />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="hours">Horas:</label>
                <input type="number" id="hours" name="hours" min="0" required />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="initialDate">Fecha Inicial:</label>
                <input
                  type="date"
                  id="initialDate"
                  name="initialDate"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="finalDate">Fecha Final:</label>
                <input type="date" id="finalDate" name="finalDate" required />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="budget">Presupuesto:</label>
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  min="0"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="state">Estado:</label>
                <select id="state" name="state" required>
                  <option value="pendiente">Pendiente</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="completada">Completada</option>
                </select>
              </div>

              <button type="submit" className={styles.button}>
                Añadir Actividad
              </button>
            </form>
          </div>
        </div>
      </>
    );
  }
};

export default MiPath;
