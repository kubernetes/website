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
## 概述

特性门控是描述 Kubernetes 特性的一组键值对。你可以在 Kubernetes 的各个组件中使用
`--feature-gates` flag 来启用或禁用这些特性。

<!--
Each Kubernetes component lets you enable or disable a set of feature gates that
are relevant to that component.
Use `-h` flag to see a full set of feature gates for all components.
To set feature gates for a component, such as kubelet, use the `--feature-gates`
flag assigned to a list of feature pairs:
-->
每个 Kubernetes 组件都支持启用或禁用与该组件相关的一组特性门控。
使用 `-h` 参数来查看所有组件支持的完整特性门控。
要为诸如 kubelet 之类的组件设置特性门控，请使用 `--feature-gates` 参数，并向其
传递一个特性设置键值对列表：

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
- 如果某个特性处于稳定状态，你可以在
  [已毕业和废弃特性门控表](#feature-gates-for-graduated-or-deprecated-features)
  中找到该特性的所有阶段。
- [已毕业和废弃特性门控表](#feature-gates-for-graduated-or-deprecated-features)
  还列出了废弃的和已被移除的特性。

<!--
### Feature gates for Alpha or Beta features

{{< table caption="Feature gates for features in Alpha or Beta states" >}}

| Feature | Default | Stage | Since | Until |

{{< /table >}}
-->
### Alpha 和 Beta 状态的特性门控  {#feature-gates-for-alpha-or-beta-features}

{{< table caption="处于 Alpha 或 Beta 状态的特性门控" >}}

| 特性    | 默认值  | 状态  | 开始（Since） | 结束（Until） |
|---------|---------|-------|---------------|---------------|
| `APIListChunking` | `false` | Alpha | 1.8 | 1.8 |
| `APIListChunking` | `true` | Beta | 1.9 | |
| `APIPriorityAndFairness` | `false` | Alpha | 1.18 | 1.19 |
| `APIPriorityAndFairness` | `true` | Beta | 1.20 | |
| `APIResponseCompression` | `false` | Alpha | 1.7 | 1.15 |
| `APIResponseCompression` | `true` | Beta | 1.16 | |
| `APIServerIdentity` | `false` | Alpha | 1.20 | |
| `APIServerTracing` | `false` | Alpha | 1.22 | |
| `AllowInsecureBackendProxy` | `true` | Beta | 1.17 | |
| `AnyVolumeDataSource` | `false` | Alpha | 1.18 | 1.23 |
| `AnyVolumeDataSource` | `true` | Beta | 1.24 | |
| `AppArmor` | `true` | Beta | 1.4 | |
| `CPUManager` | `false` | Alpha | 1.8 | 1.9 |
| `CPUManager` | `true` | Beta | 1.10 | |
| `CPUManagerPolicyAlphaOptions` | `false` | Alpha | 1.23 | |
| `CPUManagerPolicyBetaOptions` | `true` | Beta | 1.23 | |
| `CPUManagerPolicyOptions` | `false` | Alpha | 1.22 | 1.22 |
| `CPUManagerPolicyOptions` | `true` | Beta | 1.23 | |
| `CSIInlineVolume` | `false` | Alpha | 1.15 | 1.15 |
| `CSIInlineVolume` | `true` | Beta | 1.16 | - |
| `CSIMigration` | `false` | Alpha | 1.14 | 1.16 |
| `CSIMigration` | `true` | Beta | 1.17 | |
| `CSIMigrationAWS` | `false` | Alpha | 1.14 | 1.16 |
| `CSIMigrationAWS` | `false` | Beta | 1.17 | 1.22 |
| `CSIMigrationAWS` | `true` | Beta | 1.23 | |
| `CSIMigrationAzureFile` | `false` | Alpha | 1.15 | 1.19 |
| `CSIMigrationAzureFile` | `false` | Beta | 1.21 | 1.23 |
| `CSIMigrationAzureFile` | `true` | Beta | 1.24 | |
| `CSIMigrationGCE` | `false` | Alpha | 1.14 | 1.16 |
| `CSIMigrationGCE` | `false` | Beta | 1.17 | 1.22 |
| `CSIMigrationGCE` | `true` | Beta | 1.23 | |
| `CSIMigrationvSphere` | `false` | Beta | 1.19 | |
| `CSIMigrationPortworx` | `false` | Alpha | 1.23 | |
| `csiMigrationRBD` | `false` | Alpha | 1.23 | |
| `CSIVolumeHealth` | `false` | Alpha | 1.21 | |
| `ContextualLogging` | `false` | Alpha | 1.24 | |
| `CustomCPUCFSQuotaPeriod` | `false` | Alpha | 1.12 | |
| `CustomResourceValidationExpressions` | `false` | Alpha | 1.23 | |
| `DaemonSetUpdateSurge` | `false` | Alpha | 1.21 | 1.21 |
| `DaemonSetUpdateSurge` | `true` | Beta | 1.22 | |
| `DelegateFSGroupToCSIDriver` | `false` | Alpha | 1.22 | 1.22 |
| `DelegateFSGroupToCSIDriver` | `true` | Beta | 1.23 | |
| `DevicePlugins` | `false` | Alpha | 1.8 | 1.9 |
| `DevicePlugins` | `true` | Beta | 1.10 | |
| `DisableAcceleratorUsageMetrics` | `false` | Alpha | 1.19 | 1.19 |
| `DisableAcceleratorUsageMetrics` | `true` | Beta | 1.20 | |
| `DisableCloudProviders` | `false` | Alpha | 1.22 | |
| `DisableKubeletCloudCredentialProviders` | `false` | Alpha | 1.23 | |
| `DownwardAPIHugePages` | `false` | Alpha | 1.20 | 1.20 |
| `DownwardAPIHugePages` | `false` | Beta | 1.21 | 1.21 |
| `DownwardAPIHugePages` | `true` | Beta | 1.22 | |
| `EndpointSliceTerminatingCondition` | `false` | Alpha | 1.20 | 1.21 |
| `EndpointSliceTerminatingCondition` | `true` | Beta | 1.22 | |
| `EphemeralContainers` | `false` | Alpha | 1.16 | 1.22 |
| `EphemeralContainers` | `true` | Beta | 1.23 | |
| `ExpandedDNSConfig` | `false` | Alpha | 1.22 | |
| `ExperimentalHostUserNamespaceDefaulting` | `false` | Beta | 1.5 | |
| `GracefulNodeShutdown` | `false` | Alpha | 1.20 | 1.20 |
| `GracefulNodeShutdown` | `true` | Beta | 1.21 | |
| `GracefulNodeShutdownBasedOnPodPriority` | `false` | Alpha | 1.23 | 1.23 |
| `GracefulNodeShutdownBasedOnPodPriority` | `true` | Beta | 1.24 | |
| `GRPCContainerProbe` | `false` | Alpha | 1.23 | 1.23 |
| `GRPCContainerProbe` | `true` | Beta | 1.24 | |
| `HonorPVReclaimPolicy` | `false` | Alpha | 1.23 |  |
| `HPAContainerMetrics` | `false` | Alpha | 1.20 | |
| `HPAScaleToZero` | `false` | Alpha | 1.16 | |
| `IdentifyPodOS` | `false` | Alpha | 1.23 | 1.23 |
| `IdentifyPodOS` | `true` | Beta | 1.24 | |
| `InTreePluginAWSUnregister` | `false` | Alpha | 1.21 | |
| `InTreePluginAzureDiskUnregister` | `false` | Alpha | 1.21 | |
| `InTreePluginAzureFileUnregister` | `false` | Alpha | 1.21 | |
| `InTreePluginGCEUnregister` | `false` | Alpha | 1.21 | |
| `InTreePluginOpenStackUnregister` | `false` | Alpha | 1.21 | |
| `InTreePluginPortworxUnregister` | `false` | Alpha | 1.23 | |
| `InTreePluginRBDUnregister` | `false` | Alpha | 1.23 | |
| `InTreePluginvSphereUnregister` | `false` | Alpha | 1.21 | |
| `JobMutableNodeSchedulingDirectives` | `true` | Beta | 1.23 | |
| `JobReadyPods` | `false` | Alpha | 1.23 | 1.23 |
| `JobReadyPods` | `true` | Beta | 1.24 | |
| `JobTrackingWithFinalizers` | `false` | Alpha | 1.22 | 1.22 |
| `JobTrackingWithFinalizers` | `true` | Beta | 1.23 | 1.23 |
| `JobTrackingWithFinalizers` | `false` | Beta | 1.24 | |
| `KubeletCredentialProviders` | `false` | Alpha | 1.20 | 1.23 |
| `KubeletCredentialProviders` | `true` | Beta | 1.24 | |
| `KubeletInUserNamespace` | `false` | Alpha | 1.22 | |
| `KubeletPodResources` | `false` | Alpha | 1.13 | 1.14 |
| `KubeletPodResources` | `true` | Beta | 1.15 | |
| `KubeletPodResourcesGetAllocatable` | `false` | Alpha | 1.21 | 1.22 |
| `KubeletPodResourcesGetAllocatable` | `true` | Beta | 1.23 | |
| `LocalStorageCapacityIsolation` | `false` | Alpha | 1.7 | 1.9 |
| `LocalStorageCapacityIsolation` | `true` | Beta | 1.10 | |
| `LocalStorageCapacityIsolationFSQuotaMonitoring` | `false` | Alpha | 1.15 | |
| `LogarithmicScaleDown` | `false` | Alpha | 1.21 | 1.21 |
| `LogarithmicScaleDown` | `true` | Beta | 1.22 | |
| `MaxUnavailableStatefulSet` | `false` | Alpha | 1.24 | |
| `MemoryManager` | `false` | Alpha | 1.21 | 1.21 |
| `MemoryManager` | `true` | Beta | 1.22 | |
| `MemoryQoS` | `false` | Alpha | 1.22 | |
| `MinDomainsInPodTopologySpread` | `false` | Alpha | 1.24 | |
| `MixedProtocolLBService` | `false` | Alpha | 1.20 | 1.23 |
| `MixedProtocolLBService` | `true` | Beta | 1.24 | |
| `NetworkPolicyEndPort` | `false` | Alpha | 1.21 | 1.21 |
| `NetworkPolicyEndPort` | `true` | Beta | 1.22 |  |
| `NetworkPolicyStatus` | `false` | Alpha | 1.24 |  |
| `NodeSwap` | `false` | Alpha | 1.22 | |
| `NodeOutOfServiceVolumeDetach` | `false` | Alpha | 1.24 | |
| `OpenAPIEnums` | `false` | Alpha | 1.23 | 1.23 |
| `OpenAPIEnums` | `true` | Beta | 1.24 | |
| `OpenAPIV3` | `false` | Alpha | 1.23 | 1.23 |
| `OpenAPIV3` | `true` | Beta | 1.24 | |
| `PodAndContainerStatsFromCRI` | `false` | Alpha | 1.23 | |
| `PodDeletionCost` | `false` | Alpha | 1.21 | 1.21 |
| `PodDeletionCost` | `true` | Beta | 1.22 | |
| `PodSecurity` | `false` | Alpha | 1.22 | 1.22 |
| `PodSecurity` | `true` | Beta | 1.23 | |
| `ProbeTerminationGracePeriod` | `false` | Alpha | 1.21 | 1.21 |
| `ProbeTerminationGracePeriod` | `false` | Beta | 1.22 | |
| `ProcMountType` | `false` | Alpha | 1.12 | |
| `ProxyTerminatingEndpoints` | `false` | Alpha | 1.22 | |
| `QOSReserved` | `false` | Alpha | 1.11 | |
| `ReadWriteOncePod` | `false` | Alpha | 1.22 | |
| `RecoverVolumeExpansionFailure` | `false` | Alpha | 1.23 | |
| `RemainingItemCount` | `false` | Alpha | 1.15 | 1.15 |
| `RemainingItemCount` | `true` | Beta | 1.16 | |
| `RotateKubeletServerCertificate` | `false` | Alpha | 1.7 | 1.11 |
| `RotateKubeletServerCertificate` | `true` | Beta | 1.12 | |
| `SeccompDefault` | `false` | Alpha | 1.22 | |
| `ServerSideFieldValidation` | `false` | Alpha | 1.23 | - |
| `ServiceInternalTrafficPolicy` | `false` | Alpha | 1.21 | 1.21 |
| `ServiceInternalTrafficPolicy` | `true` | Beta | 1.22 | |
| `ServiceIPStaticSubrange` | `false` | Alpha | 1.24 | |
| `SizeMemoryBackedVolumes` | `false` | Alpha | 1.20 | 1.21 |
| `SizeMemoryBackedVolumes` | `true` | Beta | 1.22 | |
| `StatefulSetAutoDeletePVC` | `false` | Alpha | 1.22 | |
| `StatefulSetMinReadySeconds` | `false` | Alpha | 1.22 | 1.22 |
| `StatefulSetMinReadySeconds` | `true` | Beta | 1.23 | |
| `StorageVersionAPI` | `false` | Alpha | 1.20 | |
| `StorageVersionHash` | `false` | Alpha | 1.14 | 1.14 |
| `StorageVersionHash` | `true` | Beta | 1.15 | |
| `TopologyAwareHints` | `false` | Alpha | 1.21 | 1.22 |
| `TopologyAwareHints` | `false` | Beta | 1.23 | 1.23 |
| `TopologyAwareHints` | `true` | Beta | 1.24 | |
| `TopologyManager` | `false` | Alpha | 1.16 | 1.17 |
| `TopologyManager` | `true` | Beta | 1.18 | |
| `VolumeCapacityPriority` | `false` | Alpha | 1.21 | - |
| `WinDSR` | `false` | Alpha | 1.14 | |
| `WinOverlay` | `false` | Alpha | 1.14 | 1.19 |
| `WinOverlay` | `true` | Beta | 1.20 | |
| `WindowsHostProcessContainers` | `false` | Alpha | 1.22 | 1.22 |
| `WindowsHostProcessContainers` | `true` | Beta | 1.23 | |
{{< /table >}}

<!--
### Feature gates for graduated or deprecated features

{{< table caption="Feature Gates for Graduated or Deprecated Features" >}}

| Feature | Default | Stage | Since | Until |

{{< /table >}}
-->
### 已毕业和已废弃的特性门控  {#feature-gates-for-graduated-or-deprecated-features}

{{< table caption="已毕业或不推荐使用的特性门控" >}}

| 特性    | 默认值  | 状态  | 开始（Since） | 结束（Until） |
|---------|---------|-------|---------------|---------------|
| `Accelerators` | `false` | Alpha | 1.6 | 1.10 |
| `Accelerators` | - | Deprecated | 1.11 | - |
| `AdvancedAuditing` | `false` | Alpha | 1.7 | 1.7 |
| `AdvancedAuditing` | `true` | Beta | 1.8 | 1.11 |
| `AdvancedAuditing` | `true` | GA | 1.12 | - |
| `AffinityInAnnotations` | `false` | Alpha | 1.6 | 1.7 |
| `AffinityInAnnotations` | - | Deprecated | 1.8 | - |
| `AllowExtTrafficLocalEndpoints` | `false` | Beta | 1.4 | 1.6 |
| `AllowExtTrafficLocalEndpoints` | `true` | GA | 1.7 | - |
| `AttachVolumeLimit` | `false` | Alpha | 1.11 | 1.11 |
| `AttachVolumeLimit` | `true` | Beta | 1.12 | 1.16 |
| `AttachVolumeLimit` | `true` | GA | 1.17 | - |
| `BalanceAttachedNodeVolumes` | `false` | Alpha | 1.11 | 1.21 |
| `BalanceAttachedNodeVolumes` | `false` | Deprecated | 1.22 | |
| `BlockVolume` | `false` | Alpha | 1.9 | 1.12 |
| `BlockVolume` | `true` | Beta | 1.13 | 1.17 |
| `BlockVolume` | `true` | GA | 1.18 | - |
| `BoundServiceAccountTokenVolume` | `false` | Alpha | 1.13 | 1.20 |
| `BoundServiceAccountTokenVolume` | `true` | Beta | 1.21 | 1.21 |
| `BoundServiceAccountTokenVolume` | `true` | GA | 1.22 | - |
| `ConfigurableFSGroupPolicy` | `false` | Alpha | 1.18 | 1.19 |
| `ConfigurableFSGroupPolicy` | `true` | Beta | 1.20 | 1.22 |
| `ConfigurableFSGroupPolicy` | `true` | GA | 1.23 | - |
| `ControllerManagerLeaderMigration` | `false` | Alpha | 1.21 | 1.21 |
| `ControllerManagerLeaderMigration` | `true` | Beta | 1.22 | 1.23 |
| `ControllerManagerLeaderMigration` | `true` | GA | 1.24 | - |
| `CRIContainerLogRotation` | `false` | Alpha | 1.10 | 1.10 |
| `CRIContainerLogRotation` | `true` | Beta | 1.11 | 1.20 |
| `CRIContainerLogRotation` | `true` | GA | 1.21 | - |
| `CSIBlockVolume` | `false` | Alpha | 1.11 | 1.13 |
| `CSIBlockVolume` | `true` | Beta | 1.14 | 1.17 |
| `CSIBlockVolume` | `true` | GA | 1.18 | - |
| `CSIDriverRegistry` | `false` | Alpha | 1.12 | 1.13 |
| `CSIDriverRegistry` | `true` | Beta | 1.14 | 1.17 |
| `CSIDriverRegistry` | `true` | GA | 1.18 | - |
| `CSIMigrationAWSComplete` | `false` | Alpha | 1.17 | 1.20 |
| `CSIMigrationAWSComplete` | - | Deprecated | 1.21 | - |
| `CSIMigrationAzureDisk` | `false` | Alpha | 1.15 | 1.18 |
| `CSIMigrationAzureDisk` | `false` | Beta | 1.19 | 1.22 |
| `CSIMigrationAzureDisk` | `true` | Beta | 1.23 | 1.23 |
| `CSIMigrationAzureDisk` | `true` | GA | 1.24 | |
| `CSIMigrationAzureDiskComplete` | `false` | Alpha | 1.17 | 1.20 |
| `CSIMigrationAzureDiskComplete` | - | Deprecated | 1.21 | - |
| `CSIMigrationAzureFileComplete` | `false` | Alpha | 1.17 | 1.20 |
| `CSIMigrationAzureFileComplete` | - | Deprecated |  1.21 | - |
| `CSIMigrationGCEComplete` | `false` | Alpha | 1.17 | 1.20 |
| `CSIMigrationGCEComplete` | - | Deprecated | 1.21 | - |
| `CSIMigrationOpenStack` | `false` | Alpha | 1.14 | 1.17 |
| `CSIMigrationOpenStack` | `true` | Beta | 1.18 | 1.23 |
| `CSIMigrationOpenStack` | `true` | GA | 1.24 | |
| `CSIMigrationOpenStackComplete` | `false` | Alpha | 1.17 | 1.20 |
| `CSIMigrationOpenStackComplete` | - | Deprecated | 1.21 | - |
| `CSIMigrationvSphereComplete` | `false` | Beta | 1.19 | 1.21 |
| `CSIMigrationvSphereComplete` | - | Deprecated | 1.22 | - |
| `CSINodeInfo` | `false` | Alpha | 1.12 | 1.13 |
| `CSINodeInfo` | `true` | Beta | 1.14 | 1.16 |
| `CSINodeInfo` | `true` | GA | 1.17 | - |
| `CSIPersistentVolume` | `false` | Alpha | 1.9 | 1.9 |
| `CSIPersistentVolume` | `true` | Beta | 1.10 | 1.12 |
| `CSIPersistentVolume` | `true` | GA | 1.13 | - |
| `CSIServiceAccountToken` | `false` | Alpha | 1.20 | 1.20 |
| `CSIServiceAccountToken` | `true` | Beta | 1.21 | 1.21 |
| `CSIServiceAccountToken` | `true` | GA | 1.22 | - |
| `CSIStorageCapacity` | `false` | Alpha | 1.19 | 1.20 |
| `CSIStorageCapacity` | `true` | Beta | 1.21 | 1.23 |
| `CSIStorageCapacity` | `true` | GA | 1.24 | - |
| `CSIVolumeFSGroupPolicy` | `false` | Alpha | 1.19 | 1.19 |
| `CSIVolumeFSGroupPolicy` | `true` | Beta | 1.20 | 1.22 |
| `CSIVolumeFSGroupPolicy` | `true` | GA | 1.23 | |
| `CSRDuration` | `true` | Beta | 1.22 | 1.23 |
| `CSRDuration` | `true` | GA | 1.24 | - |
| `CronJobControllerV2` | `false` | Alpha | 1.20 | 1.20 |
| `CronJobControllerV2` | `true` | Beta | 1.21 | 1.21 |
| `CronJobControllerV2` | `true` | GA | 1.22 | - |
| `CronJobTimeZone` | `false` | Alpha | 1.24 | |
| `CustomPodDNS` | `false` | Alpha | 1.9 | 1.9 |
| `CustomPodDNS` | `true` | Beta| 1.10 | 1.13 |
| `CustomPodDNS` | `true` | GA | 1.14 | - |
| `CustomResourceDefaulting` | `false` | Alpha| 1.15 | 1.15 |
| `CustomResourceDefaulting` | `true` | Beta | 1.16 | 1.16 |
| `CustomResourceDefaulting` | `true` | GA | 1.17 | - |
| `CustomResourcePublishOpenAPI` | `false` | Alpha| 1.14 | 1.14 |
| `CustomResourcePublishOpenAPI` | `true` | Beta| 1.15 | 1.15 |
| `CustomResourcePublishOpenAPI` | `true` | GA | 1.16 | - |
| `CustomResourceSubresources` | `false` | Alpha | 1.10 | 1.10 |
| `CustomResourceSubresources` | `true` | Beta | 1.11 | 1.15 |
| `CustomResourceSubresources` | `true` | GA | 1.16 | - |
| `CustomResourceValidation` | `false` | Alpha | 1.8 | 1.8 |
| `CustomResourceValidation` | `true` | Beta | 1.9 | 1.15 |
| `CustomResourceValidation` | `true` | GA | 1.16 | - |
| `CustomResourceWebhookConversion` | `false` | Alpha | 1.13 | 1.14 |
| `CustomResourceWebhookConversion` | `true` | Beta | 1.15 | 1.15 |
| `CustomResourceWebhookConversion` | `true` | GA | 1.16 | - |
| `DefaultPodTopologySpread` | `false` | Alpha | 1.19 | 1.19 |
| `DefaultPodTopologySpread` | `true` | Beta | 1.20 | 1.23 |
| `DefaultPodTopologySpread` | `true` | GA | 1.24 | - |
| `DryRun` | `false` | Alpha | 1.12 | 1.12 |
| `DryRun` | `true` | Beta | 1.13 | 1.18 |
| `DryRun` | `true` | GA | 1.19 | - |
| `DynamicAuditing` | `false` | Alpha | 1.13 | 1.18 |
| `DynamicAuditing` | - | Deprecated | 1.19 | - |
| `DynamicKubeletConfig` | `false` | Alpha | 1.4 | 1.10 |
| `DynamicKubeletConfig` | `true` | Beta | 1.11 | 1.21 |
| `DynamicKubeletConfig` | `false` | Deprecated | 1.22 | - |
| `DynamicProvisioningScheduling` | `false` | Alpha | 1.11 | 1.11 |
| `DynamicProvisioningScheduling` | - | Deprecated| 1.12 | - |
| `DynamicVolumeProvisioning` | `true` | Alpha | 1.3 | 1.7 |
| `DynamicVolumeProvisioning` | `true` | GA | 1.8 | - |
| `EfficientWatchResumption` | `false` | Alpha | 1.20 | 1.20 |
| `EfficientWatchResumption` | `true` | Beta | 1.21 | 1.23 |
| `EfficientWatchResumption` | `true` | GA | 1.24 | - |
| `EnableAggregatedDiscoveryTimeout` | `true` | Deprecated | 1.16 | - |
| `EnableEquivalenceClassCache` | `false` | Alpha | 1.8 | 1.14 |
| `EnableEquivalenceClassCache` | - | Deprecated | 1.15 | - |
| `EndpointSlice` | `false` | Alpha | 1.16 | 1.16 |
| `EndpointSlice` | `false` | Beta | 1.17 | 1.17 |
| `EndpointSlice` | `true` | Beta | 1.18 | 1.20 |
| `EndpointSlice` | `true` | GA | 1.21 | - |
| `EndpointSliceNodeName` | `false` | Alpha | 1.20 | 1.20 |
| `EndpointSliceNodeName` | `true` | GA | 1.21 | - |
| `EndpointSliceProxying` | `false` | Alpha | 1.18 | 1.18 |
| `EndpointSliceProxying` | `true` | Beta | 1.19 | 1.21 |
| `EndpointSliceProxying` | `true` | GA | 1.22 | - |
| `EvenPodsSpread` | `false` | Alpha | 1.16 | 1.17 |
| `EvenPodsSpread` | `true` | Beta | 1.18 | 1.18 |
| `EvenPodsSpread` | `true` | GA | 1.19 | - |
| `ExecProbeTimeout` | `true` | GA | 1.20 | - |
| `ExpandCSIVolumes` | `false` | Alpha | 1.14 | 1.15 |
| `ExpandCSIVolumes` | `true` | Beta | 1.16 | 1.23 |
| `ExpandCSIVolumes` | `true` | GA | 1.24 | - |
| `ExpandInUsePersistentVolumes` | `false` | Alpha | 1.11 | 1.14 |
| `ExpandInUsePersistentVolumes` | `true` | Beta | 1.15 | 1.23 |
| `ExpandInUsePersistentVolumes` | `true` | GA | 1.24 | - |
| `ExpandPersistentVolumes` | `false` | Alpha | 1.8 | 1.10 |
| `ExpandPersistentVolumes` | `true` | Beta | 1.11 | 1.23 |
| `ExpandPersistentVolumes` | `true` | GA | 1.24 |- |
| `ExperimentalCriticalPodAnnotation` | `false` | Alpha | 1.5 | 1.12 |
| `ExperimentalCriticalPodAnnotation` | `false` | Deprecated | 1.13 | - |
| `ExternalPolicyForExternalIP` | `true` | GA | 1.18 | - |
| `GCERegionalPersistentDisk` | `true` | Beta | 1.10 | 1.12 |
| `GCERegionalPersistentDisk` | `true` | GA | 1.13 | - |
| `GenericEphemeralVolume` | `false` | Alpha | 1.19 | 1.20 |
| `GenericEphemeralVolume` | `true` | Beta | 1.21 | 1.22 |
| `GenericEphemeralVolume` | `true` | GA | 1.23 | - |
| `HugePageStorageMediumSize` | `false` | Alpha | 1.18 | 1.18 |
| `HugePageStorageMediumSize` | `true` | Beta | 1.19 | 1.21 |
| `HugePageStorageMediumSize` | `true` | GA | 1.22 | - |
| `HugePages` | `false` | Alpha | 1.8 | 1.9 |
| `HugePages` | `true` | Beta| 1.10 | 1.13 |
| `HugePages` | `true` | GA | 1.14 | - |
| `HyperVContainer` | `false` | Alpha | 1.10 | 1.19 |
| `HyperVContainer` | `false` | Deprecated | 1.20 | - |
| `IPv6DualStack` | `false` | Alpha | 1.15 | 1.20 |
| `IPv6DualStack` | `true` | Beta | 1.21 | 1.22 |
| `IPv6DualStack` | `true` | GA | 1.23 | - |
| `ImmutableEphemeralVolumes` | `false` | Alpha | 1.18 | 1.18 |
| `ImmutableEphemeralVolumes` | `true` | Beta | 1.19 | 1.20 |
| `ImmutableEphemeralVolumes` | `true` | GA | 1.21 | |
| `IndexedJob` | `false` | Alpha | 1.21 | 1.21 |
| `IndexedJob` | `true` | Beta | 1.22 | 1.23 |
| `IndexedJob` | `true` | GA | 1.24 | - |
| `IngressClassNamespacedParams` | `false` | Alpha | 1.21 | 1.21 |
| `IngressClassNamespacedParams` | `true` | Beta | 1.22 | 1.22 |
| `IngressClassNamespacedParams` | `true` | GA | 1.23 | - |
| `Initializers` | `false` | Alpha | 1.7 | 1.13 |
| `Initializers` | - | Deprecated | 1.14 | - |
| `KubeletConfigFile` | `false` | Alpha | 1.8 | 1.9 |
| `KubeletConfigFile` | - | Deprecated | 1.10 | - |
| `KubeletPluginsWatcher` | `false` | Alpha | 1.11 | 1.11 |
| `KubeletPluginsWatcher` | `true` | Beta | 1.12 | 1.12 |
| `KubeletPluginsWatcher` | `true` | GA | 1.13 | - |
| `LegacyNodeRoleBehavior` | `false` | Alpha | 1.16 | 1.18 |
| `LegacyNodeRoleBehavior` | `true` | Beta | 1.19 | 1.20 |
| `LegacyNodeRoleBehavior` | `false` | GA | 1.21 | - |
| `LegacyServiceAccountTokenNoAutoGeneration` | `true` | Beta | 1.24 | |
| `MountContainers` | `false` | Alpha | 1.9 | 1.16 |
| `MountContainers` | `false` | Deprecated | 1.17 | - |
| `MountPropagation` | `false` | Alpha | 1.8 | 1.9 |
| `MountPropagation` | `true` | Beta | 1.10 | 1.11 |
| `MountPropagation` | `true` | GA | 1.12 | - |
| `NamespaceDefaultLabelName` | `true` | Beta | 1.21 | 1.21 |
| `NamespaceDefaultLabelName` | `true` | GA | 1.22 | - |
| `NodeDisruptionExclusion` | `false` | Alpha | 1.16 | 1.18 |
| `NodeDisruptionExclusion` | `true` | Beta | 1.19 | 1.20 |
| `NodeDisruptionExclusion` | `true` | GA | 1.21 | - |
| `NodeLease` | `false` | Alpha | 1.12 | 1.13 |
| `NodeLease` | `true` | Beta | 1.14 | 1.16 |
| `NodeLease` | `true` | GA | 1.17 | - |
| `NonPreemptingPriority` | `false` | Alpha | 1.15 | 1.18 |
| `NonPreemptingPriority` | `true` | Beta | 1.19 | 1.23 |
| `NonPreemptingPriority` | `true` | GA | 1.24 | - |
| `PVCProtection` | `false` | Alpha | 1.9 | 1.9 |
| `PVCProtection` | - | Deprecated | 1.10 | - |
| `PersistentLocalVolumes` | `false` | Alpha | 1.7 | 1.9 |
| `PersistentLocalVolumes` | `true` | Beta | 1.10 | 1.13 |
| `PersistentLocalVolumes` | `true` | GA | 1.14 | - |
| `PodAffinityNamespaceSelector` | `false` | Alpha | 1.21 | 1.21 |
| `PodAffinityNamespaceSelector` | `true` | Beta | 1.22 | 1.23 |
| `PodAffinityNamespaceSelector` | `true` | GA | 1.24 | - |
| `PodDisruptionBudget` | `false` | Alpha | 1.3 | 1.4 |
| `PodDisruptionBudget` | `true` | Beta | 1.5 | 1.20 |
| `PodDisruptionBudget` | `true` | GA | 1.21 | - |
| `PodOverhead` | `false` | Alpha | 1.16 | 1.17 |
| `PodOverhead` | `true` | Beta | 1.18 | 1.23 |
| `PodOverhead` | `true` | GA | 1.24 | - |
| `PodPriority` | `false` | Alpha | 1.8 | 1.10 |
| `PodPriority` | `true` | Beta | 1.11 | 1.13 |
| `PodPriority` | `true` | GA | 1.14 | - |
| `PodReadinessGates` | `false` | Alpha | 1.11 | 1.11 |
| `PodReadinessGates` | `true` | Beta | 1.12 | 1.13 |
| `PodReadinessGates` | `true` | GA | 1.14 | - |
| `PodShareProcessNamespace` | `false` | Alpha | 1.10 | 1.11 |
| `PodShareProcessNamespace` | `true` | Beta | 1.12 | 1.16 |
| `PodShareProcessNamespace` | `true` | GA | 1.17 | - |
| `PreferNominatedNode` | `false` | Alpha | 1.21 | 1.21 |
| `PreferNominatedNode` | `true` | Beta | 1.22 | 1.23 |
| `PreferNominatedNode` | `true` | GA | 1.24 | - |
| `RemoveSelfLink` | `false` | Alpha | 1.16 | 1.19 |
| `RemoveSelfLink` | `true` | Beta | 1.20 | 1.23 |
| `RemoveSelfLink` | `true` | GA | 1.24 | - |
| `RequestManagement` | `false` | Alpha | 1.15 | 1.16 |
| `RequestManagement` | - | Deprecated | 1.17 | - |
| `ResourceLimitsPriorityFunction` | `false` | Alpha | 1.9 | 1.18 |
| `ResourceLimitsPriorityFunction` | - | Deprecated | 1.19 | - |
| `ResourceQuotaScopeSelectors` | `false` | Alpha | 1.11 | 1.11 |
| `ResourceQuotaScopeSelectors` | `true` | Beta | 1.12 | 1.16 |
| `ResourceQuotaScopeSelectors` | `true` | GA | 1.17 | - |
| `RootCAConfigMap` | `false` | Alpha | 1.13 | 1.19 |
| `RootCAConfigMap` | `true` | Beta | 1.20 | 1.20 |
| `RootCAConfigMap` | `true` | GA | 1.21 | - |
| `RotateKubeletClientCertificate` | `true` | Beta | 1.8 | 1.18 |
| `RotateKubeletClientCertificate` | `true` | GA | 1.19 | - |
| `RunAsGroup` | `true` | Beta | 1.14 | 1.20 |
| `RunAsGroup` | `true` | GA | 1.21 | - |
| `RuntimeClass` | `false` | Alpha | 1.12 | 1.13 |
| `RuntimeClass` | `true` | Beta | 1.14 | 1.19 |
| `RuntimeClass` | `true` | GA | 1.20 | - |
| `SCTPSupport` | `false` | Alpha | 1.12 | 1.18 |
| `SCTPSupport` | `true` | Beta | 1.19 | 1.19 |
| `SCTPSupport` | `true` | GA | 1.20 | - |
| `ScheduleDaemonSetPods` | `false` | Alpha | 1.11 | 1.11 |
| `ScheduleDaemonSetPods` | `true` | Beta | 1.12 | 1.16  |
| `ScheduleDaemonSetPods` | `true` | GA | 1.17 | - |
| `SelectorIndex` | `false` | Alpha | 1.18 | 1.18 |
| `SelectorIndex` | `true` | Beta | 1.19 | 1.19 |
| `SelectorIndex` | `true` | GA | 1.20 | - |
| `ServerSideApply` | `false` | Alpha | 1.14 | 1.15 |
| `ServerSideApply` | `true` | Beta | 1.16 | 1.21 |
| `ServerSideApply` | `true` | GA | 1.22 | - |
| `ServiceAccountIssuerDiscovery` | `false` | Alpha | 1.18 | 1.19 |
| `ServiceAccountIssuerDiscovery` | `true` | Beta | 1.20 | 1.20 |
| `ServiceAccountIssuerDiscovery` | `true` | GA | 1.21 | - |
| `ServiceAppProtocol` | `false` | Alpha | 1.18 | 1.18 |
| `ServiceAppProtocol` | `true` | Beta | 1.19 | 1.19 |
| `ServiceAppProtocol` | `true` | GA | 1.20 | - |
| `ServiceLBNodePortControl` | `false` | Alpha | 1.20 | 1.21 |
| `ServiceLBNodePortControl` | `true` | Beta | 1.22 | 1.23 |
| `ServiceLBNodePortControl` | `true` | GA | 1.24 | - |
| `ServiceLoadBalancerClass` | `false` | Alpha | 1.21 | 1.21 |
| `ServiceLoadBalancerClass` | `true` | Beta | 1.22 | 1.23 |
| `ServiceLoadBalancerClass` | `true` | GA | 1.24 | - |
| `ServiceLoadBalancerFinalizer` | `false` | Alpha | 1.15 | 1.15 |
| `ServiceLoadBalancerFinalizer` | `true` | Beta | 1.16 | 1.16 |
| `ServiceLoadBalancerFinalizer` | `true` | GA | 1.17 | - |
| `ServiceNodeExclusion` | `false` | Alpha | 1.8 | 1.18 |
| `ServiceNodeExclusion` | `true` | Beta | 1.19 | 1.20 |
| `ServiceNodeExclusion` | `true` | GA | 1.21 | - |
| `ServiceTopology` | `false` | Alpha | 1.17 | 1.19 |
| `ServiceTopology` | `false` | Deprecated | 1.20 | - |
| `SetHostnameAsFQDN` | `false` | Alpha | 1.19 | 1.19 |
| `SetHostnameAsFQDN` | `true` | Beta | 1.20 | 1.21 |
| `SetHostnameAsFQDN` | `true` | GA | 1.22 | - |
| `StartupProbe` | `false` | Alpha | 1.16 | 1.17 |
| `StartupProbe` | `true` | Beta | 1.18 | 1.19 |
| `StartupProbe` | `true` | GA | 1.20 | - |
| `StorageObjectInUseProtection` | `true` | Beta | 1.10 | 1.10 |
| `StorageObjectInUseProtection` | `true` | GA | 1.11 | - |
| `StreamingProxyRedirects` | `false` | Beta | 1.5 | 1.5 |
| `StreamingProxyRedirects` | `true` | Beta | 1.6 | 1.17 |
| `StreamingProxyRedirects` | `true` | Deprecated | 1.18 | 1.21 |
| `StreamingProxyRedirects` | `false` | Deprecated | 1.22 | - |
| `SupportIPVSProxyMode` | `false` | Alpha | 1.8 | 1.8 |
| `SupportIPVSProxyMode` | `false` | Beta | 1.9 | 1.9 |
| `SupportIPVSProxyMode` | `true` | Beta | 1.10 | 1.10 |
| `SupportIPVSProxyMode` | `true` | GA | 1.11 | - |
| `SupportNodePidsLimit` | `false` | Alpha | 1.14 | 1.14 |
| `SupportNodePidsLimit` | `true` | Beta | 1.15 | 1.19 |
| `SupportNodePidsLimit` | `true` | GA | 1.20 | - |
| `SupportPodPidsLimit` | `false` | Alpha | 1.10 | 1.13 |
| `SupportPodPidsLimit` | `true` | Beta | 1.14 | 1.19 |
| `SupportPodPidsLimit` | `true` | GA | 1.20 | - |
| `SuspendJob` | `false` | Alpha | 1.21 | 1.21 |
| `SuspendJob` | `true` | Beta | 1.22 | 1.23 |
| `SuspendJob` | `true` | GA | 1.24 | - |
| `Sysctls` | `true` | Beta | 1.11 | 1.20 |
| `Sysctls` | `true` | GA | 1.21 | - |
| `TTLAfterFinished` | `false` | Alpha | 1.12 | 1.20 |
| `TTLAfterFinished` | `true` | Beta | 1.21 | 1.22 |
| `TTLAfterFinished` | `true` | GA | 1.23 | - |
| `TaintBasedEvictions` | `false` | Alpha | 1.6 | 1.12 |
| `TaintBasedEvictions` | `true` | Beta | 1.13 | 1.17 |
| `TaintBasedEvictions` | `true` | GA | 1.18 | - |
| `TaintNodesByCondition` | `false` | Alpha | 1.8 | 1.11 |
| `TaintNodesByCondition` | `true` | Beta | 1.12 | 1.16 |
| `TaintNodesByCondition` | `true` | GA | 1.17 | - |
| `TokenRequest` | `false` | Alpha | 1.10 | 1.11 |
| `TokenRequest` | `true` | Beta | 1.12 | 1.19 |
| `TokenRequest` | `true` | GA | 1.20 | - |
| `TokenRequestProjection` | `false` | Alpha | 1.11 | 1.11 |
| `TokenRequestProjection` | `true` | Beta | 1.12 | 1.19 |
| `TokenRequestProjection` | `true` | GA | 1.20 | - |
| `ValidateProxyRedirects` | `false` | Alpha | 1.12 | 1.13 |
| `ValidateProxyRedirects` | `true` | Beta | 1.14 | 1.21 |
| `ValidateProxyRedirects` | `true` | Deprecated | 1.22 | - |
| `VolumePVCDataSource` | `false` | Alpha | 1.15 | 1.15 |
| `VolumePVCDataSource` | `true` | Beta | 1.16 | 1.17 |
| `VolumePVCDataSource` | `true` | GA | 1.18 | - |
| `VolumeScheduling` | `false` | Alpha | 1.9 | 1.9 |
| `VolumeScheduling` | `true` | Beta | 1.10 | 1.12 |
| `VolumeScheduling` | `true` | GA | 1.13 | - |
| `VolumeSnapshotDataSource` | `false` | Alpha | 1.12 | 1.16 |
| `VolumeSnapshotDataSource` | `true` | Beta | 1.17 | 1.19 |
| `VolumeSnapshotDataSource` | `true` | GA | 1.20 | - |
| `VolumeSubpath` | `true` | GA | 1.10 | - |
| `VolumeSubpathEnvExpansion` | `false` | Alpha | 1.14 | 1.14 |
| `VolumeSubpathEnvExpansion` | `true` | Beta | 1.15 | 1.16 |
| `VolumeSubpathEnvExpansion` | `true` | GA | 1.17 | - |
| `WarningHeaders` | `true` | Beta | 1.19 | 1.21 |
| `WarningHeaders` | `true` | GA | 1.22 | - |
| `WatchBookmark` | `false` | Alpha | 1.15 | 1.15 |
| `WatchBookmark` | `true` | Beta | 1.16 | 1.16 |
| `WatchBookmark` | `true` | GA | 1.17 | - |
| `WindowsEndpointSliceProxying` | `false` | Alpha | 1.19 | 1.20 |
| `WindowsEndpointSliceProxying` | `true` | Beta | 1.21 | 1.21 |
| `WindowsEndpointSliceProxying` | `true` | GA | 1.22| - |
| `WindowsGMSA` | `false` | Alpha | 1.14 | 1.15 |
| `WindowsGMSA` | `true` | Beta | 1.16 | 1.17 |
| `WindowsGMSA` | `true` | GA | 1.18 | - |
| `WindowsRunAsUserName` | `false` | Alpha | 1.16 | 1.16 |
| `WindowsRunAsUserName` | `true` | Beta | 1.17 | 1.17 |
| `WindowsRunAsUserName` | `true` | GA | 1.18 | - |
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

处于 *Alpha* 、*Beta* 、 *GA* 阶段的特性。

*Alpha* 特性代表：

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
*Beta* 特性代表：

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
* 默认启用。
* 该特性已经经过良好测试。启用该特性是安全的。
* 尽管详细信息可能会更改，但不会放弃对整体特性的支持。
* 对象的架构或语义可能会在随后的 Beta 或稳定版本中以不兼容的方式更改。当发生这种情况时，我们将提供迁移到下一版本的说明。此特性可能需要删除、编辑和重新创建 API 对象。编辑过程可能需要慎重操作，因为这可能会导致依赖该特性的应用程序停机。
* 推荐仅用于非关键业务用途，因为在后续版本中可能会发生不兼容的更改。如果你具有多个可以独立升级的，则可以放宽此限制。

{{< note >}}
<!--
Please do try *Beta* features and give feedback on them!
After they exit beta, it may not be practical for us to make more changes.
-->
请试用 *Beta* 特性并提供相关反馈！
一旦特性结束 Beta 状态，我们就不太可能再对特性进行大幅修改。
{{< /note >}}

<!--
A *General Availability* (GA) feature is also referred to as a *stable* feature. It means:
-->
*General Availability* (GA) 特性也称为 *稳定* 特性，*GA* 特性代表着：

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

### 特性门控列表

每个特性门控均用于启用或禁用某个特定的特性：

<!--
- `APIListChunking`: Enable the API clients to retrieve (`LIST` or `GET`)
  resources from API server in chunks.
- `APIPriorityAndFairness`: Enable managing request concurrency with
  prioritization and fairness at each server. (Renamed from `RequestManagement`)
- `APIResponseCompression`: Compress the API responses for `LIST` or `GET` requests.
- `APIServerIdentity`: Assign each API server an ID in a cluster.
- `APIServerTracing`: Add support for distributed tracing in the API server.
-->
- `APIListChunking`：启用 API 客户端以块的形式从 API 服务器检索（“LIST” 或 “GET”）资源。
- `APIPriorityAndFairness`: 在每个服务器上启用优先级和公平性来管理请求并发。（由 `RequestManagement` 重命名而来）
- `APIResponseCompression`：压缩 “LIST” 或 “GET” 请求的 API 响应。
- `APIServerIdentity`：为集群中的每个 API 服务器赋予一个 ID。
- `APIServerTracing`: 为集群中的每个 API 服务器添加对分布式跟踪的支持。
<!--
- `Accelerators`: Provided an early form of plugin to enable Nvidia GPU support when using
  Docker Engine; no longer available. See
  [Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) for
  an alternative.
- `AdvancedAuditing`: Enable [advanced auditing](/docs/tasks/debug/debug-cluster/audit/#advanced-audit)
- `AffinityInAnnotations`: Enable setting
  [Pod affinity or anti-affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity).
- `AllowExtTrafficLocalEndpoints`: Enable a service to route external requests to node local endpoints.
- `AllowInsecureBackendProxy`: Enable the users to skip TLS verification of
  kubelets on Pod log requests.
- `AnyVolumeDataSource`: Enable use of any custom resource as the `DataSource` of a
  {{< glossary_tooltip text="PVC" term_id="persistent-volume-claim" >}}.
- `AppArmor`: Enable use of AppArmor mandatory access control for Pods running on Linux nodes.
  See [AppArmor Tutorial](/docs/tutorials/security/apparmor/) for more details.
-->
- `Accelerators`：使用 Docker Engine 时启用 Nvidia GPU 支持。这一特性不再提供。
  关于替代方案，请参阅[设备插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)。
- `AdvancedAuditing`：启用[高级审计功能](/zh-cn/docs/tasks/debug/debug-cluster/audit/#advanced-audit)。
- `AffinityInAnnotations`：启用 [Pod 亲和或反亲和](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)。
- `AllowExtTrafficLocalEndpoints`：启用服务用于将外部请求路由到节点本地终端。
- `AllowInsecureBackendProxy`：允许用户在执行 Pod 日志访问请求时跳过 TLS 验证。
- `AnyVolumeDataSource`: 允许使用任何自定义的资源来做作为
  {{< glossary_tooltip text="PVC" term_id="persistent-volume-claim" >}} 中的 `DataSource`.
- `AppArmor`：在 Linux 节点上为 Pod 启用 AppArmor 机制的强制访问控制。
  请参见 [AppArmor 教程](/zh-cn/docs/tutorials/security/apparmor/)获取详细信息。
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
- `BoundServiceAccountTokenVolume`: Migrate ServiceAccount volumes to use a projected volume
  consisting of a ServiceAccountTokenVolumeProjection. Cluster admins can use metric
  `serviceaccount_stale_tokens_total` to monitor workloads that are depending on the extended
  tokens. If there are no such workloads, turn off extended tokens by starting `kube-apiserver` with
  flag `--service-account-extend-token-expiration=false`.
  Check [Bound Service Account Tokens](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md)
  for more details.
- `ControllerManagerLeaderMigration`: Enables Leader Migration for
  [kube-controller-manager](/docs/tasks/administer-cluster/controller-manager-leader-migration/#initial-leader-migration-configuration) and
  [cloud-controller-manager](/docs/tasks/administer-cluster/controller-manager-leader-migration/#deploy-cloud-controller-manager)
  which allows a cluster operator to live migrate
  controllers from the kube-controller-manager into an external controller-manager
  (e.g. the cloud-controller-manager) in an HA cluster without downtime.
-->
- `AttachVolumeLimit`：启用卷插件用于报告可连接到节点的卷数限制。有关更多详细信息，请参阅
  [动态卷限制](/zh-cn/docs/concepts/storage/storage-limits/#dynamic-volume-limits)。
- `BalanceAttachedNodeVolumes`：在进行平衡资源分配的调度时，考虑节点上的卷数。
  调度器在决策时会优先考虑 CPU、内存利用率和卷数更近的节点。
- `BlockVolume`：在 Pod 中启用原始块设备的定义和使用。有关更多详细信息，请参见
  [原始块卷支持](/zh-cn/docs/concepts/storage/persistent-volumes/#raw-block-volume-support)。
- `BoundServiceAccountTokenVolume`：迁移 ServiceAccount 卷以使用由
  ServiceAccountTokenVolumeProjection 组成的投射卷。集群管理员可以使用
  `serviceaccount_stale_tokens_total` 度量值来监控依赖于扩展令牌的负载。
  如果没有这种类型的负载，你可以在启动 `kube-apiserver` 时添加
  `--service-account-extend-token-expiration=false` 参数关闭扩展令牌。查看 
  [绑定服务账号令牌](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md)
  获取更多详细信息。
- `ControllerManagerLeaderMigration`: 为 
  [kube-controller-manager](/zh-cn/docs/tasks/administer-cluster/controller-manager-leader-migration/#initial-leader-migration-configuration) 和 
  [cloud-controller-manager](/zh-cn/docs/tasks/administer-cluster/controller-manager-leader-migration/#deploy-cloud-controller-manager) 
  启用 Leader 迁移，它允许集群管理者在没有停机的高可用集群环境下，实时
  把 kube-controller-manager 迁移迁移到外部的 controller-manager (例如 cloud-controller-manager) 中。
<!--
- `CPUManager`: Enable container level CPU affinity support, see
  [CPU Management Policies](/docs/tasks/administer-cluster/cpu-management-policies/).
- `CPUManagerPolicyAlphaOptions`: This allows fine-tuning of CPUManager policies,
  experimental, Alpha-quality options
  This feature gate guards *a group* of CPUManager options whose quality level is alpha.
  This feature gate will never graduate to beta or stable.
- `CPUManagerPolicyBetaOptions`: This allows fine-tuning of CPUManager policies,
  experimental, Beta-quality options
  This feature gate guards *a group* of CPUManager options whose quality level is beta.
  This feature gate will never graduate to stable.
- `CPUManagerPolicyOptions`: Allow fine-tuning of CPUManager policies.
-->
- `CPUManager`：启用容器级别的 CPU 亲和性支持，有关更多详细信息，请参见
  [CPU 管理策略](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)。
- `CPUManagerPolicyAlphaOptions`：允许对 CPUManager 策略进行微调，针对试验性的、
  alpha 质量级别的选项。
  此特性门控用来保护一组质量级别为 alpha 的 CPUManager 选项。
  此特性门控永远不会被升级为 beta 或者稳定版本。
- `CPUManagerPolicyBetaOptions`：允许对 CPUManager 策略进行微调，针对试验性的、
  beta 质量级别的选项。
  此特性门控用来保护一组质量级别为 beta 的 CPUManager 选项。
  此特性门控永远不会被升级为稳定版本。
- `CPUManagerPolicyOptions`: 允许微调 CPU 管理策略。
<!--
- `CRIContainerLogRotation`: Enable container log rotation for CRI container runtime.
  The default max size of a log file is 10MB and the default max number of
  log files allowed for a container is 5.
  These values can be configured in the kubelet config.
  See [logging at node level](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)
  for more details.
- `CSIBlockVolume`: Enable external CSI volume drivers to support block storage.
  See [`csi` raw block volume support](/docs/concepts/storage/volumes/#csi-raw-block-volume-support)
  for more details.
- `CSIDriverRegistry`: Enable all logic related to the CSIDriver API object in
  csi.storage.k8s.io.
- `CSIInlineVolume`: Enable CSI Inline volumes support for pods.
- `CSIMigration`: Enables shims and translation logic to route volume
  operations from in-tree plugins to corresponding pre-installed CSI plugins
-->
- `CRIContainerLogRotation`：为 CRI 容器运行时启用容器日志轮换。日志文件的默认最大大小为
  10MB，缺省情况下，一个容器允许的最大日志文件数为5。这些值可以在kubelet配置中配置。
  更多细节请参见[日志架构](/zh-cn/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)。
- `CSIBlockVolume`：启用外部 CSI 卷驱动程序用于支持块存储。有关更多详细信息，请参见
  [`csi` 原始块卷支持](/zh-cn/docs/concepts/storage/volumes/#csi-raw-block-volume-support)。
- `CSIDriverRegistry`：在 csi.storage.k8s.io 中启用与 CSIDriver API 对象有关的所有逻辑。
- `CSIInlineVolume`：为 Pod 启用 CSI 内联卷支持。
- `CSIMigration`：确保封装和转换逻辑能够将卷操作从内嵌插件路由到相应的预安装 CSI 插件。
<!--
- `CSIMigrationAWS`: Enables shims and translation logic to route volume
  operations from the AWS-EBS in-tree plugin to EBS CSI plugin. Supports
  falling back to in-tree EBS plugin for mount operations to nodes that have
  the feature disabled or that do not have EBS CSI plugin installed and
  configured. Does not support falling back for provision operations, for those
  the CSI plugin must be installed and configured.
- `CSIMigrationAWSComplete`: Stops registering the EBS in-tree plugin in
  kubelet and volume controllers and enables shims and translation logic to
  route volume operations from the AWS-EBS in-tree plugin to EBS CSI plugin.
  Requires CSIMigration and CSIMigrationAWS feature flags enabled and EBS CSI
  plugin installed and configured on all nodes in the cluster. This flag has
  been deprecated in favor of the `InTreePluginAWSUnregister` feature flag
  which prevents the registration of in-tree EBS plugin.
-->
- `CSIMigrationAWS`：确保填充和转换逻辑能够将卷操作从 AWS-EBS 内嵌插件路由到 EBS CSI 插件。
  如果节点禁用了此特性门控或者未安装和配置 EBS CSI 插件，支持回退到内嵌 EBS 插件
  来执行卷挂载操作。不支持回退到这些插件来执行卷制备操作，因为需要安装并配置 CSI 插件。
- `CSIMigrationAWSComplete`：停止在 kubelet 和卷控制器中注册 EBS 内嵌插件，
  并启用填充和转换逻辑将卷操作从 AWS-EBS 内嵌插件路由到 EBS CSI 插件。
  这需要启用 CSIMigration 和 CSIMigrationAWS 特性标志，并在集群中的所有节点上安装和配置
  EBS CSI 插件。该特性标志已被废弃，取而代之的是 `InTreePluginAWSUnregister` ，
  后者会阻止注册 EBS 内嵌插件。
<!--
- `CSIMigrationAzureDisk`: Enables shims and translation logic to route volume
  operations from the Azure-Disk in-tree plugin to AzureDisk CSI plugin.
  Supports falling back to in-tree AzureDisk plugin for mount operations to
  nodes that have the feature disabled or that do not have AzureDisk CSI plugin
  installed and configured. Does not support falling back for provision
  operations, for those the CSI plugin must be installed and configured.
  Requires CSIMigration feature flag enabled.
- `CSIMigrationAzureDiskComplete`: Stops registering the Azure-Disk in-tree
  plugin in kubelet and volume controllers and enables shims and translation
  logic to route volume operations from the Azure-Disk in-tree plugin to
  AzureDisk CSI plugin. Requires CSIMigration and CSIMigrationAzureDisk feature
  flags enabled and AzureDisk CSI plugin installed and configured on all nodes
  in the cluster. This flag has been deprecated in favor of the
  `InTreePluginAzureDiskUnregister` feature flag which prevents the registration
  of in-tree AzureDisk plugin.
-->
- `CSIMigrationAzureDisk`：确保填充和转换逻辑能够将卷操作从 AzureDisk 内嵌插件路由到
  Azure 磁盘 CSI 插件。对于禁用了此特性的节点或者没有安装并配置 AzureDisk CSI
  插件的节点，支持回退到内嵌（in-tree）AzureDisk 插件来执行磁盘挂载操作。
  不支持回退到内嵌插件来执行磁盘制备操作，因为对应的 CSI 插件必须已安装且正确配置。
  此特性需要启用 CSIMigration 特性标志。
- `CSIMigrationAzureDiskComplete`：停止在 kubelet 和卷控制器中注册 Azure 磁盘内嵌插件，
  并启用 shims 和转换逻辑以将卷操作从 Azure 磁盘内嵌插件路由到 AzureDisk CSI 插件。
  这需要启用 CSIMigration 和 CSIMigrationAzureDisk 特性标志，
  并在集群中的所有节点上安装和配置 AzureDisk CSI 插件。该特性标志已被废弃，取而代之的是
  能防止注册内嵌 AzureDisk 插件的 `InTreePluginAzureDiskUnregister` 特性标志。
<!--
- `CSIMigrationAzureFile`: Enables shims and translation logic to route volume
  operations from the Azure-File in-tree plugin to AzureFile CSI plugin.
  Supports falling back to in-tree AzureFile plugin for mount operations to
  nodes that have the feature disabled or that do not have AzureFile CSI plugin
  installed and configured. Does not support falling back for provision
  operations, for those the CSI plugin must be installed and configured.
  Requires CSIMigration feature flag enabled.
- `CSIMigrationAzureFileComplete`: Stops registering the Azure-File in-tree
  plugin in kubelet and volume controllers and enables shims and translation
  logic to route volume operations from the Azure-File in-tree plugin to
  AzureFile CSI plugin. Requires CSIMigration and CSIMigrationAzureFile feature
  flags  enabled and AzureFile CSI plugin installed and configured on all nodes
  in the cluster. This flag has been deprecated in favor of the
  `InTreePluginAzureFileUnregister` feature flag which prevents the registration
   of in-tree AzureFile plugin.
-->
- `CSIMigrationAzureFile`：确保封装和转换逻辑能够将卷操作从 AzureFile 内嵌插件路由到
  AzureFile CSI 插件。对于禁用了此特性的节点或者没有安装并配置 AzureFile CSI
  插件的节点，支持回退到内嵌（in-tree）AzureFile 插件来执行卷挂载操作。
  不支持回退到内嵌插件来执行卷制备操作，因为对应的 CSI 插件必须已安装且正确配置。
  此特性需要启用 CSIMigration 特性标志。
- `CSIMigrationAzureFileComplete`：停止在 kubelet 和卷控制器中注册 Azure-File 内嵌插件，
  并启用 shims 和转换逻辑以将卷操作从 Azure-File 内嵌插件路由到 AzureFile CSI 插件。
  这需要启用 CSIMigration 和 CSIMigrationAzureFile 特性标志，
  并在集群中的所有节点上安装和配置 AzureFile CSI 插件。该特性标志已被废弃，取而代之的是
  能防止注册内嵌 AzureDisk 插件的 `InTreePluginAzureFileUnregister` 特性标志。
<!--
- `CSIMigrationGCE`: Enables shims and translation logic to route volume
  operations from the GCE-PD in-tree plugin to PD CSI plugin. Supports falling
  back to in-tree GCE plugin for mount operations to nodes that have the
  feature disabled or that do not have PD CSI plugin installed and configured.
  Does not support falling back for provision operations, for those the CSI
  plugin must be installed and configured. Requires CSIMigration feature flag
  enabled.
- `CSIMigrationGCEComplete`: Stops registering the GCE-PD in-tree plugin in
  kubelet and volume controllers and enables shims and translation logic to
  route volume operations from the GCE-PD in-tree plugin to PD CSI plugin.
  Requires CSIMigration and CSIMigrationGCE feature flags enabled and PD CSI
  plugin installed and configured on all nodes in the cluster. This flag has
  been deprecated in favor of the `InTreePluginGCEUnregister` feature flag which
  prevents the registration of in-tree GCE PD plugin.
-->
- `CSIMigrationGCE`：启用填充和转换逻辑，将卷操作从 GCE-PD 内嵌插件路由到
  PD CSI 插件。对于禁用了此特性的节点或者没有安装并配置 PD CSI 插件的节点，
  支持回退到内嵌（in-tree）GCE 插件来执行挂载操作。
  不支持回退到内嵌插件来执行制备操作，因为对应的 CSI 插件必须已安装且正确配置。
  此特性需要启用 CSIMigration 特性标志。
- `CSIMigrationGCEComplete`：停止在 kubelet 和卷控制器中注册 GCE-PD 内嵌插件，
  并启用 shims 和转换逻辑以将卷操作从 GCE-PD 内嵌插件路由到 PD CSI 插件。
  这需要启用 CSIMigration 和 CSIMigrationGCE 特性标志，并在集群中的所有节点上
  安装和配置 PD CSI 插件。该特性标志已被废弃，取而代之的是
  能防止注册内嵌 GCE PD 插件的 `InTreePluginGCEUnregister` 特性标志。
<!--
- `CSIMigrationOpenStack`: Enables shims and translation logic to route volume
  operations from the Cinder in-tree plugin to Cinder CSI plugin. Supports
  falling back to in-tree Cinder plugin for mount operations to nodes that have
  the feature disabled or that do not have Cinder CSI plugin installed and
  configured. Does not support falling back for provision operations, for those
  the CSI plugin must be installed and configured. Requires CSIMigration
  feature flag enabled.
- `CSIMigrationOpenStackComplete`: Stops registering the Cinder in-tree plugin in
  kubelet and volume controllers and enables shims and translation logic to route
  volume operations from the Cinder in-tree plugin to Cinder CSI plugin.
  Requires CSIMigration and CSIMigrationOpenStack feature flags enabled and Cinder
  CSI plugin installed and configured on all nodes in the cluster. This flag has
  been deprecated in favor of the `InTreePluginOpenStackUnregister` feature flag
  which prevents the registration of in-tree openstack cinder plugin.
-->
- `CSIMigrationOpenStack`：确保填充和转换逻辑能够将卷操作从 Cinder 内嵌插件路由到
  Cinder CSI 插件。对于禁用了此特性的节点或者没有安装并配置 Cinder CSI 插件的节点，
  支持回退到内嵌（in-tree）Cinder 插件来执行挂载操作。
  不支持回退到内嵌插件来执行制备操作，因为对应的 CSI 插件必须已安装且正确配置。
  此磁特性需要启用 CSIMigration 特性标志。
- `CSIMigrationOpenStackComplete`：停止在 kubelet 和卷控制器中注册 Cinder 内嵌插件，
  并启用填充和转换逻辑将卷操作从 Cinder 内嵌插件路由到 Cinder CSI 插件。
  这需要启用 CSIMigration 和 CSIMigrationOpenStack 特性标志，并在集群中的所有节点上
  安装和配置 Cinder CSI 插件。该特性标志已被弃用，取而代之的是
  能防止注册内嵌 OpenStack Cinder 插件的 `InTreePluginOpenStackUnregister` 特性标志。
<!--
- `csiMigrationRBD`: Enables shims and translation logic to route volume
  operations from the RBD in-tree plugin to Ceph RBD CSI plugin. Requires
  CSIMigration and csiMigrationRBD feature flags enabled and Ceph CSI plugin
  installed and configured in the cluster. This flag has been deprecated in
  favor of the `InTreePluginRBDUnregister` feature flag which prevents the registration of
  in-tree RBD plugin.
-->
- `csiMigrationRBD`：启用填充和转换逻辑，将卷操作从 RBD 的内嵌插件路由到 Ceph RBD
  CSI 插件。此特性要求 CSIMigration 和 csiMigrationRBD 特性标志均被启用，
  且集群中安装并配置了 Ceph CSI 插件。此标志已被弃用，以鼓励使用
  `InTreePluginRBDUnregister` 特性标志。后者会禁止注册内嵌的 RBD 插件。
<!--
- `CSIMigrationvSphere`: Enables shims and translation logic to route volume operations
  from the vSphere in-tree plugin to vSphere CSI plugin. Supports falling back
  to in-tree vSphere plugin for mount operations to nodes that have the feature
  disabled or that do not have vSphere CSI plugin installed and configured.
  Does not support falling back for provision operations, for those the CSI
  plugin must be installed and configured. Requires CSIMigration feature flag
  enabled.
- `CSIMigrationvSphereComplete`: Stops registering the vSphere in-tree plugin in kubelet
  and volume controllers and enables shims and translation logic to route volume operations
  from the vSphere in-tree plugin to vSphere CSI plugin. Requires CSIMigration and
  CSIMigrationvSphere feature flags enabled and vSphere CSI plugin installed and
  configured on all nodes in the cluster. This flag has been deprecated in favor
  of the `InTreePluginvSphereUnregister` feature flag which prevents the
  registration of in-tree vsphere plugin.
-->
- `CSIMigrationvSphere`: 允许封装和转换逻辑将卷操作从 vSphere 内嵌插件路由到
  vSphere CSI 插件。如果节点禁用了此特性门控或者未安装和配置 vSphere CSI 插件，
  则支持回退到 vSphere 内嵌插件来执行挂载操作。
  不支持回退到内嵌插件来执行制备操作，因为对应的 CSI 插件必须已安装且正确配置。
  这需要启用 CSIMigration 特性标志。
- `CSIMigrationvSphereComplete`: 停止在 kubelet 和卷控制器中注册 vSphere 内嵌插件，
  并启用填充和转换逻辑以将卷操作从 vSphere 内嵌插件路由到 vSphere CSI 插件。
  这需要启用 CSIMigration 和 CSIMigrationvSphere 特性标志，并在集群中的所有节点上
  安装和配置 vSphere CSI 插件。该特性标志已被废弃，取而代之的是
  能防止注册内嵌 vsphere 插件的 `InTreePluginvSphereUnregister` 特性标志。
<!--
- `CSIMigrationPortworx`: Enables shims and translation logic to route volume operations
  from the Portworx in-tree plugin to Portworx CSI plugin.
  Requires Portworx CSI driver to be installed and configured in the cluster.
-->
- `CSIMigrationPortworx`：启用填充和转换逻辑，将卷操作从 Portworx 内嵌插件路由到
  Portworx CSI 插件。需要在集群中安装并配置 Portworx CSI 插件.
<!--
- `CSINodeInfo`: Enable all logic related to the CSINodeInfo API object in `csi.storage.k8s.io`.
- `CSIPersistentVolume`: Enable discovering and mounting volumes provisioned through a
  [CSI (Container Storage Interface)](https://git.k8s.io/design-proposals-archive/storage/container-storage-interface.md)
  compatible volume plugin.
- `CSIServiceAccountToken`: Enable CSI drivers to receive the pods' service account token
  that they mount volumes for. See
  [Token Requests](https://kubernetes-csi.github.io/docs/token-requests.html).
- `CSIStorageCapacity`: Enables CSI drivers to publish storage capacity information
  and the Kubernetes scheduler to use that information when scheduling pods. See
  [Storage Capacity](/docs/concepts/storage/storage-capacity/).
  Check the [`csi` volume type](/docs/concepts/storage/volumes/#csi) documentation for more details.
-->
- `CSINodeInfo`：在 `csi.storage.k8s.io` 中启用与 CSINodeInfo API 对象有关的所有逻辑。
- `CSIPersistentVolume`：启用发现和挂载通过
  [CSI（容器存储接口）](https://git.k8s.io/design-proposals-archive/storage/container-storage-interface.md)
  兼容卷插件配置的卷。
- `CSIServiceAccountToken`: 允许 CSI 驱动接收挂载卷目标 Pods 的服务账户令牌。
  参阅[令牌请求（Token Requests）](https://kubernetes-csi.github.io/docs/token-requests.html)。
- `CSIStorageCapacity`: 使 CSI 驱动程序可以发布存储容量信息，并使 Kubernetes
  调度程序在调度 Pod 时使用该信息。参见
  [存储容量](/zh-cn/docs/concepts/storage/storage-capacity/)。
  详情请参见 [`csi` 卷类型](/zh-cn/docs/concepts/storage/volumes/#csi)。
<!--
- `CSIVolumeFSGroupPolicy`: Allows CSIDrivers to use the `fsGroupPolicy` field.
  This field controls whether volumes created by a CSIDriver support volume ownership
  and permission modifications when these volumes are mounted.
- `CSIVolumeHealth`: Enable support for CSI volume health monitoring on node.
- `CSRDuration`: Allows clients to request a duration for certificates issued
  via the Kubernetes CSR API.
- `ConfigurableFSGroupPolicy`: Allows user to configure volume permission change policy
  for fsGroups when mounting a volume in a Pod. See
  [Configure volume permission and ownership change policy for Pods](/docs/tasks/configure-pod-container/security-context/#configure-volume-permission-and-ownership-change-policy-for-pods)
  for more details.
- `ContextualLogging`: When you enable this feature gate, Kubernetes components that support
   contextual logging add extra detail to log output.
- `ControllerManagerLeaderMigration`: Enables leader migration for
  `kube-controller-manager` and `cloud-controller-manager`.
- `CronJobControllerV2`: Use an alternative implementation of the
  {{< glossary_tooltip text="CronJob" term_id="cronjob" >}} controller. Otherwise,
  version 1 of the same controller is selected.
- `CronJobTimeZone`: Allow the use of the `timeZone` optional field in [CronJobs](/docs/concepts/workloads/controllers/cron-jobs/)
-->
- `CSIVolumeFSGroupPolicy`：允许 CSIDrivers 使用 `fsGroupPolicy` 字段. 
  该字段能控制由 CSIDriver 创建的卷在挂载这些卷时是否支持卷所有权和权限修改。
- `CSIVolumeHealth`：启用对节点上的 CSI volume 运行状况监控的支持
- `CSRDuration`：允许客户端来通过请求 Kubernetes CSR API 签署的证书的持续时间。
- `ConfigurableFSGroupPolicy`：在 Pod 中挂载卷时，允许用户为 fsGroup
  配置卷访问权限和属主变更策略。请参见
  [为 Pod 配置卷访问权限和属主变更策略](/zh-cn/docs/tasks/configure-pod-container/security-context/#configure-volume-permission-and-ownership-change-policy-for-pods)。
- `ContextualLogging`：当你启用这个特性门控，支持日志上下文记录的 Kubernetes
  组件会为日志输出添加额外的详细内容。
- `ControllerManagerLeaderMigration`：为 `kube-controller-manager` 和 `cloud-controller-manager`
  开启领导者迁移功能。
- `CronJobControllerV2`：使用 {{< glossary_tooltip text="CronJob" term_id="cronjob" >}}
  控制器的一种替代实现。否则，系统会选择同一控制器的 v1 版本。
- `CronJobTimeZone`：允许在 [CronJobs](/zh-cn/docs/concepts/workloads/controllers/cron-jobs/) 中使用 `timeZone` 可选字段。
<!--
- `CustomCPUCFSQuotaPeriod`: Enable nodes to change `cpuCFSQuotaPeriod` in
  [kubelet config](/docs/tasks/administer-cluster/kubelet-config-file/).
- `CustomResourceValidationExpressions`: Enable expression language validation in CRD
  which will validate customer resource based on validation rules written in
  the `x-kubernetes-validations` extension.
- `CustomPodDNS`: Enable customizing the DNS settings for a Pod using its `dnsConfig` property.
  Check [Pod's DNS Config](/docs/concepts/services-networking/dns-pod-service/#pods-dns-config)
  for more details.
-->
- `CustomCPUCFSQuotaPeriod`：使节点能够更改
  [kubelet 配置](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)
  中的 `cpuCFSQuotaPeriod`。
- `CustomResourceValidationExpressions`：启用 CRD 中的表达式语言合法性检查，
  基于 `x-kubernetes-validations` 扩展中所书写的合法性检查规则来验证定制资源。
- `CustomPodDNS`：允许使用 Pod 的 `dnsConfig` 属性自定义其 DNS 设置。
  更多详细信息，请参见
  [Pod 的 DNS 配置](/zh-cn/docs/concepts/services-networking/dns-pod-service/#pods-dns-config)。
<!--
- `CustomResourceDefaulting`: Enable CRD support for default values in OpenAPI v3 validation schemas.
- `CustomResourcePublishOpenAPI`: Enables publishing of CRD OpenAPI specs.
- `CustomResourceSubresources`: Enable `/status` and `/scale` subresources
  on resources created from [CustomResourceDefinition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).
- `CustomResourceValidation`: Enable schema based validation on resources created from
  [CustomResourceDefinition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).
- `CustomResourceWebhookConversion`: Enable webhook-based conversion
  on resources created from [CustomResourceDefinition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).
- `DaemonSetUpdateSurge`: Enables the DaemonSet workloads to maintain
  availability during update per node.
  See [Perform a Rolling Update on a DaemonSet](/docs/tasks/manage-daemon/update-daemon-set/).
-->
- `CustomResourceDefaulting`：为 CRD 启用在其 OpenAPI v3 验证模式中提供默认值的支持。
- `CustomResourcePublishOpenAPI`：启用 CRD OpenAPI 规范的发布。
- `CustomResourceSubresources`：对于用
  [CustomResourceDefinition](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
  创建的资源启用其 `/status` 和 `/scale` 子资源。
- `CustomResourceValidation`：对于用
  [CustomResourceDefinition](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
  创建的资源启用基于模式的验证。
- `CustomResourceWebhookConversion`：对于用
  [CustomResourceDefinition](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
  创建的资源启用基于 Webhook 的转换。
- `DaemonSetUpdateSurge`: 使 DaemonSet 工作负载在每个节点的更新期间保持可用性。
  参阅[对 DaemonSet 执行滚动更新](/zh-cn/docs/tasks/manage-daemon/update-daemon-set/)。
<!--
- `DefaultPodTopologySpread`: Enables the use of `PodTopologySpread` scheduling plugin to do
  [default spreading](/docs/concepts/workloads/pods/pod-topology-spread-constraints/#internal-default-constraints).
- `DelegateFSGroupToCSIDriver`: If supported by the CSI driver, delegates the
  role of applying `fsGroup` from a Pod's `securityContext` to the driver by
  passing `fsGroup` through the NodeStageVolume and NodePublishVolume CSI calls.
- `DevicePlugins`: Enable the [device-plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
  based resource provisioning on nodes.
- `DisableAcceleratorUsageMetrics`:
  [Disable accelerator metrics collected by the kubelet](/docs/concepts/cluster-administration/system-metrics/#disable-accelerator-metrics).
-->
- `DefaultPodTopologySpread`: 启用 `PodTopologySpread` 调度插件来完成
  [默认的调度传播](/zh-cn/docs/concepts/workloads/pods/pod-topology-spread-constraints/#internal-default-constraints).
- `DelegateFSGroupToCSIDriver`: 如果 CSI 驱动程序支持，则通过 NodeStageVolume 和
  NodePublishVolume CSI 调用传递 `fsGroup` ，将应用 `fsGroup` 从 Pod 的
  `securityContext` 的角色委托给驱动。
- `DevicePlugins`：在节点上启用基于
  [设备插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
  的资源制备。
- `DisableAcceleratorUsageMetrics`： 
  [禁用 kubelet 收集加速器指标](/zh-cn/docs/concepts/cluster-administration/system-metrics/#disable-accelerator-metrics).
<!--
- `DisableCloudProviders`: Disables any functionality in `kube-apiserver`,
  `kube-controller-manager` and `kubelet` related to the `--cloud-provider`
  component flag.
- `DisableKubeletCloudCredentialProviders`: Disable the in-tree functionality in kubelet
  to authenticate to a cloud provider container registry for image pull credentials.
- `DownwardAPIHugePages`: Enables usage of hugepages in
  [downward API](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information).
- `DryRun`: Enable server-side [dry run](/docs/reference/using-api/api-concepts/#dry-run) requests
  so that validation, merging, and mutation can be tested without committing.
- `DynamicAuditing`: Used to enable dynamic auditing before v1.19.
-->
- `DisableCloudProviders`: 禁用 `kube-apiserver`，`kube-controller-manager` 和
  `kubelet` 组件的 `--cloud-provider` 标志相关的所有功能。
- `DisableKubeletCloudCredentialProviders`：禁用 kubelet 中为拉取镜像内置的凭据机制，
  该凭据用于向某云提供商的容器镜像仓库执行身份认证。
- `DownwardAPIHugePages`：允许在
  [下行（Downward）API](/zh-cn/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information)
  中使用巨页信息。
- `DryRun`：启用在服务器端对请求进行
  [试运行（Dry Run）](/zh-cn/docs/reference/using-api/api-concepts/#dry-run)，
  以便测试验证、合并和修改，同时避免提交更改。
- `DynamicAuditing`：在 v1.19 版本前用于启用动态审计。
<!--
- `DynamicKubeletConfig`: Enable the dynamic configuration of kubelet. The
  feature is no longer supported outside of supported skew policy. The feature
  gate was removed from kubelet in 1.24. See [Reconfigure kubelet](/docs/tasks/administer-cluster/reconfigure-kubelet/).
- `DynamicProvisioningScheduling`: Extend the default scheduler to be aware of
  volume topology and handle PV provisioning.
  This feature is superseded by the `VolumeScheduling` feature completely in v1.12.
- `DynamicVolumeProvisioning`: Enable the
  [dynamic provisioning](/docs/concepts/storage/dynamic-provisioning/) of persistent volumes to Pods.
- `EfficientWatchResumption`: Allows for storage-originated bookmark (progress
  notify) events to be delivered to the users. This is only applied to watch
  operations.
- `EnableAggregatedDiscoveryTimeout`: Enable the five second
  timeout on aggregated discovery calls.
-->
- `DynamicKubeletConfig`：启用 kubelet 的动态配置。
  除偏差策略场景外，不再支持该功能。该特性门控在 kubelet 1.24 版本中已被移除。
  请参阅[重新配置 kubelet](/zh-cn/docs/tasks/administer-cluster/reconfigure-kubelet/)。
- `DynamicProvisioningScheduling`：扩展默认调度器以了解卷拓扑并处理 PV 配置。
  此特性已在 v1.12 中完全被 `VolumeScheduling` 特性取代。
- `DynamicVolumeProvisioning`：启用持久化卷到 Pod
  的[动态预配置](/zh-cn/docs/concepts/storage/dynamic-provisioning/)。
- `EfficientWatchResumption`：允许从存储发起的 bookmark（进度通知）事件被通知到用户。
  此特性仅适用于 watch 操作。
- `EnableAggregatedDiscoveryTimeout`：对聚集的发现调用启用五秒钟超时设置。
<!--
- `EnableEquivalenceClassCache`: Enable the scheduler to cache equivalence of
  nodes when scheduling Pods.
- `EndpointSlice`: Enables EndpointSlices for more scalable and extensible
   network endpoints. See [Enabling EndpointSlices](/docs/concepts/services-networking/endpoint-slices/).
- `EndpointSliceNodeName`: Enables EndpointSlice `nodeName` field.
- `EndpointSliceProxying`: When enabled, kube-proxy running
   on Linux will use EndpointSlices as the primary data source instead of
   Endpoints, enabling scalability and performance improvements. See
   [Enabling Endpoint Slices](/docs/concepts/services-networking/endpoint-slices/).
- `EndpointSliceTerminatingCondition`: Enables EndpointSlice `terminating` and `serving`
   condition fields.
-->
- `EnableEquivalenceClassCache`：调度 Pod 时，使 scheduler 缓存节点的等效项。
- `EndpointSlice`：启用 EndpointSlice 以实现可扩缩性和可扩展性更好的网络端点。
   参阅[启用 EndpointSlice](/zh-cn/docs/concepts/services-networking/endpoint-slices/)。
- `EndpointSliceNodeName`：允许使用 EndpointSlice 的 `nodeName` 字段。
- `EndpointSliceProxying`：启用此特性门控时，Linux 上运行的 kube-proxy 会使用
  EndpointSlices 而不是 Endpoints 作为其主要数据源，从而使得可扩缩性和性能提升成为可能。
  参阅[启用 EndpointSlice](/zh-cn/docs/concepts/services-networking/endpoint-slices/)。
- `EndpointSliceTerminatingCondition`：允许使用 EndpointSlice 的 `terminating` 和
  `serving` 状况字段。
<!--
- `EphemeralContainers`: Enable the ability to add
  {{< glossary_tooltip text="ephemeral containers" term_id="ephemeral-container" >}}
  to running pods.
- `EvenPodsSpread`: Enable pods to be scheduled evenly across topology domains. See
  [Pod Topology Spread Constraints](/docs/concepts/workloads/pods/pod-topology-spread-constraints/).
- `ExecProbeTimeout`: Ensure kubelet respects exec probe timeouts.
  This feature gate exists in case any of your existing workloads depend on a
  now-corrected fault where Kubernetes ignored exec probe timeouts. See
  [readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes).
-->
- `EphemeralContainers`：启用添加
  {{< glossary_tooltip text="临时容器" term_id="ephemeral-container" >}}
  到正在运行的 Pod 的特性。
- `EvenPodsSpread`：使 Pod 能够在拓扑域之间平衡调度。请参阅
  [Pod 拓扑扩展约束](/zh-cn/docs/concepts/workloads/pods/pod-topology-spread-constraints/)。
- `ExecProbeTimeout`：确保 kubelet 会遵从 exec 探针的超时值设置。
  此特性门控的主要目的是方便你处理现有的、依赖于已被修复的缺陷的工作负载；
  该缺陷导致 Kubernetes 会忽略 exec 探针的超时值设置。
  参阅[就绪态探针](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes).
<!--
- `ExpandCSIVolumes`: Enable the expanding of CSI volumes.
- `ExpandedDNSConfig`: Enable kubelet and kube-apiserver to allow more DNS
  search paths and longer list of DNS search paths. This feature requires container
  runtime support(Containerd: v1.5.6 or higher, CRI-O: v1.22 or higher). See
  [Expanded DNS Configuration](/docs/concepts/services-networking/dns-pod-service/#expanded-dns-configuration).
- `ExpandInUsePersistentVolumes`: Enable expanding in-use PVCs. See
  [Resizing an in-use PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#resizing-an-in-use-persistentvolumeclaim).
- `ExpandPersistentVolumes`: Enable the expanding of persistent volumes. See
  [Expanding Persistent Volumes Claims](/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims).
- `ExperimentalCriticalPodAnnotation`: Enable annotating specific pods as *critical*
  so that their [scheduling is guaranteed](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/).
  This feature is deprecated by Pod Priority and Preemption as of v1.13.
-->
- `ExpandCSIVolumes`: 启用扩展 CSI 卷。
- `ExpandedDNSConfig`: 在 kubelet 和 kube-apiserver 上启用后，
  允许使用更多的 DNS 搜索域和搜索域列表。此功能特性需要容器运行时
  （Containerd：v1.5.6 或更高，CRI-O：v1.22 或更高）的支持。参阅
  [扩展 DNS 配置](/zh-cn/docs/concepts/services-networking/dns-pod-service/#expanded-dns-configuration).
- `ExpandInUsePersistentVolumes`：启用扩充使用中的 PVC 的尺寸。请查阅
  [调整使用中的 PersistentVolumeClaim 的大小](/zh-cn/docs/concepts/storage/persistent-volumes/#resizing-an-in-use-persistentvolumeclaim)。
- `ExpandPersistentVolumes`：允许扩充持久卷。请查阅
  [扩展持久卷申领](/zh-cn/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims)。
- `ExperimentalCriticalPodAnnotation`：启用将特定 Pod 注解为 *critical* 的方式，用于
  [确保其被调度](/zh-cn/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/)。
  从 v1.13 开始已弃用此特性，转而使用 Pod 优先级和抢占功能。
<!--
- `ExperimentalHostUserNamespaceDefaulting`: Enabling the defaulting user
  namespace to host. This is for containers that are using other host namespaces,
  host mounts, or containers that are privileged or using specific non-namespaced
  capabilities (e.g. `MKNODE`, `SYS_MODULE` etc.). This should only be enabled
  if user namespace remapping is enabled in the Docker daemon.
- `ExternalPolicyForExternalIP`: Fix a bug where ExternalTrafficPolicy is not
  applied to Service ExternalIPs.
- `GCERegionalPersistentDisk`: Enable the regional PD feature on GCE.
- `GenericEphemeralVolume`: Enables ephemeral, inline volumes that support all features
  of normal volumes (can be provided by third-party storage vendors, storage capacity tracking,
  restore from snapshot, etc.).
  See [Ephemeral Volumes](/docs/concepts/storage/ephemeral-volumes/).
- `GracefulNodeShutdown`: Enables support for graceful shutdown in kubelet.
  During a system shutdown, kubelet will attempt to detect the shutdown event
  and gracefully terminate pods running on the node. See
  [Graceful Node Shutdown](/docs/concepts/architecture/nodes/#graceful-node-shutdown)
  for more details.
-->
- `ExperimentalHostUserNamespaceDefaulting`：启用主机默认的用户名字空间。
  这适用于使用其他主机名字空间、主机安装的容器，或具有特权或使用特定的非名字空间功能
  （例如 MKNODE、SYS_MODULE 等）的容器。
  如果在 Docker 守护程序中启用了用户名字空间重新映射，则启用此选项。
- `ExternalPolicyForExternalIP`： 修复 ExternalPolicyForExternalIP 没有应用于
  Service ExternalIPs 的缺陷。
- `GCERegionalPersistentDisk`：在 GCE 上启用带地理区域信息的 PD 特性。
- `GenericEphemeralVolume`：启用支持临时的内联卷，这些卷支持普通卷
  （可以由第三方存储供应商提供、存储容量跟踪、从快照还原等等）的所有功能。
  请参见[临时卷](/zh-cn/docs/concepts/storage/ephemeral-volumes/)。
- `GracefulNodeShutdown`：在 kubelet 中启用体面地关闭节点的支持。
  在系统关闭时，kubelet 会尝试监测该事件并体面地终止节点上运行的 Pods。
  参阅[体面地关闭节点](/zh-cn/docs/concepts/architecture/nodes/#graceful-node-shutdown)
  以了解更多细节。
<!--
- `GracefulNodeShutdownBasedOnPodPriority`: Enables the kubelet to check Pod priorities
  when shutting down a node gracefully.
- `GRPCContainerProbe`: Enables the gRPC probe method for {Liveness,Readiness,Startup}Probe.
  See [Configure Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-grpc-liveness-probe).
- `HonorPVReclaimPolicy`: Honor persistent volume reclaim policy when it is `Delete` irrespective of PV-PVC deletion ordering.
  For more details, check the
  [PersistentVolume deletion protection finalizer](/docs/concepts/storage/persistent-volumes/#persistentvolume-deletion-protection-finalizer)
  documentation.
-->
- `GracefulNodeShutdownBasedOnPodPriority`：允许 kubelet 在体面终止节点时检查
  Pod 的优先级。
- `GRPCContainerProbe`：为 LivenessProbe、ReadinessProbe、StartupProbe 启用 gRPC 探针。
  参阅[配置活跃态、就绪态和启动探针](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-grpc-liveness-probe)。
- `HonorPVReclaimPolicy`：无论 PV 和 PVC 的删除顺序如何，当持久卷申领的策略为 `Delete`
  时，确保这种策略得到处理。
  更多详细信息，请参阅 [PersistentVolume 删除保护 finalizer](/zh-cn/docs/concepts/storage/persistent-volumes/#persistentvolume-deletion-protection-finalizer)文档。
<!--
- `HPAContainerMetrics`: Enable the `HorizontalPodAutoscaler` to scale based on
  metrics from individual containers in target pods.
- `HPAScaleToZero`: Enables setting `minReplicas` to 0 for `HorizontalPodAutoscaler`
  resources when using custom or external metrics.
- `HugePages`: Enable the allocation and consumption of pre-allocated
  [huge pages](/docs/tasks/manage-hugepages/scheduling-hugepages/).
- `HugePageStorageMediumSize`: Enable support for multiple sizes pre-allocated
  [huge pages](/docs/tasks/manage-hugepages/scheduling-hugepages/).
- `HyperVContainer`: Enable
  [Hyper-V isolation](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container)
  for Windows containers.
-->
- `HPAContainerMetrics`：允许 `HorizontalPodAutoscaler` 基于目标 Pods 中各容器
  的度量值来执行扩缩操作。
- `HPAScaleToZero`：使用自定义指标或外部指标时，可将 `HorizontalPodAutoscaler`
  资源的 `minReplicas` 设置为 0。
- `HugePages`：启用分配和使用预分配的
  [巨页资源](/zh-cn/docs/tasks/manage-hugepages/scheduling-hugepages/)。
- `HugePageStorageMediumSize`：启用支持多种大小的预分配
  [巨页资源](/zh-cn/docs/tasks/manage-hugepages/scheduling-hugepages/)。
- `HyperVContainer`：为 Windows 容器启用
  [Hyper-V 隔离](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container)。
<!--
- `IdentifyPodOS`: Allows the Pod OS field to be specified. This helps in identifying
  the OS of the pod authoritatively during the API server admission time.
  In Kubernetes {{< skew currentVersion >}}, the allowed values for the `pod.spec.os.name`
  are `windows` and `linux`.
- `ImmutableEphemeralVolumes`: Allows for marking individual Secrets and ConfigMaps as
  immutable for better safety and performance.
- `IndexedJob`: Allows the [Job](/docs/concepts/workloads/controllers/job/)
  controller to manage Pod completions per completion index.
- `IngressClassNamespacedParams`: Allow namespace-scoped parameters reference in
  `IngressClass` resource. This feature adds two fields - `Scope` and `Namespace`
  to `IngressClass.spec.parameters`.
- `Initializers`: Allow asynchronous coordination of object creation using the
  Initializers admission plugin.
- `InTreePluginAWSUnregister`: Stops registering the aws-ebs in-tree plugin in kubelet
  and volume controllers.
- `InTreePluginAzureDiskUnregister`: Stops registering the azuredisk in-tree plugin in kubelet
  and volume controllers.
- `InTreePluginAzureFileUnregister`: Stops registering the azurefile in-tree plugin in kubelet
  and volume controllers.
-->
- `IdentifyPodOS`：允许设置 Pod 的 OS 字段。这一设置有助于在 API 服务器准入期间确定性地辨识
  Pod 的 OS。在 Kubernetes {{< skew currentVersion >}} 中，`pod.spec.os.name` 可选的值包括
  `windows` 和 `linux`。
- `ImmutableEphemeralVolumes`：允许将各个 Secret 和 ConfigMap 标记为不可变更的，
  以提高安全性和性能。
- `IndexedJob`：允许 [Job](/zh-cn/docs/concepts/workloads/controllers/job/)
   控制器来管理每个完成索引的 Pod 完成。
- `IngressClassNamespacedParams`：允许在 `IngressClass` 资源中使用命名空间范围的参数引用。
  此功能为 `IngressClass.spec.parameters` 添加了两个字段 - `scope` 和 `namespace`。
- `Initializers`：允许使用 Intializers 准入插件来异步协调对象创建操作。
- `InTreePluginAWSUnregister`: 在 kubelet 和卷控制器上关闭注册 aws-ebs 内嵌插件。
- `InTreePluginAzureDiskUnregister`: 在 kubelet 和卷控制器上关闭注册 azuredisk 内嵌插件。
- `InTreePluginAzureFileUnregister`: 在 kubelet 和卷控制器上关闭注册 azurefile 内嵌插件。
<!--
- `InTreePluginGCEUnregister`: Stops registering the gce-pd in-tree plugin in kubelet
  and volume controllers.
- `InTreePluginOpenStackUnregister`: Stops registering the OpenStack cinder in-tree plugin in kubelet
  and volume controllers.
- `InTreePluginPortworxUnregister`: Stops registering the Portworx in-tree plugin in kubelet
  and volume controllers.
- `InTreePluginRBDUnregister`: Stops registering the RBD in-tree plugin in kubelet
  and volume controllers.
-->
- `InTreePluginGCEUnregister`: 在 kubelet 和卷控制器上关闭注册 gce-pd 内嵌插件。
- `InTreePluginOpenStackUnregister`: 在 kubelet 和卷控制器上关闭注册 OpenStack cinder 内嵌插件。
- `InTreePluginPortworxUnregister`: 在 kubelet 和卷控制器上关闭注册 Portworx 内嵌插件。
- `InTreePluginRBDUnregister`: 在 kubelet 和卷控制器上关闭注册 RBD 内嵌插件。
<!--
- `InTreePluginvSphereUnregister`: Stops registering the vSphere in-tree plugin in kubelet
  and volume controllers.
- `IndexedJob`: Allows the [Job](/docs/concepts/workloads/controllers/job/)
  controller to manage Pod completions per completion index.
- `IngressClassNamespacedParams`: Allow namespace-scoped parameters reference in
  `IngressClass` resource. This feature adds two fields - `Scope` and `Namespace`
  to `IngressClass.spec.parameters`.
- `Initializers`: Allow asynchronous coordination of object creation using the
  Initializers admission plugin.
-->
- `InTreePluginvSphereUnregister`: 在 kubelet 和卷控制器上关闭注册 vSphere 内嵌插件。
- `IndexedJob`：允许 [Job](/zh-cn/docs/concepts/workloads/controllers/job/)
  控制器根据完成索引来管理 Pod 完成。
- `IngressClassNamespacedParams`：允许在 `IngressClass` 资源中引用命名空间范围的参数。
  该特性增加了两个字段 —— `scope`、`namespace` 到 `IngressClass.spec.parameters`。
- `Initializers`： 使用 Initializers 准入插件允许异步协调对象创建。
<!--
- `IPv6DualStack`: Enable [dual stack](/docs/concepts/services-networking/dual-stack/)
  support for IPv6.
- `JobMutableNodeSchedulingDirectives`: Allows updating node scheduling directives in
  the pod template of [Job](/docs/concepts/workloads/controllers/job).
- `JobReadyPods`: Enables tracking the number of Pods that have a `Ready`
  [condition](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions).
  The count of `Ready` pods is recorded in the
  [status](/docs/reference/kubernetes-api/workload-resources/job-v1/#JobStatus)
  of a [Job](/docs/concepts/workloads/controllers/job) status.
-->
- `IPv6DualStack`：启用[双协议栈](/zh-cn/docs/concepts/services-networking/dual-stack/)
  以支持 IPv6。
- `JobMutableNodeSchedulingDirectives`：允许在 [Job](/docs/concepts/workloads/controllers/job)
  的 Pod 模板中更新节点调度指令。 
- `JobReadyPods`：允许跟踪[状况](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)为
  `Ready` 的 Pod 的个数。`Ready` 的 Pod 记录在
  [Job](/zh-cn/docs/concepts/workloads/controllers/job) 对象的
  [status](/docs/reference/kubernetes-api/workload-resources/job-v1/#JobStatus) 字段中。
<!--
- `JobTrackingWithFinalizers`: Enables tracking [Job](/docs/concepts/workloads/controllers/job)
  completions without relying on Pods remaining in the cluster indefinitely.
  The Job controller uses Pod finalizers and a field in the Job status to keep
  track of the finished Pods to count towards completion.
- `KubeletConfigFile`: Enable loading kubelet configuration from
  a file specified using a config file.
  See [setting kubelet parameters via a config file](/docs/tasks/administer-cluster/kubelet-config-file/)
  for more details.
-->
- `JobTrackingWithFinalizers`: 启用跟踪 [Job](/zh-cn/docs/concepts/workloads/controllers/job)
  完成情况，而不是永远从集群剩余 Pod 来获取信息判断完成情况。Job 控制器使用
  Pod finalizers 和 Job 状态中的一个字段来跟踪已完成的 Pod 以计算完成。
- `KubeletConfigFile`：启用从使用配置文件指定的文件中加载 kubelet 配置。
  有关更多详细信息，请参见
  [通过配置文件设置 kubelet 参数](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)。
<!--
- `KubeletCredentialProviders`: Enable kubelet exec credential providers for
  image pull credentials.
- `KubeletInUserNamespace`: Enables support for running kubelet in a
  {{<glossary_tooltip text="user namespace" term_id="userns">}}.
   See [Running Kubernetes Node Components as a Non-root User](/docs/tasks/administer-cluster/kubelet-in-userns/).
- `KubeletPluginsWatcher`: Enable probe-based plugin watcher utility to enable kubelet
  to discover plugins such as [CSI volume drivers](/docs/concepts/storage/volumes/#csi).
-->
- `KubeletCredentialProviders`：允许使用 kubelet exec 凭据提供程序来设置镜像拉取凭据。
- `KubeletInUserNamespace`: 支持在{{<glossary_tooltip text="用户名字空间" term_id="userns">}}
  里运行 kubelet 。
  请参见[使用非 Root 用户来运行 Kubernetes 节点组件](/zh-cn/docs/tasks/administer-cluster/kubelet-in-userns/)。
- `KubeletPluginsWatcher`：启用基于探针的插件监视应用程序，使 kubelet 能够发现类似
  [CSI 卷驱动程序](/zh-cn/docs/concepts/storage/volumes/#csi)这类插件。
<!--
- `KubeletPodResources`: Enable the kubelet's pod resources gRPC endpoint. See
  [Support Device Monitoring](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/606-compute-device-assignment/README.md)
  for more details.
- `KubeletPodResourcesGetAllocatable`: Enable the kubelet's pod resources
  `GetAllocatableResources` functionality. This API augments the
  [resource allocation reporting](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)
  with informations about the allocatable resources, enabling clients to properly
  track the free compute resources on a node.
- `LegacyNodeRoleBehavior`: When disabled, legacy behavior in service load balancers and
  node disruption will ignore the `node-role.kubernetes.io/master` label in favor of the
  feature-specific labels provided by `NodeDisruptionExclusion` and `ServiceNodeExclusion`.
- `LegacyServiceAccountTokenNoAutoGeneration`: Stop auto-generation of Secret-based
  [service account tokens](/docs/reference/access-authn-authz/authentication/#service-account-tokens).
-->
- `KubeletPodResources`：启用 kubelet 上 Pod 资源 GRPC 端点。更多详细信息，
  请参见[支持设备监控](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/compute-device-assignment.md)。
- `KubeletPodResourcesGetAllocatable`：启用 kubelet 的 pod 资源的
  `GetAllocatableResources` 功能。
  该 API 增强了[资源分配报告](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)
  包含有关可分配资源的信息，使客户端能够正确跟踪节点上的可用计算资源。
- `LegacyNodeRoleBehavior`：禁用此门控时，服务负载均衡器中和节点干扰中的原先行为会忽略
  `node-role.kubernetes.io/master` 标签，使用 `NodeDisruptionExclusion` 和
  `ServiceNodeExclusion` 对应特性所提供的标签。
- `LegacyServiceAccountTokenNoAutoGeneration`：停止基于 Secret 的自动生成
  [服务账号令牌](/zh-cn/docs/reference/access-authn-authz/authentication/#service-account-tokens).
<!--
- `LocalStorageCapacityIsolation`: Enable the consumption of
  [local ephemeral storage](/docs/concepts/configuration/manage-resources-containers/)
  and also the `sizeLimit` property of an
  [emptyDir volume](/docs/concepts/storage/volumes/#emptydir).
- `LocalStorageCapacityIsolationFSQuotaMonitoring`: When `LocalStorageCapacityIsolation`
  is enabled for
  [local ephemeral storage](/docs/concepts/configuration/manage-resources-containers/)
  and the backing filesystem for [emptyDir volumes](/docs/concepts/storage/volumes/#emptydir)
  supports project quotas and they are enabled, use project quotas to monitor
  [emptyDir volume](/docs/concepts/storage/volumes/#emptydir) storage consumption rather than
  filesystem walk for better performance and accuracy.
-->
- `LocalStorageCapacityIsolation`：允许使用
  [本地临时存储](/zh-cn/docs/concepts/configuration/manage-resources-containers/)
  以及 [emptyDir 卷](/zh-cn/docs/concepts/storage/volumes/#emptydir)的 `sizeLimit` 属性。
- `LocalStorageCapacityIsolationFSQuotaMonitoring`：如果
  [本地临时存储](/zh-cn/docs/concepts/configuration/manage-resources-containers/)启用了
  `LocalStorageCapacityIsolation`，并且
  [emptyDir 卷](/zh-cn/docs/concepts/storage/volumes/#emptydir)的后备文件系统支持项目配额，
  并且启用了这些配额，将使用项目配额来监视
  [emptyDir 卷](/zh-cn/docs/concepts/storage/volumes/#emptydir)的存储消耗而不是遍历文件系统，
  以此获得更好的性能和准确性。
<!--
- `LogarithmicScaleDown`: Enable semi-random selection of pods to evict on controller scaledown
  based on logarithmic bucketing of pod timestamps.
- `MaxUnavailableStatefulSet`: Enables setting the `maxUnavailable` field for the
  [rolling update strategy](/docs/concepts/workloads/controllers/statefulset/#rolling-updates)
  of a StatefulSet. The field specifies the maximum number of Pods
  that can be unavailable during the update.
- `MemoryManager`: Allows setting memory affinity for a container based on
  NUMA topology.
- `MemoryQoS`: Enable memory protection and usage throttle on pod / container using
  cgroup v2 memory controller.
- `MinDomainsInPodTopologySpread`: Enable `minDomains` in Pod
  [topology spread constraints](/docs/concepts/workloads/pods/pod-topology-spread-constraints/).
- `MixedProtocolLBService`: Enable using different protocols in the same `LoadBalancer` type
  Service instance.
- `MountContainers`: Enable using utility containers on host as the volume mounter.
-->
- `LogarithmicScaleDown`：启用 Pod 的半随机（semi-random）选择，控制器将根据 Pod
  时间戳的对数桶按比例缩小去驱逐 Pod。
- `MaxUnavailableStatefulSet`：启用为 StatefulSet
  的[滚动更新策略](/zh-cn/docs/concepts/workloads/controllers/statefulset/#rolling-updates)设置
  `maxUnavailable` 字段。该字段指定更新过程中不可用 Pod 个数的上限。
- `MemoryManager`：允许基于 NUMA 拓扑为容器设置内存亲和性。
- `MemoryQoS`：使用 cgroup v2 内存控制器在 pod / 容器上启用内存保护和使用限制。
- `MinDomainsInPodTopologySpread`：启用 Pod 的 `minDomains`
  [拓扑分布约束](/zh-cn/docs/concepts/workloads/pods/pod-topology-spread-constraints/).
- `MixedProtocolLBService`：允许在同一 `LoadBalancer` 类型的 Service 实例中使用不同的协议。
- `MountContainers`：允许使用主机上的工具容器作为卷挂载程序。
<!--
- `MountPropagation`: Enable sharing volume mounted by one container to other containers or pods.
  For more details, please see [mount propagation](/docs/concepts/storage/volumes/#mount-propagation).
- `NamespaceDefaultLabelName`: Configure the API Server to set an immutable
  {{< glossary_tooltip text="label" term_id="label" >}} `kubernetes.io/metadata.name`
  on all namespaces, containing the namespace name.
- `NetworkPolicyEndPort`: Enable use of the field `endPort` in NetworkPolicy objects,
  allowing the selection of a port range instead of a single port.
- `NetworkPolicyStatus`: Enable the `status` subresource for NetworkPolicy objects.
- `NodeDisruptionExclusion`: Enable use of the Node label `node.kubernetes.io/exclude-disruption`
  which prevents nodes from being evacuated during zone failures.
- `NodeLease`: Enable the new Lease API to report node heartbeats, which could be used as a node health signal.
-->
- `MountPropagation`：启用将一个容器安装的共享卷共享到其他容器或 Pod。
  更多详细信息，请参见[挂载传播](/zh-cn/docs/concepts/storage/volumes/#mount-propagation)。
- `NamespaceDefaultLabelName`：配置 API 服务器以在所有名字空间上设置一个不可变的
  {{< glossary_tooltip text="标签" term_id="label" >}} `kubernetes.io/metadata.name`，
  也包括名字空间。
- `NetworkPolicyEndPort`：在 NetworkPolicy 对象中启用 `endPort` 以允许选择端口范围而不是单个端口。
- `NetworkPolicyStatus`：为 NetworkPolicy 对象启用 `status` 子资源。
- `NodeDisruptionExclusion`：启用节点标签 `node.kubernetes.io/exclude-disruption`，
  以防止在可用区发生故障期间驱逐节点。
- `NodeLease`：启用新的 Lease（租期）API 以报告节点心跳，可用作节点运行状况信号。
<!--
- `NodeOutOfServiceVolumeDetach`: When a Node is marked out-of-service using the
  `node.kubernetes.io/out-of-service` taint, Pods on the node will be forcefully deleted
   if they can not tolerate this taint, and the volume detach operations for Pods terminating
   on the node will happen immediately. The deleted Pods can recover quickly on different nodes.
- `NodeSwap`: Enable the kubelet to allocate swap memory for Kubernetes workloads on a node.
  Must be used with `KubeletConfiguration.failSwapOn` set to false.
  For more details, please see [swap memory](/docs/concepts/architecture/nodes/#swap-memory)
- `NonPreemptingPriority`: Enable `preemptionPolicy` field for PriorityClass and Pod.
- `OpenAPIEnums`: Enables populating "enum" fields of OpenAPI schemas in the
  spec returned from the API server.
- `OpenAPIV3`: Enables the API server to publish OpenAPI v3.
-->
- `NodeOutOfServiceVolumeDetach`：当使用 `node.kubernetes.io/out-of-service`
  污点将节点标记为停止服务时，节点上不能容忍这个污点的 Pod 将被强制删除，
  并且该在节点上被终止的 Pod 将立即进行卷分离操作。
- `NodeSwap`: 启用 kubelet 为节点上的 Kubernetes 工作负载分配交换内存的能力。
  必须将 `KubeletConfiguration.failSwapOn` 设置为 false 的情况下才能使用。
  更多详细信息，请参见[交换内存](/zh-cn/docs/concepts/architecture/nodes/#swap-memory)。
- `NonPreemptingPriority`：为 PriorityClass 和 Pod 启用 `preemptionPolicy` 选项。
- `OpenAPIEnums`：允许在从 API 服务器返回的 spec 中填充 OpenAPI 模式的 "enum" 字段。
- `OpenAPIV3`：允许 API 服务器发布 OpenAPI V3。
<!--
- `PodDeletionCost`: Enable the [Pod Deletion Cost](/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost)
   feature which allows users to influence ReplicaSet downscaling order.
- `PersistentLocalVolumes`: Enable the usage of `local` volume type in Pods.
  Pod affinity has to be specified if requesting a `local` volume.
- `PodAndContainerStatsFromCRI`: Configure the kubelet to gather container and
  pod stats from the CRI container runtime rather than gathering them from cAdvisor.
- `PodDisruptionBudget`: Enable the [PodDisruptionBudget](/docs/tasks/run-application/configure-pdb/) feature.
- `PodAffinityNamespaceSelector`: Enable the
  [Pod Affinity Namespace Selector](/docs/concepts/scheduling-eviction/assign-pod-node/#namespace-selector)
  and [CrossNamespacePodAffinity](/docs/concepts/policy/resource-quotas/#cross-namespace-pod-affinity-quota)
  quota scope features.
- `PodOverhead`: Enable the [PodOverhead](/docs/concepts/scheduling-eviction/pod-overhead/)
  feature to account for pod overheads.
-->
- `PodDeletionCost`：启用 [Pod 删除成本](/zh-cn/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost)功能。
  该功能使用户可以影响 ReplicaSet 的降序顺序。
- `PersistentLocalVolumes`：允许在 Pod 中使用 `local（本地）` 卷类型。
  如果请求 `local` 卷，则必须指定 Pod 亲和性属性。
- `PodAndContainerStatsFromCRI`：配置 kubelet 从容器和 CRI 容器运行时收集 Pod 统计信息，
   不建议从 cAdvisor 收集统计信息。
- `PodDisruptionBudget`：启用 [PodDisruptionBudget](/zh-cn/docs/tasks/run-application/configure-pdb/) 特性。
- `PodAffinityNamespaceSelector`：启用 [Pod 亲和性名称空间选择器](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#namespace-selector)
  和 [CrossNamespacePodAffinity](/zh-cn/docs/concepts/policy/resource-quotas/#cross-namespace-pod-affinity-quota)
  资源配额功能。
- `PodOverhead`：启用 [PodOverhead](/zh-cn/docs/concepts/scheduling-eviction/pod-overhead/)
  特性以考虑 Pod 开销。
<!--
- `PodPriority`: Enable the descheduling and preemption of Pods based on their
  [priorities](/docs/concepts/scheduling-eviction/pod-priority-preemption/).
- `PodReadinessGates`: Enable the setting of `PodReadinessGate` field for extending
  Pod readiness evaluation. See [Pod readiness gate](/docs/concepts/workloads/pods/pod-lifecycle/#pod-readiness-gate)
  for more details.
- `PodSecurity`: Enables the `PodSecurity` admission plugin.
- `PodShareProcessNamespace`: Enable the setting of `shareProcessNamespace` in a Pod for sharing
  a single process namespace between containers running in a pod.  More details can be found in
  [Share Process Namespace between Containers in a Pod](/docs/tasks/configure-pod-container/share-process-namespace/).
- `PreferNominatedNode`: This flag tells the scheduler whether the nominated
  nodes will be checked first before looping through all the other nodes in
  the cluster.
-->
- `PodPriority`：启用根据[优先级](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)
  的 Pod 调度和抢占。
- `PodReadinessGates`：启用 `podReadinessGate` 字段的设置以扩展 Pod 准备状态评估。
  有关更多详细信息，请参见
  [Pod 就绪状态判别](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-readiness-gate)。
- `PodSecurity`: 开启 `PodSecurity` 准入控制插件。
- `PodShareProcessNamespace`：在 Pod 中启用 `shareProcessNamespace` 的设置，
  以便在 Pod 中运行的容器之间共享同一进程名字空间。更多详细信息，请参见
  [在 Pod 中的容器间共享同一进程名字空间](/zh-cn/docs/tasks/configure-pod-container/share-process-namespace/)。
- `PreferNominatedNode`: 这个标志告诉调度器在循环遍历集群中的所有其他节点之前，
  是否首先检查指定的节点。
<!--
- `ProbeTerminationGracePeriod`: Enable [setting probe-level
  `terminationGracePeriodSeconds`](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#probe-level-terminationgraceperiodseconds)
  on pods. See the [enhancement proposal](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2238-liveness-probe-grace-period)
  for more details.
- `ProcMountType`: Enables control over the type proc mounts for containers
  by setting the `procMount` field of a SecurityContext.
- `ProxyTerminatingEndpoints`: Enable the kube-proxy to handle terminating
  endpoints when `ExternalTrafficPolicy=Local`.
- `PVCProtection`: Enable the prevention of a PersistentVolumeClaim (PVC) from
  being deleted when it is still used by any Pod.
- `QOSReserved`: Allows resource reservations at the QoS level preventing pods
  at lower QoS levels from bursting into resources requested at higher QoS levels
  (memory only for now).
- `ReadWriteOncePod`: Enables the usage of `ReadWriteOncePod` PersistentVolume
  access mode.
-->
- `ProbeTerminationGracePeriod`：在 Pod 上启用 
  [设置探测器级别 `terminationGracePeriodSeconds`](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#probe-level-terminationgraceperiodseconds)。
  有关更多信息，请参见[改进提案](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2238-liveness-probe-grace-period)。
- `ProcMountType`：允许容器通过设置 SecurityContext 的 `procMount` 字段来控制对
  proc 文件系统的挂载方式。
- `ProxyTerminatingEndpoints`: 当 `ExternalTrafficPolicy=Local` 时，
  允许 kube-proxy 来处理终止过程中的端点。
- `PVCProtection`：当 PersistentVolumeClaim (PVC) 仍然在 Pod 使用时被删除，启用保护。
- `QOSReserved`：允许在 QoS 级别进行资源预留，以防止处于较低 QoS 级别的 Pod
  突发进入处于较高 QoS 级别的请求资源（目前仅适用于内存）。
- `ReadWriteOncePod`: 允许使用 `ReadWriteOncePod` 访问模式的 PersistentVolume。
<!--
- `RecoverVolumeExpansionFailure`: Enables users to edit their PVCs to smaller
  sizes so as they can recover from previously issued volume expansion failures.
  See [Recovering from Failure when Expanding Volumes](/docs/concepts/storage/persistent-volumes/#recovering-from-failure-when-expanding-volumes)
  for more details.
- `RemainingItemCount`: Allow the API servers to show a count of remaining
  items in the response to a
  [chunking list request](/docs/reference/using-api/api-concepts/#retrieving-large-results-sets-in-chunks).
- `RemoveSelfLink`: Sets the `.metadata.selfLink` field to blank (empty string) for all
  objects and collections. This field has been deprecated since the Kubernetes v1.16
  release. When this feature is enabled, the `.metadata.selfLink` field remains part of
  the Kubernetes API, but is always unset.
- `RequestManagement`: Enables managing request concurrency with prioritization and fairness
  at each API server. Deprecated by `APIPriorityAndFairness` since 1.17.
-->
- `RecoverVolumeExpansionFailure`：允许用户编辑其 PVC 来缩小其尺寸，
  从而从之前卷扩容发生的失败中恢复。更多细节可参见
  [从卷扩容失效中恢复](/zh-cn/docs/concepts/storage/persistent-volumes/#recovering-from-failure-when-expanding-volumes)。
- `RemainingItemCount`：允许 API 服务器在
  [分块列表请求](/zh-cn/docs/reference/using-api/api-concepts/#retrieving-large-results-sets-in-chunks)
  的响应中显示剩余条目的个数。
- `RemoveSelfLink`：将所有对象和集合的 `.metadata.selfLink` 字段设置为空（空字符串）。
  该字段自 Kubernetes v1.16 版本以来已被弃用。
  启用此功能后，`.metadata.selfLink` 字段仍然是 Kubernetes API 的一部分，但始终未设置。
- `RequestManagement`：允许在每个 API 服务器上通过优先级和公平性管理请求并发性。
  自 1.17 以来已被 `APIPriorityAndFairness` 替代。
<!--
- `ResourceLimitsPriorityFunction`: Enable a scheduler priority function that
  assigns a lowest possible score of 1 to a node that satisfies at least one of
  the input Pod's cpu and memory limits. The intent is to break ties between
  nodes with same scores.
- `ResourceQuotaScopeSelectors`: Enable resource quota scope selectors.
- `RootCAConfigMap`: Configure the `kube-controller-manager` to publish a
  {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} named `kube-root-ca.crt`
  to every namespace. This ConfigMap contains a CA bundle used for verifying connections
  to the kube-apiserver. See
  [Bound Service Account Tokens](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md)
  for more details.
-->
- `ResourceLimitsPriorityFunction`：启用某调度器优先级函数，
  该函数将最低得分 1 指派给至少满足输入 Pod 的 CPU 和内存限制之一的节点，
  目的是打破得分相同的节点之间的关联。
- `ResourceQuotaScopeSelectors`：启用资源配额范围选择器。
- `RootCAConfigMap`：配置 `kube-controller-manager`，使之发布一个名为 `kube-root-ca.crt`
  的 {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}，
  到所有名字空间中。该 ConfigMap 包含用来验证与 kube-apiserver 之间连接的 CA 证书包。
  参阅[绑定服务账户令牌](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md)
  以了解更多细节。
<!--
- `RotateKubeletClientCertificate`: Enable the rotation of the client TLS certificate on the kubelet.
  See [kubelet configuration](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#kubelet-configuration)
  for more details.
- `RotateKubeletServerCertificate`: Enable the rotation of the server TLS certificate on the kubelet.
  See [kubelet configuration](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#kubelet-configuration)
  for more details.
- `RunAsGroup`: Enable control over the primary group ID set on the init
  processes of containers.
-->
- `RotateKubeletClientCertificate`：在 kubelet 上启用客户端 TLS 证书的轮换。
  更多详细信息，请参见
  [kubelet 配置](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#kubelet-configuration)。
- `RotateKubeletServerCertificate`：在 kubelet 上启用服务器 TLS 证书的轮换。
  更多详细信息，请参见
  [kubelet 配置](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#kubelet-configuration)。
- `RunAsGroup`：启用对容器初始化过程中设置的主要组 ID 的控制。
<!--
- `RuntimeClass`: Enable the [RuntimeClass](/docs/concepts/containers/runtime-class/) feature
  for selecting container runtime configurations.
- `ScheduleDaemonSetPods`: Enable DaemonSet Pods to be scheduled by the default scheduler
  instead of the DaemonSet controller.
- `SCTPSupport`: Enables the _SCTP_ `protocol` value in Pod, Service,
  Endpoints, EndpointSlice, and NetworkPolicy definitions.
- `SeccompDefault`: Enables the use of `RuntimeDefault` as the default seccomp profile
  for all workloads.
  The seccomp profile is specified in the `securityContext` of a Pod and/or a Container.
- `SelectorIndex`: Allows label and field based indexes in API server watch
  cache to accelerate list operations.
-->
- `RuntimeClass`：启用 [RuntimeClass](/zh-cn/docs/concepts/containers/runtime-class/)
  特性用于选择容器运行时配置。
- `ScheduleDaemonSetPods`：启用 DaemonSet Pods 由默认调度程序而不是
  DaemonSet 控制器进行调度。
- `SCTPSupport`：在 Pod、Service、Endpoints、NetworkPolicy 定义中允许将 'SCTP'
  用作 `protocol` 值。
- `SeccompDefault`: 允许将所有工作负载的默认  seccomp 配置文件为 `RuntimeDefault`。
  seccomp 配置在 Pod 或者容器的 `securityContext` 字段中指定。
- `SelectorIndex`: 允许使用 API 服务器的 watch 缓存中基于标签和字段的索引来加速 list 操作。
<!--
- `ServerSideApply`: Enables the [Sever Side Apply (SSA)](/docs/reference/using-api/server-side-apply/)
  feature on the API Server.
- `ServerSideFieldValidation`: Enables server-side field validation. This means the validation
  of resource schema is performed at the API server side rather than the client side
  (for example, the `kubectl create` or `kubectl apply` command line).
- `ServiceAccountIssuerDiscovery`: Enable OIDC discovery endpoints (issuer and
  JWKS URLs) for the service account issuer in the API server. See
  [Configure Service Accounts for Pods](/docs/tasks/configure-pod-container/configure-service-account/#service-account-issuer-discovery)
  for more details.
- `ServiceAppProtocol`: Enables the `appProtocol` field on Services and Endpoints.
- `ServiceInternalTrafficPolicy`: Enables the `internalTrafficPolicy` field on Services
- `ServiceLBNodePortControl`: Enables the `allocateLoadBalancerNodePorts` field on Services.
-->
- `ServerSideApply`：在 API 服务器上启用
  [服务器端应用（SSA）](/zh-cn/docs/reference/using-api/server-side-apply/) 。
- `ServerSideFieldValidation`：启用服务器端字段验证。
  这意味着验证资源模式在 API 服务器端而不是客户端执行
  （例如，`kubectl create` 或 `kubectl apply` 命令行）。
- `ServiceAccountIssuerDiscovery`：在 API 服务器中为服务帐户颁发者启用 OIDC 发现端点
  （颁发者和 JWKS URL）。详情参见
  [为 Pod 配置服务账户](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#service-account-issuer-discovery) 。
- `ServiceAppProtocol`：为 Service 和 Endpoints 启用 `appProtocol` 字段。
- `ServiceInternalTrafficPolicy`：为服务启用 `internalTrafficPolicy` 字段。
- `ServiceLBNodePortControl`：为服务启用 `allocateLoadBalancerNodePorts` 字段。
<!--
- `ServiceLoadBalancerClass`: Enables the `loadBalancerClass` field on Services. See
  [Specifying class of load balancer implementation](/docs/concepts/services-networking/service/#load-balancer-class)
  for more details.
- `ServiceLoadBalancerFinalizer`: Enable finalizer protection for Service load balancers.
- `ServiceNodeExclusion`: Enable the exclusion of nodes from load balancers
  created by a cloud provider. A node is eligible for exclusion if labelled with
  "`node.kubernetes.io/exclude-from-external-load-balancers`".
- `ServiceTopology`: Enable service to route traffic based upon the Node
  topology of the cluster. See
  [ServiceTopology](/docs/concepts/services-networking/service-topology/)
  for more details.
- `ServiceIPStaticSubrange`: Enables a strategy for Services ClusterIP allocations, whereby the
  ClusterIP range is subdivided. Dynamic allocated ClusterIP addresses will be allocated preferently
  from the upper range allowing users to assign static ClusterIPs from the lower range with a low
  risk of collision. See
  [Avoiding collisions](/docs/concepts/services-networking/service/#avoiding-collisions)
  for more details.
-->
- `ServiceLoadBalancerClass`: 为服务启用 `loadBalancerClass` 字段。 
  有关更多信息，请参见[指定负载均衡器实现类](/zh-cn/docs/concepts/services-networking/service/#load-balancer-class)。
- `ServiceLoadBalancerFinalizer`：为服务负载均衡启用终结器（finalizers）保护。
- `ServiceNodeExclusion`：启用从云提供商创建的负载均衡中排除节点。
  如果节点标记有 `node.kubernetes.io/exclude-from-external-load-balancers`，
  标签，则可以排除该节点。
- `ServiceTopology`：启用服务拓扑可以让一个服务基于集群的节点拓扑进行流量路由。
  有关更多详细信息，请参见[服务拓扑](/zh-cn/docs/concepts/services-networking/service-topology/)。
- `ServiceIPStaticSubrange`：启用服务 ClusterIP 分配策略，从而细分 ClusterIP 范围。
  动态分配的 ClusterIP 地址将优先从较高范围分配，以低冲突风险允许用户从较低范围分配静态 ClusterIP。
  更多详细信息请参阅[避免冲突](/zh-cn/docs/concepts/services-networking/service/#avoiding-collisions)
<!--
- `SetHostnameAsFQDN`: Enable the ability of setting Fully Qualified Domain
  Name(FQDN) as the hostname of a pod. See
  [Pod's `setHostnameAsFQDN` field](/docs/concepts/services-networking/dns-pod-service/#pod-sethostnameasfqdn-field).
- `SizeMemoryBackedVolumes`: Enable kubelets to determine the size limit for
  memory-backed volumes (mainly `emptyDir` volumes).
- `StartupProbe`: Enable the
  [startup](/docs/concepts/workloads/pods/pod-lifecycle/#when-should-you-use-a-startup-probe)
  probe in the kubelet.
- `StatefulSetMinReadySeconds`: Allows `minReadySeconds` to be respected by
  the StatefulSet controller.
-->
- `SetHostnameAsFQDN`：启用将全限定域名（FQDN）设置为 Pod 主机名的功能。
  请参见[为 Pod 设置 `setHostnameAsFQDN` 字段](/zh-cn/docs/concepts/services-networking/dns-pod-service/#pod-sethostnameasfqdn-field)。
- `SizeMemoryBackedVolumes`：允许 kubelet 检查基于内存制备的卷的尺寸约束
  （目前主要针对 `emptyDir` 卷）。
- `StartupProbe`：在 kubelet 中启用
  [启动探针](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#when-should-you-use-a-startup-probe)。
- `StatefulSetMinReadySeconds`: 允许 StatefulSet 控制器采纳 `minReadySeconds` 设置。
<!--
- `StorageObjectInUseProtection`: Postpone the deletion of PersistentVolume or
  PersistentVolumeClaim objects if they are still being used.
- `StorageVersionAPI`: Enable the
  [storage version API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#storageversion-v1alpha1-internal-apiserver-k8s-io).
- `StorageVersionHash`: Allow API servers to expose the storage version hash in the
  discovery.
- `StreamingProxyRedirects`: Instructs the API server to intercept (and follow)
  redirects from the backend (kubelet) for streaming requests.
  Examples of streaming requests include the `exec`, `attach` and `port-forward` requests.
-->
- `StorageObjectInUseProtection`：如果仍在使用 PersistentVolume 或
  PersistentVolumeClaim 对象，则将其删除操作推迟。
- `StorageVersionAPI`: 启用
  [存储版本 API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#storageversion-v1alpha1-internal-apiserver-k8s-io)。
- `StorageVersionHash`：允许 API 服务器在版本发现中公开存储版本的哈希值。
- `StreamingProxyRedirects`：指示 API 服务器拦截（并跟踪）后端（kubelet）
  的重定向以处理流请求。
  流请求的例子包括 `exec`、`attach` 和 `port-forward` 请求。
<!--
- `SupportIPVSProxyMode`: Enable providing in-cluster service load balancing using IPVS.
  See [service proxies](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies) for more details.
- `SupportNodePidsLimit`: Enable the support to limiting PIDs on the Node.
  The parameter `pid=<number>` in the `--system-reserved` and `--kube-reserved`
  options can be specified to ensure that the specified number of process IDs
  will be reserved for the system as a whole and for Kubernetes system daemons
  respectively.
- `SupportPodPidsLimit`: Enable the support to limiting PIDs in Pods.
-->
- `SupportIPVSProxyMode`：启用使用 IPVS 提供集群内服务负载平衡。更多详细信息，请参见
  [服务代理](/zh-cn/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)。
- `SupportNodePidsLimit`：启用支持，限制节点上的 PID 用量。
  `--system-reserved` 和 `--kube-reserved` 中的参数 `pid=<数值>` 可以分别用来
  设定为整个系统所预留的进程 ID 个数和为 Kubernetes 系统守护进程预留的进程 ID 个数。
- `SupportPodPidsLimit`：启用支持限制 Pod 中的进程 PID。
<!--
- `SuspendJob`: Enable support to suspend and resume Jobs. See
  [the Jobs docs](/docs/concepts/workloads/controllers/job/) for
  more details.
- `Sysctls`: Enable support for namespaced kernel parameters (sysctls) that can be
  set for each pod. See
  [sysctls](/docs/tasks/administer-cluster/sysctl-cluster/) for more details.
- `TTLAfterFinished`: Allow a
  [TTL controller](/docs/concepts/workloads/controllers/ttlafterfinished/)
  to clean up resources after they finish execution.
-->
- `SuspendJob`： 启用支持以暂停和恢复作业。 更多详细信息，请参见
  [Jobs 文档](/zh-cn/docs/concepts/workloads/controllers/job/)。
- `Sysctls`：允许为每个 Pod 设置的名字空间内核参数（sysctls）。
  更多详细信息，请参见 [sysctls](/zh-cn/docs/tasks/administer-cluster/sysctl-cluster/)。
- `TTLAfterFinished`：资源完成执行后，允许
  [TTL 控制器](/zh-cn/docs/concepts/workloads/controllers/ttlafterfinished/)清理资源。
<!--
- `TaintBasedEvictions`: Enable evicting pods from nodes based on taints on Nodes
  and tolerations on Pods.
  See [taints and tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/)
  for more details.
- `TaintNodesByCondition`: Enable automatic tainting nodes based on
  [node conditions](/docs/concepts/architecture/nodes/#condition).
- `TokenRequest`: Enable the `TokenRequest` endpoint on service account resources.
- `TokenRequestProjection`: Enable the injection of service account tokens into a
  Pod through a [`projected` volume](/docs/concepts/storage/volumes/#projected).
-->
- `TaintBasedEvictions`：根据节点上的污点和 Pod 上的容忍度启用从节点驱逐 Pod 的特性。
  更多详细信息可参见[污点和容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)。
- `TaintNodesByCondition`：根据[节点状况](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)
  启用自动为节点标记污点。
- `TokenRequest`：在服务帐户资源上启用 `TokenRequest` 端点。
- `TokenRequestProjection`：启用通过
  [`projected` 卷](/zh-cn/docs/concepts/storage/volumes/#projected)
  将服务帐户令牌注入到 Pod 中的特性。
<!--
- `TopologyAwareHints`: Enables topology aware routing based on topology hints
  in EndpointSlices. See [Topology Aware
  Hints](/docs/concepts/services-networking/topology-aware-hints/) for more
  details.
- `TopologyManager`: Enable a mechanism to coordinate fine-grained hardware resource
  assignments for different components in Kubernetes. See
  [Control Topology Management Policies on a node](/docs/tasks/administer-cluster/topology-manager/).
- `ValidateProxyRedirects`: This flag controls whether the API server should
  validate that redirects are only followed to the same host. Only used if the
  `StreamingProxyRedirects` flag is enabled.
-->
- `TopologyAwareHints`： 在 EndpointSlices 中启用基于拓扑提示的拓扑感知路由。
  更多详细信息可参见[拓扑感知提示](/zh-cn/docs/concepts/services-networking/topology-aware-hints/)。
- `TopologyManager`：启用一种机制来协调 Kubernetes 不同组件的细粒度硬件资源分配。
  详见[控制节点上的拓扑管理策略](/zh-cn/docs/tasks/administer-cluster/topology-manager/)。
- `ValidateProxyRedirects`： 这个标志控制 API 服务器是否应该验证只跟随到相同的主机的重定向。
  仅在启用 `StreamingProxyRedirects` 标志时被使用。
<!--
- `VolumeCapacityPriority`: Enable support for prioritizing nodes in different
  topologies based on available PV capacity.
- `VolumePVCDataSource`: Enable support for specifying an existing PVC as a DataSource.
- `VolumeScheduling`: Enable volume topology aware scheduling and make the
  PersistentVolumeClaim (PVC) binding aware of scheduling decisions. It also
  enables the usage of [`local`](/docs/concepts/storage/volumes/#local) volume
  type when used together with the `PersistentLocalVolumes` feature gate.
- `VolumeSnapshotDataSource`: Enable volume snapshot data source support.
- `VolumeSubpath`: Allow mounting a subpath of a volume in a container.
-->
- `VolumeCapacityPriority`: 基于可用 PV 容量的拓扑，启用对不同节点的优先级支持。
- `VolumePVCDataSource`：启用对将现有 PVC 指定数据源的支持。
- `VolumeScheduling`：启用卷拓扑感知调度，并使 PersistentVolumeClaim（PVC）
  绑定能够了解调度决策；当与 PersistentLocalVolumes 特性门控一起使用时，
  还允许使用 [`local`](/zh-cn/docs/concepts/storage/volumes/#local) 卷类型。
- `VolumeSnapshotDataSource`：启用卷快照数据源支持。
- `VolumeSubpath`： 允许在容器中挂载卷的子路径。
<!--
- `VolumeSubpathEnvExpansion`: Enable `subPathExpr` field for expanding environment
  variables into a `subPath`.
- `WarningHeaders`: Allow sending warning headers in API responses.
- `WatchBookmark`: Enable support for watch bookmark events.
- `WinDSR`: Allows kube-proxy to create DSR loadbalancers for Windows.
- `WinOverlay`: Allows kube-proxy to run in overlay mode for Windows.
-->
- `VolumeSubpathEnvExpansion`：启用 `subPathExpr` 字段用于在 `subPath` 中展开环境变量。
- `WarningHeaders`：允许在 API 响应中发送警告头部。
- `WatchBookmark`：启用对 watch 操作中 bookmark 事件的支持。
- `WinDSR`：允许 kube-proxy 为 Windows 创建 DSR 负载均衡。
- `WinOverlay`：允许在 Windows 的覆盖网络模式下运行 kube-proxy 。
<!--
- `WindowsEndpointSliceProxying`: When enabled, kube-proxy running on Windows
  will use EndpointSlices as the primary data source instead of Endpoints,
  enabling scalability and performance improvements. See
  [Enabling Endpoint Slices](/docs/concepts/services-networking/endpoint-slices/).
- `WindowsGMSA`: Enables passing of GMSA credential specs from pods to container runtimes.
- `WindowsHostProcessContainers`: Enables support for Windows HostProcess containers.
- `WindowsRunAsUserName` : Enable support for running applications in Windows containers
  with as a non-default user. See
  [Configuring RunAsUserName](/docs/tasks/configure-pod-container/configure-runasusername)
  for more details.
  
-->
- `WindowsEndpointSliceProxying`: 当启用时，运行在 Windows 上的 kube-proxy
  将使用 EndpointSlices 而不是 Endpoints 作为主要数据源，从而实现可伸缩性和并改进性能。 
  详情请参见[启用端点切片](/zh-cn/docs/concepts/services-networking/endpoint-slices/).
- `WindowsGMSA`：允许将 GMSA 凭据规范从 Pod 传递到容器运行时。
- `WindowsHostProcessContainers`: 启用对 Windows HostProcess 容器的支持。
- `WindowsRunAsUserName`：提供使用非默认用户在 Windows 容器中运行应用程序的支持。
  详情请参见
  [配置 RunAsUserName](/zh-cn/docs/tasks/configure-pod-container/configure-runasusername)。

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
* Kubernetes 的[弃用策略](/zh-cn/docs/reference/using-api/deprecation-policy/)
  介绍了项目针对已移除特性和组件的处理方法。
* 从 Kubernetes 1.24 开始，默认不启用新的 beta API。
  启用 beta 功能时，还需要启用所有关联的 API 资源。
  例如：要启用一个特定资源，如 `storage.k8s.io/v1beta1/csistoragecapacities`，
  请设置 `--runtime-config=storage.k8s.io/v1beta1/csistoragecapacities`。
  有关命令行标志的更多详细信息，请参阅 [API 版本控制](/zh-cn/docs/reference/using-api/#api-versioning)。
