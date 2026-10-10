---
title: EndpointSlice
id: endpoint-slice
full_link: /docs/concepts/services-networking/endpoint-slices/
short_description: >
  EndpointSliceはServiceに対応するPodのIPアドレスを追跡します。

aka:
tags:
- networking
---
EndpointSlicesはバックエンドのエンドポイントのIPアドレスを追跡します。
EndpointSlicesは通常{{< glossary_tooltip text="Service" term_id="service" >}}に関連付けられており、バックエンドのエンドポイントは一般的には{{< glossary_tooltip text="Pod" term_id="pod" >}}を表します。

<!--more-->
一つのServiceは複数のPodをバックに持ちます。
Kubernetesは、Serviceのバックエンドとなるエンドポイントを、そのServiceに関連づけられたEndpointSliceの集合によって表現します。
これらのバックエンドのエンドポイントは通常はクラスター内で動作するPodですが、必ずしもそうであるとは限りません。

コントロールプレーンは通常、EndpointSliceを自動的に管理します。
しかし、{{< glossary_tooltip text="セレクター" term_id="selector" >}}が指定されていない{{< glossary_tooltip text="Service" term_id="service" >}}に対しては、EndpointSliceを手動で定義することもできます。
