import React, { useState, useContext, useEffect, useMemo } from "react";
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
  const [eventDocs, setEventDocs] = useState(docs);
  const [docId, setDocId] = useState("");
  const [expanded, setExpanded] = React.useState(false);

  useEffect(() => {
    const currentDoc = docs.find((d) => d.docId === docId);
    if (!currentDoc) {
      setDocId("");
    }
    setEventDocs(docs);
  }, [docs, docId]);

  const docExists = docs.length !== 0;

  const handleDeleteDoc = () => {
    deleteDoc(docId);
    setDocId("");
  };

  const handleChangeDoc = (event) => {
    setDocId(event.target.value);
  };

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const selectedDoc = useMemo(() => {
    const url = docs.find((d) => d.docId === docId);
    if (url) {
      return url.docUrl;
    }
    return "";
  }, [docs, docId]);

  return (
    <>
      <div style={{ display: "flex" }}>
        {docExists && (
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
              {eventDocs.map((d) => (
                <MenuItem value={d.docId}>{d.docName}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        {docExists && currentUser.isMentor && (
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
      {docExists && currentUser.isMentor && expanded && (
        <Collapse
          in={expanded}
          timeout="auto"
          unmountOnExit
          style={{ width: "100%", margin: "0 auto" }}
        >
          <AddDoc />
        </Collapse>
      )}
      {!docExists && currentUser.isMentor && (
        <div style={{ width: "100%", margin: "0 auto" }}>
          <AddDoc />
        </div>
      )}
      <div className={"Document-frame"}>
        <iframe
          title="document"
          src={selectedDoc}
          frameBorder="0"
          allowFullScreen={false}
        ></iframe>
      </div>
    </>
  );
}

export default Document;
