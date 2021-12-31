import "../../styles/header.scss";
import arrow_lt from "../../images/arrow-lt-black.svg";

export const Header = (props) => {
  return (
    <header>
      <div
        className={`back-to-before-component ${
          props?.handleBack ? "active" : ""
        } clickable`}
        onClick={props?.handleBack}
      >
        <img className="arrow-lt" src={arrow_lt} alt=""></img>
        <span className="text">
          {props?.text?.backToButton ? props.text.backToButton : "戻る"}
        </span>
      </div>
      <h2 className="header-title">{props?.title}</h2>
      {props?.handleMenu && (
        <button
          type="button"
          className="header-menu-button btn-img"
          onClick={props.handleMenu}
        >
          {props?.text?.menuButton ? props.text.menuButton : "MENU"}
        </button>
      )}
    </header>
  );
};
