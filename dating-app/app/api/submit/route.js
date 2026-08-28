import { NextResponse } from "next/server";
import crypto from "crypto";
import { getDb } from "@/lib/mongodb";
import { sendVerificationEmail } from "@/lib/mailer";

export async function POST(request) {
  try {
    const { codeName, email, gender, remarks } = await request.json();

    if (!codeName || !email) {
      return NextResponse.json(
        { error: "Code name and email are required." },
        { status: 400 }
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const signups = db.collection("signups");

    const existing = await signups.findOne({ email });
    if (existing?.verified) {
      return NextResponse.json(
        { error: "This email is already verified." },
        { status: 400 }
      );
    }

    const token = crypto.randomBytes(24).toString("hex");

    // Upsert so re-submitting with the same email just refreshes the token.
    await signups.updateOne(
      { email },
      {
        $set: {
  codeName,
  email,
  gender: gender || "",
  remarks: remarks || "",
  verified: false,
  token,
  updatedAt: new Date(),
},
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    await sendVerificationEmail({ to: email, codeName, token });

    return NextResponse.json({ message: "Check your inbox to verify your email." });
  } catch (err) {
    console.error("Submit error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
