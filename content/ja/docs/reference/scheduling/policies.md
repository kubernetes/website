---
title: スケジューリングポリシー
content_type: concept
sitemap:
  priority: 0.2 # スケジューリングポリシーは廃止されました。
weight: 30
---

<!-- overview -->

バージョンv1.23より前のKubernetesでは、スケジューリングポリシーを使用して、*predicates*と*priorities*の処理を指定することができました。例えば、`kube-scheduler --policy-config-file <filename>`または`kube-scheduler --policy-configmap <ConfigMap>`を実行すると、スケジューリングポリシーを設定することが可能です。

このスケジューリングポリシーは、バージョンv1.23以降のKubernetesではサポートされていません。関連するフラグである、`policy-config-file`、`policy-configmap`、`policy-configmap-namespace`、`use-legacy-policy-config`も同様にサポートされていません。
代わりに、[スケジューラー設定](/ja/docs/reference/scheduling/config/)を使用してください。

## {{% heading "whatsnext" %}}

* [スケジューリング](/ja/docs/concepts/scheduling-eviction/kube-scheduler/)について学ぶ
* [kube-scheduler設定](/ja/docs/reference/scheduling/config/)について学ぶ
* [kube-scheduler設定リファレンス(v1beta3)](/docs/reference/config-api/kube-scheduler-config.v1beta3/)について読む
