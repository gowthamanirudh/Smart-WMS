import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './db';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Get all inventory items from PostgreSQL
app.get('/inventory', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM inventory ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add an item to PostgreSQL
app.post('/inventory', async (req: Request, res: Response) => {
  const { name, quantity } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO inventory (name, quantity) VALUES ($1, $2) RETURNING *',
      [name, quantity]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update item in PostgreSQL
app.put('/inventory/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, quantity } = req.body;
  try {
    const result = await pool.query(
      'UPDATE inventory SET name = $1, quantity = $2 WHERE id = $3 RETURNING *',
      [name, quantity, id]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Optimized Delete item from PostgreSQL with ID Reordering
app.delete('/inventory/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    // Start transaction
    await pool.query('BEGIN');

    // Delete the requested item
    const result = await pool.query('DELETE FROM inventory WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length > 0) {
      // Get the maximum ID before reordering
      const maxIdResult = await pool.query('SELECT MAX(id) FROM inventory');
      const maxId = maxIdResult.rows[0].max;

      // Only reorder if the deleted ID was not the last ID
      if (id < maxId) {
        await pool.query(`
          WITH reordered AS (
            SELECT id, ROW_NUMBER() OVER () AS new_id FROM inventory ORDER BY id
          )
          UPDATE inventory
          SET id = reordered.new_id
          FROM reordered
          WHERE inventory.id = reordered.id;
        `);

        // Reset sequence
        await pool.query(`
          SELECT setval('inventory_id_seq', COALESCE((SELECT MAX(id) FROM inventory), 0), false);
        `);
      }

      // Commit transaction
      await pool.query('COMMIT');

      res.json({ message: 'Item deleted and IDs reordered successfully' });
    } else {
      await pool.query('ROLLBACK'); // Rollback if no item found
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (err) {
    await pool.query('ROLLBACK'); // Ensure rollback on error
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
