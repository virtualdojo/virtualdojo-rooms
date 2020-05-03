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
} from "@material-ui/core";
import {
  Explore as ExploreIcon,
  ExploreOff as ExploreOffIcon,
  FileCopy as FileCopyIcon,
} from "@material-ui/icons";
import { useTranslation } from "react-i18next";

import { store } from "../../../store.js";
import User from "./User";

const ItemTypes = {
  USER: "user",
};

function Room({ room }) {
  const { currentUser, changeRoom, event } = useContext(store);
  const [isMovingUser, setIsMovingUser] = useState(false);
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
      setIsMovingUser(true);
      await changeRoom(userId, roomId);
      setIsMovingUser(false);
    },
    [changeRoom]
  );

  const isActive = canDrop && isOver;
  const isUserInThisRoom = currentUser.room.roomId === room.roomId;
  let activeClass = "default";
  if ((isUserInThisRoom && !canDrop) || isActive) {
    activeClass = "active";
  } else if (canDrop) {
    activeClass = "hover";
  }

  return (
    <Paper
      ref={drop}
      style={{
        backgroundColor: theme.background[activeClass],
        padding: "15px",
        flexGrow: 1,
      }}
    >
      <Grid item container xs={12} spacing={1}>
        <Grid item xs={8}>
          <Typography
            variant="h5"
            style={{ color: theme.text[activeClass], maxWidth: "150px" }}
            noWrap={true}
          >
            {room.roomName}
          </Typography>
        </Grid>
        {isMovingUser && (
          <Grid item xs={2}>
            <CircularProgress
              size={20}
              color={
                currentUser.room.roomId === room.roomId
                  ? "primary"
                  : "secondary"
              }
            />
          </Grid>
        )}

        {!isMovingUser && currentUser.isMentor && (
          <Grid item xs={2}>
            <IconButton
              aria-label="promote"
              color={
                currentUser.room.roomId === room.roomId
                  ? "primary"
                  : "secondary"
              }
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
        )}
        {!isMovingUser && (
          <Grid item xs={2}>
            {event.hasFreeMovement && (
              <IconButton
                aria-label="promote"
                color="secondary"
                onClick={() => changeRoom(currentUser.userId, room.roomId)}
                disabled={currentUser.room.roomId === room.roomId}
                style={{ padding: 0 }}
              >
                <Tooltip
                  title={
                    currentUser.room.roomId === room.roomId
                      ? "You are in this room"
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
            )}
          </Grid>
        )}
      </Grid>
      <Grid item container xs={12} spacing={1}>
        {room.users.map((u) => (
          <User
            inRoom
            key={`${u.userId}${u.isMentor}`}
            user={u}
            changeRoom={changeRoomWithState}
            dragDisabled={isMovingUser}
            currentUser={currentUser}
            avatarColor={{
              background: theme.text[activeClass],
              color: theme.background[activeClass],
            }}
          ></User>
        ))}
      </Grid>
    </Paper>
  );
}

export default Room;
