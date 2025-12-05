---
title: 容器運行時（Container Runtime）
id: container-runtime
date: 2019-06-05
full_link: /zh-cn/docs/setup/production-environment/container-runtimes
short_description: >
 容器運行時是負責運行容器的軟體。

aka:
tags:
- fundamental
- workload
---
<!--
title: Container Runtime
id: container-runtime
date: 2019-06-05
full_link: /docs/setup/production-environment/container-runtimes
short_description: >
 The container runtime is the software that is responsible for running containers.

aka:
tags:
- fundamental
- workload
-->

<!--
A fundamental component that empowers Kubernetes to run containers effectively.
It is responsible for managing the execution and lifecycle of containers within the Kubernetes environment.
-->
這個基礎組件使 Kubernetes 能夠有效運行容器。
它負責管理 Kubernetes 環境中容器的執行和生命週期。

<!--more-->

<!--
Kubernetes supports container runtimes such as
{{< glossary_tooltip term_id="containerd" >}}, {{< glossary_tooltip term_id="cri-o" >}},
and any other implementation of the [Kubernetes CRI (Container Runtime
Interface)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md).
-->
Kubernetes 支持許多容器運行環境，例如
{{< glossary_tooltip term_id="containerd" >}}、
{{< glossary_tooltip term_id="cri-o" >}}
以及 [Kubernetes CRI (容器運行環境介面)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md)
的其他任何實現。
