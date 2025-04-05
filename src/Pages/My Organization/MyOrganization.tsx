import TabLayout from "../../Components/TabLayout/TabLayout";
import Groups from "./Groups/Groups";
import Users from "./Users/Users";

const MyOrganization = () => {
  const tabs = [
    {
      name: "Miembros",
      content: <Users />,
    },
    {
      name: "Grupos",
      content: <Groups />,
    },
  ];
  return <TabLayout tabs={tabs} initialActiveTab="Miembros" />;
};
export default MyOrganization;
