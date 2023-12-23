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

<!-- Want to edit this table? See https://k8s.io/docs/contribute/new-content/new-features/#ready-for-review-feature-gates -->
### Feature gates for Alpha or Beta features

{{< feature-gate-table include="alpha,beta" caption="Feature gates for features in Alpha or Beta states" >}}

<!-- Want to edit this table? See https://k8s.io/docs/contribute/new-content/new-features/#ready-for-review-feature-gates -->
### Feature gates for graduated or deprecated features

{{< feature-gate-table include="ga,deprecated" caption="Feature Gates for Graduated or Deprecated Features" >}}

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
- {{< feature-gate-description name="AllowServiceLBStatusOnNonLB" >}}
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
- {{< feature-gate-description name="CSINodeExpandSecret" >}}
- {{< feature-gate-description name="CSIVolumeHealth" >}}
- {{< feature-gate-description name="CustomCPUCFSQuotaPeriod" >}}
- {{< feature-gate-description name="CustomResourceValidationExpressions" >}}
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
- {{< feature-gate-description name="ImageMaximumGCAge" >}}
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
- {{< feature-gate-description name="KMSv1" >}}
- {{< feature-gate-description name="KMSv2" >}}
- {{< feature-gate-description name="KMSv2KDF" >}}
- {{< feature-gate-description name="KubeletCgroupDriverFromCRI" >}}
- {{< feature-gate-description name="KubeletInUserNamespace" >}}
- {{< feature-gate-description name="KubeletPodResources" >}}
- {{< feature-gate-description name="KubeletPodResourcesDynamicResources" >}}
- {{< feature-gate-description name="KubeletPodResourcesGet" >}}
- {{< feature-gate-description name="KubeletPodResourcesGetAllocatable" >}}
- {{< feature-gate-description name="KubeletSeparateDiskGC" >}}
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
- {{< feature-gate-description name="NFTablesProxyMode" >}}
- {{< feature-gate-description name="NodeInclusionPolicyInPodTopologySpread" >}}
- {{< feature-gate-description name="NodeLogQuery" >}}
- {{< feature-gate-description name="NodeOutOfServiceVolumeDetach" >}}
- {{< feature-gate-description name="NodeSwap" >}}
- {{< feature-gate-description name="OpenAPIEnums" >}}
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
- {{< feature-gate-description name="StatefulSetAutoDeletePVC" >}}
- {{< feature-gate-description name="StatefulSetStartOrdinal" >}}
- {{< feature-gate-description name="StorageVersionAPI" >}}
- {{< feature-gate-description name="StorageVersionHash" >}}
- {{< feature-gate-description name="StructuredAuthenticationConfiguration" >}}
- {{< feature-gate-description name="StructuredAuthorizationConfiguration" >}}
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
- {{< feature-gate-description name="ZeroLimitedNominalConcurrencyShares" >}}

## {{% heading "whatsnext" %}}

* The [deprecation policy](/docs/reference/using-api/deprecation-policy/) for Kubernetes explains
  the project's approach to removing features and components.
* Since Kubernetes 1.24, new beta APIs are not enabled by default.  When enabling a beta
  feature, you will also need to enable any associated API resources.
  For example, to enable a particular resource like
  `storage.k8s.io/v1beta1/csistoragecapacities`, set `--runtime-config=storage.k8s.io/v1beta1/csistoragecapacities`.
  See [API Versioning](/docs/reference/using-api/#api-versioning) for more details on the command line flags.
