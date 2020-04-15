import React, { useContext } from "react";
import { useDrop } from "react-dnd";
import { useTheme } from "@material-ui/core/styles";
import {
  Typography,
  Paper,
  Grid,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import {
  Explore as ExploreIcon,
  ExploreOff as ExploreOffIcon,
} from "@material-ui/icons";
import { useTranslation } from "react-i18next";

import { store } from "../../../store.js";
import User from "./User";

const ItemTypes = {
  USER: "user",
};

function Room({ room }) {
  const { currentUser, changeRoom, event } = useContext(store);
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
        <Grid item xs={10}>
          <Typography
            variant="h5"
            style={{ color: theme.text[activeClass], maxWidth: "150px" }}
            noWrap={true}
          >
            {room.roomName}
          </Typography>
        </Grid>
        <Grid item xs={1}>
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
      </Grid>
      <Grid item container xs={12} spacing={1}>
        {room.users.map((u) => (
          <User
            inRoom
            key={u.userId}
            user={u}
            changeRoom={changeRoom}
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
