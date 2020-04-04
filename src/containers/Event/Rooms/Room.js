import React from "react";
import { useDrop } from "react-dnd";
import { useTheme } from "@material-ui/core/styles";
import { Typography, Card } from "@material-ui/core";

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
  const isActive = canDrop && isOver;
  const { palette } = useTheme();
  const theme = {
    default: palette.secondary.main,
    active: palette.secondary.main,
    hover: palette.primary.main,
  };

  const isUserInThisRoom = users.find((u) => u.userId === currentUser.userId);

  let backgroundColor = isUserInThisRoom ? theme.hover : theme.default;
  if (isActive) {
    backgroundColor = theme.active;
  } else if (canDrop) {
    backgroundColor = theme.hover;
  }

  return (
    <Card ref={drop} style={{ backgroundColor, marginBottom: 10, padding: 5 }}>
      <Typography
        variant="h5"
        color={isUserInThisRoom ? "secondary" : "primary"}
      >
        {room.roomName}
      </Typography>
      {users.map((u) => (
        <User
          inRoom
          key={u.userId}
          user={u}
          currentUser={currentUser}
          eventId={eventId}
        ></User>
      ))}
    </Card>
  );
}

export default Room;
