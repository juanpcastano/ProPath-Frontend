import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { PrivateRoutes, PublicRoutes } from "./models/routes";
import AuthGuard from "./Guards/AuthGuard";
import { Provider } from "react-redux";
import store from "./Redux/store";

import { Suspense, lazy } from "react";
import Loading from "./Components/Loading/Loading";
import Register from "./Pages/Login/Register";
import Home from "./Pages/Home/Home";
import Path from "./Pages/Path/Path";
import MyOrganization from "./Pages/My Organization/MyOrganization";
import User from "./Pages/User/User";
import AddUser from "./Pages/AddUser/AddUser";
import MyPaths from "./Pages/MyPaths/MyPaths";
import AddGroup from "./Pages/AddGroup/AddGroup";
import Group from "./Pages/Group/Group";
import MyGroups from "./Pages/MyGroups/MyGroups";
import Restablish from "./Pages/Login/Restablish";

const NotFound = lazy(() => import("./Pages/Not found/NotFound"));
const Layout = lazy(() => import("./Pages/Layout/Layout"));
const Login = lazy(() => import("./Pages/Login/Login"));
const Settings = lazy(() => import("./Pages/Settings/Settings"));
const RoleGuard = lazy(() => import("./Guards/RoleGuard"));

function App() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={<Navigate to={PrivateRoutes.common.HOME.route} />}
              />
              <Route path={PublicRoutes.LOGIN.route} element={<Login />} />
              <Route path={PublicRoutes.RESTABLISH.route} element={<Restablish />} />
              <Route path={PublicRoutes.REGISTER.route} element={<Register />} />
              <Route path="*" element={<NotFound />} />
              <Route element={<AuthGuard />}>
                <Route element={<Layout />}>
                  {/* Rutas comunes */}
                  <Route path={PrivateRoutes.common.HOME.route} element={<Home/>} />
                  <Route path={PrivateRoutes.common.MY_PATH.route} element={<MyPaths/>} />
                  <Route path={PrivateRoutes.common.MY_ORGANIZATION.route} element={<MyOrganization/>} />
                  <Route path={PrivateRoutes.common.MY_ORGANIZATION.route + "/path/:id"} element={<Path/>} />
                  <Route path={PrivateRoutes.common.MY_ORGANIZATION.route + "/user/:id"} element={<User/>} />
                  <Route path={PrivateRoutes.common.MY_ORGANIZATION.route + "/group/:id"} element={<Group/>} />
                  <Route path={PrivateRoutes.common.MY_TEAM.route} element={<MyGroups/>} />
                  <Route path={PrivateRoutes.commonDown.SETTINGS.route} element={<Settings />} />
                  <Route path={PrivateRoutes.commonDown.SETTINGS.route+"/profile"} element={<Settings tab="Profile" />} />
                  
                  <Route element={<RoleGuard role="P" />}>
                  </Route>
                  <Route element={<RoleGuard role="A" />}>
                    <Route path={PrivateRoutes.common.MY_ORGANIZATION.route + "/AddUser"} element={<AddUser/>} />
                    <Route path={PrivateRoutes.common.MY_ORGANIZATION.route + "/AddGroup"} element={<AddGroup/>} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </Provider>
      </Suspense>
    </>
  );
}

export default App;