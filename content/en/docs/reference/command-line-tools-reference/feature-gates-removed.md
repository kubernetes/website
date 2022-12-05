---
title: Feature Gates (removed)
weight: 15
content_type: concept
---

<!-- overview -->

This page contains list of feature gates that have been removed. The information on this page is for reference.
A removed feature gate is different from a GA'ed or deprecated one in that a removed one is
no longer recognized as a valid feature gate.
However, a GA'ed or a deprecated feature gate is still recognized by the corresponding Kubernetes
components although they are unable to cause any behavior differences in a cluster.

For feature gates that are still recognized by the Kubernetes components, please refer to
the [Alpha/Beta feature gate table](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-alpha-or-beta-features)
or the [Graduated/Deprecated feature gate table](/docs/reference/command-line-tools-reference/feature-gates/#feature-gates-for-graduated-or-deprecated-features)

### Feature gates that are removed

In the following table:

- The "From" column contains the Kubernetes release when a feature is introduced
  or its release stage is changed.
- The "To" column, if not empty, contains the last Kubernetes release in which
  you can still use a feature gate. If the feature stage is either "Deprecated"
  or "GA", the "To" column is the Kubernetes release when the feature is removed.

{{< table caption="Feature Gates Removed" >}}

| Feature | Default | Stage | From | To |
|---------|---------|-------|-------|-------|
| `Accelerators` | `false` | Alpha | 1.6 | 1.10 |
| `Accelerators` | - | Deprecated | 1.11 | 1.11 |
| `AffinityInAnnotations` | `false` | Alpha | 1.6 | 1.7 |
| `AffinityInAnnotations` | - | Deprecated | 1.8 | 1.8 |
| `AllowExtTrafficLocalEndpoints` | `false` | Beta | 1.4 | 1.6 |
| `AllowExtTrafficLocalEndpoints` | `true` | GA | 1.7 | 1.9 |
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
| `CSIMigrationAWSComplete` | `false` | Alpha | 1.17 | 1.20 |
| `CSIMigrationAWSComplete` | - | Deprecated | 1.21 | 1.21 |
| `CSIMigrationAzureDiskComplete` | `false` | Alpha | 1.17 | 1.20 |
| `CSIMigrationAzureDiskComplete` | - | Deprecated | 1.21 | 1.21 |
| `CSIMigrationAzureFileComplete` | `false` | Alpha | 1.17 | 1.20 |
| `CSIMigrationAzureFileComplete` | - | Deprecated |  1.21 | 1.21 |
| `CSIMigrationGCEComplete` | `false` | Alpha | 1.17 | 1.20 |
| `CSIMigrationGCEComplete` | - | Deprecated | 1.21 | 1.21 |
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
| `ConfigurableFSGroupPolicy` | `false` | Alpha | 1.18 | 1.19 |
| `ConfigurableFSGroupPolicy` | `true` | Beta | 1.20 | 1.22 |
| `ConfigurableFSGroupPolicy` | `true` | GA | 1.23 | 1.25 |
| `CronJobControllerV2` | `false` | Alpha | 1.20 | 1.20 |
| `CronJobControllerV2` | `true` | Beta | 1.21 | 1.21 |
| `CronJobControllerV2` | `true` | GA | 1.22 | 1.23 |
| `CSRDuration` | `true` | Beta | 1.22 | 1.23 |
| `CSRDuration` | `true` | GA | 1.24 | 1.25 |
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
| `DynamicAuditing` | `false` | Alpha | 1.13 | 1.18 |
| `DynamicAuditing` | - | Deprecated | 1.19 | 1.19 |
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
| `EvenPodsSpread` | `false` | Alpha | 1.16 | 1.17 |
| `EvenPodsSpread` | `true` | Beta | 1.18 | 1.18 |
| `EvenPodsSpread` | `true` | GA | 1.19 | 1.21 |
| `ExpandCSIVolumes` | `false` | Alpha | 1.14 | 1.15 |
| `ExpandCSIVolumes` | `true` | Beta | 1.16 | 1.23 |
| `ExpandCSIVolumes` | `true` | GA | 1.24 | 1.27 |
| `ExpandInUsePersistentVolumes` | `false` | Alpha | 1.11 | 1.14 |
| `ExpandInUsePersistentVolumes` | `true` | Beta | 1.15 | 1.23 |
| `ExpandInUsePersistentVolumes` | `true` | GA | 1.24 | 1.27 |
| `ExpandPersistentVolumes` | `false` | Alpha | 1.8 | 1.10 |
| `ExpandPersistentVolumes` | `true` | Beta | 1.11 | 1.23 |
| `ExpandPersistentVolumes` | `true` | GA | 1.24 | 1.27 |
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
| `ImmutableEphemeralVolumes` | `false` | Alpha | 1.18 | 1.18 |
| `ImmutableEphemeralVolumes` | `true` | Beta | 1.19 | 1.20 |
| `ImmutableEphemeralVolumes` | `true` | GA | 1.21 | 1.24 |
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
| `MountContainers` | `false` | Alpha | 1.9 | 1.16 |
| `MountContainers` | `false` | Deprecated | 1.17 | 1.17 |
| `MountPropagation` | `false` | Alpha | 1.8 | 1.9 |
| `MountPropagation` | `true` | Beta | 1.10 | 1.11 |
| `MountPropagation` | `true` | GA | 1.12 | 1.14 |
| `NamespaceDefaultLabelName` | `true` | Beta | 1.21 | 1.21 |
| `NamespaceDefaultLabelName` | `true` | GA | 1.22 | 1.23 |
| `NodeDisruptionExclusion` | `false` | Alpha | 1.16 | 1.18 |
| `NodeDisruptionExclusion` | `true` | Beta | 1.19 | 1.20 |
| `NodeDisruptionExclusion` | `true` | GA | 1.21 | 1.22 |
| `NodeLease` | `false` | Alpha | 1.12 | 1.13 |
| `NodeLease` | `true` | Beta | 1.14 | 1.16 |
| `NodeLease` | `true` | GA | 1.17 | 1.23 |
| `PVCProtection` | `false` | Alpha | 1.9 | 1.9 |
| `PVCProtection` | - | Deprecated | 1.10 | 1.10 |
| `PersistentLocalVolumes` | `false` | Alpha | 1.7 | 1.9 |
| `PersistentLocalVolumes` | `true` | Beta | 1.10 | 1.13 |
| `PersistentLocalVolumes` | `true` | GA | 1.14 | 1.16 |
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

## Descriptions for removed feature gates

- `Accelerators`: Provided an early form of plugin to enable Nvidia GPU support when using
  Docker Engine; no longer available. See
  [Device Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/) for
  an alternative.

- `AffinityInAnnotations`: Enable setting
  [Pod affinity or anti-affinity](/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity).

- `AllowExtTrafficLocalEndpoints`: Enable a service to route external requests to node local endpoints.

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
  `csi.storage.k8s.io`.

- `CSIMigrationAWSComplete`: Stops registering the EBS in-tree plugin in
  kubelet and volume controllers and enables shims and translation logic to
  route volume operations from the AWS-EBS in-tree plugin to EBS CSI plugin.
  Requires CSIMigration and CSIMigrationAWS feature flags enabled and EBS CSI
  plugin installed and configured on all nodes in the cluster. This flag has
  been deprecated in favor of the `InTreePluginAWSUnregister` feature flag
  which prevents the registration of in-tree EBS plugin.

- `CSIMigrationAzureDiskComplete`: Stops registering the Azure-Disk in-tree
  plugin in kubelet and volume controllers and enables shims and translation
  logic to route volume operations from the Azure-Disk in-tree plugin to
  AzureDisk CSI plugin. Requires CSIMigration and CSIMigrationAzureDisk feature
  flags enabled and AzureDisk CSI plugin installed and configured on all nodes
  in the cluster. This flag has been deprecated in favor of the
  `InTreePluginAzureDiskUnregister` feature flag which prevents the registration
  of in-tree AzureDisk plugin.

- `CSIMigrationAzureFileComplete`: Stops registering the Azure-File in-tree
  plugin in kubelet and volume controllers and enables shims and translation
  logic to route volume operations from the Azure-File in-tree plugin to
  AzureFile CSI plugin. Requires CSIMigration and CSIMigrationAzureFile feature
  flags  enabled and AzureFile CSI plugin installed and configured on all nodes
  in the cluster. This flag has been deprecated in favor of the
  `InTreePluginAzureFileUnregister` feature flag which prevents the registration
   of in-tree AzureFile plugin.

- `CSIMigrationGCEComplete`: Stops registering the GCE-PD in-tree plugin in
  kubelet and volume controllers and enables shims and translation logic to
  route volume operations from the GCE-PD in-tree plugin to PD CSI plugin.
  Requires CSIMigration and CSIMigrationGCE feature flags enabled and PD CSI
  plugin installed and configured on all nodes in the cluster. This flag has
  been deprecated in favor of the `InTreePluginGCEUnregister` feature flag which
  prevents the registration of in-tree GCE PD plugin.

- `CSIMigrationOpenStackComplete`: Stops registering the Cinder in-tree plugin in
  kubelet and volume controllers and enables shims and translation logic to route
  volume operations from the Cinder in-tree plugin to Cinder CSI plugin.
  Requires CSIMigration and CSIMigrationOpenStack feature flags enabled and Cinder
  CSI plugin installed and configured on all nodes in the cluster. This flag has
  been deprecated in favor of the `InTreePluginOpenStackUnregister` feature flag
  which prevents the registration of in-tree openstack cinder plugin.

- `CSIMigrationvSphereComplete`: Stops registering the vSphere in-tree plugin in kubelet
  and volume controllers and enables shims and translation logic to route volume operations
  from the vSphere in-tree plugin to vSphere CSI plugin. Requires CSIMigration and
  CSIMigrationvSphere feature flags enabled and vSphere CSI plugin installed and
  configured on all nodes in the cluster. This flag has been deprecated in favor
  of the `InTreePluginvSphereUnregister` feature flag which prevents the
  registration of in-tree vsphere plugin.

- `CSINodeInfo`: Enable all logic related to the CSINodeInfo API object in `csi.storage.k8s.io`.

- `CSIPersistentVolume`: Enable discovering and mounting volumes provisioned through a
  [CSI (Container Storage Interface)](https://git.k8s.io/design-proposals-archive/storage/container-storage-interface.md)
  compatible volume plugin.

- `CSIServiceAccountToken`: Enable CSI drivers to receive the pods' service account token
  that they mount volumes for. See
  [Token Requests](https://kubernetes-csi.github.io/docs/token-requests.html).

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

- `CustomPodDNS`: Enable customizing the DNS settings for a Pod using its `dnsConfig` property.
  Check [Pod's DNS Config](/docs/concepts/services-networking/dns-pod-service/#pods-dns-config)
  for more details.

- `CustomResourceDefaulting`: Enable CRD support for default values in OpenAPI v3 validation schemas.

- `CustomResourcePublishOpenAPI`: Enables publishing of CRD OpenAPI specs.

- `CustomResourceSubresources`: Enable `/status` and `/scale` subresources
  on resources created from [CustomResourceDefinition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).

- `CustomResourceValidation`: Enable schema based validation on resources created from
  [CustomResourceDefinition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).

- `CustomResourceWebhookConversion`: Enable webhook-based conversion
  on resources created from [CustomResourceDefinition](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).

- `DynamicAuditing`: Used to enable dynamic auditing before v1.19.

- `DynamicProvisioningScheduling`: Extend the default scheduler to be aware of
  volume topology and handle PV provisioning.
  This feature was superseded by the `VolumeScheduling` feature  in v1.12.

- `DynamicVolumeProvisioning`: Enable the
  [dynamic provisioning](/docs/concepts/storage/dynamic-provisioning/) of persistent volumes to Pods.

- `EnableAggregatedDiscoveryTimeout`: Enable the five second
  timeout on aggregated discovery calls.

- `EnableEquivalenceClassCache`: Enable the scheduler to cache equivalence of
  nodes when scheduling Pods.

- `EndpointSlice`: Enables EndpointSlices for more scalable and extensible
   network endpoints. See [Enabling EndpointSlices](/docs/concepts/services-networking/endpoint-slices/).

- `EndpointSliceNodeName`: Enables EndpointSlice `nodeName` field.

- `EndpointSliceProxying`: When enabled, kube-proxy running
   on Linux will use EndpointSlices as the primary data source instead of
   Endpoints, enabling scalability and performance improvements. See
   [Enabling Endpoint Slices](/docs/concepts/services-networking/endpoint-slices/).

- `EvenPodsSpread`: Enable pods to be scheduled evenly across topology domains. See
  [Pod Topology Spread Constraints](/docs/concepts/scheduling-eviction/topology-spread-constraints/).

- `ExpandCSIVolumes`: Enable the expanding of CSI volumes.

- `ExpandInUsePersistentVolumes`: Enable expanding in-use PVCs. See
  [Resizing an in-use PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#resizing-an-in-use-persistentvolumeclaim).

- `ExpandPersistentVolumes`: Enable the expanding of persistent volumes. See
  [Expanding Persistent Volumes Claims](/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims).

- `ExperimentalCriticalPodAnnotation`: Enable annotating specific pods as *critical*
  so that their [scheduling is guaranteed](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/).
  This feature is deprecated by Pod Priority and Preemption as of v1.13.

- `ExternalPolicyForExternalIP`: Fix a bug where ExternalTrafficPolicy is not
  applied to Service ExternalIPs.

- `GCERegionalPersistentDisk`: Enable the regional PD feature on GCE.

- `GenericEphemeralVolume`: Enables ephemeral, inline volumes that support all features
  of normal volumes (can be provided by third-party storage vendors, storage capacity tracking,
  restore from snapshot, etc.).
  See [Ephemeral Volumes](/docs/concepts/storage/ephemeral-volumes/).

- `HugePageStorageMediumSize`: Enable support for multiple sizes pre-allocated
  [huge pages](/docs/tasks/manage-hugepages/scheduling-hugepages/).

- `HugePages`: Enable the allocation and consumption of pre-allocated
  [huge pages](/docs/tasks/manage-hugepages/scheduling-hugepages/).

- `HyperVContainer`: Enable
  [Hyper-V isolation](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container)
  for Windows containers.

- `IPv6DualStack`: Enable [dual stack](/docs/concepts/services-networking/dual-stack/)
  support for IPv6.

- `ImmutableEphemeralVolumes`: Allows for marking individual Secrets and ConfigMaps as
  immutable for better safety and performance.

- `IngressClassNamespacedParams`: Allow namespace-scoped parameters reference in
  `IngressClass` resource. This feature adds two fields - `Scope` and `Namespace`
  to `IngressClass.spec.parameters`.

- `Initializers`: Allow asynchronous coordination of object creation using the
  Initializers admission plugin.

- `KubeletConfigFile`: Enable loading kubelet configuration from
  a file specified using a config file.
  See [setting kubelet parameters via a config file](/docs/tasks/administer-cluster/kubelet-config-file/)
  for more details.

- `KubeletPluginsWatcher`: Enable probe-based plugin watcher utility to enable kubelet
  to discover plugins such as [CSI volume drivers](/docs/concepts/storage/volumes/#csi).

- `LegacyNodeRoleBehavior`: When disabled, legacy behavior in service load balancers and
  node disruption will ignore the `node-role.kubernetes.io/master` label in favor of the
  feature-specific labels provided by `NodeDisruptionExclusion` and `ServiceNodeExclusion`.

- `MountContainers`: Enable using utility containers on host as the volume mounter.

- `MountPropagation`: Enable sharing volume mounted by one container to other containers or pods.
  For more details, please see [mount propagation](/docs/concepts/storage/volumes/#mount-propagation).

- `NamespaceDefaultLabelName`: Configure the API Server to set an immutable
  {{< glossary_tooltip text="label" term_id="label" >}} `kubernetes.io/metadata.name`
  on all namespaces, containing the namespace name.

- `NodeDisruptionExclusion`: Enable use of the Node label `node.kubernetes.io/exclude-disruption`
  which prevents nodes from being evacuated during zone failures.

- `NodeLease`: Enable the new Lease API to report node heartbeats, which could be used as a node health signal.

- `PVCProtection`: Enable the prevention of a PersistentVolumeClaim (PVC) from
  being deleted when it is still used by any Pod.

- `PersistentLocalVolumes`: Enable the usage of `local` volume type in Pods.
  Pod affinity has to be specified if requesting a `local` volume.

- `PodDisruptionBudget`: Enable the [PodDisruptionBudget](/docs/tasks/run-application/configure-pdb/) feature.

- `PodOverhead`: Enable the [PodOverhead](/docs/concepts/scheduling-eviction/pod-overhead/)
  feature to account for pod overheads.

- `PodPriority`: Enable the descheduling and preemption of Pods based on their
  [priorities](/docs/concepts/scheduling-eviction/pod-priority-preemption/).

- `PodReadinessGates`: Enable the setting of `PodReadinessGate` field for extending
  Pod readiness evaluation. See [Pod readiness gate](/docs/concepts/workloads/pods/pod-lifecycle/#pod-readiness-gate)
  for more details.

- `PodShareProcessNamespace`: Enable the setting of `shareProcessNamespace` in a Pod for sharing
  a single process namespace between containers running in a pod.  More details can be found in
  [Share Process Namespace between Containers in a Pod](/docs/tasks/configure-pod-container/share-process-namespace/).

- `RequestManagement`: Enables managing request concurrency with prioritization and fairness
  at each API server. Deprecated by `APIPriorityAndFairness` since 1.17.

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

- `RotateKubeletClientCertificate`: Enable the rotation of the client TLS certificate on the kubelet.
  See [kubelet configuration](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#kubelet-configuration)
  for more details.

- `RunAsGroup`: Enable control over the primary group ID set on the init processes of containers.

- `RuntimeClass`: Enable the [RuntimeClass](/docs/concepts/containers/runtime-class/) feature for
  selecting container runtime configurations.

- `SCTPSupport`: Enables the _SCTP_ `protocol` value in Pod, Service, Endpoints, EndpointSlice,
  and NetworkPolicy definitions.

- `ScheduleDaemonSetPods`: Enable DaemonSet Pods to be scheduled by the default scheduler instead
  of the DaemonSet controller.

- `SelectorIndex`: Allows label and field based indexes in API server watch cache to accelerate
  list operations.

- `ServiceAccountIssuerDiscovery`: Enable OIDC discovery endpoints (issuer and JWKS URLs) for the
  service account issuer in the API server. See
  [Configure Service Accounts for Pods](/docs/tasks/configure-pod-container/configure-service-account/#service-account-issuer-discovery)
  for more details.

- `ServiceAppProtocol`: Enables the `appProtocol` field on Services and Endpoints.

- `ServiceLoadBalancerFinalizer`: Enable finalizer protection for Service load balancers.

- `ServiceNodeExclusion`: Enable the exclusion of nodes from load balancers created by a cloud provider.
  A node is eligible for exclusion if labelled with "`node.kubernetes.io/exclude-from-external-load-balancers`".

- `ServiceTopology`: Enable service to route traffic based upon the Node topology of the cluster.
  See [ServiceTopology](/docs/concepts/services-networking/service-topology/) for more details.

- `SetHostnameAsFQDN`: Enable the ability of setting Fully Qualified Domain Name(FQDN) as the
  hostname of a pod. See
  [Pod's `setHostnameAsFQDN` field](/docs/concepts/services-networking/dns-pod-service/#pod-sethostnameasfqdn-field).

- `StartupProbe`: Enable the [startup](/docs/concepts/workloads/pods/pod-lifecycle/#when-should-you-use-a-startup-probe)
  probe in the kubelet.

- `StorageObjectInUseProtection`: Postpone the deletion of PersistentVolume or
  PersistentVolumeClaim objects if they are still being used.

- `StreamingProxyRedirects`: Instructs the API server to intercept (and follow) redirects from the
  backend (kubelet) for streaming requests. Examples of streaming requests include the `exec`,
  `attach` and `port-forward` requests.

- `SupportIPVSProxyMode`: Enable providing in-cluster service load balancing using IPVS.
  See [service proxies](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies) for more details.

- `SupportNodePidsLimit`: Enable the support to limiting PIDs on the Node.  The parameter
  `pid=<number>` in the `--system-reserved` and `--kube-reserved` options can be specified to
  ensure that the specified number of process IDs will be reserved for the system as a whole and for
   Kubernetes system daemons respectively.

- `SupportPodPidsLimit`: Enable the support to limiting PIDs in Pods.

- `Sysctls`: Enable support for namespaced kernel parameters (sysctls) that can be set for each
  pod. See [sysctls](/docs/tasks/administer-cluster/sysctl-cluster/) for more details.

- `TTLAfterFinished`: Allow a [TTL controller](/docs/concepts/workloads/controllers/ttlafterfinished/)
  to clean up resources after they finish execution.

- `TaintBasedEvictions`: Enable evicting pods from nodes based on taints on Nodes and tolerations
  on Pods.  See [taints and tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/)
  for more details.

- `TaintNodesByCondition`: Enable automatic tainting nodes based on
  [node conditions](/docs/concepts/architecture/nodes/#condition).

- `TokenRequest`: Enable the `TokenRequest` endpoint on service account resources.

- `TokenRequestProjection`: Enable the injection of service account tokens into a Pod through a
  [`projected` volume](/docs/concepts/storage/volumes/#projected).

- `ValidateProxyRedirects`: This flag controls whether the API server should validate that redirects
  are only followed to the same host. Only used if the `StreamingProxyRedirects` flag is enabled.

- `VolumePVCDataSource`: Enable support for specifying an existing PVC as a DataSource.

- `VolumeScheduling`: Enable volume topology aware scheduling and make the PersistentVolumeClaim
  (PVC) binding aware of scheduling decisions. It also enables the usage of
  [`local`](/docs/concepts/storage/volumes/#local) volume type when used together with the
  `PersistentLocalVolumes` feature gate.

- `VolumeSnapshotDataSource`: Enable volume snapshot data source support.

- `VolumeSubpath`: Allow mounting a subpath of a volume in a container.

- `VolumeSubpathEnvExpansion`: Enable `subPathExpr` field for expanding environment
  variables into a `subPath`.

- `WarningHeaders`: Allow sending warning headers in API responses.

- `WindowsEndpointSliceProxying`: When enabled, kube-proxy running on Windows will use
  EndpointSlices as the primary data source instead of Endpoints, enabling scalability and
  performance improvements. See
  [Enabling Endpoint Slices](/docs/concepts/services-networking/endpoint-slices/).

- `WindowsGMSA`: Enables passing of GMSA credential specs from pods to container runtimes.

- `WindowsRunAsUserName` : Enable support for running applications in Windows containers with as a
  non-default user. See [Configuring RunAsUserName](/docs/tasks/configure-pod-container/configure-runasusername)
  for more details.

