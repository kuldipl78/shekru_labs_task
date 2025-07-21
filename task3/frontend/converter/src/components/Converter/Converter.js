import React, { useEffect, useState } from "react";
import axios from "axios";

const Convert = () => {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [currencies, setCurrencies] = useState({});
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Fetch available currency symbols
useEffect(() => {
  const fetchSymbols = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/symbols");
      setCurrencies(res.data?.symbols || {}); // ✅ safely assign object
    } catch (err) {
      console.error("Error fetching symbols:", err);
      setError("Failed to load currency list.");
    }
  };
  fetchSymbols();
}, []);


  // Handle conversion
  const handleConvert = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/convert", {
        params: { from: fromCurrency, to: toCurrency, amount },
      });
      setResult(res.data.result.toFixed(2));
      setError(null);
    } catch (err) {
      console.error("Error converting currency:", err);
      setError("Conversion failed.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "1rem" }}>
      <h2>Currency Converter</h2>
      <div>
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div>
        <label>From:</label>
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          {currencies && Object.keys(currencies).length > 0 ? (
            Object.entries(currencies).map(([code, value]) => (
              <option key={code} value={code}>
                {code} - {value.description}
              </option>
            ))
          ) : (
            <option disabled>Loading currencies...</option>
          )}


        </select>
      </div>

      <div>
        <label>To:</label>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        >
          {currencies && Object.keys(currencies).length > 0 ? (
            Object.entries(currencies).map(([code, value]) => (
              <option key={code} value={code}>
                {code} - {value.description}
              </option>
            ))
          ) : (
            <option disabled>Loading currencies...</option>
          )}


        </select>
      </div>

      <button onClick={handleConvert}>Convert</button>

      {result && (
        <h3>
          Converted Amount: {result} {toCurrency}
        </h3>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Convert;
