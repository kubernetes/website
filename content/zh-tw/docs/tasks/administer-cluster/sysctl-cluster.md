---
title: 在 Kubernetes 集羣中使用 sysctl
content_type: task
weight: 400
---

<!--
title: Using sysctls in a Kubernetes Cluster
reviewers:
- sttts
content_type: task
weight: 400
--->

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="stable" >}}
<!--
This document describes how to configure and use kernel parameters within a
Kubernetes cluster using the {{< glossary_tooltip term_id="sysctl" >}}
interface.
-->
本文檔介紹如何通過 {{< glossary_tooltip term_id="sysctl" >}}
接口在 Kubernetes 集羣中配置和使用內核參數。

{{< note >}}
<!--
Starting from Kubernetes version 1.23, the kubelet supports the use of either `/` or `.`
as separators for sysctl names.
Starting from Kubernetes version 1.25, setting Sysctls for a Pod supports setting sysctls with slashes.
For example, you can represent the same sysctl name as `kernel.shm_rmid_forced` using a
period as the separator, or as `kernel/shm_rmid_forced` using a slash as a separator.
For more sysctl parameter conversion method details, please refer to
the page [sysctl.d(5)](https://man7.org/linux/man-pages/man5/sysctl.d.5.html) from
the Linux man-pages project.
-->
從 Kubernetes 1.23 版本開始，kubelet 支持使用 `/` 或 `.` 作爲 sysctl 參數的分隔符。
從 Kubernetes 1.25 版本開始，支持爲 Pod 設置 sysctl 時使用設置名字帶有斜線的 sysctl。
例如，你可以使用點或者斜線作爲分隔符表示相同的 sysctl 參數，以點作爲分隔符表示爲： `kernel.shm_rmid_forced`，
或者以斜線作爲分隔符表示爲：`kernel/shm_rmid_forced`。
更多 sysctl 參數轉換方法詳情請參考 Linux man-pages
[sysctl.d(5)](https://man7.org/linux/man-pages/man5/sysctl.d.5.html)。
{{< /note >}}

## {{% heading "prerequisites" %}}

{{< note >}}
<!--
`sysctl` is a Linux-specific command-line tool used to configure various kernel parameters
and it is not available on non-Linux operating systems.
-->
`sysctl` 是一個 Linux 特有的命令行工具，用於配置各種內核參數，
它在非 Linux 操作系統上無法使用。
{{< /note >}}

{{< include "task-tutorial-prereqs.md" >}}

<!--
For some steps, you also need to be able to reconfigure the command line
options for the kubelets running on your cluster.
-->
對一些步驟，你需要能夠重新配置在你的集羣裏運行的 kubelet 命令行的選項。

<!-- steps -->

<!--
## Listing all Sysctl Parameters
-->
## 獲取 Sysctl 的參數列表   {#listing-all-sysctl-parameters}

<!--
In Linux, the sysctl interface allows an administrator to modify kernel
parameters at runtime. Parameters are available via the `/proc/sys/` virtual
process file system. The parameters cover various subsystems such as:
-->
在 Linux 中，管理員可以通過 sysctl 接口修改內核運行時的參數。在 `/proc/sys/`
虛擬文件系統下存放許多內核參數。這些參數涉及了多個內核子系統，如：

<!--
- kernel (common prefix: `kernel.`)
- networking (common prefix: `net.`)
- virtual memory (common prefix: `vm.`)
- MDADM (common prefix: `dev.`)
- More subsystems are described in [Kernel docs](https://www.kernel.org/doc/Documentation/sysctl/README).
-->
- 內核子系統（通常前綴爲: `kernel.`）
- 網絡子系統（通常前綴爲: `net.`）
- 虛擬內存子系統（通常前綴爲: `vm.`）
- MDADM 子系統（通常前綴爲: `dev.`）
- 更多子系統請參見[內核文檔](https://www.kernel.org/doc/Documentation/sysctl/README)。

<!--
To get a list of all parameters, you can run
--->
若要獲取完整的參數列表，請執行以下命令：

```shell
sudo sysctl -a
```

<!--
## Safe and Unsafe Sysctls

Kubernetes classes sysctls as either _safe_ or _unsafe_. In addition to proper
namespacing, a _safe_ sysctl must be properly _isolated_ between pods on the
same node. This means that setting a _safe_ sysctl for one pod
-->
## 安全和非安全的 Sysctl 參數  {#safe-and-unsafe-sysctls}

Kubernetes 將 sysctl 參數分爲 **安全** 和 **非安全的**。
**安全** 的 sysctl 參數除了需要設置恰當的命名空間外，在同一節點上的不同 Pod
之間也必須是 **相互隔離的**。這意味着 Pod 上設置 **安全的** sysctl 參數時：

<!--
- must not have any influence on any other pod on the node
- must not allow to harm the node's health
- must not allow to gain CPU or memory resources outside of the resource limits
  of a pod.
-->
- 必須不能影響到節點上的其他 Pod
- 必須不能損害節點的健康
- 必須不允許使用超出 Pod 的資源限制的 CPU 或內存資源。

<!--
By far, most of the _namespaced_ sysctls are not necessarily considered _safe_.
The following sysctls are supported in the _safe_ set:
-->
至今爲止，大多數 **有命名空間的** sysctl 參數不一定被認爲是 **安全** 的。
以下幾種 sysctl 參數是 **安全的**：

<!--
- `kernel.shm_rmid_forced`;
- `net.ipv4.ip_local_port_range`;
- `net.ipv4.tcp_syncookies`;
- `net.ipv4.ping_group_range` (since Kubernetes 1.18);
- `net.ipv4.ip_unprivileged_port_start` (since Kubernetes 1.22);
- `net.ipv4.ip_local_reserved_ports` (since Kubernetes 1.27, needs kernel 3.16+);
- `net.ipv4.tcp_keepalive_time` (since Kubernetes 1.29, needs kernel 4.5+);
- `net.ipv4.tcp_fin_timeout` (since Kubernetes 1.29, needs kernel 4.6+);
- `net.ipv4.tcp_keepalive_intvl` (since Kubernetes 1.29, needs kernel 4.5+);
- `net.ipv4.tcp_keepalive_probes` (since Kubernetes 1.29, needs kernel 4.5+).
- `net.ipv4.tcp_rmem` (since Kubernetes 1.32, needs kernel 4.15+).
- `net.ipv4.tcp_wmem` (since Kubernetes 1.32, needs kernel 4.15+).
-->
- `kernel.shm_rmid_forced`；
- `net.ipv4.ip_local_port_range`；
- `net.ipv4.tcp_syncookies`；
- `net.ipv4.ping_group_range`（從 Kubernetes 1.18 開始）；
- `net.ipv4.ip_unprivileged_port_start`（從 Kubernetes 1.22 開始）；
- `net.ipv4.ip_local_reserved_ports`（從 Kubernetes 1.27 開始，需要 kernel 3.16+）；
- `net.ipv4.tcp_keepalive_time`（從 Kubernetes 1.29 開始，需要 kernel 4.5+）；
- `net.ipv4.tcp_fin_timeout`（從 Kubernetes 1.29 開始，需要 kernel 4.6+）；
- `net.ipv4.tcp_keepalive_intvl`（從 Kubernetes 1.29 開始，需要 kernel 4.5+）；
- `net.ipv4.tcp_keepalive_probes`（從 Kubernetes 1.29 開始，需要 kernel 4.5+）；
- `net.ipv4.tcp_rmem`（從 Kubernetes 1.32 開始，需要 kernel 4.15+）；
- `net.ipv4.tcp_wmem`（從 Kubernetes 1.32 開始，需要 kernel 4.15+）。

{{< note >}}
<!--
There are some exceptions to the set of safe sysctls:

- The `net.*` sysctls are not allowed with host networking enabled.
- The `net.ipv4.tcp_syncookies` sysctl is not namespaced on Linux kernel version 4.5 or lower.
-->
安全 sysctl 參數有一些例外：

- `net.*` sysctl 參數不允許在啓用主機網絡的情況下使用。
- `net.ipv4.tcp_syncookies` sysctl 參數在 Linux 內核 4.5 或更低的版本中是無命名空間的。
{{< /note >}}

<!--
This list will be extended in future Kubernetes versions when the kubelet
supports better isolation mechanisms.
-->
在未來的 Kubernetes 版本中，若 kubelet 支持更好的隔離機制，
則上述列表中將會列出更多 **安全的** sysctl 參數。

<!--
### Enabling Unsafe Sysctls

All _safe_ sysctls are enabled by default.
-->
### 啓用非安全的 Sysctl 參數   {#enabling-unsafe-sysctls}

所有 **安全的** sysctl 參數都默認啓用。

<!--
All _unsafe_ sysctls are disabled by default and must be allowed manually by the
cluster admin on a per-node basis. Pods with disabled unsafe sysctls will be
scheduled, but will fail to launch.
-->
所有 **非安全的** sysctl 參數都默認禁用，且必須由集羣管理員在每個節點上手動開啓。
那些設置了不安全 sysctl 參數的 Pod 仍會被調度，但無法正常啓動。

<!--
With the warning above in mind, the cluster admin can allow certain _unsafe_
sysctls for very special situations such as high-performance or real-time
application tuning. _Unsafe_ sysctls are enabled on a node-by-node basis with a
flag of the kubelet; for example:
-->
參考上述警告，集羣管理員只有在一些非常特殊的情況下（如：高可用或實時應用調整），
纔可以啓用特定的 **非安全的** sysctl 參數。
如需啓用 **非安全的** sysctl 參數，請你在每個節點上分別設置 kubelet 命令行參數，例如：

```shell
kubelet --allowed-unsafe-sysctls \
  'kernel.msg*,net.core.somaxconn' ...
```

<!--
For {{< glossary_tooltip term_id="minikube" >}}, this can be done via the `extra-config` flag:
-->
如果你使用 {{< glossary_tooltip term_id="minikube" >}}，可以通過 `extra-config` 參數來配置：

```shell
minikube start --extra-config="kubelet.allowed-unsafe-sysctls=kernel.msg*,net.core.somaxconn"...
```
<!--
Only _namespaced_ sysctls can be enabled this way.
-->
只有 **有命名空間的** sysctl 參數可以通過該方式啓用。

<!--
## Setting Sysctls for a Pod

A number of sysctls are _namespaced_ in today's Linux kernels. This means that
they can be set independently for each pod on a node. Only namespaced sysctls
are configurable via the pod securityContext within Kubernetes.
-->
## 設置 Pod 的 Sysctl 參數   {#setting-sysctls-for-pod}

目前，在 Linux 內核中，有許多的 sysctl 參數都是 **有命名空間的**。
這就意味着可以爲節點上的每個 Pod 分別去設置它們的 sysctl 參數。
在 Kubernetes 中，只有那些有命名空間的 sysctl 參數可以通過 Pod 的 securityContext 對其進行配置。

<!--
The following sysctls are known to be namespaced. This list could change
in future versions of the Linux kernel.
-->
以下列出有命名空間的 sysctl 參數，在未來的 Linux 內核版本中，此列表可能會發生變化。

- `kernel.shm*`,
- `kernel.msg*`,
- `kernel.sem`,
- `fs.mqueue.*`,
<!--
- Those `net.*` that can be set in container networking namespace. However,
  there are exceptions (e.g., `net.netfilter.nf_conntrack_max` and
  `net.netfilter.nf_conntrack_expect_max` can be set in container networking
  namespace but are unnamespaced before Linux 5.12.2).
-->
- 那些可以在容器網絡命名空間中設置的 `net.*`。但是，也有例外（例如
  `net.netfilter.nf_conntrack_max` 和 `net.netfilter.nf_conntrack_expect_max`
  可以在容器網絡命名空間中設置，但在 Linux 5.12.2 之前它們是無命名空間的）。

<!--
Sysctls with no namespace are called _node-level_ sysctls. If you need to set
them, you must manually configure them on each node's operating system, or by
using a DaemonSet with privileged containers.
-->
沒有命名空間的 sysctl 參數稱爲 **節點級別的** sysctl 參數。
如果需要對其進行設置，則必須在每個節點的操作系統上手動地去配置它們，
或者通過在 DaemonSet 中運行特權模式容器來配置。

<!--
Use the pod securityContext to configure namespaced sysctls. The securityContext
applies to all containers in the same pod.
-->
可使用 Pod 的 securityContext 來配置有命名空間的 sysctl 參數，
securityContext 應用於同一個 Pod 中的所有容器。

<!--
This example uses the pod securityContext to set a safe sysctl
`kernel.shm_rmid_forced` and two unsafe sysctls `net.core.somaxconn` and
`kernel.msgmax`. There is no distinction between _safe_ and _unsafe_ sysctls in
the specification.
-->
此示例中，使用 Pod SecurityContext 來對一個安全的 sysctl 參數
`kernel.shm_rmid_forced` 以及兩個非安全的 sysctl 參數
`net.core.somaxconn` 和 `kernel.msgmax` 進行設置。
在 Pod 規約中對 **安全的** 和 **非安全的** sysctl 參數不做區分。

{{< warning >}}
<!--
Only modify sysctl parameters after you understand their effects, to avoid
destabilizing your operating system.
-->
爲了避免破壞操作系統的穩定性，請你在瞭解變更後果之後再修改 sysctl 參數。
{{< /warning >}}

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sysctl-example
spec:
  securityContext:
    sysctls:
    - name: kernel.shm_rmid_forced
      value: "0"
    - name: net.core.somaxconn
      value: "1024"
    - name: kernel.msgmax
      value: "65536"
  ...
```

<!-- discussion -->

{{< warning >}}
<!--
Due to their nature of being _unsafe_, the use of _unsafe_ sysctls
is at-your-own-risk and can lead to severe problems like wrong behavior of
containers, resource shortage or complete breakage of a node.
-->
由於 **非安全的** sysctl 參數其本身具有不穩定性，在使用 **非安全的** sysctl 參數時可能會導致一些嚴重問題，
如容器的錯誤行爲、機器資源不足或節點被完全破壞，用戶需自行承擔風險。
{{< /warning >}}

<!--
It is good practice to consider nodes with special sysctl settings as
_tainted_ within a cluster, and only schedule pods onto them which need those
sysctl settings. It is suggested to use the Kubernetes [_taints and toleration_
feature](/docs/reference/generated/kubectl/kubectl-commands/#taint) to implement this.
-->
最佳實踐方案是將集羣中具有特殊 sysctl 設置的節點視爲 **有污點的**，並且只調度需要使用到特殊
sysctl 設置的 Pod 到這些節點上。建議使用 Kubernetes
的[污點和容忍度特性](/docs/reference/generated/kubectl/kubectl-commands/#taint) 來實現它。

<!--
A pod with the _unsafe_ sysctls will fail to launch on any node which has not
enabled those two _unsafe_ sysctls explicitly. As with _node-level_ sysctls it
is recommended to use
[_taints and toleration_ feature](/docs/reference/generated/kubectl/kubectl-commands/#taint) or
[taints on nodes](/docs/concepts/scheduling-eviction/taint-and-toleration/)
to schedule those pods onto the right nodes.
-->
設置了 **非安全的** sysctl 參數的 Pod 在禁用了這兩種 **非安全的** sysctl 參數配置的節點上啓動都會失敗。
與 **節點級別的** sysctl 一樣，
建議開啓[污點和容忍度特性](/docs/reference/generated/kubectl/kubectl-commands/#taint)或
[爲節點配置污點](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)以便將
Pod 調度到正確的節點之上。
