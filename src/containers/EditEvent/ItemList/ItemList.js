import React from "react";
import * as FirestoreService from "../../../services/firestore";
import { useDrag, useDrop } from "react-dnd";
import { useTheme } from "@material-ui/core/styles";
import { Button, Paper, Typography, Card } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";

import User from "../User";
import Room from "../Room";

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
  // const users = eventUsers.map((item) => (
  //   <User
  //     key={item.userId}
  //     eventId={eventId}
  //     currentUser={currentUser}
  //     user={item}
  //   ></User>
  // ));
  const rooms = eventRooms.map((item) => (
    <Grid item xs={3}>
      <Room
        key={item.roomId}
        room={item}
        eventId={eventId}
        users={getUsersByRoomId(item.roomId)}
        currentUser={currentUser}
      ></Room>
    </Grid>
  ));
  return rooms;
}

export default ItemList;
