---
title: 卷健康監測
content_type: concept
weight: 100
---
<!-- 
reviewers:
- jsafrane
- saad-ali
- msau42
- xing-yang
title: Volume Health Monitoring
content_type: concept
weight: 100
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

<!--
{{< glossary_tooltip text="CSI" term_id="csi" >}} volume health monitoring allows
CSI Drivers to detect abnormal volume conditions from the underlying storage systems
and report them as events on {{< glossary_tooltip text="PVCs" term_id="persistent-volume-claim" >}}
or {{< glossary_tooltip text="Pods" term_id="pod" >}}.
-->
{{< glossary_tooltip text="CSI" term_id="csi" >}} 卷健康監測支持 CSI 驅動從底層的存儲系統着手，
探測異常的卷狀態，並以事件的形式上報到 {{< glossary_tooltip text="PVC" term_id="persistent-volume-claim" >}}
或 {{< glossary_tooltip text="Pod" term_id="pod" >}}.

<!-- body -->

<!--
## Volume health monitoring
-->
## 卷健康監測 {#volume-health-monitoring}

<!--
Kubernetes _volume health monitoring_ is part of how Kubernetes implements the
Container Storage Interface (CSI). Volume health monitoring feature is implemented
in two components: an External Health Monitor controller, and the
{{< glossary_tooltip term_id="kubelet" text="kubelet" >}}.

If a CSI Driver supports Volume Health Monitoring feature from the controller side,
an event will be reported on the related
{{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}} (PVC)
when an abnormal volume condition is detected on a CSI volume.
-->
Kubernetes **卷健康監測**是 Kubernetes 容器存儲接口（CSI）實現的一部分。
卷健康監測特性由兩個組件實現：外部健康監測控制器和 {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}。

如果 CSI 驅動器通過控制器的方式支持卷健康監測特性，那麼只要在 CSI 捲上監測到異常卷狀態，就會在
{{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}} (PVC)
中上報一個事件。

<!--
The External Health Monitor {{< glossary_tooltip text="controller" term_id="controller" >}}
also watches for node failure events. You can enable node failure monitoring by setting
the `enable-node-watcher` flag to true. When the external health monitor detects a node
failure event, the controller reports an Event will be reported on the PVC to indicate
that pods using this PVC are on a failed node.

If a CSI Driver supports Volume Health Monitoring feature from the node side,
an Event will be reported on every Pod using the PVC when an abnormal volume
condition is detected on a CSI volume. In addition, Volume Health information
is exposed as Kubelet VolumeStats metrics. A new metric kubelet_volume_stats_health_status_abnormal
is added. This metric includes two labels: `namespace` and `persistentvolumeclaim`.
The count is either 1 or 0. 1 indicates the volume is unhealthy, 0 indicates volume
is healthy. For more information, please check
[KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1432-volume-health-monitor#kubelet-metrics-changes).
-->
外部健康監測{{< glossary_tooltip text="控制器" term_id="controller" >}}也會監測節點失效事件。
如果要啓動節點失效監測功能，你可以設置標誌 `enable-node-watcher` 爲 `true`。
當外部健康監測器檢測到節點失效事件，控制器會報送一個事件，該事件會在 PVC 上繼續上報，
以表明使用此 PVC 的 Pod 正位於一個失效的節點上。

如果 CSI 驅動程序支持節點側的卷健康檢測，那當在 CSI 捲上檢測到異常卷時，
會在使用該 PVC 的每個 Pod 上觸發一個事件。
此外，卷運行狀況信息作爲 Kubelet VolumeStats 指標公開。
添加了一個新的指標 kubelet_volume_stats_health_status_abnormal。
該指標包括兩個標籤：`namespace` 和 `persistentvolumeclaim`。
計數爲 1 或 0。1 表示卷不正常，0 表示卷正常。更多信息請訪問
[KEP](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1432-volume-health-monitor#kubelet-metrics-changes)。

<!--
You need to enable the `CSIVolumeHealth` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
to use this feature from the node side.
-->
{{< note >}}
你需要啓用 `CSIVolumeHealth`
[特性門控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
才能在節點上使用此特性。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
See the [CSI driver documentation](https://kubernetes-csi.github.io/docs/drivers.html)
to find out which CSI drivers have implemented this feature.
-->
參閱 [CSI 驅動程序文檔](https://kubernetes-csi.github.io/docs/drivers.html)，
可以找出有哪些 CSI 驅動程序實現了此特性。
