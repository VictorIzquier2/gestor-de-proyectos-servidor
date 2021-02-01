const express = require('express');
const router = express.Router();
const tareaController = require('../controllers/tareaController');
const auth = require('../middleware/auth');
const {check} = require('express-validator');

// crear una tarea
//api/tareas
router.post('/',
  auth,
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('proyecto', 'El proyecto es obligatorio').not().isEmpty()
  ],
  tareaController.crearTarea
);

// Obtener todas las tareas de un proyecto
router.get('/',
  auth,
  [
    check('proyecto', 'El proyecto es obligatorio').not().isEmpty()
  ],
  tareaController.obtenerTareas
);

//Actualizar tarea 
router.put('/:id',

  auth,
  tareaController.actualizarTarea
);

// Actualizar proyecto por ID
router.delete('/:id',
  auth,
  tareaController.eliminarTarea
);

module.exports = router;
