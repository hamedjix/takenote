import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { addNote, swapNote, deleteNote, syncState } from 'actions'
import uuid from 'uuid/v4'
import { NoteItem } from 'types'
import { getNoteTitle, downloadNote } from 'helpers'
// import { useInterval } from 'helpers/hooks'
import { useKey } from 'helpers/hooks'

interface NavigationProps {
  addNote: Function
  swapNote: Function
  deleteNote: Function
  syncState: Function
  activeNote: NoteItem
  notes: NoteItem[]
  syncing: boolean
}

const Navigation: React.FC<NavigationProps> = ({
  activeNote,
  addNote,
  swapNote,
  deleteNote,
  syncState,
  notes,
  syncing,
}) => {
  // useInterval(() => {
  //   syncState(notes)
  // }, 30000)

  const newNoteHandler = () => {
    const note = { id: uuid(), text: '', created: '', lastUpdated: '' }

    if ((activeNote && activeNote.text !== '') || !activeNote) {
      addNote(note)
      swapNote(note.id)
    }
  }

  const deleteNoteHandler = () => {
    if (activeNote) {
      deleteNote(activeNote.id)
    }
  }

  const syncNotesHandler = () => {
    syncState(notes)
  }

  const downloadNoteHandler = () => {
    if (activeNote) {
      downloadNote(getNoteTitle(activeNote.text), activeNote.text)
    }
  }

  useKey('ctrl+n', () => {
    newNoteHandler()
  })

  useKey('ctrl+backspace', () => {
    deleteNoteHandler()
  })

  useKey('ctrl+s', () => {
    syncNotesHandler()
  })

  // useKey('ctrl+up', () => {
  //   swapNote()
  // })

  return (
    <nav className="navigation">
      <button className="nav-button" onClick={newNoteHandler}>
        + New Note
      </button>
      <button className="nav-button" onClick={deleteNoteHandler}>
        X Delete Note
      </button>
      <button className="nav-button" onClick={downloadNoteHandler}>
        ^ Download Note
      </button>
      <button className="nav-button" onClick={syncNotesHandler}>
        Sync notes
        {syncing && 'Syncing...'}
      </button>
    </nav>
  )
}

const mapStateToProps = state => ({
  syncing: state.noteState.syncing,
  notes: state.noteState.notes,
  activeNote: state.noteState.notes.find(note => note.id === state.noteState.active),
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  addNote: note => dispatch(addNote(note)),
  swapNote: noteId => dispatch(swapNote(noteId)),
  deleteNote: noteId => dispatch(deleteNote(noteId)),
  syncState: notes => dispatch(syncState(notes)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation)