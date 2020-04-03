import React from "react";
import { useTheme } from "@material-ui/core/styles";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";

import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";
import AddRoom from "./AddRoom/AddRoom";

import User from "./User";
import Room from "./Room";

function Dashboard({
  user,
  event,
  error,
  userMeta,
  eventUsers,
  eventRooms,
  eventRoomsUsers,
}) {
  const { palette } = useTheme();

  const theme = {
    container: { background: palette.primary.main },
    modal: { background: palette.background.default },
    listItem: {
      background: palette.grey[200],
      padding: "10px",
      margin: "5px",
      borderRadius: "2%",
    },
  };

  const getUsersByRoomId = (roomId) => {
    const usersInRoom = eventRoomsUsers
      .filter((ru) => ru.roomId === roomId)
      .map((ru) => ru.userId);
    const users = eventUsers.filter((u) => usersInRoom.includes(u.userId));
    return users;
  };
  return (
    <>
      <ErrorMessage errorCode={error}></ErrorMessage>
      <Grid container spacing={3}>
        {userMeta.isMentor && (
          <Grid item xs={12}>
            <div style={theme.listItem}>
              <AddRoom userId={user.userId} eventId={event.eventId} />
            </div>
          </Grid>
        )}
        {userMeta.isMentor && (
          <Grid
            container
            item
            xs={12}
            spacing={2}
            style={{ marginLeft: "10px", marginRight: "15px" }}
          >
            {eventUsers.map((item) => (
              <Grid item xs={2} key={item.userId}>
                <User
                  eventId={event.eventId}
                  currentUser={userMeta}
                  user={item}
                ></User>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid>
        )}

        <Grid
          container
          item
          xs={12}
          spacing={4}
          style={{ marginLeft: "10px", marginRight: "15px" }}
        >
          {eventRooms.map((item) => (
            <Grid item xs={3} key={item.roomId}>
              <Room
                room={item}
                eventId={event.eventId}
                users={getUsersByRoomId(item.roomId)}
                currentUser={userMeta}
              ></Room>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
}

export default Dashboard;
