"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  totalSeats: number;
  availableSeats: number;
}

const EventListing = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingEvent, setBookingEvent] = useState<Event | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [seatCount, setSeatCount] = useState(1);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/events");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch events");
      }

      setEvents(data);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to load events",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBooking = async (eventId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/bookings/${eventId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, seatCount }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to book seats");
      }

      toast({ title: "Success", description: "Booking confirmed!" });
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === eventId
            ? { ...event, availableSeats: event.availableSeats - seatCount }
            : event
        )
      );
      setBookingEvent(null);
      resetForm();
    } catch (error) {
      toast({
        title: "Booking Error",
        description: error instanceof Error ? error.message : "Failed to book",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setSeatCount(1);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-500">Upcoming Events</h1>

      <div className="grid gap-6">
        {events.map((event) => (
          <Card key={event.id} className="w-full">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-blue-600">
                {event.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600">{event.description}</p>
                <div className="flex justify-between text-sm">
                  <span>Date: {new Date(event.date).toLocaleDateString()}</span>
                  <span
                    className={`font-semibold ${
                      event.availableSeats > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {event.availableSeats} seats available
                  </span>
                </div>
                <Button
                  className="w-full bg-blue-600"
                  disabled={event.availableSeats === 0}
                  onClick={() => setBookingEvent(event)}
                >
                  {event.availableSeats > 0 ? "Book Now" : "Sold Out"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {bookingEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-blue-600">
                Book Event: {bookingEvent.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleBooking(bookingEvent.id);
                }}
              >
                <div>
                  <Input
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Number of Seats"
                    min="1"
                    max={bookingEvent.availableSeats}
                    value={seatCount}
                    onChange={(e) => setSeatCount(Number(e.target.value))}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setBookingEvent(null)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600"
                    disabled={isLoading}
                  >
                    {isLoading ? "Booking..." : "Confirm Booking"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EventListing;
