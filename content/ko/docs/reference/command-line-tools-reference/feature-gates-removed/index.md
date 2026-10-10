---
title: 제거된 기능 게이트
weight: 15
content_type: concept
---

<!-- overview -->

이 페이지는 그간 제거된 기능 게이트의 목록을 나열한다. 
이 페이지의 정보는 참고용이다. 
제거된(removed) 기능 게이트는 더 이상 유효한 기능 게이트로 인식되지 않는다는 점에서 졸업(GA'ed)이나 사용 중단된(deprecated) 기능 게이트와 다르다. 
반면, 승급되거나 사용 중단된 기능 게이트는 
다른 쿠버네티스 컴포넌트가 인식할 수는 있지만 클러스터에서 어떠한 동작 차이도 유발하지 않는다.

쿠버네티스 컴포넌트가 인식할 수 있는 기능 게이트를 보려면, 
[알파/베타 기능 게이트 표](/ko/docs/reference/command-line-tools-reference/feature-gates/#알파-또는-베타-기능을-위한-기능-게이트) 또는 
[승급/사용 중단 기능 게이트 표](/ko/docs/reference/command-line-tools-reference/feature-gates/#승급-또는-사용-중단된-기능을-위한-기능-게이트)를 참고한다.

### 제거된 기능 게이트

다음은 아래 테이블에 대한 설명이다.

- "도입" 열은 해당 기능이 처음 도입되거나 릴리스 단계가 변경된 
  쿠버네티스 릴리스를 나타낸다.
- "종료" 열에 값이 있다면, 해당 기능 게이트를 사용할 수 있는 마지막 쿠버네티스 릴리스를 나타낸다. 
  만약 기능 단계가 "사용 중단" 또는 "GA" 라면, 
  "종료" 열의 값은 해당 기능이 제거된 쿠버네티스 릴리스를 나타낸다.

{{< table caption="제거된 기능 게이트" >}}

| 기능     | 디폴트    | 단계   | 도입   | 종료   |
|---------|---------|-------|-------|-------|
| `Accelerators` | `false` | 알파 | 1.6 | 1.10 |
| `Accelerators` | - | 사용 중단 | 1.11 | 1.11 |
| `AffinityInAnnotations` | `false` | 알파 | 1.6 | 1.7 |
| `AffinityInAnnotations` | - | 사용 중단 | 1.8 | 1.8 |
| `AllowExtTrafficLocalEndpoints` | `false` | 베타 | 1.4 | 1.6 |
| `AllowExtTrafficLocalEndpoints` | `true` | GA | 1.7 | 1.9 |
| `AttachVolumeLimit` | `false` | 알파 | 1.11 | 1.11 |
| `AttachVolumeLimit` | `true` | 베타 | 1.12 | 1.16 |
| `AttachVolumeLimit` | `true` | GA | 1.17 | 1.21 |
| `BalanceAttachedNodeVolumes` | `false` | 알파 | 1.11 | 1.21 |
| `BalanceAttachedNodeVolumes` | `false` | 사용 중단 | 1.22 | 1.22 |
| `BlockVolume` | `false` | 알파 | 1.9 | 1.12 |
| `BlockVolume` | `true` | 베타 | 1.13 | 1.17 |
| `BlockVolume` | `true` | GA | 1.18 | 1.21 |
| `BoundServiceAccountTokenVolume` | `false` | 알파 | 1.13 | 1.20 |
| `BoundServiceAccountTokenVolume` | `true` | 베타 | 1.21 | 1.21 |
| `BoundServiceAccountTokenVolume` | `true` | GA | 1.22 | 1.23 |
| `CRIContainerLogRotation` | `false` | 알파 | 1.10 | 1.10 |
| `CRIContainerLogRotation` | `true` | 베타 | 1.11 | 1.20 |
| `CRIContainerLogRotation` | `true` | GA | 1.21 | 1.22 |
| `CSIBlockVolume` | `false` | 알파 | 1.11 | 1.13 |
| `CSIBlockVolume` | `true` | 베타 | 1.14 | 1.17 |
| `CSIBlockVolume` | `true` | GA | 1.18 | 1.21 |
| `CSIDriverRegistry` | `false` | 알파 | 1.12 | 1.13 |
| `CSIDriverRegistry` | `true` | 베타 | 1.14 | 1.17 |
| `CSIDriverRegistry` | `true` | GA | 1.18 | 1.21 |
| `CSIMigrationAWSComplete` | `false` | 알파 | 1.17 | 1.20 |
| `CSIMigrationAWSComplete` | - | 사용 중단 | 1.21 | 1.21 |
| `CSIMigrationAzureDiskComplete` | `false` | 알파 | 1.17 | 1.20 |
| `CSIMigrationAzureDiskComplete` | - | 사용 중단 | 1.21 | 1.21 |
| `CSIMigrationAzureFileComplete` | `false` | 알파 | 1.17 | 1.20 |
| `CSIMigrationAzureFileComplete` | - | 사용 중단 |  1.21 | 1.21 |
| `CSIMigrationGCEComplete` | `false` | 알파 | 1.17 | 1.20 |
| `CSIMigrationGCEComplete` | - | 사용 중단 | 1.21 | 1.21 |
| `CSIMigrationOpenStackComplete` | `false` | 알파 | 1.17 | 1.20 |
| `CSIMigrationOpenStackComplete` | - | 사용 중단 | 1.21 | 1.21 |
| `CSIMigrationvSphereComplete` | `false` | 베타 | 1.19 | 1.21 |
| `CSIMigrationvSphereComplete` | - | 사용 중단 | 1.22 | 1.22 |
| `CSINodeInfo` | `false` | 알파 | 1.12 | 1.13 |
| `CSINodeInfo` | `true` | 베타 | 1.14 | 1.16 |
| `CSINodeInfo` | `true` | GA | 1.17 | 1.22 |
| `CSIPersistentVolume` | `false` | 알파 | 1.9 | 1.9 |
| `CSIPersistentVolume` | `true` | 베타 | 1.10 | 1.12 |
| `CSIPersistentVolume` | `true` | GA | 1.13 | 1.16 |
| `CSIServiceAccountToken` | `false` | 알파 | 1.20 | 1.20 |
| `CSIServiceAccountToken` | `true` | 베타 | 1.21 | 1.21 |
| `CSIServiceAccountToken` | `true` | GA | 1.22 | 1.24 |
| `CSIVolumeFSGroupPolicy` | `false` | 알파 | 1.19 | 1.19 |
| `CSIVolumeFSGroupPolicy` | `true` | 베타 | 1.20 | 1.22 |
| `CSIVolumeFSGroupPolicy` | `true` | GA | 1.23 | 1.25 |
| `ConfigurableFSGroupPolicy` | `false` | 알파 | 1.18 | 1.19 |
| `ConfigurableFSGroupPolicy` | `true` | 베타 | 1.20 | 1.22 |
| `ConfigurableFSGroupPolicy` | `true` | GA | 1.23 | 1.25 |
| `CronJobControllerV2` | `false` | 알파 | 1.20 | 1.20 |
| `CronJobControllerV2` | `true` | 베타 | 1.21 | 1.21 |
| `CronJobControllerV2` | `true` | GA | 1.22 | 1.23 |
| `CSRDuration` | `true` | 베타 | 1.22 | 1.23 |
| `CSRDuration` | `true` | GA | 1.24 | 1.25 |
| `CustomPodDNS` | `false` | 알파 | 1.9 | 1.9 |
| `CustomPodDNS` | `true` | 베타| 1.10 | 1.13 |
| `CustomPodDNS` | `true` | GA | 1.14 | 1.16 |
| `CustomResourceDefaulting` | `false` | 알파| 1.15 | 1.15 |
| `CustomResourceDefaulting` | `true` | 베타 | 1.16 | 1.16 |
| `CustomResourceDefaulting` | `true` | GA | 1.17 | 1.18 |
| `CustomResourcePublishOpenAPI` | `false` | 알파| 1.14 | 1.14 |
| `CustomResourcePublishOpenAPI` | `true` | 베타| 1.15 | 1.15 |
| `CustomResourcePublishOpenAPI` | `true` | GA | 1.16 | 1.18 |
| `CustomResourceSubresources` | `false` | 알파 | 1.10 | 1.10 |
| `CustomResourceSubresources` | `true` | 베타 | 1.11 | 1.15 |
| `CustomResourceSubresources` | `true` | GA | 1.16 | 1.18 |
| `CustomResourceValidation` | `false` | 알파 | 1.8 | 1.8 |
| `CustomResourceValidation` | `true` | 베타 | 1.9 | 1.15 |
| `CustomResourceValidation` | `true` | GA | 1.16 | 1.18 |
| `CustomResourceWebhookConversion` | `false` | 알파 | 1.13 | 1.14 |
| `CustomResourceWebhookConversion` | `true` | 베타 | 1.15 | 1.15 |
| `CustomResourceWebhookConversion` | `true` | GA | 1.16 | 1.18 |
| `DynamicAuditing` | `false` | 알파 | 1.13 | 1.18 |
| `DynamicAuditing` | - | 사용 중단 | 1.19 | 1.19 |
| `DynamicProvisioningScheduling` | `false` | 알파 | 1.11 | 1.11 |
| `DynamicProvisioningScheduling` | - | 사용 중단| 1.12 | - |
| `DynamicVolumeProvisioning` | `true` | 알파 | 1.3 | 1.7 |
| `DynamicVolumeProvisioning` | `true` | GA | 1.8 | 1.12 |
| `EnableAggregatedDiscoveryTimeout` | `true` | 사용 중단 | 1.16 | 1.17 |
| `EnableEquivalenceClassCache` | `false` | 알파 | 1.8 | 1.12 |
| `EnableEquivalenceClassCache` | - | 사용 중단 | 1.13 | 1.23 |
| `EndpointSlice` | `false` | 알파 | 1.16 | 1.16 |
| `EndpointSlice` | `false` | 베타 | 1.17 | 1.17 |
| `EndpointSlice` | `true` | 베타 | 1.18 | 1.20 |
| `EndpointSlice` | `true` | GA | 1.21 | 1.24 |
| `EndpointSliceNodeName` | `false` | 알파 | 1.20 | 1.20 |
| `EndpointSliceNodeName` | `true` | GA | 1.21 | 1.24 |
| `EndpointSliceProxying` | `false` | 알파 | 1.18 | 1.18 |
| `EndpointSliceProxying` | `true` | 베타 | 1.19 | 1.21 |
| `EndpointSliceProxying` | `true` | GA | 1.22 | 1.24 |
| `EvenPodsSpread` | `false` | 알파 | 1.16 | 1.17 |
| `EvenPodsSpread` | `true` | 베타 | 1.18 | 1.18 |
| `EvenPodsSpread` | `true` | GA | 1.19 | 1.21 |
| `ExperimentalCriticalPodAnnotation` | `false` | 알파 | 1.5 | 1.12 |
| `ExperimentalCriticalPodAnnotation` | `false` | 사용 중단 | 1.13 | 1.16 |
| `ExternalPolicyForExternalIP` | `true` | GA | 1.18 | 1.22 |
| `GCERegionalPersistentDisk` | `true` | 베타 | 1.10 | 1.12 |
| `GCERegionalPersistentDisk` | `true` | GA | 1.13 | 1.16 |
| `GenericEphemeralVolume` | `false` | 알파 | 1.19 | 1.20 |
| `GenericEphemeralVolume` | `true` | 베타 | 1.21 | 1.22 |
| `GenericEphemeralVolume` | `true` | GA | 1.23 | 1.24 |
| `HugePageStorageMediumSize` | `false` | 알파 | 1.18 | 1.18 |
| `HugePageStorageMediumSize` | `true` | 베타 | 1.19 | 1.21 |
| `HugePageStorageMediumSize` | `true` | GA | 1.22 | 1.24 |
| `HugePages` | `false` | 알파 | 1.8 | 1.9 |
| `HugePages` | `true` | 베타| 1.10 | 1.13 |
| `HugePages` | `true` | GA | 1.14 | 1.16 |
| `HyperVContainer` | `false` | 알파 | 1.10 | 1.19 |
| `HyperVContainer` | `false` | 사용 중단 | 1.20 | 1.20 |
| `IPv6DualStack` | `false` | 알파 | 1.15 | 1.20 |
| `IPv6DualStack` | `true` | 베타 | 1.21 | 1.22 |
| `IPv6DualStack` | `true` | GA | 1.23 | 1.24 |
| `ImmutableEphemeralVolumes` | `false` | 알파 | 1.18 | 1.18 |
| `ImmutableEphemeralVolumes` | `true` | 베타 | 1.19 | 1.20 |
| `ImmutableEphemeralVolumes` | `true` | GA | 1.21 | 1.24 |
| `IngressClassNamespacedParams` | `false` | 알파 | 1.21 | 1.21 |
| `IngressClassNamespacedParams` | `true` | 베타 | 1.22 | 1.22 |
| `IngressClassNamespacedParams` | `true` | GA | 1.23 | 1.24 |
| `Initializers` | `false` | 알파 | 1.7 | 1.13 |
| `Initializers` | - | 사용 중단 | 1.14 | 1.14 |
| `KubeletConfigFile` | `false` | 알파 | 1.8 | 1.9 |
| `KubeletConfigFile` | - | 사용 중단 | 1.10 | 1.10 |
| `KubeletPluginsWatcher` | `false` | 알파 | 1.11 | 1.11 |
| `KubeletPluginsWatcher` | `true` | 베타 | 1.12 | 1.12 |
| `KubeletPluginsWatcher` | `true` | GA | 1.13 | 1.16 |
| `LegacyNodeRoleBehavior` | `false` | 알파 | 1.16 | 1.18 |
| `LegacyNodeRoleBehavior` | `true` | 베타 | 1.19 | 1.20 |
| `LegacyNodeRoleBehavior` | `false` | GA | 1.21 | 1.22 |
| `MountContainers` | `false` | 알파 | 1.9 | 1.16 |
| `MountContainers` | `false` | 사용 중단 | 1.17 | 1.17 |
| `MountPropagation` | `false` | 알파 | 1.8 | 1.9 |
| `MountPropagation` | `true` | 베타 | 1.10 | 1.11 |
| `MountPropagation` | `true` | GA | 1.12 | 1.14 |
| `NamespaceDefaultLabelName` | `true` | 베타 | 1.21 | 1.21 |
| `NamespaceDefaultLabelName` | `true` | GA | 1.22 | 1.23 |
| `NodeDisruptionExclusion` | `false` | 알파 | 1.16 | 1.18 |
| `NodeDisruptionExclusion` | `true` | 베타 | 1.19 | 1.20 |
| `NodeDisruptionExclusion` | `true` | GA | 1.21 | 1.22 |
| `NodeLease` | `false` | 알파 | 1.12 | 1.13 |
| `NodeLease` | `true` | 베타 | 1.14 | 1.16 |
| `NodeLease` | `true` | GA | 1.17 | 1.23 |
| `PVCProtection` | `false` | 알파 | 1.9 | 1.9 |
| `PVCProtection` | - | 사용 중단 | 1.10 | 1.10 |
| `PersistentLocalVolumes` | `false` | 알파 | 1.7 | 1.9 |
| `PersistentLocalVolumes` | `true` | 베타 | 1.10 | 1.13 |
| `PersistentLocalVolumes` | `true` | GA | 1.14 | 1.16 |
| `PodDisruptionBudget` | `false` | 알파 | 1.3 | 1.4 |
| `PodDisruptionBudget` | `true` | 베타 | 1.5 | 1.20 |
| `PodDisruptionBudget` | `true` | GA | 1.21 | 1.25 |
| `PodOverhead` | `false` | 알파 | 1.16 | 1.17 |
| `PodOverhead` | `true` | 베타 | 1.18 | 1.23 |
| `PodOverhead` | `true` | GA | 1.24 | 1.25 |
| `PodPriority` | `false` | 알파 | 1.8 | 1.10 |
| `PodPriority` | `true` | 베타 | 1.11 | 1.13 |
| `PodPriority` | `true` | GA | 1.14 | 1.18 |
| `PodReadinessGates` | `false` | 알파 | 1.11 | 1.11 |
| `PodReadinessGates` | `true` | 베타 | 1.12 | 1.13 |
| `PodReadinessGates` | `true` | GA | 1.14 | 1.16 |
| `PodShareProcessNamespace` | `false` | 알파 | 1.10 | 1.11 |
| `PodShareProcessNamespace` | `true` | 베타 | 1.12 | 1.16 |
| `PodShareProcessNamespace` | `true` | GA | 1.17 | 1.19 |
| `RequestManagement` | `false` | 알파 | 1.15 | 1.16 |
| `RequestManagement` | - | 사용 중단 | 1.17 | 1.17 |
| `ResourceLimitsPriorityFunction` | `false` | 알파 | 1.9 | 1.18 |
| `ResourceLimitsPriorityFunction` | - | 사용 중단 | 1.19 | 1.19 |
| `ResourceQuotaScopeSelectors` | `false` | 알파 | 1.11 | 1.11 |
| `ResourceQuotaScopeSelectors` | `true` | 베타 | 1.12 | 1.16 |
| `ResourceQuotaScopeSelectors` | `true` | GA | 1.17 | 1.18 |
| `RootCAConfigMap` | `false` | 알파 | 1.13 | 1.19 |
| `RootCAConfigMap` | `true` | 베타 | 1.20 | 1.20 |
| `RootCAConfigMap` | `true` | GA | 1.21 | 1.22 |
| `RotateKubeletClientCertificate` | `true` | 베타 | 1.8 | 1.18 |
| `RotateKubeletClientCertificate` | `true` | GA | 1.19 | 1.21 |
| `RunAsGroup` | `true` | 베타 | 1.14 | 1.20 |
| `RunAsGroup` | `true` | GA | 1.21 | 1.22 |
| `RuntimeClass` | `false` | 알파 | 1.12 | 1.13 |
| `RuntimeClass` | `true` | 베타 | 1.14 | 1.19 |
| `RuntimeClass` | `true` | GA | 1.20 | 1.24 |
| `SCTPSupport` | `false` | 알파 | 1.12 | 1.18 |
| `SCTPSupport` | `true` | 베타 | 1.19 | 1.19 |
| `SCTPSupport` | `true` | GA | 1.20 | 1.22 |
| `ScheduleDaemonSetPods` | `false` | 알파 | 1.11 | 1.11 |
| `ScheduleDaemonSetPods` | `true` | 베타 | 1.12 | 1.16  |
| `ScheduleDaemonSetPods` | `true` | GA | 1.17 | 1.18 |
| `SelectorIndex` | `false` | 알파 | 1.18 | 1.18 |
| `SelectorIndex` | `true` | 베타 | 1.19 | 1.19 |
| `SelectorIndex` | `true` | GA | 1.20 | 1.25 |
| `ServiceAccountIssuerDiscovery` | `false` | 알파 | 1.18 | 1.19 |
| `ServiceAccountIssuerDiscovery` | `true` | 베타 | 1.20 | 1.20 |
| `ServiceAccountIssuerDiscovery` | `true` | GA | 1.21 | 1.23 |
| `ServiceAppProtocol` | `false` | 알파 | 1.18 | 1.18 |
| `ServiceAppProtocol` | `true` | 베타 | 1.19 | 1.19 |
| `ServiceAppProtocol` | `true` | GA | 1.20 | 1.22 |
| `ServiceLoadBalancerFinalizer` | `false` | 알파 | 1.15 | 1.15 |
| `ServiceLoadBalancerFinalizer` | `true` | 베타 | 1.16 | 1.16 |
| `ServiceLoadBalancerFinalizer` | `true` | GA | 1.17 | 1.20 |
| `ServiceNodeExclusion` | `false` | 알파 | 1.8 | 1.18 |
| `ServiceNodeExclusion` | `true` | 베타 | 1.19 | 1.20 |
| `ServiceNodeExclusion` | `true` | GA | 1.21 | 1.22 |
| `ServiceTopology` | `false` | 알파 | 1.17 | 1.19 |
| `ServiceTopology` | `false` | 사용 중단 | 1.20 | 1.22 |
| `SetHostnameAsFQDN` | `false` | 알파 | 1.19 | 1.19 |
| `SetHostnameAsFQDN` | `true` | 베타 | 1.20 | 1.21 |
| `SetHostnameAsFQDN` | `true` | GA | 1.22 | 1,24 |
| `StartupProbe` | `false` | 알파 | 1.16 | 1.17 |
| `StartupProbe` | `true` | 베타 | 1.18 | 1.19 |
| `StartupProbe` | `true` | GA | 1.20 | 1.23 |
| `StorageObjectInUseProtection` | `true` | 베타 | 1.10 | 1.10 |
| `StorageObjectInUseProtection` | `true` | GA | 1.11 | 1.24 |
| `StreamingProxyRedirects` | `false` | 베타 | 1.5 | 1.5 |
| `StreamingProxyRedirects` | `true` | 베타 | 1.6 | 1.17 |
| `StreamingProxyRedirects` | `true` | 사용 중단 | 1.18 | 1.21 |
| `StreamingProxyRedirects` | `false` | 사용 중단 | 1.22 | 1.24 |
| `SupportIPVSProxyMode` | `false` | 알파 | 1.8 | 1.8 |
| `SupportIPVSProxyMode` | `false` | 베타 | 1.9 | 1.9 |
| `SupportIPVSProxyMode` | `true` | 베타 | 1.10 | 1.10 |
| `SupportIPVSProxyMode` | `true` | GA | 1.11 | 1.20 |
| `SupportNodePidsLimit` | `false` | 알파 | 1.14 | 1.14 |
| `SupportNodePidsLimit` | `true` | 베타 | 1.15 | 1.19 |
| `SupportNodePidsLimit` | `true` | GA | 1.20 | 1.23 |
| `SupportPodPidsLimit` | `false` | 알파 | 1.10 | 1.13 |
| `SupportPodPidsLimit` | `true` | 베타 | 1.14 | 1.19 |
| `SupportPodPidsLimit` | `true` | GA | 1.20 | 1.23 |
| `Sysctls` | `true` | 베타 | 1.11 | 1.20 |
| `Sysctls` | `true` | GA | 1.21 | 1.22 |
| `TTLAfterFinished` | `false` | 알파 | 1.12 | 1.20 |
| `TTLAfterFinished` | `true` | 베타 | 1.21 | 1.22 |
| `TTLAfterFinished` | `true` | GA | 1.23 | 1.24 |
| `TaintBasedEvictions` | `false` | 알파 | 1.6 | 1.12 |
| `TaintBasedEvictions` | `true` | 베타 | 1.13 | 1.17 |
| `TaintBasedEvictions` | `true` | GA | 1.18 | 1.20 |
| `TaintNodesByCondition` | `false` | 알파 | 1.8 | 1.11 |
| `TaintNodesByCondition` | `true` | 베타 | 1.12 | 1.16 |
| `TaintNodesByCondition` | `true` | GA | 1.17 | 1.18 |
| `TokenRequest` | `false` | 알파 | 1.10 | 1.11 |
| `TokenRequest` | `true` | 베타 | 1.12 | 1.19 |
| `TokenRequest` | `true` | GA | 1.20 | 1.21 |
| `TokenRequestProjection` | `false` | 알파 | 1.11 | 1.11 |
| `TokenRequestProjection` | `true` | 베타 | 1.12 | 1.19 |
| `TokenRequestProjection` | `true` | GA | 1.20 | 1.21 |
| `ValidateProxyRedirects` | `false` | 알파 | 1.12 | 1.13 |
| `ValidateProxyRedirects` | `true` | 베타 | 1.14 | 1.21 |
| `ValidateProxyRedirects` | `true` | 사용 중단 | 1.22 | 1.24 |
| `VolumePVCDataSource` | `false` | 알파 | 1.15 | 1.15 |
| `VolumePVCDataSource` | `true` | 베타 | 1.16 | 1.17 |
| `VolumePVCDataSource` | `true` | GA | 1.18 | 1.21 |
| `VolumeScheduling` | `false` | 알파 | 1.9 | 1.9 |
| `VolumeScheduling` | `true` | 베타 | 1.10 | 1.12 |
| `VolumeScheduling` | `true` | GA | 1.13 | 1.16 |
| `VolumeSnapshotDataSource` | `false` | 알파 | 1.12 | 1.16 |
| `VolumeSnapshotDataSource` | `true` | 베타 | 1.17 | 1.19 |
| `VolumeSnapshotDataSource` | `true` | GA | 1.20 | 1.22 |
| `VolumeSubpath` | `true` | GA | 1.10 | 1.24 |
| `VolumeSubpathEnvExpansion` | `false` | 알파 | 1.14 | 1.14 |
| `VolumeSubpathEnvExpansion` | `true` | 베타 | 1.15 | 1.16 |
| `VolumeSubpathEnvExpansion` | `true` | GA | 1.17 | 1.24 |
| `WarningHeaders` | `true` | 베타 | 1.19 | 1.21 |
| `WarningHeaders` | `true` | GA | 1.22 | 1.24 |
| `WindowsEndpointSliceProxying` | `false` | 알파 | 1.19 | 1.20 |
| `WindowsEndpointSliceProxying` | `true` | 베타 | 1.21 | 1.21 |
| `WindowsEndpointSliceProxying` | `true` | GA | 1.22| 1.24 |
| `WindowsGMSA` | `false` | 알파 | 1.14 | 1.15 |
| `WindowsGMSA` | `true` | 베타 | 1.16 | 1.17 |
| `WindowsGMSA` | `true` | GA | 1.18 | 1.20 |
| `WindowsRunAsUserName` | `false` | 알파 | 1.16 | 1.16 |
| `WindowsRunAsUserName` | `true` | 베타 | 1.17 | 1.17 |
| `WindowsRunAsUserName` | `true` | GA | 1.18 | 1.20 |
{{< /table >}}

## Descriptions for removed feature gates

- `Accelerators`: 도커 엔진 사용 시 Nvidia GPU 지원을 활성화하는
  플러그인의 초기 형태를 제공하였으며, 사용 중단되었다.
  대안을 위해서는 [장치 플러그인](/ko/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)을
  확인한다.

- `AffinityInAnnotations`: [파드 어피니티 또는 안티-어피니티](/ko/docs/concepts/scheduling-eviction/assign-pod-node/#어피니티-affinity-와-안티-어피니티-anti-affinity)
  설정을 활성화한다.

- `AllowExtTrafficLocalEndpoints`: 서비스가 외부 요청을 노드의 로컬 엔드포인트로 라우팅할 수 있도록 한다.

- `AttachVolumeLimit`: 볼륨 플러그인이 노드에 연결될 수 있는 볼륨 수에
  대한 제한을 보고하도록 한다.
  자세한 내용은 [동적 볼륨 제한](/ko/docs/concepts/storage/storage-limits/#동적-볼륨-한도)을
  참고한다.

- `BalanceAttachedNodeVolumes`: 스케줄링 시 균형 잡힌 리소스 할당을 위해 고려할 노드의 볼륨 수를
  포함한다. 스케줄러가 결정을 내리는 동안 CPU, 메모리 사용률 및 볼륨 수가
  더 가까운 노드가 선호된다.

- `BlockVolume`: 파드에서 원시 블록 장치의 정의와 사용을 활성화한다.
  자세한 내용은 [원시 블록 볼륨 지원](/ko/docs/concepts/storage/persistent-volumes/#원시-블록-볼륨-지원)을
  참고한다.

- `BoundServiceAccountTokenVolume`: ServiceAccountTokenVolumeProjection으로 구성된 프로젝션 볼륨을 사용하도록
  서비스어카운트 볼륨을 마이그레이션한다.
  클러스터 관리자는 `serviceaccount_stale_tokens_total` 메트릭을 사용하여
  확장 토큰에 의존하는 워크로드를 모니터링 할 수 있다.
  이러한 워크로드가 없는 경우 `--service-account-extend-token-expiration=false` 플래그로
  `kube-apiserver`를 시작하여 확장 토큰 기능을 끈다.
  자세한 내용은 [바운드 서비스 계정 토큰](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md)을 확인한다.

- `CRIContainerLogRotation`: CRI 컨테이너 런타임에 컨테이너 로그 로테이션을 활성화한다.
  로그 파일 사이즈 기본값은 10MB이며,
  컨테이너 당 최대 로그 파일 수 기본값은 5이다.
  이 값은 kubelet 환경설정으로 변경할 수 있다.
  더 자세한 내용은
  [노드 레벨에서의 로깅](/ko/docs/concepts/cluster-administration/logging/#노드-레벨에서의-로깅)을 참고한다.

- `CSIBlockVolume`: 외부 CSI 볼륨 드라이버가 블록 스토리지를 지원할 수 있게 한다.
  자세한 내용은 [`csi` 원시 블록 볼륨 지원](/ko/docs/concepts/storage/volumes/#csi-원시-raw-블록-볼륨-지원)을
  참고한다.

- `CSIDriverRegistry`: csi.storage.k8s.io에서 CSIDriver API 오브젝트와 관련된
  모든 로직을 활성화한다.

- `CSIMigrationAWSComplete`: kubelet 및 볼륨 컨트롤러에서 EBS 인-트리
  플러그인 등록을 중지하고 shim 및 변환 로직을 사용하여 볼륨 작업을 AWS-EBS
  인-트리 플러그인에서 EBS CSI 플러그인으로 라우팅할 수 있다.
  클러스터의 모든 노드에 CSIMigration과 CSIMigrationAWS 기능 플래그가 활성화되고
  EBS CSI 플러그인이 설치 및 구성이 되어 있어야 한다.
  이 플래그는 인-트리 EBS 플러그인의 등록을 막는 `InTreePluginAWSUnregister` 기능 플래그로 인해
  더 이상 사용되지 않는다.

- `CSIMigrationAzureDiskComplete`: kubelet 및 볼륨 컨트롤러에서
  Azure-Disk 인-트리 플러그인 등록을 중지하고
  shim 및 변환 로직을 사용하여
  볼륨 작업을 Azure-Disk 인-트리 플러그인에서 AzureDisk CSI 플러그인으로 라우팅할 수 있다.
  클러스터의 모든 노드에 CSIMigration과 CSIMigrationAzureDisk 기능 플래그가 활성화되고
  AzureDisk CSI 플러그인이 설치 및 구성이 되어 있어야 한다.
  이 플래그는 인-트리 AzureDisk 플러그인의 등록을 막는
  `InTreePluginAzureDiskUnregister` 기능 플래그로 인해 더 이상 사용되지 않는다.

- `CSIMigrationAzureFileComplete`: kubelet 및 볼륨 컨트롤러에서 Azure 파일 인-트리
  플러그인 등록을 중지하고 shim 및 변환 로직을 통해 볼륨 작업을
  Azure 파일 인-트리 플러그인에서 AzureFile CSI 플러그인으로
  라우팅할 수 있다. 클러스터의 모든 노드에 CSIMigration과 CSIMigrationAzureFile 기능
  플래그가 활성화되고 AzureFile CSI 플러그인이 설치 및 구성이 되어
  있어야 한다. 이 플래그는 인-트리 AzureFile 플러그인의 등록을 막는
  `InTreePluginAzureFileUnregister` 기능 플래그로 인해
  더 이상 사용되지 않는다.

- `CSIMigrationGCEComplete`: kubelet 및 볼륨 컨트롤러에서 GCE-PD
  인-트리 플러그인 등록을 중지하고 shim 및 변환 로직을 통해 볼륨 작업을 GCE-PD
  인-트리 플러그인에서 PD CSI 플러그인으로 라우팅할 수 있다.
  CSIMigration과 CSIMigrationGCE 기능 플래그가 활성화되고 PD CSI
  플러그인이 클러스터의 모든 노드에 설치 및 구성이 되어 있어야 한다.
  이 플래그는 인-트리 GCE PD 플러그인의 등록을 막는 `InTreePluginGCEUnregister` 기능 플래그로 인해
  더 이상 사용되지 않는다.

- `CSIMigrationOpenStackComplete`: kubelet 및 볼륨 컨트롤러에서
  Cinder 인-트리 플러그인 등록을 중지하고 shim 및 변환 로직이 Cinder 인-트리
  플러그인에서 Cinder CSI 플러그인으로 볼륨 작업을 라우팅할 수 있도록 한다.
  클러스터의 모든 노드에 CSIMigration과 CSIMigrationOpenStack 기능 플래그가 활성화되고
  Cinder CSI 플러그인이 설치 및 구성이 되어 있어야 한다.
  이 플래그는 인-트리 openstack cinder 플러그인의 등록을 막는 `InTreePluginOpenStackUnregister` 기능 플래그로 인해
  더 이상 사용되지 않는다.

- `CSIMigrationvSphereComplete`: kubelet 및 볼륨 컨트롤러에서 vSphere 인-트리
  플러그인 등록을 중지하고 shim 및 변환 로직을 활성화하여 vSphere 인-트리 플러그인에서
  vSphere CSI 플러그인으로 볼륨 작업을 라우팅할 수 있도록 한다. CSIMigration 및
  CSIMigrationvSphere 기능 플래그가 활성화되고 vSphere CSI 플러그인이
  클러스터의 모든 노드에 설치 및 구성이 되어 있어야 한다.
  이 플래그는 인-트리 vsphere 플러그인의 등록을 막는 `InTreePluginvSphereUnregister` 기능 플래그로 인해
  더 이상 사용되지 않는다.

- `CSINodeInfo`: `csi.storage.k8s.io` 내의 CSINodeInfo API 오브젝트와 관련된 모든 로직을 활성화한다.

- `CSIPersistentVolume`: [CSI (Container Storage Interface)](https://git.k8s.io/design-proposals-archive/storage/container-storage-interface.md)
  호환 볼륨 플러그인을 통해 프로비저닝된 볼륨을 감지하고
  마운트할 수 있다.

- `CSIServiceAccountToken` : 볼륨을 마운트하는 파드의 서비스 계정 토큰을 받을 수 있도록
  CSI 드라이버를 활성화한다.
  [토큰 요청](https://kubernetes-csi.github.io/docs/token-requests.html)을 참조한다.

- `CSIVolumeFSGroupPolicy`: CSI드라이버가 `fsGroupPolicy` 필드를 사용하도록 허용한다.
  이 필드는 CSI드라이버에서 생성된 볼륨이 마운트될 때 볼륨 소유권과
  권한 수정을 지원하는지 여부를 제어한다.

- `CSRDuration`: 클라이언트가 쿠버네티스 CSR API를 통해 발급된 인증서의 기간을
  요청할 수 있다.

- `ConfigurableFSGroupPolicy`: 사용자가 파드에 볼륨을 마운트할 때 fsGroups에 대한
  볼륨 권한 변경 정책을 구성할 수 있다. 자세한 내용은
  [파드의 볼륨 권한 및 소유권 변경 정책 구성](/docs/tasks/configure-pod-container/security-context/#configure-volume-permission-and-ownership-change-policy-for-pods)을
  참고한다.

- `CronJobControllerV2`: {{< glossary_tooltip text="크론잡(CronJob)" term_id="cronjob" >}}
  컨트롤러의 대체 구현을 사용한다. 그렇지 않으면,
  동일한 컨트롤러의 버전 1이 선택된다.

- `CustomPodDNS`: `dnsConfig` 속성을 사용하여 파드의 DNS 설정을 사용자 정의할 수 있다.
  자세한 내용은 [파드의 DNS 설정](/ko/docs/concepts/services-networking/dns-pod-service/#pod-dns-config)을
  확인한다.

- `CustomResourceDefaulting`: OpenAPI v3 유효성 검사 스키마에서 기본값에 대한 CRD 지원을 활성화한다.

- `CustomResourcePublishOpenAPI`: CRD OpenAPI 사양을 게시할 수 있다.

- `CustomResourceSubresources`: [커스텀리소스데피니션](/ko/docs/concepts/extend-kubernetes/api-extension/custom-resources/)에서
  생성된 리소스에서 `/status` 및 `/scale` 하위 리소스를 활성화한다.

- `CustomResourceValidation`: [커스텀리소스데피니션](/ko/docs/concepts/extend-kubernetes/api-extension/custom-resources/)에서
  생성된 리소스에서 스키마 기반 유효성 검사를 활성화한다.

- `CustomResourceWebhookConversion`: [커스텀리소스데피니션](/ko/docs/concepts/extend-kubernetes/api-extension/custom-resources/)에서
  생성된 리소스에 대해 웹 훅 기반의 변환을 활성화한다.

- `DynamicAuditing`: v1.19 이전의 버전에서 동적 감사를 활성화하는 데 사용했다.

- `DynamicProvisioningScheduling`: 볼륨 토폴로지를 인식하고 PV 프로비저닝을 처리하도록
  기본 스케줄러를 확장한다.
  이 기능은 v1.12의 `VolumeScheduling` 기능으로 대체되었다.

- `DynamicVolumeProvisioning`: 파드에 퍼시스턴트 볼륨의
  [동적 프로비저닝](/ko/docs/concepts/storage/dynamic-provisioning/)을 활성화한다.

- `EnableAggregatedDiscoveryTimeout`: 수집된 검색 호출에서 5초
  시간 초과를 활성화한다.

- `EnableEquivalenceClassCache`: 스케줄러가 파드를 스케줄링할 때 노드의
  동등성을 캐시할 수 있게 한다.

- `EndpointSlice`: 보다 스케일링 가능하고 확장 가능한 네트워크 엔드포인트에 대한
  엔드포인트슬라이스(EndpointSlices)를 활성화한다. [엔드포인트슬라이스 활성화](/ko/docs/concepts/services-networking/endpoint-slices/)를 참고한다.

- `EndpointSliceNodeName` : 엔드포인트슬라이스 `nodeName` 필드를 활성화한다.

- `EndpointSliceProxying`: 활성화되면, 리눅스에서 실행되는
  kube-proxy는 엔드포인트 대신 엔드포인트슬라이스를
  기본 데이터 소스로 사용하여 확장성과 성능을 향상시킨다.
  [엔드포인트슬라이스 활성화](/ko/docs/concepts/services-networking/endpoint-slices/)를 참고한다.

- `EvenPodsSpread`: 토폴로지 도메인 간에 파드를 균등하게 스케줄링할 수 있다.
  [파드 토폴로지 분배 제약 조건](/ko/docs/concepts/scheduling-eviction/topology-spread-constraints/)을 참고한다.

- `ExperimentalCriticalPodAnnotation`: 특정 파드에 *critical* 로
  어노테이션을 달아서 [스케줄링이 보장되도록](/ko/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/) 한다.
  이 기능은 v1.13부터 파드 우선 순위 및 선점으로 인해 사용 중단되었다.

- `ExternalPolicyForExternalIP`: ExternalTrafficPolicy가 서비스(Service) ExternalIP에 적용되지 않는
  버그를 수정한다.

- `GCERegionalPersistentDisk`: GCE에서 지역 PD 기능을 활성화한다.

- `GenericEphemeralVolume`: 일반 볼륨의 모든 기능을 지원하는 임시, 인라인
  볼륨을 활성화한다(타사 스토리지 공급 업체, 스토리지 용량 추적, 스냅샷으로부터 복원
  등에서 제공할 수 있음).
  [임시 볼륨](/ko/docs/concepts/storage/ephemeral-volumes/)을 참고한다.

- `HugePageStorageMediumSize`: 사전 할당된 [huge page](/ko/docs/tasks/manage-hugepages/scheduling-hugepages/)의
  여러 크기를 지원한다.

- `HugePages`: 사전 할당된 [huge page](/ko/docs/tasks/manage-hugepages/scheduling-hugepages/)의
  할당 및 사용을 활성화한다.

- `HyperVContainer`: 윈도우 컨테이너를 위한
  [Hyper-V 격리](https://docs.microsoft.com/ko-kr/virtualization/windowscontainers/manage-containers/hyperv-container)
  기능을 활성화한다.

- `IPv6DualStack`: IPv6을 위한 [이중 스택](/ko/docs/concepts/services-networking/dual-stack/)
  기능을 활성화한다.

- `ImmutableEphemeralVolumes`: 안정성과 성능 향상을 위해 개별 시크릿(Secret)과 컨피그맵(ConfigMap)을
  변경할 수 없는(immutable) 것으로 표시할 수 있다.

- `IngressClassNamespacedParams`: 네임스페이스 범위의 파라미터가
  `IngressClass` 리소스를 참조할 수 있도록 허용한다.
  이 기능은 `IngressClass.spec.parameters`에 `Scope` 및 `Namespace`의 2 필드를 추가한다.

- `Initializers`: Initializers 어드미션 플러그인을 사용하여,
  오브젝트 생성 시 비동기 협조(asynchronous coordination)를 허용한다.

- `KubeletConfigFile`: 구성 파일을 사용하여 지정된 파일에서
  kubelet 구성을 로드할 수 있다.
  자세한 내용은 [구성 파일을 통해 kubelet 파라미터 설정](/docs/tasks/administer-cluster/kubelet-config-file/)을
  참고한다.

- `KubeletPluginsWatcher`: kubelet이 [CSI 볼륨 드라이버](/ko/docs/concepts/storage/volumes/#csi)와 같은
  플러그인을 검색할 수 있도록 프로브 기반 플러그인 감시자(watcher) 유틸리티를 사용한다.

- `LegacyNodeRoleBehavior`: 비활성화되면, 서비스 로드 밸런서 및 노드 중단의 레거시 동작은
  `NodeDisruptionExclusion` 과 `ServiceNodeExclusion` 에 의해 제공된 기능별 레이블을 대신하여
  `node-role.kubernetes.io/master` 레이블을 무시한다.

- `MountContainers`: 호스트의 유틸리티 컨테이너를 볼륨 마운터로 사용할 수 있다.

- `MountPropagation`: 한 컨테이너에서 다른 컨테이너 또는 파드로 마운트된 볼륨을 공유할 수 있다.
  자세한 내용은 [마운트 전파(propagation)](/ko/docs/concepts/storage/volumes/#마운트-전파-propagation)을 참고한다.

- `NamespaceDefaultLabelName`: API 서버로 하여금 모든 네임스페이스에 대해 변경할 수 없는 (immutable)
  {{< glossary_tooltip text="레이블" term_id="label" >}} `kubernetes.io/metadata.name`을 설정하도록 한다.
  (네임스페이스의 이름도 변경 불가)

- `NodeDisruptionExclusion`: 영역(zone) 장애 시 노드가 제외되지 않도록 노드 레이블 `node.kubernetes.io/exclude-disruption`
  사용을 활성화한다.

- `NodeLease`: 새로운 리스(Lease) API가 노드 상태 신호로 사용될 수 있는 노드 하트비트(heartbeats)를 보고할 수 있게 한다.

- `PVCProtection`: 파드에서 사용 중일 때 퍼시스턴트볼륨클레임(PVC)이
  삭제되지 않도록 한다.

- `PersistentLocalVolumes`: 파드에서 `local` 볼륨 유형의 사용을 활성화한다.
  `local` 볼륨을 요청하는 경우 파드 어피니티를 지정해야 한다.

- `PodDisruptionBudget`: [PodDisruptionBudget](/docs/tasks/run-application/configure-pdb/) 기능을 활성화한다.

- `PodOverhead`: 파드 오버헤드를 판단하기 위해 [파드오버헤드(PodOverhead)](/ko/docs/concepts/scheduling-eviction/pod-overhead/)
  기능을 활성화한다.

- `PodPriority`: [우선 순위](/ko/docs/concepts/scheduling-eviction/pod-priority-preemption/)를
  기반으로 파드의 스케줄링 취소와 선점을 활성화한다.

- `PodReadinessGates`: 파드 준비성 평가를 확장하기 위해
  `PodReadinessGate` 필드 설정을 활성화한다. 자세한 내용은 [파드의 준비성 게이트](/ko/docs/concepts/workloads/pods/pod-lifecycle/#pod-readiness-gate)를
  참고한다.

- `PodShareProcessNamespace`: 파드에서 실행되는 컨테이너 간에 단일 프로세스 네임스페이스를
  공유하기 위해 파드에서 `shareProcessNamespace` 설정을 활성화한다. 자세한 내용은
  [파드의 컨테이너 간 프로세스 네임스페이스 공유](/docs/tasks/configure-pod-container/share-process-namespace/)에서 확인할 수 있다.

- `RequestManagement`: 각 API 서버에서 우선 순위 및 공정성으로 요청 동시성을
  관리할 수 있다. 1.17 이후 `APIPriorityAndFairness` 에서 사용 중단되었다.

- `ResourceLimitsPriorityFunction`: 입력 파드의 CPU 및 메모리 한도 중
  하나 이상을 만족하는 노드에 가능한 최저 점수 1을 할당하는
  스케줄러 우선 순위 기능을 활성화한다. 의도는 동일한 점수를 가진
  노드 사이의 관계를 끊는 것이다.

- `ResourceQuotaScopeSelectors`: 리소스 쿼터 범위 셀렉터를 활성화한다.

- `RootCAConfigMap`: 모든 네임스페이스에 `kube-root-ca.crt`라는
  {{< glossary_tooltip text="컨피그맵" term_id="configmap" >}}을 게시하도록
  `kube-controller-manager` 를 구성한다. 이 컨피그맵에는 kube-apiserver에 대한 연결을 확인하는 데
  사용되는 CA 번들이 포함되어 있다. 자세한 내용은
  [바운드 서비스 계정 토큰](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md)을
  참조한다.

- `RotateKubeletClientCertificate`: kubelet에서 클라이언트 TLS 인증서의 로테이션을 활성화한다.
  자세한 내용은
  [kubelet 구성](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#kubelet-configuration)을 참고한다.

- `RunAsGroup`: 컨테이너의 init 프로세스에 설정된 기본 그룹 ID 제어를 활성화한다.

- `RuntimeClass`: 컨테이너 런타임 구성을 선택하기 위해 [런타임클래스(RuntimeClass)](/ko/docs/concepts/containers/runtime-class/)
  기능을 활성화한다.

- `SCTPSupport`: 파드, 서비스, 엔드포인트, 엔드포인트슬라이스 및 네트워크폴리시 정의에서
  _SCTP_ `protocol` 값을 활성화한다.

- `ScheduleDaemonSetPods`: 데몬셋(DaemonSet) 컨트롤러 대신 기본 스케줄러로 데몬셋 파드를
  스케줄링할 수 있다.

- `SelectorIndex`: API 서버 감시(watch) 캐시의 레이블 및 필드 기반 인덱스를 사용하여
  목록 작업을 가속화할 수 있다.

- `ServiceAccountIssuerDiscovery`: API 서버에서 서비스 어카운트 발행자에 대해 OIDC 디스커버리 엔드포인트(발급자 및
  JWKS URL)를 활성화한다. 자세한 내용은
  [파드의 서비스 어카운트 구성](/docs/tasks/configure-pod-container/configure-service-account/#service-account-issuer-discovery)을
  참고한다.

- `ServiceAppProtocol`: 서비스와 엔드포인트에서 `appProtocol` 필드를 활성화한다.

- `ServiceLoadBalancerFinalizer`: 서비스 로드 밸런서에 대한 Finalizer 보호를 활성화한다.

- `ServiceNodeExclusion`: 클라우드 제공자가 생성한 로드 밸런서에서 노드를 제외할 수 있다. 
  "`node.kubernetes.io/exclude-from-external-load-balancers`"로 레이블이 지정된 경우 노드를 제외할 수 있다.

- `ServiceTopology`: 서비스가 클러스터의 노드 토폴로지를 기반으로 트래픽을 라우팅할 수 있도록 한다. 
  자세한 내용은 [서비스토폴로지(ServiceTopology)](/ko/docs/concepts/services-networking/service-topology/)를 참고한다.

- `SetHostnameAsFQDN`: 전체 주소 도메인 이름(FQDN)을 파드의 호스트 이름으로
  설정하는 기능을 활성화한다.
  [파드의 `setHostnameAsFQDN` 필드](/ko/docs/concepts/services-networking/dns-pod-service/#pod-sethostnameasfqdn-field)를 참고한다.

- `StartupProbe`: kubelet에서 [스타트업](/ko/docs/concepts/workloads/pods/pod-lifecycle/#언제-스타트업-프로브를-사용해야-하는가) 
  프로브를 활성화한다.

- `StorageObjectInUseProtection`: 퍼시스턴트볼륨 또는 퍼시스턴트볼륨클레임 오브젝트가 여전히
  사용 중인 경우 삭제를 연기한다.

- `StreamingProxyRedirects`: 스트리밍 요청을 위해 백엔드(kubelet)에서 리디렉션을
  가로채서 따르도록 API 서버에 지시한다.
  스트리밍 요청의 예로는 `exec`, `attach` 및 `port-forward` 요청이 있다.

- `SupportIPVSProxyMode`: IPVS를 사용하여 클러스터 내 서비스 로드 밸런싱을 제공한다.
  자세한 내용은 [서비스 프록시](/ko/docs/concepts/services-networking/service/#가상-ip와-서비스-프록시)를 참고한다.

- `SupportNodePidsLimit`: 노드에서 PID 제한 지원을 활성화한다.
  `--system-reserved` 및 `--kube-reserved` 옵션의 `pid=<number>`
  파라미터를 지정하여 지정된 수의 프로세스 ID가
  시스템 전체와 각각 쿠버네티스 시스템 데몬에 대해 예약되도록 할 수 있다.

- `SupportPodPidsLimit`: 파드의 PID 제한에 대한 지원을 활성화한다.

- `Sysctls`: 각 파드에 설정할 수 있는 네임스페이스 커널 파라미터(sysctl)를 지원한다. 
  자세한 내용은 [sysctl](/ko/docs/tasks/administer-cluster/sysctl-cluster/)을 참고한다.

- `TTLAfterFinished`: [TTL 컨트롤러](/ko/docs/concepts/workloads/controllers/ttlafterfinished/)가 
  실행이 끝난 후 리소스를 정리하도록 허용한다.

- `TaintBasedEvictions`: 노드의 테인트(taint) 및 파드의 톨러레이션(toleration)을 기반으로
  노드에서 파드를 축출할 수 있다.
  자세한 내용은 [테인트와 톨러레이션](/ko/docs/concepts/scheduling-eviction/taint-and-toleration/)을 참고한다.

- `TaintNodesByCondition`: [노드 컨디션](/ko/docs/concepts/architecture/nodes/#condition)을
  기반으로 자동 테인트 노드를 활성화한다.

- `TokenRequest`: 서비스 어카운트 리소스에서 `TokenRequest` 엔드포인트를 활성화한다.

- `TokenRequestProjection`: [`projected` 볼륨](/ko/docs/concepts/storage/volumes/#projected)을 통해
  서비스 어카운트 토큰을 파드에 주입할 수 있다.

- `ValidateProxyRedirects`: 이 플래그는 API 서버가 동일한 호스트로만 리디렉션되는가를 확인해야 하는지 여부를 제어한다. 
  `StreamingProxyRedirects` 플래그가 활성화된 경우에만 사용된다.

- `VolumePVCDataSource`: 기존 PVC를 데이터 소스로 지정하는 기능을 지원한다.

- `VolumeScheduling`: 볼륨 토폴로지 인식 스케줄링을 활성화하고
  퍼시스턴트볼륨클레임(PVC) 바인딩이 스케줄링 결정을 인식하도록 한다. 또한
  `PersistentLocalVolumes` 기능 게이트와 함께 사용될 때
  [`local`](/ko/docs/concepts/storage/volumes/#local) 볼륨 유형을 사용할 수 있다.

- `VolumeSnapshotDataSource`: 볼륨 스냅샷 데이터 소스 지원을 활성화한다.

- `VolumeSubpath`: 컨테이너에 볼륨의 하위 경로(subpath)를 마운트할 수 있다.

- `VolumeSubpathEnvExpansion`: 환경 변수를 `subPath`로 확장하기 위해
  `subPathExpr` 필드를 활성화한다.

- `WarningHeaders`: API 응답에서 경고 헤더를 보낼 수 있다.

- `WindowsEndpointSliceProxying`: 활성화되면, 윈도우에서 실행되는 kube-proxy는
  엔드포인트 대신 엔드포인트슬라이스를 기본 데이터 소스로 사용하여
  확장성과 성능을 향상시킨다.
  [엔드포인트슬라이스 활성화하기](/ko/docs/concepts/services-networking/endpoint-slices/)를 참고한다.

- `WindowsGMSA`: 파드에서 컨테이너 런타임으로 GMSA 자격 증명 스펙을 전달할 수 있다.

- `WindowsRunAsUserName` : 기본 사용자가 아닌(non-default) 사용자로 윈도우 컨테이너에서
  애플리케이션을 실행할 수 있도록 지원한다. 자세한 내용은
  [RunAsUserName 구성](/ko/docs/tasks/configure-pod-container/configure-runasusername/)을 참고한다.

