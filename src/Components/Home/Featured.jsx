// src/components/Featured.jsx
export default function Featured() {
  const items = [
    { title: "Real-time requests", desc: "Browse urgent blood requests and help nearby patients." },
    { title: "Verified donors", desc: "Donor profiles are verified to ensure safety and trust." },
    { title: "Easy scheduling", desc: "Coordinate donation time and location with recipients." },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-semibold mb-6">Featured</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((i) => (
          <div key={i.title} className="p-6 border rounded bg-white">
            <h3 className="text-lg font-semibold mb-2">{i.title}</h3>
            <p className="text-gray-600">{i.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}