/**
 * engine.js — AI/ML 备考手册渲染引擎
 * 职责：
 *   1. 加载 chapters.json，构建侧边栏导航
 *   2. 按需加载 content/ch-xxx.json，渲染卡片
 *   3. 全局搜索（跨章节）
 *   4. 术语自动链接（依赖 knowledge_graph.json）
 *   5. KaTeX 数学公式渲染
 *   6. 三层渐进展开卡片
 *   7. interactive-formula 交互公式可视化
 *   8. memory Q&A 主动回忆自测
 */

(function () {
  'use strict';

  // ===== 状态 =====
  let chapters = [];          // chapters.json 中的章节列表
  let chapterCache = {};      // { chapterId: chapterData } 已加载章节数据缓存
  let knowledgeGraph = null;  // knowledge_graph.json 数据（懒加载）
  let currentChapterId = null;
  const CACHE_BUSTER = `v=${Date.now()}`;

  // ===== 初始化入口 =====
  async function init() {
    try {
      const res = await fetch(`chapters.json?${CACHE_BUSTER}`, { cache: 'no-store' });
      const data = await res.json();
      chapters = data.chapters || [];

      buildSidebar();

      // 优先按 URL 参数加载章节，否则默认加载第一个章节
      if (chapters.length > 0) {
        const params = new URLSearchParams(window.location.search);
        const requestedChapterId = params.get('ch');
        const initialChapterId = chapters.some(ch => ch.id === requestedChapterId)
          ? requestedChapterId
          : chapters[0].id;
        await showChapter(initialChapterId);
      }
    } catch (e) {
      console.error('[engine] 加载 chapters.json 失败:', e);
      document.querySelector('.main').innerHTML =
        '<div class="no-result"><div class="emoji">⚠️</div><p>加载失败，请确认 chapters.json 存在。</p></div>';
    }
  }

  // ===== 构建侧边栏 =====
  function buildSidebar() {
    const nav = document.getElementById('sidebarNav');
    if (!nav) return;

    // 按 navGroup 分组
    const groups = {};
    const groupOrder = [];
    for (const ch of chapters) {
      const g = ch.navGroup || '其他';
      if (!groups[g]) { groups[g] = []; groupOrder.push(g); }
      groups[g].push(ch);
    }

    let html = '';
    for (const g of groupOrder) {
      html += `<div class="nav-section-title">${escHtml(g)}</div>`;
      for (const ch of groups[g]) {
        const dotColor = ch.dotColor || '#6366f1';
        html += `<a class="nav-item" data-ch="${escHtml(ch.id)}" href="#" onclick="return false;">
  <span class="dot" style="background:${escHtml(dotColor)}"></span>
  ${escHtml(ch.title)}
  <span class="count" id="count-${escHtml(ch.id)}">—</span>
</a>`;
      }
    }
    nav.innerHTML = html;

    // 绑定点击事件
    nav.querySelectorAll('.nav-item[data-ch]').forEach(el => {
      el.addEventListener('click', () => showChapter(el.dataset.ch));
    });
  }

  // ===== 切换章节 =====
  window.showChapter = async function (chapterId) {
    if (currentChapterId === chapterId) return;

    // 隐藏搜索结果
    const searchResults = document.getElementById('searchResults');
    if (searchResults) searchResults.style.display = 'none';
    document.getElementById('searchInput').value = '';

    // 更新导航高亮
    document.querySelectorAll('.nav-item[data-ch]').forEach(el => {
      el.classList.toggle('active', el.dataset.ch === chapterId);
    });

    currentChapterId = chapterId;
    const params = new URLSearchParams(window.location.search);
    if (params.get('ch') !== chapterId) {
      params.set('ch', chapterId);
      const newSearch = params.toString();
      window.history.replaceState({}, '', `${window.location.pathname}?${newSearch}`);
    }

    // 渲染目标章节
    const mainEl = document.getElementById('chapterContainer');
    if (!mainEl) return;

    // 懒加载章节数据
    if (!chapterCache[chapterId]) {
      mainEl.innerHTML = '<div class="chapter-loading">加载中…</div>';
      const chMeta = chapters.find(c => c.id === chapterId);
      if (!chMeta) {
        mainEl.innerHTML = '<div class="no-result"><div class="emoji">🔍</div><p>章节不存在</p></div>';
        return;
      }
      try {
        const res = await fetch(`${chMeta.file}?${CACHE_BUSTER}`, { cache: 'no-store' });
        chapterCache[chapterId] = await res.json();
      } catch (e) {
        mainEl.innerHTML = `<div class="no-result"><div class="emoji">⚠️</div><p>加载 ${chMeta.file} 失败</p></div>`;
        console.error('[engine] 加载章节失败:', e);
        return;
      }
    }

    const chData = chapterCache[chapterId];

    // 更新 top-bar 标题
    const topBarTitle = document.getElementById('topBarTitle');
    if (topBarTitle) topBarTitle.textContent = chData.title || '';

    // 更新 count 徽章
    const countEl = document.getElementById('count-' + chapterId);
    if (countEl) {
      const total = (chData.cards || []).filter(c => !c.id?.startsWith('_')).length;
      countEl.textContent = total;
    }

    // 渲染章节内容
    mainEl.innerHTML = renderChapter(chData);

    buildChapterTOC(chData);

    // 渲染 KaTeX 数学公式
    renderKaTeX(mainEl);

    // 初始化 interactive-formula 画布
    mainEl.querySelectorAll('.interactive-formula').forEach(el => {
      drawIFVisualization(el.id);
    });
  };

  // ===== 构建右侧章节目录 =====
  function buildChapterTOC(chapterData) {
    const tocEl = document.getElementById('chapterToc');
    const tocPanel = document.getElementById('chapterTocPanel');
    if (!tocEl || !tocPanel) return;

    const cards = (chapterData?.cards || []).filter(card => card && card.id && !card.id.startsWith('_'));

    if (cards.length === 0) {
      tocEl.innerHTML = '<div class="toc-empty">本章暂无卡片目录</div>';
      tocPanel.classList.remove('has-items');
      return;
    }

    tocPanel.classList.add('has-items');
    tocEl.innerHTML = cards.map((card, index) => `
      <button class="toc-item${index === 0 ? ' active' : ''}" type="button" data-card-id="${escHtml(card.id)}" onclick="scrollToCard('${escHtml(card.id)}')">
        ${escHtml(card.title || card.id)}
      </button>
    `).join('');
  }

  window.scrollToCard = function (cardId) {
    const cardEl = document.getElementById('card-' + cardId);
    if (!cardEl) return;

    document.querySelectorAll('.toc-item').forEach(item => {
      item.classList.toggle('active', item.dataset.cardId === cardId);
    });

    cardEl.classList.add('open');
    cardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ===== KaTeX 渲染 =====
  function renderKaTeX(el) {
    if (window.renderMathInElement) {
      renderMathInElement(el, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false}
        ],
        throwOnError: false
      });
    }
  }

  // ===== 渲染章节 =====
  function renderChapter(ch) {
    const tagClass = ch.tag ? `tag-${ch.tag}` : '';
    const tagLabel = ch.tagLabel || '';

    let html = `<div class="chapter active">
  <div class="chapter-header">
    <div class="category-tag ${escHtml(tagClass)}">${escHtml(tagLabel)}</div>
    <h1>${escHtml(ch.title || '')}</h1>
    <p class="desc">${escHtml(ch.desc || '')}</p>
  </div>`;

    // taxonomy（可选章节分组）
    if (ch.taxonomy && Array.isArray(ch.taxonomy)) {
      for (const section of ch.taxonomy) {
        html += `<div class="section">
  <div class="section-title">${escHtml(section.title)}</div>`;
        const sectionCards = (ch.cards || []).filter(
          c => section.cardIds?.includes(c.id) && !c.id?.startsWith('_')
        );
        for (const card of sectionCards) {
          html += renderCard(card);
        }
        html += '</div>';
      }
    } else {
      // 无分组，直接渲染所有卡片
      html += '<div class="section">';
      for (const card of (ch.cards || [])) {
        if (card.id && card.id.startsWith('_')) continue; // 跳过 TODO 占位卡片
        html += renderCard(card);
      }
      html += '</div>';
    }

    html += '</div>';
    return html;
  }

  // ===== 渲染卡片（三层渐进展开）=====
  function renderCard(card) {
    if (!card || (card.id && card.id.startsWith('_'))) return '';

    const iconBg = card.iconBg || 'rgba(99,102,241,0.1)';
    const icon = card.icon || '📌';
    const cardId = card.id || '';

    // 按 layer 分组 blocks
    const l1Blocks = (card.blocks || []).filter(b => !b.layer || b.layer === 1);
    const l2Blocks = (card.blocks || []).filter(b => b.layer === 2);
    const l3Blocks = (card.blocks || []).filter(b => b.layer === 3);

    let html = `<div class="card" id="card-${escHtml(cardId)}">
  <div class="card-head" onclick="toggleCard(this)">
    <div class="icon" style="background:${escHtml(iconBg)}">${icon}</div>
    <div class="info">
      <div class="card-title">${escHtml(card.title || '')}</div>
      <div class="card-subtitle">${escHtml(card.subtitle || '')}</div>
    </div>
    <span class="arrow">▶</span>
  </div>
  <div class="card-body">
    <div class="card-body-l1">`;

    for (const block of l1Blocks) html += renderBlock(block);

    // 层级控制按钮
    if (l2Blocks.length > 0 || l3Blocks.length > 0) {
      html += `<div class="layer-controls">`;
      if (l2Blocks.length > 0) {
        html += `<button class="layer-btn" onclick="toggleLayer(this, 'l2', '${escHtml(cardId)}')">展开推导</button>`;
      }
      if (l3Blocks.length > 0) {
        html += `<button class="layer-btn" onclick="toggleLayer(this, 'l3', '${escHtml(cardId)}')">面试视角</button>`;
      }
      html += `</div>`;
    }

    html += `</div>`; // card-body-l1

    if (l2Blocks.length > 0) {
      html += `<div class="layer-2-content" id="l2-${escHtml(cardId)}">`;
      for (const block of l2Blocks) html += renderBlock(block);
      html += `</div>`;
    }

    if (l3Blocks.length > 0) {
      html += `<div class="layer-3-content" id="l3-${escHtml(cardId)}">`;
      for (const block of l3Blocks) html += renderBlock(block);
      html += `</div>`;
    }

    html += '</div></div>'; // card-body + card
    return html;
  }

  // ===== 渲染 Block =====
  function renderBlock(block) {
    if (!block || !block.type) return '';

    switch (block.type) {

      case 'kitem': {
        const labelType = block.labelType || 'core';
        const badge = block.badge || '';
        const labelTitle = block.labelTitle || '';
        const text = block.text || '';
        return `<div class="kitem">
  <div class="kitem-label ${escHtml(labelType)}"><span class="badge">${escHtml(badge)}</span> ${escHtml(labelTitle)}</div>
  <p>${applyTermLinks(escHtml(text))}</p>
</div>`;
      }

      case 'kitem-list': {
        const labelType = block.labelType || 'core';
        const badge = block.badge || '';
        const labelTitle = block.labelTitle || '';
        const items = block.items || [];
        let liHtml = items.map(item => `<li>${applyTermLinks(escHtml(item))}</li>`).join('\n');
        return `<div class="kitem">
  <div class="kitem-label ${escHtml(labelType)}"><span class="badge">${escHtml(badge)}</span> ${escHtml(labelTitle)}</div>
  <ul>${liHtml}</ul>
</div>`;
      }

      case 'formula': {
        const content = block.content || '';
        // 检测是否含有 LaTeX 标记
        const isLatex = /\$\$[\s\S]+?\$\$|\$[^$\n]+\$/.test(content);
        if (isLatex) {
          return `<div class="formula-block-math">${content}</div>`;
        } else {
          return `<div class="formula-block">${escHtml(content)}</div>`;
        }
      }

      case 'interactive-formula': {
        const formula = block.formula || '';
        const params = block.params || [];
        const vizType = block.visualization || '';
        const uid = 'if-' + Math.random().toString(36).slice(2, 8);

        let paramHtml = '';
        for (const p of params) {
          paramHtml += `<div class="if-param-row">
      <label>${escHtml(p.name)} <small>${escHtml(p.desc || '')}</small></label>
      <input type="range" min="${p.min}" max="${p.max}" step="${p.step}" value="${p.default}"
        oninput="updateIF('${uid}', '${escHtml(p.name)}', this.value)">
      <span class="if-val" id="${uid}-val-${escHtml(p.name)}">${p.default}</span>
    </div>`;
        }

        return `<div class="interactive-formula" id="${uid}" data-viz="${escHtml(vizType)}">
    <div class="if-formula">$$${formula}$$</div>
    <div class="if-params">${paramHtml}</div>
    <div class="if-canvas-wrap">
      <canvas id="${uid}-canvas" width="780" height="150"></canvas>
    </div>
  </div>`;
      }

      case 'trap': {
        const title = block.title || '⚠️ 易错点';
        const content = block.content || '';
        return `<div class="trap-block">
  <div class="trap-title">${escHtml(title)}</div>
  <p>${applyTermLinks(escHtml(content))}</p>
</div>`;
      }

      case 'memory': {
        const title = block.title || '💡 记忆口诀';
        const content = block.content || '';
        
        // 检测是否是 Q&A 格式
        const isQA = content.includes('面试官问') || content.includes('面试官问：') || content.includes('面试官问:');
        
        if (isQA) {
          // Q&A 格式：解析所有 Q&A 对
          const pairs = parseQAPairs(content);
          const qaId = 'qa-' + Math.random().toString(36).slice(2, 8);
          
          let qaHtml = '';
          pairs.forEach((pair, idx) => {
            const pairId = qaId + '-' + idx;
            qaHtml += `<div class="qa-pair">
        <div class="qa-question">❓ ${escHtml(pair.q)}</div>
        <button class="qa-show-btn" onclick="showQAAnswer('${pairId}')">显示答案</button>
        <div class="qa-answer" id="${pairId}-ans">${applyTermLinks(escHtml(pair.a))}</div>
        <div class="recall-btns" id="${pairId}-btns">
          <button class="recall-btn knew" onclick="recordRecall('${pairId}','knew')">✅ 记住了</button>
          <button class="recall-btn fuzzy" onclick="recordRecall('${pairId}','fuzzy')">🌫️ 模糊</button>
          <button class="recall-btn forgot" onclick="recordRecall('${pairId}','forgot')">❌ 没记住</button>
        </div>
      </div>`;
          });
          
          return `<div class="memory-block memory-qa">
      <div class="memory-title">${escHtml(title)}</div>
      ${qaHtml}
    </div>`;
        }
        
        // 非 Q&A 格式：普通显示
        return `<div class="memory-block">
    <div class="memory-title">${escHtml(title)}</div>
    <p>${applyTermLinks(escHtml(content))}</p>
  </div>`;
      }

      case 'code': {
        const title = block.title || '代码示例';
        const content = block.content || '';
        // 对代码中的注释行做颜色处理
        const highlighted = escHtml(content).replace(
          /(#[^\n]*)/g,
          '<span class="cm">$1</span>'
        );
        return `<div class="code-block">
  <div class="code-title">${escHtml(title)}</div>
  <pre>${highlighted}</pre>
</div>`;
      }

      case 'table': {
        const headers = block.headers || [];
        const rows = block.rows || [];
        let thHtml = headers.map(h => `<th>${escHtml(h)}</th>`).join('');
        let bodyHtml = rows.map(row =>
          '<tr>' + row.map(cell => `<td>${applyTermLinks(escHtml(cell))}</td>`).join('') + '</tr>'
        ).join('\n');
        return `<table class="compare-table">
  <tr>${thHtml}</tr>
  ${bodyHtml}
</table>`;
      }

      case 'divider': {
        return '<div class="kdivider"></div>';
      }

      case 'text': {
        const content = block.content || '';
        return `<p class="text-block">${applyTermLinks(escHtml(content))}</p>`;
      }

      default:
        return '';
    }
  }

  // ===== 解析 Q&A 对 =====
  function parseQAPairs(content) {
    const pairs = [];
    // 按 "面试官问" 分割
    const parts = content.split(/(?=面试官问[:：])/);
    for (const part of parts) {
      const m = part.match(/面试官问[:：](.+?)(?:\n\n)(答[:：]?([\s\S]*))?/s);
      if (m) {
        pairs.push({
          q: m[1].trim(),
          a: (m[3] || m[2] || '').trim()
        });
      }
    }
    if (pairs.length === 0 && content.trim()) {
      pairs.push({ q: content.trim(), a: '' });
    }
    return pairs;
  }

  // ===== 层级展开切换 =====
  window.toggleLayer = function(btn, layer, cardId) {
    const contentEl = document.getElementById(layer + '-' + cardId);
    if (!contentEl) return;
    const isVisible = contentEl.classList.contains('visible');
    contentEl.classList.toggle('visible', !isVisible);
    btn.classList.toggle('active', !isVisible);
    
    // 如果是展开，重新渲染 KaTeX
    if (!isVisible && window.renderMathInElement) {
      renderMathInElement(contentEl, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false}
        ],
        throwOnError: false
      });
    }
  };

  // ===== Q&A 答案显示 =====
  window.showQAAnswer = function(pairId) {
    const ans = document.getElementById(pairId + '-ans');
    const btns = document.getElementById(pairId + '-btns');
    const btn = document.querySelector(`button[onclick="showQAAnswer('${pairId}')"]`);
    if (ans) ans.classList.add('visible');
    if (btns) btns.classList.add('visible');
    if (btn) btn.style.display = 'none';
    // KaTeX 重新渲染新显示的内容
    if (window.renderMathInElement && ans) {
      renderMathInElement(ans, {
        delimiters: [
          {left: '$$', right: '$$', display: true},
          {left: '$', right: '$', display: false}
        ],
        throwOnError: false
      });
    }
  };

  // ===== 记录回忆状态 =====
  window.recordRecall = function(pairId, level) {
    // P0: 简单 localStorage 存储，P2 会扩展为间隔重复算法
    const key = 'recall-' + pairId;
    localStorage.setItem(key, JSON.stringify({ level, time: Date.now() }));
    const btnsEl = document.getElementById(pairId + '-btns');
    if (btnsEl) {
      const labels = { knew: '✅ 已记录：记住了', fuzzy: '🌫️ 已记录：模糊', forgot: '❌ 已记录：没记住' };
      btnsEl.innerHTML = `<span class="recall-status">${labels[level] || '已记录'}</span>`;
    }
  };

  // ===== Interactive Formula 滑块更新 =====
  window.updateIF = function(uid, paramName, value) {
    const valEl = document.getElementById(uid + '-val-' + paramName);
    if (valEl) valEl.textContent = parseFloat(value);
    drawIFVisualization(uid);
  };

  // ===== Interactive Formula 可视化绘制 =====
  function drawIFVisualization(uid) {
    const container = document.getElementById(uid);
    if (!container) return;
    const canvas = document.getElementById(uid + '-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    
    // 读取 vizType
    const vizType = container.dataset.viz || '';
    
    // 读取所有滑块的当前值
    const paramValues = {};
    container.querySelectorAll('.if-param-row').forEach(row => {
      const inp = row.querySelector('input[type=range]');
      const label = row.querySelector('label');
      if (inp && label) {
        // 从 label 文本取参数名（第一个词 before the small tag）
        const labelText = label.textContent || '';
        const nameMatch = labelText.split(/\s+/)[0];
        if (nameMatch) {
          paramValues[nameMatch] = parseFloat(inp.value);
        }
      }
    });
    
    ctx.clearRect(0, 0, W, H);
    
    const pad = { top: 20, right: 20, bottom: 30, left: 50 };
    const plotW = W - pad.left - pad.right;
    const plotH = H - pad.top - pad.bottom;
    
    function toScreenX(val, minV, maxV) { return pad.left + (val - minV) / (maxV - minV) * plotW; }
    function toScreenY(val, minV, maxV) { return pad.top + plotH - (val - minV) / (maxV - minV) * plotH; }
    
    function drawAxes(xMin, xMax, yMin, yMax, xLabel, yLabel) {
      ctx.strokeStyle = '#d4cfc8';
      ctx.lineWidth = 1;
      // x axis
      ctx.beginPath();
      ctx.moveTo(pad.left, pad.top + plotH);
      ctx.lineTo(pad.left + plotW, pad.top + plotH);
      ctx.stroke();
      // y axis
      ctx.beginPath();
      ctx.moveTo(pad.left, pad.top);
      ctx.lineTo(pad.left, pad.top + plotH);
      ctx.stroke();
      // labels
      ctx.fillStyle = '#8a8a9a';
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText(xLabel, pad.left + plotW / 2, H - 4);
      ctx.save();
      ctx.translate(12, pad.top + plotH / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(yLabel, 0, 0);
      ctx.restore();
      // tick labels
      ctx.textAlign = 'center';
      [xMin, Math.round((xMin+xMax)/2), xMax].forEach(v => {
        const sx = toScreenX(v, xMin, xMax);
        ctx.fillText(String(v), sx, pad.top + plotH + 14);
      });
      ctx.textAlign = 'right';
      [yMin, Math.round((yMin+yMax)/2), yMax].forEach(v => {
        const sy = toScreenY(v, yMin, yMax);
        ctx.fillText(v % 1 === 0 ? String(v) : v.toFixed(1), pad.left - 4, sy + 4);
      });
    }
    
    if (vizType === 'variance-curve') {
      const d = paramValues['d'] || paramValues['维度'] || 64;
      const xMin = 8, xMax = 512;
      const yMax = Math.max(200, d * 1.2);
      const yMin = 0;
      drawAxes(xMin, xMax, yMin, yMax, 'd（维度）', '方差');
      
      // 红线：不缩放，Var = d
      ctx.beginPath();
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      for (let xi = 0; xi <= plotW; xi++) {
        const dVal = xMin + (xi / plotW) * (xMax - xMin);
        const varVal = dVal; // Var(QK) = d
        const sx = pad.left + xi;
        const sy = toScreenY(Math.min(varVal, yMax), yMin, yMax);
        if (xi === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
      
      // 绿线：除以√d，Var = 1
      ctx.beginPath();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.moveTo(pad.left, toScreenY(1, yMin, yMax));
      ctx.lineTo(pad.left + plotW, toScreenY(1, yMin, yMax));
      ctx.stroke();
      
      // 标记当前 d
      const curX = toScreenX(d, xMin, xMax);
      const curYRed = toScreenY(Math.min(d, yMax), yMin, yMax);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(curX, curYRed, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(curX, toScreenY(1, yMin, yMax), 5, 0, Math.PI * 2);
      ctx.fill();
      
      // 图例
      ctx.font = '11px sans-serif';
      ctx.fillStyle = '#ef4444';
      ctx.textAlign = 'left';
      ctx.fillText('不缩放: Var = d', pad.left + 8, pad.top + 16);
      ctx.fillStyle = '#10b981';
      ctx.fillText('除以√d: Var = 1', pad.left + 8, pad.top + 30);
      
    } else if (vizType === 'clip-curve') {
      const eps = paramValues['ε'] || paramValues['eps'] || 0.2;
      const xMin = 0.5, xMax = 1.5;
      const yMin = 0, yMax = 1.5;
      drawAxes(xMin, xMax, yMin, yMax, 'ratio r = π(a)/π_old(a)', 'clip 目标');
      
      // 画 min(r*A, clip(r, 1-ε, 1+ε)*A) where A=1
      ctx.beginPath();
      ctx.strokeStyle = '#6366f1';
      ctx.lineWidth = 2.5;
      for (let xi = 0; xi <= plotW; xi++) {
        const r = xMin + (xi / plotW) * (xMax - xMin);
        const clipped = Math.max(1 - eps, Math.min(1 + eps, r));
        const obj = Math.min(r, clipped); // A=1
        const sx = pad.left + xi;
        const sy = toScreenY(Math.min(obj, yMax), yMin, yMax);
        if (xi === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
      
      // 画 r*A (虚线)
      ctx.beginPath();
      ctx.strokeStyle = '#8a8a9a';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.moveTo(pad.left, toScreenY(xMin, yMin, yMax));
      ctx.lineTo(pad.left + plotW, toScreenY(xMax, yMin, yMax));
      ctx.stroke();
      ctx.setLineDash([]);
      
      // 标出 ε 边界线
      const xLeft = toScreenX(1 - eps, xMin, xMax);
      const xRight = toScreenX(1 + eps, xMin, xMax);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(xLeft, pad.top); ctx.lineTo(xLeft, pad.top + plotH); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(xRight, pad.top); ctx.lineTo(xRight, pad.top + plotH); ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.font = '10px sans-serif';
      ctx.fillStyle = '#f59e0b';
      ctx.textAlign = 'center';
      ctx.fillText('1-ε', xLeft, pad.top + 12);
      ctx.fillText('1+ε', xRight, pad.top + 12);
      ctx.fillStyle = '#6366f1';
      ctx.textAlign = 'left';
      ctx.fillText('clip 目标', pad.left + 8, pad.top + 18);
    } else {
      // 无可视化类型：显示提示
      ctx.fillStyle = '#8a8a9a';
      ctx.font = '13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('可视化: ' + vizType || '(待实现)', W / 2, H / 2);
    }
  }

  // ===== 卡片展开/收起 =====
  window.toggleCard = function (headEl) {
    const card = headEl.closest('.card');
    if (card) card.classList.toggle('open');
  };

  // ===== 全局搜索 =====
  window.doSearch = async function (query) {
    const searchResults = document.getElementById('searchResults');
    const searchContent = document.getElementById('searchContent');
    const chapterContainer = document.getElementById('chapterContainer');

    query = (query || '').trim();

    if (!query) {
      searchResults.style.display = 'none';
      chapterContainer.style.display = '';
      return;
    }

    chapterContainer.style.display = 'none';
    searchResults.style.display = 'block';

    // 预加载所有章节
    await preloadAllChapters();

    const q = query.toLowerCase();
    const hits = [];

    for (const chMeta of chapters) {
      const chData = chapterCache[chMeta.id];
      if (!chData) continue;
      for (const card of (chData.cards || [])) {
        if (card.id?.startsWith('_')) continue;
        const titleMatch = (card.title || '').toLowerCase().includes(q);
        const subtitleMatch = (card.subtitle || '').toLowerCase().includes(q);
        const bodyText = extractCardText(card);
        const bodyMatch = bodyText.toLowerCase().includes(q);
        if (titleMatch || subtitleMatch || bodyMatch) {
          hits.push({ chMeta, chData, card, bodyText });
        }
      }
    }

    if (hits.length === 0) {
      searchContent.innerHTML = `<div class="no-result"><div class="emoji">🔍</div><p>没有找到"${escHtml(query)}"相关内容</p></div>`;
      return;
    }

    let html = `<div style="font-size:12px;color:var(--text3);margin-bottom:16px;">找到 ${hits.length} 个结果</div>`;
    for (const hit of hits) {
      const preview = getPreview(hit.bodyText, q, 120);
      html += `<div class="search-hit" onclick="goToCard('${escHtml(hit.chMeta.id)}','${escHtml(hit.card.id)}')">
  <div class="hit-chapter">${escHtml(hit.chMeta.title)}</div>
  <div class="hit-title">${highlightText(escHtml(hit.card.title || ''), query)}</div>
  <div class="hit-preview">${highlightText(escHtml(preview), query)}</div>
</div>`;
    }
    searchContent.innerHTML = html;
  };

  // 跳转到具体卡片
  window.goToCard = async function (chapterId, cardId) {
    document.getElementById('searchInput').value = '';
    await showChapter(chapterId);
    window.scrollToCard(cardId);
  };

  // ===== 术语链接 =====
  function applyTermLinks(html) {
    if (!knowledgeGraph || !knowledgeGraph.nodes) return html;
    // 按术语长度降序，避免短词覆盖长词
    const nodes = [...knowledgeGraph.nodes].sort(
      (a, b) => (b.title || '').length - (a.title || '').length
    );
    for (const node of nodes) {
      if (!node.title || !node.chapterId || !node.cardId) continue;
      const escaped = escRegex(node.title);
      const re = new RegExp(escaped, 'g');
      html = html.replace(re, match =>
        `<a class="term-link" onclick="goToCard('${node.chapterId}','${node.cardId}')">${match}</a>`
      );
    }
    return html;
  }

  // ===== 工具函数 =====

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function extractCardText(card) {
    const parts = [];
    for (const block of (card.blocks || [])) {
      if (block.text) parts.push(block.text);
      if (block.content) parts.push(block.content);
      if (block.formula) parts.push(block.formula);
      if (block.items) parts.push(...block.items);
      if (block.rows) {
        for (const row of block.rows) parts.push(...row);
      }
    }
    return parts.join(' ');
  }

  function getPreview(text, query, maxLen) {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx < 0) return text.slice(0, maxLen) + (text.length > maxLen ? '…' : '');
    const start = Math.max(0, idx - 40);
    const end = Math.min(text.length, idx + query.length + 80);
    return (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
  }

  function highlightText(html, query) {
    const escaped = escRegex(escHtml(query));
    return html.replace(new RegExp(escaped, 'gi'), m => `<span class="highlight">${m}</span>`);
  }

  async function preloadAllChapters() {
    const tasks = chapters
      .filter(ch => !chapterCache[ch.id])
      .map(async ch => {
        try {
          const res = await fetch(`${ch.file}?${CACHE_BUSTER}`, { cache: 'no-store' });
          chapterCache[ch.id] = await res.json();
        } catch (e) {
          console.warn('[engine] 预加载失败:', ch.id, e);
        }
      });
    await Promise.all(tasks);
  }

  // ===== 启动 =====
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
