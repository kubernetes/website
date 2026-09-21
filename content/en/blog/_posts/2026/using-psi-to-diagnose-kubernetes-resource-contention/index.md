---
layout: blog
title: "Beyond CPU Utilization: Using PSI to Diagnose Kubernetes Resource Contention"
slug: using-psi-to-diagnose-kubernetes-resource-contention
draft: true
author: >
  Nitin Ware
---

Most Kubernetes performance investigations start the same way: check CPU and
memory. `kubectl top` tells you how much of each resource a workload consumes.
It doesn't tell you whether the workload is *waiting* for a resource it can't get.

That gap matters. A service can sit at 70% CPU and still miss its latency target
because runnable threads are queued behind a busy core. Utilization says the
resource is busy. It says nothing about who is stuck in line.

Linux Pressure Stall Information (PSI) measures the time workloads spend stalled
waiting for CPU, memory, or I/O. As of Kubernetes v1.36 these metrics are stable
and exposed at node, pod, and container scope. In this post we build a local
cluster, manufacture real CPU contention (several workloads fighting over too few
cores), and watch PSI respond. Then we apply the same technique to production.

One thing up front: PSI does not replace utilization, and there is no universal
"bad" pressure number. It answers a different question: *is contention making my
workload wait?*

## Utilization and pressure answer different questions

Two signals, two questions:

- **CPU utilization:** how much CPU are we consuming?
- **CPU pressure (PSI):** how much time are tasks losing while they wait to run?

Under load, a busy CPU is expected. High utilization on its own is not a problem.
The problem is runnable work sitting in the runqueue because every core is taken,
and that is exactly what PSI exposes and utilization hides.

A typical investigation opens with:

```shell
kubectl top nodes
kubectl top pods
```

Necessary, but incomplete. Pair the "how much" from `top` with the "how long are
we waiting" from PSI, and you can tell a saturated-but-healthy node apart from one
that is actively delaying work.

## How PSI looks in Kubernetes

Linux reports pressure for CPU, memory, and I/O as a set of moving averages plus a
running total:

```
# illustrative format, not a live reading
some avg10=0.00 avg60=0.00 avg300=0.00 total=<µs stalled since boot>
full avg10=0.00 avg60=0.00 avg300=0.00 total=<µs stalled since boot>
```

`some` counts time when at least one task was stalled on the resource. `full`
counts time when every non-idle task was stalled, a rarer and more severe signal.
The `avg10` window reacts within seconds, which makes it the one to watch while
you change something and wait for the effect.

Kubernetes surfaces this through the kubelet. The Summary API
(`.../stats/summary`) reports `cpu.psi`, `memory.psi`, and `io.psi` at node, pod,
and container scope, and the same data is available in Prometheus format at
`/metrics/cadvisor`. So you can start from a node-wide symptom and drill down to
the pod or container responsible.

## Hands-on: manufacturing real CPU contention

The shape of the experiment: start from a baseline, run one CPU-bound pod on a
two-CPU node, scale to three pods so roughly six workers compete for two CPUs,
watch node and pod PSI climb, then scale back and watch it fall.

{{< figure src="psi-demo-architecture.svg" caption="Architecture of the demo: a kind node pinned to two CPUs runs three pods of two CPU-bound workers each, so demand of roughly six runnable workers meets a capacity of two CPUs, producing runqueue contention and rising CPU PSI." alt="A Docker Desktop host runs a kind node pinned to two CPUs. Three pods each run two CPU-bound workers, so about six runnable workers compete for two CPUs, producing runqueue contention and rising CPU PSI." >}}

The important design choice is what we *don't* do: **no per-pod CPU limits.**

This is deliberately different from the CPU example in the upstream PSI docs, which
caps a container at `500m`. That version is a fine way to see PSI move, but the
pressure comes from cgroup quota throttling, where the container waits on its own
limit. Here we want the other, more production-like case: independent workloads
competing for a node's scarce CPU time. So we cap the *node* at two CPUs,
oversubscribe it, and leave the pods unconstrained.

### Prerequisites

Docker Desktop, kind, kubectl, and jq.

```shell
brew install kind kubectl jq
```

Give Docker enough headroom to run the cluster; the node is small but the workers
are deliberately busy.

### Create the cluster and confirm PSI is available

```shell
kind create cluster \
  --name psi-demo \
  --image kindest/node:v1.36.1
```

Confirm cgroup v2:

```shell
docker exec psi-demo-control-plane stat -fc %T /sys/fs/cgroup
# cgroup2fs
```

Confirm the kernel exposes PSI:

