import { useNavigate, useParams } from "react-router-dom";
import styles from "./User.module.css";
import { ApiCallUser } from "../../services/apiUserService";
import { useEffect, useState } from "react";
import Loading from "../../Components/Loading/Loading";
import { UserGroup, UserInfo } from "../../models/user.model";
import { PrivateRoutes } from "../../models/routes";
import Error from "../Error/Error";

const User = () => {
  const { id } = useParams();

  const [userData, setUserData] = useState<undefined | UserInfo>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate()

  useEffect(() => {
    ApiCallUser(id as string)
      .then((res) => {
        setUserData(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data.message);
        setLoading(false);  
      });
  }, []);

  if (loading) return <Loading />;
  if (error) return <Error error={error}/>
  if (!userData) return <div>No se encontraron datos del usuario</div>;
  return (
    <div className={styles.mainContainer}>
      <div className={styles.section}>
        <img
          src={
            userData.profilePictureUrl ||
            "https://static.vecteezy.com/system/resources/previews/005/544/718/non_2x/profile-icon-design-free-vector.jpg"
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
        {userData.userGroups?.length ? (
          <>
            <h1>Grupos</h1>{userData.role == "A"}
            <div className={styles.groupsContainer}>
              {userData.userGroups.map((userGroup:UserGroup, index) => {
                const group = userGroup.group;
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
