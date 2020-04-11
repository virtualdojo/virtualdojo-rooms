import React, { useState, useContext, useEffect } from "react";
import { Button, FormControlLabel, Checkbox } from "@material-ui/core";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import { store } from "../../../store.js";

import "./Settings.css";
import AddDoc from "./AddDoc";
import Docs from "./Docs";

function Settings() {
  const {
    event,
    updatePublicPeriod,
    setHasFreeMovement: setEventHasFreeMovement,
  } = useContext(store);
  const [hasFreeMovement, setHasFreeMovement] = useState(event.hasFreeMovement);
  const [startDate, setStartDate] = useState(
    event.publicPeriod.startDate.toDate()
  );
  const [endDate, setEndDate] = useState(event.publicPeriod.endDate.toDate());

  // avoid state inconsistency if changed from another client
  useEffect(() => {
    setStartDate(event.publicPeriod.startDate.toDate());
    setEndDate(event.publicPeriod.endDate.toDate());
  }, [event.publicPeriod]);
  useEffect(() => {
    setHasFreeMovement(event.hasFreeMovement);
  }, [event.hasFreeMovement]);

  return (
    <div className="Settings-container">
      <div className="Edit-container">
        <FormControlLabel
          control={
            <Checkbox
              checked={hasFreeMovement}
              onChange={(event) => setHasFreeMovement(event.target.checked)}
              name="freeMovement"
              color="primary"
            />
          }
          label="Enable users free movement between rooms"
        />
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <DateTimePicker
            label="Event Start Date"
            inputVariant="outlined"
            value={startDate}
            onChange={setStartDate}
            style={{ marginTop: "20px", marginBottom: "20px" }}
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
          onClick={() => {
            updatePublicPeriod({ startDate, endDate });
            setEventHasFreeMovement(hasFreeMovement);
          }}
        >
          {`Update settings`}
        </Button>
      </div>
      <div className="Edit-container">
        <AddDoc eventId={event.eventId} />
      </div>
      <div className="Edit-container">
        <Docs />
      </div>
    </div>
  );
}

export default Settings;
