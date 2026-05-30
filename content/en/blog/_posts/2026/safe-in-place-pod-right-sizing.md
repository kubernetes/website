---
layout: blog
title: "Safe In-Place Pod Right-Sizing in Kubernetes 1.33+"
draft: true
slug: safe-in-place-pod-right-sizing
author: >
  [Sebastien Tardif](https://github.com/SebTardif)
---

With in-place pod resize now GA in Kubernetes 1.35, the ecosystem has a
powerful new primitive for adjusting container resources without eviction.
But the API is just the mechanism. This post covers the patterns needed
to use it safely in production: graduated rollout, multi-signal auto-revert,
HPA coexistence, confidence-based recommendations, and change filtering.

<!--more-->

## The waste problem

According to CAST AI's 2025 Kubernetes cost report, clusters in their
dataset averaged roughly 8% CPU utilization. While that number reflects
their customer base rather than every cluster in existence, the
directional signal is consistent across vendors: the vast majority of
provisioned compute sits idle. CAST AI found 99.94% of clusters
overprovisioned, with 83% of container costs going to idle resources.
Industry estimates put the resulting cloud infrastructure waste at
$44.5 billion annually.

The root cause is not laziness. It is rational fear. Setting a CPU
request to 2 cores when you only use 400 millicores is the rational
choice when the alternative is getting OOM-killed at 3 AM. Developers
over-provision because under-provisioning has immediate, painful
consequences, while over-provisioning only has a slow, invisible cost.

Kubernetes has had the Vertical Pod Autoscaler (VPA) since 2018, yet
VPA in fully automated mode remains far less common than HPA in
production environments. Why?

## Why VPA adoption stalled

VPA's approach to right-sizing has three fundamental problems that have
kept it out of production for most teams:

**Problem 1: Eviction-based updates.** VPA changes pod resources by
evicting the pod and letting the controller recreate it with new values.
This means downtime, rescheduling, cold cache starts, and connection
interruptions. For stateful workloads, single-replica services, or
anything with a slow startup, this is unacceptable.

**Problem 2: HPA conflicts.** VPA and HPA fight over the same axis.
When VPA lowers CPU requests, utilization percentage jumps, triggering
HPA to scale out. More replicas lower utilization again, so VPA lowers
requests further. This feedback loop destabilizes workloads. The
official Kubernetes documentation warns against using VPA with HPA on
CPU or memory metrics.

**Problem 3: Opaque recommendations.** VPA relies on a histogram-based
historical usage model whose decision process can be difficult for
operators to inspect or explain. While several parameters are
configurable, understanding why VPA chose a specific value for a
specific workload requires digging into internal state that most
teams never see. When a recommendation is surprising, there is no
straightforward way to audit the reasoning.

These are not implementation bugs. They are architectural constraints
that stem from VPA being designed before in-place resize existed.

## In-place pod resize changes everything

Kubernetes 1.27 introduced in-place pod resize as an alpha feature.
In 1.33, it graduated to beta and became enabled by default. In 1.35,
it reached GA. This is one of the most significant changes to
Kubernetes resource management since the platform was created.

The `/resize` subresource on the Pod API lets you change a container's
CPU and memory requests and limits while the container is running.
No eviction. No rescheduling. No cold starts. The kubelet applies
the new values directly, and the container continues running without
interruption.

```yaml
# Container resize policy in the pod spec
containers:
  - name: app
    resources:
      requests:
        cpu: "500m"
        memory: "256Mi"
    resizePolicy:
      - resourceName: cpu
        restartPolicy: NotRequired
      - resourceName: memory
        restartPolicy: NotRequired
```

CPU changes with `restartPolicy: NotRequired` are typically applied
in-place by adjusting cgroup limits. Memory changes are more nuanced:
while in-place memory resize is supported, the Kubernetes documentation
notes that `RestartContainer` is often appropriate for memory depending
on runtime constraints. Operators should choose the resize policy per
resource based on their workload's characteristics.

Either way, this is a fundamental shift. Continuous, fine-grained
resource adjustment is now practical in production without pod eviction.

But the API is just the mechanism. The hard problems are: how do you
decide what the right values are, how do you roll out changes safely,
and how do you coexist with HPA?

## Patterns for safe in-place right-sizing

Building a safe right-sizing operator on top of the `/resize` subresource
requires solving several problems that the raw API does not address.
These patterns apply to any operator leveraging in-place resize.

### Pattern 1: Graduated rollout

The first rule of production resource changes is: do not change
everything at once. A graduated rollout model lets teams build
confidence incrementally.

A practical graduation model has five stages:

1. **Observe**: Collect metrics silently. No recommendations, no
   changes. This validates that the metrics pipeline is working.
2. **Recommend**: Compute and surface recommendations, but do not
   apply them. Teams review what would change.
3. **One-shot**: Apply the recommendation to one pod per cycle and
   stop. Validates the resize mechanism on a single instance.
4. **Canary**: Resize a percentage of pods (e.g., 10%), observe for
   a configurable window, and only promote to the full fleet if safety
   checks pass.
5. **Auto**: Continuously resize all eligible pods each reconciliation
   cycle.

This mirrors how organizations adopt any infrastructure change:
read-only first, then single instance, then canary, then full rollout.
Each stage can run for days or weeks before progressing.

### Pattern 2: Multi-signal safety with auto-revert

In-place resize is non-disruptive going forward, but a bad resize can
still cause problems. A right-sizing operator needs to detect failures
and revert automatically, also in-place.

The critical signals to monitor after a resize:

- **OOM kills**: If the container is OOM-killed after a memory decrease,
  revert immediately. Check `lastState.terminated.reason == "OOMKilled"`
  with a timestamp after the resize.
- **CPU throttling**: Query `rate(container_cpu_throttled_periods_total[5m])
  / rate(container_cpu_cfs_periods_total[5m])`. If throttling exceeds a
  threshold (e.g., 50%), the workload may be CPU-constrained and warrants
  investigation of limits, requests, and observed demand. Note that
  throttling is driven by CPU limits, not requests directly, so this
  signal must be interpreted in context. Add a grace period after resize
  because rate windows include pre-resize data.
- **Restart spikes**: If `restartCount` jumps by more than a threshold
  after resize, something went wrong.
- **Pod readiness**: If the pod transitions to NotReady after resize,
  revert.
- **Application SLOs**: Custom PromQL queries against application-level
  metrics (latency percentiles, error rates) provide the strongest
  signal. If p99 latency exceeds an SLO after resize, the resources
  are insufficient regardless of what the infrastructure metrics say.

Reverts should use the same `/resize` subresource, not eviction. This
means recovery is also non-disruptive. When a workload reverts
repeatedly, exponential backoff prevents the operator from retrying
every cycle.

### Pattern 3: HPA coexistence

The VPA-HPA conflict is not inherent to vertical scaling. It is
inherent to changing requests without adjusting HPA's targets.

When a right-sizing operator lowers a pod's CPU request from 500m to
300m, the CPU utilization percentage (calculated as usage/request)
jumps even though absolute usage has not changed. HPA sees 80%
utilization instead of 48% and scales out.

One strategy for preserving equivalent absolute CPU thresholds is to
recalculate HPA's utilization target proportionally after a resize:

```
newTarget = originalTarget * (oldRequest / newRequest)
```

If the original HPA target was 70% and requests dropped from 500m to
300m, the new target becomes `70% * (500/300) = 116%`, capped at 100%.
This preserves the same absolute CPU threshold (350m of actual usage)
while letting HPA continue to function correctly.

This approach has caveats. The adjusted target may exceed 100% and
require capping. HPA stabilization windows add complexity. Custom
metrics HPAs do not fit this model. And progressive resizes can
introduce drift if the original target is not stored before the first
adjustment. Despite these limitations, the pattern provides a
practical starting point for percentage-based CPU utilization HPAs,
which remain the most common configuration.

### Pattern 4: Confidence-based recommendations

A right-sizing recommendation based on 2 hours of data should be
more conservative than one based on 7 days. The recommendation
pipeline should include a confidence dimension.

A confidence score combines time coverage and data density:

```
timeComponent = days of data collected
dataComponent = sqrt(dataPoints / 24)
confidence = clamp(min(timeComponent, dataComponent) / 7, 0, 1)
```

At low confidence, apply a buffer that adds headroom. At full
confidence, the buffer shrinks to zero:

```
confidenceFactor = 1 + multiplier * (1 - confidence)^exponent
```

With the defaults of multiplier=1.0 and exponent=2.0, a workload with
minimal data gets an 80% safety buffer, while a workload with a full
week of metrics gets none. This prevents aggressive right-sizing of
newly deployed or recently changed workloads.

### Pattern 5: Change filtering to prevent thrashing

Without dampening, a right-sizing operator can oscillate between
values each cycle. Two filters are essential:

- **Minimum change threshold**: Suppress changes below a percentage
  (e.g., 10%) of the current value. If the recommendation is 460m
  and the current request is 500m, the 8% difference is noise.
- **Maximum change cap**: Limit each resize to a percentage of the
  current value (e.g., 50% for CPU). This forces gradual convergence
  over multiple cycles instead of a single large jump.

Directional caps add further control. You might allow 50% increases
(to recover from under-provisioning quickly) but only 30% decreases
(to avoid sudden resource drops).

## Time-of-day awareness and burst detection

Workload patterns vary throughout the day. A batch processing service
might use 2 cores during nightly ETL jobs and 200 millicores during
the day. A simple percentile over the full dataset would either
over-provision for daytime or under-provision for the batch window.

Bucketing metrics into 24 hourly windows and taking the maximum
percentile across all hours ensures the recommendation covers the
peak hour without over-provisioning for the rest of the day.

Burst detection adds another layer. If the maximum observed usage
exceeds 3x the 95th percentile, the workload exhibits bursty behavior.
A logarithmic boost based on burst magnitude adds proportional
headroom:

```
burstFactor = 1 + sensitivity * log2(max / p95)
```

A 4x burst magnitude adds 20% headroom. An 8x burst adds 30%. The
logarithmic curve prevents extreme bursts from inflating recommendations
excessively.

## Implementation: Attune

[Attune](https://github.com/attune-io/attune) is an open-source
Kubernetes operator (Apache 2.0) that implements all of the patterns
described above. It requires Kubernetes 1.32+ and queries Prometheus
(including Thanos, VictoriaMetrics, and Grafana Mimir), Datadog,
or Amazon CloudWatch Container Insights for usage data.

Attune uses two CRDs: `AttunePolicy` for per-workload configuration
and `AttuneDefaults` for cluster-wide defaults. A minimal policy
in recommend mode:

```yaml
apiVersion: attune.io/v1alpha1
kind: AttunePolicy
metadata:
  name: api-server
spec:
  targetRef:
    kind: Deployment
    name: api-server
  metricsSource:
    prometheus:
      address: http://prometheus.monitoring:9090
  updateStrategy:
    type: Recommend
```

The `kubectl attune` plugin provides an `explain` command that shows
the full recommendation pipeline with intermediate values at each
stage, making the recommendation process fully transparent:

```
$ kubectl attune explain -n production api-server
Container: app
  Percentile (p95):     200m CPU,  800Mi memory
  + Overhead (20%/30%): 240m CPU, 1040Mi memory
  + Confidence (0.92):  253m CPU, 1097Mi memory
  + Burst (1.0x):       253m CPU, 1097Mi memory
  Bounds [1m-4000m]:    253m CPU, 1097Mi memory
  Change filter:        253m CPU, 1097Mi memory (current: 2000m/4Gi)
  Estimated savings:    $37.42/month
```

Attune supports all six workload types (Deployment, StatefulSet,
DaemonSet, CronJob, Job, ReplicaSet) and exposes 21 Prometheus
metrics for operational visibility, including resize counters, revert
reasons, recommendation values, confidence scores, and estimated
cost savings.

## The path forward

In-place pod resize removes the last architectural barrier to
automated vertical scaling in Kubernetes. The patterns described
here, graduated rollout, multi-signal safety, HPA coexistence,
confidence-based recommendations, and change filtering, represent
what the community has learned from years of VPA's limitations.

The ecosystem is still early. As more operators adopt the `/resize`
subresource, we will collectively discover new patterns for safe
resource management. Whether you build your own controller or adopt
an existing one, the principles are the same: be conservative with
little data, use canary rollouts, monitor application-level SLOs,
and always have an automatic revert path.

The waste problem is solvable. The API is there. These patterns build
on lessons learned from VPA and early adopters of in-place resize, and
they have shown promise in early deployments. What remains is broader
adoption.
