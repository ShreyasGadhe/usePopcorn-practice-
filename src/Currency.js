import { useState, useEffect } from "react";
// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`

export default function Currency() {
  const [amount, setAmount] = useState(0);
  const [output, setOutput] = useState(0);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("INR");

  useEffect(
    function () {
      async function fetchData() {
        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`
        );
        const data = await res.json();
        setOutput(data.rates.INR);
        console.log(from);
        console.log(to);
        console.log(data);
        console.log(data.rates.INR);
      }
      fetchData();
    },
    [amount]
  );

  // const ans = output.toString();

  return (
    <div>
      <input type="text" onChange={(e) => setAmount(e.target.value)} />
      <select onChange={(e) => setFrom(e.target.value)}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <select onChange={(e) => setTo(e.target.value)}>
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
      </select>
      <p>{output}</p>
    </div>
  );
}
