import loading from "../images/loading.gif";
import { appConfig } from "../app.config";
import { useState, useEffect } from "react/cjs/react.development";

//style import
import "../styles/modal.scss";


export const Modal = (props) => {

  const [modalState, setModalState] = useState();

  const handleModal = () => {

    switch (modalState) {
      case appConfig.components.modal.type["001"]:
        return <LoadingModal

        />;

      case appConfig.components.modal.type["002"]:
        return <ConfirmModal

        />

      default:
        return undefined;
    }
  }

  useEffect(() => {
    setModalState(props.state.modal)
  }, [props.state.type])

  return (
    <>
      <div className={`modal-wrapper ${props.state.display && "active"}`}>
        {props.state.display && modalState}
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
    <div className={`confirm-wrapper ${props?.class}`}>
      <h3>{props?.title}</h3>
      {
        props?.text.map((val) => {
          return <p>{val}</p>
        })
      }
    </div>
  )
}