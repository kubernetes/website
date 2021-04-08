---
title: v1.21 Release Notes
weight: 10
card:
  name: release-notes
  weight: 20
  anchors:
  - anchor: "#"
    title: Current Release Notes
  - anchor: "#urgent-upgrade-notes"
    title: Urgent Upgrade Notes
---

<!-- NEW RELEASE NOTES ENTRY -->

# v1.21.0

[Documentation](https://docs.k8s.io)

## Downloads for v1.21.0

filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.21.0/kubernetes.tar.gz) | `19bb76a3fa5ce4b9f043b2a3a77c32365ab1fcb902d8dd6678427fb8be8f49f64a5a03dc46aaef9c7dadee05501cf83412eda46f0edacbb8fc1ed0bf5fb79142`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.21.0/kubernetes-src.tar.gz) | `f942e6d6c10007a6e9ce21e94df597015ae646a7bc3e515caf1a3b79f1354efb9aff59c40f2553a8e3d43fe4a01742241f5af18b69666244906ed11a22e3bc49`

### Client Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.21.0/kubernetes-client-darwin-amd64.tar.gz) | `be9d1440e418e5253fb8a3d8aba705ca8160746a9bd17325ad626a986b6da9f733af864155a651a32b7bca94b533b8d596005ddbe5248bdeea85db47a1b957ed`
[kubernetes-client-darwin-arm64.tar.gz](https://dl.k8s.io/v1.21.0/kubernetes-client-darwin-arm64.tar.gz) | `eed0ddc81d104bb2d41ace13f737c490423d5df4ebddc7376e45c18ed66af35933c9376b912c1c3da105945b04056f6ca0870c156bee8a307cf4189ca5eb1dd1`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.21.0/kubernetes-client-linux-386.tar.gz) | `8a2f30c4434199762f2a96141dab4241c1cce2711bea9ea39cc63c2c5e7d31719ed7f076efac1931604e3a94578d3bbf0cfa454965708c96f3cfb91789868746`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.21.0/kubernetes-client-linux-amd64.tar.gz) | `cd3cfa645fa31de3716f1f63506e31b73d2aa8d37bb558bb3b3e8c151f35b3d74d44e03cbd05be67e380f9a5d015aba460222afdac6677815cd99a85c2325cf0`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.21.0/kubernetes-client-linux-arm.tar.gz) | `936042aa11cea0f6dfd2c30fc5dbe655420b34799bede036b1299a92d6831f589ca10290b73b9c9741560b603ae31e450ad024e273f2b4df5354bfac272691d8`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.21.0/kubernetes-client-linux-arm64.tar.gz) | `42beb75364d7bf4bf526804b8a35bd0ab3e124b712e9d1f45c1b914e6be0166619b30695feb24b3eecef134991dacb9ab3597e788bd9e45cf35addddf20dd7f6`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.21.0/kubernetes-client-linux-ppc64le.tar.gz) | `4baba2ed7046b28370eccc22e2378ae79e3ce58220d6f4f1b6791e8233bec8379e30200bb20b971456b83f2b791ea166fdfcf1ea56908bc1eea03590c0eda468`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.21.0/kubernetes-client-linux-s390x.tar.gz) | `37fa0c4d703aef09ce68c10ef3e7362b0313c8f251ce38eea579cd18fae4023d3d2b70e0f31577cabe6958ab9cfc30e98d25a7c64e69048b423057c3cf728339`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.21.0/kubernetes-client-windows-386.tar.gz) | `6900db36c1e3340edfd6dfd8d720575a904c932d39a8a7fa36401595e971a0235bd42111dbcc1cbb77e7374e47f1380a68c637997c18f96a0d9cdc9f3714c4c9`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.21.0/kubernetes-client-windows-amd64.tar.gz) | `90de67f6f79fc63bcfdf35066e3d84501cc85433265ffad36fd1a7a428a31b446249f0644a1e97495ea8b2a08e6944df6ef30363003750339edaa2aceffe937c`

### Server Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.21.0/kubernetes-server-linux-amd64.tar.gz) | `3941dcc2309ac19ec185603a79f5a086d8a198f98c04efa23f15a177e5e1f34946ea9392ba9f5d24d0d727839438f067fef1001fc6e88b27b8b01e35bbd962ca`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.21.0/kubernetes-server-linux-arm.tar.gz) | `6507abf6c2ec2b336901dc23269f6c577ec0049b8bad3c9dd6ad63f21aa10f09bfbbfa6e064c2466d250411d3e10f8672791a9e10942e38de7bfbaf7a8bcc9da`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.21.0/kubernetes-server-linux-arm64.tar.gz) | `5abe76f867ca6865344e957bf166b81766c049ec4eb183a8a5580c22a7f8474db1edf90fd901a5833e56128b6825811653a1d27f72fd34ce5b1287a8c10da05c`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.21.0/kubernetes-server-linux-ppc64le.tar.gz) | `62507b182ca25396a285d91241536860e58f54fac937e97cbdf91948c83bb41be97d33277400489bf50e85164d560205540b76e94e5d519892312bdc63df1067`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.21.0/kubernetes-server-linux-s390x.tar.gz) | `04f2a1f7d1388e4a7d7d9f597f872a3da36f26839cfed16aad6df07021c03f4dca1df06b19cfda56df09d1c2d9a13ebd0af40ca1b9b6aecfaf427ab7712d88f3`

### Node Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.21.0/kubernetes-node-linux-amd64.tar.gz) | `c1831c708109c31b3878e5a9327ea4b9e546504d0b6b00f3d43db78b5dd7d5114d32ac24a9a505f9cadbe61521f0419933348d2cd309ed8cfe3987d9ca8a7e2c`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.21.0/kubernetes-node-linux-arm.tar.gz) | `b68dd5bcfc7f9ce2781952df40c8c3a64c29701beff6ac22f042d6f31d4de220e9200b7e8272ddf608114327770acdaf3cb9a34a0a5206e784bda717ea080e0f`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.21.0/kubernetes-node-linux-arm64.tar.gz) | `7fa84fc500c28774ed25ca34b6f7b208a2bea29d6e8379f84b9f57bd024aa8fe574418cee7ee26edd55310716d43d65ae7b9cbe11e40c995fe2eac7f66bdb423`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.21.0/kubernetes-node-linux-ppc64le.tar.gz) | `a4278b3f8e458e9581e01f0c5ba8443303c987988ee136075a8f2f25515d70ca549fbd2e4d10eefca816c75c381d62d71494bd70c47034ab47f8315bbef4ae37`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.21.0/kubernetes-node-linux-s390x.tar.gz) | `8de2bc6f22f232ff534b45012986eac23893581ccb6c45bd637e40dbe808ce31d5a92375c00dc578bdbadec342b6e5b70c1b9f3d3a7bb26ccfde97d71f9bf84a`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.21.0/kubernetes-node-windows-amd64.tar.gz) | `b82e94663d330cff7a117f99a7544f27d0bc92b36b5a283b3c23725d5b33e6f15e0ebf784627638f22f2d58c58c0c2b618ddfd226a64ae779693a0861475d355`

## Changelog since v1.20.0

# Release notes for v1.21.0-rc.0

[Documentation](https://docs.k8s.io/docs/home)

# Changelog since v1.20.0

## What's New (Major Themes)

### Deprecation of PodSecurityPolicy

PSP as an admission controller resource is being deprecated. Deployed PodSecurityPolicy's will keep working until version 1.25, their target removal from the codebase. A new feature, with a working title of "PSP replacement policy", is being developed in [KEP-2579](https://features.k8s.io/2579). To learn more, read [PodSecurityPolicy Deprecation: Past, Present, and Future](https://blog.k8s.io/2021/04/06/podsecuritypolicy-deprecation-past-present-and-future/).

### Kubernetes API Reference Documentation

The API reference is now generated with [`gen-resourcesdocs`](https://github.com/kubernetes-sigs/reference-docs/tree/c96658d89fb21037b7d00d27e6dbbe6b32375837/gen-resourcesdocs) and it is moving to [Kubernetes API](https://docs.k8s.io/reference/kubernetes-api/)

### Kustomize Updates in Kubectl

[Kustomize](https://github.com/kubernetes-sigs/kustomize) version in kubectl had a jump from v2.0.3 to [v4.0.5](https://github.com/kubernetes/kubernetes/pull/98946). Kustomize is now treated as a library and future updates will be less sporadic.

### Default Container Labels

Pod with multiple containers can use `kubectl.kubernetes.io/default-container` label to have a container preselected for kubectl commands. More can be read in [KEP-2227](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cli/2227-kubectl-default-container/README.md).

### Immutable Secrets and ConfigMaps

Immutable Secrets and ConfigMaps graduates to GA. This feature allows users to specify that the contents of a particular Secret or ConfigMap is immutable for its object lifetime. For such instances, Kubelet will not watch/poll for changes and therefore reducing apiserver load.

### Structured Logging in Kubelet

Kubelet has adopted structured logging, thanks to community effort in accomplishing this within the release timeline. Structured logging in the project remains an ongoing effort -- for folks interested in participating, [keep an eye / chime in to the mailing list discussion](https://groups.google.com/g/kubernetes-dev/c/y4WIw-ntUR8).

### Storage Capacity Tracking

Traditionally, the Kubernetes scheduler was based on the assumptions that additional persistent storage is available everywhere in the cluster and has infinite capacity. Topology constraints addressed the first point, but up to now pod scheduling was still done without considering that the remaining storage capacity may not be enough to start a new pod. [Storage capacity tracking](https://docs.k8s.io/concepts/storage/storage-capacity/) addresses that by adding an API for a CSI driver to report storage capacity and uses that information in the Kubernetes scheduler when choosing a node for a pod. This feature serves as a stepping stone for supporting dynamic provisioning for local volumes and other volume types that are more capacity constrained.

### Generic Ephemeral Volumes

[Generic ephermeral volumes](https://docs.k8s.io/concepts/storage/ephemeral-volumes/#generic-ephemeral-volumes) feature allows any existing storage driver that supports dynamic provisioning to be used as an ephemeral volume with the volume’s lifecycle bound to the Pod. It can be used to provide scratch storage that is different from the root disk, for example persistent memory, or a separate local disk on that node. All StorageClass parameters for volume provisioning are supported. All features supported with PersistentVolumeClaims are supported, such as storage capacity tracking, snapshots and restore, and volume resizing.

### CSI Service Account Token

CSI Service Account Token feature moves to Beta in 1.21. This feature improves the security posture and allows CSI drivers to receive pods' [bound service account tokens](https://github.com/kubernetes/enhancements/blob/master/keps/sig-auth/1205-bound-service-account-tokens/README.md). This feature also provides a knob to re-publish volumes so that short-lived volumes can be refreshed.

### CSI Health Monitoring

The CSI health monitoring feature is being released as a second Alpha in Kubernetes 1.21. This feature enables CSI Drivers to share abnormal volume conditions from the underlying storage systems with Kubernetes so that they can be reported as events on PVCs or Pods. This feature serves as a stepping stone towards programmatic detection and resolution of individual volume health issues by Kubernetes.

## Known Issues

### `TopologyAwareHints` feature falls back to default behavior

The feature gate currently falls back to the default behavior in most cases. Enabling the feature gate will add hints to `EndpointSlices`, but functional differences are only observed in non-dual stack kube-proxy implementation. [The fix will be available in coming releases](https://github.com/kubernetes/kubernetes/pull/100804).

## Urgent Upgrade Notes 

### (No, really, you MUST read this before you upgrade)

- Kube-proxy's IPVS proxy mode no longer sets the net.ipv4.conf.all.route_localnet sysctl parameter. Nodes upgrading will have net.ipv4.conf.all.route_localnet set to 1 but new nodes will inherit the system default (usually 0). If you relied on any behavior requiring net.ipv4.conf.all.route_localnet, you must set ensure it is enabled as kube-proxy will no longer set it automatically. This change helps to further mitigate CVE-2020-8558. ([#92938](https://github.com/kubernetes/kubernetes/pull/92938), [@lbernail](https://github.com/lbernail)) [SIG Network and Release]
 - Kubeadm: during "init" an empty cgroupDriver value in the KubeletConfiguration is now always set to "systemd" unless the user is explicit about it. This requires existing machine setups to configure the container runtime to use the "systemd" driver. Documentation on this topic can be found here: https://kubernetes.io/docs/setup/production-environment/container-runtimes/. When upgrading existing clusters / nodes using "kubeadm upgrade" the old cgroupDriver value is preserved, but in 1.22 this change will also apply to "upgrade". For more information on migrating to the "systemd" driver or remaining on the "cgroupfs" driver see: https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/. ([#99471](https://github.com/kubernetes/kubernetes/pull/99471), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
 - Newly provisioned PVs by EBS plugin will no longer use the deprecated "failure-domain.beta.kubernetes.io/zone" and "failure-domain.beta.kubernetes.io/region" labels. It will use "topology.kubernetes.io/zone" and "topology.kubernetes.io/region" labels instead. ([#99130](https://github.com/kubernetes/kubernetes/pull/99130), [@ayberk](https://github.com/ayberk)) [SIG Cloud Provider, Storage and Testing]
 - Newly provisioned PVs by OpenStack Cinder plugin will no longer use the deprecated "failure-domain.beta.kubernetes.io/zone" and "failure-domain.beta.kubernetes.io/region" labels. It will use "topology.kubernetes.io/zone" and "topology.kubernetes.io/region" labels instead. ([#99719](https://github.com/kubernetes/kubernetes/pull/99719), [@jsafrane](https://github.com/jsafrane)) [SIG Cloud Provider and Storage]
 - Newly provisioned PVs by gce-pd will no longer have the beta FailureDomain label. gce-pd volume plugin will start to have GA topology label instead. ([#98700](https://github.com/kubernetes/kubernetes/pull/98700), [@Jiawei0227](https://github.com/Jiawei0227)) [SIG Cloud Provider, Storage and Testing]
 - OpenStack Cinder CSI migration is on by default, Clinder CSI driver must be installed on clusters on OpenStack for Cinder volumes to work. ([#98538](https://github.com/kubernetes/kubernetes/pull/98538), [@dims](https://github.com/dims)) [SIG Storage]
 - Remove alpha `CSIMigrationXXComplete` flag and add alpha `InTreePluginXXUnregister` flag. Deprecate `CSIMigrationvSphereComplete` flag and it will be removed in v1.22. ([#98243](https://github.com/kubernetes/kubernetes/pull/98243), [@Jiawei0227](https://github.com/Jiawei0227))
 - Remove storage metrics `storage_operation_errors_total`, since we already have `storage_operation_status_count`.And add new field `status` for `storage_operation_duration_seconds`, so that we can know about all status storage operation latency. ([#98332](https://github.com/kubernetes/kubernetes/pull/98332), [@JornShen](https://github.com/JornShen)) [SIG Instrumentation and Storage]
 - The metric `storage_operation_errors_total` is not removed, but is marked deprecated, and the metric `storage_operation_status_count` is marked deprecated. In both cases the `storage_operation_duration_seconds` metric can be used to recover equivalent counts (using `status=fail-unknown` in the case of `storage_operations_errors_total`). ([#99045](https://github.com/kubernetes/kubernetes/pull/99045), [@mattcary](https://github.com/mattcary))
 - `ServiceNodeExclusion`, `NodeDisruptionExclusion` and `LegacyNodeRoleBehavior` features have been promoted to GA. `ServiceNodeExclusion` and `NodeDisruptionExclusion` are now unconditionally enabled, while `LegacyNodeRoleBehavior` is unconditionally disabled. To prevent control plane nodes from being added to load balancers automatically, upgrade users need to add "node.kubernetes.io/exclude-from-external-load-balancers" label to control plane nodes. ([#97543](https://github.com/kubernetes/kubernetes/pull/97543), [@pacoxu](https://github.com/pacoxu))
 
## Changes by Kind

### Deprecation

- Aborting the drain command in a list of nodes will be deprecated. The new behavior will make the drain command go through all nodes even if one or more nodes failed during the drain. For now, users can try such experience by enabling --ignore-errors flag. ([#98203](https://github.com/kubernetes/kubernetes/pull/98203), [@yuzhiquan](https://github.com/yuzhiquan))
- Delete deprecated `service.beta.kubernetes.io/azure-load-balancer-mixed-protocols` mixed procotol annotation in favor of the MixedProtocolLBService feature ([#97096](https://github.com/kubernetes/kubernetes/pull/97096), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]
- Deprecate the `topologyKeys` field in Service. This capability will be replaced with upcoming work around Topology Aware Subsetting and Service Internal Traffic Policy. ([#96736](https://github.com/kubernetes/kubernetes/pull/96736), [@andrewsykim](https://github.com/andrewsykim)) [SIG Apps]
- Kube-proxy: remove deprecated --cleanup-ipvs flag of kube-proxy, and make --cleanup flag always to flush IPVS ([#97336](https://github.com/kubernetes/kubernetes/pull/97336), [@maaoBit](https://github.com/maaoBit)) [SIG Network]
- Kubeadm: deprecated command "alpha selfhosting pivot" is now removed. ([#97627](https://github.com/kubernetes/kubernetes/pull/97627), [@knight42](https://github.com/knight42))
- Kubeadm: graduate the command `kubeadm alpha kubeconfig user` to `kubeadm kubeconfig user`. The `kubeadm alpha kubeconfig user` command is deprecated now. ([#97583](https://github.com/kubernetes/kubernetes/pull/97583), [@knight42](https://github.com/knight42)) [SIG Cluster Lifecycle]
- Kubeadm: the "kubeadm alpha certs" command is removed now, please use "kubeadm certs" instead. ([#97706](https://github.com/kubernetes/kubernetes/pull/97706), [@knight42](https://github.com/knight42)) [SIG Cluster Lifecycle]
- Kubeadm: the deprecated kube-dns is no longer supported as an option. If "ClusterConfiguration.dns.type" is set to "kube-dns" kubeadm will now throw an error. ([#99646](https://github.com/kubernetes/kubernetes/pull/99646), [@rajansandeep](https://github.com/rajansandeep)) [SIG Cluster Lifecycle]
- Kubectl: The deprecated `kubectl alpha debug` command is removed. Use `kubectl debug` instead. ([#98111](https://github.com/kubernetes/kubernetes/pull/98111), [@pandaamanda](https://github.com/pandaamanda)) [SIG CLI]
- Official support to build kubernetes with docker-machine / remote docker is removed. This change does not affect building kubernetes with docker locally. ([#97935](https://github.com/kubernetes/kubernetes/pull/97935), [@adeniyistephen](https://github.com/adeniyistephen)) [SIG Release and Testing]
- Remove deprecated `--generator, --replicas, --service-generator, --service-overrides, --schedule` from `kubectl run`
  Deprecate `--serviceaccount, --hostport, --requests, --limits` in `kubectl run` ([#99732](https://github.com/kubernetes/kubernetes/pull/99732), [@soltysh](https://github.com/soltysh))
- Remove the deprecated metrics "scheduling_algorithm_preemption_evaluation_seconds" and "binding_duration_seconds", suggest to use "scheduler_framework_extension_point_duration_seconds" instead. ([#96447](https://github.com/kubernetes/kubernetes/pull/96447), [@chendave](https://github.com/chendave)) [SIG Cluster Lifecycle, Instrumentation, Scheduling and Testing]
- Removing experimental windows container hyper-v support with Docker ([#97141](https://github.com/kubernetes/kubernetes/pull/97141), [@wawa0210](https://github.com/wawa0210)) [SIG Node and Windows]
- Rename metrics `etcd_object_counts` to `apiserver_storage_object_counts` and mark it as stable. The original `etcd_object_counts` metrics name is marked as "Deprecated" and will be removed in the future. ([#99785](https://github.com/kubernetes/kubernetes/pull/99785), [@erain](https://github.com/erain)) [SIG API Machinery, Instrumentation and Testing]
- The GA TokenRequest and TokenRequestProjection feature gates have been removed and are unconditionally enabled. Remove explicit use of those feature gates in CLI invocations. ([#97148](https://github.com/kubernetes/kubernetes/pull/97148), [@wawa0210](https://github.com/wawa0210)) [SIG Node]
- The PodSecurityPolicy API is deprecated in 1.21, and will no longer be served starting in 1.25. ([#97171](https://github.com/kubernetes/kubernetes/pull/97171), [@deads2k](https://github.com/deads2k)) [SIG Auth and CLI]
- The `batch/v2alpha1` CronJob type definitions and clients are deprecated and removed. ([#96987](https://github.com/kubernetes/kubernetes/pull/96987), [@soltysh](https://github.com/soltysh)) [SIG API Machinery, Apps, CLI and Testing]
- The `export` query parameter (inconsistently supported by API resources and deprecated in v1.14) is fully removed.  Requests setting this query parameter will now receive a 400 status response. ([#98312](https://github.com/kubernetes/kubernetes/pull/98312), [@deads2k](https://github.com/deads2k)) [SIG API Machinery, Auth and Testing]
- `audit.k8s.io/v1beta1` and `audit.k8s.io/v1alpha1` audit policy configuration and audit events are deprecated in favor of `audit.k8s.io/v1`, available since v1.13. kube-apiserver invocations that specify alpha or beta policy configurations with `--audit-policy-file`, or explicitly request alpha or beta audit events with `--audit-log-version` / `--audit-webhook-version` must update to use `audit.k8s.io/v1` and accept `audit.k8s.io/v1` events prior to v1.24. ([#98858](https://github.com/kubernetes/kubernetes/pull/98858), [@carlory](https://github.com/carlory)) [SIG Auth]
- `discovery.k8s.io/v1beta1` EndpointSlices are deprecated in favor of `discovery.k8s.io/v1`, and will no longer be served in Kubernetes v1.25. ([#100472](https://github.com/kubernetes/kubernetes/pull/100472), [@liggitt](https://github.com/liggitt))
- `diskformat` storage class parameter for in-tree vSphere volume plugin is deprecated as of v1.21 release. Please consider updating storageclass and remove `diskformat` parameter. vSphere CSI Driver does not support diskformat storageclass parameter.
  
  vSphere releases less than 67u3 are deprecated as of v1.21. Please consider upgrading vSphere to 67u3 or above. vSphere CSI Driver requires minimum vSphere 67u3.
  
  VM Hardware version less than 15 is deprecated as of v1.21. Please consider upgrading the Node VM Hardware version to 15 or above. vSphere CSI Driver recommends Node VM's Hardware version set to at least vmx-15.
  
  Multi vCenter support is deprecated as of v1.21. If you have a Kubernetes cluster spanning across multiple vCenter servers, please consider moving all k8s nodes to a single vCenter Server. vSphere CSI Driver does not support Kubernetes deployment spanning across multiple vCenter servers.
  
  Support for these deprecations will be available till Kubernetes v1.24. ([#98546](https://github.com/kubernetes/kubernetes/pull/98546), [@divyenpatel](https://github.com/divyenpatel))

### API Change

- 1. PodAffinityTerm includes a namespaceSelector field to allow selecting eligible namespaces based on their labels. 
  2. A new CrossNamespacePodAffinity quota scope API that allows restricting which namespaces allowed to use PodAffinityTerm with corss-namespace reference via namespaceSelector or namespaces fields. ([#98582](https://github.com/kubernetes/kubernetes/pull/98582), [@ahg-g](https://github.com/ahg-g)) [SIG API Machinery, Apps, Auth and Testing]
- Add Probe-level terminationGracePeriodSeconds field ([#99375](https://github.com/kubernetes/kubernetes/pull/99375), [@ehashman](https://github.com/ehashman)) [SIG API Machinery, Apps, Node and Testing]
- Added `.spec.completionMode` field to Job, with accepted values `NonIndexed` (default) and `Indexed`. This is an alpha field and is only honored by servers with the `IndexedJob` feature gate enabled. ([#98441](https://github.com/kubernetes/kubernetes/pull/98441), [@alculquicondor](https://github.com/alculquicondor)) [SIG Apps and CLI]
- Adds support for endPort field in NetworkPolicy ([#97058](https://github.com/kubernetes/kubernetes/pull/97058), [@rikatz](https://github.com/rikatz)) [SIG Apps and Network]
- CSIServiceAccountToken graduates to Beta and enabled by default. ([#99298](https://github.com/kubernetes/kubernetes/pull/99298), [@zshihang](https://github.com/zshihang))
- Cluster admins can now turn off `/debug/pprof` and `/debug/flags/v` endpoint in kubelet by setting `enableProfilingHandler` and `enableDebugFlagsHandler` to `false` in the Kubelet configuration file. Options `enableProfilingHandler` and `enableDebugFlagsHandler` can be set to `true` only when `enableDebuggingHandlers` is also set to `true`. ([#98458](https://github.com/kubernetes/kubernetes/pull/98458), [@SaranBalaji90](https://github.com/SaranBalaji90))
- DaemonSets accept a MaxSurge integer or percent on their rolling update strategy that will launch the updated pod on nodes and wait for those pods to go ready before marking the old out-of-date pods as deleted. This allows workloads to avoid downtime during upgrades when deployed using DaemonSets. This feature is alpha and is behind the DaemonSetUpdateSurge feature gate. ([#96441](https://github.com/kubernetes/kubernetes/pull/96441), [@smarterclayton](https://github.com/smarterclayton)) [SIG Apps and Testing]
- Enable SPDY pings to keep connections alive, so that `kubectl exec` and `kubectl portforward` won't be interrupted. ([#97083](https://github.com/kubernetes/kubernetes/pull/97083), [@knight42](https://github.com/knight42)) [SIG API Machinery and CLI]
- FieldManager no longer owns fields that get reset before the object is persisted (e.g. "status wiping"). ([#99661](https://github.com/kubernetes/kubernetes/pull/99661), [@kevindelgado](https://github.com/kevindelgado)) [SIG API Machinery, Auth and Testing]
- Fixes server-side apply for APIService resources. ([#98576](https://github.com/kubernetes/kubernetes/pull/98576), [@kevindelgado](https://github.com/kevindelgado))
- Generic ephemeral volumes are beta. ([#99643](https://github.com/kubernetes/kubernetes/pull/99643), [@pohly](https://github.com/pohly)) [SIG API Machinery, Apps, Auth, CLI, Node, Storage and Testing]
- Hugepages request values are limited to integer multiples of the page size. ([#98515](https://github.com/kubernetes/kubernetes/pull/98515), [@lala123912](https://github.com/lala123912)) [SIG Apps]
- Implement the GetAvailableResources in the podresources API. ([#95734](https://github.com/kubernetes/kubernetes/pull/95734), [@fromanirh](https://github.com/fromanirh)) [SIG Instrumentation, Node and Testing]
- IngressClass resource can now reference a resource in a specific namespace 
  for implementation-specific configuration (previously only Cluster-level resources were allowed). 
  This feature can be enabled using the IngressClassNamespacedParams feature gate. ([#99275](https://github.com/kubernetes/kubernetes/pull/99275), [@hbagdi](https://github.com/hbagdi))
- Jobs API has a new `.spec.suspend` field that can be used to suspend and resume Jobs. This is an alpha field which is only honored by servers with the `SuspendJob` feature gate enabled. ([#98727](https://github.com/kubernetes/kubernetes/pull/98727), [@adtac](https://github.com/adtac))
- Kubelet Graceful Node Shutdown feature graduates to Beta and enabled by default. ([#99735](https://github.com/kubernetes/kubernetes/pull/99735), [@bobbypage](https://github.com/bobbypage))
- Kubernetes is now built using go1.15.7 ([#98363](https://github.com/kubernetes/kubernetes/pull/98363), [@cpanato](https://github.com/cpanato)) [SIG Cloud Provider, Instrumentation, Node, Release and Testing]
- Namespace API objects now have a `kubernetes.io/metadata.name` label matching their metadata.name field to allow selecting any namespace by its name using a label selector. ([#96968](https://github.com/kubernetes/kubernetes/pull/96968), [@jayunit100](https://github.com/jayunit100)) [SIG API Machinery, Apps, Cloud Provider, Storage and Testing]
- One new field "InternalTrafficPolicy" in Service is added.
  It specifies if the cluster internal traffic should be routed to all endpoints or node-local endpoints only.
  "Cluster" routes internal traffic to a Service to all endpoints.
  "Local" routes traffic to node-local endpoints only, and traffic is dropped if no node-local endpoints are ready.
  The default value is "Cluster". ([#96600](https://github.com/kubernetes/kubernetes/pull/96600), [@maplain](https://github.com/maplain)) [SIG API Machinery, Apps and Network]
- PodDisruptionBudget API objects can now contain conditions in status. ([#98127](https://github.com/kubernetes/kubernetes/pull/98127), [@mortent](https://github.com/mortent)) [SIG API Machinery, Apps, Auth, CLI, Cloud Provider, Cluster Lifecycle and Instrumentation]
- PodSecurityPolicy only stores "generic" as allowed volume type if the GenericEphemeralVolume feature gate is enabled ([#98918](https://github.com/kubernetes/kubernetes/pull/98918), [@pohly](https://github.com/pohly)) [SIG Auth and Security]
- Promote CronJobs to batch/v1 ([#99423](https://github.com/kubernetes/kubernetes/pull/99423), [@soltysh](https://github.com/soltysh)) [SIG API Machinery, Apps, CLI and Testing]
- Promote Immutable Secrets/ConfigMaps feature to Stable. This allows to set `immutable` field in Secret or ConfigMap object to mark their contents as immutable. ([#97615](https://github.com/kubernetes/kubernetes/pull/97615), [@wojtek-t](https://github.com/wojtek-t)) [SIG Apps, Architecture, Node and Testing]
- Remove support for building Kubernetes with bazel. ([#99561](https://github.com/kubernetes/kubernetes/pull/99561), [@BenTheElder](https://github.com/BenTheElder)) [SIG API Machinery, Apps, Architecture, Auth, Autoscaling, CLI, Cloud Provider, Cluster Lifecycle, Instrumentation, Network, Node, Release, Scalability, Scheduling, Storage, Testing and Windows]
- Scheduler extender filter interface now can report unresolvable failed nodes in the new field `FailedAndUnresolvableNodes` of  `ExtenderFilterResult` struct. Nodes in this map will be skipped in the preemption phase. ([#92866](https://github.com/kubernetes/kubernetes/pull/92866), [@cofyc](https://github.com/cofyc)) [SIG Scheduling]
- Services can specify loadBalancerClass to use a custom load balancer ([#98277](https://github.com/kubernetes/kubernetes/pull/98277), [@XudongLiuHarold](https://github.com/XudongLiuHarold))
- Storage capacity tracking (= the CSIStorageCapacity feature) graduates to Beta and enabled by default, storage.k8s.io/v1alpha1/VolumeAttachment and storage.k8s.io/v1alpha1/CSIStorageCapacity objects are deprecated ([#99641](https://github.com/kubernetes/kubernetes/pull/99641), [@pohly](https://github.com/pohly))
- Support for Indexed Job: a Job that is considered completed when Pods associated to indexes from 0 to (.spec.completions-1) have succeeded. ([#98812](https://github.com/kubernetes/kubernetes/pull/98812), [@alculquicondor](https://github.com/alculquicondor)) [SIG Apps and CLI]
- The BoundServiceAccountTokenVolume feature has been promoted to beta, and enabled by default.
  - This changes the tokens provided to containers at `/var/run/secrets/kubernetes.io/serviceaccount/token` to be time-limited, auto-refreshed, and invalidated when the containing pod is deleted.
  - Clients should reload the token from disk periodically (once per minute is recommended) to ensure they continue to use a valid token. `k8s.io/client-go` version v11.0.0+ and v0.15.0+ reload tokens automatically.
  - By default, injected tokens are given an extended lifetime so they remain valid even after a new refreshed token is provided. The metric `serviceaccount_stale_tokens_total` can be used to monitor for workloads that are depending on the extended lifetime and are continuing to use tokens even after a refreshed token is provided to the container. If that metric indicates no existing workloads are depending on extended lifetimes, injected token lifetime can be shortened to 1 hour by starting `kube-apiserver` with `--service-account-extend-token-expiration=false`. ([#95667](https://github.com/kubernetes/kubernetes/pull/95667), [@zshihang](https://github.com/zshihang)) [SIG API Machinery, Auth, Cluster Lifecycle and Testing]
- The EndpointSlice Controllers are now GA. The `EndpointSliceController` will not populate the `deprecatedTopology` field and will only provide topology information through the `zone` and `nodeName` fields. ([#99870](https://github.com/kubernetes/kubernetes/pull/99870), [@swetharepakula](https://github.com/swetharepakula))
- The Endpoints controller will now set the `endpoints.kubernetes.io/over-capacity` annotation to "warning" when an Endpoints resource contains more than 1000 addresses. In a future release, the controller will truncate Endpoints that exceed this limit. The EndpointSlice API can be used to support significantly larger number of addresses. ([#99975](https://github.com/kubernetes/kubernetes/pull/99975), [@robscott](https://github.com/robscott)) [SIG Apps and Network]
- The PodDisruptionBudget API has been promoted to policy/v1 with no schema changes. The only functional change is that an empty selector (`{}`) written to a policy/v1 PodDisruptionBudget now selects all pods in the namespace. The behavior of the policy/v1beta1 API remains unchanged. The policy/v1beta1 PodDisruptionBudget API is deprecated and will no longer be served in 1.25+. ([#99290](https://github.com/kubernetes/kubernetes/pull/99290), [@mortent](https://github.com/mortent)) [SIG API Machinery, Apps, Auth, Autoscaling, CLI, Cloud Provider, Cluster Lifecycle, Instrumentation, Scheduling and Testing]
- The `EndpointSlice` API is now GA. The `EndpointSlice` topology field has been removed from the GA API and will be replaced by a new per Endpoint Zone field. If the topology field was previously used, it will be converted into an annotation in the v1 Resource. The `discovery.k8s.io/v1alpha1` API is removed. ([#99662](https://github.com/kubernetes/kubernetes/pull/99662), [@swetharepakula](https://github.com/swetharepakula))
- The `controller.kubernetes.io/pod-deletion-cost` annotation can be set to offer a hint on the cost of deleting a `Pod` compared to other pods belonging to the same ReplicaSet. Pods with lower deletion cost are deleted first. This is an alpha feature. ([#99163](https://github.com/kubernetes/kubernetes/pull/99163), [@ahg-g](https://github.com/ahg-g))
- The kube-apiserver now resets `managedFields` that got corrupted by a mutating admission controller. ([#98074](https://github.com/kubernetes/kubernetes/pull/98074), [@kwiesmueller](https://github.com/kwiesmueller))
- Topology Aware Hints are now available in alpha and can be enabled with the `TopologyAwareHints` feature gate. ([#99522](https://github.com/kubernetes/kubernetes/pull/99522), [@robscott](https://github.com/robscott)) [SIG API Machinery, Apps, Auth, Instrumentation, Network and Testing]
- Users might specify the `kubectl.kubernetes.io/default-exec-container` annotation in a Pod to preselect container for kubectl commands. ([#97099](https://github.com/kubernetes/kubernetes/pull/97099), [@pacoxu](https://github.com/pacoxu)) [SIG CLI]

### Feature

- A client-go metric, rest_client_exec_plugin_call_total, has been added to track total calls to client-go credential plugins. ([#98892](https://github.com/kubernetes/kubernetes/pull/98892), [@ankeesler](https://github.com/ankeesler)) [SIG API Machinery, Auth, Cluster Lifecycle and Instrumentation]
- A new histogram metric to track the time it took to delete a job by the `TTLAfterFinished` controller ([#98676](https://github.com/kubernetes/kubernetes/pull/98676), [@ahg-g](https://github.com/ahg-g))
- AWS cloud provider supports auto-discovering subnets without any `kubernetes.io/cluster/<clusterName>` tags. It also supports additional service annotation `service.beta.kubernetes.io/aws-load-balancer-subnets` to manually configure the subnets. ([#97431](https://github.com/kubernetes/kubernetes/pull/97431), [@kishorj](https://github.com/kishorj))
- Aborting the drain command in a list of nodes will be deprecated. The new behavior will make the drain command go through all nodes even if one or more nodes failed during the drain. For now, users can try such experience by enabling --ignore-errors flag. ([#98203](https://github.com/kubernetes/kubernetes/pull/98203), [@yuzhiquan](https://github.com/yuzhiquan))
- Add --permit-address-sharing flag to `kube-apiserver` to listen with `SO_REUSEADDR`. While allowing to listen on wildcard IPs like 0.0.0.0 and specific IPs in parallel, it avoids waiting for the kernel to release socket in `TIME_WAIT` state, and hence, considerably reducing `kube-apiserver` restart times under certain conditions. ([#93861](https://github.com/kubernetes/kubernetes/pull/93861), [@sttts](https://github.com/sttts))
- Add `csi_operations_seconds` metric on kubelet that exposes CSI operations duration and status for node CSI operations. ([#98979](https://github.com/kubernetes/kubernetes/pull/98979), [@Jiawei0227](https://github.com/Jiawei0227)) [SIG Instrumentation and Storage]
- Add `migrated` field into `storage_operation_duration_seconds` metric ([#99050](https://github.com/kubernetes/kubernetes/pull/99050), [@Jiawei0227](https://github.com/Jiawei0227)) [SIG Apps, Instrumentation and Storage]
- Add flag --lease-reuse-duration-seconds for kube-apiserver to config etcd lease reuse duration. ([#97009](https://github.com/kubernetes/kubernetes/pull/97009), [@lingsamuel](https://github.com/lingsamuel)) [SIG API Machinery and Scalability]
- Add metric etcd_lease_object_counts for kube-apiserver to observe max objects attached to a single etcd lease. ([#97480](https://github.com/kubernetes/kubernetes/pull/97480), [@lingsamuel](https://github.com/lingsamuel)) [SIG API Machinery, Instrumentation and Scalability]
- Add support to generate client-side binaries for new darwin/arm64 platform ([#97743](https://github.com/kubernetes/kubernetes/pull/97743), [@dims](https://github.com/dims)) [SIG Release and Testing]
- Added `ephemeral_volume_controller_create[_failures]_total` counters to kube-controller-manager metrics ([#99115](https://github.com/kubernetes/kubernetes/pull/99115), [@pohly](https://github.com/pohly)) [SIG API Machinery, Apps, Cluster Lifecycle, Instrumentation and Storage]
- Added support for installing `arm64` node artifacts. ([#99242](https://github.com/kubernetes/kubernetes/pull/99242), [@liu-cong](https://github.com/liu-cong))
- Adds alpha feature `VolumeCapacityPriority` which makes the scheduler prioritize nodes based on the best matching size of statically provisioned PVs across multiple topologies. ([#96347](https://github.com/kubernetes/kubernetes/pull/96347), [@cofyc](https://github.com/cofyc)) [SIG Apps, Network, Scheduling, Storage and Testing]
- Adds the ability to pass --strict-transport-security-directives to the kube-apiserver to set the HSTS header appropriately.  Be sure you understand the consequences to browsers before setting this field. ([#96502](https://github.com/kubernetes/kubernetes/pull/96502), [@249043822](https://github.com/249043822)) [SIG Auth]
- Adds two new metrics to cronjobs, a histogram to track the time difference when a job is created and the expected time when it should be created, as well as a gauge for the missed schedules of a cronjob ([#99341](https://github.com/kubernetes/kubernetes/pull/99341), [@alaypatel07](https://github.com/alaypatel07))
- Alpha implementation of Kubectl Command Headers: SIG CLI KEP 859 enabled when KUBECTL_COMMAND_HEADERS environment variable set on the client command line. ([#98952](https://github.com/kubernetes/kubernetes/pull/98952), [@seans3](https://github.com/seans3))
- Base-images: Update to debian-iptables:buster-v1.4.0
  - Uses iptables 1.8.5
  - base-images: Update to debian-base:buster-v1.3.0
  - cluster/images/etcd: Build etcd:3.4.13-2 image
    - Uses debian-base:buster-v1.3.0 ([#98401](https://github.com/kubernetes/kubernetes/pull/98401), [@pacoxu](https://github.com/pacoxu)) [SIG Testing]
- CRIContainerLogRotation graduates to GA and unconditionally enabled. ([#99651](https://github.com/kubernetes/kubernetes/pull/99651), [@umohnani8](https://github.com/umohnani8))
- Component owner can configure the allowlist of metric label with flag '--allow-metric-labels'. ([#99385](https://github.com/kubernetes/kubernetes/pull/99385), [@YoyinZyc](https://github.com/YoyinZyc)) [SIG API Machinery, CLI, Cloud Provider, Cluster Lifecycle, Instrumentation and Release]
- Component owner can configure the allowlist of metric label with flag '--allow-metric-labels'. ([#99738](https://github.com/kubernetes/kubernetes/pull/99738), [@YoyinZyc](https://github.com/YoyinZyc)) [SIG API Machinery, Cluster Lifecycle and Instrumentation]
- EmptyDir memory backed volumes are sized as the the minimum of pod allocatable memory on a host and an optional explicit user provided value. ([#100319](https://github.com/kubernetes/kubernetes/pull/100319), [@derekwaynecarr](https://github.com/derekwaynecarr)) [SIG Node]
- Enables Kubelet to check volume condition and log events to corresponding pods. ([#99284](https://github.com/kubernetes/kubernetes/pull/99284), [@fengzixu](https://github.com/fengzixu)) [SIG Apps, Instrumentation, Node and Storage]
- EndpointSliceNodeName graduates to GA and thus will be unconditionally enabled -- NodeName will always be available in the v1beta1 API. ([#99746](https://github.com/kubernetes/kubernetes/pull/99746), [@swetharepakula](https://github.com/swetharepakula))
- Export `NewDebuggingRoundTripper` function and `DebugLevel` options in the k8s.io/client-go/transport package. ([#98324](https://github.com/kubernetes/kubernetes/pull/98324), [@atosatto](https://github.com/atosatto))
- Kube-proxy iptables: new metric sync_proxy_rules_iptables_total that exposes the number of rules programmed per table in each iteration ([#99653](https://github.com/kubernetes/kubernetes/pull/99653), [@aojea](https://github.com/aojea)) [SIG Instrumentation and Network]
- Kube-scheduler now logs plugin scoring summaries at --v=4 ([#99411](https://github.com/kubernetes/kubernetes/pull/99411), [@damemi](https://github.com/damemi)) [SIG Scheduling]
- Kubeadm now includes CoreDNS v1.8.0. ([#96429](https://github.com/kubernetes/kubernetes/pull/96429), [@rajansandeep](https://github.com/rajansandeep)) [SIG Cluster Lifecycle]
- Kubeadm: IPv6DualStack feature gate graduates to Beta and enabled by default ([#99294](https://github.com/kubernetes/kubernetes/pull/99294), [@pacoxu](https://github.com/pacoxu))
- Kubeadm: a warning to user as ipv6 site-local is deprecated ([#99574](https://github.com/kubernetes/kubernetes/pull/99574), [@pacoxu](https://github.com/pacoxu)) [SIG Cluster Lifecycle and Network]
- Kubeadm: add support for certificate chain validation. When using kubeadm in external CA mode, this allows an intermediate CA to be used to sign the certificates. The intermediate CA certificate must be appended to each signed certificate for this to work correctly. ([#97266](https://github.com/kubernetes/kubernetes/pull/97266), [@robbiemcmichael](https://github.com/robbiemcmichael)) [SIG Cluster Lifecycle]
- Kubeadm: amend the node kernel validation to treat CGROUP_PIDS, FAIR_GROUP_SCHED as required and CFS_BANDWIDTH, CGROUP_HUGETLB as optional ([#96378](https://github.com/kubernetes/kubernetes/pull/96378), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle and Node]
- Kubeadm: apply the "node.kubernetes.io/exclude-from-external-load-balancers" label on control plane nodes during "init", "join" and "upgrade" to preserve backwards compatibility with the lagacy LB mode where nodes labeled as "master" where excluded. To opt-out you can remove the label from a node. See #97543 and the linked KEP for more details. ([#98269](https://github.com/kubernetes/kubernetes/pull/98269), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Kubeadm: if the user has customized their image repository via the kubeadm configuration, pass the custom pause image repository and tag to the kubelet via --pod-infra-container-image not only for Docker but for all container runtimes. This flag tells the kubelet that it should not garbage collect the image. ([#99476](https://github.com/kubernetes/kubernetes/pull/99476), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Kubeadm: perform pre-flight validation on host/node name upon `kubeadm init` and `kubeadm join`, showing warnings on non-compliant names ([#99194](https://github.com/kubernetes/kubernetes/pull/99194), [@pacoxu](https://github.com/pacoxu))
- Kubectl version changed to write a warning message to stderr if the client and server version difference exceeds the supported version skew of +/-1 minor version. ([#98250](https://github.com/kubernetes/kubernetes/pull/98250), [@brianpursley](https://github.com/brianpursley)) [SIG CLI]
- Kubectl: Add `--use-protocol-buffers` flag to kubectl top pods and nodes. ([#96655](https://github.com/kubernetes/kubernetes/pull/96655), [@serathius](https://github.com/serathius))
- Kubectl: `kubectl get` will omit managed fields by default now. Users could set `--show-managed-fields` to true to show managedFields when the output format is either `json` or `yaml`. ([#96878](https://github.com/kubernetes/kubernetes/pull/96878), [@knight42](https://github.com/knight42)) [SIG CLI and Testing]
- Kubectl: a Pod can be preselected as default container using `kubectl.kubernetes.io/default-container` annotation ([#99833](https://github.com/kubernetes/kubernetes/pull/99833), [@mengjiao-liu](https://github.com/mengjiao-liu))
- Kubectl: add bash-completion for comma separated list on `kubectl get` ([#98301](https://github.com/kubernetes/kubernetes/pull/98301), [@phil9909](https://github.com/phil9909))
- Kubernetes is now built using go1.15.8 ([#98834](https://github.com/kubernetes/kubernetes/pull/98834), [@cpanato](https://github.com/cpanato)) [SIG Cloud Provider, Instrumentation, Release and Testing]
- Kubernetes is now built with Golang 1.16 ([#98572](https://github.com/kubernetes/kubernetes/pull/98572), [@justaugustus](https://github.com/justaugustus)) [SIG API Machinery, Auth, CLI, Cloud Provider, Cluster Lifecycle, Instrumentation, Node, Release and Testing]
- Kubernetes is now built with Golang 1.16.1 ([#100106](https://github.com/kubernetes/kubernetes/pull/100106), [@justaugustus](https://github.com/justaugustus)) [SIG Cloud Provider, Instrumentation, Release and Testing]
- Metrics can now be disabled explicitly via a command line flag (i.e. '--disabled-metrics=metric1,metric2') ([#99217](https://github.com/kubernetes/kubernetes/pull/99217), [@logicalhan](https://github.com/logicalhan))
- New admission controller `DenyServiceExternalIPs` is available.  Clusters which do not *need* the Service `externalIPs` feature should enable this controller and be more secure. ([#97395](https://github.com/kubernetes/kubernetes/pull/97395), [@thockin](https://github.com/thockin))
- Overall, enable the feature of `PreferNominatedNode` will  improve the performance of scheduling where preemption might frequently happen, but in theory, enable the feature of `PreferNominatedNode`, the pod might not be scheduled to the best candidate node in the cluster. ([#93179](https://github.com/kubernetes/kubernetes/pull/93179), [@chendave](https://github.com/chendave)) [SIG Scheduling and Testing]
- Persistent Volumes formatted with the btrfs filesystem will now automatically resize when expanded. ([#99361](https://github.com/kubernetes/kubernetes/pull/99361), [@Novex](https://github.com/Novex)) [SIG Storage]
- Port the devicemanager to Windows node to allow device plugins like directx ([#93285](https://github.com/kubernetes/kubernetes/pull/93285), [@aarnaud](https://github.com/aarnaud)) [SIG Node, Testing and Windows]
- Removes cAdvisor JSON metrics (/stats/container, /stats/<podname>/<containername>, /stats/<namespace>/<podname>/<poduid>/<containername>) from the kubelet. ([#99236](https://github.com/kubernetes/kubernetes/pull/99236), [@pacoxu](https://github.com/pacoxu))
- Rename metrics `etcd_object_counts` to `apiserver_storage_object_counts` and mark it as stable. The original `etcd_object_counts` metrics name is marked as "Deprecated" and will be removed in the future. ([#99785](https://github.com/kubernetes/kubernetes/pull/99785), [@erain](https://github.com/erain)) [SIG API Machinery, Instrumentation and Testing]
- Sysctls graduates to General Availability and thus unconditionally enabled. ([#99158](https://github.com/kubernetes/kubernetes/pull/99158), [@wgahnagl](https://github.com/wgahnagl))
- The Kubernetes pause image manifest list now contains an image for Windows Server 20H2. ([#97322](https://github.com/kubernetes/kubernetes/pull/97322), [@claudiubelu](https://github.com/claudiubelu)) [SIG Windows]
- The NodeAffinity plugin implements the PreFilter extension, offering enhanced performance for Filter. ([#99213](https://github.com/kubernetes/kubernetes/pull/99213), [@AliceZhang2016](https://github.com/AliceZhang2016)) [SIG Scheduling]
- The `CronJobControllerV2` feature flag graduates to Beta and set to be enabled by default. ([#98878](https://github.com/kubernetes/kubernetes/pull/98878), [@soltysh](https://github.com/soltysh))
- The `EndpointSlice` mirroring controller mirrors endpoints annotations and labels to the generated endpoint slices, it also ensures that updates on any of these fields are mirrored. 
  The well-known annotation `endpoints.kubernetes.io/last-change-trigger-time` is skipped and not mirrored. ([#98116](https://github.com/kubernetes/kubernetes/pull/98116), [@aojea](https://github.com/aojea))
- The `RunAsGroup` feature has been promoted to GA in this release. ([#94641](https://github.com/kubernetes/kubernetes/pull/94641), [@krmayankk](https://github.com/krmayankk)) [SIG Auth and Node]
- The `ServiceAccountIssuerDiscovery` feature has graduated to GA, and is unconditionally enabled. The `ServiceAccountIssuerDiscovery` feature-gate will be removed in 1.22. ([#98553](https://github.com/kubernetes/kubernetes/pull/98553), [@mtaufen](https://github.com/mtaufen)) [SIG API Machinery, Auth and Testing]
- The `TTLAfterFinished` feature flag is now beta and enabled by default ([#98678](https://github.com/kubernetes/kubernetes/pull/98678), [@ahg-g](https://github.com/ahg-g))
- The apimachinery util/net function used to detect the bind address `ResolveBindAddress()` takes into consideration global IP addresses on loopback interfaces when 1) the host has default routes, or 2) there are no global IPs on those interfaces in order to support more complex network scenarios like BGP Unnumbered RFC 5549 ([#95790](https://github.com/kubernetes/kubernetes/pull/95790), [@aojea](https://github.com/aojea)) [SIG Network]
- The feature gate `RootCAConfigMap` graduated to GA in v1.21 and therefore will be unconditionally enabled. This flag will be removed in v1.22 release. ([#98033](https://github.com/kubernetes/kubernetes/pull/98033), [@zshihang](https://github.com/zshihang))
- The pause image upgraded to `v3.4.1` in kubelet and kubeadm for both Linux and Windows. ([#98205](https://github.com/kubernetes/kubernetes/pull/98205), [@pacoxu](https://github.com/pacoxu))
- Update pause container to run as pseudo user and group `65535:65535`. This implies the release of version 3.5 of the container images. ([#97963](https://github.com/kubernetes/kubernetes/pull/97963), [@saschagrunert](https://github.com/saschagrunert)) [SIG CLI, Cloud Provider, Cluster Lifecycle, Node, Release, Security and Testing]
- Update the latest validated version of Docker to 20.10 ([#98977](https://github.com/kubernetes/kubernetes/pull/98977), [@neolit123](https://github.com/neolit123)) [SIG CLI, Cluster Lifecycle and Node]
- Upgrade node local dns to 1.17.0 for better IPv6 support ([#99749](https://github.com/kubernetes/kubernetes/pull/99749), [@pacoxu](https://github.com/pacoxu)) [SIG Cloud Provider and Network]
- Upgrades `IPv6Dualstack` to `Beta` and turns it on by default. New clusters or existing clusters are not be affected until an actor starts adding secondary Pods and service CIDRS CLI flags as described here: [IPv4/IPv6 Dual-stack](https://github.com/kubernetes/enhancements/tree/master/keps/sig-network/563-dual-stack) ([#98969](https://github.com/kubernetes/kubernetes/pull/98969), [@khenidak](https://github.com/khenidak))
- Users might specify the `kubectl.kubernetes.io/default-container` annotation in a Pod to preselect container for kubectl commands. ([#99581](https://github.com/kubernetes/kubernetes/pull/99581), [@mengjiao-liu](https://github.com/mengjiao-liu)) [SIG CLI]
- When downscaling ReplicaSets, ready and creation timestamps are compared in a logarithmic scale. ([#99212](https://github.com/kubernetes/kubernetes/pull/99212), [@damemi](https://github.com/damemi)) [SIG Apps and Testing]
- When the kubelet is watching a ConfigMap or Secret purely in the context of setting environment variables
  for containers, only hold that watch for a defined duration before cancelling it. This change reduces the CPU
  and memory usage of the kube-apiserver in large clusters. ([#99393](https://github.com/kubernetes/kubernetes/pull/99393), [@chenyw1990](https://github.com/chenyw1990)) [SIG API Machinery, Node and Testing]
- WindowsEndpointSliceProxying feature gate has graduated to beta and is enabled by default. This means kube-proxy will  read from EndpointSlices instead of Endpoints on Windows by default. ([#99794](https://github.com/kubernetes/kubernetes/pull/99794), [@robscott](https://github.com/robscott)) [SIG Network]
- `kubectl wait` ensures that observedGeneration >= generation to prevent stale state reporting. An example scenario can be found on CRD updates. ([#97408](https://github.com/kubernetes/kubernetes/pull/97408), [@KnicKnic](https://github.com/KnicKnic))

### Documentation

- Azure file migration graduates to beta, with CSIMigrationAzureFile flag off by default
  as it requires installation of AzureFile CSI Driver. Users should enable CSIMigration and
  CSIMigrationAzureFile features and install the [AzureFile CSI Driver](https://github.com/kubernetes-sigs/azurefile-csi-driver)
  to avoid disruption to existing Pod and PVC objects at that time. Azure File CSI driver does not support using same persistent
  volume with different fsgroups. When CSI migration is enabled for azurefile driver, such case is not supported.
  (there is a case we support where volume is mounted with 0777 and then it readable/writable by everyone) ([#96293](https://github.com/kubernetes/kubernetes/pull/96293), [@andyzhangx](https://github.com/andyzhangx))
- Official support to build kubernetes with docker-machine / remote docker is removed. This change does not affect building kubernetes with docker locally. ([#97935](https://github.com/kubernetes/kubernetes/pull/97935), [@adeniyistephen](https://github.com/adeniyistephen)) [SIG Release and Testing]
- Set kubelet option `--volume-stats-agg-period` to negative value to disable volume calculations. ([#96675](https://github.com/kubernetes/kubernetes/pull/96675), [@pacoxu](https://github.com/pacoxu)) [SIG Node]

### Failing Test

- Escape the special characters like `[`, `]` and ` ` that exist in vsphere windows path ([#98830](https://github.com/kubernetes/kubernetes/pull/98830), [@liyanhui1228](https://github.com/liyanhui1228)) [SIG Storage and Windows]
- Kube-proxy: fix a bug on UDP `NodePort` Services where stale connection tracking entries may blackhole the traffic directed to the `NodePort` ([#98305](https://github.com/kubernetes/kubernetes/pull/98305), [@aojea](https://github.com/aojea))
- Kubelet: fixes a bug in the HostPort dockershim implementation that caused the conformance test "HostPort validates that there is no conflict between pods with same hostPort but different hostIP and protocol" to fail. ([#98755](https://github.com/kubernetes/kubernetes/pull/98755), [@aojea](https://github.com/aojea)) [SIG Cloud Provider, Network and Node]

### Bug or Regression

- AcceleratorStats will be available in the Summary API of kubelet when cri_stats_provider is used. ([#96873](https://github.com/kubernetes/kubernetes/pull/96873), [@ruiwen-zhao](https://github.com/ruiwen-zhao)) [SIG Node]
- All data is no longer automatically deleted when a failure is detected during creation of the volume data file on a CSI volume. Now only the data file and volume path is removed. ([#96021](https://github.com/kubernetes/kubernetes/pull/96021), [@huffmanca](https://github.com/huffmanca))
- Clean ReplicaSet by revision instead of creation timestamp in deployment controller ([#97407](https://github.com/kubernetes/kubernetes/pull/97407), [@waynepeking348](https://github.com/waynepeking348)) [SIG Apps]
- Cleanup subnet in frontend IP configs to prevent huge subnet request bodies in some scenarios. ([#98133](https://github.com/kubernetes/kubernetes/pull/98133), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]
- Client-go exec credential plugins will pass stdin only when interactive terminal is detected on stdin. This fixes a bug where previously it was checking if **stdout** is an interactive terminal. ([#99654](https://github.com/kubernetes/kubernetes/pull/99654), [@ankeesler](https://github.com/ankeesler))
- Cloud-controller-manager: routes controller should not depend on --allocate-node-cidrs ([#97029](https://github.com/kubernetes/kubernetes/pull/97029), [@andrewsykim](https://github.com/andrewsykim)) [SIG Cloud Provider and Testing]
- Cluster Autoscaler version bump to v1.20.0 ([#97011](https://github.com/kubernetes/kubernetes/pull/97011), [@towca](https://github.com/towca))
- Creating a PVC with DataSource should fail for non-CSI plugins. ([#97086](https://github.com/kubernetes/kubernetes/pull/97086), [@xing-yang](https://github.com/xing-yang)) [SIG Apps and Storage]
- EndpointSlice controller is now less likely to emit FailedToUpdateEndpointSlices events. ([#99345](https://github.com/kubernetes/kubernetes/pull/99345), [@robscott](https://github.com/robscott)) [SIG Apps and Network]
- EndpointSlice controllers are less likely to create duplicate EndpointSlices. ([#100103](https://github.com/kubernetes/kubernetes/pull/100103), [@robscott](https://github.com/robscott)) [SIG Apps and Network]
- EndpointSliceMirroring controller is now less likely to emit FailedToUpdateEndpointSlices events. ([#99756](https://github.com/kubernetes/kubernetes/pull/99756), [@robscott](https://github.com/robscott)) [SIG Apps and Network]
- Ensure all vSphere nodes are are tracked by volume attach-detach controller ([#96689](https://github.com/kubernetes/kubernetes/pull/96689), [@gnufied](https://github.com/gnufied))
- Ensure empty string annotations are copied over in rollbacks. ([#94858](https://github.com/kubernetes/kubernetes/pull/94858), [@waynepeking348](https://github.com/waynepeking348))
- Ensure only one LoadBalancer rule is created when HA mode is enabled ([#99825](https://github.com/kubernetes/kubernetes/pull/99825), [@feiskyer](https://github.com/feiskyer)) [SIG Cloud Provider]
- Ensure that client-go's EventBroadcaster is safe (non-racy) during shutdown. ([#95664](https://github.com/kubernetes/kubernetes/pull/95664), [@DirectXMan12](https://github.com/DirectXMan12)) [SIG API Machinery]
- Explicitly pass `KUBE_BUILD_CONFORMANCE=y` in `package-tarballs` to reenable building the conformance tarballs. ([#100571](https://github.com/kubernetes/kubernetes/pull/100571), [@puerco](https://github.com/puerco))
- Fix Azure file migration e2e test failure when CSIMigration is turned on. ([#97877](https://github.com/kubernetes/kubernetes/pull/97877), [@andyzhangx](https://github.com/andyzhangx))
- Fix CSI-migrated inline EBS volumes failing to mount if their volumeID is prefixed by aws:// ([#96821](https://github.com/kubernetes/kubernetes/pull/96821), [@wongma7](https://github.com/wongma7)) [SIG Storage]
- Fix CVE-2020-8555 for Gluster client connections. ([#97922](https://github.com/kubernetes/kubernetes/pull/97922), [@liggitt](https://github.com/liggitt)) [SIG Storage]
- Fix NPE in ephemeral storage eviction ([#98261](https://github.com/kubernetes/kubernetes/pull/98261), [@wzshiming](https://github.com/wzshiming)) [SIG Node]
- Fix PermissionDenied issue on SMB mount for Windows ([#99550](https://github.com/kubernetes/kubernetes/pull/99550), [@andyzhangx](https://github.com/andyzhangx))
- Fix bug that would let the Horizontal Pod Autoscaler scale down despite at least one metric being unavailable/invalid ([#99514](https://github.com/kubernetes/kubernetes/pull/99514), [@mikkeloscar](https://github.com/mikkeloscar)) [SIG Apps and Autoscaling]
- Fix cgroup handling for systemd with cgroup v2 ([#98365](https://github.com/kubernetes/kubernetes/pull/98365), [@odinuge](https://github.com/odinuge)) [SIG Node]
- Fix counting error in service/nodeport/loadbalancer quota check ([#97451](https://github.com/kubernetes/kubernetes/pull/97451), [@pacoxu](https://github.com/pacoxu)) [SIG API Machinery, Network and Testing]
- Fix errors when accessing Windows container stats for Dockershim ([#98510](https://github.com/kubernetes/kubernetes/pull/98510), [@jsturtevant](https://github.com/jsturtevant)) [SIG Node and Windows]
- Fix kube-proxy container image architecture for non amd64 images. ([#98526](https://github.com/kubernetes/kubernetes/pull/98526), [@saschagrunert](https://github.com/saschagrunert))
- Fix missing cadvisor machine metrics. ([#97006](https://github.com/kubernetes/kubernetes/pull/97006), [@lingsamuel](https://github.com/lingsamuel)) [SIG Node]
- Fix nil VMSS name when setting service to auto mode ([#97366](https://github.com/kubernetes/kubernetes/pull/97366), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]
- Fix privileged config of Pod Sandbox which was previously ignored. ([#96877](https://github.com/kubernetes/kubernetes/pull/96877), [@xeniumlee](https://github.com/xeniumlee))
- Fix the panic when kubelet registers if a node object already exists with no Status.Capacity or Status.Allocatable ([#95269](https://github.com/kubernetes/kubernetes/pull/95269), [@SataQiu](https://github.com/SataQiu)) [SIG Node]
- Fix the regression with the slow pods termination. Before this fix pods may take an additional time to terminate - up to one minute. Reversing the change that ensured that CNI resources cleaned up when the pod is removed on API server. ([#97980](https://github.com/kubernetes/kubernetes/pull/97980), [@SergeyKanzhelev](https://github.com/SergeyKanzhelev)) [SIG Node]
- Fix to recover CSI volumes from certain dangling attachments ([#96617](https://github.com/kubernetes/kubernetes/pull/96617), [@yuga711](https://github.com/yuga711)) [SIG Apps and Storage]
- Fix: azure file latency issue for metadata-heavy workloads ([#97082](https://github.com/kubernetes/kubernetes/pull/97082), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider and Storage]
- Fixed Cinder volume IDs on OpenStack Train ([#96673](https://github.com/kubernetes/kubernetes/pull/96673), [@jsafrane](https://github.com/jsafrane)) [SIG Cloud Provider]
- Fixed FibreChannel volume plugin corrupting filesystems on detach of multipath volumes. ([#97013](https://github.com/kubernetes/kubernetes/pull/97013), [@jsafrane](https://github.com/jsafrane)) [SIG Storage]
- Fixed a bug in kubelet that will saturate CPU utilization after containerd got restarted. ([#97174](https://github.com/kubernetes/kubernetes/pull/97174), [@hanlins](https://github.com/hanlins)) [SIG Node]
- Fixed a bug that causes smaller number of conntrack-max being used under CPU static policy. (#99225, @xh4n3) ([#99613](https://github.com/kubernetes/kubernetes/pull/99613), [@xh4n3](https://github.com/xh4n3)) [SIG Network]
- Fixed a bug that on k8s nodes, when the policy of INPUT chain in filter table is not ACCEPT, healthcheck nodeport would not work.
  Added iptables rules to allow healthcheck nodeport traffic. ([#97824](https://github.com/kubernetes/kubernetes/pull/97824), [@hanlins](https://github.com/hanlins)) [SIG Network]
- Fixed a bug that the kubelet cannot start on BtrfS. ([#98042](https://github.com/kubernetes/kubernetes/pull/98042), [@gjkim42](https://github.com/gjkim42)) [SIG Node]
- Fixed a race condition on API server startup ensuring previously created webhook configurations are effective before the first write request is admitted. ([#95783](https://github.com/kubernetes/kubernetes/pull/95783), [@roycaihw](https://github.com/roycaihw)) [SIG API Machinery]
- Fixed an issue with garbage collection failing to clean up namespaced children of an object also referenced incorrectly by cluster-scoped children ([#98068](https://github.com/kubernetes/kubernetes/pull/98068), [@liggitt](https://github.com/liggitt)) [SIG API Machinery and Apps]
- Fixed authentication_duration_seconds metric scope. Previously, it included whole apiserver request duration which yields inaccurate results. ([#99944](https://github.com/kubernetes/kubernetes/pull/99944), [@marseel](https://github.com/marseel))
- Fixed bug in CPUManager with race on container map access ([#97427](https://github.com/kubernetes/kubernetes/pull/97427), [@klueska](https://github.com/klueska)) [SIG Node]
- Fixed bug that caused cAdvisor to incorrectly detect single-socket multi-NUMA topology. ([#99315](https://github.com/kubernetes/kubernetes/pull/99315), [@iwankgb](https://github.com/iwankgb)) [SIG Node]
- Fixed cleanup of block devices when /var/lib/kubelet is a symlink. ([#96889](https://github.com/kubernetes/kubernetes/pull/96889), [@jsafrane](https://github.com/jsafrane)) [SIG Storage]
- Fixed no effect namespace when exposing deployment with --dry-run=client. ([#97492](https://github.com/kubernetes/kubernetes/pull/97492), [@masap](https://github.com/masap)) [SIG CLI]
- Fixed provisioning of Cinder volumes migrated to CSI when StorageClass with AllowedTopologies was used. ([#98311](https://github.com/kubernetes/kubernetes/pull/98311), [@jsafrane](https://github.com/jsafrane)) [SIG Storage]
- Fixes a bug of identifying the correct containerd process. ([#97888](https://github.com/kubernetes/kubernetes/pull/97888), [@pacoxu](https://github.com/pacoxu))
- Fixes add-on manager leader election to use leases instead of endpoints, similar to what kube-controller-manager does in 1.20 ([#98968](https://github.com/kubernetes/kubernetes/pull/98968), [@liggitt](https://github.com/liggitt))
- Fixes connection errors when using `--volume-host-cidr-denylist` or `--volume-host-allow-local-loopback` ([#98436](https://github.com/kubernetes/kubernetes/pull/98436), [@liggitt](https://github.com/liggitt)) [SIG Network and Storage]
- Fixes problem where invalid selector on `PodDisruptionBudget` leads to a nil pointer dereference that causes the Controller manager to crash loop. ([#98750](https://github.com/kubernetes/kubernetes/pull/98750), [@mortent](https://github.com/mortent))
- Fixes spurious errors about IPv6 in `kube-proxy` logs on nodes with IPv6 disabled. ([#99127](https://github.com/kubernetes/kubernetes/pull/99127), [@danwinship](https://github.com/danwinship))
- Fixing a bug where a failed node may not have the NoExecute taint set correctly ([#96876](https://github.com/kubernetes/kubernetes/pull/96876), [@howieyuen](https://github.com/howieyuen)) [SIG Apps and Node]
- GCE Internal LoadBalancer sync loop will now release the ILB IP address upon sync failure. An error in ILB forwarding rule creation will no longer leak IP addresses. ([#97740](https://github.com/kubernetes/kubernetes/pull/97740), [@prameshj](https://github.com/prameshj)) [SIG Cloud Provider and Network]
- Ignore update pod with no new images in alwaysPullImages admission controller ([#96668](https://github.com/kubernetes/kubernetes/pull/96668), [@pacoxu](https://github.com/pacoxu)) [SIG Apps, Auth and Node]
- Improve speed of vSphere PV provisioning and reduce number of API calls ([#100054](https://github.com/kubernetes/kubernetes/pull/100054), [@gnufied](https://github.com/gnufied)) [SIG Cloud Provider and Storage]
- KUBECTL_EXTERNAL_DIFF now accepts equal sign for additional parameters. ([#98158](https://github.com/kubernetes/kubernetes/pull/98158), [@dougsland](https://github.com/dougsland)) [SIG CLI]
- Kube-apiserver: an update of a pod with a generic ephemeral volume dropped that volume if the feature had been disabled since creating the pod with such a volume ([#99446](https://github.com/kubernetes/kubernetes/pull/99446), [@pohly](https://github.com/pohly)) [SIG Apps, Node and Storage]
- Kube-proxy: remove deprecated --cleanup-ipvs flag of kube-proxy, and make --cleanup flag always to flush IPVS ([#97336](https://github.com/kubernetes/kubernetes/pull/97336), [@maaoBit](https://github.com/maaoBit)) [SIG Network]
- Kubeadm installs etcd v3.4.13 when creating cluster v1.19 ([#97244](https://github.com/kubernetes/kubernetes/pull/97244), [@pacoxu](https://github.com/pacoxu))
- Kubeadm: Fixes a kubeadm upgrade bug that could cause a custom CoreDNS configuration to be replaced with the default. ([#97016](https://github.com/kubernetes/kubernetes/pull/97016), [@rajansandeep](https://github.com/rajansandeep)) [SIG Cluster Lifecycle]
- Kubeadm: Some text in the `kubeadm upgrade plan` output has changed. If you have scripts or other automation that parses this output, please review these changes and update your scripts to account for the new output. ([#98728](https://github.com/kubernetes/kubernetes/pull/98728), [@stmcginnis](https://github.com/stmcginnis)) [SIG Cluster Lifecycle]
- Kubeadm: fix a bug in the host memory detection code on 32bit Linux platforms ([#97403](https://github.com/kubernetes/kubernetes/pull/97403), [@abelbarrera15](https://github.com/abelbarrera15)) [SIG Cluster Lifecycle]
- Kubeadm: fix a bug where "kubeadm join" would not properly handle missing names for existing etcd members. ([#97372](https://github.com/kubernetes/kubernetes/pull/97372), [@ihgann](https://github.com/ihgann)) [SIG Cluster Lifecycle]
- Kubeadm: fix a bug where "kubeadm upgrade" commands can fail if CoreDNS v1.8.0 is installed. ([#97919](https://github.com/kubernetes/kubernetes/pull/97919), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Kubeadm: fix a bug where external credentials in an existing admin.conf prevented the CA certificate to be written in the cluster-info ConfigMap. ([#98882](https://github.com/kubernetes/kubernetes/pull/98882), [@kvaps](https://github.com/kvaps)) [SIG Cluster Lifecycle]
- Kubeadm: get k8s CI version markers from k8s infra bucket ([#98836](https://github.com/kubernetes/kubernetes/pull/98836), [@hasheddan](https://github.com/hasheddan)) [SIG Cluster Lifecycle and Release]
- Kubeadm: skip validating pod subnet against node-cidr-mask when allocate-node-cidrs is set to be false ([#98984](https://github.com/kubernetes/kubernetes/pull/98984), [@SataQiu](https://github.com/SataQiu)) [SIG Cluster Lifecycle]
- Kubectl logs: `--ignore-errors` is now honored by all containers, maintaining consistency with parallelConsumeRequest behavior. ([#97686](https://github.com/kubernetes/kubernetes/pull/97686), [@wzshiming](https://github.com/wzshiming))
- Kubectl-convert: Fix `no kind "Ingress" is registered for version` error ([#97754](https://github.com/kubernetes/kubernetes/pull/97754), [@wzshiming](https://github.com/wzshiming))
- Kubectl: Fixed panic when describing an ingress backend without an API Group ([#100505](https://github.com/kubernetes/kubernetes/pull/100505), [@lauchokyip](https://github.com/lauchokyip)) [SIG CLI]
- Kubelet now cleans up orphaned volume directories automatically ([#95301](https://github.com/kubernetes/kubernetes/pull/95301), [@lorenz](https://github.com/lorenz)) [SIG Node and Storage]
- Kubelet.exe on Windows now checks that the process running as administrator and the executing user account is listed in the built-in administrators group.  This is the equivalent to checking the process is running as uid 0. ([#96616](https://github.com/kubernetes/kubernetes/pull/96616), [@perithompson](https://github.com/perithompson)) [SIG Node and Windows]
- Kubelet: Fix kubelet from panic after getting the wrong signal ([#98200](https://github.com/kubernetes/kubernetes/pull/98200), [@wzshiming](https://github.com/wzshiming)) [SIG Node]
- Kubelet: Fix repeatedly acquiring the inhibit lock ([#98088](https://github.com/kubernetes/kubernetes/pull/98088), [@wzshiming](https://github.com/wzshiming)) [SIG Node]
- Kubelet: Fixed the bug of getting the number of cpu when the number of cpu logical processors is more than 64 in windows ([#97378](https://github.com/kubernetes/kubernetes/pull/97378), [@hwdef](https://github.com/hwdef)) [SIG Node and Windows]
- Limits lease to have 1000 maximum attached objects. ([#98257](https://github.com/kubernetes/kubernetes/pull/98257), [@lingsamuel](https://github.com/lingsamuel))
- Mitigate CVE-2020-8555 for kube-up using GCE by preventing local loopback folume hosts. ([#97934](https://github.com/kubernetes/kubernetes/pull/97934), [@mattcary](https://github.com/mattcary)) [SIG Cloud Provider and Storage]
- On single-stack configured (IPv4 or IPv6, but not both) clusters, Services which are both headless (no clusterIP) and selectorless (empty or undefined selector) will report `ipFamilyPolicy RequireDualStack` and will have entries in `ipFamilies[]` for both IPv4 and IPv6.  This is a change from alpha, but does not have any impact on the manually-specified Endpoints and EndpointSlices for the Service. ([#99555](https://github.com/kubernetes/kubernetes/pull/99555), [@thockin](https://github.com/thockin)) [SIG Apps and Network]
- Performance regression #97685 has been fixed. ([#97860](https://github.com/kubernetes/kubernetes/pull/97860), [@MikeSpreitzer](https://github.com/MikeSpreitzer)) [SIG API Machinery]
- Pod Log stats for windows now reports metrics ([#99221](https://github.com/kubernetes/kubernetes/pull/99221), [@jsturtevant](https://github.com/jsturtevant)) [SIG Node, Storage, Testing and Windows]
- Pod status updates faster when reacting on probe results. The first readiness probe will be called faster when startup probes succeeded, which will make Pod status as ready faster. ([#98376](https://github.com/kubernetes/kubernetes/pull/98376), [@matthyx](https://github.com/matthyx))
- Readjust `kubelet_containers_per_pod_count` buckets to only show metrics greater than 1. ([#98169](https://github.com/kubernetes/kubernetes/pull/98169), [@wawa0210](https://github.com/wawa0210))
- Remove CSI topology from migrated in-tree gcepd volume. ([#97823](https://github.com/kubernetes/kubernetes/pull/97823), [@Jiawei0227](https://github.com/Jiawei0227)) [SIG Cloud Provider and Storage]
- Requests with invalid timeout parameters in the request URL now appear in the audit log correctly. ([#96901](https://github.com/kubernetes/kubernetes/pull/96901), [@tkashem](https://github.com/tkashem)) [SIG API Machinery and Testing]
- Resolve a "concurrent map read and map write" crashing error in the kubelet ([#95111](https://github.com/kubernetes/kubernetes/pull/95111), [@choury](https://github.com/choury)) [SIG Node]
- Resolves spurious `Failed to list *v1.Secret` or `Failed to list *v1.ConfigMap` messages in kubelet logs. ([#99538](https://github.com/kubernetes/kubernetes/pull/99538), [@liggitt](https://github.com/liggitt)) [SIG Auth and Node]
- ResourceQuota of an entity now inclusively calculate Pod overhead ([#99600](https://github.com/kubernetes/kubernetes/pull/99600), [@gjkim42](https://github.com/gjkim42))
- Return zero time (midnight on Jan. 1, 1970) instead of negative number when reporting startedAt and finishedAt of the not started or a running Pod when using `dockershim` as a runtime. ([#99585](https://github.com/kubernetes/kubernetes/pull/99585), [@Iceber](https://github.com/Iceber))
- Reverts breaking change to inline AzureFile volumes; referenced secrets are now searched for in the same namespace as the pod as in previous releases. ([#100563](https://github.com/kubernetes/kubernetes/pull/100563), [@msau42](https://github.com/msau42))
- Scores from InterPodAffinity have stronger differentiation. ([#98096](https://github.com/kubernetes/kubernetes/pull/98096), [@leileiwan](https://github.com/leileiwan)) [SIG Scheduling]
- Specifying the KUBE_TEST_REPO environment variable when e2e tests are executed will instruct the test infrastructure to load that image from a location within the specified repo, using a predefined pattern. ([#93510](https://github.com/kubernetes/kubernetes/pull/93510), [@smarterclayton](https://github.com/smarterclayton)) [SIG Testing]
- Static pods will be deleted gracefully. ([#98103](https://github.com/kubernetes/kubernetes/pull/98103), [@gjkim42](https://github.com/gjkim42)) [SIG Node]
- Sync node status during kubelet node shutdown.
  Adds an pod admission handler that rejects new pods when the node is in progress of shutting down. ([#98005](https://github.com/kubernetes/kubernetes/pull/98005), [@wzshiming](https://github.com/wzshiming)) [SIG Node]
- The calculation of pod UIDs for static pods has changed to ensure each static pod gets a unique value - this will cause all static pod containers to be recreated/restarted if an in-place kubelet upgrade from 1.20 to 1.21 is performed. Note that draining pods before upgrading the kubelet across minor versions is the supported upgrade path. ([#87461](https://github.com/kubernetes/kubernetes/pull/87461), [@bboreham](https://github.com/bboreham)) [SIG Node]
- The maximum number of ports allowed in EndpointSlices has been increased from 100 to 20,000 ([#99795](https://github.com/kubernetes/kubernetes/pull/99795), [@robscott](https://github.com/robscott)) [SIG Network]
- Truncates a message if it hits the `NoteLengthLimit` when the scheduler records an event for the pod that indicates the pod has failed to schedule. ([#98715](https://github.com/kubernetes/kubernetes/pull/98715), [@carlory](https://github.com/carlory))
- Updated k8s.gcr.io/ingress-gce-404-server-with-metrics-amd64 to a version that serves /metrics endpoint on a non-default port. ([#97621](https://github.com/kubernetes/kubernetes/pull/97621), [@vbannai](https://github.com/vbannai)) [SIG Cloud Provider]
- Updates the commands `
   - kubectl kustomize {arg}
   - kubectl apply -k {arg}
  `to use same code as kustomize CLI [v4.0.5](https://github.com/kubernetes-sigs/kustomize/releases/tag/kustomize%2Fv4.0.5) ([#98946](https://github.com/kubernetes/kubernetes/pull/98946), [@monopole](https://github.com/monopole))
- Use force unmount for NFS volumes if regular mount fails after 1 minute timeout ([#96844](https://github.com/kubernetes/kubernetes/pull/96844), [@gnufied](https://github.com/gnufied)) [SIG Storage]
- Use network.Interface.VirtualMachine.ID to get the binded VM
  Skip standalone VM when reconciling LoadBalancer ([#97635](https://github.com/kubernetes/kubernetes/pull/97635), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]
- Using exec auth plugins with kubectl no longer results in warnings about constructing many client instances from the same exec auth config. ([#97857](https://github.com/kubernetes/kubernetes/pull/97857), [@liggitt](https://github.com/liggitt)) [SIG API Machinery and Auth]
- When a CNI plugin returns dual-stack pod IPs, kubelet will now try to respect the
  "primary IP family" of the cluster by picking a primary pod IP of the same family
  as the (primary) node IP, rather than assuming that the CNI plugin returned the IPs
  in the order the administrator wanted (since some CNI plugins don't allow
  configuring this). ([#97979](https://github.com/kubernetes/kubernetes/pull/97979), [@danwinship](https://github.com/danwinship)) [SIG Network and Node]
- When dynamically provisioning Azure File volumes for a premium account, the requested size will be set to 100GB if the request is initially lower than this value to accommodate Azure File requirements. ([#99122](https://github.com/kubernetes/kubernetes/pull/99122), [@huffmanca](https://github.com/huffmanca)) [SIG Cloud Provider and Storage]
- When using `Containerd` on Windows, the `C:\Windows\System32\drivers\etc\hosts` file will now be managed by kubelet. ([#83730](https://github.com/kubernetes/kubernetes/pull/83730), [@claudiubelu](https://github.com/claudiubelu))
- `VolumeBindingArgs` now allow `BindTimeoutSeconds` to be set as zero, while the value zero indicates no waiting for the checking of volume binding operation. ([#99835](https://github.com/kubernetes/kubernetes/pull/99835), [@chendave](https://github.com/chendave)) [SIG Scheduling and Storage]
- `kubectl exec` and `kubectl attach` now honor the `--quiet` flag which suppresses output from the local binary that could be confused by a script with the remote command output (all non-failure output is hidden). In addition, print inline with exec and attach the list of alternate containers when we default to the first spec.container. ([#99004](https://github.com/kubernetes/kubernetes/pull/99004), [@smarterclayton](https://github.com/smarterclayton)) [SIG CLI]

### Other (Cleanup or Flake)

- APIs for kubelet annotations and labels from `k8s.io/kubernetes/pkg/kubelet/apis` are now moved under `k8s.io/kubelet/pkg/apis/` ([#98931](https://github.com/kubernetes/kubernetes/pull/98931), [@michaelbeaumont](https://github.com/michaelbeaumont))
- Apiserver_request_duration_seconds is promoted to stable status. ([#99925](https://github.com/kubernetes/kubernetes/pull/99925), [@logicalhan](https://github.com/logicalhan)) [SIG API Machinery, Instrumentation and Testing]
- Bump github.com/Azure/go-autorest/autorest to v0.11.12 ([#97033](https://github.com/kubernetes/kubernetes/pull/97033), [@patrickshan](https://github.com/patrickshan)) [SIG API Machinery, CLI, Cloud Provider and Cluster Lifecycle]
- Clients required to use go1.15.8+ or go1.16+ if kube-apiserver has the goaway feature enabled to avoid unexpected data race condition. ([#98809](https://github.com/kubernetes/kubernetes/pull/98809), [@answer1991](https://github.com/answer1991))
- Delete deprecated `service.beta.kubernetes.io/azure-load-balancer-mixed-protocols` mixed procotol annotation in favor of the MixedProtocolLBService feature ([#97096](https://github.com/kubernetes/kubernetes/pull/97096), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]
- EndpointSlice generation is now incremented when labels change. ([#99750](https://github.com/kubernetes/kubernetes/pull/99750), [@robscott](https://github.com/robscott)) [SIG Network]
- Featuregate AllowInsecureBackendProxy graduates to GA and unconditionally enabled. ([#99658](https://github.com/kubernetes/kubernetes/pull/99658), [@deads2k](https://github.com/deads2k))
- Increase timeout for pod lifecycle test to reach pod status=ready ([#96691](https://github.com/kubernetes/kubernetes/pull/96691), [@hh](https://github.com/hh))
- Increased `CSINodeIDMaxLength` from 128 bytes to 192 bytes. ([#98753](https://github.com/kubernetes/kubernetes/pull/98753), [@Jiawei0227](https://github.com/Jiawei0227))
- Kube-apiserver: The OIDC authenticator no longer waits 10 seconds before attempting to fetch the metadata required to verify tokens. ([#97693](https://github.com/kubernetes/kubernetes/pull/97693), [@enj](https://github.com/enj)) [SIG API Machinery and Auth]
- Kube-proxy: Traffic from the cluster directed to ExternalIPs is always sent directly to the Service. ([#96296](https://github.com/kubernetes/kubernetes/pull/96296), [@aojea](https://github.com/aojea)) [SIG Network and Testing]
- Kubeadm: change the default image repository for CI images from 'gcr.io/kubernetes-ci-images' to 'gcr.io/k8s-staging-ci-images' ([#97087](https://github.com/kubernetes/kubernetes/pull/97087), [@SataQiu](https://github.com/SataQiu)) [SIG Cluster Lifecycle]
- Kubectl: The deprecated `kubectl alpha debug` command is removed. Use `kubectl debug` instead. ([#98111](https://github.com/kubernetes/kubernetes/pull/98111), [@pandaamanda](https://github.com/pandaamanda)) [SIG CLI]
- Kubelet command line flags related to dockershim are now showing deprecation message as they will be removed along with dockershim in future release. ([#98730](https://github.com/kubernetes/kubernetes/pull/98730), [@dims](https://github.com/dims))
- Official support to build kubernetes with docker-machine / remote docker is removed. This change does not affect building kubernetes with docker locally. ([#97618](https://github.com/kubernetes/kubernetes/pull/97618), [@jherrera123](https://github.com/jherrera123)) [SIG Release and Testing]
- Process start time on Windows now uses current process information ([#97491](https://github.com/kubernetes/kubernetes/pull/97491), [@jsturtevant](https://github.com/jsturtevant)) [SIG API Machinery, CLI, Cloud Provider, Cluster Lifecycle, Instrumentation and Windows]
- Resolves flakes in the Ingress conformance tests due to conflicts with controllers updating the Ingress object ([#98430](https://github.com/kubernetes/kubernetes/pull/98430), [@liggitt](https://github.com/liggitt)) [SIG Network and Testing]
- The `AttachVolumeLimit` feature gate (GA since v1.17) has been removed and now unconditionally enabled. ([#96539](https://github.com/kubernetes/kubernetes/pull/96539), [@ialidzhikov](https://github.com/ialidzhikov))
- The `CSINodeInfo` feature gate that is GA since v1.17 is unconditionally enabled, and can no longer be specified via the `--feature-gates` argument. ([#96561](https://github.com/kubernetes/kubernetes/pull/96561), [@ialidzhikov](https://github.com/ialidzhikov)) [SIG Apps, Auth, Scheduling, Storage and Testing]
- The `apiserver_request_total` metric is promoted to stable status and no longer has a content-type dimensions, so any alerts/charts which presume the existence of this will fail. This is however, unlikely to be the case since it was effectively an unbounded dimension in the first place. ([#99788](https://github.com/kubernetes/kubernetes/pull/99788), [@logicalhan](https://github.com/logicalhan))
- The default delegating authorization options now allow unauthenticated access to healthz, readyz, and livez.  A system:masters user connecting to an authz delegator will not perform an authz check. ([#98325](https://github.com/kubernetes/kubernetes/pull/98325), [@deads2k](https://github.com/deads2k)) [SIG API Machinery, Auth, Cloud Provider and Scheduling]
- The deprecated feature gates `CSIDriverRegistry`, `BlockVolume` and `CSIBlockVolume` are now unconditionally enabled and can no longer be specified in component invocations. ([#98021](https://github.com/kubernetes/kubernetes/pull/98021), [@gavinfish](https://github.com/gavinfish)) [SIG Storage]
- The deprecated feature gates `RotateKubeletClientCertificate`, `AttachVolumeLimit`, `VolumePVCDataSource` and `EvenPodsSpread` are now unconditionally enabled and can no longer be specified in component invocations. ([#97306](https://github.com/kubernetes/kubernetes/pull/97306), [@gavinfish](https://github.com/gavinfish)) [SIG Node, Scheduling and Storage]
- The e2e suite can be instructed not to wait for pods in kube-system to be ready or for all nodes to be ready by passing `--allowed-not-ready-nodes=-1` when invoking the e2e.test program. This allows callers to run subsets of the e2e suite in scenarios other than perfectly healthy clusters. ([#98781](https://github.com/kubernetes/kubernetes/pull/98781), [@smarterclayton](https://github.com/smarterclayton)) [SIG Testing]
- The feature gates `WindowsGMSA` and `WindowsRunAsUserName` that are GA since v1.18 are now removed. ([#96531](https://github.com/kubernetes/kubernetes/pull/96531), [@ialidzhikov](https://github.com/ialidzhikov)) [SIG Node and Windows]
- The new `-gce-zones` flag on the `e2e.test` binary instructs tests that check for information about how the cluster interacts with the cloud to limit their queries to the provided zone list. If not specified, the current behavior of asking the cloud provider for all available zones in multi zone clusters is preserved. ([#98787](https://github.com/kubernetes/kubernetes/pull/98787), [@smarterclayton](https://github.com/smarterclayton)) [SIG API Machinery, Cluster Lifecycle and Testing]
- Update cri-tools to [v1.20.0](https://github.com/kubernetes-sigs/cri-tools/releases/tag/v1.20.0) ([#97967](https://github.com/kubernetes/kubernetes/pull/97967), [@rajibmitra](https://github.com/rajibmitra)) [SIG Cloud Provider]
- Windows nodes on GCE will take longer to start due to dependencies installed at node creation time. ([#98284](https://github.com/kubernetes/kubernetes/pull/98284), [@pjh](https://github.com/pjh)) [SIG Cloud Provider]
- `apiserver_storage_objects` (a newer version of `etcd_object_counts`) is promoted and marked as stable. ([#100082](https://github.com/kubernetes/kubernetes/pull/100082), [@logicalhan](https://github.com/logicalhan))

### Uncategorized

- GCE L4 Loadbalancers now handle > 5 ports in service spec correctly. ([#99595](https://github.com/kubernetes/kubernetes/pull/99595), [@prameshj](https://github.com/prameshj)) [SIG Cloud Provider]
- The DownwardAPIHugePages feature is beta.  Users may use the feature if all workers in their cluster are min 1.20 version.  The feature will be enabled by default in all installations in 1.22. ([#99610](https://github.com/kubernetes/kubernetes/pull/99610), [@derekwaynecarr](https://github.com/derekwaynecarr)) [SIG Node]

## Dependencies

### Added
- github.com/go-errors/errors: [v1.0.1](https://github.com/go-errors/errors/tree/v1.0.1)
- github.com/gobuffalo/here: [v0.6.0](https://github.com/gobuffalo/here/tree/v0.6.0)
- github.com/google/shlex: [e7afc7f](https://github.com/google/shlex/tree/e7afc7f)
- github.com/markbates/pkger: [v0.17.1](https://github.com/markbates/pkger/tree/v0.17.1)
- github.com/moby/spdystream: [v0.2.0](https://github.com/moby/spdystream/tree/v0.2.0)
- github.com/monochromegane/go-gitignore: [205db1a](https://github.com/monochromegane/go-gitignore/tree/205db1a)
- github.com/niemeyer/pretty: [a10e7ca](https://github.com/niemeyer/pretty/tree/a10e7ca)
- github.com/xlab/treeprint: [a009c39](https://github.com/xlab/treeprint/tree/a009c39)
- go.starlark.net: 8dd3e2e
- golang.org/x/term: 6a3ed07
- sigs.k8s.io/kustomize/api: v0.8.5
- sigs.k8s.io/kustomize/cmd/config: v0.9.7
- sigs.k8s.io/kustomize/kustomize/v4: v4.0.5
- sigs.k8s.io/kustomize/kyaml: v0.10.15

### Changed
- dmitri.shuralyov.com/gpu/mtl: 666a987 → 28db891
- github.com/Azure/go-autorest/autorest: [v0.11.1 → v0.11.12](https://github.com/Azure/go-autorest/autorest/compare/v0.11.1...v0.11.12)
- github.com/NYTimes/gziphandler: [56545f4 → v1.1.1](https://github.com/NYTimes/gziphandler/compare/56545f4...v1.1.1)
- github.com/cilium/ebpf: [1c8d4c9 → v0.2.0](https://github.com/cilium/ebpf/compare/1c8d4c9...v0.2.0)
- github.com/container-storage-interface/spec: [v1.2.0 → v1.3.0](https://github.com/container-storage-interface/spec/compare/v1.2.0...v1.3.0)
- github.com/containerd/console: [v1.0.0 → v1.0.1](https://github.com/containerd/console/compare/v1.0.0...v1.0.1)
- github.com/containerd/containerd: [v1.4.1 → v1.4.4](https://github.com/containerd/containerd/compare/v1.4.1...v1.4.4)
- github.com/coredns/corefile-migration: [v1.0.10 → v1.0.11](https://github.com/coredns/corefile-migration/compare/v1.0.10...v1.0.11)
- github.com/creack/pty: [v1.1.7 → v1.1.11](https://github.com/creack/pty/compare/v1.1.7...v1.1.11)
- github.com/docker/docker: [bd33bbf → v20.10.2+incompatible](https://github.com/docker/docker/compare/bd33bbf...v20.10.2)
- github.com/go-logr/logr: [v0.2.0 → v0.4.0](https://github.com/go-logr/logr/compare/v0.2.0...v0.4.0)
- github.com/go-openapi/spec: [v0.19.3 → v0.19.5](https://github.com/go-openapi/spec/compare/v0.19.3...v0.19.5)
- github.com/go-openapi/strfmt: [v0.19.3 → v0.19.5](https://github.com/go-openapi/strfmt/compare/v0.19.3...v0.19.5)
- github.com/go-openapi/validate: [v0.19.5 → v0.19.8](https://github.com/go-openapi/validate/compare/v0.19.5...v0.19.8)
- github.com/gogo/protobuf: [v1.3.1 → v1.3.2](https://github.com/gogo/protobuf/compare/v1.3.1...v1.3.2)
- github.com/golang/mock: [v1.4.1 → v1.4.4](https://github.com/golang/mock/compare/v1.4.1...v1.4.4)
- github.com/google/cadvisor: [v0.38.5 → v0.39.0](https://github.com/google/cadvisor/compare/v0.38.5...v0.39.0)
- github.com/heketi/heketi: [c2e2a4a → v10.2.0+incompatible](https://github.com/heketi/heketi/compare/c2e2a4a...v10.2.0)
- github.com/kisielk/errcheck: [v1.2.0 → v1.5.0](https://github.com/kisielk/errcheck/compare/v1.2.0...v1.5.0)
- github.com/konsorten/go-windows-terminal-sequences: [v1.0.3 → v1.0.2](https://github.com/konsorten/go-windows-terminal-sequences/compare/v1.0.3...v1.0.2)
- github.com/kr/text: [v0.1.0 → v0.2.0](https://github.com/kr/text/compare/v0.1.0...v0.2.0)
- github.com/mattn/go-runewidth: [v0.0.2 → v0.0.7](https://github.com/mattn/go-runewidth/compare/v0.0.2...v0.0.7)
- github.com/miekg/dns: [v1.1.4 → v1.1.35](https://github.com/miekg/dns/compare/v1.1.4...v1.1.35)
- github.com/moby/sys/mountinfo: [v0.1.3 → v0.4.0](https://github.com/moby/sys/mountinfo/compare/v0.1.3...v0.4.0)
- github.com/moby/term: [672ec06 → df9cb8a](https://github.com/moby/term/compare/672ec06...df9cb8a)
- github.com/mrunalp/fileutils: [abd8a0e → v0.5.0](https://github.com/mrunalp/fileutils/compare/abd8a0e...v0.5.0)
- github.com/olekukonko/tablewriter: [a0225b3 → v0.0.4](https://github.com/olekukonko/tablewriter/compare/a0225b3...v0.0.4)
- github.com/opencontainers/runc: [v1.0.0-rc92 → v1.0.0-rc93](https://github.com/opencontainers/runc/compare/v1.0.0-rc92...v1.0.0-rc93)
- github.com/opencontainers/runtime-spec: [4d89ac9 → e6143ca](https://github.com/opencontainers/runtime-spec/compare/4d89ac9...e6143ca)
- github.com/opencontainers/selinux: [v1.6.0 → v1.8.0](https://github.com/opencontainers/selinux/compare/v1.6.0...v1.8.0)
- github.com/sergi/go-diff: [v1.0.0 → v1.1.0](https://github.com/sergi/go-diff/compare/v1.0.0...v1.1.0)
- github.com/sirupsen/logrus: [v1.6.0 → v1.7.0](https://github.com/sirupsen/logrus/compare/v1.6.0...v1.7.0)
- github.com/syndtr/gocapability: [d983527 → 42c35b4](https://github.com/syndtr/gocapability/compare/d983527...42c35b4)
- github.com/willf/bitset: [d5bec33 → v1.1.11](https://github.com/willf/bitset/compare/d5bec33...v1.1.11)
- github.com/yuin/goldmark: [v1.1.27 → v1.2.1](https://github.com/yuin/goldmark/compare/v1.1.27...v1.2.1)
- golang.org/x/crypto: 7f63de1 → 5ea612d
- golang.org/x/exp: 6cc2880 → 85be41e
- golang.org/x/mobile: d2bd2a2 → e6ae53a
- golang.org/x/mod: v0.3.0 → ce943fd
- golang.org/x/net: 69a7880 → 3d97a24
- golang.org/x/sync: cd5d95a → 67f06af
- golang.org/x/sys: 5cba982 → a50acf3
- golang.org/x/time: 3af7569 → f8bda1e
- golang.org/x/tools: c1934b7 → v0.1.0
- gopkg.in/check.v1: 41f04d3 → 8fa4692
- gopkg.in/yaml.v2: v2.2.8 → v2.4.0
- gotest.tools/v3: v3.0.2 → v3.0.3
- k8s.io/gengo: 83324d8 → b6c5ce2
- k8s.io/klog/v2: v2.4.0 → v2.8.0
- k8s.io/kube-openapi: d219536 → 591a79e
- k8s.io/system-validators: v1.2.0 → v1.4.0
- sigs.k8s.io/apiserver-network-proxy/konnectivity-client: v0.0.14 → v0.0.15
- sigs.k8s.io/structured-merge-diff/v4: v4.0.2 → v4.1.0

### Removed
- github.com/codegangsta/negroni: [v1.0.0](https://github.com/codegangsta/negroni/tree/v1.0.0)
- github.com/docker/spdystream: [449fdfc](https://github.com/docker/spdystream/tree/449fdfc)
- github.com/golangplus/bytes: [45c989f](https://github.com/golangplus/bytes/tree/45c989f)
- github.com/golangplus/fmt: [2a5d6d7](https://github.com/golangplus/fmt/tree/2a5d6d7)
- github.com/gorilla/context: [v1.1.1](https://github.com/gorilla/context/tree/v1.1.1)
- github.com/kr/pty: [v1.1.5](https://github.com/kr/pty/tree/v1.1.5)
- rsc.io/quote/v3: v3.1.0
- rsc.io/sampler: v1.3.0
- sigs.k8s.io/kustomize: v2.0.3+incompatible


## Dependencies

### Added
- github.com/go-errors/errors: [v1.0.1](https://github.com/go-errors/errors/tree/v1.0.1)
- github.com/gobuffalo/here: [v0.6.0](https://github.com/gobuffalo/here/tree/v0.6.0)
- github.com/google/shlex: [e7afc7f](https://github.com/google/shlex/tree/e7afc7f)
- github.com/markbates/pkger: [v0.17.1](https://github.com/markbates/pkger/tree/v0.17.1)
- github.com/moby/spdystream: [v0.2.0](https://github.com/moby/spdystream/tree/v0.2.0)
- github.com/monochromegane/go-gitignore: [205db1a](https://github.com/monochromegane/go-gitignore/tree/205db1a)
- github.com/niemeyer/pretty: [a10e7ca](https://github.com/niemeyer/pretty/tree/a10e7ca)
- github.com/xlab/treeprint: [a009c39](https://github.com/xlab/treeprint/tree/a009c39)
- go.starlark.net: 8dd3e2e
- golang.org/x/term: 6a3ed07
- sigs.k8s.io/kustomize/api: v0.8.5
- sigs.k8s.io/kustomize/cmd/config: v0.9.7
- sigs.k8s.io/kustomize/kustomize/v4: v4.0.5
- sigs.k8s.io/kustomize/kyaml: v0.10.15

### Changed
- dmitri.shuralyov.com/gpu/mtl: 666a987 → 28db891
- github.com/Azure/go-autorest/autorest: [v0.11.1 → v0.11.12](https://github.com/Azure/go-autorest/autorest/compare/v0.11.1...v0.11.12)
- github.com/NYTimes/gziphandler: [56545f4 → v1.1.1](https://github.com/NYTimes/gziphandler/compare/56545f4...v1.1.1)
- github.com/cilium/ebpf: [1c8d4c9 → v0.2.0](https://github.com/cilium/ebpf/compare/1c8d4c9...v0.2.0)
- github.com/container-storage-interface/spec: [v1.2.0 → v1.3.0](https://github.com/container-storage-interface/spec/compare/v1.2.0...v1.3.0)
- github.com/containerd/console: [v1.0.0 → v1.0.1](https://github.com/containerd/console/compare/v1.0.0...v1.0.1)
- github.com/containerd/containerd: [v1.4.1 → v1.4.4](https://github.com/containerd/containerd/compare/v1.4.1...v1.4.4)
- github.com/coredns/corefile-migration: [v1.0.10 → v1.0.11](https://github.com/coredns/corefile-migration/compare/v1.0.10...v1.0.11)
- github.com/creack/pty: [v1.1.7 → v1.1.11](https://github.com/creack/pty/compare/v1.1.7...v1.1.11)
- github.com/docker/docker: [bd33bbf → v20.10.2+incompatible](https://github.com/docker/docker/compare/bd33bbf...v20.10.2)
- github.com/go-logr/logr: [v0.2.0 → v0.4.0](https://github.com/go-logr/logr/compare/v0.2.0...v0.4.0)
- github.com/go-openapi/spec: [v0.19.3 → v0.19.5](https://github.com/go-openapi/spec/compare/v0.19.3...v0.19.5)
- github.com/go-openapi/strfmt: [v0.19.3 → v0.19.5](https://github.com/go-openapi/strfmt/compare/v0.19.3...v0.19.5)
- github.com/go-openapi/validate: [v0.19.5 → v0.19.8](https://github.com/go-openapi/validate/compare/v0.19.5...v0.19.8)
- github.com/gogo/protobuf: [v1.3.1 → v1.3.2](https://github.com/gogo/protobuf/compare/v1.3.1...v1.3.2)
- github.com/golang/mock: [v1.4.1 → v1.4.4](https://github.com/golang/mock/compare/v1.4.1...v1.4.4)
- github.com/google/cadvisor: [v0.38.5 → v0.39.0](https://github.com/google/cadvisor/compare/v0.38.5...v0.39.0)
- github.com/heketi/heketi: [c2e2a4a → v10.2.0+incompatible](https://github.com/heketi/heketi/compare/c2e2a4a...v10.2.0)
- github.com/kisielk/errcheck: [v1.2.0 → v1.5.0](https://github.com/kisielk/errcheck/compare/v1.2.0...v1.5.0)
- github.com/konsorten/go-windows-terminal-sequences: [v1.0.3 → v1.0.2](https://github.com/konsorten/go-windows-terminal-sequences/compare/v1.0.3...v1.0.2)
- github.com/kr/text: [v0.1.0 → v0.2.0](https://github.com/kr/text/compare/v0.1.0...v0.2.0)
- github.com/mattn/go-runewidth: [v0.0.2 → v0.0.7](https://github.com/mattn/go-runewidth/compare/v0.0.2...v0.0.7)
- github.com/miekg/dns: [v1.1.4 → v1.1.35](https://github.com/miekg/dns/compare/v1.1.4...v1.1.35)
- github.com/moby/sys/mountinfo: [v0.1.3 → v0.4.0](https://github.com/moby/sys/mountinfo/compare/v0.1.3...v0.4.0)
- github.com/moby/term: [672ec06 → df9cb8a](https://github.com/moby/term/compare/672ec06...df9cb8a)
- github.com/mrunalp/fileutils: [abd8a0e → v0.5.0](https://github.com/mrunalp/fileutils/compare/abd8a0e...v0.5.0)
- github.com/olekukonko/tablewriter: [a0225b3 → v0.0.4](https://github.com/olekukonko/tablewriter/compare/a0225b3...v0.0.4)
- github.com/opencontainers/runc: [v1.0.0-rc92 → v1.0.0-rc93](https://github.com/opencontainers/runc/compare/v1.0.0-rc92...v1.0.0-rc93)
- github.com/opencontainers/runtime-spec: [4d89ac9 → e6143ca](https://github.com/opencontainers/runtime-spec/compare/4d89ac9...e6143ca)
- github.com/opencontainers/selinux: [v1.6.0 → v1.8.0](https://github.com/opencontainers/selinux/compare/v1.6.0...v1.8.0)
- github.com/sergi/go-diff: [v1.0.0 → v1.1.0](https://github.com/sergi/go-diff/compare/v1.0.0...v1.1.0)
- github.com/sirupsen/logrus: [v1.6.0 → v1.7.0](https://github.com/sirupsen/logrus/compare/v1.6.0...v1.7.0)
- github.com/syndtr/gocapability: [d983527 → 42c35b4](https://github.com/syndtr/gocapability/compare/d983527...42c35b4)
- github.com/willf/bitset: [d5bec33 → v1.1.11](https://github.com/willf/bitset/compare/d5bec33...v1.1.11)
- github.com/yuin/goldmark: [v1.1.27 → v1.2.1](https://github.com/yuin/goldmark/compare/v1.1.27...v1.2.1)
- golang.org/x/crypto: 7f63de1 → 5ea612d
- golang.org/x/exp: 6cc2880 → 85be41e
- golang.org/x/mobile: d2bd2a2 → e6ae53a
- golang.org/x/mod: v0.3.0 → ce943fd
- golang.org/x/net: 69a7880 → 3d97a24
- golang.org/x/sync: cd5d95a → 67f06af
- golang.org/x/sys: 5cba982 → a50acf3
- golang.org/x/time: 3af7569 → f8bda1e
- golang.org/x/tools: c1934b7 → v0.1.0
- gopkg.in/check.v1: 41f04d3 → 8fa4692
- gopkg.in/yaml.v2: v2.2.8 → v2.4.0
- gotest.tools/v3: v3.0.2 → v3.0.3
- k8s.io/gengo: 83324d8 → b6c5ce2
- k8s.io/klog/v2: v2.4.0 → v2.8.0
- k8s.io/kube-openapi: d219536 → 591a79e
- k8s.io/system-validators: v1.2.0 → v1.4.0
- sigs.k8s.io/apiserver-network-proxy/konnectivity-client: v0.0.14 → v0.0.15
- sigs.k8s.io/structured-merge-diff/v4: v4.0.2 → v4.1.0

### Removed
- github.com/codegangsta/negroni: [v1.0.0](https://github.com/codegangsta/negroni/tree/v1.0.0)
- github.com/docker/spdystream: [449fdfc](https://github.com/docker/spdystream/tree/449fdfc)
- github.com/golangplus/bytes: [45c989f](https://github.com/golangplus/bytes/tree/45c989f)
- github.com/golangplus/fmt: [2a5d6d7](https://github.com/golangplus/fmt/tree/2a5d6d7)
- github.com/gorilla/context: [v1.1.1](https://github.com/gorilla/context/tree/v1.1.1)
- github.com/kr/pty: [v1.1.5](https://github.com/kr/pty/tree/v1.1.5)
- rsc.io/quote/v3: v3.1.0
- rsc.io/sampler: v1.3.0
- sigs.k8s.io/kustomize: v2.0.3+incompatible



# v1.21.0-rc.0


## Downloads for v1.21.0-rc.0

### Source Code

filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.21.0-rc.0/kubernetes.tar.gz) | ef53a41955d6f8a8d2a94636af98b55d633fb8a5081517559039e019b3dd65c9d10d4e7fa297ab88a7865d772f3eecf72e7b0eeba5e87accb4000c91da33e148
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.21.0-rc.0/kubernetes-src.tar.gz) | 9335a01b50d351776d3b8d00c07a5233844c51d307e361fa7e55a0620c1cb8b699e43eacf45ae9cafd8cbc44752e6987450c528a5bede8204706b7673000b5fc

### Client binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.21.0-rc.0/kubernetes-client-darwin-amd64.tar.gz) | 964135e43234cee275c452f5f06fb6d2bcd3cff3211a0d50fa35fff1cc4446bc5a0ac5125405dadcfb6596cb152afe29fabf7aad5b35b100e1288db890b70f8e
[kubernetes-client-darwin-arm64.tar.gz](https://dl.k8s.io/v1.21.0-rc.0/kubernetes-client-darwin-arm64.tar.gz) | 50d782abaa4ded5e706b3192d87effa953ceabbd7d91e3d48b0c1fa2206a1963a909c14b923560f5d09cac2c7392edc5f38a13fbf1e9a40bc94e3afe8de10622
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.21.0-rc.0/kubernetes-client-linux-386.tar.gz) | 72af5562f24184a2d7c27f95fa260470da979fbdcacce39a372f8f3add2991d7af8bc78f4e1dbe7a0f97e3f559b149b72a51491d3b13008da81872ee50f02f37
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.21.0-rc.0/kubernetes-client-linux-amd64.tar.gz) | 1eddb8f6b51e005bc6f7b519d036cbe3d2f6d97dbf7d212dd933fb56354c29f222d050519115a9bcf94555aef095db7cf763469e47bb4ae3c6c07f97edf437cb
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.21.0-rc.0/kubernetes-client-linux-arm.tar.gz) | 670f8ca60ea3cf0bb3262a772715e0ea735fccda6a92f3186299361dc455b304ae177d4017e0b67bbfa4a95e36f4cc3f7eb335e2a5130c93ac3fba2aff4519bf
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.21.0-rc.0/kubernetes-client-linux-arm64.tar.gz) | a69a47907cff138ba393d8c87044fd95d97f3ca8f35d301b50742e2801ad7c229d99d6667971091f65825eb51854d585be0dd7421670110b1aa567e67e7ab4b3
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.21.0-rc.0/kubernetes-client-linux-ppc64le.tar.gz) | b929feade94b71c81908abdcd4343b1e1e20098fd65e10d4d02585ad649d292d06f52c7ddc349efa188ce5b093e703c7aa9582c6ae5a69699adb87bbf5350243
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.21.0-rc.0/kubernetes-client-linux-s390x.tar.gz) | 899d1470e412282cf289d8e24806d1a08c62ec0151f345ae3c9e497cc7bc0feab76498de4dd897d6adcdfa0c422e6b1a37e25d928669030f53457fd69d6e7df7
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.21.0-rc.0/kubernetes-client-windows-386.tar.gz) | 9f0bc90a269eabd06fe4f637b5172a3a6a7d3de26de0d66504c2e1f2093083c584ea39031db6075a7da7a86b98c48bed25aa88d4ac09060b38692c6a5b637078
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.21.0-rc.0/kubernetes-client-windows-amd64.tar.gz) | 05c8cc10188a1294b0d51d052942742a9b26411a08ec73494bf0e728a8a167e0a7863bdfc8864e76a371b584380098381805341e18b4b283b5d0cf298d5f7c7c

### Server binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.21.0-rc.0/kubernetes-server-linux-amd64.tar.gz) | 355f278728ef7ac7eb2f5568c99c1429543c6302bbd0ed3bd0378c08116075e56ae850a49241313f078e2392702672ec6c9b70c8d97b4f2f5f4bee36828a63ba
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.21.0-rc.0/kubernetes-server-linux-arm.tar.gz) | 9ac02c2825e2fd4e92f0c0f67180c67c24e32841ccbabc82284bf6293727ffecfae65e8a42b527c2a7ca482752384928eb65c2a1706144ae7819a6b3a1ab291c
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.21.0-rc.0/kubernetes-server-linux-arm64.tar.gz) | eb412453da03c82a9248412c8ccf4d4baa1fbfa81edd8d4f81d28969b40a3727e18934accc68f643d253446c58ffd2623292402495480b3d4b2a837b5318b957
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.21.0-rc.0/kubernetes-server-linux-ppc64le.tar.gz) | 07da2812c35bbc427ee5b4a0b601c3ae271e0d50ab0dd4c5c25399f43506fa2a187642eb9d4d2085df7b90264d48ea2f31088af87d9efa7eb2e87f91e1fdbde4
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.21.0-rc.0/kubernetes-server-linux-s390x.tar.gz) | 3b79442a3d6e389c4ff105922a8e49994c0b6c088d2c501bd8c78d9f9e814902f5bb72c8f9c89380b750fda9b3a336759b9b68f11d70bef4f0e984564a95c29e

### Node binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.21.0-rc.0/kubernetes-node-linux-amd64.tar.gz) | f12edf1faf5f07de1ebc5a8626601c12927902e10aca3f11e398637382fdf55365dbd9a0ef38858553fb7569495ae2cf68f155dd2e49b85b27d76fb599bb92e4
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.21.0-rc.0/kubernetes-node-linux-arm.tar.gz) | 4fba8fc4e2102f07fb778aab597ec7231ea65c35e1aa618fe98b707b64a931237bd842c173e9120326e4d9deb983bb3917176762bba2212612bbc09d6e2105c4
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.21.0-rc.0/kubernetes-node-linux-arm64.tar.gz) | a2e1be5459a8346839970faf4e7ebdb8ab9f3273e02babf1f3199b06bdb67434a2d18fcd1628cf1b989756e99d8dad6624a455b9db11d50f51f509f4df5c27da
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.21.0-rc.0/kubernetes-node-linux-ppc64le.tar.gz) | 16d2c1cc295474fc49fe9a827ddd73e81bdd6b76af7074987b90250023f99b6d70bf474e204c7d556802111984fcb3a330740b150bdc7970d0e3634eb94a1665
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.21.0-rc.0/kubernetes-node-linux-s390x.tar.gz) | 9dc6faa6cd007b13dfce703f3e271f80adcc4e029c90a4a9b4f2f143b9756f2893f8af3d7c2cf813f2bd6731cffd87d15d4229456c1685939f65bf467820ec6e
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.21.0-rc.0/kubernetes-node-windows-amd64.tar.gz) | f8bac2974c9142bfb80cd5eadeda79f79f27b78899a4e6e71809b795c708824ba442be83fdbadb98e01c3823dd8350776358258a205e851ed045572923cacba7

## Changelog since v1.21.0-beta.1

## Urgent Upgrade Notes

### (No, really, you MUST read this before you upgrade)

 - Migrated pkg/kubelet/cm/cpuset/cpuset.go to structured logging. Exit code changed from 255 to 1. ([#100007](https://github.com/kubernetes/kubernetes/pull/100007), [@utsavoza](https://github.com/utsavoza)) [SIG Instrumentation and Node]
 
## Changes by Kind

### API Change

- Add Probe-level terminationGracePeriodSeconds field ([#99375](https://github.com/kubernetes/kubernetes/pull/99375), [@ehashman](https://github.com/ehashman)) [SIG API Machinery, Apps, Node and Testing]
- CSIServiceAccountToken is Beta now ([#99298](https://github.com/kubernetes/kubernetes/pull/99298), [@zshihang](https://github.com/zshihang)) [SIG Auth, Storage and Testing]
- Discovery.k8s.io/v1beta1 EndpointSlices are deprecated in favor of discovery.k8s.io/v1, and will no longer be served in Kubernetes v1.25. ([#100472](https://github.com/kubernetes/kubernetes/pull/100472), [@liggitt](https://github.com/liggitt)) [SIG Network]
- FieldManager no longer owns fields that get reset before the object is persisted (e.g. "status wiping"). ([#99661](https://github.com/kubernetes/kubernetes/pull/99661), [@kevindelgado](https://github.com/kevindelgado)) [SIG API Machinery, Auth and Testing]
- Generic ephemeral volumes are beta. ([#99643](https://github.com/kubernetes/kubernetes/pull/99643), [@pohly](https://github.com/pohly)) [SIG API Machinery, Apps, Auth, CLI, Node, Storage and Testing]
- Implement the GetAvailableResources in the podresources API. ([#95734](https://github.com/kubernetes/kubernetes/pull/95734), [@fromanirh](https://github.com/fromanirh)) [SIG Instrumentation, Node and Testing]
- The Endpoints controller will now set the `endpoints.kubernetes.io/over-capacity` annotation to "warning" when an Endpoints resource contains more than 1000 addresses. In a future release, the controller will truncate Endpoints that exceed this limit. The EndpointSlice API can be used to support significantly larger number of addresses. ([#99975](https://github.com/kubernetes/kubernetes/pull/99975), [@robscott](https://github.com/robscott)) [SIG Apps and Network]
- The PodDisruptionBudget API has been promoted to policy/v1 with no schema changes. The only functional change is that an empty selector (`{}`) written to a policy/v1 PodDisruptionBudget now selects all pods in the namespace. The behavior of the policy/v1beta1 API remains unchanged. The policy/v1beta1 PodDisruptionBudget API is deprecated and will no longer be served in 1.25+. ([#99290](https://github.com/kubernetes/kubernetes/pull/99290), [@mortent](https://github.com/mortent)) [SIG API Machinery, Apps, Auth, Autoscaling, CLI, Cloud Provider, Cluster Lifecycle, Instrumentation, Scheduling and Testing]
- Topology Aware Hints are now available in alpha and can be enabled with the `TopologyAwareHints` feature gate. ([#99522](https://github.com/kubernetes/kubernetes/pull/99522), [@robscott](https://github.com/robscott)) [SIG API Machinery, Apps, Auth, Instrumentation, Network and Testing]

### Feature

- Add e2e test to validate performance metrics of volume lifecycle operations ([#94334](https://github.com/kubernetes/kubernetes/pull/94334), [@RaunakShah](https://github.com/RaunakShah)) [SIG Storage and Testing]
- EmptyDir memory backed volumes are sized as the the minimum of pod allocatable memory on a host and an optional explicit user provided value. ([#100319](https://github.com/kubernetes/kubernetes/pull/100319), [@derekwaynecarr](https://github.com/derekwaynecarr)) [SIG Node]
- Enables Kubelet to check volume condition and log events to corresponding pods. ([#99284](https://github.com/kubernetes/kubernetes/pull/99284), [@fengzixu](https://github.com/fengzixu)) [SIG Apps, Instrumentation, Node and Storage]
- Introduce a churn operator to scheduler perf testing framework. ([#98900](https://github.com/kubernetes/kubernetes/pull/98900), [@Huang-Wei](https://github.com/Huang-Wei)) [SIG Scheduling and Testing]
- Kubernetes is now built with Golang 1.16.1 ([#100106](https://github.com/kubernetes/kubernetes/pull/100106), [@justaugustus](https://github.com/justaugustus)) [SIG Cloud Provider, Instrumentation, Release and Testing]
- Migrated pkg/kubelet/cm/devicemanager to structured logging ([#99976](https://github.com/kubernetes/kubernetes/pull/99976), [@knabben](https://github.com/knabben)) [SIG Instrumentation and Node]
- Migrated pkg/kubelet/cm/memorymanager to structured logging ([#99974](https://github.com/kubernetes/kubernetes/pull/99974), [@knabben](https://github.com/knabben)) [SIG Instrumentation and Node]
- Migrated pkg/kubelet/cm/topologymanager to structure logging ([#99969](https://github.com/kubernetes/kubernetes/pull/99969), [@knabben](https://github.com/knabben)) [SIG Instrumentation and Node]
- Rename metrics `etcd_object_counts` to `apiserver_storage_object_counts` and mark it as stable. The original `etcd_object_counts` metrics name is marked as "Deprecated" and will be removed in the future. ([#99785](https://github.com/kubernetes/kubernetes/pull/99785), [@erain](https://github.com/erain)) [SIG API Machinery, Instrumentation and Testing]
- Update pause container to run as pseudo user and group `65535:65535`. This implies the release of version 3.5 of the container images. ([#97963](https://github.com/kubernetes/kubernetes/pull/97963), [@saschagrunert](https://github.com/saschagrunert)) [SIG CLI, Cloud Provider, Cluster Lifecycle, Node, Release, Security and Testing]
- Users might specify the `kubectl.kubernetes.io/default-exec-container` annotation in a Pod to preselect container for kubectl commands. ([#99833](https://github.com/kubernetes/kubernetes/pull/99833), [@mengjiao-liu](https://github.com/mengjiao-liu)) [SIG CLI]

### Bug or Regression

- Add ability to skip OpenAPI handler installation to the GenericAPIServer ([#100341](https://github.com/kubernetes/kubernetes/pull/100341), [@kevindelgado](https://github.com/kevindelgado)) [SIG API Machinery]
- Count pod overhead against an entity's ResourceQuota ([#99600](https://github.com/kubernetes/kubernetes/pull/99600), [@gjkim42](https://github.com/gjkim42)) [SIG API Machinery and Node]
- EndpointSlice controllers are less likely to create duplicate EndpointSlices. ([#100103](https://github.com/kubernetes/kubernetes/pull/100103), [@robscott](https://github.com/robscott)) [SIG Apps and Network]
- Ensure only one LoadBalancer rule is created when HA mode is enabled ([#99825](https://github.com/kubernetes/kubernetes/pull/99825), [@feiskyer](https://github.com/feiskyer)) [SIG Cloud Provider]
- Fixed a race condition on API server startup ensuring previously created webhook configurations are effective before the first write request is admitted. ([#95783](https://github.com/kubernetes/kubernetes/pull/95783), [@roycaihw](https://github.com/roycaihw)) [SIG API Machinery]
- Fixed authentication_duration_seconds metric. Previously it included whole apiserver request duration. ([#99944](https://github.com/kubernetes/kubernetes/pull/99944), [@marseel](https://github.com/marseel)) [SIG API Machinery, Instrumentation and Scalability]
- Fixes issue where inline AzueFile secrets could not be accessed from the pod's namespace. ([#100563](https://github.com/kubernetes/kubernetes/pull/100563), [@msau42](https://github.com/msau42)) [SIG Storage]
- Improve speed of vSphere PV provisioning and reduce number of API calls ([#100054](https://github.com/kubernetes/kubernetes/pull/100054), [@gnufied](https://github.com/gnufied)) [SIG Cloud Provider and Storage]
- Kubectl: Fixed panic when describing an ingress backend without an API Group ([#100505](https://github.com/kubernetes/kubernetes/pull/100505), [@lauchokyip](https://github.com/lauchokyip)) [SIG CLI]
- Kubectl: fix case of age column in describe node (#96963, @bl-ue) ([#96963](https://github.com/kubernetes/kubernetes/pull/96963), [@bl-ue](https://github.com/bl-ue)) [SIG CLI]
- Kubelet.exe on Windows now checks that the process running as administrator and the executing user account is listed in the built-in administrators group.  This is the equivalent to checking the process is running as uid 0. ([#96616](https://github.com/kubernetes/kubernetes/pull/96616), [@perithompson](https://github.com/perithompson)) [SIG Node and Windows]
- Kubelet: Fixed the bug of getting the number of cpu when the number of cpu logical processors is more than 64 in windows ([#97378](https://github.com/kubernetes/kubernetes/pull/97378), [@hwdef](https://github.com/hwdef)) [SIG Node and Windows]
- Pass `KUBE_BUILD_CONFORMANCE=y` to the package-tarballs to reenable building the conformance tarballs. ([#100571](https://github.com/kubernetes/kubernetes/pull/100571), [@puerco](https://github.com/puerco)) [SIG Release]
- Pod Log stats for windows now reports metrics ([#99221](https://github.com/kubernetes/kubernetes/pull/99221), [@jsturtevant](https://github.com/jsturtevant)) [SIG Node, Storage, Testing and Windows]

### Other (Cleanup or Flake)

- A new storage E2E testsuite covers CSIStorageCapacity publishing if a driver opts into the test. ([#100537](https://github.com/kubernetes/kubernetes/pull/100537), [@pohly](https://github.com/pohly)) [SIG Storage and Testing]
- Convert cmd/kubelet/app/server.go to structured logging ([#98334](https://github.com/kubernetes/kubernetes/pull/98334), [@wawa0210](https://github.com/wawa0210)) [SIG Node]
- If kube-apiserver enabled goaway feature, clients required golang 1.15.8 or 1.16+ version to avoid un-expected data race issue. ([#98809](https://github.com/kubernetes/kubernetes/pull/98809), [@answer1991](https://github.com/answer1991)) [SIG API Machinery]
- Increased CSINodeIDMaxLength from 128  bytes to 192 bytes. ([#98753](https://github.com/kubernetes/kubernetes/pull/98753), [@Jiawei0227](https://github.com/Jiawei0227)) [SIG Apps and Storage]
- Migrate  `pkg/kubelet/pluginmanager`  to structured logging ([#99885](https://github.com/kubernetes/kubernetes/pull/99885), [@qingwave](https://github.com/qingwave)) [SIG Node]
- Migrate  `pkg/kubelet/preemption/preemption.go` and `pkg/kubelet/logs/container_log_manager.go` to structured logging ([#99848](https://github.com/kubernetes/kubernetes/pull/99848), [@qingwave](https://github.com/qingwave)) [SIG Node]
- Migrate `pkg/kubelet/(cri)` to structured logging ([#99006](https://github.com/kubernetes/kubernetes/pull/99006), [@yangjunmyfm192085](https://github.com/yangjunmyfm192085)) [SIG Node]
- Migrate `pkg/kubelet/(node, pod)` to structured logging ([#98847](https://github.com/kubernetes/kubernetes/pull/98847), [@yangjunmyfm192085](https://github.com/yangjunmyfm192085)) [SIG Node]
- Migrate `pkg/kubelet/(volume,container)` to structured logging ([#98850](https://github.com/kubernetes/kubernetes/pull/98850), [@yangjunmyfm192085](https://github.com/yangjunmyfm192085)) [SIG Node]
- Migrate `pkg/kubelet/kubelet_node_status.go` to structured logging ([#98154](https://github.com/kubernetes/kubernetes/pull/98154), [@yangjunmyfm192085](https://github.com/yangjunmyfm192085)) [SIG Node and Release]
- Migrate `pkg/kubelet/lifecycle,oom` to structured logging ([#99479](https://github.com/kubernetes/kubernetes/pull/99479), [@mengjiao-liu](https://github.com/mengjiao-liu)) [SIG Instrumentation and Node]
- Migrate cmd/kubelet/+ pkg/kubelet/cadvisor/cadvisor_linux.go + pkg/kubelet/cri/remote/util/util_unix.go + pkg/kubelet/images/image_manager.go to structured logging ([#99994](https://github.com/kubernetes/kubernetes/pull/99994), [@AfrouzMashayekhi](https://github.com/AfrouzMashayekhi)) [SIG Instrumentation and Node]
- Migrate pkg/kubelet/cm/container_manager_linux.go and pkg/kubelet/cm/container_manager_stub.go to structured logging ([#100001](https://github.com/kubernetes/kubernetes/pull/100001), [@shiyajuan123](https://github.com/shiyajuan123)) [SIG Instrumentation and Node]
- Migrate pkg/kubelet/cm/cpumanage/{topology/togit pology.go, policy_none.go, cpu_assignment.go} to structured logging ([#100163](https://github.com/kubernetes/kubernetes/pull/100163), [@lala123912](https://github.com/lala123912)) [SIG Instrumentation and Node]
- Migrate pkg/kubelet/cm/cpumanager/state to structured logging ([#99563](https://github.com/kubernetes/kubernetes/pull/99563), [@jmguzik](https://github.com/jmguzik)) [SIG Instrumentation and Node]
- Migrate pkg/kubelet/config to structured logging ([#100002](https://github.com/kubernetes/kubernetes/pull/100002), [@AfrouzMashayekhi](https://github.com/AfrouzMashayekhi)) [SIG Instrumentation and Node]
- Migrate pkg/kubelet/kubelet.go to structured logging ([#99861](https://github.com/kubernetes/kubernetes/pull/99861), [@navidshaikh](https://github.com/navidshaikh)) [SIG Instrumentation and Node]
- Migrate pkg/kubelet/kubeletconfig to structured logging ([#100265](https://github.com/kubernetes/kubernetes/pull/100265), [@ehashman](https://github.com/ehashman)) [SIG Node]
- Migrate pkg/kubelet/kuberuntime to structured logging ([#99970](https://github.com/kubernetes/kubernetes/pull/99970), [@krzysiekg](https://github.com/krzysiekg)) [SIG Instrumentation and Node]
- Migrate pkg/kubelet/prober to structured logging ([#99830](https://github.com/kubernetes/kubernetes/pull/99830), [@krzysiekg](https://github.com/krzysiekg)) [SIG Instrumentation and Node]
- Migrate pkg/kubelet/winstats to structured logging ([#99855](https://github.com/kubernetes/kubernetes/pull/99855), [@hexxdump](https://github.com/hexxdump)) [SIG Instrumentation and Node]
- Migrate probe log messages to structured logging ([#97093](https://github.com/kubernetes/kubernetes/pull/97093), [@aldudko](https://github.com/aldudko)) [SIG Instrumentation and Node]
- Migrate remaining kubelet files to structured logging ([#100196](https://github.com/kubernetes/kubernetes/pull/100196), [@ehashman](https://github.com/ehashman)) [SIG Instrumentation and Node]
- `apiserver_storage_objects` (a newer version of `etcd_object_counts) is promoted and marked as stable. ([#100082](https://github.com/kubernetes/kubernetes/pull/100082), [@logicalhan](https://github.com/logicalhan)) [SIG API Machinery, Instrumentation and Testing]

## Dependencies

### Added
_Nothing has changed._

### Changed
- github.com/cilium/ebpf: [1c8d4c9 → v0.2.0](https://github.com/cilium/ebpf/compare/1c8d4c9...v0.2.0)
- github.com/containerd/console: [v1.0.0 → v1.0.1](https://github.com/containerd/console/compare/v1.0.0...v1.0.1)
- github.com/containerd/containerd: [v1.4.1 → v1.4.4](https://github.com/containerd/containerd/compare/v1.4.1...v1.4.4)
- github.com/creack/pty: [v1.1.9 → v1.1.11](https://github.com/creack/pty/compare/v1.1.9...v1.1.11)
- github.com/docker/docker: [bd33bbf → v20.10.2+incompatible](https://github.com/docker/docker/compare/bd33bbf...v20.10.2)
- github.com/google/cadvisor: [v0.38.8 → v0.39.0](https://github.com/google/cadvisor/compare/v0.38.8...v0.39.0)
- github.com/konsorten/go-windows-terminal-sequences: [v1.0.3 → v1.0.2](https://github.com/konsorten/go-windows-terminal-sequences/compare/v1.0.3...v1.0.2)
- github.com/moby/sys/mountinfo: [v0.1.3 → v0.4.0](https://github.com/moby/sys/mountinfo/compare/v0.1.3...v0.4.0)
- github.com/moby/term: [672ec06 → df9cb8a](https://github.com/moby/term/compare/672ec06...df9cb8a)
- github.com/mrunalp/fileutils: [abd8a0e → v0.5.0](https://github.com/mrunalp/fileutils/compare/abd8a0e...v0.5.0)
- github.com/opencontainers/runc: [v1.0.0-rc92 → v1.0.0-rc93](https://github.com/opencontainers/runc/compare/v1.0.0-rc92...v1.0.0-rc93)
- github.com/opencontainers/runtime-spec: [4d89ac9 → e6143ca](https://github.com/opencontainers/runtime-spec/compare/4d89ac9...e6143ca)
- github.com/opencontainers/selinux: [v1.6.0 → v1.8.0](https://github.com/opencontainers/selinux/compare/v1.6.0...v1.8.0)
- github.com/sirupsen/logrus: [v1.6.0 → v1.7.0](https://github.com/sirupsen/logrus/compare/v1.6.0...v1.7.0)
- github.com/syndtr/gocapability: [d983527 → 42c35b4](https://github.com/syndtr/gocapability/compare/d983527...42c35b4)
- github.com/willf/bitset: [d5bec33 → v1.1.11](https://github.com/willf/bitset/compare/d5bec33...v1.1.11)
- gotest.tools/v3: v3.0.2 → v3.0.3
- k8s.io/klog/v2: v2.5.0 → v2.8.0
- sigs.k8s.io/structured-merge-diff/v4: v4.0.3 → v4.1.0

### Removed
_Nothing has changed._



# v1.21.0-beta.1


## Downloads for v1.21.0-beta.1

### Source Code

filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.21.0-beta.1/kubernetes.tar.gz) | c9f4f25242e319e5d90f49d26f239a930aad69677c0f3c2387c56bb13482648a26ed234be2bfe2352508f35010e3eb6d3b127c31a9f24fa1e53ac99c38520fe4
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.21.0-beta.1/kubernetes-src.tar.gz) | 255357db8fa160cab2187658906b674a8b0d9b9a5b5f688cc7b69dc124f5da00362c6cc18ae9b80f7ddb3da6f64c2ab2f12fb9b63a4e063c7366a5375b175cda

### Client binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.21.0-beta.1/kubernetes-client-darwin-amd64.tar.gz) | 02efd389c8126456416fd2c7ea25c3cc30f612649ad91f631f068d6c0e5e539484d3763cb9a8645ad6b8077e4fcd1552a659d7516ebc4ce6828cf823b65c3016
[kubernetes-client-darwin-arm64.tar.gz](https://dl.k8s.io/v1.21.0-beta.1/kubernetes-client-darwin-arm64.tar.gz) | ac90dcd1699d1d7ff9c8342d481f6d0d97ccdc3ec501a56dc7c9e1898a8f77f712bf66942d304bfe581b5494f13e3efa211865de88f89749780e9e26e673dbdb
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.21.0-beta.1/kubernetes-client-linux-386.tar.gz) | cce5fb84cc7a1ee664f89d8ad3064307c51c044e9ddd2ae5a004939b69d3b3ef6f29acc5782e27d0c8f0d6d3d9c96e922f5d1b99d210ca3e754666d775df9f0c
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.21.0-beta.1/kubernetes-client-linux-amd64.tar.gz) | 2e93bbd2e60ad7cd8fe495115e96c55b1dc8facd100a827ef9c197a732679b60cceb9ea7bf92a1f5e328c3b8adfa8d3922cbc5d8370e374f3381b83f5b877b4f
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.21.0-beta.1/kubernetes-client-linux-arm.tar.gz) | 23f03b6a8fa9decce9b89a2c1bd3dae6d0b2f9e533e35a79e2c5a29326a165259677594ae83c877219a21bdb95557a284e55f4eec12954742794579c89a7d7e5
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.21.0-beta.1/kubernetes-client-linux-arm64.tar.gz) | 3acf3101b46568b0ded6b90f13df0e918870d6812dc1a584903ddb8ba146484a204b9e442f863df47c7d4dab043fd9f7294c5510d3eb09004993d6d3b1e9e13c
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.21.0-beta.1/kubernetes-client-linux-ppc64le.tar.gz) | f749198df69577f62872d3096138a1b8969ec6b1636eb68eb56640bf33cf5f97a11df4363462749a1c0dc3ccbb8ae76c5d66864bf1c5cf7e52599caaf498e504
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.21.0-beta.1/kubernetes-client-linux-s390x.tar.gz) | 3f6c0189d59fca22cdded3a02c672ef703d17e6ab0831e173a870e14ccec436c142600e9fc35b403571b6906f2be8d18d38d33330f7caada971bbe1187b388f6
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.21.0-beta.1/kubernetes-client-windows-386.tar.gz) | 03d92371c425cf331c80807c0ac56f953be304fc6719057258a363d527d186d610e1d4b4d401b34128062983265c2e21f2d2389231aa66a6f5787eee78142cf6
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.21.0-beta.1/kubernetes-client-windows-amd64.tar.gz) | 489ece0c886a025ca3a25d28518637a5a824ea6544e7ef8778321036f13c8909a978ad4ceca966cec1e1cda99f25ca78bfd37460d1231c77436d216d43c872ad

### Server binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.21.0-beta.1/kubernetes-server-linux-amd64.tar.gz) | 2e95cb31d5afcb6842c41d25b7d0c18dd7e65693b2d93c8aa44e5275f9c6201e1a67685c7a8ddefa334babb04cb559d26e39b6a18497695a07dc270568cae108
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.21.0-beta.1/kubernetes-server-linux-arm.tar.gz) | 2927e82b98404c077196ce3968f3afd51a7576aa56d516019bd3976771c0213ba01e78da5b77478528e770da0d334e9457995fafb98820ed68b2ee34beb68856
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.21.0-beta.1/kubernetes-server-linux-arm64.tar.gz) | e0f7aea3ea598214a9817bc04949389cb7e4e7b9503141a590ef48c0b681fe44a4243ebc6280752fa41aa1093149b3ee1bcef7664edb746097a342281825430b
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.21.0-beta.1/kubernetes-server-linux-ppc64le.tar.gz) | c011f7eb01294e9ba5d5ced719068466f88ed595dcb8d554a36a4dd5118fb6b3d6bafe8bf89aa2d42988e69793ed777ba77b8876c6ec74f898a43cfce1f61bf4
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.21.0-beta.1/kubernetes-server-linux-s390x.tar.gz) | 15f6683e7f16caab7eebead2b7c15799460abbf035a43de0b75f96b0be19908f58add98a777a0cca916230d60cf6bfe3fee92b9dcff50274b1e37c243c157969

### Node binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.21.0-beta.1/kubernetes-node-linux-amd64.tar.gz) | ed58679561197110f366b9109f7afd62c227bfc271918ccf3eea203bb2ab6428eb5db4dd6c965f202a8a636f66da199470269b863815809b99d53d2fa47af2ea
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.21.0-beta.1/kubernetes-node-linux-arm.tar.gz) | 7e6c7f1957fcdecec8fef689c5019edbc0d0c11d22dafbfef0a07121d10d8f6273644f73511bd06a9a88b04d81a940bd6645ffb5711422af64af547a45c76273
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.21.0-beta.1/kubernetes-node-linux-arm64.tar.gz) | a3618f29967e7a1574917a67f0296e65780321eda484b99aa32bfd4dc9b35acdefce33da952ac52dfb509fbac5bf700cf177431fad2ab4adcab0544538939faa
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.21.0-beta.1/kubernetes-node-linux-ppc64le.tar.gz) | 326d3eb521b41bdf489912177f70b8cdd7cd828bb9b3d847ed3694eb27e457f24e0a88b8e51b726eee39800a3c5a40c1b30e3a8ec4a34d8041b3d8ef05d1b749
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.21.0-beta.1/kubernetes-node-linux-s390x.tar.gz) | 022d05ebaa66a0332c4fe18cdaf23d14c2c7e4d1f2af7f27baaf1eb042e6890dc3434b4ac8ba58c35d590717956f8c3458112685aff4938b94b18e263c3f4256
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.21.0-beta.1/kubernetes-node-windows-amd64.tar.gz) | fa691ed93f07af6bc1cf57e20a30580d6c528f88e5fea3c14f39c1820969dc5a0eb476c5b87b288593d0c086c4dd93aff6165082393283c3f46c210f9bb66d61

## Changelog since v1.21.0-beta.0

## Urgent Upgrade Notes

### (No, really, you MUST read this before you upgrade)

 - Kubeadm: during "init" an empty cgroupDriver value in the KubeletConfiguration is now always set to "systemd" unless the user is explicit about it. This requires existing machine setups to configure the container runtime to use the "systemd" driver. Documentation on this topic can be found here: https://kubernetes.io/docs/setup/production-environment/container-runtimes/. When upgrading existing clusters / nodes using "kubeadm upgrade" the old cgroupDriver value is preserved, but in 1.22 this change will also apply to "upgrade". For more information on migrating to the "systemd" driver or remaining on the "cgroupfs" driver see: https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/configure-cgroup-driver/. ([#99471](https://github.com/kubernetes/kubernetes/pull/99471), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
  - Migrate `pkg/kubelet/(dockershim, network)` to structured logging
  Exit code changed from 255 to 1 ([#98939](https://github.com/kubernetes/kubernetes/pull/98939), [@yangjunmyfm192085](https://github.com/yangjunmyfm192085)) [SIG Network and Node]
  - Migrate `pkg/kubelet/certificate` to structured logging
  Exit code changed from 255 to 1 ([#98993](https://github.com/kubernetes/kubernetes/pull/98993), [@SataQiu](https://github.com/SataQiu)) [SIG Auth and Node]
  - Newly provisioned PVs by EBS plugin will no longer use the deprecated "failure-domain.beta.kubernetes.io/zone" and "failure-domain.beta.kubernetes.io/region" labels. It will use "topology.kubernetes.io/zone" and "topology.kubernetes.io/region" labels instead. ([#99130](https://github.com/kubernetes/kubernetes/pull/99130), [@ayberk](https://github.com/ayberk)) [SIG Cloud Provider, Storage and Testing]
  - Newly provisioned PVs by OpenStack Cinder plugin will no longer use the deprecated "failure-domain.beta.kubernetes.io/zone" and "failure-domain.beta.kubernetes.io/region" labels. It will use "topology.kubernetes.io/zone" and "topology.kubernetes.io/region" labels instead. ([#99719](https://github.com/kubernetes/kubernetes/pull/99719), [@jsafrane](https://github.com/jsafrane)) [SIG Cloud Provider and Storage]
  - OpenStack Cinder CSI migration is on by default, Clinder CSI driver must be installed on clusters on OpenStack for Cinder volumes to work. ([#98538](https://github.com/kubernetes/kubernetes/pull/98538), [@dims](https://github.com/dims)) [SIG Storage]
  - Package pkg/kubelet/server migrated to structured logging
  Exit code changed from 255 to 1 ([#99838](https://github.com/kubernetes/kubernetes/pull/99838), [@adisky](https://github.com/adisky)) [SIG Node]
  - Pkg/kubelet/kuberuntime/kuberuntime_manager.go migrated to structured logging
  Exit code changed from 255 to 1 ([#99841](https://github.com/kubernetes/kubernetes/pull/99841), [@adisky](https://github.com/adisky)) [SIG Instrumentation and Node]
 
## Changes by Kind

### Deprecation

- Kubeadm: the deprecated kube-dns is no longer supported as an option. If "ClusterConfiguration.dns.type" is set to "kube-dns" kubeadm will now throw an error. ([#99646](https://github.com/kubernetes/kubernetes/pull/99646), [@rajansandeep](https://github.com/rajansandeep)) [SIG Cluster Lifecycle]
- Remove deprecated --generator --replicas --service-generator --service-overrides --schedule from kubectl run
  Deprecate --serviceaccount --hostport --requests --limits in kubectl run ([#99732](https://github.com/kubernetes/kubernetes/pull/99732), [@soltysh](https://github.com/soltysh)) [SIG CLI and Testing]
- `audit.k8s.io/v1beta1` and `audit.k8s.io/v1alpha1` audit policy configuration and audit events are deprecated in favor of `audit.k8s.io/v1`, available since v1.13. kube-apiserver invocations that specify alpha or beta policy configurations with `--audit-policy-file`, or explicitly request alpha or beta audit events with `--audit-log-version` / `--audit-webhook-version` must update to use `audit.k8s.io/v1` and accept `audit.k8s.io/v1` events prior to v1.24. ([#98858](https://github.com/kubernetes/kubernetes/pull/98858), [@carlory](https://github.com/carlory)) [SIG Auth]
- `diskformat` stroage class parameter for in-tree vSphere volume plugin is deprecated as of v1.21 release. Please consider updating storageclass and remove `diskformat` parameter. vSphere CSI Driver does not support diskformat storageclass parameter.
  
  vSphere releases less than 67u3 are deprecated as of v1.21. Please consider upgrading vSphere to 67u3 or above. vSphere CSI Driver requires minimum vSphere 67u3.
  
  VM Hardware version less than 15 is deprecated as of v1.21. Please consider upgrading the Node VM Hardware version to 15 or above. vSphere CSI Driver recommends Node VM's Hardware version set to at least vmx-15.
  
  Multi vCenter support is deprecated as of v1.21. If you have a Kubernetes cluster spanning across multiple vCenter servers, please consider moving all k8s nodes to a single vCenter Server. vSphere CSI Driver does not support Kubernetes deployment spanning across multiple vCenter servers.
  
  Support for these deprecations will be available till Kubernetes v1.24. ([#98546](https://github.com/kubernetes/kubernetes/pull/98546), [@divyenpatel](https://github.com/divyenpatel)) [SIG Cloud Provider and Storage]

### API Change

- 1. PodAffinityTerm includes a namespaceSelector field to allow selecting eligible namespaces based on their labels. 
  2. A new CrossNamespacePodAffinity quota scope API that allows restricting which namespaces allowed to use PodAffinityTerm with corss-namespace reference via namespaceSelector or namespaces fields. ([#98582](https://github.com/kubernetes/kubernetes/pull/98582), [@ahg-g](https://github.com/ahg-g)) [SIG API Machinery, Apps, Auth and Testing]
- Add a default metadata name labels for selecting any namespace by its name. ([#96968](https://github.com/kubernetes/kubernetes/pull/96968), [@jayunit100](https://github.com/jayunit100)) [SIG API Machinery, Apps, Cloud Provider, Storage and Testing]
- Added `.spec.completionMode` field to Job, with accepted values `NonIndexed` (default) and `Indexed` ([#98441](https://github.com/kubernetes/kubernetes/pull/98441), [@alculquicondor](https://github.com/alculquicondor)) [SIG Apps and CLI]
- Clarified NetworkPolicy policyTypes documentation ([#97216](https://github.com/kubernetes/kubernetes/pull/97216), [@joejulian](https://github.com/joejulian)) [SIG Network]
- DaemonSets accept a MaxSurge integer or percent on their rolling update strategy that will launch the updated pod on nodes and wait for those pods to go ready before marking the old out-of-date pods as deleted. This allows workloads to avoid downtime during upgrades when deployed using DaemonSets. This feature is alpha and is behind the DaemonSetUpdateSurge feature gate. ([#96441](https://github.com/kubernetes/kubernetes/pull/96441), [@smarterclayton](https://github.com/smarterclayton)) [SIG Apps and Testing]
- EndpointSlice API is now GA. The EndpointSlice topology field has been removed from the GA API and will be replaced by a new per Endpoint Zone field. If the topology field was previously used, it will be converted into an annotation in the v1 Resource. The discovery.k8s.io/v1alpha1 API is removed. ([#99662](https://github.com/kubernetes/kubernetes/pull/99662), [@swetharepakula](https://github.com/swetharepakula)) [SIG API Machinery, CLI, Cloud Provider, Cluster Lifecycle, Instrumentation, Network and Testing]
- EndpointSlice Controllers are now GA. The EndpointSlice Controller will not populate the `deprecatedTopology` field and will only provide topology information through the `zone` and `nodeName` fields. ([#99870](https://github.com/kubernetes/kubernetes/pull/99870), [@swetharepakula](https://github.com/swetharepakula)) [SIG API Machinery, Apps, Auth, Network and Testing]
- IngressClass resource can now reference a resource in a specific namespace 
  for implementation-specific configuration(previously only Cluster-level resources were allowed). 
  This feature can be enabled using the IngressClassNamespacedParams feature gate. ([#99275](https://github.com/kubernetes/kubernetes/pull/99275), [@hbagdi](https://github.com/hbagdi)) [SIG API Machinery, CLI and Network]
- Introduce conditions for PodDisruptionBudget ([#98127](https://github.com/kubernetes/kubernetes/pull/98127), [@mortent](https://github.com/mortent)) [SIG API Machinery, Apps, Auth, CLI, Cloud Provider, Cluster Lifecycle and Instrumentation]
- Jobs API has a new .spec.suspend field that can be used to suspend and resume Jobs ([#98727](https://github.com/kubernetes/kubernetes/pull/98727), [@adtac](https://github.com/adtac)) [SIG API Machinery, Apps, Node, Scheduling and Testing]
- Kubelet Graceful Node Shutdown feature is now beta. ([#99735](https://github.com/kubernetes/kubernetes/pull/99735), [@bobbypage](https://github.com/bobbypage)) [SIG Node]
- Limit the quest value of hugepage to integer multiple of page size. ([#98515](https://github.com/kubernetes/kubernetes/pull/98515), [@lala123912](https://github.com/lala123912)) [SIG Apps]
- One new field "InternalTrafficPolicy" in Service is added.
  It specifies if the cluster internal traffic should be routed to all endpoints or node-local endpoints only.
  "Cluster" routes internal traffic to a Service to all endpoints.
  "Local" routes traffic to node-local endpoints only, and traffic is dropped if no node-local endpoints are ready.
  The default value is "Cluster". ([#96600](https://github.com/kubernetes/kubernetes/pull/96600), [@maplain](https://github.com/maplain)) [SIG API Machinery, Apps and Network]
- PodSecurityPolicy only stores "generic" as allowed volume type if the GenericEphemeralVolume feature gate is enabled ([#98918](https://github.com/kubernetes/kubernetes/pull/98918), [@pohly](https://github.com/pohly)) [SIG Auth and Security]
- Promote CronJobs to batch/v1 ([#99423](https://github.com/kubernetes/kubernetes/pull/99423), [@soltysh](https://github.com/soltysh)) [SIG API Machinery, Apps, CLI and Testing]
- Remove support for building Kubernetes with bazel. ([#99561](https://github.com/kubernetes/kubernetes/pull/99561), [@BenTheElder](https://github.com/BenTheElder)) [SIG API Machinery, Apps, Architecture, Auth, Autoscaling, CLI, Cloud Provider, Cluster Lifecycle, Instrumentation, Network, Node, Release, Scalability, Scheduling, Storage, Testing and Windows]
- Setting loadBalancerClass in load balancer type of service is available with this PR. 
  Users who want to use a custom load balancer can specify loadBalancerClass to achieve it. ([#98277](https://github.com/kubernetes/kubernetes/pull/98277), [@XudongLiuHarold](https://github.com/XudongLiuHarold)) [SIG API Machinery, Apps, Cloud Provider and Network]
- Storage capacity tracking (= the CSIStorageCapacity feature) is beta, storage.k8s.io/v1alpha1/VolumeAttachment and storage.k8s.io/v1alpha1/CSIStorageCapacity objects are deprecated ([#99641](https://github.com/kubernetes/kubernetes/pull/99641), [@pohly](https://github.com/pohly)) [SIG API Machinery, Apps, Auth, Scheduling, Storage and Testing]
- Support for Indexed Job: a Job that is considered completed when Pods associated to indexes from 0 to (.spec.completions-1) have succeeded. ([#98812](https://github.com/kubernetes/kubernetes/pull/98812), [@alculquicondor](https://github.com/alculquicondor)) [SIG Apps and CLI]
- The apiserver now resets managedFields that got corrupted by a mutating admission controller. ([#98074](https://github.com/kubernetes/kubernetes/pull/98074), [@kwiesmueller](https://github.com/kwiesmueller)) [SIG API Machinery and Testing]
- `controller.kubernetes.io/pod-deletion-cost` annotation can be set to offer a hint on the cost of deleting a pod compared to other pods belonging to the same ReplicaSet. Pods with lower deletion cost are deleted first. This is an alpha feature. ([#99163](https://github.com/kubernetes/kubernetes/pull/99163), [@ahg-g](https://github.com/ahg-g)) [SIG Apps]

### Feature

- A client-go metric, rest_client_exec_plugin_call_total, has been added to track total calls to client-go credential plugins. ([#98892](https://github.com/kubernetes/kubernetes/pull/98892), [@ankeesler](https://github.com/ankeesler)) [SIG API Machinery, Auth, Cluster Lifecycle and Instrumentation]
- Add --use-protocol-buffers flag to kubectl top pods and nodes ([#96655](https://github.com/kubernetes/kubernetes/pull/96655), [@serathius](https://github.com/serathius)) [SIG CLI]
- Add support to generate client-side binaries for new darwin/arm64 platform ([#97743](https://github.com/kubernetes/kubernetes/pull/97743), [@dims](https://github.com/dims)) [SIG Release and Testing]
- Added `ephemeral_volume_controller_create[_failures]_total` counters to kube-controller-manager metrics ([#99115](https://github.com/kubernetes/kubernetes/pull/99115), [@pohly](https://github.com/pohly)) [SIG API Machinery, Apps, Cluster Lifecycle, Instrumentation and Storage]
- Adds alpha feature `VolumeCapacityPriority` which makes the scheduler prioritize nodes based on the best matching size of statically provisioned PVs across multiple topologies. ([#96347](https://github.com/kubernetes/kubernetes/pull/96347), [@cofyc](https://github.com/cofyc)) [SIG Apps, Network, Scheduling, Storage and Testing]
- Adds two new metrics to cronjobs, a  histogram to track the time difference when a job is created and the expected time when it should be created, and a gauge for the missed schedules of a cronjob ([#99341](https://github.com/kubernetes/kubernetes/pull/99341), [@alaypatel07](https://github.com/alaypatel07)) [SIG Apps and Instrumentation]
- Alpha implementation of Kubectl Command Headers: SIG CLI KEP 859 enabled when KUBECTL_COMMAND_HEADERS environment variable set on the client command line.
  - To enable: export KUBECTL_COMMAND_HEADERS=1; kubectl ... ([#98952](https://github.com/kubernetes/kubernetes/pull/98952), [@seans3](https://github.com/seans3)) [SIG API Machinery and CLI]
- Component owner can configure the allowlist of metric label with flag '--allow-metric-labels'. ([#99738](https://github.com/kubernetes/kubernetes/pull/99738), [@YoyinZyc](https://github.com/YoyinZyc)) [SIG API Machinery, Cluster Lifecycle and Instrumentation]
- Disruption controller only sends one event per PodDisruptionBudget if scale can't be computed ([#98128](https://github.com/kubernetes/kubernetes/pull/98128), [@mortent](https://github.com/mortent)) [SIG Apps]
- EndpointSliceNodeName will always be enabled, so NodeName will always be available in the v1beta1 API. ([#99746](https://github.com/kubernetes/kubernetes/pull/99746), [@swetharepakula](https://github.com/swetharepakula)) [SIG Apps and Network]
- Graduate CRIContainerLogRotation feature gate to GA. ([#99651](https://github.com/kubernetes/kubernetes/pull/99651), [@umohnani8](https://github.com/umohnani8)) [SIG Node and Testing]
- Kube-proxy iptables: new metric sync_proxy_rules_iptables_total that exposes the number of rules programmed per table in each iteration ([#99653](https://github.com/kubernetes/kubernetes/pull/99653), [@aojea](https://github.com/aojea)) [SIG Instrumentation and Network]
- Kube-scheduler now logs plugin scoring summaries at --v=4 ([#99411](https://github.com/kubernetes/kubernetes/pull/99411), [@damemi](https://github.com/damemi)) [SIG Scheduling]
- Kubeadm: a warning to user as ipv6 site-local is deprecated ([#99574](https://github.com/kubernetes/kubernetes/pull/99574), [@pacoxu](https://github.com/pacoxu)) [SIG Cluster Lifecycle and Network]
- Kubeadm: apply the "node.kubernetes.io/exclude-from-external-load-balancers" label on control plane nodes during "init", "join" and "upgrade" to preserve backwards compatibility with the lagacy LB mode where nodes labeled as "master" where excluded. To opt-out you can remove the label from a node. See #97543 and the linked KEP for more details. ([#98269](https://github.com/kubernetes/kubernetes/pull/98269), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Kubeadm: if the user has customized their image repository via the kubeadm configuration, pass the custom pause image repository and tag to the kubelet via --pod-infra-container-image not only for Docker but for all container runtimes. This flag tells the kubelet that it should not garbage collect the image. ([#99476](https://github.com/kubernetes/kubernetes/pull/99476), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Kubeadm: promote IPv6DualStack feature gate to Beta ([#99294](https://github.com/kubernetes/kubernetes/pull/99294), [@pacoxu](https://github.com/pacoxu)) [SIG Cluster Lifecycle]
- Kubectl version changed to write a warning message to stderr if the client and server version difference exceeds the supported version skew of +/-1 minor version. ([#98250](https://github.com/kubernetes/kubernetes/pull/98250), [@brianpursley](https://github.com/brianpursley)) [SIG CLI]
- Kubernetes is now built with Golang 1.16 ([#98572](https://github.com/kubernetes/kubernetes/pull/98572), [@justaugustus](https://github.com/justaugustus)) [SIG API Machinery, Auth, CLI, Cloud Provider, Cluster Lifecycle, Instrumentation, Node, Release and Testing]
- Persistent Volumes formatted with the btrfs filesystem will now automatically resize when expanded. ([#99361](https://github.com/kubernetes/kubernetes/pull/99361), [@Novex](https://github.com/Novex)) [SIG Storage]
- Remove cAdvisor json metrics api collected by Kubelet ([#99236](https://github.com/kubernetes/kubernetes/pull/99236), [@pacoxu](https://github.com/pacoxu)) [SIG Node]
- Sysctls is now GA and locked to default ([#99158](https://github.com/kubernetes/kubernetes/pull/99158), [@wgahnagl](https://github.com/wgahnagl)) [SIG Node]
- The NodeAffinity plugin implements the PreFilter extension, offering enhanced performance for Filter. ([#99213](https://github.com/kubernetes/kubernetes/pull/99213), [@AliceZhang2016](https://github.com/AliceZhang2016)) [SIG Scheduling]
- The endpointslice mirroring controller mirrors endpoints annotations and labels to the generated endpoint slices, it also ensures that updates on any of these fields are mirrored. 
  The well-known annotation endpoints.kubernetes.io/last-change-trigger-time is skipped and not mirrored. ([#98116](https://github.com/kubernetes/kubernetes/pull/98116), [@aojea](https://github.com/aojea)) [SIG Apps, Network and Testing]
- Update the latest validated version of Docker to 20.10 ([#98977](https://github.com/kubernetes/kubernetes/pull/98977), [@neolit123](https://github.com/neolit123)) [SIG CLI, Cluster Lifecycle and Node]
- Upgrade node local dns to 1.17.0 for better IPv6 support ([#99749](https://github.com/kubernetes/kubernetes/pull/99749), [@pacoxu](https://github.com/pacoxu)) [SIG Cloud Provider and Network]
- Users might specify the `kubectl.kubernetes.io/default-exec-container` annotation in a Pod to preselect container for kubectl commands. ([#99581](https://github.com/kubernetes/kubernetes/pull/99581), [@mengjiao-liu](https://github.com/mengjiao-liu)) [SIG CLI]
- When downscaling ReplicaSets, ready and creation timestamps are compared in a logarithmic scale. ([#99212](https://github.com/kubernetes/kubernetes/pull/99212), [@damemi](https://github.com/damemi)) [SIG Apps and Testing]
- When the kubelet is watching a ConfigMap or Secret purely in the context of setting environment variables
  for containers, only hold that watch for a defined duration before cancelling it. This change reduces the CPU
  and memory usage of the kube-apiserver in large clusters. ([#99393](https://github.com/kubernetes/kubernetes/pull/99393), [@chenyw1990](https://github.com/chenyw1990)) [SIG API Machinery, Node and Testing]
- WindowsEndpointSliceProxying feature gate has graduated to beta and is enabled by default. This means kube-proxy will  read from EndpointSlices instead of Endpoints on Windows by default. ([#99794](https://github.com/kubernetes/kubernetes/pull/99794), [@robscott](https://github.com/robscott)) [SIG Network]

### Bug or Regression

- Creating a PVC with DataSource should fail for non-CSI plugins. ([#97086](https://github.com/kubernetes/kubernetes/pull/97086), [@xing-yang](https://github.com/xing-yang)) [SIG Apps and Storage]
- EndpointSlice controller is now less likely to emit FailedToUpdateEndpointSlices events. ([#99345](https://github.com/kubernetes/kubernetes/pull/99345), [@robscott](https://github.com/robscott)) [SIG Apps and Network]
- EndpointSliceMirroring controller is now less likely to emit FailedToUpdateEndpointSlices events. ([#99756](https://github.com/kubernetes/kubernetes/pull/99756), [@robscott](https://github.com/robscott)) [SIG Apps and Network]
- Fix --ignore-errors does not take effect if multiple logs are printed and unfollowed ([#97686](https://github.com/kubernetes/kubernetes/pull/97686), [@wzshiming](https://github.com/wzshiming)) [SIG CLI]
- Fix bug that would let the Horizontal Pod Autoscaler scale down despite at least one metric being unavailable/invalid ([#99514](https://github.com/kubernetes/kubernetes/pull/99514), [@mikkeloscar](https://github.com/mikkeloscar)) [SIG Apps and Autoscaling]
- Fix cgroup handling for systemd with cgroup v2 ([#98365](https://github.com/kubernetes/kubernetes/pull/98365), [@odinuge](https://github.com/odinuge)) [SIG Node]
- Fix smb mount PermissionDenied issue on Windows ([#99550](https://github.com/kubernetes/kubernetes/pull/99550), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider, Storage and Windows]
- Fixed a bug that causes smaller number of conntrack-max being used under CPU static policy. (#99225, @xh4n3) ([#99613](https://github.com/kubernetes/kubernetes/pull/99613), [@xh4n3](https://github.com/xh4n3)) [SIG Network]
- Fixed bug that caused cAdvisor to incorrectly detect single-socket multi-NUMA topology. ([#99315](https://github.com/kubernetes/kubernetes/pull/99315), [@iwankgb](https://github.com/iwankgb)) [SIG Node]
- Fixes add-on manager leader election ([#98968](https://github.com/kubernetes/kubernetes/pull/98968), [@liggitt](https://github.com/liggitt)) [SIG Cloud Provider]
- Improved update time of pod statuses following new probe results. ([#98376](https://github.com/kubernetes/kubernetes/pull/98376), [@matthyx](https://github.com/matthyx)) [SIG Node and Testing]
- Kube-apiserver: an update of a pod with a generic ephemeral volume dropped that volume if the feature had been disabled since creating the pod with such a volume ([#99446](https://github.com/kubernetes/kubernetes/pull/99446), [@pohly](https://github.com/pohly)) [SIG Apps, Node and Storage]
- Kubeadm: skip validating pod subnet against node-cidr-mask when allocate-node-cidrs is set to be false ([#98984](https://github.com/kubernetes/kubernetes/pull/98984), [@SataQiu](https://github.com/SataQiu)) [SIG Cluster Lifecycle]
- On single-stack configured (IPv4 or IPv6, but not both) clusters, Services which are both headless (no clusterIP) and selectorless (empty or undefined selector) will report `ipFamilyPolicy RequireDualStack` and will have entries in `ipFamilies[]` for both IPv4 and IPv6.  This is a change from alpha, but does not have any impact on the manually-specified Endpoints and EndpointSlices for the Service. ([#99555](https://github.com/kubernetes/kubernetes/pull/99555), [@thockin](https://github.com/thockin)) [SIG Apps and Network]
- Resolves spurious `Failed to list *v1.Secret` or `Failed to list *v1.ConfigMap` messages in kubelet logs. ([#99538](https://github.com/kubernetes/kubernetes/pull/99538), [@liggitt](https://github.com/liggitt)) [SIG Auth and Node]
- Return zero time (midnight on Jan. 1, 1970) instead of negative number when reporting startedAt and finishedAt of the not started or a running Pod when using dockershim as a runtime. ([#99585](https://github.com/kubernetes/kubernetes/pull/99585), [@Iceber](https://github.com/Iceber)) [SIG Node]
- Stdin is now only passed to client-go exec credential plugins when it is detected to be an interactive terminal. Previously, it was passed to client-go exec plugins when **stdout*- was detected to be an interactive terminal. ([#99654](https://github.com/kubernetes/kubernetes/pull/99654), [@ankeesler](https://github.com/ankeesler)) [SIG API Machinery and Auth]
- The maximum number of ports allowed in EndpointSlices has been increased from 100 to 20,000 ([#99795](https://github.com/kubernetes/kubernetes/pull/99795), [@robscott](https://github.com/robscott)) [SIG Network]
- Updates the commands 
   - kubectl kustomize {arg}
   - kubectl apply -k {arg}
  to use same code as kustomize CLI v4.0.5
   - [v4.0.5]: https://github.com/kubernetes-sigs/kustomize/releases/tag/kustomize%2Fv4.0.5 ([#98946](https://github.com/kubernetes/kubernetes/pull/98946), [@monopole](https://github.com/monopole)) [SIG API Machinery, Architecture, CLI, Cloud Provider, Cluster Lifecycle, Instrumentation, Node and Storage]
- When a CNI plugin returns dual-stack pod IPs, kubelet will now try to respect the
  "primary IP family" of the cluster by picking a primary pod IP of the same family
  as the (primary) node IP, rather than assuming that the CNI plugin returned the IPs
  in the order the administrator wanted (since some CNI plugins don't allow
  configuring this). ([#97979](https://github.com/kubernetes/kubernetes/pull/97979), [@danwinship](https://github.com/danwinship)) [SIG Network and Node]
- When using Containerd on Windows, the "C:\Windows\System32\drivers\etc\hosts" file will now be managed by kubelet. ([#83730](https://github.com/kubernetes/kubernetes/pull/83730), [@claudiubelu](https://github.com/claudiubelu)) [SIG Node and Windows]
- `VolumeBindingArgs` now allow `BindTimeoutSeconds` to be set as zero, while the value zero indicates no waiting for the checking of volume binding operation. ([#99835](https://github.com/kubernetes/kubernetes/pull/99835), [@chendave](https://github.com/chendave)) [SIG Scheduling and Storage]
- `kubectl exec` and `kubectl attach` now honor the `--quiet` flag which suppresses output from the local binary that could be confused by a script with the remote command output (all non-failure output is hidden). In addition, print inline with exec and attach the list of alternate containers when we default to the first spec.container. ([#99004](https://github.com/kubernetes/kubernetes/pull/99004), [@smarterclayton](https://github.com/smarterclayton)) [SIG CLI]

### Other (Cleanup or Flake)

- Apiserver_request_duration_seconds is promoted to stable status. ([#99925](https://github.com/kubernetes/kubernetes/pull/99925), [@logicalhan](https://github.com/logicalhan)) [SIG API Machinery, Instrumentation and Testing]
- Apiserver_request_total is promoted to stable status and no longer has a content-type dimensions, so any alerts/charts which presume the existence of this will fail. This is however, unlikely to be the case since it was effectively an unbounded dimension in the first place. ([#99788](https://github.com/kubernetes/kubernetes/pull/99788), [@logicalhan](https://github.com/logicalhan)) [SIG API Machinery, Instrumentation and Testing]
- EndpointSlice generation is now incremented when labels change. ([#99750](https://github.com/kubernetes/kubernetes/pull/99750), [@robscott](https://github.com/robscott)) [SIG Network]
- Featuregate AllowInsecureBackendProxy is promoted to GA ([#99658](https://github.com/kubernetes/kubernetes/pull/99658), [@deads2k](https://github.com/deads2k)) [SIG API Machinery]
- Migrate `pkg/kubelet/(eviction)` to structured logging ([#99032](https://github.com/kubernetes/kubernetes/pull/99032), [@yangjunmyfm192085](https://github.com/yangjunmyfm192085)) [SIG Node]
- Migrate deployment controller log messages to structured logging ([#97507](https://github.com/kubernetes/kubernetes/pull/97507), [@aldudko](https://github.com/aldudko)) [SIG Apps]
- Migrate pkg/kubelet/cloudresource to structured logging ([#98999](https://github.com/kubernetes/kubernetes/pull/98999), [@sladyn98](https://github.com/sladyn98)) [SIG Node]
- Migrate pkg/kubelet/cri/remote logs to structured logging ([#98589](https://github.com/kubernetes/kubernetes/pull/98589), [@chenyw1990](https://github.com/chenyw1990)) [SIG Node]
- Migrate pkg/kubelet/kuberuntime/kuberuntime_container.go logs to structured logging ([#96973](https://github.com/kubernetes/kubernetes/pull/96973), [@chenyw1990](https://github.com/chenyw1990)) [SIG Instrumentation and Node]
- Migrate pkg/kubelet/status to structured logging ([#99836](https://github.com/kubernetes/kubernetes/pull/99836), [@navidshaikh](https://github.com/navidshaikh)) [SIG Instrumentation and Node]
- Migrate pkg/kubelet/token to structured logging ([#99264](https://github.com/kubernetes/kubernetes/pull/99264), [@palnabarun](https://github.com/palnabarun)) [SIG Auth, Instrumentation and Node]
- Migrate pkg/kubelet/util to structured logging ([#99823](https://github.com/kubernetes/kubernetes/pull/99823), [@navidshaikh](https://github.com/navidshaikh)) [SIG Instrumentation and Node]
- Migrate proxy/userspace/proxier.go logs to structured logging ([#97837](https://github.com/kubernetes/kubernetes/pull/97837), [@JornShen](https://github.com/JornShen)) [SIG Network]
- Migrate some kubelet/metrics log messages to structured logging ([#98627](https://github.com/kubernetes/kubernetes/pull/98627), [@jialaijun](https://github.com/jialaijun)) [SIG Instrumentation and Node]
- Process start time on Windows now uses current process information ([#97491](https://github.com/kubernetes/kubernetes/pull/97491), [@jsturtevant](https://github.com/jsturtevant)) [SIG API Machinery, CLI, Cloud Provider, Cluster Lifecycle, Instrumentation and Windows]

### Uncategorized

- Migrate pkg/kubelet/stats to structured logging ([#99607](https://github.com/kubernetes/kubernetes/pull/99607), [@krzysiekg](https://github.com/krzysiekg)) [SIG Node]
- The DownwardAPIHugePages feature is beta.  Users may use the feature if all workers in their cluster are min 1.20 version.  The feature will be enabled by default in all installations in 1.22. ([#99610](https://github.com/kubernetes/kubernetes/pull/99610), [@derekwaynecarr](https://github.com/derekwaynecarr)) [SIG Node]

## Dependencies

### Added
- github.com/go-errors/errors: [v1.0.1](https://github.com/go-errors/errors/tree/v1.0.1)
- github.com/gobuffalo/here: [v0.6.0](https://github.com/gobuffalo/here/tree/v0.6.0)
- github.com/google/shlex: [e7afc7f](https://github.com/google/shlex/tree/e7afc7f)
- github.com/markbates/pkger: [v0.17.1](https://github.com/markbates/pkger/tree/v0.17.1)
- github.com/monochromegane/go-gitignore: [205db1a](https://github.com/monochromegane/go-gitignore/tree/205db1a)
- github.com/niemeyer/pretty: [a10e7ca](https://github.com/niemeyer/pretty/tree/a10e7ca)
- github.com/xlab/treeprint: [a009c39](https://github.com/xlab/treeprint/tree/a009c39)
- go.starlark.net: 8dd3e2e
- golang.org/x/term: 6a3ed07
- sigs.k8s.io/kustomize/api: v0.8.5
- sigs.k8s.io/kustomize/cmd/config: v0.9.7
- sigs.k8s.io/kustomize/kustomize/v4: v4.0.5
- sigs.k8s.io/kustomize/kyaml: v0.10.15

### Changed
- dmitri.shuralyov.com/gpu/mtl: 666a987 → 28db891
- github.com/creack/pty: [v1.1.7 → v1.1.9](https://github.com/creack/pty/compare/v1.1.7...v1.1.9)
- github.com/go-openapi/spec: [v0.19.3 → v0.19.5](https://github.com/go-openapi/spec/compare/v0.19.3...v0.19.5)
- github.com/go-openapi/strfmt: [v0.19.3 → v0.19.5](https://github.com/go-openapi/strfmt/compare/v0.19.3...v0.19.5)
- github.com/go-openapi/validate: [v0.19.5 → v0.19.8](https://github.com/go-openapi/validate/compare/v0.19.5...v0.19.8)
- github.com/google/cadvisor: [v0.38.7 → v0.38.8](https://github.com/google/cadvisor/compare/v0.38.7...v0.38.8)
- github.com/kr/text: [v0.1.0 → v0.2.0](https://github.com/kr/text/compare/v0.1.0...v0.2.0)
- github.com/mattn/go-runewidth: [v0.0.2 → v0.0.7](https://github.com/mattn/go-runewidth/compare/v0.0.2...v0.0.7)
- github.com/olekukonko/tablewriter: [a0225b3 → v0.0.4](https://github.com/olekukonko/tablewriter/compare/a0225b3...v0.0.4)
- github.com/sergi/go-diff: [v1.0.0 → v1.1.0](https://github.com/sergi/go-diff/compare/v1.0.0...v1.1.0)
- golang.org/x/crypto: 7f63de1 → 5ea612d
- golang.org/x/exp: 6cc2880 → 85be41e
- golang.org/x/mobile: d2bd2a2 → e6ae53a
- golang.org/x/mod: v0.3.0 → ce943fd
- golang.org/x/net: 69a7880 → 3d97a24
- golang.org/x/sys: 5cba982 → a50acf3
- golang.org/x/time: 3af7569 → f8bda1e
- golang.org/x/tools: 113979e → v0.1.0
- gopkg.in/check.v1: 41f04d3 → 8fa4692
- gopkg.in/yaml.v2: v2.2.8 → v2.4.0
- k8s.io/kube-openapi: d219536 → 591a79e
- k8s.io/system-validators: v1.3.0 → v1.4.0

### Removed
- github.com/codegangsta/negroni: [v1.0.0](https://github.com/codegangsta/negroni/tree/v1.0.0)
- github.com/golangplus/bytes: [45c989f](https://github.com/golangplus/bytes/tree/45c989f)
- github.com/golangplus/fmt: [2a5d6d7](https://github.com/golangplus/fmt/tree/2a5d6d7)
- github.com/gorilla/context: [v1.1.1](https://github.com/gorilla/context/tree/v1.1.1)
- github.com/kr/pty: [v1.1.5](https://github.com/kr/pty/tree/v1.1.5)
- sigs.k8s.io/kustomize: v2.0.3+incompatible



# v1.21.0-beta.0


## Downloads for v1.21.0-beta.0

### Source Code

filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.21.0-beta.0/kubernetes.tar.gz) | 69b73a03b70b0ed006e9fef3f5b9bc68f0eb8dc40db6cc04777c03a2cb83a008c783012ca186b1c48357fb192403dbcf6960f120924785e2076e215b9012d546
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.21.0-beta.0/kubernetes-src.tar.gz) | 9620fb6d37634271bdd423c09f33f3bd29e74298aa82c47dffc8cb6bd2ff44fa8987a53c53bc529db4ca96ec41503aa81cc8d0c3ac106f3b06c4720de933a8e6

### Client binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.21.0-beta.0/kubernetes-client-darwin-amd64.tar.gz) | 2a6f3fcd6b571f5ccde56b91e6e179a01899244be496dae16a2a16e0405c9437b75c6dc853b56f9a4876a7c0a60ec624ccd28400bf8fb960258263172f6860ba
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.21.0-beta.0/kubernetes-client-linux-386.tar.gz) | 78fe9ad9f9a9bc043293327223f0038a2c087ca65e87187a6dcae7a24aef9565fe498d295a4639b0b90524469a04930022fcecd815d0afc742eb87ddd8eb7ef5
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.21.0-beta.0/kubernetes-client-linux-amd64.tar.gz) | c025f5e5bd132355e7dd1296cf2ec752264e7f754c4d95fc34b076bd75bef2f571d30872bcb3d138ce95c592111353d275a80eb31f82c07000874b4c56282dbd
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.21.0-beta.0/kubernetes-client-linux-arm.tar.gz) | 9975cd2f08fbc202575fb15ba6fc51dab23155ca4d294ebb48516a81efa51f58bab3a87d41c865103756189b554c020371d729ad42880ba788f25047ffc46910
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.21.0-beta.0/kubernetes-client-linux-arm64.tar.gz) | 56a6836e24471e42e9d9a8488453f2d55598d70c8aca0a307d5116139c930c25c469fd0d1ab5060fbe88dad75a9b5209a08dc11d644af5f3ebebfbcb6c16266c
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.21.0-beta.0/kubernetes-client-linux-ppc64le.tar.gz) | b6a6cc9baad0ad85ed079ee80e6d6acc905095cfb440998bbc0f553b94fa80077bd58b8692754de477517663d51161705e6e89a1b6d04aa74819800db3517722
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.21.0-beta.0/kubernetes-client-linux-s390x.tar.gz) | 7b743481b340f510bf9ae28ea8ea91150aa1e8c37fe104b66d7b3aff62f5e6db3c590d2c13d14dbb5c928de31c7613372def2496075853611d10d6b5fa5b60bd
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.21.0-beta.0/kubernetes-client-windows-386.tar.gz) | df06c7a524ce84c1f8d7836aa960c550c88dbca0ec4854df4dd0a85b3c84b8ecbc41b54e8c4669ce28ac670659ff0fad795deb1bc539f3c3b3aa885381265f5a
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.21.0-beta.0/kubernetes-client-windows-amd64.tar.gz) | 4568497b684564f2a94fbea6cbfd778b891231470d9a6956c3b7a3268643d13b855c0fc5ebea5f769300cc0c7719c2c331c387f468816f182f63e515adeaa7a0

### Server binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.21.0-beta.0/kubernetes-server-linux-amd64.tar.gz) | 42883cca2d312153baf693fc6024a295359a421e74fd70eefc927413be4e0353debe634e7cca6b9a8f7d8a0cee3717e03ba5d29a306e93139b1c2f3027535a6d
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.21.0-beta.0/kubernetes-server-linux-arm.tar.gz) | e0042215e84c769ba4fc4d159ccf67b2c4a26206bfffb0ec5152723dc813ff9c1426aa0e9b963d7bfa2efb266ca43561b596b459152882ebb42102ccf60bd8eb
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.21.0-beta.0/kubernetes-server-linux-arm64.tar.gz) | bfad29d43e14152cb9bc7c4df6aa77929c6eca64a294bb832215bdba9fa0ee2195a2b709c0267dc7426bb371b547ee80bb8461a8c678c9bffa0819aa7db96289
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.21.0-beta.0/kubernetes-server-linux-ppc64le.tar.gz) | ca67674c01c6cebdc8160c85b449eab1a23bb0557418665246e0208543fa2eaaf97679685c7b49bee3a4300904c0399c3d762ae34dc3e279fd69ce792c4b07ff
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.21.0-beta.0/kubernetes-server-linux-s390x.tar.gz) | 285352b628ec754b01b8ad4ef1427223a142d58ebcb46f6861df14d68643133b32330460b213b1ba5bc5362ff2b6dacd8e0c2d20cce6e760fa1954af8a60df8b

### Node binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.21.0-beta.0/kubernetes-node-linux-amd64.tar.gz) | d92d9b30e7e44134a0cd9db4c01924d365991ea16b3131200b02a82cff89c8701f618cd90e7f1c65427bd4bb5f78b10d540b2262de2c143b401fa44e5b25627b
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.21.0-beta.0/kubernetes-node-linux-arm.tar.gz) | 551092f23c27fdea4bb2d0547f6075892534892a96fc2be7786f82b58c93bffdb5e1c20f8f11beb8bed46c24f36d4c18ec5ac9755435489efa28e6ae775739bd
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.21.0-beta.0/kubernetes-node-linux-arm64.tar.gz) | 26ae7f4163e527349b8818ee38b9ee062314ab417f307afa49c146df8f5a2bd689509b128bd4a1efd3896fd89571149a9955ada91f8ca0c2f599cd863d613c86
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.21.0-beta.0/kubernetes-node-linux-ppc64le.tar.gz) | 821fa953f6cebc69d2d481e489f3e90899813d20e2eefbabbcadd019d004108e7540f741fabe60e8e7c6adbb1053ac97898bbdddec3ca19f34a71aa3312e0d4e
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.21.0-beta.0/kubernetes-node-linux-s390x.tar.gz) | 22197d4f66205d5aa9de83dfddcc4f2bb3195fd7067cdb5c21e61dbeae217bc112fb7ecff8a539579b60ad92298c2b4c87b9b7c7e6ec1ee1ffa0c6e4bc4412c1
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.21.0-beta.0/kubernetes-node-windows-amd64.tar.gz) | 7e22e0d9603562a04dee16a513579f06b1ff6354d97d669bd68f8777ec7f89f6ef027fb23ab0445d7bba0bb689352f0cc748ce90e3f597c6ebe495464a96b860

## Changelog since v1.21.0-alpha.3

## Urgent Upgrade Notes

### (No, really, you MUST read this before you upgrade)

 - The metric `storage_operation_errors_total` is not removed, but is marked deprecated, and the metric `storage_operation_status_count` is marked deprecated. In both cases the storage_operation_duration_seconds metric can be used to recover equivalent counts (using `status=fail-unknown` in the case of `storage_operations_errors_total`). ([#99045](https://github.com/kubernetes/kubernetes/pull/99045), [@mattcary](https://github.com/mattcary)) [SIG Instrumentation and Storage]
 
## Changes by Kind

### Deprecation

- The `batch/v2alpha1` CronJob type definitions and clients are deprecated and removed. ([#96987](https://github.com/kubernetes/kubernetes/pull/96987), [@soltysh](https://github.com/soltysh)) [SIG API Machinery, Apps, CLI and Testing]

### API Change

- Cluster admins can now turn off /debug/pprof and /debug/flags/v endpoint in kubelet by setting enableProfilingHandler and enableDebugFlagsHandler to false in their kubelet configuration file. enableProfilingHandler and enableDebugFlagsHandler can be set to true only when enableDebuggingHandlers is also set to true. ([#98458](https://github.com/kubernetes/kubernetes/pull/98458), [@SaranBalaji90](https://github.com/SaranBalaji90)) [SIG Node]
- The BoundServiceAccountTokenVolume feature has been promoted to beta, and enabled by default.
  - This changes the tokens provided to containers at `/var/run/secrets/kubernetes.io/serviceaccount/token` to be time-limited, auto-refreshed, and invalidated when the containing pod is deleted.
  - Clients should reload the token from disk periodically (once per minute is recommended) to ensure they continue to use a valid token. `k8s.io/client-go` version v11.0.0+ and v0.15.0+ reload tokens automatically.
  - By default, injected tokens are given an extended lifetime so they remain valid even after a new refreshed token is provided. The metric `serviceaccount_stale_tokens_total` can be used to monitor for workloads that are depending on the extended lifetime and are continuing to use tokens even after a refreshed token is provided to the container. If that metric indicates no existing workloads are depending on extended lifetimes, injected token lifetime can be shortened to 1 hour by starting `kube-apiserver` with `--service-account-extend-token-expiration=false`. ([#95667](https://github.com/kubernetes/kubernetes/pull/95667), [@zshihang](https://github.com/zshihang)) [SIG API Machinery, Auth, Cluster Lifecycle and Testing]

### Feature

- A new histogram metric to track the time it took to delete a job by the ttl-after-finished controller ([#98676](https://github.com/kubernetes/kubernetes/pull/98676), [@ahg-g](https://github.com/ahg-g)) [SIG Apps and Instrumentation]
- AWS cloudprovider supports auto-discovering subnets without any kubernetes.io/cluster/<clusterName> tags. It also supports additional service annotation service.beta.kubernetes.io/aws-load-balancer-subnets to manually configure the subnets. ([#97431](https://github.com/kubernetes/kubernetes/pull/97431), [@kishorj](https://github.com/kishorj)) [SIG Cloud Provider]
- Add --permit-address-sharing flag to kube-apiserver to listen with SO_REUSEADDR. While allowing to listen on wildcard IPs like 0.0.0.0 and specific IPs in parallel, it avoid waiting for the kernel to release socket in TIME_WAIT state, and hence, considably reducing kube-apiserver restart times under certain conditions. ([#93861](https://github.com/kubernetes/kubernetes/pull/93861), [@sttts](https://github.com/sttts)) [SIG API Machinery]
- Add `csi_operations_seconds` metric on kubelet that exposes CSI operations duration and status for node CSI operations. ([#98979](https://github.com/kubernetes/kubernetes/pull/98979), [@Jiawei0227](https://github.com/Jiawei0227)) [SIG Instrumentation and Storage]
- Add `migrated` field into `storage_operation_duration_seconds` metric ([#99050](https://github.com/kubernetes/kubernetes/pull/99050), [@Jiawei0227](https://github.com/Jiawei0227)) [SIG Apps, Instrumentation and Storage]
- Add bash-completion for comma separated list on `kubectl get` ([#98301](https://github.com/kubernetes/kubernetes/pull/98301), [@phil9909](https://github.com/phil9909)) [SIG CLI]
- Added support for installing arm64 node artifacts. ([#99242](https://github.com/kubernetes/kubernetes/pull/99242), [@liu-cong](https://github.com/liu-cong)) [SIG Cloud Provider]
- Feature gate RootCAConfigMap is graduated to GA in 1.21 and will be removed in 1.22. ([#98033](https://github.com/kubernetes/kubernetes/pull/98033), [@zshihang](https://github.com/zshihang)) [SIG API Machinery and Auth]
- Kubeadm: during "init" and "join" perform preflight validation on the host / node name and throw warnings if a name is not compliant ([#99194](https://github.com/kubernetes/kubernetes/pull/99194), [@pacoxu](https://github.com/pacoxu)) [SIG Cluster Lifecycle]
- Kubectl: `kubectl get` will omit managed fields by default now. Users could set `--show-managed-fields` to true to show managedFields when the output format is either `json` or `yaml`. ([#96878](https://github.com/kubernetes/kubernetes/pull/96878), [@knight42](https://github.com/knight42)) [SIG CLI and Testing]
- Metrics can now be disabled explicitly via a command line flag (i.e. '--disabled-metrics=bad_metric1,bad_metric2') ([#99217](https://github.com/kubernetes/kubernetes/pull/99217), [@logicalhan](https://github.com/logicalhan)) [SIG API Machinery, Cluster Lifecycle and Instrumentation]
- TTLAfterFinished is now beta and enabled by default ([#98678](https://github.com/kubernetes/kubernetes/pull/98678), [@ahg-g](https://github.com/ahg-g)) [SIG Apps and Auth]
- The `RunAsGroup` feature has been promoted to GA in this release. ([#94641](https://github.com/kubernetes/kubernetes/pull/94641), [@krmayankk](https://github.com/krmayankk)) [SIG Auth and Node]
- Turn CronJobControllerV2 on by default. ([#98878](https://github.com/kubernetes/kubernetes/pull/98878), [@soltysh](https://github.com/soltysh)) [SIG Apps]
- UDP protocol support for Agnhost connect subcommand ([#98639](https://github.com/kubernetes/kubernetes/pull/98639), [@knabben](https://github.com/knabben)) [SIG Testing]
- Upgrades `IPv6Dualstack` to `Beta` and turns it on by default. Clusters new and existing will not be affected until user starting adding secondary pod and service cidrs cli flags as described here: https://github.com/kubernetes/enhancements/tree/master/keps/sig-network/563-dual-stack ([#98969](https://github.com/kubernetes/kubernetes/pull/98969), [@khenidak](https://github.com/khenidak)) [SIG API Machinery, Apps, Cloud Provider, Network and Node]

### Documentation

- Fix ALPHA stability level reference link ([#98641](https://github.com/kubernetes/kubernetes/pull/98641), [@Jeffwan](https://github.com/Jeffwan)) [SIG Auth, Cloud Provider, Instrumentation and Storage]

### Failing Test

- Escape the special characters like `[`, `]` and ` ` that exist in vsphere windows path ([#98830](https://github.com/kubernetes/kubernetes/pull/98830), [@liyanhui1228](https://github.com/liyanhui1228)) [SIG Storage and Windows]
- Kube-proxy: fix a bug on UDP NodePort Services where stale conntrack entries may blackhole the traffic directed to the NodePort. ([#98305](https://github.com/kubernetes/kubernetes/pull/98305), [@aojea](https://github.com/aojea)) [SIG Network]

### Bug or Regression

- Add missing --kube-api-content-type in kubemark hollow template ([#98911](https://github.com/kubernetes/kubernetes/pull/98911), [@Jeffwan](https://github.com/Jeffwan)) [SIG Scalability and Testing]
- Avoid duplicate error messages when runing kubectl edit quota ([#98201](https://github.com/kubernetes/kubernetes/pull/98201), [@pacoxu](https://github.com/pacoxu)) [SIG API Machinery and Apps]
- Cleanup subnet in frontend IP configs to prevent huge subnet request bodies in some scenarios. ([#98133](https://github.com/kubernetes/kubernetes/pull/98133), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]
- Fix errors when accessing Windows container stats for Dockershim ([#98510](https://github.com/kubernetes/kubernetes/pull/98510), [@jsturtevant](https://github.com/jsturtevant)) [SIG Node and Windows]
- Fixes spurious errors about IPv6 in kube-proxy logs on nodes with IPv6 disabled. ([#99127](https://github.com/kubernetes/kubernetes/pull/99127), [@danwinship](https://github.com/danwinship)) [SIG Network and Node]
- In the method that ensures that the docker and containerd are in the correct containers with the proper OOM score set up, fixed the bug of identifying containerd process. ([#97888](https://github.com/kubernetes/kubernetes/pull/97888), [@pacoxu](https://github.com/pacoxu)) [SIG Node]
- Kubelet now cleans up orphaned volume directories automatically ([#95301](https://github.com/kubernetes/kubernetes/pull/95301), [@lorenz](https://github.com/lorenz)) [SIG Node and Storage]
- When dynamically provisioning Azure File volumes for a premium account, the requested size will be set to 100GB if the request is initially lower than this value to accommodate Azure File requirements. ([#99122](https://github.com/kubernetes/kubernetes/pull/99122), [@huffmanca](https://github.com/huffmanca)) [SIG Cloud Provider and Storage]

### Other (Cleanup or Flake)

- APIs for kubelet annotations and labels from k8s.io/kubernetes/pkg/kubelet/apis are now available under k8s.io/kubelet/pkg/apis/ ([#98931](https://github.com/kubernetes/kubernetes/pull/98931), [@michaelbeaumont](https://github.com/michaelbeaumont)) [SIG Apps, Auth and Node]
- Migrate `pkg/kubelet/(pod, pleg)` to structured logging ([#98990](https://github.com/kubernetes/kubernetes/pull/98990), [@gjkim42](https://github.com/gjkim42)) [SIG Instrumentation and Node]
- Migrate pkg/kubelet/nodestatus to structured logging ([#99001](https://github.com/kubernetes/kubernetes/pull/99001), [@QiWang19](https://github.com/QiWang19)) [SIG Node]
- Migrate pkg/kubelet/server logs to structured logging ([#98643](https://github.com/kubernetes/kubernetes/pull/98643), [@chenyw1990](https://github.com/chenyw1990)) [SIG Node]
- Migrate proxy/winkernel/proxier.go logs to structured logging ([#98001](https://github.com/kubernetes/kubernetes/pull/98001), [@JornShen](https://github.com/JornShen)) [SIG Network and Windows]
- Migrate scheduling_queue.go to structured logging ([#98358](https://github.com/kubernetes/kubernetes/pull/98358), [@tanjing2020](https://github.com/tanjing2020)) [SIG Scheduling]
- Several flags related to the deprecated dockershim which are present in the kubelet command line are now deprecated. ([#98730](https://github.com/kubernetes/kubernetes/pull/98730), [@dims](https://github.com/dims)) [SIG Node]
- The deprecated feature gates `CSIDriverRegistry`, `BlockVolume` and `CSIBlockVolume` are now unconditionally enabled and can no longer be specified in component invocations. ([#98021](https://github.com/kubernetes/kubernetes/pull/98021), [@gavinfish](https://github.com/gavinfish)) [SIG Storage]

## Dependencies

### Added
_Nothing has changed._

### Changed
- sigs.k8s.io/structured-merge-diff/v4: v4.0.2 → v4.0.3

### Removed
_Nothing has changed._



# v1.21.0-alpha.3


## Downloads for v1.21.0-alpha.3

### Source Code

filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.21.0-alpha.3/kubernetes.tar.gz) | 704ec916a1dbd134c54184d2652671f80ae09274f9d23dbbed312944ebeccbc173e2e6b6949b38bdbbfdaf8aa032844deead5efeda1b3150f9751386d9184bc8
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.21.0-alpha.3/kubernetes-src.tar.gz) | 57db9e7560cfc9c10e7059cb5faf9c4bd5eb8f9b7964f44f000a417021cf80873184b774e7c66c80d4aba84c14080c6bc335618db3d2e5f276436ae065e25408

### Client binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.3/kubernetes-client-darwin-amd64.tar.gz) | e2706efda92d5cf4f8b69503bb2f7703a8754407eff7f199bb77847838070e720e5f572126c14daa4c0c03b59bb1a63c1dfdeb6e936a40eff1d5497e871e3409
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.21.0-alpha.3/kubernetes-client-linux-386.tar.gz) | 007bb23c576356ed0890bdfd25a0f98d552599e0ffec19fb982591183c7c1f216d8a3ffa3abf15216be12ae5c4b91fdcd48a7306a2d26b007b86a6abd553fc61
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.3/kubernetes-client-linux-amd64.tar.gz) | 39504b0c610348beba60e8866fff265bad58034f74504951cd894c151a248db718d10f77ebc83f2c38b2d517f8513a46325b38889eefa261ca6dbffeceba50ff
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.21.0-alpha.3/kubernetes-client-linux-arm.tar.gz) | 30bc2c40d0c759365422ad1651a6fb35909be771f463c5b971caf401f9209525d05256ab70c807e88628dd357c2896745eecf13eda0b748464da97d0a5ef2066
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.3/kubernetes-client-linux-arm64.tar.gz) | 085cdf574dc8fd33ece667130b8c45830b522a07860e03a2384283b1adea73a9652ef3dfaa566e69ee00aea1a6461608814b3ce7a3f703e4a934304f7ae12f97
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.21.0-alpha.3/kubernetes-client-linux-ppc64le.tar.gz) | b34b845037d83ea7b3e2d80a9ede4f889b71b17b93b1445f0d936a36e98c13ed6ada125630a68d9243a5fcd311ee37cdcc0c05da484da8488ea5060bc529dbfc
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.21.0-alpha.3/kubernetes-client-linux-s390x.tar.gz) | c4758adc7a404b776556efaa79655db2a70777c562145d6ea6887f3335988367a0c2fcd4383e469340f2a768b22e786951de212805ca1cb91104d41c21e0c9ce
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.21.0-alpha.3/kubernetes-client-windows-386.tar.gz) | f51edc79702bbd1d9cb3a672852a405e11b20feeab64c5411a7e85c9af304960663eb6b23ef96e0f8c44a722fecf58cb6d700ea2c42c05b3269d8efd5ad803f2
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.3/kubernetes-client-windows-amd64.tar.gz) | 6a3507ce4ac40a0dc7e4720538863fa15f8faf025085a032f34b8fa0f6fa4e8c26849baf649b5b32829b9182e04f82721b13950d31cf218c35be6bf1c05d6abf

### Server binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.3/kubernetes-server-linux-amd64.tar.gz) | 19181d162dfb0b30236e2bf1111000e037eece87c037ca2b24622ca94cb88db86aa4da4ca533522518b209bc9983bbfd6b880a7898e0da96b33f3f6c4690539b
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.21.0-alpha.3/kubernetes-server-linux-arm.tar.gz) | 42a02f9e08a78ad5da6e5fa1ab12bf1e3c967c472fdbdadbd8746586da74dc8093682ba8513ff2a5301393c47ee9021b860e88ada56b13da386ef485708e46ca
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.3/kubernetes-server-linux-arm64.tar.gz) | 3c8ba8eb02f70061689bd7fab7813542005efe2edc6cfc6b7aecd03ffedf0b81819ad91d69fff588e83023d595eefbfe636aa55e1856add8733bf42fff3c748f
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.21.0-alpha.3/kubernetes-server-linux-ppc64le.tar.gz) | cd9e6537450411c39a06fd0b5819db3d16b668d403fb3627ec32c0e32dd1c4860e942934578ca0e1d1b8e6f21f450ff81e37e0cd46ff5c5faf7847ab074aefc5
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.21.0-alpha.3/kubernetes-server-linux-s390x.tar.gz) | ada3f65e53bc0e0c0229694dd48c425388089d6d77111a62476d1b08f6ad1d8ab3d60b9ed7d95ac1b42c2c6be8dc0618f40679717160769743c43583d8452362

### Node binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.3/kubernetes-node-linux-amd64.tar.gz) | ae0fec6aa59e49624b55d9a11c12fdf717ddfe04bdfd4f69965d03004a34e52ee4a3e83f7b61d0c6a86f43b72c99f3decb195b39ae529ef30526d18ec5f58f83
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.21.0-alpha.3/kubernetes-node-linux-arm.tar.gz) | 9a48c140ab53b7ed8ecec6903988a1a474efc16d2538e5974bc9a12f0c9190be78c4f9e326bf4e982d0b7045a80b99dd0fda7e9b650663be5b89bfd991596746
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.3/kubernetes-node-linux-arm64.tar.gz) | 6912adbc9300344bea470d6435f7b387bfce59767078c11728ce59faf47cd3f72b41b9604fcc5cda45e9816fe939fbe2fb33e52a773e6ff2dfa9a615b4df6141
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.21.0-alpha.3/kubernetes-node-linux-ppc64le.tar.gz) | d66dccfe3e6ed6d81567c70703f15375a53992b3a5e2814b98c32e581b861ad95912e03ed2562415d087624c008038bb4a816611fa255442ae752968ea15856b
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.21.0-alpha.3/kubernetes-node-linux-s390x.tar.gz) | ad8c69a28f1fbafa3f1cb54909bfd3fc22b104bed63d7ca2b296208c9d43eb5f2943a0ff267da4c185186cdd9f7f77b315cd7f5f1bf9858c0bf42eceb9ac3c58
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.3/kubernetes-node-windows-amd64.tar.gz) | 91d723aa848a9cb028f5bcb41090ca346fb973961521d025c4399164de2c8029b57ca2c4daca560d3c782c05265d2eb0edb0abcce6f23d3efbecf2316a54d650

## Changelog since v1.21.0-alpha.2

## Urgent Upgrade Notes

### (No, really, you MUST read this before you upgrade)

 - Newly provisioned PVs by gce-pd will no longer have the beta FailureDomain label. gce-pd volume plugin will start to have GA topology label instead. ([#98700](https://github.com/kubernetes/kubernetes/pull/98700), [@Jiawei0227](https://github.com/Jiawei0227)) [SIG Cloud Provider, Storage and Testing]
  - Remove alpha CSIMigrationXXComplete flag and add alpha InTreePluginXXUnregister flag. Deprecate CSIMigrationvSphereComplete flag and it will be removed in 1.22. ([#98243](https://github.com/kubernetes/kubernetes/pull/98243), [@Jiawei0227](https://github.com/Jiawei0227)) [SIG Node and Storage]
 
## Changes by Kind

### API Change

- Adds support for portRange / EndPort in Network Policy ([#97058](https://github.com/kubernetes/kubernetes/pull/97058), [@rikatz](https://github.com/rikatz)) [SIG Apps and Network]
- Fixes using server-side apply with APIService resources ([#98576](https://github.com/kubernetes/kubernetes/pull/98576), [@kevindelgado](https://github.com/kevindelgado)) [SIG API Machinery, Apps and Testing]
- Kubernetes is now built using go1.15.7 ([#98363](https://github.com/kubernetes/kubernetes/pull/98363), [@cpanato](https://github.com/cpanato)) [SIG Cloud Provider, Instrumentation, Node, Release and Testing]
- Scheduler extender filter interface now can report unresolvable failed nodes in the new field `FailedAndUnresolvableNodes` of  `ExtenderFilterResult` struct. Nodes in this map will be skipped in the preemption phase. ([#92866](https://github.com/kubernetes/kubernetes/pull/92866), [@cofyc](https://github.com/cofyc)) [SIG Scheduling]

### Feature

- A lease can only attach up to 10k objects. ([#98257](https://github.com/kubernetes/kubernetes/pull/98257), [@lingsamuel](https://github.com/lingsamuel)) [SIG API Machinery]
- Add ignore-errors flag for drain, support none-break drain in group ([#98203](https://github.com/kubernetes/kubernetes/pull/98203), [@yuzhiquan](https://github.com/yuzhiquan)) [SIG CLI]
- Base-images: Update to debian-iptables:buster-v1.4.0
  - Uses iptables 1.8.5
  - base-images: Update to debian-base:buster-v1.3.0
  - cluster/images/etcd: Build etcd:3.4.13-2 image
    - Uses debian-base:buster-v1.3.0 ([#98401](https://github.com/kubernetes/kubernetes/pull/98401), [@pacoxu](https://github.com/pacoxu)) [SIG Testing]
- Export NewDebuggingRoundTripper function and DebugLevel options in the k8s.io/client-go/transport package. ([#98324](https://github.com/kubernetes/kubernetes/pull/98324), [@atosatto](https://github.com/atosatto)) [SIG API Machinery]
- Kubectl wait ensures that observedGeneration >= generation if applicable ([#97408](https://github.com/kubernetes/kubernetes/pull/97408), [@KnicKnic](https://github.com/KnicKnic)) [SIG CLI]
- Kubernetes is now built using go1.15.8 ([#98834](https://github.com/kubernetes/kubernetes/pull/98834), [@cpanato](https://github.com/cpanato)) [SIG Cloud Provider, Instrumentation, Release and Testing]
- New admission controller "denyserviceexternalips" is available.  Clusters which do not *need- the Service "externalIPs" feature should enable this controller and be more secure. ([#97395](https://github.com/kubernetes/kubernetes/pull/97395), [@thockin](https://github.com/thockin)) [SIG API Machinery]
- Overall, enable the feature of `PreferNominatedNode` will  improve the performance of scheduling where preemption might frequently happen, but in theory, enable the feature of `PreferNominatedNode`, the pod might not be scheduled to the best candidate node in the cluster. ([#93179](https://github.com/kubernetes/kubernetes/pull/93179), [@chendave](https://github.com/chendave)) [SIG Scheduling and Testing]
- Pause image upgraded to 3.4.1 in kubelet and kubeadm for both Linux and Windows. ([#98205](https://github.com/kubernetes/kubernetes/pull/98205), [@pacoxu](https://github.com/pacoxu)) [SIG CLI, Cloud Provider, Cluster Lifecycle, Node, Testing and Windows]
- The `ServiceAccountIssuerDiscovery` feature has graduated to GA, and is unconditionally enabled. The `ServiceAccountIssuerDiscovery` feature-gate will be removed in 1.22. ([#98553](https://github.com/kubernetes/kubernetes/pull/98553), [@mtaufen](https://github.com/mtaufen)) [SIG API Machinery, Auth and Testing]

### Documentation

- Feat: azure file migration go beta in 1.21. Feature gates CSIMigration to Beta (on by default) and CSIMigrationAzureFile to Beta (off by default since it requires installation of the AzureFile CSI Driver)
  The in-tree AzureFile plugin "kubernetes.io/azure-file" is now deprecated and will be removed in 1.23. Users should enable CSIMigration + CSIMigrationAzureFile features and install the AzureFile CSI Driver (https://github.com/kubernetes-sigs/azurefile-csi-driver) to avoid disruption to existing Pod and PVC objects at that time.
  Users should start using the AzureFile CSI Driver directly for any new volumes. ([#96293](https://github.com/kubernetes/kubernetes/pull/96293), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider]

### Failing Test

- Kubelet: the HostPort implementation in dockershim was not taking into consideration the HostIP field, causing that the same HostPort can not be used with different IP addresses.
  This bug causes the conformance test "HostPort validates that there is no conflict between pods with same hostPort but different hostIP and protocol" to fail. ([#98755](https://github.com/kubernetes/kubernetes/pull/98755), [@aojea](https://github.com/aojea)) [SIG Cloud Provider, Network and Node]

### Bug or Regression

- Fix NPE in ephemeral storage eviction ([#98261](https://github.com/kubernetes/kubernetes/pull/98261), [@wzshiming](https://github.com/wzshiming)) [SIG Node]
- Fixed a bug that on k8s nodes, when the policy of INPUT chain in filter table is not ACCEPT, healthcheck nodeport would not work.
  Added iptables rules to allow healthcheck nodeport traffic. ([#97824](https://github.com/kubernetes/kubernetes/pull/97824), [@hanlins](https://github.com/hanlins)) [SIG Network]
- Fixed kube-proxy container image architecture for non amd64 images. ([#98526](https://github.com/kubernetes/kubernetes/pull/98526), [@saschagrunert](https://github.com/saschagrunert)) [SIG API Machinery, Release and Testing]
- Fixed provisioning of Cinder volumes migrated to CSI when StorageClass with AllowedTopologies was used. ([#98311](https://github.com/kubernetes/kubernetes/pull/98311), [@jsafrane](https://github.com/jsafrane)) [SIG Storage]
- Fixes a panic in the disruption budget controller for PDB objects with invalid selectors ([#98750](https://github.com/kubernetes/kubernetes/pull/98750), [@mortent](https://github.com/mortent)) [SIG Apps]
- Fixes connection errors when using `--volume-host-cidr-denylist` or `--volume-host-allow-local-loopback` ([#98436](https://github.com/kubernetes/kubernetes/pull/98436), [@liggitt](https://github.com/liggitt)) [SIG Network and Storage]
- If the user specifies an invalid timeout in the request URL, the request will be aborted with an HTTP 400.
  - in cases where the client specifies a timeout in the request URL, the overall request deadline is shortened now since the deadline is setup as soon as the request is received by the apiserver. ([#96901](https://github.com/kubernetes/kubernetes/pull/96901), [@tkashem](https://github.com/tkashem)) [SIG API Machinery and Testing]
- Kubeadm: Some text in the `kubeadm upgrade plan` output has changed. If you have scripts or other automation that parses this output, please review these changes and update your scripts to account for the new output. ([#98728](https://github.com/kubernetes/kubernetes/pull/98728), [@stmcginnis](https://github.com/stmcginnis)) [SIG Cluster Lifecycle]
- Kubeadm: fix a bug where external credentials in an existing admin.conf prevented the CA certificate to be written in the cluster-info ConfigMap. ([#98882](https://github.com/kubernetes/kubernetes/pull/98882), [@kvaps](https://github.com/kvaps)) [SIG Cluster Lifecycle]
- Kubeadm: fix bad token placeholder text in "config print *-defaults --help" ([#98839](https://github.com/kubernetes/kubernetes/pull/98839), [@Mattias-](https://github.com/Mattias-)) [SIG Cluster Lifecycle]
- Kubeadm: get k8s CI version markers from k8s infra bucket ([#98836](https://github.com/kubernetes/kubernetes/pull/98836), [@hasheddan](https://github.com/hasheddan)) [SIG Cluster Lifecycle and Release]
- Mitigate CVE-2020-8555 for kube-up using GCE by preventing local loopback folume hosts. ([#97934](https://github.com/kubernetes/kubernetes/pull/97934), [@mattcary](https://github.com/mattcary)) [SIG Cloud Provider and Storage]
- Remove CSI topology from migrated in-tree gcepd volume. ([#97823](https://github.com/kubernetes/kubernetes/pull/97823), [@Jiawei0227](https://github.com/Jiawei0227)) [SIG Cloud Provider and Storage]
- Sync node status during kubelet node shutdown.
  Adds an pod admission handler that rejects new pods when the node is in progress of shutting down. ([#98005](https://github.com/kubernetes/kubernetes/pull/98005), [@wzshiming](https://github.com/wzshiming)) [SIG Node]
- Truncates a message if it hits the NoteLengthLimit when the scheduler records an event for the pod that indicates the pod has failed to schedule. ([#98715](https://github.com/kubernetes/kubernetes/pull/98715), [@carlory](https://github.com/carlory)) [SIG Scheduling]
- We will no longer automatically delete all data when a failure is detected during creation of the volume data file on a CSI volume. Now we will only remove the data file and volume path. ([#96021](https://github.com/kubernetes/kubernetes/pull/96021), [@huffmanca](https://github.com/huffmanca)) [SIG Storage]

### Other (Cleanup or Flake)

- Fix the description of command line flags that can override --config ([#98254](https://github.com/kubernetes/kubernetes/pull/98254), [@changshuchao](https://github.com/changshuchao)) [SIG Scheduling]
- Migrate scheduler/taint_manager.go structured logging ([#98259](https://github.com/kubernetes/kubernetes/pull/98259), [@tanjing2020](https://github.com/tanjing2020)) [SIG Apps]
- Migrate staging/src/k8s.io/apiserver/pkg/admission logs to  structured logging ([#98138](https://github.com/kubernetes/kubernetes/pull/98138), [@lala123912](https://github.com/lala123912)) [SIG API Machinery]
- Resolves flakes in the Ingress conformance tests due to conflicts with controllers updating the Ingress object ([#98430](https://github.com/kubernetes/kubernetes/pull/98430), [@liggitt](https://github.com/liggitt)) [SIG Network and Testing]
- The default delegating authorization options now allow unauthenticated access to healthz, readyz, and livez.  A system:masters user connecting to an authz delegator will not perform an authz check. ([#98325](https://github.com/kubernetes/kubernetes/pull/98325), [@deads2k](https://github.com/deads2k)) [SIG API Machinery, Auth, Cloud Provider and Scheduling]
- The e2e suite can be instructed not to wait for pods in kube-system to be ready or for all nodes to be ready by passing `--allowed-not-ready-nodes=-1` when invoking the e2e.test program. This allows callers to run subsets of the e2e suite in scenarios other than perfectly healthy clusters. ([#98781](https://github.com/kubernetes/kubernetes/pull/98781), [@smarterclayton](https://github.com/smarterclayton)) [SIG Testing]
- The feature gates `WindowsGMSA` and `WindowsRunAsUserName` that are GA since v1.18 are now removed. ([#96531](https://github.com/kubernetes/kubernetes/pull/96531), [@ialidzhikov](https://github.com/ialidzhikov)) [SIG Node and Windows]
- The new `-gce-zones` flag on the `e2e.test` binary instructs tests that check for information about how the cluster interacts with the cloud to limit their queries to the provided zone list. If not specified, the current behavior of asking the cloud provider for all available zones in multi zone clusters is preserved. ([#98787](https://github.com/kubernetes/kubernetes/pull/98787), [@smarterclayton](https://github.com/smarterclayton)) [SIG API Machinery, Cluster Lifecycle and Testing]

## Dependencies

### Added
- github.com/moby/spdystream: [v0.2.0](https://github.com/moby/spdystream/tree/v0.2.0)

### Changed
- github.com/NYTimes/gziphandler: [56545f4 → v1.1.1](https://github.com/NYTimes/gziphandler/compare/56545f4...v1.1.1)
- github.com/container-storage-interface/spec: [v1.2.0 → v1.3.0](https://github.com/container-storage-interface/spec/compare/v1.2.0...v1.3.0)
- github.com/go-logr/logr: [v0.2.0 → v0.4.0](https://github.com/go-logr/logr/compare/v0.2.0...v0.4.0)
- github.com/gogo/protobuf: [v1.3.1 → v1.3.2](https://github.com/gogo/protobuf/compare/v1.3.1...v1.3.2)
- github.com/kisielk/errcheck: [v1.2.0 → v1.5.0](https://github.com/kisielk/errcheck/compare/v1.2.0...v1.5.0)
- github.com/yuin/goldmark: [v1.1.27 → v1.2.1](https://github.com/yuin/goldmark/compare/v1.1.27...v1.2.1)
- golang.org/x/sync: cd5d95a → 67f06af
- golang.org/x/tools: c1934b7 → 113979e
- k8s.io/klog/v2: v2.4.0 → v2.5.0
- sigs.k8s.io/apiserver-network-proxy/konnectivity-client: v0.0.14 → v0.0.15

### Removed
- github.com/docker/spdystream: [449fdfc](https://github.com/docker/spdystream/tree/449fdfc)



# v1.21.0-alpha.2


## Downloads for v1.21.0-alpha.2

### Source Code

filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.21.0-alpha.2/kubernetes.tar.gz) | 6836f6c8514253fe0831fd171fc4ed92eb6d9a773491c8dc82b90d171a1b10076bd6bfaea56ec1e199c5f46c273265bdb9f174f0b2d99c5af1de4c99b862329e
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.21.0-alpha.2/kubernetes-src.tar.gz) | d137694804741a05ab09e5f9a418448b66aba0146c028eafce61bcd9d7c276521e345ce9223ffbc703e8172041d58dfc56a3242a4df3686f24905a4541fcd306

### Client binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.2/kubernetes-client-darwin-amd64.tar.gz) | 9478b047a97717953f365c13a098feb7e3cb30a3df22e1b82aa945f2208dcc5cb90afc441ba059a3ae7aafb4ee000ec3a52dc65a8c043a5ac7255a391c875330
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.21.0-alpha.2/kubernetes-client-linux-386.tar.gz) | 44c8dd4b1ddfc256d35786c8abf45b0eb5f0794f5e310d2efc865748adddc50e8bf38aa71295ae8a82884cb65f2e0b9b0737b000f96fd8f2d5c19971d7c4d8e8
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.2/kubernetes-client-linux-amd64.tar.gz) | e1291989892769de6b978c17b8612b94da6f3b735a4d895100af622ca9ebb968c75548afea7ab00445869625dd0da3afec979e333afbb445805f5d31c1c13cc7
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.21.0-alpha.2/kubernetes-client-linux-arm.tar.gz) | 3c4bcb8cbe73822d68a2f62553a364e20bec56b638c71d0f58679b4f4b277d809142346f18506914e694f6122a3e0f767eab20b7b1c4dbb79e4c5089981ae0f1
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.2/kubernetes-client-linux-arm64.tar.gz) | 9389974a790268522e187f5ba5237f3ee4684118c7db76bc3d4164de71d8208702747ec333b204c7a78073ab42553cbbce13a1883fab4fec617e093b05fab332
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.21.0-alpha.2/kubernetes-client-linux-ppc64le.tar.gz) | 63399e53a083b5af3816c28ff162c9de6b64c75da4647f0d6bbaf97afdf896823cb1e556f2abac75c6516072293026d3ff9f30676fd75143ac6ca3f4d21f4327
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.21.0-alpha.2/kubernetes-client-linux-s390x.tar.gz) | 50898f197a9d923971ff9046c9f02779b57f7b3cea7da02f3ea9bab8c08d65a9c4a7531a2470fa14783460f52111a52b96ebf916c0a1d8215b4070e4e861c1b0
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.21.0-alpha.2/kubernetes-client-windows-386.tar.gz) | a7743e839e1aa19f5ee20b6ee5000ac8ef9e624ac5be63bb574fad6992e4b9167193ed07e03c9bc524e88bfeed66c95341a38a03bff1b10bc9910345f33019f0
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.2/kubernetes-client-windows-amd64.tar.gz) | 5f1d19c230bd3542866d16051808d184e9dd3e2f8c001ed4cee7b5df91f872380c2bf56a3add8c9413ead9d8c369efce2bcab4412174df9b823d3592677bf74e

### Server binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.2/kubernetes-server-linux-amd64.tar.gz) | ef2cac10febde231aeb6f131e589450c560eeaab8046b49504127a091cddc17bc518c2ad56894a6a033033ab6fc6e121b1cc23691683bc36f45fe6b1dd8e0510
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.21.0-alpha.2/kubernetes-server-linux-arm.tar.gz) | d11c9730307f08e80b2b8a7c64c3e9a9e43c622002e377dfe3a386f4541e24adc79a199a6f280f40298bb36793194fd44ed45defe8a3ee54a9cb1386bc26e905
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.2/kubernetes-server-linux-arm64.tar.gz) | 28f8c32bf98ee1add7edf5d341c3bac1afc0085f90dcbbfb8b27a92087f13e2b53c327c8935ee29bf1dc3160655b32bbe3e29d5741a8124a3848a777e7d42933
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.21.0-alpha.2/kubernetes-server-linux-ppc64le.tar.gz) | 99ae8d44b0de3518c27fa8bbddd2ecf053dfb789fb9d65f8a4ecf4c8331cf63d2f09a41c2bcd5573247d5f66a1b2e51944379df1715017d920d521b98589508a
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.21.0-alpha.2/kubernetes-server-linux-s390x.tar.gz) | f8c0e954a2dfc6845614488dadeed069cc7f3f08e33c351d7a77c6ef97867af590932e8576d12998a820a0e4d35d2eee797c764e2810f09ab1e90a5acaeaad33

### Node binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.2/kubernetes-node-linux-amd64.tar.gz) | c5456d50bfbe0d75fb150b3662ed7468a0abd3970792c447824f326894382c47bbd3a2cc5a290f691c8c09585ff6fe505ab86b4aff2b7e5ccee11b5e6354ae6c
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.21.0-alpha.2/kubernetes-node-linux-arm.tar.gz) | 335b5cd8672e053302fd94d932fb2fa2e48eeeb1799650b3f93acdfa635e03a8453637569ab710c46885c8317759f4c60aaaf24dca9817d9fa47500fe4a3ca53
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.2/kubernetes-node-linux-arm64.tar.gz) | 3ee87dbeed8ace9351ac89bdaf7274dd10b4faec3ceba0825f690ec7a2bb7eb7c634274a1065a0939eec8ff3e43f72385f058f4ec141841550109e775bc5eff9
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.21.0-alpha.2/kubernetes-node-linux-ppc64le.tar.gz) | 6956f965b8d719b164214ec9195fdb2c776b907fe6d2c524082f00c27872a73475927fd7d2a994045ce78f6ad2aa5aeaf1eb5514df1810d2cfe342fd4e5ce4a1
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.21.0-alpha.2/kubernetes-node-linux-s390x.tar.gz) | 3b643aa905c709c57083c28dd9e8ffd88cb64466cda1499da7fc54176b775003e08b9c7a07b0964064df67c8142f6f1e6c13bfc261bd65fb064049920bfa57d0
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.2/kubernetes-node-windows-amd64.tar.gz) | b2e6d6fb0091f2541f9925018c2bdbb0138a95bab06b4c6b38abf4b7144b2575422263b78fb3c6fd09e76d90a25a8d35a6d4720dc169794d42c95aa22ecc6d5f

## Changelog since v1.21.0-alpha.1

## Urgent Upgrade Notes

### (No, really, you MUST read this before you upgrade)

 - Remove storage metrics `storage_operation_errors_total`, since we already have `storage_operation_status_count`.And add new field `status` for `storage_operation_duration_seconds`, so that we can know about all status storage operation latency. ([#98332](https://github.com/kubernetes/kubernetes/pull/98332), [@JornShen](https://github.com/JornShen)) [SIG Instrumentation and Storage]
 
## Changes by Kind

### Deprecation

- Remove the TokenRequest and TokenRequestProjection feature gates ([#97148](https://github.com/kubernetes/kubernetes/pull/97148), [@wawa0210](https://github.com/wawa0210)) [SIG Node]
- Removing experimental windows container hyper-v support with Docker ([#97141](https://github.com/kubernetes/kubernetes/pull/97141), [@wawa0210](https://github.com/wawa0210)) [SIG Node and Windows]
- The `export` query parameter (inconsistently supported by API resources and deprecated in v1.14) is fully removed.  Requests setting this query parameter will now receive a 400 status response. ([#98312](https://github.com/kubernetes/kubernetes/pull/98312), [@deads2k](https://github.com/deads2k)) [SIG API Machinery, Auth and Testing]

### API Change

- Enable SPDY pings to keep connections alive, so that `kubectl exec` and `kubectl port-forward` won't be interrupted. ([#97083](https://github.com/kubernetes/kubernetes/pull/97083), [@knight42](https://github.com/knight42)) [SIG API Machinery and CLI]

### Documentation

- Official support to build kubernetes with docker-machine / remote docker is removed. This change does not affect building kubernetes with docker locally. ([#97935](https://github.com/kubernetes/kubernetes/pull/97935), [@adeniyistephen](https://github.com/adeniyistephen)) [SIG Release and Testing]
- Set kubelet option `--volume-stats-agg-period` to negative value to disable volume calculations. ([#96675](https://github.com/kubernetes/kubernetes/pull/96675), [@pacoxu](https://github.com/pacoxu)) [SIG Node]

### Bug or Regression

- Clean ReplicaSet by revision instead of creation timestamp in deployment controller ([#97407](https://github.com/kubernetes/kubernetes/pull/97407), [@waynepeking348](https://github.com/waynepeking348)) [SIG Apps]
- Ensure that client-go's EventBroadcaster is safe (non-racy) during shutdown. ([#95664](https://github.com/kubernetes/kubernetes/pull/95664), [@DirectXMan12](https://github.com/DirectXMan12)) [SIG API Machinery]
- Fix azure file migration issue ([#97877](https://github.com/kubernetes/kubernetes/pull/97877), [@andyzhangx](https://github.com/andyzhangx)) [SIG Auth, Cloud Provider and Storage]
- Fix kubelet from panic after getting the wrong signal ([#98200](https://github.com/kubernetes/kubernetes/pull/98200), [@wzshiming](https://github.com/wzshiming)) [SIG Node]
- Fix repeatedly acquire the inhibit lock ([#98088](https://github.com/kubernetes/kubernetes/pull/98088), [@wzshiming](https://github.com/wzshiming)) [SIG Node]
- Fixed a bug that the kubelet cannot start on BtrfS. ([#98042](https://github.com/kubernetes/kubernetes/pull/98042), [@gjkim42](https://github.com/gjkim42)) [SIG Node]
- Fixed an issue with garbage collection failing to clean up namespaced children of an object also referenced incorrectly by cluster-scoped children ([#98068](https://github.com/kubernetes/kubernetes/pull/98068), [@liggitt](https://github.com/liggitt)) [SIG API Machinery and Apps]
- Fixed no effect namespace when exposing deployment with --dry-run=client. ([#97492](https://github.com/kubernetes/kubernetes/pull/97492), [@masap](https://github.com/masap)) [SIG CLI]
- Fixing a bug where a failed node may not have the NoExecute taint set correctly ([#96876](https://github.com/kubernetes/kubernetes/pull/96876), [@howieyuen](https://github.com/howieyuen)) [SIG Apps and Node]
- Indentation of `Resource Quota` block in kubectl describe namespaces output gets correct. ([#97946](https://github.com/kubernetes/kubernetes/pull/97946), [@dty1er](https://github.com/dty1er)) [SIG CLI]
- KUBECTL_EXTERNAL_DIFF now accepts equal sign for additional parameters. ([#98158](https://github.com/kubernetes/kubernetes/pull/98158), [@dougsland](https://github.com/dougsland)) [SIG CLI]
- Kubeadm: fix a bug where "kubeadm join" would not properly handle missing names for existing etcd members. ([#97372](https://github.com/kubernetes/kubernetes/pull/97372), [@ihgann](https://github.com/ihgann)) [SIG Cluster Lifecycle]
- Kubelet should ignore cgroup driver check on Windows node. ([#97764](https://github.com/kubernetes/kubernetes/pull/97764), [@pacoxu](https://github.com/pacoxu)) [SIG Node and Windows]
- Make podTopologyHints protected by lock ([#95111](https://github.com/kubernetes/kubernetes/pull/95111), [@choury](https://github.com/choury)) [SIG Node]
- Readjust kubelet_containers_per_pod_count bucket ([#98169](https://github.com/kubernetes/kubernetes/pull/98169), [@wawa0210](https://github.com/wawa0210)) [SIG Instrumentation and Node]
- Scores from InterPodAffinity have stronger differentiation. ([#98096](https://github.com/kubernetes/kubernetes/pull/98096), [@leileiwan](https://github.com/leileiwan)) [SIG Scheduling]
- Specifying the KUBE_TEST_REPO environment variable when e2e tests are executed will instruct the test infrastructure to load that image from a location within the specified repo, using a predefined pattern. ([#93510](https://github.com/kubernetes/kubernetes/pull/93510), [@smarterclayton](https://github.com/smarterclayton)) [SIG Testing]
- Static pods will be deleted gracefully. ([#98103](https://github.com/kubernetes/kubernetes/pull/98103), [@gjkim42](https://github.com/gjkim42)) [SIG Node]
- Use network.Interface.VirtualMachine.ID to get the binded VM
  Skip standalone VM when reconciling LoadBalancer ([#97635](https://github.com/kubernetes/kubernetes/pull/97635), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]

### Other (Cleanup or Flake)

- Kubeadm: change the default image repository for CI images from 'gcr.io/kubernetes-ci-images' to 'gcr.io/k8s-staging-ci-images' ([#97087](https://github.com/kubernetes/kubernetes/pull/97087), [@SataQiu](https://github.com/SataQiu)) [SIG Cluster Lifecycle]
- Migrate generic_scheduler.go and types.go to structured logging. ([#98134](https://github.com/kubernetes/kubernetes/pull/98134), [@tanjing2020](https://github.com/tanjing2020)) [SIG Scheduling]
- Migrate proxy/winuserspace/proxier.go logs to structured logging ([#97941](https://github.com/kubernetes/kubernetes/pull/97941), [@JornShen](https://github.com/JornShen)) [SIG Network]
- Migrate staging/src/k8s.io/apiserver/pkg/audit/policy/reader.go logs to structured logging. ([#98252](https://github.com/kubernetes/kubernetes/pull/98252), [@lala123912](https://github.com/lala123912)) [SIG API Machinery and Auth]
- Migrate staging\src\k8s.io\apiserver\pkg\endpoints logs to  structured logging ([#98093](https://github.com/kubernetes/kubernetes/pull/98093), [@lala123912](https://github.com/lala123912)) [SIG API Machinery]
- Node ([#96552](https://github.com/kubernetes/kubernetes/pull/96552), [@pandaamanda](https://github.com/pandaamanda)) [SIG Apps, Cloud Provider, Node and Scheduling]
- The kubectl alpha debug command was scheduled to be removed in v1.21. ([#98111](https://github.com/kubernetes/kubernetes/pull/98111), [@pandaamanda](https://github.com/pandaamanda)) [SIG CLI]
- Update cri-tools to [v1.20.0](https://github.com/kubernetes-sigs/cri-tools/releases/tag/v1.20.0) ([#97967](https://github.com/kubernetes/kubernetes/pull/97967), [@rajibmitra](https://github.com/rajibmitra)) [SIG Cloud Provider]
- Windows nodes on GCE will take longer to start due to dependencies installed at node creation time. ([#98284](https://github.com/kubernetes/kubernetes/pull/98284), [@pjh](https://github.com/pjh)) [SIG Cloud Provider]

## Dependencies

### Added
_Nothing has changed._

### Changed
- github.com/google/cadvisor: [v0.38.6 → v0.38.7](https://github.com/google/cadvisor/compare/v0.38.6...v0.38.7)
- k8s.io/gengo: 83324d8 → b6c5ce2

### Removed
_Nothing has changed._



# v1.21.0-alpha.1


## Downloads for v1.21.0-alpha.1

### Source Code

filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.21.0-alpha.1/kubernetes.tar.gz) | b2bacd5c3fc9f829e6269b7d2006b0c6e464ff848bb0a2a8f2fe52ad2d7c4438f099bd8be847d8d49ac6e4087f4d74d5c3a967acd798e0b0cb4d7a2bdb122997
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.21.0-alpha.1/kubernetes-src.tar.gz) | 518ac5acbcf23902fb1b902b69dbf3e86deca5d8a9b5f57488a15f185176d5a109558f3e4df062366af874eca1bcd61751ee8098b0beb9bcdc025d9a1c9be693

### Client binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.1/kubernetes-client-darwin-amd64.tar.gz) | eaa7aea84a5ed954df5ec710cbeb6ec88b46465f43cb3d09aabe2f714b84a050a50bf5736089f09dbf1090f2e19b44823d656c917e3c8c877630756c3026f2b6
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.21.0-alpha.1/kubernetes-client-linux-386.tar.gz) | 47f74b8d46ad1779c5b0b5f15aa15d5513a504eeb6f53db4201fbe9ff8956cb986b7c1b0e9d50a99f78e9e2a7f304f3fc1cc2fa239296d9a0dd408eb6069e975
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.1/kubernetes-client-linux-amd64.tar.gz) | 1a148e282628b008c8abd03dd12ec177ced17584b5115d92cd33dd251e607097d42e9da8c7089bd947134b900f85eb75a4740b6a5dd580c105455b843559df39
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.21.0-alpha.1/kubernetes-client-linux-arm.tar.gz) | d13d2feb73bd032dc01f7e2955b98d8215a39fe1107d037a73fa1f7d06c3b93ebaa53ed4952d845c64454ef3cca533edb97132d234d50b6fb3bcbd8a8ad990eb
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.1/kubernetes-client-linux-arm64.tar.gz) | 8252105a17b09a78e9ad2c024e4e401a69764ac869708a071aaa06f81714c17b9e7c5b2eb8efde33f24d0b59f75c5da607d5e1e72bdf12adfbb8c829205cd1c1
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.21.0-alpha.1/kubernetes-client-linux-ppc64le.tar.gz) | 297a9082df4988389dc4be30eb636dff49f36f5d87047bab44745884e610f46a17ae3a08401e2cab155b7c439f38057bfd8288418215f7dd3bf6a49dbe61ea0e
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.21.0-alpha.1/kubernetes-client-linux-s390x.tar.gz) | 04c06490dd17cd5dccfd92bafa14acf64280ceaea370d9635f23aeb6984d1beae6d0d1d1506edc6f30f927deeb149b989d3e482b47fbe74008b371f629656e79
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.21.0-alpha.1/kubernetes-client-windows-386.tar.gz) | ec6e9e87a7d685f8751d7e58f24f417753cff5554a7229218cb3a08195d461b2e12409344950228e9fbbc92a8a06d35dd86242da6ff1e6652ec1fae0365a88c1
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.1/kubernetes-client-windows-amd64.tar.gz) | 51039e6221d3126b5d15e797002ae01d4f0b10789c5d2056532f27ef13f35c5a2e51be27764fda68e8303219963126559023aed9421313bec275c0827fbcaf8a

### Server binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.1/kubernetes-server-linux-amd64.tar.gz) | 4edf820930c88716263560275e3bd7fadb8dc3700b9f8e1d266562e356e0abeb1a913f536377dab91218e3940b447d6bf1da343b85da25c2256dc4dcde5798dd
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.21.0-alpha.1/kubernetes-server-linux-arm.tar.gz) | b15213e53a8ab4ba512ce6ef9ad42dd197d419c61615cd23de344227fd846c90448d8f3d98e555b63ba5b565afa627cca6b7e3990ebbbba359c96f2391302df1
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.1/kubernetes-server-linux-arm64.tar.gz) | 5be29cca9a9358fc68351ee63e99d57dc2ffce6e42fc3345753dbbf7542ff2d770c4852424158540435fa6e097ce3afa9b13affc40c8b3b69fe8406798f8068f
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.21.0-alpha.1/kubernetes-server-linux-ppc64le.tar.gz) | 89fd99ab9ce85db0b94b86709932105efc883cc93959cf7ea9a39e79a4acea23064d7010eeb577450cccabe521c04b7ba47bbec212ed37edeed7cb04bad34518
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.21.0-alpha.1/kubernetes-server-linux-s390x.tar.gz) | 2fbc30862c77d247aa8d96ab9d1a144599505287b0033a3a2d0988958e7bb2f2e8b67f52c1fec74b4ec47d74ba22cd0f6cb5c4228acbaa72b1678d5fece0254d

### Node binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.1/kubernetes-node-linux-amd64.tar.gz) | 95658d321a0a371c0900b401d1469d96915310afbc4e4b9b11f031438bb188513b57d5a60b5316c3b0c18f541cda6f0ac42f59a76495f8abc743a067115da23a
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.21.0-alpha.1/kubernetes-node-linux-arm.tar.gz) | f375acfb42aad6c65b833c270e7e3acfe9cd1d6b2441c33874e77faae263957f7acfe86f1b71f14298118595e4cc6952c7dea0c832f7f2e72428336f13034362
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.1/kubernetes-node-linux-arm64.tar.gz) | 43b4baccd58d74e7f48d096ab92f2bbbcdf47e30e7a3d2b56c6cc9f90002cfd4fefaac894f69bd5f9f4dbdb09a4749a77eb76b1b97d91746bd96fe94457879ab
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.21.0-alpha.1/kubernetes-node-linux-ppc64le.tar.gz) | e7962b522c6c7c14b9ee4c1d254d8bdd9846b2b33b0443fc9c4a41be6c40e5e6981798b720f0148f36263d5cc45d5a2bb1dd2f9ab2838e3d002e45b9bddeb7bf
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.21.0-alpha.1/kubernetes-node-linux-s390x.tar.gz) | 49ebc97f01829e65f7de15be00b882513c44782eaadd1b1825a227e3bd3c73cc6aca8345af05b303d8c43aa2cb944a069755b2709effb8cc22eae621d25d4ba5
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.21.0-alpha.1/kubernetes-node-windows-amd64.tar.gz) | 6e0fd7724b09e6befbcb53b33574e97f2db089f2eee4bbf391abb7f043103a5e6e32e3014c0531b88f9a3ca88887bbc68625752c44326f98dd53adb3a6d1bed8

## Changelog since v1.20.0

## Urgent Upgrade Notes

### (No, really, you MUST read this before you upgrade)

 - Kube-proxy's IPVS proxy mode no longer sets the net.ipv4.conf.all.route_localnet sysctl parameter. Nodes upgrading will have net.ipv4.conf.all.route_localnet set to 1 but new nodes will inherit the system default (usually 0). If you relied on any behavior requiring net.ipv4.conf.all.route_localnet, you must set ensure it is enabled as kube-proxy will no longer set it automatically. This change helps to further mitigate CVE-2020-8558. ([#92938](https://github.com/kubernetes/kubernetes/pull/92938), [@lbernail](https://github.com/lbernail)) [SIG Network and Release]
 
## Changes by Kind

### Deprecation

- Deprecate the `topologyKeys` field in Service. This capability will be replaced with upcoming work around Topology Aware Subsetting and Service Internal Traffic Policy. ([#96736](https://github.com/kubernetes/kubernetes/pull/96736), [@andrewsykim](https://github.com/andrewsykim)) [SIG Apps]
- Kubeadm: deprecated command "alpha selfhosting pivot" is removed now. ([#97627](https://github.com/kubernetes/kubernetes/pull/97627), [@knight42](https://github.com/knight42)) [SIG Cluster Lifecycle]
- Kubeadm: graduate the command `kubeadm alpha kubeconfig user` to `kubeadm kubeconfig user`. The `kubeadm alpha kubeconfig user` command is deprecated now. ([#97583](https://github.com/kubernetes/kubernetes/pull/97583), [@knight42](https://github.com/knight42)) [SIG Cluster Lifecycle]
- Kubeadm: the "kubeadm alpha certs" command is removed now, please use "kubeadm certs" instead. ([#97706](https://github.com/kubernetes/kubernetes/pull/97706), [@knight42](https://github.com/knight42)) [SIG Cluster Lifecycle]
- Remove the deprecated metrics "scheduling_algorithm_preemption_evaluation_seconds" and "binding_duration_seconds", suggest to use "scheduler_framework_extension_point_duration_seconds" instead. ([#96447](https://github.com/kubernetes/kubernetes/pull/96447), [@chendave](https://github.com/chendave)) [SIG Cluster Lifecycle, Instrumentation, Scheduling and Testing]
- The PodSecurityPolicy API is deprecated in 1.21, and will no longer be served starting in 1.25. ([#97171](https://github.com/kubernetes/kubernetes/pull/97171), [@deads2k](https://github.com/deads2k)) [SIG Auth and CLI]

### API Change

- Change the APIVersion proto name of BoundObjectRef from aPIVersion to apiVersion. ([#97379](https://github.com/kubernetes/kubernetes/pull/97379), [@kebe7jun](https://github.com/kebe7jun)) [SIG Auth]
- Promote Immutable Secrets/ConfigMaps feature to Stable.
  This allows to set `Immutable` field in Secrets or ConfigMap object to mark their contents as immutable. ([#97615](https://github.com/kubernetes/kubernetes/pull/97615), [@wojtek-t](https://github.com/wojtek-t)) [SIG Apps, Architecture, Node and Testing]

### Feature

- Add flag --lease-max-object-size and metric etcd_lease_object_counts for kube-apiserver to config and observe max objects attached to a single etcd lease. ([#97480](https://github.com/kubernetes/kubernetes/pull/97480), [@lingsamuel](https://github.com/lingsamuel)) [SIG API Machinery, Instrumentation and Scalability]
- Add flag --lease-reuse-duration-seconds for kube-apiserver to config etcd lease reuse duration. ([#97009](https://github.com/kubernetes/kubernetes/pull/97009), [@lingsamuel](https://github.com/lingsamuel)) [SIG API Machinery and Scalability]
- Adds the ability to pass --strict-transport-security-directives to the kube-apiserver to set the HSTS header appropriately.  Be sure you understand the consequences to browsers before setting this field. ([#96502](https://github.com/kubernetes/kubernetes/pull/96502), [@249043822](https://github.com/249043822)) [SIG Auth]
- Kubeadm now includes CoreDNS v1.8.0. ([#96429](https://github.com/kubernetes/kubernetes/pull/96429), [@rajansandeep](https://github.com/rajansandeep)) [SIG Cluster Lifecycle]
- Kubeadm: add support for certificate chain validation. When using kubeadm in external CA mode, this allows an intermediate CA to be used to sign the certificates. The intermediate CA certificate must be appended to each signed certificate for this to work correctly. ([#97266](https://github.com/kubernetes/kubernetes/pull/97266), [@robbiemcmichael](https://github.com/robbiemcmichael)) [SIG Cluster Lifecycle]
- Kubeadm: amend the node kernel validation to treat CGROUP_PIDS, FAIR_GROUP_SCHED as required and CFS_BANDWIDTH, CGROUP_HUGETLB as optional ([#96378](https://github.com/kubernetes/kubernetes/pull/96378), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle and Node]
- The Kubernetes pause image manifest list now contains an image for Windows Server 20H2. ([#97322](https://github.com/kubernetes/kubernetes/pull/97322), [@claudiubelu](https://github.com/claudiubelu)) [SIG Windows]
- The apimachinery util/net function used to detect the bind address `ResolveBindAddress()`
  takes into consideration global ip addresses on loopback interfaces when:
      - the host has default routes
      - there are no global IPs on those interfaces.
  in order to support more complex network scenarios like BGP Unnumbered RFC 5549 ([#95790](https://github.com/kubernetes/kubernetes/pull/95790), [@aojea](https://github.com/aojea)) [SIG Network]

### Bug or Regression

- ## Changelog
  
  ### General
  - Fix priority expander falling back to a random choice even though there is a higher priority option to choose
  - Clone `kubernetes/kubernetes` in `update-vendor.sh` shallowly, instead of fetching all revisions
  - Speed up binpacking by reducing the number of PreFilter calls (call once per pod instead of #pods*#nodes times)
  - Speed up finding unneeded nodes by 5x+ in very large clusters by reducing the number of PreFilter calls
  - Expose `--max-nodes-total` as a metric
  - Errors in `IncreaseSize` changed from type `apiError` to `cloudProviderError`
  - Make `build-in-docker` and `test-in-docker` work on Linux systems with SELinux enabled
  - Fix an error where existing nodes were not considered as destinations while finding place for pods in scale-down simulations
  - Remove redundant log lines and reduce severity around parsing kubeEnv
  - Don't treat nodes created by virtual kubelet as nodes from non-autoscaled node groups
  - Remove redundant logging around calculating node utilization
  - Add configurable `--network` and `--rm` flags for docker in `Makefile`
  - Subtract DaemonSet pods' requests from node allocatable in the denominator while computing node utilization
  - Include taints by condition when determining if a node is unready/still starting
  - Fix `update-vendor.sh` to work on OSX and zsh
  - Add best-effort eviction for DaemonSet pods while scaling down non-empty nodes
  - Add build support for ARM64
  
  ### AliCloud
  - Add missing daemonsets and replicasets to ALI example cluster role
  
  ### Apache CloudStack
  - Add support for Apache CloudStack
  
  ### AWS
  - Regenerate list of EC2 instances
  - Fix pricing endpoint in AWS China Region
  
  ### Azure
  - Add optional jitter on initial VMSS VM cache refresh, keep the refreshes spread over time
  - Serve from cache for the whole period of ongoing throttling
  - Fix unwanted VMSS VMs cache invalidations
  - Enforce setting the number of retries if cloud provider backoff is enabled
  - Don't update capacity if VMSS provisioning state is updating
  - Support allocatable resources overrides via VMSS tags
  - Add missing stable labels in template nodes
  - Proactively set instance status to deleting on node deletions
  
  ### Cluster API
  - Migrate interaction with the API from using internal types to using Unstructured
  - Improve tests to work better with constrained resources
  - Add support for node autodiscovery
  - Add support for `--cloud-config`
  - Update group identifier to use for Cluster API annotations
  
  ### Exoscale
  - Add support for Exoscale
  
  ### GCE
  - Decrease the number of GCE Read Requests made while deleting nodes
  - Base pricing of custom instances on their instance family type
  - Add pricing information for missing machine types
  - Add pricing information for different GPU types
  - Ignore the new `topology.gke.io/zone` label when comparing groups
  - Add missing stable labels to template nodes
  
  ### HuaweiCloud
  - Add auto scaling group support
  - Implement node group by AS
  - Implement getting desired instance number of node group
  - Implement increasing node group size
  - Implement TemplateNodeInfo
  - Implement caching instances
  
  ### IONOS
  - Add support for IONOS
  
  ### Kubemark
  - Skip non-kubemark nodes while computing node infos for node groups.
  
  ### Magnum
  - Add Magnum support in the Cluster Autoscaler helm chart
  
  ### Packet
  - Allow empty nodepools
  - Add support for multiple nodepools
  - Add pricing support
  
  ## Image
  Image: `k8s.gcr.io/autoscaling/cluster-autoscaler:v1.20.0` ([#97011](https://github.com/kubernetes/kubernetes/pull/97011), [@towca](https://github.com/towca)) [SIG Cloud Provider]
- AcceleratorStats will be available in the Summary API of kubelet when cri_stats_provider is used. ([#96873](https://github.com/kubernetes/kubernetes/pull/96873), [@ruiwen-zhao](https://github.com/ruiwen-zhao)) [SIG Node]
- Add limited lines to log when having tail option ([#93920](https://github.com/kubernetes/kubernetes/pull/93920), [@zhouya0](https://github.com/zhouya0)) [SIG Node]
- Avoid systemd-logind loading configuration warning ([#97950](https://github.com/kubernetes/kubernetes/pull/97950), [@wzshiming](https://github.com/wzshiming)) [SIG Node]
- Cloud-controller-manager: routes controller should not depend on --allocate-node-cidrs ([#97029](https://github.com/kubernetes/kubernetes/pull/97029), [@andrewsykim](https://github.com/andrewsykim)) [SIG Cloud Provider and Testing]
- Copy annotations with empty value when deployment rolls back ([#94858](https://github.com/kubernetes/kubernetes/pull/94858), [@waynepeking348](https://github.com/waynepeking348)) [SIG Apps]
- Detach volumes from vSphere nodes not tracked by attach-detach controller ([#96689](https://github.com/kubernetes/kubernetes/pull/96689), [@gnufied](https://github.com/gnufied)) [SIG Cloud Provider and Storage]
- Fix kubectl label error when local=true is set. ([#97440](https://github.com/kubernetes/kubernetes/pull/97440), [@pandaamanda](https://github.com/pandaamanda)) [SIG CLI]
- Fix Azure file share not deleted issue when the namespace is deleted ([#97417](https://github.com/kubernetes/kubernetes/pull/97417), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider and Storage]
- Fix CVE-2020-8555 for Gluster client connections. ([#97922](https://github.com/kubernetes/kubernetes/pull/97922), [@liggitt](https://github.com/liggitt)) [SIG Storage]
- Fix counting error in service/nodeport/loadbalancer quota check ([#97451](https://github.com/kubernetes/kubernetes/pull/97451), [@pacoxu](https://github.com/pacoxu)) [SIG API Machinery, Network and Testing]
- Fix kubectl-convert import known versions ([#97754](https://github.com/kubernetes/kubernetes/pull/97754), [@wzshiming](https://github.com/wzshiming)) [SIG CLI and Testing]
- Fix missing cadvisor machine metrics. ([#97006](https://github.com/kubernetes/kubernetes/pull/97006), [@lingsamuel](https://github.com/lingsamuel)) [SIG Node]
- Fix nil VMSS name when setting service to auto mode ([#97366](https://github.com/kubernetes/kubernetes/pull/97366), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]
- Fix the panic when kubelet registers if a node object already exists with no Status.Capacity or Status.Allocatable ([#95269](https://github.com/kubernetes/kubernetes/pull/95269), [@SataQiu](https://github.com/SataQiu)) [SIG Node]
- Fix the regression with the slow pods termination. Before this fix pods may take an additional time to terminate - up to one minute. Reversing the change that ensured that CNI resources cleaned up when the pod is removed on API server. ([#97980](https://github.com/kubernetes/kubernetes/pull/97980), [@SergeyKanzhelev](https://github.com/SergeyKanzhelev)) [SIG Node]
- Fix to recover CSI volumes from certain dangling attachments ([#96617](https://github.com/kubernetes/kubernetes/pull/96617), [@yuga711](https://github.com/yuga711)) [SIG Apps and Storage]
- Fix: azure file latency issue for metadata-heavy workloads ([#97082](https://github.com/kubernetes/kubernetes/pull/97082), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider and Storage]
- Fixed Cinder volume IDs on OpenStack Train ([#96673](https://github.com/kubernetes/kubernetes/pull/96673), [@jsafrane](https://github.com/jsafrane)) [SIG Cloud Provider]
- Fixed FibreChannel volume plugin corrupting filesystems on detach of multipath volumes. ([#97013](https://github.com/kubernetes/kubernetes/pull/97013), [@jsafrane](https://github.com/jsafrane)) [SIG Storage]
- Fixed a bug in kubelet that will saturate CPU utilization after containerd got restarted. ([#97174](https://github.com/kubernetes/kubernetes/pull/97174), [@hanlins](https://github.com/hanlins)) [SIG Node]
- Fixed bug in CPUManager with race on container map access ([#97427](https://github.com/kubernetes/kubernetes/pull/97427), [@klueska](https://github.com/klueska)) [SIG Node]
- Fixed cleanup of block devices when /var/lib/kubelet is a symlink. ([#96889](https://github.com/kubernetes/kubernetes/pull/96889), [@jsafrane](https://github.com/jsafrane)) [SIG Storage]
- GCE Internal LoadBalancer sync loop will now release the ILB IP address upon sync failure. An error in ILB forwarding rule creation will no longer leak IP addresses. ([#97740](https://github.com/kubernetes/kubernetes/pull/97740), [@prameshj](https://github.com/prameshj)) [SIG Cloud Provider and Network]
- Ignore update pod with no new images in alwaysPullImages admission controller ([#96668](https://github.com/kubernetes/kubernetes/pull/96668), [@pacoxu](https://github.com/pacoxu)) [SIG Apps, Auth and Node]
- Kubeadm now installs version 3.4.13 of etcd when creating a cluster with v1.19 ([#97244](https://github.com/kubernetes/kubernetes/pull/97244), [@pacoxu](https://github.com/pacoxu)) [SIG Cluster Lifecycle]
- Kubeadm: avoid detection of the container runtime for commands that do not need it ([#97625](https://github.com/kubernetes/kubernetes/pull/97625), [@pacoxu](https://github.com/pacoxu)) [SIG Cluster Lifecycle]
- Kubeadm: fix a bug in the host memory detection code on 32bit Linux platforms ([#97403](https://github.com/kubernetes/kubernetes/pull/97403), [@abelbarrera15](https://github.com/abelbarrera15)) [SIG Cluster Lifecycle]
- Kubeadm: fix a bug where "kubeadm upgrade" commands can fail if CoreDNS v1.8.0 is installed. ([#97919](https://github.com/kubernetes/kubernetes/pull/97919), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Performance regression [#97685](https://github.com/kubernetes/kubernetes/issues/97685) has been fixed. ([#97860](https://github.com/kubernetes/kubernetes/pull/97860), [@MikeSpreitzer](https://github.com/MikeSpreitzer)) [SIG API Machinery]
- Remove deprecated --cleanup-ipvs flag of kube-proxy, and make --cleanup flag always to flush IPVS ([#97336](https://github.com/kubernetes/kubernetes/pull/97336), [@maaoBit](https://github.com/maaoBit)) [SIG Network]
- The current version of the container image publicly exposed IP serving a /metrics endpoint to the Internet. The new version of the container image serves /metrics endpoint on a different port. ([#97621](https://github.com/kubernetes/kubernetes/pull/97621), [@vbannai](https://github.com/vbannai)) [SIG Cloud Provider]
- Use force unmount for NFS volumes if regular mount fails after 1 minute timeout ([#96844](https://github.com/kubernetes/kubernetes/pull/96844), [@gnufied](https://github.com/gnufied)) [SIG Storage]
- Users will see increase in time for deletion of pods and also guarantee that removal of pod from api server  would mean deletion of all the resources from container runtime. ([#92817](https://github.com/kubernetes/kubernetes/pull/92817), [@kmala](https://github.com/kmala)) [SIG Node]
- Using exec auth plugins with kubectl no longer results in warnings about constructing many client instances from the same exec auth config. ([#97857](https://github.com/kubernetes/kubernetes/pull/97857), [@liggitt](https://github.com/liggitt)) [SIG API Machinery and Auth]
- Warning about using a deprecated volume plugin is logged only once. ([#96751](https://github.com/kubernetes/kubernetes/pull/96751), [@jsafrane](https://github.com/jsafrane)) [SIG Storage]

### Other (Cleanup or Flake)

- Bump github.com/Azure/go-autorest/autorest to v0.11.12 ([#97033](https://github.com/kubernetes/kubernetes/pull/97033), [@patrickshan](https://github.com/patrickshan)) [SIG API Machinery, CLI, Cloud Provider and Cluster Lifecycle]
- Delete deprecated mixed protocol annotation ([#97096](https://github.com/kubernetes/kubernetes/pull/97096), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]
- Kube-proxy: Traffic from the cluster directed to ExternalIPs is always sent directly to the Service. ([#96296](https://github.com/kubernetes/kubernetes/pull/96296), [@aojea](https://github.com/aojea)) [SIG Network and Testing]
- Kubeadm: fix a whitespace issue in the output of the "kubeadm join" command shown as the output of "kubeadm init" and "kubeadm token create --print-join-command" ([#97413](https://github.com/kubernetes/kubernetes/pull/97413), [@SataQiu](https://github.com/SataQiu)) [SIG Cluster Lifecycle]
- Kubeadm: improve the error messaging when the user provides an invalid discovery token CA certificate hash. ([#97290](https://github.com/kubernetes/kubernetes/pull/97290), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Migrate log messages in pkg/scheduler/{scheduler.go,factory.go} to structured logging ([#97509](https://github.com/kubernetes/kubernetes/pull/97509), [@aldudko](https://github.com/aldudko)) [SIG Scheduling]
- Migrate proxy/iptables/proxier.go logs to structured logging ([#97678](https://github.com/kubernetes/kubernetes/pull/97678), [@JornShen](https://github.com/JornShen)) [SIG Network]
- Migrate some scheduler log messages to structured logging ([#97349](https://github.com/kubernetes/kubernetes/pull/97349), [@aldudko](https://github.com/aldudko)) [SIG Scheduling]
- NONE ([#97167](https://github.com/kubernetes/kubernetes/pull/97167), [@geegeea](https://github.com/geegeea)) [SIG Node]
- NetworkPolicy validation framework optimizations for rapidly verifying CNI's work correctly across several pods and namespaces ([#91592](https://github.com/kubernetes/kubernetes/pull/91592), [@jayunit100](https://github.com/jayunit100)) [SIG Network, Storage and Testing]
- Official support to build kubernetes with docker-machine / remote docker is removed. This change does not affect building kubernetes with docker locally. ([#97618](https://github.com/kubernetes/kubernetes/pull/97618), [@jherrera123](https://github.com/jherrera123)) [SIG Release and Testing]
- Scheduler plugin validation now provides all errors detected instead of the first one. ([#96745](https://github.com/kubernetes/kubernetes/pull/96745), [@lingsamuel](https://github.com/lingsamuel)) [SIG Node, Scheduling and Testing]
- Storage related e2e testsuite redesign & cleanup ([#96573](https://github.com/kubernetes/kubernetes/pull/96573), [@Jiawei0227](https://github.com/Jiawei0227)) [SIG Storage and Testing]
- The OIDC authenticator no longer waits 10 seconds before attempting to fetch the metadata required to verify tokens. ([#97693](https://github.com/kubernetes/kubernetes/pull/97693), [@enj](https://github.com/enj)) [SIG API Machinery and Auth]
- The `AttachVolumeLimit` feature gate that is GA since v1.17 is now removed. ([#96539](https://github.com/kubernetes/kubernetes/pull/96539), [@ialidzhikov](https://github.com/ialidzhikov)) [SIG Storage]
- The `CSINodeInfo` feature gate that is GA since v1.17 is unconditionally enabled, and can no longer be specified via the `--feature-gates` argument. ([#96561](https://github.com/kubernetes/kubernetes/pull/96561), [@ialidzhikov](https://github.com/ialidzhikov)) [SIG Apps, Auth, Scheduling, Storage and Testing]
- The deprecated feature gates `RotateKubeletClientCertificate`, `AttachVolumeLimit`, `VolumePVCDataSource` and `EvenPodsSpread` are now unconditionally enabled and can no longer be specified in component invocations. ([#97306](https://github.com/kubernetes/kubernetes/pull/97306), [@gavinfish](https://github.com/gavinfish)) [SIG Node, Scheduling and Storage]
- `ServiceNodeExclusion`, `NodeDisruptionExclusion` and `LegacyNodeRoleBehavior`(locked to false) features have been promoted to GA. 
  To prevent control plane nodes being added to load balancers automatically, upgrade users need to add "node.kubernetes.io/exclude-from-external-load-balancers"  label to control plane nodes. ([#97543](https://github.com/kubernetes/kubernetes/pull/97543), [@pacoxu](https://github.com/pacoxu)) [SIG API Machinery, Apps, Cloud Provider and Network]

### Uncategorized

- Adding Brazilian Portuguese translation for kubectl ([#61595](https://github.com/kubernetes/kubernetes/pull/61595), [@cpanato](https://github.com/cpanato)) [SIG CLI]

## Dependencies

### Added
_Nothing has changed._

### Changed
- github.com/Azure/go-autorest/autorest: [v0.11.1 → v0.11.12](https://github.com/Azure/go-autorest/autorest/compare/v0.11.1...v0.11.12)
- github.com/coredns/corefile-migration: [v1.0.10 → v1.0.11](https://github.com/coredns/corefile-migration/compare/v1.0.10...v1.0.11)
- github.com/golang/mock: [v1.4.1 → v1.4.4](https://github.com/golang/mock/compare/v1.4.1...v1.4.4)
- github.com/google/cadvisor: [v0.38.5 → v0.38.6](https://github.com/google/cadvisor/compare/v0.38.5...v0.38.6)
- github.com/heketi/heketi: [c2e2a4a → v10.2.0+incompatible](https://github.com/heketi/heketi/compare/c2e2a4a...v10.2.0)
- github.com/miekg/dns: [v1.1.4 → v1.1.35](https://github.com/miekg/dns/compare/v1.1.4...v1.1.35)
- k8s.io/system-validators: v1.2.0 → v1.3.0

### Removed
- rsc.io/quote/v3: v3.1.0
- rsc.io/sampler: v1.3.0
