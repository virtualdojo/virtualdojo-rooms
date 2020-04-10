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
  Explore as ExploreIcon,
  ExploreOff as ExploreOffIcon,
  ControlCamera as ControlCameraIcon,
  SupervisedUserCircle as SupervisedUserCircleIcon,
} from "@material-ui/icons";

import * as FirestoreService from "../../../services/firestore";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";

const toggleIsMentor = (u, eventId) =>
  FirestoreService.setUserIsMentor(u.userId, eventId, !u.isMentor);

const changeRoom = (u, room, eventId) =>
  FirestoreService.addUserToRoom(u.userId, room, eventId);

function Users({
  user,
  event,
  error,
  userMeta,
  eventUsers,
  eventRooms,
  eventRoomsUsers,
}) {
  // get user room id
  const myRoom = eventRoomsUsers.find((u) => u.userId === user.userId) || user;
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
              <TableCell align="right">Follow Me</TableCell>
              <TableCell align="right">Follow Ninja</TableCell>
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
                <TableCell align="right">
                  <IconButton
                    aria-label="promote"
                    color="primary"
                    onClick={() => changeRoom(u, myRoom.roomId, event.eventId)}
                    disabled={myRoom.roomId === u.roomId}
                  >
                    <Tooltip
                      title={
                        myRoom.roomId === u.roomId ? "Same room" : "Follow me"
                      }
                      placement="bottom"
                    >
                      {myRoom.roomId === u.roomId ? (
                        <ExploreOffIcon />
                      ) : (
                        <ExploreIcon />
                      )}
                    </Tooltip>
                  </IconButton>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="promote"
                    color="primary"
                    onClick={() => changeRoom(user, u.roomId, event.eventId)}
                    disabled={myRoom.roomId === u.roomId}
                  >
                    <Tooltip
                      title={
                        myRoom.roomId === u.roomId
                          ? "Same room"
                          : "Follow Ninja"
                      }
                      placement="bottom"
                    >
                      {myRoom.roomId === u.roomId ? (
                        <SupervisedUserCircleIcon />
                      ) : (
                        <ControlCameraIcon />
                      )}
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
