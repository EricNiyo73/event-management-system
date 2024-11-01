import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar, Users, Clock, Award } from "lucide-react";

export default function HomePage() {
  const features = [
    {
      icon: <Calendar className="h-6 w-6 text-blue-600" />,
      title: "Easy Booking",
      description: "Book your spot in upcoming events with just a few clicks",
    },
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: "Real-time Availability",
      description: "See available seats and book instantly",
    },
    {
      icon: <Clock className="h-6 w-6 text-blue-600" />,
      title: "Instant Confirmation",
      description: "Receive immediate confirmation for your bookings",
    },
    {
      icon: <Award className="h-6 w-6 text-blue-600" />,
      title: "Quality Events",
      description: "Curated selection of high-quality events",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Discover and Book Amazing Events
            </h1>
            <p className="text-xl mb-8">
              Find and book your spot at the most exciting events in your area
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/bookings">
                <Button
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  Browse Events
                </Button>
              </Link>
              <Link href="/admin">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-blue-600 hover:bg-white hover:text-blue-600"
                >
                  Manage Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Our Platform
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to start managing events?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Create and manage your events with our easy-to-use platform
          </p>
          <Link href="/bookings">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
