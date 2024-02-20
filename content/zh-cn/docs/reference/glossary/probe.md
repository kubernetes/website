---
title: 探针（Probe）
id: probe
date: 2023-03-21
full_link: /zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#container-probes

short_description: >
  由 kubelet 定期对 Pod 中的容器定期执行的一项检查。

tags:
- tool
---
<!--
title: Probe
id: probe
date: 2023-03-21
full_link: /docs/concepts/workloads/pods/pod-lifecycle/#container-probes

short_description: >
  A check performed periodically by the kubelet on a container in a Pod.

tags:
- tool
-->

<!--
A check that the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} periodically performs against a container that is 
running in a pod, that will define container's state and health and informing container's lifecycle.
-->
由 {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 定期对运行在 Pod 中的容器执行的一项检查，
用于定义容器的状态和健康状况，并通知容器的生命周期。

<!--more-->

<!--
To learn more, read [container probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).
-->
若要了解更多，可以阅读[容器探针](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)。
