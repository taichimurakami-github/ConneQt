import React from "react";
import { appInfo } from "../app.config";
import "../styles/UI/ErrorBoundary.scss";
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary-container">
          <p>
            エラーが発生しました。<br></br>
            アップデートで問題が解決する可能性があります。
          </p>
          <p></p>
          <button
            className="btn-orange"
            onClick={() => {
              window.location.reload(true);
            }}
          >
            アプリケーションをアップデートする
          </button>
          <p>
            アップデートを行ってもこの問題が表示される場合、以下の解決策をお試しください。
          </p>
          <ul className="error-navigation">
            <li>
              1.
              <a href={`mailto:${appInfo.contact}`}>
                {appInfo.contact} へ連絡する
              </a>
            </li>
            <li>
              2. <a href={appInfo.twitter}>{appInfo.appName}公式Twitter</a>
              にアクセスし、アップデート情報を確認する
            </li>
            <li>TwitterのDM上での対応も可能です。お気軽にご連絡ください。</li>
            <li>アップデート情報は随時公式Twitterにてお知らせします。</li>
          </ul>
        </div>
      );
    }

    return this.props.children;
  }
}
