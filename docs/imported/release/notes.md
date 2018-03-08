---
title: v1.10 Release Notes
---

<!-- BEGIN MUNGE: GENERATED_TOC -->
- [v1.10.0](#v1100)
   - [Downloads for v1.10.0](#downloads-for-v1100)
      - [Client Binaries](#client-binaries)
      - [Server Binaries](#server-binaries)
      - [Node Binaries](#node-binaries)
   - [Major Themes](#major-themes)
      - [Node](#node)
      - [Storage](#storage)
      - [Windows](#windows)
      - [OpenStack](#openstack)
      - [API-machinery](#api-machinery)
      - [Auth](#auth)
      - [Azure](#azure)
      - [CLI](#cli)
      - [Cluster Lifecycle](#cluster-lifecycle)
      - [Network](#network)
   - [Before Upgrading](#before-upgrading)
   - [Known Issues](#known-issues)
   - [Deprecations](#deprecations)
   - [Other Notable Changes](#other-notable-changes)
      - [Apps](#apps)
      - [AWS](#aws)
      - [Auth](#auth-1)
      - [CLI](#cli-1)
      - [Cluster Lifecycle](#cluster-lifecycle-1)
      - [GCP](#gcp)
      - [Instrumentation](#instrumentation)
      - [Node](#node-1)
      - [OpenStack](#openstack-1)
      - [Scalability](#scalability)
      - [Storage](#storage-1)
      - [Windows](#windows-1)
      - [Autoscaling](#autoscaling)
      - [API-Machinery](#api-machinery-1)
      - [Network](#network-1)
      - [Azure](#azure-1)
      - [Scheduling](#scheduling)
      - [Other changes](#other-changes)
   - [Non-user-facing Changes](#non-user-facing-changes)
   - [External Dependencies](#external-dependencies)
- [v1.10.0-rc.1](#v1100-rc1)
   - [Downloads for v1.10.0-rc.1](#downloads-for-v1100-rc1)
      - [Client Binaries](#client-binaries-1)
      - [Server Binaries](#server-binaries-1)
      - [Node Binaries](#node-binaries-1)
   - [Changelog since v1.10.0-beta.4](#changelog-since-v1100-beta4)
      - [Other notable changes](#other-notable-changes-1)
- [v1.10.0-beta.4](#v1100-beta4)
   - [Downloads for v1.10.0-beta.4](#downloads-for-v1100-beta4)
      - [Client Binaries](#client-binaries-2)
      - [Server Binaries](#server-binaries-2)
      - [Node Binaries](#node-binaries-2)
   - [Changelog since v1.10.0-beta.3](#changelog-since-v1100-beta3)
      - [Other notable changes](#other-notable-changes-2)
- [v1.10.0-beta.3](#v1100-beta3)
   - [Downloads for v1.10.0-beta.3](#downloads-for-v1100-beta3)
      - [Client Binaries](#client-binaries-3)
      - [Server Binaries](#server-binaries-3)
      - [Node Binaries](#node-binaries-3)
   - [Changelog since v1.10.0-beta.2](#changelog-since-v1100-beta2)
      - [Other notable changes](#other-notable-changes-3)
- [v1.10.0-beta.2](#v1100-beta2)
   - [Downloads for v1.10.0-beta.2](#downloads-for-v1100-beta2)
      - [Client Binaries](#client-binaries-4)
      - [Server Binaries](#server-binaries-4)
      - [Node Binaries](#node-binaries-4)
   - [Changelog since v1.10.0-beta.1](#changelog-since-v1100-beta1)
      - [Action Required](#action-required)
      - [Other notable changes](#other-notable-changes-4)
- [v1.10.0-beta.1](#v1100-beta1)
   - [Downloads for v1.10.0-beta.1](#downloads-for-v1100-beta1)
      - [Client Binaries](#client-binaries-5)
      - [Server Binaries](#server-binaries-5)
      - [Node Binaries](#node-binaries-5)
   - [Changelog since v1.10.0-alpha.3](#changelog-since-v1100-alpha3)
      - [Action Required](#action-required-1)
      - [Other notable changes](#other-notable-changes-5)
- [v1.10.0-alpha.3](#v1100-alpha3)
   - [Downloads for v1.10.0-alpha.3](#downloads-for-v1100-alpha3)
      - [Client Binaries](#client-binaries-6)
      - [Server Binaries](#server-binaries-6)
      - [Node Binaries](#node-binaries-6)
   - [Changelog since v1.10.0-alpha.2](#changelog-since-v1100-alpha2)
      - [Other notable changes](#other-notable-changes-6)
- [v1.10.0-alpha.2](#v1100-alpha2)
   - [Downloads for v1.10.0-alpha.2](#downloads-for-v1100-alpha2)
      - [Client Binaries](#client-binaries-7)
      - [Server Binaries](#server-binaries-7)
      - [Node Binaries](#node-binaries-7)
   - [Changelog since v1.10.0-alpha.1](#changelog-since-v1100-alpha1)
      - [Action Required](#action-required-2)
      - [Other notable changes](#other-notable-changes-7)
- [v1.10.0-alpha.1](#v1100-alpha1)
   - [Downloads for v1.10.0-alpha.1](#downloads-for-v1100-alpha1)
      - [Client Binaries](#client-binaries-8)
      - [Server Binaries](#server-binaries-8)
      - [Node Binaries](#node-binaries-8)
   - [Changelog since v1.9.0](#changelog-since-v190)
      - [Action Required](#action-required-3)
      - [Other notable changes](#other-notable-changes-8)

<!-- END MUNGE: GENERATED_TOC -->

<!-- NEW RELEASE NOTES ENTRY -->


# v1.10.0

[Documentation](https://docs.k8s.io) & [Examples](https://releases.k8s.io/release-1.10/examples)

## Downloads for v1.10.0


filename | sha256 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.10.0/kubernetes.tar.gz) | `a48d4f6eb4bf329a87915d2264250f2045aab1e8c6cc3e574a887ec42b5c6edc`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.10.0/kubernetes-src.tar.gz) | `3b51bf50370fc022f5e4578b071db6b63963cd64b35c41954d4a2a8f6738c0a7`

### Client Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.10.0/kubernetes-client-darwin-386.tar.gz) | `8f35d820d21bfdb3186074eb2ed5212b983e119215356a7a76a9f773f2a1e6a3`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.10.0/kubernetes-client-darwin-amd64.tar.gz) | `ae06d0cd8f6fa8d145a9dbdb77e6cba99ad9cfce98b01c766df1394c17443e42`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.10.0/kubernetes-client-linux-386.tar.gz) | `8147723a68763b9791def5b41d75745e835ddd82f23465a2ba7797b84ad73554`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0/kubernetes-client-linux-amd64.tar.gz) | `845668fe2f854b05aa6f0b133314df83bb41a486a6ba613dbb1374bf3fbe8720`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0/kubernetes-client-linux-arm.tar.gz) | `5d2552a6781ef0ecaf308fe6a02637faef217c98841196d4bd7c52a0f1a4bfa0`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0/kubernetes-client-linux-arm64.tar.gz) | `9d5e4ba43ad7250429015f33f728c366daa81e894e8bfe8063d73ce990e82944`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0/kubernetes-client-linux-ppc64le.tar.gz) | `acabf3a26870303641ce60a59b5bb9702c8a7445b16f4293abc7868e91d252c8`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0/kubernetes-client-linux-s390x.tar.gz) | `8d836df10b50d11434b5ee797aecc21714723f02fc47fe3dd600426eb83b9e38`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.10.0/kubernetes-client-windows-386.tar.gz) | `ca183b66f910ff11fa468e47251c68d256ef145fcfc2d23d4347d066e7787971`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0/kubernetes-client-windows-amd64.tar.gz) | `817aea754a059c635f4d690aa0232a8e77eb74e76357cafd8f10556972022e9e`

### Server Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0/kubernetes-server-linux-amd64.tar.gz) | `f2e0505bee7d9217332b96be11d1b88c06f51049f7a44666b0ede80bfb92fdf6`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0/kubernetes-server-linux-arm.tar.gz) | `a7be68c32a299c98353633f3161f910c4b970c8364ccee5f98e1991364b3ce69`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0/kubernetes-server-linux-arm64.tar.gz) | `4df4add2891d02101818653ac68b57e6ce4760fd298f47467ce767ac029f4508`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0/kubernetes-server-linux-ppc64le.tar.gz) | `199b52461930c0218f984884069770fb7e6ceaf66342d5855b209ff1889025b8`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0/kubernetes-server-linux-s390x.tar.gz) | `578f93fc22d2a5bec7dc36633946eb5b7359d96233a2ce74f8b3c5a231494584`

### Node Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0/kubernetes-node-linux-amd64.tar.gz) | `8c03412881eaab5f3ea828bbb81e8ebcfc092d311b2685585817531fa7c2a289`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0/kubernetes-node-linux-arm.tar.gz) | `d6a413fcadb1b933a761ac9b0c864f596498a8ac3cc4922c1569306cd0047b1d`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0/kubernetes-node-linux-arm64.tar.gz) | `46d6b74759fbc3b2aad42357f019dae0e882cd4639e499e31b5b029340dabd42`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0/kubernetes-node-linux-ppc64le.tar.gz) | `bdecc12feab2464ad917623ade0cbf58675e0566db38284b79445841d246fc08`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0/kubernetes-node-linux-s390x.tar.gz) | `afe35c2854f35939be75ccfb0ec81399acf4043ae7cf19dd6fbe6386288972c2`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0/kubernetes-node-windows-amd64.tar.gz) | `eac14e3420ca9769e067cbf929b5383cd77d56e460880a30c0df1bbfbb5a43db`

## Major Themes

### Node

Many of the changes within SIG-Node revolve around control. With the beta release of the `kubelet.config.k8s.io` API group, a significant subset of Kubelet configuration can now be [configured via a versioned config file](https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/). Kubernetes v1.10 adds alpha support for the ability to [configure whether containers in a pod should share a single process namespace](https://github.com/kubernetes/features/issues/495), and the CRI has been upgraded to v1alpha2, which adds [support for Windows Container Configuration](https://github.com/kubernetes/features/issues/547). Kubernetes v1.10 also ships with the beta release of the [CRI validation test suite](https://github.com/kubernetes/features/issues/292). 

The Resource Management Working Group graduated three features to beta in the 1.10 release.  First, [CPU Manager](https://kubernetes.io/docs/tasks/administer-cluster/cpu-management-policies/), which allows users to request exclusive CPU cores.  This helps performance in a variety of use-cases, including network latency sensitive applications, as well as applications that benefit from CPU cache residency.  Next, [Huge Pages](https://kubernetes.io/docs/tasks/manage-hugepages/scheduling-hugepages/), which allows pods to consume either 2Mi or 1Gi Huge Pages.  This benefits applications that consume large amounts of memory.  Use of Huge Pages is a common tuning recommendation for databases and JVMs.  Finally, the [Device Plugin](https://kubernetes.io/docs/concepts/cluster-administration/device-plugins/) feature, which provides a framework for vendors to advertise their resources to the Kubelet without changing Kubernetes core code.  Targeted devices include GPUs, High-performance NICs, FPGAs, InfiniBand, and other similar computing resources that may require vendor specific initialization and setup.

### Storage

This release brings additional power to both local storage and Persistent Volumes. [Mount namespace propagation](https://github.com/kubernetes/features/issues/432) allows a container to mount a volume as rslave so that host mounts can be seen inside the container, or as rshared so that mounts made inside a container can be seen by the host. (Note that this is [not supported on Windows](https://github.com/kubernetes/kubernetes/pull/60275).) [Local Ephemeral Storage Capacity Isolation](https://github.com/kubernetes/features/issues/361) makes it possible to set requests and limits on ephemeral local storage resources. In addition, you can now create [Local Persistent Storage](https://github.com/kubernetes/features/issues/121), which enables PersistentVolumes to be created with locally attached disks, and not just network volumes.

On the Persistent Volumes side, this release [Prevents deletion of Persistent Volume Claims that are used by a pod](https://github.com/kubernetes/features/issues/498) and [Persistent Volumes that are bound to a Persistent Volume Claim](https://github.com/kubernetes/features/issues/499), making it impossible to delete storage that is in use by a pod. 

This release also includes [Topology Aware Volume Scheduling](https://github.com/kubernetes/features/issues/490) for local persistent volumes, the stable release of [Detailed storage metrics of internal state](https://github.com/kubernetes/features/issues/496), and beta support for [Out-of-tree CSI Volume Plugins](https://github.com/kubernetes/features/issues/178).

### Windows

This release continues to enable more existing features on Windows, including container CPU resources, image filesystem stats, and flexvolumes. It also adds Windows service control manager support and experimental support for Hyper-V isolation of single-container pods.

### OpenStack

SIG-OpenStack updated the OpenStack provider to use newer APIs, consolidated community code into one repository, engaged with the Cloud Provider Working Group to have a consistent plan for moving provider code into individual repositories, improved testing of provider code, and strengthened ties with the OpenStack developer community.

### API-machinery

[API Aggregation](https://github.com/kubernetes/features/issues/263) has been upgraded to "stable" in Kubernetes 1.10, so you can use it in production. Webhooks have seen numerous improvements, including alpha [Support for self-hosting authorizer webhooks](https://github.com/kubernetes/features/issues/516).

### Auth

This release lays the groundwork for new authentication methods, including the alpha release of [External client-go credential providers](https://github.com/kubernetes/features/issues/541)  and the [TokenRequest API](https://github.com/kubernetes/features/issues/542). In addition, [Pod Security Policy](https://github.com/kubernetes/features/issues/5) now lets administrators decide what contexts pods can run in, and gives administrators the ability to [limit node access to the API](https://github.com/kubernetes/features/issues/279).

### Azure

Kubernetes 1.10 includes alpha [Azure support for cluster-autoscaler](https://github.com/kubernetes/features/issues/514), as well as [support for Azure Virtual Machine Scale Sets](https://github.com/kubernetes/features/issues/513).

### CLI

This release includes a change to [kubectl get and describe to work better with extensions](https://github.com/kubernetes/features/issues/515), as the server, rather than the client, returns this information for a smoother user experience.

### Network

In terms of networking, Kubernetes 1.10 is about control. Users now have beta support for the ability to [configure a pod's resolv.conf](https://github.com/kubernetes/features/issues/504), rather than relying on the cluster DNS, as well as [configuring the NodePort IP address](https://github.com/kubernetes/features/issues/539). You can also  [switch the default DNS plugin to CoreDNS](https://github.com/kubernetes/features/issues/427) (beta). 

## Before Upgrading

* In-place node upgrades to this release from versions 1.7.14, 1.8.9, and 1.9.4 are not supported if using subpath volumes with PVCs.  Such pods should be drained from the node first.

* The minimum supported version of Docker is now 1.11; if you are using Docker 1.10 or below, be sure to upgrade Docker before upgrading Kubernetes. ([#57845](https://github.com/kubernetes/kubernetes/pull/57845), [@yujuhong](https://github.com/yujuhong))

* The Container Runtime Interface (CRI) version has increased from v1alpha1 to v1alpha2. Runtimes implementing the CRI will need to update to the new version, which configures container namespaces using an enumeration rather than booleans. This change to the alpha API is not backwards compatible; implementations of the CRI such as containerd, will need to update to the new API version. ([#58973](https://github.com/kubernetes/kubernetes/pull/58973), [@verb](https://github.com/verb))

* The default Flexvolume plugin directory for COS images on GCE has changed to `/home/kubernetes/flexvolume`, rather than `/etc/srv/kubernetes/kubelet-plugins/volume/exec`. Existing Flexvolume installations in clusters using COS images must be moved to the new directory, and installation processes must be updated with the new path. ([#58171](https://github.com/kubernetes/kubernetes/pull/58171), [@verult](https://github.com/verult))

* Default values differ between the Kubelet's componentconfig (config file) API and the Kubelet's command line. Be sure to review the default values when migrating to using a config file. For example, the authz mode is set to "AlwaysAllow" if you rely on the command line, but defaults to the more secure "Webhook" mode if you load config from a file. ([#59666](https://github.com/kubernetes/kubernetes/pull/59666), [@mtaufen](https://github.com/mtaufen))

* [GCP kube-up.sh] Variables that were part of kube-env that were only used for kubelet flags are no longer being set, and are being replaced by the more portable mechanism of the kubelet configuration file. The individual variables in the kube-env metadata entry were never meant to be a stable interface and this release note only applies if you are depending on them. ([#60020](https://github.com/kubernetes/kubernetes/pull/60020), [@roberthbailey](https://github.com/roberthbailey))

* kube-proxy: feature gates are now specified as a map when provided via a JSON or YAML KubeProxyConfiguration, rather than as a string of key-value pairs. For example:

KubeProxyConfiguration Before:

```
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
**featureGates: "SupportIPVSProxyMode=true"**
```

KubeProxyConfiguration After:

```
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
**featureGates:**
**  SupportIPVSProxyMode: true**
```

([#57962](https://github.com/kubernetes/kubernetes/pull/57962), [@xiangpengzhao](https://github.com/xiangpengzhao))

* The `kubeletconfig` API group has graduated from alpha to beta, and the name has changed to `kubelet.config.k8s.io`. Please use `kubelet.config.k8s.io/v1beta1`, as `kubeletconfig/v1alpha1` is no longer available.  ([#53833](https://github.com/kubernetes/kubernetes/pull/53833), [@mtaufen](https://github.com/mtaufen))

* kube-apiserver: the experimental in-tree Keystone password authenticator has been removed in favor of extensions that enable use of Keystone tokens. ([#59492](https://github.com/kubernetes/kubernetes/pull/59492), [@dims](https://github.com/dims))

* The udpTimeoutMilliseconds field in the kube-proxy configuration file has been renamed to udpIdleTimeout. Administrators must update their files accordingly. ([#57754](https://github.com/kubernetes/kubernetes/pull/57754), [@ncdc](https://github.com/ncdc))

* The kubelet's `--cloud-provider=auto-detect` feature has been removed; make certain to specify the cloud provider. ([#56287](https://github.com/kubernetes/kubernetes/pull/56287), [@stewart-yu](https://github.com/stewart-yu))

* kube-apiserver: the OpenID Connect authenticator no longer accepts tokens from the Google v3 token APIs; users must switch to the "https://www.googleapis.com/oauth2/v4/token" endpoint.

* kube-apiserver: the root /proxy paths have been removed (deprecated since v1.2). Use the /proxy subresources on objects that support HTTP proxying. ([#59884](https://github.com/kubernetes/kubernetes/pull/59884), [@mikedanese](https://github.com/mikedanese))

* Eviction thresholds set to 0% or 100% will turn off eviction. ([#59681](https://github.com/kubernetes/kubernetes/pull/59681), [@mtaufen](https://github.com/mtaufen))

* CustomResourceDefinitions: OpenAPI v3 validation schemas containing `$ref`references are no longer permitted. Before upgrading, ensure CRD definitions do not include those `$ref` fields. ([#58438](https://github.com/kubernetes/kubernetes/pull/58438), [@carlory](https://github.com/carlory))

* Webhooks now do not skip cluster-scoped resources. Before upgrading your Kubernetes clusters, double check whether you have configured webhooks for cluster-scoped objects (e.g., nodes, persistentVolume), as these webhooks will start to take effect. Delete/modify the configs if that's not desirable. ([#58185](https://github.com/kubernetes/kubernetes/pull/58185), [@caesarxuchao](https://github.com/caesarxuchao))

* Using kubectl gcp auth plugin with a Google Service Account to authenticate to a cluster now additionally requests a token with the  "userinfo.email" scope. This way, users can write ClusterRoleBindings/RoleBindings with the email address of the service account directly. (This is a breaking change if the numeric uniqueIDs of the Google service accounts were being used in RBAC role bindings. The behavior can be overridden by explicitly specifying the scope values as comma-separated string in the "users[*].config.scopes" field in the KUBECONFIG file.) This way, users can now  set a Google Service Account JSON key in the  GOOGLE_APPLICATION_CREDENTIALS environment variable, craft a kubeconfig file with GKE master IP+CA cert, and authenticate to GKE in headless mode without requiring gcloud CLI. ([#58141](https://github.com/kubernetes/kubernetes/pull/58141), [@ahmetb](https://github.com/ahmetb))

* kubectl port-forward no longer supports the deprecated -p <pod-name> flag; the flag itself is unnecessary and should be replaced by just the `<pod-name>`. ([#59705](https://github.com/kubernetes/kubernetes/pull/59705), [@phsiao](https://github.com/phsiao))

* Removed deprecated --require-kubeconfig flag, removed default --kubeconfig value (([#58367](https://github.com/kubernetes/kubernetes/pull/58367), [@zhangxiaoyu-zidif](https://github.com/zhangxiaoyu-zidif))

* The public-address-override, address, and port flags have been removed and replaced by bind-address, insecure-bind-address, and insecure-port, respectively. They are marked as deprecated in [#36604](https://github.com/kubernetes/kubernetes/pull/36604), which is more than a year ago.  ([#59018](https://github.com/kubernetes/kubernetes/pull/59018), [@hzxuzhonghu](https://github.com/hzxuzhonghu))

* The alpha `--init-config-dir` flag has been removed. Instead, use the `--config` flag to reference a kubelet configuration file directly. ([#57624](https://github.com/kubernetes/kubernetes/pull/57624), [@mtaufen](https://github.com/mtaufen))

* Removed deprecated and unmaintained salt support. kubernetes-salt.tar.gz will no longer be published in the release tarball. ([#58248](https://github.com/kubernetes/kubernetes/pull/58248), [@mikedanese](https://github.com/mikedanese))

* The deprecated –mode switch for GCE has been removed.([#61203](https://github.com/kubernetes/kubernetes/pull/61203))

* The word “manifest” has been expunged from the Kubelet API. ([#60314](https://github.com/kubernetes/kubernetes/pull/60314))

* [https://github.com/kubernetes/kubernetes/issues/49213](https://github.com/kubernetes/kubernetes/issues/49213) sig-cluster-lifecycle has decided to phase out the cluster/ directory over the next couple of releases in favor of deployment automations maintained outside of the core repo and outside of kubernetes orgs. [@kubernetes/sig-cluster-lifecycle-misc](https://github.com/orgs/kubernetes/teams/sig-cluster-lifecycle-misc))

    * Remove deprecated ContainerVM support from GCE kube-up.  ([#58247](https://github.com/kubernetes/kubernetes/pull/58247), [@mikedanese](https://github.com/mikedanese))

    * Remove deprecated kube-push.sh functionality.  ([#58246](https://github.com/kubernetes/kubernetes/pull/58246), [@mikedanese](https://github.com/mikedanese))

    * Remove deprecated container-linux support in gce kube-up.sh.  ([#58098](https://github.com/kubernetes/kubernetes/pull/58098), [@mikedanese](https://github.com/mikedanese))

    * Remove deprecated and unmaintained photon-controller kube-up.sh.  ([#58096](https://github.com/kubernetes/kubernetes/pull/58096), [@mikedanese](https://github.com/mikedanese))

    * Remove deprecated and unmaintained libvirt-coreos kube-up.sh.  ([#58023](https://github.com/kubernetes/kubernetes/pull/58023), [@mikedanese](https://github.com/mikedanese))

    * Remove deprecated and unmaintained windows installer.  ([#58020](https://github.com/kubernetes/kubernetes/pull/58020), [@mikedanese](https://github.com/mikedanese))

    * Remove deprecated and unmaintained openstack-heat kube-up.sh.  ([#58021](https://github.com/kubernetes/kubernetes/pull/58021), [@mikedanese](https://github.com/mikedanese))

    * Remove deprecated vagrant kube-up.sh. ([#58118](https://github.com/kubernetes/kubernetes/pull/58118),[@roberthbailey](https://github.com/roberthbailey))

* The DaemonSet controller, its integration tests, and its e2e tests, have been updated to use the apps/v1 API. Users should, but are not yet required to, update their scripts accordingly. ([#59883](https://github.com/kubernetes/kubernetes/pull/59883), [@kow3ns](https://github.com/kow3ns))

* MountPropagation feature is now beta. As a consequence, all volume mounts in containers are now `rslave` on Linux by default. To make this default work in all Linux environments the entire mount tree should be marked as shareable, e.g. via `mount --make-rshared /`. All Linux distributions that use systemd already have the root directory mounted as rshared and hence they need not do anything. In Linux environments without systemd we recommend running `mount --make-rshared /` during boot before docker is started, ([@jsafrane](https://github.com/jsafrane))

## Known Issues

* Use of subPath module with hostPath volumes can cause issues during reconstruction ([#61446](https://github.com/kubernetes/kubernetes/issues/61446)) and with containerized kubelets ([#61456](https://github.com/kubernetes/kubernetes/issues/61456)). The workaround for this issue is to specify the complete path in the hostPath volume. Use of subPathmounts nested within atomic writer volumes (configmap, secret, downwardAPI, projected) does not work ([#61545](https://github.com/kubernetes/kubernetes/issues/61545)), and socket files cannot be loaded from a subPath ([#62377](https://github.com/kubernetes/kubernetes/issues/61377)). Work on these issues is ongoing.

* Kubeadm is currently omitting etcd certificates in a self-hosted deployment; this will be fixed in a point relelase. ([#61322](https://github.com/kubernetes/kubernetes/issues/61322))

* Some users, especially those with very large clusters, may see higher memory usage by the kube-controller-manager in 1.10. ([#61041](https://github.com/kubernetes/kubernetes/issues/61041))

## Deprecations

* etcd2 as a backend is deprecated and support will be removed in Kubernetes 1.13.

* VolumeScheduling and LocalPersistentVolume features are beta and enabled by default.  The PersistentVolume NodeAffinity alpha annotation is deprecated and will be removed in a future release. ([#59391](https://github.com/kubernetes/kubernetes/pull/59391), [@msau42](https://github.com/msau42))

* The alpha Accelerators feature gate is deprecated and will be removed in v1.11. Please use device plugins ([https://github.com/kubernetes/features/issues/368](https://github.com/kubernetes/features/issues/368)) instead. They can be enabled using the DevicePlugins feature gate. ([#57384](https://github.com/kubernetes/kubernetes/pull/57384), [@mindprince](https://github.com/mindprince))

* The ability to use kubectl scale jobs is deprecated. All other scale operations remain in place, but the ability to scale jobs will be removed in a future release.  ([#60139](https://github.com/kubernetes/kubernetes/pull/60139), [@soltysh](https://github.com/soltysh))

* Flags that can be set via the [Kubelet's --config file](https://kubernetes.io/docs/tasks/administer-cluster/kubelet-config-file/) are now deprecated in favor of the file. ([#60148](https://github.com/kubernetes/kubernetes/pull/60148), [@mtaufen](https://github.com/mtaufen))

* `--show-all` (which only affected pods and only for human readable/non-API printers) is now defaulted to true and deprecated.  The flag determines whether pods in a terminal state are displayed. It will be inert in 1.11 and removed in a future release. ([#60210](https://github.com/kubernetes/kubernetes/pull/60210), [@deads2k](https://github.com/deads2k))

* The ability to use the insecure HTTP port of kube-controller-manager and cloud-controller-manager has been deprecated, and will be removed in a future release. Use `--secure-port` and `--bind-address` instead. ([#59582](https://github.com/kubernetes/kubernetes/pull/59582), [@sttts](https://github.com/sttts))

* The ability to use the insecure flags `--insecure-bind-address`, `--insecure-port` in the apiserver has been deprecated and will be removed in a future release. Use `--secure-port` and `--bind-address` instead. ([#59018](https://github.com/kubernetes/kubernetes/pull/59018), [@hzxuzhonghu](https://github.com/hzxuzhonghu))

* The recycling reclaim policy has been deprecated. Users should use dynamic provisioning instead. ([#59063](https://github.com/kubernetes/kubernetes/pull/59063), [@ayushpateria](https://github.com/ayushpateria))

* kube-apiserver flag --tls-ca-file has had no effect for some time.  It is now deprecated and slated for removal in 1.11.  If you are specifying this flag, you must remove it from your launch config before upgrading to 1.11. ([#58968](https://github.com/kubernetes/kubernetes/pull/58968), [@deads2k](https://github.com/deads2k))

* The `PodSecurityPolicy` API has been moved to the `policy/v1beta1` API group. The `PodSecurityPolicy` API in the `extensions/v1beta1` API group is deprecated and will be removed in a future release. Authorizations for using pod security policy resources should change to reference the `policy` API group after upgrading to 1.11. ([#54933](https://github.com/kubernetes/kubernetes/pull/54933), [@php-coder](https://github.com/php-coder))

* Add `--enable-admission-plugin` `--disable-admission-plugin` flags and deprecate `--admission-control`. When using the separate flag, the order in which they're specified doesn't matter.  ([#58123](https://github.com/kubernetes/kubernetes/pull/58123), [@hzxuzhonghu](https://github.com/hzxuzhonghu))

* The kubelet  --docker-disable-shared-pid flag, which runs docker containers with a process namespace that is shared between all containers in a pod, is now deprecated and will be removed in a future release. It is replaced by `v1.Pod.Spec.ShareProcessNamespace`, which configures this behavior. This field is alpha and can be enabled with --feature-gates=PodShareProcessNamespace=true. ([#58093](https://github.com/kubernetes/kubernetes/pull/58093), [@verb](https://github.com/verb))

* The kubelet's cadvisor port has been deprecated. The default will change to 0 (disabled) in 1.12, and the cadvisor port will be removed entirely in 1.13. ([#59827](https://github.com/kubernetes/kubernetes/pull/59827), [@dashpole](https://github.com/dashpole))

* rktnetes has been deprecated in favor of rktlet. Please see [https://github.com/kubernetes-incubator/rktlet](https://github.com/kubernetes-incubator/rktlet) for more information. ([#58418](https://github.com/kubernetes/kubernetes/pull/58418), [@yujuhong](https://github.com/yujuhong))

* The Kubelet now explicitly registers all of its command-line flags with an internal flagset, which prevents flags from third party libraries from unintentionally leaking into the Kubelet's command-line API. Many unintentionally leaked flags are now marked deprecated, so that users have a chance to migrate away from them before they are removed. In addition, one previously leaked flag, --cloud-provider-gce-lb-src-cidrs, has been entirely removed from the Kubelet's command-line API, because it is irrelevant to Kubelet operation. The deprecated flags are: 

    * --application_metrics_count_limit
    * --boot_id_file
    * --container_hints
    * --containerd
    * --docker
    * --docker_env_metadata_whitelist
    * --docker_only
    * --docker-tls
    * --docker-tls-ca
    * --docker-tls-cert
    * --docker-tls-key
    * --enable_load_reader
    * --event_storage_age_limit
    * --event_storage_event_limit
    * --global_housekeeping_interval
    * --google-json-key
    * --log_cadvisor_usage
    * --machine_id_file
    * --storage_driver_user
    * --storage_driver_password
    * --storage_driver_host
    * --storage_driver_db
    * --storage_driver_table
    * --storage_driver_secure
    * --storage_driver_buffer_duration

([#57613](https://github.com/kubernetes/kubernetes/pull/57613), [@mtaufen](https://github.com/mtaufen))

* The boostrapped RBAC role and rolebinding for the `cloud-provider` service account is now deprecated. If you're currently using this service account, you must create and apply your own [RBAC policy](https://kubernetes.io/docs/admin/authorization/rbac/) for new clusters. ([#59949](https://github.com/kubernetes/kubernetes/pull/59949), [@nicksardo](https://github.com/nicksardo))

* Format-separated endpoints for the OpenAPI spec, such as /swagger.json, /swagger-2.0.0.0.json, and so on, have been deprecated. The old endpoints will remain in 1.10, 1.11, 1.12 and 1.13, and get removed in 1.14. Please use single `/openapi/v2` endpoint with the appropriate Accept: header instead. For example:

<table>
  <tr>
    <td>previous</td>
    <td>now</td>
  </tr>
  <tr>
    <td>GET /swagger.json</td>
    <td>GET /openapi/v2 
Accept: application/json</td>
  </tr>
  <tr>
    <td>GET /swagger-2.0.0.pb-v1</td>
    <td>GET /openapi/v2 
Accept: application/com.github.proto-openapi.spec.v2@v1.0+protobuf</td>
  </tr>
  <tr>
    <td>GET /swagger-2.0.0.pb-v1.gz</td>
    <td>GET /openapi/v2 
Accept: application/com.github.proto-openapi.spec.v2@v1.0+protobuf Accept-Encoding: gzip</td>
  </tr>
</table>

 ([#59293](https://github.com/kubernetes/kubernetes/pull/59293), [@roycaihw](https://github.com/roycaihw))

## Other Notable Changes

### Apps

* Updated defaultbackend image to 1.4 and deployment apiVersion to apps/v1. Users should concentrate on updating scripts to the new version. ([#57866](https://github.com/kubernetes/kubernetes/pull/57866), [@zouyee](https://github.com/zouyee))

* Fix StatefulSet to work correctly with set-based selectors. ([#59365](https://github.com/kubernetes/kubernetes/pull/59365), [@ayushpateria](https://github.com/ayushpateria))

* Fixes a case when Deployment with recreate strategy could get stuck on old failed Pod. ([#60301](https://github.com/kubernetes/kubernetes/pull/60301), [@tnozicka](https://github.com/tnozicka))

* ConfigMap objects now support binary data via a new `binaryData` field. When using `kubectl create configmap --from-file`, files containing non-UTF8 data will be placed in this new field in order to preserve the non-UTF8 data. Note that kubectl's `--append-hash` feature doesn't take `binaryData` into account. Use of this feature requires 1.10+ apiserver and kubelets. ([#57938](https://github.com/kubernetes/kubernetes/pull/57938), [@dims](https://github.com/dims))

### AWS

* Add AWS cloud provider option to use an assumed IAM role. For example, this allows running Controller Manager in a account separate from the worker nodes, but still allows all resources created to interact with the workers. ELBs created would be in the same account as the worker nodes for instance.([#59668](https://github.com/kubernetes/kubernetes/pull/59668), [@brycecarman](https://github.com/brycecarman))

* AWS EBS volume plugin now includes block and volumeMode support. ([#58625](https://github.com/kubernetes/kubernetes/pull/58625), [@screeley44](https://github.com/screeley44))

* On AWS kubelet returns an error when started under conditions that do not allow it to work (AWS has not yet tagged the instance), rather than failing silently. ([#60125](https://github.com/kubernetes/kubernetes/pull/60125), [@vainu-arto](https://github.com/vainu-arto))

* AWS Security Groups created for ELBs will now be tagged with the same additional tags as the ELB; that is, the tags specified by the "service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags" annotation. This is useful for identifying orphaned resources. ([#58767](https://github.com/kubernetes/kubernetes/pull/58767), [@2rs2ts](https://github.com/2rs2ts))

* AWS Network Load Balancers will now be deleted properly, including security group rules. Fixes [#57568](https://github.com/kubernetes/kubernetes/pull/57568) ([#57569](https://github.com/kubernetes/kubernetes/pull/57569), [@micahhausler](https://github.com/micahhausler))

* Time for attach/detach retry operations has been decreased from 10-12s to 2-6s ([#56974](https://github.com/kubernetes/kubernetes/pull/56974), [@gnufied](https://github.com/gnufied))

### Auth

* Contexts must be named in kubeconfigs. ([#56769](https://github.com/kubernetes/kubernetes/pull/56769), [@dixudx](https://github.com/dixudx))

* vSphere operations will no longer fail due to authentication errors. ([#57978](https://github.com/kubernetes/kubernetes/pull/57978), [@prashima](https://github.com/prashima))

* This removes the cloud-provider role and role binding from the rbac boostrapper and replaces it with a policy applied via addon mgr. This also creates a new clusterrole allowing the service account to create events for any namespace.

* client-go: alpha support for out-of-tree exec-based credential providers. For example, a cloud provider could create their own authentication system rather than using the standard authentication provided with Kubernetes. ([#59495](https://github.com/kubernetes/kubernetes/pull/59495), [@ericchiang](https://github.com/ericchiang))

* The node authorizer now allows nodes to request service account tokens for the service accounts of pods running on them. This allows agents using the node identity to take actions on behalf of local pods. ([#55019](https://github.com/kubernetes/kubernetes/pull/55019), [@mikedanese](https://github.com/mikedanese))

* kube-apiserver: the OpenID Connect authenticator can now verify ID Tokens signed with JOSE algorithms other than RS256 through the --oidc-signing-algs flag. ([#58544](https://github.com/kubernetes/kubernetes/pull/58544), [@ericchiang](https://github.com/ericchiang))

* Requests with invalid credentials no longer match audit policy rules where users or groups are set, correcting a problem where authorized requests were getting through. ([#59398](https://github.com/kubernetes/kubernetes/pull/59398), [@CaoShuFeng](https://github.com/CaoShuFeng))

* The Stackdriver Metadata Agent addon now includes RBAC manifests, enabling it to watch nodes and pods. ([#57455](https://github.com/kubernetes/kubernetes/pull/57455), [@kawych](https://github.com/kawych))

* Fix RBAC role for certificate controller to allow cleaning up of Certificate Signing Requests that are Approved and issued or Denied. ([#59375](https://github.com/kubernetes/kubernetes/pull/59375), [@mikedanese](https://github.com/mikedanese))

* kube-apiserver: Use of the `--admission-control-config-file` with a file containing an AdmissionConfiguration apiserver.k8s.io/v1alpha1 config object no longer leads to an error when launching kube-apiserver. ([#58439](https://github.com/kubernetes/kubernetes/pull/58439) [@liggitt](https://github.com/liggitt))

* Default enabled admission plugins are now `NamespaceLifecycle,LimitRanger,ServiceAccount,PersistentVolumeLabel,DefaultStorageClass,DefaultTolerationSeconds,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,ResourceQuota`. Please note that if you previously had not set the `--admission-control` flag, your cluster behavior may change (to be more standard). ([#58684](https://github.com/kubernetes/kubernetes/pull/58684), [@hzxuzhonghu](https://github.com/hzxuzhonghu))

* Encryption key and encryption provider rotation now works properly. ([#58375](https://github.com/kubernetes/kubernetes/pull/58375), [@liggitt](https://github.com/liggitt)

* RBAC: The system:kubelet-api-admin cluster role can be used to grant full access to the kubelet API  so integrators can grant this role to the --kubelet-client-certificate credential given to the apiserver. ([#57128](https://github.com/kubernetes/kubernetes/pull/57128), [@liggitt](https://github.com/liggitt))

* DenyEscalatingExec admission controller now checks psp HostNetwork as well as hostIPC and hostPID. hostNetwork is also checked to deny exec /attach. ([#56839](https://github.com/kubernetes/kubernetes/pull/56839), [@hzxuzhonghu]=(https://github.com/hzxuzhonghu))

* When using Role-Based Access Control, the "admin", "edit", and "view" roles now have the expected permissions on NetworkPolicy resources, rather than reserving those permissions to only cluster-admin. ([#56650](https://github.com/kubernetes/kubernetes/pull/56650), [@danwinship](https://github.com/danwinship))

* Added docker-logins config to kubernetes-worker charm. ([#56217](https://github.com/kubernetes/kubernetes/pull/56217), [@Cynerva](https://github.com/Cynerva))

* Add ability to control primary GID of containers through Pod Spec at Pod level and Per Container SecurityContext level. ([#52077](https://github.com/kubernetes/kubernetes/pull/52077))

### CLI

* Use structured generator for kubectl autoscale.  ([#55913](https://github.com/kubernetes/kubernetes/pull/55913), [@wackxu](https://github.com/wackxu))

* Allow kubectl to set image|env on a cronjob ([#57742](https://github.com/kubernetes/kubernetes/pull/57742), [@soltysh](https://github.com/soltysh))

* Fixed crash in kubectl cp when path has multiple leading slashes. ([#58144](https://github.com/kubernetes/kubernetes/pull/58144), [@tomerf](https://github.com/tomerf))

* kubectl port-forward now allows using resource name (e.g., deployment/www) to select a matching pod, as well as the use of --pod-running-timeout to wait until at least one pod is running. ([#59705](https://github.com/kubernetes/kubernetes/pull/59705), [@phsiao](https://github.com/phsiao))

* 'cj' has been added as a shortname for CronJobs, as in `kubectl get cj` ([#59499](https://github.com/kubernetes/kubernetes/pull/59499), [@soltysh](https://github.com/soltysh))

* `crds` has been added as a shortname for CustomResourceDefinition, as in `kubectl get crds` ([#59061](https://github.com/kubernetes/kubernetes/pull/59061), [@nikhita](https://github.com/nikhita))

* Fix kubectl explain for resources not existing in default version of API group, such as  `batch/v1, Kind=CronJob`. ([#58753](https://github.com/kubernetes/kubernetes/pull/58753), [@soltysh](https://github.com/soltysh))

* Added the ability to select pods in a chosen node to be drained based on given pod label-selector. ([#56864](https://github.com/kubernetes/kubernetes/pull/56864), [@juanvallejo](https://github.com/juanvallejo))

* Kubectl explain now prints out the Kind and API version of the resource being explained. ([#55689](https://github.com/kubernetes/kubernetes/pull/55689), [@luksa](https://github.com/luksa))

### Cluster Lifecycle

* The default Kubernetes version for kubeadm is now 1.10. ([#61127](https://github.com/kubernetes/kubernetes/pull/61127), [@timothysc](https://github.com/timothysc))

* The minimum Kubernetes version in kubeadm is now v1.9.0. ([#57233](https://github.com/kubernetes/kubernetes/pull/57233), [@xiangpengzhao](https://github.com/xiangpengzhao))

* Fixes a bug in Heapster deployment for google sink. ([#57902](https://github.com/kubernetes/kubernetes/pull/57902), [@kawych](https://github.com/kawych))

* On cluster provision or upgrade, kubeadm now generates certs and secures all connections to the etcd static-pod with mTLS. This includes the etcd serving cert, the etcd peer cert, and the apiserver etcd client cert. Flags and hostMounts are added to the etcd and apiserver static-pods to load these certs. For connections to etcd, https is now used in favor of http. ([#57415](https://github.com/kubernetes/kubernetes/pull/57415), [@stealthybox](https://github.com/stealthybox) These certs are also generated on upgrade.  ([#60385](https://github.com/kubernetes/kubernetes/pull/60385), [@stealthybox](https://github.com/stealthybox))

* Demoted controlplane passthrough flags apiserver-extra-args, controller-manager-extra-args, scheduler-extra-args to alpha flags ([#59882](https://github.com/kubernetes/kubernetes/pull/59882), [@kris-nova](https://github.com/kris-nova))

* The new flag `--apiserver-advertise-dns-address` is used in the node's kubelet.confg to point to the API server, allowing users to define a DNS entry instead of an IP address. ([#59288](https://github.com/kubernetes/kubernetes/pull/59288), [@stevesloka](https://github.com/stevesloka))

* MasterConfiguration manifiest The criSocket flag is now usable within the `MasterConfiguration` and `NodeConfiguration` manifest files that exist for configuring kubeadm. Before it only existed as a command line flag and was not able to be configured when using the `--config` flag and the manifest files. ([#59057](https://github.com/kubernetes/kubernetes/pull/59057)([#59292](https://github.com/kubernetes/kubernetes/pull/59292), [@JordanFaust](https://github.com/JordanFaust))

* `kubeadm init` can now omit the tainting of the master node if configured to do so in `kubeadm.yaml` using `noTaintMaster: true`. For example, uses can create a file with the content:

```
apiVersion: [kubeadm.k8s.io/v1alpha1](http://kubeadm.k8s.io/v1alpha1)
kind: MasterConfiguration
kubernetesVersion: v1.9.1
noTaintMaster: true
```

And point to the file using the --config flag, as in 

`kubeadm init --config /etc/kubeadm/kubeadm.yaml`

([#55479](https://github.com/kubernetes/kubernetes/pull/55479), [@ijc](https://github.com/ijc))

* kubeadm: New "imagePullPolicy" option in the init configuration file, that gets forwarded to kubelet static pods to control pull policy for etcd and control plane images. This option allows for precise image pull policy specification for master nodes and thus for more tight control over images. It is useful in CI environments and in environments, where the user has total control over master VM templates (thus, the master VM templates can be preloaded with the required Docker images for the control plane services). ([#58960](https://github.com/kubernetes/kubernetes/pull/58960), [@rosti](https://github.com/rosti))

* Fixed issue with charm upgrades resulting in an error state. ([#59064](https://github.com/kubernetes/kubernetes/pull/59064), [@hyperbolic2346](https://github.com/hyperbolic2346))

* kube-apiserver --advertise-address is now set using downward API for self-hosted Kubernetes with kubeadm. ([#56084](https://github.com/kubernetes/kubernetes/pull/56084), [@andrewsykim](https://github.com/andrewsykim))

* When using client or server certificate rotation, the Kubelet will no longer wait until the initial rotation succeeds or fails before starting static pods.  This makes running self-hosted masters with rotation more predictable. ([#58930](https://github.com/kubernetes/kubernetes/pull/58930), [@smarterclayton](https://github.com/smarterclayton))

* Kubeadm no longer throws an error for the --cloud-provider=external flag. ([#58259](https://github.com/kubernetes/kubernetes/pull/58259), [@dims](https://github.com/dims))

* Added support for network spaces in the kubeapi-load-balancer charm. ([#58708](https://github.com/kubernetes/kubernetes/pull/58708), [@hyperbolic2346](https://github.com/hyperbolic2346))

* Added support for network spaces in the kubernetes-master charm. ([#58704](https://github.com/kubernetes/kubernetes/pull/58704), [@hyperbolic2346](https://github.com/hyperbolic2346))

* Added support for network spaces in the kubernetes-worker charm. ([#58523](https://github.com/kubernetes/kubernetes/pull/58523), [@hyperbolic2346](https://github.com/hyperbolic2346))

* Added support for changing nginx and default backend images to kubernetes-worker config. ([#58542](https://github.com/kubernetes/kubernetes/pull/58542), [@hyperbolic2346](https://github.com/hyperbolic2346))

* kubeadm now accepts `--apiserver-extra-args`, `--controller-manager-extra-args` and `--scheduler-extra-args`, making it possible to override / specify additional flags for control plane components. One good example is to deploy Kubernetes with a different admission-control flag on API server. ([#58080](https://github.com/kubernetes/kubernetes/pull/58080), [@simonferquel](https://github.com/simonferquel))

* Alpha Initializers have been removed from kubadm admission control.  Kubeadm users who still want to use Initializers can use apiServerExtraArgs through the kubeadm config file to enable it when booting up the cluster. ([#58428](https://github.com/kubernetes/kubernetes/pull/58428), [@dixudx](https://github.com/dixudx))

* ValidatingAdmissionWebhook and MutatingAdmissionWebhook are beta, and are enabled in kubeadm by default. ([#58255](https://github.com/kubernetes/kubernetes/pull/58255), [@dixudx](https://github.com/dixudx))

* Add proxy_read_timeout flag to kubeapi_load_balancer charm. ([#57926](https://github.com/kubernetes/kubernetes/pull/57926), [@wwwtyro](https://github.com/wwwtyro))

* Check for known manifests during preflight instead of only checking for non-empty manifests directory. This makes the preflight checks less heavy-handed by specifically checking for well-known files (kube-apiserver.yaml, kube-controller-manager.yaml, kube-scheduler.yaml, etcd.yaml) in /etc/kubernetes/manifests instead of simply checking for a non-empty directory. ([#57287](https://github.com/kubernetes/kubernetes/pull/57287), [@mattkelly](https://github.com/mattkelly))

* PVC Protection alpha feature was renamed to Storage Protection. The Storage Protection feature is beta. ([#59052](https://github.com/kubernetes/kubernetes/pull/59052), [@pospispa](https://github.com/pospispa))

* iSCSI sessions managed by kubernetes will now explicitly set startup.mode to 'manual' to  prevent automatic login after node failure recovery. This is the default open-iscsi mode, so this change will only impact users who have changed their startup.mode to be 'automatic' in /etc/iscsi/iscsid.conf. ([#57475](https://github.com/kubernetes/kubernetes/pull/57475), [@stmcginnis](https://github.com/stmcginnis))

* The IPVS feature gateway is now enabled by default in kubeadm, which makes the  --feature-gates=SupportIPVSProxyMode=true obsolete, and it is no longer supported. ([#60540](https://github.com/kubernetes/kubernetes/pull/60540), [@m1093782566](https://github.com/m1093782566))

### GCP

* ingress-gce image in glbc.manifest updated to 1.0.0 ([#61302](https://github.com/kubernetes/kubernetes/pull/61302), [@rramkumar1](https://github.com/rramkumar1))

### Instrumentation

* For advanced auditing, audit policy supports subresources wildcard matching, such as "resource/", "/subresource","*". ([#55306](https://github.com/kubernetes/kubernetes/pull/55306), [@hzxuzhonghu](https://github.com/hzxuzhonghu))

* [Auditing](https://kubernetes.io/docs/tasks/debug-application-cluster/audit/) is now enabled behind a featureGate in kubeadm. A user can supply their own audit policy with configuration option as well as a place for the audit logs to live. If no policy is supplied a default policy will be provided. The default policy will log all Metadata level policy logs. It is the example provided in the documentation. ([#59067](https://github.com/kubernetes/kubernetes/pull/59067), [@chuckha](https://github.com/chuckha))

* Reduce Metrics Server memory requirement from 140Mi + 4Mi per node to 40Mi + 4Mi per node. ([#58391](https://github.com/kubernetes/kubernetes/pull/58391), [@kawych](https://github.com/kawych))

* Annotations is added to advanced audit api. ([#58806](https://github.com/kubernetes/kubernetes/pull/58806), [@CaoShuFeng](https://github.com/CaoShuFeng))

* Reorganized iptables rules to fix a performance regression on clusters with thousands of services. ([#56164](https://github.com/kubernetes/kubernetes/pull/56164), [@danwinship](https://github.com/danwinship))

* Container runtime daemon (e.g. dockerd) logs in GCE cluster will be uploaded to stackdriver and elasticsearch with tag `container-runtime`. ([#59103](https://github.com/kubernetes/kubernetes/pull/59103), [@Random-Liu](https://github.com/Random-Liu))

* Enable prometheus apiserver metrics for custom resources. ([#57682](https://github.com/kubernetes/kubernetes/pull/57682), [@nikhita](https://github.com/nikhita))

* Add apiserver metric for number of requests dropped because of inflight limit, making it easier to figure out on which dimension the master is overloaded. ([#58340](https://github.com/kubernetes/kubernetes/pull/58340), [@gmarek](https://github.com/gmarek))

* The Metrics Server now exposes metrics via the /metric endpoint. These metrics are in the prometheus format.  ([#57456](https://github.com/kubernetes/kubernetes/pull/57456), [@kawych](https://github.com/kawych))

* Reduced the CPU and memory requests for the Metrics Server Nanny sidecar container to free up unused resources.  ([#57252](https://github.com/kubernetes/kubernetes/pull/57252), [@kawych](https://github.com/kawych))

* Enabled log rotation for load balancer's api logs to prevent running out of disk space. ([#56979](https://github.com/kubernetes/kubernetes/pull/56979), [@hyperbolic2346](https://github.com/hyperbolic2346))

* Fixed `etcd-version-monitor` to backward compatibly support etcd 3.1 [go-grpc-prometheus](https://github.com/grpc-ecosystem/go-grpc-prometheus) metrics format. ([#56871](https://github.com/kubernetes/kubernetes/pull/56871), [@jpbetz](https://github.com/jpbetz))

### Node

* Summary of Container Runtime changes:
  * [beta] [cri-tools](https://github.com/kubernetes-incubator/cri-tools): CLI and validation tools for CRI is now v1.0.0-beta.0. This release mainly focused on UX improvements. [@feiskyer]
  * [stable] [containerd](https://github.com/containerd/containerd): containerd v1.1 natively supports CRI v1alpha2 now, so users can use Kubernetes v1.10 with containerd v1.1 directly, without having to use the intermediate cri-containerd daemon. [All Kubernetes 1.10 tests passed](https://k8s-testgrid.appspot.com/sig-node-containerd). [@Random-Liu]
  * [stable] [cri-o](https://github.com/kubernetes-incubator/cri-o): cri-o v1.10 updated CRI version to v1alpha2 and made several bug and stability fixes. [@mrunalp]
  * [stable] [frakti](https://github.com/kubernetes/frakti): frakti v1.10 implemented GCE Persistent Disk as a high performance volume, fixed several bugs, added ARM64 support, and passed all CRI validation conformance tests and node e2e conformance tests. [@resouer]

* Fixed race conditions around devicemanager Allocate() and endpoint deletion. ([#60856](https://github.com/kubernetes/kubernetes/pull/60856), [@jiayingz](https://github.com/jiayingz))

* kubelet initial flag parse now normalizes flags instead of exiting.  ([#61053](https://github.com/kubernetes/kubernetes/pull/61053), [@andrewsykim](https://github.com/andrewsykim))

* Fixed regression where kubelet --cpu-cfs-quota flag did not work when --cgroups-per-qos was enabled ([#61294](https://github.com/kubernetes/kubernetes/pull/61294), [@derekwaynecarr](https://github.com/derekwaynecarr))

* Kubelet now supports container log rotation for container runtimes implementing CRI (container runtime interface).  The feature can be enabled with feature gate `CRIContainerLogRotation`. The flags `--container-log-max-size` and `--container-log-max-files` can be used to configure the rotation behavior. ([#59898](https://github.com/kubernetes/kubernetes/pull/59898), [@Random-Liu](https://github.com/Random-Liu))

* Fixed a bug where if an error was returned that was not an `autorest.DetailedError` we would return `"not found", nil` which caused nodes to go to `NotReady` state. ([#57484](https://github.com/kubernetes/kubernetes/pull/57484), [@brendandburns](https://github.com/brendandburns))

* [HugePages](https://kubernetes.io/docs/tasks/manage-hugepages/scheduling-hugepages/) feature is beta, and thus enabled by default. ([#56939](https://github.com/kubernetes/kubernetes/pull/56939), [@derekwaynecarr](https://github.com/derekwaynecarr))

* Avoid panic when failing to allocate a Cloud CIDR (aka GCE Alias IP Range).  ([#58186](https://github.com/kubernetes/kubernetes/pull/58186), [@negz](https://github.com/negz))

* 'none' can now be specified in KubeletConfiguration.EnforceNodeAllocatable (--enforce-node-allocatable) to explicitly disable enforcement. ([#59515](https://github.com/kubernetes/kubernetes/pull/59515), [@mtaufen](https://github.com/mtaufen))

* The alpha KubeletConfiguration.ConfigTrialDuration field is no longer available. It can still be set using the dynamic configuration alpha feature. ([#59628](https://github.com/kubernetes/kubernetes/pull/59628), [@mtaufen](https://github.com/mtaufen))

* Summary API will include pod CPU and Memory stats for CRI container runtime. ([#60328](https://github.com/kubernetes/kubernetes/pull/60328), [@Random-Liu](https://github.com/Random-Liu))

* Some field names in the Kubelet's now v1beta1 config API differ from the v1alpha1 API: for example, PodManifestPath is renamed to StaticPodPath, ManifestURL is renamed to StaticPodURL, and ManifestURLHeader is renamed to StaticPodURLHeader. Users should focus on switching to the v1beta1 API. ([#60314](https://github.com/kubernetes/kubernetes/pull/60314), [@mtaufen](https://github.com/mtaufen))

* The DevicePlugins feature has graduated to beta, and is now enabled by default; users should focus on moving to the v1beta API if possible. ([#60170](https://github.com/kubernetes/kubernetes/pull/60170), [@jiayingz](https://github.com/jiayingz))

* Per-cpu metrics have been disabled by default for to improve scalability. ([#60106](https://github.com/kubernetes/kubernetes/pull/60106), [@dashpole](https://github.com/dashpole))

* When the `PodShareProcessNamespace` alpha feature is enabled, setting `pod.Spec.ShareProcessNamespace` to `true` will cause a single process namespace to be shared between all containers in a pod. ([#58716](https://github.com/kubernetes/kubernetes/pull/58716), [@verb](https://github.com/verb))

* Resource quotas on extended resources such as GPUs are now supported. ([#57302](https://github.com/kubernetes/kubernetes/pull/57302), [@lichuqiang](https://github.com/lichuqiang))

* If the TaintNodesByCondition is enabled, a node will be tainted when it is under PID pressure.  ([#60008](https://github.com/kubernetes/kubernetes/pull/60008), [@k82cn](https://github.com/k82cn))

* The Kubelet Summary API will now include total usage of pods through the "pods" SystemContainer. ([#57802](https://github.com/kubernetes/kubernetes/pull/57802), [@dashpole](https://github.com/dashpole))

* vSphere Cloud Provider supports VMs provisioned on vSphere v6.5. ([#59519](https://github.com/kubernetes/kubernetes/pull/59519), [@abrarshivani](https://github.com/abrarshivani))

* Created k8s.gcr.io image repo alias to pull images from the closest regional repo. Replaces gcr.io/google_containers. ([#57824](https://github.com/kubernetes/kubernetes/pull/57824), [@thockin](https://github.com/thockin))

* Fix the bug where kubelet in the standalone mode would wait for the update from the apiserver source, even if there wasn't one. ([#59276](https://github.com/kubernetes/kubernetes/pull/59276), [@roboll](https://github.com/roboll))

* Changes secret, configMap, downwardAPI and projected volumes to mount read-only, instead of allowing applications to write data and then reverting it automatically. Until version 1.11, setting the feature gate ReadOnlyAPIDataVolumes=false will preserve the old behavior. ([#58720](https://github.com/kubernetes/kubernetes/pull/58720), [@joelsmith](https://github.com/joelsmith))

* Fixes a bug where kubelet crashes trying to free memory under memory pressure. ([#58574](https://github.com/kubernetes/kubernetes/pull/58574), [@yastij](https://github.com/yastij))

* New alpha feature limits the number of processes running in a pod. Cluster administrators will be able to place limits by using the new kubelet command line parameter --pod-max-pids. Note that since this is a alpha feature they will need to enable the "SupportPodPidsLimit" feature. By default, we do not set any maximum limit, If an administrator wants to enable this, they should enable SupportPodPidsLimit=true in the --feature-gates= parameter to kubelet and specify the limit using the --pod-max-pids parameter. The limit set is the total count of all processes running in all containers in the pod. ([#57973](https://github.com/kubernetes/kubernetes/pull/57973),[@dims](https://github.com/dims))

* Fixes bug finding master replicas in GCE when running multiple Kubernetes clusters. ([#58561](https://github.com/kubernetes/kubernetes/pull/58561), [@jesseshieh](https://github.com/jesseshieh))

* --tls-min-version on kubelet and kube-apiserver allow for configuring minimum TLS versions ([#58528](https://github.com/kubernetes/kubernetes/pull/58528), [@deads2k](https://github.com/deads2k))

* Fix a bug affecting nested data volumes such as secret, configmap, etc. ([#57422](https://github.com/kubernetes/kubernetes/pull/57422), [@joelsmith](https://github.com/joelsmith))

* kubelet will no longer attempt to remove images being used by running containers when garbage collecting. ([#57020](https://github.com/kubernetes/kubernetes/pull/57020), [@dixudx](https://github.com/dixudx))

* Allow kubernetes components to react to SIGTERM signal and shutdown gracefully. ([#57756](https://github.com/kubernetes/kubernetes/pull/57756), [@mborsz](https://github.com/mborsz))

* Fixed garbage collection and resource quota issue when the controller-manager uses --leader-elect=false ([#57340](https://github.com/kubernetes/kubernetes/pull/57340), [@jmcmeek](https://github.com/jmcmeek))

* Fixed issue creating docker secrets with kubectl 1.9 for accessing docker private registries. ([#57463](https://github.com/kubernetes/kubernetes/pull/57463), [@dims](https://github.com/dims))

* The CPU Manager feature is now beta, and is enabled by default, but the default policy is no-op so no action is required. ([#55977](https://github.com/kubernetes/kubernetes/pull/55977), [@ConnorDoyle](https://github.com/ConnorDoyle))

### OpenStack

* Fixed a bug in the OpenStack cloud provider where dual stack deployments (IPv4 and IPv6) did not work well when using kubenet as the network plugin. ([#59749](https://github.com/kubernetes/kubernetes/pull/59749), [@zioproto](https://github.com/zioproto))

* Fixed a bug that tries to use the octavia client to query flip. ([#59075](https://github.com/kubernetes/kubernetes/pull/59075), [@jrperritt](https://github.com/jrperritt))

* Kubernetes now registers metadata.hostname as node name for OpenStack nodes, eliminating a problem with invalid node names. ([#58502](https://github.com/kubernetes/kubernetes/pull/58502), [@dixudx](https://github.com/dixudx))

* Authentication information for OpenStack cloud provider can now be specified as environment variables. When we convert the OpenStack cloud provider to run in an external process, we can now use the kubernetes Secrets capability to inject the OS_* variables. This way we can specify the cloud configuration as a configmap, and specify secrets for the userid/password information. The configmap is mounted as a file, and the secrets are made available as environment variables. The external controller itself runs as a pod/daemonset. For backward compatibility, we preload all the OS_* variables, and if anything is in the config file, then that overrides the environment variables. ([#58300](https://github.com/kubernetes/kubernetes/pull/58300), [@dims](https://github.com/dims))

* Fixed issue when using OpenStack config drive for node metadata. Since we need to run commands such as blkid, we need to ensure that api server and kube controller are running in the privileged mode. ([#57561](https://github.com/kubernetes/kubernetes/pull/57561), [@dims](https://github.com/dims))

* Orphaned routes are properly removed from terminated instances. ([#56258](https://github.com/kubernetes/kubernetes/pull/56258), [@databus23](https://github.com/databus23))

* OpenStack Cinder will now detach properly when Nova is shut down. ([#56846](https://github.com/kubernetes/kubernetes/pull/56846), [@zetaab](https://github.com/zetaab))
### Scalability

* Added the ability to limit the increase in apiserver memory usage when audit logging with buffering is enabled. ([#61118](https://github.com/kubernetes/kubernetes/pull/61118), [@shyamjvs](https://github.com/shyamjvs))

* Upgrade to etcd client 3.2.13 and grpc 1.7.5 to improve HA etcd cluster stability. ([#57480](https://github.com/kubernetes/kubernetes/pull/57480), [@jpbetz](https://github.com/jpbetz))

### Storage

* Fixes CVE-2017-1002101 - See [https://issue.k8s.io/60813](https://issue.k8s.io/60813) for details on this **major security fix**. ([#61044](https://github.com/kubernetes/kubernetes/pull/61044), [@liggitt](https://github.com/liggitt))

* Fixed missing error checking that could cause kubelet to crash in a race condition. ([#60962](https://github.com/kubernetes/kubernetes/pull/60962), [@technicianted](https://github.com/technicianted))

* Fixed a regression that prevented using `subPath` volume mounts with secret, configMap, projected, and downwardAPI volumes. ([#61080](https://github.com/kubernetes/kubernetes/pull/61080), [@liggitt](https://github.com/liggitt))

* K8s supports cephfs fuse mount. ([#55866](https://github.com/kubernetes/kubernetes/pull/55866), [@zhangxiaoyu-zidif](https://github.com/zhangxiaoyu-zidif))

* Use GiB unit for creating and resizing volumes for Glusterfs. ([#56581](https://github.com/kubernetes/kubernetes/pull/56581), [@gnufied](https://github.com/gnufied))

* Adding support for Block Volume type to rbd plugin. ([#56651](https://github.com/kubernetes/kubernetes/pull/56651), [@sbezverk](https://github.com/sbezverk))

* Add FSType for CSI volume source to specify filesystems (alpha defaults to ext4) ([#58209](https://github.com/kubernetes/kubernetes/pull/58209), [@NickrenREN](https://github.com/NickrenREN))

* Enabled File system resize of mounted volumes. ([#58794](https://github.com/kubernetes/kubernetes/pull/58794), [@gnufied](https://github.com/gnufied))

* The Local Volume Plugin has been updated to support Block volumeMode PVs. With this change, it is now possible to create local volume PVs for raw block devices. ([#59303](https://github.com/kubernetes/kubernetes/pull/59303), [@dhirajh](https://github.com/dhirajh))

* Fixed an issue where Portworx volume driver wasn't passing namespace and annotations to the Portworx Create API. ([#59607](https://github.com/kubernetes/kubernetes/pull/59607), [@harsh-px](https://github.com/harsh-px))

* Addressed breaking changes introduced by new 0.2.0 release of CSI spec. Specifically, csi.Version was removed from all API calls and CcontrollerProbe and NodeProbe were consolidated into a single Probe API call. ([#59209](https://github.com/kubernetes/kubernetes/pull/59209), [@sbezverk](https://github.com/sbezverk))

* GCE PD volume plugin now supports block volumes. ([#58710](https://github.com/kubernetes/kubernetes/pull/58710), [@screeley44](https://github.com/screeley44))

* Implements MountDevice and UnmountDevice for the CSI Plugin, the functions will call through to NodeStageVolume/NodeUnstageVolume for CSI plugins. ([#60115](https://github.com/kubernetes/kubernetes/pull/60115), [@davidz627](https://github.com/davidz627))

* The LocalStorageCapacityIsolation feature is beta and enabled by default.  The LocalStorageCapacityIsolation feature added a new resource type ResourceEphemeralStorage "ephemeral-storage" so that this resource can be allocated, limited, and consumed as the same way as CPU/memory. All the features related to resource management (resource request/limit, quota, limitrange) are available for local ephemeral storage. This local ephemeral storage represents the storage for root file system, which will be consumed by containers' writable layer and logs. Some volumes such as emptyDir might also consume this storage. ([#60159](https://github.com/kubernetes/kubernetes/pull/60159), [@jingxu97](https://github.com/jingxu97))

* VolumeScheduling and LocalPersistentVolume features are beta and enabled by default.  The PersistentVolume NodeAffinity alpha annotation is deprecated and will be removed in a future release. ([#59391](https://github.com/kubernetes/kubernetes/pull/59391), [@msau42](https://github.com/msau42))

* K8s now supports rbd-nbd for Ceph rbd volume mounts. ([#58916](https://github.com/kubernetes/kubernetes/pull/58916), [@ianchakeres](https://github.com/ianchakeres))

* CSI now allows credentials to be specified on CreateVolume/DeleteVolume, ControllerPublishVolume/ControllerUnpublishVolume, and NodePublishVolume/NodeUnpublishVolume operations. Before this change all API calls had to fetch key/value stored in secret and use it to authenticate/authorize these operations. With this change API calls receive key/value as a input parameter so they not need to know where and how credentials were stored and fetched. Main goal was to make these API calls CO (Container Orchestrator) agnostic.  ([#60118](https://github.com/kubernetes/kubernetes/pull/60118), [@sbezverk](https://github.com/sbezverk))

* StorageOS volume plugin has been updated to support mount options and environments where the kubelet runs in a container and the device location should be specified. ([#58816](https://github.com/kubernetes/kubernetes/pull/58816), [@croomes](https://github.com/croomes))

* Get parent dir via canonical absolute path when trying to judge mount-point, fixing a problem that caused an NFS volume with improper permissions to get stuck in `TERMINATING` status. ([#58433](https://github.com/kubernetes/kubernetes/pull/58433), [@yue9944882]](https://github.com/yue9944882))

* Clusters with GCE feature 'DiskAlphaAPI' enabled can now dynamically provision GCE PD volumes. ([#59447](https://github.com/kubernetes/kubernetes/pull/59447), [@verult](https://github.com/verult))

* Added `keyring` parameter for Ceph RBD provisioner. ([#58287](https://github.com/kubernetes/kubernetes/pull/58287), [@madddi](https://github.com/madddi))

* Added xfsprogs to hyperkube container image. ([#56937](https://github.com/kubernetes/kubernetes/pull/56937), [@redbaron](https://github.com/redbaron))

* Improved messages user gets during and after volume resizing is done, providing a clear message to the user explaining what to do when resizing is finished. ([#58415](https://github.com/kubernetes/kubernetes/pull/58415), [@gnufied](https://github.com/gnufied))

* MountPropagation feature is now beta. As consequence, all volume mounts in containers are now "rslave" on Linux by default. To make this default work in all Linux environments you should have entire mount tree marked as shareable via "mount --make-rshared /". All Linux distributions that use systemd already have root directory mounted as rshared and hence they need not do anything. In Linux environments without systemd we  recommend running "mount --make-rshared /" during boot, before docker is started. ([#59252](https://github.com/kubernetes/kubernetes/pull/59252), [@jsafrane](https://github.com/jsafrane))

* Volume metrics support for vSphere Cloud Provider has been added. You can now monitor available space, capacity, and used space on volumes created using vSphere. ([#59328](https://github.com/kubernetes/kubernetes/pull/59328), [@divyenpatel](https://github.com/divyenpatel))

* Emit number of bound and unbound persistent volumes as Metrics. This PR adds four kinds of Volume Metrics for kube-controller-manager: bound PVC numbers, unbound PVC numbers, bound PV numbers and unbound PV numbers. The PVC metrics use namespace as dimension and the PV metrics use StorageClassName as its dimension. With these metrics we can better monitor the use of volumes in the cluster. ([#57872](https://github.com/kubernetes/kubernetes/pull/57872), [@mlmhl](https://github.com/mlmhl))

* Add windows config to Kubelet CRI so that WindowsContainerResources can be managed. ([#57076](https://github.com/kubernetes/kubernetes/pull/57076), [@feiskyer](https://github.com/feiskyer))

* PersistentVolumes that are bound to a PersistentVolumeClaim will not be deleted. ([#58743](https://github.com/kubernetes/kubernetes/pull/58743), [@NickrenREN](https://github.com/NickrenREN))

* The VolumeAttachment API is now available as V1beta1, and is enabled by default. The Alpha API is deprecated and will be removed in a future release.  ([#58462](https://github.com/kubernetes/kubernetes/pull/58462), [@NickrenREN](https://github.com/NickrenREN))

* Add storage-backend configuration option to kubernetes-master charm. ([#58830](https://github.com/kubernetes/kubernetes/pull/58830), [@wwwtyro](https://github.com/wwwtyro))

* Fixed dynamic provisioning of GCE PDs to round to the next GB (base 1000) instead of GiB (base 1024). ([#56600](https://github.com/kubernetes/kubernetes/pull/56600), [@edisonxiang](https://github.com/edisonxiang))

* PersistentVolume flexVolume sources can now reference secrets in a namespace other than the PersistentVolumeClaim's namespace. ([#56460](https://github.com/kubernetes/kubernetes/pull/56460), [@liggitt](https://github.com/liggitt))

### Windows

* kubelet and kube-proxy can now be run as native Windows services. ([#60144](https://github.com/kubernetes/kubernetes/pull/60144), [@alinbalutoiu](https://github.com/alinbalutoiu))

* WindowsContainerResources is set now for windows containers. ([#59333](https://github.com/kubernetes/kubernetes/pull/59333), [@feiskyer](https://github.com/feiskyer))

* Disable mount propagation for windows containers (because it is not supported by the OS). ([#60275](https://github.com/kubernetes/kubernetes/pull/60275), [@feiskyer](https://github.com/feiskyer))

* Fix image file system stats for windows nodes. ([#59743](https://github.com/kubernetes/kubernetes/pull/59743), [@feiskyer](https://github.com/feiskyer))

<<<<<<< HEAD
* Kubernetes will now return an error if New-SmbGlobalMapping failed when mounting an azure file on Windows. ([#59540](https://github.com/kubernetes/kubernetes/pull/59540), [@andyzhangx](https://github.com/andyzhangx))
||||||| merged common ancestors
*   The admission API, which is used when the API server calls admission control webhooks, is moved from `admission.v1alpha1` to `admission.v1beta1`. You must **delete any existing webhooks before you upgrade** your cluster, and update them to use the latest API. This change is not backward compatible.
*   The admission webhook configurations API, part of the admissionregistration API, is now at v1beta1. Delete any existing webhook configurations before you upgrade, and update your configuration files to use the latest API. For this and the previous change, see also [the documentation]([https://kubernetes.io/docs/admin/extensible-admission-controllers/#external-admission-webhooks](https://kubernetes.io/docs/admin/extensible-admission-controllers/#external-admission-webhooks)).
*   A new `ValidatingAdmissionWebhook` is added (replacing `GenericAdmissionWebhook`) and is available in the generic API server. You must update your API server configuration file to pass the webhook to the `--admission-control` flag. ([#55988](https://github.com/kubernetes/kubernetes/pull/55988),[ @caesarxuchao](https://github.com/caesarxuchao))  ([#54513](https://github.com/kubernetes/kubernetes/pull/54513),[ @deads2k](https://github.com/deads2k))
*   The deprecated options `--portal-net` and `--service-node-ports` for the API server are removed. ([#52547](https://github.com/kubernetes/kubernetes/pull/52547),[ @xiangpengzhao](https://github.com/xiangpengzhao))
=======
*   The admission API, which is used when the API server calls admission control webhooks, is moved from `admission.v1alpha1` to `admission.v1beta1`. You must **delete any existing webhooks before you upgrade** your cluster, and update them to use the latest API. This change is not backward compatible.
*   The admission webhook configurations API, part of the admissionregistration API, is now at v1beta1. Delete any existing webhook configurations before you upgrade, and update your configuration files to use the latest API. For this and the previous change, see also [the documentation](https://kubernetes.io/docs/admin/extensible-admission-controllers/#external-admission-webhooks).
*   A new `ValidatingAdmissionWebhook` is added (replacing `GenericAdmissionWebhook`) and is available in the generic API server. You must update your API server configuration file to pass the webhook to the `--admission-control` flag. ([#55988](https://github.com/kubernetes/kubernetes/pull/55988),[ @caesarxuchao](https://github.com/caesarxuchao))  ([#54513](https://github.com/kubernetes/kubernetes/pull/54513),[ @deads2k](https://github.com/deads2k))
*   The deprecated options `--portal-net` and `--service-node-ports` for the API server are removed. ([#52547](https://github.com/kubernetes/kubernetes/pull/52547),[ @xiangpengzhao](https://github.com/xiangpengzhao))
>>>>>>> merge master to 1.10, with fixes (#7682)

* Kubernetes now uses the more reliable GlobalMemoryStatusEx to get total physical memory on windows nodes. ([#57124](https://github.com/kubernetes/kubernetes/pull/57124), [@JiangtianLi](https://github.com/JiangtianLi))

* Windows containers now support experimental Hyper-V isolation by setting annotation `experimental.windows.kubernetes.io/isolation-type=hyperv` and feature gates HyperVContainer. At the moment this function only supports one container per pod. ([#58751]([https://github.com/kubernetes/kubernetes/pull/58751](https://github.com/kubernetes/kubernetes/pull/58751)), [@feiskyer](https://github.com/feiskyer))

* Get windows kernel version directly from registry rather than windows.getVersion(). ([#58498](https://github.com/kubernetes/kubernetes/pull/58498), [@feiskyer](https://github.com/feiskyer))

* Fixed controller manager crash when using mixed case names in a vSphere cloud provider environment. ([#57286](https://github.com/kubernetes/kubernetes/pull/57286), [@rohitjogvmw](https://github.com/rohitjogvmw))

* Flexvolume is now [enabled on Windows nodes](https://github.com/andyzhangx/Demo/tree/master/windows/flexvolume). ([#56921](https://github.com/kubernetes/kubernetes/pull/56921), [@andyzhangx](https://github.com/andyzhangx))

### Autoscaling

* The getSubnetIDForLB() returns subnet id rather than net id. ([#58208](https://github.com/kubernetes/kubernetes/pull/58208), [@FengyunPan](https://github.com/FengyunPan))

* `kubectl scale` can now scale any resource (kube, CRD, aggregate) conforming to the standard scale endpoint ([#58298](https://github.com/kubernetes/kubernetes/pull/58298), [@p0lyn0mial](https://github.com/p0lyn0mial))

* Cluster Autoscaler has been updated to Version 1.2.0, which includes fixes around GPUs and base image change. See [https://github.com/kubernetes/autoscaler/releases/tag/cluster-autoscaler-](https://github.com/kubernetes/autoscaler/releases/tag/cluster-autoscaler-1.1.2)1.2.0for details. ([#60842](https://github.com/kubernetes/kubernetes/pull/60842), [@mwielgus](https://github.com/mwielgus))

* Allows HorizontalPodAutoscaler to use global metrics not associated with any Kubernetes object (for example metrics from a hosting service running outside of the Kubernetes cluster). ([#60096](https://github.com/kubernetes/kubernetes/pull/60096), [@MaciekPytel](https://github.com/MaciekPytel))

* fluentd-gcp resources can be modified via a ScalingPolicy. ([#59657](https://github.com/kubernetes/kubernetes/pull/59657), [@x13n](https://github.com/x13n))

* Added anti-affinity to kube-dns pods. Otherwise the "no single point of failure" setting doesn't actually work (a single node failure can still take down the entire cluster). ([#57683](https://github.com/kubernetes/kubernetes/pull/57683), [@vainu-arto](https://github.com/vainu-arto))

### API-Machinery

* Fixed webhooks to use the scheme provided in clientConfig, instead of defaulting to http. ([#60943](https://github.com/kubernetes/kubernetes/pull/60943), [@jennybuckley](https://github.com/jennybuckley))

* The webhook admission controller in a custom apiserver now works off-the-shelf. ([#60995](https://github.com/kubernetes/kubernetes/pull/60995), [@caesarxuchao](https://github.com/caesarxuchao))

* Upgrade the default etcd server version to 3.1.12 to pick up critical etcd "mvcc "unsynced" watcher restore operation" fix. ([#60998](https://github.com/kubernetes/kubernetes/pull/60998), [@jpbetz](https://github.com/jpbetz))

* Fixed bug allowing garbage collector to enter a broken state that could only be fixed by restarting the controller-manager. ([#61201](https://github.com/kubernetes/kubernetes/pull/61201), [@jennybuckley](https://github.com/jennybuckley))

* kube-apiserver: The external hostname no longer longer use the cloud provider API to select a default. It can be set explicitly using --external-hostname, if needed. If there is no default, AdvertiseAddress or os.Hostname() will be used, in that order. ([#56812](https://github.com/kubernetes/kubernetes/pull/56812), [@dims](https://github.com/dims))

* Custom resources can be listed with a set of grouped resources (category) by specifying the categories in the [CustomResourceDefinition spec](https://kubernetes.io/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/#categories). Example: They can be used with `kubectl get important`, where `important` is a category. ([#59561](https://github.com/kubernetes/kubernetes/pull/59561), [@nikhita](https://github.com/nikhita))

* Fixed an issue making it possible to create a situation in which two webhooks make it impossible to delete each other. ValidatingWebhooks and MutatingWebhooks will not be called on admission requests for ValidatingWebhookConfiguration and MutatingWebhookConfiguration objects in the admissionregistration.k8s.io group ([#59840](https://github.com/kubernetes/kubernetes/pull/59840), [@jennybuckley](https://github.com/jennybuckley))

* Fixed potential deadlock when deleting CustomResourceDefinition for custom resources with finalizers. ([#60542](https://github.com/kubernetes/kubernetes/pull/60542), [@liggitt](https://github.com/liggitt))

* A buffered audit backend can be used with other audit backends. ([#60076](https://github.com/kubernetes/kubernetes/pull/60076), [@crassirostris](https://github.com/crassirostris))

* Introduced `--http2-max-streams-per-connection` command line flag on api-servers and set default to 1000 for aggregated API servers. ([#60054](https://github.com/kubernetes/kubernetes/pull/60054), [@MikeSpreitzer](https://github.com/MikeSpreitzer))

* APIserver backed by etcdv3 exports metric shows number of resources per kind. ([#59757](https://github.com/kubernetes/kubernetes/pull/59757), [@gmarek](https://github.com/gmarek))

* Add `kubectl create job --from-cronjob` command. ([#60084](https://github.com/kubernetes/kubernetes/pull/60084), [@soltysh](https://github.com/soltysh))

* `/status` and `/scale` subresources have been added for custom resources. See [https://github.com/kubernetes/kubernetes/pull/55168](https://github.com/kubernetes/kubernetes/pull/55168) for more details. ([#55168](https://github.com/kubernetes/kubernetes/pull/55168), [@nikhita](https://github.com/nikhita))

* Restores the ability of older clients to delete and scale jobs with initContainers. ([#59880](https://github.com/kubernetes/kubernetes/pull/59880), [@liggitt](https://github.com/liggitt))

* Fixed a race condition causing apiserver crashes during etcd healthchecking. ([#60069](https://github.com/kubernetes/kubernetes/pull/60069), [@wojtek-t](https://github.com/wojtek-t))

* Fixed a race condition in k8s.io/client-go/tools/cache.SharedInformer that could violate the sequential delivery guarantee and cause panics on shutdown in Kubernetes 1.8.* and 1.9.*. ([#59828](https://github.com/kubernetes/kubernetes/pull/59828), [@krousey](https://github.com/krousey))

* Add automatic etcd 3.2->3.1 and 3.1->3.0 minor version rollback support to gcr.io/google_container/etcd images. For HA clusters, all members must be stopped before performing a rollback. ([#59298](https://github.com/kubernetes/kubernetes/pull/59298), [@jpbetz](https://github.com/jpbetz))

* The `meta.k8s.io/v1alpha1` objects for retrieving tabular responses from the server (`Table`) or fetching just the `ObjectMeta` for an object (as `PartialObjectMetadata`) are now beta as part of `meta.k8s.io/v1beta1` and configurations must be changed to use the new API.  Clients may request alternate representations of normal Kubernetes objects by passing an `Accept` header like `application/json;as=Table;g=meta.k8s.io;v=v1beta1` or `application/json;as=PartialObjectMetadata;g=meta.k8s.io;v1=v1beta1`.  Older servers will ignore this representation or return an error if it is not available.  Clients may request fallback to the normal object by adding a non-qualified mime-type to their `Accept` header like `application/json` - the server will then respond with either the alternate representation if it is supported or the fallback mime-type which is the normal object response. ([#59059](https://github.com/kubernetes/kubernetes/pull/59059), [@smarterclayton]([https://github.com/smarterclayton](https://github.com/smarterclayton) ))

* kube-apiserver now uses SSH tunnels for webhooks if the webhook is not directly routable from apiserver's network environment. ([#58644](https://github.com/kubernetes/kubernetes/pull/58644), [@yguo0905](https://github.com/yguo0905))

* Access to externally managed IP addresses via the kube-apiserver service proxy subresource is no longer allowed by default. This can be re-enabled via the `ServiceProxyAllowExternalIPs` feature gate, but will be disallowed completely in 1.11 ([#57265](https://github.com/kubernetes/kubernetes/pull/57265), [@brendandburns](https://github.com/brendandburns))

* The apiregistration.k8s.io (aggregation) is now generally available. Users should transition from the v1beta1 API to the v1 API. ([#58393](https://github.com/kubernetes/kubernetes/pull/58393), [@deads2k](https://github.com/deads2k))

* Fixes an issue where the resourceVersion of an object in a DELETE watch event was not the resourceVersion of the delete itself, but of the last update to the object. This could disrupt the ability of clients clients to re-establish watches properly. ([#58547](https://github.com/kubernetes/kubernetes/pull/58547), [@liggitt](https://github.com/liggitt))

* kube-apiserver: requests to endpoints handled by unavailable extension API servers (as indicated by an `Available` condition of `false` in the registered APIService) now return `503` errors instead of `404` errors. ([#58070](https://github.com/kubernetes/kubernetes/pull/58070), [@weekface](https://github.com/weekface))

* Custom resources can now be submitted to and received from the API server in application/yaml format, consistent with other API resources. ([#58260](https://github.com/kubernetes/kubernetes/pull/58260), [@liggitt](https://github.com/liggitt))

### Network

* Fixed kube-proxy to work correctly with iptables 1.6.2 and later. ([#60978](https://github.com/kubernetes/kubernetes/pull/60978), [@danwinship](https://github.com/danwinship))

* Makes the kube-dns addon optional so that users can deploy their own DNS solution. ([#57113](https://github.com/kubernetes/kubernetes/pull/57113), [@wwwtyro]([https://github.com/wwwtyro](https://github.com/wwwtyro) ))

* `kubectl port-forward` now supports specifying a service to port forward to, as in `kubectl port-forward svc/myservice 8443:443`. Additional support has also been added for looking up targetPort for a service, as well as enabling using svc/name to select a pod. ([#59809](https://github.com/kubernetes/kubernetes/pull/59809), [@phsiao](https://github.com/phsiao))
* [Make NodePort IP addres](https://github.com/kubernetes/website/pull/7631/files)[ses configurabl](https://github.com/kubernetes/website/pull/7631/files)[e](https://github.com/kubernetes/website/pull/7631/files). ([#58052](https://github.com/kubernetes/kubernetes/pull/58052), [@m1093782566](https://github.com/m1093782566))

* Fixed the issue in kube-proxy iptables/ipvs mode to properly handle incorrect IP version. ([#56880](https://github.com/kubernetes/kubernetes/pull/56880), [@MrHohn](https://github.com/MrHohn))
* Kubeadm: CoreDNS supports migration of the kube-dns configuration to CoreDNS configuration when upgrading the service discovery from kube-dns to CoreDNS as part of Beta.  ([#58828](https://github.com/kubernetes/kubernetes/pull/58828), [@rajansandeep](https://github.com/rajansandeep))

* Adds BETA support for `DNSConfig` field in PodSpec and `DNSPolicy=None`, so configurable pod resolve.conf is now enabled by default. ([#59771](https://github.com/kubernetes/kubernetes/pull/59771), [@MrHohn](https://github.com/MrHohn))
* Removed some redundant rules created by the iptables proxier to improve performance on systems with very many services. ([#57461](https://github.com/kubernetes/kubernetes/pull/57461), [@danwinship](https://github.com/danwinship))

* Fix an issue where port forwarding doesn't forward local TCP6 ports to the pod ([#57457](https://github.com/kubernetes/kubernetes/pull/57457), [@vfreex](https://github.com/vfreex))
* Correctly handle transient connection reset errors on GET requests from client library. ([#58520](https://github.com/kubernetes/kubernetes/pull/58520), [@porridge](https://github.com/porridge))

* GCE: Allows existing internal load balancers to continue using a subnetwork that may have been wrongfully chosen due to a bug choosing subnetworks on automatic networks.  ([#57861](https://github.com/kubernetes/kubernetes/pull/57861), [@nicksardo](https://github.com/nicksardo))
### Azure

* Set node external IP for azure node when disabling UseInstanceMetadata. ([#60959](https://github.com/kubernetes/kubernetes/pull/60959), [@feiskyer](https://github.com/feiskyer))

* Changed default azure file/dir mode to 0755. ([#56551](https://github.com/kubernetes/kubernetes/pull/56551), [@andyzhangx](https://github.com/andyzhangx))

* Fixed azure file plugin failure issue on Windows after node restart. ([#60625](https://github.com/kubernetes/kubernetes/pull/60625), [@andyzhangx](https://github.com/andyzhangx))([#60623](https://github.com/kubernetes/kubernetes/pull/60623), [@feiskyer](https://github.com/feiskyer))

* Fixed race condition issue when detaching azure disk, preventing `Multi-Attach error`s when scheduling one pod from one node to another. ([#60183](https://github.com/kubernetes/kubernetes/pull/60183), [@andyzhangx](https://github.com/andyzhangx))

* Add AzureDisk support for vmss nodes. ([#59716]([https://github.com/kubernetes/kubernetes/pull/59716](https://github.com/kubernetes/kubernetes/pull/59716)), [@feiskyer](https://github.com/feiskyer))

* Map correct vmset name for Azure internal load balancers. ([#59747](https://github.com/kubernetes/kubernetes/pull/59747), [@feiskyer](https://github.com/feiskyer))

* Node's providerID will now follow the Azure resource ID format (`azure:///subscriptions/<id>/resourceGroups/<rg>/providers/Microsoft.Compute/virtualMachines/<node-name>` rather than `azure://d84a1c30-0c9f-11e8-8a34-000d3a919531`) when useInstanceMetadata is enabled ([#59539](https://github.com/kubernetes/kubernetes/pull/59539), [@feiskyer](https://github.com/feiskyer))

* Azure public IP is now correctly removed after a service is deleted. ([#59340](https://github.com/kubernetes/kubernetes/pull/59340), [@feiskyer](https://github.com/feiskyer))

* Added PV size grow feature for azure filesystems. ([#57017](https://github.com/kubernetes/kubernetes/pull/57017), [@andyzhangx](https://github.com/andyzhangx))

* Ensured IP is set for Azure internal load balancer. ([#59083](https://github.com/kubernetes/kubernetes/pull/59083), [@feiskyer](https://github.com/feiskyer))

* Set fsGroup by securityContext.fsGroup in azure file. However,f user both sets gid=xxx in mountOptions in azure storage class and securityContext.fsGroup, gid=xxx setting in mountOptions takes precedence. ([#58316](https://github.com/kubernetes/kubernetes/pull/58316), [@andyzhangx](https://github.com/andyzhangx))

* If an Azure disk is not found, K8s will immediately detach it. ([#58345](https://github.com/kubernetes/kubernetes/pull/58345), [@rootfs](https://github.com/rootfs))
* Instrumented the Azure cloud provider for Prometheus monitoring. ([#58204](https://github.com/kubernetes/kubernetes/pull/58204), [@cosmincojocar](https://github.com/cosmincojocar))

* Fixed device name change issues for azure disk. ([#57953](https://github.com/kubernetes/kubernetes/pull/57953), [@andyzhangx](https://github.com/andyzhangx)) ([#57549](https://github.com/kubernetes/kubernetes/pull/57549), [@andyzhangx](https://github.com/andyzhangx))

* Support multiple scale sets in Azure cloud provider. ([#57543](https://github.com/kubernetes/kubernetes/pull/57543), [@feiskyer](https://github.com/feiskyer))

* Support LoadBalancer for Azure Virtual Machine Scale Sets ([#57131](https://github.com/kubernetes/kubernetes/pull/57131), [@feiskyer](https://github.com/feiskyer))

* Fixed incorrect error info when creating an azure file PVC failed. ([#56550](https://github.com/kubernetes/kubernetes/pull/56550), [@andyzhangx](https://github.com/andyzhangx))

* Added mount options support for azure disk. For example:

```
kind: StorageClass
apiVersion: storage.k8s.io/v1
metadata:
  name: hdd
provisioner: kubernetes.io/azure-disk
mountOptions:
  - barrier=1
  - acl
parameters:
  skuname: Standard_LRS
  kind: Managed
  fstype: ext3
```

([#56147](https://github.com/kubernetes/kubernetes/pull/56147), [@andyzhangx](https://github.com/andyzhangx))

### Scheduling

* Fixed a bug the in scheduler cache by using Pod UID as the cache key instead of namespace/name ([#61069](https://github.com/kubernetes/kubernetes/pull/61069), [@anfernee](https://github.com/anfernee))

* When `TaintNodesByCondition` is enabled, added `node.kubernetes.io/unschedulable:NoSchedule` ([#61161](https://github.com/kubernetes/kubernetes/pull/61161), [@k82cn](https://github.com/k82cn))

* kube-scheduler: Support extender managed extended resources in kube-scheduler ([#60332](https://github.com/kubernetes/kubernetes/pull/60332), [@yguo0905](https://github.com/yguo0905))

* Updated priority of mirror pod according to PriorityClassName. ([#58485](https://github.com/kubernetes/kubernetes/pull/58485), [@k82cn](https://github.com/k82cn))

* kube-scheduler: restores default leader election behavior. Setting the `--leader-elect`  command line parameter to `true` ([#60524](https://github.com/kubernetes/kubernetes/pull/60524), [@dims](https://github.com/dims))

* All pods with priorityClassName system-node-critical and system-cluster-critical will be critical pods while preserving backwards compatibility. ([#58835](https://github.com/kubernetes/kubernetes/pull/58835), [@ravisantoshgudimetla](https://github.com/ravisantoshgudimetla))
* Priority admission controller picks a global default with the lowest priority value if more than one such default PriorityClass exists. ([#59991](https://github.com/kubernetes/kubernetes/pull/59991), [@bsalamat](https://github.com/bsalamat))
* Disallow PriorityClass names with 'system-' prefix for user defined priority classes. ([#59382](https://github.com/kubernetes/kubernetes/pull/59382), [@bsalamat](https://github.com/bsalamat))
* kube-scheduler: Use default predicates/prioritizers if they are unspecified in the policy config. ([#59363](https://github.com/kubernetes/kubernetes/pull/59363), [@yguo0905](https://github.com/yguo0905))

* Scheduler should be able to read from config file if configmap is not present. ([#59386](https://github.com/kubernetes/kubernetes/pull/59386), [@ravisantoshgudimetla](https://github.com/ravisantoshgudimetla))
* Add apiserver metric for current inflight-request usage. ([#58342](https://github.com/kubernetes/kubernetes/pull/58342), [@gmarek](https://github.com/gmarek))

* Stability: Make Pod delete event handling of scheduler more robust. ([#58712](https://github.com/kubernetes/kubernetes/pull/58712), [@bsalamat](https://github.com/bsalamat))* Allow scheduler set AlwaysCheckAllPredicates, short circuit all predicates if one predicate fails can greatly improve the scheduling performance. ([#56926](https://github.com/kubernetes/kubernetes/pull/56926), [@wgliang](https://github.com/wgliang))

* GCE: support passing kube-scheduler policy config via SCHEDULER_POLICY_CONFIG. This allows us to specify a customized scheduler policy configuration. ([#57425](https://github.com/kubernetes/kubernetes/pull/57425), [@yguo0905](https://github.com/yguo0905))

* Returns an error for non overcommitable resources if they don't have limit field set in container spec to prevent users from creating invalid configurations. ([#57170](https://github.com/kubernetes/kubernetes/pull/57170), [@jiayingz](https://github.com/jiayingz))

* GCE: Fixed ILB creation on automatic networks with manually created subnetworks. ([#57351](https://github.com/kubernetes/kubernetes/pull/57351), [@nicksardo](https://github.com/nicksardo))

* Multiple Performance Improvements to the MatchInterPodAffinity predicate ([#57476](https://github.com/kubernetes/kubernetes/pull/57476), [@misterikkit](https://github.com/misterikkit))([#57477](https://github.com/kubernetes/kubernetes/pull/57477), [@misterikkit](https://github.com/misterikkit))

* The calico-node addon tolerates all NoExecute and NoSchedule taints by default. So Calico components can even be scheduled on tainted nodes. ([#57122](https://github.com/kubernetes/kubernetes/pull/57122), [@caseydavenport](https://github.com/caseydavenport))
* The scheduler skips pods that use a PVC that either does not exist or is being deleted. ([#55957](https://github.com/kubernetes/kubernetes/pull/55957), [@jsafrane](https://github.com/jsafrane))

### Other changes

* Updated dashboard version to v1.8.3, which keeps auto-generated certs in memory. ([#57326](https://github.com/kubernetes/kubernetes/pull/57326), [@floreks](https://github.com/floreks))

* fluentd-gcp addon: Fixed bug with reporting metrics in event-exporter. ([#60126](https://github.com/kubernetes/kubernetes/pull/60126), [@serathius](https://github.com/serathius))

* Avoid hook errors when effecting label changes on kubernetes-worker charm. ([#59803](https://github.com/kubernetes/kubernetes/pull/59803), [@wwwtyro](https://github.com/wwwtyro))

* Fixed charm issue where docker login would run prior to daemon options being set.  ([#59396](https://github.com/kubernetes/kubernetes/pull/59396), [@kwmonroe](https://github.com/kwmonroe))

* Implementers of the cloud provider interface will note the addition of a context to this interface. Trivial code modification will be necessary for a cloud provider to continue to compile. ([#59287](https://github.com/kubernetes/kubernetes/pull/59287), [@cheftako](https://github.com/cheftako))

* Added configurable etcd quota backend bytes in GCE. ([#59259](https://github.com/kubernetes/kubernetes/pull/59259), [@wojtek-t](https://github.com/wojtek-t))

* GCP: allow a master to not include a metadata concealment firewall rule (if it's not running the metadata proxy). ([#58104](https://github.com/kubernetes/kubernetes/pull/58104), [@ihmccreery](https://github.com/ihmccreery))

* Fixed issue with kubernetes-worker option allow-privileged not properly handling the value True with a capital T. ([#59116](https://github.com/kubernetes/kubernetes/pull/59116), [@hyperbolic2346](https://github.com/hyperbolic2346))

* Controller-manager --service-sync-period flag has been removed. (It was never used in the code and should have no user impact.) ([#59359](https://github.com/kubernetes/kubernetes/pull/59359), [@khenidak](https://github.com/khenidak))

* [fluentd-gcp addon] Switch to the image provided by Stackdriver. The Stackdriver Logging Agent container image uses fluentd v0.14.25. ([#59128](https://github.com/kubernetes/kubernetes/pull/59128), [@bmoyles0117](https://github.com/bmoyles0117))

## Non-user-facing Changes

* CRI now uses moutpoint as image filesystem identifier instead of UUID. ([#59475](https://github.com/kubernetes/kubernetes/pull/59475), [@Random-Liu](https://github.com/Random-Liu))

* GCE: support Cloud TPU API in cloud provider ([#58029](https://github.com/kubernetes/kubernetes/pull/58029), [@yguo0905](https://github.com/yguo0905))

* kubelet now notifies systemd that it has finished starting, if systemd is available and running. ([#60654](https://github.com/kubernetes/kubernetes/pull/60654), [@dcbw](https://github.com/dcbw))

* Do not count failed pods as unready in HPA controller ([#60648](https://github.com/kubernetes/kubernetes/pull/60648), [@bskiba](https://github.com/bskiba))

* fixed foreground deletion of podtemplates ([#60683](https://github.com/kubernetes/kubernetes/pull/60683), [@nilebox](https://github.com/nilebox))

* Conformance tests are added for the DaemonSet kinds in the apps/v1 group version. Deprecated versions of DaemonSet will not be tested for conformance, and conformance is only applicable to release 1.10 and later. ([#60456](https://github.com/kubernetes/kubernetes/pull/60456), [@kow3ns](https://github.com/kow3ns))

* Log audit backend can now be configured to perform batching before writing events to disk. ([#60237](https://github.com/kubernetes/kubernetes/pull/60237), [@crassirostris](https://github.com/crassirostris))

* New conformance tests added for the Garbage Collector ([#60116](https://github.com/kubernetes/kubernetes/pull/60116), [@jennybuckley](https://github.com/jennybuckley))

* Fixes a bug where character devices are not recongized by the kubelet ([#60440](https://github.com/kubernetes/kubernetes/pull/60440), [@andrewsykim](https://github.com/andrewsykim))

* StatefulSet in apps/v1 is now included in Conformance Tests. ([#60336](https://github.com/kubernetes/kubernetes/pull/60336), [@enisoc](https://github.com/enisoc))

* dockertools: disable memory swap on Linux. ([#59404](https://github.com/kubernetes/kubernetes/pull/59404), [@ohmystack](https://github.com/ohmystack))

* Increase timeout of integration tests ([#60458](https://github.com/kubernetes/kubernetes/pull/60458), [@jennybuckley](https://github.com/jennybuckley))

* force node name lowercase on static pod name generating ([#59849](https://github.com/kubernetes/kubernetes/pull/59849), [@yue9944882]([https://github.com/yue9944882](https://github.com/yue9944882))

* fix device name change issue for azure disk ([#60346](https://github.com/kubernetes/kubernetes/pull/60346), [@andyzhangx](https://github.com/andyzhangx))

* Additional changes to iptables kube-proxy backend to improve performance on clusters with very large numbers of services. ([#60306](https://github.com/kubernetes/kubernetes/pull/60306), [@danwinship](https://github.com/danwinship))

* add spelling checking script ([#59463](https://github.com/kubernetes/kubernetes/pull/59463), [@dixudx](https://github.com/dixudx))

* Use consts as predicate name in handlers ([#59952](https://github.com/kubernetes/kubernetes/pull/59952), [@resouer](https://github.com/resouer))

* Fix instanceID for vmss nodes. ([#59857](https://github.com/kubernetes/kubernetes/pull/59857), [@feiskyer](https://github.com/feiskyer))

* Increase allowed lag for ssh key sync loop in tunneler to allow for one failure ([#60068](https://github.com/kubernetes/kubernetes/pull/60068), [@wojtek-t](https://github.com/wojtek-t))

* Set an upper bound (5 minutes) on how long the Kubelet will wait before exiting when the client cert from disk is missing or invalid. This prevents the Kubelet from waiting forever without attempting to bootstrap a new client credentials. ([#59316](https://github.com/kubernetes/kubernetes/pull/59316), [@smarterclayton](https://github.com/smarterclayton))

* Add ipset binary for IPVS to hyperkube docker image ([#57648](https://github.com/kubernetes/kubernetes/pull/57648), [@Fsero](https://github.com/Fsero))

* Making sure CSI E2E test runs on a local cluster ([#60017](https://github.com/kubernetes/kubernetes/pull/60017), [@sbezverk](https://github.com/sbezverk))

* Fix kubelet PVC stale metrics ([#59170](https://github.com/kubernetes/kubernetes/pull/59170), [@cofyc](https://github.com/cofyc))

* Separate current ARM rate limiter into read/write ([#59830](https://github.com/kubernetes/kubernetes/pull/59830), [@khenidak](https://github.com/khenidak))

* Improve control over how ARM rate limiter is used within Azure cloud provider, add generic cache for Azure VM/LB/NSG/RouteTable ([#59520](https://github.com/kubernetes/kubernetes/pull/59520), [@feiskyer](https://github.com/feiskyer))

* fix typo  ([#59619](https://github.com/kubernetes/kubernetes/pull/59619), [@jianliao82](https://github.com/jianliao82))

* DaemonSet, Deployment, ReplicaSet, and StatefulSet objects are now persisted in etcd in apps/v1 format ([#58854](https://github.com/kubernetes/kubernetes/pull/58854), [@liggitt](https://github.com/liggitt))

* YAMLDecoder Read now tracks rest of buffer on io.ErrShortBuffer ([#58817](https://github.com/kubernetes/kubernetes/pull/58817), [@karlhungus](https://github.com/karlhungus))

* Prevent kubelet from getting wedged if initialization of modules returns an error. ([#59020](https://github.com/kubernetes/kubernetes/pull/59020), [@brendandburns](https://github.com/brendandburns))

* Fixed a race condition inside kubernetes-worker that would result in a temporary error situation. ([#59005](https://github.com/kubernetes/kubernetes/pull/59005), [@hyperbolic2346](https://github.com/hyperbolic2346))

* Fix regression in the CRI: do not add a default hostname on short image names ([#58955](https://github.com/kubernetes/kubernetes/pull/58955), [@runcom](https://github.com/runcom))

* use containing API group when resolving shortname from discovery ([#58741](https://github.com/kubernetes/kubernetes/pull/58741), [@dixudx](https://github.com/dixudx))

* remove spaces from kubectl describe hpa ([#56331](https://github.com/kubernetes/kubernetes/pull/56331), [@shiywang](https://github.com/shiywang))

* fluentd-es addon: multiline stacktraces are now grouped into one entry automatically ([#58063](https://github.com/kubernetes/kubernetes/pull/58063), [@monotek](https://github.com/monotek))

* Default scheduler code is moved out of the plugin directory. ([#57852](https://github.com/kubernetes/kubernetes/pull/57852), [@misterikkit](https://github.com/misterikkit))

* CDK nginx ingress is now handled via a daemon set. ([#57530](https://github.com/kubernetes/kubernetes/pull/57530), [@hyperbolic2346](https://github.com/hyperbolic2346))

* Move local PV negative scheduling tests to integration ([#57570](https://github.com/kubernetes/kubernetes/pull/57570), [@sbezverk](https://github.com/sbezverk))

* Only create Privileged PSP binding during e2e tests if RBAC is enabled. ([#56382](https://github.com/kubernetes/kubernetes/pull/56382), [@mikkeloscar](https://github.com/mikkeloscar))

* ignore nonexistent ns net file error when deleting container network in case a retry ([#57697](https://github.com/kubernetes/kubernetes/pull/57697), [@dixudx](https://github.com/dixudx))

* Use old dns-ip mechanism with older cdk-addons. ([#57403](https://github.com/kubernetes/kubernetes/pull/57403), [@wwwtyro](https://github.com/wwwtyro))

* Retry 'connection refused' errors when setting up clusters on GCE. ([#57394](https://github.com/kubernetes/kubernetes/pull/57394), [@mborsz](https://github.com/mborsz))

* YAMLDecoder Read now returns the number of bytes read ([#57000](https://github.com/kubernetes/kubernetes/pull/57000), [@sel](https://github.com/sel))

* Drop hacks used for Mesos integration that was already removed from main kubernetes repository ([#56754](https://github.com/kubernetes/kubernetes/pull/56754), [@dims](https://github.com/dims))

* Compare correct file names for volume detach operation ([#57053](https://github.com/kubernetes/kubernetes/pull/57053), [@prashima](https://github.com/prashima))

* Fixed documentation typo in IPVS README. ([#56578](https://github.com/kubernetes/kubernetes/pull/56578), [@shift](https://github.com/shift))

* The ConfigOK node condition has been renamed to KubeletConfigOk. ([#59905](https://github.com/kubernetes/kubernetes/pull/59905), [@mtaufen](https://github.com/mtaufen))

* Adding pkg/kubelet/apis/deviceplugin/v1beta1 API. ([#59588](https://github.com/kubernetes/kubernetes/pull/59588), [@jiayingz](https://github.com/jiayingz))

* Fixes volume predicate handler for equiv class ([#59335](https://github.com/kubernetes/kubernetes/pull/59335), [@resouer](https://github.com/resouer))

* Bugfix: vSphere Cloud Provider (VCP) does not need any special service account anymore. ([#59440](https://github.com/kubernetes/kubernetes/pull/59440), [@rohitjogvmw](https://github.com/rohitjogvmw))

* fix the error prone account creation method of blob disk ([#59739](https://github.com/kubernetes/kubernetes/pull/59739), [@andyzhangx](https://github.com/andyzhangx))

* Updated kubernetes-worker to request new security tokens when the aws cloud provider changes the registered node name. ([#59730](https://github.com/kubernetes/kubernetes/pull/59730), [@hyperbolic2346](https://github.com/hyperbolic2346))

* Pod priority can be specified ins PodSpec even when the feature is disabled, but it will be effective only when the feature is enabled. ([#59291](https://github.com/kubernetes/kubernetes/pull/59291), [@bsalamat](https://github.com/bsalamat))* Add generic cache for Azure VMSS ([#59652](https://github.com/kubernetes/kubernetes/pull/59652), [@feiskyer](https://github.com/feiskyer))

* fix the create azure file pvc failure if there is no storage account in current resource group ([#56557](https://github.com/kubernetes/kubernetes/pull/56557), [@andyzhangx](https://github.com/andyzhangx))

* Implement envelope service with gRPC, so that KMS providers can be pulled out from API server. ([#55684](https://github.com/kubernetes/kubernetes/pull/55684), [@wu-qiang](https://github.com/wu-qiang))

* Enable golint for `pkg/scheduler` and fix the golint errors in it. ([#58437](https://github.com/kubernetes/kubernetes/pull/58437), [@tossmilestone](https://github.com/tossmilestone))

* Ensure euqiv hash calculation is per schedule ([#59245](https://github.com/kubernetes/kubernetes/pull/59245), [@resouer](https://github.com/resouer))

* Upped the timeout for apiserver communication in the juju kubernetes-worker charm. ([#59219](https://github.com/kubernetes/kubernetes/pull/59219), [@hyperbolic2346](https://github.com/hyperbolic2346))

* kubeadm init: skip checking cri socket in preflight checks ([#58802](https://github.com/kubernetes/kubernetes/pull/58802), [@dixudx](https://github.com/dixudx))

* Configurable etcd compaction frequency in GCE ([#59106](https://github.com/kubernetes/kubernetes/pull/59106), [@wojtek-t](https://github.com/wojtek-t))

* Fixed a bug which caused the apiserver reboot failure in the presence of malfunctioning webhooks. ([#59073](https://github.com/kubernetes/kubernetes/pull/59073), [@caesarxuchao](https://github.com/caesarxuchao))

* GCE: Apiserver uses `InternalIP` as the most preferred kubelet address type by default. ([#59019](https://github.com/kubernetes/kubernetes/pull/59019), [@MrHohn](https://github.com/MrHohn))

* CRI: Add a call to reopen log file for a container.  ([#58899](https://github.com/kubernetes/kubernetes/pull/58899), [@yujuhong](https://github.com/yujuhong))

* The alpha KubeletConfigFile feature gate has been removed, because it was redundant with the Kubelet's --config flag. It is no longer necessary to set this gate to use the flag. The --config flag is still considered alpha. ([#58978](https://github.com/kubernetes/kubernetes/pull/58978), [@mtaufen](https://github.com/mtaufen))

* Fixing extra_sans option on master and load balancer. ([#58843](https://github.com/kubernetes/kubernetes/pull/58843), [@hyperbolic2346](https://github.com/hyperbolic2346))

* Ensure config has been created before attempting to launch ingress. ([#58756](https://github.com/kubernetes/kubernetes/pull/58756), [@wwwtyro](https://github.com/wwwtyro))

* Support metrics API in `kubectl top` commands. ([#56206](https://github.com/kubernetes/kubernetes/pull/56206), [@brancz](https://github.com/brancz))

* Bump GCE metadata proxy to v0.1.9 to pick up security fixes. ([#58221](https://github.com/kubernetes/kubernetes/pull/58221), [@ihmccreery](https://github.com/ihmccreery))

* "ExternalTrafficLocalOnly" has been removed from feature gate. It has been a GA feature since v1.7. ([#56948](https://github.com/kubernetes/kubernetes/pull/56948), [@MrHohn](https://github.com/MrHohn))
* feat(fakeclient): push event on watched channel on add/update/delete ([#57504](https://github.com/kubernetes/kubernetes/pull/57504), [@yue9944882](https://github.com/yue9944882))

* Fixes a possible deadlock preventing quota from being recalculated ([#58107](https://github.com/kubernetes/kubernetes/pull/58107), [@ironcladlou](https://github.com/ironcladlou))

* Bump metadata proxy version to v0.1.7 to pick up security fix. ([#57762](https://github.com/kubernetes/kubernetes/pull/57762), [@ihmccreery](https://github.com/ihmccreery))

* The kubelet uses a new release 3.1 of the pause container with the Docker runtime. This version will clean up orphaned zombie processes that it inherits. ([#57517](https://github.com/kubernetes/kubernetes/pull/57517), [@verb](https://github.com/verb))

* Add cache for VM get operation in azure cloud provider ([#57432](https://github.com/kubernetes/kubernetes/pull/57432), [@karataliu](https://github.com/karataliu))

* Configurable liveness probe initial delays for etcd and kube-apiserver in GCE ([#57749](https://github.com/kubernetes/kubernetes/pull/57749), [@wojtek-t](https://github.com/wojtek-t))

* Fixed garbage collection hang ([#57503](https://github.com/kubernetes/kubernetes/pull/57503), [@liggitt](https://github.com/liggitt)

* Improve scheduler performance of MatchInterPodAffinity predicate. ([#57478](https://github.com/kubernetes/kubernetes/pull/57478), [@misterikkit](https://github.com/misterikkit))

* Add the path '/version/' to the `system:discovery` cluster role. ([#57368](https://github.com/kubernetes/kubernetes/pull/57368), [@brendandburns](https://github.com/brendandburns))

* adding predicates ordering for the kubernetes scheduler. ([#57168](https://github.com/kubernetes/kubernetes/pull/57168), [@yastij](https://github.com/yastij))

* Fix ipvs proxier nodeport ethassumption ([#56685](https://github.com/kubernetes/kubernetes/pull/56685), [@m1093782566](https://github.com/m1093782566))

* Fix Heapster configuration and Metrics Server configuration to enable overriding default resource requirements. ([#56965](https://github.com/kubernetes/kubernetes/pull/56965), [@kawych](https://github.com/kawych))

* Improved event generation in volume mount, attach, and extend operations ([#56872](https://github.com/kubernetes/kubernetes/pull/56872), [@davidz627](https://github.com/davidz627))

* Remove ScrubDNS interface from cloudprovider. ([#56955](https://github.com/kubernetes/kubernetes/pull/56955), [@feiskyer](https://github.com/feiskyer))

* Fixed a garbage collection race condition where objects with ownerRefs pointing to cluster-scoped objects could be deleted incorrectly. ([#57211](https://github.com/kubernetes/kubernetes/pull/57211), [@liggitt](https://github.com/liggitt))

* api-server provides specific events when unable to repair a service cluster ip or node port ([#54304](https://github.com/kubernetes/kubernetes/pull/54304), [@frodenas](https://github.com/frodenas))

* delete useless params containerized ([#56146](https://github.com/kubernetes/kubernetes/pull/56146), [@jiulongzaitian](https://github.com/jiulongzaitian))

* dockershim now makes an Image's Labels available in the Info field of ImageStatusResponse ([#58036](https://github.com/kubernetes/kubernetes/pull/58036), [@shlevy](https://github.com/shlevy))

* Support GetLabelsForVolume in OpenStack Provider ([#58871](https://github.com/kubernetes/kubernetes/pull/58871), [@edisonxiang](https://github.com/edisonxiang))

* Add "nominatedNodeName" field to PodStatus. This field is set when a pod preempts other pods on the node. ([#58990](https://github.com/kubernetes/kubernetes/pull/58990), [@bsalamat](https://github.com/bsalamat))* Fix the PersistentVolumeLabel controller from initializing the PV labels when it's not the next pending initializer. ([#56831](https://github.com/kubernetes/kubernetes/pull/56831), [@jhorwit2](https://github.com/jhorwit2))

* Rename StorageProtection to StorageObjectInUseProtection ([#59901](https://github.com/kubernetes/kubernetes/pull/59901), [@NickrenREN](https://github.com/NickrenREN))

* Add support for cloud-controller-manager in local-up-cluster.sh ([#57757](https://github.com/kubernetes/kubernetes/pull/57757), [@dims](https://github.com/dims))

* GCE: A role and clusterrole will now be provided with GCE/GKE for allowing the cloud-provider to post warning events on all services and watching configmaps in the kube-system namespace. No user action is required. ([#59686](https://github.com/kubernetes/kubernetes/pull/59686), [@nicksardo](https://github.com/nicksardo))

<<<<<<< HEAD
* Wait for kubedns to be ready when collecting the cluster IP. ([#57337](https://github.com/kubernetes/kubernetes/pull/57337), [@wwwtyro](https://github.com/wwwtyro))
||||||| merged common ancestors
#### **GCP**

*   The service account made available on your nodes is now configurable. ([#52868](https://github.com/kubernetes/kubernetes/pull/52868),[ @ihmccreery](https://github.com/ihmccreery))
*   GCE nodes with NVIDIA GPUs attached now expose nvidia.com/gpu as a resource instead of alpha.kubernetes.io/nvidia-gpu. ([#54826](https://github.com/kubernetes/kubernetes/pull/54826),[ @mindprince](https://github.com/mindprince))
*   Docker's live-restore on COS/ubuntu can now be disabled ([#55260](https://github.com/kubernetes/kubernetes/pull/55260),[ @yujuhong](https://github.com/yujuhong))
*   Metadata concealment is now controlled by the ENABLE_METADATA_CONCEALMENT env var. See cluster/gce/config-default.sh for more info. ([#54150](https://github.com/kubernetes/kubernetes/pull/54150),[ @ihmccreery](https://github.com/ihmccreery))
*   Masquerading rules are now added by default to GCE/GKE ([#55178](https://github.com/kubernetes/kubernetes/pull/55178),[ @dnardo](https://github.com/dnardo))
*   Fixed master startup issues with concurrent iptables invocations. ([#55945](https://github.com/kubernetes/kubernetes/pull/55945),[ @x13n](https://github.com/x13n))
*   Fixed issue deleting internal load balancers when the firewall resource may not exist. ([#53450](https://github.com/kubernetes/kubernetes/pull/53450),[ @nicksardo](https://github.com/nicksardo))

### **Instrumentation**

#### **Audit**

*   Adjust batching audit webhook default parameters: increase queue size, batch size, and initial backoff. Add throttling to the batching audit webhook. Default rate limit is 10 QPS. ([#53417](https://github.com/kubernetes/kubernetes/pull/53417),[ @crassirostris](https://github.com/crassirostris))
    *   These parameters are also now configurable. ([#56638](https://github.com/kubernetes/kubernetes/pull/56638), [@crassirostris](https://github.com/crassirostris))

#### **Other**

*   Fix a typo in prometheus-to-sd configuration, that drops some stackdriver metrics. ([#56473](https://github.com/kubernetes/kubernetes/pull/56473),[ @loburm](https://github.com/loburm))
*   [fluentd-elasticsearch addon] Elasticsearch and Kibana are updated to version 5.6.4 ([#55400](https://github.com/kubernetes/kubernetes/pull/55400),[ @mrahbar](https://github.com/mrahbar))
*   fluentd now supports CRI log format. ([#54777](https://github.com/kubernetes/kubernetes/pull/54777),[ @Random-Liu](https://github.com/Random-Liu))
*   Bring all prom-to-sd container to the same image version ([#54583](https://github.com/kubernetes/kubernetes/pull/54583))
    *   Reduce log noise produced by prometheus-to-sd, by bumping it to version 0.2.2. ([#54635](https://github.com/kubernetes/kubernetes/pull/54635),[ @loburm](https://github.com/loburm))
*   [fluentd-elasticsearch addon] Elasticsearch service name can be overridden via env variable ELASTICSEARCH_SERVICE_NAME ([#54215](https://github.com/kubernetes/kubernetes/pull/54215),[ @mrahbar](https://github.com/mrahbar))

### **Multicluster**

#### **Federation**

*   Kubefed init now supports --imagePullSecrets and --imagePullPolicy, making it possible to use private registries. ([#50740](https://github.com/kubernetes/kubernetes/pull/50740),[ @dixudx](https://github.com/dixudx))
*   Updated cluster printer to enable --show-labels ([#53771](https://github.com/kubernetes/kubernetes/pull/53771),[ @dixudx](https://github.com/dixudx))
*   Kubefed init now supports --nodeSelector, enabling you to determine on what node the controller will be installed. ([#50749](https://github.com/kubernetes/kubernetes/pull/50749),[ @dixudx](https://github.com/dixudx))

### **Network**

#### **IPv6**

*   [alpha] IPv6 support has been added. Notable IPv6 support details include:
    *   Support for IPv6-only Kubernetes cluster deployments. **<span style="text-decoration:underline;">Note:</span>** This feature does not provide dual-stack support.
    *   Support for IPv6 Kubernetes control and data planes.
    *   Support for Kubernetes IPv6 cluster deployments using kubeadm.
    *   Support for the iptables kube-proxy backend using ip6tables.
    *   Relies on CNI 0.6.0 binaries for IPv6 pod networking.
    *   Adds IPv6 support for kube-dns using SRV records.
    *   Caveats
        *   Only the CNI bridge and local-ipam plugins have been tested for the alpha release, although other CNI plugins do support IPv6.
        *   HostPorts are not supported.
*   An IPv6 network mask for pod or cluster cidr network must be /66 or longer. For example: 2001:db1::/66, 2001:dead:beef::/76, 2001:cafe::/118 are supported. 2001:db1::/64 is not supported
*   For details, see [the complete list of merged pull requests for IPv6 support](https://github.com/kubernetes/kubernetes/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Amerged+label%3Aarea%2Fipv6).

#### **IPVS**

*   You can now use the --cleanup-ipvs flag to tell kube-proxy whether to flush all existing ipvs rules in on startup ([#56036](https://github.com/kubernetes/kubernetes/pull/56036),[ @m1093782566](https://github.com/m1093782566))
*   Graduate kube-proxy IPVS mode to beta. ([#56623](https://github.com/kubernetes/kubernetes/pull/56623), [@m1093782566](https://github.com/m1093782566))

#### **Kube-Proxy**

*   Added iptables rules to allow Pod traffic even when default iptables policy is to reject. ([#52569](https://github.com/kubernetes/kubernetes/pull/52569),[ @tmjd](https://github.com/tmjd))
*   You can once again use 0 values for conntrack min, max, max per core, tcp close wait timeout, and tcp established timeout; this functionality was broken in 1.8. ([#55261](https://github.com/kubernetes/kubernetes/pull/55261),[ @ncdc](https://github.com/ncdc))

#### **CoreDNS**

*   You now have the option to use CoreDNS instead of KubeDNS. To install CoreDNS instead of kube-dns, set CLUSTER_DNS_CORE_DNS to 'true'. This support is experimental. ([#52501](https://github.com/kubernetes/kubernetes/pull/52501),[ @rajansandeep](https://github.com/rajansandeep)) ([#55728](https://github.com/kubernetes/kubernetes/pull/55728),[ @rajansandeep](https://github.com/rajansandeep))

#### **Other**

*   Pod addresses will now be removed from the list of endpoints when the pod is in graceful termination. ([#54828](https://github.com/kubernetes/kubernetes/pull/54828),[ @freehan](https://github.com/freehan))
*   You can now use a new supported service annotation for AWS clusters, `service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy`, which lets you specify which [predefined AWS SSL policy](http://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-security-policy-table.html) you would like to use. ([#54507](https://github.com/kubernetes/kubernetes/pull/54507),[ @micahhausler](https://github.com/micahhausler))
*   Termination grace period for the calico/node add-on DaemonSet has been eliminated, reducing downtime during a rolling upgrade or deletion. ([#55015](https://github.com/kubernetes/kubernetes/pull/55015),[ @fasaxc](https://github.com/fasaxc))
*   Fixed bad conversion in host port chain name generating func which led to some unreachable host ports. ([#55153](https://github.com/kubernetes/kubernetes/pull/55153),[ @chenchun](https://github.com/chenchun))
*   Fixed IPVS availability check ([#51874](https://github.com/kubernetes/kubernetes/pull/51874),[ @vfreex](https://github.com/vfreex))
*   The output for kubectl describe networkpolicy * has been enhanced to be more useful. ([#46951](https://github.com/kubernetes/kubernetes/pull/46951),[ @aanm](https://github.com/aanm))
*   Kernel modules are now loaded automatically inside a kube-proxy pod ([#52003](https://github.com/kubernetes/kubernetes/pull/52003),[ @vfreex](https://github.com/vfreex))
*   Improve resilience by annotating kube-dns addon with podAntiAffinity to prefer scheduling on different nodes. ([#52193](https://github.com/kubernetes/kubernetes/pull/52193),[ @StevenACoffman](https://github.com/StevenACoffman))
*   [alpha] Added DNSConfig field to PodSpec. "None" mode for DNSPolicy is now supported. ([#55848](https://github.com/kubernetes/kubernetes/pull/55848),[ @MrHohn](https://github.com/MrHohn))
*   You can now add "options" to the host's /etc/resolv.conf (or --resolv-conf), and they will be copied into pod's resolv.conf when dnsPolicy is Default. Being able to customize options is important because it is common to leverage options to fine-tune the behavior of DNS client. ([#54773](https://github.com/kubernetes/kubernetes/pull/54773),[ @phsiao](https://github.com/phsiao))
*   Fixed a bug so that the service controller no longer retries if doNotRetry service update fails. ([#54184](https://github.com/kubernetes/kubernetes/pull/54184),[ @MrHohn](https://github.com/MrHohn))
*   Added --no-negcache flag to kube-dns to prevent caching of NXDOMAIN responses. ([#53604](https://github.com/kubernetes/kubernetes/pull/53604),[ @cblecker](https://github.com/cblecker))

### **Node**

#### **Pod API**

*   A single value in metadata.annotations/metadata.labels can now be passed into the containers via the Downward API. ([#55902](https://github.com/kubernetes/kubernetes/pull/55902),[ @yguo0905](https://github.com/yguo0905))
*   Pods will no longer briefly transition to a "Pending" state during the deletion process. ([#54593](https://github.com/kubernetes/kubernetes/pull/54593),[ @dashpole](https://github.com/dashpole))
*   Added pod-level local ephemeral storage metric to the Summary API. Pod-level ephemeral storage reports the total filesystem usage for the containers and emptyDir volumes in the measured Pod. ([#55447](https://github.com/kubernetes/kubernetes/pull/55447),[ @jingxu97](https://github.com/jingxu97))

#### **Hardware Accelerators**

*   Kubelet now exposes metrics for NVIDIA GPUs attached to the containers. ([#55188](https://github.com/kubernetes/kubernetes/pull/55188),[ @mindprince](https://github.com/mindprince))
*   The device plugin Alpha API no longer supports returning artifacts per device as part of AllocateResponse. ([#53031](https://github.com/kubernetes/kubernetes/pull/53031),[ @vishh](https://github.com/vishh))
*   Fix to ignore extended resources that are not registered with kubelet during container resource allocation. ([#53547](https://github.com/kubernetes/kubernetes/pull/53547),[ @jiayingz](https://github.com/jiayingz))


#### **Container Runtime**
*   [alpha] [cri-tools](https://github.com/kubernetes-incubator/cri-tools): CLI and validation tools for CRI is now v1.0.0-alpha.0. This release mainly focuses on UX improvements. [[@feiskyer](https://github.com/feiskyer)]
    *   Make crictl command more user friendly and add more subcommands.
    *   Integrate with CRI verbose option to provide extra debug information.
    *   Update CRI to kubernetes v1.9.
    *   Bug fixes in validation test suites.
*   [beta] [cri-containerd](https://github.com/kubernetes-incubator/cri-containerd): CRI implementation for containerd is now v1.0.0-beta.0, [[@Random-Liu](https://github.com/Random-Liu)]
    *   This release supports Kubernetes 1.9+ and containerd v1.0.0+.
    *   Pass all Kubernetes 1.9 e2e test, node e2e test and CRI validation tests.
    *   [Kube-up.sh integration](https://github.com/kubernetes-incubator/cri-containerd/blob/master/docs/kube-up.md).
    *   [Full crictl integration including CRI verbose option.](https://github.com/kubernetes-incubator/cri-containerd/blob/master/docs/crictl.md)
    *   Integration with cadvisor to provide better summary api support.
*   [stable] [cri-o](https://github.com/kubernetes-incubator/cri-o): CRI implementation for OCI-based runtimes is now v1.9. [[@mrunalp](https://github.com/mrunalp)]
    *   Pass all the Kubernetes 1.9 end-to-end test suites and now gating PRs as well
    *   Pass all the CRI validation tests
    *   Release has been focused on bug fixes, stability and performance with runc and Clear Containers
    *   Minikube integration
*   [stable] [frakti](https://github.com/kubernetes/frakti): CRI implementation for hypervisor-based runtimes is now v1.9. [[@resouer](https://github.com/resouer)]
    *   Added ARM64 release. Upgraded to CNI 0.6.0, added block device as Pod volume mode. Fixed CNI plugin compatibility.
    *   Passed all CRI validation conformance tests and node end-to-end conformance tests.
*   [alpha] [rktlet](https://github.com/kubernetes-incubator/rktlet): CRI implementation for the rkt runtime is now v0.1.0. [[@iaguis](https://github.com/iaguis)]
    *   This is the first release of rktlet and it implements support for the CRI including fetching images, running pods, CNI networking, logging and exec.
This release passes 129/145 Kubernetes e2e conformance tests.
*   Container Runtime Interface API change. [[@yujuhong](https://github.com/yujuhong)]
    *   A new field is added to CRI container log format to support splitting a long log line into multiple lines. ([#55922](https://github.com/kubernetes/kubernetes/pull/55922), [@Random-Liu](https://github.com/Random-Liu))
    *   CRI now supports debugging via a verbose option for status functions. ([#53965](https://github.com/kubernetes/kubernetes/pull/53965), [@Random-Liu](https://github.com/Random-Liu))
    *   Kubelet can now provide full summary api support for the CRI container runtime, with the exception of container log stats. ([#55810](https://github.com/kubernetes/kubernetes/pull/55810), [@abhi](https://github.com/abhi))
    *   CRI now uses the correct localhost seccomp path when provided with input in the format of localhost//profileRoot/profileName. ([#55450](https://github.com/kubernetes/kubernetes/pull/55450), [@feiskyer](https://github.com/feiskyer))


#### **Kubelet**

*   The EvictionHard, EvictionSoft, EvictionSoftGracePeriod, EvictionMinimumReclaim, SystemReserved, and KubeReserved fields in the KubeletConfiguration object (`kubeletconfig/v1alpha1`) are now of type map[string]string, which facilitates writing JSON and YAML files. ([#54823](https://github.com/kubernetes/kubernetes/pull/54823),[ @mtaufen](https://github.com/mtaufen))
*   Relative paths in the Kubelet's local config files (`--init-config-dir`) will now be resolved relative to the location of the containing files. ([#55648](https://github.com/kubernetes/kubernetes/pull/55648),[ @mtaufen](https://github.com/mtaufen))
*   It is now possible to set multiple manifest URL headers with the kubelet's `--manifest-url-header` flag. Multiple headers for the same key will be added in the order provided. The ManifestURLHeader field in KubeletConfiguration object (kubeletconfig/v1alpha1) is now a map[string][]string, which facilitates writing JSON and YAML files. ([#54643](https://github.com/kubernetes/kubernetes/pull/54643),[ @mtaufen](https://github.com/mtaufen))
*   The Kubelet's feature gates are now specified as a map when provided via a JSON or YAML KubeletConfiguration, rather than as a string of key-value pairs, making them less awkward for users. ([#53025](https://github.com/kubernetes/kubernetes/pull/53025),[ @mtaufen](https://github.com/mtaufen))

##### **Other**

*   Fixed a performance issue ([#51899](https://github.com/kubernetes/kubernetes/pull/51899)) identified in large-scale clusters when deleting thousands of pods simultaneously across hundreds of nodes, by actively removing containers of deleted pods, rather than waiting for periodic garbage collection and batching resulting pod API deletion requests. ([#53233](https://github.com/kubernetes/kubernetes/pull/53233),[ @dashpole](https://github.com/dashpole))
*   Problems deleting local static pods have been resolved. ([#48339](https://github.com/kubernetes/kubernetes/pull/48339),[ @dixudx](https://github.com/dixudx))
*   CRI now only calls UpdateContainerResources when cpuset is set. ([#53122](https://github.com/kubernetes/kubernetes/pull/53122),[ @resouer](https://github.com/resouer))
*   Containerd monitoring is now supported. ([#56109](https://github.com/kubernetes/kubernetes/pull/56109),[ @dashpole](https://github.com/dashpole))
*   deviceplugin has been extended to more gracefully handle the full device plugin lifecycle, including: ([#55088](https://github.com/kubernetes/kubernetes/pull/55088),[ @jiayingz](https://github.com/jiayingz))
    *   Kubelet now uses an explicit cm.GetDevicePluginResourceCapacity() function that makes it possible to more accurately determine what resources are inactive and return a more accurate view of available resources.
    *   Extends the device plugin checkpoint data to record registered resources so that we can finish resource removing devices even upon kubelet restarts.
    *   Passes sourcesReady from kubelet to the device plugin to avoid removing inactive pods during the grace period of kubelet restart.
    *   Extends the gpu_device_plugin e2e_node test to verify that scheduled pods can continue to run even after a device plugin deletion and kubelet restart.
*   The NodeController no longer supports kubelet 1.2. ([#48996](https://github.com/kubernetes/kubernetes/pull/48996),[ @k82cn](https://github.com/k82cn))
*   Kubelet now provides more specific events via FailedSync when unable to sync a pod. ([#53857](https://github.com/kubernetes/kubernetes/pull/53857),[ @derekwaynecarr](https://github.com/derekwaynecarr))
*   You can now disable AppArmor by setting the AppArmor profile to unconfined. ([#52395](https://github.com/kubernetes/kubernetes/pull/52395),[ @dixudx](https://github.com/dixudx))
*   ImageGCManage now consumes ImageFS stats from StatsProvider rather than cadvisor. ([#53094](https://github.com/kubernetes/kubernetes/pull/53094),[ @yguo0905](https://github.com/yguo0905))
*   Hyperkube now supports the support --experimental-dockershim kubelet flag. ([#54508](https://github.com/kubernetes/kubernetes/pull/54508),[ @ivan4th](https://github.com/ivan4th))
*   Kubelet no longer removes default labels from Node API objects on startup ([#54073](https://github.com/kubernetes/kubernetes/pull/54073),[ @liggitt](https://github.com/liggitt))
*   The overlay2 container disk metrics for Docker and CRI-O now work properly. ([#54827](https://github.com/kubernetes/kubernetes/pull/54827),[ @dashpole](https://github.com/dashpole))
*   Removed docker dependency during kubelet start up. ([#54405](https://github.com/kubernetes/kubernetes/pull/54405),[ @resouer](https://github.com/resouer))
*   Added Windows support to the system verification check. ([#53730](https://github.com/kubernetes/kubernetes/pull/53730),[ @bsteciuk](https://github.com/bsteciuk))
*   Kubelet no longer removes unregistered extended resource capacities from node status; cluster admins will have to manually remove extended resources exposed via device plugins when they the remove plugins themselves. ([#53353](https://github.com/kubernetes/kubernetes/pull/53353),[ @jiayingz](https://github.com/jiayingz))
*   The stats summary network value now takes into account multiple network interfaces, and not just eth0. ([#52144](https://github.com/kubernetes/kubernetes/pull/52144),[ @andyxning](https://github.com/andyxning))
*   Base images have been bumped to Debian Stretch (9). ([#52744](https://github.com/kubernetes/kubernetes/pull/52744),[ @rphillips](https://github.com/rphillips))

### **OpenStack**

*   OpenStack Cinder support has been improved:
    *   Cinder version detection now works properly. ([#53115](https://github.com/kubernetes/kubernetes/pull/53115),[ @FengyunPan](https://github.com/FengyunPan))
    *   The OpenStack cloud provider now supports Cinder v3 API. ([#52910](https://github.com/kubernetes/kubernetes/pull/52910),[ @FengyunPan](https://github.com/FengyunPan))
*   Load balancing is now more flexible:
    *   The OpenStack LBaaS v2 Provider is now [configurable](https://kubernetes.io/docs/concepts/cluster-administration/cloud-providers/#openstack). ([#54176](https://github.com/kubernetes/kubernetes/pull/54176),[ @gonzolino](https://github.com/gonzolino))
    *   OpenStack Octavia v2 is now supported as a load balancer provider in addition to the existing support for the Neutron LBaaS V2 implementation. Neutron LBaaS V1 support has been removed. ([#55393](https://github.com/kubernetes/kubernetes/pull/55393),[ @jamiehannaford](https://github.com/jamiehannaford))
*   OpenStack security group support has been beefed up  ([#50836](https://github.com/kubernetes/kubernetes/pull/50836),[ @FengyunPan](https://github.com/FengyunPan)): 
    *   Kubernetes will now automatically determine the security group for the node
    *   Nodes can now belong to multiple security groups

### **Scheduling**

#### **Hardware Accelerators**

*   Add ExtendedResourceToleration admission controller. This facilitates creation of dedicated nodes with extended resources. If operators want to create dedicated nodes with extended resources (such as GPUs, FPGAs, and so on), they are expected to taint the node with extended resource name as the key. This admission controller, if enabled, automatically adds tolerations for such taints to pods requesting extended resources, so users don't have to manually add these tolerations. ([#55839](https://github.com/kubernetes/kubernetes/pull/55839),[ @mindprince](https://github.com/mindprince))

#### **Other**

*   Scheduler cache ignores updates to an assumed pod if updates are limited to pod annotations.  ([#54008](https://github.com/kubernetes/kubernetes/pull/54008),[ @yguo0905](https://github.com/yguo0905))
*   Issues with namespace deletion have been resolved. ([#53720](https://github.com/kubernetes/kubernetes/pull/53720),[ @shyamjvs](https://github.com/shyamjvs)) ([#53793](https://github.com/kubernetes/kubernetes/pull/53793),[ @wojtek-t](https://github.com/wojtek-t))
*   Pod preemption has been improved.  
    *   Now takes PodDisruptionBudget into account. ([#56178](https://github.com/kubernetes/kubernetes/pull/56178),[ @bsalamat](https://github.com/bsalamat))
    *   Nominated pods are taken into account during scheduling to avoid starvation of higher priority pods. ([#55933](https://github.com/kubernetes/kubernetes/pull/55933),[ @bsalamat](https://github.com/bsalamat))
*   Fixed 'Schedulercache is corrupted' error in kube-scheduler ([#55262](https://github.com/kubernetes/kubernetes/pull/55262),[ @liggitt](https://github.com/liggitt))
*   The kube-scheduler command now supports a --config flag which is the location of a file containing a serialized scheduler configuration. Most other kube-scheduler flags are now deprecated. ([#52562](https://github.com/kubernetes/kubernetes/pull/52562),[ @ironcladlou](https://github.com/ironcladlou))
*   A new scheduling queue helps schedule the highest priority pending pod first. ([#55109](https://github.com/kubernetes/kubernetes/pull/55109),[ @bsalamat](https://github.com/bsalamat))
*   A Pod can now listen to the same port on multiple IP addresses.  ([#52421](https://github.com/kubernetes/kubernetes/pull/52421),[ @WIZARD-CXY](https://github.com/WIZARD-CXY))
*   Object count quotas supported on all standard resources using count/<resource>.<group> syntax ([#54320](https://github.com/kubernetes/kubernetes/pull/54320),[ @derekwaynecarr](https://github.com/derekwaynecarr))
*   Apply algorithm in scheduler by feature gates. ([#52723](https://github.com/kubernetes/kubernetes/pull/52723),[ @k82cn](https://github.com/k82cn))
*   A new priority function ResourceLimitsPriorityMap (disabled by default and behind alpha feature gate and not part of the scheduler's default priority functions list) that assigns a lowest possible score of 1 to a node that satisfies one or both of input pod's cpu and memory limits, mainly to break ties between nodes with same scores. ([#55906](https://github.com/kubernetes/kubernetes/pull/55906),[ @aveshagarwal](https://github.com/aveshagarwal))
*   Kubelet evictions now take pod priority into account ([#53542](https://github.com/kubernetes/kubernetes/pull/53542),[ @dashpole](https://github.com/dashpole))
*   PodTolerationRestriction admisson plugin: if namespace level tolerations are empty, now they override cluster level tolerations. ([#54812](https://github.com/kubernetes/kubernetes/pull/54812),[ @aveshagarwal](https://github.com/aveshagarwal))

### **Storage**

*   [stable] `PersistentVolume` and `PersistentVolumeClaim` objects must now have a capacity greater than zero.
*   [stable] Mutation of `PersistentVolumeSource` after creation is no longer allowed
*   [alpha] Deletion of `PersistentVolumeClaim` objects that are in use by a pod no longer permitted (if alpha feature is enabled).
*   [alpha] Container Storage Interface
    *   New CSIVolumeSource enables Kubernetes to use external CSI drivers to provision, attach, and mount volumes.
*   [alpha] Raw block volumes 
    *   Support for surfacing volumes as raw block devices added to Kubernetes storage system.
    *   Only Fibre Channel volume plugin supports exposes this functionality, in this release.
*   [alpha] Volume resizing
    *   Added file system resizing for the following volume plugins: GCE PD, Ceph RBD, AWS EBS, OpenStack Cinder
*   [alpha] Topology Aware Volume Scheduling 
    *   Improved volume scheduling for Local PersistentVolumes, by allowing the scheduler to make PersistentVolume binding decisions while respecting the Pod's scheduling requirements.
    *   Dynamic provisioning is not supported with this feature yet.
*   [alpha] Containerized mount utilities
    *   Allow mount utilities, used to mount volumes, to run inside a container instead of on the host.
*   Bug Fixes
    *   ScaleIO volume plugin is no longer dependent on the drv_cfg binary, so a Kubernetes cluster can easily run a containerized kubelet. ([#54956](https://github.com/kubernetes/kubernetes/pull/54956),[ @vladimirvivien](https://github.com/vladimirvivien))
    *   AWS EBS Volumes are detached from stopped AWS nodes. ([#55893](https://github.com/kubernetes/kubernetes/pull/55893),[ @gnufied](https://github.com/gnufied))
    *   AWS EBS volumes are detached if attached to a different node than expected. ([#55491](https://github.com/kubernetes/kubernetes/pull/55491),[ @gnufied](https://github.com/gnufied))
    *   PV Recycle now works in environments that use architectures other than x86. ([#53958](https://github.com/kubernetes/kubernetes/pull/53958),[ @dixudx](https://github.com/dixudx))
    *   Pod Security Policy can now manage access to specific FlexVolume drivers.([#53179](https://github.com/kubernetes/kubernetes/pull/53179),[ @wanghaoran1988](https://github.com/wanghaoran1988))
    *   To prevent unauthorized access to CHAP Secrets, you can now set the secretNamespace storage class parameters for the following volume types:
        *   ScaleIO; StoragePool and ProtectionDomain attributes no longer default to the value default.  ([#54013](https://github.com/kubernetes/kubernetes/pull/54013),[ @vladimirvivien](https://github.com/vladimirvivien))
        *   RBD Persistent Volume Sources ([#54302](https://github.com/kubernetes/kubernetes/pull/54302),[ @sbezverk](https://github.com/sbezverk))
        *   iSCSI Persistent Volume Sources ([#51530](https://github.com/kubernetes/kubernetes/pull/51530),[ @rootfs](https://github.com/rootfs))
    *   In GCE multizonal clusters, `PersistentVolume` objects will no longer be dynamically provisioned in zones without nodes. ([#52322](https://github.com/kubernetes/kubernetes/pull/52322),[ @davidz627](https://github.com/davidz627))
    *   Multi Attach PVC errors and events are now more useful and less noisy. ([#53401](https://github.com/kubernetes/kubernetes/pull/53401),[ @gnufied](https://github.com/gnufied))
    *   The compute-rw scope has been removed from GCE nodes ([#53266](https://github.com/kubernetes/kubernetes/pull/53266),[ @mikedanese](https://github.com/mikedanese))
    *   Updated vSphere cloud provider to support k8s cluster spread across multiple vCenters ([#55845](https://github.com/kubernetes/kubernetes/pull/55845),[ @rohitjogvmw](https://github.com/rohitjogvmw))
    *   vSphere: Fix disk is not getting detached when PV is provisioned on clustered datastore. ([#54438](https://github.com/kubernetes/kubernetes/pull/54438),[ @pshahzeb](https://github.com/pshahzeb))
    *   If a non-absolute mountPath is passed to the kubelet, it must now be prefixed with the appropriate root path. ([#55665](https://github.com/kubernetes/kubernetes/pull/55665),[ @brendandburns](https://github.com/brendandburns))
=======
#### **GCP**

*   The service account made available on your nodes is now configurable. ([#52868](https://github.com/kubernetes/kubernetes/pull/52868),[ @ihmccreery](https://github.com/ihmccreery))
*   GCE nodes with NVIDIA GPUs attached now expose nvidia.com/gpu as a resource instead of alpha.kubernetes.io/nvidia-gpu. ([#54826](https://github.com/kubernetes/kubernetes/pull/54826),[ @mindprince](https://github.com/mindprince))
*   Docker's live-restore on COS/ubuntu can now be disabled ([#55260](https://github.com/kubernetes/kubernetes/pull/55260),[ @yujuhong](https://github.com/yujuhong))
*   Metadata concealment is now controlled by the ENABLE_METADATA_CONCEALMENT env var. See cluster/gce/config-default.sh for more info. ([#54150](https://github.com/kubernetes/kubernetes/pull/54150),[ @ihmccreery](https://github.com/ihmccreery))
*   Masquerading rules are now added by default to GCE/GKE ([#55178](https://github.com/kubernetes/kubernetes/pull/55178),[ @dnardo](https://github.com/dnardo))
*   Fixed master startup issues with concurrent iptables invocations. ([#55945](https://github.com/kubernetes/kubernetes/pull/55945),[ @x13n](https://github.com/x13n))
*   Fixed issue deleting internal load balancers when the firewall resource may not exist. ([#53450](https://github.com/kubernetes/kubernetes/pull/53450),[ @nicksardo](https://github.com/nicksardo))

### **Instrumentation**

#### **Audit**

*   Adjust batching audit webhook default parameters: increase queue size, batch size, and initial backoff. Add throttling to the batching audit webhook. Default rate limit is 10 QPS. ([#53417](https://github.com/kubernetes/kubernetes/pull/53417),[ @crassirostris](https://github.com/crassirostris))
    *   These parameters are also now configurable. ([#56638](https://github.com/kubernetes/kubernetes/pull/56638), [@crassirostris](https://github.com/crassirostris))

#### **Other**

*   Fix a typo in prometheus-to-sd configuration, that drops some stackdriver metrics. ([#56473](https://github.com/kubernetes/kubernetes/pull/56473),[ @loburm](https://github.com/loburm))
*   [fluentd-elasticsearch addon] Elasticsearch and Kibana are updated to version 5.6.4 ([#55400](https://github.com/kubernetes/kubernetes/pull/55400),[ @mrahbar](https://github.com/mrahbar))
*   fluentd now supports CRI log format. ([#54777](https://github.com/kubernetes/kubernetes/pull/54777),[ @Random-Liu](https://github.com/Random-Liu))
*   Bring all prom-to-sd container to the same image version ([#54583](https://github.com/kubernetes/kubernetes/pull/54583))
    *   Reduce log noise produced by prometheus-to-sd, by bumping it to version 0.2.2. ([#54635](https://github.com/kubernetes/kubernetes/pull/54635),[ @loburm](https://github.com/loburm))
*   [fluentd-elasticsearch addon] Elasticsearch service name can be overridden via env variable ELASTICSEARCH_SERVICE_NAME ([#54215](https://github.com/kubernetes/kubernetes/pull/54215),[ @mrahbar](https://github.com/mrahbar))

### **Multicluster**

#### **Federation**

*   Kubefed init now supports --imagePullSecrets and --imagePullPolicy, making it possible to use private registries. ([#50740](https://github.com/kubernetes/kubernetes/pull/50740),[ @dixudx](https://github.com/dixudx))
*   Updated cluster printer to enable --show-labels ([#53771](https://github.com/kubernetes/kubernetes/pull/53771),[ @dixudx](https://github.com/dixudx))
*   Kubefed init now supports --nodeSelector, enabling you to determine on what node the controller will be installed. ([#50749](https://github.com/kubernetes/kubernetes/pull/50749),[ @dixudx](https://github.com/dixudx))

### **Network**

#### **IPv6**

*   [alpha] IPv6 support has been added. Notable IPv6 support details include:
    *   Support for IPv6-only Kubernetes cluster deployments. **<span style="text-decoration:underline;">Note:</span>** This feature does not provide dual-stack support.
    *   Support for IPv6 Kubernetes control and data planes.
    *   Support for Kubernetes IPv6 cluster deployments using kubeadm.
    *   Support for the iptables kube-proxy backend using ip6tables.
    *   Relies on CNI 0.6.0 binaries for IPv6 pod networking.
    *   Adds IPv6 support for kube-dns using SRV records.
    *   Caveats
        *   Only the CNI bridge and local-ipam plugins have been tested for the alpha release, although other CNI plugins do support IPv6.
        *   HostPorts are not supported.
*   An IPv6 network mask for pod or cluster cidr network must be /66 or longer. For example: 2001:db1::/66, 2001:dead:beef::/76, 2001:cafe::/118 are supported. 2001:db1::/64 is not supported
*   For details, see [the complete list of merged pull requests for IPv6 support](https://github.com/kubernetes/kubernetes/pulls?utf8=%E2%9C%93&q=is%3Apr+is%3Amerged+label%3Aarea%2Fipv6).

#### **IPVS**

*   You can now use the --cleanup-ipvs flag to tell kube-proxy whether to flush all existing ipvs rules in on startup ([#56036](https://github.com/kubernetes/kubernetes/pull/56036),[ @m1093782566](https://github.com/m1093782566))
*   Graduate kube-proxy IPVS mode to beta. ([#56623](https://github.com/kubernetes/kubernetes/pull/56623), [@m1093782566](https://github.com/m1093782566))

#### **Kube-Proxy**

*   Added iptables rules to allow Pod traffic even when default iptables policy is to reject. ([#52569](https://github.com/kubernetes/kubernetes/pull/52569),[ @tmjd](https://github.com/tmjd))
*   You can once again use 0 values for conntrack min, max, max per core, tcp close wait timeout, and tcp established timeout; this functionality was broken in 1.8. ([#55261](https://github.com/kubernetes/kubernetes/pull/55261),[ @ncdc](https://github.com/ncdc))

#### **CoreDNS**

*   You now have the option to use CoreDNS instead of KubeDNS. To install CoreDNS instead of kube-dns, set CLUSTER_DNS_CORE_DNS to 'true'. This support is experimental. ([#52501](https://github.com/kubernetes/kubernetes/pull/52501),[ @rajansandeep](https://github.com/rajansandeep)) ([#55728](https://github.com/kubernetes/kubernetes/pull/55728),[ @rajansandeep](https://github.com/rajansandeep))

#### **Other**

*   Pod addresses will now be removed from the list of endpoints when the pod is in graceful termination. ([#54828](https://github.com/kubernetes/kubernetes/pull/54828),[ @freehan](https://github.com/freehan))
*   You can now use a new supported service annotation for AWS clusters, `service.beta.kubernetes.io/aws-load-balancer-ssl-negotiation-policy`, which lets you specify which [predefined AWS SSL policy](http://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-security-policy-table.html) you would like to use. ([#54507](https://github.com/kubernetes/kubernetes/pull/54507),[ @micahhausler](https://github.com/micahhausler))
*   Termination grace period for the calico/node add-on DaemonSet has been eliminated, reducing downtime during a rolling upgrade or deletion. ([#55015](https://github.com/kubernetes/kubernetes/pull/55015),[ @fasaxc](https://github.com/fasaxc))
*   Fixed bad conversion in host port chain name generating func which led to some unreachable host ports. ([#55153](https://github.com/kubernetes/kubernetes/pull/55153),[ @chenchun](https://github.com/chenchun))
*   Fixed IPVS availability check ([#51874](https://github.com/kubernetes/kubernetes/pull/51874),[ @vfreex](https://github.com/vfreex))
*   The output for kubectl describe networkpolicy * has been enhanced to be more useful. ([#46951](https://github.com/kubernetes/kubernetes/pull/46951),[ @aanm](https://github.com/aanm))
*   Kernel modules are now loaded automatically inside a kube-proxy pod ([#52003](https://github.com/kubernetes/kubernetes/pull/52003),[ @vfreex](https://github.com/vfreex))
*   Improve resilience by annotating kube-dns addon with podAntiAffinity to prefer scheduling on different nodes. ([#52193](https://github.com/kubernetes/kubernetes/pull/52193),[ @StevenACoffman](https://github.com/StevenACoffman))
*   [alpha] Added DNSConfig field to PodSpec. "None" mode for DNSPolicy is now supported. ([#55848](https://github.com/kubernetes/kubernetes/pull/55848),[ @MrHohn](https://github.com/MrHohn))
*   You can now add "options" to the host's /etc/resolv.conf (or --resolv-conf), and they will be copied into pod's resolv.conf when dnsPolicy is Default. Being able to customize options is important because it is common to leverage options to fine-tune the behavior of DNS client. ([#54773](https://github.com/kubernetes/kubernetes/pull/54773),[ @phsiao](https://github.com/phsiao))
*   Fixed a bug so that the service controller no longer retries if doNotRetry service update fails. ([#54184](https://github.com/kubernetes/kubernetes/pull/54184),[ @MrHohn](https://github.com/MrHohn))
*   Added --no-negcache flag to kube-dns to prevent caching of NXDOMAIN responses. ([#53604](https://github.com/kubernetes/kubernetes/pull/53604),[ @cblecker](https://github.com/cblecker))

### **Node**

#### **Pod API**

*   A single value in metadata.annotations/metadata.labels can now be passed into the containers via the Downward API. ([#55902](https://github.com/kubernetes/kubernetes/pull/55902),[ @yguo0905](https://github.com/yguo0905))
*   Pods will no longer briefly transition to a "Pending" state during the deletion process. ([#54593](https://github.com/kubernetes/kubernetes/pull/54593),[ @dashpole](https://github.com/dashpole))
*   Added pod-level local ephemeral storage metric to the Summary API. Pod-level ephemeral storage reports the total filesystem usage for the containers and emptyDir volumes in the measured Pod. ([#55447](https://github.com/kubernetes/kubernetes/pull/55447),[ @jingxu97](https://github.com/jingxu97))

#### **Hardware Accelerators**

*   Kubelet now exposes metrics for NVIDIA GPUs attached to the containers. ([#55188](https://github.com/kubernetes/kubernetes/pull/55188),[ @mindprince](https://github.com/mindprince))
*   The device plugin Alpha API no longer supports returning artifacts per device as part of AllocateResponse. ([#53031](https://github.com/kubernetes/kubernetes/pull/53031),[ @vishh](https://github.com/vishh))
*   Fix to ignore extended resources that are not registered with kubelet during container resource allocation. ([#53547](https://github.com/kubernetes/kubernetes/pull/53547),[ @jiayingz](https://github.com/jiayingz))


#### **Container Runtime**
*   [alpha] [cri-tools](https://github.com/kubernetes-incubator/cri-tools): CLI and validation tools for CRI is now v1.0.0-alpha.0. This release mainly focuses on UX improvements. [[@feiskyer](https://github.com/feiskyer)]
    *   Make crictl command more user friendly and add more subcommands.
    *   Integrate with CRI verbose option to provide extra debug information.
    *   Update CRI to kubernetes v1.9.
    *   Bug fixes in validation test suites.
*   [beta] [cri-containerd](https://github.com/kubernetes-incubator/cri-containerd): CRI implementation for containerd is now v1.0.0-beta.0, [[@Random-Liu](https://github.com/Random-Liu)]
    *   This release supports Kubernetes 1.9+ and containerd v1.0.0+.
    *   Pass all Kubernetes 1.9 e2e test, node e2e test and CRI validation tests.
    *   [Kube-up.sh integration](https://github.com/kubernetes-incubator/cri-containerd/blob/master/docs/kube-up.md).
    *   [Full crictl integration including CRI verbose option.](https://github.com/kubernetes-incubator/cri-containerd/blob/master/docs/crictl.md)
    *   Integration with cadvisor to provide better summary api support.
*   [stable] [cri-o](https://github.com/kubernetes-incubator/cri-o): CRI implementation for OCI-based runtimes is now v1.9. [[@mrunalp](https://github.com/mrunalp)]
    *   Pass all the Kubernetes 1.9 end-to-end test suites and now gating PRs as well
    *   Pass all the CRI validation tests
    *   Release has been focused on bug fixes, stability and performance with runc and Clear Containers
    *   Minikube integration
*   [stable] [frakti](https://github.com/kubernetes/frakti): CRI implementation for hypervisor-based runtimes is now v1.9. [[@resouer](https://github.com/resouer)]
    *   Added ARM64 release. Upgraded to CNI 0.6.0, added block device as Pod volume mode. Fixed CNI plugin compatibility.
    *   Passed all CRI validation conformance tests and node end-to-end conformance tests.
*   [alpha] [rktlet](https://github.com/kubernetes-incubator/rktlet): CRI implementation for the rkt runtime is now v0.1.0. [[@iaguis](https://github.com/iaguis)]
    *   This is the first release of rktlet and it implements support for the CRI including fetching images, running pods, CNI networking, logging and exec.
This release passes 129/145 Kubernetes e2e conformance tests.
*   Container Runtime Interface API change. [[@yujuhong](https://github.com/yujuhong)]
    *   A new field is added to CRI container log format to support splitting a long log line into multiple lines. ([#55922](https://github.com/kubernetes/kubernetes/pull/55922), [@Random-Liu](https://github.com/Random-Liu))
    *   CRI now supports debugging via a verbose option for status functions. ([#53965](https://github.com/kubernetes/kubernetes/pull/53965), [@Random-Liu](https://github.com/Random-Liu))
    *   Kubelet can now provide full summary api support for the CRI container runtime, with the exception of container log stats. ([#55810](https://github.com/kubernetes/kubernetes/pull/55810), [@abhi](https://github.com/abhi))
    *   CRI now uses the correct localhost seccomp path when provided with input in the format of localhost//profileRoot/profileName. ([#55450](https://github.com/kubernetes/kubernetes/pull/55450), [@feiskyer](https://github.com/feiskyer))


#### **Kubelet**

*   The EvictionHard, EvictionSoft, EvictionSoftGracePeriod, EvictionMinimumReclaim, SystemReserved, and KubeReserved fields in the KubeletConfiguration object (`kubeletconfig/v1alpha1`) are now of type map[string]string, which facilitates writing JSON and YAML files. ([#54823](https://github.com/kubernetes/kubernetes/pull/54823),[ @mtaufen](https://github.com/mtaufen))
*   Relative paths in the Kubelet's local config files (`--init-config-dir`) will now be resolved relative to the location of the containing files. ([#55648](https://github.com/kubernetes/kubernetes/pull/55648),[ @mtaufen](https://github.com/mtaufen))
*   It is now possible to set multiple manifest URL headers with the kubelet's `--manifest-url-header` flag. Multiple headers for the same key will be added in the order provided. The ManifestURLHeader field in KubeletConfiguration object (kubeletconfig/v1alpha1) is now a map[string][]string, which facilitates writing JSON and YAML files. ([#54643](https://github.com/kubernetes/kubernetes/pull/54643),[ @mtaufen](https://github.com/mtaufen))
*   The Kubelet's feature gates are now specified as a map when provided via a JSON or YAML KubeletConfiguration, rather than as a string of key-value pairs, making them less awkward for users. ([#53025](https://github.com/kubernetes/kubernetes/pull/53025),[ @mtaufen](https://github.com/mtaufen))

##### **Other**

*   Fixed a performance issue ([#51899](https://github.com/kubernetes/kubernetes/pull/51899)) identified in large-scale clusters when deleting thousands of pods simultaneously across hundreds of nodes, by actively removing containers of deleted pods, rather than waiting for periodic garbage collection and batching resulting pod API deletion requests. ([#53233](https://github.com/kubernetes/kubernetes/pull/53233),[ @dashpole](https://github.com/dashpole))
*   Problems deleting local static pods have been resolved. ([#48339](https://github.com/kubernetes/kubernetes/pull/48339),[ @dixudx](https://github.com/dixudx))
*   CRI now only calls UpdateContainerResources when cpuset is set. ([#53122](https://github.com/kubernetes/kubernetes/pull/53122),[ @resouer](https://github.com/resouer))
*   Containerd monitoring is now supported. ([#56109](https://github.com/kubernetes/kubernetes/pull/56109),[ @dashpole](https://github.com/dashpole))
*   deviceplugin has been extended to more gracefully handle the full device plugin lifecycle, including: ([#55088](https://github.com/kubernetes/kubernetes/pull/55088),[ @jiayingz](https://github.com/jiayingz))
    *   Kubelet now uses an explicit cm.GetDevicePluginResourceCapacity() function that makes it possible to more accurately determine what resources are inactive and return a more accurate view of available resources.
    *   Extends the device plugin checkpoint data to record registered resources so that we can finish resource removing devices even upon kubelet restarts.
    *   Passes sourcesReady from kubelet to the device plugin to avoid removing inactive pods during the grace period of kubelet restart.
    *   Extends the gpu_device_plugin e2e_node test to verify that scheduled pods can continue to run even after a device plugin deletion and kubelet restart.
*   The NodeController no longer supports kubelet 1.2. ([#48996](https://github.com/kubernetes/kubernetes/pull/48996),[ @k82cn](https://github.com/k82cn))
*   Kubelet now provides more specific events via FailedSync when unable to sync a pod. ([#53857](https://github.com/kubernetes/kubernetes/pull/53857),[ @derekwaynecarr](https://github.com/derekwaynecarr))
*   You can now disable AppArmor by setting the AppArmor profile to unconfined. ([#52395](https://github.com/kubernetes/kubernetes/pull/52395),[ @dixudx](https://github.com/dixudx))
*   ImageGCManage now consumes ImageFS stats from StatsProvider rather than cadvisor. ([#53094](https://github.com/kubernetes/kubernetes/pull/53094),[ @yguo0905](https://github.com/yguo0905))
*   Hyperkube now supports the support --experimental-dockershim kubelet flag. ([#54508](https://github.com/kubernetes/kubernetes/pull/54508),[ @ivan4th](https://github.com/ivan4th))
*   Kubelet no longer removes default labels from Node API objects on startup ([#54073](https://github.com/kubernetes/kubernetes/pull/54073),[ @liggitt](https://github.com/liggitt))
*   The overlay2 container disk metrics for Docker and CRI-O now work properly. ([#54827](https://github.com/kubernetes/kubernetes/pull/54827),[ @dashpole](https://github.com/dashpole))
*   Removed docker dependency during kubelet start up. ([#54405](https://github.com/kubernetes/kubernetes/pull/54405),[ @resouer](https://github.com/resouer))
*   Added Windows support to the system verification check. ([#53730](https://github.com/kubernetes/kubernetes/pull/53730),[ @bsteciuk](https://github.com/bsteciuk))
*   Kubelet no longer removes unregistered extended resource capacities from node status; cluster admins will have to manually remove extended resources exposed via device plugins when they the remove plugins themselves. ([#53353](https://github.com/kubernetes/kubernetes/pull/53353),[ @jiayingz](https://github.com/jiayingz))
*   The stats summary network value now takes into account multiple network interfaces, and not just eth0. ([#52144](https://github.com/kubernetes/kubernetes/pull/52144),[ @andyxning](https://github.com/andyxning))
*   Base images have been bumped to Debian Stretch (9). ([#52744](https://github.com/kubernetes/kubernetes/pull/52744),[ @rphillips](https://github.com/rphillips))

### **OpenStack**

*   OpenStack Cinder support has been improved:
    *   Cinder version detection now works properly. ([#53115](https://github.com/kubernetes/kubernetes/pull/53115),[ @FengyunPan](https://github.com/FengyunPan))
    *   The OpenStack cloud provider now supports Cinder v3 API. ([#52910](https://github.com/kubernetes/kubernetes/pull/52910),[ @FengyunPan](https://github.com/FengyunPan))
*   Load balancing is now more flexible:
    *   The OpenStack LBaaS v2 Provider is now [configurable](https://kubernetes.io/docs/concepts/cluster-administration/cloud-providers/#openstack). ([#54176](https://github.com/kubernetes/kubernetes/pull/54176),[ @gonzolino](https://github.com/gonzolino))
    *   OpenStack Octavia v2 is now supported as a load balancer provider in addition to the existing support for the Neutron LBaaS V2 implementation. Neutron LBaaS V1 support has been removed. ([#55393](https://github.com/kubernetes/kubernetes/pull/55393),[ @jamiehannaford](https://github.com/jamiehannaford))
*   OpenStack security group support has been beefed up  ([#50836](https://github.com/kubernetes/kubernetes/pull/50836),[ @FengyunPan](https://github.com/FengyunPan)): 
    *   Kubernetes will now automatically determine the security group for the node
    *   Nodes can now belong to multiple security groups

### **Scheduling**

#### **Hardware Accelerators**

*   Add ExtendedResourceToleration admission controller. This facilitates creation of dedicated nodes with extended resources. If operators want to create dedicated nodes with extended resources (such as GPUs, FPGAs, and so on), they are expected to taint the node with extended resource name as the key. This admission controller, if enabled, automatically adds tolerations for such taints to pods requesting extended resources, so users don't have to manually add these tolerations. ([#55839](https://github.com/kubernetes/kubernetes/pull/55839),[ @mindprince](https://github.com/mindprince))

#### **Other**

*   Scheduler cache ignores updates to an assumed pod if updates are limited to pod annotations.  ([#54008](https://github.com/kubernetes/kubernetes/pull/54008),[ @yguo0905](https://github.com/yguo0905))
*   Issues with namespace deletion have been resolved. ([#53720](https://github.com/kubernetes/kubernetes/pull/53720),[ @shyamjvs](https://github.com/shyamjvs)) ([#53793](https://github.com/kubernetes/kubernetes/pull/53793),[ @wojtek-t](https://github.com/wojtek-t))
*   Pod preemption has been improved.  
    *   Now takes PodDisruptionBudget into account. ([#56178](https://github.com/kubernetes/kubernetes/pull/56178),[ @bsalamat](https://github.com/bsalamat))
    *   Nominated pods are taken into account during scheduling to avoid starvation of higher priority pods. ([#55933](https://github.com/kubernetes/kubernetes/pull/55933),[ @bsalamat](https://github.com/bsalamat))
*   Fixed 'Schedulercache is corrupted' error in kube-scheduler ([#55262](https://github.com/kubernetes/kubernetes/pull/55262),[ @liggitt](https://github.com/liggitt))
*   The kube-scheduler command now supports a --config flag which is the location of a file containing a serialized scheduler configuration. Most other kube-scheduler flags are now deprecated. ([#52562](https://github.com/kubernetes/kubernetes/pull/52562),[ @ironcladlou](https://github.com/ironcladlou))
*   A new scheduling queue helps schedule the highest priority pending pod first. ([#55109](https://github.com/kubernetes/kubernetes/pull/55109),[ @bsalamat](https://github.com/bsalamat))
*   A Pod can now listen to the same port on multiple IP addresses.  ([#52421](https://github.com/kubernetes/kubernetes/pull/52421),[ @WIZARD-CXY](https://github.com/WIZARD-CXY))
*   Object count quotas supported on all standard resources using count/<resource>.<group> syntax ([#54320](https://github.com/kubernetes/kubernetes/pull/54320),[ @derekwaynecarr](https://github.com/derekwaynecarr))
*   Apply algorithm in scheduler by feature gates. ([#52723](https://github.com/kubernetes/kubernetes/pull/52723),[ @k82cn](https://github.com/k82cn))
*   A new priority function ResourceLimitsPriorityMap (disabled by default and behind alpha feature gate and not part of the scheduler's default priority functions list) that assigns a lowest possible score of 1 to a node that satisfies one or both of input pod's cpu and memory limits, mainly to break ties between nodes with same scores. ([#55906](https://github.com/kubernetes/kubernetes/pull/55906),[ @aveshagarwal](https://github.com/aveshagarwal))
*   Kubelet evictions now take pod priority into account ([#53542](https://github.com/kubernetes/kubernetes/pull/53542),[ @dashpole](https://github.com/dashpole))
*   PodTolerationRestriction admission plugin: if namespace level tolerations are empty, now they override cluster level tolerations. ([#54812](https://github.com/kubernetes/kubernetes/pull/54812),[ @aveshagarwal](https://github.com/aveshagarwal))

### **Storage**

*   [stable] `PersistentVolume` and `PersistentVolumeClaim` objects must now have a capacity greater than zero.
*   [stable] Mutation of `PersistentVolumeSource` after creation is no longer allowed
*   [alpha] Deletion of `PersistentVolumeClaim` objects that are in use by a pod no longer permitted (if alpha feature is enabled).
*   [alpha] Container Storage Interface
    *   New CSIVolumeSource enables Kubernetes to use external CSI drivers to provision, attach, and mount volumes.
*   [alpha] Raw block volumes 
    *   Support for surfacing volumes as raw block devices added to Kubernetes storage system.
    *   Only Fibre Channel volume plugin supports exposes this functionality, in this release.
*   [alpha] Volume resizing
    *   Added file system resizing for the following volume plugins: GCE PD, Ceph RBD, AWS EBS, OpenStack Cinder
*   [alpha] Topology Aware Volume Scheduling 
    *   Improved volume scheduling for Local PersistentVolumes, by allowing the scheduler to make PersistentVolume binding decisions while respecting the Pod's scheduling requirements.
    *   Dynamic provisioning is not supported with this feature yet.
*   [alpha] Containerized mount utilities
    *   Allow mount utilities, used to mount volumes, to run inside a container instead of on the host.
*   Bug Fixes
    *   ScaleIO volume plugin is no longer dependent on the drv_cfg binary, so a Kubernetes cluster can easily run a containerized kubelet. ([#54956](https://github.com/kubernetes/kubernetes/pull/54956),[ @vladimirvivien](https://github.com/vladimirvivien))
    *   AWS EBS Volumes are detached from stopped AWS nodes. ([#55893](https://github.com/kubernetes/kubernetes/pull/55893),[ @gnufied](https://github.com/gnufied))
    *   AWS EBS volumes are detached if attached to a different node than expected. ([#55491](https://github.com/kubernetes/kubernetes/pull/55491),[ @gnufied](https://github.com/gnufied))
    *   PV Recycle now works in environments that use architectures other than x86. ([#53958](https://github.com/kubernetes/kubernetes/pull/53958),[ @dixudx](https://github.com/dixudx))
    *   Pod Security Policy can now manage access to specific FlexVolume drivers.([#53179](https://github.com/kubernetes/kubernetes/pull/53179),[ @wanghaoran1988](https://github.com/wanghaoran1988))
    *   To prevent unauthorized access to CHAP Secrets, you can now set the secretNamespace storage class parameters for the following volume types:
        *   ScaleIO; StoragePool and ProtectionDomain attributes no longer default to the value default.  ([#54013](https://github.com/kubernetes/kubernetes/pull/54013),[ @vladimirvivien](https://github.com/vladimirvivien))
        *   RBD Persistent Volume Sources ([#54302](https://github.com/kubernetes/kubernetes/pull/54302),[ @sbezverk](https://github.com/sbezverk))
        *   iSCSI Persistent Volume Sources ([#51530](https://github.com/kubernetes/kubernetes/pull/51530),[ @rootfs](https://github.com/rootfs))
    *   In GCE multizonal clusters, `PersistentVolume` objects will no longer be dynamically provisioned in zones without nodes. ([#52322](https://github.com/kubernetes/kubernetes/pull/52322),[ @davidz627](https://github.com/davidz627))
    *   Multi Attach PVC errors and events are now more useful and less noisy. ([#53401](https://github.com/kubernetes/kubernetes/pull/53401),[ @gnufied](https://github.com/gnufied))
    *   The compute-rw scope has been removed from GCE nodes ([#53266](https://github.com/kubernetes/kubernetes/pull/53266),[ @mikedanese](https://github.com/mikedanese))
    *   Updated vSphere cloud provider to support k8s cluster spread across multiple vCenters ([#55845](https://github.com/kubernetes/kubernetes/pull/55845),[ @rohitjogvmw](https://github.com/rohitjogvmw))
    *   vSphere: Fix disk is not getting detached when PV is provisioned on clustered datastore. ([#54438](https://github.com/kubernetes/kubernetes/pull/54438),[ @pshahzeb](https://github.com/pshahzeb))
    *   If a non-absolute mountPath is passed to the kubelet, it must now be prefixed with the appropriate root path. ([#55665](https://github.com/kubernetes/kubernetes/pull/55665),[ @brendandburns](https://github.com/brendandburns))
>>>>>>> merge master to 1.10, with fixes (#7682)

## External Dependencies
* The supported etcd server version is 3.1.12, as compared to 3.0.17 in v1.9 ([#60988](https://github.com/kubernetes/kubernetes/pull/60988))
* The validated docker versions are the same as for v1.9: 1.11.2 to 1.13.1 and 17.03.x ([ref](https://github.com/kubernetes/kubernetes/blob/master/test/e2e_node/system/docker_validator_test.go))
* The Go version is go1.9.3, as compared to go1.9.2 in v1.9. ([#59012](https://github.com/kubernetes/kubernetes/pull/59012))
* The minimum supported go is the same as for v1.9: go1.9.1. ([#55301](https://github.com/kubernetes/kubernetes/pull/55301))
* CNI is the same as v1.9: v0.6.0 ([#51250](https://github.com/kubernetes/kubernetes/pull/51250))
* CSI is updated to 0.2.0 as compared to 0.1.0 in v1.9. ([#60736](https://github.com/kubernetes/kubernetes/pull/60736))
* The dashboard add-on has been updated to v1.8.3, as compared to 1.8.0 in v1.9. ([#517326](https://github.com/kubernetes/kubernetes/pull/57326))
* Heapster has is the same as v1.9: v1.5.0. It will be upgraded in v1.11. ([ref](https://github.com/kubernetes/kubernetes/blob/master/cluster/addons/cluster-monitoring/google/heapster-controller.yaml))
* Cluster Autoscaler has been updated to v1.2.0. ([#60842](https://github.com/kubernetes/kubernetes/pull/60842), [@mwielgus](https://github.com/mwielgus))
* Updates kube-dns to v1.14.8 ([#57918](https://github.com/kubernetes/kubernetes/pull/57918), [@rramkumar1](https://github.com/rramkumar1))
* Influxdb is unchanged from v1.9: v1.3.3 ([#53319](https://github.com/kubernetes/kubernetes/pull/53319))
* Grafana is unchanged from v1.9: v4.4.3 ([#53319](https://github.com/kubernetes/kubernetes/pull/53319))
* CAdvisor is v0.29.1 ([#60867](https://github.com/kubernetes/kubernetes/pull/60867)) 
* fluentd-gcp-scaler is v0.3.0 ([#61269](https://github.com/kubernetes/kubernetes/pull/61269)) 
* Updated fluentd in fluentd-es-image to fluentd v1.1.0 ([#58525](https://github.com/kubernetes/kubernetes/pull/58525), [@monotek](https://github.com/monotek))
* fluentd-elasticsearch is v2.0.4 ([#58525](https://github.com/kubernetes/kubernetes/pull/58525)) 
* Updated fluentd-gcp to v3.0.0. ([#60722](https://github.com/kubernetes/kubernetes/pull/60722))
* Ingress glbc is v1.0.0 ([#61302](https://github.com/kubernetes/kubernetes/pull/61302)) 
* OIDC authentication is coreos/go-oidc v2 ([#58544](https://github.com/kubernetes/kubernetes/pull/58544)) 
* Updated fluentd-gcp updated to v2.0.11. ([#56927](https://github.com/kubernetes/kubernetes/pull/56927), [@x13n](https://github.com/x13n))
* Calico has been updated to v2.6.7 ([#59130](https://github.com/kubernetes/kubernetes/pull/59130), [@caseydavenport](https://github.com/caseydavenport))

# v1.10.0-rc.1

[Documentation](https://docs.k8s.io) & [Examples](https://releases.k8s.io/release-1.10/examples)

## Downloads for v1.10.0-rc.1


filename | sha256 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.10.0-rc.1/kubernetes.tar.gz) | `d7409a0bf36558b8328eefc01959920641f1fb2630fe3ac19b266fcea05a1646`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.10.0-rc.1/kubernetes-src.tar.gz) | `4384bfe4151850e5d169b125c0cba51b7c2f00aa9972a6b4c22c44af74e8e3f8`

### Client Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.10.0-rc.1/kubernetes-client-darwin-386.tar.gz) | `1eb98b5d527ee9ed375f06df96c1158b9879880eb12d68a81e823d7a92e3866d`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.10.0-rc.1/kubernetes-client-darwin-amd64.tar.gz) | `be7e35e9698b84ace37e0ed54640c3958c0d9eea8bd413eb8b604ec02922321a`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.10.0-rc.1/kubernetes-client-linux-386.tar.gz) | `825a80abdb1171e72c1660fb7854ed6e8290cb7cb54ebb88c3570b3f95e77a02`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-rc.1/kubernetes-client-linux-amd64.tar.gz) | `97e22907c3f0780818b7124c50451ae78e930cd99ec8f96f188cdd080547e21b`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-rc.1/kubernetes-client-linux-arm64.tar.gz) | `d27674c7daec425f0fa72ca14695e7f13c81cfd08517ceb1f5ce1bb052b5b9b2`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-rc.1/kubernetes-client-linux-arm.tar.gz) | `e54f1fc7cf95981f54d68108ad0113396357ff0c7baaf6a76a635f0de21fb944`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-rc.1/kubernetes-client-linux-ppc64le.tar.gz) | `7535a6668e6ca6888b22615439fae8c68d37d62f572b284755db87600050a6c6`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-rc.1/kubernetes-client-linux-s390x.tar.gz) | `6a9f90e2ea5cb50b2691c45d327cca444ae9bfc41cba43ca22016679da940a71`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.10.0-rc.1/kubernetes-client-windows-386.tar.gz) | `cc5fef5e054588ad41870a379662d8429bd0f09500bcf4a67648bf6593d18aaf`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0-rc.1/kubernetes-client-windows-amd64.tar.gz) | `a06033004c5cecc43494d95dd5d5e75f698cf8e4d358c229c5fef222c131b077`

### Server Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-rc.1/kubernetes-server-linux-amd64.tar.gz) | `e844897e9a39ca14a449e077cb4e4f2dc6c7d5326b95a1e47bef3b6f9c6057f7`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-rc.1/kubernetes-server-linux-arm64.tar.gz) | `c15476626cd750a8f59c30c3389ada482995aea66b510c43732035d33e87e774`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-rc.1/kubernetes-server-linux-arm.tar.gz) | `74a1ff7478d7ca5c4ccb2fb772ef13745a20cfb512e3e66f238abb98122cc4eb`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-rc.1/kubernetes-server-linux-ppc64le.tar.gz) | `3b004717fe811352c15fe71f3122d2eaac7e0d1c4ff07d8810894c877b409c0f`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-rc.1/kubernetes-server-linux-s390x.tar.gz) | `b6ff40f13355b47e2c02c6c016ac334a3f5008769ed7b4377c617c2fc9e30b7a`

### Node Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-rc.1/kubernetes-node-linux-amd64.tar.gz) | `a3a3e27c2b77fa46b7c9ff3b8bfdc672c2657e47fc4b1ca3d76cdc102ca27630`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-rc.1/kubernetes-node-linux-arm64.tar.gz) | `af172c9d71ba2d15e14354159ac34ca7fe112b7d2d2ba38325c467950aa04755`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-rc.1/kubernetes-node-linux-arm.tar.gz) | `fb904aa009c3309e92505ceff15863f83d9317af15cbf729bcbd198f5be3379f`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-rc.1/kubernetes-node-linux-ppc64le.tar.gz) | `659f0091578e42b111417d45f708be2ac60447512e485dab7d2f4abaeee36f49`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-rc.1/kubernetes-node-linux-s390x.tar.gz) | `ce40dcc55ca299401ddf146b2622dd7f19532e95620bae63aea58a45a8020875`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0-rc.1/kubernetes-node-windows-amd64.tar.gz) | `0f8b5c551f58cdf298d41258483311cef66fe1b41093152a43120514a493b23d`

## Changelog since v1.10.0-beta.4

### Other notable changes

* Updates kubeadm default to use 1.10 ([#61127](https://github.com/kubernetes/kubernetes/pull/61127), [@timothysc](https://github.com/timothysc))
* Bump ingress-gce image in glbc.manifest to 1.0.0 ([#61302](https://github.com/kubernetes/kubernetes/pull/61302), [@rramkumar1](https://github.com/rramkumar1))
* Fix regression where kubelet --cpu-cfs-quota flag did not work when --cgroups-per-qos was enabled ([#61294](https://github.com/kubernetes/kubernetes/pull/61294), [@derekwaynecarr](https://github.com/derekwaynecarr))
* Fix bug allowing garbage collector to enter a broken state that could only be fixed by restarting the controller-manager. ([#61201](https://github.com/kubernetes/kubernetes/pull/61201), [@jennybuckley](https://github.com/jennybuckley))
* When `TaintNodesByCondition` enabled, added `node.kubernetes.io/unschedulable:NoSchedule` ([#61161](https://github.com/kubernetes/kubernetes/pull/61161), [@k82cn](https://github.com/k82cn))
    *  taint to the node if `spec.Unschedulable` is true.
    * When `ScheduleDaemonSetPods` enabled, `node.kubernetes.io/unschedulable:NoSchedule` 
    * toleration is added automatically to DaemonSet Pods; so the `unschedulable` field of 
    * a node is not respected by the DaemonSet controller.
* Fixed kube-proxy to work correctly with iptables 1.6.2 and later. ([#60978](https://github.com/kubernetes/kubernetes/pull/60978), [@danwinship](https://github.com/danwinship))
* Audit logging with buffering enabled can increase apiserver memory usage (e.g. up to 200MB in 100-node cluster). The increase is bounded by the buffer size (configurable). Ref: issue [#60500](https://github.com/kubernetes/kubernetes/pull/60500) ([#61118](https://github.com/kubernetes/kubernetes/pull/61118), [@shyamjvs](https://github.com/shyamjvs))
* Fix a bug in scheduler cache by using Pod UID as the cache key instead of namespace/name ([#61069](https://github.com/kubernetes/kubernetes/pull/61069), [@anfernee](https://github.com/anfernee))



# v1.10.0-beta.4

[Documentation](https://docs.k8s.io) & [Examples](https://releases.k8s.io/release-1.10/examples)

## Downloads for v1.10.0-beta.4


filename | sha256 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.10.0-beta.4/kubernetes.tar.gz) | `69132f3edcf549c686055903e8ef007f0c92ec05a8ec1e3fea4d5b4dc4685580`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.10.0-beta.4/kubernetes-src.tar.gz) | `60ba32e493c0a1449cdbd615d709e9d46780c91c88255e8e9f468c5e4e124576`

### Client Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.10.0-beta.4/kubernetes-client-darwin-386.tar.gz) | `80ef567c51aa705511ca20fbfcad2e85f1dc4fb750c0f58e0d82f4166359273f`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.4/kubernetes-client-darwin-amd64.tar.gz) | `925830f3c6c135adec206012ae94807b58b9438008ae87881e7a9d648ab993ec`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.10.0-beta.4/kubernetes-client-linux-386.tar.gz) | `9e4f40325a27b79f16eb3254c6283d67e2fecd313535b300f9931800e4c495a4`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.4/kubernetes-client-linux-amd64.tar.gz) | `85ee9bfa519e49283ab711c73f52809f8fc43616cc2076dc060987e6f262ff95`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-beta.4/kubernetes-client-linux-arm.tar.gz) | `f0123581243a278052413e862208a797e78e7689c6dba0da08ab3200feedd66c`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-beta.4/kubernetes-client-linux-arm64.tar.gz) | `dd19b034e1798f5bb0b1c6230ef294ca8f3ef7944837c5d49dce4659bb284b8e`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-beta.4/kubernetes-client-linux-ppc64le.tar.gz) | `84a46003fe0140f8ecec03befceed7a4d955f9f88abdced99ecee24bc675b113`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-beta.4/kubernetes-client-linux-s390x.tar.gz) | `c4ee2bf9f7ea66ab41b350220920644bee3eeceb13cfd19873843a9ab43b372d`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.10.0-beta.4/kubernetes-client-windows-386.tar.gz) | `917e768179e82a33232281b9b6e555cee75cf6315bd3c60a1fce4717fbd0e538`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.4/kubernetes-client-windows-amd64.tar.gz) | `915f3cc888332b360701a4b20d1af384ec5388636f2c3e3868e36124ce8a96a8`

### Server Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.4/kubernetes-server-linux-amd64.tar.gz) | `01b50da6bae8abe4e2c813381c3848ff615fc1d8164d11b163ac0819554ad7b4`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-beta.4/kubernetes-server-linux-arm.tar.gz) | `0a1ebd399759a68972e6248b09ce46a76deef931e51c807e032fefc4210e3dde`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-beta.4/kubernetes-server-linux-arm64.tar.gz) | `b8298a06aed6cd1c624855fb4e2d7258e8f9201fbc5bfebc8190c24273e95d9b`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-beta.4/kubernetes-server-linux-ppc64le.tar.gz) | `b3b03dc71476f70c8a62cf5ac72fe0bfa433005778d39bfbc43fe225675f9986`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-beta.4/kubernetes-server-linux-s390x.tar.gz) | `940bc9b4f73f32896f3c55d1b5824f931517689ec62b70600c8699e84bc725ee`

### Node Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.4/kubernetes-node-linux-amd64.tar.gz) | `bcc29195864e4e486a7e8194be06f3cf575203e012790ea6d70003349b108701`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-beta.4/kubernetes-node-linux-arm.tar.gz) | `35ab99a6cd30c2ea6a1f2347d244fb8583bfd7ef1d54f89fbf9a3a3be14fb9e7`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-beta.4/kubernetes-node-linux-arm64.tar.gz) | `fcb611d964c7e1c546fbbb38c8b30b3e3bb54226540caa0b80930f53e321dd2e`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-beta.4/kubernetes-node-linux-ppc64le.tar.gz) | `4de7b25cf712df27b6eec5232dc2891e07dbeb8c3699a145f777cc0629f1fe9c`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-beta.4/kubernetes-node-linux-s390x.tar.gz) | `2f0b6a01c7c86209f031f47e1901bf3da82efef4db5b73b4e7d83be04b03c814`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.4/kubernetes-node-windows-amd64.tar.gz) | `619013157435d8da7f58bb339aa21d5a080c341aebe226934d1139d29cff72be`

## Changelog since v1.10.0-beta.3

### Other notable changes

* Fix a regression that prevented using `subPath` volume mounts with secret, configMap, projected, and downwardAPI volumes ([#61080](https://github.com/kubernetes/kubernetes/pull/61080), [@liggitt](https://github.com/liggitt))
* Upgrade the default etcd server version to 3.1.12 to pick up critical etcd "mvcc "unsynced" watcher restore operation" fix. ([#60998](https://github.com/kubernetes/kubernetes/pull/60998), [@jpbetz](https://github.com/jpbetz))
* Fixed missing error checking that could cause kubelet to crash in a race condition. ([#60962](https://github.com/kubernetes/kubernetes/pull/60962), [@technicianted](https://github.com/technicianted))



# v1.10.0-beta.3

[Documentation](https://docs.k8s.io) & [Examples](https://releases.k8s.io/release-1.10/examples)

## Downloads for v1.10.0-beta.3


filename | sha256 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.10.0-beta.3/kubernetes.tar.gz) | `65880d0bb77eeb83554bb0a6c78b6d3a25cd38ef7d714bbe2c73b203386618d6`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.10.0-beta.3/kubernetes-src.tar.gz) | `e9fbf8198fd80c92dd7e2ecf0cf6cefda06f9b89e7986ae141412f8732dae47c`

### Client Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.10.0-beta.3/kubernetes-client-darwin-386.tar.gz) | `50b1a41e70804f74b3e76d7603752d45dfd47011fd986d055462e1330330aa45`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.3/kubernetes-client-darwin-amd64.tar.gz) | `3658e70ae9761464df50c6cae8d57349648c80d16658892e42ea898ddab362bc`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.10.0-beta.3/kubernetes-client-linux-386.tar.gz) | `00b8c048b201931ab1fb059df030e0bfc866f3c3ff464213aa6071ff261a3d33`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.3/kubernetes-client-linux-amd64.tar.gz) | `364d6439185399e72f96bea1bf2863deb2080f4bf6df721932ef14ec45b2d5fc`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-beta.3/kubernetes-client-linux-arm.tar.gz) | `98670b2e965e118fb02901aa949cd1eb12d34ffd0bba7ff22014e9ad587556bc`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-beta.3/kubernetes-client-linux-arm64.tar.gz) | `5f4febc543aa2f10c0c8aee9c9a8cb169b19b04486bda4cf1f72c80fa7a3a483`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-beta.3/kubernetes-client-linux-ppc64le.tar.gz) | `ff3d020e97e2ff4c1824db910f13945d70320fc3988cc24385708cab58d4065f`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-beta.3/kubernetes-client-linux-s390x.tar.gz) | `508695afe6d3466488bc20cad31c184723cb238d1c311d2d1c4f9f1c9e981bd6`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.10.0-beta.3/kubernetes-client-windows-386.tar.gz) | `9f6372cfb973d04a150e1388d96cb60e7fe6ccb9ba63a146ff2dee491c2e3f4e`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.3/kubernetes-client-windows-amd64.tar.gz) | `2c85f2f13dc535d3c777f186b7e6d9403d64ac18ae01d1e460a8979e62845e04`

### Server Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.3/kubernetes-server-linux-amd64.tar.gz) | `4797ada6fd43e223d67840e815c1edb244a3b40a3a1b6ecfde7789119f2add3d`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-beta.3/kubernetes-server-linux-arm.tar.gz) | `fb2fdb4b2feb41adbbd33fe4b7abbe9780d91a288a64ff7acf85d5ef942d3960`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-beta.3/kubernetes-server-linux-arm64.tar.gz) | `bc1f35e1999beaac91b65050f70c8e539918b927937e88bfcfa34a0c26b96701`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-beta.3/kubernetes-server-linux-ppc64le.tar.gz) | `cce312f5af7dd182c8cc4ef35a768fef788a849a93a6f2f36e9d2991e721b362`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-beta.3/kubernetes-server-linux-s390x.tar.gz) | `42edec36fa34a4cc4959af20a587fb05924ccc87c94b0f845953ba1ceec56bb7`

### Node Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.3/kubernetes-node-linux-amd64.tar.gz) | `e517986261e3789cada07d9063ae96ed9b17ffd80c1b220b6ae9c41238c07c08`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-beta.3/kubernetes-node-linux-arm.tar.gz) | `9eb213248982816a855a7ff18c9421d5e987d5f1c472880a16bc6c477ce8da2a`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-beta.3/kubernetes-node-linux-arm64.tar.gz) | `e938dce3ec05cedcd6ab8e2b63224170db00e2c47e67685eb3cb4bad247ac8c0`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-beta.3/kubernetes-node-linux-ppc64le.tar.gz) | `bc9bf3d55f85d3b30f0a28fd79b7610ecdf019b8bc8d7f978da62ee0006c72eb`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-beta.3/kubernetes-node-linux-s390x.tar.gz) | `c5a1b18b8030ec86748e23d45f1de63783c2e95d67b0d6c2fcbcd545d205db8d`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.3/kubernetes-node-windows-amd64.tar.gz) | `df4f4e8df8665ed08a9a3d9816e61c6c9f0ce50e4185b6c7a7f34135ad1f91d0`

## Changelog since v1.10.0-beta.2

### Other notable changes

* kubelet initial flag parse should normalize flags instead of exiting.  ([#61053](https://github.com/kubernetes/kubernetes/pull/61053), [@andrewsykim](https://github.com/andrewsykim))
* Fixes CVE-2017-1002101 - See https://issue.k8s.io/60813 for details ([#61044](https://github.com/kubernetes/kubernetes/pull/61044), [@liggitt](https://github.com/liggitt))
* Fixes the races around devicemanager Allocate() and endpoint deletion. ([#60856](https://github.com/kubernetes/kubernetes/pull/60856), [@jiayingz](https://github.com/jiayingz))
* When ScheduleDaemonSetPods is enabled, the DaemonSet controller will delegate Pods scheduling to default scheduler. ([#59862](https://github.com/kubernetes/kubernetes/pull/59862), [@k82cn](https://github.com/k82cn))
* Set node external IP for azure node when disabling UseInstanceMetadata ([#60959](https://github.com/kubernetes/kubernetes/pull/60959), [@feiskyer](https://github.com/feiskyer))
* Bug fix, allow webhooks to use the scheme provided in clientConfig, instead of defaulting to http. ([#60943](https://github.com/kubernetes/kubernetes/pull/60943), [@jennybuckley](https://github.com/jennybuckley))
* Downgrade default etcd server version to 3.1.11 due to [#60589](https://github.com/kubernetes/kubernetes/pull/60589) ([#60891](https://github.com/kubernetes/kubernetes/pull/60891), [@shyamjvs](https://github.com/shyamjvs))
* kubelet and kube-proxy can now be ran as Windows services ([#60144](https://github.com/kubernetes/kubernetes/pull/60144), [@alinbalutoiu](https://github.com/alinbalutoiu))



# v1.10.0-beta.2

[Documentation](https://docs.k8s.io) & [Examples](https://releases.k8s.io/release-1.10/examples)

## Downloads for v1.10.0-beta.2


filename | sha256 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes.tar.gz) | `d07d77f16664cdb5ce86c87de36727577f48113efdb00f83283714ac1373d521`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-src.tar.gz) | `c27b06e748e4c10f42472f51ddfef7e9546e4ec9d2ce9f7a9a3c5768de8d97bf`

### Client Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-client-darwin-386.tar.gz) | `d63168f9155f04e4b47fe96381f9aa06c3d498b6e6b71d1fb8c3ffeb0f3c6e4c`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-client-darwin-amd64.tar.gz) | `f473cbe830c1bfb738b0a66f07b3cd858ba185232eba26fe776f90d8a27bd7c1`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-client-linux-386.tar.gz) | `2a0f74d30cdaf19ed7c3fde3528e98a8cd98fdb9dc6e6a501525e69895674d56`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-client-linux-amd64.tar.gz) | `69c18569717a97cb5e6bc22bebcf2f64969ba68b11685faaf2949c4ffbcd0b73`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-client-linux-arm.tar.gz) | `10e1d76a1ee6c0df9f9cce40d18c350a1e3e3665e6fe64d22e4433b6283d3fe2`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-client-linux-arm64.tar.gz) | `12f081b99770548c8ddd688ae6b417c196f8308bd5901abbed6f203e133411ae`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-client-linux-ppc64le.tar.gz) | `6e1a035b4857539c90324e00b150ae65aaf4f4524250c9ca7d77ad5936f0628e`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-client-linux-s390x.tar.gz) | `5a8e2b0d14e18a39f821b09a7d73fa5c085cf6c197aeb540a3fe289e04fcc0d9`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-client-windows-386.tar.gz) | `03fac6befb94b85fb90e0bb47596868b4da507d803806fad2a5fb4b85c98d87d`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-client-windows-amd64.tar.gz) | `3bf8dd42eb70735ebdbda4ec4ec54e9507410e2f97ab2f364b88c2f24fdf471c`

### Server Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-server-linux-amd64.tar.gz) | `1278703060865281aa48b1366e3c4b0720d4eca623ba08cf852a4719a6680ec3`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-server-linux-arm.tar.gz) | `b1e2b399bec8c25b7b6037203485d2d09b091afc51ffebf861d5bddb8bb076ac`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-server-linux-arm64.tar.gz) | `4c3d0ed44d6a19ae178034117891678ec373894b02f8d33627b37a36c2ea815b`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-server-linux-ppc64le.tar.gz) | `88a7b52030104a4c6fb1f8c5f79444ed853f381e1463fec7e4939a9998d92dff`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-server-linux-s390x.tar.gz) | `35981580c00bff0e3d92238f961e37dd505c08bcd4cafb11e274daa1eb8ced5f`

### Node Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-node-linux-amd64.tar.gz) | `ceedb0a322167bae33042407da5369e0b7889fbaa3568281500c921afcdbe310`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-node-linux-arm.tar.gz) | `b84ab4c486bc8f00841fccce2aafe4dcef25606c8f3184bce2551ab6486c8f71`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-node-linux-arm64.tar.gz) | `b79a41145c28358a64d7a689cd282cf8361fe87c410fbae1cdc8db76cfcf6e5b`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-node-linux-ppc64le.tar.gz) | `afc00f67b9f6d4fc149d4426fc8bbf6083077e11a1d2330d70be7e765b6cb923`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-node-linux-s390x.tar.gz) | `f6128bbccddfe8ce39762bacb5c13c6c68d76a4bf8d35e773560332eb05a2c86`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.2/kubernetes-node-windows-amd64.tar.gz) | `b1dde1ed2582cd511236fec69ebd6ca30281b30cc37e0841c493f06924a466cf`

## Changelog since v1.10.0-beta.1

### Action Required

* ACTION REQUIRED: LocalStorageCapacityIsolation feature is beta and enabled by default.  ([#60159](https://github.com/kubernetes/kubernetes/pull/60159), [@jingxu97](https://github.com/jingxu97))

### Other notable changes

* Upgrade the default etcd server version to 3.2.16 ([#59836](https://github.com/kubernetes/kubernetes/pull/59836), [@jpbetz](https://github.com/jpbetz))
* Cluster Autoscaler 1.1.2  ([#60842](https://github.com/kubernetes/kubernetes/pull/60842), [@mwielgus](https://github.com/mwielgus))
* ValidatingWebhooks and MutatingWebhooks will not be called on admission requests for ValidatingWebhookConfiguration and MutatingWebhookConfiguration objects in the admissionregistration.k8s.io group ([#59840](https://github.com/kubernetes/kubernetes/pull/59840), [@jennybuckley](https://github.com/jennybuckley))
* Kubeadm: CoreDNS supports migration of the kube-dns configuration to CoreDNS configuration when upgrading the service discovery from kube-dns to CoreDNS as part of Beta.  ([#58828](https://github.com/kubernetes/kubernetes/pull/58828), [@rajansandeep](https://github.com/rajansandeep))
* Fix broken useManagedIdentityExtension for azure cloud provider ([#60775](https://github.com/kubernetes/kubernetes/pull/60775), [@feiskyer](https://github.com/feiskyer))
* kubelet now notifies systemd that it has finished starting, if systemd is available and running. ([#60654](https://github.com/kubernetes/kubernetes/pull/60654), [@dcbw](https://github.com/dcbw))
* Do not count failed pods as unready in HPA controller ([#60648](https://github.com/kubernetes/kubernetes/pull/60648), [@bskiba](https://github.com/bskiba))
* fixed foreground deletion of podtemplates ([#60683](https://github.com/kubernetes/kubernetes/pull/60683), [@nilebox](https://github.com/nilebox))
* Conformance tests are added for the DaemonSet kinds in the apps/v1 group version. Deprecated versions of DaemonSet will not be tested for conformance, and conformance is only applicable to release 1.10 and later. ([#60456](https://github.com/kubernetes/kubernetes/pull/60456), [@kow3ns](https://github.com/kow3ns))
* Log audit backend can now be configured to perform batching before writing events to disk. ([#60237](https://github.com/kubernetes/kubernetes/pull/60237), [@crassirostris](https://github.com/crassirostris))
* Fixes potential deadlock when deleting CustomResourceDefinition for custom resources with finalizers ([#60542](https://github.com/kubernetes/kubernetes/pull/60542), [@liggitt](https://github.com/liggitt))
* fix azure file plugin failure issue on Windows after node restart ([#60625](https://github.com/kubernetes/kubernetes/pull/60625), [@andyzhangx](https://github.com/andyzhangx))
* Set Azure vmType to standard if it is not set in azure cloud config. ([#60623](https://github.com/kubernetes/kubernetes/pull/60623), [@feiskyer](https://github.com/feiskyer))
* On cluster provision or upgrade, kubeadm generates an etcd specific CA for all etcd related certificates. ([#60385](https://github.com/kubernetes/kubernetes/pull/60385), [@stealthybox](https://github.com/stealthybox))
* kube-scheduler: restores default leader election behavior. leader-elect command line parameter should "true" ([#60524](https://github.com/kubernetes/kubernetes/pull/60524), [@dims](https://github.com/dims))
* client-go: alpha support for exec-based credential providers ([#59495](https://github.com/kubernetes/kubernetes/pull/59495), [@ericchiang](https://github.com/ericchiang))



# v1.10.0-beta.1

[Documentation](https://docs.k8s.io) & [Examples](https://releases.k8s.io/release-1.10/examples)

## Downloads for v1.10.0-beta.1


filename | sha256 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes.tar.gz) | `428139d9877f5f94acc806cc4053b0a5f8eac2acc219f06efd0817807473dbc5`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-src.tar.gz) | `5bfdecdbb43d946ea965f22ec6b8a0fc7195197a523aefebc2b7b926d4252edf`

### Client Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-client-darwin-386.tar.gz) | `8cc086e901fe699df5e0711438195e675e099848a72ba272b290d22abc107a93`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-client-darwin-amd64.tar.gz) | `b2782b8f6dbfe3fa962b08606cbf3366b071b78c47794d2ef67f9d484b4af4e4`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-client-linux-386.tar.gz) | `a4001ad2387ccb4557b15c560b0ea8ea4d7c7ed494375346e3f83c10eb9426ac`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-client-linux-amd64.tar.gz) | `b95d354e80d9f00a883e5eeb8c2e0ceaacc0f3cc8c904cb2eca1e1b6d91462b2`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-client-linux-arm64.tar.gz) | `647d234c59bc1d6f8eea88624d85b09bbe1272d9e27e1f7963e03cc025530ed0`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-client-linux-arm.tar.gz) | `187da9ad060ac7d426811772f6c3d891a354945af6a7d8832ac7097e19d4b46d`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-client-linux-ppc64le.tar.gz) | `6112396b8f0e7b1401b374aa2ae6195849da7718572036b6f060a722a89dc319`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-client-linux-s390x.tar.gz) | `09789cf33d8eed610ad2eef7d3ae25a4b4a63ee5525e452f9094097a172a1ce9`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-client-windows-386.tar.gz) | `1e71bc9979c8915587cdea980dad36b0cafd502f972c051c2aa63c3bbfeceb14`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-client-windows-amd64.tar.gz) | `3c2978479c6f65f1cb5043ba182a0571480090298b7d62090d9bf11b043dd27d`

### Server Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-server-linux-amd64.tar.gz) | `d887411450bbc06e2f4a24ce3c478fe6844856a8707b3236c045d44ab93b27d2`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-server-linux-arm64.tar.gz) | `907f037eea90bf893520d3adeccdf29eda69eea32c564b08cecbedfd06471acd`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-server-linux-arm.tar.gz) | `f2ac4ad4f831a970cb35c1d7194788850dff722e859a08a879c918db1233aaa7`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-server-linux-ppc64le.tar.gz) | `0bebb59217b491c5aa4b4b9dc740c0c8c5518872f6f86853cbe30493ea8539a5`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-server-linux-s390x.tar.gz) | `5f343764e04e3a8639dffe225cc6f8bc6f17e1584b2c68923708546f48d38f89`

### Node Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-node-linux-amd64.tar.gz) | `c4475c315d4ae27c30f80bc01d6ea8b0b8549ec6a60a5dc745cf11a0c4398c23`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-node-linux-arm64.tar.gz) | `4512a4c3e62cd26fb0d3f78bfc8de9a860e7d88e7c913c5df4c239536f89da42`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-node-linux-arm.tar.gz) | `1da407ad152b185f520f04215775a8fe176550a31a2bb79e3e82968734bdfb5c`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-node-linux-ppc64le.tar.gz) | `f23f6f819e6d894f8ca7457f80ee4ede729fd35ac59e9c65ab031b56aa06d4a1`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-node-linux-s390x.tar.gz) | `205c789f52a4c666a63ac7944ffa8ee325cb97e788b748c262eae59b838a94ba`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0-beta.1/kubernetes-node-windows-amd64.tar.gz) | `aa7675fd22d9ca671585f429f6981aa79798f1894025c3abe3a7154f3c94aae6`

## Changelog since v1.10.0-alpha.3

### Action Required

* [action required] Default Flexvolume plugin directory for COS images on GCE is changed to `/home/kubernetes/flexvolume`. ([#58171](https://github.com/kubernetes/kubernetes/pull/58171), [@verult](https://github.com/verult))
* action required: [GCP kube-up.sh] Some variables that were part of kube-env are no longer being set (ones only used for kubelet flags) and are being replaced by a more portable mechanism (kubelet configuration file). The individual variables in the kube-env metadata entry were never meant to be a stable interface and this release note only applies if you are depending on them. ([#60020](https://github.com/kubernetes/kubernetes/pull/60020), [@roberthbailey](https://github.com/roberthbailey))
* action required: Deprecate format-separated endpoints for OpenAPI spec. Please use single `/openapi/v2` endpoint instead. ([#59293](https://github.com/kubernetes/kubernetes/pull/59293), [@roycaihw](https://github.com/roycaihw))
* action required: kube-proxy: feature gates are now specified as a map when provided via a JSON or YAML KubeProxyConfiguration, rather than as a string of key-value pairs. ([#57962](https://github.com/kubernetes/kubernetes/pull/57962), [@xiangpengzhao](https://github.com/xiangpengzhao))
* Action Required: The boostrapped RBAC role and rolebinding for the `cloud-provider` service account is now deprecated. If you're currently using this service account, you must create and apply your own RBAC policy for new clusters. ([#59949](https://github.com/kubernetes/kubernetes/pull/59949), [@nicksardo](https://github.com/nicksardo))
* ACTION REQUIRED: VolumeScheduling and LocalPersistentVolume features are beta and enabled by default.  The PersistentVolume NodeAffinity alpha annotation is deprecated and will be removed in a future release. ([#59391](https://github.com/kubernetes/kubernetes/pull/59391), [@msau42](https://github.com/msau42))
* action required: Deprecate the kubelet's cadvisor port. The default will change to 0 (disabled) in 1.12, and the cadvisor port will be removed entirely in 1.13. ([#59827](https://github.com/kubernetes/kubernetes/pull/59827), [@dashpole](https://github.com/dashpole))
* action required: The `kubeletconfig` API group has graduated from alpha to beta, and the name has changed to `kubelet.config.k8s.io`. Please use `kubelet.config.k8s.io/v1beta1`, as `kubeletconfig/v1alpha1` is no longer available.  ([#53833](https://github.com/kubernetes/kubernetes/pull/53833), [@mtaufen](https://github.com/mtaufen))
* Action required: Default values differ between the Kubelet's componentconfig (config file) API and the Kubelet's command line. Be sure to review the default values when migrating to using a config file. ([#59666](https://github.com/kubernetes/kubernetes/pull/59666), [@mtaufen](https://github.com/mtaufen))
* kube-apiserver: the experimental in-tree Keystone password authenticator has been removed in favor of extensions that enable use of Keystone tokens. ([#59492](https://github.com/kubernetes/kubernetes/pull/59492), [@dims](https://github.com/dims))
* The udpTimeoutMilliseconds field in the kube-proxy configuration file has been renamed to udpIdleTimeout. Action required: administrators need to update their files accordingly. ([#57754](https://github.com/kubernetes/kubernetes/pull/57754), [@ncdc](https://github.com/ncdc))

### Other notable changes

* Enable IPVS feature gateway by default ([#60540](https://github.com/kubernetes/kubernetes/pull/60540), [@m1093782566](https://github.com/m1093782566))
* dockershim now makes an Image's Labels available in the Info field of ImageStatusResponse ([#58036](https://github.com/kubernetes/kubernetes/pull/58036), [@shlevy](https://github.com/shlevy))
* kube-scheduler: Support extender managed extended resources in kube-scheduler ([#60332](https://github.com/kubernetes/kubernetes/pull/60332), [@yguo0905](https://github.com/yguo0905))
* Fix the issue in kube-proxy iptables/ipvs mode to properly handle incorrect IP version. ([#56880](https://github.com/kubernetes/kubernetes/pull/56880), [@MrHohn](https://github.com/MrHohn))
* WindowsContainerResources is set now for windows containers ([#59333](https://github.com/kubernetes/kubernetes/pull/59333), [@feiskyer](https://github.com/feiskyer))
* GCE: support Cloud TPU API in cloud provider ([#58029](https://github.com/kubernetes/kubernetes/pull/58029), [@yguo0905](https://github.com/yguo0905))
* The node authorizer now allows nodes to request service account tokens for the service accounts of pods running on them. ([#55019](https://github.com/kubernetes/kubernetes/pull/55019), [@mikedanese](https://github.com/mikedanese))
* Fix StatefulSet to work with set-based selectors. ([#59365](https://github.com/kubernetes/kubernetes/pull/59365), [@ayushpateria](https://github.com/ayushpateria))
* New conformance tests added for the Garbage Collector ([#60116](https://github.com/kubernetes/kubernetes/pull/60116), [@jennybuckley](https://github.com/jennybuckley))
* Make NodePort IP addresses configurable ([#58052](https://github.com/kubernetes/kubernetes/pull/58052), [@m1093782566](https://github.com/m1093782566))
* Implements MountDevice and UnmountDevice for the CSI Plugin, the functions will call through to NodeStageVolume/NodeUnstageVolume for CSI plugins. ([#60115](https://github.com/kubernetes/kubernetes/pull/60115), [@davidz627](https://github.com/davidz627))
* Fixes a bug where character devices are not recongized by the kubelet ([#60440](https://github.com/kubernetes/kubernetes/pull/60440), [@andrewsykim](https://github.com/andrewsykim))
* [fluentd-gcp addon] Switch to the image, provided by Stackdriver. ([#59128](https://github.com/kubernetes/kubernetes/pull/59128), [@bmoyles0117](https://github.com/bmoyles0117))
* StatefulSet in apps/v1 is now included in Conformance Tests. ([#60336](https://github.com/kubernetes/kubernetes/pull/60336), [@enisoc](https://github.com/enisoc))
* K8s supports rbd-nbd for Ceph rbd volume mounts. ([#58916](https://github.com/kubernetes/kubernetes/pull/58916), [@ianchakeres](https://github.com/ianchakeres))
* AWS EBS volume plugin got block volume support ([#58625](https://github.com/kubernetes/kubernetes/pull/58625), [@screeley44](https://github.com/screeley44))
* Summary API will include pod CPU and Memory stats for CRI container runtime. ([#60328](https://github.com/kubernetes/kubernetes/pull/60328), [@Random-Liu](https://github.com/Random-Liu))
* dockertools: disable memory swap on Linux. ([#59404](https://github.com/kubernetes/kubernetes/pull/59404), [@ohmystack](https://github.com/ohmystack))
* On AWS kubelet returns an error when started under conditions that do not allow it to work (AWS has not yet tagged the instance). ([#60125](https://github.com/kubernetes/kubernetes/pull/60125), [@vainu-arto](https://github.com/vainu-arto))
* Increase timeout of integration tests ([#60458](https://github.com/kubernetes/kubernetes/pull/60458), [@jennybuckley](https://github.com/jennybuckley))
* Fixes a case when Deployment with recreate strategy could get stuck on old failed Pod. ([#60301](https://github.com/kubernetes/kubernetes/pull/60301), [@tnozicka](https://github.com/tnozicka))
* Buffered audit backend is introduced, to be used with other audit backends. ([#60076](https://github.com/kubernetes/kubernetes/pull/60076), [@crassirostris](https://github.com/crassirostris))
* Update dashboard version to v1.8.3 ([#57326](https://github.com/kubernetes/kubernetes/pull/57326), [@floreks](https://github.com/floreks))
* GCE PD volume plugin got block volume support ([#58710](https://github.com/kubernetes/kubernetes/pull/58710), [@screeley44](https://github.com/screeley44))
* force node name lowercase on static pod name generating ([#59849](https://github.com/kubernetes/kubernetes/pull/59849), [@yue9944882](https://github.com/yue9944882))
* AWS Security Groups created for ELBs will now be tagged with the same additional tags as the ELB (i.e. the tags specified by the "service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags" annotation.) ([#58767](https://github.com/kubernetes/kubernetes/pull/58767), [@2rs2ts](https://github.com/2rs2ts))
* Fixes an error when deleting an NLB in AWS - Fixes [#57568](https://github.com/kubernetes/kubernetes/pull/57568) ([#57569](https://github.com/kubernetes/kubernetes/pull/57569), [@micahhausler](https://github.com/micahhausler))
* fix device name change issue for azure disk ([#60346](https://github.com/kubernetes/kubernetes/pull/60346), [@andyzhangx](https://github.com/andyzhangx))
* On cluster provision or upgrade, kubeadm now generates certs and secures all connections to the etcd static-pod with mTLS. ([#57415](https://github.com/kubernetes/kubernetes/pull/57415), [@stealthybox](https://github.com/stealthybox))
* Some field names in the Kubelet's now v1beta1 config API differ from the v1alpha1 API: PodManifestPath is renamed to StaticPodPath, ManifestURL is renamed to StaticPodURL, ManifestURLHeader is renamed to StaticPodURLHeader. ([#60314](https://github.com/kubernetes/kubernetes/pull/60314), [@mtaufen](https://github.com/mtaufen))
* Adds BETA support for `DNSConfig` field in PodSpec and `DNSPolicy=None`. ([#59771](https://github.com/kubernetes/kubernetes/pull/59771), [@MrHohn](https://github.com/MrHohn))
* kubeadm: Demote controlplane passthrough flags to alpha flags ([#59882](https://github.com/kubernetes/kubernetes/pull/59882), [@kris-nova](https://github.com/kris-nova))
* DevicePlugins feature graduates to beta. ([#60170](https://github.com/kubernetes/kubernetes/pull/60170), [@jiayingz](https://github.com/jiayingz))
* Additional changes to iptables kube-proxy backend to improve performance on clusters with very large numbers of services. ([#60306](https://github.com/kubernetes/kubernetes/pull/60306), [@danwinship](https://github.com/danwinship))
* CSI now allows credentials to be specified on CreateVolume/DeleteVolume, ControllerPublishVolume/ControllerUnpublishVolume, and NodePublishVolume/NodeUnpublishVolume operations ([#60118](https://github.com/kubernetes/kubernetes/pull/60118), [@sbezverk](https://github.com/sbezverk))
* Disable mount propagation for windows containers. ([#60275](https://github.com/kubernetes/kubernetes/pull/60275), [@feiskyer](https://github.com/feiskyer))
* Introduced `--http2-max-streams-per-connection` command line flag on api-servers and set default to 1000 for aggregated API servers. ([#60054](https://github.com/kubernetes/kubernetes/pull/60054), [@MikeSpreitzer](https://github.com/MikeSpreitzer))
* APIserver backed by etcdv3 exports metric showing number of resources per kind ([#59757](https://github.com/kubernetes/kubernetes/pull/59757), [@gmarek](https://github.com/gmarek))
* The DaemonSet controller, its integration tests, and its e2e tests, have been updated to use the apps/v1 API. ([#59883](https://github.com/kubernetes/kubernetes/pull/59883), [@kow3ns](https://github.com/kow3ns))
* Fix image file system stats for windows nodes ([#59743](https://github.com/kubernetes/kubernetes/pull/59743), [@feiskyer](https://github.com/feiskyer))
* Custom resources can be listed with a set of grouped resources (category) by specifying the categories in the CustomResourceDefinition spec. Example: They can be used with `kubectl get all`, where `all` is a category. ([#59561](https://github.com/kubernetes/kubernetes/pull/59561), [@nikhita](https://github.com/nikhita))
* [fluentd-gcp addon] Fixed bug with reporting metrics in event-exporter ([#60126](https://github.com/kubernetes/kubernetes/pull/60126), [@serathius](https://github.com/serathius))
* Critical pods to use priorityClasses. ([#58835](https://github.com/kubernetes/kubernetes/pull/58835), [@ravisantoshgudimetla](https://github.com/ravisantoshgudimetla))
* `--show-all` (which only affected pods and only for human readable/non-API printers) is now defaulted to true and deprecated.  It will be inert in 1.11 and removed in a future release. ([#60210](https://github.com/kubernetes/kubernetes/pull/60210), [@deads2k](https://github.com/deads2k))
* Removed some redundant rules created by the iptables proxier, to improve performance on systems with very many services. ([#57461](https://github.com/kubernetes/kubernetes/pull/57461), [@danwinship](https://github.com/danwinship))
* Disable per-cpu metrics by default for scalability. ([#60106](https://github.com/kubernetes/kubernetes/pull/60106), [@dashpole](https://github.com/dashpole))
    * Fix inaccurate disk usage monitoring of overlayFs.
    * Retry docker connection on startup timeout to avoid permanent loss of metrics.
* When the `PodShareProcessNamespace` alpha feature is enabled, setting `pod.Spec.ShareProcessNamespace` to `true` will cause a single process namespace to be shared between all containers in a pod. ([#60181](https://github.com/kubernetes/kubernetes/pull/60181), [@verb](https://github.com/verb))
* add spelling checking script ([#59463](https://github.com/kubernetes/kubernetes/pull/59463), [@dixudx](https://github.com/dixudx))
* Allows HorizontalPodAutoscaler to use global metrics not associated with any Kubernetes object (for example metrics from a hoster service running outside of Kubernetes cluster). ([#60096](https://github.com/kubernetes/kubernetes/pull/60096), [@MaciekPytel](https://github.com/MaciekPytel))
* fix race condition issue when detaching azure disk ([#60183](https://github.com/kubernetes/kubernetes/pull/60183), [@andyzhangx](https://github.com/andyzhangx))
* Add kubectl create job command ([#60084](https://github.com/kubernetes/kubernetes/pull/60084), [@soltysh](https://github.com/soltysh))
* [Alpha] Kubelet now supports container log rotation for container runtime which implements CRI(container runtime interface). ([#59898](https://github.com/kubernetes/kubernetes/pull/59898), [@Random-Liu](https://github.com/Random-Liu))
    * The feature can be enabled with feature gate `CRIContainerLogRotation`.
    * The flags `--container-log-max-size` and `--container-log-max-files` can be used to configure the rotation behavior.
* Reorganized iptables rules to fix a performance regression on clusters with thousands of services. ([#56164](https://github.com/kubernetes/kubernetes/pull/56164), [@danwinship](https://github.com/danwinship))
* StorageOS volume plugin updated to support mount options and environments where the kubelet runs in a container and the device location should be specified. ([#58816](https://github.com/kubernetes/kubernetes/pull/58816), [@croomes](https://github.com/croomes))
* Use consts as predicate name in handlers ([#59952](https://github.com/kubernetes/kubernetes/pull/59952), [@resouer](https://github.com/resouer))
* `/status` and `/scale` subresources are added for custom resources. ([#55168](https://github.com/kubernetes/kubernetes/pull/55168), [@nikhita](https://github.com/nikhita))
* Allow kubectl env to specify which keys to import from a config map ([#60040](https://github.com/kubernetes/kubernetes/pull/60040), [@PhilipGough](https://github.com/PhilipGough))
* Set default enabled admission plugins `NamespaceLifecycle,LimitRanger,ServiceAccount,PersistentVolumeLabel,DefaultStorageClass,DefaultTolerationSeconds,MutatingAdmissionWebhook,ValidatingAdmissionWebhook,ResourceQuota` ([#58684](https://github.com/kubernetes/kubernetes/pull/58684), [@hzxuzhonghu](https://github.com/hzxuzhonghu))
* Fix instanceID for vmss nodes. ([#59857](https://github.com/kubernetes/kubernetes/pull/59857), [@feiskyer](https://github.com/feiskyer))
* Deprecate kubectl scale jobs (only jobs).  ([#60139](https://github.com/kubernetes/kubernetes/pull/60139), [@soltysh](https://github.com/soltysh))
* Adds new flag `--apiserver-advertise-dns-address` which is used in node kubelet.confg to point to API server ([#59288](https://github.com/kubernetes/kubernetes/pull/59288), [@stevesloka](https://github.com/stevesloka))
* Fix kube-proxy flags validation for --healthz-bind-address and --metrics-bind-address to allow specifying ip:port. ([#54191](https://github.com/kubernetes/kubernetes/pull/54191), [@MrHohn](https://github.com/MrHohn))
* Increase allowed lag for ssh key sync loop in tunneler to allow for one failure ([#60068](https://github.com/kubernetes/kubernetes/pull/60068), [@wojtek-t](https://github.com/wojtek-t))
* Flags that can be set via the Kubelet's --config file are now deprecated in favor of the file. ([#60148](https://github.com/kubernetes/kubernetes/pull/60148), [@mtaufen](https://github.com/mtaufen))
* PVC Protection alpha feature was renamed to Storage Protection. Storage Protection feature is beta. ([#59052](https://github.com/kubernetes/kubernetes/pull/59052), [@pospispa](https://github.com/pospispa))
* kube-apiserver: the root /proxy paths have been removed (deprecated since v1.2). Use the /proxy subresources on objects that support HTTP proxying. ([#59884](https://github.com/kubernetes/kubernetes/pull/59884), [@mikedanese](https://github.com/mikedanese))
* Set an upper bound (5 minutes) on how long the Kubelet will wait before exiting when the client cert from disk is missing or invalid. This prevents the Kubelet from waiting forever without attempting to bootstrap a new client credentials. ([#59316](https://github.com/kubernetes/kubernetes/pull/59316), [@smarterclayton](https://github.com/smarterclayton))
* v1.Pod now has a field to configure whether a single process namespace should be shared between all containers in a pod. This feature is in alpha preview. ([#58716](https://github.com/kubernetes/kubernetes/pull/58716), [@verb](https://github.com/verb))
* Priority admission controller picks a global default with the lowest priority value if more than one such default PriorityClass exists. ([#59991](https://github.com/kubernetes/kubernetes/pull/59991), [@bsalamat](https://github.com/bsalamat))
* Add ipset binary for IPVS to hyperkube docker image ([#57648](https://github.com/kubernetes/kubernetes/pull/57648), [@Fsero](https://github.com/Fsero))
* kube-apiserver: the OpenID Connect authenticator can now verify ID Tokens signed with JOSE algorithms other than RS256 through the --oidc-signing-algs flag. ([#58544](https://github.com/kubernetes/kubernetes/pull/58544), [@ericchiang](https://github.com/ericchiang))
    * kube-apiserver: the OpenID Connect authenticator no longer accepts tokens from the Google v3 token APIs, users must switch to the "https://www.googleapis.com/oauth2/v4/token" endpoint.
* Rename StorageProtection to StorageObjectInUseProtection ([#59901](https://github.com/kubernetes/kubernetes/pull/59901), [@NickrenREN](https://github.com/NickrenREN))
* kubeadm: add criSocket field to MasterConfiguration manifiest ([#59057](https://github.com/kubernetes/kubernetes/pull/59057), [@JordanFaust](https://github.com/JordanFaust))
* kubeadm: add criSocket field to NodeConfiguration manifiest ([#59292](https://github.com/kubernetes/kubernetes/pull/59292), [@JordanFaust](https://github.com/JordanFaust))
* The `PodSecurityPolicy` API has been moved to the `policy/v1beta1` API group. The `PodSecurityPolicy` API in the `extensions/v1beta1` API group is deprecated and will be removed in a future release. Authorizations for using pod security policy resources should change to reference the `policy` API group after upgrading to 1.11. ([#54933](https://github.com/kubernetes/kubernetes/pull/54933), [@php-coder](https://github.com/php-coder))
* Restores the ability of older clients to delete and scale jobs with initContainers ([#59880](https://github.com/kubernetes/kubernetes/pull/59880), [@liggitt](https://github.com/liggitt))
* Support for resource quota on extended resources ([#57302](https://github.com/kubernetes/kubernetes/pull/57302), [@lichuqiang](https://github.com/lichuqiang))
* Fix race causing apiserver crashes during etcd healthchecking ([#60069](https://github.com/kubernetes/kubernetes/pull/60069), [@wojtek-t](https://github.com/wojtek-t))
* If TaintNodesByCondition enabled, taint node when it under PID pressure  ([#60008](https://github.com/kubernetes/kubernetes/pull/60008), [@k82cn](https://github.com/k82cn))
* Expose total usage of pods through the "pods" SystemContainer in the Kubelet Summary API ([#57802](https://github.com/kubernetes/kubernetes/pull/57802), [@dashpole](https://github.com/dashpole))
* Unauthorized requests will not match audit policy rules where users or groups are set. ([#59398](https://github.com/kubernetes/kubernetes/pull/59398), [@CaoShuFeng](https://github.com/CaoShuFeng))
* Making sure CSI E2E test runs on a local cluster ([#60017](https://github.com/kubernetes/kubernetes/pull/60017), [@sbezverk](https://github.com/sbezverk))
* Addressing breaking changes introduced by new 0.2.0 release of CSI spec ([#59209](https://github.com/kubernetes/kubernetes/pull/59209), [@sbezverk](https://github.com/sbezverk))
* GCE: A role and clusterrole will now be provided with GCE/GKE for allowing the cloud-provider to post warning events on all services and watching configmaps in the kube-system namespace. ([#59686](https://github.com/kubernetes/kubernetes/pull/59686), [@nicksardo](https://github.com/nicksardo))
* Updated PID pressure node condition ([#57136](https://github.com/kubernetes/kubernetes/pull/57136), [@k82cn](https://github.com/k82cn))
* Add AWS cloud provider option to use an assumed IAM role  ([#59668](https://github.com/kubernetes/kubernetes/pull/59668), [@brycecarman](https://github.com/brycecarman))
* `kubectl port-forward` now supports specifying a service to port forward to: `kubectl port-forward svc/myservice 8443:443` ([#59809](https://github.com/kubernetes/kubernetes/pull/59809), [@phsiao](https://github.com/phsiao))
* Fix kubelet PVC stale metrics ([#59170](https://github.com/kubernetes/kubernetes/pull/59170), [@cofyc](https://github.com/cofyc))
* - Separate current ARM rate limiter into read/write ([#59830](https://github.com/kubernetes/kubernetes/pull/59830), [@khenidak](https://github.com/khenidak))
    * - Improve control over how ARM rate limiter is used within Azure cloud provider
* The ConfigOK node condition has been renamed to KubeletConfigOk. ([#59905](https://github.com/kubernetes/kubernetes/pull/59905), [@mtaufen](https://github.com/mtaufen))
* fluentd-gcp resources can be modified via a ScalingPolicy ([#59657](https://github.com/kubernetes/kubernetes/pull/59657), [@x13n](https://github.com/x13n))
* Adding pkg/kubelet/apis/deviceplugin/v1beta1 API. ([#59588](https://github.com/kubernetes/kubernetes/pull/59588), [@jiayingz](https://github.com/jiayingz))
* Fixes volume predicate handler for equiv class ([#59335](https://github.com/kubernetes/kubernetes/pull/59335), [@resouer](https://github.com/resouer))
* Bugfix: vSphere Cloud Provider (VCP) does not need any special service account anymore. ([#59440](https://github.com/kubernetes/kubernetes/pull/59440), [@rohitjogvmw](https://github.com/rohitjogvmw))
* Fixing a bug in OpenStack cloud provider, where dual stack deployments (IPv4 and IPv6) did not work well when using kubenet as the network plugin. ([#59749](https://github.com/kubernetes/kubernetes/pull/59749), [@zioproto](https://github.com/zioproto))
* Get parent dir via canonical absolute path when trying to judge mount-point ([#58433](https://github.com/kubernetes/kubernetes/pull/58433), [@yue9944882](https://github.com/yue9944882))
* Container runtime daemon (e.g. dockerd) logs in GCE cluster will be uploaded to stackdriver and elasticsearch with tag `container-runtime` ([#59103](https://github.com/kubernetes/kubernetes/pull/59103), [@Random-Liu](https://github.com/Random-Liu))
* Add AzureDisk support for vmss nodes ([#59716](https://github.com/kubernetes/kubernetes/pull/59716), [@feiskyer](https://github.com/feiskyer))
* Fixed a race condition in k8s.io/client-go/tools/cache.SharedInformer that could violate the sequential delivery guarantee and cause panics on shutdown. ([#59828](https://github.com/kubernetes/kubernetes/pull/59828), [@krousey](https://github.com/krousey))
* Avoid hook errors when effecting label changes on kubernetes-worker charm. ([#59803](https://github.com/kubernetes/kubernetes/pull/59803), [@wwwtyro](https://github.com/wwwtyro))
* kubectl port-forward now allows using resource name (e.g., deployment/www) to select a matching pod, as well as allows the use of --pod-running-timeout to wait till at least one pod is running. ([#59705](https://github.com/kubernetes/kubernetes/pull/59705), [@phsiao](https://github.com/phsiao))
    * kubectl port-forward no longer support deprecated -p flag
* Deprecate insecure HTTP port of kube-controller-manager and cloud-controller-manager. Use `--secure-port` and `--bind-address` instead. ([#59582](https://github.com/kubernetes/kubernetes/pull/59582), [@sttts](https://github.com/sttts))
* Eviction thresholds set to 0% or 100% are now ignored. ([#59681](https://github.com/kubernetes/kubernetes/pull/59681), [@mtaufen](https://github.com/mtaufen))
* [advanced audit] support subresources wildcard matching. ([#55306](https://github.com/kubernetes/kubernetes/pull/55306), [@hzxuzhonghu](https://github.com/hzxuzhonghu))
* CronJobs can be accessed through cj alias ([#59499](https://github.com/kubernetes/kubernetes/pull/59499), [@soltysh](https://github.com/soltysh))
* fix typo in resource_allocation.go ([#58275](https://github.com/kubernetes/kubernetes/pull/58275), [@carmark](https://github.com/carmark))
* fix the error prone account creation method of blob disk ([#59739](https://github.com/kubernetes/kubernetes/pull/59739), [@andyzhangx](https://github.com/andyzhangx))
* Add automatic etcd 3.2->3.1 and 3.1->3.0 minor version rollback support to gcr.io/google_container/etcd images. For HA clusters, all members must be stopped before performing a rollback. ([#59298](https://github.com/kubernetes/kubernetes/pull/59298), [@jpbetz](https://github.com/jpbetz))
* `kubeadm init` can now omit the tainting of the master node if configured to do so in `kubeadm.yaml`. ([#55479](https://github.com/kubernetes/kubernetes/pull/55479), [@ijc](https://github.com/ijc))
* Updated kubernetes-worker to request new security tokens when the aws cloud provider changes the registered node name. ([#59730](https://github.com/kubernetes/kubernetes/pull/59730), [@hyperbolic2346](https://github.com/hyperbolic2346))
* Controller-manager --service-sync-period flag is removed (was never used in the code). ([#59359](https://github.com/kubernetes/kubernetes/pull/59359), [@khenidak](https://github.com/khenidak))
* Pod priority can be specified ins PodSpec even when the feature is disabled, but it will be effective only when the feature is enabled. ([#59291](https://github.com/kubernetes/kubernetes/pull/59291), [@bsalamat](https://github.com/bsalamat))
* kubeadm: Enable auditing behind a feature gate. ([#59067](https://github.com/kubernetes/kubernetes/pull/59067), [@chuckha](https://github.com/chuckha))
* Map correct vmset name for Azure internal load balancers ([#59747](https://github.com/kubernetes/kubernetes/pull/59747), [@feiskyer](https://github.com/feiskyer))
* Add generic cache for Azure VMSS ([#59652](https://github.com/kubernetes/kubernetes/pull/59652), [@feiskyer](https://github.com/feiskyer))
* kubeadm: New "imagePullPolicy" option in the init configuration file, that gets forwarded to kubelet static pods to control pull policy for etcd and control plane images. ([#58960](https://github.com/kubernetes/kubernetes/pull/58960), [@rosti](https://github.com/rosti))
* fix the create azure file pvc failure if there is no storage account in current resource group ([#56557](https://github.com/kubernetes/kubernetes/pull/56557), [@andyzhangx](https://github.com/andyzhangx))
* Add generic cache for Azure VM/LB/NSG/RouteTable ([#59520](https://github.com/kubernetes/kubernetes/pull/59520), [@feiskyer](https://github.com/feiskyer))
* The alpha KubeletConfiguration.ConfigTrialDuration field is no longer available. ([#59628](https://github.com/kubernetes/kubernetes/pull/59628), [@mtaufen](https://github.com/mtaufen))
* Updates Calico version to v2.6.7 (Fixed a bug where Felix would crash when parsing a NetworkPolicy with a named port. See https://github.com/projectcalico/calico/releases/tag/v2.6.7) ([#59130](https://github.com/kubernetes/kubernetes/pull/59130), [@caseydavenport](https://github.com/caseydavenport))
* return error if New-SmbGlobalMapping failed when mounting azure file on Windows ([#59540](https://github.com/kubernetes/kubernetes/pull/59540), [@andyzhangx](https://github.com/andyzhangx))
* Disallow PriorityClass names with 'system-' prefix for user defined priority classes. ([#59382](https://github.com/kubernetes/kubernetes/pull/59382), [@bsalamat](https://github.com/bsalamat))
* Fixed an issue where Portworx volume driver wasn't passing namespace and annotations to the Portworx Create API. ([#59607](https://github.com/kubernetes/kubernetes/pull/59607), [@harsh-px](https://github.com/harsh-px))
* Enable apiserver metrics for custom resources. ([#57682](https://github.com/kubernetes/kubernetes/pull/57682), [@nikhita](https://github.com/nikhita))
* fix typo  ([#59619](https://github.com/kubernetes/kubernetes/pull/59619), [@jianliao82](https://github.com/jianliao82))
    * incase -> in case
    * selction -> selection
* Implement envelope service with gRPC, so that KMS providers can be pulled out from API server. ([#55684](https://github.com/kubernetes/kubernetes/pull/55684), [@wu-qiang](https://github.com/wu-qiang))
* Enable golint for `pkg/scheduler` and fix the golint errors in it. ([#58437](https://github.com/kubernetes/kubernetes/pull/58437), [@tossmilestone](https://github.com/tossmilestone))
* AWS: Make attach/detach operations faster. from 10-12s to 2-6s ([#56974](https://github.com/kubernetes/kubernetes/pull/56974), [@gnufied](https://github.com/gnufied))
* CRI starts using moutpoint as image filesystem identifier instead of UUID. ([#59475](https://github.com/kubernetes/kubernetes/pull/59475), [@Random-Liu](https://github.com/Random-Liu))
* DaemonSet, Deployment, ReplicaSet, and StatefulSet objects are now persisted in etcd in apps/v1 format ([#58854](https://github.com/kubernetes/kubernetes/pull/58854), [@liggitt](https://github.com/liggitt))
* 'none' can now be specified in KubeletConfiguration.EnforceNodeAllocatable (--enforce-node-allocatable) to explicitly disable enforcement. ([#59515](https://github.com/kubernetes/kubernetes/pull/59515), [@mtaufen](https://github.com/mtaufen))
* vSphere Cloud Provider supports VMs provisioned on vSphere v1.6.5 ([#59519](https://github.com/kubernetes/kubernetes/pull/59519), [@abrarshivani](https://github.com/abrarshivani))
* Annotations is added to advanced audit api ([#58806](https://github.com/kubernetes/kubernetes/pull/58806), [@CaoShuFeng](https://github.com/CaoShuFeng))
* 2nd try at using a vanity GCR name ([#57824](https://github.com/kubernetes/kubernetes/pull/57824), [@thockin](https://github.com/thockin))
* Node's providerID is following Azure resource ID format now when useInstanceMetadata is enabled ([#59539](https://github.com/kubernetes/kubernetes/pull/59539), [@feiskyer](https://github.com/feiskyer))
* Block Volume Support: Local Volume Plugin update ([#59303](https://github.com/kubernetes/kubernetes/pull/59303), [@dhirajh](https://github.com/dhirajh))
* [action-required] The Container Runtime Interface (CRI) version has increased from v1alpha1 to v1alpha2. Runtimes implementing the CRI will need to update to the new version, which configures container namespaces using an enumeration rather than booleans. ([#58973](https://github.com/kubernetes/kubernetes/pull/58973), [@verb](https://github.com/verb))
* Fix the bug where kubelet in the standalone mode would wait for the update from the apiserver source. ([#59276](https://github.com/kubernetes/kubernetes/pull/59276), [@roboll](https://github.com/roboll))
* Add "keyring" parameter for Ceph RBD provisioner ([#58287](https://github.com/kubernetes/kubernetes/pull/58287), [@madddi](https://github.com/madddi))
* Ensure euqiv hash calculation is per schedule ([#59245](https://github.com/kubernetes/kubernetes/pull/59245), [@resouer](https://github.com/resouer))
* kube-scheduler: Use default predicates/prioritizers if they are unspecified in the policy config ([#59363](https://github.com/kubernetes/kubernetes/pull/59363), [@yguo0905](https://github.com/yguo0905))
* Fixed charm issue where docker login would run prior to daemon options being set.  ([#59396](https://github.com/kubernetes/kubernetes/pull/59396), [@kwmonroe](https://github.com/kwmonroe))
* Implementers of the cloud provider interface will note the addition of a context to this interface. Trivial code modification will be necessary for a cloud provider to continue to compile. ([#59287](https://github.com/kubernetes/kubernetes/pull/59287), [@cheftako](https://github.com/cheftako))
* /release-note-none ([#58264](https://github.com/kubernetes/kubernetes/pull/58264), [@WanLinghao](https://github.com/WanLinghao))
* Use a more reliable way to get total physical memory on windows nodes ([#57124](https://github.com/kubernetes/kubernetes/pull/57124), [@JiangtianLi](https://github.com/JiangtianLi))
* Add xfsprogs to hyperkube container image. ([#56937](https://github.com/kubernetes/kubernetes/pull/56937), [@redbaron](https://github.com/redbaron))
* Ensure Azure public IP removed after service deleted ([#59340](https://github.com/kubernetes/kubernetes/pull/59340), [@feiskyer](https://github.com/feiskyer))
* Improve messages user gets during and after volume resizing is done. ([#58415](https://github.com/kubernetes/kubernetes/pull/58415), [@gnufied](https://github.com/gnufied))
* Fix RBAC permissions for Stackdriver Metadata Agent. ([#57455](https://github.com/kubernetes/kubernetes/pull/57455), [@kawych](https://github.com/kawych))
* Scheduler should be able to read from config file if configmap is not present. ([#59386](https://github.com/kubernetes/kubernetes/pull/59386), [@ravisantoshgudimetla](https://github.com/ravisantoshgudimetla))
* MountPropagation feature is now beta. As consequence, all volume mounts in containers are now "rslave" on Linux by default. ([#59252](https://github.com/kubernetes/kubernetes/pull/59252), [@jsafrane](https://github.com/jsafrane))
* Fix RBAC role for certificate controller to allow cleaning. ([#59375](https://github.com/kubernetes/kubernetes/pull/59375), [@mikedanese](https://github.com/mikedanese))
* Volume metrics support for vSphere Cloud Provider ([#59328](https://github.com/kubernetes/kubernetes/pull/59328), [@divyenpatel](https://github.com/divyenpatel))
* Announcing the deprecation of the recycling reclaim policy. ([#59063](https://github.com/kubernetes/kubernetes/pull/59063), [@ayushpateria](https://github.com/ayushpateria))
* Intended for post-1.9 ([#57872](https://github.com/kubernetes/kubernetes/pull/57872), [@mlmhl](https://github.com/mlmhl))
* The `meta.k8s.io/v1alpha1` objects for retrieving tabular responses from the server (`Table`) or fetching just the `ObjectMeta` for an object (as `PartialObjectMetadata`) are now beta as part of `meta.k8s.io/v1beta1`.  Clients may request alternate representations of normal Kubernetes objects by passing an `Accept` header like `application/json;as=Table;g=meta.k8s.io;v=v1beta1` or `application/json;as=PartialObjectMetadata;g=meta.k8s.io;v1=v1beta1`.  Older servers will ignore this representation or return an error if it is not available.  Clients may request fallback to the normal object by adding a non-qualified mime-type to their `Accept` header like `application/json` - the server will then respond with either the alternate representation if it is supported or the fallback mime-type which is the normal object response. ([#59059](https://github.com/kubernetes/kubernetes/pull/59059), [@smarterclayton](https://github.com/smarterclayton))
* add PV size grow feature for azure file ([#57017](https://github.com/kubernetes/kubernetes/pull/57017), [@andyzhangx](https://github.com/andyzhangx))
* Upgrade default etcd server version to 3.2.14 ([#58645](https://github.com/kubernetes/kubernetes/pull/58645), [@jpbetz](https://github.com/jpbetz))
* Add windows config to Kubelet CRI ([#57076](https://github.com/kubernetes/kubernetes/pull/57076), [@feiskyer](https://github.com/feiskyer))
* Configurable etcd quota backend bytes in GCE ([#59259](https://github.com/kubernetes/kubernetes/pull/59259), [@wojtek-t](https://github.com/wojtek-t))
* Remove unmaintained kube-registry-proxy support from gce kube-up. ([#58564](https://github.com/kubernetes/kubernetes/pull/58564), [@mikedanese](https://github.com/mikedanese))
* Allow expanding mounted volumes ([#58794](https://github.com/kubernetes/kubernetes/pull/58794), [@gnufied](https://github.com/gnufied))
* Upped the timeout for apiserver communication in the juju kubernetes-worker charm. ([#59219](https://github.com/kubernetes/kubernetes/pull/59219), [@hyperbolic2346](https://github.com/hyperbolic2346))
* kubeadm init: skip checking cri socket in preflight checks ([#58802](https://github.com/kubernetes/kubernetes/pull/58802), [@dixudx](https://github.com/dixudx))
* Add "nominatedNodeName" field to PodStatus. This field is set when a pod preempts other pods on the node. ([#58990](https://github.com/kubernetes/kubernetes/pull/58990), [@bsalamat](https://github.com/bsalamat))
* Changes secret, configMap, downwardAPI and projected volumes to mount read-only, instead of allowing applications to write data and then reverting it automatically. Until version 1.11, setting the feature gate ReadOnlyAPIDataVolumes=false will preserve the old behavior. ([#58720](https://github.com/kubernetes/kubernetes/pull/58720), [@joelsmith](https://github.com/joelsmith))
* Fixed issue with charm upgrades resulting in an error state. ([#59064](https://github.com/kubernetes/kubernetes/pull/59064), [@hyperbolic2346](https://github.com/hyperbolic2346))
* Ensure IP is set for Azure internal load balancer. ([#59083](https://github.com/kubernetes/kubernetes/pull/59083), [@feiskyer](https://github.com/feiskyer))
* Postpone PV deletion when it is being bound to a PVC ([#58743](https://github.com/kubernetes/kubernetes/pull/58743), [@NickrenREN](https://github.com/NickrenREN))
* Add V1beta1 VolumeAttachment API, co-existing with Alpha API object ([#58462](https://github.com/kubernetes/kubernetes/pull/58462), [@NickrenREN](https://github.com/NickrenREN))
* When using client or server certificate rotation, the Kubelet will no longer wait until the initial rotation succeeds or fails before starting static pods.  This makes running self-hosted masters with rotation more predictable. ([#58930](https://github.com/kubernetes/kubernetes/pull/58930), [@smarterclayton](https://github.com/smarterclayton))



# v1.10.0-alpha.3

[Documentation](https://docs.k8s.io) & [Examples](https://releases.k8s.io/master/examples)

## Downloads for v1.10.0-alpha.3


filename | sha256 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes.tar.gz) | `246f0373ccb25a243a387527b32354b69fc2211c422e71479d22bfb3a829c8fb`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-src.tar.gz) | `f9c60bb37fb7b363c9f66d8efd8aa5a36ea2093c61317c950719b3ddc86c5e10`

### Client Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-client-darwin-386.tar.gz) | `ca8dfd7fbd34478e7ba9bba3779fcca08f7efd4f218b0c8a7f52bbeea0f42cd7`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-client-darwin-amd64.tar.gz) | `713c35d99f44bd19d225d2c9f2d7c4f3976b5dd76e9a817b2aaf68ee0cb5a939`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-client-linux-386.tar.gz) | `7601e55e3bb0f0fc11611c68c4bc000c3cbbb7a09652c386e482a1671be7e2d6`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-client-linux-amd64.tar.gz) | `8a6c498531c1832176e22d622008a98bac6043f05dec96747649651531ed3fd7`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-client-linux-arm64.tar.gz) | `81561820fb5a000152e9d8d94882e0ed6228025ea7973ee98173b5fc89d62a42`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-client-linux-arm.tar.gz) | `6ce8c3ed253a10d78e62e000419653a29c411cd64910325b21ff3370cb0a89eb`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-client-linux-ppc64le.tar.gz) | `a46b42c94040767f6bbf2ce10aef36d8dbe94c0069f866a848d69b2274f8f0bc`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-client-linux-s390x.tar.gz) | `fa3e656b612277fc4c303aef95c60b58ed887e36431db23d26b536f226a23cf6`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-client-windows-386.tar.gz) | `832e12266495ac55cb54a999bc5ae41d42d160387b487d8b4ead577d96686b62`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-client-windows-amd64.tar.gz) | `7056a3eb5a8f9e8fa0326aa6e0bf97fc5b260447315f8ec7340be5747a16f5fd`

### Server Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-server-linux-amd64.tar.gz) | `dc8e2be2fcb6477249621fb5c813c853371a3bf8732c5cb3a6d6cab667cfa324`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-server-linux-arm64.tar.gz) | `399071ad9042a72bccd6e1aa322405c02b4a807c0b4f987d608c4c9c369979d6`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-server-linux-arm.tar.gz) | `7457ad16665e331fa9224a3d61690206723721197ad9760c3b488de9602293f5`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-server-linux-ppc64le.tar.gz) | `ffcb728d879c0347bd751c9bccac3520bb057d203ba1acd55f8c727295282049`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-server-linux-s390x.tar.gz) | `f942f6e15886a1fb0d91d04adf47677068c56070dff060f38c371c3ee3e99648`

### Node Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-node-linux-amd64.tar.gz) | `81b22beb30be9d270016c7b35b86ea585f29c0c5f09128da9341f9f67c8865f9`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-node-linux-arm64.tar.gz) | `d9020b99c145f44c519b1a95b55ed24e69d9c679a02352c7e05e86042daca9d1`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-node-linux-arm.tar.gz) | `1d10bee4ed62d70b318f5703b2cd8295a08e199f810d6b361f367907e3f01fb6`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-node-linux-ppc64le.tar.gz) | `67cd4dde212abda37e6f9e6dee1bb59db96e0727100ef0aa561c15562df0f3e1`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-node-linux-s390x.tar.gz) | `362b030e011ea6222b1f2dec62311d3971bcce4dba94997963e2a091efbf967b`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.3/kubernetes-node-windows-amd64.tar.gz) | `e609a2b0410acbb64d3ee6d7f134d98723d82d05bdbead1eaafd3584d3e45c39`

## Changelog since v1.10.0-alpha.2

### Other notable changes

* Fixed issue with kubernetes-worker option allow-privileged not properly handling the value True with a capital T. ([#59116](https://github.com/kubernetes/kubernetes/pull/59116), [@hyperbolic2346](https://github.com/hyperbolic2346))
* Added anti-affinity to kube-dns pods ([#57683](https://github.com/kubernetes/kubernetes/pull/57683), [@vainu-arto](https://github.com/vainu-arto))
* cloudprovider/openstack: fix bug the tries to use octavia client to query flip ([#59075](https://github.com/kubernetes/kubernetes/pull/59075), [@jrperritt](https://github.com/jrperritt))
* Windows containers now support experimental Hyper-V isolation by setting annotation `experimental.windows.kubernetes.io/isolation-type=hyperv` and feature gates HyperVContainer. Only one container per pod is supported yet. ([#58751](https://github.com/kubernetes/kubernetes/pull/58751), [@feiskyer](https://github.com/feiskyer))
* `crds` is added as a shortname for CustomResourceDefinition i.e. `kubectl get crds` can now be used. ([#59061](https://github.com/kubernetes/kubernetes/pull/59061), [@nikhita](https://github.com/nikhita))
* Fix an issue where port forwarding doesn't forward local TCP6 ports to the pod ([#57457](https://github.com/kubernetes/kubernetes/pull/57457), [@vfreex](https://github.com/vfreex))
* YAMLDecoder Read now tracks rest of buffer on io.ErrShortBuffer ([#58817](https://github.com/kubernetes/kubernetes/pull/58817), [@karlhungus](https://github.com/karlhungus))
* Prevent kubelet from getting wedged if initialization of modules returns an error. ([#59020](https://github.com/kubernetes/kubernetes/pull/59020), [@brendandburns](https://github.com/brendandburns))
* Fixed a race condition inside kubernetes-worker that would result in a temporary error situation. ([#59005](https://github.com/kubernetes/kubernetes/pull/59005), [@hyperbolic2346](https://github.com/hyperbolic2346))
* [GCE] Apiserver uses `InternalIP` as the most preferred kubelet address type by default. ([#59019](https://github.com/kubernetes/kubernetes/pull/59019), [@MrHohn](https://github.com/MrHohn))
* Deprecate insecure flags `--insecure-bind-address`, `--insecure-port` and remove  `--public-address-override`. ([#59018](https://github.com/kubernetes/kubernetes/pull/59018), [@hzxuzhonghu](https://github.com/hzxuzhonghu))
* Support GetLabelsForVolume in OpenStack Provider ([#58871](https://github.com/kubernetes/kubernetes/pull/58871), [@edisonxiang](https://github.com/edisonxiang))
* Build using go1.9.3. ([#59012](https://github.com/kubernetes/kubernetes/pull/59012), [@ixdy](https://github.com/ixdy))
* CRI: Add a call to reopen log file for a container.  ([#58899](https://github.com/kubernetes/kubernetes/pull/58899), [@yujuhong](https://github.com/yujuhong))
* The alpha KubeletConfigFile feature gate has been removed, because it was redundant with the Kubelet's --config flag. It is no longer necessary to set this gate to use the flag. The --config flag is still considered alpha. ([#58978](https://github.com/kubernetes/kubernetes/pull/58978), [@mtaufen](https://github.com/mtaufen))
* `kubectl scale` can now scale any resource (kube, CRD, aggregate) conforming to the standard scale endpoint ([#58298](https://github.com/kubernetes/kubernetes/pull/58298), [@p0lyn0mial](https://github.com/p0lyn0mial))
* kube-apiserver flag --tls-ca-file has had no effect for some time.  It is now deprecated and slated for removal in 1.11.  If you are specifying this flag, you must remove it from your launch config before upgrading to 1.11. ([#58968](https://github.com/kubernetes/kubernetes/pull/58968), [@deads2k](https://github.com/deads2k))
* Fix regression in the CRI: do not add a default hostname on short image names ([#58955](https://github.com/kubernetes/kubernetes/pull/58955), [@runcom](https://github.com/runcom))
* Get windows kernel version directly from registry ([#58498](https://github.com/kubernetes/kubernetes/pull/58498), [@feiskyer](https://github.com/feiskyer))
* Remove deprecated --require-kubeconfig flag, remove default --kubeconfig value ([#58367](https://github.com/kubernetes/kubernetes/pull/58367), [@zhangxiaoyu-zidif](https://github.com/zhangxiaoyu-zidif))
* Google Cloud Service Account email addresses can now be used in RBAC ([#58141](https://github.com/kubernetes/kubernetes/pull/58141), [@ahmetb](https://github.com/ahmetb))
    * Role bindings since the default scopes now include the "userinfo.email"
    * scope. This is a breaking change if the numeric uniqueIDs of the Google
    * service accounts were being used in RBAC role bindings. The behavior
    * can be overridden by explicitly specifying the scope values as
    * comma-separated string in the "users[*].config.scopes" field in the
    * KUBECONFIG file.
* kube-apiserver is changed to use SSH tunnels for webhook iff the webhook is not directly routable from apiserver's network environment. ([#58644](https://github.com/kubernetes/kubernetes/pull/58644), [@yguo0905](https://github.com/yguo0905))
* Updated priority of mirror pod according to PriorityClassName. ([#58485](https://github.com/kubernetes/kubernetes/pull/58485), [@k82cn](https://github.com/k82cn))
* Fixes a bug where kubelet crashes trying to free memory under memory pressure ([#58574](https://github.com/kubernetes/kubernetes/pull/58574), [@yastij](https://github.com/yastij))



# v1.10.0-alpha.2

[Documentation](https://docs.k8s.io) & [Examples](https://releases.k8s.io/master/examples)

## Downloads for v1.10.0-alpha.2


filename | sha256 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes.tar.gz) | `89efeb8b16c40e5074f092f51399995f0fe4a0312367a8f54bd227c3c6fcb629`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-src.tar.gz) | `eefbbf435f1b7a0e416f4e6b2c936c49ce5d692994da8d235c5e25bc408eec57`

### Client Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-client-darwin-386.tar.gz) | `878366200ddfb9128a133d7d377057c6f878b24357062cf5243c0f0aac26b292`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-client-darwin-amd64.tar.gz) | `dc065b9ecfa513607eac6e7dd125b2c25c9a9e7c13d0b2b6e56586e17bbd6ae5`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-client-linux-386.tar.gz) | `93c2462051935d8f6bca6c72d09948963d47cd64426660f63e0cea7d37e24812`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-client-linux-amd64.tar.gz) | `0eef61285fad1f9ff8392c59986d3a41887abc642bcb5cb451c5a5300927e2c4`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-client-linux-arm64.tar.gz) | `6cf7913730a57b503beaf37f5c4d0f97789358983ed03654036f8b986b60cc62`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-client-linux-arm.tar.gz) | `f03c3ecbf4c08d263f2daa8cbe838e20452d6650b80e9a74762c155c26a579b7`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-client-linux-ppc64le.tar.gz) | `25a2f93ebb721901d262adae4c0bdaa4cf1293793e9dff4507e031b85f46aff8`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-client-linux-s390x.tar.gz) | `3e0b9ef771f36edb61bd61ccb67996ed41793c01f8686509bf93e585ee882c94`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-client-windows-386.tar.gz) | `387e5e6b0535f4f5996c0732f1b591d80691acaec86e35482c7b90e00a1856f7`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-client-windows-amd64.tar.gz) | `c10a72d40252707b732d33d03beec3c6380802d0a6e3214cbbf4af258fddf28c`

### Server Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-server-linux-amd64.tar.gz) | `42c1e016e8b0c5cc36c7bf574abca18c63e16d719d35e19ddbcbcd5aaeabc46c`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-server-linux-arm64.tar.gz) | `b7774c54344c75bf5c703d4ca271f0af6c230e86cbe40eafd9cbf98a4f4be6e9`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-server-linux-arm.tar.gz) | `c11c8554506b64d6fd1a6e79bfc4e1e19f4f826b9ba98de81bc757901e8cdc43`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-server-linux-ppc64le.tar.gz) | `196bd957804b2a9049189d225e49bf78e52e9adef12c072128e4e85d35da438e`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-server-linux-s390x.tar.gz) | `be12fbea28a6cb089734782fe11e6f90a30785b9ad1ec02bc08a59afeb95c173`

### Node Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-node-linux-amd64.tar.gz) | `a1feb239dfc473b49adf95d7d94e4a9c6c7d07416d4e935e3fc10175ffaa7163`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-node-linux-arm64.tar.gz) | `26583c0bd08313bdc0bdfba6745f3ccd0f117431d3a5e2623bb5015675d506b8`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-node-linux-arm.tar.gz) | `79c6299a5482467e3e85ee881f21edf5d491bc28c94e547d9297d1e1ad1b7458`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-node-linux-ppc64le.tar.gz) | `2732fd288f1eac44c599423ce28cbdb85b54a646970a3714be5ff86d1b14b5e2`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-node-linux-s390x.tar.gz) | `8d49432f0ff3baf55e71c29fb6ffc1673b2a45b9eae2e1906138b1409da53940`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.2/kubernetes-node-windows-amd64.tar.gz) | `15ff74edfa98cd1afadcc4e53dd592b1e2935fbab76ad731309d355ae23bdd09`

## Changelog since v1.10.0-alpha.1

### Action Required

* Bug fix: webhooks now do not skip cluster-scoped resources ([#58185](https://github.com/kubernetes/kubernetes/pull/58185), [@caesarxuchao](https://github.com/caesarxuchao))
    * Action required: Before upgrading your Kubernetes clusters, double check if you had configured webhooks for cluster-scoped objects (e.g., nodes, persistentVolume), these webhooks will start to take effect. Delete/modify the configs if that's not desirable.

### Other notable changes

<<<<<<< HEAD
* Fixing extra_sans option on master and load balancer. ([#58843](https://github.com/kubernetes/kubernetes/pull/58843), [@hyperbolic2346](https://github.com/hyperbolic2346))
* ConfigMap objects now support binary data via a new `binaryData` field. When using `kubectl create configmap --from-file`, files containing non-UTF8 data will be placed in this new field in order to preserve the non-UTF8 data. Use of this feature requires 1.10+ apiserver and kubelets. ([#57938](https://github.com/kubernetes/kubernetes/pull/57938), [@dims](https://github.com/dims))
* New alpha feature to limit the number of processes running in a pod. Cluster administrators will be able to place limits by using the new kubelet command line parameter --pod-max-pids. Note that since this is a alpha feature they will need to enable the "SupportPodPidsLimit" feature. ([#57973](https://github.com/kubernetes/kubernetes/pull/57973), [@dims](https://github.com/dims))
* Add storage-backend configuration option to kubernetes-master charm. ([#58830](https://github.com/kubernetes/kubernetes/pull/58830), [@wwwtyro](https://github.com/wwwtyro))
* use containing API group when resolving shortname from discovery ([#58741](https://github.com/kubernetes/kubernetes/pull/58741), [@dixudx](https://github.com/dixudx))
* Fix kubectl explain for resources not existing in default version of API group ([#58753](https://github.com/kubernetes/kubernetes/pull/58753), [@soltysh](https://github.com/soltysh))
* Ensure config has been created before attempting to launch ingress. ([#58756](https://github.com/kubernetes/kubernetes/pull/58756), [@wwwtyro](https://github.com/wwwtyro))
* Access to externally managed IP addresses via the kube-apiserver service proxy subresource is no longer allowed by default. This can be re-enabled via the `ServiceProxyAllowExternalIPs` feature gate, but will be disallowed completely in 1.11 ([#57265](https://github.com/kubernetes/kubernetes/pull/57265), [@brendandburns](https://github.com/brendandburns))
* Added support for external cloud providers in kubeadm ([#58259](https://github.com/kubernetes/kubernetes/pull/58259), [@dims](https://github.com/dims))
* rktnetes has been deprecated in favor of rktlet. Please see https://github.com/kubernetes-incubator/rktlet for more information. ([#58418](https://github.com/kubernetes/kubernetes/pull/58418), [@yujuhong](https://github.com/yujuhong))
* Fixes bug finding master replicas in GCE when running multiple Kubernetes clusters ([#58561](https://github.com/kubernetes/kubernetes/pull/58561), [@jesseshieh](https://github.com/jesseshieh))
* Update Calico version to v2.6.6 ([#58482](https://github.com/kubernetes/kubernetes/pull/58482), [@tmjd](https://github.com/tmjd))
* Promoting the apiregistration.k8s.io (aggregation) to GA ([#58393](https://github.com/kubernetes/kubernetes/pull/58393), [@deads2k](https://github.com/deads2k))
* Stability: Make Pod delete event handling of scheduler more robust. ([#58712](https://github.com/kubernetes/kubernetes/pull/58712), [@bsalamat](https://github.com/bsalamat))
* Added support for network spaces in the kubeapi-load-balancer charm ([#58708](https://github.com/kubernetes/kubernetes/pull/58708), [@hyperbolic2346](https://github.com/hyperbolic2346))
* Added support for network spaces in the kubernetes-master charm ([#58704](https://github.com/kubernetes/kubernetes/pull/58704), [@hyperbolic2346](https://github.com/hyperbolic2346))
* update etcd unified version to 3.1.10 ([#54242](https://github.com/kubernetes/kubernetes/pull/54242), [@zouyee](https://github.com/zouyee))
* updates fluentd in fluentd-es-image to fluentd 1.1.0 ([#58525](https://github.com/kubernetes/kubernetes/pull/58525), [@monotek](https://github.com/monotek))
* Support metrics API in `kubectl top` commands. ([#56206](https://github.com/kubernetes/kubernetes/pull/56206), [@brancz](https://github.com/brancz))
* Added support for network spaces in the kubernetes-worker charm ([#58523](https://github.com/kubernetes/kubernetes/pull/58523), [@hyperbolic2346](https://github.com/hyperbolic2346))
* CustomResourceDefinitions: OpenAPI v3 validation schemas containing `$ref`references are no longer permitted (valid references could not be constructed previously because property ids were not permitted either). Before upgrading, ensure CRD definitions do not include those `$ref` fields. ([#58438](https://github.com/kubernetes/kubernetes/pull/58438), [@carlory](https://github.com/carlory))
* Openstack: register metadata.hostname as node name ([#58502](https://github.com/kubernetes/kubernetes/pull/58502), [@dixudx](https://github.com/dixudx))
* Added nginx and default backend images to kubernetes-worker config. ([#58542](https://github.com/kubernetes/kubernetes/pull/58542), [@hyperbolic2346](https://github.com/hyperbolic2346))
* --tls-min-version on kubelet and kube-apiserver allow for configuring minimum TLS versions ([#58528](https://github.com/kubernetes/kubernetes/pull/58528), [@deads2k](https://github.com/deads2k))
* Fixes an issue where the resourceVersion of an object in a DELETE watch event was not the resourceVersion of the delete itself, but of the last update to the object. This could disrupt the ability of clients clients to re-establish watches properly. ([#58547](https://github.com/kubernetes/kubernetes/pull/58547), [@liggitt](https://github.com/liggitt))
* Fixed crash in kubectl cp when path has multiple leading slashes ([#58144](https://github.com/kubernetes/kubernetes/pull/58144), [@tomerf](https://github.com/tomerf))
* kube-apiserver: requests to endpoints handled by unavailable extension API servers (as indicated by an `Available` condition of `false` in the registered APIService) now return `503` errors instead of `404` errors. ([#58070](https://github.com/kubernetes/kubernetes/pull/58070), [@weekface](https://github.com/weekface))
* Correctly handle transient connection reset errors on GET requests from client library. ([#58520](https://github.com/kubernetes/kubernetes/pull/58520), [@porridge](https://github.com/porridge))
* Authentication information for OpenStack cloud provider can now be specified as environment variables ([#58300](https://github.com/kubernetes/kubernetes/pull/58300), [@dims](https://github.com/dims))
* Bump GCE metadata proxy to v0.1.9 to pick up security fixes. ([#58221](https://github.com/kubernetes/kubernetes/pull/58221), [@ihmccreery](https://github.com/ihmccreery))
* - kubeadm now supports CIDR notations in NO_PROXY environment variable ([#53895](https://github.com/kubernetes/kubernetes/pull/53895), [@kad](https://github.com/kad))
* kubeadm now accept `--apiserver-extra-args`, `--controller-manager-extra-args` and `--scheduler-extra-args` to override / specify additional flags for control plane components ([#58080](https://github.com/kubernetes/kubernetes/pull/58080), [@simonferquel](https://github.com/simonferquel))
* Add `--enable-admission-plugin` `--disable-admission-plugin` flags and deprecate `--admission-control`. ([#58123](https://github.com/kubernetes/kubernetes/pull/58123), [@hzxuzhonghu](https://github.com/hzxuzhonghu))
    * Afterwards, don't care about the orders specified in the flags.
* "ExternalTrafficLocalOnly" has been removed from feature gate. It has been a GA feature since v1.7. ([#56948](https://github.com/kubernetes/kubernetes/pull/56948), [@MrHohn](https://github.com/MrHohn))
* GCP: allow a master to not include a metadata concealment firewall rule (if it's not running the metadata proxy). ([#58104](https://github.com/kubernetes/kubernetes/pull/58104), [@ihmccreery](https://github.com/ihmccreery))
* kube-apiserver: fixes loading of `--admission-control-config-file` containing AdmissionConfiguration apiserver.k8s.io/v1alpha1 config object ([#58439](https://github.com/kubernetes/kubernetes/pull/58439), [@liggitt](https://github.com/liggitt))
* Fix issue when using OpenStack config drive for node metadata ([#57561](https://github.com/kubernetes/kubernetes/pull/57561), [@dims](https://github.com/dims))
* Add FSType for CSI volume source to specify filesystems ([#58209](https://github.com/kubernetes/kubernetes/pull/58209), [@NickrenREN](https://github.com/NickrenREN))
* OpenStack cloudprovider: Ensure orphaned routes are removed. ([#56258](https://github.com/kubernetes/kubernetes/pull/56258), [@databus23](https://github.com/databus23))
* Reduce Metrics Server memory requirement ([#58391](https://github.com/kubernetes/kubernetes/pull/58391), [@kawych](https://github.com/kawych))
* Fix a bug affecting nested data volumes such as secret, configmap, etc. ([#57422](https://github.com/kubernetes/kubernetes/pull/57422), [@joelsmith](https://github.com/joelsmith))
* kubectl now enforces required flags at a more fundamental level ([#53631](https://github.com/kubernetes/kubernetes/pull/53631), [@dixudx](https://github.com/dixudx))
* Remove alpha Initializers from kubadm admission control ([#58428](https://github.com/kubernetes/kubernetes/pull/58428), [@dixudx](https://github.com/dixudx))
* Enable ValidatingAdmissionWebhook and MutatingAdmissionWebhook in kubeadm from v1.9 ([#58255](https://github.com/kubernetes/kubernetes/pull/58255), [@dixudx](https://github.com/dixudx))
* Fixed encryption key and encryption provider rotation ([#58375](https://github.com/kubernetes/kubernetes/pull/58375), [@liggitt](https://github.com/liggitt))
* set fsGroup by securityContext.fsGroup in azure file ([#58316](https://github.com/kubernetes/kubernetes/pull/58316), [@andyzhangx](https://github.com/andyzhangx))
* Remove deprecated and unmaintained salt support. kubernetes-salt.tar.gz will no longer be published in the release tarball. ([#58248](https://github.com/kubernetes/kubernetes/pull/58248), [@mikedanese](https://github.com/mikedanese))
* Detach and clear bad disk URI ([#58345](https://github.com/kubernetes/kubernetes/pull/58345), [@rootfs](https://github.com/rootfs))
* Allow version arg in kubeadm upgrade apply to be optional if config file already have version info ([#53220](https://github.com/kubernetes/kubernetes/pull/53220), [@medinatiger](https://github.com/medinatiger))
* feat(fakeclient): push event on watched channel on add/update/delete ([#57504](https://github.com/kubernetes/kubernetes/pull/57504), [@yue9944882](https://github.com/yue9944882))
* Custom resources can now be submitted to and received from the API server in application/yaml format, consistent with other API resources. ([#58260](https://github.com/kubernetes/kubernetes/pull/58260), [@liggitt](https://github.com/liggitt))
* remove spaces from kubectl describe hpa ([#56331](https://github.com/kubernetes/kubernetes/pull/56331), [@shiywang](https://github.com/shiywang))
* fluentd-gcp updated to version 2.0.14. ([#58224](https://github.com/kubernetes/kubernetes/pull/58224), [@zombiezen](https://github.com/zombiezen))
* Instrument the Azure cloud provider for Prometheus monitoring. ([#58204](https://github.com/kubernetes/kubernetes/pull/58204), [@cosmincojocar](https://github.com/cosmincojocar))
* -Add scheduler optimization options, short circuit all predicates if … ([#56926](https://github.com/kubernetes/kubernetes/pull/56926), [@wgliang](https://github.com/wgliang))
* Remove deprecated ContainerVM support from GCE kube-up.  ([#58247](https://github.com/kubernetes/kubernetes/pull/58247), [@mikedanese](https://github.com/mikedanese))
* Remove deprecated kube-push.sh functionality.  ([#58246](https://github.com/kubernetes/kubernetes/pull/58246), [@mikedanese](https://github.com/mikedanese))
* The getSubnetIDForLB() should return subnet id rather than net id. ([#58208](https://github.com/kubernetes/kubernetes/pull/58208), [@FengyunPan](https://github.com/FengyunPan))
* Avoid panic when failing to allocate a Cloud CIDR (aka GCE Alias IP Range).  ([#58186](https://github.com/kubernetes/kubernetes/pull/58186), [@negz](https://github.com/negz))
* Handle Unhealthy devices ([#57266](https://github.com/kubernetes/kubernetes/pull/57266), [@vikaschoudhary16](https://github.com/vikaschoudhary16))
* Expose Metrics Server metrics via /metric endpoint. ([#57456](https://github.com/kubernetes/kubernetes/pull/57456), [@kawych](https://github.com/kawych))
* Remove deprecated container-linux support in gce kube-up.sh.  ([#58098](https://github.com/kubernetes/kubernetes/pull/58098), [@mikedanese](https://github.com/mikedanese))
* openstack cinder detach problem is fixed if nova is shutdowned ([#56846](https://github.com/kubernetes/kubernetes/pull/56846), [@zetaab](https://github.com/zetaab))
* Fixes a possible deadlock preventing quota from being recalculated ([#58107](https://github.com/kubernetes/kubernetes/pull/58107), [@ironcladlou](https://github.com/ironcladlou))
* fluentd-es addon: multiline stacktraces are now grouped into one entry automatically ([#58063](https://github.com/kubernetes/kubernetes/pull/58063), [@monotek](https://github.com/monotek))
* GCE: Allows existing internal load balancers to continue using an outdated subnetwork  ([#57861](https://github.com/kubernetes/kubernetes/pull/57861), [@nicksardo](https://github.com/nicksardo))
* ignore images in used by running containers when GC ([#57020](https://github.com/kubernetes/kubernetes/pull/57020), [@dixudx](https://github.com/dixudx))
* Remove deprecated and unmaintained photon-controller kube-up.sh.  ([#58096](https://github.com/kubernetes/kubernetes/pull/58096), [@mikedanese](https://github.com/mikedanese))
* The kubelet flag to run docker containers with a process namespace that is shared between all containers in a pod is now deprecated and will be replaced by a new field in `v1.Pod` that configures this behavior. ([#58093](https://github.com/kubernetes/kubernetes/pull/58093), [@verb](https://github.com/verb))
* fix device name change issue for azure disk: add remount logic ([#57953](https://github.com/kubernetes/kubernetes/pull/57953), [@andyzhangx](https://github.com/andyzhangx))
* The Kubelet now explicitly registers all of its command-line flags with an internal flagset, which prevents flags from third party libraries from unintentionally leaking into the Kubelet's command-line API. Many unintentionally leaked flags are now marked deprecated, so that users have a chance to migrate away from them before they are removed. One previously leaked flag, --cloud-provider-gce-lb-src-cidrs, was entirely removed from the Kubelet's command-line API, because it is irrelevant to Kubelet operation. ([#57613](https://github.com/kubernetes/kubernetes/pull/57613), [@mtaufen](https://github.com/mtaufen))
* Remove deprecated and unmaintained libvirt-coreos kube-up.sh.  ([#58023](https://github.com/kubernetes/kubernetes/pull/58023), [@mikedanese](https://github.com/mikedanese))
* Remove deprecated and unmaintained windows installer.  ([#58020](https://github.com/kubernetes/kubernetes/pull/58020), [@mikedanese](https://github.com/mikedanese))
* Remove deprecated and unmaintained openstack-heat kube-up.sh.  ([#58021](https://github.com/kubernetes/kubernetes/pull/58021), [@mikedanese](https://github.com/mikedanese))
* Fixes authentication problem faced during various vSphere operations. ([#57978](https://github.com/kubernetes/kubernetes/pull/57978), [@prashima](https://github.com/prashima))
* fluentd-gcp updated to version 2.0.13. ([#57789](https://github.com/kubernetes/kubernetes/pull/57789), [@x13n](https://github.com/x13n))
* Add support for cloud-controller-manager in local-up-cluster.sh ([#57757](https://github.com/kubernetes/kubernetes/pull/57757), [@dims](https://github.com/dims))
* Update CSI spec dependency to point to v0.1.0 tag ([#57989](https://github.com/kubernetes/kubernetes/pull/57989), [@NickrenREN](https://github.com/NickrenREN))
* Update kube-dns to Version 1.14.8 that includes only small changes to how Prometheus metrics are collected. ([#57918](https://github.com/kubernetes/kubernetes/pull/57918), [@rramkumar1](https://github.com/rramkumar1))
* Add proxy_read_timeout flag to kubeapi_load_balancer charm. ([#57926](https://github.com/kubernetes/kubernetes/pull/57926), [@wwwtyro](https://github.com/wwwtyro))
* Adding support for Block Volume type to rbd plugin. ([#56651](https://github.com/kubernetes/kubernetes/pull/56651), [@sbezverk](https://github.com/sbezverk))
* Fixes a bug in Heapster deployment for google sink. ([#57902](https://github.com/kubernetes/kubernetes/pull/57902), [@kawych](https://github.com/kawych))
* Forbid unnamed contexts in kubeconfigs. ([#56769](https://github.com/kubernetes/kubernetes/pull/56769), [@dixudx](https://github.com/dixudx))
* Upgrade to etcd client 3.2.13 and grpc 1.7.5 to improve HA etcd cluster stability. ([#57480](https://github.com/kubernetes/kubernetes/pull/57480), [@jpbetz](https://github.com/jpbetz))
* Default scheduler code is moved out of the plugin directory. ([#57852](https://github.com/kubernetes/kubernetes/pull/57852), [@misterikkit](https://github.com/misterikkit))
    * plugin/pkg/scheduler -> pkg/scheduler
    * plugin/cmd/kube-scheduler -> cmd/kube-scheduler
* Bump metadata proxy version to v0.1.7 to pick up security fix. ([#57762](https://github.com/kubernetes/kubernetes/pull/57762), [@ihmccreery](https://github.com/ihmccreery))
* HugePages feature is beta ([#56939](https://github.com/kubernetes/kubernetes/pull/56939), [@derekwaynecarr](https://github.com/derekwaynecarr))
* GCE: support passing kube-scheduler policy config via SCHEDULER_POLICY_CONFIG ([#57425](https://github.com/kubernetes/kubernetes/pull/57425), [@yguo0905](https://github.com/yguo0905))
* Returns an error for non overcommitable resources if they don't have limit field set in container spec. ([#57170](https://github.com/kubernetes/kubernetes/pull/57170), [@jiayingz](https://github.com/jiayingz))
* Update defaultbackend image to 1.4 and deployment apiVersion to apps/v1 ([#57866](https://github.com/kubernetes/kubernetes/pull/57866), [@zouyee](https://github.com/zouyee))
* kubeadm: set kube-apiserver advertise address using downward API ([#56084](https://github.com/kubernetes/kubernetes/pull/56084), [@andrewsykim](https://github.com/andrewsykim))
* CDK nginx ingress is now handled via a daemon set. ([#57530](https://github.com/kubernetes/kubernetes/pull/57530), [@hyperbolic2346](https://github.com/hyperbolic2346))
* The kubelet uses a new release 3.1 of the pause container with the Docker runtime. This version will clean up orphaned zombie processes that it inherits. ([#57517](https://github.com/kubernetes/kubernetes/pull/57517), [@verb](https://github.com/verb))
* Allow kubectl set image|env on a cronjob ([#57742](https://github.com/kubernetes/kubernetes/pull/57742), [@soltysh](https://github.com/soltysh))
* Move local PV negative scheduling tests to integration ([#57570](https://github.com/kubernetes/kubernetes/pull/57570), [@sbezverk](https://github.com/sbezverk))
* fix azure disk not available issue when device name changed ([#57549](https://github.com/kubernetes/kubernetes/pull/57549), [@andyzhangx](https://github.com/andyzhangx))
* Only create Privileged PSP binding during e2e tests if RBAC is enabled. ([#56382](https://github.com/kubernetes/kubernetes/pull/56382), [@mikkeloscar](https://github.com/mikkeloscar))
* RBAC: The system:kubelet-api-admin cluster role can be used to grant full access to the kubelet API ([#57128](https://github.com/kubernetes/kubernetes/pull/57128), [@liggitt](https://github.com/liggitt))
* Allow kubernetes components to react to SIGTERM signal and shutdown gracefully. ([#57756](https://github.com/kubernetes/kubernetes/pull/57756), [@mborsz](https://github.com/mborsz))
* ignore nonexistent ns net file error when deleting container network in case a retry ([#57697](https://github.com/kubernetes/kubernetes/pull/57697), [@dixudx](https://github.com/dixudx))
* check psp HostNetwork in DenyEscalatingExec admission controller. ([#56839](https://github.com/kubernetes/kubernetes/pull/56839), [@hzxuzhonghu](https://github.com/hzxuzhonghu))
* The alpha `--init-config-dir` flag has been removed. Instead, use the `--config` flag to reference a kubelet configuration file directly. ([#57624](https://github.com/kubernetes/kubernetes/pull/57624), [@mtaufen](https://github.com/mtaufen))
* Add cache for VM get operation in azure cloud provider ([#57432](https://github.com/kubernetes/kubernetes/pull/57432), [@karataliu](https://github.com/karataliu))
* Fix garbage collection when the controller-manager uses --leader-elect=false ([#57340](https://github.com/kubernetes/kubernetes/pull/57340), [@jmcmeek](https://github.com/jmcmeek))
* iSCSI sessions managed by kubernetes will now explicitly set startup.mode to 'manual' to ([#57475](https://github.com/kubernetes/kubernetes/pull/57475), [@stmcginnis](https://github.com/stmcginnis))
    * prevent automatic login after node failure recovery. This is the default open-iscsi mode, so
    * this change will only impact users who have changed their startup.mode to be 'automatic'
    * in /etc/iscsi/iscsid.conf.
* Configurable liveness probe initial delays for etcd and kube-apiserver in GCE ([#57749](https://github.com/kubernetes/kubernetes/pull/57749), [@wojtek-t](https://github.com/wojtek-t))
* Fixed garbage collection hang ([#57503](https://github.com/kubernetes/kubernetes/pull/57503), [@liggitt](https://github.com/liggitt))
* Fixes controller manager crash in certain vSphere cloud provider environment. ([#57286](https://github.com/kubernetes/kubernetes/pull/57286), [@rohitjogvmw](https://github.com/rohitjogvmw))
* Remove useInstanceMetadata parameter from Azure cloud provider. ([#57647](https://github.com/kubernetes/kubernetes/pull/57647), [@feiskyer](https://github.com/feiskyer))
* Support multiple scale sets in Azure cloud provider. ([#57543](https://github.com/kubernetes/kubernetes/pull/57543), [@feiskyer](https://github.com/feiskyer))
* GCE: Fixes ILB creation on automatic networks with manually created subnetworks. ([#57351](https://github.com/kubernetes/kubernetes/pull/57351), [@nicksardo](https://github.com/nicksardo))
* Improve scheduler performance of MatchInterPodAffinity predicate. ([#57476](https://github.com/kubernetes/kubernetes/pull/57476), [@misterikkit](https://github.com/misterikkit))
* Improve scheduler performance of MatchInterPodAffinity predicate. ([#57477](https://github.com/kubernetes/kubernetes/pull/57477), [@misterikkit](https://github.com/misterikkit))
* Improve scheduler performance of MatchInterPodAffinity predicate. ([#57478](https://github.com/kubernetes/kubernetes/pull/57478), [@misterikkit](https://github.com/misterikkit))
* Allow use resource ID to specify public IP address in azure_loadbalancer ([#53557](https://github.com/kubernetes/kubernetes/pull/53557), [@yolo3301](https://github.com/yolo3301))
* Fixes a bug where if an error was returned that was not an `autorest.DetailedError` we would return `"not found", nil` which caused nodes to go to `NotReady` state. ([#57484](https://github.com/kubernetes/kubernetes/pull/57484), [@brendandburns](https://github.com/brendandburns))
* Add the path '/version/' to the `system:discovery` cluster role. ([#57368](https://github.com/kubernetes/kubernetes/pull/57368), [@brendandburns](https://github.com/brendandburns))
* Fixes issue creating docker secrets with kubectl 1.9 for accessing docker private registries. ([#57463](https://github.com/kubernetes/kubernetes/pull/57463), [@dims](https://github.com/dims))
* adding predicates ordering for the kubernetes scheduler. ([#57168](https://github.com/kubernetes/kubernetes/pull/57168), [@yastij](https://github.com/yastij))
* Free up CPU and memory requested but unused by Metrics Server Pod Nanny. ([#57252](https://github.com/kubernetes/kubernetes/pull/57252), [@kawych](https://github.com/kawych))
* The alpha Accelerators feature gate is deprecated and will be removed in v1.11. Please use device plugins instead. They can be enabled using the DevicePlugins feature gate. ([#57384](https://github.com/kubernetes/kubernetes/pull/57384), [@mindprince](https://github.com/mindprince))
* Fixed dynamic provisioning of GCE PDs to round to the next GB instead of GiB ([#56600](https://github.com/kubernetes/kubernetes/pull/56600), [@edisonxiang](https://github.com/edisonxiang))
* Separate loop and plugin control ([#52371](https://github.com/kubernetes/kubernetes/pull/52371), [@cheftako](https://github.com/cheftako))
* Use old dns-ip mechanism with older cdk-addons. ([#57403](https://github.com/kubernetes/kubernetes/pull/57403), [@wwwtyro](https://github.com/wwwtyro))
* Retry 'connection refused' errors when setting up clusters on GCE. ([#57394](https://github.com/kubernetes/kubernetes/pull/57394), [@mborsz](https://github.com/mborsz))
* Upgrade to etcd client 3.2.11 and grpc 1.7.5 to improve HA etcd cluster stability. ([#57160](https://github.com/kubernetes/kubernetes/pull/57160), [@jpbetz](https://github.com/jpbetz))
* Added the ability to select pods in a chosen node to be drained, based on given pod label-selector ([#56864](https://github.com/kubernetes/kubernetes/pull/56864), [@juanvallejo](https://github.com/juanvallejo))
* Wait for kubedns to be ready when collecting the cluster IP. ([#57337](https://github.com/kubernetes/kubernetes/pull/57337), [@wwwtyro](https://github.com/wwwtyro))
* Use "k8s.gcr.io" for container images rather than "gcr.io/google_containers".  This is just a redirect, for now, so should not impact anyone materially.   ([#54174](https://github.com/kubernetes/kubernetes/pull/54174), [@thockin](https://github.com/thockin))
    * Documentation and tools should all convert to the new name. Users should take note of this in case they see this new name in the system.
* Fix ipvs proxier nodeport eth* assumption ([#56685](https://github.com/kubernetes/kubernetes/pull/56685), [@m1093782566](https://github.com/m1093782566))



# v1.10.0-alpha.1
||||||| merged common ancestors
* Log error of failed healthz check ([#53048](https://github.com/kubernetes/kubernetes/pull/53048), [@mrIncompetent](https://github.com/mrIncompetent))
* fix azure file mount limit issue on windows due to using drive letter ([#53629](https://github.com/kubernetes/kubernetes/pull/53629), [@andyzhangx](https://github.com/andyzhangx))
* Update AWS SDK to 1.12.7 ([#53561](https://github.com/kubernetes/kubernetes/pull/53561), [@justinsb](https://github.com/justinsb))
* The `kubernetes.io/created-by` annotation is no longer added to controller-created objects. Use the  `metadata.ownerReferences` item that has `controller` set to `true` to determine which controller, if any, owns an object. ([#54445](https://github.com/kubernetes/kubernetes/pull/54445), [@crimsonfaith91](https://github.com/crimsonfaith91))
* Fix overlay2 container disk metrics for Docker and CRI-O ([#54827](https://github.com/kubernetes/kubernetes/pull/54827), [@dashpole](https://github.com/dashpole))
* Fix iptables FORWARD policy for Docker 1.13 in kubernetes-worker charm ([#54796](https://github.com/kubernetes/kubernetes/pull/54796), [@Cynerva](https://github.com/Cynerva))
* Fix `kubeadm upgrade plan` for offline operation: ignore errors when trying to fetch latest versions from dl.k8s.io ([#54016](https://github.com/kubernetes/kubernetes/pull/54016), [@praseodym](https://github.com/praseodym))
* fluentd now supports CRI log format. ([#54777](https://github.com/kubernetes/kubernetes/pull/54777), [@Random-Liu](https://github.com/Random-Liu))
* Validate that PersistentVolumeSource is not changed during PV Update ([#54761](https://github.com/kubernetes/kubernetes/pull/54761), [@ianchakeres](https://github.com/ianchakeres))
* If you are using the cloud provider API to determine the external host address of the apiserver, set --external-hostname explicitly instead. The cloud provider detection has been deprecated and will be removed in the future ([#54516](https://github.com/kubernetes/kubernetes/pull/54516), [@dims](https://github.com/dims))
* Fixes discovery information for scale subresources in the apps API group ([#54683](https://github.com/kubernetes/kubernetes/pull/54683), [@liggitt](https://github.com/liggitt))
* Optimize Repeated registration of AlgorithmProvider when ApplyFeatureGates ([#54047](https://github.com/kubernetes/kubernetes/pull/54047), [@kuramal](https://github.com/kuramal))
* `kubectl get` will by default fetch large lists of resources in chunks of up to 500 items rather than requesting all resources up front from the server. This reduces the perceived latency of managing large clusters since the server returns the first set of results to the client much more quickly.  A new flag `--chunk-size=SIZE` may be used to alter the number of items or disable this feature when `0` is passed.  This is a beta feature. ([#53768](https://github.com/kubernetes/kubernetes/pull/53768), [@smarterclayton](https://github.com/smarterclayton))
* Add a new feature gate for enabling an alpha annotation which, if present, excludes the annotated node from being added to a service load balancers. ([#54644](https://github.com/kubernetes/kubernetes/pull/54644), [@brendandburns](https://github.com/brendandburns))
* Implement graceful shutdown of the kube-apiserver by waiting for open connections to finish before exiting. Moreover, the audit backend will stop dropping events on shutdown. ([#53695](https://github.com/kubernetes/kubernetes/pull/53695), [@hzxuzhonghu](https://github.com/hzxuzhonghu))
* fix warning messages due to GetMountRefs func not implemented in windows ([#52401](https://github.com/kubernetes/kubernetes/pull/52401), [@andyzhangx](https://github.com/andyzhangx))
* Object count quotas supported on all standard resources using `count/<resource>.<group>` syntax ([#54320](https://github.com/kubernetes/kubernetes/pull/54320), [@derekwaynecarr](https://github.com/derekwaynecarr))
* Add openssh-client back into the hyperkube image. This allows the gitRepo volume plugin to work properly. ([#54250](https://github.com/kubernetes/kubernetes/pull/54250), [@ixdy](https://github.com/ixdy))
* Bump version of all prometheus-to-sd images to v0.2.2. ([#54635](https://github.com/kubernetes/kubernetes/pull/54635), [@loburm](https://github.com/loburm))
* [fluentd-gcp addon] Fluentd now runs in its own network, not in the host one. ([#54395](https://github.com/kubernetes/kubernetes/pull/54395), [@crassirostris](https://github.com/crassirostris))
* fix azure storage account num exhausting issue ([#54459](https://github.com/kubernetes/kubernetes/pull/54459), [@andyzhangx](https://github.com/andyzhangx))
* Add Windows support to the system verification check ([#53730](https://github.com/kubernetes/kubernetes/pull/53730), [@bsteciuk](https://github.com/bsteciuk))
* allow windows mount path ([#51240](https://github.com/kubernetes/kubernetes/pull/51240), [@andyzhangx](https://github.com/andyzhangx))
* Development of Kubernetes Federation has moved to github.com/kubernetes/federation.  This move out of tree also means that Federation will begin releasing separately from Kubernetes.  The impact of this is Federation-specific behavior will no longer be included in kubectl, kubefed will no longer be released as part of Kubernetes, and the Federation servers will no longer be included in the hyperkube binary and image. ([#53816](https://github.com/kubernetes/kubernetes/pull/53816), [@marun](https://github.com/marun))
* Metadata concealment on GCE is now controlled by the `ENABLE_METADATA_CONCEALMENT` env var.  See cluster/gce/config-default.sh for more info. ([#54150](https://github.com/kubernetes/kubernetes/pull/54150), [@ihmccreery](https://github.com/ihmccreery))
* Fixed a bug which is causes kube-apiserver to not run without specifying service-cluster-ip-range ([#52870](https://github.com/kubernetes/kubernetes/pull/52870), [@jennybuckley](https://github.com/jennybuckley))
* the generic admission webhook is now available in the generic apiserver ([#54513](https://github.com/kubernetes/kubernetes/pull/54513), [@deads2k](https://github.com/deads2k))
* ScaleIO persistent volumes now support referencing a secret in a namespace other than the bound persistent volume claim's namespace; this is controlled during provisioning with the `secretNamespace` storage class parameter; StoragePool and ProtectionDomain attributes no longer defaults to the value `default` ([#54013](https://github.com/kubernetes/kubernetes/pull/54013), [@vladimirvivien](https://github.com/vladimirvivien))
* Feature gates now check minimum versions ([#54539](https://github.com/kubernetes/kubernetes/pull/54539), [@jamiehannaford](https://github.com/jamiehannaford))
* fix azure pv crash due to volumeSource.ReadOnly value nil ([#54607](https://github.com/kubernetes/kubernetes/pull/54607), [@andyzhangx](https://github.com/andyzhangx))
* Fix an issue where pods were briefly transitioned to a "Pending" state during the deletion process. ([#54593](https://github.com/kubernetes/kubernetes/pull/54593), [@dashpole](https://github.com/dashpole))
* move getMaxVols function to predicates.go and add some NewVolumeCountPredicate funcs ([#51783](https://github.com/kubernetes/kubernetes/pull/51783), [@jiulongzaitian](https://github.com/jiulongzaitian))
* Remove the LbaasV1 of OpenStack cloud provider, currently only support LbaasV2. ([#52717](https://github.com/kubernetes/kubernetes/pull/52717), [@FengyunPan](https://github.com/FengyunPan))
* generic webhook admission now takes a config file which describes how to authenticate to webhook servers ([#54414](https://github.com/kubernetes/kubernetes/pull/54414), [@deads2k](https://github.com/deads2k))
* The NodeController will not support kubelet 1.2. ([#48996](https://github.com/kubernetes/kubernetes/pull/48996), [@k82cn](https://github.com/k82cn))
* - fluentd-gcp runs with a dedicated fluentd-gcp service account ([#54175](https://github.com/kubernetes/kubernetes/pull/54175), [@tallclair](https://github.com/tallclair))
    * - Stop mounting the host certificates into fluentd's prometheus-to-sd container
* fix azure disk mount failure on coreos and some other distros ([#54334](https://github.com/kubernetes/kubernetes/pull/54334), [@andyzhangx](https://github.com/andyzhangx))
* Allow GCE users to configure the service account made available on their nodes ([#52868](https://github.com/kubernetes/kubernetes/pull/52868), [@ihmccreery](https://github.com/ihmccreery))
* Load kernel modules automatically inside a kube-proxy pod ([#52003](https://github.com/kubernetes/kubernetes/pull/52003), [@vfreex](https://github.com/vfreex))
* kube-apiserver: `--ssh-user` and `--ssh-keyfile` are now deprecated and will be removed in a future release. Users of SSH tunnel functionality used in Google Container Engine for the Master -> Cluster communication should plan to transition to alternate methods for bridging master and node networks. ([#54433](https://github.com/kubernetes/kubernetes/pull/54433), [@dims](https://github.com/dims))
* Fix hyperkube kubelet --experimental-dockershim ([#54508](https://github.com/kubernetes/kubernetes/pull/54508), [@ivan4th](https://github.com/ivan4th))
* Fix clustered datastore name to be absolute. ([#54438](https://github.com/kubernetes/kubernetes/pull/54438), [@pshahzeb](https://github.com/pshahzeb))
* Fix for service controller so that it won't retry on doNotRetry service update failure. ([#54184](https://github.com/kubernetes/kubernetes/pull/54184), [@MrHohn](https://github.com/MrHohn))
* Add support for RBAC support to Kubernetes via Juju ([#53820](https://github.com/kubernetes/kubernetes/pull/53820), [@ktsakalozos](https://github.com/ktsakalozos))
* RBD Persistent Volume Sources can now reference User's Secret in namespaces other than the namespace of the bound Persistent Volume Claim ([#54302](https://github.com/kubernetes/kubernetes/pull/54302), [@sbezverk](https://github.com/sbezverk))
* Apiserver proxy rewrites URL when service returns absolute path with request's host. ([#52556](https://github.com/kubernetes/kubernetes/pull/52556), [@roycaihw](https://github.com/roycaihw))
* Logging cleanups ([#54443](https://github.com/kubernetes/kubernetes/pull/54443), [@bowei](https://github.com/bowei))
        * Updates kube-dns to use client-go 3
        * Updates containers to use alpine as the base image on all platforms
        * Adds support for IPv6
* add `--raw` to `kubectl create` to POST using the normal transport ([#54245](https://github.com/kubernetes/kubernetes/pull/54245), [@deads2k](https://github.com/deads2k))
* Remove the --network-plugin-dir flag. ([#53564](https://github.com/kubernetes/kubernetes/pull/53564), [@supereagle](https://github.com/supereagle))
* Introduces a polymorphic scale client, allowing HorizontalPodAutoscalers to properly function on scalable resources in any API group. ([#53743](https://github.com/kubernetes/kubernetes/pull/53743), [@DirectXMan12](https://github.com/DirectXMan12))
* Add PodDisruptionBudget to scheduler cache. ([#53914](https://github.com/kubernetes/kubernetes/pull/53914), [@bsalamat](https://github.com/bsalamat))
* - API machinery's httpstream/spdy calls now support CIDR notation for NO_PROXY ([#54413](https://github.com/kubernetes/kubernetes/pull/54413), [@kad](https://github.com/kad))
* Added option lb-provider to OpenStack cloud provider config ([#54176](https://github.com/kubernetes/kubernetes/pull/54176), [@gonzolino](https://github.com/gonzolino))
* Allow for configuring etcd hostname in the manifest ([#54403](https://github.com/kubernetes/kubernetes/pull/54403), [@wojtek-t](https://github.com/wojtek-t))
* - kubeadm  will warn users if access to IP ranges for Pods or Services will be done via HTTP proxy. ([#52792](https://github.com/kubernetes/kubernetes/pull/52792), [@kad](https://github.com/kad))
* Resolves forbidden error when accessing replicasets and daemonsets via the apps API group ([#54309](https://github.com/kubernetes/kubernetes/pull/54309), [@liggitt](https://github.com/liggitt))
* Cluster Autoscaler 1.0.1 ([#54298](https://github.com/kubernetes/kubernetes/pull/54298), [@mwielgus](https://github.com/mwielgus))
* secret data containing Docker registry auth objects is now generated using the config.json format ([#53916](https://github.com/kubernetes/kubernetes/pull/53916), [@juanvallejo](https://github.com/juanvallejo))
* Added support for SAN entries in the master node certificate via juju kubernetes-master config. ([#54234](https://github.com/kubernetes/kubernetes/pull/54234), [@hyperbolic2346](https://github.com/hyperbolic2346))
* support imagePullSecrets and imagePullPolicy in kubefed init ([#50740](https://github.com/kubernetes/kubernetes/pull/50740), [@dixudx](https://github.com/dixudx))
* update gRPC to v1.6.0 to pick up data race fix grpc/grpc-go#1316  ([#53128](https://github.com/kubernetes/kubernetes/pull/53128), [@dixudx](https://github.com/dixudx))
* admission webhook registrations without a specific failure policy default to failing closed. ([#54162](https://github.com/kubernetes/kubernetes/pull/54162), [@deads2k](https://github.com/deads2k))
* Device plugin Alpha API no longer supports returning artifacts per device as part of AllocateResponse. ([#53031](https://github.com/kubernetes/kubernetes/pull/53031), [@vishh](https://github.com/vishh))
* admission webhook registration now allows URL paths ([#54145](https://github.com/kubernetes/kubernetes/pull/54145), [@deads2k](https://github.com/deads2k))
* The Kubelet's --enable-custom-metrics flag is now marked deprecated. ([#54154](https://github.com/kubernetes/kubernetes/pull/54154), [@mtaufen](https://github.com/mtaufen))
* Use multi-arch busybox image for e2e ([#54034](https://github.com/kubernetes/kubernetes/pull/54034), [@dixudx](https://github.com/dixudx))
* sample-controller: add example CRD controller ([#52753](https://github.com/kubernetes/kubernetes/pull/52753), [@munnerz](https://github.com/munnerz))
* RBAC PolicyRules now allow resource=`*/<subresource>` to cover `any-resource/<subresource>`.   For example, `*/scale` covers `replicationcontroller/scale`. ([#53722](https://github.com/kubernetes/kubernetes/pull/53722), [@deads2k](https://github.com/deads2k))
* Upgrade to go1.9 ([#51375](https://github.com/kubernetes/kubernetes/pull/51375), [@cblecker](https://github.com/cblecker))
* Webhook always retries connection reset error. ([#53947](https://github.com/kubernetes/kubernetes/pull/53947), [@crassirostris](https://github.com/crassirostris))
* fix PV Recycle failed on non-amd64 platfrom ([#53958](https://github.com/kubernetes/kubernetes/pull/53958), [@dixudx](https://github.com/dixudx))
* Verbose option is added to each status function in CRI. Container runtime could return extra information in status response for debugging. ([#53965](https://github.com/kubernetes/kubernetes/pull/53965), [@Random-Liu](https://github.com/Random-Liu))
* Fixed log fallback termination messages when using docker with journald log driver ([#52503](https://github.com/kubernetes/kubernetes/pull/52503), [@joelsmith](https://github.com/joelsmith))
* falls back to parse Docker runtime version as generic if not semver ([#54040](https://github.com/kubernetes/kubernetes/pull/54040), [@dixudx](https://github.com/dixudx))
* kubelet: prevent removal of default labels from Node API objects on startup ([#54073](https://github.com/kubernetes/kubernetes/pull/54073), [@liggitt](https://github.com/liggitt))
* Change scheduler to skip pod with updates only on pod annotations ([#54008](https://github.com/kubernetes/kubernetes/pull/54008), [@yguo0905](https://github.com/yguo0905))
* PodSecurityPolicy: when multiple policies allow a submitted pod, priority is given to ones which do not require any fields in the pod spec to be defaulted. If the pod must be defaulted, the first policy (ordered by name) that allows the pod is used. ([#52849](https://github.com/kubernetes/kubernetes/pull/52849), [@liggitt](https://github.com/liggitt))
* Control HPA tolerance through the `horizontal-pod-autoscaler-tolerance` flag. ([#52275](https://github.com/kubernetes/kubernetes/pull/52275), [@mattjmcnaughton](https://github.com/mattjmcnaughton))
* bump CNI to v0.6.0 ([#51250](https://github.com/kubernetes/kubernetes/pull/51250), [@dixudx](https://github.com/dixudx))
* Improve resilience by annotating kube-dns addon with podAntiAffinity to prefer scheduling on different nodes. ([#52193](https://github.com/kubernetes/kubernetes/pull/52193), [@StevenACoffman](https://github.com/StevenACoffman))
* Azure cloudprovider: Fix controller manager crash issue on a manually created k8s cluster. ([#53694](https://github.com/kubernetes/kubernetes/pull/53694), [@andyzhangx](https://github.com/andyzhangx))
* Enable Priority admission control in kubeadm.  ([#53175](https://github.com/kubernetes/kubernetes/pull/53175), [@andrewsykim](https://github.com/andrewsykim))
* Add --no-negcache flag to kube-dns to prevent caching of NXDOMAIN responses. ([#53604](https://github.com/kubernetes/kubernetes/pull/53604), [@cblecker](https://github.com/cblecker))
* kubelet provides more specific events when unable to sync pod ([#53857](https://github.com/kubernetes/kubernetes/pull/53857), [@derekwaynecarr](https://github.com/derekwaynecarr))
* Kubelet evictions take pod priority into account ([#53542](https://github.com/kubernetes/kubernetes/pull/53542), [@dashpole](https://github.com/dashpole))
* Adds a new controller which automatically cleans up Certificate Signing Requests that are ([#51840](https://github.com/kubernetes/kubernetes/pull/51840), [@jcbsmpsn](https://github.com/jcbsmpsn))
    * Approved and Issued, or Denied.
* Optimize random string generator to avoid multiple locks & use bit-masking ([#53720](https://github.com/kubernetes/kubernetes/pull/53720), [@shyamjvs](https://github.com/shyamjvs))
* update cluster printer to enable --show-labels ([#53771](https://github.com/kubernetes/kubernetes/pull/53771), [@dixudx](https://github.com/dixudx))
* add RequestReceivedTimestamp and StageTimestamp to audit event ([#52981](https://github.com/kubernetes/kubernetes/pull/52981), [@CaoShuFeng](https://github.com/CaoShuFeng))
* Deprecation: The flag `etcd-quorum-read ` of kube-apiserver is deprecated and the ability to switch off quorum read will be removed in a future release. ([#53795](https://github.com/kubernetes/kubernetes/pull/53795), [@xiangpengzhao](https://github.com/xiangpengzhao))
* Use separate client for leader election in scheduler to avoid starving leader election by regular scheduler operations. ([#53793](https://github.com/kubernetes/kubernetes/pull/53793), [@wojtek-t](https://github.com/wojtek-t))
* Support autoprobing node-security-group for openstack cloud provider, Support multiple Security Groups for cluster's nodes. ([#50836](https://github.com/kubernetes/kubernetes/pull/50836), [@FengyunPan](https://github.com/FengyunPan))
* fix a bug where disk pressure could trigger prematurely when using overlay2 ([#53684](https://github.com/kubernetes/kubernetes/pull/53684), [@dashpole](https://github.com/dashpole))
* "kubectl cp" updated to honor destination names  ([#51215](https://github.com/kubernetes/kubernetes/pull/51215), [@juanvallejo](https://github.com/juanvallejo))
* kubeadm: Strip bootstrap tokens from the `kubeadm-config` ConfigMap ([#53559](https://github.com/kubernetes/kubernetes/pull/53559), [@fabriziopandini](https://github.com/fabriziopandini))
* Skip podpreset test if the alpha feature setttings/v1alpha1 is disabled ([#53080](https://github.com/kubernetes/kubernetes/pull/53080), [@jennybuckley](https://github.com/jennybuckley))
* Log when node is successfully initialized by Cloud Controller Manager ([#53517](https://github.com/kubernetes/kubernetes/pull/53517), [@andrewsykim](https://github.com/andrewsykim))
* apiserver: --etcd-quorum-read now defaults to true, to ensure correct operation with HA etcd clusters ([#53717](https://github.com/kubernetes/kubernetes/pull/53717), [@liggitt](https://github.com/liggitt))
* The Kubelet's feature gates are now specified as a map when provided via a JSON or YAML KubeletConfiguration, rather than as a string of key-value pairs. ([#53025](https://github.com/kubernetes/kubernetes/pull/53025), [@mtaufen](https://github.com/mtaufen))
* Address a bug which allowed the horizontal pod autoscaler to allocate `desiredReplicas` > `maxReplicas` in certain instances. ([#53690](https://github.com/kubernetes/kubernetes/pull/53690), [@mattjmcnaughton](https://github.com/mattjmcnaughton))
* Horizontal pod autoscaler uses REST clients through the kube-aggregator instead of the legacy client through the API server proxy. ([#53205](https://github.com/kubernetes/kubernetes/pull/53205), [@kawych](https://github.com/kawych))
* Fix to prevent downward api change break on older versions ([#53673](https://github.com/kubernetes/kubernetes/pull/53673), [@timothysc](https://github.com/timothysc))
* API chunking via the `limit` and `continue` request parameters is promoted to beta in this release.  Client libraries using the Informer or ListWatch types will automatically opt in to chunking. ([#52949](https://github.com/kubernetes/kubernetes/pull/52949), [@smarterclayton](https://github.com/smarterclayton))
* GCE: Bump GLBC version to [0.9.7](https://github.com/kubernetes/ingress/releases/tag/0.9.7). ([#53625](https://github.com/kubernetes/kubernetes/pull/53625), [@nikhiljindal](https://github.com/nikhiljindal))
* kubelet's `--cloud-provider` flag no longer defaults to "auto-detect".  If you want cloud-provider support in kubelet, you must set a specific cloud-provider explicitly. ([#53573](https://github.com/kubernetes/kubernetes/pull/53573), [@dims](https://github.com/dims))
* Ignore extended resources that are not registered with kubelet during container resource allocation. ([#53547](https://github.com/kubernetes/kubernetes/pull/53547), [@jiayingz](https://github.com/jiayingz))
* kubectl top pod and node should sort by namespace / name so that results don't jump around. ([#53560](https://github.com/kubernetes/kubernetes/pull/53560), [@dixudx](https://github.com/dixudx))
* Added --dry-run option to `kubectl drain` ([#52440](https://github.com/kubernetes/kubernetes/pull/52440), [@juanvallejo](https://github.com/juanvallejo))
* Fix a bug that prevents client-go metrics from being registered in prometheus in multiple components. ([#53434](https://github.com/kubernetes/kubernetes/pull/53434), [@crassirostris](https://github.com/crassirostris))
* Adjust batching audit webhook default parameters: increase queue size, batch size, and initial backoff. Add throttling to the batching audit webhook. Default rate limit is 10 QPS. ([#53417](https://github.com/kubernetes/kubernetes/pull/53417), [@crassirostris](https://github.com/crassirostris))
* Added integration test for TaintNodeByCondition. ([#53184](https://github.com/kubernetes/kubernetes/pull/53184), [@k82cn](https://github.com/k82cn))
* Add API version apps/v1, and bump DaemonSet to apps/v1 ([#53278](https://github.com/kubernetes/kubernetes/pull/53278), [@janetkuo](https://github.com/janetkuo))
* Change `kubeadm create token` to default to the group that almost everyone will want to use.  The group is system:bootstrappers:kubeadm:default-node-token and is the group that kubeadm sets up, via an RBAC binding, for auto-approval (system:certificates.k8s.io:certificatesigningrequests:nodeclient). ([#53512](https://github.com/kubernetes/kubernetes/pull/53512), [@jbeda](https://github.com/jbeda))
* Using OpenStack service catalog to do version detection ([#53115](https://github.com/kubernetes/kubernetes/pull/53115), [@FengyunPan](https://github.com/FengyunPan))
* Fix metrics API group name in audit configuration ([#53493](https://github.com/kubernetes/kubernetes/pull/53493), [@piosz](https://github.com/piosz))
* GCE: Fixes ILB sync on legacy networks and auto networks with unique subnet names ([#53410](https://github.com/kubernetes/kubernetes/pull/53410), [@nicksardo](https://github.com/nicksardo))
* outputs `<none>` for columns specified by `-o custom-columns` but not found in object ([#51750](https://github.com/kubernetes/kubernetes/pull/51750), [@jianhuiz](https://github.com/jianhuiz))
* Metrics were added to network plugin to report latency of CNI operations ([#53446](https://github.com/kubernetes/kubernetes/pull/53446), [@sjenning](https://github.com/sjenning))
* GCE: Fix issue deleting internal load balancers when the firewall resource may not exist. ([#53450](https://github.com/kubernetes/kubernetes/pull/53450), [@nicksardo](https://github.com/nicksardo))
* Custom resources served through CustomResourceDefinition now support field selectors for `metadata.name` and `metadata.namespace`. ([#53345](https://github.com/kubernetes/kubernetes/pull/53345), [@ncdc](https://github.com/ncdc))
* Add generate-groups.sh and generate-internal-groups.sh to k8s.io/code-generator to easily run generators against CRD or User API Server types. ([#52186](https://github.com/kubernetes/kubernetes/pull/52186), [@sttts](https://github.com/sttts))
* kubelet `--cert-dir` now defaults to `/var/lib/kubelet/pki`, in order to ensure bootstrapped and rotated certificates persist beyond a reboot. resolves an issue in kubeadm with false-positive `/var/lib/kubelet is not empty` message during pre-flight checks ([#53317](https://github.com/kubernetes/kubernetes/pull/53317), [@liggitt](https://github.com/liggitt))
* Fix multi-attach error spam in logs and events ([#53401](https://github.com/kubernetes/kubernetes/pull/53401), [@gnufied](https://github.com/gnufied))
* Use `not-ready` to replace `notReady` in node condition taint keys. ([#51266](https://github.com/kubernetes/kubernetes/pull/51266), [@resouer](https://github.com/resouer))
* Support completion for --clusterrole of kubectl create clusterrolebinding ([#48267](https://github.com/kubernetes/kubernetes/pull/48267), [@superbrothers](https://github.com/superbrothers))
* Don't remove extended resource capacities that are not registered with kubelet from node status. ([#53353](https://github.com/kubernetes/kubernetes/pull/53353), [@jiayingz](https://github.com/jiayingz))
* Kubectl: Remove swagger 1.2 validation. Also removes options `--use-openapi` and `--schema-cache-dir` as these are no longer needed. ([#53232](https://github.com/kubernetes/kubernetes/pull/53232), [@apelisse](https://github.com/apelisse))
* `kubectl explain` now uses openapi rather than swagger 1.2. ([#53228](https://github.com/kubernetes/kubernetes/pull/53228), [@apelisse](https://github.com/apelisse))
* Fixes a performance issue ([#51899](https://github.com/kubernetes/kubernetes/pull/51899)) identified in large-scale clusters when deleting thousands of pods simultaneously across hundreds of nodes, by actively removing containers of deleted pods, rather than waiting for periodic garbage collection and batching resulting pod API deletion requests. ([#53233](https://github.com/kubernetes/kubernetes/pull/53233), [@dashpole](https://github.com/dashpole))
* Improve explanation of ReplicaSet ([#53403](https://github.com/kubernetes/kubernetes/pull/53403), [@rcorre](https://github.com/rcorre))
* avoid newline "
" in the error to break log msg to 2 lines ([#49826](https://github.com/kubernetes/kubernetes/pull/49826), [@dixudx](https://github.com/dixudx))
* don't recreate a mirror pod for static pod when node gets deleted ([#48339](https://github.com/kubernetes/kubernetes/pull/48339), [@dixudx](https://github.com/dixudx))
* Fix permissions for Metrics Server. ([#53330](https://github.com/kubernetes/kubernetes/pull/53330), [@kawych](https://github.com/kawych))
* default fail-swap-on to false for kubelet on kubernetes-worker charm ([#53386](https://github.com/kubernetes/kubernetes/pull/53386), [@wwwtyro](https://github.com/wwwtyro))
* Add --etcd-compaction-interval to apiserver for controlling request of compaction to etcd3 from apiserver. ([#51765](https://github.com/kubernetes/kubernetes/pull/51765), [@mitake](https://github.com/mitake))
* Apply algorithm in scheduler by feature gates. ([#52723](https://github.com/kubernetes/kubernetes/pull/52723), [@k82cn](https://github.com/k82cn))
* etcd: update version to 3.1.10 ([#49393](https://github.com/kubernetes/kubernetes/pull/49393), [@hongchaodeng](https://github.com/hongchaodeng))
* support nodeSelector in kubefed init ([#50749](https://github.com/kubernetes/kubernetes/pull/50749), [@dixudx](https://github.com/dixudx))
* Upgrade fluentd-elasticsearch addon to Elasticsearch/Kibana 5.6.2 ([#53307](https://github.com/kubernetes/kubernetes/pull/53307), [@aknuds1](https://github.com/aknuds1))
* enable to specific unconfined AppArmor profile ([#52395](https://github.com/kubernetes/kubernetes/pull/52395), [@dixudx](https://github.com/dixudx))
* Update Influxdb image to latest version. ([#53319](https://github.com/kubernetes/kubernetes/pull/53319), [@kairen](https://github.com/kairen))
    * Update Grafana image to latest version.
    * Change influxdb-grafana-controller resource to Deployment.
* Only do UpdateContainerResources when cpuset is set  ([#53122](https://github.com/kubernetes/kubernetes/pull/53122), [@resouer](https://github.com/resouer))
* Fixes an issue with RBAC reconciliation that could cause duplicated subjects in some bootstrapped rolebindings on each restart of the API server. ([#53239](https://github.com/kubernetes/kubernetes/pull/53239), [@enj](https://github.com/enj))
* gce: remove compute-rw, see what breaks ([#53266](https://github.com/kubernetes/kubernetes/pull/53266), [@mikedanese](https://github.com/mikedanese))
* Fix the bug that query Kubelet's stats summary with CRI stats enabled results in error. ([#53107](https://github.com/kubernetes/kubernetes/pull/53107), [@Random-Liu](https://github.com/Random-Liu))
* kubeadm allows the kubelets in the cluster to automatically renew their client certificates ([#53252](https://github.com/kubernetes/kubernetes/pull/53252), [@kad](https://github.com/kad))
* Fixes an issue with `kubectl set` commands encountering conversion errors for ReplicaSet and DaemonSet objects ([#53158](https://github.com/kubernetes/kubernetes/pull/53158), [@liggitt](https://github.com/liggitt))
* RBAC: The default `admin` and `edit` roles now include read/write permissions and the `view` role includes read permissions on `poddisruptionbudget.policy` resources. ([#52654](https://github.com/kubernetes/kubernetes/pull/52654), [@liggitt](https://github.com/liggitt))
* Change ImageGCManage to consume ImageFS stats from StatsProvider ([#53094](https://github.com/kubernetes/kubernetes/pull/53094), [@yguo0905](https://github.com/yguo0905))
* BugFix: Exited containers are not Garbage Collected by the kubelet while the pod is running ([#53167](https://github.com/kubernetes/kubernetes/pull/53167), [@dashpole](https://github.com/dashpole))
* - Improved generation of deb and rpm packages in bazel build ([#53163](https://github.com/kubernetes/kubernetes/pull/53163), [@kad](https://github.com/kad))
* Add a label which prevents a node from being added to a cloud load balancer ([#53146](https://github.com/kubernetes/kubernetes/pull/53146), [@brendandburns](https://github.com/brendandburns))
* Fixes an issue pulling pod specs referencing unqualified images from docker.io on centos/fedora/rhel ([#53161](https://github.com/kubernetes/kubernetes/pull/53161), [@dims](https://github.com/dims))
* Update kube-dns to 1.14.5 ([#53153](https://github.com/kubernetes/kubernetes/pull/53153), [@bowei](https://github.com/bowei))
* - kubeadm init can now deploy exact build from CI area by specifying ID with "ci/" prefix. Example: "ci/v1.9.0-alpha.1.123+01234567889" ([#53043](https://github.com/kubernetes/kubernetes/pull/53043), [@kad](https://github.com/kad))
    * - kubeadm upgrade apply supports all standard ways of specifying version via labels. Examples: stable-1.8, latest-1.8, ci/latest-1.9 and similar.
* - kubeadm 1.9 will detect and fail init or join pre-flight checks if kubelet is lower than 1.8.0-alpha ([#52913](https://github.com/kubernetes/kubernetes/pull/52913), [@kad](https://github.com/kad))
* s390x ingress controller support ([#52663](https://github.com/kubernetes/kubernetes/pull/52663), [@wwwtyro](https://github.com/wwwtyro))
* NONE ([#50532](https://github.com/kubernetes/kubernetes/pull/50532), [@steveperry-53](https://github.com/steveperry-53))
* CRI: Add stdout/stderr fields to Exec and Attach requests. ([#52686](https://github.com/kubernetes/kubernetes/pull/52686), [@yujuhong](https://github.com/yujuhong))
* NONE ([#53001](https://github.com/kubernetes/kubernetes/pull/53001), [@ericchiang](https://github.com/ericchiang))
* Cluster Autoscaler 1.0.0 ([#53005](https://github.com/kubernetes/kubernetes/pull/53005), [@mwielgus](https://github.com/mwielgus))
* Remove the --docker-exec-handler flag. Only native exec handler is supported. ([#52287](https://github.com/kubernetes/kubernetes/pull/52287), [@yujuhong](https://github.com/yujuhong))
* The Rackspace cloud provider has been removed after a long deprecation period. It was deprecated because it duplicates a lot of the OpenStack logic and can no longer be maintained. Please use the OpenStack cloud provider instead. ([#52855](https://github.com/kubernetes/kubernetes/pull/52855), [@NickrenREN](https://github.com/NickrenREN))
* Fixes an initializer bug where update requests which had an empty pending initializers list were erroneously rejected. ([#52558](https://github.com/kubernetes/kubernetes/pull/52558), [@jennybuckley](https://github.com/jennybuckley))
* BulkVerifyVolumes() implementation for vSphere ([#52131](https://github.com/kubernetes/kubernetes/pull/52131), [@BaluDontu](https://github.com/BaluDontu))
* added --list option to the `kubectl label` command ([#51971](https://github.com/kubernetes/kubernetes/pull/51971), [@juanvallejo](https://github.com/juanvallejo))
* Removing `--prom-push-gateway` flag from e2e tests ([#52485](https://github.com/kubernetes/kubernetes/pull/52485), [@nielsole](https://github.com/nielsole))
* If a container does not create a file at the `terminationMessagePath`, no message should be output about being unable to find the file. ([#52567](https://github.com/kubernetes/kubernetes/pull/52567), [@smarterclayton](https://github.com/smarterclayton))
* Support German cloud for azure disk mount feature ([#50673](https://github.com/kubernetes/kubernetes/pull/50673), [@clement-buchart](https://github.com/clement-buchart))
* Add s390x to juju kubernetes ([#52537](https://github.com/kubernetes/kubernetes/pull/52537), [@ktsakalozos](https://github.com/ktsakalozos))
* Fix kubernetes charms not restarting services properly after host reboot on LXD ([#52445](https://github.com/kubernetes/kubernetes/pull/52445), [@Cynerva](https://github.com/Cynerva))
* Add monitoring of Windows Server containers metrics in the kubelet via the stats/summary endpoint. ([#50396](https://github.com/kubernetes/kubernetes/pull/50396), [@bobbypage](https://github.com/bobbypage))
* Restores redirect behavior for proxy subresources ([#52933](https://github.com/kubernetes/kubernetes/pull/52933), [@liggitt](https://github.com/liggitt))
* A new service annotation has been added for services of type LoadBalancer on Azure,  ([#51757](https://github.com/kubernetes/kubernetes/pull/51757), [@itowlson](https://github.com/itowlson))
    * to specify the subnet on which the service's front end IP should be provisioned. The 
    * annotation is service.beta.kubernetes.io/azure-load-balancer-internal-subnet and its 
    * value is the subnet name (not the subnet ARM ID).  If omitted, the default is the 
    * master subnet.  It is ignored if the service is not on Azure, if the type is not 
    * LoadBalancer, or if the load balancer is not internal.
* Adds a command-line argument to kube-apiserver called ([#51698](https://github.com/kubernetes/kubernetes/pull/51698), [@rphillips](https://github.com/rphillips))
    * --alpha-endpoint-reconciler-type=(master-count, lease, none) (default
    * "master-count"). The original reconciler is 'master-count'. The 'lease'
    * reconciler uses the storageapi and a TTL to keep alive an endpoint within the
    * `kube-apiserver-endpoint` storage namespace. The 'none' reconciler is a noop
    * reconciler that does not do anything. This is useful for self-hosted
    * environments.
* Improved Italian translation for kubectl ([#51463](https://github.com/kubernetes/kubernetes/pull/51463), [@lucab85](https://github.com/lucab85))
* Add a metric to the kubelet to monitor remaining lifetime of the certificate that ([#51031](https://github.com/kubernetes/kubernetes/pull/51031), [@jcbsmpsn](https://github.com/jcbsmpsn))
    * authenticates the kubelet to the API server.
* change AddEventHandlerWithResyncPeriod to AddEventHandler in factory.go ([#51582](https://github.com/kubernetes/kubernetes/pull/51582), [@jiulongzaitian](https://github.com/jiulongzaitian))
* Validate that cronjob names are 52 characters or less ([#52733](https://github.com/kubernetes/kubernetes/pull/52733), [@julia-stripe](https://github.com/julia-stripe))
* add readme file of ipvs ([#51937](https://github.com/kubernetes/kubernetes/pull/51937), [@Lion-Wei](https://github.com/Lion-Wei))



# v1.9.0-alpha.1
=======
* Log error of failed healthz check ([#53048](https://github.com/kubernetes/kubernetes/pull/53048), [@mrIncompetent](https://github.com/mrIncompetent))
* fix azure file mount limit issue on windows due to using drive letter ([#53629](https://github.com/kubernetes/kubernetes/pull/53629), [@andyzhangx](https://github.com/andyzhangx))
* Update AWS SDK to 1.12.7 ([#53561](https://github.com/kubernetes/kubernetes/pull/53561), [@justinsb](https://github.com/justinsb))
* The `kubernetes.io/created-by` annotation is no longer added to controller-created objects. Use the  `metadata.ownerReferences` item that has `controller` set to `true` to determine which controller, if any, owns an object. ([#54445](https://github.com/kubernetes/kubernetes/pull/54445), [@crimsonfaith91](https://github.com/crimsonfaith91))
* Fix overlay2 container disk metrics for Docker and CRI-O ([#54827](https://github.com/kubernetes/kubernetes/pull/54827), [@dashpole](https://github.com/dashpole))
* Fix iptables FORWARD policy for Docker 1.13 in kubernetes-worker charm ([#54796](https://github.com/kubernetes/kubernetes/pull/54796), [@Cynerva](https://github.com/Cynerva))
* Fix `kubeadm upgrade plan` for offline operation: ignore errors when trying to fetch latest versions from dl.k8s.io ([#54016](https://github.com/kubernetes/kubernetes/pull/54016), [@praseodym](https://github.com/praseodym))
* fluentd now supports CRI log format. ([#54777](https://github.com/kubernetes/kubernetes/pull/54777), [@Random-Liu](https://github.com/Random-Liu))
* Validate that PersistentVolumeSource is not changed during PV Update ([#54761](https://github.com/kubernetes/kubernetes/pull/54761), [@ianchakeres](https://github.com/ianchakeres))
* If you are using the cloud provider API to determine the external host address of the apiserver, set --external-hostname explicitly instead. The cloud provider detection has been deprecated and will be removed in the future ([#54516](https://github.com/kubernetes/kubernetes/pull/54516), [@dims](https://github.com/dims))
* Fixes discovery information for scale subresources in the apps API group ([#54683](https://github.com/kubernetes/kubernetes/pull/54683), [@liggitt](https://github.com/liggitt))
* Optimize Repeated registration of AlgorithmProvider when ApplyFeatureGates ([#54047](https://github.com/kubernetes/kubernetes/pull/54047), [@kuramal](https://github.com/kuramal))
* `kubectl get` will by default fetch large lists of resources in chunks of up to 500 items rather than requesting all resources up front from the server. This reduces the perceived latency of managing large clusters since the server returns the first set of results to the client much more quickly.  A new flag `--chunk-size=SIZE` may be used to alter the number of items or disable this feature when `0` is passed.  This is a beta feature. ([#53768](https://github.com/kubernetes/kubernetes/pull/53768), [@smarterclayton](https://github.com/smarterclayton))
* Add a new feature gate for enabling an alpha annotation which, if present, excludes the annotated node from being added to a service load balancers. ([#54644](https://github.com/kubernetes/kubernetes/pull/54644), [@brendandburns](https://github.com/brendandburns))
* Implement graceful shutdown of the kube-apiserver by waiting for open connections to finish before exiting. Moreover, the audit backend will stop dropping events on shutdown. ([#53695](https://github.com/kubernetes/kubernetes/pull/53695), [@hzxuzhonghu](https://github.com/hzxuzhonghu))
* fix warning messages due to GetMountRefs func not implemented in windows ([#52401](https://github.com/kubernetes/kubernetes/pull/52401), [@andyzhangx](https://github.com/andyzhangx))
* Object count quotas supported on all standard resources using `count/<resource>.<group>` syntax ([#54320](https://github.com/kubernetes/kubernetes/pull/54320), [@derekwaynecarr](https://github.com/derekwaynecarr))
* Add openssh-client back into the hyperkube image. This allows the gitRepo volume plugin to work properly. ([#54250](https://github.com/kubernetes/kubernetes/pull/54250), [@ixdy](https://github.com/ixdy))
* Bump version of all prometheus-to-sd images to v0.2.2. ([#54635](https://github.com/kubernetes/kubernetes/pull/54635), [@loburm](https://github.com/loburm))
* [fluentd-gcp addon] Fluentd now runs in its own network, not in the host one. ([#54395](https://github.com/kubernetes/kubernetes/pull/54395), [@crassirostris](https://github.com/crassirostris))
* fix azure storage account num exhausting issue ([#54459](https://github.com/kubernetes/kubernetes/pull/54459), [@andyzhangx](https://github.com/andyzhangx))
* Add Windows support to the system verification check ([#53730](https://github.com/kubernetes/kubernetes/pull/53730), [@bsteciuk](https://github.com/bsteciuk))
* allow windows mount path ([#51240](https://github.com/kubernetes/kubernetes/pull/51240), [@andyzhangx](https://github.com/andyzhangx))
* Development of Kubernetes Federation has moved to github.com/kubernetes/federation.  This move out of tree also means that Federation will begin releasing separately from Kubernetes.  The impact of this is Federation-specific behavior will no longer be included in kubectl, kubefed will no longer be released as part of Kubernetes, and the Federation servers will no longer be included in the hyperkube binary and image. ([#53816](https://github.com/kubernetes/kubernetes/pull/53816), [@marun](https://github.com/marun))
* Metadata concealment on GCE is now controlled by the `ENABLE_METADATA_CONCEALMENT` env var.  See cluster/gce/config-default.sh for more info. ([#54150](https://github.com/kubernetes/kubernetes/pull/54150), [@ihmccreery](https://github.com/ihmccreery))
* Fixed a bug which is causes kube-apiserver to not run without specifying service-cluster-ip-range ([#52870](https://github.com/kubernetes/kubernetes/pull/52870), [@jennybuckley](https://github.com/jennybuckley))
* the generic admission webhook is now available in the generic apiserver ([#54513](https://github.com/kubernetes/kubernetes/pull/54513), [@deads2k](https://github.com/deads2k))
* ScaleIO persistent volumes now support referencing a secret in a namespace other than the bound persistent volume claim's namespace; this is controlled during provisioning with the `secretNamespace` storage class parameter; StoragePool and ProtectionDomain attributes no longer defaults to the value `default` ([#54013](https://github.com/kubernetes/kubernetes/pull/54013), [@vladimirvivien](https://github.com/vladimirvivien))
* Feature gates now check minimum versions ([#54539](https://github.com/kubernetes/kubernetes/pull/54539), [@jamiehannaford](https://github.com/jamiehannaford))
* fix azure pv crash due to volumeSource.ReadOnly value nil ([#54607](https://github.com/kubernetes/kubernetes/pull/54607), [@andyzhangx](https://github.com/andyzhangx))
* Fix an issue where pods were briefly transitioned to a "Pending" state during the deletion process. ([#54593](https://github.com/kubernetes/kubernetes/pull/54593), [@dashpole](https://github.com/dashpole))
* move getMaxVols function to predicates.go and add some NewVolumeCountPredicate funcs ([#51783](https://github.com/kubernetes/kubernetes/pull/51783), [@jiulongzaitian](https://github.com/jiulongzaitian))
* Remove the LbaasV1 of OpenStack cloud provider, currently only support LbaasV2. ([#52717](https://github.com/kubernetes/kubernetes/pull/52717), [@FengyunPan](https://github.com/FengyunPan))
* generic webhook admission now takes a config file which describes how to authenticate to webhook servers ([#54414](https://github.com/kubernetes/kubernetes/pull/54414), [@deads2k](https://github.com/deads2k))
* The NodeController will not support kubelet 1.2. ([#48996](https://github.com/kubernetes/kubernetes/pull/48996), [@k82cn](https://github.com/k82cn))
* - fluentd-gcp runs with a dedicated fluentd-gcp service account ([#54175](https://github.com/kubernetes/kubernetes/pull/54175), [@tallclair](https://github.com/tallclair))
    * - Stop mounting the host certificates into fluentd's prometheus-to-sd container
* fix azure disk mount failure on coreos and some other distros ([#54334](https://github.com/kubernetes/kubernetes/pull/54334), [@andyzhangx](https://github.com/andyzhangx))
* Allow GCE users to configure the service account made available on their nodes ([#52868](https://github.com/kubernetes/kubernetes/pull/52868), [@ihmccreery](https://github.com/ihmccreery))
* Load kernel modules automatically inside a kube-proxy pod ([#52003](https://github.com/kubernetes/kubernetes/pull/52003), [@vfreex](https://github.com/vfreex))
* kube-apiserver: `--ssh-user` and `--ssh-keyfile` are now deprecated and will be removed in a future release. Users of SSH tunnel functionality used in Google Container Engine for the Master -> Cluster communication should plan to transition to alternate methods for bridging master and node networks. ([#54433](https://github.com/kubernetes/kubernetes/pull/54433), [@dims](https://github.com/dims))
* Fix hyperkube kubelet --experimental-dockershim ([#54508](https://github.com/kubernetes/kubernetes/pull/54508), [@ivan4th](https://github.com/ivan4th))
* Fix clustered datastore name to be absolute. ([#54438](https://github.com/kubernetes/kubernetes/pull/54438), [@pshahzeb](https://github.com/pshahzeb))
* Fix for service controller so that it won't retry on doNotRetry service update failure. ([#54184](https://github.com/kubernetes/kubernetes/pull/54184), [@MrHohn](https://github.com/MrHohn))
* Add support for RBAC support to Kubernetes via Juju ([#53820](https://github.com/kubernetes/kubernetes/pull/53820), [@ktsakalozos](https://github.com/ktsakalozos))
* RBD Persistent Volume Sources can now reference User's Secret in namespaces other than the namespace of the bound Persistent Volume Claim ([#54302](https://github.com/kubernetes/kubernetes/pull/54302), [@sbezverk](https://github.com/sbezverk))
* Apiserver proxy rewrites URL when service returns absolute path with request's host. ([#52556](https://github.com/kubernetes/kubernetes/pull/52556), [@roycaihw](https://github.com/roycaihw))
* Logging cleanups ([#54443](https://github.com/kubernetes/kubernetes/pull/54443), [@bowei](https://github.com/bowei))
        * Updates kube-dns to use client-go 3
        * Updates containers to use alpine as the base image on all platforms
        * Adds support for IPv6
* add `--raw` to `kubectl create` to POST using the normal transport ([#54245](https://github.com/kubernetes/kubernetes/pull/54245), [@deads2k](https://github.com/deads2k))
* Remove the --network-plugin-dir flag. ([#53564](https://github.com/kubernetes/kubernetes/pull/53564), [@supereagle](https://github.com/supereagle))
* Introduces a polymorphic scale client, allowing HorizontalPodAutoscalers to properly function on scalable resources in any API group. ([#53743](https://github.com/kubernetes/kubernetes/pull/53743), [@DirectXMan12](https://github.com/DirectXMan12))
* Add PodDisruptionBudget to scheduler cache. ([#53914](https://github.com/kubernetes/kubernetes/pull/53914), [@bsalamat](https://github.com/bsalamat))
* - API machinery's httpstream/spdy calls now support CIDR notation for NO_PROXY ([#54413](https://github.com/kubernetes/kubernetes/pull/54413), [@kad](https://github.com/kad))
* Added option lb-provider to OpenStack cloud provider config ([#54176](https://github.com/kubernetes/kubernetes/pull/54176), [@gonzolino](https://github.com/gonzolino))
* Allow for configuring etcd hostname in the manifest ([#54403](https://github.com/kubernetes/kubernetes/pull/54403), [@wojtek-t](https://github.com/wojtek-t))
* - kubeadm  will warn users if access to IP ranges for Pods or Services will be done via HTTP proxy. ([#52792](https://github.com/kubernetes/kubernetes/pull/52792), [@kad](https://github.com/kad))
* Resolves forbidden error when accessing replicasets and daemonsets via the apps API group ([#54309](https://github.com/kubernetes/kubernetes/pull/54309), [@liggitt](https://github.com/liggitt))
* Cluster Autoscaler 1.0.1 ([#54298](https://github.com/kubernetes/kubernetes/pull/54298), [@mwielgus](https://github.com/mwielgus))
* secret data containing Docker registry auth objects is now generated using the config.json format ([#53916](https://github.com/kubernetes/kubernetes/pull/53916), [@juanvallejo](https://github.com/juanvallejo))
* Added support for SAN entries in the master node certificate via juju kubernetes-master config. ([#54234](https://github.com/kubernetes/kubernetes/pull/54234), [@hyperbolic2346](https://github.com/hyperbolic2346))
* support imagePullSecrets and imagePullPolicy in kubefed init ([#50740](https://github.com/kubernetes/kubernetes/pull/50740), [@dixudx](https://github.com/dixudx))
* update gRPC to v1.6.0 to pick up data race fix grpc/grpc-go#1316  ([#53128](https://github.com/kubernetes/kubernetes/pull/53128), [@dixudx](https://github.com/dixudx))
* admission webhook registrations without a specific failure policy default to failing closed. ([#54162](https://github.com/kubernetes/kubernetes/pull/54162), [@deads2k](https://github.com/deads2k))
* Device plugin Alpha API no longer supports returning artifacts per device as part of AllocateResponse. ([#53031](https://github.com/kubernetes/kubernetes/pull/53031), [@vishh](https://github.com/vishh))
* admission webhook registration now allows URL paths ([#54145](https://github.com/kubernetes/kubernetes/pull/54145), [@deads2k](https://github.com/deads2k))
* The Kubelet's --enable-custom-metrics flag is now marked deprecated. ([#54154](https://github.com/kubernetes/kubernetes/pull/54154), [@mtaufen](https://github.com/mtaufen))
* Use multi-arch busybox image for e2e ([#54034](https://github.com/kubernetes/kubernetes/pull/54034), [@dixudx](https://github.com/dixudx))
* sample-controller: add example CRD controller ([#52753](https://github.com/kubernetes/kubernetes/pull/52753), [@munnerz](https://github.com/munnerz))
* RBAC PolicyRules now allow resource=`*/<subresource>` to cover `any-resource/<subresource>`.   For example, `*/scale` covers `replicationcontroller/scale`. ([#53722](https://github.com/kubernetes/kubernetes/pull/53722), [@deads2k](https://github.com/deads2k))
* Upgrade to go1.9 ([#51375](https://github.com/kubernetes/kubernetes/pull/51375), [@cblecker](https://github.com/cblecker))
* Webhook always retries connection reset error. ([#53947](https://github.com/kubernetes/kubernetes/pull/53947), [@crassirostris](https://github.com/crassirostris))
* fix PV Recycle failed on non-amd64 platform ([#53958](https://github.com/kubernetes/kubernetes/pull/53958), [@dixudx](https://github.com/dixudx))
* Verbose option is added to each status function in CRI. Container runtime could return extra information in status response for debugging. ([#53965](https://github.com/kubernetes/kubernetes/pull/53965), [@Random-Liu](https://github.com/Random-Liu))
* Fixed log fallback termination messages when using docker with journald log driver ([#52503](https://github.com/kubernetes/kubernetes/pull/52503), [@joelsmith](https://github.com/joelsmith))
* falls back to parse Docker runtime version as generic if not semver ([#54040](https://github.com/kubernetes/kubernetes/pull/54040), [@dixudx](https://github.com/dixudx))
* kubelet: prevent removal of default labels from Node API objects on startup ([#54073](https://github.com/kubernetes/kubernetes/pull/54073), [@liggitt](https://github.com/liggitt))
* Change scheduler to skip pod with updates only on pod annotations ([#54008](https://github.com/kubernetes/kubernetes/pull/54008), [@yguo0905](https://github.com/yguo0905))
* PodSecurityPolicy: when multiple policies allow a submitted pod, priority is given to ones which do not require any fields in the pod spec to be defaulted. If the pod must be defaulted, the first policy (ordered by name) that allows the pod is used. ([#52849](https://github.com/kubernetes/kubernetes/pull/52849), [@liggitt](https://github.com/liggitt))
* Control HPA tolerance through the `horizontal-pod-autoscaler-tolerance` flag. ([#52275](https://github.com/kubernetes/kubernetes/pull/52275), [@mattjmcnaughton](https://github.com/mattjmcnaughton))
* bump CNI to v0.6.0 ([#51250](https://github.com/kubernetes/kubernetes/pull/51250), [@dixudx](https://github.com/dixudx))
* Improve resilience by annotating kube-dns addon with podAntiAffinity to prefer scheduling on different nodes. ([#52193](https://github.com/kubernetes/kubernetes/pull/52193), [@StevenACoffman](https://github.com/StevenACoffman))
* Azure cloudprovider: Fix controller manager crash issue on a manually created k8s cluster. ([#53694](https://github.com/kubernetes/kubernetes/pull/53694), [@andyzhangx](https://github.com/andyzhangx))
* Enable Priority admission control in kubeadm.  ([#53175](https://github.com/kubernetes/kubernetes/pull/53175), [@andrewsykim](https://github.com/andrewsykim))
* Add --no-negcache flag to kube-dns to prevent caching of NXDOMAIN responses. ([#53604](https://github.com/kubernetes/kubernetes/pull/53604), [@cblecker](https://github.com/cblecker))
* kubelet provides more specific events when unable to sync pod ([#53857](https://github.com/kubernetes/kubernetes/pull/53857), [@derekwaynecarr](https://github.com/derekwaynecarr))
* Kubelet evictions take pod priority into account ([#53542](https://github.com/kubernetes/kubernetes/pull/53542), [@dashpole](https://github.com/dashpole))
* Adds a new controller which automatically cleans up Certificate Signing Requests that are ([#51840](https://github.com/kubernetes/kubernetes/pull/51840), [@jcbsmpsn](https://github.com/jcbsmpsn))
    * Approved and Issued, or Denied.
* Optimize random string generator to avoid multiple locks & use bit-masking ([#53720](https://github.com/kubernetes/kubernetes/pull/53720), [@shyamjvs](https://github.com/shyamjvs))
* update cluster printer to enable --show-labels ([#53771](https://github.com/kubernetes/kubernetes/pull/53771), [@dixudx](https://github.com/dixudx))
* add RequestReceivedTimestamp and StageTimestamp to audit event ([#52981](https://github.com/kubernetes/kubernetes/pull/52981), [@CaoShuFeng](https://github.com/CaoShuFeng))
* Deprecation: The flag `etcd-quorum-read ` of kube-apiserver is deprecated and the ability to switch off quorum read will be removed in a future release. ([#53795](https://github.com/kubernetes/kubernetes/pull/53795), [@xiangpengzhao](https://github.com/xiangpengzhao))
* Use separate client for leader election in scheduler to avoid starving leader election by regular scheduler operations. ([#53793](https://github.com/kubernetes/kubernetes/pull/53793), [@wojtek-t](https://github.com/wojtek-t))
* Support autoprobing node-security-group for openstack cloud provider, Support multiple Security Groups for cluster's nodes. ([#50836](https://github.com/kubernetes/kubernetes/pull/50836), [@FengyunPan](https://github.com/FengyunPan))
* fix a bug where disk pressure could trigger prematurely when using overlay2 ([#53684](https://github.com/kubernetes/kubernetes/pull/53684), [@dashpole](https://github.com/dashpole))
* "kubectl cp" updated to honor destination names  ([#51215](https://github.com/kubernetes/kubernetes/pull/51215), [@juanvallejo](https://github.com/juanvallejo))
* kubeadm: Strip bootstrap tokens from the `kubeadm-config` ConfigMap ([#53559](https://github.com/kubernetes/kubernetes/pull/53559), [@fabriziopandini](https://github.com/fabriziopandini))
* Skip podpreset test if the alpha feature setttings/v1alpha1 is disabled ([#53080](https://github.com/kubernetes/kubernetes/pull/53080), [@jennybuckley](https://github.com/jennybuckley))
* Log when node is successfully initialized by Cloud Controller Manager ([#53517](https://github.com/kubernetes/kubernetes/pull/53517), [@andrewsykim](https://github.com/andrewsykim))
* apiserver: --etcd-quorum-read now defaults to true, to ensure correct operation with HA etcd clusters ([#53717](https://github.com/kubernetes/kubernetes/pull/53717), [@liggitt](https://github.com/liggitt))
* The Kubelet's feature gates are now specified as a map when provided via a JSON or YAML KubeletConfiguration, rather than as a string of key-value pairs. ([#53025](https://github.com/kubernetes/kubernetes/pull/53025), [@mtaufen](https://github.com/mtaufen))
* Address a bug which allowed the horizontal pod autoscaler to allocate `desiredReplicas` > `maxReplicas` in certain instances. ([#53690](https://github.com/kubernetes/kubernetes/pull/53690), [@mattjmcnaughton](https://github.com/mattjmcnaughton))
* Horizontal pod autoscaler uses REST clients through the kube-aggregator instead of the legacy client through the API server proxy. ([#53205](https://github.com/kubernetes/kubernetes/pull/53205), [@kawych](https://github.com/kawych))
* Fix to prevent downward api change break on older versions ([#53673](https://github.com/kubernetes/kubernetes/pull/53673), [@timothysc](https://github.com/timothysc))
* API chunking via the `limit` and `continue` request parameters is promoted to beta in this release.  Client libraries using the Informer or ListWatch types will automatically opt in to chunking. ([#52949](https://github.com/kubernetes/kubernetes/pull/52949), [@smarterclayton](https://github.com/smarterclayton))
* GCE: Bump GLBC version to [0.9.7](https://github.com/kubernetes/ingress/releases/tag/0.9.7). ([#53625](https://github.com/kubernetes/kubernetes/pull/53625), [@nikhiljindal](https://github.com/nikhiljindal))
* kubelet's `--cloud-provider` flag no longer defaults to "auto-detect".  If you want cloud-provider support in kubelet, you must set a specific cloud-provider explicitly. ([#53573](https://github.com/kubernetes/kubernetes/pull/53573), [@dims](https://github.com/dims))
* Ignore extended resources that are not registered with kubelet during container resource allocation. ([#53547](https://github.com/kubernetes/kubernetes/pull/53547), [@jiayingz](https://github.com/jiayingz))
* kubectl top pod and node should sort by namespace / name so that results don't jump around. ([#53560](https://github.com/kubernetes/kubernetes/pull/53560), [@dixudx](https://github.com/dixudx))
* Added --dry-run option to `kubectl drain` ([#52440](https://github.com/kubernetes/kubernetes/pull/52440), [@juanvallejo](https://github.com/juanvallejo))
* Fix a bug that prevents client-go metrics from being registered in prometheus in multiple components. ([#53434](https://github.com/kubernetes/kubernetes/pull/53434), [@crassirostris](https://github.com/crassirostris))
* Adjust batching audit webhook default parameters: increase queue size, batch size, and initial backoff. Add throttling to the batching audit webhook. Default rate limit is 10 QPS. ([#53417](https://github.com/kubernetes/kubernetes/pull/53417), [@crassirostris](https://github.com/crassirostris))
* Added integration test for TaintNodeByCondition. ([#53184](https://github.com/kubernetes/kubernetes/pull/53184), [@k82cn](https://github.com/k82cn))
* Add API version apps/v1, and bump DaemonSet to apps/v1 ([#53278](https://github.com/kubernetes/kubernetes/pull/53278), [@janetkuo](https://github.com/janetkuo))
* Change `kubeadm create token` to default to the group that almost everyone will want to use.  The group is system:bootstrappers:kubeadm:default-node-token and is the group that kubeadm sets up, via an RBAC binding, for auto-approval (system:certificates.k8s.io:certificatesigningrequests:nodeclient). ([#53512](https://github.com/kubernetes/kubernetes/pull/53512), [@jbeda](https://github.com/jbeda))
* Using OpenStack service catalog to do version detection ([#53115](https://github.com/kubernetes/kubernetes/pull/53115), [@FengyunPan](https://github.com/FengyunPan))
* Fix metrics API group name in audit configuration ([#53493](https://github.com/kubernetes/kubernetes/pull/53493), [@piosz](https://github.com/piosz))
* GCE: Fixes ILB sync on legacy networks and auto networks with unique subnet names ([#53410](https://github.com/kubernetes/kubernetes/pull/53410), [@nicksardo](https://github.com/nicksardo))
* outputs `<none>` for columns specified by `-o custom-columns` but not found in object ([#51750](https://github.com/kubernetes/kubernetes/pull/51750), [@jianhuiz](https://github.com/jianhuiz))
* Metrics were added to network plugin to report latency of CNI operations ([#53446](https://github.com/kubernetes/kubernetes/pull/53446), [@sjenning](https://github.com/sjenning))
* GCE: Fix issue deleting internal load balancers when the firewall resource may not exist. ([#53450](https://github.com/kubernetes/kubernetes/pull/53450), [@nicksardo](https://github.com/nicksardo))
* Custom resources served through CustomResourceDefinition now support field selectors for `metadata.name` and `metadata.namespace`. ([#53345](https://github.com/kubernetes/kubernetes/pull/53345), [@ncdc](https://github.com/ncdc))
* Add generate-groups.sh and generate-internal-groups.sh to k8s.io/code-generator to easily run generators against CRD or User API Server types. ([#52186](https://github.com/kubernetes/kubernetes/pull/52186), [@sttts](https://github.com/sttts))
* kubelet `--cert-dir` now defaults to `/var/lib/kubelet/pki`, in order to ensure bootstrapped and rotated certificates persist beyond a reboot. resolves an issue in kubeadm with false-positive `/var/lib/kubelet is not empty` message during pre-flight checks ([#53317](https://github.com/kubernetes/kubernetes/pull/53317), [@liggitt](https://github.com/liggitt))
* Fix multi-attach error spam in logs and events ([#53401](https://github.com/kubernetes/kubernetes/pull/53401), [@gnufied](https://github.com/gnufied))
* Use `not-ready` to replace `notReady` in node condition taint keys. ([#51266](https://github.com/kubernetes/kubernetes/pull/51266), [@resouer](https://github.com/resouer))
* Support completion for --clusterrole of kubectl create clusterrolebinding ([#48267](https://github.com/kubernetes/kubernetes/pull/48267), [@superbrothers](https://github.com/superbrothers))
* Don't remove extended resource capacities that are not registered with kubelet from node status. ([#53353](https://github.com/kubernetes/kubernetes/pull/53353), [@jiayingz](https://github.com/jiayingz))
* Kubectl: Remove swagger 1.2 validation. Also removes options `--use-openapi` and `--schema-cache-dir` as these are no longer needed. ([#53232](https://github.com/kubernetes/kubernetes/pull/53232), [@apelisse](https://github.com/apelisse))
* `kubectl explain` now uses openapi rather than swagger 1.2. ([#53228](https://github.com/kubernetes/kubernetes/pull/53228), [@apelisse](https://github.com/apelisse))
* Fixes a performance issue ([#51899](https://github.com/kubernetes/kubernetes/pull/51899)) identified in large-scale clusters when deleting thousands of pods simultaneously across hundreds of nodes, by actively removing containers of deleted pods, rather than waiting for periodic garbage collection and batching resulting pod API deletion requests. ([#53233](https://github.com/kubernetes/kubernetes/pull/53233), [@dashpole](https://github.com/dashpole))
* Improve explanation of ReplicaSet ([#53403](https://github.com/kubernetes/kubernetes/pull/53403), [@rcorre](https://github.com/rcorre))
* avoid newline "
" in the error to break log msg to 2 lines ([#49826](https://github.com/kubernetes/kubernetes/pull/49826), [@dixudx](https://github.com/dixudx))
* don't recreate a mirror pod for static pod when node gets deleted ([#48339](https://github.com/kubernetes/kubernetes/pull/48339), [@dixudx](https://github.com/dixudx))
* Fix permissions for Metrics Server. ([#53330](https://github.com/kubernetes/kubernetes/pull/53330), [@kawych](https://github.com/kawych))
* default fail-swap-on to false for kubelet on kubernetes-worker charm ([#53386](https://github.com/kubernetes/kubernetes/pull/53386), [@wwwtyro](https://github.com/wwwtyro))
* Add --etcd-compaction-interval to apiserver for controlling request of compaction to etcd3 from apiserver. ([#51765](https://github.com/kubernetes/kubernetes/pull/51765), [@mitake](https://github.com/mitake))
* Apply algorithm in scheduler by feature gates. ([#52723](https://github.com/kubernetes/kubernetes/pull/52723), [@k82cn](https://github.com/k82cn))
* etcd: update version to 3.1.10 ([#49393](https://github.com/kubernetes/kubernetes/pull/49393), [@hongchaodeng](https://github.com/hongchaodeng))
* support nodeSelector in kubefed init ([#50749](https://github.com/kubernetes/kubernetes/pull/50749), [@dixudx](https://github.com/dixudx))
* Upgrade fluentd-elasticsearch addon to Elasticsearch/Kibana 5.6.2 ([#53307](https://github.com/kubernetes/kubernetes/pull/53307), [@aknuds1](https://github.com/aknuds1))
* enable to specific unconfined AppArmor profile ([#52395](https://github.com/kubernetes/kubernetes/pull/52395), [@dixudx](https://github.com/dixudx))
* Update Influxdb image to latest version. ([#53319](https://github.com/kubernetes/kubernetes/pull/53319), [@kairen](https://github.com/kairen))
    * Update Grafana image to latest version.
    * Change influxdb-grafana-controller resource to Deployment.
* Only do UpdateContainerResources when cpuset is set  ([#53122](https://github.com/kubernetes/kubernetes/pull/53122), [@resouer](https://github.com/resouer))
* Fixes an issue with RBAC reconciliation that could cause duplicated subjects in some bootstrapped rolebindings on each restart of the API server. ([#53239](https://github.com/kubernetes/kubernetes/pull/53239), [@enj](https://github.com/enj))
* gce: remove compute-rw, see what breaks ([#53266](https://github.com/kubernetes/kubernetes/pull/53266), [@mikedanese](https://github.com/mikedanese))
* Fix the bug that query Kubelet's stats summary with CRI stats enabled results in error. ([#53107](https://github.com/kubernetes/kubernetes/pull/53107), [@Random-Liu](https://github.com/Random-Liu))
* kubeadm allows the kubelets in the cluster to automatically renew their client certificates ([#53252](https://github.com/kubernetes/kubernetes/pull/53252), [@kad](https://github.com/kad))
* Fixes an issue with `kubectl set` commands encountering conversion errors for ReplicaSet and DaemonSet objects ([#53158](https://github.com/kubernetes/kubernetes/pull/53158), [@liggitt](https://github.com/liggitt))
* RBAC: The default `admin` and `edit` roles now include read/write permissions and the `view` role includes read permissions on `poddisruptionbudget.policy` resources. ([#52654](https://github.com/kubernetes/kubernetes/pull/52654), [@liggitt](https://github.com/liggitt))
* Change ImageGCManage to consume ImageFS stats from StatsProvider ([#53094](https://github.com/kubernetes/kubernetes/pull/53094), [@yguo0905](https://github.com/yguo0905))
* BugFix: Exited containers are not Garbage Collected by the kubelet while the pod is running ([#53167](https://github.com/kubernetes/kubernetes/pull/53167), [@dashpole](https://github.com/dashpole))
* - Improved generation of deb and rpm packages in bazel build ([#53163](https://github.com/kubernetes/kubernetes/pull/53163), [@kad](https://github.com/kad))
* Add a label which prevents a node from being added to a cloud load balancer ([#53146](https://github.com/kubernetes/kubernetes/pull/53146), [@brendandburns](https://github.com/brendandburns))
* Fixes an issue pulling pod specs referencing unqualified images from docker.io on centos/fedora/rhel ([#53161](https://github.com/kubernetes/kubernetes/pull/53161), [@dims](https://github.com/dims))
* Update kube-dns to 1.14.5 ([#53153](https://github.com/kubernetes/kubernetes/pull/53153), [@bowei](https://github.com/bowei))
* - kubeadm init can now deploy exact build from CI area by specifying ID with "ci/" prefix. Example: "ci/v1.9.0-alpha.1.123+01234567889" ([#53043](https://github.com/kubernetes/kubernetes/pull/53043), [@kad](https://github.com/kad))
    * - kubeadm upgrade apply supports all standard ways of specifying version via labels. Examples: stable-1.8, latest-1.8, ci/latest-1.9 and similar.
* - kubeadm 1.9 will detect and fail init or join pre-flight checks if kubelet is lower than 1.8.0-alpha ([#52913](https://github.com/kubernetes/kubernetes/pull/52913), [@kad](https://github.com/kad))
* s390x ingress controller support ([#52663](https://github.com/kubernetes/kubernetes/pull/52663), [@wwwtyro](https://github.com/wwwtyro))
* NONE ([#50532](https://github.com/kubernetes/kubernetes/pull/50532), [@steveperry-53](https://github.com/steveperry-53))
* CRI: Add stdout/stderr fields to Exec and Attach requests. ([#52686](https://github.com/kubernetes/kubernetes/pull/52686), [@yujuhong](https://github.com/yujuhong))
* NONE ([#53001](https://github.com/kubernetes/kubernetes/pull/53001), [@ericchiang](https://github.com/ericchiang))
* Cluster Autoscaler 1.0.0 ([#53005](https://github.com/kubernetes/kubernetes/pull/53005), [@mwielgus](https://github.com/mwielgus))
* Remove the --docker-exec-handler flag. Only native exec handler is supported. ([#52287](https://github.com/kubernetes/kubernetes/pull/52287), [@yujuhong](https://github.com/yujuhong))
* The Rackspace cloud provider has been removed after a long deprecation period. It was deprecated because it duplicates a lot of the OpenStack logic and can no longer be maintained. Please use the OpenStack cloud provider instead. ([#52855](https://github.com/kubernetes/kubernetes/pull/52855), [@NickrenREN](https://github.com/NickrenREN))
* Fixes an initializer bug where update requests which had an empty pending initializers list were erroneously rejected. ([#52558](https://github.com/kubernetes/kubernetes/pull/52558), [@jennybuckley](https://github.com/jennybuckley))
* BulkVerifyVolumes() implementation for vSphere ([#52131](https://github.com/kubernetes/kubernetes/pull/52131), [@BaluDontu](https://github.com/BaluDontu))
* added --list option to the `kubectl label` command ([#51971](https://github.com/kubernetes/kubernetes/pull/51971), [@juanvallejo](https://github.com/juanvallejo))
* Removing `--prom-push-gateway` flag from e2e tests ([#52485](https://github.com/kubernetes/kubernetes/pull/52485), [@nielsole](https://github.com/nielsole))
* If a container does not create a file at the `terminationMessagePath`, no message should be output about being unable to find the file. ([#52567](https://github.com/kubernetes/kubernetes/pull/52567), [@smarterclayton](https://github.com/smarterclayton))
* Support German cloud for azure disk mount feature ([#50673](https://github.com/kubernetes/kubernetes/pull/50673), [@clement-buchart](https://github.com/clement-buchart))
* Add s390x to juju kubernetes ([#52537](https://github.com/kubernetes/kubernetes/pull/52537), [@ktsakalozos](https://github.com/ktsakalozos))
* Fix kubernetes charms not restarting services properly after host reboot on LXD ([#52445](https://github.com/kubernetes/kubernetes/pull/52445), [@Cynerva](https://github.com/Cynerva))
* Add monitoring of Windows Server containers metrics in the kubelet via the stats/summary endpoint. ([#50396](https://github.com/kubernetes/kubernetes/pull/50396), [@bobbypage](https://github.com/bobbypage))
* Restores redirect behavior for proxy subresources ([#52933](https://github.com/kubernetes/kubernetes/pull/52933), [@liggitt](https://github.com/liggitt))
* A new service annotation has been added for services of type LoadBalancer on Azure,  ([#51757](https://github.com/kubernetes/kubernetes/pull/51757), [@itowlson](https://github.com/itowlson))
    * to specify the subnet on which the service's front end IP should be provisioned. The 
    * annotation is service.beta.kubernetes.io/azure-load-balancer-internal-subnet and its 
    * value is the subnet name (not the subnet ARM ID).  If omitted, the default is the 
    * master subnet.  It is ignored if the service is not on Azure, if the type is not 
    * LoadBalancer, or if the load balancer is not internal.
* Adds a command-line argument to kube-apiserver called ([#51698](https://github.com/kubernetes/kubernetes/pull/51698), [@rphillips](https://github.com/rphillips))
    * --alpha-endpoint-reconciler-type=(master-count, lease, none) (default
    * "master-count"). The original reconciler is 'master-count'. The 'lease'
    * reconciler uses the storageapi and a TTL to keep alive an endpoint within the
    * `kube-apiserver-endpoint` storage namespace. The 'none' reconciler is a noop
    * reconciler that does not do anything. This is useful for self-hosted
    * environments.
* Improved Italian translation for kubectl ([#51463](https://github.com/kubernetes/kubernetes/pull/51463), [@lucab85](https://github.com/lucab85))
* Add a metric to the kubelet to monitor remaining lifetime of the certificate that ([#51031](https://github.com/kubernetes/kubernetes/pull/51031), [@jcbsmpsn](https://github.com/jcbsmpsn))
    * authenticates the kubelet to the API server.
* change AddEventHandlerWithResyncPeriod to AddEventHandler in factory.go ([#51582](https://github.com/kubernetes/kubernetes/pull/51582), [@jiulongzaitian](https://github.com/jiulongzaitian))
* Validate that cronjob names are 52 characters or less ([#52733](https://github.com/kubernetes/kubernetes/pull/52733), [@julia-stripe](https://github.com/julia-stripe))
* add readme file of ipvs ([#51937](https://github.com/kubernetes/kubernetes/pull/51937), [@Lion-Wei](https://github.com/Lion-Wei))



# v1.9.0-alpha.1
>>>>>>> merge master to 1.10, with fixes (#7682)

[Documentation](https://docs.k8s.io) & [Examples](https://releases.k8s.io/master/examples)

## Downloads for v1.10.0-alpha.1


filename | sha256 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes.tar.gz) | `403b90bfa32f7669b326045a629bd15941c533addcaf0c49d3c3c561da0542f2`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-src.tar.gz) | `266da065e9eddf19d36df5ad325f2f854101a0e712766148e87d998e789b80cf`

### Client Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-client-darwin-386.tar.gz) | `5aaa8e294ae4060d34828239e37f37b45fa5a69508374be668965102848626be`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-client-darwin-amd64.tar.gz) | `40a8e3bab11b88a2bb8e748f0b29da806d89b55775508039abe9c38c5f4ab97d`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-client-linux-386.tar.gz) | `e08dde0b561529f0b2bb39c141f4d7b1c943749ef7c1f9779facf5fb5b385d6a`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-client-linux-amd64.tar.gz) | `76a05d31acaab932ef45c67e1d6c9273933b8bc06dd5ce9bad3c7345d5267702`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-client-linux-arm64.tar.gz) | `4b833c9e80f3e4ac4958ea0ffb5ae564b31d2a524f6a14e58802937b2b936d73`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-client-linux-arm.tar.gz) | `f1484ab75010a2258ed7717b1284d0c139d17e194ac9e391b8f1c0999eec3c2d`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-client-linux-ppc64le.tar.gz) | `da884f09ec753925b2c1f27ea0a1f6c3da2056855fc88f47929bb3d6c2a09312`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-client-linux-s390x.tar.gz) | `c486f760c6707fc92d1659d3cbe33d68c03190760b73ac215957ee52f9c19195`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-client-windows-386.tar.gz) | `514c550b7ff85ac33e6ed333bcc06461651fe4004d8b7c12ca67f5dc1d2198bf`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-client-windows-amd64.tar.gz) | `ddad59222f6a8cb4e88c4330c2a967c4126cb22ac5e0d7126f9f65cca0fb9f45`

### Server Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-server-linux-amd64.tar.gz) | `514efd798ce1d7fe4233127f3334a3238faad6c26372a2d457eff02cbe72d756`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-server-linux-arm64.tar.gz) | `f71f75fb96221f65891fc3e04fd52ae4e5628da8b7b4fbedece3fab4cb650afa`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-server-linux-arm.tar.gz) | `a9d8c2386813fd690e60623a6ee1968fe8f0a1a8e13bc5cc12b2caf8e8a862e1`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-server-linux-ppc64le.tar.gz) | `21336a5e40aead4e2ec7e744a99d72bf8cb552341f3141abf8f235beb250cd93`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-server-linux-s390x.tar.gz) | `257e44d38fef83f08990b6b9b5e985118e867c0c33f0e869f0900397b9d30498`

### Node Binaries

filename | sha256 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-node-linux-amd64.tar.gz) | `97bf1210f0595ebf496ca7b000c4367f8a459d97ef72459efc6d0e07a072398f`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-node-linux-arm64.tar.gz) | `eebcd3c14fb4faeb82ab047a2152db528adc2d9f7b20eef6f5dc58202ebe3124`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-node-linux-arm.tar.gz) | `3d4428416c775a0a6463f623286bd2ecdf9240ce901e1fbae180dfb564c53ea1`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-node-linux-ppc64le.tar.gz) | `5cc96b24fad0ac1779a66f9b136d90e975b07bf619fea905e6c26ac5a4c41168`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-node-linux-s390x.tar.gz) | `134c13338edf4efcd511f4161742fbaa6dc232965d3d926c3de435e8a080fcbb`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.10.0-alpha.1/kubernetes-node-windows-amd64.tar.gz) | `ae54bf2bbcb99cdcde959140460d0f83c0ecb187d060b594ae9c5349960ab055`

## Changelog since v1.9.0

### Action Required

* [action required] Remove the kubelet's `--cloud-provider=auto-detect` feature ([#56287](https://github.com/kubernetes/kubernetes/pull/56287), [@stewart-yu](https://github.com/stewart-yu))

### Other notable changes

<<<<<<< HEAD
* Fix Heapster configuration and Metrics Server configuration to enable overriding default resource requirements. ([#56965](https://github.com/kubernetes/kubernetes/pull/56965), [@kawych](https://github.com/kawych))
* YAMLDecoder Read now returns the number of bytes read ([#57000](https://github.com/kubernetes/kubernetes/pull/57000), [@sel](https://github.com/sel))
* Retry 'connection refused' errors when setting up clusters on GCE. ([#57324](https://github.com/kubernetes/kubernetes/pull/57324), [@mborsz](https://github.com/mborsz))
* Update kubeadm's minimum supported Kubernetes version in v1.10.x to v1.9.0 ([#57233](https://github.com/kubernetes/kubernetes/pull/57233), [@xiangpengzhao](https://github.com/xiangpengzhao))
* Graduate CPU Manager feature from alpha to beta. ([#55977](https://github.com/kubernetes/kubernetes/pull/55977), [@ConnorDoyle](https://github.com/ConnorDoyle))
* Drop hacks used for Mesos integration that was already removed from main kubernetes repository ([#56754](https://github.com/kubernetes/kubernetes/pull/56754), [@dims](https://github.com/dims))
* Compare correct file names for volume detach operation ([#57053](https://github.com/kubernetes/kubernetes/pull/57053), [@prashima](https://github.com/prashima))
* Improved event generation in volume mount, attach, and extend operations ([#56872](https://github.com/kubernetes/kubernetes/pull/56872), [@davidz627](https://github.com/davidz627))
* GCE: bump COS image version to cos-stable-63-10032-71-0 ([#57204](https://github.com/kubernetes/kubernetes/pull/57204), [@yujuhong](https://github.com/yujuhong))
* fluentd-gcp updated to version 2.0.11. ([#56927](https://github.com/kubernetes/kubernetes/pull/56927), [@x13n](https://github.com/x13n))
* calico-node addon tolerates all NoExecute and NoSchedule taints by default. ([#57122](https://github.com/kubernetes/kubernetes/pull/57122), [@caseydavenport](https://github.com/caseydavenport))
* Support LoadBalancer for Azure Virtual Machine Scale Sets ([#57131](https://github.com/kubernetes/kubernetes/pull/57131), [@feiskyer](https://github.com/feiskyer))
* Makes the kube-dns addon optional so that users can deploy their own DNS solution. ([#57113](https://github.com/kubernetes/kubernetes/pull/57113), [@wwwtyro](https://github.com/wwwtyro))
* Enabled log rotation for load balancer's api logs to prevent running out of disk space. ([#56979](https://github.com/kubernetes/kubernetes/pull/56979), [@hyperbolic2346](https://github.com/hyperbolic2346))
* Remove ScrubDNS interface from cloudprovider. ([#56955](https://github.com/kubernetes/kubernetes/pull/56955), [@feiskyer](https://github.com/feiskyer))
* Fix `etcd-version-monitor` to backward compatibly support etcd 3.1 [go-grpc-prometheus](https://github.com/grpc-ecosystem/go-grpc-prometheus) metrics format. ([#56871](https://github.com/kubernetes/kubernetes/pull/56871), [@jpbetz](https://github.com/jpbetz))
* enable flexvolume on Windows node ([#56921](https://github.com/kubernetes/kubernetes/pull/56921), [@andyzhangx](https://github.com/andyzhangx))
* When using Role-Based Access Control, the "admin", "edit", and "view" roles now have the expected permissions on NetworkPolicy resources. ([#56650](https://github.com/kubernetes/kubernetes/pull/56650), [@danwinship](https://github.com/danwinship))
* Fix the PersistentVolumeLabel controller from initializing the PV labels when it's not the next pending initializer. ([#56831](https://github.com/kubernetes/kubernetes/pull/56831), [@jhorwit2](https://github.com/jhorwit2))
* kube-apiserver: The external hostname no longer use the cloud provider API to select a default. It can be set explicitly using --external-hostname, if needed. ([#56812](https://github.com/kubernetes/kubernetes/pull/56812), [@dims](https://github.com/dims))
* Use GiB unit for creating and resizing volumes for Glusterfs ([#56581](https://github.com/kubernetes/kubernetes/pull/56581), [@gnufied](https://github.com/gnufied))
* PersistentVolume flexVolume sources can now reference secrets in a namespace other than the PersistentVolumeClaim's namespace. ([#56460](https://github.com/kubernetes/kubernetes/pull/56460), [@liggitt](https://github.com/liggitt))
* Scheduler skips pods that use a PVC that either does not exist or is being deleted. ([#55957](https://github.com/kubernetes/kubernetes/pull/55957), [@jsafrane](https://github.com/jsafrane))
* Fixed a garbage collection race condition where objects with ownerRefs pointing to cluster-scoped objects could be deleted incorrectly. ([#57211](https://github.com/kubernetes/kubernetes/pull/57211), [@liggitt](https://github.com/liggitt))
* Kubectl explain now prints out the Kind and API version of the resource being explained ([#55689](https://github.com/kubernetes/kubernetes/pull/55689), [@luksa](https://github.com/luksa))
* api-server provides specific events when unable to repair a service cluster ip or node port ([#54304](https://github.com/kubernetes/kubernetes/pull/54304), [@frodenas](https://github.com/frodenas))
* Added docker-logins config to kubernetes-worker charm ([#56217](https://github.com/kubernetes/kubernetes/pull/56217), [@Cynerva](https://github.com/Cynerva))
* delete useless params containerized ([#56146](https://github.com/kubernetes/kubernetes/pull/56146), [@jiulongzaitian](https://github.com/jiulongzaitian))
* add mount options support for azure disk ([#56147](https://github.com/kubernetes/kubernetes/pull/56147), [@andyzhangx](https://github.com/andyzhangx))
* Use structured generator for kubectl autoscale  ([#55913](https://github.com/kubernetes/kubernetes/pull/55913), [@wackxu](https://github.com/wackxu))
* K8s supports cephfs fuse mount. ([#55866](https://github.com/kubernetes/kubernetes/pull/55866), [@zhangxiaoyu-zidif](https://github.com/zhangxiaoyu-zidif))
* COS: Keep the docker network checkpoint ([#54805](https://github.com/kubernetes/kubernetes/pull/54805), [@yujuhong](https://github.com/yujuhong))
* Fixed documentation typo in IPVS README. ([#56578](https://github.com/kubernetes/kubernetes/pull/56578), [@shift](https://github.com/shift))


See the [Releases Page](https://github.com/kubernetes/kubernetes/releases) for older releases.
||||||| merged common ancestors
* PersistentVolumeLabel admission controller is now deprecated. ([#52618](https://github.com/kubernetes/kubernetes/pull/52618), [@dims](https://github.com/dims))
* Mark the LBaaS v1 of OpenStack cloud provider deprecated. ([#52821](https://github.com/kubernetes/kubernetes/pull/52821), [@FengyunPan](https://github.com/FengyunPan))
* NONE ([#52819](https://github.com/kubernetes/kubernetes/pull/52819), [@verult](https://github.com/verult))
* Mark image as deliberately optional in v1 Container struct.  Many objects in the Kubernetes API inherit the container struct and only Pods require the field to be set. ([#48406](https://github.com/kubernetes/kubernetes/pull/48406), [@gyliu513](https://github.com/gyliu513))
* [fluentd-gcp addon] Update Stackdriver plugin to version 0.6.7 ([#52565](https://github.com/kubernetes/kubernetes/pull/52565), [@crassirostris](https://github.com/crassirostris))
* Remove duplicate proto errors in kubelet. ([#52132](https://github.com/kubernetes/kubernetes/pull/52132), [@adityadani](https://github.com/adityadani))
* [fluentd-gcp addon] Remove audit logs from the fluentd configuration ([#52777](https://github.com/kubernetes/kubernetes/pull/52777), [@crassirostris](https://github.com/crassirostris))
* Set defaults for successfulJobsHistoryLimit (3) and failedJobsHistoryLimit (1) in batch/v1beta1.CronJobs ([#52533](https://github.com/kubernetes/kubernetes/pull/52533), [@soltysh](https://github.com/soltysh))
* Fix: update system spec to support Docker 17.03 ([#52666](https://github.com/kubernetes/kubernetes/pull/52666), [@yguo0905](https://github.com/yguo0905))
* Fix panic in ControllerManager on GCE when it has a problem with creating external loadbalancer healthcheck ([#52646](https://github.com/kubernetes/kubernetes/pull/52646), [@gmarek](https://github.com/gmarek))
* PSP: add support for using `*` as a value in `allowedCapabilities` to allow to request any capabilities ([#51337](https://github.com/kubernetes/kubernetes/pull/51337), [@php-coder](https://github.com/php-coder))
* [fluentd-gcp addon] By default ingest apiserver audit logs written to file in JSON format. ([#52541](https://github.com/kubernetes/kubernetes/pull/52541), [@crassirostris](https://github.com/crassirostris))
* The autoscaling/v2beta1 API group is now enabled by default. ([#52549](https://github.com/kubernetes/kubernetes/pull/52549), [@DirectXMan12](https://github.com/DirectXMan12))
* Add CLUSTER_SIGNING_DURATION environment variable to cluster ([#52497](https://github.com/kubernetes/kubernetes/pull/52497), [@jcbsmpsn](https://github.com/jcbsmpsn))
    * configuration scripts to allow configuration of signing duration of
    * certificates issued via the Certificate Signing Request API.
* Introduce policy to allow the HPA to consume the metrics.k8s.io and custom.metrics.k8s.io API groups. ([#52572](https://github.com/kubernetes/kubernetes/pull/52572), [@DirectXMan12](https://github.com/DirectXMan12))
* kubelet to master communication when doing node status updates now has a timeout to prevent indefinite hangs ([#52176](https://github.com/kubernetes/kubernetes/pull/52176), [@liggitt](https://github.com/liggitt))
* Introduced Metrics Server in version v0.2.0. For more details see https://github.com/kubernetes-incubator/metrics-server/releases/tag/v0.2.0. ([#52548](https://github.com/kubernetes/kubernetes/pull/52548), [@piosz](https://github.com/piosz))
* Adds ROTATE_CERTIFICATES environment variable to kube-up.sh script for GCE ([#52115](https://github.com/kubernetes/kubernetes/pull/52115), [@jcbsmpsn](https://github.com/jcbsmpsn))
    * clusters. When that var is set to true, the command line flag enabling kubelet
    * client certificate rotation will be added to the kubelet command line.
* Make sure that resources being updated are handled correctly by Quota system ([#52452](https://github.com/kubernetes/kubernetes/pull/52452), [@gnufied](https://github.com/gnufied))
* WATCHLIST calls are now reported as WATCH verbs in prometheus for the apiserver_request_* series.  A new "scope" label is added to all apiserver_request_* values that is either 'cluster', 'resource', or 'namespace' depending on which level the query is performed at. ([#52237](https://github.com/kubernetes/kubernetes/pull/52237), [@smarterclayton](https://github.com/smarterclayton))
* Fixed the webhook admission plugin so that it works even if the apiserver and the nodes are in two networks (e.g., in GKE). ([#50476](https://github.com/kubernetes/kubernetes/pull/50476), [@caesarxuchao](https://github.com/caesarxuchao))
    * Fixed the webhook admission plugin so that webhook author could use the DNS name of the service as the CommonName when generating the server cert for the webhook.
    * Action required:
    * Anyone who generated server cert for admission webhooks need to regenerate the cert. Previously, when generating server cert for the admission webhook, the CN value doesn't matter. Now you must set it to the DNS name of the webhook service, i.e., `<service.Name>.<service.Namespace>.svc`.
* Ignore pods marked for deletion that exceed their grace period in ResourceQuota ([#46542](https://github.com/kubernetes/kubernetes/pull/46542), [@derekwaynecarr](https://github.com/derekwaynecarr))
* custom resources that use unconventional pluralization now work properly with kubectl and garbage collection ([#50012](https://github.com/kubernetes/kubernetes/pull/50012), [@deads2k](https://github.com/deads2k))
* [fluentd-gcp addon] Fluentd will trim lines exceeding 100KB instead of dropping them. ([#52289](https://github.com/kubernetes/kubernetes/pull/52289), [@crassirostris](https://github.com/crassirostris))
* dockershim: check the error when syncing the checkpoint. ([#52125](https://github.com/kubernetes/kubernetes/pull/52125), [@yujuhong](https://github.com/yujuhong))
* By default, clusters on GCE no longer sends RequestReceived audit event, if advanced audit is configured. ([#52343](https://github.com/kubernetes/kubernetes/pull/52343), [@crassirostris](https://github.com/crassirostris))
* [BugFix] Soft Eviction timer works correctly ([#52046](https://github.com/kubernetes/kubernetes/pull/52046), [@dashpole](https://github.com/dashpole))
* Azuredisk mount on windows node ([#51252](https://github.com/kubernetes/kubernetes/pull/51252), [@andyzhangx](https://github.com/andyzhangx))
* [fluentd-gcp addon] Bug with event-exporter leaking memory on metrics in clusters with CA is fixed. ([#52263](https://github.com/kubernetes/kubernetes/pull/52263), [@crassirostris](https://github.com/crassirostris))
* kubeadm: Enable kubelet client certificate rotation ([#52196](https://github.com/kubernetes/kubernetes/pull/52196), [@luxas](https://github.com/luxas))
* Scheduler predicate developer should respect equivalence class cache ([#52146](https://github.com/kubernetes/kubernetes/pull/52146), [@resouer](https://github.com/resouer))
* The `kube-cloud-controller-manager` flag `--service-account-private-key-file` was non-functional and is now deprecated. ([#50289](https://github.com/kubernetes/kubernetes/pull/50289), [@liggitt](https://github.com/liggitt))
    * The `kube-cloud-controller-manager` flag `--use-service-account-credentials` is now honored consistently, regardless of whether `--service-account-private-key-file` was specified.
* Fix credentials providers for docker sandbox image. ([#51870](https://github.com/kubernetes/kubernetes/pull/51870), [@feiskyer](https://github.com/feiskyer))
* NONE ([#52120](https://github.com/kubernetes/kubernetes/pull/52120), [@abgworrall](https://github.com/abgworrall))
* Fixed an issue looking up cronjobs when they existed in more than one API version ([#52227](https://github.com/kubernetes/kubernetes/pull/52227), [@liggitt](https://github.com/liggitt))
* Add priority-based preemption to the scheduler. ([#50949](https://github.com/kubernetes/kubernetes/pull/50949), [@bsalamat](https://github.com/bsalamat))
* Add CLUSTER_SIGNING_DURATION environment variable to cluster configuration scripts ([#51844](https://github.com/kubernetes/kubernetes/pull/51844), [@jcbsmpsn](https://github.com/jcbsmpsn))
    * to allow configuration of signing duration of certificates issued via the Certificate
    * Signing Request API.
* Adding German translation for kubectl ([#51867](https://github.com/kubernetes/kubernetes/pull/51867), [@Steffen911](https://github.com/Steffen911))
* The ScaleIO volume plugin can now read the SDC GUID value as node label scaleio.sdcGuid; if binary drv_cfg is not installed, the plugin will still work properly; if node label not found, it defaults to drv_cfg if installed. ([#50780](https://github.com/kubernetes/kubernetes/pull/50780), [@vladimirvivien](https://github.com/vladimirvivien))
* A policy with 0 rules should return an error ([#51782](https://github.com/kubernetes/kubernetes/pull/51782), [@charrywanganthony](https://github.com/charrywanganthony))
* Log a warning when --audit-policy-file not passed to apiserver ([#52071](https://github.com/kubernetes/kubernetes/pull/52071), [@CaoShuFeng](https://github.com/CaoShuFeng))
* Fixes an issue with upgrade requests made via pod/service/node proxy subresources sending a non-absolute HTTP request-uri to backends ([#52065](https://github.com/kubernetes/kubernetes/pull/52065), [@liggitt](https://github.com/liggitt))
* kubeadm: add `kubeadm phase addons` command ([#51171](https://github.com/kubernetes/kubernetes/pull/51171), [@andrewrynhard](https://github.com/andrewrynhard))
* Fix for Nodes in vSphere lacking an InternalIP. ([#48760](https://github.com/kubernetes/kubernetes/pull/48760)) ([#49202](https://github.com/kubernetes/kubernetes/pull/49202), [@cbonte](https://github.com/cbonte))
* v2 of the autoscaling API group, including improvements to the HorizontalPodAutoscaler, has moved from alpha1 to beta1. ([#50708](https://github.com/kubernetes/kubernetes/pull/50708), [@DirectXMan12](https://github.com/DirectXMan12))
* Fixed a bug where some alpha features were enabled by default. ([#51839](https://github.com/kubernetes/kubernetes/pull/51839), [@jennybuckley](https://github.com/jennybuckley))
* Implement StatsProvider interface using CRI stats ([#51557](https://github.com/kubernetes/kubernetes/pull/51557), [@yguo0905](https://github.com/yguo0905))
* set AdvancedAuditing feature gate to true by default ([#51943](https://github.com/kubernetes/kubernetes/pull/51943), [@CaoShuFeng](https://github.com/CaoShuFeng))
* Migrate the metrics/v1alpha1 API to metrics/v1beta1.  The HorizontalPodAutoscaler ([#51653](https://github.com/kubernetes/kubernetes/pull/51653), [@DirectXMan12](https://github.com/DirectXMan12))
    * controller REST client now uses that version.  For v1beta1, the API is now known as
    * resource-metrics.metrics.k8s.io.
* In GCE with COS, increase TasksMax for Docker service to raise cap on number of threads/processes used by containers. ([#51986](https://github.com/kubernetes/kubernetes/pull/51986), [@yujuhong](https://github.com/yujuhong))
* Fixes an issue with APIService auto-registration affecting rolling HA apiserver restarts that add or remove API groups being served. ([#51921](https://github.com/kubernetes/kubernetes/pull/51921), [@liggitt](https://github.com/liggitt))
* Sharing a PID namespace between containers in a pod is disabled by default in 1.8. To enable for a node, use the --docker-disable-shared-pid=false kubelet flag. Note that PID namespace sharing requires docker >= 1.13.1. ([#51634](https://github.com/kubernetes/kubernetes/pull/51634), [@verb](https://github.com/verb))
* Build test targets for all server platforms ([#51873](https://github.com/kubernetes/kubernetes/pull/51873), [@luxas](https://github.com/luxas))
* Add EgressRule to NetworkPolicy ([#51351](https://github.com/kubernetes/kubernetes/pull/51351), [@cmluciano](https://github.com/cmluciano))
* Allow DNS resolution of service name for COS using containerized mounter.  It fixed the issue with DNS resolution of NFS and Gluster services. ([#51645](https://github.com/kubernetes/kubernetes/pull/51645), [@jingxu97](https://github.com/jingxu97))
* Fix journalctl leak on kubelet restart ([#51751](https://github.com/kubernetes/kubernetes/pull/51751), [@dashpole](https://github.com/dashpole))
    * Fix container memory rss
    * Add hugepages monitoring support
    * Fix incorrect CPU usage metrics with 4.7 kernel
    * Add tmpfs monitoring support
* Support for Huge pages in empty_dir volume plugin ([#50072](https://github.com/kubernetes/kubernetes/pull/50072), [@squall0gd](https://github.com/squall0gd))
    * [Huge pages](https://www.kernel.org/doc/Documentation/vm/hugetlbpage.txt) can now be used with empty dir volume plugin.
* Alpha support for pre-allocated hugepages ([#50859](https://github.com/kubernetes/kubernetes/pull/50859), [@derekwaynecarr](https://github.com/derekwaynecarr))
* add support for client-side spam filtering of events ([#47367](https://github.com/kubernetes/kubernetes/pull/47367), [@derekwaynecarr](https://github.com/derekwaynecarr))
* Provide a way to omit Event stages in audit policy ([#49280](https://github.com/kubernetes/kubernetes/pull/49280), [@CaoShuFeng](https://github.com/CaoShuFeng))
* Introduced Metrics Server ([#51792](https://github.com/kubernetes/kubernetes/pull/51792), [@piosz](https://github.com/piosz))
* Implement Controller for growing persistent volumes ([#49727](https://github.com/kubernetes/kubernetes/pull/49727), [@gnufied](https://github.com/gnufied))
* Kubernetes 1.8 supports docker version 1.11.x, 1.12.x and 1.13.x. And also supports overlay2. ([#51845](https://github.com/kubernetes/kubernetes/pull/51845), [@Random-Liu](https://github.com/Random-Liu))
* The Deployment, DaemonSet, and ReplicaSet kinds in the extensions/v1beta1 group version are now deprecated, as are the Deployment, StatefulSet, and ControllerRevision kinds in apps/v1beta1. As they will not be removed until after a GA version becomes available, you may continue to use these kinds in existing code. However, all new code should be developed against the apps/v1beta2 group version. ([#51828](https://github.com/kubernetes/kubernetes/pull/51828), [@kow3ns](https://github.com/kow3ns))
* kubeadm: Detect kubelet readiness and error out if the kubelet is unhealthy ([#51369](https://github.com/kubernetes/kubernetes/pull/51369), [@luxas](https://github.com/luxas))
* Fix providerID update validation ([#51761](https://github.com/kubernetes/kubernetes/pull/51761), [@karataliu](https://github.com/karataliu))
* Calico has been updated to v2.5, RBAC added, and is now automatically scaled when GCE clusters are resized. ([#51237](https://github.com/kubernetes/kubernetes/pull/51237), [@gunjan5](https://github.com/gunjan5))
* Add backoff policy and failed pod limit for a job ([#51153](https://github.com/kubernetes/kubernetes/pull/51153), [@clamoriniere1A](https://github.com/clamoriniere1A))
* Adds a new alpha EventRateLimit admission control that is used to limit the number of event queries that are accepted by the API Server. ([#50925](https://github.com/kubernetes/kubernetes/pull/50925), [@staebler](https://github.com/staebler))
* The OpenID Connect authenticator can now use a custom prefix, or omit the default prefix, for username and groups claims through the --oidc-username-prefix and --oidc-groups-prefix flags. For example, the authenticator can map a user with the username "jane" to "google:jane" by supplying the "google:" username prefix. ([#50875](https://github.com/kubernetes/kubernetes/pull/50875), [@ericchiang](https://github.com/ericchiang))
* Implemented `kubeadm upgrade plan` for checking whether you can upgrade your cluster to a newer version ([#48899](https://github.com/kubernetes/kubernetes/pull/48899), [@luxas](https://github.com/luxas))
    * Implemented `kubeadm upgrade apply` for upgrading your cluster from one version to an other
* Switch to audit.k8s.io/v1beta1 in audit. ([#51719](https://github.com/kubernetes/kubernetes/pull/51719), [@soltysh](https://github.com/soltysh))
* update QEMU version to v2.9.1 ([#50597](https://github.com/kubernetes/kubernetes/pull/50597), [@dixudx](https://github.com/dixudx))
* controllers backoff better in face of quota denial ([#49142](https://github.com/kubernetes/kubernetes/pull/49142), [@joelsmith](https://github.com/joelsmith))
* The event table output under `kubectl describe` has been simplified to show only the most essential info. ([#51748](https://github.com/kubernetes/kubernetes/pull/51748), [@smarterclayton](https://github.com/smarterclayton))
* Use arm32v7|arm64v8 images instead of the deprecated armhf|aarch64 image organizations ([#50602](https://github.com/kubernetes/kubernetes/pull/50602), [@dixudx](https://github.com/dixudx))
* audit newest impersonated user info in the ResponseStarted, ResponseComplete audit stage ([#48184](https://github.com/kubernetes/kubernetes/pull/48184), [@CaoShuFeng](https://github.com/CaoShuFeng))
* Fixed bug in AWS provider to handle multiple IPs when using more than 1 network interface per ec2 instance. ([#50112](https://github.com/kubernetes/kubernetes/pull/50112), [@jlz27](https://github.com/jlz27))
* Add flag "--include-uninitialized" to kubectl annotate, apply, edit-last-applied, delete, describe, edit, get, label, set. "--include-uninitialized=true" makes kubectl commands apply to uninitialized objects, which by default are ignored if the names of the objects are not provided. "--all" also makes kubectl commands apply to uninitialized objects. Please see the [initializer](https://kubernetes.io/docs/admin/extensible-admission-controllers/) doc for more details. ([#50497](https://github.com/kubernetes/kubernetes/pull/50497), [@dixudx](https://github.com/dixudx))
* GCE: Service object now supports "Network Tiers" as an Alpha feature via annotations. ([#51301](https://github.com/kubernetes/kubernetes/pull/51301), [@yujuhong](https://github.com/yujuhong))
* When using kube-up.sh on GCE, user could set env `ENABLE_POD_PRIORITY=true` to enable pod priority feature gate. ([#51069](https://github.com/kubernetes/kubernetes/pull/51069), [@MrHohn](https://github.com/MrHohn))
* The names generated for ControllerRevision and ReplicaSet are consistent with the GenerateName functionality of the API Server and will not contain "bad words". ([#51538](https://github.com/kubernetes/kubernetes/pull/51538), [@kow3ns](https://github.com/kow3ns))
* PersistentVolumeClaim metrics like "volume_stats_inodes" and "volume_stats_capacity_bytes" are now reported via kubelet prometheus ([#51553](https://github.com/kubernetes/kubernetes/pull/51553), [@wongma7](https://github.com/wongma7))
* When using IP aliases, use a secondary range rather than subnetwork to reserve cluster IPs. ([#51690](https://github.com/kubernetes/kubernetes/pull/51690), [@bowei](https://github.com/bowei))
* IPAM controller unifies handling of node pod CIDR range allocation. ([#51374](https://github.com/kubernetes/kubernetes/pull/51374), [@bowei](https://github.com/bowei))
    * It is intended to supersede the logic that is currently in range_allocator 
    * and cloud_cidr_allocator. (ALPHA FEATURE)
    * Note: for this change, the other allocators still exist and are the default.
    * It supports two modes:
        * CIDR range allocations done within the cluster that are then propagated out to the cloud provider.
        * Cloud provider managed IPAM that is then reflected into the cluster.
* The Kubernetes API server now supports the ability to break large LIST calls into multiple smaller chunks.  A client can specify a limit to the number of results to return, and if more results exist a token will be returned that allows the client to continue the previous list call repeatedly until all results are retrieved.  The resulting list is identical to a list call that does not perform chunking thanks to capabilities provided by etcd3.  This allows the server to use less memory and CPU responding with very large lists.  This feature is gated as APIListChunking and is not enabled by default.  The 1.9 release will begin using this by default from all informers. ([#48921](https://github.com/kubernetes/kubernetes/pull/48921), [@smarterclayton](https://github.com/smarterclayton))
* add reconcile command to kubectl auth ([#51636](https://github.com/kubernetes/kubernetes/pull/51636), [@deads2k](https://github.com/deads2k))
* Advanced audit allows logging failed login attempts ([#51119](https://github.com/kubernetes/kubernetes/pull/51119), [@soltysh](https://github.com/soltysh))
* kubeadm: Add support for using an external CA whose key is never stored in the cluster ([#50832](https://github.com/kubernetes/kubernetes/pull/50832), [@nckturner](https://github.com/nckturner))
* the custom metrics API (custom.metrics.k8s.io) has moved from v1alpha1 to v1beta1 ([#50920](https://github.com/kubernetes/kubernetes/pull/50920), [@DirectXMan12](https://github.com/DirectXMan12))
* Add backoff policy and failed pod limit for a job ([#48075](https://github.com/kubernetes/kubernetes/pull/48075), [@clamoriniere1A](https://github.com/clamoriniere1A))
* Performs validation (when applying for example) against OpenAPI schema rather than Swagger 1.0. ([#51364](https://github.com/kubernetes/kubernetes/pull/51364), [@apelisse](https://github.com/apelisse))
* Make all e2e tests lookup image to use from a centralized place. In that centralized place, add support for multiple platforms. ([#49457](https://github.com/kubernetes/kubernetes/pull/49457), [@mkumatag](https://github.com/mkumatag))
* kubelet has alpha support for mount propagation. It is disabled by default and it is there for testing only. This feature may be redesigned or even removed in a future release. ([#46444](https://github.com/kubernetes/kubernetes/pull/46444), [@jsafrane](https://github.com/jsafrane))
* Add selfsubjectrulesreview API for allowing users to query which permissions they have in a given namespace. ([#48051](https://github.com/kubernetes/kubernetes/pull/48051), [@xilabao](https://github.com/xilabao))
* Kubelet re-binds /var/lib/kubelet directory with rshared mount propagation during startup if it is not shared yet. ([#45724](https://github.com/kubernetes/kubernetes/pull/45724), [@jsafrane](https://github.com/jsafrane))
* Deviceplugin jiayingz ([#51209](https://github.com/kubernetes/kubernetes/pull/51209), [@jiayingz](https://github.com/jiayingz))
* Make logdump support kubemark and support gke with 'use_custom_instance_list' ([#51834](https://github.com/kubernetes/kubernetes/pull/51834), [@shyamjvs](https://github.com/shyamjvs))
* add apps/v1beta2 conversion test ([#49645](https://github.com/kubernetes/kubernetes/pull/49645), [@dixudx](https://github.com/dixudx))
* Fixed an issue ([#47800](https://github.com/kubernetes/kubernetes/pull/47800)) where `kubectl logs -f` failed with `unexpected stream type ""`. ([#50381](https://github.com/kubernetes/kubernetes/pull/50381), [@sczizzo](https://github.com/sczizzo))
* GCE: Internal load balancer IPs are now reserved during service sync to prevent losing the address to another service. ([#51055](https://github.com/kubernetes/kubernetes/pull/51055), [@nicksardo](https://github.com/nicksardo))
* Switch JSON marshal/unmarshal to json-iterator library.  Performance should be close to previous with no generated code. ([#48287](https://github.com/kubernetes/kubernetes/pull/48287), [@thockin](https://github.com/thockin))
* Adds optional group and version information to the discovery interface, so that if an endpoint uses non-default values, the proper value of "kind" can be determined. Scale is a common example. ([#49971](https://github.com/kubernetes/kubernetes/pull/49971), [@deads2k](https://github.com/deads2k))
* Fix security holes in GCE metadata proxy. ([#51302](https://github.com/kubernetes/kubernetes/pull/51302), [@ihmccreery](https://github.com/ihmccreery))
* [#43077](https://github.com/kubernetes/kubernetes/pull/43077) introduced a condition where DaemonSet controller did not respect the TerminationGracePeriodSeconds of the Pods it created. This is now corrected. ([#51279](https://github.com/kubernetes/kubernetes/pull/51279), [@kow3ns](https://github.com/kow3ns))
* Tainted nodes by conditions as following: ([#49257](https://github.com/kubernetes/kubernetes/pull/49257), [@k82cn](https://github.com/k82cn))
          * 'node.kubernetes.io/network-unavailable=:NoSchedule' if NetworkUnavailable is true
          * 'node.kubernetes.io/disk-pressure=:NoSchedule' if DiskPressure is true
          * 'node.kubernetes.io/memory-pressure=:NoSchedule' if MemoryPressure is true
          * 'node.kubernetes.io/out-of-disk=:NoSchedule' if OutOfDisk is true
* rbd: default image format to v2 instead of deprecated v1 ([#51574](https://github.com/kubernetes/kubernetes/pull/51574), [@dillaman](https://github.com/dillaman))
* Surface reasonable error when client detects connection closed. ([#51381](https://github.com/kubernetes/kubernetes/pull/51381), [@mengqiy](https://github.com/mengqiy))
* Allow PSP's to specify a whitelist of allowed paths for host volume ([#50212](https://github.com/kubernetes/kubernetes/pull/50212), [@jhorwit2](https://github.com/jhorwit2))
* For Deployment, ReplicaSet, and DaemonSet, selectors are now immutable when updating via the new `apps/v1beta2` API. For backward compatibility, selectors can still be changed when updating via `apps/v1beta1` or `extensions/v1beta1`. ([#50719](https://github.com/kubernetes/kubernetes/pull/50719), [@crimsonfaith91](https://github.com/crimsonfaith91))
* Allows kubectl to use http caching mechanism for the OpenAPI schema. The cache directory can be configured through `--cache-dir` command line flag to kubectl. If set to empty string, caching will be disabled. ([#50404](https://github.com/kubernetes/kubernetes/pull/50404), [@apelisse](https://github.com/apelisse))
* Pod log attempts are now reported in apiserver prometheus metrics with verb `CONNECT` since they can run for very long periods of time. ([#50123](https://github.com/kubernetes/kubernetes/pull/50123), [@WIZARD-CXY](https://github.com/WIZARD-CXY))
* The `emptyDir.sizeLimit` field is now correctly omitted from API requests and responses when unset. ([#50163](https://github.com/kubernetes/kubernetes/pull/50163), [@jingxu97](https://github.com/jingxu97))
* Promote CronJobs to batch/v1beta1. ([#51465](https://github.com/kubernetes/kubernetes/pull/51465), [@soltysh](https://github.com/soltysh))
* Add local ephemeral storage support to LimitRange ([#50757](https://github.com/kubernetes/kubernetes/pull/50757), [@NickrenREN](https://github.com/NickrenREN))
* Add mount options field to StorageClass. The options listed there are automatically added to PVs provisioned using the class. ([#51228](https://github.com/kubernetes/kubernetes/pull/51228), [@wongma7](https://github.com/wongma7))
* Add 'kubectl set env' command for setting environment variables inside containers for resources embedding pod templates ([#50998](https://github.com/kubernetes/kubernetes/pull/50998), [@zjj2wry](https://github.com/zjj2wry))
* Implement IPVS-based in-cluster service load balancing ([#46580](https://github.com/kubernetes/kubernetes/pull/46580), [@dujun1990](https://github.com/dujun1990))
* Release the kubelet client certificate rotation as beta. ([#51045](https://github.com/kubernetes/kubernetes/pull/51045), [@jcbsmpsn](https://github.com/jcbsmpsn))
* Adds --append-hash flag to kubectl create configmap/secret, which will append a short hash of the configmap/secret contents to the name during creation. ([#49961](https://github.com/kubernetes/kubernetes/pull/49961), [@mtaufen](https://github.com/mtaufen))
* Add validation for CustomResources via JSON Schema. ([#47263](https://github.com/kubernetes/kubernetes/pull/47263), [@nikhita](https://github.com/nikhita))
* enqueue a sync task to wake up jobcontroller to check job ActiveDeadlineSeconds in time ([#48454](https://github.com/kubernetes/kubernetes/pull/48454), [@weiwei04](https://github.com/weiwei04))
* Remove previous local ephemeral storage resource names: "ResourceStorageOverlay" and "ResourceStorageScratch" ([#51425](https://github.com/kubernetes/kubernetes/pull/51425), [@NickrenREN](https://github.com/NickrenREN))
* Add `retainKeys` to patchStrategy for v1 Volumes and extentions/v1beta1 DeploymentStrategy. ([#50296](https://github.com/kubernetes/kubernetes/pull/50296), [@mengqiy](https://github.com/mengqiy))
* Add mount options field to PersistentVolume spec ([#50919](https://github.com/kubernetes/kubernetes/pull/50919), [@wongma7](https://github.com/wongma7))
* Use of the alpha initializers feature now requires enabling the `Initializers` feature gate. This feature gate is auto-enabled if the `Initialzers` admission plugin is enabled. ([#51436](https://github.com/kubernetes/kubernetes/pull/51436), [@liggitt](https://github.com/liggitt))
* Fix inconsistent Prometheus cAdvisor metrics ([#51473](https://github.com/kubernetes/kubernetes/pull/51473), [@bboreham](https://github.com/bboreham))
* Add local ephemeral storage to downward API  ([#50435](https://github.com/kubernetes/kubernetes/pull/50435), [@NickrenREN](https://github.com/NickrenREN))
* kubectl zsh autocompletion will work with compinit ([#50561](https://github.com/kubernetes/kubernetes/pull/50561), [@cblecker](https://github.com/cblecker))
* [Experiment Only] When using kube-up.sh on GCE, user could set env `KUBE_PROXY_DAEMONSET=true` to run kube-proxy as a DaemonSet. kube-proxy is run as static pods by default. ([#50705](https://github.com/kubernetes/kubernetes/pull/50705), [@MrHohn](https://github.com/MrHohn))
* Add --request-timeout to kube-apiserver to make global request timeout configurable. ([#51415](https://github.com/kubernetes/kubernetes/pull/51415), [@jpbetz](https://github.com/jpbetz))
* Deprecate auto detecting cloud providers in kubelet. Auto detecting cloud providers go against the initiative for out-of-tree cloud providers as we'll now depend on cAdvisor integrations with cloud providers instead of the core repo. In the near future, `--cloud-provider` for kubelet will either be an empty string or `external`.  ([#51312](https://github.com/kubernetes/kubernetes/pull/51312), [@andrewsykim](https://github.com/andrewsykim))
* Add local ephemeral storage support to Quota ([#49610](https://github.com/kubernetes/kubernetes/pull/49610), [@NickrenREN](https://github.com/NickrenREN))
* Kubelet updates default labels if those are deprecated ([#47044](https://github.com/kubernetes/kubernetes/pull/47044), [@mrIncompetent](https://github.com/mrIncompetent))
* Add error count and time-taken metrics for storage operations such as mount and attach, per-volume-plugin. ([#50036](https://github.com/kubernetes/kubernetes/pull/50036), [@wongma7](https://github.com/wongma7))
* A new predicates, named 'CheckNodeCondition', was added to replace node condition filter. 'NetworkUnavailable', 'OutOfDisk' and 'NotReady' maybe reported as a reason when failed to schedule pods. ([#51117](https://github.com/kubernetes/kubernetes/pull/51117), [@k82cn](https://github.com/k82cn))
* Add support for configurable groups for bootstrap token authentication. ([#50933](https://github.com/kubernetes/kubernetes/pull/50933), [@mattmoyer](https://github.com/mattmoyer))
* Fix forbidden message format ([#49006](https://github.com/kubernetes/kubernetes/pull/49006), [@CaoShuFeng](https://github.com/CaoShuFeng))
* make volumesInUse sorted in node status updates ([#49849](https://github.com/kubernetes/kubernetes/pull/49849), [@dixudx](https://github.com/dixudx))
* Adds `InstanceExists` and `InstanceExistsByProviderID` to cloud provider interface for the cloud controller manager ([#51087](https://github.com/kubernetes/kubernetes/pull/51087), [@prydie](https://github.com/prydie))
* Dynamic Flexvolume plugin discovery. Flexvolume plugins can now be discovered on the fly rather than only at system initialization time. ([#50031](https://github.com/kubernetes/kubernetes/pull/50031), [@verult](https://github.com/verult))
* add fieldSelector spec.schedulerName ([#50582](https://github.com/kubernetes/kubernetes/pull/50582), [@dixudx](https://github.com/dixudx))
* Change eviction manager to manage one single local ephemeral storage resource ([#50889](https://github.com/kubernetes/kubernetes/pull/50889), [@NickrenREN](https://github.com/NickrenREN))
* Cloud Controller Manager now sets Node.Spec.ProviderID ([#50730](https://github.com/kubernetes/kubernetes/pull/50730), [@andrewsykim](https://github.com/andrewsykim))
* Paramaterize session affinity timeout seconds in service API for Client IP based session affinity. ([#49850](https://github.com/kubernetes/kubernetes/pull/49850), [@m1093782566](https://github.com/m1093782566))
* Changing scheduling part of the alpha feature 'LocalStorageCapacityIsolation' to manage one single local ephemeral storage resource ([#50819](https://github.com/kubernetes/kubernetes/pull/50819), [@NickrenREN](https://github.com/NickrenREN))
* set --audit-log-format default to json ([#50971](https://github.com/kubernetes/kubernetes/pull/50971), [@CaoShuFeng](https://github.com/CaoShuFeng))
* kubeadm: Implement a `--dry-run` mode and flag for `kubeadm` ([#51122](https://github.com/kubernetes/kubernetes/pull/51122), [@luxas](https://github.com/luxas))
* kubectl rollout `history`, `status`, and `undo` subcommands now support StatefulSets. ([#49674](https://github.com/kubernetes/kubernetes/pull/49674), [@crimsonfaith91](https://github.com/crimsonfaith91))
* Add IPBlock to Network Policy ([#50033](https://github.com/kubernetes/kubernetes/pull/50033), [@cmluciano](https://github.com/cmluciano))
* Adding Italian translation for kubectl ([#50155](https://github.com/kubernetes/kubernetes/pull/50155), [@lucab85](https://github.com/lucab85))
* Simplify capabilities handling in FlexVolume. ([#51169](https://github.com/kubernetes/kubernetes/pull/51169), [@MikaelCluseau](https://github.com/MikaelCluseau))
* NONE ([#50669](https://github.com/kubernetes/kubernetes/pull/50669), [@jiulongzaitian](https://github.com/jiulongzaitian))
* cloudprovider.Zones should support external cloud providers ([#50858](https://github.com/kubernetes/kubernetes/pull/50858), [@andrewsykim](https://github.com/andrewsykim))
* Finalizers are now honored on custom resources, and on other resources even when garbage collection is disabled via the apiserver flag `--enable-garbage-collector=false` ([#51148](https://github.com/kubernetes/kubernetes/pull/51148), [@ironcladlou](https://github.com/ironcladlou))
* Renamed the API server flag `--experimental-bootstrap-token-auth` to `--enable-bootstrap-token-auth`. The old value is accepted with a warning in 1.8 and will be removed in 1.9. ([#51198](https://github.com/kubernetes/kubernetes/pull/51198), [@mattmoyer](https://github.com/mattmoyer))
* Azure file persistent volumes can use a new `secretNamespace` field to reference a secret in a different namespace than the one containing their bound persistent volume claim. The azure file persistent volume provisioner honors a corresponding `secretNamespace` storage class parameter to determine where to place secrets containing the storage account key. ([#47660](https://github.com/kubernetes/kubernetes/pull/47660), [@rootfs](https://github.com/rootfs))
* Bumped gRPC version to 1.3.0 ([#51154](https://github.com/kubernetes/kubernetes/pull/51154), [@RenaudWasTaken](https://github.com/RenaudWasTaken))
* Delete load balancers if the UIDs for services don't match. ([#50539](https://github.com/kubernetes/kubernetes/pull/50539), [@brendandburns](https://github.com/brendandburns))
* Show events when describing service accounts ([#51035](https://github.com/kubernetes/kubernetes/pull/51035), [@mrogers950](https://github.com/mrogers950))
* implement proposal 34058: hostPath volume type ([#46597](https://github.com/kubernetes/kubernetes/pull/46597), [@dixudx](https://github.com/dixudx))
* HostAlias is now supported for both non-HostNetwork Pods and HostNetwork Pods. ([#50646](https://github.com/kubernetes/kubernetes/pull/50646), [@rickypai](https://github.com/rickypai))
* CRDs support metadata.generation and implement spec/status split ([#50764](https://github.com/kubernetes/kubernetes/pull/50764), [@nikhita](https://github.com/nikhita))
* Allow attach of volumes to multiple nodes for vSphere ([#51066](https://github.com/kubernetes/kubernetes/pull/51066), [@BaluDontu](https://github.com/BaluDontu))


Please see the [Releases Page](https://github.com/kubernetes/kubernetes/releases) for older releases.
=======
* PersistentVolumeLabel admission controller is now deprecated. ([#52618](https://github.com/kubernetes/kubernetes/pull/52618), [@dims](https://github.com/dims))
* Mark the LBaaS v1 of OpenStack cloud provider deprecated. ([#52821](https://github.com/kubernetes/kubernetes/pull/52821), [@FengyunPan](https://github.com/FengyunPan))
* NONE ([#52819](https://github.com/kubernetes/kubernetes/pull/52819), [@verult](https://github.com/verult))
* Mark image as deliberately optional in v1 Container struct.  Many objects in the Kubernetes API inherit the container struct and only Pods require the field to be set. ([#48406](https://github.com/kubernetes/kubernetes/pull/48406), [@gyliu513](https://github.com/gyliu513))
* [fluentd-gcp addon] Update Stackdriver plugin to version 0.6.7 ([#52565](https://github.com/kubernetes/kubernetes/pull/52565), [@crassirostris](https://github.com/crassirostris))
* Remove duplicate proto errors in kubelet. ([#52132](https://github.com/kubernetes/kubernetes/pull/52132), [@adityadani](https://github.com/adityadani))
* [fluentd-gcp addon] Remove audit logs from the fluentd configuration ([#52777](https://github.com/kubernetes/kubernetes/pull/52777), [@crassirostris](https://github.com/crassirostris))
* Set defaults for successfulJobsHistoryLimit (3) and failedJobsHistoryLimit (1) in batch/v1beta1.CronJobs ([#52533](https://github.com/kubernetes/kubernetes/pull/52533), [@soltysh](https://github.com/soltysh))
* Fix: update system spec to support Docker 17.03 ([#52666](https://github.com/kubernetes/kubernetes/pull/52666), [@yguo0905](https://github.com/yguo0905))
* Fix panic in ControllerManager on GCE when it has a problem with creating external loadbalancer healthcheck ([#52646](https://github.com/kubernetes/kubernetes/pull/52646), [@gmarek](https://github.com/gmarek))
* PSP: add support for using `*` as a value in `allowedCapabilities` to allow to request any capabilities ([#51337](https://github.com/kubernetes/kubernetes/pull/51337), [@php-coder](https://github.com/php-coder))
* [fluentd-gcp addon] By default ingest apiserver audit logs written to file in JSON format. ([#52541](https://github.com/kubernetes/kubernetes/pull/52541), [@crassirostris](https://github.com/crassirostris))
* The autoscaling/v2beta1 API group is now enabled by default. ([#52549](https://github.com/kubernetes/kubernetes/pull/52549), [@DirectXMan12](https://github.com/DirectXMan12))
* Add CLUSTER_SIGNING_DURATION environment variable to cluster ([#52497](https://github.com/kubernetes/kubernetes/pull/52497), [@jcbsmpsn](https://github.com/jcbsmpsn))
    * configuration scripts to allow configuration of signing duration of
    * certificates issued via the Certificate Signing Request API.
* Introduce policy to allow the HPA to consume the metrics.k8s.io and custom.metrics.k8s.io API groups. ([#52572](https://github.com/kubernetes/kubernetes/pull/52572), [@DirectXMan12](https://github.com/DirectXMan12))
* kubelet to master communication when doing node status updates now has a timeout to prevent indefinite hangs ([#52176](https://github.com/kubernetes/kubernetes/pull/52176), [@liggitt](https://github.com/liggitt))
* Introduced Metrics Server in version v0.2.0. For more details see https://github.com/kubernetes-incubator/metrics-server/releases/tag/v0.2.0. ([#52548](https://github.com/kubernetes/kubernetes/pull/52548), [@piosz](https://github.com/piosz))
* Adds ROTATE_CERTIFICATES environment variable to kube-up.sh script for GCE ([#52115](https://github.com/kubernetes/kubernetes/pull/52115), [@jcbsmpsn](https://github.com/jcbsmpsn))
    * clusters. When that var is set to true, the command line flag enabling kubelet
    * client certificate rotation will be added to the kubelet command line.
* Make sure that resources being updated are handled correctly by Quota system ([#52452](https://github.com/kubernetes/kubernetes/pull/52452), [@gnufied](https://github.com/gnufied))
* WATCHLIST calls are now reported as WATCH verbs in prometheus for the apiserver_request_* series.  A new "scope" label is added to all apiserver_request_* values that is either 'cluster', 'resource', or 'namespace' depending on which level the query is performed at. ([#52237](https://github.com/kubernetes/kubernetes/pull/52237), [@smarterclayton](https://github.com/smarterclayton))
* Fixed the webhook admission plugin so that it works even if the apiserver and the nodes are in two networks (e.g., in GKE). ([#50476](https://github.com/kubernetes/kubernetes/pull/50476), [@caesarxuchao](https://github.com/caesarxuchao))
    * Fixed the webhook admission plugin so that webhook author could use the DNS name of the service as the CommonName when generating the server cert for the webhook.
    * Action required:
    * Anyone who generated server cert for admission webhooks need to regenerate the cert. Previously, when generating server cert for the admission webhook, the CN value doesn't matter. Now you must set it to the DNS name of the webhook service, i.e., `<service.Name>.<service.Namespace>.svc`.
* Ignore pods marked for deletion that exceed their grace period in ResourceQuota ([#46542](https://github.com/kubernetes/kubernetes/pull/46542), [@derekwaynecarr](https://github.com/derekwaynecarr))
* custom resources that use unconventional pluralization now work properly with kubectl and garbage collection ([#50012](https://github.com/kubernetes/kubernetes/pull/50012), [@deads2k](https://github.com/deads2k))
* [fluentd-gcp addon] Fluentd will trim lines exceeding 100KB instead of dropping them. ([#52289](https://github.com/kubernetes/kubernetes/pull/52289), [@crassirostris](https://github.com/crassirostris))
* dockershim: check the error when syncing the checkpoint. ([#52125](https://github.com/kubernetes/kubernetes/pull/52125), [@yujuhong](https://github.com/yujuhong))
* By default, clusters on GCE no longer sends RequestReceived audit event, if advanced audit is configured. ([#52343](https://github.com/kubernetes/kubernetes/pull/52343), [@crassirostris](https://github.com/crassirostris))
* [BugFix] Soft Eviction timer works correctly ([#52046](https://github.com/kubernetes/kubernetes/pull/52046), [@dashpole](https://github.com/dashpole))
* Azuredisk mount on windows node ([#51252](https://github.com/kubernetes/kubernetes/pull/51252), [@andyzhangx](https://github.com/andyzhangx))
* [fluentd-gcp addon] Bug with event-exporter leaking memory on metrics in clusters with CA is fixed. ([#52263](https://github.com/kubernetes/kubernetes/pull/52263), [@crassirostris](https://github.com/crassirostris))
* kubeadm: Enable kubelet client certificate rotation ([#52196](https://github.com/kubernetes/kubernetes/pull/52196), [@luxas](https://github.com/luxas))
* Scheduler predicate developer should respect equivalence class cache ([#52146](https://github.com/kubernetes/kubernetes/pull/52146), [@resouer](https://github.com/resouer))
* The `kube-cloud-controller-manager` flag `--service-account-private-key-file` was non-functional and is now deprecated. ([#50289](https://github.com/kubernetes/kubernetes/pull/50289), [@liggitt](https://github.com/liggitt))
    * The `kube-cloud-controller-manager` flag `--use-service-account-credentials` is now honored consistently, regardless of whether `--service-account-private-key-file` was specified.
* Fix credentials providers for docker sandbox image. ([#51870](https://github.com/kubernetes/kubernetes/pull/51870), [@feiskyer](https://github.com/feiskyer))
* NONE ([#52120](https://github.com/kubernetes/kubernetes/pull/52120), [@abgworrall](https://github.com/abgworrall))
* Fixed an issue looking up cronjobs when they existed in more than one API version ([#52227](https://github.com/kubernetes/kubernetes/pull/52227), [@liggitt](https://github.com/liggitt))
* Add priority-based preemption to the scheduler. ([#50949](https://github.com/kubernetes/kubernetes/pull/50949), [@bsalamat](https://github.com/bsalamat))
* Add CLUSTER_SIGNING_DURATION environment variable to cluster configuration scripts ([#51844](https://github.com/kubernetes/kubernetes/pull/51844), [@jcbsmpsn](https://github.com/jcbsmpsn))
    * to allow configuration of signing duration of certificates issued via the Certificate
    * Signing Request API.
* Adding German translation for kubectl ([#51867](https://github.com/kubernetes/kubernetes/pull/51867), [@Steffen911](https://github.com/Steffen911))
* The ScaleIO volume plugin can now read the SDC GUID value as node label scaleio.sdcGuid; if binary drv_cfg is not installed, the plugin will still work properly; if node label not found, it defaults to drv_cfg if installed. ([#50780](https://github.com/kubernetes/kubernetes/pull/50780), [@vladimirvivien](https://github.com/vladimirvivien))
* A policy with 0 rules should return an error ([#51782](https://github.com/kubernetes/kubernetes/pull/51782), [@charrywanganthony](https://github.com/charrywanganthony))
* Log a warning when --audit-policy-file not passed to apiserver ([#52071](https://github.com/kubernetes/kubernetes/pull/52071), [@CaoShuFeng](https://github.com/CaoShuFeng))
* Fixes an issue with upgrade requests made via pod/service/node proxy subresources sending a non-absolute HTTP request-uri to backends ([#52065](https://github.com/kubernetes/kubernetes/pull/52065), [@liggitt](https://github.com/liggitt))
* kubeadm: add `kubeadm phase addons` command ([#51171](https://github.com/kubernetes/kubernetes/pull/51171), [@andrewrynhard](https://github.com/andrewrynhard))
* Fix for Nodes in vSphere lacking an InternalIP. ([#48760](https://github.com/kubernetes/kubernetes/pull/48760)) ([#49202](https://github.com/kubernetes/kubernetes/pull/49202), [@cbonte](https://github.com/cbonte))
* v2 of the autoscaling API group, including improvements to the HorizontalPodAutoscaler, has moved from alpha1 to beta1. ([#50708](https://github.com/kubernetes/kubernetes/pull/50708), [@DirectXMan12](https://github.com/DirectXMan12))
* Fixed a bug where some alpha features were enabled by default. ([#51839](https://github.com/kubernetes/kubernetes/pull/51839), [@jennybuckley](https://github.com/jennybuckley))
* Implement StatsProvider interface using CRI stats ([#51557](https://github.com/kubernetes/kubernetes/pull/51557), [@yguo0905](https://github.com/yguo0905))
* set AdvancedAuditing feature gate to true by default ([#51943](https://github.com/kubernetes/kubernetes/pull/51943), [@CaoShuFeng](https://github.com/CaoShuFeng))
* Migrate the metrics/v1alpha1 API to metrics/v1beta1.  The HorizontalPodAutoscaler ([#51653](https://github.com/kubernetes/kubernetes/pull/51653), [@DirectXMan12](https://github.com/DirectXMan12))
    * controller REST client now uses that version.  For v1beta1, the API is now known as
    * resource-metrics.metrics.k8s.io.
* In GCE with COS, increase TasksMax for Docker service to raise cap on number of threads/processes used by containers. ([#51986](https://github.com/kubernetes/kubernetes/pull/51986), [@yujuhong](https://github.com/yujuhong))
* Fixes an issue with APIService auto-registration affecting rolling HA apiserver restarts that add or remove API groups being served. ([#51921](https://github.com/kubernetes/kubernetes/pull/51921), [@liggitt](https://github.com/liggitt))
* Sharing a PID namespace between containers in a pod is disabled by default in 1.8. To enable for a node, use the --docker-disable-shared-pid=false kubelet flag. Note that PID namespace sharing requires docker >= 1.13.1. ([#51634](https://github.com/kubernetes/kubernetes/pull/51634), [@verb](https://github.com/verb))
* Build test targets for all server platforms ([#51873](https://github.com/kubernetes/kubernetes/pull/51873), [@luxas](https://github.com/luxas))
* Add EgressRule to NetworkPolicy ([#51351](https://github.com/kubernetes/kubernetes/pull/51351), [@cmluciano](https://github.com/cmluciano))
* Allow DNS resolution of service name for COS using containerized mounter.  It fixed the issue with DNS resolution of NFS and Gluster services. ([#51645](https://github.com/kubernetes/kubernetes/pull/51645), [@jingxu97](https://github.com/jingxu97))
* Fix journalctl leak on kubelet restart ([#51751](https://github.com/kubernetes/kubernetes/pull/51751), [@dashpole](https://github.com/dashpole))
    * Fix container memory rss
    * Add hugepages monitoring support
    * Fix incorrect CPU usage metrics with 4.7 kernel
    * Add tmpfs monitoring support
* Support for Huge pages in empty_dir volume plugin ([#50072](https://github.com/kubernetes/kubernetes/pull/50072), [@squall0gd](https://github.com/squall0gd))
    * [Huge pages](https://www.kernel.org/doc/Documentation/vm/hugetlbpage.txt) can now be used with empty dir volume plugin.
* Alpha support for pre-allocated hugepages ([#50859](https://github.com/kubernetes/kubernetes/pull/50859), [@derekwaynecarr](https://github.com/derekwaynecarr))
* add support for client-side spam filtering of events ([#47367](https://github.com/kubernetes/kubernetes/pull/47367), [@derekwaynecarr](https://github.com/derekwaynecarr))
* Provide a way to omit Event stages in audit policy ([#49280](https://github.com/kubernetes/kubernetes/pull/49280), [@CaoShuFeng](https://github.com/CaoShuFeng))
* Introduced Metrics Server ([#51792](https://github.com/kubernetes/kubernetes/pull/51792), [@piosz](https://github.com/piosz))
* Implement Controller for growing persistent volumes ([#49727](https://github.com/kubernetes/kubernetes/pull/49727), [@gnufied](https://github.com/gnufied))
* Kubernetes 1.8 supports docker version 1.11.x, 1.12.x and 1.13.x. And also supports overlay2. ([#51845](https://github.com/kubernetes/kubernetes/pull/51845), [@Random-Liu](https://github.com/Random-Liu))
* The Deployment, DaemonSet, and ReplicaSet kinds in the extensions/v1beta1 group version are now deprecated, as are the Deployment, StatefulSet, and ControllerRevision kinds in apps/v1beta1. As they will not be removed until after a GA version becomes available, you may continue to use these kinds in existing code. However, all new code should be developed against the apps/v1beta2 group version. ([#51828](https://github.com/kubernetes/kubernetes/pull/51828), [@kow3ns](https://github.com/kow3ns))
* kubeadm: Detect kubelet readiness and error out if the kubelet is unhealthy ([#51369](https://github.com/kubernetes/kubernetes/pull/51369), [@luxas](https://github.com/luxas))
* Fix providerID update validation ([#51761](https://github.com/kubernetes/kubernetes/pull/51761), [@karataliu](https://github.com/karataliu))
* Calico has been updated to v2.5, RBAC added, and is now automatically scaled when GCE clusters are resized. ([#51237](https://github.com/kubernetes/kubernetes/pull/51237), [@gunjan5](https://github.com/gunjan5))
* Add backoff policy and failed pod limit for a job ([#51153](https://github.com/kubernetes/kubernetes/pull/51153), [@clamoriniere1A](https://github.com/clamoriniere1A))
* Adds a new alpha EventRateLimit admission control that is used to limit the number of event queries that are accepted by the API Server. ([#50925](https://github.com/kubernetes/kubernetes/pull/50925), [@staebler](https://github.com/staebler))
* The OpenID Connect authenticator can now use a custom prefix, or omit the default prefix, for username and groups claims through the --oidc-username-prefix and --oidc-groups-prefix flags. For example, the authenticator can map a user with the username "jane" to "google:jane" by supplying the "google:" username prefix. ([#50875](https://github.com/kubernetes/kubernetes/pull/50875), [@ericchiang](https://github.com/ericchiang))
* Implemented `kubeadm upgrade plan` for checking whether you can upgrade your cluster to a newer version ([#48899](https://github.com/kubernetes/kubernetes/pull/48899), [@luxas](https://github.com/luxas))
    * Implemented `kubeadm upgrade apply` for upgrading your cluster from one version to another
* Switch to audit.k8s.io/v1beta1 in audit. ([#51719](https://github.com/kubernetes/kubernetes/pull/51719), [@soltysh](https://github.com/soltysh))
* update QEMU version to v2.9.1 ([#50597](https://github.com/kubernetes/kubernetes/pull/50597), [@dixudx](https://github.com/dixudx))
* controllers backoff better in face of quota denial ([#49142](https://github.com/kubernetes/kubernetes/pull/49142), [@joelsmith](https://github.com/joelsmith))
* The event table output under `kubectl describe` has been simplified to show only the most essential info. ([#51748](https://github.com/kubernetes/kubernetes/pull/51748), [@smarterclayton](https://github.com/smarterclayton))
* Use arm32v7|arm64v8 images instead of the deprecated armhf|aarch64 image organizations ([#50602](https://github.com/kubernetes/kubernetes/pull/50602), [@dixudx](https://github.com/dixudx))
* audit newest impersonated user info in the ResponseStarted, ResponseComplete audit stage ([#48184](https://github.com/kubernetes/kubernetes/pull/48184), [@CaoShuFeng](https://github.com/CaoShuFeng))
* Fixed bug in AWS provider to handle multiple IPs when using more than 1 network interface per ec2 instance. ([#50112](https://github.com/kubernetes/kubernetes/pull/50112), [@jlz27](https://github.com/jlz27))
* Add flag "--include-uninitialized" to kubectl annotate, apply, edit-last-applied, delete, describe, edit, get, label, set. "--include-uninitialized=true" makes kubectl commands apply to uninitialized objects, which by default are ignored if the names of the objects are not provided. "--all" also makes kubectl commands apply to uninitialized objects. Please see the [initializer](https://kubernetes.io/docs/admin/extensible-admission-controllers/) doc for more details. ([#50497](https://github.com/kubernetes/kubernetes/pull/50497), [@dixudx](https://github.com/dixudx))
* GCE: Service object now supports "Network Tiers" as an Alpha feature via annotations. ([#51301](https://github.com/kubernetes/kubernetes/pull/51301), [@yujuhong](https://github.com/yujuhong))
* When using kube-up.sh on GCE, user could set env `ENABLE_POD_PRIORITY=true` to enable pod priority feature gate. ([#51069](https://github.com/kubernetes/kubernetes/pull/51069), [@MrHohn](https://github.com/MrHohn))
* The names generated for ControllerRevision and ReplicaSet are consistent with the GenerateName functionality of the API Server and will not contain "bad words". ([#51538](https://github.com/kubernetes/kubernetes/pull/51538), [@kow3ns](https://github.com/kow3ns))
* PersistentVolumeClaim metrics like "volume_stats_inodes" and "volume_stats_capacity_bytes" are now reported via kubelet prometheus ([#51553](https://github.com/kubernetes/kubernetes/pull/51553), [@wongma7](https://github.com/wongma7))
* When using IP aliases, use a secondary range rather than subnetwork to reserve cluster IPs. ([#51690](https://github.com/kubernetes/kubernetes/pull/51690), [@bowei](https://github.com/bowei))
* IPAM controller unifies handling of node pod CIDR range allocation. ([#51374](https://github.com/kubernetes/kubernetes/pull/51374), [@bowei](https://github.com/bowei))
    * It is intended to supersede the logic that is currently in range_allocator 
    * and cloud_cidr_allocator. (ALPHA FEATURE)
    * Note: for this change, the other allocators still exist and are the default.
    * It supports two modes:
        * CIDR range allocations done within the cluster that are then propagated out to the cloud provider.
        * Cloud provider managed IPAM that is then reflected into the cluster.
* The Kubernetes API server now supports the ability to break large LIST calls into multiple smaller chunks.  A client can specify a limit to the number of results to return, and if more results exist a token will be returned that allows the client to continue the previous list call repeatedly until all results are retrieved.  The resulting list is identical to a list call that does not perform chunking thanks to capabilities provided by etcd3.  This allows the server to use less memory and CPU responding with very large lists.  This feature is gated as APIListChunking and is not enabled by default.  The 1.9 release will begin using this by default from all informers. ([#48921](https://github.com/kubernetes/kubernetes/pull/48921), [@smarterclayton](https://github.com/smarterclayton))
* add reconcile command to kubectl auth ([#51636](https://github.com/kubernetes/kubernetes/pull/51636), [@deads2k](https://github.com/deads2k))
* Advanced audit allows logging failed login attempts ([#51119](https://github.com/kubernetes/kubernetes/pull/51119), [@soltysh](https://github.com/soltysh))
* kubeadm: Add support for using an external CA whose key is never stored in the cluster ([#50832](https://github.com/kubernetes/kubernetes/pull/50832), [@nckturner](https://github.com/nckturner))
* the custom metrics API (custom.metrics.k8s.io) has moved from v1alpha1 to v1beta1 ([#50920](https://github.com/kubernetes/kubernetes/pull/50920), [@DirectXMan12](https://github.com/DirectXMan12))
* Add backoff policy and failed pod limit for a job ([#48075](https://github.com/kubernetes/kubernetes/pull/48075), [@clamoriniere1A](https://github.com/clamoriniere1A))
* Performs validation (when applying for example) against OpenAPI schema rather than Swagger 1.0. ([#51364](https://github.com/kubernetes/kubernetes/pull/51364), [@apelisse](https://github.com/apelisse))
* Make all e2e tests lookup image to use from a centralized place. In that centralized place, add support for multiple platforms. ([#49457](https://github.com/kubernetes/kubernetes/pull/49457), [@mkumatag](https://github.com/mkumatag))
* kubelet has alpha support for mount propagation. It is disabled by default and it is there for testing only. This feature may be redesigned or even removed in a future release. ([#46444](https://github.com/kubernetes/kubernetes/pull/46444), [@jsafrane](https://github.com/jsafrane))
* Add selfsubjectrulesreview API for allowing users to query which permissions they have in a given namespace. ([#48051](https://github.com/kubernetes/kubernetes/pull/48051), [@xilabao](https://github.com/xilabao))
* Kubelet re-binds /var/lib/kubelet directory with rshared mount propagation during startup if it is not shared yet. ([#45724](https://github.com/kubernetes/kubernetes/pull/45724), [@jsafrane](https://github.com/jsafrane))
* Deviceplugin jiayingz ([#51209](https://github.com/kubernetes/kubernetes/pull/51209), [@jiayingz](https://github.com/jiayingz))
* Make logdump support kubemark and support gke with 'use_custom_instance_list' ([#51834](https://github.com/kubernetes/kubernetes/pull/51834), [@shyamjvs](https://github.com/shyamjvs))
* add apps/v1beta2 conversion test ([#49645](https://github.com/kubernetes/kubernetes/pull/49645), [@dixudx](https://github.com/dixudx))
* Fixed an issue ([#47800](https://github.com/kubernetes/kubernetes/pull/47800)) where `kubectl logs -f` failed with `unexpected stream type ""`. ([#50381](https://github.com/kubernetes/kubernetes/pull/50381), [@sczizzo](https://github.com/sczizzo))
* GCE: Internal load balancer IPs are now reserved during service sync to prevent losing the address to another service. ([#51055](https://github.com/kubernetes/kubernetes/pull/51055), [@nicksardo](https://github.com/nicksardo))
* Switch JSON marshal/unmarshal to json-iterator library.  Performance should be close to previous with no generated code. ([#48287](https://github.com/kubernetes/kubernetes/pull/48287), [@thockin](https://github.com/thockin))
* Adds optional group and version information to the discovery interface, so that if an endpoint uses non-default values, the proper value of "kind" can be determined. Scale is a common example. ([#49971](https://github.com/kubernetes/kubernetes/pull/49971), [@deads2k](https://github.com/deads2k))
* Fix security holes in GCE metadata proxy. ([#51302](https://github.com/kubernetes/kubernetes/pull/51302), [@ihmccreery](https://github.com/ihmccreery))
* [#43077](https://github.com/kubernetes/kubernetes/pull/43077) introduced a condition where DaemonSet controller did not respect the TerminationGracePeriodSeconds of the Pods it created. This is now corrected. ([#51279](https://github.com/kubernetes/kubernetes/pull/51279), [@kow3ns](https://github.com/kow3ns))
* Tainted nodes by conditions as following: ([#49257](https://github.com/kubernetes/kubernetes/pull/49257), [@k82cn](https://github.com/k82cn))
          * 'node.kubernetes.io/network-unavailable=:NoSchedule' if NetworkUnavailable is true
          * 'node.kubernetes.io/disk-pressure=:NoSchedule' if DiskPressure is true
          * 'node.kubernetes.io/memory-pressure=:NoSchedule' if MemoryPressure is true
          * 'node.kubernetes.io/out-of-disk=:NoSchedule' if OutOfDisk is true
* rbd: default image format to v2 instead of deprecated v1 ([#51574](https://github.com/kubernetes/kubernetes/pull/51574), [@dillaman](https://github.com/dillaman))
* Surface reasonable error when client detects connection closed. ([#51381](https://github.com/kubernetes/kubernetes/pull/51381), [@mengqiy](https://github.com/mengqiy))
* Allow PSP's to specify a whitelist of allowed paths for host volume ([#50212](https://github.com/kubernetes/kubernetes/pull/50212), [@jhorwit2](https://github.com/jhorwit2))
* For Deployment, ReplicaSet, and DaemonSet, selectors are now immutable when updating via the new `apps/v1beta2` API. For backward compatibility, selectors can still be changed when updating via `apps/v1beta1` or `extensions/v1beta1`. ([#50719](https://github.com/kubernetes/kubernetes/pull/50719), [@crimsonfaith91](https://github.com/crimsonfaith91))
* Allows kubectl to use http caching mechanism for the OpenAPI schema. The cache directory can be configured through `--cache-dir` command line flag to kubectl. If set to empty string, caching will be disabled. ([#50404](https://github.com/kubernetes/kubernetes/pull/50404), [@apelisse](https://github.com/apelisse))
* Pod log attempts are now reported in apiserver prometheus metrics with verb `CONNECT` since they can run for very long periods of time. ([#50123](https://github.com/kubernetes/kubernetes/pull/50123), [@WIZARD-CXY](https://github.com/WIZARD-CXY))
* The `emptyDir.sizeLimit` field is now correctly omitted from API requests and responses when unset. ([#50163](https://github.com/kubernetes/kubernetes/pull/50163), [@jingxu97](https://github.com/jingxu97))
* Promote CronJobs to batch/v1beta1. ([#51465](https://github.com/kubernetes/kubernetes/pull/51465), [@soltysh](https://github.com/soltysh))
* Add local ephemeral storage support to LimitRange ([#50757](https://github.com/kubernetes/kubernetes/pull/50757), [@NickrenREN](https://github.com/NickrenREN))
* Add mount options field to StorageClass. The options listed there are automatically added to PVs provisioned using the class. ([#51228](https://github.com/kubernetes/kubernetes/pull/51228), [@wongma7](https://github.com/wongma7))
* Add 'kubectl set env' command for setting environment variables inside containers for resources embedding pod templates ([#50998](https://github.com/kubernetes/kubernetes/pull/50998), [@zjj2wry](https://github.com/zjj2wry))
* Implement IPVS-based in-cluster service load balancing ([#46580](https://github.com/kubernetes/kubernetes/pull/46580), [@dujun1990](https://github.com/dujun1990))
* Release the kubelet client certificate rotation as beta. ([#51045](https://github.com/kubernetes/kubernetes/pull/51045), [@jcbsmpsn](https://github.com/jcbsmpsn))
* Adds --append-hash flag to kubectl create configmap/secret, which will append a short hash of the configmap/secret contents to the name during creation. ([#49961](https://github.com/kubernetes/kubernetes/pull/49961), [@mtaufen](https://github.com/mtaufen))
* Add validation for CustomResources via JSON Schema. ([#47263](https://github.com/kubernetes/kubernetes/pull/47263), [@nikhita](https://github.com/nikhita))
* enqueue a sync task to wake up jobcontroller to check job ActiveDeadlineSeconds in time ([#48454](https://github.com/kubernetes/kubernetes/pull/48454), [@weiwei04](https://github.com/weiwei04))
* Remove previous local ephemeral storage resource names: "ResourceStorageOverlay" and "ResourceStorageScratch" ([#51425](https://github.com/kubernetes/kubernetes/pull/51425), [@NickrenREN](https://github.com/NickrenREN))
* Add `retainKeys` to patchStrategy for v1 Volumes and extensions/v1beta1 DeploymentStrategy. ([#50296](https://github.com/kubernetes/kubernetes/pull/50296), [@mengqiy](https://github.com/mengqiy))
* Add mount options field to PersistentVolume spec ([#50919](https://github.com/kubernetes/kubernetes/pull/50919), [@wongma7](https://github.com/wongma7))
* Use of the alpha initializers feature now requires enabling the `Initializers` feature gate. This feature gate is auto-enabled if the `Initialzers` admission plugin is enabled. ([#51436](https://github.com/kubernetes/kubernetes/pull/51436), [@liggitt](https://github.com/liggitt))
* Fix inconsistent Prometheus cAdvisor metrics ([#51473](https://github.com/kubernetes/kubernetes/pull/51473), [@bboreham](https://github.com/bboreham))
* Add local ephemeral storage to downward API  ([#50435](https://github.com/kubernetes/kubernetes/pull/50435), [@NickrenREN](https://github.com/NickrenREN))
* kubectl zsh autocompletion will work with compinit ([#50561](https://github.com/kubernetes/kubernetes/pull/50561), [@cblecker](https://github.com/cblecker))
* [Experiment Only] When using kube-up.sh on GCE, user could set env `KUBE_PROXY_DAEMONSET=true` to run kube-proxy as a DaemonSet. kube-proxy is run as static pods by default. ([#50705](https://github.com/kubernetes/kubernetes/pull/50705), [@MrHohn](https://github.com/MrHohn))
* Add --request-timeout to kube-apiserver to make global request timeout configurable. ([#51415](https://github.com/kubernetes/kubernetes/pull/51415), [@jpbetz](https://github.com/jpbetz))
* Deprecate auto detecting cloud providers in kubelet. Auto detecting cloud providers go against the initiative for out-of-tree cloud providers as we'll now depend on cAdvisor integrations with cloud providers instead of the core repo. In the near future, `--cloud-provider` for kubelet will either be an empty string or `external`.  ([#51312](https://github.com/kubernetes/kubernetes/pull/51312), [@andrewsykim](https://github.com/andrewsykim))
* Add local ephemeral storage support to Quota ([#49610](https://github.com/kubernetes/kubernetes/pull/49610), [@NickrenREN](https://github.com/NickrenREN))
* Kubelet updates default labels if those are deprecated ([#47044](https://github.com/kubernetes/kubernetes/pull/47044), [@mrIncompetent](https://github.com/mrIncompetent))
* Add error count and time-taken metrics for storage operations such as mount and attach, per-volume-plugin. ([#50036](https://github.com/kubernetes/kubernetes/pull/50036), [@wongma7](https://github.com/wongma7))
* A new predicates, named 'CheckNodeCondition', was added to replace node condition filter. 'NetworkUnavailable', 'OutOfDisk' and 'NotReady' maybe reported as a reason when failed to schedule pods. ([#51117](https://github.com/kubernetes/kubernetes/pull/51117), [@k82cn](https://github.com/k82cn))
* Add support for configurable groups for bootstrap token authentication. ([#50933](https://github.com/kubernetes/kubernetes/pull/50933), [@mattmoyer](https://github.com/mattmoyer))
* Fix forbidden message format ([#49006](https://github.com/kubernetes/kubernetes/pull/49006), [@CaoShuFeng](https://github.com/CaoShuFeng))
* make volumesInUse sorted in node status updates ([#49849](https://github.com/kubernetes/kubernetes/pull/49849), [@dixudx](https://github.com/dixudx))
* Adds `InstanceExists` and `InstanceExistsByProviderID` to cloud provider interface for the cloud controller manager ([#51087](https://github.com/kubernetes/kubernetes/pull/51087), [@prydie](https://github.com/prydie))
* Dynamic Flexvolume plugin discovery. Flexvolume plugins can now be discovered on the fly rather than only at system initialization time. ([#50031](https://github.com/kubernetes/kubernetes/pull/50031), [@verult](https://github.com/verult))
* add fieldSelector spec.schedulerName ([#50582](https://github.com/kubernetes/kubernetes/pull/50582), [@dixudx](https://github.com/dixudx))
* Change eviction manager to manage one single local ephemeral storage resource ([#50889](https://github.com/kubernetes/kubernetes/pull/50889), [@NickrenREN](https://github.com/NickrenREN))
* Cloud Controller Manager now sets Node.Spec.ProviderID ([#50730](https://github.com/kubernetes/kubernetes/pull/50730), [@andrewsykim](https://github.com/andrewsykim))
* Paramaterize session affinity timeout seconds in service API for Client IP based session affinity. ([#49850](https://github.com/kubernetes/kubernetes/pull/49850), [@m1093782566](https://github.com/m1093782566))
* Changing scheduling part of the alpha feature 'LocalStorageCapacityIsolation' to manage one single local ephemeral storage resource ([#50819](https://github.com/kubernetes/kubernetes/pull/50819), [@NickrenREN](https://github.com/NickrenREN))
* set --audit-log-format default to json ([#50971](https://github.com/kubernetes/kubernetes/pull/50971), [@CaoShuFeng](https://github.com/CaoShuFeng))
* kubeadm: Implement a `--dry-run` mode and flag for `kubeadm` ([#51122](https://github.com/kubernetes/kubernetes/pull/51122), [@luxas](https://github.com/luxas))
* kubectl rollout `history`, `status`, and `undo` subcommands now support StatefulSets. ([#49674](https://github.com/kubernetes/kubernetes/pull/49674), [@crimsonfaith91](https://github.com/crimsonfaith91))
* Add IPBlock to Network Policy ([#50033](https://github.com/kubernetes/kubernetes/pull/50033), [@cmluciano](https://github.com/cmluciano))
* Adding Italian translation for kubectl ([#50155](https://github.com/kubernetes/kubernetes/pull/50155), [@lucab85](https://github.com/lucab85))
* Simplify capabilities handling in FlexVolume. ([#51169](https://github.com/kubernetes/kubernetes/pull/51169), [@MikaelCluseau](https://github.com/MikaelCluseau))
* NONE ([#50669](https://github.com/kubernetes/kubernetes/pull/50669), [@jiulongzaitian](https://github.com/jiulongzaitian))
* cloudprovider.Zones should support external cloud providers ([#50858](https://github.com/kubernetes/kubernetes/pull/50858), [@andrewsykim](https://github.com/andrewsykim))
* Finalizers are now honored on custom resources, and on other resources even when garbage collection is disabled via the apiserver flag `--enable-garbage-collector=false` ([#51148](https://github.com/kubernetes/kubernetes/pull/51148), [@ironcladlou](https://github.com/ironcladlou))
* Renamed the API server flag `--experimental-bootstrap-token-auth` to `--enable-bootstrap-token-auth`. The old value is accepted with a warning in 1.8 and will be removed in 1.9. ([#51198](https://github.com/kubernetes/kubernetes/pull/51198), [@mattmoyer](https://github.com/mattmoyer))
* Azure file persistent volumes can use a new `secretNamespace` field to reference a secret in a different namespace than the one containing their bound persistent volume claim. The azure file persistent volume provisioner honors a corresponding `secretNamespace` storage class parameter to determine where to place secrets containing the storage account key. ([#47660](https://github.com/kubernetes/kubernetes/pull/47660), [@rootfs](https://github.com/rootfs))
* Bumped gRPC version to 1.3.0 ([#51154](https://github.com/kubernetes/kubernetes/pull/51154), [@RenaudWasTaken](https://github.com/RenaudWasTaken))
* Delete load balancers if the UIDs for services don't match. ([#50539](https://github.com/kubernetes/kubernetes/pull/50539), [@brendandburns](https://github.com/brendandburns))
* Show events when describing service accounts ([#51035](https://github.com/kubernetes/kubernetes/pull/51035), [@mrogers950](https://github.com/mrogers950))
* implement proposal 34058: hostPath volume type ([#46597](https://github.com/kubernetes/kubernetes/pull/46597), [@dixudx](https://github.com/dixudx))
* HostAlias is now supported for both non-HostNetwork Pods and HostNetwork Pods. ([#50646](https://github.com/kubernetes/kubernetes/pull/50646), [@rickypai](https://github.com/rickypai))
* CRDs support metadata.generation and implement spec/status split ([#50764](https://github.com/kubernetes/kubernetes/pull/50764), [@nikhita](https://github.com/nikhita))
* Allow attach of volumes to multiple nodes for vSphere ([#51066](https://github.com/kubernetes/kubernetes/pull/51066), [@BaluDontu](https://github.com/BaluDontu))


Please see the [Releases Page](https://github.com/kubernetes/kubernetes/releases) for older releases.
>>>>>>> merge master to 1.10, with fixes (#7682)

Release notes of older releases can be found in:
- [CHANGELOG-1.2.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.2.md)
- [CHANGELOG-1.3.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.3.md)
- [CHANGELOG-1.4.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.4.md)
- [CHANGELOG-1.5.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.5.md)
- [CHANGELOG-1.6.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.6.md)
- [CHANGELOG-1.7.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.7.md)
- [CHANGELOG-1.8.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.8.md)
- [CHANGELOG-1.9.md](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.9.md)

[![Analytics](https://kubernetes-site.appspot.com/UA-36037335-10/GitHub/CHANGELOG.md?pixel)]()
