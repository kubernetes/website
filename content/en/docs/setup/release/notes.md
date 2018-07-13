---
title: v1.11 Release Notes
content_template: templates/concept
---

{{% capture overview %}}

[Documentation](https://docs.k8s.io) & [Examples](https://releases.k8s.io/release-1.11/examples)

## Downloads for v1.11.0


filename | sha256 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes.tar.gz) | `3c779492574a5d8ce702d89915184f5dd52280da909abf134232e5ab00b4a885`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-src.tar.gz) | `f0b2d8e61860acaf50a9bae0dc36b8bfdb4bb41b8d0a1bb5a9bc3d87aad3b794`

### Client Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-client-darwin-386.tar.gz) | `196738ef058510438b3129f0a72544544b7d52a8732948b4f9358781f87dab59`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-client-darwin-amd64.tar.gz) | `9ec8357b10b79f8fd87f3a836879d0a4bb46fb70adbb82f1e34dc7e91d74999f`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-client-linux-386.tar.gz) | `e8ee8a965d3ea241d9768b9ac868ecbbee112ef45038ff219e4006fa7f4ab4e2`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-client-linux-amd64.tar.gz) | `d31377c92b4cc9b3da086bc1974cbf57b0d2c2b22ae789ba84cf1b7554ea7067`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-client-linux-arm.tar.gz) | `9e9da909293a4682a5d6270a39894b056b3e901532b15eb8fdc0814a8d628d65`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-client-linux-arm64.tar.gz) | `149df9daac3e596042f5759977f9f9299a397130d9dddc2d4a2b513dd64f1092`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-client-linux-ppc64le.tar.gz) | `ff3d3e4714406d92e9a2b7ef2887519800b89f6592a756524f7a37dc48057f44`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-client-linux-s390x.tar.gz) | `e5a39bdc1e474d9d00974a81101e043aaff37c30c1418fb85a0c2561465e14c7`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-client-windows-386.tar.gz) | `4ba1102a33c6d4df650c4864a118f99a9882021fea6f250a35f4b4f4a2d68eaa`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-client-windows-amd64.tar.gz) | `0bb74af7358f9a2f4139ed1c10716a2f5f0c1c13ab3af71a0621a1983233c8d7`

### Server Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-server-linux-amd64.tar.gz) | `b8a8a88afd8a40871749b2362dbb21295c6a9c0a85b6fc87e7febea1688eb99e`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-server-linux-arm.tar.gz) | `88b9168013bb07a7e17ddc0638e7d36bcd2984d049a50a96f54cb4218647d8da`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-server-linux-arm64.tar.gz) | `12fab9e9f0e032f278c0e114c72ea01899a0430fc772401f23e26de306e0f59f`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-server-linux-ppc64le.tar.gz) | `6616d726a651e733cfd4cccd78bfdc1d421c4a446edf4b617b8fd8f5e21f073e`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-server-linux-s390x.tar.gz) | `291838980929c8073ac592219d9576c84a9bdf233585966c81a380c3d753316e`

### Node Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-node-linux-amd64.tar.gz) | `b23e905efb828fdffc4efc208f7343236b22c964e408fe889f529502aed4a335`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-node-linux-arm.tar.gz) | `44bf8973581887a2edd33eb637407e76dc0dc3a5abcc2ff04aec8338b533156d`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-node-linux-arm64.tar.gz) | `51e481c782233b46ee21e9635c7d8c2a84450cbe30d7b1cbe5c5982b33f40b13`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-node-linux-ppc64le.tar.gz) | `d1a3feda31a954d3a83193a51a117873b6ef9f8acc3e10b3f1504fece91f2eb8`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-node-linux-s390x.tar.gz) | `0ad76c6e6aef670c215256803b3b0d19f4730a0843429951c6421564c73d4932`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.11.0/kubernetes-node-windows-amd64.tar.gz) | `8ad26200ed40d40a1b78d7a5dbe56220f0813d31194f40f267b476499fe2c5c3`

## Urgent Upgrade Notes

{{< caution >}}
**Caution**: You **MUST** do this before you upgrade!
{{< /caution >}}

Before upgrading to Kubernetes 1.11, you must keep the following in mind:

