export function encodeArguments(args: any[]): string {
  if (args.length === 0) {
    return "[]";
  }
  return encodeURIComponent(JSON.stringify(args));
}

export function decodeArguments(serialized: string | null): any[] {
  if (serialized === null) {
    return [];
  }
  return JSON.parse(decodeURIComponent(serialized));
}
