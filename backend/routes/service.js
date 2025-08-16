// backend/routes/services.js
const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const authMiddleware = require('../middleware/authMiddleware');

// Route pour créer une annonce (accessible uniquement aux prestataires connectés)
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.userData.role !== 'prestataire') {
      return res.status(403).json({ message: 'Accès refusé. Seuls les prestataires peuvent créer des annonces.' });
    }
    const { title, description, category, price, location } = req.body;
    const newService = new Service({
      title,
      description,
      category,
      price,
      location,
      prestataire: req.userData.id
    });
    await newService.save();
    res.status(201).json({ message: 'Annonce créée avec succès !', service: newService });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'annonce.' });
  }
});

// Route pour modifier une annonce (accessible uniquement par son créateur)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Annonce non trouvée.' });
    }
    if (service.prestataire.toString() !== req.userData.id) {
      return res.status(403).json({ message: 'Accès refusé. Vous ne pouvez modifier que vos propres annonces.' });
    }

    const { title, description, category, price, location } = req.body;
    service.title = title || service.title;
    service.description = description || service.description;
    service.category = category || service.category;
    service.price = price || service.price;
    service.location = location || service.location;
    await service.save();
    res.status(200).json({ message: 'Annonce modifiée avec succès !', service });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la modification de l\'annonce.' });
  }
});

// Route pour supprimer une annonce (accessible uniquement par son créateur)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Annonce non trouvée.' });
    }
    if (service.prestataire.toString() !== req.userData.id) {
      return res.status(403).json({ message: 'Accès refusé. Vous ne pouvez supprimer que vos propres annonces.' });
    }

    await Service.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Annonce supprimée avec succès !' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'annonce.' });
  }
});

// Route pour récupérer toutes les annonces (accessible à tous)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().populate('prestataire', 'email'); // Populate pour avoir l'email du prestataire
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des annonces.' });
  }
});

module.exports = router;