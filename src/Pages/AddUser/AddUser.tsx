import { useState } from "react";
import { UserInfo } from "../../models/user.model";
import { ApiCallAddUser } from "../../services/apiUserService";
import styles from "./AddUser.module.css";

const AddUser = () => {

  const [error, setError] = useState()

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const user: UserInfo = {
          id: formData.get("id") as string,
          name: formData.get("id") as string,
          idType: formData.get("id") as string,
          birthDate: formData.get("id") as string,
          city: formData.get("id") as string,
          email: formData.get("id") as string,
          country: formData.get("id") as string,
          pathId: 0,
          profilePictureUrl: formData.get("id") as string,
          role: formData.get("id") as string,
        };
        ApiCallAddUser(user)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            setError(err.message);
          });
        e.currentTarget.reset();
      }}
    >
      <div className={styles.mainContainer}>
        <div className={styles.formContainer}>
          <div className={styles.formLayout}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="name">
                Nombre
              </label>
              <input
                className={styles.input}
                id="name"
                autoComplete="off"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="id">
                Número de identificación
              </label>
              <div className={styles.idContainer}>
                <input
                  className={styles.input}
                  type="number"
                  id="id"
                  autoComplete="off"
                  required
                />
                <select className={`${styles.select} ${styles.idTypeSelect}`}>
                  <option value="CC">C.C.</option>
                  <option value="CE">C.E.</option>
                </select>
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="email">
                Email
              </label>
              <input
                className={styles.input}
                id="email"
                type="email"
                autoComplete="off"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="city">
                Ciudad
              </label>
              <select className={styles.select} id="city" required>
                <option value="Bogotá">Bogotá</option>
                <option value="Medellín">Medellín</option>
                <option value="Cali">Cali</option>
                <option value="Barranquilla">Barranquilla</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="birthdate">
                Fecha de nacimiento
              </label>
              <input
                className={styles.input}
                id="birthdate"
                type="date"
                autoComplete="off"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="country">
                País
              </label>
              <select className={styles.select} id="country" required>
                <option value="Colombia">Colombia</option>
                <option value="México">México</option>
                <option value="Argentina">Argentina</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="role">
                Rol
              </label>
              <select className={styles.select} id="role" required>
                <option value="México">Profesional</option>
                <option value="Colombia">Administrador</option>
              </select>
            </div>
            <button
              type="submit"
              className={`${styles.button} dark-gradient-primary `}
            >
              <p className={styles.text}>Añadir Usuario</p>
            </button>
            {error && <p className={`${styles.text} ${styles.error}`}>{error}</p>}
          </div>
        </div>
      </div>
    </form>
  );
};
export default AddUser;
