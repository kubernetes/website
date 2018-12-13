---
title: 注解
content_template: templates/concept
weight: 50
---

<!--
---
title: Annotations
content_template: templates/concept
weight: 50
---
-->

{{% capture overview %}}

你可以使用 Kubernetes 注解为对象附加任意的非标识的元数据。客户端程序（例如工具和库）能够获取这些元数据信息。
<!--
You can use Kubernetes annotations to attach arbitrary non-identifying metadata
to objects. Clients such as tools and libraries can retrieve this metadata.
-->
{{% /capture %}}

{{% capture body %}}
## 为对象附加元数据
<!--
## Attaching metadata to objects
-->

您可以使用标签或注解将元数据附加到 Kubernetes 对象。标签可以用来选择对象和查找满足某些条件的对象集合。
<!--
You can use either labels or annotations to attach metadata to Kubernetes
objects. Labels can be used to select objects and to find
collections of objects that satisfy certain conditions.
-->

相反，注解不用于标识和选择对象。
注解中的元数据，可以很小，也可以很大，可以是结构化的，也可以是非结构化的，能够包含标签不允许的字符。
<!--
In contrast, annotations are not used to identify and select objects. 
The metadata in an annotation can be small or large, structured or unstructured, 
and can include characters not permitted by labels.
-->

注解和标签一样，是键/值对:
<!--
Annotations, like labels, are key/value maps:
-->

```json
"metadata": {
  "annotations": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```

以下是一些例子，用来说明哪些信息可以使用注解来记录:
<!--
Here are some examples of information that could be recorded in annotations:
-->

* 由声明性配置所管理的字段。
  将这些字段附加为注解，能够将它们与客户端或服务端设置的默认值、自动生成的字段以及通过自动调整大小或自动伸缩系统设置的字段区分开来。

<!--
* Fields managed by a declarative configuration layer. Attaching these fields
  as annotations distinguishes them from default values set by clients or
  servers, and from auto-generated fields and fields set by
  auto-sizing or auto-scaling systems.
-->

* 构建、发布或镜像信息（如时间戳、发布 ID、Git 分支、PR 数量、镜像哈希、仓库地址）。

<!--
* Build, release, or image information like timestamps, release IDs, git branch,
  PR numbers, image hashes, and registry address.
-->

* 指向日志记录、监控、分析或审计仓库的指针。

<!--
* Pointers to logging, monitoring, analytics, or audit repositories.
-->

* 可用于调试目的的客户端库或工具信息：例如，名称、版本和构建信息。

<!--
* Client library or tool information that can be used for debugging purposes:
  for example, name, version, and build information.
-->

* 用户或者工具/系统的来源信息，例如来自其他生态系统组件的相关对象的 URL。

<!--
* User or tool/system provenance information, such as URLs of related objects
  from other ecosystem components.
-->

* 推出的轻量级工具的元数据信息：例如，配置或检查点。

<!--
* Lightweight rollout tool metadata: for example, config or checkpoints.
-->

* 负责人员的电话或呼机号码，或指定在何处可以找到该信息的目录条目，如团队网站。

<!--
* Phone or pager numbers of persons responsible, or directory entries that
  specify where that information can be found, such as a team web site.
-->

您可以将这类信息存储在外部数据库或目录中而不使用注解，但这样做就使得开发人员很难生成用于部署、管理、自检的客户端共享库和工具。
<!--
Instead of using annotations, you could store this type of information in an
external database or directory, but that would make it much harder to produce
shared client libraries and tools for deployment, management, introspection,
and the like.
-->

{{% /capture %}}

{{% capture whatsnext %}}
进一步了解[标签和选择器](/docs/concepts/overview/working-with-objects/labels/)。
<!--
Learn more about [Labels and Selectors](/docs/concepts/overview/working-with-objects/labels/).
-->
{{% /capture %}}
