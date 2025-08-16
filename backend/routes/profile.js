// backend/routes/profile.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware'); // Importe le middleware
const User = require('../models/User');

// Route sécurisée pour récupérer le profil de l'utilisateur
router.get('/', authMiddleware, async (req, res) => {
  try {
    // req.userData est ajouté par le middleware
    const user = await User.findById(req.userData.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du profil.' });
  }
});

module.exports = router;