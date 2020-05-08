import React, { useState, useContext } from "react";
import { useDrag } from "react-dnd";
import { Typography, Avatar, Grid, Popover } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { store } from "../../../store.js";

const useStyles = makeStyles((theme) => ({
  popover: {
    pointerEvents: "none",
  },
  paper: {
    padding: theme.spacing(1),
  },
}));

const ItemTypes = {
  USER: "user",
};

function User({
  user,
  currentUser,
  avatarSize,
  inRoom,
  avatarColor,
  changeRoom,
  dragDisabled,
}) {
  const { setIsDragging } = useContext(store);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const canDrag = currentUser.isMentor && !dragDisabled;

  const [{ isDragging }, drag] = useDrag({
    item: { name: user.userName, type: ItemTypes.USER },
    begin: () => setIsDragging(true),
    canDrag,
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult();
      setIsDragging(false);
      if (item && dropResult) {
        changeRoom(user.userId, dropResult.room.roomId);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const avatarWidthHeight = avatarSize === "sm" ? 24 : 36;

  const popoverOpen = !isDragging && Boolean(anchorEl);
  const initials = user.userName
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((s) => s[0].toUpperCase())
    .concat();
  return (
    <Grid
      item
      style={{
        opacity: isDragging ? "0.4" : "1",
      }}
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
    >
      <Avatar
        style={{
          ...avatarColor,
          width: avatarWidthHeight,
          height: avatarWidthHeight,
          cursor: canDrag ? "grab" : "default",
          borderRadius: user.isMentor ? 0 : "50%",
        }}
        ref={drag}
      >
        {initials}
      </Avatar>

      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={popoverOpen}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography>
          {user.userName}
          {user.isMentor && <b> (Mentor)</b>}
        </Typography>
      </Popover>
    </Grid>
  );
}

export default User;
