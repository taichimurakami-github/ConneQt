import "../../styles/UI/ControlledInput.scss";

export const ControlledInputText = (props) => {
  const handleChange = (e) => {
    props.setValueState(e.target.value);
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
      {props?.element === "textarea" ? (
        <textarea
          id={props.id}
          className={props?.className?.textarea ? props.className.textarea : ""}
          placeholder={props?.text?.placeholder ? props.text.placeholder : ""}
          value={props.valueState}
          pattern={props}
          onChange={handleChange}
          required={props?.required ? true : false}
        ></textarea>
      ) : props?.element === "select" ? (
        <select
          id={props.id}
          className={props?.className?.textarea ? props.className.textarea : ""}
          value={props.valueState}
          onChange={handleChange}
          required={props?.required ? true : false}
        >
          {props.children}
        </select>
      ) : (
        <input
          id={props.id}
          className={props?.className?.input ? props.className.input : ""}
          placeholder={props?.text?.placeholder ? props.text.placeholder : ""}
          value={props.valueState}
          onChange={handleChange}
          required={props?.required ? true : false}
          pattern={props?.pattern}
        ></input>
      )}
    </>
  );
};
