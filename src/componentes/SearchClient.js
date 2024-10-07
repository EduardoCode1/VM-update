import React, { useState } from 'react';
import axios from 'axios';
import './SearchClient.css';

const SearchClient = () => {
  const [anumber, setAnumber] = useState('');
  const [client, setClient] = useState(null);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [updatedAnumber, setUpdatedAnumber] = useState('');
  const [updatedName, setUpdatedName] = useState('');
  const [newNote, setNewNote] = useState('');

  const handleChange = (e) => {
    const { value } = e.target;
    const formattedAnumber = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3');
    setAnumber(formattedAnumber);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://localhost:5000/api/clients/${anumber}`);
      setClient(response.data);
      setUpdatedAnumber(response.data.anumber);
      setUpdatedName(response.data.name);
      setError('');
      setEditMode(false);
    } catch (err) {
      setError('Client not found');
      setClient(null);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toLocaleDateString('en-US');
    const formattedNote = `(${currentDate}) - ${newNote.trim()}`;  // Aseguramos que sea una cadena limpia

    if (!updatedAnumber || !updatedName) {
      setError('A# and Name are required for update.');
      return;
    }

    const updatedNotes = client.notes ? [...client.notes] : [];
    if (newNote.trim() !== '') {
      updatedNotes.push(String(formattedNote));  // Aseguramos que sea una cadena
    }

    try {
      const response = await axios.put(`http://localhost:5000/api/clients/${client._id}`, {
        anumber: updatedAnumber,
        name: updatedName,
        notes: updatedNotes.map(note => String(note)),  // Aseguramos que todas las notas sean cadenas
      });

      if (response.status === 200) {
        setClient({ ...client, anumber: updatedAnumber, name: updatedName, notes: updatedNotes });
        setError('');
        setEditMode(false);
        setNewNote('');
      } else {
        setError('Failed to update client.');
      }
    } catch (err) {
      console.error('Error updating client:', err.response ? err.response.data : err.message);
      setError('Error updating client: ' + (err.response ? err.response.data : err.message));
    }
  };

  return (
    <div>
      <h2>Search Client</h2>
      <form onSubmit={handleSearch}>
        <div>
          <label>A#:</label>
          <input
            type="text"
            value={anumber}
            onChange={handleChange}
            maxLength={11}
            placeholder="###-###-###"
            required
          />
        </div>
        <button type="submit">Search</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {client && (
        <div className="client-details">
          <h3>Client Details</h3>
          <p><strong>A#:</strong> {client.anumber}</p>
          <p><strong>Name:</strong> {client.name}</p>
          <h4>Notes:</h4>
          <ul>
            {Array.isArray(client.notes) &&
              client.notes.map((note, index) => (
                <li key={index}>
                  <span className="date">{note.substring(0, 12)}</span> 
                  <span className="note">{note.substring(13)}</span>
                </li>
              ))}
          </ul>
          <button onClick={() => setEditMode(true)}>Add New Note</button>

          {editMode && (
            <form onSubmit={handleUpdate}>
              <div>
                <label>New A#:</label>
                <input
                  type="text"
                  value={updatedAnumber}
                  onChange={(e) => setUpdatedAnumber(e.target.value)}
                  maxLength={11}
                  placeholder="###-###-###"
                  required
                />
              </div>
              <div>
                <label>New Name:</label>
                <input
                  type="text"
                  value={updatedName}
                  onChange={(e) => setUpdatedName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label>New Note:</label>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add new note here..."
                  required
                />
              </div>
              <button type="submit">Update Client</button>
              <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchClient;
