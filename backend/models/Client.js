const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  anumber: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  notes: {
    type: [String], // Esto asegura que el campo notes sea un array de cadenas
    default: [],
  },
});

module.exports = mongoose.model('Client', clientSchema);
