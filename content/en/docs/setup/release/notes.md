---
title: v1.14 Release Notes
card:
  name: download
  weight: 10
  anchors:
  - anchor: "#"
    title: Current Release Notes
  - anchor: "#urgent-upgrade-notes"
    title: Urgent Upgrade Notes
---
<!-- NEW RELEASE NOTES ENTRY -->

# v1.14.0

[Documentation](https://docs.k8s.io)

## Downloads for v1.14.0


filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.14.0/kubernetes.tar.gz) | `0ad264a46f185a9ff4db0393508a9598dab146f438b2cfdc7527592eb422870b8f26ade7ed089359c06741d998fcd730f897eae261f922c1a26d9fdc034d270d`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.14.0/kubernetes-src.tar.gz) | `c5175439decc1c5f54254572bfec3c9f61f39d6bd1cbc28d1f771f8f931b98f0c305f1871618ce7e9de9cf3bf8227e19dcf985a7e017c74d0d7ab4005b3dbd59`

### Client Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.14.0/kubernetes-client-darwin-386.tar.gz) | `68bdba50a2b0be755e73e34ffc758fd419940adace096b1ddebd44a0eae2c7cdaed984965ea8f2145c1cab0be47bd6c72c2aeb73e51d449bfeb9ce1854b6c562`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.14.0/kubernetes-client-darwin-amd64.tar.gz) | `255bd93082b3ac5d69bd4e45c75c9f19efee50ad6add50837ff2987ce16cbcc485fad334c980b17f69e5a344ee50548e206f747441ad4a045aa65746c79d10ca`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.14.0/kubernetes-client-linux-386.tar.gz) | `2bd115ad2503fdfe5482e4592fcc0c8a2aee36be5205220a13c8050cd1e55dd3c08377425dbe5a03e4ffd21cf603c739ec4eaf3e5b2514a725d095df46f25d98`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.14.0/kubernetes-client-linux-amd64.tar.gz) | `a551adf8019b17fce5aff2b379fab3627588978a2d628b64ba1af6f3be1b435322368b00dd04fa739d01c341420016b93239cc0d4601cee86706d81d78cb4d7f`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.14.0/kubernetes-client-linux-arm.tar.gz) | `24e771cd4074786330e07f5537259a28d0932102639326230d9161f12a8dc545638a55bc252771eb4e21e95e2c7f0918dc1238ac4dc70d3b8b33f093da7123ab`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.14.0/kubernetes-client-linux-arm64.tar.gz) | `16204f2345ab3523bbe3c868f04806a97c111d940b2594aaff67cf73b4259040c7770d5b0e7bdb7ffd7389f87e5f090ae875bd0f192b07582f59a01a1df32f5b`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.14.0/kubernetes-client-linux-ppc64le.tar.gz) | `cd9ce829d585dd3331c53d35015d4017026d5efd24b9bc2f342995245628598c98bd8b1f1d706b196a7b3046a44049d4aba6efb4b1000722bfd055bd8a662f1f`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.14.0/kubernetes-client-linux-s390x.tar.gz) | `482c0a8e53b27f8922f58d89fb81842ddd9c3ffd120e635838992dc97d535e46b42e7d8c439cb739b7c1d63c8eed27d7e3bcac7126a6a96e56cc13d52f396328`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.14.0/kubernetes-client-windows-386.tar.gz) | `4446d666f999e979a7245e1b7ebf4817f7bd23aa247a38853a63b9cda473c7d4c2d376a2fd0df13ba15b740bf6b458cac14bd03dbf5a8151fc230e40c08294cf`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.14.0/kubernetes-client-windows-amd64.tar.gz) | `97f4789f21d10fd3df446e55bc489472dcd534c623bb40dc3cb20fe1edd74c1a89a50ce7caa4e5e0536f3b22d8698060bfe8c46f4adbd0e507349412e52664e8`

### Server Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.14.0/kubernetes-server-linux-amd64.tar.gz) | `25739802a641517a8bbb933b69000a943e8dd38e616b8778149dd0138737abacf377683da2ff35fdd0bbb305b88bc8fc711df20a2585720a43bb674ef36b034f`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.14.0/kubernetes-server-linux-arm.tar.gz) | `c1dbba77a4ff5661eb36c55182a753b88ccc9b89ca31e162b06672126743cfea115b2f8ea8658b12344c36df17958e310c1b8efbdd7800f44f013e1e6f10477d`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.14.0/kubernetes-server-linux-arm64.tar.gz) | `ad346bbe2a053c1106b51e5125698737dc7b76fa3bf439e14d4b4ba1c262678fede9c507c1098aac6e14d2c742c526c8d257fefa95dd3bbb1dff959e1dc7b9aa`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.14.0/kubernetes-server-linux-ppc64le.tar.gz) | `49f9bd1c751620ecf4b5c152f287d72b36abca21fd1dfe99443d984473c6efa051a910de585c42f5447ef7c18d7dbd905a66c4f09ca6025f45e63f5e96e3ca2f`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.14.0/kubernetes-server-linux-s390x.tar.gz) | `d6be847f2a0358755a69dea26181e5fc1a80ac4939b8b04a3875e1f6693553cad562452bfad21b2e380ddda1839ab846122bc3339d8bec0971f218f6e8f6dce9`

### Node Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.14.0/kubernetes-node-linux-amd64.tar.gz) | `75dc99919d1084d7d471a53ab60c743dc399145c99e83f37c6ba3c241b2c0b2ecc2c0d1b94690ff912e2a15b7c5595aa1d2d24c2fc439e06d85ff0246fb43b89`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.14.0/kubernetes-node-linux-arm.tar.gz) | `49013a4f01be8086fff332099d94903082688b9b295d2f34468462656da4709360025e9d84b069410c608977ef803079af09af1f1e2678af7cb64e0fc02e9c9d`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.14.0/kubernetes-node-linux-arm64.tar.gz) | `f8c0cb0c089cd1d1977c049002620b8cf748d193c1b76dd1d3aac01ff9273549c06a1e3dfe983dc40a95ee8b0719908e0cdf86ce17359b5f1b2426f2c55799a1`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.14.0/kubernetes-node-linux-ppc64le.tar.gz) | `48fc02c856a192388877189a43eb1cda531e548bb035f9dfe6a1e3c8d3bcbd0f8e14f29382da45702cb28a91126d13ede42bd6e9159e12ecbd387ca9a58f9a92`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.14.0/kubernetes-node-linux-s390x.tar.gz) | `d7c5f52cf602fd0c0d0f72d4cfe1ceaa4bad70a42f37f21c103f17c3448ceb2396c1bfa521eeeb9eef5f3173d84e4268704a247edd826d765f65e9a29a4f7f72`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.14.0/kubernetes-node-windows-amd64.tar.gz) | `120afdebe844b06a7437bb9788c3e7ea4fc6352aa18cc6a00e70f44f54664f844429f138870bc15862579da632632dff2e7323be7f627d9c33585a11ad2bed6b`

# Kubernetes v1.14 Release Notes

## 1.14 What’s New

