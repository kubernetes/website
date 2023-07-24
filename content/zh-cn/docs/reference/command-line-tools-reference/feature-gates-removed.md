---
title: 特性门控（已移除）
weight: 15
content_type: concept
---
<!--
title: Feature Gates (removed)
weight: 15
content_type: concept
-->

<!-- overview -->

<!--
This page contains list of feature gates that have been removed. The information on this page is for reference.
A removed feature gate is different from a GA'ed or deprecated one in that a removed one is
no longer recognized as a valid feature gate.
However, a GA'ed or a deprecated feature gate is still recognized by the corresponding Kubernetes
components although they are unable to cause any behavior differences in a cluster.
-->
本页包含了已移除的特性门控的列表。本页的信息仅供参考。
已移除的特性门控不同于正式发布（GA）或废弃的特性门控，因为已移除的特性门控将不再被视为有效的特性门控。
然而，正式发布或废弃的特性门控仍然能被对应的 Kubernetes 组件识别，这些特性门控在集群中不会造成任何行为差异。

<!--
For feature gates that are still recognized by the Kubernetes components, please refer to
the [Alpha/Beta feature gate table](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features)
or the [Graduated/Deprecated feature gate table](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-graduated-or-deprecated-features)
-->
有关 Kubernetes 组件仍可识别的特性门控，请参阅
[Alpha 和 Beta 状态的特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features)或
[已毕业和已废弃的特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-graduated-or-deprecated-features)。

<!--
### Feature gates that are removed

In the following table:

- The "From" column contains the Kubernetes release when a feature is introduced
  or its release stage is changed.
- The "To" column, if not empty, contains the last Kubernetes release in which
  you can still use a feature gate. If the feature stage is either "Deprecated"
  or "GA", the "To" column is the Kubernetes release when the feature is removed.
-->
### 已移除的特性门控   {#feature-gates-that-are-removed}

在下表中，

- “开始（From）” 列包含了引入某个特性或其发布状态发生变更时的 Kubernetes 版本。
- “结束（To）” 列（如果不为空）包含你仍然可以使用某个特性门控的最后一个 Kubernetes 版本。
  如果对应特性处于 “废弃” 或 “GA” 状态，则 “结束（To）” 列是该特性被移除时的 Kubernetes 版本。

{{< table caption="Feature Gates Removed" >}}

