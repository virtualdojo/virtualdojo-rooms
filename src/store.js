import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import * as FirestoreService from "./services/firestore";

const initialState = {
  currentUser: undefined,
  event: undefined,
  users: [],
  rooms: [],
  roomsUsers: [],
};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "SET_CURRENT_USER":
        return { ...state, currentUser: action.payload };
      case "SET_EVENT":
        return { ...state, event: action.payload };
      case "SET_EVENT_USERS":
        return { ...state, users: action.payload };
      case "SET_EVENT_ROOMS":
        return { ...state, rooms: action.payload };
      case "SET_EVENT_ROOMS_USERS":
        return { ...state, roomsUsers: action.payload };
      case "SET_ERROR":
        return { ...state, error: action.payload };
      default:
        throw new Error();
    }
  }, initialState);

  const eventId = state.event ? state.event.eventId : undefined;

  const setCurrentUser = useCallback(
    (payload) => {
      dispatch({ type: "SET_CURRENT_USER", payload });
    },
    [dispatch]
  );

  const setEvent = useCallback(
    (payload) => {
      dispatch({ type: "SET_EVENT", payload });
    },
    [dispatch]
  );

  const setError = useCallback(
    (payload) => {
      dispatch({ type: "SET_ERROR", payload });
    },
    [dispatch]
  );

  const addRoom = useCallback(
    async (name) => {
      if (!name) {
        setError("user-desc-req");
        return;
      }
      try {
        await FirestoreService.addRoom(name, eventId);
      } catch (reason) {
        if (reason.message === "duplicate-item-error") {
          setError(reason.message);
        } else {
          setError("add-list-item-error");
        }
      }
    },
    [eventId, setError]
  );

  useEffect(() => {
    if (!eventId) return;
    const unsubscribe = FirestoreService.streamEvent(eventId, {
      next: (querySnapshot) => {
        dispatch({
          type: "SET_EVENT",
          payload: { eventId, ...querySnapshot.data() },
        });
      },
      error: () => setError("user-get-fail"),
    });
    return unsubscribe;
  }, [eventId, dispatch, setError]);

  useEffect(() => {
    if (!eventId) return;
    const unsubscribe = FirestoreService.streamEventUsers(eventId, {
      next: (querySnapshot) => {
        const result = querySnapshot.docs
          ? querySnapshot.docs.map((docSnapshot) => docSnapshot.data())
          : [];
        dispatch({ type: "SET_EVENT_USERS", payload: result });
      },
      error: () => setError("user-get-fail"),
    });
    return unsubscribe;
  }, [eventId, dispatch, setError]);

  useEffect(() => {
    if (!eventId) return;
    const unsubscribe = FirestoreService.streamEventRooms(eventId, {
      next: (querySnapshot) => {
        const result = querySnapshot.docs
          ? querySnapshot.docs.map((docSnapshot) => docSnapshot.data())
          : [];
        dispatch({ type: "SET_EVENT_ROOMS", payload: result });
      },
      error: () => setError("user-get-fail"),
    });
    return unsubscribe;
  }, [eventId, dispatch, setError]);

  useEffect(() => {
    if (!eventId) return;
    const unsubscribe = FirestoreService.streamEventRoomsUsers(eventId, {
      next: (querySnapshot) => {
        const result = querySnapshot.docs
          ? querySnapshot.docs.map((docSnapshot) => docSnapshot.data())
          : [];
        dispatch({ type: "SET_EVENT_ROOMS_USERS", payload: result });
      },
      error: () => setError("user-get-fail"),
    });
    return unsubscribe;
  }, [eventId, dispatch, setError]);

  const toggleIsMentor = useCallback(
    (user) =>
      FirestoreService.setUserIsMentor(user.userId, eventId, !user.isMentor),
    [eventId]
  );

  const changeRoom = useCallback(
    (userId, roomId) => FirestoreService.addUserToRoom(userId, roomId, eventId),
    [eventId]
  );

  const usersWithRoom = useMemo(() => {
    return state.users.map((u) => {
      const userRoom = state.roomsUsers.find((ru) => ru.userId === u.userId);
      if (userRoom) {
        const roomMeta = state.rooms.find((r) => r.roomId === userRoom.roomId);
        if (roomMeta) {
          return {
            ...u,
            room: roomMeta,
          };
        }
      }
      return {
        ...u,
        room: {},
      };
    });
  }, [state.users, state.rooms, state.roomsUsers]);

  const roomsWithUsers = useMemo(() => {
    return state.rooms.map((r) => {
      const usersInRoom = state.roomsUsers
        .filter((ru) => ru.roomId === r.roomId)
        .map((ru) => ru.userId);
      const users = state.users.filter((u) => usersInRoom.includes(u.userId));
      return {
        ...r,
        users,
      };
    });
  }, [state.users, state.rooms, state.roomsUsers]);

  const currentUserWithRoom = useMemo(() => {
    return (
      state.currentUser &&
      usersWithRoom.find((u) => u.userId === state.currentUser.userId)
    );
  }, [state.currentUser, usersWithRoom]);

  return (
    <Provider
      value={{
        event: state.event,
        currentUser: currentUserWithRoom,
        users: usersWithRoom,
        rooms: roomsWithUsers,
        setError,
        setCurrentUser,
        setEvent,
        addRoom,
        toggleIsMentor,
        changeRoom,
      }}
    >
      {children}
    </Provider>
  );
};

export { store, StateProvider };
