import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
} from "@material-ui/core";
import { DateTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { useTranslation } from "react-i18next";
import { store } from "../../../store.js";

import "./Settings.css";

function Settings() {
  const {
    event,
    updatePublicPeriod,
    setHasFreeMovement: setEventHasFreeMovement,
    setJitsiServer: setEventJitsiServer,
  } = useContext(store);
  const [hasFreeMovement, setHasFreeMovement] = useState(event.hasFreeMovement);
  const [jitsiServer, setJitsiServer] = useState(event.jitsiServer);
  const [startDate, setStartDate] = useState(
    event.publicPeriod.startDate.toDate()
  );
  const [endDate, setEndDate] = useState(event.publicPeriod.endDate.toDate());
  const { t } = useTranslation("translation");

  // avoid state inconsistency if changed from another client
  useEffect(() => {
    setStartDate(event.publicPeriod.startDate.toDate());
    setEndDate(event.publicPeriod.endDate.toDate());
  }, [event.publicPeriod]);
  useEffect(() => {
    setHasFreeMovement(event.hasFreeMovement);
  }, [event.hasFreeMovement]);
  useEffect(() => {
    setJitsiServer(event.jitsiServer);
  }, [event.jitsiServer]);

  return (
    <div className="Settings-container">
      <Typography variant="h5" align="center" style={{ marginBottom: "20px" }}>
        {t("Event Settings")}
      </Typography>
      <TextField
        label="Jitsi server"
        name="jitsiServer"
        fullWidth
        value={jitsiServer}
        onChange={(event) => setJitsiServer(event.target.value)}
        variant="outlined"
        style={{ marginBottom: "20px" }}
      />
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DateTimePicker
          label={t("Event Start Date")}
          inputVariant="outlined"
          value={startDate}
          onChange={setStartDate}
          style={{ marginBottom: "20px" }}
        />
      </MuiPickersUtilsProvider>

      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DateTimePicker
          label={t("Event End Date")}
          inputVariant="outlined"
          value={endDate}
          onChange={setEndDate}
          style={{ marginBottom: "20px" }}
        />
      </MuiPickersUtilsProvider>
      <FormControlLabel
        control={
          <Checkbox
            checked={hasFreeMovement}
            onChange={(event) => setHasFreeMovement(event.target.checked)}
            name="freeMovement"
            color="primary"
          />
        }
        label={t("Free Movement")}
      />
      <Button
        variant="contained"
        color="secondary"
        size="large"
        style={{ margin: "0 auto", fontWeight: 600 }}
        type="submit"
        onClick={() => {
          updatePublicPeriod({ startDate, endDate });
          setEventHasFreeMovement(hasFreeMovement);
          setEventJitsiServer(jitsiServer);
        }}
      >
        {t("Update")}:
      </Button>
    </div>
  );
}

export default Settings;
