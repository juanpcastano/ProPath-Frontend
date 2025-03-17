import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AppStore } from "../../Redux/store";

import { useDispatch } from "react-redux";
import { updateUser } from "../../Redux/States/user";
import styles from "./MiPath.module.css";
import { generateUUID } from "../../services/uuidGenerator";
import { Activity } from "../../models/path.model";
import { emptyPathState, updatePath } from "../../Redux/States/path";

const MiPath = () => {
  const pathData = useSelector((store: AppStore) => store.path);
  const userData = useSelector((store: AppStore) => store.user);
  const dispatch = useDispatch();
  const [activities, setActivities] = useState<Activity[]>(
    pathData?.activities
  );
  const today = new Date().toISOString().split("T")[0];
  const [totalHours, setTotalHours] = useState(0);
  const [minHours, _] = useState(import.meta.env.VITE_MIN_HOURS | 36);
  const [initialDate, setInitialDate] = useState(today);

  const sendPath = () => {};

  const addActivity = (activity: Activity) => {
    setActivities([...activities, activity]);
    console.log(activities);
  };

  useEffect(() => {
    setTotalHours(
      activities.reduce((sum, activity) => sum + activity.hours, 0)
    );
  }, [activities]);

  if (pathData == emptyPathState) {
    if (!userData.pathId) {
      return (
        <>
          <div className={`${styles.mainContainer} `}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                let pathId = generateUUID();
                dispatch(updateUser({ pathId: pathId }));
                dispatch(
                  updatePath({
                    name: formData.get("name") as string,
                    description: formData.get("description") as string,
                    state: "propuesta"
                  })
                );
                e.currentTarget.reset();
              }}
            >
              <div className={styles.initialForm}>
                <div className={styles.textLimiter}>
                  <p className={styles.info}>
                    Parece que aún no tienes un path registrado
                  </p>

                  <input
                    type="text"
                    placeholder="Nombre De tu path"
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
                    rows={4}
                    required
                  ></textarea>
                  <button
                    type="submit"
                    onClick={() => {}}
                    className={`${styles.button} dark-gradient-primary `}
                  >
                    <p className={styles.text}>Crear Path</p>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </>
      );
    } else {
      <div className={`${styles.mainContainer} `}>
        <h1>Ocurrió un error al encontrar la información de tu path</h1>
      </div>;
    }
  } else {
    return (
      <>
        <div className={styles.mainContainer}>
          <div className={styles.title}>
            <h1 className={styles.noMarginTop}>{pathData.name}</h1>
            <p>
              Horas Totales: {totalHours}/{minHours}
            </p>
          </div>
          <button
            onClick={() => {
              sendPath();
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

        {activities.map((Activity, _) => {
          return (
            <div className={`${styles.mainContainer} ${styles.noMarginTop}`}>
              <h2 className={`${styles.noMarginTop}`}>{Activity.name}</h2>
              <p>{Activity.description}</p>
              <p>{"Horas Necesarias: " + Activity.hours}</p>
              <p>{"Presupuesto: $" + Activity.budget}</p>
              <p>{"Fecha De Inicio: " + new Date(Activity.initialDate).toLocaleDateString()}</p>
              <p>{"Fecha De Finalización: " + new Date(Activity.finalDate).toLocaleDateString()}</p>
              <p className={styles.noMarginBot}>
                <strong>{"Estado: " + Activity.state}</strong>
              </p>
            </div>
          );
        })}
        <div className={`${styles.activityform} ${styles.mainContainer}`}>
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
                pathId: pathData.id,
              };
              addActivity(newActivity);
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
                  min={today}
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
