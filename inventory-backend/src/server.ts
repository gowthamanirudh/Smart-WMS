import express, { Request, Response } from 'express';
import cors from 'cors';
import pool from './db';

const app = express();
app.use(express.json());
app.use(cors());

// Get all inventory items from PostgreSQL
app.get('/inventory', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM inventory');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new item to inventory
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

// Update an existing item
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

// Delete an item
app.delete('/inventory/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM inventory WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length > 0) {
      res.json({ message: 'Item deleted successfully' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
