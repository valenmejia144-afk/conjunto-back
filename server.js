// server.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { router: authRoutes, verifyToken } = require("./auth");
const usuarioRoutes = require("./usuario");

const app = express();

app.use(cors());
app.use(express.json());

// RUTAS AUTH
app.use("/auth", authRoutes);
app.use("/usuario", usuarioRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en http://localhost:3000`);
});