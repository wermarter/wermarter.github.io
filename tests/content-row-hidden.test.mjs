import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("filtered content rows honor the hidden attribute", async () => {
  const contentRow = await readFile("src/components/ContentRow.astro", "utf8");

  assert.match(
    contentRow,
    /\.content-row\[hidden\]\s*\{[^}]*display:\s*none;/s,
    "ContentRow's grid display must not override the hidden attribute used by project filters",
  );
});
