import jwt, { type JwtPayload } from "jsonwebtoken";
import { ErrorHandler } from "./errorsHandler.ts";
export const verifyVerificationTokens = async (
  token: string | string[] | undefined,
): Promise<string | JwtPayload> => {
  try {
    const decodedToken = jwt.verify(
      token as string,
      process.env.JWT_SECRET_KEY as string,
    );
    if (!decodedToken) {
      new ErrorHandler("Invalid or expired verification token", 401);
    }
    return decodedToken;
  } catch (error: any) {
    throw new ErrorHandler(
      `Verification token verification failed: ${error.message}`,
      401,
    ); // Re-throw the error with a more descriptive message
  }
};
