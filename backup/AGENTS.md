# AI/ML 备考手册 — Agent 工作手册

## 你是谁，你在做什么

你是这个项目的唯一开发者 agent。项目目标是打造一个**求职导向**的 AI/ML 面试备考网站：
让零基础初学者能**真正学会、记住、并能在面试中脱口而出**。

你的最终用户画像：想进入 AI/ML 行业的初学者。他们需要：
1. **理解原理**（不是死记硬背，而是建立直觉后自然记住）
2. **会说行话**（面试时能用专业术语流利表达）
3. **能手撕代码**（白板写出核心算法）
4. **知道最新动态**（面试官会问 2024-2026 年的新技术）

---

## 项目架构
```
ai-study/
├── AGENTS.md                 ← 你正在读的文件，每次对话开始必须先读
├── knowledge.html            ← 原始单文件，只读参考，永远不要修改
├── index.html                ← 新的极简壳子
├── assets/
│   ├── style.css             ← 全局样式
│   └── engine.js             ← 渲染引擎
├── tools/
│   └── extract_index.py      ← MD 融合预处理脚本
├── chapters.json             ← 章节目录索引
├── knowledge_graph.json      ← 知识点全局索引
├── content/
│   ├── ch-transformer.json
│   ├── ch-llm-alignment.json
│   └── ...
├── source-md/                ← 原始笔记素材（只读）
└── source-index/             ← 预处理后的片段索引（由脚本生成）
    ├── manifest.json
    └── ...
```

### 章节命名规则

语义化命名，不用序号：`ch-transformer.json` 不是 `ch1.json`。

新增章节时：
1. 创建 `content/ch-{name}.json`
2. 在 `chapters.json` 注册
3. 在 AGENTS.md 进度表加一行

---

## 文件操作规则

写文件前先判断文件是否存在：
- 文件不存在 → write 创建
- 文件已存在，< 100 行 → read 全文 → 内存修改 → write 覆盖
- 文件已存在，> 100 行 → edit 局部修改
- 看到 "File already exists. Use edit tool instead." → 立即切换策略
- 同一操作失败超过 2 次 → 停下来报告

edit 卡在 "Preparing edit..." 超过 10 秒 → 放弃 edit，改用 read + write 覆盖。

---

## Context 管理规则

### 单次对话的读取策略

必读：AGENTS.md

按需读：
- knowledge_graph.json：需要查 id 或注册新知识点时读，续写已有章节只读前 50 行
- content/ch-xxx.json：只读当前任务那一个

禁止：
- 同一次对话读多个 content/ 文件
- 主动读 knowledge.html 全文

### 单个 content 文件大小限制

不超过 350 行。写到 300 行时评估是否拆分：
- 内容是独立知识领域 → 拆成新章节
- 同领域更多细节 → 压缩已有内容

拆分时：创建新文件 → 注册 chapters.json → 更新进度表 → 原文件不回头改。

---

## 实时进度追踪规则

### 核心原则

每完成一个原子操作立刻更新 AGENTS.md 进度表。不等任务全部完成。

### 进度表格式
```
- [ ] ch-xxx                           ← 未开始
- [~] ch-xxx｜已完成：a, b｜当前：c｜待写：d, e  ← 进行中
- [x] ch-xxx                           ← 完成
```

### 规则
- JSON 文件只包含真实内容，不插入 _todo 卡片
- 新对话读 AGENTS.md 的 [~] 行恢复进度
- 除非用户明确说停，或遇到无法自行解决的报错，否则持续工作

---

## 教学设计原则（最高优先级）

> 以下原则指导你写出**让人真正学会**的内容。
> 这些是原则而非死板模板——你需要根据每个知识点的特性，
> 自行判断最佳的教学路径。原则冲突时，以"读者能否学会"为最终标准。

### 原则一：情境锚定，即时绑定（术语教学法）

**核心思想：不搞"大白话"和"专业术语"两套系统，而是在引入概念的同时绑定专业术语。**

操作方法：
1. **制造痛点 → 顺势引出术语**：先用直白语言描述一个现象或问题，当描述变得啰嗦时，把专业术语当作"快捷键"自然引出。
2. **过河拆桥**：术语一旦引入，后文只用术语，不再重复大白话解释。逼迫读者用行业语言思考。
3. **悬浮提示与全局跳转（网状互联）**：engine.js 自动将注册术语转为 `term-link`。
   - **Hover（悬停）**：弹出该术语的 Layer 1 极简卡片（一句话定义+核心公式），不打断当前工作记忆。
   - **Click（点击）**：新开标签页（`target="_blank"`）直接跳转并定位到该术语的完整详情卡片，供需要复习 Layer 2/3 的读者深入查看。正文绝不啰嗦重复解释。

