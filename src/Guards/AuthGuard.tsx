import { useSelector } from "react-redux";
import { AppStore } from "../Redux/store";
import { Navigate, Outlet } from "react-router-dom";
import { PublicRoutes } from "../models/routes";

const AuthGuard = () => {
  const userState = useSelector((store: AppStore) => store.user);
  console.log(userState);
  return userState.name ? <Outlet /> : <Navigate to={PublicRoutes.LOGIN.route} />;
};
export default AuthGuard;
