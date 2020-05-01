import React, { useContext } from "react";
import { useDrag } from "react-dnd";
import { Typography, Avatar, Badge, Grid, Popover } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
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

const SmallAvatar = withStyles((theme) => ({
  root: {
    width: 22,
    height: 22,
    border: `2px solid ${theme.palette.background.paper}`,
  },
}))(Avatar);

function User({ user, currentUser, inRoom, avatarColor, changeRoom }) {
  const { setIsDragging } = useContext(store);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const [{ isDragging }, drag] = useDrag({
    item: { name: user.userName, type: ItemTypes.USER },
    begin: () => setIsDragging(true),
    canDrag: currentUser.isMentor,
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

  const popoverOpen = !isDragging && Boolean(anchorEl);
  const initials = user.userName
    .trim()
    .split(" ")
    .map((s) => s[0].toUpperCase())
    .concat();
  return (
    <Grid
      item
      xs
      style={{ opacity: isDragging ? "0.4" : "1" }}
      onMouseEnter={handlePopoverOpen}
      onMouseLeave={handlePopoverClose}
    >
      {user.isMentor ? (
        <Badge
          overlap="circle"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          badgeContent={<SmallAvatar>{"M"}</SmallAvatar>}
          ref={drag}
        >
          <Avatar style={{ ...avatarColor }}>{initials}</Avatar>
        </Badge>
      ) : (
        <Avatar style={{ ...avatarColor }} ref={drag}>
          {initials}
        </Avatar>
      )}
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
        <Typography>{user.userName}</Typography>
      </Popover>
    </Grid>
  );
}

export default User;
