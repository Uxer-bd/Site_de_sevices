const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Route d'inscription
router.post('/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const newUser = new User({ email, password, role });
    await newUser.save();
    res.status(201).send('Utilisateur créé avec succès !');
  } catch (error) {
    res.status(500).send('Erreur lors de l\'inscription.');
  }
});

// Route de connexion
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Email ou mot de passe incorrect.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Email ou mot de passe incorrect.');
    }

    // Création du JWT
    const token = jwt.sign({ id: user._id, role: user.role }, 'Uxerbdf30K', { expiresIn: '1h' });
    res.status(200).json({ token, role: user.role });
  } catch (error) {
    res.status(500).send('Erreur lors de la connexion.');
  }
});

module.exports = router;