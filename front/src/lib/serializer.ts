import type { Session } from "$state";

function replacer(key: string, value: unknown) {
  if (key === "selected") {
    return [...(value as Set<String>)];
  }
  return value;
}

function reviver(key: string, value: unknown) {
  if (key === "selected") {
    return new Set<String>(value as Array<String>);
  }
  return value;
}

export function formatSession(session: Session): string {
  return JSON.stringify(session, replacer);
}

export function parseSession(sessionStr: string): Session {
  return JSON.parse(sessionStr, reviver) as Session;
}
