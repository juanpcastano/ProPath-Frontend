import { useDispatch } from "react-redux";
import { ApiCallLogin } from "../../services/authService";
import { credentials } from "../../models/credentials.model";
import { createUser } from "../../Redux/States/user";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./Login&register.module.css";
import { AxiosError } from "axios";

import { MockupProUserState, MockupCoachUserState, MockupAdminUserState } from "../../Redux/States/user";
import { PrivateRoutes } from "../../models/routes";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [Error, setError] = useState("");
  const login = async (credentials: credentials) => {
    
    if ((import.meta.env.VITE_ENVIROMENT = "mockup")) {
      console.log(`Logeándose como ${import.meta.env.VITE_MOCKUP_ROLE}`);
      
      if (import.meta.env.VITE_MOCKUP_ROLE = "pro"){
        dispatch(createUser(MockupProUserState));
      } else if (import.meta.env.VITE_MOCKUP_ROLE = "coach"){
        dispatch(createUser(MockupCoachUserState));
      } else if (import.meta.env.VITE_MOCKUP_ROLE = "admin"){
        dispatch(createUser(MockupAdminUserState));
      }
      navigate(PrivateRoutes.common.HOME.route);
    } else {
      try {
        const result = await ApiCallLogin(credentials);
  
        if (result.status >= 300) {
          const Message = result.message;
          setError(Message);
          if (result.status == 401) {
            setError("Credenciales Incorrectas");
          }
          return;
        }
        dispatch(createUser(result.user));
        navigate("/history");
      } catch (error) {
        let AxiosErr = error as AxiosError;
        console.log((AxiosErr.response?.data as { message: string }).message);
        setError((AxiosErr.response?.data as { message: string }).message);
        console.log(error);
      }

    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className={styles.loginContainer}>
      {/* Elementos decorativos */}
      <div
        className={`light-gradient-green ${styles.blob} ${styles.topLeft}`}
      ></div>
      <div
        className={`light-gradient-green ${styles.blob} ${styles.topRight}`}
      ></div>
      <div
        className={`light-gradient-green ${styles.blob} ${styles.bottomLeft}`}
      ></div>
      <div
        className={`light-gradient-green ${styles.blob} ${styles.bottomRight}`}
      ></div>

      {/* Formulario */}
      <div className={styles.loginFormContainer}>
        <h2 className={styles.title}>Iniciar sesión</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              className={styles.input}
              required
            />
          </div>
          <button type="submit" className="dark-gradient-green">
            Iniciar sesión
          </button>
          <div className={styles.smbtandforgotcontainer}>
            <Link to="" className={styles.link}>
              Olvidé mi contraseña
            </Link>
            <Link to="/register" className={styles.link}>
              Aún no tengo cuenta
            </Link>
            {Error && <p className={styles.error}>{Error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
