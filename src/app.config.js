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
  localStorage: {
    "001": {
      id: "CHATROOM_USER_ACTION_LOG",
      template: {
        chatRoom: {},
      },
    },
    "002": {
      id: "APP_USER_NAVIGATON_MODAL_ARGS",
      template: {
        type: null,
      },
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
  appName: "Dezamii",
  version: "1.0.4",
  mode: "beta_public",
  db: "firestore",
  contact: "conneqtu@gmail.com",
  twitter: "https://twitter.com/Dezamii_ConneQt",
  copyright: "ConneQt",
};
