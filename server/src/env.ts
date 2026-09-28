import "dotenv/config";

export const PORT = Number(process.env.PORT ?? 4000);
export const JWT_SECRET = process.env.JWT_SECRET ?? "dev-only-secret-change-me";
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
