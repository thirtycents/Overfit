# Project Progress

> Agent: Read this file at the start of every conversation to restore context.
> Also read MEMORY.md for project architecture overview.
> Update this file after every atomic operation. Don't batch updates.

## Status Legend
```
- [ ] item                                     ← Not started
- [~] item｜done: a, b｜current: c｜todo: d    ← In progress
- [x] item                                     ← Complete (frozen)
```

---

## Architecture — DONE
- [x] Analyze knowledge.html, extract CSS and chapter structure
- [x] Create assets/style.css, assets/engine.js
- [x] Create chapters.json, knowledge_graph.json, index.html
- [x] Verify architecture runs

## Frontend P0 — DONE
- [x] KaTeX math rendering
- [x] interactive-formula slider
- [x] Memory Q&A self-test
- [x] Color scheme + max-width layout
- [x] Card three-layer progressive expand

Note: P0 completed and browser-verified 2026-03-28. Warm light theme, right-side TOC, URL routing.

## Frontend Refactoring — IN PROGRESS

> Full plan: `references/refactoring-proposal.md`
> Supersedes old P1/P2 backlog (reorganized into Phases below)

### Phase 1 — Layout 重塑
- [ ] 删除右侧 TOC panel（index.html + style.css）
- [ ] Sidebar 折叠为 60px icon rail（CSS + buildSidebar 改造）
- [ ] Sidebar overlay 展开（280px + backdrop）
- [ ] Main 内容区 max-width: 800px 居中
- [ ] Sticky chapter pill nav（替代 TOC）
- [ ] IntersectionObserver 追踪当前卡片
- [ ] Scroll progress bar（顶部 3px）

### Phase 2 — Card Tab 系统
- [ ] renderCard() 重写：L1/L2/L3 分组为 tab
- [ ] switchLayer() tab 切换函数
- [ ] Tab 颜色区分（indigo/purple/green）
- [ ] 删除旧 layer-controls（展开推导/面试视角按钮）
- [ ] KaTeX lazy re-render on tab switch

### Phase 3 — 新 Block Types
- [ ] `compare-panel` block（spec 已有代码）
- [ ] `what-if` block（spec 已有代码）
- [ ] `derivation-chain` block（spec 已有代码）
- [ ] `timeline` block（spec 已有代码）
- [ ] `stepper` block（需写 stepperRender + stepperNav）

### Phase 4 — 术语系统增强
- [ ] Term hover tooltip（显示 oneliner + 核心公式）
- [ ] 2/3 width overlay drawer（点击术语 → 加载目标卡片）
- [ ] Drawer 内 term-link 递归 + 面包屑

### Phase 5 — 卡片 Header 增强
- [ ] Difficulty badge（必考/高频/加分/深水区）
- [ ] Study status dot（localStorage SRS 数据）

### Phase 6 — 章节叙事结构
- [ ] Chapter Big Map（章首 SVG/CSS 流程图）
- [ ] Glue text（卡片间衔接段落）
- [ ] JSON schema 扩展（map + glue 字段）

### Phase 7 — 三大视图
- [ ] Learning View（Phase 1-6 的增强版，默认视图）
- [ ] Explorer View — Knowledge Map（D3.js force graph）
- [ ] Training View — Interview Mode + SRS（SM-2）
- [ ] Dashboard（学习进度 + due cards）

### Phase 8 — 锦上添花
- [ ] Command Palette（⌘+K / Ctrl+K 全局搜索）
- [ ] 移动端 bottom tab bar
- [ ] 专注阅读模式（F 键）
- [ ] Notes layer（per-card localStorage）

### Phase 9 — 远期
- [ ] Code sandbox（Pyodide）
- [ ] Comparison Lab（跨卡片对比）
- [ ] Red Flag 陷阱地图
- [ ] engine.js ES Module 拆分（>1500 行时）

---

## Content — Frozen Chapters
- [x] ch-transformer — 4 cards (WHY→Overview→QKV→Scaled Dot-Product)
- [x] ch-transformer-arch — 3 cards (MHA→Positional Encoding→Full Architecture)
- [x] ch-nn-basics — 5 cards (backprop, activation, batch-norm, dropout, weight-init)
- [x] ch-ml-classical — 5 cards (linear/logistic regression, svm, decision-tree, xgboost)
- [x] ch-evaluation — 5 cards (precision-recall-f1, roc-auc, cross-entropy, focal-loss, regression-losses)
- [x] ch-optimization — 5 cards (sgd-momentum, adam-adamw, lr-schedule, gradient-vanish-explode, regularization)
- [x] ch-transformer-advanced — 4 cards (sparse attention, training tricks)
- [x] ch-transformer-inference — 4 cards (KV Cache, speculative decoding, quantization)
- [x] ch-llm-alignment — 5 cards (DPO vs RLHF, timeliness dates)
- [x] ch-linear-algebra
- [x] ch-probability
- [x] ch-algorithms
- [x] ch-numerical

## Content — Backlog 
These are candidates. Do NOT start unless user explicitly requests:
- ? 强化学习基础 (MDP/Q-Learning/Policy Gradient)
- ? 扩散模型 (DDPM/DDIM/Score Matching)
- ? 多模态 (CLIP/ViT/LLaVA)
- ? 系统设计 (模型部署/推理优化/量化)
- ? 手撕代码专题
- ? 推理与 Agent (CoT/ToT/ReAct/Tool Use) ← 2025-2026 热点

---

## Project Files Updated This Session
- 2026-03-28: Added root `.gitignore` to exclude `.sisyphus/`, `tmp-research/`, logs, and common Windows/editor junk
- 2026-03-28: Created `MEMORY.md` (project architecture memory)
- 2026-03-28: Created `references/refactoring-proposal.md` (9-phase plan)
- 2026-03-28: Reorganized PROGRESS.md (old P1/P2 → Phase 1-9)
- 2026-03-28: Added §九 实施蓝图 to `refactoring-proposal.md` (per-phase DOM/CSS/JS/ARIA blueprint with tech selections)
- 2026-03-28: Updated `AGENTS.md` (Priority Decision Tree + Project Architecture)
- 2026-03-28: Updated `references/json-formats.md` (added compare-panel, what-if, derivation-chain, timeline, stepper, map, glue schemas)
- 2026-03-28: Updated `references/interactive-components.md` (added Term Tooltip + Overlay Drawer specs)
- 2026-03-28: Updated `MEMORY.md` (added new dependencies + lazy-load strategy)

## Timeliness Watch
- ch-llm-alignment: GRPO/DAPO/GSPO/DeepSeek-R1 in rapid evolution (as of 2026-03)

## Bug Fix Log
- 2026-03-28: Card default collapsed, accent6 defined, visual overhaul, warm light theme, right-side TOC, URL routing fix
