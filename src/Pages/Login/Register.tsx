import { useDispatch } from "react-redux";
import { ApiCallRegister } from "../../services/authService";
import { registerInfo } from "../../models/registerInfo";
import { createUser } from "../../Redux/States/user";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./Login&register.module.css";
import { AxiosError } from "axios";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [Error, setError] = useState("")
  const [formData, setFormData] = useState({
    id: 0,
    idType: "",
    name: "",
    email: "",
    password: "",
    country: "",
    city: "",
    birthDate: "",
  });

  const idTypes = [
    { value: "CC", label: "C.C. - Cédula de Ciudadanía" },
    { value: "CE", label: "C.E. - Cédula de Extranjería" },
    { value: "TI", label: "T.I. - Tarjeta de Identidad" },
  ];
  const register = async (registerInfo: registerInfo) => {
    try {
      const result = await ApiCallRegister(registerInfo);
      if(result.status >= 300){
        throw result
      }
      dispatch(createUser(result.user));
      navigate("/history");
    } catch (error) {
      
      let AxiosErr = error as AxiosError;
      console.log((AxiosErr.response?.data as { message: string }).message);
      setError((AxiosErr.response?.data as { message: string }).message)
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles.loginContainer}>
      {/* Elementos decorativos */}
      <div
        className={`light-gradient-primary ${styles.blob} ${styles.topLeft}`}
      ></div>
      <div
        className={`light-gradient-primary ${styles.blob} ${styles.topRight}`}
      ></div>
      <div
        className={`light-gradient-primary ${styles.blob} ${styles.bottomLeft}`}
      ></div>
      <div
        className={`light-gradient-primary ${styles.blob} ${styles.bottomRight}`}
      ></div>

      {/* Formulario */}
      <div className={styles.loginFormContainer}>
        <h2 className={styles.title}>Registro</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="nombre_completo">Nombre Completo</label>
            <input
              type="text"
              id="nombre_completo"
              name="nombre_completo"
              value={formData.name}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <div className={styles.formRow}>
          <div className={styles.formGroup}>
              <label htmlFor="tipoIdentificacion">Tipo de documento</label>
              <select
                id="tipoIdentificacion"
                name="tipoIdentificacion"
                value={formData.idType}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione...</option>
                {idTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.value}
                  </option>
                ))}
              </select>
            </div>
            

            <div className={styles.formGroup}>
              <label htmlFor="identificacion">Número de documento</label>
              <input
                type="number"
                min="0"
                step="1"
                onKeyDown={(e) => {
                  // Prevenir la e/E
                  if (e.key === 'e' || e.key === 'E') {
                    e.preventDefault();
                  }
                  // Prevenir el punto decimal y el signo negativo
                  if (e.key === '.' || e.key === '-') {
                    e.preventDefault();
                  }
                }}
                onPaste={(e) => {
                  const text = e.clipboardData.getData('text');
                  // Prevenir pegar texto que contenga e, E, . o -
                  if (text.includes('e') || text.includes('E') || text.includes('.') || text.includes('-')) {
                    e.preventDefault();
                  }
                }}
                id="identificacion"
                name="identificacion"
                value={formData.id}
                onChange={handleChange}
                className={`${styles.input} ${styles.noarrows}`}
                required
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="correo_electronico">Email</label>
            <input
              type="email"
              id="correo_electronico"
              name="correo_electronico"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="contrasena">Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              minLength={6}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="pais">País</label>
              <input
                type="text"
                id="pais"
                name="pais"
                value={formData.country}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="ciudad">Ciudad</label>
              <input
                type="text"
                id="ciudad"
                name="ciudad"
                value={formData.city}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>
          </div>  
          <div className={styles.formGroup}>
            <label htmlFor="fecha_nacimiento">Fecha de nacimiento</label>
            <input
              type="date"
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              value={formData.birthDate}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>


          <button type="submit" className="dark-gradient-primary">
            Registrarme
          </button>
          <div className={styles.smbtandforgotcontainer}>
            <Link to="/login" className={styles.link}>
              Ya tengo cuenta
            </Link>
            {Error && <p className={styles.error}>{Error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};
export default Register;
