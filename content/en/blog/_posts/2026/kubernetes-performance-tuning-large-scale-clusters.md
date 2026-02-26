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

### Configure connection limits

Adjust API server connection limits based on your workload:

```yaml
# kube-apiserver flags
--max-requests-inflight=400
--max-mutating-requests-inflight=200
```

For larger clusters, you may need to increase these values, but be cautious—higher limits increase memory usage. Start with defaults and increase gradually while monitoring memory and request latency.

{{< note >}}
Monitor API server memory usage when adjusting `--max-requests-inflight` and `--max-mutating-requests-inflight`. Each inflight request consumes memory, and setting these too high can lead to out-of-memory (OOM) conditions.
{{< /note >}}

### Use API server audit logging carefully

Audit logging is important for security and compliance but can impact etcd write pressure, not just API server CPU, especially with large event volumes.

```yaml
# kube-apiserver flags
--audit-log-maxbackup=10
--audit-log-maxsize=100
--audit-log-format=json
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

etcd is the {{< glossary_tooltip text="control plane" term_id="control-plane" >}}'s persistent storage backend. Performance issues here cascade to all components.

### etcd hardware considerations

etcd is sensitive to I/O performance. For production clusters:

- **Use SSDs**: etcd requires low-latency storage. NVMe SSDs are recommended for large clusters.
- **Dedicated hardware**: Avoid co-locating etcd with other workloads
- **Network latency**: Keep etcd nodes in the same data center with low latency between them

### etcd configuration tuning

Key etcd parameters to tune:

```yaml
# etcd configuration
--quota-backend-bytes=8589934592  # 8GB default, increase for large clusters
--snapshot-count=100000           # Reduce for faster snapshots
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

Regular maintenance is essential:

```bash
# Compact etcd history (keep last 5 minutes)
etcdctl compact $(date -d '5 minutes ago' +%s)

# Defragment etcd to reclaim space
etcdctl defrag
```

Automate these operations via cron jobs or Kubernetes {{< glossary_tooltip text="CronJobs" term_id="cronjob" >}}, but schedule them during low-traffic periods.

## Kubelet performance considerations

The {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} runs on each node and manages pod lifecycles. With many pods per node, kubelet can become a bottleneck.

As of v1.35, In-Place Pod Resizing is GA. Instead of the expensive cycle of killing and recreating pods to adjust resources—which creates significant API and Scheduler churn at scale—you can now update container resources directly. This is vital for maintaining stability in clusters with high churn.

### Configure kubelet resource limits

Set appropriate CPU and memory limits for kubelet:

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
### Enable container runtime optimizations

If using containerd:

```toml
# /etc/containerd/config.toml
[plugins."io.containerd.grpc.v1.cri".containerd]
  snapshotter = "overlayfs"
  default_runtime_name = "runc"

[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  runtime_type = "io.containerd.runc.v2"
```

Consider using faster snapshotters like `stargz` or `nydus` for image pull performance.

## Network performance optimization

Network performance impacts pod communication, service discovery, and ingress/egress traffic.
To reduce cross-node latency and cloud provider 'east-west' traffic costs, use the trafficDistribution field in your Service specs. Setting this to PreferSameNode (GA in v1.35) ensures that traffic stays local whenever possible.

### CNI plugin selection

Choose CNI plugins optimized for performance:

- **Calico**: Good for policy enforcement at scale
- **Cilium**: eBPF-based, high performance.
- **Flannel**: Simple, lower overhead

Benchmark your CNI plugin under load to validate performance.

### Optimize kube-proxy

If using iptables mode (default), consider switching to IPVS for better performance at scale:

```yaml
# kube-proxy ConfigMap
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
mode: ipvs
ipvs:
  scheduler: rr  # Round-robin scheduling
```

{{< note >}}
IPVS mode provides better performance for clusters with many services (1000+), but requires kernel modules to be loaded on nodes. Test thoroughly before switching in production.
{{< /note >}}

### DNS performance

Optimize CoreDNS for large clusters:

```yaml
# CoreDNS ConfigMap
apiVersion: v1
kind: ConfigMap
metadata:
  name: coredns
  namespace: kube-system
data:
  Corefile: |
    .:53 {
        cache 3600 {
            success 9984 30
            denial 9984 5
        }
        forward . /etc/resolv.conf
        reload
        loadbalance
    }
```

Enable caching and adjust cache sizes based on your DNS query patterns.

## Storage performance tuning

Storage I/O can bottleneck stateful workloads and the control plane.

### Storage class optimization

Configure storage classes with appropriate performance parameters:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-ssd
provisioner: kubernetes.io/gce-pd
parameters:
  type: pd-ssd
  replication-type: none
volumeBindingMode: WaitForFirstConsumer
allowVolumeExpansion: true
```

### Volume mount options

Use optimal mount options for your storage:

```yaml
apiVersion: v1
kind: PersistentVolume
spec:
  mountOptions:
    - noatime
    - nodiratime
```

### CSI driver optimization

If using CSI drivers, ensure they're configured for performance:

- Enable volume expansion
- Use topology-aware provisioning
- Configure appropriate volume limits per node

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

Prioritizing Most Allocated nodes can sometimes lead to faster outcomes in dense clusters because the scheduler focuses on filling existing capacity rather than constantly searching for the "emptiest" spot among thousands of nodes.

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
--parallelism=16
# Monitor scheduler_scheduling_duration_seconds;
# v1.35 introduces opportunistic batching for pods with identical signatures.
```

### Enable scheduler profiling

Monitor scheduler performance:

```yaml
# kube-scheduler flags
--profiling=true
```

Access scheduler metrics at `/metrics` endpoint to identify bottlenecks.

## Performance testing methodologies

Before optimizing, establish baseline performance metrics.

### Load testing the API server

Use tools like `kubemark` or custom scripts to simulate API load:

```bash
# Example: Measure API server latency under load
kubectl get pods --limit=500 --chunk-size=100
```

### Benchmark etcd performance

Test etcd I/O performance:

```bash
# Benchmark etcd write performance
etcdctl check perf

# Monitor etcd metrics during load
curl http://etcd:2379/metrics | grep etcd_disk
```

### Cluster-scale testing

Test with realistic workload patterns:

- Deploy thousands of pods across nodes
- Create many services and endpoints
- Generate realistic API traffic patterns
- Monitor control plane metrics during tests

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

- **Over-optimizing prematurely**: Don't optimize until you've measured bottlenecks
- **Ignoring hardware**: Software optimizations can't overcome hardware limitations
- **Neglecting etcd**: etcd is often the bottleneck but gets less attention
- **No performance testing**: Changes should be validated under load
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
