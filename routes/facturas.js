const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Validación básica
function validarFactura(data) {
  const { fecha, proveedor, categoria, subtotal, itbms } = data;
  if (!fecha || !proveedor || !categoria || subtotal == null || itbms == null) {
    return 'Todos los campos son obligatorios.';
  }
  if (isNaN(subtotal) || subtotal < 0) {
    return 'El subtotal debe ser un número válido y positivo.';
  }
  if (isNaN(itbms) || itbms < 0) {
    return 'ITBMS debe ser un número válido y positivo.';
  }
  return null;
}

// GET todas las facturas
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM facturas ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener facturas:', err);
    res.status(500).json({ error: 'Error al obtener facturas' });
  }
});

// GET una factura por ID
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query('SELECT * FROM facturas WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Factura no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al obtener factura:', err);
    res.status(500).json({ error: 'Error al obtener factura' });
  }
});

// POST crear factura
router.post('/', async (req, res) => {
  const error = validarFactura(req.body);
  if (error) return res.status(400).json({ error });

  const { fecha, proveedor, categoria, subtotal, itbms } = req.body;

  try {
    const result = await db.query(
        `INSERT INTO facturas 
        (fecha, proveedor, categoria, subtotal, itbms)
        VALUES (TO_DATE($1,'DD-MM-YYYY'), $2, $3, $4, $5)
        RETURNING *`,
      [fecha, proveedor, categoria, subtotal, itbms]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error al crear factura:', err);
    res.status(500).json({ error: 'Error al crear factura' });
  }
});

// PUT actualizar factura
router.put('/:id', async (req, res) => {
  const id = req.params.id;
  const error = validarFactura(req.body);
  if (error) return res.status(400).json({ error });

  const { fecha, proveedor, categoria, subtotal, itbms } = req.body;

  try {
    const result = await db.query(
        `UPDATE facturas SET
        fecha = TO DATE ($1, 'DD-MM-YYYY), proveedor = $2, categoria = $3, subtotal = $4, itbms = $5
        WHERE id = $6
        RETURNING *`,
      [fecha, proveedor, categoria, subtotal, itbms, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'Factura no encontrada' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al actualizar factura:', err);
    res.status(500).json({ error: 'Error al actualizar factura' });
  }
});

// DELETE eliminar factura
router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const result = await db.query('DELETE FROM facturas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Factura no encontrada' });
    res.json({ message: 'Factura eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar factura:', err);
    res.status(500).json({ error: 'Error al eliminar factura' });
  }
});

module.exports = router;
