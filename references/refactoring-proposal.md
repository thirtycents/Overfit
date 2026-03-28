# 综合重构提案 — AI/ML Interview Prep Site

> **Status**: PROPOSAL — 未实施。需用户确认后开始。
> **Date**: 2026-03-28
> **Scope**: 前端架构 + UI/UX + 新功能 + 技术栈决策

---

## 一、Tech Stack 决策：留守 Vanilla JS

### 结论

**留守 Vanilla JS + CSS，不迁移到 React/Next.js。**

### 理由

| 维度 | Vanilla JS（现状） | React + Next.js + Tailwind + Shadcn |
|------|-------------------|--------------------------------------|
| 当前代码量 | engine.js 856行 + style.css 1088行 | 迁移需重写全部，估算 3000+ 行 |
| 构建工具 | 零配置，双击 index.html 就能跑 | 需要 Node.js + npm + build pipeline |
| 部署复杂度 | 静态文件，任何 HTTP server | SSR/SSG 需 Vercel 或 build step |
| 新功能所需 | D3.js（已有 CDN 方案）、Pyodide | 同样需要，React wrapper 反而更复杂 |
| 学习成本 | 用户可直接看懂修改 | 需理解 React 生态 |
| 性能 | 原生 DOM，零框架开销 | 对当前体量来说框架开销 > 收益 |

**迁移的唯一真正理由是组件复用和状态管理。** 但当前项目只有 ~15 种 block type，一个全局 state（当前章节 + 当前卡片），状态极简。Vanilla JS 的 `renderBlock()` switch 完全胜任。

**结论**：当内容超过 50 章 + 需要用户账号系统时再考虑迁移。现阶段投入应放在内容和交互上，不是基建。

### 后续如果想要模块化

不需要 React，可以用轻量方案：
- **ES Modules**: 把 engine.js 拆成 `renderer.js`、`sidebar.js`、`srs.js`、`graph.js`
- **Vite（可选）**: 零配置打包 + HMR，不改代码架构
- 这些是 Phase 8 以后的优化，不阻塞任何功能开发

---

## 二、已有规划 vs Gemini 新增：差异清单

### ✅ 已在 ui-redesign-plan.md 中规划（直接执行）

| 编号 | 内容 | 对应 Phase |
|------|------|-----------|
| R1 | 砍掉右侧 TOC panel，换成 sticky pill nav | Phase 1 + 3 |
| R2 | 左侧 sidebar 折叠为 60px icon rail | Phase 1 |
| R3 | 卡片 Layer 从堆叠改为 Tab 切换 | Phase 2 |
| R4 | 卡片 header 加 difficulty badge + study status | Phase 4 |
| R5 | 移动端 bottom tab bar + swipe 切换 | Phase 5 |
| R6 | 专注阅读模式（F 键） | Phase 6 |
| R7 | 视觉层次优化（block 分层设计） | Phase 7 |
| R8 | 展开/收起动画优化 | Phase 5 |

### 🆕 Gemini 讨论新增（需补充规划）

| 编号 | 内容 | 教学价值 | 实现复杂度 |
|------|------|---------|-----------|
| G1 | **章节级 Big Map** — 章首架构图/思维导图 | ★★★★★ | 中 |
| G2 | **2/3 宽度 Overlay Drawer** — 知识嵌套的深钻面板 | ★★★★★ | 中 |
| G3 | **术语悬浮 Tooltip** — hover 显示 Layer 1 摘要 | ★★★★☆ | 低 |
| G4 | **三种视图模式** — Learning / Explorer / Training | ★★★★★ | 高 |
| G5 | **Command Palette** (⌘+K 全局搜索) | ★★★☆☆ | 中 |
| G6 | **卡片间衔接文本** — 章节叙事连贯性 | ★★★★☆ | 低（内容层面） |
| G7 | **Comparison Lab** — 用户选择多卡片对比 | ★★★☆☆ | 高 |
| G8 | **Red Flag 陷阱地图** — 面试雷区可视化 | ★★☆☆☆ | 中 |

### 🔧 已在 interactive-components.md 中设计（需实现）

| 编号 | 内容 | 当前状态 |
|------|------|---------|
| C1 | `compare-panel` block | JSON spec + engine.js 代码已写好 |
| C2 | `what-if` block | JSON spec + engine.js 代码已写好 |
| C3 | `derivation-chain` block | JSON spec + engine.js 代码已写好 |
| C4 | `timeline` block | JSON spec + engine.js 代码已写好 |
| C5 | `stepper` block | JSON spec 有，代码需写 |
| C6 | `sandbox` block (Pyodide) | JSON spec 有，代码需写 |
| C7 | Interview Mode (全屏刷题) | spec 有，代码需写 |
| C8 | Knowledge Map (D3.js) | spec 有，代码需写 |
| C9 | Dashboard + SRS (SM-2) | spec 有，代码需写 |
| C10 | Notes Layer | spec 有，代码需写 |

---

## 三、重构分 Phase 详细方案

### Phase 1 — Layout 重塑 ⚡ [最高优先]

**目标**：内容区从 ~460px 扩展到 ~800px，阅读体验质变。

**改动清单**：

1. **砍掉 `<aside class="toc-panel">`** — 从 index.html 删除，style.css 移除 `.toc-panel` 相关样式
2. **Sidebar 折叠**：
   - 默认 60px icon rail，只显示每个 navGroup 的 emoji 图标
   - Hover 或点击汉堡按钮 → 展开为 280px overlay（不推挤内容）
   - 展开时 backdrop 半透明遮罩
3. **Main 区域**：
   - `margin-left: 60px`（sidebar 折叠时）
   - `max-width: 800px; margin: 0 auto;` 居中
4. **Sticky Chapter Pill Nav**：
   - 替代右侧 TOC，水平滚动 pill 条
   - `position: sticky; top: 0;`
   - IntersectionObserver 追踪当前可视卡片，高亮对应 pill
5. **Scroll Progress Bar**：顶部 3px 渐变进度条

**engine.js 改动**：
- `buildSidebar()`: 生成 icon-only 版本 + 完整版本
- 新增 `toggleSidebar()` 函数
- 新增 `buildChapterNav()` 生成 pill bar
- 新增 IntersectionObserver 逻辑追踪可视卡片

**预估**：~200 行 CSS 改动 + ~150 行 JS 改动

---

### Phase 2 — Card Tab 系统 ⚡ [最高优先]

**目标**：消灭"滚动地狱"，Layer 切换变为 Tab 切换。

**改动清单**：

1. `renderCard()` 重写：
   - 卡片 body 内顶部放 3 个 tab：`直觉` / `推导` / `面试`
   - 每个 tab 对应 blocks 按 `layer` 字段分组
   - 同一时间只显示一个 layer 的内容
   - Tab 颜色区分：L1 = indigo，L2 = purple，L3 = green
2. `switchLayer(btn)` 新函数：
   - 切换 active tab + active layer
   - 切换后触发 KaTeX re-render（lazy rendering）
3. 删除旧的 `layer-controls`（展开推导 / 面试视角 按钮）
4. 保留卡片 header 的 click-to-expand 行为

**数据兼容**：零改动。现有 JSON 的 `block.layer` 字段已经标注了每个 block 属于哪个 layer，只需渲染时分组。

**预估**：~100 行 CSS + ~80 行 JS 改动

---

### Phase 3 — 新 Block Types 批量实装 [高优先]

**目标**：让已设计好的 5 种新 block 类型可用，content 作者可以立即使用。

按 interactive-components.md 的代码规格，逐个添加到 `renderBlock()` 的 switch：

1. **compare-panel** — 代码已在 spec 中，直接移植
2. **what-if** — 代码已在 spec 中，直接移植
3. **derivation-chain** — 代码已在 spec 中，直接移植
4. **timeline** — 代码已在 spec 中，直接移植
5. **stepper** — 需写 `stepperRender()` + `stepperNav()` + 矩阵高亮渲染

每个 block 加对应 CSS。

**预估**：~200 行 JS + ~150 行 CSS

---

### Phase 4 — 术语系统增强 [高优先]

**目标**：实现 Gemini 讨论的"知识嵌套"解决方案。

#### 4a — Term Hover Tooltip (G3)

现有 `applyTermLinks()` 已经把注册术语变成 `<span class="term-link">` 元素。增强：

- Hover 时显示 tooltip：`knowledge_graph.json` 中该 node 的 `oneliner` + 核心公式（如果有）
- Tooltip 底部显示 "点击查看完整卡片" 链接
- 实现：CSS-only tooltip 或轻量 JS（`mouseenter` + absolute positioned div）

**预估**：~40 行 JS + ~30 行 CSS

#### 4b — Knowledge Overlay Drawer (G2)

点击 term-link → 打开 **2/3 宽度的右侧 overlay panel**，加载该卡片的 Layer 1 内容：

- 从右侧滑入，宽度 `66vw`，最大 `800px`
- 半透明 backdrop
- Panel 内展示目标卡片的完整 3-tab 结构
- 支持 panel 内继续点击 term → 新 panel 推入（面包屑导航）
- ESC 或点击 backdrop 关闭

**为什么 2/3 而不是全屏**：用户明确表示希望保留"我从哪来"的上下文，2/3 宽度让左侧仍可瞥见原始内容。

**实现**：
- 新 DOM 元素 `<div id="knowledgeDrawer">` 挂在 body 末尾
- `openDrawer(chapterId, cardId)` — fetch 目标章节 JSON，渲染卡片到 drawer
- Drawer 内的 term-link 递归调用 `openDrawer()` → stack 管理
- 面包屑显示 drill-down 路径

**预估**：~120 行 JS + ~60 行 CSS

---

### Phase 5 — 卡片 Header 信息增强 [中等优先]

对应 ui-redesign-plan Phase 4：

1. **Difficulty Badge**：从 JSON 的 `badge` 字段渲染
   - 必考 = 红底，高频 = 橙底，加分 = 蓝底，深水区 = 紫底
