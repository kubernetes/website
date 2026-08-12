---
title: Disruption
id: disruption
full_link: /docs/concepts/workloads/pods/disruptions/
short_description: >
  Podが利用不可に陥る原因となる事象。
aka:
tags:
- fundamental
---
 Disruptionとは、1つ以上の{{< glossary_tooltip term_id="pod" text="Pod" >}}が利用不可に陥る原因となる事象のことです。
Disruptionが発生すると影響を受けたPodに依存している{{< glossary_tooltip term_id="deployment" >}}などのワークロード管理{{< glossary_tooltip text="リソース" term_id="api-resource" >}}に影響が及びます。

<!--more-->

クラスター管理者としてアプリケーションに属するPodを削除した場合、Kubernetesではこれを _自発的なDisruption_ と呼びます。
一方、ノードの障害や、より広範囲の障害ゾーンに影響を及ぼすサービス停止によってPodがオフラインになった場合、Kubernetesではこれを _非自発的なDisruption_ と呼びます。

詳細については、[Disruptions](/docs/concepts/workloads/pods/disruptions/)をご覧ください。
