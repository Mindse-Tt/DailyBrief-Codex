<a id="top"></a>

<div align="center">

# 📰 DailyBrief-Codex

**一套为 Codex 重新包装的本地每日情报工作流：每天自动抓取资讯、生成 AI 摘要、分析市场信号，并归档到桌面。**

让日报不再是“打开网页看一眼”，而是变成一个可以被 Codex 调用、复盘、二次加工和长期沉淀的个人情报系统。

<p>
  <img src="https://img.shields.io/badge/Codex-first-111827?style=for-the-badge" alt="Codex first">
  <img src="https://img.shields.io/badge/maintainer-Mindse--Tt-0f766e?style=for-the-badge" alt="Maintainer Mindse-Tt">
  <img src="https://img.shields.io/badge/default-no%20LLM%20API%20Key-16a34a?style=for-the-badge" alt="No LLM API key by default">
  <img src="https://img.shields.io/badge/archive-Desktop%20DailyBrief-2563eb?style=for-the-badge" alt="Desktop archive">
  <img src="https://img.shields.io/badge/Node-20%2B-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node 20+">
  <img src="https://img.shields.io/badge/license-MIT-blue?style=for-the-badge" alt="MIT license">
</p>

</div>

---

## 👤 项目主理

DailyBrief-Codex 由 **许惟 / Mindse-Tt** 主导整理、改造和维护，核心目标是把每日情报流变成一个能被 Codex 持续调用的个人工作系统。

Claude / Codex 参与了本地运行包装、README 体系化、Skill 封装、桌面归档和故障排查流程的协作实现。

项目保留 MIT 许可；许可证文件中保留必要版权声明，同时标注 DailyBrief-Codex 改造部分的维护归属。当前维护信息见 [CONTRIBUTORS.md](CONTRIBUTORS.md)。

---

## ✨ 这个版本做了什么

DailyBrief-Codex 的重点不是“复刻一个日报页面”，而是把资讯抓取、模型摘要、市场信号、桌面归档和 Codex 调用串成一条稳定链路：

| 能力 | DailyBrief-Codex 的做法 |
|---|---|
| 🤖 Codex 调用 | 用 `npm run codex:daily` 作为稳定入口，Codex 可直接运行、验收、总结 |
| 🔐 默认无 Key | 默认走本机已登录的 `claude-cli` 后端，不要求再配置 LLM API Key |
| 🧠 多源摘要 | 聚合技术、财经、时政、社区讨论和市场行情，再由 LLM 做中文日报 |
| 📈 市场信号 | 跟踪 21 个美股 / 加密 / 中港 / 商品外汇 / 宏观标的，并生成技术指标点评 |
| 📁 桌面归档 | 每天自动复制到 `~/Desktop/DailyBrief每日存档`，结构像 `AIHOT每日存档` |
| 🧩 Skill 化 | 内置 `dailybrief-codex` Skill，也单独发布，方便在不同 Codex 环境调用 |
| ☁️ 云端边界 | GitHub Actions 改成手动触发，日常不再因为云端没 API Key 失败刷通知 |

---

## 🧭 工作流

<p align="center">
  <img src="docs/codex-flow.svg" alt="DailyBrief-Codex workflow" width="780">
</p>

```text
Codex request / automation
  -> npm run codex:daily
  -> fetch public RSS / JSON / API sources
  -> local CLI backend summarizes and ranks
  -> write HTML / Markdown / JSON
  -> copy reports into Desktop archive
  -> Codex reads the report and returns a Chinese digest
```

---

## 🖼️ 报告预览

### 技术动态

<p align="center">
  <img src="docs/screenshots/tech.png" alt="DailyBrief-Codex tech section preview" width="760">
</p>

覆盖 GitHub Trending、AI 公司博客、研究趋势、中文社区和海外技术媒体。

### 市场行情

<p align="center">
  <img src="docs/screenshots/trading.png" alt="DailyBrief-Codex market section preview" width="760">
</p>

跟踪 SPY、QQQ、AAPL、MSFT、NVDA、GOOGL、TSLA、META、BTC、ETH、SOL、BABA、PDD、JD、腾讯、黄金、WTI 原油、美元/人民币、VIX、10Y 美债、DXY 等 21 个标的。

