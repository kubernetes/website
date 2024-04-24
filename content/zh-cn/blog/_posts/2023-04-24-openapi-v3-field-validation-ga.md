---
layout: blog
title: "Kubernetes 1.27：服务器端字段校验和 OpenAPI V3 进阶至 GA"
date: 2023-04-24
slug: openapi-v3-field-validation-ga
---
<!--
layout: blog
title: "Kubernetes 1.27: Server Side Field Validation and OpenAPI V3 move to GA"
date: 2023-04-24
slug: openapi-v3-field-validation-ga
-->

<!--
**Author**: Jeffrey Ying (Google), Antoine Pelisse (Google)
-->
**作者**：Jeffrey Ying (Google), Antoine Pelisse (Google)

**译者**：Michael Yao (DaoCloud)

<!--
Before Kubernetes v1.8 (!), typos, mis-indentations or minor errors in
YAMLs could have catastrophic consequences (e.g. a typo like
forgetting the trailing s in `replica: 1000` could cause an outage,
because the value would be ignored and missing, forcing a reset of
replicas back to 1). This was solved back then by fetching the OpenAPI
v2 in kubectl and using it to verify that fields were correct and
present before applying. Unfortunately, at that time, Custom Resource
Definitions didn’t exist, and the code was written under that
assumption. When CRDs were later introduced, the lack of flexibility
in the validation code forced some hard decisions in the way CRDs
exposed their schema, leaving us in a cycle of bad validation causing
bad OpenAPI and vice-versa. With the new OpenAPI v3 and Server Field
Validation being GA in 1.27, we’ve now solved both of these problems.
-->
在 Kubernetes v1.8 之前，YAML 文件中的拼写错误、缩进错误或其他小错误可能会产生灾难性后果
（例如像在 `replica: 1000` 中忘记了结尾的字母 “s”，可能会导致宕机。
因为该值会被忽略并且丢失，并强制将副本重置回 1）。当时解决这个问题的办法是：
在 kubectl 中获取 OpenAPI v2 并在应用之前使用 OpenAPI v2 来校验字段是否正确且存在。
不过当时没有自定义资源定义 (CRD)，相关代码是在当时那样的假设下编写的。
之后引入了 CRD，发现校验代码缺乏灵活性，迫使 CRD 在公开其模式定义时做出了一些艰难的决策，
使得我们进入了不良校验造成不良 OpenAPI，不良 OpenAPI 无法校验的循环。
随着新的 OpenAPI v3 和服务器端字段校验在 1.27 中进阶至 GA，我们现在已经解决了这两个问题。

<!--
Server Side Field Validation offers resource validation on create,
update and patch requests to the apiserver and was added to Kubernetes
in v1.25, beta in v1.26 and is now GA in v1.27. It provides all the
functionality of kubectl validate on the server side.
-->
服务器端字段校验针对通过 create、update 和 patch 请求发送到 apiserver 上的资源进行校验，
此特性是在 Kubernetes v1.25 中添加的，在 v1.26 时进阶至 Beta，
如今在 v1.27 进阶至 GA。它在服务器端提供了 kubectl 校验的所有功能。

