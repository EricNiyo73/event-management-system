import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, context: RouteParams) {
  try {
    const { params } = await context;
    const event = await prisma.event.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Failed to fetch event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request, context: RouteParams) {
  try {
    const { params } = await context;
    const body = await request.json();

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const event = await prisma.event.update({
      where: {
        id: params.id,
      },
      data: {
        title: body.title,
        description: body.description,
        date: body.date,
        totalSeats: parseInt(body.totalSeats),
        availableSeats: parseInt(body.availableSeats),
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Failed to update event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, context: RouteParams) {
  try {
    const { params } = await context;

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existingEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await prisma.event.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Failed to delete event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
