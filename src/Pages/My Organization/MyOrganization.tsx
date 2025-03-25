import TabLayout from "../../Components/TabLayout/TabLayout";


const MyOrganization = () => {
  const tabs = [
    { name: "Miembros",
      content: <></>
     },
    { name: "Grupos",
      content: <></>
     },
  ];
  return <TabLayout tabs={tabs} initialActiveTab="Miembros" />;
};
export default MyOrganization;
