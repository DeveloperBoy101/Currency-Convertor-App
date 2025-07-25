'use client';
import React, { useEffect, useState } from 'react';

const CurrencyConverter = () => {
  const [currencies, setCurrencies] = useState([]);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('PKR');
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rates, setRates] = useState({}); // Store the fetched rates

  useEffect(() => {
    const fetchCurrenciesAndRates = async () => {
      setLoading(true);
      setError(null); // Clear any previous errors

      try {
        // Fetch base USD rates to get all currency symbols
        const response = await fetch("https://open.er-api.com/v6/latest/USD");
        console.log(response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);

        if (data.result === "success" && data.rates) {
          const symbols = Object.keys(data.rates);
          console.log(symbols);
          setCurrencies(symbols.sort());
          setRates(data.rates); // Store all rates for later use if needed, or re-fetch for conversion
        } else {
          throw new Error("Failed to fetch currency data. Invalid response format.");
        }
      } catch (error) {
        console.error("Oops! Something went wrong while fetching currencies:", error);
        setError("Failed to load currencies. Please check your internet connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrenciesAndRates();
  }, []);

  const convert = async () => {
    if (amount <= 0) {
      setError("Please enter a valid amount greater than zero.");
      setResult(null);
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Fetch the rates specifically for the 'fromCurrency' as the base
      const res = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.result === "success" && data.rates && data.rates[toCurrency]) {
        // The API returns the rate of 'toCurrency' relative to 'fromCurrency'
        // So, amount * rate directly gives the converted value.
        const conversionRate = data.rates[toCurrency];
        setResult(amount * conversionRate);
      } else {
        setError("Conversion failed. No rate found for selected currencies. Please try again.");
      }
    } catch (err) {
      setError("Error during conversion. Please check your connection or try again. (Details: " + err.message + ")");
      console.error("Error converting currency:", err);
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null); // Clear result after swap
    setError(null);  // Clear error after swap
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://images4.alphacoders.com/131/1315826.jpg')" }}
    >
      {/* The actual currency converter card */}
      <div className="max-w-md w-full mx-4 p-8 rounded-2xl shadow-xl bg-opacity-70 backdrop-filter backdrop-blur-sm border-2 border-green-400 shadow-green-500/50 hover:shadow-green-500/80 transition-shadow duration-300">
        <div className="flex items-center justify-center mb-6">
          <h2 className="text-3xl font-extrabold text-white text-shadow-neon-blue">Currency Converter</h2>
        </div>

        <div className="space-y-5">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-white mb-2">
              Amount
            </label>
            <input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              placeholder="Enter amount"
              className="w-full p-3 border border-green-400 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out bg-transparent/50 text-white placeholder-gray-400 shadow-sm focus:shadow-neon-blue-light"
              min="0"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <label htmlFor="fromCurrency" className="block text-sm font-medium text-white mb-2">
                From
              </label>
              <select
                id="fromCurrency"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full p-3 border border-green-400 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out bg-transparent/50 text-white shadow-sm appearance-none focus:shadow-neon-blue-light"
              >
                {loading && <option className="bg-gray-800 text-white">Loading currencies...</option>}
                {!loading && currencies.length === 0 && <option className="bg-gray-800 text-white">No currencies available</option>}
                {currencies.map((cur) => (
                  <option key={cur} value={cur} className="bg-gray-800 text-white">
                    {cur}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={swapCurrencies}
              className="mt-8 p-2 bg-green-600 text-white rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-150 ease-in-out self-center text-sm font-semibold border-2 border-green-400 shadow-green-500/50 hover:shadow-green-500/80"
              aria-label="Swap currencies"
            >
              Swap
            </button>

            <div className="flex-1">
              <label htmlFor="toCurrency" className="block text-sm font-medium text-white mb-2">
                To
              </label>
              <select
                id="toCurrency"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full p-3 border border-green-400 rounded-lg focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out bg-transparent/50 text-white shadow-sm appearance-none focus:shadow-neon-blue-light"
              >
                {loading && <option className="bg-gray-800 text-white">Loading currencies...</option>}
                {!loading && currencies.length === 0 && <option className="bg-gray-800 text-white">No currencies available</option>}
                {currencies.map((cur) => (
                  <option key={cur} value={cur} className="bg-gray-800 text-white">
                    {cur}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={convert}
            className="w-full bg-green-800 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center text-lg font-semibold border-2 border-green-400 shadow-green-500/50 hover:shadow-green-500/80"
            disabled={loading || currencies.length === 0}
          >
            {loading ? (
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Convert"
            )}
          </button>

          {error && (
            <div className="mt-4 p-3 bg-red-800 bg-opacity-70 border border-red-600 text-red-300 rounded-lg text-center shadow-md">
              {error}
            </div>
          )}

          {result !== null && (
            <div className="mt-6 p-4 bg-green-800 bg-opacity-70 rounded-lg text-center text-green-300 font-semibold text-xl border border-green-600 shadow-md shadow-green-500/50">
              <p className="mb-1">
                <span className="text-gray-200 text-base font-normal">Result:</span>
              </p>
              <p className="text-2xl font-bold text-white">
                {amount} {fromCurrency} = <span className="text-green-400">{result.toFixed(2)}</span> {toCurrency}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;