2. **Study Status Dot**：从 localStorage SRS 数据读取
   - 灰点 = 未学习，蓝点 = 学习中，绿点 = 已掌握
3. **卡片内容量预览**：显示 block 总数或预计阅读时间

**预估**：~40 行 JS + ~30 行 CSS

---

### Phase 6 — 章节叙事结构 (G1 + G6) [中等优先]

**目标**：从"一堆独立卡片"变成"有地图、有路径、有连接的知识体系"。

#### 6a — Chapter Big Map (G1)

每个章节 JSON 新增可选字段 `"map"`：

```json
{
  "id": "ch-transformer",
  "map": {
    "type": "flow",
    "nodes": [
      {"id": "why-attention", "label": "Why Attention?", "level": 0},
      {"id": "qkv", "label": "QKV Projection", "level": 1},
      {"id": "scaled-dot-product", "label": "Scaled Dot-Product", "level": 1},
      {"id": "multi-head", "label": "Multi-Head", "level": 2}
    ],
    "edges": [
      ["why-attention", "qkv"],
      ["why-attention", "scaled-dot-product"],
      ["qkv", "multi-head"],
      ["scaled-dot-product", "multi-head"]
    ]
  },
  "cards": [...]
}
```

渲染为 SVG 流程图，放在章节标题下方、卡片列表上方。点击节点 scroll 到对应卡片。当前正在阅读的卡片节点高亮。

**技术**：纯 SVG 手绘（节点数 <10，不需要 D3 的力导向），或者用 CSS Grid + 连接线。

#### 6b — Glue Text (G6)

章节 JSON 的 `cards` 数组中允许插入 `"glue"` 类型元素：

```json
{
  "type": "glue",
  "text": "理解了 QKV 的来源后，下一个问题是：Q 和 K 的点积到底在算什么？为什么需要缩放？"
}
```

渲染为卡片之间的过渡段落，视觉上不同于卡片（无边框，斜体，带连接箭头装饰）。

**预估**：~80 行 JS + ~50 行 CSS + 内容层面的 JSON 修改

---

### Phase 7 — 三大视图模式 (G4) [重要但大]

**目标**：同一内容，三种消费方式。

#### 7a — Learning View（默认，当前的增强版）

就是 Phase 1-6 完成后的效果：
- 左侧 icon rail sidebar
- 主内容区域：chapter map → glue → card tabs → glue → card tabs
- Sticky pill nav
- Term tooltip + overlay drawer

#### 7b — Explorer View (Knowledge Map)

对应 PROGRESS.md 的 P1 backlog + interactive-components.md spec：

- 按钮在 sidebar 上（🗺️ 图标）
- 全屏 overlay
- D3.js force-directed graph
- 节点 = knowledge_graph.json 所有 node
- 颜色 = 所属 chapter 的 dotColor
- 边 = related 字段
- 点击节点 → 关闭 graph → goToCard()
- 支持拖拽、缩放、搜索高亮

**实现**：D3.js CDN lazy load，~200 行 JS + ~50 行 CSS

#### 7c — Training View (Interview Mode + SRS)

对应 PROGRESS.md 的 P1 + P2 backlog：

- 按钮在 sidebar 上（🎯 图标）
- 全屏 overlay，一次显示一个 memory block 的问题
- 交互：Space 翻转看答案 → 1/2/3 评级（困难/一般/简单）
- SM-2 算法计算下次复习间隔
- 支持按章节筛选、只看 due cards
- Session 结束后显示统计

**实现**：~250 行 JS + ~80 行 CSS

#### 7d — Dashboard（视图入口）

- 显示整体学习进度
- 每章掌握率 progress bar
- 今日待复习 due cards 数量
- 快捷入口：开始刷题、继续学习

**实现**：~100 行 JS + ~40 行 CSS

---

### Phase 8 — Command Palette + 移动端 + 阅读模式 [锦上添花]

#### 8a — Command Palette (G5)

- `⌘+K`（Mac）/ `Ctrl+K`（Win）打开
- 搜索范围：所有卡片标题 + 所有 knowledge_graph 术语 + 章节名
- 结果分组显示：📚 章节 / 📝 卡片 / 🔗 术语
- 回车导航到选中项
- 比当前 sidebar 的搜索框更强大（支持模糊匹配）

**实现**：~100 行 JS + ~50 行 CSS

#### 8b — 移动端 Bottom Tab Bar

对应 ui-redesign-plan Phase 5：

- `<768px` 时 sidebar 消失，显示底部 tab bar
- 4 个图标：📚 目录 / 🔍 搜索 / 🎯 刷题 / 📊 统计
- Tab 切换对应不同的全屏 panel

#### 8c — 专注阅读模式

对应 ui-redesign-plan Phase 6：

- `F` 键切换
- 隐藏 sidebar、pill nav、badge
- 内容居中 `max-width: 700px`
- 当前卡片外内容 dim

#### 8d — Notes Layer

对应 P2 backlog：

- 每个卡片底部可展开的 textarea
- 自动保存到 localStorage
- 有笔记的卡片 header 显示 📝 标记

**Phase 8 总估**：~300 行 JS + ~120 行 CSS

---

### Phase 9 — 远期功能 [需要时再做]

| 功能 | 触发条件 |
|------|---------|
| Comparison Lab (G7) | 有 3+ 个同域对比需求的章节时 |
| Red Flag 陷阱地图 (G8) | 积累 20+ 个 trap block 后 |
| Code Sandbox (Pyodide) (C6) | 写到需要用户运行代码的 Layer 3 内容时 |
| 口头表达训练 | Web Speech API 成熟度提升后 |
| 白板草图模式 | 需求确认后 |
| ES Module 拆分 | engine.js 超过 1500 行时 |
| 迁移到 React/Next.js | 超过 50 章 + 需要用户账号系统时 |

---

## 四、实施顺序与依赖关系

```
Phase 1 (Layout) ──┐
                    ├──→ Phase 3 (New Blocks) ──→ Phase 6 (Chapter Narrative)
Phase 2 (Card Tabs)─┘                                       │
                                                             ↓
Phase 4 (Term System) ─────────────────────→ Phase 7b (Knowledge Map)
                                                             │
Phase 5 (Card Header) ──→ Phase 7c (Training View) ─→ Phase 7d (Dashboard)
                                                             │
                                                             ↓
                                                   Phase 8 (Polish)
```

**关键路径**：Phase 1 + 2 → Phase 3 → Phase 7

**可并行**：
- Phase 1+2（Layout + Tabs）可同时做，因为一个改 CSS layout，一个改 renderCard()
- Phase 3（New Blocks）和 Phase 4（Term System）可并行
- Phase 5（Card Header）独立，任何时候可做

---

## 五、工作量估算

| Phase | JS 行数 | CSS 行数 | 预估时间 | 备注 |
|-------|--------|---------|---------|------|
| 1. Layout | ~150 | ~200 | 1 session | 影响最大，优先做 |
| 2. Card Tabs | ~80 | ~100 | 1 session | 与 Phase 1 同 session |
| 3. New Blocks | ~200 | ~150 | 1 session | 大部分代码已在 spec 中 |
| 4. Term System | ~160 | ~90 | 1 session | Tooltip 简单，Drawer 中等 |
| 5. Card Header | ~40 | ~30 | 0.5 session | 小改动 |
| 6. Chapter Narrative | ~80 | ~50 | 1 session | 含 JSON schema 扩展 |
| 7. Three Views | ~550 | ~170 | 2-3 sessions | 最大模块 |
| 8. Polish | ~300 | ~120 | 1-2 sessions | 可分拆 |
| **Total** | **~1560** | **~910** | **~8-10 sessions** | |

当前 engine.js = 856 行。Phase 1-7 完成后预估 ~2400 行。到 Phase 7 时应考虑拆分为模块（`renderer.js`、`sidebar.js`、`srs.js`、`graph.js`、`drawer.js`）。

---

## 六、JSON Schema 变更清单

### chapters.json — 无变更

### content/ch-*.json — 新增字段

```diff
{
  "id": "ch-xxx",
  "title": "...",
+ "map": { "type": "flow", "nodes": [...], "edges": [...] },    // Phase 6 可选
  "cards": [
+   { "type": "glue", "text": "..." },                           // Phase 6 卡片间文本
    {
      "id": "xxx",
      "title": "...",
      "blocks": [
+       { "type": "compare-panel", ... },                        // Phase 3
+       { "type": "what-if", ... },                              // Phase 3
+       { "type": "derivation-chain", ... },                     // Phase 3
+       { "type": "timeline", ... },                             // Phase 3
+       { "type": "stepper", ... },                              // Phase 3
+       { "type": "sandbox", ... },                              // Phase 9
      ]
    }
  ]
}
```

### knowledge_graph.json — 无 schema 变更

现有 `oneliner` 字段正好服务 Phase 4a tooltip，无需新增字段。

### localStorage — 新增 key patterns

```
ai-study:srs:{cardId}:{qHash}        ← Phase 7c (Training View)
ai-study:notes:{chapterId}:{cardId}   ← Phase 8d (Notes Layer)
ai-study:progress:stats               ← Phase 7d (Dashboard)
ai-study:sidebar:collapsed             ← Phase 1 (记住折叠状态)
ai-study:view:mode                     ← Phase 7 (记住上次视图)
```

---

## 七、风险与决策点

### 需要用户决策的

1. **Phase 1+2 是否一起做？** — 建议是，因为两者都改 renderCard()，分开做会改两次。
2. **Chapter Big Map 用什么渲染？** — SVG 手绘（简单但手动）vs D3 层次图（自动但引入 D3 依赖更早）。建议：先用 CSS Grid + 简单连线，Phase 7 引入 D3 时再升级。
3. **engine.js 拆分时机？** — 建议 Phase 7 之前拆，否则单文件 2400 行难以维护。
4. **Overlay Drawer 是否支持递归嵌套？** — 建议先支持 1 层，递归（stack）在 Phase 9。

