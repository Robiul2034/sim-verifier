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
      if (!phone.trim()) continue;

      const postData = new URLSearchParams({
        'NID': nid,
        'DOB': dob,
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
      try { jsonResponse = JSON.parse(text); } catch (e) { jsonResponse = { error: "Invalid response" }; }

      if (jsonResponse.ErrorMessage === 'Invalid National ID (NID)') {
        results.push({ phone, success: false, message: "Invalid National ID (NID)", name: null });
      } else if (jsonResponse.success === false) {
        results.push({ phone, success: false, message: jsonResponse.ErrorMessage || "Verification failed", name: null });
      } else {
        results.push({ phone, success: true, message: "Biometric verification successfully!", name: jsonResponse.name || "Verified User" });
      }

      await new Promise(resolve => setTimeout(resolve, 500));
    }

    return NextResponse.json({ success: true, data: results });

  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
