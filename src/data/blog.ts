import type { Skill } from "./skills";

export type BlogReference =
  | { type: "skill"; value: Skill }
  | { type: "project"; value: string }
  | { type: "topic"; value: string };

export function getReferenceHref(reference: BlogReference): string {
  const query = new URLSearchParams({ [reference.type]: reference.value });
  return `/projects/?${query}`;
}
