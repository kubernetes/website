---
title: ReplicaSet
id: replica-set
date: 2018-04-12
full_link: /ja/docs/concepts/workloads/controllers/replicaset/
short_description: >
  ReplicaSetは、指定された数のPodレプリカが一度に動作するように保証します。

aka:
tags:
- fundamental
- core-object
- workload
---
 ReplicaSetは、任意の時点で動作しているレプリカPodの集合を保持します。(保持することを目指します。)

<!--more-->
{{< glossary_tooltip term_id="deployment" >}}などのワークロードオブジェクトは、ReplicaSetの仕様に基づいて、
設定された数の{{< glossary_tooltip term_id="pod" text="Pods" >}}がクラスターで稼働することを保証するために、
ReplicaSetを使用します。
