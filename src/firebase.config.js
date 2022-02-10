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
  beta_public: {
    apiKey: "AIzaSyD883q-fz5CRGPCjJe8FAS_5PjWFBclidQ",
    authDomain: "dezamii-beta-2d77f.firebaseapp.com",
    projectId: "dezamii-beta-2d77f",
    storageBucket: "dezamii-beta-2d77f.appspot.com",
    messagingSenderId: "578671779959",
    appId: "1:578671779959:web:7dc5dfc5267de366c7e672",
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
        diff: { plus: 100, minus: 100 },
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
