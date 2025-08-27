import { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/data.json") // karena ada di public folder
      .then((res) => res.json())
      .then((result) => {
        setData(result);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
<div>
  <h1>Data Produk</h1>
  <ul className="space-y-4">
    {data.map((item) => (
      <li key={item.id} className="flex items-center gap-4 border p-3 rounded-lg">
        <img
          src={item.foto}
          alt={item.nama}
          className="w-20 h-20 object-cover rounded-md"
        />
        <div>
          <h2 className="font-semibold">{item.nama}</h2>
          <p className="text-gray-600">Rp{item.harga}</p>
        </div>
      </li>
    ))}
  </ul>
</div>
  );
}
