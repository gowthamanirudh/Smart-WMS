import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { InventoryItem, NewItem } from './types';
import { db } from './firebase';
import { addDoc, collection, deleteDoc, getDocs, onSnapshot } from 'firebase/firestore';

const Inventory: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [newItem, setNewItem] = useState<NewItem>({ name: '', quantity: 0 });
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Fetch from PostgreSQL (initial load)
    axios.get<InventoryItem[]>('http://localhost:5000/inventory')
      .then(response => setInventory(response.data))
      .catch(error => console.error("Error fetching inventory:", error));
  
    // Listen to real-time Firebase updates
    const unsubscribe = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const firebaseItems = snapshot.docs.map(doc => ({
        id: doc.data().id, 
        name: doc.data().name,
        quantity: doc.data().quantity
      }));
      setInventory(firebaseItems);
    });
  
    return () => unsubscribe(); // Cleanup listener
  }, []);
  

  const handleAddItem = async () => {
    try {
      // Add to PostgreSQL
      const response = await axios.post<InventoryItem>('http://localhost:5000/inventory', newItem);
      const savedItem = response.data;
      
      // Add to Firebase Firestore
      await addDoc(collection(db, "inventory"), {
        id: savedItem.id, // Ensure it matches PostgreSQL ID
        name: savedItem.name,
        quantity: savedItem.quantity,
        timestamp: new Date(),
      });
  
      setInventory([...inventory, savedItem]);
      setNewItem({ name: '', quantity: 0 });
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };
  

  const handleUpdateItem = () => {
    if (editItem) {
      axios
        .put<InventoryItem>(`http://localhost:5000/inventory/${editItem.id}`, editItem)
        .then((response) => {
          setInventory(inventory.map((item) => (item.id === editItem.id ? response.data : item)));
          setEditItem(null);
        })
        .catch((error) => console.error('Error updating item:', error));
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      // Delete from PostgreSQL
      await axios.delete(`http://localhost:5000/inventory/${id}`);
  
      // Delete from Firebase
      const inventoryRef = collection(db, "inventory");
      const querySnapshot = await getDocs(inventoryRef);
      querySnapshot.forEach(async (doc) => {
        if (doc.data().id === id) {
          await deleteDoc(doc.ref);
        }
      });
  
      setInventory(inventory.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };
  

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center text-primary">📦 Inventory Management</h2>

      {/* Search Bar */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search inventory..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Add New Item */}
      <div className="card p-3 mb-4 shadow-sm border-primary">
        <h4 className="text-primary">➕ Add New Item</h4>
        <div className="row">
          <div className="col-md-5">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Item Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
          </div>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Quantity"
              value={newItem.quantity}
              onChange={(e) => setNewItem({ ...newItem, quantity: +e.target.value })}
            />
          </div>
          <div className="col-md-4">
            <button className="btn btn-primary w-100" onClick={handleAddItem}>
              <i className="bi bi-plus-circle"></i> Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Edit Item */}
      {editItem && (
        <div className="card p-3 mb-4 bg-light border-warning shadow-sm">
          <h4 className="text-warning">✏️ Edit Item</h4>
          <div className="row">
            <div className="col-md-5">
              <input
                type="text"
                className="form-control mb-2"
                value={editItem.name}
                onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <input
                type="number"
                className="form-control mb-2"
                value={editItem.quantity}
                onChange={(e) => setEditItem({ ...editItem, quantity: +e.target.value })}
              />
            </div>
            <div className="col-md-4">
              <button className="btn btn-success w-100" onClick={handleUpdateItem}>
                <i className="bi bi-save"></i> Update Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover shadow-sm border">
          <thead className="bg-dark text-light">
            <tr>
              <th>ID</th>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length > 0 ? (
              filteredInventory.map((item) => (
                <tr key={item.id}>
                  <td className="fw-bold">{item.id}</td>
                  <td>{item.name}</td>
                  <td>
                    <span
                      className={`badge ${
                        item.quantity < 10 ? 'bg-danger' : item.quantity < 50 ? 'bg-warning' : 'bg-success'
                      }`}
                    >
                      {item.quantity}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => setEditItem(item)}>
                      <i className="bi bi-pencil-square"></i> Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDeleteItem(item.id)}>
                      <i className="bi bi-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-muted">
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
