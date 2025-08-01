---
title: Node metrics data
content_type: reference
weight: 50
description: >-
  Mechanisms for accessing metrics at node, volume, pod and container level,
  as seen by the kubelet.
---

The [kubelet](/docs/reference/command-line-tools-reference/kubelet/)
gathers metric statistics at the node, volume, pod and container level,
and emits this information in the
[Summary API](/docs/reference/config-api/kubelet-stats.v1alpha1/).

You can send a proxied request to the stats summary API via the
Kubernetes API server.

Here is an example of a Summary API request for a node named `minikube`:

```shell
kubectl get --raw "/api/v1/nodes/minikube/proxy/stats/summary"
```

Here is the same API call using `curl`:

```shell
# You need to run "kubectl proxy" first
# Change 8080 to the port that "kubectl proxy" assigns
curl http://localhost:8080/api/v1/nodes/minikube/proxy/stats/summary
```

{{< note >}}
Beginning with `metrics-server` 0.6.x, `metrics-server` queries the `/metrics/resource`
kubelet endpoint, and not `/stats/summary`.
{{< /note >}}

## Summary metrics API source {#summary-api-source}

By default, Kubernetes fetches node summary metrics data using an embedded
[cAdvisor](https://github.com/google/cadvisor) that runs within the kubelet. If you 
enable the `PodAndContainerStatsFromCRI` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) 
in your cluster, and you use a container runtime that supports statistics access via
{{< glossary_tooltip term_id="cri" text="Container Runtime Interface">}} (CRI), then
the kubelet [fetches Pod- and container-level metric data using CRI](/docs/reference/instrumentation/cri-pod-container-metrics), and not via cAdvisor.

## Pressure Stall Information (PSI) {#psi}

{{< feature-state for_k8s_version="v1.34" state="beta" >}}

As a beta feature, Kubernetes lets you configure kubelet to collect Linux kernel
[Pressure Stall Information](https://docs.kernel.org/accounting/psi.html)
(PSI) for CPU, memory, and I/O usage. The information is collected at node, pod and container level.
See [Summary API](/docs/reference/config-api/kubelet-stats.v1alpha1/) for detailed schema.
This feature is enabled by default, by setting the `KubeletPSI` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/). The information is also exposed in
[Prometheus metrics](/docs/concepts/cluster-administration/system-metrics#psi-metrics).

#### Understanding PSI Metrics

Pressure Stall Information (PSI) metrics are provided for three resources: CPU, memory, and I/O. They are categorized into two main types of pressure: `some` and `full`.

*   **`some`**: This value indicates that some tasks (one or more) are stalled on a resource. For example, if some tasks are waiting for I/O, this metric will increase. This can be an early indicator of resource contention.
*   **`full`**: This value indicates that *all* non-idle tasks are stalled on a resource simultaneously. This signifies a more severe resource shortage, where the entire system is unable to make progress.

Each pressure type provides four metrics: `avg10`, `avg60`, `avg300`, and `total`. The `avg` values represent the percentage of wall-clock time that tasks were stalled over 10-second, 60-second, and 3-minute moving averages. The `total` value is a cumulative counter in microseconds showing the total time tasks have been stalled.

#### Example Scenarios

You can use a simple Pod with a stress-testing tool to generate resource pressure and observe the PSI metrics. The following examples use the `agnhost` container image, which includes the `stress` tool.

First, start by watching the summary stats for your node. In a separate terminal, run:
```shell
# Replace <node-name> with the name of a node in your cluster
kubectl get --raw "/api/v1/nodes/<node-name>/proxy/stats/summary" | jq '.pods[] | select(.podRef.name | contains("pressure-pod"))'
```

**Example 1: Generating CPU Pressure**

Create a Pod that generates CPU pressure using the `stress` utility. This workload will put a heavy load on one CPU core.

Create a file named `cpu-pressure-pod.yaml`:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: cpu-pressure-pod
spec:
  restartPolicy: Never
  containers:
  - name: cpu-stress
    image: registry.k8s.io/e2e-test-images/agnhost:2.47
    args:
    - "stress"
    - "--cpus"
    - "1"
```

Apply it to your cluster: `kubectl apply -f cpu-pressure-pod.yaml`

After the Pod is running, you will see the `some` PSI metrics for CPU increase in the summary API output. The `avg10` value for `some` pressure should rise above zero, indicating that tasks are spending time stalled on the CPU.

Clean up the Pod when you are finished:
```shell
kubectl delete pod cpu-pressure-pod
```

**Example 2: Generating Memory Pressure**

This example creates a Pod that continuously writes to files in the container's writable layer, causing the kernel's page cache to grow and forcing memory reclamation, which generates pressure.

Create a file named `memory-pressure-pod.yaml`:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: memory-pressure-pod
spec:
  restartPolicy: Never
  containers:
  - name: memory-stress
    image: registry.k8s.io/e2e-test-images/agnhost:2.47
    command: ["/bin/sh", "-c"]
    args:
    - "i=0; while true; do dd if=/dev/zero of=testfile.$i bs=1M count=50 &>/dev/null; i=$(((i+1)%5)); sleep 0.1; done"
    resources:
      limits:
        memory: "200M"
      requests:
        memory: "200M"
```

Apply it to your cluster. In the summary output, you will observe an increase in the `full` PSI metrics for memory, indicating that the system is under significant memory pressure.

Clean up the Pod when you are finished:
```shell
kubectl delete pod memory-pressure-pod
```

**Example 3: Generating I/O Pressure**

This Pod generates I/O pressure by repeatedly writing a file to disk and using `sync` to flush the data from memory, which creates I/O stalls.

Create a file named `io-pressure-pod.yaml`:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: io-pressure-pod
spec:
  restartPolicy: Never
  containers:
  - name: io-stress
    image: registry.k8s.io/e2e-test-images/agnhost:2.47
    command: ["/bin/sh", "-c"]
    args:
      - "while true; do dd if=/dev/zero of=testfile bs=1M count=128 &>/dev/null; sync; rm testfile &>/dev/null; done"
```

Apply this to your cluster. You will see the `some` PSI metrics for I/O increase as the Pod continuously writes to disk.

Clean up the Pod when you are finished:
```shell
kubectl delete pod io-pressure-pod
```

### Requirements

Pressure Stall Information requires:

- [Linux kernel versions 4.20 or later](/docs/reference/node/kernel-version-requirements#requirements-psi).
- [cgroup v2](/docs/concepts/architecture/cgroups)

## {{% heading "whatsnext" %}}

The task pages for [Troubleshooting Clusters](/docs/tasks/debug/debug-cluster/) discuss
how to use a metrics pipeline that rely on these data.
