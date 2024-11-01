"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "../zustand/zustand";
import { useRouter } from "next/navigation";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  totalSeats: number;
  availableSeats: number;
}

const AdminDashboard = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useAuth();
  const { setAuth } = useAuth();

  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page.",
        variant: "destructive",
      });
      router.push("/");
      setAuth("", null);
    } else {
      fetchEvents();
    }
  }, [user, router]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/events");
      console.log("response: " + response);
      const data = await response.json();
      console.log(data);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    const eventData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      date: formData.get("date") as string,
      totalSeats: Number(formData.get("totalSeats")),
    };

    try {
      let response;

      if (currentEvent) {
        response = await fetch(`/api/events/${currentEvent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...eventData,
            availableSeats: currentEvent.availableSeats,
          }),
        });
      } else {
        const token = useAuth.getState().token;
        response = await fetch("/api/events", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(eventData),
        });
      }

      const data = await response.json();
      console.log(response);
      console.log(data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to save event");
      }

      toast({
        title: "Success",
        description: currentEvent
          ? "Event updated successfully"
          : "Event created successfully",
      });

      await fetchEvents();
      setIsEditing(false);
      setCurrentEvent(null);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleDelete = async (eventId: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete event");
      }

      toast({
        title: "Success",
        description: "Event deleted successfully",
      });

      await fetchEvents();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Event Management</h1>
        <Button
          onClick={() => setIsEditing(true)}
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isLoading}
        >
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </div>

      <div className="grid gap-6">
        {events.map((event) => (
          <Card key={event.id} className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold">{event.title}</CardTitle>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setCurrentEvent(event);
                    setIsEditing(true);
                  }}
                  disabled={isLoading}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => handleDelete(event.id)}
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                <p className="text-sm text-gray-600">{event.description}</p>
                <div className="flex justify-between text-sm">
                  <span>Date: {new Date(event.date).toLocaleDateString()}</span>
                  <span>
                    Available Seats: {event.availableSeats}/{event.totalSeats}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {currentEvent ? "Edit Event" : "Add New Event"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <Input
                    name="title"
                    placeholder="Event Title"
                    defaultValue={currentEvent?.title}
                    required
                  />
                </div>
                <div>
                  <Textarea
                    name="description"
                    placeholder="Event Description"
                    defaultValue={currentEvent?.description}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    name="date"
                    type="date"
                    defaultValue={currentEvent?.date}
                    required
                  />
                  <Input
                    name="totalSeats"
                    type="number"
                    placeholder="Total Seats"
                    defaultValue={currentEvent?.totalSeats}
                    required
                    min="1"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setCurrentEvent(null);
                    }}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600"
                    disabled={isLoading}
                  >
                    {isLoading
                      ? "Loading..."
                      : currentEvent
                      ? "Update"
                      : "Create"}{" "}
                    Event
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

export default AdminDashboard;
