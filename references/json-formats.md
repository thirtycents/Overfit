# JSON Formats Reference

This file documents every JSON structure used in the project.

---

## chapters.json

The chapter registry. Every chapter file must be registered here.

```json
{
  "chapters": [
    {
      "id": "ch-transformer",
      "file": "content/ch-transformer.json",
      "title": "Transformer & Attention",
      "navGroup": "Deep Learning & LLMs",
      "dotColor": "#58a6ff",
      "tag": "llm"
    }
  ]
}
```

Fields:
- `id`: Semantic ID matching the filename (no sequence numbers)
- `file`: Path relative to project root
- `title`: Display title in sidebar
- `navGroup`: Sidebar grouping label
- `dotColor`: Hex color for the sidebar dot indicator
- `tag`: Category tag for filtering

---

## content/ch-xxx.json

Each chapter file contains an array of cards. Each card contains blocks organized by layer.

```json
{
  "id": "ch-transformer",
  "title": "Transformer & Attention",
  "tag": "llm",
  "tagLabel": "LLM Core",
  "desc": "Chapter description...",
  "taxonomy": null,
  "cards": [ /* see Card format below */ ]
}
```

### Card format

```json
{
  "id": "scaled-dot-product",
  "title": "Scaled Dot-Product Attention",
  "subtitle": "Interview Q: Why divide by √d_k?",
  "icon": "⚡",
  "blocks": [ /* see Block types below */ ]
}
```

- `id`: Unique within the chapter, used for URL routing (`?ch=ch-transformer&card=scaled-dot-product`)
- `subtitle`: Often phrased as the most common interview question about this topic
- `icon`: Single emoji for visual identification
- `blocks`: Ordered array of content blocks

---

## Block Types

Every block has a `type` field. Most have an optional `layer` field (1, 2, or 3; default 1).

### kitem — Knowledge item (text paragraph)

```json
{
  "type": "kitem",
  "layer": 1,
  "labelType": "core",
  "badge": "Core Concept",
  "labelTitle": "What it is and what problem it solves",
  "text": "Attention solves the problem of how a model knows which positions to focus on when processing a sequence..."
}
```

`labelType` values: `"core"`, `"formula"`, `"compare"`, `"trap"`, `"practice"`

### formula — Math formula (KaTeX)

```json
{
  "type": "formula",
  "layer": 1,
  "content": "$$\\text{Attention}(Q,K,V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d}}\\right)V$$"
}
```

Use `$$...$$` for block formulas, `$...$` for inline within text blocks.

### divider — Visual separator

```json
{ "type": "divider" }
```

No layer field needed. Used between layer transitions.

### trap — Counter-intuitive conclusion

```json
{
  "type": "trap",
  "layer": 2,
  "title": "⚠️ Counter-intuitive",
  "content": "Even though attention weights sum to 1, they can still effectively ignore all tokens when the query is orthogonal to all keys — the weights become uniform, not zero."
}
```

### table — Comparison table

```json
{
  "type": "table",
  "layer": 2,
  "headers": ["Approach", "Problem", "Verdict"],
  "rows": [
    ["No scaling", "Gradient vanishing", "❌"],
    ["Divide by √d", "Variance = 1", "✅"]
  ]
}
```

### memory — Self-test question

```json
{
  "type": "memory",
  "layer": 3,
  "title": "💡 Interview Self-Test",
  "content": "Interviewer asks: Why does Transformer use Scaled Dot-Product instead of raw dot product?\n\nAnswer: When dimension d is large, dot product variance scales with d, making softmax inputs extreme and gradients near-zero. Dividing by √d normalizes variance to 1, keeping gradients healthy."
}
```

### code — Implementation from scratch

```json
{
  "type": "code",
  "layer": 3,
  "title": "From-Scratch Implementation",
  "content": "import torch\n\ndef scaled_dot_product(Q, K, V):\n    d = Q.size(-1)  # get dimension for scaling\n    scores = Q @ K.transpose(-2,-1) / d**0.5  # scale to prevent gradient vanishing\n    weights = torch.softmax(scores, dim=-1)  # normalize to probability distribution\n    return weights @ V  # weighted sum produces output"
}
```

### interactive-formula — Parameter exploration

```json
{
  "type": "interactive-formula",
  "layer": 2,
  "formula": "$$\\text{Var}(Q \\cdot K) = d$$",
  "params": [
    {
      "name": "d",
      "desc": "Vector dimension",
      "min": 8,
      "max": 512,
      "default": 64,
      "step": 8
    }
  ],
  "visualization": "variance-curve"
}
```

Only use when parameter change causes qualitative behavior shift. One param at a time.

### stepper — Algorithm step-through

