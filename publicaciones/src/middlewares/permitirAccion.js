// publicaciones/middlewares/permitirAccion.js
export const permitirAccion = (rolesPermitidos) => {
    return (req, res, next) => {
      const rol = req.user?.rol;
  
      if (!rol || !rolesPermitidos.includes(rol)) {
        return res.status(403).json({ message: 'No tienes permiso para esta acción.' });
      }
  
      next();
    };
  };
  