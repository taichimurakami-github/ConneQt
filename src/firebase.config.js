import { appInfo } from "./app.config";

const firebase_configData = {
  develop: {
    apiKey: "AIzaSyCI1PY_eRbAnjRVTdRSpzgS4psJKeFXOOo",
    authDomain: "gls-conneqt-hey-demo002.firebaseapp.com",
    projectId: "gls-conneqt-hey-demo002",
    storageBucket: "gls-conneqt-hey-demo002.appspot.com",
    messagingSenderId: "685488696857",
    appId: "1:685488696857:web:cec235e5c4056f4dd24488",
  },
  beta: {
    apiKey: "AIzaSyADqsBqNzdiHTz3vtQTYL202Ai9b6NFbhE",
    authDomain: "gls-conneqt-hey-beta-001.firebaseapp.com",
    projectId: "gls-conneqt-hey-beta-001",
    storageBucket: "gls-conneqt-hey-beta-001.appspot.com",
    messagingSenderId: "753030643012",
    appId: "1:753030643012:web:cdeca0e58c0a7eeee3ab11",
  },
  beta_public_01: {
    apiKey: "AIzaSyCjxwdnAKpWA9t4A2-30w3wAbP3rxAzrpM",
    authDomain: "hey-beta-002.firebaseapp.com",
    projectId: "hey-beta-002",
    storageBucket: "hey-beta-002.appspot.com",
    messagingSenderId: "663845218100",
    appId: "1:663845218100:web:ec56d5e29107021ce06761",
  },
};

const firebaseConfig = { ...firebase_configData[appInfo.mode] };

const firestoreQueryConfig = {
  array_max_length: 10,
};

const db_name = {
  user: "users",
  chatRoom: "chatRooms",
  appInfo: "appInfo",
};

const userDocTemplate = {
  uid: "",
  name: "",
  birthday: { y: "", m: "", d: "" },
  gender: "",
  email: "",
  photo: "",
  hometown: {
    prefecture: "",
    city: "",
  },
  history: {
    university: "",
  },
  profile: "",
  location: {
    lat: "",
    lng: "",
  },
  friend: {},
  request: {
    received: [],
    sent: [],
    rejected: [],
  },
  setting: {
    matching: {
      age: {
        diff: { plus: 2, minus: 2 },
      },
      hometown: {
        prefecture: true,
        city: true,
      },
      history: {
        university: true,
      },
    },
  },
  meta: [], //firestoreでOR検索するための苦肉の策として入れる。
};
/**
 * 年齢差
 * 県、市を含めるか
 * 大学を含めるか
 *
 * ＜将来的に＞
 * 学部、学科を含めるか
 *
 */

export { firebaseConfig, firestoreQueryConfig, userDocTemplate, db_name };
