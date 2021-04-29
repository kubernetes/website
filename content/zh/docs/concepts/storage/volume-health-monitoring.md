---
title: 卷健康监测
content_type: concept
---
<!-- 
---
reviewers:
- jsafrane
- saad-ali
- msau42
- xing-yang
title: Volume Health Monitoring
content_type: concept
---
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

<!-- 
{{< glossary_tooltip text="CSI" term_id="csi" >}} volume health monitoring allows CSI Drivers to detect abnormal volume conditions from the underlying storage systems and report them as events on {{< glossary_tooltip text="PVCs" term_id="persistent-volume-claim" >}} or {{< glossary_tooltip text="Pods" term_id="pod" >}}.
-->
{{< glossary_tooltip text="CSI" term_id="csi" >}} 卷健康监测支持 CSI 驱动从底层的存储系统着手，探测异常的卷状态，并以事件的形式上报到 {{< glossary_tooltip text="PVCs" term_id="persistent-volume-claim" >}} 或 {{< glossary_tooltip text="Pods" term_id="pod" >}}.

<!-- body -->

<!-- 
## Volume health monitoring
-->
## 卷健康监测 {#volume-health-monitoring}

<!-- 
Kubernetes _volume health monitoring_ is part of how Kubernetes implements the Container Storage Interface (CSI). Volume health monitoring feature is implemented in two components: an External Health Monitor controller, and the {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}.

If a CSI Driver supports Volume Health Monitoring feature from the controller side, an event will be reported on the related {{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}} (PVC) when an abnormal volume condition is detected on a CSI volume.
-->
Kubernetes _卷健康监测_ 是 Kubernetes 容器存储接口（CSI）实现的一部分。
卷健康监测特性由两个组件实现：外部健康监测控制器和 {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}。

如果 CSI 驱动器通过控制器的方式支持卷健康监测特性，那么只要在 CSI 卷上监测到异常卷状态，就会在
{{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}} (PVC)
中上报一个事件。

<!-- The External Health Monitor {{< glossary_tooltip text="controller" term_id="controller" >}} also watches for node failure events. You can enable node failure monitoring by setting the `enable-node-watcher` flag to true. When the external health monitor detects a node failure event, the controller reports an Event will be reported on the PVC to indicate that pods using this PVC are on a failed node.

If a CSI Driver supports Volume Health Monitoring feature from the node side, an Event will be reported on every Pod using the PVC when an abnormal volume condition is detected on a CSI volume.
-->
外部健康监测  {{< glossary_tooltip text="控制器" term_id="controller" >}} 也会监测节点失效事件。
如果要启动节点失效监测功能，你可以设置标志 `enable-node-watcher` 为 `true`。
当外部健康监测器检测到一个节点失效事件，控制器会报送一个事件，该事件会在 PVC 上继续上报，
以表明使用此 PVC 的 Pod 正位于一个失效的节点上。

如果 CSI 驱动程序支持节点测的卷健康检测，那当在 CSI 卷上检测到异常卷时，会在使用该 PVC 的每个Pod 上触发一个事件。

<!-- 
You need to enable the `CSIVolumeHealth` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) to use this feature from the node side.
-->
{{< note >}}
你需要启用 
`CSIVolumeHealth` [特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/)
，才能从节点测使用此特性。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!-- 
See the [CSI driver documentation](https://kubernetes-csi.github.io/docs/drivers.html) to find out which CSI drivers have implemented this feature.
-->
参阅 [CSI 驱动程序文档](https://kubernetes-csi.github.io/docs/drivers.html)，
可以找出有那些 CSI 驱动程序已实现了此特性。