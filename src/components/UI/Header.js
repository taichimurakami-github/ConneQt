import "../../styles/header.scss";
import arrow_lt from "../../images/arrow-lt-black.svg";

export const Header = (props) => {


  return (
    <header>
      <div
        className={`back-to-before-component ${props?.backable ? "active" : ""} clickable`}
        onClick={props?.handleBack}>
        <img className="arrow-lt" src={arrow_lt}></img>
        <span className="text">戻る</span>
      </div>
      <h1>{props?.title}</h1>
    </header>
  )
}