示范——讲解"自举 (Bootstrapping)"：
```
错误写法（学术开场）：
"本节介绍时序差分算法，该算法使用自举方法..."

正确写法（情境锚定 + 即时绑定）：
"假设你要估算北京开车到上海的时间。你不用等到了上海才更新预估——
开到天津后，用实际耗时加上'天津到上海'的预估就能纠正最初的猜测。
这种'用下一步的预估纠正当前预估'的做法，叫做
**自举 (Bootstrapping)**。而你的预估误差，叫做
**时序差分误差 (TD Error)**。"
```

### 原则二：玩具模型优先，比喻点到为止

**核心思想：用极简的、可在脑中运行的机械系统建立精确直觉，而非用充满不可控联想的生活比喻。**

操作方法：
1. 比喻只在引入概念的前 1-2 句使用，消除恐惧感后立刻切断
2. 主动指出比喻的破绽（"但程序没有疲倦感，它只是在做数学优化"）
3. 用玩具模型替代比喻：3×3 格子世界、极简矩阵、2-token 序列……
4. 玩具模型要小到读者能在纸上手算，大到能展示核心机制

示范——讲解"策略 (Policy)"：
```
错误写法：
"策略就是小狗的肌肉记忆"

正确写法：
"想象一张表格，左列是机器人的所有位置（A1, A2...），
右列是它该往哪走（上/下/左/右）。
这张表格就是**策略 (Policy)**。
强化学习的目的，就是填满这张表格，让每一行都是最优动作。"
```

### 原则三：渐进式认知负荷管理

**核心思想：人脑工作记忆一次只能处理 3-4 个新元素。每个教学单元只引入一个新概念。**

操作方法：
1. **一个旋钮原则**：interactive-formula 一次只暴露一个可调参数，讲完后再加下一个
2. **卡片三层结构天然支持渐进**：Layer 1 只有定义和核心公式；Layer 2 展开推导；Layer 3 面试深度
3. **前置依赖显式声明**：如果知识点 A 依赖 B，用 requires block 指出，不要写"如前所述"
4. **默认有意义**：interactive 组件加载时就在运行默认值的演示，读者不操作也能学到东西

### 原则四：反事实推理驱动理解

**核心思想：不只说"是什么"，更要说"如果不这样做会怎样"。**

这是最强的记忆锚点。当读者知道"不除以 √d 会导致 softmax 饱和、梯度消失"，
他们就永远不会忘记为什么要除以 √d。

操作方法：
- 每个核心概念至少一个反事实推理
- 用具体数字验证反事实（"d=512 时，方差从 512 降到 1"）
- trap block 专门用来呈现反直觉结论

### 原则五：紧密反馈循环

**核心思想：学完立刻测，测完立刻反馈。间隔越短，记忆越牢。**

操作方法：
- 每张卡片底部的 memory block 包含自测问题
- 自测问题设计为面试常见的提问方式（"面试官问：为什么 xxx？"）
- 答案默认折叠，读者先想再看
- 记住/模糊/没记住三级标记，为未来的间隔重复做数据准备

### 原则六：代码即理解

**核心思想：手撕代码不是附加题，而是验证理解的最终手段。**

操作方法：
- 代码必须从零开始写，不依赖高层 API（用 `torch.nn` 的基础操作，不用 `nn.MultiheadAttention`）
- 每行代码必须有注释，注释解释"为什么"而非"做什么"
- 代码和公式一一对应，读者能看到公式的每一项在代码里的映射

---

## 时效性规则

> AI/ML 领域知识更新极快。面试官可能问 2024-2026 年的新技术。
> 你必须关注内容的时效性。

### 内容时效分级

**常青内容（不需要标注时间）：**
- 反向传播、梯度下降、正则化、激活函数
- Transformer 基础架构（Attention、FFN、LayerNorm）
- 经典 ML 算法（SVM、决策树、随机森林）
- 线性代数、概率论基础

**需要标注版本/时间的内容：**
- 具体模型架构（GPT-4、Llama 3、Gemini 2.0）→ 标注发布时间
- 训练技巧（Flash Attention、RoPE、GQA）→ 标注首次提出的论文/时间
- 对齐方法（DPO、GRPO）→ 标注提出时间和当前主流程度
- Benchmark 数据（MMLU 分数、排行榜）→ 标注数据日期

### 写作中的时效性要求

1. **提到具体模型时**：注明参数量、发布时间、关键创新点
2. **提到"目前主流"时**：标注截至什么时间的判断
3. **对比不同方法时**：如果有更新的替代方案，必须提及
4. **面试热点追踪**：
   - 2024-2025 高频面试话题：DPO/RLHF 对比、MoE 架构、长上下文、RAG vs 微调
   - 2025-2026 高频面试话题：推理模型（o1/DeepSeek-R1）、Agent 架构、多模态、Test-Time Compute
   - 根据你的训练数据判断最新动态，如果不确定某个技术的时效性，在内容中标注

