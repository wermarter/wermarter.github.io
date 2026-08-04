import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

test("the site build publishes a populated LaTeX CV and its matching HTML preview", async () => {
  const [latex, preview, styles] = await Promise.all([
    readFile("dist/cv/cv.tex", "utf8"),
    readFile("dist/cv/index.html", "utf8"),
    readdir("dist/_astro").then(async (entries) =>
      (
        await Promise.all(
          entries
            .filter((entry) => entry.endsWith(".css"))
            .map((entry) => readFile(`dist/_astro/${entry}`, "utf8")),
        )
      ).join("\n"),
    ),
  ]);

  const sourceHash = createHash("sha256").update(latex).digest("hex");

  assert.match(latex, /\\textbf\{(?:\\Large )?Hà Minh Chiến\}/);
  assert.match(latex, /\\textbf\{Experience\}/);
  assert.match(latex, /\\usepackage\{fontspec\}/);
  assert.doesNotMatch(latex, /\{\{[^}]+\}\}/, "the hosted source must not expose template tokens");

  assert.match(preview, /<h1[^>]*>Hà Minh Chiến<\/h1>/);
  assert.match(preview, /<h2[^>]*>Experience<\/h2>/);
  assert.match(preview, /class="bf"><span class="Large">Hà Minh Chiến/);
  assert.match(preview, /--cv-font-size:\s*14\.612px/);
  assert.match(preview, /--cv-parindent:\s*0pt/);
  assert.match(preview, /--cv-padding-left:\s*1\.06cm/);
  assert.match(preview, /--cv-font-family:\s*&quot;Computer Modern Serif&quot;/);
  assert.match(styles, /@font-face\{font-family:Computer Modern Serif/);
  assert.match(styles, /\.cv-document \.bf\{font-weight:700\}/);
  assert.match(preview, new RegExp(`data-cv-source-hash="${sourceHash}"`));
  assert.match(preview, /href="\/cv\/cv\.tex"/);
  assert.match(preview, /href="\/cv\/cv\.pdf"/);
});

test("deployment compiles the generated source into an ignored hosted PDF", async () => {
  const [workflow, gitignore, packageJson] = await Promise.all([
    readFile(".github/workflows/deploy.yml", "utf8"),
    readFile(".gitignore", "utf8"),
    readFile("package.json", "utf8").then(JSON.parse),
  ]);

  assert.equal(packageJson.scripts["cv:source"], "tsx scripts/write-cv-source.ts tmp/cv/cv.tex");
  assert.match(workflow, /npm run cv:source[\s\S]+xu-cheng\/latex-action@v4[\s\S]+tmp\/cv\/cv\.pdf[\s\S]+public\/cv\/cv\.pdf[\s\S]+npm run build/);
  assert.match(workflow, /actions\/upload-pages-artifact@v4[\s\S]+path:\s*dist/);
  assert.match(gitignore, /^public\/cv\/cv\.pdf$/m);
});
