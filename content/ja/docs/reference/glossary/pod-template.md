---
title: PodTemplate
id: pod-template
short_description: >
  Podを作成するためのテンプレート。

aka: 
  - pod template
tags:
- core-object

---
{{< glossary_tooltip text="Pod" term_id="pod" >}}を作成するためのテンプレートを定義するAPIオブジェクト。
PodTemplate APIは、{{< glossary_tooltip text="Deployment" term_id="deployment" >}}や{{< glossary_tooltip text="StatefulSet" term_id="StatefulSet" >}}のようなワークロード管理のためのAPI定義にも埋め込まれます。

<!--more--> 

Podテンプレートは、Podの望ましい状態(desired state)を指定するだけでなく、ラベルや、新しいPodの名前のためのテンプレートなど共通のメタデータを定義することもできます。
[ワークロード管理](/docs/concepts/workloads/controllers/)コントローラーは、1つ以上の{{< glossary_tooltip text="Pod" term_id="pod" >}}を定義・管理するために、(DeploymentやStatefulSetのような別のオブジェクトの中に埋め込まれた)Podテンプレートを使用します。
同じテンプレートに基づいた複数のPodが存在する場合、これらを{{< glossary_tooltip term_id="replica" text="レプリカ" >}}と呼びます。
PodTemplateオブジェクトを直接作成することは可能ですが、そのようにする必要はほとんどありません。
