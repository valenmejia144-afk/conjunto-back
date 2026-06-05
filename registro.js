const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('./db');

const router = express.Router();

router.post('/registro', async (req, res) => {

    try {

        const {
            nombre,
            identificacion,
            correo,
            torre,
            numero
        } = req.body;

        // Contraseña temporal
        const password = "123456";

        // Verificar correo
        db.query(
            'SELECT id FROM usuario WHERE correo = ?',
            [correo],
            async (err, rows) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al validar correo'
                    });
                }

                if (rows.length > 0) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'El correo ya existe'
                    });
                }

                const passwordHash = await bcrypt.hash(password, 10);

                // Crear usuario
                db.query(
                    `
                    INSERT INTO usuario
                    (nombre, correo, password, rol, identificacion)
                    VALUES (?, ?, ?, 'residente', ?)
                    `,
                    [
                        nombre,
                        correo,
                        password,
                        identificacion
                    ],
                    (err, result) => {

                        if (err) {
                            console.error(err);

                            return res.status(500).json({
                                ok: false,
                                mensaje: 'Error al registrar usuario'
                            });
                        }

                        const usuarioId = result.insertId;

                        // Crear vivienda
                        db.query(
                            `
                            INSERT INTO viviendas
                            (
                                numero,
                                torre,
                                residente_id,
                                estado
                            )
                            VALUES
                            (
                                ?,
                                ?,
                                ?,
                                'Al día'
                            )
                            `,
                            [
                                numero,
                                torre,
                                usuarioId
                            ],
                            (err) => {

                                if (err) {

                                    console.error(err);

                                    return res.status(500).json({
                                        ok: false,
                                        mensaje: 'Error al registrar vivienda'
                                    });

                                }

                                res.status(201).json({
                                    ok: true,
                                    mensaje: 'Residente registrado correctamente'
                                });

                            }
                        );

                    }
                );

            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            ok: false,
            mensaje: 'Error interno'
        });

    }

});

module.exports = router;

