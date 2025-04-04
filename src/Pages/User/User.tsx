import { useNavigate, useParams } from "react-router-dom";
import styles from "./User.module.css";
import { ApiCallUser } from "../../services/apiUserService";
import { useEffect, useState } from "react";
import Loading from "../../Components/Loading/Loading";
import { UserInfo } from "../../models/user.model";
import { PrivateRoutes } from "../../models/routes";

const User = () => {
  const { id } = useParams();

  const [userData, setUserData] = useState<undefined | UserInfo>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    ApiCallUser(id as string)
      .then((res) => {
        setUserData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return (
      <div className={styles.mainContainer}>
        <h2 className={styles.error}></h2>
      </div>
    );
  }
  if (!userData) return <div>No se encontraron datos del usuario</div>;
  return (
    <div className={styles.mainContainer}>
      <div className={styles.section}>
        <img
          src={
            userData.profilePictureUrl ||
            "https://www.svgrepo.com/show/497407/profile-circle.svg"
          }
          alt="Profile"
          className={styles.avatar}
        />
        <h1>{userData.name}</h1>
        <strong className={styles.ubication}>
          {userData.city} - {userData.country}
        </strong>
      </div>
      <div className={styles.section}>
        {userData.groups?.length ? (
          <>
            <h1>Grupos</h1>
            <div className={styles.groupsContainer}>
              {userData.groups.map((group, index) => {
                return (
                  <div className={styles.group} key={index}>
                    <strong className={styles.groupTitle}>{group.name}</strong>
                    <button className={`dark-gradient-primary ${styles.groupButton}`} onClick={()=>{
                      navigate(PrivateRoutes.common.MY_ORGANIZATION.route+"/group/"+group.id)
                    }}>Ir Al Grupo</button>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
export default User;
