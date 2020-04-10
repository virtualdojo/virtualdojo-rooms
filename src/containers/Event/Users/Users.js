import React, { useContext } from "react";
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

import { store } from "../../../store.js";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";

function Users() {
  const { currentUser, users, error, changeRoom, toggleIsMentor } = useContext(
    store
  );
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
              <TableCell align="right">Change Type</TableCell>
              <TableCell align="right">Follow Me</TableCell>
              <TableCell align="right">Follow Ninja</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.userId}>
                <TableCell component="th" scope="row">
                  {u.userName}
                </TableCell>
                <TableCell>{u.room.roomName}</TableCell>
                <TableCell>{u.isMentor ? "Mentor" : "Ninja"}</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="promote"
                    color="primary"
                    onClick={() => toggleIsMentor(u)}
                    disabled={currentUser.userId === u.userId}
                  >
                    <Tooltip
                      title={u.isMentor ? "Set as Ninja" : "Set as Mentor"}
                      placement="bottom"
                      key={u.isMentor}
                    >
                      {u.isMentor ? <EmojiIcon /> : <DomainIcon />}
                    </Tooltip>
                  </IconButton>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="promote"
                    color="primary"
                    onClick={() =>
                      changeRoom(u.userId, currentUser.room.roomId)
                    }
                    disabled={currentUser.room.roomId === u.room.roomId}
                  >
                    <Tooltip
                      title={
                        currentUser.room.roomId === u.room.roomId
                          ? "Same room"
                          : "Follow me"
                      }
                      placement="bottom"
                      key={currentUser.room.roomId === u.room.roomId}
                    >
                      {currentUser.room.roomId === u.room.roomId ? (
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
                    onClick={() =>
                      changeRoom(currentUser.userId, u.room.roomId)
                    }
                    disabled={currentUser.room.roomId === u.room.roomId}
                  >
                    <Tooltip
                      title={
                        currentUser.room.roomId === u.room.roomId
                          ? "Same room"
                          : "Follow Ninja"
                      }
                      placement="bottom"
                      key={currentUser.room.roomId === u.room.roomId}
                    >
                      {currentUser.room.roomId === u.room.roomId ? (
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
