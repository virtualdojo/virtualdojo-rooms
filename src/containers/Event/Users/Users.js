import React from "react";
import {
  TableContainer,
  Table,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import {
  Domain as DomainIcon,
  EmojiEmotions as EmojiIcon,
} from "@material-ui/icons";
import * as FirestoreService from "../../../services/firestore";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";

const toggleIsMentor = (u, eventId) =>
  FirestoreService.setUserIsMentor(u.userId, eventId, !u.isMentor);

function Users({
  user,
  event,
  error,
  userMeta,
  eventUsers,
  eventRooms,
  eventRoomsUsers,
}) {
  // map users to room
  const usersWithRoom = eventUsers.map((u) => {
    const userRoom = eventRoomsUsers.find((ru) => ru.userId === u.userId);
    if (userRoom) {
      const roomMeta = eventRooms.find((r) => r.roomId === userRoom.roomId);
      if (roomMeta) {
        return {
          ...u,
          ...roomMeta,
        };
      }
    }
    return {
      ...u,
    };
  });
  return (
    <>
      <ErrorMessage errorCode={error}></ErrorMessage>
      <TableContainer component={Paper}>
        <Table aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Type</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usersWithRoom.map((u) => (
              <TableRow key={u.userId}>
                <TableCell component="th" scope="row">
                  {u.userName}
                </TableCell>
                <TableCell>{u.roomName}</TableCell>
                <TableCell>{u.isMentor ? "Mentor" : "Ninja"}</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="promote"
                    color="primary"
                    onClick={() => toggleIsMentor(u, event.eventId)}
                    disabled={user.userId === u.userId}
                  >
                    <Tooltip
                      title={u.isMentor ? "Set as Ninja" : "Set as Mentor"}
                      placement="bottom"
                    >
                      {u.isMentor ? <EmojiIcon /> : <DomainIcon />}
                    </Tooltip>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default Users;
