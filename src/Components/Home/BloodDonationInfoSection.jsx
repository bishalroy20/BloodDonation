import { Link } from "react-router-dom";

export default function BloodDonationInfoSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center text-red-600 mb-10">
        Why Donate Blood?
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1: Why Donate */}
        <div className="bg-gradient-to-br from-red-600 via-white to-red-400 text-black rounded-xl shadow-lg p-6 flex flex-col">
          <img
            src="https://i.postimg.cc/cJ3DYmQD/GPG472-World-Blood-Donor-Day-ai.jpg"
            alt="Why donate blood"
            className="rounded mb-4 h-48 object-cover"
          />
          <h3 className="text-xl font-bold mb-2">Why Donate Blood?</h3>
          <ul className="list-disc list-inside text-sm mb-4 space-y-1">
            <li>One donation can save up to three lives.</li>
            <li>Helps your community and loved ones in emergencies.</li>
            <li>Reduces risk of heart disease and boosts mental well-being.</li>
          </ul>
          
        </div>

        {/* Card 2: Misconceptions */}
        <div className="bg-gradient-to-br from-red-600 via-white to-red-400 text-black rounded-xl shadow-lg p-6 flex flex-col">
          <img
            src="https://i.postimg.cc/3xs1KvPD/OIP.webp"
            alt="Blood donation misconceptions"
            className="rounded mb-4 h-48 object-cover"
          />
          <h3 className="text-xl font-bold mb-2">Common Misconceptions</h3>
          <ul className="list-disc list-inside text-sm mb-4 space-y-1">
            <li>Blood donation doesn’t weaken your body.</li>
            <li>It’s safe and nearly painless under medical supervision.</li>
            <li>Even people with controlled diabetes or blood pressure can donate.</li>
          </ul>
          
        </div>

        {/* Card 3: Who Can Donate */}
        <div className="bg-gradient-to-br from-red-600 via-white to-red-400 text-black rounded-xl shadow-lg p-6 flex flex-col">
          <img
            src="https://i.postimg.cc/0jydtdwb/download.jpg"
            alt="Who can donate blood"
            className="rounded mb-4 h-48 object-cover"
          />
          <h3 className="text-xl font-bold mb-2">Who Can Donate?</h3>
          <ul className="list-disc list-inside text-sm mb-4 space-y-1">
            <li>Healthy individuals aged 18–60 years.</li>
            <li>Minimum weight of 50 kg (110 lbs).</li>
            <li>Can donate every 4 months if medically fit.</li>
          </ul>
          
        </div>
      </div>
    </section>
  );
}
