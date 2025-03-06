import { Navigate, useNavigate } from "react-router-dom";
import styles from "./Topbar.module.css";
import { useSelector } from "react-redux";
import { AppStore } from "../../Redux/store";
const Topbar = () => {
  const userState = useSelector((store: AppStore) => store.user);
  const navigate = useNavigate();
  return (
    <div className={styles.TopbarContainer}>
      <div className={styles.logoContainer} onClick={()=>{<Navigate to="/history"/>}}>
        <img
          src="https://propath.in/wp-content/uploads/2022/03/Logo-Propath@1080x-e1648057279967.png" 
          alt="Eco4D Logo"
          className={styles.logo}
        />
        <h2>ProPath</h2>
      </div>

      <img
        src={userState.profilePictureUrl || "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ3ecoYCIXbBsczNsN0icdz3oUUQEivp59Ugghl0AQBSJskziDV"}
        alt="Profile"
        onClick={() => {
          navigate(`/settings/profile`)
        }}
        className={styles.profilePicture}
      />
    </div>
  );
};

export default Topbar;
