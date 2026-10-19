---
title: プリエンプション
id: preemption
full_link: /docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption
short_description: >
  Kubernetesのプリエンプションロジックは、ノード上に存在する優先度の低いPodを追い出すことで、保留中のPodが適切なノードを見つけられるようにします。

aka:
tags:
- operation
---
Kubernetesのプリエンプションロジックは、ノード上に存在する優先度の低いPodを追い出すことで、保留中の{{< glossary_tooltip term_id="pod" >}}が適切な{{< glossary_tooltip term_id="node" >}}を見つけられるようにします。

<!--more-->

Podをスケジューリングできない場合、スケジューラーはそのPodをスケジューリングできるようにするため、優先度の低いPodを[プリエンプトする](/docs/concepts/scheduling-eviction/pod-priority-preemption/#preemption)(追い出す)ことを試みます。
