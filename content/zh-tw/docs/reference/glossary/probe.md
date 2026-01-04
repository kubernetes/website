---
title: 探針（Probe）
id: probe
date: 2023-03-21
full_link: /zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#container-probes

short_description: >
  由 kubelet 定期對 Pod 中的容器定期執行的一項檢查。

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
由 {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} 定期對運行在 Pod 中的容器執行的一項檢查，
用於定義容器的狀態和健康狀況，並通知容器的生命週期。

<!--more-->

<!--
To learn more, read [container probes](/docs/concepts/workloads/pods/pod-lifecycle/#container-probes).
-->
若要了解更多，可以閱讀[容器探針](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)。
