---
title: Eviction Policy
content_template: templates/concept
weight: 60
---

<!-- overview -->

このページは、evictionに対するKubernetesのポリシーの概要です。

<!-- body -->

## Eviction Policy

{{< glossary_tooltip text="Kubelet" term_id="kubelet" >}}は、計算リソースの完全な飢餓状態を積極的に監視し、それを防ぐことができます。
そのような場合、kubeletは1つ以上のPodを積極的に失敗させることで、枯渇したリソースを取り戻すことができます。
kubeletがPodをフェイルすると、すべてのコンテナを終了させ、そのPodPhaseをFailedに遷移させます。
追い出されたPodがデプロイメントによって管理されている場合、デプロイメントはKubernetesによってスケジュールされる別のPodを作成します。


## {{% heading "whatsnext" %}}
- evictionシグナル、しきい値、処理の詳細については、[リソース処理の構成]((/docs/tasks/administer-cluster/out-of-resource/))をご覧ください。
