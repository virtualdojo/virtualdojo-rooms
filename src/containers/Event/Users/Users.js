import React, { useContext, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
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
  DeleteForever as DeleteForeverIcon,
} from "@material-ui/icons";
import { useTranslation } from "react-i18next";

import { store } from "../../../store.js";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";

const useStyles = makeStyles({
  table: {
    maxWidth: 1000,
  },
});

function Users() {
  const {
    currentUser,
    users,
    error,
    changeRoom,
    toggleIsMentor,
    deleteUser,
    userIdsBeingEdited,
  } = useContext(store);
  const classes = useStyles();
  const { t } = useTranslation("translation");
  const orderedUsers = users.sort((a, b) => (a.userName > b.userName ? 1 : -1));

  const isBeingEdited = useCallback(
    (userId) => {
      return userIdsBeingEdited.indexOf(userId) >= 0;
    },
    [userIdsBeingEdited]
  );
  return (
    <>
      <ErrorMessage errorCode={error}></ErrorMessage>
      <TableContainer
        component={Paper}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Table className={classes.table} size="small" aria-label="users table">
          <TableHead>
            <TableRow>
              <TableCell colSpan={4}>{t("Name")}</TableCell>
              <TableCell align="right">{t("Room")}</TableCell>
              <TableCell align="right">{t("Type")}</TableCell>
              <TableCell align="right">{t("Change Type")}</TableCell>
              <TableCell align="right">{t("Follow Me")}</TableCell>
              <TableCell align="right">{t("Follow Ninja")}</TableCell>
              <TableCell align="right">{t("Delete Ninja")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderedUsers.map((u) => (
              <TableRow key={`${u.userId}${u.isMentor}`}>
                <TableCell component="th" scope="row" colSpan={4}>
                  {u.userName}
                </TableCell>
                <TableCell align="right">{u.room.roomName}</TableCell>
                <TableCell align="right">
                  {u.isMentor ? "Mentor" : "Ninja"}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    aria-label="promote"
                    color="primary"
                    onClick={() => toggleIsMentor(u)}
                    disabled={
                      currentUser.userId === u.userId || isBeingEdited(u.userId)
                    }
                  >
                    <Tooltip
                      title={
                        u.isMentor ? t("Set As Ninja") : t("Set As Mentor")
                      }
                      placement="bottom"
                      key={u.isMentor}
                    >
                      {u.isMentor ? <EmojiIcon /> : <DomainIcon />}
                    </Tooltip>
                  </IconButton>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    aria-label="promote"
                    color="primary"
                    onClick={() =>
                      changeRoom(u.userId, currentUser.room.roomId)
                    }
                    disabled={
                      currentUser.room.roomId === u.room.roomId ||
                      isBeingEdited(u.userId)
                    }
                  >
                    <Tooltip
                      title={
                        currentUser.room.roomId === u.room.roomId
                          ? "Same room"
                          : t("Follow Me")
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
                    size="small"
                    aria-label="promote"
                    color="primary"
                    onClick={() =>
                      changeRoom(currentUser.userId, u.room.roomId)
                    }
                    disabled={
                      currentUser.room.roomId === u.room.roomId ||
                      isBeingEdited(u.userId)
                    }
                  >
                    <Tooltip
                      title={
                        currentUser.room.roomId === u.room.roomId
                          ? "Same room"
                          : t("Follow Ninja")
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
                <TableCell align="right">
                  <IconButton
                    size="small"
                    aria-label="promote"
                    color="primary"
                    onClick={() => deleteUser(u.userId)}
                    disabled={
                      currentUser.userId === u.userId || isBeingEdited(u.userId)
                    }
                  >
                    <Tooltip title={t("Delete Ninja")} placement="bottom">
                      <DeleteForeverIcon />
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
