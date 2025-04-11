import { useState } from "react";
import styles from "./AddGroup.module.css";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "../../models/routes";
import { ApiCallAddGroup } from "../../services/apiGroupsService";
import Error from "../Error/Error";

const AddGroup = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const groupInfo = {
          name: formData.get("name") as string,
          description: formData.get("description") as string,
        };
        ApiCallAddGroup(groupInfo)
          .then((res) => {
            navigate(
              PrivateRoutes.common.MY_ORGANIZATION.route + "/group/" + res.id
            );
            console.log(res);
          })
          .catch((err) => {
            setError(err.response?.data.message);
          });
        e.currentTarget.reset();
      }}
    >
      <div className={styles.mainContainer}>
        <h1>Añadir Nuevo Grupo</h1>
        <div className={styles.formContainer}>
          <div className={styles.formLayout}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="name">
                Nombre
              </label>
              <input
                className={styles.input}
                id="name"
                name="name"
                autoComplete="off"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="description">
                Descripción
              </label>
              <textarea
                className={styles.input}
                id="description"
                name="description"
                autoComplete="off"
                required
              />
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <button
            type="submit"
            className={`${styles.button} dark-gradient-primary `}
          >
            <p className={styles.text}>Añadir Grupo</p>
          </button>
        </div>
        <Error error={error} />
      </div>
    </form>
  );
};
export default AddGroup;
