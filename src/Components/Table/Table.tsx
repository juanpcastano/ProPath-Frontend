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
