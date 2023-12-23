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

<!-- Want to edit this table? See https://k8s.io/docs/contribute/new-content/new-features/#ready-for-review-feature-gates -->
{{< feature-gate-table show-removed="true" caption="Feature Gates Removed" sortable="true" >}}

## Descriptions for removed feature gates

- {{< feature-gate-description name="Accelerators" >}}
- {{< feature-gate-description name="AffinityInAnnotations" >}}
- {{< feature-gate-description name="AdvancedAuditing" >}}
- {{< feature-gate-description name="AllowExtTrafficLocalEndpoints" >}}
- {{< feature-gate-description name="AllowInsecureBackendProxy" >}}
- {{< feature-gate-description name="AttachVolumeLimit" >}}
- {{< feature-gate-description name="BalanceAttachedNodeVolumes" >}}
- {{< feature-gate-description name="BlockVolume" >}}
- {{< feature-gate-description name="BoundServiceAccountTokenVolume" >}}
- {{< feature-gate-description name="CRIContainerLogRotation" >}}
- {{< feature-gate-description name="CSIBlockVolume" >}}
- {{< feature-gate-description name="CSIDriverRegistry" >}}
- {{< feature-gate-description name="CSIInlineVolume" >}}
- {{< feature-gate-description name="CSIMigration" >}}
- {{< feature-gate-description name="CSIMigrationAWS" >}}
- {{< feature-gate-description name="CSIMigrationAWSComplete" >}}
- {{< feature-gate-description name="CSIMigrationAzureDisk" >}}
- {{< feature-gate-description name="CSIMigrationAzureDiskComplete" >}}
- {{< feature-gate-description name="CSIMigrationAzureFileComplete" >}}
- {{< feature-gate-description name="CSIMigrationGCE" >}}
- {{< feature-gate-description name="CSIMigrationGCEComplete" >}}
- {{< feature-gate-description name="CSIMigrationOpenStack" >}}
- {{< feature-gate-description name="CSIMigrationOpenStackComplete" >}}
- {{< feature-gate-description name="CSIMigrationvSphereComplete" >}}
- {{< feature-gate-description name="CSIMigrationvSphere" >}}
- {{< feature-gate-description name="CSINodeInfo" >}}
- {{< feature-gate-description name="CSIPersistentVolume" >}}
- {{< feature-gate-description name="CSIServiceAccountToken" >}}
- {{< feature-gate-description name="CSIStorageCapacity" >}}
- {{< feature-gate-description name="CSIVolumeFSGroupPolicy" >}}
- {{< feature-gate-description name="CSRDuration" >}}
- {{< feature-gate-description name="ConfigurableFSGroupPolicy" >}}
- {{< feature-gate-description name="ControllerManagerLeaderMigration" >}}
- {{< feature-gate-description name="CronJobControllerV2" >}}
- {{< feature-gate-description name="CronJobTimeZone" >}}
- {{< feature-gate-description name="CustomPodDNS" >}}
- {{< feature-gate-description name="CustomResourceDefaulting" >}}
- {{< feature-gate-description name="CustomResourcePublishOpenAPI" >}}
- {{< feature-gate-description name="CustomResourceSubresources" >}}
- {{< feature-gate-description name="CustomResourceValidation" >}}
- {{< feature-gate-description name="CustomResourceWebhookConversion" >}}
- {{< feature-gate-description name="DaemonSetUpdateSurge" >}}
- {{< feature-gate-description name="DefaultPodTopologySpread" >}}
- {{< feature-gate-description name="DelegateFSGroupToCSIDriver" >}}
- {{< feature-gate-description name="DevicePlugins" >}}
- {{< feature-gate-description name="DisableAcceleratorUsageMetrics" >}}
- {{< feature-gate-description name="DownwardAPIHugePages" >}}
- {{< feature-gate-description name="DryRun" >}}
- {{< feature-gate-description name="DynamicAuditing" >}}
- {{< feature-gate-description name="DynamicKubeletConfig" >}}
- {{< feature-gate-description name="DynamicProvisioningScheduling" >}}
- {{< feature-gate-description name="DynamicVolumeProvisioning" >}}
- {{< feature-gate-description name="EnableAggregatedDiscoveryTimeout" >}}
- {{< feature-gate-description name="EnableEquivalenceClassCache" >}}
- {{< feature-gate-description name="EndpointSlice" >}}
- {{< feature-gate-description name="EndpointSliceNodeName" >}}
- {{< feature-gate-description name="EndpointSliceProxying" >}}
- {{< feature-gate-description name="EndpointSliceTerminatingCondition" >}}
- {{< feature-gate-description name="EphemeralContainers" >}}
- {{< feature-gate-description name="EvenPodsSpread" >}}
- {{< feature-gate-description name="ExpandCSIVolumes" >}}
- {{< feature-gate-description name="ExpandInUsePersistentVolumes" >}}
- {{< feature-gate-description name="ExpandPersistentVolumes" >}}
- {{< feature-gate-description name="ExperimentalCriticalPodAnnotation" >}}
- {{< feature-gate-description name="ExternalPolicyForExternalIP" >}}
- {{< feature-gate-description name="GCERegionalPersistentDisk" >}}
- {{< feature-gate-description name="GRPCContainerProbe" >}}
- {{< feature-gate-description name="GenericEphemeralVolume" >}}
- {{< feature-gate-description name="HugePageStorageMediumSize" >}}
- {{< feature-gate-description name="HugePages" >}}
- {{< feature-gate-description name="HyperVContainer" >}}
- {{< feature-gate-description name="IPv6DualStack" >}}
- {{< feature-gate-description name="IdentifyPodOS" >}}
- {{< feature-gate-description name="ImmutableEphemeralVolumes" >}}
- {{< feature-gate-description name="IndexedJob" >}}
- {{< feature-gate-description name="IngressClassNamespacedParams" >}}
- {{< feature-gate-description name="Initializers" >}}
- {{< feature-gate-description name="JobMutableNodeSchedulingDirectives" >}}
- {{< feature-gate-description name="JobTrackingWithFinalizers" >}}
- {{< feature-gate-description name="KubeletConfigFile" >}}
- {{< feature-gate-description name="KubeletCredentialProviders" >}}
- {{< feature-gate-description name="KubeletPluginsWatcher" >}}
- {{< feature-gate-description name="LegacyNodeRoleBehavior" >}}
- {{< feature-gate-description name="LegacyServiceAccountTokenNoAutoGeneration" >}}
- {{< feature-gate-description name="LocalStorageCapacityIsolation" >}}
- {{< feature-gate-description name="MixedProtocolLBService" >}}
- {{< feature-gate-description name="MountContainers" >}}
- {{< feature-gate-description name="MountPropagation" >}}
- {{< feature-gate-description name="MultiCIDRRangeAllocator" >}}
- {{< feature-gate-description name="NamespaceDefaultLabelName" >}}
- {{< feature-gate-description name="NetworkPolicyStatus" >}}
- {{< feature-gate-description name="NodeDisruptionExclusion" >}}
- {{< feature-gate-description name="NodeLease" >}}
- {{< feature-gate-description name="NonPreemptingPriority" >}}
- {{< feature-gate-description name="OpenAPIV3" >}}
- {{< feature-gate-description name="PVCProtection" >}}
- {{< feature-gate-description name="PersistentLocalVolumes" >}}
- {{< feature-gate-description name="PodAffinityNamespaceSelector" >}}
- {{< feature-gate-description name="PodDisruptionBudget" >}}
- {{< feature-gate-description name="PodHasNetworkCondition" >}}
- {{< feature-gate-description name="PodOverhead" >}}
- {{< feature-gate-description name="PodPriority" >}}
- {{< feature-gate-description name="PodReadinessGates" >}}
- {{< feature-gate-description name="PodSecurity" >}}
- {{< feature-gate-description name="PodShareProcessNamespace" >}}
- {{< feature-gate-description name="PreferNominatedNode" >}}
- {{< feature-gate-description name="ProbeTerminationGracePeriod" >}}
- {{< feature-gate-description name="RequestManagement" >}}
- {{< feature-gate-description name="ResourceLimitsPriorityFunction" >}}
- {{< feature-gate-description name="ResourceQuotaScopeSelectors" >}}
- {{< feature-gate-description name="RetroactiveDefaultStorageClass" >}}
- {{< feature-gate-description name="RootCAConfigMap" >}}
- {{< feature-gate-description name="RotateKubeletClientCertificate" >}}
- {{< feature-gate-description name="RunAsGroup" >}}
- {{< feature-gate-description name="RuntimeClass" >}}
- {{< feature-gate-description name="SCTPSupport" >}}
- {{< feature-gate-description name="ScheduleDaemonSetPods" >}}
- {{< feature-gate-description name="SeccompDefault" >}}
- {{< feature-gate-description name="SelectorIndex" >}}
- {{< feature-gate-description name="ServiceAccountIssuerDiscovery" >}}
- {{< feature-gate-description name="ServiceAppProtocol" >}}
- {{< feature-gate-description name="ServiceIPStaticSubrange" >}}
- {{< feature-gate-description name="ServiceInternalTrafficPolicy" >}}
- {{< feature-gate-description name="ServiceLoadBalancerClass" >}}
- {{< feature-gate-description name="ServiceLoadBalancerFinalizer" >}}
- {{< feature-gate-description name="ServiceLBNodePortControl" >}}
- {{< feature-gate-description name="ServiceNodeExclusion" >}}
- {{< feature-gate-description name="ServiceTopology" >}}
- {{< feature-gate-description name="SetHostnameAsFQDN" >}}
- {{< feature-gate-description name="StartupProbe" >}}
- {{< feature-gate-description name="StatefulSetMinReadySeconds" >}}
- {{< feature-gate-description name="StorageObjectInUseProtection" >}}
- {{< feature-gate-description name="StreamingProxyRedirects" >}}
- {{< feature-gate-description name="SupportIPVSProxyMode" >}}
- {{< feature-gate-description name="SupportNodePidsLimit" >}}
- {{< feature-gate-description name="SupportPodPidsLimit" >}}
- {{< feature-gate-description name="SuspendJob" >}}
- {{< feature-gate-description name="Sysctls" >}}
- {{< feature-gate-description name="TTLAfterFinished" >}}
- {{< feature-gate-description name="TaintBasedEvictions" >}}
- {{< feature-gate-description name="TaintNodesByCondition" >}}
- {{< feature-gate-description name="TokenRequest" >}}
- {{< feature-gate-description name="TokenRequestProjection" >}}
- {{< feature-gate-description name="TopologyManager" >}}
- {{< feature-gate-description name="UserNamespacesStatelessPodsSupport" >}}
- {{< feature-gate-description name="ValidateProxyRedirects" >}}
- {{< feature-gate-description name="VolumePVCDataSource" >}}
- {{< feature-gate-description name="VolumeScheduling" >}}
- {{< feature-gate-description name="VolumeSnapshotDataSource" >}}
- {{< feature-gate-description name="VolumeSubpath" >}}
- {{< feature-gate-description name="VolumeSubpathEnvExpansion" >}}
- {{< feature-gate-description name="WarningHeaders" >}}
- {{< feature-gate-description name="WindowsEndpointSliceProxying" >}}
- {{< feature-gate-description name="WindowsGMSA" >}}
- {{< feature-gate-description name="WindowsHostProcessContainers" >}}
- {{< feature-gate-description name="WindowsRunAsUserName" >}}
