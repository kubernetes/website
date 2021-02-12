---
title: v1.20 Release Notes
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

# v1.20.0

[Documentation](https://docs.k8s.io)

## Downloads for v1.20.0

filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.20.0/kubernetes.tar.gz) | `ebfe49552bbda02807034488967b3b62bf9e3e507d56245e298c4c19090387136572c1fca789e772a5e8a19535531d01dcedb61980e42ca7b0461d3864df2c14`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.20.0/kubernetes-src.tar.gz) | `bcbd67ed0bb77840828c08c6118ad0c9bf2bcda16763afaafd8731fd6ce735be654feef61e554bcc34c77c65b02a25dae565adc5e1dc49a2daaa0d115bf1efe6`

### Client Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.20.0/kubernetes-client-darwin-amd64.tar.gz) | `3609f6483f4244676162232b3294d7a2dc40ae5bdd86a842a05aa768f5223b8f50e1d6420fd8afb2d0ce19de06e1d38e5e5b10154ba0cb71a74233e6dc94d5a0`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.20.0/kubernetes-client-linux-386.tar.gz) | `e06c08016a08137d39804383fdc33a40bb2567aa77d88a5c3fd5b9d93f5b581c635b2c4faaa718ed3bb2d120cb14fe91649ed4469ba72c3a3dda1e343db545ed`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.20.0/kubernetes-client-linux-amd64.tar.gz) | `081472833601aa4fa78e79239f67833aa4efcb4efe714426cd01d4ddf6f36fbf304ef7e1f5373bff0fdff44a845f7560165c093c108bd359b5ab4189f36b1f2f`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.20.0/kubernetes-client-linux-arm.tar.gz) | `037f84a2f29fe62d266cab38ac5600d058cce12cbc4851bcf062fafba796c1fbe23a0c2939cd15784854ca7cd92383e5b96a11474fc71fb614b47dbf98a477d9`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.20.0/kubernetes-client-linux-arm64.tar.gz) | `275727e1796791ca3cbe52aaa713a2660404eab6209466fdc1cfa8559c9b361fe55c64c6bcecbdeba536b6d56213ddf726e58adc60f959b6f77e4017834c5622`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.20.0/kubernetes-client-linux-ppc64le.tar.gz) | `7a9965293029e9fcdb2b7387467f022d2026953b8461e6c84182abf35c28b7822d2389a6d8e4d8e532d2ea5d5d67c6fee5fb6c351363cb44c599dc8800649b04`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.20.0/kubernetes-client-linux-s390x.tar.gz) | `85fc449ce1980f5f030cc32e8c8e2198c1cc91a448e04b15d27debc3ca56aa85d283f44b4f4e5fed26ac96904cc12808fa3e9af3d8bf823fc928befb9950d6f5`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.20.0/kubernetes-client-windows-386.tar.gz) | `4c0a27dba1077aaee943e0eb7a787239dd697e1d968e78d1933c1e60b02d5d233d58541d5beec59807a4ffe3351d5152359e11da120bf64cacb3ee29fbc242e6`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.20.0/kubernetes-client-windows-amd64.tar.gz) | `29336faf7c596539b8329afbbdceeddc843162501de4afee44a40616278fa1f284d8fc48c241fc7d52c65dab70f76280cc33cec419c8c5dbc2625d9175534af8`

### Server Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.20.0/kubernetes-server-linux-amd64.tar.gz) | `fb56486a55dbf7dbacb53b1aaa690bae18d33d244c72a1e2dc95fb0fcce45108c44ba79f8fa04f12383801c46813dc33d2d0eb2203035cdce1078871595e446e`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.20.0/kubernetes-server-linux-arm.tar.gz) | `735ed9993071fe35b292bf06930ee3c0f889e3c7edb983195b1c8e4d7113047c12c0f8281fe71879fc2fcd871e1ee587f03b695a03c8512c873abad444997a19`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.20.0/kubernetes-server-linux-arm64.tar.gz) | `ffab155531d5a9b82487ee1abf4f6ef49626ea58b2de340656a762e46cf3e0f470bdbe7821210901fe1114224957c44c1d9cc1e32efb5ee24e51fe63990785b2`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.20.0/kubernetes-server-linux-ppc64le.tar.gz) | `9d5730d35c4ddfb4c5483173629fe55df35d1e535d96f02459468220ac2c97dc01b995f577432a6e4d1548b6edbfdc90828dc9c1f7cf7464481af6ae10aaf118`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.20.0/kubernetes-server-linux-s390x.tar.gz) | `6e4c165306940e8b99dd6e590f8542e31aed23d2c7a6808af0357fa425cec1a57016dd66169cf2a95f8eb8ef70e1f29e2d500533aae889e2e3d9290d04ab8721`

### Node Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.20.0/kubernetes-node-linux-amd64.tar.gz) | `3e6c90561dd1c27fa1dff6953c503251c36001f7e0f8eff3ec918c74ae2d9aa25917d8ac87d5b4224b8229f620b1830442e6dce3b2a497043f8497eee3705696`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.20.0/kubernetes-node-linux-arm.tar.gz) | `26db385d9ae9a97a1051a638e7e3de22c4bbff389d5a419fe40d5893f9e4fa85c8b60a2bd1d370fd381b60c3ca33c5d72d4767c90898caa9dbd4df6bd116a247`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.20.0/kubernetes-node-linux-arm64.tar.gz) | `5b8b63f617e248432b7eb913285a8ef8ba028255216332c05db949666c3f9e9cb9f4c393bbd68d00369bda77abf9bfa2da254a5c9fe0d79ffdad855a77a9d8ed`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.20.0/kubernetes-node-linux-ppc64le.tar.gz) | `60da7715996b4865e390640525d6e98593ba3cd45c6caeea763aa5355a7f989926da54f58cc5f657f614c8134f97cd3894b899f8b467d100dca48bc22dd4ff63`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.20.0/kubernetes-node-linux-s390x.tar.gz) | `9407dc55412bd04633f84fcefe3a1074f3eaa772a7cb9302242b8768d6189b75d37677a959f91130e8ad9dc590f9ba8408ba6700a0ceff6827315226dd5ee1e6`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.20.0/kubernetes-node-windows-amd64.tar.gz) | `9d4261af343cc330e6359582f80dbd6efb57d41f882747a94bbf47b4f93292d43dd19a86214d4944d268941622dfbc96847585e6fec15fddc4dbd93d17015fa8`

## Changelog since v1.19.0

## What's New (Major Themes)

### Dockershim deprecation

