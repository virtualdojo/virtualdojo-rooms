import React, { useContext, useState, useCallback } from "react";
import { useDrop } from "react-dnd";
import { useTheme } from "@material-ui/core/styles";
import {
  Typography,
  Paper,
  Grid,
  IconButton,
  Tooltip,
  CircularProgress,
  ButtonBase,
} from "@material-ui/core";
import {
  Explore as ExploreIcon,
  ExploreOff as ExploreOffIcon,
  FileCopy as FileCopyIcon,
} from "@material-ui/icons";
import { useTranslation } from "react-i18next";

import { store } from "../../../store.js";
import User from "./User";
import EditRoomDialog from "./EditRoomDialog";
import defaultRoomImage from "../../../assets/defaultRoom.png";

const ItemTypes = {
  USER: "user",
};

function Room({ room }) {
  const { currentUser, changeRoom, event, setRoomInfo } = useContext(store);
  const [isMovingUser, setIsMovingUser] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { t } = useTranslation("translation");
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.USER,
    drop: () => {
      return { room };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const { palette } = useTheme();
  const theme = {
    background: {
      default: palette.primary.main,
      active: palette.secondary.main,
      hover: palette.primary.main,
    },
    text: {
      default: palette.secondary.main,
      active: palette.primary.main,
      hover: palette.secondary.main,
    },
  };

  const changeRoomWithState = useCallback(
    async (userId, roomId) => {
      if (!isMovingUser) {
        setIsMovingUser(true);
        await changeRoom(userId, roomId);
        setIsMovingUser(false);
      }
    },
    [changeRoom, isMovingUser]
  );

  const isActive = canDrop && isOver;
  const isUserInThisRoom = currentUser.room.roomId === room.roomId;
  let activeClass = "default";
  if ((isUserInThisRoom && !canDrop) || isActive) {
    activeClass = "active";
  } else if (canDrop) {
    activeClass = "hover";
  }
  const orderedUsers = room.users.sort((a, b) =>
    a.userName > b.userName ? 1 : -1
  );
  return (
    <Paper
      ref={drop}
      style={{
        backgroundColor: theme.background[activeClass],
        padding: "15px",
        flexGrow: 1,
      }}
    >
      <EditRoomDialog
        isOpen={isEditDialogOpen}
        room={room}
        onClose={() => setIsEditDialogOpen(false)}
        onConfirm={async (roomName, imageUrl) => {
          if (roomName !== room.roomName || imageUrl !== room.imageUrl) {
            await setRoomInfo({ roomId: room.roomId, roomName, imageUrl });
          }
          setIsEditDialogOpen(false);
        }}
      ></EditRoomDialog>
      <Grid item xs container direction="row" spacing={2}>
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase
              disabled={!currentUser.isMentor}
              style={{
                width: 64,
                height: 64,
              }}
              onClick={() => setIsEditDialogOpen(true)}
            >
              <img
                style={{
                  margin: "auto",
                  display: "block",
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
                alt={`${room.roomName}`}
                src={room.imageUrl || defaultRoomImage}
              />
            </ButtonBase>
          </Grid>
          <Grid item xs>
            <Typography
              gutterBottom
              variant="subtitle1"
              style={{ color: theme.text[activeClass] }}
              noWrap={false}
            >
              {room.roomName}
            </Typography>
            <Grid item container xs={12} spacing={1}>
              <Grid item>
                <IconButton
                  aria-label="promote"
                  color={
                    currentUser.room.roomId === room.roomId
                      ? "primary"
                      : "secondary"
                  }
                  disabled={isMovingUser}
                  onClick={() => {
                    const el = document.createElement("textarea");
                    el.value = `${event.jitsiServer}/${room.roomId}`;
                    document.body.appendChild(el);
                    el.select();
                    document.execCommand("copy");
                    document.body.removeChild(el);
                  }}
                  style={{ padding: 0 }}
                >
                  <Tooltip title={"Copy Jitsi link"}>
                    <FileCopyIcon />
                  </Tooltip>
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  aria-label="promote"
                  color="secondary"
                  onClick={() =>
                    changeRoomWithState(currentUser.userId, room.roomId)
                  }
                  disabled={
                    isMovingUser ||
                    !event.hasFreeMovement ||
                    currentUser.room.roomId === room.roomId
                  }
                  style={{ padding: 0 }}
                >
                  <Tooltip
                    title={
                      currentUser.room.roomId === room.roomId
                        ? t("You are in this room")
                        : t("Explore Room")
                    }
                    placement="bottom"
                    key={currentUser.room.roomId === room.roomId}
                  >
                    {currentUser.room.roomId === room.roomId ? (
                      <ExploreOffIcon />
                    ) : (
                      <ExploreIcon />
                    )}
                  </Tooltip>
                </IconButton>
              </Grid>
              <Grid item>
                {isMovingUser && (
                  <CircularProgress
                    size={20}
                    color={
                      currentUser.room.roomId === room.roomId
                        ? "primary"
                        : "secondary"
                    }
                  />
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container xs={12} spacing={1} alignItems={"flex-start"}>
          {orderedUsers.map((u) => (
            <User
              inRoom
              key={`${u.userId}${u.isMentor}`}
              avatarSize={orderedUsers.length > 20 ? "sm" : "md"}
              user={u}
              changeRoom={changeRoomWithState}
              dragDisabled={isMovingUser}
              currentUser={currentUser}
              avatarColor={{
                background: theme.text[activeClass],
                color: theme.background[activeClass],
              }}
            />
          ))}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Room;
