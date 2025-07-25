import React, { useEffect, useState } from "react";
import { IoIosSwap } from "react-icons/io";

const CurrencyConverter3 = () => {
  const [currencies, setCurrencies] = useState([]);
  const [toCurrency, setToCurrency] = useState("PKR");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [amount, setAmount] = useState(1);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        let res = await fetch("https://open.er-api.com/v6/latest/USD");
        let data = await res.json();
        const symbols = Object.keys(data.rates);
        console.log(data.rates);
        setCurrencies(symbols.sort());
        console.log(symbols);
      } catch (error) {
        alert("API is not Fetching Data..!");
        console.log(err);
      }
    };
    fetchCurrencies();
  }, []);

  const convertCurrency = async () => {
    if (amount <= 0) return;
    try {
      let res = await fetch(
        `https://open.er-api.com/v6/latest/${fromCurrency}`
      );
      let data = await res.json();
      let rate = data.rates[toCurrency];
      if (rate) {
        setResult(amount * rate);
      }
    } catch (error) {
      alert("API is not Fetching Data..!");
      console.log(err);
    }
  };
  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };
  return (
    <div
      className="w-screen min-h-screen flex justify-center items-center bg-cover bg-center px-4 
             bg-[url('https://wallpapers-clan.com/wp-content/uploads/2021/03/cartoon-big-money-green-wallpaper-scaled.jpg')]
             md:bg-[url('https://images4.alphacoders.com/131/1315826.jpg')]"
    >
      <div className="w-[400px] max-w-xl sm:h-[450px] lg:h-[400px] border border-green-500 flex flex-col gap-6 shadow-lg shadow-green-400  rounded-xl bg-transparent/40 shadow-xl p-6 ">
        <h2 className="text-center text-transparent bg-clip-text bg-gradient-to-b from-white to-green-600 text-3xl font-bold">
          CURRENCY CONVERTER
        </h2>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min={1}
          max={100000}
          className="w-full text-white px-4 py-2 rounded-md border-2 border-green-600 shadow-md shadow-green-400 bg-white/40 placeholder-white active:border-green-800"
        />

        <div className="flex flex-row  items-center justify-between gap-4">
          <div className="flex flex-col w-full">
            <label htmlFor="from" className="text-white mb-1">
              From
            </label>
            <select
              id="from"
              className="w-full text-white px-4 py-2 border-2 border-green-600 rounded-md shadow-md shadow-green-400 bg-white/40 placeholder-white"
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              {currencies.map((cur) => (
                <option key={cur} value={cur} className="bg-transparent/70">
                  {cur}
                </option>
              ))}
            </select>
          </div>

          {/* SWAP BUTTON */}
          <button
            onClick={swapCurrencies}
            className="p-2 bg-green-400 text-white rounded-full shadow-md shadow-green-400 hover:scale-110 transition"
          >
            <IoIosSwap size={24} />
          </button>

          <div className="flex flex-col w-full">
            <label htmlFor="to" className="text-white mb-1">
              To
            </label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full p-3 rounded bg-white/40 border border-green-400 shadow-md shadow-green-400 text-white"
            >
              {currencies.map((cur) => (
                <option key={cur} value={cur} className="bg-transparent/70 ">
                  {cur}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={convertCurrency}
          className="text-white bg-green-500 py-3 rounded-md shadow-lg shadow-green-300"
        >
          Convert
        </button>
        {result != null ? (
          <div className=" w-full h-full bg-green-400 border-green-700 shadow-xl shadow-green-500 p-4 rounded font-bold text-white flex justify-center items-center">
            {amount} {fromCurrency} = {result.toFixed(2)} {toCurrency}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CurrencyConverter3;
