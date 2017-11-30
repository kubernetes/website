---
title: Feature Gates
---

{% capture overview %}
This page contains an overview of the various feature gates an administrator
can specify on different Kubernetes components.
{% endcapture %}

{% capture body %}

## Overview

Feature gates are a set of key=value pairs that describe the features for alpha
or experimental features.
An administrator can use the `--feature-gates` command line flag on each component
to turn a feature on or off.
The following table is a summary of the feature gates that you can set on
different Kubernetes components.

- The "KCM" column and the "CCM" column are refering to the controller manager
  component and the cloud controller manager component respectively.
- The "Since" column contains the Kubernetes release when a feature is introduced
  or its release stage is changed.
- The "Till" column, if not empty, contains the last Kubernetes release in which
  you can still use a feature gate.
- The "Y" values in the cells indicate that a specific feature gate can be applied
  to a specific component.

| Feature | Default | Stage | Since | Until |APIServer | KCM | Kubelet | Scheduler | CCM | Proxy |
|---------|---------|-------|-------|-------|----------|-----|---------|-----------|-----|-------|
| `Accelerators` | `false` | Alpha | 1.6 | | | Y | | | |
| `AdvancedAuditing` | `false` | Alpha | 1.7 | | Y | | | | | |
| `AdvancedAuditing` | `true` | Beta | 1.8 | Y | | | | | |
| `AffinityInAnnotations` | `false` | Alpha | 1.6 | 1.7 | Y | | | | | |
| `AllowExtTrafficLocalEndpoints` | `false` | Beta | 1.4 | 1.6 | | | | | |
| `AllowExtTrafficLocalEndpoints` | `true` | GA | 1.7| | Y | | | | | Y |
| `APIListChunking` | `false` | Alpha | 1.8 | 1.8 | Y | | | | | |
| `APIListChunking` | `true` | Beta | 1.9 | | Y | | | | | |
| `APIResponseCompression` | `false` | Alpha | 1.7 | | Y | | | | | |
| `AppArmor` | `true` | Beta | 1.4 | | Y | | Y | | | |
| `BlockVolume` | `false` | Alpha | 1.9 | | Y | Y | Y | | | |
| `CPUManager` | `false` | Alpha | 1.8 | 1.9 | Y | | Y | | | |
| `CPUManager` | `true` | Beta | 1.10 | | Y | | Y | | | |
| `CSIPersistentVolume` | `false` | Alpha | 1.9 | | Y | Y | Y | | | |
| `CustomPodDNS` | `false` | Alpha | 1.9 | | Y | | Y | | | |
| `CustomResourceValidation` | `false` | Alpha | 1.8 | 1.8 | Y | | | | | |
| `CustomResourceValidation` | `true` | Beta | 1.9 | | Y | | | | | |
| `DevicePlugins` | `false` | Alpha | 1.8 | | | | Y | | | |
| `DynamicKubeletConfig` | `false` | Alpha | 1.4 | | Y | | Y | | | |
| `DynamicVolumeProvisioning` | `true` | Alpha | 1.3 | 1.7 | | Y | | | | |
| `DynamicVolumeProvisioning` | `true` | GA | 1.8 | | | Y | | | | |
| `EnableEquivalenceClassCache` | `false` | Alpha | 1.8 | | | | | Y | | |
| `ExpandPersistentVolumes` | `false` | Alpha | 1.8 | 1.8 | Y | Y | | | | |
| `ExperimentalCriticalPodAnnotation` | `false` | Alpha | 1.5 | | | Y | Y | | | |
| `ExperimentalHostUserNamespaceDefaulting` | `false` | Beta | 1.5 | | | | Y | | | |
| `HugePages` | `false` | Alpha | 1.8 | | Y | | Y | | | |
| `Initializers` | `false` | Alpha | 1.7 | | Y | Y | | | | |
| `KubeletConfigFile` | `false` | Alpha | 1.8 | | | | Y | | | |
| `LocalStorageCapacityIsolation` | `false` | Alpha | 1.7 | | Y | | Y | | | |
| `MountContainers` | `false` | Alpha | 1.9 | | | | Y | | | |
| `MountPropagation` | `false` | Alpha | 1.8 | | Y | | Y | | | |
| `PersistentLocalVolumes` | `false` | Alpha | 1.7 | | Y | | Y | Y | | |
| `PodPriority` | `false` | Alpha | 1.8 | | Y | | Y | Y | | |
| `PVCProtection` | `false` | Alpha | 1.9 | | Y | Y | Y | | | |
| `ResourceLimitsPriorityFunction` | `false` | Alpha | 1.9 | | | | Y | | | |
| `RotateKubeletClientCertificate` | `true` | Beta | 1.7 | | | | Y | | | |
| `RotateKubeletServerCertificate` | `false` | Alpha | 1.7 | | Y | Y | Y | | | |
| `ServiceNodeExclusion` | `false` | Alpha | 1.8 | | | Y | | | Y | |
| `StreamingProxyRedirects` | `true` | Beta | 1.5 | | Y | | | | | |
| `SupportIPVSProxyMode` | `false` | Alpha | 1.8 | | | | | | | Y |
| `TaintBasedEvictions` | `false` | Alpha | 1.6 | | | Y | | | | |
| `TaintNodesByCondition` | `false` | Alpha | 1.8 | | Y | Y | | Y | | |
| `VolumeScheduling` | `false` | Alpha | 1.9 | | Y | Y | | Y | | |

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

