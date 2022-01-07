export const UncontrolledInputFIle = (props) => {
  const handleFile = (e) => {
    const file = e.target.files[0];
    props.setValueState(file);
  };

  return (
    <>
      {props?.text?.label && (
        <label
          className={props?.className?.label ? props.className.label : ""}
          htmlFor={props.id}
        >
          {props.text.label}
        </label>
      )}
      <input
        id={props.id}
        type="file"
        onChange={handleFile}
        accept={props.accept}
        multiple={props?.multiple || false}
      ></input>
    </>
  );
};
