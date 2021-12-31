export const ConfirmModal = (props) => {
  return (
    <div
      className={`modal-container white confirm ${
        props?.className?.wrapper ? props.className.wrapper : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <h3 className="title">{props?.title}</h3>
      {props?.text &&
        props?.text.map((val) => {
          return <p className="text">{val}</p>;
        })}

      {props?.children ? (
        props.children
      ) : (
        <button className="btn-gray btn-close" onClick={props.handleClose}>
          閉じる
        </button>
      )}
    </div>
  );
};
