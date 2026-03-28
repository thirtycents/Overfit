# Interactive Components — Teaching Design + Implementation Reference

> **This file answers three questions for every component:**
> 1. **Why does this exist?** — Which teaching principle does it serve?
> 2. **When should the agent use it?** — Decision criteria with concrete examples.
> 3. **How is it implemented?** — JSON format, engine.js rendering, CSS, data flow.

---

## Design Philosophy

Components exist to **lower cognitive load**, not to impress. Before adding any component, apply this test:

**The "delete it" test**: If you remove this component and replace it with pure text + formula, does the reader lose something important? If yes → keep. If no → delete.

**The "one knob" rule**: Each interactive element exposes exactly one variable at a time. After the reader understands that variable, you may add the next. Never show two sliders simultaneously on first encounter.

**The "default is teaching" rule**: Every component must be meaningful at its default state on page load. A reader who never touches a slider or clicks a button should still learn something from the static default view.

---

## Component Taxonomy

### Content blocks (embedded in cards, have a `layer` field)

| Type | Teaching purpose | Serves principle | Best layer |
|------|-----------------|-----------------|------------|
| `interactive-formula` | Feel how a parameter changes behavior | 2 (toy models), 3 (progressive load) | 2 |
| `stepper` | Walk through a multi-step computation | 2 (toy models), 3 (progressive load) | 2 |
| `sandbox` | Verify understanding by running real code | 6 (code is understanding) | 3 |
| `compare-panel` | Side-by-side "with vs without" or "A vs B" | 4 (counterfactual reasoning) | 1 or 2 |
| `what-if` | Cascading cause → effect chain | 4 (counterfactual reasoning) | 2 |
| `derivation-chain` | Collapsible multi-step proof with annotations | 3 (progressive load) | 2 |
| `timeline` | Show evolution of a technique/model family | Timeliness rules | 2 or 3 |

### System features (not block types — triggered from sidebar/keyboard)

| Feature | Teaching purpose | Serves principle |
|---------|-----------------|-----------------|
| **Interview Mode** | Full-screen quiz with SRS scoring | 5 (tight feedback loops) |
| **Knowledge Map** | Visualize term relationships across chapters | 1 (term binding) |
| **Dashboard** | Track mastery, show what is due for review | 5 (tight feedback loops) |
| **Notes Layer** | Per-card personal annotations | Metacognition |

---

## Decision Framework: Which Component for Which Knowledge?

```
Is the concept a multi-step process (algorithm, computation)?
  → YES: Use stepper (Layer 2)

Does changing one parameter cause a qualitative behavior shift?
  → YES: Use interactive-formula (Layer 2)

Is the core insight "what happens if you DON'T do X"?
  → YES: Use compare-panel (Layer 1-2) or what-if (Layer 2)

Is there a mathematical derivation > 3 steps?
  → YES: Use derivation-chain (Layer 2)

Should the reader write/modify code to truly understand?
  → YES: Use sandbox (Layer 3)

Does this concept have a historical evolution?
  → YES: Use timeline (Layer 2-3)

None of the above?
  → Pure text + formula. Don't force a component.
```

### Concrete mapping examples

| Knowledge point | Component | Why |
|----------------|-----------|-----|
| Why divide by sqrt(d) | compare-panel (counterfactual) | The insight IS the counterfactual |
| Attention score computation | stepper | Multi-step matrix operation |
| Effect of learning rate | interactive-formula | Slider shows convergence→divergence |
| Backprop chain rule | derivation-chain | Multi-step proof |
| Implement softmax from scratch | sandbox | Must run code and experiment |
| RLHF → DPO → GRPO | timeline | Historical progression |
| No positional encoding? | what-if | Cause→effect chain to failure |
| Batch Norm vs Layer Norm | compare-panel (comparison) | Side-by-side trade-offs |

---

## Content Block Specs

### 1. interactive-formula

**Serves**: Principle 2 (toy models), Principle 3 (progressive load).

One slider at a time. Default value shows "healthy" state. Moving slider breaks things instructively. Visualization updates on `input` (real-time). Always include axis labels and legend.

**New feature — `annotations` field**: Dynamic text that changes with slider value, replacing static prose.

