import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import * as FirestoreService from "./services/firestore";
import useQueryString from "./hooks/useQueryString";

const initialState = {
  isInitializing: true,
  isLoading: false,
  authUser: undefined,
  event: undefined,
  users: [],
  rooms: [],
  roomsUsers: [],
  docs: [],
  error: undefined,
};
const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "SET_AUTH_USER":
        return {
          ...state,
          authUser: action.payload,
          error: undefined,
          isInitializing: false,
        };
      case "EVENT_FETCH_START":
        return {
          ...state,
          event: undefined,
          users: [],
          rooms: [],
          docs: [],
          roomsUsers: [],
          error: undefined,
          isLoading: true,
        };
      case "EVENT_FETCH_END":
        return {
          ...state,
          event: action.payload,
          users: action.payload.users || [],
          rooms: action.payload.rooms || [],
          docs: action.payload.docs || [],
          roomsUsers: action.payload.roomsUsers || [],
          error: undefined,
          isLoading: false,
        };

      case "SET_ERROR":
        return {
          ...state,
          error: action.payload,
          isLoading: false,
          isInitializing: false,
        };
      default:
        console.error("Invalid action type ", action);
        return state;
    }
  }, initialState);
  const [queryEventId, setQueryEventId] = useQueryString("eventId");
  const eventId = queryEventId;

  const setAuthUser = useCallback((payload) => {
    dispatch({ type: "SET_AUTH_USER", payload });
  }, []);

  const setEvent = useCallback((event) => {
    dispatch({ type: "EVENT_FETCH_END", payload: event });
  }, []);

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

  const createEvent = useCallback(
    async ({ eventName, eventPassword, mentorPassword, userName }) => {
      if (!eventName) {
        setError("user-desc-req");
        return;
      }
      if (!eventPassword) {
        setError("user-desc-req");
        return;
      }

      if (!mentorPassword) {
        setError("user-desc-req");
        return;
      }

      if (!userName) {
        setError("user-desc-req");
        return;
      }

      try {
        const eventId = await FirestoreService.createEvent({
          eventName: eventName.trim(),
          eventPassword: eventPassword.trim(),
          mentorPassword: mentorPassword.trim(),
          userName: userName.trim(),
          additionalConfig: {},
        });
        setQueryEventId(eventId);
      } catch (err) {
        setError(err.message);
      }
    },
    [setError, setQueryEventId]
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
    async ({ userName, eventPassword }) => {
      if (!userName) {
        setError("user-desc-req");
        return;
      }

      if (!eventPassword) {
        setError("user-desc-req");
        return;
      }

      try {
        await FirestoreService.addUserToEvent(
          userName.trim(),
          eventId,
          eventPassword.trim()
        );
      } catch (err) {
        setError(err.message);
      }
    },
    [eventId, setError]
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
    async function getUser() {
      const userCredential = await FirestoreService.authenticateAnonymously();
      if (userCredential) {
        setAuthUser(userCredential.user);
      } else {
        setError("Authentication error");
      }
    }
    getUser();
  }, [setAuthUser, setError]);

  useEffect(() => {
    if (!eventId || !state.authUser) return;
    dispatch({ type: "EVENT_FETCH_START" });
    const unsubscribe = FirestoreService.streamEvent(eventId, {
      next: (querySnapshot) => {
        setEvent({ eventId, ...querySnapshot.data() });
      },
      error: () => setError("user-get-fail"),
    });
    return unsubscribe;
  }, [eventId, state.authUser, dispatch, setError, setEvent]);

  const toggleIsMentor = useCallback(
    ({ userId, isMentor }) =>
      FirestoreService.setUserIsMentor(userId, eventId, !isMentor),
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
    if (!state.authUser || !state.event) return;
    return usersWithRoom.find((u) => u.userId === state.authUser.uid);
  }, [state.authUser, state.event, usersWithRoom]);

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
        isInitializing: state.isInitializing,
        event: state.event,
        currentUser: currentUserWithRoom,
        users: usersWithRoom,
        rooms: roomsWithUsers,
        docs: state.docs,
        error: state.error,
        createEvent,
        addUser,
        deleteUser,
        isEventOpen,
        setError,
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
