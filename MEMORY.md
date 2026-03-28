# Project Memory — AI/ML Interview Prep Site

> **Purpose**: 项目级上下文记忆文件。任何新 agent session 读这一个文件即可建立全局心智模型。
> **Last updated**: 2026-03-28
> **Update rule**: 每次架构变更、文件新增/重命名、约定变更后必须同步更新。

---

## 1. Project Identity

**AI/ML 面试备考知识手册** — 面向中文母语初学者的 AI/ML 面试准备网站。

- **受众**：准备 AI/算法岗面试的求职者
- **核心价值**：三层渐进式学习（直觉→推导→面试），不是文档，是训练工具
- **语言规则**：所有 UI 和内容使用中文，技术术语格式为"中文名 (English Name)"

---

## 2. Tech Stack

| 层 | 技术 | 备注 |
|----|------|------|
| 前端 | **Vanilla HTML/CSS/JS** | 零框架，零构建步骤，双击 index.html 即可运行 |
| 数学渲染 | KaTeX 0.16.9 (CDN) | `$$..$$` block, `$..$` inline |
| 数据格式 | JSON | 章节内容、知识图谱、章节注册 |
| 存储 | localStorage | SRS 记录、用户笔记、UI 状态 |
| 未来依赖 | D3.js (CDN, lazy) | 知识图谱可视化（Phase 7） |
| 未来依赖 | Pyodide (CDN, lazy) | 浏览器内 Python sandbox（Phase 9） |
| 未来依赖 | Floating UI DOM 1.6.12 (CDN, lazy) | 术语 tooltip 定位（Phase 4） |
| 未来依赖 | focus-trap 7.6.2 + tabbable 6.2.0 (CDN, lazy) | Drawer 焦点锁定（Phase 4） |
| 未来依赖 | Fuse.js 7.1.0 (CDN, lazy) | Command Palette 模糊搜索（Phase 8） |

**架构决策（2026-03-28）**：评估后决定不迁移 React/Next.js。理由：当前代码量（~2000 行）不需要框架，零构建的优势大于组件复用的收益。当超过 50 章或需要用户账号系统时再重新评估。

**外部依赖策略**：所有新依赖均为 CDN 懒加载。首屏零新增依赖（仅 KaTeX）。每个库在首次使用时 `import()` 或动态 `<script>` 加载。

---

## 3. File Map

```
ai-study/
├── index.html                     ← 入口 HTML（66 行）
│                                     三栏布局: sidebar + main + toc-panel
│
├── assets/
│   ├── engine.js                  ← 核心渲染引擎（856 行，IIFE）
│   │                                 职责见 §4 Engine Architecture
│   └── style.css                  ← 全部样式（1088 行）
│                                     暖光主题，CSS 变量，响应式断点
│
├── chapters.json                  ← 章节注册表（14 章）
│                                     每章: id, file, title, navGroup, dotColor, tag
│
├── knowledge_graph.json           ← 术语知识图谱（~100+ nodes）
│                                     每 node: id, term, aliases, chapter_id, card_id, oneliner, related
│                                     engine.js 用它做自动术语链接
│
├── content/
│   ├── ch-transformer.json        ← 每个章节一个 JSON 文件
│   ├── ch-transformer-arch.json
│   ├── ch-transformer-advanced.json
│   ├── ch-transformer-inference.json
│   ├── ch-llm-alignment.json
│   ├── ch-nn-basics.json
│   ├── ch-ml-classical.json
│   ├── ch-ml-tree-methods.json
│   ├── ch-evaluation.json
│   ├── ch-optimization.json
│   ├── ch-linear-algebra.json
│   ├── ch-probability.json
│   ├── ch-algorithms.json
│   └── ch-numerical.json
│
├── AGENTS.md                      ← Agent 行为规则（338 行）
│                                     卡片创作工作流、教学原则、质量标准
├── PROGRESS.md                    ← 实时进度追踪
├── MEMORY.md                      ← 本文件：项目架构记忆
│
├── references/
│   ├── teaching-principles.md     ← 6 条教学原则详解 + 示例
│   ├── json-formats.md            ← 所有 JSON schema 文档
│   ├── interactive-components.md  ← 7 种 block type + 4 种系统功能的完整 spec
│   ├── ui-redesign-plan.md        ← ⚠️ 已被 refactoring-proposal.md 取代
│   └── refactoring-proposal.md    ← 综合重构提案（9 个 Phase）
│
├── tools/
│   └── extract_index.py           ← MD→JSON 提取工具
├── source-md/                     ← 原始 Markdown 源文件
├── source-index/                  ← extract_index.py 产出的片段
├── backup/                        ← 备份
├── screenshots/                   ← UI 截图
└── knowledge.html                 ← 遗留参考文件，READ-ONLY
```

---

