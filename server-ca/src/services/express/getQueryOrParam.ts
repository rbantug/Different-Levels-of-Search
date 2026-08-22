import type { ParsedQs } from "qs";
import AppError from "../../errors/AppError.js";

/**
 * This is meant to ensure that the route param is a string on runtime. This will also stop typescript from complaining.
 */
export function getRequiredParam({
  params,
  name,
}: {
  params: Record<string, string | string[] | undefined>;
  name: string;
}) {
  const value = params[name];

  if (typeof value !== "string" || !value) {
    throw new AppError(`${value} is required`, 400);
  }

  return value;
}

/**
 * This will force the query to be a string on runtime. This will also stop typescript from complaining.
 */
export function getRequiredQuery({
  query,
  name,
}: {
  query: ParsedQs;
  name: string;
}): string {
  const value = query[name];

  if (typeof value !== "string" || !value.trim()) {
    throw new AppError(`${name} is required`, 400);
  }

  return value.trim();
}
