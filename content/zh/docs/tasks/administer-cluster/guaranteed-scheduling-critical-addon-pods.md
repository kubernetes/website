---
- davidopp
- filipg
- piosz
title: 关键插件 Pod 的调度保证
content_template: templates/concept
---

{{% capture overview %}}

<!-- 
In addition to Kubernetes core components like api-server, scheduler, controller-manager running on a master machine
there are a number of add-ons which, for various reasons, must run on a regular cluster node (rather than the Kubernetes master).
Some of these add-ons are critical to a fully functional cluster, such as metrics-server, DNS, and UI.
A cluster may stop working properly if a critical add-on is evicted (either manually or as a side effect of another operation like upgrade)
and becomes pending (for example when the cluster is highly utilized and either there are other pending pods that schedule into the space
vacated by the evicted critical add-on pod or the amount of resources available on the node changed for some other reason).
-->
除了在主机上运行的 Kubernetes 核心组件（如  api-server 、scheduler 、controller-manager ）之外，还有许多插件，由于各种原因，
必须在常规集群节点（而不是 Kubernetes 主节点）上运行。
其中一些插件对于功能完备的群集至关重要，例如 Heapster，DNS 和 UI。
如果关键插件被移除（手动或作为升级等其他操作的副作用），或者变成挂起状态（例如，当集群利用率过高，以及或者其它被调度到该空间中的挂起 Pod 被清理关键插件 Pod 给移除，或者由于其它原因导致节点上可用资源的总量发生变化），群集可能会停止正常工作。



{{% /capture %}}


{{% capture body %}}


<!--
### Marking pod as critical
-->
### 将pod标记为	`critical`

<!--
To be considered critical, the pod has to run in the `kube-system` namespace (configurable via flag) and
-->
要将 pod 标记为	`critical` ，pod 必须在 kube-system 命名空间中运行（可通过标志配置），以及
<!--
* Have the priorityClassName set as "system-cluster-critical" or "system-node-critical", the latter being the highest for entire cluster. Alternatively, you could add an annotation `scheduler.alpha.kubernetes.io/critical-pod` as key and empty string as value to your pod, but this annotation is deprecated as of version 1.13 and will be removed in 1.14.
-->
* 将 `priorityClassName` 设置为 `system-cluster-critical` 或 `system-node-critical` ，后者是整个群集的最高级别。或者可以将注释 scheduler.alpha.kubernetes.io/critical-pod 作为密钥添加为空值，并将空字符串作为值添加到你的 pod 中，但此注释从1.13版本中开始不推荐使用，并将在1.14中删除。

{{% /capture %}}
