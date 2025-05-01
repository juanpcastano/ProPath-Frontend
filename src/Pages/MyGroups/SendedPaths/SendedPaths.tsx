import { useEffect, useState } from "react";
import Table from "../../../Components/Table/Table";
import { ApiCallGetSendedPaths } from "../../../services/apiPathService";
import Error from "../../Error/Error";
import Loading from "../../../Components/Loading/Loading";
import { PrivateRoutes } from "../../../models/routes";
import { useSelector } from "react-redux";
import { AppStore } from "../../../Redux/store";

const SendedPaths = () => {
  const [Paths, setPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userData = useSelector((store: AppStore) => store.user);
  useEffect(() => {
    ApiCallGetSendedPaths(userData.id)
      .then((res) => {
        setPaths(res);
        
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(()=>{console.log(Paths);
  },[Paths])

  const headers = ["Nombre", "Descripción", "Horas totales"];
  const keys = [
    "name",
    "description",
    "totalBudget"]
  
  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!(Paths.length > 0))
    return <div>No se encontraron datos del usuario</div>;
  return <Table data={Paths} keys={keys} headers={headers} pathLink={PrivateRoutes.common.MY_ORGANIZATION.route + "/path"}/>;
};
export default SendedPaths;
