// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Récupère le token du header
    const decodedToken = jwt.verify(token, 'Uxerbdf30K'); // Vérifie le token
    console.log('Token décodé avec succès !', decodedToken);
    req.userData = { id: decodedToken.id, role: decodedToken.role }; // Ajoute les données à la requête
    next();
  } catch (error) {
    console.error("Échec de l'authentification :", error);
    res.status(401).json({ message: 'Authentification échouée !' });
  }
};