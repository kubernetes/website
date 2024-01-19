---
title: アフィニティ
id: affinity
date: 2019-01-11
full_link: /ja/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity
short_description: >
     Podを配置する場所を決定するためにスケジューラーによって使用されるルール
aka:
tags:
- fundamental
---

Kubernetesでは、_アフィニティ(affinity)_ はPodを配置する場所に関するヒントをスケジューラーに与える一連のルールです。
<!--more-->
アフィニティには次の2種類があります:
* [Nodeアフィニティ](/ja/docs/concepts/scheduling-eviction/assign-pod-node/#node-affinity)
* [Pod間のアフィニティとアンチアフィニティ](/ja/docs/concepts/scheduling-eviction/assign-pod-node/#inter-pod-affinity-and-anti-affinity)

ルールは、Kubernetes{{< glossary_tooltip term_id="label" text="ラベル">}}と{{< glossary_tooltip term_id="pod" text="Pod" >}}で指定された{{< glossary_tooltip term_id="selector" text="セレクター">}}を使用して定義され、スケジューラーにどれだけ厳密にルールを適用するかに応じて、必須または優先のいずれかにすることができます。
