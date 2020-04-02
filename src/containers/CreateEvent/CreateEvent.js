import React, { useState } from 'react';
import './CreateEvent.css';
import * as FirestoreService from '../../services/firestore';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';

function CreateEvent(props) {

    const { onCreate, userId } = props;

    const [ error, setError ] = useState();

    function createEvent(e) {
        
        e.preventDefault();
        setError(null);

        const eventName = document.createListForm.eventName.value;
        if (!eventName) {
            setError('event-name-required');
            return;
        }

        const userName = document.createListForm.userName.value;
        if (!userName) {
            setError('user-name-required');
            return;
        }

        FirestoreService.createEvent(eventName, userName, userId)
            .then(docRef => {
                onCreate(docRef.id, userName);

            })
            .catch(reason => { 
                setError('create-list-error')
        });
    }

    return (
        <div>
            <header>
                <h1>Benvenuto nella creazione di un nuovo Virtualdojo!</h1>
            </header>
            <div className="create-container">
                <div>
                    <form name="createListForm">
                        <p><label>Inserisci il nome dell'evento</label></p>
                        <p><input type="text" name="eventName" /></p>
                        <p><label>Inserisci il tuo nome</label></p>
                        <p><input type="text" name="userName" /></p>
                        <ErrorMessage errorCode={error}></ErrorMessage>
                        <p><button onClick={createEvent}>Crea un nuovo evento</button></p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateEvent;