import React, { useState, useContext } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Collapse,
} from "@material-ui/core";

import {
  Delete as DeleteIcon,
  AddCircle as AddCircleIcon,
} from "@material-ui/icons";

import AddDoc from "./AddDoc";
import "./Document.css";
import { store } from "../../../store.js";

function Document(props) {
  const { currentUser, docs, deleteDoc } = useContext(store);
  const [docId, setDocId] = useState("");
  const [docSrc, setDocSrc] = useState("");
  const [expanded, setExpanded] = React.useState(false);

  const handleDeleteDoc = () => {
    deleteDoc(docId);
    setDocId("");
    setDocSrc("");
  };

  const handleChangeDoc = (event) => {
    const url = docs.find((d) => d.docId === event.target.value);
    setDocId(event.target.value);
    setDocSrc(url.docUrl);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <FormControl
          style={{
            marginLeft: "20px",
            marginRight: "20px",
            marginBottom: "20px",
            align: "center",
          }}
        >
          <InputLabel id="select-doc">Select Document</InputLabel>
          <Select
            labelId="select-doc"
            id="select-doc"
            value={docId}
            onChange={handleChangeDoc}
            style={{ width: "200px" }}
          >
            {docs.map((d) => (
              <MenuItem value={d.docId}>{d.docName}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {currentUser.isMentor && (
          <>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={handleDeleteDoc}
            >
              <Tooltip title="Delete Selected Document" placement="bottom">
                <DeleteIcon />
              </Tooltip>
            </IconButton>
            <IconButton edge="end" aria-label="add" onClick={handleExpandClick}>
              <Tooltip title="Add New Document" placement="bottom">
                <AddCircleIcon />
              </Tooltip>
            </IconButton>
          </>
        )}
      </div>
      {currentUser.isMentor && expanded && (
        <Collapse
          in={expanded}
          timeout="auto"
          unmountOnExit
          style={{ width: "100%", margin: "0 auto" }}
        >
          <AddDoc />
        </Collapse>
      )}
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