```json
{
  "type": "stepper",
  "layer": 2,
  "title": "Attention Computation Steps",
  "steps": [
    {
      "title": "Step 1: Input matrix",
      "desc": "Input sequence X, shape [n, d]",
      "visual": "matrix"
    },
    {
      "title": "Step 2: Compute Q, K, V",
      "desc": "Linear projections: Q = XW_Q, K = XW_K, V = XW_V",
      "visual": "projection"
    }
  ]
}
```

### requires — Prerequisite declaration

```json
{
  "type": "requires",
  "layer": 1,
  "items": [
    { "card": "softmax", "chapter": "ch-nn-basics", "title": "Softmax Function" }
  ]
}
```

Use this instead of "as mentioned earlier." Renders as a clickable link.

---

### compare-panel — Side-by-side comparison

```json
{
  "type": "compare-panel",
  "layer": 1,
  "mode": "counterfactual",
  "title": "Why Divide by sqrt(d)?",
  "left": {
    "label": "❌ Without Scaling",
    "points": ["Variance = d (e.g., 512)", "Softmax saturates", "Gradients vanish"]
  },
  "right": {
    "label": "✅ With Scaling",
    "points": ["Variance = 1", "Softmax outputs meaningful distribution", "Gradients healthy"]
  },
  "verdict": "One line of code, massive impact."
}
```

Fields:
- `mode`: `"counterfactual"` (left=bad, right=good) or `"comparison"` (neutral A vs B)
- `left.label` / `right.label`: Column header text
- `left.points` / `right.points`: Array of strings, max 5 per side
- `verdict`: Optional summary line below the comparison

### what-if — Cascading cause-effect chain

```json
{
  "type": "what-if",
  "layer": 2,
  "premise": "What if Transformer had no positional encoding?",
  "chain": [
    { "severity": "start", "text": "Attention computes pairwise scores between all tokens" },
    { "severity": "mid", "text": "Scores depend only on content, not position" },
    { "severity": "mid", "text": "'Dog bites man' and 'Man bites dog' get identical representations" },
    { "severity": "end", "text": "Model cannot distinguish word order — useless for sequential tasks" }
  ],
  "resolution": "Positional encoding breaks the symmetry by injecting position info before Attention."
}
```

Fields:
- `premise`: The "what if" question
- `chain[].severity`: `"start"` (🟡), `"mid"` (🟠), or `"end"` (🔴)
- `chain[].text`: One sentence per node, max 5 nodes
- `resolution`: Optional — how the problem is resolved

### derivation-chain — Collapsible multi-step proof

```json
{
  "type": "derivation-chain",
  "layer": 2,
  "title": "Proof: Var(Q·K) = d",
  "setup": "Let q, k have entries ~ N(0,1), dimension d.",
  "steps": [
    { "formula": "$$Q \\cdot K = \\sum_{i=1}^{d} q_i k_i$$", "why": "Dot product expands to sum of products" },
    { "formula": "$$\\text{Var}(q_i k_i) = 1$$", "why": "Independent N(0,1): E[q²]=1, E[qk]=0" },
    { "formula": "$$\\text{Var}(Q \\cdot K) = d$$", "why": "d independent terms, each variance 1. QED" }
  ]
}
```

Fields:
- `title`: Proof title
- `setup`: Optional premise/conditions
- `steps[].formula`: KaTeX formula for this step
- `steps[].why`: Plain-language explanation of the algebraic transformation
- Collapsed by default; each step expands on click. Max ~6 steps.

### timeline — Technique/model evolution

```json
{
  "type": "timeline",
  "layer": 2,
  "title": "Alignment Methods Evolution",
  "entries": [
    { "date": "2022-04", "label": "RLHF", "desc": "Train reward model + PPO optimization", "status": "historical", "cardRef": "rlhf" },
    { "date": "2023-12", "label": "DPO", "desc": "Direct preference optimization, no reward model", "status": "mainstream", "cardRef": "dpo" },
    { "date": "2024-11", "label": "GRPO", "desc": "Group-relative scoring for reasoning tasks", "status": "emerging", "cardRef": "grpo" }
  ]
}
```

Fields:
- `entries[].date`: `"YYYY-MM"` format
- `entries[].label`: Short technique/model name
- `entries[].desc`: One-sentence description
- `entries[].status`: `"historical"` | `"mainstream"` | `"emerging"`
- `entries[].cardRef`: Optional card ID for navigation on click

### stepper — Algorithm step-through

