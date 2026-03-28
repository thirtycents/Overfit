---
date: 2025-11-23
---
Collection 是一个二维表，具有固定的列和变化的行。每列代表一个字段，每行代表一个实体。要实现这样的结构化数据管理，需要一个 **Schema**。要插入的每个实体都必须符合 Schema 中定义的约束条件。

### 创建Schema

以下代码片段创建了一个模式，其中包含启用的 Dynamic Field 和三个必填字段，分别命名为`my_id` 、`my_vector` 和`my_varchar`

```python
from pymilvus import MilvusClient, DataType

client = MilvusClient(
    uri="http://localhost:19530",
    token="root:Milvus"
)

# create schema
schema = MilvusClient.create_schema(
    auto_id=False,
    enable_dynamic_field=True,
)

#Add fields to schema
schema.add_field(field_name="my_id", datatype=DataType.INT64, is_primary=True)
schema.add_field(field_name="my_vector", datatype=DataType.FLOAT_VECTOR, dim=5)
schema.add_field(field_name="my_varchar", datatype=DataType.VARCHAR, max_length=512)

```

## 设置索引参数
索引记录了 [[Collections]] 中实体的顺序。如以下代码片段所示，您可以使用`Metric_type` （[[../基础概念/Metric|Metric]]）和`index_type` 为 Milvus 选择适当的方式为字段建立索引，并测量向量嵌入之间的相似性。

在 Milvus 上，您可以使用`AUTOINDEX` 作为所有向量场的索引类型，并根据需要使用`COSINE` 、`L2` 和`IP` 中的一种作为度量类型。

如上述代码片段所示，您需要为向量场同时设置索引类型和度量类型，而只需为标量场设置索引类型。索引对于向量字段是强制性的，建议您在筛选条件中经常使用的标量字段上创建索引。

```python
index_params = client.prepare_index_params()

index_params.add_index(
    field_name="my_id",
    index_type="AUTOINDEX"
)

index_params.add_index(
    field_name="my_vector", 
    index_type="AUTOINDEX",
    metric_type="COSINE"
)

```

## 创建 Collections

如果创建了带有索引参数的 Collection，Milvus 会在创建时自动加载该 Collection。在这种情况下，索引参数中提到的所有字段都会被索引。

以下代码片段演示了如何创建带索引参数的 Collections 并检查其加载状态。

```python
client.create_collection(
    collection_name="customized_setup_1",
    schema=schema,
    index_params=index_params
)

res = client.get_load_state(
    collection_name="customized_setup_1"
)

print(res)


```
