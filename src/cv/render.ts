import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import {
  allProjects,
  certifications,
  education,
  experience,
  personalProjects,
  profile,
} from "../data/personal";
import { countSkillUsage } from "../data/skills";
import { formatMonthYear, formatPeriod } from "../utils/calendar";

export interface CvArtifacts {
  html: string;
  latex: string;
  previewStyle: string;
  sourceHash: string;
}

export type CvSource = Omit<CvArtifacts, "html" | "previewStyle">;

interface CvPreview {
  html: string;
  style: string;
}

const TEMPLATE_PATH = resolve(process.cwd(), "src/cv/template.tex");
const require = createRequire(import.meta.url);
const latexJsModule = require.resolve("latex.js");
const LATEX_JS_CLI = resolve(dirname(latexJsModule), "../bin/latex.js");
const HTML_FILL_MARKER = "CVHTMLFILLMARKER";
const HTML_RULE_MARKER = "CVHTMLRULEMARKER";
const CSS_DIMENSION =
  /^-?(?:\d+(?:\.\d+)?|\.\d+)(?:cm|em|ex|in|mm|pc|pt|px|rem|%)$/;

const latexEscapes: Readonly<Record<string, string>> = {
  "\\": "\\textbackslash{}",
  "{": "\\{",
  "}": "\\}",
  "#": "\\#",
  "$": "\\$",
  "%": "\\%",
  "&": "\\&",
  "_": "\\_",
  "~": "\\textasciitilde{}",
  "^": "\\textasciicircum{}",
};

const escapeLatex = (value: string) => value.replace(/[\\{}#$%&_~^]/g, (character) => latexEscapes[character]);

const displayUrl = (value: string) => value.replace(/^https?:\/\/(?:www\.)?/, "").replace(/\/$/, "");

const link = (url: string, label = displayUrl(url)) => `\\href{${url}}{${escapeLatex(label)}}`;

const formatIsoMonth = (value: string) => {
  const [year, month] = value.split("-").map(Number);
  return formatMonthYear(month as Parameters<typeof formatMonthYear>[0], year);
};

const renderContact = () =>
  [
    escapeLatex(profile.location),
    `\\href{mailto:${profile.email}}{${escapeLatex(profile.email)}}`,
    link(profile.links.github, "GitHub"),
    link(profile.links.linkedin, "LinkedIn"),
  ].join(" \\textbullet{} ");

const renderEducation = () =>
  education
    .map(
      (item) => `\\textbf{${escapeLatex(item.institution)}}

${escapeLatex(item.program)}, score: ${escapeLatex(item.score)} \\hfill ${formatIsoMonth(item.start)} -- ${formatIsoMonth(item.end)}`,
    )
    .join("\n\n\\vspace{8pt}\n\n");

const selectHighlights = (role: (typeof experience)[number]) => {
  const recentProjects = role.projects.toReversed();
  const highlights: string[] = [];

  for (const project of recentProjects) {
    const [firstAchievement] = project.achievements;
    if (firstAchievement) highlights.push(firstAchievement);
  }

  for (const project of recentProjects) {
    highlights.push(...project.achievements.slice(1));
  }

  highlights.push(...role.summary);

  return highlights.slice(0, 3);
};

const renderList = (items: readonly string[]) => `\\begin{itemize}[noitemsep, topsep=0pt, partopsep=0pt, parsep=0pt]
${items.map((item) => `    \\item ${escapeLatex(item)}`).join("\n")}
\\end{itemize}`;

const renderExperience = () =>
  experience
    .slice(0, 4)
    .map(
      (role) => `\\textbf{${escapeLatex(role.company)}}

\\textbf{${escapeLatex(role.title)}} \\hfill ${formatPeriod(role).replace(" — ", " -- ")}
${renderList(selectHighlights(role))}`,
    )
    .join("\n\n\\vspace{10pt}\n\n");

const renderActivities = () =>
  personalProjects
    .map(
      (project) => `\\textbf{${escapeLatex(project.name)}} \\hfill ${link(project.url ?? profile.links.github)}

\\textbf{${escapeLatex(project.roles.join(" / "))}} \\hfill ${formatPeriod(project).replace(" — ", " -- ")}
${renderList(project.achievements.slice(0, 2))}`,
    )
    .join("\n\n\\vspace{8pt}\n\n");

const renderSkills = () => {
  const usage = countSkillUsage(allProjects);
  const technical = Object.entries(usage)
    .filter(([, count]) => count > 0)
    .sort(([leftSkill, leftCount], [rightSkill, rightCount]) => rightCount - leftCount || leftSkill.localeCompare(rightSkill))
    .slice(0, 14)
    .map(([skill]) => skill)
    .join(", ");
  const languageScores = certifications.map(({ name, score }) => `${name} ${score}`).join(", ");

  return `\\textbf{Technical:} ${escapeLatex(technical)}

\\textbf{Language credentials:} ${escapeLatex(languageScores)}`;
};

const populateTemplate = (template: string) => {
  const values: Readonly<Record<string, string>> = {
    name: escapeLatex(profile.name),
    contact: renderContact(),
    education: renderEducation(),
    experience: renderExperience(),
    activities: renderActivities(),
    skills: renderSkills(),
  };

  const populated = template.replace(/\{\{\s*([a-z]+)\s*\}\}/g, (_token, name: string) => {
    const value = values[name];
    if (value === undefined) throw new Error(`Unknown CV template token: ${name}`);
    return value;
  });

  const unresolved = populated.match(/\{\{[^}]+\}\}/)?.[0];
  if (unresolved) throw new Error(`Unresolved CV template token: ${unresolved}`);

  return populated.endsWith("\n") ? populated : `${populated}\n`;
};

const semanticPreviewSource = (latex: string) => {
  const documentClass =
    latex.match(/\\documentclass(?:\[[^\]]*\])?\{[^{}]+\}/)?.[0] ??
    "\\documentclass{article}";
  const documentBody = latex.match(/\\begin\{document\}([\s\S]*)\\end\{document\}/)?.[1];
  if (!documentBody) throw new Error("The CV template must contain a LaTeX document body");

  const normalizedBody = documentBody
    .replace(/\\hrulefill\b/g, HTML_RULE_MARKER)
    .replace(/\\hfill\b/g, HTML_FILL_MARKER)
    .replace(/\\begin\{itemize\}\[[^\]]+\]/g, "\\begin{itemize}")
    .replace(
      /\\begin\{center\}\s*\\textbf\{([^{}]+)\}\s*\\end\{center\}/g,
      (_block, title: string) => `\\section*{${title}}`,
    );

  return `${documentClass}
\\usepackage{hyperref}
\\begin{document}
${normalizedBody}
\\end{document}`;
};

