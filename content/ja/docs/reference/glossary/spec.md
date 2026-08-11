---
title: Spec
id: spec
full_link: /docs/concepts/overview/working-with-objects/#object-spec-and-status
short_description: >
  望ましい状態や設定を定義するKubernetesのマニフェストのフィールド。

aka:
tags:
- fundamental
- architecture
---
  PodやServiceなどの各オブジェクトの設定とその望ましい状態を定義します。

<!--more-->
ほとんどのKubernetesオブジェクトは、オブジェクトの設定を管理する2つの入れ子になったオブジェクトのフィールドを持っています。それはオブジェクトspecとオブジェクトstatusです。specを持っているオブジェクトに関しては、オブジェクト作成時にspecを設定する必要があり、望ましい状態として{{< glossary_tooltip text="リソース" term_id="api-resource" >}}に持たせたい特徴を記述する必要があります。

specはPod、StatefulSet、Serviceなどのオブジェクトによって異なり、コンテナ、ボリューム、レプリカ、ポートなどの各オブジェクトに固有の設定を詳細に記述します。このフィールドは、定義されたオブジェクトに対してKubernetesが維持すべき状態をカプセル化します。
