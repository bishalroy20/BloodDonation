import { useState, useEffect } from "react";
import axios from "axios";

export default function SearchPage() {
  const [bloodGroup, setBloodGroup] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Load districts
  useEffect(() => {
    fetch("/districts.json")
      .then((res) => res.json())
      .then(setDistricts);
  }, []);

  // 🔹 Load ALL donors initially
  useEffect(() => {
    loadAllDonors();
  }, []);

  const loadAllDonors = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/search-donors"
      );
      setDonors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Update upazilas
  useEffect(() => {
    const selected = districts.find((d) => d.name === district);
    setUpazilas(selected ? selected.upazilas : []);
    setUpazila("");
  }, [district, districts]);

  // 🔹 Search
  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/search-donors",
        {
          params: { bloodGroup, district, upazila },
        }
      );
      setDonors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Reset filter
  const handleReset = () => {
    setBloodGroup("");
    setDistrict("");
    setUpazila("");
    loadAllDonors();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Search Donors</h2>

      {/* Search form */}
      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8"
      >
        <select
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="">Blood group</option>
          <option>A+</option>
          <option>A-</option>
          <option>B+</option>
          <option>B-</option>
          <option>AB+</option>
          <option>AB-</option>
          <option>O+</option>
          <option>O-</option>
        </select>

        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="">District</option>
          {districts.map((d) => (
            <option key={d.name} value={d.name}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          value={upazila}
          onChange={(e) => setUpazila(e.target.value)}
          className="px-3 py-2 border rounded"
        >
          <option value="">Upazila</option>
          {upazilas.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Search
        </button>

        <button
          type="button"
          onClick={handleReset}
          className="px-6 py-2 bg-red-700 text-white rounded hover:bg-red-500"
        >
          Reset
        </button>
      </form>

      {/* Results */}
      {loading && <p>Loading donors...</p>}

      {!loading && donors.length === 0 && (
        <p className="text-gray-600">No donors found.</p>
      )}

      {donors.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead>
              <tr className="text-left border-b bg-gray-100">
                <th className="p-2">Name</th>
                <th className="p-2">Blood Group</th>
                <th className="p-2">District</th>
                <th className="p-2">Upazila</th>
                <th className="p-2">Contact</th>
              </tr>
            </thead>
            <tbody>
              {donors.map((d) => (
                <tr key={d._id} className="border-b">
                  <td className="p-2">{d.name}</td>
                  <td className="p-2">{d.bloodGroup}</td>
                  <td className="p-2">{d.district}</td>
                  <td className="p-2">{d.upazila}</td>
                  <td className="p-2">{d.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
