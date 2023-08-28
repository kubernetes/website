---
title: APIを起点とした退避
id: api-eviction
date: 2021-04-27
full_link: /ja/docs/concepts/scheduling-eviction/api-eviction/
short_description: >
  APIを起点とした退避は、Eviction　APIを使用してEvictionオブジェクトを作成し、Podの正常終了を起動させるプロセスです。
aka:
tags:
- operation
---
APIを起点とした退避は、[Eviction API](/docs/reference/generated/kubernetes-api/{{<param "version">}}/#create-eviction-pod-v1-core)を使用して退避オブジェクトを作成し、Podの正常終了を起動させるプロセスです。


<!--more-->

`kubectl drain`コマンドのようなkube-apiserverのクライアントを使用し、Eviction APIを直接呼び出すことで、退避を要求することができます。`Eviction`オブジェクトが生成された時、APIサーバーは対象のPodを終了させます。

APIを起点とした退避は[`PodDisruptionBudgets`](/docs/tasks/run-application/configure-pdb/)と[`terminationGracePeriodSeconds`](/ja/docs/concepts/workloads/pods/pod-lifecycle#pod-termination)の設定を優先します。

APIを起点とした退避は、[Node不足による退避](/docs/concepts/scheduling-eviction/node-pressure-eviction/)とは異なります。

* 詳しくは[APIを起点とした退避](/ja/docs/concepts/scheduling-eviction/api-eviction/)をご覧ください。
