---
title: コンテナランタイム
id: container-runtime
full_link: /docs/setup/production-environment/container-runtimes
short_description: >
 コンテナランタイムは、コンテナの実行を担当するソフトウェアです。

aka:
tags:
- fundamental
- workload
---
 Kubernetesがコンテナを効果的に実行するために不可欠なコンポーネントです。
 Kubernetes環境においてコンテナの実行とライフサイクルの管理を担います。

<!--more-->

Kubernetesは{{< glossary_tooltip term_id="containerd" >}}、{{< glossary_tooltip term_id="cri-o" >}}などのコンテナランタイムと、[Kubernetes CRI (Container Runtime Interface)](https://github.com/kubernetes/community/blob/main/contributors/devel/sig-node/container-runtime-interface.md)のすべての実装をサポートします。