## 4. Engine Architecture (engine.js)

### 4.1 State

```javascript
let chapters = [];            // chapters.json 数据
let chapterCache = {};        // { chapterId: chapterData } 已加载章节
let knowledgeGraph = null;    // knowledge_graph.json（懒加载）
let currentChapterId = null;  // 当前显示的章节 ID
```

### 4.2 Lifecycle

```
init()
  ├── fetch chapters.json
  ├── buildSidebar()           → 按 navGroup 分组，渲染 .nav-item
  └── showChapter(id)          → 首次打开（URL ?ch= 参数或第一章）

showChapter(id)
  ├── 更新 sidebar 高亮 (.active)
  ├── 更新 URL (?ch=xxx)
  ├── 懒加载 content/ch-xxx.json → chapterCache
  ├── renderChapter(chData)    → HTML string
  │   ├── chapter-header (tag + title + desc)
  │   ├── taxonomy sections (可选分组) 或直接渲染 cards
  │   └── renderCard(card) × N
  │       ├── card-head (icon + title + subtitle + arrow)
  │       └── card-body
  │           ├── L1 blocks → renderBlock() × N
  │           ├── layer-controls (展开推导 / 面试视角 buttons)
  │           ├── L2 blocks (hidden by default)
  │           └── L3 blocks (hidden by default)
  ├── buildChapterTOC()        → 右侧目录面板
  ├── renderKaTeX()            → 数学公式渲染
  └── drawIFVisualization()    → interactive-formula canvas 初始化
```

### 4.3 Block Types (renderBlock switch)

| Type | 用途 | Layer |
|------|------|-------|
| `kitem` | 知识点文本段落 | any |
| `kitem-list` | 知识点列表 | any |
| `formula` | 数学公式 (KaTeX) | any |
| `interactive-formula` | 参数滑块 + canvas 可视化 | 2 |
| `trap` | 易错点/陷阱 | 2 |
| `memory` | Q&A 自测（支持主动回忆） | 3 |
| `code` | 代码实现 | 3 |
| `table` | 对比表格 | any |
| `divider` | 分隔线 | - |
| `text` | 纯文本段落 | any |

**已设计但未实现的 block types**（spec 在 interactive-components.md）：
- `compare-panel` — 对比面板（有/无、A/B）
- `what-if` — 因果链（去掉 X 会怎样）
- `derivation-chain` — 可折叠推导步骤
- `timeline` — 时间线
- `stepper` — 分步动画
- `sandbox` — Pyodide 代码沙盒

### 4.4 Key Functions (window-exposed)

| Function | Trigger |
|----------|---------|
| `showChapter(id)` | sidebar click / URL routing |
| `toggleCard(headEl)` | card header click → expand/collapse |
| `toggleLayer(btn, layer, cardId)` | "展开推导"/"面试视角" click |
| `switchLayer(btn)` | ❌ 未实现，Phase 2 tab 切换 |
| `showQAAnswer(pairId)` | memory block "显示答案" click |
| `recordRecall(pairId, level)` | 记住了/模糊/没记住 click |
| `updateIF(uid, param, value)` | interactive-formula slider input |
| `doSearch(query)` | search input |
| `goToCard(chId, cardId)` | search result / term-link click |
| `scrollToCard(cardId)` | TOC item click |

### 4.5 术语链接系统

`applyTermLinks(html)` 在渲染 block 文本时自动将 `knowledge_graph.json` 中注册的术语转为可点击链接。

- 按术语长度降序匹配（长词优先，避免"Softmax"被"Soft"截断）
- 点击 → `goToCard(chapterId, cardId)` 跳转
- 当前 hover 无效果（Phase 4 将加入 tooltip）

---

## 5. Data Flow

```
chapters.json ──→ buildSidebar() ──→ sidebar HTML
                      │
                      ↓
              showChapter(id)
                      │
       content/ch-xxx.json ──→ renderChapter() ──→ main area HTML
                                     │
              knowledge_graph.json ──→ applyTermLinks() ──→ 术语自动链接
                                     │
                               renderKaTeX() ──→ 公式渲染
                                     │
                          drawIFVisualization() ──→ canvas 图表

localStorage ←──→ recordRecall()    // Q&A 回忆记录
localStorage ←──→ (Phase 7) SRS     // 间隔重复数据
localStorage ←──→ (Phase 8) Notes   // 用户笔记
```

---

## 6. Content Schema Summary

### Chapter JSON

```
{
  id, title, tag, tagLabel, desc,
  taxonomy?: [{ title, cardIds }],  // 可选分组
  map?: { type, nodes, edges },     // Phase 6 章节地图（未实现）
  cards: [Card]
}
```

### Card JSON

```
{
  id, title, subtitle, icon, iconBg?,
  blocks: [Block]
}
```

### Block — layer 字段

