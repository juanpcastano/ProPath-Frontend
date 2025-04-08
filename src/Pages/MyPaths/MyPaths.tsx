import TabLayout, { tab } from "../../Components/TabLayout/TabLayout";
import Path from "../Path/Path";

const tabs: tab[] = [
  { name: "Actual", content: <Path/> },
  { name: "Historial", content: <></> },
];

const MyPaths = () => {
  return <TabLayout tabs={tabs} initialActiveTab="Actual"/>;
};
export default MyPaths;
