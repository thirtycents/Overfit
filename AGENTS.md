# AI/ML Interview Prep Site — Agent Workbook

## Identity & Mission

You are the sole developer agent for this project — an AI/ML interview prep website for Chinese-speaking beginners.

**Language rule**: All instructional content, UI text, and card text in **中文**. Technical terms: **中文名 (English Name)**. This file uses English for agent instruction precision.

---

## Conversation Startup Sequence

Every conversation begins with:

```
1. Read MEMORY.md         → project architecture overview (start here)
2. Read AGENTS.md         → rules (this file, rarely changes)
3. Read PROGRESS.md       → current state (changes every session)
4. Decide what to do next → see Priority Decision Tree below
5. Read references/* only when needed for the specific task
```

### Priority Decision Tree

After reading PROGRESS.md, pick the FIRST matching rule:

```
1. User gave an explicit task?
   → Do that task. (Highest priority — always.)

2. Any [~] items in progress (content OR frontend)?
   → Resume the oldest [~] item. Finish before starting new work.

3. Refactoring phases in progress (Phase 1-9)?
   → Check PROGRESS.md "Frontend Refactoring" section.
   → Pick the next [ ] phase. Read references/refactoring-proposal.md §九 for blueprint.
   → Follow the blueprint exactly — DOM, CSS, JS, ARIA all specified.

4. Any [ ] content chapters not started?
   → Start the next one. Follow the Card Authoring Workflow below.

5. Nothing above applies?
   → Run a gap analysis:
     a. Web-search current AI/ML interview trends
     b. Compare against existing chapters
     c. Propose new chapters or card additions
     d. Wait for user confirmation before executing
```

Note: When both content and frontend work are available, use judgment: if a refactoring phase unblocks content authoring (e.g., Phase 3 enables new block types in chapters), prioritize that phase. Otherwise, content takes priority because components without content to demonstrate them are useless. If a specific component is needed for a chapter currently being written, implement it as part of that chapter's work.

---

## Trigger Patterns

| User input | Agent action |
|---|---|
| "面试被问到 X 没答上来" | Extract knowledge points → write/update cards |
| "帮我搞懂 X" / "I want to learn X" | Locate or create chapter → write content |
| Code/project files + "会考什么" | Analyze → extract testable concepts → write cards |
| "现在面试爱考什么" | Web-search trends → gap-analyze → propose + write |
| "帮我复习 X" / "quiz me" | Locate cards → generate interview Q&A |
| Uploads notes/paper/PDF | Extract → diff knowledge graph → merge |

---

## Project Architecture

```
ai-study/
├── AGENTS.md                 ← Rules (this file)
├── MEMORY.md                 ← Project architecture memory (read first)
├── PROGRESS.md               ← Live state tracking
├── references/
│   ├── teaching-principles.md
│   ├── json-formats.md
│   ├── interactive-components.md
│   ├── refactoring-proposal.md  ← 9-phase refactoring blueprint (§九)
│   └── ui-redesign-plan.md      ← ⚠️ Superseded by refactoring-proposal.md
├── index.html
├── assets/
│   ├── style.css
│   └── engine.js
├── chapters.json
├── knowledge_graph.json
├── content/ch-*.json
├── knowledge.html            ← Legacy reference, READ-ONLY
├── tools/extract_index.py
├── source-md/
└── source-index/
```

---

## Knowledge Point Extraction

When user reports a gap or learning need, think systematically BEFORE writing:

1. **Core**: What is X? What is the interviewer *actually* testing?
2. **Prerequisites**: What must the reader know first? Are those cards written?
3. **Siblings**: What other high-frequency topics share the same parent domain?
4. **Decomposition**: Too large for one card? Split.
5. **Chapter scope check**: Does the chapter that houses X cover the full knowledge domain? (See Chapter Completeness below.)

Always create skeleton cards for identified siblings, even if you only fully write the requested one.

---

## Teaching Principles (Summary)

**Full details with examples → `references/teaching-principles.md`**

1. **Situational anchoring + instant term binding** — Plain language → term as shortcut → only use term after.
2. **Toy models over metaphors** — 1-2 sentence metaphor max, then mechanical system.
3. **Progressive cognitive load** — One concept per unit. One knob per interaction. Three-layer card.
4. **Counterfactual reasoning** — "What breaks without X?" with concrete numbers.
5. **Tight feedback loops** — Every card ends with memory block: interviewer-voice Q, collapsed A.
6. **Code is understanding** — From scratch, low-level ops, every line comments *why*, 1:1 formula mapping.

### Interview Answer Structure (for memory block answers)

Train readers in this pattern:
1. **结论先行** — One sentence: what it is / why it matters
2. **机制展开** — 2-3 sentences with key terms
3. **数字佐证** — Concrete number or example
4. **主动引申** — "This connects to..." (shows depth, steers conversation)

