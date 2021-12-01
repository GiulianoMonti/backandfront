import React, { useState, useEffect } from "react";
import "./index.css";
import Form from "./components/Form";
import Persons from "./components/Persons";
import personService from "./services/notes.js";
import Notification from "./components/Notification";
import ErrorMessage from "./components/ErrorMessage";
import axios from "axios";
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [errorMessage, setErrorMessage] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/api/persons").then((res) => {
      setPersons(res.data);
    });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();

    const confirm = () =>
      window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one`
      );

    const personObject = {
      name: newName,
      number: newNumber,
    };
    if (persons.some((person) => person.name === personObject.name)) {
      const alreadyAdded = persons.find((person) => person.name === newName);
      if (confirm())
        personService
          .update(alreadyAdded.id, personObject)
          .then((returnedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== returnedPerson.id ? person : returnedPerson
              )
            );
            setNotificationMessage(`${alreadyAdded.name}'s number was updated`);
          })
          .catch((error) => {
            setErrorMessage(
              `Person '${persons.content}' was already removed from server`
            );
            setTimeout(() => {
              setNotificationMessage(null);
            }, 5000);

            setNewName("");
            setNewNumber("");
          });
    } else {
      personService
        .create(personObject)
        .then((response) => {
          setPersons(persons.concat(response));
          setNotificationMessage(`Added ${newName}`);
          setNewName("");
        })
        .catch((error) => {
          setErrorMessage(
            `Person '${persons.content}' was already removed from server`
          );
          setTimeout(() => {
            setNotificationMessage(null);
          }, 5000);

          setNewName("");
          setNewNumber("");
        });
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name} ?`)) {
      personService.deleteById(id).then(() => {
        setPersons(persons.filter((person) => person.id !== id));
        setNotificationMessage(`Deleted ${name}`);
      });
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };

  const filterPersons = persons
    .filter((person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((result) => result);

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          <h4>Filter shown with</h4>
          <input value={searchTerm} onChange={handleSearch} />
        </div>
      </form>
      <Notification message={notificationMessage} />
      <ErrorMessage message={errorMessage} />

      <Form
        addPerson={addPerson}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <Persons
        persons={filterPersons}
        searchTerm={searchTerm}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default App;
