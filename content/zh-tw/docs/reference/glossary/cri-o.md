---
title: CRI-O
id: cri-o
date: 2019-05-14
full_link: https://cri-o.io/#what-is-cri-o
short_description: >
  專用於 Kubernetes 的輕量級容器運行時軟件

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
該工具可讓你通過 Kubernetes CRI 使用 OCI 容器運行時。

<!--more-->

<!-- 
CRI-O is an implementation of the {{< glossary_tooltip term_id="cri" >}}
to enable using {{< glossary_tooltip text="container" term_id="container" >}}
runtimes that are compatible with the Open Container Initiative (OCI)
[runtime spec](https://www.github.com/opencontainers/runtime-spec).
-->
CRI-O 是 {{< glossary_tooltip text="CRI" term_id="cri" >}} 的一種實現，
使得你可以使用與開放容器倡議（Open Container Initiative；OCI）
[運行時規範](https://www.github.com/opencontainers/runtime-spec)
兼容的{{< glossary_tooltip text="容器" term_id="container" >}}運行時。

<!-- 
Deploying CRI-O allows Kubernetes to use any OCI-compliant runtime as the container
runtime for running {{< glossary_tooltip text="Pods" term_id="pod" >}}, and to fetch
OCI container images from remote registries.
-->
部署 CRI-O 允許 Kubernetes 使用任何符合 OCI 要求的運行時作爲容器運行時去運行
{{< glossary_tooltip text="Pod" term_id="pod" >}}，
並從遠程容器倉庫獲取 OCI 容器映像檔。
