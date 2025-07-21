import React, { useState, useEffect } from 'react';
import "./index.css"

const ItemForm = ({ onSubmit, editingItem }) => {
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (editingItem) setTitle(editingItem.title);
  }, [editingItem]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ id: editingItem?.id, title });
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="item-form">
      <input
        placeholder="Item Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit">{editingItem ? 'Update' : 'Add'}</button>
    </form>
  );
};

export default ItemForm;