### agent 自主判断规则

你不需要等我告诉你哪些是新的。基于你的训练数据：
- 如果你知道某个技术有更新的版本或替代方案，主动提及
- 如果你不确定某个信息是否过时，在内容中标注 `（截至 YYYY-MM，需验证）`
- 写完内容后在 AGENTS.md 记录你认为需要时效性更新的知识点

---

## 写作规范

### 每张卡片的教学结构

以下是推荐结构，不是死板模板。根据知识点特性灵活调整：

**Layer 1（默认可见）— 目标：30 秒内建立精确直觉**
- 一句话说清"这是什么、解决什么问题"（情境锚定 + 术语即时绑定）
- 核心公式（每个变量首次出现时解释）
- 如果不这样做会怎样（反事实推理，1-2 句）

**Layer 2（点击"展开推导"）— 目标：完全理解原理**
- 逐步推导（每步有注释，用玩具模型的具体数字）
- 数值验证（用具体数字走一遍公式）
- 反直觉结论（trap block）
- 适用/不适用场景

**Layer 3（点击"面试视角"）— 目标：面试中脱口而出**
- 面试高频问法 + 标准回答
- 引申变体（"如果面试官追问 xxx 怎么办"）
- 手撕代码（从零实现，每行注释）

### 关键写作规则

1. **首句必须回答"是什么、解决什么问题"**——假设读者完全不知道这个概念
2. **公式每个变量首次出现时必须解释**——用 `其中：` 列表
3. **具体数字优于模糊描述**——"方差从 512 降到 1" 不是 "方差变小了"
4. **formula block 每个数学步骤必须有注释**
5. **禁止"如前所述"**——要么用 requires block 指向前置卡片，要么当场解释
6. **术语引入后只用术语**——不重复大白话
7. **代码注释解释"为什么"**——不解释"做什么"

### 自测问题设计规则

每张卡片底部的 memory block 中包含 1-2 个自测问题：
- 用面试官的口吻提问（"为什么 Transformer 用 Scaled Dot-Product 而不是普通点积？"）
- 答案简洁有力，能在面试中直接用（不超过 3 句话）
- 包含关键术语（确保读者练习用行话回答）



### 术语链接与路由规则
1. 正文直接写普通文字，engine.js 会读取 `knowledge_graph.json`，自动把已注册术语转为带有完整路由的超链接。不需要手动写 HTML。
2. **路由要求**：在维护 `knowledge_graph.json` 时，每个节点必须包含其出处路由信息（`chapter_id` 和 `card_id`），例如 `url: "?ch=ch-nn-basics&card=softmax"`。
3. 当跨章节提及术语（如 PPO 中提及 Softmax）时，确保点击能跨文件加载并自动滚动定位到对应卡片。

---

## 交互组件设计原则

> 交互组件是为了降低认知负荷，不是为了炫技。
> 设计时问自己：这个交互是否比纯文字更有助于理解？如果不是，就不要加。

### 核心设计哲学

1. **滚动优于点击**：读者最习惯的动作是向下滚动，尽量减少需要"操作"的元素
2. **一次一个旋钮**：每个 interactive 组件同时只暴露一个可调参数
3. **即时反馈**：拖动滑块时，可视化必须实时变化，不能等松手
4. **默认有意义**：组件加载时就在用默认参数运行演示，不操作也能学到东西
5. **交互是锦上添花**：去掉所有交互，纯文字也必须能讲清楚概念

### 何时使用交互组件

**应该用 interactive-formula：**
- 参数变化导致行为质变的场景（ε 从 0→1，探索/利用行为翻转）
- 需要"手感"才能理解的参数（学习率太大震荡、太小不收敛）

**应该用 stepper：**
- 多步计算过程（Attention 计算、反向传播）
- 算法执行流程（Q-Learning 一轮迭代）

**不应该用交互：**
- 概念本身是静态的（定义、分类）
- 文字 + 公式已经足够清晰
- 加交互反而增加认知负荷

---

## 前端重构任务

**优先级：高。在继续写内容前，先确认以下各项是否已完成。**

### 视觉规范

参考 Linear、Vercel Dashboard 的设计风格。

### 配色方案（style.css :root）
```css
:root {
  --bg:        #0f1117;
  --bg2:       #1a1d27;
  --bg3:       #222536;
  --border:    #2d3148;
  --text:      #e2e8f0;
  --text2:     #94a3b8;
  --text3:     #64748b;
  --accent:    #6366f1;
  --accent2:   #10b981;
  --accent3:   #f59e0b;
  --accent4:   #ef4444;
  --accent5:   #8b5cf6;
}
```

