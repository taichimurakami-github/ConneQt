import { useState } from "react";


export const EditText = (props) => {

  const [inputState, setInputState] = useState(props.nowData);


  const handleInput = (e) => {
    setInputState(e.target.value);
  }

  const handleSubmit = () => props.handleSubmit(props.type, inputState);


  return (
    <>
      <h2 className="input-target-title">{props.title}</h2>
      <input
        onChange={handleInput}
        placeholder={props.title}
        value={inputState}
        className="text-input"
      />
      <button className="btn-orange" onClick={handleSubmit}>この内容に変更する</button>
      <button className="btn-gray" onClick={props.handleBackToTop}>戻る</button>
    </>
  )
}