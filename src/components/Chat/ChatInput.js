import { useState, useContext } from "react";

export const InputChatText = (props) => {
  const [inputState, setInputState] = useState("");

  const handleTextInput = (e) => {
    setInputState(e.target.value);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    props.handleOnSubmit(inputState);
    setInputState("");
  };

  const isAbleToSend = () => {
    return inputState !== "" && props.isActivated;
  };

  return (
    <>
      <form
        className="chat-input-form"
        style={{ background: "white" }}
        onSubmit={handleOnSubmit}
      >
        <textarea
          className="input-text-area"
          value={inputState}
          onChange={handleTextInput}
          onFocus={() => {
            props.handleInputFocus(true);
          }}
          onBlur={() => {
            props.handleInputFocus(false);
          }}
        ></textarea>
        <button type="submit" className="btn-orange" disabled={!isAbleToSend()}>
          送信
        </button>
      </form>
    </>
  );
};
