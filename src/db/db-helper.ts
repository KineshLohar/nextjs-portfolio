import connectDB from "@/db/connectDB";

export async function withDb<T>(fn: () => Promise<T>): Promise<T> {
  await connectDB();
  return fn();
}