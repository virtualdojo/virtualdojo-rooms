import React from "react";
import "./Document.css";

function Document(props) {
  return (
    <div className={"Document-frame"}>
      <iframe
        title="document"
        src={props.src}
        frameBorder="0"
        allowFullScreen={false}
      ></iframe>
    </div>
  );
}

export default Document;
