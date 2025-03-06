import styles from "./Sidebar.module.css";
import NavItem from "./NavItem";
import { useSelector } from "react-redux";
import { AppStore } from "../../Redux/store";
import { PrivateRoutes } from "../../models/routes";

const Sidebar = () => {
  const userState = useSelector((store: AppStore) => store.user);

  return (
    <div className={styles.navItemsContainer}>
      {Object.values(
        PrivateRoutes.common
      ).map((route, key) => {
        return (
          route.icon && (
            <NavItem
              key={key}
              Icon={route.icon}
              label={route.label}
              to={route.route}
            />
          )
        );
      })}
      {Object.values(
        PrivateRoutes[userState.role as keyof typeof PrivateRoutes]
      ).map((route, key) => {
        return (
          route.icon && (
            <NavItem
              key={key}
              Icon={route.icon}
              label={route.label}
              to={route.route}
            />
          )
        );
      })}
      {Object.values(
        PrivateRoutes.commonDown
      ).map((route, key) => {
        return (
          route.icon && (
            <NavItem
              key={key}
              Icon={route.icon}
              label={route.label}
              to={route.route}
            />
          )
        );
      })}
    </div>
  );
};

export default Sidebar;
