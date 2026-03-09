---
layout: blog
title: 'Kubernetes Performance Tuning: Optimizing Large-Scale Clusters'
date: 2026-03-XX
draft: true
slug: kubernetes-performance-tuning-optimizing-large-scale-clusters
author: >
  Jayesh Mahajan

---
As Kubernetes clusters grow from hundreds to thousands of nodes and tens of thousands of {{< glossary_tooltip text="pods" term_id="pod" >}} the added wright of diverse workloads and CRDs, performance bottlenecks can emerge from many different places depending on the type of workload its running. What worked perfectly at small scale didn't when I hit few hundred nodes when kubectl slowed down, API timeouts, or scheduling delays for larger deployments. This post provides important guidance for tuning Kubernetes control plane components and cluster infrastructure to handle production workloads at scale.

Before configuring any flag, you must be obsessed with your p99 metrics because you simply cannot improve what you haven't measured. This means moving beyond simple averages to track API server request latency at the p50, p95, and p99 intervals, alongside etcd operation latency and throughput. You also need a clear view of the scheduler's cycle time and the duration of Kubelet pod syncs to identify where the control plane is dragging. Don't overlook the infrastructure layer; monitoring network packet loss and latency is essential to ensure that underlying connectivity isn't undermining your higher-level tuning efforts.

## API server performance optimization

The {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} is the central control point for all Kubernetes operations, the single point of failure for everything. As cluster size grows, API server performance becomes critical. To keep it responsive, you should start by maximizing its internal caching layers. By ensuring --watch-cache=true is set and leveraging newer features like the snapshottable cache via the ConsistentListFromCache feature gate, stable in v1.34+. It serves heavy LIST requests from memory instead of hitting etcd every time. Controllers get faster responses, but plan for more RAM on control plane nodes. Additionally, emable APIServingWithRoutine and LoggingAlphaOptions for API server performance improvement and improving logging performance.

```yaml
# kube-apiserver flags
--watch-cache=true # Default: true
--enable-garbage-collector=true # Default: true Enables the generic garbage collector. MUST be synced with the corresponding flag of the kube-controller-manager.
--feature-gates=ConsistentListFromCache=true
# ConsistentListFromCache: Enhance Kubernetes API server performance by serving consistent list requests directly from its watch cache, improving scalability and response times. To consistent list from cache Kubernetes requires a newer etcd version (v3.4.31+ or v3.5.13+), that includes fixes to watch progress request feature. If older etcd version is provided Kubernetes will automatically detect it and fallback to serving consistent reads from etcd. Progress notifications ensure watch cache is consistent with etcd while reducing the need for resource-intensive quorum reads from etcd.
# --feature-gates=APIServingWithRoutine=true # APIServingWithRoutine (default=false) is feature gate (alpha - 1.30+) enables an API server performance improvement: the API server can use separate goroutines (lightweight threads managed by the Go runtime) to serve watch requests.
# --feature-gates=LoggingAlphaOptions=true # Enable the LoggingAlphaOptions (default=false) feature gate (alpha 1.24+) and set --log-text-info-buffer-size to a non-zero byte value (e.g., 2Ki or 1Mi) to buffer text-format info messages and boost logging performance in high-throughput clusters.

```

When you start seeing "429 Too Many Requests" error or high latency, it is a sign the API server connection limits needs tuning. Unlike simple TCP connection limits, flags like --max-requests-inflight and --max-mutating-requests-inflight control how many concurrent operations the API server processes at once. This isn't TCP connection limits but concurrent operations. For example N number of connections may have 0 in flight request or 1 connection could have N. While raising these values (e.g., toward higher value for non-mutating requests) can clear traffic jams in large clusters, you must proceed with caution by looking at memory metrics for control plane. Each concurrent request consumes additional RAM, so I recommend increasing these limits gradually while keeping a close eye on memory usage to avoid triggering an out-of-memory (OOM) event that could take down the entire control plane. Kubernetes uses API PRiority and Fairness to manage traffic but the global capacity is still capped by these flags.

