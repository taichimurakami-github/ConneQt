import { appConfig } from "../app.config";
import { useState, useEffect } from "react/cjs/react.development";

//modal import
import { LoadingModal } from "./Modal/LoadingModal";
import { ConfirmModal } from "./Modal/ConfirmModal";

//style import
import "../styles/modal.scss";

export const ModalHandler = (props) => {
  const [modalState, setModalState] = useState(props.state);

  const handleModal = () => {
    switch (modalState.type) {
      case appConfig.components.modal.type["001"]:
        return <LoadingModal />;

      case appConfig.components.modal.type["002"]:
        return (
          <ConfirmModal
            title={modalState.content.title}
            text={modalState.content.text}
          />
        );

      default:
        return undefined;
    }
  };

  const handleClose = () => {
    modalState.closable &&
      props.handleModalState(appConfig.initialState.App.modalState);
  };

  useEffect(() => {
    setModalState(props.state);
  }, [props.state]);

  return (
    <>
      <div
        className={`modal-wrapper ${props.state.display && "active"}`}
        onClick={handleClose}
      >
        {props.state.display && handleModal()}
      </div>
    </>
  );
};