**JSON**:
```json
{
  "type": "interactive-formula",
  "layer": 2,
  "formula": "$$L_{CLIP} = \\min(r\\hat{A}, \\text{clip}(r, 1-\\varepsilon, 1+\\varepsilon)\\hat{A})$$",
  "params": [
    { "name": "ε", "desc": "Clipping range", "min": 0.05, "max": 0.5, "default": 0.2, "step": 0.05 }
  ],
  "visualization": "clip-curve",
  "annotations": {
    "ranges": [
      { "when": "ε < 0.1", "text": "Too conservative — policy barely updates" },
      { "when": "0.15 ≤ ε ≤ 0.25", "text": "Sweet spot — enough exploration, stable training" },
      { "when": "ε > 0.3", "text": "Dangerous — policy can shift drastically per step" }
    ]
  }
}
```

**engine.js addition**: After canvas, render `<div class="if-annotation" id="{uid}-annot"></div>`. In `updateIF()`, evaluate range conditions against current param values and display matching text.

**CSS**:
```css
.if-annotation {
  font-size: 13px; color: var(--accent); padding: 8px 12px; margin-top: 8px;
  border-left: 3px solid var(--accent); background: rgba(99,102,241,0.05);
  border-radius: 0 6px 6px 0; line-height: 1.6; display: none;
}
```

---

### 2. stepper

**Serves**: Principle 2 (toy models), Principle 3 (progressive load).

Each step self-contained. Visual highlights ONLY what changed. Same toy data throughout (e.g., 2 tokens, 3 dims). Max 8 steps. Step 1 = input, last step = output.

`visual.type` values: `"matrix"` (colored grid with highlight), `"code"` (snippet with highlighted lines), `"diagram"` (inline SVG), or null.

**JSON**: Same format as previously specified, with `context` field for the toy model description.

**engine.js**: `renderBlock()` case generates HTML with `data-steps` attribute. `stepperRender(uid)` reads current step and renders desc/formula/visual. `stepperNav(uid, delta)` and `stepperJump(uid, idx)` handle navigation. `renderStepperVisual(visual)` handles matrix/code/diagram types. Init in `showChapter()` after chapter renders.

**CSS**: `.stepper-block`, `.stepper-controls`, `.stepper-dots`, `.stepper-matrix td.hl` — all as previously specified.

---

### 3. sandbox

**Serves**: Principle 6 (code is understanding).

Code self-contained and runnable. Default produces meaningful output. Include experiment suggestions as comments AND in `experiments` field. Under 30 lines. Always Layer 3. NumPy always available.

**New feature — `experiments` field**: Collapsible "Try these experiments" section below output.

**JSON**:
```json
{
  "type": "sandbox",
  "layer": 3,
  "title": "Verify: sqrt(d) Scaling Reduces Variance",
  "code": "import numpy as np\nnp.random.seed(42)\nd = 64\nQ = np.random.randn(100, d)\nK = np.random.randn(100, d)\nraw = Q @ K.T\nscaled = raw / np.sqrt(d)\nprint(f'Without scaling: var={raw.var():.1f}')\nprint(f'With scaling: var={scaled.var():.2f}')",
  "packages": [],
  "experiments": [
    "Change d to 8 — variance ratio should be exactly 8",
    "Change d to 512 — raw variance ~512, scaled ~1"
  ]
}
```

**engine.js**: Pyodide lazy-loaded on first Run click. `runSandbox(uid)` captures stdout/stderr. Experiments rendered as collapsible list.

**CSS**: `.sandbox-block`, `.sandbox-editor`, `.sandbox-stdout` (green), `.sandbox-stderr` (red), `.sandbox-experiments` — all as previously specified.

---

### 4. compare-panel (NEW)

**Serves**: Principle 4 (counterfactual reasoning). The most direct implementation.

Two modes:
- `counterfactual`: Left = BAD, Right = GOOD. Used for "why does X exist?"
- `comparison`: Neutral A vs B. Used for trade-offs.

Contrast must be stark with concrete numbers. Max 5 rows. Can be Layer 1 for core counterfactuals.

**JSON**:
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

