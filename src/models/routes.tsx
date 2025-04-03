export const PublicRoutes = {
  LOGIN: { route: "/login" },
  REGISTER: { route: "/register" },
};

export const PrivateRoutes = {

  common: {
    HOME: { icon: "home", label: "Panel Principal", route: "/home" },
    MY_PATH: { icon: "road", label: "Mi Path", route: "/mypath" },
    MY_ORGANIZATION: { icon: "corporate_fare", label: "Mi Organización", route: "/myorganization" },
  },

  P: {
    a: { icon: "a", label: "a", route: "#" },
  },
  A: {
    a: { icon: "a", label: "a", route: "#" },
  },

  commonDown:{
    SETTINGS: { icon: "settings", label: "Configuración", route: "/settings" },
  }
};
