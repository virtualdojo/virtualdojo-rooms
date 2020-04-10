import React, { useState } from "react";
import { TextField, Button } from "@material-ui/core";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import * as FirestoreService from "../../../services/firestore";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";

import "./Settings.css";

function Settings({ event }) {
  const [error, setError] = useState();
  const [selectedDate, handleDateChange] = useState(new Date());

  function setDate(e) {
    e.preventDefault();
    setError(null);

    const start = document.setDateForm.startDate.value;
    if (!start) {
      setError("user-desc-req");
      return;
    }
    FirestoreService.setDate(event.eventId, "startDate", start).catch(
      (reason) => {
        setError("create-list-error");
      }
    );
  }

  function EditDate(props) {
    return (
      <>
        <form name="setDateForm">
          {props.children}
          <Button
            variant="contained"
            color="secondary"
            size="large"
            style={{ marginLeft: "20px", fontWeight: 600 }}
            type="submit"
            onClick={props.function}
          >
            {`Edit`}
          </Button>
        </form>
        <ErrorMessage errorCode={error}></ErrorMessage>
      </>
    );
  }

  return (
    <div className="Settings-container">
      <EditDate function={setDate} error={error}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DateTimePicker
            label="Event Start Date"
            inputVariant="outlined"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </MuiPickersUtilsProvider>
      </EditDate>
      <EditDate function={setDate} error={error}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DateTimePicker
            label="Event End Date"
            inputVariant="outlined"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </MuiPickersUtilsProvider>
      </EditDate>
    </div>
  );
}

export default Settings;
