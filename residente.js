const express = require('express');
const router = express.Router();

const db = require('./db');
const { verifyToken } = require('./auth');

router.get('/', verifyToken, (req, res) => {

    const usuarioId = req.user.id;

    const sql = `
        SELECT
            u.nombre,
            u.identificacion,

            v.numero AS apartamento,
            v.torre,
            v.estado,

            p.numero AS parqueadero,

            DATE_FORMAT(
                MAX(pg.fecha_pago),
                '%d/%m/%Y'
            ) AS ultimo_pago,
            
            DATE_FORMAT(
            DATE_ADD(MAX(pg.fecha_pago), INTERVAL 1 MONTH),
            '%d/%m/%Y'
            ) AS proximo_pago,

            IFNULL(
                SUM(
                    CASE
                        WHEN pg.estado = 'Pendiente'
                        THEN pg.monto
                        ELSE 0
                    END
                ),
                0
            ) AS saldo_pendiente

        FROM usuario u

        LEFT JOIN viviendas v
            ON u.id = v.residente_id

        LEFT JOIN parqueaderos p
            ON v.id = p.vivienda_id

        LEFT JOIN pagos pg
            ON v.id = pg.vivienda_id

        WHERE u.id = ?

        GROUP BY
            u.id,
            u.nombre,
            u.identificacion,
            v.numero,
            v.torre,
            v.estado,
            p.numero
    `;

    db.query(sql, [usuarioId], (err, rows) => {

        if (err) {

            console.error(err);

            return res.status(500).json({
                ok: false,
                mensaje: 'Error al consultar residente'
            });

        }

        if (rows.length === 0) {

            return res.status(404).json({
                ok: false,
                mensaje: 'Residente no encontrado'
            });

        }

        res.json({
            ok: true,
            data: rows[0]
        });

    });

});

module.exports = router;