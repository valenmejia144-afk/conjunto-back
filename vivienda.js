const express = require('express');
const db = require('./db');

const router = express.Router();

const { verifyToken } = require("./auth");

router.get('/', verifyToken, (req, res) => {

    const sql = `
        SELECT
            viviendas.id as id,
            numero,
            torre,
            usuario.nombre as residente,
            estado
        FROM viviendas
        inner join usuario on usuario.id = viviendas.residente_id
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

router.get('/:id', verifyToken, (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT *
        FROM viviendas
        WHERE id = ?
    `;

    db.query(sql, [id], (err, rows) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al consultar vivienda'
            });
        }

        res.json({
            ok: true,
            data: rows[0]
        });

    });

});

router.delete('/:id', verifyToken, (req, res) => {

    const { id } = req.params;

    const sql = 'DELETE FROM viviendas WHERE id = ?';

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar vivienda'
            });
        }

        res.json({
            ok: true,
            mensaje: 'Vivienda eliminada correctamente'
        });

    });

});

router.put('/:id', verifyToken, (req, res) => {

    console.log('BODY:', req.body);

    const { id } = req.params;
    const { numero, torre, estado } = req.body;

    const sql = `
        UPDATE viviendas
        SET numero = ?, torre = ?, estado = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [numero, torre, estado, id],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar vivienda'
                });
            }

            res.json({
                ok: true,
                mensaje: 'Vivienda actualizada correctamente'
            });

        }
    );

});

//BOTON ACTUALIZAR
router.get('/:id', verifyToken, (req, res) => {

    const { id } = req.params;

    const sql = `
        SELECT
            viviendas.id,
            viviendas.numero,
            viviendas.torre,
            viviendas.estado
        FROM viviendas
        WHERE viviendas.id = ?
    `;

    db.query(sql, [id], (err, rows) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al consultar vivienda'
            });
        }

        res.json({
            ok: true,
            data: rows[0]
        });
    });

});

module.exports = router;