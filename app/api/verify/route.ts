import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, nid, dob, phones } = body;

    // ১. প্রথম ধাপ: NID এবং DOB চেক করা (ছবির মতো ৬টি সিম দেখানোর জন্য)
    if (action === 'check_nid') {
      if (!nid || !dob) {
        return NextResponse.json({ success: false, message: "NID and DOB required." }, { status: 400 });
      }
      
      // গভর্নমেন্ট API সাধারণত সিম কাউন্ট রিটার্ন করে না, তাই আমরা ডেমো হিসেবে ৬ দিচ্ছি
      return NextResponse.json({ success: true, sim_count: 6 });
    }

    // ২. দ্বিতীয় ধাপ: একাধিক ফোন নম্বর ভেরিফাই করা
    if (action === 'verify_phones') {
      if (!nid || !dob || !phones || !Array.isArray(phones)) {
        return NextResponse.json({ success: false, message: "Invalid input." }, { status: 400 });
      }

      const results = [];
      const targetUrl = "https://secure.incometax.gov.bd/TinApplication/VerifyMobileAgainstNid";

      for (const phone of phones) {
        if (!phone.trim()) continue;

        const postData = new URLSearchParams({
          'NID': nid,
          'DOB': dob,
          'mobileNumber': phone.trim()
        });

        // সার্ভার সাইড থেকে সিকিউর রিকোয়েস্ট (ইউজার কিছুই দেখতে পাবে না)
        const response = await fetch(targetUrl, {
          method: 'POST',
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Content-Type": "application/x-www-form-urlencoded",
            "Origin": "https://secure.incometax.gov.bd",
            "Referer": "https://secure.incometax.gov.bd/TinApplication/Index",
            "Cookie": "browserMismatched=true; browserChecked=true"
          },
          body: postData.toString(),
        });

        const text = await response.text();
        let jsonResponse;
        
        try {
          jsonResponse = JSON.parse(text);
        } catch (e) {
          jsonResponse = { error: "Invalid response" };
        }

        if (jsonResponse.ErrorMessage === 'Invalid National ID (NID)') {
          results.push({ phone, status: "Failed", message: "Invalid NID" });
        } else if (jsonResponse.success === false) {
          results.push({ phone, status: "Failed", message: jsonResponse.ErrorMessage || "Failed" });
        } else {
          results.push({ phone, status: "Verified", message: "Verified Successfully" });
        }

        // সার্ভার ব্লক এড়াতে ০.৫ সেকেন্ড বিরতি
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      return NextResponse.json({ success: true, data: results });
    }

    return NextResponse.json({ success: false, message: "Invalid Action" }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}