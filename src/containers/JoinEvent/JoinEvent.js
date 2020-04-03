import React, { useState } from "react";
import "./JoinEvent.css";
import ErrorMessage from "../../components/ErrorMessage/ErrorMessage";
import * as FirestoreService from "../../services/firestore";

function JoinEvent(props) {
  const { users, eventId, onSelectUser, userId } = props;

  const [error, setError] = useState();

  function addNewUser(e) {
    e.preventDefault();
    setError(null);

    const userName = document.addUserToListForm.name.value;
    if (!userName) {
      setError("user-name-required");
      return;
    }

    if (users.find((user) => user.name === userName)) {
      onSelectUser(userName);
    } else {
      FirestoreService.addUserToEvent(userName, eventId, userId)
        .then(() => {
          localStorage.setItem("userName", userName);
          onSelectUser(userName);
        })
        .catch(() => setError("add-user-to-list-error"));
    }
  }

  return (
    <div>
      <header>
        <h1>Benvenuto al Virtualdojo!</h1>
      </header>
      <div className="join-container">
        <div>
          <form name="addUserToListForm">
            <p>Inserisci il tuo nome per accedere</p>
            <p>
              <input type="text" name="name" />
              <button onClick={addNewUser}>Join</button>
            </p>
            <ErrorMessage errorCode={error}></ErrorMessage>
          </form>
        </div>
      </div>
    </div>
  );
}

export default JoinEvent;