**engine.js**:
```javascript
case 'compare-panel': {
  const mode = block.mode || 'counterfactual';
  const left = block.left || {}, right = block.right || {};
  const leftClass = mode === 'counterfactual' ? 'cp-bad' : 'cp-neutral';
  const rightClass = mode === 'counterfactual' ? 'cp-good' : 'cp-neutral';
  let leftHtml = (left.points||[]).map(p => '<li>'+applyTermLinks(escHtml(p))+'</li>').join('');
  let rightHtml = (right.points||[]).map(p => '<li>'+applyTermLinks(escHtml(p))+'</li>').join('');
  return '<div class="compare-panel cp-'+escHtml(mode)+'">'
    + (block.title ? '<div class="cp-title">'+escHtml(block.title)+'</div>' : '')
    + '<div class="cp-grid">'
    + '<div class="cp-col '+leftClass+'"><div class="cp-col-label">'+escHtml(left.label||'A')+'</div><ul>'+leftHtml+'</ul></div>'
    + '<div class="cp-col '+rightClass+'"><div class="cp-col-label">'+escHtml(right.label||'B')+'</div><ul>'+rightHtml+'</ul></div>'
    + '</div>'
    + (block.verdict ? '<div class="cp-verdict">'+applyTermLinks(escHtml(block.verdict))+'</div>' : '')
    + '</div>';
}
```

**CSS**:
```css
.compare-panel { border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin: 16px 0; }
.cp-title { font-size: 13px; font-weight: 600; padding: 12px 16px; border-bottom: 1px solid var(--border); background: rgba(255,255,255,0.4); }
.cp-grid { display: grid; grid-template-columns: 1fr 1fr; }
.cp-col { padding: 14px 16px; }
.cp-col-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 10px; }
.cp-col ul { padding-left: 16px; margin: 0; }
.cp-col li { font-size: 13px; line-height: 1.7; margin-bottom: 6px; }
.cp-bad { background: rgba(239,68,68,0.05); border-right: 1px solid var(--border); }
.cp-bad .cp-col-label { color: var(--accent4); }
.cp-bad li { color: rgba(180,50,50,0.85); }
.cp-good { background: rgba(16,185,129,0.05); }
.cp-good .cp-col-label { color: var(--accent2); }
.cp-good li { color: rgba(16,140,100,0.9); }
.cp-neutral { background: rgba(99,102,241,0.03); }
.cp-neutral:first-child { border-right: 1px solid var(--border); }
.cp-neutral .cp-col-label { color: var(--accent); }
.cp-verdict { padding: 12px 16px; font-size: 13px; line-height: 1.7; border-top: 1px solid var(--border); background: rgba(255,255,255,0.3); font-weight: 500; }
@media (max-width: 600px) { .cp-grid { grid-template-columns: 1fr; } .cp-bad,.cp-neutral:first-child { border-right:none; border-bottom:1px solid var(--border); } }
```

---

### 5. what-if (NEW)

**Serves**: Principle 4 (counterfactual reasoning). Shows the mechanism of failure, not just outcome.

Max 5 nodes. Each node one sentence. Must end with concrete consequence. Severity markers: start (yellow), mid (orange), end (red).

**JSON**:
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

**engine.js**:
```javascript
case 'what-if': {
  const sev = { start: '🟡', mid: '🟠', end: '🔴' };
  let chainHtml = (block.chain||[]).map((n,i,a) => {
    const arrow = i < a.length-1 ? '<div class="wi-arrow">↓</div>' : '';
    return '<div class="wi-node wi-'+escHtml(n.severity||'mid')+'">'
      + '<span class="wi-emoji">'+(sev[n.severity]||'⚪')+'</span>'
      + '<span class="wi-text">'+applyTermLinks(escHtml(n.text))+'</span>'
      + '</div>' + arrow;
  }).join('');
  return '<div class="what-if-block">'
    + '<div class="wi-premise">'+escHtml(block.premise||'')+'</div>'
    + '<div class="wi-chain">'+chainHtml+'</div>'
    + (block.resolution ? '<div class="wi-resolution">✅ '+applyTermLinks(escHtml(block.resolution))+'</div>' : '')
    + '</div>';
}
```

