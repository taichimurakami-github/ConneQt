export const ErrorModal = (props) => {
  return (
    <div
      className={`modal-container white error ${
        props?.className?.wrapper ? props.className.wrapper : ""
      }`}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <h3 className="title">{props?.title}</h3>
      {props?.text.map((val) => {
        return <p className="text">{val}</p>;
      })}
      {props?.children}
      {props?.children ? undefined : (
        <button className="btn-gray btn-close">閉じる</button>
      )}
    </div>
  );
};
