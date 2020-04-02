import React, { useEffect, useState } from "react";
import * as FirestoreService from "../../../services/firestore";
import ErrorMessage from "../../../components/ErrorMessage/ErrorMessage";
import { useDrag, useDrop } from "react-dnd";

const ItemTypes = {
  USER: "user",
};

const User = ({ eventId, user }) => {
  const [{ isDragging }, drag] = useDrag({
    item: { name: user.userName, type: ItemTypes.USER },
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
  const opacity = isDragging ? 0.4 : 1;
  return (
    <div ref={drag} style={{ opacity }}>
      {user.userName}
    </div>
  );
};

const Room = ({ eventId, room, users }) => {
  const [{ canDrop, isOver }, drop] = useDrop({
    accept: ItemTypes.USER,
    drop: () => ({ room }),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });
  const isActive = canDrop && isOver;
  let backgroundColor = "white";
  if (isActive) {
    backgroundColor = "gray";
  } else if (canDrop) {
    backgroundColor = "yellow";
  }

  return (
    <div ref={drop} style={{ backgroundColor }}>
      <h1>{room.roomName}</h1>
      {users.map((u) => (
        <User key={u.userId} user={u} eventId={eventId}></User>
      ))}
    </div>
  );
};

function ItemList(props) {
  const { eventId } = props;

  const [eventUsers, setEventUsers] = useState([]);
  const [eventRooms, setEventRooms] = useState([]);
  const [eventRoomsUsers, setEventRoomsUsers] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    const unsubscribe = FirestoreService.streamEventItems(eventId, {
      next: (querySnapshot) => {
        const updatedEventUsers = querySnapshot.docs
          ? querySnapshot.docs.map((docSnapshot) => docSnapshot.data())
          : [];
        setEventUsers(updatedEventUsers);
      },
      error: () => setError("user-get-fail"),
    });
    return unsubscribe;
  }, [eventId, setEventUsers]);

  useEffect(() => {
    const unsubscribe = FirestoreService.streamEventRooms(eventId, {
      next: (querySnapshot) => {
        const updatedEventRooms = querySnapshot.docs
          ? querySnapshot.docs.map((docSnapshot) => docSnapshot.data())
          : [];
        setEventRooms(updatedEventRooms);
      },
      error: () => setError("user-get-fail"),
    });
    return unsubscribe;
  }, [eventId, setEventRooms]);

  useEffect(() => {
    const unsubscribe = FirestoreService.streamEventRoomsUsers(eventId, {
      next: (querySnapshot) => {
        const updatedEventRoomsUsers = querySnapshot.docs
          ? querySnapshot.docs.map((docSnapshot) => docSnapshot.data())
          : [];
        setEventRoomsUsers(updatedEventRoomsUsers);
      },
      error: () => setError("user-get-fail"),
    });
    return unsubscribe;
  }, [eventId, setEventRoomsUsers]);

  const getUsersByRoomId = (roomId) => {
    const usersInRoom = eventRoomsUsers
      .filter((ru) => ru.roomId === roomId)
      .map((ru) => ru.userId);
    const users = eventUsers.filter((u) => usersInRoom.includes(u.userId));
    return users;
  };
  const users = eventUsers.map((item) => (
    <User key={item.userId} eventId={eventId} user={item}></User>
  ));
  const rooms = eventRooms.map((item) => (
    <Room
      key={item.roomId}
      room={item}
      eventId={eventId}
      users={getUsersByRoomId(item.roomId)}
    ></Room>
  ));
  return (
    <div>
      <ErrorMessage errorCode={error}></ErrorMessage>
      <div>{users}</div>
      <div>-----</div>
      <div>{rooms}</div>
    </div>
  );
}

export default ItemList;
