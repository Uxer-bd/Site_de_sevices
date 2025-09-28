// backend/routes/profile.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

// Route pour récupérer le profil de l'utilisateur
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userData.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération du profil.' });
  }
});

// Route pour mettre à jour le profil de l'utilisateur
router.put('/', authMiddleware, async (req, res) => {
  try {
    const { numeroTelephone } = req.body;
    const user = await User.findById(req.userData.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé.' });
    }

    user.numeroTelephone = numeroTelephone || user.numeroTelephone;
    await user.save();
    res.status(200).json({ message: 'Profil mis à jour avec succès.', user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil.' });
  }
});

module.exports = router;