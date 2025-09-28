const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000; // Le backend tournera sur le port 5000
const servicesRoutes = require('./routes/service'); // Importation des routes de services

app.use(cors());
app.use(express.json()); // Permet de traiter les données JSON
app.use('/uploads', express.static('public/uploads')); // Servir les fichiers statiques du dossier uploads

// Une route de test pour vérifier que tout fonctionne
app.get('/', (req, res) => {
  res.send('Bienvenue sur le backend de la plateforme !');
});

// Importation des routes
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

// Enregistrement des routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/services', servicesRoutes);
// Connexion à MongoDB
const uri = 'mongodb://localhost:27017/ma_plateforme';
mongoose.connect(uri)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(err => console.error('Erreur de connexion à MongoDB', err));

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});