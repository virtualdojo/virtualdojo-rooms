import React from "react";
import "./ErrorMessage.css";

function ErrorMessage(props) {
  const { errorCode } = props;

  function getErrorMessage() {
    switch (errorCode) {
      default:
        return "Oops, something went wrong.";
    }
  }
  return errorCode ? <p className="error">{getErrorMessage()}</p> : null;
}

export default ErrorMessage;
