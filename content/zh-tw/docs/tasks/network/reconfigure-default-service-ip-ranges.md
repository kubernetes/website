---
min-kubernetes-server-version: v1.33
title: 重新設定 Kubernetes 預設的 ServiceCIDR
content_type: task
---
<!--
reviewers:
- thockin
- dwinship
min-kubernetes-server-version: v1.33
title: Kubernetes Default ServiceCIDR Reconfiguration
content_type: task
-->

<!-- overview -->
{{< feature-state feature_gate_name="MultiCIDRServiceAllocator" >}}

<!--
This document shares how to reconfigure the default Service IP range(s) assigned
to a cluster.
-->
本文介紹如何重新設定叢集中分配的預設 Service IP 範圍。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}

<!-- steps -->

<!--
## Kubernetes Default ServiceCIDR Reconfiguration

This document explains how to manage the Service IP address range within a
Kubernetes cluster, which also influences the cluster's supported IP families
for Services.
-->
## 重新設定 Kubernetes 預設 ServiceCIDR   {#kubernetes-default-service-cidr-reconfiguration}

本文解釋瞭如何管理 Kubernetes 叢集中的 Service IP 地址範圍，這也會影響叢集針對不同 Service 所支持的 IP 協議族。

<!--
The IP families available for Service ClusterIPs are determined by the
`--service-cluster-ip-range` flag to kube-apiserver. For a better
understanding of Service IP address allocation, refer to the
[Services IP address allocation tracking](/docs/reference/networking/virtual-ips/#ip-address-objects) documentation.
-->
可用於 Service ClusterIP 的 IP 協議族由傳遞給 kube-apiserver 的 `--service-cluster-ip-range`
參數決定。要更好地瞭解 Service IP 地址分配，請參考
[Service IP 地址分配追蹤](/zh-cn/docs/reference/networking/virtual-ips/#ip-address-objects)文檔。

<!--
Since Kubernetes 1.33, the Service IP families configured for the cluster are
reflected by the ServiceCIDR object named `kubernetes`. The `kubernetes` ServiceCIDR
object is created by the first kube-apiserver instance that starts, based on its
configured `--service-cluster-ip-range` flag. To ensure consistent cluster behavior,
all kube-apiserver instances must be configured with the same `--service-cluster-ip-range` values,
which must match the default kubernetes ServiceCIDR object.
-->
自 Kubernetes 1.33 起，爲叢集所設定的 Service IP 協議族會通過名爲 `kubernetes` 的 ServiceCIDR 對象反映。
Kubernetes 的 ServiceCIDR 由第一個啓動的 kube-apiserver 實例根據其 `--service-cluster-ip-range`
參數設定創建。爲了確保叢集行爲一致，所有 kube-apiserver 實例必須使用相同的
`--service-cluster-ip-range` 設定，其取值需與預設的 kubernetes ServiceCIDR 對象保持一致。

<!--
### Kubernetes ServiceCIDR Reconfiguration Categories

We can categorize ServiceCIDR reconfiguration into the following scenarios:
-->
### Kubernetes ServiceCIDR 重新設定類別   {#kubernetes-service-cidr-reconfiguration-categories}

我們可以將 ServiceCIDR 的重新設定分爲以下幾種情形：

<!--
* **Extending the existing ServiceCIDRs:** This can be done dynamically by
  adding new ServiceCIDR objects without the need for reconfiguring the
  kube-apiserver. Please refer to the dedicated documentation on
  [Extending Service IP Ranges](/docs/tasks/network/extend-service-ip-ranges/).
-->
* **擴展現有的 ServiceCIDR：**
  這可以通過添加新的 ServiceCIDR 對象動態完成，無需重新設定 kube-apiserver。
  請參考[擴展 Service IP 範圍](/zh-cn/docs/tasks/network/extend-service-ip-ranges/)的專門文檔。

<!--
* **Single-to-dual-stack conversion preserving the primary ServiceCIDR:** This
  involves introducing a secondary IP family (IPv6 to an IPv4-only cluster, or
  IPv4 to an IPv6-only cluster) while keeping the original IP family as
  primary. This requires an update to the kube-apiserver configuration and a
  corresponding modification of various cluster components that need to handle
  this additional IP family. These components include, but are not limited to,
  kube-proxy, the CNI or network plugin, service mesh implementations, and DNS
  services.
-->
* **保留主 ServiceCIDR 的單棧到雙棧轉換：**
  這意味着引入次要 IP 協議族（IPv6 到僅 IPv4 叢集，或 IPv4 到僅 IPv6 叢集），
  同時保留原 IP 協議族作爲主協議族。
  這需要更新 kube-apiserver 設定，並相應修改需要處理這個附加 IP 協議族的各個叢集組件。
  這些組件包括但不限於 kube-proxy、CNI 或網路插件、服務網格實現和 DNS 服務。

<!--
* **Dual-to-single conversion preserving the primary ServiceCIDR:** This
  involves removing the secondary IP family from a dual-stack cluster,
  reverting to a single IP family while retaining the original primary IP
  family. In addition to reconfiguring the components to match the
  new IP family, you might need to address Services that were explicitly
  configured to use the removed IP family.
-->
* **保留主 ServiceCIDR 的雙棧到單棧轉換：**
  這意味着從雙棧叢集中移除次要 IP 協議族，恢復爲單一 IP 協議族，同時保留原主 IP 協議族。
  除了重新設定這些組件以匹配新的 IP 協議族外，你還可能需要處理那些顯式使用被移除
  IP 協議族的 Service。

<!--
* **Anything that results in changing the primary ServiceCIDR:** Completely
  replacing the default ServiceCIDR is a complex operation. If the new
  ServiceCIDR does not overlap with the existing one, it will require
  [renumbering all existing Services and changing the `kubernetes.default` Service](#illustrative-reconfiguration-steps).
  The case where the primary IP family also changes is even more complicated,
  and may require changing multiple cluster components (kubelet, network plugins, etc.)
  to match the new primary IP family.
-->
* **變更主 ServiceCIDR 的任何情形：**
  完全替換預設 ServiceCIDR 是一項複雜的操作。如果新舊 ServiceCIDR 不重疊，
  [則需要重新編號所有現有 Service 並更改 `kubernetes.default` Service](#illustrative-reconfiguration-steps)。
  如果主 IP 協議族也發生變化，則更爲複雜，可能需要修改多個叢集組件（如 kubelet、網路插件等）
  以匹配新的主 IP 協議族。

<!--
### Manual Operations for Replacing the Default ServiceCIDR

Reconfiguring the default ServiceCIDR necessitates manual steps performed by
the cluster operator, administrator, or the software managing the cluster
lifecycle. These typically include:
-->
### 替換預設 ServiceCIDR 的手動操作   {#manual-operations-for-replacing-the-default-service-cidr}

重新設定預設 ServiceCIDR 需要叢集運維人員、管理員或管理叢集生命週期的軟體執行一系列手動步驟。
這些通常包括：

<!--
1. **Updating** the kube-apiserver configuration: Modify the
   `--service-cluster-ip-range` flag with the new IP range(s).
-->
1. **更新** kube-apiserver 設定：
   使用新的 IP 範圍修改 `--service-cluster-ip-range` 參數。
<!--
1. **Reconfiguring** the network components: This is a critical step and the
   specific procedure depends on the different networking components in use. It
   might involve updating configuration files, restarting agent pods, or
   updating the components to manage the new ServiceCIDR(s) and the desired IP
   family configuration for Pods. Typical components can be the implementation
   of Kubernetes Services, such as kube-proxy, and the configured networking
   plugin, and potentially other networking components like service mesh
   controllers and DNS servers, to ensure they can correctly handle traffic and
   perform service discovery with the new IP family configuration.
-->
2. **重新設定**網路組件：這一步至關重要，具體步驟取決於正在使用的聯網組件。
   這可能包括更新設定檔案、重啓代理 Pod，或更新組件以處理新的 ServiceCIDR 和期望的 Pod IP 協議族設定。
   典型組件可以是 Kubernetes Service（例如 kube-proxy）的實現、
   所設定的網路插件以及服務網格控制器和 DNS 伺服器等潛在的其他聯網組件，
   以確保它們能夠正確處理流量並使用新的 IP 協議族設定來執行服務發現。
<!--
1. **Managing existing Services:** Services with IPs from the old CIDR need to
   be addressed if they are not within the new configured ranges. Options
   include recreation (leading to downtime and new IP assignments) or
   potentially more complex reconfiguration strategies.
1. **Recreating internal Kubernetes services:** The `kubernetes.default`
   Service must be deleted and recreated to obtain an IP address from the new
   ServiceCIDR if the primary IP family is changed or replaced by a different
   network.
-->
3. **管理現有 Service：**
   如果某些 Service 所使用的 IP 不在新設定的範圍內，則需處理這些服務。
   你可以選擇重新創建（會造成停機並重新分配 IP），或者採取更復雜的重新設定策略。
4. **重新創建 Kubernetes 內部服務：**
   如果主 IP 協議族發生變化，或者被替換爲另一個不同的網路，
   則必須刪除並重新創建 `kubernetes.default` Service，以便從新的 Service CIDR 獲取 IP 地址。

<!--
### Illustrative Reconfiguration Steps

The following steps describe a controlled reconfiguration focusing on the
complete replacement of the default ServiceCIDR and the recreation of the
`kubernetes.default` Service:
-->
### 示例重新設定步驟   {#illustrative-reconfiguration-steps}

以下步驟描述了受控的重新設定過程，重點是完全替換預設 ServiceCIDR 並重新創建 `kubernetes.default` Service：

<!--
1. Start the kube-apiserver with the initial `--service-cluster-ip-range`.
1. Create initial Services that obtain IPs from this range.
1. Introduce a new ServiceCIDR as a temporary target for reconfiguration.
1. Mark the `kubernetes` default ServiceCIDR for deletion (it will remain
   pending due to existing IPs and finalizers). This prevents new allocations
   from the old range.
-->
1. 使用初始的 `--service-cluster-ip-range` 啓動 kube-apiserver。
2. 創建初始 Service，使其從該範圍獲取 IP。
3. 引入新的 ServiceCIDR，作爲重新設定的臨時目標。
4. 將預設的 `kubernetes` ServiceCIDR 標記爲刪除（由於存在 IP 和 Finalizer，會處於 Pending 狀態）。
   這將阻止從舊的範圍分配新的 IP。
<!--
1. Recreate existing Services. They should now be allocated IPs from the new,
   temporary ServiceCIDR.
1. Restart the kube-apiserver with the new ServiceCIDR(s) configured and shut
   down the old instance.
1. Delete the `kubernetes.default` Service. The new kube-apiserver will
   recreate it within the new ServiceCIDR.
-->
5. 重新創建現有 Service。這些 Service 應從新的臨時 ServiceCIDR 分配 IP。
6. 使用設定的新 ServiceCIDR 重新啓動 kube-apiserver，並關閉舊實例。
7. 刪除 `kubernetes.default` Service。新的 kube-apiserver 將在新的
   ServiceCIDR 範圍內重新創建此 Service。

## {{% heading "whatsnext" %}}

<!--
* [Kubernetes Networking Concepts](/docs/concepts/cluster-administration/networking/)
* [Kubernetes Dual-Stack Services](/docs/concepts/services-networking/dual-stack/)
* [Extending Kubernetes Service IP Ranges](/docs/tasks/network/extend-service-ip-ranges/)
-->
* [Kubernetes 聯網概念](/zh-cn/docs/concepts/cluster-administration/networking/)
* [Kubernetes 雙棧服務](/zh-cn/docs/concepts/services-networking/dual-stack/)
* [擴展 Kubernetes Service IP 範圍](/zh-cn/docs/tasks/network/extend-service-ip-ranges/)
