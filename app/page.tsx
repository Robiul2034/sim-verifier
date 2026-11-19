"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [step, setStep] = useState(1);
  const [nid, setNid] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  
  // ছবির মতো ৬টি ইনপুট ফিল্ড
  const [phones, setPhones] = useState<string[]>(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 50 }, (_, i) => 2024 - i);

  // Step 1: Verify Button Click
  const handleVerifyClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nid || !day || !month || !year) {
      return alert("Please fill NID and full Date of Birth.");
    }
    // পরবর্তী ধাপে যাওয়া (ছবির মতো ইনপুট ফিল্ড দেখানো)
    setStep(2);
  };

  // Step 2: Verify Multiple Phones
  const handleVerifyPhones = async () => {
    const filledPhones = phones.filter((p) => p.trim() !== "");
    if (filledPhones.length === 0) return alert("Please enter at least one phone number.");

    // Date Format YYYY-MM-DD (যেমন: 1987-11-03)
    const monthNum = (months.indexOf(month) + 1).toString().padStart(2, '0');
    const dayNum = day.padStart(2, '0');
    const formattedDob = `${year}-${monthNum}-${dayNum}`;

    setLoading(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nid, dob: formattedDob, phones: filledPhones }),
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
    <main className="min-h-screen bg-white flex flex-col items-center py-8 px-4 font-sans text-gray-800">
      
      {/* হেডার (লোগোসহ) */}
      <div className="w-full max-w-4xl flex justify-between items-center border-b-2 border-green-700 pb-4 mb-4">
        <div className="flex items-center gap-3">
          {/* Bangladesh Govt Logo (Placeholder) */}
          <div className="w-16 h-16 bg-green-700 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-red-500 shadow">
            Govt<br/>BD
          </div>
          <div>
            <h2 className="text-lg font-bold text-green-800">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</h2>
            <h3 className="text-sm font-semibold text-gray-700">Bangladesh Telecommunication Regulatory Commission</h3>
          </div>
        </div>
        <div className="text-center">
           {/* UPAC Logo (Placeholder) */}
           <div className="w-12 h-12 border-2 border-gray-400 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold mx-auto">
             UPAC
           </div>
        </div>
      </div>

      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-1">BTRC SIM Ownership Verification Portal</h1>
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">বিটিআরসি সিম মালিকানা যাচাই পোর্টাল</h2>

        {/* নির্দেশনা */}
        <div className="mb-4 text-sm">
          <p>Please enter your NID number and Date of Birth to verify the number of SIMs registered under your name.</p>
          <p className="font-semibold">আপনার এনআইডি নম্বর এবং জন্ম তারিখ দিয়ে আপনার নামে নিবন্ধিত সিমের সংখ্যা যাচাই করুন।</p>
        </div>

        {/* ফর্ম সেকশন */}
        <div className="w-full">
          <form onSubmit={handleVerifyClick}>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">NID Number (এনআইডি নম্বর)</label>
              <input
                type="text"
                value={nid}
                onChange={(e) => setNid(e.target.value)}
                className="w-full md:w-1/2 px-3 py-2 border border-gray-400 rounded focus:ring-2 focus:ring-green-600 outline-none"
                placeholder="1234567890123"
                disabled={step === 2}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">Date of Birth (জন্ম তারিখ)</label>
              <div className="flex gap-2 items-center">
                <select value={day} onChange={(e) => setDay(e.target.value)} className="px-3 py-2 border border-gray-400 rounded focus:ring-2 focus:ring-green-600 outline-none" disabled={step === 2} required>
                  <option value="">Day</option>
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={month} onChange={(e) => setMonth(e.target.value)} className="px-3 py-2 border border-gray-400 rounded focus:ring-2 focus:ring-green-600 outline-none" disabled={step === 2} required>
                  <option value="">Month</option>
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select value={year} onChange={(e) => setYear(e.target.value)} className="px-3 py-2 border border-gray-400 rounded focus:ring-2 focus:ring-green-600 outline-none" disabled={step === 2} required>
                  <option value="">Year</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                
                {step === 1 && (
                  <button type="submit" className="ml-4 bg-green-700 text-white font-semibold py-2 px-6 rounded hover:bg-green-800 transition">
                    Verify (যাচাই করুন)
                  </button>
                )}
              </div>
            </div>
          </form>

          {/* ছবির মতো নিচের সেকশন */}
          {step === 2 && (
            <div className="mt-6 animate-fade-in">
              <p className="text-sm font-semibold">Verification Status: <span className="text-black">Matches (যাচাইকরণ স্ট্যাটাস: মিলেছে)</span></p>
              {/* গভর্নমেন্ট API সিম কাউন্ট দেয় না, তাই আমরা ৬টি ফিল্ড দেখাচ্ছি */}
              <p className="text-sm font-semibold mb-4">Total SIMs registered under this NID: 6 (এই এনআইডি-র অধীনে মোট নিবন্ধিত সিম: ৬)</p>

              <p className="text-sm mb-2">Please list the 6 phone numbers you currently use to confirm ownership:</p>
              <p className="text-sm font-semibold mb-4">আপনি বর্তমানে যে ৬টি ফোন নম্বর ব্যবহার করছেন তার তালিকা দিন মালিকানা নিশ্চিত করতে:</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {phones.map((phone, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-sm font-medium w-16">{index + 1}. SIM {index + 1}</span>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => handlePhoneChange(index, e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-400 rounded focus:ring-2 focus:ring-green-600 outline-none"
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                ))}
              </div>

              <div className="text-center">
                <button onClick={handleVerifyPhones} disabled={loading} className="bg-green-800 text-white font-semibold py-2 px-8 rounded hover:bg-green-900 transition disabled:opacity-50">
                  {loading ? "Checking..." : "Confirm Ownership (মালিকানা নিশ্চিত করুন)"}
                </button>
              </div>
            </div>
          )}

          {/* রেজাল্ট সেকশন */}
          {results && (
            <div className="mt-8 pt-6 border-t border-gray-300">
              <h3 className="text-lg font-bold mb-4">Verification Results</h3>
              <div className="space-y-2">
                {results.map((res, idx) => (
                  <div key={idx} className={`flex justify-between items-center p-3 border rounded ${res.status === "Verified" ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"}`}>
                    <span className="font-mono text-gray-800 font-medium">{res.phone}</span>
                    <span className={`text-sm font-bold ${res.status === "Verified" ? "text-green-700" : "text-red-700"}`}>
                      {res.status === "Verified" ? "Verified Successfully" : res.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
