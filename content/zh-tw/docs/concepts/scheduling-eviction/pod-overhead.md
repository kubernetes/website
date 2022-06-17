---
title: Pod 開銷
content_type: concept
weight: 30
---

<!--
---
reviewers:
- dchen1107
- egernst
- tallclair
title: Pod Overhead
content_type: concept
weight: 30
---
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
When you run a Pod on a Node, the Pod itself takes an amount of system resources. These
resources are additional to the resources needed to run the container(s) inside the Pod.
In Kubernetes, _Pod Overhead_ is a way to account for the resources consumed by the Pod
infrastructure on top of the container requests & limits.
-->

在節點上執行 Pod 時，Pod 本身佔用大量系統資源。這些是執行 Pod 內容器所需資源之外的資源。
在 Kubernetes 中，_POD 開銷_ 是一種方法，用於計算 Pod 基礎設施在容器請求和限制之上消耗的資源。

<!-- body -->


<!--
In Kubernetes, the Pod's overhead is set at
[admission](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)
time according to the overhead associated with the Pod's
[RuntimeClass](/docs/concepts/containers/runtime-class/).
-->

在 Kubernetes 中，Pod 的開銷是根據與 Pod 的 [RuntimeClass](/zh-cn/docs/concepts/containers/runtime-class/)
相關聯的開銷在[准入](/zh-cn/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)時設定的。

<!--
When Pod Overhead is enabled, the overhead is considered in addition to the sum of container
resource requests when scheduling a Pod. Similarly,the kubelet will include the Pod overhead when sizing
the Pod cgroup, and when carrying out Pod eviction ranking.
-->

如果啟用了 Pod Overhead，在排程 Pod 時，除了考慮容器資源請求的總和外，還要考慮 Pod 開銷。
類似地，kubelet 將在確定 Pod cgroups 的大小和執行 Pod 驅逐排序時也會考慮 Pod 開銷。

<!--
## Configuring Pod overhead {#set-up}
-->
## 配置 Pod 開銷 {#set-up}

<!--
You need to make sure a `RuntimeClass` is utilized which defines the `overhead` field.
-->
你需要確保使用一個定義了 `overhead` 欄位的 `RuntimeClass`。

<!--
## Usage example
-->
## 使用示例

<!--
To work with Pod overhead, you need a RuntimeClass that defines the `overhead` field. As
an example, you could use the following RuntimeClass definition with a virtualization container
runtime that uses around 120MiB per Pod for the virtual machine and the guest OS:
-->
要使用 Pod 開銷，你需要一個定義了 `overhead` 欄位的 RuntimeClass。
作為例子，下面的 RuntimeClass 定義中包含一個虛擬化所用的容器執行時，
RuntimeClass 如下，其中每個 Pod 大約使用 120MiB 用來執行虛擬機器和寄宿作業系統：

