import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from "react";
import * as FirestoreService from "./services/firestore";

const initialState = {
  currentUser: undefined,
  event: undefined,
  users: [],
  rooms: [],
  roomsUsers: [],
  docs: [],
};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "SET_CURRENT_USER":
        return { ...state, currentUser: action.payload };
      case "SET_EVENT":
        return {
          ...state,
          event: action.payload,
          users: action.payload.users || [],
          rooms: action.payload.rooms || [],
          docs: action.payload.docs || [],
          roomsUsers: action.payload.roomsUsers || [],
        };

      case "SET_ERROR":
        return { ...state, error: action.payload };
      default:
        throw new Error();
    }
  }, initialState);
  const [eventSnapshot, setEventSnapshot] = useState(undefined);
  const eventId = state.event ? state.event.eventId : undefined;
  useEffect(() => {
    if (eventSnapshot) {
      const timeoutId = setTimeout(
        () =>
          dispatch({
            type: "SET_EVENT",
            payload: { eventId, ...eventSnapshot },
          }),
        [500]
      );
      return () => clearTimeout(timeoutId);
    }
  }, [eventId, eventSnapshot]);

  const setCurrentUser = useCallback(
    (userId) => {
      const payload = state.users.find((u) => u.userId === userId);
      dispatch({ type: "SET_CURRENT_USER", payload });
    },
    [state.users]
  );

  const setEvent = useCallback(
    (event, userId) => {
      const user = event.users.find((u) => u.userId === userId);
      dispatch({ type: "SET_EVENT", payload: event });
      dispatch({ type: "SET_CURRENT_USER", payload: user });
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

  const addDoc = useCallback(
    async (url, name) => {
      if (!url) {
        setError("user-desc-req");
        return;
      }
      if (!name) {
        setError("user-desc-req");
        return;
      }
      try {
        await FirestoreService.addDoc(url, name, eventId);
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

  const addUser = useCallback(
    async (userId, userName, eventPassword) => {
      if (!userName) {
        setError("user-desc-req");
        return;
      }
      if (!eventPassword && state.event.password !== eventPassword) {
        setError("user-desc-req");
        return;
      }

      try {
        const user = {
          userId,
          userName,
          isMentor: false,
        };
        await FirestoreService.addUser(user, eventId);
        await FirestoreService.addUserToRoom(
          userId,
          state.event.defaultRoomId,
          eventId
        );
        dispatch({ type: "SET_CURRENT_USER", payload: user });
      } catch (reason) {
        if (reason.message === "duplicate-item-error") {
          setError(reason.message);
        } else {
          setError("add-list-item-error");
        }
      }
    },
    [eventId, setError, state.event]
  );

  const deleteUser = useCallback(
    (userId) => {
      const user = state.users.find((u) => u.userId === userId);
      if (user) FirestoreService.deleteUser(user, eventId);
    },
    [eventId, state.users]
  );

  const updatePublicPeriod = useCallback(
    async (period) => {
      if (!period) {
        setError("user-desc-req");
        return;
      }
      try {
        await FirestoreService.setEventPublicPeriod(eventId, period);
      } catch (reason) {
        setError(reason.message);
      }
    },
    [eventId, setError]
  );

  useEffect(() => {
    if (!eventId) return;
    const unsubscribe = FirestoreService.streamEvent(eventId, {
      next: (querySnapshot) => {
        setEventSnapshot(querySnapshot.data());
      },
      error: () => setError("user-get-fail"),
    });
    return unsubscribe;
  }, [eventId, dispatch, setError]);

  const toggleIsMentor = useCallback(
    ({ userId, userName, isMentor }) =>
      FirestoreService.setUserIsMentor(
        { userId, userName, isMentor },
        eventId,
        !isMentor
      ),
    [eventId]
  );

  const setHasFreeMovement = useCallback(
    (hasFreeMovement) =>
      FirestoreService.setEventHasFreeMovement(eventId, hasFreeMovement),
    [eventId]
  );

  const setJitsiServer = useCallback(
    (jitsiServer) => {
      const sanitized = String(jitsiServer).replace(
        /^(https?:\/\/)?(www\.)?/,
        ""
      );
      FirestoreService.setJitsiServer(eventId, sanitized);
    },
    [eventId]
  );

  const changeRoom = useCallback(
    (userId, roomId) => {
      const oldRu = state.roomsUsers.find((ru) => ru.userId === userId);
      FirestoreService.addUserToRoom(userId, roomId, eventId, oldRu);
    },
    [eventId, state.roomsUsers]
  );

  const deleteDoc = useCallback(
    (docId) => {
      const doc = state.docs.find((d) => d.docId === docId);
      if (doc) FirestoreService.deleteDoc(doc, eventId);
    },
    [eventId, state.docs]
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

  const isEventOpen = useMemo(() => {
    if (state.event && state.event.publicPeriod) {
      const currentTime = new Date();
      if (
        currentTime >= new Date(state.event.publicPeriod.startDate.toDate()) &&
        currentTime <= new Date(state.event.publicPeriod.endDate.toDate())
      ) {
        return true;
      }
    }
    return false;
  }, [state.event]);

  return (
    <Provider
      value={{
        event: state.event,
        currentUser: currentUserWithRoom,
        users: usersWithRoom,
        rooms: roomsWithUsers,
        docs: state.docs,
        addUser,
        deleteUser,
        isEventOpen,
        setError,
        setCurrentUser,
        setEvent,
        addRoom,
        toggleIsMentor,
        setHasFreeMovement,
        setJitsiServer,
        changeRoom,
        deleteDoc,
        updatePublicPeriod,
        addDoc,
      }}
    >
      {children}
    </Provider>
  );
};

export { store, StateProvider };
