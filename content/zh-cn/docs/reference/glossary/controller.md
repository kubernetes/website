---
title: 控制器（Controller）
id: controller
date: 2018-04-12
full_link: /zh-cn/docs/concepts/architecture/controller/
short_description: >
  控制器通过 API 服务器监控集群的公共状态，并致力于将当前状态转变为期望的状态。

aka: 
tags:
- architecture
- fundamental
---
<!--
title: Controller
id: controller
date: 2018-04-12
full_link: /docs/concepts/architecture/controller/
short_description: >
  A control loop that watches the shared state of the cluster through the apiserver and makes changes attempting to move the current state towards the desired state.

aka: 
tags:
- architecture
- fundamental
-->
																			  
<!--
In Kubernetes, controllers are control loops that watch the state of your
{{< glossary_tooltip term_id="cluster" text="cluster">}}, then make or request
changes where needed.
Each controller tries to move the current cluster state closer to the desired
state.
-->					 
在 Kubernetes 中，控制器通过监控{{< glossary_tooltip text="集群" term_id="cluster" >}}
的公共状态，并致力于将当前状态转变为期望的状态。

<!--more--> 													   
												  
<!--
Controllers watch the shared state of your cluster through the
{{< glossary_tooltip text="apiserver" term_id="kube-apiserver" >}} (part of the
{{< glossary_tooltip term_id="control-plane" >}}).
-->
控制器（{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}的一部分）
通过 {{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}}监控你的集群中的公共状态。

<!--
Some controllers also run inside the control plane, providing control loops that
are core to Kubernetes' operations. For example: the deployment controller, the
daemonset controller, the namespace controller, and the persistent volume
controller (and others) all run within the
{{< glossary_tooltip term_id="kube-controller-manager" >}}. 
-->
其中一些控制器是运行在控制平面内部的，对 Kubernetes 来说，他们提供核心控制操作。
比如：部署控制器（deployment controller）、守护控制器（daemonset controller）、
命名空间控制器（namespace controller）、持久化数据卷控制器（persistent volume controller）（等）
都是运行在 {{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}} 中的。