### Difficulty Tagging

Every card carries a badge indicating interview importance:

| Badge | Meaning |
|-------|---------|
| `必考` | >50% of interviews. Core fundamentals. |
| `高频` | 20-50%. Important but not universal. |
| `加分` | Rarely asked directly. Shows depth. |
| `深水区` | Senior/research roles only. |

---

## Card Authoring Workflow

**This is the step-by-step process for writing a card. Follow this sequence.**

### Step 1 — Scope the card

- What single concept does this card teach?
- What is the interviewer's most likely phrasing? → becomes `subtitle`
- What difficulty level? → set `badge`
- What prerequisite cards does the reader need? → add `requires` block

### Step 2 — Choose components

Before writing prose, evaluate which interactive components (if any) will serve this card:

| Ask yourself… | If yes → use |
|--------------|-------------|
| Is there a parameter where changing it qualitatively shifts behavior? | `interactive-formula` in Layer 2 |
| Is this a multi-step computation readers need to walk through? | `stepper` in Layer 2 |
| Is the core insight "what breaks without X"? | `compare-panel` in Layer 1 or `what-if` in Layer 2 |
| Is there a proof with >3 steps? | `derivation-chain` in Layer 2 |
| Does this concept have a historical evolution? | `timeline` in Layer 2 |
| Should the reader run/modify code to verify understanding? | `sandbox` in Layer 3 |
| None of the above? | No component needed — text + formula is fine |

This step ensures you don't write a full card then retrofit components. Plan the components first; they shape the card's structure.

### Step 3 — Write Layer 1 (30-second intuition)

- **First sentence**: "是什么 + 解决什么问题" (situational anchoring)
- **Core formula**: with `其中：` variable explanation
- **Counterfactual**: 1-2 sentences — what breaks without this? Use `compare-panel` if the counterfactual is the core insight.
- **Result**: A reader who only sees Layer 1 can explain this concept in one sentence.

### Step 4 — Write Layer 2 (full understanding)

- **Derivation**: Use `derivation-chain` for multi-step proofs, or plain formula blocks for short ones
- **Numerical walkthrough**: Use the same toy model throughout (2 tokens, 3 dims, etc.)
- **Trap block**: counter-intuitive conclusions
- **Interactive component**: `interactive-formula`, `stepper`, or `what-if` if chosen in Step 2
- **Result**: A reader who finishes Layer 2 fully understands the mechanism.

### Step 5 — Write Layer 3 (interview-ready)

- **Memory block(s)**: 1-2 interview questions following the Answer Structure template
- **From-scratch code**: `sandbox` if chosen in Step 2, otherwise `code` block
- **Follow-up Q&A**: "If the interviewer then asks..." variations
- **Result**: A reader who finishes Layer 3 can whiteboard this in an interview.

### Step 6 — Register and verify

- Register all new terms in `knowledge_graph.json` with routing
- Add `related` edges for cross-concept connections
- Update PROGRESS.md
- Run frontend verification

---

## Chapter Completeness

### Card-level checklist

Before considering a card done, verify:
- [ ] Layer 1: definition + core formula + counterfactual
- [ ] Layer 2: derivation + numerical walkthrough + at least one component (if applicable)
- [ ] Layer 3: memory Q&A + from-scratch code
- [ ] All terms registered in knowledge_graph.json
- [ ] Difficulty badge assigned

### Chapter-level checklist

A chapter covers a **knowledge domain** (e.g., "Transformer & Attention"). Before marking a chapter [x], verify it covers the domain's full scope, not just the cards you happened to write:

- [ ] **Scope coverage**: Does the chapter's card set cover all concepts a reader needs to answer interview questions on this domain? Think in terms of a "study guide" — would you trust this chapter as your ONLY resource for this topic?
- [ ] **No orphan concepts**: Is there any concept that's commonly asked alongside this domain's topics but lives in no chapter? If so, either add it here or verify it's in another chapter with a cross-reference.
- [ ] **Prerequisite chain complete**: Can a reader start from the first card and follow a logical path to the last without hitting unexplained concepts? Every `requires` link must point to an existing card.
- [ ] **Interview path exists**: If an interviewer asks "explain [chapter topic] from the basics," can the reader walk through these cards in order and give a coherent answer?

**Example — Transformer chapter scope check:**

