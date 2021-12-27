import { useState } from "react";
import { userDocTemplate } from "../firebase.config";

export const RegisterHandler = (props) => {
  const [registerDataState, setRegisterDataState] = useState({
    ...userDocTemplate,
  });
  const [stepState, setStepState] = useState(0);
  const [viewState, handleViewState] = useState();

  return <></>;
};
