---
title: Feature Gates
weight: 10
title: Feature Gates
content_template: templates/concept
---

{{% capture overview %}}
This page contains an overview of the various feature gates an administrator
can specify on different Kubernetes components.
{{% /capture %}}

{{% capture body %}}
## Overview

Feature gates are a set of key=value pairs that describe alpha or experimental
features.
An administrator can use the `--feature-gates` command line flag on each component
to turn a feature on or off. Each component supports a set of feature gates unique to that component.
Use `-h` flag to see a full set of feature gates for all components.
To set feature gates for a component, such as kubelet, use the `--feature-gates` flag assigned to a list of feature pairs:

```shell
--feature-gates="...,DynamicKubeletConfig=true"
```

The following table is a summary of the feature gates that you can set on
different Kubernetes components.

- The "Since" column contains the Kubernetes release when a feature is introduced
  or its release stage is changed.
- The "Until" column, if not empty, contains the last Kubernetes release in which
  you can still use a feature gate.

| Feature | Default | Stage | Since | Until |
|---------|---------|-------|-------|-------|
| `Accelerators` | `false` | Alpha | 1.6 | 1.10 |
| `AdvancedAuditing` | `false` | Alpha | 1.7 | 1.7 |
| `AdvancedAuditing` | `true` | Beta | 1.8 | 1.11 |
| `AdvancedAuditing` | `true` | GA | 1.12 | - |
| `AffinityInAnnotations` | `false` | Alpha | 1.6 | 1.7 |
| `AllowExtTrafficLocalEndpoints` | `false` | Beta | 1.4 | 1.6 |
| `AllowExtTrafficLocalEndpoints` | `true` | GA | 1.7 | - |
| `APIListChunking` | `false` | Alpha | 1.8 | 1.8 |
| `APIListChunking` | `true` | Beta | 1.9 | |
| `APIResponseCompression` | `false` | Alpha | 1.7 | |
| `AppArmor` | `true` | Beta | 1.4 | |
| `AttachVolumeLimit` | `true` | Alpha | 1.11 | 1.11 |
| `AttachVolumeLimit` | `true` | Beta | 1.12 | |
| `BlockVolume` | `false` | Alpha | 1.9 | |
| `BlockVolume` | `true` | Beta | 1.13 | - |
| `BoundServiceAccountTokenVolume` | `false` | Alpha | 1.13 | |
| `CPUManager` | `false` | Alpha | 1.8 | 1.9 |
| `CPUManager` | `true` | Beta | 1.10 | |
| `CRIContainerLogRotation` | `false` | Alpha | 1.10 | 1.10 |
| `CRIContainerLogRotation` | `true` | Beta| 1.11 | |
| `CSIBlockVolume` | `false` | Alpha | 1.11 | 1.13 |
| `CSIBlockVolume` | `true` | Beta | 1.14 | |
| `CSIDriverRegistry` | `false` | Alpha | 1.12 | 1.13 |
| `CSIDriverRegistry` | `true` | Beta | 1.14 | |
| `CSIInlineVolume` | `false` | Alpha | 1.15 | - |
| `CSIMigration` | `false` | Alpha | 1.14 | |
| `CSIMigrationAWS` | `false` | Alpha | 1.14 | |
| `CSIMigrationAzureDisk` | `false` | Alpha | 1.15 | |
| `CSIMigrationAzureFile` | `false` | Alpha | 1.15 | |
| `CSIMigrationGCE` | `false` | Alpha | 1.14 | |
| `CSIMigrationOpenStack` | `false` | Alpha | 1.14 | |
| `CSINodeInfo` | `false` | Alpha | 1.12 | 1.13 |
| `CSINodeInfo` | `true` | Beta | 1.14 | |
| `CSIPersistentVolume` | `false` | Alpha | 1.9 | 1.9 |
| `CSIPersistentVolume` | `true` | Beta | 1.10 | 1.12 |
| `CSIPersistentVolume` | `true` | GA | 1.13 | - |
| `CustomCPUCFSQuotaPeriod` | `false` | Alpha | 1.12 | |
| `CustomPodDNS` | `false` | Alpha | 1.9 | 1.9 |
| `CustomPodDNS` | `true` | Beta| 1.10 | 1.13 |
| `CustomPodDNS` | `true` | GA | 1.14 | - |
| `CustomResourcePublishOpenAPI` | `false` | Alpha| 1.14 | 1.14 |
| `CustomResourcePublishOpenAPI` | `true` | Beta| 1.15 | |
| `CustomResourceSubresources` | `false` | Alpha | 1.10 | 1.11 |
| `CustomResourceSubresources` | `true` | Beta | 1.11 | - |
| `CustomResourceValidation` | `false` | Alpha | 1.8 | 1.8 |
| `CustomResourceValidation` | `true` | Beta | 1.9 | |
| `CustomResourceWebhookConversion` | `false` | Alpha | 1.13 | 1.14 |
| `CustomResourceWebhookConversion` | `true` | Beta | 1.15 | |
| `DebugContainers` | `false` | Alpha | 1.10 | |
| `DevicePlugins` | `false` | Alpha | 1.8 | 1.9 |
| `DevicePlugins` | `true` | Beta | 1.10 | |
| `DryRun` | `true` | Beta | 1.13 | |
| `DynamicAuditing` | `false` | Alpha | 1.13 | |
| `DynamicKubeletConfig` | `false` | Alpha | 1.4 | 1.10 |
| `DynamicKubeletConfig` | `true` | Beta | 1.11 | |
| `DynamicProvisioningScheduling` | `false` | Alpha | 1.11 | 1.11 |
| `DynamicVolumeProvisioning` | `true` | Alpha | 1.3 | 1.7 |
| `DynamicVolumeProvisioning` | `true` | GA | 1.8 | |
| `EnableEquivalenceClassCache` | `false` | Alpha | 1.8 | |
| `ExpandCSIVolumes` | `false` | Alpha | 1.14 | |
| `ExpandInUsePersistentVolumes` | `false` | Alpha | 1.11 | 1.14 |
| `ExpandInUsePersistentVolumes` | `true` | Beta | 1.15 | |
| `ExpandPersistentVolumes` | `false` | Alpha | 1.8 | 1.10 |
| `ExpandPersistentVolumes` | `true` | Beta | 1.11 | |
| `ExperimentalCriticalPodAnnotation` | `false` | Alpha | 1.5 | |
| `ExperimentalHostUserNamespaceDefaulting` | `false` | Beta | 1.5 | |
| `GCERegionalPersistentDisk` | `true` | Beta | 1.10 | 1.12 |
| `GCERegionalPersistentDisk` | `true` | GA | 1.13 | - |
| `HugePages` | `false` | Alpha | 1.8 | 1.9 |
| `HugePages` | `true` | Beta| 1.10 | 1.13 |
| `HugePages` | `true` | GA | 1.14 | |
| `HyperVContainer` | `false` | Alpha | 1.10 | |
| `Initializers` | `false` | Alpha | 1.7 | 1.13 |
| `Initializers` | - | Deprecated | 1.14 | |
| `KubeletConfigFile` | `false` | Alpha | 1.8 | 1.9 |
| `KubeletPluginsWatcher` | `false` | Alpha | 1.11 | 1.11 |
| `KubeletPluginsWatcher` | `true` | Beta | 1.12 | 1.12 |
| `KubeletPluginsWatcher` | `true` | GA | 1.13 | - |
| `KubeletPodResources` | `false` | Alpha | 1.13 | 1.14 |
| `KubeletPodResources` | `true` | Beta | 1.15 | |
| `LocalStorageCapacityIsolation` | `false` | Alpha | 1.7 | 1.9 |
| `LocalStorageCapacityIsolation` | `true` | Beta| 1.10 | |
| `LocalStorageCapacityIsolationFSQuotaMonitoring` | `false` | Alpha| 1.15 | |
| `MountContainers` | `false` | Alpha | 1.9 | |
| `MountPropagation` | `false` | Alpha | 1.8 | 1.9 |
| `MountPropagation` | `true` | Beta | 1.10 | 1.11 |
| `MountPropagation` | `true` | GA | 1.12 | |
| `NodeLease` | `false` | Alpha | 1.12 | 1.13 |
| `NodeLease` | `true` | Beta | 1.14 | |
| `NonPreemptingPriority` | `false` | Alpha | 1.15 | |
| `PersistentLocalVolumes` | `false` | Alpha | 1.7 | 1.9 |
| `PersistentLocalVolumes` | `true` | Beta | 1.10 | 1.13 |
| `PersistentLocalVolumes` | `true` | GA | 1.14 | |
| `PodPriority` | `false` | Alpha | 1.8 | 1.10 |
| `PodPriority` | `true` | Beta | 1.11 | 1.13 |
| `PodPriority` | `true` | GA | 1.14 | |
| `PodReadinessGates` | `false` | Alpha | 1.11 | 1.11 |
| `PodReadinessGates` | `true` | Beta | 1.12 | 1.13 |
| `PodReadinessGates` | `true` | GA | 1.14 | - |
| `PodShareProcessNamespace` | `false` | Alpha | 1.10 | |
| `PodShareProcessNamespace` | `true` | Beta | 1.12 | |
| `ProcMountType` | `false` | Alpha | 1.12 | |
| `PVCProtection` | `false` | Alpha | 1.9 | 1.9 |
| `RemainingItemCount` | `false` | Alpha | 1.15 | |
| `ResourceLimitsPriorityFunction` | `false` | Alpha | 1.9 | |
| `RequestManagement` | `false` | Alpha | 1.15 | |
| `ResourceQuotaScopeSelectors` | `false` | Alpha | 1.11 | 1.11 |
| `ResourceQuotaScopeSelectors` | `true` | Beta | 1.12 | |
| `RotateKubeletClientCertificate` | `true` | Beta | 1.8 | |
| `RotateKubeletServerCertificate` | `false` | Alpha | 1.7 | 1.11 |
| `RotateKubeletServerCertificate` | `true` | Beta | 1.12 | |
| `RunAsGroup` | `true` | Beta | 1.14 | |
| `RuntimeClass` | `true` | Beta | 1.14 | |
| `SCTPSupport` | `false` | Alpha | 1.12 | |
| `ServerSideApply` | `false` | Alpha | 1.14 | |
| `ServiceLoadBalancerFinalizer` | `false` | Alpha | 1.15 | |
| `ServiceNodeExclusion` | `false` | Alpha | 1.8 | |
| `StartupProbe` | `false` | Alpha | 1.16 | |
| `StorageObjectInUseProtection` | `true` | Beta | 1.10 | 1.10 |
| `StorageObjectInUseProtection` | `true` | GA | 1.11 | |
| `StorageVersionHash` | `false` | Alpha | 1.14 | 1.14 |
| `StorageVersionHash` | `true` | Beta | 1.15 | |
| `StreamingProxyRedirects` | `true` | Beta | 1.5 | |
| `SupportIPVSProxyMode` | `false` | Alpha | 1.8 | 1.8 |
| `SupportIPVSProxyMode` | `false` | Beta | 1.9 | 1.9 |
| `SupportIPVSProxyMode` | `true` | Beta | 1.10 | 1.10 |
| `SupportIPVSProxyMode` | `true` | GA | 1.11 | |
| `SupportNodePidsLimit` | `false` | Alpha | 1.14 | 1.14 |
| `SupportNodePidsLimit` | `true` | Beta | 1.15 | |
| `SupportPodPidsLimit` | `false` | Alpha | 1.10 | 1.13 |
| `SupportPodPidsLimit` | `true` | Beta | 1.14 | |
| `Sysctls` | `true` | Beta | 1.11 | |
| `TaintBasedEvictions` | `false` | Alpha | 1.6 | 1.12 |
| `TaintBasedEvictions` | `true` | Beta | 1.13 | |
| `TaintNodesByCondition` | `false` | Alpha | 1.8 | 1.11 |
| `TaintNodesByCondition` | `true` | Beta | 1.12 | |
| `TokenRequest` | `false` | Alpha | 1.10 | 1.11 |
| `TokenRequest` | `true` | Beta | 1.12 | |
| `TokenRequestProjection` | `false` | Alpha | 1.11 | 1.11 |
| `TokenRequestProjection` | `true` | Beta | 1.12 | |
| `TTLAfterFinished` | `false` | Alpha | 1.12 | |
| `VolumePVCDataSource` | `false` | Alpha | 1.15 | 1.15 |
| `VolumePVCDataSource` | `true` | Beta | 1.16 | |
| `VolumeScheduling` | `false` | Alpha | 1.9 | 1.9 |
| `VolumeScheduling` | `true` | Beta | 1.10 | 1.12 |
| `VolumeScheduling` | `true` | GA | 1.13 | |
| `VolumeSubpathEnvExpansion` | `false` | Alpha | 1.14 | 1.14 |
| `VolumeSubpathEnvExpansion` | `true` | Beta | 1.15 | |
| `VolumeSnapshotDataSource` | `false` | Alpha | 1.12 | - |
| `ScheduleDaemonSetPods` | `false` | Alpha | 1.11 | 1.11 |
| `ScheduleDaemonSetPods` | `true` | Beta | 1.12 | |
| `WatchBookmark` | `false` | Alpha | 1.15 | 1.15 |
| `WatchBookmark` | `true` | Beta | 1.16 | |
| `WindowsGMSA` | `false` | Alpha | 1.14 | |

