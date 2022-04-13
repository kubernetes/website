---
title: APIを起点とした退避
content_type: concept
weight: 70
---

{{< glossary_definition term_id="api-eviction" length="short" >}} </br>

`kubectl drain`コマンドのようなkube-apiserverのクライアントを使用してEviction APIを直接呼び出すことで、退避を要求することができます。これにより、`Eviction`オブジェクトを作成し、APIサーバーにPodを終了させます。

APIを起点とした退避は[`PodDisruptionBudgets`](/docs/tasks/run-application/configure-pdb/)と[`terminationGracePeriodSeconds`](/ja/docs/concepts/workloads/pods/pod-lifecycle#pod-termination)の設定を優先します。


## {{% heading "whatsnext" %}}

* [Node不足による退避](/docs/concepts/scheduling-eviction/node-pressure-eviction/)について学ぶ
* [Podの優先度とプリエンプション](/docs/concepts/scheduling-eviction/pod-priority-preemption/)について学ぶ
