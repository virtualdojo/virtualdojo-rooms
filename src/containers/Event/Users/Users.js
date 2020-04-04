import React from "react";
import { Typography } from "@material-ui/core";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";

function Users({
  user,
  event,
  error,
  userMeta,
  eventUsers,
  eventRooms,
  eventRoomsUsers,
}) {
  return (
    <>
      <ErrorMessage errorCode={error}></ErrorMessage>
      {eventUsers.map((item) => (
        <Typography variant={"h2"}>{`${user.userName} - (${
          item.isMentor ? "Mentor" : "Ninja"
        })`}</Typography>
      ))}
    </>
  );
}

export default Users;
