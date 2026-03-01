---
layout: blog
title: 'Kubernetes Performance Tuning: Optimizing Large-Scale Clusters'
date: 2026-03-XX
draft: true
slug: kubernetes-performance-tuning-optimizing-large-scale-clusters
author: >
  Jayesh Mahajan

---

As Kubernetes clusters grow from hundreds to thousands of nodes and tens of thousands of {{< glossary_tooltip text="pods" term_id="pod" >}}, performance bottlenecks can emerge in unexpected places. What worked perfectly at small scale may cause slowdowns, API timeouts, or scheduling delays in larger deployments. This post provides practical guidance for tuning Kubernetes control plane components and cluster infrastructure to handle production workloads at scale.

## Understanding performance at scale

Performance issues in large Kubernetes clusters typically manifest in several ways:

- **API server slowdowns**: Slow response times for `kubectl` commands or API calls
- **Scheduling delays**: Pods taking longer to be scheduled to nodes
- **etcd performance**: High latency or timeout errors from the {{< glossary_tooltip text="etcd" term_id="etcd" >}} backend
- **Node performance**: Kubelet struggling to manage many pods per node
- **Network bottlenecks**: Slow pod-to-pod communication or service discovery

Before diving into optimizations, establish baseline metrics and monitoring. You can't improve what you don't measure. Key metrics to track include:

- API server request latency (p50, p95, p99)
- etcd operation latency and throughput
- Scheduler scheduling cycle time
- Kubelet pod sync duration
- Network packet loss and latency

## API server performance optimization

The {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} is the central control point for all Kubernetes operations. As cluster size grows, API server performance becomes critical.

### Enable API server caching

The API server supports multiple caching layers. Ensure these are enabled:

```yaml
# kube-apiserver flags
--watch-cache=true
--enable-garbage-collector=true
# New in v1.34+: Use snapshottable cache for consistent list performance
--feature-gates=ConsistentListFromCache=true
```

### Tune In-flight Request Limits

If you see "429 Too Many Requests" error or high latencct then there are high chances API server connection limits needs tuning. Kubernetes uses API PRiority and Fairness to manage traffic but the global capacity is still capped by these flags:

```yaml
# kube-apiserver flags
--max-requests-inflight=3000
--max-mutating-requests-inflight=1000
```

For larger clusters, you may need to increase these values, but be cautious, higher limits increase memory usage. Start with defaults and increase gradually while monitoring memory and request latency. This is not TCP connection limits but concurrent in-flight limits. N number of connections may have 0 in flight or 1 connection can have 30 request in flight.

{{< note >}}
Monitor API server memory usage when adjusting `--max-requests-inflight` and `--max-mutating-requests-inflight`. Each inflight request consumes memory, and setting these too high can lead to out-of-memory (OOM) conditions.
{{< /note >}}

### Use API server audit logging carefully

Audit logging is important for security and compliance but can impact disk I/O, not just API server CPU, especially with large event volumes.

```yaml
# kube-apiserver flags
--audit-log-mode=batch
--audit-log-maxsize=100
--audit-log-format=json   # JSON is easier to parse but consumes more API Server CPU than the legacy format. Ensure there is CPU headroom if your audit policy is aggressive.
--audit-policy-file=/etc/kubernetes/audit-policy.yaml
```

Consider:
- Using batch mode for audit logs (`--audit-log-mode=batch`)
- Filtering audit events to only log what you need
- Using external audit backends for high-volume scenarios

### Optimize API server etcd access

The API server's interaction with etcd can become a bottleneck. Configure:

```yaml
# kube-apiserver flags
--etcd-servers-overrides=/events#https://events-etcd:2379
```

Separating event storage from main etcd can improve performance by isolating high-volume event writes from critical API operations.

## etcd performance tuning

Imagine every controller constantly asking etcd 'What changed?', it would overwhelm etcd. ```--watch-cache=true``` allows the API server to answer those questions from its own memory, freeing up etcd. etcd is the {{< glossary_tooltip text="control plane" term_id="control-plane" >}}'s persistent storage backend. Performance issues here cascade to all components.
### etcd hardware considerations

etcd is sensitive to I/O performance. If fsync takes longer than 10ms, the cluster stability is at risk because etcd's raft concensus will start electing new leader. 

- **Use SSDs**: etcd requires low-latency storage. NVMe SSDs are recommended for large clusters.
- **Dedicated hardware**: Avoid co-locating etcd with other workloads
- **Network latency**: Keep etcd nodes in the same data center with low latency between them

### etcd configuration tuning

Key etcd parameters to tune:

