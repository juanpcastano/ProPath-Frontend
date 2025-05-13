import { useEffect, useState } from "react";
import { ApiCallGetUserPaths } from "../../services/apiPathService";
import Loading from "../../Components/Loading/Loading";
import Error from "../Error/Error";
import Table from "../../Components/Table/Table";
import { PrivateRoutes } from "../../models/routes";
import { Path } from "../../models/path.model";
import { parsePath } from "../../services/quartile";

const PathHistory = () => {
  const [paths, setPaths] = useState<Path[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    ApiCallGetUserPaths()
      .then((resp) => {
        const parsedPaths = resp.map((p) => {
          return parsePath(p)
        });
        setPaths(parsedPaths);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError(err.response?.data.message);
        setPaths([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    console.log(paths);
  }, [paths]);

  const headers = ["Título", "Descripción", "Periodo"];
  const keys = ["name", "description", "quartileString"];
  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (paths.length == 0)
    return <Error error="Aún no tienes paths registrados" />;
  return (
    <div>
      <Table
        headers={headers}
        keys={keys}
        data={paths}
        pathLink={PrivateRoutes.common.MY_ORGANIZATION.route + "/path"}
      />
    </div>
  );
};
export default PathHistory;
