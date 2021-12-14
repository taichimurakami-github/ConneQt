export const appConfig = {
  initialState: {
    App: {
      modalState: {
        display: false,
        type: null,
        closeable: false,
        content: null
      }
    }
  },
  components: {
    modal: {
      type: {
        "001": "LOADING",
        "002": "CONFIRM",
        "003": "ERROR",
      }
    },
  },
  pageContents: {
    "001": "NOT_SIGNED_IN",
    "002": "USERS_LIST",
    "003": "USER_PROFILE",
    "004": "MY_PAGE",
  }
}