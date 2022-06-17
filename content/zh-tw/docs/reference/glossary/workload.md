---
title: 工作負載（Workload）
id: workloads
date: 2019-02-13
full_link: /zh-cn/docs/concepts/workloads/
short_description: >
   工作負載是在 Kubernetes 上執行的應用程式。

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
   工作負載是在 Kubernetes 上執行的應用程式。

<!--more--> 

<!-- 
Various core objects that represent different types or parts of a workload
include the DaemonSet, Deployment, Job, ReplicaSet, and StatefulSet objects.

For example, a workload that has a web server and a database might run the
database in one {{< glossary_tooltip term_id="StatefulSet" >}} and the web server
in a {{< glossary_tooltip term_id="Deployment" >}}.
-->
代表不同型別或部分工作負載的各種核心物件包括 DaemonSet， Deployment， Job， ReplicaSet， and StatefulSet。

例如，具有 Web 伺服器和資料庫的工作負載可能在一個 {{< glossary_tooltip term_id="StatefulSet" >}} 中執行資料庫，
而 Web 伺服器執行在 {{< glossary_tooltip term_id="Deployment" >}}。