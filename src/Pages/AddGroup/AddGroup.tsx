import { useEffect, useState } from "react";
import styles from "./AddGroup.module.css";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "../../models/routes";
import {
  ApiCallAddGroup,
  ApiCallAddUserGroup,
  group,
} from "../../services/apiGroupsService";
import Error from "../Error/Error";
import { ApiCallUsers } from "../../services/apiUsersService ";

const AddGroup = () => {
  const [error, setError] = useState("");
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    ApiCallUsers()
      .then((res) => {
        setAvailableUsers(res);
      })
      .catch((err) => {
        setError(err.response?.data.message);
      });
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const groupInfo: group = {
          name: formData.get("name") as string,
          description: formData.get("description") as string,
        };
        ApiCallAddGroup(groupInfo)
          .then((res) => {
            ApiCallAddUserGroup({
              userId: formData.get("coachId") as string,
              groupId: res.id,
              role: "M",
            })
              .then(() => {
                navigate(
                  PrivateRoutes.common.MY_ORGANIZATION.route +
                    "/group/" +
                    res.id
                );
              })
              .catch((err) => {
                setError(err.response?.data.message);
              });
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
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="description">
                Mentor
              </label>
              <select
                className={styles.input}
                id="coachId"
                name="coachId"
                required
              >
                <option value="">Seleccione un usuario</option>
                {availableUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
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
