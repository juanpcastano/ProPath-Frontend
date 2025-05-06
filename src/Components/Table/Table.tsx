import { Link } from "react-router-dom";
import styles from "./Table.module.css";

const Table = ({
  containerClassname,
  tableClassname,
  data,
  headers,
  keys,
  pathLink,
  handleDelete,
}: {
  containerClassname? : string,
  tableClassname? : string,
  data: any[];
  headers: string[];
  keys: string[];
  pathLink?: string;
  handleDelete?: (id: string) => void;
}) => {
  return (
    <div className={`${styles.mainContainer} ${containerClassname}`}>
      <table className={`${styles.table} ${tableClassname}`}>
        <thead>
          <tr>
            {headers.map((header, index) => {
              return <th key={index}>{header}</th>;
            })}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {keys.map((key: string, index) => {
                return <td key={index}>{item[key]}</td>;
              })}
              {item.id && !!pathLink && (
                <td className={styles.actions}>
                  {pathLink && (
                    <Link to={pathLink + "/" + item.id}>
                      <button className={styles.detailsButton}>
                        Ver Detalles
                      </button>
                    </Link>
                  )}
                  {handleDelete && (
                    <button className={styles.deleteButton} onClick={()=>{handleDelete(item.id)}}>
                      Eliminar
                    </button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Table;
