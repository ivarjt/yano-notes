import { useEffect, useState } from "react";
import "./notes.css";
import { useNavigate } from "react-router-dom";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newNote, setNewNote] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch notes
  useEffect(() => {
    fetch("http://localhost:8000/notes/", {
      credentials: "include", // send cookie!
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch notes.");
        return res.json();
      })
      .then((data) => {
        const sorted = data.sort((a, b) => {
          if (a.pinned && b.pinned) {
            return new Date(a.pinned_at) - new Date(b.pinned_at);
          }
          return b.pinned - a.pinned;
        });
        setNotes(sorted);
      })
      .catch((err) => setError(err.message));
  }, []);

  // Create note
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/notes/", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle, content: newNote }),
      });
      if (!res.ok) throw new Error("Note creation failed");
      const created = await res.json();
      setNotes((prev) => [...prev, created]);
      setNewTitle("");
      setNewNote("");
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete note
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/notes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  // Pin/unpin note
  const togglePin = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/notes/${id}/pin`, {
        method: "PATCH",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Pin toggle failed");
      const updated = await res.json();
      setNotes((prev) => {
        const updatedList = prev.map((n) => (n.id === id ? updated : n));
        return updatedList.sort((a, b) => {
          if (a.pinned && b.pinned) {
            return new Date(a.pinned_at) - new Date(b.pinned_at);
          }
          return b.pinned - a.pinned;
        });
      });
    } catch (err) {
      setError(err.message);
    }
  };

  // 🚪 Logout
  const handleLogout = async () => {
    try {
      const res = await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        navigate("/login"); // redirect to login page
      } else {
        throw new Error("Logout failed");
      }
    } catch (err) {
      setError("Logout error: " + err.message);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Your Notes</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* New Note Form */}
      <form onSubmit={handleSubmit} className="notes-form">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Note title"
          required
        /><br />
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a new note..."
          rows={4}
          cols={40}
          maxLength={1000}
          required
        /><br />
        <button type="submit">Add Note</button>
      </form>

      {/* Notes Grid */}
      <div className="notes-container">
        {notes.map((note) => (
          <div key={note.id} className="note-card">
            {note.pinned && <div className="pinned-badge">PINNED</div>}
            <div className="note-title">{note.title}</div>
            <div className="note-content">{note.content}</div>
            <div className="note-actions">
              <button
                className="pin-btn"
                onClick={() => togglePin(note.id)}
                title={note.pinned ? "Unpin note" : "Pin note"}
              >
                📌
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(note.id)}
                title="Delete note"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;
