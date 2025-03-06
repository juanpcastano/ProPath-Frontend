import { useSelector } from "react-redux";
import { AppStore } from "../Redux/store";
import { Navigate, Outlet } from "react-router-dom";
import { PrivateRoutes } from "../models/routes";

// Definimos el tipo para las props
interface RoleGuardProps {
  role: string | string[];
}

const RoleGuard = ({ role }: RoleGuardProps) => {
  const userState = useSelector((store: AppStore) => store.user);
  
 
  if (Array.isArray(role)) {
    return role.includes(userState.role) 
      ? <Outlet />
      : <Navigate to={PrivateRoutes.common.HOME.route} />;
  }

  return userState.role === role 
    ? <Outlet />
    : <Navigate to={PrivateRoutes.common.HOME.route} />;
};

export default RoleGuard;
