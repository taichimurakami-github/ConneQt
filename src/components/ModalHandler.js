import { appConfig } from "../app.config";
import { useContext } from "react";

//modal import
import { LoadingModal } from "./Modal/LoadingModal";
import { ConfirmModal } from "./Modal/ConfirmModal";
import { ErrorModal } from "./Modal/ErrorModal";
import { AppRouteContext } from "../AppRoute";

//style import
import "../styles/modal.scss";

export const ModalHandler = () => {
  const { modalState, eraceModal } = useContext(AppRouteContext);

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
      case appConfig.components.modal.type["003"]:
        return (
          <ErrorModal
            title={modalState.content.title}
            text={modalState.content.text}
          />
        );

      default:
        return undefined;
    }
  };

  const handleClose = () => {
    modalState.closable && eraceModal();
  };

  return (
    <>
      <div
        className={`modal-wrapper ${modalState.display && "active"}`}
        onClick={handleClose}
      >
        {modalState.display && handleModal()}
      </div>
    </>
  );
};