```yaml
# etcd configuration
--quota-backend-bytes=4294967296  # 2GB default, increase for large clusters
# If your etcd members are across zones, standard timeouts might be too aggressive to handle network jitter, causing frequent leader elections.
--heartbeat-interval=250   # Increase from 100ms
--election-timeout=2500    # Increase from 1000ms
```

### Monitor etcd performance

Track these etcd metrics:

- `etcd_disk_wal_fsync_duration_seconds`: WAL sync latency
- `etcd_disk_backend_commit_duration_seconds`: Backend commit latency
- `etcd_server_leader_changes_seen_total`: Leader election frequency
- `etcd_server_requests_total`: Request rate and latency

High latency in these metrics indicates I/O bottlenecks.

{{< note >}}
etcd performance degrades significantly when the database size exceeds the quota. Monitor `etcd_server_quota_backend_bytes` and ensure compaction and defragmentation are running regularly.
{{< /note >}}

For large clusters, etcd typically requires at least 50-100 sequential write IOPS (fsyncs) per second.

### etcd compaction and defragmentation

Do think just from regular maintenance but from day one automate these operations via cron jobs or Kubernetes {{< glossary_tooltip text="CronJobs" term_id="cronjob" >}}, but schedule them during low-traffic periods:

```bash
# Compact etcd history (keep last 5 minutes)
etcdctl compact $(date -d '5 minutes ago' +%s)

# Defragment etcd to reclaim space
etcdctl defrag
```


## Kubelet performance considerations

The {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} runs on each node and manages pod lifecycles. With many pods per node, kubelet can become a bottleneck.

As of v1.35, In-Place Pod Resizing is GA. Instead of the expensive cycle of killing and recreating pods to adjust resources—which creates significant API and Scheduler churn at scale—you can now update container resources directly. This is vital for maintaining stability in clusters with high churn.

### Configure kubelet resource limits

Set appropriate CPU and memory limits for kubelet so memory hungry pod wont starve the node that can make to go in "NotReady" sytate.:

```yaml
# kubelet configuration
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
systemReserved:
  cpu: "500m"
  memory: "1Gi"
kubeReserved:
  cpu: "500m"
  memory: "1Gi"
```

### Optimize pod sync frequency

Adjust how frequently kubelet syncs pod status:

```yaml
# kubelet configuration
syncFrequency: 1m  # Default 1m, increase to 2m-5m for large clusters
```

In large-scale clusters, frequent syncing can overwhelm the API server. While 1m provides faster status updates, it is often better to increase this value to 2m or more to reduce control plane pressure, provided your application can tolerate slightly stale status reporting. This is rarely needed and should be adjusted only after profiling kubelet latency.

### Limit concurrent pod operations

Control how many pods kubelet processes simultaneously:

```yaml
# kubelet flags
--max-pods=110  # Default 110, adjust based on node capacity
--pod-max-pids=4096  # Limit processes per pod
```
{{< note >}}
Increasing this without adjusting networking can lead to pod scheduling failures
{{< /note >}}

## Network performance optimization

Routing traffic across nodes isn't just slow, it increases cloud data transfer costs.
To minimize this, use the `trafficDistribution` field in your Service specs. Setting this to `PreferSameNode` attempts to keep traffic on the local node, only routing externally if absolutely necessary.

### CNI plugin selection

Instead of going with default CNI, choose CNI plugins optimized for performance and fits with your application traffic model:

- **Calico**: Best if you need complex NetworkPolicies
- **Cilium**: eBPF-based, high performance.
- **Flannel**: Simple, higher overhead

Benchmark your CNI plugin by running a network benchmark (like `netperf`) under load to validate performance.

### Optimize kube-proxy

If using iptables mode (default), Switch to nftables for better performance at scale:

```yaml
# kube-proxy ConfigMap
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
mode: nftables
```

{{< note >}}
If you aren't using an eBPF-based CNI (like Cilium), the legacy iptables mode will become a bottleneck. Switch to **nftables** mode (available in v1.31+) for a performance boost without the complexity of IPVS.
{{< /note >}}

### DNS performance

DNS latency is many time bottleneck in Kubernetes. Instead of just increasing cache size, enable active pre-fetching. This allows CoreDNS to refresh frequently used records in the background before the TTL expires, preventing the "first lookup" latency penalty.

kubectl -n kube-system edit configmap node-local-dns
under cluster.local
```yaml
cache {
    success 2560 30
    denial 2560 5
    prefetch 10 60%
}
```
Additionally, If you are using managed kubernetes on cloud, prefer sending DNS request to cloud DNS within a cloud region to get maximum benefits of latency. It will save huge latency improvement instead of sending the dns reolution request to internet or your on prem DNS server. 
## Storage performance tuning

