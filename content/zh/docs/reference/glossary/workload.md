---
title: 工作负载
id: workloads
date: 2019-02-13
full_link: /docs/concepts/workloads/
short_description: >
   工作负载是用来在集群上管理和运行容器的对象。

aka: 
tags:
- fundamental
- core-object
- workload
---
<!--
  Workloads are objects you use to manage and run your containers on the cluster.
-->

工作负载是用来在集群上管理和运行容器的对象。

<!--more--> 

<!--
Kubernetes performs the 
deployment and updates the workload with the current state of the application.
Workloads include the DaemonSet, Deployments, Jobs, Pods, ReplicaSet, ReplicationController, and StatefulSet objects.

For example, a workload that has a web element and a database element might run the
database in one {{< glossary_tooltip term_id="StatefulSet" >}} of
{{< glossary_tooltip text="pods" term_id="pod" >}} and the webserver via
a {{< glossary_tooltip term_id="Deployment" >}} that consists of many web app
{{< glossary_tooltip text="pods" term_id="pod" >}}, all alike.

-->

Kubernetes 使用应用程序的当前状态部署和更新工作负载。
工作负载包括 DaemonSet、Deployments、Jobs、Pods、ReplicaSet、ReplicationController 和 StatefulSet 对象。

例如，具有 Web 元素和数据库元素的工作负载可能会运行数据库在一个 {{<glossary_tooltip term_id="StatefulSet">}} 中的
{{<glossary_tooltip text="pods" term_id="pod">}} ，并且网络服务器通过由许多{{<glossary_tooltip text="pods" term_id="pod">}}
网络应用组成的 {{<glossary_tooltip term_id="Deployment">}}，大都是类似的。
