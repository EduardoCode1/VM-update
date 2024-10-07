const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Definir el esquema y modelo de Client
const clientSchema = new mongoose.Schema({
  anumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  notes: { type: [String], default: [] }, // Cambiado a un array de Strings
});

const Client = mongoose.model('Client', clientSchema);

// Rutas
app.post('/api/clients', async (req, res) => {
  const { anumber, name, notes } = req.body;
  try {
    const newClient = new Client({ anumber, name, notes });
    await newClient.save();
    res.status(201).send(newClient);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/api/clients', async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).send(clients);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Buscar cliente por A#
app.get('/api/clients/:anumber', async (req, res) => {
  try {
    const client = await Client.findOne({ anumber: req.params.anumber });
    if (!client) return res.status(404).send('Client not found');
    res.send(client);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// Actualizar cliente por ID
app.put('/api/clients/:id', async (req, res) => {
  const { id } = req.params;
  const { anumber, name, notes } = req.body;

  if (!anumber || !name) {
    return res.status(400).send('A# and Name are required for update.');
  }

  // Asegurarse de que las notas sean un array de cadenas
  const formattedNotes = notes ? notes.map(note => String(note)) : [];

  try {
    const updatedClient = await Client.findByIdAndUpdate(id, { anumber, name, notes: formattedNotes }, { new: true });
    if (!updatedClient) {
      return res.status(404).send('Client not found');
    }
    res.json(updatedClient);
  } catch (err) {
    console.error('Error updating client:', err);  // Agregar console.error para ver detalles en la consola
    res.status(500).send('Error updating client: ' + err.message);
  }
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