```yaml
# kube-apiserver flags
--max-requests-inflight=400  # (Default: 400) This and --max-mutating-requests-inflight are summed to determine the server's total concurrency limit (which must be positive) if --enable-priority-and-fairness is true. Otherwise, this flag limits the maximum number of non-mutating requests in flight, or a zero value disables the limit completely.
--max-mutating-requests-inflight=200 # This and --max-requests-inflight are summed to determine the server's total concurrency limit (which must be positive) if --enable-priority-and-fairness is true. Otherwise, this flag limits the maximum number of mutating requests in flight, or a zero value disables the limit completely.
```

{{< note >}}
Monitor API server memory usage when adjusting `--max-requests-inflight` and `--max-mutating-requests-inflight`. Each inflight request consumes memory, and setting these too high can lead to out-of-memory (OOM) conditions.
{{< /note >}}

Audit logging is another area where performance can degrade silently. While critical for security, logging every event can swamp your disk I/O and CPU, especially during high usage periods. To mitigate this, always use --audit-log-mode=batch to buffer events and write them in chunks.

```yaml
# kube-apiserver flags
--audit-log-mode=batch   #Strategy for sending audit events. Blocking indicates sending events should block server responses. Batch causes the backend to buffer and write events asynchronously. Known modes are batch,blocking,blocking-strict.
--audit-log-maxsize=100  # The maximum size in megabytes of the audit log file before it gets rotated.
# --audit-log-format=json   # JSON is easier to parse but consumes more API Server CPU than the legacy format. There should be CPU headroom if your audit policy is aggressive. Removing this at a trades of operational simplicity for a potential performance improvement. 
--audit-policy-file=/etc/kubernetes/audit-policy.yaml  #Path to the file that defines the audit policy configuration.
```
## Optimize Etcd for API server

The {{< glossary_tooltip text="etcd" term_id="etcd" >}} server's performance is sensitive to I/O latency. The controller constantly asking etcd 'What changed?', it overwhelms etcd. ```--watch-cache=true``` allows the API server to answer those questions from its own memory, freeing up etcd. etcd is the {{< glossary_tooltip text="control plane" term_id="control-plane" >}}'s persistent storage backend. If an fsync takes longer than 10ms, your cluster stability is at risk because etcd's raft consensus will start failing, triggering constant leader elections. For large cluster you should always run etcd on dedicated hardware or instance. Pretty good portion of etcs is events so seperating it out will help reducing etcd overload. For the most demanding environments, the best way to protect the API server is to isolate high volume event traffic entirely by using --etcd-servers-overrides. By pointing events to a dedicated etcd instance, you ensure that a flood of "pod scheduled" or "node heartbeat" events never starves your critical cluster state for resources. Keep etcd nodes in the same data center (cloud zone) to minimize network jitter, as high latency between members is a silent killer of cluster health as it grows.

```yaml
# kube-apiserver flags
--etcd-servers="https://etcd-main-1:2379,https://etcd-main-2:2379,https://etcd-main-3:2379"
#--etcd-servers-overrides strings
--etcd-servers-overrides="/events#https://etcd-events-1:2379;https://etcd-events-2:2379"
# Per-resource etcd servers overrides, comma separated. The individual override format: group/resource#servers, where servers are URLs, semicolon separated. Note that this applies only to resources compiled into this server binary. e.g. "/pods#http://etcd4:2379;http://etcd5:2379,/events#http://etcd6:2379"
```

For the etcd the standard 100ms heartbeat is many times aggressive for cross-zone deployments. Bumping the interval and election timeout helps prevent a leader election death spiral during minor network hiccups.

```yaml
# etcd configuration
--quota-backend-bytes=4294967296  # 2GB default, increase for large clusters
# If your etcd members are across zones, standard timeouts might be too aggressive to handle network jitter, causing frequent leader elections.
--heartbeat-interval=100 # Standard 100ms is could be too aggressive for cross-zone clusters;  Increase this and measure contnuesly the performance improvemend reducing the count of leader election
--election-timeout=1000 #   
```