Storage I/O can bottleneck stateful workloads and the control plane.

### Storage class optimization

Configure storage classes with appropriate performance parameters:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: pd.csi.storage.gke.io # This is Google Kubernetes Engine Example.
parameters:
  type: pd-ssd
  replication-type: none
volumeBindingMode: WaitForFirstConsumer
allowVolumeExpansion: true
```

## Scheduler performance

The {{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}} determines pod placement. At scale, scheduling decisions must be fast.

### Scheduler configuration

Use a custom scheduler configuration to optimize for your workload:

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



### Limit scheduler parallelism

Control how many pods the scheduler processes concurrently:
Recent scheduler updates have optimized how the scheduler handles queues, making it much more efficient for "batch-style" workloads common in large clusters.

```yaml
# kube-scheduler flags
--parallelism=16  #default value. Increase to 32 or 64 depending on nodes size of 200 or 500+
# Monitor scheduler_scheduling_duration_seconds;
# v1.35 introduces opportunistic batching for pods with identical signatures.
```

## Performance metrics and benchmarking

Establish a performance testing framework for your cluster.

### Key metrics to monitor

| Component | Metric | Description |
|-----------|--------|-------------|
| **API Server** | `apiserver_request_duration_seconds` | Request latency |
| | `apiserver_request_total` | Request rate |
| | `apiserver_admission_webhook_admission_duration_seconds` | Admission latency |
| **etcd** | `etcd_disk_wal_fsync_duration_seconds` | Write latency |
| | `etcd_server_requests_total` | Request rate and latency |
| **Scheduler** | `scheduler_scheduling_duration_seconds` | Scheduling latency |
| | `scheduler_pending_pods` | Pending pod count |
| **Kubelet** | `kubelet_pod_worker_duration_seconds` | Pod sync duration |
| | `kubelet_runtime_operations_duration_seconds` | Runtime operation latency |

### Benchmarking tools

- **kubemark**: Hollow nodes for large-scale testing
- **clusterloader2**: Kubernetes load testing tool
- **kubectl-benchmark**: API server performance testing
- **etcd benchmarks**: Built-in etcd performance tools

### Establishing SLAs

Define performance SLAs for your cluster:

- API server p95 latency: < 100ms
- etcd write latency: < 10ms
- Pod scheduling time: < 5s for 95% of pods
- Node ready time after reboot: < 2 minutes

## Best practices summary

1. **Measure first**: Establish baseline metrics before optimizing
2. **Monitor continuously**: Use Prometheus, Grafana, or similar tools
3. **Optimize incrementally**: Make one change at a time and measure impact
4. **Test at scale**: Use load testing tools to validate improvements
5. **Document changes**: Keep track of configuration changes and their impacts
6. **Plan for growth**: Design for 2-3x current scale to avoid frequent re-tuning

## Common pitfalls

- **Ignoring hardware**: Software optimizations can't overcome hardware limitations
- **Neglecting etcd**: etcd is often the bottleneck but gets less attention
- **Insufficient monitoring**: Can't optimize what you can't measure
- **Ignoring WebSocket Transition**: Since v1.35, Kubernetes has transitioned streaming connections (like exec and attach) to WebSockets. Ensure your load balancers and identity proxies (like OIDC providers) are configured to handle WebSocket traffic, or you will see timeouts at scale.

## Conclusion

Performance tuning for large-scale Kubernetes clusters is an iterative process. Start by establishing comprehensive monitoring, identify bottlenecks through testing and metrics analysis, then optimize systematically. Remember that what works for one cluster may not work for another—your workload patterns, hardware, and network topology all influence optimal configurations.

Focus on the control plane components (API server, etcd, scheduler) first, as bottlenecks there affect the entire cluster. Then optimize node-level components (kubelet, CNI, storage) based on your specific workload requirements.

## How can I learn more?

- [Resource Quotas](/docs/concepts/policy/resource-quotas/)
- [API Server Configuration](/docs/reference/config-api/kube-apiserver-config.v1beta2/)
- [etcd Operations Guide](https://etcd.io/docs/latest/op-guide/)
- [Kubelet Configuration](/docs/reference/config-api/kubelet-config.v1beta1/)
- [Scheduler Configuration](/docs/reference/scheduling/config/)
- [Etcs Disks Recommendations](https://etcd.io/docs/v3.6/op-guide/hardware/#disks)
- [Large cluster](/docs/setup/best-practices/cluster-large/)
