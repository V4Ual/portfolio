import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_dev_32_characters_long_min";
const secretKey = new TextEncoder().encode(JWT_SECRET);
const COOKIE_NAME = "portfolio_admin_session";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function createSessionToken(user: SessionUser): Promise<string> {
  return await new SignJWT({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function verifySessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as SessionUser;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifySessionToken(token);
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  } catch (err) {
    console.error("Failed to set session cookie:", err);
  }
}

export async function clearSessionCookie() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
  } catch (err) {
    console.error("Failed to clear session cookie:", err);
  }
}

export async function authenticateAdmin(email: string, password: string):Promise<{ success: boolean; user?: SessionUser; error?: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: "Invalid email or password." };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return { success: false, error: "Invalid email or password." };
    }

    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = await createSessionToken(sessionUser);
    await setSessionCookie(token);

    return { success: true, user: sessionUser };
  } catch (error) {
    console.error("Authentication error:", error);
    return { success: false, error: "An unexpected error occurred during login." };
  }
}
