import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync, copyFileSync } from "node:fs";
import { extname, join, normalize, relative, resolve, sep } from "node:path";
import { inflateRawSync } from "node:zlib";

const root = process.cwd();
const config = JSON.parse(readFileSync(resolve(root, "config/content/publisher.config.json"), "utf8"));
const port = Number(process.env.CONTENT_APP_PORT || 4177);
const importsRoot = resolve(root, "imports/activities");
const staticRoot = resolve(root, "tools/publisher");

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};

function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, { "Content-Type": type });
  res.end(typeof body === "string" ? body : JSON.stringify(body, null, 2));
}

function readBody(req) {
  return new Promise((resolveBody, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolveBody(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

function safeJoin(base, target) {
  const resolved = resolve(base, target);
  if (!resolved.startsWith(resolve(base) + sep) && resolved !== resolve(base)) {
    throw new Error("허용되지 않은 파일 경로입니다.");
  }
  return resolved;
}

function parseMultipart(buffer, contentType) {
  const match = /boundary=(?:"([^"]+)"|([^;]+))/i.exec(contentType || "");
  if (!match) throw new Error("multipart boundary를 찾을 수 없습니다.");
  const boundary = Buffer.from(`--${match[1] || match[2]}`);
  const parts = [];
  let start = buffer.indexOf(boundary);
  while (start !== -1) {
    start += boundary.length;
    if (buffer[start] === 45 && buffer[start + 1] === 45) break;
    if (buffer[start] === 13 && buffer[start + 1] === 10) start += 2;
    const headerEnd = buffer.indexOf(Buffer.from("\r\n\r\n"), start);
    if (headerEnd === -1) break;
    const rawHeaders = buffer.slice(start, headerEnd).toString("utf8");
    let dataStart = headerEnd + 4;
    let next = buffer.indexOf(boundary, dataStart);
    if (next === -1) break;
    let dataEnd = next - 2;
    if (dataEnd < dataStart) dataEnd = next;
    const disposition = /content-disposition:\s*form-data;\s*([^\r\n]+)/i.exec(rawHeaders)?.[1] || "";
    const name = /name="([^"]+)"/i.exec(disposition)?.[1] || "";
    const filename = /filename="([^"]*)"/i.exec(disposition)?.[1] || "";
    parts.push({ name, filename, data: buffer.slice(dataStart, dataEnd), headers: rawHeaders });
    start = next;
  }
  return parts;
}

function decodeZipName(buffer, utf8) {
  return buffer.toString(utf8 ? "utf8" : "latin1");
}

function extractZip(buffer, depth = 0) {
  const entries = [];
  let eocd = -1;
  for (let index = buffer.length - 22; index >= 0; index -= 1) {
    if (buffer.readUInt32LE(index) === 0x06054b50) {
      eocd = index;
      break;
    }
  }
  if (eocd === -1) throw new Error("ZIP 중앙 디렉터리를 찾지 못했습니다.");

  const entryCount = buffer.readUInt16LE(eocd + 10);
  let offset = buffer.readUInt32LE(eocd + 16);
  for (let index = 0; index < entryCount; index += 1) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) break;
    const flags = buffer.readUInt16LE(offset + 8);
    const method = buffer.readUInt16LE(offset + 10);
    const compressedSize = buffer.readUInt32LE(offset + 20);
    const fileNameLength = buffer.readUInt16LE(offset + 28);
    const extraLength = buffer.readUInt16LE(offset + 30);
    const commentLength = buffer.readUInt16LE(offset + 32);
    const localHeaderOffset = buffer.readUInt32LE(offset + 42);
    const fileName = decodeZipName(buffer.slice(offset + 46, offset + 46 + fileNameLength), Boolean(flags & 0x0800));
    offset += 46 + fileNameLength + extraLength + commentLength;

    if (!fileName || fileName.endsWith("/")) continue;
    if (buffer.readUInt32LE(localHeaderOffset) !== 0x04034b50) continue;

    const localFileNameLength = buffer.readUInt16LE(localHeaderOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localHeaderOffset + 28);
    const dataStart = localHeaderOffset + 30 + localFileNameLength + localExtraLength;
    const compressed = buffer.slice(dataStart, dataStart + compressedSize);
    let data;
    if (method === 0) data = compressed;
    if (method === 8) data = inflateRawSync(compressed);
    if (!data) continue;

    if (fileName.toLowerCase().endsWith(".zip") && depth < 3) {
      entries.push(...extractZip(data, depth + 1));
    } else {
      entries.push({ name: fileName, data });
    }
  }
  return entries;
}

