---
title: 名称
content_template: templates/concept
weight: 20
---

<!--
---
reviewers:
- mikedanese
- thockin
title: Names
content_template: templates/concept
weight: 20
---
-->

{{% capture overview %}}

Kubernetes REST API 中的所有对象都通过名称和 UID 明确标识。

<!--
All objects in the Kubernetes REST API are unambiguously identified by a Name and a UID.
-->

对于用户提供的非惟一属性，Kubernetes 提供 [标签](/docs/user-guide/labels) 和
[注解](/docs/concepts/overview/working-with-objects/annotations/)。

<!--
For non-unique user-provided attributes, Kubernetes provides [labels](/docs/user-guide/labels) and [annotations](/docs/concepts/overview/working-with-objects/annotations/).
-->

查看 [标识设计文档](https://git.k8s.io/community/contributors/design-proposals/architecture/identifiers.md) 获取名称和 UID 的精确语法规则。

<!--
See the [identifiers design doc](https://git.k8s.io/community/contributors/design-proposals/architecture/identifiers.md) for the precise syntax rules for Names and UIDs.
-->

{{% /capture %}}


{{% capture body %}}

## 名称

<!--
## Names
-->

{{< glossary_definition term_id="name" length="all" >}}

按照惯例，Kubernetes 资源的名称最长可达 253 个字符，并由小写字母、数字、 “-” 和 “.” 组成，但某些资源可能有更具体的限制。

<!--
By convention, the names of Kubernetes resources should be up to maximum length of 253 characters and consist of lower case alphanumeric characters, `-`, and `.`, but certain resources have more specific restrictions.
-->

## UID

<!--
## UIDs
-->

{{< glossary_definition term_id="uid" length="all" >}}

{{% /capture %}}