To keep etcd healthy, you must monitor I/O and stability metrics like WAL sync latency and backend commit duration; high values here almost always point to storage bottlenecks. Keep a close eye on leader changes and request rates to catch instability early. Additionally, track the database size against its quota. Performance drops off a cliff once you hit that limit, so automate regular compaction and defragmentation to reclaim space before it becomes an issue.

{{< note >}}
etcd performance degrades significantly when the database size exceeds the quota. Monitor `etcd_server_quota_backend_bytes` and ensure compaction and defragmentation are running regularly.
{{< /note >}}

## Kubelet performance considerations

When we pack a high density of pods onto a single node, the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} often becomes the bottleneck. The good thing is as of v1.35 is the GA of In Place Pod Resizing. Instead of the disruptive cycle of killing and recreating pods to change resource limits, which creates massive API and scheduler churn, we can now update resources on the fly. This keeps the cluster state stable even when workloads are highly dynamic.

To prevent a single memory hungry pod from starving the Kubelet and knocking the node into a "NotReady" state, we must explicitly reserve resources. Setting systemReserved and kubeReserved ensures the Kubelet always has the CPU and memory headroom it needs to maintain node health, regardless of how much pressure the workloads are applying.

{{< note >}}
For managed Kubernetes in cloud these values will be managed by cloud providers directly in automated way (not configurable) in many cases just changing the instance/vm type so you will most likely have to check cloud provider documentation. 
{{< /note >}}

In large clusters, the sheer volume of status updates can overwhelm the API server. While the default syncFrequency is 1 minute, increasing this to 2 or 5 minutes can significantly reduce control plane pressure. It's a trade-off: you get a more stable control plane at the cost of slightly stale pod status reporting. Only adjust this after you’ve profiled your Kubelet latency and confirmed the API server is struggling.

```yaml
# kubelet configuration
syncFrequency: 1m  # Default 1m, increase to 2m-5m for large clusters
```

Manage the density and process overhead on your nodes by tuning max-pods and pod-max-pids. Resetting this to 110 will help in case it was set without architectural design discussion. 
```yaml
# kubelet flags
--max-pods=110  # Default and no more than 110
```
{{< note >}}
Ideal way to adjust for load is to increase more nodes instead of increasing max-pods number.
{{< /note >}}

To keep an eye on performance watch these metrics : apiserver_request_duration_seconds for the control plane, etcd_disk_wal_fsync_duration_seconds for storage health, and scheduler_scheduling_duration_seconds for placement speed. On the nodes, keep a close eye on kubelet_pod_worker_duration_seconds. High latency in any of these is an early warning sign of a bottleneck.

```
# Essential p95 SLAs
API Server Latency: < 100ms
etcd Write Latency: < 10ms
Pod Scheduling: < 5s
Node Ready Time: < 2m
```

## Network performance optimization

Routing traffic across nodes isn't just slow, it increases cloud data transfer costs. To minimize this, use the `trafficDistribution` field in your Service specs. Setting this to `PreferSameNode` attempts to keep traffic on the local node, only routing externally if absolutely necessary.

Your choice of CNI is the foundation of your network performance. While Flannel is simple, it carries higher overhead compared to modern alternatives. For complex NetworkPolicies like in big enterprise organizatoon, Calico remains a strong choice because of more control. For maximum performance at scale, Cilium’s eBPF-based architecture is the gold standard. Regardless of what you choose, never trust the marketing—run a benchmark like netperf under actual load to see how your plugin handles your specific traffic patterns.

If you aren't using an eBPF-based CNI, the legacy iptables mode in kube-proxy will eventually become a bottleneck as your Service count grows. Starting in v1.31, you can switch to nftables mode. It provides a significant performance boost over the old iptables chains without the operational complexity that often comes with migrating to IPVS.

```yaml
# kube-proxy ConfigMap
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
mode: nftables
```

DNS performance

