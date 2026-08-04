import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { getCvSource } from "../src/cv/render";

const outputArgument = process.argv[2];
if (!outputArgument) throw new Error("Usage: write-cv-source <output.tex>");

const outputPath = resolve(process.cwd(), outputArgument);
const { latex } = await getCvSource();

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, latex, "utf8");

console.log(`Generated ${outputPath}`);
