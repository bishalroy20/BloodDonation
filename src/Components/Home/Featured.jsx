// src/components/Featured.jsx
export default function Featured() {
  const items = [
    { title: "Real-time requests", desc: "Browse urgent blood requests and help nearby patients." },
    { title: "Verified donors", desc: "Donor profiles are verified to ensure safety and trust." },
    { title: "Easy scheduling", desc: "Coordinate donation time and location with recipients." },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-semibold mb-6 text-center">✨ Featured ✨</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((i) => (
          <div
            key={i.title}
            className="group relative p-6 rounded-xl bg-gradient-to-br from-red-50 to-white shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
          >
            {/* Decorative animated border */}
            <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-red-400 transition-colors duration-300"></div>

            <h3 className="text-lg font-semibold mb-2 text-red-700 group-hover:text-red-800 transition-colors duration-300">
              {i.title}
            </h3>
            <p className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
              {i.desc}
            </p>

            {/* Animated underline */}
            <span className="block mt-3 h-1 w-0 bg-red-400 group-hover:w-full transition-all duration-500"></span>
          </div>
        ))}
      </div>
    </section>
  );
}
