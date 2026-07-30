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
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const env = {
  ...process.env,
  LLM_BACKEND: process.env.LLM_BACKEND || "claude-cli",
  CLAUDE_MODEL: process.env.CLAUDE_MODEL || "sonnet",
  REPORT_LOCALE: process.env.REPORT_LOCALE || "zh",
  REPORT_TZ: process.env.REPORT_TZ || "Asia/Shanghai",
  OUTPUT_MARKDOWN: process.env.OUTPUT_MARKDOWN || "true",
};

function run(cmd, args) {
  console.log(`\n[codex-daily] $ ${cmd} ${args.join(" ")}`);
  const result = spawnSync(cmd, args, {
    cwd: projectRoot,
    env,
    shell: process.platform === "win32",
    stdio: "inherit",
  });
  if (result.status !== 0) {
    throw new Error(`${cmd} ${args.join(" ")} exited ${result.status}`);
  }
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

try {
  console.log("[codex-daily] local API-key-free mode");
  console.log(`[codex-daily] LLM_BACKEND=${env.LLM_BACKEND}`);
  console.log(`[codex-daily] REPORT_LOCALE=${env.REPORT_LOCALE}`);
  console.log(`[codex-daily] REPORT_TZ=${env.REPORT_TZ}`);
  run("npm", ["run", "daily"]);
  run("npm", ["run", "build-site"]);
  printSummary(todayKey(env.REPORT_TZ));
} catch (err) {
  console.error("[codex-daily] FAILED:", err instanceof Error ? err.message : String(err));
  process.exit(1);
}
