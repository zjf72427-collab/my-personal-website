# 计算机视觉论文摘要

> Transformer · 分割 · 多模态 · 生成模型

---

## ViT: An Image is Worth 16x16 Words

**会议**：ICLR 2021 · **作者**：Dosovitskiy et al. — Google Brain

### 核心思想

将图像切分为固定大小的 patch（16x16 像素），展平后线性投影为 token embedding，直接送入标准 Transformer 编码器。在超大规模数据集（JFT-300M）预训练后，ViT 在 ImageNet 分类上超越同等规模 CNN，证明纯注意力机制在视觉任务中的可行性。

### 架构要点

```
输入图像 (H x W x C)
    切分为 N 个 patch，N = HW/P^2
    Linear Projection -> patch embedding
    + [CLS] token + Position Embedding
    Transformer Encoder x L 层
    取 [CLS] token -> MLP Head -> 分类
```

### 关键结论

- 数据量小时 ViT 不如 CNN（缺少归纳偏置：平移不变性、局部性）
- 数据量大（>14M 张图）时 ViT 优势显现
- Patch size 越小，序列越长，计算量越大（O(N^2) attention）

### 影响与后续

ViT 催生了大量变体：DeiT（数据高效）、Swin Transformer（层级特征）、MAE（掩码自编码预训练）等，成为现代视觉骨干网络的主流范式。

---

## CLIP: Learning Transferable Visual Models from Natural Language

**会议**：ICML 2021 · **作者**：Radford et al. — OpenAI

### 核心思想

对比学习框架。同时训练图像编码器和文本编码器，最大化匹配图文对的 cosine 相似度，最小化不匹配对的相似度。4 亿图文对预训练，零样本（zero-shot）迁移能力极强。

### 训练目标

```python
# 伪代码：InfoNCE 对比损失
logits = image_features @ text_features.T  # (N, N) 相似度矩阵
labels = torch.arange(N)  # 对角线为正样本
loss = (cross_entropy(logits, labels) +
        cross_entropy(logits.T, labels)) / 2
```

### 零样本分类

```python
# 构造文本 prompt："a photo of a {class_name}"
text_prompts = [f"a photo of a {c}" for c in classes]
text_features = clip.encode_text(text_prompts)
image_feature = clip.encode_image(image)
probs = softmax(image_feature @ text_features.T)
```

### 影响

CLIP 成为多模态视觉-语言模型的基础范式，后续 DALL-E 2、Stable Diffusion、LLaVA 等模型均基于 CLIP 的视觉编码器或对比学习思想。

---

## SAM: Segment Anything Model

**会议**：CVPR 2023 · **作者**：Kirillov et al. — Meta AI

### 核心思想

通用交互式分割基础模型。支持点、框、文本等多种 prompt 形式，输出高质量分割掩码。在 SA-1B 数据集（1100 万图 / 11 亿掩码）上训练，具备强零样本泛化能力。

### 架构

```
Image Encoder: MAE 预训练 ViT-H (重型，只跑一次)
    ↓ image embedding
Prompt Encoder: 点/框/文本 -> sparse/dense embedding
    ↓ prompt embedding
Mask Decoder: 两层 Transformer，输出 3 个候选掩码 + IoU 分数
```

### 三种提示模式

| 提示类型 | 输入 | 适用场景 |
|---------|------|--------|
| 点提示 | 前景点/背景点坐标 | 交互式标注 |
| 框提示 | Bounding Box 坐标 | 目标检测后处理 |
| 自动模式 | 无（网格采样点） | 全图分割 |

### 局限性

- 不输出语义标签（只分割，不识别类别）
- 对精细边缘（毛发、透明物体）仍有挑战
- Image Encoder 计算量大，实时应用需 SAM 2 或 MobileSAM
