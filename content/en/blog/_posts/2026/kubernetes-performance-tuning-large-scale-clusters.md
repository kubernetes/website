---
layout: blog
title: 'Kubernetes Performance Tuning: Optimizing Large-Scale Clusters'
date: 2026-03-XX
draft: true
slug: kubernetes-performance-tuning-optimizing-large-scale-clusters
author: >
  Jayesh Mahajan

---

As Kubernetes clusters grow from hundreds to thousands of nodes and tens of thousands of {{< glossary_tooltip text="pods" term_id="pod" >}}, performance bottlenecks can emerge in unexpected places. What worked perfectly at small scale didnt for me when I hit few hunred nodes when kubectl slowed down, API timeouts, or scheduling delays in larger deployments. This post provides practical guidance for tuning Kubernetes control plane components and cluster infrastructure to handle production workloads at scale.

## Understanding performance at scale

Performance issues in large Kubernetes clusters typically manifest in several ways:

- **API server slowdowns**: Slow response times for `kubectl` commands or API calls
- **Scheduling delays**: Pods taking longer to be scheduled to nodes
- **etcd performance**: High latency or timeout errors from the {{< glossary_tooltip text="etcd" term_id="etcd" >}} backend
- **Node performance**: Kubelet struggling to manage many pods per node
- **Network bottlenecks**: Slow pod-to-pod communication or service discovery

Before you touch a single flag, you must be obsessed with your p99 metrics because you simply cannot improve what you haven't measured. This means moving beyond simple averages to track API server request latency at the p50, p95, and p99 intervals, alongside etcd operation latency and throughput. You also need a clear view of the scheduler's cycle time and the duration of Kubelet pod syncs to identify where the control plane is dragging. Finally, don't overlook the infrastructure layer; monitoring network packet loss and latency is essential to ensure that underlying connectivity isn't undermining your higher-level tuning efforts.

## API server performance optimization

The {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} is the central control point for all Kubernetes operations, like a brain of the cluster. As cluster size grows, API server performance becomes critical. To keep it responsive, you should start by maximizing its internal caching layers. By ensuring --watch-cache=true is set and leveraging newer features like the snapshottable cache via the ConsistentListFromCache feature gate, its stable as of v1.34+, this will allow the server to fulfill heavy "list" requests from memory rather than constantly hammering the underlying database. This reduces the latency for controller at the same time we must budget and plan capcacity for increased memory for resource consumption on control plane nodes. 

```yaml
# kube-apiserver flags
--watch-cache=true
--enable-garbage-collector=true
--feature-gates=ConsistentListFromCache=true
```

When you start seeing "429 Too Many Requests" error or high latencct, it is a sign teh API server connection limits needs tuning. Unlike simple TCP connection limits, flags like --max-requests-inflight and --max-mutating-requests-inflight control how many concurrent operations the API server processes at once. This is not TCP connection limits but concurrent in-flight limits. N number of connections may have 0 in flight or 1 connection can have 30 request in flight. While raising these values (e.g., toward 3000 for non-mutating requests) can clear traffic jams in large clusters, you must proceed with caution by looking at memory metrics for control plane. Each concurrent request consumes additional RAM, so I recommend increasing these limits gradually while keeping a close eye on memory usage to avoid triggering an out-of-memory (OOM) event that could take down the entire control plane. Kubernetes uses API PRiority and Fairness to manage traffic but the global capacity is still capped by these flags.

```yaml
# kube-apiserver flags
--max-requests-inflight=3000
--max-mutating-requests-inflight=1000
```

{{< note >}}
Monitor API server memory usage when adjusting `--max-requests-inflight` and `--max-mutating-requests-inflight`. Each inflight request consumes memory, and setting these too high can lead to out-of-memory (OOM) conditions.
{{< /note >}}