### 主内容区布局
```css
.main { margin-left: 260px; padding: 0 48px 80px; }
.chapter { max-width: 860px; margin: 0 auto; }
.card {
  margin-bottom: 20px; border-radius: 12px;
  border: 1px solid var(--border); background: var(--bg2);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.card:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px rgba(99,102,241,0.12);
}
```

### 必须完成的改动清单

- [ ] 引入 KaTeX，formula block 改为真实数学公式渲染
- [ ] 配色方案和主内容区布局按上方规范重写
- [ ] 卡片改为三层渐进展开结构
- [ ] 公式变量悬浮解释（var-tooltip）
- [ ] 前置/后续知识自动生成（从 knowledge_graph.json）
- [ ] 主动回忆自测组件（每张卡片底部）
- [ ] 搜索升级（支持搜索变量名和标签）

### KaTeX 引入方式

在 index.html 的 `<head>` 里加：
```html
<link rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script>
```

formula block 渲染逻辑：行内 `$...$`，块级 `$$...$$`，engine.js 调用 `renderMathInElement`。

### 卡片三层渐进展开结构

默认只显示第一层，点击按钮展开更多：
- Layer 1（默认可见）：一句话定义 + 核心公式
- Layer 2（点击"展开推导"）：完整推导 + 数值验证 + 反直觉结论
- Layer 3（点击"面试视角"）：引申变体 + 面试加分点 + 手撕代码

block 的 `layer` 字段控制所属层级（1/2/3），默认为 1。

---

## 前端交互组件规范

### P0 — 第一轮必须完成
- [ ] KaTeX 数学公式渲染
- [ ] 公式参数交互滑块（interactive-formula block）
- [ ] 主动回忆自测（每张卡片底部）
- [ ] 配色重构 + max-width 布局
- [ ] 卡片三层渐进展开

### P1 — 第二轮
- [ ] 算法步骤动画（stepper block）
- [ ] 知识图谱可视化（D3.js 力导向图）
- [ ] 面试模式（全屏刷题，随机抽题，隐藏答案口述后再显示）

### P2 — 第三轮
- [ ] 代码沙盒（Pyodide，浏览器内运行 Python）
- [ ] 进度仪表盘（localStorage，间隔重复算法，今日待复习列表）
- [ ] 笔记层（localStorage，卡片级用户笔记）

### interactive-formula block 格式
```json
{
  "type": "interactive-formula",
  "layer": 2,
  "formula": "L_{CLIP} = ...",
  "params": [
    {
      "name": "ε",
      "desc": "裁剪范围，防止单步更新过大",
      "min": 0.05, "max": 0.5, "default": 0.2, "step": 0.05
    }
  ],
  "visualization": "clip-curve"
}
```

### stepper block 格式
```json
{
  "type": "stepper",
  "layer": 2,
  "title": "Attention 计算过程",
  "steps": [
    {
      "title": "Step 1：输入矩阵",
      "desc": "输入序列 X，形状 [n, d]",
      "visual": "matrix"
    }
  ]
}
```

---

## 前端自检规则

每写完一个章节后，用 Playwright MCP 做浏览器验证。
先确认 `python -m http.server 8080` 已启动。

### Step 1 — JSON 预检
```bash
python -c "import json; json.load(open('content/ch-xxx.json')); print('OK')"
python -c "import json; json.load(open('knowledge_graph.json')); print('OK')"
```

### Step 2 — 浏览器验证

打开 http://localhost:8080，验证：
- 侧边栏显示章节导航
- 点击章节 → 内容正常加载
- 所有 block 类型正常渲染（formula 是真实公式不是代码块）
- 三层展开按钮正常
- 搜索、term-link、自测按钮正常
- 控制台无红色报错

### Step 3 — 移动端验证

视口 375×812：侧边栏可用、内容不超出、公式不被截断。

### Step 4 — 结果处理

全部通过 → 标记 [x]。
发现问题 → 修复后重新验证，直到全部通过。

---

## Agent 工作边界

每次对话只读写：
- `AGENTS.md`
- `chapters.json`
- `knowledge_graph.json`
- `content/ch-{name}.json`（当前任务，每次只一个）

例外：engine.js / style.css 有 bug 时可以修，必须在 AGENTS.md 记录改了什么。

---

