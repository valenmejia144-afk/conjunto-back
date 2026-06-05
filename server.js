// server.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { router: authRoutes, verifyToken } = require("./auth");
const usuarioRoutes = require("./usuario");

//admin
const viviendasRoutes = require("./vivienda");
const parqueaderosRoutes = require("./parqueaderos");
const pagosRoutes = require("./pagos");
const registroRoutes = require('./registro');

//residente
const residenteRoutes = require('./residente');

//seguridad
const visitasRouter = require('./visitas');


const app = express();

app.use(cors());
app.use(express.json());

// RUTAS AUTH
app.use("/auth", authRoutes);
app.use("/usuario", usuarioRoutes);

//RUTAS DE ADMINISTRACION
app.use("/vivienda", viviendasRoutes);
app.use('/parqueaderos', parqueaderosRoutes);
app.use('/pagos', pagosRoutes);
app.use('/api', registroRoutes);

//RUTA DE RESIDENTE
app.use('/residente', residenteRoutes);

// RUTA DE SEGURIDAD(GUARDIA)
app.use('/api/visitas', visitasRouter);
app.use('/visitas', visitasRouter);


app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:3000`);
});