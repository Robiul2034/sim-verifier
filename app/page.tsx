"use client";

import { useState } from "react";

export default function Home() {
  const [step, setStep] = useState(1);
  const [nid, setNid] = useState("");
  const [dob, setDob] = useState("");
  const [phones, setPhones] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  // ধাপ ১: NID চেক করা
  const handleCheckNid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nid || !dob) return alert("Please enter NID and DOB.");

    setLoading(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check_nid", nid, dob }),
      });
      const data = await res.json();

      if (data.success) {
        setPhones(new Array(data.sim_count).fill(""));
        setStep(2);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  // ধাপ ২: নাম্বার ভেরিফাই করা
  const handleVerifyPhones = async () => {
    const filledPhones = phones.filter((p) => p.trim() !== "");
    if (filledPhones.length === 0) return alert("Please enter phone numbers.");

    setLoading(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify_phones", nid, dob, phones: filledPhones }),
      });
      const data = await res.json();

      if (data.success) {
        setResults(data.data);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...phones];
    newPhones[index] = value;
    setPhones(newPhones);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 font-sans text-gray-800">
      {/* হেডার */}
      <div className="w-full max-w-3xl bg-white rounded-t-xl border-b-4 border-green-700 shadow-sm p-6 text-center">
        <h2 className="text-sm font-bold">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</h2>
        <h3 className="text-xs text-gray-600 mb-4">Bangladesh Telecommunication Regulatory Commission</h3>
        <h1 className="text-2xl font-bold text-gray-900">BTRC SIM Ownership Verification Portal</h1>
        <p className="text-sm font-semibold text-gray-700">বিটিআরসি সিম মালিকানা যাচাই পোর্টাল</p>
      </div>

      <div className="w-full max-w-3xl bg-white rounded-b-xl shadow-lg p-6 md:p-8">
        {/* ধাপ ১ ফর্ম */}
        {step === 1 && (
          <form onSubmit={handleCheckNid} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">NID Number (এনআইডি নম্বর)</label>
              <input
                type="text"
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                placeholder="1234567890123"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth (জন্ম তারিখ)</label>
              <div className="flex gap-4">
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
                  required
                />
                <button type="submit" disabled={loading} className="w-full sm:w-auto px-8 py-2 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 transition disabled:opacity-50">
                  {loading ? "Verifying..." : "Verify (যাচাই করুন)"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ধাপ ২ ফর্ম */}
        {step === 2 && (
          <div>
            <div className="bg-green-50 text-green-800 p-4 rounded-lg mb-6 text-sm">
              <p>Verification Status: <span className="font-bold">Matches</span></p>
              <p>Total SIMs registered under this NID: <span className="font-bold">{phones.length}</span></p>
            </div>
            <p className="text-sm text-gray-700 mb-4">Please list the phone numbers you currently use to confirm ownership:</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {phones.map((phone, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500 w-14">{index + 1}. SIM</span>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none font-mono"
                    placeholder="01XXXXXXXXX"
                  />
                </div>
              ))}
            </div>

            <div className="text-center">
              <button onClick={handleVerifyPhones} disabled={loading} className="px-8 py-3 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 transition disabled:opacity-50">
                {loading ? "Checking Numbers..." : "Confirm Ownership (মালিকানা নিশ্চিত করুন)"}
              </button>
            </div>
          </div>
        )}

        {/* রেজাল্ট সেকশন */}
        {results && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold mb-4">Verification Results</h3>
            <div className="space-y-2">
              {results.map((res, idx) => (
                <div key={idx} className={`flex justify-between items-center p-3 rounded-lg border ${res.status === "Verified" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                  <div className="flex items-center gap-3">
                    <span>{res.status === "Verified" ? "✅" : "❌"}</span>
                    <span className="font-mono font-medium">{res.phone}</span>
                  </div>
                  <span className={`text-sm font-semibold ${res.status === "Verified" ? "text-green-700" : "text-red-700"}`}>
                    {res.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}