---
title: 关键插件 Pod 的调度保证
content_type: concept
---

<!-- overview -->

<!-- 
In addition to Kubernetes core components like api-server, scheduler, controller-manager running on a master machine
there are a number of add-ons which, for various reasons, must run on a regular cluster node (rather than the Kubernetes master).
Some of these add-ons are critical to a fully functional cluster, such as metrics-server, DNS, and UI.
A cluster may stop working properly if a critical add-on is evicted (either manually or as a side effect of another operation like upgrade)
and becomes pending (for example when the cluster is highly utilized and either there are other pending pods that schedule into the space
vacated by the evicted critical add-on pod or the amount of resources available on the node changed for some other reason).
-->
除了在主机上运行的 Kubernetes 核心组件（如 api-server 、scheduler 、controller-manager）之外，还有许多插件，由于各种原因，
必须在常规集群节点（而不是 Kubernetes 主节点）上运行。
其中一些插件对于功能完备的群集至关重要，例如 Heapster、DNS 和 UI。
如果关键插件被逐出（手动或作为升级等其他操作的副作用）或者变成挂起状态，群集可能会停止正常工作。
关键插件进入挂起状态的例子有：集群利用率过高；被逐出的关键插件 Pod 释放了空间，但该空间被之前悬决的 Pod 占用；由于其它原因导致节点上可用资源的总量发生变化。



<!-- body -->

<!--
### Marking pod as critical
-->
### 标记关键 Pod

<!--
To be considered critical, the pod has to run in the `kube-system` namespace (configurable via flag) and
* Have the priorityClassName set as "system-cluster-critical" or "system-node-critical", the latter being the highest for entire cluster. Alternatively, you could add an annotation `scheduler.alpha.kubernetes.io/critical-pod` as key and empty string as value to your pod, but this annotation is deprecated as of version 1.13 and will be removed in 1.14.
-->
要将 pod 标记为关键性（critical），pod 必须在 kube-system 命名空间中运行（可通过参数配置）。
同时，需要将 `priorityClassName` 设置为 `system-cluster-critical` 或 `system-node-critical` ，后者是整个群集的最高级别。
或者，也可以为 Pod 添加名为 `scheduler.alpha.kubernetes.io/critical-pod`、值为空字符串的注解。
不过，这一注解从 1.13 版本开始不再推荐使用，并将在 1.14 中删除。


