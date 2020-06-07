---
title: 控制器
id: controller
date: 2018-04-12
full_link: /docs/admin/kube-controller-manager/
short_description: >
  控制器通过 apiserver 监控集群的公共状态，并致力于将当前状态转变为期望的状态。

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
full_link: /docs/admin/kube-controller-manager/
short_description: >
  A control loop that watches the shared state of the cluster through the apiserver and makes changes attempting to move the current state towards the desired state.

aka: 
tags:
- architecture
- fundamental
---
-->

 控制器通过 {{< glossary_tooltip text="apiserver" term_id="kube-apiserver" >}} 监控集群的公共状态，并致力于将当前状态转变为期望的状态。

<!--more--> 

<!--
Examples of controllers that ship with Kubernetes today are the replication controller, endpoints controller, namespace controller, and serviceaccounts controller.
-->

Kubernetes 当前提供的部分控制器例子包括：副本控制器（replication controller）、端点控制器（endpoints controller）、命名空间控制器（namespace controller）、服务账号控制器（serviceaccounts controller）。

