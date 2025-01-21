---
title: PriorityClass
id: priority-class
date: 2024-03-19
full_link: /ja/docs/concepts/scheduling-eviction/pod-priority-preemption/#priorityclass
short_description: >
  クラスの名称からPodが持つべきスケジューリングの優先度への対応付け。
aka:
tags:
- core-object
---
PriorityClassは、そのクラスに属するPodに割り当てるべきスケジューリングの優先度のための名称付きクラスです。

<!--more-->

[PriorityClass](/ja/docs/concepts/scheduling-eviction/pod-priority-preemption/#how-to-use-priority-and-preemption)は、名称を整数の優先度に対応付けするnamespaceによらないオブジェクトであり、Podのために用いられます。
名称は`metadata.name`フィールド、優先度の値は`value`フィールドで指定されます。
優先度の値の範囲は、-2147483648から1000000000までです。
値が大きいほど優先度が高いことを示します。
