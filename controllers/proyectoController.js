const Proyecto = require('../models/Proyecto');
const {validationResult} = require('express-validator');

exports.crearProyecto = async (req, res) => {

  const errores = validationResult(req);
  if(!errores.isEmpty()){
    return res
      .status(400)
      .send({
        status: 'error',
        mensaje: 'Error al validar el proyecto',
        errores: errores.array()
      })
  }

  try{
    // Crear un nuevo proyecto 
    const proyecto = new Proyecto(req.body);
    
    // Guardar el creador via JWS 
    proyecto.creador = req.usuario.id

    // Guardar el proyecto
    proyecto.save();
    return res
      .status(200)
      .send({
        status: 'success',
        mensaje: 'Proyecto creado correctamente',
        proyecto: proyecto        
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

// obtener todos los proyectos del usuario logeado

exports.obtenerProyectos = async (req, res)=>{
  try{
    const proyectos = await Proyecto.find({creador: req.usuario.id}).sort({creado: -1});
    return res
      .status(200)
      .send({
        status: 'success',
        mensaje: 'La consulta se ha realizado correctamente',
        proyectos: proyectos        
      });
  }catch(err){
    return res
      .status(500)
      .send({
        status: 'error',
        mensaje: 'Error al conectar con la base de datos',
        err
      })
  }
}

// Actualiza un proyecto

exports.actualizarProyecto = async (req, res)=> {

  // Revisar si hay errores
  const errores = validationResult(req);
  if(!errores.isEmpty()){
    return res
      .status(400)
      .send({
        status: 'error',
        mensaje: 'Error al validar el proyecto',
        errores: errores.array()
      })
  }

  // Extrae la informacion del proyecto
  const {nombre} = req.body;
  const nuevoProyecto = {};

  if(nombre){
    nuevoProyecto.nombre = nombre;
  }

  try {
    // revisar el ID
    let proyecto = await Proyecto.findById(req.params.id);
    
    // si el proyecto existe o no
    if(!proyecto){
      return res
      .status(404)
      .send({
        status: 'error',
        mensaje: 'Proyecto no encontrado'
      })
    }
    console.log(proyecto.creador.toString());
    console.log(req.usuario.id);
    // verificar el creador del proyecto

    if(proyecto.creador.toString() !== req.usuario.id){
       return res
        .status(401)
        .send({
          status: 'error',
          mensaje: 'No autorizado'
        })
    }
    // actualizar
    proyecto = await Proyecto.findByIdAndUpdate({_id: req.params.id}, {$set: nuevoProyecto}, {new: true});
     return res
        .status(200)
        .send({
          status: 'success',
          mensaje: 'El proyecto se ha actualizado correctamente',
          nuevoProyecto
        })

  }catch(err){
    return res
      .status(500)
      .send({
        status: 'error',
        mensaje: 'Error en el servidor',
        err
      })
  }
}

// Elimina un proyecto por su ID
exports.eliminarProyecto = async (req, res) => {
  try {
    // revisar el ID
    let proyecto = await Proyecto.findById(req.params.id);
    
    // si el proyecto existe o no
    if(!proyecto){
      return res
      .status(404)
      .send({
        status: 'error',
        mensaje: 'Proyecto no encontrado'
      })
    }

    // verificar el creador del proyecto
    if(proyecto.creador.toString() !== req.usuario.id){
       return res
        .status(401)
        .send({
          status: 'error',
          mensaje: 'No autorizado'
        })
    }

    // Eliminar el proyecto
    await Proyecto.findOneAndRemove({_id:req.params.id});
    return res
        .status(200)
        .send({
          status: 'success',
          mensaje: 'El Proyecto se ha eliminado correctamente',
          proyecto: proyecto
        })

  }catch(err){
    return res
      .status(500)
      .send({
        status: 'error',
        mensaje: 'Error en el servidor',
        err
      })
  }
}