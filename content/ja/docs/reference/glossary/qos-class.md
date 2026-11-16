---
title: QoSクラス
id: qos-class
full_link: /docs/concepts/workloads/pods/pod-qos/
short_description: >
  QoSクラス(Quality of Serviceクラス)は、Kubernetesがクラスター内のPodをいくつかのクラスに分類し、スケジューリングと退避に関する決定を行う方法を提供します。

aka:
tags:
- fundamental
- architecture
related:
 - pod

---

QoSクラス(Quality of Serviceクラス)は、Kubernetesがクラスター内のPodをいくつかのクラスに分類し、スケジューリングと退避に関する決定を行う方法を提供します。

<!--more-->
PodのQoSクラスは、その{{< glossary_tooltip text="インフラストラクチャリソース" term_id="infrastructure-resource" >}}の要求と制限の設定に基づいて、作成時に設定されます。
QoSクラスは、Podのスケジューリングと退避に関する決定を行うために使用されます。
Kubernetesは、Podに`Guaranteed`、`Burstable`、`BestEffort`のいずれかのQoSクラスを割り当てます。
