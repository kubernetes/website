---
min-kubernetes-server-version: v1.33
title: 重新配置 Kubernetes 默认的 Service CIDR
content_type: task
---
<!--
reviewers:
- thockin
- dwinship
min-kubernetes-server-version: v1.33
title: Kubernetes Default Service CIDR Reconfiguration
content_type: task
-->

<!-- overview -->
{{< feature-state feature_gate_name="MultiCIDRServiceAllocator" >}}

<!--
This document shares how to reconfigure the default Service IP range(s) assigned
to a cluster.
-->
本文介绍如何重新配置集群中分配的默认 Service IP 范围。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}

<!-- steps -->

<!--
## Kubernetes Default Service CIDR Reconfiguration

This document explains how to manage the Service IP address range within a
Kubernetes cluster, which also influences the cluster's supported IP families
for Services.
-->
## 重新配置 Kubernetes 默认 Service CIDR   {#kubernetes-default-service-cidr-reconfiguration}

本文解释了如何管理 Kubernetes 集群中的 Service IP 地址范围，这也会影响集群针对不同 Service 所支持的 IP 协议族。

<!--
The IP families available for Service ClusterIPs are determined by the
`--service-cluster-ip-range` flag to kube-apiserver. For a better understanding of Service IP address allocation, refer to the
[Services IP address allocation tracking](https://kubernetes.io/docs/reference/networking/virtual-ips/#ip-address-objects) documentation.
-->
可用于 Service ClusterIP 的 IP 协议族由传递给 kube-apiserver 的 `--service-cluster-ip-range`
参数决定。要更好地了解 Service IP 地址分配，请参考
[Service IP 地址分配追踪](/zh-cn/docs/reference/networking/virtual-ips/#ip-address-objects)文档。

<!--
Since Kubernetes 1.33, the Service IP families configured for the cluster are
reflected by the `ServiceCIDR` object named `kubernetes`. The `kubernetes` `ServiceCIDR`
object is created by the first kube-apiserver instance that starts, based on its
configured `--service-cluster-ip-range` flag. To ensure consistent cluster behavior, all kube-apiserver instances must be configured with the same `--service-cluster-ip-range` values, which must match the default kubernetes ServiceCIDR object.
-->
自 Kubernetes 1.33 起，为集群所配置的 Service IP 协议族会通过名为 `kubernetes` 的 `ServiceCIDR` 对象反映。
这个 `kubernetes` `ServiceCIDR` 对象由依据其配置的 `--service-cluster-ip-range`
参数所启动的第一个 kube-apiserver 实例创建。为了确保集群行为一致，所有 kube-apiserver 实例必须使用相同的
`--service-cluster-ip-range` 配置，其取值需与默认的 kubernetes ServiceCIDR 对象保持一致。

<!--
### Kubernetes Service CIDR Reconfiguration Categories

We can categorize Service CIDR reconfiguration into the following scenarios:
-->
### Kubernetes Service CIDR 重新配置类别   {#kubernetes-service-cidr-reconfiguration-categories}

我们可以将 Service CIDR 的重新配置分为以下几种情形：

<!--
* **Extending the existing Service CIDRs:** This can be done dynamically by
    adding new ServiceCIDR objects without the need of reconfiguration of the
    kube-apiserver. Please refer to the dedicated documentation on
    [Extending Service IP
    Ranges](https://kubernetes.io/docs/tasks/network/extend-service-ip-ranges/).
-->
* **扩展现有的 Service CIDR：**
  这可以通过添加新的 ServiceCIDR 对象动态完成，无需重新配置 kube-apiserver。
  请参考[扩展 Service IP 范围](/zh-cn/docs/tasks/network/extend-service-ip-ranges/)的专门文档。

<!--
* **Single-to-dual-stack conversion preserving the primary service CIDR:** This
    involves introducing a secondary IP family (IPv6 to an IPv4-only cluster, or
    IPv4 to an IPv6-only cluster) while keeping the original IP family as
    primary. This requires an update to the kube-apiserver configuration and a
    corresponding modification of various cluster components that need to handle
    this additional IP family. These components include, but are not limited to,
    kube-proxy, the CNI or network plugin, service mesh implementations, and DNS
    services.
-->
* **保留主 Service CIDR 的单栈到双栈转换：**
  这意味着引入次要 IP 协议族（IPv6 到仅 IPv4 集群，或 IPv4 到仅 IPv6 集群），
  同时保留原 IP 协议族作为主协议族。
  这需要更新 kube-apiserver 配置，并相应修改需要处理这个附加 IP 协议族的各个集群组件。
  这些组件包括但不限于 kube-proxy、CNI 或网络插件、服务网格实现和 DNS 服务。

<!--
* **Dual-to-single conversion preserving the primary service CIDR:** This
    involves removing the secondary IP family from a dual-stack cluster,
    reverting to a single IP family while retaining the original primary IP
    family. In addition to the reconfiguration of the components to match the
    new IP family, you might need to address Services that were explicitly
    configured to use the removed IP family.
-->
* **保留主 Service CIDR 的双栈到单栈转换：**
  这意味着从双栈集群中移除次要 IP 协议族，恢复为单一 IP 协议族，同时保留原主 IP 协议族。
  除了重新配置这些组件以匹配新的 IP 协议族外，你还可能需要处理那些显式使用被移除 IP 协议族的 Service。

<!--
* **Anything that results in changing the primary service CIDR:** Completely
  replacing the default ServiceCIDR is a complex operation. If the new
  ServiceCIDR does not overlap with the existing one, [it will require
  renumbering all existing Services and changing the `kubernetes.default`
  service](#Illustrative Reconfiguration Steps). The case where the primary IP
  family also changes is even more complicated, and may require to change
  multiple cluster components (kubelet, network plugins, etc.) to match the new
  primary IP family.
-->
* **变更主 Service CIDR 的任何情形：**
  完全替换默认 ServiceCIDR 是一项复杂的操作。如果新旧 ServiceCIDR 不重叠，
  [则需要重新编号所有现有 Service 并更改 `kubernetes.default` Service](#illustrative-reconfiguration-steps)。
  如果主 IP 协议族也发生变化，则更为复杂，可能需要修改多个集群组件（如 kubelet、网络插件等）以匹配新的主 IP 协议族。

<!--
### Manual Operations for Replacing the Default Service CIDR

Reconfiguring the default Service CIDR necessitates manual steps performed by
the cluster operator, administrator, or the software managing the cluster
lifecycle. These typically include:
-->
### 替换默认 Service CIDR 的手动操作   {#manual-operations-for-replacing-the-default-service-cidr}

重新配置默认 Service CIDR 需要集群运维人员、管理员或管理集群生命周期的软件执行一系列手动步骤。
这些通常包括：

<!--
1.  **Updating** the kube-apiserver configuration: Modify the
    `--service-cluster-ip-range` flag with the new IP range(s).
-->
1. **更新** kube-apiserver 配置：
   使用新的 IP 范围修改 `--service-cluster-ip-range` 参数。
<!--
2.  **Reconfiguring** the network components: This is a critical step and the
    specific procedure depends on the different networking components in use. It
    might involve updating configuration files, restarting agent pods, or
    updating the components to manage the new Service CIDR(s) and the desired IP
    family configuration for Pods. Typical components can be the implementation
    of Kubernetes Services, such as kube-proxy, and the configured networking
    plugin, and potentially other networking components like service mesh
    controllers and DNS servers, to ensure they can correctly handle traffic and
    perform service discovery with the new IP family configuration.
-->
2. **重新配置**网络组件：这一步至关重要，具体步骤取决于正在使用的联网组件。
   这可能包括更新配置文件、重启代理 Pod，或更新组件以处理新的 Service CIDR 和期望的 Pod IP 协议族配置。
   典型组件可以是 Kubernetes Service（例如 kube-proxy）的实现、
   所配置的网络插件以及服务网格控制器和 DNS 服务器等潜在的其他联网组件，
   以确保它们能够正确处理流量并使用新的 IP 协议族配置来执行服务发现。
<!--
3.  **Managing existing Services:** Services with IPs from the old CIDR need to
    be addressed if they are not within the new configured ranges. Options
    include recreation (leading to downtime and new IP assignments) or
    potentially more complex reconfiguration strategies.
4.  **Recreating internal Kubernetes services:** The `kubernetes.default`
    service must be deleted and recreated to obtain an IP address from the new
    Service CIDR if the primary IP family is changed or replaced by a different
    network.
-->
3. **管理现有 Service：**
   如果某些 Service 所使用的 IP 不在新配置的范围内，则需处理这些服务。
   你可以选择重新创建（会造成停机并重新分配 IP），或者采取更复杂的重新配置策略。
4. **重新创建 Kubernetes 内部服务：**
   如果主 IP 协议族发生变化，或者被替换为另一个不同的网络，
   则必须删除并重新创建 `kubernetes.default` Service，以便从新的 Service CIDR 获取 IP 地址。

<!--
### Illustrative Reconfiguration Steps

The following steps describe a controlled reconfiguration focusing on the
completely replacement of the default Service CIDR and the recreation of the
`kubernetes.default` Service:
-->
### 示例重新配置步骤   {#illustrative-reconfiguration-steps}

以下步骤描述了受控的重新配置过程，重点是完全替换默认 Service CIDR 并重新创建 `kubernetes.default` Service：

<!--
1.  Start the kube-apiserver with the initial `--service-cluster-ip-range`.
2.  Create initial Services that obtain IPs from this range.
3.  Introduce a new Service CIDR as a temporary target for reconfiguration.
4.  Mark the `kubernetes` default Service CIDR for deletion (it will remain
    pending due to existing IPs and finalizers). This prevents new allocations
    from the old range.
-->
1. 使用初始的 `--service-cluster-ip-range` 启动 kube-apiserver。
2. 创建初始 Service，使其从该范围获取 IP。
3. 引入新的 Service CIDR，作为重新配置的临时目标。
4. 将默认的 `kubernetes` Service CIDR 标记为删除（由于存在 IP 和 Finalizer，会处于 Pending 状态）。
   这将阻止从旧的范围分配新的 IP。
<!--
5.  Recreate existing Services. They should now be allocated IPs from the new,
    temporary Service CIDR.
6.  Restart the kube-apiserver with the new Service CIDR(s) configured and shut
    down the old instance.
7.  Delete the `kubernetes.default` service. The new kube-apiserver will
    recreate it within the new Service CIDR.
-->
5. 重新创建现有 Service。这些 Service 应从新的临时 Service CIDR 分配 IP。
6. 使用配置的新 Service CIDR 重新启动 kube-apiserver，并关闭旧实例。
7. 删除 `kubernetes.default` Service。新的 kube-apiserver 将在新的
   Service CIDR 范围内重新创建此 Service。

## {{% heading "whatsnext" %}}

<!--
* **Kubernetes Networking Concepts:**
  [https://kubernetes.io/docs/concepts/cluster-administration/networking/](https://kubernetes.io/docs/concepts/cluster-administration/networking/)
* **Kubernetes Dual-Stack Services:**
  [https://kubernetes.io/docs/concepts/services-networking/dual-stack/](https://kubernetes.io/docs/concepts/services-networking/dual-stack/)
* **Extending Kubernetes Service IP Ranges:**
  [https://kubernetes.io/docs/tasks/network/extend-service-ip-ranges/](https://kubernetes.io/docs/tasks/network/extend-service-ip-ranges/)
-->
* [Kubernetes 联网概念](/zh-cn/docs/concepts/cluster-administration/networking/)
* [Kubernetes 双栈服务](/zh-cn/docs/concepts/services-networking/dual-stack/)
* [扩展 Kubernetes Service IP 范围](/zh-cn/docs/tasks/network/extend-service-ip-ranges/)
