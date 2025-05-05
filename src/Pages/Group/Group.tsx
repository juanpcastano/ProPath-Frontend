import { useEffect, useState } from "react";
import styles from "./Group.module.css";
import {
  ApiCallAddUserGroup,
  ApiCallGroup,
} from "../../services/apiGroupsService";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../Components/Loading/Loading";
import Error from "../Error/Error";
import { useSelector } from "react-redux";
import { AppStore } from "../../Redux/store";
import { UserInfo } from "../../models/user.model";
import { PrivateRoutes } from "../../models/routes";
import { ApiCallUsers } from "../../services/apiUsersService ";
import Table from "../../Components/Table/Table";

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

const Group = ({ groupId }: { groupId?: string }) => {
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
  const [availableUsers, setAvailableUsers] = useState<any[]>([]);
  const [coach, setCoach] = useState<UserInfo>();
  const [users, setUsers] = useState<UserInfo[]>();

  const { id } = groupId ? { id: groupId } : useParams();
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

  useEffect(() => {
    setUsers(
      groupData.userGroups
        .map((user) => {
          return user.user;
        })
        .filter((user) => {
          user.id != coach?.id;
        })
    );
  }, [coach]);

  useEffect(() => {
    setCoach(
      groupData.userGroups.find((usergroup) => usergroup.role == "M")?.user
    );
    ApiCallUsers()
      .then((res) => {
        setAvailableUsers(
          res.filter((user) => {
            return !groupData.userGroups
              .map((user) => {
                return user.user.id;
              })
              .includes(user.id);
          })
        );
      })
      .catch((err) => {
        setError(err.response?.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [groupData]);

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!id) return <Error error="No se proporcionó una id" />;
  return (
    <>
      <div className={styles.mainContainer}>
        <h1 className={styles.noMarginTop}>{groupData.name}</h1>
        <p className={styles.description}>{groupData.description}</p>
      </div>
      <div className={`${styles.mainContainer}`}>
        {coach ? (
          <>
            <h2 className={`${styles.noMarginTop}`}>Coach</h2>
            <div className={styles.group}>
              <div className={styles.titleAndDescription}>
                <h2
                  className={`${styles.noMarginBottom} ${styles.noMarginTop}`}
                >
                  {coach.name}
                </h2>
              </div>
              <button
                className={`${styles.goTo} dark-gradient-primary`}
                onClick={() => {
                  navigate(
                    PrivateRoutes.common.MY_ORGANIZATION.route +
                      "/user/" +
                      coach.id
                  );
                }}
              >
                Ir al perfl
              </button>
            </div>
          </>
        ) : (
          <Error error="Este grupo no tiene un coach" />
        )}
      </div>
      <div className={styles.mainContainer}>
        <div className={styles.membersHeader}>
          <h2 className={`${styles.noMarginTop}`}>Miembros</h2>
          {userData.role == "A" && !editing && (
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
        {users?.length ? (
          <Table
            headers={["Nombre"]}
            keys={["name"]}
            pathLink={PrivateRoutes.common.MY_ORGANIZATION.route + "/user"}
            data={users}
          />
        ) : (
          <Error error="No hay miembros aún" />
        )}
        {editing && (
          <div className={styles.addMember}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);

                const memberInfo = {
                  id: formData.get("userId") as string,
                  user: { ...userData, name: formData.get("userId") as string },
                  role: formData.get("role") as string,
                };
                console.log("New member info:", memberInfo);
                setGroupData({
                  ...groupData,
                  userGroups: [...groupData.userGroups, memberInfo],
                });
                setLoading(true);
                ApiCallAddUserGroup({
                  userId: formData.get("userId") as string,
                  groupId: id,
                  role: "M",
                })
                  .catch((err) => {
                    setError(err.responde?.data.message);
                  })
                  .finally(() => {
                    setLoading(false);
                  });
                e.currentTarget.reset();
              }}
            >
              <h2>Añadir Nuevo Miembro:</h2>
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
                        <option key={user.id} value={user.id}>
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
                      <option value="M">Mentor</option>
                      <option value="P">Profesional</option>
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
                <button
                  className={`${styles.button} dark-gradient-secondary `}
                  onClick={() => {
                    setEditing(false);
                  }}
                >
                  <p className={styles.text}>Cancelar</p>
                </button>
              </div>
              <Error error={error} />
            </form>
          </div>
        )}
      </div>
    </>
  );
};
export default Group;
