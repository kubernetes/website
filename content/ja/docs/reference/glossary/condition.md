---
title: Condition
id: condition
full_link: /docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions
short_description: >
  Kubernetesリソースの現在の状態を表し、リソースの特定の観点が真であるかどうかを示す情報を提供します。

aka:
tags:
- fundamental
---
Kubernetesリソースのstatusに含まれるフィールドで、リソースの現在の状態を表現します。

<!--more-->

ConditionはKubernetesコンポーネントがリソースの状態を伝達するための標準的な方法を提供します。
Conditionには`type`、`status`(True、False、またはUnknown)および追加の詳細情報を提供する`reason`、`message`などの任意指定のフィールドがあります。
例えば、Podは`type`が`Ready`、`ContainersReady`や`PodScheduled`であるConditionを持つ可能性があります。
