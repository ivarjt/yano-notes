import { useEffect, useState } from "react";

function Notes({ token }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/notes/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch notes.");
        return res.json();
      })
      .then((data) => setNotes(data))
      .catch((err) => setError(err.message));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8000/notes/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newNote }),
      });

      if (!res.ok) throw new Error("Note creation failed");
      const createdNote = await res.json();
      setNotes((prev) => [...prev, createdNote]);
      setNewNote("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Your Notes</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {notes.map((note) => (
          <li key={note.id}>{note.content}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a new note..."
        /><br />
        <button type="submit">Add Note</button>
      </form>
    </div>
  );
}

export default Notes;
