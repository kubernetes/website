---
title: 了解压力阻塞信息（PSI）指标
content_type: reference
weight: 50
description: >-
  详细解释压力阻塞信息（PSI）指标，以及如何使用这些指标识别 Kubernetes 中的资源压力。
---
<!--
title: Understand Pressure Stall Information (PSI) Metrics
content_type: reference
weight: 50
description: >-
  Detailed explanation of Pressure Stall Information (PSI) metrics and how to use them to identify resource pressure in Kubernetes.
-->

<!-- overview -->

{{< feature-state feature_gate_name="KubeletPSI" >}}

<!--
As a stable feature, Kubernetes lets you configure the kubelet to collect Linux kernel
[Pressure Stall Information](https://docs.kernel.org/accounting/psi.html)
(PSI) for CPU, memory, and I/O usage. The information is collected at node, pod and container level.
Starting with Kubernetes v.1.36, the `KubeletPSI` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is locked to true and cannot be disabled.
-->
作为一项稳定特性，Kubernetes 允许你配置 kubelet 收集 Linux 内核针对 CPU、内存和 I/O
使用情况的[压力阻塞信息](https://docs.kernel.org/accounting/psi.html)（PSI）。
这些信息在节点、Pod 和容器级别收集。从 Kubernetes v1.36 开始，`KubeletPSI`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)被锁定为 true，无法禁用。

<!--
PSI metrics are exposed through two different sources:
- The kubelet's [Summary API](/docs/reference/kubelet-api/stats.v1alpha1/), which provides PSI data at the node, pod, and container level.
- The `/metrics/cadvisor` endpoint on the kubelet, which exposes PSI metrics in the [Prometheus format](/docs/concepts/cluster-administration/system-metrics#psi-metrics).
-->
PSI 指标通过两种不同的来源公开：

- kubelet 的 [Summary API](/zh-cn/docs/reference/kubelet-api/stats.v1alpha1/)，
  它在节点、Pod 和容器级别提供 PSI 数据。
- kubelet 上的 `/metrics/cadvisor` 端点，它以
  [Prometheus 格式](/zh-cn/docs/concepts/cluster-administration/system-metrics/#kubelet-pressure-stall-information-psi-metrics)公开 PSI 指标。

<!--
### Requirements
-->
### 要求 {#requirements}

<!--
Pressure Stall Information requires the following on your Linux nodes:
-->
在你的 Linux 节点上启用压力阻塞信息需要满足以下条件：

<!--
- The Linux kernel must be version **4.20 or newer**.
- The kernel must be compiled with the `CONFIG_PSI=y` option. Most modern distributions enable this by default. You can check your kernel's configuration by running `zgrep CONFIG_PSI /proc/config.gz`.
- Some Linux distributions may compile PSI into the kernel but disable it by default. If so, you need to enable it at boot time by adding the `psi=1` parameter to the kernel command line.
- The node must be using [cgroup v2](/docs/concepts/architecture/cgroups).
-->
- Linux 内核版本必须为 **4.20 或更高版本**。
- 内核必须使用 `CONFIG_PSI=y` 选项编译。大多数现代发行版默认启用该选项。
  你可以运行 `zgrep CONFIG_PSI /proc/config.gz` 检查内核配置。
- 有些 Linux 发行版可能已将 PSI 编译进内核，但默认将其禁用。
  这种情况下，你需要在启动时向内核命令行添加 `psi=1` 参数来启用它。
- 节点必须使用 [cgroup v2](/zh-cn/docs/concepts/architecture/cgroups)。

<!-- body -->

<!--
## Understanding PSI Metrics

Pressure Stall Information (PSI) metrics are provided for three resources: CPU, memory, and I/O. They are categorized into two main types of pressure: `some` and `full`.
-->
## 理解 PSI 指标 {#understanding-psi-metrics}

压力阻塞信息（PSI）指标针对三种资源提供：CPU、内存和 I/O。这些指标分为两类主要压力：`some` 和 `full`。

<!--
*   **`some`**: This value indicates that some tasks (one or more) are stalled on a resource. For example, if some tasks are waiting for I/O, this metric will increase. This can be an early indicator of resource contention.
*   **`full`**: This value indicates that *all* non-idle tasks are stalled on a resource simultaneously. This signifies a more severe resource shortage, where the entire system is unable to make progress.
-->
* **`some`**：此值表示有部分任务（一个或多个）在某个资源上受阻。
  例如，如果有部分任务在等待 I/O，该指标就会上升。这可以作为资源争用的早期信号。
* **`full`**：此值表示**所有**非空闲任务同时受阻于某个资源。
  这标志着更严重的资源短缺，整个系统无法取得进展。

<!--
Each pressure type provides four metrics: `avg10`, `avg60`, `avg300`, and `total`. The `avg` values represent the percentage of wall-clock time that tasks were stalled over 10-second, 60-second, and 5-minute moving averages. The `total` value is a cumulative counter in microseconds showing the total time tasks have been stalled.
-->
每种压力类型提供四个指标：`avg10`、`avg60`、`avg300` 和 `total`。
`avg` 值表示在 10 秒、60 秒和 5 分钟滑动平均窗口内，任务受阻时间占实际耗时的百分比。
`total` 值是以微秒为单位的累计计数器，显示任务受阻的总时长。

<!--
Let's take for example the following query from the Summary API:
`kubectl get --raw "/api/v1/nodes/$(kubectl get nodes -o jsonpath='{.items[0].metadata.name}')/proxy/stats/summary" | jq '.pods[].containers[] | select(.name=="<CONTAINER_NAME>") | {name, cpu: .cpu.psi, memory: .memory.psi, io: .io.psi}'`.
This returns the information in a json format as such.
-->
以 Summary API 中的以下查询为例：

```shell
kubectl get --raw "/api/v1/nodes/$(kubectl get nodes -o jsonpath='{.items[0].metadata.name}')/proxy/stats/summary" | jq '.pods[].containers[] | select(.name=="<CONTAINER_NAME>") | {name, cpu: .cpu.psi, memory: .memory.psi, io: .io.psi}'
```

返回值采用如下 JSON 格式。

```
{
  "name": "<CONTAINER_NAME>",
  "cpu": {
    "full": {
      "total": 0,
      "avg10": 0,
      "avg60": 0,
      "avg300": 0
    },
    "some": {
      "total": 35232438,
      "avg10": 0.74,
      "avg60": 0.52,
      "avg300": 0.21,
    },
  },
  "memory": {
    "full": {
      "total": 539105,
      "avg10": 0,
      "avg60": 0,
      "avg300": 0
    },
    "some": {
      "total": 658164,
      "avg10": 0.01,
      "avg60": 0.01,
      "avg300": 0.00,
    },
    }
  },
  "io": {
    "full": {
      "total": 33190987,
      "avg10": 0.31,
      "avg60": 0.22,
      "avg300": 0.05,
    },
    "some": {
      "total": 40809937,
      "avg10": 0.52,
      "avg60": 0.45,
      "avg300": 0.12,
    }
  }
}
```

<!--
Here is a simple spike scenario. The cpu.some `avg10` value of `0.74` indicates that in the last 10 seconds, at least one task in this container was stalled on the CPU for 0.74% of the time (0.0074 seconds or 74 milliseconds). Because `avg10` (0.74) is significantly higher than `avg300` (0.21) on the same resource, this suggests a recent surge in resource contention rather than a sustained long-term bottleneck. If monitored continuously and the `avg300` metrics increase as well, we can diagnose a more serious, lasting issue!
-->
这里是一个简单的尖峰场景。cpu.some 的 `avg10` 值为 `0.74`，表示在过去 10 秒内，
该容器中至少有一个任务有 0.74% 的时间（0.0074 秒或 74 毫秒）受阻于 CPU。
由于同一资源上的 `avg10`（0.74）明显高于 `avg300`（0.21），
这表明资源争用是近期激增的，而不是长期持续的瓶颈。
如果持续监控并发现 `avg300` 也随之上升，就可以诊断出更严重、更持久的问题！

<!--
Additionally, notice how in this example `cpu.some` shows pressure, while `cpu.full` remains at 0.00. This tells us that while some processes were delayed waiting for CPU time, the container as a whole was still making progress. A non-zero full value would indicate that all non-idle tasks were stalled simultaneously, a much bigger problem.
Although not as human-readable, the `total` value of 35232438 represents the cumulative stall time in microseconds, that allow latency spike detection that otherwise may not show in the averages.
-->
此外，注意在这个例子中 `cpu.some` 显示出压力，而 `cpu.full` 保持为 0.00。
这说明虽然有一些进程在等待 CPU 时间而被延迟，但容器整体仍在取得进展。
`full` 值非零则表示所有非空闲任务同时受阻，这是严重得多的问题。
尽管不如其他值那么直观，`total` 值 35232438 表示以微秒为单位的累计受阻时长，
借助它可以发现那些不会出现在平均值中的延迟尖峰。

<!--
As a final note, when observing high I/O Pressure alongside low Memory Pressure, it can indicate that the application is waiting on disk throughput rather than failing due to a lack of available RAM. The node is not over-committed on memory, and a different diagnosis for disk consumption can be investigated.
-->
最后说明一点：当你观察到 I/O 压力高而内存压力低时，
这可能说明应用是在等待磁盘吞吐，而不是因为可用内存不足而失败。
节点的内存并没有被超额分配，此时可以针对磁盘消耗另作诊断。

<!--
## Example Scenarios

You can use a simple Pod with a stress-testing tool to generate resource pressure and observe the PSI metrics. The following examples use the `agnhost` container image, which includes the `stress` tool.
-->
## 示例场景 {#example-scenarios}

你可以使用一个带有压力测试工具的简单 Pod 来制造资源压力并观察 PSI 指标。
以下示例使用 `agnhost` 容器镜像，其中包含 `stress` 工具。

<!--
### Generating CPU Pressure

Create a Pod that generates CPU pressure using the `stress` utility. This workload will put a heavy load on one CPU core.

Create a file named `cpu-pressure-pod.yaml`:
-->
### 产生 CPU 压力 {#generating-cpu-pressure}

创建一个使用 `stress` 工具产生 CPU 压力的 Pod。该工作负载会给一个 CPU 核带来很高的负载。

创建名为 `cpu-pressure-pod.yaml` 的文件：

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
    resources:
      limits:
        cpu: "500m"
      requests:
        cpu: "500m"
```

<!--
Apply it to your cluster: `kubectl apply -f cpu-pressure-pod.yaml`

#### Observing CPU Pressure
-->
将其应用到集群：`kubectl apply -f cpu-pressure-pod.yaml`

#### 观察 CPU 压力 {#observing-cpu-pressure}

<!--
After the Pod is running, you can observe the CPU pressure through either the Summary API or the Prometheus metrics endpoint.

**Using the Summary API:**

Watch the summary stats for your node. In a separate terminal, run:
-->
Pod 运行后，你可以通过 Summary API 或 Prometheus 指标端点观察 CPU 压力。

**使用 Summary API：**

观察你所在节点的摘要统计信息。在另一个终端中运行：

<!--
```shell
# Replace <node-name> with the name of a node in your cluster
kubectl get --raw "/api/v1/nodes/<node-name>/proxy/stats/summary" | jq '.pods[] | select(.podRef.name | contains("cpu-pressure-pod"))'
```
-->
```shell
# 将 <node-name> 替换为集群中某个节点的名称
kubectl get --raw "/api/v1/nodes/<node-name>/proxy/stats/summary" | jq '.pods[] | select(.podRef.name | contains("cpu-pressure-pod"))'
```

<!--
You will see the `some` PSI metrics for CPU increase in the summary API output. The `avg10` value for `some` pressure should rise above zero, indicating that tasks are spending time stalled on the CPU.
-->
你会在 summary API 输出中看到 CPU 的 `some` PSI 指标上升。
`some` 压力的 `avg10` 值应升至零以上，表示有任务在 CPU 上受阻。

<!--
**Using the Prometheus metrics endpoint:**

Query the `/metrics/cadvisor` endpoint to see the `container_pressure_cpu_waiting_seconds_total` metric.
-->
**使用 Prometheus 指标端点：**

查询 `/metrics/cadvisor` 端点以查看 `container_pressure_cpu_waiting_seconds_total` 指标。

<!--
```shell
# Replace <node-name> with the name of the node where the pod is running
kubectl get --raw "/api/v1/nodes/<node-name>/proxy/metrics/cadvisor" | \
    grep 'container_pressure_cpu_waiting_seconds_total{container="cpu-stress"'
```
-->
```shell
# 将 <node-name> 替换为 Pod 所在节点的名称
kubectl get --raw "/api/v1/nodes/<node-name>/proxy/metrics/cadvisor" | \
    grep 'container_pressure_cpu_waiting_seconds_total{container="cpu-stress"'
```

<!--
The output should show an increasing value, indicating that the container is spending time stalled waiting for CPU resources.

#### Cleanup

Clean up the Pod when you are finished:
-->
输出应显示该值不断增长，表示容器正阻塞等待 CPU 资源。

#### 清理 {#cleanup}

完成后清理该 Pod：

```shell
kubectl delete pod cpu-pressure-pod
```

<!--
### Generating Memory Pressure

This example creates a Pod that continuously writes to files in the container's writable layer, causing the kernel's page cache to grow and forcing memory reclamation, which generates pressure.

Create a file named `memory-pressure-pod.yaml`:
-->
### 产生内存压力 {#generating-memory-pressure}

此示例创建一个持续写入容器可写层文件的 Pod，导致内核页缓存增长并触发内存回收，从而产生压力。

创建名为 `memory-pressure-pod.yaml` 的文件：

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

<!--
Apply it to your cluster: `kubectl apply -f memory-pressure-pod.yaml`

#### Observing Memory Pressure

**Using the Summary API:**

In the summary output, you will observe an increase in the `full` PSI metrics for memory, indicating that the system is under significant memory pressure.
-->
将其应用到集群：`kubectl apply -f memory-pressure-pod.yaml`

#### 观察内存压力 {#observing-memory-pressure}

**使用 Summary API：**

在摘要输出中，你会观察到内存的 `full` PSI 指标上升，表示系统正承受显著的内存压力。

<!--
```shell
# Replace <node-name> with the name of a node in your cluster
kubectl get --raw "/api/v1/nodes/<node-name>/proxy/stats/summary" | jq '.pods[] | select(.podRef.name | contains("memory-pressure-pod"))'
```
-->
```shell
# 将 <node-name> 替换为集群中某个节点的名称
kubectl get --raw "/api/v1/nodes/<node-name>/proxy/stats/summary" | jq '.pods[] | select(.podRef.name | contains("memory-pressure-pod"))'
```

<!--
**Using the Prometheus metrics endpoint:**
-->
**使用 Prometheus 指标端点：**

<!--
Query the `/metrics/cadvisor` endpoint to see the `container_pressure_memory_waiting_seconds_total` metric.
-->
查询 `/metrics/cadvisor` 端点以查看 `container_pressure_memory_waiting_seconds_total` 指标。

<!--
```shell
# Replace <node-name> with the name of the node where the pod is running
kubectl get --raw "/api/v1/nodes/<node-name>/proxy/metrics/cadvisor" | \
    grep 'container_pressure_memory_waiting_seconds_total{container="memory-stress"'
```
-->
```shell
# 将 <node-name> 替换为 Pod 所在节点的名称
kubectl get --raw "/api/v1/nodes/<node-name>/proxy/metrics/cadvisor" | \
    grep 'container_pressure_memory_waiting_seconds_total{container="memory-stress"'
```

<!--
In the output, you will observe an increasing value for the metric, indicating that the system is under significant memory pressure.
-->
在输出中，你会看到该指标值不断增长，表示系统正承受显著的内存压力。

<!--
#### Cleanup

Clean up the Pod when you are finished:
-->
#### 清理 {#cleanup-1}

完成后清理该 Pod：

```shell
kubectl delete pod memory-pressure-pod
```

<!--
### Generating I/O Pressure

This Pod generates I/O pressure by repeatedly writing a file to disk and using `sync` to flush the data from memory, which creates I/O stalls.

Create a file named `io-pressure-pod.yaml`:
-->
### 产生 I/O 压力 {#generating-i-o-pressure}

此 Pod 通过反复向磁盘写入文件并使用 `sync` 将数据从内存刷出，制造 I/O 阻塞，从而产生 I/O 压力。

创建名为 `io-pressure-pod.yaml` 的文件：

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

<!--
Apply this to your cluster: `kubectl apply -f io-pressure-pod.yaml`
-->
将其应用到集群：`kubectl apply -f io-pressure-pod.yaml`

<!--
#### Observing I/O Pressure

**Using the Summary API:**

You will see the `some` PSI metrics for I/O increase as the Pod continuously writes to disk.
-->
#### 观察 I/O 压力 {#observing-i-o-pressure}

**使用 Summary API：**

随着 Pod 持续写入磁盘，你会看到 I/O 的 `some` PSI 指标上升。

<!--
```shell
# Replace <node-name> with the name of a node in your cluster
kubectl get --raw "/api/v1/nodes/<node-name>/proxy/stats/summary" | jq '.pods[] | select(.podRef.name | contains("io-pressure-pod"))'
```
-->
```shell
# 将 <node-name> 替换为集群中某个节点的名称
kubectl get --raw "/api/v1/nodes/<node-name>/proxy/stats/summary" | jq '.pods[] | select(.podRef.name | contains("io-pressure-pod"))'
```

<!--
**Using the Prometheus metrics endpoint:**

Query the `/metrics/cadvisor` endpoint to see the `container_pressure_io_waiting_seconds_total` metric.
-->
**使用 Prometheus 指标端点：**

查询 `/metrics/cadvisor` 端点以查看 `container_pressure_io_waiting_seconds_total` 指标。

<!--
```shell
# Replace <node-name> with the name of the node where the pod is running
kubectl get --raw "/api/v1/nodes/<node-name>/proxy/metrics/cadvisor" | \
    grep 'container_pressure_io_waiting_seconds_total{container="io-stress"'
```
-->
```shell
# 将 <node-name> 替换为 Pod 所在节点的名称
kubectl get --raw "/api/v1/nodes/<node-name>/proxy/metrics/cadvisor" | \
    grep 'container_pressure_io_waiting_seconds_total{container="io-stress"'
```

<!--
You will see the metric's value increase as the Pod continuously writes to disk.
-->
随着 Pod 持续写入磁盘，你会看到该指标值上升。

<!--
#### Cleanup

Clean up the Pod when you are finished:
-->
#### 清理 {#cleanup-2}

完成后清理该 Pod：

```shell
kubectl delete pod io-pressure-pod
```

## {{% heading "whatsnext" %}}

<!--
The task pages for [Troubleshooting Clusters](/docs/tasks/debug/debug-cluster/) discuss
how to use a metrics pipeline that rely on these data.
-->
[集群故障排查](/zh-cn/docs/tasks/debug/debug-cluster/)相关的任务页面讨论了如何使用依赖这些数据的指标管道。
