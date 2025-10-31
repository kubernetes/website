---
title: cAdvisor
id: cadvisor
date: 2021-12-09
full_link: https://github.com/google/cadvisor/
short_description: >
  帮助理解容器的资源用量与性能特征的工具。

aka:
tags:
- tool
---
<!--
title: cAdvisor
id: cadvisor
date: 2021-12-09
full_link: https://github.com/google/cadvisor/
short_description: >
  Tool that provides understanding of the resource usage and performance characteristics for containers
aka:
tags:
- tool
-->

<!--
cAdvisor (Container Advisor) provides container users an understanding of the resource usage and performance characteristics of their running {{< glossary_tooltip text="containers" term_id="container" >}}.
-->
cAdvisor (Container Advisor) 为容器用户提供对其运行中的{{< glossary_tooltip text="容器" term_id="container" >}}
的资源用量和性能特征的知识。

<!--more-->

<!--
It is a running daemon that collects, aggregates, processes, and exports information about running containers. Specifically, for each container it keeps resource isolation parameters, historical resource usage, histograms of complete historical resource usage and network statistics. This data is exported by container and machine-wide.
-->
cAdvisor 是一个守护进程，负责收集、聚合、处理并输出运行中容器的信息。
具体而言，针对每个容器，该进程记录容器的资源隔离参数、历史资源用量、完整历史资源用量和网络统计的直方图。
这些数据可以按容器或按机器层面输出。
