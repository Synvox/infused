import dotenv from "dotenv";
import postgres from "postgres";
//@ts-expect-error
import prexit from "prexit";

dotenv.config();

prexit(() => {
  sql.end({ timeout: 5 });
});

const sql = postgres({
  transform: {
    column: { to: postgres.fromCamel, from: postgres.toCamel },
    value: {
      from: (v) => {
        if (typeof v === "object") return transformKeys(v, toCamelCase);
        return v;
      },
    },
  },
});
//@ts-expect-error
if (global.sql) {
  //@ts-expect-error
  global.sql.end();
}
//@ts-expect-error
global.sql = sql;

export default sql;

function transformKeys(obj: any, method: (word: string) => string): any {
  if (typeof obj !== "object" || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map((item) => transformKeys(item, method));

  if (obj instanceof Date) return obj;

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      method(key),
      transformKeys(value, method),
    ])
  );
}

const toCamelCase = (str: string = "") =>
  str.replace(/(?<!_)(_([^_]))/g, (_1, _2, r) => r.toUpperCase());
