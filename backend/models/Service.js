// backend/models/Service.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ['jardinage', 'maintenance auto', 'froid et climatisation', 'ordinateur', 'autres'] },
  price: { type: Number, required: true },
  location: { type: String, required: true }, // Zone d'intervention
  prestataire: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // L'ID du prestataire qui a créé l'annonce
  imageUrl: { type: String } // URL de l'image du service
});

const Service = mongoose.model('Service', serviceSchema);
module.exports = Service;