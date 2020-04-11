import React, { useState, useContext } from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";

import "./Document.css";
import { store } from "../../../store.js";

function Document(props) {
  const { docs } = useContext(store);
  const [docSrc, setDocSrc] = useState("");

  const handleChange = (event) => {
    setDocSrc(event.target.value);
  };

  return (
    <>
      <FormControl
        style={{ marginLeft: "20px", marginBottom: "20px", align: "center" }}
      >
        <InputLabel id="select-doc">Select Document</InputLabel>
        <Select
          labelId="select-doc"
          id="select-doc"
          value={docSrc}
          onChange={handleChange}
          style={{ width: "200px" }}
        >
          {docs.map((d) => (
            <MenuItem value={d.docUrl}>{d.docName}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className={"Document-frame"}>
        <iframe
          title="document"
          src={docSrc}
          frameBorder="0"
          allowFullScreen={false}
        ></iframe>
      </div>
    </>
  );
}

export default Document;
