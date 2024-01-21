---
title: 注解
content_type: concept
weight: 60
---

<!--
title: Annotations
content_type: concept
weight: 60
-->

<!-- overview -->

<!--
You can use Kubernetes annotations to attach arbitrary non-identifying metadata
to {{< glossary_tooltip text="objects" term_id="object" >}}.
Clients such as tools and libraries can retrieve this metadata.
-->
你可以使用 Kubernetes 注解为{{< glossary_tooltip text="对象" term_id="object" >}}附加任意的非标识的元数据。
客户端程序（例如工具和库）能够获取这些元数据信息。

<!-- body -->
<!--
## Attaching metadata to objects

You can use either labels or annotations to attach metadata to Kubernetes
objects. Labels can be used to select objects and to find
collections of objects that satisfy certain conditions. In contrast, annotations
are not used to identify and select objects. The metadata
in an annotation can be small or large, structured or unstructured, and can
include characters not permitted by labels. It is possible to use labels as 
well as annotations in the metadata of the same object.

Annotations, like labels, are key/value maps:
-->
## 为对象附加元数据

你可以使用标签或注解将元数据附加到 Kubernetes 对象。
标签可以用来选择对象和查找满足某些条件的对象集合。 相反，注解不用于标识和选择对象。
注解中的元数据，可以很小，也可以很大，可以是结构化的，也可以是非结构化的，能够包含标签不允许的字符。
可以在同一对象的元数据中同时使用标签和注解。

注解和标签一样，是键/值对：

```json
"metadata": {
  "annotations": {
    "key1" : "value1",
    "key2" : "value2"
  }
}
```

{{<note>}}
<!--
The keys and the values in the map must be strings. In other words, you cannot use
numeric, boolean, list or other types for either the keys or the values.
-->
Map 中的键和值必须是字符串。
换句话说，你不能使用数字、布尔值、列表或其他类型的键或值。
{{</note>}}

<!--
Here are some examples of information that could be recorded in annotations:
-->
以下是一些例子，用来说明哪些信息可以使用注解来记录：

<!--
* Fields managed by a declarative configuration layer. Attaching these fields
  as annotations distinguishes them from default values set by clients or
  servers, and from auto-generated fields and fields set by
  auto-sizing or auto-scaling systems.

* Build, release, or image information like timestamps, release IDs, git branch,
  PR numbers, image hashes, and registry address.

* Pointers to logging, monitoring, analytics, or audit repositories.
-->

* 由声明性配置所管理的字段。
  将这些字段附加为注解，能够将它们与客户端或服务端设置的默认值、
  自动生成的字段以及通过自动调整大小或自动伸缩系统设置的字段区分开来。
* 构建、发布或镜像信息（如时间戳、发布 ID、Git 分支、PR 数量、镜像哈希、仓库地址）。
* 指向日志记录、监控、分析或审计仓库的指针。


<!--
* Client library or tool information that can be used for debugging purposes:
  for example, name, version, and build information.

* User or tool/system provenance information, such as URLs of related objects
  from other ecosystem components.

* Lightweight rollout tool metadata: for example, config or checkpoints.

* Phone or pager numbers of persons responsible, or directory entries that
  specify where that information can be found, such as a team web site.

* Directives from the end-user to the implementations to modify behavior or
  engage non-standard features.
-->
* 可用于调试目的的客户端库或工具信息：例如，名称、版本和构建信息。

* 用户或者工具/系统的来源信息，例如来自其他生态系统组件的相关对象的 URL。

* 轻量级上线工具的元数据信息：例如，配置或检查点。

* 负责人员的电话或呼机号码，或指定在何处可以找到该信息的目录条目，如团队网站。

* 从用户到最终运行的指令，以修改行为或使用非标准功能。

<!--
Instead of using annotations, you could store this type of information in an
external database or directory, but that would make it much harder to produce
shared client libraries and tools for deployment, management, introspection,
and the like.
-->
你可以将这类信息存储在外部数据库或目录中而不使用注解，
但这样做就使得开发人员很难生成用于部署、管理、自检的客户端共享库和工具。

<!--
## Syntax and character set

_Annotations_ are key/value pairs. Valid annotation keys have two segments: an optional prefix and name, separated by a slash (`/`). The name segment is required and must be 63 characters or less, beginning and ending with an alphanumeric character (`[a-z0-9A-Z]`) with dashes (`-`), underscores (`_`), dots (`.`), and alphanumerics between. The prefix is optional. If specified, the prefix must be a DNS subdomain: a series of DNS labels separated by dots (`.`), not longer than 253 characters in total, followed by a slash (`/`).

If the prefix is omitted, the annotation Key is presumed to be private to the user. Automated system components (e.g. `kube-scheduler`, `kube-controller-manager`, `kube-apiserver`, `kubectl`, or other third-party automation) which add annotations to end-user objects must specify a prefix.
-->
## 语法和字符集

**注解（Annotations）** 存储的形式是键/值对。有效的注解键分为两部分：
可选的前缀和名称，以斜杠（`/`）分隔。 
名称段是必需项，并且必须在 63 个字符以内，以字母数字字符（`[a-z0-9A-Z]`）开头和结尾，
并允许使用破折号（`-`），下划线（`_`），点（`.`）和字母数字。 
前缀是可选的。如果指定，则前缀必须是 DNS 子域：一系列由点（`.`）分隔的 DNS 标签，
总计不超过 253 个字符，后跟斜杠（`/`）。
如果省略前缀，则假定注解键对用户是私有的。 由系统组件添加的注解
（例如，`kube-scheduler`，`kube-controller-manager`，`kube-apiserver`，`kubectl`
或其他第三方组件），必须为终端用户添加注解前缀。

<!--
The `kubernetes.io/` and `k8s.io/` prefixes are reserved for Kubernetes core components.

For example, here's a manifest for a Pod that has the annotation `imageregistry: https://hub.docker.com/` :
-->
`kubernetes.io/` 和 `k8s.io/` 前缀是为 Kubernetes 核心组件保留的。

例如，下面是一个 Pod 的清单，其注解中包含 `imageregistry: https://hub.docker.com/`：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: annotations-demo
  annotations:
    imageregistry: "https://hub.docker.com/"
spec:
  containers:
  - name: nginx
    image: nginx:1.14.2
    ports:
    - containerPort: 80
```

## {{% heading "whatsnext" %}}

<!--
- Learn more about [Labels and Selectors](/docs/concepts/overview/working-with-objects/labels/).
- Find [Well-known labels, Annotations and Taints](/docs/reference/labels-annotations-taints/)
-->
- 进一步了解[标签和选择算符](/zh-cn/docs/concepts/overview/working-with-objects/labels/)。
- 查找[众所周知的标签、注解和污点](/zh-cn/docs/reference/labels-annotations-taints/)。