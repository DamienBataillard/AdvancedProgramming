const express = require('express');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
const db = require('../config/db');

// Profile route with token-based access
router.get('/profil', authMiddleware, (req, res) => {
    const studentId = req.user.userId; // Extract studentId from token's user data
  
    console.log('Utilisateur autorisé:', req.user); // Log user info for debugging
  
    const query = `
        SELECT 
            id_profile, 
            mail_profile, 
            first_name_profile,
            last_name_profile, 
            date_of_birth_profile, 
            img_profile
        FROM profile
        WHERE id_profile = ?
    `;

    db.query(query, [studentId], (err, results) => {
        if (err) {
            console.error('Erreur lors de la récupération des informations du profil :', err);
            return res.status(500).json({ message: 'Erreur interne du serveur.' });
        }
      
        if (results.length === 0) {
            return res.status(404).json({ message: 'Aucun profil trouvé pour cet utilisateur.' });
        }
      
        // Respond with the profile information
        res.status(200).json({
            message: 'Informations du profil récupérées avec succès.',
            profile: results[0],
        });
    });
});

// Update profile route
router.put('/profil', authMiddleware, (req, res) => {
    const studentId = req.user.userId; // Extract studentId from token's user data
    const { first_name_profile, last_name_profile, mail_profile, date_of_birth_profile } = req.body; // Extract updated fields from request body

    // Validate input
    if (!first_name_profile || !last_name_profile || !mail_profile || !date_of_birth_profile) {
        return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
    }

    const query = `
        UPDATE profile
        SET 
            first_name_profile = ?, 
            last_name_profile = ?, 
            mail_profile = ?,
            date_of_birth_profile = ?
        WHERE id_profile = ?
    `;

    db.query(query, [first_name_profile, last_name_profile, mail_profile, date_of_birth_profile, studentId], (err, result) => {
        if (err) {
            console.error('Erreur lors de la mise à jour des informations du profil :', err);
            return res.status(500).json({ message: 'Erreur interne du serveur.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Profil non trouvé ou aucune modification effectuée.' });
        }

        res.status(200).json({ 
            message: 'Profil mis à jour avec succès.',
            profile: {
                id_profile: studentId,
                first_name_profile,
                last_name_profile,
                mail_profile,
                date_of_birth_profile,
            },
        });
    });
});

module.exports = router;
