import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import styles from "./Login&register.module.css";
import Error from "../Error/Error";
import {
  ApiCallSendCode,
  ApiCallUpdatePassword,
} from "../../services/authService";
import Loading from "../../Components/Loading/Loading";

const Restablish = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCodeSended, setIsCodeSended] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <div className={styles.loginContainer}>
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

      {loading ? (
        <Loading />
      ) : (
        <div className={styles.loginFormContainer}>
          <h2 className={styles.title}>Restablecer Contraseña</h2>

          {!isCodeSended ? (
            <form
              className={styles.form}
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                setLoading(true);
                ApiCallSendCode(formData.get("email") as string)
                  .then(() => {
                    setEmail(formData.get("email") as string);
                    setIsCodeSended(true);
                    setMessage("Código enviado, revisa tu bandeja de spam");
                  })
                  .catch((err) => {
                    setError(err.response?.data.message);
                  })
                  .finally(() => {
                    setLoading(false);
                  });
                e.currentTarget.reset();
              }}
            >
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={styles.input}
                  required
                />
              </div>

              <button type="submit" className="dark-gradient-primary">
                Enviar Código
              </button>
            </form>
          ) : (
            <form
              className={styles.form}
              autoComplete="off"
              onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              setLoading(true);
              ApiCallUpdatePassword({
                email: email,
                code: Number(formData.get("code")),
                newPassword: formData.get("password") as string,
              })
                .then(() => {
                setMessage("Contraseña Cambiada Existosamente");
                setIsCodeSended(false)
                if (window && window.navigator && window.navigator.credentials) {
                  window.navigator.credentials.preventSilentAccess?.();
                }
                })
                .catch((err) => {
                setError(err.response?.data.message);
                })
                .finally(() => {
                setLoading(false);
                });
              e.currentTarget.reset();
              }}
            >
              <div className={styles.formGroup}>
              <label htmlFor="code">Código</label>
              <input
                type="text"
                id="code"
                name="code"
                className={styles.input}
                inputMode="numeric"
                pattern="[0-9]*"
                required
                autoComplete="off"
                onKeyDown={(e) => {
                if (
                  e.key === "e" ||
                  e.key === "E" ||
                  e.key === "+" ||
                  e.key === "-"
                ) {
                  e.preventDefault();
                }
                }}
              />
              </div>

              <div className={styles.formGroup}>
              <label htmlFor="password">Nueva Contraseña</label>
              <input
                type="password"
                id="password"
                name="password"
                minLength={6}
                className={styles.input}
                required
              />
              </div>

              <button type="submit" className="dark-gradient-primary">
              Actualizar Contraseña
              </button>
            </form>
          )}
          <div className={styles.messageContainer}>
            <p className={styles.message}>{message}</p>
          </div>

          <div className={styles.smbtandforgotcontainer}>
            <Link to="/login" className={styles.link}>
              Iniciar Sesión
            </Link>
            {/* <Link to="/register" className={styles.link}>
              Aún no tengo cuenta
              </Link> */}
            <Error error={error} />
          </div>
        </div>
      )}
    </div>
  );
};
export default Restablish;
