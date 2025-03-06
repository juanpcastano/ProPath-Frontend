import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import styles from "./Layout.module.css";

const Layout = () => {
  
  return (
    <>
      <div className={styles.layoutContainer}>
        <Topbar />
        <Sidebar />
        <div className={styles.contentBackground}>
          <Outlet />
        </div>
      </div>
    </>
  );
};
export default Layout;