<!--
[OpenAPI](https://swagger.io/specification/) is a standard, language
agnostic interface for discovering the set of operations and types
that a Kubernetes cluster supports. OpenAPI V3 is the latest standard
of the OpenAPI and is an improvement upon [OpenAPI
V2](https://kubernetes.io/blog/2016/12/kubernetes-supports-openapi/)
which has been supported since Kubernetes 1.5. OpenAPI V3 support was
added in Kubernetes in v1.23, moved to beta in v1.24 and is now GA in
v1.27.
-->
[OpenAPI](https://swagger.io/specification/) 是一个标准的、与编程语言无关的接口，
用于发现 Kubernetes 集群支持的操作集和类型集。
OpenAPI v3 是 OpenAPI 的最新标准，它是自 Kubernetes 1.5 开始支持的
[OpenAPI v2](https://kubernetes.io/blog/2016/12/kubernetes-supports-openapi/)
的改进版本。对 OpenAPI v3 的支持是在 Kubernetes v1.23 中添加的，
v1.24 时进阶至 Beta，如今在 v1.27 进阶至 GA。

<!--
## OpenAPI V3

### What does OpenAPI V3 offer over V2

#### Built-in types
-->
## OpenAPI v3

### OpenAPI v3 相比 v2 提供了什么？

#### 插件类型

<!--
Kubernetes offers certain annotations on fields that are not
representable in OpenAPI V2, or sometimes not represented in the
OpenAPI v2 that Kubernetes generate. Most notably, the "default" field
is published in OpenAPI V3 while omitted in OpenAPI V2. A single type
that can represent multiple types is also expressed correctly in
OpenAPI V3 with the oneOf field. This includes proper representations
for IntOrString and Quantity.
-->
Kubernetes 对 OpenAPI v2 中不能表示或有时在 Kubernetes 生成的 OpenAPI v2
中未表示的某些字段提供了注解。最明显地，OpenAPI v3 发布了 “default” 字段，
而在 OpenAPI v2 中被省略。表示多种类型的单个类型也能在 OpenAPI v3 中使用
oneOf 字段被正确表达。这包括针对 IntOrString 和 Quantity 的合理表示。

<!--
#### Custom Resource Definitions

In Kubernetes, Custom Resource Definitions use a structural OpenAPI V3
schema that cannot be represented as OpenAPI V2 without a loss of
certain fields. Some of these include nullable, default, anyOf, oneOf,
not, etc. OpenAPI V3 is a completely lossless representation of the
CustomResourceDefinition structural schema.
-->
#### CRD

在 Kubernetes 中，自定义资源定义 (CRD) 使用结构化的 OpenAPI v3 模式定义，
无法在不损失某些字段的情况下将其表示为 OpenAPI v2。这些包括
nullable、default、anyOf、oneOf、not 等等。OpenAPI v3 是
CustomResourceDefinition 结构化模式定义的完全无损表示。

<!--
### How do I use it?

The OpenAPI V3 root discovery can be found at the `/openapi/v3`
endpoint of a Kubernetes API server. OpenAPI V3 documents are grouped
by group-version to reduce the size of the data transported, the
separate documents can be accessed at
`/openapi/v3/apis/<group>/<version>` and `/openapi/v3/api/v1`
representing the legacy group version. Please refer to the [Kubernetes
API Documentation](/docs/concepts/overview/kubernetes-api/) for more
information around this endpoint.
-->
### 如何使用？

Kubernetes API 服务器的 `/openapi/v3` 端点包含了 OpenAPI v3 的根发现文档。
为了减少传输的数据量，OpenAPI v3 文档以 group-version 的方式进行分组，
不同的文档可以通过 `/openapi/v3/apis/<group>/<version>` 和 `/openapi/v3/api/v1`
（表示旧版 group）进行访问。有关此端点的更多信息请参阅
[Kubernetes API 文档](/zh-cn/docs/concepts/overview/kubernetes-api/)。

<!--
Various consumers of the OpenAPI have already been updated to consume
v3, including the entirety of kubectl, and server side apply. An
OpenAPI V3 Golang client is available in
[client-go](https://github.com/kubernetes/client-go/blob/release-1.27/openapi3/root.go).
-->
众多使用 OpenAPI 的客户侧组件已更新到了 v3，包括整个 kubectl 和服务器端应用。
在 [client-go](https://github.com/kubernetes/client-go/blob/release-1.27/openapi3/root.go)
中也提供了 OpenAPI V3 Golang 客户端。

<!--
## Server Side Field Validation

The query parameter `fieldValidation` may be used to indicate the
level of field validation the server should perform. If the parameter
is not passed, server side field validation is in `Warn` mode by
default.
-->
## 服务器端字段校验

查询参数 `fieldValidation` 可用于指示服务器应执行的字段校验级别。
如果此参数未被传递，服务器端字段校验默认采用 `Warn` 模式。

<!--
- Strict: Strict field validation, errors on validation failure
- Warn: Field validation is performed, but errors are exposed as
  warnings rather than failing the request
- Ignore: No server side field validation is performed
-->
- Strict：严格的字段校验，在验证失败时报错
- Warn：执行字段校验，但错误会以警告的形式给出，而不是使请求失败
- Ignore：不执行服务器端的字段校验

<!--
kubectl will skip client side validation and will automatically use
server side field validation in `Strict` mode. Controllers by default
use server side field validation in `Warn` mode.

With client side validation, we had to be extra lenient because some
fields were missing from OpenAPI V2 and we didn’t want to reject
possibly valid objects. This is all fixed in server side validation.
Additional documentation may be found
[here](/docs/reference/using-api/api-concepts/#field-validation)
-->
kubectl 将跳过客户端校验，并将自动使用 `Strict` 模式下的服务器端字段校验。
控制器默认使用 `Warn` 模式进行服务器端字段校验。

使用客户端校验时，由于 OpenAPI v2 中缺少某些字段，所以我们必须更加宽容，
以免拒绝可能有效的对象。而在服务器端校验中，所有这些问题都被修复了。
可以在[此处](/zh-cn/docs/reference/using-api/api-concepts/#field-validation)找到更多文档。

<!--
## What's next?

With Server Side Field Validation and OpenAPI V3 released as GA, we
introduce more accurate representations of Kubernetes resources. It is
recommended to use server side field validation over client side, but
with OpenAPI V3, clients are free to implement their own validation if
necessary (to “shift things left”) and we guarantee a full lossless
schema published by OpenAPI.
-->
## 未来展望

随着服务器端字段校验和 OpenAPI v3 以 GA 发布，我们引入了更准确的 Kubernetes 资源表示。
建议使用服务器端字段校验而非客户端校验，但是通过 OpenAPI v3，
客户端可以在必要时自行实现其自身的校验（“左移”），我们保证 OpenAPI 发布的是完全无损的模式定义。

<!--
Some existing efforts will further improve the information available
through OpenAPI including [CEL validation and
admission](/docs/reference/using-api/cel/), along with OpenAPI
annotations on built-in types.

Many other tools can be built for authoring and transforming resources
using the type information found in the OpenAPI v3.
-->
现在的一些工作将进一步改善通过 OpenAPI 提供的信息，例如
[CEL 校验和准入](/zh-cn/docs/reference/using-api/cel/)以及对内置类型的 OpenAPI 注解。

使用在 OpenAPI v3 中的类型信息还可以构建许多其他工具来编写和转换资源。

<!--
## How to get involved?

These two features are driven by the SIG API Machinery community,
available on the slack channel \#sig-api-machinery, through the
[mailing
list](https://groups.google.com/g/kubernetes-sig-api-machinery) and we
meet every other Wednesday at 11:00 AM PT on Zoom.
-->
## 如何参与？

这两个特性由 SIG API Machinery 社区驱动，欢迎加入 Slack 频道 \#sig-api-machinery，
请查阅[邮件列表](https://groups.google.com/g/kubernetes-sig-api-machinery)，
我们每周三 11:00 AM PT 在 Zoom 上召开例会。

<!--
We offer a huge thanks to all the contributors who helped design,
implement, and review these two features.
-->
我们对所有曾帮助设计、实现和审查这两个特性的贡献者们表示衷心的感谢。

- Alexander Zielenski
- Antoine Pelisse
- Daniel Smith
- David Eads
- Jeffrey Ying
- Jordan Liggitt
- Kevin Delgado
- Sean Sullivan
