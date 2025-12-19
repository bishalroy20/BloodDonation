// src/pages/FundingPage.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Contexts/AuthProvider";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function FundingForm({ onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [amountDisplay, setAmountDisplay] = useState(""); 
  const [loading, setLoading] = useState(false);

  const pay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const amountFloat = parseFloat(amountDisplay);
    if (isNaN(amountFloat) || amountFloat <= 0) {
      alert("Enter a valid amount");
      return;
    }
    const amount = Math.round(amountFloat * 100); 

    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:5000/api/funding/create-intent", { amount }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const clientSecret = data.clientSecret;
      const card = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });

      if (result.error) {
        alert(result.error.message);
      } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        await axios.post("http://localhost:5000/api/funding/record", { amount }, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        alert("Thank you for your support!");
        onSuccess();
      }
    } catch (err) {
      alert(err?.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={pay} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Amount (USD)</label>
        <input
          value={amountDisplay}
          onChange={(e) => setAmountDisplay(e.target.value)}
          placeholder="e.g., 5.00"
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="p-3 border rounded bg-white">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Confirm payment"}
      </button>
    </form>
  );
}

export default function FundingPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Require auth client-side (you should also protect route server-side via JWT)
  if (!user) {
    return <div className="max-w-7xl mx-auto p-6">Please log in to view funding.</div>;
  }

  const load = async () => {
    const { data } = await axios.get("http://localhost:5000/api/funding", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setItems(data || []);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Funding</h2>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Give fund
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="text-left border-b bg-gray-100">
              <th className="p-2">Donor</th>
              <th className="p-2">Email</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Currency</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {items.map((f) => (
              <tr key={f._id} className="border-b">
                <td className="p-2">{f.name || "—"}</td>
                <td className="p-2">{f.email}</td>
                <td className="p-2">
                  ${(f.amount / 100).toFixed(2)}
                </td>
                <td className="p-2">{f.currency.toUpperCase()}</td>
                <td className="p-2">{new Date(f.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Give fund</h3>
              <button onClick={() => setShowModal(false)}>✖</button>
            </div>
            <Elements stripe={stripePromise}>
              <FundingForm
                onSuccess={() => {
                  setShowModal(false);
                  load();
                }}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
}