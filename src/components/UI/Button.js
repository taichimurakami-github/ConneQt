import "../../styles/UI/Button.scss";

export const ChoiceActionButton = (props) => {
  return (
    <div
      className={`modal-confirm-button-container ${
        props?.reverseOrder ? "reverse" : ""
      }`}
    >
      <button
        type="button"
        className="btn-yes btn-orange"
        onClick={props.callback.yes}
        {...props?.attributes?.yes}
      >
        {props?.text?.yes ? props.text.yes : "はい"}
      </button>
      <button
        type="button"
        className="btn-no btn-gray"
        onClick={props.callback.no}
        {...props?.attributes?.no}
      >
        {props?.text?.no ? props.text.no : "いいえ"}
      </button>
    </div>
  );
};
