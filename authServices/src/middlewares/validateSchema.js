export const validateSchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        if (error.errors) {
            // Si es un error de Zod
            return res.status(400).json({
                message: "Error de validación",
                errors: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
        }

        // Para otros tipos de errores
        return res.status(500).json({
            message: "Error interno del servidor",
            error: error.message
        });
    }
};
