import { useState } from "react";
import styles from "./AddGroup.module.css";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "../../models/routes";
import { ApiCallAddGroup, groupMember } from "../../services/apiGroupsService";

const AddGroup = () => {
  const [error, setError] = useState();
  const [members, setMembers] = useState<groupMember[]>([]);
  const navigate = useNavigate();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const groupInfo = {
          name: formData.get("name") as string,
          members: members
        };
        ApiCallAddGroup(groupInfo)
          .then((res) => {
            navigate(
              PrivateRoutes.common.MY_ORGANIZATION.route +
                "/Group/" +
                res.id
            );
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
            {/* <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="role">
                Rol
              </label>
              <select className={styles.select} id="role" name="role" required>
                <option value="P">Profesional</option>
                <option value="A">Administrador</option>
              </select>
            </div> */}
          </div>
        </div>
        {members.map((member,index)=>{return<div className={styles.member}></div>})}
        <div className={styles.buttonContainer}>
          <button
            type="submit"
            className={`${styles.button} dark-gradient-primary `}
          >
            <p className={styles.text}>Añadir Grupo</p>
          </button>
          {error && <p className={`${styles.text} ${styles.error}`}>{error}</p>}
        </div>
      </div>
    </form>
  );
};
export default AddGroup;
