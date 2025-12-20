// src/components/StatsSection.jsx
export default function StatsSection() {
  const stats = [
    { label: "Active Donors", value: "15k+", icon: "🩸" },
    { label: "Lives Saved", value: "3k+", icon: "❤️" },
    { label: "Cities Covered", value: "50+", icon: "🌍" },
  ];

  return (
    <section className="bg-gradient-to-r from-red-200 via-red-300 to-red-400 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-10">
          Our Impact
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {stats.map((s) => (
            <div
              key={s.label}
              className="group relative bg-white rounded-xl shadow-lg p-8 transform transition duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Decorative gradient border */}
              <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-sky-500 transition-colors duration-500"></div>

              <div className="text-5xl mb-4">{s.icon}</div>
              <p className="text-3xl font-bold text-sky-700 group-hover:text-sky-800 transition-colors duration-300">
                {s.value}
              </p>
              <p className="text-gray-600 text-lg group-hover:text-gray-800 transition-colors duration-300">
                {s.label}
              </p>

              {/* Animated underline */}
              <span className="block mt-3 h-1 w-0 bg-sky-400 group-hover:w-full transition-all duration-500"></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
