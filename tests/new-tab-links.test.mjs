import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("project and Markdown links open in a new tab", async () => {
  const projectPage = await readFile("dist/projects/diut/index.html", "utf8");
  const blogPost = await readFile("dist/blog/inside-diut-architecture/index.html", "utf8");

  assert.match(
    projectPage,
    /<a class="button project-detail__external" href="https:\/\/github\.com\/wermarter\/diut" target="_blank" rel="noopener noreferrer"[^>]*>Open project/,
  );
  assert.match(
    blogPost,
    /<a href="\/projects\/diut\/" target="_blank" rel="noopener noreferrer">DIUT<\/a>/,
  );
});
