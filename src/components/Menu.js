import { appConfig } from "../app.config";
import "../styles/menu.scss";

export const Menu = (props) => {
  console.log(props.pageContentState);

  const handlePageContent = (e) => props.handlePageContent(e.target.id);

  const handleActivation = (id) => {
    switch (id) {
      case appConfig.pageContents["002"]:
        return (
          props.pageContentState === appConfig.pageContents["002"] ||
          props.pageContentState === appConfig.pageContents["003"]
        )

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
        className={`menu-content ${handleActivation(appConfig.pageContents["002"]) && "active"} clickable`}>
        enspace
      </li>
      <li
        id={appConfig.pageContents["004"]}
        onClick={handlePageContent}
        className={`menu-content ${handleActivation(appConfig.pageContents["004"]) && "active"} clickable`} >
        mypage
      </li>
    </ul>
  )
}

