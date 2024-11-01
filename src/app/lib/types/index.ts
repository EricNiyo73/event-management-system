export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  totalSeats: number;
  availableSeats: number;
  createdAt: string;
  updatedAt: string;
}

export interface Admin {
  id: string;
  email: string;
  password: string;
}

export interface Booking {
  id: string;
  eventId: string;
  userName: string;
  userEmail: string;
  numberOfSeats: number;
  createdAt: string;
}
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
  message: string;
}
