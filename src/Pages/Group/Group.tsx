import { useEffect, useState } from "react";
import styles from "./Group.module.css";
import { ApiCallGroup } from "../../services/apiGroupsService";
import { useParams } from "react-router-dom";
import Loading from "../../Components/Loading/Loading";
import Error from "../Error/Error";
import { useSelector } from "react-redux";
import { AppStore } from "../../Redux/store";
import { UserInfo } from "../../models/user.model";

interface userGroups {
  id: string;
  user: UserInfo;
  role: string;
}

interface groupInfo {
  name: string;
  description: string;
  userGroups: userGroups[];
}

const Group = () => {
  const userData = useSelector((store: AppStore) => store.user);
  const [groupData, setGroupData] = useState<groupInfo>({
    name: "",
    description: "",
    userGroups: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      ApiCallGroup(id)
        .then((resp) => {
          setGroupData(resp);
          console.log(resp);
        })
        .catch((err) => {
          setError(err.response?.data.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  return (
    <div className={styles.mainContainer}>
      <h1>{groupData.name}</h1>
      <p className={styles.description}>{groupData.description}</p>
      <hr />
      <div className={styles.membersHeader}>
        <h2 className={styles.noMarginTop}>Miembros: </h2>
        {userData.role == "A" && (
          <>
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
            />
            <span
              className={`material-symbols-outlined ${styles.editButton} ${styles.button}`}
              onClick={() => {
                setEditing(true);
              }}
            >
              edit
            </span>
          </>
        )}
      </div>
      {groupData.userGroups.map((member, index) => {
        return (
          <div className={styles.member} key={index}>
            <h3>{member.user.name}</h3>
          </div>
        );
      })}
    </div>
  );
};
export default Group;