<!--
| Feature | Default | Stage | From | To |
-->
| 特性 | 默认值 | 状态 | 开始（From） | 结束（To） |
|---------|---------|-------|-------|-------|
| `Accelerators` | `false` | Alpha | 1.6 | 1.10 |
| `Accelerators` | - | Deprecated | 1.11 | 1.11 |
| `AffinityInAnnotations` | `false` | Alpha | 1.6 | 1.7 |
| `AffinityInAnnotations` | - | Deprecated | 1.8 | 1.8 |
| `AllowExtTrafficLocalEndpoints` | `false` | Beta | 1.4 | 1.6 |
| `AllowExtTrafficLocalEndpoints` | `true` | GA | 1.7 | 1.9 |
| `AllowInsecureBackendProxy` | `true` | Beta | 1.17 | 1.20 |
| `AllowInsecureBackendProxy` | `true` | GA | 1.21 | 1.25 |
| `AttachVolumeLimit` | `false` | Alpha | 1.11 | 1.11 |
| `AttachVolumeLimit` | `true` | Beta | 1.12 | 1.16 |
| `AttachVolumeLimit` | `true` | GA | 1.17 | 1.21 |
| `BalanceAttachedNodeVolumes` | `false` | Alpha | 1.11 | 1.21 |
| `BalanceAttachedNodeVolumes` | `false` | Deprecated | 1.22 | 1.22 |
| `BlockVolume` | `false` | Alpha | 1.9 | 1.12 |
| `BlockVolume` | `true` | Beta | 1.13 | 1.17 |
| `BlockVolume` | `true` | GA | 1.18 | 1.21 |
| `BoundServiceAccountTokenVolume` | `false` | Alpha | 1.13 | 1.20 |
| `BoundServiceAccountTokenVolume` | `true` | Beta | 1.21 | 1.21 |
| `BoundServiceAccountTokenVolume` | `true` | GA | 1.22 | 1.23 |
| `CRIContainerLogRotation` | `false` | Alpha | 1.10 | 1.10 |
| `CRIContainerLogRotation` | `true` | Beta | 1.11 | 1.20 |
| `CRIContainerLogRotation` | `true` | GA | 1.21 | 1.22 |
| `CSIBlockVolume` | `false` | Alpha | 1.11 | 1.13 |
| `CSIBlockVolume` | `true` | Beta | 1.14 | 1.17 |
| `CSIBlockVolume` | `true` | GA | 1.18 | 1.21 |
| `CSIDriverRegistry` | `false` | Alpha | 1.12 | 1.13 |
| `CSIDriverRegistry` | `true` | Beta | 1.14 | 1.17 |
| `CSIDriverRegistry` | `true` | GA | 1.18 | 1.21 |
| `CSIInlineVolume` | `false` | Alpha | 1.15 | 1.15 |
| `CSIInlineVolume` | `true` | Beta | 1.16 | 1.24 |
| `CSIInlineVolume` | `true` | GA | 1.25 | 1.26 |
| `CSIMigration` | `false` | Alpha | 1.14 | 1.16 |
| `CSIMigration` | `true` | Beta | 1.17 | 1.24 |
| `CSIMigration` | `true` | GA | 1.25 | 1.26 |
| `CSIMigrationAWS` | `false` | Alpha | 1.14 | 1.16 |
| `CSIMigrationAWS` | `false` | Beta | 1.17 | 1.22 |
| `CSIMigrationAWS` | `true` | Beta | 1.23 | 1.24 |
| `CSIMigrationAWS` | `true` | GA | 1.25 | 1.26 |
| `CSIMigrationAWSComplete` | `false` | Alpha | 1.17 | 1.20 |
| `CSIMigrationAWSComplete` | - | Deprecated | 1.21 | 1.21 |
| `CSIMigrationAzureDisk` | `false` | Alpha | 1.15 | 1.18 |
| `CSIMigrationAzureDisk` | `false` | Beta | 1.19 | 1.22 |
| `CSIMigrationAzureDisk` | `true` | Beta | 1.23 | 1.23 |
| `CSIMigrationAzureDisk` | `true` | GA | 1.24 | 1.26 |
| `CSIMigrationAzureDiskComplete` | `false` | Alpha | 1.17 | 1.20 |
| `CSIMigrationAzureDiskComplete` | - | Deprecated | 1.21 | 1.21 |
| `CSIMigrationAzureFileComplete` | `false` | Alpha | 1.17 | 1.20 |
| `CSIMigrationAzureFileComplete` | - | Deprecated |  1.21 | 1.21 |
| `CSIMigrationGCEComplete` | `false` | Alpha | 1.17 | 1.20 |
| `CSIMigrationGCEComplete` | - | Deprecated | 1.21 | 1.21 |
| `CSIMigrationOpenStack` | `false` | Alpha | 1.14 | 1.17 |
| `CSIMigrationOpenStack` | `true` | Beta | 1.18 | 1.23 |
| `CSIMigrationOpenStack` | `true` | GA | 1.24 | 1.25 |
| `CSIMigrationOpenStackComplete` | `false` | Alpha | 1.17 | 1.20 |
| `CSIMigrationOpenStackComplete` | - | Deprecated | 1.21 | 1.21 |
| `CSIMigrationvSphereComplete` | `false` | Beta | 1.19 | 1.21 |
| `CSIMigrationvSphereComplete` | - | Deprecated | 1.22 | 1.22 |
| `CSINodeInfo` | `false` | Alpha | 1.12 | 1.13 |
| `CSINodeInfo` | `true` | Beta | 1.14 | 1.16 |
| `CSINodeInfo` | `true` | GA | 1.17 | 1.22 |
| `CSIPersistentVolume` | `false` | Alpha | 1.9 | 1.9 |
| `CSIPersistentVolume` | `true` | Beta | 1.10 | 1.12 |
| `CSIPersistentVolume` | `true` | GA | 1.13 | 1.16 |
| `CSIServiceAccountToken` | `false` | Alpha | 1.20 | 1.20 |
| `CSIServiceAccountToken` | `true` | Beta | 1.21 | 1.21 |
| `CSIServiceAccountToken` | `true` | GA | 1.22 | 1.24 |
| `CSIVolumeFSGroupPolicy` | `false` | Alpha | 1.19 | 1.19 |
| `CSIVolumeFSGroupPolicy` | `true` | Beta | 1.20 | 1.22 |
| `CSIVolumeFSGroupPolicy` | `true` | GA | 1.23 | 1.25 |
| `CSRDuration` | `true` | Beta | 1.22 | 1.23 |
| `CSRDuration` | `true` | GA | 1.24 | 1.25 |
| `ConfigurableFSGroupPolicy` | `false` | Alpha | 1.18 | 1.19 |
| `ConfigurableFSGroupPolicy` | `true` | Beta | 1.20 | 1.22 |
| `ConfigurableFSGroupPolicy` | `true` | GA | 1.23 | 1.25 |
| `ControllerManagerLeaderMigration` | `false` | Alpha | 1.21 | 1.21 |
| `ControllerManagerLeaderMigration` | `true` | Beta | 1.22 | 1.23 |
| `ControllerManagerLeaderMigration` | `true` | GA | 1.24 | 1.26 |
| `CronJobControllerV2` | `false` | Alpha | 1.20 | 1.20 |
| `CronJobControllerV2` | `true` | Beta | 1.21 | 1.21 |
| `CronJobControllerV2` | `true` | GA | 1.22 | 1.23 |
| `CustomPodDNS` | `false` | Alpha | 1.9 | 1.9 |
| `CustomPodDNS` | `true` | Beta| 1.10 | 1.13 |
| `CustomPodDNS` | `true` | GA | 1.14 | 1.16 |
| `CustomResourceDefaulting` | `false` | Alpha| 1.15 | 1.15 |
| `CustomResourceDefaulting` | `true` | Beta | 1.16 | 1.16 |
| `CustomResourceDefaulting` | `true` | GA | 1.17 | 1.18 |
| `CustomResourcePublishOpenAPI` | `false` | Alpha| 1.14 | 1.14 |
| `CustomResourcePublishOpenAPI` | `true` | Beta| 1.15 | 1.15 |
| `CustomResourcePublishOpenAPI` | `true` | GA | 1.16 | 1.18 |
| `CustomResourceSubresources` | `false` | Alpha | 1.10 | 1.10 |
| `CustomResourceSubresources` | `true` | Beta | 1.11 | 1.15 |
| `CustomResourceSubresources` | `true` | GA | 1.16 | 1.18 |
| `CustomResourceValidation` | `false` | Alpha | 1.8 | 1.8 |
| `CustomResourceValidation` | `true` | Beta | 1.9 | 1.15 |
| `CustomResourceValidation` | `true` | GA | 1.16 | 1.18 |
| `CustomResourceWebhookConversion` | `false` | Alpha | 1.13 | 1.14 |
| `CustomResourceWebhookConversion` | `true` | Beta | 1.15 | 1.15 |
| `CustomResourceWebhookConversion` | `true` | GA | 1.16 | 1.18 |
| `DaemonSetUpdateSurge` | `false` | Alpha | 1.21 | 1.21 |
| `DaemonSetUpdateSurge` | `true` | Beta | 1.22 | 1.24 |
| `DaemonSetUpdateSurge` | `true` | GA | 1.25 | 1.26 |
| `DefaultPodTopologySpread` | `false` | Alpha | 1.19 | 1.19 |
| `DefaultPodTopologySpread` | `true` | Beta | 1.20 | 1.23 |
| `DefaultPodTopologySpread` | `true` | GA | 1.24 | 1.25 |
| `DynamicAuditing` | `false` | Alpha | 1.13 | 1.18 |
| `DynamicAuditing` | - | Deprecated | 1.19 | 1.19 |
| `DynamicKubeletConfig` | `false` | Alpha | 1.4 | 1.10 |
| `DynamicKubeletConfig` | `true` | Beta | 1.11 | 1.21 |
| `DynamicKubeletConfig` | `false` | Deprecated | 1.22 | 1.25 |
| `DynamicProvisioningScheduling` | `false` | Alpha | 1.11 | 1.11 |
| `DynamicProvisioningScheduling` | - | Deprecated| 1.12 | - |
| `DynamicVolumeProvisioning` | `true` | Alpha | 1.3 | 1.7 |
| `DynamicVolumeProvisioning` | `true` | GA | 1.8 | 1.12 |
| `EnableAggregatedDiscoveryTimeout` | `true` | Deprecated | 1.16 | 1.17 |
| `EnableEquivalenceClassCache` | `false` | Alpha | 1.8 | 1.12 |
| `EnableEquivalenceClassCache` | - | Deprecated | 1.13 | 1.23 |
| `EndpointSlice` | `false` | Alpha | 1.16 | 1.16 |
| `EndpointSlice` | `false` | Beta | 1.17 | 1.17 |
| `EndpointSlice` | `true` | Beta | 1.18 | 1.20 |
| `EndpointSlice` | `true` | GA | 1.21 | 1.24 |
| `EndpointSliceNodeName` | `false` | Alpha | 1.20 | 1.20 |
| `EndpointSliceNodeName` | `true` | GA | 1.21 | 1.24 |
| `EndpointSliceProxying` | `false` | Alpha | 1.18 | 1.18 |
| `EndpointSliceProxying` | `true` | Beta | 1.19 | 1.21 |
| `EndpointSliceProxying` | `true` | GA | 1.22 | 1.24 |
| `EphemeralContainers` | `false` | Alpha | 1.16 | 1.22 |
| `EphemeralContainers` | `true` | Beta | 1.23 | 1.24 |
| `EphemeralContainers` | `true` | GA | 1.25 | 1.26 |
| `EvenPodsSpread` | `false` | Alpha | 1.16 | 1.17 |
| `EvenPodsSpread` | `true` | Beta | 1.18 | 1.18 |
| `EvenPodsSpread` | `true` | GA | 1.19 | 1.21 |
| `ExpandCSIVolumes` | `false` | Alpha | 1.14 | 1.15 |
| `ExpandCSIVolumes` | `true` | Beta | 1.16 | 1.23 |
| `ExpandCSIVolumes` | `true` | GA | 1.24 | 1.26 |
| `ExpandInUsePersistentVolumes` | `false` | Alpha | 1.11 | 1.14 |
| `ExpandInUsePersistentVolumes` | `true` | Beta | 1.15 | 1.23 |
| `ExpandInUsePersistentVolumes` | `true` | GA | 1.24 | 1.26 |
| `ExpandPersistentVolumes` | `false` | Alpha | 1.8 | 1.10 |
| `ExpandPersistentVolumes` | `true` | Beta | 1.11 | 1.23 |
| `ExpandPersistentVolumes` | `true` | GA | 1.24 | 1.26 |
| `ExperimentalCriticalPodAnnotation` | `false` | Alpha | 1.5 | 1.12 |
| `ExperimentalCriticalPodAnnotation` | `false` | Deprecated | 1.13 | 1.16 |
| `ExternalPolicyForExternalIP` | `true` | GA | 1.18 | 1.22 |
| `GCERegionalPersistentDisk` | `true` | Beta | 1.10 | 1.12 |
| `GCERegionalPersistentDisk` | `true` | GA | 1.13 | 1.16 |
| `GenericEphemeralVolume` | `false` | Alpha | 1.19 | 1.20 |
| `GenericEphemeralVolume` | `true` | Beta | 1.21 | 1.22 |
| `GenericEphemeralVolume` | `true` | GA | 1.23 | 1.24 |
| `HugePageStorageMediumSize` | `false` | Alpha | 1.18 | 1.18 |
| `HugePageStorageMediumSize` | `true` | Beta | 1.19 | 1.21 |
| `HugePageStorageMediumSize` | `true` | GA | 1.22 | 1.24 |
| `HugePages` | `false` | Alpha | 1.8 | 1.9 |
| `HugePages` | `true` | Beta| 1.10 | 1.13 |
| `HugePages` | `true` | GA | 1.14 | 1.16 |
| `HyperVContainer` | `false` | Alpha | 1.10 | 1.19 |
| `HyperVContainer` | `false` | Deprecated | 1.20 | 1.20 |
| `IPv6DualStack` | `false` | Alpha | 1.15 | 1.20 |
| `IPv6DualStack` | `true` | Beta | 1.21 | 1.22 |
| `IPv6DualStack` | `true` | GA | 1.23 | 1.24 |
| `IdentifyPodOS` | `false` | Alpha | 1.23 | 1.23 |
| `IdentifyPodOS` | `true` | Beta | 1.24 | 1.24 |
| `IdentifyPodOS` | `true` | GA | 1.25 | 1.26 |
| `ImmutableEphemeralVolumes` | `false` | Alpha | 1.18 | 1.18 |
| `ImmutableEphemeralVolumes` | `true` | Beta | 1.19 | 1.20 |
| `ImmutableEphemeralVolumes` | `true` | GA | 1.21 | 1.24 |
| `IndexedJob` | `false` | Alpha | 1.21 | 1.21 |
| `IndexedJob` | `true` | Beta | 1.22 | 1.23 |
| `IndexedJob` | `true` | GA | 1.24 | 1.25 |
| `IngressClassNamespacedParams` | `false` | Alpha | 1.21 | 1.21 |
| `IngressClassNamespacedParams` | `true` | Beta | 1.22 | 1.22 |
| `IngressClassNamespacedParams` | `true` | GA | 1.23 | 1.24 |
| `Initializers` | `false` | Alpha | 1.7 | 1.13 |
| `Initializers` | - | Deprecated | 1.14 | 1.14 |
| `KubeletConfigFile` | `false` | Alpha | 1.8 | 1.9 |
| `KubeletConfigFile` | - | Deprecated | 1.10 | 1.10 |
| `KubeletPluginsWatcher` | `false` | Alpha | 1.11 | 1.11 |
| `KubeletPluginsWatcher` | `true` | Beta | 1.12 | 1.12 |
| `KubeletPluginsWatcher` | `true` | GA | 1.13 | 1.16 |
| `LegacyNodeRoleBehavior` | `false` | Alpha | 1.16 | 1.18 |
| `LegacyNodeRoleBehavior` | `true` | Beta | 1.19 | 1.20 |
| `LegacyNodeRoleBehavior` | `false` | GA | 1.21 | 1.22 |
| `LocalStorageCapacityIsolation` | `false` | Alpha | 1.7 | 1.9 |
| `LocalStorageCapacityIsolation` | `true` | Beta | 1.10 | 1.24 |
| `LocalStorageCapacityIsolation` | `true` | GA | 1.25 | 1.26 |
| `MountContainers` | `false` | Alpha | 1.9 | 1.16 |
| `MountContainers` | `false` | Deprecated | 1.17 | 1.17 |
| `MountPropagation` | `false` | Alpha | 1.8 | 1.9 |
| `MountPropagation` | `true` | Beta | 1.10 | 1.11 |
| `MountPropagation` | `true` | GA | 1.12 | 1.14 |
| `NamespaceDefaultLabelName` | `true` | Beta | 1.21 | 1.21 |
| `NamespaceDefaultLabelName` | `true` | GA | 1.22 | 1.23 |
| `NetworkPolicyEndPort` | `false` | Alpha | 1.21 | 1.21 |
| `NetworkPolicyEndPort` | `true` | Beta | 1.22 | 1.24 |
| `NetworkPolicyEndPort` | `true` | GA | 1.25 | 1.26 |
| `NodeDisruptionExclusion` | `false` | Alpha | 1.16 | 1.18 |
| `NodeDisruptionExclusion` | `true` | Beta | 1.19 | 1.20 |
| `NodeDisruptionExclusion` | `true` | GA | 1.21 | 1.22 |
| `NodeLease` | `false` | Alpha | 1.12 | 1.13 |
| `NodeLease` | `true` | Beta | 1.14 | 1.16 |
| `NodeLease` | `true` | GA | 1.17 | 1.23 |
| `NonPreemptingPriority` | `false` | Alpha | 1.15 | 1.18 |
| `NonPreemptingPriority` | `true` | Beta | 1.19 | 1.23 |
| `NonPreemptingPriority` | `true` | GA | 1.24 | 1.25 |
| `PVCProtection` | `false` | Alpha | 1.9 | 1.9 |
| `PVCProtection` | - | Deprecated | 1.10 | 1.10 |
| `PersistentLocalVolumes` | `false` | Alpha | 1.7 | 1.9 |
| `PersistentLocalVolumes` | `true` | Beta | 1.10 | 1.13 |
| `PersistentLocalVolumes` | `true` | GA | 1.14 | 1.16 |
| `PodAffinityNamespaceSelector` | `false` | Alpha | 1.21 | 1.21 |
| `PodAffinityNamespaceSelector` | `true` | Beta | 1.22 | 1.23 |
| `PodAffinityNamespaceSelector` | `true` | GA | 1.24 | 1.25 |
| `PodDisruptionBudget` | `false` | Alpha | 1.3 | 1.4 |
| `PodDisruptionBudget` | `true` | Beta | 1.5 | 1.20 |
| `PodDisruptionBudget` | `true` | GA | 1.21 | 1.25 |
| `PodOverhead` | `false` | Alpha | 1.16 | 1.17 |
| `PodOverhead` | `true` | Beta | 1.18 | 1.23 |
| `PodOverhead` | `true` | GA | 1.24 | 1.25 |
| `PodPriority` | `false` | Alpha | 1.8 | 1.10 |
| `PodPriority` | `true` | Beta | 1.11 | 1.13 |
| `PodPriority` | `true` | GA | 1.14 | 1.18 |
| `PodReadinessGates` | `false` | Alpha | 1.11 | 1.11 |
| `PodReadinessGates` | `true` | Beta | 1.12 | 1.13 |
| `PodReadinessGates` | `true` | GA | 1.14 | 1.16 |
| `PodShareProcessNamespace` | `false` | Alpha | 1.10 | 1.11 |
| `PodShareProcessNamespace` | `true` | Beta | 1.12 | 1.16 |
| `PodShareProcessNamespace` | `true` | GA | 1.17 | 1.19 |
| `PreferNominatedNode` | `false` | Alpha | 1.21 | 1.21 |
| `PreferNominatedNode` | `true` | Beta | 1.22 | 1.23 |
| `PreferNominatedNode` | `true` | GA | 1.24 | 1.25 |
| `RequestManagement` | `false` | Alpha | 1.15 | 1.16 |
| `RequestManagement` | - | Deprecated | 1.17 | 1.17 |
| `ResourceLimitsPriorityFunction` | `false` | Alpha | 1.9 | 1.18 |
| `ResourceLimitsPriorityFunction` | - | Deprecated | 1.19 | 1.19 |
| `ResourceQuotaScopeSelectors` | `false` | Alpha | 1.11 | 1.11 |
| `ResourceQuotaScopeSelectors` | `true` | Beta | 1.12 | 1.16 |
| `ResourceQuotaScopeSelectors` | `true` | GA | 1.17 | 1.18 |
| `RootCAConfigMap` | `false` | Alpha | 1.13 | 1.19 |
| `RootCAConfigMap` | `true` | Beta | 1.20 | 1.20 |
| `RootCAConfigMap` | `true` | GA | 1.21 | 1.22 |
| `RotateKubeletClientCertificate` | `true` | Beta | 1.8 | 1.18 |
| `RotateKubeletClientCertificate` | `true` | GA | 1.19 | 1.21 |
| `RunAsGroup` | `true` | Beta | 1.14 | 1.20 |
| `RunAsGroup` | `true` | GA | 1.21 | 1.22 |
| `RuntimeClass` | `false` | Alpha | 1.12 | 1.13 |
| `RuntimeClass` | `true` | Beta | 1.14 | 1.19 |
| `RuntimeClass` | `true` | GA | 1.20 | 1.24 |
| `SCTPSupport` | `false` | Alpha | 1.12 | 1.18 |
| `SCTPSupport` | `true` | Beta | 1.19 | 1.19 |
| `SCTPSupport` | `true` | GA | 1.20 | 1.22 |
| `ScheduleDaemonSetPods` | `false` | Alpha | 1.11 | 1.11 |
| `ScheduleDaemonSetPods` | `true` | Beta | 1.12 | 1.16  |
| `ScheduleDaemonSetPods` | `true` | GA | 1.17 | 1.18 |
| `SelectorIndex` | `false` | Alpha | 1.18 | 1.18 |
| `SelectorIndex` | `true` | Beta | 1.19 | 1.19 |
| `SelectorIndex` | `true` | GA | 1.20 | 1.25 |
| `ServiceAccountIssuerDiscovery` | `false` | Alpha | 1.18 | 1.19 |
| `ServiceAccountIssuerDiscovery` | `true` | Beta | 1.20 | 1.20 |
| `ServiceAccountIssuerDiscovery` | `true` | GA | 1.21 | 1.23 |
| `ServiceAppProtocol` | `false` | Alpha | 1.18 | 1.18 |
| `ServiceAppProtocol` | `true` | Beta | 1.19 | 1.19 |
| `ServiceAppProtocol` | `true` | GA | 1.20 | 1.22 |
| `ServiceLBNodePortControl` | `false` | Alpha | 1.20 | 1.21 |
| `ServiceLBNodePortControl` | `true` | Beta | 1.22 | 1.23 |
| `ServiceLBNodePortControl` | `true` | GA | 1.24 | 1.25 |
| `ServiceLoadBalancerClass` | `false` | Alpha | 1.21 | 1.21 |
| `ServiceLoadBalancerClass` | `true` | Beta | 1.22 | 1.23 |
| `ServiceLoadBalancerClass` | `true` | GA | 1.24 | 1.25 |
| `ServiceLoadBalancerFinalizer` | `false` | Alpha | 1.15 | 1.15 |
| `ServiceLoadBalancerFinalizer` | `true` | Beta | 1.16 | 1.16 |
| `ServiceLoadBalancerFinalizer` | `true` | GA | 1.17 | 1.20 |
| `ServiceNodeExclusion` | `false` | Alpha | 1.8 | 1.18 |
| `ServiceNodeExclusion` | `true` | Beta | 1.19 | 1.20 |
| `ServiceNodeExclusion` | `true` | GA | 1.21 | 1.22 |
| `ServiceTopology` | `false` | Alpha | 1.17 | 1.19 |
| `ServiceTopology` | `false` | Deprecated | 1.20 | 1.22 |
| `SetHostnameAsFQDN` | `false` | Alpha | 1.19 | 1.19 |
| `SetHostnameAsFQDN` | `true` | Beta | 1.20 | 1.21 |
| `SetHostnameAsFQDN` | `true` | GA | 1.22 | 1,24 |
| `StartupProbe` | `false` | Alpha | 1.16 | 1.17 |
| `StartupProbe` | `true` | Beta | 1.18 | 1.19 |
| `StartupProbe` | `true` | GA | 1.20 | 1.23 |
| `StatefulSetMinReadySeconds` | `false` | Alpha | 1.22 | 1.22 |
| `StatefulSetMinReadySeconds` | `true` | Beta | 1.23 | 1.24 |
| `StatefulSetMinReadySeconds` | `true` | GA | 1.25 | 1.26 |
| `StorageObjectInUseProtection` | `true` | Beta | 1.10 | 1.10 |
| `StorageObjectInUseProtection` | `true` | GA | 1.11 | 1.24 |
| `StreamingProxyRedirects` | `false` | Beta | 1.5 | 1.5 |
| `StreamingProxyRedirects` | `true` | Beta | 1.6 | 1.17 |
| `StreamingProxyRedirects` | `true` | Deprecated | 1.18 | 1.21 |
| `StreamingProxyRedirects` | `false` | Deprecated | 1.22 | 1.24 |
| `SupportIPVSProxyMode` | `false` | Alpha | 1.8 | 1.8 |
| `SupportIPVSProxyMode` | `false` | Beta | 1.9 | 1.9 |
| `SupportIPVSProxyMode` | `true` | Beta | 1.10 | 1.10 |
| `SupportIPVSProxyMode` | `true` | GA | 1.11 | 1.20 |
| `SupportNodePidsLimit` | `false` | Alpha | 1.14 | 1.14 |
| `SupportNodePidsLimit` | `true` | Beta | 1.15 | 1.19 |
| `SupportNodePidsLimit` | `true` | GA | 1.20 | 1.23 |
| `SupportPodPidsLimit` | `false` | Alpha | 1.10 | 1.13 |
| `SupportPodPidsLimit` | `true` | Beta | 1.14 | 1.19 |
| `SupportPodPidsLimit` | `true` | GA | 1.20 | 1.23 |
| `SuspendJob` | `false` | Alpha | 1.21 | 1.21 |
| `SuspendJob` | `true` | Beta | 1.22 | 1.23 |
| `SuspendJob` | `true` | GA | 1.24 | 1.25 |
| `Sysctls` | `true` | Beta | 1.11 | 1.20 |
| `Sysctls` | `true` | GA | 1.21 | 1.22 |
| `TTLAfterFinished` | `false` | Alpha | 1.12 | 1.20 |
| `TTLAfterFinished` | `true` | Beta | 1.21 | 1.22 |
| `TTLAfterFinished` | `true` | GA | 1.23 | 1.24 |
| `TaintBasedEvictions` | `false` | Alpha | 1.6 | 1.12 |
| `TaintBasedEvictions` | `true` | Beta | 1.13 | 1.17 |
| `TaintBasedEvictions` | `true` | GA | 1.18 | 1.20 |
| `TaintNodesByCondition` | `false` | Alpha | 1.8 | 1.11 |
| `TaintNodesByCondition` | `true` | Beta | 1.12 | 1.16 |
| `TaintNodesByCondition` | `true` | GA | 1.17 | 1.18 |
| `TokenRequest` | `false` | Alpha | 1.10 | 1.11 |
| `TokenRequest` | `true` | Beta | 1.12 | 1.19 |
| `TokenRequest` | `true` | GA | 1.20 | 1.21 |
| `TokenRequestProjection` | `false` | Alpha | 1.11 | 1.11 |
| `TokenRequestProjection` | `true` | Beta | 1.12 | 1.19 |
| `TokenRequestProjection` | `true` | GA | 1.20 | 1.21 |
| `ValidateProxyRedirects` | `false` | Alpha | 1.12 | 1.13 |
| `ValidateProxyRedirects` | `true` | Beta | 1.14 | 1.21 |
| `ValidateProxyRedirects` | `true` | Deprecated | 1.22 | 1.24 |
| `VolumePVCDataSource` | `false` | Alpha | 1.15 | 1.15 |
| `VolumePVCDataSource` | `true` | Beta | 1.16 | 1.17 |
| `VolumePVCDataSource` | `true` | GA | 1.18 | 1.21 |
| `VolumeScheduling` | `false` | Alpha | 1.9 | 1.9 |
| `VolumeScheduling` | `true` | Beta | 1.10 | 1.12 |
| `VolumeScheduling` | `true` | GA | 1.13 | 1.16 |
| `VolumeSnapshotDataSource` | `false` | Alpha | 1.12 | 1.16 |
| `VolumeSnapshotDataSource` | `true` | Beta | 1.17 | 1.19 |
| `VolumeSnapshotDataSource` | `true` | GA | 1.20 | 1.22 |
| `VolumeSubpath` | `true` | GA | 1.10 | 1.24 |
| `VolumeSubpathEnvExpansion` | `false` | Alpha | 1.14 | 1.14 |
| `VolumeSubpathEnvExpansion` | `true` | Beta | 1.15 | 1.16 |
| `VolumeSubpathEnvExpansion` | `true` | GA | 1.17 | 1.24 |
| `WarningHeaders` | `true` | Beta | 1.19 | 1.21 |
| `WarningHeaders` | `true` | GA | 1.22 | 1.24 |
| `WindowsEndpointSliceProxying` | `false` | Alpha | 1.19 | 1.20 |
| `WindowsEndpointSliceProxying` | `true` | Beta | 1.21 | 1.21 |
| `WindowsEndpointSliceProxying` | `true` | GA | 1.22| 1.24 |
| `WindowsGMSA` | `false` | Alpha | 1.14 | 1.15 |
| `WindowsGMSA` | `true` | Beta | 1.16 | 1.17 |
| `WindowsGMSA` | `true` | GA | 1.18 | 1.20 |
| `WindowsRunAsUserName` | `false` | Alpha | 1.16 | 1.16 |
| `WindowsRunAsUserName` | `true` | Beta | 1.17 | 1.17 |
| `WindowsRunAsUserName` | `true` | GA | 1.18 | 1.20 |
{{< /table >}}

