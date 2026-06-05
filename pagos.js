const express = require('express');
const db = require('./db');
const { verifyToken } = require('./auth');

const router = express.Router();

router.get('/', verifyToken, (req, res) => {

    const sql = `
        SELECT
            v.numero AS apartamento,
            v.torre,
            p.monto AS valor,
            DATE_FORMAT(p.fecha_pago, '%d/%m/%Y') AS fecha_pago,
            p.estado
        FROM pagos p
        INNER JOIN viviendas v
            ON p.vivienda_id = v.id
        ORDER BY p.fecha_pago DESC
    `;

    db.query(sql, (err, rows) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al consultar pagos'
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