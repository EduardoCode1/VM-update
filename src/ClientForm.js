import React, { useState } from 'react';

const ClientForm = () => {
  const [anumber, setAnumber] = useState('');
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/api/clients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ anumber, name, notes }),
    });
    if (response.ok) {
      alert('Client registered successfully!');
      setAnumber('');
      setName('');
      setNotes('');
    } else {
      alert('Failed to register client');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>A#:</label>
        <input type="text" value={anumber} onChange={(e) => setAnumber(e.target.value)} required />
      </div>
      <div>
        <label>Nombre del Cliente:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Notas:</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>
      <button type="submit">Registrar Cliente</button>
    </form>
  );
};

export default ClientForm;
