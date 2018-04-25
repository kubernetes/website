---
cn-approvers:
- lichuqiang
title: Feature Gates
---
<!--
---
title: Feature Gates
---
-->

{% capture overview %}
<!--
This page contains an overview of the various feature gates an administrator
can specify on different Kubernetes components.
-->
本文包含了管理员可以在不同的 Kubernetes 组件上指定的各种 feature gate 的综述。
{% endcapture %}

{% capture body %}

<!--
## Overview

Feature gates are a set of key=value pairs that describe alpha or experimental
features.
An administrator can use the `--feature-gates` command line flag on each component
to turn a feature on or off.
The following table is a summary of the feature gates that you can set on
different Kubernetes components.
-->
## 综述
Feature gate 是一组描述 alpha 或试验性特性的键值对。
管理员可以在每个组件上使用 `--feature-gates` 命令行标记来开启或关闭一个特性。


<!--
- The "Since" column contains the Kubernetes release when a feature is introduced
  or its release stage is changed.
- The "Until" column, if not empty, contains the last Kubernetes release in which
  you can still use a feature gate.
-->
- “起始” 列包含了一个特性被引入，或其发布阶段发生变化的 Kubernetes 版本。
- “直到” 列（如果不为空的话）包含可以使用 feature gate（来控制该特性）的最后一个 Kubernetes 版本。

