import React from "react";
import ReactDOM from "react-dom";
import { AuthHandler } from "./AppRoute";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

ReactDOM.render(
  <React.StrictMode>
    <AuthHandler />
  </React.StrictMode>,
  document.getElementById("root")
);

// register serviceWorker
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    //強制自動アップデートを実行
    registration.waiting?.postMessage({ type: "SKIP_WAITING" });
    window.location.reload();
  },
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
