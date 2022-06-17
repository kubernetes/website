---
title: Docker
id: docker
date: 2018-04-12
full_link: /zh-cn/docs/reference/kubectl/docker-cli-to-kubectl/
short_description: >
  Docker 是一種可以提供作業系統級別虛擬化（也稱作容器）的軟體技術。

aka: 
tags:
- fundamental
---

<!--
---
title: Docker
id: docker
date: 2018-04-12
full_link: https://docs.docker.com/engine/
short_description: >
  Docker is a software technology providing operating-system-level virtualization also known as containers.

aka: 
tags:
- fundamental
---
-->

<!--
Docker (specifically, Docker Engine) is a software technology providing operating-system-level virtualization also known as {{< glossary_tooltip text="containers" term_id="container" >}}.
-->

 Docker（這裡特指 Docker 引擎） 是一種可以提供作業系統級別虛擬化（也稱作{{< glossary_tooltip text="容器" term_id="container" >}}）的軟體技術。

<!--more--> 

<!--
Docker uses the resource isolation features of the Linux kernel such as cgroups and kernel namespaces, and a union-capable file system such as OverlayFS and others to allow independent "containers" to run within a single Linux instance, avoiding the overhead of starting and maintaining virtual machines (VMs).
-->

Docker 使用了 Linux 核心中的資源隔離特性（如 cgroup 和核心名稱空間）以及支援聯合檔案系統（如 OverlayFS 和其他），
允許多個相互獨立的“容器”一起執行在同一 Linux 例項上，從而避免啟動和維護虛擬機器（VMs）的開銷。
