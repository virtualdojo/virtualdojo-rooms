import React, { useContext } from "react";
import { useDrop } from "react-dnd";
import { useTheme } from "@material-ui/core/styles";
import { Typography, Paper, Grid } from "@material-ui/core";

import { store } from "../../../store.js";
import User from "./User";

const ItemTypes = {
  USER: "user",
};

function Room({ room }) {
  const { currentUser, changeRoom } = useContext(store);
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
      <Typography variant="h5" style={{ color: theme.text[activeClass] }}>
        {room.roomName}
      </Typography>
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
