import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // Basic validation check
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    // Mock Authentication
    if (password === "password123") {
      return NextResponse.json(
        {
          user: {
            id: "u-101",
            name: "John Doe",
            email: email,
          },
          token: "mock-jwt-auth-token",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "Invalid email or password. (Hint: use password123)" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}