Audit logging is another area where performance can degrade silently. While critical for security, logging every event can swamp your disk I/O and CPU, especially during high usage periods. To mitigate this, always use --audit-log-mode=batch to buffer events and write them in chunks, and consider using the JSON format only if you have sufficient CPU headroom, as it is more resource intensive than the legacy format. For the most demanding environments, the best way to protect the API server is to isolate high volume event traffic entirely by using --etcd-servers-overrides. By pointing events to a dedicated etcd instance, you ensure that a flood of "pod scheduled" or "node heartbeat" events never starves your critical cluster state for resources.

```yaml
# kube-apiserver flags
--audit-log-mode=batch
--audit-log-maxsize=100
--audit-log-format=json   # JSON is easier to parse but consumes more API Server CPU than the legacy format. There should be CPU headroom if your audit policy is aggressive.
--audit-policy-file=/etc/kubernetes/audit-policy.yaml
```

### Optimize API server etcd access

In large-scale environments, the API server's interaction with etcd often becomes a bottleneck. To prevent a flood of "pod scheduled" or "node heartbeat" events from starving your critical cluster state for resources, you should isolate event traffic entirely. By using the --etcd-servers-overrides flag to point events to a dedicated etcd instance, you isolate high-volume writes and ensure that event churn doesn't impact the performance of your main database.

```yaml
# kube-apiserver flags
--etcd-servers-overrides=/events#https://events-etcd:2379
```

When it comes to etcd performance, the backend is notoriously sensitive to I/O latency. Imagine every controller constantly asking etcd 'What changed?', it would overwhelm etcd. ```--watch-cache=true``` allows the API server to answer those questions from its own memory, freeing up etcd. etcd is the {{< glossary_tooltip text="control plane" term_id="control-plane" >}}'s persistent storage backend. If an fsync takes longer than 10ms, your cluster stability is at risk because etcd's raft consensus will start failing, triggering constant leader elections. For large cluster you should always run etcd on dedicated hardware and avoid colocating it with other workloads. Keep etcd nodes in the same data center to minimize network jitter, as high latency between members is a silent killer of cluster health.

Beyond hardware, your configuration needs to account for the increased database size and network reality of a large cluster. I recommend increasing the --quota-backend-bytes to prevent the database from locking up under high volume. Additionally, the standard 100ms heartbeat is many times agressive for cross-zone deployments; bumping the interval and election timeout helps prevent a leader-election death spiral during minor network hiccups.


```yaml
# etcd configuration
--quota-backend-bytes=4294967296  # 2GB default, increase for large clusters
# If your etcd members are across zones, standard timeouts might be too aggressive to handle network jitter, causing frequent leader elections.
--heartbeat-interval=250   
--election-timeout=2500    # Standard 100ms is too agressive for cross-zone clusters; 250ms stops the leader election death spiral.
```

To keep etcd healthy, you must monitor I/O and stability metrics like WAL sync latency and backend commit duration; high values here almost always point to storage bottlenecks. Keep a close eye on leader changes and request rates to catch instability early. For large clusters, you need at least 50-100 sequential write IOPS to keep up with the churn.

Additionally, track the database size against its quota. Performance drops off a cliff once you hit that limit, so automate regular compaction and defragmentation to reclaim space before it becomes an issue.

{{< note >}}
etcd performance degrades significantly when the database size exceeds the quota. Monitor `etcd_server_quota_backend_bytes` and ensure compaction and defragmentation are running regularly.
{{< /note >}}

Don't treat etcd maintenance as an occasional task; automate it from day one to prevent the database from bloating. Use Kubernetes CronJobs to schedule compaction and defragmentation during your lowest traffic time. Compacting every few minutes keeps the revision history manageable, while defragmenting is essential to actually reclaim disk space and keep etcd responsive.

```bash
# Compact etcd history (keep last 5 minutes)
etcdctl compact $(date -d '5 minutes ago' +%s)

# Defragment etcd to reclaim space
etcdctl defrag
```


## Kubelet performance considerations

