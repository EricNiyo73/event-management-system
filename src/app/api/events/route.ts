import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
// import { authMiddleware } from "@/app/lib/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        date: "asc",
      },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Log the raw request body for debugging
    const rawBody = await req.text();
    console.log("Raw request body:", rawBody);

    // Parse the JSON manually
    const body = JSON.parse(rawBody);
    console.log("Parsed request body:", body);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { title, description, date, totalSeats } = body;

    // Validate that required fields are present
    if (!title || !description || !date || !totalSeats) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date,
        totalSeats: parseInt(totalSeats),
        availableSeats: parseInt(totalSeats),
      },
    });

    console.log(event);
    return NextResponse.json({
      message: "Event created",
      event: event,
    });
  } catch (error) {
    console.error("Failed to create event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
