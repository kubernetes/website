---
title: docker
id: docker
date: 2018-04-12
full_link: /docs/reference/kubectl/docker-cli-to-kubectl/
short_description: >
  Docker 是一项可以提供操作系统级别虚拟化的软件技术，Docker 也以容器而知名。

aka: 
tags:
- fundamental
---

<!--
---
title: docker
id: docker
date: 2018-04-12
full_link: /docs/reference/kubectl/docker-cli-to-kubectl/
short_description: >
  Docker is a software technology providing operating-system-level virtualization also known as containers.

aka: 
tags:
- fundamental
---
-->

<!--
 Docker is a software technology providing operating-system-level virtualization also known as containers.
-->

Docker 是一项可以提供操作系统级别虚拟化的软件技术，Docker 也以容器而知名。

<!--more--> 

<!--
Docker uses the resource isolation features of the Linux kernel such as cgroups and kernel namespaces, and a union-capable file system such as OverlayFS and others to allow independent "containers" to run within a single Linux instance, avoiding the overhead of starting and maintaining virtual machines (VMs).
-->

Docker 使用了 Linux 内核中的资源隔离特性（如 cgroup 和内核命名空间）以及 union-capable 文件系统（如 OverlayFS和其他）。从而可以让单个容器独占一个 Linux 实例，这样用户就不需要经常性的启动和维护虚拟机。
