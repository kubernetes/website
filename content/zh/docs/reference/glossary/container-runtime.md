---
title: 容器运行时（Container Runtime）
id: container-runtime
date: 2019-06-05
full_link: /zh/docs/setup/production-environment/container-runtimes
short_description: >
 容器运行时是负责运行容器的软件。

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
容器运行环境是负责运行容器的软件。

<!--more-->

<!--
Kubernetes supports several container runtimes: {{< glossary_tooltip term_id="docker">}},
{{< glossary_tooltip term_id="containerd" >}}, {{< glossary_tooltip term_id="cri-o" >}},
and any runtime environment implementation of the [Kubernetes CRI (Container Runtime
Interface)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md).
-->
Kubernetes 支持多个容器运行环境: {{< glossary_tooltip term_id="docker">}}、
{{< glossary_tooltip term_id="containerd" >}}、{{< glossary_tooltip term_id="cri-o" >}}
以及任何实现 [Kubernetes CRI (容器运行环境接口)](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-node/container-runtime-interface.md) 的运行环境。
