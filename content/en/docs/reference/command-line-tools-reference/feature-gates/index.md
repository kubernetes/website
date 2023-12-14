---
title: Feature Gates
weight: 10
content_type: concept
card:
  name: reference
  weight: 60
---

<!-- overview -->
This page contains an overview of the various feature gates an administrator
can specify on different Kubernetes components.

See [feature stages](#feature-stages) for an explanation of the stages for a feature.


<!-- body -->
## Overview

Feature gates are a set of key=value pairs that describe Kubernetes features.
You can turn these features on or off using the `--feature-gates` command line flag
on each Kubernetes component.

Each Kubernetes component lets you enable or disable a set of feature gates that
are relevant to that component.
Use `-h` flag to see a full set of feature gates for all components.
To set feature gates for a component, such as kubelet, use the `--feature-gates`
flag assigned to a list of feature pairs:

```shell
--feature-gates=...,GracefulNodeShutdown=true
```

The following tables are a summary of the feature gates that you can set on
different Kubernetes components.

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

{{< note >}}
For a reference to old feature gates that are removed, please refer to
[feature gates removed](/docs/reference/command-line-tools-reference/feature-gates-removed/).
{{< /note >}}

### Feature gates for Alpha or Beta features

{{< table caption="Feature gates for features in Alpha or Beta states" sortable="true" >}}

| Feature | Default | Stage | Since | Until |
|---------|---------|-------|-------|-------|
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

### Feature gates for graduated or deprecated features

{{< table caption="Feature Gates for Graduated or Deprecated Features" sortable="true">}}

| Feature | Default | Stage | Since | Until |
|---------|---------|-------|-------|-------|
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

## Using a feature

### Feature stages

A feature can be in *Alpha*, *Beta* or *GA* stage.
An *Alpha* feature means:

* Disabled by default.
* Might be buggy. Enabling the feature may expose bugs.
* Support for feature may be dropped at any time without notice.
* The API may change in incompatible ways in a later software release without notice.
* Recommended for use only in short-lived testing clusters, due to increased
  risk of bugs and lack of long-term support.

A *Beta* feature means:

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

{{< note >}}
Please do try *Beta* features and give feedback on them!
After they exit beta, it may not be practical for us to make more changes.
{{< /note >}}

A *General Availability* (GA) feature is also referred to as a *stable* feature. It means:

* The feature is always enabled; you cannot disable it.
* The corresponding feature gate is no longer needed.
* Stable versions of features will appear in released software for many subsequent versions.

## List of feature gates {#feature-gates}

Each feature gate is designed for enabling/disabling a specific feature:

- {{< feature-gate-description name="AdmissionWebhookMatchConditions" >}}
- {{< feature-gate-description name="AggregatedDiscoveryEndpoint" >}}
- {{< feature-gate-description name="AnyVolumeDataSource" >}}
- {{< feature-gate-description name="APIListChunking" >}}
- {{< feature-gate-description name="APIPriorityAndFairness" >}}
- {{< feature-gate-description name="APIResponseCompression" >}}
- {{< feature-gate-description name="APISelfSubjectReview" >}}
- {{< feature-gate-description name="APIServerIdentity" >}}
- {{< feature-gate-description name="APIServerTracing" >}}
- {{< feature-gate-description name="AppArmor" >}}
- {{< feature-gate-description name="CloudControllerManagerWebhook" >}}
- {{< feature-gate-description name="CloudDualStackNodeIPs" >}}
- {{< feature-gate-description name="ClusterTrustBundle" >}}
- {{< feature-gate-description name="ClusterTrustBundleProjection" >}}
- {{< feature-gate-description name="ComponentSLIs" >}}
- {{< feature-gate-description name="ConsistentHTTPGetHandlers" >}}
- {{< feature-gate-description name="ConsistentListFromCache" >}}
- {{< feature-gate-description name="ContainerCheckpoint" >}}
- {{< feature-gate-description name="ContextualLogging" >}}
- {{< feature-gate-description name="CPUManager" >}}
- {{< feature-gate-description name="CPUManagerPolicyAlphaOptions" >}}
- {{< feature-gate-description name="CPUManagerPolicyBetaOptions" >}}
- {{< feature-gate-description name="CPUManagerPolicyOptions" >}}
- {{< feature-gate-description name="CRDValidationRatcheting" >}}
- {{< feature-gate-description name="CronJobsScheduledAnnotation" >}}
- {{< feature-gate-description name="CronJobTimeZone" >}}
- {{< feature-gate-description name="CrossNamespaceVolumeDataSource" >}}
- {{< feature-gate-description name="CSIMigrationAzureFile" >}}
- {{< feature-gate-description name="CSIMigrationPortworx" >}}
- {{< feature-gate-description name="CSIMigrationRBD" >}}
- {{< feature-gate-description name="CSIMigrationvSphere" >}}
- {{< feature-gate-description name="CSINodeExpandSecret" >}}
- {{< feature-gate-description name="CSIVolumeHealth" >}}
- {{< feature-gate-description name="CustomCPUCFSQuotaPeriod" >}}
- {{< feature-gate-description name="CustomResourceValidationExpressions" >}}
- {{< feature-gate-description name="DaemonSetUpdateSurge" >}}
- {{< feature-gate-description name="DefaultHostNetworkHostPortsInPodTemplates" >}}
- {{< feature-gate-description name="DevicePluginCDIDevices" >}}
- {{< feature-gate-description name="DisableCloudProviders" >}}
- {{< feature-gate-description name="DisableKubeletCloudCredentialProviders" >}}
- {{< feature-gate-description name="DisableNodeKubeProxyVersion" >}}
- {{< feature-gate-description name="DynamicResourceAllocation" >}}
- {{< feature-gate-description name="EfficientWatchResumption" >}}
- {{< feature-gate-description name="ElasticIndexedJob" >}}
- {{< feature-gate-description name="EventedPLEG" >}}
- {{< feature-gate-description name="ExecProbeTimeout" >}}
- {{< feature-gate-description name="ExpandedDNSConfig" >}}
- {{< feature-gate-description name="ExperimentalHostUserNamespaceDefaulting" >}}
- {{< feature-gate-description name="GracefulNodeShutdown" >}}
- {{< feature-gate-description name="GracefulNodeShutdownBasedOnPodPriority" >}}
- {{< feature-gate-description name="GRPCContainerProbe" >}}
- {{< feature-gate-description name="HonorPVReclaimPolicy" >}}
- {{< feature-gate-description name="HPAContainerMetrics" >}}
- {{< feature-gate-description name="HPAScaleToZero" >}}
- {{< feature-gate-description name="InPlacePodVerticalScaling" >}}
- {{< feature-gate-description name="InTreePluginAWSUnregister" >}}
- {{< feature-gate-description name="InTreePluginAzureDiskUnregister" >}}
- {{< feature-gate-description name="InTreePluginAzureFileUnregister" >}}
- {{< feature-gate-description name="InTreePluginGCEUnregister" >}}
- {{< feature-gate-description name="InTreePluginOpenStackUnregister" >}}
- {{< feature-gate-description name="InTreePluginPortworxUnregister" >}}
- {{< feature-gate-description name="InTreePluginRBDUnregister" >}}
- {{< feature-gate-description name="InTreePluginvSphereUnregister" >}}
- {{< feature-gate-description name="IPTablesOwnershipCleanup" >}}
- {{< feature-gate-description name="JobBackoffLimitPerIndex" >}}
- {{< feature-gate-description name="JobMutableNodeSchedulingDirectives" >}}
- {{< feature-gate-description name="JobPodFailurePolicy" >}}
- {{< feature-gate-description name="JobPodReplacementPolicy" >}}
- {{< feature-gate-description name="JobReadyPods" >}}
- {{< feature-gate-description name="JobTrackingWithFinalizers" >}}
- {{< feature-gate-description name="KMSv1" >}}
- {{< feature-gate-description name="KMSv2" >}}
- {{< feature-gate-description name="KMSv2KDF" >}}
- {{< feature-gate-description name="KubeletCgroupDriverFromCRI" >}}
- {{< feature-gate-description name="KubeletInUserNamespace" >}}
- {{< feature-gate-description name="KubeletPodResources" >}}
- {{< feature-gate-description name="KubeletPodResourcesDynamicResources" >}}
- {{< feature-gate-description name="KubeletPodResourcesGet" >}}
- {{< feature-gate-description name="KubeletPodResourcesGetAllocatable" >}}
- {{< feature-gate-description name="KubeletTracing" >}}
- {{< feature-gate-description name="KubeProxyDrainingTerminatingNodes" >}}
- {{< feature-gate-description name="LegacyServiceAccountTokenCleanUp" >}}
- {{< feature-gate-description name="LegacyServiceAccountTokenNoAutoGeneration" >}}
- {{< feature-gate-description name="LegacyServiceAccountTokenTracking" >}}
- {{< feature-gate-description name="LoadBalancerIPMode" >}}
- {{< feature-gate-description name="LocalStorageCapacityIsolationFSQuotaMonitoring" >}}
- {{< feature-gate-description name="LogarithmicScaleDown" >}}
- {{< feature-gate-description name="LoggingAlphaOptions" >}}
- {{< feature-gate-description name="LoggingBetaOptions" >}}
- {{< feature-gate-description name="MatchLabelKeysInPodAffinity" >}}
- {{< feature-gate-description name="MatchLabelKeysInPodTopologySpread" >}}
- {{< feature-gate-description name="MaxUnavailableStatefulSet" >}}
- {{< feature-gate-description name="MemoryManager" >}}
- {{< feature-gate-description name="MemoryQoS" >}}
- {{< feature-gate-description name="MinDomainsInPodTopologySpread" >}}
- {{< feature-gate-description name="MinimizeIPTablesRestore" >}}
- {{< feature-gate-description name="MultiCIDRServiceAllocator" >}}
- {{< feature-gate-description name="NewVolumeManagerReconstruction" >}}
- {{< feature-gate-description name="NodeInclusionPolicyInPodTopologySpread" >}}
- {{< feature-gate-description name="NodeLogQuery" >}}
- {{< feature-gate-description name="NodeOutOfServiceVolumeDetach" >}}
- {{< feature-gate-description name="NodeSwap" >}}
- {{< feature-gate-description name="OpenAPIEnums" >}}
- {{< feature-gate-description name="OpenAPIV3" >}}
- {{< feature-gate-description name="PDBUnhealthyPodEvictionPolicy" >}}
- {{< feature-gate-description name="PersistentVolumeLastPhaseTransitionTime" >}}
- {{< feature-gate-description name="PodAndContainerStatsFromCRI" >}}
- {{< feature-gate-description name="PodDeletionCost" >}}
- {{< feature-gate-description name="PodDisruptionConditions" >}}
- {{< feature-gate-description name="PodHostIPs" >}}
- {{< feature-gate-description name="PodIndexLabel" >}}
- {{< feature-gate-description name="PodLifecycleSleepAction" >}}
- {{< feature-gate-description name="PodReadyToStartContainersCondition" >}}
- {{< feature-gate-description name="PodSchedulingReadiness" >}}
- {{< feature-gate-description name="ProbeTerminationGracePeriod" >}}
- {{< feature-gate-description name="ProcMountType" >}}
- {{< feature-gate-description name="ProxyTerminatingEndpoints" >}}
- {{< feature-gate-description name="QOSReserved" >}}
- {{< feature-gate-description name="ReadWriteOncePod" >}}
- {{< feature-gate-description name="RecoverVolumeExpansionFailure" >}}
- {{< feature-gate-description name="RemainingItemCount" >}}
- {{< feature-gate-description name="RemoveSelfLink" >}}
- {{< feature-gate-description name="RotateKubeletServerCertificate" >}}
- {{< feature-gate-description name="RuntimeClassInImageCriApi" >}}
- {{< feature-gate-description name="SchedulerQueueingHints" >}}
- {{< feature-gate-description name="SeccompDefault" >}}
- {{< feature-gate-description name="SecurityContextDeny" >}}
- {{< feature-gate-description name="SELinuxMountReadWriteOncePod" >}}
- {{< feature-gate-description name="SeparateTaintEvictionController" >}}
- {{< feature-gate-description name="ServerSideApply" >}}
- {{< feature-gate-description name="ServerSideFieldValidation" >}}
- {{< feature-gate-description name="ServiceAccountTokenJTI" >}}
- {{< feature-gate-description name="ServiceAccountTokenNodeBinding" >}}
- {{< feature-gate-description name="ServiceAccountTokenNodeBindingValidation" >}}
- {{< feature-gate-description name="ServiceAccountTokenPodNodeInfo" >}}
- {{< feature-gate-description name="ServiceNodePortStaticSubrange" >}}
- {{< feature-gate-description name="SidecarContainers" >}}
- {{< feature-gate-description name="SizeMemoryBackedVolumes" >}}
- {{< feature-gate-description name="SkipReadOnlyValidationGCE" >}}
- {{< feature-gate-description name="StableLoadBalancerNodeSet" >}}
- {{< feature-gate-description name="StatefulSetStartOrdinal" >}}
- {{< feature-gate-description name="StorageVersionAPI" >}}
- {{< feature-gate-description name="StorageVersionHash" >}}
- {{< feature-gate-description name="TopologyAwareHints" >}}
- {{< feature-gate-description name="TopologyManager" >}}
- {{< feature-gate-description name="TopologyManagerPolicyAlphaOptions" >}}
- {{< feature-gate-description name="TopologyManagerPolicyBetaOptions" >}}
- {{< feature-gate-description name="TopologyManagerPolicyOptions" >}}
- {{< feature-gate-description name="TranslateStreamCloseWebsocketRequests" >}}
- {{< feature-gate-description name="UnauthenticatedHTTP2DOSMitigation" >}}
- {{< feature-gate-description name="UnknownVersionInteroperabilityProxy" >}}
- {{< feature-gate-description name="UserNamespacesPodSecurityStandards" >}}
- {{< feature-gate-description name="UserNamespacesSupport" >}}
- {{< feature-gate-description name="ValidatingAdmissionPolicy" >}}
- {{< feature-gate-description name="VolumeAttributesClass" >}}
- {{< feature-gate-description name="VolumeCapacityPriority" >}}
- {{< feature-gate-description name="WatchBookmark" >}}
- {{< feature-gate-description name="WatchList" >}}
- {{< feature-gate-description name="WindowsHostNetwork" >}}
- {{< feature-gate-description name="WinDSR" >}}
- {{< feature-gate-description name="WinOverlay" >}}

## {{% heading "whatsnext" %}}

* The [deprecation policy](/docs/reference/using-api/deprecation-policy/) for Kubernetes explains
  the project's approach to removing features and components.
* Since Kubernetes 1.24, new beta APIs are not enabled by default.  When enabling a beta
  feature, you will also need to enable any associated API resources.
  For example, to enable a particular resource like
  `storage.k8s.io/v1beta1/csistoragecapacities`, set `--runtime-config=storage.k8s.io/v1beta1/csistoragecapacities`.
  See [API Versioning](/docs/reference/using-api/#api-versioning) for more details on the command line flags.