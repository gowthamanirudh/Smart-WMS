import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import fs from 'fs';
import pool from './db';

dotenv.config();

// Read Firebase credentials from the file path
const serviceAccountPath = process.env.FIREBASE_CREDENTIALS as string;

if (!serviceAccountPath) {
  throw new Error('FIREBASE_CREDENTIALS environment variable is not set');
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

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

// Add an item to PostgreSQL & Firestore
app.post('/inventory', async (req: Request, res: Response) => {
  const { name, quantity } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO inventory (name, quantity) VALUES ($1, $2) RETURNING *',
      [name, quantity]
    );

    // Add to Firestore for real-time updates
    await db.collection('inventory').doc(result.rows[0].id.toString()).set({
      name,
      quantity,
    });

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update item in PostgreSQL & Firestore
app.put('/inventory/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, quantity } = req.body;
  try {
    const result = await pool.query(
      'UPDATE inventory SET name = $1, quantity = $2 WHERE id = $3 RETURNING *',
      [name, quantity, id]
    );

    if (result.rows.length > 0) {
      // Update Firestore
      await db.collection('inventory').doc(id).update({ name, quantity });
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete item from PostgreSQL & Firestore
app.delete('/inventory/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM inventory WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length > 0) {
      // Delete from Firestore
      await db.collection('inventory').doc(id).delete();
      res.json({ message: 'Item deleted successfully' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
