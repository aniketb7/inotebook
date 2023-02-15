import React, { useState } from "react";
import noteContex from "./noteContext";

const NoteState = (props) => {
  const notesInitial = []
  const [notes, setNotes] = useState(notesInitial)

  // get all notes
  const getNotes = async () => {
    try {
      const host = 'http://localhost:5000'
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          'mode': 'no-cors',
          'Content-Type': "application/json",
          'Accept': 'application/json',
          "auth-token": localStorage.getItem('token')
        }

      });
      const json = await response.json()
      setNotes(json)

    }
    catch (error) {

    }
  }

  //Add a note
  const addNote = async (title, description, tag) => {

    try {
      const host = 'http://localhost:5000'
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: {
          'mode': 'no-cors',
          'Content-Type': "application/json",
          'Accept': 'application/json',
          "auth-token": localStorage.getItem('token')
        },
        body: JSON.stringify({ title, description, tag })
      });
      const note = await response.json()
      setNotes(notes.concat(note))
      props.showAlert("Added successfully", "success")
    }
    catch (e) {
      props.showAlert("Not able to add the note, error from server side", "danger")
    }

  }

  // Delete a note  
  const deleteNote = async (id) => {
    try {
      const host = 'http://localhost:5000'
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          'mode': 'no-cors',
          'Content-Type': "application/json",
          'Accept': 'application/json',
          "auth-token": localStorage.getItem('token')
        }

      });
      const json = await response.json()
      const newNote = notes.filter((note) => note._id !== id)
      setNotes(newNote)
      props.showAlert("Deleted note successfully", "success")
    }
    catch (e) {
      props.showAlert("not able to delete the note", "danger")
    }
  }

  // edit a note

  const editNote = async (id, title, description, tag) => {
    // API CALL
    try {
      const host = 'http://localhost:5000'
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: "PUT",
        headers: {
          'Content-Type': "application/json",
          "auth-token": localStorage.getItem('token')
        },
        body: JSON.stringify({ title, description, tag })
      });

      const json = await response.json()

      let newNotes = JSON.parse(JSON.stringify(notes))

      for (let index = 0; index < newNotes.length; index++) {
        const element = newNotes[index]
        if (element._id === id) {
          newNotes[index].title = title;
          newNotes[index].description = description;
          newNotes[index].tag = tag
          break;
        }
      }
      setNotes(newNotes)
      props.showAlert("Edited the note successfully", "success")
    }
    catch (e) {
      props.showAlert("Not able to edit the note", "danger")
    }

  }


  return (
    <noteContex.Provider value={{ notes, addNote, deleteNote, getNotes, editNote }}>
      {props.children}
    </noteContex.Provider>
  )
}

export default NoteState