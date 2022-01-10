---
title: コンテナランタイム
id: container-runtime
date: 2019-06-05
full_link: /ja/docs/setup/production-environment/container-runtimes
short_description: >
 コンテナランタイムは、コンテナの実行を担当するソフトウェアです。

aka:
tags:
- fundamental
- workload
---
 コンテナランタイムは、コンテナの実行を担当するソフトウェアです。

<!--more-->

Kubernetesは次の複数のコンテナランタイムをサポートします。
{{< glossary_tooltip term_id="docker">}}、{{< glossary_tooltip term_id="containerd" >}}、{{< glossary_tooltip term_id="cri-o" >}}、
および全ての
[Kubernetes CRI (Container Runtime Interface)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md)
実装です。
