import React, { useContext } from "react";
import { TextField, Button, Typography } from "@material-ui/core";
import { store } from "../../../store.js";

function AddDoc() {
  const { addDoc } = useContext(store);

  function addItem(e) {
    e.preventDefault();
    const docUrl = document.addDocForm.docUrl.value;
    addDoc(docUrl).then(
      () => document.addDocForm && document.addDocForm.reset()
    );
  }

  return (
    <form name="addDocForm">
      <Typography variant="h5" align="center" style={{ marginBottom: "20px" }}>
        Add new doc:
      </Typography>
      <TextField label="Doc URL" name="docUrl" variant="outlined" />
      <Button
        variant="contained"
        color="primary"
        size="large"
        style={{ marginLeft: "20px", fontWeight: 600 }}
        type="submit"
        onClick={addItem}
      >
        Add
      </Button>
    </form>
  );
}

export default AddDoc;
