import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nid, dob, phones } = body;

    if (!nid || !dob || !phones || !Array.isArray(phones)) {
      return NextResponse.json({ success: false, message: "Invalid input." }, { status: 400 });
    }

    const results = [];
    const targetUrl = "https://secure.incometax.gov.bd/TinApplication/VerifyMobileAgainstNid";

    for (const phone of phones) {
      if (!phone.trim()) continue; // ফাঁকা ইনপুট স্কিপ করবে

      const postData = new URLSearchParams({
        'NID': nid,
        'DOB': dob, // ফরম্যাট হবে YYYY-MM-DD
        'mobileNumber': phone.trim()
      });

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
        results.push({ phone, status: "Failed", message: "Invalid National ID (NID)" });
      } else if (jsonResponse.success === false) {
        results.push({ phone, status: "Failed", message: jsonResponse.ErrorMessage || "Verification failed" });
      } else {
        results.push({ phone, status: "Verified", message: "Matches" });
      }

      // সার্ভার ব্লক এড়াতে ০.৫ সেকেন্ড বিরতি
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return NextResponse.json({ success: true, data: results });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
