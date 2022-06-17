---
title: 容器執行時（Container Runtime）
id: container-runtime
date: 2019-06-05
full_link: /zh-cn/docs/setup/production-environment/container-runtimes
short_description: >
 容器執行時是負責執行容器的軟體。

aka:
tags:
- fundamental
- workload
---
<!--
---
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
---
-->

<!--
 The container runtime is the software that is responsible for running containers.
-->
容器執行環境是負責執行容器的軟體。

<!--more-->

<!--
Kubernetes supports container runtimes such sa
{{< glossary_tooltip term_id="docker">}},
{{< glossary_tooltip term_id="containerd" >}}, {{< glossary_tooltip term_id="cri-o" >}},
and any other implementation of the [Kubernetes CRI (Container Runtime
Interface)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md).
-->
Kubernetes 支援許多容器執行環境，例如
{{< glossary_tooltip term_id="docker">}}、
{{< glossary_tooltip term_id="containerd" >}}、
{{< glossary_tooltip term_id="cri-o" >}}
以及 [Kubernetes CRI (容器執行環境介面)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md)
的其他任何實現。