import { useState } from "react";
import { UserInfo } from "../../models/user.model";
import { ApiCallAddUser } from "../../services/apiUserService";
import styles from "./AddUser.module.css";

const AddUser = () => {
  const [error, setError] = useState();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const user: UserInfo = {
          id: formData.get("id") as string,
          name: formData.get("name") as string,
          idType: formData.get("idType") as string,
          birthDate: formData.get("birthdate") as string,
          city: formData.get("city") as string,
          email: formData.get("email") as string,
          country: formData.get("country") as string,
          pathId: 0,
          profilePictureUrl: "", // Ajusta esto según necesites
          role: formData.get("role") as string,
        };
        console.log(user);
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
        <h1>Añadir Nuevo Usuario</h1>
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
              <label className={styles.label} htmlFor="id">
                Número de identificación
              </label>
              <div className={styles.idContainer}>
                <input
                  className={styles.input}
                  type="number"
                  id="id"
                  name="id"
                  autoComplete="off"
                  required
                />
                <select 
                  className={`${styles.select} ${styles.idTypeSelect}`}
                  id="idType"
                  name="idType"
                >
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
                name="email"
                type="email"
                autoComplete="off"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="city">
                Ciudad
              </label>
              <select className={styles.select} id="city" name="city" required>
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
                name="birthdate"
                type="date"
                autoComplete="off"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="country">
                País
              </label>
              <select className={styles.select} id="country" name="country" required>
                <option value="Colombia">Colombia</option>
                <option value="México">México</option>
                <option value="Argentina">Argentina</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="role">
                Rol
              </label>
              <select className={styles.select} id="role" name="role" required>
                <option value="Profesional">Profesional</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>
            <button
              type="submit"
              className={`${styles.button} dark-gradient-primary `}
            >
              <p className={styles.text}>Añadir Usuario</p>
            </button>
            {error && (
              <p className={`${styles.text} ${styles.error}`}>{error}</p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};
export default AddUser;