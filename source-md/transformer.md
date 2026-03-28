# Transformer 完全解析：从数学原理到工业实现

> **2026 年 AI 面试必备文档**  
> 涵盖：Self-Attention 机制、Encoder-Decoder 架构、工业优化技术（MQA/GQA/RoPE/MoE）、主流模型（BERT/GPT/T5/ViT）  
> 配套完整代码实现：`transformer_implementation.py`

---

## 🚀 24-Hour Speed Run Guide (2026 Edition)

> **⏱️ 目标**：在 24 小时内（或 1 个高强度工作日）掌握 Transformer 核心原理、代码实现及 2026 最新面试考点。

### 📅 学习时间表

| 时间段 | 模块 | 重点章节 | 目标 |
| :--- | :--- | :--- | :--- |
| **09:00 - 11:00** | **核心原理** | Ch 1-5 | 理解 Self-Attention, Q/K/V, Softmax, Multi-Head。**必做 Math Walkthroughs**。 |
| **11:00 - 13:00** | **架构组件** | Ch 6-12 | 搞懂 Encoder/Decoder 区别, LayerNorm, Residual。**跑通 `transformer_implementation.py`**。 |
| **14:00 - 16:00** | **工业优化** | Ch 13-15 | **重点：MQA/GQA (Llama), RoPE, MoE (Mixtral)**。这是大厂面试必问。 |
| **16:00 - 18:00** | **前沿技术 (2026)** | Ch 20-21 (New) | **DeepSeek-R1 (Reasoning), Infra (3D Parallelism), Agents**。求职加分项。 |
| **19:00 - 21:00** | **面试突击** | Ch 19 | 刷高频题，尝试用自己的话复述 "Why Pre-Norm?", "Why RoPE?"。 |

### ⚡ 极速通关 Cheatsheet

1.  **Self-Attention**: $Attention(Q, K, V) = softmax(\frac{QK^T}{\sqrt{d_k}})V$
    *   *口诀*：Q找K算相似度，归一化后乘V。
2.  **Transformer**: Encoder (理解) + Decoder (生成)。
    *   *BERT*: Encoder only, MLM.
    *   *GPT*: Decoder only, Causal LM.
3.  **RoPE**: 通过旋转向量编码相对位置，外推性好 (Llama 标配)。
4.  **GQA**: 分组共享 KV，推理显存省 8 倍 (Llama 2/3)。
5.  **MoE**: 稀疏激活，参数量大但计算量小 (Mixtral/DeepSeek)。
6.  **DeepSeek-R1**: 通过 RL (GRPO) 激发推理能力 (CoT)，无需大规模 SFT。

---

## 📚 目录 (Table of Contents)

### 🎯 核心章节（面试必考）
- [0. 前置数学：矩阵乘法与点积的几何本质](#0-前置数学矩阵乘法与点积的几何本质面试不慌指南)
- [1. 定义与符号系统](#1-定义与符号系统把变量钉死)
- [2. 前向传播：程序是怎么跑的？](#2-前向传播程序是怎么跑的operation)
- [3. 反向传播：分工是怎么被"逼"出来的？](#3-反向传播分工是怎么被逼出来的gradient-flow)
- [4. Multi-Head Attention：从单头到多头的进化](#4-multi-head-attention从单头到多头的进化)
- [5. 终极总结：四条可背诵的因果链](#5-终极总结四条可背诵的因果链)

### 🏗️ 架构组件（构建完整 Transformer）
- [6. 位置编码 (Positional Encoding)](#6-位置编码-positional-encoding给词向量注入位置灵魂)
- [7. 前馈网络 (Feed-Forward Network, FFN)](#7-前馈网络-feed-forward-network-ffn每个-token-的独立思考空间)
- [8. 层归一化 (Layer Normalization)](#8-层归一化-layer-normalization训练稳定的守护神)
- [9. 残差连接 (Residual Connection)](#9-残差连接-residual-connection梯度的高速公路)
- [10. 完整 Encoder 架构](#10-完整-encoder-架构从零件到整机)
- [11. 完整 Decoder 架构](#11-完整-decoder-架构生成式模型的核心)
- [12. Cross-Attention 深度解析](#12-cross-attention-深度解析encoder-decoder-的桥梁)

### ⚡ 工业优化技术（2026 必考，默认候选人会）
- [13. MQA/GQA：高效推理的关键技术](#13-mqagqa高效推理的关键技术llama-2-核心)
- [14. RoPE 位置编码：旋转式相对位置](#14-rope-位置编码旋转式相对位置llama-核心)
- [15. MoE 架构 - Mixture of Experts](#第-15-章-moe-架构---mixture-of-experts稀疏激活的艺术)

### 🤖 主流模型分析（工业实践）
- [16. BERT - Bidirectional Encoder](#第-16-章-bert---bidirectional-encoder-representations-from-transformers)
- [17. GPT - Generative Pre-trained Transformer](#第-17-章-gpt---generative-pre-trained-transformer自回归生成的力量)
- [18. Transformer 变体：T5、ViT、Sparse Attention](#第-18-章-transformer-变体t5vitsparse-attention)

### 📝 面试准备
- [19. 面试题总结 - 按主题分类](#第-19-章-面试题总结---按主题分类)

---

## 📊 文档统计

| 项目 | 数值 |
|------|------|
| 总行数 | ~8,400 行 |
| 中文字符数 | ~120,000 字 |
| 章节数 | 20 章（含第 0 章） |
| 代码示例 | 50+ 个 |
| 面试题 | 60+ 道（含详细解答） |
| 对比表格 | 20+ 个 |
| 配套实现 | `transformer_implementation.py` (860 行，可运行) |

---

## 🎓 如何使用本文档

### 📖 学习路径

**初学者（0 基础）**
1. 第 0 章：数学基础（矩阵乘法、点积几何意义）
2. 第 1-5 章：Self-Attention 核心机制（定义、前向、反向、多头）
3. 第 6-9 章：架构组件（位置编码、FFN、LayerNorm、残差）
4. 第 10-12 章：完整架构（Encoder、Decoder、Cross-Attention）

**进阶学习（有基础）**
1. 第 13-15 章：工业优化（MQA/GQA、RoPE、MoE）
2. 第 16-18 章：主流模型（BERT、GPT、T5、ViT）
3. 第 19 章：面试题总结

**面试突击（1 周冲刺）**
1. **必背**：第 5 章（四条因果链）+ 第 19 章（面试题总结）
2. **快速查找**：Ctrl+F 搜索 "📊 面试考点"（全文 60+ 处）
3. **重点章节**：第 13 章（MQA/GQA）、第 14 章（RoPE）、第 17 章（GPT/RLHF）

### 💻 代码实践

**运行配套实现**
```bash
# 安装依赖
pip install torch numpy

# 运行示例
python3 transformer_implementation.py

# 输出包括：
# - Translation Task (Encoder-Decoder)
# - Language Modeling (Decoder-only GPT-style)
# - 参数量统计
```

**代码组织结构**
- ✅ `ScaledDotProductAttention`: Self-Attention 核心
- ✅ `MultiHeadAttention`: 多头注意力
- ✅ `PositionwiseFeedForward`: FFN 层
- ✅ `PositionalEncoding`: 位置编码（Sinusoidal）
- ✅ `EncoderLayer` / `DecoderLayer`: 单层架构
- ✅ `Transformer`: 完整 Encoder-Decoder
- ✅ `BERTModel` / `GPTModel`: 主流模型变体

### 🔍 快速查找技巧

| 需求 | 搜索关键词 |
|------|-----------|
| 面试高频题 | "📊 面试考点" |
| 数学公式推导 | "梯度计算"、"链式法则" |
| 代码实现 | "```python"、"# 使用示例" |
| 工业配置 | "Llama 2"、"GPT-3"、"BERT-Base" |
| 对比分析 | "\| 对比项 \|"（表格） |

---

## ⚠️ 文档质量标准（四大原则）

本文档严格遵循以下学术标准，确保面试时不被问倒：

### 1️⃣ 符号定义优先 (Symbol Definition First)
- ✅ 每个符号都有：**变量名 + 物理含义 + 形状 + 索引含义**
- ❌ 禁止出现"未定义就使用"的变量

### 2️⃣ 程序执行视角 (Program Execution Perspective)
- ✅ 逐行计算流程 + 伪代码 + 具体数值示例
- ❌ 禁止"跳步骤"的抽象描述

### 3️⃣ 完整梯度路径 (Complete Gradient Paths)
- ✅ 梯度从哪里来？经过哪些变量？链式法则如何应用？
- ❌ 禁止"梯度会传播"这种模糊说法

### 4️⃣ 因果解释 (Causal Explanations)
- ✅ 为什么损失函数会"逼迫"这个结构？
- ❌ 禁止"因为它叫 X 所以就做 X"的循环定义

---

## 📌 版本信息

- **创建日期**：2026 年 1 月
- **最后更新**：2026 年 1 月 30 日
- **适用面试**：算法工程师、NLP 工程师、AI 研究员
- **技术栈**：PyTorch、Transformers、Hugging Face

---

## 0. 前置数学：矩阵乘法与点积的几何本质（面试不慌指南）

> **💡 小白通俗理解：Transformer 的"相亲大会"**
>
> 在深入数学之前，先建立一个直观模型。想象 **Transformer** 是一个大型**相亲大会**：
> *   **Embedding**：每个人进场时胸口贴的"基本信息表"（身高、学历、收入）。
> *   **Attention (注意力)**：大家互相打量的过程。
>     *   **Q (Query)**：你的**择偶标准**（"我要找个爱旅游的"）。
>     *   **K (Key)**：别人的**特征标签**（"我是旅游博主"）。
>     *   **V (Value)**：别人的**实际内涵**（如果匹配上了，你就会把他的内涵吸收到你的脑海里）。
> *   **点积 (Dot Product)**：计算**匹配度**。你的标准 (Q) 和他的标签 (K) 越吻合，点积越大，你就越关注他。
> *   **Multi-Head**：你很贪心，同时在看好几个维度（一个头看颜值，一个头看才华，一个头看人品）。

<details>
<summary>🧮 <strong>Math Walkthrough: 点积计算详解</strong> (点击展开)</summary>
<blockquote>
  <p><strong>公式：</strong>
   $\mathbf{a} \cdot \mathbf{b} = \sum_{i=1}^n a_i b_i$</p>
  <p><strong>场景：</strong><br>
  你的择偶标准 Q = [喜欢旅游=0.8, 喜欢宅=0.1]<br>
  对象A的标签 K_A = [旅游博主=0.9, 宅男=0.1]<br>
  对象B的标签 K_B = [不爱动=0.1, 游戏王=0.9]</p>
  <p><strong>计算过程：</strong><br>
  1. <strong>Q · K_A</strong> = (0.8 * 0.9) + (0.1 * 0.1) = 0.72 + 0.01 = <strong>0.73</strong> (高匹配)<br>
  2. <strong>Q · K_B</strong> = (0.8 * 0.1) + (0.1 * 0.9) = 0.08 + 0.09 = <strong>0.17</strong> (低匹配)</p>
  <p><strong>结论：</strong> 点积把两个向量对应位置相乘再求和，结果越大，代表两个向量越"相似"（方向越一致）。</p>
</blockquote>
</details>

<details>
<summary>🎮 <strong>互动思考：为什么 Q 和 K 必须维度相同？</strong> (点击展开)</summary>
<blockquote>
  <p><strong>答案：</strong> 就像"对暗号"一样。如果你的择偶标准有 3 条（身高、学历、收入），而对方的标签只有 2 条（身高、学历），那最后一条"收入"就没法匹配了。只有维度对应（对齐），才能计算每一项的契合度（点积）。</p>
</blockquote>
</details>


很多时候面试“挂”不是挂在 Transformer 的流程上，而是挂在被问到“为什么 $Q$ 和 $K$ 要相乘？”时，无法从数学几何角度解释。这章就是你的**救命稻草**。

### 0.1 矩阵乘法的维度规则（小白必看）

矩阵乘法不是对应位置相乘，而是**行与列的“拥抱”**。

_(图解：左边矩阵的**行向量**与右边矩阵的**列向量**进行点积运算，生成结果矩阵的一个元素)_

- **规则口诀**：**“中间对齐，取两头”**。
    
    - 只有当第一个矩阵的**列数**等于第二个矩阵的**行数**时，才能相乘。
        
    - 结果矩阵的形状 = (第一个矩阵的行数, 第二个矩阵的列数)。
        
- **公式表示**：
    
    $$[M \times \mathbf{N}] \cdot [\mathbf{N} \times P] = [M \times P]$$
    
    _(中间的_ $N$ _必须相同，最后“消掉”了)_
    
- **Attention 中的应用**：
    
    - $Q$ 的形状是 $[n \times d]$（$n$ 个词，每个词 $d$ 维）。
        
    - $K^T$（$K$ 的转置）形状是 $[d \times n]$。
        
    - $Q \cdot K^T$ 运算：
        
        $$[n \times \mathbf{d}] \cdot [\mathbf{d} \times n] = [n \times n]$$
    - **物理意义**：结果是一个 $[n \times n]$ 的矩阵，代表**句子中** $n$ **个词两两之间的关系**。
        

### 0.2 点积（Dot Product）的几何意义

Attention 的核心计算是 $Q \cdot K^T$。为什么选点积？因为它就是**计算相似度的天然工具**。

#### 角度一：投影（Projection）——“你中有我”

_(图解：向量 B 在向量 A 方向上的投影长度，展示“你中有我”的程度)_

点积 $A \cdot B$ 的几何公式是：

$$A \cdot B = |A| \times \underbrace{(|B| \cos \theta)}_{\text{B 在 A 上的投影长度}}$$

- **直观理解**：想象一束光垂直打在向量 $A$ 上，向量 $B$ 在 $A$ 身上投下的影子的长度。
    
- **面试话术**：“点积本质上是在计算**投影**。如果 $Q$ 和 $K$ 的点积很大，说明 $K$ 在 $Q$ 的方向上投影很长，也就是它们共享很多共同特征（Feature），方向一致。”
    

#### 角度二：余弦相似度（Cosine Similarity）——“方向对齐”

公式变形为：

$$\cos \theta = \frac{A \cdot B}{|A| |B|}$$

- **方向相同 (**$\theta = 0^\circ$**)**：$\cos \theta = 1$，点积最大 $\rightarrow$ **非常关注**。
    
- **垂直无关 (**$\theta = 90^\circ$**)**：$\cos \theta = 0$，点积为 0 $\rightarrow$ **完全不关注**。
    
- **方向相反 (**$\theta = 180^\circ$**)**：$\cos \theta = -1$，点积为负 $\rightarrow$ **负相关（Softmax 后接近 0）**。
    

> **💡 举个栗子**：
> 
> - 向量 **“猫”** 和向量 **“鱼”**：语义相近，向量空间中夹角很小，点积很大 $\rightarrow$ Attention Score 高。
>     
> - 向量 **“猫”** 和向量 **“相对论”**：语义无关，向量几乎垂直，点积接近 0 $\rightarrow$ Attention Score 低。
>     

### 0.3 为什么 Attention 要用矩阵乘法？

既然点积就能算相似度，为什么要搞复杂的矩阵乘法？

- **答案**：**为了效率（Batch Processing）**。
    
- 矩阵乘法本质上是**无数个点积的并行计算**。
    
    - $Q$ 的第 1 行（第一个词）和 $K^T$ 的所有列（所有词）同时做点积。
        
    - $Q$ 的第 2 行（第二个词）和 $K^T$ 的所有列（所有词）同时做点积。
        
- **结论**：一次矩阵乘法 $QK^T$，就一次性算出了句子中**所有词对所有词**的相似度。这就是 GPU 并行加速的基础。
    

## 1. 定义与符号系统（把变量“钉死”）

我们讨论 Transformer 中 Decoder Self-Attention 的一个 Head（多头注意力是将模型维度分割成多个子空间并行计算，而非简单的复制）。在此先固定符号、形状与索引含义，**先确立符号，后续推导才不会乱**。

### 基础设定

- $n$：序列长度（Sequence Length）。
    
- $d$：单个 Head 的维度（Dimension，也常写为 $d_k$）。
    
- $X \in \mathbb{R}^{n \times d}$：输入矩阵（上一层的输出）。
    
    - $X_i$（第 $i$ 行）：第 $i$ 个 Token 的输入向量。
        
    - **关键补充**：这里的 $X$ **必须包含位置编码（Positional Encoding）**（即 $X = \text{Embedding} + \text{PositionalEncoding}$）。因为 Self-Attention 机制本身是“位置不敏感”的（把句子打乱，点积结果不变）。没有位置编码，模型无法区分“猫吃鱼”和“鱼吃猫”。 **面试常问：为什么是相加而不是拼接？**
        

> 相加保留了向量的维度 $d$，不会增加后续计算量。从几何上看，这相当于在高维空间中给词向量施加了一个“位置偏移”，让模型能够通过向量的数值分布感知到位置信息。
> 
> **💡 进阶数学解释（正交性）**：在高维空间（如 512 维）中，随机采样的两个向量几乎总是**正交**（垂直）的。这意味着“词义信息”和“位置信息”虽然相加了，但在几何空间中大概率位于不同的子空间，互不干扰。模型可以通过 $W_Q, W_K, W_V$ 轻松地把它们分离出来。

### 参数矩阵（待训练的权重）

- $W_Q, W_K, W_V \in \mathbb{R}^{d \times d}$：三个独立的线性投影矩阵。
    
    - _注：实际上维度可能是_ $d_{model} \to d_{head}$_，为了数学简洁，这里假设输入输出维度一致。_
        

> **💡 几何本质：线性变换（Linear Transformation）**
> 
> _(图解：矩阵乘法将原始网格空间扭曲、旋转或缩放，将向量映射到新的语义空间)_
> 
> 这里的 $W$ 矩阵不仅仅是参数，它在几何上代表一种**空间的变换**。它把原始的 $X$ 空间里的向量，分别“扭曲”到了 $Q$ 空间（查询空间）、$K$ 空间（索引空间）和 $V$ 空间（内容空间）。这就是为什么同一个 $X$ 既能做 $Q$ 又能做 $K$ 的数学原因。

### 投影变量（中间态）

通过矩阵乘法产生的三个中间变量（此时它们还没有“天生语义”，只是线性变换的结果）：

- $Q = X W_Q \in \mathbb{R}^{n \times d}$ —— 查询矩阵（Query）。
    
- $K = X W_K \in \mathbb{R}^{n \times d}$ —— 键值矩阵（Key）。
    
- $V = X W_V \in \mathbb{R}^{n \times d}$ —— 内容矩阵（Value）。
    

> **🔑 记忆口诀：QKV 角色歌**
> *   **Q (Query)** 是**探针**，拿着问题找人问；
> *   **K (Key)** 是**标签**，挂在门口等人认；
> *   **V (Value)** 是**宝藏**，谁若匹配送给谁。
> *   **注意**：Q 找 K 算分数，算出分数乘 V 归。
>
> <details>
> <summary>🧠 <strong>思维挑战：如果 Q=K=V 会发生什么？</strong> (点击展开)</summary>
> <blockquote>
>   <p><strong>解析：</strong> 这就是最原始的 Self-Attention（没有投影矩阵 Wq, Wk, Wv 的情况）。这就好比"我看谁都像我自己"，无法区分"我想找的"和"我拥有的"。引入 Wq, Wk, Wv 就是为了让同一个词分裂出三种不同的人格，分别处理不同的任务。</p>
> </blockquote>
> </details>
>
> **💡 深度解析：为什么要搞 Q, K, V 三个矩阵？直接用 X 算不行吗？**
> 
> - **为了解耦（Decoupling）**：如果直接用 $X \cdot X^T$，那么 $i$ 找 $j$ 的分数和 $j$ 找 $i$ 的分数就完全一样了（点积对称性）。但实际上，“我看你”和“你看我”的重要性往往不同。
>     
> - **为了增强表达力**：同一个词在不同语境下扮演的角色不同。$Q$ 负责表达“我在找什么”，$K$ 负责表达“我有什么特征”，$V$ 负责表达“我的实际内容”。这好比在图书馆检索系统里，**查询请求**（Query）和**图书索引**（Key）是用来计算匹配度的，而**图书正文**（Value）才是你最终得到的内容。即使它们源自同一本书（Token），其表示形式和功能也是完全分离的。
>     

### Mask 矩阵（Causal / Look-ahead）

在 Decoder 自回归场景中引入的常量张量（不参与学习）：

- $M \in \mathbb{R}^{n \times n}$ —— 因果 Mask。
    
- **定义规则（以 Decoder 为例）**：
    
    - $M_{ij} = 0$，若 $j \le i$（允许看当前和过去）。
        
    - $M_{ij} = -\infty$，若 $j > i$（未来，禁止看）。
        
    - _注：在 Encoder 中，通常没有这种因果限制（即全为 0），除非是为了处理 Padding（Pad Mask）。_
        

### 关键索引（记不住这个就看不懂反向传播）

- $i$：输出位置（Query 的索引）。代表**“我是谁”**、“我正在生成第 $i$ 个位置的表示 ($O_i$)”。
    
- $j$：输入位置（Key/Value 的索引）。代表**“我在看谁”**、“我想从第 $j$ 个位置 ($V_j$) 提取信息”。

<details>
<summary>🧠 <strong>互动思考：Q, K, V 的形状变化</strong> (点击展开)</summary>
<blockquote>
  <p><strong>问题：</strong> 假设输入 X 的形状是 [10, 512] (10个词，512维)。<br>
  如果 W_Q 的形状是 [512, 64]。</p>
  <p><strong>请问：</strong><br>
  1. 计算出的 Q 矩阵形状是多少？<br>
  2. 这个形状意味着什么？</p>
  <p><strong>答案：</strong><br>
  1. [10, 64]。<br>
  2. 意味着 10 个词，每个词现在被压缩/映射到了 64 维的"查询空间"中。</p>
</blockquote>
</details>

## 2. 前向传播：程序是怎么跑的？（Operation）

Attention 的计算过程可以拆解为两步：**路由（Routing）** 和 **聚合（Aggregation）**。

### Step 1: 路由 —— 算 $A$ (Attention Map)

这一步决定了 $i$ 和 $j$ 的关系强度。

#### 1.1 计算原始分数 (Score)

$$S = \frac{QK^T}{\sqrt{d}} \in \mathbb{R}^{n \times n}$$

- **具体到元素**：$S_{ij} = \frac{Q_i \cdot K_j}{\sqrt{d}}$
    
- **物理意义（结合第0章）**：
    
    - **几何本质**：这就是在计算 $Q_i$ 和 $K_j$ 的**点积（投影）**。
        
    - **业务含义**：如果点积很大，说明 Query（需求）和 Key（索引）方向一致，**匹配度高**。
        
- **计算复杂度（面试考点）**：计算 $S$ 需要进行 $n^2$ 次点积运算，时间复杂度为 $O(n^2 \cdot d)$。当序列长度 $n$ 非常大时（如长文档），这会成为性能瓶颈（这也是为什么会有 Sparse Attention 等变体的原因）。
    

> **💡 深度解析：为什么一定要除以** $\sqrt{d}$**？（Scaled Dot-Product）**
> 
> - **数学推导**：假设 $Q$ 和 $K$ 中的元素是均值为 0、方差为 1 的**独立同分布（i.i.d.）**随机变量。它们的点积是 $d$ 个元素的加和：$Q \cdot K = \sum_{k=1}^d q_k k_k$。
>     
>     - 加和后的结果，均值还是 0，但**方差会累加变成** $d$。
>         
>     - 这意味着点积结果的标准差是 $\sqrt{d}$。
>         
> - **直观后果**：当 $d$ 很大时（例如 $d=64$ 或 $512$），点积的数值范围会非常大（可能蹦到 20、50 甚至更大）。
>     
> - **梯度灾难（最重要的原因）**：Softmax 函数 $e^x$ 对数值非常敏感。
>     
>     - 如果输入数值很大（比如 50），$e^{50}$ 会是个天文数字。
>         
>     - Softmax 后的分布会变成“One-hot”模式（一个 1，其余全 0）。
>         
>     - 在那个“1”的位置，**梯度接近于 0**（你可以想象 Sigmoid 函数两端的平坦区）。这被称为 Softmax 的**饱和区（Saturation Zone）**，此时输入微小的变化几乎不会引起输出概率的变化，导致严重的**梯度消失（Gradient Vanishing）**问题，使得参数无法有效更新，模型根本学不动。
>         
> - **结论**：除以 $\sqrt{d}$ 是为了把分数的方差拉回 1，让数值落入 Softmax 函数的**梯度敏感区**（中间部分）。
>     

#### 1.2 注入 Mask (Causal Masking)

在 Softmax 之前，用一个“下三角 Mask”把未来位置盖掉。我们将 Mask 加到 Score 上：$S' = S + M$。

- **原始 Attention Score (未 Mask) 示例**： 假设 $S = \frac{QK^T}{\sqrt{d}}$ 如下（行 $i$ 看 列 $j$）：
    
    $$S = \begin{bmatrix} 0.3 & 0.2 & 0.1 & 0.4 \\ 0.2 & 0.5 & 0.2 & 0.1 \\ 0.1 & 0.3 & 0.4 & 0.2 \\ 0.2 & 0.1 & 0.3 & 0.4 \end{bmatrix}$$
- **加上 Causal Mask 之后**： 规则：右上角 ($j > i$) 设为 $-\infty$，当前和过去保持不变。
    
    $$S + Mask = \begin{bmatrix} 0.3 & -\infty & -\infty & -\infty \\ 0.2 & 0.5 & -\infty & -\infty \\ 0.1 & 0.3 & 0.4 & -\infty \\ 0.2 & 0.1 & 0.3 & 0.4 \end{bmatrix}$$
- **本质**：不是“提醒模型别看未来”，而是**“在数值上直接抹掉未来的 score”**。
    

#### 1.3 归一化 (Softmax)

$$A = \text{softmax}(S') \in \mathbb{R}^{n \times n}$$

- **具体到元素**：$A_{ij} = \frac{\exp(S'_{ij})}{\sum_{k=1}^n \exp(S'_{ik})}$

<details>
<summary>🧮 <strong>Math Walkthrough: Softmax 计算详解</strong> (点击展开)</summary>
<blockquote>
  <p><strong>公式：</strong> $\text{softmax}(x_i) = \frac{e^{x_i}}{\sum_j e^{x_j}}$</p>
  <p><strong>场景：</strong> 原始分数 Score = [2.0, 1.0, 0.1]。我们来看看 Softmax 是怎么把它们变成概率的。</p>
  <p><strong>Step 1: 指数化 (Exponentiation)</strong><br>
  - $e^{2.0} \approx 7.389$<br>
  - $e^{1.0} \approx 2.718$<br>
  - $e^{0.1} \approx 1.105$</p>
  <p><strong>Step 2: 求和 (Summation)</strong><br>
  - Sum = 7.389 + 2.718 + 1.105 = <strong>11.212</strong></p>
  <p><strong>Step 3: 归一化 (Normalization)</strong><br>
  - $P_1 = 7.389 / 11.212 \approx \mathbf{0.659}$ (65.9%)<br>
  - $P_2 = 2.718 / 11.212 \approx \mathbf{0.242}$ (24.2%)<br>
  - $P_3 = 1.105 / 11.212 \approx \mathbf{0.099}$ (9.9%)</p>
  <p><strong>观察：</strong><br>
  原始分数 2.0 只比 1.0 大一倍，但概率 0.659 比 0.242 大了接近 3 倍。<br>
  <strong>结论：</strong> Softmax 会<strong>放大</strong>大数值的优势，让模型更"自信"地关注最重要的那个词。</p>
</blockquote>
</details>

- **为什么一定要用** $-\infty$**？**
    
    - Softmax 数学性质：$e^{-\infty} = 0$。
        
    - **结果矩阵示例**：
        
        $$A = \text{softmax}(S + Mask) = \begin{bmatrix} 1.0 & 0.0 & 0.0 & 0.0 \\ 0.2 & 0.8 & 0.0 & 0.0 \\ 0.1 & 0.3 & 0.6 & 0.0 \\ 0.1 & 0.1 & 0.3 & 0.5 \end{bmatrix}$$
        
        （注：数值仅为示意，每一行加和为 1）
        
- **结论**：未来位置的权重**严格等于 0**。
    

> **💡 深度解析：为什么用 Softmax 而不是简单的归一化（L1 Norm）？**
> 
> - **放大差异（Winner-take-all）**：Softmax 使用指数函数。$3$ 和 $5$ 看起来只差 2，但 $e^3 \approx 20$，$e^5 \approx 148$。指数拉大了差距。这能让模型更加自信地关注那个“最重要”的词，而不是“雨露均沾”。
>     
> - **概率解释**：Softmax 输出的是一个合法的概率分布（和为 1，且非负），方便后续进行加权期望计算。
>     

> **💡 通俗类比：Softmax 的"马太效应"**
>
> 想象你在给 10 个人打分，原始分是 [10, 10, 10, 12]。
> *   **直接归一化**：大家差不多，那个 12 分的只比别人多一点点。
> *   **Softmax (指数放大)**：12 分的会被放大成"超级巨星"，10 分的变成"路人甲"。
> *   **目的**：让模型**敢爱敢恨**，集中注意力在最重要的信息上，不要磨磨唧唧。

<details>
<summary>🕵️ <strong>找茬游戏：Mask 为什么要设为 -∞ 而不是 0？</strong> (点击展开)</summary>
<blockquote>
  <p><strong>答案：</strong> 因为我们要过 Softmax！<br>
  如果是 0，Softmax(0) = e^0 = 1，这表示"有一点关注"。<br>
  如果是 -∞，Softmax(-∞) = e^(-∞) = 0，这才是真正的"完全看不见"。<br>
  我们必须彻底封死偷看未来的可能性。</p>
</blockquote>
</details>

### Step 2: 聚合 —— 算 $O$ (Output)

这一步是根据权重搬运内容。

#### 完整公式（面试必说）

$$\text{Attention}(Q,K,V) = \text{softmax}\left(\frac{QK^\top}{\sqrt d} + \text{Mask}\right)V$$

**注意顺序**：

1. 先算 $QK^T$（互相打分）。
    
2. 再除以 $\sqrt{d}$（防止梯度消失）。
    
3. 再加 Mask（未来位置直接 $-\infty$）。
    
4. 再 Softmax（未来权重变 0）。
    
5. 再乘 $V$（未来信息不参与）。
    

#### 加权求和

$$O = AV \in \mathbb{R}^{n \times d}$$$$O_i = \sum_{j=1}^n A_{ij} V_j$$

- **物理意义**：输出 $O_i$ 是所有输入 $V_j$ 的线性混合。混合比例由 $A_{ij}$ 决定。
    
- 到这里为止，$Q/K/V$ 没有任何“天生语义”，它们只是三组矩阵乘法产生的中间变量。

<details>
<summary>🧪 <strong>模拟实验：Softmax 的威力</strong> (点击展开)</summary>
<blockquote>
  <p><strong>场景：</strong> 假设只有 3 个词。原始分数 Score = [2.0, 1.0, 0.1]。</p>
  <p><strong>如果不由 Softmax (直接归一化)：</strong><br>
  Sum = 3.1<br>
  Weights = [0.65, 0.32, 0.03]<br>
  (第一名只比第二名强 2 倍)</p>
  <p><strong>使用 Softmax：</strong><br>
  e^2.0 ≈ 7.39<br>
  e^1.0 ≈ 2.72<br>
  e^0.1 ≈ 1.10<br>
  Sum ≈ 11.21<br>
  Weights ≈ [0.66, 0.24, 0.10]<br>
  (差距被拉大了！)</p>
  <p><strong>思考：</strong> 如果 Score = [10, 9, 8]，Softmax 会输出什么？<br>
  (提示：e^10 远大于 e^9，差距会非常巨大，这就是 Winner-take-all)</p>
</blockquote>
</details>

## 3. 反向传播：分工是怎么被“逼”出来的？（Gradient Flow）

> **💡 职场类比：谁的锅？（Blame Assignment）**
>
> 想象 Transformer 是一个公司部门：
> *   **Loss (老板)**：发现项目搞砸了（Loss 很大），开始咆哮。
> *   **Output (项目经理)**：被老板骂了，转身找下属算账。
> *   **V (打工人)**：负责干活的。如果内容错了，PM 会骂 V："你给我的资料是错的！去改！"（梯度流向 V）。
> *   **Attention (调度员)**：负责分配任务的。如果内容没错但找错人了（比如把设计图发给了会计），PM 会骂 Attention："你瞎啊！找错人了！"（梯度流向 Q 和 K）。
>
> **结论**：反向传播就是**精准甩锅**。谁导致了错误，谁就要修改参数。

**核心公理**：谁在前向传播中对 Loss 产生了影响，梯度就会回流给谁，强迫它修改参数以降低 Loss。 **结论**：更新多的地方会被“训练成更有用的角色”。

### 🎨 Attention 计算流与梯度流架构图

```
前向传播（数据流 ↓）                        反向传播（梯度流 ↑）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

输入 Token Embeddings [n × d]
         │
    ┌────┼────┐
    │    │    │
    ▼    ▼    ▼
   W_Q  W_K  W_V                           ▲  ▲  ▲
    │    │    │                            │  │  │
    ▼    ▼    ▼                        梯度│梯度│梯度
    Q    K    V                         路由路径│内容路径
 [n×d] [n×d] [n×d]                       │  │  │
    │    │    │                            │  │  │
    └────┬────┘                            │  │  │
         │                                 │  │  │
    Q·K^T / √d ───────────────────────────┘  │  │
         │                                    │  │
         ▼                                    │  │
    Score Matrix                              │  │
      [n × n]                                 │  │
         │                                    │  │
         ▼                                    │  │
  +Mask (Causal)                              │  │
  Set future=-∞                               │  │
         │                                    │  │
         ▼                                    │  │
    Softmax()                                 │  │
         │                                    │  │
         ▼                                    │  │
    Attention Weights A                       │  │
      [n × n]                                 │  │
         │                                    │  │
         └──────┬──────────────────────────────┘  │
                │                                  │
                ▼                                  │
           A · V ────────────────────────────────┘
                │
                ▼
           Output O
            [n × d]
                │
                ▼
           Loss L

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

梯度流说明：
┌─────────────────────────────────────────────────────────────┐
│ 🔴 内容路径：L → O → V                                      │
│    - 梯度权重：A_{ij}（谁被关注多，谁的梯度就大）           │
│    - 更新目标：让 V 包含"有用的语义内容"                    │
│    - Mask 影响：未来的 V 因 A=0 而收不到梯度（硬断路）      │
│                                                               │
│ 🔵 路由路径：L → O → A → S → (Q, K)                        │
│    - 梯度权重：Softmax 导数 × 原始权重                      │
│    - 更新目标：让 Q·K 的点积能"找到正确的关注对象"          │
│    - 核心机制：提高有用 Token 的 Score，降低无关 Token Score│
└─────────────────────────────────────────────────────────────┘
```

我们将梯度流分为两条路径：

1. **内容路径** ($L \to O \to V$)
    
2. **路由路径** ($L \to O \to A \to S \to Q, K$)
    

### 3.1 路径一：$V$ 为什么变成了“内容仓库”？

我们看输出公式：$O_i = \sum_j A_{ij} V_j$。 假设 $A_{ij}$（关注度）已经固定了，比如 $i$ 非常关注 $j$ ($A_{ij} \approx 0.9$)。 此时，如果 $L$（Loss）告诉 $O_i$：“你的预测不对！你应该更像‘鱼’的向量，而不是‘桌子’的向量。”

#### 梯度推导

$$\frac{\partial L}{\partial V_j} = \sum_i \underbrace{A_{ij}}_{\text{权重}} \cdot \underbrace{\frac{\partial L}{\partial O_i}}_{\text{输出误差}}$$

#### 因果链条

1. 因为 $A_{ij}$ 很大，$V_j$ 被加到了 $O_i$ 里。
    
2. 因为 $O_i$ 错了，梯度 $\frac{\partial L}{\partial O_i}$ 很大。
    
3. **结果**：梯度顺着 $A_{ij}$ 这根管子，直接流到了 $V_j$ 身上。
    
4. **修正**：梯度强迫 $V_j$ 修改自己的数值，使其蕴含的语义更接近 Target（比如让它包含更多“生物”、“可食用”的特征）。
    

#### Mask 的“硬影响”（面试高分点）

- 如果 $j > i$（未来）：$A_{ij} = 0$（前向被 Mask）。
    
- 那么在7反向里，这一项**直接消失**。
    
- **结论**：未来 Token 的 $V_j$，对当前 $O_i$，前向没参与，反向也没梯度。这不是训练结果，是**计算图层面的断路**。
    

#### 长期结局

$V$ 被训练成了**“由于经常被拿去合成答案，所以必须包含高价值语义”**的载体。

### 3.2 路径二：$Q, K$ 为什么变成了“匹配器”？

这次假设 $V$ 是完美的（内容是对的），但 $O_i$ 还是错了。 这说明找错人了——应该关注 $V_{fish}$，结果关注了 $V_{stone}$。即 $A_{i, fish}$ 太小，$A_{i, stone}$ 太大。

#### 梯度推导 (链式法则的高潮)

我们要修改 $Q$ 和 $K$，必须经过 $S$。

$$S_{ij} \propto Q_i \cdot K_j$$

#### 因果链条

1. **需求**：Loss 要求提高 $A_{i, fish}$（多看鱼）。
    
2. **传导**：要提高 $A$，必须提高原始分数 $S_{i, fish}$。
    
3. **几何约束（结合第0章）**：$S_{i, fish}$ 是点积。要提高点积，数学上只有一种办法 —— 让向量 $Q_i$ 和 $K_{fish}$ 的**方向更接近（投影变长 / 夹角变小）**。
    

#### 修正（Dialogue）

- 梯度告诉 $Q_i$：**“往** $K_{fish}$ **的方向转！”**
    
- 梯度告诉 $K_{fish}$：**“往** $Q_i$ **的方向转！”**
    

#### Mask 的因果角色

- 若 $j > i$：$S'_{ij} = -\infty$。梯度对 $Q_i, K_j$ 恒为 0。
    
- 若 $j \le i$：梯度正常回流，$Q_i$ 与 $K_j$ 可以被训练对齐。
    
- **结论**：$Q/K$ 的匹配学习，只发生在“被允许的因果边”上。未来 Token 的 $K_j$ 不会参与当前 $Q_i$ 的更新。
    

#### 长期结局

- $Q$ 学会了发出**“我要找食物”**的请求向量。
    
- $K$ 学会了发出**“我是食物”**的标签向量。
    
- 只有这样，它们的点积才会最大，Loss 才会最小。

<details>
<summary>🕵️ <strong>侦探游戏：谁杀死了梯度？</strong> (点击展开)</summary>
<blockquote>
  <p><strong>案情：</strong> 在训练 Decoder 时，发现第 5 个词的梯度从来没有传给第 6 个词的 Embedding。</p>
  <p><strong>嫌疑人：</strong><br>
  A. Softmax 饱和了<br>
  B. ReLU 死了 (Dead ReLU)<br>
  C. Causal Mask<br>
  D. LayerNorm</p>
  <p><strong>真相：</strong> 选 <strong>C</strong>。<br>
  在 Decoder 中，Causal Mask 强制将位置 5 对位置 6 的 Attention Score 设为 -∞。前向传播时权重为 0，反向传播时梯度被物理切断。这是 Feature，不是 Bug。</p>
</blockquote>
</details>

## 4. Multi-Head Attention：从单头到多头的进化

我们之前的推导都是基于“单个 Head”的。但在实际 Transformer（如 BERT, GPT）中，我们使用的是**多头注意力（Multi-Head Attention）**。这一章我们将结合第 11 章的“多视角”和第 12 章的“输出融合”进行深度解析。

### 4.1 为什么要切分多头？（Multi-Perspective）

> **💡 经典寓言：盲人摸象 (Blind Men and the Elephant)**
>
> *   **Head 1 (摸大腿)**：觉得大象像柱子（关注语法结构）。
> *   **Head 2 (摸耳朵)**：觉得大象像扇子（关注指代关系）。
> *   **Head 3 (摸尾巴)**：觉得大象像绳子（关注情感色彩）。
> *   **Multi-Head**：把所有人的发现拼在一起，才能还原出完整的大象。
>
> 如果只有一个头，它可能只能看到大象的一面，导致理解片面。

> **直觉：** 就像你在读一句话时，你的大脑同时在做多件事（Process）：
> 
> 1. **语法分析**：找主谓宾（"eating" 对应的主语是 "cat"）。
>     
> 2. **指代消解**：找代词指代（"it" 指的是 "fish"）。
>     
> 3. **情感分析**：判断上下文情绪（是开心的还是悲伤的）。
>     
> 
> 如果只有一个 Head，它很难同时兼顾这些不同的“关注模式”。 **Multi-Head 的本质**：给模型**多组** $Q, K, V$ **投影矩阵**，让每一组去学不同的特征关系，形成“平行宇宙”般的语义空间。

### 4.2 形状变换与维度分析（面试必考）

这是面试中关于 Transformer 形状推导最容易出错的地方。 假设模型的总维度 $d_{model} = 512$，头数 $num\_heads = 8$。那么每个头的维度 $d_k = 512 / 8 = 64$。

**(1) 维度定义**

- **Batch (批次大小)**：一次并行处理多少个句子。比如 Batch=32，就是同时算 32 个句子。
    
- **SeqLen (序列长度)**：一个句子有多少个词（Token）。比如 "I love AI" 就是 3。
    
- $d_{model}$ **(模型总维度)**：每个词用多长的向量表示（如 512）。
    

**(2) 具体案例：切分过程详解**

> **🌰 举个栗子：** 假设我们只输入 **1 个句子**（Batch=1），句子是 **"我爱吃鱼"**（SeqLen=4）。 模型总维度 $d_{model} = 512$，我们要切成 **8 个头**。
> 
> 1. **初始状态**：$X$ 的形状是 `[1, 4, 512]`。
>     
>     - 这表示有 1 个句子，含 4 个词，每个词是 512 维的向量。
>         
>     - 词 "我" 的向量是 `X[0, 0, :]`，长度 512。
>         
> 2. **投影与切分（Reshape）**：`[1, 4, 8, 64]`。
>     
>     - 我们把 "我" 的 512 维向量，逻辑上切成了 8 段，每段 64 维。
>         
>     - 现在，"我" 在第 1 个头里是 64 维，在第 2 个头里也是 64 维...
>         
> 3. **转置（Transpose）**：`[1, 8, 4, 64]`。
>     
>     - **关键一步！** 为什么要换位置？
>         
>     - 为了让 GPU 把“头”当成“批次”来处理。
>         
>     - 现在的视角变成了：**有 8 个独立的“平行世界”（Heads）**。
>         
>     - 在第 1 个平行世界（Head 0）里，句子依然是 "我爱吃鱼"（4 个词），但每个词只剩下 64 维特征。
>         
>     - Attention 计算时，Head 0 只看自己的这 4 个 64 维向量，完全不管 Head 1 的事。
>         

**Step 1: 线性投影与切分 (Split)** 输入 $X$ 的形状是 $[Batch, SeqLen, 512]$。 我们并不是真的把输入 $X$ 切开，而是把大的投影矩阵 $W_Q, W_K, W_V$ 切分成 $h$ 份（或者投影到大维度后 Reshape）。

> **💡 疑问解答：Q 的大小到底等于 X 吗？**
> 
> 答案：**总量上等于（Concatenated），但在计算时被拆分了。**
> 
> - **物理内存上**：在代码实现中，我们通常定义一个大的 $W_Q$（维度 $512 \times 512$）。所以 $X \cdot W_Q$ 得到的中间结果（Big Q）形状确实是 $[Batch, SeqLen, 512]$，**跟 X 一样大**。
>     
> - **逻辑计算上**：为了实现“多视角”，我们紧接着把它**拆（Reshape）**成了 8 个 $[Batch, SeqLen, 64]$ 的小矩阵。每个头（Head）只拿到了原信息的一部分（64维），并在自己的小世界里独立计算 Attention。
>     

- **投影后**：$X \cdot W_Q \rightarrow [Batch, SeqLen, 512]$
    
- **切分（Reshape）**：将最后一个维度 $512$ 拆成 $8 \times 64$。
    
    $$[Batch, SeqLen, 512] \xrightarrow{\text{Reshape}} [Batch, SeqLen, 8, 64]$$
- **转置（Transpose）**：为了让 GPU 并行计算 Attention，我们需要把“头”的维度放到前面。
    
    $$[Batch, SeqLen, 8, 64] \xrightarrow{\text{Transpose}} [Batch, 8, SeqLen, 64]$$

**Step 2: 并行计算 (Parallel Attention)** 现在我们有 $8$ 个独立的 $(Q_i, K_i, V_i)$ 组，形状都是 $[SeqLen, 64]$。 对每一个 Head $i$，独立计算：

$$\text{head}_i = \text{Attention}(Q_i, K_i, V_i) = \text{softmax}(\frac{Q_i K_i^T}{\sqrt{64}})V_i$$

这一步在 GPU 上是并行发生的，效率极高。输出形状为 $[Batch, 8, SeqLen, 64]$。

### 4.3 拼接 (Concatenate) 的物理含义

计算完 Attention 后，我们得到了 8 个视角的“观点”。 现在的任务是：**怎么把这 8 个零散的结论合成为一个整体？**

**操作**：拼接 (Concatenate) 把 8 个头的输出直接“并排”拼在一起，恢复成原来的宽度。

$$\text{MultiHeadOutput}_{\text{raw}} = \text{Concat}(\text{head}_1, \text{head}_2, ..., \text{head}_8)$$

- **形状逆变换**：
    
    1. Transpose: $[Batch, 8, SeqLen, 64] \rightarrow [Batch, SeqLen, 8, 64]$
        
    2. Reshape (Flatten): $[Batch, SeqLen, 8, 64] \rightarrow [Batch, SeqLen, 512]$
        

**物理意义**：此时的 $512$ 维向量中，前 64 维来自头 1，第 65-128 维来自头 2……它们虽然在同一个向量里，但彼此之间是**隔离**的，就像 8 个陌生人坐在一条长凳上。

### 4.4 $W_O$ 的本质：为什么拼接后还要乘一个矩阵？

拼接后的结果只是简单的“并排坐”，第 1 个头的信息和第 2 个头的信息还没发生交互。 我们需要一个线性变换矩阵 $W_O \in \mathbb{R}^{d_{model} \times d_{model}}$ 来进行“信息融合”。

$$\text{FinalOutput} = \text{MultiHeadOutput}_{\text{raw}} \cdot W_O$$

#### 4.4.1 微观图解：矩阵乘法如何实现“全员混合”

为了回答“为什么所有元素都参与了运算”，我们来看一个极简的**代数例子**。

**假设：**

- 我们只有 **2 个头** (Head 1, Head 2)，每个头输出维度是 1。
    
- 拼接后的 `Concat` 向量是 $[h_1, h_2]$（维度 1x2）。
    
- $W_O$ 是一个 $2 \times 2$ 的矩阵（参数 $w_{11}, w_{12}...$ 都是学习出来的）。
    

**运算过程：**

$$[h_1, h_2] \cdot \begin{bmatrix} w_{11} & w_{12} \\ w_{21} & w_{22} \end{bmatrix} = [y_1, y_2]$$

**展开看结果向量的第 1 个元素** $y_1$**：**

$$y_1 = \underbrace{(h_1 \times w_{11})}_{\text{来自头1}} + \underbrace{(h_2 \times w_{21})}_{\text{来自头2}}$$

**结论：**

- 输出的 **某一个数值** $y_1$，是由 **Head 1 的信息** 和 **Head 2 的信息** 加权求和得到的。
    
- 这就是“**信息融合**”的数学本质。$W_O$ 里的参数决定了它更看重哪个头。
    
    - 如果 $w_{11}$ 很大，$w_{21}$ 很小 $\rightarrow$ 这一位主要保留 Head 1 的信息。
        
    - 如果 $w_{11} \approx w_{21}$ $\rightarrow$ 这一位均匀混合了两个头的信息。
        

> **💡 深度解析：**$W_O$ **(Output Projection) 到底干了什么？**
> 
> 1. **来源**： $W_O$ 和 $W_Q, W_K, W_V$ 一样，是 Transformer 层中自带的、**可训练的参数矩阵**（全连接层）。初始化时是随机的，训练后变得有意义。
>     
> 2. **功能：信息融合（Mixing / Interaction）**： $W_O$ 是一个全连接层（Linear）。矩阵乘法会让输入向量的所有元素参与运算。 这意味着，输出向量的每一个维度，都是**所有 8 个头信息的加权和**。
>     
>     - _举例_：它允许模型说“对于这个词，头 1 的语法信息占 30% 权重，头 2 的情感信息占 70% 权重”。
>         
>     - 如果没有 $W_O$，后续层只能分别看到孤立的头信息，无法综合判断。
>         
> 3. **几何空间复原**： 拼接操作只是把向量物理上拼长了。$W_O$ 负责把这个拼接后的混合向量，重新**映射**（Map）回标准的、统一的语义空间，使其可以被后续的前馈网络（FFN）或下一层 Attention 正常处理。
>     

## 5. 终极总结：四条可背诵的因果链

把这个背下来，面试时直接抛出来，非常专业。

### Q (Query) 的分工

- **角色**：发起查询的探针（“我该找谁”）。
    
- **成因**：梯度强迫 $Q_i$ 与目标 $K$ 方向对齐（最大化点积/投影）。
    

### K (Key) 的分工

- **角色**：被查询的索引/标签（“我会被谁匹配到”）。
    
- **成因**：梯度强迫 $K_j$ 与寻找它的 $Q$ 方向对齐。
    

### V (Value) 的分工

- **角色**：被提取的语义内容（“内容仓库”）。
    
- **成因**：梯度通过权重 $A_{ij}$ 直接回传，强迫 $V_j$ 承载实际特征信息。
    

### $W_O$ (Output Projection) 的分工

- **角色**：多视角信息的**融合器**。
    
- **作用**：将拼接后互不相关的多头信息，通过线性变换混合成统一的语义表示，类似于“开会后的总结陈词”。

<details>
<summary>🧩 <strong>拼图挑战：多头维度的变化</strong> (点击展开)</summary>
<blockquote>
  <p><strong>挑战：</strong> 假设 d_model=512, num_heads=8。</p>
  <p><strong>流程追踪：</strong><br>
  1. 输入 X: [Batch, 10, 512]<br>
  2. 投影后 Q: [Batch, 10, 512]<br>
  3. <strong>拆分后 (Split)</strong>: [Batch, 10, 8, 64]<br>
  4. <strong>转置后 (Transpose)</strong>: [Batch, 8, 10, 64] (为了并行计算 Attention)<br>
  5. Attention 输出: [Batch, 8, 10, 64]<br>
  6. <strong>拼接后 (Concat)</strong>: [Batch, 10, 512] (恢复原样)<br>
  7. 线性变换 W_O: [Batch, 10, 512]</p>
  <p><strong>关键点：</strong> 虽然中间拆成了 8 份，但最后输出的维度和输入<strong>完全一样</strong>。这就是为什么 Transformer 可以无限堆叠的原因。</p>
</blockquote>
</details>

---

## 第一部分 核心组件深度解析

## 6. 位置编码 (Positional Encoding)：给词向量注入"位置灵魂"

Self-Attention 机制有一个致命缺陷：它是**位置不敏感的 (Permutation Invariant)**。

### 6.1 问题提出：Self-Attention 的"失忆症"

#### 实验演示

假设我们有两个句子：

1. **"猫 吃 鱼"** → 输入矩阵 $X_1 = [x_{猫}, x_{吃}, x_{鱼}]$
    
2. **"鱼 吃 猫"** → 输入矩阵 $X_2 = [x_{鱼}, x_{吃}, x_{猫}]$
    

在 Self-Attention 中，我们计算 $Q \cdot K^T$。假设 $Q_1 = X_1 W_Q$，$K_1 = X_1 W_K$。

**关键观察**：

$$Q_1 K_1^T = (X_1 W_Q)(X_1 W_K)^T = X_1 W_Q W_K^T X_1^T$$

对于 $X_2$（只是重排了 $X_1$ 的行）：

$$Q_2 K_2^T = X_2 W_Q W_K^T X_2^T$$

**结论**：虽然 $X_1$ 和 $X_2$ 的**行顺序不同**（语义完全相反），但它们的 Attention Score 矩阵 $QK^T$ **只是行列同步重排**，本质结构完全一样。

> **💡 面试话术**："Self-Attention 的本质是集合操作 (Set Operation)。如果没有位置编码,模型无法区分'猫吃鱼'和'鱼吃猫',因为点积运算不关心向量的排列顺序。"

### 6.2 解决方案：位置编码 (Positional Encoding)

我们需要在输入 $X$ 中注入位置信息。Transformer 论文采用的是**正弦余弦位置编码 (Sinusoidal Positional Encoding)**。

#### 6.2.1 符号定义（钉死变量）

- $pos$：Token 在序列中的位置索引（$pos = 0, 1, 2, ..., n-1$）。
    
    - **物理意义**：第几个词。
        
- $i$：向量的维度索引（$i = 0, 1, 2, ..., d_{model}-1$）。
    
    - **物理意义**：词向量的第几个分量。
        
- $d_{model}$：词向量的总维度（如 512）。
    
- $PE(pos, i)$：位置编码矩阵的第 $pos$ 行、第 $i$ 列的数值。
    

#### 6.2.2 公式定义

$$PE(pos, 2i) = \sin\left(\frac{pos}{10000^{2i/d_{model}}}\right)$$

$$PE(pos, 2i+1) = \cos\left(\frac{pos}{10000^{2i/d_{model}}}\right)$$

**规则**：

- **偶数维度**（$2i$）：用 $\sin$。
    
- **奇数维度**（$2i+1$）：用 $\cos$。
    

#### 6.2.3 数值演示（程序执行视角）

假设 $d_{model} = 4$（简化），序列长度 $n = 3$（"猫 吃 鱼"）。

**Step 1: 计算波长因子（Wavelength Factor）**

对于每个维度 $i$，定义：

$$\lambda_i = 10000^{2i/d_{model}}$$

| 维度 $i$ | $2i/d_{model}$ | $\lambda_i$ |
| -------- | -------------- | ----------- |
| 0        | 0/4 = 0        | $10000^0 = 1$ |
| 1        | 2/4 = 0.5      | $10000^{0.5} = 100$ |
| 2        | 4/4 = 1        | $10000^1 = 10000$ |

**Step 2: 计算位置编码**

对于 $pos = 0$（第一个词"猫"）：

| 维度 | 公式                                    | 计算                         | 结果 |
| ---- | --------------------------------------- | ---------------------------- | ---- |
| 0    | $\sin(0/1)$                             | $\sin(0)$                    | 0    |
| 1    | $\cos(0/1)$                             | $\cos(0)$                    | 1    |
| 2    | $\sin(0/100)$                           | $\sin(0)$                    | 0    |
| 3    | $\cos(0/100)$                           | $\cos(0)$                    | 1    |

$\Rightarrow PE(pos=0) = [0, 1, 0, 1]$

对于 $pos = 1$（第二个词"吃"）：

| 维度 | 公式                                    | 计算                         | 结果 |
| ---- | --------------------------------------- | ---------------------------- | ---- |
| 0    | $\sin(1/1)$                             | $\sin(1) \approx 0.841$      | 0.841 |
| 1    | $\cos(1/1)$                             | $\cos(1) \approx 0.540$      | 0.540 |
| 2    | $\sin(1/100)$                           | $\sin(0.01) \approx 0.01$    | 0.01 |
| 3    | $\cos(1/100)$                           | $\cos(0.01) \approx 1.0$     | 1.0 |

$\Rightarrow PE(pos=1) = [0.841, 0.540, 0.01, 1.0]$

**观察**：

- **低维度**（$i=0$）变化快（周期短）。
    
- **高维度**（$i=2$）变化慢（周期长）。
    

### 6.3 为什么选择 sin/cos？（深度因果解释）

#### 角度一：唯一性（Unique Encoding）

每个位置 $pos$ 对应的 $PE(pos)$ 必须是**唯一的向量**。

- **反例**：如果用简单的线性编码 $PE(pos) = [pos, pos, ..., pos]$，那么：
    
    - $PE(100) = [100, 100, ...]$
        
    - $PE(1000) = [1000, 1000, ...]$
        
    - 数值范围无限增长，训练时模型可能遇到超出见过范围的位置（外推性差）。
        
- **sin/cos 的优势**：值域固定在 $[-1, 1]$，无论序列多长。
    

#### 角度二：相对位置关系（Relative Position）

**核心性质**：通过三角恒等式，模型可以从 $PE(pos)$ 和 $PE(pos+k)$ 推导出它们的相对距离 $k$。

**数学证明**（面试加分点）：

$$\sin(\alpha + \beta) = \sin\alpha \cos\beta + \cos\alpha \sin\beta$$

假设我们有：

- $PE(pos, 2i) = \sin(\omega_i \cdot pos)$（$\omega_i = 1/10000^{2i/d}$）
    
- $PE(pos+k, 2i) = \sin(\omega_i \cdot (pos+k))$
    

展开：

$$\sin(\omega_i \cdot (pos+k)) = \sin(\omega_i \cdot pos) \cos(\omega_i \cdot k) + \cos(\omega_i \cdot pos) \sin(\omega_i \cdot k)$$

**结论**：$PE(pos+k)$ 可以表示为 $PE(pos)$ 的**线性组合**（系数是 $\cos(\omega_i k)$ 和 $\sin(\omega_i k)$）。这意味着模型可以通过学习线性变换矩阵，捕捉相对位置关系。

> **💡 举个栗子**： 对于"猫 吃 鱼"和"鱼 吃 猫",虽然绝对位置不同,但"主语-动词"的相对距离都是 1。sin/cos 编码让模型能学到这种相对模式。

#### 角度三:多尺度周期(Multi-Scale Periodicity)

不同维度的波长 $\lambda_i$ 跨越多个数量级（$1, 100, 10000, ...$）：

- **低维度**（短周期）：捕捉邻近词的细粒度位置差异（如相邻 Token）。
    
- **高维度**（长周期）：捕捉远距离依赖（如句子开头和结尾）。
    

**类比**：就像时钟有"秒针"（快速旋转）和"时针"（缓慢旋转），共同表达完整时间。

### 6.4 与 Embedding 相加：为什么不是拼接？

#### 操作定义

最终的输入是：

$$X_{input} = X_{embed} + PE$$

其中：

- $X_{embed} \in \mathbb{R}^{n \times d_{model}}$：词嵌入矩阵。
    
- $PE \in \mathbb{R}^{n \times d_{model}}$：位置编码矩阵。
    

#### 为什么是相加（Addition）而不是拼接（Concatenation）？

**选项对比**：

| 方案                | 形状变化                                  | 优点     | 缺点       |
| ----------------- | ------------------------------------- | ------ | -------- |
| **拼接** (Concat)   | $[n, d] + [n, d] \rightarrow [n, 2d]$ | 信息完全分离 | 计算量翻倍    |
| **相加** (Addition) | $[n, d] + [n, d] \rightarrow [n, d]$  | 维度不变   | 信息"混在一起" |

**深度解析（高维空间的正交性）**：

在高维空间（如 $d=512$）中，随机采样的两个向量几乎总是**近似正交**（$\cos\theta \approx 0$）。

- **词义信息**（$X_{embed}$）和**位置信息**（$PE$）虽然相加了，但在几何上位于不同的子空间。
    
- 模型通过 $W_Q, W_K, W_V$ 的线性投影，可以轻松地将它们分离或组合。
    

**数学直觉**：

假设 $X_{embed}$ 主要分布在前 256 维的某个子空间，$PE$ 主要分布在后 256 维的子空间（虽然它们在所有维度都有值，但主成分不重叠）。那么：

- $W_Q$ 可以学习只提取 $X_{embed}$ 相关的维度（词义查询）。
    
- $W_K$ 可以学习混合两者（词义+位置索引）。
    

### 6.5 梯度流向（反向传播视角）

#### 前向传播

$$X_{input} = X_{embed} + PE$$

$$Q = X_{input} \cdot W_Q = (X_{embed} + PE) \cdot W_Q$$

#### 反向传播

假设我们有梯度 $\frac{\partial L}{\partial Q}$：

$$\frac{\partial L}{\partial X_{input}} = \frac{\partial L}{\partial Q} \cdot W_Q^T$$

**关键观察**：

- **位置编码 PE 是常量**（不参与训练），所以 $\frac{\partial L}{\partial PE} = 0$。
    
- 梯度**只回传给** $X_{embed}$：
    
    $$\frac{\partial L}{\partial X_{embed}} = \frac{\partial L}{\partial X_{input}}$$

**因果链条**：

1. Loss 要求 $Q$ 改变。
    
2. 但 $PE$ 是固定的，无法改变。
    
3. **结果**：梯度强迫 $X_{embed}$ 和 $W_Q$ 同时调整，学会如何利用（或忽略）位置信息。
    

### 6.6 代码实现（PyTorch）

```python
import torch
import math

def positional_encoding(seq_len, d_model):
    """
    生成正弦余弦位置编码
    
    Args:
        seq_len: 序列长度 (n)
        d_model: 词向量维度
    
    Returns:
        PE: [seq_len, d_model] 位置编码矩阵
    """
    # 初始化位置编码矩阵
    PE = torch.zeros(seq_len, d_model)  # [n, d]
    
    # 生成位置索引 [0, 1, 2, ..., seq_len-1]
    position = torch.arange(0, seq_len).unsqueeze(1)  # [n, 1]
    
    # 生成维度索引对应的分母项 10000^(2i/d_model)
    div_term = torch.exp(
        torch.arange(0, d_model, 2) * (-math.log(10000.0) / d_model)
    )  # [d/2]
    
    # 偶数维度用 sin
    PE[:, 0::2] = torch.sin(position * div_term)  # [n, d/2]
    
    # 奇数维度用 cos
    PE[:, 1::2] = torch.cos(position * div_term)  # [n, d/2]
    
    return PE

# 使用示例
seq_len = 10
d_model = 512
PE = positional_encoding(seq_len, d_model)

# 与词嵌入相加
X_embed = torch.randn(seq_len, d_model)  # 词嵌入
X_input = X_embed + PE  # 最终输入
print(f"输入形状: {X_input.shape}")  # [10, 512]
```

**形状注解**：

```python
position:  [n, 1]        # 每行是位置 pos
div_term:  [d/2]         # 每个维度对的波长因子
position * div_term:  [n, d/2]  # 广播后得到所有 (pos, i) 组合
PE[:, 0::2]:  [n, d/2]   # 偶数列
PE[:, 1::2]:  [n, d/2]   # 奇数列
```

### 6.7 可学习位置编码 vs 固定位置编码

#### 对比表

| 特性       | Sinusoidal (固定) | Learned (可学习) |
| ---------- | ----------------- | ---------------- |
| **参数量** | 0                 | $n \times d$     |
| **外推性** | 好（可处理更长序列） | 差（只能到训练长度） |
| **表达力** | 受限于 sin/cos    | 理论上更强       |
| **应用**   | 原始 Transformer  | BERT, GPT       |

**实践经验**：

- **BERT/GPT**：使用可学习位置编码（Learned Positional Embedding），因为预训练数据充足，且序列长度固定（512/1024）。
    
- **长文本任务**：倾向于使用 Sinusoidal 或相对位置编码（如 T5, Transformer-XL）。
    

### 📊 面试考点

#### Q1: 为什么 Self-Attention 需要位置编码？

**A**: Self-Attention 的核心是点积 $QK^T$,这是一个对称的、位置不敏感的操作。如果把输入序列 $X$ 的行打乱,Attention Score 矩阵只会同步重排,模型无法区分"猫吃鱼"和"鱼吃猫"。位置编码通过注入位置信息,打破了这种对称性。

#### Q2: 为什么用 sin/cos 而不是简单的线性编码？

**A**: 三个原因：

1. **值域有界**：sin/cos 范围是 $[-1,1]$,而线性编码 $pos$ 会无限增长,泛化性差。
    
2. **相对位置**：通过三角恒等式 $\sin(\alpha+\beta) = \sin\alpha\cos\beta + \cos\alpha\sin\beta$,模型可以从绝对位置推导相对位置。
    
3. **多尺度**：不同维度的波长覆盖 $[1, 10000]$,同时捕捉短程和长程依赖。
    

#### Q3: 为什么与 Embedding 相加而不是拼接？

**A**: 拼接会使维度翻倍（$d \to 2d$）,计算量和参数量都增加一倍。而在高维空间（如 512 维）中,词义向量和位置向量几乎正交,相加后模型可以通过线性变换（$W_Q, W_K, W_V$）轻松分离或组合它们。这是高维空间的几何性质,不是简单的"混在一起"。

#### Q4: 位置编码参与训练吗？

**A**: 原始 Transformer 中的 Sinusoidal PE **不参与训练**（常量）。但 BERT/GPT 使用的 Learned PE 是可训练参数。两种方案的 trade-off 是：固定 PE 外推性好但表达力受限,可学习 PE 表达力强但不能处理超过训练长度的序列。

#### Q5: (Hard) 如何从数学上证明 sin/cos 编码能表达相对位置？

**A**: 
设 $PE(pos, 2i) = \sin(\omega_i \cdot pos)$, $PE(pos, 2i+1) = \cos(\omega_i \cdot pos)$，其中 $\omega_i = 1/10000^{2i/d}$。

对于位置 $pos+k$：

$$\begin{aligned}
PE(pos+k, 2i) &= \sin(\omega_i(pos+k)) \\
&= \sin(\omega_i pos)\cos(\omega_i k) + \cos(\omega_i pos)\sin(\omega_i k) \\
&= PE(pos, 2i) \cdot \cos(\omega_i k) + PE(pos, 2i+1) \cdot \sin(\omega_i k)
\end{aligned}$$

这意味着 $PE(pos+k)$ 是 $PE(pos)$ 的**线性变换**（变换矩阵只依赖于 $k$）。模型可以学习一个矩阵来捕捉"相对距离为 $k$"的模式,而不需要记住每个绝对位置。


## 7. 前馈网络 (Feed-Forward Network, FFN)：每个 Token 的"独立思考空间"

Self-Attention 让 Token 之间互相交流，但它只是**信息的搬运和聚合**。每个 Token 获得了上下文信息后，还需要一个"独立思考"的空间来处理这些信息。这就是 FFN 的作用。

### 7.1 结构定义（符号系统）

FFN 是一个**两层的全连接网络 (MLP)**，应用于每个位置的表示（Position-wise）。

#### 符号定义

- $X \in \mathbb{R}^{n \times d_{model}}$：FFN 的输入（通常是 Attention 层的输出经过 LayerNorm 和残差连接后的结果）。
    
- $W_1 \in \mathbb{R}^{d_{model} \times d_{ff}}$：第一层线性变换的权重矩阵。
    
    - $d_{ff}$：FFN 的中间层维度（通常是 $4 \times d_{model}$，如 $512 \to 2048$）。
        
- $b_1 \in \mathbb{R}^{d_{ff}}$：第一层的偏置。
    
- $W_2 \in \mathbb{R}^{d_{ff} \times d_{model}}$：第二层线性变换的权重矩阵（映射回原始维度）。
    
- $b_2 \in \mathbb{R}^{d_{model}}$：第二层的偏置。
    

#### 公式定义

$$\text{FFN}(X) = \text{ReLU}(X W_1 + b_1) W_2 + b_2$$

**逐元素展开**（针对第 $i$ 个 Token）：

$$\text{FFN}(X_i) = \text{ReLU}(X_i W_1 + b_1) W_2 + b_2$$

**关键特性**：

- **Position-wise**：每个 Token 独立通过 FFN，不同位置的 Token 不交互（共享参数但独立计算）。
    
- **参数共享**：所有位置使用相同的 $W_1, W_2, b_1, b_2$。
    

### 7.2 维度变换（程序执行视角）

假设 $d_{model} = 512$，$d_{ff} = 2048$，序列长度 $n = 10$。

**Step 1: 第一层线性变换 + 激活**

$$H = \text{ReLU}(X W_1 + b_1)$$

- **输入**：$X \in \mathbb{R}^{10 \times 512}$
    
- **权重**：$W_1 \in \mathbb{R}^{512 \times 2048}$
    
- **输出**：$H \in \mathbb{R}^{10 \times 2048}$
    

**观察**：维度**扩张**了 4 倍（$512 \to 2048$）。

**Step 2: 第二层线性变换**

$$\text{FFN}(X) = H W_2 + b_2$$

- **输入**：$H \in \mathbb{R}^{10 \times 2048}$
    
- **权重**：$W_2 \in \mathbb{R}^{2048 \times 512}$
    
- **输出**：$\mathbb{R}^{10 \times 512}$（恢复到原始维度）
    

**形状变化总结**：

$$[n, d_{model}] \xrightarrow{W_1} [n, 4d_{model}] \xrightarrow{W_2} [n, d_{model}]$$

这种"**扩张-压缩**"的结构被称为 **Bottleneck** 的反向设计（先扩张再压缩）。

### 7.3 为什么要 4 倍扩张？（因果解释）

#### 角度一：表达能力（Expressiveness）

**问题**：如果 FFN 只是 $X W + b$（不扩张），会怎样？

- 这等价于一个线性变换。
    
- 即使堆叠多层，$W_3(W_2(W_1 X))$ 仍然等价于一个大的线性变换 $W_{combined} X$。
    

**结论**：**没有非线性激活和维度扩张，深层网络没有意义**。

#### 角度二：特征解耦（Feature Disentanglement）

- **低维空间**（$d_{model} = 512$）：信息密集，不同特征混杂在一起。
    
- **高维空间**（$d_{ff} = 2048$）：维度增加后，特征更容易分离。
    

**类比**：就像把压缩文件解压到一个大文件夹里，方便查找和编辑特定内容。

#### 角度三：计算效率（Efficiency）

**疑问**：为什么不直接用一个 $512 \times 512$ 的更深的网络？

**答案**：

- **参数量对比**：
    
    - 方案 A（2 层，有扩张）：$512 \times 2048 + 2048 \times 512 \approx 2.1M$ 参数。
        
    - 方案 B（4 层，无扩张）：$4 \times (512 \times 512) \approx 1.0M$ 参数。
        
- 虽然方案 A 参数更多，但**深度学习的经验**表明：
    
    - **宽而浅**（Wide & Shallow）的网络比**窄而深**（Narrow & Deep）的网络更容易训练（梯度流动更稳定）。
        
    - FFN 只有 2 层，梯度路径短，不易梯度消失。
        

#### 角度四：激活函数的"筛选"作用

ReLU 激活函数：

$$\text{ReLU}(x) = \max(0, x)$$

**特性**：

- **稀疏激活**：大约 50% 的神经元输出为 0（负值被"杀死"）。
    
- **选择性放大**：只有"有用"的特征（正值）被保留和传递。
    

**因果链条**：

1. 第一层 $W_1$ 将输入投影到 2048 维的特征空间。
    
2. ReLU 对这 2048 个特征进行"筛选"（一半变成 0）。
    
3. 第二层 $W_2$ 将剩余的"有用特征"组合回 512 维。
    

**结论**：扩张提供了"试错空间"，ReLU 提供了"筛选机制"，最终压缩回去的是"精华"。

### 7.4 为什么选择 ReLU？（激活函数对比）

| 激活函数       | 公式                                      | 优点               | 缺点              | Transformer 使用 |
| -------------- | ----------------------------------------- | ------------------ | ----------------- | ---------------- |
| **ReLU**       | $\max(0, x)$                              | 简单、快速、稀疏   | Dead ReLU 问题    | 原始 Transformer |
| **GELU**       | $x \cdot \Phi(x)$（高斯累积分布函数）     | 平滑、性能更好     | 计算稍慢          | BERT, GPT        |
| **Swish/SiLU** | $x \cdot \sigma(x)$                       | 平滑、自门控       | 计算成本          | 部分现代模型     |
| **Sigmoid**    | $\frac{1}{1+e^{-x}}$                      | 平滑               | 梯度消失严重      | 几乎不用         |
| **Tanh**       | $\frac{e^x - e^{-x}}{e^x + e^{-x}}$       | 零中心化           | 梯度消失          | 很少用           |

**原始 Transformer 选择 ReLU 的原因**：

1. **2017 年的最佳实践**：ReLU 是当时 CV 和 NLP 的标配。
    
2. **计算效率**：ReLU 只是一个 `max(0, x)` 操作，极其高效。
    

**现代改进**：

- **BERT/GPT**：使用 **GELU** (Gaussian Error Linear Unit)。
    
    - GELU 比 ReLU 更平滑（可导处处连续），实验效果更好。
        
    - 公式：$\text{GELU}(x) = x \cdot \Phi(x)$，其中 $\Phi(x)$ 是标准正态分布的累积分布函数。
        
- **Llama/PaLM**：使用 **SwiGLU** (Swish-Gated Linear Unit)。
    
    - 结合了 Swish 激活和门控机制（Gating）。
        

### 7.5 梯度流向（反向传播视角）

#### 前向传播

$$H = \text{ReLU}(X W_1 + b_1) \quad \text{(形状: [n, 2048])}$$

$$O = H W_2 + b_2 \quad \text{(形状: [n, 512])}$$

#### 反向传播

假设我们有梯度 $\frac{\partial L}{\partial O}$（来自后续层）。

**Step 1: 对** $W_2$ **的梯度**

$$\frac{\partial L}{\partial W_2} = H^T \cdot \frac{\partial L}{\partial O} \quad \text{(形状: [2048, 512])}$$

**Step 2: 对** $H$ **的梯度**

$$\frac{\partial L}{\partial H} = \frac{\partial L}{\partial O} \cdot W_2^T \quad \text{(形状: [n, 2048])}$$

**Step 3: ReLU 的梯度**

$$\frac{\partial \text{ReLU}(z)}{\partial z} = \begin{cases} 1 & \text{if } z > 0 \\ 0 & \text{if } z \le 0 \end{cases}$$

**逐元素相乘**（Hadamard Product）：

$$\frac{\partial L}{\partial (XW_1 + b_1)} = \frac{\partial L}{\partial H} \odot \mathbb{1}_{XW_1+b_1 > 0}$$

其中 $\mathbb{1}_{XW_1+b_1 > 0}$ 是一个 0/1 掩码（Mask）。

**Step 4: 对** $W_1$ **的梯度**

$$\frac{\partial L}{\partial W_1} = X^T \cdot \frac{\partial L}{\partial (XW_1 + b_1)} \quad \text{(形状: [512, 2048])}$$

#### 梯度"死亡"问题（Dead ReLU）

**现象**：如果 $X W_1 + b_1$ 的某个神经元总是负数，ReLU 输出恒为 0，梯度恒为 0。

**后果**：

- 这个神经元**永远不会更新**（$\frac{\partial L}{\partial W_1}$ 对应列为 0）。
    
- 如果大量神经元"死亡"，模型容量下降。
    

**缓解方法**：

1. **Leaky ReLU**：$\text{LeakyReLU}(x) = \max(0.01x, x)$（负值不完全归零）。
    
2. **GELU/SwiGLU**：没有"硬截断"，所有区域都有梯度。
    
3. **合理的初始化**（如 He Initialization）：减少初始时负值的概率。
    

### 7.6 FFN 在整个 Transformer Layer 中的位置

一个完整的 Transformer Encoder Layer 的结构是：

```
输入 X
  ↓
Multi-Head Attention  ← (Token 之间交互)
  ↓
Add & Norm (残差 + LayerNorm)
  ↓
Feed-Forward Network  ← (每个 Token 独立处理)
  ↓
Add & Norm (残差 + LayerNorm)
  ↓
输出
```

**分工**：

- **Attention**：负责"社交"（Token 之间信息交换）。
    
- **FFN**：负责"思考"（每个 Token 独立处理信息）。
    

### 7.7 代码实现（PyTorch）

```python
import torch
import torch.nn as nn

class FeedForward(nn.Module):
    def __init__(self, d_model, d_ff, dropout=0.1):
        """
        前馈网络
        
        Args:
            d_model: 模型维度 (如 512)
            d_ff: FFN 中间层维度 (如 2048, 通常是 4 * d_model)
            dropout: Dropout 概率
        """
        super().__init__()
        
        # 第一层：d_model -> d_ff
        self.linear1 = nn.Linear(d_model, d_ff)
        
        # 激活函数
        self.activation = nn.ReLU()  # 或 nn.GELU()
        
        # Dropout
        self.dropout = nn.Dropout(dropout)
        
        # 第二层：d_ff -> d_model
        self.linear2 = nn.Linear(d_ff, d_model)
    
    def forward(self, x):
        """
        前向传播
        
        Args:
            x: [batch_size, seq_len, d_model]
        
        Returns:
            [batch_size, seq_len, d_model]
        """
        # 第一层 + 激活
        x = self.linear1(x)          # [batch, seq_len, d_ff]
        x = self.activation(x)       # [batch, seq_len, d_ff]
        x = self.dropout(x)          # [batch, seq_len, d_ff]
        
        # 第二层
        x = self.linear2(x)          # [batch, seq_len, d_model]
        
        return x

# 使用示例
d_model = 512
d_ff = 2048
batch_size = 2
seq_len = 10

ffn = FeedForward(d_model, d_ff)
x = torch.randn(batch_size, seq_len, d_model)

output = ffn(x)
print(f"输入形状: {x.shape}")       # [2, 10, 512]
print(f"输出形状: {output.shape}")  # [2, 10, 512]

# 参数量统计
total_params = sum(p.numel() for p in ffn.parameters())
print(f"FFN 总参数量: {total_params:,}")  # 约 2.1M
```

**参数量计算**：

- $W_1$: $512 \times 2048 = 1,048,576$
    
- $b_1$: $2048$
    
- $W_2$: $2048 \times 512 = 1,048,576$
    
- $b_2$: $512$
    
- **总计**：$\approx 2.1M$ 参数
    

**观察**：在整个 Transformer 模型中，FFN 的参数量占比约 **2/3**（Attention 只占 1/3）。

### 7.8 现代变体：GLU 系列

**GLU (Gated Linear Unit)** 是一种改进的 FFN 结构，被 Llama、PaLM 等现代 LLM 广泛采用。

#### 结构对比

**原始 FFN**：

$$\text{FFN}(x) = W_2 \cdot \text{ReLU}(W_1 x) + b_2$$

**GLU 变体（SwiGLU）**：

$$\text{SwiGLU}(x) = (W_1 x \odot \text{Swish}(W_g x)) W_2$$

其中：

- $W_g$ 是一个额外的"门控"权重矩阵。
    
- $\odot$ 是逐元素乘法（Hadamard Product）。
    
- $\text{Swish}(x) = x \cdot \sigma(x)$。
    

**核心思想**：

- 一部分神经元负责"内容"（$W_1 x$）。
    
- 另一部分神经元负责"门控"（$\text{Swish}(W_g x)$），决定哪些内容应该被保留。
    

**优势**：

- 实验表明 SwiGLU 在相同参数量下性能优于 ReLU/GELU。
    
- Llama 2 的 FFN 就使用 SwiGLU。
    

### 📊 面试考点

#### Q1: FFN 的作用是什么？为什么 Attention 之后还需要 FFN？

**A**: Attention 负责 Token 之间的信息聚合（"社交"），但它本质上是加权求和，是线性操作。FFN 提供了**非线性变换能力**，让每个 Token 能够独立地处理聚合后的信息（"思考"）。没有 FFN，模型的表达能力会严重受限。

#### Q2: 为什么 FFN 要扩张到 4 倍维度？

**A**: 三个原因：

1. **表达能力**：低维空间特征混杂，高维空间更容易解耦不同特征。
    
2. **非线性**：扩张后接 ReLU，提供了"试错空间"（2048 个特征）和"筛选机制"（ReLU 杀掉负值），最终压缩回去的是精华。
    
3. **效率**：2 层宽网络比多层窄网络更容易训练（梯度路径短）。
    

#### Q3: Position-wise 是什么意思？

**A**: FFN 对每个位置的 Token **独立应用**，不同位置之间不交互（但共享参数 $W_1, W_2$）。这意味着：

- 第 1 个词的 FFN 输入只依赖第 1 个词的 Attention 输出。
    
- 实现上可以将 $[batch, seq\_len, d]$ reshape 成 $[batch \times seq\_len, d]$ 然后一次性计算。
    

#### Q4: FFN 和 Attention 的参数量对比？

**A**: 在标准 Transformer 中（$d_{model}=512$, $d_{ff}=2048$）：

- **Attention**: $4 \times (512 \times 512) \approx 1.0M$（$W_Q, W_K, W_V, W_O$）
    
- **FFN**: $2 \times (512 \times 2048) \approx 2.1M$
    

**结论**：FFN 的参数量约是 Attention 的 **2 倍**，占整个 Transformer Layer 的 **2/3**。

#### Q5: (Hard) Dead ReLU 问题如何影响训练？

**A**: 如果 $X W_1 + b_1$ 的某个神经元在所有样本上都输出负值，ReLU 会使其恒为 0。此时：

- **前向传播**：该神经元对输出无贡献。
    
- **反向传播**：梯度恒为 0（$\frac{\partial \text{ReLU}}{\partial z} = 0$ when $z < 0$），参数无法更新。
    

**缓解**：

1. 使用 Leaky ReLU / GELU（没有"硬零"）。
    
2. 合理初始化（He Init）。
    
3. 使用 Batch Normalization / Layer Normalization。
    

#### Q6: 为什么现代 LLM（如 Llama）用 SwiGLU 代替 ReLU？

**A**: SwiGLU 结合了门控机制（Gating）和平滑激活（Swish）：

1. **门控**：部分神经元决定"通过多少信息"，而不是 ReLU 的"全通过或全阻断"。
    
2. **平滑**：Swish 处处可导，梯度流动更稳定。
    
3. **实验验证**：在相同参数量下，SwiGLU 的性能持续优于 ReLU/GELU（见 PaLM、Llama 论文）。
    


## 8. 层归一化 (Layer Normalization)：训练稳定的"守护神"

深度神经网络训练的最大敌人之一是**梯度爆炸/消失**和**内部协变量偏移 (Internal Covariate Shift)**。Layer Normalization 就是为了解决这些问题而生的。

### 8.1 问题提出：为什么需要归一化？

#### 现象：内部协变量偏移

在深度网络中，每一层的输入分布会随着前面层参数的更新而不断变化。

**具体例子**：

- **第 1 轮训练后**：第 3 层的输入分布是 $\mathcal{N}(0, 1)$（均值 0，方差 1）。
    
- **第 100 轮训练后**：由于前两层的参数更新，第 3 层的输入分布变成了 $\mathcal{N}(5, 100)$（均值漂移，方差爆炸）。
    

**后果**：

1. **梯度不稳定**：激活函数（如 Sigmoid）对输入范围敏感。输入过大/过小都会导致梯度接近 0。
    
2. **学习效率低**：每层都要不断适应变化的输入分布，学习变慢。
    

#### 解决方案：归一化（Normalization）

**核心思想**：在每一层之后，强制将激活值"拉回"到一个稳定的分布（通常是均值 0、方差 1）。

### 8.2 Layer Norm vs Batch Norm（符号定义）

在介绍 Layer Norm 之前，先对比 Batch Norm，理解"归一化维度"的区别。

#### 符号定义

- $X \in \mathbb{R}^{B \times T \times D}$：输入张量。
    
    - $B$：Batch Size（一批有多少个样本）。
        
    - $T$：Sequence Length（序列长度，Token 数）。
        
    - $D$：Feature Dimension（特征维度，如 512）。
        
- $X[b, t, d]$：第 $b$ 个样本、第 $t$ 个位置、第 $d$ 个特征的数值。
    

#### Batch Normalization (BN)

**归一化维度**：对每个特征维度 $d$，**跨 Batch** 计算均值和方差。

$$\mu_d = \frac{1}{B \times T} \sum_{b=1}^B \sum_{t=1}^T X[b, t, d]$$

$$\sigma_d^2 = \frac{1}{B \times T} \sum_{b=1}^B \sum_{t=1}^T (X[b, t, d] - \mu_d)^2$$

$$\hat{X}[b, t, d] = \frac{X[b, t, d] - \mu_d}{\sqrt{\sigma_d^2 + \epsilon}}$$

**问题**：

1. **依赖 Batch Size**：如果 $B=1$（单样本推理），无法计算统计量。
    
2. **序列长度敏感**：不同样本的序列长度可能不同（Padding），统计量不准确。
    
3. **不适合 NLP**：语言序列的 Token 之间相关性强，跨样本统计没意义。
    

#### Layer Normalization (LN)

**归一化维度**：对每个样本的每个位置，**跨特征维度** 计算均值和方差。

$$\mu[b, t] = \frac{1}{D} \sum_{d=1}^D X[b, t, d]$$

$$\sigma^2[b, t] = \frac{1}{D} \sum_{d=1}^D (X[b, t, d] - \mu[b, t])^2$$

$$\hat{X}[b, t, d] = \frac{X[b, t, d] - \mu[b, t]}{\sqrt{\sigma^2[b, t] + \epsilon}}$$

**关键特性**：

- **独立于 Batch**：每个样本单独归一化，$B=1$ 也没问题。
    
- **独立于序列长度**：每个位置单独归一化。
    
- **适合 Transformer**：归一化的是"特征维度"（词向量的 512 个分量），符合 NLP 语义。
    

### 8.3 公式推导（程序执行视角）

#### Step-by-Step 计算

假设我们有一个简化的输入：

- $B = 1$（单个样本）
    
- $T = 2$（两个 Token："猫"和"鱼"）
    
- $D = 4$（4 维特征）
    

输入矩阵：

$$X = \begin{bmatrix} 1 & 2 & 3 & 4 \\ 5 & 6 & 7 & 8 \end{bmatrix} \quad \text{(形状: [2, 4])}$$

**Step 1: 计算每个 Token 的均值**

$$\mu[0] = \frac{1 + 2 + 3 + 4}{4} = 2.5$$

$$\mu[1] = \frac{5 + 6 + 7 + 8}{4} = 6.5$$

**Step 2: 计算每个 Token 的方差**

$$\sigma^2[0] = \frac{(1-2.5)^2 + (2-2.5)^2 + (3-2.5)^2 + (4-2.5)^2}{4} = 1.25$$

$$\sigma^2[1] = \frac{(5-6.5)^2 + (6-6.5)^2 + (7-6.5)^2 + (8-6.5)^2}{4} = 1.25$$

$$\sigma[0] = \sigma[1] = \sqrt{1.25} \approx 1.118$$

**Step 3: 归一化**

$$\hat{X}[0, :] = \frac{[1, 2, 3, 4] - 2.5}{1.118} \approx [-1.34, -0.45, 0.45, 1.34]$$

$$\hat{X}[1, :] = \frac{[5, 6, 7, 8] - 6.5}{1.118} \approx [-1.34, -0.45, 0.45, 1.34]$$

**观察**：

- 每个 Token 的特征被归一化到**均值 0、方差 1**。
    
- 不同 Token 的归一化是**独立**的（不相互影响）。
    

#### Step 4: 可学习参数（Scale & Shift）

纯归一化会丢失原始数据的分布信息。为了保留表达能力，引入两个可学习参数：

- $\gamma \in \mathbb{R}^D$（Scale，缩放）
    
- $\beta \in \mathbb{R}^D$（Shift，平移）
    

**最终输出**：

$$Y[b, t, d] = \gamma_d \cdot \hat{X}[b, t, d] + \beta_d$$

**物理意义**：

- 如果 $\gamma = [\sigma_1, \sigma_2, ..., \sigma_D]$，$\beta = [\mu_1, \mu_2, ..., \mu_D]$（即学习回原始的均值和方差），Layer Norm 就相当于**恒等映射**（Identity），不改变输入。
    
- 模型可以通过学习 $\gamma, \beta$ 来决定"要不要归一化"以及"归一化到什么程度"。
    

### 8.4 梯度流向（为什么能稳定训练？）

#### 反向传播推导

假设我们有梯度 $\frac{\partial L}{\partial Y}$。

**Step 1: 对** $\gamma, \beta$ **的梯度**（简单）

$$\frac{\partial L}{\partial \gamma_d} = \sum_{b,t} \frac{\partial L}{\partial Y[b,t,d]} \cdot \hat{X}[b,t,d]$$

$$\frac{\partial L}{\partial \beta_d} = \sum_{b,t} \frac{\partial L}{\partial Y[b,t,d]}$$

**Step 2: 对** $\hat{X}$ **的梯度**

$$\frac{\partial L}{\partial \hat{X}[b,t,d]} = \frac{\partial L}{\partial Y[b,t,d]} \cdot \gamma_d$$

**Step 3: 对** $X$ **的梯度**（复杂，涉及链式法则）

这一步需要考虑 $\mu$ 和 $\sigma$ 对 $X$ 的依赖：

$$\frac{\partial L}{\partial X[b,t,d]} = \frac{\partial L}{\partial \hat{X}[b,t,d]} \cdot \frac{\partial \hat{X}[b,t,d]}{\partial X[b,t,d]} + \frac{\partial L}{\partial \mu[b,t]} \cdot \frac{\partial \mu[b,t]}{\partial X[b,t,d]} + \frac{\partial L}{\partial \sigma[b,t]} \cdot \frac{\partial \sigma[b,t]}{\partial X[b,t,d]}$$

**关键性质**：

$$\frac{\partial \hat{X}}{\partial X} = \frac{1}{\sigma}$$

由于归一化使得 $\sigma \approx 1$（固定），**梯度的尺度被稳定在 1 附近**，不会随着网络深度指数级衰减或爆炸。

#### 因果链条：为什么能缓解梯度消失？

1. **前向传播**：Layer Norm 强制每层的激活值保持在合理范围（均值 0、方差 1）。
    
2. **激活函数**：输入范围稳定 → 激活函数（如 ReLU、GELU）工作在梯度敏感区 → 梯度不会饱和。
    
3. **反向传播**：梯度通过 $\frac{1}{\sigma}$ 项，尺度被"重新缩放"到 1 附近 → 多层累积后不会衰减到 0。
    

### 8.5 Pre-Norm vs Post-Norm（Transformer 架构选择）

在 Transformer 中，Layer Norm 的位置有两种方案。

#### Post-Norm（原始 Transformer, 2017）

```
X
  ↓
Attention / FFN
  ↓
Add (Residual)
  ↓
LayerNorm  ← 在残差之后
  ↓
输出
```

公式：

$$X_{out} = \text{LayerNorm}(X + \text{Sublayer}(X))$$

#### Pre-Norm（现代 Transformer，如 GPT、Llama）

```
X
  ↓
LayerNorm  ← 在子层之前
  ↓
Attention / FFN
  ↓
Add (Residual)
  ↓
输出
```

公式：

$$X_{out} = X + \text{Sublayer}(\text{LayerNorm}(X))$$

#### 对比表

| 特性           | Post-Norm                  | Pre-Norm                 |
| -------------- | -------------------------- | ------------------------ |
| **梯度稳定性** | 较差（深层网络难训练）     | 较好（更稳定）           |
| **学习率**     | 需要 Warmup（小心调参）    | 可以用更大学习率         |
| **最终性能**   | 理论上可能更好（充分训练） | 稍逊，但训练更稳定       |
| **应用**       | 原始 Transformer, BERT     | GPT-2/3, Llama, T5       |

#### 为什么 Pre-Norm 更稳定？

**关键观察**：

- **Post-Norm**：残差路径经过 Layer Norm。如果残差值很大，Layer Norm 会"削弱"它。
    
- **Pre-Norm**：残差路径**直接绕过** Layer Norm（恒等映射），梯度可以无阻碍地回流。
    

**数学直觉**：

在 Pre-Norm 中，梯度可以通过"干净的"残差路径直达底层，不受 Layer Norm 的非线性影响。这相当于给每一层提供了一条"梯度高速公路"。

#### 实践建议

- **大模型（>10 层）**：优先用 Pre-Norm（GPT-3、Llama 都是）。
    
- **小模型（<6 层）**：Post-Norm 也可以，但需要仔细调学习率。
    
- **从头训练**：Pre-Norm 更省心。
    
- **Fine-tuning**：两者差异不大。
    

### 8.6 代码实现（PyTorch）

```python
import torch
import torch.nn as nn

class LayerNorm(nn.Module):
    def __init__(self, features, eps=1e-6):
        """
        层归一化
        
        Args:
            features: 特征维度 D (如 512)
            eps: 防止除零的小常数
        """
        super().__init__()
        # 可学习参数
        self.gamma = nn.Parameter(torch.ones(features))   # Scale
        self.beta = nn.Parameter(torch.zeros(features))   # Shift
        self.eps = eps
    
    def forward(self, x):
        """
        前向传播
        
        Args:
            x: [batch_size, seq_len, features]
        
        Returns:
            [batch_size, seq_len, features]
        """
        # 计算均值（在最后一个维度上）
        mean = x.mean(dim=-1, keepdim=True)  # [batch, seq_len, 1]
        
        # 计算方差
        var = x.var(dim=-1, keepdim=True, unbiased=False)  # [batch, seq_len, 1]
        
        # 归一化
        x_norm = (x - mean) / torch.sqrt(var + self.eps)  # [batch, seq_len, features]
        
        # Scale & Shift
        output = self.gamma * x_norm + self.beta  # [batch, seq_len, features]
        
        return output

# 使用示例
batch_size = 2
seq_len = 10
d_model = 512

ln = LayerNorm(d_model)
x = torch.randn(batch_size, seq_len, d_model)

output = ln(x)

# 验证归一化效果（对于第一个样本的第一个 Token）
print(f"归一化前均值: {x[0, 0, :].mean():.4f}")       # 随机值
print(f"归一化前方差: {x[0, 0, :].var():.4f}")        # 随机值
print(f"归一化后均值: {output[0, 0, :].mean():.4f}")  # 接近 0
print(f"归一化后方差: {output[0, 0, :].var():.4f}")   # 接近 1
```

**形状注解**：

```python
x:              [batch, seq_len, features]
mean:           [batch, seq_len, 1]        # keepdim=True 保持维度
var:            [batch, seq_len, 1]
x_norm:         [batch, seq_len, features]
gamma, beta:    [features]                 # 广播到 [batch, seq_len, features]
output:         [batch, seq_len, features]
```

### 📊 面试考点

#### Q1: Layer Norm 和 Batch Norm 的区别？

**A**: 

| 特性           | Batch Norm               | Layer Norm              |
| -------------- | ------------------------ | ----------------------- |
| **归一化维度** | 跨样本（Batch）          | 跨特征（Feature）       |
| **依赖 Batch** | 是（训练/推理不一致）    | 否（单样本也可用）      |
| **适用领域**   | CNN（图像）              | Transformer（NLP）      |
| **序列长度**   | 敏感（需要 Padding 对齐） | 不敏感（每位置独立）    |

**原因**：NLP 的序列是"时间相关"的，跨样本统计没意义。而图像的像素是"空间独立"的，跨样本统计有效。

#### Q2: 为什么需要 $\gamma$ 和 $\beta$？

**A**: 纯归一化（均值 0、方差 1）会丢失原始数据的分布信息。$\gamma$ 和 $\beta$ 让模型可以**学习最优的分布**：

- 如果学到 $\gamma = \text{原始std}, \beta = \text{原始mean}$，Layer Norm 变成恒等映射（不改变输入）。
    
- 模型可以自适应决定"归一化到什么程度"。
    

#### Q3: Pre-Norm 和 Post-Norm 的区别？为什么 GPT 用 Pre-Norm？

**A**: 

**Post-Norm**：$\text{LayerNorm}(X + \text{Sublayer}(X))$

**Pre-Norm**：$X + \text{Sublayer}(\text{LayerNorm}(X))$

**差异**：

1. **梯度路径**：Pre-Norm 的残差路径绕过 Layer Norm，梯度可以直达底层（"高速公路"）。
    
2. **训练稳定性**：Pre-Norm 更稳定，可以用更大学习率，适合深层网络（GPT-3 有 96 层）。
    
3. **性能**：Post-Norm 理论上可能更好，但难训练（需要 Warmup、小学习率）。
    

**结论**：现代 LLM（GPT、Llama）都用 Pre-Norm，因为稳定性 > 微小的性能差异。

#### Q4: (Hard) Layer Norm 如何缓解梯度消失？

**A**: 

**问题根源**：深层网络中，梯度 $\frac{\partial L}{\partial X_0}$ 是多个 Jacobian 矩阵的连乘：

$$\frac{\partial L}{\partial X_0} = \frac{\partial L}{\partial X_L} \cdot \frac{\partial X_L}{\partial X_{L-1}} \cdots \frac{\partial X_1}{\partial X_0}$$

如果每个 $\frac{\partial X_{i+1}}{\partial X_i}$ 的特征值 < 1，连乘后梯度趋于 0。

**Layer Norm 的作用**：

1. **前向**：归一化使激活值保持在 $[-1, 1]$ 范围 → 激活函数不饱和 → $\frac{\partial \text{activation}}{\partial z} \approx 1$。
    
2. **反向**：$\frac{\partial \hat{X}}{\partial X} = \frac{1}{\sigma}$，由于 $\sigma \approx 1$，梯度尺度稳定。
    
3. **残差**：结合残差连接（下一章），梯度可以通过"干净的"捷径回流。
    

**数学直觉**：Layer Norm 把每层的 Jacobian 矩阵的特征值"拉回" 1 附近，防止连乘时指数衰减。

#### Q5: 为什么 Transformer 用 Layer Norm 而不是 Batch Norm？

**A**: 三个关键原因：

1. **推理时 Batch=1**：Batch Norm 在推理时需要用训练时的统计量（Running Mean/Var），但 NLP 任务常是单样本推理。
    
2. **序列长度可变**：不同句子长度不同，Batch Norm 需要 Padding 对齐，引入噪声。
    
3. **语义独立性**：每个 Token 的特征维度（512 维向量）是一个完整的语义单元，跨特征归一化更合理。跨样本统计会混合不同句子的语义，没意义。
    


## 9. 残差连接 (Residual Connection)：梯度的"高速公路"

残差连接是深度学习历史上最重要的发明之一（ResNet, 2015）。它解决了一个困扰研究者多年的问题：**为什么深层网络训练效果反而比浅层差？**

### 9.1 问题提出：深层网络的退化问题

#### 反直觉现象

理论上，深层网络的表达能力 ≥ 浅层网络（多余的层可以学成恒等映射）。

但实验发现：

- **20 层网络**：训练误差 15%
    
- **56 层网络**：训练误差 25%（更深反而更差！）
    

**这不是过拟合**（训练误差也更高），而是**优化困难**（梯度消失导致无法训练）。

#### 梯度消失的数学本质

假设我们有一个 $L$ 层的网络：

$$X_l = f(X_{l-1}) = \sigma(W_l X_{l-1})$$

反向传播时，梯度是连乘：

$$\frac{\partial L}{\partial X_0} = \frac{\partial L}{\partial X_L} \cdot \prod_{l=1}^L \frac{\partial X_l}{\partial X_{l-1}}$$

如果每层的 Jacobian 矩阵 $\frac{\partial X_l}{\partial X_{l-1}}$ 的最大特征值 < 1（常见于 Sigmoid、Tanh），连乘 $L$ 次后：

$$\left\| \frac{\partial L}{\partial X_0} \right\| \approx 0.9^{50} \approx 0.005$$

**结果**：底层几乎收不到梯度，参数无法更新。

### 9.2 残差连接的数学定义

#### 符号定义

- $X \in \mathbb{R}^{n \times d}$：子层的输入。
    
- $F(X)$：子层的输出（Attention 或 FFN）。
    
- $Y \in \mathbb{R}^{n \times d}$：残差连接后的输出。
    

#### 公式定义

**没有残差**（传统深度网络）：

$$Y = F(X)$$

**有残差**（ResNet / Transformer）：

$$Y = X + F(X)$$

**物理意义**：

- $X$：原始信息（恒等映射，Identity Mapping）。
    
- $F(X)$：学习到的"增量"（Residual）。
    
- $Y$：原始信息 + 新学到的信息。
    

**关键思想**：不要让网络学习**从头到尾的完整映射** $H(X)$，而是学习**在原有基础上的改进** $F(X) = H(X) - X$。

### 9.3 为什么残差能缓解梯度消失？（梯度流向分析）

#### 前向传播

$$Y = X + F(X)$$

#### 反向传播

假设我们有梯度 $\frac{\partial L}{\partial Y}$。

对 $X$ 求导（链式法则）：

$$\frac{\partial L}{\partial X} = \frac{\partial L}{\partial Y} \cdot \frac{\partial Y}{\partial X}$$

计算 $\frac{\partial Y}{\partial X}$：

$$\frac{\partial Y}{\partial X} = \frac{\partial (X + F(X))}{\partial X} = I + \frac{\partial F(X)}{\partial X}$$

其中 $I$ 是**单位矩阵**（恒等映射的导数）。

**关键结论**：

$$\frac{\partial L}{\partial X} = \frac{\partial L}{\partial Y} \cdot \left( I + \frac{\partial F(X)}{\partial X} \right)$$

**分解成两条路径**：

1. **捷径路径**（Shortcut）：$\frac{\partial L}{\partial Y} \cdot I = \frac{\partial L}{\partial Y}$
    
    - 梯度**直接传递**，无衰减！
        
2. **残差路径**：$\frac{\partial L}{\partial Y} \cdot \frac{\partial F(X)}{\partial X}$
    
    - 梯度通过子层 $F$，可能衰减。
        

#### 多层堆叠的梯度

对于 $L$ 层残差网络：

$$X_l = X_{l-1} + F_l(X_{l-1})$$

梯度回传：

$$\frac{\partial L}{\partial X_0} = \frac{\partial L}{\partial X_L} \cdot \prod_{l=1}^L \left( I + \frac{\partial F_l}{\partial X_{l-1}} \right)$$

**展开**：

$$= \frac{\partial L}{\partial X_L} \cdot \left( I + \sum_{l=1}^L \frac{\partial F_l}{\partial X_{l-1}} + \text{高阶项} \right)$$

**核心观察**：

- 即使所有 $\frac{\partial F_l}{\partial X_{l-1}} \approx 0$（子层梯度消失），**仍有一条"干净的"路径** $I$ 直达底层。
    
- **类比**：传统网络的梯度是"连乘"（相乘），残差网络的梯度是"连加"（相加）。
    

$$\text{传统}: \quad 0.9 \times 0.9 \times \cdots \times 0.9 \approx 0$$

$$\text{残差}: \quad 1 + 0.1 + 0.1 + \cdots + 0.1 \approx \text{可观的数值}$$

### 9.4 Transformer 中的残差结构

#### 完整的 Transformer Sub-Layer

```
输入 X
  ↓
LayerNorm (Pre-Norm) 或跳过 (Post-Norm)
  ↓
Attention / FFN  → F(X)
  ↓
Add (残差连接): X + F(X)
  ↓
LayerNorm (Post-Norm) 或跳过 (Pre-Norm)
  ↓
输出 Y
```

**Pre-Norm 版本**（GPT、Llama）：

$$Y = X + F(\text{LayerNorm}(X))$$

**Post-Norm 版本**（原始 Transformer）：

$$Y = \text{LayerNorm}(X + F(X))$$

#### 维度要求（面试常问）

**关键约束**：$X$ 和 $F(X)$ 必须**形状完全相同**才能相加。

$$X: [batch, seq\_len, d_{model}], \quad F(X): [batch, seq\_len, d_{model}]$$

**如果维度不匹配怎么办？**

- **问题**：如果 $F$ 内部改变了维度（如 FFN 中间层是 $4d$），怎么办？
    
- **答案**：$F$ 的**输出**必须投影回 $d_{model}$（如 FFN 的第二层 $W_2: 4d \to d$）。
    

**Projection Shortcut**（ResNet 中的做法）：

如果输入输出维度确实不匹配，可以给残差路径加一个线性投影：

$$Y = W_s X + F(X)$$

但 Transformer 中**不需要**，因为每个子层都设计成了"输入输出同维度"。

### 9.5 为什么残差"允许"网络学习恒等映射？

#### 恒等映射的重要性

理论上，深层网络应该能学到浅层网络的解（多余的层学成恒等映射）。

**传统网络**：

要学恒等映射 $H(X) = X$，网络需要学习：

$$W = I, \quad b = 0$$

这在优化过程中**极其困难**（需要精确到达特定参数值）。

**残差网络**：

要学恒等映射 $Y = X$，只需要：

$$F(X) = 0$$

这在优化中**非常简单**（$W \to 0$ 或 Dropout 就能做到）。

**因果链条**：

1. 初始化时，$F(X) \approx 0$（接近恒等映射）。
    
2. 训练开始，如果某层"没学到有用的东西"，$F(X)$ 保持接近 0，不会破坏前面层的结果。
    
3. 如果某层"学到了有用的信息"，$F(X)$ 逐渐偏离 0，为输出贡献增量。
    

**结论**：残差连接给网络提供了一个"安全的默认选项"（恒等映射），降低了优化难度。

### 9.6 数值演示（程序执行视角）

假设我们有一个 3 层网络，每层的子层函数 $F_l$ 会使梯度衰减为原来的 0.5 倍。

#### 传统网络的梯度

$$\frac{\partial L}{\partial X_0} = \frac{\partial L}{\partial X_3} \cdot 0.5 \cdot 0.5 \cdot 0.5 = 0.125 \cdot \frac{\partial L}{\partial X_3}$$

**结果**：梯度衰减到 **12.5%**。

#### 残差网络的梯度

$$\frac{\partial L}{\partial X_0} = \frac{\partial L}{\partial X_3} \cdot (1 + 0.5) \cdot (1 + 0.5) \cdot (1 + 0.5) = 3.375 \cdot \frac{\partial L}{\partial X_3}$$

（这里简化了，实际是 $I + \frac{\partial F}{\partial X}$，取了期望情况）

**更准确的分析**：

即使 $\frac{\partial F_l}{\partial X_{l-1}} = 0$（最坏情况），仍有：

$$\frac{\partial L}{\partial X_0} = \frac{\partial L}{\partial X_3} \cdot 1 \cdot 1 \cdot 1 = \frac{\partial L}{\partial X_3}$$

**结果**：梯度**完全不衰减**！

### 9.7 代码实现（PyTorch）

```python
import torch
import torch.nn as nn

class TransformerBlock(nn.Module):
    def __init__(self, d_model, num_heads, d_ff, dropout=0.1, pre_norm=True):
        """
        Transformer Encoder Block with Residual Connections
        
        Args:
            d_model: 模型维度
            num_heads: 多头注意力头数
            d_ff: FFN 中间层维度
            dropout: Dropout 概率
            pre_norm: True 使用 Pre-Norm, False 使用 Post-Norm
        """
        super().__init__()
        
        self.pre_norm = pre_norm
        
        # Multi-Head Attention
        self.attention = nn.MultiheadAttention(d_model, num_heads, dropout=dropout, batch_first=True)
        
        # Feed-Forward Network
        self.ffn = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(d_ff, d_model)
        )
        
        # Layer Normalization
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        
        # Dropout
        self.dropout1 = nn.Dropout(dropout)
        self.dropout2 = nn.Dropout(dropout)
    
    def forward(self, x, mask=None):
        """
        前向传播
        
        Args:
            x: [batch_size, seq_len, d_model]
            mask: Attention Mask (可选)
        
        Returns:
            [batch_size, seq_len, d_model]
        """
        if self.pre_norm:
            # Pre-Norm: Norm → SubLayer → Residual
            # Attention Block
            normed = self.norm1(x)
            attn_out, _ = self.attention(normed, normed, normed, attn_mask=mask)
            x = x + self.dropout1(attn_out)  # 残差连接
            
            # FFN Block
            normed = self.norm2(x)
            ffn_out = self.ffn(normed)
            x = x + self.dropout2(ffn_out)  # 残差连接
        else:
            # Post-Norm: SubLayer → Residual → Norm
            # Attention Block
            attn_out, _ = self.attention(x, x, x, attn_mask=mask)
            x = self.norm1(x + self.dropout1(attn_out))  # 残差 + Norm
            
            # FFN Block
            ffn_out = self.ffn(x)
            x = self.norm2(x + self.dropout2(ffn_out))  # 残差 + Norm
        
        return x

# 使用示例
batch_size = 2
seq_len = 10
d_model = 512
num_heads = 8
d_ff = 2048

# Pre-Norm 版本（现代 Transformer）
block_pre = TransformerBlock(d_model, num_heads, d_ff, pre_norm=True)

# Post-Norm 版本（原始 Transformer）
block_post = TransformerBlock(d_model, num_heads, d_ff, pre_norm=False)

x = torch.randn(batch_size, seq_len, d_model)

# 前向传播
output_pre = block_pre(x)
output_post = block_post(x)

print(f"输入形状: {x.shape}")           # [2, 10, 512]
print(f"Pre-Norm 输出: {output_pre.shape}")   # [2, 10, 512]
print(f"Post-Norm 输出: {output_post.shape}")  # [2, 10, 512]

# 验证残差连接：输出和输入应该"有关系"（不是完全独立）
print(f"Pre-Norm 输出与输入的余弦相似度: {torch.cosine_similarity(x.flatten(), output_pre.flatten(), dim=0):.4f}")
```

**形状追踪**（Pre-Norm）：

```python
输入 x:            [batch, seq_len, d_model]
  ↓
norm1(x):          [batch, seq_len, d_model]
  ↓
attention:         [batch, seq_len, d_model]
  ↓
x + attn_out:      [batch, seq_len, d_model]  ← 残差连接
  ↓
norm2(x):          [batch, seq_len, d_model]
  ↓
ffn:               [batch, seq_len, d_model]
  ↓
x + ffn_out:       [batch, seq_len, d_model]  ← 残差连接
```

### 9.8 Residual Connection 的变体

#### Stochastic Depth（随机深度）

**动机**：训练时随机丢弃某些层，增强泛化性。

$$Y = X + \text{Bernoulli}(p) \cdot F(X)$$

其中 $\text{Bernoulli}(p)$ 以概率 $p$ 输出 1，否则输出 0。

**效果**：强制网络学会"即使某些层缺失，也能工作"。

#### Weighted Residual（加权残差）

**GPT-2 中的技巧**：给残差路径加一个可学习的权重。

$$Y = X + \alpha \cdot F(X)$$

初始化时 $\alpha \approx 0.1$（让残差贡献小一点），训练过程中自适应调整。

### 📊 面试考点

#### Q1: 残差连接解决了什么问题？

**A**: 解决了**深层网络的退化问题**（梯度消失导致深层网络训练效果不如浅层）。残差连接通过提供一条"梯度高速公路"（恒等映射），让梯度可以无衰减地回流到底层，使得训练非常深的网络（50+ 层）成为可能。

#### Q2: 为什么残差是 $Y = X + F(X)$ 而不是 $Y = F(X)$？

**A**: 

**传统方式** $Y = F(X)$：网络需要学习**完整的映射** $H(X)$。如果 $H(X) \approx X$（恒等映射），网络需要精确学到 $W=I, b=0$，优化困难。

**残差方式** $Y = X + F(X)$：网络只需学习**增量** $F(X) = H(X) - X$。如果某层无用，只需 $F(X) \to 0$（容易优化）。

**结论**：残差连接把学习目标从"绝对映射"变成了"相对增量"，大大降低了优化难度。

#### Q3: 残差连接的梯度公式是什么？为什么能缓解梯度消失？

**A**: 

$$\frac{\partial L}{\partial X} = \frac{\partial L}{\partial Y} \cdot \frac{\partial (X + F(X))}{\partial X} = \frac{\partial L}{\partial Y} \cdot \left(I + \frac{\partial F(X)}{\partial X}\right)$$

**关键点**：

1. **恒等项** $I$：梯度可以通过这条路径**直接传递**，不经过任何非线性变换，不会衰减。
    
2. **残差项** $\frac{\partial F(X)}{\partial X}$：即使这一项趋于 0（子层梯度消失），仍有恒等项保底。
    

**类比**：传统网络是"梯度连乘"（$0.9^{50} \to 0$），残差网络是"梯度连加"（$1+0.1+...+0.1 \approx \text{稳定}$）。

#### Q4: Transformer 中哪些地方用了残差连接？

**A**: 每个 Transformer Block 中有**两次**残差连接：

1. **Attention 之后**：$X + \text{MultiHeadAttention}(X)$
    
2. **FFN 之后**：$X + \text{FFN}(X)$
    

一个 12 层的 Transformer（如 BERT-base）有 **24 次残差连接**（每层 2 次）。

#### Q5: (Hard) 为什么 Pre-Norm 比 Post-Norm 更稳定？

**A**: 

**Post-Norm**：$\text{LayerNorm}(X + F(X))$

- 残差路径**经过** Layer Norm，梯度会受到 Norm 的非线性影响。
    
- 如果 $X + F(X)$ 数值很大，Layer Norm 会"削弱"残差的贡献。
    

**Pre-Norm**：$X + F(\text{LayerNorm}(X))$

- 残差路径**绕过** Layer Norm，梯度可以通过"干净的"恒等映射直达底层。
    
- Layer Norm 只影响 $F$ 的输入，不影响残差路径。
    

**数学直觉**：

$$\frac{\partial L}{\partial X} = \frac{\partial L}{\partial Y} \cdot \left(I + \frac{\partial F(\text{LN}(X))}{\partial X}\right)$$

Pre-Norm 中，恒等项 $I$ 是"纯净的"，不受 Layer Norm 的非线性干扰。

#### Q6: 如果没有残差连接，Transformer 能训练吗？

**A**: 理论上可以，但**极其困难**：

1. **梯度消失**：12 层 Transformer 会有严重梯度消失（每层衰减一点，累积起来底层几乎没梯度）。
    
2. **优化困难**：需要极小的学习率、精心设计的初始化、大量的 Warmup 步数。
    
3. **性能下降**：即使勉强训练完，效果也远不如有残差的版本。
    

**实验证据**：原始 Transformer 论文（2017）的消融实验显示，去掉残差连接后，模型性能大幅下降，训练速度显著变慢。


---

## 第二部分 完整架构组装

## 10. 完整 Encoder 架构：从零件到整机

前面我们拆解了 Transformer 的各个组件（Attention、FFN、LayerNorm、Residual）。现在我们把它们组装成一个完整的 **Encoder**。

### 10.1 Encoder Layer 的完整结构（ASCII 图解）

```
输入 X  [batch, seq_len, d_model]
  |
  |--------------------+  (Residual Path 1)
  |                    |
  +--> LayerNorm ------+  (Pre-Norm 分支)
  |                    |
  +--> Multi-Head -----+  (Attention)
       Attention       |
          |            |
          +------------+  (相加)
          |
          |------------+  (Residual Path 2)
          |            |
          +--> LayerNorm
          |            |
          +--> FFN ----+
                |      |
                +------+  (相加)
                |
            输出 Y  [batch, seq_len, d_model]
```

#### 数学公式（Pre-Norm 版本）

**Attention Block**：

$$Z_1 = X + \text{MultiHeadAttention}(\text{LayerNorm}(X))$$

**FFN Block**：

$$Z_2 = Z_1 + \text{FFN}(\text{LayerNorm}(Z_1))$$

**最终输出**：

$$Y = Z_2$$

### 10.2 数据流向（程序执行视角）

假设：

- $d_{model} = 512$
    
- $num\_heads = 8$（每个头 $d_k = 64$）
    
- $d_{ff} = 2048$
    
- $seq\_len = 10$
    
- $batch\_size = 2$
    

#### Step-by-Step 形状变换

**输入**：

$$X \in \mathbb{R}^{2 \times 10 \times 512}$$

**Attention Block**：

1. $\text{LayerNorm}(X) \in \mathbb{R}^{2 \times 10 \times 512}$
    
2. Multi-Head Attention:
    
    - 内部投影：$Q, K, V \in \mathbb{R}^{2 \times 10 \times 512}$
        
    - 切分：$\mathbb{R}^{2 \times 8 \times 10 \times 64}$（8 个头）
        
    - Attention 计算：每个头独立计算
        
    - 拼接：$\mathbb{R}^{2 \times 10 \times 512}$
        
    - 输出投影 $W_O$：$\mathbb{R}^{2 \times 10 \times 512}$
        
3. 残差连接：$Z_1 = X + \text{Attn}(X) \in \mathbb{R}^{2 \times 10 \times 512}$
    

**FFN Block**：

1. $\text{LayerNorm}(Z_1) \in \mathbb{R}^{2 \times 10 \times 512}$
    
2. FFN 第一层：$\mathbb{R}^{2 \times 10 \times 2048}$（扩张 4 倍）
    
3. ReLU + FFN 第二层：$\mathbb{R}^{2 \times 10 \times 512}$（压缩回去）
    
4. 残差连接：$Z_2 = Z_1 + \text{FFN}(Z_1) \in \mathbb{R}^{2 \times 10 \times 512}$
    

**输出**：

$$Y \in \mathbb{R}^{2 \times 10 \times 512}$$

**关键观察**：

- **输入输出同维度**（$512 \to 512$），方便堆叠多层。
    
- **序列长度不变**（$10 \to 10$），每个 Token 独立处理。
    

### 10.3 多层 Encoder 堆叠（Stacking）

完整的 Transformer Encoder 由 $N$ 个相同的 Encoder Layer 堆叠而成（BERT-base: $N=12$，GPT-3: $N=96$）。

#### ASCII 图解

```
输入 Embedding + Positional Encoding
  |
  v
+-----------------------+
| Encoder Layer 1       |  ← 包含 Attention + FFN + Residual + LayerNorm
+-----------------------+
  |
  v
+-----------------------+
| Encoder Layer 2       |  ← 参数独立（不共享）
+-----------------------+
  |
  v
        ...
  |
  v
+-----------------------+
| Encoder Layer N       |
+-----------------------+
  |
  v
最终输出 (Contextualized Representations)
```

#### 数学公式

设 $N=12$ 层，初始输入为 $X_0$：

$$X_1 = \text{EncoderLayer}_1(X_0)$$

$$X_2 = \text{EncoderLayer}_2(X_1)$$

$$\vdots$$

$$X_{12} = \text{EncoderLayer}_{12}(X_{11})$$

**最终输出**：$X_{12} \in \mathbb{R}^{batch \times seq\_len \times d_{model}}$

### 10.4 完整 Encoder 代码实现（PyTorch）

```python
import torch
import torch.nn as nn
import math

class PositionalEncoding(nn.Module):
    def __init__(self, d_model, max_len=5000):
        super().__init__()
        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len).unsqueeze(1).float()
        div_term = torch.exp(torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model))
        
        pe[:, 0::2] = torch.sin(position * div_term)
        pe[:, 1::2] = torch.cos(position * div_term)
        
        self.register_buffer('pe', pe.unsqueeze(0))  # [1, max_len, d_model]
    
    def forward(self, x):
        """
        x: [batch, seq_len, d_model]
        """
        seq_len = x.size(1)
        return x + self.pe[:, :seq_len, :]

class EncoderLayer(nn.Module):
    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        super().__init__()
        
        # Multi-Head Attention
        self.self_attn = nn.MultiheadAttention(d_model, num_heads, dropout=dropout, batch_first=True)
        
        # Feed-Forward Network
        self.ffn = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(d_ff, d_model)
        )
        
        # Layer Normalization
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        
        # Dropout
        self.dropout1 = nn.Dropout(dropout)
        self.dropout2 = nn.Dropout(dropout)
    
    def forward(self, x, mask=None):
        """
        x: [batch, seq_len, d_model]
        mask: Attention mask (可选)
        """
        # Attention Block (Pre-Norm)
        x_norm = self.norm1(x)
        attn_out, _ = self.self_attn(x_norm, x_norm, x_norm, attn_mask=mask)
        x = x + self.dropout1(attn_out)  # 残差
        
        # FFN Block (Pre-Norm)
        x_norm = self.norm2(x)
        ffn_out = self.ffn(x_norm)
        x = x + self.dropout2(ffn_out)  # 残差
        
        return x

class TransformerEncoder(nn.Module):
    def __init__(self, vocab_size, d_model=512, num_heads=8, d_ff=2048, num_layers=6, dropout=0.1, max_len=5000):
        """
        完整的 Transformer Encoder
        
        Args:
            vocab_size: 词汇表大小
            d_model: 模型维度
            num_heads: 注意力头数
            d_ff: FFN 中间层维度
            num_layers: Encoder 层数
            dropout: Dropout 概率
            max_len: 最大序列长度（用于位置编码）
        """
        super().__init__()
        
        # Embedding
        self.embedding = nn.Embedding(vocab_size, d_model)
        
        # Positional Encoding
        self.pos_encoding = PositionalEncoding(d_model, max_len)
        
        # Encoder Layers (堆叠)
        self.layers = nn.ModuleList([
            EncoderLayer(d_model, num_heads, d_ff, dropout)
            for _ in range(num_layers)
        ])
        
        # Final Layer Norm (可选，Pre-Norm 需要)
        self.final_norm = nn.LayerNorm(d_model)
        
        # Dropout
        self.dropout = nn.Dropout(dropout)
        
        # 参数初始化
        self._init_parameters()
    
    def _init_parameters(self):
        """Xavier 初始化"""
        for p in self.parameters():
            if p.dim() > 1:
                nn.init.xavier_uniform_(p)
    
    def forward(self, x, mask=None):
        """
        前向传播
        
        Args:
            x: [batch, seq_len] 输入 Token IDs
            mask: Attention Mask (可选)
        
        Returns:
            [batch, seq_len, d_model] 编码后的表示
        """
        # Embedding + Positional Encoding
        x = self.embedding(x)                # [batch, seq_len, d_model]
        x = self.pos_encoding(x)             # [batch, seq_len, d_model]
        x = self.dropout(x)
        
        # 逐层传播
        for layer in self.layers:
            x = layer(x, mask)               # [batch, seq_len, d_model]
        
        # Final Norm (Pre-Norm 架构需要)
        x = self.final_norm(x)
        
        return x

# 使用示例
vocab_size = 30000
batch_size = 2
seq_len = 20

encoder = TransformerEncoder(
    vocab_size=vocab_size,
    d_model=512,
    num_heads=8,
    d_ff=2048,
    num_layers=6,
    dropout=0.1
)

# 输入 Token IDs
input_ids = torch.randint(0, vocab_size, (batch_size, seq_len))

# 前向传播
output = encoder(input_ids)

print(f"输入形状: {input_ids.shape}")   # [2, 20]
print(f"输出形状: {output.shape}")      # [2, 20, 512]

# 参数量统计
total_params = sum(p.numel() for p in encoder.parameters())
print(f"总参数量: {total_params:,}")   # 约 47M (6 层)
```

### 10.5 参数量计算（BERT-base 为例）

**配置**：

- $d_{model} = 768$
    
- $num\_heads = 12$
    
- $d_{ff} = 3072$ ($4 \times 768$)
    
- $num\_layers = 12$
    
- $vocab\_size = 30000$
    

**单层参数量**：

1. **Multi-Head Attention**：
    
    - $W_Q, W_K, W_V$: $3 \times (768 \times 768) = 1.77M$
        
    - $W_O$: $768 \times 768 = 0.59M$
        
    - **小计**：$2.36M$
        
2. **FFN**：
    
    - $W_1$: $768 \times 3072 = 2.36M$
        
    - $W_2$: $3072 \times 768 = 2.36M$
        
    - **小计**：$4.72M$
        
3. **Layer Norm**（$\gamma, \beta$）：
    
    - $2 \times 768 \times 2 = 3K$（可忽略）
        
4. **单层总计**：$2.36M + 4.72M \approx 7.1M$
    

**12 层总计**：$7.1M \times 12 = 85.2M$

**Embedding**：$30000 \times 768 = 23M$

**BERT-base 总参数量**：$85M + 23M \approx \mathbf{110M}$

### 10.6 Encoder 的应用场景

| 模型                | Encoder 层数 | 应用场景                   |
| ------------------- | ------------ | -------------------------- |
| **BERT-base**       | 12           | 文本分类、NER、问答        |
| **BERT-large**      | 24           | 高精度 NLU 任务            |
| **RoBERTa**         | 12/24        | BERT 改进版（更好的预训练） |
| **ELECTRA**         | 12/24        | 判别式预训练（比 MLM 更高效） |
| **ViT (Vision)**    | 12           | 图像分类（把图像当序列）   |
| **Sentence-BERT**   | 12           | 语义相似度、句子嵌入       |

**关键特性**：

- **双向编码**：每个 Token 都能看到整个序列（没有 Causal Mask）。
    
- **并行计算**：所有 Token 同时处理，训练速度快。
    
- **适用任务**：理解类任务（分类、抽取、匹配），不适合生成。
    

### 📊 面试考点

#### Q1: Encoder Layer 的完整结构是什么？

**A**: 

1. **Attention Block**: LayerNorm → Multi-Head Attention → Dropout → Residual
    
2. **FFN Block**: LayerNorm → FFN → Dropout → Residual
    

**公式**（Pre-Norm）：

$$X_1 = X + \text{Attn}(\text{LN}(X))$$

$$X_2 = X_1 + \text{FFN}(\text{LN}(X_1))$$

#### Q2: Encoder 和 Decoder 的区别？

**A**: 

| 特性             | Encoder                    | Decoder                          |
| ---------------- | -------------------------- | -------------------------------- |
| **Attention 类型** | Self-Attention（无 Mask）  | Masked Self-Attention + Cross-Attention |
| **信息流向**     | 双向（每个 Token 看所有 Token） | 单向（只看过去）+ 从 Encoder 获取信息 |
| **应用场景**     | 理解任务（分类、抽取）     | 生成任务（翻译、摘要）           |
| **代表模型**     | BERT, RoBERTa              | GPT, Llama                       |

#### Q3: 为什么 Encoder 没有 Causal Mask？

**A**: 

Encoder 用于**理解任务**，需要利用**完整上下文**（双向信息）：

- **分类任务**："这部电影很棒" → 需要看完整句子才能判断情感。
    
- **NER 任务**："Apple 发布了新产品" → 需要看后文"产品"才能确定"Apple"是公司而非水果。
    

Causal Mask 只用于**生成任务**（Decoder），防止"看到未来"。

#### Q4: BERT 的 12 层 Encoder 是否参数共享？

**A**: **不共享**。每一层都有独立的参数 $W_Q^{(l)}, W_K^{(l)}, W_V^{(l)}, ...$。

**原因**：

- 不同层学习不同层次的特征：
    
    - **浅层**（1-3 层）：学习词法、句法（如词性、短语结构）。
        
    - **中层**（4-8 层）：学习语义（如实体识别、共指消解）。
        
    - **深层**（9-12 层）：学习任务相关的高级特征。
        

**例外**：ALBERT 模型使用参数共享（所有层共享参数），大幅减少参数量，但性能略有下降。

#### Q5: (Hard) 为什么 BERT 用 Post-Norm，GPT 用 Pre-Norm？

**A**: 

**历史原因**：

- **BERT (2018)**：继承了原始 Transformer (2017) 的 Post-Norm 设计。
    
- **GPT-2/3 (2019/2020)**：发现 Pre-Norm 训练更稳定，尤其是深层网络（GPT-3 有 96 层）。
    

**技术原因**：

- **BERT 只有 12/24 层**：Post-Norm 的训练难度尚可接受（配合 Warmup）。
    
- **GPT-3 有 96 层**：Pre-Norm 的梯度高速公路至关重要。
    

**现代实践**：新模型（Llama、PaLM）几乎都用 Pre-Norm。


## 11. 完整 Decoder 架构：生成式模型的核心

### 🎨 Decoder 完整架构图（3 子层 + 3 残差）

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    DECODER LAYER 架构
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

输入 X [batch, target_len, d_model]  ←── 目标序列的嵌入 + 位置编码
    │
    ├─────────────────────────────────┐
    │                                 │  Residual 1
    ▼                                 │
┌────────────────────────┐            │
│   LayerNorm (Pre)      │            │
└──────────┬─────────────┘            │
           │                          │
           ▼                          │
┌────────────────────────────────────┐│
│  Masked Self-Attention (Causal)    ││  ◄─── 只看过去，不看未来
│  ┌──────────────────────────┐      ││
│  │ Q = X · W_Q              │      ││
│  │ K = X · W_K              │      ││
│  │ V = X · W_V              │      ││
│  │                          │      ││
│  │ Mask = 下三角 (未来=-∞) │      ││
│  │ A = softmax(QK^T/√d + M) │      ││
│  │ Out = A · V              │      ││
│  └──────────────────────────┘      ││
└──────────┬─────────────────────────┘│
           │                          │
           ▼                          │
       [Add] ◄──────────────────────┘
           │
           ▼
       LayerNorm (可选，取决于 Pre/Post-Norm)
           │
    ├──────┴──────────────────────────┐
    │                                 │  Residual 2
    ▼                                 │
┌────────────────────────┐            │
│   LayerNorm (Pre)      │            │
└──────────┬─────────────┘            │
           │                          │
           ▼                          │
┌────────────────────────────────────┐│
│   Cross-Attention                  ││  ◄─── Decoder 看 Encoder
│  ┌──────────────────────────┐      ││
│  │ Q = DecoderOut · W_Q     │      ││  (来自上一子层)
│  │ K = EncoderOut · W_K     │◄─────┼┼─ Encoder 输出
│  │ V = EncoderOut · W_V     │◄─────┼┼─ Encoder 输出
│  │                          │      ││
│  │ 无 Mask（可看全部源序列）│      ││
│  │ A = softmax(QK^T/√d)     │      ││
│  │ Out = A · V              │      ││
│  └──────────────────────────┘      ││
└──────────┬─────────────────────────┘│
           │                          │
           ▼                          │
       [Add] ◄──────────────────────┘
           │
           ▼
       LayerNorm (可选)
           │
    ├──────┴──────────────────────────┐
    │                                 │  Residual 3
    ▼                                 │
┌────────────────────────┐            │
│   LayerNorm (Pre)      │            │
└──────────┬─────────────┘            │
           │                          │
           ▼                          │
┌────────────────────────────────────┐│
│   Feed-Forward Network             ││
│  ┌──────────────────────────┐      ││
│  │ FFN(x) = max(0, xW₁+b₁)W₂+b₂    ││
│  │ d_model → d_ff (×4)      │      ││
│  │       → d_model          │      ││
│  └──────────────────────────┘      ││
└──────────┬─────────────────────────┘│
           │                          │
           ▼                          │
       [Add] ◄──────────────────────┘
           │
           ▼
   输出 Y [batch, target_len, d_model]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

关键对比：Encoder vs Decoder
┌────────────────────┬──────────────┬──────────────────────┐
│ 组件               │ Encoder      │ Decoder              │
├────────────────────┼──────────────┼──────────────────────┤
│ 子层数             │ 2            │ 3                    │
│ Self-Attention     │ 双向（无Mask）│ 单向（Causal Mask）  │
│ Cross-Attention    │ ✗ 无         │ ✓ 有（核心）         │
│ 残差连接数         │ 2            │ 3                    │
│ 输入来源           │ 源序列       │ 目标序列 + Encoder输出│
│ 典型应用           │ BERT         │ GPT, 机器翻译        │
└────────────────────┴──────────────┴──────────────────────┘

📊 面试重点：
1. 为什么 Decoder 需要 Masked Self-Attention？
   答：自回归生成时，预测第 i 个词只能用前 i-1 个词，不能"偷看"未来
   
2. Cross-Attention 的 Q/K/V 分别来自哪里？
   答：Q 来自 Decoder 当前层输出，K/V 来自 Encoder 最终输出
   
3. Decoder 为什么比 Encoder 多一层？
   答：多出的 Cross-Attention 用于连接 Encoder-Decoder，实现条件生成
```


Decoder 是生成式模型（如 GPT、机器翻译）的核心。它与 Encoder 的关键区别是：**Masked Self-Attention**（只看过去）和 **Cross-Attention**（从 Encoder 获取信息）。

### 11.1 Decoder Layer 的完整结构（ASCII 图解）

```
输入 X  [batch, target_len, d_model]
  |
  |------------------------+  (Residual Path 1)
  |                        |
  +--> LayerNorm ----------+
  |                        |
  +--> Masked Self-    ----+  (只看过去的 Token)
       Attention           |
          |                |
          +----------------+  (相加)
          |
          |-----------------------+  (Residual Path 2)
          |                       |
          +--> LayerNorm ---------+
          |                       |
          +--> Cross-Attention ---+  (Q from Decoder, K/V from Encoder)
               (from Encoder)     |
                  |               |
                  +---------------+  (相加)
                  |
                  |-------------------+  (Residual Path 3)
                  |                   |
                  +--> LayerNorm -----+
                  |                   |
                  +--> FFN -----------+
                         |            |
                         +------------+  (相加)
                         |
                    输出 Y  [batch, target_len, d_model]
```

**关键观察**：

- **3 个子层**（Encoder 只有 2 个）：
    
    1. Masked Self-Attention
        
    2. Cross-Attention
        
    3. FFN
        
- **3 次残差连接**（Encoder 只有 2 次）
    

### 11.2 Masked Self-Attention 详解

#### 为什么需要 Mask？

**问题**：生成任务中，模型在预测第 $i$ 个 Token 时，**不应该看到第 $i+1, i+2, ...$ 个 Token**（这是"未来"信息，作弊）。

**解决方案**：Causal Mask（因果掩码），在 Attention Score 矩阵的右上角填充 $-\infty$。

#### Causal Mask 矩阵

对于序列长度 $n=4$：

$$M = \begin{bmatrix} 0 & -\infty & -\infty & -\infty \\ 0 & 0 & -\infty & -\infty \\ 0 & 0 & 0 & -\infty \\ 0 & 0 & 0 & 0 \end{bmatrix}$$

**规则**：

- $M_{ij} = 0$ if $j \le i$（可以看当前和过去）
    
- $M_{ij} = -\infty$ if $j > i$（不能看未来）
    

#### Softmax 后的效果

$$A = \text{softmax}(QK^T / \sqrt{d} + M)$$

对于第 2 行（第 2 个 Token）：

$$A_{2,:} = \text{softmax}([s_{20}, s_{21}, -\infty, -\infty]) = [a_{20}, a_{21}, 0, 0]$$

**结果**：第 2 个 Token 只能关注位置 0 和 1（过去），对位置 2 和 3 的权重为 0。

### 11.3 Cross-Attention 机制（承上启下）

Cross-Attention 是 Decoder 的**核心创新**，让 Decoder 能够"看到" Encoder 的输出。

#### 符号定义

- $X_{dec} \in \mathbb{R}^{batch \times target\_len \times d}$：Decoder 当前层的输入（来自 Masked Self-Attention 的输出）
    
- $X_{enc} \in \mathbb{R}^{batch \times source\_len \times d}$：Encoder 的最终输出（来自 Encoder 的顶层）
    

#### 公式定义

$$Q = X_{dec} W_Q \quad \text{(Query from Decoder)}$$

$$K = X_{enc} W_K \quad \text{(Key from Encoder)}$$

$$V = X_{enc} W_V \quad \text{(Value from Encoder)}$$

$$\text{CrossAttn} = \text{softmax}\left(\frac{QK^T}{\sqrt{d}}\right) V$$

**关键特性**：

1. **Q 来自 Decoder**："我想要什么信息"（目标语言的需求）
    
2. **K, V 来自 Encoder**："源文本有什么信息"（源语言的内容）
    

#### 维度分析

假设：

- 源序列（Encoder）：$source\_len = 6$（"I love AI"）
    
- 目标序列（Decoder）：$target\_len = 4$（"我 爱 AI"）
    

$$Q: [batch, 4, d] \quad K^T: [batch, d, 6] \quad \Rightarrow \quad QK^T: [batch, 4, 6]$$

**物理意义**：

- $A_{ij}$：目标语言第 $i$ 个词对源语言第 $j$ 个词的关注度。
    
- 例如：$A_{1,2}$ 表示目标词"爱"对源词"love"的关注度（应该很高）。
    

### 11.4 完整 Decoder Layer 代码实现

```python
import torch
import torch.nn as nn

class DecoderLayer(nn.Module):
    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        super().__init__()
        
        # Masked Self-Attention
        self.self_attn = nn.MultiheadAttention(d_model, num_heads, dropout=dropout, batch_first=True)
        
        # Cross-Attention
        self.cross_attn = nn.MultiheadAttention(d_model, num_heads, dropout=dropout, batch_first=True)
        
        # Feed-Forward Network
        self.ffn = nn.Sequential(
            nn.Linear(d_model, d_ff),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(d_ff, d_model)
        )
        
        # Layer Normalization (3 个)
        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.norm3 = nn.LayerNorm(d_model)
        
        # Dropout (3 个)
        self.dropout1 = nn.Dropout(dropout)
        self.dropout2 = nn.Dropout(dropout)
        self.dropout3 = nn.Dropout(dropout)
    
    def forward(self, x, enc_output, tgt_mask=None, src_mask=None):
        """
        前向传播
        
        Args:
            x: [batch, target_len, d_model] Decoder 输入
            enc_output: [batch, source_len, d_model] Encoder 输出
            tgt_mask: Causal Mask for Masked Self-Attention
            src_mask: Padding Mask for Cross-Attention (可选)
        
        Returns:
            [batch, target_len, d_model]
        """
        # Block 1: Masked Self-Attention (Pre-Norm)
        x_norm = self.norm1(x)
        self_attn_out, _ = self.self_attn(x_norm, x_norm, x_norm, attn_mask=tgt_mask)
        x = x + self.dropout1(self_attn_out)  # 残差
        
        # Block 2: Cross-Attention (Pre-Norm)
        x_norm = self.norm2(x)
        cross_attn_out, _ = self.cross_attn(
            query=x_norm,           # Q from Decoder
            key=enc_output,         # K from Encoder
            value=enc_output,       # V from Encoder
            attn_mask=src_mask
        )
        x = x + self.dropout2(cross_attn_out)  # 残差
        
        # Block 3: FFN (Pre-Norm)
        x_norm = self.norm3(x)
        ffn_out = self.ffn(x_norm)
        x = x + self.dropout3(ffn_out)  # 残差
        
        return x

class TransformerDecoder(nn.Module):
    def __init__(self, vocab_size, d_model=512, num_heads=8, d_ff=2048, num_layers=6, dropout=0.1, max_len=5000):
        """
        完整的 Transformer Decoder
        
        Args:
            vocab_size: 目标词汇表大小
            d_model: 模型维度
            num_heads: 注意力头数
            d_ff: FFN 中间层维度
            num_layers: Decoder 层数
            dropout: Dropout 概率
            max_len: 最大序列长度
        """
        super().__init__()
        
        # Embedding
        self.embedding = nn.Embedding(vocab_size, d_model)
        
        # Positional Encoding
        self.pos_encoding = PositionalEncoding(d_model, max_len)
        
        # Decoder Layers
        self.layers = nn.ModuleList([
            DecoderLayer(d_model, num_heads, d_ff, dropout)
            for _ in range(num_layers)
        ])
        
        # Final Layer Norm
        self.final_norm = nn.LayerNorm(d_model)
        
        # Output Projection (LM Head)
        self.output_proj = nn.Linear(d_model, vocab_size)
        
        # Dropout
        self.dropout = nn.Dropout(dropout)
        
        # 参数初始化
        self._init_parameters()
    
    def _init_parameters(self):
        for p in self.parameters():
            if p.dim() > 1:
                nn.init.xavier_uniform_(p)
    
    def generate_causal_mask(self, size):
        """
        生成 Causal Mask
        
        Args:
            size: 序列长度
        
        Returns:
            [size, size] 下三角为 0，右上角为 -inf
        """
        mask = torch.triu(torch.ones(size, size) * float('-inf'), diagonal=1)
        return mask
    
    def forward(self, tgt, enc_output, tgt_mask=None):
        """
        前向传播
        
        Args:
            tgt: [batch, target_len] 目标序列 Token IDs
            enc_output: [batch, source_len, d_model] Encoder 输出
            tgt_mask: Causal Mask (可选，自动生成)
        
        Returns:
            [batch, target_len, vocab_size] Logits
        """
        batch_size, target_len = tgt.shape
        
        # 自动生成 Causal Mask
        if tgt_mask is None:
            tgt_mask = self.generate_causal_mask(target_len).to(tgt.device)
        
        # Embedding + Positional Encoding
        x = self.embedding(tgt)          # [batch, target_len, d_model]
        x = self.pos_encoding(x)
        x = self.dropout(x)
        
        # 逐层传播
        for layer in self.layers:
            x = layer(x, enc_output, tgt_mask=tgt_mask)
        
        # Final Norm
        x = self.final_norm(x)
        
        # Output Projection
        logits = self.output_proj(x)     # [batch, target_len, vocab_size]
        
        return logits

# 使用示例（机器翻译场景）
src_vocab = 30000
tgt_vocab = 25000
batch_size = 2
source_len = 10
target_len = 8

# Encoder 输出（假设已经通过 Encoder）
enc_output = torch.randn(batch_size, source_len, 512)

# Decoder
decoder = TransformerDecoder(
    vocab_size=tgt_vocab,
    d_model=512,
    num_heads=8,
    d_ff=2048,
    num_layers=6
)

# 目标序列 Token IDs
tgt_input = torch.randint(0, tgt_vocab, (batch_size, target_len))

# 前向传播
logits = decoder(tgt_input, enc_output)

print(f"目标输入形状: {tgt_input.shape}")   # [2, 8]
print(f"Encoder 输出: {enc_output.shape}")  # [2, 10, 512]
print(f"Decoder 输出: {logits.shape}")      # [2, 8, 25000]
```

### 11.5 Encoder-Decoder 完整组合（机器翻译）

#### 完整架构图

```
源语言序列 (Source)
    |
    v
+------------------+
| Embedding +      |
| Positional       |
| Encoding         |
+------------------+
    |
    v
+------------------+
| Encoder Stack    |  ← N 层 Encoder Layer
| (6-12 layers)    |
+------------------+
    |
    v
  Encoder Output  --------+
                           |
                           |  (K, V)
目标语言序列 (Target)      |
    |                      |
    v                      |
+------------------+       |
| Embedding +      |       |
| Positional       |       |
| Encoding         |       |
+------------------+       |
    |                      |
    v                      |
+------------------+       |
| Decoder Stack    | <-----+  (Cross-Attention)
| (6-12 layers)    |
+------------------+
    |
    v
+------------------+
| Linear +         |
| Softmax          |
+------------------+
    |
    v
  输出概率分布
```

#### 数据流向

1. **源序列**："I love AI" → Token IDs → Encoder → Encoder Output $[batch, 3, 512]$
    
2. **目标序列**："<SOS> 我 爱" → Token IDs → Decoder
    
    - Masked Self-Attention：每个词只看过去
        
    - Cross-Attention：查询 Encoder Output
        
    - FFN：独立处理
        
3. **输出**：Logits $[batch, 3, tgt\_vocab]$ → Softmax → 预测下一个词 "AI"
    

### 📊 面试考点

#### Q1: Decoder 的 3 个子层分别是什么？

**A**: 

1. **Masked Self-Attention**：让 Decoder 的每个位置只能看到**过去和当前**的 Token（Causal Mask）。
    
2. **Cross-Attention**：让 Decoder **查询 Encoder 的输出**，获取源序列信息。Q from Decoder, K/V from Encoder。
    
3. **FFN**：Position-wise Feed-Forward Network，与 Encoder 完全相同。
    

#### Q2: Masked Self-Attention 和普通 Self-Attention 的区别？

**A**: 

**Masked Self-Attention** 使用 **Causal Mask**（下三角矩阵），右上角全是 $-\infty$：

$$A = \text{softmax}(QK^T / \sqrt{d} + Mask)$$

**效果**：第 $i$ 个 Token 只能 attend 到位置 $\le i$ 的 Token，看不到"未来"。

**应用**：GPT 系列（纯 Decoder）、机器翻译的 Decoder。

#### Q3: Cross-Attention 中，Q、K、V 分别来自哪里？

**A**: 

- **Q (Query)**：来自 **Decoder 当前层的输入**（Masked Self-Attention 的输出）。物理意义："我（目标语言）想要什么信息"。
    
- **K, V**：来自 **Encoder 的最终输出**（Encoder Stack 的顶层）。物理意义："源语言有什么信息可以提供"。
    

**公式**：

$$Q = X_{dec} W_Q, \quad K = X_{enc} W_K, \quad V = X_{enc} W_V$$

#### Q4: 为什么 GPT 只用 Decoder，不用 Encoder？

**A**: 

GPT 是**单向语言模型**（Causal Language Model），任务是"给定前文，预测下一个词"：

- **输入**："我 爱 吃"
    
- **输出**：预测下一个词"鱼"
    

这个任务**不需要额外的源序列**（没有"翻译源头"），所以不需要 Encoder。

**Decoder-only 架构的优势**：

1. **简化**：只需一个 Stack，参数更高效。
    
2. **适合生成**：Masked Self-Attention 天然适合从左到右生成。
    
3. **Scaling**：容易扩展到超大模型（GPT-3 175B）。
    

#### Q5: (Hard) Cross-Attention 的梯度如何回流到 Encoder？

**A**: 

**前向传播**：

$$\text{CrossAttn} = \text{softmax}(Q K^T / \sqrt{d}) V$$

其中 $K, V$ 来自 Encoder 输出 $X_{enc}$。

**反向传播**：

假设梯度 $\frac{\partial L}{\partial \text{CrossAttn}}$ 已知。

1. **对 V 的梯度**：
    
    $$\frac{\partial L}{\partial V} = A^T \frac{\partial L}{\partial \text{CrossAttn}}$$
    
    其中 $A = \text{softmax}(QK^T / \sqrt{d})$。
    
2. **对 K 的梯度**：
    
    $$\frac{\partial L}{\partial K} = \frac{1}{\sqrt{d}} \cdot \frac{\partial L}{\partial A} \cdot Q$$
    
3. **对 Encoder 输出的梯度**：
    
    $$\frac{\partial L}{\partial X_{enc}} = \frac{\partial L}{\partial K} \cdot W_K^T + \frac{\partial L}{\partial V} \cdot W_V^T$$
    

**结论**：

- 梯度通过 Cross-Attention 的 $K, V$ 路径**回流到 Encoder**。
    
- Encoder 会根据"Decoder 需要什么信息"来调整自己的表示（端到端优化）。
    

**物理意义**：

- 如果 Decoder 在翻译"爱"时频繁查询源词"love"，梯度会告诉 Encoder："请把'love'的表示编码得更清晰，方便 Decoder 提取"。
    

---

## 12. Cross-Attention 深度解析：Encoder-Decoder 的"桥梁"

Cross-Attention 是 Encoder-Decoder 架构的核心创新，它让两个独立的序列（源语言 vs 目标语言）能够交互信息。本章深入剖析其机制。

### 12.1 为什么需要 Cross-Attention？（动机）

#### 问题场景：机器翻译

- **源序列**（英文）："I love AI"
    
- **目标序列**（中文）："我 爱 AI"
    

**Decoder 面临的困境**：

- **Masked Self-Attention** 只能让目标序列内部交互（"我"看"我"，"爱"看"我"和"爱"）。
    
- 但 Decoder **不知道源序列的内容**！如何翻译？
    

**解决方案**：

- Encoder 负责理解源序列，生成 **Contextualized Representations**（$X_{enc}$）。
    
- Decoder 通过 **Cross-Attention** 向 Encoder "提问"："我在翻译第 2 个词'爱'时，应该关注源序列的哪个词？"
    
- Cross-Attention 计算出：**Attention Weights**，告诉 Decoder："主要关注源词'love'（权重 0.9），其次关注'I'（权重 0.1）"。
    

### 12.2 Cross-Attention 的计算细节（程序视角）

#### 符号定义（重新确认）

- $X_{dec} \in \mathbb{R}^{batch \times T_{tgt} \times d}$：Decoder 的输入（来自 Masked Self-Attention 的输出）
    
    - $T_{tgt}$：目标序列长度（如 4）
        
- $X_{enc} \in \mathbb{R}^{batch \times T_{src} \times d}$：Encoder 的输出（来自 Encoder 顶层）
    
    - $T_{src}$：源序列长度（如 6）
        

#### Step-by-Step 计算

**Step 1: 生成 Q, K, V**

$$Q = X_{dec} W_Q \in \mathbb{R}^{batch \times T_{tgt} \times d}$$

$$K = X_{enc} W_K \in \mathbb{R}^{batch \times T_{src} \times d}$$

$$V = X_{enc} W_V \in \mathbb{R}^{batch \times T_{src} \times d}$$

**关键观察**：

- $Q$ 的行数 = 目标序列长度（Decoder 有几个词）
    
- $K, V$ 的行数 = 源序列长度（Encoder 有几个词）
    

**Step 2: 计算 Attention Score**

$$S = \frac{QK^T}{\sqrt{d}} \in \mathbb{R}^{batch \times T_{tgt} \times T_{src}}$$

**维度分析**：

$$[batch, T_{tgt}, d] \times [batch, d, T_{src}] = [batch, T_{tgt}, T_{src}]$$

**物理意义**：

- $S_{ij}$：目标语言第 $i$ 个词对源语言第 $j$ 个词的相关性分数。
    

**Step 3: Softmax（归一化）**

$$A = \text{softmax}(S) \in \mathbb{R}^{batch \times T_{tgt} \times T_{src}}$$

**性质**：

- $A$ 的每一**行**加和为 1（$\sum_j A_{ij} = 1$）
    
- $A_{ij}$：目标词 $i$ 对源词 $j$ 的关注权重
    

**Step 4: 加权聚合**

$$O = AV \in \mathbb{R}^{batch \times T_{tgt} \times d}$$

**逐元素展开**：

$$O_i = \sum_{j=1}^{T_{src}} A_{ij} V_j$$

**物理意义**：

- 目标词 $i$ 的 Cross-Attention 输出 $O_i$ 是源序列所有词的加权和。
    
- 权重 $A_{ij}$ 由 $Q_i$ 和 $K_j$ 的相似度决定。
    

### 12.3 数值演示（具体例子）

假设：

- 源序列："I love AI"（$T_{src} = 3$）
    
- 目标序列："我 爱"（$T_{tgt} = 2$）
    
- $d = 4$（简化）
    

**Encoder 输出** $X_{enc}$（已编码）：

$$X_{enc} = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \end{bmatrix} \quad \text{(行: I, love, AI)}$$

**Decoder 输入** $X_{dec}$（来自 Masked Self-Attention）：

$$X_{dec} = \begin{bmatrix} 0.5 & 0.5 & 0 & 0 \\ 0 & 0.8 & 0.2 & 0 \end{bmatrix} \quad \text{(行: 我, 爱)}$$

**简化假设**：$W_Q = W_K = W_V = I$（恒等矩阵，方便演示）

**Step 1: Q, K, V**

$$Q = X_{dec}, \quad K = V = X_{enc}$$

**Step 2: Attention Score**（未归一化）

$$S = QK^T = \begin{bmatrix} 0.5 & 0.5 & 0 \\ 0 & 0.8 & 0.2 \end{bmatrix}$$

**解释**：

- 目标词"我"（第 0 行）对源词"I"和"love"的分数都是 0.5（都关注）
    
- 目标词"爱"（第 1 行）对源词"love"的分数最高（0.8），这是正确的对齐！
    

**Step 3: Softmax**

$$A = \text{softmax}(S) \approx \begin{bmatrix} 0.38 & 0.38 & 0.24 \\ 0.21 & 0.55 & 0.24 \end{bmatrix}$$

**Step 4: 加权聚合**

$$O = AV = \begin{bmatrix} 0.38 \times [1,0,0,0] + 0.38 \times [0,1,0,0] + 0.24 \times [0,0,1,0] \\ 0.21 \times [1,0,0,0] + 0.55 \times [0,1,0,0] + 0.24 \times [0,0,1,0] \end{bmatrix}$$

$$= \begin{bmatrix} 0.38 & 0.38 & 0.24 & 0 \\ 0.21 & 0.55 & 0.24 & 0 \end{bmatrix}$$

**结论**：

- 目标词"爱"的表示中，主要包含源词"love"的信息（0.55），这是正确的翻译对齐。
    

### 12.4 梯度双向流动（反向传播）

Cross-Attention 的特殊之处在于：**梯度同时回流到 Encoder 和 Decoder**。

#### 前向传播

$$O = \text{softmax}(Q K^T / \sqrt{d}) \cdot V$$

其中：

- $Q = X_{dec} W_Q$（Decoder 的参数）
    
- $K = X_{enc} W_K, \quad V = X_{enc} W_V$（Encoder 的输出）
    

#### 反向传播

假设梯度 $\frac{\partial L}{\partial O}$ 已知。

**1. 对 Decoder 参数的梯度**

$$\frac{\partial L}{\partial W_Q} = X_{dec}^T \frac{\partial L}{\partial Q}$$

这会更新 $W_Q$（Decoder 的参数）。

**2. 对 Encoder 输出的梯度**

$$\frac{\partial L}{\partial X_{enc}} = \frac{\partial L}{\partial K} W_K^T + \frac{\partial L}{\partial V} W_V^T$$

这个梯度会继续回传到 Encoder 的各层。

**因果链条**：

1. **Loss** 告诉 Decoder："你翻译错了'爱'这个词。"
    
2. **Decoder** 通过 Cross-Attention 梯度告诉 **Encoder**："是你提供的'love'的表示不够好，导致我翻译错了。"
    
3. **Encoder** 调整参数，让"love"的表示更清晰、更易于 Decoder 提取。
    

**结论**：Cross-Attention 实现了 **Encoder 和 Decoder 的端到端联合优化**。

### 12.5 Cross-Attention 的可视化（对齐矩阵）

在机器翻译中，Cross-Attention 的权重矩阵 $A \in \mathbb{R}^{T_{tgt} \times T_{src}}$ 可以可视化为**对齐矩阵**。

#### 示例

源序列："I love AI"  
目标序列："我 爱 AI"

**Attention 权重矩阵**（简化）：

|     | I   | love | AI  |
| --- | --- | ---- | --- |
| 我  | 0.8 | 0.1  | 0.1 |
| 爱  | 0.1 | 0.8  | 0.1 |
| AI  | 0.1 | 0.1  | 0.8 |

**观察**：

- "我" 主要关注 "I"（0.8）
    
- "爱" 主要关注 "love"（0.8）
    
- "AI" 主要关注 "AI"（0.8）
    

这就是经典的**单调对齐**（Monotonic Alignment）。

### 📊 面试考点

#### Q1: Cross-Attention 和 Self-Attention 的区别？

**A**: 

| 特性       | Self-Attention       | Cross-Attention         |
| ---------- | -------------------- | ----------------------- |
| **Q 来源** | 同一序列（$X$）      | Decoder（$X_{dec}$）    |
| **K 来源** | 同一序列（$X$）      | Encoder（$X_{enc}$）    |
| **V 来源** | 同一序列（$X$）      | Encoder（$X_{enc}$）    |
| **作用**   | 序列内部信息交互     | 序列间信息交互（跨序列） |
| **应用**   | Encoder, Decoder 自身 | Decoder 查询 Encoder    |

#### Q2: Cross-Attention 的权重矩阵形状是什么？

**A**: $A \in \mathbb{R}^{T_{tgt} \times T_{src}}$

- $T_{tgt}$：目标序列长度（Decoder 生成的词数）
    
- $T_{src}$：源序列长度（Encoder 输入的词数）
    

**物理意义**：$A_{ij}$ 表示目标词 $i$ 对源词 $j$ 的关注权重。

#### Q3: 为什么 Cross-Attention 放在 Masked Self-Attention 之后？

**A**: 

**顺序**：Masked Self-Attention → Cross-Attention → FFN

**原因**：

1. **Masked Self-Attention** 先让 Decoder **整合目标序列内部的信息**（如"我 爱"之间的依赖）。
    
2. **Cross-Attention** 再让 Decoder **基于整合后的信息**去查询 Encoder（"我需要什么源序列信息来翻译当前词？"）。
    

**类比**：先"理解自己的需求"（Self-Attention），再"去数据库查询"（Cross-Attention）。

#### Q4: (Hard) 如果源序列很长（如 1000 词），Cross-Attention 的计算复杂度是多少？

**A**: 

**复杂度**：$O(T_{tgt} \times T_{src} \times d)$

**具体**：

- 计算 $QK^T$：$O(T_{tgt} \times T_{src} \times d)$
    
- 计算 $AV$：$O(T_{tgt} \times T_{src} \times d)$
    

**瓶颈**：

- 如果 $T_{src} = 1000$，$T_{tgt} = 500$，需要计算 $1000 \times 500 = 500K$ 个 Attention Score。
    

**解决方案**：

1. **Sparse Attention**：只关注部分源词（如最近的 k 个）。
    
2. **Linformer/Performer**：用低秩分解或核方法降低复杂度到 $O(T \times k)$。
    


---

## 第三部分 工业级优化与现代变体

## 13. MQA/GQA：高效推理的关键技术（Llama 2 核心）

Multi-Query Attention (MQA) 和 Grouped-Query Attention (GQA) 是 2023-2024 年工业界 LLM 的**标配技术**，面试必考。它们解决的核心问题是：**推理时的 KV Cache 显存爆炸**。

### 🎨 MHA vs MQA vs GQA 架构对比图

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        Multi-Head Attention (MHA) - 标准架构
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

输入 X [batch, seq_len, d_model]
         │
         ├───────┬───────┬───────┬───────┐
         │       │       │       │       │
         ▼       ▼       ▼       ▼       ▼
       Head1   Head2   Head3   Head4   ... Head8
         │       │       │       │           │
    ┌────┼───┐  ┌────┼───┐  ┌────┼───┐      │
    │    │   │  │    │   │  │    │   │      │
    ▼    ▼   ▼  ▼    ▼   ▼  ▼    ▼   ▼      ▼
   W_Q W_K W_V W_Q W_K W_V W_Q W_K W_V   (每头独立)
    │    │   │  │    │   │  │    │   │
    ▼    ▼   ▼  ▼    ▼   ▼  ▼    ▼   ▼
    Q₁   K₁  V₁ Q₂   K₂  V₂ Q₃   K₃  V₃   ... Q₈ K₈ V₈

KV Cache: 8 heads × 2 (K+V) × T × d_head = 16×T×d_head
                    ▲▲▲ 显存爆炸点 ▲▲▲

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     Multi-Query Attention (MQA) - 极端压缩（GPT-J, PaLM）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

输入 X [batch, seq_len, d_model]
         │
         ├───────┬───────┬───────┬───────┐
         │       │       │       │       │
         ▼       ▼       ▼       ▼       ▼
       Head1   Head2   Head3   Head4   ... Head8
         │       │       │       │           │
         ▼       ▼       ▼       ▼           ▼
        W_Q     W_Q     W_Q     W_Q        W_Q  (每头独立)
         │       │       │       │           │
         ▼       ▼       ▼       ▼           ▼
         Q₁      Q₂      Q₃      Q₄   ...   Q₈
         │       │       │       │           │
         └───────┴───────┴───────┴───────────┘
                         │
                    ┌────┴────┐
                    │         │
                    ▼         ▼
                   W_K       W_V   ◄─── 所有头共享 1 组 K/V
                    │         │
                    ▼         ▼
                    K         V    (只有 1 组！)

KV Cache: 1 group × 2 (K+V) × T × d_head = 2×T×d_head
          节省: 8倍 ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Grouped-Query Attention (GQA) - 平衡方案（Llama 2, Mistral）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

输入 X [batch, seq_len, d_model]
         │
         ├───────┬───────┬───────┬───────┐
         │       │       │       │       │
         ▼       ▼       ▼       ▼       ▼
       Head1   Head2   Head3   Head4   ... Head8
         │       │       │       │           │
         ▼       ▼       ▼       ▼           ▼
        W_Q     W_Q     W_Q     W_Q        W_Q  (每头独立)
         │       │       │       │           │
         ▼       ▼       ▼       ▼           ▼
         Q₁      Q₂      Q₃      Q₄   ...   Q₈
         │       │       │       │           │
         └───┬───┘       └───┬───┘           │
             │               │               │
        Group 1         Group 2         Group 4
             │               │               │
        ┌────┴────┐     ┌────┴────┐     ┌────┴────┐
        │         │     │         │     │         │
        ▼         ▼     ▼         ▼     ▼         ▼
       W_K       W_V   W_K       W_V   W_K       W_V
        │         │     │         │     │         │
        ▼         ▼     ▼         ▼     ▼         ▼
        K₁        V₁    K₂        V₂    K₄        V₄
          ▲              ▲              ▲
          └──┬───────────┴──┬───────────┘
             │              │
        Head1,2共享    Head3,4共享   ... (每 2 头共享 1 组)

KV Cache: 4 groups × 2 (K+V) × T × d_head = 8×T×d_head
          节省: 2倍 ✓  质量损失: 最小 ✓

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

性能对比表（Llama 2 配置：32 Heads → 8 Groups）
┌───────────┬────────┬────────────┬───────────┬────────────┐
│ 架构      │KV头数  │KV Cache    │ 相对MHA   │ 质量损失   │
├───────────┼────────┼────────────┼───────────┼────────────┤
│ MHA       │ 32     │ 64×T×dₕ    │ 1.0×      │ 0% (基准)  │
│ GQA (8组) │ 8      │ 16×T×dₕ    │ 0.25×     │ <1% ✓      │
│ MQA (1组) │ 1      │ 2×T×dₕ     │ 0.03×     │ 3-5% ✗     │
└───────────┴────────┴────────────┴───────────┴────────────┘

实际案例（Llama 2 70B, Context=4096, Batch=32）：
  MHA:  342 GB  (不可行)
  GQA:   86 GB  (可行！) ← Llama 2 实际采用
  MQA:   11 GB  (质量下降明显)

📊 面试重点：
1. GQA 的 num_groups 如何选择？
   答：通常为 num_heads 的 1/4 或 1/8（如 32→8, 64→8）
   
2. 为什么不直接用 MQA？
   答：MQA 压缩过度，质量损失 3-5%；GQA 在显存和质量间平衡最佳
   
3. GQA 如何分组？
   答：连续的 heads 共享 KV（如 Head0-3 共享 K₁V₁，Head4-7 共享 K₂V₂）
```


### 13.1 问题提出：KV Cache 的显存瓶颈

#### 自回归生成的推理过程

在生成任务中（如 GPT），模型逐个 Token 生成：

**Step 1**: 输入 "我 爱" → 生成 "吃"  
**Step 2**: 输入 "我 爱 吃" → 生成 "鱼"  
**Step 3**: 输入 "我 爱 吃 鱼" → 生成 <EOS>

**问题**：每次都要重新计算前面所有 Token 的 $K, V$，计算量巨大！

#### KV Cache 优化

**核心思想**：缓存已计算的 $K, V$，避免重复计算。

**Step 1**: 计算 $K_0, V_0$（"我"）和 $K_1, V_1$（"爱"），**缓存**  
**Step 2**: 只计算新 Token "吃" 的 $K_2, V_2$，拼接到缓存  
**Step 3**: 只计算新 Token "鱼" 的 $K_3, V_3$，拼接到缓存

**显存占用**：

对于序列长度 $T$，需要存储：

$$\text{KV Cache} = 2 \times \text{num\_layers} \times \text{num\_heads} \times T \times d_{head}$$

**具体例子**（Llama 2 70B）：

- $\text{num\_layers} = 80$
- $\text{num\_heads} = 64$
- $d_{head} = 128$
- $T = 4096$（上下文长度）
- 精度：FP16（2 bytes）

$$\text{KV Cache} = 2 \times 80 \times 64 \times 4096 \times 128 \times 2 \text{ bytes} = 10.7 \text{ GB}$$

**单个请求就要 10.7 GB！** 如果 Batch=32，需要 **342 GB** 显存（不可接受）。

### 13.2 Multi-Head Attention (MHA) 回顾

#### 标准 MHA 结构

每个头都有**独立的** $W_Q, W_K, W_V$：

$$Q^{(h)} = X W_Q^{(h)}, \quad K^{(h)} = X W_K^{(h)}, \quad V^{(h)} = X W_V^{(h)}$$

**参数量**（每层）：

$$3 \times \text{num\_heads} \times d_{head} \times d_{model}$$

**KV Cache 占用**（推理时）：

$$2 \times \text{num\_heads} \times T \times d_{head}$$

**问题**：$\text{num\_heads}$ 越大（如 64），KV Cache 越大。

### 13.3 Multi-Query Attention (MQA)：极端压缩

#### 核心思想

**所有头共享同一组 K 和 V**，只有 Q 是多头的。

#### 公式定义

- **Q**（多头）：每个头独立

$$Q^{(h)} = X W_Q^{(h)} \quad \text{for } h = 1, 2, ..., H$$

- **K, V**（共享）：只有一组

$$K = X W_K, \quad V = X W_V$$

**Attention 计算**（每个头）：

$$\text{head}^{(h)} = \text{softmax}\left(\frac{Q^{(h)} K^T}{\sqrt{d_k}}\right) V$$

#### 维度分析

假设 $H = 8$ 头，$d_{model} = 512$，$d_{head} = 64$。

**标准 MHA**：

- $Q$: $8$ 个，每个 $[T, 64]$
- $K$: $8$ 个，每个 $[T, 64]$
- $V$: $8$ 个，每个 $[T, 64]$

**MQA**：

- $Q$: $8$ 个，每个 $[T, 64]$
- $K$: **1** 个，$[T, 64]$
- $V$: **1** 个，$[T, 64]$

#### 显存节省

**KV Cache 占用**：

$$\text{MHA}: \quad 2 \times H \times T \times d_{head}$$

$$\text{MQA}: \quad 2 \times 1 \times T \times d_{head}$$

**节省比例**：$\frac{\text{MQA}}{\text{MHA}} = \frac{1}{H}$

对于 $H=64$，**节省 64 倍显存**！

#### 代价：性能下降

**问题**：所有头共享同一组 $K, V$，表达能力下降。

**实验结果**（PaLM 论文）：

- MQA 比 MHA **困惑度（Perplexity）高 0.2-0.5**（性能略差）
- 但推理速度快 **3-5 倍**（显存瓶颈缓解）

### 13.4 Grouped-Query Attention (GQA)：折中方案

#### 核心思想

**将头分组**，每组共享一组 $K, V$。

#### 公式定义

假设 $H = 8$ 头，分成 $G = 2$ 组，每组 $H/G = 4$ 头。

**分组**：

- **Group 1**: Head 0, 1, 2, 3 → 共享 $K_1, V_1$
- **Group 2**: Head 4, 5, 6, 7 → 共享 $K_2, V_2$

**公式**：

$$Q^{(h)} = X W_Q^{(h)} \quad \text{for } h = 0, 1, ..., 7$$

$$K^{(g)} = X W_K^{(g)}, \quad V^{(g)} = X W_V^{(g)} \quad \text{for } g = 0, 1$$

**Attention 计算**：

- Head 0-3 使用 $K_0, V_0$
- Head 4-7 使用 $K_1, V_1$

#### 维度分析（$H=8, G=2$）

**标准 MHA**：

- $Q$: 8 个
- $K$: 8 个
- $V$: 8 个

**GQA**：

- $Q$: 8 个
- $K$: **2 个**（每组一个）
- $V$: **2 个**（每组一个）

**MQA**：

- $Q$: 8 个
- $K$: **1 个**
- $V$: **1 个**

#### 显存 vs 性能权衡

| 方案        | KV Cache | 性能（Perplexity） | 代表模型          |
| ----------- | -------- | ------------------ | ----------------- |
| **MHA**     | $2HT d$  | 最优（基准）       | GPT-3, BERT       |
| **GQA**     | $2GT d$  | 接近 MHA（-0.1）   | **Llama 2**, Mistral |
| **MQA**     | $2T d$   | 略差（-0.3）       | PaLM, Falcon      |

**结论**：

- **GQA 是最佳折中**：显存节省 $H/G$ 倍，性能几乎无损。
- **Llama 2 70B** 使用 $H=64, G=8$（每组 8 头），KV Cache 节省 **8 倍**。

### 13.5 代码实现对比

#### 标准 MHA

```python
import torch
import torch.nn as nn

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super().__init__()
        self.num_heads = num_heads
        self.d_head = d_model // num_heads
        
        # 每个头独立的 Q, K, V
        self.W_Q = nn.Linear(d_model, d_model)  # → [d_model, num_heads * d_head]
        self.W_K = nn.Linear(d_model, d_model)
        self.W_V = nn.Linear(d_model, d_model)
        self.W_O = nn.Linear(d_model, d_model)
    
    def forward(self, x):
        batch, seq_len, d_model = x.shape
        
        # 投影 + 分头
        Q = self.W_Q(x).view(batch, seq_len, self.num_heads, self.d_head).transpose(1, 2)
        K = self.W_K(x).view(batch, seq_len, self.num_heads, self.d_head).transpose(1, 2)
        V = self.W_V(x).view(batch, seq_len, self.num_heads, self.d_head).transpose(1, 2)
        # 形状: [batch, num_heads, seq_len, d_head]
        
        # Attention
        scores = torch.matmul(Q, K.transpose(-2, -1)) / (self.d_head ** 0.5)
        attn = torch.softmax(scores, dim=-1)
        out = torch.matmul(attn, V)  # [batch, num_heads, seq_len, d_head]
        
        # 拼接
        out = out.transpose(1, 2).contiguous().view(batch, seq_len, d_model)
        return self.W_O(out)
```

#### MQA

```python
class MultiQueryAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super().__init__()
        self.num_heads = num_heads
        self.d_head = d_model // num_heads
        
        # Q 是多头的
        self.W_Q = nn.Linear(d_model, d_model)
        
        # K, V 只有一组（共享）
        self.W_K = nn.Linear(d_model, self.d_head)  # ← 注意：只输出 d_head
        self.W_V = nn.Linear(d_model, self.d_head)
        
        self.W_O = nn.Linear(d_model, d_model)
    
    def forward(self, x):
        batch, seq_len, d_model = x.shape
        
        # Q: 多头
        Q = self.W_Q(x).view(batch, seq_len, self.num_heads, self.d_head).transpose(1, 2)
        # [batch, num_heads, seq_len, d_head]
        
        # K, V: 单头（所有 Q 头共享）
        K = self.W_K(x).unsqueeze(1)  # [batch, 1, seq_len, d_head]
        V = self.W_V(x).unsqueeze(1)  # [batch, 1, seq_len, d_head]
        
        # Attention（K, V 会广播到所有头）
        scores = torch.matmul(Q, K.transpose(-2, -1)) / (self.d_head ** 0.5)
        attn = torch.softmax(scores, dim=-1)
        out = torch.matmul(attn, V)  # [batch, num_heads, seq_len, d_head]
        
        # 拼接
        out = out.transpose(1, 2).contiguous().view(batch, seq_len, d_model)
        return self.W_O(out)
```

#### GQA

```python
class GroupedQueryAttention(nn.Module):
    def __init__(self, d_model, num_heads, num_groups):
        super().__init__()
        assert num_heads % num_groups == 0, "num_heads 必须能被 num_groups 整除"
        
        self.num_heads = num_heads
        self.num_groups = num_groups
        self.heads_per_group = num_heads // num_groups
        self.d_head = d_model // num_heads
        
        # Q: 多头
        self.W_Q = nn.Linear(d_model, d_model)
        
        # K, V: 每组一个
        self.W_K = nn.Linear(d_model, num_groups * self.d_head)
        self.W_V = nn.Linear(d_model, num_groups * self.d_head)
        
        self.W_O = nn.Linear(d_model, d_model)
    
    def forward(self, x):
        batch, seq_len, d_model = x.shape
        
        # Q: [batch, num_heads, seq_len, d_head]
        Q = self.W_Q(x).view(batch, seq_len, self.num_heads, self.d_head).transpose(1, 2)
        
        # K, V: [batch, num_groups, seq_len, d_head]
        K = self.W_K(x).view(batch, seq_len, self.num_groups, self.d_head).transpose(1, 2)
        V = self.W_V(x).view(batch, seq_len, self.num_groups, self.d_head).transpose(1, 2)
        
        # 扩展 K, V 到所有头（每组的头共享同一组 K, V）
        K = K.repeat_interleave(self.heads_per_group, dim=1)  # [batch, num_heads, seq_len, d_head]
        V = V.repeat_interleave(self.heads_per_group, dim=1)
        
        # Attention
        scores = torch.matmul(Q, K.transpose(-2, -1)) / (self.d_head ** 0.5)
        attn = torch.softmax(scores, dim=-1)
        out = torch.matmul(attn, V)  # [batch, num_heads, seq_len, d_head]
        
        # 拼接
        out = out.transpose(1, 2).contiguous().view(batch, seq_len, d_model)
        return self.W_O(out)

# 使用示例（Llama 2 配置）
d_model = 8192   # Llama 2 70B
num_heads = 64
num_groups = 8   # GQA-8

gqa = GroupedQueryAttention(d_model, num_heads, num_groups)
x = torch.randn(2, 100, d_model)
out = gqa(x)
print(f"输出形状: {out.shape}")  # [2, 100, 8192]

# KV Cache 节省计算
kv_cache_mha = 2 * num_heads * 100 * (d_model // num_heads)
kv_cache_gqa = 2 * num_groups * 100 * (d_model // num_heads)
print(f"MHA KV Cache: {kv_cache_mha / 1e6:.2f} MB")
print(f"GQA KV Cache: {kv_cache_gqa / 1e6:.2f} MB")
print(f"节省比例: {kv_cache_mha / kv_cache_gqa:.1f}x")
```

### 13.6 Llama 2 的 GQA 配置

| 模型          | $d_{model}$ | $\text{num\_heads}$ | $\text{num\_groups}$ | KV Cache 节省 |
| ------------- | ----------- | ------------------- | -------------------- | ------------- |
| **Llama 2 7B**  | 4096        | 32                  | 32（MHA）            | 1x（基准）    |
| **Llama 2 13B** | 5120        | 40                  | 40（MHA）            | 1x            |
| **Llama 2 70B** | 8192        | 64                  | **8（GQA-8）**       | **8x**        |

**关键观察**：

- **小模型**（7B, 13B）使用 MHA（性能优先）
- **大模型**（70B）使用 GQA-8（显存优先，否则推理不可行）

### 13.7 训练 vs 推理的区别

#### 训练时

- **并行计算**：一次性处理整个序列，不需要 KV Cache
- **MHA, GQA, MQA 计算量相同**（只是参数量不同）
- **主要瓶颈**：前向+反向传播的激活值显存

#### 推理时

- **自回归生成**：逐 Token 生成，需要 KV Cache
- **MQA/GQA 显著优于 MHA**（显存占用小，Batch 更大）
- **主要瓶颈**：KV Cache 显存

**面试重点**：MQA/GQA 主要优化**推理**，训练收益有限。

### 13.8 DeepSeek MLA (Multi-Head Latent Attention)：极致压缩
> **2025 国内面试必考题**：DeepSeek-V2/V3 的核心创新。

#### 核心思想
MQA/GQA 虽然减少了 KV Cache，但也损失了部分性能。DeepSeek 提出的 MLA 旨在**同时实现 MQA 的显存占用和 MHA 的性能**。

#### 机制：低秩键值联合压缩 (Low-Rank Key-Value Joint Compression)
MLA 不直接存储巨大的 KV 矩阵，而是将其投影到一个**低秩潜在向量 (Latent Vector)** 中。

**公式**：
1. **压缩**：将输入 $h_t$ 投影到低秩向量 $c_{KV}$ (维度 $d_c \ll d_{model}$)。
   $$c_{KV} = h_t W_{DKV}$$
2. **解压**：生成 $K$ and $V$ (在计算 Attention 时动态生成，或吸收到投影矩阵中)。
   $$K = c_{KV} W_{UK}, \quad V = c_{KV} W_{UV}$$

#### 为什么强？
- **显存占用**：KV Cache 只需要存储压缩后的 $c_{KV}$，大小极小（甚至小于 MQA）。
- **性能**：由于解压后的 $K, V$ 是多头的（通过 $W_{UK}, W_{UV}$ 生成），它保留了 MHA 的表达能力。
- **RoPE 解耦**：MLA 巧妙地将 RoPE 相关的部分独立出来，避免了压缩对位置信息的破坏。

**结论**：MLA 是当前 KV Cache 压缩的**终极方案**，DeepSeek-V3 借此实现了超高的推理吞吐量。

### 📊 面试考点

#### Q1: MQA 和 GQA 解决什么问题？

**A**: 解决**推理时的 KV Cache 显存爆炸**问题。

- **背景**：自回归生成需要缓存所有 Token 的 $K, V$，显存占用 $\propto \text{num\_heads} \times T$
- **MQA**：所有头共享一组 $K, V$，显存减少 $H$ 倍（但性能下降 0.3-0.5 Perplexity）
- **GQA**：头分组共享 $K, V$，显存减少 $H/G$ 倍，性能几乎无损（Llama 2 的选择）

#### Q2: MHA, MQA, GQA 的区别？

**A**: 

| 方案    | Q 数量 | K 数量 | V 数量 | KV Cache | 性能         |
| ------- | ------ | ------ | ------ | -------- | ------------ |
| **MHA** | $H$    | $H$    | $H$    | $2HTd$   | 最优（基准） |
| **GQA** | $H$    | $G$    | $G$    | $2GTd$   | 接近 MHA     |
| **MQA** | $H$    | 1      | 1      | $2Td$    | 略差 -0.3    |

其中 $H$ = num_heads, $G$ = num_groups, $T$ = 序列长度, $d$ = head 维度。

#### Q3: Llama 2 70B 为什么用 GQA-8？

**A**: 

**显存压力**：

- 如果用 MHA（64 头），单个请求 KV Cache = 10.7 GB
- Batch=32 需要 342 GB，单卡 A100（80GB）无法承载

**GQA-8 方案**：

- 64 头分成 8 组，KV Cache 减少 8 倍 → 单请求 1.3 GB
- Batch=32 只需 42 GB，可以在单卡 A100 上运行

**性能损失**：几乎无（Perplexity 下降 < 0.1）

#### Q4: MQA/GQA 对训练有帮助吗？

**A**: **帮助有限**。

- **训练时**：整个序列并行计算，不需要 KV Cache，MHA/GQA 计算量几乎相同
- **推理时**：逐 Token 生成，GQA 显存节省显著，可以增大 Batch Size，提升吞吐量

**结论**：MQA/GQA 主要优化**推理效率**，训练收益主要是减少参数量（略微减少显存和计算）。

#### Q5: (Hard) GQA 如何实现 "repeat_interleave"？

**A**: 

**目标**：将 $K, V$ 从 $[batch, G, T, d]$ 扩展到 $[batch, H, T, d]$，使得每组的 $H/G$ 个头共享同一组 $K, V$。

**方法**：`repeat_interleave(self.heads_per_group, dim=1)`

**示例**（$G=2, H=8, \text{heads\_per\_group}=4$）：

```python
K = torch.tensor([
    [[1], [2]]  # Group 0, Group 1
])  # 形状: [1, 2, 1]

K_expanded = K.repeat_interleave(4, dim=1)
# 结果: [[1], [1], [1], [1], [2], [2], [2], [2]]
# 形状: [1, 8, 1]
```

**物理意义**：

- Head 0-3 都使用 Group 0 的 $K$（值为 1）
- Head 4-7 都使用 Group 1 的 $K$（值为 2）


## 14. RoPE 位置编码：旋转式相对位置（Llama 核心）

RoPE (Rotary Position Embedding) 是 2021 年提出的位置编码方案，被 Llama、Qwen、Baichuan 等几乎所有主流开源 LLM 采用，是 **2023-2024 年的工业标准**。

### 14.1 问题提出：绝对位置编码的局限

#### 回顾 Sinusoidal PE

原始 Transformer 的位置编码：

$$PE(pos) = [\sin(\omega_0 pos), \cos(\omega_0 pos), \sin(\omega_1 pos), \cos(\omega_1 pos), ...]$$

**问题**：

1. **绝对位置**：$PE(pos)$ 只编码"我在第几个位置"，不直接编码相对位置信息（如"我和你距离 3 个词"）
2. **外推性差**：训练时序列长度 512，推理时 2048 → 性能下降
3. **加法混合**：$X + PE$ 把词义和位置信息混在一起，分离困难

#### 相对位置编码的动机

**直觉**：语言中很多模式是**相对的**，而非绝对的。

- **例子**："主语-动词"的距离（相对位置 +1）比绝对位置（第 2 个词 vs 第 3 个词）更重要
- **需求**：Attention Score $QK^T$ 应该直接包含相对位置信息

### 14.2 RoPE 的核心思想

#### 目标

设计一种编码方式，使得：

$$\langle f_q(x_m, m), f_k(x_n, n) \rangle = g(x_m, x_n, m-n)$$

**物理意义**：

- 左侧：位置 $m$ 的 Query 和位置 $n$ 的 Key 的内积
- 右侧：只依赖**相对位置** $m-n$（不依赖绝对位置 $m, n$）

#### 数学解法：2D 旋转矩阵

在 **2 维复平面**上，RoPE 通过**旋转**来编码位置。

**2D 情况**（$d=2$）：

将向量 $q = [q_0, q_1]$ 看作复数 $q_0 + i q_1$，位置 $m$ 的编码是**旋转角度** $m\theta$：

$$f_q(q, m) = \begin{bmatrix} \cos(m\theta) & -\sin(m\theta) \\ \sin(m\theta) & \cos(m\theta) \end{bmatrix} \begin{bmatrix} q_0 \\ q_1 \end{bmatrix}$$

同理，位置 $n$ 的 Key：

$$f_k(k, n) = \begin{bmatrix} \cos(n\theta) & -\sin(n\theta) \\ \sin(n\theta) & \cos(n\theta) \end{bmatrix} \begin{bmatrix} k_0 \\ k_1 \end{bmatrix}$$

**内积计算**：

$$\langle f_q(q, m), f_k(k, n) \rangle = q^T R_{\theta}^T(m) R_{\theta}(n) k = q^T R_{\theta}(n-m) k$$

**关键性质**：旋转矩阵的性质 $R(\alpha)^T R(\beta) = R(\beta - \alpha)$

**结论**：内积**只依赖相对位置** $m-n$！

#### 高维推广（$d > 2$）

将 $d$ 维向量分成 $d/2$ 对，每对独立旋转（不同的旋转频率）：

$$f(x, m) = \begin{bmatrix} R_{\theta_0}(m) & 0 & 0 & ... \\ 0 & R_{\theta_1}(m) & 0 & ... \\ 0 & 0 & R_{\theta_2}(m) & ... \\ ... \end{bmatrix} \begin{bmatrix} x_0 \\ x_1 \\ x_2 \\ x_3 \\ ... \end{bmatrix}$$

其中：

$$R_{\theta_i}(m) = \begin{bmatrix} \cos(m\theta_i) & -\sin(m\theta_i) \\ \sin(m\theta_i) & \cos(m\theta_i) \end{bmatrix}$$

**旋转频率**（类似 Sinusoidal PE）：

$$\theta_i = 10000^{-2i/d}$$

### 14.3 RoPE 的数学公式（完整版）

<details>
<summary>🧮 <strong>Math Walkthrough: RoPE 旋转推导</strong> (点击展开)</summary>
<blockquote>
  <p><strong>目标：</strong> 我们希望内积 $\langle q, k \rangle$ 只包含相对位置 $(m-n)$。</p>
  <p><strong>Step 1: 复数表示</strong><br>
  将 2D 向量 $[x, y]$ 看作复数 $z = x + iy = r e^{i\phi}$。<br>
  旋转位置 $m$ 相当于乘以 $e^{im\theta}$。<br>
  $q_m = q \cdot e^{im\theta}$<br>
  $k_n = k \cdot e^{in\theta}$</p>
  <p><strong>Step 2: 计算内积 (共轭相乘)</strong><br>
  在复数中，内积对应 $q \cdot k^*$ (其中 * 是共轭)。<br>
  $\langle q_m, k_n \rangle = \text{Re}(q_m \cdot k_n^*)$<br>
  $= \text{Re}((q e^{im\theta}) \cdot (k e^{in\theta})^*)$<br>
  $= \text{Re}(q e^{im\theta} \cdot k^* e^{-in\theta})$<br>
  $= \text{Re}(q k^* \cdot e^{i(m-n)\theta})$</p>
  <p><strong>Step 3: 欧拉公式展开</strong><br>
  $e^{i(m-n)\theta} = \cos((m-n)\theta) + i\sin((m-n)\theta)$</p>
  <p><strong>结论：</strong> 结果中只出现了 $(m-n)$，绝对位置 $m$ 和 $n$ 消失了！这就是 RoPE 能捕捉相对位置的数学本质。</p>
</blockquote>
</details>

#### 符号定义

- $q, k \in \mathbb{R}^d$：Query 和 Key 向量（某个头的某个 Token）
- $m, n$：位置索引
- $d$：向量维度（必须是偶数）

#### 旋转矩阵

对于维度 $i$ 和 $i+1$（第 $i/2$ 对）：

$$\begin{bmatrix} q_i^{(m)} \\ q_{i+1}^{(m)} \end{bmatrix} = \begin{bmatrix} \cos(m\theta_i) & -\sin(m\theta_i) \\ \sin(m\theta_i) & \cos(m\theta_i) \end{bmatrix} \begin{bmatrix} q_i \\ q_{i+1} \end{bmatrix}$$

其中 $\theta_i = 10000^{-2i/d}$。

#### 内积公式

$$q^{(m)} \cdot k^{(n)} = \sum_{i=0}^{d/2-1} \left[ q_i k_i \cos((m-n)\theta_i) + (q_i k_{i+1} - q_{i+1} k_i) \sin((m-n)\theta_i) + q_{i+1} k_{i+1} \cos((m-n)\theta_i) \right]$$

**关键观察**：内积结果**只包含** $(m-n)$，不包含 $m$ 或 $n$ 单独出现。

### 14.4 RoPE 的实现（程序视角）

#### 朴素实现（矩阵乘法）

```python
import torch
import math

def rope_naive(q, k, positions):
    """
    RoPE 朴素实现
    
    Args:
        q: [batch, seq_len, d_head] Query
        k: [batch, seq_len, d_head] Key
        positions: [seq_len] 位置索引（0, 1, 2, ...）
    
    Returns:
        q_rot, k_rot: 旋转后的 Q, K
    """
    batch, seq_len, d_head = q.shape
    assert d_head % 2 == 0, "d_head 必须是偶数"
    
    # 生成旋转频率
    theta = 10000 ** (-torch.arange(0, d_head, 2).float() / d_head)  # [d_head/2]
    
    # 计算旋转角度 (位置 × 频率)
    angles = positions.unsqueeze(-1) * theta.unsqueeze(0)  # [seq_len, d_head/2]
    
    # 构造旋转矩阵（分块）
    cos_angles = torch.cos(angles)  # [seq_len, d_head/2]
    sin_angles = torch.sin(angles)
    
    # 应用旋转（逐对处理）
    q_rot = torch.zeros_like(q)
    k_rot = torch.zeros_like(k)
    
    for i in range(d_head // 2):
        # 提取第 i 对（维度 2i 和 2i+1）
        q_0 = q[:, :, 2*i]
        q_1 = q[:, :, 2*i+1]
        k_0 = k[:, :, 2*i]
        k_1 = k[:, :, 2*i+1]
        
        # 旋转矩阵应用
        q_rot[:, :, 2*i] = q_0 * cos_angles[:, i] - q_1 * sin_angles[:, i]
        q_rot[:, :, 2*i+1] = q_0 * sin_angles[:, i] + q_1 * cos_angles[:, i]
        
        k_rot[:, :, 2*i] = k_0 * cos_angles[:, i] - k_1 * sin_angles[:, i]
        k_rot[:, :, 2*i+1] = k_0 * sin_angles[:, i] + k_1 * cos_angles[:, i]
    
    return q_rot, k_rot
```

#### 高效实现（向量化）

```python
def rope_efficient(q, k, positions):
    """
    RoPE 高效实现（无循环）
    
    Args:
        q, k: [batch, seq_len, d_head]
        positions: [seq_len]
    
    Returns:
        q_rot, k_rot
    """
    batch, seq_len, d_head = q.shape
    
    # 旋转频率
    theta = 10000 ** (-torch.arange(0, d_head, 2).float() / d_head)
    
    # 角度矩阵 [seq_len, d_head/2]
    angles = positions.unsqueeze(-1) * theta.unsqueeze(0)
    cos = torch.cos(angles).unsqueeze(0).unsqueeze(-1)  # [1, seq_len, d_head/2, 1]
    sin = torch.sin(angles).unsqueeze(0).unsqueeze(-1)
    
    # 重塑 Q, K 为 [batch, seq_len, d_head/2, 2]
    q_pairs = q.view(batch, seq_len, d_head // 2, 2)
    k_pairs = k.view(batch, seq_len, d_head // 2, 2)
    
    # 提取偶数和奇数维度
    q_even = q_pairs[..., 0:1]  # [batch, seq_len, d_head/2, 1]
    q_odd = q_pairs[..., 1:2]
    k_even = k_pairs[..., 0:1]
    k_odd = k_pairs[..., 1:2]
    
    # 旋转（向量化）
    q_rot_pairs = torch.cat([
        q_even * cos - q_odd * sin,
        q_even * sin + q_odd * cos
    ], dim=-1)
    
    k_rot_pairs = torch.cat([
        k_even * cos - k_odd * sin,
        k_even * sin + k_odd * cos
    ], dim=-1)
    
    # 恢复形状
    q_rot = q_rot_pairs.view(batch, seq_len, d_head)
    k_rot = k_rot_pairs.view(batch, seq_len, d_head)
    
    return q_rot, k_rot

# 使用示例
batch_size = 2
seq_len = 10
d_head = 64

q = torch.randn(batch_size, seq_len, d_head)
k = torch.randn(batch_size, seq_len, d_head)
positions = torch.arange(seq_len)

q_rot, k_rot = rope_efficient(q, k, positions)

print(f"原始 Q: {q.shape}")         # [2, 10, 64]
print(f"旋转后 Q: {q_rot.shape}")   # [2, 10, 64]

# 验证相对位置性质
attn_before = torch.matmul(q, k.transpose(-2, -1))  # 无 RoPE
attn_after = torch.matmul(q_rot, k_rot.transpose(-2, -1))  # 有 RoPE

print(f"Attention Score 形状: {attn_after.shape}")  # [2, 10, 10]
```

### 14.5 RoPE 的优势

#### 1. 相对位置编码

**数学保证**：$\langle q^{(m)}, k^{(n)} \rangle$ 只依赖 $m-n$。

**实验验证**：

- 位置 0 的 Token 和位置 5 的 Token 的 Attention Score
- = 位置 10 的 Token 和位置 15 的 Token 的 Attention Score（相对距离都是 5）

#### 2. 线性外推性（Linear Interpolation）

**问题**：训练时序列长度 2048，推理时想用 4096 怎么办？

**方案**：缩放位置索引

$$\text{positions} = \text{positions} \times \frac{2048}{4096} = \text{positions} \times 0.5$$

**效果**：

- 原本位置 4000 → 缩放后相当于位置 2000（在训练范围内）
- Llama 2 使用此技巧将上下文从 4K 扩展到 32K

#### 3. 无额外参数

**对比**：

- **Sinusoidal PE**：预计算的常量矩阵
- **Learned PE**：$n \times d$ 个可学习参数
- **RoPE**：无额外参数（只有计算，旋转角度由位置和频率动态生成）

#### 4. 计算效率

**复杂度**：$O(nd)$（与 Sinusoidal PE 相同）

**GPU 友好**：旋转操作是逐元素的，易于并行化

### 14.6 RoPE vs 其他位置编码

| 方案              | 类型   | 相对位置 | 外推性 | 参数量        | 代表模型          |
| ----------------- | ------ | -------- | ------ | ------------- | ----------------- |
| **Sinusoidal PE** | 绝对   | ✗        | 中等   | 0（常量）     | Transformer (2017) |
| **Learned PE**    | 绝对   | ✗        | 差     | $n \times d$  | BERT, GPT-2       |
| **ALiBi**         | 相对   | ✓        | **优** | 0             | BLOOM             |
| **RoPE**          | 相对   | ✓        | 优     | 0             | **Llama, Qwen, Baichuan** |
| **xPos**          | 相对   | ✓        | **优** | 0             | -                 |

**工业选择**：

- **2021-2022**：RoPE 开始流行（GPT-NeoX）
- **2023-2024**：RoPE 成为开源 LLM 标配（Llama, Qwen, Mistral）

### 14.7 RoPE 的实战配置（Llama 2）

```python
class LlamaAttentionWithRoPE(nn.Module):
    def __init__(self, d_model=4096, num_heads=32, max_seq_len=4096):
        super().__init__()
        self.num_heads = num_heads
        self.d_head = d_model // num_heads
        
        # Q, K, V 投影
        self.W_Q = nn.Linear(d_model, d_model)
        self.W_K = nn.Linear(d_model, d_model)
        self.W_V = nn.Linear(d_model, d_model)
        self.W_O = nn.Linear(d_model, d_model)
        
        # RoPE 频率（预计算）
        self.register_buffer(
            'theta',
            10000 ** (-torch.arange(0, self.d_head, 2).float() / self.d_head)
        )
    
    def apply_rope(self, q, k, positions):
        """应用 RoPE"""
        batch, num_heads, seq_len, d_head = q.shape
        
        # 角度
        angles = positions.unsqueeze(-1) * self.theta.unsqueeze(0)
        cos = torch.cos(angles).unsqueeze(0).unsqueeze(0)  # [1, 1, seq_len, d_head/2]
        sin = torch.sin(angles).unsqueeze(0).unsqueeze(0)
        
        # 重塑为对
        q_pairs = q.view(batch, num_heads, seq_len, d_head // 2, 2)
        k_pairs = k.view(batch, num_heads, seq_len, d_head // 2, 2)
        
        # 旋转
        q_even, q_odd = q_pairs[..., 0], q_pairs[..., 1]
        k_even, k_odd = k_pairs[..., 0], k_pairs[..., 1]
        
        q_rot = torch.stack([
            q_even * cos - q_odd * sin,
            q_even * sin + q_odd * cos
        ], dim=-1).view(batch, num_heads, seq_len, d_head)
        
        k_rot = torch.stack([
            k_even * cos - k_odd * sin,
            k_even * sin + k_odd * cos
        ], dim=-1).view(batch, num_heads, seq_len, d_head)
        
        return q_rot, k_rot
    
    def forward(self, x, positions=None):
        batch, seq_len, d_model = x.shape
        
        if positions is None:
            positions = torch.arange(seq_len, device=x.device)
        
        # 投影
        Q = self.W_Q(x).view(batch, seq_len, self.num_heads, self.d_head).transpose(1, 2)
        K = self.W_K(x).view(batch, seq_len, self.num_heads, self.d_head).transpose(1, 2)
        V = self.W_V(x).view(batch, seq_len, self.num_heads, self.d_head).transpose(1, 2)
        
        # 应用 RoPE
        Q, K = self.apply_rope(Q, K, positions)
        
        # Attention
        scores = torch.matmul(Q, K.transpose(-2, -1)) / (self.d_head ** 0.5)
        attn = torch.softmax(scores, dim=-1)
        out = torch.matmul(attn, V)
        
        # 输出投影
        out = out.transpose(1, 2).contiguous().view(batch, seq_len, d_model)
        return self.W_O(out)
```

### 📊 面试考点

#### Q1: RoPE 解决了什么问题?

**A**: 解决了**绝对位置编码的外推性差和缺乏相对位置信息**的问题。

- **Sinusoidal/Learned PE**：编码绝对位置，训练时 512 长度，推理时 2048 → 性能下降
- **RoPE**：通过旋转编码相对位置，数学上保证 $\langle q^{(m)}, k^{(n)} \rangle$ 只依赖 $m-n$
- **外推**：可以通过线性插值扩展到更长序列（Llama 2 从 4K → 32K）

#### Q2: RoPE 的数学原理是什么?

**A**: **2D 旋转矩阵 + 高维分块旋转**。

**核心公式**（2D）：

$$\begin{bmatrix} q_0^{(m)} \\ q_1^{(m)} \end{bmatrix} = \begin{bmatrix} \cos(m\theta) & -\sin(m\theta) \\ \sin(m\theta) & \cos(m\theta) \end{bmatrix} \begin{bmatrix} q_0 \\ q_1 \end{bmatrix}$$

**关键性质**：旋转矩阵满足 $R(\alpha)^T R(\beta) = R(\beta - \alpha)$

**结果**：

$$q^{(m)} \cdot k^{(n)} = q^T R(m)^T R(n) k = q^T R(n-m) k$$

内积只依赖**相对位置** $m-n$。

#### Q3: RoPE 和 Sinusoidal PE 的区别?

**A**: 

| 特性         | Sinusoidal PE        | RoPE                   |
| ------------ | -------------------- | ---------------------- |
| **编码方式** | 加法 $X + PE$        | 旋转 $R(\theta) \cdot Q$ |
| **位置信息** | 绝对位置             | 相对位置               |
| **作用对象** | 输入 $X$             | $Q, K$（Attention 内部） |
| **外推性**   | 中等                 | 优（可线性插值）       |
| **参数量**   | 0（常量矩阵）        | 0（动态计算）          |

**关键区别**：RoPE 直接作用在 Attention 的 $Q, K$ 上，而不是加到输入 $X$ 上。

#### Q4: Llama 为什么用 RoPE?

**A**: 

1. **相对位置编码**：语言模式更依赖相对位置（"主语-动词"距离）而非绝对位置
2. **长序列外推**：Llama 2 需要支持 4K → 32K 扩展，RoPE 可以通过位置插值实现
3. **无额外参数**：不增加模型参数量和显存
4. **工业验证**：GPT-NeoX, PaLM 等大模型已验证有效性

#### Q5: (Hard) RoPE 的旋转频率为什么是 $10000^{-2i/d}$?

**A**: 

**借鉴 Sinusoidal PE**：

- 不同维度用不同频率，覆盖多个尺度（短程 + 长程依赖）
- 低维度（小 $i$）：高频旋转，捕捉邻近 Token 的细粒度位置
- 高维度（大 $i$）：低频旋转，捕捉远距离依赖

**公式**：

$$\theta_i = 10000^{-2i/d} = \frac{1}{10000^{2i/d}}$$

- $i=0$: $\theta_0 = 1$（每位置旋转 1 弧度）
- $i=d/2$: $\theta_{d/2} = 10000^{-1} = 0.0001$（旋转很慢）

**效果**：类似"时钟"，短针（低频）记录小时，长针（高频）记录分钟。


---

## 第 15 章 MoE 架构 - Mixture of Experts（稀疏激活的艺术）

### 15.1 为什么需要 MoE？动机与问题

**核心矛盾**：模型容量 vs 计算成本

**传统密集模型的困境**：

- GPT-3 (175B): 每个 token 都要过所有 175B 参数 → **计算浪费**
- 推理时 FLOPs: $O(参数量)$，无法扩展到万亿参数

**观察**：

1. **任务多样性**：不同输入需要不同"专家"（数学、文学、代码）
2. **局部激活**：每次推理只用到模型的**一小部分能力**

**MoE 思想**：

> 增加模型容量（参数量），但保持**每次激活的参数量**不变

$$\text{总参数} = E \times \text{单专家参数}, \quad \text{激活参数} = k \times \text{单专家参数}$$

- $E$: 专家数量（8, 64, 256）
- $k$: Top-K 选择（通常 $k=1$ 或 $k=2$）

**例子**：

- Mixtral 8x7B: 总参数 **47B**（8 个 7B 专家），每次激活 **13B**（2 个专家 + shared layers）
- 对比 GPT-3 175B: 每次激活 175B

### 15.2 MoE 核心组件

#### 15.2.1 符号定义

| 符号 | 含义 | 形状 | 索引含义 |
|------|------|------|----------|
| $X$ | 输入 token 表示 | $[b, n, d]$ | batch, seq_len, d_model |
| $E$ | 专家数量 | 标量 | - |
| $k$ | 激活专家数 | 标量 | 通常 $k=1$ 或 $2$ |
| $G(x_i)$ | 门控函数（Router） | $[E]$ | 第 $i$ 个 token 对所有专家的权重 |
| $Expert_j$ | 第 $j$ 个专家（FFN） | $d \to d$ | - |
| $y_i$ | 第 $i$ 个 token 的输出 | $[d]$ | - |

#### 15.2.2 MoE 层的数学定义

**标准 FFN**（密集）：

$$y_i = FFN(x_i) = W_2 \cdot \text{GELU}(W_1 x_i)$$

**MoE FFN**（稀疏）：

$$y_i = \sum_{j=1}^{E} G(x_i)_j \cdot Expert_j(x_i)$$

**Top-K 稀疏化**（仅激活 Top-K 专家）：

$$y_i = \sum_{j \in \text{TopK}(G(x_i), k)} \frac{\exp(G(x_i)_j)}{\sum_{j' \in \text{TopK}} \exp(G(x_i)_{j'})} \cdot Expert_j(x_i)$$

**流程**（程序执行视角）：

```python
# 伪代码
for token_i in range(seq_len):
    # 1. 计算门控分数
    gate_logits = Router(x[i])  # [E]
    
    # 2. Top-K 选择
    top_k_indices = TopK(gate_logits, k)  # [k]
    top_k_weights = Softmax(gate_logits[top_k_indices])  # [k]
    
    # 3. 仅对 Top-K 专家计算
    y[i] = 0
    for j in range(k):
        expert_id = top_k_indices[j]
        y[i] += top_k_weights[j] * Expert[expert_id](x[i])
```

### 15.3 门控网络（Router）设计

#### 15.3.1 门控函数

**最简单形式**（线性投影 + Softmax）：

$$G(x) = \text{Softmax}(W_g x + b_g)$$

- $W_g \in \mathbb{R}^{E \times d}$: 门控权重
- 输出 $[E]$: 对 $E$ 个专家的概率分布

**程序实现**：

```python
class Router(nn.Module):
    def __init__(self, d_model, num_experts):
        super().__init__()
        self.gate = nn.Linear(d_model, num_experts)
    
    def forward(self, x):
        # x: [batch, seq_len, d_model]
        return torch.softmax(self.gate(x), dim=-1)  # [batch, seq_len, num_experts]
```

#### 15.3.2 Top-K 路由

**为什么需要 Top-K？**

- **稀疏激活**：每次只用少数专家（降低计算）
- **负载均衡**：避免所有 token 都选同一个专家

**Top-1 vs Top-2**：

| 策略 | 优点 | 缺点 | 使用场景 |
|------|------|------|----------|
| **Top-1** | 计算最少（50% FLOPs） | 可能丢失信息 | 推理优先（Mixtral 推理模式） |
| **Top-2** | 信息融合更好 | 计算稍多 | 训练 + 高质量推理 |

**数值例子**（Top-2）：

```python
# 假设 4 个专家
gate_logits = [2.1, 0.5, 3.0, 1.2]  # Router 输出

# Top-2 选择
top_2_indices = [2, 0]  # 索引 2 和 0
top_2_logits = [3.0, 2.1]

# 归一化
top_2_weights = softmax([3.0, 2.1]) = [0.71, 0.29]

# 输出
y = 0.71 * Expert_2(x) + 0.29 * Expert_0(x)
```

### 15.4 负载均衡问题

#### 15.4.1 为什么会负载不均？

**问题**：训练初期，Router 可能让 90% token 都选 Expert_0 → 其他专家"饿死"

**后果**：

1. **计算浪费**：花钱训练 8 个专家，实际只用 1 个
2. **模型退化**：等效于单专家模型

#### 15.4.2 辅助损失（Auxiliary Loss）

**目标**：强制 Router 均匀分配 token 到各专家

**负载均衡损失**（GShard, 2020）：

$$L_{aux} = \alpha \cdot \sum_{j=1}^{E} f_j \cdot P_j$$

**符号定义**：

- $f_j = \frac{1}{N} \sum_{i=1}^{N} \mathbb{1}[\text{Expert}_j \in \text{TopK}(x_i)]$: 专家 $j$ 处理的 token 比例
- $P_j = \frac{1}{N} \sum_{i=1}^{N} G(x_i)_j$: 专家 $j$ 的平均门控概率
- $\alpha$: 权重（通常 0.01）

**直观理解**：

- 如果 $f_j$ 大（专家 $j$ 被选中多）且 $P_j$ 大（Router 给高分）→ $L_{aux}$ 大 → **惩罚**
- 迫使 Router 降低高频专家的分数

**总损失**：

$$L_{total} = L_{task} + \alpha \cdot L_{aux}$$

**梯度流向**：

$$\frac{\partial L_{total}}{\partial W_g} = \frac{\partial L_{task}}{\partial W_g} + \alpha \frac{\partial L_{aux}}{\partial W_g}$$

$L_{aux}$ 的梯度会调整 Router，使专家选择更均匀。

#### 15.4.3 Capacity Factor（容量因子）

**问题**：如果允许无限 token 进入某个专家 → **显存爆炸**

**解决**：每个专家设置**最大处理量**

$$\text{Capacity}_j = \frac{k \cdot N}{E} \cdot \text{CapacityFactor}$$

- $N$: 总 token 数
- $k$: Top-K 的 $k$
- CapacityFactor: 超额因子（1.0 ~ 1.5）

**例子**：

- $N=1024$ tokens, $E=8$ 专家, $k=2$, CapacityFactor = 1.25
- 理论平均：每个专家处理 $\frac{2 \times 1024}{8} = 256$ tokens
- 实际容量：$256 \times 1.25 = 320$ tokens

**超出容量的 token 怎么办？**

1. **丢弃**（早期做法）
2. **Fallback 到 Shared Expert**（Mixtral）
3. **动态路由**（复杂）

### 15.5 完整 MoE 层实现

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class Expert(nn.Module):
    """单个专家（标准 FFN）"""
    def __init__(self, d_model, d_ff):
        super().__init__()
        self.w1 = nn.Linear(d_model, d_ff)
        self.w2 = nn.Linear(d_ff, d_model)
    
    def forward(self, x):
        # x: [num_tokens, d_model]
        return self.w2(F.gelu(self.w1(x)))  # [num_tokens, d_model]

class MoELayer(nn.Module):
    def __init__(self, d_model, d_ff, num_experts, top_k=2):
        super().__init__()
        self.num_experts = num_experts
        self.top_k = top_k
        
        # Router
        self.gate = nn.Linear(d_model, num_experts)
        
        # Experts
        self.experts = nn.ModuleList([
            Expert(d_model, d_ff) for _ in range(num_experts)
        ])
    
    def forward(self, x):
        """
        x: [batch, seq_len, d_model]
        返回: [batch, seq_len, d_model], aux_loss
        """
        batch, seq_len, d_model = x.shape
        
        # 重塑为 [batch*seq_len, d_model]（方便处理）
        x_flat = x.view(-1, d_model)  # [N, d_model]
        N = x_flat.shape[0]
        
        # 1. 计算门控分数
        gate_logits = self.gate(x_flat)  # [N, num_experts]
        
        # 2. Top-K 选择
        top_k_logits, top_k_indices = torch.topk(gate_logits, self.top_k, dim=-1)
        # top_k_logits: [N, top_k]
        # top_k_indices: [N, top_k]
        
        # 归一化
        top_k_weights = F.softmax(top_k_logits, dim=-1)  # [N, top_k]
        
        # 3. 分发 token 到专家
        output = torch.zeros_like(x_flat)  # [N, d_model]
        
        for i in range(self.top_k):
            # 获取第 i 个选择的专家
            expert_ids = top_k_indices[:, i]  # [N]
            weights = top_k_weights[:, i:i+1]  # [N, 1]
            
            # 按专家分组处理（避免循环）
            for expert_id in range(self.num_experts):
                # 找到选择该专家的 token
                mask = (expert_ids == expert_id)  # [N]
                if not mask.any():
                    continue
                
                # 提取 token
                tokens = x_flat[mask]  # [num_tokens_for_expert, d_model]
                
                # 专家处理
                expert_out = self.experts[expert_id](tokens)  # [num_tokens_for_expert, d_model]
                
                # 加权累加回输出
                output[mask] += weights[mask] * expert_out
        
        # 4. 计算辅助损失（负载均衡）
        aux_loss = self._compute_aux_loss(gate_logits, top_k_indices)
        
        # 恢复形状
        output = output.view(batch, seq_len, d_model)
        
        return output, aux_loss
    
    def _compute_aux_loss(self, gate_logits, top_k_indices):
        """
        gate_logits: [N, num_experts]
        top_k_indices: [N, top_k]
        """
        N = gate_logits.shape[0]
        
        # f_j: 每个专家被选中的频率
        one_hot = F.one_hot(top_k_indices, self.num_experts).float()  # [N, top_k, num_experts]
        f = one_hot.sum(dim=(0, 1)) / (N * self.top_k)  # [num_experts]
        
        # P_j: 每个专家的平均门控概率
        P = gate_logits.mean(dim=0)  # [num_experts]
        P = F.softmax(P, dim=0)
        
        # 辅助损失
        aux_loss = (f * P).sum() * self.num_experts
        
        return aux_loss
```

**关键点**：

1. **分组处理**：按专家 ID 分组，避免逐 token 循环（GPU 友好）
2. **辅助损失**：与主损失一起反传，调整 Router
3. **形状追踪**：
   - 输入: `[batch, seq_len, d_model]`
   - Flatten: `[N, d_model]`
   - 输出: `[batch, seq_len, d_model]`

### 15.6 MoE 的训练挑战

#### 15.6.1 专家坍缩（Expert Collapse）

**问题**：训练中某些专家永远不被选中 → 参数不更新 → "死专家"

**原因**：

- Router 初始化不当（某些专家初始分数就低）
- 辅助损失权重太小

**解决**：

1. **Router 初始化**：Xavier/Kaiming，确保初始均匀
2. **增大 $\alpha$**：辅助损失权重 0.01 → 0.1
3. **专家丢弃**（Dropout）：训练时随机屏蔽某些专家，强制 Router 学习备选

#### 15.6.2 通信开销（分布式训练）

**问题**：不同专家可能在不同 GPU 上 → **All-to-All 通信**

**例子**（8 卡，8 专家）：

- GPU 0 的 token 可能需要 GPU 3 的 Expert_3
- 需要跨卡传输 token → **带宽瓶颈**

**优化**：

1. **专家并行**（Expert Parallelism）：每张卡负责部分专家
2. **局部性调度**：尽量让 token 路由到本地专家
3. **Tensor Parallelism + MoE**：混合切分策略

#### 15.6.3 推理优化

**问题**：推理时 Top-K 路由仍需要所有专家的参数在显存中

**优化**：

1. **动态加载**：按需加载激活的专家（慢）
2. **专家剪枝**：训练后删除低频专家
3. **蒸馏到密集模型**：MoE 教师 → 小密集模型学生

### 15.7 工业案例分析

#### 15.7.1 Mixtral 8x7B（Mistral AI, 2023）

**架构**：

- 8 个专家，每个 7B 参数
- Top-2 路由（每次激活 2 个专家）
- 32 层，每层都是 MoE FFN

**参数统计**：

- 总参数: $8 \times 7B = 56B$（实际 47B，因为 Attention 等层共享）
- 激活参数: $2 \times 7B = 14B$
- **对比 Llama 2 70B**: 性能接近，但推理速度快 **5 倍**

**训练细节**：

- 辅助损失权重: $\alpha = 0.01$
- CapacityFactor: 1.0（无溢出丢弃）

**代码结构**（Mixtral FFN）：

```python
class MixtralFFN(nn.Module):
    def __init__(self, d_model=4096, d_ff=14336, num_experts=8):
        super().__init__()
        self.moe = MoELayer(d_model, d_ff, num_experts, top_k=2)
    
    def forward(self, x):
        out, aux_loss = self.moe(x)
        return out, aux_loss
```

#### 15.7.2 Switch Transformer（Google, 2021）

**创新**：

- **Top-1 路由**（极致稀疏）
- **专家数量扩展到 2048**（T5-XXL 规模）
- 引入 Capacity Factor 机制

**性能**：

- 训练速度: 比 T5-XXL 快 **7 倍**（相同质量下）
- 参数: 1.6T（激活 ~10B）

#### 15.7.3 GPT-4（推测）

**公开信息**：

- OpenAI CEO 暗示 GPT-4 使用 MoE
- 推测 8 个专家，每个 ~200B

**证据**：

- GPT-4 推理速度异常快（相对参数量）
- 不同任务质量差异（数学专家 vs 创意专家？）

### 15.8 MoE vs 密集模型对比

| 特性 | 密集模型（GPT-3） | MoE 模型（Mixtral） |
|------|------------------|---------------------|
| **总参数** | 175B | 47B（8x7B 专家） |
| **激活参数** | 175B（全激活） | 13B（Top-2） |
| **训练成本** | 高 | 更高（通信开销） |
| **推理成本** | 高 | **低**（稀疏激活） |
| **显存占用** | 全部参数 | 全部参数（但激活少） |
| **专业化能力** | 中等 | **强**（专家分工） |
| **负载均衡** | 不需要 | 需要（辅助损失） |

### 15.9 梯度分析

#### 15.9.1 前向传播

$$y_i = \sum_{j \in \text{TopK}} w_{ij} \cdot Expert_j(x_i)$$

- $w_{ij} = \frac{\exp(g_{ij})}{\sum_{j' \in \text{TopK}} \exp(g_{ij'})}$: 归一化权重
- $g_{ij} = (W_g x_i)_j$: 门控 logit

#### 15.9.2 反向传播

**对输入 $x_i$ 的梯度**：

$$\frac{\partial L}{\partial x_i} = \sum_{j \in \text{TopK}} \left[ w_{ij} \frac{\partial Expert_j}{\partial x_i} + y_{Expert_j}(x_i) \frac{\partial w_{ij}}{\partial x_i} \right]$$

**两项来源**：

1. **专家内部梯度**：$w_{ij} \frac{\partial Expert_j}{\partial x_i}$（标准反传）
2. **Router 梯度**：$y_{Expert_j}(x_i) \frac{\partial w_{ij}}{\partial x_i}$（通过 Softmax）

**对 Router 参数 $W_g$ 的梯度**：

$$\frac{\partial L}{\partial W_g} = \sum_i \frac{\partial L}{\partial w_i} \frac{\partial w_i}{\partial g_i} \frac{\partial g_i}{\partial W_g} + \alpha \frac{\partial L_{aux}}{\partial W_g}$$

**关键**：

- **稀疏梯度**：只有 Top-K 专家收到梯度
- **辅助损失的梯度**：影响 Router，促进负载均衡

### 15.10 代码：完整 Transformer + MoE

```python
class MoETransformerLayer(nn.Module):
    def __init__(self, d_model=512, num_heads=8, d_ff=2048, num_experts=8):
        super().__init__()
        
        # Multi-Head Attention（正常层）
        self.attn = MultiHeadAttention(d_model, num_heads)
        self.norm1 = nn.LayerNorm(d_model)
        
        # MoE FFN（替代标准 FFN）
        self.moe = MoELayer(d_model, d_ff, num_experts, top_k=2)
        self.norm2 = nn.LayerNorm(d_model)
    
    def forward(self, x, mask=None):
        # Attention 子层
        attn_out = self.attn(x, x, x, mask)
        x = self.norm1(x + attn_out)
        
        # MoE FFN 子层
        moe_out, aux_loss = self.moe(x)
        x = self.norm2(x + moe_out)
        
        return x, aux_loss

class MoETransformer(nn.Module):
    def __init__(self, vocab_size, d_model=512, num_layers=6, num_experts=8):
        super().__init__()
        self.embedding = nn.Embedding(vocab_size, d_model)
        self.layers = nn.ModuleList([
            MoETransformerLayer(d_model, num_experts=num_experts)
            for _ in range(num_layers)
        ])
        self.output = nn.Linear(d_model, vocab_size)
    
    def forward(self, input_ids):
        x = self.embedding(input_ids)
        
        total_aux_loss = 0
        for layer in self.layers:
            x, aux_loss = layer(x)
            total_aux_loss += aux_loss
        
        logits = self.output(x)
        
        return logits, total_aux_loss

# 训练循环
model = MoETransformer(vocab_size=50000, num_experts=8)
optimizer = torch.optim.Adam(model.parameters())

for batch in dataloader:
    input_ids, labels = batch
    
    # 前向
    logits, aux_loss = model(input_ids)
    
    # 主损失
    task_loss = F.cross_entropy(logits.view(-1, 50000), labels.view(-1))
    
    # 总损失
    total_loss = task_loss + 0.01 * aux_loss
    
    # 反传
    optimizer.zero_grad()
    total_loss.backward()
    optimizer.step()
```

### 15.11 PEFT & LoRA：大模型的"微创手术"

#### 动机
全量微调（Full Fine-tuning）一个 175B 的模型需要消耗巨大的显存（优化器状态是参数量的 3 倍）。我们需要一种**参数高效微调 (PEFT)** 方法。

#### LoRA (Low-Rank Adaptation)
**核心假设**：模型参数的变化量 $\Delta W$ 是**低秩**的。

**公式**：
冻结预训练权重 $W_0$，只训练两个小矩阵 $A$ 和 $B$：
$$W = W_0 + \Delta W = W_0 + BA$$
其中 $A \in \mathbb{R}^{r \times d}, B \in \mathbb{R}^{d \times r}$，且秩 $r \ll d$ (如 $r=8$)。

**优点**：
1. **参数极少**：只训练 <1% 的参数。
2. **无推理延迟**：训练完成后，可以将 $BA$ 加回 $W_0$ ($W_{new} = W_0 + BA$)，推理时架构不变。
3. **多任务切换**：不同任务只需要切换不同的 $A, B$ 适配器。

**代码实现**：
```python
class LoRALayer(nn.Module):
    def __init__(self, linear, rank=8, alpha=16):
        super().__init__()
        self.linear = linear  # 冻结的原层
        self.lora_A = nn.Parameter(torch.randn(rank, linear.in_features))
        self.lora_B = nn.Parameter(torch.zeros(linear.out_features, rank))
        self.scale = alpha / rank

    def forward(self, x):
        # 原路径 + LoRA路径
        return self.linear(x) + (x @ self.lora_A.T @ self.lora_B.T) * self.scale
```

### 📊 面试考点

#### Q1: MoE 解决了什么问题？

**A**: 解决了**模型容量与计算成本的矛盾**。

**传统模型**：增加参数 → 推理计算线性增长

**MoE**：

- **稀疏激活**：总参数 47B，每次只激活 13B
- **专业化**：不同专家处理不同类型任务（数学、代码、文学）
- **高效扩展**：可以扩展到数千专家，计算仍可控

**数值对比**：

- Mixtral 8x7B: 47B 参数，推理时 13B 激活 → **与 13B 模型相同速度，质量接近 70B**

#### Q2: MoE 的核心组件有哪些？

**A**: **Router（门控）+ Experts（专家）+ Load Balancing（负载均衡）**

1. **Router**：
   - 作用: 为每个 token 选择合适的专家
   - 实现: 线性层 $W_g x$ + Softmax + Top-K
   
2. **Experts**：
   - 结构: 每个专家是标准 FFN（$d \to 4d \to d$）
   - 数量: 8 ~ 256（Mixtral 8, Switch Transformer 2048）
   
3. **负载均衡**：
   - 辅助损失: $L_{aux} = \sum_j f_j P_j$（惩罚高频专家）
   - Capacity Factor: 限制单专家最大处理量

#### Q3: Top-1 vs Top-2 路由的区别？

**A**: 

| 特性 | Top-1 | Top-2 |
|------|-------|-------|
| **激活专家数** | 1 个 | 2 个 |
| **计算量** | 最少（50% 标准 FFN） | 适中（100% 标准 FFN） |
| **信息融合** | 无融合 | 两个专家加权融合 |
| **鲁棒性** | 依赖单一专家 | 更鲁棒 |
| **使用场景** | 推理优先（Switch Transformer） | 训练 + 高质量推理（Mixtral） |

**数学**：

- Top-1: $y = Expert_{\arg\max G(x)}(x)$
- Top-2: $y = w_1 Expert_{j_1}(x) + w_2 Expert_{j_2}(x)$

#### Q4: 辅助损失（Auxiliary Loss）的作用是什么？

**A**: **防止专家负载不均**。

**问题**：

- 训练初期，Router 可能让所有 token 都选 Expert_0
- 其他专家"饿死"，参数不更新

**辅助损失**：

$$L_{aux} = \alpha \sum_{j=1}^{E} f_j \cdot P_j$$

- $f_j$: 专家 $j$ 实际处理的 token 比例（频率）
- $P_j$: Router 给专家 $j$ 的平均分数（概率）

**作用机制**：

- 如果某专家被选太多（$f_j$ 大）且 Router 给高分（$P_j$ 大）→ $L_{aux}$ 大
- 梯度反传 → 降低该专家的 Router 分数
- 迫使 Router 选择其他专家

**实战值**：$\alpha = 0.01$（GShard, Mixtral）

#### Q5: (Hard) MoE 的梯度如何流向 Router？

**A**: **两条路径：任务损失 + 辅助损失**

**前向**：

$$y_i = \sum_{j \in \text{TopK}} w_{ij} \cdot Expert_j(x_i)$$

其中 $w_{ij} = \frac{\exp(g_{ij})}{\sum_{j'} \exp(g_{ij'})}$，$g_{ij} = (W_g x_i)_j$

**反向**：

$$\frac{\partial L_{total}}{\partial W_g} = \frac{\partial L_{task}}{\partial W_g} + \alpha \frac{\partial L_{aux}}{\partial W_g}$$

**路径 1**（任务损失）：

$$L_{task} \to y_i \to w_{ij} \to g_{ij} \to W_g$$

- 通过 Softmax 的梯度：$\frac{\partial w_{ij}}{\partial g_{ij}} = w_{ij}(1 - w_{ij})$

**路径 2**（辅助损失）：

$$L_{aux} \to P_j \to \frac{1}{N}\sum_i g_{ij} \to W_g$$

- 直接影响 Router 参数，调整专家选择分布

**关键**：

- 辅助损失的梯度与任务损失**独立**
- 即使某专家从未被选中（无任务梯度），辅助损失仍能更新 Router，促进其被选中

#### Q6: MoE 为什么适合大模型？

**A**: **参数扩展与计算解耦**

1. **Scaling Law 的新维度**：
   - 传统: 参数翻倍 → 计算翻倍 → 成本翻倍
   - MoE: 专家翻倍 → 计算不变（Top-K 固定）→ **容量扩展几乎免费**

2. **专业化收益递增**：
   - 小模型: 8 个专家可能学不到明显分工
   - 大模型: 256 个专家可以细分为"Python 代码"、"数学证明"、"中文诗歌"等

3. **工程可行性**：
   - GPU 显存瓶颈: MoE 可以用**模型并行**（不同卡存不同专家）
   - 推理优化: 只加载激活专家（动态加载）

**实证**：

- Switch Transformer: 1.6T 参数，训练速度仅比 T5-XXL (11B) 慢 **2 倍**（理论应慢 145 倍）

#### Q7: MoE 的主要挑战是什么？

**A**: **负载均衡、通信开销、推理部署**

1. **负载均衡**：
   - 问题: 专家坍缩（某些专家永不激活）
   - 解决: 辅助损失 + Capacity Factor + Router 初始化

2. **通信开销**（分布式训练）：
   - 问题: Token 在 GPU 0，需要的专家在 GPU 3 → All-to-All 通信
   - 解决: 专家并行策略 + 局部性调度

3. **推理部署**：
   - 问题: 所有专家参数都需在显存（即使只激活少数）
   - 解决: 动态加载（慢）、专家剪枝、蒸馏到密集模型

4. **训练不稳定**：
   - 问题: Router 学习困难，容易收敛到次优
   - 解决: 更大的辅助损失权重、专家 Dropout

#### Q8: Mixtral 8x7B 为什么比 Llama 2 70B 快？

**A**: **稀疏激活 + 更少激活参数**

**参数对比**：

| 模型 | 总参数 | 激活参数 | 推理 FLOPs |
|------|--------|----------|------------|
| Llama 2 70B | 70B | 70B | $O(70B)$ |
| Mixtral 8x7B | 47B | **13B** | $O(13B)$ |

**速度分析**：

- 推理瓶颈: 矩阵乘法 FLOPs ∝ 激活参数量
- Mixtral 激活参数是 Llama 2 的 **18.6%** → 理论快 **5.4 倍**
- 实测快 **~5 倍**（考虑 Router 开销）

**质量不损失原因**：

- 总参数 47B 仍然很大（充足容量）
- Top-2 融合信息（不是 Top-1）
- 专家专业化（针对性更强）

---

**本章总结**：

MoE 是**稀疏激活**的艺术，通过 Router 动态选择专家，实现**参数容量与计算成本的解耦**。核心挑战在于负载均衡和分布式训练，但收益巨大：Mixtral 8x7B 用 13B 激活参数达到 70B 模型的质量。2026 年面试必考：Router 设计、辅助损失机制、梯度流向、与密集模型对比。


---

## 第 16 章 BERT - Bidirectional Encoder Representations from Transformers

### 16.1 BERT 的革命：为什么双向编码改变了 NLP？

**2018 年前的困境**：

- **ELMo, GPT-1**: 单向（left-to-right）或浅层双向（两个单向拼接）
- **问题**：理解"银行"需要看上下文（"river bank" vs "financial bank"），单向看不全

**BERT 的突破**（Devlin et al., 2018）：

> 真正的**双向编码**：每个位置同时看到左边和右边的所有 token

**关键设计**：

1. **Masked Language Model (MLM)**：随机遮盖 15% token，预测它们
2. **双向 Transformer Encoder**：无 Causal Mask，全连接 Attention
3. **Pre-training → Fine-tuning**：先在大规模语料预训练，再在下游任务微调

### 16.2 BERT 架构详解

#### 16.2.1 符号定义

| 符号 | 含义 | 形状 | 索引含义 |
|------|------|------|----------|
| $X$ | 输入 token IDs | $[b, n]$ | batch, seq_len |
| $E$ | Token Embedding | $[V, d]$ | vocab_size, d_model |
| $P$ | Position Embedding | $[n_{max}, d]$ | max_seq_len, d_model |
| $S$ | Segment Embedding | $[2, d]$ | 句子 A/B 标记 |
| $H^{(l)}$ | 第 $l$ 层输出 | $[b, n, d]$ | - |
| $[CLS]$ | 分类 token | 标量 ID | 句首特殊 token |
| $[SEP]$ | 分隔符 token | 标量 ID | 句子分隔符 |
| $[MASK]$ | 遮盖 token | 标量 ID | MLM 训练用 |

#### 16.2.2 输入表示

**BERT 的输入 = 三种 Embedding 之和**：

$$X_{input} = E_{token} + E_{position} + E_{segment}$$

**具体步骤**（程序视角）：

```python
# 输入: "The cat [MASK] on the mat. It sleeps."
# Tokenized: [CLS] The cat [MASK] on the mat [SEP] It sleeps [SEP]

token_ids = [101, 1996, 4937, 103, 2006, 1996, 13523, 102, 2009, 16658, 102]
# 101=[CLS], 102=[SEP], 103=[MASK]

# 1. Token Embedding
token_emb = Embedding(token_ids)  # [11, 768]

# 2. Position Embedding（可学习）
position_ids = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
position_emb = PositionEmbedding(position_ids)  # [11, 768]

# 3. Segment Embedding
# 第一句（索引 0~6）→ Segment A (0)
# 第二句（索引 7~10）→ Segment B (1)
segment_ids = [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1]
segment_emb = SegmentEmbedding(segment_ids)  # [11, 768]

# 4. 求和
input_emb = token_emb + position_emb + segment_emb  # [11, 768]

# 5. LayerNorm + Dropout
input_emb = LayerNorm(Dropout(input_emb))
```

**关键点**：

- **Position Embedding 是可学习的**（不是 Sinusoidal），因为 BERT 序列固定最大长度 512
- **Segment Embedding**：区分两个句子（NSP 任务需要）

#### 16.2.3 Encoder 结构

**BERT-base**:

- **层数**: 12 层 Transformer Encoder
- **隐藏维度**: $d_{model} = 768$
- **注意力头数**: 12（每头 $d_{head} = 64$）
- **FFN 维度**: $d_{ff} = 3072$ (4x)
- **参数量**: ~110M

**BERT-large**:

- **层数**: 24
- **隐藏维度**: 1024
- **注意力头数**: 16
- **FFN 维度**: 4096
- **参数量**: ~340M

**关键区别**（与 GPT）：

| 特性 | BERT | GPT |
|------|------|-----|
| **Attention Mask** | **无** Causal Mask（全连接） | Causal Mask（只看左边） |
| **训练目标** | MLM + NSP | 下一个 token 预测 |
| **架构** | Encoder only | Decoder only（无 Cross-Attention） |

### 16.3 预训练任务

#### 16.3.1 Masked Language Model (MLM)

**动机**：如何在双向 Encoder 中训练语言模型？

**问题**：

- 传统 LM：预测下一个词（单向）
- 双向模型：如果能看到所有词 → 预测变成"抄答案"

**BERT 的解决方案**：**随机遮盖部分词，预测被遮盖的**

**Masking 策略**（15% token 被选中）：

对于被选中的 token：

- **80%**: 替换为 `[MASK]`
  - 例: "The cat sat" → "The cat [MASK]"
- **10%**: 替换为随机 token
  - 例: "The cat sat" → "The cat apple"
- **10%**: 保持不变
  - 例: "The cat sat" → "The cat sat"

**为什么不是 100% 用 [MASK]？**

- Fine-tuning 时输入**没有 [MASK] token** → 训练-推理不匹配
- 随机替换 + 保持不变 → 强迫模型利用上下文（不能只记 [MASK] 位置）

**损失函数**：

$$L_{MLM} = -\sum_{i \in \text{masked}} \log P(x_i | X_{\text{masked}})$$

**具体计算**（程序视角）：

```python
# 原始句子
text = "The cat sat on the mat"
tokens = ["The", "cat", "sat", "on", "the", "mat"]

# 1. 随机选择 15% 遮盖（假设遮盖 "sat"）
masked_tokens = ["The", "cat", "[MASK]", "on", "the", "mat"]
masked_positions = [2]  # "sat" 的位置

# 2. Encoder 前向
input_ids = tokenize(masked_tokens)  # [101, 1996, 4937, 103, 2006, 1996, 13523, 102]
hidden = BERTEncoder(input_ids)  # [8, 768]

# 3. 取被遮盖位置的输出
masked_output = hidden[masked_positions]  # [1, 768]

# 4. 预测层（Linear + Softmax）
logits = MaskLMHead(masked_output)  # [1, vocab_size=30522]
predictions = torch.argmax(logits, dim=-1)  # [1]

# 5. 计算损失
true_label = tokenize(["sat"])[0]  # 真实 token ID
loss = CrossEntropy(logits, true_label)
```

**代码实现**：

```python
class BertForMaskedLM(nn.Module):
    def __init__(self, vocab_size=30522, d_model=768, num_layers=12):
        super().__init__()
        
        # Embeddings
        self.token_emb = nn.Embedding(vocab_size, d_model)
        self.position_emb = nn.Embedding(512, d_model)
        self.segment_emb = nn.Embedding(2, d_model)
        
        # Encoder
        self.encoder = nn.ModuleList([
            TransformerEncoderLayer(d_model, num_heads=12, d_ff=3072)
            for _ in range(num_layers)
        ])
        
        # MLM Head
        self.mlm_head = nn.Sequential(
            nn.Linear(d_model, d_model),
            nn.GELU(),
            nn.LayerNorm(d_model),
            nn.Linear(d_model, vocab_size)
        )
    
    def forward(self, input_ids, position_ids, segment_ids, masked_positions):
        # Embedding
        x = (self.token_emb(input_ids) +
             self.position_emb(position_ids) +
             self.segment_emb(segment_ids))
        
        # Encoder
        for layer in self.encoder:
            x = layer(x)  # [batch, seq_len, d_model]
        
        # 取被遮盖位置的输出
        batch_size = input_ids.shape[0]
        masked_output = x[torch.arange(batch_size).unsqueeze(1), masked_positions]
        # masked_output: [batch, num_masked, d_model]
        
        # 预测
        logits = self.mlm_head(masked_output)  # [batch, num_masked, vocab_size]
        
        return logits
```

#### 16.3.2 Next Sentence Prediction (NSP)

**动机**：许多下游任务需要理解**句子关系**（问答、推理）

**任务**：给定两个句子 A 和 B，判断 B 是否是 A 的下一句

**训练数据构造**：

- **50% 正样本**：B 确实是 A 的下一句
  - 例: A="The cat sat.", B="It was tired." → Label=1 (IsNext)
- **50% 负样本**：B 是随机句子
  - 例: A="The cat sat.", B="Python is a language." → Label=0 (NotNext)

**输入格式**：

```
[CLS] Sentence A [SEP] Sentence B [SEP]
```

**预测**：

- 用 `[CLS]` 位置的输出表示整个句对
- 接一个分类头（Linear + Softmax）

$$P(\text{IsNext} | A, B) = \text{Softmax}(W_{NSP} \cdot h_{[CLS]})$$

**代码**：

```python
class BertForNSP(nn.Module):
    def __init__(self, d_model=768):
        super().__init__()
        self.bert = BertEncoder(...)  # 同上
        self.nsp_head = nn.Linear(d_model, 2)  # 二分类
    
    def forward(self, input_ids, position_ids, segment_ids):
        # Encoder
        hidden = self.bert(input_ids, position_ids, segment_ids)  # [batch, seq_len, d_model]
        
        # 取 [CLS] 位置（第一个 token）
        cls_output = hidden[:, 0, :]  # [batch, d_model]
        
        # NSP 预测
        logits = self.nsp_head(cls_output)  # [batch, 2]
        
        return logits
```

**总预训练损失**：

$$L = L_{MLM} + L_{NSP}$$

**NSP 的争议**（RoBERTa, 2019）：

- **发现**：去掉 NSP 任务，性能反而提升
- **原因**：NSP 太简单（模型通过主题词就能判断，不需要真正理解句子关系）
- **RoBERTa 改进**：只用 MLM，但增加训练数据和时间

### 16.4 Fine-tuning（微调）

**BERT 的强大之处**：预训练学到通用表示，微调到具体任务只需少量数据

#### 16.4.1 微调流程

```python
# 1. 加载预训练 BERT
bert = BertModel.from_pretrained('bert-base-uncased')

# 2. 添加任务头
class BertForClassification(nn.Module):
    def __init__(self, num_labels):
        super().__init__()
        self.bert = bert
        self.classifier = nn.Linear(768, num_labels)
    
    def forward(self, input_ids, attention_mask):
        # BERT Encoder
        outputs = self.bert(input_ids, attention_mask=attention_mask)
        cls_output = outputs[:, 0, :]  # [CLS] token
        
        # 分类
        logits = self.classifier(cls_output)
        return logits

# 3. 微调训练
model = BertForClassification(num_labels=2)
optimizer = torch.optim.Adam(model.parameters(), lr=2e-5)

for batch in train_dataloader:
    input_ids, labels = batch
    logits = model(input_ids)
    loss = CrossEntropy(logits, labels)
    
    loss.backward()
    optimizer.step()
```

#### 16.4.2 常见下游任务

| 任务 | 输入 | 输出 | 使用的表示 |
|------|------|------|------------|
| **文本分类** | 单句 | 类别 | `[CLS]` token |
| **句对分类** | 两句 | 关系类别 | `[CLS]` token |
| **问答（SQuAD）** | 问题 + 段落 | 答案起止位置 | 每个 token 的 hidden state |
| **命名实体识别（NER）** | 单句 | 每个 token 的标签 | 每个 token 的 hidden state |

**问答任务详解**（SQuAD）：

```python
# 输入: [CLS] Question [SEP] Paragraph [SEP]
# 任务: 预测答案在 Paragraph 中的起始和结束位置

class BertForQuestionAnswering(nn.Module):
    def __init__(self):
        super().__init__()
        self.bert = BertModel.from_pretrained('bert-base')
        self.qa_outputs = nn.Linear(768, 2)  # 起始 + 结束
    
    def forward(self, input_ids):
        hidden = self.bert(input_ids)  # [batch, seq_len, 768]
        
        # 每个位置预测是起始/结束的分数
        logits = self.qa_outputs(hidden)  # [batch, seq_len, 2]
        start_logits, end_logits = logits.split(1, dim=-1)
        
        # 预测
        start_pos = torch.argmax(start_logits.squeeze(-1), dim=1)
        end_pos = torch.argmax(end_logits.squeeze(-1), dim=1)
        
        return start_pos, end_pos
```

### 16.5 梯度分析

#### 16.5.1 MLM 的梯度流

**前向**（以单个 masked token 为例）：

$$\text{Input} \xrightarrow{Emb} X \xrightarrow{12 \times Encoder} H^{(12)} \xrightarrow{MaskLMHead} \text{Logits} \xrightarrow{CE} L$$

**反向**（链式法则）：

$$\frac{\partial L}{\partial \theta_{Encoder}} = \frac{\partial L}{\partial \text{Logits}} \cdot \frac{\partial \text{Logits}}{\partial H^{(12)}} \cdot \frac{\partial H^{(12)}}{\partial \theta_{Encoder}}$$

**关键观察**：

1. **只有被遮盖的位置有梯度反传到 MaskLMHead**
2. **但所有位置都参与 Attention** → 所有 token 的表示都会被更新

**为什么双向有效？**

- 预测 `[MASK]` 需要看左右上下文
- 梯度通过 Attention 传递到所有相关 token
- 迫使模型学习每个 token 的**上下文化表示**

#### 16.5.2 Fine-tuning 的梯度流

**流程**：

$$\text{BERT Encoder} \to h_{[CLS]} \to \text{Classifier} \to L_{task}$$

**梯度**：

$$\frac{\partial L_{task}}{\partial \theta_{BERT}} = \frac{\partial L_{task}}{\partial h_{[CLS]}} \cdot \frac{\partial h_{[CLS]}}{\partial \theta_{BERT}}$$

**关键**：

- 任务损失通过 `[CLS]` 反传到**所有 12 层 Encoder**
- 微调时**所有参数都更新**（不是只调分类头）

**学习率策略**：

- **Pre-training**: lr = 1e-4（较大，从随机初始化）
- **Fine-tuning**: lr = 2e-5（较小，避免破坏预训练权重）

### 16.6 BERT 的关键设计选择

#### 16.6.1 为什么 Position Embedding 是可学习的？

**BERT**：Learned PE

**Transformer (2017)**：Sinusoidal PE

**原因**：

1. **固定长度**：BERT 最大序列 512，不需要外推 → 学习更灵活
2. **性能**：实验发现 Learned PE 在 BERT 任务上略优

#### 16.6.2 为什么用 GELU 而非 ReLU？

**GELU (Gaussian Error Linear Unit)**：

$$\text{GELU}(x) = x \cdot \Phi(x) = x \cdot \frac{1}{2}\left[1 + \text{erf}\left(\frac{x}{\sqrt{2}}\right)\right]$$

**近似**：

$$\text{GELU}(x) \approx 0.5x \left(1 + \tanh\left[\sqrt{2/\pi}(x + 0.044715x^3)\right]\right)$$

**对比 ReLU**：

| 特性 | ReLU | GELU |
|------|------|------|
| **连续性** | 在 0 处不可导 | 处处光滑 |
| **随机性** | 确定性 | 类似 Dropout（概率性屏蔽） |
| **性能** | 标准 | BERT 实验显示稍优 |

#### 16.6.3 为什么 Segment Embedding？

**用途**：

- 区分两个句子（NSP 任务需要）
- 即使不做 NSP，Segment Embedding 也能帮助模型理解句子边界

**实现**：

```python
segment_ids = [0]*len(sentence_A) + [1]*len(sentence_B)
segment_emb = SegmentEmbedding(segment_ids)
```

### 16.7 BERT 变体

#### 16.7.1 RoBERTa (Robustly Optimized BERT, 2019)

**改进**：

1. **去掉 NSP**：只用 MLM
2. **动态 Masking**：每个 epoch 重新随机遮盖（BERT 是固定 mask）
3. **更大 batch size**：8K（BERT 是 256）
4. **更多数据**：160GB 文本（BERT 是 16GB）

**结果**：所有 GLUE 任务 SOTA

#### 16.7.2 ALBERT (A Lite BERT, 2019)

**目标**：减少参数量

**方法**：

1. **Embedding 分解**：$V \times d$ → $V \times e + e \times d$（$e$ 小）
2. **跨层参数共享**：12 层用**同一组参数**
3. **句序预测（SOP）** 替代 NSP：正例=正确顺序，负例=交换句子顺序

**结果**：

- 参数: 18M（BERT-base 110M 的 16%）
- 性能: 接近甚至超过 BERT-large

#### 16.7.3 ELECTRA (2020)

**创新**：**不用 [MASK]，而是替换 token，判别是否被替换**

**流程**：

1. **生成器**：小型 MLM 模型生成替换 token
2. **判别器**：BERT-size 模型，判断每个 token 是否是原始的

**优势**：

- 所有 token 都有监督信号（BERT 只有 15%）
- 训练效率高 **30 倍**（相同性能下）

### 16.8 BERT 的局限性

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| **不适合生成任务** | 双向编码，无法自回归生成 | 用 GPT 类模型（Decoder） |
| **推理速度慢** | 需要计算所有 token 的表示 | 蒸馏（DistilBERT）、剪枝 |
| **长序列受限** | 最大 512 token，Attention $O(n^2)$ | Longformer, BigBird |
| **需要大量预训练数据** | 从随机初始化训练 110M 参数 | 持续预训练（Continual Pre-training） |

### 📊 面试考点

#### Q1: BERT 的"双向"和 ELMo 的"双向"有什么区别？

**A**: 

| 模型 | 双向实现 | 深度 |
|------|----------|------|
| **ELMo** | **浅层双向**：Left-to-right LSTM + Right-to-left LSTM 拼接 | 两个独立单向模型 |
| **BERT** | **深层双向**：每层 Attention 同时看到左右所有 token | 每层都是真正双向 |

**关键区别**：

- ELMo: $h_{left \to right} \oplus h_{right \to left}$（拼接，无交互）
- BERT: $h = \text{Attention}(\text{all tokens})$（每个 token 直接attend 所有其他 token）

**为什么 BERT 更强？**

- ELMo: 预测 "bank" 时，左向模型只看 "river"，右向模型只看 "account"，两者不交互
- BERT: 同时看到 "river ... bank ... account"，理解是金融概念

#### Q2: Masked Language Model 的 80%-10%-10% 策略为什么这样设计？

**A**: **解决训练-推理不匹配问题**

**如果 100% 用 [MASK]**：

- 训练: 输入有 `[MASK]` token
- 推理（Fine-tuning）: 输入**没有** `[MASK]` token
- 结果: 模型学会"看到 [MASK] 就预测"，但推理时没有 [MASK] → 性能下降

**80%-10%-10% 策略**：

- **80% [MASK]**：主要训练信号
- **10% 随机**：强迫模型不能只靠局部线索（"apple" 在 "The cat sat on the apple" 明显错误，必须理解全局）
- **10% 不变**：让模型见到真实 token，缩小训练-推理差距

**实验验证**（BERT 论文）：

- 100% [MASK]: 83.6% 准确率
- 80%-10%-10%: **84.3%** 准确率

#### Q3: BERT 的梯度如何流向所有 token？

**A**: **通过 Attention 机制的全连接图**

**前向**（预测 `[MASK]` 位置 3）：

```
Token:  The  cat  [MASK]  on   the  mat
Position: 0    1     2      3    4    5
```

**Attention 连接**（位置 2 的 Query 与所有 Key）：

$$h_2^{(l+1)} = \text{Attention}(Q_2, [K_0, K_1, K_2, K_3, K_4, K_5], [V_0, ..., V_5])$$

**梯度反向**：

$$\frac{\partial L}{\partial h_2^{(l)}} \text{ 反传时通过 Attention 分配到 } \frac{\partial L}{\partial h_i^{(l)}} \quad \forall i$$

**结果**：

- 即使只有位置 2 有监督信号（MLM loss）
- 梯度通过 12 层 Attention 传播到**所有位置**
- 所有 token 的表示都被优化为"有助于预测被遮盖词"

**数值例子**（简化，单层）：

```python
# 损失在位置 2
dL/dh_2 = -1.5

# Attention 权重（位置 2 对其他位置）
alpha_20 = 0.1, alpha_21 = 0.3, alpha_23 = 0.4, ...

# 梯度分配（Attention 反向传播）
dL/dh_0 += alpha_20 * dL/dh_2 = 0.1 * (-1.5) = -0.15
dL/dh_1 += alpha_21 * dL/dh_2 = 0.3 * (-1.5) = -0.45
...
```

所有位置都收到梯度。

#### Q4: 为什么 Fine-tuning 学习率要远小于 Pre-training？

**A**: **避免灾难性遗忘（Catastrophic Forgetting）**

**Pre-training**:

- 初始: 随机初始化
- 学习率: 1e-4（较大，快速收敛）

**Fine-tuning**:

- 初始: 预训练好的权重（已经很好）
- 学习率: 2e-5（**小 5 倍**）

**原因**：

1. **预训练权重包含通用语言知识**：语法、语义、常识
2. **大学习率会破坏这些知识**：快速更新 → 覆盖预训练表示
3. **小学习率**：微调只调整"最后几层"或"轻微修改"表示

**实验**（BERT 论文）：

| Fine-tuning LR | 准确率 |
|----------------|--------|
| 1e-4（太大） | 82.1% |
| **2e-5**（推荐） | **84.5%** |
| 1e-5（太小） | 83.8%（收敛慢） |

#### Q5: (Hard) BERT 能用于生成任务吗？为什么？

**A**: **不能直接用于自回归生成，但可用于条件生成**

**为什么不能自回归生成？**

**自回归生成**需要：

$$P(x_1, x_2, ..., x_n) = \prod_{t=1}^{n} P(x_t | x_{<t})$$

- 生成 $x_t$ 时只能看到 $x_{<t}$（Causal Mask）

**BERT 的问题**：

- **无 Causal Mask**：每个位置都能看到所有 token（包括未来）
- **MLM 训练**：学的是"填空"，不是"续写"

**实验验证**：

```python
# 尝试用 BERT 生成
input = "The cat [MASK]"
output = BERT.predict_mask(input)  # "sat"（正确）

# 但无法续写
input = "The cat"
output = BERT.generate_next(input)  # ❌ BERT 没有这个接口
```

**可以做的生成任务**：

1. **填空生成**（Infilling）:
   - 输入: "The cat [MASK] on the mat"
   - 输出: "sat"
   
2. **条件生成**（通过 Fine-tuning）:
   - 例: 文本摘要（Encoder-Decoder 架构，BERT 作 Encoder）

**正确选择**：

- **理解任务** → BERT（分类、问答、NER）
- **生成任务** → GPT（续写、对话、翻译）

#### Q6: RoBERTa 为什么去掉 NSP 后性能反而提升？

**A**: **NSP 任务太简单，引入噪声**

**NSP 的问题**：

**训练数据构造**：

- 正例: A="The cat sat." B="It was tired."（连续句子）
- 负例: A="The cat sat." B="Python is great."（随机句子）

**模型学到的捷径**：

- 负例通常**主题完全不同**（动物 vs 编程）
- 模型只需比较**主题词**（cat vs Python）就能判断，无需理解句子关系
- 真正的推理能力没有提升

**实验证据**（RoBERTa 论文）：

| 配置 | MNLI 准确率 |
|------|------------|
| BERT (MLM + NSP) | 84.3% |
| RoBERTa (MLM only, 但更多数据) | **87.6%** |

**更好的替代**（ALBERT）：

- **SOP (Sentence Order Prediction)**：判断句子顺序是否正确
- 正例: A-B（正确顺序）
- 负例: B-A（交换顺序）
- 更难（主题相同，需要理解逻辑）

#### Q7: BERT 和 GPT 的根本区别是什么？

**A**: **双向编码 vs 单向生成，Encoder vs Decoder**

| 维度 | BERT | GPT |
|------|------|-----|
| **架构** | Encoder only（无 Cross-Attention） | Decoder only（无 Cross-Attention） |
| **Attention Mask** | 无 Causal Mask（全连接） | Causal Mask（下三角） |
| **训练目标** | MLM（填空） | 下一个 token 预测 |
| **输入可见性** | 每个 token 看到**所有** token | 每个 token 只看到**之前** token |
| **适用任务** | 理解（分类、问答、NER） | 生成（续写、对话、翻译） |
| **推理方式** | 并行（一次性编码所有 token） | 自回归（逐个生成 token） |

**数学对比**：

**BERT Attention**（位置 3）：

$$h_3 = \text{Attention}(Q_3, [K_0, K_1, K_2, K_3, K_4, K_5], [V_0, ..., V_5])$$

能看到所有位置（包括 4, 5）。

**GPT Attention**（位置 3）：

$$h_3 = \text{Attention}(Q_3, [K_0, K_1, K_2, K_3], [V_0, V_1, V_2, V_3])$$

只能看到 0~3（Causal Mask 屏蔽 4, 5）。

#### Q8: BERT 的参数量如何计算？

**A**: **Embedding + 12 × Encoder + MLM Head**

**BERT-base 配置**：

- vocab_size = 30522
- d_model = 768
- num_layers = 12
- num_heads = 12 ($d_{head} = 64$)
- d_ff = 3072
- max_seq_len = 512

**1. Embedding 层**：

- Token Embedding: $30522 \times 768 = 23.4M$
- Position Embedding: $512 \times 768 = 0.4M$
- Segment Embedding: $2 \times 768 = 0.002M$
- **小计**: ~23.8M

**2. 单个 Encoder 层**：

- **Multi-Head Attention**:
  - $W_Q, W_K, W_V$: $3 \times (768 \times 768) = 1.77M$
  - $W_O$: $768 \times 768 = 0.59M$
  - 小计: 2.36M
  
- **FFN**:
  - $W_1$: $768 \times 3072 = 2.36M$
  - $W_2$: $3072 \times 768 = 2.36M$
  - 小计: 4.72M

- **LayerNorm** (2 个): $2 \times (768 \times 2) = 0.003M$（gamma, beta）

- **单层总计**: 2.36 + 4.72 = **7.08M**

**3. 12 层 Encoder**：

$12 \times 7.08M = 84.96M$

**4. MLM Head**：

- Linear: $768 \times 768 = 0.59M$
- Output: $768 \times 30522 = 23.4M$
- 小计: 24M

**总参数量**：

$$23.8M + 84.96M + 24M \approx 110M$$

**验证**（HuggingFace）：

```python
from transformers import BertModel
model = BertModel.from_pretrained('bert-base-uncased')
print(sum(p.numel() for p in model.parameters()))  # 109,482,240 ≈ 110M
```

---

**本章总结**：

BERT 通过**双向 Encoder + MLM + 大规模预训练**革新了 NLP。关键创新：无 Causal Mask 的 Attention、80%-10%-10% Masking 策略、Pre-training → Fine-tuning 范式。2026 面试必考：BERT vs GPT 区别、MLM 梯度流、Fine-tuning 为什么用小学习率、NSP 的问题、BERT 不适合生成的原因。


---

## 第 17 章 GPT - Generative Pre-trained Transformer（自回归生成的力量）

### 17.1 GPT 的核心思想：语言建模即一切

**2018 年 GPT-1 的突破**（Radford et al., OpenAI）：

> 无监督预训练 + 有监督微调 = 通用语言理解

**与 BERT 的根本不同**：

| 维度 | BERT | GPT |
|------|------|-----|
| **目标** | 理解（编码） | 生成（续写） |
| **训练任务** | MLM（填空） | **自回归 LM**（预测下一个词） |
| **可见性** | 双向（看全文） | **单向**（只看左边） |
| **应用** | 分类、问答、NER | 文本生成、对话、翻译 |

**自回归语言模型**（Autoregressive LM）：

$$P(x_1, x_2, ..., x_n) = \prod_{t=1}^{n} P(x_t | x_{<t})$$

每个词的概率只依赖**之前**的词（因果性）。

### 17.2 GPT-1：Transformer Decoder 的验证

#### 17.2.1 架构

**GPT-1 = 只用 Transformer 的 Decoder（去掉 Cross-Attention）**

```
输入: "The cat sat"
    ↓ Embedding + Positional Encoding
    ↓ Masked Self-Attention (Causal Mask)
    ↓ Feed-Forward Network
    ↓ ... (12 层)
    ↓ Language Model Head
输出: P("on" | "The cat sat")
```

**配置**（GPT-1, 2018）：

- **层数**: 12
- **隐藏维度**: 768
- **注意力头数**: 12
- **FFN 维度**: 3072
- **参数量**: **117M**
- **上下文长度**: 512 tokens
- **训练数据**: BooksCorpus (~7000 本书, 约 4.5GB 文本)

**关键组件**：

1. **Causal Mask**（下三角）：

$$Mask = \begin{bmatrix}
0 & -\infty & -\infty & -\infty \\
0 & 0 & -\infty & -\infty \\
0 & 0 & 0 & -\infty \\
0 & 0 & 0 & 0
\end{bmatrix}$$

位置 $i$ 只能 attend 到位置 $\leq i$。

2. **位置编码**：学习式（Learned PE），与 BERT 相同

3. **激活函数**：GELU

#### 17.2.2 训练目标

**Language Modeling Loss**：

$$L_{LM} = -\sum_{t=1}^{n} \log P(x_t | x_{<t}; \theta)$$

**程序视角**：

```python
# 输入序列
text = "The cat sat on the mat"
tokens = [101, 1996, 4937, 3902, 2006, 1996, 13523]  # [CLS] The cat sat on the mat

# 前向传播
for t in range(1, len(tokens)):
    # 输入: tokens[:t]（前 t 个词）
    # 目标: tokens[t]（第 t+1 个词）
    
    input_seq = tokens[:t]  # [101, 1996, ...]
    target = tokens[t]
    
    # GPT 前向
    hidden = GPT(input_seq)  # [t, d_model]
    logits = LMHead(hidden[-1])  # [vocab_size]，取最后一个位置
    
    # 损失
    loss += CrossEntropy(logits, target)
```

**代码实现**：

```python
class GPT1(nn.Module):
    def __init__(self, vocab_size=50257, d_model=768, num_layers=12, max_len=512):
        super().__init__()
        
        # Embedding
        self.token_emb = nn.Embedding(vocab_size, d_model)
        self.pos_emb = nn.Embedding(max_len, d_model)
        
        # Decoder Layers
        self.layers = nn.ModuleList([
            TransformerDecoderLayer(d_model, num_heads=12, d_ff=3072)
            for _ in range(num_layers)
        ])
        
        # LM Head
        self.lm_head = nn.Linear(d_model, vocab_size, bias=False)
        
        # 权重共享（Embedding 和 LM Head）
        self.lm_head.weight = self.token_emb.weight
    
    def forward(self, input_ids):
        batch, seq_len = input_ids.shape
        
        # Position IDs
        positions = torch.arange(seq_len, device=input_ids.device).unsqueeze(0)
        
        # Embedding
        x = self.token_emb(input_ids) + self.pos_emb(positions)
        
        # Causal Mask
        causal_mask = torch.tril(torch.ones(seq_len, seq_len)).to(input_ids.device)
        causal_mask = causal_mask.masked_fill(causal_mask == 0, float('-inf'))
        causal_mask = causal_mask.masked_fill(causal_mask == 1, 0.0)
        
        # Decoder Layers
        for layer in self.layers:
            x = layer(x, mask=causal_mask)
        
        # LM Head
        logits = self.lm_head(x)  # [batch, seq_len, vocab_size]
        
        return logits

# 训练循环
model = GPT1()
optimizer = torch.optim.Adam(model.parameters(), lr=2.5e-4)

for batch in dataloader:
    input_ids = batch['input_ids']  # [batch, seq_len]
    
    # 前向
    logits = model(input_ids)  # [batch, seq_len, vocab_size]
    
    # 损失（预测下一个 token）
    # input_ids[:, :-1] → 输入序列
    # input_ids[:, 1:] → 目标序列（右移一位）
    loss = F.cross_entropy(
        logits[:, :-1, :].reshape(-1, vocab_size),  # [batch*(seq_len-1), vocab_size]
        input_ids[:, 1:].reshape(-1)                 # [batch*(seq_len-1)]
    )
    
    # 反向传播
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
```

#### 17.2.3 Fine-tuning 任务

**GPT-1 的范式**：

1. **Pre-training**：在 BooksCorpus 上训练 Language Model
2. **Fine-tuning**：在具体任务上微调（加任务头）

**任务转换技巧**：所有任务转为**序列到序列**格式

| 任务 | 输入格式 | 输出 |
|------|---------|------|
| **分类** | `[Start] Text [Extract]` | `[Extract]` 位置的表示 → 分类器 |
| **蕴含** | `[Start] Premise [Delim] Hypothesis [Extract]` | 二分类 |
| **相似度** | `[Start] Text1 [Delim] Text2 [Extract]` | 相似度分数 |
| **多选** | `[Start] Context [Delim] Answer1 [Extract]` × N | 选择分数最高的 |

**关键创新**：**任务无关的架构**（只改输入格式，不改模型）

### 17.3 GPT-2：Zero-Shot Learning 的震撼

#### 17.3.1 规模扩展

**GPT-2（2019）的激进假设**：

> **语言模型足够大时，不需要微调就能做任何任务**（Zero-Shot）

**配置演进**：

| 版本 | 参数量 | 层数 | d_model | 头数 | 上下文长度 | 训练数据 |
|------|--------|------|---------|------|-----------|----------|
| GPT-1 | 117M | 12 | 768 | 12 | 512 | 4.5GB |
| **GPT-2 Small** | 117M | 12 | 768 | 12 | 1024 | 40GB |
| **GPT-2 Medium** | 345M | 24 | 1024 | 16 | 1024 | 40GB |
| **GPT-2 Large** | 762M | 36 | 1280 | 20 | 1024 | 40GB |
| **GPT-2 XL** | **1.5B** | 48 | 1600 | 25 | 1024 | 40GB |

**训练数据**：WebText（800 万网页，过滤质量高的）

#### 17.3.2 Zero-Shot, One-Shot, Few-Shot

**传统范式**（BERT, GPT-1）：

```
Pre-train → Fine-tune（需要任务标注数据）
```

**GPT-2 的范式**：

```
Pre-train → 直接推理（无需微调）
```

**三种推理模式**：

1. **Zero-Shot**：仅给任务描述，无示例

```
Translate English to French:
sea otter =>
```

模型续写：`loutre de mer`

2. **One-Shot**：给 1 个示例

```
Translate English to French:
cat => chat
sea otter =>
```

3. **Few-Shot**：给 N 个示例（GPT-3 主打）

```
Translate English to French:
cat => chat
dog => chien
sea otter =>
```

**为什么 Zero-Shot 可行？**

- 预训练时见过大量"自然指令"（网页中的格式化内容）
- 例：Reddit 帖子、维基百科表格、代码注释
- 模型学会从上下文推断任务

#### 17.3.3 GPT-2 的改进

**相比 GPT-1**：

1. **Layer Normalization 前置**（Pre-Norm）：

```python
# GPT-1 (Post-Norm)
x = x + Attention(LayerNorm(x))
x = x + FFN(LayerNorm(x))

# GPT-2 (Pre-Norm)
x = x + Attention(LayerNorm(x))  # 先 LN 再 Attention
x = x + FFN(LayerNorm(x))
```

好处：梯度更稳定，支持更深网络（48 层）。

2. **更大的 Batch Size**：512（GPT-1 是 64）

3. **BPE Tokenization**：
   - Byte Pair Encoding（字节对编码）
   - 词汇表 50257（GPT-1 是 40000）
   - 处理未见词能力更强

### 17.4 GPT-3：In-Context Learning 的涌现

#### 17.4.1 规模的质变

**GPT-3（2020）的核心观点**：

> **不需要梯度更新，仅通过 Few-Shot 示例就能学习新任务**

**配置**：

| 模型 | 参数量 | 层数 | d_model | 头数 | d_head | Batch Size | 学习率 |
|------|--------|------|---------|------|--------|-----------|--------|
| GPT-3 Small | 125M | 12 | 768 | 12 | 64 | 0.5M tokens | 6e-4 |
| GPT-3 Medium | 350M | 24 | 1024 | 16 | 64 | 0.5M | 3e-4 |
| GPT-3 Large | 760M | 24 | 1536 | 16 | 96 | 0.5M | 2.5e-4 |
| GPT-3 XL | 1.3B | 24 | 2048 | 24 | 128 | 1M | 2e-4 |
| GPT-3 2.7B | 2.7B | 32 | 2560 | 32 | 80 | 1M | 1.6e-4 |
| GPT-3 6.7B | 6.7B | 32 | 4096 | 32 | 128 | 2M | 1.2e-4 |
| GPT-3 13B | 13B | 40 | 5120 | 40 | 128 | 2M | 1e-4 |
| **GPT-3 175B** | **175B** | **96** | **12288** | **96** | **128** | 3.2M | 0.6e-4 |

**训练数据**：

- 数据集：Common Crawl（过滤后 570GB）+ WebText2 + Books1 + Books2 + Wikipedia
- 总 Token 数：**300B tokens**
- 训练成本：约 **460 万美元**（Azure 云计算）

**架构创新**（相比 GPT-2）：

1. **Sparse Attention**（高层使用）：降低 $O(n^2)$ 复杂度
2. **Alternating Dense-Sparse Layers**：部分层全连接，部分层稀疏

#### 17.4.2 In-Context Learning（上下文学习）

**定义**：模型通过**输入中的示例**学习新任务，无需参数更新

**数学视角**：

传统学习（Fine-tuning）：

$$\theta^* = \arg\min_\theta \mathcal{L}(\theta; \mathcal{D}_{task})$$

更新参数 $\theta$。

In-Context Learning：

$$P(y | x, \text{examples}; \theta_{\text{fixed}})$$

参数 $\theta$ 固定，仅改变输入 context。

**例子**（Few-Shot 翻译）：

```
Prompt:
English: cat
French: chat

English: dog
French: chien

English: sea otter
French:
```

GPT-3 输出：`loutre de mer`

**为什么有效？**

**涌现假说**（Emergent Ability）：

- 小模型（< 1B）：Few-Shot 效果随机
- 大模型（> 10B）：Few-Shot 性能突然跃升
- GPT-3 (175B)：Few-Shot 接近 Fine-tuned BERT

**机制猜想**：

1. **模式识别**：预训练时见过大量"示例 → 答案"格式
2. **任务推断**：从示例中推断任务规则（"英→法"）
3. **梯度下降模拟**：Transformer 的 Forward Pass 相当于在"隐式"优化

#### 17.4.3 GPT-3 的能力边界

**强项**：

- 文本生成（续写、创作）
- 翻译（Few-Shot 接近专业翻译）
- 问答（常识推理）
- 代码生成（见过 GitHub 代码）

**弱项**：

- **算术错误**（"345 + 678 = 1023"）
- **事实幻觉**（编造不存在的引用）
- **逻辑推理**（复杂多步推理失败）
- **长文档理解**（超过 2048 tokens 遗忘）

### 17.5 Scaling Law：大力出奇迹的数学基础

**Kaplan et al., 2020（OpenAI）的发现**：

> **模型性能遵循可预测的幂律（Power Law）**

#### 17.5.1 核心公式

**Loss 与三要素的关系**：

$$L(N, D, C) = \left(\frac{N_c}{N}\right)^{\alpha_N} + \left(\frac{D_c}{D}\right)^{\alpha_D} + \left(\frac{C_c}{C}\right)^{\alpha_C}$$

- $N$: 参数量
- $D$: 数据量（tokens）
- $C$: 计算量（FLOPs）
- $\alpha_N, \alpha_D, \alpha_C$: 幂指数（实验拟合）

**简化版**（单变量）：

$$L(N) \approx \left(\frac{N_c}{N}\right)^{0.076}$$

**含义**：参数量每增加 10 倍，Loss 降低约 **13%**

#### 17.5.2 Compute-Optimal Training

**问题**：给定计算预算 $C$，如何分配 $N$（参数）和 $D$（数据）？

**Chinchilla Scaling Law（DeepMind, 2022）**：

$$N^* \propto C^{0.5}, \quad D^* \propto C^{0.5}$$

**结论**：参数量和数据量应**同步增长**

**对比**：

| 模型 | 参数量 | 训练 Tokens | $N$ vs $D$ |
|------|--------|-------------|------------|
| GPT-3 | 175B | 300B | $N >> D$（**欠训练**） |
| Chinchilla | **70B** | **1.4T** | $N \approx D$（**最优**） |
| Llama 2 | 70B | **2T** | 借鉴 Chinchilla |

**启示**：GPT-3 如果训练更久（1T+ tokens），性能还能显著提升。

#### 17.5.3 实验验证

**控制变量实验**（Kaplan et al.）：

| 参数量 $N$ | 训练 Loss | 下游任务准确率 |
|-----------|----------|--------------|
| 117M | 3.12 | 72% |
| 345M | 2.98 | 76% |
| 1.5B | 2.73 | 82% |
| 13B | 2.31 | 88% |
| **175B** | **2.01** | **92%** |

**幂律拟合**：$L = 5.92 \times N^{-0.076}$（$R^2 = 0.99$）

### 17.6 GPT-4：多模态与对齐

**GPT-4（2023）的改进**（部分推测，OpenAI 未公开细节）：

1. **多模态**：支持图像输入（Vision Encoder + Transformer）
2. **更长上下文**：32K tokens（标准版），128K tokens（Turbo）
3. **更强推理**：数学、代码、逻辑推理显著提升
4. **对齐优化**：RLHF（Reinforcement Learning from Human Feedback）

**推测架构**（基于泄露信息）：

- **MoE 结构**：8 个专家，每次激活 2 个（类似 Mixtral）
- **总参数**：约 **1.8T**（激活参数 ~220B）
- **训练数据**：~13T tokens
- **训练成本**：估计 **1 亿美元**

#### 17.6.1 RLHF 流程

**传统 GPT**：最小化 Language Modeling Loss

$$\theta^* = \arg\min_\theta \mathbb{E}_{x \sim D} \left[ -\log P(x | x_{<t}; \theta) \right]$$

**问题**：生成内容可能有毒、有偏、无用。

**RLHF 解决方案**（InstructGPT, ChatGPT）：

**Step 1: 监督微调（SFT）**

- 人类演示高质量回复
- 微调模型：$\theta_{SFT} = \arg\min_\theta \mathcal{L}(\text{prompts}, \text{human\_responses})$

**Step 2: 奖励模型（RM）训练**

- 人类标注：对多个回复排序（A > B > C）
- 训练 Reward Model：$r_\phi(x, y)$ 预测人类偏好分数

**Step 3: PPO 优化**

- 用强化学习优化语言模型：

$$\theta_{RL} = \arg\max_\theta \mathbb{E}_{x, y \sim \pi_\theta} \left[ r_\phi(x, y) - \beta \cdot D_{KL}(\pi_\theta || \pi_{SFT}) \right]$$

- $D_{KL}$：KL 散度，防止偏离 SFT 模型太远（避免模式崩溃）

**效果**：

- 减少有害输出 **70%**
- 用户满意度提升 **2 倍**

### 17.7 GPT 的梯度分析

#### 17.7.1 自回归 LM 的梯度流

**前向**（预测位置 $t$）：

$$x_1, ..., x_{t-1} \xrightarrow{Embed} X \xrightarrow{12 \times Decoder} H^{(12)} \xrightarrow{LM Head} \text{Logits}_t \xrightarrow{CE} L_t$$

**反向**：

$$\frac{\partial L_t}{\partial H^{(12)}_{t-1}} \to \frac{\partial L_t}{\partial H^{(11)}_{t-1}} \to ... \to \frac{\partial L_t}{\partial X_{t-1}}$$

**关键**：

- 预测位置 $t$ 的损失**只反传到位置 $\leq t-1$**（Causal Mask）
- 位置 $t+1, t+2, ...$ 不参与此次梯度更新

**总梯度**（序列长度 $n$）：

$$\frac{\partial L}{\partial \theta} = \sum_{t=1}^{n} \frac{\partial L_t}{\partial \theta}$$

每个位置都贡献梯度。

#### 17.7.2 Causal Mask 的梯度阻断

**Attention 梯度**（位置 $t$）：

$$\frac{\partial L}{\partial Q_t} = \frac{\partial L}{\partial A_t} \cdot K^T$$

其中 $A_t = \text{Softmax}(Q_t K^T)$。

**Causal Mask 效果**：

- $A_t$ 只对位置 $\leq t$ 有非零值
- 梯度 $\frac{\partial L}{\partial K_i}$ 在 $i > t$ 时为 0

**结果**：未来位置的 Key/Value 不影响当前预测 → 梯度不回传。

### 17.8 Tokenization：BPE 详解

**Byte Pair Encoding（字节对编码）**：

#### 17.8.1 算法流程

**初始**：字符级词汇表

```
词汇表: ['a', 'b', 'c', ..., 'z', ' ']
```

**训练**（迭代合并高频对）：

```python
corpus = ["low", "lower", "newest", "widest"]

# 统计字符对频率
# "lo" 出现 2 次，"ow" 出现 2 次，...

# Step 1: 合并最高频对（假设 "lo"）
词汇表 += ["lo"]
corpus = ["lo w", "lo wer", "newest", "widest"]

# Step 2: 继续合并（假设 "lo w" → "low"）
词汇表 += ["low"]
corpus = ["low", "low er", "newest", "widest"]

# ... 迭代直到词汇表达到目标大小（50257）
```

**最终词汇表**：

```
['a', 'b', ..., 'z', ' ', 'lo', 'low', 'est', ...]
```

#### 17.8.2 编码示例

```python
text = "lower"

# BPE 分词
tokens = ["low", "er"]  # 贪心匹配最长子词

# 转 ID
token_ids = [123, 456]  # 对应词汇表索引
```

**优势**：

- 未见词可拆分为子词（不会 OOV）
- 高频词单独 token（效率高）
- 词汇表大小可控

### 📊 面试考点

#### Q1: GPT 和 BERT 的根本区别？

**A**: **单向生成 vs 双向理解，Causal Mask vs No Mask**

| 维度 | GPT | BERT |
|------|-----|------|
| **Attention Mask** | **Causal Mask**（下三角，只看左边） | 无 Mask（全连接） |
| **训练目标** | 预测下一个词（自回归） | 预测被遮盖词（MLM） |
| **架构** | Decoder only（无 Cross-Attn） | Encoder only |
| **生成能力** | **强**（逐词生成） | 弱（填空式） |
| **理解能力** | 中等（单向上下文） | **强**（双向上下文） |
| **应用** | 文本生成、对话、续写 | 分类、问答、NER |

**数学**（Attention 可见性）：

- GPT 位置 3: $h_3 = \text{Attn}(Q_3, [K_0, K_1, K_2, K_3], ...)$
- BERT 位置 3: $h_3 = \text{Attn}(Q_3, [K_0, ..., K_5], ...)$（能看到 4, 5）

#### Q2: 为什么 GPT-3 能做 Few-Shot Learning？

**A**: **规模涌现 + 预训练见过类似模式**

**三个层次的解释**：

**1. 数据层面**：

- 预训练数据包含大量"示例 → 答案"格式（网页、论坛、代码注释）
- 模型学会识别这种模式

**2. 模型层面**：

- 175B 参数 → 足够大的"记忆容量"存储模式
- Transformer 的 In-Context 机制：Attention 可以"检索"示例

**3. 涌现层面**：

- 小模型（< 1B）：Few-Shot 随机猜
- 中模型（1B ~ 10B）：Few-Shot 略优于随机
- 大模型（> 100B）：Few-Shot 性能突然跃升（**涌现**）

**实验证据**（GPT-3 论文）：

| 任务 | Zero-Shot | One-Shot | Few-Shot (K=32) |
|------|-----------|----------|-----------------|
| 翻译（EN→FR） | 25% | 42% | **55%** |
| 算术（2 位加法） | 0% | 8% | **80%** |

#### Q3: Scaling Law 的核心结论是什么？

**A**: **模型性能遵循幂律，参数量和数据量应同步增长**

**Kaplan et al. (2020) 的发现**：

$$L(N) = \left(\frac{N_c}{N}\right)^{0.076}$$

- 参数量 $N$ 增加 10 倍 → Loss 降低 13%
- **无饱和趋势**：从 117M → 175B 一直有效

**Chinchilla Law (2022) 的修正**：

$$N^* \propto C^{0.5}, \quad D^* \propto C^{0.5}$$

- 给定计算预算 $C$，最优策略：**参数量和数据量等比例增长**
- GPT-3 是**欠训练**的（175B 参数只训练 300B tokens）

**启示**：

- Llama 2 (70B, 2T tokens) 借鉴此策略
- 未来趋势：不仅增大模型，更要增加训练数据

#### Q4: BPE Tokenization 如何处理未见词？

**A**: **拆分为子词（Subword）序列**

**例子**：

```python
词汇表 = ['a', 'b', ..., 'z', 'dog', 'cat', 's', 'playing']

# 见过的词
text = "dogs playing"
tokens = ["dog", "s", " ", "playing"]  # ✓

# 未见词
text = "catsplaying"
tokens = ["cat", "s", "playing"]  # 拆分为已知子词
```

**算法**（贪心最长匹配）：

```python
def bpe_encode(word, vocab):
    tokens = []
    i = 0
    while i < len(word):
        # 找最长匹配
        for length in range(len(word) - i, 0, -1):
            subword = word[i:i+length]
            if subword in vocab:
                tokens.append(subword)
                i += length
                break
    return tokens
```

**优势**：

- **无 OOV**：任何词都能拆分（最坏情况拆成字符）
- **效率**：高频词单独 token（"the" 是 1 个 token）
- **泛化**：新词自动拆分（"ChatGPT" → ["Chat", "G", "PT"]）

#### Q5: (Hard) GPT 的 Causal Mask 如何影响梯度流？

**A**: **未来位置的梯度被阻断，只有历史位置参与更新**

**前向**（预测位置 3）：

$$Q_3 \cdot K^T = [q_3 k_0, q_3 k_1, q_3 k_2, q_3 k_3, q_3 k_4, ...]$$

**Causal Mask 应用**：

$$\text{Scores} = [s_0, s_1, s_2, s_3, -\infty, -\infty, ...]$$

位置 4, 5 被屏蔽。

**Softmax 后**：

$$\alpha_3 = [0.1, 0.3, 0.4, 0.2, 0, 0, ...]$$

未来位置权重为 0。

**反向传播**（Attention 的梯度）：

$$\frac{\partial L}{\partial K_i} = \sum_{t} \frac{\partial L}{\partial A_t} \cdot \alpha_{ti} \cdot Q_t$$

- 如果 $i > t$（未来位置），$\alpha_{ti} = 0$ → $\frac{\partial L}{\partial K_i} = 0$

**结果**：

- 位置 3 的损失**只更新位置 0~3** 的参数
- 位置 4, 5 不受影响（梯度为 0）

**为什么这样设计？**

- **因果性**：生成时只能看历史 → 训练也必须只看历史
- **防止信息泄露**：如果训练时能看未来，推理时看不到 → 性能下降

#### Q6: GPT-3 为什么用 Pre-Norm 而非 Post-Norm？

**A**: **梯度稳定性，支持更深网络**

**Post-Norm**（Transformer 2017, GPT-1）：

$$x = \text{LN}(x + \text{Attn}(x))$$

**Pre-Norm**（GPT-2, GPT-3）：

$$x = x + \text{Attn}(\text{LN}(x))$$

**梯度分析**：

**Post-Norm** 的梯度：

$$\frac{\partial L}{\partial x} = \frac{\partial L}{\partial \text{LN}(x + \text{Attn})} \cdot \frac{\partial \text{LN}}{\partial x}$$

- $\frac{\partial \text{LN}}{\partial x}$ 包含除法和平方根 → **梯度不稳定**

**Pre-Norm** 的梯度：

$$\frac{\partial L}{\partial x} = \frac{\partial L}{\partial (x + \text{Attn})} \cdot 1$$

- 残差连接有直通路径 → **梯度稳定**

**实验证据**（GPT-2 论文）：

| 配置 | 最大稳定层数 | 训练 Loss |
|------|-------------|----------|
| Post-Norm | ~24 层 | 2.85 |
| **Pre-Norm** | **48 层+** | **2.73** |

**结论**：Pre-Norm 是深层 Transformer 的标配（GPT-3 96 层）。

#### Q7: RLHF 如何改进 GPT？

**A**: **通过人类反馈对齐模型输出与人类偏好**

**问题**（纯 LM 训练）：

- 训练目标：$\min -\log P(x_t | x_{<t})$
- 学到的是"互联网文本的概率分布"
- 可能生成**有毒、有偏、无用**内容

**RLHF 流程**（3 步）：

**Step 1: SFT（Supervised Fine-Tuning）**

```python
# 人类演示
prompts = ["如何做番茄炒蛋？", ...]
responses = ["1. 打鸡蛋... 2. 切番茄...", ...]

# 监督学习
model.train(prompts, responses)
```

**Step 2: Reward Model（RM）**

```python
# 人类排序
prompt = "讲个笑话"
responses = [A, B, C, D]
human_ranking = [B > A > D > C]  # B 最好，C 最差

# 训练 RM
reward_model.train(prompt, responses, ranking)
# 学到：r(prompt, B) > r(prompt, A) > ...
```

**Step 3: PPO（Proximal Policy Optimization）**

```python
# 强化学习优化 LM
for prompt in prompts:
    response = model.generate(prompt)
    reward = reward_model(prompt, response)
    
    # PPO 更新
    loss = -reward + KL_penalty(model, sft_model)
    loss.backward()
```

**效果**（InstructGPT 论文）：

| 指标 | GPT-3 (纯 LM) | InstructGPT (RLHF) |
|------|--------------|-------------------|
| 有害输出率 | 5.2% | **1.5%** |
| 用户偏好 | 30% | **70%** |
| 真实性 | 60% | **78%** |

#### Q8: GPT 如何生成文本？采样策略有哪些？

**A**: **自回归逐词生成 + 多种采样策略**

**基础流程**：

```python
def generate(model, prompt, max_len=50):
    tokens = tokenize(prompt)
    
    for _ in range(max_len):
        # 前向
        logits = model(tokens)  # [seq_len, vocab_size]
        next_token_logits = logits[-1]  # [vocab_size]
        
        # 采样
        next_token = sample(next_token_logits)
        
        # 添加到序列
        tokens.append(next_token)
        
        if next_token == EOS_TOKEN:
            break
    
    return tokens
```

**采样策略**：

**1. Greedy Decoding（贪心）**：

$$\text{next\_token} = \arg\max P(x_t | x_{<t})$$

- 优点：确定性
- 缺点：重复、单调（"I think that that that..."）

**2. Temperature Sampling**：

$$P'(x_t) = \frac{\exp(\text{logit}_t / T)}{\sum_i \exp(\text{logit}_i / T)}$$

- $T < 1$：更确定（接近 Greedy）
- $T > 1$：更随机（更多样）

**3. Top-K Sampling**：

```python
# 只从概率最高的 K 个 token 中采样
top_k_probs, top_k_indices = torch.topk(probs, k=40)
next_token = sample(top_k_indices, top_k_probs)
```

**4. Top-P (Nucleus) Sampling**：

```python
# 从累积概率达到 P 的最小集合中采样
sorted_probs, sorted_indices = torch.sort(probs, descending=True)
cumsum = torch.cumsum(sorted_probs, dim=0)
nucleus = sorted_indices[cumsum <= p]  # p=0.9
next_token = sample(nucleus)
```

**实战配置**（ChatGPT）：

- Temperature: 0.7（平衡质量和多样性）
- Top-P: 0.9
- Repetition Penalty: 1.2（惩罚重复）

---

**本章总结**：

GPT 系列通过**自回归语言建模 + 规模扩展**实现了从监督学习到 In-Context Learning 的跨越。核心进化：GPT-1（验证 LM 预训练）→ GPT-2（Zero-Shot）→ GPT-3（Few-Shot 涌现）→ GPT-4（多模态 + RLHF 对齐）。Scaling Law 揭示了"大力出奇迹"的数学基础。2026 面试必考：GPT vs BERT、Causal Mask 梯度流、Few-Shot 原理、RLHF 流程、采样策略对比。


---

## 第 18 章 Transformer 变体：T5、ViT、Sparse Attention

### 18.1 T5 - Text-to-Text Transfer Transformer

#### 18.1.1 核心思想：统一框架

**T5 的革命性观点**（Raffel et al., 2020, Google）：

> **所有 NLP 任务都可以转化为 Text-to-Text 格式**

**传统方法**（任务特定架构）：

| 任务 | 输入 | 输出 | 架构 |
|------|------|------|------|
| 分类 | 文本 | 类别标签 | BERT + 分类头 |
| 翻译 | 源语言 | 目标语言 | Seq2Seq |
| 问答 | 问题 + 上下文 | 答案起止位置 | BERT + Span 预测 |
| 摘要 | 长文本 | 短文本 | BART, PEGASUS |

**T5 的统一方式**：

| 任务 | T5 输入 | T5 输出 |
|------|---------|---------|
| **分类** | `"sentiment: This movie is great"` | `"positive"` |
| **翻译** | `"translate English to German: That is good."` | `"Das ist gut."` |
| **问答** | `"question: What is the capital of France? context: Paris is..."` | `"Paris"` |
| **摘要** | `"summarize: Long article text..."` | `"Summary text"` |

**优势**：

- **单一模型**处理所有任务（多任务学习）
- **无需任务特定层**（分类头、Span 预测头等）
- **统一评估**：所有任务用 Text 生成质量衡量

#### 18.1.2 架构：Encoder-Decoder

**T5 = 完整的 Transformer（Encoder + Decoder）**

```
输入: "translate English to French: cat"
    ↓
Encoder (12 layers):
    Embedding → Self-Attention (无 Mask) → FFN → ...
    ↓
Encoder 输出: [batch, src_len, d_model]
    ↓
Decoder (12 layers):
    Embedding → Masked Self-Attention → Cross-Attention → FFN → ...
    ↓
输出: "chat"
```

**配置**（T5-base）：

- **Encoder**: 12 层
- **Decoder**: 12 层
- **d_model**: 768
- **d_ff**: 3072
- **num_heads**: 12
- **参数量**: ~220M

**T5 系列**：

| 模型 | 参数量 | Encoder 层 | Decoder 层 | d_model | d_ff |
|------|--------|-----------|-----------|---------|------|
| T5-Small | 60M | 6 | 6 | 512 | 2048 |
| T5-Base | 220M | 12 | 12 | 768 | 3072 |
| T5-Large | 770M | 24 | 24 | 1024 | 4096 |
| T5-3B | 3B | 24 | 24 | 1024 | 16384 |
| **T5-11B** | **11B** | 24 | 24 | 1024 | 65536 |

#### 18.1.3 相对位置编码（Relative Position Bias）

**T5 的位置编码创新**：不在输入加 PE，而是在 Attention 中加**相对位置偏置**

**传统 Attention**：

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right) V$$

**T5 Attention**：

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T + B}{\sqrt{d_k}}\right) V$$

其中 $B_{ij}$ 是**可学习的相对位置偏置**，只依赖 $i - j$。

**符号定义**：

| 符号 | 含义 | 形状 |
|------|------|------|
| $B$ | 相对位置偏置矩阵 | $[n, n]$ |
| $b_{i-j}$ | 位置差为 $i-j$ 的偏置 | 标量 |
| $B_{ij} = b_{i-j}$ | 矩阵元素 | - |

**实现**：

```python
class T5Attention(nn.Module):
    def __init__(self, d_model=768, num_heads=12, max_distance=128):
        super().__init__()
        self.num_heads = num_heads
        self.d_head = d_model // num_heads
        
        # Q, K, V 投影
        self.W_Q = nn.Linear(d_model, d_model)
        self.W_K = nn.Linear(d_model, d_model)
        self.W_V = nn.Linear(d_model, d_model)
        
        # 相对位置偏置（每个头独立）
        self.relative_bias = nn.Embedding(
            2 * max_distance + 1,  # -128 ~ 128
            num_heads
        )
        self.max_distance = max_distance
    
    def compute_bias(self, seq_len):
        """计算相对位置偏置矩阵"""
        # 位置索引
        positions = torch.arange(seq_len)
        relative_positions = positions.unsqueeze(0) - positions.unsqueeze(1)  # [seq_len, seq_len]
        
        # 截断到 [-max_distance, max_distance]
        relative_positions = torch.clamp(
            relative_positions,
            -self.max_distance,
            self.max_distance
        )
        
        # 转为正索引（0 ~ 2*max_distance）
        relative_positions += self.max_distance
        
        # 查表
        bias = self.relative_bias(relative_positions)  # [seq_len, seq_len, num_heads]
        
        # 转置为 [num_heads, seq_len, seq_len]
        return bias.permute(2, 0, 1)
    
    def forward(self, x):
        batch, seq_len, d_model = x.shape
        
        # 投影
        Q = self.W_Q(x).view(batch, seq_len, self.num_heads, self.d_head).transpose(1, 2)
        K = self.W_K(x).view(batch, seq_len, self.num_heads, self.d_head).transpose(1, 2)
        V = self.W_V(x).view(batch, seq_len, self.num_heads, self.d_head).transpose(1, 2)
        # Q, K, V: [batch, num_heads, seq_len, d_head]
        
        # Attention scores
        scores = torch.matmul(Q, K.transpose(-2, -1)) / (self.d_head ** 0.5)
        # scores: [batch, num_heads, seq_len, seq_len]
        
        # 添加相对位置偏置
        bias = self.compute_bias(seq_len)  # [num_heads, seq_len, seq_len]
        scores = scores + bias.unsqueeze(0)  # 广播到 batch
        
        # Softmax + Value
        attn = torch.softmax(scores, dim=-1)
        out = torch.matmul(attn, V)  # [batch, num_heads, seq_len, d_head]
        
        # 合并头
        out = out.transpose(1, 2).contiguous().view(batch, seq_len, d_model)
        return out
```

**为什么用相对位置？**

1. **外推性更好**：训练时 512 长度，推理时 1024 → 相对位置仍有效（绝对位置会 OOV）
2. **更少参数**：只需存储 $2 \times \text{max\_distance} + 1$ 个偏置（257 个），而非 $n \times d$ 的 PE
3. **跨头共享**：每个头可以学习不同的相对位置模式

#### 18.1.4 C4 数据集与预训练

**C4（Colossal Clean Crawled Corpus）**：

- **来源**：Common Crawl（网页抓取）
- **大小**：750GB 文本
- **清洗**：
  - 去重
  - 过滤非英语
  - 去除乱码、广告
  - 保留句子完整的段落

**预训练任务**（Span Corruption）：

类似 BERT 的 MLM，但遮盖**连续 span**：

```
原始文本: "Thank you for inviting me to your party last week."

遮盖后（输入 Encoder）:
"Thank you <X> inviting me to your party <Y> week."

目标（Decoder 生成）:
"<X> for <Y> last <Z>"
```

**损失函数**：

$$L = -\sum_{t} \log P(\text{span}_t | \text{input}, \text{span}_{<t})$$

Decoder 自回归生成被遮盖的 span。

#### 18.1.5 T5 vs BERT vs GPT

| 维度 | BERT | GPT | T5 |
|------|------|-----|-----|
| **架构** | Encoder only | Decoder only | **Encoder-Decoder** |
| **预训练任务** | MLM + NSP | 自回归 LM | **Span Corruption** |
| **位置编码** | Learned PE | Learned PE | **Relative Bias** |
| **适用任务** | 理解（分类、NER） | 生成（续写） | **所有任务（统一）** |
| **推理方式** | 并行编码 | 自回归生成 | **Encoder 并行 + Decoder 自回归** |

---

### 18.2 ViT - Vision Transformer（图像也是序列）

#### 18.2.1 核心思想：Patch Embedding

**ViT 的突破**（Dosovitskiy et al., 2020, Google）：

> **将图像切成 patches，当作 token 序列，直接用 Transformer 处理**

**传统 CV**：卷积神经网络（CNN）→ ResNet, EfficientNet

**ViT 的做法**：

```
图像 (224×224×3)
    ↓ 切分为 16×16 patches
    ↓ 得到 (14×14) = 196 个 patches
    ↓ 每个 patch 展平为向量 (16×16×3 = 768)
    ↓ Linear 投影到 d_model
    ↓ 加上位置编码
    ↓ Transformer Encoder（与 BERT 相同）
    ↓ [CLS] token 输出 → 分类
```

#### 18.2.2 Patch Embedding 详解

**符号定义**：

| 符号 | 含义 | 形状 |
|------|------|------|
| $I$ | 输入图像 | $[H, W, C]$ |
| $P$ | Patch 大小 | 标量（通常 16） |
| $N$ | Patch 数量 | $N = \frac{H \times W}{P^2}$ |
| $x_p$ | 第 $p$ 个 patch | $[P \times P \times C]$ |
| $E$ | Patch Embedding 矩阵 | $[P^2 \cdot C, d]$ |

**步骤**：

**Step 1: 切分 Patches**

```python
# 图像: [224, 224, 3]
# Patch 大小: 16×16

patches = []
for i in range(0, 224, 16):
    for j in range(0, 224, 16):
        patch = image[i:i+16, j:j+16, :]  # [16, 16, 3]
        patches.append(patch)

# 结果: 196 个 patches
```

**Step 2: 展平 + 线性投影**

```python
# 展平每个 patch
patch_flat = patch.reshape(-1)  # [768]（16×16×3）

# 线性投影到 d_model
embedding = Linear(patch_flat)  # [768] → [768]（假设 d_model=768）
```

**Step 3: 添加 [CLS] token + 位置编码**

```python
# [CLS] token（可学习）
cls_token = nn.Parameter(torch.randn(1, 768))

# 拼接
tokens = torch.cat([cls_token, patch_embeddings], dim=0)  # [197, 768]

# 位置编码（可学习）
pos_encoding = nn.Parameter(torch.randn(197, 768))
tokens = tokens + pos_encoding
```

**完整代码**：

```python
class PatchEmbedding(nn.Module):
    def __init__(self, img_size=224, patch_size=16, in_channels=3, d_model=768):
        super().__init__()
        self.patch_size = patch_size
        self.num_patches = (img_size // patch_size) ** 2
        
        # 卷积实现 Patch Embedding（等价于展平 + Linear）
        self.projection = nn.Conv2d(
            in_channels, d_model,
            kernel_size=patch_size,
            stride=patch_size
        )
        
        # [CLS] token
        self.cls_token = nn.Parameter(torch.randn(1, 1, d_model))
        
        # 位置编码
        self.pos_embedding = nn.Parameter(
            torch.randn(1, self.num_patches + 1, d_model)
        )
    
    def forward(self, x):
        # x: [batch, 3, 224, 224]
        batch = x.shape[0]
        
        # Patch Embedding
        x = self.projection(x)  # [batch, d_model, 14, 14]
        x = x.flatten(2)  # [batch, d_model, 196]
        x = x.transpose(1, 2)  # [batch, 196, d_model]
        
        # 添加 [CLS]
        cls_tokens = self.cls_token.expand(batch, -1, -1)  # [batch, 1, d_model]
        x = torch.cat([cls_tokens, x], dim=1)  # [batch, 197, d_model]
        
        # 位置编码
        x = x + self.pos_embedding
        
        return x
```

#### 18.2.3 ViT 架构

**完整模型**：

```python
class ViT(nn.Module):
    def __init__(self, img_size=224, patch_size=16, num_classes=1000,
                 d_model=768, num_layers=12, num_heads=12):
        super().__init__()
        
        # Patch Embedding
        self.patch_embed = PatchEmbedding(img_size, patch_size, 3, d_model)
        
        # Transformer Encoder（与 BERT 相同）
        self.encoder = nn.ModuleList([
            TransformerEncoderLayer(d_model, num_heads, d_ff=3072)
            for _ in range(num_layers)
        ])
        
        # 分类头
        self.norm = nn.LayerNorm(d_model)
        self.head = nn.Linear(d_model, num_classes)
    
    def forward(self, x):
        # Patch Embedding
        x = self.patch_embed(x)  # [batch, 197, 768]
        
        # Encoder
        for layer in self.encoder:
            x = layer(x)
        
        # 取 [CLS] token
        cls_output = x[:, 0]  # [batch, 768]
        
        # 分类
        x = self.norm(cls_output)
        logits = self.head(x)  # [batch, num_classes]
        
        return logits
```

**配置**（ViT-Base）：

- **Patch 大小**: 16×16
- **d_model**: 768
- **层数**: 12
- **注意力头数**: 12
- **参数量**: ~86M
- **输入分辨率**: 224×224

**ViT 系列**：

| 模型 | 参数量 | 层数 | d_model | 头数 | Patch 大小 |
|------|--------|------|---------|------|-----------|
| ViT-Base | 86M | 12 | 768 | 12 | 16×16 |
| ViT-Large | 307M | 24 | 1024 | 16 | 16×16 |
| **ViT-Huge** | **632M** | 32 | 1280 | 16 | 14×14 |

#### 18.2.4 ViT vs CNN

| 维度 | CNN (ResNet) | ViT |
|------|--------------|-----|
| **归纳偏置** | **强**（局部性、平移不变性） | 弱（需要学习） |
| **小数据性能** | **好**（ImageNet 1.3M） | 差（需要预训练） |
| **大数据性能** | 饱和 | **持续提升** |
| **计算复杂度** | $O(HWC^2)$ | $O(N^2d)$（$N$ 是 patch 数） |
| **解释性** | 特征图可视化 | Attention Map |

**关键发现**（ViT 论文）：

- **小数据**（ImageNet）：ViT < ResNet
- **大数据**（JFT-300M，3 亿图像）：ViT **> ResNet**

**原因**：ViT 的**归纳偏置少**，需要大数据学习；但一旦学会，泛化能力更强。

---

### 18.3 Sparse Attention（突破 $O(n^2)$ 瓶颈）

#### 18.3.1 问题：Self-Attention 的复杂度

**标准 Self-Attention**：

$$\text{Complexity} = O(n^2 d)$$

- $n$: 序列长度
- $d$: 隐藏维度

**瓶颈**：

- GPT-3 上下文 2048 → $2048^2 = 4M$ 次计算
- 如果扩展到 64K → $64K^2 = 4B$ 次计算（**1000 倍**）

**显存占用**：

- Attention 矩阵: $[n, n]$ → $64K^2 \times 4 \text{ bytes} = 16GB$（单头！）

#### 18.3.2 Longformer（滑动窗口 + 全局注意力）

**核心思想**（Beltagy et al., 2020）：

> **局部用滑动窗口，全局用少量 token**

**三种注意力模式**：

**1. 滑动窗口（Sliding Window）**：

每个 token 只 attend 到窗口内的邻居：

```
窗口大小 w=2:

Position 0: attend to [0]
Position 1: attend to [0, 1, 2]
Position 2: attend to [0, 1, 2, 3, 4]
Position 3: attend to [1, 2, 3, 4, 5]
...
```

**复杂度**：$O(n \times w \times d)$，线性！

**2. 扩展注意力（Dilated Attention）**：

跳跃式注意力（类似空洞卷积）：

```
Dilation d=2:

Position 4: attend to [0, 2, 4, 6, 8]（每隔 2 个）
```

**3. 全局注意力（Global Attention）**：

少数 token（如 [CLS]）可以 attend 到所有 token：

```
[CLS] token: attend to all
其他 token: attend to [CLS] + 窗口内
```

**Longformer 架构**：

```python
class LongformerAttention(nn.Module):
    def __init__(self, d_model=768, num_heads=12, window_size=512):
        super().__init__()
        self.window_size = window_size
        # Q, K, V 投影（省略）
    
    def forward(self, x, global_attention_mask=None):
        """
        x: [batch, seq_len, d_model]
        global_attention_mask: [batch, seq_len]（1 表示全局 token）
        """
        batch, seq_len, d_model = x.shape
        
        # 计算 Q, K, V
        Q, K, V = self.project(x)
        
        # 1. 滑动窗口 Attention
        windowed_scores = self.sliding_window_attention(Q, K)
        # windowed_scores: [batch, num_heads, seq_len, window_size]
        
        # 2. 全局 Attention（仅对标记为全局的 token）
        if global_attention_mask is not None:
            global_scores = self.global_attention(Q, K, global_attention_mask)
        
        # 3. 合并
        attn = torch.softmax(torch.cat([windowed_scores, global_scores], dim=-1), dim=-1)
        
        return torch.matmul(attn, V)
    
    def sliding_window_attention(self, Q, K):
        """滑动窗口实现（简化）"""
        # 构造窗口索引
        # （实际使用稀疏矩阵或定制 CUDA kernel）
        ...
```

**复杂度**：

- 滑动窗口: $O(n \times w)$
- 全局 token（$g$ 个）: $O(g \times n)$
- **总计**: $O(n \times (w + g))$（通常 $w + g \ll n$）

**应用**：

- **文档级任务**：长文档分类、问答（支持 4096+ tokens）
- **Longformer-LED**（Long Encoder-Decoder）：摘要、翻译

#### 18.3.3 BigBird（随机 + 窗口 + 全局）

**核心思想**（Zaheer et al., 2020, Google）：

> **结合三种模式：随机、窗口、全局**

**Attention 图**：

```
每个 token 的 Attention 包括：
1. 窗口内邻居（w=3）
2. 随机选择 r 个 token（r=3）
3. 全局 token（g=2）

Position 5 attend to:
- 窗口: [3, 4, 5, 6, 7]
- 随机: [1, 9, 15]（随机采样）
- 全局: [0, n-1]（[CLS], [SEP]）
```

**复杂度**：$O(n \times (w + r + g))$

**理论保证**（BigBird 论文）：

- 证明：这种稀疏图可以**近似任意函数**（图灵完备）
- 即：稀疏 Attention 的表达能力与全连接 Attention 等价

**代码**（简化）：

```python
def bigbird_attention(Q, K, V, window_size=3, num_random=3, global_tokens=[0]):
    batch, num_heads, seq_len, d_head = Q.shape
    
    # 初始化稀疏 Attention 矩阵
    attn_mask = torch.zeros(seq_len, seq_len)
    
    for i in range(seq_len):
        # 1. 窗口内
        start = max(0, i - window_size)
        end = min(seq_len, i + window_size + 1)
        attn_mask[i, start:end] = 1
        
        # 2. 随机
        random_indices = torch.randint(0, seq_len, (num_random,))
        attn_mask[i, random_indices] = 1
        
        # 3. 全局
        attn_mask[i, global_tokens] = 1
        attn_mask[global_tokens, i] = 1
    
    # 应用 mask
    scores = torch.matmul(Q, K.transpose(-2, -1))
    scores = scores.masked_fill(attn_mask == 0, float('-inf'))
    attn = torch.softmax(scores, dim=-1)
    
    return torch.matmul(attn, V)
```

#### 18.3.4 Flash Attention（IO 优化）

**核心思想**（Dao et al., 2022, Stanford）：

> **不改变算法，优化 GPU 内存访问模式**

**传统 Attention 的问题**：

```
1. 计算 QK^T → 写入 HBM（高带宽内存）
2. Softmax → 从 HBM 读取 → 写回 HBM
3. 乘 V → 从 HBM 读取 → 写回 HBM

总 HBM 访问: O(n^2)
```

**Flash Attention 的优化**：

```
分块计算 + 在线 Softmax：

1. 分块加载 Q, K, V 到 SRAM（片上快速内存）
2. 在 SRAM 内完成 Attention 计算
3. 仅写回最终结果

总 HBM 访问: O(n)（减少 n 倍！）
```

**性能提升**：

- **速度**: 2-4 倍（相同硬件）
- **显存**: 可处理 64K 序列（原本只能 2K）

**关键技术**：

- **Tiling**（分块）
- **Kernel Fusion**（算子融合）
- **Recomputation**（前向不存中间结果，反向重计算）

---

### 📊 面试考点

#### Q1: T5 的"Text-to-Text"框架有什么优势？

**A**: **统一架构 + 多任务学习 + 无需任务特定层**

**优势**：

1. **单一模型多任务**：
   - 分类、翻译、问答、摘要 → 同一个 T5 模型
   - 省去每个任务训练独立模型的成本

2. **多任务学习增益**：
   - 翻译任务的梯度帮助摘要任务（共享 Encoder）
   - 实验显示：多任务训练比单任务训练性能高 **2-5%**

3. **统一评估**：
   - 所有任务用 Text 生成质量（BLEU, ROUGE）
   - 无需针对每个任务设计指标

**实例**：

```python
# 传统方法（3 个模型）
classifier = BERTForClassification()
translator = MarianMT()
summarizer = PEGASUS()

# T5（1 个模型）
t5 = T5Model()
t5.generate("sentiment: This is great")  # → "positive"
t5.generate("translate English to French: Hello")  # → "Bonjour"
t5.generate("summarize: Long text...")  # → "Summary"
```

#### Q2: ViT 为什么需要大数据预训练？

**A**: **归纳偏置少，必须从数据中学习局部性和平移不变性**

**CNN 的归纳偏置**：

1. **局部性**：卷积核只看局部区域（3×3, 5×5）
2. **平移不变性**：权重共享 → 平移图像，特征图平移
3. **层次性**：浅层学边缘，深层学物体

这些偏置**硬编码**在架构中 → 小数据也能学好。

**ViT 的自由度**：

1. **全局 Attention**：每个 patch 可以 attend 到任何 patch
2. **无权重共享**：位置编码区分不同位置
3. **需要学习**：什么是"局部性"（邻近 patches 相关）

**实验证据**（ViT 论文）：

| 预训练数据 | ViT-Base 准确率 | ResNet-50 准确率 |
|-----------|----------------|------------------|
| **ImageNet**（1.3M） | 77.9% | **78.4%** |
| **ImageNet-21K**（14M） | 83.1% | 82.9% |
| **JFT-300M**（300M） | **87.8%** | 85.7% |

ViT 在小数据劣势，大数据优势明显。

#### Q3: Relative Position Bias vs Absolute Position Embedding 的区别？

**A**: 

| 特性 | Absolute PE（BERT） | Relative Bias（T5） |
|------|---------------------|---------------------|
| **编码内容** | 绝对位置（0, 1, 2, ...） | 相对位置差（i-j） |
| **添加位置** | 输入层（$X + PE$） | Attention 内部（$QK^T + B$） |
| **参数量** | $O(n \times d)$ | $O(\text{max\_distance})$ |
| **外推性** | 差（超过 max_len 失效） | **好**（相对关系保持） |
| **每层共享** | 是（同一个 PE） | 否（每层独立学习） |

**数学**：

**Absolute PE**：

$$h_i = \text{Attn}(x_i + pe_i, ...)$$

$pe_i$ 是位置 $i$ 的固定/学习向量。

**Relative Bias**：

$$\text{Attn}_{ij} = \frac{\exp(q_i k_j^T + b_{i-j})}{\sum_j \exp(...)}$$

$b_{i-j}$ 只依赖相对距离。

**优势**（T5 论文实验）：

- 训练 512 长度，推理 1024 长度：
  - Absolute PE: 性能下降 **8%**
  - Relative Bias: 性能下降 **2%**

#### Q4: Sparse Attention 如何降低复杂度？

**A**: **限制每个 token 的 Attention 范围**

**全连接 Attention**：

- 每个 token attend 到所有 $n$ 个 token
- 复杂度: $O(n^2)$

**稀疏 Attention 策略**：

**1. 滑动窗口**（Longformer）：

- 每个 token 只 attend 到窗口内 $w$ 个 token
- 复杂度: $O(n \times w)$
- $w$ 固定（如 512）→ 线性复杂度

**2. 随机采样**（BigBird）：

- 每个 token 随机 attend 到 $r$ 个 token
- 复杂度: $O(n \times r)$

**3. 全局 token**：

- $g$ 个特殊 token（[CLS]）attend 到所有
- 复杂度: $O(g \times n)$

**总复杂度**（BigBird）：

$$O(n \times (w + r + g))$$

通常 $w + r + g = O(1)$ → 线性复杂度。

**实例**（序列长度 16K）：

| 方法 | 复杂度 | 实际计算量 |
|------|--------|-----------|
| 全连接 | $O(16K^2)$ | 256M |
| BigBird（w=512, r=64, g=2） | $O(16K \times 578)$ | **9.2M**（**27 倍加速**） |

#### Q5: (Hard) ViT 的位置编码为什么是 2D 的？

**A**: **图像有 2D 空间结构，需要编码 (x, y) 坐标**

**1D 位置编码**（BERT, GPT）：

$$PE(pos) = \sin(pos / 10000^{2i/d})$$

位置是标量（0, 1, 2, ...）。

**ViT 的 2D 扩展**：

**方法 1: 学习式位置编码**（ViT 论文采用）：

```python
# 图像 224×224，patch 16×16 → 14×14 = 196 patches
num_patches = 196

# 可学习位置编码（1D，展平）
pos_embedding = nn.Parameter(torch.randn(1, num_patches + 1, d_model))

# 使用时直接加
x = x + pos_embedding
```

**方法 2: 2D Sinusoidal**（一些变体）：

```python
# 为每个 patch 编码 (row, col)
for i in range(14):  # row
    for j in range(14):  # col
        pe_2d[i, j] = concat([
            sin(i / 10000^(2k/d)),  # row 编码
            sin(j / 10000^(2k/d))   # col 编码
        ])
```

**实验发现**（ViT 论文）：

- **学习式 1D** vs **Sinusoidal 2D**：性能几乎相同
- 原因：Transformer 的 Self-Attention **自动学习了空间关系**（相邻 patches 的 Attention 权重高）

**可视化**：

训练后的位置编码相似度矩阵显示：

- 相邻 patches 的编码相似（说明学到了 2D 邻近性）
- 即使用 1D 编码，模型也能推断 2D 结构

#### Q6: Flash Attention 如何做到 2-4 倍加速？

**A**: **减少 GPU 内存访问（HBM ↔ SRAM），而非减少计算量**

**GPU 内存层次**：

| 内存 | 容量 | 带宽 | 访问延迟 |
|------|------|------|----------|
| **HBM**（高带宽内存） | 40GB | 1.5 TB/s | 慢（~100ns） |
| **SRAM**（片上内存） | 20MB | 19 TB/s | **快**（~1ns） |

**传统 Attention 的瓶颈**：

```python
# 1. 计算 S = QK^T
S = Q @ K.T  # 写入 HBM（n^2 大小）

# 2. Softmax
P = softmax(S)  # 从 HBM 读 S，写回 P（n^2）

# 3. 乘 V
O = P @ V  # 从 HBM 读 P（n^2）

# 总 HBM 访问: 4n^2（读写各 2 次）
```

**Flash Attention 的优化**：

**核心技术：分块 + 在线 Softmax**

```python
# 将 Q, K, V 分块（每块小到能放入 SRAM）
for block_q in Q_blocks:
    for block_k in K_blocks:
        # 在 SRAM 内计算
        S_block = block_q @ block_k.T
        P_block = online_softmax(S_block)  # 不存完整 S
        O_block += P_block @ block_v
        
# 总 HBM 访问: O(n)（仅读 Q, K, V 和写 O）
```

**在线 Softmax**：

传统需要两遍（先求 max 和 sum，再归一化）：

```python
# Pass 1
m = max(S)
# Pass 2
P = exp(S - m) / sum(exp(S - m))
```

在线 Softmax 一遍完成（维护动态 max 和 sum）。

**性能对比**（A100 GPU, seq_len=2048）：

| 实现 | HBM 访问量 | 耗时 |
|------|-----------|------|
| PyTorch 标准 | 4×2048² = 16M | 8.2ms |
| **Flash Attention** | ~2048 | **2.1ms**（**3.9 倍快**） |

#### Q7: T5 的 Span Corruption 和 BERT 的 MLM 有什么区别？

**A**: **遮盖连续 span vs 随机单词，生成 span vs 分类**

| 维度 | BERT MLM | T5 Span Corruption |
|------|----------|-------------------|
| **遮盖单位** | 单个 token（15%） | 连续 span（平均 3 tokens） |
| **预测方式** | 分类（vocab_size 路） | **生成**（自回归 Decoder） |
| **输入** | 原句 + [MASK] | 原句 + `<X>`, `<Y>` 占位符 |
| **输出** | [MASK] 位置的 token | **生成 span 序列** |

**例子**：

```
原句: "The cat sat on the mat"

BERT:
输入: "The cat [MASK] on the [MASK]"
输出: predict "sat" at pos 2, "mat" at pos 5

T5:
输入（Encoder）: "The cat <X> on the <Y>"
输出（Decoder 生成）: "<X> sat <Y> mat <Z>"
```

**T5 的优势**：

1. **训练 Decoder**：BERT 只训练 Encoder，T5 同时训练 Encoder-Decoder
2. **span 级理解**：学习连续片段，而非孤立单词
3. **生成能力**：预训练就包含生成，下游生成任务迁移更好

#### Q8: BigBird 的理论保证是什么？

**A**: **稀疏 Attention 图是图灵完备的（可近似任意函数）**

**定理**（BigBird 论文）：

> 如果 Attention 图包含：
> 1. 固定模式（如滑动窗口）
> 2. 随机连接
> 3. 全局节点
>
> 则该图是**表达完备的**（Expressive Complete）

**含义**：

- 稀疏 Attention 的表达能力 ≈ 全连接 Attention
- 理论上可以近似任何函数（Universal Approximator）

**证明思路**（简化）：

1. **全局节点** → 可以聚合全局信息
2. **随机连接** → 可以在 $O(\log n)$ 步内到达任何节点（小世界网络）
3. **固定模式** → 保证局部信息流动

**实验验证**：

| 任务 | 全连接 Attention | BigBird |
|------|-----------------|---------|
| 长文档分类 | 84.2% | **84.1%** |
| 问答（HotpotQA） | 67.8% | **67.6%** |

性能几乎无损（<1% 差距）。

---

**本章总结**：

T5 统一 NLP 任务为 Text-to-Text，引入相对位置编码。ViT 将图像视为序列，证明 Transformer 可超越 CNN（需大数据）。Sparse Attention（Longformer, BigBird, Flash Attention）突破 $O(n^2)$ 瓶颈，支持长序列。2026 面试必考：T5 vs BERT vs GPT、ViT 归纳偏置、稀疏 Attention 复杂度分析、Flash Attention 优化原理。


---

## 第 19 章 面试题总结 - 按主题分类

### 19.1 Attention 机制

#### Q: Self-Attention 的计算复杂度是多少？瓶颈在哪里？

**A**: $O(n^2 d)$，瓶颈在 $QK^T$ 的矩阵乘法

**详细分析**：

1. **$QK^T$**: $[n, d] \times [d, n] = O(n^2 d)$
2. **Softmax**: $O(n^2)$（对每个 $n \times n$ 元素）
3. **乘 $V$**: $[n, n] \times [n, d] = O(n^2 d)$

**总复杂度**: $O(n^2 d)$

**瓶颈**：

- 序列长度 $n$ 增加时，复杂度**平方级增长**
- GPT-3 (2048) vs GPT-4 (32K) → 复杂度增加 **256 倍**

**解决方案**：

- Sparse Attention（Longformer, BigBird）
- Flash Attention（IO 优化）
- Linear Attention（近似方法）

---

#### Q: Multi-Head Attention 为什么要分多头？

**A**: **并行学习不同的表示子空间**

**单头问题**：

- 只能学习一种注意力模式（如：位置关系）

**多头优势**：

1. **多样性**：
   - Head 1: 学习**语法依赖**（主语-动词）
   - Head 2: 学习**语义关联**（"bank" - "river"）
   - Head 3: 学习**位置关系**（相邻词）

2. **表示丰富性**：
   - 每个头学习 $d/h$ 维子空间
   - 合并后得到更丰富的表示

**实验证据**（Transformer 论文）：

| 头数 | BLEU 分数 | 参数量 |
|------|-----------|--------|
| 1 | 24.8 | 相同 |
| 4 | 25.3 | 相同 |
| **8** | **25.8** | 相同 |
| 16 | 25.5（下降） | 相同 |

最优：8 头（BERT, GPT 默认）

---

#### Q: Attention 和 RNN/CNN 的区别？

**A**: 

| 维度 | RNN | CNN | Attention |
|------|-----|-----|-----------|
| **并行性** | 串行（$t$ 依赖 $t-1$） | 并行（窗口内） | **完全并行** |
| **长程依赖** | 差（梯度消失） | 差（需要深层叠加） | **强**（$O(1)$ 层） |
| **复杂度** | $O(nd^2)$ | $O(nkd^2)$ | $O(n^2d)$ |
| **归纳偏置** | 序列性 | 局部性、平移不变性 | 无（需要学习） |

**Attention 优势**：

- 长序列：一步直达任意位置（RNN 需 $O(n)$ 步）
- 可解释性：Attention 权重可视化

**劣势**：

- $O(n^2)$ 复杂度（长序列瓶颈）

---

### 19.2 位置编码

#### Q: Sinusoidal PE 为什么用 sin 和 cos？

**A**: **线性组合性质 + 外推性**

**核心性质**：

$$PE(pos + k) = f(PE(pos), PE(k))$$

**证明**（简化）：

$$\sin(pos \cdot \omega + k \cdot \omega) = \sin(pos \cdot \omega)\cos(k \cdot \omega) + \cos(pos \cdot \omega)\sin(k \cdot \omega)$$

模型可以通过 $PE(pos)$ 和 $PE(k)$ 的**线性组合**计算相对位置 $k$。

**为什么不用其他函数？**

- $pos$ 本身：无法表示相对位置
- $\log(pos)$：不具备线性组合性质
- 学习式 PE：外推性差（超过 max_len 失效）

**实验验证**（Transformer 论文）：

- Sinusoidal vs Learned：性能几乎相同
- 但 Sinusoidal 可以外推到训练时未见的长度

---

#### Q: RoPE 相比 Sinusoidal PE 的优势？

**A**: **相对位置 + 作用在 Attention 内部**

| 特性 | Sinusoidal PE | RoPE |
|------|--------------|------|
| **编码对象** | 输入 $X$ | $Q, K$（Attention 内部） |
| **位置信息** | 绝对位置 | **相对位置**（$m - n$） |
| **外推性** | 中等 | **优**（线性插值扩展） |
| **数学保证** | 线性组合 | **旋转不变性** |

**数学原理**：

$$q^{(m)} \cdot k^{(n)} = q^T R(m)^T R(n) k = q^T R(n-m) k$$

内积只依赖**相对位置** $m-n$。

**Llama 为什么用 RoPE**：

- 支持 4K → 32K 上下文扩展
- 无额外参数
- 工业验证（GPT-NeoX, PaLM）

---

### 19.3 架构设计

#### Q: Pre-Norm vs Post-Norm 的区别？

**A**: **归一化位置不同，影响梯度稳定性**

**Post-Norm**（Transformer 2017）：

$$x = \text{LN}(x + \text{Attn}(x))$$

**Pre-Norm**（GPT-2, GPT-3）：

$$x = x + \text{Attn}(\text{LN}(x))$$

**对比**：

| 特性 | Post-Norm | Pre-Norm |
|------|-----------|----------|
| **梯度稳定性** | 差（深层网络梯度爆炸） | **好**（残差直通路径） |
| **最大层数** | ~24 层 | **100+ 层** |
| **训练速度** | 慢（需要 Warm-up） | **快** |
| **最终性能** | 略高（饱和后） | 略低 |

**为什么 Pre-Norm 更稳定？**

**梯度分析**：

Post-Norm：

$$\frac{\partial L}{\partial x} = \frac{\partial L}{\partial \text{LN}(x + \text{Attn})} \cdot \frac{\partial \text{LN}}{\partial x}$$

$\frac{\partial \text{LN}}{\partial x}$ 包含除法和平方根 → 不稳定

Pre-Norm：

$$\frac{\partial L}{\partial x} = \frac{\partial L}{\partial (x + \text{Attn})} \cdot 1$$

残差连接有直通路径 → 梯度稳定

**工业选择**：

- BERT: Post-Norm（12 层够用）
- GPT-3 (96 层): **Pre-Norm**（必须）

---

#### Q: 为什么 FFN 的中间维度是 4 倍？

**A**: **经验值 + 容量需求**

**理论解释**：

1. **特征变换空间**：
   - $d \to 4d$：扩展到高维空间（更多非线性变换）
   - $4d \to d$：压缩回原维度（保留重要信息）

2. **容量分析**：
   - Attention: $O(d^2)$ 参数
   - FFN: $O(8d^2)$ 参数（$d \times 4d + 4d \times d$）
   - FFN 占总参数量 **2/3**（主要容量来源）

**实验验证**（Transformer 论文）：

| FFN 倍数 | BLEU 分数 | 参数量 |
|----------|-----------|--------|
| 1x | 24.1 | 38M |
| 2x | 25.2 | 51M |
| **4x** | **25.8** | 65M |
| 8x | 25.9（边际收益递减） | 103M |

**工业配置**：

- Transformer, BERT, GPT: **4x**（标配）
- T5-11B: **65x**（极大容量）

---

### 19.4 训练技巧

#### Q: BERT 和 GPT 的根本区别？

**A**: **双向编码 vs 单向生成**

| 维度 | BERT | GPT |
|------|------|-----|
| **架构** | Encoder only | Decoder only（无 Cross-Attn） |
| **Attention Mask** | 无 Mask（全连接） | **Causal Mask**（下三角） |
| **训练目标** | MLM（填空） | 下一个 token 预测 |
| **适用任务** | 理解（分类、问答） | 生成（续写、对话） |
| **推理方式** | 并行 | 自回归（逐个生成） |

**数学差异**（Attention 可见性）：

BERT 位置 3：

$$h_3 = \text{Attn}(Q_3, [K_0, K_1, K_2, K_3, K_4, K_5], ...)$$

能看到**所有**位置（包括未来 4, 5）

GPT 位置 3：

$$h_3 = \text{Attn}(Q_3, [K_0, K_1, K_2, K_3], ...)$$

只能看到**历史**位置（Causal Mask 屏蔽 4, 5）

**选择依据**：

- 理解任务（分类、NER）→ **BERT**
- 生成任务（对话、续写）→ **GPT**

---

#### Q: BERT 的 MLM 为什么用 80%-10%-10% 策略？

**A**: **解决训练-推理不匹配**

**问题**：

如果 100% 用 `[MASK]`：

- 训练时：输入有 `[MASK]` token
- 推理时：输入**没有** `[MASK]`（Fine-tuning 的句子是正常文本）
- 结果：模型学会"看到 [MASK] 就预测"，推理时性能下降

**80%-10%-10% 策略**：

- **80% [MASK]**：主要训练信号
- **10% 随机 token**：强迫模型不能只靠局部线索（必须理解上下文）
- **10% 不变**：让模型见到真实 token，缩小训练-推理差距

**实验证据**（BERT 论文）：

| 策略 | MLM 准确率 |
|------|-----------|
| 100% [MASK] | 83.6% |
| **80%-10%-10%** | **84.3%** |

---

#### Q: Fine-tuning 学习率为什么要小于 Pre-training？

**A**: **避免灾难性遗忘**

**原因**：

1. **Pre-training**：
   - 初始化：随机
   - 学习率：1e-4（较大，快速收敛）

2. **Fine-tuning**：
   - 初始化：**预训练好的权重**（已经很好）
   - 学习率：2e-5（**小 5 倍**）

**为什么小学习率？**

- 预训练权重包含**通用语言知识**（语法、语义、常识）
- 大学习率会快速覆盖这些知识 → 灾难性遗忘
- 小学习率：微调只调整"最后几层"或"轻微修改"表示

**实验证据**（BERT 论文）：

| Fine-tuning LR | 准确率 |
|----------------|--------|
| 1e-4（太大） | 82.1% |
| **2e-5**（推荐） | **84.5%** |
| 1e-5（太小） | 83.8%（收敛慢） |

---

### 19.5 工业技术

#### Q: MQA/GQA 解决了什么问题？

**A**: **KV Cache 显存瓶颈**

**标准 MHA 的问题**：

自回归生成时，每步需要缓存所有 token 的 K, V：

$$\text{KV Cache} = 2 \times n \times h \times d_k \times \text{batch}$$

**例子**（Llama 2 70B, 2048 tokens, batch=8）：

$$2 \times 2048 \times 8 \times 128 \times 8 = 32M \text{ 值} \times 2 \text{ bytes} = 64 MB$$

8 个 head → $64 \times 8 = 512 MB$（单层！）

80 层 → $512 \times 80 = 40 GB$（仅 KV Cache）

**MQA/GQA 解决方案**：

**MQA（Multi-Query Attention）**：

- 所有 head 共享**一组** K, V
- 显存：$40 GB \to 5 GB$（**8 倍减少**）

**GQA（Grouped-Query Attention，Llama 2）**：

- 8 个 Q head，分 2 组，每组共享一组 K, V
- 显存：$40 GB \to 10 GB$（**4 倍减少**）
- 性能：比 MQA 好（2 组 > 1 组）

**工业应用**：

- Llama 2 70B: GQA（4 组）
- PaLM: MQA

---

#### Q: RoPE 如何支持长序列外推？

**A**: **位置插值（Position Interpolation）**

**问题**：

训练时 4K 上下文，推理时想用 32K → 位置 4096~32767 从未见过

**RoPE 的解决方案**：

**线性插值**：

原始频率：

$$\theta_i = 10000^{-2i/d}$$

插值后（扩展 $s$ 倍，如 $s=8$）：

$$\theta_i' = \frac{\theta_i}{s} = \frac{10000^{-2i/d}}{8}$$

**效果**：

- 旋转角度变慢 → 位置变化更平滑
- 32K 位置的角度 = 原来 4K 位置的角度

**Llama 2 实例**：

- 训练：4K 上下文
- 推理：**32K** 上下文（8 倍）
- 方法：位置插值 $s=8$

**性能**：

| 上下文长度 | Perplexity（困惑度） |
|-----------|---------------------|
| 4K（训练） | 2.3 |
| 8K | 2.4（轻微下降） |
| 16K | 2.6 |
| **32K** | **2.8**（可用） |

---

#### Q: MoE 的辅助损失是什么？为什么需要？

**A**: **防止负载不均（专家坍缩）**

**问题**：

训练初期，Router 可能让所有 token 都选 Expert_0：

- Expert_1~7 永远不被选中
- 参数不更新 → "死专家"

**辅助损失**：

$$L_{aux} = \alpha \sum_{j=1}^{E} f_j \cdot P_j$$

- $f_j$: 专家 $j$ 被选中的频率
- $P_j$: Router 给专家 $j$ 的平均分数

**机制**：

如果某专家被选太多（$f_j$ 大）且 Router 给高分（$P_j$ 大）：

- $L_{aux}$ 大 → 梯度反传 → 降低该专家的 Router 分数
- 迫使 Router 选择其他专家

**实战值**：

- Mixtral: $\alpha = 0.01$
- Switch Transformer: $\alpha = 0.1$

**验证**：

无辅助损失 → 90% token 选 Expert_0

有辅助损失 → 每个专家处理 ~12.5% token（均匀）

---

### 19.6 Scaling Law

#### Q: Scaling Law 的核心结论？

**A**: **性能遵循幂律，参数量和数据量应同步增长**

**Kaplan et al. (2020) 发现**：

$$L(N) \approx \left(\frac{N_c}{N}\right)^{0.076}$$

- 参数量 $N$ 增加 10 倍 → Loss 降低 **13%**
- 无饱和趋势（从 117M → 175B 一直有效）

**Chinchilla Law (2022) 修正**：

$$N^* \propto C^{0.5}, \quad D^* \propto C^{0.5}$$

给定计算预算 $C$，最优策略：参数量和数据量**等比例增长**

**对比**：

| 模型 | 参数量 | 训练 Tokens | $N$ vs $D$ |
|------|--------|-------------|------------|
| GPT-3 | 175B | 300B | **欠训练**（$N >> D$） |
| Chinchilla | 70B | 1.4T | **最优**（$N \approx D$） |
| Llama 2 | 70B | 2T | 借鉴 Chinchilla |

**启示**：

- GPT-3 如果训练更久（1T+ tokens），性能还能显著提升
- 不仅要增大模型，更要增加训练数据

---

#### Q: GPT-3 的 In-Context Learning 为什么有效？

**A**: **规模涌现 + 预训练见过类似模式**

**三个层次解释**：

**1. 数据层面**：

- 预训练数据包含大量"示例 → 答案"格式（网页、论坛、代码注释）
- 模型学会识别这种模式

**2. 模型层面**：

- 175B 参数 → 足够大的"记忆容量"存储模式
- Transformer 的 In-Context 机制：Attention 可以"检索"示例

**3. 涌现层面**：

- 小模型（< 1B）：Few-Shot 随机猜
- 中模型（1B ~ 10B）：Few-Shot 略优于随机
- 大模型（> 100B）：Few-Shot 性能突然跃升（**涌现**）

**实验证据**（GPT-3 论文）：

| 任务 | Zero-Shot | One-Shot | Few-Shot (K=32) |
|------|-----------|----------|-----------------|
| 翻译（EN→FR） | 25% | 42% | **55%** |
| 算术（2 位加法） | 0% | 8% | **80%** |

---

### 19.7 模型对比

#### Q: T5 的 "Text-to-Text" 有什么优势？

**A**: **统一架构 + 多任务学习**

**优势**：

1. **单一模型多任务**：
   - 分类、翻译、问答、摘要 → 同一个 T5
   - 省去每个任务训练独立模型的成本

2. **多任务学习增益**：
   - 翻译任务的梯度帮助摘要任务（共享 Encoder）
   - 实验：多任务训练比单任务性能高 **2-5%**

3. **统一评估**：
   - 所有任务用 Text 生成质量（BLEU, ROUGE）

**示例**：

```python
# 传统（3 个模型）
classifier = BERTForClassification()
translator = MarianMT()
summarizer = PEGASUS()

# T5（1 个模型）
t5 = T5Model()
t5.generate("sentiment: This is great")  # → "positive"
t5.generate("translate English to French: Hello")  # → "Bonjour"
t5.generate("summarize: Long text...")  # → "Summary"
```

---

#### Q: ViT 为什么需要大数据预训练？

**A**: **归纳偏置少，必须从数据中学习**

**CNN 的归纳偏置**（内置）：

1. **局部性**：卷积核只看局部区域
2. **平移不变性**：权重共享
3. **层次性**：浅层学边缘，深层学物体

**ViT 的自由度**：

1. **全局 Attention**：每个 patch 可以 attend 到任何 patch
2. **无权重共享**：位置编码区分不同位置
3. **需要学习**：什么是"局部性"

**实验证据**（ViT 论文）：

| 预训练数据 | ViT-Base | ResNet-50 |
|-----------|---------|-----------|
| ImageNet（1.3M） | 77.9% | **78.4%** |
| ImageNet-21K（14M） | 83.1% | 82.9% |
| JFT-300M（300M） | **87.8%** | 85.7% |

ViT 在小数据劣势，大数据优势明显

---

### 19.8 优化技术

#### Q: Flash Attention 如何做到 2-4 倍加速？

**A**: **减少 GPU 内存访问（HBM ↔ SRAM）**

**GPU 内存层次**：

| 内存 | 容量 | 带宽 | 延迟 |
|------|------|------|------|
| HBM（高带宽内存） | 40GB | 1.5 TB/s | 慢（~100ns） |
| SRAM（片上内存） | 20MB | 19 TB/s | **快**（~1ns） |

**传统 Attention 瓶颈**：

```python
S = Q @ K.T  # 写入 HBM（n^2 大小）
P = softmax(S)  # 从 HBM 读，写回（n^2）
O = P @ V  # 从 HBM 读（n^2）

# 总 HBM 访问: 4n^2
```

**Flash Attention 优化**：

**分块 + 在线 Softmax**：

```python
# 将 Q, K, V 分块（每块放入 SRAM）
for block_q in Q_blocks:
    for block_k in K_blocks:
        # 在 SRAM 内计算
        S_block = block_q @ block_k.T
        P_block = online_softmax(S_block)
        O_block += P_block @ block_v
        
# 总 HBM 访问: O(n)
```

**性能对比**（A100 GPU, seq_len=2048）：

| 实现 | HBM 访问量 | 耗时 |
|------|-----------|------|
| PyTorch 标准 | 16M | 8.2ms |
| **Flash Attention** | ~2048 | **2.1ms**（**3.9x 快**） |

---

### 19.9 难题（Hard）

#### Q: MoE 的梯度如何流向 Router？

**A**: **任务损失 + 辅助损失 双路径**

**前向**：

$$y_i = \sum_{j \in \text{TopK}} w_{ij} \cdot Expert_j(x_i)$$

其中 $w_{ij} = \frac{\exp(g_{ij})}{\sum_{j'} \exp(g_{ij'})}$，$g_{ij} = (W_g x_i)_j$

**反向**：

$$\frac{\partial L_{total}}{\partial W_g} = \frac{\partial L_{task}}{\partial W_g} + \alpha \frac{\partial L_{aux}}{\partial W_g}$$

**路径 1**（任务损失）：

$$L_{task} \to y_i \to w_{ij} \to g_{ij} \to W_g$$

通过 Softmax 梯度：$\frac{\partial w_{ij}}{\partial g_{ij}} = w_{ij}(1 - w_{ij})$

**路径 2**（辅助损失）：

$$L_{aux} \to P_j \to \frac{1}{N}\sum_i g_{ij} \to W_g$$

直接影响 Router 参数

**关键**：

- 即使某专家从未被选中（无任务梯度）
- 辅助损失仍能更新 Router，促进其被选中

---

#### Q: GPT 的 Causal Mask 如何影响梯度流？

**A**: **未来位置梯度被阻断**

**前向**（预测位置 3）：

$$Q_3 \cdot K^T = [q_3 k_0, q_3 k_1, q_3 k_2, q_3 k_3, q_3 k_4, ...]$$

**Causal Mask**：

$$\text{Scores} = [s_0, s_1, s_2, s_3, -\infty, -\infty, ...]$$

位置 4, 5 被屏蔽

**Softmax 后**：

$$\alpha_3 = [0.1, 0.3, 0.4, 0.2, 0, 0, ...]$$

未来位置权重为 0

**反向传播**：

$$\frac{\partial L}{\partial K_i} = \sum_{t} \frac{\partial L}{\partial A_t} \cdot \alpha_{ti} \cdot Q_t$$

如果 $i > t$（未来），$\alpha_{ti} = 0$ → $\frac{\partial L}{\partial K_i} = 0$

**结果**：

- 位置 3 的损失只更新位置 0~3 的参数
- 位置 4, 5 不受影响（梯度为 0）

**原因**：

训练时只能看历史 → 推理时也只能看历史（一致性）

---

#### Q: BERT 的梯度如何流向所有 token？

**A**: **通过 Attention 的全连接图**

**前向**（预测 `[MASK]` 位置 2）：

```
Token:  The  cat  [MASK]  on   the  mat
Position: 0    1     2      3    4    5
```

**Attention 连接**（位置 2 的 Query 与所有 Key）：

$$h_2^{(l+1)} = \text{Attn}(Q_2, [K_0, K_1, K_2, K_3, K_4, K_5], ...)$$

**梯度反向**：

$$\frac{\partial L}{\partial h_2^{(l)}} \text{ 反传时通过 Attention 分配到 } \frac{\partial L}{\partial h_i^{(l)}} \quad \forall i$$

**结果**：

- 即使只有位置 2 有监督信号（MLM loss）
- 梯度通过 12 层 Attention 传播到**所有位置**
- 所有 token 的表示都被优化

**数值例子**（简化）：

```python
# 损失在位置 2
dL/dh_2 = -1.5

# Attention 权重
alpha_20 = 0.1, alpha_21 = 0.3, ...

# 梯度分配
dL/dh_0 += alpha_20 * dL/dh_2 = -0.15
dL/dh_1 += alpha_21 * dL/dh_2 = -0.45
```

所有位置都收到梯度

---

### 19.10 快速对比表

#### Transformer 变体对比

| 模型 | 架构 | 训练任务 | 适用场景 | 位置编码 |
|------|------|---------|---------|---------|
| **Transformer** | Encoder-Decoder | 翻译 | 序列到序列 | Sinusoidal |
| **BERT** | Encoder only | MLM + NSP | 理解（分类、NER） | Learned |
| **GPT** | Decoder only | 自回归 LM | 生成（对话、续写） | Learned |
| **T5** | Encoder-Decoder | Span Corruption | 所有任务（统一） | Relative Bias |
| **Llama** | Decoder only | 自回归 LM | 生成（开源） | **RoPE** |
| **ViT** | Encoder only | 图像分类 | 视觉任务 | Learned 2D |

---

#### 位置编码对比

| 类型 | 方法 | 优势 | 劣势 | 使用模型 |
|------|------|------|------|----------|
| **Sinusoidal** | sin/cos 函数 | 外推性、无参数 | 绝对位置 | Transformer (2017) |
| **Learned** | 可学习 Embedding | 灵活 | 外推性差 | BERT, GPT-2 |
| **Relative Bias** | Attention 内偏置 | 相对位置、外推性 | 每层独立 | T5 |
| **RoPE** | 旋转矩阵 | 相对位置、外推性强 | 实现复杂 | **Llama, Qwen** |
| **ALiBi** | 线性偏置 | 外推性最强 | 性能略低 | BLOOM |

---

#### Attention 变体对比

| 类型 | KV 共享 | 显存占用 | 性能 | 使用模型 |
|------|---------|---------|------|----------|
| **MHA** | 每头独立 | 高（100%） | 最好 | BERT, GPT-3 |
| **MQA** | 全部共享 | 低（12.5%） | 略降 | PaLM |
| **GQA** | 分组共享 | 中（25%） | 接近 MHA | **Llama 2** |

---

### 19.11 🇨🇳 国内大厂高频加餐 (2025-2026)

#### Q1: DeepSeek MLA 与 GQA 的核心区别是什么？
**A**:
- **GQA (Llama 2/3)**: 通过**分组共享** KV 来压缩显存。是 MHA 的"物理裁剪"。
- **MLA (DeepSeek)**: 通过**低秩投影** (Low-Rank Projection) 将 KV 压缩到潜在向量 $c_{KV}$。是 MHA 的"数学压缩"。
- **优势**: MLA 的 KV Cache 比 GQA 更小，但能还原出 Full Head 的表达能力，性能更接近 MHA。

#### Q2: 为什么 RoPE 不直接用复数乘法实现？
**A**: 虽然数学上是复数旋转 $q e^{i\theta}$，但在深度学习框架中，复数运算支持不如实数完善。
我们通常用实数矩阵乘法或逐元素操作来实现：
$$\begin{pmatrix} x_1 \\ x_2 \end{pmatrix} \to \begin{pmatrix} x_1 \cos\theta - x_2 \sin\theta \\ x_1 \sin\theta + x_2 \cos\theta \end{pmatrix}$$
这可以通过 `torch.stack` 和掩码操作高效并行。

#### Q3: FlashAttention V1 vs V2 的主要改进？
**A**:
1. **减少非矩阵运算**: V2 减少了 Softmax 的 rescale 操作次数。
2. **并行策略**: V1 只在 Batch 和 Head 维度并行；V2 增加了在 **Sequence Length** 维度的并行 (通过分块)，解决了长序列下 GPU 利用率低的问题。
3. **支持**: V2 支持了 PagedAttention (vLLM) 和更广泛的硬件。

#### Q4: LoRA 的秩 r 如何选择？
**A**:
- 一般 $r=8$ 或 $16$ 足以胜任大多数 NLP 任务。
- 实验表明，对于特定任务，极小的 $r$ (如 1-2) 也能工作，证明了大模型更新量的低秩性。
- $r$ 过大不仅增加显存，还可能导致过拟合。

---

## 第 20 章 大模型训练 Infra (2026 求职必读)

> **面向岗位**：LLM Infra 工程师、AI 系统工程师
> **关键词**：3D Parallelism, ZeRO, Megatron-LM, vLLM

### 20.1 显存去哪了？(Where did the memory go?)
训练一个 175B 的模型，为什么需要几百张 A100？
显存占用主要来自：
1.  **模型参数 (Weights)**: FP16 下，175B $\approx$ 350GB。
2.  **梯度 (Gradients)**: 与参数一样大，350GB。
3.  **优化器状态 (Optimizer States)**: Adam 需要存 Momentum 和 Variance (FP32)，是参数的 **12 倍**！(175B $\approx$ 2.1TB)。
4.  **激活值 (Activations)**: 前向传播存下来用于反向传播的中间结果 (Batch Size 越大越大)。

**结论**：单卡 80GB 根本存不下。必须并行。

### 20.2 3D 并行 (3D Parallelism)
现代大模型训练通常混合使用三种并行策略：

#### 1. 数据并行 (Data Parallelism, DP)
- **原理**：复制模型到每张卡，切分数据 (Batch)。
- **瓶颈**：模型大到单卡放不下时失效。
- **进阶**：**ZeRO (Zero Redundancy Optimizer)**
    - **ZeRO-1**: 切分优化器状态 (Os)。
    - **ZeRO-2**: 切分梯度 (G)。
    - **ZeRO-3**: 切分模型参数 (P)。
    - **效果**：ZeRO-3 允许单卡训练比显存大得多的模型 (用通信换显存)。

#### 2. 流水线并行 (Pipeline Parallelism, PP)
- **原理**：将模型的 **层 (Layers)** 切分到不同卡。
    - GPU 0: Layer 1-10
    - GPU 1: Layer 11-20
- **问题**：气泡 (Bubble) —— GPU 1 等 GPU 0 算完才能动。
- **解决**：1F1B (One Forward One Backward) 调度策略，减少气泡。

#### 3. 张量并行 (Tensor Parallelism, TP)
- **原理**：将 **矩阵乘法** 切分到不同卡 (Megatron-LM 核心)。
    - $Y = XA$。将 $A$ 切成 $[A_1, A_2]$。
    - GPU 0 算 $XA_1$，GPU 1 算 $XA_2$。
- **适用**：单机多卡内部 (通信量极大，需要 NVLink)。

### 20.3 推理加速 (Inference Optimization)

#### vLLM & PagedAttention
- **核心问题**：KV Cache 显存碎片化严重。
- **解决**：借鉴操作系统的 **虚拟内存 (Virtual Memory)** 技术。
    - 将 KV Cache 切成 Block，非连续存储。
    - 逻辑上连续，物理上离散。
- **效果**：吞吐量提升 2-4 倍。

#### Speculative Decoding (投机采样)
- **原理**：
    1. 用一个小模型 (Draft Model) 快速生成几个词。
    2. 用大模型 (Target Model) 并行验证这些词。
- **收益**：利用大模型并行计算能力，突破自回归的串行瓶颈。

---

## 第 21 章 推理模型与 Agent (DeepSeek-R1 & Beyond)

### 21.1 DeepSeek-R1 与推理模型 (Reasoning Models)
2025-2026 的最大趋势：**让模型学会“慢思考” (System 2)**。

#### 核心机制：CoT + RL
- **CoT (Chain of Thought)**：不仅输出答案，还输出 `<think>...</think>` 思考过程。
- **GRPO (Group Relative Policy Optimization)**：DeepSeek 的创新 RL 算法。
    - 不再需要额外的 Value Model (Critic)，节省一半显存。
    - 通过从 Group 中采样多个输出，计算相对优势。
- **Aha Moment**：在纯 RL 训练中，模型自发学会了自我反思和纠错。

### 21.2 Agentic Patterns (智能体模式)
从 "Chatbot" 到 "Agent" 的转变。

1.  **Tool Use (Function Calling)**: 模型输出 JSON 调用外部 API (搜索、计算器)。
2.  **ReAct (Reason + Act)**:
    - Thought: 我需要查天气。
    - Action: 调用 WeatherAPI。
    - Observation: 返回 25度。
    - Thought: 天气不错。
    - Answer: 今天 25 度。
3.  **Multi-Agent Orchestration**:
    - **Manager**: 拆解任务。
    - **Worker**: 执行具体代码/写作。
    - **Reviewer**: 检查结果。

---

## 总结

本文档覆盖了 Transformer 及其变体的**完整技术栈**，从基础组件（Attention、FFN、LayerNorm）到工业技术（MQA/GQA、RoPE、MoE），再到主流模型（BERT、GPT、T5、ViT）。

**2026 AI 面试核心考点**：

1. **Attention 机制**：复杂度分析、多头原理、与 RNN/CNN 对比
2. **位置编码**：Sinusoidal、RoPE、Relative Bias 的数学原理
3. **架构设计**：Pre-Norm vs Post-Norm、FFN 4x 原因
4. **模型对比**：BERT vs GPT、Encoder vs Decoder
5. **工业技术**：MQA/GQA、RoPE 外推、MoE 负载均衡
6. **Scaling Law**：幂律关系、Chinchilla 最优配置
7. **优化技术**：Flash Attention、Sparse Attention

**学习建议**：

- **数学推导**：务必手推一遍 Attention、Softmax 梯度、RoPE 旋转矩阵
- **代码实现**：运行 `transformer_implementation.py`，理解每个组件
- **对比分析**：记住本章的对比表，面试时能快速回答
- **工业案例**：了解 Llama 2、GPT-4、Mixtral 的具体配置

**最重要的原则**：

> **符号定义 → 程序视角 → 梯度路径 → 因果解释**

每个概念都要能从这四个维度回答，才算真正理解。

---

**本文档完成！总计 8000+ 行，覆盖 Transformer 从理论到实践的所有内容。祝面试顺利！**

