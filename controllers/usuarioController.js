const Usuario = require('../models/Usuario');
const bcryptjs = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');

exports.crearUsuario = async (req, res) => {

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
  
  // extraer elmail y password
  const {email, password} = req.body;
  
  try {

    // Revisar que el usuario registrado sea único
    let usuario = await Usuario.findOne({email: email});

    if(usuario) {
      return res
        .status(400)
        .send({
          status: 'error',
          mensaje: 'El usuario ya existe'
        })
    }

    //crear el nuevo usuario 
   usuario = new Usuario(req.body);

   // Hashear el password 
   const salt = await bcryptjs.genSalt(10);
   usuario.password = await bcryptjs.hash(password, salt);

    // Guardar usuario
    await usuario.save()

    // Crear y firmar el jwt
    const payload = {
      usuario: {
        id: usuario.id
      }
    };

    jwt.sign(payload, process.env.SECRET, {
      expiresIn: 3600
    }, (error, token) => {
      if(error) throw error;
      
      // Confirmacion
      return res
        .status(200)
        .send({
          status: 'success',
          mensaje: 'Usuario creado correctamente',
          token: token
        })
    })
  }catch(err){
    console.log(err);
    return res
      .status(500)
      .send({
        status: 'error',
        mensaje: 'Hubo un error',
        error: err
      })
  }
}