```shell
docker exec psi-demo-control-plane cat /proc/pressure/cpu
```

You should see `some` and `full` lines with `avg10`, `avg60`, `avg300`, and
`total`. If `/proc/pressure` is missing, the node kernel was not built with PSI
and the rest of the demo will not work.

### Make CPU scarce at the node level

This is the step that makes the demo contention rather than throttling. Pin the
kind node to two host CPUs:

```shell
docker update --cpuset-cpus="0,1" psi-demo-control-plane
docker exec psi-demo-control-plane nproc
# 2
```

### Baseline the node

```shell
NODE=$(kubectl get nodes -o jsonpath='{.items[0].metadata.name}')
kubectl get --raw "/api/v1/nodes/$NODE/proxy/stats/summary" | jq '.node.cpu.psi'
```

Record `some.avg10` and `some.avg60`. They will not be exactly zero, and that is
fine: on a single-node kind cluster the control plane runs on the node too, so it
carries a small, steady background pressure.

Baseline node PSI:

```json
{
  "full": { "total": 5208689, "avg10": 0, "avg60": 0.01, "avg300": 0 },
  "some": { "total": 16012613, "avg10": 2.67, "avg60": 2.6, "avg300": 2.13 }
}
```

Baseline node `some.avg10`: `2.67`

### Add one workload, with no CPU limit

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cpu-contenders
spec:
  replicas: 1
  selector:
    matchLabels:
      app: cpu-contenders
  template:
    metadata:
      labels:
        app: cpu-contenders
    spec:
      containers:
      - name: stress
        image: registry.k8s.io/e2e-test-images/agnhost:2.47
        args: ["stress", "--cpus", "2"]
```

```shell
kubectl apply -f cpu-contenders.yaml
kubectl rollout status deployment/cpu-contenders
```

Prove there is no limit doing the work. This is the whole point of the demo:

```shell
kubectl get pods -l app=cpu-contenders \
  -o jsonpath='{range .items[*]}{.metadata.name}{" cpu-limit="}{.spec.containers[0].resources.limits.cpu}{"\n"}{end}'
```

The limit field is empty. That one pod runs two CPU-bound workers on a two-CPU
node, so it already saturates both cores. On a single-node kind cluster the control
plane (apiserver, etcd, scheduler) runs on those same two CPUs, so even this single
pod produces steady, moderate pressure: clearly above the idle floor, well short of
the contention to come. Check the node again after about 15 seconds.

One-pod node `some.avg10`: `27.65`

### Watch pressure live

In a second terminal:

```shell
NODE=$(kubectl get nodes -o jsonpath='{.items[0].metadata.name}')
while true; do
  clear; date
  kubectl get --raw "/api/v1/nodes/$NODE/proxy/stats/summary" \
    | jq '{some_avg10: .node.cpu.psi.some.avg10,
           some_avg60: .node.cpu.psi.some.avg60,
           full_avg10: .node.cpu.psi.full.avg10}'
  sleep 2
done
```

### Create the contention

Back in the first terminal, scale to three pods. Roughly six CPU-hungry workers
now fight over two cores:

```shell
kubectl scale deployment cpu-contenders --replicas=3
```

Watch the second terminal. `some.avg10` climbs first because it is the fastest
window; `avg60` follows behind it. Cross-check against raw Linux PSI to confirm
the Summary API matches the kernel:

```shell
docker exec psi-demo-control-plane cat /proc/pressure/cpu
```

Node PSI under three-pod contention:

```json
{
  "some_avg10": 62.24,
  "some_avg60": 55.67,
  "full_avg10": 0
}
```

Three-pod node `some.avg10`: `62.24`, up from the `2.67` baseline and the `27.65`
one-pod reading. `full.avg10` stayed at `0`: at least one task was stalled most of
the time, but never every task at once, which is typical for CPU contention.

### Find out which pods are waiting

```shell
kubectl get --raw "/api/v1/nodes/$NODE/proxy/stats/summary" | jq '
  .pods[]
  | select(.podRef.name | startswith("cpu-contenders"))
  | {pod: .podRef.name,
     cpu_some_avg10: .cpu.psi.some.avg10,
     cpu_full_avg10: .cpu.psi.full.avg10}'
```

The same signal is available as a Prometheus counter, per container:

```shell
kubectl get --raw "/api/v1/nodes/$NODE/proxy/metrics/cadvisor" \
  | grep container_pressure_cpu_waiting_seconds_total | grep cpu-contenders
