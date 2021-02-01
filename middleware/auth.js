const jwt = require('jsonwebtoken');

module.exports = function( req, res, next) {
  // Leer el token del header
  const token = req.header('x-auth-token');
  
  // Revisar si no hay token
  if(!token){
    return res
      .status(401)
      .send({
        status: 'error',
        mensaje: 'Error de autentificación. No se ha encontrado ningún usuario'
      })
  }

  // Validar el token
  try{
    const cifrado = jwt.verify(token, process.env.SECRET)
    req.usuario = cifrado.usuario;
    next();

  }catch(error){
    return res
      .status(400)
      .send({
        status: 'error',
        mensaje: 'Error de autentificación del usuario'
      })
  }
}