DNS latency is a silent performance killer in large clusters. Beyond just increasing your cache size, you should enable active prefetching in CoreDNS. This ensures frequently used records are refreshed in the background before they expire, eliminating the "first lookup" penalty that plagues high-traffic applications.

kubectl -n kube-system edit configmap node-local-dns

under cluster.local
```yaml
cache {
    success 2560 30
    denial 2560 5
    prefetch 10 60%
}
```
{{< note >}}
If you are using managed kubernetes on cloud, prefer sending DNS request to cloud DNS locally within a cloud region/zone/dmz to get maximum benefits of latency. I have seen huge latency improvement with this small change because it stops doing a round trip for internal dns that routes from isp to internet back to cluster in same network. 
{{< /note >}}

## Architecture design consideration. 

Be mindful of using validation and mutating webhook configuration (OPA, Kyverno etc) specially the scope of the api webhook configuration. A single misconfiguration can cause major performance impact including clsuter's ability to scale new pods or autoscale. As more and more api's been scanned at runtime more overload to api server, latency and delay in pod deployment it will cause. The more number of webooks, higher the scope of it and larger the cluster more the impact it will have in performance. Reducing unnecessary validation and mutating webhook will give better performance. 

Create a dedicated infrastecuture component worker/node pool for a critical infrastructure pods (like istio, prometheus, observability components, security softwares, argocd etc) so performance from other workloads will not impact SRE/Production support team's ability to troubleshoot during performance issue.

For service mesh if you are using istio, moving to latest ambient mode in istio significantly improves the performance by removing side car reducing cpu and memory footprint. Additionnally, disableing mtls where you do not need one, would reduce overhead of mtls for internal pods to pods network transaction.

Removig unnecessary INFO logging from logs (like service mesh or apps) and filter those logs before sending it to logging tool gives breathing room for performance improvement for large cluster.

For large clusters, giving namespace scoped limit for cpu, memory usage will reduce noisy neighbour performance issue for workloads. 

In an enterprise organizaiton enabeling platform for kubernetes, when there is a rush to deliver features and capabilities many times, engineers add unnecessary metrics while copy pasting configurations that increases high cardinality (unique combinations of) metrics that will crash the monitoring system like prometheus and make it unresponsive. Its critical to clean up unnecessary and high cardinality metrics regularly to avoid performance impact rolling from prometheus to kubernetes cluster's stability blocking metics itself to troublehsoot the cluster. 


Overall, start by establishing metrics from monitoring system, identify bottlenecks ((API server, etcd, scheduler, kubelet, CNI, other architecutural flows)  through performance testing and metrics analysis, then optimize one change at a time to see the impact systematically. 

## References

- [API Server Configuration](/docs/reference/config-api/kube-apiserver-config.v1beta2/)
- [etcd Operations Guide](https://etcd.io/docs/latest/op-guide/)
- [Kube API server etcd configuration](https://kubernetes.io/docs/reference/command-line-tools-reference/kube-apiserver/)
- [Kube API server consistent read from cache](https://github.com/kubernetes/enhancements/blob/master/keps/sig-api-machinery/2340-Consistent-reads-from-cache/README.md)
- [etcd design to externalize](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/ha-topology/#external-etcd-topology)
- [Kubelet Configuration](/docs/reference/config-api/kubelet-config.v1beta1/)
- [Scheduler Configuration](/docs/reference/scheduling/config/)
- [Etcd Disks Recommendations](https://etcd.io/docs/v3.6/op-guide/hardware/#disks)
- [Large cluster](/docs/setup/best-practices/cluster-large/)
- [Calico](https://docs.tigera.io/calico/latest/about/)
- [Celium](https://docs.cilium.io/en/latest/network/kubernetes/index.html)
- [Flannel](https://github.com/flannel-io/flannel/blob/master/Documentation/kubernetes.md)
- [kubeproxyconfigurations](https://kubernetes.io/docs/reference/config-api/kube-proxy-config.v1alpha1/#kubeproxy-config-k8s-io-v1alpha1-ProxyMode))
- [Feature gates](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/)