```

`container_pressure_cpu_waiting_seconds_total` is a cumulative counter; the rate
of increase, not the raw value, tracks contention over time.

### Relieve it and watch it decay

```shell
kubectl scale deployment cpu-contenders --replicas=1
```

`avg10` turns over first and falls; `avg60` and `avg300` trail behind by design.
That decay ordering is a practical tell in production. Recent pressure recovering
while the longer windows stay high means the problem eased only moments ago.

Node PSI during recovery:

```json
{
  "total": 389532588,
  "avg10": 27.46,
  "avg60": 46.97,
  "avg300": 42.8
}
```

Here `avg10` has already fallen back to the one-pod working level (~27) while
`avg60` and `avg300` still carry the contention peak: the fast window sees the
relief immediately, the slower windows are still catching up.

### What the run should show

A representative run (your numbers will differ by machine):

| Stage       | Pods (workers) | Node CPU some.avg10 | What happened                              |
|-------------|----------------|---------------------|--------------------------------------------|
| Baseline    | 0              | 2.67                | idle floor, control plane only             |
| One pod     | 1 (2)          | 27.65               | workers share two CPUs with the control plane |
| Contention  | 3 (~6)         | 62.24               | tasks queue for CPU                        |
| Recovery    | 1 (2)          | 24.69               | eases back to the one-pod level            |

The number is not the point. The *movement* is: pressure that rises when you add
competition and falls when you remove it. Notice too that recovery returns to the
one-pod working level, not to the idle floor, because a pod is still running. That
is the pattern to carry into production.

## Reading PSI in production

Turning PSI into a single global alert threshold is tempting and usually wrong.
Pressure that is normal for a batch node would be alarming on a latency-sensitive
API. Learn each service's normal pressure profile first, then alert on deviation
from it.

Line pressure up against the signals that describe user impact:

- request latency, especially the tail
- throughput and queue depth
- error rate
- CPU and memory utilization
- pod placement and node conditions

Scope tells you where to look. One container under pressure on an otherwise-quiet
node points at that container's own workload or configuration. Several pods under
pressure while node pressure rises points at the node: capacity, placement, or a
noisy neighbor.

PSI proves waiting, not cause. It tells you work is stalled on a resource; you
still confirm the stall lines up with the symptom, and you still verify the fix.

## A worked example: inference latency

Production contention rarely announces itself as cleanly as three pods on a
two-CPU node. Take an AI/ML inference service. A single request can touch CPU
preprocessing, tokenization, model execution, serialization, a sidecar or two, and
telemetry. When p99 latency creeps up at peak traffic and aggregate CPU still
looks "fine," the waiting is hiding somewhere in that chain.

Suppose p99 rises in lockstep with CPU `some.avg10`. That is a lead, not a verdict.
Compare container, pod, and node pressure to locate *where* tasks stall, then check
whether the timing matches the latency curve and the queue depth. From there the
usual suspects become testable one at a time: requests and limits, a co-scheduled
noisy neighbor, sidecar overhead, and node capacity.

The technique is not AI-specific. High-throughput APIs, databases, streaming
pipelines, and batch jobs all benefit from asking the same question when they slow
down.

## A workflow you can reuse

1. **Start from the symptom:** latency, throughput, queueing, or errors.
2. **Check utilization.** PSI adds to CPU and memory metrics; it does not replace them.
3. **Check pressure.** Look for CPU, memory, or I/O pressure that moved at the same time.
4. **Narrow the scope:** container, then pod, then node.
5. **Correlate** pressure with application metrics and workload events.
6. **Change one thing:** resources, placement, or concurrency.
7. **Measure again.** The fix worked only if both the pressure and the symptom moved.

## Takeaways

- Utilization tells you consumption; PSI tells you time lost waiting.
- You can read PSI at node, pod, and container scope and line it up with application metrics.
- A baseline and a before/after beat any single "good or bad" pressure number.
- When a workload slows down, PSI gives you one sharp question to ask: is it waiting on the resources it needs?

## Clean up

```shell
kubectl delete deployment cpu-contenders
# Remove the CPU-set restriction if you are keeping the cluster:
docker update --cpuset-cpus="" psi-demo-control-plane
# Or tear it all down:
kind delete cluster --name psi-demo
```

## Further reading

- [Understand Pressure Stall Information (PSI) Metrics](https://kubernetes.io/docs/reference/instrumentation/understand-psi-metrics/)
- [Kubernetes v1.36: PSI Metrics for Kubernetes Graduates to GA](https://kubernetes.io/blog/2026/05/12/kubernetes-v1-36-psi-metrics-ga/)
- [Node metrics data](https://kubernetes.io/docs/reference/instrumentation/node-metrics/)