function normalizeTerms(text) {
  return text
    .replaceAll("부당 노동 행위", "부당노동행위")
    .replaceAll("근로 시간 면제자", "근로시간면제자")
    .replaceAll("노사 협의회", "노사협의회");
}

function stripFrontmatter(markdown) {
  return markdown.replace(/^---[\s\S]*?---\s*/, "");
}

function extractTitle(markdown, fallback) {
  return /^\uFEFF?\s*#\s+(.+)$/m.exec(markdown)?.[1].trim() || fallback.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");
}

function extractDate(markdown) {
  const iso = /\b(20\d{2})[-./](0?[1-9]|1[0-2])[-./](0?[1-9]|[12]\d|3[01])\b/.exec(markdown);
  if (iso) return `${iso[1]}-${iso[2].padStart(2, "0")}-${iso[3].padStart(2, "0")}`;
  const korean = /(20\d{2})년\s*(0?[1-9]|1[0-2])월\s*(0?[1-9]|[12]\d|3[01])일/.exec(markdown);
  if (korean) return `${korean[1]}-${korean[2].padStart(2, "0")}-${korean[3].padStart(2, "0")}`;
  return new Date().toISOString().slice(0, 10);
}

function summarize(markdown) {
  const line = stripFrontmatter(markdown)
    .split(/\r?\n/)
    .map((value) => value.trim())
    .find((value) => value && !value.startsWith("#") && !value.startsWith("!") && !value.startsWith("|"));
  return (line || "활동보고 원문을 홈페이지 게시 형식으로 변환한 초안입니다.").slice(0, 120);
}

