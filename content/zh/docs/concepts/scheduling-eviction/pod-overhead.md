---
title: Pod Overhead
content_type: concept
weight: 50
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

<!--
When you run a Pod on a Node, the Pod itself takes an amount of system resources. These
resources are additional to the resources needed to run the container(s) inside the Pod.
_Pod Overhead_ is a feature for accounting for the resources consumed by the Pod infrastructure
on top of the container requests & limits.
-->
当你在节点上运行一个 Pod 的时候，Pod 自身就要占用掉大量的系统资源。这些资源是运行 Pod 内的容器所需的资源的补充。
_Pod 开销_ 是一个特性，用于根据容器请求和限制来计算 Pod 基础结构消耗的资源。


<!-- body -->
<!--
In Kubernetes, the Pod's overhead is set at
[admission](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)
time according to the overhead associated with the Pod's
[RuntimeClass](/docs/concepts/containers/runtime-class/).
-->
在 Kubernetes 中，Pod 的开销是根据与 Pod 的 [RuntimeClass](/zh/docs/concepts/containers/runtime-class/) 
相关的开销在[准入](/zh/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)时设置的。

<!--
When Pod Overhead is enabled, the overhead is considered in addition to the sum of container
resource requests when scheduling a Pod. Similarly, Kubelet will include the Pod overhead when sizing
the Pod cgroup, and when carrying out Pod eviction ranking.
-->
当 Pod 开销被启用，在调度 Pod 时，除了要考虑容器资源请求总和外，还要考虑 Pod 开销。
同样，Kubelet 在确定 Pod cgroup 的大小以及执行 Pod 驱逐排名时，也将包含 Pod 开销。

<!--
## Enabling Pod Overhead {#set-up}

You need to make sure that the `PodOverhead`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled (it is on by default as of 1.18)
across your cluster, and a `RuntimeClass` is utilized which defines the `overhead` field.
-->
## 启用 Pod 开销 {#set-up}

你需要确定在集群中启用了 `PodOverhead` [特性门控](/zh/docs/reference/command-line-tools-reference/feature-gates/)
（在 1.18 中是默认开启的），以及一个用于定义 `overhead` 字段的 `RuntimeClass`。

<!-->
## Usage example

To use the PodOverhead feature, you need a RuntimeClass that defines the `overhead` field. As
an example, you could use the following RuntimeClass definition with a virtualizing container runtime
that uses around 120MiB per Pod for the virtual machine and the guest OS:
-->
## 使用示例

要使用 PodOverhead 特性，你需要一个定义 `overhead` 字段的 RuntimeClass。
作为示例，可以在虚拟机和寄宿操作系统中通过一个虚拟化容器运行时来定义 RuntimeClass 如下，
其中每个 Pod 大约使用 120MiB:

```yaml
---
kind: RuntimeClass
apiVersion: node.k8s.io/v1beta1
metadata:
    name: kata-fc
handler: kata-fc
overhead:
    podFixed:
        memory: "120Mi"
        cpu: "250m"
```

<!--
Workloads which are created which specify the `kata-fc` RuntimeClass handler will take the memory and
cpu overheads into account for resource quota calculations, node scheduling, as well as Pod cgroup sizing.

Consider running the given example workload, test-pod:
-->
创建指定 `kata-fc` RuntimeClass 处理程序的工作负载将会考虑内存和 cpu 开销，
以进行资源配额计算、节点调度以及 Pod cgroup 的定级。

假设我们运行下面给出的工作负载示例，test-pod：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
spec:
  runtimeClassName: kata-fc
  containers:
  - name: busybox-ctr
    image: busybox
    stdin: true
    tty: true
    resources:
      limits:
        cpu: 500m
        memory: 100Mi
  - name: nginx-ctr
    image: nginx
    resources:
      limits:
        cpu: 1500m
        memory: 100Mi
