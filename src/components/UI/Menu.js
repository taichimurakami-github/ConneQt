import { appConfig } from "../../app.config";
import "../../styles/menu.scss";

export const Menu = (props) => {

  const handlePageContent = (e) => props.handlePageContent(e.target.id);

  const isActivated = (id) => {
    switch (id) {
      case appConfig.pageContents["002"]:
        return props.pageContentState === appConfig.pageContents["002"];

      case appConfig.pageContents["003"]:
        return props.pageContentState === appConfig.pageContents["003"];

      case appConfig.pageContents["004"]:
        return props.pageContentState === appConfig.pageContents["004"]

      default:
        return false;
    }
  }

  return (
    <ul className="menu-wrapper">
      <li
        id={appConfig.pageContents["002"]}
        onClick={handlePageContent}
        className={`menu-content ${isActivated(appConfig.pageContents["002"]) && "active"} clickable`}>
        見つける
      </li>
      <li
        id={appConfig.pageContents["003"]}
        onClick={handlePageContent}
        className={`menu-content ${isActivated(appConfig.pageContents["003"]) && "active"} clickable`}>
        <span className="notification orange"></span>
        友達一覧
      </li>
      <li
        id={appConfig.pageContents["004"]}
        onClick={handlePageContent}
        className={`menu-content ${isActivated(appConfig.pageContents["004"]) && "active"} clickable`} >
        マイページ
      </li>
    </ul>
  )
}