**CSS**:
```css
.what-if-block { background: linear-gradient(135deg, rgba(239,68,68,0.04), rgba(245,158,11,0.04)); border: 1px solid rgba(239,68,68,0.2); border-radius: 12px; padding: 18px 20px; margin: 16px 0; }
.wi-premise { font-size: 14px; font-weight: 600; color: var(--accent4); margin-bottom: 16px; }
.wi-node { display: flex; align-items: flex-start; gap: 10px; padding: 6px 0; }
.wi-emoji { flex-shrink: 0; font-size: 16px; }
.wi-text { font-size: 13px; line-height: 1.7; color: var(--text2); }
.wi-end .wi-text { color: var(--accent4); font-weight: 600; }
.wi-arrow { text-align: center; color: var(--text3); font-size: 14px; padding: 2px 0 2px 13px; }
.wi-resolution { margin-top: 14px; padding-top: 12px; border-top: 1px solid rgba(16,185,129,0.2); font-size: 13px; color: var(--accent2); line-height: 1.7; }
```

---

### 6. derivation-chain (NEW)

**Serves**: Principle 3 (progressive cognitive load). Makes proofs followable.

Each step: one algebraic transformation + plain-language "why". Collapsed by default. Max ~6 steps. Final step connects to original claim.

**JSON**:
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

**engine.js**:
```javascript
case 'derivation-chain': {
  let stepsHtml = (block.steps||[]).map((s,i) =>
    '<div class="dc-step">'
    + '<button class="dc-step-toggle" onclick="this.parentElement.classList.toggle(\'open\');renderKaTeX(this.parentElement)">'
    + '<span class="dc-step-num">Step '+(i+1)+'</span><span class="dc-step-arrow">▶</span></button>'
    + '<div class="dc-step-body"><div class="dc-formula">'+(s.formula||'')+'</div>'
    + '<div class="dc-why">'+escHtml(s.why||'')+'</div></div></div>'
  ).join('');
  return '<div class="derivation-chain">'
    + '<div class="dc-title">'+escHtml(block.title||'Derivation')+'</div>'
    + (block.setup ? '<div class="dc-setup">'+applyTermLinks(escHtml(block.setup))+'</div>' : '')
    + '<div class="dc-steps">'+stepsHtml+'</div></div>';
}
```

**CSS**:
```css
.derivation-chain { background: linear-gradient(135deg, rgba(139,92,246,0.06), rgba(139,92,246,0.02)); border: 1px solid rgba(139,92,246,0.2); border-left: 4px solid var(--accent5); border-radius: 0 12px 12px 0; padding: 16px 18px; margin: 16px 0; }
.dc-title { font-size: 13px; font-weight: 600; color: var(--accent5); margin-bottom: 8px; }
.dc-setup { font-size: 13px; color: var(--text2); line-height: 1.7; margin-bottom: 12px; }
.dc-step { border: 1px solid rgba(139,92,246,0.15); border-radius: 8px; margin-bottom: 6px; overflow: hidden; background: rgba(255,255,255,0.5); }
.dc-step-toggle { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 8px 12px; background: none; border: none; cursor: pointer; font-family: inherit; }
.dc-step-num { font-size: 12px; font-weight: 600; color: var(--accent5); }
.dc-step-arrow { font-size: 10px; color: var(--text3); transition: transform 0.2s; }
.dc-step.open .dc-step-arrow { transform: rotate(90deg); }
.dc-step-body { display: none; padding: 8px 12px 12px; border-top: 1px solid rgba(139,92,246,0.1); }
.dc-step.open .dc-step-body { display: block; animation: fadeIn 0.2s ease; }
.dc-formula { text-align: center; margin-bottom: 8px; }
.dc-why { font-size: 12px; color: var(--text3); font-style: italic; line-height: 1.6; }
```

---

### 7. timeline (NEW)

**Serves**: Timeliness rules. Shows technique/model evolution with dates.

Each node: date, label, one-sentence desc, status (historical/mainstream/emerging), optional cardRef for navigation.

**JSON**:
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

**engine.js**:
```javascript
case 'timeline': {
  const badges = { historical: '<span class="tl-badge tl-historical">historical</span>', mainstream: '<span class="tl-badge tl-mainstream">mainstream</span>', emerging: '<span class="tl-badge tl-emerging">emerging</span>' };
  let html = '<div class="timeline-block"><div class="tl-title">'+escHtml(block.title||'')+'</div><div class="tl-track">';
  for (const e of (block.entries||[])) {
    const link = e.cardRef ? ' onclick="goToCard(currentChapterId,\''+escHtml(e.cardRef)+'\')" style="cursor:pointer"' : '';
    html += '<div class="tl-entry"'+link+'>'
      + '<div class="tl-dot-line"><div class="tl-dot tl-'+escHtml(e.status||'historical')+'"></div></div>'
      + '<div class="tl-content"><div class="tl-date">'+escHtml(e.date)+'</div>'
      + '<div class="tl-label">'+escHtml(e.label)+' '+(badges[e.status]||'')+'</div>'
      + '<div class="tl-desc">'+applyTermLinks(escHtml(e.desc||''))+'</div></div></div>';
  }
  html += '</div></div>';
  return html;
}
```

