"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function Home() {
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
    <div className="min-h-screen flex flex-col items-center py-8 px-4">
      
      {/* Header */}
      <header className="w-full max-w-4xl glass-card rounded-2xl p-4 flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 relative">
            <Image 
              src="https://upload.wikimedia.org/wikipedia/commons/8/84/Government_Seal_of_Bangladesh.svg" 
              alt="Government Seal" fill className="object-contain"
            />
          </div>
          <div>
            <h2 className="text-lg font-bold text-green-900">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</h2>
            <h3 className="text-sm font-semibold text-gray-700">Bangladesh Telecommunication Regulatory Commission</h3>
          </div>
        </div>
        <div className="w-16 h-16 relative hidden sm:block">
          {/* BTRC Logo */}
          <Image 
            src="https://lims.btrc.gov.bd/assets/images/btrc-logo-updated.png" 
            alt="BTRC Logo" fill className="object-contain"
            unoptimized // এটি লোগো লোড হতে সাহায্য করবে
          />
        </div>
      </header>

      {/* Main Card */}
      <main className="w-full max-w-4xl glass-card rounded-3xl overflow-hidden">
        
        <div className="border-b border-gray-200/50 p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-800">BTRC SIM Ownership Verification Portal</h1>
          <h2 className="text-xl font-bold text-gray-800 mt-1">বিটিআরসি সিম মালিকানা যাচাই পোর্টাল</h2>
        </div>

        <div className="p-6 md:p-8">
          <div className="mb-6 text-sm text-gray-700">
            <p>Please enter your NID number and Date of Birth to verify the number of SIMs registered under your name.</p>
            <p className="font-semibold mt-1">আপনার এনআইডি নম্বর এবং জন্ম তারিখ দিয়ে আপনার নামে নিবন্ধিত সিমের সংখ্যা যাচাই করুন।</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">NID Number (এনআইডি নম্বর)</label>
              <input
                type="text" value={nid} onChange={(e) => setNid(e.target.value)}
                className="w-full md:w-1/2 px-4 py-3 glass-input rounded-xl"
                placeholder="e.g. 1234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Date of Birth (জন্ম তারিখ)</label>
              <div className="flex gap-2 items-center">
                <select value={day} onChange={(e) => setDay(e.target.value)} className="w-24 px-3 py-3 glass-input rounded-xl">
                  <option value="">Day</option>
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                <select value={month} onChange={(e) => setMonth(e.target.value)} className="w-28 px-3 py-3 glass-input rounded-xl">
                  <option value="">Month</option>
                  {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select value={year} onChange={(e) => setYear(e.target.value)} className="w-28 px-3 py-3 glass-input rounded-xl">
                  <option value="">Year</option>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>

            {showPhoneInputs && (
              <div className="mt-6 pt-6 border-t border-gray-200/50 animate-fade-in">
                <p className="text-sm font-semibold text-gray-700 mb-4">
                  Please list the phone numbers you currently use to confirm ownership:<br/>
                  <span className="font-normal text-gray-600">আপনি বর্তমানে যে ফোন নম্বর ব্যবহার করছেন তার তালিকা দিন:</span>
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {phones.map((phone, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500 w-16">{index + 1}. SIM</span>
                      <input
                        type="text" value={phone} onChange={(e) => handlePhoneChange(index, e.target.value)}
                        className="w-full px-4 py-2 glass-input rounded-lg font-mono"
                        placeholder="01XXXXXXXXX"
                      />
                    </div>
                  ))}
                </div>

                <div className="text-center">
                  <button 
                    onClick={handleVerifyPhones} disabled={loading} 
                    className="w-full sm:w-auto bg-green-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-green-800 transition-all disabled:opacity-50"
                  >
                    {loading ? "Verifying..." : "Confirm Ownership (মালিকানা নিশ্চিত করুন)"}
                  </button>
                </div>
              </div>
            )}

            {results && (
              <div className="mt-8 pt-6 border-t border-gray-200/50">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Verification Results</h3>
                <div className="space-y-2">
                  {results.map((res, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border ${res.success ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-gray-800 font-bold">{res.phone}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${res.success ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"}`}>
                          {res.success ? "Verified" : "Failed"}
                        </span>
                      </div>
                      {res.success && res.name && <div className="text-sm text-green-800 mt-2 font-semibold">Name: {res.name}</div>}
                      {!res.success && <div className="text-sm text-red-600 mt-2">{res.message}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="mt-8 text-center text-xs text-gray-500">
        &copy; 2024 Bangladesh Telecommunication Regulatory Commission. All rights reserved.
      </footer>
    </div>
  );
}
