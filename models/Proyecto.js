const mongoose = require('mongoose');

const ProyectoSchema = mongoose.Schema({
  nombre: {type: String, required: true, trim: true},
  creador: {type: mongoose.Schema.Types.ObjectId, ref: 'Usuario'},
  creado: {type: Date, default: Date.now()},
});

const Proyecto = mongoose.model('Proyecto', ProyectoSchema);

module.exports = Proyecto;