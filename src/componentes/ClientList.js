import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ClientList.css';  // Importar archivo de estilos

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const fetchClients = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/clients');
      setClients(response.data);
    } catch (err) {
      setError('Error fetching clients');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleSearchChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');  // Elimina cualquier carácter que no sea número
    if (value.length > 6) {
      value = value.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1-$2-$3');  // Formato ###-###-###
    } else if (value.length > 3) {
      value = value.replace(/(\d{3})(\d{0,3})/, '$1-$2');  // Formato ###-###
    }
    setSearch(value);
  };

  const filteredClients = clients.filter(client => 
    client.anumber.includes(search)
  );

  return (
    <div className="client-list-container">
      <h2>Clients List</h2>
      <input 
        type="text" 
        value={search} 
        onChange={handleSearchChange} 
        placeholder="###-###-###" 
        className="search-input" 
        maxLength={11}  // Limitar a 11 caracteres
      />
      {error && <p className="error-message">{error}</p>}
      <ul className="client-list">
        {filteredClients.map((client) => (
          <li key={client._id} className="client-item">
            {client.anumber}: {client.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientList;