**Note:** Please do try *Beta* features and give feedback on them!
After they exit beta, it may not be practical for us to make more changes.
{: .note}

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
- `BlockVolume`: Enable the definition and consumption of raw block devices in Pods. <!-- TODO: link to doc about blockDevices -->
- `CPUManager`: Enable container level CPU affinity support, see [CPU Management Policies](/docs/tasks/administer-cluster/cpu-management-policies/).
- `CSIPersistentVolume`: Enable discovering and mounting volumes provisioned through a
  [CSI (Container Storage Interface)](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/container-storage-interface.md)
  compatible volume plugin. <!-- TODO: link to doc about CSI -->
- `CustomPodDNS`: Enable customizing the DNS settings for a Pod using its `dnsConfig` property. <!-- TODO: link to doc about dnsConfig -->
- `CustomeResourceValidation`: Enable schema based validation on resources created from [CustomResourceDefinition](/docs/concepts/api-extension/custom-resources/).
- `DevicePlugins`: Enable the [device-plugins](/docs/concepts/cluster-administration/device-plugins/) based resource provisioning on nodes.
- `DynamicKubeletConfig`: Enable the dynamic configuration of kubelet. See [Reconfigure kubelet](/docs/tasks/administer-cluster/reconfigure-kubelet/).
- `DynamicVolumeProvisioning`(*deprecated*): Enable the [dynamic provisioning](/docs/concepts/storage/dynamic-provisioning/) of persistent volumes to Pods.
- `EnableEquivalenceClassCache`: Enable the scheduler to cache equivalence of nodes when scheduling Pods.
- `ExpandPersistentVolumes`: Enable the expanding of persistent volumes. See [Expanding Persistent Volumes Claims](/docs/concepts/storage/persistent-volumes/#expanding-persistent-volumes-claims).
- `ExperimentalCriticalPodAnnotation`: Enable annotating specific pods as *critical* so that their [scheduling is guaranteed](/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/).
- `ExperimentalHostUserNamespaceDefaultingGate`: Enabling the defaulting user
   namespace to host. This is for containers that are using other host namespaces,
   host mounts, or containers that are privileged or using specific non-namespaced
   capabilities (e.g. `MKNODE`, `SYS_MODULE` etc.). This should only be enabled
   if user namespace remapping is enabled in the Docker daemon.
- `HugePages`: Enable the allocation and consumption of pre-allocated [huge pages](/docs/tasks/manage-hugepages/scheduling-hugepages/).
- `Intializers`: Enable the [dynamic admission control](/docs/admin/extensible-admission-controllers/)
  as an extension to the built-in [admission controllers](/docs/admin/admission-controllers/).
  When the `Initializers` admission controller is enabled, this feature is automatically enabled.
- `KubeletConfigFile`: Enable loading kubelet configuration from a file specified using a config file.
  See [setting kubelet parameters via a config file](/docs/tasks/administer-cluster/kubelet-config-file/) for more details.
- `LocalStorageCapacityIsolation`: Enable the consumption of [local ephemeral storage](/docs/concepts/configuration/manage-compute-resources-container/) and also the `sizeLimit` property of an [emptyDir volume](/docs/concepts/storage/volumes/#emptydir).
- `MountContainers`: Enable using utility containers on host as the volume mounter.
- `MountPropagation`: Enable sharing volume mounted by one container to other containers or pods.
  For more details, please see [mount propagation](/docs/concepts/storage/volumes/#mount-propagation).
- `PersistentLocalVolumes`: Enable the usage of `local` volume type in Pods.
  Pod affinity has to be specified if requesting a `local` volume.
- `PodPriority`: Enable the descheduling and preemption of Pods based on their [priorities](/docs/concepts/configuration/pod-priority-preemption/).
- `PVCProtection`: Enable the prevention of a PersistentVolumeClaim (PVC) from
  being deleted when it is still used by any Pod.
  <!-- TODO: add link to feature documentation -->
- `ResourceLimitsPriorityFunction`: Enable a scheduler priority function that
  assigns a lowest possible score of 1 to a node that satisfies at least one of
  the input Pod's cpu and memory limits. The intent is to break ties between
  nodes with same scores.
- `RotateKubeletClientCertificate`: Enable the rotation of the client TLS certificate on the kubelet.
  See [kubelet configuration](/docs/admin/kubelet-tls-bootstrapping/#kubelet-configuration) for more details.
- `RotateKubeletServerCertificate`: Enable the rotation of the server TLS certificate on the kubelet.
  See [kubelet configuration](/docs/admin/kubelet-tls-bootstrapping/#kubelet-configuration) for more details.
- `ServiceNodeExclusion`: Enable the exclusion of nodes from load balancers created by a cloud provider.
  A node is eligible for exclusion if annotated with "`alpha.service-controller.kubernetes.io/exclude-balancer`" key.
- `StreamingProxyRedirects`: Instructs the API server to intercept (and follow)
   redirects from the backend (kubelet) for streaming requests.
  Examples of streaming requests include the `exec`, `attach` and `port-forward` requests.
- `SupportIPVSProxyMode`: Enable providing in-cluster service load balancing using IPVS.
  See [service proxies](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies) for more details.
- `TaintBasedEvictions`: Enable evicting pods from nodes based on taints on nodes and tolerations on Pods.
  See [taints and tolerations](/docs/concepts/configuration/taint-and-toleration/) for more details.
- `TaintNodesByCondition`: Enable automatic tainting nodes based on [node conditions](/docs/concepts/architecture/nodes/#condition).
- `VolumeScheduling`: Enable volume topology aware scheduling and make the
  PersistentVolumeClaim (PVC) binding aware of scheduling decisions.
  <!-- TODO: add link to volume scheduling docs -->

{% endcapture %}

{% include templates/concept.md %}