<!--
| Feature | Default | Stage | Since | Until |
|---------|---------|-------|-------|-------|
| `Accelerators` | `false` | Alpha | 1.6 | |
| `AdvancedAuditing` | `false` | Alpha | 1.7 | |
| `AdvancedAuditing` | `true` | Beta | 1.8 | |
| `AffinityInAnnotations` | `false` | Alpha | 1.6 | 1.7 |
| `AllowExtTrafficLocalEndpoints` | `false` | Beta | 1.4 | 1.6 |
| `AllowExtTrafficLocalEndpoints` | `true` | GA | 1.7 | |
| `APIListChunking` | `false` | Alpha | 1.8 | 1.8 |
| `APIListChunking` | `true` | Beta | 1.9 | |
| `APIResponseCompression` | `false` | Alpha | 1.7 | |
| `AppArmor` | `true` | Beta | 1.4 | |
| `BlockVolume` | `false` | Alpha | 1.9 | |
| `CPUManager` | `false` | Alpha | 1.8 | 1.9 |
| `CPUManager` | `true` | Beta | 1.10 | |
| `CSIPersistentVolume` | `false` | Alpha | 1.9 | |
| `CustomPodDNS` | `false` | Alpha | 1.9 | |
| `CustomResourceValidation` | `false` | Alpha | 1.8 | 1.8 |
| `CustomResourceValidation` | `true` | Beta | 1.9 | |
| `DevicePlugins` | `false` | Alpha | 1.8 | |
| `DynamicKubeletConfig` | `false` | Alpha | 1.4 | |
| `DynamicVolumeProvisioning` | `true` | Alpha | 1.3 | 1.7 |
| `DynamicVolumeProvisioning` | `true` | GA | 1.8 | |
| `EnableEquivalenceClassCache` | `false` | Alpha | 1.8 | |
| `ExpandPersistentVolumes` | `false` | Alpha | 1.8 | 1.8 |
| `ExperimentalCriticalPodAnnotation` | `false` | Alpha | 1.5 | |
| `ExperimentalHostUserNamespaceDefaulting` | `false` | Beta | 1.5 | |
| `HugePages` | `false` | Alpha | 1.8 | |
| `Initializers` | `false` | Alpha | 1.7 | |
| `KubeletConfigFile` | `false` | Alpha | 1.8 | |
| `LocalStorageCapacityIsolation` | `false` | Alpha | 1.7 | |
| `MountContainers` | `false` | Alpha | 1.9 | |
| `MountPropagation` | `false` | Alpha | 1.8 | |
| `PersistentLocalVolumes` | `false` | Alpha | 1.7 | |
| `PodPriority` | `false` | Alpha | 1.8 | |
| `PVCProtection` | `false` | Alpha | 1.9 | |
| `ResourceLimitsPriorityFunction` | `false` | Alpha | 1.9 | |
| `RotateKubeletClientCertificate` | `true` | Beta | 1.7 | |
| `RotateKubeletServerCertificate` | `false` | Alpha | 1.7 | |
| `ServiceNodeExclusion` | `false` | Alpha | 1.8 | |
| `StreamingProxyRedirects` | `true` | Beta | 1.5 | |
| `SupportIPVSProxyMode` | `false` | Alpha | 1.8 | |
| `TaintBasedEvictions` | `false` | Alpha | 1.6 | |
| `TaintNodesByCondition` | `false` | Alpha | 1.8 | |
| `VolumeScheduling` | `false` | Alpha | 1.9 | |
-->
| 特性 | 默认值 | 阶段 | 起始 | 直到 |
|---------|---------|-------|-------|-------|
| `Accelerators` | `false` | Alpha | 1.6 | |
| `AdvancedAuditing` | `false` | Alpha | 1.7 | |
| `AdvancedAuditing` | `true` | Beta | 1.8 | |
| `AffinityInAnnotations` | `false` | Alpha | 1.6 | 1.7 |
| `AllowExtTrafficLocalEndpoints` | `false` | Beta | 1.4 | 1.6 |
| `AllowExtTrafficLocalEndpoints` | `true` | GA | 1.7 | |
| `APIListChunking` | `false` | Alpha | 1.8 | 1.8 |
| `APIListChunking` | `true` | Beta | 1.9 | |
| `APIResponseCompression` | `false` | Alpha | 1.7 | |
| `AppArmor` | `true` | Beta | 1.4 | |
| `BlockVolume` | `false` | Alpha | 1.9 | |
| `CPUManager` | `false` | Alpha | 1.8 | 1.9 |
| `CPUManager` | `true` | Beta | 1.10 | |
| `CSIPersistentVolume` | `false` | Alpha | 1.9 | |
| `CustomPodDNS` | `false` | Alpha | 1.9 | |
| `CustomResourceValidation` | `false` | Alpha | 1.8 | 1.8 |
| `CustomResourceValidation` | `true` | Beta | 1.9 | |
| `DevicePlugins` | `false` | Alpha | 1.8 | |
| `DynamicKubeletConfig` | `false` | Alpha | 1.4 | |
| `DynamicVolumeProvisioning` | `true` | Alpha | 1.3 | 1.7 |
| `DynamicVolumeProvisioning` | `true` | GA | 1.8 | |
| `EnableEquivalenceClassCache` | `false` | Alpha | 1.8 | |
| `ExpandPersistentVolumes` | `false` | Alpha | 1.8 | 1.8 |
| `ExperimentalCriticalPodAnnotation` | `false` | Alpha | 1.5 | |
| `ExperimentalHostUserNamespaceDefaulting` | `false` | Beta | 1.5 | |
| `HugePages` | `false` | Alpha | 1.8 | |
| `Initializers` | `false` | Alpha | 1.7 | |
| `KubeletConfigFile` | `false` | Alpha | 1.8 | |
| `LocalStorageCapacityIsolation` | `false` | Alpha | 1.7 | |
| `MountContainers` | `false` | Alpha | 1.9 | |
| `MountPropagation` | `false` | Alpha | 1.8 | |
| `PersistentLocalVolumes` | `false` | Alpha | 1.7 | |
| `PodPriority` | `false` | Alpha | 1.8 | |
| `PVCProtection` | `false` | Alpha | 1.9 | |
| `ResourceLimitsPriorityFunction` | `false` | Alpha | 1.9 | |
| `RotateKubeletClientCertificate` | `true` | Beta | 1.7 | |
| `RotateKubeletServerCertificate` | `false` | Alpha | 1.7 | |
| `ServiceNodeExclusion` | `false` | Alpha | 1.8 | |
| `StreamingProxyRedirects` | `true` | Beta | 1.5 | |
| `SupportIPVSProxyMode` | `false` | Alpha | 1.8 | |
| `TaintBasedEvictions` | `false` | Alpha | 1.6 | |
| `TaintNodesByCondition` | `false` | Alpha | 1.8 | |
| `VolumeScheduling` | `false` | Alpha | 1.9 | |

<!--
## Using a Feature
-->
## 使用一个特性

<!--
### Feature Stages

A feature can be in *Alpha*, *Beta* or *GA* stage.
An *Alpha* feature means:
-->
### 特性阶段

一个特性可能处于 *Alpha*、 *Beta* 或 *GA* 阶段。
*Alpha* 特性意味着：

