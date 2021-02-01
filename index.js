const express = require('express');
const conectarDB = require('./config/db');
const cors = require('cors');

// crear el servidor
const app = express();

// conectar a la base de datos
conectarDB();

// habilitar cors
app.use(cors({
  credentials: true,
  origin:["http://localhost:3000", "https://gestor-de-proyectos-cliente.netlify.app"]
}));

// habilitar express.json
app.use(express.json({
  extended: true
}));

// Puerto de la app
const PORT = process.env.PORT || 3900;

// Importar rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proyectos', require('./routes/proyectos'));
app.use('/api/tareas', require('./routes/tareas'));

//Ejecutar la app
app.listen(PORT, () => {
  console.log(`El servidor está funcionando en el puerto ${PORT}`);
})