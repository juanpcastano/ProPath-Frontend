import { useEffect, useState } from "react";
import Table from "../../../Components/Table/Table";
import { ApiCallGetSendedPaths } from "../../../services/apiPathService";
import Error from "../../Error/Error";
import Loading from "../../../Components/Loading/Loading";
import { PrivateRoutes } from "../../../models/routes";
import { Path } from "../../../models/path.model";
import { getActualQuartile, parsePath } from "../../../services/quartile";

interface SendedPathsProps {
  role: string
}

const SendedPaths = ({role}:SendedPathsProps) => {
  const [Paths, setPaths] = useState<Path[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  function calcTotalHours(path: Path): number {
    return path.activities.reduce(
      (total, actividad) => total + actividad.hours,
      0
    );
  }

  function calcTotalBudget(path: Path): number {
    return path.activities.reduce(
      (total, actividad) => total + actividad.budget,
      0
    );
  }
  useEffect(() => {
    ApiCallGetSendedPaths(role)
      .then((res) => {
        setPaths(
          res
            .map((path) => {
              return {
                ...path,
                totalBudget: calcTotalBudget(path),
                totalHours: calcTotalHours(path),
              };
            })
            .filter((path) => {
              return parsePath(path).quartileString == getActualQuartile();
            })
        );
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const headers = [
    "Nombre",
    "Descripción",
    "Presupuesto Total",
    "Horas Totales",
  ];
  const keys = ["name", "description", "totalBudget", "totalHours"];

  if (loading) return <Loading />;
  if (error) return <Error error={error} />;
  if (!(Paths.length > 0)) return <Error error="No hay paths por revisar" />;
  return (
    <Table
      data={Paths}
      keys={keys}
      headers={headers}
      pathLink={PrivateRoutes.common.MY_ORGANIZATION.route + "/path"}
    />
  );
};
export default SendedPaths;
