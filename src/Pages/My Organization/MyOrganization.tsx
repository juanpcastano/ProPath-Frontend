import { useSelector } from "react-redux";
import TabLayout from "../../Components/TabLayout/TabLayout";
import { AppStore } from "../../Redux/store";
import Groups from "./Groups/Groups";
import Users from "./Users/Users";
import SendedPaths from "../MyGroups/SendedPaths/SendedPaths";

const MyOrganization = () => {
  const userData = useSelector((store: AppStore) => store.user);

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

  if (userData.role == "A") {
    tabs.push({
      name: "Paths por activar",
      content: <SendedPaths role="admin" />,
    });
  }
  return <TabLayout tabs={tabs} initialActiveTab="Miembros" />;
};
export default MyOrganization;
