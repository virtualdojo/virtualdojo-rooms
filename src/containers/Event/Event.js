import React, { useEffect, useState } from "react";
import { useTheme } from "@material-ui/core/styles";
import { IconButton, Typography, Divider } from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import {
  CancelRounded as CancelIcon,
  DescriptionRounded as DocumentIcon,
  PeopleAltRounded as PeopleAltRoundedIcon,
  MeetingRoomRounded as MeetingRoomRoundedIcon,
} from "@material-ui/icons";

import * as FirestoreService from "../../services/firestore";

import Rooms from "./Rooms/Rooms";
import Users from "./Users/Users";
import Document from "./Document/Document";
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

function EditEvent({ user, event }) {
  const [eventUsers, setEventUsers] = useState([]);
  const [eventRooms, setEventRooms] = useState([]);
  const [eventRoomsUsers, setEventRoomsUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [error, setError] = useState();
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

  useEffect(() => {
    const unsubscribe = FirestoreService.streamEventUsers(event.eventId, {
      next: (querySnapshot) => {
        const updatedEventUsers = querySnapshot.docs
          ? querySnapshot.docs.map((docSnapshot) => docSnapshot.data())
          : [];
        setEventUsers(updatedEventUsers);
      },
      error: () => setError("user-get-fail"),
    });
    return unsubscribe;
  }, [event.eventId, setEventUsers]);

  useEffect(() => {
    const unsubscribe = FirestoreService.streamEventRooms(event.eventId, {
      next: (querySnapshot) => {
        const updatedEventRooms = querySnapshot.docs
          ? querySnapshot.docs.map((docSnapshot) => docSnapshot.data())
          : [];
        setEventRooms(updatedEventRooms);
      },
      error: () => setError("user-get-fail"),
    });
    return unsubscribe;
  }, [event.eventId, setEventRooms]);

  useEffect(() => {
    const unsubscribe = FirestoreService.streamEventRoomsUsers(event.eventId, {
      next: (querySnapshot) => {
        const updatedEventRoomsUsers = querySnapshot.docs
          ? querySnapshot.docs.map((docSnapshot) => docSnapshot.data())
          : [];
        setEventRoomsUsers(updatedEventRoomsUsers);
      },
      error: () => setError("user-get-fail"),
    });
    return unsubscribe;
  }, [event.eventId, setEventRoomsUsers]);

  const userMeta = eventUsers.find((u) => u.userId === user.userId) || user;
  const userRoom = eventRoomsUsers.find((ru) => ru.userId === user.userId);
  const userRoomDetails =
    userRoom && eventRooms.find((er) => er.roomId === userRoom.roomId);
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
        user={userMeta}
        room={userRoomDetails}
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
          {userMeta.isMentor && (
            <IconButton
              color="default"
              onClick={() => setTabIndex(2)}
              disabled={tabIndex === 2}
            >
              <PeopleAltRoundedIcon fontSize="large" />
            </IconButton>
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
            <Typography variant="h5" color="default">
              {event.name}
            </Typography>
          </div>
        </div>
        <SwipeableViews
          axis={"x"}
          index={tabIndex}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={tabIndex} index={0} dir={theme.direction}>
            <Rooms
              user={user}
              event={event}
              error={error}
              userMeta={userMeta}
              eventUsers={eventUsers}
              eventRooms={eventRooms}
              eventRoomsUsers={eventRoomsUsers}
            />
          </TabPanel>
          <TabPanel value={tabIndex} index={1} dir={theme.direction}>
            <Document
              isOpen={true}
              src="https://docs.google.com/presentation/d/e/2PACX-1vS-8ObYLMmB5QarJRM34yiDiUcGwHXdDfXQtrzpdEdwIM-QyU_3mehDpSu6l68p1BdneEHkp-_YC23E/embed?start=false&loop=false&delayms=60000"
            ></Document>
          </TabPanel>
          <TabPanel value={tabIndex} index={2} dir={theme.direction}>
            <Users
              user={user}
              event={event}
              error={error}
              userMeta={userMeta}
              eventUsers={eventUsers}
              eventRooms={eventRooms}
              eventRoomsUsers={eventRoomsUsers}
            />
          </TabPanel>
        </SwipeableViews>
      </div>
    </div>
  );
}

export default EditEvent;
