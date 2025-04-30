import { useEffect, useState } from "react";
import styles from "./Group.module.css";
import { ApiCallGroup } from "../../services/apiGroupsService";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../Components/Loading/Loading";
import Error from "../Error/Error";
import { useSelector } from "react-redux";
import { AppStore } from "../../Redux/store";
import { UserInfo } from "../../models/user.model";
import { PrivateRoutes } from "../../models/routes";
import { ApiCallUsers } from "../../services/apiUsersService ";

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
  const navigate = useNavigate();
  const userData = useSelector((store: AppStore) => store.user);
  const [groupData, setGroupData] = useState<groupInfo>({
    name: "",
    description: "",
    userGroups: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<any[]>([])
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      ApiCallGroup(id)
        .then((resp) => {
          setGroupData(resp);
          console.log(resp);
          ApiCallUsers().then((res)=>{
            setAvailableUsers(res)
          })
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
        <h2 className={`${styles.noMarginTop} ${styles.noMarginBottom}`}>
          Miembros:{" "}
        </h2>
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
      {groupData.userGroups.length == 0 && (
        <Error error="No hay usuarios registrados aún"></Error>
      )}
      {groupData.userGroups.map((member, index) => {
        return (
          <div className={styles.member} key={index}>
            <h3>{member.user.name}</h3>
            <p className={styles.description}>Rol: {member.role}</p>
            <button
              className={`dark-gradient-primary ${styles.goTo}`}
              onClick={() => {
                navigate(
                  PrivateRoutes.common.MY_ORGANIZATION.route +
                    "/user/" +
                    member.id
                );
              }}
            >
              Ir al perfil
            </button>
          </div>
        );
      })}
      {editing && (
        <div className={styles.addMember}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget)

              const memberInfo = {
                id: "asdasdass",
                user: {...userData, name: formData.get("userId") as string},
                role: formData.get("role") as string,
              };
              console.log("New member info:", memberInfo);
              setGroupData({...groupData, userGroups: [...groupData.userGroups, memberInfo]})
              e.currentTarget.reset();
            }}
          >
            <div className={styles.mainContainer}>
              <h3>Añadir Nuevo Miembro</h3>
              <div className={styles.formContainer}>
                <div className={styles.formLayout}>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="userId">
                      Usuario
                    </label>
                    <select
                      className={styles.input}
                      id="userId"
                      name="userId"
                      required
                    >
                      <option value="">Seleccione un usuario</option>
                      {availableUsers.map((user) => (
                        <option key={user.id} value={user.name}>
                          {user.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="role">
                      Rol
                    </label>
                    <select
                      className={styles.input}
                      id="role"
                      name="role"
                      required
                    >
                      <option value="">Seleccione un rol</option>
                      <option value="M">M</option>
                      <option value="P">P</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className={styles.buttonContainer}>
                <button
                  type="submit"
                  className={`${styles.button} dark-gradient-primary `}
                >
                  <p className={styles.text}>Añadir Miembro</p>
                </button>
              </div>
              <Error error={error} />
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default Group;
