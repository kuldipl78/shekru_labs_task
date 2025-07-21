import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import "./index.css"

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setShowOtp(true);
  };

  const handleVerifyOtp = () => {
    navigate('/dashboard');
  };

  return (
    <motion.div className="container" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Mobile Number"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      {showOtp ? (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </>
      ) : (
        <button onClick={handleLogin}>Send OTP</button>
      )}
      <p onClick={() => navigate('/signup')}>Don't have an account? Signup</p>
    </motion.div>
  );
};

export default Login;