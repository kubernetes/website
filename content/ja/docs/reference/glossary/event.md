---
title: イベント(Event)
id: event
full_link: /docs/reference/kubernetes-api/cluster-resources/event-v1/
short_description: >
   クラスター内の状況変化を表すKubernetesオブジェクト。
aka: 
tags:
- core-object
- fundamental
---
クラスター内の状態変化や注目すべき事象を表す、Kubernetes{{< glossary_tooltip text="オブジェクト" term_id="object" >}}です。

<!--more-->
イベントの保持期間には限りがあり、トリガーやメッセージは時間の経過とともに変化する場合があります。
イベントを利用する側は、特定の理由(reason)を持つイベントのタイミングが、常に同じ根本的なトリガーを反映していることを前提とすべきではありません。
また、その理由を持つイベントが今後も存在し続けることを前提とすべきでもありません。

イベントは、あくまで参考情報であり、ベストエフォートの補助的なデータとして扱うべきです。

Kubernetesでは、[監査](/docs/tasks/debug/debug-cluster/audit/)によって、異なる種類のEventレコード(APIグループ`audit.k8s.io`)が生成されます。