Support for Windows Nodes is Graduating to Stable ([#116](https://github.com/kubernetes/enhancements/issues/116) )

- Support for Windows Server 2019 for worker nodes and containers
- Support for out of tree networking with Azure-CNI, OVN-Kubernetes and Flannel
- Improved support for pods, service types, workload controllers and metrics/quotas to closely match the capabilities offered for Linux containers
kubernetes/enhancements: [#116](https://github.com/kubernetes/enhancements/issues/116) [[kep](https://github.com/kubernetes/enhancements/blob/master/keps/sig-windows/20190103-windows-node-support.md)]

Updated Plugin Mechanism for kubectl is Graduating to Stable ([#579](https://github.com/kubernetes/enhancements/issues/579))

- Extends functionality to kubectl to support extensions adding new commands as well as overriding specific subcommands (at any depth).
- Documentation fixes
kubernetes/enhancements: [#579](https://github.com/kubernetes/enhancements/issues/579) [[kep](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cli/0024-kubectl-plugins.md#summary)]

Durable Local Storage Management is Now GA ([#121](https://github.com/kubernetes/enhancements/issues/121#issuecomment-457396290))

- Makes locally attached (non-network attached) storage available as a persistent volume source.
- Allows users to take advantage of the typically cheaper and improved performance of persistent local storage
kubernetes/kubernetes: [#73525](https://github.com/kubernetes/kubernetes/pull/73525), [#74391](https://github.com/kubernetes/kubernetes/pull/74391), [#74769](http://github.com/kubernetes/kubernetes/pull/74769)
kubernetes/enhancements: [#121](https://github.com/kubernetes/enhancements/issues/121#issuecomment-457396290) [[kep](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/20190124-local-persistent-volumes.md)]

Pid Limiting is Graduating to Beta ([#757](https://github.com/kubernetes/enhancements/issues/757))

- Prevents a pod from starving pid resource
- Ability to isolate pid resources pod-to-pod and node-to-pod
kubernetes/kubernetes: [#73651](http://github.com/kubernetes/kubernetes/pull/73651)
kubernetes/enhancements: [#757](https://github.com/kubernetes/enhancements/issues/757) [[kep](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/20190129-pid-limiting.md)]

Pod Priority and Preemption in Kubernetes ([#564](https://github.com/kubernetes/enhancements/issues/564))

- Pod priority and preemption enables Kubernetes scheduler to schedule more important Pods first and when cluster is out of resources, it removes less important pods to create room for more important ones. The importance is specified by priority.
kubernetes/kubernetes: [#73498](https://github.com/kubernetes/kubernetes/pull/73498), [#73555](https://github.com/kubernetes/kubernetes/pull/73555), [#74465](https://github.com/kubernetes/kubernetes/pull/74465)
kubernetes/enhancements: [#564](https://github.com/kubernetes/enhancements/issues/564)  [[kep](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/20190131-pod-priority-preemption.md)]

Pod Ready++ ([#580](https://github.com/kubernetes/enhancements/issues/580))

- Introduces extension point for external feedback on pod readiness.
kubernetes/kubernetes: [#74434](http://github.com/kubernetes/kubernetes/pull/74434),
kubernetes/enhancements: [#580](https://github.com/kubernetes/enhancements/issues/580) [[kep](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/0007-pod-ready%2B%2B.md)]

Kubeadm: Automate certificate copy between control planes in HA setups

- Joining control plane nodes to a HA cluster can now be simplified by enabling the optional automatic copy of certificates from an existing control plane node.
- You can now use `kubeadm init --experimental-upload-certs` and `kubeadm join --experimental-control-plane --certificate-key`.
kubernetes/kubeadm: [#1373](https://github.com/kubernetes/kubeadm/issues/1373)
kubernetes/enhancements: [#357](https://github.com/kubernetes/enhancements/issues/357) [[kep](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cluster-lifecycle/20190122-Certificates-copy-for-kubeadm-join--control-plane.md)]

Kubeadm: Expose the `kubeadm join` workflow as phases

- The `kubeadm join` command can now be used in phases. Similar to the work that was done for `kubeadm init` in 1.13, in 1.14 the `join` phases can be now executed step-by-step/selectively using the `kubeadm join phase` sub-command. This makes it possible to further customize the workflow of joining nodes to the cluster.
kubernetes/kubeadm: [#1204](https://github.com/kubernetes/kubeadm/issues/1204)
kubernetes/enhancements: [kep](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cluster-lifecycle/0029-20180918-kubeadm-phases-beta.md)

## Known Issues

- There is a known issue [coredns/coredns#2629](https://github.com/coredns/coredns/issues/2629) in CoreDNS 1.3.1, wherein if the Kubernetes API shuts down while CoreDNS is connected, CoreDNS will crash. The issue is fixed in CoreDNS 1.4.0 in [coredns/coredns#2529](https://github.com/coredns/coredns/pull/2529).
- Kubelet might fail to restart if an existing flexvolume mounted pvc contains a large number of directories, or is full. [#75019](https://github.com/kubernetes/kubernetes/pull/75019)

## Urgent Upgrade Notes

### (No, really, you MUST read this before you upgrade)

- kube-apiserver:
  - Default RBAC policy no longer grants access to discovery and permission-checking APIs (used by `kubectl auth can-i`) to *unauthenticated* users. Upgraded clusters preserve prior behavior, but cluster administrators wishing to grant unauthenticated users access in new clusters will need to explicitly opt-in to expose the discovery and/or permission-checking APIs:
    - `kubectl create clusterrolebinding anonymous-discovery --clusterrole=system:discovery --group=system:unauthenticated`
    - `kubectl create clusterrolebinding anonymous-access-review --clusterrole=system:basic-user --group=system:unauthenticated`
  - The deprecated --storage-versions flag has been removed. The storage versions will always be the default value built-in the kube-apiserver binary. ([#67678](https://github.com/kubernetes/kubernetes/pull/67678), [@caesarxuchao](https://github.com/caesarxuchao))
  - The deprecated `--repair-malformed-updates` flag has been removed ([#73663](https://github.com/kubernetes/kubernetes/pull/73663), [@danielqsj](https://github.com/danielqsj))
  - The `/swaggerapi/*` schema docs, deprecated since 1.7, have been removed in favor of the /openapi/v2 schema docs. ([#72924](https://github.com/kubernetes/kubernetes/pull/72924), [@liggitt](https://github.com/liggitt))
  - The /swagger.json and /swagger-2.0.0.pb-v1 schema documents, deprecated since v1.10, have been removed in favor of `/openapi/v2` ([#73148](https://github.com/kubernetes/kubernetes/pull/73148), [@liggitt](https://github.com/liggitt))
  - `kube-apiserver` now only aggregates openapi schemas from `/openapi/v2` endpoints of aggregated API servers. The fallback to aggregate from `/swagger.json` has been removed. Ensure aggregated API servers provide schema information via `/openapi/v2` (available since v1.10). ([#73441](https://github.com/kubernetes/kubernetes/pull/73441), [@roycaihw](https://github.com/roycaihw))
  - The OpenAPI definitions with the prefix "io.k8s.kubernetes.pkg" (deprecated since 1.9) have been removed. ([#74596](https://github.com/kubernetes/kubernetes/pull/74596), [@sttts](https://github.com/sttts))
  - The `ValidateProxyRedirects` feature was promoted to Beta and enabled by default. This feature restricts redirect-following from the apiserver to same-host redirects.  If nodes are configured to respond to CRI streaming requests on a different host interface than what the apiserver makes requests on (only the case if not using the built-in dockershim & setting the kubelet flag `--redirect-container-streaming=true`), then these requests will be broken. In that case, the feature can be temporarily disabled until the node configuration is corrected. We suggest setting `--redirect-container-streaming=false` on the kubelet to avoid issues.([#72552](https://github.com/kubernetes/kubernetes/pull/72552), [@tallclair](https://github.com/tallclair))

- kubectl
  - The deprecated `--show-all` flag to `kubectl get` has been removed  ([#69255](https://github.com/kubernetes/kubernetes/pull/69255), [@Pingan2017](https://github.com/Pingan2017))

- kubelet
  - The deprecated `--experimental-fail-swap-on` flag has been removed ([#69552](https://github.com/kubernetes/kubernetes/pull/69552), [@Pingan2017](https://github.com/Pingan2017))
  - Health check (liveness & readiness) probes using an HTTPGetAction will no longer follow redirects to different hostnames from the original probe request. Instead, these non-local redirects will be treated as a Success (the documented behavior). In this case an event with reason "ProbeWarning" will be generated, indicating that the redirect was ignored. If you were previously relying on the redirect to run health checks against different endpoints, you will need to perform the healthcheck logic outside the Kubelet, for instance by proxying the external endpoint rather than redirecting to it. ([#75416](https://github.com/kubernetes/kubernetes/pull/75416), [@tallclair](https://github.com/tallclair))

- client-go
  - The deprecated versionless API group accessors (like `clientset.Apps()`) have been removed. Use an explicit version instead (like `clientset.AppsV1()`) ([#74422](https://github.com/kubernetes/kubernetes/pull/74422), [@liggitt](https://github.com/liggitt))
  - The disk-cached discovery client is moved from k8s.io/client-go/discovery to k8s.io/client-go/discovery/cached/disk.
The memory-cached discovery client is moved from k8s.io/client-go/discovery/cached to k8s.io/client-go/discovery/cached/memory.
([#72214](https://github.com/kubernetes/kubernetes/pull/72214), [@caesarxuchao](https://github.com/caesarxuchao))

- kubeadm
  - `kubeadm alpha preflight` and `kubeadm alpha preflight node` are removed; you can now use `kubeadm join phase preflight` ([#73718](https://github.com/kubernetes/kubernetes/pull/73718), [@fabriziopandini](https://github.com/fabriziopandini))

- The deprecated taints `node.alpha.kubernetes.io/notReady` and `node.alpha.kubernetes.io/unreachable` are no longer supported or adjusted. These uses should be replaced with `node.kubernetes.io/not-ready` and `node.kubernetes.io/unreachable`
 ([#73001](https://github.com/kubernetes/kubernetes/pull/73001), [@shivnagarajan](https://github.com/shivnagarajan))

- Any Prometheus queries that match `pod_name` and `container_name` labels (e.g. cadvisor or kubelet probe metrics) should be updated to use `pod` and `container` instead. `pod_name` and `container_name` labels will be present alongside `pod` and `container` labels for one transitional release and removed in the future.
([#69099](https://github.com/kubernetes/kubernetes/pull/69099), [@ehashman](https://github.com/ehashman))

## Deprecations

- kubectl
  - `kubectl convert` is deprecated and will be removed in v1.17.
  - The `--export` flag for the `kubectl get` command is deprecated and will be removed in v1.18. ([#73787](https://github.com/kubernetes/kubernetes/pull/73787), [@soltysh](https://github.com/soltysh))

- kubelet
  - OS and Arch information is now recorded in `kubernetes.io/os` and `kubernetes.io/arch` labels on Node objects. The previous labels (`beta.kubernetes.io/os` and `beta.kubernetes.io/arch`) are still recorded, but are deprecated and targeted for removal in v1.18. ([#73333](https://github.com/kubernetes/kubernetes/pull/73333), [@yujuhong](https://github.com/yujuhong))
  - The `--containerized` flag is deprecated and will be removed in a future release ([#74267](https://github.com/kubernetes/kubernetes/pull/74267), [@dims](https://github.com/dims))

- hyperkube
  - The `--make-symlinks` flag is deprecated and will be removed in a future release. ([#74975](https://github.com/kubernetes/kubernetes/pull/74975), [@dims](https://github.com/dims))
- API
  - Ingress resources are now available via `networking.k8s.io/v1beta1`. Ingress resources in `extensions/v1beta1` are deprecated and will no longer be served in v1.18. Existing persisted data is available via the new API group/version  ([#74057](https://github.com/kubernetes/kubernetes/pull/74057), [@liggitt](https://github.com/liggitt))
  - NetworkPolicy resources will no longer be served from `extensions/v1beta1` in v1.16. Migrate use to the `networking.k8s.io/v1` API, available since v1.8. Existing persisted data can be retrieved via the `networking.k8s.io/v1` API.
  - PodSecurityPolicy resources will no longer be served from `extensions/v1beta1` in v1.16. Migrate to the `policy/v1beta1` API, available since v1.10. Existing persisted data can be retrieved via the `policy/v1beta1` API.
  - DaemonSet, Deployment, and ReplicaSet resources will no longer be served from `extensions/v1beta1`, `apps/v1beta1`, or `apps/v1beta2` in v1.16. Migrate to the `apps/v1` API, available since v1.9. Existing persisted data can be retrieved via the `apps/v1` API.
  - PriorityClass resources have been promoted to `scheduling.k8s.io/v1` with no changes. The `scheduling.k8s.io/v1beta1` and `scheduling.k8s.io/v1alpha1` versions are now deprecated and will stop being served by default in v1.17.  ([#73555](https://github.com/kubernetes/kubernetes/pull/73555), [#74465](https://github.com/kubernetes/kubernetes/pull/74465), [@bsalamat](https://github.com/bsalamat))
  - The `export` query parameter for list API calls is deprecated and will be removed in v1.18 ([#73783](https://github.com/kubernetes/kubernetes/pull/73783), [@deads2k](https://github.com/deads2k))
- The following features are now GA, and the associated feature gates are deprecated and will be removed in v1.15:
  - `CustomPodDNS`
  - `HugePages`
  - `MountPropagation`
  - `PersistentLocalVolumes`
- CoreDNS: The following directives or keywords are deprecated and will be removed in v1.15:
  - `upstream` option of `kubernetes` plugin, becoming default behavior in v1.15.
  - `proxy` plugin replaced by `forward` plugin

## Removed and deprecated metrics

### Removed metrics

- `reflector_items_per_list`
- `reflector_items_per_watch`
- `reflector_last_resource_version`
- `reflector_list_duration_seconds`
- `reflector_lists_total`
- `reflector_short_watches_total`
- `reflector_watch_duration_seconds`
- `reflector_watches_total`

### Deprecated metrics

- `rest_client_request_latency_seconds` -> `rest_client_request_duration_seconds`
- `apiserver_proxy_tunnel_sync_latency_secs` -> `apiserver_proxy_tunnel_sync_duration_seconds`
- `scheduler_scheduling_latency_seconds` -> `scheduler_scheduling_duration_seconds`
- `kubelet_pod_worker_latency_microseconds` -> `kubelet_pod_worker_duration_seconds`
- `kubelet_pod_start_latency_microseconds` -> `kubelet_pod_start_duration_seconds`
- `kubelet_cgroup_manager_latency_microseconds` -> `kubelet_cgroup_manager_duration_seconds`
- `kubelet_pod_worker_start_latency_microseconds` -> `kubelet_pod_worker_start_duration_seconds`
- `kubelet_pleg_relist_latency_microseconds` -> `kubelet_pleg_relist_duration_seconds`
- `kubelet_pleg_relist_interval_microseconds` -> `kubelet_pleg_relist_interval_seconds`
- `kubelet_eviction_stats_age_microseconds` -> `kubelet_eviction_stats_age_seconds`
- `kubelet_runtime_operations` -> `kubelet_runtime_operations_total`
- `kubelet_runtime_operations_latency_microseconds` -> `kubelet_runtime_operations_duration_seconds`
- `kubelet_runtime_operations_errors` -> `kubelet_runtime_operations_errors_total`
- `kubelet_device_plugin_registration_count` -> `kubelet_device_plugin_registration_total`
- `kubelet_device_plugin_alloc_latency_microseconds` -> `kubelet_device_plugin_alloc_duration_seconds`
- `docker_operations` -> `docker_operations_total`
- `docker_operations_latency_microseconds` -> `docker_operations_latency_seconds`
- `docker_operations_errors` -> `docker_operations_errors_total`
- `docker_operations_timeout` -> `docker_operations_timeout_total`
- `network_plugin_operations_latency_microseconds` -> `network_plugin_operations_latency_seconds`
- `sync_proxy_rules_latency_microseconds` -> `sync_proxy_rules_latency_seconds`
- `apiserver_request_count` -> `apiserver_request_total`
- `apiserver_request_latencies` -> `apiserver_request_latency_seconds`
- `apiserver_request_latencies_summary` -> `apiserver_request_latency_seconds`
- `apiserver_dropped_requests` -> `apiserver_dropped_requests_total`
- `etcd_helper_cache_hit_count` -> `etcd_helper_cache_hit_total`
- `etcd_helper_cache_miss_count` -> `etcd_helper_cache_miss_total`
- `etcd_helper_cache_entry_count` -> `etcd_helper_cache_entry_total`
- `etcd_request_cache_get_latencies_summary` -> `etcd_request_cache_get_latency_seconds`
- `etcd_request_cache_add_latencies_summary` -> `etcd_request_cache_add_latency_seconds`
- `etcd_request_latencies_summary` -> `etcd_request_latency_seconds`
- `transformation_latencies_microseconds` -> `transformation_latencies_seconds`
- `data_key_generation_latencies_microseconds` -> `data_key_generation_latencies_seconds`

## Notable Features

- Increased the histogram resolution of the API server client certificate  to accommodate short-lived (< 6h) client certificates. ([#74806](https://github.com/kubernetes/kubernetes/pull/74806), [@mxinden](https://github.com/mxinden))
- Updated to use golang 1.12 ([#74632](https://github.com/kubernetes/kubernetes/pull/74632), [@cblecker](https://github.com/cblecker))
- The `RunAsGroup` feature has been promoted to beta and enabled by default. `PodSpec` and `PodSecurityPolicy` objects can be used to control the primary GID of containers on supported container runtimes. ([#73007](https://github.com/kubernetes/kubernetes/pull/73007), [@krmayankk](https://github.com/krmayankk))
- Added the same information to an init container as a standard container in a pod when using `PodPresets`. ([#71479](https://github.com/kubernetes/kubernetes/pull/71479), [@soggiest](https://github.com/soggiest))
- kube-conformance image will now run ginkgo with the `--dryRun` flag if the container is run with the environment variable E2E_DRYRUN set. ([#74731](https://github.com/kubernetes/kubernetes/pull/74731), [@johnSchnake](https://github.com/johnSchnake))
- Introduced dynamic volume provisioning shim for CSI migration ([#73653](https://github.com/kubernetes/kubernetes/pull/73653), [@ddebroy](https://github.com/ddebroy))
- Applied resources from a directory containing kustomization.yaml ([#74140](https://github.com/kubernetes/kubernetes/pull/74140), [@Liujingfang1](https://github.com/Liujingfang1))
- kubeadm: Allowed to download certificate secrets uploaded by `init` or `upload-certs` phase, allowing to transfer certificate secrets (certificates and keys) from the cluster to other master machines when creating HA deployments. ([#74168](https://github.com/kubernetes/kubernetes/pull/74168), [@ereslibre](https://github.com/ereslibre))
- The `--quiet` option to `kubectl run` now suppresses resource deletion messages emitted when the `--rm` option is specified. ([#73266](https://github.com/kubernetes/kubernetes/pull/73266), [@awh](https://github.com/awh))
- Added Custom Resource support to `kubectl autoscale` ([#72678](https://github.com/kubernetes/kubernetes/pull/72678), [@rmohr](https://github.com/rmohr))
- Cinder volume limit can now be configured from node too ([#74542](https://github.com/kubernetes/kubernetes/pull/74542), [@gnufied](https://github.com/gnufied))
- It is now possible to combine the `-f` and `-l` flags in `kubectl logs` ([#67573](https://github.com/kubernetes/kubernetes/pull/67573), [@m1kola](https://github.com/m1kola))
- New conformance tests added for API Aggregation. ([#63947](https://github.com/kubernetes/kubernetes/pull/63947), [@jennybuckley](https://github.com/jennybuckley))
- Moved fluentd-elasticsearch addon images to community controlled location ([#73819](https://github.com/kubernetes/kubernetes/pull/73819), [@coffeepac](https://github.com/coffeepac))
- Removed local etcd members from the etcd cluster when `kubeadm reset` ([#74112](https://github.com/kubernetes/kubernetes/pull/74112), [@pytimer](https://github.com/pytimer))
- kubeadm will now not fail preflight checks when running on >= 5.0 Linux kernel ([#74355](https://github.com/kubernetes/kubernetes/pull/74355), [@brb](https://github.com/brb))
- Scheduler cache snapshot algorithm has been optimized to improve scheduling throughput. ([#74041](https://github.com/kubernetes/kubernetes/pull/74041), [@bsalamat](https://github.com/bsalamat))
- It is now possible to upload certificates required to join a new control-plane to kubeadm-certs secret using the flag `--experimental-upload-certs` on `init` or upload-certs phase. ([#73907](https://github.com/kubernetes/kubernetes/pull/73907), [@yagonobre](https://github.com/yagonobre))
[@RobertKrawitz](https://github.com/RobertKrawitz))
- `kubectl auth reconcile` now outputs details about what changes are being made ([#71564](https://github.com/kubernetes/kubernetes/pull/71564), [@liggitt](https://github.com/liggitt))
- Added Kustomize as a subcommand in kubectl ([#73033](https://github.com/kubernetes/kubernetes/pull/73033), [@Liujingfang1](https://github.com/Liujingfang1))
- Added `kubelet_node_name` metrics. ([#72910](https://github.com/kubernetes/kubernetes/pull/72910), [@danielqsj](https://github.com/danielqsj))
- Updated AWS SDK to v1.16.26 for ECR PrivateLink support ([#73435](https://github.com/kubernetes/kubernetes/pull/73435), [@micahhausler](https://github.com/micahhausler))
- Expanded `kubectl wait` to work with more types of selectors. ([#71746](https://github.com/kubernetes/kubernetes/pull/71746), [@rctl](https://github.com/rctl))
([#72832](https://github.com/kubernetes/kubernetes/pull/72832), [@MrHohn](https://github.com/MrHohn))
- Added configuration for AWS endpoint fine control: ([#72245](https://github.com/kubernetes/kubernetes/pull/72245), [@ampsingram](https://github.com/ampsingram))
- The CoreDNS configuration now has the forward plugin for proxy in the default configuration instead of the proxy plugin.  ([#73267](https://github.com/kubernetes/kubernetes/pull/73267), [@rajansandeep](https://github.com/rajansandeep))
- Added alpha field storageVersionHash to the discovery document for each resource. Its value must be treated as opaque by clients. Only equality comparison on the value is valid. ([#73191](https://github.com/kubernetes/kubernetes/pull/73191), [@caesarxuchao](https://github.com/caesarxuchao))
- If you are running the cloud-controller-manager and you have the `pvlabel.kubernetes.io` alpha Initializer enabled, you must now enable PersistentVolume labeling using the `PersistentVolumeLabel` admission controller instead. You can do this by adding `PersistentVolumeLabel` in the `--enable-admission-plugins` kube-apiserver flag.  ([#73102](https://github.com/kubernetes/kubernetes/pull/73102), [@andrewsykim](https://github.com/andrewsykim))
- kubectl supports copying files with wild card ([#72641](https://github.com/kubernetes/kubernetes/pull/72641), [@dixudx](https://github.com/dixudx))
- kubeadm now attempts to detect an installed CRI by its usual domain socket, so that `--cri-socket` can be omitted from the command line if Docker is not used and there is a single CRI installed. ([#69366](https://github.com/kubernetes/kubernetes/pull/69366), [@rosti](https://github.com/rosti))
- `CSINodeInfo` and `CSIDriver` CRDs have been installed in the local cluster. ([#72584](https://github.com/kubernetes/kubernetes/pull/72584), [@xing-yang](https://github.com/xing-yang))
- Node OS/arch labels have been promoted to GA ([#73048](https://github.com/kubernetes/kubernetes/pull/73048), [@yujuhong](https://github.com/yujuhong))
- Added support for max attach limit for Cinder ([#72980](https://github.com/kubernetes/kubernetes/pull/72980), [@gnufied](https://github.com/gnufied))
- Enabled mTLS encryption between etcd and kube-apiserver in GCE ([#70144](https://github.com/kubernetes/kubernetes/pull/70144), [@wenjiaswe](https://github.com/wenjiaswe))
- Added `ResourceVersion` as a precondition for delete in order to ensure a delete fails if an unobserved change happens to an object. ([#74040](https://github.com/kubernetes/kubernetes/pull/74040), [@ajatprabha](https://github.com/ajatprabha))
- There is now support for collecting pod logs under `/var/log/pods/NAMESPACE_NAME_UID` to stackdriver with `k8s_pod` resource type. ([#74502](https://github.com/kubernetes/kubernetes/pull/74502), [@Random-Liu](https://github.com/Random-Liu))
- Changed CRI pod log directory from `/var/log/pods/UID` to `/var/log/pods/NAMESPACE_NAME_UID`. ([#74441](https://github.com/kubernetes/kubernetes/pull/74441), [@Random-Liu](https://github.com/Random-Liu))
- `RuntimeClass` has been promoted to beta, and is enabled by default. ([#75003](https://github.com/kubernetes/kubernetes/pull/75003), [@tallclair](https://github.com/tallclair))
- New "dry_run" metric label (indicating the value of the dryRun query parameter) has been added into the metrics:
* apiserver_request_total
* apiserver_request_duration_seconds
New "APPLY" value for the "verb" metric label which indicates a PATCH with "Content-Type: apply-patch+yaml". This value is experimental and will only be present if the ServerSideApply alpha feature is enabled. ([#74997](https://github.com/kubernetes/kubernetes/pull/74997), [@jennybuckley](https://github.com/jennybuckley))
- GCE: bumped COS image version to `cos-beta-73-11647-64-0` ([#75149](https://github.com/kubernetes/kubernetes/pull/75149), [@yguo0905](https://github.com/yguo0905))
- Added alpha support for ephemeral CSI inline volumes that are embedded in pod specs. ([#74086](https://github.com/kubernetes/kubernetes/pull/74086), [@vladimirvivien](https://github.com/vladimirvivien))

## API Changes

- [CRI] Added a new field called `runtime_handler` into `PodSandbox` and `PodSandboxStatus` to track the `RuntimeClass` information of a pod. ([#73833](https://github.com/kubernetes/kubernetes/pull/73833), [@haiyanmeng](https://github.com/haiyanmeng))

## Detailed Bug Fixes And Changes

### API Machinery

- client-go: `PortForwarder.GetPorts()` now contain correct local port if no local port was initially specified when setting up the port forwarder ([#73676](https://github.com/kubernetes/kubernetes/pull/73676), [@martin-helmich](https://github.com/martin-helmich))
- Fixed an issue with missing `apiVersion/kind` in object data sent to admission webhooks ([#74448](https://github.com/kubernetes/kubernetes/pull/74448), [@liggitt](https://github.com/liggitt))
- Prometheus metrics for `crd_autoregister`, `crd_finalizer` and `crd_naming_condition_controller` are exported. ([#71767](https://github.com/kubernetes/kubernetes/pull/71767), [@roycaihw](https://github.com/roycaihw))
- Fixed admission metrics in seconds. ([#72343](https://github.com/kubernetes/kubernetes/pull/72343), [@danielqsj](https://github.com/danielqsj))
- When a watch is closed by an HTTP2 load balancer and we are told to go away, skip printing the message to stderr by default.
- Spedup kubectl by >10 when calling out to kube-apiserver for discovery information. ([#73345](https://github.com/kubernetes/kubernetes/pull/73345), [@sttts](https://github.com/sttts))
- Fixed watch to not send the same set of events multiple times causing watcher to go back in time ([#73845](https://github.com/kubernetes/kubernetes/pull/73845), [@wojtek-t](https://github.com/wojtek-t))
([#73277](https://github.com/kubernetes/kubernetes/pull/73277), [@smarterclayton](https://github.com/smarterclayton))
- Fix kube-apiserver not to create default/kubernetes service endpoints before it reports readiness via the /healthz and therefore is ready to serve requests. Also early during startup old endpoints are remove which might be left over from a previously crashed kube-apiserver. ([#74668](https://github.com/kubernetes/kubernetes/pull/74668), [@sttts](https://github.com/sttts))
- Add a configuration field to shorten the timeout of validating/mutating admission webhook call. The timeout value must be between 1 and 30 seconds. Default to 30 seconds when unspecified.  ([#74562](https://github.com/kubernetes/kubernetes/pull/74562), [@roycaihw](https://github.com/roycaihw))
- The apiserver, including both the kube-apiserver and apiservers built with the generic apiserver library, will now return 413 RequestEntityTooLarge error if a json patch contains more than 10,000 operations. ([#74000](https://github.com/kubernetes/kubernetes/pull/74000), [@caesarxuchao](https://github.com/caesarxuchao))
- Fixed an error processing watch events when running skewed apiservers ([#73482](https://github.com/kubernetes/kubernetes/pull/73482), [@liggitt](https://github.com/liggitt))
- jsonpath expressions containing `[start:end:step]` slice are now evaluated correctly ([#73149](https://github.com/kubernetes/kubernetes/pull/73149), [@liggitt](https://github.com/liggitt))
- `metadata.deletionTimestamp` is no longer moved into the future when issuing repeated DELETE requests against a resource containing a finalizer. ([#73138](https://github.com/kubernetes/kubernetes/pull/73138), [@liggitt](https://github.com/liggitt))
- Fixed kube-apiserver not to create default/kubernetes service endpoints before it reports readiness via the /healthz and therefore is ready to serve requests. Also early during startup old endpoints are remove which might be left over from a previously crashed kube-apiserver. ([#74668](https://github.com/kubernetes/kubernetes/pull/74668), [@sttts](https://github.com/sttts))
- `watch.Until` now works for long durations. ([#67350](https://github.com/kubernetes/kubernetes/pull/67350), [@tnozicka](https://github.com/tnozicka))
- Added duration metric for CRD webhook converters. ([#74376](https://github.com/kubernetes/kubernetes/pull/74376), [@mbohlool](https://github.com/mbohlool))
- Fixed keymutex issues which may crash in some platforms. ([#74348](https://github.com/kubernetes/kubernetes/pull/74348), [@danielqsj](https://github.com/danielqsj))
- Considerably reduced the CPU load in kube-apiserver while aggregating OpenAPI specifications from aggregated API servers. ([#71223](https://github.com/kubernetes/kubernetes/pull/71223), [@sttts](https://github.com/sttts))
- Fixed graceful apiserver shutdown to not drop outgoing bytes before the process terminates. ([#72970](https://github.com/kubernetes/kubernetes/pull/72970), [@sttts](https://github.com/sttts))

### Apps

- Added deleting pods created by `DaemonSet` assigned to not existing nodes. ([#73401](https://github.com/kubernetes/kubernetes/pull/73401), [@krzysztof-jastrzebski](https://github.com/krzysztof-jastrzebski))
- Pod eviction now honors graceful deletion by default if no delete options are provided in the eviction request. ([#72730](https://github.com/kubernetes/kubernetes/pull/72730), [@liggitt](https://github.com/liggitt))

### Auth

- Added `kubectl auth can-i --list` option, which allows users to  know what actions they can do in specific namespaces. ([#64820](https://github.com/kubernetes/kubernetes/pull/64820), [@WanLinghao](https://github.com/WanLinghao))
- The `rules` field in RBAC `Role` and `ClusterRole` objects is now correctly reported as optional in the openapi schema. ([#73250](https://github.com/kubernetes/kubernetes/pull/73250), [@liggitt](https://github.com/liggitt))
- `system:kube-controller-manager` and `system:kube-scheduler` users are now permitted to perform delegated authentication/authorization checks by default RBAC policy ([#72491](https://github.com/kubernetes/kubernetes/pull/72491), [@liggitt](https://github.com/liggitt))
- Error messages returned in authentication webhook status responses are now correctly included in the apiserver log ([#73595](https://github.com/kubernetes/kubernetes/pull/73595), [@liggitt](https://github.com/liggitt))
- Fixed use of webhook admission plugins with multi-version custom resources ([#74154](https://github.com/kubernetes/kubernetes/pull/74154), [@mbohlool](https://github.com/mbohlool))

### AWS

- Prevented AWS Network Load Balancer security groups ingress rules to be deleted by ensuring target groups are tagged. ([#73594](https://github.com/kubernetes/kubernetes/pull/73594), [@masterzen](https://github.com/masterzen))
- AWS ELB health checks will now use HTTPS/SSL protocol for HTTPS/SSL backends. ([#70309](https://github.com/kubernetes/kubernetes/pull/70309), [@2rs2ts](https://github.com/2rs2ts))

### Azure

- Fixed failure to detach Azure disk when there is server side error ([#74398](https://github.com/kubernetes/kubernetes/pull/74398), [@andyzhangx](https://github.com/andyzhangx))
- Fixed subnet annotation checking for Azure internal loadbalancer ([#74498](https://github.com/kubernetes/kubernetes/pull/74498), [@feiskyer](https://github.com/feiskyer))
- Fixed mixed protocol issue for Azure load balancer ([#74200](https://github.com/kubernetes/kubernetes/pull/74200), [@andyzhangx](https://github.com/andyzhangx))
- Fixed Azure accounts timeout issue when there is no out-bound IP ([#74191](https://github.com/kubernetes/kubernetes/pull/74191), [@andyzhangx](https://github.com/andyzhangx))
- Fixed Azure Container Registry anonymous repo image pull error ([#74715](https://github.com/kubernetes/kubernetes/pull/74715), [@andyzhangx](https://github.com/andyzhangx))
- Fixed parse devicePath issue on Azure Disk  ([#74499](https://github.com/kubernetes/kubernetes/pull/74499), [@andyzhangx](https://github.com/andyzhangx))

### CLI

- Fixed `--help` flag parsing  ([#74682](https://github.com/kubernetes/kubernetes/pull/74682), [@soltysh](https://github.com/soltysh))
- Fixed a bug where `kubectl describe` cannot obtain the event messages for a static pod ([#74156](https://github.com/kubernetes/kubernetes/pull/74156), [@gaorong](https://github.com/gaorong))
- Fixed panic when performing a `set env` operation on a `--local` resource ([#65636](https://github.com/kubernetes/kubernetes/pull/65636), [@juanvallejo](https://github.com/juanvallejo))
- Missing directories listed in a user's PATH are no longer considered errors and are instead logged by the `kubectl plugin list` command when listing available plugins. ([#73542](https://github.com/kubernetes/kubernetes/pull/73542), [@juanvallejo](https://github.com/juanvallejo))
- Now users can get object info like:

  ```bash
    a. kubectl get pod test-pod -o custom-columns=CONTAINER:.spec.containers[0:3].name
    b. kubectl get pod test-pod -o custom-columns=CONTAINER:.spec.containers[-2:].name
  ```

([#73063](https://github.com/kubernetes/kubernetes/pull/73063), [@WanLinghao](https://github.com/WanLinghao))

- The `kubectl api-resources` command will no longer fail to display any resources on a single failure  ([#73035](https://github.com/kubernetes/kubernetes/pull/73035), [@juanvallejo](https://github.com/juanvallejo))
- kubectl now loads config file once and uses persistent client config ([#71117](https://github.com/kubernetes/kubernetes/pull/71117), [@dixudx](https://github.com/dixudx))
- Printed `SizeLimit` of `EmptyDir` in `kubectl describe pod` outputs. ([#69279](https://github.com/kubernetes/kubernetes/pull/69279), [@dtaniwaki](https://github.com/dtaniwaki))
- `kubectl delete --all-namespaces` is now a recognized flag. ([#73716](https://github.com/kubernetes/kubernetes/pull/73716), [@deads2k](https://github.com/deads2k))

### Cloud Provider

- Fixed a bug that caused PV allocation on non-English vSphere installations to fail  ([#73115](https://github.com/kubernetes/kubernetes/pull/73115), [@alvaroaleman](https://github.com/alvaroaleman))

### Cluster Lifecycle

- kubeadm: fixed nil pointer dereference caused by a bug in url parsing ([#74454](https://github.com/kubernetes/kubernetes/pull/74454), [@bart0sh](https://github.com/bart0sh))
- CoreDNS adds readinessProbe which prevents loadbalancing to unready pods, and also allows rolling updates to work as expected. ([#74137](https://github.com/kubernetes/kubernetes/pull/74137), [@rajansandeep](https://github.com/rajansandeep))
- kubeadm no longer allows using v1alpha3 configs for anything else than converting them to `v1beta1`. ([#74025](https://github.com/kubernetes/kubernetes/pull/74025), [@rosti](https://github.com/rosti))
- kubeadm: now allows the usage of `--kubeconfig-dir` and `--config` flags on kubeadm init ([#73998](https://github.com/kubernetes/kubernetes/pull/73998), [@yagonobre](https://github.com/yagonobre))
- kubeadm: all master components are now exclusively relying on the `PriorityClassName` pod spec for annotating them as cluster critical components. Since `scheduler.alpha.kubernetes.io/critical-pod` annotation is no longer supported by Kubernetes 1.14 this annotation is no longer added to master components. ([#73857](https://github.com/kubernetes/kubernetes/pull/73857), [@ereslibre](https://github.com/ereslibre))
- kubeadm no longer dumps backtrace if it fails to remove the running containers on reset. ([#73951](https://github.com/kubernetes/kubernetes/pull/73951), [@rosti](https://github.com/rosti))
- kubeadm: fixed a bug in the underlying library for diff related to characters like '%' ([#73941](https://github.com/kubernetes/kubernetes/pull/73941), [@neolit123](https://github.com/neolit123))
- Scale max-inflight now limits together with master VM sizes. ([#73268](https://github.com/kubernetes/kubernetes/pull/73268), [@wojtek-t](https://github.com/wojtek-t))
- kubeadm reset: fixed a crash caused by the absence of a configuration file ([#73636](https://github.com/kubernetes/kubernetes/pull/73636), [@bart0sh](https://github.com/bart0sh))
- CoreDNS is now version 1.3.1 ([#73610](https://github.com/kubernetes/kubernetes/pull/73610), [@rajansandeep](https://github.com/rajansandeep))
- kubeadm: When certificates are present in joining a new control plane now ensures that they match at least the required SANs ([#73093](https://github.com/kubernetes/kubernetes/pull/73093), [@ereslibre](https://github.com/ereslibre))
- kubeadm: added back `--cert-dir` option for `kubeadm init phase certs sa` ([#73239](https://github.com/kubernetes/kubernetes/pull/73239), [@mattkelly](https://github.com/mattkelly))
- kubeadm: now explicitly waits for `etcd` to have grown when joining a new control plane ([#72984](https://github.com/kubernetes/kubernetes/pull/72984), [@ereslibre](https://github.com/ereslibre))
- kubeadm: now pulls images when joining a new control plane instance ([#72870](https://github.com/kubernetes/kubernetes/pull/72870), [@MalloZup](https://github.com/MalloZup))
- Exited kube-proxy when configuration file changes ([#59176](https://github.com/kubernetes/kubernetes/pull/59176), [@dixudx](https://github.com/dixudx))
- kube-addon-manager was updated to v9.0, and now uses kubectl v1.13.2 and prunes workload resources via the apps/v1 API ([#72978](https://github.com/kubernetes/kubernetes/pull/72978), [@liggitt](https://github.com/liggitt))
- kubeadm: Now allows certain certs/keys to be missing on the secret when transferring secrets using `--experimental-upload-certs` feature ([#75415](https://github.com/kubernetes/kubernetes/pull/75415), [@ereslibre](https://github.com/ereslibre))

### GCP

- Fixed liveness probe in fluentd-gcp cluster addon ([#74522](https://github.com/kubernetes/kubernetes/pull/74522), [@Pluies](https://github.com/Pluies))
- Reduced GCE log rotation check from 1 hour to every 5 minutes.  Rotation policy is unchanged (new day starts, log file size > 100MB). ([#72062](https://github.com/kubernetes/kubernetes/pull/72062), [@jpbetz](https://github.com/jpbetz))

### Network

- Reduces the cache TTL for negative responses to 5s minimum. ([#74093](https://github.com/kubernetes/kubernetes/pull/74093), [@blakebarnett](https://github.com/blakebarnett))

### Node

- Fixed help message for `--container-runtime-endpoint`: only unix socket is support on Linux. ([#74712](https://github.com/kubernetes/kubernetes/pull/74712), [@feiskyer](https://github.com/feiskyer))
- Image garbage collection no longer fails for images with only one tag but more than one repository associated. ([#70647](https://github.com/kubernetes/kubernetes/pull/70647), [@corvus-ch](https://github.com/corvus-ch))
- Re-issued Allocate grpc calls before starting a container that requests device-plugin resources if the cached state is missing. ([#73824](https://github.com/kubernetes/kubernetes/pull/73824), [@jiayingz](https://github.com/jiayingz))
- [CRI] Added a new field called `runtime_handler` into `PodSandbox` and `PodSandboxStatus` to track the `RuntimeClass` information of a pod. ([#73833](https://github.com/kubernetes/kubernetes/pull/73833), [@haiyanmeng](https://github.com/haiyanmeng))
- Kubelet now tries to stop containers in unknown state once before restart or remove. ([#73802](https://github.com/kubernetes/kubernetes/pull/73802), [@Random-Liu](https://github.com/Random-Liu))
- When pleg channel is full, events are now discarded and count is recorded ([#72709](https://github.com/kubernetes/kubernetes/pull/72709), [@changyaowei](https://github.com/changyaowei))
- Fixed the unexpected `NotReady` status when Node's iops is full if the runtime is dockershim. ([#74389](https://github.com/kubernetes/kubernetes/pull/74389), [@answer1991](https://github.com/answer1991))
- Fixed #73264 `cpuPeriod` was not reset, but used as set via flag, although it was disabled via alpha gate ([#73342](https://github.com/kubernetes/kubernetes/pull/73342), [@szuecs](https://github.com/szuecs))
- Updated kubelet CLI summary documentation and generated webpage ([#73256](https://github.com/kubernetes/kubernetes/pull/73256), [@deitch](https://github.com/deitch))
- Set a low `oom_score_adj` for containers in pods with system-critical priorities ([#73758](https://github.com/kubernetes/kubernetes/pull/73758), [@sjenning](https://github.com/sjenning))
- kubelet: Resolved hang/timeout issues when running large numbers of pods with unique `ConfigMap/Secret` references ([#74755](https://github.com/kubernetes/kubernetes/pull/74755), [@liggitt](https://github.com/liggitt))
- Events reported for container creation, start, and stop now report the container name in the message and are more consistently formatted. ([#73892](https://github.com/kubernetes/kubernetes/pull/73892), [@smarterclayton](https://github.com/smarterclayton))
- Removed stale `OutOfDisk` condition from kubelet side ([#72507](https://github.com/kubernetes/kubernetes/pull/72507), [@dixudx](https://github.com/dixudx))
- Fixed the setting of `NodeAddresses` when using the vSphere CloudProvider and nodes that have multiple IP addresses. ([#70805](https://github.com/kubernetes/kubernetes/pull/70805), [@danwinship](https://github.com/danwinship))
- Fixed dockershim panic issues when deleting docker images. ([#75367](https://github.com/kubernetes/kubernetes/pull/75367), [@feiskyer](https://github.com/feiskyer))
- Kubelet no longer watches `ConfigMaps` and `Secrets` for terminated pods, in worst scenario causing it to not be able to send other requests to kube-apiserver ([#74809](https://github.com/kubernetes/kubernetes/pull/74809), [@oxddr](https://github.com/oxddr))
- A new `TaintNodesByCondition` admission plugin taints newly created Node objects as "not ready", to fix a race condition that could cause pods to be scheduled on new nodes before their taints were updated to accurately reflect their reported conditions. This admission plugin is enabled by default if the `TaintNodesByCondition` feature is enabled. ([#73097](https://github.com/kubernetes/kubernetes/pull/73097), [@bsalamat](https://github.com/bsalamat))
- kubelet now accepts `pid=<number>` in the `--system-reserved` and `--kube-reserved` options to ensure that the specified number of process IDs will be reserved for the system as a whole and for Kubernetes system daemons respectively.  Please reference `Kube Reserved` and `System Reserved` in `Reserve Compute Resources for System Daemons` in the Kubernetes documentation for general discussion of resource reservation.  To utilize this functionality, you must set the feature gate `SupportNodePidsLimit=true` ([#73651](https://github.com/kubernetes/kubernetes/pull/73651)

### Scheduling

- Improved fairness of the scheduling queue by placing pods which are attempted recently behind other pods with the same priority. ([#73700](https://github.com/kubernetes/kubernetes/pull/73700), [@denkensk](https://github.com/denkensk))
- Improved scheduler robustness to ensure that unschedulable pods are reconsidered for scheduling when appropriate. ([#73700](https://github.com/kubernetes/kubernetes/pull/73700), [#72558](https://github.com/kubernetes/kubernetes/pull/72558), [@denkensk](https://github.com/denkensk), [#73078](https://github.com/kubernetes/kubernetes/pull/73078), [@Huang-Wei](https://github.com/Huang-Wei))

### Storage

- Fixed scanning of failed iSCSI targets. ([#74306](https://github.com/kubernetes/kubernetes/pull/74306), [@jsafrane](https://github.com/jsafrane))
- StorageOS volume plugin updated to fix an issue where volume mount succeeds even if request to mount via StorageOS API fails. ([#69782](https://github.com/kubernetes/kubernetes/pull/69782), [@darkowlzz](https://github.com/darkowlzz))
- Ensured directories on volumes are group-executable when using `fsGroup` ([#73533](https://github.com/kubernetes/kubernetes/pull/73533), [@mxey](https://github.com/mxey))
- Updated CSI version to 1.1 ([#75391](https://github.com/kubernetes/kubernetes/pull/75391), [@gnufied](https://github.com/gnufied))
- Ensured that volumes get provisioned based on the zone information provided in `allowedTopologies`. ([#72731](https://github.com/kubernetes/kubernetes/pull/72731), [@skarthiksrinivas](https://github.com/skarthiksrinivas))
- Extended the `VolumeSubpathEnvExpansion` alpha feature to support environment variable expansion ([#71351](https://github.com/kubernetes/kubernetes/pull/71351), [@kevtaylor](https://github.com/kevtaylor))
- Fixed a bug that prevented deletion of dynamically provisioned volumes in Quobyte backends. ([#68925](https://github.com/kubernetes/kubernetes/pull/68925), [@casusbelli](https://github.com/casusbelli))

### Testing

- e2e storage tests now run faster and are easier to read ([#72434](https://github.com/kubernetes/kubernetes/pull/72434), [@pohly](https://github.com/pohly))
- `e2e.test` now rejects unknown `--provider` values instead of merely warning about them. An empty provider name is not accepted anymore and was replaced by `skeleton` (a provider with no special behavior). ([#73402](https://github.com/kubernetes/kubernetes/pull/73402), [@pohly](https://github.com/pohly))
- Updated to go1.11.5 ([#73326](https://github.com/kubernetes/kubernetes/pull/73326), [@ixdy](https://github.com/ixdy))
- Updated to use go1.12.1 ([#75413](https://github.com/kubernetes/kubernetes/pull/75413), [@BenTheElder](https://github.com/BenTheElder))
- e2e tests that require SSH may now be used against clusters that have nodes without external IP addresses by setting the environment variable `KUBE_SSH_BASTION` to the `host:port` of a machine that is allowed to SSH to those nodes.  The same private key that the test would use is used for the bastion host.  The test connects to the bastion and then tunnels another SSH connection to the node. ([#72286](https://github.com/kubernetes/kubernetes/pull/72286), [@smarterclayton](https://github.com/smarterclayton))
- `PidPressure` now evicts pods from lowest priority to highest priority ([#72844](https://github.com/kubernetes/kubernetes/pull/72844), [@dashpole](https://github.com/dashpole))
- Split up the mondo `kubernetes-test` tarball into `kubernetes-test-portable` and `kubernetes-test-{OS}-{ARCH}` tarballs. ([#74065](https://github.com/kubernetes/kubernetes/pull/74065), [@ixdy](https://github.com/ixdy))

### VMware

- Applied zone labels to vSphere Volumes automatically. The zone labels are visible on the PV: ([#72687](https://github.com/kubernetes/kubernetes/pull/72687), [@subramanian-neelakantan](https://github.com/subramanian-neelakantan))

### Windows

Support for Windows nodes and Windows containers went going stable.

Support for Group Managed Service Accounts (GMSA) for Windows containers in Kubernetes. GMSA are a specific type of Active Directory account that provides automatic password management, simplified service principal name (SPN) management, and the ability to delegate the management to other administrators across multiple servers.

- Fixed smb remount and unmount issues on Windows ([#73661](https://github.com/kubernetes/kubernetes/pull/73661), [@andyzhangx](https://github.com/andyzhangx), [#75087](https://github.com/kubernetes/kubernetes/pull/75087), [@andyzhangx](https://github.com/andyzhangx))
- Added network stats for Windows nodes and containers ([#74788](https://github.com/kubernetes/kubernetes/pull/74788), [@feiskyer](https://github.com/feiskyer))
- The new test `[sig-network] DNS should now provide /etc/hosts entries for the cluster [LinuxOnly] [Conformance]` will validate the host entries set in the ``/etc/hosts`` file (pod's FQDN and hostname), which should be managed by Kubelet. ([#72729](https://github.com/kubernetes/kubernetes/pull/72729), [@bclau](https://github.com/bclau))
- Allowed the kubelet to pass Windows GMSA credentials down to Docker ([#73726](https://github.com/kubernetes/kubernetes/pull/73726), [@wk8](https://github.com/wk8))
- Added kube-proxy support for overlay networking and DSR in Windows and new flags for `network-name`, `source-vip`, and `enable-dsr`. ([#70896](https://github.com/kubernetes/kubernetes/pull/70896), [@ksubrmnn](https://github.com/ksubrmnn))
- windows: Ensured graceful termination when being run as windows service ([#73292](https://github.com/kubernetes/kubernetes/pull/73292), [@steffengy](https://github.com/steffengy))
- vSphere cloud provider now correctly retrieves the VM's UUID when running on Windows ([#71147](https://github.com/kubernetes/kubernetes/pull/71147), [@benmoss](https://github.com/benmoss))
- Kubelet: added `usageNanoCores` from CRI stats provider ([#73659](https://github.com/kubernetes/kubernetes/pull/73659), [@feiskyer](https://github.com/feiskyer))
- Introduced support for Windows nodes into the cluster bringup scripts for GCE. ([#73442](https://github.com/kubernetes/kubernetes/pull/73442), [@pjh](https://github.com/pjh))
- Added network stats for Windows nodes and pods. ([#70121](https://github.com/kubernetes/kubernetes/pull/70121), [@feiskyer](https://github.com/feiskyer))
- CoreDNS is only officially supported on Linux at this time.  As such, when kubeadm is used to deploy this component into your kubernetes cluster, it will be restricted (using `nodeSelectors`) to run only on nodes with that operating system. This ensures that in clusters which include Windows nodes, the scheduler will not ever attempt to place CoreDNS pods on these machines, reducing setup latency and enhancing initial cluster stability. ([#69940](https://github.com/kubernetes/kubernetes/pull/69940), [@MarcPow](https://github.com/MarcPow))

## External Dependencies

- Default etcd server and client have been updated to v3.3.10. ([#71615](https://github.com/kubernetes/kubernetes/pull/71615), [#70168](https://github.com/kubernetes/kubernetes/pull/70168))
- The list of validated docker versions has changed. 1.11.1 and 1.12.1 have been removed. The current list is 1.13.1, 17.03, 17.06, 17.09, 18.06, 18.09. ([#72823](https://github.com/kubernetes/kubernetes/pull/72823), [#72831](https://github.com/kubernetes/kubernetes/pull/72831))
- The default Go version was updated to 1.12.1. ([#75422](https://github.com/kubernetes/kubernetes/pull/75422))
- CNI has been updated to v0.7.5 ([#75455](https://github.com/kubernetes/kubernetes/pull/75455))
- CSI has been updated to v1.1.0. ([#75391](https://github.com/kubernetes/kubernetes/pull/75391))
- The dashboard add-on has been updated to v1.10.1. ([#72495](https://github.com/kubernetes/kubernetes/pull/72495))
- Cluster Autoscaler has been updated to v1.14.0 ([#75480](https://github.com/kubernetes/kubernetes/pull/75480))
- kube-dns is unchanged at v1.14.13 since Kubernetes 1.12 ([#68900](https://github.com/kubernetes/kubernetes/pull/68900))
- Influxdb is unchanged at v1.3.3 since Kubernetes 1.10 ([#53319](https://github.com/kubernetes/kubernetes/pull/53319))
- Grafana is unchanged at v4.4.3 since Kubernetes 1.10 ([#53319](https://github.com/kubernetes/kubernetes/pull/53319))
- Kibana has been upgraded to v6.6.1. ([#71251](https://github.com/kubernetes/kubernetes/pull/71251))
- CAdvisor has been updated to v0.33.1 ([#75140](https://github.com/kubernetes/kubernetes/pull/75140))
- fluentd-gcp-scaler is unchanged at v0.5.0 since Kubernetes 1.13 ([#68837](https://github.com/kubernetes/kubernetes/pull/68837))
- Fluentd in fluentd-elasticsearch has been upgraded to v1.3.3 ([#71180](https://github.com/kubernetes/kubernetes/pull/71180))
- fluentd-elasticsearch has been updated to v2.4.0 ([#71180](https://github.com/kubernetes/kubernetes/pull/71180))
- The fluent-plugin-kubernetes_metadata_filter plugin in fluentd-elasticsearch has been updated to v2.1.6 ([#71180](https://github.com/kubernetes/kubernetes/pull/71180))
- fluentd-gcp is unchanged at v3.2.0 since Kubernetes 1.13 ([#70954](https://github.com/kubernetes/kubernetes/pull/70954))
- OIDC authentication is unchanged at coreos/go-oidc v2 since Kubernetes 1.10 ([#58544](https://github.com/kubernetes/kubernetes/pull/58544))
- Calico is unchanged at v3.3.1 since Kubernetes 1.13 ([#70932](https://github.com/kubernetes/kubernetes/pull/70932))
- crictl on GCE is unchanged at v1.12.0 since Kubernetes 1.13 ([#69033](https://github.com/kubernetes/kubernetes/pull/69033))
- CoreDNS has been updated to v1.3.1 ([#73610](https://github.com/kubernetes/kubernetes/pull/73610))
- event-exporter has been updated to v0.2.3 ([#67691](https://github.com/kubernetes/kubernetes/pull/67691))
- Es-image has been updated to Elasticsearch 6.6.1 ([#71252](https://github.com/kubernetes/kubernetes/pull/71252))
- metrics-server remains unchanged at v0.3.1 since Kubernetes 1.12 ([#68746](https://github.com/kubernetes/kubernetes/pull/68746))
- GLBC remains unchanged at v1.2.3 since Kubernetes 1.12 ([#66793](https://github.com/kubernetes/kubernetes/pull/66793))
- Ingress-gce remains unchanged at v1.2.3 since Kubernetes 1.12 ([#66793](https://github.com/kubernetes/kubernetes/pull/66793))
- ip-masq-agen remains unchanged at v2.1.1 since Kubernetes 1.12 ([#67916](https://github.com/kubernetes/kubernetes/pull/67916))

- [v1.14.0-rc.1](#v1140-rc1)
- [v1.14.0-beta.2](#v1140-beta2)
- [v1.14.0-beta.1](#v1140-beta1)
- [v1.14.0-alpha.3](#v1140-alpha3)
- [v1.14.0-alpha.2](#v1140-alpha2)
- [v1.14.0-alpha.1](#v1140-alpha1)



# v1.14.0-rc.1

[Documentation](https://docs.k8s.io)

## Downloads for v1.14.0-rc.1


filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.14.0-rc.1/kubernetes.tar.gz) | `5cb5e8b14b301864063fd7531ab3b755fea054f540c55ecce70ac49fb59193488575eb42ba89c8b4a44f6f2d005602ffc50ac286354a16df27637dd2e05f90f0`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.14.0-rc.1/kubernetes-src.tar.gz) | `395424c2bcdb5e242995b18e8d6e5c00002ce2cb5a3964c28da0a4a181fada73ffceaccedb1fa9799be9b3c4fb5b451010cba65af4d7385c25c8c8f0298218fc`

### Client Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.14.0-rc.1/kubernetes-client-darwin-386.tar.gz) | `ea304f3f8188db30cddd5423b25dc434b8f05315103f773619a65f83bee872581d83d5498a5f36a3064815e68998746cf661802eab36bfe96217253bac7e751c`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.14.0-rc.1/kubernetes-client-darwin-amd64.tar.gz) | `17e106b63067429b9228a4879a7350c01ae98650ef2e6fcc23d00415c2e3a7c340abd5bcfc4b976f3d737d9268159ef5e5e7b08757371daad637e721a2ffb4a9`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.14.0-rc.1/kubernetes-client-linux-386.tar.gz) | `406323ea4cbd524807e73b9a2f4eb0a813730b262402c224e5076080b84452137521e5782056e39bf6017bda8ef9e797ed497d51a653ed6822357f43d86bb0ae`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.14.0-rc.1/kubernetes-client-linux-amd64.tar.gz) | `293747816e5da30c53ca29f27479fae880404edd5fca413af165e52cc7ea7ff26312bb3916896eceea75af6b232647268324da76d2d30fa2a4a688557427f7c7`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.14.0-rc.1/kubernetes-client-linux-arm.tar.gz) | `98b6749c367282048ecd0c5b70ae8b7dafad82c599e359cbbe782a530bbd7bdb84a198577251d6aedbc39fb4e0297bd929d7e988eb557556f523073227375b09`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.14.0-rc.1/kubernetes-client-linux-arm64.tar.gz) | `0a650c53946ebd9c38705df36efabbf1fbe3da1acdf418cc4ab881530e6a9089b45ef36bd4a89467106561e2165a00cc2c47f791d9ba422f36544bfa4b1e3b68`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.14.0-rc.1/kubernetes-client-linux-ppc64le.tar.gz) | `807263f316f46c9334ec4dad84895cfe2b942ac4ed9aacf3ec8a63193e0d0a6ecaf573d00dfea278d1e552fe91e9474f534ea6798700dbdc84f1d9556ecfda3e`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.14.0-rc.1/kubernetes-client-linux-s390x.tar.gz) | `5589562ce0da49f4987388e3e2b6fcf29e92859fae65fb57cdd61bba20ff574c7f3e07f4fa26bb63789f927690ce19710803e0d2e3324bd2c80ddc4925ea973d`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.14.0-rc.1/kubernetes-client-windows-386.tar.gz) | `101245cd70221b443150be046e5b5a2c6c83334085bb17f603f59bb68c5960f353d57b6761acf052449f4fb057a5525978cdd7995d06134ab98f8628c23aac0d`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.14.0-rc.1/kubernetes-client-windows-amd64.tar.gz) | `b1c3802f60cc70ebc1258cb8fc4ffa1154ecee8fda473b033be4f9d1b187354cfd75d085a1ad45a35fcc42ad640c4fecaa2496cb48fad649a774f40a5150825f`

### Server Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.14.0-rc.1/kubernetes-server-linux-amd64.tar.gz) | `8e09465aab0a1d1ec39afc98af17de9b5de99b763c0c5feb2dc824f2bbae25edb690e9d162fd44f5155bea392bd229f544850fe19e767a8b342050f4bfafc2cc`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.14.0-rc.1/kubernetes-server-linux-arm.tar.gz) | `9409c368e1f9f26e633b7df5d6c90435394931d48a21f4ad1548d172b18ac462a859019cc66dba4df69d3b10702820c9a3e1bd5c469646b1db581e52e79e035d`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.14.0-rc.1/kubernetes-server-linux-arm64.tar.gz) | `3893290dc11ca71746fee77a44a607ad9e02036bab56b7fc3be247b71b2cf5b3f639fa41317a713abbe9a997abf80c7113ff1155482d0cc04a318ec8beccf869`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.14.0-rc.1/kubernetes-server-linux-ppc64le.tar.gz) | `8ac1e70cb39aeb5b1fe92c3ebba428db2036be739f462cc2f876f17dc71a01ba263b5611a15d95e5934e2fc7aa92042bc9b2fe65cf459263be90f5fbb5d83a15`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.14.0-rc.1/kubernetes-server-linux-s390x.tar.gz) | `80576cb6cc3a69c4fc0a0358dee5772ecb38437c534a3454c9613426417d4af3c527a0809cce4d46653a7b001c58033b06326c80c498d17387569d22d3ca9b22`

### Node Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.14.0-rc.1/kubernetes-node-linux-amd64.tar.gz) | `71cd5dd6075a2eea851231a5a855e58b3f479d83358defafd068dd1d09e5b2c426a8a046ee621de91e17d7ecd67465911b93549088bf27a41c6e6b77d692a8c7`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.14.0-rc.1/kubernetes-node-linux-arm.tar.gz) | `48babf4a52013c2bc69049167579ba1bc70c769b782a2704c9dfcf44a6a8a72f07e0789af347135ee4797f2bf1a216c348a9a4a26be71855e95e8387bf4e2aac`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.14.0-rc.1/kubernetes-node-linux-arm64.tar.gz) | `cc19a52beaa7440ca7581e85d1e10137e93c2decdb7d7d7919e7fdcded63e4d94b3434513ca881dae844dd1eb1e2fe98ea5332fad5ffced846f729894ecf0ed1`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.14.0-rc.1/kubernetes-node-linux-ppc64le.tar.gz) | `241bf20ae366384efa0fb3798e07e1cdd3d4ea7ba91c146ef7761fb0b93a8514a0dd91f9eb47999ae263d6793e0577c2bbecf88548bcae06cedb437331d6d3bc`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.14.0-rc.1/kubernetes-node-linux-s390x.tar.gz) | `37ce3e021073c6c10cf240fb2c3f9a7ab35ece3c0b4a9fecbbdf790eb348b168d179824f3a8eb57d56f962b64f8a6a71925152c087f5bfe43b004cbfae65674d`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.14.0-rc.1/kubernetes-node-windows-amd64.tar.gz) | `3248db12c274171f094ef41d6a59523aec35655ba35d151576ff2d2089c269f345e2c0646d585d7c04c440c6b4e7379c499bc8f51fcc8b91388e3dc4d1b6a899`

## Changelog since v1.14.0-beta.2

### Action Required

* ACTION REQUIRED: Health check (liveness & readiness) probes using an HTTPGetAction will no longer follow redirects to different hostnames from the original probe request. Instead, these non-local redirects will be treated as a Success (the documented behavior). In this case an event with reason "ProbeWarning" will be generated, indicating that the redirect was ignored. If you were previously relying on the redirect to run health checks against different endpoints, you will need to perform the healthcheck logic outside the Kubelet, for instance by proxying the external endpoint rather than redirecting to it. ([#75416](https://github.com/kubernetes/kubernetes/pull/75416), [@tallclair](https://github.com/tallclair))

### Other notable changes

* Restores --username and --password flags to kubectl ([#75451](https://github.com/kubernetes/kubernetes/pull/75451), [@liggitt](https://github.com/liggitt))
* fix race condition issue for smb mount on windows ([#75371](https://github.com/kubernetes/kubernetes/pull/75371), [@andyzhangx](https://github.com/andyzhangx))
* UDP Service conntrack entries for ExternalIPs are now correctly cleared when endpoints are added  ([#75265](https://github.com/kubernetes/kubernetes/pull/75265), [@JacobTanenbaum](https://github.com/JacobTanenbaum))
* kubeadm: the kubeadm init output now provides join control-plane example only when the preconditions for joining a control plane are satisfied ([#75420](https://github.com/kubernetes/kubernetes/pull/75420), [@fabriziopandini](https://github.com/fabriziopandini))
* Fix dockershim panic issues when deleting docker images. ([#75367](https://github.com/kubernetes/kubernetes/pull/75367), [@feiskyer](https://github.com/feiskyer))
* kubeadm: Allow certain certs/keys to be missing on the secret when transferring secrets using `--experimental-upload-certs` feature ([#75415](https://github.com/kubernetes/kubernetes/pull/75415), [@ereslibre](https://github.com/ereslibre))
* Update to use go1.12.1 ([#75413](https://github.com/kubernetes/kubernetes/pull/75413), [@BenTheElder](https://github.com/BenTheElder))
* Update CSI version to 1.1 ([#75391](https://github.com/kubernetes/kubernetes/pull/75391), [@gnufied](https://github.com/gnufied))
* Ensure ownership when deleting a load balancer security group ([#74311](https://github.com/kubernetes/kubernetes/pull/74311), [@hpedrorodrigues](https://github.com/hpedrorodrigues))
* kubelet: updated logic of verifying a static critical pod. ([#75144](https://github.com/kubernetes/kubernetes/pull/75144), [@Huang-Wei](https://github.com/Huang-Wei))
* Allow disable outbound SNAT when Azure standard load balancer is used together with outbound rules.  ([#75282](https://github.com/kubernetes/kubernetes/pull/75282), [@feiskyer](https://github.com/feiskyer))
* Add ResourceVersion as a precondition for delete in order to ensure a delete fails if an unobserved change happens to an object. ([#74040](https://github.com/kubernetes/kubernetes/pull/74040), [@ajatprabha](https://github.com/ajatprabha))
* Services of type=LoadBalancer which have no endpoints will now immediately ICMP reject connections, rather than time out. ([#74394](https://github.com/kubernetes/kubernetes/pull/74394), [@thockin](https://github.com/thockin))
* Ensure Azure load balancer cleaned up on 404 or 403 when deleting LoadBalancer services. ([#75256](https://github.com/kubernetes/kubernetes/pull/75256), [@feiskyer](https://github.com/feiskyer))



# v1.14.0-beta.2

[Documentation](https://docs.k8s.io)

## Downloads for v1.14.0-beta.2


filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.14.0-beta.2/kubernetes.tar.gz) | `c1d5f2615c3319fc167c577f40f385abe6652bf4fd3bdb04617b36029dc3000b190c18b4b3a29827da75c680979697d61fffb45b86ba6226f880b98b2f308f4f`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.14.0-beta.2/kubernetes-src.tar.gz) | `0a8d8ed208bc0bf424060126c76fcd8dbbd53a9b9695647314a4097f7013f548b76850438933760ff76835867676cddddf65134ad79f977ecdb98632fc2edda3`

### Client Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.14.0-beta.2/kubernetes-client-darwin-386.tar.gz) | `c919d030255c5d3879926d8aaa53939cd5aa37084799748452166ca6668bd1d10edf063d633682cddafaaed43dd1b991f4ad09139c5e4f519bd69f581b3fe0aa`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.14.0-beta.2/kubernetes-client-darwin-amd64.tar.gz) | `ec14d4a1d720890065211544b099be17315265534cfd20435194dc842cc807c20b5fae78f5b95ba7d05f3d921d522017f50861760d195ce1bf5b1acfdb2dbb29`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.14.0-beta.2/kubernetes-client-linux-386.tar.gz) | `6cee12be5b855600ee80f15d1e0511099941b099bd5b252549abdc2a65c077f10ca4d53ab9804a0ce8d51f3b9cbab829cb551733cd4aed37c0d91238b82a8fe4`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.14.0-beta.2/kubernetes-client-linux-amd64.tar.gz) | `27d8cd48c1f3259055965b85a6b973ecb5b8a36894f94c232d773f89539e28e6c270bfe35427c70b4ad4800e42c869851981cf88f586b7d488efa538e6c88126`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.14.0-beta.2/kubernetes-client-linux-arm.tar.gz) | `7f98230569c61fdf2b141e519f042b2e27ff37aeda746dc30bb7ce226b5d6b0c0bb85c6070b9ffc8d38c2441feb5bd8736c67708a59552e86a2c30cc02ecdece`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.14.0-beta.2/kubernetes-client-linux-arm64.tar.gz) | `159da67010af38d87c5318b7ad594120afd6a9b780d11d6e607e7214862cd6514b00da673cce72574771dbc780ab435dbba0a3267f051a20155c05ee0729ded0`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.14.0-beta.2/kubernetes-client-linux-ppc64le.tar.gz) | `d8ca7871d3d40947db69061284cb31c4d072d4da56fbb11a4485f6853f041835d9605cfc5dcea88d58c7f484cce13dbca485e80891c845291b9b28c574df310b`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.14.0-beta.2/kubernetes-client-linux-s390x.tar.gz) | `1c58db90b6e09b8d8f956a00263cb20271b8403f7fb6c5b20d76cca9ed973c35d2f5c910a6d42980ec9159480682d3786a59e9e05ce356a7e3b4181c848ad122`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.14.0-beta.2/kubernetes-client-windows-386.tar.gz) | `00fb87dd4899208dd6607c22828f3985ebfd5e1f97cb24e3b2c69c249a4887d5c26c603b3bb4c21f9e2b737c917ddf95a1818d9de5c9ec97d3f5faa0c3dada52`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.14.0-beta.2/kubernetes-client-windows-amd64.tar.gz) | `7afdf637d62dde480162ad1521360b2bc78e0d4d20f6e6201e2f19b55b8e9bbd69c1ce8d03101c750ef389c65a1bc0a94dfc9a2d501d6840fd31eacbd3582028`

### Server Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.14.0-beta.2/kubernetes-server-linux-amd64.tar.gz) | `2ac3c4910cd36f02a62304d78fe144b821edf445c522028e6b57d2dc3bcc7355159a58815d5a6991b3f2c33bb0ef23e07134c8bbf93b34be7452f80c9a9e6edf`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.14.0-beta.2/kubernetes-server-linux-arm.tar.gz) | `db06b5f1a83ca4ec82428ab771eae2858b188dc23780fb9b146494c06aa6175421090b200c58b670e2d4253a7e0d4b07172a632e0754c35ccdee7e264c636f17`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.14.0-beta.2/kubernetes-server-linux-arm64.tar.gz) | `b40e1745d1ecfcc95f3a750990244fa128381d6d74246798a62aecb8cec9c77cdcd470e79334eb5c670e1e3a288080b4e26a080c64481ba608e3156c72df474b`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.14.0-beta.2/kubernetes-server-linux-ppc64le.tar.gz) | `c84297fd2b18b6bdade5a135a3da929e286bbba5c8dd66778091bad4eea1ac4b97a32ab3b146a88f0716bebcce9a4a85a7cd421cb185a3df864dcfa77312b3a9`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.14.0-beta.2/kubernetes-server-linux-s390x.tar.gz) | `39c8f6e7f52bec155b11652b4e80c2c52acf8754dbdf80a9d5bab5370d1debf4f4783c1a6968d41822b00ff744c72947df6cbc4623578e7679b9ce9a98f64ff3`

### Node Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.14.0-beta.2/kubernetes-node-linux-amd64.tar.gz) | `bf19ae7140836aea1b6f414532eff886e3b91e0746b9224ce46e60e0b83fa90a8c3df1ff8e01ff340a1e1874ce15da28e98224024ed3139589474e89befa19f2`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.14.0-beta.2/kubernetes-node-linux-arm.tar.gz) | `4b8194340a8675107da3969845173fb34ed2b0a38745ec0ac395ebf2116ee84d55be6e22ff84fafbaf4ca60a05f6debf6e95957a2261ac8a587eea32e5803fd5`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.14.0-beta.2/kubernetes-node-linux-arm64.tar.gz) | `8494dae5225f3b543afd575003fe0f30eb0f3cf9bc9dfbae72d6bda8f17c5446165433c28842a114af66ac3ae8fca9f92d780d1eb93e9bcb6b5dcc4fe8cd2a7f`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.14.0-beta.2/kubernetes-node-linux-ppc64le.tar.gz) | `0bd41d95f0a76c1b057a8913a8b2cffbf6d48c47aef1d9beed0de205b8010e8071e8f527eeaa003730ef97a017083278cb2036cf22a1abfb2f4669b935823cdc`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.14.0-beta.2/kubernetes-node-linux-s390x.tar.gz) | `169b16512df42a6cb5b000a3d6d6da5ae48a733c5d11b034eaec6b3816b86ec97b92e4075872900188bc296427037299841224e552ccf079097d5cf333627cbc`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.14.0-beta.2/kubernetes-node-windows-amd64.tar.gz) | `ccfebde5176cb28529552889250bf706add04df3c3f9aee5b8bdd9ebdb5bce334add8351cdbeebb9bd4b17b31d994b7739d2c494aa4c64bcb3ceba1a6ef53447`

## Changelog since v1.14.0-beta.1

### Action Required

* ACTION REQUIRED: The node.k8s.io API group and runtimeclasses.node.k8s.io resource have been migrated to a built-in API. If you were using RuntimeClasses (an default-disabled alpha feature, as of Kubernetes v1.12), then you must recreate all RuntimeClasses after upgrading, and the runtimeclasses.node.k8s.io CRD should be manually deleted. RuntimeClasses can no longer be created without a defined handler. ([#74433](https://github.com/kubernetes/kubernetes/pull/74433), [@tallclair](https://github.com/tallclair))
    * Introduce a RuntimeClass v1beta1 API. This new beta API renames `runtimeHandler` to `handler`, makes it a required field, and cuts out the spec (handler is a top-level field).
* Transition CSINodeInfo and CSIDriver alpha CRDs to in-tree CSINode and CSIDriver core storage v1beta1 APIs. ([#74283](https://github.com/kubernetes/kubernetes/pull/74283), [@xing-yang](https://github.com/xing-yang))
    * ACTION REQUIRED: the alpha CRDs are no longer used and drivers will need to be updated to use the beta APIs.
    * The support for `_` in the CSI driver name will be dropped as the CSI Spec does not allow that. 

### Other notable changes

* Support collecting pod logs under /var/log/pods/NAMESPACE_NAME_UID to stackdriver with `k8s_pod` resource type. ([#74502](https://github.com/kubernetes/kubernetes/pull/74502), [@Random-Liu](https://github.com/Random-Liu))
* --make-symlinks for hyperkube was marked hidden for a while, This flag is now deprecated and will be removed in a future release. ([#74975](https://github.com/kubernetes/kubernetes/pull/74975), [@dims](https://github.com/dims))
* fix smb unmount issue on Windows ([#75087](https://github.com/kubernetes/kubernetes/pull/75087), [@andyzhangx](https://github.com/andyzhangx))
* Kubelet no longer watches configmaps and secrets for terminated pods, in worst scenario causing it to not be able to send other requests to kube-apiserver ([#74809](https://github.com/kubernetes/kubernetes/pull/74809), [@oxddr](https://github.com/oxddr))
* - Fixes a bug concerning Quobyte volumes where user mappings only worked if the hosts Kubernetes plugin mount was provided via an external configuration using the _allow-usermapping-in-volumename_ option. ([#74520](https://github.com/kubernetes/kubernetes/pull/74520), [@casusbelli](https://github.com/casusbelli))
* Change CRI pod log directory from `/var/log/pods/UID` to `/var/log/pods/NAMESPACE_NAME_UID`. ([#74441](https://github.com/kubernetes/kubernetes/pull/74441), [@Random-Liu](https://github.com/Random-Liu))
    * It is recommended to drain the node before upgrade, or reboot the node after upgrade.
* Promote RuntimeClass to beta, and enable by default. ([#75003](https://github.com/kubernetes/kubernetes/pull/75003), [@tallclair](https://github.com/tallclair))
* New "dry_run" metric label (indicating the value of the dryRun query parameter) into the metrics: ([#74997](https://github.com/kubernetes/kubernetes/pull/74997), [@jennybuckley](https://github.com/jennybuckley))
        * apiserver_request_total
        * apiserver_request_duration_seconds
    * New "APPLY" value for the "verb" metric label which indicates a PATCH with "Content-Type: apply-patch+yaml". This value is experimental and will only be present if the ServerSideApply alpha feature is enabled.
* GCE: bump COS image version to cos-beta-73-11647-64-0 ([#75149](https://github.com/kubernetes/kubernetes/pull/75149), [@yguo0905](https://github.com/yguo0905))
* - Add duration metric for CRD webhook converters ([#74376](https://github.com/kubernetes/kubernetes/pull/74376), [@mbohlool](https://github.com/mbohlool))
* Alpha support for ephemeral CSI inline volumes that are embedded in pod specs. ([#74086](https://github.com/kubernetes/kubernetes/pull/74086), [@vladimirvivien](https://github.com/vladimirvivien))
* Add support for node side CSI volume expansion ([#74863](https://github.com/kubernetes/kubernetes/pull/74863), [@gnufied](https://github.com/gnufied))
* - Add mechanism for Admission Webhooks to specify which version of AdmissionReview they support ([#74998](https://github.com/kubernetes/kubernetes/pull/74998), [@mbohlool](https://github.com/mbohlool))
    * - Add mechanism for CRD Conversion Webhooks to specify which version of ConversionReview they support
* Add a new kubelet endpoint for serving first-class resource metrics ([#73946](https://github.com/kubernetes/kubernetes/pull/73946), [@dashpole](https://github.com/dashpole))
* Deprecate AWS, Azure, GCE and Cinder specific volume limit predicates. ([#74544](https://github.com/kubernetes/kubernetes/pull/74544), [@gnufied](https://github.com/gnufied))
* PodReadinessGate feature is now GA. The feature gate will not allow disabling it. ([#74434](https://github.com/kubernetes/kubernetes/pull/74434), [@freehan](https://github.com/freehan))
* If CSINodeInfo and CSIMigration feature flags are active in the cluster, Kubelet will post NotReady until CSINode is initialized with basic volume plugin mechanism information for well-known drivers ([#74835](https://github.com/kubernetes/kubernetes/pull/74835), [@davidz627](https://github.com/davidz627))
* Add network stats for Windows nodes and containers ([#74788](https://github.com/kubernetes/kubernetes/pull/74788), [@feiskyer](https://github.com/feiskyer))
* kubeadm: when calling "reset" on a control-plane node, remove the APIEndpoint information for this node from the ClusterStatus in the kubeadm ConfigMap. ([#75082](https://github.com/kubernetes/kubernetes/pull/75082), [@neolit123](https://github.com/neolit123))
* kube-apiserver now serves OpenAPI specs for registered CRDs with defined  ([#71192](https://github.com/kubernetes/kubernetes/pull/71192), [@roycaihw](https://github.com/roycaihw))
    * validation schemata as an alpha feature, to be enabled via the "CustomResourcePublishOpenAPI" feature gate. Kubectl will validate client-side using those. Note that in
    * future, client-side validation in 1.14 kubectl against a 1.15 cluster will reject
    * unknown fields for CRDs with validation schema defined. 
* Fix kubelet start failure issue on Azure Stack due to InstanceMetadata setting ([#74936](https://github.com/kubernetes/kubernetes/pull/74936), [@rjaini](https://github.com/rjaini))
* add subcommand `kubectl create cronjob` ([#71651](https://github.com/kubernetes/kubernetes/pull/71651), [@Pingan2017](https://github.com/Pingan2017))
* The CSIBlockVolume feature gate is now beta, and defaults to enabled. ([#74909](https://github.com/kubernetes/kubernetes/pull/74909), [@bswartz](https://github.com/bswartz))
* Pre-existing log files are now opened with O_APPEND, instead of O_TRUNC. This helps prevent losing logs when components crash-loop, and also enables external log rotation utilities to truncate log files in-place without components extending log files to their pre-truncation sizes on subsequent writes. ([#74837](https://github.com/kubernetes/kubernetes/pull/74837), [@mtaufen](https://github.com/mtaufen))
* the test/e2e/e2e.test binary can test arbitrary storage drivers, see the `-storage.testdriver` parameter ([#72836](https://github.com/kubernetes/kubernetes/pull/72836), [@pohly](https://github.com/pohly))
* Fix panic in kubectl cp command ([#75037](https://github.com/kubernetes/kubernetes/pull/75037), [@soltysh](https://github.com/soltysh))
* iscsi modules haven't even been loaded /sys/class/iscsi_host directory won't exist ([#74787](https://github.com/kubernetes/kubernetes/pull/74787), [@jianglingxia](https://github.com/jianglingxia))
* the fluentd addon daemonset will now target all nodes. ([#74424](https://github.com/kubernetes/kubernetes/pull/74424), [@liggitt](https://github.com/liggitt))
        * setting `ENABLE_METADATA_CONCEALMENT=true` in kube-up will now set a `cloud.google.com/metadata-proxy-ready=true` label on new nodes. In v1.16, the metadata proxy add-on will switch to using that label as a node selector.
        * setting `KUBE_PROXY_DAEMONSET=true` in kube-up will now set a `node.kubernetes.io/kube-proxy-ds-ready=true` label on new nodes. In v1.16, the kube-proxy daemonset add-on will switch to using that label as a node selector.
        * In 1.16, the masq-agent daemonset add-on will switch to using `node.kubernetes.io/masq-agent-ds-ready` as a node selector.
* - Kubelet: replace `du` and `find` with a golang implementation ([#74675](https://github.com/kubernetes/kubernetes/pull/74675), [@dashpole](https://github.com/dashpole))
    * - Kubelet: periodically update machine info to support hot-add/remove
* kubeadm: add certificate-key and skip-certificate-key-print flags to kubeadm init ([#74671](https://github.com/kubernetes/kubernetes/pull/74671), [@yagonobre](https://github.com/yagonobre))
* Admission webhooks rules can now limit scope to only match namespaced, or only cluster-scoped resources with a `scope: "Cluster" | "Namespaced" | "*"` field. ([#74477](https://github.com/kubernetes/kubernetes/pull/74477), [@liggitt](https://github.com/liggitt))
* The CSIPersistentVolume and KubeletPluginWatcher feature gates cannot be disabled, and will be removed in Kubernetes v1.16 ([#74830](https://github.com/kubernetes/kubernetes/pull/74830), [@msau42](https://github.com/msau42))
* Kubelet won't evict a static pod with priority `system-node-critical` upon resource pressure. ([#74222](https://github.com/kubernetes/kubernetes/pull/74222), [@Huang-Wei](https://github.com/Huang-Wei))
* Fixes panic if a kubelet is run against an older kube-apiserver ([#74529](https://github.com/kubernetes/kubernetes/pull/74529), [@liggitt](https://github.com/liggitt))
* The resource group name in Azure providerID is not converted to lower cases. ([#74882](https://github.com/kubernetes/kubernetes/pull/74882), [@feiskyer](https://github.com/feiskyer))
* Remove the out-of-tree PersistentVolumeLabel controller because it cannot run without Initializers (removed in v1.14). If you are using AWS EBS, GCE PD, Azure Disk, Cinder Disk or vSphere volumes and rely on zone labels, then enable the `PersistentVolumeLabel` admission controller in the `kube-apiserver` in the `--enable-admission-plugins` flag.  ([#74615](https://github.com/kubernetes/kubernetes/pull/74615), [@andrewsykim](https://github.com/andrewsykim))
* kubeadm: improved RequiredIPVSKernelModulesAvailable warning message ([#74033](https://github.com/kubernetes/kubernetes/pull/74033), [@bart0sh](https://github.com/bart0sh))
* Add `nullable` support to CustomResourceDefinition OpenAPI validation schemata. ([#74804](https://github.com/kubernetes/kubernetes/pull/74804), [@sttts](https://github.com/sttts))
* Fix kube-apiserver not to create default/kubernetes service endpoints before it reports readiness via the /healthz and therefore is ready to serve requests. Also early during startup old endpoints are remove which might be left over from a previously crashed kube-apiserver. ([#74668](https://github.com/kubernetes/kubernetes/pull/74668), [@sttts](https://github.com/sttts))
* kubeadm: fix a bug where standard kubeconfig paths were searched even if the user provided /etc/kubernetes/admin.conf explicitly for commands that accept --kubeconfig, like kubeadm token. ([#71874](https://github.com/kubernetes/kubernetes/pull/71874), [@neolit123](https://github.com/neolit123))
    * kubeadm: use the default kubeconfig (/etc/kubernetes/admin.conf) for "kubeadm reset" and "kubeadm upgrade" commands.
* Increase api server client certificate expiration histogram resolution to accommodate short-lived (< 6h) client certificates. ([#74806](https://github.com/kubernetes/kubernetes/pull/74806), [@mxinden](https://github.com/mxinden))
* Default RBAC policy no longer grants access to discovery and permission-checking APIs (used by `kubectl auth can-i`) to *unauthenticated* users. Upgraded clusters preserve prior behavior, but cluster administrators wishing to grant unauthenticated users access in new clusters will need to explicitly opt-in to expose the discovery and/or permission-checking APIs: ([#73807](https://github.com/kubernetes/kubernetes/pull/73807), [@dekkagaijin](https://github.com/dekkagaijin))
        * `kubectl create clusterrolebinding anonymous-discovery --clusterrole=system:discovery --group=system:unauthenticated`
        * `kubectl create clusterrolebinding anonymous-access-review --clusterrole=system:basic-user --group=system:unauthenticated`
* The PersistentLocalVolumes feature is GA. The feature gate cannot be disabled and will be removed in Kubernetes 1.17 ([#74769](https://github.com/kubernetes/kubernetes/pull/74769), [@msau42](https://github.com/msau42))
* kubelet: resolved hang/timeout issues when running large numbers of pods with unique configmap/secret references by reverting to 1.11 configmap/secret lookup behavior ([#74755](https://github.com/kubernetes/kubernetes/pull/74755), [@liggitt](https://github.com/liggitt))
* Convert `latency`/`latencies` in metrics name to `duration`. ([#74418](https://github.com/kubernetes/kubernetes/pull/74418), [@danielqsj](https://github.com/danielqsj))
    * The following metrics are changed and mark previous metrics as deprecated:
        * `rest_client_request_latency_seconds` -> `rest_client_request_duration_seconds`
        * `apiserver_proxy_tunnel_sync_latency_secs` -> `apiserver_proxy_tunnel_sync_duration_seconds`
        * `scheduler_scheduling_latency_seconds` -> `scheduler_scheduling_duration_seconds `
* Fix help message for --container-runtime-endpoint: only unix socket is support on Linux. ([#74712](https://github.com/kubernetes/kubernetes/pull/74712), [@feiskyer](https://github.com/feiskyer))
* Update to use golang 1.12 ([#74632](https://github.com/kubernetes/kubernetes/pull/74632), [@cblecker](https://github.com/cblecker))
* The `RunAsGroup` feature has been promoted to beta and enabled by default. PodSpec and PodSecurityPolicy objects can be used to control the primary GID of containers on supported container runtimes. ([#73007](https://github.com/kubernetes/kubernetes/pull/73007), [@krmayankk](https://github.com/krmayankk))
* fix Azure Container Registry anonymous repo image pull error ([#74715](https://github.com/kubernetes/kubernetes/pull/74715), [@andyzhangx](https://github.com/andyzhangx))
* Adds the same information to an init container as a standard container in a pod when using PodPresets. ([#71479](https://github.com/kubernetes/kubernetes/pull/71479), [@soggiest](https://github.com/soggiest))
* fix the flake in scheduling_queue_test.go ([#74611](https://github.com/kubernetes/kubernetes/pull/74611), [@denkensk](https://github.com/denkensk))
* The kube-apiserver OpenAPI definitions with the prefix "io.k8s.kubernetes.pkg" (deprecated since 1.9) have been removed. ([#74596](https://github.com/kubernetes/kubernetes/pull/74596), [@sttts](https://github.com/sttts))
* kube-conformance image will now run ginkgo with the --dryRun flag if the container is run with the environment variable E2E_DRYRUN set. ([#74731](https://github.com/kubernetes/kubernetes/pull/74731), [@johnSchnake](https://github.com/johnSchnake))
* The deprecated `MountPropagation` feature gate has been removed, and the feature is now unconditionally enabled.  ([#74720](https://github.com/kubernetes/kubernetes/pull/74720), [@bertinatto](https://github.com/bertinatto))
* Introduce dynamic volume provisioning shim for CSI migration ([#73653](https://github.com/kubernetes/kubernetes/pull/73653), [@ddebroy](https://github.com/ddebroy))
* Fix --help flag parsing  ([#74682](https://github.com/kubernetes/kubernetes/pull/74682), [@soltysh](https://github.com/soltysh))
* This PR removes the following metrics: ([#74636](https://github.com/kubernetes/kubernetes/pull/74636), [@logicalhan](https://github.com/logicalhan))
    *   reflector_items_per_list
    *   reflector_items_per_watch
    *   reflector_last_resource_version
    *   reflector_list_duration_seconds
    *   reflector_lists_total
    *   reflector_short_watches_total
    *   reflector_watch_duration_seconds
    *   reflector_watches_total
    * While this is a backwards-incompatible change, it would have been impossible to setup reliable monitoring around these metrics since the labels were not stable. 
* Add a configuration field to shorten the timeout of validating/mutating admission webhook call. The timeout value must be between 1 and 30 seconds. Default to 30 seconds when unspecified.  ([#74562](https://github.com/kubernetes/kubernetes/pull/74562), [@roycaihw](https://github.com/roycaihw))
* client-go: PortForwarder.GetPorts() now contain correct local port if no local port was initially specified when setting up the port forwarder ([#73676](https://github.com/kubernetes/kubernetes/pull/73676), [@martin-helmich](https://github.com/martin-helmich))
* # Apply resources from a directory containing kustomization.yaml ([#74140](https://github.com/kubernetes/kubernetes/pull/74140), [@Liujingfang1](https://github.com/Liujingfang1))
    *         kubectl apply -k dir
    *         # Delete resources from a directory containing kustomization.yaml.
    *         kubectl delete -k dir
    *         # List resources from a directory containing kustomization.yaml
    *         kubectl get -k dir
* kubeadm: Allow to download certificate secrets uploaded by `init` or `upload-certs` phase, allowing to transfer certificate secrets (certificates and keys) from the cluster to other master machines when creating HA deployments. ([#74168](https://github.com/kubernetes/kubernetes/pull/74168), [@ereslibre](https://github.com/ereslibre))
* Fixes an issue with missing apiVersion/kind in object data sent to admission webhooks ([#74448](https://github.com/kubernetes/kubernetes/pull/74448), [@liggitt](https://github.com/liggitt))
* client-go: the deprecated versionless API group accessors (like `clientset.Apps()` have been removed). Use an explicit version instead (like `clientset.AppsV1()`) ([#74422](https://github.com/kubernetes/kubernetes/pull/74422), [@liggitt](https://github.com/liggitt))
* The `--quiet` option to `kubectl run` now suppresses resource deletion messages emitted when the `--rm` option is specified. ([#73266](https://github.com/kubernetes/kubernetes/pull/73266), [@awh](https://github.com/awh))
* Add Custom Resource support to "kubectl autoscale" ([#72678](https://github.com/kubernetes/kubernetes/pull/72678), [@rmohr](https://github.com/rmohr))
* Image garbage collection no longer fails for images with only one tag but more than one repository associated. ([#70647](https://github.com/kubernetes/kubernetes/pull/70647), [@corvus-ch](https://github.com/corvus-ch))
* - Fix liveness probe in fluentd-gcp cluster addon ([#74522](https://github.com/kubernetes/kubernetes/pull/74522), [@Pluies](https://github.com/Pluies))
* The new test ``[sig-network] DNS should provide /etc/hosts entries for the cluster [LinuxOnly] [Conformance]`` will validate the host entries set in the ``/etc/hosts`` file (pod's FQDN and hostname), which should be managed by Kubelet. ([#72729](https://github.com/kubernetes/kubernetes/pull/72729), [@bclau](https://github.com/bclau))
    * The test has the tag ``[LinuxOnly]`` because individual files cannot be mounted in Windows Containers, which means that it cannot pass using Windows nodes. 



# v1.14.0-beta.1

[Documentation](https://docs.k8s.io)

## Downloads for v1.14.0-beta.1


filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.14.0-beta.1/kubernetes.tar.gz) | `065014c751635f8c077fbcc105df578594baf8afd8b8339004909198e1bd68d0a7ce3644ed5d54e5964d1306aa650f22a5ce83063415240f4dffd6706c1cc33b`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.14.0-beta.1/kubernetes-src.tar.gz) | `244c19d9fad21ae154ee78fc94888dc60bcfcf3ec72bdc28a82e77c572cbc969d2abbf20397ef9564a35585c08dfe179b105fc25efac973e0a13d78ee2ff8f42`

### Client Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.14.0-beta.1/kubernetes-client-darwin-386.tar.gz) | `78a61a1e922daa39a9f7dd61b8bad87d202b537bda59f90ae8aae941c0ff412e3d328530af9dd9f22462cbd67254e7ce1556defe48bb10bd6a94d4302464fe8e`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.14.0-beta.1/kubernetes-client-darwin-amd64.tar.gz) | `5a1d66fd90a5dc07b95b7617b5583595e0a4a664e7005f6281f846c85b21e28692b2e2d55b7c40c7b8cbb96b6b8cd6c832f340c7cc67579641beabac033014ad`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.14.0-beta.1/kubernetes-client-linux-386.tar.gz) | `30991ce0776bae7551b98a811e3ccb5104b0859805c41a216db7d5779cddfb36ef3c5e658ea2adeaf67f8e6f181768850b09a0e8320c2983d34664156ea638ac`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.14.0-beta.1/kubernetes-client-linux-amd64.tar.gz) | `5501a9c3a95e43f0c691b05043546f2c497d50a6ad88b88219842d61be83d7dcb8871ff9fd2447c02bc842c4c962f298a3ce2e0618fae70e8aa391c9407626e5`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.14.0-beta.1/kubernetes-client-linux-arm.tar.gz) | `4bf341a2f943719d006f4cacc26fdf4d021560d37d49c8d9c4620d294142041155a88dc721d9373a8617e1baa904c02b4545f379ffe87c6ab20e5459a5d3c2de`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.14.0-beta.1/kubernetes-client-linux-arm64.tar.gz) | `1c0c660618947b053404ab8ef40bdec0a06d54a1f9edc585a7259806f878327d9ae54100bba98e5b7f44f5db4303276d189792e68517603520a49868c07e684c`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.14.0-beta.1/kubernetes-client-linux-ppc64le.tar.gz) | `9d2c3f4bfbad03b41859670f9cfda6596f51a89077fd4da2f74490f71b5de10e459954e897d2a1ba3a217c62caaf1be74424e5bf6a5609868dc4f069ac06c94f`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.14.0-beta.1/kubernetes-client-linux-s390x.tar.gz) | `9be5259caf39ff3c4d0f024d616bff50ac417d42a87c56b6877fbdf5aaadecee05631ac8ddd6dca20d52ae4ca7e1227a1fd5e882be9821f3711e144b84d41099`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.14.0-beta.1/kubernetes-client-windows-386.tar.gz) | `5b1e75f532d9a4d656cd1c5ec48a19d01c4ca731c6c3d986ebbc48a9f1e1d61d6c5603145808fb929117cf2202bc75f31ec7661a50edf24c5af6b3419ebcc0ab`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.14.0-beta.1/kubernetes-client-windows-amd64.tar.gz) | `a501d3c0be55d5a73214a83d1f48b39a49d4a84f5f9988fa34cf66ef6bc78d3f3e06c40dc3d59538c3bff07aa2128ee814d9825c31f8b9abbf045e1ebb581bed`

### Server Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.14.0-beta.1/kubernetes-server-linux-amd64.tar.gz) | `aed44ec5bc6bdaf41c20824a9841ee541bfd23362966f9326eca2cafbd03eca69325877784b8c9b058963dc5b8ba656b9da446513fd5eeed8133a783769acd16`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.14.0-beta.1/kubernetes-server-linux-arm.tar.gz) | `e751cb675013183a70a8817dca0b5c456a1ccf075244b411317e813b5164ae710460a53e81191ded9d2ccaf284ae00304bfbe1b3d219b2a8d57761d733293409`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.14.0-beta.1/kubernetes-server-linux-arm64.tar.gz) | `3aabb1a9bd07413d0740adfb638b0e5ca4cd4a58eda244c5ebc1ea01780e0b2863806c35792a0590069ef0cccc2665198afed1984d1c49f0726b75d4216609a4`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.14.0-beta.1/kubernetes-server-linux-ppc64le.tar.gz) | `3c57e2b47b3b9ddc1039684840886877947141b1e4d31f909793678544fe92e10aa82a207936f0bcb3c657044c7b875f34f41f086ccb7f97a154499d01266f73`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.14.0-beta.1/kubernetes-server-linux-s390x.tar.gz) | `fe418cfafc63cbccc1898086296e52026df27ff498753089792175ce0d41d889ca50a4eb5104a84b78a0a25d524dcdf5ec5eec8aa213d58178ae38411cfb58af`

### Node Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.14.0-beta.1/kubernetes-node-linux-amd64.tar.gz) | `83b63d7e9d18fe35564105fd70629af9ba8f20112933b3ace92a48887702862e013ac3b3e144cfd44c8ead7c766df584766749af9d33a9aaa3808e370d3ea359`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.14.0-beta.1/kubernetes-node-linux-arm.tar.gz) | `e4ac000be25ced9b308ec698da9702bd10a0a7183bfea9648500ab9d0879989c54328cb4fb51be545831d18676067d6b53e55cc49b14f55f35032a66dfa28806`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.14.0-beta.1/kubernetes-node-linux-arm64.tar.gz) | `35fa5ec8a7fc001fe33abd89f8a446ce0ea2a011db27dc8ff544c2b199b065b19372afe95e3616f538347243d7599f29fb5cea1a46a3fcfdfe4a0f2a346683b2`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.14.0-beta.1/kubernetes-node-linux-ppc64le.tar.gz) | `a5b938e9cdc39fc292269af4c3961a17b9bcdaf85b3c58db680f2d1a4fb088eb648efc268dfe3325aed96f6a7cdcff070dc7a3200cc169010ff2b402fae1a26a`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.14.0-beta.1/kubernetes-node-linux-s390x.tar.gz) | `d8e2b5a945f881ddb0a25576a614d564ccef0ad4e93c84b30cdc57888e81e04932d798415a1a50cdfc6d2f857e1d027e2034ba9c40b5d8ed0009cfbdc8915e0f`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.14.0-beta.1/kubernetes-node-windows-amd64.tar.gz) | `426774466800ca11cae16821c7d92917b2ce138fcb3f6dca813ec0f060649d6a50187982aaac31fbb081604f5bd2c317616b6f211beb139f53192269194f012e`

## Changelog since v1.14.0-alpha.3

### Action Required

* Added cadvisor metric labels `pod` and `container` where `pod_name` and `container_name` are present to match instrumentation guidelines. ([#69099](https://github.com/kubernetes/kubernetes/pull/69099), [@ehashman](https://github.com/ehashman))
    * Action required: any Prometheus queries that match `pod_name` and `container_name` labels (e.g. cadvisor or kubelet probe metrics) should be updated to use `pod` and `container` instead. `pod_name` and `container_name` labels will be present alongside `pod` and `container` labels for one transitional release and removed in the future.

### Other notable changes

* fix parse devicePath issue on Azure Disk ([#74499](https://github.com/kubernetes/kubernetes/pull/74499), [@andyzhangx](https://github.com/andyzhangx))
* fix issue: fail to detach azure disk when there is server side error ([#74398](https://github.com/kubernetes/kubernetes/pull/74398), [@andyzhangx](https://github.com/andyzhangx))
* Allow Cinder volume limit to be configured from node too ([#74542](https://github.com/kubernetes/kubernetes/pull/74542), [@gnufied](https://github.com/gnufied))
* Fix subnet annotation checking for Azure internal loadbalancer ([#74498](https://github.com/kubernetes/kubernetes/pull/74498), [@feiskyer](https://github.com/feiskyer))
* Allow the kubelet to pass Windows GMSA credentials down to Docker ([#73726](https://github.com/kubernetes/kubernetes/pull/73726), [@wk8](https://github.com/wk8))
* PriorityClass in scheduling.k8s.io/v1beta1 and scheduling.k8s.io/v1alpha1 are deprecated by PriorityClass scheduling.k8s.io/v1 and will not be served starting in v1.17. ([#74465](https://github.com/kubernetes/kubernetes/pull/74465), [@bsalamat](https://github.com/bsalamat))
* kubeadm: fixed nil pointer dereference caused by a bug in url parsing ([#74454](https://github.com/kubernetes/kubernetes/pull/74454), [@bart0sh](https://github.com/bart0sh))
* Fix the unexpected NotReady status when Node's iops is full if the runtime is dockershim. ([#74389](https://github.com/kubernetes/kubernetes/pull/74389), [@answer1991](https://github.com/answer1991))
* Split up the mondo `kubernetes-test` tarball into `kubernetes-test-portable` and `kubernetes-test-{OS}-{ARCH}` tarballs. ([#74065](https://github.com/kubernetes/kubernetes/pull/74065), [@ixdy](https://github.com/ixdy))
* Move fluentd-elasticsearch addon images to community controlled location ([#73819](https://github.com/kubernetes/kubernetes/pull/73819), [@coffeepac](https://github.com/coffeepac))
* The PriorityClass API has been promoted to `scheduling.k8s.io/v1` with no changes. The `scheduling.k8s.io/v1beta1` version is now deprecated and will stop being served by default in v1.17. ([#73555](https://github.com/kubernetes/kubernetes/pull/73555), [@bsalamat](https://github.com/bsalamat))
* fix get azure accounts timeout issue when there is no out-bound IP ([#74191](https://github.com/kubernetes/kubernetes/pull/74191), [@andyzhangx](https://github.com/andyzhangx))
* fix mixed protocol issue for azure load balancer ([#74200](https://github.com/kubernetes/kubernetes/pull/74200), [@andyzhangx](https://github.com/andyzhangx))
* Don't update the Pod object after each scheduling attempt by adding a timestamp to the scheduling queue. ([#73700](https://github.com/kubernetes/kubernetes/pull/73700), [@denkensk](https://github.com/denkensk))
* kubeadm: remove local etcd members from the etcd cluster when kubeadm reset ([#74112](https://github.com/kubernetes/kubernetes/pull/74112), [@pytimer](https://github.com/pytimer))
* Fix keymutex issues which may crash in some platforms. ([#74348](https://github.com/kubernetes/kubernetes/pull/74348), [@danielqsj](https://github.com/danielqsj))
* Fixed scanning of failed iSCSI targets. ([#74306](https://github.com/kubernetes/kubernetes/pull/74306), [@jsafrane](https://github.com/jsafrane))
* kubeadm: Do not fail preflight checks when running on >= 5.0 Linux kernel ([#74355](https://github.com/kubernetes/kubernetes/pull/74355), [@brb](https://github.com/brb))
* Reduces the cache TTL for negative responses to 5s minimum. ([#74093](https://github.com/kubernetes/kubernetes/pull/74093), [@blakebarnett](https://github.com/blakebarnett))
* The Ingress API is now available via `networking.k8s.io/v1beta1`. `extensions/v1beta1` Ingress objects are deprecated and will no longer be served in v1.18. ([#74057](https://github.com/kubernetes/kubernetes/pull/74057), [@liggitt](https://github.com/liggitt))
* kubelet's --containerized flag will no longer be supported and will be removed in a future release ([#74267](https://github.com/kubernetes/kubernetes/pull/74267), [@dims](https://github.com/dims))
* Optimize scheduler cache snapshot algorithm to improve scheduling throughput. ([#74041](https://github.com/kubernetes/kubernetes/pull/74041), [@bsalamat](https://github.com/bsalamat))
* Extends the VolumeSubpathEnvExpansion alpha feature to support environment variable expansion ([#71351](https://github.com/kubernetes/kubernetes/pull/71351), [@kevtaylor](https://github.com/kevtaylor))
    * Implements subPathExpr field for expanding environment variables into a subPath
    * The fields subPathExpr and subPath are mutually exclusive
    * Note: This is a breaking change from the previous version of this alpha feature
* Added kube-proxy support for overlay networking and DSR in Windows and new flags for network-name, source-vip, and enable-dsr. ([#70896](https://github.com/kubernetes/kubernetes/pull/70896), [@ksubrmnn](https://github.com/ksubrmnn))
* StorageOS volume plugin updated to fix an issue where volume mount succeeds even if request to mount via StorageOS API fails. ([#69782](https://github.com/kubernetes/kubernetes/pull/69782), [@darkowlzz](https://github.com/darkowlzz))
* kubeadm: Allow to upload certificates required to join a new control-plane to kubeadm-certs secret using the flag `--experimental-upload-certs` on `init` or upload-certs phase. ([#73907](https://github.com/kubernetes/kubernetes/pull/73907), [@yagonobre](https://github.com/yagonobre))
* export query parameter is deprecated and will be removed in a future release ([#73783](https://github.com/kubernetes/kubernetes/pull/73783), [@deads2k](https://github.com/deads2k))
* e2e storage tests run faster and are easier to read ([#72434](https://github.com/kubernetes/kubernetes/pull/72434), [@pohly](https://github.com/pohly))
* kubectl: fix a bug where "describe" cannot obtain the event messages for a static pod ([#74156](https://github.com/kubernetes/kubernetes/pull/74156), [@gaorong](https://github.com/gaorong))
* windows: Ensure graceful termination when being run as windows service ([#73292](https://github.com/kubernetes/kubernetes/pull/73292), [@steffengy](https://github.com/steffengy))
* CoreDNS adds readinessProbe which prevents loadbalancing to unready pods, and also allows rolling updates to work as expected. ([#74137](https://github.com/kubernetes/kubernetes/pull/74137), [@rajansandeep](https://github.com/rajansandeep))
* Fixes use of webhook admission plugins with multi-version custom resources ([#74154](https://github.com/kubernetes/kubernetes/pull/74154), [@mbohlool](https://github.com/mbohlool))
* kubeadm no longer allows using v1alpha3 configs for anything else than converting them to v1beta1. ([#74025](https://github.com/kubernetes/kubernetes/pull/74025), [@rosti](https://github.com/rosti))
* Change kubelet metrics to conform metrics guidelines. ([#72470](https://github.com/kubernetes/kubernetes/pull/72470), [@danielqsj](https://github.com/danielqsj))
    * The following metrics are deprecated, and will be removed in a future release:
        * `kubelet_pod_worker_latency_microseconds`
        * `kubelet_pod_start_latency_microseconds`
        * `kubelet_cgroup_manager_latency_microseconds`
        * `kubelet_pod_worker_start_latency_microseconds`
        * `kubelet_pleg_relist_latency_microseconds`
        * `kubelet_pleg_relist_interval_microseconds`
        * `kubelet_eviction_stats_age_microseconds`
        * `kubelet_runtime_operations`
        * `kubelet_runtime_operations_latency_microseconds`
        * `kubelet_runtime_operations_errors`
        * `kubelet_device_plugin_registration_count`
        * `kubelet_device_plugin_alloc_latency_microseconds`
    * Please convert to the following metrics:
        * `kubelet_pod_worker_duration_seconds`
        * `kubelet_pod_start_duration_seconds`
        * `kubelet_cgroup_manager_duration_seconds`
        * `kubelet_pod_worker_start_duration_seconds`
        * `kubelet_pleg_relist_duration_seconds`
        * `kubelet_pleg_relist_interval_seconds`
        * `kubelet_eviction_stats_age_seconds`
        * `kubelet_runtime_operations_total`
        * `kubelet_runtime_operations_duration_seconds`
        * `kubelet_runtime_operations_errors_total`
        * `kubelet_device_plugin_registration_total`
        * `kubelet_device_plugin_alloc_duration_seconds`
* This change ensures that volumes get provisioned based on the zone information provided in allowedTopologies. ([#72731](https://github.com/kubernetes/kubernetes/pull/72731), [@skarthiksrinivas](https://github.com/skarthiksrinivas))
    * Storage class spec:
    * kind: StorageClass
    * apiVersion: storage.k8s.io/v1
    * metadata:
    *   name: fastpolicy1
    * provisioner: kubernetes.io/vsphere-volume
    * parameters:
    *     diskformat: zeroedthick
    *     storagePolicyName: vSAN Default Storage Policy
    * allowedTopologies:
    * - matchLabelExpressions:
    *   - key: failure-domain.beta.kubernetes.io/zone
    *     values:
    *     - zone1
    * PV creation Logs:
    * I0109 11:17:52.321372       1 vsphere.go:1147] Starting to create a vSphere volume with volumeOptions: &{CapacityKB:1048576 Tags:map[kubernetes.io/created-for/pvc/namespace:default kubernetes.io/created-for/pvc/name:pvcsc-1-policy kubernetes.io/created-for/pv/name:pvc-34650c12-1400-11e9-aef4-005056804cc9] Name:kubernetes-dynamic-pvc-34650c12-1400-11e9-aef4-005056804cc9 DiskFormat:zeroedthick Datastore: VSANStorageProfileData: StoragePolicyName:vSAN Default Storage Policy StoragePolicyID: SCSIControllerType: Zone:[zone1]}
    * ...
    * I0109 11:17:59.430113       1 vsphere.go:1334] The canonical volume path for the newly created vSphere volume is "[vsanDatastore] 98db185c-6683-d8c7-bc55-0200435ec5da/kubernetes-dynamic-pvc-34650c12-1400-11e9-aef4-005056804cc9.vmdk"
    * Ran regression tests (no zone) and they passed.
* vSphere cloud provider correctly retrieves the VM's UUID when running on Windows ([#71147](https://github.com/kubernetes/kubernetes/pull/71147), [@benmoss](https://github.com/benmoss))
* Re-issue Allocate grpc calls before starting a container that requests device-plugin resources if the cached state is missing. ([#73824](https://github.com/kubernetes/kubernetes/pull/73824), [@jiayingz](https://github.com/jiayingz))
* [CRI] Add a new field called `runtime_handler` into PodSandbox and PodSandboxStatus to track the RuntimeClass information of a pod. ([#73833](https://github.com/kubernetes/kubernetes/pull/73833), [@haiyanmeng](https://github.com/haiyanmeng))
* kubelet: OS and Arch information is now recorded in `kubernetes.io/os` and `kubernetes.io/arch` labels on Node objects. The previous labels (`beta.kubernetes.io/os` and `beta.kubernetes.io/arch`) are still recorded, but are deprecated and targeted for removal in 1.18. ([#73333](https://github.com/kubernetes/kubernetes/pull/73333), [@yujuhong](https://github.com/yujuhong))
* This change applies zone labels to vSphere Volumes automatically. The zone labels are visible on the PV: ([#72687](https://github.com/kubernetes/kubernetes/pull/72687), [@subramanian-neelakantan](https://github.com/subramanian-neelakantan))
    * $ kubectl get pv --show-labels
    * NAME           CAPACITY   ACCESSMODES   STATUS    CLAIM            REASON    AGE       LABELS
    * pv-abc                5Gi        RWO                   Bound     default/claim1                    46s       failure-domain.beta.kubernetes.io/region=VC1,failure-domain.beta.kubernetes.io/zone=cluster-1
* fix smb remount issue on Windows ([#73661](https://github.com/kubernetes/kubernetes/pull/73661), [@andyzhangx](https://github.com/andyzhangx))
* Kubelet now tries to stop containers in unknown state once before restart or remove. ([#73802](https://github.com/kubernetes/kubernetes/pull/73802), [@Random-Liu](https://github.com/Random-Liu))
* Deprecate --export flag from kubectl get command. ([#73787](https://github.com/kubernetes/kubernetes/pull/73787), [@soltysh](https://github.com/soltysh))
* Breaking changes in client-go: ([#72214](https://github.com/kubernetes/kubernetes/pull/72214), [@caesarxuchao](https://github.com/caesarxuchao))
    * The disk-cached discovery client is moved from k8s.io/client-go/discovery to k8s.io/client-go/discovery/cached/disk.
    * The memory-cached discovery client is moved from k8s.io/client-go/discovery/cached to k8s.io/client-go/discovery/cached/memory.
* kubelet now accepts `pid=<number>` in the `--system-reserved` and `--kube-reserved` options to ensure that the specified number of process IDs will be reserved for the system as a whole and for Kubernetes system daemons respectively.  Please reference `Kube Reserved` and `System Reserved` in `Reserve Compute Resources for System Daemons` in the Kubernetes documentation for general discussion of resource reservation.  To utilize this functionality, you must set the feature gate `SupportNodePidsLimit=true` ([#73651](https://github.com/kubernetes/kubernetes/pull/73651), [@RobertKrawitz](https://github.com/RobertKrawitz))
* The apiserver, including both the kube-apiserver and apiservers built with the generic apiserver library, will now return 413 RequestEntityTooLarge error if a json patch contains more than 10,000 operations. ([#74000](https://github.com/kubernetes/kubernetes/pull/74000), [@caesarxuchao](https://github.com/caesarxuchao))
* kubeadm: allow the usage of --kubeconfig-dir and --config flags on kubeadm init ([#73998](https://github.com/kubernetes/kubernetes/pull/73998), [@yagonobre](https://github.com/yagonobre))
* when pleg channel is full, discard events and record its count ([#72709](https://github.com/kubernetes/kubernetes/pull/72709), [@changyaowei](https://github.com/changyaowei))
* Is ->It in line 6 ([#73898](https://github.com/kubernetes/kubernetes/pull/73898), [@xiezongzhe](https://github.com/xiezongzhe))
* Events reported for container creation, start, and stop now report the container name in the message and are more consistently formatted. ([#73892](https://github.com/kubernetes/kubernetes/pull/73892), [@smarterclayton](https://github.com/smarterclayton))
* `kubectl auth reconcile` now outputs details about what changes are being made ([#71564](https://github.com/kubernetes/kubernetes/pull/71564), [@liggitt](https://github.com/liggitt))
* kubeadm: fix a bug in the underlying library for diff related to characters like '%' ([#73941](https://github.com/kubernetes/kubernetes/pull/73941), [@neolit123](https://github.com/neolit123))
* kube-apiserver: a request body of a CREATE/UPDATE/PATCH/DELETE resource operation larger than 100 MB will return a 413 "request entity too large" error. ([#73805](https://github.com/kubernetes/kubernetes/pull/73805), [@caesarxuchao](https://github.com/caesarxuchao))
    * Custom apiservers built with the latest apiserver library will have the 100MB limit on the body of resource requests as well. The limit can be altered via ServerRunOptions.MaxRequestBodyBytes.
    * The body size limit does not apply to subresources like pods/proxy that proxy request content to another server.
* Kustomize is developed in its own repo https://github.com/kubernetes-sigs/kustomize ([#73033](https://github.com/kubernetes/kubernetes/pull/73033), [@Liujingfang1](https://github.com/Liujingfang1))
    * This PR added a new subcommand `kustomize` in kubectl. 
    *   kubectl kustomize <somedir> has the same effect as kustomize build <somedir>
    * To build API resources from somedir with a kustomization.yaml file
    *    kubectl kustomize <somedir>
    * This command can be piped to apply or delete 
    *    kubectl kustomize <somedir> | kubectl apply -f -
    *    kubectl kustomize <somedir> | kubectl delete -f -
* kubeadm: all master components are now exclusively relying on the `PriorityClassName` pod spec for annotating them as cluster critical components. Since `scheduler.alpha.kubernetes.io/critical-pod` annotation is no longer supported by Kubernetes 1.14 this annotation is no longer added to master components. ([#73857](https://github.com/kubernetes/kubernetes/pull/73857), [@ereslibre](https://github.com/ereslibre))
* Speedup kubectl by >10 when calling out to kube-apiserver for discovery information. ([#73345](https://github.com/kubernetes/kubernetes/pull/73345), [@sttts](https://github.com/sttts))
* kubeadm no longer dumps backtrace if it fails to remove the running containers on reset. ([#73951](https://github.com/kubernetes/kubernetes/pull/73951), [@rosti](https://github.com/rosti))



# v1.14.0-alpha.3

[Documentation](https://docs.k8s.io)

## Downloads for v1.14.0-alpha.3


filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.14.0-alpha.3/kubernetes.tar.gz) | `5060dcf689dad4e19da5029eb8fc3060a4b2bad988fddff438d0703a45c02481bcfbc15f45d2855f4fd5e9eb43847400ebb25dce19e24f0e0e194a7f57176ce5`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.14.0-alpha.3/kubernetes-src.tar.gz) | `754c948b5d25b01f211866d473257be5fb576b4b97703eb6fc08679d6525e1f53195a450f3f47b77fabb92bf058583b66230959197b5bcf72528e54ccb349c07`

### Client Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.14.0-alpha.3/kubernetes-client-darwin-386.tar.gz) | `5bd74dfc86bacf89d6b05d541e13bf390216039a42cc90fef2b248820acd84f56a445ec66d52497ff77e1af47455f285c993cd1d44cc3050996189bd328ea2be`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.3/kubernetes-client-darwin-amd64.tar.gz) | `34e16661d66d337083583dfb478756ec8cc664d7cfc2dd1817bf1da03cdc380668be9df9f178b5fd5ccab5014e6686f83b9fee6192fbf77d2298d397e872a893`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.14.0-alpha.3/kubernetes-client-linux-386.tar.gz) | `15f99e85bcc95f7b8e1b4c6ecc23de36e89a54108003db926e97ec2e7253f363f6ed85e39a47305dbccf596f72e88edd7bcda6d528919da9c0b81541f58506d4`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.3/kubernetes-client-linux-amd64.tar.gz) | `2e61cf9b776150c4f1830d068ffee9701cb04979152ed6b62fc1bf53163e6194029a4f75536e7fda71c3dfce1de285f425bde342a4efdd1f7bf973f105750ac4`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.14.0-alpha.3/kubernetes-client-linux-arm.tar.gz) | `67fb3805bb1b4a77f6603fbde9bd1d26e179de1a594c85618aa7b17be6abc510a9a0cd499ef4fe974574cf73b364da641121f21864c8472d713eec76e4c52bca`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.3/kubernetes-client-linux-arm64.tar.gz) | `28930dc384b51051081a52874bc4d6dafa3c992dfa214b977ef711de2c2bc3f90bdaa6243bded1e750997fec04b8ffb910db21c266e47e09426c4dbaf916a64d`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.14.0-alpha.3/kubernetes-client-linux-ppc64le.tar.gz) | `f59eda797a57961d52fe67ba8b25a3a10267f9ce46029ed2140ef4b02615ba9944bd83d7a6e7874c7268a09a3422858b9b0c31f861941ef8be126c594fc3a7cc`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.14.0-alpha.3/kubernetes-client-linux-s390x.tar.gz) | `c56bfb64e55cf95251157a8229a3e94310b2c46bb1c1250050893873e3112578978c1f8e29fa56fac63e2aa8a6382523ac34baf6dd523fe0919f8d702521a564`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.14.0-alpha.3/kubernetes-client-windows-386.tar.gz) | `e49a00fbe600892dc5eed0bc21bac64806da65280c818ca79b5e8adbed7fd5ecebb6b647cb9b89ac862257995145b2397996122eefb3c8d127d857c89c29c9ae`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.3/kubernetes-client-windows-amd64.tar.gz) | `797e20969ed4935adcbc80ccbcd72ec5aa697e70b0d071eceefc6dbacea69aff9f6660e7eefad6661ace0afb66067c4ffaa4f6bc82e8b081b57811ab0abde218`

### Server Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.3/kubernetes-server-linux-amd64.tar.gz) | `eddfc9afd7337475c3865443170d1425dcf4a87d981555871a69bcf132e73d99b1ffa08a00490b30c60232f47bbeca4ad6253cf7e1dad44797b4af044dbdbef4`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.14.0-alpha.3/kubernetes-server-linux-arm.tar.gz) | `dc85cd3a039cc0516beb19018c8378f3b7b88fa2edb8fa1476305e89eb7c64fef2d938bd48fd257ea8e690f7d84a69e9784a42aabed35e83ea7362c60773ba67`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.3/kubernetes-server-linux-arm64.tar.gz) | `d7c3a72abaa4c3e3243f8b4b3a8adb8be2758e0f883423ea62d2c61b2081464a8976ad43ea0640a7e453aa4d389e3ea2d6d1baedf3b50e1171eca6e49cd087fe`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.14.0-alpha.3/kubernetes-server-linux-ppc64le.tar.gz) | `b268a94eb056eea8bdf4d5739dec430f75a6a6b3c18e30df68d970c3566b3e4a638b3577f6219596ae54eac740628a7ebfecb0772645e6d960f790235e1d62c7`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.14.0-alpha.3/kubernetes-server-linux-s390x.tar.gz) | `f4cfd8d2faacdd1f0065f9e0f4f8d0db7bd8f438f812f70a07f4cb5272ae9bed3ec876b3cbaf2f2a71e65e4de725e1dc0829b43f60f43c9e43656ac928657d5e`

### Node Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.3/kubernetes-node-linux-amd64.tar.gz) | `7040ee3c032ec4fe14530c3e47ee53d731acb947b06e2d560cbcd0e7e513142c0f300302059aaef03e24311946a9c59b576948eec9b520e2367f28fc4f80226c`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.14.0-alpha.3/kubernetes-node-linux-arm.tar.gz) | `3d32e5243d1c65bce573cfb0f60d643ef3fc684a15551dbc8c3d5435e6854ff104c46c77b0b8708d9c661d52f7865a197ea758f0c17e1ed991993674929ea75e`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.3/kubernetes-node-linux-arm64.tar.gz) | `d3a17027fa1c057528422b35e32260f5b7c7246400df595f0ebda5d150456d4388129b1ead4229f98f2b461ff9e85382a7da0d682541844a3c06f0aebe0469b6`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.14.0-alpha.3/kubernetes-node-linux-ppc64le.tar.gz) | `89ed1f5093b49ab9d58d7a70089e881bf388f3316cb2607fa18e3bf072aff3d27aabe99124334774e63decb67349eb82f33ea509b56a72a51e1443c3352b4558`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.14.0-alpha.3/kubernetes-node-linux-s390x.tar.gz) | `755a60824a9b8c4090a791d332e410692708ecece90e37388f58eb2c7ddddea6b859fefcc5a53ec3d275fee0a355086f4446ae8e85482a668d248cca9f5e503c`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.3/kubernetes-node-windows-amd64.tar.gz) | `c71d8055d89e535771f345e0f673da021915a7a82c75951855ba2574a4250c8a57d0636b4ec9bba209edde8edef30098c6dec2f80403cd46139bb88d814c3751`

## Changelog since v1.14.0-alpha.2

### Action Required

* The --storage-versions flag of kube-apiserver is removed. The storage versions will always be the default value built-in the kube-apiserver binary. ([#67678](https://github.com/kubernetes/kubernetes/pull/67678), [@caesarxuchao](https://github.com/caesarxuchao))

### Other notable changes

* fix [#73264](https://github.com/kubernetes/kubernetes/pull/73264) cpuPeriod was not reset, but used as set via flag, although it was disabled via alpha gate ([#73342](https://github.com/kubernetes/kubernetes/pull/73342), [@szuecs](https://github.com/szuecs))
* Update kubelet CLI summary documentation and generated Webpage ([#73256](https://github.com/kubernetes/kubernetes/pull/73256), [@deitch](https://github.com/deitch))
* Considerably reduced the CPU load in kube-apiserver while aggregating OpenAPI specifications from aggregated API servers. ([#71223](https://github.com/kubernetes/kubernetes/pull/71223), [@sttts](https://github.com/sttts))
* kubeadm: add a preflight check that throws a warning if the cgroup driver for Docker on Linux is not "systemd" as per the k8s.io CRI installation guide. ([#73837](https://github.com/kubernetes/kubernetes/pull/73837), [@neolit123](https://github.com/neolit123))
* Kubelet: add usageNanoCores from CRI stats provider ([#73659](https://github.com/kubernetes/kubernetes/pull/73659), [@feiskyer](https://github.com/feiskyer))
* Fix watch to not send the same set of events multiple times causing watcher to go back in time ([#73845](https://github.com/kubernetes/kubernetes/pull/73845), [@wojtek-t](https://github.com/wojtek-t))
* `system:kube-controller-manager` and `system:kube-scheduler` users are now permitted to perform delegated authentication/authorization checks by default RBAC policy ([#72491](https://github.com/kubernetes/kubernetes/pull/72491), [@liggitt](https://github.com/liggitt))
* Prevent AWS Network Load Balancer security groups ingress rules to be deleted by ensuring target groups are tagged. ([#73594](https://github.com/kubernetes/kubernetes/pull/73594), [@masterzen](https://github.com/masterzen))
* Set a low oom_score_adj for containers in pods with system-critical priorities ([#73758](https://github.com/kubernetes/kubernetes/pull/73758), [@sjenning](https://github.com/sjenning))
* Ensure directories on volumes are group-executable when using fsGroup ([#73533](https://github.com/kubernetes/kubernetes/pull/73533), [@mxey](https://github.com/mxey))
* kube-apiserver now only aggregates openapi schemas from `/openapi/v2` endpoints of aggregated API servers. The fallback to aggregate from `/swagger.json` has been removed. Ensure aggregated API servers provide schema information via `/openapi/v2` (available since v1.10). ([#73441](https://github.com/kubernetes/kubernetes/pull/73441), [@roycaihw](https://github.com/roycaihw))
* Change docker metrics to conform metrics guidelines and using histogram for better aggregation. ([#72323](https://github.com/kubernetes/kubernetes/pull/72323), [@danielqsj](https://github.com/danielqsj))
    * The following metrics are deprecated, and will be removed in a future release:
        * `docker_operations`
        * `docker_operations_latency_microseconds`
        * `docker_operations_errors`
        * `docker_operations_timeout`
        * `network_plugin_operations_latency_microseconds`
    * Please convert to the following metrics:
        * `docker_operations_total`
        * `docker_operations_latency_seconds`
        * `docker_operations_errors_total`
        * `docker_operations_timeout_total`
        * `network_plugin_operations_latency_seconds`
* `kubectl delete --all-namespaces` is a recognized flag. ([#73716](https://github.com/kubernetes/kubernetes/pull/73716), [@deads2k](https://github.com/deads2k))
* MAC Address filter has been fixed in vSphere Cloud Provider, it no longer ignores `00:1c:14` and `00:05:69` prefixes ([#73721](https://github.com/kubernetes/kubernetes/pull/73721), [@frapposelli](https://github.com/frapposelli))
* Add kubelet_node_name metrics. ([#72910](https://github.com/kubernetes/kubernetes/pull/72910), [@danielqsj](https://github.com/danielqsj))
* The HugePages feature gate has graduated to GA, and can no longer be disabled. The feature gate will be removed in v1.16 ([#72785](https://github.com/kubernetes/kubernetes/pull/72785), [@derekwaynecarr](https://github.com/derekwaynecarr))
* Fix a bug that aggregated openapi spec may override swagger securityDefinitions and swagger info in kube-apiserver ([#73484](https://github.com/kubernetes/kubernetes/pull/73484), [@roycaihw](https://github.com/roycaihw))
* Fixes a bug that prevented deletion of dynamically provisioned volumes in Quobyte backends. ([#68925](https://github.com/kubernetes/kubernetes/pull/68925), [@casusbelli](https://github.com/casusbelli))
* error messages returned in authentication webhook status responses are now correctly included in the apiserver log ([#73595](https://github.com/kubernetes/kubernetes/pull/73595), [@liggitt](https://github.com/liggitt))
* kubeadm: `kubeadm alpha preflight` and `kubeadm alpha preflight node` are removed; you can now use `kubeadm join phase preflight` ([#73718](https://github.com/kubernetes/kubernetes/pull/73718), [@fabriziopandini](https://github.com/fabriziopandini))
* kube-apiserver: the deprecated `repair-malformed-updates` has been removed ([#73663](https://github.com/kubernetes/kubernetes/pull/73663), [@danielqsj](https://github.com/danielqsj))
* e2e.test now rejects unknown --provider values instead of merely warning about them. An empty provider name is not accepted anymore and was replaced by "skeleton" (= a provider with no special behavior). ([#73402](https://github.com/kubernetes/kubernetes/pull/73402), [@pohly](https://github.com/pohly))
* Updated AWS SDK to v1.16.26 for ECR PrivateLink support ([#73435](https://github.com/kubernetes/kubernetes/pull/73435), [@micahhausler](https://github.com/micahhausler))
* Expand kubectl wait to work with more types of selectors. ([#71746](https://github.com/kubernetes/kubernetes/pull/71746), [@rctl](https://github.com/rctl))
* The CustomPodDNS feature gate has graduated to GA, and can no longer be disabled. The feature gate will be removed in v1.16 ([#72832](https://github.com/kubernetes/kubernetes/pull/72832), [@MrHohn](https://github.com/MrHohn))
* The `rules` field in RBAC Role and ClusterRole objects is now correctly reported as optional in the openapi schema. ([#73250](https://github.com/kubernetes/kubernetes/pull/73250), [@liggitt](https://github.com/liggitt))
* AWS ELB health checks will now use HTTPS/SSL protocol for HTTPS/SSL backends. ([#70309](https://github.com/kubernetes/kubernetes/pull/70309), [@2rs2ts](https://github.com/2rs2ts))
* kubeadm reset: fixed crash caused by absence of a configuration file ([#73636](https://github.com/kubernetes/kubernetes/pull/73636), [@bart0sh](https://github.com/bart0sh))
* CoreDNS is now version 1.3.1 ([#73610](https://github.com/kubernetes/kubernetes/pull/73610), [@rajansandeep](https://github.com/rajansandeep))
    *    - A new `k8s_external` plugin that allows external zones to point to Kubernetes in-cluster services.
    *    - CoreDNS now checks if a zone transfer is allowed. Also allow a TTL of 0 to avoid caching in the cache plugin.
    *    - TTL is also applied to negative responses (NXDOMAIN, etc).

* Missing directories listed in a user's PATH are no longer considered errors and are instead logged by the "kubectl plugin list" command when listing available plugins. ([#73542](https://github.com/kubernetes/kubernetes/pull/73542), [@juanvallejo](https://github.com/juanvallejo))
* remove kubelet flag '--experimental-fail-swap-on' (deprecated in v1.8) ([#69552](https://github.com/kubernetes/kubernetes/pull/69552), [@Pingan2017](https://github.com/Pingan2017))
* Introduced support for Windows nodes into the cluster bringup scripts for GCE. ([#73442](https://github.com/kubernetes/kubernetes/pull/73442), [@pjh](https://github.com/pjh))
* Now users could get object info like: ([#73063](https://github.com/kubernetes/kubernetes/pull/73063), [@WanLinghao](https://github.com/WanLinghao))
    * a. kubectl get pod test-pod -o custom-columns=CONTAINER:.spec.containers[0:3].name
    * b. kubectl get pod test-pod -o custom-columns=CONTAINER:.spec.containers[-2:].name
* scheduler: use incremental scheduling cycle in PriorityQueue to put all in-flight unschedulable pods back to active queue if we received move request ([#73309](https://github.com/kubernetes/kubernetes/pull/73309), [@cofyc](https://github.com/cofyc))
* fixes an error processing watch events when running skewed apiservers ([#73482](https://github.com/kubernetes/kubernetes/pull/73482), [@liggitt](https://github.com/liggitt))
* Prometheus metrics for crd_autoregister, crd_finalizer and crd_naming_condition_controller are exported. ([#71767](https://github.com/kubernetes/kubernetes/pull/71767), [@roycaihw](https://github.com/roycaihw))
* Adds deleting pods created by DaemonSet assigned to not existing nodes. ([#73401](https://github.com/kubernetes/kubernetes/pull/73401), [@krzysztof-jastrzebski](https://github.com/krzysztof-jastrzebski))
* Graduate Pod Priority and Preemption to GA. ([#73498](https://github.com/kubernetes/kubernetes/pull/73498), [@bsalamat](https://github.com/bsalamat))
* Adds configuration for AWS endpoint fine control: ([#72245](https://github.com/kubernetes/kubernetes/pull/72245), [@ampsingram](https://github.com/ampsingram))
    * OverrideEndpoints bool Set to true to allow custom endpoints
    * ServiceDelimiter string Delimiter to use to separate overridden services (multiple services) Defaults to "&"
    * ServicenameDelimiter string Delimiter to use to separate servicename from its configuration parameters Defaults "|"
    * OverrideSeparator string Delimiter to use to separate region of occurrence, url and signing region for each override Defaults to ","
    * ServiceOverrides string example: s3|region1, https://s3.foo.bar, some signing_region & ec2|region2, https://ec2.foo.bar, signing_region
* The CoreDNS configuration now has the forward plugin for proxy in the default configuration instead of the proxy plugin.  ([#73267](https://github.com/kubernetes/kubernetes/pull/73267), [@rajansandeep](https://github.com/rajansandeep))
* Fixed a bug that caused PV allocation on non-English vSphere installations to fail  ([#73115](https://github.com/kubernetes/kubernetes/pull/73115), [@alvaroaleman](https://github.com/alvaroaleman))



# v1.14.0-alpha.2

[Documentation](https://docs.k8s.io)

## Downloads for v1.14.0-alpha.2


filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.14.0-alpha.2/kubernetes.tar.gz) | `1330e4421b61f6b1e6e4dee276d4742754bd3dd4493508d67ebb4445065277c619c4da8b4835febf0b2cdcf9e75fce96de1c1d99998904bae2bb794a453693f2`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.14.0-alpha.2/kubernetes-src.tar.gz) | `352c043bebf13a616441c920f3eec80d3f02f111d8488c31aa903e1483bce6d1fbe7472208f64730142960c8f778ab921ef7b654540a3ec09e53bd7e644521bd`

### Client Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.14.0-alpha.2/kubernetes-client-darwin-386.tar.gz) | `ee5aba4efce323167e6d897a2ff6962a240e466333bcae9390be2c8521c6da50ac2cb6139510b693aad49d6393b97a2118ed1fe4f999dd08bdca6d875d25f804`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.2/kubernetes-client-darwin-amd64.tar.gz) | `4b5c0b340322956a8d096c595124a765ac318d0eb460d6320218f2470e22d88221a0a9f1f93d5f3075f1c36b18c7041ee2fcb32e0f9c94d9f79bc3fd3005e68e`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.14.0-alpha.2/kubernetes-client-linux-386.tar.gz) | `7a5bfe68dd58c8478746a410872b615daf8abb9a78754140fb4d014a0c9177a87859ac046f56f5743fb97a9881abc2cf48c3e51aa02c8a86a754bf2cc59edb54`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.2/kubernetes-client-linux-amd64.tar.gz) | `c3139f58070241f2da815f701af3c0bd0ea4fdec1fe54bb859bd11237ac9b75ecb01b62ac1c7a459a4dd79696412c6d2f8cbd492fd062a790ceadd3dcc9b07fd`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.14.0-alpha.2/kubernetes-client-linux-arm.tar.gz) | `9d96d2e1e11aa61e2c3a5f4f27c18866feae9833b6ee70b15f5cdb5f992849dc1f79821af856b467487092a21a447231fb9c4de6ee6f17defed3cfa16d35b4c6`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.2/kubernetes-client-linux-arm64.tar.gz) | `7b4dd825cf9f217c18b28976a3faa94f0bd4868e541e5be7d57cd770e2b163c6daddf12e5f9ad51d92abde794a444f2a20bf582a30f03c39e60186d356030a2d`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.14.0-alpha.2/kubernetes-client-linux-ppc64le.tar.gz) | `490638e250c24b6bad8b67358fd7890f7a2f6456ae8ffe537c28bb5b3ce7abc591e6fecbddd6744f0f6c0e24b9f44c31f7ca1f7ebfc3c0d17a96fe8cf27b8548`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.14.0-alpha.2/kubernetes-client-linux-s390x.tar.gz) | `9dd8c3361eda15dd1594066c55b79cb9a34578c225b2b48647cd5b34619cf23106b845ee25b80d979f8b69e8733148842177500dc48989177b6944677f071f1c`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.14.0-alpha.2/kubernetes-client-windows-386.tar.gz) | `d624b8aead053201765b713d337528be82a71328ee3dd569f556868ceeb4904e64584892a016d247608fc4521c00ead7aed5d973b1206caa2d00406532d5b8b4`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.2/kubernetes-client-windows-amd64.tar.gz) | `a1cf8c67984dd4eb4610fa05d27fe9e9e4123159f933e3986e9db835b9cf136962168f0003071001e01e2c1831804ba0a366f2495741aa60a41587a69c09cb62`

### Server Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.2/kubernetes-server-linux-amd64.tar.gz) | `b93982b56371994c540cd11e6bc21808279340617164992c10f30d8e6ae4d5e270e41c1edc0625d3458a18944ec7aa8c273acbbcd718d60b6cacbc24220c42ac`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.14.0-alpha.2/kubernetes-server-linux-arm.tar.gz) | `bfd76c6b26e5927166d776f6110b97ee36c1d63ad39e2d18899f3e428ebb0f9615bb677ac8e9bcc1864c72a40efd71e1314fe6d137f9c6e54f720270929e3f46`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.2/kubernetes-server-linux-arm64.tar.gz) | `6721dec0df9466cd6c056160c73d598296cebb0af9259eb21b693abb8708901bc8bc30e11815e14d00d6eb12b8bb90b699e3119b922da855e2c411bdf229d6e5`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.14.0-alpha.2/kubernetes-server-linux-ppc64le.tar.gz) | `f8cd307db8141d989ae1218dd2b438bc9cee017d533b1451d2345f9689c451fdb080acd1b9b2f535ed04017e44b81a0585072e7d58a9d201a0ec28fd09df0a6f`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.14.0-alpha.2/kubernetes-server-linux-s390x.tar.gz) | `de7514bbd87a1b363e1bc7787f37d5ea10faac4afe7c5163c23c4df16781aa77570ec553bc4f4b6094166c1fcfc3c431f13e51ffa32f7ea2849e76ec0151ea35`

### Node Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.2/kubernetes-node-linux-amd64.tar.gz) | `8c37fd2fe6232d2c148e23df021b8b5347136263399932bcdff0c7a0186f3145de9ede4936b14de7484cc6db9241517d79b5306c380ed374396882900b63e912`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.14.0-alpha.2/kubernetes-node-linux-arm.tar.gz) | `389e4e77ab9e62968a25b8f4e146a2c3fbb3db2e60e051922edf6395c26cc5380e5a77bf67022339d6ebfe9abd714636d77510bbc42924b4265fdb245fae08c9`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.2/kubernetes-node-linux-arm64.tar.gz) | `7efc32dfeefcef7f860913c25431bd891a435e92cb8d5a95f8deca1a82aa899a007d4b19134493694a4bccb5564867488634a780c128f0cf82c61d98afa889f5`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.14.0-alpha.2/kubernetes-node-linux-ppc64le.tar.gz) | `da30c03bca4b81d810a7df006db02333dea87e336d6cdca9c93392e01c7e43bf4902c969efa7fa53e8a70a0e863b403ec26b87bd38226b8b9f98777ddb0051a0`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.14.0-alpha.2/kubernetes-node-linux-s390x.tar.gz) | `cce43b7f0350b9e5a77ea703225adb9714ef022d176db5b99a0327937d19021d7a8e93ef1169389fd53b895bb98725d23c7565ef80afdd17596c26daf41eeeac`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.2/kubernetes-node-windows-amd64.tar.gz) | `d3accf522d80cbfb3d03e9eaa60a09767ba11e88a8a5b44a629192a7c6916b1fb3440f022a5ffc4ea78f3595f254a42f028dd428d117360091cd0c747ec39eb5`

## Changelog since v1.14.0-alpha.1

### Action Required

* Promote ValidateProxyRedirects to Beta, and enable by default. This feature restricts redirect following from the apiserver to same-host redirects. ([#72552](https://github.com/kubernetes/kubernetes/pull/72552), [@tallclair](https://github.com/tallclair))
    * ACTION REQUIRED: If nodes are configured to respond to CRI streaming requests on a different host interface than what the apiserver makes requests on (only the case if not using the built-in dockershim & setting the kubelet flag `--redirect-container-streaming=true`), then these requests will be broken. In that case, the feature can be temporarily disabled until the node configuration is corrected. We suggest setting `--redirect-container-streaming=false` on the kubelet to avoid issues.

### Other notable changes

* Added alpha field storageVersionHash to the discovery document for each resource. Its value must be treated as opaque by clients. Only equality comparison on the value is valid. ([#73191](https://github.com/kubernetes/kubernetes/pull/73191), [@caesarxuchao](https://github.com/caesarxuchao))
* Fix admission metrics in seconds. ([#72343](https://github.com/kubernetes/kubernetes/pull/72343), [@danielqsj](https://github.com/danielqsj))
    * Add metrics `*_admission_latencies_milliseconds` and `*_admission_latencies_milliseconds_summary` for backward compatible, but will be removed in a future release.
* Pod eviction now honors graceful deletion by default if no delete options are provided in the eviction request ([#72730](https://github.com/kubernetes/kubernetes/pull/72730), [@liggitt](https://github.com/liggitt))
* Update to go1.11.5 ([#73326](https://github.com/kubernetes/kubernetes/pull/73326), [@ixdy](https://github.com/ixdy))
* Change proxy metrics to conform metrics guidelines. ([#72334](https://github.com/kubernetes/kubernetes/pull/72334), [@danielqsj](https://github.com/danielqsj))
    * The metrics `sync_proxy_rules_latency_microseconds` is deprecated, and will be removed in a future release, please convert to metrics`sync_proxy_rules_latency_seconds`.
* Add network stats for Windows nodes and pods. ([#70121](https://github.com/kubernetes/kubernetes/pull/70121), [@feiskyer](https://github.com/feiskyer))
* kubeadm: When certificates are present joining a new control plane make sure that they match at least the required SANs ([#73093](https://github.com/kubernetes/kubernetes/pull/73093), [@ereslibre](https://github.com/ereslibre))
* A new `TaintNodesByCondition` admission plugin taints newly created Node objects as "not ready", to fix a race condition that could cause pods to be scheduled on new nodes before their taints were updated to accurately reflect their reported conditions. This admission plugin is enabled by default if the `TaintNodesByCondition` feature is enabled. ([#73097](https://github.com/kubernetes/kubernetes/pull/73097), [@bsalamat](https://github.com/bsalamat))
* kube-addon-manager was updated to v9.0, and now uses kubectl v1.13.2 and prunes workload resources via the apps/v1 API ([#72978](https://github.com/kubernetes/kubernetes/pull/72978), [@liggitt](https://github.com/liggitt))
* When a watch is closed by an HTTP2 load balancer and we are told to go away, skip printing the message to stderr by default. ([#73277](https://github.com/kubernetes/kubernetes/pull/73277), [@smarterclayton](https://github.com/smarterclayton))
* If you are running the cloud-controller-manager and you have the `pvlabel.kubernetes.io` alpha Initializer enabled, you must now enable PersistentVolume labeling using the `PersistentVolumeLabel` admission controller instead. You can do this by adding `PersistentVolumeLabel` in the `--enable-admission-plugins` kube-apiserver flag.  ([#73102](https://github.com/kubernetes/kubernetes/pull/73102), [@andrewsykim](https://github.com/andrewsykim))
* The alpha Initializers feature, `admissionregistration.k8s.io/v1alpha1` API version, `Initializers` admission plugin, and use of the `metadata.initializers` API field have been removed. Discontinue use of the alpha feature and delete any existing `InitializerConfiguration` API objects before upgrading. The `metadata.initializers` field will be removed in a future release. ([#72972](https://github.com/kubernetes/kubernetes/pull/72972), [@liggitt](https://github.com/liggitt))
* Scale max-inflight limits together with master VM sizes. ([#73268](https://github.com/kubernetes/kubernetes/pull/73268), [@wojtek-t](https://github.com/wojtek-t))
* kubectl supports copying files with wild card ([#72641](https://github.com/kubernetes/kubernetes/pull/72641), [@dixudx](https://github.com/dixudx))
* kubeadm: add back `--cert-dir` option for `kubeadm init phase certs sa` ([#73239](https://github.com/kubernetes/kubernetes/pull/73239), [@mattkelly](https://github.com/mattkelly))
* Remove deprecated args '--show-all' ([#69255](https://github.com/kubernetes/kubernetes/pull/69255), [@Pingan2017](https://github.com/Pingan2017))
* As per deprecation policy in https://kubernetes.io/docs/reference/using-api/deprecation-policy/  ([#73001](https://github.com/kubernetes/kubernetes/pull/73001), [@shivnagarajan](https://github.com/shivnagarajan))
    * the taints "node.alpha.kubernetes.io/notReady" and "node.alpha.kubernetes.io/unreachable".  are no
    * longer supported or adjusted. These uses should be replaced with "node.kubernetes.io/not-ready"
    * and "node.kubernetes.io/unreachable" respectively instead.
* The /swagger.json and /swagger-2.0.0.pb-v1 schema documents, deprecated since v1.10, have been removed in favor of `/openapi/v2` ([#73148](https://github.com/kubernetes/kubernetes/pull/73148), [@liggitt](https://github.com/liggitt))
* CoreDNS is only officially supported on Linux at this time.  As such, when kubeadm is used to deploy this component into your kubernetes cluster, it will be restricted (using nodeSelectors) to run only on nodes with that operating system. This ensures that in clusters which include Windows nodes, the scheduler will not ever attempt to place CoreDNS pods on these machines, reducing setup latency and enhancing initial cluster stability. ([#69940](https://github.com/kubernetes/kubernetes/pull/69940), [@MarcPow](https://github.com/MarcPow))
* kubeadm now attempts to detect an installed CRI by its usual domain socket, so that --cri-socket can be omitted from the command line if Docker is not used and there is a single CRI installed. ([#69366](https://github.com/kubernetes/kubernetes/pull/69366), [@rosti](https://github.com/rosti))
* scheduler: makes pod less racing so as to be put back into activeQ properly ([#73078](https://github.com/kubernetes/kubernetes/pull/73078), [@Huang-Wei](https://github.com/Huang-Wei))
* jsonpath expressions containing `[start:end:step]` slice are now evaluated correctly ([#73149](https://github.com/kubernetes/kubernetes/pull/73149), [@liggitt](https://github.com/liggitt))
* metadata.deletionTimestamp is no longer moved into the future when issuing repeated DELETE requests against a resource containing a finalizer. ([#73138](https://github.com/kubernetes/kubernetes/pull/73138), [@liggitt](https://github.com/liggitt))
* The "kubectl api-resources" command will no longer fail to display any resources on a single failure  ([#73035](https://github.com/kubernetes/kubernetes/pull/73035), [@juanvallejo](https://github.com/juanvallejo))
* e2e tests that require SSH may be used against clusters that have nodes without external IP addresses by setting the environment variable `KUBE_SSH_BASTION` to the `host:port` of a machine that is allowed to SSH to those nodes.  The same private key that the test would use is used for the bastion host.  The test connects to the bastion and then tunnels another SSH connection to the node. ([#72286](https://github.com/kubernetes/kubernetes/pull/72286), [@smarterclayton](https://github.com/smarterclayton))
* kubeadm: explicitly wait for `etcd` to have grown when joining a new control plane ([#72984](https://github.com/kubernetes/kubernetes/pull/72984), [@ereslibre](https://github.com/ereslibre))
* Install CSINodeInfo and CSIDriver CRDs in the local cluster. ([#72584](https://github.com/kubernetes/kubernetes/pull/72584), [@xing-yang](https://github.com/xing-yang))
* kubectl loads config file once and uses persistent client config ([#71117](https://github.com/kubernetes/kubernetes/pull/71117), [@dixudx](https://github.com/dixudx))
* remove stale OutOfDisk condition from kubelet side ([#72507](https://github.com/kubernetes/kubernetes/pull/72507), [@dixudx](https://github.com/dixudx))
* Node OS/arch labels are promoted to GA ([#73048](https://github.com/kubernetes/kubernetes/pull/73048), [@yujuhong](https://github.com/yujuhong))
* Fix graceful apiserver shutdown to not drop outgoing bytes before the process terminates. ([#72970](https://github.com/kubernetes/kubernetes/pull/72970), [@sttts](https://github.com/sttts))
* Change apiserver metrics to conform metrics guidelines. ([#72336](https://github.com/kubernetes/kubernetes/pull/72336), [@danielqsj](https://github.com/danielqsj))
    * The following metrics are deprecated, and will be removed in a future release:
        * `apiserver_request_count`
        * `apiserver_request_latencies`
        * `apiserver_request_latencies_summary`
        * `apiserver_dropped_requests`
        * `etcd_helper_cache_hit_count`
        * `etcd_helper_cache_miss_count`
        * `etcd_helper_cache_entry_count`
        * `etcd_request_cache_get_latencies_summary`
        * `etcd_request_cache_add_latencies_summary`
        * `etcd_request_latencies_summary`
        * `transformation_latencies_microseconds `
        * `data_key_generation_latencies_microseconds`
    * Please convert to the following metrics:
        * `apiserver_request_total`
        * `apiserver_request_latency_seconds`
        * `apiserver_dropped_requests_total`
        * `etcd_helper_cache_hit_total`
        * `etcd_helper_cache_miss_total`
        * `etcd_helper_cache_entry_total`
        * `etcd_request_cache_get_latency_seconds`
        * `etcd_request_cache_add_latency_seconds`
        * `etcd_request_latency_seconds`
        * `transformation_latencies_seconds`
        * `data_key_generation_latencies_seconds`
* acquire lock before operating unschedulablepodsmap ([#73022](https://github.com/kubernetes/kubernetes/pull/73022), [@denkensk](https://github.com/denkensk))
* Print `SizeLimit` of `EmptyDir` in `kubectl describe pod` outputs. ([#69279](https://github.com/kubernetes/kubernetes/pull/69279), [@dtaniwaki](https://github.com/dtaniwaki))
* add goroutine to move unschedulable pods to activeq if they are not retried for more than 1 minute ([#72558](https://github.com/kubernetes/kubernetes/pull/72558), [@denkensk](https://github.com/denkensk))
* PidPressure evicts pods from lowest priority to highest priority ([#72844](https://github.com/kubernetes/kubernetes/pull/72844), [@dashpole](https://github.com/dashpole))
* Reduce GCE log rotation check from 1 hour to every 5 minutes.  Rotation policy is unchanged (new day starts, log file size > 100MB). ([#72062](https://github.com/kubernetes/kubernetes/pull/72062), [@jpbetz](https://github.com/jpbetz))
* Add support for max attach limit for Cinder ([#72980](https://github.com/kubernetes/kubernetes/pull/72980), [@gnufied](https://github.com/gnufied))
* Fixes the setting of NodeAddresses when using the vSphere CloudProvider and nodes that have multiple IP addresses. ([#70805](https://github.com/kubernetes/kubernetes/pull/70805), [@danwinship](https://github.com/danwinship))
* kubeadm: pull images when joining a new control plane instance ([#72870](https://github.com/kubernetes/kubernetes/pull/72870), [@MalloZup](https://github.com/MalloZup))
* Enable mTLS encription between etcd and kube-apiserver in GCE ([#70144](https://github.com/kubernetes/kubernetes/pull/70144), [@wenjiaswe](https://github.com/wenjiaswe))
* The `/swaggerapi/*` schema docs, deprecated since 1.7, have been removed in favor of the /openapi/v2 schema docs. ([#72924](https://github.com/kubernetes/kubernetes/pull/72924), [@liggitt](https://github.com/liggitt))
* Allow users to use Docker 18.09 with kubeadm ([#72823](https://github.com/kubernetes/kubernetes/pull/72823), [@dims](https://github.com/dims))



# v1.14.0-alpha.1

[Documentation](https://docs.k8s.io)

## Downloads for v1.14.0-alpha.1


filename | sha512 hash
-------- | -----------
[kubernetes.tar.gz](https://dl.k8s.io/v1.14.0-alpha.1/kubernetes.tar.gz) | `fac80e5674e547d00987516fb2eca6ea9947529307566be6a12932e3c9e430e8ad094afae748f31e9574838d98052423e3634a067f1456f7c13f6b27bfa63bcc`
[kubernetes-src.tar.gz](https://dl.k8s.io/v1.14.0-alpha.1/kubernetes-src.tar.gz) | `d1b5b2c15cb0daa076606f4ccf887724b0166dee0320f2a61d16ab4689931ab0cf5dac4c499aea3d434eb96d589d2b3effe0037e2244978d4290bd19b9a3edea`

### Client Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-client-darwin-386.tar.gz](https://dl.k8s.io/v1.14.0-alpha.1/kubernetes-client-darwin-386.tar.gz) | `307c426e4abaf81648af393ddd641c225d87b02d8662d1309fe3528f14ed91b2470f6b46dc8ce0459cf196e2cec906f7eb972bf4c9a96cbd570e206f5a059dca`
[kubernetes-client-darwin-amd64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.1/kubernetes-client-darwin-amd64.tar.gz) | `8daa85f3e8feaea0d55f20f850038dd113f0f08b62eef944b08a9109d4e69f323a8fcf20c12790c78386b454148bcc9a0cdf106ba3393620709d185c291887fa`
[kubernetes-client-linux-386.tar.gz](https://dl.k8s.io/v1.14.0-alpha.1/kubernetes-client-linux-386.tar.gz) | `28d73c299cb9859fdfeb3e4869a7a9c77f5679309c2613bd2c72d92dafd5faad0653a7377616190edd29cb8fa1aff104daba98f398e72f3447a132f208dde756`
[kubernetes-client-linux-amd64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.1/kubernetes-client-linux-amd64.tar.gz) | `eb923e13026f80b743a57100d4f94995f322ab6f107c34ffd9aa74b5a6c6a4a410aff8921a4f675ace7db2ff8158a90874b8f56d3142ad2cbe615c11ec2d4535`
[kubernetes-client-linux-arm.tar.gz](https://dl.k8s.io/v1.14.0-alpha.1/kubernetes-client-linux-arm.tar.gz) | `279b0d0c560900021abea4bbfc25aeca7389f0b37d80022dc3335147344663424e7ba6a0abecb2dca1d2facb4163e26080750736a9a1932d67422f88b0940679`
[kubernetes-client-linux-arm64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.1/kubernetes-client-linux-arm64.tar.gz) | `d69d28361b9c9e16f3e6804ccda92d55ee743e63aba7fded04edf1f7202b1fa96c235e36ab2ca17df99b4aede80b92150790885bdb7f5b4d7956af3c269dd83c`
[kubernetes-client-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.14.0-alpha.1/kubernetes-client-linux-ppc64le.tar.gz) | `ca6ebb87df98bf179c94f54a4e8ae2ef2ea534b1bc5014331f937aa9d4c0442d5423651457871ef5c51f481ba8a3f449d69ef7e42e49c1b313f66cff3d44926f`
[kubernetes-client-linux-s390x.tar.gz](https://dl.k8s.io/v1.14.0-alpha.1/kubernetes-client-linux-s390x.tar.gz) | `13fa2058ceba66d8da5ba5982aa302cdd1c61d15253183ab97739229584a178f057f7979b49a035cb2355197dbb388d1642939e2c002b10e23263127030022ab`
[kubernetes-client-windows-386.tar.gz](https://dl.k8s.io/v1.14.0-alpha.1/kubernetes-client-windows-386.tar.gz) | `42ba4bba477e2958aab674a0fbf888bd5401fa5fbc39466b6cad0fc97e249ac949042c513bf176957bcb336a906e612d9c6790215e78c280225351236ec96993`
[kubernetes-client-windows-amd64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.1/kubernetes-client-windows-amd64.tar.gz) | `d5f339fe4d37c61babc97208446d1859423b7679f34040f72e9138b72a18d982e66732d1f4b4f3443700f9cbe96bfc0e12eaec0a8a373fb903b49efdafcbae04`

### Server Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-server-linux-amd64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.1/kubernetes-server-linux-amd64.tar.gz) | `bcbcbd3ac4419e54e894d1e595f883e61fcf9db0353a30d794a9e5030cde8957abe8124fa5265e8c52fbc93f07cfe79b2493f791dc225468bf927b7ab4694087`
[kubernetes-server-linux-arm.tar.gz](https://dl.k8s.io/v1.14.0-alpha.1/kubernetes-server-linux-arm.tar.gz) | `fda4ea9168555f724659601b06737dea6ec95574569df4ef7e4ab6c2cca3327623ef310bf34f792767f00ee8069b9dd83564835d43daf973087be816be40010b`
[kubernetes-server-linux-arm64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.1/kubernetes-server-linux-arm64.tar.gz) | `c142857711ec698844cd61188e70b5ab185ba2c8828cf5563a2f42958489e2ae4dbb2c1626271d4f5582167bb363e55ed03afb15e7e86cd414e0dc049fe384c0`
[kubernetes-server-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.14.0-alpha.1/kubernetes-server-linux-ppc64le.tar.gz) | `524a40c5717b24c5a3b2491c4c61cf3038ba5ae7f343797a1b56a5906d6a0a3eb57e9ae78590c28ac3d441d9d1bb480a0c264a07e009a4365503ad2357614aa8`
[kubernetes-server-linux-s390x.tar.gz](https://dl.k8s.io/v1.14.0-alpha.1/kubernetes-server-linux-s390x.tar.gz) | `ef943fe326b05ece57f2e409ab1cc5fe863f5effa591abae17181c84a5eb4061e9f394ffcc8ee6ebb3f5165b183bab747a8cef540cbb1436343e8180cec037e0`

### Node Binaries

filename | sha512 hash
-------- | -----------
[kubernetes-node-linux-amd64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.1/kubernetes-node-linux-amd64.tar.gz) | `396f7588e9131dd1b99d101c8bb94fb7e67ab067327ee58dab5a6e24887d8fbb6fc78fe50804abb0ab2f626034881d4280b3f678a1fd8b34891762bf2172b268`
[kubernetes-node-linux-arm.tar.gz](https://dl.k8s.io/v1.14.0-alpha.1/kubernetes-node-linux-arm.tar.gz) | `b75c1550438da0b66582d6de90436ee3c44e41e67f74947d93ee9a07ed2b7757762f3f2b05bd7b5589d7e1ea2eb3616b2ef4fe59a9fbe9d8e7cb8f0c9d3dd158`
[kubernetes-node-linux-arm64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.1/kubernetes-node-linux-arm64.tar.gz) | `b6c46f9250b5565fa178ecc99ffedc6724b0bfffb73acc7d3da2c678af71008a264502cc4a48a6e7452bd0a60d77194141bbc2ea9af49176ea66e27d874b77ac`
[kubernetes-node-linux-ppc64le.tar.gz](https://dl.k8s.io/v1.14.0-alpha.1/kubernetes-node-linux-ppc64le.tar.gz) | `8d505c61a59bc9fc53d6f219d6434ddd962ba383654c46e16d413cee0ad6bd26f276a9860ad3680349bcfacb361e75de07fc44f7d14c054c47b6bd0eae63615f`
[kubernetes-node-linux-s390x.tar.gz](https://dl.k8s.io/v1.14.0-alpha.1/kubernetes-node-linux-s390x.tar.gz) | `83b6cf0fb348faa93fa40ec2a947b202b3a5a2081c3896ae39618f947a57b431bc774fbe3a5437719f50f002de252438dc16bac6f632c11140f55d5051094ae6`
[kubernetes-node-windows-amd64.tar.gz](https://dl.k8s.io/v1.14.0-alpha.1/kubernetes-node-windows-amd64.tar.gz) | `43471680533685c534023787cd40431b67041bab43e93dea457283ee0f08a8fa02ee9ade3737d8e64d1d3255a281af9a107cb61f9e4d9c99dee188c82a075580`

## Changelog since v1.13.0

### Action Required

* action required ([#68753](https://github.com/kubernetes/kubernetes/pull/68753), [@johnSchnake](https://github.com/johnSchnake))
    * If you are running E2E tests which require SSH keys and you utilize environment variables to override their location, you may need to modify the environment variable set. On all providers the environment variable override can now be either an absolute path to the key or a relative path (relative to ~/.ssh). Specifically the changes are:
    *  - Created new GCE_SSH_KEY allowing specification of SSH keys for gce, gke, and kubemark.
    *  - AWS_SSH_KEY, previously assumed to be an absolute path can now be either relative or absolute
    *  - LOCAL_SSH_KEY (for local and vsphere providers) was previously assumed to be a filename relative to ~/.ssh but can now also be an absolute path
    *  - KUBE_SSH_KEY (for skeleton provider) was previously assumed to be a filename relative to ~/.ssh but can now also be an absolute path

### Other notable changes

* Connections from Pods to Services with 0 endpoints will now ICMP reject immediately, rather than blackhole and timeout. ([#72534](https://github.com/kubernetes/kubernetes/pull/72534), [@thockin](https://github.com/thockin))
* Improve efficiency of preemption logic in clusters with many pending pods. ([#72895](https://github.com/kubernetes/kubernetes/pull/72895), [@bsalamat](https://github.com/bsalamat))
* Change scheduler metrics to conform metrics guidelines. ([#72332](https://github.com/kubernetes/kubernetes/pull/72332), [@danielqsj](https://github.com/danielqsj))
    * The following metrics are deprecated, and will be removed in a future release:
        * `e2e_scheduling_latency_microseconds`
        * `scheduling_algorithm_latency_microseconds`
        * `scheduling_algorithm_predicate_evaluation`
        * `scheduling_algorithm_priority_evaluation`
        * `scheduling_algorithm_preemption_evaluation`
        * `binding_latency_microseconds`
    * Please convert to the following metrics:
        * `e2e_scheduling_latency_seconds`
        * `scheduling_algorithm_latency_seconds`
        * `scheduling_algorithm_predicate_evaluation_seconds`
        * `scheduling_algorithm_priority_evaluation_seconds`
        * `scheduling_algorithm_preemption_evaluation_seconds`
        * `binding_latency_seconds`
* Fix SelectorSpreadPriority scheduler to match all selectors when distributing pods. ([#72801](https://github.com/kubernetes/kubernetes/pull/72801), [@Ramyak](https://github.com/Ramyak))
* Add bootstrap service account & cluster roles for node-lifecycle-controller, cloud-node-lifecycle-controller, and cloud-node-controller.   ([#72764](https://github.com/kubernetes/kubernetes/pull/72764), [@andrewsykim](https://github.com/andrewsykim))
* Fixes spurious 0-length API responses. ([#72856](https://github.com/kubernetes/kubernetes/pull/72856), [@liggitt](https://github.com/liggitt))
* Updates Fluentd to 1.3.2 & added filter_parser  ([#71180](https://github.com/kubernetes/kubernetes/pull/71180), [@monotek](https://github.com/monotek))
* The leaderelection package allows the lease holder to release its lease when the calling context is cancelled. This allows ([#71490](https://github.com/kubernetes/kubernetes/pull/71490), [@smarterclayton](https://github.com/smarterclayton))
    * faster handoff when a leader-elected process is gracefully terminated.
* Make volume binder resilient to races between main schedule loop and async binding operation  ([#72045](https://github.com/kubernetes/kubernetes/pull/72045), [@cofyc](https://github.com/cofyc))
* Bump minimum docker API version to 1.26 (1.13.1) ([#72831](https://github.com/kubernetes/kubernetes/pull/72831), [@yujuhong](https://github.com/yujuhong))
* If the `TokenRequestProjection` feature gate is disabled, projected serviceAccountToken volume sources are now dropped at object creation time, or at object update time if the existing object did not have a projected serviceAccountToken volume source. Previously, these would result in validation errors. ([#72714](https://github.com/kubernetes/kubernetes/pull/72714), [@mourya007](https://github.com/mourya007))
* Add `metrics-port` to kube-proxy cmd flags. ([#72682](https://github.com/kubernetes/kubernetes/pull/72682), [@whypro](https://github.com/whypro))
* kubectl: fixed an issue with "too old resource version" errors continuously appearing when calling `kubectl delete` ([#72825](https://github.com/kubernetes/kubernetes/pull/72825), [@liggitt](https://github.com/liggitt))
* [Breaking change, client-go]: The WaitFor function returns, probably an ErrWaitTimeout, when the done channel is closed, even if the `WaitFunc` doesn't handle the done channel. ([#72364](https://github.com/kubernetes/kubernetes/pull/72364), [@kdada](https://github.com/kdada))
* removes newline from json output for windows nodes [#72657](https://github.com/kubernetes/kubernetes/pull/72657) ([#72659](https://github.com/kubernetes/kubernetes/pull/72659), [@jsturtevant](https://github.com/jsturtevant))
* The DenyEscalatingExec and DenyExecOnPrivileged admission plugins are deprecated and will be removed in v1.18. Use of `PodSecurityPolicy` or a custom admission plugin to limit creation of pods is recommended instead. ([#72737](https://github.com/kubernetes/kubernetes/pull/72737), [@liggitt](https://github.com/liggitt))
* Fix `describe statefulset` not printing number of desired replicas correctly ([#72781](https://github.com/kubernetes/kubernetes/pull/72781), [@tghartland](https://github.com/tghartland))
* Fix kube-proxy PodSecurityPolicy binding on GCE & GKE. This was only an issue when running kube-proxy as a DaemonSet, with PodSecurityPolicy enabled. ([#72761](https://github.com/kubernetes/kubernetes/pull/72761), [@tallclair](https://github.com/tallclair))
* Drops `status.Conditions` of new `PersistentVolume` objects if it was not set on the old object during `PrepareForUpdate`. ([#72739](https://github.com/kubernetes/kubernetes/pull/72739), [@rajathagasthya](https://github.com/rajathagasthya))
* kubelet: fixes cadvisor internal error when "--container-runtime-endpoint" is set to "unix:///var/run/crio/crio.sock". ([#72340](https://github.com/kubernetes/kubernetes/pull/72340), [@makocchi-git](https://github.com/makocchi-git))
* The `spec.SecurityContext.Sysctls` field is now dropped during creation of `Pod` objects unless the `Sysctls` feature gate is enabled. ([#72752](https://github.com/kubernetes/kubernetes/pull/72752), [@rajathagasthya](https://github.com/rajathagasthya))
    * The `spec.AllowedUnsafeSysctls` and `spec.ForbiddenSysctls` fields are now dropped during creation of `PodSecurityPolicy` objects unless the `Sysctls` feature gate is enabled.
* kubeadm: fixed storing of front-proxy certificate in secrets required by kube-controller-manager selfhosting pivoting ([#72727](https://github.com/kubernetes/kubernetes/pull/72727), [@bart0sh](https://github.com/bart0sh))
* Administrator is able to configure max pids for a pod on a node. ([#72076](https://github.com/kubernetes/kubernetes/pull/72076), [@derekwaynecarr](https://github.com/derekwaynecarr))
* Move users of `factory.NewConfigFactory` to `scheduler.New`. ([#71875](https://github.com/kubernetes/kubernetes/pull/71875), [@wgliang](https://github.com/wgliang))
* The `spec.SecurityContext.ShareProcessNamespace` field is now dropped during creation of `Pod` objects unless the `PodShareProcessNamespace ` feature gate is enabled. ([#72698](https://github.com/kubernetes/kubernetes/pull/72698), [@rajathagasthya](https://github.com/rajathagasthya))
* kube-apiserver: When configuring integration with external KMS Providers, users  can supply timeout value (i.e. how long should kube-apiserver wait before giving up on a call to KMS).  ([@immutableT](https://github.com/immutableT) ) ([#72540](https://github.com/kubernetes/kubernetes/pull/72540), [@immutableT](https://github.com/immutableT))
* The `spec.readinessGates` field is now dropped during creation of `Pod` objects unless the `PodReadinessGates` feature gate is enabled. ([#72695](https://github.com/kubernetes/kubernetes/pull/72695), [@rajathagasthya](https://github.com/rajathagasthya))
* The `spec.dataSource` field is now dropped during creation of PersistentVolumeClaim objects unless the `VolumeSnapshotDataSource` feature gate is enabled. ([#72666](https://github.com/kubernetes/kubernetes/pull/72666), [@rajathagasthya](https://github.com/rajathagasthya))
* Stop kubelet logging a warning to override hostname if there's no change detected. ([#71560](https://github.com/kubernetes/kubernetes/pull/71560), [@KashifSaadat](https://github.com/KashifSaadat))
* client-go: fake clients now properly return NotFound errors when attempting to patch non-existent objects ([#70886](https://github.com/kubernetes/kubernetes/pull/70886), [@bouk](https://github.com/bouk))
* kubectl: fixes a bug determining the correct namespace while running in a pod when the `--context` flag is explicitly specified, and the referenced context specifies the namespace `default` ([#72529](https://github.com/kubernetes/kubernetes/pull/72529), [@liggitt](https://github.com/liggitt))
* Fix scheduling starvation of pods in cluster with large number of unschedulable pods. ([#72619](https://github.com/kubernetes/kubernetes/pull/72619), [@everpeace](https://github.com/everpeace))
* If the AppArmor feature gate is disabled, AppArmor-specific annotations in pod and pod templates are dropped when the object is created, and during update of objects that do not already contain AppArmor annotations, rather than triggering a validation error. ([#72655](https://github.com/kubernetes/kubernetes/pull/72655), [@liggitt](https://github.com/liggitt))
* client-go: shortens refresh period for token files to 1 minute to ensure auto-rotated projected service account tokens are read frequently enough. ([#72437](https://github.com/kubernetes/kubernetes/pull/72437), [@liggitt](https://github.com/liggitt))
* Multiple tests which previously failed due to lack of external IP addresses defined on the nodes should now be passable. ([#68792](https://github.com/kubernetes/kubernetes/pull/68792), [@johnSchnake](https://github.com/johnSchnake))
* kubeadm: fixed incorrect controller manager pod mutations during selfhosting pivoting ([#72518](https://github.com/kubernetes/kubernetes/pull/72518), [@bart0sh](https://github.com/bart0sh))
* Increase Azure default maximumLoadBalancerRuleCount to 250. ([#72621](https://github.com/kubernetes/kubernetes/pull/72621), [@feiskyer](https://github.com/feiskyer))
* RuntimeClass is now printed with extra `RUNTIME-HANDLER` column. ([#72446](https://github.com/kubernetes/kubernetes/pull/72446), [@Huang-Wei](https://github.com/Huang-Wei))
* Updates the kubernetes dashboard add-on to v1.10.1. Skipping dashboard login is no longer enabled by default. ([#72495](https://github.com/kubernetes/kubernetes/pull/72495), [@liggitt](https://github.com/liggitt))
* [GCP] Remove confusing error log entry form fluentd scalers. ([#72243](https://github.com/kubernetes/kubernetes/pull/72243), [@cezarygerard](https://github.com/cezarygerard))
* change azure disk host cache to ReadOnly by default ([#72229](https://github.com/kubernetes/kubernetes/pull/72229), [@andyzhangx](https://github.com/andyzhangx))
* Nodes deleted in the cloud provider with Ready condition `Unknown` should also be deleted on the API server.  ([#72559](https://github.com/kubernetes/kubernetes/pull/72559), [@andrewsykim](https://github.com/andrewsykim))
* `kubectl apply --prune` now uses the apps/v1 API to prune workload resources ([#72352](https://github.com/kubernetes/kubernetes/pull/72352), [@liggitt](https://github.com/liggitt))
* Fixes a bug in HPA controller so HPAs are always updated every resyncPeriod (15 seconds). ([#72373](https://github.com/kubernetes/kubernetes/pull/72373), [@krzysztof-jastrzebski](https://github.com/krzysztof-jastrzebski))
* IPVS: "ExternalTrafficPolicy: Local" now works with LoadBalancer services using loadBalancerIP ([#72432](https://github.com/kubernetes/kubernetes/pull/72432), [@lbernail](https://github.com/lbernail))
* Fixes issue with cleaning up stale NFS subpath mounts ([#71804](https://github.com/kubernetes/kubernetes/pull/71804), [@msau42](https://github.com/msau42))
* Modify the scheduling result struct and improve logging for successful binding. ([#71926](https://github.com/kubernetes/kubernetes/pull/71926), [@wgliang](https://github.com/wgliang))
* Run one etcd storage compaction per default interval of 5min. Do not run one for each resource and each CRD. This fixes the compaction log spam and reduces load on etcd. ([#68557](https://github.com/kubernetes/kubernetes/pull/68557), [@sttts](https://github.com/sttts))
* kube-apiserver: `--runtime-config` can once again be used to enable/disable serving specific resources in the `extensions/v1beta1` API group. Note that specific resource enablement/disablement is only allowed for the `extensions/v1beta1` API group for legacy reasons. Attempts to enable/disable individual resources in other API groups will print a warning, and will return an error in future releases. ([#72249](https://github.com/kubernetes/kubernetes/pull/72249), [@liggitt](https://github.com/liggitt))
* kubeadm: fixed storing of etcd certificates in secrets required by kube-apiserver selfhosting pivoting ([#72478](https://github.com/kubernetes/kubernetes/pull/72478), [@bart0sh](https://github.com/bart0sh))
* kubeadm: remove the deprecated "--address" flag for controller-manager and scheduler. ([#71973](https://github.com/kubernetes/kubernetes/pull/71973), [@MalloZup](https://github.com/MalloZup))
* kube-apiserver: improves performance of requests made with service account token authentication ([#71816](https://github.com/kubernetes/kubernetes/pull/71816), [@liggitt](https://github.com/liggitt))
* Use prometheus conventions for workqueue metrics. ([#71300](https://github.com/kubernetes/kubernetes/pull/71300), [@danielqsj](https://github.com/danielqsj))
    * It is now deprecated to use the following metrics:
        * `{WorkQueueName}_depth`
        * `{WorkQueueName}_adds`
        * `{WorkQueueName}_queue_latency`
        * `{WorkQueueName}_work_duration`
        * `{WorkQueueName}_unfinished_work_seconds`
        * `{WorkQueueName}_longest_running_processor_microseconds`
        * `{WorkQueueName}_retries`
    * Please convert to the following metrics:
        * `workqueue_depth`
        * `workqueue_adds_total`
        * `workqueue_queue_latency_seconds`
        * `workqueue_work_duration_seconds`
        * `workqueue_unfinished_work_seconds`
        * `workqueue_longest_running_processor_seconds`
        * `workqueue_retries_total`
* Fix inability to use k8s with dockerd having default IPC mode set to private. ([#70826](https://github.com/kubernetes/kubernetes/pull/70826), [@kolyshkin](https://github.com/kolyshkin))
* Fix a race condition in the scheduler preemption logic that could cause nominatedNodeName of a pod not to be considered in one or more scheduling cycles. ([#72259](https://github.com/kubernetes/kubernetes/pull/72259), [@bsalamat](https://github.com/bsalamat))
* Fix registration for scheduling framework plugins with the default plugin set ([#72396](https://github.com/kubernetes/kubernetes/pull/72396), [@y-taka-23](https://github.com/y-taka-23))
* The GA VolumeScheduling feature gate can no longer be disabled and will be removed in a future release ([#72382](https://github.com/kubernetes/kubernetes/pull/72382), [@liggitt](https://github.com/liggitt))
* Fix race condition introduced by graceful termination which can lead to a deadlock in kube-proxy ([#72361](https://github.com/kubernetes/kubernetes/pull/72361), [@lbernail](https://github.com/lbernail))
* Fixes issue where subpath volume content was deleted during orphaned pod cleanup for Local volumes that are directories (and not mount points) on the root filesystem. ([#72291](https://github.com/kubernetes/kubernetes/pull/72291), [@msau42](https://github.com/msau42))
* Fixes `kubectl create secret docker-registry` compatibility ([#72344](https://github.com/kubernetes/kubernetes/pull/72344), [@liggitt](https://github.com/liggitt))
* Add-on manifests now use the apps/v1 API for DaemonSets, Deployments, and ReplicaSets ([#72203](https://github.com/kubernetes/kubernetes/pull/72203), [@liggitt](https://github.com/liggitt))
* "kubectl wait" command now supports the "--all" flag to select all resources in the namespace of the specified resource types. ([#70599](https://github.com/kubernetes/kubernetes/pull/70599), [@caesarxuchao](https://github.com/caesarxuchao))
* `deployments/rollback` is now passed through validation/admission controllers ([#72271](https://github.com/kubernetes/kubernetes/pull/72271), [@jhrv](https://github.com/jhrv))
* The `Lease` API type in the `coordination.k8s.io` API group is promoted to `v1` ([#72239](https://github.com/kubernetes/kubernetes/pull/72239), [@wojtek-t](https://github.com/wojtek-t))
* Move compatibility_test.go to pkg/scheduler/api ([#72014](https://github.com/kubernetes/kubernetes/pull/72014), [@huynq0911](https://github.com/huynq0911))
* New Azure cloud provider option 'cloudProviderBackoffMode' has been added to reduce Azure API retries. Candidate values are: ([#70866](https://github.com/kubernetes/kubernetes/pull/70866), [@feiskyer](https://github.com/feiskyer))
        * default (or empty string): keep same with before.
        * v2: only backoff retry with Azure SDK with fixed exponent 2.
* Set percentage of nodes scored in each cycle dynamically based on the cluster size. ([#72140](https://github.com/kubernetes/kubernetes/pull/72140), [@wgliang](https://github.com/wgliang))
* Fix AAD support for Azure sovereign cloud in kubectl ([#72143](https://github.com/kubernetes/kubernetes/pull/72143), [@karataliu](https://github.com/karataliu))
* Make kube-proxy service abstraction optional. ([#71355](https://github.com/kubernetes/kubernetes/pull/71355), [@bradhoekstra](https://github.com/bradhoekstra))
    * Add the 'service.kubernetes.io/service-proxy-name' label to a Service to disable the kube-proxy service proxy implementation.
* kubectl: `-A` can now be used as a shortcut for `--all-namespaces` ([#72006](https://github.com/kubernetes/kubernetes/pull/72006), [@soltysh](https://github.com/soltysh))
* discovery.CachedDiscoveryInterface implementation returned by NewMemCacheClient has changed semantics of Invalidate method -- the cache refresh is now deferred to the first cache lookup. ([#70994](https://github.com/kubernetes/kubernetes/pull/70994), [@mborsz](https://github.com/mborsz))
* Fix device mountable volume names in DSW to prevent races in device mountable plugin, e.g. local. ([#71509](https://github.com/kubernetes/kubernetes/pull/71509), [@cofyc](https://github.com/cofyc))
* Enable customize in kubectl: kubectl will be able to recognize directories with kustomization.YAML ([#70875](https://github.com/kubernetes/kubernetes/pull/70875), [@Liujingfang1](https://github.com/Liujingfang1))
* Stably sort controllerrevisions. This can prevent pods of statefulsets from continually rolling. ([#66882](https://github.com/kubernetes/kubernetes/pull/66882), [@ryanmcnamara](https://github.com/ryanmcnamara))
* Update to use go1.11.4. ([#72084](https://github.com/kubernetes/kubernetes/pull/72084), [@ixdy](https://github.com/ixdy))
* fixes an issue deleting pods containing subpath volume mounts with the VolumeSubpath feature disabled ([#70490](https://github.com/kubernetes/kubernetes/pull/70490), [@liggitt](https://github.com/liggitt))
* Clean up old eclass code ([#71399](https://github.com/kubernetes/kubernetes/pull/71399), [@resouer](https://github.com/resouer))
* Fix a race condition in which kubeadm only waits for the kubelets kubeconfig file when it has performed the TLS bootstrap, but wasn't waiting for certificates to be present in the filesystem ([#72030](https://github.com/kubernetes/kubernetes/pull/72030), [@ereslibre](https://github.com/ereslibre))
* In addition to restricting GCE metadata requests to known APIs, the metadata-proxy now restricts query strings to known parameters. ([#71094](https://github.com/kubernetes/kubernetes/pull/71094), [@dekkagaijin](https://github.com/dekkagaijin))
* kubeadm: fix a possible panic when joining a new control plane node in HA scenarios ([#72123](https://github.com/kubernetes/kubernetes/pull/72123), [@anitgandhi](https://github.com/anitgandhi))
* fix race condition when attach azure disk in vmss ([#71992](https://github.com/kubernetes/kubernetes/pull/71992), [@andyzhangx](https://github.com/andyzhangx))
* Update to use go1.11.3 with fix for CVE-2018-16875 ([#72035](https://github.com/kubernetes/kubernetes/pull/72035), [@seemethere](https://github.com/seemethere))
* kubeadm: fix a bug when syncing etcd endpoints ([#71945](https://github.com/kubernetes/kubernetes/pull/71945), [@pytimer](https://github.com/pytimer))
* fix kubelet log flushing issue in azure disk ([#71990](https://github.com/kubernetes/kubernetes/pull/71990), [@andyzhangx](https://github.com/andyzhangx))
* Disable proxy to loopback and linklocal ([#71980](https://github.com/kubernetes/kubernetes/pull/71980), [@micahhausler](https://github.com/micahhausler))
* Fix overlapping filenames in diff if multiple resources have the same name. ([#71923](https://github.com/kubernetes/kubernetes/pull/71923), [@apelisse](https://github.com/apelisse))
* fix issue: vm sku restriction policy does not work in azure disk attach/detach ([#71941](https://github.com/kubernetes/kubernetes/pull/71941), [@andyzhangx](https://github.com/andyzhangx))
* kubeadm: Create /var/lib/etcd with correct permissions (0700) by default. ([#71885](https://github.com/kubernetes/kubernetes/pull/71885), [@dims](https://github.com/dims))
* Scheduler only activates unschedulable pods if node's scheduling related properties change. ([#71551](https://github.com/kubernetes/kubernetes/pull/71551), [@mlmhl](https://github.com/mlmhl))
* kube-proxy in IPVS mode will stop initiating connections to terminating pods for services with sessionAffinity set. ([#71834](https://github.com/kubernetes/kubernetes/pull/71834), [@lbernail](https://github.com/lbernail))
* kubeadm: improve hostport parsing error messages ([#71258](https://github.com/kubernetes/kubernetes/pull/71258), [@bart0sh](https://github.com/bart0sh))
* Support graceful termination with IPVS when deleting a service ([#71895](https://github.com/kubernetes/kubernetes/pull/71895), [@lbernail](https://github.com/lbernail))
* Include CRD for BGPConfigurations, needed for calico 2.x to 3.x upgrade. ([#71868](https://github.com/kubernetes/kubernetes/pull/71868), [@satyasm](https://github.com/satyasm))
* apply: fix detection of non-dry-run enabled servers ([#71854](https://github.com/kubernetes/kubernetes/pull/71854), [@apelisse](https://github.com/apelisse))
* Clear UDP conntrack entry on endpoint changes when using nodeport  ([#71573](https://github.com/kubernetes/kubernetes/pull/71573), [@JacobTanenbaum](https://github.com/JacobTanenbaum))
* Add successful and failed history limits to cronjob describe ([#71844](https://github.com/kubernetes/kubernetes/pull/71844), [@soltysh](https://github.com/soltysh))
* kube-controller-manager: fixed issue display help for the deprecated insecure --port flag ([#71601](https://github.com/kubernetes/kubernetes/pull/71601), [@liggitt](https://github.com/liggitt))
* kubectl: fixes regression in --sort-by behavior ([#71805](https://github.com/kubernetes/kubernetes/pull/71805), [@liggitt](https://github.com/liggitt))
* Fixes pod deletion when cleaning old cronjobs ([#71801](https://github.com/kubernetes/kubernetes/pull/71801), [@soltysh](https://github.com/soltysh))
* kubeadm: use kubeconfig flag instead of kubeconfig-dir on init phase bootstrap-token ([#71803](https://github.com/kubernetes/kubernetes/pull/71803), [@yagonobre](https://github.com/yagonobre))
* kube-scheduler: restores ability to run without authentication configuration lookup permissions ([#71755](https://github.com/kubernetes/kubernetes/pull/71755), [@liggitt](https://github.com/liggitt))
* Add aggregator_unavailable_apiservice_{count,gauge} metrics in the kube-aggregator. ([#71380](https://github.com/kubernetes/kubernetes/pull/71380), [@sttts](https://github.com/sttts))
* Fixes apiserver nil pointer panics when requesting v2beta1 autoscaling object metrics ([#71744](https://github.com/kubernetes/kubernetes/pull/71744), [@yue9944882](https://github.com/yue9944882))
* Only use the first IP address got from instance metadata. This is because Azure CNI would set up a list of IP addresses in instance metadata, while only the first one is the Node's IP. ([#71736](https://github.com/kubernetes/kubernetes/pull/71736), [@feiskyer](https://github.com/feiskyer))
* client-go: restores behavior of populating the BearerToken field in rest.Config objects constructed from kubeconfig files containing tokenFile config, or from in-cluster configuration. An additional BearerTokenFile field is now populated to enable constructed clients to periodically refresh tokens. ([#71713](https://github.com/kubernetes/kubernetes/pull/71713), [@liggitt](https://github.com/liggitt))
* kubeadm: remove deprecated kubeadm config print-defaults command ([#71467](https://github.com/kubernetes/kubernetes/pull/71467), [@rosti](https://github.com/rosti))
* hack/local-up-cluster.sh now enables kubelet authentication/authorization by default (they can be disabled with KUBELET_AUTHENTICATION_WEBHOOK=false and KUBELET_AUTHORIZATION_WEBHOOK=false ([#71690](https://github.com/kubernetes/kubernetes/pull/71690), [@liggitt](https://github.com/liggitt))
* Fixes an issue where Azure VMSS instances not existing in Azure were not being deleted by the Cloud Controller Manager.  ([#71597](https://github.com/kubernetes/kubernetes/pull/71597), [@marc-sensenich](https://github.com/marc-sensenich))
* kubeadm reset correcty unmounts mount points inside /var/lib/kubelet ([#71663](https://github.com/kubernetes/kubernetes/pull/71663), [@bart0sh](https://github.com/bart0sh))
* Upgrade default etcd server to 3.3.10 ([#71615](https://github.com/kubernetes/kubernetes/pull/71615), [@jpbetz](https://github.com/jpbetz))
* When creating a service with annotation: service.beta.kubernetes.io/load-balancer-source-ranges containing multiple source ranges and service.beta.kubernetes.io/azure-shared-securityrule: "false",  the NSG rules will be collapsed. ([#71484](https://github.com/kubernetes/kubernetes/pull/71484), [@ritazh](https://github.com/ritazh))
* disable node's proxy use of http probe ([#68663](https://github.com/kubernetes/kubernetes/pull/68663), [@WanLinghao](https://github.com/WanLinghao))
* Bumps version of kubernetes-cni to 0.6.0 ([#71629](https://github.com/kubernetes/kubernetes/pull/71629), [@mauilion](https://github.com/mauilion))
* On GCI, NPD starts to monitor kubelet, docker, containerd crashlooping, read-only filesystem and corrupt docker overlay2 issues. ([#71522](https://github.com/kubernetes/kubernetes/pull/71522), [@wangzhen127](https://github.com/wangzhen127))
* When a kubelet is using --bootstrap-kubeconfig and certificate rotation, it no longer waits for bootstrap to succeed before launching static pods. ([#71174](https://github.com/kubernetes/kubernetes/pull/71174), [@smarterclayton](https://github.com/smarterclayton))
* Add an plugin interfaces for "reserve" and "prebind" extension points of the scheduling framework. ([#70227](https://github.com/kubernetes/kubernetes/pull/70227), [@bsalamat](https://github.com/bsalamat))
* Fix scheduling starvation of pods in cluster with large number of unschedulable pods. ([#71488](https://github.com/kubernetes/kubernetes/pull/71488), [@bsalamat](https://github.com/bsalamat))
* Reduce CSI log and event spam. ([#71581](https://github.com/kubernetes/kubernetes/pull/71581), [@saad-ali](https://github.com/saad-ali))
* Add conntrack as a dependency of kubelet and kubeadm when building rpms and debs. Both require conntrack to handle cleanup of connections. ([#71540](https://github.com/kubernetes/kubernetes/pull/71540), [@mauilion](https://github.com/mauilion))
* UDP connections now support graceful termination in IPVS mode ([#71515](https://github.com/kubernetes/kubernetes/pull/71515), [@lbernail](https://github.com/lbernail))
* Log etcd client errors. The verbosity is set with the usual `-v` flag. ([#71318](https://github.com/kubernetes/kubernetes/pull/71318), [@sttts](https://github.com/sttts))
* The `DefaultFeatureGate` package variable now only exposes readonly feature gate methods. Methods for mutating feature gates have moved into a `MutableFeatureGate` interface and are accessible via the `DefaultMutableFeatureGate` package variable. Only top-level commands and options setup should access `DefaultMutableFeatureGate`. ([#71302](https://github.com/kubernetes/kubernetes/pull/71302), [@liggitt](https://github.com/liggitt))
* `node.kubernetes.io/pid-pressure` toleration is added for DaemonSet pods, and `node.kubernetes.io/out-of-disk` isn't added any more even if it's a critical pod. ([#67036](https://github.com/kubernetes/kubernetes/pull/67036), [@Huang-Wei](https://github.com/Huang-Wei))
* Update k8s.io/utils to allow for asynchronous process control ([#71047](https://github.com/kubernetes/kubernetes/pull/71047), [@hoegaarden](https://github.com/hoegaarden))
* Fixes possible panic during volume detach, if corresponding volume plugin became non-attachable ([#71471](https://github.com/kubernetes/kubernetes/pull/71471), [@mshaverdo](https://github.com/mshaverdo))
* Fix cloud-controller-manager crash when using AWS provider and PersistentVolume initializing controller  ([#70432](https://github.com/kubernetes/kubernetes/pull/70432), [@mvladev](https://github.com/mvladev))
* Fixes an issue where Portworx volumes cannot be mounted if 9001 port is already in use on the host and users remap 9001 to another port. ([#70392](https://github.com/kubernetes/kubernetes/pull/70392), [@harsh-px](https://github.com/harsh-px))
* Fix `SubPath` printing of `VolumeMounts`. ([#70127](https://github.com/kubernetes/kubernetes/pull/70127), [@dtaniwaki](https://github.com/dtaniwaki))
* Fixes incorrect paths (missing first letter) when copying files from pods to ([#69885](https://github.com/kubernetes/kubernetes/pull/69885), [@clickyotomy](https://github.com/clickyotomy))
    * local in `kubectl cp'.
* Fix AWS NLB security group updates where valid security group ports were incorrectly removed ([#68422](https://github.com/kubernetes/kubernetes/pull/68422), [@kellycampbell](https://github.com/kellycampbell))
    * when updating a service or when node changes occur.
