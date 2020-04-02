import React from "react";
import "./Document.css";

function Document({ isOpen }) {
  return (
    <div className={isOpen ? "Document-modal-opened" : "Document-modal-closed"}>
      <iframe
        title="document"
        src="https://docs.google.com/presentation/d/e/2PACX-1vS-8ObYLMmB5QarJRM34yiDiUcGwHXdDfXQtrzpdEdwIM-QyU_3mehDpSu6l68p1BdneEHkp-_YC23E/embed?start=false&loop=false&delayms=60000"
        frameBorder="0"
        allowFullScreen={false}
        className={"Document-frame"}
      ></iframe>
    </div>
  );
}

export default Document;