<!--
## Descriptions for removed feature gates
-->
## 已移除的特性门控的说明   {#description-for-removed-feature-gates}

<!--
- `Accelerators`: Provided an early form of plugin to enable Nvidia GPU support when using
  Docker Engine; no longer available. See
  [Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) for
  an alternative.

- `AffinityInAnnotations`: Enable setting
  [Pod affinity or anti-affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity).

- `AllowExtTrafficLocalEndpoints`: Enable a service to route external requests to node local endpoints.

- `AllowInsecureBackendProxy`: Enable the users to skip TLS verification of
  kubelets on Pod log requests.
-->
- `Accelerators`：使用 Docker Engine 时启用 Nvidia GPU 支持。这一特性不再提供。
  关于替代方案，请参阅[设备插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)。

- `AffinityInAnnotations`：启用 [Pod 亲和或反亲和](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)。

- `AllowExtTrafficLocalEndpoints`：启用服务用于将外部请求路由到节点本地终端。

- `AllowInsecureBackendProxy`：允许用户在请求 Pod 日志时跳过 kubelet 的 TLS 验证。

<!--
- `AttachVolumeLimit`: Enable volume plugins to report limits on number of volumes
  that can be attached to a node.
  See [dynamic volume limits](/docs/concepts/storage/storage-limits/#dynamic-volume-limits)
  for more details.

- `BalanceAttachedNodeVolumes`: Include volume count on node to be considered for
  balanced resource allocation while scheduling. A node which has closer CPU,
  memory utilization, and volume count is favored by the scheduler while making decisions.

- `BlockVolume`: Enable the definition and consumption of raw block devices in Pods.
  See [Raw Block Volume Support](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support)
  for more details.
-->
- `AttachVolumeLimit`：启用卷插件用于报告可连接到节点的卷数限制。有关更多详细信息，
  请参阅[动态卷限制](/zh-cn/docs/concepts/storage/storage-limits/#dynamic-volume-limits)。

- `BalanceAttachedNodeVolumes`：在进行平衡资源分配的调度时，考虑节点上的卷数。
  调度器在决策时会优先考虑 CPU、内存利用率和卷数更近的节点。

- `BlockVolume`：在 Pod 中启用原始块设备的定义和使用。有关更多详细信息，
  请参见[原始块卷支持](/zh-cn/docs/concepts/storage/persistent-volumes/#raw-block-volume-support)。

<!--
- `BoundServiceAccountTokenVolume`: Migrate ServiceAccount volumes to use a projected volume
  consisting of a ServiceAccountTokenVolumeProjection. Cluster admins can use metric
  `serviceaccount_stale_tokens_total` to monitor workloads that are depending on the extended
  tokens. If there are no such workloads, turn off extended tokens by starting `kube-apiserver` with
  flag `--service-account-extend-token-expiration=false`.
  Check [Bound Service Account Tokens](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md)
  for more details.
-->
- `BoundServiceAccountTokenVolume`：迁移 ServiceAccount 卷以使用由
  ServiceAccountTokenVolumeProjection 组成的投射卷。集群管理员可以使用
  `serviceaccount_stale_tokens_total` 度量值来监控依赖于扩展令牌的负载。
  如果没有这种类型的负载，你可以在启动 `kube-apiserver` 时添加
  `--service-account-extend-token-expiration=false` 参数关闭扩展令牌。
  查看[绑定服务账号令牌](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md)获取更多详细信息。

<!--
- `CRIContainerLogRotation`: Enable container log rotation for CRI container runtime.
  The default max size of a log file is 10MB and the default max number of
  log files allowed for a container is 5.
  These values can be configured in the kubelet config.
  See [logging at node level](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)
  for more details.
-->
- `CRIContainerLogRotation`：为 CRI 容器运行时启用容器日志轮换。日志文件的默认最大大小为
  10MB，缺省情况下，一个容器允许的最大日志文件数为 5。这些值可以在 kubelet 配置中配置。
  更多细节请参见[日志架构](/zh-cn/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)。

<!--
- `CSIBlockVolume`: Enable external CSI volume drivers to support block storage.
  See [`csi` raw block volume support](/docs/concepts/storage/volumes/#csi-raw-block-volume-support)
  for more details.

- `CSIDriverRegistry`: Enable all logic related to the CSIDriver API object in
  `csi.storage.k8s.io`.
-->
- `CSIBlockVolume`：启用外部 CSI 卷驱动程序用于支持块存储。有关更多详细信息，请参见
  [`csi` 原始块卷支持](/zh-cn/docs/concepts/storage/volumes/#csi-raw-block-volume-support)。

- `CSIDriverRegistry`：在 csi.storage.k8s.io 中启用与 CSIDriver API 对象有关的所有逻辑。

<!--
- `CSIInlineVolume`: Enable CSI Inline volumes support for pods.

- `CSIMigration`: Enables shims and translation logic to route volume
  operations from in-tree plugins to corresponding pre-installed CSI plugins

- `CSIMigrationAWS`: Enables shims and translation logic to route volume
  operations from the AWS-EBS in-tree plugin to EBS CSI plugin. Supports
  falling back to in-tree EBS plugin for mount operations to nodes that have
  the feature disabled or that do not have EBS CSI plugin installed and
  configured. Does not support falling back for provision operations, for those
  the CSI plugin must be installed and configured.
-->
- `CSIInlineVolume`：为 Pod 启用 CSI 内联卷支持。

- `CSIMigration`：确保封装和转换逻辑能够将卷操作从内嵌插件路由到相应的预安装 CSI 插件。

- `CSIMigrationAWS`：确保填充和转换逻辑能够将卷操作从 AWS-EBS 内嵌插件路由到 EBS CSI 插件。
  如果节点禁用了此特性门控或者未安装和配置 EBS CSI 插件，支持回退到内嵌 EBS 插件来执行卷挂载操作。
  不支持回退到这些插件来执行卷制备操作，因为需要安装并配置 CSI 插件

<!--
- `CSIMigrationAWSComplete`: Stops registering the EBS in-tree plugin in
  kubelet and volume controllers and enables shims and translation logic to
  route volume operations from the AWS-EBS in-tree plugin to EBS CSI plugin.
  Requires CSIMigration and CSIMigrationAWS feature flags enabled and EBS CSI
  plugin installed and configured on all nodes in the cluster. This flag has
  been deprecated in favor of the `InTreePluginAWSUnregister` feature flag
  which prevents the registration of in-tree EBS plugin.
-->
- `CSIMigrationAWSComplete`：停止在 kubelet 和卷控制器中注册 EBS 内嵌插件，
  并启用填充和转换逻辑将卷操作从 AWS-EBS 内嵌插件路由到 EBS CSI 插件。
  这需要启用 CSIMigration 和 CSIMigrationAWS 特性标志，并在集群中的所有节点上安装和配置
  EBS CSI 插件。该特性标志已被废弃，取而代之的是 `InTreePluginAWSUnregister`，
  后者会阻止注册 EBS 内嵌插件。

<!--
- `CSIMigrationAzureDisk`: Enables shims and translation logic to route volume
  operations from the Azure-Disk in-tree plugin to AzureDisk CSI plugin.
  Supports falling back to in-tree AzureDisk plugin for mount operations to
  nodes that have the feature disabled or that do not have AzureDisk CSI plugin
  installed and configured. Does not support falling back for provision
  operations, for those the CSI plugin must be installed and configured.
  Requires CSIMigration feature flag enabled.
-->
- `CSIMigrationAzureDisk`：确保填充和转换逻辑能够将卷操作从 AzureDisk 内嵌插件路由到
  Azure 磁盘 CSI 插件。对于禁用了此特性的节点或者没有安装并配置 AzureDisk CSI
  插件的节点，支持回退到内嵌（in-tree）AzureDisk 插件来执行磁盘挂载操作。
  不支持回退到内嵌插件来执行磁盘制备操作，因为对应的 CSI 插件必须已安装且正确配置。
  此特性需要启用 CSIMigration 特性标志。

<!--
- `CSIMigrationAzureDiskComplete`: Stops registering the Azure-Disk in-tree
  plugin in kubelet and volume controllers and enables shims and translation
  logic to route volume operations from the Azure-Disk in-tree plugin to
  AzureDisk CSI plugin. Requires CSIMigration and CSIMigrationAzureDisk feature
  flags enabled and AzureDisk CSI plugin installed and configured on all nodes
  in the cluster. This flag has been deprecated in favor of the
  `InTreePluginAzureDiskUnregister` feature flag which prevents the registration
  of in-tree AzureDisk plugin.
-->
- `CSIMigrationAzureDiskComplete`：停止在 kubelet 和卷控制器中注册 Azure 磁盘内嵌插件，
  并启用 shims 和转换逻辑以将卷操作从 Azure 磁盘内嵌插件路由到 AzureDisk CSI 插件。
  这需要启用 CSIMigration 和 CSIMigrationAzureDisk 特性标志，
  并在集群中的所有节点上安装和配置 AzureDisk CSI 插件。该特性标志已被废弃，
  取而代之的是能防止注册内嵌 AzureDisk 插件的 `InTreePluginAzureDiskUnregister` 特性标志。

<!--
- `CSIMigrationAzureFileComplete`: Stops registering the Azure-File in-tree
  plugin in kubelet and volume controllers and enables shims and translation
  logic to route volume operations from the Azure-File in-tree plugin to
  AzureFile CSI plugin. Requires CSIMigration and CSIMigrationAzureFile feature
  flags  enabled and AzureFile CSI plugin installed and configured on all nodes
  in the cluster. This flag has been deprecated in favor of the
  `InTreePluginAzureFileUnregister` feature flag which prevents the registration
   of in-tree AzureFile plugin.
-->
- `CSIMigrationAzureFileComplete`：停止在 kubelet 和卷控制器中注册 Azure-File 内嵌插件，
  并启用 shims 和转换逻辑以将卷操作从 Azure-File 内嵌插件路由到 AzureFile CSI 插件。
  这需要启用 CSIMigration 和 CSIMigrationAzureFile 特性标志，
  并在集群中的所有节点上安装和配置 AzureFile CSI 插件。该特性标志已被废弃，
  取而代之的是能防止注册内嵌 AzureDisk 插件的 `InTreePluginAzureFileUnregister` 特性标志。

<!--
- `CSIMigrationGCEComplete`: Stops registering the GCE-PD in-tree plugin in
  kubelet and volume controllers and enables shims and translation logic to
  route volume operations from the GCE-PD in-tree plugin to PD CSI plugin.
  Requires CSIMigration and CSIMigrationGCE feature flags enabled and PD CSI
  plugin installed and configured on all nodes in the cluster. This flag has
  been deprecated in favor of the `InTreePluginGCEUnregister` feature flag which
  prevents the registration of in-tree GCE PD plugin.

- `CSIMigrationOpenStack`: Enables shims and translation logic to route volume
  operations from the Cinder in-tree plugin to Cinder CSI plugin. Supports
  falling back to in-tree Cinder plugin for mount operations to nodes that have
  the feature disabled or that do not have Cinder CSI plugin installed and
  configured. Does not support falling back for provision operations, for those
  the CSI plugin must be installed and configured. Requires CSIMigration
  feature flag enabled.
-->
- `CSIMigrationOpenStack`：确保填充和转换逻辑能够将卷操作从 Cinder 内嵌插件路由到
  Cinder CSI 插件。对于禁用了此特性的节点或者没有安装并配置 Cinder CSI 插件的节点，
  支持回退到内嵌（in-tree）Cinder 插件来执行挂载操作。
  不支持回退到内嵌插件来执行制备操作，因为对应的 CSI 插件必须已安装且正确配置。
  此磁特性需要启用 CSIMigration 特性标志。

- `CSIMigrationOpenStack`：启用垫片和转换逻辑以将卷操作从 Cinder in-tree
   插件路由到 Cinder CSI 插件。支持回退到树内 Cinder 插件，
   以便对禁用该功能或未安装和配置 Cinder CSI 插件的节点进行挂载操作。
   不支持回退供应操作，对于那些必须安装和配置 CSI 插件。需要启用 CSIMigration 功能标志。

<!--
- `CSIMigrationOpenStackComplete`: Stops registering the Cinder in-tree plugin in
  kubelet and volume controllers and enables shims and translation logic to route
  volume operations from the Cinder in-tree plugin to Cinder CSI plugin.
  Requires CSIMigration and CSIMigrationOpenStack feature flags enabled and Cinder
  CSI plugin installed and configured on all nodes in the cluster. This flag has
  been deprecated in favor of the `InTreePluginOpenStackUnregister` feature flag
  which prevents the registration of in-tree openstack cinder plugin.
-->
- `CSIMigrationOpenStackComplete`：停止在 kubelet 和卷控制器中注册 Cinder 内嵌插件，
  并启用填充和转换逻辑将卷操作从 Cinder 内嵌插件路由到 Cinder CSI 插件。
  这需要启用 CSIMigration 和 CSIMigrationOpenStack 特性标志，并在集群中的所有节点上安装和配置
  Cinder CSI 插件。该特性标志已被弃用，取而代之的是能防止注册内嵌 OpenStack Cinder 插件的
  `InTreePluginOpenStackUnregister` 特性标志。

<!--
- `CSIMigrationvSphereComplete`: Stops registering the vSphere in-tree plugin in kubelet
  and volume controllers and enables shims and translation logic to route volume operations
  from the vSphere in-tree plugin to vSphere CSI plugin. Requires CSIMigration and
  CSIMigrationvSphere feature flags enabled and vSphere CSI plugin installed and
  configured on all nodes in the cluster. This flag has been deprecated in favor
  of the `InTreePluginvSphereUnregister` feature flag which prevents the
  registration of in-tree vsphere plugin.
-->
- `CSIMigrationvSphereComplete`：停止在 kubelet 和卷控制器中注册 vSphere 内嵌插件，
  并启用填充和转换逻辑以将卷操作从 vSphere 内嵌插件路由到 vSphere CSI 插件。
  这需要启用 CSIMigration 和 CSIMigrationvSphere 特性标志，并在集群中的所有节点上安装和配置
  vSphere CSI 插件。该特性标志已被废弃，取而代之的是能防止注册内嵌 vSphere 插件的
  `InTreePluginvSphereUnregister` 特性标志。

<!--
- `CSINodeInfo`: Enable all logic related to the CSINodeInfo API object in `csi.storage.k8s.io`.

- `CSIPersistentVolume`: Enable discovering and mounting volumes provisioned through a
  [CSI (Container Storage Interface)](https://git.k8s.io/design-proposals-archive/storage/container-storage-interface.md)
  compatible volume plugin.

- `CSIServiceAccountToken`: Enable CSI drivers to receive the pods' service account token
  that they mount volumes for. See
  [Token Requests](https://kubernetes-csi.github.io/docs/token-requests.html).
-->
- `CSINodeInfo`：在 `csi.storage.k8s.io` 中启用与 CSINodeInfo API 对象有关的所有逻辑。

- `CSIPersistentVolume`：启用发现和挂载通过
  [CSI（容器存储接口）](https://git.k8s.io/design-proposals-archive/storage/container-storage-interface.md)
  兼容卷插件配置的卷。

- `CSIServiceAccountToken`：允许 CSI 驱动接收挂载卷目标 Pods 的服务账号令牌。
  参阅[令牌请求（Token Requests）](https://kubernetes-csi.github.io/docs/token-requests.html)。

<!--
- `CSIVolumeFSGroupPolicy`: Allows CSIDrivers to use the `fsGroupPolicy` field.
  This field controls whether volumes created by a CSIDriver support volume ownership
  and permission modifications when these volumes are mounted.

- `CSRDuration`: Allows clients to request a duration for certificates issued
  via the Kubernetes CSR API.

- `ConfigurableFSGroupPolicy`: Allows user to configure volume permission change policy
  for fsGroups when mounting a volume in a Pod. See
  [Configure volume permission and ownership change policy for Pods](/docs/tasks/configure-pod-container/security-context/#configure-volume-permission-and-ownership-change-policy-for-pods)
  for more details.

- `CronJobControllerV2`: Use an alternative implementation of the
  {{< glossary_tooltip text="CronJob" term_id="cronjob" >}} controller. Otherwise,
  version 1 of the same controller is selected.
-->
- `CSIVolumeFSGroupPolicy`：允许 CSIDrivers 使用 `fsGroupPolicy` 字段。
  该字段能控制由 CSIDriver 创建的卷在挂载这些卷时是否支持卷所有权和权限修改。

- `CSRDuration`：允许客户端为通过 Kubernetes CSR API 签署的证书申请有效期限。

- `ConfigurableFSGroupPolicy`：在 Pod 中挂载卷时，允许用户为 fsGroup
  配置卷访问权限和属主变更策略。请参见
  [为 Pod 配置卷访问权限和属主变更策略](/zh-cn/docs/tasks/configure-pod-container/security-context/#configure-volume-permission-and-ownership-change-policy-for-pods)。

- `CronJobControllerV2`：使用 {{< glossary_tooltip text="CronJob" term_id="cronjob" >}}
  控制器的一种替代实现。否则，系统会选择同一控制器的 v1 版本。

<!--
- `ControllerManagerLeaderMigration`: Enables Leader Migration for
  [kube-controller-manager](/docs/tasks/administer-cluster/controller-manager-leader-migration/#initial-leader-migration-configuration) and
  [cloud-controller-manager](/docs/tasks/administer-cluster/controller-manager-leader-migration/#deploy-cloud-controller-manager)
  which allows a cluster operator to live migrate
  controllers from the kube-controller-manager into an external controller-manager
  (e.g. the cloud-controller-manager) in an HA cluster without downtime.
-->
- `ControllerManagerLeaderMigration`：为
  [kube-controller-manager](/zh-cn/docs/tasks/administer-cluster/controller-manager-leader-migration/#initial-leader-migration-configuration) 和
  [cloud-controller-manager](/zh-cn/docs/tasks/administer-cluster/controller-manager-leader-migration/#deploy-cloud-controller-manager)
  启用 Leader 迁移，它允许集群管理者在没有停机的高可用集群环境下，实时把 kube-controller-manager
  迁移到外部的 controller-manager (例如 cloud-controller-manager) 中。

<!--
- `CustomPodDNS`: Enable customizing the DNS settings for a Pod using its `dnsConfig` property.
  Check [Pod's DNS Config](/docs/concepts/services-networking/dns-pod-service/#pods-dns-config)
  for more details.

- `CustomResourceDefaulting`: Enable CRD support for default values in OpenAPI v3 validation schemas.

- `CustomResourcePublishOpenAPI`: Enables publishing of CRD OpenAPI specs.
-->
- `CustomPodDNS`：允许使用 Pod 的 `dnsConfig` 属性自定义其 DNS 设置。
  更多详细信息，请参见
  [Pod 的 DNS 配置](/zh-cn/docs/concepts/services-networking/dns-pod-service/#pods-dns-config)。

- `CustomResourceDefaulting`：为 CRD 启用在其 OpenAPI v3 验证模式中提供默认值的支持。

- `CustomResourcePublishOpenAPI`：启用 CRD OpenAPI 规范的发布。

<!--
- `CustomResourceSubresources`: Enable `/status` and `/scale` subresources
  on resources created from [CustomResourceDefinition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).

- `CustomResourceValidation`: Enable schema based validation on resources created from
  [CustomResourceDefinition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).

- `CustomResourceWebhookConversion`: Enable webhook-based conversion
  on resources created from [CustomResourceDefinition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).

- `DaemonSetUpdateSurge`: Enables the DaemonSet workloads to maintain
  availability during update per node.
  See [Perform a Rolling Update on a DaemonSet](/docs/tasks/manage-daemon/update-daemon-set/).

- `DefaultPodTopologySpread`: Enables the use of `PodTopologySpread` scheduling plugin to do
  [default spreading](/docs/concepts/scheduling-eviction/topology-spread-constraints/#internal-default-constraints).
-->
- `CustomResourceSubresources`：对于用
  [CustomResourceDefinition](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
  创建的资源启用其 `/status` 和 `/scale` 子资源。

- `CustomResourceValidation`：对于用
  [CustomResourceDefinition](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
  创建的资源启用基于模式的验证。

- `CustomResourceWebhookConversion`：对于用
  [CustomResourceDefinition](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
  创建的资源启用基于 Webhook 的转换。

- `DaemonSetUpdateSurge`：使 DaemonSet 工作负载在每个节点的更新期间保持可用性。
  参阅[对 DaemonSet 执行滚动更新](/zh-cn/docs/tasks/manage-daemon/update-daemon-set/)。

- `DefaultPodTopologySpread`：启用 `PodTopologySpread` 调度插件来完成
  [默认的调度传播](/zh-cn/docs/concepts/scheduling-eviction/topology-spread-constraints/#internal-default-constraints)。

<!--
- `DynamicAuditing`: Used to enable dynamic auditing before v1.19.

- `DynamicKubeletConfig`: Enable the dynamic configuration of kubelet. The
  feature is no longer supported outside of supported skew policy. The feature
  gate was removed from kubelet in 1.24.

- `DynamicProvisioningScheduling`: Extend the default scheduler to be aware of
  volume topology and handle PV provisioning.
  This feature was superseded by the `VolumeScheduling` feature  in v1.12.

- `DynamicVolumeProvisioning`: Enable the
  [dynamic provisioning](/docs/concepts/storage/dynamic-provisioning/) of persistent volumes to Pods.
-->
- `DynamicAuditing`：在 v1.19 版本前用于启用动态审计。

- `DynamicKubeletConfig`：启用 kubelet 的动态配置。
  除偏差策略场景外，不再支持该功能。该特性门控在 kubelet 1.24 版本中已被移除。

- `DynamicProvisioningScheduling`：扩展默认调度器以了解卷拓扑并处理 PV 制备。
  此特性已在 v1.12 中完全被 `VolumeScheduling` 特性取代。

- `DynamicVolumeProvisioning`：启用持久化卷到 Pod
  的[动态制备](/zh-cn/docs/concepts/storage/dynamic-provisioning/)。

<!--
- `EnableAggregatedDiscoveryTimeout`: Enable the five second
  timeout on aggregated discovery calls.

- `EnableEquivalenceClassCache`: Enable the scheduler to cache equivalence of
  nodes when scheduling Pods.

- `EndpointSlice`: Enables EndpointSlices for more scalable and extensible
   network endpoints. See [Enabling EndpointSlices](/docs/concepts/services-networking/endpoint-slices/).
-->
- `EnableAggregatedDiscoveryTimeout`：对聚集的发现调用启用五秒钟超时设置。

- `EnableEquivalenceClassCache`：调度 Pod 时，使 scheduler 缓存节点的等效项。

- `EndpointSlice`：启用 EndpointSlice 以实现可扩缩性和可扩展性更好的网络端点。
  参阅[启用 EndpointSlice](/zh-cn/docs/concepts/services-networking/endpoint-slices/)。

<!--
- `EndpointSliceNodeName`: Enables EndpointSlice `nodeName` field.

- `EndpointSliceProxying`: When enabled, kube-proxy running
   on Linux will use EndpointSlices as the primary data source instead of
   Endpoints, enabling scalability and performance improvements. See
   [Enabling Endpoint Slices](/docs/concepts/services-networking/endpoint-slices/).

- `EphemeralContainers`: Enable the ability to add
  {{< glossary_tooltip text="ephemeral containers" term_id="ephemeral-container" >}}
  to running Pods.

- `EvenPodsSpread`: Enable pods to be scheduled evenly across topology domains. See
  [Pod Topology Spread Constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/).

- `ExpandCSIVolumes`: Enable the expanding of CSI volumes.
-->
- `EndpointSliceNodeName`：允许使用 EndpointSlice 的 `nodeName` 字段。

- `EndpointSliceProxying`：启用此特性门控时，Linux 上运行的 kube-proxy 会使用
  EndpointSlices 而不是 Endpoints 作为其主要数据源，从而使得可扩缩性和性能提升成为可能。
  参阅[启用 EndpointSlice](/zh-cn/docs/concepts/services-networking/endpoint-slices/)。

- `EphemeralContainers`：启用添加
  {{< glossary_tooltip text="临时容器" term_id="ephemeral-container" >}}
  到正在运行的 Pod 的特性。

- `EvenPodsSpread`：使 Pod 能够在拓扑域之间平衡调度。请参阅
  [Pod 拓扑扩展约束](/zh-cn/docs/concepts/scheduling-eviction/topology-spread-constraints/)。

- `ExpandCSIVolumes`：启用扩展 CSI 卷。

<!--
- `ExpandInUsePersistentVolumes`: Enable expanding in-use PVCs. See
  [Resizing an in-use PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#resizing-an-in-use-persistentvolumeclaim).

- `ExpandPersistentVolumes`: Enable the expanding of persistent volumes. See
  [Expanding Persistent Volumes Claims](/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims).
-->
- `ExpandInUsePersistentVolumes`：启用扩充使用中的 PVC 的尺寸。
  请查阅[调整使用中的 PersistentVolumeClaim 的大小](/zh-cn/docs/concepts/storage/persistent-volumes/#resizing-an-in-use-persistentvolumeclaim)。
- `ExpandPersistentVolumes`：允许扩充持久卷。
  请查阅[扩展持久卷申领](/zh-cn/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims)。

<!--
- `ExperimentalCriticalPodAnnotation`: Enable annotating specific pods as *critical*
  so that their [scheduling is guaranteed](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/).
  This feature is deprecated by Pod Priority and Preemption as of v1.13.

- `ExternalPolicyForExternalIP`: Fix a bug where ExternalTrafficPolicy is not
  applied to Service ExternalIPs.

- `GCERegionalPersistentDisk`: Enable the regional PD feature on GCE.
-->
- `ExperimentalCriticalPodAnnotation`：启用将特定 Pod 注解为 **critical** 的方式，
  用于[确保其被调度](/zh-cn/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/)。
  从 v1.13 开始已弃用此特性，转而使用 Pod 优先级和抢占功能。

- `ExternalPolicyForExternalIP`：修复 ExternalPolicyForExternalIP 没有应用于
  Service ExternalIPs 的缺陷。

- `GCERegionalPersistentDisk`：在 GCE 上启用带地理区域信息的 PD 特性。

<!--
- `GenericEphemeralVolume`: Enables ephemeral, inline volumes that support all features
  of normal volumes (can be provided by third-party storage vendors, storage capacity tracking,
  restore from snapshot, etc.).
  See [Ephemeral Volumes](/docs/concepts/storage/ephemeral-volumes/).

- `HugePageStorageMediumSize`: Enable support for multiple sizes pre-allocated
  [huge pages](/docs/tasks/manage-hugepages/scheduling-hugepages/).

- `HugePages`: Enable the allocation and consumption of pre-allocated
  [huge pages](/docs/tasks/manage-hugepages/scheduling-hugepages/).
-->
- `GenericEphemeralVolume`：启用支持临时的内联卷，这些卷支持普通卷
  （可以由第三方存储供应商提供、存储容量跟踪、从快照还原等等）的所有功能。
  请参见[临时卷](/zh-cn/docs/concepts/storage/ephemeral-volumes/)。

- `HugePageStorageMediumSize`：
  启用支持多种大小的预分配[巨页资源](/zh-cn/docs/tasks/manage-hugepages/scheduling-hugepages/)。

- `HugePages`：
  启用分配和使用预分配的[巨页资源](/zh-cn/docs/tasks/manage-hugepages/scheduling-hugepages/)。

<!--
- `HyperVContainer`: Enable
  [Hyper-V isolation](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container)
  for Windows containers.

- `IPv6DualStack`: Enable [dual stack](/docs/concepts/services-networking/dual-stack/)
  support for IPv6.

- `IdentifyPodOS`: Allows the Pod OS field to be specified. This helps in identifying
  the OS of the pod authoritatively during the API server admission time.
  In Kubernetes {{< skew currentVersion >}}, the allowed values for the `pod.spec.os.name`
  are `windows` and `linux`.

- `ImmutableEphemeralVolumes`: Allows for marking individual Secrets and ConfigMaps as
  immutable for better safety and performance.

- `IndexedJob`: Allows the [Job](/docs/concepts/workloads/controllers/job/)
  controller to manage Pod completions per completion index.
-->
- `HyperVContainer`：为 Windows 容器启用
  [Hyper-V 隔离](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container)。

- `IPv6DualStack`：启用[双协议栈](/zh-cn/docs/concepts/services-networking/dual-stack/)以支持 IPv6。

- `IdentifyPodOS`：允许设置 Pod 的 OS 字段。这一设置有助于在 API 服务器准入期间确定性地辨识
  Pod 的 OS。在 Kubernetes {{< skew currentVersion >}} 中，`pod.spec.os.name` 可选的值包括
  `windows` 和 `linux`。

- `ImmutableEphemeralVolumes`：允许将各个 Secret 和 ConfigMap 标记为不可变更的，
  以提高安全性和性能。

- `IndexedJob`：允许 [Job](/zh-cn/docs/concepts/workloads/controllers/job/)
  控制器根据完成索引来管理 Pod 完成。

<!--
- `IngressClassNamespacedParams`: Allow namespace-scoped parameters reference in
  `IngressClass` resource. This feature adds two fields - `Scope` and `Namespace`
  to `IngressClass.spec.parameters`.

- `Initializers`: Allow asynchronous coordination of object creation using the
  Initializers admission plugin.

- `KubeletConfigFile`: Enable loading kubelet configuration from
  a file specified using a config file.
  See [setting kubelet parameters via a config file](/docs/tasks/administer-cluster/kubelet-config-file/)
  for more details.
-->
- `IngressClassNamespacedParams`：允许在 `IngressClass` 资源中使用名字空间范围的参数引用。
  此功能为 `IngressClass.spec.parameters` 添加了两个字段 - `scope` 和 `namespace`。

- `Initializers`：允许使用 Intializers 准入插件来异步协调对象创建操作。

- `KubeletConfigFile`：启用从使用配置文件指定的文件中加载 kubelet 配置。
  有关更多详细信息，
  请参见[通过配置文件设置 kubelet 参数](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)。

<!--
- `KubeletPluginsWatcher`: Enable probe-based plugin watcher utility to enable kubelet
  to discover plugins such as [CSI volume drivers](/docs/concepts/storage/volumes/#csi).

- `LegacyNodeRoleBehavior`: When disabled, legacy behavior in service load balancers and
  node disruption will ignore the `node-role.kubernetes.io/master` label in favor of the
  feature-specific labels provided by `NodeDisruptionExclusion` and `ServiceNodeExclusion`.

<!--
- `LocalStorageCapacityIsolation`: Enable the consumption of
  [local ephemeral storage](/docs/concepts/configuration/manage-resources-containers/)
  and also the `sizeLimit` property of an
  [emptyDir volume](/docs/concepts/storage/volumes/#emptydir).

- `MountContainers`: Enable using utility containers on host as the volume mounter.

- `MountPropagation`: Enable sharing volume mounted by one container to other containers or pods.
  For more details, please see [mount propagation](/docs/concepts/storage/volumes/#mount-propagation).
-->
- `LocalStorageCapacityIsolation`：允许使用
  [本地临时存储](/zh-cn/docs/concepts/configuration/manage-resources-containers/)
  以及 [emptyDir 卷](/zh-cn/docs/concepts/storage/volumes/#emptydir)的 `sizeLimit` 属性。

- `KubeletPluginsWatcher`：启用基于探针的插件监视应用程序，使 kubelet 能够发现类似
  [CSI 卷驱动程序](/zh-cn/docs/concepts/storage/volumes/#csi)这类插件。

- `LegacyNodeRoleBehavior`：禁用此门控时，服务负载均衡器中和节点干扰中的原先行为会忽略
  `node-role.kubernetes.io/master` 标签，使用 `NodeDisruptionExclusion` 和
  `ServiceNodeExclusion` 对应特性所提供的标签。

- `MountContainers`：允许使用主机上的工具容器作为卷挂载程序。

- `MountPropagation`：启用将一个容器安装的共享卷共享到其他容器或 Pod。
  更多详细信息，请参见[挂载传播](/zh-cn/docs/concepts/storage/volumes/#mount-propagation)。

<!--
- `NamespaceDefaultLabelName`: Configure the API Server to set an immutable
  {{< glossary_tooltip text="label" term_id="label" >}} `kubernetes.io/metadata.name`
  on all namespaces, containing the namespace name.

- `NodeDisruptionExclusion`: Enable use of the Node label `node.kubernetes.io/exclude-disruption`
  which prevents nodes from being evacuated during zone failures.

- `NodeLease`: Enable the new Lease API to report node heartbeats, which could be used as a node health signal.

- `NonPreemptingPriority`: Enable `preemptionPolicy` field for PriorityClass and Pod.

- `PVCProtection`: Enable the prevention of a PersistentVolumeClaim (PVC) from
  being deleted when it is still used by any Pod.
-->
- `NamespaceDefaultLabelName`：配置 API 服务器以在所有名字空间上设置一个不可变的
  {{< glossary_tooltip text="标签" term_id="label" >}} `kubernetes.io/metadata.name`，
  取值为名字空间的名称。

- `NodeDisruptionExclusion`：启用节点标签 `node.kubernetes.io/exclude-disruption`，
  以防止在可用区发生故障期间驱逐节点。

- `NodeLease`：启用新的 Lease（租期）API 以报告节点心跳，可用作节点运行状况信号。

- `NonPreemptingPriority`：为 PriorityClass 和 Pod 启用 `preemptionPolicy` 选项。

- `PVCProtection`：当 PersistentVolumeClaim (PVC) 仍然在 Pod 使用时被删除，启用保护。

<!--
- `PersistentLocalVolumes`: Enable the usage of `local` volume type in Pods.
  Pod affinity has to be specified if requesting a `local` volume.

- `PodAffinityNamespaceSelector`: Enable the
  [Pod Affinity Namespace Selector](/docs/concepts/scheduling-eviction/assign-pod-node/#namespace-selector)
  and [CrossNamespacePodAffinity](/docs/concepts/policy/resource-quotas/#cross-namespace-pod-affinity-quota)
  quota scope features.

- `PodDisruptionBudget`: Enable the [PodDisruptionBudget](/docs/tasks/run-application/configure-pdb/) feature.

- `PodOverhead`: Enable the [PodOverhead](/docs/concepts/scheduling-eviction/pod-overhead/)
  feature to account for pod overheads.

- `PodPriority`: Enable the descheduling and preemption of Pods based on their
  [priorities](/docs/concepts/scheduling-eviction/pod-priority-preemption/).

- `PodReadinessGates`: Enable the setting of `PodReadinessGate` field for extending
  Pod readiness evaluation. See [Pod readiness gate](/docs/concepts/workloads/pods/pod-lifecycle/#pod-readiness-gate)
  for more details.
-->
- `PersistentLocalVolumes`：允许在 Pod 中使用 `local（本地）` 卷类型。
  如果请求 `local` 卷，则必须指定 Pod 亲和性属性。

- `PodAffinityNamespaceSelector`：启用 [Pod 亲和性名字空间选择算符](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#namespace-selector)和
  [CrossNamespacePodAffinity](/zh-cn/docs/concepts/policy/resource-quotas/#cross-namespace-pod-affinity-quota)
  资源配额功能。

- `PodDisruptionBudget`：启用 [PodDisruptionBudget](/zh-cn/docs/tasks/run-application/configure-pdb/) 功能特性。

- `PodOverhead`：启用 [PodOverhead](/zh-cn/docs/concepts/scheduling-eviction/pod-overhead/)
  特性以计算 Pod 开销。

- `PodPriority`：启用根据[优先级](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)的
  Pod 调度和抢占。

- `PodReadinessGates`：启用 `podReadinessGate` 字段的设置以扩展 Pod 准备状态评估。
  有关更多详细信息，请参见
  [Pod 就绪状态判别](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-readiness-gate)。

<!--
- `PodShareProcessNamespace`: Enable the setting of `shareProcessNamespace` in a Pod for sharing
  a single process namespace between containers running in a pod.  More details can be found in
  [Share Process Namespace between Containers in a Pod](/docs/tasks/configure-pod-container/share-process-namespace/).

- `PreferNominatedNode`: This flag tells the scheduler whether the nominated
  nodes will be checked first before looping through all the other nodes in
  the cluster.

- `RequestManagement`: Enables managing request concurrency with prioritization and fairness
  at each API server. Deprecated by `APIPriorityAndFairness` since 1.17.

- `ResourceLimitsPriorityFunction`: Enable a scheduler priority function that
  assigns a lowest possible score of 1 to a node that satisfies at least one of
  the input Pod's cpu and memory limits. The intent is to break ties between
  nodes with same scores.

- `ResourceQuotaScopeSelectors`: Enable resource quota scope selectors.
-->
- `PodShareProcessNamespace`：在 Pod 中启用 `shareProcessNamespace` 的设置，
  以便在 Pod 中运行的容器之间共享同一进程名字空间。更多详细信息，
  请参见[在 Pod 中的容器间共享同一进程名字空间](/zh-cn/docs/tasks/configure-pod-container/share-process-namespace/)。

- `PreferNominatedNode`：这个标志告诉调度器在循环遍历集群中的所有其他节点之前，
  是否首先检查指定的节点。

- `RequestManagement`：允许在每个 API 服务器上通过优先级和公平性管理请求并发性。
  自 1.17 以来已被 `APIPriorityAndFairness` 替代。

- `ResourceLimitsPriorityFunction`：启用某调度器优先级函数，
  该函数将最低得分 1 指派给至少满足输入 Pod 的 CPU 和内存限制之一的节点，
  目的是打破得分相同的节点之间的关联。

- `ResourceQuotaScopeSelectors`：启用资源配额范围选择算符。

<!--
- `RootCAConfigMap`: Configure the `kube-controller-manager` to publish a
  {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} named `kube-root-ca.crt`
  to every namespace. This ConfigMap contains a CA bundle used for verifying connections
  to the kube-apiserver. See
  [Bound Service Account Tokens](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md)
  for more details.

- `RotateKubeletClientCertificate`: Enable the rotation of the client TLS certificate on the kubelet.
  See [kubelet configuration](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#kubelet-configuration)
  for more details.
-->
- `RootCAConfigMap`：配置 `kube-controller-manager`，使之发布一个名为 `kube-root-ca.crt`
  的 {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}，
  到所有名字空间中。该 ConfigMap 包含用来验证与 kube-apiserver 之间连接的 CA 证书包。
  参阅[绑定服务账号令牌](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md)
  以了解更多细节。

- `RotateKubeletClientCertificate`：在 kubelet 上启用客户端 TLS 证书的轮换。
  更多详细信息，请参见
  [kubelet 配置](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#kubelet-configuration)。

<!--
- `RunAsGroup`: Enable control over the primary group ID set on the init processes of containers.

- `RuntimeClass`: Enable the [RuntimeClass](/docs/concepts/containers/runtime-class/) feature for
  selecting container runtime configurations.

- `SCTPSupport`: Enables the _SCTP_ `protocol` value in Pod, Service, Endpoints, EndpointSlice,
  and NetworkPolicy definitions.

- `ScheduleDaemonSetPods`: Enable DaemonSet Pods to be scheduled by the default scheduler instead
  of the DaemonSet controller.
-->
- `RunAsGroup`：启用对容器初始化过程中设置的主要组 ID 的控制。

- `RuntimeClass`：启用 [RuntimeClass](/zh-cn/docs/concepts/containers/runtime-class/)
  特性用于选择容器运行时配置。

- `SCTPSupport`：在 Pod、Service、Endpoints、NetworkPolicy 定义中允许将 'SCTP'
  用作 `protocol` 值。

- `ScheduleDaemonSetPods`：启用 DaemonSet Pod 由默认调度程序而不是
  DaemonSet 控制器进行调度。

<!--
- `SelectorIndex`: Allows label and field based indexes in API server watch cache to accelerate
  list operations.

- `ServiceAccountIssuerDiscovery`: Enable OIDC discovery endpoints (issuer and JWKS URLs) for the
  service account issuer in the API server. See
  [Configure Service Accounts for Pods](/docs/tasks/configure-pod-container/configure-service-account/#service-account-issuer-discovery)
  for more details.

- `ServiceAppProtocol`: Enables the `appProtocol` field on Services and Endpoints.

- `ServiceLoadBalancerClass`: Enables the `loadBalancerClass` field on Services. See
  [Specifying class of load balancer implementation](/docs/concepts/services-networking/service/#load-balancer-class)
  for more details.

- `ServiceLoadBalancerFinalizer`: Enable finalizer protection for Service load balancers.

- `ServiceLBNodePortControl`: Enables the `allocateLoadBalancerNodePorts` field on Services.
-->
- `SelectorIndex`：允许使用 API 服务器的 watch 缓存中基于标签和字段的索引来加速 list 操作。

- `ServiceAccountIssuerDiscovery`：在 API 服务器中为服务账号颁发者启用 OIDC 发现端点
  （颁发者和 JWKS URL）。详情参见
  [为 Pod 配置服务账号](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#service-account-issuer-discovery)。

- `ServiceAppProtocol`：为 Service 和 Endpoints 启用 `appProtocol` 字段。

- `ServiceLoadBalancerClass`：为服务启用 `loadBalancerClass` 字段。
  有关更多信息，请参见[指定负载均衡器实现类](/zh-cn/docs/concepts/services-networking/service/#load-balancer-class)。

- `ServiceLoadBalancerFinalizer`：为服务负载均衡启用终结器（finalizers）保护。

- `ServiceLBNodePortControl`：为服务启用 `allocateLoadBalancerNodePorts` 字段。
<!--
- `ServiceNodeExclusion`: Enable the exclusion of nodes from load balancers created by a cloud provider.
  A node is eligible for exclusion if labelled with "`node.kubernetes.io/exclude-from-external-load-balancers`".

- `ServiceTopology`: Enable service to route traffic based upon the Node topology of the cluster.

- `SetHostnameAsFQDN`: Enable the ability of setting Fully Qualified Domain Name(FQDN) as the
  hostname of a pod. See
  [Pod's `setHostnameAsFQDN` field](/docs/concepts/services-networking/dns-pod-service/#pod-sethostnameasfqdn-field).

- `StartupProbe`: Enable the [startup](/docs/concepts/workloads/pods/pod-lifecycle/#when-should-you-use-a-startup-probe)
  probe in the kubelet.
-->
- `ServiceNodeExclusion`：启用从云提供商创建的负载均衡中排除节点。
  如果节点标记有 `node.kubernetes.io/exclude-from-external-load-balancers` 标签，则可以排除该节点。

- `ServiceTopology`：启用服务拓扑可以让一个服务基于集群的节点拓扑进行流量路由。

- `SetHostnameAsFQDN`：启用将全限定域名（FQDN）设置为 Pod 主机名的功能。
  请参见[为 Pod 设置 `setHostnameAsFQDN` 字段](/zh-cn/docs/concepts/services-networking/dns-pod-service/#pod-sethostnameasfqdn-field)。

- `StartupProbe`：在 kubelet
  中启用[启动探针](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#when-should-you-use-a-startup-probe)。

<!--
- `StatefulSetMinReadySeconds`: Allows `minReadySeconds` to be respected by
  the StatefulSet controller.
-->
- `StatefulSetMinReadySeconds`: 允许 StatefulSet 控制器采纳 `minReadySeconds` 设置。

<!--
- `StorageObjectInUseProtection`: Postpone the deletion of PersistentVolume or
  PersistentVolumeClaim objects if they are still being used.

- `StreamingProxyRedirects`: Instructs the API server to intercept (and follow) redirects from the
  backend (kubelet) for streaming requests. Examples of streaming requests include the `exec`,
  `attach` and `port-forward` requests.

- `SupportIPVSProxyMode`: Enable providing in-cluster service load balancing using IPVS.
  See [service proxies](/docs/reference/networking/virtual-ips/) for more details.

- `SupportNodePidsLimit`: Enable the support to limiting PIDs on the Node.  The parameter
  `pid=<number>` in the `--system-reserved` and `--kube-reserved` options can be specified to
  ensure that the specified number of process IDs will be reserved for the system as a whole and for
   Kubernetes system daemons respectively.
-->
- `StorageObjectInUseProtection`：如果仍在使用 PersistentVolume 或
  PersistentVolumeClaim 对象，则将其删除操作推迟。

- `StreamingProxyRedirects`：指示 API 服务器拦截（并跟踪）后端（kubelet）的重定向以处理流请求。
  流请求的例子包括 `exec`、`attach` 和 `port-forward` 请求。

- `SupportIPVSProxyMode`：启用使用 IPVS 提供集群内服务负载平衡。更多详细信息，
  请参见[服务代理](/zh-cn/docs/reference/networking/virtual-ips/)。

- `SupportNodePidsLimit`：启用支持，限制节点上的 PID 用量。
  `--system-reserved` 和 `--kube-reserved` 中的参数 `pid=<数值>`
  可以分别用来设定为整个系统所预留的进程 ID 个数和为 Kubernetes 系统守护进程预留的进程 ID 个数。

<!--
- `SupportPodPidsLimit`: Enable the support to limiting PIDs in Pods.

- `SuspendJob`: Enable support to suspend and resume Jobs. For more details, see
   [the Jobs docs](/docs/concepts/workloads/controllers/job/).

- `Sysctls`: Enable support for namespaced kernel parameters (sysctls) that can be set for each
  pod. See [sysctls](/docs/tasks/administer-cluster/sysctl-cluster/) for more details.

- `TTLAfterFinished`: Allow a [TTL controller](/docs/concepts/workloads/controllers/ttlafterfinished/)
  to clean up resources after they finish execution.

- `TaintBasedEvictions`: Enable evicting pods from nodes based on taints on Nodes and tolerations
  on Pods.  See [taints and tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/)
  for more details.
-->
- `SupportPodPidsLimit`：启用支持限制 Pod 中的进程 PID。

- `SuspendJob`：启用对追加和恢复 Job 的支持。更多细节请参阅
  [Job 文档](/zh-cn/docs/concepts/workloads/controllers/job/)。

- `Sysctls`：允许为每个 Pod 设置的名字空间内核参数（sysctls）。
  更多详细信息，请参见 [sysctls](/zh-cn/docs/tasks/administer-cluster/sysctl-cluster/)。

- `TTLAfterFinished`：资源完成执行后，允许
  [TTL 控制器](/zh-cn/docs/concepts/workloads/controllers/ttlafterfinished/)清理资源。

- `TaintBasedEvictions`：根据节点上的污点和 Pod 上的容忍度启用从节点驱逐 Pod 的特性。
  更多详细信息可参见[污点和容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)。

<!--
- `TaintNodesByCondition`: Enable automatic tainting nodes based on
  [node conditions](/docs/concepts/architecture/nodes/#condition).

- `TokenRequest`: Enable the `TokenRequest` endpoint on service account resources.

- `TokenRequestProjection`: Enable the injection of service account tokens into a Pod through a
  [`projected` volume](/docs/concepts/storage/volumes/#projected).

- `ValidateProxyRedirects`: This flag controls whether the API server should validate that redirects
  are only followed to the same host. Only used if the `StreamingProxyRedirects` flag is enabled.
-->
- `TaintNodesByCondition`：
  根据[节点状况](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)启用自动为节点标记污点。

- `TokenRequest`：在服务账号资源上启用 `TokenRequest` 端点。

- `TokenRequestProjection`：启用通过
  [`projected` 卷](/zh-cn/docs/concepts/storage/volumes/#projected)将服务账号令牌注入到 Pod 中的特性。

- `ValidateProxyRedirects`：这个标志控制 API 服务器是否应该验证只跟随到相同的主机的重定向。
  仅在启用 `StreamingProxyRedirects` 标志时被使用。

<!--
- `VolumePVCDataSource`: Enable support for specifying an existing PVC as a DataSource.

- `VolumeScheduling`: Enable volume topology aware scheduling and make the PersistentVolumeClaim
  (PVC) binding aware of scheduling decisions. It also enables the usage of
  [`local`](/docs/concepts/storage/volumes/#local) volume type when used together with the
  `PersistentLocalVolumes` feature gate.

- `VolumeSnapshotDataSource`: Enable volume snapshot data source support.

- `VolumeSubpath`: Allow mounting a subpath of a volume in a container.
-->
- `VolumePVCDataSource`：启用对将现有 PVC 指定数据源的支持。

- `VolumeScheduling`：启用卷拓扑感知调度，并使 PersistentVolumeClaim（PVC）
  绑定能够了解调度决策；当与 PersistentLocalVolumes 特性门控一起使用时，
  还允许使用 [`local`](/zh-cn/docs/concepts/storage/volumes/#local) 卷类型。

- `VolumeSnapshotDataSource`：启用卷快照数据源支持。

- `VolumeSubpath`：允许在容器中挂载卷的子路径。

<!--
- `VolumeSubpathEnvExpansion`: Enable `subPathExpr` field for expanding environment
  variables into a `subPath`.

- `WarningHeaders`: Allow sending warning headers in API responses.

- `WindowsEndpointSliceProxying`: When enabled, kube-proxy running on Windows will use
  EndpointSlices as the primary data source instead of Endpoints, enabling scalability and
  performance improvements. See
  [Enabling Endpoint Slices](/docs/concepts/services-networking/endpoint-slices/).
-->
- `VolumeSubpathEnvExpansion`：启用 `subPathExpr` 字段用于在 `subPath` 中展开环境变量。

- `WarningHeaders`：允许在 API 响应中发送警告头部。

- `WindowsEndpointSliceProxying`：当启用时，运行在 Windows 上的 kube-proxy
  将使用 EndpointSlices 而不是 Endpoints 作为主要数据源，从而实现可伸缩性和并改进性能。
  详情请参见[启用端点切片](/zh-cn/docs/concepts/services-networking/endpoint-slices/)。

<!--
- `WindowsGMSA`: Enables passing of GMSA credential specs from pods to container runtimes.

- `WindowsRunAsUserName` : Enable support for running applications in Windows containers with as a
  non-default user. See [Configuring RunAsUserName](/docs/tasks/configure-pod-container/configure-runasusername)
  for more details.
-->
- `WindowsGMSA`：允许将 GMSA 凭据规范从 Pod 传递到容器运行时。

- `WindowsRunAsUserName`：提供使用非默认用户在 Windows 容器中运行应用程序的支持。
  详情请参见[配置 RunAsUserName](/zh-cn/docs/tasks/configure-pod-container/configure-runasusername)。
