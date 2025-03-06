export const PublicRoutes = {
  LOGIN: { route: "/login" },
  REGISTER: { route: "/register" },
};

export const PrivateRoutes = {

  common: {
    HOME: { icon: "home", label: "Panel Principal", route: "/home" },
    MI_PATH: { icon: "road", label: "Mi Path", route: "/mypath" },
  },

  pro: {
    a: { icon: "a", label: "a", route: "#" },
    b: { icon: "b", label: "b", route: "#" },
    c: { icon: "c", label: "c", route: "#" },
  },
  coach: {
    a: { icon: "a", label: "a", route: "#" },
    b: { icon: "b", label: "b", route: "#" },
    c: { icon: "c", label: "c", route: "#" },
  },
  admin: {
    a: { icon: "a", label: "a", route: "#" },
    b: { icon: "b", label: "b", route: "#" },
    c: { icon: "c", label: "c", route: "#" },
  },

  commonDown:{
    SETTINGS: { icon: "settings", label: "Configuración", route: "/settings" },
  }
};
