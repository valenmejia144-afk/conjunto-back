const express = require('express');
const db = require('./db');

const router = express.Router();

const { verifyToken } = require('./auth');

router.get('/', verifyToken, (req, res) => {

    const sql = `
        SELECT
            p.numero AS parqueadero,
            v.torre,
            v.numero AS apartamento,
            u.nombre AS residente,

            CASE
                WHEN p.disponible = 1 THEN 'Libre'
                ELSE 'Ocupado'
            END AS estado

        FROM parqueaderos p

        LEFT JOIN viviendas v
            ON p.vivienda_id = v.id

        LEFT JOIN usuario u
            ON v.residente_id = u.id

        ORDER BY p.numero
    `;

    db.query(sql, (err, rows) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al consultar parqueaderos'
            });
        }

        res.json({
            ok: true,
            total: rows.length,
            data: rows
        });

    });

});

module.exports = router;