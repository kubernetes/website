---
reviewers:
title: 名前
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

KubernetesのREST API内の全てのオブジェクトは、名前とUIDで明確に識別されます。

ユーザーが付与する一意ではない属性については、Kubernetesが[ラベル](/docs/user-guide/labels)と[アノテーション](/docs/concepts/overview/working-with-objects/annotations/)を付与します。

名前とUIDに関する正確な構文については、[識別子デザインドキュメント](https://git.k8s.io/community/contributors/design-proposals/architecture/identifiers.md)を参照してください。

{{% /capture %}}

{{% capture body %}}

## 名前

{{< glossary_definition term_id="name" length="all" >}}

慣例的に、Kubernetesリソースの名前は最長253文字で、かつ英小文字、数字、また`-`、`.`から構成します。しかし、特定のリソースはより具体的な制限があります。

## UID

{{< glossary_definition term_id="uid" length="all" >}}

{{% /capture %}}
