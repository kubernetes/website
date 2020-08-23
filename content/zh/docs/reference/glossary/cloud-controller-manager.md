---
title: 云控制器管理器
id: cloud-controller-manager
date: 2018-04-12
full_link: /zh/docs/tasks/administer-cluster/running-cloud-controller/
short_description: >
  云控制器管理器是 1.8 的 alpha 特性。在未来发布的版本中，这是将 Kubernetes 与任何其他云集成的最佳方式。

aka: 
tags:
- core-object
- architecture
- operation
---

<!--
---
title: Cloud Controller Manager
id: cloud-controller-manager
date: 2018-04-12
full_link: /zh/docs/tasks/administer-cluster/running-cloud-controller/
short_description: >
  Cloud Controller Manager is an alpha feature in 1.8. In upcoming releases it will be the preferred way to integrate Kubernetes with any cloud.

aka: 
tags:
- core-object
- architecture
- operation
---
-->

<!--
 Cloud Controller Manager is an alpha feature in 1.8. In upcoming releases it will be the preferred way to integrate Kubernetes with any cloud.
-->

云控制器管理器是 1.8 的 alpha 特性。在未来发布的版本中，这是将 Kubernetes 与任何其他云集成的最佳方式。

<!--more--> 

<!--
Kubernetes v1.6 contains a new binary called cloud-controller-manager. cloud-controller-manager is a daemon that embeds cloud-specific control loops.  These cloud-specific control loops were originally in the kube-controller-manager. Since cloud providers develop and release at a different pace compared to the Kubernetes  project, abstracting the provider-specific code to the cloud-controller-manager binary allows cloud vendors to evolve independently from the core Kubernetes code.
-->

Kubernetes v1.6 包含一个新的可执行文件叫做 cloud-controller-manager。cloud-controller-manager 是一个守护进程，其中嵌入了特定于某云环境的控制环。
这些特定于云环境的控制环最初位于 kube-controller-manager 中。
由于云供应商的开发和发布节奏与 Kubernetes 项目不同步，将特定于供应商的代码抽象到 cloud-controller-manager 可执行文件可以允许云供应商独立于核心 Kubernetes 代码进行演进。
