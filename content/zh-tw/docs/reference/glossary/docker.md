---
title: Docker
id: docker
date: 2018-04-12
full_link: https://docs.docker.com/engine/
short_description: >
  Docker 是一種可以提供操作系統級別虛擬化（也稱作容器）的軟件技術。

aka: 
tags:
- fundamental
---
<!--
title: Docker
id: docker
date: 2018-04-12
full_link: https://docs.docker.com/engine/
short_description: >
  Docker is a software technology providing operating-system-level virtualization also known as containers.

aka: 
tags:
- fundamental
-->

<!--
Docker (specifically, Docker Engine) is a software technology providing operating-system-level virtualization also known as {{< glossary_tooltip text="containers" term_id="container" >}}.
-->
Docker（這裏特指 Docker Engine）是一種可以提供操作系統級別虛擬化
（也稱作{{< glossary_tooltip text="容器" term_id="container" >}}）的軟件技術。

<!--more--> 

<!--
Docker uses the resource isolation features of the Linux kernel such as cgroups and kernel namespaces, and a union-capable file system such as OverlayFS and others to allow independent "containers" to run within a single Linux instance, avoiding the overhead of starting and maintaining virtual machines (VMs).
-->
Docker 使用了 Linux 內核中的資源隔離特性（如 cgroup 和內核命名空間）以及支持聯合文件系統（如 OverlayFS 和其他），
允許多個相互獨立的“容器”一起運行在同一 Linux 實例上，從而避免啓動和維護虛擬機（Virtual Machines；VM）的開銷。
