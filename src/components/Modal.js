import loading from "../images/loading.gif";
import { appConfig } from "../app.config";

export const Modal = (props) => {

  const modalHandler = () => {
    switch (props.state.type) {

      case appConfig.components.modal.type["001"]:
        //loading
        return <LoadingModal />

      case appConfig.components.modal.type["002"]:
        //confirm
        return;

      case appConfig.components.modal.type["003"]:
        //error
        return;
    }
  }

  return (
    <>
      {props.state.display && modalHandler()}
    </>
  )
}

const LoadingModal = () => {
  return (
    <img src={loading}></img>
  )
}