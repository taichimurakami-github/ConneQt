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
};

const firebaseConfig = { ...firebase_configData[appInfo.mode] };

const firestoreQueryConfig = {
  array_max_length: 10,
};

const db_name = {
  user: "users",
  chatRoom: "chatRoom",
};

const userDocTemplate = {
  uid: "",
  name: "",
  age: "",
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

  meta: [], //firestoreでOR検索するための苦肉の策として入れる。
};

export { firebaseConfig, firestoreQueryConfig, userDocTemplate, db_name };
