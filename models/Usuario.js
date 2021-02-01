const mongoose = require('mongoose');

const UsuarioSchema = mongoose.Schema({
  usuario: {type: String, required: true, trim: true},
  email:{type: String, required: true, trim: true, unique: true},
  password: {type: String, required: true, trim: true},
  registro: {type: Date, default: Date.now()}
});

// Asociar el esquema al model para la coleccion
const Usuario = mongoose.model('Usuario', UsuarioSchema);

// Exportar el módulo
module.exports = Usuario;
