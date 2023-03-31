---
title: ガベージコレクション
id: garbage-collection
date: 2021-07-07
full_link: /ja/docs/concepts/architecture/garbage-collection/
short_description: >
  Kubernetesがクラスターリソースをクリーンアップするために使用するさまざまなメカニズムの総称です。

aka: 
tags:
- fundamental
- operation
---

ガベージコレクションは、Kubernetesがクラスターリソースをクリーンアップするために使用するさまざまなメカニズムの総称です。

<!--more-->

Kubernetesはガベージコレクションを使用して、[未使用のコンテナとイメージ](/ja/docs/concepts/architecture/garbage-collection/#containers-images)、[失敗したPod](/ja/docs/concepts/workloads/pods/pod-lifecycle/#pod-garbage-collection)、[対象リソースが所有するオブジェクト](/ja/docs/concepts/overview/working-with-objects/owners-dependents/)、[完了したJob](/ja/docs/concepts/workloads/controllers/ttlafterfinished/)、期限切れまたは失敗したリソースなどのリソースをクリーンアップします。

