"use server";
import { fetapi } from "@/services/api";
import { authError, authHeaders } from "@/services/auth";
import { AuthData } from "@/types";
import { cookies } from "next/headers";
import qs from "querystring";

export const createUserSession = async (response: Response) => {
  // Get the cookie from the response
  const cookie = response.headers.get("set-cookie");

  // Decode the cookie string into an object
  if (!cookie) {
    throw new Error("No cookie found in the response");
  }
  // Parse the cookie string into an object
  // The cookie string is in the format "name=value; Max-Age=0; Path=/; SameSite=Lax; HttpOnly; Secure"
  const cookieInfo = qs.decode(cookie as string, "; ", "=") as Record<
    string,
    string
  >;

  // Get the cookie name and value
  // The cookie name is the first key in the cookieInfo object
  const [cookieName, cookieValue] = Object.entries(cookieInfo)[0] as [
    string,
    string,
  ];

  // Set the cookie in the browser
  (await cookies()).set({
    name: cookieName,
    value: cookieValue,
    httpOnly: true, // this needs to be set to true manually because it is parsed with an empty string by the qs library
    maxAge: parseInt(cookieInfo["Max-Age"]),
    path: cookieInfo.Path,
    sameSite: cookieInfo.SameSite.toLowerCase() as "strict" | "lax" | "none",
    expires: new Date(cookieInfo.Expires),
    secure: true,
    domain: cookieInfo.Domain ?? undefined,
  });
};

export const getUserSession = async () => {
  try {
    const result = await fetapi.get<AuthData>("/auth/me", await authHeaders());

    return result.data;
  } catch (error) {
    return await authError(error);
  }
};
