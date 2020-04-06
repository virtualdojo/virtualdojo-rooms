import React from "react";
import { useDrop } from "react-dnd";
import { useTheme } from "@material-ui/core/styles";
import { Typography, Card, Grid } from "@material-ui/core";

import User from "./User";

const ItemTypes = {
  USER: "user",
};

function Room({ eventId, room, users, currentUser }) {
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
  const isUserInThisRoom = users.find((u) => u.userId === currentUser.userId);
  let activeClass = "default";
  if (isUserInThisRoom || isActive) {
    activeClass = "active";
  } else if (canDrop) {
    activeClass = "hover";
  }

  return (
    <Card
      ref={drop}
      style={{
        backgroundColor: theme.background[activeClass],
        padding: "15px",
      }}
    >
      <Typography variant="h5" style={{ color: theme.text[activeClass] }}>
        {room.roomName}
      </Typography>
      <Grid item container spacing={3}>
        {users.map((u) => (
          <User
            inRoom
            key={u.userId}
            user={u}
            currentUser={currentUser}
            eventId={eventId}
            avatarColor={{
              background: theme.text[activeClass],
              color: theme.background[activeClass],
            }}
          ></User>
        ))}
      </Grid>
    </Card>
  );
}

export default Room;
