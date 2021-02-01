//rutas para autentificar usuarios
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

//Iniciar sesión

//api/auth
router.post('/',
  authController.autentificarUsuario
);

// Obtiene el usuario autentificado
router.get('/',
  auth,
  authController.usuarioAutentificado
);
module.exports = router;