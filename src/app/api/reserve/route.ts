import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createHash } from "crypto";

const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_HOURS = 1;

function hashIP(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 320;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = body.email?.trim().toLowerCase();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "unknown";
    const ipHash = hashIP(ip);

    // Rate limit check
    const windowStart = new Date(
      Date.now() - RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000
    ).toISOString();

    const { count } = await supabase
      .from("reservations")
      .select("*", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", windowStart);

    if (count !== null && count >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Check for existing reservation
    const { data: existing } = await supabase
      .from("reservations")
      .select("reservation_number")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json({
        reservationNumber: existing.reservation_number,
        isNew: false,
      });
    }

    // Insert new reservation
    const referrer = request.headers.get("referer") || null;

    const { data, error } = await supabase
      .from("reservations")
      .insert({
        email,
        ip_hash: ipHash,
        referrer,
      })
      .select("reservation_number")
      .single();

    if (error) {
      // Handle race condition: another request inserted the same email
      if (error.code === "23505") {
        const { data: raceExisting } = await supabase
          .from("reservations")
          .select("reservation_number")
          .eq("email", email)
          .single();

        if (raceExisting) {
          return NextResponse.json({
            reservationNumber: raceExisting.reservation_number,
            isNew: false,
          });
        }
      }

      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Something went wrong. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      reservationNumber: data.reservation_number,
      isNew: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
