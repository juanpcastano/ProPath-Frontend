import { useEffect, useState } from "react";
import TabLayout, { tab } from "../../Components/TabLayout/TabLayout";
import { ApiCallUser } from "../../services/apiUserService";
import { useSelector } from "react-redux";
import { AppStore } from "../../Redux/store";
import Error from "../Error/Error";
import Loading from "../../Components/Loading/Loading";
import { UserGroup, UserInfo } from "../../models/user.model";
import Group from "../Group/Group";
import SendedPaths from "./SendedPaths/SendedPaths";

const MyGroups = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [groups, setGroups] = useState<UserGroup[]>([]);
  const [tabs, setTabs] = useState<tab[]>([]);
  const userData = useSelector((store: AppStore) => store.user);
  useEffect(() => {
    ApiCallUser(userData.id)
      .then((res: UserInfo) => {
        if (res.userGroups) {
          setGroups(res.userGroups);
        }
      })
      .catch((err) => {
        setError(err.response?.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {

    setTabs(
      groups.map((UserGroup): tab => {
        const tabs = [
          {
            name: "Miembros",
            content: <Group groupId={UserGroup.group.id} />,
          },
          {
            name: "Paths enviados",
            content: <SendedPaths />,
          },
        ];
        if (UserGroup.role == "M")
          return {
            name: UserGroup.group.name,
            content: (
              <TabLayout
                tabs={tabs}
                initialActiveTab="Miembros"
                mainContainer={false}
              />
            ),
          };
          else return {
            name: UserGroup.group.name,
            content: (
              <Group groupId={UserGroup.group.id} />
            ),
          };
      })
    );
  }, [groups]);

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!userData) return <div>No se encontraron datos del usuario</div>;
  if (!tabs[0])
    return <Error error="Aún no estás registrado en ningún grupo" />;
  return <TabLayout tabs={tabs} initialActiveTab={tabs[0].name} />;
};
export default MyGroups;