### 技术风险

1. **KaTeX 重渲染**：Tab 切换后需要重新 render 隐藏 tab 中的公式。需确保 `renderKaTeX()` 能正确处理 display:none → display:block 的元素。
2. **IntersectionObserver + sticky element 冲突**：sticky pill bar 会改变 viewport 高度，IntersectionObserver 的 threshold 需要调整。
3. **D3.js bundle size**：~250KB minified。需要 lazy load，不能放在首屏。
4. **Pyodide 首次加载**：~6MB WASM。必须按需加载 + 显示 loading 状态。

---

## 八、建议的第一步

**立即可以开始 Phase 1 + Phase 2（合并执行）**，理由：

1. 代码已经在 ui-redesign-plan.md 中写好了 80%，只需适配
2. 这两个 Phase 解决最痛的两个问题（内容被挤压 + 滚动地狱）
3. 完成后，后续所有 Phase 都在新 layout 上开发，避免返工
4. 不涉及任何 JSON schema 变更，纯前端改动

**Phase 1+2 完成后的下一步**：Phase 3（新 Block Types），因为有了 Tab 系统后，内容作者可以立即在 Layer 2 中使用 compare-panel、derivation-chain 等新组件，**内容和前端可以并行推进**。

---

## 九、实施蓝图 — 技术选型 + 组件接线

> **Status**: 蓝图完成，等待用户确认后开始实施。
> **Date**: 2026-03-28
>
> 本节为每个 Phase 提供精确的：CDN 标签 / 导入方式、DOM 骨架、CSS 类模型、JS 事件流 / 函数签名、ARIA 属性。
> 实施时照此蓝图逐行落地，不需要再做技术调研。

---

### Phase 1 实施蓝图 — Layout 重塑

#### 1.1 CDN / 依赖

无新依赖。纯 CSS + Vanilla JS。

#### 1.2 DOM 结构变更

**删除**: `<aside class="toc-panel">` 及其全部内容。

**index.html 改后骨架**:

```html
<!-- 顶部进度条 -->
<div id="scrollProgress" class="scroll-progress" aria-hidden="true"></div>

<div class="layout">
  <!-- Sidebar：折叠态 60px icon rail / 展开态 280px overlay -->
  <aside class="sidebar collapsed" id="sidebar" role="navigation" aria-label="章节导航">
    <div class="sidebar-toggle-area">
      <button id="sidebarToggle" class="sidebar-toggle-btn"
              aria-expanded="false" aria-controls="sidebar"
              aria-label="展开导航">☰</button>
    </div>
    <div class="sidebar-header">
      <h2 class="sidebar-title">AI/ML 面试手册</h2>
      <div class="sidebar-search">
        <input type="text" id="searchInput" placeholder="搜索..."
               aria-label="搜索知识点" />
      </div>
    </div>
    <nav class="sidebar-nav" id="sidebarNav">
      <!-- buildSidebar() 动态渲染 -->
    </nav>
  </aside>

  <!-- Sidebar 展开时的背景遮罩 -->
  <div class="sidebar-backdrop" id="sidebarBackdrop" aria-hidden="true"></div>

  <!-- 主内容区 -->
  <main class="main" id="main">
    <!-- Sticky pill nav（替代右侧 TOC） -->
    <div class="pill-nav-sentinel" id="pillNavSentinel" aria-hidden="true"></div>
    <nav class="pill-nav" id="pillNav" role="tablist" aria-label="卡片导航">
      <!-- buildChapterNav() 动态渲染 pill 按钮 -->
    </nav>
    <div id="chapterContainer">
      <!-- renderChapter() 输出 -->
    </div>
  </main>
</div>
```

#### 1.3 CSS 类模型

```css
/* === Scroll Progress Bar === */
.scroll-progress {
  position: fixed; top: 0; left: 0; z-index: 1000;
  height: 3px; width: 0%;
  background: linear-gradient(90deg, var(--accent), var(--accent5));
  transition: width 50ms linear;
}

/* === Sidebar — Collapsed (default) === */
.sidebar {
  position: fixed; top: 0; left: 0; bottom: 0;
  width: 280px; z-index: 100;
  transform: translateX(-220px);          /* 只露出 60px rail */
  transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--bg); border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
  overflow: hidden;
}
.sidebar.expanded {
  transform: translateX(0);               /* 完整 280px */
  box-shadow: 4px 0 24px rgba(0,0,0,0.08);
}
.sidebar.collapsed .sidebar-header,
.sidebar.collapsed .sidebar-nav .nav-item-text {
  opacity: 0; pointer-events: none;
}
.sidebar.expanded .sidebar-header,
.sidebar.expanded .sidebar-nav .nav-item-text {
  opacity: 1; pointer-events: auto;
  transition: opacity 0.15s 0.1s ease;    /* 展开后延迟淡入 */
}

/* Sidebar toggle button (在 60px rail 区域内) */
.sidebar-toggle-area {
  width: 60px; padding: 16px 0;
  display: flex; justify-content: center; flex-shrink: 0;
}
.sidebar-toggle-btn {
  width: 36px; height: 36px; border-radius: 8px;
  border: 1px solid var(--border); background: var(--bg2);
  cursor: pointer; font-size: 18px;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s;
}
.sidebar-toggle-btn:hover { background: var(--bg3); }

/* Nav items: icon 在左 60px 区域内，文本在右 */
.sidebar-nav .nav-item {
  display: flex; align-items: center; gap: 0;
  padding: 8px 16px 8px 0;
  cursor: pointer; border-radius: 0 8px 8px 0;
  transition: background 0.15s;
}
.sidebar-nav .nav-item-icon {
  width: 60px; text-align: center; flex-shrink: 0;
  font-size: 18px;
}
.sidebar-nav .nav-item-text {
  white-space: nowrap; overflow: hidden;
  font-size: 13px; color: var(--text2);
}
.sidebar-nav .nav-item.active {
  background: rgba(99,102,241,0.08);
}
.sidebar-nav .nav-item.active .nav-item-text {
  color: var(--accent); font-weight: 600;
}

/* Backdrop */
.sidebar-backdrop {
  position: fixed; inset: 0; z-index: 99;
  background: rgba(0,0,0,0.3);
  opacity: 0; pointer-events: none;
  transition: opacity 0.25s;
}
.sidebar-backdrop.visible {
  opacity: 1; pointer-events: auto;
}

/* === Main Area === */
.layout {
  display: block;                         /* 从 grid 改为 block */
}
.main {
  margin-left: 60px;                      /* sidebar rail 宽度 */
  max-width: 800px;
  margin-right: auto;
  padding: 0 24px 120px;
}
@media (min-width: 960px) {
  .main {
    margin-left: max(60px, calc((100vw - 800px) / 2));   /* 大屏居中 */
  }
}

/* === Pill Nav (替代右侧 TOC) === */
.pill-nav {
  position: sticky; top: 0; z-index: 50;
  display: flex; gap: 8px; padding: 10px 0;
  overflow-x: auto; scrollbar-width: none;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  -webkit-overflow-scrolling: touch;
}
.pill-nav::-webkit-scrollbar { display: none; }
.pill-nav .pill {
  flex-shrink: 0; padding: 6px 14px;
  border-radius: 99px; font-size: 12px; font-weight: 500;
  border: 1px solid var(--border); background: var(--bg2);
  color: var(--text2); cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.pill-nav .pill.active {
  background: var(--accent); color: white;
  border-color: var(--accent);
}
.pill-nav .pill:hover:not(.active) {
  background: var(--bg3);
}
```

#### 1.4 JS 事件流 / 函数签名

```javascript
// ═══ Sidebar Toggle ═══

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  const btn = document.getElementById('sidebarToggle');
  const isExpanded = sidebar.classList.contains('expanded');

  if (isExpanded) {
    sidebar.classList.remove('expanded');
    sidebar.classList.add('collapsed');
    backdrop.classList.remove('visible');
    btn.setAttribute('aria-expanded', 'false');
  } else {
    sidebar.classList.remove('collapsed');
    sidebar.classList.add('expanded');
    backdrop.classList.add('visible');
    btn.setAttribute('aria-expanded', 'true');
  }
  localStorage.setItem('ai-study:sidebar:collapsed', isExpanded ? '1' : '0');
}

// Event bindings:
// sidebarToggle.onclick → toggleSidebar()
// sidebarBackdrop.onclick → toggleSidebar() (close)
// Escape key → close if expanded
// @media (hover: hover) and (pointer: fine) → optional: sidebar mouseenter/mouseleave

// ═══ buildSidebar() 改造 ═══

function buildSidebar(chapters) {
  // 按 navGroup 分组（同现有逻辑）
  // 每个 chapter 渲染为:
  //   <div class="nav-item" data-ch="{id}" onclick="showChapter('{id}')">
  //     <span class="nav-item-icon">{emoji}</span>
  //     <span class="nav-item-text">{title}</span>
  //   </div>
  // navGroup header 只在 expanded 时可见
}

// ═══ Pill Nav ═══

function buildChapterNav(chapterData) {
  const pillNav = document.getElementById('pillNav');
  pillNav.innerHTML = chapterData.cards
    .filter(c => c.type !== 'glue')          // 跳过 glue 元素
    .map(card =>
      `<button class="pill" role="tab"
              data-card="${card.id}"
              aria-selected="false"
              onclick="scrollToCard('${card.id}')">${card.title}</button>`
    ).join('');
}

// ═══ IntersectionObserver 追踪当前卡片 ═══

let cardObserver = null;

function setupCardObserver() {
  if (cardObserver) cardObserver.disconnect();

  const cards = document.querySelectorAll('.card[data-card-id]');
  if (!cards.length) return;

  // sentinel 方式：每个 card 顶部放一个 0px-height sentinel
  // 当 sentinel 离开 viewport top → 该 card 变为 active
  cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const cardId = entry.target.dataset.cardId;
      const pill = document.querySelector(`.pill[data-card="${cardId}"]`);
      if (!pill) return;

      if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
        // Card 顶部已滚过 viewport → 激活
        setActivePill(cardId);
      }
    });
  }, {
    rootMargin: '-80px 0px 0px 0px',  // pill nav 高度偏移
    threshold: 0
  });

  cards.forEach(card => cardObserver.observe(card));
}

function setActivePill(cardId) {
  document.querySelectorAll('.pill-nav .pill').forEach(p => {
    const isActive = p.dataset.card === cardId;
    p.classList.toggle('active', isActive);
    p.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
  // 滚动 pill 到可视区域
  const activePill = document.querySelector(`.pill[data-card="${cardId}"]`);
  if (activePill) activePill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
}

// scrollToCard 加 scroll-margin-top
function scrollToCard(cardId) {
  const el = document.querySelector(`.card[data-card-id="${cardId}"]`);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ═══ Scroll Progress Bar ═══

function updateScrollProgress() {
  const el = document.getElementById('scrollProgress');
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  el.style.width = Math.min(pct, 100) + '%';
}
// window.addEventListener('scroll', updateScrollProgress, { passive: true });

// ═══ showChapter() 改造 ═══
// 在现有 showChapter() 末尾添加:
//   buildChapterNav(chapterData);
//   setupCardObserver();
// 删除 buildChapterTOC() 调用
```

