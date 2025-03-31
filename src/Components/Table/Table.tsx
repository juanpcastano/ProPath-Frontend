import { Link } from "react-router-dom";
import styles from "./Table.module.css";

const Table = ({
  data,
  headers,
  keys,
  pathLink,
}: {
  data: any[];
  headers: string[];
  keys: string[];
  pathLink?: string;
}) => {
  return (
    <div className={styles.mainContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headers.map((header) => {
              return <th>{header}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              {keys.map((key: string) => {
                return <td>{item[key]}</td>;
              })}
              {keys.includes("id") && !!pathLink && (
                <td className={styles.actions}>
                  <Link to={pathLink + "/" + item.id}>
                    <button className={styles.detailsButton}>
                      Ver Detalles
                    </button>
                  </Link>
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
