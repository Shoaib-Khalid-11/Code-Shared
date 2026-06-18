import type { Response, CookieOptions } from "express";
import { generateCookieOptions } from "./cookie.ts";

interface SendCookieParams<T> {
  res: Response;
  name: string;
  token: string;
  tokenResponse?: boolean; // If true, the token will be sent in the response body
  user?: T;
  message?: string;
  statusCode?: number;
  cookieOptions?: CookieOptions;
}

export const sendCookie = <T>({
  res,
  name,
  token,
  tokenResponse = false,
  user,
  message = "Success",
  statusCode = 200,
  cookieOptions = generateCookieOptions(),
}: SendCookieParams<T>) => {
  return res
    .status(statusCode)
    .cookie(name, token, cookieOptions)
    .json({
      success: true,
      message,
      token: tokenResponse ? token : undefined, // Only send the token if tokenResponse is true
      user,
    });
};