#### 1.5 卡片滚动偏移

```css
.card[data-card-id] {
  scroll-margin-top: 60px;  /* pill nav 高度 + padding */
}
```

#### 1.6 移动端适配 (<768px)

```css
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-280px);  /* 完全隐藏，no rail */
    width: 280px;
  }
  .sidebar.expanded {
    transform: translateX(0);
  }
  .main {
    margin-left: 0;
    padding: 0 16px 120px;
  }
  /* 汉堡按钮变为 fixed 浮动 */
  .sidebar-toggle-area {
    position: fixed; top: 12px; left: 12px; z-index: 101;
    width: auto; padding: 0;
  }
}
```

---

### Phase 2 实施蓝图 — Card Tab 系统

#### 2.1 CDN / 依赖

无新依赖。

#### 2.2 DOM 结构 (renderCard 输出)

```html
<div class="card" data-card-id="{cardId}">
  <div class="card-head" onclick="toggleCard(this)">
    <span class="card-icon" style="background:{iconBg}">{icon}</span>
    <div class="card-head-text">
      <h3 class="card-title">{title}</h3>
      <p class="card-subtitle">{subtitle}</p>
    </div>
    <span class="card-arrow" aria-hidden="true">▸</span>
  </div>
  <div class="card-body" hidden>
    <!-- Tab bar -->
    <div class="card-tabs" role="tablist" aria-label="内容层次">
      <button class="card-tab active" role="tab"
              id="tab-{cardId}-L1" aria-controls="panel-{cardId}-L1"
              aria-selected="true"
              onclick="switchLayer(this, '{cardId}', 1)">
        直觉
      </button>
      <button class="card-tab" role="tab"
              id="tab-{cardId}-L2" aria-controls="panel-{cardId}-L2"
              aria-selected="false" tabindex="-1"
              onclick="switchLayer(this, '{cardId}', 2)">
        推导
      </button>
      <button class="card-tab" role="tab"
              id="tab-{cardId}-L3" aria-controls="panel-{cardId}-L3"
              aria-selected="false" tabindex="-1"
              onclick="switchLayer(this, '{cardId}', 3)">
        面试
      </button>
    </div>
    <!-- Tab panels -->
    <div class="card-panel active" role="tabpanel"
         id="panel-{cardId}-L1" aria-labelledby="tab-{cardId}-L1">
      <!-- Layer 1 blocks rendered here -->
    </div>
    <div class="card-panel" role="tabpanel"
         id="panel-{cardId}-L2" aria-labelledby="tab-{cardId}-L2"
         hidden>
      <!-- Layer 2 blocks rendered here -->
    </div>
    <div class="card-panel" role="tabpanel"
         id="panel-{cardId}-L3" aria-labelledby="tab-{cardId}-L3"
         hidden>
      <!-- Layer 3 blocks rendered here -->
    </div>
  </div>
</div>
```

#### 2.3 CSS 类模型

```css
/* === Card Tabs === */
.card-tabs {
  display: flex; gap: 0;
  border-bottom: 2px solid var(--border);
  margin: 0 -20px;                       /* 与 card-body padding 对齐 */
  padding: 0 20px;
}
.card-tab {
  padding: 10px 20px; font-size: 13px; font-weight: 600;
  border: none; background: none; cursor: pointer;
  color: var(--text3);
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;                   /* 覆盖 tab bar 下边框 */
  transition: color 0.15s, border-color 0.15s;
  font-family: inherit;
}
.card-tab:hover { color: var(--text); }
.card-tab[aria-selected="true"] {
  color: var(--accent);
  border-bottom-color: var(--accent);
}

/* Tab 颜色区分 */
.card-tab[aria-controls$="-L1"][aria-selected="true"] {
  color: var(--accent);                  /* indigo */
  border-bottom-color: var(--accent);
}
.card-tab[aria-controls$="-L2"][aria-selected="true"] {
  color: var(--accent5);                 /* purple */
  border-bottom-color: var(--accent5);
}
.card-tab[aria-controls$="-L3"][aria-selected="true"] {
  color: var(--accent2);                 /* green */
  border-bottom-color: var(--accent2);
}

/* Tab panels */
.card-panel { padding-top: 16px; }
.card-panel[hidden] { display: none; }
.card-panel.active { display: block; }
```

#### 2.4 JS 事件流

```javascript
// ═══ Tab Switching (WAI-ARIA Manual Activation) ═══

function switchLayer(tabEl, cardId, layer) {
  const tablist = tabEl.closest('.card-tabs');
  const cardBody = tabEl.closest('.card-body');

  // Deactivate all tabs in this card
  tablist.querySelectorAll('.card-tab').forEach(t => {
    t.setAttribute('aria-selected', 'false');
    t.setAttribute('tabindex', '-1');
    t.classList.remove('active');
  });

  // Activate clicked tab
  tabEl.setAttribute('aria-selected', 'true');
  tabEl.removeAttribute('tabindex');
  tabEl.classList.add('active');

  // Switch panels
  cardBody.querySelectorAll('.card-panel').forEach(p => {
    p.hidden = true;
    p.classList.remove('active');
  });
  const targetPanel = document.getElementById(`panel-${cardId}-L${layer}`);
  if (targetPanel) {
    targetPanel.hidden = false;
    targetPanel.classList.add('active');

    // KaTeX lazy re-render: panel 从 hidden→visible 后公式可能未渲染
    requestAnimationFrame(() => {
      if (typeof renderMathInElement === 'function') {
        renderMathInElement(targetPanel, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
          ],
          throwOnError: false
        });
      }
      // 如果有 interactive-formula canvas，重新绘制
      targetPanel.querySelectorAll('[data-if-uid]').forEach(el => {
        const uid = el.dataset.ifUid;
        if (typeof drawIFVisualization === 'function') drawIFVisualization(uid);
      });
    });
  }
}

// ═══ Keyboard Navigation (ArrowLeft/ArrowRight between tabs) ═══

document.addEventListener('keydown', (e) => {
  const tab = e.target.closest('.card-tab[role="tab"]');
  if (!tab) return;
  const tabs = [...tab.closest('.card-tabs').querySelectorAll('.card-tab')];
  const idx = tabs.indexOf(tab);

  if (e.key === 'ArrowRight' && idx < tabs.length - 1) {
    e.preventDefault();
    tabs[idx + 1].focus();
  } else if (e.key === 'ArrowLeft' && idx > 0) {
    e.preventDefault();
    tabs[idx - 1].focus();
  }
  // Manual activation: 用户按 Enter/Space 才切换 (onclick 处理)
});

// ═══ renderCard() 重写要点 ═══
// 1. 按 block.layer 分三组: L1 (layer===1 或 undefined), L2 (layer===2), L3 (layer===3)
// 2. 每组渲染到对应 panel 内
// 3. 删除旧 layer-controls（展开推导/面试视角按钮）
// 4. 如果某层无 blocks → 隐藏对应 tab（添加 hidden 属性到 tab 按钮）
```

---

### Phase 3 实施蓝图 — 新 Block Types

#### 3.1 CDN / 依赖

无新依赖。所有 block type 的 HTML 由 engine.js `renderBlock()` 生成。

#### 3.2 实施方式

`compare-panel`、`what-if`、`derivation-chain`、`timeline` 的完整 JS 代码和 CSS 已在 `references/interactive-components.md` §4-7 中写好。实施时：

1. 将每个 `case` 代码段复制到 `renderBlock()` 的 switch 中
2. 将对应 CSS 追加到 `style.css` 末尾
3. `stepper` 需要额外编写：
   - `stepperRender(uid)` — 读取当前 step index，渲染 desc + formula + visual
   - `stepperNav(uid, delta)` — 上一步 / 下一步
   - `stepperJump(uid, idx)` — dot 导航跳转
   - `renderStepperVisual(visual)` — 处理 matrix / code / diagram 三种可视化类型
4. 在 `showChapter()` 末尾，遍历所有 `[data-stepper-uid]` 元素，调用 `stepperRender(uid)`

#### 3.3 stepper 详细 DOM 结构

```html
<div class="stepper-block" data-stepper-uid="{uid}" data-steps='{stepsJSON}'>
  <div class="stepper-header">
    <span class="stepper-title">{title}</span>
    <span class="stepper-context">{context}</span>
  </div>
  <div class="stepper-controls">
    <button class="stepper-prev" onclick="stepperNav('{uid}', -1)"
            aria-label="上一步" disabled>←</button>
    <div class="stepper-dots" role="group" aria-label="步骤导航">
      <!-- dots rendered by stepperRender -->
    </div>
    <button class="stepper-next" onclick="stepperNav('{uid}', 1)"
            aria-label="下一步">→</button>
  </div>
  <div class="stepper-body" id="stepper-body-{uid}">
    <!-- stepperRender 动态填充 -->
  </div>
</div>
```