```yaml
apiVersion: node.k8s.io/v1
kind: RuntimeClass
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
透過指定 `kata-fc` RuntimeClass 處理程式建立的工作負載會將記憶體和 CPU
開銷計入資源配額計算、節點排程以及 Pod cgroup 尺寸確定。

假設我們執行下面給出的工作負載示例 test-pod:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
spec:
  runtimeClassName: kata-fc
  containers:
  - name: busybox-ctr
    image: busybox:1.28
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
-->
在准入階段 RuntimeClass [准入控制器](/zh-cn/docs/reference/access-authn-authz/admission-controllers/)
更新工作負載的 PodSpec 以包含
RuntimeClass 中定義的 `overhead`。如果 PodSpec 中已定義該欄位，該 Pod 將會被拒絕。
在這個例子中，由於只指定了 RuntimeClass 名稱，所以准入控制器更新了 Pod，使之包含 `overhead`。

<!--
After the RuntimeClass admission controller, you can check the updated PodSpec:
-->
在 RuntimeClass 准入控制器進行修改後，你可以檢視更新後的 PodSpec：
```bash
kubectl get pod test-pod -o jsonpath='{.spec.overhead}'
```

<!--
The output is:
-->
輸出：
```
map[cpu:250m memory:120Mi]
```

<!--
If a [ResourceQuota](/docs/concepts/policy/resource-quotas/) is defined, the sum of container requests as well as the
`overhead` field are counted.
 -->
如果定義了 [ResourceQuata](/zh-cn/docs/concepts/policy/resource-quotas/), 
則容器請求的總量以及 `overhead` 欄位都將計算在內。

<!--
When the kube-scheduler is deciding which node should run a new Pod, the scheduler considers that Pod's
`overhead` as well as the sum of container requests for that Pod. For this example, the scheduler adds the
requests and the overhead, then looks for a node that has 2.25 CPU and 320 MiB of memory available.
-->
當 kube-scheduler 決定在哪一個節點排程執行新的 Pod 時，排程器會兼顧該 Pod 的
`overhead` 以及該 Pod 的容器請求總量。在這個示例中，排程器將資源請求和開銷相加，
然後尋找具備 2.25 CPU 和 320 MiB 記憶體可用的節點。

<!--
Once a Pod is scheduled to a node, the kubelet on that node creates a new {{< glossary_tooltip
text="cgroup" term_id="cgroup" >}} for the Pod. It is within this pod that the underlying
container runtime will create containers.
-->
一旦 Pod 被排程到了某個節點， 該節點上的 kubelet 將為該 Pod 新建一個 
{{< glossary_tooltip text="cgroup" term_id="cgroup" >}}。 底層容器執行時將在這個
Pod 中建立容器。

<!--
If the resource has a limit defined for each container (Guaranteed QoS or Burstable QoS with limits defined),
the kubelet will set an upper limit for the pod cgroup associated with that resource (cpu.cfs_quota_us for CPU
and memory.limit_in_bytes memory). This upper limit is based on the sum of the container limits plus the `overhead`
defined in the PodSpec.
-->
如果該資源對每一個容器都定義了一個限制（定義了限制值的 Guaranteed QoS 或者
Burstable QoS），kubelet 會為與該資源（CPU 的 `cpu.cfs_quota_us` 以及記憶體的
`memory.limit_in_bytes`）
相關的 Pod cgroup 設定一個上限。該上限基於 PodSpec 中定義的容器限制總量與 `overhead` 之和。

<!--
For CPU, if the Pod is Guaranteed or Burstable QoS, the kubelet will set `cpu.shares` based on the
sum of container requests plus the `overhead` defined in the PodSpec.
-->
對於 CPU，如果 Pod 的 QoS 是 Guaranteed 或者 Burstable，kubelet 會基於容器請求總量與
PodSpec 中定義的 `overhead` 之和設定 `cpu.shares`。

<!--
Looking at our example, verify the container requests for the workload:
-->
請看這個例子，驗證工作負載的容器請求：

```bash
kubectl get pod test-pod -o jsonpath='{.spec.containers[*].resources.limits}'
```

<!--
The total container requests are 2000m CPU and 200MiB of memory:
-->
容器請求總計 2000m CPU 和 200MiB 記憶體：

```
map[cpu: 500m memory:100Mi] map[cpu:1500m memory:100Mi]
```

<!--
Check this against what is observed by the node:
 -->
對照從節點觀察到的情況來檢查一下：

```bash
kubectl describe node | grep test-pod -B2
```

<!--
The output shows requests for 2250m CPU, and for 320MiB of memory. The requests include Pod overhead:
-->
該輸出顯示請求了 2250m CPU 以及 320MiB 記憶體。請求包含了 Pod 開銷在內：
```
  Namespace    Name       CPU Requests  CPU Limits   Memory Requests  Memory Limits  AGE
  ---------    ----       ------------  ----------   ---------------  -------------  ---
  default      test-pod   2250m (56%)   2250m (56%)  320Mi (1%)       320Mi (1%)     36m
