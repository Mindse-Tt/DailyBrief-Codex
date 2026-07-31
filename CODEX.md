# DailyBrief for Codex

This fork is packaged for a local Codex daily workflow:

- no news-source API keys
- no LLM API keys by default
- Codex runs the job and reports the result
- the DailyBrief pipeline uses the locally logged-in `claude` CLI backend for enrichment
- output is saved as HTML, JSON, and Markdown

## Local Run

```bash
npm install
cp codex.env.example .env.local
npm run codex:daily
```

The wrapper sets these defaults when you have not set them yourself:

```bash
LLM_BACKEND=claude-cli
CLAUDE_MODEL=sonnet
REPORT_LOCALE=zh
REPORT_TZ=Asia/Shanghai
OUTPUT_MARKDOWN=true
```

Reports are written to:

```text
daily_reports/YYYY-MM-DD/YYYY-MM-DD.html
daily_reports/YYYY-MM-DD/YYYY-MM-DD.md
daily_reports/YYYY-MM-DD/YYYY-MM-DD.json
```

A desktop archive copy is also maintained at:

```text
~/Desktop/DailyBrief每日存档/YYYY-MM-DD.html
~/Desktop/DailyBrief每日存档/YYYY-MM-DD.md
~/Desktop/DailyBrief每日存档/YYYY-MM-DD.json
```

The desktop entry points to `~/DailyBrief每日存档`, matching the user's
`AIHOT每日存档` layout.

## Daily Codex Automation

Use a Codex cron automation with this workspace and prompt:

```text
进入 DailyBrief 项目，运行 npm run codex:daily。完成后阅读终端输出和 today 的 Markdown/JSON，给我一份中文日报摘要，并附上本地 HTML 路径。如果失败，先查看 logs/daily-YYYY-MM-DD.log，给出失败原因和下一步修复建议。
```

Recommended schedule: every day at 08:30 Asia/Shanghai.

## Codex Skill

This repository includes an installable skill at:

```text
skills/dailybrief-codex/
```

Install or copy that folder into your Codex skills directory:

```bash
mkdir -p ~/.codex/skills
cp -R skills/dailybrief-codex ~/.codex/skills/
```

Then ask Codex:

```text
用 dailybrief-codex 跑今天日报并总结给我。
```

The same skill is also published separately at:

```text
https://github.com/Mindse-Tt/DailyBrief-Codex-Skill
```

And collected in:

```text
https://github.com/Mindse-Tt/xuwei_tools
```

## Why Not API Keys

The source fetchers use public RSS/JSON endpoints. For the LLM step, local mode
reuses the machine's CLI login instead of provider API keys. If you later want a
server-only or GitHub Actions setup, use the upstream API backend options.

## GitHub Actions Boundary

The bundled GitHub workflow is manual-only in this fork. Scheduled Actions are
disabled because GitHub-hosted runners cannot access the user's local CLI login;
without a cloud LLM API key, scheduled cloud runs fail before report generation.
Keep the daily schedule in Codex automation for the no-key workflow.

## Codex CLI Note

This machine has `codex-cli`, but the current CLI model configuration did not
complete a stable smoke test during packaging. Until that is fixed, the reliable
API-key-free setup is:

```text
Codex automation -> npm run codex:daily -> local claude CLI backend
```
