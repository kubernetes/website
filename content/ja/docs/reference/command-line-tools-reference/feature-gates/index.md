---
title: フィーチャーゲート
weight: 10
content_type: concept
---

<!-- overview -->
このページでは管理者がそれぞれのKubernetesコンポーネントで指定できるさまざまなフィーチャーゲートの概要について説明しています。

各機能におけるステージの説明については、[機能のステージ](#feature-stages)を参照してください。


<!-- body -->
## 概要

フィーチャーゲートはアルファ機能または実験的機能を記述するkey=valueのペアのセットです。管理者は各コンポーネントで`--feature-gates`コマンドラインフラグを使用することで機能をオンまたはオフにできます。

各コンポーネントはそれぞれのコンポーネント固有のフィーチャーゲートの設定をサポートします。すべてのコンポーネントのフィーチャーゲートの全リストを表示するには`-h`フラグを使用します。kubeletなどのコンポーネントにフィーチャーゲートを設定するには以下のようにリストの機能ペアを`--feature-gates`フラグを使用して割り当てます。

```shell
--feature-gates="...,DynamicKubeletConfig=true"
```

次の表は各Kubernetesコンポーネントに設定できるフィーチャーゲートの概要です。

- 「導入開始バージョン」列は機能が導入されたとき、またはリリース段階が変更されたときのKubernetesリリースバージョンとなります。
- 「最終利用可能バージョン」列は空ではない場合はフィーチャーゲートを使用できる最後のKubernetesリリースバージョンとなります。
- アルファまたはベータ状態の機能は[AlphaまたはBetaのフィーチャーゲート](#feature-gates-for-alpha-or-beta-features)に載っています。
- 安定している機能は、[graduatedまたはdeprecatedのフィーチャーゲート](#feature-gates-for-graduated-or-deprecated-features)に載っています。
- graduatedまたはdeprecatedのフィーチャーゲートには、非推奨および廃止された機能もリストされています。

### AlphaまたはBetaのフィーチャーゲート {#feature-gates-for-alpha-or-beta-features}

{{< table caption="AlphaまたはBetaのフィーチャーゲート" >}}

| 機能名 | デフォルト値 | ステージ | 導入開始バージョン | 最終利用可能バージョン |
|---------|---------|-------|-------|-------|
| `APIListChunking` | `false` | Alpha | 1.8 | 1.8 |
| `APIListChunking` | `true` | Beta | 1.9 | |
| `APIPriorityAndFairness` | `false` | Alpha | 1.18 | 1.19 |
| `APIPriorityAndFairness` | `true` | Beta | 1.20 | |
| `APIResponseCompression` | `false` | Alpha | 1.7 | 1.15 |
| `APIResponseCompression` | `true` | Beta | 1.16 | |
| `APISelfSubjectReview` | `false` | Alpha | 1.26 | |
| `APIServerIdentity` | `false` | Alpha | 1.20 | 1.25 |
| `APIServerIdentity` | `true` | Beta | 1.26 | |
| `APIServerTracing` | `false` | Alpha | 1.22 | |
| `AggregatedDiscoveryEndpoint` | `false` | Alpha | 1.26 | |
| `AnyVolumeDataSource` | `false` | Alpha | 1.18 | 1.23 |
| `AnyVolumeDataSource` | `true` | Beta | 1.24 | |
| `AppArmor` | `true` | Beta | 1.4 | |
| `CheckpointContainer` | `false` | Alpha | 1.25 | |
| `CPUManagerPolicyAlphaOptions` | `false` | Alpha | 1.23 | |
| `CPUManagerPolicyBetaOptions` | `true` | Beta | 1.23 | |
| `CPUManagerPolicyOptions` | `false` | Alpha | 1.22 | 1.22 |
| `CPUManagerPolicyOptions` | `true` | Beta | 1.23 | |
| `CSIMigrationPortworx` | `false` | Alpha | 1.23 | 1.24 |
| `CSIMigrationPortworx` | `false` | Beta | 1.25 | |
| `CSIMigrationRBD` | `false` | Alpha | 1.23 | |
| `CSINodeExpandSecret` | `false` | Alpha | 1.25 | |
| `CSIVolumeHealth` | `false` | Alpha | 1.21 | |
| `ComponentSLIs` | `false` | Alpha | 1.26 | |
| `ContainerCheckpoint` | `false` | Alpha | 1.25 | |
| `ContextualLogging` | `false` | Alpha | 1.24 | |
| `CronJobTimeZone` | `false` | Alpha | 1.24 | 1.24 |
| `CronJobTimeZone` | `true` | Beta | 1.25 | |
| `CrossNamespaceVolumeDataSource` | `false` | Alpha| 1.26 | |
| `CustomCPUCFSQuotaPeriod` | `false` | Alpha | 1.12 | |
| `CustomResourceValidationExpressions` | `false` | Alpha | 1.23 | 1.24 |
| `CustomResourceValidationExpressions` | `true` | Beta | 1.25 | |
| `DisableCloudProviders` | `false` | Alpha | 1.22 | |
| `DisableKubeletCloudCredentialProviders` | `false` | Alpha | 1.23 | |
| `DownwardAPIHugePages` | `false` | Alpha | 1.20 | 1.20 |
| `DownwardAPIHugePages` | `false` | Beta | 1.21 | 1.21 |
| `DownwardAPIHugePages` | `true` | Beta | 1.22 | |
| `DynamicResourceAllocation` | `false` | Alpha | 1.26 | |
| `EventedPLEG` | `false` | Alpha | 1.26 | - |
| `ExpandedDNSConfig` | `false` | Alpha | 1.22 | 1.25 |
| `ExpandedDNSConfig` | `true` | Beta | 1.26 | |
| `ExperimentalHostUserNamespaceDefaulting` | `false` | Beta | 1.5 | |
| `GRPCContainerProbe` | `false` | Alpha | 1.23 | 1.23 |
| `GRPCContainerProbe` | `true` | Beta | 1.24 | |
| `GracefulNodeShutdown` | `false` | Alpha | 1.20 | 1.20 |
| `GracefulNodeShutdown` | `true` | Beta | 1.21 | |
| `GracefulNodeShutdownBasedOnPodPriority` | `false` | Alpha | 1.23 | 1.23 |
| `GracefulNodeShutdownBasedOnPodPriority` | `true` | Beta | 1.24 | |
| `HPAContainerMetrics` | `false` | Alpha | 1.20 | |
| `HPAScaleToZero` | `false` | Alpha | 1.16 | |
| `HonorPVReclaimPolicy` | `false` | Alpha | 1.23 |  |
| `IPTablesOwnershipCleanup` | `false` | Alpha | 1.25 | |
| `InTreePluginAWSUnregister` | `false` | Alpha | 1.21 | |
| `InTreePluginAzureDiskUnregister` | `false` | Alpha | 1.21 | |
| `InTreePluginAzureFileUnregister` | `false` | Alpha | 1.21 | |
| `InTreePluginGCEUnregister` | `false` | Alpha | 1.21 | |
| `InTreePluginOpenStackUnregister` | `false` | Alpha | 1.21 | |
| `InTreePluginPortworxUnregister` | `false` | Alpha | 1.23 | |
| `InTreePluginRBDUnregister` | `false` | Alpha | 1.23 | |
| `InTreePluginvSphereUnregister` | `false` | Alpha | 1.21 | |
| `JobMutableNodeSchedulingDirectives` | `true` | Beta | 1.23 | |
| `JobPodFailurePolicy` | `false` | Alpha | 1.25 | 1.25 |
| `JobPodFailurePolicy` | `true` | Beta | 1.26 | |
| `JobReadyPods` | `false` | Alpha | 1.23 | 1.23 |
| `JobReadyPods` | `true` | Beta | 1.24 | |
| `KMSv2` | `false` | Alpha | 1.25 | |
| `KubeletInUserNamespace` | `false` | Alpha | 1.22 | |
| `KubeletPodResources` | `false` | Alpha | 1.13 | 1.14 |
| `KubeletPodResources` | `true` | Beta | 1.15 | |
| `KubeletPodResourcesGetAllocatable` | `false` | Alpha | 1.21 | 1.22 |
| `KubeletPodResourcesGetAllocatable` | `true` | Beta | 1.23 | |
| `KubeletTracing` | `false` | Alpha | 1.25 | |
| `LegacyServiceAccountTokenTracking` | `false` | Alpha | 1.26 | 1.26 |
| `LegacyServiceAccountTokenTracking` | `true` | Beta | 1.27 | |
| `LocalStorageCapacityIsolationFSQuotaMonitoring` | `false` | Alpha | 1.15 | - |
| `LogarithmicScaleDown` | `false` | Alpha | 1.21 | 1.21 |
| `LogarithmicScaleDown` | `true` | Beta | 1.22 | |
| `LoggingAlphaOptions` | `false` | Alpha | 1.24 | - |
| `LoggingBetaOptions` | `true` | Beta | 1.24 | - |
| `MatchLabelKeysInPodTopologySpread` | `false` | Alpha | 1.25 | |
| `MaxUnavailableStatefulSet` | `false` | Alpha | 1.24 | |
| `MemoryManager` | `false` | Alpha | 1.21 | 1.21 |
| `MemoryManager` | `true` | Beta | 1.22 | |
| `MemoryQoS` | `false` | Alpha | 1.22 | |
| `MinDomainsInPodTopologySpread` | `false` | Alpha | 1.24 | 1.24 |
| `MinDomainsInPodTopologySpread` | `false` | Beta | 1.25 | |
| `MinimizeIPTablesRestore` | `false` | Alpha | 1.26 | - |
| `MultiCIDRRangeAllocator` | `false` | Alpha | 1.25 | |
| `NetworkPolicyStatus` | `false` | Alpha | 1.24 |  |
| `NodeInclusionPolicyInPodTopologySpread` | `false` | Alpha | 1.25 | 1.25 |
| `NodeInclusionPolicyInPodTopologySpread` | `true` | Beta | 1.26 | |
| `NodeOutOfServiceVolumeDetach` | `false` | Alpha | 1.24 | 1.25 |
| `NodeOutOfServiceVolumeDetach` | `true` | Beta | 1.26 | |
| `NodeSwap` | `false` | Alpha | 1.22 | |
| `OpenAPIEnums` | `false` | Alpha | 1.23 | 1.23 |
| `OpenAPIEnums` | `true` | Beta | 1.24 | |
| `OpenAPIV3` | `false` | Alpha | 1.23 | 1.23 |
| `OpenAPIV3` | `true` | Beta | 1.24 | |
| `PDBUnhealthyPodEvictionPolicy` | `false` | Alpha | 1.26 | |
| `PodAndContainerStatsFromCRI` | `false` | Alpha | 1.23 | |
| `PodDeletionCost` | `false` | Alpha | 1.21 | 1.21 |
| `PodDeletionCost` | `true` | Beta | 1.22 | |
| `PodDisruptionConditions` | `false` | Alpha | 1.25 | 1.25 |
| `PodDisruptionConditions` | `true` | Beta | 1.26 | |
| `PodHasNetworkCondition` | `false` | Alpha | 1.25 | |
| `PodSchedulingReadiness` | `false` | Alpha | 1.26 | |
| `ProbeTerminationGracePeriod` | `false` | Alpha | 1.21 | 1.21 |
| `ProbeTerminationGracePeriod` | `false` | Beta | 1.22 | 1.24 |
| `ProbeTerminationGracePeriod` | `true` | Beta | 1.25 | |
| `ProcMountType` | `false` | Alpha | 1.12 | |
| `ProxyTerminatingEndpoints` | `false` | Alpha | 1.22 | 1.25 |
| `ProxyTerminatingEndpoints` | `true` | Beta | 1.26 | |
| `QOSReserved` | `false` | Alpha | 1.11 | |
| `ReadWriteOncePod` | `false` | Alpha | 1.22 | |
| `RecoverVolumeExpansionFailure` | `false` | Alpha | 1.23 | |
| `RemainingItemCount` | `false` | Alpha | 1.15 | 1.15 |
| `RemainingItemCount` | `true` | Beta | 1.16 | |
| `RetroactiveDefaultStorageClass` | `false` | Alpha | 1.25 | 1.25 |
| `RetroactiveDefaultStorageClass` | `true` | Beta | 1.26 | |
| `RotateKubeletServerCertificate` | `false` | Alpha | 1.7 | 1.11 |
| `RotateKubeletServerCertificate` | `true` | Beta | 1.12 | |
| `SELinuxMountReadWriteOncePod` | `false` | Alpha | 1.25 | |
| `SeccompDefault` | `false` | Alpha | 1.22 | 1.24 |
| `SeccompDefault` | `true` | Beta | 1.25 | |
| `ServerSideFieldValidation` | `false` | Alpha | 1.23 | 1.24 |
| `ServerSideFieldValidation` | `true` | Beta | 1.25 | |
| `SizeMemoryBackedVolumes` | `false` | Alpha | 1.20 | 1.21 |
| `SizeMemoryBackedVolumes` | `true` | Beta | 1.22 | |
| `StatefulSetAutoDeletePVC` | `false` | Alpha | 1.22 | |
| `StatefulSetStartOrdinal` | `false` | Alpha | 1.26 | |
| `StorageVersionAPI` | `false` | Alpha | 1.20 | |
| `StorageVersionHash` | `false` | Alpha | 1.14 | 1.14 |
| `StorageVersionHash` | `true` | Beta | 1.15 | |
| `TopologyAwareHints` | `false` | Alpha | 1.21 | 1.22 |
| `TopologyAwareHints` | `false` | Beta | 1.23 | 1.23 |
| `TopologyAwareHints` | `true` | Beta | 1.24 | |
| `TopologyManager` | `false` | Alpha | 1.16 | 1.17 |
| `TopologyManager` | `true` | Beta | 1.18 | |
| `TopologyManagerPolicyAlphaOptions` | `false` | Alpha | 1.26 | |
| `TopologyManagerPolicyBetaOptions` | `false` | Beta | 1.26 | |
| `TopologyManagerPolicyOptions` | `false` | Alpha | 1.26 | |
| `UserNamespacesStatelessPodsSupport` | `false` | Alpha | 1.25 | |
| `ValidatingAdmissionPolicy` | `false` | Alpha | 1.26 | |
| `VolumeCapacityPriority` | `false` | Alpha | 1.21 | - |
| `WinDSR` | `false` | Alpha | 1.14 | |
| `WinOverlay` | `false` | Alpha | 1.14 | 1.19 |
| `WinOverlay` | `true` | Beta | 1.20 | |
| `WindowsHostNetwork` | `false` | Alpha | 1.26| |
{{< /table >}}

### GraduatedまたはDeprecatedのフィーチャーゲート {#feature-gates-for-graduated-or-deprecated-features}

{{< table caption="GraduatedまたはDeprecatedのフィーチャーゲート" >}}

| 機能名 | デフォルト値 | ステージ | 導入開始バージョン | 最終利用可能バージョン |
|---------|---------|-------|-------|-------|
| `AdvancedAuditing` | `false` | Alpha | 1.7 | 1.7 |
| `AdvancedAuditing` | `true` | Beta | 1.8 | 1.11 |
| `AdvancedAuditing` | `true` | GA | 1.12 | - |
| `CPUManager` | `false` | Alpha | 1.8 | 1.9 |
| `CPUManager` | `true` | Beta | 1.10 | 1.25 |
| `CPUManager` | `true` | GA | 1.26 | - |
| `CSIInlineVolume` | `false` | Alpha | 1.15 | 1.15 |
| `CSIInlineVolume` | `true` | Beta | 1.16 | 1.24 |
| `CSIInlineVolume` | `true` | GA | 1.25 | - |
| `CSIMigration` | `false` | Alpha | 1.14 | 1.16 |
| `CSIMigration` | `true` | Beta | 1.17 | 1.24 |
| `CSIMigration` | `true` | GA | 1.25 | - |
| `CSIMigrationAWS` | `false` | Alpha | 1.14 | 1.16 |
| `CSIMigrationAWS` | `false` | Beta | 1.17 | 1.22 |
| `CSIMigrationAWS` | `true` | Beta | 1.23 | 1.24 |
| `CSIMigrationAWS` | `true` | GA | 1.25 | - |
| `CSIMigrationAzureDisk` | `false` | Alpha | 1.15 | 1.18 |
| `CSIMigrationAzureDisk` | `false` | Beta | 1.19 | 1.22 |
| `CSIMigrationAzureDisk` | `true` | Beta | 1.23 | 1.23 |
| `CSIMigrationAzureDisk` | `true` | GA | 1.24 | |
| `CSIMigrationAzureFile` | `false` | Alpha | 1.15 | 1.20 |
| `CSIMigrationAzureFile` | `false` | Beta | 1.21 | 1.23 |
| `CSIMigrationAzureFile` | `true` | Beta | 1.24 | 1.25 |
| `CSIMigrationAzureFile` | `true` | GA | 1.26 | |
| `CSIMigrationGCE` | `false` | Alpha | 1.14 | 1.16 |
| `CSIMigrationGCE` | `false` | Beta | 1.17 | 1.22 |
| `CSIMigrationGCE` | `true` | Beta | 1.23 | 1.24 |
| `CSIMigrationGCE` | `true` | GA | 1.25 | - |
| `CSIMigrationvSphere` | `false` | Alpha | 1.18 | 1.18 |
| `CSIMigrationvSphere` | `false` | Beta | 1.19 | 1.24 |
| `CSIMigrationvSphere` | `true` | Beta | 1.25 | 1.25 |
| `CSIMigrationvSphere` | `true` | GA | 1.26 | - |
| `CSIStorageCapacity` | `false` | Alpha | 1.19 | 1.20 |
| `CSIStorageCapacity` | `true` | Beta | 1.21 | 1.23 |
| `CSIStorageCapacity` | `true` | GA | 1.24 | - |
| `ConsistentHTTPGetHandlers` | `true` | GA | 1.25 | - |
| `ControllerManagerLeaderMigration` | `false` | Alpha | 1.21 | 1.21 |
| `ControllerManagerLeaderMigration` | `true` | Beta | 1.22 | 1.23 |
| `ControllerManagerLeaderMigration` | `true` | GA | 1.24 | - |
| `DaemonSetUpdateSurge` | `false` | Alpha | 1.21 | 1.21 |
| `DaemonSetUpdateSurge` | `true` | Beta | 1.22 | 1.24 |
| `DaemonSetUpdateSurge` | `true` | GA | 1.25 | - |
| `DelegateFSGroupToCSIDriver` | `false` | Alpha | 1.22 | 1.22 |
| `DelegateFSGroupToCSIDriver` | `true` | Beta | 1.23 | 1.25 |
| `DelegateFSGroupToCSIDriver` | `true` | GA | 1.26 |-|
| `DevicePlugins` | `false` | Alpha | 1.8 | 1.9 |
| `DevicePlugins` | `true` | Beta | 1.10 | 1.25 |
| `DevicePlugins` | `true` | GA | 1.26 | - |
| `DisableAcceleratorUsageMetrics` | `false` | Alpha | 1.19 | 1.19 |
| `DisableAcceleratorUsageMetrics` | `true` | Beta | 1.20 | 1.24 |
| `DisableAcceleratorUsageMetrics` | `true` | GA | 1.25 |- |
| `DryRun` | `false` | Alpha | 1.12 | 1.12 |
| `DryRun` | `true` | Beta | 1.13 | 1.18 |
| `DryRun` | `true` | GA | 1.19 | - |
| `EfficientWatchResumption` | `false` | Alpha | 1.20 | 1.20 |
| `EfficientWatchResumption` | `true` | Beta | 1.21 | 1.23 |
| `EfficientWatchResumption` | `true` | GA | 1.24 | - |
| `EndpointSliceTerminatingCondition` | `false` | Alpha | 1.20 | 1.21 |
| `EndpointSliceTerminatingCondition` | `true` | Beta | 1.22 | 1.25 |
| `EndpointSliceTerminatingCondition` | `true` | GA | 1.26 | |
| `EphemeralContainers` | `false` | Alpha | 1.16 | 1.22 |
| `EphemeralContainers` | `true` | Beta | 1.23 | 1.24 |
| `EphemeralContainers` | `true` | GA | 1.25 | - |
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
| `JobTrackingWithFinalizers` | `false` | Alpha | 1.22 | 1.22 |
| `JobTrackingWithFinalizers` | `false` | Beta | 1.23 | 1.24 |
| `JobTrackingWithFinalizers` | `true` | Beta | 1.25 | 1.25 |
| `JobTrackingWithFinalizers` | `true` | GA | 1.26 | - |
| `KubeletCredentialProviders` | `false` | Alpha | 1.20 | 1.23 |
| `KubeletCredentialProviders` | `true` | Beta | 1.24 | 1.25 |
| `KubeletCredentialProviders` | `true` | GA | 1.26 | - |
| `LegacyServiceAccountTokenNoAutoGeneration` | `true` | Beta | 1.24 | 1.25 |
| `LegacyServiceAccountTokenNoAutoGeneration` | `true` | GA | 1.26 | - |
| `LocalStorageCapacityIsolation` | `false` | Alpha | 1.7 | 1.9 |
| `LocalStorageCapacityIsolation` | `true` | Beta | 1.10 | 1.24 |
| `LocalStorageCapacityIsolation` | `true` | GA | 1.25 | - |
| `MixedProtocolLBService` | `false` | Alpha | 1.20 | 1.23 |
| `MixedProtocolLBService` | `true` | Beta | 1.24 | 1.25 |
| `MixedProtocolLBService` | `true` | GA | 1.26 | - |
| `NetworkPolicyEndPort` | `false` | Alpha | 1.21 | 1.21 |
| `NetworkPolicyEndPort` | `true` | Beta | 1.22 | 1.24 |
| `NetworkPolicyEndPort` | `true` | GA | 1.25 | - |
| `PodSecurity` | `false` | Alpha | 1.22 | 1.22 |
| `PodSecurity` | `true` | Beta | 1.23 | 1.24 |
| `PodSecurity` | `true` | GA | 1.25 | |
| `RemoveSelfLink` | `false` | Alpha | 1.16 | 1.19 |
| `RemoveSelfLink` | `true` | Beta | 1.20 | 1.23 |
| `RemoveSelfLink` | `true` | GA | 1.24 | - |
| `ServerSideApply` | `false` | Alpha | 1.14 | 1.15 |
| `ServerSideApply` | `true` | Beta | 1.16 | 1.21 |
| `ServerSideApply` | `true` | GA | 1.22 | - |
| `ServiceIPStaticSubrange` | `false` | Alpha | 1.24 | 1.24 |
| `ServiceIPStaticSubrange` | `true` | Beta | 1.25 | 1.25 |
| `ServiceIPStaticSubrange` | `true` | GA | 1.26 | - |
| `ServiceInternalTrafficPolicy` | `false` | Alpha | 1.21 | 1.21 |
| `ServiceInternalTrafficPolicy` | `true` | Beta | 1.22 | 1.25 |
| `ServiceInternalTrafficPolicy` | `true` | GA | 1.26 | - |
| `StatefulSetMinReadySeconds` | `false` | Alpha | 1.22 | 1.22 |
| `StatefulSetMinReadySeconds` | `true` | Beta | 1.23 | 1.24 |
| `StatefulSetMinReadySeconds` | `true` | GA | 1.25 | - |
| `WatchBookmark` | `false` | Alpha | 1.15 | 1.15 |
| `WatchBookmark` | `true` | Beta | 1.16 | 1.16 |
| `WatchBookmark` | `true` | GA | 1.17 | - |
| `WindowsHostProcessContainers` | `false` | Alpha | 1.22 | 1.22 |
| `WindowsHostProcessContainers` | `true` | Beta | 1.23 | 1.25 |
| `WindowsHostProcessContainers` | `true` | GA | 1.26 | - |
{{< /table >}}

## 機能を使用する

### 機能のステージ {#feature-stages}

機能には*Alpha* 、*Beta* 、*GA* の段階があります。*Alpha* 機能とは：

* デフォルトでは無効になっています。
* バグがあるかもしれません。機能を有効にするとバグが発生する可能性があります。
* 機能のサポートは予告無しにいつでも削除される場合があります。
* APIは今後のソフトウェアリリースで予告なく互換性の無い変更が行われる場合があります。
* バグが発生するリスクが高く長期的なサポートはないため、短期間のテストクラスターでのみ使用することをお勧めします。

*Beta* 機能とは：

* デフォルトで有効になっています。
* この機能は十分にテストされていて、有効にすることは安全と考えられます。
* 詳細は変更される可能性がありますが、機能全体のサポートは削除されません。
* オブジェクトのスキーマやセマンティックは、その後のベータ版または安定版リリースで互換性の無い変更が行われる場合があります。互換性の無い変更が行われた場合には次のバージョンへの移行手順を提供します。これにはAPIオブジェクトの削除、編集、および再作成が必要になる場合があります。バージョンアップにはいくつかの対応が必要な場合があります。これには機能に依存するアプリケーションのダウンタイムが発生する場合があります。
* 今後のリリースで互換性の無い変更が行われる可能性があるため、ビジネスクリティカルでない使用のみが推奨されます。個別にアップグレードできる複数のクラスターがある場合はこの制限を緩和できる場合があります。

{{< note >}}
*ベータ版* の機能を試してフィードバックをお寄せください！
GAになってからさらなる変更を加えることは現実的ではない場合があります。
{{< /note >}}

*GA* 機能とは(*GA* 機能は*安定版* 機能とも呼ばれます):

* 機能は常に有効となり、無効にすることはできません。
* フィーチャーゲートの設定は不要になります。
* 機能の安定版は後続バージョンでリリースされたソフトウェアで使用されます。

### フィーチャーゲート

各フィーチャーゲートは特定の機能を有効/無効にするように設計されています。

- `Accelerators`: DockerでのNvidia GPUのサポートを有効にします。
- `AdvancedAuditing`: [高度な監査機能](/ja/docs/tasks/debug/debug-cluster/audit/#advanced-audit)を有効にします。
- `AffinityInAnnotations`(*非推奨*): [Podのアフィニティまたはアンチアフィニティ](/ja/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)を有効にします。
- `AnyVolumeDataSource`: {{< glossary_tooltip text="PVC" term_id="persistent-volume-claim" >}}の`DataSource`としてカスタムリソースの使用を有効にします。
- `AllowExtTrafficLocalEndpoints`: サービスが外部へのリクエストをノードのローカルエンドポイントにルーティングできるようにします。
- `APIListChunking`: APIクライアントがAPIサーバーからチャンク単位で（`LIST`や`GET`の）リソースを取得できるようにします。
`APIPriorityAndFairness`: 各サーバーで優先順位付けと公平性を備えた要求の並行性を管理できるようにします(`RequestManagement`から名前が変更されました)。
- `APIResponseCompression`:`LIST`や`GET`リクエストのAPIレスポンスを圧縮します。
- `AppArmor`: Dockerを使用する場合にLinuxノードでAppArmorによる強制アクセスコントロールを有効にします。詳細は[AppArmorチュートリアル](/ja/docs/tutorials/clusters/apparmor/)で確認できます。
- `ContainerCheckpoint`: kubeletチェックポイントAPIを有効にします。詳細は[KubeletチェックポイントAPI](/ja/docs/reference/node/kubelet-checkpoint-api/)で確認できます。
- `AttachVolumeLimit`: ボリュームプラグインを有効にすることでノードにアタッチできるボリューム数の制限を設定できます。
- `BalanceAttachedNodeVolumes`: スケジューリング中にバランスのとれたリソース割り当てを考慮するノードのボリュームカウントを含めます。判断を行う際に、CPU、メモリー使用率、およびボリュームカウントが近いノードがスケジューラーによって優先されます。
- `BlockVolume`: PodでRawブロックデバイスの定義と使用を有効にします。詳細は[Rawブロックボリュームのサポート](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support)で確認できます。
- `BoundServiceAccountTokenVolume`: ServiceAccountTokenVolumeProjectionによって構成される計画ボリュームを使用するにはServiceAccountボリュームを移行します。詳細は[Service Account Token Volumes](https://git.k8s.io/community/contributors/design-proposals/storage/svcacct-token-volume-source.md)で確認できます。
- `ConfigurableFSGroupPolicy`: Podにボリュームをマウントするときに、ユーザーがfsGroupsのボリューム権限変更ポリシーを設定できるようにします。詳細については、[Podのボリューム権限と所有権変更ポリシーの設定](/docs/tasks/configure-pod-container/security-context/#configure-volume-permission-and-ownership-change-policy-for-pods)をご覧ください。
- `CPUManager`: コンテナレベルのCPUアフィニティサポートを有効します。[CPUマネジメントポリシー](/docs/tasks/administer-cluster/cpu-management-policies/)を見てください。
- `CRIContainerLogRotation`: criコンテナランタイムのコンテナログローテーションを有効にします。
- `CSIBlockVolume`: 外部CSIボリュームドライバーを有効にしてブロックストレージをサポートします。詳細は[`csi`Rawブロックボリュームのサポート](/docs/concepts/storage/volumes/#csi-raw-block-volume-support)で確認できます。
- `CSIDriverRegistry`: csi.storage.k8s.ioのCSIDriver APIオブジェクトに関連するすべてのロジックを有効にします。
- `CSIInlineVolume`: PodのCSIインラインボリュームサポートを有効にします。
- `CSIMigration`: シムと変換ロジックを有効にしてボリューム操作をKubernetesリポジトリー内のプラグインから対応した事前インストール済みのCSIプラグインにルーティングします。
- `CSIMigrationAWS`: シムと変換ロジックを有効にしてボリューム操作をKubernetesリポジトリー内のAWS-EBSプラグインからEBS CSIプラグインにルーティングします。ノードにEBS CSIプラグインがインストールおよび設定されていない場合、ツリー内のEBSプラグインへのフォールバックをサポートします。CSIMigration機能フラグを有効にする必要があります。
- `CSIMigrationAWSComplete`: EBSツリー内プラグインのkubeletおよびボリュームコントローラーへの登録を停止し、シムと変換ロジックを有効にして、AWS-EBSツリー内プラグインからEBS CSIプラグインにボリューム操作をルーティングします。CSIMigrationおよびCSIMigrationAWS機能フラグを有効にし、クラスター内のすべてのノードにEBS CSIプラグインをインストールおよび設定する必要があります。
- `CSIMigrationAzureDisk`: シムと変換ロジックを有効にしてボリューム操作をKubernetesリポジトリー内のAzure-DiskプラグインからAzure Disk CSIプラグインにルーティングします。ノードにAzureDisk CSIプラグインがインストールおよび設定されていない場合、ツリー内のAzureDiskプラグインへのフォールバックをサポートします。CSIMigration機能フラグを有効にする必要があります。
- `CSIMigrationAzureDiskComplete`: Azure-Diskツリー内プラグインのkubeletおよびボリュームコントローラーへの登録を停止し、シムと変換ロジックを有効にして、Azure-Diskツリー内プラグインからAzureDisk CSIプラグインにボリューム操作をルーティングします。CSIMigrationおよびCSIMigrationAzureDisk機能フラグを有効にし、クラスター内のすべてのノードにAzureDisk CSIプラグインをインストールおよび設定する必要があります。
- `CSIMigrationAzureFile`: シムと変換ロジックを有効にしてボリューム操作をKubernetesリポジトリー内のAzure-FileプラグインからAzure File CSIプラグインにルーティングします。ノードにAzureFile CSIプラグインがインストールおよび設定されていない場合、ツリー内のAzureFileプラグインへのフォールバックをサポートします。CSIMigration機能フラグを有効にする必要があります。
- `CSIMigrationAzureFileComplete`: Azure-Fileツリー内プラグインのkubeletおよびボリュームコントローラーへの登録を停止し、シムと変換ロジックを有効にして、Azure-Fileツリー内プラグインからAzureFile CSIプラグインにボリューム操作をルーティングします。CSIMigrationおよびCSIMigrationAzureFile機能フラグを有効にし、クラスター内のすべてのノードにAzureFile CSIプラグインをインストールおよび設定する必要があります。
- `CSIMigrationGCE`: シムと変換ロジックを有効にしてボリューム操作をKubernetesリポジトリー内のGCE-PDプラグインからPD CSIプラグインにルーティングします。ノードにPD CSIプラグインがインストールおよび設定されていない場合、ツリー内のGCEプラグインへのフォールバックをサポートします。CSIMigration機能フラグを有効にする必要があります。
- `CSIMigrationGCEComplete`: GCE-PDのツリー内プラグインのkubeletおよびボリュームコントローラーへの登録を停止し、シムと変換ロジックがGCE-PDのツリー内プラグインからPD CSIプラグインにボリューム操作をルーティングできるようにします。CSIMigrationおよびCSIMigrationGCE機能フラグを有効にし、クラスター内のすべてのノードにPD CSIプラグインをインストールおよび設定する必要があります。
- `CSIMigrationOpenStack`: シムと変換ロジックを有効にしてボリューム操作をKubernetesリポジトリー内のCinderプラグインからCinder CSIプラグインにルーティングします。ノードにCinder CSIプラグインがインストールおよび設定されていない場合、ツリー内のCinderプラグインへのフォールバックをサポートします。CSIMigration機能フラグを有効にする必要があります。
- `CSIMigrationOpenStackComplete`: Cinderのツリー内プラグインのkubeletおよびボリュームコントローラーへの登録を停止し、シムと変換ロジックがCinderのツリー内プラグインからCinder CSIプラグインにボリューム操作をルーティングできるようにします。CSIMigrationおよびCSIMigrationOpenStack機能フラグを有効にし、クラスター内のすべてのノードにCinder CSIプラグインをインストールおよび設定する必要があります。
- `CSINodeInfo`: csi.storage.k8s.ioのCSINodeInfo APIオブジェクトに関連するすべてのロジックを有効にします。
- `CSIPersistentVolume`: [CSI(Container Storage Interface)](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md)互換のボリュームプラグインを通してプロビジョニングされたボリュームの検出とマウントを有効にします。
  詳細については[`csi`ボリュームタイプ](/docs/concepts/storage/volumes/#csi)ドキュメントを確認してください。
- `CustomCPUCFSQuotaPeriod`: ノードがCPUCFSQuotaPeriodを変更できるようにします。
- `CustomPodDNS`: `dnsConfig`プロパティを使用したPodのDNS設定のカスタマイズを有効にします。詳細は[PodのDNS構成](/ja/docs/concepts/services-networking/dns-pod-service/#pods-dns-config)で確認できます。
- `CustomResourceDefaulting`: OpenAPI v3バリデーションスキーマにおいて、デフォルト値のCRDサポートを有効にします。
- `CustomResourcePublishOpenAPI`: CRDのOpenAPI仕様での公開を有効にします。
- `CustomResourceSubresources`: [CustomResourceDefinition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)から作成されたリソースの`/status`および`/scale`サブリソースを有効にします。
- `CustomResourceValidation`: [CustomResourceDefinition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)から作成されたリソースのスキーマによる検証を有効にします。
- `CustomResourceWebhookConversion`: [CustomResourceDefinition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)から作成されたリソースのWebhookベースの変換を有効にします。
- `DevicePlugins`: [device-plugins](/docs/concepts/cluster-administration/device-plugins/)によるノードでのリソースプロビジョニングを有効にします。
- `DryRun`: サーバーサイドでの[dry run](/docs/reference/using-api/api-concepts/#dry-run)リクエストを有効にします。
- `DynamicKubeletConfig`: kubeletの動的構成を有効にします。[kubeletの再設定](/docs/tasks/administer-cluster/reconfigure-kubelet/)を参照してください。
- `DynamicProvisioningScheduling`: デフォルトのスケジューラーを拡張してボリュームトポロジーを認識しPVプロビジョニングを処理します。この機能は、v1.12の`VolumeScheduling`機能に完全に置き換えられました。
- `DynamicVolumeProvisioning`(*非推奨*): Podへの永続ボリュームの[動的プロビジョニング](/ja/docs/concepts/storage/dynamic-provisioning/)を有効にします。
- `EnableAggregatedDiscoveryTimeout` (*非推奨*): 集約されたディスカバリーコールで5秒のタイムアウトを有効にします。
- `EnableEquivalenceClassCache`: Podをスケジュールするときにスケジューラーがノードの同等をキャッシュできるようにします。
- `EphemeralContainers`: 稼働するPodに{{< glossary_tooltip text="ephemeral containers" term_id="ephemeral-container" >}}を追加する機能を有効にします。
- `EvenPodsSpread`: Podをトポロジードメイン全体で均等にスケジュールできるようにします。[Even Pods Spread](/docs/concepts/configuration/even-pods-spread)をご覧ください。
- `ExpandInUsePersistentVolumes`: 使用中のPVCのボリューム拡張を有効にします。[使用中のPersistentVolumeClaimのサイズ変更](/docs/concepts/storage/persistent-volumes/#resizing-an-in-use-persistentvolumeclaim)を参照してください。
- `ExpandPersistentVolumes`: 永続ボリュームの拡張を有効にします。[永続ボリューム要求の拡張](/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims)を参照してください。
- `ExperimentalCriticalPodAnnotation`: [スケジューリングが保証されるよう](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/)に特定のPodへの *クリティカル* の注釈を加える設定を有効にします。
- `ExperimentalHostUserNamespaceDefaultingGate`: ホストするデフォルトのユーザー名前空間を有効にします。これは他のホストの名前空間やホストのマウントを使用しているコンテナ、特権を持つコンテナ、または名前空間のない特定の機能（たとえば`MKNODE`、`SYS_MODULE`など）を使用しているコンテナ用です。これはDockerデーモンでユーザー名前空間の再マッピングが有効になっている場合にのみ有効にすべきです。
- `EndpointSlice`: よりスケーラブルで拡張可能なネットワークエンドポイントのエンドポイントスライスを有効にします。[Enabling Endpoint Slices](/docs/tasks/administer-cluster/enabling-endpointslices/)をご覧ください。
- `EndpointSliceProxying`: このフィーチャーゲートを有効にすると、kube-proxyはエンドポイントの代わりにエンドポイントスライスをプライマリデータソースとして使用し、スケーラビリティとパフォーマンスの向上を実現します。[Enabling Endpoint Slices](/docs/tasks/administer-cluster/enabling-endpointslices/).をご覧ください。
- `GCERegionalPersistentDisk`: GCEでリージョナルPD機能を有効にします。
- `HugePages`: 事前に割り当てられた[huge pages](/ja/docs/tasks/manage-hugepages/scheduling-hugepages/)の割り当てと消費を有効にします。
- `HugePageStorageMediumSize`: 事前に割り当てられた複数のサイズの[huge pages](/docs/tasks/manage-hugepages/scheduling-hugepages/)のサポートを有効にします。
- `HyperVContainer`: Windowsコンテナの[Hyper-Vによる分離](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container)を有効にします。
- `HPAScaleToZero`: カスタムメトリクスまたは外部メトリクスを使用するときに、`HorizontalPodAutoscaler`リソースの`minReplicas`を0に設定できるようにします。
- `ImmutableEphemeralVolumes`: 安全性とパフォーマンスを向上させるために、個々のSecretとConfigMapが不変となるように指定できるようにします。
- `KubeletConfigFile`: 設定ファイルを使用して指定されたファイルからのkubelet設定の読み込みを有効にします。詳細は[設定ファイルによるkubeletパラメーターの設定](/docs/tasks/administer-cluster/kubelet-config-file/)で確認できます。
- `KubeletPluginsWatcher`: 調査ベースのプラグイン監視ユーティリティを有効にしてkubeletが[CSIボリュームドライバー](/docs/concepts/storage/volumes/#csi)などのプラグインを検出できるようにします。
- `KubeletPodResources`: kubeletのPodのリソースgrpcエンドポイントを有効にします。詳細は[デバイスモニタリングのサポート](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/compute-device-assignment.md)で確認できます。
- `LegacyNodeRoleBehavior`: 無効にすると、サービスロードバランサーの従来の動作とノードの中断により機能固有のラベルが優先され、`node-role.kubernetes.io/master`ラベルが無視されます。
- `LocalStorageCapacityIsolation`: [ローカルの一時ストレージ](/docs/concepts/configuration/manage-resources-containers/)の消費を有効にして、[emptyDirボリューム](/docs/concepts/storage/volumes/#emptydir)の`sizeLimit`プロパティも有効にします。
- `LocalStorageCapacityIsolationFSQuotaMonitoring`: `LocalStorageCapacityIsolation`が[ローカルの一時ストレージ](/docs/concepts/configuration/manage-resources-containers/)で有効になっていて、[emptyDirボリューム](/docs/concepts/storage/volumes/#emptydir)のbacking filesystemがプロジェクトクォータをサポートし有効になっている場合、プロジェクトクォータを使用して、パフォーマンスと精度を向上させるために、ファイルシステムへのアクセスではなく[emptyDirボリューム](/docs/concepts/storage/volumes/#emptydir)ストレージ消費を監視します。
- `MountContainers`: ホスト上のユーティリティコンテナをボリュームマウンターとして使用できるようにします。
- `MountPropagation`: あるコンテナによってマウントされたボリュームを他のコンテナまたはPodに共有できるようにします。詳細は[マウントの伝播](/docs/concepts/storage/volumes/#mount-propagation)で確認できます。
- `NodeDisruptionExclusion`: ノードラベル`node.kubernetes.io/exclude-disruption`の使用を有効にします。これにより、ゾーン障害時にノードが退避するのを防ぎます。
- `NodeLease`: 新しいLease APIを有効にしてノードヘルスシグナルとして使用できるノードのハートビートをレポートします。
- `NonPreemptingPriority`: PriorityClassとPodのNonPreemptingオプションを有効にします。
- `PersistentLocalVolumes`: Podで`local`ボリュームタイプの使用を有効にします。`local`ボリュームを要求する場合、Podアフィニティを指定する必要があります。
- `PodOverhead`: [PodOverhead](/docs/concepts/configuration/pod-overhead/)機能を有効にして、Podのオーバーヘッドを考慮するようにします。
- `PodDisruptionBudget`: [PodDisruptionBudget](/docs/tasks/run-application/configure-pdb/)機能を有効にします。
- `PodPriority`: [優先度](/docs/concepts/configuration/pod-priority-preemption/)に基づいてPodの再スケジューリングとプリエンプションを有効にします。
- `PodReadinessGates`: Podのreadinessの評価を拡張するために`PodReadinessGate`フィールドの設定を有効にします。詳細は[Pod readiness gate](/ja/docs/concepts/workloads/pods/pod-lifecycle/#pod-readiness-gate)で確認できます。
- `PodShareProcessNamespace`: Podで実行されているコンテナ間で単一のプロセス名前空間を共有するには、Podで`shareProcessNamespace`の設定を有効にします。詳細については、[Pod内のコンテナ間でプロセス名前空間を共有する](/ja/docs/tasks/configure-pod-container/share-process-namespace/)をご覧ください。
- `ProcMountType`: コンテナのProcMountTypeの制御を有効にします。
- `PVCProtection`: 永続ボリューム要求（PVC）がPodでまだ使用されているときに削除されないようにします。詳細は[ここ](/docs/tasks/administer-cluster/storage-object-in-use-protection/)で確認できます。
- `QOSReserved`: QoSレベルでのリソース予約を許可して、低いQoSレベルのポッドが高いQoSレベルで要求されたリソースにバーストするのを防ぎます（現時点ではメモリのみ）。
- `ResourceLimitsPriorityFunction`: 入力したPodのCPU制限とメモリ制限の少なくとも1つを満たすノードに対して最低スコアを1に割り当てるスケジューラー優先機能を有効にします。その目的は同じスコアを持つノード間の関係を断つことです。
- `ResourceQuotaScopeSelectors`: リソース割当のスコープセレクターを有効にします。
- `RotateKubeletClientCertificate`: kubeletでクライアントTLS証明書のローテーションを有効にします。詳細は[kubeletの設定](/docs/tasks/administer-cluster/storage-object-in-use-protection/)で確認できます。
- `RotateKubeletServerCertificate`: kubeletでサーバーTLS証明書のローテーションを有効にします。詳細は[kubeletの設定](/docs/tasks/administer-cluster/storage-object-in-use-protection/)で確認できます。
- `RunAsGroup`: コンテナの初期化プロセスで設定されたプライマリグループIDの制御を有効にします。
- `RuntimeClass`: コンテナのランタイム構成を選択するには[RuntimeClass](/ja/docs/concepts/containers/runtime-class/)機能を有効にします。
- `ScheduleDaemonSetPods`: DaemonSetのPodをDaemonSetコントローラーではなく、デフォルトのスケジューラーによってスケジュールされるようにします。
- `SCTPSupport`: `Service`、`Endpoints`、`NetworkPolicy`、`Pod`の定義で`protocol`の値としてSCTPを使用できるようにします
- `ServerSideApply`: APIサーバーで[サーバーサイドApply(SSA)](/docs/reference/using-api/api-concepts/#server-side-apply)のパスを有効にします。
- `ServiceAccountIssuerDiscovery`: APIサーバーにてサービスアカウント発行者のOIDC検出エンドポイント（発行者とJWKS URL）を有効にします。詳細については、[Podのサービスアカウント設定](/docs/tasks/configure-pod-container/configure-service-account/#service-account-issuer-discovery)をご覧ください。
- `ServiceAppProtocol`: サービスとエンドポイントで`AppProtocol`フィールドを有効にします。
- `ServiceLoadBalancerFinalizer`: サービスロードバランサーのファイナライザー保護を有効にします。
- `ServiceNodeExclusion`: クラウドプロバイダーによって作成されたロードバランサーからのノードの除外を有効にします。"`alpha.service-controller.kubernetes.io/exclude-balancer`"キーまたは`node.kubernetes.io/exclude-from-external-load-balancers`でラベル付けされている場合ノードは除外の対象となります。
- `ServiceTopology`: クラスターのノードトポロジーに基づいてトラフィックをルーティングするサービスを有効にします。詳細については、[Serviceトポロジー](/ja/docs/concepts/services-networking/service-topology/)を参照してください。
- `StartupProbe`: kubeletで[startup](/ja/docs/concepts/workloads/pods/pod-lifecycle/#when-should-you-use-a-startup-probe)プローブを有効にします。
- `StorageObjectInUseProtection`: PersistentVolumeまたはPersistentVolumeClaimオブジェクトがまだ使用されている場合、それらの削除を延期します。
- `StorageVersionHash`: apiserversがディスカバリーでストレージのバージョンハッシュを公開できるようにします。
- `StreamingProxyRedirects`: ストリーミングリクエストのバックエンド(kubelet)からのリダイレクトをインターセプト（およびフォロー）するようAPIサーバーに指示します。ストリーミングリクエストの例には`exec`、`attach`、`port-forward`リクエストが含まれます。
- `SupportIPVSProxyMode`: IPVSを使用したクラスター内サービスの負荷分散の提供を有効にします。詳細は[サービスプロキシ](/ja/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies)で確認できます。
- `SupportPodPidsLimit`: PodのPID制限のサポートを有効にします。
- `Sysctls`: 各Podに設定できる名前空間付きのカーネルパラメーター(sysctl)のサポートを有効にします。詳細は[sysctls](/docs/tasks/administer-cluster/sysctl-cluster/)で確認できます。
- `TaintBasedEvictions`: ノードのTaintとPodのTolerationに基づいてノードからPodを排除できるようにします。。詳細は[TaintとToleration](/docs/concepts/scheduling-eviction/taint-and-toleration/)で確認できます。
- `TaintNodesByCondition`: [ノードの条件](/ja/docs/concepts/architecture/nodes/#condition)に基づいてノードの自動Taintを有効にします。
- `TokenRequest`: サービスアカウントリソースで`TokenRequest`エンドポイントを有効にします。
- `TokenRequestProjection`: [Projectedボリューム](/docs/concepts/storage/volumes/#projected)を使用したPodへのサービスアカウントのトークンの注入を有効にします。
- `TTLAfterFinished`: [TTLコントローラー](/ja/docs/concepts/workloads/controllers/ttlafterfinished/)が実行終了後にリソースをクリーンアップできるようにします。
- `VolumePVCDataSource`: 既存のPVCをデータソースとして指定するサポートを有効にします。
- `VolumeScheduling`: ボリュームトポロジー対応のスケジューリングを有効にし、PersistentVolumeClaim（PVC）バインディングにスケジューリングの決定を認識させます。また`PersistentLocalVolumes`フィーチャーゲートと一緒に使用すると[`local`](/docs/concepts/storage/volumes/#local)ボリュームタイプの使用が可能になります。
- `VolumeSnapshotDataSource`: ボリュームスナップショットのデータソースサポートを有効にします。
- `VolumeSubpathEnvExpansion`: 環境変数を`subPath`に展開するための`subPathExpr`フィールドを有効にします。
- `WatchBookmark`: ブックマークイベントの監視サポートを有効にします。
- `WindowsGMSA`: GMSA資格仕様をPodからコンテナランタイムに渡せるようにします。
- `WindowsRunAsUserName`: デフォルト以外のユーザーでWindowsコンテナアプリケーションを実行するためのサポートを有効にします。詳細については、[RunAsUserNameの設定](/docs/tasks/configure-pod-container/configure-runasusername)を参照してください。
- `WinDSR`: kube-proxyがWindows用のDSRロードバランサーを作成できるようにします。
- `WinOverlay`: kube-proxyをWindowsのオーバーレイモードで実行できるようにします。


## {{% heading "whatsnext" %}}

* Kubernetesの[非推奨ポリシー](/docs/reference/using-api/deprecation-policy/)では、機能とコンポーネントを削除するためのプロジェクトのアプローチを説明しています。