### 财经要点

<p align="center">
  <img src="docs/screenshots/finance.png" alt="DailyBrief-Codex finance section preview" width="760">
</p>

聚合 Bloomberg、WSJ、Financial Times、BBC Business、Economist 等来源，提炼公司、宏观和资产价格线索。

### 时政观察

<p align="center">
  <img src="docs/screenshots/politics.png" alt="DailyBrief-Codex politics section preview" width="760">
</p>

聚合 BBC、Guardian、NYT、NPR、DW 中文、Al Jazeera、The Diplomat 等国际要闻来源。

---

## 📚 数据源图谱

当前配置：

| 指标 | 数量 |
|---|---:|
| Source registry 总数 | 53 |
| 默认启用 | 26 |
| 中文模式有效 | 24 |

按类型看：

| 类别 | 代表来源 |
|---|---|
| 🧑‍💻 技术 / AI | GitHub Trending、OpenAI News、DeepMind Blog、Hugging Face Blog、TLDR AI、Smol AI、Latent Space、MIT Tech Review AI |
| 💬 社区讨论 | V2EX、LinuxDo、Hacker News、Reddit r/stocks |
| 💰 财经 | Bloomberg、WSJ、Financial Times、BBC Business、Economist |
| 🌍 时政 | BBC World、Guardian、NYT World、NPR World、DW 中文、Al Jazeera、The Diplomat |
| 📈 市场行情 | 美股、ETF、加密、中港、商品外汇、宏观指标 |

查看当前启用状态：

```bash
npm run sources
```

切换语言：

```bash
REPORT_LOCALE=en npm run sources
```

---

## 🚀 快速开始

```bash
git clone https://github.com/Mindse-Tt/DailyBrief-Codex.git
cd DailyBrief-Codex
npm install
cp codex.env.example .env.local
npm run codex:daily
```

默认配置：

```bash
LLM_BACKEND=claude-cli
CLAUDE_MODEL=sonnet
REPORT_LOCALE=zh
REPORT_TZ=Asia/Shanghai
OUTPUT_MARKDOWN=true
```

如果你已经在本机登录过 Claude CLI，这条路径默认不需要额外 LLM API Key。Codex 负责启动和总结，日报管线负责抓取、生成和归档。

---

## 📦 输出与归档

每次运行会生成四类文件：

```text
daily_reports/YYYY-MM-DD/YYYY-MM-DD.html
daily_reports/YYYY-MM-DD/YYYY-MM-DD.md
daily_reports/YYYY-MM-DD/YYYY-MM-DD.json
daily_reports/YYYY-MM-DD/YYYY-MM-DD-articles.json
```

同时复制一份到桌面归档入口：

```text
~/Desktop/DailyBrief每日存档/YYYY-MM-DD.html
~/Desktop/DailyBrief每日存档/YYYY-MM-DD.md
~/Desktop/DailyBrief每日存档/YYYY-MM-DD.json
~/Desktop/DailyBrief每日存档/YYYY-MM-DD-articles.json
```

桌面入口默认指向：

```text
~/DailyBrief每日存档
```

这样每天的结果会像 `AIHOT每日存档` 一样平铺保存，HTML 用来阅读，Markdown 用来复盘，JSON 用来二次处理。

---

## 🧩 Codex Skill

仓库内置 Skill：

```text
skills/dailybrief-codex/
```

安装到本机 Codex：

```bash
mkdir -p ~/.codex/skills
cp -R skills/dailybrief-codex ~/.codex/skills/
```

如果项目不在默认位置，设置：

```bash
export DAILYBRIEF_CODEX_ROOT=/absolute/path/to/DailyBrief-Codex
```

之后可以直接对 Codex 说：

```text
用 dailybrief-codex 跑今天日报并总结给我。
```

Skill 也可以作为单独工具使用：

