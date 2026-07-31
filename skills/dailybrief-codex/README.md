# DailyBrief-Codex Skill

> 用 Codex 跑本地每日简报：默认不需要 LLM API Key，生成 HTML / Markdown / JSON，并把日报归档到桌面。

这是 DailyBrief-Codex 主项目自带的 Skill 包。它不是另一套日报代码，而是主项目的 Codex 调用入口。

## 它和主项目是什么关系

| 位置 | 作用 |
|---|---|
| DailyBrief-Codex 根目录 | 完整项目：抓取、摘要、渲染、归档、日志、README 展示 |
| `skills/dailybrief-codex` | Skill 包：告诉 Codex 怎么找到主项目、怎么运行、怎么验收和排错 |

简单说：**它们是一回事的两个层级**。主项目负责真正生成日报；这个目录负责把“怎么让 Codex 稳定调用它”封装成 Skill。

## 包含内容

```text
dailybrief-codex/
  SKILL.md                 # Codex 使用说明和触发规则
  agents/openai.yaml       # Agent 配置
  scripts/run_daily.py     # 运行 / 读取最新日报的辅助脚本
```

## 安装

```bash
mkdir -p ~/.codex/skills
cp -R skills/dailybrief-codex ~/.codex/skills/
```

## 调用

```text
用 dailybrief-codex 跑今天日报并总结给我。
```

