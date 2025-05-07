import { useEffect, useState } from "react";
import styles from "./Group.module.css";
import {
  ApiCallAddUserGroup,
  ApiCallDeleteUserGroup,
  ApiCallGroup,
  ApiCallUpdateGroup,
  group,
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
import { ApiCallUser } from "../../services/apiUserService";
import { useDispatch } from "react-redux";
import { updateUser } from "../../Redux/States/user";

interface userGroups {
  id: string;
  user: UserInfo;
  role: string;
}

interface groupInfo {
  name: string;
  description: string;
  userGroups?: userGroups[];
}

const Group = ({ groupId }: { groupId?: string }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((store: AppStore) => store.user);
  const [groupData, setGroupData] = useState<groupInfo>({
    name: "",
    description: "",
    userGroups: [],
  });
  const [areYouCoachOfThisGroup, setAreYouCoachOfThisGroup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingTitleAndDescription, setEditingTitleAndDescription] =
    useState(false);
  const [editingCoach, setEditingCoach] = useState(false);
  const [editingmembers, setEditingMembers] = useState(false);
  const [availableMembers, setAvailableMembers] = useState<any[]>([]);
  const [availableCoachs, setAvailableCoachs] = useState<any[]>([]);
  const [coach, setCoach] = useState<UserInfo>();
  const [users, setUsers] = useState<UserInfo[]>();

  const { id } = groupId ? { id: groupId } : useParams();
  if (!id) return <Error error="No se proporcionó una id" />;

  const deleteUser = (userId: string) => {
    if (userId)
      ApiCallUser(userId)
        .then((res) => {
          const usergroupId = res.userGroups?.find((userGroup) => {
            return userGroup.group.id == id;
          })?.id;
          if (usergroupId) {
            ApiCallDeleteUserGroup(usergroupId).then(() => {
              ApiCallGroup(id)
                .then((resp) => {
                  setGroupData(resp);
                  if (userId == userData.id)
                    localStorage.setItem("needsReload", "true");
                })
                .catch((err) => {
                  setError(err.response?.data.message);
                })
                .finally(() => {
                  setLoading(false);
                });
            });
          }
        })
        .catch((err) => {
          setError(err);
        });
  };

  const handleUpdateCoach = async (
    coachId: string | undefined,
    userId: string
  ) => {
    try {
      if (coachId) {
        const coachData = await ApiCallUser(coachId);
        const coachUserGroupId = coachData.userGroups?.find(
          (userGroup) => userGroup.group.id === id
        )?.id;
        if (coachUserGroupId) {
          await ApiCallDeleteUserGroup(coachUserGroupId);
        }
        const isCurrentUser = coachId === userData.id;

        if (isCurrentUser) {
          localStorage.setItem("needsReload", "true");
        }
      }

      const memberData = await ApiCallUser(userId);
      const memberUserGroupId = memberData.userGroups?.find(
        (userGroup) => userGroup.group.id === id
      )?.id;
      if (memberUserGroupId) {
        await ApiCallDeleteUserGroup(memberUserGroupId);
      }

      await ApiCallAddUserGroup({
        groupId: id,
        userId: userId,
        role: "M",
      });

      const updatedGroupData = await ApiCallGroup(id);
      setGroupData(updatedGroupData);
      setEditingCoach(false);

      if (
        localStorage.getItem("needsReload") === "true" ||
        userId === userData.id
      ) {
        localStorage.removeItem("needsReload");
        setLoading(true);
        ApiCallUser(userData.id)
        .then((res) => {
          dispatch(updateUser(res));
          window.location.reload();
        })
        .catch((err) => setError(err.response?.data.message));
      }
    } catch (error: any) {
      setError(error.response?.data.message || "Error desconocido");
    }
  };

  useEffect(() => {
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
  }, [id]);

  useEffect(() => {
    setAreYouCoachOfThisGroup(userData.id == coach?.id);
    setUsers(
      groupData.userGroups
        ?.map((user) => {
          return user.user;
        })
        .filter((user) => {
          return user.id != coach?.id;
        })
    );
    ApiCallUsers()
      .then((res) => {
        setAvailableCoachs(
          res.filter((user) => {
            return user.id != coach?.id;
          })
        );
      })
      .catch((err) => {
        setError(err.response?.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [coach, groupData]);

  useEffect(() => {
    if (localStorage.getItem("needsReload") === "true") {
      localStorage.removeItem("needsReload");
      setLoading(true);
      ApiCallUser(userData.id)
        .then((res) => {
          dispatch(updateUser(res));
          window.location.reload();
        })
        .catch((err) => setError(err.response?.data.message));
    }
    setCoach(
      groupData.userGroups?.find((usergroup) => usergroup.role == "M")?.user
    );
    ApiCallUsers()
      .then((res) => {
        setAvailableMembers(
          res.filter((user) => {
            return !groupData.userGroups
              ?.map((user) => {
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
  return (
    <>
      <div className={styles.mainContainer}>
        {!editingTitleAndDescription ? (
          <>
            <div className={styles.membersHeader}>
              <h1 className={`${styles.noMarginTop} ${styles.noMarginBottom}`}>
                {groupData.name}
              </h1>
              {userData.role == "A" && !editingTitleAndDescription && (
                <>
                  <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
                  />
                  {(userData.role == "A" || areYouCoachOfThisGroup) && (
                    <span
                      className={`material-symbols-outlined ${styles.editButton} ${styles.button}`}
                      onClick={() => {
                        setEditingTitleAndDescription(true);
                      }}
                    >
                      edit
                    </span>
                  )}
                </>
              )}
            </div>
            <p className={styles.description}>{groupData.description}</p>
          </>
        ) : (
          <>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const userGroup: group = {
                  name: formData.get("name") as string,
                  description: formData.get("description") as string,
                  userGroups: groupData.userGroups,
                };
                setEditingTitleAndDescription(false);
                ApiCallUpdateGroup(id, userGroup)
                  .then((res) => {
                    setGroupData(res);
                  })
                  .catch((err) => {
                    setError(err.response?.data.message);
                  });
                e.currentTarget.reset();
              }}
            >
              <div className={styles.formContainer}>
                <input
                  type="text"
                  placeholder="Nombre del grupo"
                  defaultValue={groupData.name}
                  className={styles.titleInput}
                  id="name"
                  name="name"
                  required
                  autoComplete="off"
                ></input>
                <textarea
                  name="description"
                  id="description"
                  placeholder="Descripción del grupo"
                  defaultValue={groupData.description}
                  rows={4}
                  required
                ></textarea>
                <div className={styles.buttonsContainer}>
                  <button
                    type="submit"
                    className={`${styles.button} dark-gradient-primary `}
                  >
                    <p className={styles.text}>Guardar</p>
                  </button>
                  <button
                    className={`${styles.button} dark-gradient-secondary`}
                    onClick={() => {
                      setEditingTitleAndDescription(false);
                    }}
                  >
                    <p className={styles.text}>Cancelar</p>
                  </button>
                </div>
              </div>
            </form>
          </>
        )}
      </div>
      <div className={`${styles.mainContainer}`}>
        <div className={styles.membersHeader}>
          <h2 className={`${styles.noMarginTop} ${styles.noMarginBottom}`}>
            Coach
          </h2>
          {userData.role == "A" && !editingCoach && (
            <>
              <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
              />
              <span
                className={`material-symbols-outlined ${styles.editButton} ${styles.button}`}
                onClick={() => {
                  setEditingCoach(true);
                }}
              >
                edit
              </span>
            </>
          )}
        </div>
        {coach && !editingCoach ? (
          <>
            <div className={styles.coach}>
              <div className={styles.titleAndDescription}>
                <h2
                  className={`${styles.noMarginBottom} ${styles.noMarginTop}`}
                >
                  {coach.name}
                </h2>
              </div>
              <button
                className={`${styles.goTo} ${styles.noMarginTop} dark-gradient-primary`}
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
        ) : editingCoach ? (
          <div className={styles.changeCoach}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleUpdateCoach(coach?.id, formData.get("userId") as string);
                e.currentTarget.reset();
              }}
            >
              <div className={styles.formContainer}>
                <div className={styles.formGroup}>
                  <select
                    className={`${styles.usersInput}`}
                    id="userId"
                    name="userId"
                    required
                  >
                    <option value="">Seleccione un usuario</option>
                    {availableCoachs.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div
                className={`${styles.buttonContainer} ${styles.noMarginTop}`}
              >
                <button
                  type="submit"
                  className={`${styles.button} ${styles.noMarginTop} dark-gradient-primary `}
                >
                  <p className={styles.text}>Cambiar Coach</p>
                </button>
                <button
                  className={`${styles.button} ${styles.noMarginTop} dark-gradient-secondary `}
                  onClick={() => {
                    setEditingCoach(false);
                  }}
                >
                  <p className={styles.text}>Cancelar</p>
                </button>
              </div>
              <Error error={error} />
            </form>
          </div>
        ) : (
          <Error error="Este grupo no tiene un coach" />
        )}
      </div>
      <div className={`${styles.mainContainer} ${styles.noMarginBottom}`}>
        <div className={styles.membersHeader}>
          <h2 className={`${styles.noMarginTop} ${styles.noMarginBottom}`}>
            Miembros
          </h2>
          {userData.role == "A" && !editingmembers && (
            <>
              <link
                rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
              />
              <span
                className={`material-symbols-outlined ${styles.editButton} ${styles.button}`}
                onClick={() => {
                  setEditingMembers(true);
                }}
              >
                edit
              </span>
            </>
          )}
        </div>
        {users?.length ? (
          <Table
            headers={["Nombre"]}
            keys={["name"]}
            pathLink={PrivateRoutes.common.MY_ORGANIZATION.route + "/user"}
            data={users}
            handleDelete={editingmembers ? deleteUser : undefined}
            containerClassname={styles.membersTableContainer}
            tableClassname={styles.membersTable}
          />
        ) : (
          <Error error="No hay miembros aún" />
        )}
        {editingmembers && (
          <div className={styles.addMember}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                setLoading(true);
                ApiCallAddUserGroup({
                  userId: formData.get("userId") as string,
                  groupId: id,
                  role: "P",
                })
                  .then(() => {
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
              <h2 className={styles.noMarginTop}>Añadir Nuevo Miembro:</h2>
              <div className={styles.formContainer}>
                <div className={styles.formGroup}>
                  <select
                    className={`${styles.usersInput}`}
                    id="userId"
                    name="userId"
                    required
                  >
                    <option value="">Seleccione un usuario</option>
                    {availableMembers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div
                className={`${styles.buttonContainer} ${styles.noMarginTop} `}
              >
                <button
                  type="submit"
                  className={`${styles.button} ${styles.noMarginTop} dark-gradient-primary `}
                >
                  <p className={styles.text}>Añadir Miembro</p>
                </button>
                <button
                  className={`${styles.button} ${styles.noMarginTop} dark-gradient-secondary `}
                  onClick={() => {
                    setEditingMembers(false);
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