const readLatexLength = (latex: string, name: string) => {
  const value = latex
    .match(new RegExp(`\\\\setlength\\{\\\\${name}\\}\\{([^{}]+)\\}`))?.[1]
    ?.trim();
  return value && CSS_DIMENSION.test(value) ? value : undefined;
};

const readGeometry = (latex: string) => {
  const options = latex.match(/\\usepackage\[([^\]]+)\]\{geometry\}/)?.[1];
  if (!options) return new Map<string, string>();

  return new Map(
    options
      .split(",")
      .map((option) => option.split("=").map((part) => part.trim()))
      .filter(
        (entry): entry is [string, string] =>
          entry.length === 2 && CSS_DIMENSION.test(entry[1]),
      ),
  );
};

const previewStyle = (latex: string, documentStyle: string) => {
  const styles = new Map<string, string>();
  const documentFontSize = documentStyle
    .match(/(?:^|;)\s*--size:\s*([^;]+)/)?.[1]
    ?.trim();
  if (documentFontSize && CSS_DIMENSION.test(documentFontSize)) {
    styles.set("--cv-font-size", documentFontSize);
  }

  const parindent = readLatexLength(latex, "parindent");
  if (parindent) styles.set("--cv-parindent", parindent);

  const parskip = readLatexLength(latex, "parskip");
  if (parskip) styles.set("--cv-parskip", parskip);

  const geometry = readGeometry(latex);
  const margin = geometry.get("margin");
  for (const side of ["top", "right", "bottom", "left"] as const) {
    const value = geometry.get(side) ?? margin;
    if (value) styles.set(`--cv-padding-${side}`, value);
  }

  const options =
    latex
      .match(/\\documentclass(?:\[([^\]]*)\])?\{article\}/)?.[1]
      ?.split(",")
      .map((option) => option.trim()) ?? [];
  const paper = options.includes("a4paper") ? ["210mm", "297mm"] : ["8.5in", "11in"];
  if (options.includes("landscape")) paper.reverse();
  styles.set("--cv-page-width", paper[0]);
  styles.set("--cv-page-height", paper[1]);
  styles.set("--cv-font-family", '"Computer Modern Serif"');

  const fontFamily = latex
    .match(/\\setmainfont(?:\[[^\]]*\])?\{([^{}]+)\}/)?.[1]
    ?.trim();
  if (fontFamily && /^[\p{L}\p{N} ._-]+$/u.test(fontFamily)) {
    styles.set("--cv-font-family", `"${fontFamily}"`);
  }

  return [...styles].map(([property, value]) => `${property}: ${value}`).join("; ");
};

const convertLatexToHtml = (latex: string) =>
  new Promise<CvPreview>((resolvePromise, rejectPromise) => {
    const child = spawn(process.execPath, [LATEX_JS_CLI, "--no-hyphenation"], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"],
    });
    let stdout = "";
    let stderr = "";

    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (chunk: string) => {
      stdout += chunk;
    });
    child.stderr.on("data", (chunk: string) => {
      stderr += chunk;
    });
    child.on("error", rejectPromise);
    child.on("close", (code) => {
      if (code === 0) {
        const documentStyle = stdout.match(/<html(?:\s+style="([^"]*)")?>/)?.[1] ?? "";
        const documentBody = stdout.match(/<body>([\s\S]*)<\/body>/)?.[1];
        if (!documentBody) {
          rejectPromise(new Error("LaTeX preview conversion did not return an HTML body"));
          return;
        }

        resolvePromise({
          html: documentBody
            .replaceAll(HTML_FILL_MARKER, '<span class="cv-fill" aria-hidden="true"></span>')
            .replaceAll(HTML_RULE_MARKER, '<span class="cv-rule" aria-hidden="true"></span>'),
          style: previewStyle(latex, documentStyle),
        });
        return;
      }
      rejectPromise(new Error(`LaTeX preview conversion failed (${code ?? "unknown"}): ${stderr.trim()}`));
    });
    child.stdin.end(semanticPreviewSource(latex));
  });

export async function getCvSource(): Promise<CvSource> {
  const template = await readFile(TEMPLATE_PATH, "utf8");
  const latex = populateTemplate(template);

  return {
    latex,
    sourceHash: createHash("sha256").update(latex).digest("hex"),
  };
}

export async function getCvArtifacts(): Promise<CvArtifacts> {
  const source = await getCvSource();
  const preview = await convertLatexToHtml(source.latex);

  return {
    ...source,
    html: preview.html,
    previewStyle: preview.style,
  };
}