```json
{
  "type": "stepper",
  "layer": 2,
  "title": "Attention Computation Steps",
  "context": "Toy model: 2 tokens, d=3",
  "steps": [
    {
      "title": "Step 1: Input matrix",
      "desc": "Input sequence X, shape [2, 3]",
      "formula": "$$X = \\begin{bmatrix} 1 & 0 & 1 \\\\ 0 & 1 & 0 \\end{bmatrix}$$",
      "visual": { "type": "matrix", "data": [[1,0,1],[0,1,0]], "highlight": [] }
    },
    {
      "title": "Step 2: Compute Q, K, V",
      "desc": "Linear projections: Q = XW_Q",
      "formula": "$$Q = XW_Q$$",
      "visual": { "type": "matrix", "data": [[0.5,0.3],[0.2,0.8]], "highlight": [[0,0],[1,1]] }
    }
  ]
}
```

Fields:
- `context`: Optional toy model description (shown in header)
- `steps[].title`: Step label
- `steps[].desc`: Plain-language description
- `steps[].formula`: Optional KaTeX formula
- `steps[].visual.type`: `"matrix"` | `"code"` | `"diagram"` | null
- `steps[].visual.data`: Data for the visual (matrix = 2D array, code = string, diagram = SVG string)
- `steps[].visual.highlight`: Cells/lines to highlight (matrix = [[row,col], ...], code = [lineNum, ...])
- Navigation: prev/next buttons + dot indicators. Max 8 steps.

---

## Chapter-level Fields (Phase 6)

### map — Chapter flow diagram

Optional field on the chapter root object. Renders as SVG flow chart above cards.

```json
{
  "id": "ch-transformer",
  "title": "Transformer & Attention",
  "map": {
    "type": "flow",
    "nodes": [
      { "id": "why-attention", "label": "Why Attention?", "level": 0 },
      { "id": "qkv", "label": "QKV Projection", "level": 1 },
      { "id": "scaled-dot-product", "label": "Scaled Dot-Product", "level": 1 },
      { "id": "multi-head", "label": "Multi-Head", "level": 2 }
    ],
    "edges": [
      ["why-attention", "qkv"],
      ["why-attention", "scaled-dot-product"],
      ["qkv", "multi-head"],
      ["scaled-dot-product", "multi-head"]
    ]
  },
  "cards": []
}
```

Fields:
- `map.type`: `"flow"` (only type for now)
- `map.nodes[].id`: Must match a card ID in the chapter
- `map.nodes[].label`: Display text
- `map.nodes[].level`: Row index (0 = top). Nodes at the same level are laid out horizontally.
- `map.edges`: Array of `[fromId, toId]` pairs

### glue — Inter-card transition text

Inserted between cards in the `cards` array. NOT a block — it's a top-level element alongside cards.

```json
{
  "type": "glue",
  "text": "理解了 QKV 的来源后，下一个问题是：Q 和 K 的点积到底在算什么？为什么需要缩放？"
}
```

Fields:
- `type`: Must be `"glue"`
- `text`: Transition paragraph. Should reference what came before and what comes next. Supports term linking.

Rendering: Visually distinct from cards — no border, italic, with a decorative arrow. The `renderChapter()` loop checks `card.type === 'glue'` and renders a `<div class="glue-text">` instead of a card.

---

## knowledge_graph.json

Global index of all registered terms. `engine.js` uses this to auto-link terms in card text.

```json
{
  "nodes": [
    {
      "id": "softmax",
      "term": "Softmax",
      "aliases": ["softmax function", "softmax 函数"],
      "chapter_id": "ch-nn-basics",
      "card_id": "softmax",
      "url": "?ch=ch-nn-basics&card=softmax",
      "oneliner": "Converts a vector of real numbers into a probability distribution",
      "related": ["cross-entropy", "attention", "temperature"]
    }
  ]
}
```

Fields:
- `id`: Unique identifier (lowercase, hyphenated)
- `term`: Display name (used for text matching)
- `aliases`: Alternative strings that should also trigger linking
- `chapter_id` + `card_id`: Routing target
- `url`: Pre-built query string for navigation
- `oneliner`: Hover tooltip text (Layer 1 summary, one sentence)
- `related`: Array of other node IDs for cross-referencing

### Rules for maintaining the knowledge graph

1. Every new term introduced in a card must be registered
2. Every node must have valid `chapter_id` + `card_id` routing
3. When writing about concept A and discovering a link to concept B, add B to A's `related` array (and vice versa)
4. `oneliner` should be a single sentence usable as a hover tooltip
5. `aliases` should include both English and Chinese forms if the card uses both

---

## AGENTS.md Progress Table

Not a JSON file, but a critical data format. Maintained in Markdown:

```
- [ ] ch-xxx                                    ← Not started
- [~] ch-xxx｜done: a, b｜current: c｜todo: d   ← In progress  
- [x] ch-xxx                                    ← Complete (frozen)
```

Update after every atomic operation. New conversations resume from `[~]` lines.
