import React, { useEffect, useState } from "react";

import { useTheme } from "@material-ui/core/styles";
import { Button, IconButton } from "@material-ui/core";
import {
  CancelRounded as CancelIcon,
  DescriptionRounded as DocumentIcon,
  PeopleAltRounded as PeopleAltRoundedIcon,
} from "@material-ui/icons";
import Grid from "@material-ui/core/Grid";

import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import AddRoom from "./AddRoom/AddRoom";

import ItemList from "./ItemList/ItemList";
import "./EditEvent.css";

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
    listItem: { background: palette.grey[200] },
  };

  return (
    <>
      <ErrorMessage errorCode={error}></ErrorMessage>
      <Grid container spacing={3}>
        {user.isMentor && (
          <Grid item xs={12}>
            <div className="list-column" style={theme.listItem}>
              <AddRoom userId={user.userId} eventId={event.eventId} />
            </div>
          </Grid>
        )}
        <ItemList
          eventId={event.eventId}
          currentUser={userMeta || {}}
          eventUsers={eventUsers}
          eventRooms={eventRooms}
          eventRoomsUsers={eventRoomsUsers}
        />
      </Grid>
    </>
  );
}

export default Dashboard;
