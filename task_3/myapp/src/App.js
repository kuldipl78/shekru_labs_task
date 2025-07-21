import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = "https://api.exchangerate.host/latest";

function App() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [currencies, setCurrencies] = useState([]);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [error, setError] = useState("");

  // Fetch available currencies once
  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setCurrencies(Object.keys(data.rates));
      })
      .catch(() => setError("Failed to fetch currencies"));
  }, []);

  const convertCurrency = () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }
    setError("");

    fetch(`${API_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
      .then((res) => res.json())
      .then((data) => {
        const rate = data.rates[toCurrency];
        setConvertedAmount((amount * rate).toFixed(2));
      })
      .catch(() => setError("Conversion failed. Try again later."));
  };

  return (
    <div className="container">
      <h2>Currency Converter</h2>
      <div className="converter-box">
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="dropdowns">
          <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
            {currencies.map((cur) => (
              <option key={cur} value={cur}>{cur}</option>
            ))}
          </select>

          <span>to</span>

          <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
            {currencies.map((cur) => (
              <option key={cur} value={cur}>{cur}</option>
            ))}
          </select>
        </div>

        <button onClick={convertCurrency}>Convert</button>

        {error && <p className="error">{error}</p>}
        {convertedAmount && (
          <p className="result">
            {amount} {fromCurrency} = {convertedAmount} {toCurrency}
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
