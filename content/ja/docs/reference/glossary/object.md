---
title: オブジェクト
id: object
full_link: /docs/concepts/overview/working-with-objects/#kubernetes-objects
short_description: >
   クラスターの状態の一部を表すKubernetesシステムにあるエンティティ。
aka:
tags:
- architecture
- fundamental
---
Kubernetesシステムにあるエンティティ。
オブジェクトは、クラスターの状態を表すためにKubernetes APIが使用する{{< glossary_tooltip text="APIリソース" term_id="api-resource" >}}です。
<!--more-->
Kubernetesオブジェクトは典型的にあなたが一度作成したオブジェクトの「意図の記録」で、Kubernetes
{{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}はオブジェクトが表す項目が実際に存在するように継続的に動作します。
オブジェクトを作成することは、クラスターのワークロードのその部分にどうあってほしいかをKubernetesシステムに伝えることを意味します。
これがクラスターの望ましい状態(desired state)です。
