import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import "./index.css"

const Signup = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const navigate = useNavigate();

  const handleSignup = () => {
    alert('Signed up successfully!');
    navigate('/');
  };

  return (
    <motion.div className="container" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
      <h2>Signup</h2>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
      <button onClick={handleSignup}>Signup</button>
    </motion.div>
  );
};

export default Signup;