```

<!--
At admission time the RuntimeClass [admission controller](/docs/reference/access-authn-authz/admission-controllers/)
updates the workload's PodSpec to include the `overhead` as described in the RuntimeClass. If the PodSpec already has this field defined,
the Pod will be rejected. In the given example, since only the RuntimeClass name is specified, the admission controller mutates the Pod
to include an `overhead`.

After the RuntimeClass admission controller, you can check the updated PodSpec:
-->
在准入阶段，RuntimeClass 的[准入控制器](/docs/reference/access-authn-authz/admission-controllers/)
将会更新工作负载的 PodSpec 来包含 RuntimeClass 中描述的 `overhead` 字段。如果 PodSpec 中该字段已经被定义，
该 Pod 将会被拒绝。在下面给出的示例中，由于只指定了 RuntimeClass 名称，所以准入控制器更新了 Pod, 包含了一个 `overhead`。

在 RuntimeClass 准入控制器后，你可以检查被更新的 PodSpec：

```bash
kubectl get pod test-pod -o jsonpath='{.spec.overhead}'
```

将会输出：
```
map[cpu:250m memory:120Mi]
```
<!--
If a ResourceQuota is defined, the sum of container requests as well as the
`overhead` field are counted.

When the kube-scheduler is deciding which node should run a new Pod, the scheduler considers that Pod's
`overhead` as well as the sum of container requests for that Pod. For this example, the scheduler adds the
requests and the overhead, then looks for a node that has 2.25 CPU and 320 MiB of memory available.
-->
如果定义了 ResourceQuata, 则容器请求的总量以及 `overhead` 字段都将被计算在内。

当 kube-scheduler 决定在哪一个节点调度运行新的 Pod 时，调度器会兼顾该 Pod 的 `overhead` 以及该 Pod 的容器请求总量。
在这个示例中，调度器将资源请求和开销相加，然后去寻找具备 2.25 CPU 和 320 MiB 可用内存的节点。

<!--
Once a Pod is scheduled to a node, the kubelet on that node creates a new {{< glossary_tooltip text="cgroup" term_id="cgroup" >}}
for the Pod. It is within this pod that the underlying container runtime will create containers.

If the resource has a limit defined for each container (Guaranteed QoS or Bustrable QoS with limits defined),
the kubelet will set an upper limit for the pod cgroup associated with that resource (cpu.cfs_quota_us for CPU
and memory.limit_in_bytes memory). This upper limit is based on the sum of the container limits plus the `overhead`
defined in the PodSpec.
-->
一旦 Pod 被调度到了某个节点，该节点上的 kubelet 将为该 Pod 新建一个 {{< glossary_tooltip text="cgroup" term_id="cgroup" >}}。
底层容器运行时将在这个 pod 中创建容器。

如果该资源对每个容器都定义了一个限制（定义了受限的 Guaranteed QoS 或者 Bustrable QoS），
kubelet 将会为与该资源（CPU 的 cpu.cfs_quota_us 以及内存的 memory.limit_in_bytes）
相关的 pod cgroup 设定一个上限。该上限基于容器限制总量与 PodSpec 中定义的 `overhead` 之和。

<!--
For CPU, if the Pod is Guaranteed or Burstable QoS, the kubelet will set `cpu.shares` based on the sum of container
requests plus the `overhead` defined in the PodSpec.

Looking at our example, verify the container requests for the workload:
-->
对于 CPU, 如果 Pod 的 QoS 是 Guaranteed 或者 Burstable, kubelet 会基于容器请求总量与 PodSpec 中定义的 `overhead` 之和来设置 `cpu.shares`。

请看这个例子，验证工作负载的容器请求：
```bash
kubectl get pod test-pod -o jsonpath='{.spec.containers[*].resources.limits}'
```

<!--
The total container requests are 2000m CPU and 200MiB of memory:
-->
容器请求总量是 2000m CPU 和 200MiB 的内存：
```
map[cpu: 500m memory:100Mi] map[cpu:1500m memory:100Mi]
```

<!--
Check this against what is observed by the node:
-->
对比从节点观察到的情况来检查一下：
```bash
kubectl describe node | grep test-pod -B2
```

<!--
The output shows 2250m CPU and 320MiB of memory are requested, which includes PodOverhead:
-->
该输出显示请求了 2250m CPU 以及 320MiB 内存，包含 PodOverhead 在内：
```
  Namespace                   Name                CPU Requests  CPU Limits   Memory Requests  Memory Limits  AGE
  ---------                   ----                ------------  ----------   ---------------  -------------  ---
  default                     test-pod            2250m (56%)   2250m (56%)  320Mi (1%)       320Mi (1%)     36m
