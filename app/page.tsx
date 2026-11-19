"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [view, setView] = useState<"dashboard" | "verify">("dashboard");
  
  // Verification states
  const [nid, setNid] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [showPhoneInputs, setShowPhoneInputs] = useState(false);
  const [phones, setPhones] = useState<string[]>(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 50 }, (_, i) => 2024 - i);

  // Auto-show inputs when NID and DOB are filled
  useEffect(() => {
    if (nid.length >= 10 && day !== "" && month !== "" && year !== "") {
      setShowPhoneInputs(true);
    } else {
      setShowPhoneInputs(false);
    }
  }, [nid, day, month, year]);

  const handleVerifyPhones = async () => {
    const filledPhones = phones.filter((p) => p.trim() !== "");
    if (filledPhones.length === 0) return alert("Please enter at least one phone number.");

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
      if (data.success) setResults(data.data);
      else alert(data.message);
    } catch (error) { alert("Network error."); } 
    finally { setLoading(false); }
  };

  const handlePhoneChange = (index: number, value: string) => {
    const newPhones = [...phones];
    newPhones[index] = value;
    setPhones(newPhones);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-6 px-4">
      
      {/* প্রিমিয়াম হেডার */}
      <header className="w-full max-w-5xl bg-white/70 backdrop-blur-lg border border-white/40 shadow-sm rounded-2xl p-4 flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Image src="/govt-logo.png" alt="Govt of Bangladesh" width={50} height={50} className="object-contain" />
          <Image src="/btrc-logo.png" alt="BTRC" width={50} height={50} className="object-contain" />
          <div className="hidden sm:block">
            <h2 className="text-sm font-bold text-green-900">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</h2>
            <h3 className="text-xs text-gray-600">Bangladesh Telecommunication Regulatory Commission</h3>
          </div>
        </div>
        <Image src="/upac-logo.png" alt="UPAC" width={40} height={40} className="object-contain" />
      </header>

      {/* মেইন কন্টেন্ট */}
      <main className="w-full max-w-5xl">
        
        {/* === ড্যাশবোর্ড ভিউ === */}
        {view === "dashboard" && (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Digital Service Portal</h1>
              <p className="text-gray-500">Select a service below to proceed</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* SIM Verification Card (Active) */}
              <div 
                onClick={() => setView("verify")}
                className="bg-white/80 backdrop-blur-md border border-green-100 rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                  📱
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">SIM Verification</h3>
                <p className="text-sm text-gray-500 mb-4">Check how many SIMs are registered under your NID and verify ownership.</p>
                <span className="text-green-600 font-semibold text-sm flex items-center gap-1">Start Service →</span>
              </div>

              {/* Placeholder Cards for more services */}
              <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-3xl p-6 shadow-sm opacity-70">
                <div className="w-14 h-14 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center text-2xl mb-4">
                  🪪
                </div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">NID Status Check</h3>
                <p className="text-sm text-gray-400 mb-4">Check the status of your National ID card application.</p>
                <span className="text-gray-400 font-semibold text-sm">Coming Soon</span>
              </div>

              <div className="bg-white/50 backdrop-blur-sm border border-gray-200 rounded-3xl p-6 shadow-sm opacity-70">
                <div className="w-14 h-14 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center text-2xl mb-4">
                  🛂
                </div>
                <h3 className="text-xl font-bold text-gray-600 mb-2">Passport Verification</h3>
                <p className="text-sm text-gray-400 mb-4">Verify your passport details and application status.</p>
                <span className="text-gray-400 font-semibold text-sm">Coming Soon</span>
              </div>
            </div>
          </div>
        )}

        {/* === ভেরিফিকেশন ভিউ === */}
        {view === "verify" && (
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl p-6 md:p-10 animate-slide-up">
            <button 
              onClick={() => { setView("dashboard"); setResults(null); }}
              className="text-gray-500 hover:text-green-700 mb-6 flex items-center gap-2 font-medium transition"
            >
              ← Back to Dashboard
            </button>

            <div className="text-center mb-8 border-b pb-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">BTRC SIM Ownership Verification</h1>
              <h2 className="text-lg font-semibold text-gray-600">বিটিআরসি সিম মালিকানা যাচাই পোর্টাল</h2>
            </div>

            <div className="space-y-6">
              {/* NID & DOB */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">NID Number (এনআইডি নম্বর)</label>
                  <input
                    type="text"
                    value={nid}
                    onChange={(e) => setNid(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g. 1234567890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth (জন্ম তারিখ)</label>
                  <div className="flex gap-2">
                    <select value={day} onChange={(e) => setDay(e.target.value)} className="w-1/3 px-2 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none">
                      <option value="">Day</option>
                      {days.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                    <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-1/3 px-2 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none">
                      <option value="">Month</option>
                      {months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select value={year} onChange={(e) => setYear(e.target.value)} className="w-1/3 px-2 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none">
                      <option value="">Year</option>
                      {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Auto-reveal Phone Inputs */}
              {showPhoneInputs && (
                <div className="mt-8 pt-6 border-t border-gray-200 animate-fade-in">
                  <p className="text-sm font-semibold text-gray-700 mb-4">Please enter the phone numbers to verify:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {phones.map((phone, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-400 w-12">{index + 1}.</span>
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => handlePhoneChange(index, e.target.value)}
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-mono"
                          placeholder="01XXXXXXXXX"
                        />
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={handleVerifyPhones} 
                    disabled={loading} 
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 transition-all disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Confirm Ownership (মালিকানা নিশ্চিত করুন)"}
                  </button>
                </div>
              )}

              {/* Results */}
              {results && (
                <div className="mt-8 pt-6 border-t border-gray-200 animate-fade-in">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Verification Results</h3>
                  <div className="space-y-3">
                    {results.map((res, idx) => (
                      <div key={idx} className={`flex flex-col p-4 rounded-xl border ${res.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-gray-800 font-bold">{res.phone}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${res.success ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                            {res.success ? "Verified" : "Failed"}
                          </span>
                        </div>
                        {res.success && res.name && (
                          <div className="text-sm text-green-800 mt-2 font-semibold">Name: {res.name}</div>
                        )}
                        {!res.success && <div className="text-sm text-red-600 mt-2">{res.message}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      {/* ফুটার */}
      <footer className="mt-12 text-center text-xs text-gray-400">
        &copy; 2024 BTRC Digital Services. All rights reserved.
      </footer>
    </div>
  );
}
