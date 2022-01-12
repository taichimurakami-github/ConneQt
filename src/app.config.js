export const appConfig = {
  AppMode: {
    "000": "PRODUCTION",
    "001": "DEVELOPMENT",
    "002": "DEV_TEST",
  },
  initialState: {
    modalState: {
      display: false,
      type: null,
      closeable: false,
      content: null,
    },
  },
  components: {
    modal: {
      type: {
        "001": "LOADING",
        "002": "CONFIRM",
        "003": "ERROR",
      },
    },
  },
  routePageContents: {
    "001": "NOT_SIGNED_IN",
    "002": "REGISTRATION",
    "003": "APP",
  },
  pageContents: {
    "001": "NOT_SIGNED_IN",
    "002": "FIND_USERS",
    "003": "CHAT",
    "004": "MY_PAGE",
  },
};

export const appInfo = {
  version: "2022.01.11__001",
  mode: "beta",
  db: "firestore",
  contact: "conneqtu@gmail.com",
  copyright: "ConneQt",
};
