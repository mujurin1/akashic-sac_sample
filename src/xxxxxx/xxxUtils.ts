
export const requireNonNull = <T>(x: T | undefined): T => {
  if (x == null)
    throw new Error("必須プロパティが`undefined`です");
  return x;
}
