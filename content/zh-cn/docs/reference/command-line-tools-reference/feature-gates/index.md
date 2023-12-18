---
title: 特性门控
weight: 10
content_type: concept
card:
  name: reference
  weight: 60
---
<!--
title: Feature Gates
weight: 10
content_type: concept
card:
  name: reference
  weight: 60
-->

<!-- overview -->
<!--
This page contains an overview of the various feature gates an administrator
can specify on different Kubernetes components.

See [feature stages](#feature-stages) for an explanation of the stages for a feature.
-->
本页详述了管理员可以在不同的 Kubernetes 组件上指定的各种特性门控。

关于特性各个阶段的说明，请参见[特性阶段](#feature-stages)。

<!-- body -->

<!--
## Overview

Feature gates are a set of key=value pairs that describe Kubernetes features.
You can turn these features on or off using the `--feature-gates` command line flag
on each Kubernetes component.
-->
## 概述 {#overview}

特性门控是描述 Kubernetes 特性的一组键值对。你可以在 Kubernetes 的各个组件中使用
`--feature-gates` 标志来启用或禁用这些特性。

<!--
Each Kubernetes component lets you enable or disable a set of feature gates that
are relevant to that component.
Use `-h` flag to see a full set of feature gates for all components.
To set feature gates for a component, such as kubelet, use the `--feature-gates`
flag assigned to a list of feature pairs:
-->
每个 Kubernetes 组件都支持启用或禁用与该组件相关的一组特性门控。
使用 `-h` 参数来查看所有组件支持的完整特性门控。
要为诸如 kubelet 之类的组件设置特性门控，请使用 `--feature-gates` 参数，
并向其传递一个特性设置键值对列表：

```shell
--feature-gates=...,GracefulNodeShutdown=true
```

<!--
The following tables are a summary of the feature gates that you can set on
different Kubernetes components.
-->
下表总结了在不同的 Kubernetes 组件上可以设置的特性门控。

<!--
- The "Since" column contains the Kubernetes release when a feature is introduced
  or its release stage is changed.
- The "Until" column, if not empty, contains the last Kubernetes release in which
  you can still use a feature gate.
- If a feature is in the Alpha or Beta state, you can find the feature listed
  in the [Alpha/Beta feature gate table](#feature-gates-for-alpha-or-beta-features).
- If a feature is stable you can find all stages for that feature listed in the
  [Graduated/Deprecated feature gate table](#feature-gates-for-graduated-or-deprecated-features).
- The [Graduated/Deprecated feature gate table](#feature-gates-for-graduated-or-deprecated-features)
  also lists deprecated and withdrawn features.
-->
- 引入特性或更改其发布阶段后，"开始（Since）" 列将包含 Kubernetes 版本。
- "结束（Until）" 列（如果不为空）包含最后一个 Kubernetes 版本，你仍可以在其中使用特性门控。
- 如果某个特性处于 Alpha 或 Beta 状态，你可以在
  [Alpha 和 Beta 特性门控表](#feature-gates-for-alpha-or-beta-features)中找到该特性。
- 如果某个特性处于稳定状态，
  你可以在[已毕业和废弃特性门控表](#feature-gates-for-graduated-or-deprecated-features)中找到该特性的所有阶段。
- [已毕业和废弃特性门控表](#feature-gates-for-graduated-or-deprecated-features)还列出了废弃的和已被移除的特性。

{{< note >}}
<!--
For a reference to old feature gates that are removed, please refer to
[feature gates removed](/docs/reference/command-line-tools-reference/feature-gates-removed/).
-->
有关已移除的原有特性门控的参考信息，
请参阅[已移除的特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates-removed/)。
{{< /note >}}

<!--
### Feature gates for Alpha or Beta features
-->
### Alpha 和 Beta 状态的特性门控  {#feature-gates-for-alpha-or-beta-features}

{{< table caption="处于 Alpha 或 Beta 状态的特性门控" sortable="true" >}}

<!--
| Feature | Default | Stage | Since | Until |
-->
| 特性    | 默认值  | 状态  | 开始（Since） | 结束（Until） |
|---------|---------|-------|---------------|---------------|
| `APIPriorityAndFairness` | `false` | Alpha | 1.18 | 1.19 |
| `APIPriorityAndFairness` | `true` | Beta | 1.20 | |
| `APIResponseCompression` | `false` | Alpha | 1.7 | 1.15 |
| `APIResponseCompression` | `true` | Beta | 1.16 | |
| `APIServerIdentity` | `false` | Alpha | 1.20 | 1.25 |
| `APIServerIdentity` | `true` | Beta | 1.26 | |
| `APIServerTracing` | `false` | Alpha | 1.22 | 1.26 |
| `APIServerTracing` | `true` | Beta | 1.27 | |
| `AdmissionWebhookMatchConditions` | `false` | Alpha | 1.27 | 1.27 |
| `AdmissionWebhookMatchConditions` | `true` | Beta | 1.28 | |
| `AggregatedDiscoveryEndpoint` | `false` | Alpha | 1.26 | 1.26 |
| `AggregatedDiscoveryEndpoint` | `true` | Beta | 1.27 | |
| `AnyVolumeDataSource` | `false` | Alpha | 1.18 | 1.23 |
| `AnyVolumeDataSource` | `true` | Beta | 1.24 | |
| `AppArmor` | `true` | Beta | 1.4 | |
| `CPUManagerPolicyAlphaOptions` | `false` | Alpha | 1.23 | |
| `CPUManagerPolicyBetaOptions` | `true` | Beta | 1.23 | |
| `CPUManagerPolicyOptions` | `false` | Alpha | 1.22 | 1.22 |
| `CPUManagerPolicyOptions` | `true` | Beta | 1.23 | |
| `CRDValidationRatcheting` | `false` | Alpha | 1.28 | |
| `CSIMigrationPortworx` | `false` | Alpha | 1.23 | 1.24 |
| `CSIMigrationPortworx` | `false` | Beta | 1.25 | |
| `CSIVolumeHealth` | `false` | Alpha | 1.21 | |
| `CloudControllerManagerWebhook` | `false` | Alpha | 1.27 | |
| `CloudDualStackNodeIPs` | `false` | Alpha | 1.27 | 1.28 |
| `CloudDualStackNodeIPs` | `true` | Beta | 1.29 | |
| `ClusterTrustBundle` | false | Alpha | 1.27 | |
| `ClusterTrustBundleProjection` | `false` | Alpha | 1.29 | |
| `ComponentSLIs` | `false` | Alpha | 1.26 | 1.26 |
| `ComponentSLIs` | `true` | Beta | 1.27 | |
| `ConsistentListFromCache` | `false` | Alpha | 1.28 | |
| `ContainerCheckpoint` | `false` | Alpha | 1.25 | |
| `ContextualLogging` | `false` | Alpha | 1.24 | |
| `CronJobsScheduledAnnotation` | `true` | Beta | 1.28 | |
| `CrossNamespaceVolumeDataSource` | `false` | Alpha| 1.26 | |
| `CustomCPUCFSQuotaPeriod` | `false` | Alpha | 1.12 | |
| `DevicePluginCDIDevices` | `false` | Alpha | 1.28 | |
| `DisableCloudProviders` | `false` | Alpha | 1.22 | |
| `DisableKubeletCloudCredentialProviders` | `false` | Alpha | 1.23 | |
| `DisableNodeKubeProxyVersion` | `false` | Alpha | 1.29 | |
| `DynamicResourceAllocation` | `false` | Alpha | 1.26 | |
| `ElasticIndexedJob` | `true` | Beta | 1.27 | |
| `EventedPLEG` | `false` | Alpha | 1.26 | 1.26 |
| `EventedPLEG` | `false` | Beta | 1.27 | |
| `GracefulNodeShutdown` | `false` | Alpha | 1.20 | 1.20 |
| `GracefulNodeShutdown` | `true` | Beta | 1.21 | |
| `GracefulNodeShutdownBasedOnPodPriority` | `false` | Alpha | 1.23 | 1.23 |
| `GracefulNodeShutdownBasedOnPodPriority` | `true` | Beta | 1.24 | |
| `HPAContainerMetrics` | `false` | Alpha | 1.20 | 1.26 |
| `HPAContainerMetrics` | `true` | Beta | 1.27 | |
| `HPAScaleToZero` | `false` | Alpha | 1.16 | |
| `HonorPVReclaimPolicy` | `false` | Alpha | 1.23 |  |
| `InPlacePodVerticalScaling` | `false` | Alpha | 1.27 | |
| `InTreePluginAWSUnregister` | `false` | Alpha | 1.21 | |
| `InTreePluginAzureDiskUnregister` | `false` | Alpha | 1.21 | |
| `InTreePluginAzureFileUnregister` | `false` | Alpha | 1.21 | |
| `InTreePluginGCEUnregister` | `false` | Alpha | 1.21 | |
| `InTreePluginOpenStackUnregister` | `false` | Alpha | 1.21 | |
| `InTreePluginPortworxUnregister` | `false` | Alpha | 1.23 | |
| `InTreePluginvSphereUnregister` | `false` | Alpha | 1.21 | |
| `JobBackoffLimitPerIndex` | `false` | Alpha | 1.28 | 1.28 |
| `JobBackoffLimitPerIndex` | `true` | Beta | 1.29 | |
| `JobPodFailurePolicy` | `false` | Alpha | 1.25 | 1.25 |
| `JobPodFailurePolicy` | `true` | Beta | 1.26 | |
| `JobPodReplacementPolicy` | `false` | Alpha | 1.28 | 1.28 |
| `JobPodReplacementPolicy` | `true` | Beta | 1.29 | |
| `KubeProxyDrainingTerminatingNodes` | `false` | Alpha | 1.28 | |
| `KubeletCgroupDriverFromCRI` | `false` | Alpha | 1.28 | |
| `KubeletInUserNamespace` | `false` | Alpha | 1.22 | |
| `KubeletPodResourcesDynamicResources` | `false` | Alpha | 1.27 | |
| `KubeletPodResourcesGet` | `false` | Alpha | 1.27 | |
| `KubeletTracing` | `false` | Alpha | 1.25 | 1.26 |
| `KubeletTracing` | `true` | Beta | 1.27 | |
| `LegacyServiceAccountTokenCleanUp` | `false` | Alpha | 1.28 | 1.28 |
| `LegacyServiceAccountTokenCleanUp` | `true` | Beta | 1.29 | |
| `LoadBalancerIPMode` | `false` | Alpha | 1.29 | |
| `LocalStorageCapacityIsolationFSQuotaMonitoring` | `false` | Alpha | 1.15 | - |
| `LogarithmicScaleDown` | `false` | Alpha | 1.21 | 1.21 |
| `LogarithmicScaleDown` | `true` | Beta | 1.22 | |
| `LoggingAlphaOptions` | `false` | Alpha | 1.24 | - |
| `LoggingBetaOptions` | `true` | Beta | 1.24 | - |
| `MatchLabelKeysInPodAffinity` | `false` | Alpha | 1.29 | - |
| `MatchLabelKeysInPodTopologySpread` | `false` | Alpha | 1.25 | 1.26 |
| `MatchLabelKeysInPodTopologySpread` | `true` | Beta | 1.27 | - |
| `MaxUnavailableStatefulSet` | `false` | Alpha | 1.24 | |
| `MemoryManager` | `false` | Alpha | 1.21 | 1.21 |
| `MemoryManager` | `true` | Beta | 1.22 | |
| `MemoryQoS` | `false` | Alpha | 1.22 | |
| `MinDomainsInPodTopologySpread` | `false` | Alpha | 1.24 | 1.24 |
| `MinDomainsInPodTopologySpread` | `false` | Beta | 1.25 | 1.26 |
| `MinDomainsInPodTopologySpread` | `true` | Beta | 1.27 | |
| `MultiCIDRServiceAllocator` | `false` | Alpha | 1.27 | |
| `NewVolumeManagerReconstruction` | `false` | Beta | 1.27 | 1.27  |
| `NewVolumeManagerReconstruction` | `true` | Beta | 1.28 |  |
| `NodeInclusionPolicyInPodTopologySpread` | `false` | Alpha | 1.25 | 1.25 |
| `NodeInclusionPolicyInPodTopologySpread` | `true` | Beta | 1.26 | |
| `NodeLogQuery` | `false` | Alpha | 1.27 | |
| `NodeSwap` | `false` | Alpha | 1.22 | 1.27 |
| `NodeSwap` | `false` | Beta | 1.28 | |
| `OpenAPIEnums` | `false` | Alpha | 1.23 | 1.23 |
| `OpenAPIEnums` | `true` | Beta | 1.24 | |
| `PDBUnhealthyPodEvictionPolicy` | `false` | Alpha | 1.26 | 1.26 |
| `PDBUnhealthyPodEvictionPolicy` | `true` | Beta | 1.27 | |
| `PersistentVolumeLastPhaseTransistionTime` | `false` | Alpha | 1.28  | 1.28 |
| `PersistentVolumeLastPhaseTransistionTime` | `true`  | Beta  | 1.29  | |
| `PodAndContainerStatsFromCRI` | `false` | Alpha | 1.23 | |
| `PodDeletionCost` | `false` | Alpha | 1.21 | 1.21 |
| `PodDeletionCost` | `true` | Beta | 1.22 | |
| `PodDisruptionConditions` | `false` | Alpha | 1.25 | 1.25 |
| `PodDisruptionConditions` | `true` | Beta | 1.26 | |
| `PodHostIPs` | `false` | Alpha | 1.28 | 1.28 |
| `PodHostIPs` | `true` | Beta | 1.29 | |
| `PodIndexLabel` | `true` | Beta | 1.28 | |
| `PodLifecycleSleepAction` | `false` | Alpha | 1.29 | |
| `PodReadyToStartContainersCondition` | `false` | Alpha | 1.28 | 1.28 |
| `PodReadyToStartContainersCondition` | `true` | Beta | 1.29 | |
| `PodSchedulingReadiness` | `false` | Alpha | 1.26 | 1.26 |
| `PodSchedulingReadiness` | `true` | Beta | 1.27 | |
| `ProcMountType` | `false` | Alpha | 1.12 | |
| `QOSReserved` | `false` | Alpha | 1.11 | |
| `RecoverVolumeExpansionFailure` | `false` | Alpha | 1.23 | |
| `RemainingItemCount` | `false` | Alpha | 1.15 | 1.15 |
| `RemainingItemCount` | `true` | Beta | 1.16 | |
| `RotateKubeletServerCertificate` | `false` | Alpha | 1.7 | 1.11 |
| `RotateKubeletServerCertificate` | `true` | Beta | 1.12 | |
| `RuntimeClassInImageCriApi` | `false` | Alpha | 1.29 | |
| `SELinuxMountReadWriteOncePod` | `false` | Alpha | 1.25 | 1.26 |
| `SELinuxMountReadWriteOncePod` | `false` | Beta | 1.27 | 1.27 |
| `SELinuxMountReadWriteOncePod` | `true` | Beta | 1.28 | |
| `SchedulerQueueingHints` | `true` | Beta | 1.28 | 1.29 |
| `SchedulerQueueingHints` | `false` | Beta | 1.29 | |
| `SecurityContextDeny` | `false` | Alpha | 1.27 | |
| `SeparateTaintEvictionController` | `true` | Beta | 1.29 | |
| `ServiceAccountTokenJTI` | `false` | Alpha | 1.29 | |
| `ServiceAccountTokenNodeBinding` | `false` | Alpha | 1.29 | |
| `ServiceAccountTokenNodeBindingValidation` | `false` | Alpha | 1.29 | |
| `ServiceAccountTokenPodNodeInfo` | `false` | Alpha | 1.29 | |
| `SidecarContainers` | `false` | Alpha | 1.28 | 1.28 |
| `SidecarContainers` | `true` | Beta | 1.29 | |
| `SizeMemoryBackedVolumes` | `false` | Alpha | 1.20 | 1.21 |
| `SizeMemoryBackedVolumes` | `true` | Beta | 1.22 | |
| `StableLoadBalancerNodeSet` | `true` | Beta | 1.27 | |
| `StatefulSetAutoDeletePVC` | `false` | Alpha | 1.23 | 1.26 |
| `StatefulSetAutoDeletePVC` | `false` | Beta | 1.27 | |
| `StatefulSetStartOrdinal` | `false` | Alpha | 1.26 | 1.26 |
| `StatefulSetStartOrdinal` | `true` | Beta | 1.27 | |
| `StorageVersionAPI` | `false` | Alpha | 1.20 | |
| `StorageVersionHash` | `false` | Alpha | 1.14 | 1.14 |
| `StorageVersionHash` | `true` | Beta | 1.15 | |
| `TopologyAwareHints` | `false` | Alpha | 1.21 | 1.22 |
| `TopologyAwareHints` | `false` | Beta | 1.23 | 1.23 |
| `TopologyAwareHints` | `true` | Beta | 1.24 | |
| `TopologyManagerPolicyAlphaOptions` | `false` | Alpha | 1.26 | |
| `TopologyManagerPolicyBetaOptions` | `false` | Beta | 1.26 | 1.27 |
| `TopologyManagerPolicyBetaOptions` | `true` | Beta | 1.28 | |
| `TopologyManagerPolicyOptions` | `false` | Alpha | 1.26 | 1.27 |
| `TopologyManagerPolicyOptions` | `true` | Beta | 1.28 | |
| `TranslateStreamCloseWebsocketRequests` | `false` | Alpha | 1.29 | |
| `UnauthenticatedHTTP2DOSMitigation` | `false` | Beta | 1.28 | |
| `UnauthenticatedHTTP2DOSMitigation` | `true` | Beta | 1.29 | |
| `UnknownVersionInteroperabilityProxy` | `false` | Alpha | 1.28 | |
| `UserNamespacesPodSecurityStandards` | `false` | Alpha | 1.29 | |
| `UserNamespacesSupport` | `false` | Alpha | 1.28 | |
| `ValidatingAdmissionPolicy` | `false` | Alpha | 1.26 | 1.27 |
| `ValidatingAdmissionPolicy` | `false` | Beta | 1.28 | |
| `VolumeCapacityPriority` | `false` | Alpha | 1.21 | |
| `VolumeAttributesClass` | `false` | Alpha | 1.29 | |
| `WatchList` | `false` | Alpha | 1.27 | |
| `WinDSR` | `false` | Alpha | 1.14 | |
| `WinOverlay` | `false` | Alpha | 1.14 | 1.19 |
| `WinOverlay` | `true` | Beta | 1.20 | |
| `WindowsHostNetwork` | `true` | Alpha | 1.26 | |
{{< /table >}}

<!--
### Feature gates for graduated or deprecated features
-->
### 已毕业和已废弃的特性门控  {#feature-gates-for-graduated-or-deprecated-features}

{{< table caption="已毕业或不推荐使用的特性门控" sortable="true" >}}

<!--
| Feature | Default | Stage | Since | Until |
-->
| 特性    | 默认值  | 状态  | 开始（Since） | 结束（Until） |
|---------|---------|-------|---------------|---------------|
| `APIListChunking` | `false` | Alpha | 1.8 | 1.8 |
| `APIListChunking` | `true` | Beta | 1.9 | 1.28 |
| `APIListChunking` | `true` | GA | 1.29 | - |
| `APISelfSubjectReview` | `false` | Alpha | 1.26 | 1.26 |
| `APISelfSubjectReview` | `true` | Beta | 1.27 | 1.27 |
| `APISelfSubjectReview` | `true` | GA | 1.28 | - |
| `CPUManager` | `false` | Alpha | 1.8 | 1.9 |
| `CPUManager` | `true` | Beta | 1.10 | 1.25 |
| `CPUManager` | `true` | GA | 1.26 | - |
| `CSIMigrationAzureFile` | `false` | Alpha | 1.15 | 1.20 |
| `CSIMigrationAzureFile` | `false` | Beta | 1.21 | 1.23 |
| `CSIMigrationAzureFile` | `true` | Beta | 1.24 | 1.25 |
| `CSIMigrationAzureFile` | `true` | GA | 1.26 | |
| `CSIMigrationRBD` | `false` | Alpha | 1.23 | 1.27 |
| `CSIMigrationRBD` | `false` | Deprecated | 1.28 | |
| `CSIMigrationvSphere` | `false` | Alpha | 1.18 | 1.18 |
| `CSIMigrationvSphere` | `false` | Beta | 1.19 | 1.24 |
| `CSIMigrationvSphere` | `true` | Beta | 1.25 | 1.25 |
| `CSIMigrationvSphere` | `true` | GA | 1.26 | - |
| `CSINodeExpandSecret` | `false` | Alpha | 1.25 | 1.26 |
| `CSINodeExpandSecret` | `true` | Beta | 1.27 | 1.28 |
| `CSINodeExpandSecret` | `true` | GA   | 1.29 | |
| `ComponentSLIs` | `false` | Alpha | 1.26 | 1.26 |
| `ComponentSLIs` | `true` | Beta | 1.27 | 1.28|
| `ComponentSLIs` | `true` | GA | 1.29 | - |
| `ConsistentHTTPGetHandlers` | `true` | GA | 1.25 | - |
| `CustomResourceValidationExpressions` | `false` | Alpha | 1.23 | 1.24 |
| `CustomResourceValidationExpressions` | `true`  | Beta  | 1.25 | 1.28 |
| `CustomResourceValidationExpressions` | `true`  | GA | 1.29 | - |
| `DaemonSetUpdateSurge` | `false` | Alpha | 1.21 | 1.21 |
| `DaemonSetUpdateSurge` | `true` | Beta | 1.22 | 1.24 |
| `DaemonSetUpdateSurge` | `true` | GA | 1.25 | |
| `DefaultHostNetworkHostPortsInPodTemplates` | `false` | Deprecated | 1.28 | |
| `EfficientWatchResumption` | `false` | Alpha | 1.20 | 1.20 |
| `EfficientWatchResumption` | `true` | Beta | 1.21 | 1.23 |
| `EfficientWatchResumption` | `true` | GA | 1.24 | |
| `ExecProbeTimeout` | `true` | GA | 1.20 | |
| `ExpandedDNSConfig` | `false` | Alpha | 1.22 | 1.25 |
| `ExpandedDNSConfig` | `true` | Beta | 1.26 | 1.27 |
| `ExpandedDNSConfig` | `true` | GA | 1.28 | |
| `ExperimentalHostUserNamespaceDefaulting` | `false` | Beta | 1.5 | 1.27 |
| `ExperimentalHostUserNamespaceDefaulting` | `false` | Deprecated | 1.28 | |
| `IPTablesOwnershipCleanup` | `false` | Alpha | 1.25 | 1.26 |
| `IPTablesOwnershipCleanup` | `true` | Beta | 1.27 | 1.27 |
| `IPTablesOwnershipCleanup` | `true` | GA | 1.28 | |
| `InTreePluginRBDUnregister` | `false` | Alpha | 1.23 | 1.27 |
| `InTreePluginRBDUnregister` | `false` | Deprecated | 1.28 | |
| `JobReadyPods` | `false` | Alpha | 1.23 | 1.23 |
| `JobReadyPods` | `true` | Beta | 1.24 | 1.28 |
| `JobReadyPods` | `true` | GA | 1.29 | |
| `JobTrackingWithFinalizers` | `false` | Alpha | 1.22 | 1.22 |
| `JobTrackingWithFinalizers` | `false` | Beta | 1.23 | 1.24 |
| `JobTrackingWithFinalizers` | `true` | Beta | 1.25 | 1.25 |
| `JobTrackingWithFinalizers` | `true` | GA | 1.26 | |
| `KMSv1` | `true` | Deprecated | 1.28 | 1.28 |
| `KMSv1` | `false` | Deprecated | 1.29 | |
| `KMSv2` | `false` | Alpha | 1.25 | 1.26 |
| `KMSv2` | `true` | Beta | 1.27 | 1.28 |
| `KMSv2` | `true` | GA | 1.29 | |
| `KMSv2KDF` | `false` | Beta | 1.28 | 1.28 |
| `KMSv2KDF` | `true` | GA | 1.29 | |
| `KubeletPodResources` | `false` | Alpha | 1.13 | 1.14 |
| `KubeletPodResources` | `true` | Beta | 1.15 | 1.27 |
| `KubeletPodResources` | `true` | GA | 1.28 | |
| `KubeletPodResourcesGetAllocatable` | `false` | Alpha | 1.21 | 1.22 |
| `KubeletPodResourcesGetAllocatable` | `true` | Beta | 1.23 | 1.27 |
| `KubeletPodResourcesGetAllocatable` | `true` | GA | 1.28 | |
| `LegacyServiceAccountTokenTracking` | `false` | Alpha | 1.26 | 1.26 |
| `LegacyServiceAccountTokenTracking` | `true` | Beta | 1.27 | 1.27 |
| `LegacyServiceAccountTokenTracking` | `true` | GA | 1.28 | |
| `MinimizeIPTablesRestore` | `false` | Alpha | 1.26 | 1.26 |
| `MinimizeIPTablesRestore` | `true` | Beta | 1.27 | 1.27 |
| `MinimizeIPTablesRestore` | `true` | GA | 1.28 | |
| `NodeOutOfServiceVolumeDetach` | `false` | Alpha | 1.24 | 1.25 |
| `NodeOutOfServiceVolumeDetach` | `true` | Beta | 1.26 | 1.27 |
| `NodeOutOfServiceVolumeDetach` | `true` | GA | 1.28 | |
| `OpenAPIV3` | `false` | Alpha | 1.23 | 1.23 |
| `OpenAPIV3` | `true` | Beta | 1.24 | 1.26 |
| `OpenAPIV3` | `true` | GA | 1.27 | |
| `ProbeTerminationGracePeriod` | `false` | Alpha | 1.21 | 1.21 |
| `ProbeTerminationGracePeriod` | `false` | Beta | 1.22 | 1.24 |
| `ProbeTerminationGracePeriod` | `true` | Beta | 1.25 | 1.27 |
| `ProbeTerminationGracePeriod` | `true` | GA | 1.28 | |
| `ProxyTerminatingEndpoints` | `false` | Alpha | 1.22 | 1.25 |
| `ProxyTerminatingEndpoints` | `true` | Beta | 1.26 | 1.27 |
| `ProxyTerminatingEndpoints` | `true` | GA | 1.28 | |
| `ReadWriteOncePod` | `false` | Alpha | 1.22 | 1.26 |
| `ReadWriteOncePod` | `true` | Beta | 1.27 | 1.28 |
| `ReadWriteOncePod` | `true` | GA | 1.29 | |
| `RemoveSelfLink` | `false` | Alpha | 1.16 | 1.19 |
| `RemoveSelfLink` | `true` | Beta | 1.20 | 1.23 |
| `RemoveSelfLink` | `true` | GA | 1.24 | |
| `SeccompDefault` | `false` | Alpha | 1.22 | 1.24 |
| `SeccompDefault` | `true` | Beta | 1.25 | 1.26 |
| `SeccompDefault` | `true` | GA | 1.27 | - |
| `ServerSideApply` | `false` | Alpha | 1.14 | 1.15 |
| `ServerSideApply` | `true` | Beta | 1.16 | 1.21 |
| `ServerSideApply` | `true` | GA | 1.22 | - |
| `ServerSideFieldValidation` | `false` | Alpha | 1.23 | 1.24 |
| `ServerSideFieldValidation` | `true` | Beta | 1.25 | 1.26 |
| `ServerSideFieldValidation` | `true` | GA | 1.27 | - |
| `ServiceIPStaticSubrange` | `false` | Alpha | 1.24 | 1.24 |
| `ServiceIPStaticSubrange` | `true` | Beta | 1.25 | 1.25 |
| `ServiceIPStaticSubrange` | `true` | GA | 1.26 | - |
| `ServiceInternalTrafficPolicy` | `false` | Alpha | 1.21 | 1.21 |
| `ServiceInternalTrafficPolicy` | `true` | Beta | 1.22 | 1.25 |
| `ServiceInternalTrafficPolicy` | `true` | GA | 1.26 | - |
| `ServiceNodePortStaticSubrange` | `false` | Alpha | 1.27 | 1.27 |
| `ServiceNodePortStaticSubrange` | `true` | Beta | 1.28 | 1.28 |
| `ServiceNodePortStaticSubrange` | `true` | GA | 1.29 | - |
| `SkipReadOnlyValidationGCE` | `false` | Alpha | 1.28 | 1.28 |
| `SkipReadOnlyValidationGCE` | `true` | Deprecated | 1.29 | |
| `WatchBookmark` | `false` | Alpha | 1.15 | 1.15 |
| `WatchBookmark` | `true` | Beta | 1.16 | 1.16 |
| `WatchBookmark` | `true` | GA | 1.17 | - |
{{< /table >}}

<!--
## Using a feature

### Feature stages
-->
## 使用特性   {#using-a-feature}

### 特性阶段    {#feature-stages}

<!--
A feature can be in *Alpha*, *Beta* or *GA* stage.
An *Alpha* feature means:
-->
处于 **Alpha**、**Beta**、**GA** 阶段的特性。

**Alpha** 特性代表：

<!--
* Disabled by default.
* Might be buggy. Enabling the feature may expose bugs.
* Support for feature may be dropped at any time without notice.
* The API may change in incompatible ways in a later software release without notice.
* Recommended for use only in short-lived testing clusters, due to increased
  risk of bugs and lack of long-term support.
-->
* 默认禁用。
* 可能有错误，启用此特性可能会导致错误。
* 随时可能删除对此特性的支持，恕不另行通知。
* 在以后的软件版本中，API 可能会以不兼容的方式更改，恕不另行通知。
* 建议将其仅用于短期测试中，因为开启特性会增加错误的风险，并且缺乏长期支持。

<!--
A *Beta* feature means:
-->
**Beta** 特性代表：

<!--
* Usually enabled by default. Beta API groups are
  [disabled by default](https://github.com/kubernetes/enhancements/tree/master/keps/sig-architecture/3136-beta-apis-off-by-default).
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
* 通常默认启用。Beta API 组[默认是被禁用的](https://github.com/kubernetes/enhancements/tree/master/keps/sig-architecture/3136-beta-apis-off-by-default)。
* 该特性已经经过良好测试。启用该特性是安全的。
* 尽管详细信息可能会更改，但不会放弃对整体特性的支持。
* 对象的架构或语义可能会在随后的 Beta 或稳定版本中以不兼容的方式更改。
  当发生这种情况时，我们将提供迁移到下一版本的说明。此特性可能需要删除、编辑和重新创建 API 对象。
  编辑过程可能需要慎重操作，因为这可能会导致依赖该特性的应用程序停机。
* 推荐仅用于非关键业务用途，因为在后续版本中可能会发生不兼容的更改。如果你具有多个可以独立升级的，则可以放宽此限制。

{{< note >}}
<!--
Please do try *Beta* features and give feedback on them!
After they exit beta, it may not be practical for us to make more changes.
-->
请试用 **Beta** 特性并提供相关反馈！
一旦特性结束 Beta 状态，我们就不太可能再对特性进行大幅修改。
{{< /note >}}

<!--
A *General Availability* (GA) feature is also referred to as a *stable* feature. It means:
-->
**General Availability**（GA）特性也称为**稳定**特性，**GA** 特性代表着：

<!--
* The feature is always enabled; you cannot disable it.
* The corresponding feature gate is no longer needed.
* Stable versions of features will appear in released software for many subsequent versions.
-->
* 此特性会一直启用；你不能禁用它。
* 不再需要相应的特性门控。
* 对于许多后续版本，特性的稳定版本将出现在发行的软件中。

<!--
## List of feature gates {#feature-gates}

Each feature gate is designed for enabling/disabling a specific feature:
-->
### 特性门控列表 {#feature-gates}

每个特性门控均用于启用或禁用某个特定的特性：

<!--
Update this section when you add/remove any feature-gate-description file in the following folder:

```
content/zh-cn/reference/command-line-tools-reference/feature-gates/
```
-->

## {{% heading "whatsnext" %}}

<!--
* The [deprecation policy](/docs/reference/using-api/deprecation-policy/) for Kubernetes explains
  the project's approach to removing features and components.
* Since Kubernetes 1.24, new beta APIs are not enabled by default.  When enabling a beta
  feature, you will also need to enable any associated API resources.
  For example, to enable a particular resource like
  `storage.k8s.io/v1beta1/csistoragecapacities`, set `--runtime-config=storage.k8s.io/v1beta1/csistoragecapacities`.
  See [API Versioning](/docs/reference/using-api/#api-versioning) for more details on the command line flags.
-->
* Kubernetes 的[弃用策略](/zh-cn/docs/reference/using-api/deprecation-policy/)介绍了项目针对已移除特性和组件的处理方法。
* 从 Kubernetes 1.24 开始，默认不启用新的 Beta API。
  启用 Beta 功能时，还需要启用所有关联的 API 资源。
  例如：要启用一个特定资源，如 `storage.k8s.io/v1beta1/csistoragecapacities`，
  请设置 `--runtime-config=storage.k8s.io/v1beta1/csistoragecapacities`。
  有关命令行标志的更多详细信息，请参阅 [API 版本控制](/zh-cn/docs/reference/using-api/#api-versioning)。
