import { useEffect, useState } from "react";
import { AppStore } from "../../../Redux/store";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ApiCallUsers } from "../../../services/apiUsersService ";
import Table from "../../../Components/Table/Table";
import Loading from "../../../Components/Loading/Loading";
import styles from "./Users.module.css"
import { PrivateRoutes } from "../../../models/routes";
import Error from "../../Error/Error";
import { UserInfo } from "../../../models/user.model";

const Users = () => {
  const headers = ["Nombre", "Email", "Rol"];
  const keys = ["name", "email", "role"];

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<UserInfo[]>([]);

  const userData = useSelector((store: AppStore) => store.user);
  const navigate = useNavigate();

  useEffect(() => {
    ApiCallUsers()
      .then((res) => {
        setUsers(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data.message);
        setLoading(false);  
      });
  }, []);
  if (loading) return <Loading/>
  if (error) return <Error error={error}/>
  return (
    <>
      <Table data={users} headers={headers} keys={keys} pathLink="user" />
      {userData.role == "A" && (
        <>
          <div className={styles.addUserButtonContainer}>
            <button
              className={`dark-gradient-primary ${styles.addUserButton}`}
              onClick={() => {
                navigate(
                  PrivateRoutes.common.MY_ORGANIZATION.route + "/addUser"
                );
              }}
            >
              Añadir un usuario
            </button>
          </div>
        </>
      )}
    </>
  );
};
export default Users;
