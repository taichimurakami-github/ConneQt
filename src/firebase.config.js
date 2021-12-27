const firebaseConfig = {
  apiKey: "AIzaSyCI1PY_eRbAnjRVTdRSpzgS4psJKeFXOOo",
  authDomain: "gls-conneqt-hey-demo002.firebaseapp.com",
  projectId: "gls-conneqt-hey-demo002",
  storageBucket: "gls-conneqt-hey-demo002.appspot.com",
  messagingSenderId: "685488696857",
  appId: "1:685488696857:web:cec235e5c4056f4dd24488",
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
  request: {
    received: [],
    sent: [],
    rejected: [],
  },
  friend: [],
  meta: [], //firestoreでOR検索するための苦肉の策として入れる。
};

export { firebaseConfig, userDocTemplate };
