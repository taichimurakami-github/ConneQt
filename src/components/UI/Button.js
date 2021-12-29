import "../../styles/UI/Button.scss";

export const ModalConfirmButton = (props) => {
  return (
    <div className="modal-confirm-button-container">
      <button
        type="button"
        className="btn-yes btn-orange"
        onClick={props.callback.yes}
      >
        {props?.text?.yes ? props.text.yes : "はい"}
      </button>
      <button
        type="button"
        className="btn-no btn-gray"
        onClick={props.callback.no}
      >
        {props?.text?.no ? props.text.no : "いいえ"}
      </button>
    </div>
  );
};