**CSS**:
```css
.timeline-block { margin: 16px 0; padding: 16px 0; }
.tl-title { font-size: 13px; font-weight: 600; margin-bottom: 16px; }
.tl-track { padding-left: 24px; }
.tl-entry { display: flex; gap: 12px; padding: 8px; border-radius: 8px; margin-left: -8px; transition: background 0.2s; }
.tl-entry:hover { background: rgba(99,102,241,0.04); }
.tl-dot-line { position: relative; width: 12px; flex-shrink: 0; }
.tl-dot { width: 10px; height: 10px; border-radius: 50%; border: 2px solid var(--border); background: var(--bg); z-index: 1; position: relative; }
.tl-dot.tl-historical { background: var(--text3); border-color: var(--text3); }
.tl-dot.tl-mainstream { background: var(--accent2); border-color: var(--accent2); }
.tl-dot.tl-emerging { background: var(--accent3); border-color: var(--accent3); }
.tl-entry:not(:last-child) .tl-dot-line::after { content: ''; position: absolute; left: 4px; top: 14px; width: 2px; height: calc(100% + 8px); background: var(--border); }
.tl-date { font-size: 11px; color: var(--text3); font-family: 'JetBrains Mono', monospace; }
.tl-label { font-size: 14px; font-weight: 600; margin: 2px 0 4px; }
.tl-desc { font-size: 13px; color: var(--text2); line-height: 1.6; }
.tl-badge { font-size: 10px; padding: 2px 8px; border-radius: 4px; font-weight: 500; vertical-align: middle; margin-left: 4px; }
.tl-historical { background: rgba(138,138,154,0.15); color: var(--text3); }
.tl-mainstream { background: rgba(16,185,129,0.12); color: var(--accent2); }
.tl-emerging { background: rgba(245,158,11,0.12); color: var(--accent3); }
```

---

## System Features

### Interview Mode
Full-screen flashcard quiz. Pulls memory blocks from all chapters. Space=reveal, 1/2/3=rate, Escape=exit. SRS scoring writes to localStorage. Session summary shows stats. Full implementation: startInterviewMode, renderInterviewCard, revealInterviewAnswer, rateInterviewAnswer, closeInterviewMode functions + CSS as specified in project codebase.

### Knowledge Map (D3.js)
Full-screen overlay. D3 lazy-loaded. Nodes from knowledge_graph.json colored by chapter dotColor. Edges from related fields. Click node → goToCard(). Zoom + drag. Full implementation: showKnowledgeGraph, renderKnowledgeGraph, closeKnowledgeGraph functions + CSS.

### Dashboard + SRS (SM-2)
SM-2: calcNextInterval(prev, level), calcEaseFactor(prev, level). getDueCards() scans localStorage. showDashboard() renders to chapterContainer with stats grid + chapter progress bars + reset button.

### Notes Layer
Per-card textarea injected at end of card-body in renderCard(). Auto-saves on input to localStorage. Indicator dot shows which cards have notes. loadNote(textarea) hydrates on chapter load.

---

## localStorage Namespace

| Pattern | Purpose |
|---------|---------|
| `ai-study:srs:{cardId}:{qHash}` | Spaced repetition record |
| `ai-study:notes:{chapterId}:{cardId}` | User notes |
| `ai-study:progress:stats` | Dashboard cache |

---

## Integration Order

1. Add renderBlock() cases: stepper, sandbox, compare-panel, what-if, derivation-chain, timeline
2. Add notes layer to renderCard()
3. Add showChapter() init: stepperRender, loadNote
4. Add sidebar buttons: Knowledge Map, Interview Mode, Dashboard
5. Add SRS functions + migrate recall-* keys
6. Append all CSS
7. Lazy-load D3 and Pyodide

---

## System Features — Phase 4 Additions

### Term Hover Tooltip (Phase 4a)

