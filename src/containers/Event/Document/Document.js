import React from "react";
import "./Document.css";

function Document() {
  return (
    <iframe
      title="document"
      src="https://docs.google.com/presentation/d/e/2PACX-1vS-8ObYLMmB5QarJRM34yiDiUcGwHXdDfXQtrzpdEdwIM-QyU_3mehDpSu6l68p1BdneEHkp-_YC23E/embed?start=false&loop=false&delayms=60000"
      frameBorder="0"
      allowFullScreen={false}
      className={"Document-frame"}
    ></iframe>
  );
}

export default Document;