When we pack a high density of pods onto a single node, the {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} often becomes the bottleneck. The good thing is as of v1.35 is the GA of In Place Pod Resizing. Instead of the disruptive cycle of killing and recreating pods to change resource limits, which creates massive API and scheduler churn, we can now update resources on the fly. This keeps our cluster state stable even when workloads are highly dynamic.

To prevent a single memory hungry pod from starving the Kubelet and knocking the node into a "NotReady" state, we must explicitly reserve resources. Setting systemReserved and kubeReserved ensures the Kubelet always has the CPU and memory headroom it needs to maintain node health, regardless of how much pressure the workloads are applying.

{{< note >}}
For manager Kubernetes in cloud these values will be managed by cloud providers directly in some cases changing the instance/vm type so you will most likely have to check cloud provider documentation. 
{{< /note >}}

In large clusters, the sheer volume of status updates can overwhelm the API server. While the default syncFrequency is 1 minute, increasing this to 2 or 5 minutes can significantly reduce control plane pressure. It's a trade-off: you get a more stable control plane at the cost of slightly stale pod status reporting. Only adjust this after you’ve profiled your Kubelet latency and confirmed the API server is struggling.

```yaml
# kubelet configuration
syncFrequency: 1m  # Default 1m, increase to 2m-5m for large clusters
```

Manage the density and process overhead on your nodes by tuning max-pods and pod-max-pids. While pushing past the default 110 pods per node is possible, it often leads to scheduling failures if your CNI and IP allocation aren't tuned to match.
```yaml
# kubelet flags
--max-pods=110  # Default 110, adjust based on node capacity
--pod-max-pids=4096  # Limit processes per pod
```
{{< note >}}
Increasing this without adjusting networking can lead to pod scheduling failures
{{< /note >}}

## Network performance optimization

Routing traffic across nodes isn't just slow, it increases cloud data transfer costs. To minimize this, use the `trafficDistribution` field in your Service specs. Setting this to `PreferSameNode` attempts to keep traffic on the local node, only routing externally if absolutely necessary.

Your choice of CNI is the foundation of your network performance. While Flannel is simple, it carries higher overhead compared to modern alternatives. For complex NetworkPolicies, Calico remains a strong choice, but for maximum performance at scale, Cilium’s eBPF-based architecture is the gold standard. Regardless of what you choose, never trust the marketing—run a benchmark like netperf under actual load to see how your plugin handles your specific traffic patterns.

If you aren't using an eBPF-based CNI, the legacy iptables mode in kube-proxy will eventually become a bottleneck as your Service count grows. Starting in v1.31, you can switch to nftables mode. It provides a significant performance boost over the old iptables chains without the operational complexity that often comes with migrating to IPVS.

```yaml
# kube-proxy ConfigMap
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
mode: nftables
```

DNS performance

DNS latency is a silent performance killer in large clusters. Beyond just increasing your cache size, you should enable active prefetching in CoreDNS. This ensures frequently used records are refreshed in the background before they expire, eliminating the "first lookup" penalty that plagues high-traffic applications. If you're on a managed cloud provider, always route your requests to the regional cloud DNS rather than hitting an on-prem or public resolver; the reduction in latency is massive.

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
If you are using managed kubernetes on cloud, prefer sending DNS request to cloud DNS locally within a cloud region to get maximum benefits of latency. It will save huge latency improvement instead of sending the dns reolution request to outside of the cloud like your on prem DNS server. 
{{< /note >}}
## Storage performance tuning

Storage I/O is a frequent silent killer of both stateful workloads and control plane stability. When configuring your storage classes, you need to ensure parameters are tuned for low-latency performance rather than just capacity. Using volumeBindingMode: WaitForFirstConsumer is essential in multi-zone clusters to ensure volumes are provisioned in the same zone as the scheduled pod, avoiding cross-zone mounting errors. In high-performance environments like GKE, moving away from standard disks to pd-ssd or NVMe-backed storage is a non-negotiable step to prevent I/O wait times from dragging down your application responsiveness.

