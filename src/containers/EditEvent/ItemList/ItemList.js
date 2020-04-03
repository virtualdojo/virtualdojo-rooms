import React from "react";
import * as FirestoreService from "../../../services/firestore";
import { useDrag, useDrop } from "react-dnd";
import { useTheme } from "@material-ui/core/styles";
import { Button, Paper, Typography, Card } from "@material-ui/core";

const ItemTypes = {
  USER: "user",
};

const User = ({ eventId, user, currentUser, inRoom }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { name: user.userName, type: ItemTypes.USER },
    canDrag: currentUser.isMentor,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        FirestoreService.addUserToRoom(
          user.userId,
          dropResult.room.roomId,
          eventId
        );
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const isCurrentUser = currentUser && currentUser.userId === user.userId;

  const styles = {
    opacity: isDragging ? 0.4 : 1,
    width: inRoom ? "90%" : "100%",
    margin: "0 auto 5px auto",
  };

  return (
    <div ref={drag} style={styles}>
      <Paper elevation={3} style={{ padding: 5 }}>
        <Typography variant="h5">
          {`${user.userName} - (${user.isMentor ? "Mentor" : "Ninja"})`}
          {currentUser.isMentor && !isCurrentUser && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ display: "block", margin: "5px auto" }}
              onClick={() =>
                FirestoreService.setUserIsMentor(
                  user.userId,
                  eventId,
                  !user.isMentor
                )
              }
            >{`Set as ${user.isMentor ? "Ninja" : "Mentor"}`}</Button>
          )}
          {isCurrentUser && " (me)"}
        </Typography>
      </Paper>
    </div>
  );
};

const Room = ({ eventId, room, users, currentUser }) => {
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
};

function ItemList({
  eventId,
  currentUser,
  eventUsers,
  eventRooms,
  eventRoomsUsers,
}) {
  const getUsersByRoomId = (roomId) => {
    const usersInRoom = eventRoomsUsers
      .filter((ru) => ru.roomId === roomId)
      .map((ru) => ru.userId);
    const users = eventUsers.filter((u) => usersInRoom.includes(u.userId));
    return users;
  };
  const users = eventUsers.map((item) => (
    <User
      key={item.userId}
      eventId={eventId}
      currentUser={currentUser}
      user={item}
    ></User>
  ));
  const rooms = eventRooms.map((item) => (
    <Room
      key={item.roomId}
      room={item}
      eventId={eventId}
      users={getUsersByRoomId(item.roomId)}
      currentUser={currentUser}
    ></Room>
  ));
  return (
    <div>
      <div>{users}</div>
      <hr style={{ borderStyle: "dashed", margin: "20px 0" }} />
      <div>{rooms}</div>
    </div>
  );
}

export default ItemList;