| 位置 | 用途 |
|---|---|
| [DailyBrief-Codex-Skill](https://github.com/Mindse-Tt/DailyBrief-Codex-Skill) | 独立安装和更新 |
| [xuwei_tools / dailybrief-codex](https://github.com/Mindse-Tt/xuwei_tools/tree/main/dailybrief-codex) | 许惟工具集合里的 Skill 条目 |

---

## ⏰ 每日自动化

推荐用 Codex 自动任务每天早上触发：

```text
进入 DailyBrief-Codex 仓库，运行 npm run codex:daily。
成功后读取当天 Markdown / JSON，给我中文日报摘要，并附上 HTML、Markdown 和桌面归档路径。
失败时先看 logs/daily-YYYY-MM-DD.log，再给出原因和修复建议。
```

本机默认节奏：

| 项目 | 配置 |
|---|---|
| 时间 | 每天 08:30 |
| 时区 | Asia/Shanghai |
| 运行方式 | Codex local automation |
| 主要命令 | `npm run codex:daily` |
| 失败日志 | `logs/daily-YYYY-MM-DD.log` |

---

## ☁️ GitHub Actions 边界

这个版本的 GitHub Actions 是手动触发，不做自动定时。

原因是 GitHub 云端 runner 无法读取你本机已经登录的 Claude / Codex CLI。只要让云端自动生成日报，就必须配置 `ANTHROPIC_API_KEY`、`OPENAI_API_KEY`、`DEEPSEEK_API_KEY` 或类似云端 LLM Key；这和本项目默认的“本地无 Key”路线不一致。

推荐日常路径：

```text
Codex automation -> npm run codex:daily -> local CLI backend -> desktop archive
```

需要临时在 GitHub 上手动跑时，再进入 Actions 页面选择 `Daily Brief`，配置云端 LLM backend 和对应 secret 后运行。

---

## 🛠️ 常用命令

| 命令 | 用途 | 是否调用 LLM |
|---|---|---|
| `npm run codex:daily` | Codex 推荐入口，完整生成并归档 | 是 |
| `npm run daily` | 只跑日报生成管线 | 是 |
| `npm run build-site` | 重建 `index.html` / `archive.html` | 否 |
| `npm run dry-run` | 抓取源烟测，不做摘要 | 否 |
| `npm run render [date]` | 重新渲染某天报告 | 否 |
| `npm run regen-trading [date]` | 重做市场行情部分 | 是 |
| `npm run quota-report` | 查看 LLM 调用记录 | 否 |
| `npm run sources` | 查看数据源启用状态 | 否 |
| `npm run open` | 打开最新 HTML 报告 | 否 |

---

## 🧠 Token 与耗时

一次完整日报在本机实测大约：

| 指标 | 量级 |
|---|---:|
| 运行时间 | 5 到 8 分钟 |
| LLM 调用 | 约 8 次 |
| LLM token | 约 3 万 |

实际消耗会随当天资讯量、摘要长度、市场数据和所选 backend 变化。Codex 读完报告后再给你中文总结，会额外消耗少量 token。

---

## 🧯 排查问题

| 现象 | 先看哪里 | 常见原因 |
|---|---|---|
| 没生成报告 | `logs/daily-YYYY-MM-DD.log` | 命令失败、依赖缺失、CLI 未登录 |
| LLM 后端失败 | `logs/llm-calls.jsonl` | 本地 CLI 登录过期、模型不可用 |
| 某个源抓取失败 | 终端输出 / 日志 | RSS 临时不可用、LinuxDo 被 Cloudflare 拦截 |
| Codex 找不到项目 | `DAILYBRIEF_CODEX_ROOT` | 项目路径不在默认候选位置 |
| Markdown 缺失 | `.env.local` | `OUTPUT_MARKDOWN` 没有开启 |
| GitHub 红叉通知 | Actions run 详情 | 云端没有 LLM API Key；日常应走本地 Codex 自动化 |

---

## 🗂️ 项目结构

```text
scripts/codex-daily.mjs          # Codex-friendly local runner
codex.env.example                # No-key local default config
CODEX.md                         # Codex automation and skill notes
skills/dailybrief-codex/         # Installable Codex Skill
docs/codex-flow.svg              # README workflow diagram
docs/screenshots/                # Report preview images
lib/sources/                     # Source fetchers
lib/ai/                          # LLM backend, prompts, enrichment
lib/trading/                     # Market watchlist and indicators
lib/output/render.ts             # HTML / Markdown renderer
daily_reports/                   # Generated local reports, gitignored
logs/                            # Run logs and LLM call logs, gitignored
```

---

## 📄 License

MIT.
