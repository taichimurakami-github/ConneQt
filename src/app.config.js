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
    mypage: {
      type: {
        "001": "TOP",
        "002": "CHANGE_ICON",
        "003": "CHANGE_NAME",
        "004": "CHANGE_STATUS",
        "005": "CHANGE_PROFILE"
      },
      header: {
        "TOP": {
          title: "マイページ",
          backable: false
        },
        "002": {
          title: "マイページ &gt; アイコンを編集",
          backable: true,
        },
        "003": {
          title: "マイページ &gt; お名前を編集",
          backable: true,
        },
        "004": {
          title: "マイページ &gt; 状態を編集",
          backable: true,
        },
        "005": {
          title: "マイページ &gt; プロフィール文を編集",
          backable: true
        }
      }
    }
  },
  pageContents: {
    "001": "NOT_SIGNED_IN",
    "002": "USERS_LIST",
    "003": "USER_PROFILE",
    "004": "MY_PAGE",
  }
}