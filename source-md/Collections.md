---
date: 2025-11-23
---
在 Milvus 上，您可以创建多个 Collections 来管理数据，并将数据作为实体插入到 Collections 中。Collections 和实体类似于关系数据库中的表和记录。本页将帮助你了解 Collection 及其相关概念。
Collection 是一个二维表，具有固定的列和变化的行。每列代表一个字段，每行代表一个实体。
下图显示了一个有 8 列和 6 个实体的 Collection。

![[附件/Pasted image 20251123163926.png]]

## 主键和 AutoId

与关系数据库中的主字段类似，Collection 也有一个主字段，用于将实体与其他实体区分开来。主字段中的每个值都是全局唯一的，并与一个特定的实体相对应。