**Serves**: Principle 1 (term binding) — reinforces term definitions without breaking reading flow.

**Technology**: Custom singleton tooltip + **Floating UI DOM** v1.6.12 for positioning (`computePosition` + `flip` + `shift` + `offset` + `autoUpdate`). Lazy-loaded on first hover.

**Why not CSS-only**: CSS tooltips cannot detect viewport overflow (collision detection). Floating UI handles `flip` (above↔below) and `shift` (left/right edge clamp) automatically.

**Why not Tippy.js**: Last commit 2022, wraps Popper.js (deprecated in favor of Floating UI). Use the maintained successor directly.

**Decision test**: "If I delete the tooltip and the user has to click every term to see its definition, do they lose flow?" **Yes** — tooltips save a full context switch for simple definitions.

#### Behavior

1. **Desktop (hover: hover)**: `mouseenter` .term-link → 300ms delay → show tooltip. `mouseleave` → 200ms delay → hide. Tooltip itself is hoverable (entering it cancels hide timer). `Escape` → instant hide.
2. **Touch (hover: none)**: tap .term-link → open Overlay Drawer (4b) instead. No tooltip on touch.
3. **Keyboard**: `focusin` .term-link → show. `focusout` → hide. `Escape` → hide.
4. **Singleton**: One tooltip instance. Showing a new tooltip replaces the previous. Only one `autoUpdate` active at a time.

#### Data source

- `knowledge_graph.json` node → `term` (title), `oneliner` (definition), optional `formula` (core formula if any).
- term-link elements carry `data-node-id="{nodeId}"` set by `applyTermLinks()`.
- Add `tabindex="0"` and `aria-describedby="termTooltip"` to each term-link.

#### DOM

```html
<div id="termTooltip" class="term-tooltip" role="tooltip" aria-hidden="true">
  <div class="tt-term"></div>
  <div class="tt-oneliner"></div>
  <div class="tt-formula"></div>
  <div class="tt-action">点击查看完整卡片 →</div>
</div>
```

#### CSS

```css
.term-tooltip {
  position: absolute; top: 0; left: 0; z-index: 200;
  max-width: 320px; padding: 12px 16px;
  background: var(--bg); border: 1px solid var(--border); border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  opacity: 0; pointer-events: none; transition: opacity 0.15s;
  font-size: 13px;
}
.term-tooltip.visible { opacity: 1; pointer-events: auto; }
.tt-term { font-weight: 700; font-size: 14px; color: var(--accent); margin-bottom: 6px; }
.tt-oneliner { color: var(--text2); line-height: 1.6; margin-bottom: 8px; }
.tt-formula { text-align: center; margin-bottom: 8px; }
.tt-action { font-size: 11px; color: var(--accent); font-weight: 500; }
```

#### JS skeleton

```javascript
// Lazy-load Floating UI on first tooltip show
let floatingUI = null;
let tooltipCleanup = null;

async function ensureFloatingUI() {
  if (!floatingUI) {
    floatingUI = await import('https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.6.12/+esm');
  }
  return floatingUI;
}

function showTermTooltip(termLinkEl) {
  // 1. Get node data from knowledgeGraph via data-node-id
  // 2. Populate tooltip fields
  // 3. computePosition with flip + shift + offset(8)
  // 4. autoUpdate while visible (returns cleanup fn)
  // 5. renderKaTeX inside tooltip if formula present
}

function hideTermTooltip() {
  // 1. Remove .visible class
  // 2. Call tooltipCleanup() to stop autoUpdate
  // 3. Set aria-hidden="true"
}

// Event delegation on #chapterContainer:
//   mouseenter .term-link → showTermTooltip (300ms delay)
//   mouseleave .term-link → hideTermTooltip (200ms delay)
//   mouseenter #termTooltip → cancel hide timer
//   mouseleave #termTooltip → hideTermTooltip
//   Escape key → instant hide
```

---

### Knowledge Overlay Drawer (Phase 4b)

**Serves**: Principle 3 (progressive cognitive load) — allows deep-diving into prerequisites without losing current context.

**Technology**: Custom CSS `transform: translateX()` animation + **focus-trap** v7.6.2 (+ tabbable v6.2.0 dependency) for accessibility. Lazy-loaded on first drawer open.

**Why not a new page**: User explicitly requested keeping "where I came from" visible. 2/3 width overlay preserves left-side context.

