# UI Redesign Plan — AI/ML Interview Prep Site

## Problem Diagnosis

Looking at the 4 screenshots, here are the issues ranked by impact:

### P0 — Layout is eating your content

**Problem**: Three fixed columns (sidebar 260px + right TOC 320px) leave main content only ~460px wide on a 1440px screen. On smaller screens, it's worse. Your content — the actual reason people visit — is squeezed into a narrow corridor.

**Evidence**: In screenshot 3 (card expanded), the text paragraph wraps excessively. The formula block and trap block feel cramped. The table columns are tight. Everything screams "I need more room."

**Root cause**: The right TOC panel shows 5 items max — that's not worth 320px of permanent screen real estate. The left sidebar has 11+ chapters that create a very long list, but it's always visible even when you're reading deep inside a card.

### P1 — Layer stacking creates scroll hell

**Problem**: Clicking "展开推导" inserts Layer 2 content BELOW Layer 1. Then clicking "面试视角" inserts Layer 3 below Layer 2. On a card like "时间复杂度" this creates a single column of content that's 4-5 screens tall. The reader loses context — they can't see Layer 1's definition while reading Layer 2's derivation.

**Evidence**: Screenshots 1-3 show the same card across 3 full screens of scrolling. The reader has to scroll back up to re-read the formula while working through the derivation below.

### P2 — Card header design wastes first impressions

**Problem**: The collapsed card (screenshot 4) shows icon + title + subtitle. But there's no indication of:
- What difficulty level is this? (必考? 加分?)
- Have I studied this before? (new/learning/mastered)
- How much content is inside?

The reader can't prioritize which card to open first.

### P3 — Visual monotony

**Problem**: Every card, every block, every section uses the same visual rhythm: white box with thin border, 14px text, indigo accent. There's no visual hierarchy between a core definition and a code block. The trap block (red) and memory block (green) are the only splashes of color, but they're deep inside expanded cards where most readers never reach.

### P4 — Mobile is broken

**Problem**: At 768px, the sidebar slides off-screen. But there's no hamburger button to bring it back. The right TOC disappears at 1024px. On a phone (375px), there's no navigation at all.

---

## Redesign Plan

### 1. Layout: Two-column with collapsible sidebar

**Kill the right TOC panel entirely.** Replace it with a sticky inline pill bar at the top of each chapter's content area. This instantly gives content ~300px more breathing room.

**Collapse the sidebar to icon-only by default (60px).** Hover or click expands to full width (260px) as an overlay, not pushing content. This gives content another 200px on screens where sidebar is collapsed.

**New layout math:**
- Desktop (>1200px): sidebar 60px collapsed + content area fills rest, max-width 800px centered
- Sidebar expands to 280px overlay on hover/click, darkens backdrop
- Tablet (768-1200px): sidebar hidden, hamburger button in top-left corner
- Mobile (<768px): sidebar becomes bottom tab bar with 4-5 icons

```
┌──────┬────────────────────────────────────┐
│ 60px │                                    │
│ icon │     Content (max-width: 800px)     │
│ rail │          centered                  │
│      │                                    │
│      │  ┌──Card pill nav (sticky)──────┐  │
│      │  │ 📐 时间复杂度  🧩 动态规划 ...│  │
│      │  └──────────────────────────────┘  │
│      │                                    │
│      │  ┌──Card──────────────────────┐    │
│      │  │ [直觉] [推导] [面试]       │    │
│      │  │                            │    │
│      │  │  (active tab content)      │    │
│      │  │                            │    │
│      │  └────────────────────────────┘    │
│      │                                    │
└──────┴────────────────────────────────────┘
```

**CSS changes:**

```css
/* Icon rail sidebar */
.sidebar {
  width: 60px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.sidebar:hover, .sidebar.expanded {
  width: 280px;
  position: fixed;
  z-index: 200;
  box-shadow: 20px 0 60px rgba(0,0,0,0.1);
}
.sidebar .nav-item .label { 
  opacity: 0; 
  transition: opacity 0.2s; 
}
.sidebar:hover .nav-item .label,
.sidebar.expanded .nav-item .label { 
  opacity: 1; 
}

/* Kill right TOC */
.toc-panel { display: none; }

/* Main content reclaims full width */
.main {
  margin-left: 60px;
  margin-right: 0;
  width: calc(100% - 60px);
  padding: 0 24px 80px;
}
.chapter {
  max-width: 800px;
  margin: 0 auto;
}
```

### 2. Card Layers: Tabs, not stacking

