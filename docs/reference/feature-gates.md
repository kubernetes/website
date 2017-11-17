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

| Feature | Default | Stage | APIServer | KCM | Kubelet | Scheduler | CCM | Proxy | Since | Till |
|---------|---------|-------|-----------|-----|---------|-----------|-----|-------|-------|------|
| `Accelerators` | `false` | Alpha | | | Y | | | | 1.6 | |
| `AdvancedAuditing` | `false` | Alpha | Y | | | | | | 1.7 | |
| `AdvancedAuditing` | `true` | Beta | Y | | | | | | 1.8 | |
| `AffinityInAnnotations` | `false` | Alpha | Y | | | | | | 1.6 | 1.7 |
| `AllowExtTrafficLocalEndpoints` | `false` | Beta | | | | | | | 1.4 | 1.6 |
| `AllowExtTrafficLocalEndpoints` | `true` | GA | Y | | | | | Y | 1.7 |  |
| `APIListChunking` | `false` | Alpha | Y | | | | | | 1.8 | 1.8 |
| `APIListChunking` | `true` | Beta | Y | | | | | | 1.9 | |
| `APIResponseCompression` | `false` | Alpha | Y | | | | | | 1.7 | |
| `AppArmor` | `true` | Beta | Y | | Y | | | | 1.4 | |
| `CPUManager` | `false` | Alpha | Y | | Y | | | | 1.8 | |
| `CustomResourceValidation` | `false` | Alpha | Y | | | | | | 1.8 | 1.8 |
| `CustomResourceValidation` | `true` | Beta | Y | | | | | | 1.9 | |
| `DevicePlugins` | `false` | Alpha | | | Y | | | | 1.8 | |
| `DynamicKubeletConfig` | `false` | Alpha | Y | | Y | | | | 1.4 | |
| `DynamicVolumeProvisioning` | `true` | Alpha |  | Y | | | | | 1.3 | 1.7 |
| `DynamicVolumeProvisioning` | `true` | GA |  | Y | | | | | 1.8 |  |
| `EnableEquivalenceClassCache` | `false` | Alpha | | | | Y | | | 1.8 | |
| `ExpandPersistentVolumes` | `false` | Alpha | Y | Y | | | | | 1.8 | |
| `ExperimentalCriticalPodAnnotation` | `false` | Alpha | | Y | Y | | | | 1.5 | |
| `ExperimentalHostUserNamespaceDefaulting` | `false` | Beta | | | Y | | | | 1.5 | |
| `HugePages` | `false` | Alpha | Y | | Y | | | | 1.8 | |
| `Initializers` | `false` | Alpha | Y | Y | | | | | 1.7 |  |
| `KubeletConfigFile` | `false` | Alpha | | | Y | | | | 1.8 | |
| `LocalStorageCapacityIsolation` | `false` | Alpha | Y | | Y | | | | 1.7 | |
| `MountContainers` | `false` | Alpha | | | Y | | | | 1.9 | |
| `MountPropagation` | `false` | Alpha | Y | | Y | | | | 1.8 | |
| `PersistentLocalVolumes` | `false` | Alpha | Y | | Y | Y | | | 1.7 | |
| `PodPriority` | `false` | Alpha | Y | | Y | Y | | | 1.8 | |
| `RotateKubeletClientCertificate` | `true` | Beta | | | Y | | | | 1.7 | |
| `RotateKubeletServerCertificate` | `false` | Alpha | Y | Y | Y | | | | 1.7 | |
| `ServiceNodeExclusion` | `false` | Alpha | | Y | | | Y | | 1.8 | |
| `StreamingProxyRedirects` | `true` | Beta | Y | | | | | | 1.5 | |
| `SupportIPVSProxyMode` | `false` | Alpha | | | | | | Y | 1.8 | |
| `TaintBasedEvictions` | `false` | Alpha | | Y | | | | | 1.6 | |
| `TaintNodesByCondition` | `false` | Alpha | Y | Y | | Y | | | 1.8 | |
| `VolumeScheduling` | `false` | Alpha | Y | | | | | | 1.9 | |

## Using Feature

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
- `CPUManager`: Enable container level CPU affinity support, see [CPU Management Policies](/docs/tasks/administer-cluster/cpu-management-policies/).
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
- `VolumeScheduling`: Enable setting volume binding mode (`volumeBindingMode`) on storage classes.

{% endcapture %}

{% include templates/concept.md %}
