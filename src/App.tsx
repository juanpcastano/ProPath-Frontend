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
import MiPath from "./Pages/Mi Path/MiPath";

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
              <Route path={PublicRoutes.REGISTER.route} element={<Register />} />
              <Route path="*" element={<NotFound />} />
              <Route element={<AuthGuard />}>
                <Route element={<Layout />}>
                  {/* Rutas comunes */}
                  <Route path={PrivateRoutes.common.HOME.route} element={<Home/>} />
                  <Route path={PrivateRoutes.common.MI_PATH.route} element={<MiPath/>} />
                  <Route path={PrivateRoutes.commonDown.SETTINGS.route} element={<Settings />} />
                  <Route path={PrivateRoutes.commonDown.SETTINGS.route+"/profile"} element={<Settings tab="profile" />} />
                  
                  <Route element={<RoleGuard role="pro" />}>
                    {/*rutas del rol A*/}
                  </Route>
                  <Route element={<RoleGuard role="coach" />}>
                    {/*rutas del rol B*/}
                  </Route>
                  <Route element={<RoleGuard role="admin" />}>
                    {/*rutas del rol C*/}
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