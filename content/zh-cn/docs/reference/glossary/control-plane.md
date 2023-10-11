---
title: 控制平面（Control Plane）
id: control-plane
date: 2019-05-12
full_link:
short_description: >
  控制平面是指容器编排层，它暴露 API 和接口来定义、部署容器和管理容器的生命周期。

aka:
tags:
- fundamental
---
<!--
title: Control Plane
id: control-plane
date: 2019-05-12
full_link:
short_description: >
  The container orchestration layer that exposes the API and interfaces to define, deploy, and manage the lifecycle of containers.

aka:
tags:
- fundamental
-->

<!--
 The container orchestration layer that exposes the API and interfaces to define, deploy, and manage the lifecycle of containers.
-->
控制平面（Control Plane）是指容器编排层，它暴露 API 和接口来定义、
部署容器和管理容器的生命周期。

<!--more-->

<!--
 This layer is composed by many different components, such as (but not restricted to):

 * {{< glossary_tooltip text="etcd" term_id="etcd" >}}
 * {{< glossary_tooltip text="API Server" term_id="kube-apiserver" >}}
 * {{< glossary_tooltip text="Scheduler" term_id="kube-scheduler" >}}
 * {{< glossary_tooltip text="Controller Manager" term_id="kube-controller-manager" >}}
 * {{< glossary_tooltip text="Cloud Controller Manager" term_id="cloud-controller-manager" >}}

 These components can be run as traditional operating system services (daemons) or as containers. The hosts running these components were historically called {{< glossary_tooltip text="masters" term_id="master" >}}.
-->
这个编排层是由多个不同的组件组成，例如以下（但不限于）几种：

* {{< glossary_tooltip text="etcd" term_id="etcd" >}}
* {{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}}
* {{< glossary_tooltip text="调度器" term_id="kube-scheduler" >}}
* {{< glossary_tooltip text="控制器管理器" term_id="kube-controller-manager" >}}
* {{< glossary_tooltip text="云控制器管理器" term_id="cloud-controller-manager" >}}

这些组件可以作为传统的操作系统服务（守护程序）或容器运行。
运行这些组件的主机在历史上被称为 {{<glossary_tooltip text="Master" term_id="master" >}}。
