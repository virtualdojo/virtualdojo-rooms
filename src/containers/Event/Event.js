import React, { useState, useContext } from "react";
import { useTheme } from "@material-ui/core/styles";
import {
  IconButton,
  Typography,
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
} from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import {
  CancelRounded as CancelIcon,
  DescriptionRounded as DocumentIcon,
  PeopleAltRounded as PeopleAltRoundedIcon,
  MeetingRoomRounded as MeetingRoomRoundedIcon,
  Settings as SettingsIcon,
  Language as LanguageIcon,
} from "@material-ui/icons";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation("translation");
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
          <Typography variant="h3">{`${t("Hello")} ${currentUser.userName}, ${t(
            "You Are In The Waiting Room"
          )}!`}</Typography>
          <Typography variant="h5">{t("The Event Is Open From")}</Typography>
          <Typography variant="h4">{`${format(
            event.publicPeriod.startDate.toDate(),
            "HH:mm - dd/MM/yyyy"
          )}`}</Typography>
          <Typography variant="h5">{t("To")}</Typography>
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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const handleChangeIndex = (index) => {
    setTabIndex(index);
  };
  const { i18n } = useTranslation("translation");

  const changeLanguage = () => {
    i18n.language === "it"
      ? i18n.changeLanguage("en")
      : i18n.changeLanguage("it");
  };

  const style = {
    container: { background: theme.palette.background.black },
    navbar: {
      background: theme.palette.primary.main,
      color: theme.palette.background.default,
    },
    modal: { background: theme.palette.background.default },
    listItem: { background: theme.palette.grey[200] },
  };

  if (!currentUser.isMentor && !isEventOpen)
    return (
      <WaitingRoom event={event} currentUser={currentUser} theme={style} />
    );

  return (
    <div className="main-container" style={style.container}>
      {!isModalOpen && (
        <div style={{ position: "fixed" }}>
          <IconButton
            color="secondary"
            onClick={() => {
              setTabIndex(0);
              setIsModalOpen(!isModalOpen);
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
      <Dialog
        open={isModalOpen}
        fullScreen={fullScreen}
        maxWidth={"md"}
        PaperProps={{
          style: { borderRadius: "15px", height: "80vh", minWidth: "80%" },
        }}
        disableAutoFocus={true}
        disableEnforceFocus={true}
        // fix react dnd not working inside a modal
        TransitionProps={{ tabIndex: "" }}
      >
        <DialogTitle style={{ padding: 0 }}>
          <div className="NavBar" style={style.navbar}>
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
                <Divider orientation="vertical" flexItem />
              </>
            )}
            <IconButton color="default" onClick={changeLanguage}>
              <Tooltip
                title={i18n.language === "it" ? "English" : "Italiano"}
                placement="bottom"
              >
                <LanguageIcon fontSize="large" />
              </Tooltip>
            </IconButton>
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
        </DialogTitle>
        <DialogContent style={{ padding: 0 }}>
          <SwipeableViews
            axis={"x"}
            index={tabIndex}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={tabIndex} index={0} dir={style.direction}>
              <Rooms />
            </TabPanel>
            <TabPanel value={tabIndex} index={1} dir={style.direction}>
              <Document />
            </TabPanel>
            <TabPanel value={tabIndex} index={2} dir={style.direction}>
              <Users />
            </TabPanel>
            <TabPanel value={tabIndex} index={3} dir={style.direction}>
              <Settings />
            </TabPanel>
          </SwipeableViews>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditEvent;
