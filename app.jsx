const { useEffect, useMemo, useState } = React;

const STORAGE_KEY = 'woodenNoteSaver';

const starterNotes = [
  {
    id: 1,
    title: 'Good ideas',
    content: 'Write your next idea here.\n\n- improve product flow\n- improve customer onboarding\n- create a strong launch plan',
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Work rhythm',
    content: 'Morning:\n- plan tasks\n- review priorities\n\nEvening:\n- write summary\n- prepare tomorrow',
    updatedAt: new Date().toISOString()
  }
];

function loadNotes() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return starterNotes;

    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) && parsed.length ? parsed : starterNotes;
  } catch (error) {
    return starterNotes;
  }
}

function App() {
  const [notes, setNotes] = useState(loadNotes);
  const [selectedId, setSelectedId] = useState(() => starterNotes[0].id);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedId) || notes[0],
    [notes, selectedId]
  );

  useEffect(() => {
    if (!selectedNote && notes.length) {
      setSelectedId(notes[0].id);
    }
  }, [notes, selectedNote]);

  const updateSelectedNote = (field, value) => {
    if (!selectedNote) return;

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === selectedNote.id
          ? { ...note, [field]: value, updatedAt: new Date().toISOString() }
          : note
      )
    );
  };

  const createNote = () => {
    const newNote = {
      id: Date.now(),
      title: 'Untitled note',
      content: 'Start writing...',
      updatedAt: new Date().toISOString()
    };

    setNotes((currentNotes) => [newNote, ...currentNotes]);
    setSelectedId(newNote.id);
  };

  const deleteNote = () => {
    if (!selectedNote) return;

    const remaining = notes.filter((note) => note.id !== selectedNote.id);
    setNotes(remaining);

    if (remaining.length) {
      setSelectedId(remaining[0].id);
    }
  };

  return (
    <div className="note-app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div>
            <p className="eyebrow">Studio</p>
            <h1>Wooden Notes</h1>
          </div>
          <button className="add-button" onClick={createNote}>+ New</button>
        </div>

        <div className="note-list">
          {notes.map((note) => (
            <button
              key={note.id}
              className={`note-item ${selectedNote && note.id === selectedNote.id ? 'active' : ''}`}
              onClick={() => setSelectedId(note.id)}
            >
              <span className="note-title">{note.title || 'Untitled note'}</span>
              <span className="note-time">
                {new Date(note.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </span>
            </button>
          ))}
        </div>
      </aside>

      <main className="editor-panel">
        {selectedNote ? (
          <>
            <div className="editor-toolbar">
              <input
                className="title-input"
                value={selectedNote.title}
                onChange={(event) => updateSelectedNote('title', event.target.value)}
                placeholder="Note title"
              />
              <button className="delete-button" onClick={deleteNote}>Delete</button>
            </div>

            <textarea
              className="editor"
              value={selectedNote.content}
              onChange={(event) => updateSelectedNote('content', event.target.value)}
              placeholder="Write your note here..."
            />

            <div className="status-row">
              <span>Saved automatically</span>
              <span>{new Date(selectedNote.updatedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <h2>No notes yet</h2>
            <p>Create your first note and start writing.</p>
          </div>
        )}
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