```

<!--
## Verify Pod cgroup limits

Check the Pod's memory cgroups on the node where the workload is running. In the following example, [`crictl`](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md)
is used on the node, which provides a CLI for CRI-compatible container runtimes. This is an
advanced example to show PodOverhead behavior, and it is not expected that users should need to check
cgroups directly on the node.

First, on the particular node, determine the Pod identifier:
-->
## 验证 Pod cgroup 限制

检查运行工作负载的节点上 Pod 的内存 cgroup。在以下示例中，节点上将使用具备 CRI 兼容的容器运行时命令行工具 [`crictl`](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md)，
这是一个展示 PodOverhead 行为的高级示例，用户无需直接在该节点上检查 cgroup。

首先，在特定的节点上确定该 Pod 的标识符：

```bash
# 在该 Pod 调度的节点上执行如下命令：
POD_ID="$(sudo crictl pods --name test-pod -q)"
```

<!--
From this, you can determine the cgroup path for the Pod:
-->
可以以此判断该 Pod 的 cgroup 路径：
```bash
# 在该 Pod 调度的节点上执行如下命令：
sudo crictl inspectp -o=json $POD_ID | grep cgroupsPath
```

<!--
The resulting cgroup path includes the Pod's `pause` container. The Pod level cgroup is one directory above.
-->
执行结果的 cgroup 路径中包含了该 Pod 的 `pause` 容器。Pod 级别的 cgroup 即上面的一个目录。
```
        "cgroupsPath": "/kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2/7ccf55aee35dd16aca4189c952d83487297f3cd760f1bbf09620e206e7d0c27a"
```

<!--
In this specific case, the pod cgroup path is `kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2`. Verify the Pod level cgroup setting for memory:
-->
在这个例子中，该 pod 的 cgroup 路径是 `kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2`。验证内存的 Pod 级别 cgroup 设置：
```bash
# 在该 Pod 调度的节点上执行如下命令。
# 另外，修改 cgroup 的名称以匹配为该 pod 分配的 cgroup。
 cat /sys/fs/cgroup/memory/kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2/memory.limit_in_bytes
```

和预期的一样是 320 MiB：
```
335544320
```

<!--
### Observability

A `kube_pod_overhead` metric is available in [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics)
to help identify when PodOverhead is being utilized and to help observe stability of workloads
running with a defined Overhead. This functionality is not available in the 1.9 release of
kube-state-metrics, but is expected in a following release. Users will need to build kube-state-metrics
from source in the meantime.
-->
### 可观察性
在 [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics) 中可以通过 `kube_pod_overhead` 指标来帮助确定何时
使用 PodOverhead 以及协助观察以一个既定开销运行的工作负载的稳定性。该特性在 kube-state-metrics 的 1.9 发行版本中不可用，
不过预计将在后续版本中发布。在此之前，用户需要用源代码构建 kube-state-metric。


## {{% heading "whatsnext" %}}

<!--
* [RuntimeClass](/docs/concepts/containers/runtime-class/)
* [PodOverhead Design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/20190226-pod-overhead.md)
-->
* [RuntimeClass](/zh/docs/concepts/containers/runtime-class/)
* [PodOverhead 设计](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/20190226-pod-overhead.md)
