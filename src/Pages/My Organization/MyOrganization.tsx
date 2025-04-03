import { useEffect, useState } from "react";
import TabLayout from "../../Components/TabLayout/TabLayout";
import Table from "../../Components/Table/Table";
import { ApiCallUsers } from "../../services/apiUsersService ";
import Loading from "../../Components/Loading/Loading";
import { useSelector } from "react-redux";
import { AppStore } from "../../Redux/store";
import styles from "./MyOrganization.module.css";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "../../models/routes";

const MyOrganization = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const userData = useSelector((store: AppStore) => store.user);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await ApiCallUsers();
        setUsers(res);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  const headers = ["Nombre", "Email", "Rol", "grupo"];
  const keys = ["name", "email", "role", "group"];

  const tabs = [
    {
      name: "Miembros",
      content: (
        <>
          {loading ? (
            Loading
          ) : (
            <>
              {userData.role == "A" && (
                <div className={styles.addUserButtonContainer}>
                  <button
                    className={`dark-gradient-primary ${styles.addUserButton}`}
                    onClick={()=>{navigate(PrivateRoutes.common.MY_ORGANIZATION.route+"/addUser")}}
                  >
                    Añadir un usuario
                  </button>
                </div>
              )}
              <Table
                data={users}
                headers={headers}
                keys={keys}
                pathLink="user"
              />
            </>
          )}
        </>
      ),
    },
    { name: "Grupos", content: <></> },
  ];
  return <TabLayout tabs={tabs} initialActiveTab="Miembros" />;
};
export default MyOrganization;
