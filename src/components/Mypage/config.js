
export const cmpConfig = {
  state: {
    view: {
      "001": "MYPAGE_TOP",
      "002": "MYPAGE_EDIT_ACCOUNT_IMAGE",
      "003": "MYPAGE_EDIT_ACCOUNT_NAME",
      "004": "MYPAGE_EDIT_ACCOUNT_STATE",
      "005": "MYPAGE_EDIT_ACCOUNT_PROFILE",
    }
  },

  "001": {
    id: "TOP",
    header: {
      title: "マイページ",
      backable: false
    }
  },
  "002": {
    id: "CHANGE_ICON",
    header: {
      title: "マイページ > アイコンを編集",
      backable: true,
    },
    content: {

    }
  },
  "003": {
    id: "CHANGE_NAME",
    header: {
      title: "マイページ > お名前を編集",
      backable: true,
    },
    content: {
      title: "アカウント名を入力してください",
    }
  },
  "004": {
    id: "CHANGE_STATUS",
    header: {
      title: "マイページ > 状態を編集",
      backable: true,
    },
    content: {
      title: "ステータスを入力してください(0 or 1 半角英数字のみ)",
    },
  },
  "005": {
    id: "CHANGE_PROFILE",
    header: {
      title: "マイページ > プロフィール文を編集",
      backable: true
    },
    content: {
      title: "プロフィールを入力してください",
    },
  }
}