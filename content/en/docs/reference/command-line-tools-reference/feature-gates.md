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
| `APIListChunking` | `false` | Alpha | 1.8 | 1.8 |
| `APIListChunking` | `true` | Beta | 1.9 | |
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
|  CRDValidationRatcheting | false | Alpha | 1.28 |
| `CSIMigrationPortworx` | `false` | Alpha | 1.23 | 1.24 |
| `CSIMigrationPortworx` | `false` | Beta | 1.25 | |
| `CSINodeExpandSecret` | `false` | Alpha | 1.25 | 1.26 |
| `CSINodeExpandSecret` | `true` | Beta | 1.27 | |
| `CSIVolumeHealth` | `false` | Alpha | 1.21 | |
| `CloudControllerManagerWebhook` | false | Alpha | 1.27 | |
| `CloudDualStackNodeIPs` | false | Alpha | 1.27 | |
| `ClusterTrustBundle` | false | Alpha | 1.27 | |
| `ComponentSLIs` | `false` | Alpha | 1.26 | 1.26 |
| `ComponentSLIs` | `true` | Beta | 1.27 | |
| `ConsistentListFromCache` | `false` | Alpha | 1.28 |
| `ContainerCheckpoint` | `false` | Alpha | 1.25 | |
| `ContextualLogging` | `false` | Alpha | 1.24 | |
| `CronJobsScheduledAnnotation` | `true` | Beta | 1.28 | |
| `CrossNamespaceVolumeDataSource` | `false` | Alpha| 1.26 | |
| `CustomCPUCFSQuotaPeriod` | `false` | Alpha | 1.12 | |
| `CustomResourceValidationExpressions` | `false` | Alpha | 1.23 | 1.24 |
| `CustomResourceValidationExpressions` | `true` | Beta | 1.25 | |
| `DevicePluginCDIDevices` | `false` | Alpha | 1.28 | |
| `DisableCloudProviders` | `false` | Alpha | 1.22 | |
| `DisableKubeletCloudCredentialProviders` | `false` | Alpha | 1.23 | |
| `DynamicResourceAllocation` | `false` | Alpha | 1.26 | |
| `ElasticIndexedJob` | `true` | Beta` | 1.27 | |
| `EventedPLEG` | `false` | Alpha | 1.26 | 1.26 |
| `EventedPLEG` | `false` | Beta | 1.27 | - |
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
| `JobBackoffLimitPerIndex` | `false` | Alpha | 1.28 | |
| `JobPodFailurePolicy` | `false` | Alpha | 1.25 | 1.25 |
| `JobPodFailurePolicy` | `true` | Beta | 1.26 | |
| `JobPodReplacementPolicy` | `false` | Alpha | 1.28 | |
| `JobReadyPods` | `false` | Alpha | 1.23 | 1.23 |
| `JobReadyPods` | `true` | Beta | 1.24 | |
| `KMSv2` | `false` | Alpha | 1.25 | 1.26 |
| `KMSv2` | `true` | Beta | 1.27 | |
| `KMSv2KDF` | `false` | Beta | 1.28 | |
| `KubeProxyDrainingTerminatingNodes` | `false` | Alpha | 1.28 | |
| `KubeletCgroupDriverFromCRI` | `false` | Alpha | 1.28 | |
| `KubeletInUserNamespace` | `false` | Alpha | 1.22 | |
| `KubeletPodResourcesDynamicResources` | `false` | Alpha | 1.27 | |
| `KubeletPodResourcesGet` | `false` | Alpha | 1.27 | |
| `KubeletTracing` | `false` | Alpha | 1.25 | 1.26 |
| `KubeletTracing` | `true` | Beta | 1.27 | |
| `LegacyServiceAccountTokenCleanUp` | `false` | Alpha | 1.28 | |
| `LocalStorageCapacityIsolationFSQuotaMonitoring` | `false` | Alpha | 1.15 | - |
| `LogarithmicScaleDown` | `false` | Alpha | 1.21 | 1.21 |
| `LogarithmicScaleDown` | `true` | Beta | 1.22 | |
| `LoggingAlphaOptions` | `false` | Alpha | 1.24 | - |
| `LoggingBetaOptions` | `true` | Beta | 1.24 | - |
| `MatchLabelKeysInPodTopologySpread` | `false` | Alpha | 1.25 | 1.26 |
| `MatchLabelKeysInPodTopologySpread` | `true` | Beta | 1.27 | - |
| `MaxUnavailableStatefulSet` | `false` | Alpha | 1.24 | |
| `MemoryManager` | `false` | Alpha | 1.21 | 1.21 |
| `MemoryManager` | `true` | Beta | 1.22 | |
| `MemoryQoS` | `false` | Alpha | 1.22 | |
| `MinDomainsInPodTopologySpread` | `false` | Alpha | 1.24 | 1.24 |
| `MinDomainsInPodTopologySpread` | `false` | Beta | 1.25 | 1.26 |
| `MinDomainsInPodTopologySpread` | `true` | Beta | 1.27 | |
| `MultiCIDRRangeAllocator` | `false` | Alpha | 1.25 | |
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
| `PersistentVolumeLastPhaseTransistionTime` | `false` | Alpha | 1.28 | |
| `PodAndContainerStatsFromCRI` | `false` | Alpha | 1.23 | |
| `PodDeletionCost` | `false` | Alpha | 1.21 | 1.21 |
| `PodDeletionCost` | `true` | Beta | 1.22 | |
| `PodDisruptionConditions` | `false` | Alpha | 1.25 | 1.25 |
| `PodDisruptionConditions` | `true` | Beta | 1.26 | |
| `PodHostIPs` | `false` | Alpha | 1.28 | |
| `PodIndexLabel` | `true` | Beta | 1.28 | |
| `PodReadyToStartContainersCondition` | `false` | Alpha | 1.28 | |
| `PodSchedulingReadiness` | `false` | Alpha | 1.26 | 1.26 |
| `PodSchedulingReadiness` | `true` | Beta | 1.27 | |
| `ProcMountType` | `false` | Alpha | 1.12 | |
| `QOSReserved` | `false` | Alpha | 1.11 | |
| `ReadWriteOncePod` | `false` | Alpha | 1.22 | 1.26 |
| `ReadWriteOncePod` | `true` | Beta | 1.27 | |
| `RecoverVolumeExpansionFailure` | `false` | Alpha | 1.23 | |
| `RemainingItemCount` | `false` | Alpha | 1.15 | 1.15 |
| `RemainingItemCount` | `true` | Beta | 1.16 | |
| `RotateKubeletServerCertificate` | `false` | Alpha | 1.7 | 1.11 |
| `RotateKubeletServerCertificate` | `true` | Beta | 1.12 | |
| `SELinuxMountReadWriteOncePod` | `false` | Alpha | 1.25 | 1.26 |
| `SELinuxMountReadWriteOncePod` | `false` | Beta | 1.27 | 1.27 |
| `SELinuxMountReadWriteOncePod` | `true` | Beta | 1.28 | |
| `SchedulerQueueingHints` | `false` | Alpha | 1.28 | |
| `SecurityContextDeny` | `false` | Alpha | 1.27 | |
| `ServiceNodePortStaticSubrange` | `false` | Alpha | 1.27 | 1.27 |
| `ServiceNodePortStaticSubrange` | `true` | Beta | 1.28 | |
| `SidecarContainers` | `false` | Alpha | 1.28 | |
| `SizeMemoryBackedVolumes` | `false` | Alpha | 1.20 | 1.21 |
| `SizeMemoryBackedVolumes` | `true` | Beta | 1.22 | |
| `SkipReadOnlyValidationGCE` | `false` | Alpha | 1.28 | |
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
| `UnknownVersionInteroperabilityProxy` | `false` | Alpha | 1.28 | |
| `UserNamespacesSupport` | `false` | Alpha | 1.28 | |
| `ValidatingAdmissionPolicy` | `false` | Alpha | 1.26 | 1.27 |
| `ValidatingAdmissionPolicy` | `false` | Beta | 1.28 | |
| `VolumeCapacityPriority` | `false` | Alpha | 1.21 | |
| `WatchList` | false | Alpha | 1.27 | |
| `WinDSR` | `false` | Alpha | 1.14 | |
| `WinOverlay` | `false` | Alpha | 1.14 | 1.19 |
| `WinOverlay` | `true` | Beta | 1.20 | |
| `WindowsHostNetwork` | `true` | Alpha | 1.26 | |
{{< /table >}}

### Feature gates for graduated or deprecated features

{{< table caption="Feature Gates for Graduated or Deprecated Features" sortable="true">}}

| Feature | Default | Stage | Since | Until |
|---------|---------|-------|-------|-------|
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
| `ConsistentHTTPGetHandlers` | `true` | GA | 1.25 | - |
| `CronJobTimeZone` | `false` | Alpha | 1.24 | 1.24 |
| `CronJobTimeZone` | `true` | Beta | 1.25 | 1.26 |
| `CronJobTimeZone` | `true` | GA | 1.27 | - |
| `DaemonSetUpdateSurge` | `false` | Alpha | 1.21 | 1.21 |
| `DaemonSetUpdateSurge` | `true` | Beta | 1.22 | 1.24 |
| `DaemonSetUpdateSurge` | `true` | GA | 1.25 | |
| `DefaultHostNetworkHostPortsInPodTemplates` | `false` | Deprecated | 1.28 | |
| `DownwardAPIHugePages` | `false` | Alpha | 1.20 | 1.20 |
| `DownwardAPIHugePages` | `false` | Beta | 1.21 | 1.21 |
| `DownwardAPIHugePages` | `true` | Beta | 1.22 | 1.26 |
| `DownwardAPIHugePages` | `true` | GA | 1.27 | |
| `EfficientWatchResumption` | `false` | Alpha | 1.20 | 1.20 |
| `EfficientWatchResumption` | `true` | Beta | 1.21 | 1.23 |
| `EfficientWatchResumption` | `true` | GA | 1.24 | |
| `ExecProbeTimeout` | `true` | GA | 1.20 | |
| `ExpandedDNSConfig` | `false` | Alpha | 1.22 | 1.25 |
| `ExpandedDNSConfig` | `true` | Beta | 1.26 | 1.27 |
| `ExpandedDNSConfig` | `true` | GA | 1.28 | |
| `ExperimentalHostUserNamespaceDefaulting` | `false` | Beta | 1.5 | 1.27 |
| `ExperimentalHostUserNamespaceDefaulting` | `false` | Deprecated | 1.28 | |
| `GRPCContainerProbe` | `false` | Alpha | 1.23 | 1.23 |
| `GRPCContainerProbe` | `true` | Beta | 1.24 | 1.26 |
| `GRPCContainerProbe` | `true` | GA | 1.27 | |
| `IPTablesOwnershipCleanup` | `false` | Alpha | 1.25 | 1.26 |
| `IPTablesOwnershipCleanup` | `true` | Beta | 1.27 | 1.27 |
| `IPTablesOwnershipCleanup` | `true` | GA | 1.28 | |
| `InTreePluginRBDUnregister` | `false` | Alpha | 1.23 | 1.27 |
| `InTreePluginRBDUnregister` | `false` | Deprecated | 1.28 | |
| `JobMutableNodeSchedulingDirectives` | `true` | Beta | 1.23 | 1.26 |
| `JobMutableNodeSchedulingDirectives` | `true` | GA | 1.27 | |
| `JobTrackingWithFinalizers` | `false` | Alpha | 1.22 | 1.22 |
| `JobTrackingWithFinalizers` | `false` | Beta | 1.23 | 1.24 |
| `JobTrackingWithFinalizers` | `true` | Beta | 1.25 | 1.25 |
| `JobTrackingWithFinalizers` | `true` | GA | 1.26 | |
| `KMSv1` | `true` | Deprecated | 1.28 | |
| `KubeletPodResources` | `false` | Alpha | 1.13 | 1.14 |
| `KubeletPodResources` | `true` | Beta | 1.15 | 1.27 |
| `KubeletPodResources` | `true` | GA | 1.28 | |
| `KubeletPodResourcesGetAllocatable` | `false` | Alpha | 1.21 | 1.22 |
| `KubeletPodResourcesGetAllocatable` | `true` | Beta | 1.23 | 1.27 |
| `KubeletPodResourcesGetAllocatable` | `true` | GA | 1.28 | |
| `LegacyServiceAccountTokenNoAutoGeneration` | `true` | Beta | 1.24 | 1.25 |
| `LegacyServiceAccountTokenNoAutoGeneration` | `true` | GA | 1.26 | |
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
| `RemoveSelfLink` | `false` | Alpha | 1.16 | 1.19 |
| `RemoveSelfLink` | `true` | Beta | 1.20 | 1.23 |
| `RemoveSelfLink` | `true` | GA | 1.24 | |
| `RetroactiveDefaultStorageClass` | `false` | Alpha | 1.25 | 1.25 |
| `RetroactiveDefaultStorageClass` | `true` | Beta | 1.26 | 1.27 |
| `RetroactiveDefaultStorageClass` | `true` | GA | 1.28 | |
| `SeccompDefault` | `false` | Alpha | 1.22 | 1.24 |
| `SeccompDefault` | `true` | Beta | 1.25 | 1.26 |
| `SeccompDefault` | `true` | GA | 1.27 | - |
| `ServerSideApply` | `false` | Alpha | 1.14 | 1.15 |
| `ServerSideApply` | `true` | Beta | 1.16 | 1.21 |
| `ServerSideApply` | `true` | GA | 1.22 | - |
| `ServerSideFieldValidation` | `false` | Alpha | 1.23 | 1.24 |
| `ServerSideFieldValidation` | `true` | Beta | 1.25 | 1.26 |
| `ServerSideFieldValidation` | `true` | GA | 1.27 | - |
| `TopologyManager` | `false` | Alpha | 1.16 | 1.17 |
| `TopologyManager` | `true` | Beta | 1.18 | 1.26 |
| `TopologyManager` | `true` | GA | 1.27 | - |
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

* Usually enabled by default. Beta API groups are [disabled by default](https://github.com/kubernetes/enhancements/tree/master/keps/sig-architecture/3136-beta-apis-off-by-default).
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

- `AdmissionWebhookMatchConditions`: Enable [match conditions](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchconditions)
  on mutating & validating admission webhooks.
- `APIListChunking`: Enable the API clients to retrieve (`LIST` or `GET`)
  resources from API server in chunks.
- `APIPriorityAndFairness`: Enable managing request concurrency with
  prioritization and fairness at each server. (Renamed from `RequestManagement`)
- `APIResponseCompression`: Compress the API responses for `LIST` or `GET` requests.
- `APISelfSubjectReview`: Activate the `SelfSubjectReview` API which allows users
  to see the requesting subject's authentication information.
  See [API access to authentication information for a client](/docs/reference/access-authn-authz/authentication/#self-subject-review)
  for more details.
- `APIServerIdentity`: Assign each API server an ID in a cluster, using a [Lease](/docs/concepts/architecture/leases).
- `APIServerTracing`: Add support for distributed tracing in the API server.
  See [Traces for Kubernetes System Components](/docs/concepts/cluster-administration/system-traces) for more details.
- `AggregatedDiscoveryEndpoint`: Enable a single HTTP endpoint `/discovery/<version>` which
  supports native HTTP caching with ETags containing all APIResources known to the API server.
- `AnyVolumeDataSource`: Enable use of any custom resource as the `DataSource` of a
  {{< glossary_tooltip text="PVC" term_id="persistent-volume-claim" >}}.
- `AppArmor`: Enable use of AppArmor mandatory access control for Pods running on Linux nodes.
  See [AppArmor Tutorial](/docs/tutorials/security/apparmor/) for more details.
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
- `CSIMigrationAzureFile`: Enables shims and translation logic to route volume
  operations from the Azure-File in-tree plugin to AzureFile CSI plugin.
  Supports falling back to in-tree AzureFile plugin for mount operations to
  nodes that have the feature disabled or that do not have AzureFile CSI plugin
  installed and configured. Does not support falling back for provision
  operations, for those the CSI plugin must be installed and configured.
  Requires CSIMigration feature flag enabled.
- `CSIMigrationRBD`: Enables shims and translation logic to route volume
  operations from the RBD in-tree plugin to Ceph RBD CSI plugin. Requires
  CSIMigration and csiMigrationRBD feature flags enabled and Ceph CSI plugin
  installed and configured in the cluster. This flag has been deprecated in
  favor of the `InTreePluginRBDUnregister` feature flag which prevents the registration of
  in-tree RBD plugin.
- `CSIMigrationvSphere`: Enables shims and translation logic to route volume operations
  from the vSphere in-tree plugin to vSphere CSI plugin. Supports falling back
  to in-tree vSphere plugin for mount operations to nodes that have the feature
  disabled or that do not have vSphere CSI plugin installed and configured.
  Does not support falling back for provision operations, for those the CSI
  plugin must be installed and configured. Requires CSIMigration feature flag
  enabled.
- `CSIMigrationPortworx`: Enables shims and translation logic to route volume operations
  from the Portworx in-tree plugin to Portworx CSI plugin.
  Requires Portworx CSI driver to be installed and configured in the cluster.
- `CSINodeExpandSecret`: Enable passing secret authentication data to a CSI driver for use
   during a `NodeExpandVolume` CSI operation.
- `CSIVolumeHealth`: Enable support for CSI volume health monitoring on node.
- `CloudControllerManagerWebhook`: Enable webhooks in cloud controller manager.
- `CloudDualStackNodeIPs`: Enables dual-stack `kubelet --node-ip` with external cloud providers.
  See [Configure IPv4/IPv6 dual-stack](/docs/concepts/services-networking/dual-stack/#configure-ipv4-ipv6-dual-stack)
  for more details.
- `ClusterTrustBundle`: Enable ClusterTrustBundle objects and kubelet integration.
- `ComponentSLIs`: Enable the `/metrics/slis` endpoint on Kubernetes components like
  kubelet, kube-scheduler, kube-proxy, kube-controller-manager, cloud-controller-manager
  allowing you to scrape health check metrics.
- `ConsistentHTTPGetHandlers`: Normalize HTTP get URL and Header passing for lifecycle
  handlers with probers.
- `ConsistentListFromCache`: Allow the API server to serve consistent lists from cache.
- `ContainerCheckpoint`: Enables the kubelet `checkpoint` API.
  See [Kubelet Checkpoint API](/docs/reference/node/kubelet-checkpoint-api/) for more details.
- `ContextualLogging`: When you enable this feature gate, Kubernetes components that support
   contextual logging add extra detail to log output.
- `CronJobsScheduledAnnotation`: Set the scheduled job time as an
  {{< glossary_tooltip text="annotation" term_id="annotation" >}} on Jobs that were created
  on behalf of a CronJob.
- `CronJobTimeZone`: Allow the use of the `timeZone` optional field in [CronJobs](/docs/concepts/workloads/controllers/cron-jobs/)
- `CRDValidationRatcheting`: Enable updates to custom resources to contain 
   violations of their OpenAPI schema if the offending portions of the resource
   update did not change. See [Validation Ratcheting](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#validation-ratcheting) for more details.
- `CrossNamespaceVolumeDataSource`: Enable the usage of cross namespace volume data source
   to allow you to specify a source namespace in the `dataSourceRef` field of a
   PersistentVolumeClaim.
- `CustomCPUCFSQuotaPeriod`: Enable nodes to change `cpuCFSQuotaPeriod` in
  [kubelet config](/docs/tasks/administer-cluster/kubelet-config-file/).
- `CustomResourceValidationExpressions`: Enable expression language validation in CRD
  which will validate customer resource based on validation rules written in
  the `x-kubernetes-validations` extension.
- `DaemonSetUpdateSurge`: Enables the DaemonSet workloads to maintain
  availability during update per node.
  See [Perform a Rolling Update on a DaemonSet](/docs/tasks/manage-daemon/update-daemon-set/).
- `DefaultHostNetworkHostPortsInPodTemplates`: Changes when the default value of
  `PodSpec.containers[*].ports[*].hostPort`
  is assigned. The default is to only set a default value in Pods.
  Enabling this means a default will be assigned even to embedded
  PodSpecs (e.g. in a Deployment), which is the historical default.
- `DevicePluginCDIDevices`: Enable support to CDI device IDs in the
  [Device Plugin](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) API.
- `DisableCloudProviders`: Disables any functionality in `kube-apiserver`,
  `kube-controller-manager` and `kubelet` related to the `--cloud-provider`
  component flag.
- `DisableKubeletCloudCredentialProviders`: Disable the in-tree functionality in kubelet
  to authenticate to a cloud provider container registry for image pull credentials.
- `DownwardAPIHugePages`: Enables usage of hugepages in
  [downward API](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information).
- `DynamicResourceAllocation`: Enables support for resources with custom parameters and a lifecycle
  that is independent of a Pod.
- `ElasticIndexedJob`: Enables Indexed Jobs to be scaled up or down by mutating both
  `spec.completions` and `spec.parallelism` together such that `spec.completions == spec.parallelism`.
  See docs on [elastic Indexed Jobs](/docs/concepts/workloads/controllers/job#elastic-indexed-jobs)
  for more details.
- `EfficientWatchResumption`: Allows for storage-originated bookmark (progress
  notify) events to be delivered to the users. This is only applied to watch operations.
- `EventedPLEG`: Enable support for the kubelet to receive container life cycle events from the
  {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}} via
  an extension to {{<glossary_tooltip term_id="cri" text="CRI">}}.
  (PLEG is an abbreviation for “Pod lifecycle event generator”).
  For this feature to be useful, you also need to enable support for container lifecycle events
  in each container runtime running in your cluster. If the container runtime does not announce
  support for container lifecycle events then the kubelet automatically switches to the legacy
  generic PLEG mechanism, even if you have this feature gate enabled.
- `ExecProbeTimeout`: Ensure kubelet respects exec probe timeouts.
  This feature gate exists in case any of your existing workloads depend on a
  now-corrected fault where Kubernetes ignored exec probe timeouts. See
  [readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes).
- `ExpandedDNSConfig`: Enable kubelet and kube-apiserver to allow more DNS
  search paths and longer list of DNS search paths. This feature requires container
  runtime support(Containerd: v1.5.6 or higher, CRI-O: v1.22 or higher). See
  [Expanded DNS Configuration](/docs/concepts/services-networking/dns-pod-service/#expanded-dns-configuration).
- `ExperimentalHostUserNamespaceDefaulting`: Enabling the defaulting user
  namespace to host. This is for containers that are using other host namespaces,
  host mounts, or containers that are privileged or using specific non-namespaced
  capabilities (e.g. `MKNODE`, `SYS_MODULE` etc.). This should only be enabled
  if user namespace remapping is enabled in the Docker daemon.
- `GracefulNodeShutdown`: Enables support for graceful shutdown in kubelet.
  During a system shutdown, kubelet will attempt to detect the shutdown event
  and gracefully terminate pods running on the node. See
  [Graceful Node Shutdown](/docs/concepts/architecture/nodes/#graceful-node-shutdown)
  for more details.
- `GracefulNodeShutdownBasedOnPodPriority`: Enables the kubelet to check Pod priorities
  when shutting down a node gracefully.
- `GRPCContainerProbe`: Enables the gRPC probe method for {Liveness,Readiness,Startup}Probe.
  See [Configure Liveness, Readiness and Startup Probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#define-a-grpc-liveness-probe).
- `HonorPVReclaimPolicy`: Honor persistent volume reclaim policy when it is `Delete` irrespective of PV-PVC deletion ordering.
  For more details, check the
  [PersistentVolume deletion protection finalizer](/docs/concepts/storage/persistent-volumes/#persistentvolume-deletion-protection-finalizer)
  documentation.
- `HPAContainerMetrics`: Enable the `HorizontalPodAutoscaler` to scale based on
  metrics from individual containers in target pods.
- `HPAScaleToZero`: Enables setting `minReplicas` to 0 for `HorizontalPodAutoscaler`
  resources when using custom or external metrics.
- `IPTablesOwnershipCleanup`: This causes kubelet to no longer create legacy iptables rules.
- `InPlacePodVerticalScaling`: Enables in-place Pod vertical scaling.
- `InTreePluginAWSUnregister`: Stops registering the aws-ebs in-tree plugin in kubelet
  and volume controllers.
- `InTreePluginAzureDiskUnregister`: Stops registering the azuredisk in-tree plugin in kubelet
  and volume controllers.
- `InTreePluginAzureFileUnregister`: Stops registering the azurefile in-tree plugin in kubelet
  and volume controllers.
- `InTreePluginGCEUnregister`: Stops registering the gce-pd in-tree plugin in kubelet
  and volume controllers.
- `InTreePluginOpenStackUnregister`: Stops registering the OpenStack cinder in-tree plugin in kubelet
  and volume controllers.
- `InTreePluginPortworxUnregister`: Stops registering the Portworx in-tree plugin in kubelet
  and volume controllers.
- `InTreePluginRBDUnregister`: Stops registering the RBD in-tree plugin in kubelet
  and volume controllers.
- `InTreePluginvSphereUnregister`: Stops registering the vSphere in-tree plugin in kubelet
  and volume controllers.
- `JobMutableNodeSchedulingDirectives`: Allows updating node scheduling directives in
  the pod template of [Job](/docs/concepts/workloads/controllers/job).
- `JobBackoffLimitPerIndex`: Allows specifying the maximal number of pod
  retries per index in Indexed jobs.
- `JobPodFailurePolicy`: Allow users to specify handling of pod failures based on container
  exit codes and pod conditions.
- `JobPodReplacementPolicy`: Allows you to specify pod replacement for terminating pods in a [Job](/docs/concepts/workloads/controllers/job)
- `JobReadyPods`: Enables tracking the number of Pods that have a `Ready`
  [condition](/docs/concepts/workloads/pods/pod-lifecycle/#pod-conditions).
  The count of `Ready` pods is recorded in the
  [status](/docs/reference/kubernetes-api/workload-resources/job-v1/#JobStatus)
  of a [Job](/docs/concepts/workloads/controllers/job) status.
- `JobTrackingWithFinalizers`: Enables tracking [Job](/docs/concepts/workloads/controllers/job)
  completions without relying on Pods remaining in the cluster indefinitely.
  The Job controller uses Pod finalizers and a field in the Job status to keep
  track of the finished Pods to count towards completion.
- `KMSv1`: Enables KMS v1 API for encryption at rest. See [Using a KMS Provider for data encryption](/docs/tasks/administer-cluster/kms-provider) for more details.
- `KMSv2`: Enables KMS v2 API for encryption at rest. See [Using a KMS Provider for data encryption](/docs/tasks/administer-cluster/kms-provider) for more details.
- `KMSv2KDF`: Enables KMS v2 to generate single use data encryption keys.
  See [Using a KMS Provider for data encryption](/docs/tasks/administer-cluster/kms-provider) for more details.
  If the `KMSv2` feature gate is not enabled in your cluster, the value of the `KMSv2KDF` feature gate has no effect.
- `KubeProxyDrainingTerminatingNodes`: Implement connection draining for
  terminating nodes for `externalTrafficPolicy: Cluster` services.
- `KubeletCgroupDriverFromCRI`: Enable detection of the kubelet cgroup driver
  configuration option from the {{<glossary_tooltip term_id="cri" text="CRI">}}.
  You can use this feature gate on nodes with a kubelet that supports the feature gate
  and where there is a CRI container runtime that supports the `RuntimeConfig`
  CRI call. If both CRI and kubelet support this feature, the kubelet ignores the
  `cgroupDriver` configuration setting (or deprecated `--cgroup-driver` command
  line argument). If you enable this feature gate and the container runtime
  doesn't support it, the kubelet falls back to using the driver configured using
  the `cgroupDriver` configuration setting.
  See [Configuring a cgroup driver](/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver)
  for more details.
- `KubeletInUserNamespace`: Enables support for running kubelet in a
  {{<glossary_tooltip text="user namespace" term_id="userns">}}.
   See [Running Kubernetes Node Components as a Non-root User](/docs/tasks/administer-cluster/kubelet-in-userns/).
- `KubeletPodResources`: Enable the kubelet's pod resources gRPC endpoint. See
  [Support Device Monitoring](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/606-compute-device-assignment/README.md)
  for more details.
- `KubeletPodResourcesGet`: Enable the `Get` gRPC endpoint on kubelet's for Pod resources.
  This API augments the [resource allocation reporting](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources).
- `KubeletPodResourcesGetAllocatable`: Enable the kubelet's pod resources
  `GetAllocatableResources` functionality. This API augments the
  [resource allocation reporting](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources)
- `KubeletPodResourcesDynamicResources`: Extend the kubelet's pod resources gRPC endpoint to
  to include resources allocated in `ResourceClaims` via `DynamicResourceAllocation` API.
  See [resource allocation reporting](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#monitoring-device-plugin-resources) for more details.
  with informations about the allocatable resources, enabling clients to properly
  track the free compute resources on a node.
- `KubeletTracing`: Add support for distributed tracing in the kubelet.
  When enabled, kubelet CRI interface and authenticated http servers are instrumented to generate
  OpenTelemetry trace spans.
  See [Traces for Kubernetes System Components](/docs/concepts/cluster-administration/system-traces) for more details.
- `LegacyServiceAccountTokenNoAutoGeneration`: Stop auto-generation of Secret-based
  [service account tokens](/docs/concepts/security/service-accounts/#get-a-token).
- `LegacyServiceAccountTokenCleanUp`: Enable cleaning up Secret-based
  [service account tokens](/docs/concepts/security/service-accounts/#get-a-token)
  when they are not used in a specified time (default to be one year).
- `LegacyServiceAccountTokenTracking`: Track usage of Secret-based
  [service account tokens](/docs/concepts/security/service-accounts/#get-a-token).
- `LocalStorageCapacityIsolationFSQuotaMonitoring`: When `LocalStorageCapacityIsolation`
  is enabled for
  [local ephemeral storage](/docs/concepts/configuration/manage-resources-containers/)
  and the backing filesystem for [emptyDir volumes](/docs/concepts/storage/volumes/#emptydir)
  supports project quotas and they are enabled, use project quotas to monitor
  [emptyDir volume](/docs/concepts/storage/volumes/#emptydir) storage consumption rather than
  filesystem walk for better performance and accuracy.
- `LogarithmicScaleDown`: Enable semi-random selection of pods to evict on controller scaledown
  based on logarithmic bucketing of pod timestamps.
- `LoggingAlphaOptions`: Allow fine-tuing of experimental, alpha-quality logging options.
- `LoggingBetaOptions`: Allow fine-tuing of experimental, beta-quality logging options.
- `MatchLabelKeysInPodTopologySpread`: Enable the `matchLabelKeys` field for
  [Pod topology spread constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/).
- `MaxUnavailableStatefulSet`: Enables setting the `maxUnavailable` field for the
  [rolling update strategy](/docs/concepts/workloads/controllers/statefulset/#rolling-updates)
  of a StatefulSet. The field specifies the maximum number of Pods
  that can be unavailable during the update.
- `MemoryManager`: Allows setting memory affinity for a container based on
  NUMA topology.
- `MemoryQoS`: Enable memory protection and usage throttle on pod / container using
  cgroup v2 memory controller.
- `MinDomainsInPodTopologySpread`: Enable `minDomains` in
  [Pod topology spread constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/).
- `MinimizeIPTablesRestore`: Enables new performance improvement logics
  in the kube-proxy iptables mode.
- `MultiCIDRRangeAllocator`: Enables the MultiCIDR range allocator.
- `MultiCIDRServiceAllocator`: Track IP address allocations for Service cluster IPs using IPAddress objects.
- `NewVolumeManagerReconstruction`: Enables improved discovery of mounted volumes during kubelet
  startup. Since this code has been significantly refactored, we allow to opt-out in case kubelet
  gets stuck at the startup or is not unmounting volumes from terminated Pods. Note that this
  refactoring was behind `SELinuxMountReadWriteOncePod` alpha feature gate in Kubernetes 1.25.
  <!-- remove next 2 paragraphs when feature graduates to GA -->
  Before Kubernetes v1.25, the kubelet used different default behavior for discovering mounted
  volumes during the kubelet startup. If you disable this feature gate (it's enabled by default), you select
  the legacy discovery behavior.

  In Kubernetes v1.25 and v1.26, this behavior toggle was part of the `SELinuxMountReadWriteOncePod`
  feature gate.
- `NodeInclusionPolicyInPodTopologySpread`: Enable using `nodeAffinityPolicy` and `nodeTaintsPolicy` in
  [Pod topology spread constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/)
  when calculating pod topology spread skew.
- `NodeLogQuery`: Enables querying logs of node services using the `/logs` endpoint.
- `NodeOutOfServiceVolumeDetach`: When a Node is marked out-of-service using the
  `node.kubernetes.io/out-of-service` taint, Pods on the node will be forcefully deleted
   if they can not tolerate this taint, and the volume detach operations for Pods terminating
   on the node will happen immediately. The deleted Pods can recover quickly on different nodes.
- `NodeSwap`: Enable the kubelet to allocate swap memory for Kubernetes workloads on a node.
  Must be used with `KubeletConfiguration.failSwapOn` set to false.
  For more details, please see [swap memory](/docs/concepts/architecture/nodes/#swap-memory)
- `OpenAPIEnums`: Enables populating "enum" fields of OpenAPI schemas in the
  spec returned from the API server.
- `OpenAPIV3`: Enables the API server to publish OpenAPI v3.
- `PDBUnhealthyPodEvictionPolicy`: Enables the `unhealthyPodEvictionPolicy` field of a `PodDisruptionBudget`. This specifies
  when unhealthy pods should be considered for eviction. Please see [Unhealthy Pod Eviction Policy](/docs/tasks/run-application/configure-pdb/#unhealthy-pod-eviction-policy)
  for more details.
- `PersistentVolumeLastPhaseTransitionTime`: Adds a new field to PersistentVolume
  which holds a timestamp of when the volume last transitioned its phase.
- `PodAndContainerStatsFromCRI`: Configure the kubelet to gather container and pod stats from the CRI container runtime rather than gathering them from cAdvisor.
  As of 1.26, this also includes gathering metrics from CRI and emitting them over `/metrics/cadvisor` (rather than having cAdvisor emit them directly).
- `PodDeletionCost`: Enable the [Pod Deletion Cost](/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost)
   feature which allows users to influence ReplicaSet downscaling order.
- `PodDisruptionConditions`: Enables support for appending a dedicated pod condition indicating that the pod is being deleted due to a disruption.
- `PodHostIPs`: Enable the `status.hostIPs` field for pods and the {{< glossary_tooltip term_id="downward-api" text="downward API" >}}.
  The field lets you expose host IP addresses to workloads.
- `PodIndexLabel`: Enables the Job controller and StatefulSet controller to add the pod index as a label when creating new pods. See [Job completion mode docs](/docs/concepts/workloads/controllers/job#completion-mode) and [StatefulSet pod index label docs](/docs/concepts/workloads/controllers/statefulset/#pod-index-label) for more details.
- `PodReadyToStartContainersCondition`: Enable the kubelet to mark the [PodReadyToStartContainers](/docs/concepts/workloads/pods/pod-lifecycle/#pod-has-network)
  condition on pods. This was previously (1.25-1.27) known as `PodHasNetworkCondition`.
- `PodSchedulingReadiness`: Enable setting `schedulingGates` field to control a Pod's [scheduling readiness](/docs/concepts/scheduling-eviction/pod-scheduling-readiness).
- `ProbeTerminationGracePeriod`: Enable [setting probe-level
  `terminationGracePeriodSeconds`](/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#probe-level-terminationgraceperiodseconds)
  on pods. See the [enhancement proposal](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2238-liveness-probe-grace-period)
  for more details.
- `ProcMountType`: Enables control over the type proc mounts for containers
  by setting the `procMount` field of a SecurityContext.
- `ProxyTerminatingEndpoints`: Enable the kube-proxy to handle terminating
  endpoints when `ExternalTrafficPolicy=Local`.
- `QOSReserved`: Allows resource reservations at the QoS level preventing pods
  at lower QoS levels from bursting into resources requested at higher QoS levels
  (memory only for now).
- `ReadWriteOncePod`: Enables the usage of `ReadWriteOncePod` PersistentVolume
  access mode.
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
- `RetroactiveDefaultStorageClass`: Allow assigning StorageClass to unbound PVCs retroactively.
- `RotateKubeletServerCertificate`: Enable the rotation of the server TLS certificate on the kubelet.
  See [kubelet configuration](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#kubelet-configuration)
  for more details.
- `SELinuxMountReadWriteOncePod`: Speeds up container startup by allowing kubelet to mount volumes
  for a Pod directly with the correct SELinux label instead of changing each file on the volumes
  recursively. The initial implementation focused on ReadWriteOncePod volumes.
- `SchedulerQueueingHints`: Enables the scheduler's _queueing hints_ enhancement,
  which benefits to reduce the useless requeueing.
- `SeccompDefault`: Enables the use of `RuntimeDefault` as the default seccomp profile
  for all workloads.
  The seccomp profile is specified in the `securityContext` of a Pod and/or a Container.
- `SecurityContextDeny`: This gate signals that the `SecurityContextDeny` admission controller is deprecated.
- `ServerSideApply`: Enables the [Sever Side Apply (SSA)](/docs/reference/using-api/server-side-apply/)
  feature on the API Server.
- `ServerSideFieldValidation`: Enables server-side field validation. This means the validation
  of resource schema is performed at the API server side rather than the client side
  (for example, the `kubectl create` or `kubectl apply` command line).
- `SidecarContainers`: Allow setting the `restartPolicy` of an init container to
  `Always` so that the container becomes a sidecar container (restartable init containers).
  See
  [Sidecar containers and restartPolicy](/docs/concepts/workloads/pods/init-containers/#sidecar-containers-and-restartpolicy)
  for more details.
- `SizeMemoryBackedVolumes`: Enable kubelets to determine the size limit for
  memory-backed volumes (mainly `emptyDir` volumes).
- `SkipReadOnlyValidationGCE`: Skip validation for GCE, will enable in the
  next version.
- `StableLoadBalancerNodeSet`: Enables less load balancer re-configurations by
  the service controller (KCCM) as an effect of changing node state.
- `StatefulSetStartOrdinal`: Allow configuration of the start ordinal in a
  StatefulSet. See
  [Start ordinal](/docs/concepts/workloads/controllers/statefulset/#start-ordinal)
  for more details.
- `StorageVersionAPI`: Enable the
  [storage version API](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#storageversion-v1alpha1-internal-apiserver-k8s-io).
- `StorageVersionHash`: Allow API servers to expose the storage version hash in the
  discovery.
- `TopologyAwareHints`: Enables topology aware routing based on topology hints
  in EndpointSlices. See [Topology Aware
  Hints](/docs/concepts/services-networking/topology-aware-hints/) for more
  details.
- `TopologyManager`: Enable a mechanism to coordinate fine-grained hardware resource
  assignments for different components in Kubernetes. See
  [Control Topology Management Policies on a node](/docs/tasks/administer-cluster/topology-manager/).
- `TopologyManagerPolicyAlphaOptions`: Allow fine-tuning of topology manager policies,
  experimental, Alpha-quality options.
  This feature gate guards *a group* of topology manager options whose quality level is alpha.
  This feature gate will never graduate to beta or stable.
- `TopologyManagerPolicyBetaOptions`: Allow fine-tuning of topology manager policies,
  experimental, Beta-quality options.
  This feature gate guards *a group* of topology manager options whose quality level is beta.
  This feature gate will never graduate to stable.
- `TopologyManagerPolicyOptions`: Allow fine-tuning of topology manager policies,
- `UnknownVersionInteroperabilityProxy`: Proxy resource requests to the correct peer kube-apiserver when
  multiple kube-apiservers exist at varied versions.
  See [Mixed version proxy](/docs/concepts/architecture/mixed-version-proxy/) for more information.
- `UserNamespacesSupport`: Enable user namespace support for Pods.
  Before Kubernetes v1.28, this feature gate was named `UserNamespacesStatelessPodsSupport`.
- `ValidatingAdmissionPolicy`: Enable [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/) support for CEL validations be used in Admission Control.
- `VolumeCapacityPriority`: Enable support for prioritizing nodes in different
  topologies based on available PV capacity.
- `WatchBookmark`: Enable support for watch bookmark events.
- `WatchList` : Enable support for [streaming initial state of objects in watch requests](/docs/reference/using-api/api-concepts/#streaming-lists).
- `WinDSR`: Allows kube-proxy to create DSR loadbalancers for Windows.
- `WinOverlay`: Allows kube-proxy to run in overlay mode for Windows.
- `WindowsHostNetwork`: Enables support for joining Windows containers to a hosts' network namespace.


## {{% heading "whatsnext" %}}

* The [deprecation policy](/docs/reference/using-api/deprecation-policy/) for Kubernetes explains
  the project's approach to removing features and components.
* Since Kubernetes 1.24, new beta APIs are not enabled by default.  When enabling a beta
  feature, you will also need to enable any associated API resources.
  For example, to enable a particular resource like
  `storage.k8s.io/v1beta1/csistoragecapacities`, set `--runtime-config=storage.k8s.io/v1beta1/csistoragecapacities`.
  See [API Versioning](/docs/reference/using-api/#api-versioning) for more details on the command line flags.