**Replace the "展开推导" / "面试视角" buttons with a tab bar inside each card.** Only one layer is visible at a time. Switching layers replaces content, doesn't append.

Three tabs:
- **直觉** (Layer 1) — default active, indigo accent
- **推导** (Layer 2) — purple accent  
- **面试** (Layer 3) — green accent

Each tab has a distinct accent color so the reader always knows which depth they're at.

**Why tabs are better than stacking:**
1. Card height stays predictable — no scroll bombs
2. Reader can flip between L1 definition and L3 code instantly
3. Each layer gets the full card width — no cramping
4. The tab bar itself acts as a progress indicator ("I've read 直觉 and 推导, haven't touched 面试 yet")

**HTML structure change in `renderCard()`:**

```html
<div class="card" id="card-xxx">
  <div class="card-head" onclick="toggleCard(this)">
    <!-- same as now: icon, title, subtitle, arrow -->
    <!-- NEW: add difficulty badge + progress indicator -->
    <span class="card-badge badge-必考">必考</span>
  </div>
  <div class="card-body">
    <!-- Tab bar replaces layer-controls -->
    <div class="card-tabs">
      <button class="card-tab active" data-layer="l1" onclick="switchLayer(this)">
        直觉
      </button>
      <button class="card-tab" data-layer="l2" onclick="switchLayer(this)">
        推导
      </button>
      <button class="card-tab" data-layer="l3" onclick="switchLayer(this)">
        面试
      </button>
    </div>
    
    <!-- Only one layer visible at a time -->
    <div class="card-layer active" id="l1-xxx">
      <!-- Layer 1 blocks -->
    </div>
    <div class="card-layer" id="l2-xxx">
      <!-- Layer 2 blocks -->
    </div>
    <div class="card-layer" id="l3-xxx">
      <!-- Layer 3 blocks -->
    </div>
  </div>
</div>
```

**CSS:**

```css
.card-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--border);
  margin-bottom: 16px;
}
.card-tab {
  flex: 1;
  padding: 10px 0;
  font-size: 13px;
  font-weight: 500;
  color: var(--text3);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  text-align: center;
}
.card-tab:hover { color: var(--text2); }
.card-tab.active[data-layer="l1"] { 
  color: var(--accent); 
  border-bottom-color: var(--accent); 
}
.card-tab.active[data-layer="l2"] { 
  color: var(--accent5); 
  border-bottom-color: var(--accent5); 
}
.card-tab.active[data-layer="l3"] { 
  color: var(--accent2); 
  border-bottom-color: var(--accent2); 
}

.card-layer { display: none; animation: fadeIn 0.25s ease; }
.card-layer.active { display: block; }
```

**JS:**

```javascript
window.switchLayer = function(btn) {
  const card = btn.closest('.card');
  const layer = btn.dataset.layer;
  
  // Update tab active state
  card.querySelectorAll('.card-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  
  // Switch visible layer
  card.querySelectorAll('.card-layer').forEach(l => l.classList.remove('active'));
  const target = card.querySelector('#' + layer + '-' + card.id.replace('card-', ''));
  if (target) {
    target.classList.add('active');
    // Re-render KaTeX in newly visible content
    renderKaTeX(target);
  }
};
```

### 3. Chapter navigation: sticky pill bar replaces right TOC

The right TOC panel used 320px for 5 clickable items. Replace with a horizontal sticky bar at the top of the content area, just below the chapter header.

**When scrolled past the chapter header, this bar sticks to the top.** It shows all card titles as small pills. The currently-in-viewport card is highlighted.

```css
.chapter-nav {
  display: flex;
  gap: 8px;
  padding: 10px 0;
  overflow-x: auto;
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(250,249,246,0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
  scrollbar-width: none; /* hide scrollbar */
}
.chapter-nav::-webkit-scrollbar { display: none; }

.chapter-nav-pill {
  flex-shrink: 0;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  color: var(--text3);
  background: var(--bg3);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.chapter-nav-pill:hover {
  color: var(--text2);
  border-color: var(--border);
}
.chapter-nav-pill.active {
  color: var(--accent);
  background: rgba(99,102,241,0.08);
  border-color: rgba(99,102,241,0.3);
}
```

**JS**: Use `IntersectionObserver` to track which card is in viewport and update the active pill.

### 4. Card header: add difficulty badge + study status

**Difficulty badge** (from AGENTS.md teaching principles):