At the scheduler level, every millisecond counts when you're managing thousands of pods. While the default "LeastAllocated" strategy is great for spreading load, it can actually slow down scheduling in very dense clusters because the scheduler spends too much time hunting for the "emptiest" spot across hundreds of nodes. Switching to "MostAllocated" can often speed up placement decisions by focusing on filling existing capacity first. It’s a trade-off: you gain cost efficiency and speed, but you increase the risk of resource contention and throttling

```yaml
apiVersion: kubescheduler.config.k8s.io/v1
kind: KubeSchedulerConfiguration
profiles:
  - schedulerName: default-scheduler
    plugins:
      score:
        disabled:
          - name: NodeResourcesLeastAllocated
        enabled:
          - name: NodeResourcesMostAllocated
            weight: 1
```

Prioritizing Most Allocated nodes can sometimes lead to faster outcomes in dense clusters when you have 50 to 200 nodes because the scheduler focuses on filling existing capacity rather than constantly searching for the "emptiest" spot among thousands of nodes. This setup may fail or not work when nodesecctors, podaffinit or have Taints and tolderations.

Trade-offs for this are explained in this table:

| Strategy                    | Efficiency            | Risk of Throttling         | Reliability              |
|-----------------------------|-----------------------|----------------------------|--------------------------|
| **LeastAllocated (Spread)** | Low (wasteful)        | Low (plenty of buffer)     | High (isolates failures) |
| **MostAllocated (Pack)**    | High (cost-efficient) | High (resource contention) | Lower (tight margins)    |


You can significantly boost throughput by adjusting scheduler parallelism. The default value of 16 is often too conservative for clusters larger than 500 nodes; bumping this to 32 or 64 allows the scheduler to process placement decisions much faster. With v1.35 introducing opportunistic batching for identical pod signatures, these adjustments ensure your control plane can handle the "batch-style" bursts of traffic common in large scale production.

```yaml
# kube-scheduler flags
--parallelism=16  #default value. Increase to 32 or 64 depending on nodes size of 200 or 500+
```

A robust monitoring strategy should focus on the metrics that actually matter: apiserver_request_duration_seconds for the control plane, etcd_disk_wal_fsync_duration_seconds for storage health, and scheduler_scheduling_duration_seconds for placement speed. On the nodes, keep a close eye on kubelet_pod_worker_duration_seconds. High latency in any of these is an early warning sign of a bottleneck.

```
# Essential p95 SLAs
API Server Latency: < 100ms
etcd Write Latency: < 10ms
Pod Scheduling: < 5s
Node Ready Time: < 2m
```

## Conclusion

Performance tuning for large scale Kubernetes clusters is an iterative process. Start by establishing comprehensive monitoring, identify bottlenecks through testing and metrics analysis, then optimize systematically. Remember that what works for one cluster may not work for another—your workload patterns, hardware, and network topology all influence optimal configurations.

Focus on the control plane components (API server, etcd, scheduler) first, as bottlenecks there affect the entire cluster. Then optimize node-level components (kubelet, CNI, storage) based on your specific workload requirements.

## How can I learn more?

- [Resource Quotas](/docs/concepts/policy/resource-quotas/)
- [API Server Configuration](/docs/reference/config-api/kube-apiserver-config.v1beta2/)
- [etcd Operations Guide](https://etcd.io/docs/latest/op-guide/)
- [Kubelet Configuration](/docs/reference/config-api/kubelet-config.v1beta1/)
- [Scheduler Configuration](/docs/reference/scheduling/config/)
- [Etcs Disks Recommendations](https://etcd.io/docs/v3.6/op-guide/hardware/#disks)
- [Large cluster](/docs/setup/best-practices/cluster-large/)
- [Calico](https://docs.tigera.io/calico/latest/about/)
- [Cellium](https://docs.cilium.io/en/latest/network/kubernetes/index.html)
- [Flannel](https://github.com/flannel-io/flannel/blob/master/Documentation/kubernetes.md)
