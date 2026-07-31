#!/usr/bin/env node
/**
 * Codex-friendly local runner.
 *
 * This wrapper keeps the user's daily workflow API-key-free by default:
 * Codex/automation calls this script, and the DailyBrief pipeline uses the
 * locally logged-in Claude CLI backend for LLM enrichment.
 */

import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import os from "node:os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const env = {
  ...process.env,
  LLM_BACKEND: process.env.LLM_BACKEND || "claude-cli",
  CLAUDE_MODEL: process.env.CLAUDE_MODEL || "sonnet",
  REPORT_LOCALE: process.env.REPORT_LOCALE || "zh",
  REPORT_TZ: process.env.REPORT_TZ || "Asia/Shanghai",
  OUTPUT_MARKDOWN: process.env.OUTPUT_MARKDOWN || "true",
  DAILYBRIEF_ARCHIVE_DIR: process.env.DAILYBRIEF_ARCHIVE_DIR || path.join(os.homedir(), "DailyBrief每日存档"),
};

function nowTime() {
  return new Date().toTimeString().slice(0, 8);
}

function createLogStream(date) {
  const logDir = path.join(projectRoot, "logs");
  fs.mkdirSync(logDir, { recursive: true });
  const logFile = path.join(logDir, `daily-${date}.log`);
  const logStream = fs.createWriteStream(logFile, { flags: "a" });
  logStream.write(`\n[${nowTime()}] codex-daily start\n`);
  return { logFile, logStream };
}

function logLine(logStream, message) {
  console.log(message);
  logStream.write(`${message}\n`);
}

function run(cmd, args, logStream) {
  const command = `${cmd} ${args.join(" ")}`;
  logLine(logStream, `\n[codex-daily] $ ${command}`);

  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      cwd: projectRoot,
      env,
      shell: process.platform === "win32",
      stdio: ["ignore", "pipe", "pipe"],
    });

    child.stdout.on("data", (chunk) => {
      process.stdout.write(chunk);
      logStream.write(chunk);
    });

    child.stderr.on("data", (chunk) => {
      process.stderr.write(chunk);
      logStream.write(chunk);
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${command} exited ${code}`));
      }
    });
  });
}

function todayKey(tz) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const values = Object.fromEntries(parts.map((p) => [p.type, p.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function printSummary(date) {
  const base = path.join(projectRoot, "daily_reports", date, date);
  const jsonPath = `${base}.json`;
  const htmlPath = `${base}.html`;
  const mdPath = `${base}.md`;

  if (!fs.existsSync(jsonPath) || !fs.existsSync(htmlPath)) {
    throw new Error(`expected report files not found under ${path.dirname(base)}`);
  }

  const report = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  const title = report.hero_headline || report.title || `${date} DailyBrief`;
  const overview = report.daily_overview || "";
  const picks = [
    ...(report.tech_briefs || []),
    ...(report.finance_briefs || []),
    ...(report.politics_briefs || []),
  ]
    .slice(0, 6)
    .map((item, index) => `${index + 1}. ${item.title}`);

  console.log("\n[codex-daily] done");
  console.log(`title: ${title}`);
  if (overview) console.log(`overview: ${overview}`);
  if (picks.length) console.log(`top briefs:\n${picks.join("\n")}`);
  console.log(`html: ${htmlPath}`);
  if (fs.existsSync(mdPath)) console.log(`markdown: ${mdPath}`);
}

function ensureDesktopArchiveLink(archiveDir, logStream) {
  const desktopDir = path.join(os.homedir(), "Desktop");
  const linkPath = path.join(desktopDir, "DailyBrief每日存档");
  if (!fs.existsSync(desktopDir) || fs.existsSync(linkPath)) return;

  try {
    fs.symlinkSync(archiveDir, linkPath, "dir");
    logLine(logStream, `[codex-daily] desktop archive link: ${linkPath}`);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logLine(logStream, `[codex-daily] desktop archive link skipped: ${message}`);
  }
}

function archiveReport(date, logStream) {
  const reportDir = path.join(projectRoot, "daily_reports", date);
  const archiveDir = env.DAILYBRIEF_ARCHIVE_DIR;
  fs.mkdirSync(archiveDir, { recursive: true });
  ensureDesktopArchiveLink(archiveDir, logStream);

  const copies = [
    [`${date}.html`, `${date}.html`],
    [`${date}.md`, `${date}.md`],
    [`${date}.json`, `${date}.json`],
    [`${date}-articles.json`, `${date}-articles.json`],
  ];

  for (const [sourceName, archiveName] of copies) {
    const sourcePath = path.join(reportDir, sourceName);
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, path.join(archiveDir, archiveName));
    }
  }

  logLine(logStream, `[codex-daily] archive: ${archiveDir}`);
}

const date = todayKey(env.REPORT_TZ);
const { logFile, logStream } = createLogStream(date);

try {
  logLine(logStream, "[codex-daily] local API-key-free mode");
  logLine(logStream, `[codex-daily] LLM_BACKEND=${env.LLM_BACKEND}`);
  logLine(logStream, `[codex-daily] REPORT_LOCALE=${env.REPORT_LOCALE}`);
  logLine(logStream, `[codex-daily] REPORT_TZ=${env.REPORT_TZ}`);
  logLine(logStream, `[codex-daily] log=${logFile}`);
  await run("npm", ["run", "daily"], logStream);
  await run("npm", ["run", "build-site"], logStream);
  archiveReport(date, logStream);
  printSummary(todayKey(env.REPORT_TZ));
  logStream.write(`[${nowTime()}] codex-daily OK\n`);
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error("[codex-daily] FAILED:", message);
  logStream.write(`[${nowTime()}] codex-daily FAILED: ${message}\n`);
  process.exitCode = 1;
} finally {
  logStream.end();
}
