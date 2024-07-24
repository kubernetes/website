---
title: CRI-O
id: cri-o
date: 2019-05-14
full_link: https://cri-o.io/#what-is-cri-o
short_description: >
  专用于 Kubernetes 的轻量级容器运行时软件

aka:
tags:
- tool
---
<!-- 
title: CRI-O
id: cri-o
date: 2019-05-14
full_link: https://cri-o.io/#what-is-cri-o
short_description: >
  A lightweight container runtime specifically for Kubernetes

aka:
tags:
- tool
-->

<!-- 
A tool that lets you use OCI container runtimes with Kubernetes CRI.
-->
该工具可让你通过 Kubernetes CRI 使用 OCI 容器运行时。

<!--more-->

<!-- 
CRI-O is an implementation of the {{< glossary_tooltip term_id="cri" >}}
to enable using {{< glossary_tooltip text="container" term_id="container" >}}
runtimes that are compatible with the Open Container Initiative (OCI)
[runtime spec](https://www.github.com/opencontainers/runtime-spec).
-->
CRI-O 是 {{< glossary_tooltip text="CRI" term_id="cri" >}} 的一种实现，
使得你可以使用与开放容器倡议（Open Container Initiative；OCI）
[运行时规范](https://www.github.com/opencontainers/runtime-spec)
兼容的{{< glossary_tooltip text="容器" term_id="container" >}}运行时。

<!-- 
Deploying CRI-O allows Kubernetes to use any OCI-compliant runtime as the container
runtime for running {{< glossary_tooltip text="Pods" term_id="pod" >}}, and to fetch
OCI container images from remote registries.
-->
部署 CRI-O 允许 Kubernetes 使用任何符合 OCI 要求的运行时作为容器运行时去运行
{{< glossary_tooltip text="Pod" term_id="pod" >}}，
并从远程容器仓库获取 OCI 容器镜像。
