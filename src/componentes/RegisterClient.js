import React, { useState } from 'react';
import axios from 'axios';
import './RegisterClient.css';

const RegisterClient = () => {
  const [anumber, setAnumber] = useState('');
  const [name, setName] = useState('');
  const [note, setNote] = useState(''); // Campo para una sola nota
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { value } = e.target;
    const formattedAnumber = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1-$2-$3'); // Formatear A#
    setAnumber(formattedAnumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!anumber || !name || !note) {
      setError('All fields are required');
      return;
    }

    // Agregar la fecha actual a la nota
    const currentDate = new Date().toLocaleDateString('en-US');
    const formattedNote = `(${currentDate}) - ${note}`; // Formato de nota con fecha

    const clientData = { 
      anumber, 
      name, 
      notes: formattedNote // Enviar las notas como una cadena de texto
    };

    console.log('Data being sent to server:', clientData); // Mostrar en consola los datos enviados

    try {
      await axios.post('http://localhost:5000/api/clients', clientData);
      setSuccess('Client registered successfully!');
      setError('');
      setAnumber('');
      setName('');
      setNote(''); // Limpiar campo de notas
    } catch (err) {
      console.error('Error registering client:', err.response ? err.response.data : err.message); // Mostrar error detallado
      setError('Error registering client: ' + (err.response ? JSON.stringify(err.response.data) : err.message)); // Mostrar el error detallado
      setSuccess('');
    }
  };

  return (
    <div>
      <h2>Register Client</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>A#:</label>
          <input type="text" value={anumber} onChange={handleChange} maxLength={11} placeholder="###-###-###" required />
        </div>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>Note:</label>
          <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add note here..." required />
        </div>
        <button type="submit">Register</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
    </div>
  );
};

export default RegisterClient;
