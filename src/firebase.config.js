const firebaseConfig = {
  apiKey: "AIzaSyCI1PY_eRbAnjRVTdRSpzgS4psJKeFXOOo",
  authDomain: "gls-conneqt-hey-demo002.firebaseapp.com",
  projectId: "gls-conneqt-hey-demo002",
  storageBucket: "gls-conneqt-hey-demo002.appspot.com",
  messagingSenderId: "685488696857",
  appId: "1:685488696857:web:cec235e5c4056f4dd24488"
}

const userDocTemplate = {
  uid: '',
  name: '',
  email: '',
  photo: '',
  profile: 'これはあなたのプロフィールです。早速編集してみましょう！',
  state: '1'
}

export { firebaseConfig, userDocTemplate }