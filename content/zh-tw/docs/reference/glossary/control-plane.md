---
title: 控制平面（Control Plane）
id: control-plane
date: 2019-05-12
full_link:
short_description: >
  控制平面是指容器編排層，它暴露 API 和介面來定義、部署容器和管理容器的生命週期。

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
控制平面（Control Plane）是指容器編排層，它暴露 API 和介面來定義、
部署容器和管理容器的生命週期。

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
這個編排層是由多個不同的元件組成，例如以下（但不限於）幾種：

 * {{< glossary_tooltip text="etcd" term_id="etcd" >}}
 * {{< glossary_tooltip text="API 伺服器" term_id="kube-apiserver" >}}
 * {{< glossary_tooltip text="排程器" term_id="kube-scheduler" >}}
 * {{< glossary_tooltip text="控制器管理器" term_id="kube-controller-manager" >}}
 * {{< glossary_tooltip text="雲控制器管理器" term_id="cloud-controller-manager" >}}

這些元件可以以傳統的系統服務執行也可以以容器的形式執行.執行這些元件的主機過去稱為 master 節點。 