---

### Phase 4 实施蓝图 — 术语系统增强

#### 4a — Term Hover Tooltip

##### CDN / 依赖

```html
<!-- Floating UI — 仅定位计算，零 UI 渲染 -->
<script type="module">
  // Lazy import: 在第一次 tooltip show 时动态导入
  // import { computePosition, flip, shift, offset, autoUpdate }
  //   from 'https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.6.12/+esm';
</script>
```

**加载策略**: 不在 `<head>` 中静态加载。在第一次 `mouseenter` term-link 时动态 `import()`，缓存到模块变量。

##### DOM 结构

```html
<!-- 全局单例 tooltip，挂在 body 末尾 -->
<div id="termTooltip" class="term-tooltip" role="tooltip" aria-hidden="true">
  <div class="tt-term"></div>
  <div class="tt-oneliner"></div>
  <div class="tt-formula"></div>
  <div class="tt-action">点击查看完整卡片 →</div>
</div>
```

##### CSS

```css
.term-tooltip {
  position: absolute; top: 0; left: 0;
  z-index: 200;
  max-width: 320px; padding: 12px 16px;
  background: var(--bg); border: 1px solid var(--border);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  opacity: 0; pointer-events: none;
  transition: opacity 0.15s;
  font-size: 13px;
}
.term-tooltip.visible {
  opacity: 1; pointer-events: auto;
}
.tt-term {
  font-weight: 700; font-size: 14px; color: var(--accent);
  margin-bottom: 6px;
}
.tt-oneliner {
  color: var(--text2); line-height: 1.6; margin-bottom: 8px;
}
.tt-formula {
  text-align: center; margin-bottom: 8px;
}
.tt-action {
  font-size: 11px; color: var(--accent); font-weight: 500;
}
```

##### JS 事件流

```javascript
// ═══ Tooltip Singleton Manager ═══

let floatingUI = null;       // Lazy-loaded module
let tooltipCleanup = null;   // autoUpdate cleanup function
let tooltipShowTimer = null;
let tooltipHideTimer = null;

const TOOLTIP_SHOW_DELAY = 300;   // ms
const TOOLTIP_HIDE_DELAY = 200;   // ms

async function ensureFloatingUI() {
  if (!floatingUI) {
    floatingUI = await import(
      'https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.6.12/+esm'
    );
  }
  return floatingUI;
}

function showTermTooltip(termLinkEl) {
  clearTimeout(tooltipHideTimer);
  tooltipShowTimer = setTimeout(async () => {
    const nodeId = termLinkEl.dataset.nodeId;     // 从 applyTermLinks 设置
    const node = findGraphNode(nodeId);            // 从 knowledgeGraph 查找
    if (!node) return;

    const tip = document.getElementById('termTooltip');
    tip.querySelector('.tt-term').textContent = node.term;
    tip.querySelector('.tt-oneliner').textContent = node.oneliner || '';
    // 可选：如果 node 有 formula 字段
    tip.querySelector('.tt-formula').innerHTML = node.formula || '';

    tip.classList.add('visible');
    tip.setAttribute('aria-hidden', 'false');

    const { computePosition, flip, shift, offset, autoUpdate } =
      await ensureFloatingUI();

    if (tooltipCleanup) tooltipCleanup();

    tooltipCleanup = autoUpdate(termLinkEl, tip, () => {
      computePosition(termLinkEl, tip, {
        placement: 'top',
        middleware: [offset(8), flip(), shift({ padding: 8 })]
      }).then(({ x, y }) => {
        Object.assign(tip.style, { left: x + 'px', top: y + 'px' });
      });
    });

    // KaTeX render formula inside tooltip
    if (tip.querySelector('.tt-formula').textContent) {
      requestAnimationFrame(() => renderKaTeX(tip));
    }
  }, TOOLTIP_SHOW_DELAY);
}

function hideTermTooltip() {
  clearTimeout(tooltipShowTimer);
  tooltipHideTimer = setTimeout(() => {
    const tip = document.getElementById('termTooltip');
    tip.classList.remove('visible');
    tip.setAttribute('aria-hidden', 'true');
    if (tooltipCleanup) { tooltipCleanup(); tooltipCleanup = null; }
  }, TOOLTIP_HIDE_DELAY);
}

// ═══ Event Delegation (在 chapterContainer 上) ═══
// mouseenter .term-link → showTermTooltip(el)
// mouseleave .term-link → hideTermTooltip()
// focusin .term-link    → showTermTooltip(el)
// focusout .term-link   → hideTermTooltip()
// Escape               → hideTermTooltip() immediately
// Tooltip mouseenter   → clearTimeout(tooltipHideTimer)  防止移入 tooltip 时消失
// Tooltip mouseleave   → hideTermTooltip()

// ═══ Touch 设备：触摸时打开 drawer 而非 tooltip ═══
// @media (hover: none) 时, term-link click → openDrawer() (Phase 4b)
```

##### applyTermLinks() 改造

```javascript
// 现有 applyTermLinks() 生成的 <span class="term-link"> 需要添加:
//   data-node-id="{nodeId}"
//   aria-describedby="termTooltip"
//   tabindex="0" (使其可聚焦)
```

#### 4b — Knowledge Overlay Drawer

##### CDN / 依赖

```html
<!-- focus-trap：无障碍焦点锁定 -->
<script src="https://unpkg.com/tabbable@6.2.0/dist/index.umd.min.js"></script>
<script src="https://unpkg.com/focus-trap@7.6.2/dist/focus-trap.umd.min.js"></script>
```

**加载策略**: Drawer 首次打开时懒加载（检测 `window.focusTrap` 是否存在，不存在则动态创建 `<script>` 标签）。

##### DOM 结构

```html
<!-- 全局单例 Drawer，挂在 body 末尾 -->
<div id="knowledgeDrawer" class="knowledge-drawer" role="dialog"
     aria-modal="true" aria-label="知识详情" hidden>
  <div class="drawer-backdrop" onclick="closeDrawer()"></div>
  <div class="drawer-panel">
    <div class="drawer-header">
      <nav class="drawer-breadcrumb" aria-label="导航路径">
        <!-- 动态面包屑 -->
      </nav>
      <button class="drawer-close" onclick="closeDrawer()"
              aria-label="关闭">✕</button>
    </div>
    <div class="drawer-content" id="drawerContent">
      <!-- 动态渲染的卡片内容 -->
    </div>
  </div>
</div>
```

##### CSS

```css
.knowledge-drawer {
  position: fixed; inset: 0; z-index: 300;
  display: flex; justify-content: flex-end;
}
.knowledge-drawer[hidden] { display: none; }

.drawer-backdrop {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.4);
  animation: fadeIn 0.2s ease;
}

.drawer-panel {
  position: relative;
  width: 66vw; max-width: 800px;
  background: var(--bg); border-left: 1px solid var(--border);
  box-shadow: -8px 0 32px rgba(0,0,0,0.1);
  display: flex; flex-direction: column;
  transform: translateX(100%);
  animation: slideInRight 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  overflow-y: auto;
}

@keyframes slideInRight {
  to { transform: translateX(0); }
}
@keyframes slideOutRight {
  from { transform: translateX(0); }
  to   { transform: translateX(100%); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.drawer-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 20px;
  border-bottom: 1px solid var(--border);
  position: sticky; top: 0;
  background: var(--bg); z-index: 1;
}

.drawer-breadcrumb {
  display: flex; gap: 6px; align-items: center;
  font-size: 12px; color: var(--text3);
  overflow: hidden;
}
.drawer-breadcrumb .crumb {
  cursor: pointer; color: var(--accent);
  white-space: nowrap;
}
.drawer-breadcrumb .crumb:hover { text-decoration: underline; }
.drawer-breadcrumb .crumb-sep { color: var(--text3); }
.drawer-breadcrumb .crumb-current {
  color: var(--text); font-weight: 600;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}

.drawer-close {
  width: 32px; height: 32px; border-radius: 8px;
  border: 1px solid var(--border); background: var(--bg2);
  cursor: pointer; font-size: 16px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.drawer-close:hover { background: var(--bg3); }

.drawer-content {
  padding: 20px; flex: 1;
}

@media (max-width: 768px) {
  .drawer-panel {
    width: 100vw; max-width: none;
  }
}
```

##### JS 事件流

