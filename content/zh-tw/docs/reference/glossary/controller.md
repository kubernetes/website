---
title: 控制器（Controller）
id: controller
date: 2018-04-12
full_link: /zh-cn/docs/concepts/architecture/controller/
short_description: >
  控制器透過 apiserver 監控叢集的公共狀態，並致力於將當前狀態轉變為期望的狀態。

aka: 
tags:
- architecture
- fundamental
---

<!--
---
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
---
-->
																			  
<!--
In Kubernetes, controllers are control loops that watch the state of your
{{< glossary_tooltip term_id="cluster" text="cluster">}}, then make or request
changes where needed.
Each controller tries to move the current cluster state closer to the desired
state.
-->					 

在 Kubernetes 中，控制器透過監控{{< glossary_tooltip text="叢集" term_id="cluster" >}}
的公共狀態，並致力於將當前狀態轉變為期望的狀態。

<!--more--> 
																			   
												  
<!--
Controllers watch the shared state of your cluster through the
{{< glossary_tooltip text="apiserver" term_id="kube-apiserver" >}} (part of the
{{< glossary_tooltip term_id="control-plane" >}}).
-->
控制器（{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}的一部分）
透過 {{< glossary_tooltip text="apiserver" term_id="kube-apiserver" >}} 監控你的叢集中的公共狀態。

<!--
Some controllers also run inside the control plane, providing control loops that
are core to Kubernetes' operations. For example: the deployment controller, the
daemonset controller, the namespace controller, and the persistent volume
controller (and others) all run within the
{{< glossary_tooltip term_id="kube-controller-manager" >}}. 
-->
其中一些控制器是執行在控制平面內部的，對 Kubernetes 來說，他們提供核心控制操作。
比如：部署控制器（deployment controller）、守護控制器（daemonset controller）、
名稱空間控制器（namespace controller）、持久化資料卷控制器（persistent volume
controller）（等）都是執行在 {{< glossary_tooltip text="kube-controller-manager" term_id="kube-controller-manager" >}} 中的。