**Why not stacked drawers**: Single drawer with internal breadcrumb history. Simpler DOM, no z-index stacking issues, cleaner mental model.

**Decision test**: "If I delete the drawer and only have tooltip + page navigation, do users lose understanding?" **Yes** — navigating away from the current card for a prerequisite breaks flow. The drawer preserves reading context.

#### Behavior

1. **Open**: Click .term-link → `openDrawer(chapterId, cardId)`. Drawer slides in from right (66vw, max 800px). Backdrop dims left 1/3.
2. **Nested navigation**: Clicking a term-link inside the drawer → push to stack → re-render drawer content + update breadcrumb. No new DOM elements — content replaces.
3. **Breadcrumb back**: Click a breadcrumb node → pop stack to that index → restore content + scroll position.
4. **Close**: Click backdrop, press Escape, or click ✕ button → slide out + fade backdrop → restore focus to trigger element.
5. **Focus trap**: Tab cycles within drawer only. Deactivate on close.
6. **Mobile (<768px)**: Drawer goes full width (100vw).

#### DOM

```html
<div id="knowledgeDrawer" class="knowledge-drawer" role="dialog"
     aria-modal="true" aria-label="知识详情" hidden>
  <div class="drawer-backdrop" onclick="closeDrawer()"></div>
  <div class="drawer-panel">
    <div class="drawer-header">
      <nav class="drawer-breadcrumb" aria-label="导航路径"></nav>
      <button class="drawer-close" onclick="closeDrawer()" aria-label="关闭">✕</button>
    </div>
    <div class="drawer-content" id="drawerContent"></div>
  </div>
</div>
```

#### CSS

```css
.knowledge-drawer { position: fixed; inset: 0; z-index: 300; display: flex; justify-content: flex-end; }
.knowledge-drawer[hidden] { display: none; }
.drawer-backdrop { position: absolute; inset: 0; background: rgba(0,0,0,0.4); animation: fadeIn 0.2s ease; }
.drawer-panel {
  position: relative; width: 66vw; max-width: 800px;
  background: var(--bg); border-left: 1px solid var(--border);
  box-shadow: -8px 0 32px rgba(0,0,0,0.1);
  display: flex; flex-direction: column;
  transform: translateX(100%);
  animation: slideInRight 0.25s cubic-bezier(0.4,0,0.2,1) forwards;
  overflow-y: auto;
}
@keyframes slideInRight { to { transform: translateX(0); } }
@keyframes slideOutRight { from { transform: translateX(0); } to { transform: translateX(100%); } }
.drawer-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 12px 20px; border-bottom: 1px solid var(--border);
  position: sticky; top: 0; background: var(--bg); z-index: 1;
}
.drawer-breadcrumb { display: flex; gap: 6px; align-items: center; font-size: 12px; color: var(--text3); overflow: hidden; }
.drawer-breadcrumb .crumb { cursor: pointer; color: var(--accent); white-space: nowrap; }
.drawer-breadcrumb .crumb:hover { text-decoration: underline; }
.drawer-breadcrumb .crumb-current { color: var(--text); font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.drawer-close { width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg2); cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; }
.drawer-content { padding: 20px; flex: 1; }
@media (max-width: 768px) { .drawer-panel { width: 100vw; max-width: none; } }
```

#### JS skeleton

```javascript
let drawerStack = [];   // [{ chapterId, cardId, scrollTop }]
let drawerTrap = null;  // focus-trap instance

async function openDrawer(chapterId, cardId) {
  // 1. Push to drawerStack
  // 2. Fetch chapter data (reuse chapterCache)
  // 3. Find card, render with renderCardForDrawer(card)
  // 4. Show drawer (hidden = false)
  // 5. renderKaTeX in drawer content
  // 6. Lazy-load focus-trap if needed, activate
  // 7. Update breadcrumb
}

function closeDrawer() {
  // 1. Deactivate focus-trap
  // 2. Slide-out animation
  // 3. After animation: hide drawer, clear stack
  // 4. Restore focus to trigger element
}

function drawerGoBack(index) {
  // 1. Slice stack to index+1
  // 2. Re-render content for stack top
  // 3. Restore scrollTop
  // 4. Update breadcrumb
}

// Drawer content term-links → openDrawer(newChapter, newCard) (recursive push)
```
