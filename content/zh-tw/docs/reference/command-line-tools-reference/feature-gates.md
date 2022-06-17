---
title: 特性門控
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
本頁詳述了管理員可以在不同的 Kubernetes 元件上指定的各種特性門控。

關於特性各個階段的說明，請參見[特性階段](#feature-stages)。

<!-- body -->

<!--
## Overview

Feature gates are a set of key=value pairs that describe Kubernetes features.
You can turn these features on or off using the `--feature-gates` command line flag
on each Kubernetes component.
-->
## 概述

特性門控是描述 Kubernetes 特性的一組鍵值對。你可以在 Kubernetes 的各個元件中使用
`--feature-gates` flag 來啟用或禁用這些特性。

<!--
Each Kubernetes component lets you enable or disable a set of feature gates that
are relevant to that component.
Use `-h` flag to see a full set of feature gates for all components.
To set feature gates for a component, such as kubelet, use the `--feature-gates`
flag assigned to a list of feature pairs:
-->
每個 Kubernetes 元件都支援啟用或禁用與該元件相關的一組特性門控。
使用 `-h` 引數來檢視所有元件支援的完整特性門控。
要為諸如 kubelet 之類的元件設定特性門控，請使用 `--feature-gates` 引數，並向其
傳遞一個特性設定鍵值對列表：

```shell
--feature-gates="...,GracefulNodeShutdown=true"
```

<!--
The following tables are a summary of the feature gates that you can set on
different Kubernetes components.
-->
下表總結了在不同的 Kubernetes 元件上可以設定的特性門控。

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
- 引入特性或更改其釋出階段後，"開始（Since）" 列將包含 Kubernetes 版本。
- "結束（Until）" 列（如果不為空）包含最後一個 Kubernetes 版本，你仍可以在其中使用特性門控。
- 如果某個特性處於 Alpha 或 Beta 狀態，你可以在
  [Alpha 和 Beta 特性門控表](#feature-gates-for-alpha-or-beta-features)中找到該特性。
- 如果某個特性處於穩定狀態，你可以在
  [已畢業和廢棄特性門控表](#feature-gates-for-graduated-or-deprecated-features)
  中找到該特性的所有階段。
- [已畢業和廢棄特性門控表](#feature-gates-for-graduated-or-deprecated-features)
  還列出了廢棄的和已被移除的特性。

<!--
### Feature gates for Alpha or Beta features

{{< table caption="Feature gates for features in Alpha or Beta states" >}}

| Feature | Default | Stage | Since | Until |

{{< /table >}}
-->
### Alpha 和 Beta 狀態的特性門控  {#feature-gates-for-alpha-or-beta-features}

{{< table caption="處於 Alpha 或 Beta 狀態的特性門控" >}}

| 特性    | 預設值  | 狀態  | 開始（Since） | 結束（Until） |
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
### 已畢業和已廢棄的特性門控  {#feature-gates-for-graduated-or-deprecated-features}

{{< table caption="已畢業或不推薦使用的特性門控" >}}

| 特性    | 預設值  | 狀態  | 開始（Since） | 結束（Until） |
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

### 特性階段    {#feature-stages}

<!--
A feature can be in *Alpha*, *Beta* or *GA* stage.
An *Alpha* feature means:
-->

處於 *Alpha* 、*Beta* 、 *GA* 階段的特性。

*Alpha* 特性代表：

<!--
* Disabled by default.
* Might be buggy. Enabling the feature may expose bugs.
* Support for feature may be dropped at any time without notice.
* The API may change in incompatible ways in a later software release without notice.
* Recommended for use only in short-lived testing clusters, due to increased
  risk of bugs and lack of long-term support.
-->
* 預設禁用。
* 可能有錯誤，啟用此特性可能會導致錯誤。
* 隨時可能刪除對此特性的支援，恕不另行通知。
* 在以後的軟體版本中，API 可能會以不相容的方式更改，恕不另行通知。
* 建議將其僅用於短期測試中，因為開啟特性會增加錯誤的風險，並且缺乏長期支援。

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
* 預設啟用。
* 該特性已經經過良好測試。啟用該特性是安全的。
* 儘管詳細資訊可能會更改，但不會放棄對整體特性的支援。
* 物件的架構或語義可能會在隨後的 Beta 或穩定版本中以不相容的方式更改。當發生這種情況時，我們將提供遷移到下一版本的說明。此特性可能需要刪除、編輯和重新建立 API 物件。編輯過程可能需要慎重操作，因為這可能會導致依賴該特性的應用程式停機。
* 推薦僅用於非關鍵業務用途，因為在後續版本中可能會發生不相容的更改。如果你具有多個可以獨立升級的，則可以放寬此限制。

{{< note >}}
<!--
Please do try *Beta* features and give feedback on them!
After they exit beta, it may not be practical for us to make more changes.
-->
請試用 *Beta* 特性並提供相關反饋！
一旦特性結束 Beta 狀態，我們就不太可能再對特性進行大幅修改。
{{< /note >}}

<!--
A *General Availability* (GA) feature is also referred to as a *stable* feature. It means:
-->
*General Availability* (GA) 特性也稱為 *穩定* 特性，*GA* 特性代表著：

<!--
* The feature is always enabled; you cannot disable it.
* The corresponding feature gate is no longer needed.
* Stable versions of features will appear in released software for many subsequent versions.
-->
* 此特性會一直啟用；你不能禁用它。
* 不再需要相應的特性門控。
* 對於許多後續版本，特性的穩定版本將出現在發行的軟體中。

<!--
## List of feature gates {#feature-gates}

Each feature gate is designed for enabling/disabling a specific feature:
-->

### 特性門控列表

每個特性門控均用於啟用或禁用某個特定的特性：

<!--
- `APIListChunking`: Enable the API clients to retrieve (`LIST` or `GET`)
  resources from API server in chunks.
- `APIPriorityAndFairness`: Enable managing request concurrency with
  prioritization and fairness at each server. (Renamed from `RequestManagement`)
- `APIResponseCompression`: Compress the API responses for `LIST` or `GET` requests.
- `APIServerIdentity`: Assign each API server an ID in a cluster.
- `APIServerTracing`: Add support for distributed tracing in the API server.
-->
- `APIListChunking`：啟用 API 客戶端以塊的形式從 API 伺服器檢索（“LIST” 或 “GET”）資源。
- `APIPriorityAndFairness`: 在每個伺服器上啟用優先順序和公平性來管理請求併發。（由 `RequestManagement` 重新命名而來）
- `APIResponseCompression`：壓縮 “LIST” 或 “GET” 請求的 API 響應。
- `APIServerIdentity`：為叢集中的每個 API 伺服器賦予一個 ID。
- `APIServerTracing`: 為叢集中的每個 API 伺服器新增對分散式跟蹤的支援。
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
- `AppArmor`: Enable AppArmor based mandatory access control for Pods running on Linux nodes.
   See [AppArmor Tutorial](/docs/tutorials/security/apparmor/) for more details.
-->
- `Accelerators`：使用 Docker Engine 時啟用 Nvidia GPU 支援。這一特性不再提供。
  關於替代方案，請參閱[裝置外掛](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)。
- `AdvancedAuditing`：啟用[高階審計功能](/zh-cn/docs/tasks/debug/debug-cluster/audit/#advanced-audit)。
- `AffinityInAnnotations`：啟用 [Pod 親和或反親和](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)。
- `AllowExtTrafficLocalEndpoints`：啟用服務用於將外部請求路由到節點本地終端。
- `AllowInsecureBackendProxy`：允許使用者在執行 Pod 日誌訪問請求時跳過 TLS 驗證。
- `AnyVolumeDataSource`: 允許使用任何自定義的資源來做作為
  {{< glossary_tooltip text="PVC" term_id="persistent-volume-claim" >}} 中的 `DataSource`.
- `AppArmor`：在 Linux 節點上為 Pod 啟用基於 AppArmor 機制的強制訪問控制。
  請參見 [AppArmor 教程](/zh-cn/docs/tutorials/security/apparmor/) 獲取詳細資訊。
<!--
- `AttachVolumeLimit`: Enable volume plugins to report limits on number of volumes
  that can be attached to a node.
  See [dynamic volume limits](/docs/concepts/storage/storage-limits/#dynamic-volume-limits) for more details.
- `BalanceAttachedNodeVolumes`: Include volume count on node to be considered for balanced resource allocation
  while scheduling. A node which has closer CPU, memory utilization, and volume count is favored by the scheduler
  while making decisions.
- `BlockVolume`: Enable the definition and consumption of raw block devices in Pods.
  See [Raw Block Volume Support](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support)
   for more details.
- `BoundServiceAccountTokenVolume`: Migrate ServiceAccount volumes to use a projected volume consisting of a
  ServiceAccountTokenVolumeProjection. Cluster admins can use metric `serviceaccount_stale_tokens_total` to
  monitor workloads that are depending on the extended tokens. If there are no such workloads, turn off
  extended tokens by starting `kube-apiserver` with flag `--service-account-extend-token-expiration=false`.
  Check [Bound Service Account Tokens](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md)
  for more details.
- `ControllerManagerLeaderMigration`: Enables Leader Migration for
  [kube-controller-manager](/docs/tasks/administer-cluster/controller-manager-leader-migration/#initial-leader-migration-configuration) and
  [cloud-controller-manager](/docs/tasks/administer-cluster/controller-manager-leader-migration/#deploy-cloud-controller-manager) which allows a cluster operator to live migrate
  controllers from the kube-controller-manager into an external controller-manager
  (e.g. the cloud-controller-manager) in an HA cluster without downtime.
-->
- `AttachVolumeLimit`：啟用卷外掛用於報告可連線到節點的卷數限制。有關更多詳細資訊，請參閱
  [動態卷限制](/zh-cn/docs/concepts/storage/storage-limits/#dynamic-volume-limits)。
- `BalanceAttachedNodeVolumes`：在進行平衡資源分配的排程時，考慮節點上的卷數。
  排程器在決策時會優先考慮 CPU、記憶體利用率和卷數更近的節點。
- `BlockVolume`：在 Pod 中啟用原始塊裝置的定義和使用。有關更多詳細資訊，請參見
  [原始塊卷支援](/zh-cn/docs/concepts/storage/persistent-volumes/#raw-block-volume-support)。
- `BoundServiceAccountTokenVolume`：遷移 ServiceAccount 卷以使用由
  ServiceAccountTokenVolumeProjection 組成的投射卷。叢集管理員可以使用
  `serviceaccount_stale_tokens_total` 度量值來監控依賴於擴充套件令牌的負載。
  如果沒有這種型別的負載，你可以在啟動 `kube-apiserver` 時新增
  `--service-account-extend-token-expiration=false` 引數關閉擴充套件令牌。檢視 
  [繫結服務賬號令牌](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md)
  獲取更多詳細資訊。
- `ControllerManagerLeaderMigration`: 為 
  [kube-controller-manager](/zh-cn/docs/tasks/administer-cluster/controller-manager-leader-migration/#initial-leader-migration-configuration) 和 
  [cloud-controller-manager](/zh-cn/docs/tasks/administer-cluster/controller-manager-leader-migration/#deploy-cloud-controller-manager) 
  啟用 Leader 遷移，它允許叢集管理者在沒有停機的高可用叢集環境下，實時
  把 kube-controller-manager 遷移遷移到外部的 controller-manager (例如 cloud-controller-manager) 中。
<!--
- `CPUManager`: Enable container level CPU affinity support, see
  [CPU Management Policies](/docs/tasks/administer-cluster/cpu-management-policies/).
- `CPUManagerPolicyAlphaOptions`: This allows fine-tuning of CPUManager policies, experimental, Alpha-quality options
  This feature gate guards *a group* of CPUManager options whose quality level is alpha.
  This feature gate will never graduate to beta or stable.
- `CPUManagerPolicyBetaOptions`: This allows fine-tuning of CPUManager policies, experimental, Beta-quality options
  This feature gate guards *a group* of CPUManager options whose quality level is beta.
  This feature gate will never graduate to stable.
- `CPUManagerPolicyOptions`: Allow fine-tuning of CPUManager policies.
-->
- `CPUManager`：啟用容器級別的 CPU 親和性支援，有關更多詳細資訊，請參見
  [CPU 管理策略](/zh-cn/docs/tasks/administer-cluster/cpu-management-policies/)。
- `CPUManagerPolicyAlphaOptions`：允許對 CPUManager 策略進行微調，針對試驗性的、
  alpha 質量級別的選項。
  此特性門控用來保護一組質量級別為 alpha 的 CPUManager 選項。
  此特性門控永遠不會被升級為 beta 或者穩定版本。
- `CPUManagerPolicyBetaOptions`：允許對 CPUManager 策略進行微調，針對試驗性的、
  beta 質量級別的選項。
  此特性門控用來保護一組質量級別為 beta 的 CPUManager 選項。
  此特性門控永遠不會被升級為穩定版本。
- `CPUManagerPolicyOptions`: 允許微調 CPU 管理策略。
<!--
- `CRIContainerLogRotation`: Enable container log rotation for CRI container runtime. The default max size of a log file is 10MB and the
  default max number of log files allowed for a container is 5. These values can be configured in the kubelet config.
  See the [logging at node level](/docs/concepts/cluster-administration/logging/#logging-at-the-node-level) documentation for more details.
- `CSIBlockVolume`: Enable external CSI volume drivers to support block storage.
  See the [`csi` raw block volume support](/docs/concepts/storage/volumes/#csi-raw-block-volume-support)
  documentation for more details.
- `CSIDriverRegistry`: Enable all logic related to the CSIDriver API object in
  csi.storage.k8s.io.
- `CSIInlineVolume`: Enable CSI Inline volumes support for pods.
- `CSIMigration`: Enables shims and translation logic to route volume
  operations from in-tree plugins to corresponding pre-installed CSI plugins
-->
- `CRIContainerLogRotation`：為 CRI 容器執行時啟用容器日誌輪換。日誌檔案的預設最大大小為
  10MB，預設情況下，一個容器允許的最大日誌檔案數為5。這些值可以在kubelet配置中配置。
    更多細節請參見 [日誌架構](/zh-cn/docs/concepts/cluster-administration/logging/#logging-at-the-node-level)。
- `CSIBlockVolume`：啟用外部 CSI 卷驅動程式用於支援塊儲存。有關更多詳細資訊，請參見
  [`csi` 原始塊卷支援](/zh-cn/docs/concepts/storage/volumes/#csi-raw-block-volume-support)。
- `CSIDriverRegistry`：在 csi.storage.k8s.io 中啟用與 CSIDriver API 物件有關的所有邏輯。
- `CSIInlineVolume`：為 Pod 啟用 CSI 內聯卷支援。
- `CSIMigration`：確保封裝和轉換邏輯能夠將卷操作從內嵌外掛路由到相應的預安裝 CSI 外掛。
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
- `CSIMigrationAWS`：確保填充和轉換邏輯能夠將卷操作從 AWS-EBS 內嵌外掛路由到 EBS CSI 外掛。
  如果節點禁用了此特性門控或者未安裝和配置 EBS CSI 外掛，支援回退到內嵌 EBS 外掛
  來執行卷掛載操作。不支援回退到這些外掛來執行卷製備操作，因為需要安裝並配置 CSI 外掛。
- `CSIMigrationAWSComplete`：停止在 kubelet 和卷控制器中註冊 EBS 內嵌外掛，
  並啟用填充和轉換邏輯將卷操作從 AWS-EBS 內嵌外掛路由到 EBS CSI 外掛。
  這需要啟用 CSIMigration 和 CSIMigrationAWS 特性標誌，並在叢集中的所有節點上安裝和配置
  EBS CSI 外掛。該特性標誌已被廢棄，取而代之的是 `InTreePluginAWSUnregister` ，
  後者會阻止註冊 EBS 內嵌外掛。
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
  `InTreePluginAzureFileUnregister` feature flag which prevents the registration
   of in-tree AzureFile plugin.
-->
- `CSIMigrationAzureDisk`：確保填充和轉換邏輯能夠將卷操作從 AzureDisk 內嵌外掛路由到
  Azure 磁碟 CSI 外掛。對於禁用了此特性的節點或者沒有安裝並配置 AzureDisk CSI
  外掛的節點，支援回退到內嵌（in-tree）AzureDisk 外掛來執行磁碟掛載操作。
  不支援回退到內嵌外掛來執行磁碟製備操作，因為對應的 CSI 外掛必須已安裝且正確配置。
  此特性需要啟用 CSIMigration 特性標誌。
- `CSIMigrationAzureDiskComplete`：停止在 kubelet 和卷控制器中註冊 Azure 磁碟內嵌外掛，
  並啟用 shims 和轉換邏輯以將卷操作從 Azure 磁碟內嵌外掛路由到 AzureDisk CSI 外掛。
  這需要啟用 CSIMigration 和 CSIMigrationAzureDisk 特性標誌，
  並在叢集中的所有節點上安裝和配置 AzureDisk CSI 外掛。該特性標誌已被廢棄，取而代之的是
  能防止註冊內嵌 AzureDisk 外掛的 `InTreePluginAzureDiskUnregister` 特性標誌。
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
  `InTreePluginAzureFileUnregister` feature flag which prevents the registration of in-tree AzureFile plugin.
-->
- `CSIMigrationAzureFile`：確保封裝和轉換邏輯能夠將卷操作從 AzureFile 內嵌外掛路由到
  AzureFile CSI 外掛。對於禁用了此特性的節點或者沒有安裝並配置 AzureFile CSI
  外掛的節點，支援回退到內嵌（in-tree）AzureFile 外掛來執行卷掛載操作。
  不支援回退到內嵌外掛來執行卷製備操作，因為對應的 CSI 外掛必須已安裝且正確配置。
  此特性需要啟用 CSIMigration 特性標誌。
- `CSIMigrationAzureFileComplete`：停止在 kubelet 和卷控制器中註冊 Azure-File 內嵌外掛，
  並啟用 shims 和轉換邏輯以將卷操作從 Azure-File 內嵌外掛路由到 AzureFile CSI 外掛。
  這需要啟用 CSIMigration 和 CSIMigrationAzureFile 特性標誌，
  並在叢集中的所有節點上安裝和配置 AzureFile CSI 外掛。該特性標誌已被廢棄，取而代之的是
  能防止註冊內嵌 AzureDisk 外掛的 `InTreePluginAzureFileUnregister` 特性標誌。
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
  been deprecated in favor of the `InTreePluginGCEUnregister` feature flag which prevents the registration of in-tree GCE PD plugin.
-->
- `CSIMigrationGCE`：啟用填充和轉換邏輯，將卷操作從 GCE-PD 內嵌外掛路由到
  PD CSI 外掛。對於禁用了此特性的節點或者沒有安裝並配置 PD CSI 外掛的節點，
  支援回退到內嵌（in-tree）GCE 外掛來執行掛載操作。
  不支援回退到內嵌外掛來執行製備操作，因為對應的 CSI 外掛必須已安裝且正確配置。
  此特性需要啟用 CSIMigration 特性標誌。
- `CSIMigrationGCEComplete`：停止在 kubelet 和卷控制器中註冊 GCE-PD 內嵌外掛，
  並啟用 shims 和轉換邏輯以將卷操作從 GCE-PD 內嵌外掛路由到 PD CSI 外掛。
  這需要啟用 CSIMigration 和 CSIMigrationGCE 特性標誌，並在叢集中的所有節點上
  安裝和配置 PD CSI 外掛。該特性標誌已被廢棄，取而代之的是
  能防止註冊內嵌 GCE PD 外掛的 `InTreePluginGCEUnregister` 特性標誌。
<!--
- `csiMigrationRBD`: Enables shims and translation logic to route volume
  operations from the RBD in-tree plugin to Ceph RBD CSI plugin. Requires
  CSIMigration and csiMigrationRBD feature flags enabled and Ceph CSI plugin
  installed and configured in the cluster. This flag has been deprecated in
  favor of the
  `InTreePluginRBDUnregister` feature flag which prevents the registration of
  in-tree RBD plugin.
-->
- `csiMigrationRBD`：啟用填充和轉換邏輯，將卷操作從 RBD 的內嵌外掛路由到 Ceph RBD
  CSI 外掛。此特性要求 CSIMigration 和 csiMigrationRBD 特性標誌均被啟用，
  且叢集中安裝並配置了 Ceph CSI 外掛。此標誌已被棄用，以鼓勵使用
  `InTreePluginRBDUnregister` 特性標誌。後者會禁止註冊內嵌的 RBD 外掛。
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
  been deprecated in favor of the `InTreePluginOpenStackUnregister` feature flag which prevents the registration of in-tree openstack cinder plugin.
-->
- `CSIMigrationOpenStack`：確保填充和轉換邏輯能夠將卷操作從 Cinder 內嵌外掛路由到
  Cinder CSI 外掛。對於禁用了此特性的節點或者沒有安裝並配置 Cinder CSI 外掛的節點，
  支援回退到內嵌（in-tree）Cinder 外掛來執行掛載操作。
  不支援回退到內嵌外掛來執行製備操作，因為對應的 CSI 外掛必須已安裝且正確配置。
  此磁特性需要啟用 CSIMigration 特性標誌。
- `CSIMigrationOpenStackComplete`：停止在 kubelet 和卷控制器中註冊 Cinder 內嵌外掛，
  並啟用填充和轉換邏輯將卷操作從 Cinder 內嵌外掛路由到 Cinder CSI 外掛。
  這需要啟用 CSIMigration 和 CSIMigrationOpenStack 特性標誌，並在叢集中的所有節點上
  安裝和配置 Cinder CSI 外掛。該特性標誌已被棄用，取而代之的是
  能防止註冊內嵌 OpenStack Cinder 外掛的 `InTreePluginOpenStackUnregister` 特性標誌。
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
  of the `InTreePluginvSphereUnregister` feature flag which prevents the registration of in-tree vsphere plugin.
-->
- `CSIMigrationvSphere`: 允許封裝和轉換邏輯將卷操作從 vSphere 內嵌外掛路由到
  vSphere CSI 外掛。如果節點禁用了此特性門控或者未安裝和配置 vSphere CSI 外掛，
  則支援回退到 vSphere 內嵌外掛來執行掛載操作。
  不支援回退到內嵌外掛來執行製備操作，因為對應的 CSI 外掛必須已安裝且正確配置。
  這需要啟用 CSIMigration 特性標誌。
- `CSIMigrationvSphereComplete`: 停止在 kubelet 和卷控制器中註冊 vSphere 內嵌外掛，
  並啟用填充和轉換邏輯以將卷操作從 vSphere 內嵌外掛路由到 vSphere CSI 外掛。
  這需要啟用 CSIMigration 和 CSIMigrationvSphere 特性標誌，並在叢集中的所有節點上
  安裝和配置 vSphere CSI 外掛。該特性標誌已被廢棄，取而代之的是
  能防止註冊內嵌 vsphere 外掛的 `InTreePluginvSphereUnregister` 特性標誌。
<!--
- `CSIMigrationPortworx`: Enables shims and translation logic to route volume operations
  from the Portworx in-tree plugin to Portworx CSI plugin.
  Requires Portworx CSI driver to be installed and configured in the cluster, and feature gate set `CSIMigrationPortworx=true` in kube-controller-manager and kubelet configs.
-->
- `CSIMigrationPortworx`：啟用填充和轉換邏輯，將卷操作從 Portworx 內嵌外掛路由到
  Portworx CSI 外掛。需要在叢集中安裝並配置 Portworx CSI 外掛，並針對 kube-controller-manager
  和 kubelet 配置啟用特性門控 `CSIMigrationPortworx=true`。
<!--
- `CSINodeInfo`: Enable all logic related to the CSINodeInfo API object in csi.storage.k8s.io.
- `CSIPersistentVolume`: Enable discovering and mounting volumes provisioned through a
  [CSI (Container Storage Interface)](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md)
  compatible volume plugin.
- `CSIServiceAccountToken`: Enable CSI drivers to receive the pods' service account token
  that they mount volumes for. See
  [Token Requests](https://kubernetes-csi.github.io/docs/token-requests.html).
- `CSIStorageCapacity`: Enables CSI drivers to publish storage capacity information
  and the Kubernetes scheduler to use that information when scheduling pods. See
  [Storage Capacity](/docs/concepts/storage/storage-capacity/).
  Check the [`csi` volume type](/docs/concepts/storage/volumes/#csi) documentation for more details.
-->
- `CSINodeInfo`：在 csi.storage.k8s.io 中啟用與 CSINodeInfo API 物件有關的所有邏輯。
- `CSIPersistentVolume`：啟用發現和掛載透過
  [CSI（容器儲存介面）](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md)
  相容卷外掛配置的卷。
- `CSIServiceAccountToken`: 允許 CSI 驅動接收掛載卷目標 Pods 的服務賬戶令牌。
  參閱[令牌請求（Token Requests）](https://kubernetes-csi.github.io/docs/token-requests.html)。
- `CSIStorageCapacity`: 使 CSI 驅動程式可以釋出儲存容量資訊，並使 Kubernetes
  排程程式在排程 Pod 時使用該資訊。參見
  [儲存容量](/zh-cn/docs/concepts/storage/storage-capacity/)。
  詳情請參見 [`csi` 卷型別](/zh-cn/docs/concepts/storage/volumes/#csi)。
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
- `CSIVolumeFSGroupPolicy`：允許 CSIDrivers 使用 `fsGroupPolicy` 欄位. 
  該欄位能控制由 CSIDriver 建立的卷在掛載這些卷時是否支援卷所有權和許可權修改。
- `CSIVolumeHealth`：啟用對節點上的 CSI volume 執行狀況監控的支援
- `CSRDuration`：允許客戶端來透過請求 Kubernetes CSR API 簽署的證書的持續時間。
- `ConfigurableFSGroupPolicy`：在 Pod 中掛載卷時，允許使用者為 fsGroup
  配置卷訪問許可權和屬主變更策略。請參見
  [為 Pod 配置卷訪問許可權和屬主變更策略](/zh-cn/docs/tasks/configure-pod-container/security-context/#configure-volume-permission-and-ownership-change-policy-for-pods)。
- `ContextualLogging`：當你啟用這個特性門控，支援日誌上下文記錄的 Kubernetes
  元件會為日誌輸出新增額外的詳細內容。
- `ControllerManagerLeaderMigration`：為 `kube-controller-manager` 和 `cloud-controller-manager`
  開啟領導者遷移功能。
- `CronJobControllerV2`：使用 {{< glossary_tooltip text="CronJob" term_id="cronjob" >}}
  控制器的一種替代實現。否則，系統會選擇同一控制器的 v1 版本。
- `CronJobTimeZone`：允許在 [CronJobs](/zh-cn/docs/concepts/workloads/controllers/cron-jobs/) 中使用 `timeZone` 可選欄位。
<!--
- `CustomCPUCFSQuotaPeriod`: Enable nodes to change `cpuCFSQuotaPeriod` in
  [kubelet config](/docs/tasks/administer-cluster/kubelet-config-file/).
- `CustomResourceValidationExpressions`: Enable expression language validation in CRD which will validate customer resource based on validation rules written in `x-kubernetes-validations` extension.
- `CustomPodDNS`: Enable customizing the DNS settings for a Pod using its `dnsConfig` property.
   Check [Pod's DNS Config](/docs/concepts/services-networking/dns-pod-service/#pods-dns-config)
   for more details.
-->
- `CustomCPUCFSQuotaPeriod`：使節點能夠更改
  [kubelet 配置](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)
  中的 `cpuCFSQuotaPeriod`。
- `CustomResourceValidationExpressions`：啟用 CRD 中的表示式語言合法性檢查，
  基於 `x-kubernetes-validations` 擴充套件中所書寫的合法性檢查規則來驗證定製資源。
- `CustomPodDNS`：允許使用 Pod 的 `dnsConfig` 屬性自定義其 DNS 設定。
  更多詳細資訊，請參見
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
- `CustomResourceDefaulting`：為 CRD 啟用在其 OpenAPI v3 驗證模式中提供預設值的支援。
- `CustomResourcePublishOpenAPI`：啟用 CRD OpenAPI 規範的釋出。
- `CustomResourceSubresources`：對於用
  [CustomResourceDefinition](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
  建立的資源啟用其 `/status` 和 `/scale` 子資源。
- `CustomResourceValidation`：對於用
  [CustomResourceDefinition](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
  建立的資源啟用基於模式的驗證。
- `CustomResourceWebhookConversion`：對於用
  [CustomResourceDefinition](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
  建立的資源啟用基於 Webhook 的轉換。
- `DaemonSetUpdateSurge`: 使 DaemonSet 工作負載在每個節點的更新期間保持可用性。
  參閱[對 DaemonSet 執行滾動更新](/zh-cn/docs/tasks/manage-daemon/update-daemon-set/)。
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
- `DefaultPodTopologySpread`: 啟用 `PodTopologySpread` 排程外掛來完成
  [預設的排程傳播](/zh-cn/docs/concepts/workloads/pods/pod-topology-spread-constraints/#internal-default-constraints).
- `DelegateFSGroupToCSIDriver`: 如果 CSI 驅動程式支援，則透過 NodeStageVolume 和
  NodePublishVolume CSI 呼叫傳遞 `fsGroup` ，將應用 `fsGroup` 從 Pod 的
  `securityContext` 的角色委託給驅動。
- `DevicePlugins`：在節點上啟用基於
  [裝置外掛](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
  的資源製備。
- `DisableAcceleratorUsageMetrics`： 
  [禁用 kubelet 收集加速器指標](/zh-cn/docs/concepts/cluster-administration/system-metrics/#disable-accelerator-metrics).
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
  `kubelet` 元件的 `--cloud-provider` 標誌相關的所有功能。
- `DisableKubeletCloudCredentialProviders`：禁用 kubelet 中為拉取映象內建的憑據機制，
  該憑據用於向某雲提供商的容器映象倉庫執行身份認證。
- `DownwardAPIHugePages`：允許在
  [下行（Downward）API](/zh-cn/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information)
  中使用巨頁資訊。
- `DryRun`：啟用在伺服器端對請求進行
  [試執行（Dry Run）](/zh-cn/docs/reference/using-api/api-concepts/#dry-run)，
  以便測試驗證、合併和修改，同時避擴音交更改。
- `DynamicAuditing`：在 v1.19 版本前用於啟用動態審計。
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
- `DynamicKubeletConfig`：啟用 kubelet 的動態配置。
  除偏差策略場景外，不再支援該功能。該特性門控在 kubelet 1.24 版本中已被移除。
  請參閱[重新配置 kubelet](/zh-cn/docs/tasks/administer-cluster/reconfigure-kubelet/)。
- `DynamicProvisioningScheduling`：擴充套件預設排程器以瞭解卷拓撲並處理 PV 配置。
  此特性已在 v1.12 中完全被 `VolumeScheduling` 特性取代。
- `DynamicVolumeProvisioning`：啟用持久化捲到 Pod
  的[動態預配置](/zh-cn/docs/concepts/storage/dynamic-provisioning/)。
- `EfficientWatchResumption`：允許從儲存發起的 bookmark（進度通知）事件被通知到使用者。
  此特性僅適用於 watch 操作。
- `EnableAggregatedDiscoveryTimeout`：對聚集的發現呼叫啟用五秒鐘超時設定。
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
- `EnableEquivalenceClassCache`：排程 Pod 時，使 scheduler 快取節點的等效項。
- `EndpointSlice`：啟用 EndpointSlice 以實現可擴縮性和可擴充套件性更好的網路端點。
   參閱[啟用 EndpointSlice](/zh-cn/docs/concepts/services-networking/endpoint-slices/)。
- `EndpointSliceNodeName`：允許使用 EndpointSlice 的 `nodeName` 欄位。
- `EndpointSliceProxying`：啟用此特性門控時，Linux 上執行的 kube-proxy 會使用
  EndpointSlices 而不是 Endpoints 作為其主要資料來源，從而使得可擴縮性和效能提升成為可能。
  參閱[啟用 EndpointSlice](/zh-cn/docs/concepts/services-networking/endpoint-slices/)。
- `EndpointSliceTerminatingCondition`：允許使用 EndpointSlice 的 `terminating` 和
  `serving` 狀況欄位。
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
- `EphemeralContainers`：啟用新增
  {{< glossary_tooltip text="臨時容器" term_id="ephemeral-container" >}}
  到正在執行的 Pod 的特性。
- `EvenPodsSpread`：使 Pod 能夠在拓撲域之間平衡排程。請參閱
  [Pod 拓撲擴充套件約束](/zh-cn/docs/concepts/workloads/pods/pod-topology-spread-constraints/)。
- `ExecProbeTimeout`：確保 kubelet 會遵從 exec 探針的超時值設定。
  此特性門控的主要目的是方便你處理現有的、依賴於已被修復的缺陷的工作負載；
  該缺陷導致 Kubernetes 會忽略 exec 探針的超時值設定。
  參閱[就緒態探針](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes).
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
- `ExpandCSIVolumes`: 啟用擴充套件 CSI 卷。
- `ExpandedDNSConfig`: 在 kubelet 和 kube-apiserver 上啟用後，
  允許使用更多的 DNS 搜尋域和搜尋域列表。此功能特性需要容器執行時
  （Containerd：v1.5.6 或更高，CRI-O：v1.22 或更高）的支援。參閱
  [擴充套件 DNS 配置](/zh-cn/docs/concepts/services-networking/dns-pod-service/#expanded-dns-configuration).
- `ExpandInUsePersistentVolumes`：啟用擴充使用中的 PVC 的尺寸。請查閱
  [調整使用中的 PersistentVolumeClaim 的大小](/zh-cn/docs/concepts/storage/persistent-volumes/#resizing-an-in-use-persistentvolumeclaim)。
- `ExpandPersistentVolumes`：允許擴充持久卷。請查閱
  [擴充套件持久卷申領](/zh-cn/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims)。
- `ExperimentalCriticalPodAnnotation`：啟用將特定 Pod 註解為 *critical* 的方式，用於
  [確保其被排程](/zh-cn/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/)。
  從 v1.13 開始已棄用此特性，轉而使用 Pod 優先順序和搶佔功能。
<!--
- `ExperimentalHostUserNamespaceDefaulting`: Enabling the defaulting user
   namespace to host. This is for containers that are using other host namespaces,
   host mounts, or containers that are privileged or using specific non-namespaced
   capabilities (e.g. `MKNODE`, `SYS_MODULE` etc.). This should only be enabled
   if user namespace remapping is enabled in the Docker daemon.
- `ExternalPolicyForExternalIP`: Fix a bug where ExternalTrafficPolicy is not applied to Service ExternalIPs.
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
- `ExperimentalHostUserNamespaceDefaulting`：啟用主機預設的使用者名稱字空間。
  這適用於使用其他主機名字空間、主機安裝的容器，或具有特權或使用特定的非名字空間功能
  （例如 MKNODE、SYS_MODULE 等）的容器。
  如果在 Docker 守護程式中啟用了使用者名稱字空間重新對映，則啟用此選項。
- `ExternalPolicyForExternalIP`： 修復 ExternalPolicyForExternalIP 沒有應用於
  Service ExternalIPs 的缺陷。
- `GCERegionalPersistentDisk`：在 GCE 上啟用帶地理區域資訊的 PD 特性。
- `GenericEphemeralVolume`：啟用支援臨時的內聯卷，這些卷支援普通卷
  （可以由第三方儲存供應商提供、儲存容量跟蹤、從快照還原等等）的所有功能。
  請參見[臨時卷](/zh-cn/docs/concepts/storage/ephemeral-volumes/)。
- `GracefulNodeShutdown`：在 kubelet 中啟用體面地關閉節點的支援。
  在系統關閉時，kubelet 會嘗試監測該事件並體面地終止節點上執行的 Pods。
  參閱[體面地關閉節點](/zh-cn/docs/concepts/architecture/nodes/#graceful-node-shutdown)
  以瞭解更多細節。
<!--
- `GracefulNodeShutdownBasedOnPodPriority`: Enables the kubelet to check Pod priorities
  when shutting down a node gracefully.
- `GRPCContainerProbe`: Enables the gRPC probe method for {Liveness,Readiness,Startup}Probe. See [Configure Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-grpc-liveness-probe).
- `HonorPVReclaimPolicy`: Honor persistent volume reclaim policy when it is `Delete` irrespective of PV-PVC deletion ordering.
For more details, check the
  [PersistentVolume deletion protection finalizer](/docs/concepts/storage/persistent-volumes/#persistentvolume-deletion-protection-finalizer)
  documentation.
-->
- `GracefulNodeShutdownBasedOnPodPriority`：允許 kubelet 在體面終止節點時檢查
  Pod 的優先順序。
- `GRPCContainerProbe`：為 LivenessProbe、ReadinessProbe、StartupProbe 啟用 gRPC 探針。
  參閱[配置活躍態、就緒態和啟動探針](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-grpc-liveness-probe)。
- `HonorPVReclaimPolicy`：無論 PV 和 PVC 的刪除順序如何，當持久卷申領的策略為 `Delete`
  時，確保這種策略得到處理。
  更多詳細資訊，請參閱 [PersistentVolume 刪除保護 finalizer](/zh-cn/docs/concepts/storage/persistent-volumes/#persistentvolume-deletion-protection-finalizer)文件。
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
- `HPAContainerMetrics`：允許 `HorizontalPodAutoscaler` 基於目標 Pods 中各容器
  的度量值來執行擴縮操作。
- `HPAScaleToZero`：使用自定義指標或外部指標時，可將 `HorizontalPodAutoscaler`
  資源的 `minReplicas` 設定為 0。
- `HugePages`：啟用分配和使用預分配的
  [巨頁資源](/zh-cn/docs/tasks/manage-hugepages/scheduling-hugepages/)。
- `HugePageStorageMediumSize`：啟用支援多種大小的預分配
  [巨頁資源](/zh-cn/docs/tasks/manage-hugepages/scheduling-hugepages/)。
- `HyperVContainer`：為 Windows 容器啟用
  [Hyper-V 隔離](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container)。
<!--
- `IdentifyPodOS`: Allows the Pod OS field to be specified. This helps in identifying the OS of the pod
  authoritatively during the API server admission time. In Kubernetes {{< skew currentVersion >}}, the allowed values for the `pod.spec.os.name` are `windows` and `linux`.
- `ImmutableEphemeralVolumes`: Allows for marking individual Secrets and ConfigMaps as
  immutable for better safety and performance.
- `InTreePluginAWSUnregister`: Stops registering the aws-ebs in-tree plugin in kubelet
  and volume controllers.
- `InTreePluginAzureDiskUnregister`: Stops registering the azuredisk in-tree plugin in kubelet
  and volume controllers.
- `InTreePluginAzureFileUnregister`: Stops registering the azurefile in-tree plugin in kubelet
  and volume controllers.
-->
- `IdentifyPodOS`：允許設定 Pod 的 OS 欄位。這一設定有助於在 API 伺服器准入期間確定性地辨識
  Pod 的 OS。在 Kubernetes {{< skew currentVersion >}} 中，`pod.spec.os.name` 可選的值包括
  `windows` 和 `linux`。
- `ImmutableEphemeralVolumes`：允許將各個 Secret 和 ConfigMap 標記為不可變更的，
  以提高安全性和效能。
- `InTreePluginAWSUnregister`: 在 kubelet 和卷控制器上關閉註冊 aws-ebs 內嵌外掛。
- `InTreePluginAzureDiskUnregister`: 在 kubelet 和卷控制器上關閉註冊 azuredisk 內嵌外掛。
- `InTreePluginAzureFileUnregister`: 在 kubelet 和卷控制器上關閉註冊 azurefile 內嵌外掛。
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
- `InTreePluginGCEUnregister`: 在 kubelet 和卷控制器上關閉註冊 gce-pd 內嵌外掛。
- `InTreePluginOpenStackUnregister`: 在 kubelet 和卷控制器上關閉註冊 OpenStack cinder 內嵌外掛。
- `InTreePluginPortworxUnregister`: 在 kubelet 和卷控制器上關閉註冊 Portworx 內嵌外掛。
- `InTreePluginRBDUnregister`: 在 kubelet 和卷控制器上關閉註冊 RBD 內嵌外掛。
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
- `InTreePluginvSphereUnregister`: 在 kubelet 和卷控制器上關閉註冊 vSphere 內嵌外掛。
- `IndexedJob`：允許 [Job](/zh-cn/docs/concepts/workloads/controllers/job/)
  控制器根據完成索引來管理 Pod 完成。
- `IngressClassNamespacedParams`：允許在 `IngressClass` 資源中引用名稱空間範圍的引數。
  該特性增加了兩個欄位 —— `scope`、`namespace` 到 `IngressClass.spec.parameters`。
- `Initializers`： 使用 Initializers 准入外掛允許非同步協調物件建立。
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
- `IPv6DualStack`：啟用[雙協議棧](/zh-cn/docs/concepts/services-networking/dual-stack/)
  以支援 IPv6。
- `JobMutableNodeSchedulingDirectives`：允許在 [Job](/docs/concepts/workloads/controllers/job)
  的 Pod 模板中更新節點排程指令。 
- `JobReadyPods`：允許跟蹤[狀況](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions)為
  `Ready` 的 Pod 的個數。`Ready` 的 Pod 記錄在
  [Job](/zh-cn/docs/concepts/workloads/controllers/job) 物件的
  [status](/docs/reference/kubernetes-api/workload-resources/job-v1/#JobStatus) 欄位中。
<!--
- `JobTrackingWithFinalizers`: Enables tracking [Job](/docs/concepts/workloads/controllers/job)
  completions without relying on Pods remaining in the cluster indefinitely.
  The Job controller uses Pod finalizers and a field in the Job status to keep
  track of the finished Pods to count towards completion.
- `KubeletConfigFile`: Enable loading kubelet configuration 
  from a file specified using a config file.
  See [setting kubelet parameters via a config file](/docs/tasks/administer-cluster/kubelet-config-file/)
  for more details.
-->
- `JobTrackingWithFinalizers`: 啟用跟蹤 [Job](/zh-cn/docs/concepts/workloads/controllers/job)
  完成情況，而不是永遠從叢集剩餘 Pod 來獲取資訊判斷完成情況。Job 控制器使用
  Pod finalizers 和 Job 狀態中的一個欄位來跟蹤已完成的 Pod 以計算完成。
- `KubeletConfigFile`：啟用從使用配置檔案指定的檔案中載入 kubelet 配置。
  有關更多詳細資訊，請參見
  [透過配置檔案設定 kubelet 引數](/zh-cn/docs/tasks/administer-cluster/kubelet-config-file/)。
<!--
- `KubeletCredentialProviders`: Enable kubelet exec credential providers for image pull credentials.
- `KubeletInUserNamespace`: Enables support for running kubelet in a {{<glossary_tooltip text="user namespace" term_id="userns">}}.
   See [Running Kubernetes Node Components as a Non-root User](/docs/tasks/administer-cluster/kubelet-in-userns/).
- `KubeletPluginsWatcher`: Enable probe-based plugin watcher utility to enable kubelet
  to discover plugins such as [CSI volume drivers](/docs/concepts/storage/volumes/#csi).
-->
- `KubeletCredentialProviders`：允許使用 kubelet exec 憑據提供程式來設定映象拉取憑據。
- `KubeletInUserNamespace`: 支援在{{<glossary_tooltip text="使用者名稱字空間" term_id="userns">}}
  裡執行 kubelet 。
  請參見[使用非 Root 使用者來執行 Kubernetes 節點元件](/zh-cn/docs/tasks/administer-cluster/kubelet-in-userns/)。
- `KubeletPluginsWatcher`：啟用基於探針的外掛監視應用程式，使 kubelet 能夠發現類似
  [CSI 卷驅動程式](/zh-cn/docs/concepts/storage/volumes/#csi)這類外掛。
<!--
- `KubeletPodResources`: Enable the kubelet's pod resources gRPC endpoint. See
  [Support Device Monitoring](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/606-compute-device-assignment/README.md)
  for more details.
- `KubeletPodResourcesGetAllocatable`: Enable the kubelet's pod resources `GetAllocatableResources` functionality.
  This API augments the [resource allocation reporting](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)
  with informations about the allocatable resources, enabling clients to properly track the free compute resources on a node.
- `LegacyNodeRoleBehavior`: When disabled, legacy behavior in service load balancers and
  node disruption will ignore the `node-role.kubernetes.io/master` label in favor of the
  feature-specific labels provided by `NodeDisruptionExclusion` and `ServiceNodeExclusion`.
- `LegacyServiceAccountTokenNoAutoGeneration`: Stop auto-generation of Secret-based
  [service account tokens](/docs/reference/access-authn-authz/authentication/#service-account-tokens).
-->
- `KubeletPodResources`：啟用 kubelet 上 Pod 資源 GRPC 端點。更多詳細資訊，
  請參見[支援裝置監控](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/compute-device-assignment.md)。
- `KubeletPodResourcesGetAllocatable`：啟用 kubelet 的 pod 資源的
  `GetAllocatableResources` 功能。
  該 API 增強了[資源分配報告](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)
  包含有關可分配資源的資訊，使客戶端能夠正確跟蹤節點上的可用計算資源。
- `LegacyNodeRoleBehavior`：禁用此門控時，服務負載均衡器中和節點干擾中的原先行為會忽略
  `node-role.kubernetes.io/master` 標籤，使用 `NodeDisruptionExclusion` 和
  `ServiceNodeExclusion` 對應特性所提供的標籤。
- `LegacyServiceAccountTokenNoAutoGeneration`：停止基於 Secret 的自動生成
  [服務賬號令牌](/zh-cn/docs/reference/access-authn-authz/authentication/#service-account-tokens).
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
- `LocalStorageCapacityIsolation`：允許使用
  [本地臨時儲存](/zh-cn/docs/concepts/configuration/manage-resources-containers/)
  以及 [emptyDir 卷](/zh-cn/docs/concepts/storage/volumes/#emptydir)的 `sizeLimit` 屬性。
- `LocalStorageCapacityIsolationFSQuotaMonitoring`：如果
  [本地臨時儲存](/zh-cn/docs/concepts/configuration/manage-resources-containers/)啟用了
  `LocalStorageCapacityIsolation`，並且
  [emptyDir 卷](/zh-cn/docs/concepts/storage/volumes/#emptydir)的後備檔案系統支援專案配額，
  並且啟用了這些配額，將使用專案配額來監視
  [emptyDir 卷](/zh-cn/docs/concepts/storage/volumes/#emptydir)的儲存消耗而不是遍歷檔案系統，
  以此獲得更好的效能和準確性。
<!--
- `LogarithmicScaleDown`: Enable semi-random selection of pods to evict on controller scaledown
  based on logarithmic bucketing of pod timestamps.
- `MaxUnavailableStatefulSet`: Enables setting the `maxUnavailable` field for the
  [rolling update strategy](/docs/concepts/workloads/controllers/statefulset/#rolling-updates)
  of a StatefulSet. The field specifies the maximum number of Pods
  that can be unavailable during the update.
- `MemoryManager`: Allows setting memory affinity for a container based on
  NUMA topology.
- `MemoryQoS`: Enable memory protection and usage throttle on pod / container using cgroup v2 memory controller.
- `MinDomainsInPodTopologySpread`: Enable `minDomains` in Pod
  [topology spread constraints](/docs/concepts/workloads/pods/pod-topology-spread-constraints/).
- `MixedProtocolLBService`: Enable using different protocols in the same `LoadBalancer` type
  Service instance.
- `MountContainers`: Enable using utility containers on host as
  the volume mounter.
-->
- `LogarithmicScaleDown`：啟用 Pod 的半隨機（semi-random）選擇，控制器將根據 Pod
  時間戳的對數桶按比例縮小去驅逐 Pod。
- `MaxUnavailableStatefulSet`：啟用為 StatefulSet
  的[滾動更新策略](/zh-cn/docs/concepts/workloads/controllers/statefulset/#rolling-updates)設定
  `maxUnavailable` 欄位。該欄位指定更新過程中不可用 Pod 個數的上限。
- `MemoryManager`：允許基於 NUMA 拓撲為容器設定記憶體親和性。
- `MemoryQoS`：使用 cgroup v2 記憶體控制器在 pod / 容器上啟用記憶體保護和使用限制。
- `MinDomainsInPodTopologySpread`：啟用 Pod 的 `minDomains`
  [拓撲分佈約束](/zh-cn/docs/concepts/workloads/pods/pod-topology-spread-constraints/).
- `MixedProtocolLBService`：允許在同一 `LoadBalancer` 型別的 Service 例項中使用不同的協議。
- `MountContainers`：允許使用主機上的工具容器作為卷掛載程式。
<!--
- `MountPropagation`: Enable sharing volume mounted by one container to other containers or pods.
  For more details, please see [mount propagation](/docs/concepts/storage/volumes/#mount-propagation).
- `NamespaceDefaultLabelName`: Configure the API Server to set an immutable {{< glossary_tooltip text="label" term_id="label" >}}
  `kubernetes.io/metadata.name` on all namespaces, containing the namespace name.
- `NetworkPolicyEndPort`: Enable use of the field `endPort` in NetworkPolicy objects,
  allowing the selection of a port range instead of a single port.
- `NetworkPolicyStatus`: Enable the `status` subresource for NetworkPolicy objects.
- `NodeDisruptionExclusion`: Enable use of the node label `node.kubernetes.io/exclude-disruption`
  which prevents nodes from being evacuated during zone failures.
- `NodeLease`: Enable the new Lease API to report node heartbeats, which could be used as a node health signal.
-->
- `MountPropagation`：啟用將一個容器安裝的共享卷共享到其他容器或 Pod。
  更多詳細資訊，請參見[掛載傳播](/zh-cn/docs/concepts/storage/volumes/#mount-propagation)。
- `NamespaceDefaultLabelName`：配置 API 伺服器以在所有名字空間上設定一個不可變的
  {{< glossary_tooltip text="標籤" term_id="label" >}} `kubernetes.io/metadata.name`，
  也包括名字空間。
- `NetworkPolicyEndPort`：在 NetworkPolicy 物件中啟用 `endPort` 以允許選擇埠範圍而不是單個埠。
- `NetworkPolicyStatus`：為 NetworkPolicy 物件啟用 `status` 子資源。
- `NodeDisruptionExclusion`：啟用節點標籤 `node.kubernetes.io/exclude-disruption`，
  以防止在可用區發生故障期間驅逐節點。
- `NodeLease`：啟用新的 Lease（租期）API 以報告節點心跳，可用作節點執行狀況訊號。
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
- `PVCProtection`: Enable the prevention of a PersistentVolumeClaim (PVC) from
  being deleted when it is still used by any Pod.
-->
- `NodeOutOfServiceVolumeDetach`：當使用 `node.kubernetes.io/out-of-service`
  汙點將節點標記為停止服務時，節點上不能容忍這個汙點的 Pod 將被強制刪除，
  並且該在節點上被終止的 Pod 將立即進行卷分離操作。
- `NodeSwap`: 啟用 kubelet 為節點上的 Kubernetes 工作負載分配交換記憶體的能力。
  必須將 `KubeletConfiguration.failSwapOn` 設定為 false 的情況下才能使用。
  更多詳細資訊，請參見[交換記憶體](/zh-cn/docs/concepts/architecture/nodes/#swap-memory)。
- `NonPreemptingPriority`：為 PriorityClass 和 Pod 啟用 `preemptionPolicy` 選項。
- `OpenAPIEnums`：允許在從 API 伺服器返回的 spec 中填充 OpenAPI 模式的 "enum" 欄位。
- `OpenAPIV3`：允許 API 伺服器釋出 OpenAPI V3。
- `PVCProtection`：啟用防止仍被某 Pod 使用的 PVC 被刪除的特性。
<!--
- `PodDeletionCost`: Enable the [Pod Deletion Cost](/docs/content/en/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost)
   feature which allows users to influence ReplicaSet downscaling order.
- `PersistentLocalVolumes`: Enable the usage of `local` volume type in Pods.
  Pod affinity has to be specified if requesting a `local` volume.
- `PodDisruptionBudget`: Enable the [PodDisruptionBudget](/docs/tasks/run-application/configure-pdb/) feature.
- `PodAffinityNamespaceSelector`: Enable the [Pod Affinity Namespace Selector](/docs/concepts/scheduling-eviction/assign-pod-node/#namespace-selector)
  and [CrossNamespacePodAffinity](/docs/concepts/policy/resource-quotas/#cross-namespace-pod-affinity-quota) quota scope features.
- `PodOverhead`: Enable the [PodOverhead](/docs/concepts/scheduling-eviction/pod-overhead/)
  feature to account for pod overheads.
-->
- `PodDeletionCost`：啟用 [Pod 刪除成本](/zh-cn/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost)功能。
  該功能使使用者可以影響 ReplicaSet 的降序順序。
- `PersistentLocalVolumes`：允許在 Pod 中使用 `local（本地）` 卷型別。
  如果請求 `local` 卷，則必須指定 Pod 親和性屬性。
- `PodDisruptionBudget`：啟用 [PodDisruptionBudget](/zh-cn/docs/tasks/run-application/configure-pdb/) 特性。
- `PodAffinityNamespaceSelector`：啟用 [Pod 親和性名稱空間選擇器](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/#namespace-selector)
  和 [CrossNamespacePodAffinity](/zh-cn/docs/concepts/policy/resource-quotas/#cross-namespace-pod-affinity-quota)
  資源配額功能。
- `PodOverhead`：啟用 [PodOverhead](/zh-cn/docs/concepts/scheduling-eviction/pod-overhead/)
  特性以考慮 Pod 開銷。
<!--
- `PodPriority`: Enable the descheduling and preemption of Pods based on their
  [priorities](/docs/concepts/scheduling-eviction/pod-priority-preemption/).
- `PodReadinessGates`: Enable the setting of `PodReadinessGate` field for extending
  Pod readiness evaluation.  See [Pod readiness gate](/docs/concepts/workloads/pods/pod-lifecycle/#pod-readiness-gate)
  for more details.
- `PodSecurity`: Enables the `PodSecurity` admission plugin.
- `PodShareProcessNamespace`: Enable the setting of `shareProcessNamespace` in a Pod for sharing
  a single process namespace between containers running in a pod.  More details can be found in
  [Share Process Namespace between Containers in a Pod](/docs/tasks/configure-pod-container/share-process-namespace/).
- `PreferNominatedNode`: This flag tells the scheduler whether the nominated
  nodes will be checked first before looping through all the other nodes in
  the cluster.
-->
- `PodPriority`：啟用根據[優先順序](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)
  的 Pod 排程和搶佔。
- `PodReadinessGates`：啟用 `podReadinessGate` 欄位的設定以擴充套件 Pod 準備狀態評估。
  有關更多詳細資訊，請參見
  [Pod 就緒狀態判別](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-readiness-gate)。
- `PodSecurity`: 開啟 `PodSecurity` 准入控制外掛。
- `PodShareProcessNamespace`：在 Pod 中啟用 `shareProcessNamespace` 的設定，
  以便在 Pod 中執行的容器之間共享同一程序名字空間。更多詳細資訊，請參見
  [在 Pod 中的容器間共享同一程序名字空間](/zh-cn/docs/tasks/configure-pod-container/share-process-namespace/)。
- `PreferNominatedNode`: 這個標誌告訴排程器在迴圈遍歷叢集中的所有其他節點之前，
  是否首先檢查指定的節點。
<!--
- `ProbeTerminationGracePeriod`: Enable [setting probe-level
  `terminationGracePeriodSeconds`](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#probe-level-terminationgraceperiodseconds)
   on pods.  See the [enhancement proposal](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2238-liveness-probe-grace-period) for more details.
- `ProcMountType`: Enables control over the type proc mounts for containers
  by setting the `procMount` field of a SecurityContext.
- `ProxyTerminatingEndpoints`: Enable the kube-proxy to handle terminating
  endpoints when `ExternalTrafficPolicy=Local`.
- `QOSReserved`: Allows resource reservations at the QoS level preventing pods
  at lower QoS levels from bursting into resources requested at higher QoS levels
  (memory only for now).
- `ReadWriteOncePod`: Enables the usage of `ReadWriteOncePod` PersistentVolume
  access mode.
-->
- `ProbeTerminationGracePeriod`：在 Pod 上 啟用 
  [設定探測器級別 `terminationGracePeriodSeconds`](/zh-cn/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#probe-level-terminationgraceperiodseconds)。
  有關更多資訊，請參見[改進提案](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2238-liveness-probe-grace-period)。
- `ProcMountType`：允許容器透過設定 SecurityContext 的 `procMount` 欄位來控制對
  proc 檔案系統的掛載方式。
- `ProxyTerminatingEndpoints`: 當 `ExternalTrafficPolicy=Local` 時，
  允許 kube-proxy 來處理終止過程中的端點。
- `QOSReserved`：允許在 QoS 級別進行資源預留，以防止處於較低 QoS 級別的 Pod
  突發進入處於較高 QoS 級別的請求資源（目前僅適用於記憶體）。
- `ReadWriteOncePod`: 允許使用 `ReadWriteOncePod` 訪問模式的 PersistentVolume。
<!--
- `RecoverVolumeExpansionFailure`: Enables users to edit their PVCs to smaller sizes so as they can recover from previously issued
  volume expansion failures. See
  [Recovering from Failure when Expanding Volumes](/docs/concepts/storage/persistent-volumes/#recovering-from-failure-when-expanding-volumes)
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
- `RecoverVolumeExpansionFailure`：允許使用者編輯其 PVC 來縮小其尺寸，
  從而從之前卷擴容發生的失敗中恢復。更多細節可參見
  [從卷擴容失效中恢復](/zh-cn/docs/concepts/storage/persistent-volumes/#recovering-from-failure-when-expanding-volumes)。
- `RemainingItemCount`：允許 API 伺服器在
  [分塊列表請求](/zh-cn/docs/reference/using-api/api-concepts/#retrieving-large-results-sets-in-chunks)
  的響應中顯示剩餘條目的個數。
- `RemoveSelfLink`：將所有物件和集合的 `.metadata.selfLink` 欄位設定為空（空字串）。
  該欄位自 Kubernetes v1.16 版本以來已被棄用。
  啟用此功能後，`.metadata.selfLink` 欄位仍然是 Kubernetes API 的一部分，但始終未設定。
- `RequestManagement`：允許在每個 API 伺服器上透過優先順序和公平性管理請求併發性。
  自 1.17 以來已被 `APIPriorityAndFairness` 替代。
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
- `ResourceLimitsPriorityFunction`：啟用某排程器優先順序函式，
  該函式將最低得分 1 指派給至少滿足輸入 Pod 的 CPU 和記憶體限制之一的節點，
  目的是打破得分相同的節點之間的關聯。
- `ResourceQuotaScopeSelectors`：啟用資源配額範圍選擇器。
- `RootCAConfigMap`：配置 `kube-controller-manager`，使之釋出一個名為 `kube-root-ca.crt`
  的 {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}，
  到所有名字空間中。該 ConfigMap 包含用來驗證與 kube-apiserver 之間連線的 CA 證書包。
  參閱[繫結服務賬戶令牌](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md)
  以瞭解更多細節。
<!--
- `RotateKubeletClientCertificate`: Enable the rotation of the client TLS certificate on the kubelet.
  See [kubelet configuration](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#kubelet-configuration) for more details.
- `RotateKubeletServerCertificate`: Enable the rotation of the server TLS certificate on the kubelet.
  See [kubelet configuration](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#kubelet-configuration)
  for more details.
- `RunAsGroup`: Enable control over the primary group ID set on the init
  processes of containers.
-->
- `RotateKubeletClientCertificate`：在 kubelet 上啟用客戶端 TLS 證書的輪換。
  更多詳細資訊，請參見
  [kubelet 配置](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#kubelet-configuration)。
- `RotateKubeletServerCertificate`：在 kubelet 上啟用伺服器 TLS 證書的輪換。
  更多詳細資訊，請參見
  [kubelet 配置](/zh-cn/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#kubelet-configuration)。
- `RunAsGroup`：啟用對容器初始化過程中設定的主要組 ID 的控制。
<!--
- `RuntimeClass`: Enable the [RuntimeClass](/docs/concepts/containers/runtime-class/) feature
  for selecting container runtime configurations.
- `ScheduleDaemonSetPods`: Enable DaemonSet Pods to be scheduled by the default scheduler
  instead of the DaemonSet controller.
- `SCTPSupport`: Enables the _SCTP_ `protocol` value in Pod, Service,
  Endpoints, EndpointSlice, and NetworkPolicy definitions.
- `SeccompDefault`: Enables the use of `RuntimeDefault` as the default seccomp profile for all workloads.
  The seccomp profile is specified in the `securityContext` of a Pod and/or a Container.
- `SelectorIndex`: Allows label and field based indexes in API server watch
  cache to accelerate list operations.
-->
- `RuntimeClass`：啟用 [RuntimeClass](/zh-cn/docs/concepts/containers/runtime-class/)
  特性用於選擇容器執行時配置。
- `ScheduleDaemonSetPods`：啟用 DaemonSet Pods 由預設排程程式而不是
  DaemonSet 控制器進行排程。
- `SCTPSupport`：在 Pod、Service、Endpoints、NetworkPolicy 定義中允許將 'SCTP'
  用作 `protocol` 值。
- `SeccompDefault`: 允許將所有工作負載的預設  seccomp 配置檔案為 `RuntimeDefault`。
  seccomp 配置在 Pod 或者容器的 `securityContext` 欄位中指定。
- `SelectorIndex`: 允許使用 API 伺服器的 watch 快取中基於標籤和欄位的索引來加速 list 操作。
<!--
- `ServerSideApply`: Enables the [Sever Side Apply (SSA)](/docs/reference/using-api/server-side-apply/)
  feature on the API Server.
- `ServiceAccountIssuerDiscovery`: Enable OIDC discovery endpoints (issuer and
  JWKS URLs) for the service account issuer in the API server. See
  [Configure Service Accounts for Pods](/docs/tasks/configure-pod-container/configure-service-account/#service-account-issuer-discovery)
  for more details.
- `ServiceAppProtocol`: Enables the `appProtocol` field on Services and Endpoints.
- `ServiceInternalTrafficPolicy`: Enables the `internalTrafficPolicy` field on Services
- `ServiceLBNodePortControl`: Enables the `allocateLoadBalancerNodePorts` field on Services.
-->
- `ServerSideApply`：在 API 伺服器上啟用
  [伺服器端應用（SSA）](/zh-cn/docs/reference/using-api/server-side-apply/) 。
- `ServiceAccountIssuerDiscovery`：在 API 伺服器中為服務帳戶頒發者啟用 OIDC 發現端點
  （頒發者和 JWKS URL）。詳情參見
  [為 Pod 配置服務賬戶](/zh-cn/docs/tasks/configure-pod-container/configure-service-account/#service-account-issuer-discovery) 。
- `ServiceAppProtocol`：為 Service 和 Endpoints 啟用 `appProtocol` 欄位。
- `ServiceInternalTrafficPolicy`：為服務啟用 `internalTrafficPolicy` 欄位。
- `ServiceLBNodePortControl`：為服務啟用 `allocateLoadBalancerNodePorts` 欄位。
<!--
- `ServiceLoadBalancerClass`: Enables the `loadBalancerClass` field on Services. See
  [Specifying class of load balancer implementation](/docs/concepts/services-networking/service/#load-balancer-class) for more details.
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
- `ServiceLoadBalancerClass`: 為服務啟用 `loadBalancerClass` 欄位。 
  有關更多資訊，請參見[指定負載均衡器實現類](/zh-cn/docs/concepts/services-networking/service/#load-balancer-class)。
- `ServiceLoadBalancerFinalizer`：為服務負載均衡啟用終結器（finalizers）保護。
- `ServiceNodeExclusion`：啟用從雲提供商建立的負載均衡中排除節點。
  如果節點標記有 `node.kubernetes.io/exclude-from-external-load-balancers`，
  標籤，則可以排除該節點。
- `ServiceTopology`：啟用服務拓撲可以讓一個服務基於叢集的節點拓撲進行流量路由。
  有關更多詳細資訊，請參見[服務拓撲](/zh-cn/docs/concepts/services-networking/service-topology/)。
- `ServiceIPStaticSubrange`：啟用服務 ClusterIP 分配策略，從而細分 ClusterIP 範圍。
  動態分配的 ClusterIP 地址將優先從較高範圍分配，以低衝突風險允許使用者從較低範圍分配靜態 ClusterIP。
  更多詳細資訊請參閱[避免衝突](/zh-cn/docs/concepts/services-networking/service/#avoiding-collisions)
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
- `SetHostnameAsFQDN`：啟用將全限定域名（FQDN）設定為 Pod 主機名的功能。
  請參見[為 Pod 設定 `setHostnameAsFQDN` 欄位](/zh-cn/docs/concepts/services-networking/dns-pod-service/#pod-sethostnameasfqdn-field)。
- `SizeMemoryBackedVolumes`：允許 kubelet 檢查基於記憶體製備的卷的尺寸約束
  （目前主要針對 `emptyDir` 卷）。
- `StartupProbe`：在 kubelet 中啟用
  [啟動探針](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#when-should-you-use-a-startup-probe)。
- `StatefulSetMinReadySeconds`: 允許 StatefulSet 控制器採納 `minReadySeconds` 設定。
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
  PersistentVolumeClaim 物件，則將其刪除操作推遲。
- `StorageVersionAPI`: 啟用
  [儲存版本 API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#storageversion-v1alpha1-internal-apiserver-k8s-io)。
- `StorageVersionHash`：允許 API 伺服器在版本發現中公開儲存版本的雜湊值。
- `StreamingProxyRedirects`：指示 API 伺服器攔截（並跟蹤）後端（kubelet）
  的重定向以處理流請求。
  流請求的例子包括 `exec`、`attach` 和 `port-forward` 請求。
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
- `SupportIPVSProxyMode`：啟用使用 IPVS 提供叢集內服務負載平衡。更多詳細資訊，請參見
  [服務代理](/zh-cn/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)。
- `SupportNodePidsLimit`：啟用支援，限制節點上的 PID 用量。
  `--system-reserved` 和 `--kube-reserved` 中的引數 `pid=<數值>` 可以分別用來
  設定為整個系統所預留的程序 ID 個數和為 Kubernetes 系統守護程序預留的程序 ID 個數。
- `SupportPodPidsLimit`：啟用支援限制 Pod 中的程序 PID。
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
- `SuspendJob`： 啟用支援以暫停和恢復作業。 更多詳細資訊，請參見
  [Jobs 文件](/zh-cn/docs/concepts/workloads/controllers/job/)。
- `Sysctls`：允許為每個 Pod 設定的名字空間核心引數（sysctls）。
  更多詳細資訊，請參見 [sysctls](/zh-cn/docs/tasks/administer-cluster/sysctl-cluster/)。
- `TTLAfterFinished`：資源完成執行後，允許
  [TTL 控制器](/zh-cn/docs/concepts/workloads/controllers/ttlafterfinished/)清理資源。
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
- `TaintBasedEvictions`：根據節點上的汙點和 Pod 上的容忍度啟用從節點驅逐 Pod 的特性。
  更多詳細資訊可參見[汙點和容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)。
- `TaintNodesByCondition`：根據[節點狀況](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)
  啟用自動為節點標記汙點。
- `TokenRequest`：在服務帳戶資源上啟用 `TokenRequest` 端點。
- `TokenRequestProjection`：啟用透過
  [`projected` 卷](/zh-cn/docs/concepts/storage/volumes/#projected)
  將服務帳戶令牌注入到 Pod 中的特性。
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
- `TopologyAwareHints`： 在 EndpointSlices 中啟用基於拓撲提示的拓撲感知路由。
  更多詳細資訊可參見[拓撲感知提示](/zh-cn/docs/concepts/services-networking/topology-aware-hints/)。
- `TopologyManager`：啟用一種機制來協調 Kubernetes 不同元件的細粒度硬體資源分配。
  詳見[控制節點上的拓撲管理策略](/zh-cn/docs/tasks/administer-cluster/topology-manager/)。
- `ValidateProxyRedirects`： 這個標誌控制 API 伺服器是否應該驗證只跟隨到相同的主機的重定向。
  僅在啟用 `StreamingProxyRedirects` 標誌時被使用。
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
- `VolumeCapacityPriority`: 基於可用 PV 容量的拓撲，啟用對不同節點的優先順序支援。
- `VolumePVCDataSource`：啟用對將現有 PVC 指定資料來源的支援。
- `VolumeScheduling`：啟用卷拓撲感知排程，並使 PersistentVolumeClaim（PVC）
  繫結能夠了解排程決策；當與 PersistentLocalVolumes 特性門控一起使用時，
  還允許使用 [`local`](/zh-cn/docs/concepts/storage/volumes/#local) 卷型別。
- `VolumeSnapshotDataSource`：啟用卷快照資料來源支援。
- `VolumeSubpath`： 允許在容器中掛載卷的子路徑。
<!--
- `VolumeSubpathEnvExpansion`: Enable `subPathExpr` field for expanding environment
  variables into a `subPath`.
- `WarningHeaders`: Allow sending warning headers in API responses.
- `WatchBookmark`: Enable support for watch bookmark events.
- `WinDSR`: Allows kube-proxy to create DSR loadbalancers for Windows.
- `WinOverlay`: Allows kube-proxy to run in overlay mode for Windows.
-->
- `VolumeSubpathEnvExpansion`：啟用 `subPathExpr` 欄位用於在 `subPath` 中展開環境變數。
- `WarningHeaders`：允許在 API 響應中傳送警告頭部。
- `WatchBookmark`：啟用對 watch 操作中 bookmark 事件的支援。
- `WinDSR`：允許 kube-proxy 為 Windows 建立 DSR 負載均衡。
- `WinOverlay`：允許在 Windows 的覆蓋網路模式下執行 kube-proxy 。
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
- `WindowsEndpointSliceProxying`: 當啟用時，執行在 Windows 上的 kube-proxy
  將使用 EndpointSlices 而不是 Endpoints 作為主要資料來源，從而實現可伸縮性和並改進效能。 
  詳情請參見[啟用端點切片](/zh-cn/docs/concepts/services-networking/endpoint-slices/).
- `WindowsGMSA`：允許將 GMSA 憑據規範從 Pod 傳遞到容器執行時。
- `WindowsHostProcessContainers`: 啟用對 Windows HostProcess 容器的支援。
- `WindowsRunAsUserName`：提供使用非預設使用者在 Windows 容器中執行應用程式的支援。
  詳情請參見
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
* Kubernetes 的[棄用策略](/zh-cn/docs/reference/using-api/deprecation-policy/)
  介紹了專案針對已移除特性和元件的處理方法。
* 從 Kubernetes 1.24 開始，預設不啟用新的 beta API。
  啟用 beta 功能時，還需要啟用所有關聯的 API 資源。
  例如：要啟用一個特定資源，如 `storage.k8s.io/v1beta1/csistoragecapacities`，
  請設定 `--runtime-config=storage.k8s.io/v1beta1/csistoragecapacities`。
  有關命令列標誌的更多詳細資訊，請參閱 [API 版本控制](/zh-cn/docs/reference/using-api/#api-versioning)。