function slugify(title, date) {
  const ascii = title
    .toLowerCase()
    .replace(/20\d{2}년?\s*/, "")
    .replace(/[^\w\s가-힣-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  const hash = createHash("sha1").update(title).digest("hex").slice(0, 6);
  return `${date}-${ascii || "activity-report"}-${hash}`.slice(0, 80);
}

function suggestTags(markdown, date) {
  const tags = new Set(["활동보고", date.slice(0, 4)]);
  const month = Number(date.slice(5, 7));
  tags.add(`${month}월`);
  ["노사협의회", "부당노동행위", "교육", "간담회", "연대", "위원회"].forEach((keyword) => {
    if (markdown.includes(keyword)) tags.add(keyword);
  });
  return [...tags];
}

function toYamlArray(values) {
  return values.map((value) => `  - "${value.replaceAll('"', '\\"')}"`).join("\n");
}

function rewriteImages(markdown, imageMap, slug) {
  let rewritten = markdown;
  for (const [original, targetName] of imageMap.entries()) {
    const escaped = original.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    rewritten = rewritten.replace(new RegExp(escaped, "g"), `../../images/activities/${slug}/${targetName}`);
  }
  return rewritten;
}

function convertBody(markdown) {
  const body = normalizeTerms(stripFrontmatter(markdown))
    .replace(/^\uFEFF?\s*#\s+.+\r?\n?/, "")
    .replace(/^#{1,6}\s+/gm, "### ")
    .trim();
  return `## 요약\n\n${summarize(markdown)}\n\n## 주요 활동\n\n${body || "### 활동 내역\n\n- 원문 내용을 확인해 활동 내역을 보완해 주세요."}\n`;
}

function buildMarkdown({ title, date, summary, author, tags, slug, sourceUrl, body }) {
  const sourceLine = sourceUrl ? `sourceUrl: "${sourceUrl.replaceAll('"', '\\"')}"\n` : "";
  return `---\ntitle: "${title.replaceAll('"', '\\"')}"\ndate: ${date}\ncategory: "${config.defaultCategory}"\nsummary: "${summary.replaceAll('"', '\\"')}"\nauthor: "${author.replaceAll('"', '\\"')}"\nthumbnail: ""\npinned: false\ntags:\n${toYamlArray(tags)}\ndraft: true\nslug: "${slug}"\n${sourceLine}---\n\n${body.trim()}\n`;
}

function parseFrontmatter(markdown) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(markdown);
  if (!match) return {};
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const pair = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
    if (pair) data[pair[1]] = pair[2].replace(/^"|"$/g, "");
  }
  return data;
}

function listActivitySlugs() {
  const dir = resolve(root, config.contentRoot);
  if (!existsSync(dir)) return new Set();
  return new Set(
    readdirSync(dir)
      .filter((name) => name.endsWith(".md"))
      .map((name) => {
        const markdown = readFileSync(join(dir, name), "utf8");
        return parseFrontmatter(markdown).slug || name.replace(/\.md$/, "");
      })
  );
}

function validateMarkdown(markdown, slug) {
  const issues = [];
  const fm = parseFrontmatter(markdown);
  ["title", "date", "category", "summary", "author", "slug"].forEach((key) => {
    if (!fm[key]) issues.push({ level: "error", message: `Frontmatter ${key} 값이 필요합니다.` });
  });
  if (fm.date && !/^\d{4}-\d{2}-\d{2}$/.test(fm.date)) {
    issues.push({ level: "error", message: "date는 YYYY-MM-DD 형식이어야 합니다." });
  }
  if (slug && listActivitySlugs().has(slug)) {
    issues.push({ level: "error", message: `slug가 이미 존재합니다: ${slug}` });
  }
  if (!/^---[\s\S]*?---/.test(markdown)) issues.push({ level: "error", message: "Frontmatter 블록이 없습니다." });
  if (/^#\s+/m.test(stripFrontmatter(markdown))) issues.push({ level: "warn", message: "본문 H1은 피하고 H2/H3 구조를 사용하세요." });
  for (const image of markdown.matchAll(/!\[[^\]]*]\(([^)]+)\)/g)) {
    const url = image[1];
    if (url.startsWith("http")) continue;
    const normalizedUrl = url.replace(/^(\.\.\/)+/, "");
    const candidate = resolve(root, "public", normalizedUrl.replace(/^images\//, "images/"));
    if (!existsSync(candidate)) issues.push({ level: "warn", message: `이미지 경로 확인 필요: ${url}` });
  }
  if (!("sourceUrl" in fm)) issues.push({ level: "info", message: "원문 URL이 있으면 sourceUrl에 기록할 수 있습니다." });
  return issues;
}

function prepareUpload(parts) {
  const file = parts.find((part) => part.name === "file" && part.filename);
  const sourceUrl = parts.find((part) => part.name === "sourceUrl")?.data.toString("utf8").trim() || "";
  if (!file) throw new Error("업로드 파일이 없습니다.");

  const sessionId = `${Date.now()}-${createHash("sha1").update(file.data).digest("hex").slice(0, 8)}`;
  const importDir = resolve(importsRoot, sessionId);
  mkdirSync(importDir, { recursive: true });

  let markdown = "";
  const images = new Map();
  if (file.filename.toLowerCase().endsWith(".zip")) {
    const entries = extractZip(file.data);
    const markdownEntry = entries.find((entry) => entry.name.toLowerCase().endsWith(".md"));
    if (!markdownEntry) throw new Error("ZIP 안에서 Markdown 파일을 찾지 못했습니다.");
    markdown = markdownEntry.data.toString("utf8");
    for (const entry of entries) {
      const extension = extname(entry.name).toLowerCase();
      if (![".png", ".jpg", ".jpeg", ".webp", ".gif"].includes(extension)) continue;
      const originalName = entry.name.replaceAll("\\", "/");
      const targetName = originalName.split("/").pop()?.replace(/[^\w.-]/g, "-") || `image${extension}`;
      const importImagePath = safeJoin(importDir, targetName);
      writeFileSync(importImagePath, entry.data);
      images.set(originalName, targetName);
    }
  } else {
    markdown = file.data.toString("utf8");
  }

  const title = extractTitle(markdown, file.filename);
  const date = extractDate(markdown);
  const slug = slugify(title, date);
  const summary = summarize(markdown);
  const tags = suggestTags(markdown, date);
  const body = rewriteImages(convertBody(markdown), images, slug);
  const converted = buildMarkdown({
    title,
    date,
    summary,
    author: config.defaultAuthor,
    tags,
    slug,
    sourceUrl,
    body
  });

  writeFileSync(join(importDir, "source.md"), markdown);
  writeFileSync(join(importDir, "converted.md"), converted);
  return {
    sessionId,
    fileName: file.filename,
    metadata: { title, date, summary, tags, slug, sourceUrl },
    source: markdown,
    converted,
    issues: validateMarkdown(converted, slug),
    previewUrl: `${config.previewBaseUrl}/activities/${slug}/`
  };
}

function writeActivity({ sessionId, slug, markdown }) {
  const safeSlug = slug.replace(/[^\w가-힣-]/g, "-");
  const fm = parseFrontmatter(markdown);
  const date = fm.date || new Date().toISOString().slice(0, 10);
  const contentDir = resolve(root, config.contentRoot);
  const imageDir = resolve(root, config.publicImageRoot, safeSlug);
  mkdirSync(contentDir, { recursive: true });
  mkdirSync(imageDir, { recursive: true });
  const filePath = resolve(contentDir, `${date}-${safeSlug}.md`);
  writeFileSync(filePath, markdown);

  const importDir = resolve(importsRoot, sessionId || "");
  if (sessionId && existsSync(importDir)) {
    for (const name of readdirSync(importDir)) {
      const source = join(importDir, name);
      if (!statSync(source).isFile() || [".md", ".txt"].includes(extname(name))) continue;
      copyFileSync(source, join(imageDir, name));
    }
  }
  return { filePath: relative(root, filePath), imageDir: relative(root, imageDir) };
}

function runCommand(command, args) {
  return new Promise((resolveRun) => {
    const child = spawn(command, args, { cwd: root, shell: true });
    let output = "";
    child.stdout.on("data", (chunk) => (output += chunk.toString()));
    child.stderr.on("data", (chunk) => (output += chunk.toString()));
    child.on("close", (code) => resolveRun({ code, output }));
  });
}

async function handleGit(body) {
  const slug = body.slug.replace(/[^\w가-힣-]/g, "-");
  const branch = `${config.branchPrefix}${slug}`;
  const title = body.title || `Add activity report: ${slug}`;
  const steps = [];
  steps.push(await runCommand("git", ["status", "--short"]));
  steps.push(await runCommand("git", ["checkout", "-B", branch]));
  steps.push(await runCommand("git", ["add", config.contentRoot, config.publicImageRoot]));
  steps.push(await runCommand("git", ["commit", "-m", `"content: add ${slug}"`]));
  steps.push(await runCommand("git", ["push", "-u", "origin", branch]));
  const gh = await runCommand("gh", [
    "pr",
    "create",
    "--draft",
    "--base",
    config.draftPullRequestBase,
    "--head",
    branch,
    "--title",
    `"${title.replaceAll('"', '\\"')}"`,
    "--body",
    `"Union Publisher Lite에서 생성한 활동보고 초안입니다."`
  ]);
  const fallback = `gh pr create --draft --base ${config.draftPullRequestBase} --head ${branch} --title "${title}" --body "Union Publisher Lite에서 생성한 활동보고 초안입니다."`;
  return { branch, steps, pr: gh.code === 0 ? gh : { ...gh, fallback } };
}

async function route(req, res) {
  try {
    const url = new URL(req.url || "/", `http://localhost:${port}`);
    if (req.method === "GET" && url.pathname === "/") {
      return send(res, 200, readFileSync(join(staticRoot, "index.html"), "utf8"), mimeTypes[".html"]);
    }
    if (req.method === "GET" && url.pathname.startsWith("/assets/")) {
      const filePath = safeJoin(staticRoot, url.pathname.replace("/assets/", ""));
      if (!existsSync(filePath)) return send(res, 404, "Not found", "text/plain; charset=utf-8");
      return send(res, 200, readFileSync(filePath), mimeTypes[extname(filePath)] || "application/octet-stream");
    }
    if (req.method === "GET" && url.pathname === "/api/config") {
      return send(res, 200, config);
    }
    if (req.method === "POST" && url.pathname === "/api/analyze") {
      const body = await readBody(req);
      return send(res, 200, prepareUpload(parseMultipart(body, req.headers["content-type"])));
    }
    if (req.method === "POST" && url.pathname === "/api/write") {
      const body = JSON.parse((await readBody(req)).toString("utf8"));
      return send(res, 200, writeActivity(body));
    }
    if (req.method === "POST" && url.pathname === "/api/validate") {
      const body = JSON.parse((await readBody(req)).toString("utf8"));
      return send(res, 200, { issues: validateMarkdown(body.markdown || "", body.slug || "") });
    }
    if (req.method === "POST" && url.pathname === "/api/run") {
      const body = JSON.parse((await readBody(req)).toString("utf8"));
      const script = body.script === "build" ? "build" : "check";
      return send(res, 200, await runCommand("pnpm", ["run", script]));
    }
    if (req.method === "POST" && url.pathname === "/api/git") {
      const body = JSON.parse((await readBody(req)).toString("utf8"));
      return send(res, 200, await handleGit(body));
    }
    return send(res, 404, { error: "Not found" });
  } catch (error) {
    return send(res, 500, { error: error.message });
  }
}

createServer(route).listen(port, () => {
  console.log(`Union Publisher Lite: http://localhost:${port}`);
});
