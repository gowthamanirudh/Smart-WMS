import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { InventoryItem, NewItem } from './types';

const Inventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState<NewItem>({ name: '', quantity: 0 });
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);

  // Fetch inventory data from the backend
  useEffect(() => {
    axios
      .get<InventoryItem[]>('http://localhost:5000/inventory')
      .then((response) => {
        setInventory(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching inventory:', error);
      });
  }, []);

  // Add new item to inventory
  const handleAddItem = () => {
    axios
      .post<InventoryItem>('http://localhost:5000/inventory', newItem)
      .then((response) => {
        setInventory([...inventory, response.data]);
        setNewItem({ name: '', quantity: 0 });
      })
      .catch((error) => {
        console.error('There was an error adding the item:', error);
      });
  };

  // Update item in inventory
  const handleUpdateItem = () => {
    if (editItem) {
      axios
        .put<InventoryItem>(`http://localhost:5000/inventory/${editItem.id}`, editItem)
        .then((response) => {
          const updatedInventory = inventory.map((item) =>
            item.id === editItem.id ? response.data : item
          );
          setInventory(updatedInventory);
          setEditItem(null);
        })
        .catch((error) => {
          console.error('There was an error updating the item:', error);
        });
    }
  };

  // Delete item from inventory
  const handleDeleteItem = (id: number) => {
    axios
      .delete(`http://localhost:5000/inventory/${id}`)
      .then(() => {
        setInventory(inventory.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.error('There was an error deleting the item:', error);
      });
  };

  return (
    <div className="container mx-auto p-5">
      <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>

      {/* Add New Item */}
      <div className="mb-5">
        <h3 className="font-semibold text-lg mb-2">Add New Item</h3>
        <input
          type="text"
          placeholder="Item Name"
          className="p-2 border border-gray-300 rounded mr-2"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          className="p-2 border border-gray-300 rounded mr-2"
          value={newItem.quantity}
          onChange={(e) => setNewItem({ ...newItem, quantity: +e.target.value })}
        />
        <button
          onClick={handleAddItem}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Item
        </button>
      </div>

      {/* Edit Item */}
      {editItem && (
        <div className="mb-5">
          <h3 className="font-semibold text-lg mb-2">Edit Item</h3>
          <input
            type="text"
            className="p-2 border border-gray-300 rounded mr-2"
            value={editItem.name}
            onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
          />
          <input
            type="number"
            className="p-2 border border-gray-300 rounded mr-2"
            value={editItem.quantity}
            onChange={(e) => setEditItem({ ...editItem, quantity: +e.target.value })}
          />
          <button
            onClick={handleUpdateItem}
            className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            Update Item
          </button>
        </div>
      )}

      {/* Inventory Table */}
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Item Name</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item) => (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.id}</td>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.quantity}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-yellow-500 text-white p-2 rounded mr-2 hover:bg-yellow-600"
                  onClick={() => setEditItem(item)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventory;
