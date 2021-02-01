const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.autentificarUsuario = async (req, res) => {
  // Revisar si hay errores
  const errores = validationResult(req);
  if(!errores.isEmpty()){
    return res
      .status(400)
      .send({
        status: 'error',
        mensaje: 'Error al validar los campos',
        errores: errores.array()
      })
  } 

  // extraer el email y el password
  const {email, password} = req.body;

  try{
    // Revisar que sea un usuario registrado
    const usuario = await Usuario.findOne({email});
    if(!usuario){
      return res
      .status(400)
      .send({
        status: 'error',
        mensaje: 'El usuario no existe'
      })
    }

    // Revisar el password
    const passCorrecto = await bcryptjs.compare(password, usuario.password)
    if(!passCorrecto){
      return res
      .status(400)
      .send({
        status: 'error',
        mensaje: 'La contraseña es incorrecta'
      })
    }

    // Si todo es correcto
    // crear y firmar el jwt
    const payload = {
      usuario: {
        id: usuario.id
      }
    }

    jwt.sign(payload, process.env.SECRET, {
      expiresIn: 3600 // 1 hora
    }, (error, token) => {
      if(error) throw error;
      // Confirmacion
      return res
        .status(200)
        .send({
          status: 'success',
          mensaje: 'Usuario logeado correctamente',
          token: token
        })
    })


  }catch(err){
    console.log(err)
    return res
      .status(500)
      .send({
        status: 'error',
        mensaje: 'Hubo un error',
        err
      })
  }
}

// Obtiene que usuario está autentificado
exports.usuarioAutentificado = async (req, res) => {
  try{
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    return res
      .status(200)
      .send({
        status: 'success',
        mensaje: 'El usuario se ha autentificado con éxito',
        usuario: usuario
      })
  }catch(err){
    console.log(err);
    return res
      .status(500)
      .send({
        status: 'error',
        mensaje: 'Hubo un error',
        err
      })
  }
}