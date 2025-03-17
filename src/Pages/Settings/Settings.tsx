import { useState, useRef } from "react";
import styles from "./Settings.module.css";
import { useSelector } from "react-redux";
import { AppStore } from "../../Redux/store";
import Api from "../../api/Api"; // Asegúrate de que la ruta sea correcta
import { useDispatch } from "react-redux";
import { resetUser, updateUser } from "../../Redux/States/user";
import { ApiCallLogout } from "../../services/authService";
import { resetPath } from "../../Redux/States/path";

export default function ProfileSettings({ tab = "" }: { tab?: string }) {
  const [activeTab, setActiveTab] = useState(tab ? tab : "preferences");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userData = useSelector((store: AppStore) => store.user);
  const dispatch = useDispatch();

  const logout = async () => {
    try {
      ApiCallLogout();
      dispatch(resetUser());
      dispatch(resetPath());
    } catch (error) {
      console.log(error)
    }
  };
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log("handleFileChange ejecutado");
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await Api.put("/usuarios/foto", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to upload image");
      }

      const result = response.data;
      // Assuming the API returns the new image URL
      // You might need to update the Redux store here with the new URL
      console.log("Image uploaded successfully:", result);
      dispatch(updateUser({ url_foto_de_perfil: result }));
      // For demonstration, we'll just log the success. In a real app, you'd update the state/store.
    } catch (error) {
      console.error("Error uploading image:", error);
      // Handle error (e.g., show an error message to the user)
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const renderPreferences = () => (
    <div>
      <div className={styles.formLayout}>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="language">
            Idioma
          </label>
          <select
            className={styles.select}
            id="language"
            defaultValue="spanish"
          >
            <option value="spanish">Español</option>
            <option value="english">English</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="timezone">
            Zona Horaria
          </label>
          <select className={styles.select} id="timezone" defaultValue="gmt-5">
            <option value="gmt-5">(GMT-5:00) Bogotá, Lima, Quito</option>
            <option value="gmt-4">(GMT-4:00) Caracas, La Paz</option>
            <option value="gmt-3">(GMT-3:00) Buenos Aires, Georgetown</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => {
    if (!userData) return <div>No se encontraron datos del usuario</div>;

    return (
      <div className={styles.profileContainer}>
        <div className={styles.avatarContainer}>
          <img
            src={
              userData.profilePictureUrl ||
              "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ3ecoYCIXbBsczNsN0icdz3oUUQEivp59Ugghl0AQBSJskziDV"
            }
            alt="Profile"
            className={styles.avatar}
          />
          <button
            className={styles.editButton}
            onClick={handleEditClick}
            disabled={isUploading}
            type="button"
          >
            {isUploading ? <LoadingIcon /> : <PencilIcon />}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>
        <div className={styles.formContainer}>
          <div className={styles.formLayout}>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="name">
                Tu nombre
              </label>
              <input
                className={styles.input}
                id="name"
                defaultValue={userData.name}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="id">
                Número de identificación
              </label>
              <div className={styles.idContainer}>
                <input
                  className={styles.input}
                  id="id"
                  defaultValue={userData.id}
                />
                <select
                  className={styles.select}
                  defaultValue={userData.idType}
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
                type="email"
                defaultValue={userData.email}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="city">
                Ciudad
              </label>
              <select
                className={styles.select}
                id="city"
                defaultValue={userData.city}
              >
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
                defaultValue={
                  new Date(userData.birthDate)
                    .toISOString()
                    .split("T")[0]
                }
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label} htmlFor="country">
                País
              </label>
              <select
                className={styles.select}
                id="country"
                defaultValue={userData.country}
              >
                <option value="Colombia">Colombia</option>
                <option value="México">México</option>
                <option value="Argentina">Argentina</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.tabList}>
          <div
            className={`${styles.tab} ${
              activeTab === "preferences" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("preferences")}
          >
            <span className={styles.span}>Preferencias</span>
            <div
              className={`${styles.decorator} ${
                activeTab === "preferences" ? styles.decoratorActive : ""
              }`}
            ></div>
          </div>
          <div
            className={`${styles.tab} ${
              activeTab === "profile" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("profile")}
          >
            <span className={styles.span}>Mi Perfil</span>
            <div
              className={`${styles.decorator} ${
                activeTab === "profile" ? styles.decoratorActive : ""
              }`}
            ></div>
          </div>
        </div>
        <div className={styles.content}>
          {activeTab === "preferences" ? renderPreferences() : renderProfile()}
        </div>
        <div className={styles.ButtonsContainer}>
          <button
            onClick={() => {
              logout();
            }}
            className={`${styles.button} dark-gradient-secondary `}
          >
            Cerrar Sesión
          </button>
          <button className={`${styles.button} dark-gradient-primary `}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

function PencilIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function LoadingIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={styles.loadingIcon}
    >
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  );
}
