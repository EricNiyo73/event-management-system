import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "my_jwt_secret";

export const generateToken = (payload: any) => {
  return jwt.sign({ payload }, JWT_SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string };
  } catch (error) {
    return null;
  }
};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return bcrypt.compare(password, hashedPassword);
};
