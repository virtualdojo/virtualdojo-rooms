import React, { useContext, useState } from "react";
import { TextField, Button, Typography } from "@material-ui/core";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";
import { store } from "../../../store.js";

function AddDoc() {
  const { addDoc } = useContext(store);

  const [error, setError] = useState();

  function addItem(e) {
    e.preventDefault();

    const docUrl = document.addDocForm.docUrl.value;
    if (!docUrl) {
      setError("event-name-required");
      return;
    }

    const docName = document.addDocForm.docName.value;
    if (!docName) {
      setError("event-name-required");
      return;
    }

    addDoc(docUrl, docName).then(
      () => document.addDocForm && document.addDocForm.reset()
    );
  }

  return (
    <>
      <form
        name="addDocForm"
        style={{ display: `flex`, flexDirection: `column` }}
      >
        <Typography
          variant="h5"
          align="center"
          style={{ marginBottom: "20px" }}
        >
          Add new document:
        </Typography>
        <TextField
          label="Doc Name"
          name="docName"
          style={{ marginBottom: "20px", backgroundColor: "white" }}
          variant="outlined"
        />
        <TextField
          label="Doc URL"
          name="docUrl"
          style={{ marginBottom: "20px", backgroundColor: "white" }}
          variant="outlined"
        />
        <Button
          variant="contained"
          color="secondary"
          size="large"
          style={{ margin: "0 auto", fontWeight: 600 }}
          type="submit"
          onClick={addItem}
        >
          Add Doc
        </Button>
      </form>
      <ErrorMessage errorCode={error}></ErrorMessage>
    </>
  );
}

export default AddDoc;
