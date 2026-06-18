import type {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";
import { ErrorHandler } from "../utils/errorsHandler.ts";
import { Error as MongooseError } from "mongoose";
import jwt from "jsonwebtoken";

interface AppErrors extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  code?: number;
  keyValue?: Record<string, any>;
  path?: string;
  errors?: Record<string, { message: string }>;
}
export const appErrorMiddleWare: ErrorRequestHandler = (
  err: AppErrors, //? Accepts native Errors or AppErrors
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = err;

  error.message = err.message || "Internal Server Error";
  error.statusCode = err.statusCode || 500;
  error.status = err.status || "error";

  //TODO MONGOOSE DUPLICATE KEY
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {}).join(", ");
    error = new ErrorHandler(
      `Duplicate value entered for ${field}`,
      400,
    ) as AppErrors;
  }

  //TODO MONGOOSE CAST ERROR
  if (err instanceof MongooseError.CastError) {
    error = new ErrorHandler(
      `Invalid ${err.path}: ${err.value}`,
      400,
    ) as AppErrors;
  }

  //TODO MONGOOSE VALIDATION ERROR
  if (err instanceof MongooseError.ValidationError) {
    const messages = Object.values(err.errors)
      .map((e: any) => e.message)
      .join(", ");

    error = new ErrorHandler(messages, 400) as AppErrors;
  }

  //TODO JWT ERRORS
  if (err instanceof jwt.JsonWebTokenError) {
    error = new ErrorHandler(
      "Invalid token. Please login again.",
      401,
    ) as AppErrors;
  }

  if (err instanceof jwt.TokenExpiredError) {
    error = new ErrorHandler(
      "Token expired. Please login again.",
      401,
    ) as AppErrors;
  }

  const statusCode = error.statusCode || 500;
  const status = error.status || "error";

  //TODO DEV MODE RESPONSE
  if (process.env.NODE_ENV === "development") {
    return res.status(statusCode).json({
      success: false,
      status,
      message: error.message,
      error,
      stack: error.stack,
    });
  }

  //TODO PROD MODE RESPONSE
  if (error.isOperational) {
    return res.status(statusCode).json({
      success: false,
      status,
      message: error.message,
      ...(error.errors && { errors: error.errors }),
    });
  }
  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(" ")
    : err.message;
  return res.status(statusCode).json({
    status,
    message: errorMessage,
  });
};
