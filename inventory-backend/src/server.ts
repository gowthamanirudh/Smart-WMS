import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// Inventory item interface
interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
}

// In-memory inventory data (mocked for now)
let inventory: InventoryItem[] = [
  { id: 1, name: 'Item A', quantity: 100 },
  { id: 2, name: 'Item B', quantity: 200 },
];

// Get all inventory items
app.get('/inventory', (req: Request, res: Response) => {
  res.json(inventory);
});

// Add a new item to inventory
app.post('/inventory', (req: Request, res: Response) => {
  const { name, quantity } = req.body;
  const newItem: InventoryItem = {
    id: inventory.length + 1,
    name,
    quantity,
  };
  inventory.push(newItem);
  res.status(201).json(newItem);
});

// Update an existing item in inventory
app.put('/inventory/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, quantity } = req.body;
  let item = inventory.find((item) => item.id === parseInt(id));
  if (item) {
    item.name = name;
    item.quantity = quantity;
    res.json(item);
  } else {
    res.status(404).json({ message: 'Item not found' });
  }
});

// Delete an item from inventory
app.delete('/inventory/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  inventory = inventory.filter((item) => item.id !== parseInt(id));
  res.status(200).json({ message: 'Item deleted successfully' });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
