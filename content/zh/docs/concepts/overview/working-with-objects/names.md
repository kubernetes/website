---
reviewers:
- mikedanese
- thockin
title: 名称(Names)
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

Kubernetes REST API中的所有对象都由名称和UID明确标识。

对于非惟一的用户提供的属性，Kubernetes提供[标签](/docs/user-guide/labels) 和[注释](/docs/concepts/overview/working-with-objects/annotations/)。 

有关名称和uid的精确语法规则，请参阅[标识符设计文档](https://git.k8s.io/community/contributors/design-proposals/architecture/identifiers.md)。 

{{% /capture %}}


{{% capture body %}}

## 名称

{{< glossary_definition term_id="name" length="all" >}}

按照惯例，Kubernetes资源的名称最大长度应为253个字符，由小写字母数字字符“-”和“.”组成，但某些资源有更具体的限制。

## UIDs

{{< glossary_definition term_id="uid" length="all" >}}

{{% /capture %}}
