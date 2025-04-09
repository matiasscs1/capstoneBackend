// src/index.js

import app from './app.js';

/* ---------------- INICIAR ---------------- */

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API Gateway corriendo en http://localhost:${PORT}`);
});
