import React from "react";
import { useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";
import AddRoom from "./AddRoom/AddRoom";

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
      <Grid container>
        {userMeta.isMentor && (
          <Grid item xs>
            <div style={theme.listItem}>
              <AddRoom userId={user.userId} eventId={event.eventId} />
            </div>
          </Grid>
        )}

        <Grid
          container
          item
          xs={12}
          spacing={2}
          style={{ margin: "10px", marginRight: "15px" }}
        >
          {eventRooms.map((item) => (
            <Grid item container xs={3} key={item.roomId} spacing={1}>
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
