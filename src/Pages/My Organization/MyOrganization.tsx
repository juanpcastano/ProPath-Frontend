import { useEffect, useState } from "react";
import TabLayout from "../../Components/TabLayout/TabLayout";
import Table from "../../Components/Table/Table";
import { ApiCallUsers } from "../../services/apiUsersService ";
import Loading from "../../Components/Loading/Loading";

const MyOrganization = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

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
  const headers = [
    "Nombre",
    "Email",
    "Rol",
    "grupo"
  ]
  const keys = [
    "name",
    "email",
    "role",
    "group"
  ]

  const tabs = [
    {
      name: "Miembros",
      content: <>{loading ? Loading : <Table data={users} headers={headers} keys={keys} pathLink="user"/>}</>,
    },  
    { name: "Grupos", content: <></> },
  ];
  return <TabLayout tabs={tabs} initialActiveTab="Miembros" />;
};
export default MyOrganization;
