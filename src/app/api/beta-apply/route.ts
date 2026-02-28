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
    const firstName = body.firstName?.trim();
    const lastName = body.lastName?.trim();
    const email = body.email?.trim().toLowerCase();
    const phone = body.phone?.trim() || null;
    const city = body.city?.trim();
    const state = body.state?.trim() || null;
    const country = body.country?.trim();
    const screenTime = body.screenTime?.trim();
    const occupation = body.occupation?.trim() || null;
    const age = body.age?.trim();
    const gender = body.gender?.trim() || null;

    // Validate required fields
    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "First and last name are required." },
        { status: 400 }
      );
    }

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!city || !country) {
      return NextResponse.json(
        { error: "City and country are required." },
        { status: 400 }
      );
    }

    if (!screenTime || !age) {
      return NextResponse.json(
        { error: "Screen time and age are required." },
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
      .from("beta_applications")
      .select("*", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("created_at", windowStart);

    if (count !== null && count >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    // Check for existing application
    const { data: existing } = await supabase
      .from("beta_applications")
      .select("first_name")
      .eq("email", email)
      .single();

    if (existing) {
      return NextResponse.json({
        firstName: existing.first_name,
        isNew: false,
      });
    }

    // Insert new application
    const referrer = request.headers.get("referer") || null;

    const { data, error } = await supabase
      .from("beta_applications")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        city,
        state,
        country,
        screen_time: screenTime,
        occupation,
        age,
        gender,
        ip_hash: ipHash,
        referrer,
      })
      .select("first_name")
      .single();

    if (error) {
      // Handle race condition: another request inserted the same email
      if (error.code === "23505") {
        const { data: raceExisting } = await supabase
          .from("beta_applications")
          .select("first_name")
          .eq("email", email)
          .single();

        if (raceExisting) {
          return NextResponse.json({
            firstName: raceExisting.first_name,
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
      firstName: data.first_name,
      isNew: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
