---
title: Podの優先度
id: pod-priority
date: 2019-01-31
full_link: /docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority
short_description: >
  Podの優先度は、他のPodと比較したPodの重要度を示します。

aka:
tags:
- operation
---
Podの優先度は、他のPodと比較した{{< glossary_tooltip term_id="pod" >}}の重要度を示します。

<!--more-->

[Podの優先度](/docs/concepts/scheduling-eviction/pod-priority-preemption/#pod-priority)により、Podのスケジューリング優先度を他のPodよりも高くまたは低く設定できます。
これは本番環境のクラスターワークロードにとって重要な機能です。