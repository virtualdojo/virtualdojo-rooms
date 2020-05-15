import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
  useMemo,
  useState,
} from "react";
import * as FirestoreService from "./services/firestore";
import useQueryString from "./hooks/useQueryString";

export const CONSTANTS = {
  SIMPLE_VIEW: "simple",
  ADVANCED_VIEW: "advanced",
};

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
  userIdsBeingEdited: [],
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
      case "START_EDIT_USER":
        return {
          ...state,
          userIdsBeingEdited: state.userIdsBeingEdited.concat(action.payload),
          error: undefined,
        };
      case "END_EDIT_USER":
        const userToRemove = state.userIdsBeingEdited.indexOf(action.payload);
        const userIdsBeingEdited =
          userToRemove >= 0
            ? state.userIdsBeingEdited
                .slice(0, userToRemove)
                .concat(state.userIdsBeingEdited.slice(userToRemove + 1))
            : state.userIdsBeingEdited;
        return {
          ...state,
          userIdsBeingEdited,
        };
      default:
        console.error("Invalid action type ", action);
        return state;
    }
  }, initialState);
  const [queryEventId, setQueryEventId] = useQueryString("eventId");
  // Workaround to enable dragging while having Jitsi on background
  // Issue: https://github.com/react-dnd/react-dnd/issues/2184
  const [isDragging, setIsDragging] = useState(false);
  const [forcedView, setForcedView] = useState(undefined);
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
    async (userId) => {
      const user = state.users.find((u) => u.userId === userId);
      if (!user) return;
      dispatch({ type: "START_EDIT_USER", payload: userId });
      try {
        await FirestoreService.deleteUser(user, eventId);
      } catch (err) {
        console.log("Delete: ", err.message);
      }
      dispatch({ type: "END_EDIT_USER", payload: userId });
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
    async ({ userId, isMentor }) => {
      dispatch({ type: "START_EDIT_USER", payload: userId });
      await FirestoreService.setUserIsMentor(userId, eventId, !isMentor);
      dispatch({ type: "END_EDIT_USER", payload: userId });
    },
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

  const setRoomInfo = useCallback(
    ({ roomId, roomName, imageUrl }) => {
      return FirestoreService.setRoomInfo({
        eventId,
        roomId,
        roomName,
        imageUrl,
      });
    },
    [eventId]
  );

  const changeRoom = useCallback(
    async (userId, roomId) => {
      const isInRoom = state.roomsUsers.find(
        (ru) => ru.userId === userId && ru.roomId === roomId
      );
      if (isInRoom) return;
      dispatch({ type: "START_EDIT_USER", payload: userId });
      try {
        await FirestoreService.addUserToRoom(userId, roomId, eventId);
      } catch (err) {
        setError("change-room-fail");
      }
      dispatch({ type: "END_EDIT_USER", payload: userId });
    },
    [eventId, setError, state.roomsUsers]
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
            room: { ...roomMeta },
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
        users: users.map((u) => ({ ...u })),
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

  const isInSimpleView = forcedView === CONSTANTS.SIMPLE_VIEW;

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
        userIdsBeingEdited: state.userIdsBeingEdited,
        createEvent,
        addUser,
        deleteUser,
        isEventOpen,
        setError,
        setEvent,
        setRoomInfo,
        addRoom,
        toggleIsMentor,
        setHasFreeMovement,
        setJitsiServer,
        changeRoom,
        deleteDoc,
        updatePublicPeriod,
        addDoc,
        isDragging,
        setIsDragging,
        setForcedView,
        forcedView,
        isInSimpleView,
      }}
    >
      {children}
    </Provider>
  );
};

export { store, StateProvider };
