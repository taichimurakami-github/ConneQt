import { useState } from "react";
import { Header } from "../UI/Header";
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
        return "状態を編集";
      case cmpConfig.state.view["005"]:
        return "プロフィール編集";
      default:
        return "";
    }
  };

  const handleInput = (e) => {
    setInputState(e.target.value);
  };

  const handleSubmit = () => props.handleSubmit(inputState);

  return (
    <>
      <Header
        title={generateHeaderTitle()}
        backable={true}
        handleBack={() => props.handleViewState(cmpConfig.state.view["001"])}
      />
      <h2 className="input-target-title">{props.title}</h2>
      {props?.inputMode === "textarea" ? (
        <textarea
          onChange={handleInput}
          placeholder={props.title}
          value={inputState}
          className="text-input"
        />
      ) : (
        <input
          onChange={handleInput}
          placeholder={props.title}
          value={inputState}
          className="text-input"
        />
      )}
      <button className="btn-orange" onClick={handleSubmit}>
        この内容に変更する
      </button>
      <button
        className="btn-gray"
        onClick={() => props.handleViewState(cmpConfig.state.view["001"])}
      >
        前のページに戻る
      </button>
    </>
  );
};
