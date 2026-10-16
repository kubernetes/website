---
layout: blog
title: "Beyond CPU Utilization: Using PSI to Diagnose Kubernetes Resource Contention"
slug: using-psi-to-diagnose-kubernetes-resource-contention
draft: true
author: >
  [Nitin Ware](https://github.com/nitinware)
---

Working on latency-sensitive AI inference services, I've spent a lot of time
looking at request latency, resource utilization, and application-level metrics
to understand how workloads behave under load.

One question I've been interested in is whether CPU utilization alone gives us
enough information when investigating performance issues. A CPU can be busy, but
that doesn't tell us how long runnable tasks are waiting to get CPU time. I
wanted to understand whether there was a way to observe that waiting directly.

That's what drew me to Linux Pressure Stall Information (PSI). PSI measures
resource pressure by tracking time when tasks are stalled waiting for CPU,
memory, or I/O. It gives us another signal to examine alongside utilization
and application metrics. These metrics are
[stable from Kubernetes v1.36](/blog/2026/05/12/kubernetes-v1-36-psi-metrics-ga/).

To explore this, I set up a small Kubernetes cluster and deliberately created
CPU contention. I started with one pod, scaled to three pods competing for two
CPUs, and then scaled back to observe how PSI responded.

Here's what I found.

## Utilization and pressure answer different questions

When checking CPU usage in Kubernetes, I usually start with `kubectl top`:

```shell
kubectl top nodes
kubectl top pods
```

These commands show how much CPU and memory the nodes and pods are using.
That's useful, but it doesn't tell me whether runnable tasks are waiting for
CPU time.

For example, a node running at high CPU utilization isn't necessarily
experiencing a performance problem. But if several workloads are competing for
the same CPUs, some tasks may spend time waiting in the runqueue. CPU
utilization alone doesn't show how much waiting is happening.

That's where PSI adds useful information. CPU utilization tells me how much CPU
time is being consumed, while CPU PSI tells me how much time runnable tasks are
stalled waiting for CPU. Looking at both helps me understand whether resource
contention might be contributing to a performance issue.

## How PSI looks in Kubernetes

Linux exposes PSI metrics for CPU, memory, and I/O through files under
`/proc/pressure/`. Each file contains readings that look like this:

```text
# Illustrative format, not a live reading
some avg10=0.00 avg60=0.00 avg300=0.00 total=<microseconds>
full avg10=0.00 avg60=0.00 avg300=0.00 total=<microseconds>
```

There are two things to look at here. `some` tells us how much time at least one
task was stalled waiting for a resource. `full` tells us how much time all
non-idle tasks in the measured scope were stalled at the same time.

The `avg10`, `avg60`, and `avg300` values show pressure averaged over the last
10, 60, and 300 seconds. I find `avg10` particularly useful when experimenting
with workloads because it responds faster to changes. The `total` counter
records cumulative stall time in microseconds.

One detail worth knowing: CPU `full` is reported as zero in the system-wide
`/proc/pressure/cpu` file. CPU `full` can still be meaningful for individual
cgroups, so it's important to know which scope you're looking at.

Kubernetes makes these metrics available through the kubelet Summary API at
node, pod, and container scope. You can also inspect PSI-related counters
through the kubelet's `/metrics/cadvisor` endpoint.

This lets us start by checking whether a node is experiencing pressure and then
look at individual pods or containers to see which workloads are affected.

## Hands-on: manufacturing real CPU contention

I wanted to see how PSI behaves when several workloads compete for the same
CPUs, rather than when a container hits its configured CPU limit.

For this experiment, I used kind on a Colima Linux VM running on my Mac. I
restricted the Kubernetes node to two CPUs and ran a CPU-intensive workload
with two workers per pod.

I started by measuring CPU pressure without the workload, then deployed one
pod. After that, I scaled to three pods, giving us roughly six CPU-intensive
workers competing for two CPUs. Finally, I scaled back to one pod to see how
quickly the pressure dropped.

I deliberately left the pods without CPU limits. The
[Kubernetes PSI documentation](/docs/reference/instrumentation/understand-psi-metrics/)
already demonstrates pressure caused by CPU quota throttling. Here, I wanted
to observe contention between workloads sharing limited CPU capacity.

{{< figure src="psi-demo-architecture.svg" caption="Architecture of the demo: a kind node pinned to two CPUs runs three pods of two CPU-bound workers each, so demand of roughly six runnable workers meets a capacity of two CPUs, producing runqueue contention and rising CPU PSI." alt="A macOS host runs a Colima Linux VM containing a kind node pinned to two CPUs. Three pods each run two CPU-bound workers, so about six runnable workers compete for two CPUs, producing runqueue contention and rising CPU PSI." >}}

### Prerequisites

I ran this experiment on an Apple Silicon Mac using Colima, an open-source
alternative to Docker Desktop. Colima provides the Linux VM needed to run the
kind cluster.

For my setup, I allocated 4 vCPUs, 8 GiB of memory, and 40 GiB of disk space
to Colima. These are the resources I used, not minimum requirements.

The installation commands use Homebrew on macOS. If you don't have it
installed, follow the instructions at [brew.sh](https://brew.sh/) first.

```shell
brew install colima docker kind kubectl jq
```

Start Colima with the Docker runtime:

```shell
colima start --profile psi-demo --runtime docker --cpu 4 --memory 8 --disk 40
```

Colima runs its Linux VM in the background after startup completes. Select its
Docker context so that kind uses Colima instead of Docker Desktop:

```shell
docker context use colima-psi-demo
docker context show
# colima-psi-demo
```

Before creating the cluster, check that the Linux VM uses cgroup v2 and
exposes PSI:

```shell
colima ssh --profile psi-demo -- uname -r
colima ssh --profile psi-demo -- stat -fc %T /sys/fs/cgroup
colima ssh --profile psi-demo -- cat /proc/pressure/cpu
```

My VM reported Linux `6.8.0-117-generic`, `cgroup2fs`, and CPU PSI `some` and
`full` lines. If these checks fail, investigate the VM before proceeding.

### Create the cluster and confirm PSI is available

```shell
kind create cluster \
  --name psi-demo \
  --image kindest/node:v1.36.1 \
  --wait 120s
```

I used Kubernetes v1.36.1, which includes PSI metrics that graduated to GA
in v1.36.

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

The Colima VM has four vCPUs, but I wanted the workloads to compete for just
two. To do that, I restricted the kind node to CPUs `0` and `1`:

```shell
docker update --cpuset-cpus="0,1" psi-demo-control-plane

docker inspect psi-demo-control-plane --format '{{.HostConfig.CpusetCpus}}'
# 0,1

docker exec psi-demo-control-plane grep Cpus_allowed_list /proc/self/status
# Cpus_allowed_list: 0-1

docker exec psi-demo-control-plane nproc
# 2
```

This restricts where the node's workloads can run without applying CPU quotas
to individual pods. I wanted to observe workloads competing for CPU time, not
waiting because they reached a configured CPU limit.

### Baseline the node

Before starting the stress workload, I checked node CPU pressure through the
kubelet Summary API:

```shell
NODE=$(kubectl get nodes -o jsonpath='{.items[0].metadata.name}')
kubectl get --raw "/api/v1/nodes/$NODE/proxy/stats/summary" | jq '.node.cpu.psi'
```

After letting the cluster settle for about 60 seconds, I captured the
baseline. The control plane and other system components were already running,
so I didn't expect pressure to be exactly zero.

Baseline node PSI:

```json
{
  "full": { "total": 24295834, "avg10": 0.57, "avg60": 0.83, "avg300": 0.82 },
  "some": { "total": 41013378, "avg10": 3.37, "avg60": 3.37, "avg300": 2.03 }
}
```

The node's CPU `some.avg10` was **3.37%** before I deployed any stress pods.
I'll use this reading as the starting point for the workload comparisons.

### Add one workload, with no CPU limit

I started with a single pod running two CPU-intensive workers. Since the kind
node is restricted to two CPUs, I expected the workers to keep those CPUs busy.

I saved this Deployment as `cpu-contenders.yaml`:

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

I also checked that the pod had no CPU limit:

```shell
kubectl get pods -l app=cpu-contenders \
  -o jsonpath='{range .items[*]}{.metadata.name}{" cpu-limit="}{.spec.containers[0].resources.limits.cpu}{"\n"}{end}'
```

Expected output from this run (the pod suffix will vary):

```text
cpu-contenders-86cf68d888-ct765 cpu-limit=
```

After the workload had been running, I checked the node's CPU PSI again.
The `some.avg10` reading was **27.30%**, compared with **3.37%** at baseline.

That was already a noticeable increase with just one pod. The stress workers
weren't the only processes using CPU; the Kubernetes control plane and other
system components were sharing those same two CPUs. The pod's own
`some.avg10` was **24.72%**.

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

Back in the first terminal, I increased the Deployment from one pod to three.
Each pod runs two CPU-intensive workers, so roughly six workers were now
competing for the same two CPUs:

```shell
kubectl scale deployment cpu-contenders --replicas=3
kubectl rollout status deployment/cpu-contenders
```

I watched `some.avg10` rise first, while `avg60` followed more slowly. I also
compared the kubelet Summary API with raw Linux PSI. They report different
scopes, so I compared their CPU `some` trends rather than treating their values
as interchangeable:

```shell
docker exec psi-demo-control-plane cat /proc/pressure/cpu
```

The captured kubelet Summary API sample during three-pod contention
reported these values:

```json
{
  "some_avg10": 68.93,
  "some_avg60": 55.27,
  "full_avg10": 0
}
```

The node's `some.avg10` climbed from **27.30%** with one pod to **68.93%**
with three, without changing CPU allocation or adding pod CPU limits.

The kubelet node `full.avg10` was `0` in this sample, while per-pod `full`
values were nonzero. System-wide CPU `full` in `/proc/pressure/cpu` is
reported as zero for compatibility; it cannot validate cgroup-scoped CPU
`full` measurements.

### Find out which pods are waiting

```shell
kubectl get --raw "/api/v1/nodes/$NODE/proxy/stats/summary" | jq -r '
  .pods[]
  | select(.podRef.name | startswith("cpu-contenders"))
  | "\(.podRef.name)  \(.cpu.psi.some.avg10)"'
```

For the three pods in this run, the `some.avg10` readings were:

```text
cpu-contenders-86cf68d888-4fxvt  43.5
cpu-contenders-86cf68d888-ct765  62.12
cpu-contenders-86cf68d888-wwmgs  58.68
```

The same signal is available as a Prometheus counter, per container:

```shell
kubectl get --raw "/api/v1/nodes/$NODE/proxy/metrics/cadvisor" \
  | grep container_pressure_cpu_waiting_seconds_total | grep cpu-contenders
```

`container_pressure_cpu_waiting_seconds_total` is a cumulative counter; the
rate of increase, not the raw value, tracks contention over time. For the
`ct765` stress container, the counter increased from `109.253952` to
`128.250746` seconds over `30.803` seconds:

```text
(128.250746 - 109.253952) / 30.803 = 0.617
```

That is about 61.7% of the measured interval, compared with the pod's
`some.avg10` of 62.12%. These use different observation windows, so they are
not expected to be identical.

### Relieve it and watch it decay

```shell
kubectl scale deployment cpu-contenders --replicas=1
```

I wanted to see how quickly PSI would reflect the reduced contention. About
15 seconds into recovery, the shorter `avg10` window had already dropped near
the earlier one-pod level, while the longer averages still included more of the
three-pod contention period.

Node PSI about 15 seconds into recovery:

```json
{
  "full": {
    "total": 47584317,
    "avg10": 3.62,
    "avg60": 1.31,
    "avg300": 0.83
  },
  "some": {
    "total": 483065990,
    "avg10": 28.07,
    "avg60": 53.44,
    "avg300": 55.34
  }
}
```

The `some.avg10` value was **28.07%**, close to the earlier one-pod reading
of **27.30%**. But `avg60` and `avg300` remained elevated. By the later
recovery measurement, `avg10` had fallen further to **24.29%**.

The shorter and longer averages captured different parts of the recovery.
Pressure didn't return to the idle baseline: one CPU-intensive pod was still
running.

### What the run showed

Here's how node CPU pressure changed as I added and removed workloads. The
values are the final `some.avg10` sample for each stage; your numbers will
differ:

| Stage       | Pods (workers) | Node CPU some.avg10 | What happened                              |
|-------------|----------------|---------------------|--------------------------------------------|
| Baseline    | 0              | 3.37                | idle floor, control plane only             |
| One pod     | 1 (2)          | 27.30               | workers share two CPUs with the control plane |
| Contention  | 3 (~6)         | 68.93               | tasks queue for CPU                        |
| Recovery    | 1 (2)          | 24.29               | eases back to the one-pod level            |

{{< figure src="psi-four-stage-results.svg" caption="Node CPU PSI some.avg10 during the Colima run: baseline 3.37%, one pod 27.30%, three pods 68.93%, and recovery 24.29%. Recovery leaves one CPU-bound pod running." alt="Bar chart showing node CPU PSI some avg10 rising from 3.37% at baseline to 27.30% with one pod and 68.93% with three pods, then falling to 24.29% after scaling back to one pod." >}}

The biggest change came when I scaled from one pod to three. CPU pressure
rose from 27.30% to 68.93%, even though the available CPU capacity hadn't
changed. After scaling back to one pod, it fell to 24.29%.

## Reading PSI in production

In production, I'd start with the symptom: request latency, throughput, errors,
or queue depth. I'd compare the timing of that change with CPU utilization and
PSI, rather than treating any one metric as a diagnosis. A pressure level that
is normal for a batch workload might be a concern for a latency-sensitive API,
so the workload's own baseline matters more than a universal threshold.

Scope helps narrow the investigation. If one container shows pressure while
node pressure stays low, I'd check that container's workload and resource
configuration. If several pods and the node show pressure together, I'd look
at shared CPU capacity, placement, and competing workloads. Those are clues
about where tasks are waiting, not proof of what's causing an application
slowdown.

This is relevant to the latency-sensitive inference systems I work on. An
inference request may involve preprocessing and calls to a model or other
services. When latency increases, I'd first check request metrics and traces
to see where time is being spent. If the delay appears to be within the
service, CPU PSI could help test whether runnable work is waiting for CPU;
if the time is in a downstream call, I'd investigate that dependency instead.

After changing capacity, placement, or concurrency, I'd check whether both
pressure and the application symptom improved. The Colima experiment made the
reason for that comparison concrete: adding competing pods raised measured
CPU waiting, and removing them brought it back toward the one-pod level.

## Clean up

```shell
kubectl delete deployment cpu-contenders
# Remove the CPU-set restriction if you are keeping the cluster:
docker update --cpuset-cpus="" psi-demo-control-plane
# Or tear it all down:
kind delete cluster --name psi-demo
# Optional: stop the Colima VM
colima stop --profile psi-demo
```
