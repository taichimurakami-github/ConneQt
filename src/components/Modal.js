import loading from "../images/loading.gif";
import { appConfig } from "../app.config";
import { useState, useEffect } from "react/cjs/react.development";

//style import
import "../styles/modal.scss";


export const Modal = (props) => {

  const [modalState, setModalState] = useState(props.state);

  const handleModal = () => {

    switch (modalState.type) {
      case appConfig.components.modal.type["001"]:
        return <LoadingModal

        />;

      case appConfig.components.modal.type["002"]:
        return <ConfirmModal
          title={modalState.content.title}
          text={modalState.content.text}
        />

      default:
        return undefined;
    }
  }

  const handleClose = () => {
    modalState.closable && props.handleModalState(appConfig.initialState.App.modalState);
  }

  useEffect(() => {
    setModalState(props.state)
  }, [props.state])

  return (
    <>
      <div className={`modal-wrapper ${props.state.display && "active"}`} onClick={handleClose}>
        {props.state.display && handleModal()}
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

const ConfirmModal = (props) => {
  return (
    <div className={`modal-container white confirm ${props?.class}`}>
      <h3 className="title">{props?.title}</h3>
      {
        props?.text.map((val) => {
          return <p className="text">{val}</p>
        })
      }
      <button className="btn-gray btn-close">閉じる</button>
    </div>
  )
}