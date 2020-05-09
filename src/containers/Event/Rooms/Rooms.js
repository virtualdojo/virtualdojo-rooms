import React, { useContext } from "react";
import { useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-html5-backend";

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
    <DndProvider backend={Backend}>
      <Grid container>
        {currentUser.isMentor && (
          <Grid item xs>
            <div style={theme.listItem}>
              <AddRoom userId={currentUser.userId} eventId={event.eventId} />
            </div>
          </Grid>
        )}
        <Grid item xs={12}>
          <ErrorMessage errorCode={error}></ErrorMessage>
        </Grid>

        <Grid
          container
          item
          xs={12}
          spacing={3}
          style={{ margin: "10px" }}
          alignContent={"flex-start"}
          alignItems={"flex-start"}
        >
          {rooms.map((room) => (
            <Grid item container xs={4} key={room.roomId} spacing={1}>
              <Room
                room={room}
                eventId={event.eventId}
                currentUser={currentUser}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </DndProvider>
  );
}
export default Rooms;
