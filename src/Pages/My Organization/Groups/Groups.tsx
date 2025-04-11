import { useEffect, useState } from "react";
import styles from "./Groups.module.css";
import { ApiCallGroups } from "../../../services/apiGroupsService";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppStore } from "../../../Redux/store";
import { PrivateRoutes } from "../../../models/routes";
import Loading from "../../../Components/Loading/Loading";
import Error from "../../Error/Error";
import { Group } from "../../../models/user.model";

const Groups = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]);
  const userData = useSelector((store: AppStore) => store.user);
  const navigate = useNavigate();
  useEffect(() => {
    ApiCallGroups()
      .then((res) => {
        setGroups(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log(groups);
  }, [groups]);

  if (loading) return <Loading />;
  if (error) return <Error error="Ocurrió un error"/>;
  if (!groups) return <Error error="No se encontraron grupos registrados"/>
  return (
    <>
      {groups.length >= 0 ? (
        <div className={styles.groupsContainer}>
          {groups.map((group, index) => {
            return (
              <div className={styles.group} key={index}>
                {group.name}
              </div>
            );
          })}
        </div>
      ) : (
        <p className={styles.text}></p>
      )}

      {userData.role == "A" && (
        <div className={styles.addGroupButtonContainer}>
          <button
            className={`dark-gradient-primary ${styles.addGroupButton}`}
            onClick={() => {
              navigate(PrivateRoutes.common.MY_ORGANIZATION.route + "/addGroup");
            }}
          >
            Añadir un grupo
          </button>
        </div>
      )}
    </>
  );
};
export default Groups;
