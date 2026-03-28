# Teaching Principles — Full Reference

These principles guide every piece of content. They are guidelines, not rigid templates.
When principles conflict, the tiebreaker is always: **"will the reader actually learn this?"**

---

## Principle 1: Situational Anchoring + Instant Term Binding

**Core idea**: Don't maintain two parallel systems ("plain language" vs "jargon"). Introduce the term the moment the plain description gets wordy — the term becomes a shortcut. After introduction, use only the term. Force the reader to think in industry language.

**Method:**
1. Describe a phenomenon or problem in direct language
2. When the description becomes awkward to repeat, introduce the term as a "keyboard shortcut"
3. After the bridge, burn it — only use the term from then on

**Term linking**: `engine.js` auto-converts registered terms into `term-link` elements.
- **Hover**: Layer 1 tooltip (one-line definition + core formula)
- **Click**: Opens full card in new tab (`target="_blank"`)
- You never manually write links — just use the term in plain text

**Example — teaching "Bootstrapping":**

```
✗ Bad (academic opening):
"This section introduces temporal difference algorithms, which use the
bootstrapping method..."

✓ Good (situational anchor + instant bind):
"Suppose you're estimating drive time from Beijing to Shanghai. You don't
wait until you arrive to update your estimate — after reaching Tianjin,
you use actual elapsed time plus your 'Tianjin → Shanghai' estimate to
correct the original guess. This 'use next-step's estimate to correct
current estimate' technique is called **Bootstrapping**. And your
estimation error is called **TD Error (Temporal Difference Error)**."
```

---

## Principle 2: Toy Models Over Metaphors

**Core idea**: Build precise intuition with minimal mechanical systems the reader can run in their head, not with loose analogies that spawn uncontrolled associations.

**Method:**
1. Metaphor gets 1-2 sentences to lower the fear barrier, then cut it
2. Actively break the metaphor ("But the program doesn't get tired — it's just doing math optimization")
3. Replace with a toy model: 3×3 grid world, tiny matrix, 2-token sequence
4. Toy model must be small enough to hand-compute, large enough to show the mechanism

**Example — teaching "Policy":**

```
✗ Bad:
"A policy is like a dog's muscle memory"

✓ Good:
"Imagine a table: left column lists every position a robot can be in
(A1, A2, …), right column lists which direction to move (up/down/left/right).
This table is the **Policy**. Reinforcement learning's goal is to fill
every row with the optimal action."
```

---

## Principle 3: Progressive Cognitive Load

**Core idea**: Working memory handles 3-4 new elements at once. Each teaching unit introduces exactly one new concept.

**Method:**
1. **One-knob rule**: `interactive-formula` exposes one adjustable parameter at a time; after covering it, add the next
2. **Three-layer structure inherently supports this**: Layer 1 = definition + formula; Layer 2 = derivation; Layer 3 = interview depth
3. **Explicit prerequisites**: If concept A requires B, use a `requires` block pointing to B's card — never write "as discussed earlier"
4. **Meaningful defaults**: Interactive components run a demo on load with sensible defaults — the reader learns something without touching anything

---

## Principle 4: Counterfactual Reasoning

**Core idea**: Don't just say "what it is" — say "what breaks if you don't do this." This is the strongest memory anchor.

When the reader knows "skipping √d scaling makes softmax saturate and gradients vanish," they'll never forget why the scaling exists.

**Method:**
- Every core concept gets at least one counterfactual
- Verify counterfactuals with concrete numbers ("d=512: variance goes from 512 to 1")
- Use `trap` blocks for counter-intuitive conclusions

---

## Principle 5: Tight Feedback Loops

**Core idea**: Test immediately after learning. Shorter the gap, stronger the memory.

**Method:**
- Every card ends with a `memory` block containing 1-2 self-test questions
- Questions use interviewer phrasing ("Why does Transformer use Scaled Dot-Product instead of raw dot product?")
- Answers are concise and interview-ready (≤3 sentences)
- Answers contain key terms (reader practices speaking in jargon)
- Answers are collapsed by default — reader thinks first, then checks

---

## Principle 6: Code Is Understanding

**Core idea**: Hand-writing code isn't a bonus exercise — it's the ultimate proof of understanding.

**Method:**
- Implement from scratch using basic ops (`torch.nn` primitives, not `nn.MultiheadAttention`)
- Every line has a comment explaining **why**, not **what**
- Code and formula map 1:1 — reader should see each formula term in the code
- Code lives in Layer 3 (interview depth)

---

## Self-Test Question Design

For the `memory` block at the bottom of each card:

1. Phrase as an interviewer would ask it
2. Answer should be directly usable in an interview (concise, precise, with key terms)
3. Maximum 3 sentences per answer
4. Include at least one technical term the reader must use correctly

**Example:**
```
Q: "Why does Transformer use Scaled Dot-Product Attention instead of plain dot product?"

A: "When dimension d is large, dot product variance scales linearly with d,
pushing softmax inputs to extreme values where gradients approach zero.
Dividing by √d normalizes variance to 1, keeping gradients healthy."
```

---

## Interview Answer Structure

The `memory` block answers should teach the reader HOW to answer, not just what the answer is. Train them in this pattern:

1. **结论先行 (Lead with conclusion)** — One sentence: what it is or why it matters.
2. **机制展开 (Expand mechanism)** — 2-3 sentences explaining how, using key terms.
3. **数字佐证 (Support with numbers)** — One concrete number or example.
4. **主动引申 (Proactive extension)** — "This relates to..." Shows depth, steers the conversation to territory you know well.

**Example — "Why divide by √d?":**

```
结论：除以 √d_k 是为了防止注意力退化为 one-hot。

机制：当维度 d 较大时，点积 Q·K 的方差与 d 成正比，
导致 Softmax 输入值过大，输出趋近 one-hot 分布，
梯度接近零，训练无法进行。

数字：d=512 时，不缩放方差是 512；缩放后方差降为 1。

引申：这也是为什么 Multi-Head Attention 用 d_k = d_model/h
而不是 d_model — 更小的 d_k 本身就降低了方差，
但缩放仍然必要因为 d_k 通常也有 64。
```

---

## Difficulty Tagging Guide

Every card's primary kitem block should carry a `badge` field indicating interview importance:

| Badge | Chinese | When to use |
|-------|---------|-------------|
| `"必考"` | 核心考点 | Concept appears in >50% of interviews. Fundamentals. |
| `"高频"` | 高频考点 | Appears in 20-50%. Important but not universal. |
| `"加分"` | 加分项 | Rarely asked directly. Shows depth to senior interviewers. |
| `"深水区"` | 深水区 | Senior/research roles only. Cutting-edge or heavy math. |

Agent should assign these based on:
- Web-searched interview frequency data
- The concept's centrality in the knowledge graph (many connections = likely 必考)
- Whether it's a prerequisite for other concepts (prereqs are more likely 必考)

---

## Chapter Completeness Checklist

Before marking a chapter [x] frozen, verify it covers:

1. **Motivation**: Why does this concept/technique exist? What problem does it solve?
2. **Core mechanism**: The algorithm, architecture, or mathematical operation.
3. **Key formula(s)**: With Layer 2 derivation and variable explanations.
4. **Counterfactual**: At least one "what breaks without it" with concrete numbers.
5. **Comparison**: How does this relate to alternatives? (compare-panel or table)
6. **Interview Q&A**: At least 2 memory blocks with interviewer-phrased questions.
7. **Code**: From-scratch implementation in Layer 3.
8. **Graph links**: All terms registered in knowledge_graph.json with routing + related edges.

If any item is missing, the chapter is [~] not [x].