```javascript
// ═══ Drawer State ═══

let drawerStack = [];   // [{ chapterId, cardId, scrollTop }]
let drawerTrap = null;  // focus-trap instance

// ═══ Open Drawer ═══

async function openDrawer(chapterId, cardId) {
  const drawer = document.getElementById('knowledgeDrawer');
  const content = document.getElementById('drawerContent');

  // 如果已打开，保存当前 scroll 位置到 stack 顶部
  if (drawerStack.length > 0) {
    drawerStack[drawerStack.length - 1].scrollTop = content.scrollTop;
  }

  // Push to stack
  drawerStack.push({ chapterId, cardId, scrollTop: 0 });

  // 加载章节数据（复用 chapterCache）
  if (!chapterCache[chapterId]) {
    const chMeta = chapters.find(c => c.id === chapterId);
    if (!chMeta) return;
    const resp = await fetch(chMeta.file);
    chapterCache[chapterId] = await resp.json();
  }
  const chData = chapterCache[chapterId];
  const card = chData.cards.find(c => c.id === cardId);
  if (!card) return;

  // 渲染卡片内容（复用 renderCard + tab 系统）
  content.innerHTML = renderCardForDrawer(card);
  content.scrollTop = 0;

  // 渲染面包屑
  renderBreadcrumb();

  // 显示 drawer
  drawer.hidden = false;

  // KaTeX
  requestAnimationFrame(() => renderKaTeX(content));

  // Focus trap (lazy load)
  if (!drawerTrap) {
    // Ensure focus-trap is loaded
    if (!window.focusTrap) {
      await loadScript('https://unpkg.com/tabbable@6.2.0/dist/index.umd.min.js');
      await loadScript('https://unpkg.com/focus-trap@7.6.2/dist/focus-trap.umd.min.js');
    }
    drawerTrap = window.focusTrap.createFocusTrap(drawer, {
      escapeDeactivates: true,
      onDeactivate: () => closeDrawer(),
      allowOutsideClick: true,
    });
  }
  drawerTrap.activate();
}

// ═══ Close Drawer ═══

function closeDrawer() {
  const drawer = document.getElementById('knowledgeDrawer');
  if (drawerTrap) drawerTrap.deactivate();

  // 关闭动画
  const panel = drawer.querySelector('.drawer-panel');
  panel.style.animation = 'slideOutRight 0.2s ease forwards';
  setTimeout(() => {
    drawer.hidden = true;
    panel.style.animation = '';
    drawerStack = [];
  }, 200);

  // 恢复焦点到触发元素
  // (需要在 openDrawer 时保存 document.activeElement)
}

// ═══ Breadcrumb Navigation ═══

function renderBreadcrumb() {
  const nav = document.querySelector('.drawer-breadcrumb');
  nav.innerHTML = drawerStack.map((item, i) => {
    const chData = chapterCache[item.chapterId];
    const card = chData?.cards.find(c => c.id === item.cardId);
    const label = card?.title || item.cardId;

    if (i < drawerStack.length - 1) {
      return `<span class="crumb" onclick="drawerGoBack(${i})">${label}</span>`
           + `<span class="crumb-sep">›</span>`;
    }
    return `<span class="crumb-current">${label}</span>`;
  }).join('');
}

function drawerGoBack(index) {
  // Pop stack 到 index+1
  drawerStack = drawerStack.slice(0, index + 1);
  const { chapterId, cardId, scrollTop } = drawerStack[drawerStack.length - 1];
  // 重新渲染
  const content = document.getElementById('drawerContent');
  const chData = chapterCache[chapterId];
  const card = chData.cards.find(c => c.id === cardId);
  content.innerHTML = renderCardForDrawer(card);
  content.scrollTop = scrollTop;
  renderBreadcrumb();
  requestAnimationFrame(() => renderKaTeX(content));
}

// ═══ Drawer 内术语点击递归 ═══
// Drawer content 内的 .term-link click → openDrawer(newChapter, newCard)
// 这会 push 到 drawerStack，面包屑自动更新

// ═══ Helper ═══
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src; s.onload = resolve; s.onerror = reject;
    document.head.appendChild(s);
  });
}
```

##### ARIA 说明

- Drawer `role="dialog" aria-modal="true"` — 屏幕阅读器识别为模态
- `focus-trap` 确保 Tab 键只在 drawer 内循环
- `Escape` 关闭 drawer（由 focus-trap `escapeDeactivates` 处理）
- 关闭后焦点返回触发元素

---

### Phase 5 实施蓝图 — 卡片 Header 增强

#### 5.1 DOM 变更

在 `renderCard()` 输出的 `.card-head` 中添加：

```html
<div class="card-head" onclick="toggleCard(this)">
  <span class="card-icon" style="background:{iconBg}">{icon}</span>
  <div class="card-head-text">
    <h3 class="card-title">{title}</h3>
    <p class="card-subtitle">{subtitle}</p>
  </div>
  <div class="card-meta">
    <!-- 难度 badge -->
    <span class="card-badge badge-{badgeClass}">{badge}</span>
    <!-- 学习状态 dot -->
    <span class="card-status card-status-{status}" aria-label="{statusLabel}"></span>
  </div>
  <span class="card-arrow" aria-hidden="true">▸</span>
</div>
```

#### 5.2 CSS

```css
.card-meta { display: flex; align-items: center; gap: 8px; margin-left: auto; margin-right: 8px; }

/* Difficulty badges */
.card-badge {
  font-size: 11px; font-weight: 600; padding: 2px 10px;
  border-radius: 99px; white-space: nowrap;
}
.badge-必考 { background: rgba(239,68,68,0.12); color: var(--accent4); }
.badge-高频 { background: rgba(245,158,11,0.12); color: var(--accent3); }
.badge-加分 { background: rgba(99,102,241,0.12); color: var(--accent); }
.badge-深水区 { background: rgba(139,92,246,0.12); color: var(--accent5); }

/* Study status dot */
.card-status {
  width: 8px; height: 8px; border-radius: 50%;
  flex-shrink: 0;
}
.card-status-new       { background: var(--text3); }       /* 灰：未学习 */
.card-status-learning  { background: var(--accent6); }     /* 蓝：学习中 */
.card-status-review    { background: var(--accent3); }     /* 橙：待复习 */
.card-status-mastered  { background: var(--accent2); }     /* 绿：已掌握 */
```

#### 5.3 JS

```javascript
function getCardStudyStatus(cardId) {
  // 扫描 localStorage 中该 card 的 SRS 记录
  // 返回 'new' | 'learning' | 'review' | 'mastered'
  const prefix = `ai-study:srs:${cardId}:`;
  let hasAny = false, allMastered = true, anyDue = false;
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith(prefix)) {
      hasAny = true;
      const data = JSON.parse(localStorage.getItem(key));
      if (data.state !== 'mastered') allMastered = false;
      if (data.dueAt && data.dueAt <= Date.now()) anyDue = true;
    }
  }
  if (!hasAny) return 'new';
  if (allMastered) return 'mastered';
  if (anyDue) return 'review';
  return 'learning';
}

// 在 renderCard() 中调用 getCardStudyStatus(card.id) 获取状态
// badge 从 card JSON 的 badge 字段读取（如果存在）
```

---

### Phase 6 实施蓝图 — 章节叙事结构

#### 6a — Chapter Big Map

##### DOM 结构

```html
<!-- 在 chapter-header 和第一张 card 之间 -->
<div class="chapter-map" id="chapterMap-{chapterId}">
  <svg class="chapter-map-svg" viewBox="0 0 {width} {height}"
       role="img" aria-label="章节知识结构图">
    <!-- 连接线 -->
    <line class="map-edge" x1=".." y1=".." x2=".." y2=".."/>
    <!-- 节点 -->
    <g class="map-node" data-card="{cardId}"
       onclick="scrollToCard('{cardId}')" tabindex="0" role="button">
      <rect rx="8" ry="8" width=".." height="32" fill=".."/>
      <text>{label}</text>
    </g>
  </svg>
</div>
```

**技术选择**: 纯 SVG + CSS。节点数 <10，使用手动坐标（从 JSON `map.nodes[].level` 计算行列位置），不引入 D3 或 Dagre。

##### CSS

```css
.chapter-map {
  margin: 16px 0 24px; padding: 16px;
  background: var(--bg2); border-radius: 12px;
  border: 1px solid var(--border);
  overflow-x: auto;
}
.chapter-map-svg { width: 100%; height: auto; }
.map-edge { stroke: var(--border); stroke-width: 2; }
.map-node rect { fill: var(--bg); stroke: var(--accent); stroke-width: 1.5; cursor: pointer; transition: fill 0.15s; }
.map-node:hover rect { fill: rgba(99,102,241,0.08); }
.map-node.active rect { fill: rgba(99,102,241,0.15); stroke-width: 2; }
.map-node text { font-size: 12px; fill: var(--text); dominant-baseline: central; text-anchor: middle; pointer-events: none; }
```

##### JS

```javascript
function renderChapterMap(mapData, chapterId) {
  if (!mapData || mapData.type !== 'flow') return '';
  const nodes = mapData.nodes || [];
  const edges = mapData.edges || [];

  // 按 level 分行，每行节点居中
  const levels = {};
  nodes.forEach(n => { (levels[n.level] = levels[n.level] || []).push(n); });

  const NODE_W = 140, NODE_H = 32, GAP_X = 20, GAP_Y = 60;
  const maxPerRow = Math.max(...Object.values(levels).map(a => a.length));
  const svgW = maxPerRow * (NODE_W + GAP_X);
  const svgH = Object.keys(levels).length * (NODE_H + GAP_Y);

  // Assign x, y to each node
  const pos = {};
  Object.entries(levels).sort(([a],[b]) => a - b).forEach(([level, ns], rowIdx) => {
    const totalW = ns.length * NODE_W + (ns.length - 1) * GAP_X;
    const startX = (svgW - totalW) / 2;
    ns.forEach((n, colIdx) => {
      pos[n.id] = { x: startX + colIdx * (NODE_W + GAP_X), y: rowIdx * (NODE_H + GAP_Y) };
    });
  });

  // Render edges
  let edgeSvg = edges.map(([from, to]) => {
    const f = pos[from], t = pos[to];
    if (!f || !t) return '';
    return `<line class="map-edge" x1="${f.x + NODE_W/2}" y1="${f.y + NODE_H}" x2="${t.x + NODE_W/2}" y2="${t.y}"/>`;
  }).join('');

  // Render nodes
  let nodeSvg = nodes.map(n => {
    const p = pos[n.id];
    return `<g class="map-node" data-card="${n.id}" onclick="scrollToCard('${n.id}')" tabindex="0" role="button">
      <rect x="${p.x}" y="${p.y}" width="${NODE_W}" height="${NODE_H}" rx="8" ry="8"/>
      <text x="${p.x + NODE_W/2}" y="${p.y + NODE_H/2}">${escHtml(n.label)}</text>
    </g>`;
  }).join('');

  return `<div class="chapter-map"><svg class="chapter-map-svg" viewBox="0 0 ${svgW} ${svgH}" role="img" aria-label="章节知识结构图">${edgeSvg}${nodeSvg}</svg></div>`;
}

// 当 IntersectionObserver 激活某 card → 对应 map-node 加 .active
```