Docker as an underlying runtime is being deprecated. Docker-produced images will continue to work in your cluster with all runtimes, as they always have.
The Kubernetes community [has written a blog post about this in detail](https://blog.k8s.io/2020/12/02/dont-panic-kubernetes-and-docker/) with [a dedicated FAQ page for it](https://blog.k8s.io/2020/12/02/dockershim-faq/).

### External credential provider for client-go

The client-go credential plugins can now be passed in the current cluster information via the `KUBERNETES_EXEC_INFO` environment variable. Learn more about this on [client-go credential plugins documentation](https://docs.k8s.io/reference/access-authn-authz/authentication/#client-go-credential-plugins/).

### CronJob controller v2 is available through feature gate

An alternative implementation of `CronJob` controller is now available as an alpha feature in this release, which has experimental performance improvement by using informers instead of polling. While this will be the default behavior in the future, you can [try them in this release through a feature gate](https://docs.k8s.io/concepts/workloads/controllers/cron-jobs/).

### PID Limits graduates to General Availability

PID Limits features are now generally available on both `SupportNodePidsLimit` (node-to-pod PID isolation) and `SupportPodPidsLimit` (ability to limit PIDs per pod), after being enabled-by-default in beta stage for a year.

### API Priority and Fairness graduates to Beta

Initially introduced in 1.18, Kubernetes 1.20 now enables API Priority and Fairness (APF) by default. This allows `kube-apiserver` to [categorize incoming requests by priority levels](https://docs.k8s.io/concepts/cluster-administration/flow-control/).

### IPv4/IPv6 run

IPv4/IPv6 dual-stack has been reimplemented for 1.20 to support dual-stack Services, based on user and community feedback. If your cluster has dual-stack enabled, you can create Services which can use IPv4, IPv6, or both, and you can change this setting for existing Services. Details are available in updated [IPv4/IPv6 dual-stack docs](https://docs.k8s.io/concepts/services-networking/dual-stack/), which cover the nuanced array of options.

We expect this implementation to progress from alpha to beta and GA in coming releases, so we’re eager to have you comment about your dual-stack experiences in [#k8s-dual-stack](https://kubernetes.slack.com/messages/k8s-dual-stack) or in [enhancements #563](https://features.k8s.io/563). 

### go1.15.5

go1.15.5 has been integrated to Kubernetes project as of this release, [including other infrastructure related updates on this effort](https://github.com/kubernetes/kubernetes/pull/95776).

### CSI Volume Snapshot graduates to General Availability

CSI Volume Snapshot moves to GA in the 1.20 release. This feature provides a standard way to trigger volume snapshot operations in Kubernetes and allows Kubernetes users to incorporate snapshot operations in a portable manner on any Kubernetes environment regardless of supporting underlying storage providers.
Additionally, these Kubernetes snapshot primitives act as basic building blocks that unlock the ability to develop advanced, enterprise grade, storage administration features for Kubernetes: including application or cluster level backup solutions.
Note that snapshot support will require Kubernetes distributors to bundle the Snapshot controller, Snapshot CRDs, and validation webhook. In addition, a CSI driver supporting the snapshot functionality must also be deployed on the cluster.

### Non-recursive Volume Ownership (FSGroup) graduates to Beta

By default, the `fsgroup` setting, if specified, recursively updates permissions for every file in a volume on every mount. This can make mount, and pod startup, very slow if the volume has many files. 
This setting enables a pod to specify a `PodFSGroupChangePolicy` that indicates that volume ownership and permissions will be changed only when permission and ownership of the root directory does not match with expected permissions on the volume.

### CSIDriver policy for FSGroup graduates to Beta

The FSGroup's CSIDriver Policy is now beta in 1.20. This allows CSIDrivers to explicitly indicate if they want Kubernetes to manage permissions and ownership for their volumes via `fsgroup`. 

### Security Improvements for CSI Drivers (Alpha)

In 1.20, we introduce a new alpha feature `CSIServiceAccountToken`. This feature allows CSI drivers to impersonate the pods that they mount the volumes for. This improves the security posture in the mounting process where the volumes are ACL’ed on the pods’ service account without handing out unnecessary permissions to the CSI drivers’ service account. This feature is especially important for secret-handling CSI drivers, such as the secrets-store-csi-driver. Since these tokens can be rotated and short-lived, this feature also provides a knob for CSI drivers to receive `NodePublishVolume` RPC calls periodically with the new token. This knob is also useful when volumes are short-lived, e.g. certificates.

### Introducing Graceful Node Shutdown (Alpha)

The `GracefulNodeShutdown` feature is now in Alpha. This allows kubelet to be aware of node system shutdowns, enabling graceful termination of pods during a system shutdown. This feature can be [enabled through feature gate](https://docs.k8s.io/concepts/architecture/nodes/#graceful-node-shutdown).

### Runtime log sanitation

Logs can now be configured to use runtime protection from leaking sensitive data. [Details for this experimental feature is available in documentation](https://docs.k8s.io/concepts/cluster-administration/system-logs/#log-sanitization).

### Pod resource metrics

On-demand metrics calculation is now available through `/metrics/resources`. [When enabled](
https://docs.k8s.io/concepts/cluster-administration/system-metrics#kube-scheduler-metrics), the endpoint will report the requested resources and the desired limits of all running pods.

### Introducing `RootCAConfigMap`

`RootCAConfigMap` graduates to Beta, seperating from `BoundServiceAccountTokenVolume`. The `kube-root-ca.crt` ConfigMap is now available to every namespace, by default. It contains the Certificate Authority bundle for verify kube-apiserver connections.

### `kubectl debug` graduates to Beta

`kubectl alpha debug` graduates from alpha to beta in 1.20, becoming `kubectl debug`.
`kubectl debug` provides support for common debugging workflows directly from kubectl. Troubleshooting scenarios supported in this release of `kubectl` include:
Troubleshoot workloads that crash on startup by creating a copy of the pod that uses a different container image or command.
Troubleshoot distroless containers by adding a new container with debugging tools, either in a new copy of the pod or using an ephemeral container. (Ephemeral containers are an alpha feature that are not enabled by default.)
Troubleshoot on a node by creating a container running in the host namespaces and with access to the host’s filesystem.
Note that as a new builtin command, `kubectl debug` takes priority over any `kubectl` plugin named “debug”. You will need to rename the affected plugin.
Invocations using `kubectl alpha debug` are now deprecated and will be removed in a subsequent release. Update your scripts to use `kubectl debug` instead of `kubectl alpha debug`!
For more information about kubectl debug, see Debugging Running Pods on the Kubernetes website, kubectl help debug, or reach out to SIG CLI by visiting #sig-cli or commenting on [enhancement #1441](https://features.k8s.io/1441).

### Removing deprecated flags in kubeadm

`kubeadm` applies a number of deprecations and removals of deprecated features in this release. More details are available in the Urgent Upgrade Notes and Kind / Deprecation sections.

### Pod Hostname as FQDN graduates to Beta

Previously introduced in 1.19 behind a feature gate, `SetHostnameAsFQDN` is now enabled by default. More details on this behavior is available in [documentation for DNS for Services and Pods](https://docs.k8s.io/concepts/services-networking/dns-pod-service/#pod-sethostnameasfqdn-field)

### `TokenRequest` / `TokenRequestProjection` graduates to General Availability

Service account tokens bound to pod is now a stable feature. The feature gates will be removed in 1.21 release. For more information, refer to notes below on the changelogs.

### RuntimeClass feature graduates to General Availability.

The `node.k8s.io` API groups are promoted from `v1beta1` to `v1`. `v1beta1` is now deprecated and will be removed in a future release, please start using `v1`. ([#95718](https://github.com/kubernetes/kubernetes/pull/95718), [@SergeyKanzhelev](https://github.com/SergeyKanzhelev)) [SIG Apps, Auth, Node, Scheduling and Testing]

### Cloud Controller Manager now exclusively shipped by Cloud Provider

Kubernetes will no longer ship an instance of the Cloud Controller Manager binary. Each Cloud Provider is expected to ship their own instance of this binary. Details for a Cloud Provider to create an instance of such a binary can be found under [here](https://github.com/kubernetes/kubernetes/tree/master/staging/src/k8s.io/cloud-provider/sample). Anyone with questions on building a Cloud Controller Manager should reach out to SIG Cloud Provider. Questions about the Cloud Controller Manager on a Managed Kubernetes solution should go to the relevant Cloud Provider. Questions about the Cloud Controller Manager on a non managed solution can be brought up with SIG Cloud Provider.

## Known Issues

### Summary API in kubelet doesn't have accelerator metrics
Currently, cadvisor_stats_provider provides AcceleratorStats but cri_stats_provider does not. As a result, when using cri_stats_provider, kubelet's Summary API does not have accelerator metrics. [There is an open work in progress to fix this](https://github.com/kubernetes/kubernetes/pull/96873).

## Urgent Upgrade Notes 

### (No, really, you MUST read this before you upgrade)

- A bug was fixed in kubelet where exec probe timeouts were not respected. This may result in unexpected behavior since the default timeout (if not specified) is `1s` which may be too small for some exec probes. Ensure that pods relying on this behavior are updated to correctly handle probe timeouts. See [configure probe](https://docs.k8s.io/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#configure-probes) section of the documentation for more details.

  - This change in behavior may be unexpected for some clusters and can be disabled by turning off the `ExecProbeTimeout` feature gate. This gate will be locked and removed in future releases so that exec probe timeouts are always respected. ([#94115](https://github.com/kubernetes/kubernetes/pull/94115), [@andrewsykim](https://github.com/andrewsykim)) [SIG Node and Testing]
- RuntimeClass feature graduates to General Availability. Promote `node.k8s.io` API groups from `v1beta1` to `v1`. `v1beta1` is now deprecated and will be removed in a future release, please start using `v1`. ([#95718](https://github.com/kubernetes/kubernetes/pull/95718), [@SergeyKanzhelev](https://github.com/SergeyKanzhelev)) [SIG Apps, Auth, Node, Scheduling and Testing]
- API priority and fairness graduated to beta. 1.19 servers with APF turned on should not be run in a multi-server cluster with 1.20+ servers. ([#96527](https://github.com/kubernetes/kubernetes/pull/96527), [@adtac](https://github.com/adtac)) [SIG API Machinery and Testing]
- For CSI drivers, kubelet no longer creates the target_path for NodePublishVolume in accordance with the CSI spec. Kubelet also no longer checks if staging and target paths are mounts or corrupted. CSI drivers need to be idempotent and do any necessary mount verification. ([#88759](https://github.com/kubernetes/kubernetes/pull/88759), [@andyzhangx](https://github.com/andyzhangx)) [SIG Storage]
- Kubeadm: http://git.k8s.io/enhancements/keps/sig-cluster-lifecycle/kubeadm/2067-rename-master-label-taint/README.md ([#95382](https://github.com/kubernetes/kubernetes/pull/95382), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
  - The label applied to control-plane nodes "node-role.kubernetes.io/master" is now deprecated and will be removed in a future release after a GA deprecation period.
  - Introduce a new label "node-role.kubernetes.io/control-plane" that will be applied in parallel to "node-role.kubernetes.io/master" until the removal of the "node-role.kubernetes.io/master" label.
  - Make "kubeadm upgrade apply" add the "node-role.kubernetes.io/control-plane" label on existing nodes that only have the "node-role.kubernetes.io/master" label during upgrade.
  - Please adapt your tooling built on top of kubeadm to use the "node-role.kubernetes.io/control-plane" label.
  - The taint applied to control-plane nodes "node-role.kubernetes.io/master:NoSchedule" is now deprecated and will be removed in a future release after a GA deprecation period.
  - Apply toleration for a new, future taint "node-role.kubernetes.io/control-plane:NoSchedule" to the kubeadm CoreDNS / kube-dns managed manifests. Note that this taint is not yet applied to kubeadm control-plane nodes.
  - Please adapt your workloads to tolerate the same future taint preemptively.
    
- Kubeadm: improve the validation of serviceSubnet and podSubnet.
  ServiceSubnet has to be limited in size, due to implementation details, and the mask can not allocate more than 20 bits.
  PodSubnet validates against the corresponding cluster "--node-cidr-mask-size" of the kube-controller-manager, it fail if the values are not compatible.
  kubeadm no longer sets the node-mask automatically on IPv6 deployments, you must check that your IPv6 service subnet mask is compatible with the default node mask /64 or set it accordenly. 
  Previously, for IPv6, if the podSubnet had a mask lower than /112, kubeadm calculated a node-mask to be multiple of eight and splitting the available bits to maximise the number used for nodes. ([#95723](https://github.com/kubernetes/kubernetes/pull/95723), [@aojea](https://github.com/aojea)) [SIG Cluster Lifecycle]
- The deprecated flag --experimental-kustomize is now removed from kubeadm commands. Use --experimental-patches instead, which was introduced in 1.19. Migration information available in --help description for --experimental-patches. ([#94871](https://github.com/kubernetes/kubernetes/pull/94871), [@neolit123](https://github.com/neolit123))
- Windows hyper-v container featuregate is deprecated in 1.20 and will be removed in 1.21 ([#95505](https://github.com/kubernetes/kubernetes/pull/95505), [@wawa0210](https://github.com/wawa0210)) [SIG Node and Windows]
- The kube-apiserver ability to serve on an insecure port, deprecated since v1.10, has been removed. The insecure address flags `--address` and `--insecure-bind-address` have no effect in kube-apiserver and will be removed in v1.24. The insecure port flags `--port` and `--insecure-port` may only be set to 0 and will be removed in v1.24. ([#95856](https://github.com/kubernetes/kubernetes/pull/95856), [@knight42](https://github.com/knight42), [SIG API Machinery, Node, Testing])
- Add dual-stack Services (alpha).  This is a BREAKING CHANGE to an alpha API.
  It changes the dual-stack API wrt Service from a single ipFamily field to 3
  fields: ipFamilyPolicy (SingleStack, PreferDualStack, RequireDualStack),
  ipFamilies (a list of families assigned), and clusterIPs (inclusive of
  clusterIP).  Most users do not need to set anything at all, defaulting will
  handle it for them.  Services are single-stack unless the user asks for
  dual-stack.  This is all gated by the "IPv6DualStack" feature gate. ([#91824](https://github.com/kubernetes/kubernetes/pull/91824), [@khenidak](https://github.com/khenidak)) [SIG API Machinery, Apps, CLI, Network, Node, Scheduling and Testing]
- `TokenRequest` and `TokenRequestProjection` are now GA features. The following flags are required by the API server:
  - `--service-account-issuer`, should be set to a URL identifying the API server that will be stable over the cluster lifetime.
  - `--service-account-key-file`, set to one or more files containing one or more public keys used to verify tokens.
  - `--service-account-signing-key-file`, set to a file containing a private key to use to sign service account tokens. Can be the same file given to `kube-controller-manager` with `--service-account-private-key-file`. ([#95896](https://github.com/kubernetes/kubernetes/pull/95896), [@zshihang](https://github.com/zshihang)) [SIG API Machinery, Auth, Cluster Lifecycle]
- kubeadm: make the command "kubeadm alpha kubeconfig user" accept a "--config" flag and remove the following flags:
  - apiserver-advertise-address / apiserver-bind-port: use either localAPIEndpoint from InitConfiguration or controlPlaneEndpoint from ClusterConfiguration.
  - cluster-name: use clusterName from ClusterConfiguration
  - cert-dir: use certificatesDir from ClusterConfiguration ([#94879](https://github.com/kubernetes/kubernetes/pull/94879), [@knight42](https://github.com/knight42)) [SIG Cluster Lifecycle]
- Resolves non-deterministic behavior of the garbage collection controller when ownerReferences with incorrect data are encountered. Events with a reason of `OwnerRefInvalidNamespace` are recorded when namespace mismatches between child and owner objects are detected. The [kubectl-check-ownerreferences](https://github.com/kubernetes-sigs/kubectl-check-ownerreferences) tool can be run prior to upgrading to locate existing objects with invalid ownerReferences.
  - A namespaced object with an ownerReference referencing a uid of a namespaced kind which does not exist in the same namespace is now consistently treated as though that owner does not exist, and the child object is deleted.
  - A cluster-scoped object with an ownerReference referencing a uid of a namespaced kind is now consistently treated as though that owner is not resolvable, and the child object is ignored by the garbage collector. ([#92743](https://github.com/kubernetes/kubernetes/pull/92743), [@liggitt](https://github.com/liggitt)) [SIG API Machinery, Apps and Testing]


## Changes by Kind

### Deprecation

- Docker support in the kubelet is now deprecated and will be removed in a future release. The kubelet uses a module called "dockershim" which implements CRI support for Docker and it has seen maintenance issues in the Kubernetes community. We encourage you to evaluate moving to a container runtime that is a full-fledged implementation of CRI (v1alpha1 or v1 compliant) as they become available. ([#94624](https://github.com/kubernetes/kubernetes/pull/94624), [@dims](https://github.com/dims)) [SIG Node]
- Kubeadm: deprecate self-hosting support. The experimental command "kubeadm alpha self-hosting" is now deprecated and will be removed in a future release. ([#95125](https://github.com/kubernetes/kubernetes/pull/95125), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Kubeadm: graduate the "kubeadm alpha certs" command to a parent command "kubeadm certs". The command "kubeadm alpha certs" is deprecated and will be removed in a future release. Please migrate. ([#94938](https://github.com/kubernetes/kubernetes/pull/94938), [@yagonobre](https://github.com/yagonobre)) [SIG Cluster Lifecycle]
- Kubeadm: remove the deprecated "kubeadm alpha kubelet config enable-dynamic" command. To continue using the feature please defer to the guide for "Dynamic Kubelet Configuration" at k8s.io. This change also removes the parent command "kubeadm alpha kubelet" as there are no more sub-commands under it for the time being. ([#94668](https://github.com/kubernetes/kubernetes/pull/94668), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Kubeadm: remove the deprecated --kubelet-config flag for the command "kubeadm upgrade node" ([#94869](https://github.com/kubernetes/kubernetes/pull/94869), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Kubectl: deprecate --delete-local-data ([#95076](https://github.com/kubernetes/kubernetes/pull/95076), [@dougsland](https://github.com/dougsland)) [SIG CLI, Cloud Provider and Scalability]
- Kubelet's deprecated endpoint `metrics/resource/v1alpha1` has been removed, please adopt `metrics/resource`. ([#94272](https://github.com/kubernetes/kubernetes/pull/94272), [@RainbowMango](https://github.com/RainbowMango)) [SIG Instrumentation and Node]
- Removes deprecated scheduler metrics DeprecatedSchedulingDuration, DeprecatedSchedulingAlgorithmPredicateEvaluationSecondsDuration, DeprecatedSchedulingAlgorithmPriorityEvaluationSecondsDuration ([#94884](https://github.com/kubernetes/kubernetes/pull/94884), [@arghya88](https://github.com/arghya88)) [SIG Instrumentation and Scheduling]
- Scheduler alpha metrics binding_duration_seconds and scheduling_algorithm_preemption_evaluation_seconds are deprecated, Both of those metrics are now covered as part of framework_extension_point_duration_seconds, the former as a PostFilter the latter and a Bind plugin. The plan is to remove both in 1.21 ([#95001](https://github.com/kubernetes/kubernetes/pull/95001), [@arghya88](https://github.com/arghya88)) [SIG Instrumentation and Scheduling]
- Support 'controlplane' as a valid EgressSelection type in the EgressSelectorConfiguration API. 'Master' is deprecated and will be removed in v1.22. ([#95235](https://github.com/kubernetes/kubernetes/pull/95235), [@andrewsykim](https://github.com/andrewsykim)) [SIG API Machinery]
- The v1alpha1 PodPreset API and admission plugin has been removed with no built-in replacement. Admission webhooks can be used to modify pods on creation. ([#94090](https://github.com/kubernetes/kubernetes/pull/94090), [@deads2k](https://github.com/deads2k)) [SIG API Machinery, Apps, CLI, Cloud Provider, Scalability and Testing]


### API Change

- `TokenRequest` and `TokenRequestProjection` features have been promoted to GA. This feature allows generating service account tokens that are not visible in Secret objects and are tied to the lifetime of a Pod object. See https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#service-account-token-volume-projection for details on configuring and using this feature. The `TokenRequest` and `TokenRequestProjection` feature gates will be removed in v1.21.
  - kubeadm's kube-apiserver Pod manifest now includes the following flags by default "--service-account-key-file", "--service-account-signing-key-file", "--service-account-issuer". ([#93258](https://github.com/kubernetes/kubernetes/pull/93258), [@zshihang](https://github.com/zshihang)) [SIG API Machinery, Auth, Cluster Lifecycle, Storage and Testing]
- A new `nofuzz` go build tag now disables gofuzz support. Release binaries enable this. ([#92491](https://github.com/kubernetes/kubernetes/pull/92491), [@BenTheElder](https://github.com/BenTheElder)) [SIG API Machinery]
- Add WindowsContainerResources and Annotations to CRI-API UpdateContainerResourcesRequest ([#95741](https://github.com/kubernetes/kubernetes/pull/95741), [@katiewasnothere](https://github.com/katiewasnothere)) [SIG Node]
- Add a `serving` and `terminating` condition to the EndpointSlice API.
  `serving` tracks the readiness of endpoints regardless of their terminating state. This is distinct from `ready` since `ready` is only true when pods are not terminating. 
  `terminating` is true when an endpoint is terminating. For pods this is any endpoint with a deletion timestamp. ([#92968](https://github.com/kubernetes/kubernetes/pull/92968), [@andrewsykim](https://github.com/andrewsykim)) [SIG Apps and Network]
- Add dual-stack Services (alpha).  This is a BREAKING CHANGE to an alpha API.
  It changes the dual-stack API wrt Service from a single ipFamily field to 3
  fields: ipFamilyPolicy (SingleStack, PreferDualStack, RequireDualStack),
  ipFamilies (a list of families assigned), and clusterIPs (inclusive of
  clusterIP).  Most users do not need to set anything at all, defaulting will
  handle it for them.  Services are single-stack unless the user asks for
  dual-stack.  This is all gated by the "IPv6DualStack" feature gate. ([#91824](https://github.com/kubernetes/kubernetes/pull/91824), [@khenidak](https://github.com/khenidak)) [SIG API Machinery, Apps, CLI, Network, Node, Scheduling and Testing]
- Add support for hugepages to downward API ([#86102](https://github.com/kubernetes/kubernetes/pull/86102), [@derekwaynecarr](https://github.com/derekwaynecarr)) [SIG API Machinery, Apps, CLI, Network, Node, Scheduling and Testing]
- Adds kubelet alpha feature, `GracefulNodeShutdown` which makes kubelet aware of node system shutdowns and result in graceful termination of pods during a system shutdown. ([#96129](https://github.com/kubernetes/kubernetes/pull/96129), [@bobbypage](https://github.com/bobbypage)) [SIG Node]
- AppProtocol is now GA for Endpoints and Services. The ServiceAppProtocol feature gate will be deprecated in 1.21. ([#96327](https://github.com/kubernetes/kubernetes/pull/96327), [@robscott](https://github.com/robscott)) [SIG Apps and Network]
- Automatic allocation of NodePorts for services with type LoadBalancer can now be disabled by setting the (new) parameter
  Service.spec.allocateLoadBalancerNodePorts=false. The default is to allocate NodePorts for services with type LoadBalancer which is the existing behavior. ([#92744](https://github.com/kubernetes/kubernetes/pull/92744), [@uablrek](https://github.com/uablrek)) [SIG Apps and Network]
- Certain fields on  Service objects will be automatically cleared when changing the service's `type` to a mode that does not need those fields.  For example, changing from type=LoadBalancer to type=ClusterIP will clear the NodePort assignments, rather than forcing the user to clear them. ([#95196](https://github.com/kubernetes/kubernetes/pull/95196), [@thockin](https://github.com/thockin)) [SIG API Machinery, Apps, Network and Testing]
- Document that ServiceTopology feature is required to use `service.spec.topologyKeys`. ([#96528](https://github.com/kubernetes/kubernetes/pull/96528), [@andrewsykim](https://github.com/andrewsykim)) [SIG Apps]
- EndpointSlice has a new NodeName field guarded by the EndpointSliceNodeName feature gate.
  - EndpointSlice topology field will be deprecated in an upcoming release.
  - EndpointSlice "IP" address type is formally removed after being deprecated in Kubernetes 1.17.
  - The discovery.k8s.io/v1alpha1 API is deprecated and will be removed in Kubernetes 1.21. ([#96440](https://github.com/kubernetes/kubernetes/pull/96440), [@robscott](https://github.com/robscott)) [SIG API Machinery, Apps and Network]
- External facing API podresources is now available under k8s.io/kubelet/pkg/apis/ ([#92632](https://github.com/kubernetes/kubernetes/pull/92632), [@RenaudWasTaken](https://github.com/RenaudWasTaken)) [SIG Node and Testing]
- Fewer candidates are enumerated for preemption to improve performance in large clusters. ([#94814](https://github.com/kubernetes/kubernetes/pull/94814), [@adtac](https://github.com/adtac))
- Fix conversions for custom metrics. ([#94481](https://github.com/kubernetes/kubernetes/pull/94481), [@wojtek-t](https://github.com/wojtek-t)) [SIG API Machinery and Instrumentation]
- GPU metrics provided by kubelet are now disabled by default. ([#95184](https://github.com/kubernetes/kubernetes/pull/95184), [@RenaudWasTaken](https://github.com/RenaudWasTaken))
- If BoundServiceAccountTokenVolume is enabled, cluster admins can use metric `serviceaccount_stale_tokens_total` to monitor workloads that are depending on the extended tokens. If there are no such workloads, turn off extended tokens by starting `kube-apiserver` with flag `--service-account-extend-token-expiration=false` ([#96273](https://github.com/kubernetes/kubernetes/pull/96273), [@zshihang](https://github.com/zshihang)) [SIG API Machinery and Auth]
- Introduce alpha support for exec-based container registry credential provider plugins in the kubelet. ([#94196](https://github.com/kubernetes/kubernetes/pull/94196), [@andrewsykim](https://github.com/andrewsykim)) [SIG Node and Release]
- Introduces a metric source for HPAs which allows scaling based on container resource usage. ([#90691](https://github.com/kubernetes/kubernetes/pull/90691), [@arjunrn](https://github.com/arjunrn)) [SIG API Machinery, Apps, Autoscaling and CLI]
- Kube-apiserver now deletes expired kube-apiserver Lease objects:
  - The feature is under feature gate `APIServerIdentity`.
  - A flag is added to kube-apiserver: `identity-lease-garbage-collection-check-period-seconds` ([#95895](https://github.com/kubernetes/kubernetes/pull/95895), [@roycaihw](https://github.com/roycaihw)) [SIG API Machinery, Apps, Auth and Testing]
- Kube-controller-manager: volume plugins can be restricted from contacting local and loopback addresses by setting `--volume-host-allow-local-loopback=false`, or from contacting specific CIDR ranges by setting `--volume-host-cidr-denylist` (for example, `--volume-host-cidr-denylist=127.0.0.1/28,feed::/16`) ([#91785](https://github.com/kubernetes/kubernetes/pull/91785), [@mattcary](https://github.com/mattcary)) [SIG API Machinery, Apps, Auth, CLI, Network, Node, Storage and Testing]
- Migrate scheduler, controller-manager and cloud-controller-manager to use LeaseLock ([#94603](https://github.com/kubernetes/kubernetes/pull/94603), [@wojtek-t](https://github.com/wojtek-t)) [SIG API Machinery, Apps, Cloud Provider and Scheduling]
- Modify DNS-1123 error messages to indicate that RFC 1123 is not followed exactly ([#94182](https://github.com/kubernetes/kubernetes/pull/94182), [@mattfenwick](https://github.com/mattfenwick)) [SIG API Machinery, Apps, Auth, Network and Node]
- Move configurable fsgroup change policy for pods to beta ([#96376](https://github.com/kubernetes/kubernetes/pull/96376), [@gnufied](https://github.com/gnufied)) [SIG Apps and Storage]
- New flag is introduced, i.e. --topology-manager-scope=container|pod. 
  The default value is the "container" scope. ([#92967](https://github.com/kubernetes/kubernetes/pull/92967), [@cezaryzukowski](https://github.com/cezaryzukowski)) [SIG Instrumentation, Node and Testing]
- New parameter `defaultingType` for `PodTopologySpread` plugin allows to use k8s defined or user provided default constraints ([#95048](https://github.com/kubernetes/kubernetes/pull/95048), [@alculquicondor](https://github.com/alculquicondor)) [SIG Scheduling]
- NodeAffinity plugin can be configured with AddedAffinity. ([#96202](https://github.com/kubernetes/kubernetes/pull/96202), [@alculquicondor](https://github.com/alculquicondor)) [SIG Node, Scheduling and Testing]
- Promote RuntimeClass feature to GA.
  Promote node.k8s.io API groups from v1beta1 to v1. ([#95718](https://github.com/kubernetes/kubernetes/pull/95718), [@SergeyKanzhelev](https://github.com/SergeyKanzhelev)) [SIG Apps, Auth, Node, Scheduling and Testing]
- Reminder: The labels "failure-domain.beta.kubernetes.io/zone" and "failure-domain.beta.kubernetes.io/region" are deprecated in favor of "topology.kubernetes.io/zone" and "topology.kubernetes.io/region" respectively.  All users of the "failure-domain.beta..." labels should switch to the "topology..." equivalents. ([#96033](https://github.com/kubernetes/kubernetes/pull/96033), [@thockin](https://github.com/thockin)) [SIG API Machinery, Apps, CLI, Cloud Provider, Network, Node, Scheduling, Storage and Testing]
- Server Side Apply now treats LabelSelector fields as atomic (meaning the entire selector is managed by a single writer and updated together), since they contain interrelated and inseparable fields that do not merge in intuitive ways. ([#93901](https://github.com/kubernetes/kubernetes/pull/93901), [@jpbetz](https://github.com/jpbetz)) [SIG API Machinery, Auth, CLI, Cloud Provider, Cluster Lifecycle, Instrumentation, Network, Node, Storage and Testing]
- Services will now have a `clusterIPs` field to go with `clusterIP`.  `clusterIPs[0]` is a synonym for `clusterIP` and will be syncronized on create and update operations. ([#95894](https://github.com/kubernetes/kubernetes/pull/95894), [@thockin](https://github.com/thockin)) [SIG Network]
- The ServiceAccountIssuerDiscovery feature gate is now Beta and enabled by default. ([#91921](https://github.com/kubernetes/kubernetes/pull/91921), [@mtaufen](https://github.com/mtaufen)) [SIG Auth]
- The status of v1beta1 CRDs without "preserveUnknownFields:false" now shows a violation, "spec.preserveUnknownFields: Invalid value: true: must be false". ([#93078](https://github.com/kubernetes/kubernetes/pull/93078), [@vareti](https://github.com/vareti))
- The usage of mixed protocol values in the same LoadBalancer Service is possible if the new feature gate MixedProtocolLBService is enabled. The feature gate is disabled by default. The user has to enable it for the API Server. ([#94028](https://github.com/kubernetes/kubernetes/pull/94028), [@janosi](https://github.com/janosi)) [SIG API Machinery and Apps]
- This PR will introduce a feature gate CSIServiceAccountToken with two additional fields in `CSIDriverSpec`. ([#93130](https://github.com/kubernetes/kubernetes/pull/93130), [@zshihang](https://github.com/zshihang)) [SIG API Machinery, Apps, Auth, CLI, Network, Node, Storage and Testing]
- Users can try the cronjob controller v2 using the feature gate. This will be the default controller in future releases. ([#93370](https://github.com/kubernetes/kubernetes/pull/93370), [@alaypatel07](https://github.com/alaypatel07)) [SIG API Machinery, Apps, Auth and Testing]
- VolumeSnapshotDataSource moves to GA in 1.20 release ([#95282](https://github.com/kubernetes/kubernetes/pull/95282), [@xing-yang](https://github.com/xing-yang)) [SIG Apps]
- WinOverlay feature graduated to beta ([#94807](https://github.com/kubernetes/kubernetes/pull/94807), [@ksubrmnn](https://github.com/ksubrmnn)) [SIG Windows]

### Feature

- **Additional documentation e.g., KEPs (Kubernetes Enhancement Proposals), usage docs, etc.**:
- A new metric `apiserver_request_filter_duration_seconds` has been introduced that 
  measures request filter latency in seconds. ([#95207](https://github.com/kubernetes/kubernetes/pull/95207), [@tkashem](https://github.com/tkashem)) [SIG API Machinery and Instrumentation]
- A new set of alpha metrics are reported by the Kubernetes scheduler under the `/metrics/resources` endpoint that allow administrators to easily see the resource consumption (requests and limits for all resources on the pods) and compare it to actual pod usage or node capacity. ([#94866](https://github.com/kubernetes/kubernetes/pull/94866), [@smarterclayton](https://github.com/smarterclayton)) [SIG API Machinery, Instrumentation, Node and Scheduling]
- Add --experimental-logging-sanitization flag enabling runtime protection from leaking sensitive data in logs ([#96370](https://github.com/kubernetes/kubernetes/pull/96370), [@serathius](https://github.com/serathius)) [SIG API Machinery, Cluster Lifecycle and Instrumentation]
- Add a StorageVersionAPI feature gate that makes API server update storageversions before serving certain write requests. 
  This feature allows the storage migrator to manage storage migration for built-in resources. 
  Enabling internal.apiserver.k8s.io/v1alpha1 API and APIServerIdentity feature gate are required to use this feature. ([#93873](https://github.com/kubernetes/kubernetes/pull/93873), [@roycaihw](https://github.com/roycaihw)) [SIG API Machinery, Auth and Testing]
- Add a metric for time taken to perform recursive permission change ([#95866](https://github.com/kubernetes/kubernetes/pull/95866), [@JornShen](https://github.com/JornShen)) [SIG Instrumentation and Storage]
- Add a new `vSphere` metric: `cloudprovider_vsphere_vcenter_versions`. It's content show `vCenter` hostnames with the associated server version. ([#94526](https://github.com/kubernetes/kubernetes/pull/94526), [@Danil-Grigorev](https://github.com/Danil-Grigorev)) [SIG Cloud Provider and Instrumentation]
- Add a new flag to set priority for the kubelet on Windows nodes so that workloads cannot overwhelm the node there by disrupting kubelet process. ([#96051](https://github.com/kubernetes/kubernetes/pull/96051), [@ravisantoshgudimetla](https://github.com/ravisantoshgudimetla)) [SIG Node and Windows]
- Add feature to size memory backed volumes ([#94444](https://github.com/kubernetes/kubernetes/pull/94444), [@derekwaynecarr](https://github.com/derekwaynecarr)) [SIG Storage and Testing]
- Add foreground cascading deletion to kubectl with the new `kubectl delete foreground|background|orphan` option. ([#93384](https://github.com/kubernetes/kubernetes/pull/93384), [@zhouya0](https://github.com/zhouya0))
- Add metrics for azure service operations (route and loadbalancer). ([#94124](https://github.com/kubernetes/kubernetes/pull/94124), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider and Instrumentation]
- Add network rule support in Azure account creation. ([#94239](https://github.com/kubernetes/kubernetes/pull/94239), [@andyzhangx](https://github.com/andyzhangx))
- Add node_authorizer_actions_duration_seconds metric that can be used to estimate load to node authorizer. ([#92466](https://github.com/kubernetes/kubernetes/pull/92466), [@mborsz](https://github.com/mborsz)) [SIG API Machinery, Auth and Instrumentation]
- Add pod_ based CPU and memory metrics to Kubelet's  /metrics/resource endpoint ([#95839](https://github.com/kubernetes/kubernetes/pull/95839), [@egernst](https://github.com/egernst)) [SIG Instrumentation, Node and Testing]
- Added `get-users` and `delete-user` to the `kubectl config` subcommand ([#89840](https://github.com/kubernetes/kubernetes/pull/89840), [@eddiezane](https://github.com/eddiezane)) [SIG CLI]
- Added counter metric "apiserver_request_self" to count API server self-requests with labels for verb, resource, and subresource. ([#94288](https://github.com/kubernetes/kubernetes/pull/94288), [@LogicalShark](https://github.com/LogicalShark)) [SIG API Machinery, Auth, Instrumentation and Scheduling]
- Added new k8s.io/component-helpers repository providing shared helper code for (core) components. ([#92507](https://github.com/kubernetes/kubernetes/pull/92507), [@ingvagabund](https://github.com/ingvagabund)) [SIG Apps, Node, Release and Scheduling]
- Adds `create ingress` command to `kubectl` ([#78153](https://github.com/kubernetes/kubernetes/pull/78153), [@amimof](https://github.com/amimof)) [SIG CLI and Network]
- Adds a headless service on node-local-cache addon. ([#88412](https://github.com/kubernetes/kubernetes/pull/88412), [@stafot](https://github.com/stafot)) [SIG Cloud Provider and Network]
- Allow cross compilation of kubernetes on different platforms. ([#94403](https://github.com/kubernetes/kubernetes/pull/94403), [@bnrjee](https://github.com/bnrjee)) [SIG Release]
- Azure: Support multiple services sharing one IP address ([#94991](https://github.com/kubernetes/kubernetes/pull/94991), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]
- CRDs: For structural schemas, non-nullable null map fields will now be dropped and defaulted if a default is available. null items in list will continue being preserved, and fail validation if not nullable. ([#95423](https://github.com/kubernetes/kubernetes/pull/95423), [@apelisse](https://github.com/apelisse)) [SIG API Machinery]
- Changed: default "Accept: */*" header added to HTTP probes. See https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#http-probes (https://github.com/kubernetes/website/pull/24756) ([#95641](https://github.com/kubernetes/kubernetes/pull/95641), [@fonsecas72](https://github.com/fonsecas72)) [SIG Network and Node]
- Client-go credential plugins can now be passed in the current cluster information via the KUBERNETES_EXEC_INFO environment variable. ([#95489](https://github.com/kubernetes/kubernetes/pull/95489), [@ankeesler](https://github.com/ankeesler)) [SIG API Machinery and Auth]
- Command to start network proxy changes from 'KUBE_ENABLE_EGRESS_VIA_KONNECTIVITY_SERVICE ./cluster/kube-up.sh' to 'KUBE_ENABLE_KONNECTIVITY_SERVICE=true ./hack/kube-up.sh' ([#92669](https://github.com/kubernetes/kubernetes/pull/92669), [@Jefftree](https://github.com/Jefftree)) [SIG Cloud Provider]
- Configure AWS LoadBalancer health check protocol via service annotations. ([#94546](https://github.com/kubernetes/kubernetes/pull/94546), [@kishorj](https://github.com/kishorj))
- DefaultPodTopologySpread graduated to Beta. The feature gate is enabled by default. ([#95631](https://github.com/kubernetes/kubernetes/pull/95631), [@alculquicondor](https://github.com/alculquicondor)) [SIG Scheduling and Testing]
- E2e test for PodFsGroupChangePolicy ([#96247](https://github.com/kubernetes/kubernetes/pull/96247), [@saikat-royc](https://github.com/saikat-royc)) [SIG Storage and Testing]
- Ephemeral containers now apply the same API defaults as initContainers and containers ([#94896](https://github.com/kubernetes/kubernetes/pull/94896), [@wawa0210](https://github.com/wawa0210)) [SIG Apps and CLI]
- Gradudate the Pod Resources API to G.A
  Introduces the pod_resources_endpoint_requests_total metric which tracks the total number of requests to the pod resources API ([#92165](https://github.com/kubernetes/kubernetes/pull/92165), [@RenaudWasTaken](https://github.com/RenaudWasTaken)) [SIG Instrumentation, Node and Testing]
- In dual-stack bare-metal clusters, you can now pass dual-stack IPs to `kubelet --node-ip`.
  eg: `kubelet --node-ip 10.1.0.5,fd01::0005`. This is not yet supported for non-bare-metal
  clusters.
  
  In dual-stack clusters where nodes have dual-stack addresses, hostNetwork pods
  will now get dual-stack PodIPs. ([#95239](https://github.com/kubernetes/kubernetes/pull/95239), [@danwinship](https://github.com/danwinship)) [SIG Network and Node]
- Introduce api-extensions category which will return: mutating admission configs, validating admission configs, CRDs and APIServices when used in kubectl get, for example. ([#95603](https://github.com/kubernetes/kubernetes/pull/95603), [@soltysh](https://github.com/soltysh)) [SIG API Machinery]
- Introduces a new GCE specific cluster creation variable KUBE_PROXY_DISABLE. When set to true, this will skip over the creation of kube-proxy (whether the daemonset or static pod). This can be used to control the lifecycle of kube-proxy separately from the lifecycle of the nodes. ([#91977](https://github.com/kubernetes/kubernetes/pull/91977), [@varunmar](https://github.com/varunmar)) [SIG Cloud Provider]
- Kube-apiserver now maintains a Lease object to identify itself: 
  - The feature is under feature gate `APIServerIdentity`. 
  - Two flags are added to kube-apiserver: `identity-lease-duration-seconds`, `identity-lease-renew-interval-seconds` ([#95533](https://github.com/kubernetes/kubernetes/pull/95533), [@roycaihw](https://github.com/roycaihw)) [SIG API Machinery]
- Kube-apiserver: The timeout used when making health check calls to etcd can now be configured with `--etcd-healthcheck-timeout`. The default timeout is 2 seconds, matching the previous behavior. ([#93244](https://github.com/kubernetes/kubernetes/pull/93244), [@Sh4d1](https://github.com/Sh4d1)) [SIG API Machinery]
- Kube-apiserver: added support for compressing rotated audit log files with `--audit-log-compress` ([#94066](https://github.com/kubernetes/kubernetes/pull/94066), [@lojies](https://github.com/lojies)) [SIG API Machinery and Auth]
- Kubeadm now prints warnings instead of throwing errors if the current system time is outside of the NotBefore and NotAfter bounds of a loaded certificate.  ([#94504](https://github.com/kubernetes/kubernetes/pull/94504), [@neolit123](https://github.com/neolit123))
- Kubeadm: Add a preflight check that the control-plane node has at least 1700MB of RAM ([#93275](https://github.com/kubernetes/kubernetes/pull/93275), [@xlgao-zju](https://github.com/xlgao-zju)) [SIG Cluster Lifecycle]
- Kubeadm: add the "--cluster-name" flag to the "kubeadm alpha kubeconfig user" to allow configuring the cluster name in the generated kubeconfig file ([#93992](https://github.com/kubernetes/kubernetes/pull/93992), [@prabhu43](https://github.com/prabhu43)) [SIG Cluster Lifecycle]
- Kubeadm: add the "--kubeconfig" flag to the "kubeadm init phase upload-certs" command to allow users to pass a custom location for a kubeconfig file. ([#94765](https://github.com/kubernetes/kubernetes/pull/94765), [@zhanw15](https://github.com/zhanw15)) [SIG Cluster Lifecycle]
- Kubeadm: make etcd pod request 100m CPU, 100Mi memory and 100Mi ephemeral_storage by default ([#94479](https://github.com/kubernetes/kubernetes/pull/94479), [@knight42](https://github.com/knight42)) [SIG Cluster Lifecycle]
- Kubeadm: make the command "kubeadm alpha kubeconfig user" accept a "--config" flag and remove the following flags:
  - apiserver-advertise-address / apiserver-bind-port: use either localAPIEndpoint from InitConfiguration or controlPlaneEndpoint from ClusterConfiguration.
  - cluster-name: use clusterName from ClusterConfiguration
  - cert-dir: use certificatesDir from ClusterConfiguration ([#94879](https://github.com/kubernetes/kubernetes/pull/94879), [@knight42](https://github.com/knight42)) [SIG Cluster Lifecycle]
- Kubectl create now supports creating ingress objects. ([#94327](https://github.com/kubernetes/kubernetes/pull/94327), [@rikatz](https://github.com/rikatz)) [SIG CLI and Network]
- Kubectl rollout history sts/sts-name --revision=some-revision will start showing the detailed view of  the sts on that specified revision ([#86506](https://github.com/kubernetes/kubernetes/pull/86506), [@dineshba](https://github.com/dineshba)) [SIG CLI]
- Kubectl: Previously users cannot provide arguments to a external diff tool via KUBECTL_EXTERNAL_DIFF env. This release now allow users to specify args to KUBECTL_EXTERNAL_DIFF env. ([#95292](https://github.com/kubernetes/kubernetes/pull/95292), [@dougsland](https://github.com/dougsland)) [SIG CLI]
- Kubemark now supports both real and hollow nodes in a single cluster. ([#93201](https://github.com/kubernetes/kubernetes/pull/93201), [@ellistarn](https://github.com/ellistarn)) [SIG Scalability]
- Kubernetes E2E test image manifest lists now contain Windows images. ([#77398](https://github.com/kubernetes/kubernetes/pull/77398), [@claudiubelu](https://github.com/claudiubelu)) [SIG Testing and Windows]
- Kubernetes is now built using go1.15.2
  - build: Update to k/repo-infra@v0.1.1 (supports go1.15.2)
  - build: Use go-runner:buster-v2.0.1 (built using go1.15.1)
  - bazel: Replace --features with Starlark build settings flag
  - hack/lib/util.sh: some bash cleanups
    
    - switched one spot to use kube::logging
    - make kube::util::find-binary return an error when it doesn't find
      anything so that hack scripts fail fast instead of with '' binary not
      found errors.
    - this required deleting some genfeddoc stuff. the binary no longer
      exists in k/k repo since we removed federation/, and I don't see it
      in https://github.com/kubernetes-sigs/kubefed/ either. I'm assuming
      that it's gone for good now.
  
  - bazel: output go_binary rule directly from go_binary_conditional_pure
    
    From: [@mikedanese](https://github.com/mikedanese):
    Instead of aliasing. Aliases are annoying in a number of ways. This is
    specifically bugging me now because they make the action graph harder to
    analyze programmatically. By using aliases here, we would need to handle
    potentially aliased go_binary targets and dereference to the effective
    target.
  
    The comment references an issue with `pure = select(...)` which appears
    to be resolved considering this now builds.
  
  - make kube::util::find-binary not dependent on bazel-out/ structure
  
    Implement an aspect that outputs go_build_mode metadata for go binaries,
    and use that during binary selection. ([#94449](https://github.com/kubernetes/kubernetes/pull/94449), [@justaugustus](https://github.com/justaugustus)) [SIG Architecture, CLI, Cluster Lifecycle, Node, Release and Testing]
- Kubernetes is now built using go1.15.5
  - build: Update to k/repo-infra@v0.1.2 (supports go1.15.5) ([#95776](https://github.com/kubernetes/kubernetes/pull/95776), [@justaugustus](https://github.com/justaugustus)) [SIG Cloud Provider, Instrumentation, Release and Testing]
- New default scheduling plugins order reduces scheduling and preemption latency when taints and node affinity are used ([#95539](https://github.com/kubernetes/kubernetes/pull/95539), [@soulxu](https://github.com/soulxu)) [SIG Scheduling]
- Only update Azure data disks when attach/detach ([#94265](https://github.com/kubernetes/kubernetes/pull/94265), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider]
- Promote SupportNodePidsLimit to GA to provide node-to-pod PID isolation.
  Promote SupportPodPidsLimit to GA to provide ability to limit PIDs per pod. ([#94140](https://github.com/kubernetes/kubernetes/pull/94140), [@derekwaynecarr](https://github.com/derekwaynecarr))
- SCTP support in API objects (Pod, Service, NetworkPolicy) is now GA.
  Note that this has no effect on whether SCTP is enabled on nodes at the kernel level,
  and note that some cloud platforms and network plugins do not support SCTP traffic. ([#95566](https://github.com/kubernetes/kubernetes/pull/95566), [@danwinship](https://github.com/danwinship)) [SIG Apps and Network]
- Scheduler now ignores Pod update events if the resourceVersion of old and new Pods are identical. ([#96071](https://github.com/kubernetes/kubernetes/pull/96071), [@Huang-Wei](https://github.com/Huang-Wei)) [SIG Scheduling]
- Scheduling Framework: expose Run[Pre]ScorePlugins functions to PreemptionHandle which can be used in PostFilter extention point. ([#93534](https://github.com/kubernetes/kubernetes/pull/93534), [@everpeace](https://github.com/everpeace)) [SIG Scheduling and Testing]
- SelectorSpreadPriority maps to PodTopologySpread plugin when DefaultPodTopologySpread feature is enabled ([#95448](https://github.com/kubernetes/kubernetes/pull/95448), [@alculquicondor](https://github.com/alculquicondor)) [SIG Scheduling]
- Send GCE node startup scripts logs to console and journal. ([#95311](https://github.com/kubernetes/kubernetes/pull/95311), [@karan](https://github.com/karan))
- SetHostnameAsFQDN has been graduated to Beta and therefore it is enabled by default. ([#95267](https://github.com/kubernetes/kubernetes/pull/95267), [@javidiaz](https://github.com/javidiaz)) [SIG Node]
- Support [service.beta.kubernetes.io/azure-pip-ip-tags] annotations to allow customers to specify ip-tags to influence public-ip creation in Azure [Tag1=Value1, Tag2=Value2, etc.] ([#94114](https://github.com/kubernetes/kubernetes/pull/94114), [@MarcPow](https://github.com/MarcPow)) [SIG Cloud Provider]
- Support custom tags for cloud provider managed resources ([#96450](https://github.com/kubernetes/kubernetes/pull/96450), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]
- Support customize load balancer health probe protocol and request path ([#96338](https://github.com/kubernetes/kubernetes/pull/96338), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]
- Support for Windows container images (OS Versions: 1809, 1903, 1909, 2004) was added the pause:3.4 image. ([#91452](https://github.com/kubernetes/kubernetes/pull/91452), [@claudiubelu](https://github.com/claudiubelu)) [SIG Node, Release and Windows]
- Support multiple standard load balancers in one cluster ([#96111](https://github.com/kubernetes/kubernetes/pull/96111), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]
- The beta `RootCAConfigMap` feature gate is enabled by default and causes kube-controller-manager to publish a "kube-root-ca.crt" ConfigMap to every namespace. This ConfigMap contains a CA bundle used for verifying connections to the kube-apiserver. ([#96197](https://github.com/kubernetes/kubernetes/pull/96197), [@zshihang](https://github.com/zshihang)) [SIG API Machinery, Apps, Auth and Testing]
- The kubelet_runtime_operations_duration_seconds metric buckets were set to 0.005 0.0125 0.03125 0.078125 0.1953125 0.48828125 1.220703125 3.0517578125 7.62939453125 19.073486328125 47.6837158203125 119.20928955078125 298.0232238769531 and 745.0580596923828 seconds ([#96054](https://github.com/kubernetes/kubernetes/pull/96054), [@alvaroaleman](https://github.com/alvaroaleman)) [SIG Instrumentation and Node]
- There is a new pv_collector_total_pv_count metric that counts persistent volumes by the volume plugin name and volume mode. ([#95719](https://github.com/kubernetes/kubernetes/pull/95719), [@tsmetana](https://github.com/tsmetana)) [SIG Apps, Instrumentation, Storage and Testing]
- Volume snapshot e2e test to validate PVC and VolumeSnapshotContent finalizer ([#95863](https://github.com/kubernetes/kubernetes/pull/95863), [@RaunakShah](https://github.com/RaunakShah)) [SIG Cloud Provider, Storage and Testing]
- Warns user when executing kubectl apply/diff to resource currently being deleted. ([#95544](https://github.com/kubernetes/kubernetes/pull/95544), [@SaiHarshaK](https://github.com/SaiHarshaK)) [SIG CLI]
- `kubectl alpha debug` has graduated to beta and is now `kubectl debug`. ([#96138](https://github.com/kubernetes/kubernetes/pull/96138), [@verb](https://github.com/verb)) [SIG CLI and Testing]
- `kubectl debug` gains support for changing container images when copying a pod for debugging, similar to how `kubectl set image` works. See `kubectl help debug` for more information. ([#96058](https://github.com/kubernetes/kubernetes/pull/96058), [@verb](https://github.com/verb)) [SIG CLI]

### Documentation

- Fake dynamic client: document that List does not preserve TypeMeta in UnstructuredList ([#95117](https://github.com/kubernetes/kubernetes/pull/95117), [@andrewsykim](https://github.com/andrewsykim)) [SIG API Machinery]
- Kubelet: remove alpha warnings for CNI flags. ([#94508](https://github.com/kubernetes/kubernetes/pull/94508), [@andrewsykim](https://github.com/andrewsykim)) [SIG Network and Node]
- Updates docs and guidance on cloud provider InstancesV2 and Zones interface for external cloud providers:
  - removes experimental warning for InstancesV2
  - document that implementation of InstancesV2 will disable calls to Zones
  - deprecate Zones in favor of InstancesV2 ([#96397](https://github.com/kubernetes/kubernetes/pull/96397), [@andrewsykim](https://github.com/andrewsykim)) [SIG Cloud Provider]

### Failing Test

- Resolves an issue running Ingress conformance tests on clusters which use finalizers on Ingress objects to manage releasing load balancer resources ([#96742](https://github.com/kubernetes/kubernetes/pull/96742), [@spencerhance](https://github.com/spencerhance)) [SIG Network and Testing]
- The Conformance test "validates that there is no conflict between pods with same hostPort but different hostIP and protocol" now validates the connectivity to each hostPort, in addition to the functionality. ([#96627](https://github.com/kubernetes/kubernetes/pull/96627), [@aojea](https://github.com/aojea)) [SIG Scheduling and Testing]

### Bug or Regression

- Add kubectl wait  --ignore-not-found flag ([#90969](https://github.com/kubernetes/kubernetes/pull/90969), [@zhouya0](https://github.com/zhouya0)) [SIG CLI]
- Added support to kube-proxy for externalTrafficPolicy=Local setting via Direct Server Return (DSR) load balancers on Windows. ([#93166](https://github.com/kubernetes/kubernetes/pull/93166), [@elweb9858](https://github.com/elweb9858)) [SIG Network]
- Alter wording to describe pods using a pvc ([#95635](https://github.com/kubernetes/kubernetes/pull/95635), [@RaunakShah](https://github.com/RaunakShah)) [SIG CLI]
- An issues preventing volume expand controller to annotate the PVC with `volume.kubernetes.io/storage-resizer` when the PVC StorageClass is already updated to the out-of-tree provisioner is now fixed. ([#94489](https://github.com/kubernetes/kubernetes/pull/94489), [@ialidzhikov](https://github.com/ialidzhikov)) [SIG API Machinery, Apps and Storage]
- Azure ARM client: don't segfault on empty response and http error ([#94078](https://github.com/kubernetes/kubernetes/pull/94078), [@bpineau](https://github.com/bpineau)) [SIG Cloud Provider]
- Azure armclient backoff step defaults to 1 (no retry). ([#94180](https://github.com/kubernetes/kubernetes/pull/94180), [@feiskyer](https://github.com/feiskyer))
- Azure: fix a bug that kube-controller-manager would panic if wrong Azure VMSS name is configured ([#94306](https://github.com/kubernetes/kubernetes/pull/94306), [@knight42](https://github.com/knight42)) [SIG Cloud Provider]
- Both apiserver_request_duration_seconds metrics and RequestReceivedTimestamp fields of an audit event now take into account the time a request spends in the apiserver request filters. ([#94903](https://github.com/kubernetes/kubernetes/pull/94903), [@tkashem](https://github.com/tkashem))
- Build/lib/release: Explicitly use '--platform' in building server images
  
  When we switched to go-runner for building the apiserver,
  controller-manager, and scheduler server components, we no longer
  reference the individual architectures in the image names, specifically
  in the 'FROM' directive of the server image Dockerfiles.
  
  As a result, server images for non-amd64 images copy in the go-runner
  amd64 binary instead of the go-runner that matches that architecture.
  
  This commit explicitly sets the '--platform=linux/${arch}' to ensure
  we're pulling the correct go-runner arch from the manifest list.
  
  Before:
  `FROM ${base_image}`
  
  After:
  `FROM --platform=linux/${arch} ${base_image}` ([#94552](https://github.com/kubernetes/kubernetes/pull/94552), [@justaugustus](https://github.com/justaugustus)) [SIG Release]
- Bump node-problem-detector version to v0.8.5 to fix OOM detection in with Linux kernels 5.1+ ([#96716](https://github.com/kubernetes/kubernetes/pull/96716), [@tosi3k](https://github.com/tosi3k)) [SIG Cloud Provider, Scalability and Testing]
- CSIDriver object can be deployed during volume attachment. ([#93710](https://github.com/kubernetes/kubernetes/pull/93710), [@Jiawei0227](https://github.com/Jiawei0227)) [SIG Apps, Node, Storage and Testing]
- Ceph RBD volume expansion now works even when ceph.conf was not provided. ([#92027](https://github.com/kubernetes/kubernetes/pull/92027), [@juliantaylor](https://github.com/juliantaylor))
- Change plugin name in fsgroupapplymetrics of csi and flexvolume to distinguish different driver ([#95892](https://github.com/kubernetes/kubernetes/pull/95892), [@JornShen](https://github.com/JornShen)) [SIG Instrumentation, Storage and Testing]
- Change the calculation of pod UIDs so that static pods get a unique value - will cause all containers to be killed and recreated after in-place upgrade. ([#87461](https://github.com/kubernetes/kubernetes/pull/87461), [@bboreham](https://github.com/bboreham)) [SIG Node]
- Change the mount way from systemd to normal mount except ceph and glusterfs intree-volume. ([#94916](https://github.com/kubernetes/kubernetes/pull/94916), [@smileusd](https://github.com/smileusd)) [SIG Apps, Cloud Provider, Network, Node, Storage and Testing]
- Changes to timeout parameter handling in 1.20.0-beta.2 have been reverted to avoid breaking backwards compatibility with existing clients. ([#96727](https://github.com/kubernetes/kubernetes/pull/96727), [@liggitt](https://github.com/liggitt)) [SIG API Machinery and Testing]
- Clear UDP conntrack entry on endpoint changes when using nodeport ([#71573](https://github.com/kubernetes/kubernetes/pull/71573), [@JacobTanenbaum](https://github.com/JacobTanenbaum)) [SIG Network]
- Cloud node controller: handle empty providerID from getProviderID ([#95342](https://github.com/kubernetes/kubernetes/pull/95342), [@nicolehanjing](https://github.com/nicolehanjing)) [SIG Cloud Provider]
- Disable watchcache for events ([#96052](https://github.com/kubernetes/kubernetes/pull/96052), [@wojtek-t](https://github.com/wojtek-t)) [SIG API Machinery]
- Disabled `LocalStorageCapacityIsolation` feature gate is honored during scheduling. ([#96092](https://github.com/kubernetes/kubernetes/pull/96092), [@Huang-Wei](https://github.com/Huang-Wei)) [SIG Scheduling]
- Do not fail sorting empty elements. ([#94666](https://github.com/kubernetes/kubernetes/pull/94666), [@soltysh](https://github.com/soltysh)) [SIG CLI]
- Dual-stack: make nodeipam compatible with existing single-stack clusters when dual-stack feature gate become enabled by default ([#90439](https://github.com/kubernetes/kubernetes/pull/90439), [@SataQiu](https://github.com/SataQiu)) [SIG API Machinery]
- Duplicate owner reference entries in create/update/patch requests now get deduplicated by the API server. The client sending the request now receives a warning header in the API response. Clients should stop sending requests with duplicate owner references. The API server may reject such requests as early as 1.24. ([#96185](https://github.com/kubernetes/kubernetes/pull/96185), [@roycaihw](https://github.com/roycaihw)) [SIG API Machinery and Testing]
- Endpoint slice controller now mirrors parent's service label to its corresponding endpoint slices. ([#94443](https://github.com/kubernetes/kubernetes/pull/94443), [@aojea](https://github.com/aojea))
- Ensure getPrimaryInterfaceID not panic when network interfaces for Azure VMSS are null ([#94355](https://github.com/kubernetes/kubernetes/pull/94355), [@feiskyer](https://github.com/feiskyer)) [SIG Cloud Provider]
- Exposes and sets a default timeout for the SubjectAccessReview client for DelegatingAuthorizationOptions ([#95725](https://github.com/kubernetes/kubernetes/pull/95725), [@p0lyn0mial](https://github.com/p0lyn0mial)) [SIG API Machinery and Cloud Provider]
- Exposes and sets a default timeout for the TokenReview client for DelegatingAuthenticationOptions ([#96217](https://github.com/kubernetes/kubernetes/pull/96217), [@p0lyn0mial](https://github.com/p0lyn0mial)) [SIG API Machinery and Cloud Provider]
- Fix CVE-2020-8555 for Quobyte client connections. ([#95206](https://github.com/kubernetes/kubernetes/pull/95206), [@misterikkit](https://github.com/misterikkit)) [SIG Storage]
- Fix IP fragmentation of UDP and TCP packets not supported issues on LoadBalancer rules ([#96464](https://github.com/kubernetes/kubernetes/pull/96464), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]
- Fix a bug that DefaultPreemption plugin is disabled when using (legacy) scheduler policy. ([#96439](https://github.com/kubernetes/kubernetes/pull/96439), [@Huang-Wei](https://github.com/Huang-Wei)) [SIG Scheduling and Testing]
- Fix a bug where loadbalancer deletion gets stuck because of missing resource group. ([#93962](https://github.com/kubernetes/kubernetes/pull/93962), [@phiphi282](https://github.com/phiphi282))
- Fix a concurrent map writes error in kubelet ([#93773](https://github.com/kubernetes/kubernetes/pull/93773), [@knight42](https://github.com/knight42)) [SIG Node]
- Fix a panic in `kubectl debug` when a pod has multiple init or ephemeral containers. ([#94580](https://github.com/kubernetes/kubernetes/pull/94580), [@kiyoshim55](https://github.com/kiyoshim55))
- Fix a regression where kubeadm bails out with a fatal error when an optional version command line argument is supplied to the "kubeadm upgrade plan" command ([#94421](https://github.com/kubernetes/kubernetes/pull/94421), [@rosti](https://github.com/rosti)) [SIG Cluster Lifecycle]
- Fix azure disk attach failure for disk size bigger than 4TB ([#95463](https://github.com/kubernetes/kubernetes/pull/95463), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider]
- Fix azure disk data loss issue on Windows when unmount disk ([#95456](https://github.com/kubernetes/kubernetes/pull/95456), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider and Storage]
- Fix azure file migration panic ([#94853](https://github.com/kubernetes/kubernetes/pull/94853), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider]
- Fix bug in JSON path parser where an error occurs when a range is empty ([#95933](https://github.com/kubernetes/kubernetes/pull/95933), [@brianpursley](https://github.com/brianpursley)) [SIG API Machinery]
- Fix client-go prometheus metrics to correctly present the API path accessed in some environments. ([#74363](https://github.com/kubernetes/kubernetes/pull/74363), [@aanm](https://github.com/aanm)) [SIG API Machinery]
- Fix detach azure disk issue when vm not exist ([#95177](https://github.com/kubernetes/kubernetes/pull/95177), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider]
- Fix etcd_object_counts metric reported by kube-apiserver ([#94773](https://github.com/kubernetes/kubernetes/pull/94773), [@tkashem](https://github.com/tkashem)) [SIG API Machinery]
- Fix incorrectly reported verbs for kube-apiserver metrics for CRD objects ([#93523](https://github.com/kubernetes/kubernetes/pull/93523), [@wojtek-t](https://github.com/wojtek-t)) [SIG API Machinery and Instrumentation]
- Fix k8s.io/apimachinery/pkg/api/meta.SetStatusCondition to update ObservedGeneration ([#95961](https://github.com/kubernetes/kubernetes/pull/95961), [@KnicKnic](https://github.com/KnicKnic)) [SIG API Machinery]
- Fix kubectl SchemaError on CRDs with schema using x-kubernetes-preserve-unknown-fields on array types. ([#94888](https://github.com/kubernetes/kubernetes/pull/94888), [@sttts](https://github.com/sttts)) [SIG API Machinery]
- Fix memory leak in kube-apiserver when underlying time goes forth and back. ([#96266](https://github.com/kubernetes/kubernetes/pull/96266), [@chenyw1990](https://github.com/chenyw1990)) [SIG API Machinery]
- Fix missing csi annotations on node during parallel csinode update. ([#94389](https://github.com/kubernetes/kubernetes/pull/94389), [@pacoxu](https://github.com/pacoxu)) [SIG Storage]
- Fix network_programming_latency metric reporting for Endpoints/EndpointSlice deletions, where we don't have correct timestamp ([#95363](https://github.com/kubernetes/kubernetes/pull/95363), [@wojtek-t](https://github.com/wojtek-t)) [SIG Network and Scalability]
- Fix paging issues when Azure API returns empty values with non-empty nextLink ([#96211](https://github.com/kubernetes/kubernetes/pull/96211), [@feiskyer](https://github.com/feiskyer)) [SIG Cloud Provider]
- Fix pull image error from multiple ACRs using azure managed identity ([#96355](https://github.com/kubernetes/kubernetes/pull/96355), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider]
- Fix race condition on timeCache locks. ([#94751](https://github.com/kubernetes/kubernetes/pull/94751), [@auxten](https://github.com/auxten))
- Fix regression on `kubectl portforward` when TCP and UCP services were configured on the same port. ([#94728](https://github.com/kubernetes/kubernetes/pull/94728), [@amorenoz](https://github.com/amorenoz))
- Fix scheduler cache snapshot when a Node is deleted before its Pods ([#95130](https://github.com/kubernetes/kubernetes/pull/95130), [@alculquicondor](https://github.com/alculquicondor)) [SIG Scheduling]
- Fix the `cloudprovider_azure_api_request_duration_seconds` metric buckets to correctly capture the latency metrics. Previously, the majority of the calls would fall in the "+Inf" bucket. ([#94873](https://github.com/kubernetes/kubernetes/pull/94873), [@marwanad](https://github.com/marwanad)) [SIG Cloud Provider and Instrumentation]
- Fix vSphere volumes that could be erroneously attached to wrong node ([#96224](https://github.com/kubernetes/kubernetes/pull/96224), [@gnufied](https://github.com/gnufied)) [SIG Cloud Provider and Storage]
- Fix verb & scope reporting for kube-apiserver metrics (LIST reported instead of GET) ([#95562](https://github.com/kubernetes/kubernetes/pull/95562), [@wojtek-t](https://github.com/wojtek-t)) [SIG API Machinery and Testing]
- Fix vsphere detach failure for static PVs ([#95447](https://github.com/kubernetes/kubernetes/pull/95447), [@gnufied](https://github.com/gnufied)) [SIG Cloud Provider and Storage]
- Fix: azure disk resize error if source does not exist ([#93011](https://github.com/kubernetes/kubernetes/pull/93011), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider]
- Fix: detach azure disk broken on Azure Stack ([#94885](https://github.com/kubernetes/kubernetes/pull/94885), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider]
- Fix: resize Azure disk issue when it's in attached state ([#96705](https://github.com/kubernetes/kubernetes/pull/96705), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider]
- Fix: smb valid path error ([#95583](https://github.com/kubernetes/kubernetes/pull/95583), [@andyzhangx](https://github.com/andyzhangx)) [SIG Storage]
- Fix: use sensitiveOptions on Windows mount ([#94126](https://github.com/kubernetes/kubernetes/pull/94126), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider and Storage]
- Fixed a bug causing incorrect formatting of `kubectl describe ingress`. ([#94985](https://github.com/kubernetes/kubernetes/pull/94985), [@howardjohn](https://github.com/howardjohn)) [SIG CLI and Network]
- Fixed a bug in client-go where new clients with customized `Dial`, `Proxy`, `GetCert` config may get stale HTTP transports. ([#95427](https://github.com/kubernetes/kubernetes/pull/95427), [@roycaihw](https://github.com/roycaihw)) [SIG API Machinery]
- Fixed a bug that prevents kubectl to validate CRDs with schema using x-kubernetes-preserve-unknown-fields on object fields. ([#96369](https://github.com/kubernetes/kubernetes/pull/96369), [@gautierdelorme](https://github.com/gautierdelorme)) [SIG API Machinery and Testing]
- Fixed a bug that prevents the use of ephemeral containers in the presence of a validating admission webhook. ([#94685](https://github.com/kubernetes/kubernetes/pull/94685), [@verb](https://github.com/verb)) [SIG Node and Testing]
- Fixed a bug where aggregator_unavailable_apiservice metrics were reported for deleted apiservices. ([#96421](https://github.com/kubernetes/kubernetes/pull/96421), [@dgrisonnet](https://github.com/dgrisonnet)) [SIG API Machinery and Instrumentation]
- Fixed a bug where improper storage and comparison of endpoints led to excessive API traffic from the endpoints controller ([#94112](https://github.com/kubernetes/kubernetes/pull/94112), [@damemi](https://github.com/damemi)) [SIG Apps, Network and Testing]
- Fixed a regression which prevented pods with `docker/default` seccomp annotations from being created in 1.19 if a PodSecurityPolicy was in place which did not allow `runtime/default` seccomp profiles. ([#95985](https://github.com/kubernetes/kubernetes/pull/95985), [@saschagrunert](https://github.com/saschagrunert)) [SIG Auth]
- Fixed bug in reflector that couldn't recover from "Too large resource version" errors with API servers 1.17.0-1.18.5 ([#94316](https://github.com/kubernetes/kubernetes/pull/94316), [@janeczku](https://github.com/janeczku)) [SIG API Machinery]
- Fixed bug where kubectl top pod output is not sorted when --sort-by and --containers flags are used together ([#93692](https://github.com/kubernetes/kubernetes/pull/93692), [@brianpursley](https://github.com/brianpursley)) [SIG CLI]
- Fixed kubelet creating extra sandbox for pods with RestartPolicyOnFailure after all containers succeeded ([#92614](https://github.com/kubernetes/kubernetes/pull/92614), [@tnqn](https://github.com/tnqn)) [SIG Node and Testing]
- Fixes an issue proxying to ipv6 pods without specifying a port ([#94834](https://github.com/kubernetes/kubernetes/pull/94834), [@liggitt](https://github.com/liggitt)) [SIG API Machinery and Network]
- Fixes code generation for non-namespaced create subresources fake client test. ([#96586](https://github.com/kubernetes/kubernetes/pull/96586), [@Doude](https://github.com/Doude)) [SIG API Machinery]
- Fixes high CPU usage in kubectl drain ([#95260](https://github.com/kubernetes/kubernetes/pull/95260), [@amandahla](https://github.com/amandahla)) [SIG CLI]
- For vSphere Cloud Provider, If VM of worker node is deleted, the node will also be deleted by node controller ([#92608](https://github.com/kubernetes/kubernetes/pull/92608), [@lubronzhan](https://github.com/lubronzhan)) [SIG Cloud Provider]
- Gracefully delete nodes when their parent scale set went missing ([#95289](https://github.com/kubernetes/kubernetes/pull/95289), [@bpineau](https://github.com/bpineau)) [SIG Cloud Provider]
- HTTP/2 connection health check is enabled by default in all Kubernetes clients. The feature should work out-of-the-box. If needed, users can tune the feature via the HTTP2_READ_IDLE_TIMEOUT_SECONDS and HTTP2_PING_TIMEOUT_SECONDS environment variables. The feature is disabled if HTTP2_READ_IDLE_TIMEOUT_SECONDS is set to 0. ([#95981](https://github.com/kubernetes/kubernetes/pull/95981), [@caesarxuchao](https://github.com/caesarxuchao)) [SIG API Machinery, CLI, Cloud Provider, Cluster Lifecycle, Instrumentation and Node]
- If the user specifies an invalid timeout in the request URL, the request will be aborted with an HTTP 400.
  - If the user specifies a timeout in the request URL that exceeds the maximum request deadline allowed by the apiserver, the request will be aborted with an HTTP 400. ([#96061](https://github.com/kubernetes/kubernetes/pull/96061), [@tkashem](https://github.com/tkashem)) [SIG API Machinery, Network and Testing]
- If we set SelectPolicy MinPolicySelect on scaleUp behavior or scaleDown behavior,Horizontal Pod Autoscaler doesn`t automatically scale the number of pods correctly ([#95647](https://github.com/kubernetes/kubernetes/pull/95647), [@JoshuaAndrew](https://github.com/JoshuaAndrew)) [SIG Apps and Autoscaling]
- Ignore apparmor for non-linux operating systems ([#93220](https://github.com/kubernetes/kubernetes/pull/93220), [@wawa0210](https://github.com/wawa0210)) [SIG Node and Windows]
- Ignore root user check when windows pod starts ([#92355](https://github.com/kubernetes/kubernetes/pull/92355), [@wawa0210](https://github.com/wawa0210)) [SIG Node and Windows]
- Improve error messages related to nodePort endpoint changes conntrack entries cleanup. ([#96251](https://github.com/kubernetes/kubernetes/pull/96251), [@ravens](https://github.com/ravens)) [SIG Network]
- In dual-stack clusters, kubelet will now set up both IPv4 and IPv6 iptables rules, which may
  fix some problems, eg with HostPorts. ([#94474](https://github.com/kubernetes/kubernetes/pull/94474), [@danwinship](https://github.com/danwinship)) [SIG Network and Node]
- Increase maximum IOPS of AWS EBS io1 volume to current maximum (64,000). ([#90014](https://github.com/kubernetes/kubernetes/pull/90014), [@jacobmarble](https://github.com/jacobmarble))
- Ipvs: ensure selected scheduler kernel modules are loaded ([#93040](https://github.com/kubernetes/kubernetes/pull/93040), [@cmluciano](https://github.com/cmluciano)) [SIG Network]
- K8s.io/apimachinery: runtime.DefaultUnstructuredConverter.FromUnstructured now handles converting integer fields to typed float values ([#93250](https://github.com/kubernetes/kubernetes/pull/93250), [@liggitt](https://github.com/liggitt)) [SIG API Machinery]
- Kube-proxy now trims extra spaces found in loadBalancerSourceRanges to match Service validation. ([#94107](https://github.com/kubernetes/kubernetes/pull/94107), [@robscott](https://github.com/robscott)) [SIG Network]
- Kubeadm ensures "kubeadm reset" does not unmount the root "/var/lib/kubelet" directory if it is mounted by the user. ([#93702](https://github.com/kubernetes/kubernetes/pull/93702), [@thtanaka](https://github.com/thtanaka))
- Kubeadm now makes sure the etcd manifest is regenerated upon upgrade even when no etcd version change takes place ([#94395](https://github.com/kubernetes/kubernetes/pull/94395), [@rosti](https://github.com/rosti)) [SIG Cluster Lifecycle]
- Kubeadm now warns (instead of error out) on missing "ca.key" files for root CA, front-proxy CA and etcd CA, during "kubeadm join --control-plane" if the user has provided all certificates, keys and kubeconfig files which require signing with the given CA keys. ([#94988](https://github.com/kubernetes/kubernetes/pull/94988), [@neolit123](https://github.com/neolit123))
- Kubeadm: add missing "--experimental-patches" flag to "kubeadm init phase control-plane" ([#95786](https://github.com/kubernetes/kubernetes/pull/95786), [@Sh4d1](https://github.com/Sh4d1)) [SIG Cluster Lifecycle]
- Kubeadm: avoid a panic when determining if the running version of CoreDNS is supported during upgrades ([#94299](https://github.com/kubernetes/kubernetes/pull/94299), [@zouyee](https://github.com/zouyee)) [SIG Cluster Lifecycle]
- Kubeadm: ensure the etcd data directory is created with 0700 permissions during control-plane init and join ([#94102](https://github.com/kubernetes/kubernetes/pull/94102), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Kubeadm: fix coredns migration should be triggered when there are newdefault configs during kubeadm upgrade ([#96907](https://github.com/kubernetes/kubernetes/pull/96907), [@pacoxu](https://github.com/pacoxu)) [SIG Cluster Lifecycle]
- Kubeadm: fix the bug that kubeadm tries to call 'docker info' even if the CRI socket was for another CR ([#94555](https://github.com/kubernetes/kubernetes/pull/94555), [@SataQiu](https://github.com/SataQiu)) [SIG Cluster Lifecycle]
- Kubeadm: for Docker as the container runtime, make the "kubeadm reset" command stop containers before removing them ([#94586](https://github.com/kubernetes/kubernetes/pull/94586), [@BedivereZero](https://github.com/BedivereZero)) [SIG Cluster Lifecycle]
- Kubeadm: make the kubeconfig files for the kube-controller-manager and kube-scheduler use the LocalAPIEndpoint instead of the ControlPlaneEndpoint. This makes kubeadm clusters more reseliant to version skew problems during immutable upgrades: https://kubernetes.io/docs/setup/release/version-skew-policy/#kube-controller-manager-kube-scheduler-and-cloud-controller-manager ([#94398](https://github.com/kubernetes/kubernetes/pull/94398), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Kubeadm: relax the validation of kubeconfig server URLs. Allow the user to define custom kubeconfig server URLs without erroring out during validation of existing kubeconfig files (e.g. when using external CA mode). ([#94816](https://github.com/kubernetes/kubernetes/pull/94816), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Kubectl: print error if users place flags before plugin name ([#92343](https://github.com/kubernetes/kubernetes/pull/92343), [@knight42](https://github.com/knight42)) [SIG CLI]
- Kubelet: assume that swap is disabled when `/proc/swaps` does not exist ([#93931](https://github.com/kubernetes/kubernetes/pull/93931), [@SataQiu](https://github.com/SataQiu)) [SIG Node]
- New Azure instance types do now have correct max data disk count information. ([#94340](https://github.com/kubernetes/kubernetes/pull/94340), [@ialidzhikov](https://github.com/ialidzhikov)) [SIG Cloud Provider and Storage]
- Port mapping now allows the same `containerPort` of different containers to different `hostPort` without naming the mapping explicitly. ([#94494](https://github.com/kubernetes/kubernetes/pull/94494), [@SergeyKanzhelev](https://github.com/SergeyKanzhelev))
- Print go stack traces at -v=4 and not -v=2 ([#94663](https://github.com/kubernetes/kubernetes/pull/94663), [@soltysh](https://github.com/soltysh)) [SIG CLI]
- Recreate EndpointSlices on rapid Service creation. ([#94730](https://github.com/kubernetes/kubernetes/pull/94730), [@robscott](https://github.com/robscott))
- Reduce volume name length for vsphere volumes ([#96533](https://github.com/kubernetes/kubernetes/pull/96533), [@gnufied](https://github.com/gnufied)) [SIG Storage]
- Remove ready file and its directory (which is created during volume SetUp) during emptyDir volume TearDown. ([#95770](https://github.com/kubernetes/kubernetes/pull/95770), [@jingxu97](https://github.com/jingxu97)) [SIG Storage]
- Reorganized iptables rules to fix a performance issue ([#95252](https://github.com/kubernetes/kubernetes/pull/95252), [@tssurya](https://github.com/tssurya)) [SIG Network]
- Require feature flag CustomCPUCFSQuotaPeriod if setting a non-default cpuCFSQuotaPeriod in kubelet config. ([#94687](https://github.com/kubernetes/kubernetes/pull/94687), [@karan](https://github.com/karan)) [SIG Node]
- Resolves a regression in 1.19+ with workloads targeting deprecated beta os/arch labels getting stuck in NodeAffinity status on node startup. ([#96810](https://github.com/kubernetes/kubernetes/pull/96810), [@liggitt](https://github.com/liggitt)) [SIG Node]
- Resolves non-deterministic behavior of the garbage collection controller when ownerReferences with incorrect data are encountered. Events with a reason of `OwnerRefInvalidNamespace` are recorded when namespace mismatches between child and owner objects are detected. The [kubectl-check-ownerreferences](https://github.com/kubernetes-sigs/kubectl-check-ownerreferences) tool can be run prior to upgrading to locate existing objects with invalid ownerReferences.
  - A namespaced object with an ownerReference referencing a uid of a namespaced kind which does not exist in the same namespace is now consistently treated as though that owner does not exist, and the child object is deleted.
  - A cluster-scoped object with an ownerReference referencing a uid of a namespaced kind is now consistently treated as though that owner is not resolvable, and the child object is ignored by the garbage collector. ([#92743](https://github.com/kubernetes/kubernetes/pull/92743), [@liggitt](https://github.com/liggitt)) [SIG API Machinery, Apps and Testing]
- Skip [k8s.io/kubernetes@v1.19.0/test/e2e/storage/testsuites/base.go:162]: Driver azure-disk doesn't support snapshot type DynamicSnapshot -- skipping
  skip [k8s.io/kubernetes@v1.19.0/test/e2e/storage/testsuites/base.go:185]: Driver azure-disk doesn't support ntfs -- skipping ([#96144](https://github.com/kubernetes/kubernetes/pull/96144), [@qinpingli](https://github.com/qinpingli)) [SIG Storage and Testing]
- StatefulSet Controller now waits for PersistentVolumeClaim deletion before creating pods. ([#93457](https://github.com/kubernetes/kubernetes/pull/93457), [@ymmt2005](https://github.com/ymmt2005))
- StreamWatcher now calls HandleCrash at appropriate sequence. ([#93108](https://github.com/kubernetes/kubernetes/pull/93108), [@lixiaobing1](https://github.com/lixiaobing1))
- Support the node label `node.kubernetes.io/exclude-from-external-load-balancers` ([#95542](https://github.com/kubernetes/kubernetes/pull/95542), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]
- The AWS network load balancer attributes can now be specified during service creation ([#95247](https://github.com/kubernetes/kubernetes/pull/95247), [@kishorj](https://github.com/kishorj)) [SIG Cloud Provider]
- The `/debug/api_priority_and_fairness/dump_requests` path at an apiserver will no longer return a phantom line for each exempt priority level. ([#93406](https://github.com/kubernetes/kubernetes/pull/93406), [@MikeSpreitzer](https://github.com/MikeSpreitzer)) [SIG API Machinery]
- The kube-apiserver will no longer serve APIs that should have been deleted in GA non-alpha levels.  Alpha levels will continue to serve the removed APIs so that CI doesn't immediately break. ([#96525](https://github.com/kubernetes/kubernetes/pull/96525), [@deads2k](https://github.com/deads2k)) [SIG API Machinery]
- The kubelet recognizes the --containerd-namespace flag to configure the namespace used by cadvisor. ([#87054](https://github.com/kubernetes/kubernetes/pull/87054), [@changyaowei](https://github.com/changyaowei)) [SIG Node]
- Unhealthy pods covered by PDBs can be successfully evicted if enough healthy pods are available. ([#94381](https://github.com/kubernetes/kubernetes/pull/94381), [@michaelgugino](https://github.com/michaelgugino)) [SIG Apps]
- Update Calico to v3.15.2 ([#94241](https://github.com/kubernetes/kubernetes/pull/94241), [@lmm](https://github.com/lmm)) [SIG Cloud Provider]
- Update default etcd server version to 3.4.13 ([#94287](https://github.com/kubernetes/kubernetes/pull/94287), [@jingyih](https://github.com/jingyih)) [SIG API Machinery, Cloud Provider, Cluster Lifecycle and Testing]
- Update max azure data disk count map ([#96308](https://github.com/kubernetes/kubernetes/pull/96308), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider and Storage]
- Update the PIP when it is not in the Succeeded provisioning state during the LB update. ([#95748](https://github.com/kubernetes/kubernetes/pull/95748), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]
- Update the frontend IP config when the service's `pipName` annotation is changed ([#95813](https://github.com/kubernetes/kubernetes/pull/95813), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]
- Update the route table tag in the route reconcile loop ([#96545](https://github.com/kubernetes/kubernetes/pull/96545), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]
- Use NLB Subnet CIDRs instead of VPC CIDRs in Health Check SG Rules ([#93515](https://github.com/kubernetes/kubernetes/pull/93515), [@t0rr3sp3dr0](https://github.com/t0rr3sp3dr0)) [SIG Cloud Provider]
- Users will see increase in time for deletion of pods and also guarantee that removal of pod from api server  would mean deletion of all the resources from container runtime. ([#92817](https://github.com/kubernetes/kubernetes/pull/92817), [@kmala](https://github.com/kmala)) [SIG Node]
- Very large patches may now be specified to `kubectl patch` with the `--patch-file` flag instead of including them directly on the command line. The `--patch` and `--patch-file` flags are mutually exclusive. ([#93548](https://github.com/kubernetes/kubernetes/pull/93548), [@smarterclayton](https://github.com/smarterclayton)) [SIG CLI]
- Volume binding: report UnschedulableAndUnresolvable status instead of an error when bound PVs not found ([#95541](https://github.com/kubernetes/kubernetes/pull/95541), [@cofyc](https://github.com/cofyc)) [SIG Apps, Scheduling and Storage]
- Warn instead of fail when creating Roles and ClusterRoles with custom verbs via kubectl ([#92492](https://github.com/kubernetes/kubernetes/pull/92492), [@eddiezane](https://github.com/eddiezane)) [SIG CLI]
- When creating a PVC with the volume.beta.kubernetes.io/storage-provisioner annotation already set, the PV controller might have incorrectly deleted the newly provisioned PV instead of binding it to the PVC, depending on timing and system load. ([#95909](https://github.com/kubernetes/kubernetes/pull/95909), [@pohly](https://github.com/pohly)) [SIG Apps and Storage]
- [kubectl] Fail when local source file doesn't exist ([#90333](https://github.com/kubernetes/kubernetes/pull/90333), [@bamarni](https://github.com/bamarni)) [SIG CLI]

### Other (Cleanup or Flake)

- **Additional documentation e.g., KEPs (Kubernetes Enhancement Proposals), usage docs, etc.**:
  
  <!--
  This section can be blank if this pull request does not require a release note.
  
  When adding links which point to resources within git repositories, like
  KEPs or supporting documentation, please reference a specific commit and avoid
  linking directly to the master branch. This ensures that links reference a
  specific point in time, rather than a document that may change over time.
  
  See here for guidance on getting permanent links to files: https://help.github.com/en/articles/getting-permanent-links-to-files
  
  Please use the following format for linking documentation:
  - [KEP]: <link>
  - [Usage]: <link>
  - [Other doc]: <link>
  --> ([#96443](https://github.com/kubernetes/kubernetes/pull/96443), [@alaypatel07](https://github.com/alaypatel07)) [SIG Apps]
- --redirect-container-streaming is no longer functional. The flag will be removed in v1.22 ([#95935](https://github.com/kubernetes/kubernetes/pull/95935), [@tallclair](https://github.com/tallclair)) [SIG Node]
- A new metric `requestAbortsTotal` has been introduced that counts aborted requests for each `group`, `version`, `verb`, `resource`, `subresource` and `scope`. ([#95002](https://github.com/kubernetes/kubernetes/pull/95002), [@p0lyn0mial](https://github.com/p0lyn0mial)) [SIG API Machinery, Cloud Provider, Instrumentation and Scheduling]
- API priority and fairness metrics use snake_case in label names ([#96236](https://github.com/kubernetes/kubernetes/pull/96236), [@adtac](https://github.com/adtac)) [SIG API Machinery, Cluster Lifecycle, Instrumentation and Testing]
- Add fine grained debugging to intra-pod conformance test to troubleshoot networking issues for potentially unhealthy nodes when running conformance or sonobuoy tests. ([#93837](https://github.com/kubernetes/kubernetes/pull/93837), [@jayunit100](https://github.com/jayunit100))
- Add the following metrics:
  - network_plugin_operations_total
  - network_plugin_operations_errors_total ([#93066](https://github.com/kubernetes/kubernetes/pull/93066), [@AnishShah](https://github.com/AnishShah))
- Adds a bootstrapping ClusterRole, ClusterRoleBinding and group for /metrics, /livez/*, /readyz/*, & /healthz/- endpoints. ([#93311](https://github.com/kubernetes/kubernetes/pull/93311), [@logicalhan](https://github.com/logicalhan)) [SIG API Machinery, Auth, Cloud Provider and Instrumentation]
- AdmissionReview objects sent for the creation of Namespace API objects now populate the `namespace` attribute consistently (previously the `namespace` attribute was empty for Namespace creation via POST requests, and populated for Namespace creation via server-side-apply PATCH requests) ([#95012](https://github.com/kubernetes/kubernetes/pull/95012), [@nodo](https://github.com/nodo)) [SIG API Machinery and Testing]
- Applies translations on all command descriptions ([#95439](https://github.com/kubernetes/kubernetes/pull/95439), [@HerrNaN](https://github.com/HerrNaN)) [SIG CLI]
- Base-images: Update to debian-iptables:buster-v1.3.0
  - Uses iptables 1.8.5
  - base-images: Update to debian-base:buster-v1.2.0
  - cluster/images/etcd: Build etcd:3.4.13-1 image
    - Uses debian-base:buster-v1.2.0 ([#94733](https://github.com/kubernetes/kubernetes/pull/94733), [@justaugustus](https://github.com/justaugustus)) [SIG API Machinery, Release and Testing]
- Changed: default "Accept-Encoding" header removed from HTTP probes. See https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#http-probes ([#96127](https://github.com/kubernetes/kubernetes/pull/96127), [@fonsecas72](https://github.com/fonsecas72)) [SIG Network and Node]
- Client-go header logging (at verbosity levels >= 9) now masks `Authorization` header contents ([#95316](https://github.com/kubernetes/kubernetes/pull/95316), [@sfowl](https://github.com/sfowl)) [SIG API Machinery]
- Decrease warning message frequency on setting volume ownership for configmap/secret. ([#92878](https://github.com/kubernetes/kubernetes/pull/92878), [@jvanz](https://github.com/jvanz))
- Enhance log information of verifyRunAsNonRoot, add pod, container information ([#94911](https://github.com/kubernetes/kubernetes/pull/94911), [@wawa0210](https://github.com/wawa0210)) [SIG Node]
- Fix func name NewCreateCreateDeploymentOptions ([#91931](https://github.com/kubernetes/kubernetes/pull/91931), [@lixiaobing1](https://github.com/lixiaobing1)) [SIG CLI]
- Fix kubelet to properly log when a container is started. Previously, kubelet may log that container is dead and was restarted when it was actually started for the first time. This behavior only happened on pods with initContainers and regular containers. ([#91469](https://github.com/kubernetes/kubernetes/pull/91469), [@rata](https://github.com/rata))
- Fixes the message about no auth for metrics in scheduler. ([#94035](https://github.com/kubernetes/kubernetes/pull/94035), [@zhouya0](https://github.com/zhouya0)) [SIG Scheduling]
- Generators for services are removed from kubectl ([#95256](https://github.com/kubernetes/kubernetes/pull/95256), [@Git-Jiro](https://github.com/Git-Jiro)) [SIG CLI]
- Introduce kubectl-convert plugin. ([#96190](https://github.com/kubernetes/kubernetes/pull/96190), [@soltysh](https://github.com/soltysh)) [SIG CLI and Testing]
- Kube-scheduler now logs processed component config at startup ([#96426](https://github.com/kubernetes/kubernetes/pull/96426), [@damemi](https://github.com/damemi)) [SIG Scheduling]
- Kubeadm: Separate argument key/value in log msg ([#94016](https://github.com/kubernetes/kubernetes/pull/94016), [@mrueg](https://github.com/mrueg)) [SIG Cluster Lifecycle]
- Kubeadm: remove the CoreDNS check for known image digests when applying the addon ([#94506](https://github.com/kubernetes/kubernetes/pull/94506), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Kubeadm: update the default pause image version to 1.4.0 on Windows. With this update the image supports Windows versions 1809 (2019LTS), 1903, 1909, 2004 ([#95419](https://github.com/kubernetes/kubernetes/pull/95419), [@jsturtevant](https://github.com/jsturtevant)) [SIG Cluster Lifecycle and Windows]
- Kubectl: the `generator` flag of `kubectl autoscale` has been deprecated and has no effect, it will be removed in a feature release ([#92998](https://github.com/kubernetes/kubernetes/pull/92998), [@SataQiu](https://github.com/SataQiu)) [SIG CLI]
- Lock ExternalPolicyForExternalIP to default, this feature gate will be removed in 1.22. ([#94581](https://github.com/kubernetes/kubernetes/pull/94581), [@knabben](https://github.com/knabben)) [SIG Network]
- Mask ceph RBD adminSecrets in logs when logLevel >= 4. ([#95245](https://github.com/kubernetes/kubernetes/pull/95245), [@sfowl](https://github.com/sfowl))
- Remove offensive words from kubectl cluster-info command. ([#95202](https://github.com/kubernetes/kubernetes/pull/95202), [@rikatz](https://github.com/rikatz))
- Remove support for "ci/k8s-master" version label in kubeadm, use "ci/latest" instead. See [kubernetes/test-infra#18517](https://github.com/kubernetes/test-infra/pull/18517). ([#93626](https://github.com/kubernetes/kubernetes/pull/93626), [@vikkyomkar](https://github.com/vikkyomkar))
- Remove the dependency of csi-translation-lib module on apiserver/cloud-provider/controller-manager ([#95543](https://github.com/kubernetes/kubernetes/pull/95543), [@wawa0210](https://github.com/wawa0210)) [SIG Release]
- Scheduler framework interface moved from pkg/scheduler/framework/v1alpha to pkg/scheduler/framework ([#95069](https://github.com/kubernetes/kubernetes/pull/95069), [@farah](https://github.com/farah)) [SIG Scheduling, Storage and Testing]
- Service.beta.kubernetes.io/azure-load-balancer-disable-tcp-reset is removed.  All Standard load balancers will always enable tcp resets. ([#94297](https://github.com/kubernetes/kubernetes/pull/94297), [@MarcPow](https://github.com/MarcPow)) [SIG Cloud Provider]
- Stop propagating SelfLink (deprecated in 1.16) in kube-apiserver ([#94397](https://github.com/kubernetes/kubernetes/pull/94397), [@wojtek-t](https://github.com/wojtek-t)) [SIG API Machinery and Testing]
- Strip unnecessary security contexts on Windows ([#93475](https://github.com/kubernetes/kubernetes/pull/93475), [@ravisantoshgudimetla](https://github.com/ravisantoshgudimetla)) [SIG Node, Testing and Windows]
- To ensure the code be strong,  add unit test for GetAddressAndDialer ([#93180](https://github.com/kubernetes/kubernetes/pull/93180), [@FreeZhang61](https://github.com/FreeZhang61)) [SIG Node]
- UDP and SCTP protocols can left stale connections that need to be cleared to avoid services disruption, but they can cause problems that are hard to debug.
  Kubernetes components using a loglevel greater or equal than 4 will log the conntrack operations and its output, to show the entries that were deleted. ([#95694](https://github.com/kubernetes/kubernetes/pull/95694), [@aojea](https://github.com/aojea)) [SIG Network]
- Update CNI plugins to v0.8.7 ([#94367](https://github.com/kubernetes/kubernetes/pull/94367), [@justaugustus](https://github.com/justaugustus)) [SIG Cloud Provider, Network, Node, Release and Testing]
- Update cri-tools to [v1.19.0](https://github.com/kubernetes-sigs/cri-tools/releases/tag/v1.19.0) ([#94307](https://github.com/kubernetes/kubernetes/pull/94307), [@xmudrii](https://github.com/xmudrii)) [SIG Cloud Provider]
- Update etcd client side to v3.4.13 ([#94259](https://github.com/kubernetes/kubernetes/pull/94259), [@jingyih](https://github.com/jingyih)) [SIG API Machinery and Cloud Provider]
- Users will now be able to configure all supported values for AWS NLB health check interval and thresholds for new resources. ([#96312](https://github.com/kubernetes/kubernetes/pull/96312), [@kishorj](https://github.com/kishorj)) [SIG Cloud Provider]
- V1helpers.MatchNodeSelectorTerms now accepts just a Node and a list of Terms ([#95871](https://github.com/kubernetes/kubernetes/pull/95871), [@damemi](https://github.com/damemi)) [SIG Apps, Scheduling and Storage]
- Vsphere: improve logging message on node cache refresh event ([#95236](https://github.com/kubernetes/kubernetes/pull/95236), [@andrewsykim](https://github.com/andrewsykim)) [SIG Cloud Provider]
- `MatchNodeSelectorTerms` function moved to `k8s.io/component-helpers` ([#95531](https://github.com/kubernetes/kubernetes/pull/95531), [@damemi](https://github.com/damemi)) [SIG Apps, Scheduling and Storage]
- `kubectl api-resources` now prints the API version (as 'API group/version', same as output of `kubectl api-versions`). The column APIGROUP is now APIVERSION ([#95253](https://github.com/kubernetes/kubernetes/pull/95253), [@sallyom](https://github.com/sallyom)) [SIG CLI]
- `kubectl get ingress` now prefers the `networking.k8s.io/v1` over `extensions/v1beta1` (deprecated since v1.14). To explicitly request the deprecated version, use `kubectl get ingress.v1beta1.extensions`. ([#94309](https://github.com/kubernetes/kubernetes/pull/94309), [@liggitt](https://github.com/liggitt)) [SIG API Machinery and CLI]

## Dependencies

### Added
- cloud.google.com/go/firestore: v1.1.0
- github.com/Azure/go-autorest: [v14.2.0+incompatible](https://github.com/Azure/go-autorest/tree/v14.2.0)
- github.com/armon/go-metrics: [f0300d1](https://github.com/armon/go-metrics/tree/f0300d1)
- github.com/armon/go-radix: [7fddfc3](https://github.com/armon/go-radix/tree/7fddfc3)
- github.com/bketelsen/crypt: [5cbc8cc](https://github.com/bketelsen/crypt/tree/5cbc8cc)
- github.com/form3tech-oss/jwt-go: [v3.2.2+incompatible](https://github.com/form3tech-oss/jwt-go/tree/v3.2.2)
- github.com/fvbommel/sortorder: [v1.0.1](https://github.com/fvbommel/sortorder/tree/v1.0.1)
- github.com/hashicorp/consul/api: [v1.1.0](https://github.com/hashicorp/consul/api/tree/v1.1.0)
- github.com/hashicorp/consul/sdk: [v0.1.1](https://github.com/hashicorp/consul/sdk/tree/v0.1.1)
- github.com/hashicorp/errwrap: [v1.0.0](https://github.com/hashicorp/errwrap/tree/v1.0.0)
- github.com/hashicorp/go-cleanhttp: [v0.5.1](https://github.com/hashicorp/go-cleanhttp/tree/v0.5.1)
- github.com/hashicorp/go-immutable-radix: [v1.0.0](https://github.com/hashicorp/go-immutable-radix/tree/v1.0.0)
- github.com/hashicorp/go-msgpack: [v0.5.3](https://github.com/hashicorp/go-msgpack/tree/v0.5.3)
- github.com/hashicorp/go-multierror: [v1.0.0](https://github.com/hashicorp/go-multierror/tree/v1.0.0)
- github.com/hashicorp/go-rootcerts: [v1.0.0](https://github.com/hashicorp/go-rootcerts/tree/v1.0.0)
- github.com/hashicorp/go-sockaddr: [v1.0.0](https://github.com/hashicorp/go-sockaddr/tree/v1.0.0)
- github.com/hashicorp/go-uuid: [v1.0.1](https://github.com/hashicorp/go-uuid/tree/v1.0.1)
- github.com/hashicorp/go.net: [v0.0.1](https://github.com/hashicorp/go.net/tree/v0.0.1)
- github.com/hashicorp/logutils: [v1.0.0](https://github.com/hashicorp/logutils/tree/v1.0.0)
- github.com/hashicorp/mdns: [v1.0.0](https://github.com/hashicorp/mdns/tree/v1.0.0)
- github.com/hashicorp/memberlist: [v0.1.3](https://github.com/hashicorp/memberlist/tree/v0.1.3)
- github.com/hashicorp/serf: [v0.8.2](https://github.com/hashicorp/serf/tree/v0.8.2)
- github.com/jmespath/go-jmespath/internal/testify: [v1.5.1](https://github.com/jmespath/go-jmespath/internal/testify/tree/v1.5.1)
- github.com/mitchellh/cli: [v1.0.0](https://github.com/mitchellh/cli/tree/v1.0.0)
- github.com/mitchellh/go-testing-interface: [v1.0.0](https://github.com/mitchellh/go-testing-interface/tree/v1.0.0)
- github.com/mitchellh/gox: [v0.4.0](https://github.com/mitchellh/gox/tree/v0.4.0)
- github.com/mitchellh/iochan: [v1.0.0](https://github.com/mitchellh/iochan/tree/v1.0.0)
- github.com/pascaldekloe/goe: [57f6aae](https://github.com/pascaldekloe/goe/tree/57f6aae)
- github.com/posener/complete: [v1.1.1](https://github.com/posener/complete/tree/v1.1.1)
- github.com/ryanuber/columnize: [9b3edd6](https://github.com/ryanuber/columnize/tree/9b3edd6)
- github.com/sean-/seed: [e2103e2](https://github.com/sean-/seed/tree/e2103e2)
- github.com/subosito/gotenv: [v1.2.0](https://github.com/subosito/gotenv/tree/v1.2.0)
- github.com/willf/bitset: [d5bec33](https://github.com/willf/bitset/tree/d5bec33)
- gopkg.in/ini.v1: v1.51.0
- gopkg.in/yaml.v3: 9f266ea
- rsc.io/quote/v3: v3.1.0
- rsc.io/sampler: v1.3.0

### Changed
- cloud.google.com/go/bigquery: v1.0.1 → v1.4.0
- cloud.google.com/go/datastore: v1.0.0 → v1.1.0
- cloud.google.com/go/pubsub: v1.0.1 → v1.2.0
- cloud.google.com/go/storage: v1.0.0 → v1.6.0
- cloud.google.com/go: v0.51.0 → v0.54.0
- github.com/Azure/go-autorest/autorest/adal: [v0.8.2 → v0.9.5](https://github.com/Azure/go-autorest/autorest/adal/compare/v0.8.2...v0.9.5)
- github.com/Azure/go-autorest/autorest/date: [v0.2.0 → v0.3.0](https://github.com/Azure/go-autorest/autorest/date/compare/v0.2.0...v0.3.0)
- github.com/Azure/go-autorest/autorest/mocks: [v0.3.0 → v0.4.1](https://github.com/Azure/go-autorest/autorest/mocks/compare/v0.3.0...v0.4.1)
- github.com/Azure/go-autorest/autorest: [v0.9.6 → v0.11.1](https://github.com/Azure/go-autorest/autorest/compare/v0.9.6...v0.11.1)
- github.com/Azure/go-autorest/logger: [v0.1.0 → v0.2.0](https://github.com/Azure/go-autorest/logger/compare/v0.1.0...v0.2.0)
- github.com/Azure/go-autorest/tracing: [v0.5.0 → v0.6.0](https://github.com/Azure/go-autorest/tracing/compare/v0.5.0...v0.6.0)
- github.com/Microsoft/go-winio: [fc70bd9 → v0.4.15](https://github.com/Microsoft/go-winio/compare/fc70bd9...v0.4.15)
- github.com/aws/aws-sdk-go: [v1.28.2 → v1.35.24](https://github.com/aws/aws-sdk-go/compare/v1.28.2...v1.35.24)
- github.com/blang/semver: [v3.5.0+incompatible → v3.5.1+incompatible](https://github.com/blang/semver/compare/v3.5.0...v3.5.1)
- github.com/checkpoint-restore/go-criu/v4: [v4.0.2 → v4.1.0](https://github.com/checkpoint-restore/go-criu/v4/compare/v4.0.2...v4.1.0)
- github.com/containerd/containerd: [v1.3.3 → v1.4.1](https://github.com/containerd/containerd/compare/v1.3.3...v1.4.1)
- github.com/containerd/ttrpc: [v1.0.0 → v1.0.2](https://github.com/containerd/ttrpc/compare/v1.0.0...v1.0.2)
- github.com/containerd/typeurl: [v1.0.0 → v1.0.1](https://github.com/containerd/typeurl/compare/v1.0.0...v1.0.1)
- github.com/coreos/etcd: [v3.3.10+incompatible → v3.3.13+incompatible](https://github.com/coreos/etcd/compare/v3.3.10...v3.3.13)
- github.com/docker/docker: [aa6a989 → bd33bbf](https://github.com/docker/docker/compare/aa6a989...bd33bbf)
- github.com/go-gl/glfw/v3.3/glfw: [12ad95a → 6f7a984](https://github.com/go-gl/glfw/v3.3/glfw/compare/12ad95a...6f7a984)
- github.com/golang/groupcache: [215e871 → 8c9f03a](https://github.com/golang/groupcache/compare/215e871...8c9f03a)
- github.com/golang/mock: [v1.3.1 → v1.4.1](https://github.com/golang/mock/compare/v1.3.1...v1.4.1)
- github.com/golang/protobuf: [v1.4.2 → v1.4.3](https://github.com/golang/protobuf/compare/v1.4.2...v1.4.3)
- github.com/google/cadvisor: [v0.37.0 → v0.38.5](https://github.com/google/cadvisor/compare/v0.37.0...v0.38.5)
- github.com/google/go-cmp: [v0.4.0 → v0.5.2](https://github.com/google/go-cmp/compare/v0.4.0...v0.5.2)
- github.com/google/pprof: [d4f498a → 1ebb73c](https://github.com/google/pprof/compare/d4f498a...1ebb73c)
- github.com/google/uuid: [v1.1.1 → v1.1.2](https://github.com/google/uuid/compare/v1.1.1...v1.1.2)
- github.com/gorilla/mux: [v1.7.3 → v1.8.0](https://github.com/gorilla/mux/compare/v1.7.3...v1.8.0)
- github.com/gorilla/websocket: [v1.4.0 → v1.4.2](https://github.com/gorilla/websocket/compare/v1.4.0...v1.4.2)
- github.com/jmespath/go-jmespath: [c2b33e8 → v0.4.0](https://github.com/jmespath/go-jmespath/compare/c2b33e8...v0.4.0)
- github.com/karrick/godirwalk: [v1.7.5 → v1.16.1](https://github.com/karrick/godirwalk/compare/v1.7.5...v1.16.1)
- github.com/opencontainers/go-digest: [v1.0.0-rc1 → v1.0.0](https://github.com/opencontainers/go-digest/compare/v1.0.0-rc1...v1.0.0)
- github.com/opencontainers/runc: [819fcc6 → v1.0.0-rc92](https://github.com/opencontainers/runc/compare/819fcc6...v1.0.0-rc92)
- github.com/opencontainers/runtime-spec: [237cc4f → 4d89ac9](https://github.com/opencontainers/runtime-spec/compare/237cc4f...4d89ac9)
- github.com/opencontainers/selinux: [v1.5.2 → v1.6.0](https://github.com/opencontainers/selinux/compare/v1.5.2...v1.6.0)
- github.com/prometheus/procfs: [v0.1.3 → v0.2.0](https://github.com/prometheus/procfs/compare/v0.1.3...v0.2.0)
- github.com/quobyte/api: [v0.1.2 → v0.1.8](https://github.com/quobyte/api/compare/v0.1.2...v0.1.8)
- github.com/spf13/cobra: [v1.0.0 → v1.1.1](https://github.com/spf13/cobra/compare/v1.0.0...v1.1.1)
- github.com/spf13/viper: [v1.4.0 → v1.7.0](https://github.com/spf13/viper/compare/v1.4.0...v1.7.0)
- github.com/storageos/go-api: [343b3ef → v2.2.0+incompatible](https://github.com/storageos/go-api/compare/343b3ef...v2.2.0)
- github.com/stretchr/testify: [v1.4.0 → v1.6.1](https://github.com/stretchr/testify/compare/v1.4.0...v1.6.1)
- github.com/vishvananda/netns: [52d707b → db3c7e5](https://github.com/vishvananda/netns/compare/52d707b...db3c7e5)
- go.etcd.io/etcd: 17cef6e → dd1b699
- go.opencensus.io: v0.22.2 → v0.22.3
- golang.org/x/crypto: 75b2880 → 7f63de1
- golang.org/x/exp: da58074 → 6cc2880
- golang.org/x/lint: fdd1cda → 738671d
- golang.org/x/net: ab34263 → 69a7880
- golang.org/x/oauth2: 858c2ad → bf48bf1
- golang.org/x/sys: ed371f2 → 5cba982
- golang.org/x/text: v0.3.3 → v0.3.4
- golang.org/x/time: 555d28b → 3af7569
- golang.org/x/xerrors: 9bdfabe → 5ec99f8
- google.golang.org/api: v0.15.1 → v0.20.0
- google.golang.org/genproto: cb27e3a → 8816d57
- google.golang.org/grpc: v1.27.0 → v1.27.1
- google.golang.org/protobuf: v1.24.0 → v1.25.0
- honnef.co/go/tools: v0.0.1-2019.2.3 → v0.0.1-2020.1.3
- k8s.io/gengo: 8167cfd → 83324d8
- k8s.io/klog/v2: v2.2.0 → v2.4.0
- k8s.io/kube-openapi: 6aeccd4 → d219536
- k8s.io/system-validators: v1.1.2 → v1.2.0
- k8s.io/utils: d5654de → 67b214c
- sigs.k8s.io/apiserver-network-proxy/konnectivity-client: v0.0.9 → v0.0.14
- sigs.k8s.io/structured-merge-diff/v4: v4.0.1 → v4.0.2

### Removed
- github.com/armon/consul-api: [eb2c6b5](https://github.com/armon/consul-api/tree/eb2c6b5)
- github.com/go-ini/ini: [v1.9.0](https://github.com/go-ini/ini/tree/v1.9.0)
- github.com/ugorji/go: [v1.1.4](https://github.com/ugorji/go/tree/v1.1.4)
- github.com/xlab/handysort: [fb3537e](https://github.com/xlab/handysort/tree/fb3537e)
- github.com/xordataexchange/crypt: [b2862e3](https://github.com/xordataexchange/crypt/tree/b2862e3)
- vbom.ml/util: db5cfe1


## Dependencies

### Added
- cloud.google.com/go/firestore: v1.1.0
- github.com/Azure/go-autorest: [v14.2.0+incompatible](https://github.com/Azure/go-autorest/tree/v14.2.0)
- github.com/armon/go-metrics: [f0300d1](https://github.com/armon/go-metrics/tree/f0300d1)
- github.com/armon/go-radix: [7fddfc3](https://github.com/armon/go-radix/tree/7fddfc3)
- github.com/bketelsen/crypt: [5cbc8cc](https://github.com/bketelsen/crypt/tree/5cbc8cc)
- github.com/form3tech-oss/jwt-go: [v3.2.2+incompatible](https://github.com/form3tech-oss/jwt-go/tree/v3.2.2)
- github.com/fvbommel/sortorder: [v1.0.1](https://github.com/fvbommel/sortorder/tree/v1.0.1)
- github.com/hashicorp/consul/api: [v1.1.0](https://github.com/hashicorp/consul/api/tree/v1.1.0)
- github.com/hashicorp/consul/sdk: [v0.1.1](https://github.com/hashicorp/consul/sdk/tree/v0.1.1)
- github.com/hashicorp/errwrap: [v1.0.0](https://github.com/hashicorp/errwrap/tree/v1.0.0)
- github.com/hashicorp/go-cleanhttp: [v0.5.1](https://github.com/hashicorp/go-cleanhttp/tree/v0.5.1)
- github.com/hashicorp/go-immutable-radix: [v1.0.0](https://github.com/hashicorp/go-immutable-radix/tree/v1.0.0)
- github.com/hashicorp/go-msgpack: [v0.5.3](https://github.com/hashicorp/go-msgpack/tree/v0.5.3)
- github.com/hashicorp/go-multierror: [v1.0.0](https://github.com/hashicorp/go-multierror/tree/v1.0.0)
- github.com/hashicorp/go-rootcerts: [v1.0.0](https://github.com/hashicorp/go-rootcerts/tree/v1.0.0)
- github.com/hashicorp/go-sockaddr: [v1.0.0](https://github.com/hashicorp/go-sockaddr/tree/v1.0.0)
- github.com/hashicorp/go-uuid: [v1.0.1](https://github.com/hashicorp/go-uuid/tree/v1.0.1)
- github.com/hashicorp/go.net: [v0.0.1](https://github.com/hashicorp/go.net/tree/v0.0.1)
- github.com/hashicorp/logutils: [v1.0.0](https://github.com/hashicorp/logutils/tree/v1.0.0)
- github.com/hashicorp/mdns: [v1.0.0](https://github.com/hashicorp/mdns/tree/v1.0.0)
- github.com/hashicorp/memberlist: [v0.1.3](https://github.com/hashicorp/memberlist/tree/v0.1.3)
- github.com/hashicorp/serf: [v0.8.2](https://github.com/hashicorp/serf/tree/v0.8.2)
- github.com/jmespath/go-jmespath/internal/testify: [v1.5.1](https://github.com/jmespath/go-jmespath/internal/testify/tree/v1.5.1)
- github.com/mitchellh/cli: [v1.0.0](https://github.com/mitchellh/cli/tree/v1.0.0)
- github.com/mitchellh/go-testing-interface: [v1.0.0](https://github.com/mitchellh/go-testing-interface/tree/v1.0.0)
- github.com/mitchellh/gox: [v0.4.0](https://github.com/mitchellh/gox/tree/v0.4.0)
- github.com/mitchellh/iochan: [v1.0.0](https://github.com/mitchellh/iochan/tree/v1.0.0)
- github.com/pascaldekloe/goe: [57f6aae](https://github.com/pascaldekloe/goe/tree/57f6aae)
- github.com/posener/complete: [v1.1.1](https://github.com/posener/complete/tree/v1.1.1)
- github.com/ryanuber/columnize: [9b3edd6](https://github.com/ryanuber/columnize/tree/9b3edd6)
- github.com/sean-/seed: [e2103e2](https://github.com/sean-/seed/tree/e2103e2)
- github.com/subosito/gotenv: [v1.2.0](https://github.com/subosito/gotenv/tree/v1.2.0)
- github.com/willf/bitset: [d5bec33](https://github.com/willf/bitset/tree/d5bec33)
- gopkg.in/ini.v1: v1.51.0
- gopkg.in/yaml.v3: 9f266ea
- rsc.io/quote/v3: v3.1.0
- rsc.io/sampler: v1.3.0

### Changed
- cloud.google.com/go/bigquery: v1.0.1 → v1.4.0
- cloud.google.com/go/datastore: v1.0.0 → v1.1.0
- cloud.google.com/go/pubsub: v1.0.1 → v1.2.0
- cloud.google.com/go/storage: v1.0.0 → v1.6.0
- cloud.google.com/go: v0.51.0 → v0.54.0
- github.com/Azure/go-autorest/autorest/adal: [v0.8.2 → v0.9.5](https://github.com/Azure/go-autorest/autorest/adal/compare/v0.8.2...v0.9.5)
- github.com/Azure/go-autorest/autorest/date: [v0.2.0 → v0.3.0](https://github.com/Azure/go-autorest/autorest/date/compare/v0.2.0...v0.3.0)
- github.com/Azure/go-autorest/autorest/mocks: [v0.3.0 → v0.4.1](https://github.com/Azure/go-autorest/autorest/mocks/compare/v0.3.0...v0.4.1)
- github.com/Azure/go-autorest/autorest: [v0.9.6 → v0.11.1](https://github.com/Azure/go-autorest/autorest/compare/v0.9.6...v0.11.1)
- github.com/Azure/go-autorest/logger: [v0.1.0 → v0.2.0](https://github.com/Azure/go-autorest/logger/compare/v0.1.0...v0.2.0)
- github.com/Azure/go-autorest/tracing: [v0.5.0 → v0.6.0](https://github.com/Azure/go-autorest/tracing/compare/v0.5.0...v0.6.0)
- github.com/Microsoft/go-winio: [fc70bd9 → v0.4.15](https://github.com/Microsoft/go-winio/compare/fc70bd9...v0.4.15)
- github.com/aws/aws-sdk-go: [v1.28.2 → v1.35.24](https://github.com/aws/aws-sdk-go/compare/v1.28.2...v1.35.24)
- github.com/blang/semver: [v3.5.0+incompatible → v3.5.1+incompatible](https://github.com/blang/semver/compare/v3.5.0...v3.5.1)
- github.com/checkpoint-restore/go-criu/v4: [v4.0.2 → v4.1.0](https://github.com/checkpoint-restore/go-criu/v4/compare/v4.0.2...v4.1.0)
- github.com/containerd/containerd: [v1.3.3 → v1.4.1](https://github.com/containerd/containerd/compare/v1.3.3...v1.4.1)
- github.com/containerd/ttrpc: [v1.0.0 → v1.0.2](https://github.com/containerd/ttrpc/compare/v1.0.0...v1.0.2)
- github.com/containerd/typeurl: [v1.0.0 → v1.0.1](https://github.com/containerd/typeurl/compare/v1.0.0...v1.0.1)
- github.com/coreos/etcd: [v3.3.10+incompatible → v3.3.13+incompatible](https://github.com/coreos/etcd/compare/v3.3.10...v3.3.13)
- github.com/docker/docker: [aa6a989 → bd33bbf](https://github.com/docker/docker/compare/aa6a989...bd33bbf)
- github.com/go-gl/glfw/v3.3/glfw: [12ad95a → 6f7a984](https://github.com/go-gl/glfw/v3.3/glfw/compare/12ad95a...6f7a984)
- github.com/golang/groupcache: [215e871 → 8c9f03a](https://github.com/golang/groupcache/compare/215e871...8c9f03a)
- github.com/golang/mock: [v1.3.1 → v1.4.1](https://github.com/golang/mock/compare/v1.3.1...v1.4.1)
- github.com/golang/protobuf: [v1.4.2 → v1.4.3](https://github.com/golang/protobuf/compare/v1.4.2...v1.4.3)
- github.com/google/cadvisor: [v0.37.0 → v0.38.5](https://github.com/google/cadvisor/compare/v0.37.0...v0.38.5)
- github.com/google/go-cmp: [v0.4.0 → v0.5.2](https://github.com/google/go-cmp/compare/v0.4.0...v0.5.2)
- github.com/google/pprof: [d4f498a → 1ebb73c](https://github.com/google/pprof/compare/d4f498a...1ebb73c)
- github.com/google/uuid: [v1.1.1 → v1.1.2](https://github.com/google/uuid/compare/v1.1.1...v1.1.2)
- github.com/gorilla/mux: [v1.7.3 → v1.8.0](https://github.com/gorilla/mux/compare/v1.7.3...v1.8.0)
- github.com/gorilla/websocket: [v1.4.0 → v1.4.2](https://github.com/gorilla/websocket/compare/v1.4.0...v1.4.2)
- github.com/jmespath/go-jmespath: [c2b33e8 → v0.4.0](https://github.com/jmespath/go-jmespath/compare/c2b33e8...v0.4.0)
- github.com/karrick/godirwalk: [v1.7.5 → v1.16.1](https://github.com/karrick/godirwalk/compare/v1.7.5...v1.16.1)
- github.com/opencontainers/go-digest: [v1.0.0-rc1 → v1.0.0](https://github.com/opencontainers/go-digest/compare/v1.0.0-rc1...v1.0.0)
- github.com/opencontainers/runc: [819fcc6 → v1.0.0-rc92](https://github.com/opencontainers/runc/compare/819fcc6...v1.0.0-rc92)
- github.com/opencontainers/runtime-spec: [237cc4f → 4d89ac9](https://github.com/opencontainers/runtime-spec/compare/237cc4f...4d89ac9)
- github.com/opencontainers/selinux: [v1.5.2 → v1.6.0](https://github.com/opencontainers/selinux/compare/v1.5.2...v1.6.0)
- github.com/prometheus/procfs: [v0.1.3 → v0.2.0](https://github.com/prometheus/procfs/compare/v0.1.3...v0.2.0)
- github.com/quobyte/api: [v0.1.2 → v0.1.8](https://github.com/quobyte/api/compare/v0.1.2...v0.1.8)
- github.com/spf13/cobra: [v1.0.0 → v1.1.1](https://github.com/spf13/cobra/compare/v1.0.0...v1.1.1)
- github.com/spf13/viper: [v1.4.0 → v1.7.0](https://github.com/spf13/viper/compare/v1.4.0...v1.7.0)
- github.com/storageos/go-api: [343b3ef → v2.2.0+incompatible](https://github.com/storageos/go-api/compare/343b3ef...v2.2.0)
- github.com/stretchr/testify: [v1.4.0 → v1.6.1](https://github.com/stretchr/testify/compare/v1.4.0...v1.6.1)
- github.com/vishvananda/netns: [52d707b → db3c7e5](https://github.com/vishvananda/netns/compare/52d707b...db3c7e5)
- go.etcd.io/etcd: 17cef6e → dd1b699
- go.opencensus.io: v0.22.2 → v0.22.3
- golang.org/x/crypto: 75b2880 → 7f63de1
- golang.org/x/exp: da58074 → 6cc2880
- golang.org/x/lint: fdd1cda → 738671d
- golang.org/x/net: ab34263 → 69a7880
- golang.org/x/oauth2: 858c2ad → bf48bf1
- golang.org/x/sys: ed371f2 → 5cba982
- golang.org/x/text: v0.3.3 → v0.3.4
- golang.org/x/time: 555d28b → 3af7569
- golang.org/x/xerrors: 9bdfabe → 5ec99f8
- google.golang.org/api: v0.15.1 → v0.20.0
- google.golang.org/genproto: cb27e3a → 8816d57
- google.golang.org/grpc: v1.27.0 → v1.27.1
- google.golang.org/protobuf: v1.24.0 → v1.25.0
- honnef.co/go/tools: v0.0.1-2019.2.3 → v0.0.1-2020.1.3
- k8s.io/gengo: 8167cfd → 83324d8
- k8s.io/klog/v2: v2.2.0 → v2.4.0
- k8s.io/kube-openapi: 6aeccd4 → d219536
- k8s.io/system-validators: v1.1.2 → v1.2.0
- k8s.io/utils: d5654de → 67b214c
- sigs.k8s.io/apiserver-network-proxy/konnectivity-client: v0.0.9 → v0.0.14
- sigs.k8s.io/structured-merge-diff/v4: v4.0.1 → v4.0.2

### Removed
- github.com/armon/consul-api: [eb2c6b5](https://github.com/armon/consul-api/tree/eb2c6b5)
- github.com/go-ini/ini: [v1.9.0](https://github.com/go-ini/ini/tree/v1.9.0)
- github.com/ugorji/go: [v1.1.4](https://github.com/ugorji/go/tree/v1.1.4)
- github.com/xlab/handysort: [fb3537e](https://github.com/xlab/handysort/tree/fb3537e)
- github.com/xordataexchange/crypt: [b2862e3](https://github.com/xordataexchange/crypt/tree/b2862e3)
- vbom.ml/util: db5cfe1



# v1.20.0-rc.0


## Downloads for v1.20.0-rc.0

### Source Code

filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.20.0-rc.0/kubernetes.tar.gz) | acfee8658831f9503fccda0904798405434f17be7064a361a9f34c6ed04f1c0f685e79ca40cef5fcf34e3193bacbf467665e8dc277e0562ebdc929170034b5ae
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.20.0-rc.0/kubernetes-src.tar.gz) | 9d962f8845e1fa221649cf0c0e178f0f03808486c49ea15ab5ec67861ec5aa948cf18bc0ee9b2067643c8332227973dd592e6a4457456a9d9d80e8ef28d5f7c3

### Client binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.20.0-rc.0/kubernetes-client-darwin-amd64.tar.gz) | 062b57f1a450fe01d6184f104d81d376bdf5720010412821e315fd9b1b622a400ac91f996540daa66cee172006f3efade4eccc19265494f1a1d7cc9450f0b50a
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.20.0-rc.0/kubernetes-client-linux-386.tar.gz) | 86e96d2c2046c5e62e02bef30a6643f25e01f1b3eba256cab7dd61252908540c26cb058490e9cecc5a9bad97d2b577f5968884e9f1a90237e302419f39e068bc
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.20.0-rc.0/kubernetes-client-linux-amd64.tar.gz) | 619d3afb9ce902368390e71633396010e88e87c5fd848e3adc71571d1d4a25be002588415e5f83afee82460f8a7c9e0bd968335277cb8f8cb51e58d4bb43e64e
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.20.0-rc.0/kubernetes-client-linux-arm.tar.gz) | 60965150a60ab3d05a248339786e0c7da4b89a04539c3719737b13d71302bac1dd9bcaa427d8a1f84a7b42d0c67801dce2de0005e9e47d21122868b32ac3d40f
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.20.0-rc.0/kubernetes-client-linux-arm64.tar.gz) | 688e064f4ef6a17189dbb5af468c279b9de35e215c40500fb97b1d46692d222747023f9e07a7f7ba006400f9532a8912e69d7c5143f956b1dadca144c67ee711
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.20.0-rc.0/kubernetes-client-linux-ppc64le.tar.gz) | 47b8abc02b42b3b1de67da184921b5801d7e3cb09befac840c85913193fc5ac4e5e3ecfcb57da6b686ff21af9a3bd42ae6949d4744dbe6ad976794340e328b83
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.20.0-rc.0/kubernetes-client-linux-s390x.tar.gz) | 971b41d3169f30e6c412e0254c180636abb7ccc8dcee6641b0e9877b69752fc61aa30b76c19c108969df654fe385da3cb3a44dd59d3c28dc45561392d7e08874
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.20.0-rc.0/kubernetes-client-windows-386.tar.gz) | 2d34e8387e31531d9aca5655f2f0d18e75b01825dc1c39b7beb73a7b7b610e2ba429e5ca97d5c41a71b67e75e7096c86ab63fda9baab4c0878c1ccb3a1aefac8
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.20.0-rc.0/kubernetes-client-windows-amd64.tar.gz) | f909640f4140693bb871936f10a40e79b43502105d0adb318b35bb7a64a770ad9d05a3a732368ccd3d15d496d75454789165bd1f5c2571da9a00569b3e6c007c

### Server binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.20.0-rc.0/kubernetes-server-linux-amd64.tar.gz) | 0ea4458ae34108c633b4d48f1f128c6274dbc82b613492e78b3e0a2f656ac0df0bb9a75124e15d67c8e81850adcecf19f4ab0234c17247ee7ddf84f2df3e5eaa
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.20.0-rc.0/kubernetes-server-linux-arm.tar.gz) | aef6a4d457faa29936603370f29a8523bb274211c3cb5101bd31aaf469c91ba6bd149ea99a4ccdd83352cf37e4d6508c5ee475ec10292bccd2f77ceea31e1c28
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.20.0-rc.0/kubernetes-server-linux-arm64.tar.gz) | 4829f473e9d60f9929ad17c70fdc2b6b6509ed75418be0b23a75b28580949736cb5b0bd6382070f93aa0a2a8863f0b1596daf965186ca749996c29d03ef7d8b8
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.20.0-rc.0/kubernetes-server-linux-ppc64le.tar.gz) | 9ab0790d382a3e28df1c013762c09da0085449cfd09d176d80be932806c24a715ea829be0075c3e221a2ad9cf06e726b4c39ab41987c1fb0fee2563e48206763
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.20.0-rc.0/kubernetes-server-linux-s390x.tar.gz) | 98670b587e299856dd9821b7517a35f9a65835b915b153de08b66c54d82160438b66f774bf5306c07bc956d70ff709860bc23162225da5e89f995d3fdc1f0122

### Node binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.20.0-rc.0/kubernetes-node-linux-amd64.tar.gz) | 699e9c8d1837198312eade8eb6fec390f6a2fea9e08207d2f58e8bb6e3e799028aca69e4670aac0a4ba7cf0af683aee2c158bf78cc520c80edc876c8d94d521a
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.20.0-rc.0/kubernetes-node-linux-arm.tar.gz) | f3b5eab0669490e3cd7e802693daf3555d08323dfff6e73a881fce00fed4690e8bdaf1610278d9de74036ca37631016075e5695a02158b7d3e7582b20ef7fa35
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.20.0-rc.0/kubernetes-node-linux-arm64.tar.gz) | e5012f77363561a609aaf791baaa17d09009819c4085a57132e5feb5366275a54640094e6ed1cba527f42b586c6d62999c2a5435edf5665ff0e114db4423c2ae
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.20.0-rc.0/kubernetes-node-linux-ppc64le.tar.gz) | 2a6d6501620b1a9838dff05c66a40260cc22154a28027813346eb16e18c386bc3865298a46a0f08da71cd55149c5e7d07c4c4c431b4fd231486dd9d716548adb
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.20.0-rc.0/kubernetes-node-linux-s390x.tar.gz) | 5eca02777519e31428a1e5842fe540b813fb8c929c341bbc71dcfd60d98deb89060f8f37352e8977020e21e053379eead6478eb2d54ced66fb9d38d5f3142bf0
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.20.0-rc.0/kubernetes-node-windows-amd64.tar.gz) | 8ace02e7623dff894e863a2e0fa7dfb916368431d1723170713fe82e334c0ae0481b370855b71e2561de0fb64fed124281be604761ec08607230b66fb9ed1c03

## Changelog since v1.20.0-beta.2

## Changes by Kind

### Feature

- Kubernetes is now built using go1.15.5
  - build: Update to k/repo-infra@v0.1.2 (supports go1.15.5) ([#95776](https://github.com/kubernetes/kubernetes/pull/95776), [@justaugustus](https://github.com/justaugustus)) [SIG Cloud Provider, Instrumentation, Release and Testing]

### Failing Test

- Resolves an issue running Ingress conformance tests on clusters which use finalizers on Ingress objects to manage releasing load balancer resources ([#96742](https://github.com/kubernetes/kubernetes/pull/96742), [@spencerhance](https://github.com/spencerhance)) [SIG Network and Testing]
- The Conformance test "validates that there is no conflict between pods with same hostPort but different hostIP and protocol" now validates the connectivity to each hostPort, in addition to the functionality. ([#96627](https://github.com/kubernetes/kubernetes/pull/96627), [@aojea](https://github.com/aojea)) [SIG Scheduling and Testing]

### Bug or Regression

- Bump node-problem-detector version to v0.8.5 to fix OOM detection in with Linux kernels 5.1+ ([#96716](https://github.com/kubernetes/kubernetes/pull/96716), [@tosi3k](https://github.com/tosi3k)) [SIG Cloud Provider, Scalability and Testing]
- Changes to timeout parameter handling in 1.20.0-beta.2 have been reverted to avoid breaking backwards compatibility with existing clients. ([#96727](https://github.com/kubernetes/kubernetes/pull/96727), [@liggitt](https://github.com/liggitt)) [SIG API Machinery and Testing]
- Duplicate owner reference entries in create/update/patch requests now get deduplicated by the API server. The client sending the request now receives a warning header in the API response. Clients should stop sending requests with duplicate owner references. The API server may reject such requests as early as 1.24. ([#96185](https://github.com/kubernetes/kubernetes/pull/96185), [@roycaihw](https://github.com/roycaihw)) [SIG API Machinery and Testing]
- Fix: resize Azure disk issue when it's in attached state ([#96705](https://github.com/kubernetes/kubernetes/pull/96705), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider]
- Fixed a bug where aggregator_unavailable_apiservice metrics were reported for deleted apiservices. ([#96421](https://github.com/kubernetes/kubernetes/pull/96421), [@dgrisonnet](https://github.com/dgrisonnet)) [SIG API Machinery and Instrumentation]
- Fixes code generation for non-namespaced create subresources fake client test. ([#96586](https://github.com/kubernetes/kubernetes/pull/96586), [@Doude](https://github.com/Doude)) [SIG API Machinery]
- HTTP/2 connection health check is enabled by default in all Kubernetes clients. The feature should work out-of-the-box. If needed, users can tune the feature via the HTTP2_READ_IDLE_TIMEOUT_SECONDS and HTTP2_PING_TIMEOUT_SECONDS environment variables. The feature is disabled if HTTP2_READ_IDLE_TIMEOUT_SECONDS is set to 0. ([#95981](https://github.com/kubernetes/kubernetes/pull/95981), [@caesarxuchao](https://github.com/caesarxuchao)) [SIG API Machinery, CLI, Cloud Provider, Cluster Lifecycle, Instrumentation and Node]
- Kubeadm: fix coredns migration should be triggered when there are newdefault configs during kubeadm upgrade ([#96907](https://github.com/kubernetes/kubernetes/pull/96907), [@pacoxu](https://github.com/pacoxu)) [SIG Cluster Lifecycle]
- Reduce volume name length for vsphere volumes ([#96533](https://github.com/kubernetes/kubernetes/pull/96533), [@gnufied](https://github.com/gnufied)) [SIG Storage]
- Resolves a regression in 1.19+ with workloads targeting deprecated beta os/arch labels getting stuck in NodeAffinity status on node startup. ([#96810](https://github.com/kubernetes/kubernetes/pull/96810), [@liggitt](https://github.com/liggitt)) [SIG Node]

## Dependencies

### Added
_Nothing has changed._

### Changed
- github.com/google/cadvisor: [v0.38.4 → v0.38.5](https://github.com/google/cadvisor/compare/v0.38.4...v0.38.5)

### Removed
_Nothing has changed._



# v1.20.0-beta.2


## Downloads for v1.20.0-beta.2

### Source Code

filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.20.0-beta.2/kubernetes.tar.gz) | fe769280aa623802a949b6a35fbddadbba1d6f9933a54132a35625683719595ecf58096a9aa0f7456f8d4931774df21bfa98e148bc3d85913f1da915134f77bd
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.20.0-beta.2/kubernetes-src.tar.gz) | ce1c8d97c52e5189af335d673bd7e99c564816f6adebf249838f7e3f0e920f323b4e398a5d163ea767091497012ec38843c59ff14e6fdd07683b682135eed645

### Client binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.20.0-beta.2/kubernetes-client-darwin-amd64.tar.gz) | d6c14bd0f6702f4bbdf14a6abdfa4e5936de5b4efee38aa86c2bd7272967ec6d7868b88fc00ad4a7c3a20717a35e6be2b84e56dec04154fd702315f641409f7c
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.20.0-beta.2/kubernetes-client-linux-386.tar.gz) | b923c44cb0acb91a8f6fd442c2168aa6166c848f5d037ce50a7cb11502be3698db65836b373c916f75b648d6ac8d9158807a050eecc4e1c77cffa25b386c8cdb
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.20.0-beta.2/kubernetes-client-linux-amd64.tar.gz) | 8cae14146a9034dcd4e9d69d5d700f195a77aac35f629a148960ae028ed8b4fe12213993fe3e6e464b4b3e111adebe6f3dd7ca0accc70c738ed5cfd8993edd7c
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.20.0-beta.2/kubernetes-client-linux-arm.tar.gz) | 1f54e5262a0432945ead57fcb924e6bfedd9ea76db1dd9ebd946787a2923c247cf16e10505307b47e365905a1b398678dac5af0f433c439c158a33e08362d97b
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.20.0-beta.2/kubernetes-client-linux-arm64.tar.gz) | 31cf79c01e4878a231b4881fe3ed5ef790bd5fb5419388438d3f8c6a2129e655aba9e00b8e1d77e0bc5d05ecc75cf4ae02cf8266788822d0306c49c85ee584ed
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.20.0-beta.2/kubernetes-client-linux-ppc64le.tar.gz) | 2527948c40be2e16724d939316ad5363f15aa22ebf42d59359d8b6f757d30cfef6447434cc93bc5caa5a23a6a00a2da8d8191b6441e06bba469d9d4375989a97
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.20.0-beta.2/kubernetes-client-linux-s390x.tar.gz) | b777ad764b3a46651ecb0846e5b7f860bb2c1c4bd4d0fcc468c6ccffb7d3b8dcb6dcdd73b13c16ded7219f91bba9f1e92f9258527fd3bb162b54d7901ac303ff
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.20.0-beta.2/kubernetes-client-windows-386.tar.gz) | 8a2f58aaab01be9fe298e4d01456536047cbdd39a37d3e325c1f69ceab3a0504998be41a9f41a894735dfc4ed22bed02591eea5f3c75ce12d9e95ba134e72ec5
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.20.0-beta.2/kubernetes-client-windows-amd64.tar.gz) | 2f69cda177a178df149f5de66b7dba7f5ce14c1ffeb7c8d7dc4130c701b47d89bb2fbe74e7a262f573e4d21dee2c92414d050d7829e7c6fc3637a9d6b0b9c5c1

### Server binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.20.0-beta.2/kubernetes-server-linux-amd64.tar.gz) | 3ecaac0213d369eab691ac55376821a80df5013cb12e1263f18d1c236a9e49d42b3cea422175556d8f929cdf3109b22c0b6212ac0f2e80cc7a5f4afa3aba5f24
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.20.0-beta.2/kubernetes-server-linux-arm.tar.gz) | 580030b57ff207e177208fec0801a43389cae10cc2c9306327d354e7be6a055390184531d54b6742e0983550b7a76693cc4a705c2d2f4ac30495cf63cef26b9b
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.20.0-beta.2/kubernetes-server-linux-arm64.tar.gz) | 3e3286bd54671549fbef0dfdaaf1da99bc5c3efb32cc8d1e1985d9926520cea0c43bcf7cbcbbc8b1c1a95eab961255693008af3bb1ba743362998b5f0017d6d7
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.20.0-beta.2/kubernetes-server-linux-ppc64le.tar.gz) | 9fa051e7e97648e97e26b09ab6d26be247b41b1a5938d2189204c9e6688e455afe76612bbcdd994ed5692935d0d960bd96dc222bce4b83f61d62557752b9d75b
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.20.0-beta.2/kubernetes-server-linux-s390x.tar.gz) | fa85d432eff586f30975c95664ac130b9f5ae02dc52b97613ed7a41324496631ea11d1a267daba564cf2485a9e49707814d86bbd3175486c7efc8b58a9314af5

### Node binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.20.0-beta.2/kubernetes-node-linux-amd64.tar.gz) | 86e631f95fe670b467ead2b88d34e0364eaa275935af433d27cc378d82dcaa22041ccce40f5fa9561b9656dadaa578dc018ad458a59b1690d35f86dca4776b5c
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.20.0-beta.2/kubernetes-node-linux-arm.tar.gz) | a8754ff58a0e902397056b8615ab49af07aca347ba7cc4a812c238e3812234862270f25106b6a94753b157bb153b8eae8b39a01ed67384774d798598c243583b
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.20.0-beta.2/kubernetes-node-linux-arm64.tar.gz) | 28d727d7d08e2c856c9b4a574ef2dbf9e37236a0555f7ec5258b4284fa0582fb94b06783aaf50bf661f7503d101fbd70808aba6de02a2f0af94db7d065d25947
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.20.0-beta.2/kubernetes-node-linux-ppc64le.tar.gz) | a1283449f1a0b155c11449275e9371add544d0bdd4609d6dc737ed5f7dd228e84e24ff249613a2a153691627368dd894ad64f4e6c0010eecc6efd2c13d4fb133
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.20.0-beta.2/kubernetes-node-linux-s390x.tar.gz) | 5806028ba15a6a9c54a34f90117bc3181428dbb0e7ced30874c9f4a953ea5a0e9b2c73e6b1e2545e1b4e5253e9c7691588538b44cdfa666ce6865964b92d2fa8
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.20.0-beta.2/kubernetes-node-windows-amd64.tar.gz) | d5327e3b7916c78777b9b69ba0f3758c3a8645c67af80114a0ae52babd7af27bb504febbaf51b1bfe5bd2d74c8c5c573471e1cb449f2429453f4b1be9d5e682a

## Changelog since v1.20.0-beta.1

## Urgent Upgrade Notes

### (No, really, you MUST read this before you upgrade)

 - A bug was fixed in kubelet where exec probe timeouts were not respected. Ensure that pods relying on this behavior are updated to correctly handle probe timeouts.
  
  This change in behavior may be unexpected for some clusters and can be disabled by turning off the ExecProbeTimeout feature gate. This gate will be locked and removed in future releases so that exec probe timeouts are always respected. ([#94115](https://github.com/kubernetes/kubernetes/pull/94115), [@andrewsykim](https://github.com/andrewsykim)) [SIG Node and Testing]
  - For CSI drivers, kubelet no longer creates the target_path for NodePublishVolume in accordance with the CSI spec. Kubelet also no longer checks if staging and target paths are mounts or corrupted. CSI drivers need to be idempotent and do any necessary mount verification. ([#88759](https://github.com/kubernetes/kubernetes/pull/88759), [@andyzhangx](https://github.com/andyzhangx)) [SIG Storage]
  - Kubeadm:
  - The label applied to control-plane nodes "node-role.kubernetes.io/master" is now deprecated and will be removed in a future release after a GA deprecation period.
  - Introduce a new label "node-role.kubernetes.io/control-plane" that will be applied in parallel to "node-role.kubernetes.io/master" until the removal of the "node-role.kubernetes.io/master" label.
  - Make "kubeadm upgrade apply" add the "node-role.kubernetes.io/control-plane" label on existing nodes that only have the "node-role.kubernetes.io/master" label during upgrade.
  - Please adapt your tooling built on top of kubeadm to use the "node-role.kubernetes.io/control-plane" label.
  
  - The taint applied to control-plane nodes "node-role.kubernetes.io/master:NoSchedule" is now deprecated and will be removed in a future release after a GA deprecation period.
  - Apply toleration for a new, future taint "node-role.kubernetes.io/control-plane:NoSchedule" to the kubeadm CoreDNS / kube-dns managed manifests. Note that this taint is not yet applied to kubeadm control-plane nodes.
  - Please adapt your workloads to tolerate the same future taint preemptively.
  
  For more details see: http://git.k8s.io/enhancements/keps/sig-cluster-lifecycle/kubeadm/2067-rename-master-label-taint/README.md ([#95382](https://github.com/kubernetes/kubernetes/pull/95382), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
 
## Changes by Kind

### Deprecation

- Docker support in the kubelet is now deprecated and will be removed in a future release. The kubelet uses a module called "dockershim" which implements CRI support for Docker and it has seen maintenance issues in the Kubernetes community. We encourage you to evaluate moving to a container runtime that is a full-fledged implementation of CRI (v1alpha1 or v1 compliant) as they become available. ([#94624](https://github.com/kubernetes/kubernetes/pull/94624), [@dims](https://github.com/dims)) [SIG Node]
- Kubectl: deprecate --delete-local-data ([#95076](https://github.com/kubernetes/kubernetes/pull/95076), [@dougsland](https://github.com/dougsland)) [SIG CLI, Cloud Provider and Scalability]

### API Change

- API priority and fairness graduated to beta
  1.19 servers with APF turned on should not be run in a multi-server cluster with 1.20+ servers. ([#96527](https://github.com/kubernetes/kubernetes/pull/96527), [@adtac](https://github.com/adtac)) [SIG API Machinery and Testing]
- Add LoadBalancerIPMode feature gate ([#92312](https://github.com/kubernetes/kubernetes/pull/92312), [@Sh4d1](https://github.com/Sh4d1)) [SIG Apps, CLI, Cloud Provider and Network]
- Add WindowsContainerResources and Annotations to CRI-API UpdateContainerResourcesRequest ([#95741](https://github.com/kubernetes/kubernetes/pull/95741), [@katiewasnothere](https://github.com/katiewasnothere)) [SIG Node]
- Add a 'serving' and `terminating` condition to the EndpointSlice API.
  
  `serving` tracks the readiness of endpoints regardless of their terminating state. This is distinct from `ready` since `ready` is only true when pods are not terminating. 
  `terminating` is true when an endpoint is terminating. For pods this is any endpoint with a deletion timestamp. ([#92968](https://github.com/kubernetes/kubernetes/pull/92968), [@andrewsykim](https://github.com/andrewsykim)) [SIG Apps and Network]
- Add support for hugepages to downward API ([#86102](https://github.com/kubernetes/kubernetes/pull/86102), [@derekwaynecarr](https://github.com/derekwaynecarr)) [SIG API Machinery, Apps, CLI, Network, Node, Scheduling and Testing]
- Adds kubelet alpha feature, `GracefulNodeShutdown` which makes kubelet aware of node system shutdowns and result in graceful termination of pods during a system shutdown. ([#96129](https://github.com/kubernetes/kubernetes/pull/96129), [@bobbypage](https://github.com/bobbypage)) [SIG Node]
- AppProtocol is now GA for Endpoints and Services. The ServiceAppProtocol feature gate will be deprecated in 1.21. ([#96327](https://github.com/kubernetes/kubernetes/pull/96327), [@robscott](https://github.com/robscott)) [SIG Apps and Network]
- Automatic allocation of NodePorts for services with type LoadBalancer can now be disabled by setting the (new) parameter
  Service.spec.allocateLoadBalancerNodePorts=false. The default is to allocate NodePorts for services with type LoadBalancer which is the existing behavior. ([#92744](https://github.com/kubernetes/kubernetes/pull/92744), [@uablrek](https://github.com/uablrek)) [SIG Apps and Network]
- Document that ServiceTopology feature is required to use `service.spec.topologyKeys`. ([#96528](https://github.com/kubernetes/kubernetes/pull/96528), [@andrewsykim](https://github.com/andrewsykim)) [SIG Apps]
- EndpointSlice has a new NodeName field guarded by the EndpointSliceNodeName feature gate.
  - EndpointSlice topology field will be deprecated in an upcoming release.
  - EndpointSlice "IP" address type is formally removed after being deprecated in Kubernetes 1.17.
  - The discovery.k8s.io/v1alpha1 API is deprecated and will be removed in Kubernetes 1.21. ([#96440](https://github.com/kubernetes/kubernetes/pull/96440), [@robscott](https://github.com/robscott)) [SIG API Machinery, Apps and Network]
- Fewer candidates are enumerated for preemption to improve performance in large clusters ([#94814](https://github.com/kubernetes/kubernetes/pull/94814), [@adtac](https://github.com/adtac)) [SIG Scheduling]
- If BoundServiceAccountTokenVolume is enabled, cluster admins can use metric `serviceaccount_stale_tokens_total` to monitor workloads that are depending on the extended tokens. If there are no such workloads, turn off extended tokens by starting `kube-apiserver` with flag `--service-account-extend-token-expiration=false` ([#96273](https://github.com/kubernetes/kubernetes/pull/96273), [@zshihang](https://github.com/zshihang)) [SIG API Machinery and Auth]
- Introduce alpha support for exec-based container registry credential provider plugins in the kubelet. ([#94196](https://github.com/kubernetes/kubernetes/pull/94196), [@andrewsykim](https://github.com/andrewsykim)) [SIG Node and Release]
- Kube-apiserver now deletes expired kube-apiserver Lease objects:
  - The feature is under feature gate `APIServerIdentity`.
  - A flag is added to kube-apiserver: `identity-lease-garbage-collection-check-period-seconds` ([#95895](https://github.com/kubernetes/kubernetes/pull/95895), [@roycaihw](https://github.com/roycaihw)) [SIG API Machinery, Apps, Auth and Testing]
- Move configurable fsgroup change policy for pods to beta ([#96376](https://github.com/kubernetes/kubernetes/pull/96376), [@gnufied](https://github.com/gnufied)) [SIG Apps and Storage]
- New flag is introduced, i.e. --topology-manager-scope=container|pod. 
  The default value is the "container" scope. ([#92967](https://github.com/kubernetes/kubernetes/pull/92967), [@cezaryzukowski](https://github.com/cezaryzukowski)) [SIG Instrumentation, Node and Testing]
- NodeAffinity plugin can be configured with AddedAffinity. ([#96202](https://github.com/kubernetes/kubernetes/pull/96202), [@alculquicondor](https://github.com/alculquicondor)) [SIG Node, Scheduling and Testing]
- Promote RuntimeClass feature to GA.
  Promote node.k8s.io API groups from v1beta1 to v1. ([#95718](https://github.com/kubernetes/kubernetes/pull/95718), [@SergeyKanzhelev](https://github.com/SergeyKanzhelev)) [SIG Apps, Auth, Node, Scheduling and Testing]
- Reminder: The labels "failure-domain.beta.kubernetes.io/zone" and "failure-domain.beta.kubernetes.io/region" are deprecated in favor of "topology.kubernetes.io/zone" and "topology.kubernetes.io/region" respectively.  All users of the "failure-domain.beta..." labels should switch to the "topology..." equivalents. ([#96033](https://github.com/kubernetes/kubernetes/pull/96033), [@thockin](https://github.com/thockin)) [SIG API Machinery, Apps, CLI, Cloud Provider, Network, Node, Scheduling, Storage and Testing]
- The usage of mixed protocol values in the same LoadBalancer Service is possible if the new feature gate MixedProtocolLBSVC is enabled.
  "action required"
  The feature gate is disabled by default. The user has to enable it for the API Server. ([#94028](https://github.com/kubernetes/kubernetes/pull/94028), [@janosi](https://github.com/janosi)) [SIG API Machinery and Apps]
- This PR will introduce a feature gate CSIServiceAccountToken with two additional fields in `CSIDriverSpec`. ([#93130](https://github.com/kubernetes/kubernetes/pull/93130), [@zshihang](https://github.com/zshihang)) [SIG API Machinery, Apps, Auth, CLI, Network, Node, Storage and Testing]
- Users can try the cronjob controller v2 using the feature gate. This will be the default controller in future releases. ([#93370](https://github.com/kubernetes/kubernetes/pull/93370), [@alaypatel07](https://github.com/alaypatel07)) [SIG API Machinery, Apps, Auth and Testing]
- VolumeSnapshotDataSource moves to GA in 1.20 release ([#95282](https://github.com/kubernetes/kubernetes/pull/95282), [@xing-yang](https://github.com/xing-yang)) [SIG Apps]

### Feature

- **Additional documentation e.g., KEPs (Kubernetes Enhancement Proposals), usage docs, etc.**: ([#95896](https://github.com/kubernetes/kubernetes/pull/95896), [@zshihang](https://github.com/zshihang)) [SIG API Machinery and Cluster Lifecycle]
- A new set of alpha metrics are reported by the Kubernetes scheduler under the `/metrics/resources` endpoint that allow administrators to easily see the resource consumption (requests and limits for all resources on the pods) and compare it to actual pod usage or node capacity. ([#94866](https://github.com/kubernetes/kubernetes/pull/94866), [@smarterclayton](https://github.com/smarterclayton)) [SIG API Machinery, Instrumentation, Node and Scheduling]
- Add --experimental-logging-sanitization flag enabling runtime protection from leaking sensitive data in logs ([#96370](https://github.com/kubernetes/kubernetes/pull/96370), [@serathius](https://github.com/serathius)) [SIG API Machinery, Cluster Lifecycle and Instrumentation]
- Add a StorageVersionAPI feature gate that makes API server update storageversions before serving certain write requests. 
  This feature allows the storage migrator to manage storage migration for built-in resources. 
  Enabling internal.apiserver.k8s.io/v1alpha1 API and APIServerIdentity feature gate are required to use this feature. ([#93873](https://github.com/kubernetes/kubernetes/pull/93873), [@roycaihw](https://github.com/roycaihw)) [SIG API Machinery, Auth and Testing]
- Add a new `vSphere` metric: `cloudprovider_vsphere_vcenter_versions`. It's content show `vCenter` hostnames with the associated server version. ([#94526](https://github.com/kubernetes/kubernetes/pull/94526), [@Danil-Grigorev](https://github.com/Danil-Grigorev)) [SIG Cloud Provider and Instrumentation]
- Add feature to size memory backed volumes ([#94444](https://github.com/kubernetes/kubernetes/pull/94444), [@derekwaynecarr](https://github.com/derekwaynecarr)) [SIG Storage and Testing]
- Add node_authorizer_actions_duration_seconds metric that can be used to estimate load to node authorizer. ([#92466](https://github.com/kubernetes/kubernetes/pull/92466), [@mborsz](https://github.com/mborsz)) [SIG API Machinery, Auth and Instrumentation]
- Add pod_ based CPU and memory metrics to Kubelet's  /metrics/resource endpoint ([#95839](https://github.com/kubernetes/kubernetes/pull/95839), [@egernst](https://github.com/egernst)) [SIG Instrumentation, Node and Testing]
- Adds a headless service on node-local-cache addon. ([#88412](https://github.com/kubernetes/kubernetes/pull/88412), [@stafot](https://github.com/stafot)) [SIG Cloud Provider and Network]
- CRDs: For structural schemas, non-nullable null map fields will now be dropped and defaulted if a default is available. null items in list will continue being preserved, and fail validation if not nullable. ([#95423](https://github.com/kubernetes/kubernetes/pull/95423), [@apelisse](https://github.com/apelisse)) [SIG API Machinery]
- E2e test for PodFsGroupChangePolicy ([#96247](https://github.com/kubernetes/kubernetes/pull/96247), [@saikat-royc](https://github.com/saikat-royc)) [SIG Storage and Testing]
- Gradudate the Pod Resources API to G.A
  Introduces the pod_resources_endpoint_requests_total metric which tracks the total number of requests to the pod resources API ([#92165](https://github.com/kubernetes/kubernetes/pull/92165), [@RenaudWasTaken](https://github.com/RenaudWasTaken)) [SIG Instrumentation, Node and Testing]
- Introduce api-extensions category which will return: mutating admission configs, validating admission configs, CRDs and APIServices when used in kubectl get, for example. ([#95603](https://github.com/kubernetes/kubernetes/pull/95603), [@soltysh](https://github.com/soltysh)) [SIG API Machinery]
- Kube-apiserver now maintains a Lease object to identify itself: 
  - The feature is under feature gate `APIServerIdentity`. 
  - Two flags are added to kube-apiserver: `identity-lease-duration-seconds`, `identity-lease-renew-interval-seconds` ([#95533](https://github.com/kubernetes/kubernetes/pull/95533), [@roycaihw](https://github.com/roycaihw)) [SIG API Machinery]
- Kube-apiserver: The timeout used when making health check calls to etcd can now be configured with `--etcd-healthcheck-timeout`. The default timeout is 2 seconds, matching the previous behavior. ([#93244](https://github.com/kubernetes/kubernetes/pull/93244), [@Sh4d1](https://github.com/Sh4d1)) [SIG API Machinery]
- Kubectl: Previously users cannot provide arguments to a external diff tool via KUBECTL_EXTERNAL_DIFF env. This release now allow users to specify args to KUBECTL_EXTERNAL_DIFF env. ([#95292](https://github.com/kubernetes/kubernetes/pull/95292), [@dougsland](https://github.com/dougsland)) [SIG CLI]
- Scheduler now ignores Pod update events if the resourceVersion of old and new Pods are identical. ([#96071](https://github.com/kubernetes/kubernetes/pull/96071), [@Huang-Wei](https://github.com/Huang-Wei)) [SIG Scheduling]
- Support custom tags for cloud provider managed resources ([#96450](https://github.com/kubernetes/kubernetes/pull/96450), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]
- Support customize load balancer health probe protocol and request path ([#96338](https://github.com/kubernetes/kubernetes/pull/96338), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]
- Support multiple standard load balancers in one cluster ([#96111](https://github.com/kubernetes/kubernetes/pull/96111), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]
- The beta `RootCAConfigMap` feature gate is enabled by default and causes kube-controller-manager to publish a "kube-root-ca.crt" ConfigMap to every namespace. This ConfigMap contains a CA bundle used for verifying connections to the kube-apiserver. ([#96197](https://github.com/kubernetes/kubernetes/pull/96197), [@zshihang](https://github.com/zshihang)) [SIG API Machinery, Apps, Auth and Testing]
- The kubelet_runtime_operations_duration_seconds metric got additional buckets of 60, 300, 600, 900 and 1200 seconds ([#96054](https://github.com/kubernetes/kubernetes/pull/96054), [@alvaroaleman](https://github.com/alvaroaleman)) [SIG Instrumentation and Node]
- There is a new pv_collector_total_pv_count metric that counts persistent volumes by the volume plugin name and volume mode. ([#95719](https://github.com/kubernetes/kubernetes/pull/95719), [@tsmetana](https://github.com/tsmetana)) [SIG Apps, Instrumentation, Storage and Testing]
- Volume snapshot e2e test to validate PVC and VolumeSnapshotContent finalizer ([#95863](https://github.com/kubernetes/kubernetes/pull/95863), [@RaunakShah](https://github.com/RaunakShah)) [SIG Cloud Provider, Storage and Testing]
- Warns user when executing kubectl apply/diff to resource currently being deleted. ([#95544](https://github.com/kubernetes/kubernetes/pull/95544), [@SaiHarshaK](https://github.com/SaiHarshaK)) [SIG CLI]
- `kubectl alpha debug` has graduated to beta and is now `kubectl debug`. ([#96138](https://github.com/kubernetes/kubernetes/pull/96138), [@verb](https://github.com/verb)) [SIG CLI and Testing]
- `kubectl debug` gains support for changing container images when copying a pod for debugging, similar to how `kubectl set image` works. See `kubectl help debug` for more information. ([#96058](https://github.com/kubernetes/kubernetes/pull/96058), [@verb](https://github.com/verb)) [SIG CLI]

### Documentation

- Updates docs and guidance on cloud provider InstancesV2 and Zones interface for external cloud providers:
  - removes experimental warning for InstancesV2
  - document that implementation of InstancesV2 will disable calls to Zones
  - deprecate Zones in favor of InstancesV2 ([#96397](https://github.com/kubernetes/kubernetes/pull/96397), [@andrewsykim](https://github.com/andrewsykim)) [SIG Cloud Provider]

### Bug or Regression

- Change plugin name in fsgroupapplymetrics of csi and flexvolume to distinguish different driver ([#95892](https://github.com/kubernetes/kubernetes/pull/95892), [@JornShen](https://github.com/JornShen)) [SIG Instrumentation, Storage and Testing]
- Clear UDP conntrack entry on endpoint changes when using nodeport ([#71573](https://github.com/kubernetes/kubernetes/pull/71573), [@JacobTanenbaum](https://github.com/JacobTanenbaum)) [SIG Network]
- Exposes and sets a default timeout for the TokenReview client for DelegatingAuthenticationOptions ([#96217](https://github.com/kubernetes/kubernetes/pull/96217), [@p0lyn0mial](https://github.com/p0lyn0mial)) [SIG API Machinery and Cloud Provider]
- Fix CVE-2020-8555 for Quobyte client connections. ([#95206](https://github.com/kubernetes/kubernetes/pull/95206), [@misterikkit](https://github.com/misterikkit)) [SIG Storage]
- Fix IP fragmentation of UDP and TCP packets not supported issues on LoadBalancer rules ([#96464](https://github.com/kubernetes/kubernetes/pull/96464), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]
- Fix a bug that DefaultPreemption plugin is disabled when using (legacy) scheduler policy. ([#96439](https://github.com/kubernetes/kubernetes/pull/96439), [@Huang-Wei](https://github.com/Huang-Wei)) [SIG Scheduling and Testing]
- Fix bug in JSON path parser where an error occurs when a range is empty ([#95933](https://github.com/kubernetes/kubernetes/pull/95933), [@brianpursley](https://github.com/brianpursley)) [SIG API Machinery]
- Fix client-go prometheus metrics to correctly present the API path accessed in some environments. ([#74363](https://github.com/kubernetes/kubernetes/pull/74363), [@aanm](https://github.com/aanm)) [SIG API Machinery]
- Fix memory leak in kube-apiserver when underlying time goes forth and back. ([#96266](https://github.com/kubernetes/kubernetes/pull/96266), [@chenyw1990](https://github.com/chenyw1990)) [SIG API Machinery]
- Fix paging issues when Azure API returns empty values with non-empty nextLink ([#96211](https://github.com/kubernetes/kubernetes/pull/96211), [@feiskyer](https://github.com/feiskyer)) [SIG Cloud Provider]
- Fix pull image error from multiple ACRs using azure managed identity ([#96355](https://github.com/kubernetes/kubernetes/pull/96355), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider]
- Fix vSphere volumes that could be erroneously attached to wrong node ([#96224](https://github.com/kubernetes/kubernetes/pull/96224), [@gnufied](https://github.com/gnufied)) [SIG Cloud Provider and Storage]
- Fixed a bug that prevents kubectl to validate CRDs with schema using x-kubernetes-preserve-unknown-fields on object fields. ([#96369](https://github.com/kubernetes/kubernetes/pull/96369), [@gautierdelorme](https://github.com/gautierdelorme)) [SIG API Machinery and Testing]
- For vSphere Cloud Provider, If VM of worker node is deleted, the node will also be deleted by node controller ([#92608](https://github.com/kubernetes/kubernetes/pull/92608), [@lubronzhan](https://github.com/lubronzhan)) [SIG Cloud Provider]
- HTTP/2 connection health check is enabled by default in all Kubernetes clients. The feature should work out-of-the-box. If needed, users can tune the feature via the HTTP2_READ_IDLE_TIMEOUT_SECONDS and HTTP2_PING_TIMEOUT_SECONDS environment variables. The feature is disabled if HTTP2_READ_IDLE_TIMEOUT_SECONDS is set to 0. ([#95981](https://github.com/kubernetes/kubernetes/pull/95981), [@caesarxuchao](https://github.com/caesarxuchao)) [SIG API Machinery, CLI, Cloud Provider, Cluster Lifecycle, Instrumentation and Node]
- If the user specifies an invalid timeout in the request URL, the request will be aborted with an HTTP 400.
  - If the user specifies a timeout in the request URL that exceeds the maximum request deadline allowed by the apiserver, the request will be aborted with an HTTP 400. ([#96061](https://github.com/kubernetes/kubernetes/pull/96061), [@tkashem](https://github.com/tkashem)) [SIG API Machinery, Network and Testing]
- Improve error messages related to nodePort endpoint changes conntrack entries cleanup. ([#96251](https://github.com/kubernetes/kubernetes/pull/96251), [@ravens](https://github.com/ravens)) [SIG Network]
- Print go stack traces at -v=4 and not -v=2 ([#94663](https://github.com/kubernetes/kubernetes/pull/94663), [@soltysh](https://github.com/soltysh)) [SIG CLI]
- Remove ready file and its directory (which is created during volume SetUp) during emptyDir volume TearDown. ([#95770](https://github.com/kubernetes/kubernetes/pull/95770), [@jingxu97](https://github.com/jingxu97)) [SIG Storage]
- Resolves non-deterministic behavior of the garbage collection controller when ownerReferences with incorrect data are encountered. Events with a reason of `OwnerRefInvalidNamespace` are recorded when namespace mismatches between child and owner objects are detected.
  - A namespaced object with an ownerReference referencing a uid of a namespaced kind which does not exist in the same namespace is now consistently treated as though that owner does not exist, and the child object is deleted.
  - A cluster-scoped object with an ownerReference referencing a uid of a namespaced kind is now consistently treated as though that owner is not resolvable, and the child object is ignored by the garbage collector. ([#92743](https://github.com/kubernetes/kubernetes/pull/92743), [@liggitt](https://github.com/liggitt)) [SIG API Machinery, Apps and Testing]
- Skip [k8s.io/kubernetes@v1.19.0/test/e2e/storage/testsuites/base.go:162]: Driver azure-disk doesn't support snapshot type DynamicSnapshot -- skipping
  skip [k8s.io/kubernetes@v1.19.0/test/e2e/storage/testsuites/base.go:185]: Driver azure-disk doesn't support ntfs -- skipping ([#96144](https://github.com/kubernetes/kubernetes/pull/96144), [@qinpingli](https://github.com/qinpingli)) [SIG Storage and Testing]
- The AWS network load balancer attributes can now be specified during service creation ([#95247](https://github.com/kubernetes/kubernetes/pull/95247), [@kishorj](https://github.com/kishorj)) [SIG Cloud Provider]
- The kube-apiserver will no longer serve APIs that should have been deleted in GA non-alpha levels.  Alpha levels will continue to serve the removed APIs so that CI doesn't immediately break. ([#96525](https://github.com/kubernetes/kubernetes/pull/96525), [@deads2k](https://github.com/deads2k)) [SIG API Machinery]
- Update max azure data disk count map ([#96308](https://github.com/kubernetes/kubernetes/pull/96308), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider and Storage]
- Update the route table tag in the route reconcile loop ([#96545](https://github.com/kubernetes/kubernetes/pull/96545), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]
- Volume binding: report UnschedulableAndUnresolvable status instead of an error when bound PVs not found ([#95541](https://github.com/kubernetes/kubernetes/pull/95541), [@cofyc](https://github.com/cofyc)) [SIG Apps, Scheduling and Storage]
- [kubectl] Fail when local source file doesn't exist ([#90333](https://github.com/kubernetes/kubernetes/pull/90333), [@bamarni](https://github.com/bamarni)) [SIG CLI]

### Other (Cleanup or Flake)

- Handle slow cronjob lister in cronjob controller v2 and improve memory footprint. ([#96443](https://github.com/kubernetes/kubernetes/pull/96443), [@alaypatel07](https://github.com/alaypatel07)) [SIG Apps]
- --redirect-container-streaming is no longer functional. The flag will be removed in v1.22 ([#95935](https://github.com/kubernetes/kubernetes/pull/95935), [@tallclair](https://github.com/tallclair)) [SIG Node]
- A new metric `requestAbortsTotal` has been introduced that counts aborted requests for each `group`, `version`, `verb`, `resource`, `subresource` and `scope`. ([#95002](https://github.com/kubernetes/kubernetes/pull/95002), [@p0lyn0mial](https://github.com/p0lyn0mial)) [SIG API Machinery, Cloud Provider, Instrumentation and Scheduling]
- API priority and fairness metrics use snake_case in label names ([#96236](https://github.com/kubernetes/kubernetes/pull/96236), [@adtac](https://github.com/adtac)) [SIG API Machinery, Cluster Lifecycle, Instrumentation and Testing]
- Applies translations on all command descriptions ([#95439](https://github.com/kubernetes/kubernetes/pull/95439), [@HerrNaN](https://github.com/HerrNaN)) [SIG CLI]
- Changed: default "Accept-Encoding" header removed from HTTP probes. See https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#http-probes ([#96127](https://github.com/kubernetes/kubernetes/pull/96127), [@fonsecas72](https://github.com/fonsecas72)) [SIG Network and Node]
- Generators for services are removed from kubectl ([#95256](https://github.com/kubernetes/kubernetes/pull/95256), [@Git-Jiro](https://github.com/Git-Jiro)) [SIG CLI]
- Introduce kubectl-convert plugin. ([#96190](https://github.com/kubernetes/kubernetes/pull/96190), [@soltysh](https://github.com/soltysh)) [SIG CLI and Testing]
- Kube-scheduler now logs processed component config at startup ([#96426](https://github.com/kubernetes/kubernetes/pull/96426), [@damemi](https://github.com/damemi)) [SIG Scheduling]
- NONE ([#96179](https://github.com/kubernetes/kubernetes/pull/96179), [@bbyrne5](https://github.com/bbyrne5)) [SIG Network]
- Users will now be able to configure all supported values for AWS NLB health check interval and thresholds for new resources. ([#96312](https://github.com/kubernetes/kubernetes/pull/96312), [@kishorj](https://github.com/kishorj)) [SIG Cloud Provider]

## Dependencies

### Added
- cloud.google.com/go/firestore: v1.1.0
- github.com/armon/go-metrics: [f0300d1](https://github.com/armon/go-metrics/tree/f0300d1)
- github.com/armon/go-radix: [7fddfc3](https://github.com/armon/go-radix/tree/7fddfc3)
- github.com/bketelsen/crypt: [5cbc8cc](https://github.com/bketelsen/crypt/tree/5cbc8cc)
- github.com/hashicorp/consul/api: [v1.1.0](https://github.com/hashicorp/consul/api/tree/v1.1.0)
- github.com/hashicorp/consul/sdk: [v0.1.1](https://github.com/hashicorp/consul/sdk/tree/v0.1.1)
- github.com/hashicorp/errwrap: [v1.0.0](https://github.com/hashicorp/errwrap/tree/v1.0.0)
- github.com/hashicorp/go-cleanhttp: [v0.5.1](https://github.com/hashicorp/go-cleanhttp/tree/v0.5.1)
- github.com/hashicorp/go-immutable-radix: [v1.0.0](https://github.com/hashicorp/go-immutable-radix/tree/v1.0.0)
- github.com/hashicorp/go-msgpack: [v0.5.3](https://github.com/hashicorp/go-msgpack/tree/v0.5.3)
- github.com/hashicorp/go-multierror: [v1.0.0](https://github.com/hashicorp/go-multierror/tree/v1.0.0)
- github.com/hashicorp/go-rootcerts: [v1.0.0](https://github.com/hashicorp/go-rootcerts/tree/v1.0.0)
- github.com/hashicorp/go-sockaddr: [v1.0.0](https://github.com/hashicorp/go-sockaddr/tree/v1.0.0)
- github.com/hashicorp/go-uuid: [v1.0.1](https://github.com/hashicorp/go-uuid/tree/v1.0.1)
- github.com/hashicorp/go.net: [v0.0.1](https://github.com/hashicorp/go.net/tree/v0.0.1)
- github.com/hashicorp/logutils: [v1.0.0](https://github.com/hashicorp/logutils/tree/v1.0.0)
- github.com/hashicorp/mdns: [v1.0.0](https://github.com/hashicorp/mdns/tree/v1.0.0)
- github.com/hashicorp/memberlist: [v0.1.3](https://github.com/hashicorp/memberlist/tree/v0.1.3)
- github.com/hashicorp/serf: [v0.8.2](https://github.com/hashicorp/serf/tree/v0.8.2)
- github.com/mitchellh/cli: [v1.0.0](https://github.com/mitchellh/cli/tree/v1.0.0)
- github.com/mitchellh/go-testing-interface: [v1.0.0](https://github.com/mitchellh/go-testing-interface/tree/v1.0.0)
- github.com/mitchellh/gox: [v0.4.0](https://github.com/mitchellh/gox/tree/v0.4.0)
- github.com/mitchellh/iochan: [v1.0.0](https://github.com/mitchellh/iochan/tree/v1.0.0)
- github.com/pascaldekloe/goe: [57f6aae](https://github.com/pascaldekloe/goe/tree/57f6aae)
- github.com/posener/complete: [v1.1.1](https://github.com/posener/complete/tree/v1.1.1)
- github.com/ryanuber/columnize: [9b3edd6](https://github.com/ryanuber/columnize/tree/9b3edd6)
- github.com/sean-/seed: [e2103e2](https://github.com/sean-/seed/tree/e2103e2)
- github.com/subosito/gotenv: [v1.2.0](https://github.com/subosito/gotenv/tree/v1.2.0)
- github.com/willf/bitset: [d5bec33](https://github.com/willf/bitset/tree/d5bec33)
- gopkg.in/ini.v1: v1.51.0
- gopkg.in/yaml.v3: 9f266ea
- rsc.io/quote/v3: v3.1.0
- rsc.io/sampler: v1.3.0

### Changed
- cloud.google.com/go/bigquery: v1.0.1 → v1.4.0
- cloud.google.com/go/datastore: v1.0.0 → v1.1.0
- cloud.google.com/go/pubsub: v1.0.1 → v1.2.0
- cloud.google.com/go/storage: v1.0.0 → v1.6.0
- cloud.google.com/go: v0.51.0 → v0.54.0
- github.com/Microsoft/go-winio: [fc70bd9 → v0.4.15](https://github.com/Microsoft/go-winio/compare/fc70bd9...v0.4.15)
- github.com/aws/aws-sdk-go: [v1.35.5 → v1.35.24](https://github.com/aws/aws-sdk-go/compare/v1.35.5...v1.35.24)
- github.com/blang/semver: [v3.5.0+incompatible → v3.5.1+incompatible](https://github.com/blang/semver/compare/v3.5.0...v3.5.1)
- github.com/checkpoint-restore/go-criu/v4: [v4.0.2 → v4.1.0](https://github.com/checkpoint-restore/go-criu/v4/compare/v4.0.2...v4.1.0)
- github.com/containerd/containerd: [v1.3.3 → v1.4.1](https://github.com/containerd/containerd/compare/v1.3.3...v1.4.1)
- github.com/containerd/ttrpc: [v1.0.0 → v1.0.2](https://github.com/containerd/ttrpc/compare/v1.0.0...v1.0.2)
- github.com/containerd/typeurl: [v1.0.0 → v1.0.1](https://github.com/containerd/typeurl/compare/v1.0.0...v1.0.1)
- github.com/coreos/etcd: [v3.3.10+incompatible → v3.3.13+incompatible](https://github.com/coreos/etcd/compare/v3.3.10...v3.3.13)
- github.com/docker/docker: [aa6a989 → bd33bbf](https://github.com/docker/docker/compare/aa6a989...bd33bbf)
- github.com/go-gl/glfw/v3.3/glfw: [12ad95a → 6f7a984](https://github.com/go-gl/glfw/v3.3/glfw/compare/12ad95a...6f7a984)
- github.com/golang/groupcache: [215e871 → 8c9f03a](https://github.com/golang/groupcache/compare/215e871...8c9f03a)
- github.com/golang/mock: [v1.3.1 → v1.4.1](https://github.com/golang/mock/compare/v1.3.1...v1.4.1)
- github.com/golang/protobuf: [v1.4.2 → v1.4.3](https://github.com/golang/protobuf/compare/v1.4.2...v1.4.3)
- github.com/google/cadvisor: [v0.37.0 → v0.38.4](https://github.com/google/cadvisor/compare/v0.37.0...v0.38.4)
- github.com/google/go-cmp: [v0.4.0 → v0.5.2](https://github.com/google/go-cmp/compare/v0.4.0...v0.5.2)
- github.com/google/pprof: [d4f498a → 1ebb73c](https://github.com/google/pprof/compare/d4f498a...1ebb73c)
- github.com/google/uuid: [v1.1.1 → v1.1.2](https://github.com/google/uuid/compare/v1.1.1...v1.1.2)
- github.com/gorilla/mux: [v1.7.3 → v1.8.0](https://github.com/gorilla/mux/compare/v1.7.3...v1.8.0)
- github.com/gorilla/websocket: [v1.4.0 → v1.4.2](https://github.com/gorilla/websocket/compare/v1.4.0...v1.4.2)
- github.com/karrick/godirwalk: [v1.7.5 → v1.16.1](https://github.com/karrick/godirwalk/compare/v1.7.5...v1.16.1)
- github.com/opencontainers/runc: [819fcc6 → v1.0.0-rc92](https://github.com/opencontainers/runc/compare/819fcc6...v1.0.0-rc92)
- github.com/opencontainers/runtime-spec: [237cc4f → 4d89ac9](https://github.com/opencontainers/runtime-spec/compare/237cc4f...4d89ac9)
- github.com/opencontainers/selinux: [v1.5.2 → v1.6.0](https://github.com/opencontainers/selinux/compare/v1.5.2...v1.6.0)
- github.com/prometheus/procfs: [v0.1.3 → v0.2.0](https://github.com/prometheus/procfs/compare/v0.1.3...v0.2.0)
- github.com/quobyte/api: [v0.1.2 → v0.1.8](https://github.com/quobyte/api/compare/v0.1.2...v0.1.8)
- github.com/spf13/cobra: [v1.0.0 → v1.1.1](https://github.com/spf13/cobra/compare/v1.0.0...v1.1.1)
- github.com/spf13/viper: [v1.4.0 → v1.7.0](https://github.com/spf13/viper/compare/v1.4.0...v1.7.0)
- github.com/stretchr/testify: [v1.4.0 → v1.6.1](https://github.com/stretchr/testify/compare/v1.4.0...v1.6.1)
- github.com/vishvananda/netns: [52d707b → db3c7e5](https://github.com/vishvananda/netns/compare/52d707b...db3c7e5)
- go.opencensus.io: v0.22.2 → v0.22.3
- golang.org/x/exp: da58074 → 6cc2880
- golang.org/x/lint: fdd1cda → 738671d
- golang.org/x/net: ab34263 → 69a7880
- golang.org/x/oauth2: 858c2ad → bf48bf1
- golang.org/x/sys: ed371f2 → 5cba982
- golang.org/x/text: v0.3.3 → v0.3.4
- golang.org/x/time: 555d28b → 3af7569
- golang.org/x/xerrors: 9bdfabe → 5ec99f8
- google.golang.org/api: v0.15.1 → v0.20.0
- google.golang.org/genproto: cb27e3a → 8816d57
- google.golang.org/grpc: v1.27.0 → v1.27.1
- google.golang.org/protobuf: v1.24.0 → v1.25.0
- honnef.co/go/tools: v0.0.1-2019.2.3 → v0.0.1-2020.1.3
- k8s.io/gengo: 8167cfd → 83324d8
- k8s.io/klog/v2: v2.2.0 → v2.4.0
- k8s.io/kube-openapi: 8b50664 → d219536
- k8s.io/utils: d5654de → 67b214c
- sigs.k8s.io/apiserver-network-proxy/konnectivity-client: v0.0.12 → v0.0.14
- sigs.k8s.io/structured-merge-diff/v4: b3cf1e8 → v4.0.2

### Removed
- github.com/armon/consul-api: [eb2c6b5](https://github.com/armon/consul-api/tree/eb2c6b5)
- github.com/go-ini/ini: [v1.9.0](https://github.com/go-ini/ini/tree/v1.9.0)
- github.com/ugorji/go: [v1.1.4](https://github.com/ugorji/go/tree/v1.1.4)
- github.com/xordataexchange/crypt: [b2862e3](https://github.com/xordataexchange/crypt/tree/b2862e3)



# v1.20.0-beta.1


## Downloads for v1.20.0-beta.1

### Source Code

filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.20.0-beta.1/kubernetes.tar.gz) | 4eddf4850c2d57751696f352d0667309339090aeb30ff93e8db8a22c6cdebf74cb2d5dc78d4ae384c4e25491efc39413e2e420a804b76b421a9ad934e56b0667
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.20.0-beta.1/kubernetes-src.tar.gz) | 59de5221162e9b6d88f5abbdb99765cb2b2e501498ea853fb65f2abe390211e28d9f21e0d87be3ade550a5ea6395d04552cf093d2ce2f99fd45ad46545dd13cb

### Client binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.20.0-beta.1/kubernetes-client-darwin-amd64.tar.gz) | d69ffed19b034a4221fc084e43ac293cf392e98febf5bf580f8d92307a8421d8b3aab18f9ca70608937e836b42c7a34e829f88eba6e040218a4486986e2fca21
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.20.0-beta.1/kubernetes-client-linux-386.tar.gz) | 1b542e165860c4adcd4550adc19b86c3db8cd75d2a1b8db17becc752da78b730ee48f1b0aaf8068d7bfbb1d8e023741ec293543bc3dd0f4037172a6917db8169
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.20.0-beta.1/kubernetes-client-linux-amd64.tar.gz) | 90ad52785eecb43a6f9035b92b6ba39fc84e67f8bc91cf098e70f8cfdd405c4b9d5c02dccb21022f21bb5b6ce92fdef304def1da0a7255c308e2c5fb3a9cdaab
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.20.0-beta.1/kubernetes-client-linux-arm.tar.gz) | d0cb3322b056e1821679afa70728ffc0d3375e8f3326dabbe8185be2e60f665ab8985b13a1a432e10281b84a929e0f036960253ac0dd6e0b44677d539e98e61b
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.20.0-beta.1/kubernetes-client-linux-arm64.tar.gz) | 3aecc8197e0aa368408624add28a2dd5e73f0d8a48e5e33c19edf91d5323071d16a27353a6f3e22df4f66ed7bfbae8e56e0a9050f7bbdf927ce6aeb29bba6374
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.20.0-beta.1/kubernetes-client-linux-ppc64le.tar.gz) | 6ff145058f62d478b98f1e418e272555bfb5c7861834fbbf10a8fb334cc7ff09b32f2666a54b230932ba71d2fc7d3b1c1f5e99e6fe6d6ec83926a9b931cd2474
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.20.0-beta.1/kubernetes-client-linux-s390x.tar.gz) | ff7b8bb894076e05a3524f6327a4a6353b990466f3292e84c92826cb64b5c82b3855f48b8e297ccadc8bcc15552bc056419ff6ff8725fc4e640828af9cc1331b
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.20.0-beta.1/kubernetes-client-windows-386.tar.gz) | 6c6dcac9c725605763a130b5a975f2b560aa976a5c809d4e0887900701b707baccb9ca1aebc10a03cfa7338a6f42922bbf838ccf6800fc2a3e231686a72568b6
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.20.0-beta.1/kubernetes-client-windows-amd64.tar.gz) | d12e3a29c960f0ddd1b9aabf5426ac1259863ac6c8f2be1736ebeb57ddca6b1c747ee2c363be19e059e38cf71488c5ea3509ad4d0e67fd5087282a5ad0ae9a48

### Server binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.20.0-beta.1/kubernetes-server-linux-amd64.tar.gz) | 904e8c049179e071c6caa65f525f465260bb4d4318a6dd9cc05be2172f39f7cfc69d1672736e01d926045764fe8872e806444e3af77ffef823ede769537b7d20
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.20.0-beta.1/kubernetes-server-linux-arm.tar.gz) | 5934959374868aed8d4294de84411972660bca7b2e952201a9403f37e40c60a5c53eaea8001344d0bf4a00c8cd27de6324d88161388de27f263a5761357cb82b
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.20.0-beta.1/kubernetes-server-linux-arm64.tar.gz) | 4c884585970f80dc5462d9a734d7d5be9558b36c6e326a8a3139423efbd7284fa9f53fb077983647e17e19f03f5cb9bf26201450c78daecf10afa5a1ab5f9efc
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.20.0-beta.1/kubernetes-server-linux-ppc64le.tar.gz) | 235b78b08440350dcb9f13b63f7722bd090c672d8e724ca5d409256e5a5d4f46d431652a1aa908c3affc5b1e162318471de443d38b93286113e79e7f90501a9b
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.20.0-beta.1/kubernetes-server-linux-s390x.tar.gz) | 220fc9351702b3ecdcf79089892ceb26753a8a1deaf46922ffb3d3b62b999c93fef89440e779ca6043372b963081891b3a966d1a5df0cf261bdd44395fd28dce

### Node binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.20.0-beta.1/kubernetes-node-linux-amd64.tar.gz) | fe59d3a1f21c47bab126f689687657f77fbcb46a2caeef48eecd073b2b22879f997a466911b5c5c829e9cf27e68a36ecdf18686d42714839d4b97d6c7281578d
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.20.0-beta.1/kubernetes-node-linux-arm.tar.gz) | 93e545aa963cfd11e0b2c6d47669b5ef70c5a86ef80c3353c1a074396bff1e8e7371dda25c39d78c7a9e761f2607b8b5ab843fa0c10b8ff9663098fae8d25725
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.20.0-beta.1/kubernetes-node-linux-arm64.tar.gz) | 5e0f177f9bec406a668d4b37e69b191208551fdf289c82b5ec898959da4f8a00a2b0695cbf1d2de5acb809321c6e5604f5483d33556543d92b96dcf80e814dd3
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.20.0-beta.1/kubernetes-node-linux-ppc64le.tar.gz) | 574412059e4d257eb904cd4892a075b6a2cde27adfa4976ee64c46d6768facece338475f1b652ad94c8df7cfcbb70ebdf0113be109c7099ab76ffdb6f023eefd
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.20.0-beta.1/kubernetes-node-linux-s390x.tar.gz) | b1ffaa6d7f77d89885c642663cb14a86f3e2ec2afd223e3bb2000962758cf0f15320969ffc4be93b5826ff22d54fdbae0dbea09f9d8228eda6da50b6fdc88758
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.20.0-beta.1/kubernetes-node-windows-amd64.tar.gz) | 388983765213cf3bdc1f8b27103ed79e39028767e5f1571e35ed1f91ed100e49f3027f7b7ff19b53fab7fbb6d723c0439f21fc6ed62be64532c25f5bfa7ee265

## Changelog since v1.20.0-beta.0

## Changes by Kind

### Deprecation

- ACTION REQUIRED: The kube-apiserver ability to serve on an insecure port, deprecated since v1.10, has been removed. The insecure address flags `--address` and `--insecure-bind-address` have no effect in kube-apiserver and will be removed in v1.24. The insecure port flags `--port` and `--insecure-port` may only be set to 0 and will be removed in v1.24. ([#95856](https://github.com/kubernetes/kubernetes/pull/95856), [@knight42](https://github.com/knight42)) [SIG API Machinery, Node and Testing]

### API Change

- + `TokenRequest` and `TokenRequestProjection` features have been promoted to GA. This feature allows generating service account tokens that are not visible in Secret objects and are tied to the lifetime of a Pod object. See https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/#service-account-token-volume-projection for details on configuring and using this feature. The `TokenRequest` and `TokenRequestProjection` feature gates will be removed in v1.21.
  + kubeadm's kube-apiserver Pod manifest now includes the following flags by default "--service-account-key-file", "--service-account-signing-key-file", "--service-account-issuer". ([#93258](https://github.com/kubernetes/kubernetes/pull/93258), [@zshihang](https://github.com/zshihang)) [SIG API Machinery, Auth, Cluster Lifecycle, Storage and Testing]
- Certain fields on  Service objects will be automatically cleared when changing the service's `type` to a mode that does not need those fields.  For example, changing from type=LoadBalancer to type=ClusterIP will clear the NodePort assignments, rather than forcing the user to clear them. ([#95196](https://github.com/kubernetes/kubernetes/pull/95196), [@thockin](https://github.com/thockin)) [SIG API Machinery, Apps, Network and Testing]
- Services will now have a `clusterIPs` field to go with `clusterIP`.  `clusterIPs[0]` is a synonym for `clusterIP` and will be syncronized on create and update operations. ([#95894](https://github.com/kubernetes/kubernetes/pull/95894), [@thockin](https://github.com/thockin)) [SIG Network]

### Feature

- A new metric `apiserver_request_filter_duration_seconds` has been introduced that 
  measures request filter latency in seconds. ([#95207](https://github.com/kubernetes/kubernetes/pull/95207), [@tkashem](https://github.com/tkashem)) [SIG API Machinery and Instrumentation]
- Add a new flag to set priority for the kubelet on Windows nodes so that workloads cannot overwhelm the node there by disrupting kubelet process. ([#96051](https://github.com/kubernetes/kubernetes/pull/96051), [@ravisantoshgudimetla](https://github.com/ravisantoshgudimetla)) [SIG Node and Windows]
- Changed: default "Accept: */*" header added to HTTP probes. See https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/#http-probes (https://github.com/kubernetes/website/pull/24756) ([#95641](https://github.com/kubernetes/kubernetes/pull/95641), [@fonsecas72](https://github.com/fonsecas72)) [SIG Network and Node]
- Client-go credential plugins can now be passed in the current cluster information via the KUBERNETES_EXEC_INFO environment variable. ([#95489](https://github.com/kubernetes/kubernetes/pull/95489), [@ankeesler](https://github.com/ankeesler)) [SIG API Machinery and Auth]
- Kube-apiserver: added support for compressing rotated audit log files with `--audit-log-compress` ([#94066](https://github.com/kubernetes/kubernetes/pull/94066), [@lojies](https://github.com/lojies)) [SIG API Machinery and Auth]

### Documentation

- Fake dynamic client: document that List does not preserve TypeMeta in UnstructuredList ([#95117](https://github.com/kubernetes/kubernetes/pull/95117), [@andrewsykim](https://github.com/andrewsykim)) [SIG API Machinery]

### Bug or Regression

- Added support to kube-proxy for externalTrafficPolicy=Local setting via Direct Server Return (DSR) load balancers on Windows. ([#93166](https://github.com/kubernetes/kubernetes/pull/93166), [@elweb9858](https://github.com/elweb9858)) [SIG Network]
- Disable watchcache for events ([#96052](https://github.com/kubernetes/kubernetes/pull/96052), [@wojtek-t](https://github.com/wojtek-t)) [SIG API Machinery]
- Disabled `LocalStorageCapacityIsolation` feature gate is honored during scheduling. ([#96092](https://github.com/kubernetes/kubernetes/pull/96092), [@Huang-Wei](https://github.com/Huang-Wei)) [SIG Scheduling]
- Fix bug in JSON path parser where an error occurs when a range is empty ([#95933](https://github.com/kubernetes/kubernetes/pull/95933), [@brianpursley](https://github.com/brianpursley)) [SIG API Machinery]
- Fix k8s.io/apimachinery/pkg/api/meta.SetStatusCondition to update ObservedGeneration ([#95961](https://github.com/kubernetes/kubernetes/pull/95961), [@KnicKnic](https://github.com/KnicKnic)) [SIG API Machinery]
- Fixed a regression which prevented pods with `docker/default` seccomp annotations from being created in 1.19 if a PodSecurityPolicy was in place which did not allow `runtime/default` seccomp profiles. ([#95985](https://github.com/kubernetes/kubernetes/pull/95985), [@saschagrunert](https://github.com/saschagrunert)) [SIG Auth]
- Kubectl: print error if users place flags before plugin name ([#92343](https://github.com/kubernetes/kubernetes/pull/92343), [@knight42](https://github.com/knight42)) [SIG CLI]
- When creating a PVC with the volume.beta.kubernetes.io/storage-provisioner annotation already set, the PV controller might have incorrectly deleted the newly provisioned PV instead of binding it to the PVC, depending on timing and system load. ([#95909](https://github.com/kubernetes/kubernetes/pull/95909), [@pohly](https://github.com/pohly)) [SIG Apps and Storage]

### Other (Cleanup or Flake)

- Kubectl: the `generator` flag of `kubectl autoscale` has been deprecated and has no effect, it will be removed in a feature release ([#92998](https://github.com/kubernetes/kubernetes/pull/92998), [@SataQiu](https://github.com/SataQiu)) [SIG CLI]
- V1helpers.MatchNodeSelectorTerms now accepts just a Node and a list of Terms ([#95871](https://github.com/kubernetes/kubernetes/pull/95871), [@damemi](https://github.com/damemi)) [SIG Apps, Scheduling and Storage]
- `MatchNodeSelectorTerms` function moved to `k8s.io/component-helpers` ([#95531](https://github.com/kubernetes/kubernetes/pull/95531), [@damemi](https://github.com/damemi)) [SIG Apps, Scheduling and Storage]

## Dependencies

### Added
_Nothing has changed._

### Changed
_Nothing has changed._

### Removed
_Nothing has changed._



# v1.20.0-beta.0


## Downloads for v1.20.0-beta.0

### Source Code

filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.20.0-beta.0/kubernetes.tar.gz) | 385e49e32bbd6996f07bcadbf42285755b8a8ef9826ee1ba42bd82c65827cf13f63e5634b834451b263a93b708299cbb4b4b0b8ddbc688433deaf6bec240aa67
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.20.0-beta.0/kubernetes-src.tar.gz) | 842e80f6dcad461426fb699de8a55fde8621d76a94e54288fe9939cc1a3bbd0f4799abadac2c59bcf3f91d743726dbd17e1755312ae7fec482ef560f336dbcbb

### Client binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.20.0-beta.0/kubernetes-client-darwin-amd64.tar.gz) | bde5e7d9ee3e79d1e69465a3ddb4bb36819a4f281b5c01a7976816d7c784410812dde133cdf941c47e5434e9520701b9c5e8b94d61dca77c172f87488dfaeb26
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.20.0-beta.0/kubernetes-client-linux-386.tar.gz) | 721bb8444c9e0d7a9f8461e3f5428882d76fcb3def6eb11b8e8e08fae7f7383630699248660d69d4f6a774124d6437888666e1fa81298d5b5518bc4a6a6b2c92
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.20.0-beta.0/kubernetes-client-linux-amd64.tar.gz) | 71e4edc41afbd65f813e7ecbc22b27c95f248446f005e288d758138dc4cc708735be7218af51bcf15e8b9893a3598c45d6a685f605b46f50af3762b02c32ed76
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.20.0-beta.0/kubernetes-client-linux-arm.tar.gz) | bbefc749156f63898973f2f7c7a6f1467481329fb430d641fe659b497e64d679886482d557ebdddb95932b93de8d1e3e365c91d4bf9f110b68bd94b0ba702ded
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.20.0-beta.0/kubernetes-client-linux-arm64.tar.gz) | 9803190685058b4b64d002c2fbfb313308bcea4734ed53a8c340cfdae4894d8cb13b3e819ae64051bafe0fbf8b6ecab53a6c1dcf661c57640c75b0eb60041113
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.20.0-beta.0/kubernetes-client-linux-ppc64le.tar.gz) | bcdceea64cba1ae38ea2bab50d8fd77c53f6d673de12566050b0e3c204334610e6c19e4ace763e68b5e48ab9e811521208b852b1741627be30a2b17324fc1daf
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.20.0-beta.0/kubernetes-client-linux-s390x.tar.gz) | 41e36d00867e90012d5d5adfabfaae8d9f5a9fd32f290811e3c368e11822916b973afaaf43961081197f2cbab234090d97d89774e674aeadc1da61f7a64708a9
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.20.0-beta.0/kubernetes-client-windows-386.tar.gz) | c50fec5aec2d0e742f851f25c236cb73e76f8fc73b0908049a10ae736c0205b8fff83eb3d29b1748412edd942da00dd738195d9003f25b577d6af8359d84fb2f
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.20.0-beta.0/kubernetes-client-windows-amd64.tar.gz) | 0fd6777c349908b6d627e849ea2d34c048b8de41f7df8a19898623f597e6debd35b7bcbf8e1d43a1be3a9abb45e4810bc498a0963cf780b109e93211659e9c7e

### Server binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.20.0-beta.0/kubernetes-server-linux-amd64.tar.gz) | 30d982424ca64bf0923503ae8195b2e2a59497096b2d9e58dfd491cd6639633027acfa9750bc7bccf34e1dc116d29d2f87cbd7ae713db4210ce9ac16182f0576
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.20.0-beta.0/kubernetes-server-linux-arm.tar.gz) | f08b62be9bc6f0745f820b0083c7a31eedb2ce370a037c768459a59192107b944c8f4345d0bb88fc975f2e7a803ac692c9ac3e16d4a659249d4600e84ff75d9e
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.20.0-beta.0/kubernetes-server-linux-arm64.tar.gz) | e3472b5b3dfae0a56e5363d52062b1e4a9fc227a05e0cf5ece38233b2c442f427970aab94a52377fb87e583663c120760d154bc1c4ac22dca1f4d0d1ebb96088
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.20.0-beta.0/kubernetes-server-linux-ppc64le.tar.gz) | 06c254e0a62f755d31bc40093d86c44974f0a60308716cc3214a6b3c249a4d74534d909b82f8a3dd3a3c9720e61465b45d2bb3a327ef85d3caba865750020dfb
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.20.0-beta.0/kubernetes-server-linux-s390x.tar.gz) | 2edeb4411c26a0de057a66787091ab1044f71774a464aed898ffee26634a40127181c2edddb38e786b6757cca878fd0c3a885880eec6c3448b93c645770abb12

### Node binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.20.0-beta.0/kubernetes-node-linux-amd64.tar.gz) | cc1d5b94b86070b5e7746d7aaeaeac3b3a5e5ebbff1ec33885f7eeab270a6177d593cb1975b2e56f4430b7859ad42da76f266629f9313e0f688571691ac448ed
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.20.0-beta.0/kubernetes-node-linux-arm.tar.gz) | 75e82c7c9122add3b24695b94dcb0723c52420c3956abf47511e37785aa48a1fa8257db090c6601010c4475a325ccfff13eb3352b65e3aa1774f104b09b766b0
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.20.0-beta.0/kubernetes-node-linux-arm64.tar.gz) | 16ef27c40bf4d678a55fcd3d3f7d09f1597eec2cc58f9950946f0901e52b82287be397ad7f65e8d162d8a9cdb4a34a610b6db8b5d0462be8e27c4b6eb5d6e5e7
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.20.0-beta.0/kubernetes-node-linux-ppc64le.tar.gz) | 939865f2c4cb6a8934f22a06223e416dec5f768ffc1010314586149470420a1d62aef97527c34d8a636621c9669d6489908ce1caf96f109e8d073cee1c030b50
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.20.0-beta.0/kubernetes-node-linux-s390x.tar.gz) | bbfdd844075fb816079af7b73d99bc1a78f41717cdbadb043f6f5872b4dc47bc619f7f95e2680d4b516146db492c630c17424e36879edb45e40c91bc2ae4493c
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.20.0-beta.0/kubernetes-node-windows-amd64.tar.gz) | a2b3ea40086fd71aed71a4858fd3fc79fd1907bc9ea8048ff3c82ec56477b0a791b724e5a52d79b3b36338c7fbd93dfd3d03b00ccea9042bda0d270fc891e4ec

## Changelog since v1.20.0-alpha.3

## Urgent Upgrade Notes

### (No, really, you MUST read this before you upgrade)

 - Kubeadm: improve the validation of serviceSubnet and podSubnet.
  ServiceSubnet has to be limited in size, due to implementation details, and the mask can not allocate more than 20 bits.
  PodSubnet validates against the corresponding cluster "--node-cidr-mask-size" of the kube-controller-manager, it fail if the values are not compatible.
  kubeadm no longer sets the node-mask automatically on IPv6 deployments, you must check that your IPv6 service subnet mask is compatible with the default node mask /64 or set it accordenly. 
  Previously, for IPv6, if the podSubnet had a mask lower than /112, kubeadm calculated a node-mask to be multiple of eight and splitting the available bits to maximise the number used for nodes. ([#95723](https://github.com/kubernetes/kubernetes/pull/95723), [@aojea](https://github.com/aojea)) [SIG Cluster Lifecycle]
  - Windows hyper-v container featuregate is deprecated in 1.20 and will be removed in 1.21 ([#95505](https://github.com/kubernetes/kubernetes/pull/95505), [@wawa0210](https://github.com/wawa0210)) [SIG Node and Windows]
 
## Changes by Kind

### Deprecation

- Support 'controlplane' as a valid EgressSelection type in the EgressSelectorConfiguration API. 'Master' is deprecated and will be removed in v1.22. ([#95235](https://github.com/kubernetes/kubernetes/pull/95235), [@andrewsykim](https://github.com/andrewsykim)) [SIG API Machinery]

### API Change

- Add dual-stack Services (alpha).  This is a BREAKING CHANGE to an alpha API.
  It changes the dual-stack API wrt Service from a single ipFamily field to 3
  fields: ipFamilyPolicy (SingleStack, PreferDualStack, RequireDualStack),
  ipFamilies (a list of families assigned), and clusterIPs (inclusive of
  clusterIP).  Most users do not need to set anything at all, defaulting will
  handle it for them.  Services are single-stack unless the user asks for
  dual-stack.  This is all gated by the "IPv6DualStack" feature gate. ([#91824](https://github.com/kubernetes/kubernetes/pull/91824), [@khenidak](https://github.com/khenidak)) [SIG API Machinery, Apps, CLI, Network, Node, Scheduling and Testing]
- Introduces a metric source for HPAs which allows scaling based on container resource usage. ([#90691](https://github.com/kubernetes/kubernetes/pull/90691), [@arjunrn](https://github.com/arjunrn)) [SIG API Machinery, Apps, Autoscaling and CLI]

### Feature

- Add a metric for time taken to perform recursive permission change ([#95866](https://github.com/kubernetes/kubernetes/pull/95866), [@JornShen](https://github.com/JornShen)) [SIG Instrumentation and Storage]
- Allow cross compilation of kubernetes on different platforms. ([#94403](https://github.com/kubernetes/kubernetes/pull/94403), [@bnrjee](https://github.com/bnrjee)) [SIG Release]
- Command to start network proxy changes from 'KUBE_ENABLE_EGRESS_VIA_KONNECTIVITY_SERVICE ./cluster/kube-up.sh' to 'KUBE_ENABLE_KONNECTIVITY_SERVICE=true ./hack/kube-up.sh' ([#92669](https://github.com/kubernetes/kubernetes/pull/92669), [@Jefftree](https://github.com/Jefftree)) [SIG Cloud Provider]
- DefaultPodTopologySpread graduated to Beta. The feature gate is enabled by default. ([#95631](https://github.com/kubernetes/kubernetes/pull/95631), [@alculquicondor](https://github.com/alculquicondor)) [SIG Scheduling and Testing]
- Kubernetes E2E test image manifest lists now contain Windows images. ([#77398](https://github.com/kubernetes/kubernetes/pull/77398), [@claudiubelu](https://github.com/claudiubelu)) [SIG Testing and Windows]
- Support for Windows container images (OS Versions: 1809, 1903, 1909, 2004) was added the pause:3.4 image. ([#91452](https://github.com/kubernetes/kubernetes/pull/91452), [@claudiubelu](https://github.com/claudiubelu)) [SIG Node, Release and Windows]

### Documentation

- Fake dynamic client: document that List does not preserve TypeMeta in UnstructuredList ([#95117](https://github.com/kubernetes/kubernetes/pull/95117), [@andrewsykim](https://github.com/andrewsykim)) [SIG API Machinery]

### Bug or Regression

- Exposes and sets a default timeout for the SubjectAccessReview client for DelegatingAuthorizationOptions. ([#95725](https://github.com/kubernetes/kubernetes/pull/95725), [@p0lyn0mial](https://github.com/p0lyn0mial)) [SIG API Machinery and Cloud Provider]
- Alter wording to describe pods using a pvc ([#95635](https://github.com/kubernetes/kubernetes/pull/95635), [@RaunakShah](https://github.com/RaunakShah)) [SIG CLI]
- If we set SelectPolicy MinPolicySelect on scaleUp behavior or scaleDown behavior,Horizontal Pod Autoscaler doesn`t automatically scale the number of pods correctly ([#95647](https://github.com/kubernetes/kubernetes/pull/95647), [@JoshuaAndrew](https://github.com/JoshuaAndrew)) [SIG Apps and Autoscaling]
- Ignore apparmor for non-linux operating systems ([#93220](https://github.com/kubernetes/kubernetes/pull/93220), [@wawa0210](https://github.com/wawa0210)) [SIG Node and Windows]
- Ipvs: ensure selected scheduler kernel modules are loaded ([#93040](https://github.com/kubernetes/kubernetes/pull/93040), [@cmluciano](https://github.com/cmluciano)) [SIG Network]
- Kubeadm: add missing "--experimental-patches" flag to "kubeadm init phase control-plane" ([#95786](https://github.com/kubernetes/kubernetes/pull/95786), [@Sh4d1](https://github.com/Sh4d1)) [SIG Cluster Lifecycle]
- Reorganized iptables rules to fix a performance issue ([#95252](https://github.com/kubernetes/kubernetes/pull/95252), [@tssurya](https://github.com/tssurya)) [SIG Network]
- Unhealthy pods covered by PDBs can be successfully evicted if enough healthy pods are available. ([#94381](https://github.com/kubernetes/kubernetes/pull/94381), [@michaelgugino](https://github.com/michaelgugino)) [SIG Apps]
- Update the PIP when it is not in the Succeeded provisioning state during the LB update. ([#95748](https://github.com/kubernetes/kubernetes/pull/95748), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]
- Update the frontend IP config when the service's `pipName` annotation is changed ([#95813](https://github.com/kubernetes/kubernetes/pull/95813), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]

### Other (Cleanup or Flake)

- NO ([#95690](https://github.com/kubernetes/kubernetes/pull/95690), [@nikhita](https://github.com/nikhita)) [SIG Release]

## Dependencies

### Added
- github.com/form3tech-oss/jwt-go: [v3.2.2+incompatible](https://github.com/form3tech-oss/jwt-go/tree/v3.2.2)

### Changed
- github.com/Azure/go-autorest/autorest/adal: [v0.9.0 → v0.9.5](https://github.com/Azure/go-autorest/autorest/adal/compare/v0.9.0...v0.9.5)
- github.com/Azure/go-autorest/autorest/mocks: [v0.4.0 → v0.4.1](https://github.com/Azure/go-autorest/autorest/mocks/compare/v0.4.0...v0.4.1)
- golang.org/x/crypto: 75b2880 → 7f63de1

### Removed
_Nothing has changed._



# v1.20.0-alpha.3


## Downloads for v1.20.0-alpha.3

### Source Code

filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.20.0-alpha.3/kubernetes.tar.gz) | 542cc9e0cd97732020491456402b6e2b4f54f2714007ee1374a7d363663a1b41e82b50886176a5313aaccfbfd4df2bc611d6b32d19961cdc98b5821b75d6b17c
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.20.0-alpha.3/kubernetes-src.tar.gz) | 5e5d725294e552fd1d14fd6716d013222827ac2d4e2d11a7a1fdefb77b3459bbeb69931f38e1597de205dd32a1c9763ab524c2af1551faef4f502ef0890f7fbf

### Client binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.3/kubernetes-client-darwin-amd64.tar.gz) | 60004939727c75d0f06adc4449e16b43303941937c0e9ea9aca7d947e93a5aed5d11e53d1fc94caeb988be66d39acab118d406dc2d6cead61181e1ced6d2be1a
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.20.0-alpha.3/kubernetes-client-linux-386.tar.gz) | 7edba9c4f1bf38fdf1fa5bff2856c05c0e127333ce19b17edf3119dc9b80462c027404a1f58a5eabf1de73a8f2f20aced043dda1fafd893619db1a188cda550c
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.3/kubernetes-client-linux-amd64.tar.gz) | db1818aa82d072cb3e32a2a988e66d76ecf7cebc6b8a29845fa2d6ec27f14a36e4b9839b1b7ed8c43d2da9cde00215eb672a7e8ee235d2e3107bc93c22e58d38
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.20.0-alpha.3/kubernetes-client-linux-arm.tar.gz) | d2922e70d22364b1f5a1e94a0c115f849fe2575b231b1ba268f73a9d86fc0a9fbb78dc713446839a2593acf1341cb5a115992f350870f13c1a472bb107b75af7
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.3/kubernetes-client-linux-arm64.tar.gz) | 2e3ae20e554c7d4fc3a8afdfcafe6bbc81d4c5e9aea036357baac7a3fdc2e8098aa8a8c3dded3951667d57f667ce3fbf37ec5ae5ceb2009a569dc9002d3a92f9
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.20.0-alpha.3/kubernetes-client-linux-ppc64le.tar.gz) | b54a34e572e6a86221577de376e6f7f9fcd82327f7fe94f2fc8d21f35d302db8a0f3d51e60dc89693999f5df37c96d0c3649a29f07f095efcdd59923ae285c95
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.20.0-alpha.3/kubernetes-client-linux-s390x.tar.gz) | 5be1b70dc437d3ba88cb0b89cd1bc555f79896c3f5b5f4fa0fb046a0d09d758b994d622ebe5cef8e65bba938c5ae945b81dc297f9dfa0d98f82ea75f344a3a0d
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.20.0-alpha.3/kubernetes-client-windows-386.tar.gz) | 88cf3f66168ef3bf9a5d3d2275b7f33799406e8205f2c202997ebec23d449aa4bb48b010356ab1cf52ff7b527b8df7c8b9947a43a82ebe060df83c3d21b7223a
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.3/kubernetes-client-windows-amd64.tar.gz) | 87d2d4ea1829da8cfa1a705a03ea26c759a03bd1c4d8b96f2c93264c4d172bb63a91d9ddda65cdc5478b627c30ae8993db5baf8be262c157d83bffcebe85474e

### Server binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.3/kubernetes-server-linux-amd64.tar.gz) | 7af691fc0b13a937797912374e3b3eeb88d5262e4eb7d4ebe92a3b64b3c226cb049aedfd7e39f639f6990444f7bcf2fe58699cf0c29039daebe100d7eebf60de
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.20.0-alpha.3/kubernetes-server-linux-arm.tar.gz) | 557c47870ecf5c2090b2694c8f0c8e3b4ca23df5455a37945bd037bc6fb5b8f417bf737bb66e6336b285112cb52de0345240fdb2f3ce1c4fb335ca7ef1197f99
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.3/kubernetes-server-linux-arm64.tar.gz) | 981de6cf7679d743cdeef1e894314357b68090133814801870504ef30564e32b5675e270db20961e9a731e35241ad9b037bdaf749da87b6c4ce8889eeb1c5855
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.20.0-alpha.3/kubernetes-server-linux-ppc64le.tar.gz) | 506578a21601ccff609ae757a55e68634c15cbfecbf13de972c96b32a155ded29bd71aee069c77f5f721416672c7a7ac0b8274de22bfd28e1ecae306313d96c5
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.20.0-alpha.3/kubernetes-server-linux-s390x.tar.gz) | af0cdcd4a77a7cc8060a076641615730a802f1f02dab084e41926023489efec6102d37681c70ab0dbe7440cd3e72ea0443719a365467985360152b9aae657375

### Node binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.3/kubernetes-node-linux-amd64.tar.gz) | 2d92c61596296279de1efae23b2b707415565d9d50cd61a7231b8d10325732b059bcb90f3afb36bef2575d203938c265572721e38df408e8792d3949523bd5d9
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.20.0-alpha.3/kubernetes-node-linux-arm.tar.gz) | c298de9b5ac1b8778729a2d8e2793ff86743033254fbc27014333880b03c519de81691caf03aa418c729297ee8942ce9ec89d11b0e34a80576b9936015dc1519
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.3/kubernetes-node-linux-arm64.tar.gz) | daa3c65afda6d7aff206c1494390bbcc205c2c6f8db04c10ca967a690578a01c49d49c6902b85e7158f79fd4d2a87c5d397d56524a75991c9d7db85ac53059a7
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.20.0-alpha.3/kubernetes-node-linux-ppc64le.tar.gz) | 05661908bb73bfcaf9c2eae96e9a6a793db5a7a100bce6df9e057985dd53a7a5248d72e81b6d13496bd38b9326c17cdb2edaf0e982b6437507245fb846e1efc6
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.20.0-alpha.3/kubernetes-node-linux-s390x.tar.gz) | 845e518e2c4ef0cef2c3b58f0b9ea5b5fe9b8a249717f789607752484c424c26ae854b263b7c0a004a8426feb9aa3683c177a9ed2567e6c3521f4835ea08c24a
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.3/kubernetes-node-windows-amd64.tar.gz) | 530e536574ed2c3e5973d3c0f0fdd2b4d48ef681a7a7c02db13e605001669eeb4f4b8a856fc08fc21436658c27b377f5d04dbcb3aae438098abc953b6eaf5712

## Changelog since v1.20.0-alpha.2

## Changes by Kind

### API Change

- New parameter `defaultingType` for `PodTopologySpread` plugin allows to use k8s defined or user provided default constraints ([#95048](https://github.com/kubernetes/kubernetes/pull/95048), [@alculquicondor](https://github.com/alculquicondor)) [SIG Scheduling]

### Feature

- Added new k8s.io/component-helpers repository providing shared helper code for (core) components. ([#92507](https://github.com/kubernetes/kubernetes/pull/92507), [@ingvagabund](https://github.com/ingvagabund)) [SIG Apps, Node, Release and Scheduling]
- Adds `create ingress` command to `kubectl` ([#78153](https://github.com/kubernetes/kubernetes/pull/78153), [@amimof](https://github.com/amimof)) [SIG CLI and Network]
- Kubectl create now supports creating ingress objects. ([#94327](https://github.com/kubernetes/kubernetes/pull/94327), [@rikatz](https://github.com/rikatz)) [SIG CLI and Network]
- New default scheduling plugins order reduces scheduling and preemption latency when taints and node affinity are used ([#95539](https://github.com/kubernetes/kubernetes/pull/95539), [@soulxu](https://github.com/soulxu)) [SIG Scheduling]
- SCTP support in API objects (Pod, Service, NetworkPolicy) is now GA.
  Note that this has no effect on whether SCTP is enabled on nodes at the kernel level,
  and note that some cloud platforms and network plugins do not support SCTP traffic. ([#95566](https://github.com/kubernetes/kubernetes/pull/95566), [@danwinship](https://github.com/danwinship)) [SIG Apps and Network]
- Scheduling Framework: expose Run[Pre]ScorePlugins functions to PreemptionHandle which can be used in PostFilter extention point. ([#93534](https://github.com/kubernetes/kubernetes/pull/93534), [@everpeace](https://github.com/everpeace)) [SIG Scheduling and Testing]
- SelectorSpreadPriority maps to PodTopologySpread plugin when DefaultPodTopologySpread feature is enabled ([#95448](https://github.com/kubernetes/kubernetes/pull/95448), [@alculquicondor](https://github.com/alculquicondor)) [SIG Scheduling]
- SetHostnameAsFQDN has been graduated to Beta and therefore it is enabled by default. ([#95267](https://github.com/kubernetes/kubernetes/pull/95267), [@javidiaz](https://github.com/javidiaz)) [SIG Node]

### Bug or Regression

- An issues preventing volume expand controller to annotate the PVC with `volume.kubernetes.io/storage-resizer` when the PVC StorageClass is already updated to the out-of-tree provisioner is now fixed. ([#94489](https://github.com/kubernetes/kubernetes/pull/94489), [@ialidzhikov](https://github.com/ialidzhikov)) [SIG API Machinery, Apps and Storage]
- Change the mount way from systemd to normal mount except ceph and glusterfs intree-volume. ([#94916](https://github.com/kubernetes/kubernetes/pull/94916), [@smileusd](https://github.com/smileusd)) [SIG Apps, Cloud Provider, Network, Node, Storage and Testing]
- Fix azure disk attach failure for disk size bigger than 4TB ([#95463](https://github.com/kubernetes/kubernetes/pull/95463), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider]
- Fix azure disk data loss issue on Windows when unmount disk ([#95456](https://github.com/kubernetes/kubernetes/pull/95456), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider and Storage]
- Fix verb & scope reporting for kube-apiserver metrics (LIST reported instead of GET) ([#95562](https://github.com/kubernetes/kubernetes/pull/95562), [@wojtek-t](https://github.com/wojtek-t)) [SIG API Machinery and Testing]
- Fix vsphere detach failure for static PVs ([#95447](https://github.com/kubernetes/kubernetes/pull/95447), [@gnufied](https://github.com/gnufied)) [SIG Cloud Provider and Storage]
- Fix: smb valid path error ([#95583](https://github.com/kubernetes/kubernetes/pull/95583), [@andyzhangx](https://github.com/andyzhangx)) [SIG Storage]
- Fixed a bug causing incorrect formatting of `kubectl describe ingress`. ([#94985](https://github.com/kubernetes/kubernetes/pull/94985), [@howardjohn](https://github.com/howardjohn)) [SIG CLI and Network]
- Fixed a bug in client-go where new clients with customized `Dial`, `Proxy`, `GetCert` config may get stale HTTP transports. ([#95427](https://github.com/kubernetes/kubernetes/pull/95427), [@roycaihw](https://github.com/roycaihw)) [SIG API Machinery]
- Fixes high CPU usage in kubectl drain ([#95260](https://github.com/kubernetes/kubernetes/pull/95260), [@amandahla](https://github.com/amandahla)) [SIG CLI]
- Support the node label `node.kubernetes.io/exclude-from-external-load-balancers` ([#95542](https://github.com/kubernetes/kubernetes/pull/95542), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]

### Other (Cleanup or Flake)

- Fix func name NewCreateCreateDeploymentOptions ([#91931](https://github.com/kubernetes/kubernetes/pull/91931), [@lixiaobing1](https://github.com/lixiaobing1)) [SIG CLI]
- Kubeadm: update the default pause image version to 1.4.0 on Windows. With this update the image supports Windows versions 1809 (2019LTS), 1903, 1909, 2004 ([#95419](https://github.com/kubernetes/kubernetes/pull/95419), [@jsturtevant](https://github.com/jsturtevant)) [SIG Cluster Lifecycle and Windows]
- Upgrade snapshot controller to 3.0.0 ([#95412](https://github.com/kubernetes/kubernetes/pull/95412), [@saikat-royc](https://github.com/saikat-royc)) [SIG Cloud Provider]
- Remove the dependency of csi-translation-lib module on apiserver/cloud-provider/controller-manager ([#95543](https://github.com/kubernetes/kubernetes/pull/95543), [@wawa0210](https://github.com/wawa0210)) [SIG Release]
- Scheduler framework interface moved from pkg/scheduler/framework/v1alpha to pkg/scheduler/framework ([#95069](https://github.com/kubernetes/kubernetes/pull/95069), [@farah](https://github.com/farah)) [SIG Scheduling, Storage and Testing]
- UDP and SCTP protocols can left stale connections that need to be cleared to avoid services disruption, but they can cause problems that are hard to debug.
  Kubernetes components using a loglevel greater or equal than 4 will log the conntrack operations and its output, to show the entries that were deleted. ([#95694](https://github.com/kubernetes/kubernetes/pull/95694), [@aojea](https://github.com/aojea)) [SIG Network]

## Dependencies

### Added
_Nothing has changed._

### Changed
_Nothing has changed._

### Removed
_Nothing has changed._



# v1.20.0-alpha.2


## Downloads for v1.20.0-alpha.2

### Source Code

filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.20.0-alpha.2/kubernetes.tar.gz) | 45089a4d26d56a5d613ecbea64e356869ac738eca3cc71d16b74ea8ae1b4527bcc32f1dc35ff7aa8927e138083c7936603faf063121d965a2f0f8ba28fa128d8
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.20.0-alpha.2/kubernetes-src.tar.gz) | 646edd890d6df5858b90aaf68cc6e1b4589b8db09396ae921b5c400f2188234999e6c9633906692add08c6e8b4b09f12b2099132b0a7533443fb2a01cfc2bf81

### Client binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.2/kubernetes-client-darwin-amd64.tar.gz) | c136273883e24a2a50b5093b9654f01cdfe57b97461d34885af4a68c2c4d108c07583c02b1cdf7f57f82e91306e542ce8f3bddb12fcce72b744458bc4796f8eb
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.20.0-alpha.2/kubernetes-client-linux-386.tar.gz) | 6ec59f1ed30569fa64ddb2d0de32b1ae04cda4ffe13f339050a7c9d7c63d425ee6f6d963dcf82c17281c4474da3eaf32c08117669052872a8c81bdce2c8a5415
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.2/kubernetes-client-linux-amd64.tar.gz) | 7b40a4c087e2ea7f8d055f297fcd39a3f1cb6c866e7a3981a9408c3c3eb5363c648613491aad11bc7d44d5530b20832f8f96f6ceff43deede911fb74aafad35f
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.20.0-alpha.2/kubernetes-client-linux-arm.tar.gz) | cda9955feebea5acb8f2b5b87895d24894bbbbde47041453b1f926ebdf47a258ce0496aa27d06bcbf365b5615ce68a20d659b64410c54227216726e2ee432fca
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.2/kubernetes-client-linux-arm64.tar.gz) | f65bd9241c7eb88a4886a285330f732448570aea4ededaebeabcf70d17ea185f51bf8a7218f146ee09fb1adceca7ee71fb3c3683834f2c415163add820fba96e
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.20.0-alpha.2/kubernetes-client-linux-ppc64le.tar.gz) | 1e377599af100a81d027d9199365fb8208d443a8e0a97affff1a79dc18796e14b78cb53d6e245c1c1e8defd0e050e37bf5f2a23c8a3ff45a6d18d03619709bf5
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.20.0-alpha.2/kubernetes-client-linux-s390x.tar.gz) | 1cdee81478246aa7e7b80ae4efc7f070a5b058083ae278f59fad088b75a8052761b0e15ab261a6e667ddafd6a69fb424fc307072ed47941cad89a85af7aee93d
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.20.0-alpha.2/kubernetes-client-windows-386.tar.gz) | d8774167c87b6844c348aa15e92d5033c528d6ab9e95d08a7cb22da68bafd8e46d442cf57a5f6affad62f674c10ae6947d524b94108b5e450ca78f92656d63c0
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.2/kubernetes-client-windows-amd64.tar.gz) | f664b47d8daa6036f8154c1dc1f881bfe683bf57c39d9b491de3848c03d051c50c6644d681baf7f9685eae45f9ce62e4c6dfea2853763cfe8256a61bdd59d894

### Server binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.2/kubernetes-server-linux-amd64.tar.gz) | d6fcb4600be0beb9de222a8da64c35fe22798a0da82d41401d34d0f0fc7e2817512169524c281423d8f4a007cd77452d966317d5a1b67d2717a05ff346e8aa7d
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.20.0-alpha.2/kubernetes-server-linux-arm.tar.gz) | 022a76cf10801f8afbabb509572479b68fdb4e683526fa0799cdbd9bab4d3f6ecb76d1d63d0eafee93e3edf6c12892d84b9c771ef2325663b95347728fa3d6c0
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.2/kubernetes-server-linux-arm64.tar.gz) | 0679aadd60bbf6f607e5befad74b5267eb2d4c1b55985cc25a97e0f4c5efb7acbb3ede91bfa6a5a5713dae4d7a302f6faaf678fd6b359284c33d9a6aca2a08bb
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.20.0-alpha.2/kubernetes-server-linux-ppc64le.tar.gz) | 9f2cfeed543b515eafb60d9765a3afff4f3d323c0a5c8a0d75e3de25985b2627817bfcbe59a9a61d969e026e2b861adb974a09eae75b58372ed736ceaaed2a82
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.20.0-alpha.2/kubernetes-server-linux-s390x.tar.gz) | 937258704d7b9dcd91f35f2d34ee9dd38c18d9d4e867408c05281bfbbb919ad012c95880bee84d2674761aa44cc617fb2fae1124cf63b689289286d6eac1c407

### Node binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.2/kubernetes-node-linux-amd64.tar.gz) | 076165d745d47879de68f4404eaf432920884be48277eb409e84bf2c61759633bf3575f46b0995f1fc693023d76c0921ed22a01432e756d7f8d9e246a243b126
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.20.0-alpha.2/kubernetes-node-linux-arm.tar.gz) | 1ff2e2e3e43af41118cdfb70c778e15035bbb1aca833ffd2db83c4bcd44f55693e956deb9e65017ebf3c553f2820ad5cd05f5baa33f3d63f3e00ed980ea4dfed
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.2/kubernetes-node-linux-arm64.tar.gz) | b232c7359b8c635126899beee76998078eec7a1ef6758d92bcdebe8013b0b1e4d7b33ecbf35e3f82824fe29493400845257e70ed63c1635bfa36c8b3b4969f6f
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.20.0-alpha.2/kubernetes-node-linux-ppc64le.tar.gz) | 51d415a068f554840f4c78d11a4fedebd7cb03c686b0ec864509b24f7a8667ebf54bb0a25debcf2b70f38be1e345e743f520695b11806539a55a3620ce21946f
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.20.0-alpha.2/kubernetes-node-linux-s390x.tar.gz) | b51c082d8af358233a088b632cf2f6c8cfe5421471c27f5dc9ba4839ae6ea75df25d84298f2042770097554c01742bb7686694b331ad9bafc93c86317b867728
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.2/kubernetes-node-windows-amd64.tar.gz) | 91b9d26620a2dde67a0edead0039814efccbdfd54594dda3597aaced6d89140dc92612ed0727bc21d63468efeef77c845e640153b09e39d8b736062e6eee0c76

## Changelog since v1.20.0-alpha.1

## Changes by Kind

### Deprecation

- Action-required: kubeadm: graduate the "kubeadm alpha certs" command to a parent command "kubeadm certs". The command "kubeadm alpha certs" is deprecated and will be removed in a future release. Please migrate. ([#94938](https://github.com/kubernetes/kubernetes/pull/94938), [@yagonobre](https://github.com/yagonobre)) [SIG Cluster Lifecycle]
- Action-required: kubeadm: remove the deprecated feature --experimental-kustomize from kubeadm commands. The feature was replaced with --experimental-patches in 1.19. To migrate see the --help description for the --experimental-patches flag. ([#94871](https://github.com/kubernetes/kubernetes/pull/94871), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Kubeadm: deprecate self-hosting support. The experimental command "kubeadm alpha self-hosting" is now deprecated and will be removed in a future release. ([#95125](https://github.com/kubernetes/kubernetes/pull/95125), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Removes deprecated scheduler metrics DeprecatedSchedulingDuration, DeprecatedSchedulingAlgorithmPredicateEvaluationSecondsDuration, DeprecatedSchedulingAlgorithmPriorityEvaluationSecondsDuration ([#94884](https://github.com/kubernetes/kubernetes/pull/94884), [@arghya88](https://github.com/arghya88)) [SIG Instrumentation and Scheduling]
- Scheduler alpha metrics binding_duration_seconds and scheduling_algorithm_preemption_evaluation_seconds are deprecated, Both of those metrics are now covered as part of framework_extension_point_duration_seconds, the former as a PostFilter the latter and a Bind plugin. The plan is to remove both in 1.21 ([#95001](https://github.com/kubernetes/kubernetes/pull/95001), [@arghya88](https://github.com/arghya88)) [SIG Instrumentation and Scheduling]

### API Change

- GPU metrics provided by kubelet are now disabled by default ([#95184](https://github.com/kubernetes/kubernetes/pull/95184), [@RenaudWasTaken](https://github.com/RenaudWasTaken)) [SIG Node]
- New parameter `defaultingType` for `PodTopologySpread` plugin allows to use k8s defined or user provided default constraints ([#95048](https://github.com/kubernetes/kubernetes/pull/95048), [@alculquicondor](https://github.com/alculquicondor)) [SIG Scheduling]
- Server Side Apply now treats LabelSelector fields as atomic (meaning the entire selector is managed by a single writer and updated together), since they contain interrelated and inseparable fields that do not merge in intuitive ways. ([#93901](https://github.com/kubernetes/kubernetes/pull/93901), [@jpbetz](https://github.com/jpbetz)) [SIG API Machinery, Auth, CLI, Cloud Provider, Cluster Lifecycle, Instrumentation, Network, Node, Storage and Testing]
- Status of v1beta1 CRDs without "preserveUnknownFields:false" will show violation "spec.preserveUnknownFields: Invalid value: true: must be false" ([#93078](https://github.com/kubernetes/kubernetes/pull/93078), [@vareti](https://github.com/vareti)) [SIG API Machinery]

### Feature

- Added `get-users` and `delete-user` to the `kubectl config` subcommand ([#89840](https://github.com/kubernetes/kubernetes/pull/89840), [@eddiezane](https://github.com/eddiezane)) [SIG CLI]
- Added counter metric "apiserver_request_self" to count API server self-requests with labels for verb, resource, and subresource. ([#94288](https://github.com/kubernetes/kubernetes/pull/94288), [@LogicalShark](https://github.com/LogicalShark)) [SIG API Machinery, Auth, Instrumentation and Scheduling]
- Added new k8s.io/component-helpers repository providing shared helper code for (core) components. ([#92507](https://github.com/kubernetes/kubernetes/pull/92507), [@ingvagabund](https://github.com/ingvagabund)) [SIG Apps, Node, Release and Scheduling]
- Adds `create ingress` command to `kubectl` ([#78153](https://github.com/kubernetes/kubernetes/pull/78153), [@amimof](https://github.com/amimof)) [SIG CLI and Network]
- Allow configuring AWS LoadBalancer health check protocol via service annotations ([#94546](https://github.com/kubernetes/kubernetes/pull/94546), [@kishorj](https://github.com/kishorj)) [SIG Cloud Provider]
- Azure: Support multiple services sharing one IP address ([#94991](https://github.com/kubernetes/kubernetes/pull/94991), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider]
- Ephemeral containers now apply the same API defaults as initContainers and containers ([#94896](https://github.com/kubernetes/kubernetes/pull/94896), [@wawa0210](https://github.com/wawa0210)) [SIG Apps and CLI]
- In dual-stack bare-metal clusters, you can now pass dual-stack IPs to `kubelet --node-ip`.
  eg: `kubelet --node-ip 10.1.0.5,fd01::0005`. This is not yet supported for non-bare-metal
  clusters.
  
  In dual-stack clusters where nodes have dual-stack addresses, hostNetwork pods
  will now get dual-stack PodIPs. ([#95239](https://github.com/kubernetes/kubernetes/pull/95239), [@danwinship](https://github.com/danwinship)) [SIG Network and Node]
- Introduces a new GCE specific cluster creation variable KUBE_PROXY_DISABLE. When set to true, this will skip over the creation of kube-proxy (whether the daemonset or static pod). This can be used to control the lifecycle of kube-proxy separately from the lifecycle of the nodes. ([#91977](https://github.com/kubernetes/kubernetes/pull/91977), [@varunmar](https://github.com/varunmar)) [SIG Cloud Provider]
- Kubeadm: do not throw errors if the current system time is outside of the NotBefore and NotAfter bounds of a loaded certificate. Print warnings instead. ([#94504](https://github.com/kubernetes/kubernetes/pull/94504), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Kubeadm: make the command "kubeadm alpha kubeconfig user" accept a "--config" flag and remove the following flags:
  - apiserver-advertise-address / apiserver-bind-port: use either localAPIEndpoint from InitConfiguration or controlPlaneEndpoint from ClusterConfiguration.
  - cluster-name: use clusterName from ClusterConfiguration
  - cert-dir: use certificatesDir from ClusterConfiguration ([#94879](https://github.com/kubernetes/kubernetes/pull/94879), [@knight42](https://github.com/knight42)) [SIG Cluster Lifecycle]
- Kubectl rollout history sts/sts-name --revision=some-revision will start showing the detailed view of  the sts on that specified revision ([#86506](https://github.com/kubernetes/kubernetes/pull/86506), [@dineshba](https://github.com/dineshba)) [SIG CLI]
- Scheduling Framework: expose Run[Pre]ScorePlugins functions to PreemptionHandle which can be used in PostFilter extention point. ([#93534](https://github.com/kubernetes/kubernetes/pull/93534), [@everpeace](https://github.com/everpeace)) [SIG Scheduling and Testing]
- Send gce node startup scripts logs to console and journal ([#95311](https://github.com/kubernetes/kubernetes/pull/95311), [@karan](https://github.com/karan)) [SIG Cloud Provider and Node]
- Support kubectl delete orphan/foreground/background options ([#93384](https://github.com/kubernetes/kubernetes/pull/93384), [@zhouya0](https://github.com/zhouya0)) [SIG CLI and Testing]

### Bug or Regression

- Change the mount way from systemd to normal mount except ceph and glusterfs intree-volume. ([#94916](https://github.com/kubernetes/kubernetes/pull/94916), [@smileusd](https://github.com/smileusd)) [SIG Apps, Cloud Provider, Network, Node, Storage and Testing]
- Cloud node controller: handle empty providerID from getProviderID ([#95342](https://github.com/kubernetes/kubernetes/pull/95342), [@nicolehanjing](https://github.com/nicolehanjing)) [SIG Cloud Provider]
- Fix a bug where the endpoint slice controller was not mirroring the parent service labels to its corresponding endpoint slices ([#94443](https://github.com/kubernetes/kubernetes/pull/94443), [@aojea](https://github.com/aojea)) [SIG Apps and Network]
- Fix azure disk attach failure for disk size bigger than 4TB ([#95463](https://github.com/kubernetes/kubernetes/pull/95463), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider]
- Fix azure disk data loss issue on Windows when unmount disk ([#95456](https://github.com/kubernetes/kubernetes/pull/95456), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider and Storage]
- Fix detach azure disk issue when vm not exist ([#95177](https://github.com/kubernetes/kubernetes/pull/95177), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider]
- Fix network_programming_latency metric reporting for Endpoints/EndpointSlice deletions, where we don't have correct timestamp ([#95363](https://github.com/kubernetes/kubernetes/pull/95363), [@wojtek-t](https://github.com/wojtek-t)) [SIG Network and Scalability]
- Fix scheduler cache snapshot when a Node is deleted before its Pods ([#95130](https://github.com/kubernetes/kubernetes/pull/95130), [@alculquicondor](https://github.com/alculquicondor)) [SIG Scheduling]
- Fix vsphere detach failure for static PVs ([#95447](https://github.com/kubernetes/kubernetes/pull/95447), [@gnufied](https://github.com/gnufied)) [SIG Cloud Provider and Storage]
- Fixed a bug that prevents the use of ephemeral containers in the presence of a validating admission webhook. ([#94685](https://github.com/kubernetes/kubernetes/pull/94685), [@verb](https://github.com/verb)) [SIG Node and Testing]
- Gracefully delete nodes when their parent scale set went missing ([#95289](https://github.com/kubernetes/kubernetes/pull/95289), [@bpineau](https://github.com/bpineau)) [SIG Cloud Provider]
- In dual-stack clusters, kubelet will now set up both IPv4 and IPv6 iptables rules, which may
  fix some problems, eg with HostPorts. ([#94474](https://github.com/kubernetes/kubernetes/pull/94474), [@danwinship](https://github.com/danwinship)) [SIG Network and Node]
- Kubeadm: for Docker as the container runtime, make the "kubeadm reset" command stop containers before removing them ([#94586](https://github.com/kubernetes/kubernetes/pull/94586), [@BedivereZero](https://github.com/BedivereZero)) [SIG Cluster Lifecycle]
- Kubeadm: warn but do not error out on missing "ca.key" files for root CA, front-proxy CA and etcd CA, during "kubeadm join --control-plane" if the user has provided all certificates, keys and kubeconfig files which require signing with the given CA keys. ([#94988](https://github.com/kubernetes/kubernetes/pull/94988), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Port mapping allows to map the same `containerPort` to multiple `hostPort` without naming the mapping explicitly. ([#94494](https://github.com/kubernetes/kubernetes/pull/94494), [@SergeyKanzhelev](https://github.com/SergeyKanzhelev)) [SIG Network and Node]
- Warn instead of fail when creating Roles and ClusterRoles with custom verbs via kubectl ([#92492](https://github.com/kubernetes/kubernetes/pull/92492), [@eddiezane](https://github.com/eddiezane)) [SIG CLI]

### Other (Cleanup or Flake)

- Added fine grained debugging to the intra-pod conformance test for helping easily resolve networking issues for nodes that might be unhealthy when running conformance or sonobuoy tests. ([#93837](https://github.com/kubernetes/kubernetes/pull/93837), [@jayunit100](https://github.com/jayunit100)) [SIG Network and Testing]
- AdmissionReview objects sent for the creation of Namespace API objects now populate the `namespace` attribute consistently (previously the `namespace` attribute was empty for Namespace creation via POST requests, and populated for Namespace creation via server-side-apply PATCH requests) ([#95012](https://github.com/kubernetes/kubernetes/pull/95012), [@nodo](https://github.com/nodo)) [SIG API Machinery and Testing]
- Client-go header logging (at verbosity levels >= 9) now masks `Authorization` header contents ([#95316](https://github.com/kubernetes/kubernetes/pull/95316), [@sfowl](https://github.com/sfowl)) [SIG API Machinery]
- Enhance log information of verifyRunAsNonRoot, add pod, container information ([#94911](https://github.com/kubernetes/kubernetes/pull/94911), [@wawa0210](https://github.com/wawa0210)) [SIG Node]
- Errors from staticcheck:                                                                                                                                      
  vendor/k8s.io/client-go/discovery/cached/memory/memcache_test.go:94:2: this value of g is never used (SA4006) ([#95098](https://github.com/kubernetes/kubernetes/pull/95098), [@phunziker](https://github.com/phunziker)) [SIG API Machinery]
- Kubeadm: update the default pause image version to 1.4.0 on Windows. With this update the image supports Windows versions 1809 (2019LTS), 1903, 1909, 2004 ([#95419](https://github.com/kubernetes/kubernetes/pull/95419), [@jsturtevant](https://github.com/jsturtevant)) [SIG Cluster Lifecycle and Windows]
- Masks ceph RBD adminSecrets in logs when logLevel >= 4 ([#95245](https://github.com/kubernetes/kubernetes/pull/95245), [@sfowl](https://github.com/sfowl)) [SIG Storage]
- Upgrade snapshot controller to 3.0.0 ([#95412](https://github.com/kubernetes/kubernetes/pull/95412), [@saikat-royc](https://github.com/saikat-royc)) [SIG Cloud Provider]
- Remove offensive words from kubectl cluster-info command ([#95202](https://github.com/kubernetes/kubernetes/pull/95202), [@rikatz](https://github.com/rikatz)) [SIG Architecture, CLI and Testing]
- The following new metrics are available.
  - network_plugin_operations_total
  - network_plugin_operations_errors_total ([#93066](https://github.com/kubernetes/kubernetes/pull/93066), [@AnishShah](https://github.com/AnishShah)) [SIG Instrumentation, Network and Node]
- Vsphere: improve logging message on node cache refresh event ([#95236](https://github.com/kubernetes/kubernetes/pull/95236), [@andrewsykim](https://github.com/andrewsykim)) [SIG Cloud Provider]
- `kubectl api-resources` now prints the API version (as 'API group/version', same as output of `kubectl api-versions`). The column APIGROUP is now APIVERSION ([#95253](https://github.com/kubernetes/kubernetes/pull/95253), [@sallyom](https://github.com/sallyom)) [SIG CLI]

## Dependencies

### Added
- github.com/jmespath/go-jmespath/internal/testify: [v1.5.1](https://github.com/jmespath/go-jmespath/internal/testify/tree/v1.5.1)

### Changed
- github.com/aws/aws-sdk-go: [v1.28.2 → v1.35.5](https://github.com/aws/aws-sdk-go/compare/v1.28.2...v1.35.5)
- github.com/jmespath/go-jmespath: [c2b33e8 → v0.4.0](https://github.com/jmespath/go-jmespath/compare/c2b33e8...v0.4.0)
- k8s.io/kube-openapi: 6aeccd4 → 8b50664
- sigs.k8s.io/apiserver-network-proxy/konnectivity-client: v0.0.9 → v0.0.12
- sigs.k8s.io/structured-merge-diff/v4: v4.0.1 → b3cf1e8

### Removed
_Nothing has changed._



# v1.20.0-alpha.1


## Downloads for v1.20.0-alpha.1

### Source Code

filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.20.0-alpha.1/kubernetes.tar.gz) | e7daed6502ea07816274f2371f96fe1a446d0d7917df4454b722d9eb3b5ff6163bfbbd5b92dfe7a0c1d07328b8c09c4ae966e482310d6b36de8813aaf87380b5
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.20.0-alpha.1/kubernetes-src.tar.gz) | e91213a0919647a1215d4691a63b12d89a3e74055463a8ebd71dc1a4cabf4006b3660881067af0189960c8dab74f4a7faf86f594df69021901213ee5b56550ea

### Client binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.1/kubernetes-client-darwin-amd64.tar.gz) | 1f3add5f826fa989820d715ca38e8864b66f30b59c1abeacbb4bfb96b4e9c694eac6b3f4c1c81e0ee3451082d44828cb7515315d91ad68116959a5efbdaef1e1
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.20.0-alpha.1/kubernetes-client-linux-386.tar.gz) | c62acdc8993b0a950d4b0ce0b45473bf96373d501ce61c88adf4007afb15c1d53da8d53b778a7eccac6c1624f7fdda322be9f3a8bc2d80aaad7b4237c39f5eaf
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.1/kubernetes-client-linux-amd64.tar.gz) | 1203ababfe00f9bc5be5c059324c17160a96530c1379a152db33564bbe644ccdb94b30eea15a0655bd652efb17895a46c31bbba19d4f5f473c2a0ff62f6e551f
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.20.0-alpha.1/kubernetes-client-linux-arm.tar.gz) | 31860088596e12d739c7aed94556c2d1e217971699b950c8417a3cea1bed4e78c9ff1717b9f3943354b75b4641d4b906cd910890dbf4278287c0d224837d9a7d
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.1/kubernetes-client-linux-arm64.tar.gz) | 8d469f37fe20d6e15b5debc13cce4c22e8b7a4f6a4ac787006b96507a85ce761f63b28140d692c54b5f7deb08697f8d5ddb9bbfa8f5ac0d9241fc7de3a3fe3cd
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.20.0-alpha.1/kubernetes-client-linux-ppc64le.tar.gz) | 0d62ee1729cd5884946b6c73701ad3a570fa4d642190ca0fe5c1db0fb0cba9da3ac86a948788d915b9432d28ab8cc499e28aadc64530b7d549ee752a6ed93ec1
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.20.0-alpha.1/kubernetes-client-linux-s390x.tar.gz) | 0fc0420e134ec0b8e0ab2654e1e102cebec47b48179703f1e1b79d51ee0d6da55a4e7304d8773d3cf830341ac2fe3cede1e6b0460fd88f7595534e0730422d5a
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.20.0-alpha.1/kubernetes-client-windows-386.tar.gz) | 3fb53b5260f4888c77c0e4ff602bbcf6bf38c364d2769850afe2b8d8e8b95f7024807c15e2b0d5603e787c46af8ac53492be9e88c530f578b8a389e3bd50c099
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.1/kubernetes-client-windows-amd64.tar.gz) | 2f44c93463d6b5244ce0c82f147e7f32ec2233d0e29c64c3c5759e23533aebd12671bf63e986c0861e9736f9b5259bb8d138574a7c8c8efc822e35cd637416c0

### Server binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.1/kubernetes-server-linux-amd64.tar.gz) | ae82d14b1214e4100f0cc2c988308b3e1edd040a65267d0eddb9082409f79644e55387889e3c0904a12c710f91206e9383edf510990bee8c9ea2e297b6472551
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.20.0-alpha.1/kubernetes-server-linux-arm.tar.gz) | 9a2a5828b7d1ddb16cc19d573e99a4af642f84129408e6203eeeb0558e7b8db77f3269593b5770b6a976fe9df4a64240ed27ad05a4bd43719e55fce1db0abf58
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.1/kubernetes-server-linux-arm64.tar.gz) | ed700dd226c999354ce05b73927388d36d08474c15333ae689427de15de27c84feb6b23c463afd9dd81993315f31eb8265938cfc7ecf6f750247aa42b9b33fa9
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.20.0-alpha.1/kubernetes-server-linux-ppc64le.tar.gz) | abb7a9d726538be3ccf5057a0c63ff9732b616e213c6ebb81363f0c49f1e168ce8068b870061ad7cba7ba1d49252f94cf00a5f68cec0f38dc8fce4e24edc5ca6
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.20.0-alpha.1/kubernetes-server-linux-s390x.tar.gz) | 3a51888af1bfdd2d5b0101d173ee589c1f39240e4428165f5f85c610344db219625faa42f00a49a83ce943fb079be873b1a114a62003fae2f328f9bf9d1227a4

### Node binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.1/kubernetes-node-linux-amd64.tar.gz) | d0f28e3c38ca59a7ff1bfecb48a1ce97116520355d9286afdca1200d346c10018f5bbdf890f130a388654635a2e83e908b263ed45f8a88defca52a7c1d0a7984
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.20.0-alpha.1/kubernetes-node-linux-arm.tar.gz) | ed9d3f13028beb3be39bce980c966f82c4b39dc73beaae38cc075fea5be30b0309e555cb2af8196014f2cc9f0df823354213c314b4d6545ff6e30dd2d00ec90e
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.1/kubernetes-node-linux-arm64.tar.gz) | ad5b3268db365dcdded9a9a4bffc90c7df0f844000349accdf2b8fb5f1081e553de9b9e9fb25d5e8a4ef7252d51fa94ef94d36d2ab31d157854e164136f662c2
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.20.0-alpha.1/kubernetes-node-linux-ppc64le.tar.gz) | c4de2524e513996def5eeba7b83f7b406f17eaf89d4d557833a93bd035348c81fa9375dcd5c27cfcc55d73995449fc8ee504be1b3bd7b9f108b0b2f153cb05ae
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.20.0-alpha.1/kubernetes-node-linux-s390x.tar.gz) | 9157b44e3e7bd5478af9f72014e54d1afa5cd19b984b4cd8b348b312c385016bb77f29db47f44aea08b58abf47d8a396b92a2d0e03f2fe8acdd30f4f9466cbdb
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.20.0-alpha.1/kubernetes-node-windows-amd64.tar.gz) | 8b40a43c5e6447379ad2ee8aac06e8028555e1b370a995f6001018a62411abe5fbbca6060b3d1682c5cadc07a27d49edd3204e797af46368800d55f4ca8aa1de

## Changelog since v1.20.0-alpha.0

## Urgent Upgrade Notes

### (No, really, you MUST read this before you upgrade)

 - Azure blob disk feature(`kind`: `Shared`, `Dedicated`) has been deprecated, you should use `kind`: `Managed` in `kubernetes.io/azure-disk` storage class. ([#92905](https://github.com/kubernetes/kubernetes/pull/92905), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider and Storage]
  - CVE-2020-8559 (Medium): Privilege escalation from compromised node to cluster. See https://github.com/kubernetes/kubernetes/issues/92914 for more details.
  The API Server will no longer proxy non-101 responses for upgrade requests. This could break proxied backends (such as an extension API server) that respond to upgrade requests with a non-101 response code. ([#92941](https://github.com/kubernetes/kubernetes/pull/92941), [@tallclair](https://github.com/tallclair)) [SIG API Machinery]
 
## Changes by Kind

### Deprecation

- Kube-apiserver: the componentstatus API is deprecated. This API provided status of etcd, kube-scheduler, and kube-controller-manager components, but only worked when those components were local to the API server, and when kube-scheduler and kube-controller-manager exposed unsecured health endpoints. Instead of this API, etcd health is included in the kube-apiserver health check and kube-scheduler/kube-controller-manager health checks can be made directly against those components' health endpoints. ([#93570](https://github.com/kubernetes/kubernetes/pull/93570), [@liggitt](https://github.com/liggitt)) [SIG API Machinery, Apps and Cluster Lifecycle]
- Kubeadm: deprecate the "kubeadm alpha kubelet config enable-dynamic" command. To continue using the feature please defer to the guide for "Dynamic Kubelet Configuration" at k8s.io. ([#92881](https://github.com/kubernetes/kubernetes/pull/92881), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Kubeadm: remove the deprecated "kubeadm alpha kubelet config enable-dynamic" command. To continue using the feature please defer to the guide for "Dynamic Kubelet Configuration" at k8s.io. This change also removes the parent command "kubeadm alpha kubelet" as there are no more sub-commands under it for the time being. ([#94668](https://github.com/kubernetes/kubernetes/pull/94668), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Kubeadm: remove the deprecated --kubelet-config flag for the command "kubeadm upgrade node" ([#94869](https://github.com/kubernetes/kubernetes/pull/94869), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Kubelet's deprecated endpoint `metrics/resource/v1alpha1` has been removed, please adopt to `metrics/resource`. ([#94272](https://github.com/kubernetes/kubernetes/pull/94272), [@RainbowMango](https://github.com/RainbowMango)) [SIG Instrumentation and Node]
- The v1alpha1 PodPreset API and admission plugin has been removed with no built-in replacement. Admission webhooks can be used to modify pods on creation. ([#94090](https://github.com/kubernetes/kubernetes/pull/94090), [@deads2k](https://github.com/deads2k)) [SIG API Machinery, Apps, CLI, Cloud Provider, Scalability and Testing]

### API Change

- A new `nofuzz` go build tag now disables gofuzz support. Release binaries enable this. ([#92491](https://github.com/kubernetes/kubernetes/pull/92491), [@BenTheElder](https://github.com/BenTheElder)) [SIG API Machinery]
- A new alpha-level field, `SupportsFsGroup`, has been introduced for CSIDrivers to allow them to specify whether they support volume ownership and permission modifications. The `CSIVolumeSupportFSGroup` feature gate must be enabled to allow this field to be used. ([#92001](https://github.com/kubernetes/kubernetes/pull/92001), [@huffmanca](https://github.com/huffmanca)) [SIG API Machinery, CLI and Storage]
- Added pod version skew strategy for seccomp profile to synchronize the deprecated annotations with the new API Server fields. Please see the corresponding section [in the KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/20190717-seccomp-ga.md&#35;version-skew-strategy) for more detailed explanations. ([#91408](https://github.com/kubernetes/kubernetes/pull/91408), [@saschagrunert](https://github.com/saschagrunert)) [SIG Apps, Auth, CLI and Node]
- Adds the ability to disable Accelerator/GPU metrics collected by Kubelet ([#91930](https://github.com/kubernetes/kubernetes/pull/91930), [@RenaudWasTaken](https://github.com/RenaudWasTaken)) [SIG Node]
- Custom Endpoints are now mirrored to EndpointSlices by a new EndpointSliceMirroring controller. ([#91637](https://github.com/kubernetes/kubernetes/pull/91637), [@robscott](https://github.com/robscott)) [SIG API Machinery, Apps, Auth, Cloud Provider, Instrumentation, Network and Testing]
- External facing API podresources is now available under k8s.io/kubelet/pkg/apis/ ([#92632](https://github.com/kubernetes/kubernetes/pull/92632), [@RenaudWasTaken](https://github.com/RenaudWasTaken)) [SIG Node and Testing]
- Fix conversions for custom metrics. ([#94481](https://github.com/kubernetes/kubernetes/pull/94481), [@wojtek-t](https://github.com/wojtek-t)) [SIG API Machinery and Instrumentation]
- Generic ephemeral volumes, a new alpha feature under the `GenericEphemeralVolume` feature gate, provide a more flexible alternative to `EmptyDir` volumes: as with `EmptyDir`, volumes are created and deleted for each pod automatically by Kubernetes. But because the normal provisioning process is used (`PersistentVolumeClaim`), storage can be provided by third-party storage vendors and all of the usual volume features work. Volumes don't need to be empt; for example, restoring from snapshot is supported. ([#92784](https://github.com/kubernetes/kubernetes/pull/92784), [@pohly](https://github.com/pohly)) [SIG API Machinery, Apps, Auth, CLI, Instrumentation, Node, Scheduling, Storage and Testing]
- Kube-controller-manager: volume plugins can be restricted from contacting local and loopback addresses by setting `--volume-host-allow-local-loopback=false`, or from contacting specific CIDR ranges by setting `--volume-host-cidr-denylist` (for example, `--volume-host-cidr-denylist=127.0.0.1/28,feed::/16`) ([#91785](https://github.com/kubernetes/kubernetes/pull/91785), [@mattcary](https://github.com/mattcary)) [SIG API Machinery, Apps, Auth, CLI, Network, Node, Storage and Testing]
- Kubernetes is now built with golang 1.15.0-rc.1.
  - The deprecated, legacy behavior of treating the CommonName field on X.509 serving certificates as a host name when no Subject Alternative Names are present is now disabled by default. It can be temporarily re-enabled by adding the value x509ignoreCN=0 to the GODEBUG environment variable. ([#93264](https://github.com/kubernetes/kubernetes/pull/93264), [@justaugustus](https://github.com/justaugustus)) [SIG API Machinery, Auth, CLI, Cloud Provider, Cluster Lifecycle, Instrumentation, Network, Node, Release, Scalability, Storage and Testing]
- Migrate scheduler, controller-manager and cloud-controller-manager to use LeaseLock ([#94603](https://github.com/kubernetes/kubernetes/pull/94603), [@wojtek-t](https://github.com/wojtek-t)) [SIG API Machinery, Apps, Cloud Provider and Scheduling]
- Modify DNS-1123 error messages to indicate that RFC 1123 is not followed exactly ([#94182](https://github.com/kubernetes/kubernetes/pull/94182), [@mattfenwick](https://github.com/mattfenwick)) [SIG API Machinery, Apps, Auth, Network and Node]
- The ServiceAccountIssuerDiscovery feature gate is now Beta and enabled by default. ([#91921](https://github.com/kubernetes/kubernetes/pull/91921), [@mtaufen](https://github.com/mtaufen)) [SIG Auth]
- The kube-controller-manager managed signers can now have distinct signing certificates and keys.  See the help about `--cluster-signing-[signer-name]-{cert,key}-file`.  `--cluster-signing-{cert,key}-file` is still the default. ([#90822](https://github.com/kubernetes/kubernetes/pull/90822), [@deads2k](https://github.com/deads2k)) [SIG API Machinery, Apps and Auth]
- When creating a networking.k8s.io/v1 Ingress API object, `spec.tls[*].secretName` values are required to pass validation rules for Secret API object names. ([#93929](https://github.com/kubernetes/kubernetes/pull/93929), [@liggitt](https://github.com/liggitt)) [SIG Network]
- WinOverlay feature graduated to beta ([#94807](https://github.com/kubernetes/kubernetes/pull/94807), [@ksubrmnn](https://github.com/ksubrmnn)) [SIG Windows]

### Feature

- ACTION REQUIRED : In CoreDNS v1.7.0, [metrics names have been changed](https://github.com/coredns/coredns/blob/master/notes/coredns-1.7.0.md&#35;metric-changes) which will be backward incompatible with existing reporting formulas that use the old metrics' names. Adjust your formulas to the new names before upgrading. 
  
  Kubeadm now includes CoreDNS version v1.7.0. Some of the major changes include:
  -  Fixed a bug that could cause CoreDNS to stop updating service records.
  -  Fixed a bug in the forward plugin where only the first upstream server is always selected no matter which policy is set.
  -  Remove already deprecated options `resyncperiod` and `upstream` in the Kubernetes plugin.
  -  Includes Prometheus metrics name changes (to bring them in line with standard Prometheus metrics naming convention). They will be backward incompatible with existing reporting formulas that use the old metrics' names.
  -  The federation plugin (allows for v1 Kubernetes federation) has been removed.
  More details are available in https://coredns.io/2020/06/15/coredns-1.7.0-release/ ([#92651](https://github.com/kubernetes/kubernetes/pull/92651), [@rajansandeep](https://github.com/rajansandeep)) [SIG API Machinery, CLI, Cloud Provider, Cluster Lifecycle and Instrumentation]
- Add metrics for azure service operations (route and loadbalancer). ([#94124](https://github.com/kubernetes/kubernetes/pull/94124), [@nilo19](https://github.com/nilo19)) [SIG Cloud Provider and Instrumentation]
- Add network rule support in Azure account creation ([#94239](https://github.com/kubernetes/kubernetes/pull/94239), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider]
- Add tags support for Azure File Driver ([#92825](https://github.com/kubernetes/kubernetes/pull/92825), [@ZeroMagic](https://github.com/ZeroMagic)) [SIG Cloud Provider and Storage]
- Added kube-apiserver metrics: apiserver_current_inflight_request_measures and, when API Priority and Fairness is enable, windowed_request_stats. ([#91177](https://github.com/kubernetes/kubernetes/pull/91177), [@MikeSpreitzer](https://github.com/MikeSpreitzer)) [SIG API Machinery, Instrumentation and Testing]
- Audit events for API requests to deprecated API versions now include a `"k8s.io/deprecated": "true"` audit annotation. If a target removal release is identified, the audit event includes a `"k8s.io/removal-release": "<majorVersion>.<minorVersion>"` audit annotation as well. ([#92842](https://github.com/kubernetes/kubernetes/pull/92842), [@liggitt](https://github.com/liggitt)) [SIG API Machinery and Instrumentation]
- Cloud node-controller use InstancesV2 ([#91319](https://github.com/kubernetes/kubernetes/pull/91319), [@gongguan](https://github.com/gongguan)) [SIG Apps, Cloud Provider, Scalability and Storage]
- Kubeadm: Add a preflight check that the control-plane node has at least 1700MB of RAM ([#93275](https://github.com/kubernetes/kubernetes/pull/93275), [@xlgao-zju](https://github.com/xlgao-zju)) [SIG Cluster Lifecycle]
- Kubeadm: add the "--cluster-name" flag to the "kubeadm alpha kubeconfig user" to allow configuring the cluster name in the generated kubeconfig file ([#93992](https://github.com/kubernetes/kubernetes/pull/93992), [@prabhu43](https://github.com/prabhu43)) [SIG Cluster Lifecycle]
- Kubeadm: add the "--kubeconfig" flag to the "kubeadm init phase upload-certs" command to allow users to pass a custom location for a kubeconfig file. ([#94765](https://github.com/kubernetes/kubernetes/pull/94765), [@zhanw15](https://github.com/zhanw15)) [SIG Cluster Lifecycle]
- Kubeadm: deprecate the "--csr-only" and "--csr-dir" flags of the "kubeadm init phase certs" subcommands. Please use "kubeadm alpha certs generate-csr" instead. This new command allows you to generate new private keys and certificate signing requests for all the control-plane components, so that the certificates can be signed by an external CA. ([#92183](https://github.com/kubernetes/kubernetes/pull/92183), [@wallrj](https://github.com/wallrj)) [SIG Cluster Lifecycle]
- Kubeadm: make etcd pod request 100m CPU, 100Mi memory and 100Mi ephemeral_storage by default ([#94479](https://github.com/kubernetes/kubernetes/pull/94479), [@knight42](https://github.com/knight42)) [SIG Cluster Lifecycle]
- Kubemark now supports both real and hollow nodes in a single cluster. ([#93201](https://github.com/kubernetes/kubernetes/pull/93201), [@ellistarn](https://github.com/ellistarn)) [SIG Scalability]
- Kubernetes is now built using go1.15.2
  - build: Update to k/repo-infra@v0.1.1 (supports go1.15.2)
  - build: Use go-runner:buster-v2.0.1 (built using go1.15.1)
  - bazel: Replace --features with Starlark build settings flag
  - hack/lib/util.sh: some bash cleanups
    
    - switched one spot to use kube::logging
    - make kube::util::find-binary return an error when it doesn't find
      anything so that hack scripts fail fast instead of with '' binary not
      found errors.
    - this required deleting some genfeddoc stuff. the binary no longer
      exists in k/k repo since we removed federation/, and I don't see it
      in https://github.com/kubernetes-sigs/kubefed/ either. I'm assuming
      that it's gone for good now.
  
  - bazel: output go_binary rule directly from go_binary_conditional_pure
    
    From: @mikedanese:
    Instead of aliasing. Aliases are annoying in a number of ways. This is
    specifically bugging me now because they make the action graph harder to
    analyze programmatically. By using aliases here, we would need to handle
    potentially aliased go_binary targets and dereference to the effective
    target.
  
    The comment references an issue with `pure = select(...)` which appears
    to be resolved considering this now builds.
  
  - make kube::util::find-binary not dependent on bazel-out/ structure
  
    Implement an aspect that outputs go_build_mode metadata for go binaries,
    and use that during binary selection. ([#94449](https://github.com/kubernetes/kubernetes/pull/94449), [@justaugustus](https://github.com/justaugustus)) [SIG Architecture, CLI, Cluster Lifecycle, Node, Release and Testing]
- Only update Azure data disks when attach/detach ([#94265](https://github.com/kubernetes/kubernetes/pull/94265), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider]
- Promote SupportNodePidsLimit to GA to provide node to pod pid isolation
  Promote SupportPodPidsLimit to GA to provide ability to limit pids per pod ([#94140](https://github.com/kubernetes/kubernetes/pull/94140), [@derekwaynecarr](https://github.com/derekwaynecarr)) [SIG Node and Testing]
- Rename pod_preemption_metrics to preemption_metrics. ([#93256](https://github.com/kubernetes/kubernetes/pull/93256), [@ahg-g](https://github.com/ahg-g)) [SIG Instrumentation and Scheduling]
- Server-side apply behavior has been regularized in the case where a field is removed from the applied configuration. Removed fields which have no other owners are deleted from the live object, or reset to their default value if they have one. Safe ownership transfers, such as the transfer of a `replicas` field from a user to an HPA without resetting to the default value are documented in [Transferring Ownership](https://kubernetes.io/docs/reference/using-api/api-concepts/&#35;transferring-ownership) ([#92661](https://github.com/kubernetes/kubernetes/pull/92661), [@jpbetz](https://github.com/jpbetz)) [SIG API Machinery, CLI, Cloud Provider, Cluster Lifecycle, Instrumentation and Testing]
- Set CSIMigrationvSphere feature gates to beta.
  Users should enable CSIMigration + CSIMigrationvSphere features and install the vSphere CSI Driver (https://github.com/kubernetes-sigs/vsphere-csi-driver) to move workload from the in-tree vSphere plugin "kubernetes.io/vsphere-volume" to vSphere CSI Driver.
  
  Requires: vSphere vCenter/ESXi Version: 7.0u1, HW Version: VM version 15 ([#92816](https://github.com/kubernetes/kubernetes/pull/92816), [@divyenpatel](https://github.com/divyenpatel)) [SIG Cloud Provider and Storage]
- Support [service.beta.kubernetes.io/azure-pip-ip-tags] annotations to allow customers to specify ip-tags to influence public-ip creation in Azure [Tag1=Value1, Tag2=Value2, etc.] ([#94114](https://github.com/kubernetes/kubernetes/pull/94114), [@MarcPow](https://github.com/MarcPow)) [SIG Cloud Provider]
- Support a smooth upgrade from client-side apply to server-side apply without conflicts, as well as support the corresponding downgrade. ([#90187](https://github.com/kubernetes/kubernetes/pull/90187), [@julianvmodesto](https://github.com/julianvmodesto)) [SIG API Machinery and Testing]
- Trace output in apiserver logs is more organized and comprehensive. Traces are nested, and for all non-long running request endpoints, the entire filter chain is instrumented (e.g. authentication check is included). ([#88936](https://github.com/kubernetes/kubernetes/pull/88936), [@jpbetz](https://github.com/jpbetz)) [SIG API Machinery, CLI, Cloud Provider, Cluster Lifecycle, Instrumentation and Scheduling]
- `kubectl alpha debug` now supports debugging nodes by creating a debugging container running in the node's host namespaces. ([#92310](https://github.com/kubernetes/kubernetes/pull/92310), [@verb](https://github.com/verb)) [SIG CLI]

### Documentation

- Kubelet: remove alpha warnings for CNI flags. ([#94508](https://github.com/kubernetes/kubernetes/pull/94508), [@andrewsykim](https://github.com/andrewsykim)) [SIG Network and Node]

### Failing Test

- Kube-proxy iptables min-sync-period defaults to 1 sec. Previously, it was 0. ([#92836](https://github.com/kubernetes/kubernetes/pull/92836), [@aojea](https://github.com/aojea)) [SIG Network]

### Bug or Regression

- A panic in the apiserver caused by the `informer-sync` health checker is now fixed. ([#93600](https://github.com/kubernetes/kubernetes/pull/93600), [@ialidzhikov](https://github.com/ialidzhikov)) [SIG API Machinery]
- Add kubectl wait  --ignore-not-found flag ([#90969](https://github.com/kubernetes/kubernetes/pull/90969), [@zhouya0](https://github.com/zhouya0)) [SIG CLI]
- Adding fix to the statefulset controller to wait for pvc deletion before creating pods. ([#93457](https://github.com/kubernetes/kubernetes/pull/93457), [@ymmt2005](https://github.com/ymmt2005)) [SIG Apps]
- Azure ARM client: don't segfault on empty response and http error ([#94078](https://github.com/kubernetes/kubernetes/pull/94078), [@bpineau](https://github.com/bpineau)) [SIG Cloud Provider]
- Azure: fix a bug that kube-controller-manager would panic if wrong Azure VMSS name is configured ([#94306](https://github.com/kubernetes/kubernetes/pull/94306), [@knight42](https://github.com/knight42)) [SIG Cloud Provider]
- Azure: per VMSS VMSS VMs cache to prevent throttling on clusters having many attached VMSS ([#93107](https://github.com/kubernetes/kubernetes/pull/93107), [@bpineau](https://github.com/bpineau)) [SIG Cloud Provider]
- Both apiserver_request_duration_seconds metrics and RequestReceivedTimestamp field of an audit event take 
  into account the time a request spends in the apiserver request filters. ([#94903](https://github.com/kubernetes/kubernetes/pull/94903), [@tkashem](https://github.com/tkashem)) [SIG API Machinery, Auth and Instrumentation]
- Build/lib/release: Explicitly use '--platform' in building server images
  
  When we switched to go-runner for building the apiserver,
  controller-manager, and scheduler server components, we no longer
  reference the individual architectures in the image names, specifically
  in the 'FROM' directive of the server image Dockerfiles.
  
  As a result, server images for non-amd64 images copy in the go-runner
  amd64 binary instead of the go-runner that matches that architecture.
  
  This commit explicitly sets the '--platform=linux/${arch}' to ensure
  we're pulling the correct go-runner arch from the manifest list.
  
  Before:
  `FROM ${base_image}`
  
  After:
  `FROM --platform=linux/${arch} ${base_image}` ([#94552](https://github.com/kubernetes/kubernetes/pull/94552), [@justaugustus](https://github.com/justaugustus)) [SIG Release]
- CSIDriver object can be deployed during volume attachment. ([#93710](https://github.com/kubernetes/kubernetes/pull/93710), [@Jiawei0227](https://github.com/Jiawei0227)) [SIG Apps, Node, Storage and Testing]
- CVE-2020-8557 (Medium): Node-local denial of service via container /etc/hosts file. See https://github.com/kubernetes/kubernetes/issues/93032 for more details. ([#92916](https://github.com/kubernetes/kubernetes/pull/92916), [@joelsmith](https://github.com/joelsmith)) [SIG Node]
- Do not add nodes labeled with kubernetes.azure.com/managed=false to backend pool of load balancer. ([#93034](https://github.com/kubernetes/kubernetes/pull/93034), [@matthias50](https://github.com/matthias50)) [SIG Cloud Provider]
- Do not fail sorting empty elements. ([#94666](https://github.com/kubernetes/kubernetes/pull/94666), [@soltysh](https://github.com/soltysh)) [SIG CLI]
- Do not retry volume expansion if CSI driver returns FailedPrecondition error ([#92986](https://github.com/kubernetes/kubernetes/pull/92986), [@gnufied](https://github.com/gnufied)) [SIG Node and Storage]
- Dockershim security: pod sandbox now always run with `no-new-privileges` and `runtime/default` seccomp profile
  dockershim seccomp: custom profiles can now have smaller seccomp profiles when set at pod level ([#90948](https://github.com/kubernetes/kubernetes/pull/90948), [@pjbgf](https://github.com/pjbgf)) [SIG Node]
- Dual-stack: make nodeipam compatible with existing single-stack clusters when dual-stack feature gate become enabled by default ([#90439](https://github.com/kubernetes/kubernetes/pull/90439), [@SataQiu](https://github.com/SataQiu)) [SIG API Machinery]
- Endpoint controller requeues service after an endpoint deletion event occurs to confirm that deleted endpoints are undesired to mitigate the effects of an out of sync endpoint cache. ([#93030](https://github.com/kubernetes/kubernetes/pull/93030), [@swetharepakula](https://github.com/swetharepakula)) [SIG Apps and Network]
- EndpointSlice controllers now return immediately if they encounter an error creating, updating, or deleting resources. ([#93908](https://github.com/kubernetes/kubernetes/pull/93908), [@robscott](https://github.com/robscott)) [SIG Apps and Network]
- EndpointSliceMirroring controller now copies labels from Endpoints to EndpointSlices. ([#93442](https://github.com/kubernetes/kubernetes/pull/93442), [@robscott](https://github.com/robscott)) [SIG Apps and Network]
- EndpointSliceMirroring controller now mirrors Endpoints that do not have a Service associated with them. ([#94171](https://github.com/kubernetes/kubernetes/pull/94171), [@robscott](https://github.com/robscott)) [SIG Apps, Network and Testing]
- Ensure backoff step is set to 1 for Azure armclient. ([#94180](https://github.com/kubernetes/kubernetes/pull/94180), [@feiskyer](https://github.com/feiskyer)) [SIG Cloud Provider]
- Ensure getPrimaryInterfaceID not panic when network interfaces for Azure VMSS are null ([#94355](https://github.com/kubernetes/kubernetes/pull/94355), [@feiskyer](https://github.com/feiskyer)) [SIG Cloud Provider]
- Eviction requests for pods that have a non-zero DeletionTimestamp will always succeed ([#91342](https://github.com/kubernetes/kubernetes/pull/91342), [@michaelgugino](https://github.com/michaelgugino)) [SIG Apps]
- Extended DSR loadbalancer feature in winkernel kube-proxy to HNS versions 9.3-9.max, 10.2+ ([#93080](https://github.com/kubernetes/kubernetes/pull/93080), [@elweb9858](https://github.com/elweb9858)) [SIG Network]
- Fix HandleCrash order ([#93108](https://github.com/kubernetes/kubernetes/pull/93108), [@lixiaobing1](https://github.com/lixiaobing1)) [SIG API Machinery]
- Fix a concurrent map writes error in kubelet ([#93773](https://github.com/kubernetes/kubernetes/pull/93773), [@knight42](https://github.com/knight42)) [SIG Node]
- Fix a regression where kubeadm bails out with a fatal error when an optional version command line argument is supplied to the "kubeadm upgrade plan" command ([#94421](https://github.com/kubernetes/kubernetes/pull/94421), [@rosti](https://github.com/rosti)) [SIG Cluster Lifecycle]
- Fix azure file migration panic ([#94853](https://github.com/kubernetes/kubernetes/pull/94853), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider]
- Fix bug where loadbalancer deletion gets stuck because of missing resource group &#35;75198 ([#93962](https://github.com/kubernetes/kubernetes/pull/93962), [@phiphi282](https://github.com/phiphi282)) [SIG Cloud Provider]
- Fix calling AttachDisk on a previously attached EBS volume ([#93567](https://github.com/kubernetes/kubernetes/pull/93567), [@gnufied](https://github.com/gnufied)) [SIG Cloud Provider, Storage and Testing]
- Fix detection of image filesystem, disk metrics for devicemapper, detection of OOM Kills on 5.0+ linux kernels. ([#92919](https://github.com/kubernetes/kubernetes/pull/92919), [@dashpole](https://github.com/dashpole)) [SIG API Machinery, CLI, Cloud Provider, Cluster Lifecycle, Instrumentation and Node]
- Fix etcd_object_counts metric reported by kube-apiserver ([#94773](https://github.com/kubernetes/kubernetes/pull/94773), [@tkashem](https://github.com/tkashem)) [SIG API Machinery]
- Fix incorrectly reported verbs for kube-apiserver metrics for CRD objects ([#93523](https://github.com/kubernetes/kubernetes/pull/93523), [@wojtek-t](https://github.com/wojtek-t)) [SIG API Machinery and Instrumentation]
- Fix instance not found issues when an Azure Node is recreated in a short time ([#93316](https://github.com/kubernetes/kubernetes/pull/93316), [@feiskyer](https://github.com/feiskyer)) [SIG Cloud Provider]
- Fix kube-apiserver /readyz to contain "informer-sync" check ensuring that internal informers are synced. ([#93670](https://github.com/kubernetes/kubernetes/pull/93670), [@wojtek-t](https://github.com/wojtek-t)) [SIG API Machinery and Testing]
- Fix kubectl SchemaError on CRDs with schema using x-kubernetes-preserve-unknown-fields on array types. ([#94888](https://github.com/kubernetes/kubernetes/pull/94888), [@sttts](https://github.com/sttts)) [SIG API Machinery]
- Fix memory leak in EndpointSliceTracker for EndpointSliceMirroring controller. ([#93441](https://github.com/kubernetes/kubernetes/pull/93441), [@robscott](https://github.com/robscott)) [SIG Apps and Network]
- Fix missing csi annotations on node during parallel csinode update. ([#94389](https://github.com/kubernetes/kubernetes/pull/94389), [@pacoxu](https://github.com/pacoxu)) [SIG Storage]
- Fix the `cloudprovider_azure_api_request_duration_seconds` metric buckets to correctly capture the latency metrics. Previously, the majority of the calls would fall in the "+Inf" bucket. ([#94873](https://github.com/kubernetes/kubernetes/pull/94873), [@marwanad](https://github.com/marwanad)) [SIG Cloud Provider and Instrumentation]
- Fix: azure disk resize error if source does not exist ([#93011](https://github.com/kubernetes/kubernetes/pull/93011), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider]
- Fix: detach azure disk broken on Azure Stack ([#94885](https://github.com/kubernetes/kubernetes/pull/94885), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider]
- Fix: determine the correct ip config based on ip family ([#93043](https://github.com/kubernetes/kubernetes/pull/93043), [@aramase](https://github.com/aramase)) [SIG Cloud Provider]
- Fix: initial delay in mounting azure disk & file ([#93052](https://github.com/kubernetes/kubernetes/pull/93052), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider and Storage]
- Fix: use sensitiveOptions on Windows mount ([#94126](https://github.com/kubernetes/kubernetes/pull/94126), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider and Storage]
- Fixed Ceph RBD volume expansion when no ceph.conf exists ([#92027](https://github.com/kubernetes/kubernetes/pull/92027), [@juliantaylor](https://github.com/juliantaylor)) [SIG Storage]
- Fixed a bug where improper storage and comparison of endpoints led to excessive API traffic from the endpoints controller ([#94112](https://github.com/kubernetes/kubernetes/pull/94112), [@damemi](https://github.com/damemi)) [SIG Apps, Network and Testing]
- Fixed a bug whereby the allocation of reusable CPUs and devices was not being honored when the TopologyManager was enabled ([#93189](https://github.com/kubernetes/kubernetes/pull/93189), [@klueska](https://github.com/klueska)) [SIG Node]
- Fixed a panic in kubectl debug when pod has multiple init containers or ephemeral containers ([#94580](https://github.com/kubernetes/kubernetes/pull/94580), [@kiyoshim55](https://github.com/kiyoshim55)) [SIG CLI]
- Fixed a regression that sometimes prevented `kubectl portforward` to work when TCP and UDP services were configured on the same port ([#94728](https://github.com/kubernetes/kubernetes/pull/94728), [@amorenoz](https://github.com/amorenoz)) [SIG CLI]
- Fixed bug in reflector that couldn't recover from "Too large resource version" errors with API servers 1.17.0-1.18.5 ([#94316](https://github.com/kubernetes/kubernetes/pull/94316), [@janeczku](https://github.com/janeczku)) [SIG API Machinery]
- Fixed bug where kubectl top pod output is not sorted when --sort-by and --containers flags are used together ([#93692](https://github.com/kubernetes/kubernetes/pull/93692), [@brianpursley](https://github.com/brianpursley)) [SIG CLI]
- Fixed kubelet creating extra sandbox for pods with RestartPolicyOnFailure after all containers succeeded ([#92614](https://github.com/kubernetes/kubernetes/pull/92614), [@tnqn](https://github.com/tnqn)) [SIG Node and Testing]
- Fixed memory leak in endpointSliceTracker ([#92838](https://github.com/kubernetes/kubernetes/pull/92838), [@tnqn](https://github.com/tnqn)) [SIG Apps and Network]
- Fixed node data lost in kube-scheduler for clusters with imbalance on number of nodes across zones ([#93355](https://github.com/kubernetes/kubernetes/pull/93355), [@maelk](https://github.com/maelk)) [SIG Scheduling]
- Fixed the EndpointSliceController to correctly create endpoints for IPv6-only pods.
  
  Fixed the EndpointController to allow IPv6 headless services, if the IPv6DualStack
  feature gate is enabled, by specifying `ipFamily: IPv6` on the service. (This already
  worked with the EndpointSliceController.) ([#91399](https://github.com/kubernetes/kubernetes/pull/91399), [@danwinship](https://github.com/danwinship)) [SIG Apps and Network]
- Fixes a bug evicting pods after a taint with a limited tolerationSeconds toleration is removed from a node ([#93722](https://github.com/kubernetes/kubernetes/pull/93722), [@liggitt](https://github.com/liggitt)) [SIG Apps and Node]
- Fixes a bug where EndpointSlices would not be recreated after rapid Service recreation. ([#94730](https://github.com/kubernetes/kubernetes/pull/94730), [@robscott](https://github.com/robscott)) [SIG Apps, Network and Testing]
- Fixes a race condition in kubelet pod handling ([#94751](https://github.com/kubernetes/kubernetes/pull/94751), [@auxten](https://github.com/auxten)) [SIG Node]
- Fixes an issue proxying to ipv6 pods without specifying a port ([#94834](https://github.com/kubernetes/kubernetes/pull/94834), [@liggitt](https://github.com/liggitt)) [SIG API Machinery and Network]
- Fixes an issue that can result in namespaced custom resources being orphaned when their namespace is deleted, if the CRD defining the custom resource is removed concurrently with namespaces being deleted, then recreated. ([#93790](https://github.com/kubernetes/kubernetes/pull/93790), [@liggitt](https://github.com/liggitt)) [SIG API Machinery and Apps]
- Ignore root user check when windows pod starts ([#92355](https://github.com/kubernetes/kubernetes/pull/92355), [@wawa0210](https://github.com/wawa0210)) [SIG Node and Windows]
- Increased maximum IOPS of AWS EBS io1 volumes to 64,000 (current AWS maximum). ([#90014](https://github.com/kubernetes/kubernetes/pull/90014), [@jacobmarble](https://github.com/jacobmarble)) [SIG Cloud Provider and Storage]
- K8s.io/apimachinery: runtime.DefaultUnstructuredConverter.FromUnstructured now handles converting integer fields to typed float values ([#93250](https://github.com/kubernetes/kubernetes/pull/93250), [@liggitt](https://github.com/liggitt)) [SIG API Machinery]
- Kube-aggregator certificates are dynamically loaded on change from disk ([#92791](https://github.com/kubernetes/kubernetes/pull/92791), [@p0lyn0mial](https://github.com/p0lyn0mial)) [SIG API Machinery]
- Kube-apiserver: fixed a bug returning inconsistent results from list requests which set a field or label selector and set a paging limit ([#94002](https://github.com/kubernetes/kubernetes/pull/94002), [@wojtek-t](https://github.com/wojtek-t)) [SIG API Machinery]
- Kube-apiserver: jsonpath expressions with consecutive recursive descent operators are no longer evaluated for custom resource printer columns ([#93408](https://github.com/kubernetes/kubernetes/pull/93408), [@joelsmith](https://github.com/joelsmith)) [SIG API Machinery]
- Kube-proxy now trims extra spaces found in loadBalancerSourceRanges to match Service validation. ([#94107](https://github.com/kubernetes/kubernetes/pull/94107), [@robscott](https://github.com/robscott)) [SIG Network]
- Kube-up now includes CoreDNS version v1.7.0. Some of the major changes include:
  -  Fixed a bug that could cause CoreDNS to stop updating service records.
  -  Fixed a bug in the forward plugin where only the first upstream server is always selected no matter which policy is set.
  -  Remove already deprecated options `resyncperiod` and `upstream` in the Kubernetes plugin.
  -  Includes Prometheus metrics name changes (to bring them in line with standard Prometheus metrics naming convention). They will be backward incompatible with existing reporting formulas that use the old metrics' names.
  -  The federation plugin (allows for v1 Kubernetes federation) has been removed.
  More details are available in https://coredns.io/2020/06/15/coredns-1.7.0-release/ ([#92718](https://github.com/kubernetes/kubernetes/pull/92718), [@rajansandeep](https://github.com/rajansandeep)) [SIG Cloud Provider]
- Kubeadm now makes sure the etcd manifest is regenerated upon upgrade even when no etcd version change takes place ([#94395](https://github.com/kubernetes/kubernetes/pull/94395), [@rosti](https://github.com/rosti)) [SIG Cluster Lifecycle]
- Kubeadm: avoid a panic when determining if the running version of CoreDNS is supported during upgrades ([#94299](https://github.com/kubernetes/kubernetes/pull/94299), [@zouyee](https://github.com/zouyee)) [SIG Cluster Lifecycle]
- Kubeadm: ensure "kubeadm reset" does not unmount the root "/var/lib/kubelet" directory if it is mounted by the user ([#93702](https://github.com/kubernetes/kubernetes/pull/93702), [@thtanaka](https://github.com/thtanaka)) [SIG Cluster Lifecycle]
- Kubeadm: ensure the etcd data directory is created with 0700 permissions during control-plane init and join ([#94102](https://github.com/kubernetes/kubernetes/pull/94102), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Kubeadm: fix the bug that kubeadm tries to call 'docker info' even if the CRI socket was for another CR ([#94555](https://github.com/kubernetes/kubernetes/pull/94555), [@SataQiu](https://github.com/SataQiu)) [SIG Cluster Lifecycle]
- Kubeadm: make the kubeconfig files for the kube-controller-manager and kube-scheduler use the LocalAPIEndpoint instead of the ControlPlaneEndpoint. This makes kubeadm clusters more reseliant to version skew problems during immutable upgrades: https://kubernetes.io/docs/setup/release/version-skew-policy/#kube-controller-manager-kube-scheduler-and-cloud-controller-manager ([#94398](https://github.com/kubernetes/kubernetes/pull/94398), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Kubeadm: relax the validation of kubeconfig server URLs. Allow the user to define custom kubeconfig server URLs without erroring out during validation of existing kubeconfig files (e.g. when using external CA mode). ([#94816](https://github.com/kubernetes/kubernetes/pull/94816), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Kubeadm: remove duplicate DNS names and IP addresses from generated certificates ([#92753](https://github.com/kubernetes/kubernetes/pull/92753), [@QianChenglong](https://github.com/QianChenglong)) [SIG Cluster Lifecycle]
- Kubelet: assume that swap is disabled when `/proc/swaps` does not exist ([#93931](https://github.com/kubernetes/kubernetes/pull/93931), [@SataQiu](https://github.com/SataQiu)) [SIG Node]
- Kubelet: fix race condition in pluginWatcher ([#93622](https://github.com/kubernetes/kubernetes/pull/93622), [@knight42](https://github.com/knight42)) [SIG Node]
- Kuberuntime security: pod sandbox now always runs with `runtime/default` seccomp profile
  kuberuntime seccomp: custom profiles can now have smaller seccomp profiles when set at pod level ([#90949](https://github.com/kubernetes/kubernetes/pull/90949), [@pjbgf](https://github.com/pjbgf)) [SIG Node]
- NONE ([#71269](https://github.com/kubernetes/kubernetes/pull/71269), [@DeliangFan](https://github.com/DeliangFan)) [SIG Node]
- New Azure instance types do now have correct max data disk count information. ([#94340](https://github.com/kubernetes/kubernetes/pull/94340), [@ialidzhikov](https://github.com/ialidzhikov)) [SIG Cloud Provider and Storage]
- Pods with invalid Affinity/AntiAffinity LabelSelectors will now fail scheduling when these plugins are enabled ([#93660](https://github.com/kubernetes/kubernetes/pull/93660), [@damemi](https://github.com/damemi)) [SIG Scheduling]
- Require feature flag CustomCPUCFSQuotaPeriod if setting a non-default cpuCFSQuotaPeriod in kubelet config. ([#94687](https://github.com/kubernetes/kubernetes/pull/94687), [@karan](https://github.com/karan)) [SIG Node]
- Reverted devicemanager for Windows node added in 1.19rc1. ([#93263](https://github.com/kubernetes/kubernetes/pull/93263), [@liggitt](https://github.com/liggitt)) [SIG Node and Windows]
- Scheduler bugfix: Scheduler doesn't lose pod information when nodes are quickly recreated. This could happen when nodes are restarted or quickly recreated reusing a nodename. ([#93938](https://github.com/kubernetes/kubernetes/pull/93938), [@alculquicondor](https://github.com/alculquicondor)) [SIG Scalability, Scheduling and Testing]
- The EndpointSlice controller now waits for EndpointSlice and Node caches to be synced before starting. ([#94086](https://github.com/kubernetes/kubernetes/pull/94086), [@robscott](https://github.com/robscott)) [SIG Apps and Network]
- The `/debug/api_priority_and_fairness/dump_requests` path at an apiserver will no longer return a phantom line for each exempt priority level. ([#93406](https://github.com/kubernetes/kubernetes/pull/93406), [@MikeSpreitzer](https://github.com/MikeSpreitzer)) [SIG API Machinery]
- The kubelet recognizes the --containerd-namespace flag to configure the namespace used by cadvisor. ([#87054](https://github.com/kubernetes/kubernetes/pull/87054), [@changyaowei](https://github.com/changyaowei)) [SIG Node]
- The terminationGracePeriodSeconds from pod spec is respected for the mirror pod. ([#92442](https://github.com/kubernetes/kubernetes/pull/92442), [@tedyu](https://github.com/tedyu)) [SIG Node and Testing]
- Update Calico to v3.15.2 ([#94241](https://github.com/kubernetes/kubernetes/pull/94241), [@lmm](https://github.com/lmm)) [SIG Cloud Provider]
- Update default etcd server version to 3.4.13 ([#94287](https://github.com/kubernetes/kubernetes/pull/94287), [@jingyih](https://github.com/jingyih)) [SIG API Machinery, Cloud Provider, Cluster Lifecycle and Testing]
- Updated Cluster Autoscaler to 1.19.0; ([#93577](https://github.com/kubernetes/kubernetes/pull/93577), [@vivekbagade](https://github.com/vivekbagade)) [SIG Autoscaling and Cloud Provider]
- Use NLB Subnet CIDRs instead of VPC CIDRs in Health Check SG Rules ([#93515](https://github.com/kubernetes/kubernetes/pull/93515), [@t0rr3sp3dr0](https://github.com/t0rr3sp3dr0)) [SIG Cloud Provider]
- Users will see increase in time for deletion of pods and also guarantee that removal of pod from api server  would mean deletion of all the resources from container runtime. ([#92817](https://github.com/kubernetes/kubernetes/pull/92817), [@kmala](https://github.com/kmala)) [SIG Node]
- Very large patches may now be specified to `kubectl patch` with the `--patch-file` flag instead of including them directly on the command line. The `--patch` and `--patch-file` flags are mutually exclusive. ([#93548](https://github.com/kubernetes/kubernetes/pull/93548), [@smarterclayton](https://github.com/smarterclayton)) [SIG CLI]
- When creating a networking.k8s.io/v1 Ingress API object, `spec.rules[*].http` values are now validated consistently when the `host` field contains a wildcard. ([#93954](https://github.com/kubernetes/kubernetes/pull/93954), [@Miciah](https://github.com/Miciah)) [SIG CLI, Cloud Provider, Cluster Lifecycle, Instrumentation, Network, Storage and Testing]

### Other (Cleanup or Flake)

- --cache-dir sets cache directory for both http and discovery, defaults to $HOME/.kube/cache ([#92910](https://github.com/kubernetes/kubernetes/pull/92910), [@soltysh](https://github.com/soltysh)) [SIG API Machinery and CLI]
- Adds a bootstrapping ClusterRole, ClusterRoleBinding and group for /metrics, /livez/*, /readyz/*, & /healthz/- endpoints. ([#93311](https://github.com/kubernetes/kubernetes/pull/93311), [@logicalhan](https://github.com/logicalhan)) [SIG API Machinery, Auth, Cloud Provider and Instrumentation]
- Base-images: Update to debian-iptables:buster-v1.3.0
  - Uses iptables 1.8.5
  - base-images: Update to debian-base:buster-v1.2.0
  - cluster/images/etcd: Build etcd:3.4.13-1 image
    - Uses debian-base:buster-v1.2.0 ([#94733](https://github.com/kubernetes/kubernetes/pull/94733), [@justaugustus](https://github.com/justaugustus)) [SIG API Machinery, Release and Testing]
- Build: Update to debian-base@v2.1.2 and debian-iptables@v12.1.1 ([#93667](https://github.com/kubernetes/kubernetes/pull/93667), [@justaugustus](https://github.com/justaugustus)) [SIG API Machinery, Release and Testing]
- Build: Update to debian-base@v2.1.3 and debian-iptables@v12.1.2 ([#93916](https://github.com/kubernetes/kubernetes/pull/93916), [@justaugustus](https://github.com/justaugustus)) [SIG API Machinery, Release and Testing]
- Build: Update to go-runner:buster-v2.0.0 ([#94167](https://github.com/kubernetes/kubernetes/pull/94167), [@justaugustus](https://github.com/justaugustus)) [SIG Release]
- Fix kubelet to properly log when a container is started. Before, sometimes the log said that a container is dead and was restarted when it was started for the first time. This only happened when using pods with initContainers and regular containers. ([#91469](https://github.com/kubernetes/kubernetes/pull/91469), [@rata](https://github.com/rata)) [SIG Node]
- Fix: license issue in blob disk feature ([#92824](https://github.com/kubernetes/kubernetes/pull/92824), [@andyzhangx](https://github.com/andyzhangx)) [SIG Cloud Provider]
- Fixes the flooding warning messages about setting volume ownership for configmap/secret volumes ([#92878](https://github.com/kubernetes/kubernetes/pull/92878), [@jvanz](https://github.com/jvanz)) [SIG Instrumentation, Node and Storage]
- Fixes the message about no auth for metrics in scheduler. ([#94035](https://github.com/kubernetes/kubernetes/pull/94035), [@zhouya0](https://github.com/zhouya0)) [SIG Scheduling]
- Kube-up: defaults to limiting critical pods to the kube-system namespace to match behavior prior to 1.17 ([#93121](https://github.com/kubernetes/kubernetes/pull/93121), [@liggitt](https://github.com/liggitt)) [SIG Cloud Provider and Scheduling]
- Kubeadm: Separate argument key/value in log msg ([#94016](https://github.com/kubernetes/kubernetes/pull/94016), [@mrueg](https://github.com/mrueg)) [SIG Cluster Lifecycle]
- Kubeadm: remove support for the "ci/k8s-master" version label. This label has been removed in the Kubernetes CI release process and would no longer work in kubeadm. You can use the "ci/latest" version label instead. See kubernetes/test-infra&#35;18517 ([#93626](https://github.com/kubernetes/kubernetes/pull/93626), [@vikkyomkar](https://github.com/vikkyomkar)) [SIG Cluster Lifecycle]
- Kubeadm: remove the CoreDNS check for known image digests when applying the addon ([#94506](https://github.com/kubernetes/kubernetes/pull/94506), [@neolit123](https://github.com/neolit123)) [SIG Cluster Lifecycle]
- Kubernetes is now built with go1.15.0 ([#93939](https://github.com/kubernetes/kubernetes/pull/93939), [@justaugustus](https://github.com/justaugustus)) [SIG Release and Testing]
- Kubernetes is now built with go1.15.0-rc.2 ([#93827](https://github.com/kubernetes/kubernetes/pull/93827), [@justaugustus](https://github.com/justaugustus)) [SIG API Machinery, CLI, Cloud Provider, Cluster Lifecycle, Instrumentation, Node, Release and Testing]
- Lock ExternalPolicyForExternalIP to default, this feature gate will be removed in 1.22. ([#94581](https://github.com/kubernetes/kubernetes/pull/94581), [@knabben](https://github.com/knabben)) [SIG Network]
- Service.beta.kubernetes.io/azure-load-balancer-disable-tcp-reset is removed.  All Standard load balancers will always enable tcp resets. ([#94297](https://github.com/kubernetes/kubernetes/pull/94297), [@MarcPow](https://github.com/MarcPow)) [SIG Cloud Provider]
- Stop propagating SelfLink (deprecated in 1.16) in kube-apiserver ([#94397](https://github.com/kubernetes/kubernetes/pull/94397), [@wojtek-t](https://github.com/wojtek-t)) [SIG API Machinery and Testing]
- Strip unnecessary security contexts on Windows ([#93475](https://github.com/kubernetes/kubernetes/pull/93475), [@ravisantoshgudimetla](https://github.com/ravisantoshgudimetla)) [SIG Node, Testing and Windows]
- To ensure the code be strong,  add unit test for GetAddressAndDialer ([#93180](https://github.com/kubernetes/kubernetes/pull/93180), [@FreeZhang61](https://github.com/FreeZhang61)) [SIG Node]
- Update CNI plugins to v0.8.7 ([#94367](https://github.com/kubernetes/kubernetes/pull/94367), [@justaugustus](https://github.com/justaugustus)) [SIG Cloud Provider, Network, Node, Release and Testing]
- Update Golang to v1.14.5
  - Update repo-infra to 0.0.7 (to support go1.14.5 and go1.13.13)
    - Includes:
      - bazelbuild/bazel-toolchains@3.3.2
      - bazelbuild/rules_go@v0.22.7 ([#93088](https://github.com/kubernetes/kubernetes/pull/93088), [@justaugustus](https://github.com/justaugustus)) [SIG Release and Testing]
- Update Golang to v1.14.6
  - Update repo-infra to 0.0.8 (to support go1.14.6 and go1.13.14)
    - Includes:
      - bazelbuild/bazel-toolchains@3.4.0
      - bazelbuild/rules_go@v0.22.8 ([#93198](https://github.com/kubernetes/kubernetes/pull/93198), [@justaugustus](https://github.com/justaugustus)) [SIG Release and Testing]
- Update cri-tools to [v1.19.0](https://github.com/kubernetes-sigs/cri-tools/releases/tag/v1.19.0) ([#94307](https://github.com/kubernetes/kubernetes/pull/94307), [@xmudrii](https://github.com/xmudrii)) [SIG Cloud Provider]
- Update default etcd server version to 3.4.9 ([#92349](https://github.com/kubernetes/kubernetes/pull/92349), [@jingyih](https://github.com/jingyih)) [SIG API Machinery, Cloud Provider, Cluster Lifecycle and Testing]
- Update etcd client side to v3.4.13 ([#94259](https://github.com/kubernetes/kubernetes/pull/94259), [@jingyih](https://github.com/jingyih)) [SIG API Machinery and Cloud Provider]
- `kubectl get ingress` now prefers the `networking.k8s.io/v1` over `extensions/v1beta1` (deprecated since v1.14). To explicitly request the deprecated version, use `kubectl get ingress.v1beta1.extensions`. ([#94309](https://github.com/kubernetes/kubernetes/pull/94309), [@liggitt](https://github.com/liggitt)) [SIG API Machinery and CLI]

## Dependencies

### Added
- github.com/Azure/go-autorest: [v14.2.0+incompatible](https://github.com/Azure/go-autorest/tree/v14.2.0)
- github.com/fvbommel/sortorder: [v1.0.1](https://github.com/fvbommel/sortorder/tree/v1.0.1)
- github.com/yuin/goldmark: [v1.1.27](https://github.com/yuin/goldmark/tree/v1.1.27)
- sigs.k8s.io/structured-merge-diff/v4: v4.0.1

### Changed
- github.com/Azure/go-autorest/autorest/adal: [v0.8.2 → v0.9.0](https://github.com/Azure/go-autorest/autorest/adal/compare/v0.8.2...v0.9.0)
- github.com/Azure/go-autorest/autorest/date: [v0.2.0 → v0.3.0](https://github.com/Azure/go-autorest/autorest/date/compare/v0.2.0...v0.3.0)
- github.com/Azure/go-autorest/autorest/mocks: [v0.3.0 → v0.4.0](https://github.com/Azure/go-autorest/autorest/mocks/compare/v0.3.0...v0.4.0)
- github.com/Azure/go-autorest/autorest: [v0.9.6 → v0.11.1](https://github.com/Azure/go-autorest/autorest/compare/v0.9.6...v0.11.1)
- github.com/Azure/go-autorest/logger: [v0.1.0 → v0.2.0](https://github.com/Azure/go-autorest/logger/compare/v0.1.0...v0.2.0)
- github.com/Azure/go-autorest/tracing: [v0.5.0 → v0.6.0](https://github.com/Azure/go-autorest/tracing/compare/v0.5.0...v0.6.0)
- github.com/Microsoft/hcsshim: [v0.8.9 → 5eafd15](https://github.com/Microsoft/hcsshim/compare/v0.8.9...5eafd15)
- github.com/cilium/ebpf: [9f1617e → 1c8d4c9](https://github.com/cilium/ebpf/compare/9f1617e...1c8d4c9)
- github.com/containerd/cgroups: [bf292b2 → 0dbf7f0](https://github.com/containerd/cgroups/compare/bf292b2...0dbf7f0)
- github.com/coredns/corefile-migration: [v1.0.8 → v1.0.10](https://github.com/coredns/corefile-migration/compare/v1.0.8...v1.0.10)
- github.com/evanphx/json-patch: [e83c0a1 → v4.9.0+incompatible](https://github.com/evanphx/json-patch/compare/e83c0a1...v4.9.0)
- github.com/google/cadvisor: [8450c56 → v0.37.0](https://github.com/google/cadvisor/compare/8450c56...v0.37.0)
- github.com/json-iterator/go: [v1.1.9 → v1.1.10](https://github.com/json-iterator/go/compare/v1.1.9...v1.1.10)
- github.com/opencontainers/go-digest: [v1.0.0-rc1 → v1.0.0](https://github.com/opencontainers/go-digest/compare/v1.0.0-rc1...v1.0.0)
- github.com/opencontainers/runc: [1b94395 → 819fcc6](https://github.com/opencontainers/runc/compare/1b94395...819fcc6)
- github.com/prometheus/client_golang: [v1.6.0 → v1.7.1](https://github.com/prometheus/client_golang/compare/v1.6.0...v1.7.1)
- github.com/prometheus/common: [v0.9.1 → v0.10.0](https://github.com/prometheus/common/compare/v0.9.1...v0.10.0)
- github.com/prometheus/procfs: [v0.0.11 → v0.1.3](https://github.com/prometheus/procfs/compare/v0.0.11...v0.1.3)
- github.com/rubiojr/go-vhd: [0bfd3b3 → 02e2102](https://github.com/rubiojr/go-vhd/compare/0bfd3b3...02e2102)
- github.com/storageos/go-api: [343b3ef → v2.2.0+incompatible](https://github.com/storageos/go-api/compare/343b3ef...v2.2.0)
- github.com/urfave/cli: [v1.22.1 → v1.22.2](https://github.com/urfave/cli/compare/v1.22.1...v1.22.2)
- go.etcd.io/etcd: 54ba958 → dd1b699
- golang.org/x/crypto: bac4c82 → 75b2880
- golang.org/x/mod: v0.1.0 → v0.3.0
- golang.org/x/net: d3edc99 → ab34263
- golang.org/x/tools: c00d67e → c1934b7
- k8s.io/kube-openapi: 656914f → 6aeccd4
- k8s.io/system-validators: v1.1.2 → v1.2.0
- k8s.io/utils: 6e3d28b → d5654de

### Removed
- github.com/godbus/dbus: [ade71ed](https://github.com/godbus/dbus/tree/ade71ed)
- github.com/xlab/handysort: [fb3537e](https://github.com/xlab/handysort/tree/fb3537e)
- sigs.k8s.io/structured-merge-diff/v3: v3.0.0
- vbom.ml/util: db5cfe1