<!--
* Disabled by default.
* Might be buggy. Enabling the feature may expose bugs.
* Support for feature may be dropped at any time without notice.
* The API may change in incompatible ways in a later software release without notice.
* Recommended for use only in short-lived testing clusters, due to increased
  risk of bugs and lack of long-term support.
-->
* 默认禁用。
* 可能是有缺陷的，启用特性可能会暴露缺陷。
* 随时可能在不通知的情况下移除对特性的支持。
* API 可能在后续版本中在不通知的情况下以不兼容的方式改变。
* 由于增加缺陷的风险和缺少长期支持，建议只用于短期测试集群。

<!--
A *Beta* feature means:
-->
*Beta* 特性意味着：

<!--
* Enabled by default.
* The feature is well tested. Enabling the feature is considered safe.
* Support for the overall feature will not be dropped, though details may change.
* The schema and/or semantics of objects may change in incompatible ways in a
  subsequent beta or stable release. When this happens, we will provide instructions
  for migrating to the next version. This may require deleting, editing, and
  re-creating API objects. The editing process may require some thought.
  This may require downtime for applications that rely on the feature.
* Recommended for only non-business-critical uses because of potential for
  incompatible changes in subsequent releases. If you have multiple clusters
  that can be upgraded independently, you may be able to relax this restriction.
-->
* 默认禁用。
* 特性经过了很好的测试。 启用该特性被认为是安全的。
* 对整体特性的支持不会被移除，尽管细节可能会变化。
* 对象的模式和/或语义可能会在随后的 beta 或稳定版本中以不兼容的方式变化。
  这种情况发生时，我们会提供迁移到下个版本的说明。 这可能需要删除、编辑和重建 API 对象。
  编辑过程可能需要一些思考。 这可能需要暂停那些依赖该特性的应用。
* 由于后续版本中可能的不兼容更改，建议只用于非关键业务。 如果有多个可以独立升级的集群，
  那么您可以放宽这一限制。

<!--
**Note:** Please do try *Beta* features and give feedback on them!
After they exit beta, it may not be practical for us to make more changes.
{: .note}
-->
**注意：** 请尝试 *Beta* 特性并给出反馈！
当它们退出 beta 阶段后，我们不太可能再做出更多改变。
{: .note}

<!--
A *GA* feature is also referred to as a *stable* feature. It means:
-->
*GA* 特性也被称为 *稳定* 特性。 它意味着：

<!--
* The corresponding feature gate is no longer needed.
* Stable versions of features will appear in released software for many subsequent versions.
-->
* 不再需要相应的 feature gate。
* 问题版本的特性会出现在随后很多版本的发布软件中。

<!--
### Feature Gates

Each feature gate is designed for enabling/disabling a specific feature:
-->
### Feature Gates

每个 feature gate 都是为启用/禁用特定特性而设计的：

