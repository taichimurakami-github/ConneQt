import loading from "../images/loading.gif";
import { appConfig } from "../app.config";
import { useEffect, useReducer } from "react/cjs/react.development";

//style import
import "../styles/modal.scss";

const modalReducer = (state, action) => {
  switch (action.type) {
    case appConfig.components.modal.type["001"]:
      return <LoadingModal />;

    default:
      return undefined;
  }
}

export const Modal = (props) => {

  const [activeModal, dispatch] = useReducer(modalReducer, undefined);

  useEffect(() => {

    dispatch({
      type: props.state.type
    });

  }, [props.state.type])

  return (
    <>
      <div className={`modal-wrapper ${props.state.display && "active"}`}>
        {props.state.display && activeModal}
      </div>
    </>
  )
}

const LoadingModal = () => {
  return (
    <div className="loading-wrapper">
      <img src={loading}></img>
    </div>
  )
}