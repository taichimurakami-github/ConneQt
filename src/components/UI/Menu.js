import { appConfig } from "../../app.config";
import "../../styles/menu.scss";
import images from "../../images/Menu/_entry";

export const Menu = (props) => {
  const handlePageContent = (e) => {
    props.handlePageContent(e.target.id);
  };

  const isActivated = (id) => {
    switch (id) {
      case appConfig.pageContents["002"]:
        return props.pageContentState === appConfig.pageContents["002"];

      case appConfig.pageContents["003"]:
        return props.pageContentState === appConfig.pageContents["003"];

      case appConfig.pageContents["004"]:
        return props.pageContentState === appConfig.pageContents["004"];

      default:
        return false;
    }
  };

  return (
    <ul className="menu-wrapper">
      <MenuItem
        id={appConfig.pageContents["002"]}
        handleOnClick={handlePageContent}
        isActivated={isActivated(appConfig.pageContents["002"])}
        text="見つける"
        img={{
          active: images.icon_find_yellow,
          unactive: images.icon_find_gray,
        }}
      />
      <MenuItem
        id={appConfig.pageContents["003"]}
        handleOnClick={handlePageContent}
        isActivated={isActivated(appConfig.pageContents["003"])}
        text="友達一覧"
        img={{
          active: images.icon_friend_yellow,
          unactive: images.icon_friend_gray,
        }}
      />
      <MenuItem
        id={appConfig.pageContents["004"]}
        handleOnClick={handlePageContent}
        isActivated={isActivated(appConfig.pageContents["004"])}
        text="マイページ"
        img={{
          active: images.icon_mypage_yellow,
          unactive: images.icon_mypage_gray,
        }}
      />
    </ul>
  );
};

const MenuItem = (props) => {
  return (
    <li
      id={props.id}
      onClick={props.handleOnClick}
      className={`menu-item ${props?.isActivated && "active"} clickable`}
    >
      <img
        className="p-events-none icon"
        src={props.isActivated ? props.img.active : props.img.unactive}
        alt=""
      ></img>
      <span className="p-events-none text">{props.text}</span>
    </li>
  );
};
