import React, { useState, useContext, useEffect } from "react";
import { Button } from "@material-ui/core";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import { store } from "../../../store.js";

import "./Settings.css";

function Settings() {
  const { event, updatePublicPeriod } = useContext(store);
  const [startDate, setStartDate] = useState(
    event.publicPeriod.startDate.toDate()
  );
  const [endDate, setEndDate] = useState(event.publicPeriod.endDate.toDate());

  // avoid dates inconsistency if changed from another client
  useEffect(() => {
    setStartDate(event.publicPeriod.startDate.toDate());
    setEndDate(event.publicPeriod.endDate.toDate());
  }, [event.publicPeriod]);

  return (
    <div className="Settings-container">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DateTimePicker
          label="Event Start Date"
          inputVariant="outlined"
          value={startDate}
          onChange={setStartDate}
          style={{ marginBottom: "20px" }}
        />
      </MuiPickersUtilsProvider>

      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DateTimePicker
          label="Event End Date"
          inputVariant="outlined"
          value={endDate}
          onChange={setEndDate}
          style={{ marginBottom: "20px" }}
        />
      </MuiPickersUtilsProvider>

      <Button
        variant="contained"
        color="secondary"
        size="large"
        style={{ margin: "0 auto", fontWeight: 600 }}
        type="submit"
        onClick={() => updatePublicPeriod({ startDate, endDate })}
      >
        {`Edit`}
      </Button>
    </div>
  );
}

export default Settings;