```css
.card-badge {
  font-size: 10px;
  font-weight: 600;
  padding: 3px 8px;
  border-radius: 4px;
  letter-spacing: 0.3px;
}
.badge-必考 { background: rgba(239,68,68,0.12); color: #c0392b; }
.badge-高频 { background: rgba(245,158,11,0.12); color: #b87817; }
.badge-加分 { background: rgba(99,102,241,0.12); color: #4f46e5; }
.badge-深水区 { background: rgba(139,92,246,0.12); color: #7c3aed; }
```

**Study status dot** — reads from localStorage SRS data:

```css
.card-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.card-status.new { background: var(--text3); opacity: 0.3; } /* never studied */
.card-status.learning { background: var(--accent3); } /* started, not mastered */
.card-status.mastered { background: var(--accent2); } /* SRS interval > 21d */
```

### 5. Smooth transitions and reading flow

**Card open/close animation** — slide down, not sudden appear:

```css
.card-body {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1),
              padding 0.3s ease;
  padding: 0 24px;
}
.card.open .card-body {
  max-height: 3000px; /* generous max */
  padding: 0 24px 24px;
}
```

**Scroll progress indicator** — thin bar at the very top of the page showing how far through the chapter you are:

```css
.scroll-progress {
  position: fixed;
  top: 0;
  left: 60px; /* after sidebar */
  right: 0;
  height: 3px;
  z-index: 999;
  background: transparent;
}
.scroll-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--accent), var(--accent5));
  width: 0%;
  transition: width 0.1s;
}
```

### 6. Visual hierarchy through block styling

Currently every block type looks similar — light background, thin border. Rework to create clear visual hierarchy:

**Layer 1 blocks** — clean, no box wrapper. Content flows like a well-typeset article.

**Layer 2 blocks** — subtle left border accent (like current formula-block), showing "this is deeper content."

**Layer 3 blocks** — distinct card-within-card treatment. Memory block becomes a mini flashcard. Code block gets a terminal aesthetic.

**Formula blocks** — larger font, more breathing room, subtle purple background:

```css
.formula-block-math {
  padding: 28px 32px;
  margin: 20px -8px; /* slightly wider than text column */
  font-size: 1.2em;
}
```

**Trap blocks** — more dramatic, impossible to miss:

```css
.trap-block {
  border-left-width: 5px;
  padding: 18px 22px;
  position: relative;
}
.trap-block::before {
  content: '';
  position: absolute;
  top: 0; right: 0;
  width: 80px; height: 80px;
  background: radial-gradient(circle at top right, rgba(239,68,68,0.08), transparent);
  pointer-events: none;
}
```

### 7. Mobile redesign

**Bottom navigation bar** replacing the sidebar on mobile:

```css
@media (max-width: 768px) {
  .sidebar { display: none; }
  
  .mobile-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 56px;
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(12px);
    border-top: 1px solid var(--border);
    z-index: 200;
    justify-content: space-around;
    align-items: center;
    padding: 0 8px;
  }
  
  .main {
    margin-left: 0;
    width: 100%;
    padding: 0 16px 72px; /* 72px for bottom nav */
  }
  
  /* Swipe hint on card tabs */
  .card-tabs { 
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}
```

Mobile bottom nav icons: 📚 Chapters | 🔍 Search | 🎯 Interview | 📊 Dashboard

**Swipe between layers** on mobile: add touch event listeners to card-body that detect horizontal swipe and switch tabs.

### 8. Reading mode

Add a "focus mode" toggle (keyboard shortcut: `F`) that:
- Hides the sidebar completely
- Hides the chapter nav pills
- Expands content to max-width: 700px centered
- Dims everything except the currently open card
- Shows a minimal floating "back to overview" button

This is for deep reading — when someone is working through a derivation and wants zero distractions.

---

## Implementation Priority

| Phase | Items | Effort |
|-------|-------|--------|
| **Phase 1** | Layout change (kill right TOC, collapsible sidebar) | Medium — CSS heavy, minimal JS |
| **Phase 2** | Card tabs (replace layer stacking) | Medium — engine.js renderCard rewrite |
| **Phase 3** | Sticky pill nav + IntersectionObserver | Small — new component |
| **Phase 4** | Card badges + study status dots | Small — data from localStorage |
| **Phase 5** | Mobile bottom nav + swipe | Medium — responsive + touch events |
| **Phase 6** | Reading mode | Small — toggle class on body |
| **Phase 7** | Visual polish (block hierarchy, animations) | Ongoing |

Phase 1+2 are the highest impact. They solve the two worst problems (cramped content + scroll hell) and should be done together since both touch card rendering.
