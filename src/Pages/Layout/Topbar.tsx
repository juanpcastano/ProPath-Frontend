import { Link, useNavigate } from "react-router-dom";
import styles from "./Topbar.module.css";
import { useSelector } from "react-redux";
import { AppStore } from "../../Redux/store";
import { PrivateRoutes } from "../../models/routes";

const Topbar = () => {
  const userState = useSelector((store: AppStore) => store.user);
  const navigate = useNavigate();
  return (
    <div className={styles.TopbarContainer}>
      <Link className={styles.logoContainer} to={PrivateRoutes.common.HOME.route}>
        <img
          src={`${import.meta.env.VITE_LOGO_URL}`}
          alt="ProPath Logo"
          className={styles.logo}
        />
        <h2>ProPath</h2>
      </Link>

      <img
        src={
          userState.profilePictureUrl ||
          "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQ3ecoYCIXbBsczNsN0icdz3oUUQEivp59Ugghl0AQBSJskziDV"
        }
        alt="Profile"
        onClick={() => {
          navigate(`/settings/profile`);
        }}
        className={styles.profilePicture}
      />
    </div>
  );
};

export default Topbar;
