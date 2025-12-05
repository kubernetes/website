---
title: 控制組（cgroup；control group）
id: cgroup
date: 2019-06-25
full_link:
short_description: >
  一組具有可選資源隔離、審計和限制的 Linux 進程。

aka:
tags:
- fundamental
---
<!--
title: cgroup (control group)
id: cgroup
date: 2019-06-25
full_link:
short_description: >
  A group of Linux processes with optional resource isolation, accounting and limits.

aka:
tags:
- fundamental
-->

<!--
A group of Linux processes with optional {{< glossary_tooltip text="resource" term_id="infrastructure-resource" >}} isolation, accounting and limits.
-->
一組具有可選{{< glossary_tooltip text="資源" term_id="infrastructure-resource" >}}隔離、
審計和限制的 Linux 進程。

<!--more--> 

<!--
cgroup is a Linux kernel feature that limits, accounts for, and isolates the resource usage (CPU, memory, disk I/O, network) for a collection of processes.
-->
cgroup 是一個 Linux 內核特性，對一組進程的資源使用（CPU、內存、磁盤 I/O 和網路等）進行限制、審計和隔離。
