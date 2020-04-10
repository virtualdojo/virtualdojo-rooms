import React, { useContext } from "react";
import { useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";

import { store } from "../../../store.js";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";

import AddRoom from "./AddRoom";
import Room from "./Room";

function Rooms() {
  const { currentUser, event, rooms, error } = useContext(store);
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

  return (
    <>
      <ErrorMessage errorCode={error}></ErrorMessage>
      <Grid container>
        {currentUser.isMentor && (
          <Grid item xs>
            <div style={theme.listItem}>
              <AddRoom userId={currentUser.userId} eventId={event.eventId} />
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
          {rooms.map((room) => (
            <Grid item container xs={3} key={room.roomId} spacing={1}>
              <Room
                room={room}
                eventId={event.eventId}
                currentUser={currentUser}
              ></Room>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </>
  );
}

export default Rooms;
