import "../../styles/UI/ControlledInput.scss";
import { DateOptions, MonthOptions, YearOptions } from "./Options";

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
        <>
          <textarea
            id={props.id}
            className={`${props?.className?.inputElement || ""} ${
              props?.statefulNavComponent ? "has-stateful-nav" : ""
            }`}
            placeholder={props?.text?.placeholder || ""}
            value={props.valueState}
            onChange={handleChange}
            maxLength={props?.maxLength}
            required={props?.required ? true : false}
          ></textarea>
        </>
      ) : props?.element === "select" ? (
        <select
          id={props.id}
          className={`${props?.className?.inputElement || ""} ${
            props?.statefulNavComponent ? "has-stateful-nav" : ""
          }`}
          value={props.valueState}
          onChange={handleChange}
          required={props?.required ? true : false}
        >
          {props.children}
        </select>
      ) : (
        <input
          id={props.id}
          className={`${props?.className?.inputElement || ""} ${
            props?.statefulNavComponent ? "has-stateful-nav" : ""
          }`}
          placeholder={props?.text?.placeholder ? props.text.placeholder : ""}
          value={props.valueState}
          onChange={handleChange}
          required={props?.required ? true : false}
          pattern={props?.pattern}
        ></input>
      )}
      {props?.statefulNavComponent}
    </>
  );
};

export const ControlledSelectYmd = (props) => {
  const selectedDate = props.valueState;
  const setSelectedDate = props.setValueState;

  const handleSelect = (key, val) => {
    setSelectedDate({ ...props.valueState, [key]: val });
  };

  return (
    <>
      <label>生年月日を入力</label>
      <div className="ymd-selects-wrapper">
        <select
          className="long-select"
          onChange={(e) => {
            handleSelect("y", e.target.value);
          }}
          value={selectedDate.y}
        >
          <YearOptions number={100} valueState={selectedDate} />
        </select>
        年
        <select
          className="short-select"
          onChange={(e) => {
            handleSelect("m", e.target.value);
          }}
          value={selectedDate.m}
        >
          <MonthOptions valueState={selectedDate} />
        </select>
        月
        <select
          className="short-select"
          onChange={(e) => {
            handleSelect("d", e.target.value);
          }}
          value={selectedDate.d}
        >
          <DateOptions valueState={selectedDate} />
        </select>
      </div>
    </>
  );
};
