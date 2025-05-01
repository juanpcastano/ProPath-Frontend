export const PublicRoutes = {
  LOGIN: { route: "/login" },
  REGISTER: { route: "/register" },
};

export const PrivateRoutes = {

  common: {
    HOME: { icon: "home", label: "Panel Principal", route: "/home" },
    MY_PATH: { icon: "road", label: "Mi Path", route: "/mypath" },
    MY_ORGANIZATION: { icon: "corporate_fare", label: "Mi Organización", route: "/myorganization" },
    MY_TEAM: { icon: "groups", label: "Mis Grupos", route: "/mygroups" },
  },

  P: {
  },
  A: {
  },

  commonDown:{
    SETTINGS: { icon: "settings", label: "Configuración", route: "/settings" },
  }
};
