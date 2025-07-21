import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./index.css"

const ItemList = ({ items, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <ul className="item-list">
      {items.map((item) => (
        <li key={item.id}>
          <span>{item.title}</span>
          <div>
            <button onClick={() => navigate(`/item/${item.id}`, { state: item })}>View</button>
            <button onClick={() => onEdit(item)}>Edit</button>
            <button onClick={() => onDelete(item.id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ItemList;