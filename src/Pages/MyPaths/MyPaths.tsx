import TabLayout, { tab } from "../../Components/TabLayout/TabLayout";
import Path from "../Path/Path";
import PathHistory from "../PathHistory/PathHistory";

const tabs: tab[] = [
  { name: "Actual", content: <Path/> },
  { name: "Historial", content: <PathHistory/> },
];

const MyPaths = () => {
  return <TabLayout tabs={tabs} initialActiveTab="Actual"/>;
};
export default MyPaths;
