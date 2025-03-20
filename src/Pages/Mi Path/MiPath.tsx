import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AppStore } from "../../Redux/store";

import { useDispatch } from "react-redux";
import { updateUser } from "../../Redux/States/user";
import styles from "./MiPath.module.css";
import { generateUUID } from "../../services/uuidGenerator";
import { Activity, Comment } from "../../models/path.model";
import { emptyPathState, updatePath } from "../../Redux/States/path";

const MiPath = () => {
  const pathData = useSelector((store: AppStore) => store.path);
  const userData = useSelector((store: AppStore) => store.user);
  const dispatch = useDispatch();
  const [activities, setActivities] = useState<Activity[]>(
    pathData?.activities || []
  );

  const today = new Date().toISOString().split("T")[0];
  const [totalHours, setTotalHours] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [minHours, _] = useState(import.meta.env.VITE_MIN_HOURS | 36);
  const [initialDate, setInitialDate] = useState(today);
  const [editingInitialDate, setEditingInitialDate] = useState(today);
  const [editingActivity, setEditingActivity] = useState("");

  const sendPath = () => {};
  const handleDelete = (id: string) => {
    setActivities(activities.filter((activity) => activity.id !== id));
    dispatch(
      updatePath({
        activities: activities.filter((activity) => activity.id !== id),
      })
    );
  };

  const handleSaveEdit = (updatedActivity: Activity) => {
    console.log(updatedActivity);
    setActivities(
      activities.map((activity) =>
        activity.id == updatedActivity.id ? updatedActivity : activity
      )
    );
    dispatch(
      updatePath({
        activities: activities.map((activity) =>
          activity.id == updatedActivity.id ? updatedActivity : activity
        ),
      })
    );
    setEditingActivity("");
  };

  const addActivity = (activity: Activity) => {
    setActivities([...activities, activity]);
  };

  const handleCommentSubmit = (activityId: string, commentMessage: string) => {
    if (!commentMessage.trim()) return;

    const updatedActivities = activities.map((activity) => {
      if (activity.id === activityId) {
        const newComment: Comment = {
          id: generateUUID(),
          authorName: userData.name,
          message: commentMessage,
          date: new Date(),
        };
        const updatedComments = activity.comments
          ? [...activity.comments, newComment]
          : [newComment];

        return {
          ...activity,
          comments: updatedComments,
        };
      }
      return activity;
    });

    setActivities(updatedActivities);
    dispatch(updatePath({ activities: updatedActivities }));
  };

  useEffect(() => {
    setTotalHours(
      activities.reduce((sum, activity) => sum + activity.hours, 0)
    );
    setTotalBudget(
      activities.reduce((sum, activity) => sum + activity.budget, 0)
    );
    dispatch(updatePath({ activities: activities }));
  }, [activities]);

  if (JSON.stringify(pathData) === JSON.stringify(emptyPathState)) {
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
                    state: "propuesta",
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
            <p className={styles.description}>{pathData.description}</p>
            <p>
              Horas Totales: {totalHours}/{minHours}
            </p>
            <p>Presupuesto Total: ${totalBudget}</p>
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

        {activities.map((activity, _) => {
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
                      <strong>{"Estado: " + activity.state}</strong>
                    </p>
                  </div>
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
                        setEditingActivity(activity.id);
                      }}
                    >
                      edit
                    </span>
                  </div>
                </div>
                {activity.comments && activity.comments.length > 0 && (
                  <div className={styles.commentsContainer}>
                    {activity.comments.map((comment) => (
                      <>
                        <hr
                          className={`${styles.noMarginTop} ${styles.noMarginBot}`}
                        />
                        <div key={comment.id} className={styles.comment}>
                          <p>
                            <strong>{comment.authorName}</strong>:{" "}
                            {comment.message}
                          </p>
                          <small>
                            {new Date(comment.date).toLocaleString()}
                          </small>
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
                  className={`${styles.activityform} ${styles.mainContainer}`}
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
                        initialDate: new Date(
                          formData.get("initialDate") as string
                        ),
                        finalDate: new Date(
                          formData.get("finalDate") as string
                        ),
                        budget: Number(formData.get("budget")),
                        state: "Pendiente",
                        pathId: pathData.id,
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
                            new Date(activity.initialDate)
                              .toISOString()
                              .split("T")[0]
                          }
                          onChange={(e) =>
                            setEditingInitialDate(e.target.value)
                          }
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
                            new Date(activity.finalDate)
                              .toISOString()
                              .split("T")[0]
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
                            setEditingActivity("");
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
                comments: [],
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