#### 6b — Glue Text

##### JSON 格式

```json
{
  "type": "glue",
  "text": "理解了 QKV 的来源后，下一个问题是：Q 和 K 的点积到底在算什么？为什么需要缩放？"
}
```

##### DOM

```html
<div class="glue-text">
  <span class="glue-arrow" aria-hidden="true">⤷</span>
  <p>{text with applyTermLinks}</p>
</div>
```

##### CSS

```css
.glue-text {
  display: flex; gap: 10px; align-items: flex-start;
  padding: 12px 20px; margin: 8px 0;
  font-size: 14px; color: var(--text2);
  font-style: italic; line-height: 1.7;
}
.glue-arrow { color: var(--accent); font-size: 18px; flex-shrink: 0; margin-top: 2px; }
```

##### JS

在 `renderChapter()` 的 cards 循环中，检查 `card.type === 'glue'` → 渲染 glue-text 代替 card。

---

### Phase 7 实施蓝图 — 三大视图

#### 7a — Learning View

Phase 1-6 完成后的默认视图，无额外代码。

#### 7b — Explorer View (Knowledge Map)

##### CDN / 依赖

```html
<!-- D3.js v7 — 懒加载，首次打开 Knowledge Map 时才导入 -->
<script type="module">
  // 按需导入（不在首屏加载）:
  // 方案 A: 分模块导入（更小）
  // import { forceSimulation, forceLink, forceManyBody, forceCenter, forceCollide }
  //   from 'https://cdn.jsdelivr.net/npm/d3-force@3.0.0/+esm';
  // import { select } from 'https://cdn.jsdelivr.net/npm/d3-selection@3.0.0/+esm';
  // import { zoom, zoomIdentity } from 'https://cdn.jsdelivr.net/npm/d3-zoom@3.0.0/+esm';
  // import { drag } from 'https://cdn.jsdelivr.net/npm/d3-drag@3.0.0/+esm';
  //
  // 方案 B: 全量导入（简单，~92KB gzip）
  // import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
</script>
```

**推荐方案 B**（全量导入），理由：分模块导入需管理版本一致性，且 D3 v7 的 tree-shaking 不完美。~92KB gzip 对懒加载可接受。

##### DOM

```html
<!-- 全屏 overlay -->
<div id="knowledgeMap" class="kmap-overlay" hidden
     role="dialog" aria-modal="true" aria-label="知识图谱">
  <div class="kmap-header">
    <h2>知识图谱</h2>
    <div class="kmap-search">
      <input type="text" id="kmapSearch" placeholder="搜索术语..."
             aria-label="搜索术语" />
    </div>
    <button class="kmap-close" onclick="closeKnowledgeGraph()"
            aria-label="关闭">✕</button>
  </div>
  <svg id="kmapSvg" class="kmap-svg">
    <!-- D3 渲染到此 SVG -->
  </svg>
  <div class="kmap-legend" aria-label="图例">
    <!-- 按 navGroup 颜色渲染图例 -->
  </div>
</div>
```

##### D3 Force 配置

```javascript
const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(links)
    .id(d => d.id)
    .distance(d => d.sameChapter ? 50 : 85))
  .force('charge', d3.forceManyBody().strength(-160))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('collide', d3.forceCollide(d => d.radius + 4))
  .alphaDecay(0.02);

// Zoom
const zoomBehavior = d3.zoom()
  .scaleExtent([0.4, 4])
  .on('zoom', (event) => {
    g.attr('transform', event.transform);
  });
svg.call(zoomBehavior);
svg.on('dblclick.zoom', null);  // 禁用双击缩放

// Drag
function dragSubject(event) {
  return simulation.find(event.x, event.y);
}
const dragBehavior = d3.drag()
  .on('start', (event, d) => {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x; d.fy = d.y;
  })
  .on('drag', (event, d) => {
    d.fx = event.x; d.fy = event.y;
  })
  .on('end', (event, d) => {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null; d.fy = null;
  });

// Node rendering
// 圆形节点，半径按 related.length 缩放（min 6, max 16）
// 颜色 = 所属 chapter 的 dotColor
// 点击 → closeKnowledgeGraph() + goToCard(chapterId, cardId)
// Hover → 高亮连接边 + 显示 tooltip
```

##### 搜索高亮

```javascript
function searchKnowledgeMap(query) {
  const q = query.toLowerCase();
  nodeElements.classed('kmap-dim', d =>
    !d.term.toLowerCase().includes(q) &&
    !(d.aliases || []).some(a => a.toLowerCase().includes(q))
  );
  nodeElements.classed('kmap-highlight', d =>
    d.term.toLowerCase().includes(q) ||
    (d.aliases || []).some(a => a.toLowerCase().includes(q))
  );
}
```

#### 7c — Training View (Interview Mode + SRS)

##### SRS 数据存储

```javascript
// localStorage key: ai-study:srs
// 完整 schema:
const srsStore = {
  version: 1,
  algorithm: 'sm2',
  cards: {
    // key = `${cardId}:${qHash}` (qHash = 问题文本的简单 hash)
    'scaled-dot-product:a1b2c3': {
      cardId: 'scaled-dot-product',
      state: 'review',          // 'new' | 'learning' | 'review' | 'mastered'
      dueAt: 1711612800000,     // Unix ms
      lastReviewedAt: 1711526400000,
      reps: 3,
      lapses: 0,
      intervalDays: 6,
      easeFactor: 2.5,
      // FSRS-ready (Phase 9 migration)
      stability: null,
      difficulty: null,
      learningSteps: 0,
      scheduledDays: 6,
      elapsedDays: 6,
      createdAt: 1711267200000,
      updatedAt: 1711612800000,
    }
  },
  reviews: [
    // Append-only log — NEVER delete entries
    {
      id: 'rev_xxx',
      cardId: 'scaled-dot-product',
      qHash: 'a1b2c3',
      reviewedAt: 1711612800000,
      grade: 'good',             // 'again' | 'hard' | 'good' | 'easy'
      gradeValue: 3,             // SM-2: 0-5
      algorithm: 'sm2',
      stateBefore: 'review',
      stateAfter: 'review',
      dueBefore: 1711612800000,
      dueAfter: 1712131200000,
      intervalBeforeDays: 6,
      intervalAfterDays: 12,
      easeFactorBefore: 2.5,
      easeFactorAfter: 2.6,
      elapsedDays: 6,
      durationMs: 5000,
    }
  ]
};
```

##### SM-2 实现

```javascript
const DAY = 86400000; // ms

function reviewSM2(card, grade, now) {
  // grade mapping: 'again'→1, 'hard'→2, 'good'→3, 'easy'→5
  const gradeMap = { again: 1, hard: 2, good: 3, easy: 5 };
  const q = gradeMap[grade] || 3;

  const prev = { ...card };

  if (card.easeFactor == null) card.easeFactor = 2.5;

  if (q >= 3) {
    if (card.reps === 0) card.intervalDays = 1;
    else if (card.reps === 1) card.intervalDays = 6;
    else card.intervalDays = Math.ceil(card.intervalDays * card.easeFactor);
    card.reps += 1;
    card.state = card.intervalDays >= 21 ? 'mastered' : 'review';
  } else {
    card.lapses += 1;
    card.reps = 0;
    card.intervalDays = 1;
    card.state = 'learning';
  }

  card.easeFactor = card.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (card.easeFactor < 1.3) card.easeFactor = 1.3;

  card.dueAt = now + card.intervalDays * DAY;
  card.lastReviewedAt = now;
  card.updatedAt = now;

  return { card, prev };
}

function getDueCards(now) {
  const store = loadSRSStore();
  return Object.values(store.cards)
    .filter(c => c.dueAt <= now || c.state === 'new')
    .sort((a, b) => (a.dueAt || 0) - (b.dueAt || 0));
}
```

##### Training View DOM

```html
<div id="trainingView" class="training-overlay" hidden
     role="dialog" aria-modal="true" aria-label="面试训练">
  <div class="training-header">
    <div class="training-progress">
      <span id="trainingCount">0/0</span>
      <div class="training-progress-bar">
        <div class="training-progress-fill" id="trainingFill"></div>
      </div>
    </div>
    <button class="training-close" onclick="closeTraining()"
            aria-label="退出">✕</button>
  </div>

  <div class="training-card" id="trainingCard">
    <div class="training-question" id="trainingQ">
      <!-- memory block 问题 -->
    </div>
    <div class="training-answer" id="trainingA" hidden>
      <!-- memory block 答案 -->
    </div>
  </div>

  <div class="training-actions" id="trainingActions">
    <!-- 翻牌前 -->
    <button class="training-reveal" onclick="revealTrainingAnswer()"
            aria-label="显示答案">
      显示答案 <kbd>Space</kbd>
    </button>
    <!-- 翻牌后（hidden 切换） -->
    <div class="training-grades" hidden>
      <button class="grade-btn grade-again" onclick="gradeTraining('again')">
        没记住 <kbd>1</kbd>
      </button>
      <button class="grade-btn grade-hard" onclick="gradeTraining('hard')">
        模糊 <kbd>2</kbd>
      </button>
      <button class="grade-btn grade-good" onclick="gradeTraining('good')">
        记住了 <kbd>3</kbd>
      </button>
      <button class="grade-btn grade-easy" onclick="gradeTraining('easy')">
        轻松 <kbd>4</kbd>
      </button>
    </div>
  </div>

  <!-- Session 结束统计 -->
  <div class="training-summary" id="trainingSummary" hidden>
    <!-- 动态渲染 -->
  </div>
</div>
```

##### 快捷键

```javascript
// Training View 内的键盘绑定:
// Space → revealTrainingAnswer() (翻牌)
// 1     → gradeTraining('again')
// 2     → gradeTraining('hard')
// 3     → gradeTraining('good')
// 4     → gradeTraining('easy')
// Escape → closeTraining()
```

