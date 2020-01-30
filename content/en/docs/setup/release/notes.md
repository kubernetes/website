---
title: v1.17 Release Notes
weight: 10
card:
  name: download
  weight: 20
  anchors:
  - anchor: "#"
    title: Current Release Notes
  - anchor: "#urgent-upgrade-notes"
    title: Urgent Upgrade Notes
---

<!-- NEW RELEASE NOTES ENTRY -->

# v1.17.0

[Documentation](https://docs.k8s.io)

## Downloads for v1.17.0

| filename                                                                 | sha512 hash                                                                                                                        |
| ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| [kubernetes.tar.gz](https://dl.k8s.io/v1.17.0/kubernetes.tar.gz)         | `68d5af15901281954de01164426cfb5ca31c14341387fad34d0cb9aa5f40c932ad44f0de4f987caf2be6bdcea2051e589d25878cf4f9ac0ee73048029a11825f` |
| [kubernetes-src.tar.gz](https://dl.k8s.io/v1.17.0/kubernetes-src.tar.gz) | `5424576d7f7936df15243fee0036e7936d2d6224e98ac805ce96cdf7b83a7c5b66dfffc8823d7bc0c17c700fa3c01841208e8cf89be91d237d12e18f3d2f307c` |

### Client Binaries

| filename                                                                                                   | sha512 hash                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.17.0/kubernetes-client-darwin-386.tar.gz)       | `4c9a06409561b8ecc8901d0b88bc955ab8b8c99256b3f6066811539211cff5ba7fb9e3802ac2d8b00a14ce619fa82aeebe83eae9f4b0774bedabd3da0235b78b` |
| [kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.17.0/kubernetes-client-darwin-amd64.tar.gz)   | `78ce6875c5f5a03bc057e7194fd1966beb621f825ba786d35a9921ab1ae33ed781d0f93a473a6b985da1ba4fbe95c15b23cdca9e439dfd653dbcf5a2b23d1a73` |
| [kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.17.0/kubernetes-client-linux-386.tar.gz)         | `7a4bcd7d06d0f4ba929451f652c92a3c4d428f9b38ed83093f076bb25699b9c4e82f8f851ab981e68becbf10b148ddab4f7dce3743e84d642baa24c00312a2aa` |
| [kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.17.0/kubernetes-client-linux-amd64.tar.gz)     | `7f9fc9ac07e9acbf12b58ae9077a8ce1f7fb4b5ceccd3856b55d2beb5e435d4fd27884c10ffdf3e2e18cafd4acc001ed5cf2a0a9a5b0545d9be570f63012d9c0` |
| [kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.17.0/kubernetes-client-linux-arm.tar.gz)         | `8f74fff80a000cfaefa2409bdce6fd0d546008c7942a7178a4fa88a9b3ca05d10f34352e2ea2aec5297aa5c630c2b9701b507273c0ed0ddc0c297e57b655d62e` |
| [kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.17.0/kubernetes-client-linux-arm64.tar.gz)     | `18d92b320f138f5080f98f1ffee20e405187549ab3aad55b7f60f02e3b7f5a44eb9826098576b42937fd0aac01fe6bcae36b5a8ee52ddde3571a1281b279c114` |
| [kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.17.0/kubernetes-client-linux-ppc64le.tar.gz) | `fd9b15a88b3d5a506a84ebfb56de291b85978b14f61a2c05f4bdb6a7e45a36f92af5a024a6178dbebd82a92574ec6d8cf9d8ac912f868f757649a2a8434011fe` |
| [kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.17.0/kubernetes-client-linux-s390x.tar.gz)     | `ae3b284a78975cbfccaac04ea802085c31fd75cccf4ece3a983f44faf755dd94c43833e60f52c5ea57bc462cb24268ef4b7246876189113f588a012dd58e9630` |
| [kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.17.0/kubernetes-client-windows-386.tar.gz)     | `4ba83b068e7f4a203bcc5cc8bb2c456a6a9c468e695f86f69d8f2ac81be9a1ce156f9a2f28286cb7eb0480faac397d964821c009473bdb443d84a30b6d020551` |
| [kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.17.0/kubernetes-client-windows-amd64.tar.gz) | `fc79b0e926a823c7d8b9010dee0c559587b7f97c9290b2126d517c4272891ce36e310a64c85f3861a1c951da8dc21f46244a59ff9d52b7b7a3f84879f533e6aa` |

### Server Binaries

| filename                                                                                                   | sha512 hash                                                                                                                        |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| [kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.17.0/kubernetes-server-linux-amd64.tar.gz)     | `28b2703c95894ab0565e372517c4a4b2c33d1be3d778fae384a6ab52c06cea7dd7ec80060dbdba17c8ab23bbedcde751cccee7657eba254f7d322cf7c4afc701` |
| [kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.17.0/kubernetes-server-linux-arm.tar.gz)         | `b36a9f602131dba23f267145399aad0b19e97ab7b5194b2e3c01c57f678d7b0ea30c1ea6b4c15fd87b1fd3bf06abd4ec443bef5a3792c0d813356cdeb3b6a935` |
| [kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.17.0/kubernetes-server-linux-arm64.tar.gz)     | `42adae077603f25b194e893f15e7f415011f25e173507a190bafbee0d0e86cdd6ee8f11f1bcf0a5366e845bd968f92e5bf66785f20c1125c801cf3ec9850d0bd` |
| [kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.17.0/kubernetes-server-linux-ppc64le.tar.gz) | `7e72d4255e661e946203c1c0c684cd0923034eb112c35e3ba08fbf9d1ef5e8bb291840c6ff99aea6180083846f9a9ba88387e176ee7a5def49e1d19366e2789f` |
| [kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.17.0/kubernetes-server-linux-s390x.tar.gz)     | `00bc634654ec7d1ec2eca7a3e943ac287395503a06c8da22b7efb3a35435ceb323618c6d9931d6693bfb19f2b8467ae8f05f98392df8ee4954556c438409c8d4` |

### Node Binaries

| filename                                                                                               | sha512 hash                                                                                                                        |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| [kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.17.0/kubernetes-node-linux-amd64.tar.gz)     | `49ef6a41c65b3f26a4f3ffe63b92c8096c26aa27a89d227d935bc06a497c97505ad8bc215b4c5d5ad3af6489c1366cd26ecc8e2781a83f46a91503678abba71b` |
| [kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.17.0/kubernetes-node-linux-arm.tar.gz)         | `21a213fd572200998bdd71f5ebbb96576fc7a7e7cfb1469f028cc1a310bc2b5c0ce32660629beb166b88f54e6ebecb2022b2ed1fdb902a9b9d5acb193d76fa0f` |
| [kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.17.0/kubernetes-node-linux-arm64.tar.gz)     | `3642ee5e7476080a44005db8e7282fdbe4e4f220622761b95951c2c15b3e10d7b70566bfb7a9a58574f3fc385d5aae80738d88195fa308a07f199cee70f912f4` |
| [kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.17.0/kubernetes-node-linux-ppc64le.tar.gz) | `99687088be50a794894911d43827b7e1125fbc86bfba799f77c096ddaa5b2341b31d009b8063a177e503ce2ce0dafbda1115216f8a5777f34e0e2d81f0114104` |
| [kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.17.0/kubernetes-node-linux-s390x.tar.gz)     | `73b9bc356de43fbed7d3294be747b83e0aac47051d09f1df7be52c33be670b63c2ea35856a483ebc2f57e30a295352b77f1b1a6728afa10ec1f3338cafbdb2bb` |
| [kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.17.0/kubernetes-node-windows-amd64.tar.gz) | `2fbc80f928231f60a5a7e4f427953ef17244b3a8f6fdeebcbfceb05b0587b84933fa723898c64488d94b9ce180357d6d4ca1505ca3c3c7fb11067b7b3bf6361b` |

# Changes

A complete changelog for the release notes is now hosted in a customizable format at [relnotes.k8s.io](https://relnotes.k8s.io). Check it out and please give us your feedback!

## What’s New (Major Themes)

### Cloud Provider Labels reach General Availability

Added as a beta feature way back in v1.2, v1.17 sees the general availability of cloud provider labels.

### Volume Snapshot Moves to Beta

The Kubernetes Volume Snapshot feature is now beta in Kubernetes v1.17. It was introduced as alpha in Kubernetes v1.12, with a second alpha with breaking changes in Kubernetes v1.13.

### CSI Migration Beta

The Kubernetes in-tree storage plugin to Container Storage Interface (CSI) migration infrastructure is now beta in Kubernetes v1.17. CSI migration was introduced as alpha in Kubernetes v1.14.

## Known Issues

- volumeDevices mapping ignored when container is privileged
- The `Should recreate evicted statefulset` conformance [test](https://github.com/kubernetes/kubernetes/blob/master/test/e2e/apps/statefulset.go) fails because `Pod ss-0 expected to be re-created at least once`. This was caused by the `Predicate PodFitsHostPorts failed` scheduling error. The root cause was a host port conflict for port `21017`. This port was in-use as an ephemeral port by another application running on the node. This will be looked at for the 1.18 release.
- client-go discovery clients constructed using `NewDiscoveryClientForConfig` or `NewDiscoveryClientForConfigOrDie` default to rate limits that cause normal discovery request patterns to take several seconds. This is fixed in https://issue.k8s.io/86168 and will be resolved in v1.17.1. As a workaround, the `Burst` value can be adjusted higher in the rest.Config passed into `NewDiscoveryClientForConfig` or `NewDiscoveryClientForConfigOrDie`.
- The IP allocator in v1.17.0 can return errors such as `the cluster IP <ip> for service <service-name> is not within the service CIDR <cidr>; please recreate` in the logs of the kube-apiserver. The cause is incorrect CIDR calculations if the service CIDR (`--service-cluster-ip-range`) is set to bits lower than `/16`. This is fixed in http://issue.k8s.io/86534 and will be resolved in v1.17.1.

## Urgent Upgrade Notes

### (No, really, you MUST read this before you upgrade)

#### Cluster Lifecycle

- Kubeadm: add a new `kubelet-finalize` phase as part of the `init` workflow and an experimental sub-phase to enable automatic kubelet client certificate rotation on primary control-plane nodes.
  Prior to 1.17 and for existing nodes created by `kubeadm init` where kubelet client certificate rotation is desired, you must modify `/etc/kubernetes/kubelet.conf` to point to the PEM symlink for rotation:
  `client-certificate: /var/lib/kubelet/pki/kubelet-client-current.pem` and `client-key: /var/lib/kubelet/pki/kubelet-client-current.pem`, replacing the embedded client certificate and key. ([#84118](https://github.com/kubernetes/kubernetes/pull/84118), [@neolit123](https://github.com/neolit123))

#### Network

- EndpointSlices: If upgrading a cluster with EndpointSlices already enabled, any EndpointSlices that should be managed by the EndpointSlice controller should have a `http://endpointslice.kubernetes.io/managed-by` label set to `endpointslice-controller.k8s.io`.

#### Scheduling

- Kubeadm: when adding extra apiserver authorization-modes, the defaults `Node,RBAC` are no longer prepended in the resulting static Pod manifests and a full override is allowed. ([#82616](https://github.com/kubernetes/kubernetes/pull/82616), [@ghouscht](https://github.com/ghouscht))

#### Storage

- A node that uses a CSI raw block volume needs to be drained before kubelet can be upgraded to 1.17. ([#74026](https://github.com/kubernetes/kubernetes/pull/74026), [@mkimuram](https://github.com/mkimuram))

#### Windows

- The Windows containers RunAsUsername feature is now beta.
- Windows worker nodes in a Kubernetes cluster now support Windows Server version 1903 in addition to the existing support for Windows Server 2019
- The RuntimeClass scheduler can now simplify steering Linux or Windows pods to appropriate nodes
- All Windows nodes now get the new label `node.kubernetes.io/windows-build` that reflects the Windows major, minor, and build number that are needed to match compatibility between Windows containers and Windows worker nodes.

## Deprecations and Removals

- `kubeadm.k8s.io/v1beta1` has been deprecated, you should update your config to use newer non-deprecated API versions. ([#83276](https://github.com/kubernetes/kubernetes/pull/83276), [@Klaven](https://github.com/Klaven))
- The deprecated feature gates GCERegionalPersistentDisk, EnableAggregatedDiscoveryTimeout and PersistentLocalVolumes are now unconditionally enabled and can no longer be specified in component invocations. ([#82472](https://github.com/kubernetes/kubernetes/pull/82472), [@draveness](https://github.com/draveness))
- Deprecate the default service IP CIDR. The previous default was `10.0.0.0/24` which will be removed in 6 months/2 releases. Cluster admins must specify their own desired value, by using `--service-cluster-ip-range` on kube-apiserver. ([#81668](https://github.com/kubernetes/kubernetes/pull/81668), [@darshanime](https://github.com/darshanime))
- Remove deprecated "include-uninitialized" flag. ([#80337](https://github.com/kubernetes/kubernetes/pull/80337), [@draveness](https://github.com/draveness))
- All resources within the `rbac.authorization.k8s.io/v1alpha1` and `rbac.authorization.k8s.io/v1beta1` API groups are deprecated in favor of `rbac.authorization.k8s.io/v1`, and will no longer be served in v1.20. ([#84758](https://github.com/kubernetes/kubernetes/pull/84758), [@liggitt](https://github.com/liggitt))
- The certificate signer no longer accepts ca.key passwords via the `CFSSL_CA_PK_PASSWORD` environment variable. This capability was not prompted by user request, never advertised, and recommended against in the security audit. ([#84677](https://github.com/kubernetes/kubernetes/pull/84677), [@mikedanese](https://github.com/mikedanese))
- Deprecate the instance type beta label (`beta.kubernetes.io/instance-type`) in favor of its GA equivalent: `node.kubernetes.io/instance-type` ([#82049](https://github.com/kubernetes/kubernetes/pull/82049), [@andrewsykim](https://github.com/andrewsykim))
- The built-in system:csi-external-provisioner and system:csi-external-attacher cluster roles are removed as of 1.17 release ([#84282](https://github.com/kubernetes/kubernetes/pull/84282), [@tedyu](https://github.com/tedyu))
- The in-tree GCE PD plugin `kubernetes.io/gce-pd` is now deprecated and will be removed in 1.21. Users that self-deploy Kubernetes on GCP should enable CSIMigration + CSIMigrationGCE features and install the GCE PD CSI Driver (https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver) to avoid disruption to existing Pod and PVC objects at that time. Users should start using the GCE PD CSI CSI Driver directly for any new volumes. ([#85231](https://github.com/kubernetes/kubernetes/pull/85231), [@davidz627](https://github.com/davidz627))
- The in-tree AWS EBS plugin `kubernetes.io/aws-ebs` is now deprecated and will be removed in 1.21. Users that self-deploy Kubernetes on AWS should enable CSIMigration + CSIMigrationAWS features and install the AWS EBS CSI Driver (https://github.com/kubernetes-sigs/aws-ebs-csi-driver) to avoid disruption to existing Pod and PVC objects at that time. Users should start using the AWS EBS CSI CSI Driver directly for any new volumes. ([#85237](https://github.com/kubernetes/kubernetes/pull/85237), [@leakingtapan](https://github.com/leakingtapan))
- The CSINodeInfo feature gate is deprecated and will be removed in a future release. The storage.k8s.io/v1beta1 CSINode object is deprecated and will be removed in a future release. ([#83474](https://github.com/kubernetes/kubernetes/pull/83474), [@msau42](https://github.com/msau42))
- Removed Alpha feature `MountContainers` ([#84365](https://github.com/kubernetes/kubernetes/pull/84365), [@codenrhoden](https://github.com/codenrhoden))
- Removed plugin watching of the deprecated directory `{kubelet_root_dir}/plugins` and CSI V0 support in accordance with deprecation announcement in https://v1-13.docs.kubernetes.io/docs/setup/release/notes ([#84533](https://github.com/kubernetes/kubernetes/pull/84533), [@davidz627](https://github.com/davidz627))
- kubeadm deprecates the use of the hyperkube image ([#85094](https://github.com/kubernetes/kubernetes/pull/85094), [@rosti](https://github.com/rosti))

## Metrics Changes

### Added metrics

- Add `scheduler_goroutines` metric to track number of kube-scheduler binding and prioritizing goroutines ([#83535](https://github.com/kubernetes/kubernetes/pull/83535), [@wgliang](https://github.com/wgliang))
- Adding initial EndpointSlice metrics. ([#83257](https://github.com/kubernetes/kubernetes/pull/83257), [@robscott](https://github.com/robscott))
- Adds a metric `apiserver_request_error_total` to kube-apiserver. This metric tallies the number of `request_errors` encountered by verb, group, version, resource, subresource, scope, component, and code. ([#83427](https://github.com/kubernetes/kubernetes/pull/83427), [@logicalhan](https://github.com/logicalhan))
- A new `kubelet_preemptions` metric is reported from Kubelets to track the number of preemptions occurring over time, and which resource is triggering those preemptions. ([#84120](https://github.com/kubernetes/kubernetes/pull/84120), [@smarterclayton](https://github.com/smarterclayton))
- Kube-apiserver: Added metrics `authentication_latency_seconds` that can be used to understand the latency of authentication. ([#82409](https://github.com/kubernetes/kubernetes/pull/82409), [@RainbowMango](https://github.com/RainbowMango))
- Add `plugin_execution_duration_seconds` metric for scheduler framework plugins. ([#84522](https://github.com/kubernetes/kubernetes/pull/84522), [@liu-cong](https://github.com/liu-cong))
- Add `permit_wait_duration_seconds` metric to the scheduler. ([#84011](https://github.com/kubernetes/kubernetes/pull/84011), [@liu-cong](https://github.com/liu-cong))

### Deprecated/changed metrics

- etcd version monitor metrics are now marked as with the ALPHA stability level. ([#83283](https://github.com/kubernetes/kubernetes/pull/83283), [@RainbowMango](https://github.com/RainbowMango))
- Change `pod_preemption_victims` metric from Gauge to Histogram. ([#83603](https://github.com/kubernetes/kubernetes/pull/83603), [@Tabrizian](https://github.com/Tabrizian))
- Following metrics from kubelet are now marked as with the ALPHA stability level:
  `kubelet_container_log_filesystem_used_bytes`
  `kubelet_volume_stats_capacity_bytes`
  `kubelet_volume_stats_available_bytes`
  `kubelet_volume_stats_used_bytes`
  `kubelet_volume_stats_inodes`
  `kubelet_volume_stats_inodes_free`
  `kubelet_volume_stats_inodes_used`
  `plugin_manager_total_plugins`
  `volume_manager_total_volumes`
  ([#84907](https://github.com/kubernetes/kubernetes/pull/84907), [@RainbowMango](https://github.com/RainbowMango))
- Deprecated metric `rest_client_request_latency_seconds` has been turned off. ([#83836](https://github.com/kubernetes/kubernetes/pull/83836), [@RainbowMango](https://github.com/RainbowMango))
- Following metrics from kubelet are now marked as with the ALPHA stability level:
  `node_cpu_usage_seconds_total`
  `node_memory_working_set_bytes`
  `container_cpu_usage_seconds_total`
  `container_memory_working_set_bytes`
  `scrape_error`
  ([#84987](https://github.com/kubernetes/kubernetes/pull/84987), [@RainbowMango](https://github.com/RainbowMango))
- Deprecated prometheus request meta-metrics have been removed
  `http_request_duration_microseconds` `http_request_duration_microseconds_sum` `http_request_duration_microseconds_count`
  `http_request_size_bytes`
  `http_request_size_bytes_sum`
  `http_request_size_bytes_count`
  `http_requests_total, http_response_size_bytes`
  `http_response_size_bytes_sum`
  `http_response_size_bytes_count`
  due to removal from the prometheus client library. Prometheus http request meta-metrics are now generated from [`promhttp.InstrumentMetricHandler`](https://godoc.org/github.com/prometheus/client_golang/prometheus/promhttp#InstrumentMetricHandler) instead.
- Following metrics from kube-controller-manager are now marked as with the ALPHA stability level:
  `storage_count_attachable_volumes_in_use`
  `attachdetach_controller_total_volumes`
  `pv_collector_bound_pv_count`
  `pv_collector_unbound_pv_count`
  `pv_collector_bound_pvc_count`
  `pv_collector_unbound_pvc_count`
  ([#84896](https://github.com/kubernetes/kubernetes/pull/84896), [@RainbowMango](https://github.com/RainbowMango))
- Following metrics have been turned off:
  `apiserver_request_count`
  `apiserver_request_latencies`
  `apiserver_request_latencies_summary`
  `apiserver_dropped_requests`
  `etcd_request_latencies_summary`
  `apiserver_storage_transformation_latencies_microseconds`
  `apiserver_storage_data_key_generation_latencies_microseconds`
  `apiserver_storage_transformation_failures_total`
  ([#83837](https://github.com/kubernetes/kubernetes/pull/83837), [@RainbowMango](https://github.com/RainbowMango))
- Following metrics have been turned off:
  `scheduler_scheduling_latency_seconds`
  `scheduler_e2e_scheduling_latency_microseconds`
  `scheduler_scheduling_algorithm_latency_microseconds`
  `scheduler_scheduling_algorithm_predicate_evaluation`
  `scheduler_scheduling_algorithm_priority_evaluation`
  `scheduler_scheduling_algorithm_preemption_evaluation`
  `scheduler_scheduling_binding_latency_microseconds ([#83838](https://github.com/kubernetes/kubernetes/pull/83838`), [@RainbowMango](https://github.com/RainbowMango))
- Deprecated metric `kubeproxy_sync_proxy_rules_latency_microseconds` has been turned off. ([#83839](https://github.com/kubernetes/kubernetes/pull/83839), [@RainbowMango](https://github.com/RainbowMango))

## Notable Features

### Stable

- Graduate ScheduleDaemonSetPods to GA. (feature gate will be removed in 1.18) ([#82795](https://github.com/kubernetes/kubernetes/pull/82795), [@draveness](https://github.com/draveness))
- Graduate TaintNodesByCondition to GA in 1.17. (feature gate will be removed in 1.18) ([#82703](https://github.com/kubernetes/kubernetes/pull/82703), [@draveness](https://github.com/draveness))
- The WatchBookmark feature is promoted to GA. With WatchBookmark feature, clients are able to request watch events with BOOKMARK type. See https://kubernetes.io/docs/reference/using-api/api-concepts/#watch-bookmarks for more details. ([#83195](https://github.com/kubernetes/kubernetes/pull/83195), [@wojtek-t](https://github.com/wojtek-t))
- Promote NodeLease feature to GA.
  The feature make Lease object changes an additional healthiness signal from Node. Together with that, we reduce frequency of NodeStatus updates to 5m by default in case of no changes to status itself ([#84351](https://github.com/kubernetes/kubernetes/pull/84351), [@wojtek-t](https://github.com/wojtek-t))
- CSI Topology feature is GA. ([#83474](https://github.com/kubernetes/kubernetes/pull/83474), [@msau42](https://github.com/msau42))
- The VolumeSubpathEnvExpansion feature is graduating to GA. The `VolumeSubpathEnvExpansion` feature gate is unconditionally enabled, and will be removed in v1.19. ([#82578](https://github.com/kubernetes/kubernetes/pull/82578), [@kevtaylor](https://github.com/kevtaylor))
- Node-specific volume limits has graduated to GA. ([#83568](https://github.com/kubernetes/kubernetes/pull/83568), [@bertinatto](https://github.com/bertinatto))
- The ResourceQuotaScopeSelectors feature has graduated to GA. The `ResourceQuotaScopeSelectors` feature gate is now unconditionally enabled and will be removed in 1.18. ([#82690](https://github.com/kubernetes/kubernetes/pull/82690), [@draveness](https://github.com/draveness))

### Beta

- The Kubernetes Volume Snapshot feature has been moved to beta. The VolumeSnapshotDataSource feature gate is on by default in this release. This feature enables you to take a snapshot of a volume (if supported by the CSI driver), and use the snapshot to provision a new volume, pre-populated with data from the snapshot.
- Feature gates CSIMigration to Beta (on by default) and CSIMigrationGCE to Beta (off by default since it requires installation of the GCE PD CSI Driver) ([#85231](https://github.com/kubernetes/kubernetes/pull/85231), [@davidz627](https://github.com/davidz627))
- EndpointSlices are now beta but not yet enabled by default. Use the EndpointSlice feature gate to enable this feature. ([#85365](https://github.com/kubernetes/kubernetes/pull/85365), [@robscott](https://github.com/robscott))
- Promote CSIMigrationAWS to Beta (off by default since it requires installation of the AWS EBS CSI Driver) ([#85237](https://github.com/kubernetes/kubernetes/pull/85237), [@leakingtapan](https://github.com/leakingtapan))
- Moving Windows RunAsUserName feature to beta ([#84882](https://github.com/kubernetes/kubernetes/pull/84882), [@marosset](https://github.com/marosset))

### CLI Improvements

- The kubectl's api-resource command now has a `--sort-by` flag to sort resources by name or kind. ([#81971](https://github.com/kubernetes/kubernetes/pull/81971), [@laddng](https://github.com/laddng))
- A new `--prefix` flag added into kubectl logs which prepends each log line with information about it's source (pod name and container name) ([#76471](https://github.com/kubernetes/kubernetes/pull/76471), [@m1kola](https://github.com/m1kola))

## API Changes

- CustomResourceDefinitions now validate documented API semantics of `x-kubernetes-list-type` and `x-kubernetes-map-type` atomic to reject non-atomic sub-types. ([#84722](https://github.com/kubernetes/kubernetes/pull/84722), [@sttts](https://github.com/sttts))
- Kube-apiserver: The `AdmissionConfiguration` type accepted by `--admission-control-config-file` has been promoted to `apiserver.config.k8s.io/v1` with no schema changes. ([#85098](https://github.com/kubernetes/kubernetes/pull/85098), [@liggitt](https://github.com/liggitt))
- Fixed EndpointSlice port name validation to match Endpoint port name validation (allowing port names longer than 15 characters) ([#84481](https://github.com/kubernetes/kubernetes/pull/84481), [@robscott](https://github.com/robscott))
- CustomResourceDefinitions introduce `x-kubernetes-map-type` annotation as a CRD API extension. Enables this particular validation for server-side apply. ([#84113](https://github.com/kubernetes/kubernetes/pull/84113), [@enxebre](https://github.com/enxebre))

## Other notable changes

### API Machinery

- kube-apiserver: the `--runtime-config` flag now supports an `api/beta=false` value which disables all built-in REST API versions matching `v[0-9]+beta[0-9]+`. ([#84304](https://github.com/kubernetes/kubernetes/pull/84304), [@liggitt](https://github.com/liggitt))
  The `--feature-gates` flag now supports an `AllBeta=false` value which disables all beta feature gates. ([#84304](https://github.com/kubernetes/kubernetes/pull/84304), [@liggitt](https://github.com/liggitt))
- New flag `--show-hidden-metrics-for-version` in kube-apiserver can be used to show all hidden metrics that deprecated in the previous minor release. ([#84292](https://github.com/kubernetes/kubernetes/pull/84292), [@RainbowMango](https://github.com/RainbowMango))
- kube-apiserver: Authentication configuration for mutating and validating admission webhooks referenced from an `--admission-control-config-file` can now be specified with `apiVersion: apiserver.config.k8s.io/v1, kind: WebhookAdmissionConfiguration`. ([#85138](https://github.com/kubernetes/kubernetes/pull/85138), [@liggitt](https://github.com/liggitt))
- kube-apiserver: The `ResourceQuota` admission plugin configuration referenced from `--admission-control-config-file` admission config has been promoted to `apiVersion: apiserver.config.k8s.io/v1`, `kind: ResourceQuotaConfiguration` with no schema changes. ([#85099](https://github.com/kubernetes/kubernetes/pull/85099), [@liggitt](https://github.com/liggitt))
- kube-apiserver: fixed a bug that could cause a goroutine leak if the apiserver encountered an encoding error serving a watch to a websocket watcher ([#84693](https://github.com/kubernetes/kubernetes/pull/84693), [@tedyu](https://github.com/tedyu))
- Fix the bug that EndpointSlice for masters wasn't created after enabling EndpointSlice feature on a pre-existing cluster. ([#84421](https://github.com/kubernetes/kubernetes/pull/84421), [@tnqn](https://github.com/tnqn))
- Switched intstr.Type to sized integer to follow API guidelines and improve compatibility with proto libraries ([#83956](https://github.com/kubernetes/kubernetes/pull/83956), [@liggitt](https://github.com/liggitt))
- Client-go: improved allocation behavior of the delaying workqueue when handling objects with far-future ready times. ([#83945](https://github.com/kubernetes/kubernetes/pull/83945), [@barkbay](https://github.com/barkbay))
- Fixed an issue with informers missing an `Added` event if a recently deleted object was immediately recreated at the same time the informer dropped a watch and relisted. ([#83911](https://github.com/kubernetes/kubernetes/pull/83911), [@matte21](https://github.com/matte21))
- Fixed panic when accessing CustomResources of a CRD with `x-kubernetes-int-or-string`. ([#83787](https://github.com/kubernetes/kubernetes/pull/83787), [@sttts](https://github.com/sttts))
- The resource version option, when passed to a list call, is now consistently interpreted as the minimum allowed resource version. Previously when listing resources that had the watch cache disabled clients could retrieve a snapshot at that exact resource version. If the client requests a resource version newer than the current state, a TimeoutError is returned suggesting the client retry in a few seconds. This behavior is now consistent for both single item retrieval and list calls, and for when the watch cache is enabled or disabled. ([#72170](https://github.com/kubernetes/kubernetes/pull/72170), [@jpbetz](https://github.com/jpbetz))
- Fixes a goroutine leak in kube-apiserver when a request times out. ([#83333](https://github.com/kubernetes/kubernetes/pull/83333), [@lavalamp](https://github.com/lavalamp))
- Fixes the bug in informer-gen that it produces incorrect code if a type has nonNamespaced tag set. ([#80458](https://github.com/kubernetes/kubernetes/pull/80458), [@tatsuhiro-t](https://github.com/tatsuhiro-t))
- Resolves bottleneck in internal API server communication that can cause increased goroutines and degrade API Server performance ([#80465](https://github.com/kubernetes/kubernetes/pull/80465), [@answer1991](https://github.com/answer1991))
- Resolves regression generating informers for packages whose names contain `.` characters ([#82410](https://github.com/kubernetes/kubernetes/pull/82410), [@nikhita](https://github.com/nikhita))
- Resolves issue with `/readyz` and `/livez` not including etcd and kms health checks ([#82713](https://github.com/kubernetes/kubernetes/pull/82713), [@logicalhan](https://github.com/logicalhan))
- Fixes regression in logging spurious stack traces when proxied connections are closed by the backend ([#82588](https://github.com/kubernetes/kubernetes/pull/82588), [@liggitt](https://github.com/liggitt))
- Kube-apiserver now reloads serving certificates from disk every minute to allow rotation without restarting the server process ([#84200](https://github.com/kubernetes/kubernetes/pull/84200), [@jackkleeman](https://github.com/jackkleeman))
- Client-ca bundles for the all generic-apiserver based servers will dynamically reload from disk on content changes ([#83579](https://github.com/kubernetes/kubernetes/pull/83579), [@deads2k](https://github.com/deads2k))
- Client-go: Clients can request protobuf and json and correctly negotiate with the server for JSON for CRD objects, allowing all client libraries to request protobuf if it is available. If an error occurs negotiating a watch with the server, the error is immediately return by the client `Watch()` method instead of being sent as an `Error` event on the watch stream. ([#84692](https://github.com/kubernetes/kubernetes/pull/84692), [@smarterclayton](https://github.com/smarterclayton))
  Renamed FeatureGate RequestManagement to APIPriorityAndFairness. This feature gate is an alpha and has not yet been associated with any actual functionality. ([#85260](https://github.com/kubernetes/kubernetes/pull/85260), [@MikeSpreitzer](https://github.com/MikeSpreitzer))
- Filter published OpenAPI schema by making nullable, required fields non-required in order to avoid kubectl to wrongly reject null values. ([#85722](https://github.com/kubernetes/kubernetes/pull/85722), [@sttts](https://github.com/sttts))
- kube-apiserver: fixed a conflict error encountered attempting to delete a pod with `gracePeriodSeconds=0` and a resourceVersion precondition ([#85516](https://github.com/kubernetes/kubernetes/pull/85516), [@michaelgugino](https://github.com/michaelgugino))
- Use context to check client closed instead of http.CloseNotifier in processing watch request which will reduce 1 goroutine for each request if proto is HTTP/2.x . ([#85408](https://github.com/kubernetes/kubernetes/pull/85408), [@answer1991](https://github.com/answer1991))
- Reload apiserver SNI certificates from disk every minute ([#84303](https://github.com/kubernetes/kubernetes/pull/84303), [@jackkleeman](https://github.com/jackkleeman))
- The mutating and validating admission webhook plugins now read configuration from the admissionregistration.k8s.io/v1 API. ([#80883](https://github.com/kubernetes/kubernetes/pull/80883), [@liggitt](https://github.com/liggitt))
- kube-proxy: a configuration file specified via `--config` is now loaded with strict deserialization, which fails if the config file contains duplicate or unknown fields. This protects against accidentally running with config files that are malformed, mis-indented, or have typos in field names, and getting unexpected behavior. ([#82927](https://github.com/kubernetes/kubernetes/pull/82927), [@obitech](https://github.com/obitech))
- When registering with a 1.17+ API server, MutatingWebhookConfiguration and ValidatingWebhookConfiguration objects can now request that only `v1` AdmissionReview requests be sent to them. Previously, webhooks were required to support receiving `v1beta1` AdmissionReview requests as well for compatibility with API servers <= 1.15.
  - When registering with a 1.17+ API server, a CustomResourceDefinition conversion webhook can now request that only `v1` ConversionReview requests be sent to them. Previously, conversion webhooks were required to support receiving `v1beta1` ConversionReview requests as well for compatibility with API servers <= 1.15. ([#82707](https://github.com/kubernetes/kubernetes/pull/82707), [@liggitt](https://github.com/liggitt))
- OpenAPI v3 format in CustomResourceDefinition schemas are now documented. ([#85381](https://github.com/kubernetes/kubernetes/pull/85381), [@sttts](https://github.com/sttts))
- kube-apiserver: Fixed a regression accepting patch requests > 1MB ([#84963](https://github.com/kubernetes/kubernetes/pull/84963), [@liggitt](https://github.com/liggitt))
- The example API server has renamed its `wardle.k8s.io` API group to `wardle.example.com` ([#81670](https://github.com/kubernetes/kubernetes/pull/81670), [@liggitt](https://github.com/liggitt))
- CRDs defaulting is promoted to GA. Note: the feature gate CustomResourceDefaulting will be removed in 1.18. ([#84713](https://github.com/kubernetes/kubernetes/pull/84713), [@sttts](https://github.com/sttts))
- Restores compatibility with <=1.15.x custom resources by not publishing OpenAPI for non-structural custom resource definitions ([#82653](https://github.com/kubernetes/kubernetes/pull/82653), [@liggitt](https://github.com/liggitt))
- If given an IPv6 bind-address, kube-apiserver will now advertise an IPv6 endpoint for the kubernetes.default service. ([#84727](https://github.com/kubernetes/kubernetes/pull/84727), [@danwinship](https://github.com/danwinship))
- Add table convertor to component status. ([#85174](https://github.com/kubernetes/kubernetes/pull/85174), [@zhouya0](https://github.com/zhouya0))
- Scale custom resource unconditionally if resourceVersion is not provided ([#80572](https://github.com/kubernetes/kubernetes/pull/80572), [@knight42](https://github.com/knight42))
- When the go-client reflector relists, the ResourceVersion list option is set to the reflector's latest synced resource version to ensure the reflector does not "go back in time" and reprocess events older than it has already processed. If the server responds with an HTTP 410 (Gone) status code response, the relist falls back to using `resourceVersion=""`. ([#83520](https://github.com/kubernetes/kubernetes/pull/83520), [@jpbetz](https://github.com/jpbetz))
- Fix unsafe JSON construction in a number of locations in the codebase ([#81158](https://github.com/kubernetes/kubernetes/pull/81158), [@zouyee](https://github.com/zouyee))
- Fixes a flaw (CVE-2019-11253) in json/yaml decoding where large or malformed documents could consume excessive server resources. Request bodies for normal API requests (create/delete/update/patch operations of regular resources) are now limited to 3MB. ([#83261](https://github.com/kubernetes/kubernetes/pull/83261), [@liggitt](https://github.com/liggitt))
- CRDs can have fields named `type` with value `array` and nested array with `items` fields without validation to fall over this. ([#85223](https://github.com/kubernetes/kubernetes/pull/85223), [@sttts](https://github.com/sttts))

### Apps

- Support Service Topology ([#72046](https://github.com/kubernetes/kubernetes/pull/72046), [@m1093782566](https://github.com/m1093782566))
- Finalizer Protection for Service LoadBalancers is now in GA (enabled by default). This feature ensures the Service resource is not fully deleted until the correlating load balancer resources are deleted. ([#85023](https://github.com/kubernetes/kubernetes/pull/85023), [@MrHohn](https://github.com/MrHohn))
- Pod process namespace sharing is now Generally Available. The `PodShareProcessNamespace` feature gate is now deprecated and will be removed in Kubernetes 1.19. ([#84356](https://github.com/kubernetes/kubernetes/pull/84356), [@verb](https://github.com/verb))
- Fix handling tombstones in pod-disruption-budged controller. ([#83951](https://github.com/kubernetes/kubernetes/pull/83951), [@zouyee](https://github.com/zouyee))
- Fixed the bug that deleted services were processed by EndpointSliceController repeatedly even their cleanup were successful. ([#82996](https://github.com/kubernetes/kubernetes/pull/82996), [@tnqn](https://github.com/tnqn))
- Add `RequiresExactMatch` for `label.Selector` ([#85048](https://github.com/kubernetes/kubernetes/pull/85048), [@shaloulcy](https://github.com/shaloulcy))
- Adds a new label to indicate what is managing an EndpointSlice. ([#83965](https://github.com/kubernetes/kubernetes/pull/83965), [@robscott](https://github.com/robscott))
- Fix handling tombstones in pod-disruption-budged controller. ([#83951](https://github.com/kubernetes/kubernetes/pull/83951), [@zouyee](https://github.com/zouyee))
- Fixed the bug that deleted services were processed by EndpointSliceController repeatedly even their cleanup were successful. ([#82996](https://github.com/kubernetes/kubernetes/pull/82996), [@tnqn](https://github.com/tnqn))
- An end-user may choose to request logs without confirming the identity of the backing kubelet. This feature can be disabled by setting the `AllowInsecureBackendProxy` feature-gate to false. ([#83419](https://github.com/kubernetes/kubernetes/pull/83419), [@deads2k](https://github.com/deads2k))
- When scaling down a ReplicaSet, delete doubled up replicas first, where a "doubled up replica" is defined as one that is on the same node as an active replica belonging to a related ReplicaSet. ReplicaSets are considered "related" if they have a common controller (typically a Deployment). ([#80004](https://github.com/kubernetes/kubernetes/pull/80004), [@Miciah](https://github.com/Miciah))
- Kube-controller-manager: Fixes bug setting headless service labels on endpoints ([#85361](https://github.com/kubernetes/kubernetes/pull/85361), [@liggitt](https://github.com/liggitt))
- People can see the right log and note. ([#84637](https://github.com/kubernetes/kubernetes/pull/84637), [@zhipengzuo](https://github.com/zhipengzuo))
- Clean duplicate GetPodServiceMemberships function ([#83902](https://github.com/kubernetes/kubernetes/pull/83902), [@gongguan](https://github.com/gongguan))

### Auth

- K8s docker config json secrets are now compatible with docker config desktop authentication credentials files ([#82148](https://github.com/kubernetes/kubernetes/pull/82148), [@bbourbie](https://github.com/bbourbie))
- Kubelet and aggregated API servers now use v1 TokenReview and SubjectAccessReview endpoints to check authentication/authorization. ([#84768](https://github.com/kubernetes/kubernetes/pull/84768), [@liggitt](https://github.com/liggitt))
- Kube-apiserver can now specify `--authentication-token-webhook-version=v1` or `--authorization-webhook-version=v1` to use `v1` TokenReview and SubjectAccessReview API objects when communicating with authentication and authorization webhooks. ([#84768](https://github.com/kubernetes/kubernetes/pull/84768), [@liggitt](https://github.com/liggitt))
- Authentication token cache size is increased (from 4k to 32k) to support clusters with many nodes or many namespaces with active service accounts. ([#83643](https://github.com/kubernetes/kubernetes/pull/83643), [@lavalamp](https://github.com/lavalamp))
- Apiservers based on k8s.io/apiserver with delegated authn based on cluster authentication will automatically update to new authentication information when the authoritative configmap is updated. ([#85004](https://github.com/kubernetes/kubernetes/pull/85004), [@deads2k](https://github.com/deads2k))
- Configmaps/extension-apiserver-authentication in kube-system is continuously updated by kube-apiservers, instead of just at apiserver start ([#82705](https://github.com/kubernetes/kubernetes/pull/82705), [@deads2k](https://github.com/deads2k))

### CLI

- Fixed kubectl endpointslice output for get requests ([#82603](https://github.com/kubernetes/kubernetes/pull/82603), [@robscott](https://github.com/robscott))
- Gives the right error message when using `kubectl delete` a wrong resource. ([#83825](https://github.com/kubernetes/kubernetes/pull/83825), [@zhouya0](https://github.com/zhouya0))
- If a bad flag is supplied to a kubectl command, only a tip to run `--help` is printed, instead of the usage menu. Usage menu is printed upon running `kubectl command --help`. ([#82423](https://github.com/kubernetes/kubernetes/pull/82423), [@sallyom](https://github.com/sallyom))
- Commands like `kubectl apply` now return errors if schema-invalid annotations are specified, rather than silently dropping the entire annotations section. ([#83552](https://github.com/kubernetes/kubernetes/pull/83552), [@liggitt](https://github.com/liggitt))
- Fixes spurious 0 revisions listed when running `kubectl rollout history` for a StatefulSet ([#82643](https://github.com/kubernetes/kubernetes/pull/82643), [@ZP-AlwaysWin](https://github.com/ZP-AlwaysWin))
- Correct a reference to a not/no longer used kustomize subcommand in the documentation ([#82535](https://github.com/kubernetes/kubernetes/pull/82535), [@demobox](https://github.com/demobox))
- Kubectl set resources will no longer return an error if passed an empty change for a resource. kubectl set subject will no longer return an error if passed an empty change for a resource. ([#85490](https://github.com/kubernetes/kubernetes/pull/85490), [@sallyom](https://github.com/sallyom))
- Kubectl: --resource-version now works properly in label/annotate/set selector commands when racing with other clients to update the target object ([#85285](https://github.com/kubernetes/kubernetes/pull/85285), [@liggitt](https://github.com/liggitt))
- The `--certificate-authority` flag now correctly overrides existing skip-TLS or CA data settings in the kubeconfig file ([#83547](https://github.com/kubernetes/kubernetes/pull/83547), [@liggitt](https://github.com/liggitt))

### Cloud Provider

- Azure: update disk lock logic per vm during attach/detach to allow concurrent updates for different nodes. ([#85115](https://github.com/kubernetes/kubernetes/pull/85115), [@aramase](https://github.com/aramase))
- Fix vmss dirty cache issue in disk attach/detach on vmss node ([#85158](https://github.com/kubernetes/kubernetes/pull/85158), [@andyzhangx](https://github.com/andyzhangx))
- Fix race condition when attach/delete azure disk in same time ([#84917](https://github.com/kubernetes/kubernetes/pull/84917), [@andyzhangx](https://github.com/andyzhangx))
- Change GCP ILB firewall names to contain the `k8s-fw-` prefix like the rest of the firewall rules. This is needed for consistency and also for other components to identify the firewall rule as k8s/service-controller managed. ([#84622](https://github.com/kubernetes/kubernetes/pull/84622), [@prameshj](https://github.com/prameshj))
- Ensure health probes are created for local traffic policy UDP services on Azure ([#84802](https://github.com/kubernetes/kubernetes/pull/84802), [@feiskyer](https://github.com/feiskyer))
- Openstack: Do not delete managed LB in case of security group reconciliation errors ([#82264](https://github.com/kubernetes/kubernetes/pull/82264), [@multi-io](https://github.com/multi-io))
- Fix aggressive VM calls for Azure VMSS ([#83102](https://github.com/kubernetes/kubernetes/pull/83102), [@feiskyer](https://github.com/feiskyer))
- Fix: azure disk detach failure if node not exists ([#82640](https://github.com/kubernetes/kubernetes/pull/82640), [@andyzhangx](https://github.com/andyzhangx))
- Add azure disk encryption(SSE+CMK) support ([#84605](https://github.com/kubernetes/kubernetes/pull/84605), [@andyzhangx](https://github.com/andyzhangx))
- Update Azure SDK versions to v35.0.0 ([#84543](https://github.com/kubernetes/kubernetes/pull/84543), [@andyzhangx](https://github.com/andyzhangx))
- Azure: Add allow unsafe read from cache ([#83685](https://github.com/kubernetes/kubernetes/pull/83685), [@aramase](https://github.com/aramase))
- Reduces the number of calls made to the Azure API when requesting the instance view of a virtual machine scale set node. ([#82496](https://github.com/kubernetes/kubernetes/pull/82496), [@hasheddan](https://github.com/hasheddan))
- Added cloud operation count metrics to azure cloud controller manager. ([#82574](https://github.com/kubernetes/kubernetes/pull/82574), [@kkmsft](https://github.com/kkmsft))
- On AWS nodes with multiple network interfaces, kubelet should now more reliably report the same primary node IP. ([#80747](https://github.com/kubernetes/kubernetes/pull/80747), [@danwinship](https://github.com/danwinship))
- Update Azure load balancer to prevent orphaned public IP addresses ([#82890](https://github.com/kubernetes/kubernetes/pull/82890), [@chewong](https://github.com/chewong))

### Cluster Lifecycle

- Kubeadm alpha certs command now skip missing files ([#85092](https://github.com/kubernetes/kubernetes/pull/85092), [@fabriziopandini](https://github.com/fabriziopandini))
- Kubeadm: the command "kubeadm token create" now has a "--certificate-key" flag that can be used for the formation of join commands for control-planes with automatic copy of certificates ([#84591](https://github.com/kubernetes/kubernetes/pull/84591), [@TheLastProject](https://github.com/TheLastProject))
- Kubeadm: Fix a bug where kubeadm cannot parse kubelet's version if the latter dumps logs on the standard error. ([#85351](https://github.com/kubernetes/kubernetes/pull/85351), [@rosti](https://github.com/rosti))
- Kubeadm: added retry to all the calls to the etcd API so kubeadm will be more resilient to network glitches ([#85201](https://github.com/kubernetes/kubernetes/pull/85201), [@fabriziopandini](https://github.com/fabriziopandini))
- Fixes a bug in kubeadm that caused init and join to hang indefinitely in specific conditions. ([#85156](https://github.com/kubernetes/kubernetes/pull/85156), [@chuckha](https://github.com/chuckha))
- Kubeadm now includes CoreDNS version 1.6.5
  - `kubernetes` plugin adds metrics to measure kubernetes control plane latency.
  - the `health` plugin now includes the `lameduck` option by default, which waits for a duration before shutting down. ([#85109](https://github.com/kubernetes/kubernetes/pull/85109), [@rajansandeep](https://github.com/rajansandeep))
- Fixed bug when using kubeadm alpha certs commands with clusters using external etcd ([#85091](https://github.com/kubernetes/kubernetes/pull/85091), [@fabriziopandini](https://github.com/fabriziopandini))
- Kubeadm no longer defaults or validates the component configs of the kubelet or kube-proxy ([#79223](https://github.com/kubernetes/kubernetes/pull/79223), [@rosti](https://github.com/rosti))
- Kubeadm: remove the deprecated `--cri-socket` flag for `kubeadm upgrade apply`. The flag has been deprecated since v1.14. ([#85044](https://github.com/kubernetes/kubernetes/pull/85044), [@neolit123](https://github.com/neolit123))
- Kubeadm: prevent potential hanging of commands such as "kubeadm reset" if the apiserver endpoint is not reachable. ([#84648](https://github.com/kubernetes/kubernetes/pull/84648), [@neolit123](https://github.com/neolit123))
- Kubeadm: fix skipped etcd upgrade on secondary control-plane nodes when the command `kubeadm upgrade node` is used. ([#85024](https://github.com/kubernetes/kubernetes/pull/85024), [@neolit123](https://github.com/neolit123))
- Kubeadm: fix an issue with the kube-proxy container env. variables ([#84888](https://github.com/kubernetes/kubernetes/pull/84888), [@neolit123](https://github.com/neolit123))
- Utilize diagnostics tool to dump GKE windows test logs ([#83517](https://github.com/kubernetes/kubernetes/pull/83517), [@YangLu1031](https://github.com/YangLu1031))
- Kubeadm: always mount the kube-controller-manager hostPath volume that is given by the `--flex-volume-plugin-dir` flag. ([#84468](https://github.com/kubernetes/kubernetes/pull/84468), [@neolit123](https://github.com/neolit123))
- Update Cluster Autoscaler version to 1.16.2 (CA release docs: https://github.com/kubernetes/autoscaler/releases/tag/cluster-autoscaler-1.16.2) ([#84038](https://github.com/kubernetes/kubernetes/pull/84038), [@losipiuk](https://github.com/losipiuk))
- Kubeadm no longer removes /etc/cni/net.d as it does not install it. Users should remove files from it manually or rely on the component that created them ([#83950](https://github.com/kubernetes/kubernetes/pull/83950), [@yastij](https://github.com/yastij))
- Kubeadm: fix wrong default value for the `upgrade node --certificate-renewal` flag. ([#83528](https://github.com/kubernetes/kubernetes/pull/83528), [@neolit123](https://github.com/neolit123))
- Bump metrics-server to v0.3.5 ([#83015](https://github.com/kubernetes/kubernetes/pull/83015), [@olagacek](https://github.com/olagacek))
- Dashboard: disable the dashboard Deployment on non-Linux nodes. This step is required to support Windows worker nodes. ([#82975](https://github.com/kubernetes/kubernetes/pull/82975), [@wawa0210](https://github.com/wawa0210))
- Fixes a panic in kube-controller-manager cleaning up bootstrap tokens ([#82887](https://github.com/kubernetes/kubernetes/pull/82887), [@tedyu](https://github.com/tedyu))
- Kubeadm: add a new `kubelet-finalize` phase as part of the `init` workflow and an experimental sub-phase to enable automatic kubelet client certificate rotation on primary control-plane nodes.

      Prior to 1.17 and for existing nodes created by `kubeadm init` where kubelet client certificate rotation is desired, you must modify "/etc/kubernetes/kubelet.conf" to point to the PEM symlink for rotation:

  `client-certificate: /var/lib/kubelet/pki/kubelet-client-current.pem` and `client-key: /var/lib/kubelet/pki/kubelet-client-current.pem`, replacing the embedded client certificate and key. ([#84118](https://github.com/kubernetes/kubernetes/pull/84118), [@neolit123](https://github.com/neolit123))

- Kubeadm: add a upgrade health check that deploys a Job ([#81319](https://github.com/kubernetes/kubernetes/pull/81319), [@neolit123](https://github.com/neolit123))
- Kubeadm now supports automatic calculations of dual-stack node cidr masks to kube-controller-manager. ([#85609](https://github.com/kubernetes/kubernetes/pull/85609), [@Arvinderpal](https://github.com/Arvinderpal))
- Kubeadm: reset raises warnings if it cannot delete folders ([#85265](https://github.com/kubernetes/kubernetes/pull/85265), [@SataQiu](https://github.com/SataQiu))
- Kubeadm: enable the usage of the secure kube-scheduler and kube-controller-manager ports for health checks. For kube-scheduler was 10251, becomes 10259. For kube-controller-manager was 10252, becomes 10257. ([#85043](https://github.com/kubernetes/kubernetes/pull/85043), [@neolit123](https://github.com/neolit123))
- A new kubelet command line option, `--reserved-cpus`, is introduced to explicitly define the CPU list that will be reserved for system. For example, if `--reserved-cpus=0,1,2,3` is specified, then cpu 0,1,2,3 will be reserved for the system. On a system with 24 CPUs, the user may specify `isolcpus=4-23` for the kernel option and use CPU 4-23 for the user containers. ([#83592](https://github.com/kubernetes/kubernetes/pull/83592), [@jianzzha](https://github.com/jianzzha))
- Kubelet: a configuration file specified via `--config` is now loaded with strict deserialization, which fails if the config file contains duplicate or unknown fields. This protects against accidentally running with config files that are malformed, mis-indented, or have typos in field names, and getting unexpected behavior. ([#83204](https://github.com/kubernetes/kubernetes/pull/83204), [@obitech](https://github.com/obitech))
- Kubeadm now propagates proxy environment variables to kube-proxy ([#84559](https://github.com/kubernetes/kubernetes/pull/84559), [@yastij](https://github.com/yastij))
- Update the latest validated version of Docker to 19.03 ([#84476](https://github.com/kubernetes/kubernetes/pull/84476), [@neolit123](https://github.com/neolit123))
- Update to Ingress-GCE v1.6.1 ([#84018](https://github.com/kubernetes/kubernetes/pull/84018), [@rramkumar1](https://github.com/rramkumar1))
- Kubeadm: enhance certs check-expiration to show the expiration info of related CAs ([#83932](https://github.com/kubernetes/kubernetes/pull/83932), [@SataQiu](https://github.com/SataQiu))
- Kubeadm: implemented structured output of 'kubeadm token list' in JSON, YAML, Go template and JsonPath formats ([#78764](https://github.com/kubernetes/kubernetes/pull/78764), [@bart0sh](https://github.com/bart0sh))
- Kubeadm: add support for `127.0.0.1` as advertise address. kubeadm will automatically replace this value with matching global unicast IP address on the loopback interface. ([#83475](https://github.com/kubernetes/kubernetes/pull/83475), [@fabriziopandini](https://github.com/fabriziopandini))
- Kube-scheduler: a configuration file specified via `--config` is now loaded with strict deserialization, which fails if the config file contains duplicate or unknown fields. This protects against accidentally running with config files that are malformed, mis-indented, or have typos in field names, and getting unexpected behavior. ([#83030](https://github.com/kubernetes/kubernetes/pull/83030), [@obitech](https://github.com/obitech))
- Kubeadm: use the `--service-cluster-ip-range` flag to init or use the ServiceSubnet field in the kubeadm config to pass a comma separated list of Service CIDRs. ([#82473](https://github.com/kubernetes/kubernetes/pull/82473), [@Arvinderpal](https://github.com/Arvinderpal))
- Update crictl to v1.16.1. ([#82856](https://github.com/kubernetes/kubernetes/pull/82856), [@Random-Liu](https://github.com/Random-Liu))
- Bump addon-resizer to 1.8.7 to fix issues with using deprecated extensions APIs ([#85864](https://github.com/kubernetes/kubernetes/pull/85864), [@liggitt](https://github.com/liggitt))
- Simple script based hyperkube image that bundles all the necessary binaries. This is an equivalent replacement for the image based on the go based hyperkube command + image. ([#84662](https://github.com/kubernetes/kubernetes/pull/84662), [@dims](https://github.com/dims))
- Hyperkube will now be available in a new Github repository and will not be included in the kubernetes release from 1.17 onwards ([#83454](https://github.com/kubernetes/kubernetes/pull/83454), [@dims](https://github.com/dims))
- Remove prometheus cluster monitoring addon from kube-up ([#83442](https://github.com/kubernetes/kubernetes/pull/83442), [@serathius](https://github.com/serathius))
- SourcesReady provides the readiness of kubelet configuration sources such as apiserver update readiness. ([#81344](https://github.com/kubernetes/kubernetes/pull/81344), [@zouyee](https://github.com/zouyee))
- This PR sets the --cluster-dns flag value to kube-dns service IP whether or not NodeLocal DNSCache is enabled. NodeLocal DNSCache will listen on both the link-local as well as the service IP. ([#84383](https://github.com/kubernetes/kubernetes/pull/84383), [@prameshj](https://github.com/prameshj))
- kube-dns add-on:
  - All containers are now being executed under more restrictive privileges.
  - Most of the containers now run as non-root user and has the root filesystem set as read-only.
  - The remaining container running as root only has the minimum Linux capabilities it requires to run.
  - Privilege escalation has been disabled for all containers. ([#82347](https://github.com/kubernetes/kubernetes/pull/82347), [@pjbgf](https://github.com/pjbgf))
- Kubernetes no longer monitors firewalld. On systems using firewalld for firewall
  maintenance, kube-proxy will take slightly longer to recover from disruptive
  firewalld operations that delete kube-proxy's iptables rules.

  As a side effect of these changes, kube-proxy's
  `sync_proxy_rules_last_timestamp_seconds` metric no longer behaves the
  way it used to; now it will only change when services or endpoints actually
  change, rather than reliably updating every 60 seconds (or whatever). If you
  are trying to monitor for whether iptables updates are failing, the
  `sync_proxy_rules_iptables_restore_failures_total` metric may be more useful. ([#81517](https://github.com/kubernetes/kubernetes/pull/81517), [@danwinship](https://github.com/danwinship))

### Instrumentation

- Bump version of event-exporter to 0.3.1, to switch it to protobuf. ([#83396](https://github.com/kubernetes/kubernetes/pull/83396), [@loburm](https://github.com/loburm))
- Bumps metrics-server version to v0.3.6 with following bugfix:
  - Don't break metric storage when duplicate pod metrics encountered causing hpa to fail ([#83907](https://github.com/kubernetes/kubernetes/pull/83907), [@olagacek](https://github.com/olagacek))
- addons: elasticsearch discovery supports IPv6 ([#85543](https://github.com/kubernetes/kubernetes/pull/85543), [@SataQiu](https://github.com/SataQiu))
- Update Cluster Autoscaler to 1.17.0; changelog: https://github.com/kubernetes/autoscaler/releases/tag/cluster-autoscaler-1.17.0 ([#85610](https://github.com/kubernetes/kubernetes/pull/85610), [@losipiuk](https://github.com/losipiuk))

### Network

- The official kube-proxy image (used by kubeadm, among other things) is now compatible with systems running iptables 1.8 in "nft" mode, and will autodetect which mode it should use. ([#82966](https://github.com/kubernetes/kubernetes/pull/82966), [@danwinship](https://github.com/danwinship))
- Kubenet: added HostPort IPv6 support. HostPortManager: operates only with one IP family, failing if receives port mapping entries with different IP families. HostPortSyncer: operates only with one IP family, skipping portmap entries with different IP families ([#80854](https://github.com/kubernetes/kubernetes/pull/80854), [@aojea](https://github.com/aojea))
- Kube-proxy now supports DualStack feature with EndpointSlices and IPVS. ([#85246](https://github.com/kubernetes/kubernetes/pull/85246), [@robscott](https://github.com/robscott))
- Remove redundant API validation when using Service Topology with externalTrafficPolicy=Local ([#85346](https://github.com/kubernetes/kubernetes/pull/85346), [@andrewsykim](https://github.com/andrewsykim))
- Update github.com/vishvananda/netlink to v1.0.0 ([#83576](https://github.com/kubernetes/kubernetes/pull/83576), [@andrewsykim](https://github.com/andrewsykim))
- `-- kube-controller-manager`
  `--node-cidr-mask-size-ipv4 int32` Default: 24. Mask size for IPv4 node-cidr in dual-stack cluster.
  `--node-cidr-mask-size-ipv6 int32` Default: 64. Mask size for IPv6 node-cidr in dual-stack cluster.

      These 2 flags can be used only for dual-stack clusters. For non dual-stack clusters, continue to use  `--node-cidr-mask-size` flag to configure the mask size.

      The default node cidr mask size for IPv6 was 24 which is now changed to 64. ([#79993](https://github.com/kubernetes/kubernetes/pull/79993), [@aramase](https://github.com/aramase))

- deprecate cleanup-ipvs flag ([#83832](https://github.com/kubernetes/kubernetes/pull/83832), [@gongguan](https://github.com/gongguan))
- Kube-proxy: emits a warning when a malformed component config file is used with v1alpha1. ([#84143](https://github.com/kubernetes/kubernetes/pull/84143), [@phenixblue](https://github.com/phenixblue))
- Set config.BindAddress to IPv4 address `127.0.0.1` if not specified ([#83822](https://github.com/kubernetes/kubernetes/pull/83822), [@zouyee](https://github.com/zouyee))
- Updated kube-proxy ipvs README with correct grep argument to list loaded ipvs modules ([#83677](https://github.com/kubernetes/kubernetes/pull/83677), [@pete911](https://github.com/pete911))
- The userspace mode of kube-proxy no longer confusingly logs messages about deleting endpoints that it is actually adding. ([#83644](https://github.com/kubernetes/kubernetes/pull/83644), [@danwinship](https://github.com/danwinship))
- Kube-proxy iptables probabilities are now more granular and will result in better distribution beyond 319 endpoints. ([#83599](https://github.com/kubernetes/kubernetes/pull/83599), [@robscott](https://github.com/robscott))
- Significant kube-proxy performance improvements for non UDP ports. ([#83208](https://github.com/kubernetes/kubernetes/pull/83208), [@robscott](https://github.com/robscott))
- Improved performance of kube-proxy with EndpointSlice enabled with more efficient sorting. ([#83035](https://github.com/kubernetes/kubernetes/pull/83035), [@robscott](https://github.com/robscott))
- EndpointSlices are now beta for better Network Endpoint performance at scale. ([#84390](https://github.com/kubernetes/kubernetes/pull/84390), [@robscott](https://github.com/robscott))
- Updated EndpointSlices to use PublishNotReadyAddresses from Services. ([#84573](https://github.com/kubernetes/kubernetes/pull/84573), [@robscott](https://github.com/robscott))
- When upgrading to 1.17 with a cluster with EndpointSlices enabled, the `endpointslice.kubernetes.io/managed-by` label needs to be set on each EndpointSlice. ([#85359](https://github.com/kubernetes/kubernetes/pull/85359), [@robscott](https://github.com/robscott))
- Adds FQDN addressType support for EndpointSlice. ([#84091](https://github.com/kubernetes/kubernetes/pull/84091), [@robscott](https://github.com/robscott))
- Fix incorrect network policy description suggesting that pods are isolated when a network policy has no rules of a given type ([#84194](https://github.com/kubernetes/kubernetes/pull/84194), [@jackkleeman](https://github.com/jackkleeman))
- Fix bug where EndpointSlice controller would attempt to modify shared objects. ([#85368](https://github.com/kubernetes/kubernetes/pull/85368), [@robscott](https://github.com/robscott))
- Splitting IP address type into IPv4 and IPv6 for EndpointSlices ([#84971](https://github.com/kubernetes/kubernetes/pull/84971), [@robscott](https://github.com/robscott))
- Added appProtocol field to EndpointSlice Port ([#83815](https://github.com/kubernetes/kubernetes/pull/83815), [@howardjohn](https://github.com/howardjohn))
- The docker container runtime now enforces a 220 second timeout on container network operations. ([#71653](https://github.com/kubernetes/kubernetes/pull/71653), [@liucimin](https://github.com/liucimin))
- Fix panic in kubelet when running IPv4/IPv6 dual-stack mode with a CNI plugin ([#82508](https://github.com/kubernetes/kubernetes/pull/82508), [@aanm](https://github.com/aanm))
- EndpointSlice hostname is now set in the same conditions Endpoints hostname is. ([#84207](https://github.com/kubernetes/kubernetes/pull/84207), [@robscott](https://github.com/robscott))
- Improving the performance of Endpoint and EndpointSlice controllers by caching Service Selectors ([#84280](https://github.com/kubernetes/kubernetes/pull/84280), [@gongguan](https://github.com/gongguan))
- Significant kube-proxy performance improvements when using Endpoint Slices at scale. ([#83206](https://github.com/kubernetes/kubernetes/pull/83206), [@robscott](https://github.com/robscott))

### Node

- Mirror pods now include an ownerReference for the node that created them. ([#84485](https://github.com/kubernetes/kubernetes/pull/84485), [@tallclair](https://github.com/tallclair))
- Fixed a bug in the single-numa-policy of the TopologyManager. Previously, best-effort pods would result in a terminated state with a TopologyAffinity error. Now they will run as expected. ([#83777](https://github.com/kubernetes/kubernetes/pull/83777), [@lmdaly](https://github.com/lmdaly))
- Fixed a bug in the single-numa-node policy of the TopologyManager. Previously, pods that only requested CPU resources and did not request any third-party devices would fail to launch with a TopologyAffinity error. Now they will launch successfully. ([#83697](https://github.com/kubernetes/kubernetes/pull/83697), [@klueska](https://github.com/klueska))
- Fix error where metrics related to dynamic kubelet config isn't registered ([#83184](https://github.com/kubernetes/kubernetes/pull/83184), [@odinuge](https://github.com/odinuge))
- If container fails because ContainerCannotRun, do not utilize the FallbackToLogsOnError TerminationMessagePolicy, as it masks more useful logs. ([#81280](https://github.com/kubernetes/kubernetes/pull/81280), [@yqwang-ms](https://github.com/yqwang-ms))
- Use online nodes instead of possible nodes when discovering available NUMA nodes ([#83196](https://github.com/kubernetes/kubernetes/pull/83196), [@zouyee](https://github.com/zouyee))
- Use IPv4 in wincat port forward. ([#83036](https://github.com/kubernetes/kubernetes/pull/83036), [@liyanhui1228](https://github.com/liyanhui1228))
- Single static pod files and pod files from http endpoints cannot be larger than 10 MB. HTTP probe payloads are now truncated to 10KB. ([#82669](https://github.com/kubernetes/kubernetes/pull/82669), [@rphillips](https://github.com/rphillips))
- Limit the body length of exec readiness/liveness probes. remote CRIs and Docker shim read a max of 16MB output of which the exec probe itself inspects 10kb. ([#82514](https://github.com/kubernetes/kubernetes/pull/82514), [@dims](https://github.com/dims))
- Kubelet: Added kubelet serving certificate metric `server_rotation_seconds` which is a histogram reporting the age of a just rotated serving certificate in seconds. ([#84534](https://github.com/kubernetes/kubernetes/pull/84534), [@sambdavidson](https://github.com/sambdavidson))
- Reduce default NodeStatusReportFrequency to 5 minutes. With this change, periodic node status updates will be send every 5m if node status doesn't change (otherwise they are still send with 10s).

  Bump NodeProblemDetector version to v0.8.0 to reduce forced NodeStatus updates frequency to 5 minutes. ([#84007](https://github.com/kubernetes/kubernetes/pull/84007), [@wojtek-t](https://github.com/wojtek-t))

- The topology manager aligns resources for pods of all QoS classes with respect to NUMA locality, not just Guaranteed QoS pods. ([#83492](https://github.com/kubernetes/kubernetes/pull/83492), [@ConnorDoyle](https://github.com/ConnorDoyle))
- Fix a bug that a node Lease object may have been created without OwnerReference. ([#84998](https://github.com/kubernetes/kubernetes/pull/84998), [@wojtek-t](https://github.com/wojtek-t))
- External facing APIs in plugin registration and device plugin packages are now available under k8s.io/kubelet/pkg/apis/ ([#83551](https://github.com/kubernetes/kubernetes/pull/83551), [@dims](https://github.com/dims))

### Release

- Added the `crictl` Windows binaries as well as the Linux 32bit binary to the release archives ([#83944](https://github.com/kubernetes/kubernetes/pull/83944), [@saschagrunert](https://github.com/saschagrunert))
- Bumps the minimum version of Go required for building Kubernetes to 1.12.4. ([#83596](https://github.com/kubernetes/kubernetes/pull/83596), [@jktomer](https://github.com/jktomer))
- The deprecated mondo `kubernetes-test` tarball is no longer built. Users running Kubernetes e2e tests should use the `kubernetes-test-portable` and `kubernetes-test-{OS}-{ARCH}` tarballs instead. ([#83093](https://github.com/kubernetes/kubernetes/pull/83093), [@ixdy](https://github.com/ixdy))

### Scheduling

- Only validate duplication of the RequestedToCapacityRatio custom priority and allow other custom predicates/priorities ([#84646](https://github.com/kubernetes/kubernetes/pull/84646), [@liu-cong](https://github.com/liu-cong))
- Scheduler policy configs can no longer be declared multiple times ([#83963](https://github.com/kubernetes/kubernetes/pull/83963), [@damemi](https://github.com/damemi))
- TaintNodesByCondition was graduated to GA, CheckNodeMemoryPressure, CheckNodePIDPressure, CheckNodeDiskPressure, CheckNodeCondition were accidentally removed since 1.12, the replacement is to use CheckNodeUnschedulablePred ([#84152](https://github.com/kubernetes/kubernetes/pull/84152), [@draveness](https://github.com/draveness))
- [migration phase 1] PodFitsHostPorts as filter plugin ([#83659](https://github.com/kubernetes/kubernetes/pull/83659), [@wgliang](https://github.com/wgliang))
- [migration phase 1] PodFitsResources as framework plugin ([#83650](https://github.com/kubernetes/kubernetes/pull/83650), [@wgliang](https://github.com/wgliang))
- [migration phase 1] PodMatchNodeSelector/NodAffinity as filter plugin ([#83660](https://github.com/kubernetes/kubernetes/pull/83660), [@wgliang](https://github.com/wgliang))
- Add more tracing steps in generic_scheduler ([#83539](https://github.com/kubernetes/kubernetes/pull/83539), [@wgliang](https://github.com/wgliang))
- [migration phase 1] PodFitsHost as filter plugin ([#83662](https://github.com/kubernetes/kubernetes/pull/83662), [@wgliang](https://github.com/wgliang))
- Fixed a scheduler panic when using PodAffinity. ([#82841](https://github.com/kubernetes/kubernetes/pull/82841), [@Huang-Wei](https://github.com/Huang-Wei))
- Take the context as the first argument of Schedule. ([#82119](https://github.com/kubernetes/kubernetes/pull/82119), [@wgliang](https://github.com/wgliang))
- Fixed an issue that the correct PluginConfig.Args is not passed to the corresponding PluginFactory in kube-scheduler when multiple PluginConfig items are defined. ([#82483](https://github.com/kubernetes/kubernetes/pull/82483), [@everpeace](https://github.com/everpeace))
- Profiling is enabled by default in the scheduler ([#84835](https://github.com/kubernetes/kubernetes/pull/84835), [@denkensk](https://github.com/denkensk))
- Scheduler now reports metrics on cache size including nodes, pods, and assumed pods ([#83508](https://github.com/kubernetes/kubernetes/pull/83508), [@damemi](https://github.com/damemi))
- User can now use component config to configure NodeLabel plugin for the scheduler framework. ([#84297](https://github.com/kubernetes/kubernetes/pull/84297), [@liu-cong](https://github.com/liu-cong))
- Optimize inter-pod affinity preferredDuringSchedulingIgnoredDuringExecution type, up to 4x in some cases. ([#84264](https://github.com/kubernetes/kubernetes/pull/84264), [@ahg-g](https://github.com/ahg-g))
- Filter plugin for cloud provider storage predicate ([#84148](https://github.com/kubernetes/kubernetes/pull/84148), [@gongguan](https://github.com/gongguan))
- Refactor scheduler's framework permit API. ([#83756](https://github.com/kubernetes/kubernetes/pull/83756), [@hex108](https://github.com/hex108))
- Add incoming pods metrics to scheduler queue. ([#83577](https://github.com/kubernetes/kubernetes/pull/83577), [@liu-cong](https://github.com/liu-cong))
- Allow dynamically set glog logging level of kube-scheduler ([#83910](https://github.com/kubernetes/kubernetes/pull/83910), [@mrkm4ntr](https://github.com/mrkm4ntr))
- Add latency and request count metrics for scheduler framework. ([#83569](https://github.com/kubernetes/kubernetes/pull/83569), [@liu-cong](https://github.com/liu-cong))
- Expose SharedInformerFactory in the framework handle ([#83663](https://github.com/kubernetes/kubernetes/pull/83663), [@draveness](https://github.com/draveness))
- Add per-pod scheduling metrics across 1 or more schedule attempts. ([#83674](https://github.com/kubernetes/kubernetes/pull/83674), [@liu-cong](https://github.com/liu-cong))
- Add `podInitialBackoffDurationSeconds` and `podMaxBackoffDurationSeconds` to the scheduler config API ([#81263](https://github.com/kubernetes/kubernetes/pull/81263), [@draveness](https://github.com/draveness))
- Expose kubernetes client in the scheduling framework handle. ([#82432](https://github.com/kubernetes/kubernetes/pull/82432), [@draveness](https://github.com/draveness))
- Remove MaxPriority in the scheduler API, please use MaxNodeScore or MaxExtenderPriority instead. ([#83386](https://github.com/kubernetes/kubernetes/pull/83386), [@draveness](https://github.com/draveness))
- Consolidate ScoreWithNormalizePlugin into the ScorePlugin interface ([#83042](https://github.com/kubernetes/kubernetes/pull/83042), [@draveness](https://github.com/draveness))
- New APIs to allow adding/removing pods from pre-calculated prefilter state in the scheduling framework ([#82912](https://github.com/kubernetes/kubernetes/pull/82912), [@ahg-g](https://github.com/ahg-g))
- Added Clone method to the scheduling framework's PluginContext and ContextData. ([#82951](https://github.com/kubernetes/kubernetes/pull/82951), [@ahg-g](https://github.com/ahg-g))
- Modified the scheduling framework's Filter API. ([#82842](https://github.com/kubernetes/kubernetes/pull/82842), [@ahg-g](https://github.com/ahg-g))
- Critical pods can now be created in namespaces other than kube-system. To limit critical pods to the kube-system namespace, cluster admins should create an admission configuration file limiting critical pods by default, and a matching quota object in the `kube-system` namespace permitting critical pods in that namespace. See https://kubernetes.io/docs/concepts/policy/resource-quotas/&#35;limit-priority-class-consumption-by-default for details. ([#76310](https://github.com/kubernetes/kubernetes/pull/76310), [@ravisantoshgudimetla](https://github.com/ravisantoshgudimetla))
- Scheduler ComponentConfig fields are now pointers ([#83619](https://github.com/kubernetes/kubernetes/pull/83619), [@damemi](https://github.com/damemi))
- Scheduler Policy API has a new recommended apiVersion `apiVersion: kubescheduler.config.k8s.io/v1` which is consistent with the scheduler API group `kubescheduler.config.k8s.io`. It holds the same API as the old apiVersion `apiVersion: v1`. ([#83578](https://github.com/kubernetes/kubernetes/pull/83578), [@Huang-Wei](https://github.com/Huang-Wei))
- Rename PluginContext to CycleState in the scheduling framework ([#83430](https://github.com/kubernetes/kubernetes/pull/83430), [@draveness](https://github.com/draveness))
- Some scheduler extender API fields are moved from `pkg/scheduler/api` to `pkg/scheduler/apis/extender/v1`. ([#83262](https://github.com/kubernetes/kubernetes/pull/83262), [@Huang-Wei](https://github.com/Huang-Wei))
- Kube-scheduler: emits a warning when a malformed component config file is used with v1alpha1. ([#84129](https://github.com/kubernetes/kubernetes/pull/84129), [@obitech](https://github.com/obitech))
- Kube-scheduler now falls back to emitting events using core/v1 Events when events.k8s.io/v1beta1 is disabled. ([#83692](https://github.com/kubernetes/kubernetes/pull/83692), [@yastij](https://github.com/yastij))
- Expand scheduler priority functions and scheduling framework plugins' node score range to [0, 100]. Note: this change is internal and does not affect extender and RequestedToCapacityRatio custom priority, which are still expected to provide a [0, 10] range. ([#83522](https://github.com/kubernetes/kubernetes/pull/83522), [@draveness](https://github.com/draveness))

### Storage

- Bump CSI version to 1.2.0 ([#84832](https://github.com/kubernetes/kubernetes/pull/84832), [@gnufied](https://github.com/gnufied))
- CSI Migration: Fixes issue where all volumes with the same inline volume inner spec name were staged in the same path. Migrated inline volumes are now staged at a unique path per unique volume. ([#84754](https://github.com/kubernetes/kubernetes/pull/84754), [@davidz627](https://github.com/davidz627))
- CSI Migration: GCE PD access mode now reflects read only status of inline volumes - this allows multi-attach for read only many PDs ([#84809](https://github.com/kubernetes/kubernetes/pull/84809), [@davidz627](https://github.com/davidz627))
- CSI detach timeout increased from 10 seconds to 2 minutes ([#84321](https://github.com/kubernetes/kubernetes/pull/84321), [@cduchesne](https://github.com/cduchesne))
- Ceph RBD volume plugin now does not use any keyring (`/etc/ceph/ceph.client.lvs01cinder.keyring`, `/etc/ceph/ceph.keyring`, `/etc/ceph/keyring`, `/etc/ceph/keyring.bin`) for authentication. Ceph user credentials must be provided in PersistentVolume objects and referred Secrets. ([#75588](https://github.com/kubernetes/kubernetes/pull/75588), [@smileusd](https://github.com/smileusd))
- Validate Gluster IP ([#83104](https://github.com/kubernetes/kubernetes/pull/83104), [@zouyee](https://github.com/zouyee))
- PersistentVolumeLabel admission plugin, responsible for labeling `PersistentVolumes` with topology labels, now does not overwrite existing labels on PVs that were dynamically provisioned. It trusts the dynamic provisioning that it provided the correct labels to the `PersistentVolume`, saving one potentially expensive cloud API call. `PersistentVolumes` created manually by users are labelled by the admission plugin in the same way as before. ([#82830](https://github.com/kubernetes/kubernetes/pull/82830), [@jsafrane](https://github.com/jsafrane))

- Existing PVs are converted to use volume topology if migration is enabled. ([#83394](https://github.com/kubernetes/kubernetes/pull/83394), [@bertinatto](https://github.com/bertinatto))
- local: support local filesystem volume with block resource reconstruction ([#84218](https://github.com/kubernetes/kubernetes/pull/84218), [@cofyc](https://github.com/cofyc))
- Fixed binding of block PersistentVolumes / PersistentVolumeClaims when BlockVolume feature is off. ([#84049](https://github.com/kubernetes/kubernetes/pull/84049), [@jsafrane](https://github.com/jsafrane))
- Report non-confusing error for negative storage size in PVC spec. ([#82759](https://github.com/kubernetes/kubernetes/pull/82759), [@sttts](https://github.com/sttts))
- Fixed "requested device X but found Y" attach error on AWS. ([#85675](https://github.com/kubernetes/kubernetes/pull/85675), [@jsafrane](https://github.com/jsafrane))
- Reduced frequency of DescribeVolumes calls of AWS API when attaching/detaching a volume. ([#84181](https://github.com/kubernetes/kubernetes/pull/84181), [@jsafrane](https://github.com/jsafrane))
- Fixed attachment of AWS volumes that have just been detached. ([#83567](https://github.com/kubernetes/kubernetes/pull/83567), [@jsafrane](https://github.com/jsafrane))
- Fix possible fd leak and closing of dirs when using openstack ([#82873](https://github.com/kubernetes/kubernetes/pull/82873), [@odinuge](https://github.com/odinuge))
- local: support local volume block mode reconstruction ([#84173](https://github.com/kubernetes/kubernetes/pull/84173), [@cofyc](https://github.com/cofyc))
- Fixed cleanup of raw block devices after kubelet restart. ([#83451](https://github.com/kubernetes/kubernetes/pull/83451), [@jsafrane](https://github.com/jsafrane))
- Add data cache flushing during unmount device for GCE-PD driver in Windows Server. ([#83591](https://github.com/kubernetes/kubernetes/pull/83591), [@jingxu97](https://github.com/jingxu97))

### Windows

- Adds Windows Server build information as a label on the node. ([#84472](https://github.com/kubernetes/kubernetes/pull/84472), [@gab-satchi](https://github.com/gab-satchi))
- Fixes kube-proxy bug accessing self nodeip:port on windows ([#83027](https://github.com/kubernetes/kubernetes/pull/83027), [@liggitt](https://github.com/liggitt))
- When using Containerd on Windows, the `TerminationMessagePath` file will now be mounted in the Windows Pod. ([#83057](https://github.com/kubernetes/kubernetes/pull/83057), [@bclau](https://github.com/bclau))
- Fix kubelet metrics gathering on non-English Windows hosts ([#84156](https://github.com/kubernetes/kubernetes/pull/84156), [@wawa0210](https://github.com/wawa0210))

### Dependencies

- Update etcd client side to v3.4.3 ([#83987](https://github.com/kubernetes/kubernetes/pull/83987), [@wenjiaswe](https://github.com/wenjiaswe))
- Kubernetes now requires go1.13.4+ to build ([#82809](https://github.com/kubernetes/kubernetes/pull/82809), [@liggitt](https://github.com/liggitt))
- Update to use go1.12.12 ([#84064](https://github.com/kubernetes/kubernetes/pull/84064), [@cblecker](https://github.com/cblecker))
- Update to go 1.12.10 ([#83139](https://github.com/kubernetes/kubernetes/pull/83139), [@cblecker](https://github.com/cblecker))
- Update default etcd server version to 3.4.3 ([#84329](https://github.com/kubernetes/kubernetes/pull/84329), [@jingyih](https://github.com/jingyih))
- Upgrade default etcd server version to 3.3.17 ([#83804](https://github.com/kubernetes/kubernetes/pull/83804), [@jpbetz](https://github.com/jpbetz))
- Upgrade to etcd client 3.3.17 to fix bug where etcd client does not parse IPv6 addresses correctly when members are joining, and to fix bug where failover on multi-member etcd cluster fails certificate check on DNS mismatch ([#83801](https://github.com/kubernetes/kubernetes/pull/83801), [@jpbetz](https://github.com/jpbetz))

### Detailed go Dependency Changes

#### Added

- github.com/OpenPeeDeeP/depguard: v1.0.1
- github.com/StackExchange/wmi: 5d04971
- github.com/agnivade/levenshtein: v1.0.1
- github.com/alecthomas/template: a0175ee
- github.com/alecthomas/units: 2efee85
- github.com/andreyvit/diff: c7f18ee
- github.com/anmitsu/go-shlex: 648efa6
- github.com/bazelbuild/rules_go: 6dae44d
- github.com/bgentry/speakeasy: v0.1.0
- github.com/bradfitz/go-smtpd: deb6d62
- github.com/cockroachdb/datadriven: 80d97fb
- github.com/creack/pty: v1.1.7
- github.com/gliderlabs/ssh: v0.1.1
- github.com/go-critic/go-critic: 1df3008
- github.com/go-kit/kit: v0.8.0
- github.com/go-lintpack/lintpack: v0.5.2
- github.com/go-logfmt/logfmt: v0.3.0
- github.com/go-ole/go-ole: v1.2.1
- github.com/go-stack/stack: v1.8.0
- github.com/go-toolsmith/astcast: v1.0.0
- github.com/go-toolsmith/astcopy: v1.0.0
- github.com/go-toolsmith/astequal: v1.0.0
- github.com/go-toolsmith/astfmt: v1.0.0
- github.com/go-toolsmith/astinfo: 9809ff7
- github.com/go-toolsmith/astp: v1.0.0
- github.com/go-toolsmith/pkgload: v1.0.0
- github.com/go-toolsmith/strparse: v1.0.0
- github.com/go-toolsmith/typep: v1.0.0
- github.com/gobwas/glob: v0.2.3
- github.com/golangci/check: cfe4005
- github.com/golangci/dupl: 3e9179a
- github.com/golangci/errcheck: ef45e06
- github.com/golangci/go-misc: 927a3d8
- github.com/golangci/go-tools: e32c541
- github.com/golangci/goconst: 041c5f2
- github.com/golangci/gocyclo: 2becd97
- github.com/golangci/gofmt: 0b8337e
- github.com/golangci/golangci-lint: v1.18.0
- github.com/golangci/gosec: 66fb7fc
- github.com/golangci/ineffassign: 42439a7
- github.com/golangci/lint-1: ee948d0
- github.com/golangci/maligned: b1d8939
- github.com/golangci/misspell: 950f5d1
- github.com/golangci/prealloc: 215b22d
- github.com/golangci/revgrep: d9c87f5
- github.com/golangci/unconvert: 28b1c44
- github.com/google/go-github: v17.0.0+incompatible
- github.com/google/go-querystring: v1.0.0
- github.com/gostaticanalysis/analysisutil: v0.0.3
- github.com/jellevandenhooff/dkim: f50fe3d
- github.com/julienschmidt/httprouter: v1.2.0
- github.com/klauspost/compress: v1.4.1
- github.com/kr/logfmt: b84e30a
- github.com/logrusorgru/aurora: a7b3b31
- github.com/mattn/go-runewidth: v0.0.2
- github.com/mattn/goveralls: v0.0.2
- github.com/mitchellh/go-ps: 4fdf99a
- github.com/mozilla/tls-observatory: 8791a20
- github.com/mwitkow/go-conntrack: cc309e4
- github.com/nbutton23/zxcvbn-go: eafdab6
- github.com/olekukonko/tablewriter: a0225b3
- github.com/quasilyte/go-consistent: c6f3937
- github.com/rogpeppe/fastuuid: 6724a57
- github.com/ryanuber/go-glob: 256dc44
- github.com/sergi/go-diff: v1.0.0
- github.com/shirou/gopsutil: c95755e
- github.com/shirou/w32: bb4de01
- github.com/shurcooL/go-goon: 37c2f52
- github.com/shurcooL/go: 9e1955d
- github.com/sourcegraph/go-diff: v0.5.1
- github.com/tarm/serial: 98f6abe
- github.com/tidwall/pretty: v1.0.0
- github.com/timakin/bodyclose: 87058b9
- github.com/ultraware/funlen: v0.0.2
- github.com/urfave/cli: v1.20.0
- github.com/valyala/bytebufferpool: v1.0.0
- github.com/valyala/fasthttp: v1.2.0
- github.com/valyala/quicktemplate: v1.1.1
- github.com/valyala/tcplisten: ceec8f9
- github.com/vektah/gqlparser: v1.1.2
- go.etcd.io/etcd: 3cf2f69
- go.mongodb.org/mongo-driver: v1.1.2
- go4.org: 417644f
- golang.org/x/build: 2835ba2
- golang.org/x/perf: 6e6d33e
- golang.org/x/xerrors: a985d34
- gopkg.in/alecthomas/kingpin.v2: v2.2.6
- gopkg.in/cheggaaa/pb.v1: v1.0.25
- gopkg.in/resty.v1: v1.12.0
- grpc.go4.org: 11d0a25
- k8s.io/system-validators: v1.0.4
- mvdan.cc/interfacer: c200402
- mvdan.cc/lint: adc824a
- mvdan.cc/unparam: fbb5962
- sourcegraph.com/sqs/pbtypes: d3ebe8f

#### Changed

- github.com/Azure/azure-sdk-for-go: v32.5.0+incompatible → v35.0.0+incompatible
- github.com/Microsoft/go-winio: v0.4.11 → v0.4.14
- github.com/bazelbuild/bazel-gazelle: c728ce9 → 70208cb
- github.com/bazelbuild/buildtools: 80c7f0d → 69366ca
- github.com/beorn7/perks: 3a771d9 → v1.0.0
- github.com/container-storage-interface/spec: v1.1.0 → v1.2.0
- github.com/coredns/corefile-migration: v1.0.2 → v1.0.4
- github.com/coreos/etcd: v3.3.17+incompatible → v3.3.10+incompatible
- github.com/coreos/go-systemd: 39ca1b0 → 95778df
- github.com/docker/go-units: v0.3.3 → v0.4.0
- github.com/docker/libnetwork: a9cd636 → f0e46a7
- github.com/fatih/color: v1.6.0 → v1.7.0
- github.com/ghodss/yaml: c7ce166 → v1.0.0
- github.com/go-openapi/analysis: v0.19.2 → v0.19.5
- github.com/go-openapi/jsonpointer: v0.19.2 → v0.19.3
- github.com/go-openapi/jsonreference: v0.19.2 → v0.19.3
- github.com/go-openapi/loads: v0.19.2 → v0.19.4
- github.com/go-openapi/runtime: v0.19.0 → v0.19.4
- github.com/go-openapi/spec: v0.19.2 → v0.19.3
- github.com/go-openapi/strfmt: v0.19.0 → v0.19.3
- github.com/go-openapi/swag: v0.19.2 → v0.19.5
- github.com/go-openapi/validate: v0.19.2 → v0.19.5
- github.com/godbus/dbus: v4.1.0+incompatible → 2ff6f7f
- github.com/golang/protobuf: v1.3.1 → v1.3.2
- github.com/google/btree: 4030bb1 → v1.0.0
- github.com/google/cadvisor: v0.34.0 → v0.35.0
- github.com/gregjones/httpcache: 787624d → 9cad4c3
- github.com/grpc-ecosystem/go-grpc-middleware: cfaf568 → f849b54
- github.com/grpc-ecosystem/grpc-gateway: v1.3.0 → v1.9.5
- github.com/heketi/heketi: v9.0.0+incompatible → c2e2a4a
- github.com/json-iterator/go: v1.1.7 → v1.1.8
- github.com/mailru/easyjson: 94de47d → v0.7.0
- github.com/mattn/go-isatty: v0.0.3 → v0.0.9
- github.com/mindprince/gonvml: fee913c → 9ebdce4
- github.com/mrunalp/fileutils: 4ee1cc9 → 7d4729f
- github.com/munnerz/goautoneg: a547fc6 → a7dc8b6
- github.com/onsi/ginkgo: v1.8.0 → v1.10.1
- github.com/onsi/gomega: v1.5.0 → v1.7.0
- github.com/opencontainers/runc: 6cc5158 → v1.0.0-rc9
- github.com/opencontainers/selinux: v1.2.2 → 5215b18
- github.com/pkg/errors: v0.8.0 → v0.8.1
- github.com/prometheus/client_golang: v0.9.2 → v1.0.0
- github.com/prometheus/client_model: 5c3871d → fd36f42
- github.com/prometheus/common: 4724e92 → v0.4.1
- github.com/prometheus/procfs: 1dc9a6c → v0.0.2
- github.com/soheilhy/cmux: v0.1.3 → v0.1.4
- github.com/spf13/pflag: v1.0.3 → v1.0.5
- github.com/stretchr/testify: v1.3.0 → v1.4.0
- github.com/syndtr/gocapability: e7cb7fa → d983527
- github.com/vishvananda/netlink: b2de5d1 → v1.0.0
- github.com/vmware/govmomi: v0.20.1 → v0.20.3
- github.com/xiang90/probing: 07dd2e8 → 43a291a
- go.uber.org/atomic: 8dc6146 → v1.3.2
- go.uber.org/multierr: ddea229 → v1.1.0
- go.uber.org/zap: 67bc79d → v1.10.0
- golang.org/x/crypto: e84da03 → 60c769a
- golang.org/x/lint: 8f45f77 → 959b441
- golang.org/x/net: cdfb69a → 13f9640
- golang.org/x/oauth2: 9f33145 → 0f29369
- golang.org/x/sync: 42b3178 → cd5d95a
- golang.org/x/sys: 3b52091 → fde4db3
- golang.org/x/text: e6919f6 → v0.3.2
- golang.org/x/time: f51c127 → 9d24e82
- golang.org/x/tools: 6e04913 → 65e3620
- google.golang.org/grpc: v1.23.0 → v1.23.1
- gopkg.in/inf.v0: v0.9.0 → v0.9.1
- k8s.io/klog: v0.4.0 → v1.0.0
- k8s.io/kube-openapi: 743ec37 → 30be4d1
- k8s.io/repo-infra: 00fe14e → v0.0.1-alpha.1
- k8s.io/utils: 581e001 → e782cd3
- sigs.k8s.io/structured-merge-diff: 6149e45 → b1b620d

#### Removed

- github.com/cloudflare/cfssl: 56268a6
- github.com/coreos/bbolt: v1.3.3
- github.com/coreos/rkt: v1.30.0
- github.com/globalsign/mgo: eeefdec
- github.com/google/certificate-transparency-go: v1.0.21
- github.com/heketi/rest: aa6a652
- github.com/heketi/utils: 435bc5b
- github.com/pborman/uuid: v1.2.0