```

<!--
## Verify Pod cgroup limits
-->
## 驗證 Pod cgroup 限制

<!--
Check the Pod's memory cgroups on the node where the workload is running. In the following example,
[`crictl`](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md)
is used on the node, which provides a CLI for CRI-compatible container runtimes. This is an
advanced example to show Pod overhead behavior, and it is not expected that users should need to check
cgroups directly on the node.

First, on the particular node, determine the Pod identifier:
-->
在工作負載所執行的節點上檢查 Pod 的記憶體 cgroups。在接下來的例子中，
將在該節點上使用具備 CRI 相容的容器執行時命令列工具
[`crictl`](https://github.com/kubernetes-sigs/cri-tools/blob/master/docs/crictl.md)。
這是一個顯示 Pod 開銷行為的高階示例， 預計使用者不需要直接在節點上檢查 cgroups。
首先在特定的節點上確定該 Pod 的識別符號：

<!--
```bash
# Run this on the node where the Pod is scheduled
-->
```bash
# 在該 Pod 被排程到的節點上執行如下命令：
POD_ID="$(sudo crictl pods --name test-pod -q)"
```

<!--
From this, you can determine the cgroup path for the Pod:
 -->
可以依此判斷該 Pod 的 cgroup 路徑：

<!--
```bash
# Run this on the node where the Pod is scheduled
-->
```bash
# 在該 Pod 被排程到的節點上執行如下命令：
sudo crictl inspectp -o=json $POD_ID | grep cgroupsPath
```

<!--
The resulting cgroup path includes the Pod's `pause` container. The Pod level cgroup is one directory above.
-->
執行結果的 cgroup 路徑中包含了該 Pod 的 `pause` 容器。Pod 級別的 cgroup 在即上一層目錄。

```
  "cgroupsPath": "/kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2/7ccf55aee35dd16aca4189c952d83487297f3cd760f1bbf09620e206e7d0c27a"
```

<!--
In this specific case, the pod cgroup path is `kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2`.
Verify the Pod level cgroup setting for memory:
-->
在這個例子中，該 Pod 的 cgroup 路徑是 `kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2`。
驗證記憶體的 Pod 級別 cgroup 設定：

<!--
```bash
# Run this on the node where the Pod is scheduled.
# Also, change the name of the cgroup to match the cgroup allocated for your pod.
-->
```bash
# 在該 Pod 被排程到的節點上執行這個命令。
# 另外，修改 cgroup 的名稱以匹配為該 Pod 分配的 cgroup。
 cat /sys/fs/cgroup/memory/kubepods/podd7f4b509-cf94-4951-9417-d1087c92a5b2/memory.limit_in_bytes
```

<!--
This is 320 MiB, as expected:
-->
和預期的一樣，這一數值為 320 MiB。

```
335544320
```

<!--
### Observability
-->
### 可觀察性

<!--
Some `kube_pod_overhead_*` metrics are available in [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics)
to help identify when Pod overhead is being utilized and to help observe stability of workloads
running with a defined overhead.
-->
在 [kube-state-metrics](https://github.com/kubernetes/kube-state-metrics) 中可以透過
`kube_pod_overhead_*` 指標來協助確定何時使用 Pod 開銷，
以及協助觀察以一個既定開銷執行的工作負載的穩定性。
該特性在 kube-state-metrics 的 1.9 發行版本中不可用，不過預計將在後續版本中釋出。
在此之前，使用者需要從原始碼構建 kube-state-metrics。

## {{% heading "whatsnext" %}}

<!--
* Learn more about [RuntimeClass](/docs/concepts/containers/runtime-class/)
* Read the [PodOverhead Design](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/688-pod-overhead)
  enhancement proposal for extra context
-->
* 學習更多關於 [RuntimeClass](/zh-cn/docs/concepts/containers/runtime-class/) 的資訊
* 閱讀 [PodOverhead 設計](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/688-pod-overhead)增強建議以獲取更多上下文
