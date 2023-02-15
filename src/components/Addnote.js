
import React, { useContext, useState } from 'react'
import noteContex from '../context/notes/noteContext';

export const Addnote = (props) => {
  const context = useContext(noteContex)
  const { addNote } = context;
  const [note, setNote] = useState({ title: "", description: "", tag: "" })
  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value })
  }
  const handleClick = (e) => {
    e.preventDefault()
    addNote(note.title, note.description, note.tag)
    setNote({ title: "", description: "", tag: "" })
    
  }

  return (
    <div className='container my-3'>
      <h2>Add a Note</h2>
      <form className='my-3'>
        <div className="mb-3">
          <label htmlFor="exampleInputEmail1" className="form-label">Title`</label>
          <input type="text" className="form-control" id="exampleInputEmail1" name="title" value={note.title} onChange={onChange} aria-describedby="emailHelp" />

        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">Description</label>
          <input type="text" className="form-control" id="exampleInputPassword1" name="description" value={note.description} onChange={onChange} />
        </div>
        <div className="mb-3">
          <label htmlFor="tag" className="form-label">tag</label>
          <input type="text" className="form-control" id="tag" name="tag" value={note.tag} onChange={onChange} />
        </div>

        <button disabled={note.title.length<5 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>Add a note    </button>
      </form>
    </div>
  )
}
