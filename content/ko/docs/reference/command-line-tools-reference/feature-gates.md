---
weight: 10
title: 기능 게이트
content_type: concept
card:
  name: reference
  weight: 60
---

<!-- overview -->
이 페이지에는 관리자가 다른 쿠버네티스 컴포넌트에서 지정할 수 있는 다양한
기능 게이트에 대한 개요가 포함되어 있다.

기능의 단계(stage)에 대한 설명은 [기능 단계](#기능-단계)를 참고한다.


<!-- body -->
## 개요

기능 게이트는 쿠버네티스 기능을 설명하는 일련의 키=값 쌍이다.
각 쿠버네티스 컴포넌트에서 `--feature-gates` 커맨드 라인 플래그를 사용하여
이러한 기능을 켜거나 끌 수 있다.

각 쿠버네티스 컴포넌트를 사용하면 해당 컴포넌트와 관련된 기능 게이트 집합을
활성화 또는 비활성화할 수 있다.
모든 컴포넌트에 대한 전체 기능 게이트 집합을 보려면 `-h` 플래그를 사용한다.
kubelet과 같은 컴포넌트의 기능 게이트를 설정하려면,
기능 쌍 목록에 지정된 `--feature-gates` 플래그를 사용한다.

```shell
--feature-gates=...,GracefulNodeShutdown=true
```

다음 표는 다른 쿠버네티스 컴포넌트에서 설정할 수 있는 기능 게이트를
요약한 것이다.

- "도입" 열에는 기능이 소개되거나 릴리스 단계가 변경될 때의
  쿠버네티스 릴리스가 포함된다.
- "종료" 열이 비어 있지 않으면, 여전히 기능 게이트를 사용할 수 있는 마지막
  쿠버네티스 릴리스가 포함된다.
- 기능이 알파 또는 베타 상태인 경우,
  [알파/베타 기능 게이트 테이블](#알파-또는-베타-기능을-위한-기능-게이트)에서 나열된 기능을 찾을 수 있다.
- 기능이 안정된 경우 해당 기능에 대한 모든 단계를
  [승급(graduated)/사용 중단(deprecated) 기능 게이트 테이블](#승급-또는-사용-중단된-기능을-위한-기능-게이트)에 나열할 수 있다.
- [승급/사용 중단 기능 게이트 테이블](#승급-또는-사용-중단된-기능을-위한-기능-게이트)에는
  사용 중단된 기능과 철회(withdrawn) 기능의 목록도 있다.

{{< note >}}
제거된 옛 기능 게이트의 레퍼런스를 보려면, 
[제거된 기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates-removed/) 페이지를 참고한다.
{{< /note >}}

### 알파 또는 베타 기능을 위한 기능 게이트

{{< table caption="알파 또는 베타 단계에 있는 기능을 위한 기능 게이트" >}}

| 기능     | 디폴트    | 단계   | 도입   | 종료   |
|---------|---------|-------|-------|-------|
| `APIListChunking` | `false` | 알파 | 1.8 | 1.8 |
| `APIListChunking` | `true` | 베타 | 1.9 | |
| `APIPriorityAndFairness` | `false` | 알파 | 1.18 | 1.19 |
| `APIPriorityAndFairness` | `true` | 베타 | 1.20 | |
| `APIResponseCompression` | `false` | 알파 | 1.7 | 1.15 |
| `APIResponseCompression` | `true` | 베타 | 1.16 | |
| `APISelfSubjectAttributesReview` | `false` | 알파 | 1.26 | |
| `APIServerIdentity` | `false` | 알파 | 1.20 | 1.25 |
| `APIServerIdentity` | `true` | 베타 | 1.26 | |
| `APIServerTracing` | `false` | 알파 | 1.22 | |
| `AllowInsecureBackendProxy` | `true` | 베타 | 1.17 | |
| `AnyVolumeDataSource` | `false` | 알파 | 1.18 | 1.23 |
| `AnyVolumeDataSource` | `true` | 베타 | 1.24 | |
| `AppArmor` | `true` | 베타 | 1.4 | |
| `CPUManagerPolicyAlphaOptions` | `false` | 알파 | 1.23 | |
| `CPUManagerPolicyBetaOptions` | `true` | 베타 | 1.23 | |
| `CPUManagerPolicyOptions` | `false` | 알파 | 1.22 | 1.22 |
| `CPUManagerPolicyOptions` | `true` | 베타 | 1.23 | |
| `CSIMigrationPortworx` | `false` | 알파 | 1.23 | 1.24 |
| `CSIMigrationPortworx` | `false` | 베타 | 1.25 | |
| `CSIMigrationRBD` | `false` | 알파 | 1.23 | |
| `CSINodeExpandSecret` | `false` | 알파 | 1.25 | |
| `CSIVolumeHealth` | `false` | 알파 | 1.21 | |
| `CrossNamespaceVolumeDataSource` | `false` | 알파| 1.26 | |
| `ContainerCheckpoint` | `false` | 알파 | 1.25 | |
| `ContextualLogging` | `false` | 알파 | 1.24 | |
| `CustomCPUCFSQuotaPeriod` | `false` | 알파 | 1.12 | |
| `CustomResourceValidationExpressions` | `false` | 알파 | 1.23 | 1.24 |
| `CustomResourceValidationExpressions` | `true` | 베타 | 1.25 | |
| `DisableCloudProviders` | `false` | 알파 | 1.22 | |
| `DisableKubeletCloudCredentialProviders` | `false` | 알파 | 1.23 | |
| `DownwardAPIHugePages` | `false` | 알파 | 1.20 | 1.20 |
| `DownwardAPIHugePages` | `false` | 베타 | 1.21 | 1.21 |
| `DownwardAPIHugePages` | `true` | 베타 | 1.22 | |
| `DynamicResourceAllocation` | `false` | 알파 | 1.26 | |
| `EndpointSliceTerminatingCondition` | `false` | 알파 | 1.20 | 1.21 |
| `EndpointSliceTerminatingCondition` | `true` | 베타 | 1.22 | |
| `ExpandedDNSConfig` | `false` | 알파 | 1.22 | |
| `ExperimentalHostUserNamespaceDefaulting` | `false` | 베타 | 1.5 | |
| `GRPCContainerProbe` | `false` | 알파 | 1.23 | 1.23 |
| `GRPCContainerProbe` | `true` | 베타 | 1.24 | |
| `GracefulNodeShutdown` | `false` | 알파 | 1.20 | 1.20 |
| `GracefulNodeShutdown` | `true` | 베타 | 1.21 | |
| `GracefulNodeShutdownBasedOnPodPriority` | `false` | 알파 | 1.23 | 1.23 |
| `GracefulNodeShutdownBasedOnPodPriority` | `true` | 베타 | 1.24 | |
| `HPAContainerMetrics` | `false` | 알파 | 1.20 | |
| `HPAScaleToZero` | `false` | 알파 | 1.16 | |
| `HonorPVReclaimPolicy` | `false` | 알파 | 1.23 |  |
| `InTreePluginAWSUnregister` | `false` | 알파 | 1.21 | |
| `InTreePluginAzureDiskUnregister` | `false` | 알파 | 1.21 | |
| `InTreePluginAzureFileUnregister` | `false` | 알파 | 1.21 | |
| `InTreePluginGCEUnregister` | `false` | 알파 | 1.21 | |
| `InTreePluginOpenStackUnregister` | `false` | 알파 | 1.21 | |
| `InTreePluginPortworxUnregister` | `false` | 알파 | 1.23 | |
| `InTreePluginRBDUnregister` | `false` | 알파 | 1.23 | |
| `InTreePluginvSphereUnregister` | `false` | 알파 | 1.21 | |
| `IPTablesOwnershipCleanup` | `false` | 알파 | 1.25 | |
| `JobMutableNodeSchedulingDirectives` | `true` | 베타 | 1.23 | |
| `JobPodFailurePolicy` | `false` | 알파 | 1.25 | 1.25 |
| `JobPodFailurePolicy` | `true` | 베타 | 1.26 | |
| `JobReadyPods` | `false` | 알파 | 1.23 | 1.23 |
| `JobReadyPods` | `true` | 베타 | 1.24 | |
| `JobTrackingWithFinalizers` | `false` | 알파 | 1.22 | 1.22 |
| `JobTrackingWithFinalizers` | `false` | 베타 | 1.23 | 1.24 |
| `JobTrackingWithFinalizers` | `true` | 베타 | 1.25 | |
| `KMSv2` | `false` | 알파 | 1.25 | |
| `KubeletInUserNamespace` | `false` | 알파 | 1.22 | |
| `KubeletPodResources` | `false` | 알파 | 1.13 | 1.14 |
| `KubeletPodResources` | `true` | 베타 | 1.15 | |
| `KubeletPodResourcesGetAllocatable` | `false` | 알파 | 1.21 | 1.22 |
| `KubeletPodResourcesGetAllocatable` | `true` | 베타 | 1.23 | |
| `KubeletTracing` | `false` | 알파 | 1.25 | |
| `LegacyServiceAccountTokenTracking` | `false` | 알파 | 1.26 | |
| `LocalStorageCapacityIsolationFSQuotaMonitoring` | `false` | 알파 | 1.15 | 1.24 |
| `LocalStorageCapacityIsolationFSQuotaMonitoring` | `true` | 베타 | 1.25 | |
| `LogarithmicScaleDown` | `false` | 알파 | 1.21 | 1.21 |
| `LogarithmicScaleDown` | `true` | 베타 | 1.22 | |
| `MatchLabelKeysInPodTopologySpread` | `false` | 알파 | 1.25 | |
| `MaxUnavailableStatefulSet` | `false` | 알파 | 1.24 | |
| `MemoryManager` | `false` | 알파 | 1.21 | 1.21 |
| `MemoryManager` | `true` | 베타 | 1.22 | |
| `MemoryQoS` | `false` | 알파 | 1.22 | |
| `MinDomainsInPodTopologySpread` | `false` | 알파 | 1.24 | 1.24 |
| `MinDomainsInPodTopologySpread` | `false` | 베타 | 1.25 | |
| `MixedProtocolLBService` | `false` | 알파 | 1.20 | 1.23 |
| `MixedProtocolLBService` | `true` | 베타 | 1.24 | |
| `MultiCIDRRangeAllocator` | `false` | 알파 | 1.25 | |
| `NetworkPolicyStatus` | `false` | 알파 | 1.24 |  |
| `NodeInclusionPolicyInPodTopologySpread` | `false` | 알파 | 1.25 | |
| `NodeOutOfServiceVolumeDetach` | `false` | 알파 | 1.24 | 1.25 |
| `NodeOutOfServiceVolumeDetach` | `true` | 베타 | 1.26 | |
| `NodeSwap` | `false` | 알파 | 1.22 | |
| `OpenAPIEnums` | `false` | 알파 | 1.23 | 1.23 |
| `OpenAPIEnums` | `true` | 베타 | 1.24 | |
| `OpenAPIV3` | `false` | 알파 | 1.23 | 1.23 |
| `OpenAPIV3` | `true` | 베타 | 1.24 | |
| `PDBUnhealthyPodEvictionPolicy` | `false` | 알파 | 1.26 | |
| `PodAndContainerStatsFromCRI` | `false` | 알파 | 1.23 | |
| `PodDeletionCost` | `false` | 알파 | 1.21 | 1.21 |
| `PodDeletionCost` | `true` | 베타 | 1.22 | |
| `PodDisruptionConditions` | `false` | 알파 | 1.25 | 1.25 |
| `PodDisruptionConditions` | `true` | 베타 | 1.26 | |
| `PodHasNetworkCondition` | `false` | 알파 | 1.25 | |
| `PodSchedulingReadiness` | `false` | 알파 | 1.26 | |
| `ProbeTerminationGracePeriod` | `false` | 알파 | 1.21 | 1.21 |
| `ProbeTerminationGracePeriod` | `false` | 베타 | 1.22 | 1.24 |
| `ProbeTerminationGracePeriod` | `true` | 베타 | 1.25 | |
| `ProcMountType` | `false` | 알파 | 1.12 | |
| `ProxyTerminatingEndpoints` | `false` | 알파 | 1.22 | 1.25 |
| `ProxyTerminatingEndpoints` | `true` | 베타 | 1.26 | |
| `QOSReserved` | `false` | 알파 | 1.11 | |
| `ReadWriteOncePod` | `false` | 알파 | 1.22 | |
| `RecoverVolumeExpansionFailure` | `false` | 알파 | 1.23 | |
| `RemainingItemCount` | `false` | 알파 | 1.15 | 1.15 |
| `RemainingItemCount` | `true` | 베타 | 1.16 | |
| `RetroactiveDefaultStorageClass` | `false` | 알파 | 1.25 | 1.25 |
| `RetroactiveDefaultStorageClass` | `true` | 베타 | 1.26 | |
| `RotateKubeletServerCertificate` | `false` | 알파 | 1.7 | 1.11 |
| `RotateKubeletServerCertificate` | `true` | 베타 | 1.12 | |
| `SELinuxMountReadWriteOncePod` | `false` | 알파 | 1.25 | |
| `SeccompDefault` | `false` | 알파 | 1.22 | 1.24 |
| `SeccompDefault` | `true` | 베타 | 1.25 | |
| `ServerSideFieldValidation` | `false` | 알파 | 1.23 | 1.24 |
| `ServerSideFieldValidation` | `true` | 베타 | 1.25 | |
| `SizeMemoryBackedVolumes` | `false` | 알파 | 1.20 | 1.21 |
| `SizeMemoryBackedVolumes` | `true` | 베타 | 1.22 | |
| `StatefulSetAutoDeletePVC` | `false` | 알파 | 1.22 | |
| `StatefulSetStartOrdinal` | `false` | 알파 | 1.26 | |
| `StorageVersionAPI` | `false` | 알파 | 1.20 | |
| `StorageVersionHash` | `false` | 알파 | 1.14 | 1.14 |
| `StorageVersionHash` | `true` | 베타 | 1.15 | |
| `TopologyAwareHints` | `false` | 알파 | 1.21 | 1.22 |
| `TopologyAwareHints` | `false` | 베타 | 1.23 | 1.23 |
| `TopologyAwareHints` | `true` | 베타 | 1.24 | |
| `TopologyManager` | `false` | 알파 | 1.16 | 1.17 |
| `TopologyManager` | `true` | 베타 | 1.18 | |
| `TopologyManagerPolicyAlphaOptions` | `false` | 알파 | 1.26 | |
| `TopologyManagerPolicyBetaOptions` | `false` | 베타 | 1.26 | |
| `TopologyManagerPolicyOptions` | `false` | 알파 | 1.26 | |
| `UserNamespacesStatelessPodsSupport` | `false` | 알파 | 1.25 | |
| `ValidatingAdmissionPolicy`          | `false` | 알파 | 1.26 | |
| `VolumeCapacityPriority` | `false` | 알파 | 1.21 | - |
| `WinDSR` | `false` | 알파 | 1.14 | |
| `WinOverlay` | `false` | 알파 | 1.14 | 1.19 |
| `WinOverlay` | `true` | 베타 | 1.20 | |
| `WindowsHostNetwork` | `false` | 알파 | 1.26| |
{{< /table >}}

### 승급 또는 사용 중단된 기능을 위한 기능 게이트

{{< table caption="승급 또는 사용 중단 기능을 위한 기능 게이트" >}}

| 기능     | 디폴트    | 단계   | 도입   | 종료   |
|---------|---------|-------|-------|-------|
| `AdvancedAuditing` | `false` | 알파 | 1.7 | 1.7 |
| `AdvancedAuditing` | `true` | 베타 | 1.8 | 1.11 |
| `AdvancedAuditing` | `true` | GA | 1.12 | - |
| `CPUManager` | `false` | 알파 | 1.8 | 1.9 |
| `CPUManager` | `true` | 베타 | 1.10 | 1.25 |
| `CPUManager` | `true` | GA | 1.26 | - |
| `CSIInlineVolume` | `false` | 알파 | 1.15 | 1.15 |
| `CSIInlineVolume` | `true` | 베타 | 1.16 | 1.24 |
| `CSIInlineVolume` | `true` | GA | 1.25 | - |
| `CSIMigration` | `false` | 알파 | 1.14 | 1.16 |
| `CSIMigration` | `true` | 베타 | 1.17 | 1.24 |
| `CSIMigration` | `true` | GA | 1.25 | - |
| `CSIMigrationAWS` | `false` | 알파 | 1.14 | 1.16 |
| `CSIMigrationAWS` | `false` | 베타 | 1.17 | 1.22 |
| `CSIMigrationAWS` | `true` | 베타 | 1.23 | 1.24 |
| `CSIMigrationAWS` | `true` | GA | 1.25 | - |
| `CSIMigrationAzureDisk` | `false` | 알파 | 1.15 | 1.18 |
| `CSIMigrationAzureDisk` | `false` | 베타 | 1.19 | 1.22 |
| `CSIMigrationAzureDisk` | `true` | 베타 | 1.23 | 1.23 |
| `CSIMigrationAzureDisk` | `true` | GA | 1.24 | |
| `CSIMigrationAzureFile` | `false` | 알파 | 1.15 | 1.20 |
| `CSIMigrationAzureFile` | `false` | 베타 | 1.21 | 1.23 |
| `CSIMigrationAzureFile` | `true` | 베타 | 1.24 | 1.25 |
| `CSIMigrationAzureFile` | `true` | GA | 1.26 | |
| `CSIMigrationGCE` | `false` | 알파 | 1.14 | 1.16 |
| `CSIMigrationGCE` | `false` | 베타 | 1.17 | 1.22 |
| `CSIMigrationGCE` | `true` | 베타 | 1.23 | 1.24 |
| `CSIMigrationGCE` | `true` | GA | 1.25 | - |
| `CSIMigrationvSphere` | `false` | 알파 | 1.18 | 1.18 |
| `CSIMigrationvSphere` | `false` | 베타 | 1.19 | 1.24 |
| `CSIMigrationvSphere` | `true` | 베타 | 1.25 | 1.25 |
| `CSIMigrationvSphere` | `true` | GA | 1.26 | - |
| `CSIMigrationOpenStack` | `false` | 알파 | 1.14 | 1.17 |
| `CSIMigrationOpenStack` | `true` | 베타 | 1.18 | 1.23 |
| `CSIMigrationOpenStack` | `true` | GA | 1.24 | |
| `CSIStorageCapacity` | `false` | 알파 | 1.19 | 1.20 |
| `CSIStorageCapacity` | `true` | 베타 | 1.21 | 1.23 |
| `CSIStorageCapacity` | `true` | GA | 1.24 | - |
| `ControllerManagerLeaderMigration` | `false` | 알파 | 1.21 | 1.21 |
| `ControllerManagerLeaderMigration` | `true` | 베타 | 1.22 | 1.23 |
| `ControllerManagerLeaderMigration` | `true` | GA | 1.24 | - |
| `CronJobTimeZone` | `false` | 알파 | 1.24 | 1.24 |
| `CronJobTimeZone` | `true` | 베타 | 1.25 | |
| `DaemonSetUpdateSurge` | `false` | 알파 | 1.21 | 1.21 |
| `DaemonSetUpdateSurge` | `true` | 베타 | 1.22 | 1.24 |
| `DaemonSetUpdateSurge` | `true` | GA | 1.25 | - |
| `DefaultPodTopologySpread` | `false` | 알파 | 1.19 | 1.19 |
| `DefaultPodTopologySpread` | `true` | 베타 | 1.20 | 1.23 |
| `DefaultPodTopologySpread` | `true` | GA | 1.24 | - |
| `DelegateFSGroupToCSIDriver` | `false` | 알파 | 1.22 | 1.22 |
| `DelegateFSGroupToCSIDriver` | `true` | 베타 | 1.23 | 1.25 |
| `DelegateFSGroupToCSIDriver` | `true` | GA | 1.26 |-|
| `DisableAcceleratorUsageMetrics` | `false` | 알파 | 1.19 | 1.19 |
| `DisableAcceleratorUsageMetrics` | `true` | 베타 | 1.20 | 1.24 |
| `DisableAcceleratorUsageMetrics` | `true` | GA | 1.25 |- |
| `DevicePlugins` | `false` | 알파 | 1.8 | 1.9 |
| `DevicePlugins` | `true` | 베타 | 1.10 | 1.25 |
| `DevicePlugins` | `true` | GA | 1.26 | - |
| `DryRun` | `false` | 알파 | 1.12 | 1.12 |
| `DryRun` | `true` | 베타 | 1.13 | 1.18 |
| `DryRun` | `true` | GA | 1.19 | - |
| `DynamicKubeletConfig` | `false` | 알파 | 1.4 | 1.10 |
| `DynamicKubeletConfig` | `true` | 베타 | 1.11 | 1.21 |
| `DynamicKubeletConfig` | `false` | Deprecated | 1.22 | - |
| `EfficientWatchResumption` | `false` | 알파 | 1.20 | 1.20 |
| `EfficientWatchResumption` | `true` | 베타 | 1.21 | 1.23 |
| `EfficientWatchResumption` | `true` | GA | 1.24 | - |
| `EphemeralContainers` | `false` | 알파 | 1.16 | 1.22 |
| `EphemeralContainers` | `true` | 베타 | 1.23 | 1.24 |
| `EphemeralContainers` | `true` | GA | 1.25 | - |
| `EventedPLEG` | `false` | 알파 | 1.26 | - |
| `ExecProbeTimeout` | `true` | GA | 1.20 | - |
| `ExpandCSIVolumes` | `false` | 알파 | 1.14 | 1.15 |
| `ExpandCSIVolumes` | `true` | 베타 | 1.16 | 1.23 |
| `ExpandCSIVolumes` | `true` | GA | 1.24 | - |
| `ExpandInUsePersistentVolumes` | `false` | 알파 | 1.11 | 1.14 |
| `ExpandInUsePersistentVolumes` | `true` | 베타 | 1.15 | 1.23 |
| `ExpandInUsePersistentVolumes` | `true` | GA | 1.24 | - |
| `ExpandPersistentVolumes` | `false` | 알파 | 1.8 | 1.10 |
| `ExpandPersistentVolumes` | `true` | 베타 | 1.11 | 1.23 |
| `ExpandPersistentVolumes` | `true` | GA | 1.24 |- |
| `IdentifyPodOS` | `false` | 알파 | 1.23 | 1.23 |
| `IdentifyPodOS` | `true` | 베타 | 1.24 | 1.24 |
| `IdentifyPodOS` | `true` | GA | 1.25 | - |
| `IndexedJob` | `false` | 알파 | 1.21 | 1.21 |
| `IndexedJob` | `true` | 베타 | 1.22 | 1.23 |
| `IndexedJob` | `true` | GA | 1.24 | - |
| `JobTrackingWithFinalizers` | `false` | 알파 | 1.22 | 1.22 |
| `JobTrackingWithFinalizers` | `false` | 베타 | 1.23 | 1.24 |
| `JobTrackingWithFinalizers` | `true` | 베타 | 1.25 | 1.25 |
| `JobTrackingWithFinalizers` | `true` | GA | 1.26 | - |
| `KubeletCredentialProviders` | `false` | 알파 | 1.20 | 1.23 |
| `KubeletCredentialProviders` | `true` | 베타 | 1.24 | 1.25 |
| `KubeletCredentialProviders` | `true` | GA | 1.26 | - |
| `LegacyServiceAccountTokenNoAutoGeneration` | `true` | 베타 | 1.24 | 1.25 |
| `LegacyServiceAccountTokenNoAutoGeneration` | `true` | GA | 1.26 | - |
| `LocalStorageCapacityIsolation` | `false` | 알파 | 1.7 | 1.9 |
| `LocalStorageCapacityIsolation` | `true` | 베타 | 1.10 | 1.24 |
| `LocalStorageCapacityIsolation` | `true` | GA | 1.25 | - |
| `NetworkPolicyEndPort` | `false` | 알파 | 1.21 | 1.21 |
| `NetworkPolicyEndPort` | `true` | 베타 | 1.22 | 1.24 |
| `NetworkPolicyEndPort` | `true` | GA | 1.25 | - |
| `NonPreemptingPriority` | `false` | 알파 | 1.15 | 1.18 |
| `NonPreemptingPriority` | `true` | 베타 | 1.19 | 1.23 |
| `NonPreemptingPriority` | `true` | GA | 1.24 | - |
| `PodAffinityNamespaceSelector` | `false` | 알파 | 1.21 | 1.21 |
| `PodAffinityNamespaceSelector` | `true` | 베타 | 1.22 | 1.23 |
| `PodAffinityNamespaceSelector` | `true` | GA | 1.24 | - |
| `PodSecurity` | `false` | 알파 | 1.22 | 1.22 |
| `PodSecurity` | `true` | 베타 | 1.23 | 1.24 |
| `PodSecurity` | `true` | GA | 1.25 | |
| `PreferNominatedNode` | `false` | 알파 | 1.21 | 1.21 |
| `PreferNominatedNode` | `true` | 베타 | 1.22 | 1.23 |
| `PreferNominatedNode` | `true` | GA | 1.24 | - |
| `RemoveSelfLink` | `false` | 알파 | 1.16 | 1.19 |
| `RemoveSelfLink` | `true` | 베타 | 1.20 | 1.23 |
| `RemoveSelfLink` | `true` | GA | 1.24 | - |
| `ServerSideApply` | `false` | 알파 | 1.14 | 1.15 |
| `ServerSideApply` | `true` | 베타 | 1.16 | 1.21 |
| `ServerSideApply` | `true` | GA | 1.22 | - |
| `ServiceInternalTrafficPolicy` | `false` | 알파 | 1.21 | 1.21 |
| `ServiceInternalTrafficPolicy` | `true` | 베타 | 1.22 | 1.25 |
| `ServiceInternalTrafficPolicy` | `true` | GA | 1.26 | - |
| `ServiceIPStaticSubrange` | `false` | 알파 | 1.24 | 1.24 |
| `ServiceIPStaticSubrange` | `true` | 베타 | 1.25 | 1.25 |
| `ServiceIPStaticSubrange` | `true` | GA | 1.26 | - |
| `ServiceLBNodePortControl` | `false` | 알파 | 1.20 | 1.21 |
| `ServiceLBNodePortControl` | `true` | 베타 | 1.22 | 1.23 |
| `ServiceLBNodePortControl` | `true` | GA | 1.24 | - |
| `ServiceLoadBalancerClass` | `false` | 알파 | 1.21 | 1.21 |
| `ServiceLoadBalancerClass` | `true` | 베타 | 1.22 | 1.23 |
| `ServiceLoadBalancerClass` | `true` | GA | 1.24 | - |
| `StatefulSetMinReadySeconds` | `false` | 알파 | 1.22 | 1.22 |
| `StatefulSetMinReadySeconds` | `true` | 베타 | 1.23 | 1.24 |
| `StatefulSetMinReadySeconds` | `true` | GA | 1.25 | - |
| `SuspendJob` | `false` | 알파 | 1.21 | 1.21 |
| `SuspendJob` | `true` | 베타 | 1.22 | 1.23 |
| `SuspendJob` | `true` | GA | 1.24 | - |
| `WatchBookmark` | `false` | 알파 | 1.15 | 1.15 |
| `WatchBookmark` | `true` | 베타 | 1.16 | 1.16 |
| `WatchBookmark` | `true` | GA | 1.17 | - |
| `WindowsHostProcessContainers` | `false` | 알파 | 1.22 | 1.22 |
| `WindowsHostProcessContainers` | `true` | 베타 | 1.23 | 1.25 |
| `WindowsHostProcessContainers` | `true` | GA | 1.26 | - |
{{< /table >}}

## 기능 사용

### 기능 단계

기능은 *알파*, *베타* 또는 *GA* 단계일 수 있다.
*알파* 기능은 다음을 의미한다.

* 기본적으로 비활성화되어 있다.
* 버그가 있을 수 있다. 이 기능을 사용하면 버그에 노출될 수 있다.
* 기능에 대한 지원은 사전 통지없이 언제든지 중단될 수 있다.
* API는 이후 소프트웨어 릴리스에서 예고없이 호환되지 않는 방식으로 변경될 수 있다.
* 버그의 위험이 증가하고 장기 지원이 부족하여, 단기 테스트
  클러스터에서만 사용하는 것이 좋다.

*베타* 기능은 다음을 의미한다.

* 기본적으로 활성화되어 있다.
* 이 기능은 잘 테스트되었다. 이 기능을 활성화하면 안전한 것으로 간주된다.
* 세부 내용은 변경될 수 있지만, 전체 기능에 대한 지원은 중단되지 않는다.
* 오브젝트의 스키마 및/또는 시맨틱은 후속 베타 또는 안정 릴리스에서
  호환되지 않는 방식으로 변경될 수 있다. 이러한 상황이 발생하면, 다음 버전으로 마이그레이션하기 위한
  지침을 제공한다. API 오브젝트를 삭제, 편집 및 재작성해야
  할 수도 있다. 편집 과정에서 약간의 생각이 필요할 수 있다.
 해당 기능에 의존하는 애플리케이션의 경우 다운타임이 필요할 수 있다.
* 후속 릴리스에서 호환되지 않는 변경이 발생할 수 있으므로
  업무상 중요하지 않은(non-business-critical) 용도로만
  권장한다. 독립적으로 업그레이드할 수 있는 여러 클러스터가 있는 경우, 이 제한을 완화할 수 있다.

{{< note >}}
*베타* 기능을 사용해 보고 의견을 보내주길 바란다!
베타 기간이 종료된 후에는, 더 많은 변경을 하는 것이 실용적이지 않을 수 있다.
{{< /note >}}

*GA*(General Availability) 기능은 *안정* 기능이라고도 한다. 이 의미는 다음과 같다.

* 이 기능은 항상 활성화되어 있다. 비활성화할 수 없다.
* 해당 기능 게이트는 더 이상 필요하지 않다.
* 여러 후속 버전의 릴리스된 소프트웨어에 안정적인 기능의 버전이 포함된다.

## 기능 게이트 목록 {#feature-gates}

각 기능 게이트는 특정 기능을 활성화/비활성화하도록 설계되었다.

- `APIListChunking`: API 클라이언트가 API 서버에서 (`LIST` 또는 `GET`)
  리소스를 청크(chunks)로 검색할 수 있도록 한다.
- `APIPriorityAndFairness`: 각 서버의 우선 순위와 공정성을 통해 동시 요청을
  관리할 수 있다. (`RequestManagement` 에서 이름이 변경됨)
- `APIResponseCompression`: `LIST` 또는 `GET` 요청에 대한 API 응답을 압축한다.
- `APIServerIdentity`: 클러스터의 각 API 서버에 ID를 할당한다.
- `APIServerTracing`: API 서버에서 분산 추적(tracing)에 대한 지원을 추가한다.
  자세한 내용은 [쿠버네티스 시스템 컴포넌트에 대한 추적](/ko/docs/concepts/cluster-administration/system-traces/)페이지를 살펴본다.
- `APISelfSubjectAttributesReview`: 사용자로 하여금 요청을 하는 주체(subject)의 
  인증 정보를 볼 수 있도록 하는 `SelfSubjectReview` API를 활성화한다. 
  더 자세한 정보는 [클라이언트로서의 인증 정보 API 접근](/docs/reference/access-authn-authz/authentication/#self-subject-review)을 
  확인한다.
- `AdvancedAuditing`: [고급 감사](/ko/docs/tasks/debug/debug-cluster/audit/#advanced-audit) 기능을 활성화한다.
- `AllowInsecureBackendProxy`: 사용자가 파드 로그 요청에서 kubelet의
  TLS 확인을 건너뛸 수 있도록 한다.
- `AnyVolumeDataSource`: {{< glossary_tooltip text="PVC" term_id="persistent-volume-claim" >}}의
  `DataSource` 로 모든 사용자 정의 리소스 사용을 활성화한다.
- `AppArmor`: 리눅스 노드에서 실행되는 파드에 대한 AppArmor 필수 접근 제어의 사용을 활성화한다.
  자세한 내용은 [AppArmor 튜토리얼](/ko/docs/tutorials/security/apparmor/)을 참고한다.
- `ContainerCheckpoint`: kubelet의 `체크포인트` API를 활성화한다.
  자세한 내용은 [kubelet 체크포인트 API](/ko/docs/reference/node/kubelet-checkpoint-api/)를 확인한다.
- `ControllerManagerLeaderMigration`: HA 클러스터에서 클러스터 오퍼레이터가
  kube-controller-manager의 컨트롤러들을 외부 controller-manager(예를 들면,
  cloud-controller-manager)로 다운타임 없이 라이브 마이그레이션할 수 있도록 허용하도록
  [kube-controller-manager](/docs/tasks/administer-cluster/controller-manager-leader-migration/#initial-leader-migration-configuration)와
  [cloud-controller-manager](/docs/tasks/administer-cluster/controller-manager-leader-migration/#deploy-cloud-controller-manager)의
  리더 마이그레이션(Leader Migration)을 활성화한다.
- `CPUManager`: 컨테이너 수준의 CPU 어피니티 지원을 활성화한다.
  [CPU 관리 정책](/docs/tasks/administer-cluster/cpu-management-policies/)을 참고한다.
- `CPUManagerPolicyAlphaOptions`: CPUManager 정책 중 실험적이며 알파 품질인 옵션의
  미세 조정을 허용한다.
  이 기능 게이트는 품질 수준이 알파인 CPUManager 옵션의 *그룹*을 보호한다.
  이 기능 게이트는 베타 또는 안정(stable) 상태로 승급되지 않을 것이다.
- `CPUManagerPolicyBetaOptions`: CPUManager 정책 중 실험적이며 베타 품질인 옵션의
  미세 조정을 허용한다.
  이 기능 게이트는 품질 수준이 베타인 CPUManager 옵션의 *그룹*을 보호한다.
  이 기능 게이트는 안정(stable) 상태로 승급되지 않을 것이다.
- `CPUManagerPolicyOptions`: CPUManager 정책의 미세 조정을 허용한다.
- `CrossNamespaceVolumeDataSource`: 네임스페이스간 볼륨 데이터 소스 사용 기능을 
  활성화하며, 퍼시스턴트볼륨클레임의 `dataSourceRef` 필드에 소스 네임스페이스를 
  기재할 수 있게 된다.
- `CSIInlineVolume`: 파드에 대한 CSI 인라인 볼륨 지원을 활성화한다.
- `CSIMigration`: shim 및 변환 로직을 통해 볼륨 작업을 인-트리 플러그인에서
  사전 설치된 해당 CSI 플러그인으로 라우팅할 수 있다.
- `CSIMigrationAWS`: shim 및 변환 로직을 통해 볼륨 작업을
  AWS-EBS 인-트리 플러그인에서 EBS CSI 플러그인으로 라우팅할 수 있다.
  이 기능이 비활성화되어 있거나 EBS CSI 플러그인이 설치 및 구성되어 있지 않은 노드에서의 마운트 동작에 대해
  인-트리 EBS 플러그인으로의 폴백(falling back)을 지원한다.
  프로비전 동작에 대해서는 폴백을 지원하지 않는데,
  프로비전 동작은 해당 CSI 플러그인이 설치 및 구성되어 있어야 가능하기 때문이다.
- `CSIMigrationAzureDisk`: shim 및 변환 로직을 통해 볼륨 작업을
  Azure-Disk 인-트리 플러그인에서 AzureDisk CSI 플러그인으로 라우팅할 수 있다.
  이 기능이 비활성화되어 있거나 AzureDisk CSI 플러그인이 설치 및 구성되어 있지 않은 노드에서의 마운트 동작에 대해
  인-트리 AzureDisk 플러그인으로의 폴백(falling back)을 지원한다.
  프로비전 동작에 대해서는 폴백을 지원하지 않는데,
  프로비전 동작은 해당 CSI 플러그인이 설치 및 구성되어 있어야 가능하기 때문이다.
  이 기능을 사용하려면 CSIMigration 기능 플래그가 활성화되어 있어야 한다.
- `CSIMigrationAzureFile`: shim 및 변환 로직을 통해 볼륨 작업을
  Azure-File 인-트리 플러그인에서 AzureFile CSI 플러그인으로 라우팅할 수 있다.
  이 기능이 비활성화되어 있거나 AzureFile CSI 플러그인이 설치 및 구성되어 있지 않은 노드에서의 마운트 동작에 대해
  인-트리 AzureFile 플러그인으로의 폴백(falling back)을 지원한다.
  프로비전 동작에 대해서는 폴백을 지원하지 않는데,
  프로비전 동작은 해당 CSI 플러그인이 설치 및 구성되어 있어야 가능하기 때문이다.
  이 기능을 사용하려면 CSIMigration 기능 플래그가 활성화되어 있어야 한다.
- `CSIMigrationGCE`: shim 및 변환 로직을 통해 볼륨 작업을
  GCE-PD 인-트리 플러그인에서 PD CSI 플러그인으로 라우팅할 수 있다.
  이 기능이 비활성화되어 있거나 PD CSI 플러그인이 설치 및 구성되어 있지 않은 노드에서의 마운트 동작에 대해
  인-트리 GCE 플러그인으로의 폴백(falling back)을 지원한다.
  프로비전 동작에 대해서는 폴백을 지원하지 않는데,
  프로비전 동작은 해당 CSI 플러그인이 설치 및 구성되어 있어야 가능하기 때문이다.
  이 기능을 사용하려면 CSIMigration 기능 플래그가 활성화되어 있어야 한다.
- `CSIMigrationOpenStack`: shim 및 변환 로직을 통해 볼륨 작업을
  Cinder 인-트리 플러그인에서 Cinder CSI 플러그인으로 라우팅할 수 있다.
  이 기능이 비활성화되어 있거나 Cinder CSI 플러그인이 설치 및 구성되어 있지 않은 노드에서의 마운트 동작에 대해
  인-트리 Cinder 플러그인으로의 폴백(falling back)을 지원한다.
  프로비전 동작에 대해서는 폴백을 지원하지 않는데,
  프로비전 동작은 해당 CSI 플러그인이 설치 및 구성되어 있어야 가능하기 때문이다.
  이 기능을 사용하려면 CSIMigration 기능 플래그가 활성화되어 있어야 한다.
- `csiMigrationRBD`: RBD 트리 내(in-tree) 플러그인으로 가는 볼륨 작업을
  Ceph RBD CSI 플러그인으로 라우트하는 심(shim)과 변환 로직을 활성화한다.
  클러스터에 CSIMigration 및 csiMigrationRBD 기능 플래그가 활성화되어 있어야 하고,
  Ceph CSI 플러그인이 설치 및 설정되어 있어야 한다.
  이 플래그는 트리 내(in-tree) RBD 플러그인 등록을 금지시키는 `InTreePluginRBDUnregister` 기능 플래그에 의해
  사용 중단되었다.
- `CSIMigrationvSphere`: vSphere 인-트리 플러그인에서 vSphere CSI 플러그인으로 볼륨 작업을
  라우팅하는 shim 및 변환 로직을 사용한다.
  이 기능이 비활성화되어 있거나 vSphere CSI 플러그인이 설치 및 구성되어 있지 않은 노드에서의 마운트 동작에 대해
  인-트리 vSphere 플러그인으로의 폴백(falling back)을 지원한다.
  프로비전 동작에 대해서는 폴백을 지원하지 않는데,
  프로비전 동작은 해당 CSI 플러그인이 설치 및 구성되어 있어야 가능하기 때문이다.
  이 기능을 사용하려면 CSIMigration 기능 플래그가 활성화되어 있어야 한다.
- `CSIMigrationPortworx`: Portworx 트리 내(in-tree) 플러그인으로 가는 볼륨 작업을
  Portworx CSI 플러그인으로 라우트하는 심(shim)과 변환 로직을 활성화한다.
  Portworx CSI 드라이버가 설치 및 설정되어 있어야 한다.
- `CSINodeExpandSecret`: CSI 드라이버가 `NodeExpandVolume` 작업 수행 중에 사용할 수 있도록
   시크릿 인증 데이터를 드라이버에 전송 가능하게 한다.
- `CSIStorageCapacity`: CSI 드라이버가 스토리지 용량 정보를 게시하고
  쿠버네티스 스케줄러가 파드를 스케줄할 때 해당 정보를 사용하도록 한다.
  [스토리지 용량](/ko/docs/concepts/storage/storage-capacity/)을 참고한다.
  자세한 내용은 [`csi` 볼륨 유형](/ko/docs/concepts/storage/volumes/#csi) 문서를 확인한다.
- `CSIVolumeHealth`: 노드에서의 CSI 볼륨 상태 모니터링 기능을 활성화한다.
- `ContextualLogging`: 이 기능을 활성화하면,
  컨텍스츄얼 로깅을 지원하는 쿠버네티스 구성 요소가 로그 출력에 추가 상세를 추가한다.
- `ControllerManagerLeaderMigration`: `kube-controller-manager` 및 `cloud-controller-manager`에
  대한 리더 마이그레이션을 지원한다.
- `CronJobTimeZone`: [크론잡](/ko/docs/concepts/workloads/controllers/cron-jobs/)의 선택적 `timeZone` 필드 사용을 허용한다.
- `CustomCPUCFSQuotaPeriod`: [kubelet config](/docs/tasks/administer-cluster/kubelet-config-file/)에서
  `cpuCFSQuotaPeriod` 를 노드가 변경할 수 있도록 한다.
- `CustomResourceValidationExpressions`: `x-kubernetes-validations` 확장 기능으로 작성된
  검증 규칙을 기반으로 커스텀 리소스를 검증하는
  표현 언어 검증(expression language validation)을 CRD에 활성화한다.
- `DaemonSetUpdateSurge`: 노드당 업데이트 중 가용성을 유지하도록
  데몬셋 워크로드를 사용하도록 설정한다.
  [데몬셋에서 롤링 업데이트 수행](/ko/docs/tasks/manage-daemon/update-daemon-set/)을 참고한다.
- `DefaultPodTopologySpread`: `PodTopologySpread` 스케줄링 플러그인을 사용하여
  [기본 분배](/ko/docs/concepts/scheduling-eviction/topology-spread-constraints/#내부-기본-제약)를 수행한다.
- `DelegateFSGroupToCSIDriver`: CSI 드라이버가 지원할 경우, NodeStageVolume 및 NodePublishVolume CSI 호출을 통해
  `fsGroup`를 전달하여 파드의 `securityContext`에서
  `fsGroup`를 드라이브에 적용하는 역할을 위임한다.
- `DevicePlugins`: 노드에서 [장치 플러그인](/ko/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
  기반 리소스 프로비저닝을 활성화한다.
- `DisableAcceleratorUsageMetrics`:
  [kubelet이 수집한 액셀러레이터 지표 비활성화](/ko/docs/concepts/cluster-administration/system-metrics/#액셀러레이터-메트릭-비활성화).
- `DisableCloudProviders`: `kube-apiserver`,  `kube-controller-manager`,
  `--cloud-provider` 컴포넌트 플래그와 관련된 `kubelet`의
  모든 기능을 비활성화한다.
- `DisableKubeletCloudCredentialProviders`: 이미지 풀 크리덴셜을 위해
  클라우드 프로바이더 컨테이너 레지스트리에 인증을 수행하는 kubelet 내부(in-tree) 기능을 비활성화한다.
- `DownwardAPIHugePages`: [다운워드 API](/ko/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/)에서
  hugepages 사용을 활성화한다.
- `DryRun`: 서버 측의 [dry run](/docs/reference/using-api/api-concepts/#dry-run) 요청을
  요청을 활성화하여 커밋하지 않고 유효성 검사, 병합 및 변화를 테스트할 수 있다.
- `DynamicKubeletConfig`: kubelet의 동적 구성을 활성화한다.
  이 기능은 지원하는 버전 차이(supported skew policy) 바깥에서는 더 이상 지원되지 않는다.
  이 기능 게이트는 1.24에 kubelet에서 제거되었다. [kubelet 재구성하기](/docs/tasks/administer-cluster/reconfigure-kubelet/)를 참고한다.
- `EndpointSliceTerminatingCondition`: 엔드포인트슬라이스 `terminating` 및 `serving`
  조건 필드를 활성화한다.
- `EfficientWatchResumption`: 스토리지에서 생성된 북마크(진행 알림) 이벤트를 
  사용자에게 전달할 수 있다. 이것은 감시 작업에만 적용된다.
- `EphemeralContainers`: 파드를 실행하기 위한
  {{< glossary_tooltip text="임시 컨테이너" term_id="ephemeral-container" >}}를
  추가할 수 있다.
- `EventedPLEG`: kubelet이 {{<glossary_tooltip term_id="cri" text="CRI">}}에 대한 
  확장(extension)을 통해 {{< glossary_tooltip text="컨테이너 런타임" term_id="container-runtime" >}}으로부터 
  컨테이너 라이프사이클 이벤트를 받을 수 있는 기능을 
  활성화한다(PLEG는 “Pod lifecycle event generator”의 약자). 
  이 기능이 효과적이려면, 
  클러스터에서 실행되는 각 컨테이너 런타임의 컨테이너 라이프사이클 이벤트 기능도 활성화해야 한다. 
  컨테이너 런타임이 컨테이너 라이프사이클 이벤트 지원 여부를 옥시하지 않으면, 
  kubelet은 이 기능 게이트가 활성화되어 있더라도 자동으로 기존(legacy) 일반 PLEG 메커니즘으로 전환한다.
- `ExecProbeTimeout` : kubelet이 exec 프로브 시간 초과를 준수하는지 확인한다.
  이 기능 게이트는 기존 워크로드가 쿠버네티스가 exec 프로브 제한 시간을 무시한
  현재 수정된 결함에 의존하는 경우 존재한다.
  [준비성 프로브](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes)를 참조한다.
- `ExpandCSIVolumes`: CSI 볼륨 확장을 활성화한다.
- `ExpandedDNSConfig`: 더 많은 DNS 검색 경로와 더 긴 DNS 검색 경로 목록을 허용하려면
  kubelet과 kube-apiserver를 사용하도록 설정한다.
  이 기능을 사용하려면 컨테이너 런타임이 지원해야 한다(Containerd: v1.5.6 이상, CRI-O: v1.22 이상).
  [확장된 DNS 구성](/ko/docs/concepts/services-networking/dns-pod-service/#확장된-dns-환경-설정)을 참고한다.
- `ExpandInUsePersistentVolumes`: 사용 중인 PVC를 확장할 수 있다.
  [사용 중인 퍼시스턴트볼륨클레임 크기 조정](/ko/docs/concepts/storage/persistent-volumes/#사용-중인-퍼시스턴트볼륨클레임-크기-조정)을 참고한다.
- `ExpandPersistentVolumes`: 퍼시스턴트 볼륨 확장을 활성화한다.
  [퍼시스턴트 볼륨 클레임 확장](/ko/docs/concepts/storage/persistent-volumes/#퍼시스턴트-볼륨-클레임-확장)을 참고한다.
- `ExperimentalHostUserNamespaceDefaulting`: 사용자 네임스페이스를 호스트로
  기본 활성화한다. 이것은 다른 호스트 네임스페이스, 호스트 마운트,
  권한이 있는 컨테이너 또는 특정 비-네임스페이스(non-namespaced) 기능(예: `MKNODE`, `SYS_MODULE` 등)을
  사용하는 컨테이너를 위한 것이다. 도커 데몬에서 사용자 네임스페이스
  재 매핑이 활성화된 경우에만 활성화해야 한다.
- `GracefulNodeShutdown` : kubelet에서 정상 종료를 지원한다.
  시스템 종료 중에 kubelet은 종료 이벤트를 감지하고 노드에서 실행 중인
  파드를 정상적으로 종료하려고 시도한다. 자세한 내용은
  [Graceful Node Shutdown](/ko/docs/concepts/architecture/nodes/#그레이스풀-graceful-노드-셧다운)을
  참조한다.
- `GracefulNodeShutdownBasedOnPodPriority`: 그레이스풀(graceful) 노드 셧다운을 할 때
  kubelet이 파드 우선순위를 체크할 수 있도록 활성화한다.
- `GRPCContainerProbe`: 활성 프로브(Liveness Probe), 준비성 프로브(Readiness Probe), 스타트업 프로브(Startup Probe)에 대해 gRPC 프로브를 활성화한다.
  [활성/준비성/스타트업 프로브 구성하기](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-grpc-liveness-probe)를 참조한다.
- `HonorPVReclaimPolicy`: 퍼시스턴트 볼륨 회수 정책이 `Delete`인 경우 PV-PVC 삭제 순서와 상관없이 정책을 준수한다.
  더 자세한 정보는
  [퍼시스턴트볼륨 삭제 보호 파이널라이저(finalizer)](/ko/docs/concepts/storage/persistent-volumes/#persistentvolume-deletion-protection-finalizer) 문서를
  참고한다.
- `HPAContainerMetrics`: `HorizontalPodAutoscaler` 를 활성화하여 대상 파드의
  개별 컨테이너 메트릭을 기반으로 확장한다.
- `HPAScaleToZero`: 사용자 정의 또는 외부 메트릭을 사용할 때 `HorizontalPodAutoscaler` 리소스에 대해
  `minReplicas` 를 0으로 설정한다.
- `IPTablesOwnershipCleanup`: 이를 활성화하면 kubelet이 더 이상 레거시 IPTables 규칙을 만들지 않는다.
- `IdentifyPodOS`: 파드 OS 필드를 지정할 수 있게 한다.
  이를 통해 API 서버 관리 시 파드의 OS를 정석적인 방법으로 알 수 있다.
  쿠버네티스 {{< skew currentVersion >}}에서,
  `pod.spec.os.name` 에 사용할 수 있는 값은 `windows` 와 `linux` 이다.
- `IndexedJob`: [잡](/ko/docs/concepts/workloads/controllers/job/) 컨트롤러가 파드 완료(completion)를
  완료 인덱스에 따라 관리할 수 있도록 허용한다.
- `InTreePluginAWSUnregister`: kubelet 및 볼륨 컨트롤러에 aws-ebs 인-트리
  플러그인의 등록을 중지한다.
- `InTreePluginAzureDiskUnregister`: kubelet 및 볼륨 컨트롤러에 azuredisk 인-트리
  플러그인의 등록을 중지한다.
- `InTreePluginAzureFileUnregister`: kubelet 및 볼륨 컨트롤러에 azurefile 인-트리
  플러그인의 등록을 중지한다.
- `InTreePluginGCEUnregister`: kubelet 및 볼륨 컨트롤러에 gce-pd 인-트리
  플러그인의 등록을 중지한다.
- `InTreePluginOpenStackUnregister`: kubelet 및 볼륨 컨트롤러에 오픈스택 cinder 인-트리
  플러그인의 등록을 중지한다.
- `InTreePluginPortworxUnregister`: kubelet 및 볼륨 컨트롤러에 Portworx 인-트리
  플러그인의 등록을 중지한다.
- `InTreePluginRBDUnregister`: kubelet 및 볼륨 컨트롤러에 RBD 인-트리
  플러그인의 등록을 중지한다.
- `InTreePluginvSphereUnregister`: kubelet 및 볼륨 컨트롤러에 vSphere 인-트리
  플러그인의 등록을 중지한다.
- `JobMutableNodeSchedulingDirectives`: [잡](/ko/docs/concepts/workloads/controllers/job/)의
  파드 템플릿에 있는 노드 스케줄링 지시를 업데이트할 수 있게 한다.
- `JobPodFailurePolicy`: 사용자가 컨테이너의 종료 코드나 파드 상태에 따라 
  파드의 장애를 처리할 수 있도록 한다.
- `JobReadyPods`: 파드 [컨디션](/ko/docs/concepts/workloads/pods/pod-lifecycle/#파드의-컨디션)이
  `Ready`인 파드의 수를 추적하는 기능을 활성화한다.
  `Ready`인 파드의 수는 [잡](/ko/docs/concepts/workloads/controllers/job/) 상태의
  [status](/docs/reference/kubernetes-api/workload-resources/job-v1/#JobStatus)
  필드에 기록된다.
- `JobTrackingWithFinalizers`: 클러스터에 무제한으로 남아 있는 파드에 의존하지 않고
  [잡](/ko/docs/concepts/workloads/controllers/job)의 완료를 추적할 수 있다.
  잡 컨트롤러는 완료된 파드를 추적하기 위해
  완료된 파드의 잡 상태 필드를 사용한다.
- `KMSv2`: 저장 데이터 암호화(encryption at rest)를 위한 KMS v2 API를 활성화한다. 더 자세한 정보는 [KMS 공급자를 사용하여 데이터 암호화하기](/docs/tasks/administer-cluster/kms-provider/)를 참고한다.
- `KubeletCredentialProviders`: 이미지 풀 자격 증명에 대해
  kubelet exec 자격 증명 공급자를 활성화한다.
- `KubeletInUserNamespace`: {{<glossary_tooltip text="user namespace" term_id="userns">}}에서
  kubelet 실행을 활성화한다.
  [루트가 아닌 유저로 쿠버네티스 노드 컴포넌트 실행](/docs/tasks/administer-cluster/kubelet-in-userns/)을 참고한다.
- `KubeletPodResources`: kubelet의 파드 리소스 gPRC 엔드포인트를 활성화한다. 자세한 내용은
  [장치 모니터링 지원](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/606-compute-device-assignment/README.md)을
  참고한다.
- `KubeletPodResourcesGetAllocatable`: kubelet의 파드 리소스
  `GetAllocatableResources` 기능을 활성화한다.
  이 API는 클라이언트가 노드의 여유 컴퓨팅 자원을 잘 파악할 수 있도록,
  할당 가능 자원에 대한 정보를
  [자원 할당 보고](/ko/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#장치-플러그인-리소스-모니터링)한다.
- `KubeletTracing`: kubelet에 분산 추적에 대한 지원을 추가한다.
  활성화된 경우, kubelet CRI 인터페이스와 인증된 http 서버들은
  OpenTelemetry 추적 범위를 형성하는 데 도움을 준다.
  자세한 내용은 [쿠버네티스 시스템 컴포넌트에 대한 추적](/ko/docs/concepts/cluster-administration/system-traces/) 페이지를 확인한다.
- `LegacyServiceAccountTokenNoAutoGeneration`: 시크릿 기반
  [서비스 어카운트 토큰](/docs/reference/access-authn-authz/authentication/#service-account-tokens)의 자동 생성을 중단한다.
- `LegacyServiceAccountTokenTracking`: 시크릿 기반 
  [서비스 어카운트 토큰](/docs/reference/access-authn-authz/authentication/#service-account-tokens)의 사용을 추적한다.
- `LocalStorageCapacityIsolation`:
  [로컬 임시 스토리지](/ko/docs/concepts/configuration/manage-resources-containers/)와
  [emptyDir 볼륨](/ko/docs/concepts/storage/volumes/#emptydir)의
  `sizeLimit` 속성을 사용할 수 있게 한다.
- `LocalStorageCapacityIsolationFSQuotaMonitoring`: [로컬 임시 스토리지](/ko/docs/concepts/configuration/manage-resources-containers/)에
  `LocalStorageCapacityIsolation` 이 활성화되고
  [emptyDir 볼륨](/ko/docs/concepts/storage/volumes/#emptydir)의
  백업 파일시스템이 프로젝트 쿼터를 지원하고 활성화된 경우, 파일시스템 사용보다는
  프로젝트 쿼터를 사용하여 [emptyDir 볼륨](/ko/docs/concepts/storage/volumes/#emptydir)
  스토리지 사용을 모니터링하여 성능과 정확성을
  향상시킨다.
- `LogarithmicScaleDown`: 컨트롤러 스케일 다운 시에 파드 타임스탬프를 로그 스케일로 버켓화하여
  축출할 파드를 반-랜덤하게 선택하는 기법을 활성화한다.
- `MatchLabelKeysInPodTopologySpread`: [파드 토폴로지 분배 제약 조건](/ko/docs/concepts/scheduling-eviction/topology-spread-constraints/)의
  `matchLabelKeys` 필드를 활성화한다.
- `MaxUnavailableStatefulSet`: 스테이트풀셋의
  [롤링 업데이트 전략](/ko/docs/concepts/workloads/controllers/statefulset/#롤링-업데이트)에 대해
  `maxUnavailable` 필드를 설정할 수 있도록 한다.
  이 필드는 업데이트 동안 사용 불가능(unavailable) 상태의 파드를 몇 개까지 허용할지를 정한다.
- `MemoryManager`: NUMA 토폴로지를 기반으로 컨테이너에 대한
  메모리 어피니티를 설정할 수 있다.
- `MemoryQoS`: cgroup v2 메모리 컨트롤러를 사용하여
  파드/컨테이너에서 메모리 보호 및 사용 제한을 사용하도록 설정한다.
- `MinDomainsInPodTopologySpread`: [파드 토폴로지 분배 제약 조건](/ko/docs/concepts/scheduling-eviction/topology-spread-constraints/) 내의
  `minDomains` 사용을 활성화한다.
- `MixedProtocolLBService`: 동일한 로드밸런서 유형 서비스 인스턴스에서 다른 프로토콜
  사용을 활성화한다.
- `MultiCIDRRangeAllocator`: MultiCIDR 범위 할당기를 활성화한다.
- `NetworkPolicyEndPort`: 네트워크폴리시(NetworkPolicy)	오브젝트에서 단일 포트를 지정하는 것 대신에
  포트 범위를 지정할 수 있도록, `endPort` 필드의 사용을 활성화한다.
- `NetworkPolicyStatus`: 네트워크폴리시 오브젝트에 대해 `status` 서브리소스를 활성화한다.
- `NodeInclusionPolicyInPodTopologySpread`: 파드 토폴로지 분배 비대칭도를 계산할 때
  [파드 토폴로지 분배 제약 조건](/ko/docs/concepts/scheduling-eviction/topology-spread-constraints/)의
  `nodeAffinityPolicy`와 `nodeTaintsPolicy`를 활성화한다.
- `NodeOutOfServiceVolumeDetach`: 노드가 `node.kubernetes.io/out-of-service` 테인트를 사용하여 서비스 불가(out-of-service)로 표시되면,
  노드에 있던 이 테인트를 허용하지 않는 파드는 강제로 삭제되며,
  종료되는 파드에 대한 볼륨 해제(detach) 동작도 즉시 수행된다.
  이로 인해 삭제된 파드가 다른 노드에서 빠르게 복구될 수 있다.
- `NodeSwap`: 노드의 쿠버네티스 워크로드용 스왑 메모리를 할당하려면 kubelet을 활성화한다.
  반드시 `KubeletConfiguration.failSwapOn`를 false로 설정한 후 사용해야 한다.
  더 자세한 정보는 [스왑 메모리](/ko/docs/concepts/architecture/nodes/#swap-memory)를 참고한다.
- `NonPreemptingPriority`: 프라이어리티클래스(PriorityClass)와 파드에 `preemptionPolicy` 필드를 활성화한다.
- `OpenAPIEnums`: API 서버로부터 리턴된 스펙 내 OpenAPI 스키마의
  "enum" 필드 채우기를 활성화한다.
- `OpenAPIV3`: API 서버의 OpenAPI v3 발행을 활성화한다.
- `PDBUnhealthyPodEvictionPolicy`: `PodDisruptionBudget`의 `unhealthyPodEvictionPolicy` 필드를 활성화한다. 
  비정상(unhealthy) 파드가 어느 시점에 축출 대상이 될지를 이 필드에 명시한다. 
  더 자세한 정보는 [비정상 파드 축출 정책](/docs/tasks/run-application/configure-pdb/#unhealthy-pod-eviction-policy)을 참고한다.
- `PodDeletionCost`: 레플리카셋 다운스케일 시 삭제될 파드의 우선순위를 사용자가 조절할 수 있도록,
   [파드 삭제 비용](/ko/docs/concepts/workloads/controllers/replicaset/#파드-삭제-비용) 기능을 활성화한다.
- `PodAffinityNamespaceSelector`: [파드 어피니티 네임스페이스 셀렉터](/ko/docs/concepts/scheduling-eviction/assign-pod-node/#네임스페이스-셀렉터)
  기능과
  [CrossNamespacePodAffinity](/ko/docs/concepts/policy/resource-quotas/#네임스페이스-간-파드-어피니티-쿼터)
  쿼터 범위 기능을 활성화한다.
- `PodAndContainerStatsFromCRI`: kubelet이 컨테이너와 파드에 대한 통계치들을
  cAdvisor가 아닌 CRI 컨테이너 런타임으로부터 수집하도록 설정한다.
- `PodDisruptionConditions`: 중단(disruption)으로 인해 파드가 삭제되고 있음을 나타내는 파드 컨디션을 추가하도록 지원한다.
- `PodHasNetworkCondition`: kubelet이 파드에 [파드 네트워크 준비성](/ko/docs/concepts/workloads/pods/pod-lifecycle/#pod-has-network) 컨디션을 표시하도록 지원한다.
- `PodSchedulingReadiness`: 파드의 [스케줄링 준비성](/ko/docs/concepts/scheduling-eviction/pod-scheduling-readiness/)을 제어할 수 있도록 `schedulingGates` 필드를 활성화한다.
- `PodSecurity`: `PodSecurity` 어드미션 플러그인을 사용하도록 설정한다.
- `PreferNominatedNode`: 이 플래그는 클러스터에 존재하는 다른 노드를 반복해서 검사하기 전에
  지정된 노드를 먼저 검사할지 여부를
  스케줄러에 알려준다.
- `ProbeTerminationGracePeriod`: 파드의 [프로브-수준
  `terminationGracePeriodSeconds` 설정하기](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#probe-level-terminationgraceperiodseconds)
  기능을 활성화한다.
  더 자세한 사항은 [기능개선 제안](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2238-liveness-probe-grace-period)을 참고한다.
- `ProcMountType`: SecurityContext의 `procMount` 필드를 설정하여
  컨테이너의 proc 타입의 마운트를 제어할 수 있다.
- `ProxyTerminatingEndpoints`: `ExternalTrafficPolicy=Local`일 때 종료 엔드포인트를 처리하도록
  kube-proxy를 활성화한다.
- `QOSReserved`: QoS 수준에서 리소스 예약을 허용하여 낮은 QoS 수준의 파드가
  더 높은 QoS 수준에서 요청된 리소스로 파열되는 것을 방지한다
  (현재 메모리만 해당).
- `ReadWriteOncePod`: `ReadWriteOncePod` 퍼시스턴트 볼륨 엑세스 모드를
  사용한다.
- `RecoverVolumeExpansionFailure`: 이전에 실패했던 볼륨 확장으로부터 복구할 수 있도록,
  사용자가 PVC를 더 작은 크기로 변경할 수 있도록 한다.
  [볼륨 확장 시 오류 복구](/ko/docs/concepts/storage/persistent-volumes/#볼륨-확장-시-오류-복구)에서
  자세한 사항을 확인한다.
- `RemainingItemCount`: API 서버가
  [청크(chunking) 목록 요청](/docs/reference/using-api/api-concepts/#retrieving-large-results-sets-in-chunks)에 대한
  응답에서 남은 항목 수를 표시하도록 허용한다.
- `RemoveSelfLink`: 모든 오브젝트와 콜렉션에 대해 `.metadata.selfLink` 필드를 빈 칸(빈 문자열)으로 설정한다.
  이 필드는 쿠버네티스 v1.16에서 사용 중단되었다.
  이 기능을 활성화하면, `.metadata.selfLink` 필드는 쿠버네티스 API에 존재하지만,
  항상 빈 칸으로 유지된다.
- `RetroactiveDefaultStorageClass`: 연결이 해제된(unbound) PVC에 스토리지클래스를 소급적으로 할당하는 것을 허용한다.
- `RotateKubeletServerCertificate`: kubelet에서 서버 TLS 인증서의 로테이션을 활성화한다.
  자세한 사항은
  [kubelet 구성](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#kubelet-configuration)을 확인한다.
- `SELinuxMountReadWriteOncePod`: kubelet으로 하여금,
  볼륨에 있는 모든 파일에 대해 SELinux 레이블을 재귀적으로 적용하는 대신
  올바른 SELinux 레이블을 가지고 볼륨을 마운트할 수 있도록 한다.
- `SeccompDefault`: 모든 워크로드의 기본 구분 프로파일로
  `RuntimeDefault`을 사용한다.
  seccomp 프로파일은 파드 및 컨테이너 `securityContext`에 지정되어 있다.
- `SELinuxMountReadWriteOncePod`: kubelet으로 하여금,
  볼륨에 있는 모든 파일에 대해 SELinux 레이블을 재귀적으로 적용하는 대신
  올바른 SELinux 레이블을 가지고 볼륨을 마운트할 수 있도록 한다.
- `ServerSideApply`: API 서버에서 [SSA(Sever Side Apply)](/docs/reference/using-api/server-side-apply/)
  경로를 활성화한다.
- `ServerSideFieldValidation`: 서버-사이드(server-side) 필드 검증을 활성화한다.
  이는 리소스 스키마의 검증이 클라이언트 사이드(예: `kubectl create` 또는 `kubectl apply` 명령줄)가 아니라
  API 서버 사이드에서 수행됨을 의미한다.
- `ServiceInternalTrafficPolicy`: 서비스에서 `internalTrafficPolicy` 필드를 활성화한다.
- `ServiceLBNodePortControl`: 서비스에서 `allocateLoadBalancerNodePorts` 필드를 활성화한다.
- `ServiceLoadBalancerClass`: 서비스에서 `loadBalancerClass` 필드를 활성화한다.
  자세한 내용은
  [로드밸런서 구현체의 종류 확인하기](/ko/docs/concepts/services-networking/service/#load-balancer-class)를 참고한다.
- `ServiceIPStaticSubrange`: ClusterIP 범위를 분할하는
  서비스 ClusterIP 할당 전략을 활성화한다.
  ClusterIP 동적 할당을 주로 상위 범위에서 수행하여,
  사용자가 고정 ClusterIP를 하위 범위에서 할당하는 상황에서도 충돌 확률을 낮출 수 있다.
  더 자세한 사항은
  [충돌 방지](/ko/docs/concepts/services-networking/service/#avoiding-collisions)를 참고한다.
- `SizeMemoryBackedVolumes`: memory-backed 볼륨(보통 `emptyDir` 볼륨)의 크기 상한을
  지정할 수 있도록 kubelets를 활성화한다.
- `StatefulSetMinReadySeconds`: 스테이트풀셋 컨트롤러가 `minReadySeconds`를
  반영할 수 있다.
- `StatefulSetStartOrdinal`: 스테이트풀셋 내에서 시작 서수(start ordinal)를 설정할 수 있도록 한다. 
  더 자세한 내용은 
  [시작 서수](/ko/docs/concepts/workloads/controllers/statefulset/#시작-서수)를 
  확인한다.
- `StorageVersionAPI`: [스토리지 버전 API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#storageversion-v1alpha1-internal-apiserver-k8s-io)를
  활성화한다.
- `StorageVersionHash`: API 서버가 디스커버리에서 스토리지 버전 해시를 노출하도록
  허용한다.
- `SuspendJob`: 잡 중지/재시작 기능을 활성화한다.
  자세한 내용은 [잡 문서](/ko/docs/concepts/workloads/controllers/job/)를 참고한다.
- `TopologyAwareHints`: 엔드포인트슬라이스(EndpointSlices)에서 토폴로지 힌트 기반
  토폴로지-어웨어 라우팅을 활성화한다. 자세한 내용은
  [토폴로지 인지 힌트](/ko/docs/concepts/services-networking/topology-aware-hints/)
  를 참고한다.
- `TopologyManager`: 쿠버네티스의 다른 컴포넌트에 대한 세분화된 하드웨어 리소스
  할당을 조정하는 메커니즘을 활성화한다.
  [노드의 토폴로지 관리 정책 제어](/docs/tasks/administer-cluster/topology-manager/)를 참고한다.
- `TopologyManagerPolicyAlphaOptions`: 토폴로지 매니저 폴리시(topology manager 
  policy)의 실험적이고 알파 품질인 옵션의 미세 조정 기능을 활성화한다. 
  이 기능 게이트는 품질 수준이 알파 상태인 토폴로지 매니저 옵션 *군*을 제어한다. 
  이 기능 게이트는 앞으로도 베타 또는 안정 상태로 승급되지 않는다.
- `TopologyManagerPolicyBetaOptions`: 토폴로지 매니저 폴리시(topology manager 
  policy)의 실험적이고 베타 품질인 옵션의 미세 조정 기능을 활성화한다. 
  이 기능 게이트는 품질 수준이 베타 상태인 토폴로지 매니저 옵션 *군*을 제어한다. 
  이 기능 게이트는 앞으로도 안정 상태로 승급되지 않는다.
- `TopologyManagerPolicyOptions`: 토폴로지 매니저 폴리시(topology manager policy)의 미세 조정 기능을 활성화한다.
- `UserNamespacesStatelessPodsSupport`: 스테이트리스(stateless) 파드에 대한 유저 네임스페이스 지원 기능을 활성화한다.
- `ValidatingAdmissionPolicy`: 어드미션 컨트롤에 CEL(Common Expression Language) 검증을 사용할 수 있도록 하는 [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/) 지원 기능을 활성화한다.
- `VolumeCapacityPriority`: 가용 PV 용량을 기반으로
  여러 토폴로지에 있는 노드들의 우선순위를 정하는 기능을 활성화한다.
- `WatchBookmark`: 감시자 북마크(watch bookmark) 이벤트 지원을 활성화한다.
- `WinDSR`: kube-proxy가 윈도우용 DSR 로드 밸런서를 생성할 수 있다.
- `WinOverlay`: kube-proxy가 윈도우용 오버레이 모드에서 실행될 수 있도록 한다.
- `WindowsHostProcessContainers`: 윈도우 HostProcess 컨테이너에 대한 지원을 사용하도록 설정한다.


## {{% heading "whatsnext" %}}

* [사용 중단 정책](/docs/reference/using-api/deprecation-policy/)은 쿠버네티스에 대한
  기능과 컴포넌트를 제거하는 프로젝트의 접근 방법을 설명한다.
* 쿠버네티스 1.24부터, 새로운 베타 API는 기본적으로 활성화되어 있지 않다.
  베타 기능을 활성화하려면, 연관된 API 리소스도 활성화해야 한다.
  예를 들어, `storage.k8s.io/v1beta1/csistoragecapacities`와 같은 특정 리소스를 활성화하려면,
  `--runtime-config=storage.k8s.io/v1beta1/csistoragecapacities`를 설정한다.
  명령줄 플래그에 대한 상세 사항은 [API 버전 규칙](/ko/docs/reference/using-api/#api-버전-규칙)을 참고한다.
