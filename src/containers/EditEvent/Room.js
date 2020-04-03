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
      console.log("dropped");
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

  let backgroundColor = theme.default;
  if (isActive) {
    backgroundColor = theme.active;
  } else if (canDrop) {
    backgroundColor = theme.hover;
  }

  return (
    <Card ref={drop} style={{ backgroundColor, marginBottom: 10, padding: 5 }}>
      <Typography variant="h4">{room.roomName}</Typography>
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
