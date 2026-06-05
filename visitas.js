const express = require('express');
const router = express.Router();
const db = require('./db');
const { verifyToken } = require('./auth');

router.post('/', verifyToken, (req, res) => {

    const {
        nombre_visita,
        identificacion,
        placa,
        torre,
        apartamento,
        residente,
        fecha,
        hora_ingreso,
        observaciones
    } = req.body;

    const sql = `
        INSERT INTO visitas (
            nombre_visita,
            identificacion,
            placa,
            torre,
            apartamento,
            residente,
            fecha,
            hora_ingreso,
            observaciones
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            nombre_visita,
            identificacion,
            placa,
            torre,
            apartamento,
            residente,
            fecha,
            hora_ingreso,
            observaciones
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al registrar visita'
                });
            }

            res.status(201).json({
                ok: true,
                mensaje: 'Visita registrada correctamente',
                id: result.insertId
            });
        }
    );
});

router.get('/', verifyToken, (req, res) => {

    const sql = `
        SELECT
            id,
            nombre_visita,
            identificacion,
            placa,
            torre,
            apartamento,
            residente,

            DATE_FORMAT(
                fecha,
                '%d/%m/%Y'
            ) AS fecha,

            TIME_FORMAT(
                hora_ingreso,
                '%H:%i'
            ) AS hora_ingreso,

            observaciones,

            DATE_FORMAT(
                fecha_registro,
                '%d/%m/%Y %H:%i'
            ) AS fecha_registro

        FROM visitas

        ORDER BY fecha_registro DESC
    `;

    db.query(sql, (err, rows) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al consultar historial de visitas'
            });

        }

        res.status(200).json({
            ok: true,
            total: rows.length,
            data: rows
        });

    });

});

module.exports = router;

