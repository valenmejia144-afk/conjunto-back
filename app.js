const express = require('express');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

app.get('/usuario', (req, res) => {

  const sql = 'SELECT * FROM usuario';

  db.query(sql, (err, results) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json(results);
  });

});

app.get('/usuario/:id', (req, res) => {

  const id = req.params.id;

  const sql = 'SELECT * FROM usuario WHERE id = ?';

  db.query(sql, [id], (err, results) => {

    if (err) {
      return res.status(500).json(err);
    }

    if (results.length === 0) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado'
      });
    }

    // Retornar usuario
    res.json(results[0]);

  });

});

// Crear usuario

app.post('/usuario', (req, res) => {

  const { nombre, correo, password, rol} = req.body;

  const sql = `
    INSERT INTO usuario(nombre, correo, password, rol)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [nombre, correo, password, rol], (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      mensaje: 'Usuario creado',
      id: result.insertId
    });

  });

});

//Actualizar

app.put('/usuario/:id', (req, res) => {

  const id = req.params.id;

  const { nombre, correo } = req.body;

  const sql = `
    UPDATE usuario
    SET nombre = ?, correo = ?
    WHERE id = ?
  `;

  db.query(sql, [nombre, correo, id], (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado'
      });
    }

    res.json({
      mensaje: 'Usuario actualizado'
    });

  });

});

// Eleminar 

app.delete('/usuario/:id', (req, res) => {

  const id = req.params.id;

  const sql = 'DELETE FROM usuario WHERE id = ?';

  db.query(sql, [id], (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        mensaje: 'Usuario no encontrado'
      });
    }

    res.json({
      mensaje: 'Usuario eliminado correctamente'
    });

  });

});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});