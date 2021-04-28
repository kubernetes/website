---
title: 工作负载（Workload）
id: workloads
date: 2019-02-13
full_link: /zh/docs/concepts/workloads/
short_description: >
   工作负载是在 Kubernetes 上运行的应用程序。

aka: 
tags:
- fundamental
---


<!-- 
---
title: Workload
id: workloads
date: 2019-02-13
full_link: /docs/concepts/workloads/
short_description: >
   A workload is an application running on Kubernetes.

aka: 
tags:
- fundamental
--- 
-->

<!-- 
   A workload is an application running on Kubernetes.
-->
   工作负载是在 Kubernetes 上运行的应用程序。

<!--more--> 

<!-- 
Various core objects that represent different types or parts of a workload
include the DaemonSet, Deployment, Job, ReplicaSet, and StatefulSet objects.

For example, a workload that has a web server and a database might run the
database in one {{< glossary_tooltip term_id="StatefulSet" >}} and the web server
in a {{< glossary_tooltip term_id="Deployment" >}}.
-->
代表不同类型或部分工作负载的各种核心对象包括 DaemonSet，Deployment，Job，ReplicaSet and StatefulSet。

例如，具有 Web 服务器和数据库的工作负载可能在一个 {{< glossary_tooltip term_id="StatefulSet" >}} 中运行数据库，
而 Web 服务器运行在 {{< glossary_tooltip term_id="Deployment" >}}。