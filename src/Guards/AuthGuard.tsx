import { useSelector } from "react-redux";
import { AppStore } from "../Redux/store";
import { Navigate, Outlet } from "react-router-dom";
import { PublicRoutes } from "../models/routes";

const AuthGuard = () => {
  const userState = useSelector((store: AppStore) => store.user);

  return userState.id ? <Outlet /> : <Navigate to={PublicRoutes.LOGIN.route} />;
};
export default AuthGuard;