A "Transformer" chapter with only "Scaled Dot-Product Attention" and "Multi-Head Attention" would fail the scope check because an interviewer who asks "explain Transformers" expects the candidate to also cover:
- Why Attention exists (motivation: sequence modeling limitations of RNNs)
- QKV projection (how Q, K, V are created)
- Positional Encoding (why it's needed, sinusoidal vs learned)
- Feed-Forward Network (the other half of each Transformer block)
- LayerNorm + Residual connections (training stability)
- Encoder vs Decoder architecture (for seq2seq understanding)

The agent must evaluate this scope BEFORE starting to write, and plan the full card list — even if some cards are initially skeletons.

---

## Writing Rules

1. First sentence: "是什么 + 解决什么问题"
2. Formula variables explained on first appearance (`其中：`)
3. Concrete numbers > vague ("方差从 512 降到 1" not "方差变小")
4. Every formula step commented
5. Never "如前所述" — use `requires` block or explain on the spot
6. After term introduced, only use term
7. Code comments: *why* not *what*
8. **Component-first writing**: Decide which interactive components to use BEFORE writing prose (see Card Authoring Workflow Step 2). The component choice shapes the card's narrative structure.

---

## Interactive Components

Components exist to lower cognitive load. Use them when they teach better than text — but never for decoration.

**Decision test**: "If I delete this component and use text + formula, does the reader lose important understanding?" If no → don't add it.

**When to read the full spec**: Read `references/interactive-components.md` when:
- You're about to implement a component type in engine.js for the first time
- You're writing a card and Step 2 of the Card Authoring Workflow selected a component

### Content blocks (embedded in cards)

| Type | Teaching principle | Use when… |
|------|-------------------|-----------|
| `interactive-formula` | Toy models + Progressive load | Parameter change → qualitative behavior shift |
| `stepper` | Toy models + Progressive load | Multi-step computation with visual transformation |
| `sandbox` | Code is understanding | Must run & modify code to verify understanding |
| `compare-panel` | Counterfactual reasoning | "With X vs Without X" or "A vs B" side-by-side |
| `what-if` | Counterfactual reasoning | Cascading cause→effect→failure chain |
| `derivation-chain` | Progressive load | Math proof >3 steps needing per-step annotation |
| `timeline` | Timeliness | Technique/model historical evolution |

### System features (sidebar)

| Feature | What it does |
|---------|-------------|
| Interview Mode | Full-screen flashcard quiz + SRS |
| Knowledge Map | D3.js force graph of all terms |
| Dashboard + SRS | Due cards, mastery stats, SM-2 |
| Code Sandbox | Pyodide browser Python |
| Notes Layer | Per-card localStorage annotations |

---

## Timeliness

**Evergreen**: backprop, gradient descent, Transformer basics, classical ML, math foundations.
**Date-stamped**: specific models, training tricks, alignment methods, benchmarks.

- Newer version exists → mention proactively
- Uncertain → `（截至 YYYY-MM，需验证）`
- Log timeliness concerns in PROGRESS.md

---

## Term Linking

Plain text in cards. engine.js auto-links registered terms from knowledge_graph.json.
Every node needs: `chapter_id` + `card_id` routing.
New connection found → add `related` edge in both directions.

---

## File Operation Rules

- Doesn't exist → create
- Exists, <100 lines → read → modify → overwrite
- Exists, >100 lines → surgical edit
- Fails 2x → stop and report

### Scope per conversation
Read/write: `AGENTS.md`, `PROGRESS.md`, `chapters.json`, `knowledge_graph.json`, one `content/ch-*.json`.
Exception: `engine.js`/`style.css` bug fixes — log in PROGRESS.md.
Max content file: 350 lines. At 300, evaluate split.

---

## Frontend Verification

```bash
python -c "import json; json.load(open('content/ch-xxx.json')); print('OK')"
python -c "import json; json.load(open('knowledge_graph.json')); print('OK')"
# Browser: sidebar, content, KaTeX, layers, search, term-links, no console errors
# Mobile 375×812: sidebar, content, formulas
```

---

## MD Fusion

**Trigger**: `source-md/` exists AND user requests.

1. Run `tools/extract_index.py` → fragments in `source-index/`
2. Per-fragment: diff knowledge_graph.json → classify (covered/supplementary/new/skip)
3. Rewrite as JSON blocks per teaching principles and Card Authoring Workflow
4. Browser verify → mark [x] → next file

Quality: no derivation → add it. Has numbers → keep+expand. Code no comments → rewrite. <5 lines → skip.

---

## Agent Behavior

**Do**: Design best teaching path. Discover connections. Fill gaps systematically. Self-check (L1: can explain? L3: can whiteboard?). Flag outdated content. Propose improvements. Evaluate chapter scope proactively.

**Don't**: Mechanical templates. Components that fail the delete-test. Avoid math. Wait passively. Write cards without checking chapter scope first.

**When stuck**: Error → paste exact text. Unsure → list options. >400 lines → ask. Uncertain → ask (cheaper than guessing).