## 接到任务时的标准流程
```
1. 读 AGENTS.md → 了解进度，找到要继续的任务
2. 检查前端重构清单 → 有未完成的 P0 项目则优先执行
3. 写内容任务：
   a. 读 knowledge_graph.json 前 50 行 → 确认已有 id
   b. 读 content/ch-xxx.json（如存在）→ 了解已有内容
   c. **【体系化补全检查】**：在动笔写具体的子知识点前，先评估该章节的“完整性”。例如，如果用户让你写“为什么除以 √d”，你必须意识到它属于“Transformer 基础”，并主动在 JSON 的 `cards` 列表中把同级别的核心考点（如 QKV 生成、多头注意力、位置编码、LayerNorm 等）的骨架先建立出来，哪怕内容暂时标记为 "TODO"。
   d. 写/更新 content/ch-xxx.json
   e. 每写完一张卡片 → 立刻更新 AGENTS.md 进度表
   f. 每新增知识点 → 立刻追加到 knowledge_graph.json
4. 写内容时，思考这个知识点的最佳教学路径：
   - 读者现在知道什么？需要什么前置知识？
   - 用什么玩具模型能让读者"在脑中运行"这个概念？
   - 反事实推理的切入点是什么？
   - 面试官最可能怎么问这个知识点？
5. 章节写完 → 执行前端自检
6. 自检通过 → 标记 [x]
7. 只输出 diff 摘要，不重复输出整个文件
```

---

## Agent 自主思考空间

> 以下规则鼓励你主动思考，而非机械执行。

### 你应该主动做的事

1. **教学路径设计**：每个知识点的最佳教学方式不同。
   有些适合从公式入手（线性代数），有些适合从问题入手（为什么需要 Attention）。
   你需要自行判断。

2. **发现教学机会**：如果你在写 A 知识点时发现和 B 有精彩的对比或联系，
   主动建立关联（在 knowledge_graph.json 加 related 字段），
   并在内容中引用。

3. **质量自检**：写完每张卡片后问自己：
   - 一个零基础读者看完 Layer 1，能用一句话向别人解释这个概念吗？
   - 看完 Layer 3，能在白板面试中回答相关问题吗？
   - 有没有跳步？有没有假设读者已知某个未解释的概念？

4. **识别过时内容**：如果你知道某个知识点已有更新的实践，主动标注。
5. **体系化补全（知识树展开）**：不要陷入“头痛医头”的局部视野。
   当你处理一个具体的微观问题（如“Softmax 溢出”）时，必须向上追溯它的父级领域（如“注意力机制计算”），并横向扫描缺失的兄弟节点（如“Masking 机制”）。
   如果发现当前章节缺少构成该体系的关键闭环知识，**主动提出并将其加入待办列表或直接补全**，确保最终输出的是一本完整的“备考手册”，而不是零散的“问答集”。

### 你不应该做的事

1. **不要机械套模板**：教学原则是指导方针，不是填空题。
   如果某个知识点不适合反事实推理（比如纯定义类），就不要硬凑。

2. **不要为了交互而交互**：如果文字 + 公式已经足够清晰，
   不需要硬加 interactive-formula 或 stepper。

3. **不要回避复杂性**：目标是"让人真正学会"，不是"让人觉得简单"。
   该出现的数学推导必须出现，但要用清晰的步骤和注释让推导可跟随。

---

## chapters.json 格式参考
```json
{
  "chapters": [
    {
      "id": "ch-transformer",
      "file": "content/ch-transformer.json",
      "title": "Transformer & 注意力机制",
      "navGroup": "深度学习 & 大模型",
      "dotColor": "#58a6ff",
      "tag": "llm"
    }
  ]
}
```

---

## content/ch-xxx.json 格式参考
```json
{
  "id": "ch-transformer",
  "title": "Transformer & 注意力机制",
  "tag": "llm",
  "tagLabel": "大模型核心",
  "desc": "章节描述...",
  "taxonomy": null,
  "cards": [
    {
      "id": "scaled-dot-product",
      "title": "Scaled Dot-Product Attention",
      "subtitle": "真题：为什么除以 √d_k？",
      "icon": "⚡",
      "blocks": [
        {
          "type": "kitem",
          "layer": 1,
          "labelType": "core",
          "badge": "核心考点",
          "labelTitle": "是什么，解决什么问题",
          "text": "Attention 要解决的问题是：在处理序列时，如何让模型知道当前位置该重点关注哪些其他位置..."
        },
        {
          "type": "formula",
          "layer": 1,
          "content": "$$\\text{Attention}(Q,K,V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d}}\\right)V$$"
        },
        { "type": "divider" },
        {
          "type": "kitem",
          "layer": 2,
          "labelType": "formula",
          "badge": "推导过程",
          "labelTitle": "为什么除以 √d",
          "text": "推导内容..."
        },
        {
          "type": "interactive-formula",
          "layer": 2,
          "formula": "\\text{Var}(Q \\cdot K) = d",
          "params": [
            { "name": "d", "desc": "向量维度", "min": 8, "max": 512, "default": 64, "step": 8 }
          ],
          "visualization": "variance-curve"
        },
        {
          "type": "trap",
          "layer": 2,
          "title": "⚠️ 反直觉结论",
          "content": "反直觉的数学结论..."
        },
        {
          "type": "table",
          "layer": 2,
          "headers": ["方案", "问题", "结论"],
          "rows": [["不缩放", "梯度消失", "❌"], ["除以√d", "方差=1", "✅"]]
        },
        {
          "type": "memory",
          "layer": 3,
          "title": "💡 面试自测",
          "content": "面试官问：为什么 Transformer 用 Scaled Dot-Product 而不是普通点积？\n\n答：因为当维度 d 较大时，点积的方差与 d 成正比，导致 softmax 输入值过大，梯度趋近于零。除以 √d 将方差归一化到 1，保持梯度健康。"
        },
        {
          "type": "code",
          "layer": 3,
          "title": "从零实现",
          "content": "import torch\n\ndef scaled_dot_product(Q, K, V):\n    d = Q.size(-1)  # 取维度，用于缩放\n    scores = Q @ K.transpose(-2,-1) / d**0.5  # 缩放防止梯度消失\n    weights = torch.softmax(scores, dim=-1)  # 归一化为概率分布\n    return weights @ V  # 加权求和得到输出"
        }
      ]
    }
  ]
}
```

