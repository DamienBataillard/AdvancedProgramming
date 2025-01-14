const checkRole = (requiredRole) => {
    return (req, res, next) => {
      try {
        // Vérifiez si l'utilisateur est connecté
        if (!req.user) {
          return res.status(401).json({ message: 'Utilisateur non authentifié.' });
        }
  
        // Vérifiez si l'utilisateur a le rôle requis
        if (req.user.role !== requiredRole) {
          return res.status(403).json({ message: 'Accès interdit : rôle insuffisant.' });
        }
  
        // Si tout est bon, passez à la route suivante
        next();
      } catch (err) {
        console.error('Erreur lors de la vérification du rôle :', err);
        res.status(500).json({ message: 'Erreur interne du serveur.' });
      }
    };
  };
  
  module.exports = checkRole;
  