## Using a Feature

### Feature Stages

A feature can be in *Alpha*, *Beta* or *GA* stage.
An *Alpha* feature means:

* Disabled by default.
* Might be buggy. Enabling the feature may expose bugs.
* Support for feature may be dropped at any time without notice.
* The API may change in incompatible ways in a later software release without notice.
* Recommended for use only in short-lived testing clusters, due to increased
  risk of bugs and lack of long-term support.

A *Beta* feature means:

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

{{< note >}}
Please do try *Beta* features and give feedback on them!
After they exit beta, it may not be practical for us to make more changes.
{{< /note >}}

A *GA* feature is also referred to as a *stable* feature. It means:

* The corresponding feature gate is no longer needed.
* Stable versions of features will appear in released software for many subsequent versions.

### Feature Gates

Each feature gate is designed for enabling/disabling a specific feature:

- `Accelerators`: Enable Nvidia GPU support when using Docker
- `AdvancedAuditing`: Enable [advanced auditing](/docs/tasks/debug-application-cluster/audit/#advanced-audit)
- `AffinityInAnnotations`(*deprecated*): Enable setting [Pod affinity or anti-affinitys](/docs/concepts/configuration/assign-pod-node/#affinity-and-anti-affinity).
- `AllowExtTrafficLocalEndpoints`: Enable a service to route external requests to node local endpoints.
- `APIListChunking`: Enable the API clients to retrieve (`LIST` or `GET`) resources from API server in chunks.
- `APIResponseCompression`: Compress the API responses for `LIST` or `GET` requests.
- `AppArmor`: Enable AppArmor based mandatory access control on Linux nodes when using Docker.
   See [AppArmor Tutorial](/docs/tutorials/clusters/apparmor/) for more details.
- `AttachVolumeLimit`: Enable volume plugins to report limits on number of volumes
  that can be attached to a node.
   See [dynamic volume limits](/docs/concepts/storage/storage-limits/#dynamic-volume-limits) for more details.
- `BlockVolume`: Enable the definition and consumption of raw block devices in Pods.
   See [Raw Block Volume Support](/docs/concepts/storage/persistent-volumes/#raw-block-volume-support)
   for more details.
- `BoundServiceAccountTokenVolume`: Migrate ServiceAccount volumes to use a projected volume consisting of a
   ServiceAccountTokenVolumeProjection.
   Check [Service Account Token Volumes](https://git.k8s.io/community/contributors/design-proposals/storage/svcacct-token-volume-source.md)
   for more details.
- `CPUManager`: Enable container level CPU affinity support, see [CPU Management Policies](/docs/tasks/administer-cluster/cpu-management-policies/).
- `CRIContainerLogRotation`: Enable container log rotation for cri container runtime.
- `CSIBlockVolume`: Enable external CSI volume drivers to support block storage. See the [`csi` raw block volume support](/docs/concepts/storage/volumes/#csi-raw-block-volume-support) documentation for more details.
- `CSIDriverRegistry`: Enable all logic related to the CSIDriver API object in csi.storage.k8s.io.
- `CSIInlineVolume`: Enable CSI Inline volumes support for pods.
- `CSIMigration`: Enables shims and translation logic to route volume operations from in-tree plugins to corresponding pre-installed CSI plugins
- `CSIMigrationAWS`: Enables shims and translation logic to route volume operations from the AWS-EBS in-tree plugin to EBS CSI plugin
- `CSIMigrationAzureDisk`: Enables shims and translation logic to route volume operations from the Azure-Disk in-tree plugin to Azure Disk CSI plugin
- `CSIMigrationAzureFile`: Enables shims and translation logic to route volume operations from the Azure-File in-tree plugin to Azure File CSI plugin
- `CSIMigrationGCE`: Enables shims and translation logic to route volume operations from the GCE-PD in-tree plugin to PD CSI plugin
- `CSIMigrationOpenStack`: Enables shims and translation logic to route volume operations from the Cinder in-tree plugin to Cinder CSI plugin
- `CSINodeInfo`: Enable all logic related to the CSINodeInfo API object in csi.storage.k8s.io.
- `CSIPersistentVolume`: Enable discovering and mounting volumes provisioned through a
  [CSI (Container Storage Interface)](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md)
  compatible volume plugin.
  Check the [`csi` volume type](/docs/concepts/storage/volumes/#csi) documentation for more details.
- `CustomCPUCFSQuotaPeriod`: Enable nodes to change CPUCFSQuotaPeriod.
- `CustomPodDNS`: Enable customizing the DNS settings for a Pod using its `dnsConfig` property.
   Check [Pod's DNS Config](/docs/concepts/services-networking/dns-pod-service/#pods-dns-config)
   for more details.
- `CustomResourcePublishOpenAPI`: Enables publishing of CRD OpenAPI specs.
- `CustomResourceSubresources`: Enable `/status` and `/scale` subresources
  on resources created from [CustomResourceDefinition](/docs/concepts/api-extension/custom-resources/).
- `CustomResourceValidation`: Enable schema based validation on resources created from
  [CustomResourceDefinition](/docs/concepts/api-extension/custom-resources/).
- `CustomResourceWebhookConversion`: Enable webhook-based conversion
  on resources created from [CustomResourceDefinition](/docs/concepts/api-extension/custom-resources/).
- `DebugContainers`: Enable running a "debugging" container in a Pod's namespace to
  troubleshoot a running Pod.
- `DevicePlugins`: Enable the [device-plugins](/docs/concepts/cluster-administration/device-plugins/)
  based resource provisioning on nodes.
- `DryRun`: Enable server-side [dry run](/docs/reference/using-api/api-concepts/#dry-run) requests.
- `DynamicAuditing`: Enable [dynamic auditing](/docs/tasks/debug-application-cluster/audit/#dynamic-backend)
- `DynamicKubeletConfig`: Enable the dynamic configuration of kubelet. See [Reconfigure kubelet](/docs/tasks/administer-cluster/reconfigure-kubelet/).
- `DynamicProvisioningScheduling`: Extend the default scheduler to be aware of volume topology and handle PV provisioning.
  This feature is superceded by the `VolumeScheduling` feature completely in v1.12.
- `DynamicVolumeProvisioning`(*deprecated*): Enable the [dynamic provisioning](/docs/concepts/storage/dynamic-provisioning/) of persistent volumes to Pods.
- `EnableEquivalenceClassCache`: Enable the scheduler to cache equivalence of nodes when scheduling Pods.
- `ExpandInUsePersistentVolumes`: Enable expanding in-use PVCs. See [Resizing an in-use PersistentVolumeClaim](/docs/concepts/storage/persistent-volumes/#resizing-an-in-use-persistentvolumeclaim).
- `ExpandPersistentVolumes`: Enable the expanding of persistent volumes. See [Expanding Persistent Volumes Claims](/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims).
- `ExperimentalCriticalPodAnnotation`: Enable annotating specific pods as *critical* so that their [scheduling is guaranteed](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/).
- `ExperimentalHostUserNamespaceDefaultingGate`: Enabling the defaulting user
   namespace to host. This is for containers that are using other host namespaces,
   host mounts, or containers that are privileged or using specific non-namespaced
   capabilities (e.g. `MKNODE`, `SYS_MODULE` etc.). This should only be enabled
   if user namespace remapping is enabled in the Docker daemon.
- `GCERegionalPersistentDisk`: Enable the regional PD feature on GCE.
- `HugePages`: Enable the allocation and consumption of pre-allocated [huge pages](/docs/tasks/manage-hugepages/scheduling-hugepages/).
- `HyperVContainer`: Enable [Hyper-V isolation](https://docs.microsoft.com/en-us/virtualization/windowscontainers/manage-containers/hyperv-container) for Windows containers.
- `KubeletConfigFile`: Enable loading kubelet configuration from a file specified using a config file.
  See [setting kubelet parameters via a config file](/docs/tasks/administer-cluster/kubelet-config-file/) for more details.
- `KubeletPluginsWatcher`: Enable probe-based plugin watcher utility to enable kubelet
  to discover plugins such as [CSI volume drivers](/docs/concepts/storage/volumes/#csi).
- `KubeletPodResources`: Enable the kubelet's pod resources grpc endpoint.
   See [Support Device Monitoring](https://git.k8s.io/community/keps/sig-node/compute-device-assignment.md) for more details.
- `LocalStorageCapacityIsolation`: Enable the consumption of [local ephemeral storage](/docs/concepts/configuration/manage-compute-resources-container/) and also the `sizeLimit` property of an [emptyDir volume](/docs/concepts/storage/volumes/#emptydir).
- `LocalStorageCapacityIsolationFSQuotaMonitoring`: When `LocalStorageCapacityIsolation` is enabled for [local ephemeral storage](/docs/concepts/configuration/manage-compute-resources-container/) and the backing filesystem for [emptyDir volumes](/docs/concepts/storage/volumes/#emptydir) supports project quotas and they are enabled, use project quotas to monitor [emptyDir volume](/docs/concepts/storage/volumes/#emptydir) storage consumption rather than filesystem walk for better performance and accuracy.
- `MountContainers`: Enable using utility containers on host as the volume mounter.
- `MountPropagation`: Enable sharing volume mounted by one container to other containers or pods.
  For more details, please see [mount propagation](/docs/concepts/storage/volumes/#mount-propagation).
- `NodeLease`: Enable the new Lease API to report node heartbeats, which could be used as a node health signal.
- `NonPreemptingPriority`: Enable NonPreempting option for PriorityClass and Pod.
- `PersistentLocalVolumes`: Enable the usage of `local` volume type in Pods.
  Pod affinity has to be specified if requesting a `local` volume.
- `PodPriority`: Enable the descheduling and preemption of Pods based on their [priorities](/docs/concepts/configuration/pod-priority-preemption/).
- `PodReadinessGates`: Enable the setting of `PodReadinessGate` field for extending
  Pod readiness evaluation.
  For more details, please see [Pod readiness gate](/docs/concepts/workloads/pods/pod-lifecycle/#pod-readiness-gate).
- `ProcMountType`: Enables control over ProcMountType for containers.
- `PVCProtection`: Enable the prevention of a PersistentVolumeClaim (PVC) from
  being deleted when it is still used by any Pod.
  More details can be found [here](/docs/tasks/administer-cluster/storage-object-in-use-protection/).
- `ResourceLimitsPriorityFunction`: Enable a scheduler priority function that
  assigns a lowest possible score of 1 to a node that satisfies at least one of
  the input Pod's cpu and memory limits. The intent is to break ties between
  nodes with same scores.
- `RequestManagement`: Enable managing request concurrency with prioritization and fairness at each server.
- `ResourceQuotaScopeSelectors`: Enable resource quota scope selectors.
- `RotateKubeletClientCertificate`: Enable the rotation of the client TLS certificate on the kubelet.
  See [kubelet configuration](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/#kubelet-configuration) for more details.
- `RotateKubeletServerCertificate`: Enable the rotation of the server TLS certificate on the kubelet.
  See [kubelet configuration](/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/#kubelet-configuration) for more details.
- `RunAsGroup`: Enable control over the primary group ID set on the init processes of containers.
- `RuntimeClass`: Enable the [RuntimeClass](/docs/concepts/containers/runtime-class/) feature for selecting container runtime configurations.
- `ScheduleDaemonSetPods`: Enable DaemonSet Pods to be scheduled by the default scheduler instead of the DaemonSet controller.
- `SCTPSupport`: Enables the usage of SCTP as `protocol` value in `Service`, `Endpoint`, `NetworkPolicy` and `Pod` definitions
- `ServerSideApply`: Enables the [Sever Side Apply (SSA)](/docs/reference/using-api/api-concepts/#server-side-apply) path at the API Server.
- `ServiceLoadBalancerFinalizer`: Enable finalizer protection for Service load balancers.
- `ServiceNodeExclusion`: Enable the exclusion of nodes from load balancers created by a cloud provider.
  A node is eligible for exclusion if annotated with "`alpha.service-controller.kubernetes.io/exclude-balancer`" key.
- `StartupProbe`: Enable the [startup](/docs/concepts/workloads/pods/pod-lifecycle/#when-should-you-use-a-startup-probe) probe in the kubelet.
- `StorageObjectInUseProtection`: Postpone the deletion of PersistentVolume or
  PersistentVolumeClaim objects if they are still being used.
- `StorageVersionHash`: Allow apiservers to expose the storage version hash in the discovery.
- `StreamingProxyRedirects`: Instructs the API server to intercept (and follow)
   redirects from the backend (kubelet) for streaming requests.
  Examples of streaming requests include the `exec`, `attach` and `port-forward` requests.
- `SupportIPVSProxyMode`: Enable providing in-cluster service load balancing using IPVS.
  See [service proxies](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies) for more details.
- `SupportPodPidsLimit`: Enable the support to limiting PIDs in Pods.
- `Sysctls`: Enable support for namespaced kernel parameters (sysctls) that can be set for each pod.
  See [sysctls](/docs/tasks/administer-cluster/sysctl-cluster/) for more details.
- `TaintBasedEvictions`: Enable evicting pods from nodes based on taints on nodes and tolerations on Pods.
  See [taints and tolerations](/docs/concepts/configuration/taint-and-toleration/) for more details.
- `TaintNodesByCondition`: Enable automatic tainting nodes based on [node conditions](/docs/concepts/architecture/nodes/#condition).
- `TokenRequest`: Enable the `TokenRequest` endpoint on service account resources.
- `TokenRequestProjection`: Enable the injection of service account tokens into
  a Pod through the [`projected` volume](/docs/concepts/storage/volumes/#projected).
- `TTLAfterFinished`: Allow a [TTL controller](/docs/concepts/workloads/controllers/ttlafterfinished/) to clean up resources after they finish execution.
- `VolumePVCDataSource`: Enable support for specifying an existing PVC as a DataSource.
- `VolumeScheduling`: Enable volume topology aware scheduling and make the
  PersistentVolumeClaim (PVC) binding aware of scheduling decisions. It also
  enables the usage of [`local`](/docs/concepts/storage/volumes/#local) volume
  type when used together with the `PersistentLocalVolumes` feature gate.
- `VolumeSnapshotDataSource`: Enable volume snapshot data source support.
- `VolumeSubpathEnvExpansion`: Enable `subPathExpr` field for expanding environment variables into a `subPath`.
- `WatchBookmark`: Enable support for watch bookmark events.
- `WindowsGMSA`: Enables passing of GMSA credential specs from pods to container runtimes.

{{% /capture %}}