#### 7d — Dashboard

##### DOM

```html
<div id="dashboard" class="dashboard-overlay" hidden>
  <div class="dashboard-header">
    <h2>学习仪表盘</h2>
    <button class="dashboard-close" onclick="closeDashboard()">✕</button>
  </div>
  <div class="dashboard-body">
    <div class="dash-stats">
      <div class="dash-stat">
        <span class="dash-stat-num" id="dashDue">0</span>
        <span class="dash-stat-label">待复习</span>
      </div>
      <div class="dash-stat">
        <span class="dash-stat-num" id="dashMastered">0</span>
        <span class="dash-stat-label">已掌握</span>
      </div>
      <div class="dash-stat">
        <span class="dash-stat-num" id="dashTotal">0</span>
        <span class="dash-stat-label">总卡片</span>
      </div>
    </div>
    <div class="dash-chapters" id="dashChapters">
      <!-- 每章一行 progress bar -->
    </div>
    <div class="dash-actions">
      <button class="dash-start" onclick="startTraining()">开始刷题</button>
    </div>
  </div>
</div>
```

---

### Phase 8 实施蓝图 — 锦上添花

#### 8a — Command Palette

##### CDN / 依赖

```html
<!-- Fuse.js — 模糊搜索，首次 ⌘+K 时懒加载 -->
<script type="module">
  // import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.1.0/dist/fuse.mjs';
</script>
```

##### DOM

```html
<div id="commandPalette" class="cmd-palette" hidden
     role="dialog" aria-modal="true" aria-label="快速搜索">
  <div class="cmd-backdrop" onclick="closeCommandPalette()"></div>
  <div class="cmd-panel">
    <div class="cmd-input-wrapper" role="combobox"
         aria-expanded="true" aria-haspopup="listbox"
         aria-owns="cmdResults">
      <span class="cmd-icon" aria-hidden="true">🔍</span>
      <input type="text" id="cmdInput" class="cmd-input"
             placeholder="搜索卡片、术语、章节..."
             aria-autocomplete="list"
             aria-controls="cmdResults"
             aria-activedescendant=""
             autocomplete="off" />
      <kbd class="cmd-esc">ESC</kbd>
    </div>
    <ul id="cmdResults" class="cmd-results" role="listbox">
      <!-- 动态渲染 -->
    </ul>
  </div>
</div>
```

##### ARIA 完整模型

```
role="dialog" aria-modal="true"
  └── role="combobox" aria-expanded="true" aria-owns="cmdResults"
        └── input aria-autocomplete="list" aria-controls="cmdResults" aria-activedescendant="{activeId}"
  └── role="listbox" id="cmdResults"
        └── role="option" id="cmd-{i}" aria-selected="true|false"
```

##### JS

```javascript
let fuse = null;
let cmdIndex = [];      // 搜索索引: [{ type, id, title, chapter, ... }]
let cmdActiveIdx = -1;

async function openCommandPalette() {
  const palette = document.getElementById('commandPalette');
  palette.hidden = false;
  document.getElementById('cmdInput').focus();

  if (!fuse) {
    const Fuse = (await import(
      'https://cdn.jsdelivr.net/npm/fuse.js@7.1.0/dist/fuse.mjs'
    )).default;

    // 构建索引
    cmdIndex = [];
    // 1. 章节
    chapters.forEach(ch => {
      cmdIndex.push({ type: 'chapter', id: ch.id, title: ch.title, group: '📚 章节' });
    });
    // 2. 所有卡片
    for (const ch of chapters) {
      const data = chapterCache[ch.id];
      if (data) {
        data.cards.filter(c => c.type !== 'glue').forEach(card => {
          cmdIndex.push({
            type: 'card', id: card.id, chapterId: ch.id,
            title: card.title, subtitle: card.subtitle, group: '📝 卡片'
          });
        });
      }
    }
    // 3. 知识图谱术语
    if (knowledgeGraph) {
      knowledgeGraph.nodes.forEach(n => {
        cmdIndex.push({
          type: 'term', id: n.id, chapterId: n.chapter_id, cardId: n.card_id,
          title: n.term, oneliner: n.oneliner, group: '🔗 术语',
          aliases: n.aliases
        });
      });
    }

    fuse = new Fuse(cmdIndex, {
      keys: ['title', 'subtitle', 'oneliner', 'aliases'],
      threshold: 0.4,
      includeScore: true,
    });
  }
}

function closeCommandPalette() {
  document.getElementById('commandPalette').hidden = true;
  document.getElementById('cmdInput').value = '';
  document.getElementById('cmdResults').innerHTML = '';
}

// ⌘+K / Ctrl+K 监听
document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    const palette = document.getElementById('commandPalette');
    palette.hidden ? openCommandPalette() : closeCommandPalette();
  }
});

// Input → search → render results
// ArrowUp/Down → navigate results (update aria-activedescendant)
// Enter → execute selected result (goToCard / showChapter / openDrawer)
// Escape → close
```

#### 8b — 移动端 Bottom Tab Bar

##### DOM

```html
<nav class="mobile-bar" id="mobileBar" aria-label="移动端导航">
  <button class="mobile-tab active" data-view="learn" onclick="switchMobileTab('learn')">
    <span class="mobile-tab-icon">📚</span>
    <span class="mobile-tab-label">目录</span>
  </button>
  <button class="mobile-tab" data-view="search" onclick="switchMobileTab('search')">
    <span class="mobile-tab-icon">🔍</span>
    <span class="mobile-tab-label">搜索</span>
  </button>
  <button class="mobile-tab" data-view="train" onclick="switchMobileTab('train')">
    <span class="mobile-tab-icon">🎯</span>
    <span class="mobile-tab-label">刷题</span>
  </button>
  <button class="mobile-tab" data-view="stats" onclick="switchMobileTab('stats')">
    <span class="mobile-tab-icon">📊</span>
    <span class="mobile-tab-label">统计</span>
  </button>
</nav>
```

##### CSS

```css
.mobile-bar {
  display: none;                          /* 桌面端隐藏 */
  position: fixed; bottom: 0; left: 0; right: 0;
  height: 56px; z-index: 200;
  background: var(--bg); border-top: 1px solid var(--border);
  padding-bottom: env(safe-area-inset-bottom);   /* iPhone notch */
}
@media (max-width: 768px) {
  .mobile-bar { display: flex; }
  .main { padding-bottom: calc(56px + env(safe-area-inset-bottom) + 24px); }
}
.mobile-tab {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 2px;
  background: none; border: none; cursor: pointer;
  color: var(--text3); font-size: 10px;
  transition: color 0.15s;
}
.mobile-tab.active { color: var(--accent); }
.mobile-tab-icon { font-size: 20px; }
.mobile-tab-label { font-weight: 500; }
```

#### 8c — 专注阅读模式

```javascript
// F 键切换
let focusMode = false;
document.addEventListener('keydown', (e) => {
  if (e.key === 'f' && !e.target.closest('input,textarea,[contenteditable]')) {
    focusMode = !focusMode;
    document.body.classList.toggle('focus-mode', focusMode);
  }
});
```

```css
.focus-mode .sidebar,
.focus-mode .pill-nav,
.focus-mode .card-meta,
.focus-mode .mobile-bar { display: none !important; }
.focus-mode .main {
  margin-left: auto; max-width: 700px;
}
```

#### 8d — Notes Layer

```javascript
// 在 renderCard() 的 card-body 末尾添加:
function renderNotesArea(chapterId, cardId) {
  const key = `ai-study:notes:${chapterId}:${cardId}`;
  const saved = localStorage.getItem(key) || '';
  return `<div class="card-notes">
    <button class="notes-toggle" onclick="this.nextElementSibling.hidden = !this.nextElementSibling.hidden">
      📝 笔记
    </button>
    <div class="notes-area" hidden>
      <textarea class="notes-input" placeholder="在此添加笔记..."
        oninput="localStorage.setItem('${key}', this.value)"
      >${escHtml(saved)}</textarea>
    </div>
  </div>`;
}
```

---

### 外部依赖汇总

| 库 | 版本 | 大小 (gzip) | 加载时机 | CDN 地址 |
|----|------|------------|---------|---------|
| **Floating UI DOM** | 1.6.12 | ~3KB | 首次 tooltip show | `https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.6.12/+esm` |
| **focus-trap** | 7.6.2 | ~4KB | 首次 Drawer open | `https://unpkg.com/focus-trap@7.6.2/dist/focus-trap.umd.min.js` |
| **tabbable** | 6.2.0 | ~2KB | focus-trap 依赖 | `https://unpkg.com/tabbable@6.2.0/dist/index.umd.min.js` |
| **D3.js** | 7.9.0 | ~92KB | 首次 Knowledge Map | `https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm` |
| **Fuse.js** | 7.1.0 | ~6.3KB | 首次 ⌘+K | `https://cdn.jsdelivr.net/npm/fuse.js@7.1.0/dist/fuse.mjs` |

**首屏加载**: 零额外依赖（仅 KaTeX CDN，已有）。所有新依赖均为懒加载。

---

### Sidebar 系统按钮

Sidebar 底部添加系统功能入口（在 expanded 态下可见）：

```html
<div class="sidebar-system-buttons">
  <button class="sidebar-sys-btn" onclick="showKnowledgeGraph()" title="知识图谱">
    <span class="nav-item-icon">🗺️</span>
    <span class="nav-item-text">知识图谱</span>
  </button>
  <button class="sidebar-sys-btn" onclick="startTraining()" title="面试训练">
    <span class="nav-item-icon">🎯</span>
    <span class="nav-item-text">面试训练</span>
  </button>
  <button class="sidebar-sys-btn" onclick="showDashboard()" title="学习仪表盘">
    <span class="nav-item-icon">📊</span>
    <span class="nav-item-text">仪表盘</span>
  </button>
</div>
```