* **JSON configuration files that contain fields with incorrect case will no longer be valid. You must correct these files before upgrading.** When specifying keys in JSON resource definitions during direct API server communication, the keys are case-sensitive. A bug introduced in Kubernetes 1.8 caused the API server to accept a request with incorrect case and coerce it to correct case, but this behaviour has been fixed in 1.11 and the API server will once again be enforcing the correct case. It’s worth noting that during this time, the `kubectl` tool continued to enforce case-sensitive keys, so users that strictly manage resources with `kubectl` will be unaffected by this change. ([#65034](https://github.com/kubernetes/kubernetes/pull/65034), [@caesarxuchao](https://github.com/caesarxuchao))
* **[Pod priority and preemption](https://kubernetes.io/docs/concepts/configuration/pod-priority-preemption/) is now enabled by default.** Note that this means that pods from *any* namespace can now request priority classes that compete with and/or cause preemption of critical system pods that are already running. If that is not desired, disable the PodPriority feature by setting `--feature-gates=PodPriority=false` on the kube-apiserver, kube-scheduler, and kubelet components before upgrading to 1.11. Disabling the PodPriority feature limits [critical pods](https://kubernetes.io/docs/tasks/administer-cluster/guaranteed-scheduling-critical-addon-pods/#marking-pod-as-critical-when-priorites-are-enabled) to the `kube-system` namespace.

{{% /capture %}}

{{< toc >}}

{{% capture body %}}

## Major Themes

### SIG API Machinery

This release SIG API Machinery focused mainly on CustomResources. For example, subresources for CustomResources are now beta and enabled by default. With this, updates to the `/status` subresource will disallow updates to all fields other than `.status` (not just `.spec` and `.metadata` as before). Also, `required` and `description` can be used at the root of the CRD OpenAPI validation schema when the `/status` subresource is enabled.

In addition, users can now create multiple versions of CustomResourceDefinitions, but without any kind of automatic conversion, and CustomResourceDefinitions now allow specification of additional columns for `kubectl get` output via the `spec.additionalPrinterColumns` field.

### SIG Auth

Work this cycle focused on graduating existing functions, and on making security functions more understandable for users.

RBAC [cluster role aggregation](https://kubernetes.io/docs/reference/access-authn-authz/rbac/#aggregated-clusterroles), introduced in 1.9, graduated to stable status with no changes in 1.11, and [client-go credential plugins](https://kubernetes.io/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins)  graduated to beta status, while also adding support for obtaining TLS credentials from an external plugin.

Kubernetes 1.11 also makes it easier to see what's happening, as audit events can now be annotated with information about how an API request was handled:
  * Authorization sets `authorization.k8s.io/decision` and `authorization.k8s.io/reason` annotations with the authorization decision ("allow" or "forbid") and a human-readable description of why the decision was made (for example, RBAC includes the name of the role/binding/subject which allowed a request).
  * PodSecurityPolicy admission sets `podsecuritypolicy.admission.k8s.io/admit-policy` and `podsecuritypolicy.admission.k8s.io/validate-policy` annotations containing the name of the policy that allowed a pod to be admitted. (PodSecurityPolicy also gained the ability to [limit hostPath volume mounts to be read-only](https://kubernetes.io/docs/concepts/policy/pod-security-policy/#volumes-and-file-systems).)

In addition, the NodeRestriction admission plugin now prevents kubelets from modifying taints on their Node API objects, making it easier to keep track of which nodes should be in use.

### SIG CLI

SIG CLI's main focus this release was on refactoring `kubectl` internals to improve composability, readability and testability of `kubectl` commands. Those refactors will allow the team to extract a mechanism for extensibility of kubectl -- that is, plugins -- in the next releases.

### SIG Cluster Lifecycle

SIG Cluster Lifecycle focused on improving kubeadm’s user experience by including a set of new commands related to maintaining the kubeadm configuration file, the API version of which has now has been incremented to `v1alpha2`. These commands can handle the migration of the configuration to a newer version, printing the default configuration, and listing and pulling the required container images for bootstrapping a cluster.

Other notable changes include:
* CoreDNS replaces kube-dns as the default DNS provider
* Improved user experience for environments without a public internet connection and users using other CRI runtimes than Docker
* Support for structured configuration for the kubelet, which avoids the need to modify the systemd drop-in file
* Many improvements to the upgrade process and other bug fixes

### SIG Instrumentation

As far as Sig Instrumentation, the major change in Kubernetes 1.11 is the deprecation of Heapster as part of ongoing efforts to move to the new Kubernetes monitoring model. Clusters still using Heapster for autoscaling should be migrated over to metrics-server and the custom metrics API. See the deprecation section for more information.

### SIG Network

The main milestones for SIG Network this release are the graduation of IPVS-based load balancing and CoreDNS to general availability.

IPVS is an alternative approach to in-cluster load balancing that uses in-kernel hash tables rather than the previous iptables approach, while CoreDNS is a replacement for kube-dns for service discovery.

### SIG Node

SIG-Node advanced several features and made incremental improvements in a few key topic areas this release.

The dynamic kubelet config feature graduated to beta, so it is enabled by default, simplifying management of the node object itself.  Kubelets that are configured to work with the CRI may take advantage of the log rotation feature, which is graduating to beta this release.

The cri-tools project, which aims to provide consistent tooling for operators to debug and introspect their nodes in production independent of their chosen container runtime, graduated to GA.

As far as platforms, working with SIG-Windows, enhancements were made to the kubelet to improve platform support on Windows operating systems, and improvements to resource management were also made.  In particular, support for sysctls on Linux graduated to beta.

### SIG OpenStack

SIG-OpenStack continued to build out testing, with eleven acceptance tests covering a wide-range of scenarios and use-cases. During the 1.11 cycle our reporting back to test-grid has qualified the OpenStack cloud provider as a gating job for the Kubernetes release.

New features include improved integration between the Keystone service and Kubernetes RBAC, and a number of stability and compatibility improvements across the entire provider code-base.

### SIG Scheduling
[Pod Priority and Preemption](https://kubernetes.io/docs/concepts/configuration/pod-priority-preemption/) has graduated to Beta, so it is enabled by default. Note that this involves [significant and important changes for operators](https://github.com/kubernetes/sig-release/pull/201/files). The team also worked on improved performance and reliability of the scheduler.

### SIG Storage

Sig Storage graduated two features that had been introduced in previous versions and introduced three new features in an alpha state.

The StorageProtection feature, which prevents deletion of PVCs while Pods are still using them and of PVs while still bound to a PVC, is now generally available, and volume resizing, which lets you increase size of a volume after a Pod restarts is now beta, which means it is on by default.

New alpha features include:
* Online volume resizing will increase the filesystem size of a resized volume without requiring a Pod restart.
* AWS EBS and GCE PD volumes support increased limits on the maximum number of attached volumes per node.
* Subpath volume directories can be created using DownwardAPI environment variables.

### SIG Windows

This release supports more of Kubernetes API for pods and containers on Windows, including:

* Metrics for Pod, Container, Log filesystem
* The run_as_user security contexts
* Local persistent volumes and fstype for Azure disk

Improvements in Windows Server version 1803 also bring new storage functionality to Kubernetes v1.11, including:

* Volume mounts for ConfigMap and Secret
* Flexvolume plugins for SMB and iSCSI storage are also available out-of-tree at [Microsoft/K8s-Storage-Plugins](https://github.com/Microsoft/K8s-Storage-Plugin)

## Known Issues

* IPVS based kube-proxy doesn't support graceful close connections for terminating pod. This issue will be fixed in a future release. ([#57841](https://github.com/kubernetes/kubernetes/pull/57841), [@jsravn](https://github.com/jsravn))
* kube-proxy needs to be configured to override hostname in some environments. ([#857](https://github.com/kubernetes/kubeadm/issues/857), [@detiber](https://github.com/detiber))
* There's a known issue where the Vertical Pod Autoscaler will radically change implementation in 1.12, so users of VPA (alpha) in 1.11 are warned that they will not be able to automatically migrate their VPA configs from 1.11 to 1.12.


## Before Upgrading

* When Response is a `metav1.Status`, it is no longer copied into the audit.Event status. Only the "status", "reason" and "code" fields are set.  For example, when we run `kubectl get pods abc`, the API Server returns a status object:
```
{"kind":"Status","apiVersion":"v1","metadata":{},"status":"Failure","message":"pods \"abc\" not found","reason":"NotFound","details":{"name":"abc","kind":"pods"},"code":404}
```
In previous versions, the whole object was logged in audit events. Starting in 1.11, only `status`, `reason`, and `code` are logged. Code that relies on the older version must be updated to avoid errors.
([#62695](https://github.com/kubernetes/kubernetes/pull/62695), [@CaoShuFeng](https://github.com/CaoShuFeng))
* HTTP transport now uses `context.Context` to cancel dial operations. k8s.io/client-go/transport/Config struct has been updated to accept a function with a `context.Context` parameter. This is a breaking change if you use this field in your code. ([#60012](https://github.com/kubernetes/kubernetes/pull/60012), [@ash2k](https://github.com/ash2k))
* kubectl: This client version requires the `apps/v1` APIs, so it will not work against a cluster version older than v1.9.0. Note that kubectl only guarantees compatibility with clusters that are +/-1 minor version away. ([#61419](https://github.com/kubernetes/kubernetes/pull/61419), [@enisoc](https://github.com/enisoc))
* Pod priority and preemption is now enabled by default. Even if you don't plan to use this feature, you might need to take some action immediately after upgrading. In multi-tenant clusters where not all users are trusted, you are advised to create appropriate quotas for two default priority classes, system-cluster-critical and system-node-critical, which are added to clusters by default. `ResourceQuota` should be created to limit users from creating Pods at these priorities if not all users of your cluster are trusted. We do not advise disabling this feature because critical system Pods rely on the scheduler preemption to be scheduled when cluster is under resource pressure.
* Default mount propagation has changed from `HostToContainer` ("rslave" in Linux terminology), as it was in 1.10, to `None` ("private") to match the behavior in 1.9 and earlier releases; `HostToContainer` as a default caused regressions in some pods. If you are relying on this behavior you will need to set it explicitly. ([#62462](https://github.com/kubernetes/kubernetes/pull/62462), [@jsafrane](https://github.com/jsafrane))
* The kube-apiserver `--storage-version` flag has been removed; you must use `--storage-versions` instead. ([#61453](https://github.com/kubernetes/kubernetes/pull/61453), [@hzxuzhonghu](https://github.com/hzxuzhonghu))
* Authors of aggregated API servers must not rely on authorization being done by the kube-apiserver, and must do delegated authorization in addition. ([#61349](https://github.com/kubernetes/kubernetes/pull/61349), [@sttts](https://github.com/sttts))
* GC is now bound by QPS so if you need more QPS to avoid ratelimiting GC, you'll have to set it explicitly. ([#63657](https://github.com/kubernetes/kubernetes/pull/63657), [@shyamjvs](https://github.com/shyamjvs))
* `kubeadm join` is now blocking on the kubelet performing the TLS Bootstrap properly. Earlier, `kubeadm join` only did the discovery part and exited successfully without checking that the kubelet actually started properly and performed the TLS bootstrap correctly. Now, as kubeadm runs some post-join steps (for example, annotating the Node API object with the CRISocket), `kubeadm join` is now waiting for the kubelet to perform the TLS Bootstrap, and then uses that credential to perform further actions. This also improves the UX, as `kubeadm` will exit with a non-zero code if the kubelet isn't in a functional state, instead of pretending everything's fine.
 ([#64792](https://github.com/kubernetes/kubernetes/pull/64792), [@luxas](https://github.com/luxas))
* The structure of the kubelet dropin in the kubeadm deb package has changed significantly. Instead of hard-coding the parameters for the kubelet in the dropin, a structured configuration file for the kubelet is used, and is expected to be present in `/var/lib/kubelet/config.yaml`. For runtime-detected, instance-specific configuration values, a environment file with dynamically-generated flags at `kubeadm init` or `kubeadm join` run time is used. Finally, if you want to override something specific for the kubelet that can't be done via the kubeadm Configuration file (which is preferred), you might add flags to the `KUBELET_EXTRA_ARGS` environment variable in either `/etc/default/kubelet`
or `/etc/sysconfig/kubelet`, depending on the system you're running on.
([#64780](https://github.com/kubernetes/kubernetes/pull/64780), [@luxas](https://github.com/luxas))
* The `--node-name` flag for kubeadm now dictates the Node API object name the kubelet uses for registration, in all cases but where you might use an in-tree cloud provider. If you're not using an in-tree cloud provider, `--node-name` will set the Node API object name. If you're using an in-tree cloud provider, you MUST make `--node-name` match the name the in-tree cloud provider decides to use.
([#64706](https://github.com/kubernetes/kubernetes/pull/64706), [@liztio](https://github.com/liztio))
* The `PersistentVolumeLabel` admission controller is now disabled by default. If you depend on this feature (AWS/GCE) then ensure it is added to the `--enable-admission-plugins` flag on the kube-apiserver. ([#64326](https://github.com/kubernetes/kubernetes/pull/64326), [@andrewsykim](https://github.com/andrewsykim))
* kubeadm: kubelets in kubeadm clusters now disable the readonly port (10255). If you're relying on unauthenticated access to the readonly port, please switch to using the secure port (10250). Instead, you can now use ServiceAccount tokens when talking to the secure port, which will make it easier to get access to, for example, the `/metrics` endpoint of the kubelet, securely. ([#64187](https://github.com/kubernetes/kubernetes/pull/64187), [@luxas](https://github.com/luxas))
* The formerly publicly-available cAdvisor web UI that the kubelet ran on port 4194 by default is now turned off by default. The flag configuring what port to run this UI on `--cadvisor-port` was deprecated in v1.10. Now the default is `--cadvisor-port=0`, in other words, to not run the web server. If you still need to run cAdvisor, the recommended way to run it is via a DaemonSet. Note that the `--cadvisor-port` will be removed in v1.12 ([#63881](https://github.com/kubernetes/kubernetes/pull/63881), [@luxas](https://github.com/luxas))

### New Deprecations

* As a reminder, etcd2 as a backend is deprecated and support will be removed in Kubernetes 1.13. Please ensure that your clusters are upgraded to etcd3 as soon as possible.
* InfluxDB cluster monitoring has been deprecated as part of the deprecation of Heapster. Instead, you may use the [metrics server](https://github.com/kubernetes-incubator/metrics-server). It's a simplified heapster that is able to gather and serve current metrics values. It provides the Metrics API that is used by `kubectl top`, and horizontal pod autoscaler. Note that it doesn't include some features of Heapster, such as short term metrics for graphs in kube-dashboard and dedicated push sinks, which proved hard to maintain and scale. Clusters using Heapster for transfering metrics into long-term storage should consider using their metric solution's native Kubernetes support, if present, or should consider alternative solutions. ([#62328](https://github.com/kubernetes/kubernetes/pull/62328), [@serathius](https://github.com/serathius))
* The kubelet `--rotate-certificates` flag is now deprecated, and will be removed in a future release. The kubelet certificate rotation feature can now be enabled via the `.RotateCertificates` field in the kubelet's config file.  ([#63912](https://github.com/kubernetes/kubernetes/pull/63912), [@luxas](https://github.com/luxas))
* The kubeadm configuration file version has been upgraded from `v1alpha2` from `v1alpha1`. `v1alpha1` read support exists in v1.11, but will be removed in v1.12. ([#63788](https://github.com/kubernetes/kubernetes/pull/63788), [@luxas](https://github.com/luxas))
The following PRs changed the API spec:
  * In the new v1alpha2 kubeadm Configuration API, the `.CloudProvider` and `.PrivilegedPods` fields don't exist anymore. Instead, you should use the out-of-tree cloud provider implementations, which are beta in v1.11.
  * If you have to use the legacy in-tree cloud providers, you can rearrange your config like the example below. If you need the `cloud-config` file (located in `{cloud-config-path}`), you can mount it into the API Server and controller-manager containers using ExtraVolumes, as in:
      ```yaml
      kind: MasterConfiguration
      apiVersion: kubeadm.k8s.io/v1alpha2
      apiServerExtraArgs:
        cloud-provider: "{cloud}"
        cloud-config: "{cloud-config-path}"
      apiServerExtraVolumes:
      - name: cloud
        hostPath: "{cloud-config-path}"
        mountPath: "{cloud-config-path}"
      controllerManagerExtraArgs:
        cloud-provider: "{cloud}"
        cloud-config: "{cloud-config-path}"
      controllerManagerExtraVolumes:
      - name: cloud
        hostPath: "{cloud-config-path}"
        mountPath: "{cloud-config-path}"
      ```
* If you need to use the `.PrivilegedPods` functionality, you can still edit the manifests in `/etc/kubernetes/manifests/`, and set `.SecurityContext.Privileged=true` for the apiserver and controller manager.
 ([#63866](https://github.com/kubernetes/kubernetes/pull/63866), [@luxas](https://github.com/luxas))
 * kubeadm: The Token-related fields in the `MasterConfiguration` object have now been refactored. Instead of the top-level `.Token`, `.TokenTTL`, `.TokenUsages`, `.TokenGroups` fields, there is now a `BootstrapTokens` slice of `BootstrapToken` objects that support the same features under the `.Token`, `.TTL`, `.Usages`, `.Groups` fields. ([#64408](https://github.com/kubernetes/kubernetes/pull/64408), [@luxas](https://github.com/luxas))
  * `.NodeName` and `.CRISocket` in the `MasterConfiguration` and `NodeConfiguration` v1alpha1 API objects are now `.NodeRegistration.Name` and `.NodeRegistration.CRISocket` respectively in the v1alpha2 API. The `.NoTaintMaster` field has been removed in the v1alpha2 API. ([#64210](https://github.com/kubernetes/kubernetes/pull/64210), [@luxas](https://github.com/luxas))
  * kubeadm: Support for `.AuthorizationModes` in the kubeadm v1alpha2 API has been removed. Instead, you can use the `.APIServerExtraArgs` and `.APIServerExtraVolumes` fields to achieve the same effect. Files using the v1alpha1 API and setting this field will be automatically upgraded to this v1alpha2 API and the information will be preserved. ([#64068](https://github.com/kubernetes/kubernetes/pull/64068), [@luxas](https://github.com/luxas))
* The annotation `service.alpha.kubernetes.io/tolerate-unready-endpoints` is deprecated.  Users should use Service.spec.publishNotReadyAddresses instead. ([#63742](https://github.com/kubernetes/kubernetes/pull/63742), [@thockin](https://github.com/thockin))
* `--show-all`, which only affected pods, and even then only for human readable/non-API printers, is inert in v1.11, and will be removed in a future release. ([#60793](https://github.com/kubernetes/kubernetes/pull/60793), [@charrywanganthony](https://github.com/charrywanganthony))
* The `kubectl rolling-update` is now deprecated.  Use `kubectl rollout` instead.  ([#61285](https://github.com/kubernetes/kubernetes/pull/61285), [@soltysh](https://github.com/soltysh))
* kube-apiserver: the default `--endpoint-reconciler-type` is now `lease`. The `master-count` endpoint reconciler type is deprecated and will be removed in 1.13. ([#63383](https://github.com/kubernetes/kubernetes/pull/63383), [@liggitt](https://github.com/liggitt))
* OpenStack built-in cloud provider is now deprecated. Please use the external cloud provider for OpenStack. ([#63524](https://github.com/kubernetes/kubernetes/pull/63524), [@dims](https://github.com/dims))
* The Kubelet's deprecated `--allow-privileged` flag now defaults to true. This enables users to stop setting `--allow-privileged` in order to transition to `PodSecurityPolicy`. Previously, users had to continue setting `--allow-privileged`, because the default was false. ([#63442](https://github.com/kubernetes/kubernetes/pull/63442), [@mtaufen](https://github.com/mtaufen))
* The old dynamic client has been replaced by a new one.  The previous dynamic client will exist for one release in `client-go/deprecated-dynamic`.  Switch as soon as possible. ([#63446](https://github.com/kubernetes/kubernetes/pull/63446), [@deads2k](https://github.com/deads2k))
* In-tree support for openstack credentials is now deprecated. please use the "client-keystone-auth" from the cloud-provider-openstack repository. details on how to use this new capability is documented [here](https://github.com/kubernetes/cloud-provider-openstack/blob/master/docs/using-client-keystone-auth.md) ([#64346](https://github.com/kubernetes/kubernetes/pull/64346), [@dims](https://github.com/dims))
* The GitRepo volume type is deprecated. To provision a container with a git repo, mount an `EmptyDir` into an `InitContainer` that clones the repo using git, then `moEmptyDir` into the Pod's container.
([#63445](https://github.com/kubernetes/kubernetes/pull/63445), [@ericchiang](https://github.com/ericchiang))
* Alpha annotation for PersistentVolume node affinity has been removed.  Update your PersistentVolumes to use the beta PersistentVolume.nodeAffinity field before upgrading to this release. ([#61816](https://github.com/kubernetes/kubernetes/pull/61816), [@wackxu
](https://github.com/wackxu))

### Removed Deprecations

* kubeadm has removed the `.ImagePullPolicy` field in the v1alpha2 API version. Instead it's set statically to `IfNotPresent` for all required images. If you want to always pull the latest images before cluster init (as `Always` would do), run `kubeadm config images pull` before each `kubeadm init`. If you don't want the kubelet to pull any images at `kubeadm init` time, for example if you don't have an internet connection, you can also run `kubeadm config images pull` before `kubeadm init` or side-load the images some other way (such as `docker load -i image.tar`). Having the images locally cached will result in no pull at runtime, which makes it possible to run without any internet connection. ([#64096](https://github.com/kubernetes/kubernetes/pull/64096), [@luxas](https://github.com/luxas))
* kubeadm has removed `.Etcd.SelfHosting` from its configuration API. It was never used in practice ([#63871](https://github.com/kubernetes/kubernetes/pull/63871), [@luxas](https://github.com/luxas))
* The deprecated and inactive option '--enable-custom-metrics'  has been removed in 1.11. ([#60699](https://github.com/kubernetes/kubernetes/pull/60699), [@CaoShuFeng](https://github.com/CaoShuFeng))
* --include-extended-apis, which was deprecated back in [#32894](https://github.com/kubernetes/kubernetes/pull/32894), has been removed. ([#62803](https://github.com/kubernetes/kubernetes/pull/62803), [@deads2k](https://github.com/deads2k))
* Kubelets will no longer set `externalID` in their node spec. This feature has been deprecated since v1.1. ([#61877](https://github.com/kubernetes/kubernetes/pull/61877), [@mikedanese](https://github.com/mikedanese))
* The `initresource` admission plugin has been removed. ([#58784](https://github.com/kubernetes/kubernetes/pull/58784), [@wackxu](https://github.com/wackxu))
* `ObjectMeta `, `ListOptions`, and `DeleteOptions` have been removed from the core api group.  Please reference them in `meta/v1` instead. ([#61809](https://github.com/kubernetes/kubernetes/pull/61809), [@hzxuzhonghu](https://github.com/hzxuzhonghu))
* The deprecated `--mode` flag in `check-network-mode` has been removed. ([#60102](https://github.com/kubernetes/kubernetes/pull/60102), [@satyasm](https://github.com/satyasm))
* Support for the `alpha.kubernetes.io/nvidia-gpu` resource, which was deprecated in 1.10, has been removed. Please use the resource exposed by DevicePlugins instead (`nvidia.com/gpu`). ([#61498](https://github.com/kubernetes/kubernetes/pull/61498), [@mindprince](https://github.com/mindprince))
* The `kube-cloud-controller-manager` flag `--service-account-private-key-file` has been removed. Use `--use-service-account-credentials` instead. ([#60875](https://github.com/kubernetes/kubernetes/pull/60875), [@charrywanganthony](https://github.com/charrywanganthony))
* The rknetes code, which was deprecated in 1.10, has been removed. Use rktlet and CRI instead. ([#61432](https://github.com/kubernetes/kubernetes/pull/61432), [@filbranden](https://github.com/filbranden))
* DaemonSet scheduling associated with the alpha ScheduleDaemonSetPods feature flag has been emoved. See https://github.com/kubernetes/features/issues/548 for feature status. ([#61411](https://github.com/kubernetes/kubernetes/pull/61411), [@liggitt](https://github.com/liggitt))
* The `METADATA_AGENT_VERSION` configuration option has been removed to keep metadata agent version consistent across Kubernetes deployments. ([#63000](https://github.com/kubernetes/kubernetes/pull/63000), [@kawych](https://github.com/kawych))
* The deprecated `--service-account-private-key-file` flag has been removed from the cloud-controller-manager. The flag is still present and supported in the kube-controller-manager. ([#65182](https://github.com/kubernetes/kubernetes/pull/65182), [@liggitt](https://github.com/liggitt))
* Removed alpha functionality that allowed the controller manager to approve kubelet server certificates. This functionality should be replaced by automating validation and approval of node server certificate signing requests. ([#62471](https://github.com/kubernetes/kubernetes/pull/62471), [@mikedanese](https://github.com/mikedanese))

#### Graduated to Stable/GA
* IPVS-based in-cluster load balancing is now GA ([ref](https://github.com/kubernetes/features/issues/265))
* Enable CoreDNS as a DNS plugin for Kubernetes ([ref](https://github.com/kubernetes/features/issues/427))
* Azure Go SDK is now GA ([#63063](https://github.com/kubernetes/kubernetes/pull/63063), [@feiskyer](https://github.com/feiskyer))
* ClusterRole aggregation is now GA ([ref](https://github.com/kubernetes/features/issues/502))
* CRI validation test suite is now GA ([ref](https://github.com/kubernetes/features/issues/292))
* StorageObjectInUseProtection is now GA ([ref](https://github.com/kubernetes/features/issues/498)) and ([ref](https://github.com/kubernetes/features/issues/499))

#### Graduated to Beta

* Supporting out-of-tree/external cloud providers is now considered beta ([ref](https://github.com/kubernetes/features/issues/88))
* Resizing PersistentVolumes after pod restart is now considered beta. ([ref](https://github.com/kubernetes/features/issues/284))
* sysctl support is now considered beta ([ref](https://github.com/kubernetes/features/issues/34))
* Support for Azure Virtual Machine Scale Sets is now considered beta. ([ref](https://github.com/kubernetes/features/issues/513))
* Azure support for Cluster Autoscaler is now considered beta. ([ref](https://github.com/kubernetes/features/issues/514))
* The ability to limit a node's access to the API is now considered beta. ([ref](https://github.com/kubernetes/features/issues/279))
* CustomResource versioning is now considered beta. ([ref](https://github.com/kubernetes/features/issues/544))
* Windows container configuration in CRI is now considered beta ([ref](https://github.com/kubernetes/features/issues/547))
* CRI logging and stats are now considered beta ([ref](https://github.com/kubernetes/features/issues/552))
* The dynamic Kubelet config feature is now beta, and the DynamicKubeletConfig feature gate is on by default. In order to use dynamic Kubelet config, ensure that the Kubelet's --dynamic-config-dir option is set.  ([#64275](https://github.com/kubernetes/kubernetes/pull/64275), [@mtaufen](https://github.com/mtaufen))
* The Sysctls experimental feature has been promoted to beta (enabled by default via the `Sysctls` feature flag). PodSecurityPolicy and Pod objects now have fields for specifying and controlling sysctls. Alpha sysctl annotations will be ignored by 1.11+ kubelets. All alpha sysctl annotations in existing deployments must be converted to API fields to be effective. ([#6371](https://github.com/kubernetes/kubernetes/pull/63717), [@ingvagabund](https://github.com/ingvagabund))
* Volume expansion is now considered Beta. ([#64288](https://github.com/kubernetes/kubernetes/pull/64288), [@gnufied](https://github.com/gnufied))
* CRI container log rotation is now considered beta, and is enabled by default. ([#64046](https://github.com/kubernetes/kubernetes/pull/64046), [@yujuhong](https://github.com/yujuhong))
* The `PriorityClass` API has been promoted to `scheduling.k8s.io/v1beta1` ([#63100](https://github.com/kubernetes/kubernetes/pull/63100), [@ravisantoshgudimetla](https://github.com/ravisantoshgudimetla))
* The priorityClass feature is now considered beta. ([#63724](https://github.com/kubernetes/kubernetes/pull/63724), [@ravisantoshgudimetla](https://github.com/ravisantoshgudimetla))
* client-go: credential exec plugins is now considered beta. ([#64482](https://github.com/kubernetes/kubernetes/pull/64482), [@ericchiang](https://github.com/ericchiang))
* Subresources for custom resources is now considered beta and enabled by default. With this, updates to the `/status` subresource will disallow updates to all fields other than `.status` (not just `.spec` and `.metadata` as before). Also, `required` can be used at the root of the CRD OpenAPI validation schema when the `/status` subresource is enabled. ([#63598](https://github.com/kubernetes/kubernetes/pull/63598), [@nikhita](https://github.com/nikhita))

### New alpha features

* kube-scheduler can now schedule DaemonSet pods ([ref](https://github.com/kubernetes/features/issues/548))
* You can now resize PersistentVolumes without taking them offline ([ref](https://github.com/kubernetes/features/issues/531))
* You can now set a maximum volume count ([ref](https://github.com/kubernetes/features/issues/554))
* You can now do environment variable expansion in a subpath mount. ([ref](https://github.com/kubernetes/features/issues/559))
* You can now run containers in a pod as a particular group. ([ref](https://github.com/kubernetes/features/issues/213))
You can now bind tokens to service requests. ([ref](https://github.com/kubernetes/features/issues/542))
* The --experimental-qos-reserve kubelet flags has been replaced by the alpha level --qos-reserved flag or the QOSReserved field in the kubeletconfig, and requires the QOSReserved feature gate to be enabled. ([#62509](https://github.com/kubernetes/kubernetes/pull/62509), [@sjenning](https://github.com/sjenning))

## Other Notable Changes

### SIG API Machinery

* Orphan delete is now supported for custom resources. ([#63386](https://github.com/kubernetes/kubernetes/pull/63386), [@roycaihw](https://github.com/roycaihw))
* Metadata of CustomResources is now pruned and schema-checked during deserialization of requests and when read from etcd. In the former case, invalid meta data is rejected, in the later it is dropped from the CustomResource objects. ([#64267](https://github.com/kubernetes/kubernetes/pull/64267), [@sttts](https://github.com/sttts))
* The kube-apiserver openapi doc now includes extensions identifying `APIService` and `CustomResourceDefinition` `kind`s ([#64174](https://github.com/kubernetes/kubernetes/pull/64174), [@liggitt](https://github.com/liggitt))
* CustomResourceDefinitions Status subresource now supports GET and PATCH ([#63619](https://github.com/kubernetes/kubernetes/pull/63619), [@roycaihw](https://github.com/roycaihw))
* When updating `/status` subresource of a custom resource, only the value at the `.status` subpath for the update is considered. ([#63385](https://github.cm/kubernetes/kubernetes/pull/63385), [@CaoShuFeng](https://github.com/CaoShuFeng))
* Added a way to pass extra arguments to etcd. The these extra arguments can be used to adjust runtime configuration like heartbeat interval etc. ([#63961](https://github.com/kubernetes/kubernetes/pull/63961), [@mborsz](https://github.com/mborsz))
* Added Establishing Controller on CRDs to avoid race between Established condition and CRs actually served. In HA setups, the Established condition is delayed by 5 seconds. ([#63068](https://github.com/kubernetes/kubernetes/pull/63068), [@xmudrii](https://github.com/xmudrii))
* Added `spec.additionalPrinterColumns` to CRDs to define server side printing columns. ([#60991](https://github.com/kubernetes/kubernetes/pull/60991), [@sttts](https://github.com/sttts))
* Added CRD Versioning with NOP converter ([#63830](https://github.com/kubernetes/kubernetes/pull/63830), [@mbohlool](https://github.com/mbohlool))
* Allow "required" and "description" to be used at the CRD OpenAPI validation schema root when the `/status` subresource is enabled. ([#63533](https://github.com/kubernetes/kubernetes/pull/63533), [@sttts](https://github.com/sttts))
* Etcd health checks by the apiserver now ensure the apiserver can connect to and exercise the etcd API. ([#65027](https://github.com/kubernetes/kubernetes/pull/65027), [@liggitt](https://github.com/liggitt)) api- machinery
* The deprecated `--service-account-private-key-file` flag has been removed from the `cloud-controller-manager`. The flag is still present and supported in the `kube-controller-manager`. ([#65182](https://github.com/kubernetes/kubernetes/pull/65182), [@liggitt](https://github.com/liggitt))
* Webhooks for the mutating admission controller now support the "remove" operation. ([#64255](https://github.com/kubernetes/kubernetes/pull/64255), [@rojkov](https://github.com/rojkov)) sig-API machinery
* The CRD OpenAPI v3 specification for validation now allows `additionalProperties`, which are mutually exclusive to properties. ([#62333](https://github.com/kubernetes/kubernetes/pull/62333), [@sttts](https://github.com/sttts))
* Added the apiserver configuration option to choose the audit output version. ([#60056](https://github.com/kubernetes/kubernetes/pull/60056), [@crassirostris](https://github.com/crassirostris))
* Created a new `dryRun` query parameter for mutating endpoints. If the parameter is set, then the query will be rejected, as the feature is not implemented yet. This will allow forward compatibility with future clients; otherwise, future clients talking with older apiservers might end up modifying a resource even if they include the `dryRun` query parameter. ([#63557](https://github.com/kubernetes/kubernetes/pull/63557), [@apelisse](https://github.com/apelisse))
* `list`/`watch` API requests with a `fieldSelector` that specifies `metadata.name` can now be authorized as requests for an individual named resource ([#63469](https://github.com/kubernetes/kubernetes/pull/63469), [@wojtek-t](https://github.com/wojtek-t))
* Exposed `/debug/flags/v` to allow dynamically set glog logging level.  For example, to change glog level to 3, send a PUT request such as `curl -X PUT http://127.0.0.1:8080/debug/flags/v -d "3"`. ([#63777](https://github.com/kubernetes/kubernetes/pull/63777), [@hzxuzhonghu](https://github.com/hzxuzhonghu))
* Exec authenticator plugin supports TLS client certificates. ([#61803](https://github.com/kubernetes/kubernetes/pull/61803), [@awly](https://github.com/awly))
* The `serverAddressByClientCIDRs` property in `metav1.APIGroup`(discovery API) is now optional instead of required. ([#61963](https://github.com/kubernetes/kubernetes/pull/61963), [@roycaihw](https://github.com/roycaihw))
* `apiservices/status` and `certificatesigningrequests/status` now support `GET` and `PATCH` ([#64063](https://github.com/kubernetes/kubernetes/pull/64063), [@roycaihw](https://github.com/roycaihw))
* APIServices with kube-like versions (e.g. `v1`, `v2beta1`, etc.) will be sorted appropriately within each group.  ([#64004](https://github.com/kubernetes/kubernetes/pull/64004), [@mbohlool](https://github.com/mbohlool))
* Event object references with apiversion will now that value. ([#63913](https://github.com/kubernetes/kubernetes/pull/63913), [@deads2k](https://github.com/deads2k))
* Fixes the `kubernetes.default.svc` loopback service resolution to use a loopback configuration. ([#62649](https://github.com/kubernetes/kubernetes/pull/62649), [@liggitt](https://github.com/liggitt))

### SIG Apps

* Added generators for `apps/v1` deployments. ([#61288](https://github.com/kubernetes/kubernetes/pull/61288), [@ayushpateria](https://github.com/ayushpateria))

### SIG Auth

* RBAC information is now included in audit logs via audit.Event annotations:
    * authorization.k8s.io/decision = {allow, forbid}
	* authorization.k8s.io/reason = human-readable reason for the decision ([#58807](https://github.com/kubernetes/kubernetes/pull/58807), [@CaoShuFeng](https://github.com/CaoShuFeng))
* `kubectl certificate approve|deny` will not modify an already approved or denied CSR unless the `--force` flag is provided. ([#61971](https://github.com/kubernetes/kubernetes/pull/61971), [@smarterclayton](https://github.com/smarterclayton))
* The `--bootstrap-kubeconfig` argument to Kubelet previously created the first bootstrap client credentials in the certificates directory as `kubelet-client.key` and `kubelet-client.crt`.  Subsequent certificates created by cert rotation were created in a combined PEM file that was atomically rotated as `kubelet-client-DATE.pem` in that directory, which meant clients relying on the `node.kubeconfig` generated by bootstrapping would never use a rotated cert.  The initial bootstrap certificate is now generated into the cert directory as a PEM file and symlinked to `kubelet-client-current.pem` so that the generated kubeconfig remains valid after rotation. ([#62152](https://github.com/kubernetes/kubernetes/pull/62152), [@smarterclayton](https://github.com/smarterclayton))
* Owner references can now be set during creation, even if the user doesn't have deletion power ([#63403](https://github.com/kubernetes/kubernetes/pull/63403), [@deads2k](https://github.com/deads2k))
* Laid the groundwork for OIDC distributed claims handling in the apiserver authentication token checker. A distributed claim allows the OIDC provider to delegate a claim to a separate URL. ([ref](http://openid.net/specs/openid-connect-core-1_0.html#AggregatedDistributedClaims)). ([#63213](https://github.com/kubernetes/kubernetes/pull/63213), [@filmil](https://github.com/filmil))
* RBAC: all configured authorizers are now checked to determine if an RBAC role or clusterrole escalation (setting permissions the user does not currently have via RBAC) is allowed. ([#56358](https://github.com/kubernetes/kubernetes/pull/56358), [@liggitt](https://github.com/liggitt))
* kube-apiserver: OIDC authentication now supports requiring specific claims with `--oidc-required-claim=<claim>=<value>` Previously, there was no mechanism for a user to specify claims in the OIDC authentication process that were requid to be present in the ID Token with an expected value. This version now makes it possible to require claims support for the OIDC authentication. It allows users to pass in a `--oidc-required-claims` flag, and `key=value` pairs in the API config, which will ensure that the specified required claims are checked against the ID Token claims. ([#62136](https://github.com/kubernetes/kubernetes/pull/62136), [@rithujohn191](https://github.com/rithujohn191))
* Included the list of security groups when failing with the errors that more than one is tagged. ([#58874](https://github.com/kubernetes/kubernetes/pull/58874), [@sorenmat](https://github.com/sorenmat))
* Added proxy for container streaming in kubelet for streaming auth. ([#64006](https://github.com/kubernetes/kubernetes/pull/64006), [@Random-Liu](https://github.com/Random-Liu))
* PodSecurityPolicy admission information has been added to audit logs. ([#58143](https://github.com/kubernetes/kubernetes/pull/58143), [@CaoShuFeng](https://github.com/CaoShuFeng))
* TokenRequests now are required to have an expiration duration between 10 minutes and 2^32 seconds. ([#63999](https://github.com/kubernetes/kubernetes/pull/63999), [@mikedanese](https://github.com/mikedanese))
* The `NodeRestriction` admission plugin now prevents kubelets from modifying/removing taints applied to their Node API object. ([#63167](https://github.com/kubernetes/kubernetes/pull/63167), [@liggitt](https://github.com/liggitt))
* authz: nodes should not be able to delete themselves ([#62818](https://github.com/kubernetes/kubernetes/pull/62818), [@mikedanese](https://github.com/mikedanese))

### SIG Autoscaling

* A cluster-autoscaler ClusterRole is added to cover only the functionality required by Cluster Autoscaler and avoid abusing system:cluster-admin role. Cloud providers other than GCE might want to update their deployments or sample yaml files to reuse the role created via add-on. ([#64503](https://github.com/kubernetes/kubernetes/pull/64503), [@kgolab](https://github.com/kgolab))

### SIG Azure

* The Azure cloud provider now supports standard SKU load balancer and public IP.
`excludeMasterFromStandardLB` defaults to true, which means master nodes are excluded from the standard load balancer. Also note that because all nodes (except master) are added as loadbalancer backends, the standard load balancer doesn't work with the `service.beta.kubernetes.io/azure-load-balancer-mode` annotation.
([#61884](https://github.com/kubernetes/kubernetes/pull/61884), [#62707](https://github.com/kubernetes/kubernetes/pull/62707), [@feiskyer](https://github.com/feiskyer))
* The Azure cloud provider now supports specifying allowed service tags by the `service.beta.kubernetes.io/azure-allowed-service-tags` annotation. ([#61467](https://github.com/kubernetes/kubernetes/pull/61467), [@feiskyer](https://github.com/feiskyer))
* You can now change the size of an azuredisk PVC using `kubectl edit pvc pvc-azuredisk`. Note that this operation will fail if the volume is already attached to a  running VM. ([#64386](https://github.com/kubernetes/kubernetes/pull/64386), [@andyzhangx](https://github.com/andyzhangx))
* Block device support has been added for azure disk. ([#63841](https://github.com/kubernetes/kubernetes/pull/63841), [@andyzhangx](https://github.com/andyzhangx))
* Azure VM names can now contain the underscore (`_`) character ([#63526](https://github.com/kubernetes/kubernetes/pull/63526), [@djsly](https://github.com/djsly))
* Azure disks now support external resource groups.
([#64427](https://github.com/kubernetes/kuernetes/pull/64427), [@andyzhangx](https://github.com/andyzhangx))
* Added reason message logs for non-existant Azure resources.
([#64248](https://github.com/kubernetes/kubernetes/pull/64248), [@feiskyer](https://github.com/feiskyer))

### SIG CLI

* You can now use the `base64decode` function in kubectl go templates to decode base64-encoded data, such as `kubectl get secret SECRET -o go-template='{{ .data.KEY | base64decode }}'`. ([#60755](https://github.com/kubernetes/kubernetes/pull/60755), [@glb](https://github.com/glb))
* `kubectl patch` now supports `--dry-run`. ([#60675](https://github.com/kubernetes/kubernetes/pull/60675), [@timoreimann](https://github.com/timoreimann))
* The global flag `--match-server-version` is now global.  `kubectl version` will respect it. ([#63613](https://github.com/kubernetes/kubernetes/pull/63613), [@deads2k](https://github.com/deads2k))
* kubectl will list all allowed print formats when an invalid format is passed. ([#64371](https://github.com/kubernetes/kubernetes/pull/64371), [@CaoShuFeng](https://github.com/CaoShuFeng))
* The global flag "context" now gets applied to `kubectl config view --minify`. In previous versions, this command was only available for `current-context`. Now it will be easier for users to view other non current contexts when minifying. ([#64608](https://github.com/kubernetes/kubernetes/pull/64608), [@dixudx](https://github.com/dixudx))
* `kubectl apply --prune` supports CronJob resources.  ([#62991](https://github.com/kubernetes/kubernetes/pull/62991), [@tomoe](https://github.com/tomoe))
* The `--dry-run` flag has been enabled for `kubectl auth reconcile` ([#64458](https://github.com/kubernetes/kubernetes/pull/64458), [@mrogers950](https://github.com/mrogers950))
* `kubectl wait` is a new command that allows waiting for one or more resources to be deleted or to reach a specific condition. It adds a `kubectl wait --for=[delete|condition=condition-name] resource/string` command. ([#64034](https://github.com/kubernetes/kubernetes/pull/64034), [@deads2k](https://github.com/deads2k))
* `kubectl auth reconcile` only works with rbac.v1; all the core helpers have been switched over to use the external types. ([#63967](https://github.com/kubernetes/kubernetes/pull/63967), [@deads2k](https://github.com/deads2k))
* kubectl and client-go now detect duplicated names for user, cluster and context when loading kubeconfig and report this condition as an error.  ([#60464](https://github.com/kubernetes/kubernetes/pull/60464), [@roycaihw](https://github.com/roycaihw))
* Added 'UpdateStrategyType' and 'RollingUpdateStrategy' to 'kubectl describe sts' command output. ([#63844](https://github.com/kubernetes/kubernetes/pull/63844), [@tossmilestone](https://github.com/tossmilestone))
* Initial Korean translation for kubectl has been added. ([#62040](https://github.com/kubernetes/kubernetes/pull/62040), [@ianychoi](https://github.com/ianychoi))
* `kubectl cp` now supports completion.
([#60371](https://github.com/kubernetes/kubernetes/pull/60371), [@superbrothers](https://github.com/superbrothers))
* The shortcuts that were moved server-side in at least 1.9 have been removed from being hardcoded in kubectl. This means that the client-based restmappers have been moved to client-go, where everyone who needs them can have access. ([#63507](https://github.com/kubernetes/kubernetes/pull/63507), [@deads2k](https://github.com/deads2k))
* When using `kubectl delete` with selection criteria, the defaults to is now to ignore "not found" errors. Note that this does not apply when deleting a speciic resource. ([#63490](https://github.com/kubernetes/kubernetes/pull/63490), [@deads2k](https://github.com/deads2k))
* `kubectl create [secret | configmap] --from-file` now works on Windows with fully-qualified paths ([#63439](https://github.com/kubernetes/kubernetes/pull/63439), [@liggitt](https://github.com/liggitt))
* Portability across systems has been increased by the use of `/usr/bin/env` in all script shebangs. ([#62657](https://github.com/kubernetes/kubernetes/pull/62657), [@matthyx](https://github.com/matthyx))
* You can now use `kubectl api-resources` to discover resources.
 ([#42873](https://github.com/kubernetes/kubernetes/pull/42873),  [@xilabao](https://github.com/xilabao))
* You can now display requests/limits of extended resources in node allocated resources. ([#46079](https://github.com/kubernetes/kubernetes/pull/46079), [@xiangpengzhao](https://github.com/xiangpengzhao))
* The `--remove-extra-subjects` and `--remove-extra-permissions` flags have been enabled for `kubectl auth reconcile` ([#64541](https://github.com/kubernetes/kubernetes/pull/64541), [@mrogers950](https://github.com/mrogers950))
* kubectl now has improved compatibility with older servers when creating/updating API objects ([#61949](https://github.com/kubernetes/kubernetes/pull/61949), [@liggitt](https://github.com/liggitt))
* `kubectl apply` view/edit-last-applied now supports completion. ([#60499](https://github.com/kubernetes/kubernetes/pull/60499), [@superbrothers](https://github.com/superbrothers))

### SIG Cluster Lifecycle

  * kubeadm: The `:Etcd` struct has been refactored in the v1alpha2 API. All the options now reside under either `.Etcd.Local` or `.Etcd.External`. Automatic conversions from the v1alpha1 API are supported. ([#64066](https://github.com/kubernetes/kubernetes/pull/64066), [@luxas](https://github.com/luxas))
* kubeadm now uses an upgraded API version for the configuration file, `kubeadm.k8s.io/v1alpha2`. kubeadm in v1.11 will still be able to read `v1alpha1` configuration, and will automatically convert the configuration to `v1alpha2`, both internally and when storing the configuration in the ConfigMap in the cluster. ([#63788](https://github.com/kubernetes/kubernetes/pull/63788), [@luxas](https://github.com/luxas))
* Phase `kubeadm alpha phase kubelet` has been added to support dynamic kubelet configuration in kubeadm. ([#57224](https://github.com/kubernetes/kubernetes/pull/57224), [@xiangpengzhao](https://github.com/xiangpengzhao))
* The kubeadm config option `API.ControlPlaneEndpoint` has been extended to take an optional port, which may differ from the apiserver's bind port. ([#62314](https://github.com/kubernetes/kubernetes/pull/62314), [@rjosephwright](https://github.com/rjosephwright))
* The `--cluster-name` parameter has been added to kubeadm init, enabling users to specify the cluster name in kubeconfig. ([#60852](https://github.com/kubernetes/kubernetes/pull/60852), [@karan](https://github.com/karan))
* The logging feature for kubeadm commands now supports a verbosity setting. ([#57661](https://github.com/kubernetes/kubernetes/pull/57661), [@vbmade2000](https://github.com/vbmade2000))
* kubeadm now has a join timeout that can be controlled via the `discoveryTimeout` config option. This option is set to 5 minutes by default. ([#60983](https://github.com/kubernetes/kubernetes/pull/60983), [@rosti](https://github.com/rosti))
* Added the `writable` boolean option to kubeadm config. This option works on a per-volume basis for `ExtraVolumes` config keys. ([#60428](https://github.com/kubernetes/kubernetes/pul60428), [@rosti](https://github.com/rosti))
* Added a new `kubeadm upgrade node config` command. ([#64624](https://github.com/kubernetes/kubernetes/pull/64624), [@luxas](https://github.com/luxas))
* kubeadm now makes the CoreDNS container more secure by dropping (root) capabilities and improves the integrity of the container by running the whole container in read-only.  ([#64473](https://github.com/kubernetes/kubernetes/pull/64473), [@nberlee](https://github.com/nberlee))
* kubeadm now detects the Docker cgroup driver and starts the kubelet with the matching driver. This eliminates a common error experienced by new users in when the Docker cgroup driver is not the same as the one set for the kubelet due to different Linux distributions setting different cgroup drivers for Docker, making it hard to start the kubelet properly.
([#64347](https://github.com/kubernetes/kubernetes/pull/64347), [@neolit123](https://github.com/neolit123))
* Added a 'kubeadm config migrate' command to convert old API types to their newer counterparts in the new, supported API types. This is just a client-side tool; it just executes locally without requiring a cluster to be running, operating in much the same way as a Unix pipe that upgrades config files. ([#64232](https://github.com/kubernetes/kubernetes/pull/64232), [@luxas](https://github.com/luxas))
* kubeadm will now pull required images during preflight checks if it cannot find them on the system. ([#64105](https://github.com/kubernetes/kubernetes/pull/64105), [@chuckha](https://github.com/chuckha))
* "kubeadm init" now writes a structured and versioned kubelet ComponentConfiguration file to `/var/lib/kubelet/config.yaml` and an environment file with runtime flags that you can source in the systemd kubelet dropin to `/var/lib/kubelet/kubeadm-flags.env`. ([#63887](https://github.com/kubernetes/kubernetes/pull/63887), [@luxas](https://github.com/luxas))
* A `kubeadm config print-default` command has now been added. You can use this command to output a starting point when writing your own kubeadm configuration files. ([#63969](https://github.com/kubernetes/kubernetes/pull/63969), [@luxas](https://github.com/luxas))
* Updated kubeadm's minimum supported kubernetes in v1.11.x to 1.10 ([#63920](https://github.com/kubernetes/kubernetes/pull/63920), [@dixudx](https://github.com/dixudx))
* Added the `kubeadm upgrade diff` command to show how static pod manifests will be changed by an upgrade. This command shows the changes that will be made to the static pod manifests before applying them. This is a narrower case than kubeadm upgrade apply --dry-run, which specifically focuses on the static pod manifests. ([#63930](https://github.com/kubernetes/kubernetes/pull/63930), [@liztio](https://github.com/liztio))
* The `kubeadm config images pull` command can now be used to pull container images used by kubeadm. ([#63833](https://github.com/kubernetes/kubernetes/pull/63833), [@chuckha](https://github.com/chuckha))
* kubeadm will now deploy CoreDNS by default instead of KubeDNS ([#63509](https://github.com/kubernetes/kubernetes/pull/63509), [@detiber](https://github.com/detiber))
* Preflight checks for kubeadm no longer validate custom kube-apiserver, kube-controller-manager and kube-scheduler arguments. ([#63673](https://github.com/kubernetes/kubernetes/pull/63673), [@chuckha](https://github.com/chuckha))
* Added a `kubeadm config images list` command that lists required container images for a kubeadm install. ([#63450](https://github.com/kubernetes/kubernetes/pull/63450), [@chuckha](https://github.com/chukha))
* You can now use `kubeadm token` specifying `--kubeconfig`.  In this case, kubeadm searches the current user home path and the environment variable KUBECONFIG for existing files. If provided, the `--kubeconfig` flag will be honored instead. ([#62850](https://github.com/kubernetes/kubernetes/pull/62850), [@neolit123](https://github.com/neolit123))
([#64988](https://github.com/kubernetes/kubernetes/pull/64988), [@detiber](https://github.com/detiber))
* kubeadm now sets peer URLs for the default etcd instance. Previously we left the defaults, which meant the peer URL was unsecured.
* Kubernetes now packages crictl in a cri-tools deb and rpm package. ([#64836](https://github.com/kubernetes/kubernetes/pull/64836), [@chuckha](https://github.com/chuckha))
* kubeadm now prompts the user for confirmation when resetting a master node. ([#59115](https://github.com/kubernetes/kubernetes/pull/59115), [@alexbrand](https://github.com/alexbrand))
* kubead now creates kube-proxy with a toleration to run on all nodes, no matter the taint. ([#62390](https://github.com/kubernetes/kubernetes/pull/62390), [@discordianfish](https://github.com/discordianfish))
* kubeadm now sets the kubelet `--resolv-conf` flag conditionally on init. ([#64665](https://github.com/kubernetes/kubernetes/pull/64665), [@stealthybox](https://github.com/stealthybox))
* Added ipset and udevadm to the hyperkube base image. ([#61357](https://github.com/kubernetes/kubernetes/pull/61357), [@rphillips](https://github.com/rphillips))

### SIG GCP

* Kubernetes clusters on GCE now have crictl installed. Users can use it to help debug their nodes. See the [crictl documentation](https://github.com/kubernetes-incubator/cri-tools/blob/master/docs/crictl.md) for details. ([#63357](https://github.com/kubernetes/kubernetes/pull/63357), [@Random-Liu](https://github.com/Random-Liu))
* `cluster/kube-up.sh` now provisions a Kubelet config file for GCE via the metadata server. This file is installed by the corresponding GCE init scripts. ([#62183](https://github.com/kubernetes/kubernetes/pull/62183), [@mtaufen](https://github.com/mtaufen))
* GCE: Update cloud provider to use TPU v1 API ([#64727](https://github.com/kubernetes/kubernetes/pull/64727), [@yguo0905](https://github.com/yguo0905))
* GCE: Bump GLBC version to 1.1.1 - fixing an issue of handling multiple certs with identical certificates. ([#62751](https://github.com/kubernetes/kubernetes/pull/62751), [@nicksardo](https://github.com/nicksardo))

### SIG Instrumentation

* Added prometheus cluster monitoring addon to kube-up. ([#62195](https://github.com/kubernetes/kubernetes/pull/62195), [@serathius](https://github.com/serathius))
* Kubelet now exposes a new endpoint, `/metrics/probes`, which exposes a Prometheus metric containing the liveness and/or readiness probe results for a container. ([#61369](https://github.com/kubernetes/kubernetes/pull/61369), [@rramkumar1](https://github.com/rramkumar1))

### SIG Network

* The internal IP address of the node is now added as additional information for kubectl. ([#57623](https://github.com/kubernetes/kubernetes/pull/57623), [@dixudx](https://github.com/dixudx))
* NetworkPolicies can now target specific pods in other namespaces by including both a namespaceSelector and a podSelector in the same peer element. ([#60452](https://github.com/kubernetes/kubernetes/pull/60452), [@danwinship](https://github.com/danwinship))
* CoreDNS deployment configuration now uses the k8s.gcr.io imageRepository. ([#64775](https://github.com/kubernetes/kubernetes/pull/64775), [@rajansandeep](https://giub.com/rajansandeep))
* kubelet's `--cni-bin-dir` option now accepts multiple comma-separated CNI binary directory paths, which are searched for CNI plugins in the given order. ([#58714](https://github.com/kubernetes/kubernetes/pull/58714), [@dcbw](https://github.com/dcbw))
* You can now use `--ipvs-exclude-cidrs` to specify a list of CIDR's which the IPVS proxier should not touch when cleaning up IPVS rules. ([#62083](https://github.com/kubernetes/kubernetes/pull/62083), [@rramkumar1](https://github.com/rramkumar1))
* You can now receive node DNS info with the `--node-ip` flag, which adds `ExternalDNS`, `InternalDNS`, and `ExternalIP` to kubelet's output. ([#63170](https://github.com/kubernetes/kubernetes/pull/63170), [@micahhausler](https://github.com/micahhausler))
* You can now have services that listen on the same host ports on different interfaces by specifying `--nodeport-addresses`. ([#62003](https://github.com/kubernetes/kubernetes/pull/62003), [@m1093782566](https://github.com/m1093782566))
* Added port-forward examples for service

### SIG Node

* CRI: The container log path has been changed from containername_attempt#.log to containername/attempt#.log  ([#62015](https://github.com/kubernetes/kubernetes/pull/62015), [@feiskyer](https://github.com/feiskyer))
* Introduced the `ContainersReady` condition in Pod status. ([#64646](https://github.com/kubernetes/kubernetes/pull/64646), [@freehan](https://github.com/freehan))
* Kubelet will now set extended resource capacity to zero after it restarts. If the extended resource is exported by a device plugin, its capacity will change to a valid value after the device plugin re-connects with the Kubelet. If the extended resource is exported by an external component through direct node status capacity patching, the component should repatch the field after kubelet becomes ready again. During the time gap, pods previously assigned with such resources may fail kubelet admission but their controller should create new pods in response to such failures. ([#64784](https://github.com/kubernetes/kubernetes/pull/64784), [@jiayingz](https://github.com/jiayingz)) node
* You can now use a security context with Windows containers
([#64009](https://github.com/kubernetes/kubernetes/pull/64009), [@feiskyer](https://github.com/feiskyer))
* Added e2e regression tests for kubelet security. ([#64140](https://github.com/kubernetes/kubernetes/pull/64140), [@dixudx](https://github.com/dixudx))
* The maximum number of images the Kubelet will report in the Node status can now be controlled via the Kubelet's `--node-status-max-images` flag. The default (50) remains the same. ([#64170](https://github.com/kubernetes/kubernetes/pull/64170), [@mtaufen](https://github.com/mtaufen))
* The Kubelet now exports metrics that report the assigned (`node_config_assigned`), last-known-good (`node_config_last_known_good`), and active (`node_config_active`) config sources, and a metric indicating whether the node is experiencing a config-related error (`node_config_error`). The config source metrics always report the value `1`, and carry the `node_config_name`, `node_config_uid`, `node_config_resource_version`, and `node_config_kubelet_key labels`, which identify the config version. The error metric reports `1` if there is an error, `0` otherwise. ([#57527](https://github.com/kubernetes/kubernetes/pull/57527), [@mtaufen](https://github.com/mtaufen))
* You now have the ability to quota resources by priority. ([#57963](https://github.com/kubernetes/kubernetes/pull/57963), [@vikaschoudhary16](https://github.com/ikaschoudhary16))
* The gRPC max message size in the remote container runtime has been increased to 16MB. ([#64672](https://github.com/kubernetes/kubernetes/pull/64672), [@mcluseau](https://github.com/mcluseau))
* Added a feature gate for the plugin watcher. ([#64605](https://github.com/kubernetes/kubernetes/pull/64605), [@vikaschoudhary16](https://github.com/vikaschoudhary16))
* The status of dynamic Kubelet config is now reported via Node.Status.Config, rather than the KubeletConfigOk node condition. ([#63314](https://github.com/kubernetes/kubernetes/pull/63314), [@mtaufen](https://github.com/mtaufen))
* You must now specify `Node.Spec.ConfigSource.ConfigMap.KubeletConfigKey` when using dynamic Kubelet config to tell the Kubelet which key of the `ConfigMap` identifies its config file. ([#59847](https://github.com/kubernetes/kubernetes/pull/59847), [@mtaufen](https://github.com/mtaufen))
* The dynamic Kubelet config feature will now update the config in the event of a ConfigMap mutation, which reduces the chance for silent config skew. Only name, namespace, and kubeletConfigKey may now be set in `Node.Spec.ConfigSource.ConfigMap`. The least disruptive pattern for config management is still to create a new ConfigMap and incrementally roll out a new `Node.Spec.ConfigSource`. ([#63221](https://github.com/kubernetes/kubernetes/pull/63221), [@mtaufen](https://github.com/mtaufen))
* Change seccomp annotation from "docker/default" to "runtime/default" ([#62662](https://github.com/kubernetes/kubernetes/pull/62662), [@wangzhen127](https://github.com/wangzhen127))
* The node authorizer now automatically sets up rules for `Node.Spec.ConfigSource` when the DynamicKubeletConfig feature gate is enabled. ([#60100](https://github.com/kubernetes/kubernetes/pull/60100), [@mtaufen](https://github.com/mtaufen))
* CRI now defines mounting behavior. If the host path doesn't exist, the runtime should return an error. If the host path is a symlink, the runtime should follow the symlink and mount the real destination to the container. ([#61460](https://github.com/kubernetes/kubernetes/pull/61460), [@feiskyer](https://github.com/feiskyer))

### SIG OpenStack

* Provide a meaningful error message in the openstack cloud provider when no valid IP address can be found for a node, rather than just the first address of the node, which leads to a load balancer error if that address is a hostname or DNS name instead of an IP address. ([#64318](https://github.com/kubernetes/kubernetes/pull/64318), [@gonzolino](https://github.com/gonzolino))
* Restored the pre-1.10 behavior of the openstack cloud provider, which uses the instance name as the Kubernetes Node name. This requires instances be named with RFC-1123 compatible names. ([#63903](https://github.com/kubernetes/kubernetes/pull/63903), [@liggitt](https://github.com/liggitt))
* Kubernetes will try to read the openstack auth config from the client config and fall back to read from the environment variables if the auth config is not available. ([#60200](https://github.com/kubernetes/kubernetes/pull/60200), [@dixudx](https://github.com/dixudx))

### SIG Scheduling

* Schedule DaemonSet Pods in scheduler, rather than the Daemonset controller.
([#63223](https://github.com/kubernetes/kubernetes/pull/63223), [@k82cn](https://github.com/k82cn))
* Added `MatchFields` to `NodeSelectorTerm`; in 1.11, it only supports `metadata.name`. ([#62002](https://github.com/kubernetes/kubernetes/pull/62002), [@k82cn](https://github.com/k82cn))
* kube-scheduler now has the `--write-config-to` flag so that Scheduler canwritets default configuration to a file.
([#62515](https://github.com/kubernetes/kubernetes/pull/62515), [@resouer](https://github.com/resouer))
* Performance of the affinity/anti-affinity predicate for the default scheduler has been significantly improved. ([#62211](https://github.com/kubernetes/kubernetes/pull/62211), [@bsalamat](https://github.com/bsalamat))
* The 'scheduling_latency_seconds' metric into has been split into finer steps (predicate, priority, preemption). ([#65306](https://github.com/kubernetes/kubernetes/pull/65306), [@shyamjvs](https://github.com/shyamjvs))
* Scheduler now has a summary-type metric, 'scheduling_latency_seconds'. ([#64838](https://github.com/kubernetes/kubernetes/pull/64838), [@krzysied](https://github.com/krzysied))
* `nodeSelector.matchFields` (node's `metadata.node`) is now supported in scheduler. ([#62453](https://github.com/kubernetes/kubernetes/pull/62453), [@k82cn](https://github.com/k82cn))
* Added a parametrizable priority function mapping requested/capacity ratio to priority. This function is disabled by default and can be enabled via the scheduler policy config file.
([#63929](https://github.com/kubernetes/kubernetes/pull/63929), [@losipiuk](https://github.com/losipiuk))
* System critical priority classes are now automatically added at cluster boostrapping. ([#60519](https://github.com/kubernetes/kubernetes/pull/60519), [@bsalamat](https://github.com/bsalamat))

### SIG Storage

* AWS EBS, Azure Disk, GCE PD and Ceph RBD volume plugins now support dynamic provisioning of raw block volumes. ([#64447](https://github.com/kubernetes/kubernetes/pull/64447), [@jsafrane](https://github.com/jsafrane))
* gitRepo volumes in pods no longer require git 1.8.5 or newer; older git versions are now supported. ([#62394](https://github.com/kubernetes/kubernetes/pull/62394), [@jsafrane](https://github.com/jsafrane))
* Added support for resizing Portworx volumes. ([#62308](https://github.com/kubernetes/kubernetes/pull/62308), [@harsh-px](https://github.com/harsh-px))
* Added block volume support to Cinder volume plugin. ([#64879](https://github.com/kubernetes/kubernetes/pull/64879), [@bertinatto](https://github.com/bertinatto))
* Provided API support for external CSI storage drivers to support block volumes. ([#64723](https://github.com/kubernetes/kubernetes/pull/64723), [@vladimirvivien](https://github.com/vladimirvivien))
* Volume topology aware dynamic provisioning for external provisioners is now supported. ([#63193](https://github.com/kubernetes/kubernetes/pull/63193), [@lichuqiang](https://github.com/lichuqiang))
* Added a volume projection that is able to project service account tokens. ([#62005](https://github.com/kubernetes/kubernetes/pull/62005), [@mikedanese](https://github.com/mikedanese))
* PodSecurityPolicy now supports restricting hostPath volume mounts to be readOnly and under specific path prefixes ([#58647](https://github.com/kubernetes/kubernetes/pull/58647), [@jhorwit2](https://github.com/jhorwit2))
* Added StorageClass API to restrict topologies of dynamically provisioned volumes. ([#63233](https://github.com/kubernetes/kubernetes/pull/63233), [@lichuqiang](https://github.com/lichuqiang))
* Added Alpha support for dynamic volume limits based on node type ([#64154](https://github.com/kubernetes/kubernetes/pull/64154), [@gnufied](https://github.com/gnufied))
* AWS EBS volumes can be now used as ReadOnly in pods. ([#64403](https://github.com/kubernetes/kubernetes/pull/64403), [@jsafrane](https://github.com/jsafrane))
* Basic plumbing for volume topology aware dynamic provisionin has been implemented. ([#63232](https://github.com/kubernetes/kubernetes/pull/63232), [@lichuqiang](https://github.com/lichuqiang))
* Changed ext3/ext4 volume creation to not reserve any portion of the volume for the root user. When creating ext3/ext4 volume, mkfs defaults to reserving 5% of the volume for the super-user (root). This patch changes the mkfs to pass -m0 to disable this setting.
([#64102](https://github.com/kubernetes/kubernetes/pull/64102), [@atombender](https://github.com/atombender))
* Added support for NFS relations on kubernetes-worker charm. ([#63817](https://github.com/kubernetes/kubernetes/pull/63817), [@hyperbolic2346](https://github.com/hyperbolic2346))
* Implemented kubelet side online file system resizing ([#62460](https://github.com/kubernetes/kubernetes/pull/62460), [@mlmhl](https://github.com/mlmhl))
* Generated subpath name from Downward API env ([#49388](https://github.com/kubernetes/kubernetes/pull/49388), [@kevtaylor](https://github.com/kevtaylor))

### SIG vSphere

* Added a mechanism in vSphere Cloud Provider to get credentials from Kubernetes secrets, rather than the plain text `vsphere.conf` file.([#63902](https://github.com/kubernetes/kubernetes/pull/63902), [@abrarshivani](https://github.com/abrarshivani))
* vSphere Cloud Provider: added SAML token authentication support ([#63824](https://github.com/kubernetes/kubernetes/pull/63824), [@dougm](https://github.com/dougm))

### SIG Windows

* Added log and fs stats for Windows containers. ([#62266](https://github.com/kubernetes/kubernetes/pull/62266), [@feiskyer](https://github.com/feiskyer))
* Added security contexts for Windows containers. [#64009](https://github.com/kubernetes/kubernetes/pull/64009), ([@feiskyer](https://github.com/feiskyer))
* Added local persistent volumes for Windows containers. ([#62012](https://github.com/kubernetes/kubernetes/pull/62012), [@andyzhangx](https://github.com/andyzhangx)) and fstype for Azure disk ([#61267](https://github.com/kubernetes/kubernetes/pull/61267), [@andyzhangx](https://github.com/andyzhangx))
* Improvements in Windows Server version 1803 also bring new storage functionality to Kubernetes v1.11, including:
   * Volume mounts for ConfigMap and Secret
   * Flexvolume plugins for SMB and iSCSI storage are also available out-of-tree at [Microsoft/K8s-Storage-Plugins](https://github.com/Microsoft/K8s-Storage-Plugins)
* Setup dns servers and search domains for Windows Pods in dockershim. Docker EE version >= 17.10.0 is required for propagating DNS to containers. ([#63905](https://github.com/kubernetes/kubernetes/pull/63905), [@feiskyer](https://github.com/feiskyer))

### Additional changes

* Extended the Stackdriver Metadata Agent by adding a new Deployment for ingesting unscheduled pods and services.   ([#62043](https://github.com/kubernetes/kubernetes/pull/62043), [@supriyagarg](https://github.com/supriyagarg))
* Added all kinds of resource objects' statuses in HPA description. ([#59609](https://github.com/kubernetes/kubernetes/pull/59609), [@zhangxiaoyu-zidif](https://github.com/zhangxiaoyu-zidif))
* Implemented preemption for extender with a verb and new interface ([#58717](https://github.com/kubernetes/kubernetes/pull/58717), [@resouer](https://github.com/resouer))
* Updated nvidia-gpu-device-plugin DaemonSet config to use RollingUpdate updateStrategy instead of OnDelete. ([#64296](https://github.com/kubernetes/kubernetes/pull/64296), [@mindprince](https://github.com/mindprince))
* increased grpc client default response size. ([#63977](https://github.com/kubernetes/kubernetes/pull/677), [@runcom](https://github.com/runcom))
* Applied pod name and namespace labels to pod cgroup in cAdvisor metrics ([#63406](https://github.com/kubernetes/kubernetes/pull/63406), [@derekwaynecarr](https://github.com/derekwaynecarr))
* [fluentd-gcp addon] Use the logging agent's node name as the metadata agent URL. ([#63353](https://github.com/kubernetes/kubernetes/pull/63353), [@bmoyles0117](https://github.com/bmoyles0117))
* The new default value for the --allow-privileged parameter of the Kubernetes-worker charm has been set to true based on changes which went into the Kubernetes 1.10 release. Before this change the default value was set to false. If you're installing Canonical Kubernetes you should expect this value to now be true by default and you should now look to use PSP (pod security policies).  ([#64104](https://github.com/kubernetes/kubernetes/pull/64104), [@CalvinHartwell](https://github.com/CalvinHartwell))

## External Dependencies

* Default etcd server version is v3.2.18 compared with v3.1.12 in v1.10 ([#61198](https://github.com/kubernetes/kubernetes/pull/61198))
* Rescheduler is v0.4.0, compared with v0.3.1 in v1.10 ([#65454](https://github.com/kubernetes/kubernetes/pull/65454))
* The validated docker versions are the same as for v1.10: 1.11.2 to 1.13.1 and 17.03.x (ref)
* The Go version is go1.10.2, as compared to go1.9.3 in v1.10. ([#63412](https://github.com/kubernetes/kubernetes/pull/63412))
* The minimum supported go is the same as for v1.10: go1.9.1. ([#55301](https://github.com/kubernetes/kubernetes/pull/55301))
* CNI is the same as v1.10: v0.6.0 ([#51250](https://github.com/kubernetes/kubernetes/pull/51250))
* CSI is updated to 0.3.0 as compared to 0.2.0 in v1.10. ([#64719](https://github.com/kubernetes/kubernetes/pull/64719))
* The dashboard add-on is the same as v1.10: v1.8.3. ([#517326](https://github.com/kubernetes/kubernetes/pull/57326))
* Bump Heapster to v1.5.2 as compared to v1.5.0 in v1.10 ([#61396](https://github.com/kubernetes/kubernetes/pull/61396))
* Updates Cluster Autoscaler version to v1.3.0 from v1.2.0 in v1.10. See [release notes](https://github.com/kubernetes/autoscaler/releases/tag/cluster-autoscaler-1.3.0) for details. ([#65219](https://github.com/kubernetes/kubernetes/pull/65219))
* Kube-dns has been updated to v1.14.10, as compared to v1.14.8 in v1.10 ([#62676](https://github.com/kubernetes/kubernetes/pull/62676))
* Influxdb is unchanged from v1.10: v1.3.3 ([#53319](https://github.com/kubernetes/kubernetes/pull/53319))
* Grafana is unchanged from v1.10: v4.4.3 ([#53319](https://github.com/kubernetes/kubernetes/pull/53319))
* CAdvisor is v0.30.1, as opposed to v0.29.1 in v1.10 ([#64987](https://github.com/kubernetes/kubernetes/pull/64987))
* fluentd-gcp-scaler is unchanged from v1.10: v0.3.0 ([#61269](https://github.com/kubernetes/kubernetes/pull/61269))
* fluentd in fluentd-es-image is unchanged from 1.10: v1.1.0 ([#58525](https://github.com/kubernetes/kubernetes/pull/58525))
* fluentd-elasticsearch is unchanged from 1.10: v2.0.4 ([#58525](https://github.com/kubernetes/kubernetes/pull/58525))
* fluentd-gcp is unchanged from 1.10: v3.0.0. ([#60722](https://github.com/kubernetes/kubernetes/pull/60722))
* Ingress glbc is unchanged from 1.10: v1.0.0 ([#61302](https://github.com/kubernetes/kubernetes/pull/61302))
* OIDC authentication is unchanged from 1.10: coreos/go-oidc v2 ([#58544](https://github.com/kubernetes/kubernetes/pull/58544))
* Calico is unchanged from 1.10: v2.6.7 ([#59130](https://github.com/kubernetes/kubernetes/pull/59130))
* hcsshim has been updated to v0..11 ([#64272](https://github.com/kubernetes/kubernetes/pull/64272))
* gitRepo volumes in pods no longer require git 1.8.5 or newer; older git versions are now supported. ([#62394](https://github.com/kubernetes/kubernetes/pull/62394))
* Update crictl on GCE to v1.11.0. ([#65254](https://github.com/kubernetes/kubernetes/pull/65254))
* CoreDNS is now v1.1.3 ([#64258](https://github.com/kubernetes/kubernetes/pull/64258))
* Setup dns servers and search domains for Windows Pods in dockershim. Docker EE version >= 17.10.0 is required for propagating DNS to containers. ([#63905](https://github.com/kubernetes/kubernetes/pull/63905))
* Update version of Istio addon from 0.5.1 to 0.8.0. See [full Istio release notes](https://istio.io/about/notes/0.6.html).([#64537](https://github.com/kubernetes/kubernetes/pull/64537))
* Update cadvisor godeps to v0.30.0 ([#64800](https://github.com/kubernetes/kubernetes/pull/64800))
* Update event-exporter to version v0.2.0  that supports old (gke_container/gce_instance) and new (k8s_container/k8s_node/k8s_pod) stackdriver resources. ([#63918](https://github.com/kubernetes/kubernetes/pull/63918))
* Rev the Azure SDK for networking to 2017-06-01 ([#61955](https://github.com/kubernetes/kubernetes/pull/61955))

## Bug Fixes

* Fixed spurious "unable to find api field" errors patching custom resources ([#63146](https://github.com/kubernetes/kubernetes/pull/63146), [@liggitt](https://github.com/liggitt))
* Nodes are not deleted from kubernetes anymore if node is shutdown in Openstack. ([#59931](https://github.com/kubernetes/kubernetes/pull/59931), [@zetaab](https://github.com/zetaab))
* Re-enabled nodeipam controller for external clouds. Re-enables nodeipam controller for external clouds. Also does a small refactor so that we don't need to pass in allocateNodeCidr into the controller.
 ([#63049](https://github.com/kubernetes/kubernetes/pull/63049), [@andrewsykim](https://github.com/andrewsykim))
* Fixed a configuration error when upgrading kubeadm from 1.9 to 1.10+; Kubernetes must have the same major and minor versions as the kubeadm library. ([#62568](https://github.com/kubernetes/kubernetes/pull/62568), [@liztio](https://github.com/liztio))
* kubectl no longer renders a List as suffix kind name for CRD resources ([#62512](https://github.com/kubernetes/kubernetes/pull/62512), [@dixudx](https://github.com/dixudx))
* Restored old behavior to the `--template` flag in `get.go`. In old releases, providing a `--template` flag value and no `--output` value implicitly assigned a default value ("go-template") to `--output`, printing using the provided template argument.
([#65377](https://github.com/kubernetes/kubernetes/pull/65377),[@juanvallejo](https://github.com/juanvallejo))
* Ensured cloudprovider.InstanceNotFound is reported when the VM is not found on Azure ([#61531](https://github.com/kubernetes/kubernetes/pull/61531), [@feiskyer](https://github.com/feiskyer))
* Kubernetes version command line parameter in kubeadm has been updated to drop an unnecessary redirection from ci/latest.txt to ci-cross/latest.txt. Users should know exactly where the builds are stored on Google Cloud storage buckets from now on. For example for 1.9 and 1.10, users can specify ci/latest-1.9 and ci/latest-1.10 as the CI build jobs what build images correctly updates those. The CI jobs for master update the ci-cross/latest location, so if you are looking for latest master builds, then the correct parameter to use would be ci-cross/latest. ([#63504](https://github.com/kubernetes/kubernetes/pull/63504), [@dims](https://github.cm/dims))
* Fixes incompatibility with custom scheduler extender configurations specifying `bindVerb` ([#65424](https://github.com/kubernetes/kubernetes/pull/65424), [@liggitt](https://github.com/liggitt))
* kubectl built for darwin from darwin now enables cgo to use the system-native C libraries for DNS resolution. Cross-compiled kubectl (e.g. from an official kubernetes release) still uses the go-native netgo DNS implementation.  ([#64219](https://github.com/kubernetes/kubernetes/pull/64219), [@ixdy](https://github.com/ixdy))
* API server properly parses propagationPolicy as a query parameter sent with a delete request ([#63414](https://github.com/kubernetes/kubernetes/pull/63414), [@roycaihw](https://github.com/roycaihw))
* Corrected a race condition in bootstrapping aggregated cluster roles in new HA clusters ([#63761](https://github.com/kubernetes/kubernetes/pull/63761), [@liggitt](https://github.com/liggitt))
* kubelet: fix hangs in updating Node status after network interruptions/changes between the kubelet and API server ([#63492](https://github.com/kubernetes/kubernetes/pull/63492), [@liggitt](https://github.com/liggitt))
* Added log and fs stats for Windows containers ([#62266](https://github.com/kubernetes/kubernetes/pull/62266), [@feiskyer](https://github.com/feiskyer))
* Fail fast if cgroups-per-qos is set on Windows ([#62984](https://github.com/kubernetes/kubernetes/pull/62984), [@feiskyer](https://github.com/feiskyer))
* Minor fix for VolumeZoneChecker predicate, storageclass can be in annotation and spec. ([#63749](https://github.com/kubernetes/kubernetes/pull/63749), [@wenlxie](https://github.com/wenlxie))
* Fixes issue for readOnly subpath mounts for SELinux systems and when the volume mountPath already existed in the container image. ([#64351](https://github.com/kubernetes/kubernetes/pull/64351), [@msau42](https://github.com/msau42))
* Fixed CSI gRPC connection leak during volume operations. ([#64519](https://github.com/kubernetes/kubernetes/pull/64519), [@vladimirvivien](https://github.com/vladimirvivien))
* Fixed error reporting of CSI volumes attachment. ([#63303](https://github.com/kubernetes/kubernetes/pull/63303), [@jsafrane](https://github.com/jsafrane))
* Fixed SELinux relabeling of CSI volumes. ([#64026](https://github.com/kubernetes/kubernetes/pull/64026), [@jsafrane](https://github.com/jsafrane))
* Fixed detach of already detached CSI volumes. ([#63295](https://github.com/kubernetes/kubernetes/pull/63295), [@jsafrane](https://github.com/jsafrane))
* fix rbd device works at block mode not get mapped to container  ([#64555](https://github.com/kubernetes/kubernetes/pull/64555), [@wenlxie](https://github.com/wenlxie))
* Fixed an issue where Portworx PVCs remain in pending state when created using a StorageClass with empty parameters ([#64895](https://github.com/kubernetes/kubernetes/pull/64895), [@harsh-px](https://github.com/harsh-px)) storage
* FIX: The OpenStack cloud providers DeleteRoute method fails to delete routes when it can’t find the corresponding instance in OpenStack. (#62729, databus23)
* [fluentd-gcp addon] Increase CPU limit for fluentd to 1 core to achieve 100kb/s throughput. ([#62430](https://github.com/kubernetes/kubernetes/pull/62430), [@bmoyles0117](https://github.com/bmoyles0117))
* GCE: Fixed operation polling to adhere to the specified interval. Furthermore, operation errors are now returned instead of ignored. ([#64630](https://github.com/kubernetes/kubernetes/pull/64630), [@nicksardo](https://github.com/nicksardo))
* Included kms-plugin-container.manifest to master nifests tarball. ([#65035](https://github.com/kubernetes/kubernetes/pull/65035), [@immutableT](https://github.com/immutableT))
* Fixed missing nodes lines when kubectl top nodes ([#64389](https://github.com/kubernetes/kubernetes/pull/64389), [@yue9944882](https://github.com/yue9944882)) sig-cli
* Fixed kubectl drain --timeout option when eviction is used. ([#64378](https://github.com/kubernetes/kubernetes/pull/64378), [@wrdls](https://github.com/wrdls)) sig-cli
* Fixed kubectl auth can-i exit code. It will return 1 if the user is not allowed and 0 if it's allowed. ([#59579](https://github.com/kubernetes/kubernetes/pull/59579), [@fbac](https://github.com/fbac))
* Fixed data loss issue if using existing azure disk with partitions in disk mount  ([#63270](https://github.com/kubernetes/kubernetes/pull/63270), [@andyzhangx](https://github.com/andyzhangx))
* Fixed azure file size grow issue ([#64383](https://github.com/kubernetes/kubernetes/pull/64383), [@andyzhangx](https://github.com/andyzhangx))
* Fixed SessionAffinity not updated issue for Azure load balancer ([#64180](https://github.com/kubernetes/kubernetes/pull/64180), [@feiskyer](https://github.com/feiskyer))
* Fixed kube-controller-manager panic while provisioning Azure security group rules ([#64739](https://github.com/kubernetes/kubernetes/pull/64739), [@feiskyer](https://github.com/feiskyer))
* Fixed API server panic during concurrent GET or LIST requests with non-empty `resourceVersion`. ([#65092](https://github.com/kubernetes/kubernetes/pull/65092), [@sttts](https://github.com/sttts))
* Fixed incorrect OpenAPI schema for CustomResourceDefinition objects ([#65256](https://github.com/kubernetes/kubernetes/pull/65256), [@liggitt](https://github.com/liggitt))
* Fixed issue where PersistentVolume.NodeAffinity.NodeSelectorTerms were ANDed instead of ORed. ([#62556](https://github.com/kubernetes/kubernetes/pull/62556), [@msau42](https://github.com/msau42))
* Fixed potential infinite loop that can occur when NFS PVs are recycled. ([#62572](https://github.com/kubernetes/kubernetes/pull/62572), [@joelsmith](https://github.com/joelsmith))
* Fixed column alignment when kubectl get is used with custom columns from OpenAPI schema ([#56629](https://github.com/kubernetes/kubernetes/pull/56629), [@luksa](https://github.com/luksa))
* kubectl: restore the ability to show resource kinds when displaying multiple objects ([#61985](https://github.com/kubernetes/kubernetes/pull/61985), [@liggitt](https://github.com/liggitt))
* Fixed a panic in `kubectl run --attach ...` when the api server failed to create the runtime object (due to name conflict, PSP restriction, etc.) ([#61713](https://github.com/kubernetes/kubernetes/pull/61713), [@mountkin](https://github.com/mountkin))
* kube-scheduler has been fixed to use `--leader-elect` option back to true (as it was in previous versions) ([#59732](https://github.com/kubernetes/kubernetes/pull/59732), [@dims](https://github.com/dims))
* kubectl: fixes issue with `-o yaml` and `-o json` omitting kind and apiVersion when used with `--dry-run` ([#61808](https://github.com/kubernetes/kubernetes/pull/61808), [@liggitt](https://github.com/liggitt))
* Ensure reasons end up as comments in `kubectl edit`. ([#60990](https://github.com/kubernetes/kubernetes/pull/60990), [@bmcstdio](https://github.com/bmcstdio))
* Fixes issue where subpath readOnly mounts failed ([#63045](https://github.com/kubernetes/kubernetes/pull/63045), [@msau42](https://github.com/msau42))
* Fix stackdriver metrics for node memory using wrong metric type ([#63535](https://github.co/kubernetes/kubernetes/pull/63535), [@serathius](https://github.com/serathius))
* fix mount unmount failure for a Windows pod ([#63272](https://github.com/kubernetes/kubernetes/pull/63272), [@andyzhangx](https://github.com/andyzhangx))

### General Fixes and Reliability

* Fixed a regression in kube-scheduler to properly load client connection information from a `--config` file that references a kubeconfig file. ([#65507](https://github.com/kubernetes/kubernetes/pull/65507), [@liggitt](https://github.com/liggitt))
* Fix regression in `v1.JobSpec.backoffLimit` that caused failed Jobs to be restarted indefinitely. ([#63650](https://github.com/kubernetes/kubernetes/pull/63650), [@soltysh](https://github.com/soltysh))
* fixes a potential deadlock in the garbage collection controller ([#64235](https://github.com/kubernetes/kubernetes/pull/64235), [@liggitt](https://github.com/liggitt))
* fix formatAndMount func issue on Windows ([#63248](https://github.com/kubernetes/kubernetes/pull/63248), [@andyzhangx](https://github.com/andyzhangx))
* Fix issue of colliding nodePorts when the cluster has services with externalTrafficPolicy=Local ([#64349](https://github.com/kubernetes/kubernetes/pull/64349), [@nicksardo](https://github.com/nicksardo))
* fixes a panic applying json patches containing out of bounds operations ([#64355](https://github.com/kubernetes/kubernetes/pull/64355), [@liggitt](https://github.com/liggitt))
* Fix incorrectly propagated ResourceVersion in ListRequests returning 0 items. ([#64150](https://github.com/kubernetes/kubernetes/pull/64150), [@wojtek-t](https://github.com/wojtek-t))
* GCE: Fix to make the built-in `kubernetes` service properly point to the master's load balancer address in clusters that use multiple master VMs. ([#63696](https://github.com/kubernetes/kubernetes/pull/63696), [@grosskur](https://github.com/grosskur))
* Fixes fake client generation for non-namespaced subresources ([#60445](https://github.com/kubernetes/kubernetes/pull/60445), [@jhorwit2](https://github.com/jhorwit2))
* Schedule even if extender is not available when using extender  ([#61445](https://github.com/kubernetes/kubernetes/pull/61445), [@resouer](https://github.com/resouer))
* Fix panic create/update CRD when mutating/validating webhook configured. ([#61404](https://github.com/kubernetes/kubernetes/pull/61404), [@hzxuzhonghu](https://github.com/hzxuzhonghu))
* Pods requesting resources prefixed with `*kubernetes.io` will remain unscheduled if there are no nodes exposing that resource. ([#61860](https://github.com/kubernetes/kubernetes/pull/61860), [@mindprince](https://github.com/mindprince))
* fix scheduling policy on ConfigMap breaks without the --policy-configmap-namespace flag set ([#61388](https://github.com/kubernetes/kubernetes/pull/61388), [@zjj2wry](https://github.com/zjj2wry))
* Bugfix for erroneous upgrade needed messaging in kubernetes worker charm. ([#60873](https://github.com/kubernetes/kubernetes/pull/60873), [@wwwtyro](https://github.com/wwwtyro))
* Fix inter-pod anti-affinity check to consider a pod a match when all the anti-affinity terms match. ([#62715](https://github.com/kubernetes/kubernetes/pull/62715), [@bsalamat](https://github.com/bsalamat))
* Pod affinity `nodeSelectorTerm.matchExpressions` may now be empty, and works as previously documented: nil or empty `matchExpressions` matches no objects in scheduler. ([#62448](https://github.com/kubernetes/kubernetes/pull/62448), [@k82cn](https://github.com/k82cn))
* Fix an issue in inter-pod affinity predicate that cause affinity to self being processed correctly ([#62591](https://github.com/kubernetes/kubernetes/pull/62591), [@bsalamat](https://github.com/bsalamat))
* fix WaitForAttach failure issue for azure disk ([#62612](https://github.com/kubernetes/kubernetes/pull/62612), [@andyzhangx](https://github.com/andyzhangx))
* Fix user visible files creation for windows ([#62375](https://github.com/kubernetes/kubernetes/pull/62375), [@feiskyer](https://github.com/feiskyer))
* Fix machineID getting for vmss nodes when using instance metadata ([#62611](https://github.com/kubernetes/kubernetes/pull/62611), [@feiskyer](https://github.com/feiskyer))
* Fix Forward chain default reject policy for IPVS proxier ([#62007](https://github.com/kubernetes/kubernetes/pull/62007), [@m1093782566](https://github.com/m1093782566))
* fix nsenter GetFileType issue in containerized kubelet ([#62467](https://github.com/kubernetes/kubernetes/pull/62467), [@andyzhangx](https://github.com/andyzhangx))
* Ensure expected load balancer is selected for Azure ([#62450](https://github.com/kubernetes/kubernetes/pull/62450), [@feiskyer](https://github.com/feiskyer))
* Resolves forbidden error when the `daemon-set-controller` cluster role access `controllerrevisions` resources. ([#62146](https://github.com/kubernetes/kubernetes/pull/62146), [@frodenas](https://github.com/frodenas))
* fix incompatible file type checking on Windows ([#62154](https://github.com/kubernetes/kubernetes/pull/62154), [@dixudx](https://github.com/dixudx))
* fix local volume absolute path issue on Windows ([#620s18](https://github.com/kubernetes/kubernetes/pull/62018), [@andyzhangx](https://github.com/andyzhangx))
* fix the issue that default azure disk fsypte(ext4) does not work on Windows ([#62250](https://github.com/kubernetes/kubernetes/pull/62250), [@andyzhangx](https://github.com/andyzhangx))
* Fixed bug in rbd-nbd utility when nbd is used. ([#62168](https://github.com/kubernetes/kubernetes/pull/62168), [@piontec](https://github.com/piontec))
* fix local volume issue on Windows ([#62012](https://github.com/kubernetes/kubernetes/pull/62012), [@andyzhangx](https://github.com/andyzhangx))
* Fix a bug that fluentd doesn't inject container logs for CRI container runtimes (containerd, cri-o etc.) into elasticsearch on GCE. ([#61818](https://github.com/kubernetes/kubernetes/pull/61818), [@Random-Liu](https://github.com/Random-Liu))
* flexvolume: trigger plugin init only for the relevant plugin while probe ([#58519](https://github.com/kubernetes/kubernetes/pull/58519), [@linyouchong](https://github.com/linyouchong))
* Fixed ingress issue with CDK and pre-1.9 versions of kubernetes. ([#61859](https://github.com/kubernetes/kubernetes/pull/61859), [@hyperbolic2346](https://github.com/hyperbolic2346))
* Fixed racy panics when using fake watches with ObjectTracker ([#61195](https://github.com/kubernetes/kubernetes/pull/61195), [@grantr](https://github.com/grantr))
* Fixed mounting of UNIX sockets(and other special files) in subpaths ([#61480](https://github.com/kubernetes/kubernetes/pull/61480), [@gnufscied](https://github.com/gnufied))
* Fixed [#61123](https://github.com/kubernetes/kubernetes/pull/61123) by triggering syncer.Update on all cases including when a syncer is created ([#61124](https://github.com/kubernetes/kubernetes/pull/61124), [@satyasm](https://github.com/satyasm))
* Fixed data race in node lifecycle controller ([#60831](https://github.com/kubernetes/kubernetes/pull/60831), [@resouer](https://github.com/resouer))
* Fixed resultRun by resetting it to 0 on pod restart ([#62853](https://github.com/kubernetes/kubernetes/pull62853), [@tony612](https://github.com/tony612))
* Fixed the liveness probe to use `/bin/bash -c` instead of `/bin/bash c`. ([#63033](https://github.com/kubernetes/kubernetes/pull/63033), [@bmoyles0117](https://github.com/bmoyles0117))
* Fixed scheduler informers to receive events for all the pods in the cluster. ([#63003](https://github.com/kubernetes/kubernetes/pull/63003), [@bsalamat](https://github.com/bsalamat))
* Fixed in vSphere Cloud Provider to handle upgrades from kubernetes version less than v1.9.4 to v1.9.4 and above. ([#62919](https://github.com/kubernetes/kubernetes/pull/62919), [@abrarshivani](https://github.com/abrarshivani))
* Fixed error where config map for Metadata Agent was not created by addon manager. ([#62909](https://github.com/kubernetes/kubernetes/pull/62909), [@kawych](https://github.com/kawych))
* Fixed permissions to allow statefulset scaling for admins, editors, and viewers ([#62336](https://github.com/kubernetes/kubernetes/pull/62336), [@deads2k](https://github.com/deads2k))
* GCE: Fixed for internal load balancer management resulting in backend services with outdated instance group links. ([#62885](https://github.com/kubernetes/kubernetes/pull/62885), [@nicksardo](https://github.com/nicksardo))
* Deployment will stop adding pod-template-hash labels/selector to ReplicaSets and Pods it adopts. Resources created by Deployments are not affected (will still have pod-template-hash labels/selector).  ([#61615](https://github.com/kubernetes/kubernetes/pull/61615), [@janetkuo](https://github.com/janetkuo))
* Used inline func to ensure unlock is executed ([#61644](https://github.com/kubernetes/kubernetes/pull/61644), [@resouer](https://github.com/resouer))
* kubernetes-master charm now properly clears the client-ca-file setting on the apiserver snap ([#61479](https://github.com/kubernetes/kubernetes/pull/61479), [@hyperbolic2346](https://github.com/hyperbolic2346))
* Bound cloud allocator to 10 retries with 100 ms delay between retries. ([#61375](https://github.com/kubernetes/kubernetes/pull/61375), [@satyasm](https://github.com/satyasm))
* Respect fstype in Windows for azure disk ([#61267](https://github.com/kubernetes/kubernetes/pull/61267), [@andyzhangx](https://github.com/andyzhangx))
* Unready pods will no longer impact the number of desired replicas when using horizontal auto-scaling with external metrics or object metrics. ([#60886](https://github.com/kubernetes/kubernetes/pull/60886), [@mattjmcnaughton](https://github.com/mattjmcnaughton))
* Removed unsafe double RLock in cpumanager ([#62464](https://github.com/kubernetes/kubernetes/pull/62464), [@choury](https://github.com/choury))

## Non-user-facing changes

* Remove UID mutation from request.context. ([#63957](https://github.com/kubernetes/kubernetes/pull/63957), [@hzxuzhonghu](https://github.com/hzxuzhonghu))
* Use Patch instead of Put to sync pod status. ([#62306](https://github.com/kubernetes/kubernetes/pull/62306), [@freehan](https://github.com/freehan))
* Allow env from resource with keys & updated tests ([#60636](https://github.com/kubernetes/kubernetes/pull/60636), [@PhilipGough](https://github.com/PhilipGough))
* set EnableHTTPSTrafficOnly in azure storage account creation ([#64957](https://github.com/kubernetes/kubernetes/pull/64957), [@andyzhangx](https://github.com/andyzhangx))
* New conformance test added for Watch. ([#61424](https://github.com/kubernetes/kubernetes/pull/61424), [@jennybuckley](https://github.com/jennybuckley))
* Use DeleteOptions.PropagationPolicy instead of OrphanDependents in kubectl  ([#59851](https://thub.com/kubernetes/kubernetes/pull/59851), [@nilebox](https://github.com/nilebox))
* Add probe based mechanism for kubelet plugin discovery ([#63328](https://github.com/kubernetes/kubernetes/pull/63328), [@vikaschoudhary16](https://github.com/vikaschoudhary16))
* keep pod state consistent when scheduler cache UpdatePod ([#64692](https://github.com/kubernetes/kubernetes/pull/64692),  [@adohe](https://github.com/adohe))
* kubectl delete does not use reapers for removing objects anymore, but relies on server-side GC entirely ([#63979](https://github.com/kubernetes/kubernetes/pull/63979), [@soltysh](https://github.com/soltysh))
* Updated default image for nginx ingress in CDK to match current Kubernetes docs. ([#64285](https://github.com/kubernetes/kubernetes/pull/64285), [@hyperbolic2346](https://github.com/hyperbolic2346))
* Increase scheduler cache generation number monotonically in order to avoid collision and use of stale information in scheduler. ([#63264](https://github.com/kubernetes/kubernetes/pull/63264), [@bsalamat](https://github.com/bsalamat))
* Adding CSI driver registration code. ([#64560](https://github.com/kubernetes/kubernetes/pull/64560), [@sbezverk](https://github.com/sbezverk))
* Do not check vmSetName when getting Azure node's IP ([#63541](https://github.com/kubernetes/kubernetes/pull/63541), [@feiskyer](https://github.com/feiskyer))
* [fluentd-gcp addon] Update event-exporter image to have the latest base image. ([#61727](https://github.com/kubernetes/kubernetes/pull/61727), [@crassirostris](https://github.com/crassirostris))
* Make volume usage metrics available for Cinder ([#62668](https://github.com/kubernetes/kubernetes/pull/62668), [@zetaab](https://github.com/zetaab))
* cinder volume plugin : When the cinder volume status is `error`,  controller will not do `attach ` and `detach ` operation ([#61082](https://github.com/kubernetes/kubernetes/pull/61082), [@wenlxie](https://github.com/wenlxie))
* Allow user to scale l7 default backend deployment ([#62685](https://github.com/kubernetes/kubernetes/pull/62685), [@freehan](https://github.com/freehan))
* Add support to ingest log entries to Stackdriver against new "k8s_container" and "k8s_node" resources. ([#62076](https://github.com/kubernetes/kubernetes/pull/62076), [@qingling128](https://github.com/qingling128))
* Disabled CheckNodeMemoryPressure and CheckNodeDiskPressure predicates if TaintNodesByCondition enabled ([#60398](https://github.com/kubernetes/kubernetes/pull/60398), [@k82cn](https://github.com/k82cn))
* Support custom test configuration for IPAM performance integration tests ([#61959](https://github.com/kubernetes/kubernetes/pull/61959), [@satyasm](https://github.com/satyasm))
* OIDC authentication now allows tokens without an "email_verified" claim when using the "email" claim. If an "email_verified" claim is present when using the "email" claim, it must be `true`. ([#61508](https://github.com/kubernetes/kubernetes/pull/61508), [@rithujohn191](https://github.com/rithujohn191))
* Add e2e test for CRD Watch ([#61025](https://github.com/kubernetes/kubernetes/pull/61025), [@ayushpateria](https://github.com/ayushpateria))
* Return error if get NodeStageSecret and NodePublishSecret failed in CSI volume plugin ([#61096](https://github.com/kubernetes/kubernetes/pull/61096), [@mlmhl](https://github.com/mlmhl))
* kubernetes-master charm now supports metrics server for horizontal pod autoscaler. ([#60174](https://github.com/kubernetes/kubernetes/pull/60174), [@hyperbolic2346](https://github.com/hyperbolic2346))
* In a GCE cluster, the default `HIRPIN_MODE` is now "hairpin-veth". ([#60166](https://github.com/kubernetes/kubernetes/pull/60166), [@rramkumar1](https://github.com/rramkumar1))
* Balanced resource allocation priority in scheduler to include volume count on node  ([#60525](https://github.com/kubernetes/kubernetes/pull/60525), [@ravisantoshgudimetla](https://github.com/ravisantoshgudimetla))
* new dhcp-domain parameter to be used for figuring out the hostname of a node ([#61890](https://github.com/kubernetes/kubernetes/pull/61890), [@dims](https://github.com/dims))
* Disable ipamperf integration tests as part of every PR verification. ([#61863](https://github.com/kubernetes/kubernetes/pull/61863), [@satyasm](https://github.com/satyasm))
* Enable server-side print in kubectl by default, with the ability to turn it off with --server-print=false ([#61477](https://github.com/kubernetes/kubernetes/pull/61477), [@soltysh](https://github.com/soltysh))
* Updated admission controller settings for Juju deployed Kubernetes clusters ([#61427](https://github.com/kubernetes/kubernetes/pull/61427), [@hyperbolic2346](https://github.com/hyperbolic2346))
* Performance test framework and basic tests for the IPAM controller, to simulate behavior of the four supported modes under lightly loaded and loaded conditions, where load is defined as the number of operations to perform as against the configured kubernetes. ([#61143](https://github.com/kubernetes/kubernetes/pull/61143), [@satyasm](https://github.com/satyasm))
* Removed always pull policy from the template for ingress on CDK. ([#61598](https://github.com/kubernetes/kubernetes/pull/61598), [@hyperbolic2346](https://github.com/hyperbolic2346))
* `make test-cmd` now works on OSX. ([#61393](https://github.com/kubernetes/kubernetes/pull/61393), [@totherme](https://github.com/totherme))
* Conformance: ReplicaSet must be supported in the `apps/v1` version. ([#61367](https://github.com/kubernetes/kubernetes/pull/61367), [@enisoc](https://github.com/enisoc))
* Remove 'system' prefix from Metadata Agent rbac configuration ([#61394](https://github.com/kubernetes/kubernetes/pull/61394), [@kawych](https://github.com/kawych))
* Support new NODE_OS_DISTRIBUTION 'custom' on GCE on a new add event. ([#61235](https://github.com/kubernetes/kubernetes/pull/61235), [@yguo0905](https://github.com/yguo0905))
* include file name in the error when visiting files ([#60919](https://github.com/kubernetes/kubernetes/pull/60919), [@dixudx](https://github.com/dixudx))
* Split PodPriority and PodPreemption feature gate ([#62243](https://github.com/kubernetes/kubernetes/pull/62243), [@resouer](https://github.com/resouer))
* Code generated for CRDs now passes `go vet`. ([#62412](https://github.com/kubernetes/kubernetes/pull/62412), [@bhcleek](https://github.com/bhcleek))
* "beginPort+offset" format support for port range which affects kube-proxy only ([#58731](https://github.com/kubernetes/kubernetes/pull/58731), [@yue9944882](https://github.com/yue9944882))
* Added e2e test for watch ([#60331](https://github.com/kubernetes/kubernetes/pull/60331), [@jennybuckley](https://github.com/jennybuckley))
* add warnings on using pod-infra-container-image for remote container runtime ([#62982](https://github.com/kubernetes/kubernetes/pull/62982), [@dixudx](https://github.com/dixudx))
* Mount additional paths required for a working CA root, for setups where /etc/ssl/certs doesn't contains certificates but just symlink. ([#59122](https://github.com/kubernetes/kubernetes/pull/59122), [@klausenbusk](https://github.com/klausenbusk))
* Introduce truncating audit bacnd that can be enabled for existing backend to limit the size of individual audit events and batches of events. ([#61711](https://github.com/kubernetes/kubernetes/pull/61711), [@crassirostris](https://github.com/crassirostris))
* stop kubelet to cloud provider integration potentially wedging kubelet sync loop ([#62543](https://github.com/kubernetes/kubernetes/pull/62543), [@ingvagabund](https://github.com/ingvagabund))
* Set pod status to "Running" if there is at least one container still reporting as "Running" status and others are "Completed". ([#62642](https://github.com/kubernetes/kubernetes/pull/62642), [@ceshihao](https://github.com/ceshihao))
* Fix memory cgroup notifications, and reduce associated log spam. ([#63220](https://github.com/kubernetes/kubernetes/pull/63220), [@dashpole](https://github.com/dashpole))
* Remove never used NewCronJobControllerFromClient method (#59471, dmathieu)

{{% /capture %}}
