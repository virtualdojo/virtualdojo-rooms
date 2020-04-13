import React, { useState, useContext } from "react";
import { useTheme } from "@material-ui/core/styles";
import { IconButton, Typography, Divider } from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import {
  CancelRounded as CancelIcon,
  DescriptionRounded as DocumentIcon,
  PeopleAltRounded as PeopleAltRoundedIcon,
  MeetingRoomRounded as MeetingRoomRoundedIcon,
  Settings as SettingsIcon,
} from "@material-ui/icons";
import { format } from "date-fns";

import { store } from "../../store.js";

import Rooms from "./Rooms/Rooms";
import Users from "./Users/Users";
import Document from "./Document/Document";
import Settings from "./Settings/Settings";
import VideoChat from "./VideoChat/VideoChat";

import "./Event.css";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      className="Tab-Panel"
      {...other}
    >
      {children}
    </Typography>
  );
}

function WaitingRoom({ theme, currentUser, event }) {
  return (
    <div className="main-container" style={theme.container}>
      <div className={"Event-modal"} style={theme.modal}>
        <div className="NavBar" style={theme.navbar}>
          <div
            style={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h5">{event.name}</Typography>
          </div>
        </div>
        <Typography
          component="div"
          className="Tab-Panel"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h3">{`Hi ${currentUser.userName}, you're in the waiting room!`}</Typography>
          <Typography variant="h5">{`The event is open from`}</Typography>
          <Typography variant="h4">{`${format(
            event.publicPeriod.startDate.toDate(),
            "HH:mm - dd/MM/yyyy"
          )}`}</Typography>
          <Typography variant="h5">{`to`}</Typography>
          <Typography variant="h4">{`${format(
            event.publicPeriod.endDate.toDate(),
            "HH:mm - dd/MM/yyyy"
          )}`}</Typography>
        </Typography>
      </div>
    </div>
  );
}

function EditEvent() {
  const { currentUser, event, isEventOpen } = useContext(store);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const { palette } = useTheme();
  const handleChangeIndex = (index) => {
    setTabIndex(index);
  };

  const theme = {
    container: { background: palette.background.black },
    navbar: {
      background: palette.primary.main,
      color: palette.background.default,
    },
    modal: { background: palette.background.default },
    listItem: { background: palette.grey[200] },
  };

  if (!currentUser.isMentor && !isEventOpen)
    return (
      <WaitingRoom event={event} currentUser={currentUser} theme={theme} />
    );

  return (
    <div className="main-container" style={theme.container}>
      {!isModalOpen && (
        <div style={{ position: "fixed" }}>
          <IconButton
            color="secondary"
            onClick={() => {
              setTabIndex(0);
              setIsModalOpen(true);
            }}
          >
            <MeetingRoomRoundedIcon fontSize="large" />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => {
              setTabIndex(1);
              setIsModalOpen(true);
            }}
          >
            <DocumentIcon fontSize="large" />
          </IconButton>
        </div>
      )}
      <VideoChat
        user={currentUser}
        isMenuOpen={isModalOpen}
        event={event}
      ></VideoChat>
      <div
        className={
          isModalOpen ? "Event-modal" : "Event-modal Event-modal-closed"
        }
        style={theme.modal}
      >
        <div className="NavBar" style={theme.navbar}>
          <IconButton color="default" onClick={() => setIsModalOpen(false)}>
            <CancelIcon fontSize="large" />
          </IconButton>
          <Divider orientation="vertical" flexItem />
          <IconButton
            color="default"
            onClick={() => setTabIndex(0)}
            disabled={tabIndex === 0}
          >
            <MeetingRoomRoundedIcon fontSize="large" />
          </IconButton>
          <IconButton
            color="default"
            onClick={() => setTabIndex(1)}
            disabled={tabIndex === 1}
          >
            <DocumentIcon fontSize="large" />
          </IconButton>
          <Divider orientation="vertical" flexItem />
          {currentUser.isMentor && (
            <>
              <IconButton
                color="default"
                onClick={() => setTabIndex(2)}
                disabled={tabIndex === 2}
              >
                <PeopleAltRoundedIcon fontSize="large" />
              </IconButton>
              <IconButton
                color="default"
                onClick={() => setTabIndex(3)}
                disabled={tabIndex === 3}
              >
                <SettingsIcon fontSize="large" />
              </IconButton>
            </>
          )}
          <div
            style={{
              display: "flex",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              marginRight: "140px",
            }}
          >
            <Typography variant="h5">{event.name}</Typography>
          </div>
        </div>
        <SwipeableViews
          axis={"x"}
          index={tabIndex}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={tabIndex} index={0} dir={theme.direction}>
            <Rooms />
          </TabPanel>
          <TabPanel value={tabIndex} index={1} dir={theme.direction}>
            <Document />
          </TabPanel>
          <TabPanel value={tabIndex} index={2} dir={theme.direction}>
            <Users />
          </TabPanel>
          <TabPanel value={tabIndex} index={3} dir={theme.direction}>
            <Settings />
          </TabPanel>
        </SwipeableViews>
      </div>
    </div>
  );
}

export default EditEvent;