<!--
- `Accelerators`: Enable Nvidia GPU support when using Docker
-->
- `Accelerators`: 在使用 Docker 时启用 Nvidia GPU 支持
<!--
- `AdvancedAuditing`: Enable [advanced auditing](/docs/tasks/debug-application-cluster/audit/#advanced-audit)
-->
- `AdvancedAuditing`: 启用 [高级审计](/docs/tasks/debug-application-cluster/audit/#advanced-audit)
<!--
- `AffinityInAnnotations`(*deprecated*): Enable setting [Pod affinity or anti-affinitys](/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity).
-->
- `AffinityInAnnotations`(*弃用*): 允许设置 [Pod 亲和性或反亲和性](/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity)。
<!--
- `AllowExtTrafficLocalEndpoints`: Enable a service to route external requests to node local endpoints.
-->
- `AllowExtTrafficLocalEndpoints`: 允许服务将外部请求路由到节点本地端点。
<!--
- `APIListChunking`: Enable the API clients to retrieve (`LIST` or `GET`) resources from API server in chunks.
-->
- `APIListChunking`: 允许 API 客户端从 API 服务器以块的形式检索（`LIST` 或 `GET`）资源。
<!--
- `APIResponseCompression`: Compress the API responses for `LIST` or `GET` requests.
-->
- `APIResponseCompression`: 压缩 `LIST` 或 `GET` 请求的 API 响应。
<!--
- `AppArmor`: Enable AppArmor based mandatory access control on Linux nodes when using Docker.
   See [AppArmor Tutorial](/docs/tutorials/clusters/apparmor/) for more details.
-->
- `AppArmor`: 在使用 Docker 时在 Linux 节点上启用基于 AppArmor 的强制访问控制。
   查看 [AppArmor 辅导](/docs/tutorials/clusters/apparmor/) 了解更多详情。
<!--
- `BlockVolume`: Enable the definition and consumption of raw block devices in Pods.
   See [Raw Block Volume Support](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support)
   for more details.
-->
- `BlockVolume`: 允许在 Pod 中定义和消费原始块设备。
   查看 [原始块卷支持](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support) 了解更多详情。
<!--
- `CPUManager`: Enable container level CPU affinity support, see [CPU Management Policies](/docs/tasks/administer-cluster/cpu-management-policies/).
-->
- `CPUManager`: 启用容器级别 CPU 亲和性支持，查看 [CPU 管理器策略](/docs/tasks/administer-cluster/cpu-management-policies/)。

<!--
- `CSIPersistentVolume`: Enable discovering and mounting volumes provisioned through a
  [CSI (Container Storage Interface)](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md)
  compatible volume plugin.
  Check the [`csi` volume type](/docs/concepts/storage/volumes/#csi) documentation for more details.
-->
- `CSIPersistentVolume`: 允许发现并挂载通过兼容
  [CSI（容器存储接口）](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md)
  的卷插件提供的卷。
  查看 [`csi` 卷类型](/docs/concepts/storage/volumes/#csi) 文档了解更多详情。
<!--
- `CustomPodDNS`: Enable customizing the DNS settings for a Pod using its `dnsConfig` property.
   Check [Pod's DNS Config](/docs/concepts/services-networking/dns-pod-service/#pods-dns-config)
   for more details.
-->
- `CustomPodDNS`: 允许使用 `dnsConfig` 属性为 Pod 定制 DNS 设置。
   查看 [Pod 的 DNS 配置](/docs/concepts/services-networking/dns-pod-service/#pods-dns-config) 了解更多详情。
<!--
- `CustomeResourceValidation`: Enable schema based validation on resources created from [CustomResourceDefinition](/docs/concepts/api-extension/custom-resources/).
-->
- `CustomeResourceValidation`: 对创建自 [CustomResourceDefinition](/docs/concepts/api-extension/custom-resources/)
   的资源，启用基于模式（schema）的校验。
<!--
- `DevicePlugins`: Enable the [device-plugins](/docs/concepts/cluster-administration/device-plugins/)
  based resource provisioning on nodes.
-->
- `DevicePlugins`: 在节点上启用基于 [device-plugins](/docs/concepts/cluster-administration/device-plugins/)
  的资源供应。
<!--
- `DynamicKubeletConfig`: Enable the dynamic configuration of kubelet. See [Reconfigure kubelet](/docs/tasks/administer-cluster/reconfigure-kubelet/).
-->
- `DynamicKubeletConfig`: 启用 kubelet 动态配置。 查看 [重新配置 kubelet](/docs/tasks/administer-cluster/reconfigure-kubelet/)。
<!--
- `DynamicVolumeProvisioning`(*deprecated*): Enable the [dynamic provisioning](/docs/concepts/storage/dynamic-provisioning/) of persistent volumes to Pods.
-->
- `DynamicVolumeProvisioning`(*弃用*): 启用 Pod 的 persistent volume 的 [动态供应](/docs/concepts/storage/dynamic-provisioning/)。
<!--
- `EnableEquivalenceClassCache`: Enable the scheduler to cache equivalence of nodes when scheduling Pods.
-->
- `EnableEquivalenceClassCache`: 允许调度器在调度 Pod 时缓存节点的等价信息。
<!--
- `ExpandPersistentVolumes`: Enable the expanding of persistent volumes. See [Expanding Persistent Volumes Claims](/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims).
-->
- `ExpandPersistentVolumes`: 允许扩展 persistent volume。 查看 [扩展 Persistent Volumes Claims](/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims)。
<!--
- `ExperimentalCriticalPodAnnotation`: Enable annotating specific pods as *critical* so that their [scheduling is guaranteed](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/).
-->
- `ExperimentalCriticalPodAnnotation`: 允许将特定 pod 注解为 *critical*，
  以使得它们的 [调度得到保证](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/)。
<!--
- `ExperimentalHostUserNamespaceDefaultingGate`: Enabling the defaulting user
   namespace to host. This is for containers that are using other host namespaces,
   host mounts, or containers that are privileged or using specific non-namespaced
   capabilities (e.g. `MKNODE`, `SYS_MODULE` etc.). This should only be enabled
   if user namespace remapping is enabled in the Docker daemon.
-->
- `ExperimentalHostUserNamespaceDefaultingGate`: 启用主机的默认用户名字空间。
  该特性是针对那些使用其他主机名字空间的容器、 使用主机挂载的容器、 特权容器或使用特定非名字空间相关功能（如 `MKNODE`、`SYS_MODULE` 等）的容器。 该特性只应在 Docker daemon 中启用了用户名字空间重映射时启用。
<!--
- `HugePages`: Enable the allocation and consumption of pre-allocated [huge pages](/docs/tasks/manage-hugepages/scheduling-hugepages/).
-->
- `HugePages`: 允许分配和消费预先分配的 [huge pages](/docs/tasks/manage-hugepages/scheduling-hugepages/)。
<!--
- `Intializers`: Enable the [dynamic admission control](/docs/admin/extensible-admission-controllers/)
  as an extension to the built-in [admission controllers](/docs/admin/admission-controllers/).
  When the `Initializers` admission controller is enabled, this feature is automatically enabled.
-->
- `Intializers`: 启用 [动态准入控制](/docs/admin/extensible-admission-controllers/)
  作为内置 [准入控制器](/docs/admin/admission-controllers/) 的扩展。
  当 `Initializers` 准入控制器被启用时，该特性自动被启用。
<!--
- `KubeletConfigFile`: Enable loading kubelet configuration from a file specified using a config file.
  See [setting kubelet parameters via a config file](/docs/tasks/administer-cluster/kubelet-config-file/) for more details.
-->
- `KubeletConfigFile`: 允许从配置文件指定的文件加载 kubelet 配置。
  查看 [通过配置文件设置 kubelet 参数](/docs/tasks/administer-cluster/kubelet-config-file/) 了解更多详情。
<!--
- `LocalStorageCapacityIsolation`: Enable the consumption of [local ephemeral storage](/docs/concepts/configuration/manage-compute-resources-container/) and also the `sizeLimit` property of an [emptyDir volume](/docs/concepts/storage/volumes/#emptydir).
-->
- `LocalStorageCapacityIsolation`: 启用 [本地临时存储](/docs/concepts/configuration/manage-compute-resources-container/)
  的消费，以及 [emptyDir 卷](/docs/concepts/storage/volumes/#emptydir) 的 `sizeLimit` 属性。
<!--
- `MountContainers`: Enable using utility containers on host as the volume mounter.
-->
- `MountContainers`: 允许在主机上使用功能性容器作为卷挂载器。
<!--
- `MountPropagation`: Enable sharing volume mounted by one container to other containers or pods.
  For more details, please see [mount propagation](/docs/concepts/storage/volumes/#mount-propagation).
-->
- `MountPropagation`: 允许将一个容器挂载的卷共享给其他的容器或 pod。
  更多详情吗，请查看 [挂载扩展](/docs/concepts/storage/volumes/#mount-propagation)。
<!--
- `PersistentLocalVolumes`: Enable the usage of `local` volume type in Pods.
  Pod affinity has to be specified if requesting a `local` volume.
-->
- `PersistentLocalVolumes`: 允许在 Pod 中使用 `local` 卷类型。
  如果请求使用 `local` 卷，必须指定 Pod 亲和性。
<!--
- `PodPriority`: Enable the descheduling and preemption of Pods based on their [priorities](/docs/concepts/configuration/pod-priority-preemption/).
-->
- `PodPriority`: 允许根据 Pod [优先级](/docs/concepts/configuration/pod-priority-preemption/) 进行重调度和抢占。
<!--
- `PVCProtection`: Enable the prevention of a PersistentVolumeClaim (PVC) from
  being deleted when it is still used by any Pod.
  More details can be found [here](/docs/tasks/administer-cluster/pvc-protection/).
-->
- `PVCProtection`: 当 PersistentVolumeClaim（PVC）被 Pod 所使用时，防止其被删除。
  更多详情可以在 [这里](/docs/tasks/administer-cluster/pvc-protection/) 找到。
<!--
- `ResourceLimitsPriorityFunction`: Enable a scheduler priority function that
  assigns a lowest possible score of 1 to a node that satisfies at least one of
  the input Pod's cpu and memory limits. The intent is to break ties between
  nodes with same scores.
-->
- `ResourceLimitsPriorityFunction`: 启用一个调度器优先权函数，该函数为至少满足输入 Pod 的
  cpu 和内存 limit 其中一项的节点分配一个最低可能为 1 的分数。 目的是为了打破相同分数节点的关系。
<!--
- `RotateKubeletClientCertificate`: Enable the rotation of the client TLS certificate on the kubelet.
  See [kubelet configuration](/docs/admin/kubelet-tls-bootstrapping/#kubelet-configuration) for more details.
-->
- `RotateKubeletClientCertificate`: 启用 kubelet 上的客户端 TLS 证书轮换。
  查看 [kubelet 配置](/docs/admin/kubelet-tls-bootstrapping/#kubelet-configuration) 了解更多详情。
<!--
- `RotateKubeletServerCertificate`: Enable the rotation of the server TLS certificate on the kubelet.
  See [kubelet configuration](/docs/admin/kubelet-tls-bootstrapping/#kubelet-configuration) for more details.
-->
- `RotateKubeletServerCertificate`: 启用 kubelet 上的服务器 TLS 证书轮换。
  查看 [kubelet 配置](/docs/admin/kubelet-tls-bootstrapping/#kubelet-configuration) 了解更多详情。
<!--
- `ServiceNodeExclusion`: Enable the exclusion of nodes from load balancers created by a cloud provider.
  A node is eligible for exclusion if annotated with "`alpha.service-controller.kubernetes.io/exclude-balancer`" key.
-->
- `ServiceNodeExclusion`: 允许将节点从云服务提供商创建的负载均衡器中排除。
  为节点添加 关键字为 “`alpha.service-controller.kubernetes.io/exclude-balancer`” 的注解，可以将节点（从负载均衡器中）排除。
<!--
- `StreamingProxyRedirects`: Instructs the API server to intercept (and follow)
   redirects from the backend (kubelet) for streaming requests.
  Examples of streaming requests include the `exec`, `attach` and `port-forward` requests.
-->
- `StreamingProxyRedirects`: 命令 API 服务器对重定向自后端（kubelet）的流请求进行拦截（并跟踪）。
  流请求的示例包括 `exec`、`attach` 和 `port-forward` 请求。
<!--
- `SupportIPVSProxyMode`: Enable providing in-cluster service load balancing using IPVS.
  See [service proxies](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies) for more details.
-->
- `SupportIPVSProxyMode`: 允许使用 IPVS 提供集群内部服务负载均衡。
  查看 [服务代理](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies) 了解更多详情。

<!--
- `TaintBasedEvictions`: Enable evicting pods from nodes based on taints on nodes and tolerations on Pods.
  See [taints and tolerations](/docs/concepts/configuration/taint-and-toleration/) for more details.
-->
- `TaintBasedEvictions`: 启用根据节点上的 taints 和 Pod 上的 tolerations 自动从节点上驱逐
  pod 的功能。 查看 [taints 和 tolerations](/docs/concepts/configuration/taint-and-toleration/) 了解更多详情。
<!--
- `TaintNodesByCondition`: Enable automatic tainting nodes based on [node conditions](/docs/concepts/architecture/nodes/#condition).
-->
- `TaintNodesByCondition`: 启用基于 [节点状态](/docs/concepts/architecture/nodes/#condition) 自动更新节点 taints 的功能。
<!--
- `VolumeScheduling`: Enable volume topology aware scheduling and make the
  PersistentVolumeClaim (PVC) binding aware of scheduling decisions. It also
  enables the usage of [`local`](/docs/concepts/storage/volumes/#local) volume
  type when used together with the `PersistentLocalVolumes` feature gate.
-->
- `VolumeScheduling`: 启用卷拓扑感知调度，并使 PersistentVolumeClaim（PVC）绑定感知调度决策。
  当与 `PersistentLocalVolumes` feature gate 一起使用时，还会启用
  [`local`](/docs/concepts/storage/volumes/#local) 卷类型。
{% endcapture %}

{% include templates/concept.md %}
