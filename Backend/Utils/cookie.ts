import type { CookieOptions } from "express";

export type TimeUnit = "seconds" | "minutes" | "hours" | "days" | "weeks";

export interface CookieConfig {
  value: number;
  unit: TimeUnit;
}

export const getExpiryTime = ({ value, unit }: CookieConfig): number => {
  const multipliers: Record<TimeUnit, number> = {
    seconds: 1000,
    minutes: 1000 * 60,
    hours: 1000 * 60 * 60,
    days: 1000 * 60 * 60 * 24,
    weeks: 1000 * 60 * 60 * 24 * 7,
  };

  return value * multipliers[unit];
};

interface GenerateCookieOptionsParams {
  expiresIn?: CookieConfig;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: CookieOptions["sameSite"];
}

export const generateCookieOptions = ({
  expiresIn = {
    value: 7,
    unit: "days",
  },
  httpOnly = true,
  secure = process.env.NODE_ENV === "production",
  sameSite = "strict",
}: GenerateCookieOptionsParams = {}): CookieOptions => {
  const maxAge = getExpiryTime(expiresIn);

  return {
    httpOnly,
    secure,
    sameSite,
    maxAge,
    expires: new Date(Date.now() + maxAge),
  };
};
