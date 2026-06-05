const express = require('express');
const db = require('./db');

const router = express.Router();

const { verifyToken } = require("./auth");

router.get('/', verifyToken, (req, res) => {

    const sql = `
        SELECT
            id,
            numero,
            torre,
            residente_id,
            estado
        FROM viviendas
    `;

    db.query(sql, (err, rows) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al consultar viviendas'
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