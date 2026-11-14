author: >
  [Swati Sehgal](https://github.com/swatisehgal)
date: 2026-12-XX
---

## Introduction

Kubernetes 1.XX introduces utilization-aware policies for the Topology Manager,
enabling cluster operators to optimize NUMA node allocation for their workloads.
This feature allows workload packing (consolidate onto already-utilized nodes)
and workload spreading (distribute across under-utilized nodes) based on current
CPU, memory, and device allocation.

## What is the Topology Manager?

The Topology Manager in the kubelet ensures that resource allocation decisions
(CPU, memory, devices) respect NUMA locality by coordinating between different
resource managers. It makes topology-aware decisions based on hints from:

- **CPU Manager** — CPUs allocated to containers
- **Memory Manager** — Memory allocated to containers  
- **Device Manager** — Devices (GPUs, accelerators, etc.) allocated to containers

Previously, when multiple NUMA nodes were suitable for a pod, the Topology Manager
would select based on structural properties: preferring narrowest affinity masks
or lowest NUMA node IDs. With this release, operators can now influence that
decision based on resource utilization.

## The Problem

Different workloads have different allocation goals:

### Batch Job Consolidation
Batch jobs benefit from packing onto already-utilized NUMA nodes, leaving empty
nodes available for large latency-sensitive allocations that require full NUMA locality.

### Database Spreading
Database replicas benefit from spreading across under-utilized NUMA nodes to avoid
thermal hotspots and improve sustained throughput.

### GPU Workload Prioritization
ML workloads benefit from weighting GPU allocation higher than CPU when selecting
NUMA nodes, so GPU-heavy workloads consolidate even if CPU utilization is asymmetric.

Previously, there was no way to express these preferences within Kubernetes.

## The Solution: NUMA Allocation Strategies

Kubernetes 1.XX introduces two new strategies for the Topology Manager:

### `most-allocated`: Workload Packing
Prefer NUMA nodes that are already most-utilized. This is useful for batch jobs
and other workloads that can share nodes.

### `least-allocated`: Workload Spreading
Prefer NUMA nodes that are least-utilized. This is useful for spreading load
across the system to avoid hotspots.

### Per-Resource Weighting
For more fine-grained control, the `numa-score-weights` option allows operators
to weight CPU, memory, and device allocation independently. This enables scenarios
like GPU-heavy workloads prioritizing GPUs over CPU.

## Configuration

The feature is controlled via `topologyManagerPolicyOptions` in the kubelet config:

### Example 1: Packing (Most-Allocated)

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
topologyManagerPolicy: "single-numa-node"
topologyManagerScope: "pod"
topologyManagerPolicyOptions:
  numa-allocation-strategy: "most-allocated"
```

### Example 2: Spreading (Least-Allocated)

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
topologyManagerPolicy: "restricted"
topologyManagerScope: "pod"
topologyManagerPolicyOptions:
  numa-allocation-strategy: "least-allocated"
```

### Example 3: GPU-Weighted Packing

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
topologyManagerPolicy: "single-numa-node"
topologyManagerScope: "pod"
topologyManagerPolicyOptions:
  numa-allocation-strategy: "most-allocated"
  numa-score-weights: "cpu=3,memory=1,nvidia.com/gpu=6"
```

In this example, GPUs are weighted 6x higher than CPU and 6x higher than memory,
so the scoring heavily favors NUMA nodes where GPUs are already allocated.

## How It Works

### Scoring

Each resource manager (CPU, memory, device) calculates a utilization score
for each NUMA node based on what's already allocated:

- **CPU**: `score = max(1, assignedCPUs * 100 / allocatableCPUs)`
- **Memory**: `score = max(1, assignedBytes * 100 / allocatableBytes)`  
- **Devices**: `score = max(1, allocatedDeviceCount * 100 / allocatableDeviceCount)`

### Aggregation

The Topology Manager combines these scores into a single aggregated score,
using the weights you specify in `numa-score-weights`. If no weights are
specified, CPU and memory get equal weight by default.

### Selection

When multiple NUMA nodes satisfy the topology constraints, the Topology Manager
uses the aggregated scores to select which node is preferred:

- **`most-allocated`**: Prefer the node with the highest score
- **`least-allocated`**: Prefer the node with the lowest score

## Use Cases

### Consolidate Batch Jobs
Configure `most-allocated` to consolidate batch jobs onto nodes that already
have workloads, freeing up empty nodes for latency-sensitive applications
that need larger allocations.

### Balance Database Workloads
Configure `least-allocated` to spread database replicas across under-utilized
nodes, reducing per-node load and thermal hotspots.

### Prioritize GPU Allocation
Use `numa-score-weights` to give GPUs higher weight, ensuring GPU-heavy ML
workloads pack together even if CPU utilization is uneven.

## Feature Status and Graduation

This feature is **alpha** in Kubernetes 1.XX and controlled by the feature gate
`TopologyManagerUtilizationAwareHints`.

**When the feature is disabled:**
- The `numa-allocation-strategy` and `numa-score-weights` options are ignored
- Topology Manager selection falls back to existing behavior (narrowest affinity,
  lowest node ID)
- No behavior change to existing workloads

**Graduation timeline:**
- **Alpha (1.XX)**: Basic feature, metric instrumentation for operator observability
- **Beta (1.XX+1)**: Production testing feedback, performance optimization
- **GA (1.XX+2)**: Stable, full support

## Backward Compatibility

The feature is fully backward compatible:

- Existing `topologyManagerPolicyOptions` continue to work unchanged
- If you don't set `numa-allocation-strategy` or `numa-score-weights`,
  behavior is identical to previous versions
- Existing pods remain unaffected
- You can enable or disable the feature at any time via kubelet restart

## Getting Started

To use NUMA utilization-aware allocation:

1. **Ensure your kubelet version is 1.XX or later**
2. **Enable the feature gate** by setting `TopologyManagerUtilizationAwareHints=true`
   in `kubelet` startup flags or config
3. **Configure your preferred strategy** in `topologyManagerPolicyOptions`
4. **Test with your workloads** to ensure the strategy matches your needs
5. **Monitor** the `kubelet_topology_manager_numa_score_selection_total` metric
   to confirm the feature is active

## Learn More

- [KEP-6007: NUMA Utilization-Aware Topology Manager Policies](https://github.com/kubernetes/enhancements/issues/6007)
- [Topology Manager Documentation](/docs/tasks/administer-cluster/topology-manager/)
- [Kubelet Configuration Reference](/docs/reference/config-api/kubelet-config.v1beta1/)

## What's Next?

We're planning further enhancements:

- **Beta phase**: Score-aware merge optimization for large NUMA systems (8+ nodes)
- **GA phase**: Extended metric instrumentation for cluster-wide observability

Feedback from production deployments will shape the future direction of this feature.