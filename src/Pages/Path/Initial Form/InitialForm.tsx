import { generateUUID } from "../../../services/uuidGenerator";
import styles from "./InitialForm.module.css";
import { useDispatch } from "react-redux";
import { updateUser } from "../../../Redux/States/user";
import { ApiCallAddPath } from "../../../services/apiPathService";
import Error from "../../Error/Error";
import { useState } from "react";

const InitialForm = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState("");
  return (
    <>
      <div className={`${styles.mainContainer} `}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            let pathId = generateUUID();
            dispatch(updateUser({ pathId: pathId }));
            ApiCallAddPath({
              name: formData.get("name") as string,
              description: formData.get("description") as string,
            })
              .then(() => {
                window.location.reload();
              })
              .catch((err) => {
                setError(err.response?.data.message);
              });
            e.currentTarget.reset();
          }}
        >
          <div className={styles.initialForm}>
            <div className={styles.textLimiter}>
              <p className={styles.info}>
                Parece que aún no tienes un path registrado en este periodo
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
              <Error error={error} />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};
export default InitialForm;
