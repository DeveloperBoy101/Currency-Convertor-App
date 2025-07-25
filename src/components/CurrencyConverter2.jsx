"use client";
import React, { useEffect, useState } from "react";

const CurrencyConverter2 = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("PKR");
  const [amount, setAmount] = useState(5);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        console.log(response);
        const data = await response.json();
        console.log(data);
        console.log(data.rates)
        const symbols = Object.keys(data.rates); //convert object to array
        setCurrencies(symbols.sort()); //sort alphabatically
      } catch (error) {
        alert("Currency data fetch nahi ho saka. Please try again.");
        console.error(error);
      }
    };
    fetchCurrencies();
  }, []);

  const convert = async () => {
    if (amount <= 0) return;

    try {
      const res = await fetch(
        `https://open.er-api.com/v6/latest/${fromCurrency}`
      );
      const data = await res.json();
      const rate = data.rates[toCurrency];
      console.log(rate);
      if (rate) {
        setResult(amount * rate);
      }
    } catch (error) {
      alert("Currency data fetch nahi ho saka. Please try again.");
      console.error(error);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images4.alphacoders.com/131/1315826.jpg')",
      }}
    >
      <div className="max-w-md w-full mx-4 p-8 rounded-2xl shadow-2xl shadow-green-600 bg-black bg-opacity-60 border border-green-400 drop-shadow-2xl">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Currency Converter
        </h2>

        <div className="space-y-5">
          <div>
            <label className="block text-white mb-2">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount((e.target.value))}
              className="w-full p-3 rounded bg-white/10 border border-green-400 text-white"
              min="0"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-white mb-2">From</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full p-3 rounded bg-white/10 border border-green-400 text-white"
              >
                {currencies.map((cur) => (
                  <option key={cur} value={cur} className="text-black">
                    {cur}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={swapCurrencies}
              className="mt-8 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 text-sm"
            >
              Swap
            </button>

            <div className="flex-1">
              <label className="block text-white mb-2">To</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full p-3 rounded bg-white/10 border border-green-400 text-white"
              >
                {currencies.map((cur) => (
                  <option key={cur} value={cur} className="text-black">
                    {cur}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={convert}
            className="w-full bg-green-700 text-white py-3 rounded hover:bg-green-600 text-lg font-semibold"
          >
            Convert
          </button>

          {result !== null ? (
            <div className="mt-4 text-center bg-green-800 bg-opacity-60 p-4 rounded text-white font-semibold">
              {amount} {fromCurrency} = {result.toFixed(4)} {toCurrency}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter2;
