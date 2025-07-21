import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import "./index.css"

const ItemDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state;

  if (!item) return <p>No item data.</p>;

  return (
    <motion.div className="container" initial={{ y: 30 }} animate={{ y: 0 }}>
      <h2>Item Details</h2>
      <p><strong>ID:</strong> {item.id}</p>
      <p><strong>Title:</strong> {item.title}</p>
      <button onClick={() => navigate('/dashboard')}>Back</button>
    </motion.div>
  );
};

export default ItemDetails;
