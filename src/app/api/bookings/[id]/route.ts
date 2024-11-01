import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
interface IParams {
  params: Promise<{ id: string }>;
}
export async function POST(request: Request, { params }: IParams) {
  try {
    const body = await request.json();
    const { name, email, seatCount } = body;
    const { id: eventId } = await params;

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event || event.availableSeats <= 0) {
      return NextResponse.json(
        { error: "No seats available or event not found" },
        { status: 400 }
      );
    }
    const booking = await prisma.booking.create({
      data: {
        eventId: eventId,
        name,
        email,
        seatCount,
      },
      select: {
        id: true,
        email: true,
        name: true,
        seatCount: true,
      },
    });
    const updatedEvent = await prisma.event.update({
      where: { id: eventId },
      data: { availableSeats: { decrement: seatCount } },
    });

    return NextResponse.json({ booking, updatedEvent });
  } catch (error) {
    console.error("Booking failed:", error);
    return NextResponse.json({ error: "Failed to book seat" }, { status: 500 });
  }
}
