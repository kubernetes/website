---
title: Event
id: event
full_link: /docs/reference/kubernetes-api/cluster-resources/event-v1/
short_description: >
   Kubernetesクラスターの状況変化を説明するオブジェクト。
aka: 
tags:
- core-object
- fundamental
---
クラスター内の状態変化や注目すべき事象を説明する、Kubernetesの{{< glossary_tooltip text="オブジェクト" term_id="object" >}}です。

<!--more-->
Eventの保持期間には限りがあり、トリガーやメッセージは時間の経過とともに変化する場合があります。
Eventの利用者は、特定の理由を持つEventのタイミングが、常に同じ根本的なトリガーを反映しているとみなすべきではありません。
また、その理由を持つEventが今後も存在し続けると見なすべきでもありません。

Eventは、あくまで参考情報であり、ベストエフォートの補助的なデータとして扱うべきです。

Kubernetesでは、[監査](/docs/tasks/debug/debug-cluster/audit/)によって、Eventとは異なる種類の記録(APIグループ`audit.k8s.io`)が生成されます。
