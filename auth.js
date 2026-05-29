require("dotenv").config();
const express = require("express");
const db = require('./db');
require('dotenv').config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const sql =
      'SELECT * FROM usuario WHERE correo = ?';

    db.query(sql, [email], async (err, result) => {

      if (err) {

        return res.status(500).json(err);

      }

      // Verificar usuario
      if (result.length === 0) {

        return res.status(404).json({
          mensaje: 'Usuario no encontrado'
        });

      }

      // Usuario encontrado
      const user = result[0];

      /* Comparar password
      const validPassword = await bcrypt.compare(
        password,
        user.password
      );*/

      if (user.password !== password) {

        return res.status(400).json({
          message: "Contraseña incorrecta"
        });

      }

      // Generar token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.correo,
          rol: user.rol
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h"
        }
      );

      // Respuesta
      res.json({
        token,
        profile: user.rol
      });

    });

  } catch (error) {

    res.status(500).json({
      message: "Error del servidor"
    });

  }

});
  

const verifyToken = (req, res, next) => {

  const bearerHeader = req.headers["authorization"];

  // Verificar si existe
  if (!bearerHeader) {

    return res.status(401).json({
      message: "Token requerido"
    });

  }

  // Obtener token
  const token = bearerHeader.split(" ")[1];

  try {

    // Verificar token
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Guardar datos del usuario
    req.user = verified;

    // Continuar
    next();

  } catch (error) {

    res.status(401).json({
      message: "Token inválido"
    });

  }

}

module.exports = {
  router,
  verifyToken
}