---

## MD 融合任务规则

**触发条件：仅在 source-md/ 目录存在，且所有内容章节标记为 [x] 后才执行。**

### 文件支持

source-md/ 支持 .md / .pdf / .docx / .txt，只读不修改。

### 禁止直接读源文件

所有融合操作只读 source-index/ 下的片段文件和 manifest.json。

### 第零步：建立融合索引（整个项目只做一次）

首次执行融合任务前，创建并运行 tools/extract_index.py。

脚本功能：
- .md / .txt → 按标题切分
- .pdf → 按书签切分（无书签时每 4 页合并）
- .docx → 按标题段落切分

输出到 source-index/，生成 manifest.json。

脚本创建后运行：
```bash
pip install pdfplumber python-docx
python tools/extract_index.py
```

（extract_index.py 的完整代码见附录 A）

### 融合执行策略

全自动连续处理，不停下来等确认。一个文件完成标记 [x] 后自动开始下一个。

分类不确定时保守处理 → 归入【可补充】，追加 block 不新建卡片。

只在以下情况停下：报错、扫描件、片段数为 0。

### 单文件处理流程

**Step 1 — 扫描对比**：读 manifest.json 中该文件的片段 → 语义对比 knowledge_graph.json → 输出分类报告（已覆盖/可补充/待新增/跳过）→ 立刻进入 Step 2。

**Step 2 — 融合写入**：逐片段处理，按写作规范重写为 JSON block/card，写入目标文件，更新 knowledge_graph.json 和进度表。

**Step 3 — 完成验证**：Playwright 自检 → 通过则标记 [x] → 下一个文件。

### 融合质量要求

- 只有结论没推导 → 补充推导
- 有数值例子 → 保留并扩展
- 有代码无注释 → 按规范重写
- 内容 < 5 行 → 跳过
- 融合后的卡片同样遵守教学设计原则



---

## 遇到问题时的处理

