---
layout: blog
title: "Beyond CPU Utilization: Using PSI to Diagnose Kubernetes Resource Contention"
slug: using-psi-to-diagnose-kubernetes-resource-contention
draft: true
author: >
  [Nitin Ware](https://github.com/nitinware)
---

I work on latency-sensitive AI inference services, where understanding why
requests slow down matters. CPU utilization is one of the first things I check
when investigating performance issues. But it doesn't tell me whether workloads
are waiting for CPU time.

That distinction made me interested in Linux Pressure Stall Information (PSI).
A node can be fully utilized with two tasks running on two CPUs, or with six
tasks competing for those same CPUs. CPU utilization looks similar in both
cases, but the amount of waiting can be very different.

PSI measures that waiting. Kubernetes exposes PSI through the kubelet, and the
metrics are
[stable from Kubernetes v1.36](/blog/2026/05/12/kubernetes-v1-36-psi-metrics-ga/).

I wanted to see the difference for myself, so I ran the same workload in two
configurations on a Kubernetes node restricted to two CPUs. In both runs,
`kubectl top` showed the node using 2001m of CPU, meaning both CPUs were fully
busy. But CPU pressure was 0.33% in the first run and 99.63% in the second.

## What CPU pressure means

CPU PSI measures how much of the time at least one task was ready to run but
waiting for CPU. This is reported as `some`. An `avg10` of 25% means that, over
roughly the last 10 seconds, at least one task was waiting about a quarter of
the time.

The kernel reports `some` as averages over the last 10, 60, and 300 seconds
(`avg10`, `avg60`, `avg300`). I use `avg10`, because it reacts quickly when the
workload changes. PSI also reports `full`, the share of time when all tasks
were waiting at once; I don't use it here.

The kubelet Summary API shows CPU usage and PSI together, for the node and for
each pod and container:

```shell
kubectl get --raw "/api/v1/nodes/<node-name>/proxy/stats/summary" \
  | jq '{cores: (.node.cpu.usageNanoCores / 1e9), psi: .node.cpu.psi}'
```

Per-pod values are under `.pods[].cpu.psi`. If you use Prometheus, the
kubelet's `/metrics/cadvisor` endpoint has the same signal per container, as
`container_pressure_cpu_waiting_seconds_total`.

## Same utilization, different pressure

For the test, I used a kind cluster on a machine with four CPUs. I gave the
worker node two of them and put the control plane on the other two, so the
control plane didn't compete with the test workload. The workload is a small
pod that runs busy loops. Each loop keeps one CPU fully busy whenever it gets
one. The [appendix](#appendix-reproducing-the-runs) has the full setup.

In each run, I waited 60 seconds for things to settle, then read the node's CPU
pressure 12 times, 10 seconds apart. The numbers below are the average of those
12 readings.

**Run A: one pod, two loops.** Two loops on two CPUs, so each loop has a CPU to
itself.

```console
$ kubectl top nodes
NAME                     CPU(cores)   CPU(%)   MEMORY(bytes)   MEMORY(%)
psi-demo-control-plane   53m          1%       593Mi           7%
psi-demo-worker          2001m        50%      166Mi           2%
```

The worker is using 2001m, so both of its CPUs are fully busy. CPU pressure was
**0.33%**. The loops almost never had to wait.

**Run B: three pods, six loops.** Six loops now compete for the same two CPUs.
Only two can run at once, so the others have to wait.

```console
$ kubectl top nodes
NAME                     CPU(cores)   CPU(%)   MEMORY(bytes)   MEMORY(%)
psi-demo-control-plane   43m          1%       602Mi           7%
psi-demo-worker          2001m        50%      183Mi           2%
```

CPU usage is unchanged at 2001m. But CPU pressure was **99.63%**: almost all
the time, some loop was waiting for a CPU.

Both runs show `CPU(%)` as 50% because Kubernetes counts all four of the
machine's CPUs as the node's capacity; it doesn't know about the two-CPU
restriction.

{{< figure src="psi-utilization-vs-pressure.svg" caption="Runs A and B use the same 2 cores on the worker node, but CPU pressure goes from under 1% to 99.6%. Run C uses a quarter of the node and still shows 75.2% pressure." alt="Two bar charts. Left, CPU used in cores: run A 2.00, run B 2.00, run C 0.51, against a node capacity of 2 CPUs. Right, CPU pressure some avg10: run A under 1%, run B 99.6%, run C 75.2%." >}}

Looking at CPU usage for the individual pods showed another part of the
problem:

```console
$ kubectl top pods
NAME                        CPU(cores)   MEMORY(bytes)
spinners-849c6d64c8-g2s9x   616m         0Mi
spinners-849c6d64c8-ggtqh   667m         0Mi
spinners-849c6d64c8-q9bvj   708m         0Mi
```

In run A, the one pod used 1991m. In run B, each pod uses only 616m to 708m,
even though each still runs two busy loops. The lower numbers don't mean the
pods need less CPU. They're sharing two CPUs. Nothing in `kubectl top` shows the
waiting, but pod-level PSI does: the three pods' CPU pressure was 69%, 99.73%,
and 99.79% in the last reading.

## Low utilization, high pressure

I also tested what happens when a workload has a CPU limit and the node has
spare capacity. For **run C**, I went back to one pod with two loops and set its
CPU limit to 500m.

```console
$ kubectl top nodes
NAME                     CPU(cores)   CPU(%)   MEMORY(bytes)   MEMORY(%)
psi-demo-control-plane   55m          1%       608Mi           7%
psi-demo-worker          517m         12%      168Mi           2%
```

The worker used about 0.51 of its two CPUs, leaving three quarters idle;
`kubectl top` shows 12% because Kubernetes counts four CPUs of capacity. Even
so, the node's `some.avg10` averaged **75.23%**. The 500m limit capped the pod's
CPU usage even though the worker had spare capacity. The two loops used up
their CPU quota and were throttled. The container's throttling counter shows
it was throttled in 1905 CFS periods since it started:

```text
container_cpu_cfs_throttled_periods_total{container="spin",...}  1905
```

The [PSI documentation](/docs/reference/instrumentation/understand-psi-metrics/)
uses a CPU-limited pod as its example. Here, the throttling counter points to
the pod's limit rather than competition with other workloads, so adding node
capacity wouldn't reduce this pressure while the pod's CPU limit stays at 500m.

## Using PSI during an investigation

The three runs show why I'd look at CPU pressure alongside utilization when
investigating a performance problem:

- High utilization, low pressure (run A): the CPUs are busy, but the work fits.
  Utilization alone isn't a problem.
- High utilization, high pressure (run B): there's more runnable work than CPU.
  Look at what else is scheduled on the node, at CPU requests, and at placement.
- Pressure on a pod with spare CPU on the node (run C): the pod is probably
  held back by its own CPU limit. Check the throttling counters.

I wouldn't pick a universal PSI threshold. A level that's normal for a batch
job could be a problem for a latency-sensitive API, so I'd compare pressure
against the workload's own baseline and check whether it rose with latency or
queue depth.

For the inference services I work on, latency can increase for different
reasons: more processing within the service, waiting for CPU, or a slow call to
another service.

These experiments helped me understand what PSI adds. If I saw latency
increasing without a clear explanation from CPU utilization, I'd check
pod-level CPU pressure to see whether contention or throttling might be
contributing. I'd compare that with application metrics and traces before
drawing a conclusion.

## Appendix: reproducing the runs

I ran this on kind v0.33.0 with Kubernetes v1.36.1, the release in which PSI
metrics became stable.

**Requirements:** a Linux host with cgroup v2, a kernel with PSI enabled,
Docker, kind, kubectl, and jq, with at least 4 CPUs. Check cgroup v2 and PSI on
the host:

```shell
stat -fc %T /sys/fs/cgroup     # expect: cgroup2fs
cat /proc/pressure/cpu         # expect: some and full lines
```

On macOS, I used [Colima](https://github.com/abiosoft/colima), an open source
tool that runs Docker Engine in a Linux VM (installable with Homebrew):
`colima start --profile psi-demo --runtime docker --cpu 4 --memory 8`, then run
the two checks inside the VM with `colima ssh --profile psi-demo -- <command>`.

**Create a two-node cluster** with this `kind-config.yaml`:

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
- role: worker
```

```shell
kind create cluster --name psi-demo --image kindest/node:v1.36.1 \
  --config kind-config.yaml --wait 180s
```

**Pin the nodes to separate CPUs.** Each kind node is a Docker container, so
Docker can restrict which CPUs it runs on:

```shell
docker update --cpuset-cpus="0,1" psi-demo-control-plane
docker update --cpuset-cpus="2,3" psi-demo-worker
docker exec psi-demo-worker nproc     # expect: 2
```

Because the kind worker is a container, its node-level PSI comes from that
container's cgroup rather than from the host's `/proc/pressure/cpu`. That's why
node-level CPU `full` can be nonzero here; the system-wide CPU `full` line in
`/proc/pressure/cpu` is always zero.

**Install metrics-server** for `kubectl top`. The `--kubelet-insecure-tls`
flag is needed because kind's kubelet serving certificates are self-signed;
don't use it outside a local test cluster.

```shell
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/download/v0.8.0/components.yaml
kubectl -n kube-system patch deployment metrics-server --type=json \
  -p '[{"op":"add","path":"/spec/template/spec/containers/0/args/-","value":"--kubelet-insecure-tls"}]'
kubectl -n kube-system rollout status deployment/metrics-server
```

**The workload**, `spinners.yaml`. Each pod starts `WORKERS` busy loops on the
worker node:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: spinners
spec:
  replicas: 1
  selector:
    matchLabels:
      app: spinners
  template:
    metadata:
      labels:
        app: spinners
    spec:
      nodeSelector:
        kubernetes.io/hostname: psi-demo-worker
      containers:
      - name: spin
        image: busybox:1.36
        env:
        - name: WORKERS
          value: "2"
        command: ["sh", "-c", "for i in $(seq $WORKERS); do (while :; do :; done) & done; wait"]
```

**Run the three cases.** After each change, wait for the rollout to finish,
then about 60 seconds more, before reading `kubectl top` and the Summary API
command from earlier, using `psi-demo-worker` as the node name.

```shell
# Run A: 2 loops on 2 CPUs
kubectl apply -f spinners.yaml
kubectl rollout status deployment/spinners

# Run B: 6 loops on 2 CPUs
kubectl scale deployment spinners --replicas=3
kubectl rollout status deployment/spinners

# Run C: 2 loops with a 500m limit. Scale to zero and wait 5 minutes first,
# so avg10 and avg60 are back near zero after run B.
kubectl scale deployment spinners --replicas=0
sleep 300
kubectl set resources deployment spinners --limits=cpu=500m
kubectl scale deployment spinners --replicas=1
kubectl rollout status deployment/spinners
```

To get the averaged pressure for a run:

```shell
for i in $(seq 12); do
  kubectl get --raw /api/v1/nodes/psi-demo-worker/proxy/stats/summary \
    | jq '.node.cpu.psi.some.avg10'
  sleep 10
done | jq -s 'add / length'
```

This prints the mean of 12 `some.avg10` readings taken about 10 seconds apart,
the method used for the results above.

For run C, read the throttling counters with:

```shell
kubectl get --raw /api/v1/nodes/psi-demo-worker/proxy/metrics/cadvisor \
  | grep -E 'container_cpu_cfs_throttled_(periods|seconds)_total' | grep 'container="spin"'
```

**Clean up:**

```shell
kind delete cluster --name psi-demo
colima stop --profile psi-demo     # macOS only
```
