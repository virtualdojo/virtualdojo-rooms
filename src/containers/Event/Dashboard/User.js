import React from "react";
import * as FirestoreService from "../../../services/firestore";
import { useDrag, useDrop } from "react-dnd";
import { useTheme } from "@material-ui/core/styles";
import { Button, Paper, Typography, Card } from "@material-ui/core";

const ItemTypes = {
  USER: "user",
};

function User({ eventId, user, currentUser, inRoom }) {
  const [isSelected, setIsSelected] = React.useState(false);
  const [{ isDragging }, drag] = useDrag({
    item: { name: user.userName, type: ItemTypes.USER },
    canDrag: currentUser.isMentor,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        FirestoreService.addUserToRoom(
          user.userId,
          dropResult.room.roomId,
          eventId
        );
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const isCurrentUser = currentUser && currentUser.userId === user.userId;

  const styles = {
    opacity: isDragging ? 0.4 : 1,
    width: inRoom ? "90%" : "100%",
    margin: "0 auto 5px auto",
  };

  return (
    <div ref={drag} style={styles} onClick={() => setIsSelected(!isSelected)}>
      <Paper elevation={3} style={{ padding: 5 }}>
        <Typography variant={inRoom ? "h7" : "h10"}>
          {`${user.userName} - (${user.isMentor ? "Mentor" : "Ninja"})`}
          {isSelected && !inRoom && currentUser.isMentor && !isCurrentUser && (
            <Button
              variant="contained"
              color="primary"
              size="small"
              style={{ display: "block", margin: "5px auto" }}
              onClick={() =>
                FirestoreService.setUserIsMentor(
                  user.userId,
                  eventId,
                  !user.isMentor
                )
              }
            >{`Set as ${user.isMentor ? "Ninja" : "Mentor"}`}</Button>
          )}
          {isCurrentUser && " (me)"}
        </Typography>
      </Paper>
    </div>
  );
}

export default User;
