import React, { useContext, useState } from "react";
import { TextField, Button, Typography } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";
import { store } from "../../../store.js";

function AddDoc() {
  const { addDoc } = useContext(store);
  const { t } = useTranslation("translation");

  const [error, setError] = useState();

  function addItem(e) {
    e.preventDefault();

    let docUrl = document.addDocForm.docUrl.value;
    if (!docUrl) {
      setError("event-name-required");
      return;
    } else {
      docUrl = !/^https?:\/\//i.test(docUrl) ? `https://${docUrl}` : docUrl;
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
    <form name="addDocForm" style={{ marginBottom: "20px" }}>
      <Typography variant="h5" align="center" style={{ marginBottom: "20px" }}>
        {t("Add New Document")}:
      </Typography>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TextField
          label={t("Document Name")}
          name="docName"
          style={{ backgroundColor: "white" }}
          variant="outlined"
        />
        <TextField
          label={t("Document URL")}
          name="docUrl"
          style={{
            marginLeft: "20px",
            backgroundColor: "white",
            width: "300px",
          }}
          variant="outlined"
        />
        <Button
          variant="contained"
          color="secondary"
          size="large"
          style={{ marginLeft: "20px", fontWeight: 600 }}
          type="submit"
          onClick={addItem}
        >
          {t("Add")}
        </Button>
      </div>
      <ErrorMessage errorCode={error}></ErrorMessage>
    </form>
  );
}

export default AddDoc;