- 页面报错 → 贴出错误原文，不猜原因
- 不确定知识点归属 → 列出选项和理由，等我决定
- content/*.json 超 400 行 → 停下来问是否拆分
- 觉得某个约定不合理 → 提出改进建议
- 任何不确定 → 提问比猜测代价低

---

## 当前进度

### 架构搭建
- [x] 分析 knowledge.html，提取 CSS 和章节结构
- [x] 创建 assets/style.css
- [x] 创建 assets/engine.js
- [x] 创建 chapters.json
- [x] 创建 knowledge_graph.json
- [x] 创建 index.html
- [x] 验证架构可运行

### 前端重构（P0）
- [x] KaTeX 数学公式渲染
- [x] 公式参数交互滑块（interactive-formula block）
- [x] 主动回忆自测组件
- [x] 配色重构 + max-width 布局
- [x] 卡片三层渐进展开
- 备注：P0 已完成并通过浏览器验证（2026-03-28）。现有内容使用旧式 code-block 格式，新章节将使用 $$...$$ KaTeX + layer 字段。

### Bug 修复记录 & 视觉优化
- 2026-03-28：
  - engine.js `renderCard()`：卡片默认折叠（移除 `class="card open"` → `class="card"`）
  - style.css `--accent6: #0891b2;` 已定义（cyan，用于 compare table headers）
  - 视觉设计全面优化：更大字号、更多呼吸空间、渐变背景、精致 hover 效果、layer 按钮 polish、sidebar active 状态、badge 渐变边框、memory/trap/code block 重构
  - 前端壳层改为暖色浅色主题；新增固定右侧章节 TOC（点击滚动到卡片，<=1024px 自动隐藏并让主内容回收宽度）
  - engine.js `init()` / `showChapter()`：修复首屏忽略 `?ch=` 路由参数的问题；现在会按 URL 章节 id 初始加载，并在切换章节时同步更新查询参数
  - engine.js `fetch('chapters.json')` / `fetch(chMeta.file)`：改为 `{ cache: 'no-store' }`，修复新增章节或拆分章节后浏览器沿用旧缓存，导致侧边栏缺项和 `?ch=` 路由回退的问题
  - knowledge_graph.json 元数据收敛：补齐 canonical `softmax-node`（归属 `ch-transformer`）与 `weight-init-node`（归属 `ch-nn-basics`），删除重复 `chain-rule-node`，并清理指向不存在节点的 `related` 引用
  - 图谱一致性校验通过：14 个已注册章节均至少拥有 1 个 graph node；`layer-norm-node` / `rms-norm-node` 唯一且仍归属 transformer 章节；现有 `cardId` 路由校验全部通过

### 前端交互组件（P1）
- [ ] 算法步骤动画（stepper block）
- [ ] 知识图谱可视化（D3.js）
- [ ] 面试模式

### 前端交互组件（P2）
- [ ] 代码沙盒（Pyodide）
- [ ] 进度仪表盘 + 间隔重复
- [ ] 笔记层

### 内容章节
- [x] ch-transformer — 4 张卡片（WHY→总览→QKV→Scaled Dot-Product），WHY-first 重建完成，冻结
- [x] ch-transformer-arch — 3 张卡片（MHA→位置编码→完整架构），split 路由与术语所有权验证通过，冻结
- [x] ch-transformer-advanced — 4 张卡片（long-context bottleneck, flash-attention, gqa-mqa-mla, training-memory-tricks），教学重写完成，JSON/浏览器验收通过，冻结
- [x] ch-transformer-inference — 4 张卡片教学重写完成，JSON/浏览器验收通过，冻结
- [x] ch-llm-alignment — 5 张卡片（SFT→RLHF→DPO→RLHF vs DPO→GRPO），教学重写、图谱更新、JSON/浏览器验收通过，冻结
- [x] ch-nn-basics — 5 张卡片（backprop, activation-functions, batch-norm, dropout, weight-init），教学设计原则合规，浏览器验收通过，冻结
- [x] ch-ml-classical — 3 张卡片（linear-regression, logistic-regression, svm），按情境锚定 + toy model 深化并从树模型自然拆分，JSON/浏览器验收通过，冻结
- [x] ch-ml-tree-methods — 2 张卡片（decision-tree, xgboost），承接树模型与集成学习，情境锚定 + toy model 深化，JSON/浏览器验收通过，冻结
- [x] ch-evaluation — 5 张卡片（precision-recall-f1, roc-auc, cross-entropy-loss, focal-loss-imbalance, regression-losses），情境锚定 + 数字玩具模型 + 图谱节点补全完成，JSON/浏览器验收通过，冻结
- [x] ch-optimization — 5 张卡片（sgd-momentum, adam-adamw, lr-schedule, gradient-vanish-explode, regularization），已补强情境锚定 + 数字玩具模型 + 优化图谱节点，JSON/浏览器验收通过，冻结
- [x] ch-linear-algebra — 5 张卡片（matrix multiplication, eigenvalues/eigenvectors, svd, vector norms/similarity, gradients/Jacobian），痛点优先重写、图谱节点注册、JSON/浏览器验收通过，冻结
- [x] ch-probability — 5 张卡片（bayes-theorem, common-distributions, mle-map, information-theory, hypothesis-testing），痛点优先重写、图谱节点注册、JSON/浏览器验收通过，冻结
- [x] ch-algorithms — 5 张卡片（complexity, dynamic-programming, graph-search, hash-table, binary-search），痛点优先 + 数字玩具模型 + 图谱节点注册完成，JSON/浏览器验收通过，冻结
- [x] ch-numerical — 5 张卡片（floating-point, numerical-stability, condition-number, automatic-differentiation, matrix-decomposition），图谱节点、JSON/浏览器验收通过，冻结

### 元数据当前状态
- [x] knowledge_graph.json 收敛完成：无重复 node id，重复概念标签已收敛到 canonical 节点或保留为合法不同概念
- [x] 必需共享节点已存在：`softmax-node`、`weight-init-node`
- [x] chapters.json 当前 14 个注册章节全部具备 graph coverage，且 node `chapterId` / `cardId` 校验通过

### 待判断是否新增的章节
- ? 强化学习基础（MDP/Q-Learning/Policy Gradient）← 目前在 llm-alignment 里
- ? 扩散模型（DDPM/DDIM/Score Matching）
- ? 多模态（CLIP/ViT/LLaVA）
- ? 系统设计（模型部署/推理优化/量化）
- ? 手撕代码专题（面试高频算法题合集）
- ? 推理与 Agent（CoT/ToT/ReAct/Tool Use）← 2025-2026 面试热点

### 时效性待更新清单
- ch-llm-alignment：GRPO / DAPO / GSPO / DeepSeek-R1 路线属于 2024-2025 快速演化区，后续若出现新主流替代法需复核（截至 2026-03）

---

## 附录 A：extract_index.py 完整代码

```python
#!/usr/bin/env python3
import os, json, re
from pathlib import Path

SOURCE_DIR = Path("source-md")
INDEX_DIR  = Path("source-index")
INDEX_DIR.mkdir(exist_ok=True)
fragments  = []

def save_fragment(source_file, title, content, counter, scan_only=False):
    frag_id   = f"{source_file.stem}-{counter:03d}"
    subdir    = INDEX_DIR / source_file.stem
    subdir.mkdir(exist_ok=True)
    frag_path = subdir / f"{frag_id}.txt"
    frag_path.write_text(
        f"# {title}\n# source: {source_file.name}\n\n{content.strip()}\n",
        encoding="utf-8"
    )
    fragments.append({
        "id": frag_id, "source_file": source_file.name,
        "title": title, "lines": len(content.splitlines()),
        "path": str(frag_path), "scan_only": scan_only
    })

def split_markdown(filepath):
    text     = filepath.read_text(encoding="utf-8", errors="ignore")
    sections = re.split(r'\n(?=#{1,3} )', text)
    counter  = 1
    for sec in sections:
        lines = sec.strip().splitlines()
        if not lines or len(lines) < 3:
            continue
        title = lines[0].lstrip('#').strip() or f"section-{counter}"
        save_fragment(filepath, title, sec, counter)
        counter += 1

def split_pdf(filepath):
    try:
        import pdfplumber
    except ImportError:
        print(f"跳过 {filepath.name}：请先 pip install pdfplumber"); return
    counter = 1
    with pdfplumber.open(filepath) as pdf:
        if hasattr(pdf, 'bookmarks') and pdf.bookmarks:
            bookmarks = pdf.bookmarks
            for i, bm in enumerate(bookmarks):
                start = bm.get('page', 0)
                end   = bookmarks[i+1].get('page', len(pdf.pages)) \
                        if i+1 < len(bookmarks) else len(pdf.pages)
                content = "\n".join(
                    pdf.pages[p].extract_text() or ""
                    for p in range(start, min(end, len(pdf.pages)))
                )
                if len(content.strip()) > 50:
                    save_fragment(filepath,
                                  bm.get('title', f'section-{counter}'),
                                  content, counter)
                    counter += 1
            return
        buffer, buffer_title = [], "page-1"
        for i, page in enumerate(pdf.pages):
            buffer.append(page.extract_text() or "")
            if (i + 1) % 4 == 0 or i == len(pdf.pages) - 1:
                content = "\n".join(buffer)
                if len(content.strip()) < 20:
                    save_fragment(filepath, buffer_title,
                                  "（扫描件，无法提取文本）",
                                  counter, scan_only=True)
                elif len(content.strip()) > 50:
                    save_fragment(filepath, buffer_title, content, counter)
                counter += 1
                buffer = []
                buffer_title = f"page-{i+2}"

def split_docx(filepath):
    try:
        from docx import Document
    except ImportError:
        print(f"跳过 {filepath.name}：请先 pip install python-docx"); return
    doc     = Document(filepath)
    counter = 1
    current_title, current_content = "intro", []
    for para in doc.paragraphs:
        if para.style.name.startswith("Heading"):
            if current_content:
                save_fragment(filepath, current_title,
                              "\n".join(current_content), counter)
                counter += 1
            current_title   = para.text.strip() or f"section-{counter}"
            current_content = []
        else:
            if para.text.strip():
                current_content.append(para.text.strip())
    if current_content:
        save_fragment(filepath, current_title,
                      "\n".join(current_content), counter)

for filepath in sorted(SOURCE_DIR.rglob("*")):
    if filepath.suffix == ".md":
        print(f"处理 MD:   {filepath.name}"); split_markdown(filepath)
    elif filepath.suffix == ".pdf":
        print(f"处理 PDF:  {filepath.name}"); split_pdf(filepath)
    elif filepath.suffix in (".docx", ".doc"):
        print(f"处理 Word: {filepath.name}"); split_docx(filepath)
    elif filepath.suffix == ".txt":
        print(f"处理 TXT:  {filepath.name}"); split_markdown(filepath)

manifest_path = INDEX_DIR / "manifest.json"
manifest_path.write_text(
    json.dumps({"total": len(fragments), "fragments": fragments},
               ensure_ascii=False, indent=2),
    encoding="utf-8"
)
print(f"\n完成：共切分 {len(fragments)} 个知识点片段")

scan_only_files = set(f['source_file'] for f in fragments if f.get('scan_only'))
if scan_only_files:
    print(f"\n⚠️  以下文件为扫描件，需要 OCR 处理后才能融合：")
    for f in scan_only_files:
        print(f"   - {f}")
```
