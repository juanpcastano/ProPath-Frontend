import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AppStore } from "../../Redux/store";

import { useDispatch } from "react-redux";
import { updateUser } from "../../Redux/States/user";
import styles from "./MiPath.module.css";
import { generateUUID } from "../../services/uuidGenerator";
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
  const today = new Date().toISOString().split("T")[0];
  const [totalHours, setTotalHours] = useState(0)
  const [minHours, _] = useState(import.meta.env.VITE_MIN_HOURS|36)
  
  const crearPath = () => {
    let pathId = generateUUID();

    dispatch(updateUser({ pathId: pathId }));
  };

  const addActivity = (activity: Activity) => {
    setActivities([...activities, activity]);
    console.log(activities);
  };

  useEffect(()=>{
    setTotalHours(activities.reduce((sum, activity) => sum + activity.hours, 0))
  },[activities])

  if (!userState.pathId) {
    return (
      <>
        <div className={`${styles.container} ${styles.mainContainer} `}>
          <p className={styles.info}>
            Parece que aún no tienes un path registrado
          </p>
          <button
            onClick={() => {
              crearPath();
            }}
            className={`${styles.button} dark-gradient-primary `}
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
            <h1 className={styles.noMargin}>{path.name}</h1>
            <p>Horas Totales: {totalHours}/{minHours}</p>
          </div>
          <button
            onClick={() => {
              crearPath();
            }}
            className={`${styles.button} ${totalHours>=minHours?'dark-gradient-primary':styles.inactive}`}
          >
            <p className={styles.text}>{totalHours>=minHours?'Enviar path a mi coach':'Completa el mínimo de horas'}</p>
          </button>
        </div>

        {activities.map((Activity, key) => {
          let ParsedKey = key + 1;
          return (
            <div className={styles.mainContainer}>
              <h2 className={styles.noMargin}>{"Actividad " + ParsedKey + " "}</h2>
              <h2>{Activity.name}</h2>
              <p>{Activity.description}</p>
              <p>{"Horas Necesarias: " + Activity.hours}</p>
              <p>{"Presupuesto: $" + Activity.budget}</p>
              <p>{"Fecha De Inicio: " + Activity.initialDate}</p>
              <p>{"Fecha De Finalización: " + Activity.finalDate}</p>
              <p>
                <strong>{"Estado: " + Activity.state}</strong>
              </p>
            </div>
          );
        })}
        <div className={`${styles.activityform} ${styles.mainContainer}`}>
          <h2 className={styles.noMargin}>Añadir Actividad</h2>
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

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="initialDate">Fecha Inicial:</label>
                <input
                  className={styles.activityInputDate}
                  type="date"
                  id="initialDate"
                  name="initialDate"
                  min={today}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="finalDate">Fecha Final:</label>
                <input
                  className={styles.activityInputDate}
                  type="date"
                  id="finalDate"
                  name="finalDate"
                  min={today}
                  required
                />
              </div>
            </div>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="hours">Horas:</label>
                <input type="number" id="hours" name="hours" min="0" required />
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
            </div>

            {/* <div className={styles.formGroup}>
              <label htmlFor="state">Estado:</label>
              <select id="state" name="state" required>
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En Progreso</option>
                <option value="completada">Completada</option>
              </select>
            </div> */}

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
      </>
    );
  }
};

export default MiPath;