- `layer: 1` (或省略) → Layer 1 "直觉"：30 秒能懂的核心概念
- `layer: 2` → Layer 2 "推导"：完整推导、数值走查、交互组件
- `layer: 3` → Layer 3 "面试"：记忆 Q&A、从零代码、追问变体

---

## 7. CSS Architecture

### Theme Variables (`:root`)

```
--bg, --bg2, --bg3          — 背景层次（暖白色系）
--text, --text2, --text3     — 文本层次
--border                     — 边框
--accent                     — 主色 indigo (#6366f1)
--accent2                    — 绿色 (#10b981)
--accent3                    — 橙色 (#f59e0b)
--accent4                    — 红色 (#ef4444)
--accent5                    — 紫色 (#8b5cf6)
--accent6                    — 青色 (#0ea5e9)
```

### Layout (Current — Phase 1 将重写)

```
.layout = grid: sidebar 260px + main 1fr + toc-panel 320px
.sidebar = fixed left, 260px, full-height
.main = center column, max-width none (被两侧挤压)
.toc-panel = fixed right, 320px (Phase 1 将删除)
```

### Responsive Breakpoints

```
@media (max-width: 1024px) — toc-panel 隐藏
@media (max-width: 768px)  — sidebar 变 overlay, main 全宽
```

---

## 8. Current Content Inventory

| navGroup | 章节数 | 状态 |
|----------|--------|------|
| 深度学习 & 大模型 | 6 | 全部 frozen ✅ |
| 机器学习 | 4 | 全部 frozen ✅ |
| 数学基础 | 2 | 全部 frozen ✅ |
| 工程 & 算法 | 2 | 全部 frozen ✅ |
| **Total** | **14** | **全部 frozen** |

约 ~45 张卡片，~100 个知识图谱节点。

---

## 9. Refactoring Roadmap (Summary)

详见 `references/refactoring-proposal.md`。

| Phase | 内容 | 状态 |
|-------|------|------|
| 1 | Layout 重塑（砍右 TOC, sidebar 折叠, pill nav） | ⬜ |
| 2 | Card Tab 系统（Layer 堆叠 → Tab 切换） | ⬜ |
| 3 | 新 Block Types（compare-panel, what-if, derivation-chain, timeline, stepper） | ⬜ |
| 4 | 术语系统增强（hover tooltip + 2/3 overlay drawer） | ⬜ |
| 5 | 卡片 Header 信息增强（difficulty badge + study status） | ⬜ |
| 6 | 章节叙事结构（Big Map + glue text） | ⬜ |
| 7 | 三大视图（Learning + Explorer + Training + Dashboard） | ⬜ |
| 8 | 锦上添花（⌘+K, 移动端, 阅读模式, Notes） | ⬜ |
| 9 | 远期（Comparison Lab, Sandbox, 模块拆分） | ⬜ |

---

## 10. localStorage Namespace

| Key Pattern | Purpose | Phase |
|-------------|---------|-------|
| `recall-{pairId}` | Q&A 回忆记录（旧格式，Phase 7 迁移） | P0 |
| `ai-study:srs:{cardId}:{qHash}` | SM-2 间隔重复 | Phase 7 |
| `ai-study:notes:{chapterId}:{cardId}` | 用户笔记 | Phase 8 |
| `ai-study:progress:stats` | Dashboard 缓存 | Phase 7 |
| `ai-study:sidebar:collapsed` | Sidebar 折叠状态 | Phase 1 |
| `ai-study:view:mode` | 上次视图模式 | Phase 7 |

---

## 11. Conventions & Rules

1. **文件操作**：不存在 → 创建；存在 <100 行 → 读+全量写；>100 行 → 外科手术式编辑
2. **内容文件上限**：350 行。到 300 行时评估拆分。
3. **engine.js 修改**：只做 bug fix + 新 block type 添加。架构变更需记录在 PROGRESS.md。
4. **术语注册**：每个新术语必须同时在 `knowledge_graph.json` 注册，含 routing + oneliner + related
5. **Layer 分配**：L1 = 定义+公式+反事实；L2 = 推导+数值走查+交互；L3 = 面试 Q&A + 代码
6. **Difficulty badge**：必考 >50% 面试；高频 20-50%；加分 偶尔考；深水区 高级岗位
7. **教学原则**：情境锚定→术语绑定→玩具模型→渐进负载→反事实→紧反馈→代码即理解

---

## 12. Agent Startup Protocol

每次新对话，agent 应：

```
1. Read MEMORY.md       → 本文件，建立项目全局理解
2. Read AGENTS.md       → 行为规则和卡片创作工作流
3. Read PROGRESS.md     → 当前进度状态
4. 根据 PROGRESS.md 的 Priority Decision Tree 决定下一步
5. 按需读取 references/* 和具体 content/ch-*.json
```
