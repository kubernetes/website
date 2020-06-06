---
title: コンテナランタイム
id: container-runtime
date: 2019-06-05
full_link: /docs/reference/generated/container-runtime
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
[Docker](http://www.docker.com), [containerd](https://containerd.io), [cri-o](https://cri-o.io/),
[rktlet](https://github.com/kubernetes-incubator/rktlet) および全ての
[Kubernetes CRI (Container Runtime Interface)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md)
実装。
