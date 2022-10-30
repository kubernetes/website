---
title: Docker
id: docker
date: 2018-04-12
full_link: https://docs.docker.com/engine/
short_description: >
  Docker 是一种可以提供操作系统级别虚拟化（也称作容器）的软件技术。

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
Docker（这里特指 Docker Engine）是一种可以提供操作系统级别虚拟化
（也称作{{< glossary_tooltip text="容器" term_id="container" >}}）的软件技术。

<!--more--> 

<!--
Docker uses the resource isolation features of the Linux kernel such as cgroups and kernel namespaces, and a union-capable file system such as OverlayFS and others to allow independent "containers" to run within a single Linux instance, avoiding the overhead of starting and maintaining virtual machines (VMs).
-->
Docker 使用了 Linux 内核中的资源隔离特性（如 cgroup 和内核命名空间）以及支持联合文件系统（如 OverlayFS 和其他），
允许多个相互独立的“容器”一起运行在同一 Linux 实例上，从而避免启动和维护虚拟机（Virtual Machines；VM）的开销。
