import { useState } from "react";
import { Header } from "../UI/Header";
import { ControlledInputText } from "../UI/InputText";
import { cmpConfig } from "./config";

export const EditText = (props) => {
  const [inputState, setInputState] = useState(props.defaultValue);
  let ControlledInputProps = {};
  let h2TitleText = "";

  const generateHeaderTitle = () => {
    switch (props.viewState) {
      case cmpConfig.state.view["003"]:
        ControlledInputProps = {
          text: {
            label: "お名前を30文字以内で入力",
            placeholder: "お名前を入力",
          },
          maxLength: 30,
          statefulNavComponent: (
            <p>
              {inputState.length}/{30}
            </p>
          ),
        };

        return (h2TitleText = "お名前を編集");
      case cmpConfig.state.view["005"]:
        ControlledInputProps = {
          text: {
            label: "プロフィールを100文字以内で入力",
            placeholder: "プロフィールを入力",
          },
          maxLength: 100,
          statefulNavComponent: (
            <p>
              {inputState.length}/{100}
            </p>
          ),
        };
        return (h2TitleText = "プロフィール編集");
      default:
        return "";
    }
  };

  const isAbleToSubmit = () => {
    return (
      inputState !== props.defaultValue && props.handleValidate(inputState)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    props.handleSubmit(inputState);
  };

  return (
    <>
      <Header
        title={generateHeaderTitle()}
        backable={true}
        handleBack={() => props.handleViewState(cmpConfig.state.view["001"])}
      />

      <form className="app-view-container" onSubmit={handleSubmit}>
        <h2 className="input-target-title">{h2TitleText}</h2>
        <ControlledInputText
          id={props.viewState}
          element={props.inputMode}
          valueState={inputState}
          setValueState={setInputState}
          required={true}
          maxLength={30}
          {...ControlledInputProps}
        >
          {props.children}
        </ControlledInputText>
        <button
          className="btn-orange"
          type="submit"
          disabled={!isAbleToSubmit()}
        >
          この内容に変更する
        </button>
      </form>

      <button
        className="btn-gray"
        onClick={() => props.handleViewState(cmpConfig.state.view["001"])}
      >
        前のページに戻る
      </button>
    </>
  );
};
