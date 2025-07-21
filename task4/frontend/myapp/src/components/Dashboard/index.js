import React, { useState } from 'react';
import ItemForm from '../ItemForm';
import ItemList from '../ItemList';
import { Navigate } from 'react-router-dom';
import "./index.css"

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const isAuthenticated = true; // Replace with actual auth logic

  if (!isAuthenticated) return <Navigate to="/" />;

  const addItem = (item) => {
    setItems([...items, { ...item, id: Date.now() }]);
  };

  const updateItem = (updated) => {
    setItems(items.map((item) => (item.id === updated.id ? updated : item)));
    setEditingItem(null);
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="container">
      <h2>Dashboard</h2>
      <ItemForm onSubmit={editingItem ? updateItem : addItem} editingItem={editingItem} />
      <ItemList items={items} onEdit={setEditingItem} onDelete={deleteItem} />
    </div>
  );
};

export default Dashboard;