import { useState } from "react";
import { Header } from "../UI/Header";
import { ControlledInputText } from "../UI/InputText";
import { cmpConfig } from "./config";

export const EditText = (props) => {
  const [inputState, setInputState] = useState("");

  const generateHeaderTitle = () => {
    switch (props.viewState) {
      case cmpConfig.state.view["002"]:
        return "アイコンを編集";
      case cmpConfig.state.view["003"]:
        return "お名前を編集";
      case cmpConfig.state.view["004"]:
        return "年齢を編集";
      case cmpConfig.state.view["005"]:
        return "プロフィール編集";
      default:
        return "";
    }
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

      <form onSubmit={handleSubmit}>
        <h2 className="input-target-title">{props.title}</h2>
        <ControlledInputText
          id={props.viewState}
          element={props.inputMode}
          valueState={inputState}
          setValueState={setInputState}
          required={true}
          {...props}
        >
          {props.children}
        </ControlledInputText>
        <button className="btn-orange" type="submit">
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
