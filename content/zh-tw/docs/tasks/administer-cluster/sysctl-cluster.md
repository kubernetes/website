---
title: 在 Kubernetes 叢集中使用 sysctl
content_type: task
---

<!--
title: Using sysctls in a Kubernetes Cluster
reviewers:
- sttts
content_type: task
--->

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="stable" >}}
<!--
This document describes how to configure and use kernel parameters within a
Kubernetes cluster using the {{< glossary_tooltip term_id="sysctl" >}}
interface.
-->
本文件介紹如何透過 {{< glossary_tooltip term_id="sysctl" >}}
介面在 Kubernetes 叢集中配置和使用核心引數。

<!--
Starting from Kubernetes version 1.23, the kubelet supports the use of either `/` or `.`
as separators for sysctl names.
For example, you can represent the same sysctl name as `kernel.shm_rmid_forced` using a
period as the separator, or as `kernel/shm_rmid_forced` using a slash as a separator.
For more sysctl parameter conversion method details, please refer to
the page [sysctl.d(5)](https://man7.org/linux/man-pages/man5/sysctl.d.5.html) from
the Linux man-pages project.
Setting Sysctls for a Pod and PodSecurityPolicy features do not yet support
setting sysctls with slashes.
-->
{{< note >}}
從 Kubernetes 1.23 版本開始，kubelet 支援使用 `/` 或 `.` 作為 sysctl 引數的分隔符。
例如，你可以使用點或者斜線作為分隔符表示相同的 sysctl 引數，以點作為分隔符表示為： `kernel.shm_rmid_forced`，
或者以斜線作為分隔符表示為：`kernel/shm_rmid_forced`。
更多 sysctl 引數轉換方法詳情請參考 Linux man-pages
[sysctl.d(5)](https://man7.org/linux/man-pages/man5/sysctl.d.5.html) 。
設定 Pod 的 Sysctl 引數 和 PodSecurityPolicy 功能尚不支援設定包含斜線的 Sysctl 引數。
{{< /note >}}
## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}

<!--
For some steps, you also need to be able to reconfigure the command line
options for the kubelets running on your cluster.
-->
對一些步驟，你需要能夠重新配置在你的集群裡執行的 kubelet 命令列的選項。

<!-- steps -->

<!--
## Listing all Sysctl Parameters
-->
## 獲取 Sysctl 的引數列表

<!--
In Linux, the sysctl interface allows an administrator to modify kernel
parameters at runtime. Parameters are available via the `/proc/sys/` virtual
process file system. The parameters cover various subsystems such as:
-->
在 Linux 中，管理員可以透過 sysctl 介面修改核心執行時的引數。在 `/proc/sys/`
虛擬檔案系統下存放許多核心引數。這些引數涉及了多個核心子系統，如：

<!--
- kernel (common prefix: `kernel.`)
- networking (common prefix: `net.`)
- virtual memory (common prefix: `vm.`)
- MDADM (common prefix: `dev.`)
- More subsystems are described in [Kernel docs](https://www.kernel.org/doc/Documentation/sysctl/README).
-->
- 核心子系統（通常字首為: `kernel.`）
- 網路子系統（通常字首為: `net.`）
- 虛擬記憶體子系統（通常字首為: `vm.`）
- MDADM 子系統（通常字首為: `dev.`）
- 更多子系統請參見[核心文件](https://www.kernel.org/doc/Documentation/sysctl/README)。

<!--
To get a list of all parameters, you can run
--->
若要獲取完整的引數列表，請執行以下命令

```shell
sudo sysctl -a
```

<!--
## Enabling Unsafe Sysctls

Sysctls are grouped into _safe_  and _unsafe_ sysctls. In addition to proper
namespacing a _safe_ sysctl must be properly _isolated_ between pods on the same
node. This means that setting a _safe_ sysctl for one pod
-->
## 啟用非安全的 Sysctl 引數

sysctl 引數分為 _安全_ 和 _非安全的_。
_安全_ sysctl 引數除了需要設定恰當的名稱空間外，在同一 node 上的不同 Pod 
之間也必須是 _相互隔離的_。這意味著在 Pod 上設定 _安全_ sysctl 引數

<!--
- must not have any influence on any other pod on the node
- must not allow to harm the node's health
- must not allow to gain CPU or memory resources outside of the resource limits
  of a pod.
-->
- 必須不能影響到節點上的其他 Pod
- 必須不能損害節點的健康
- 必須不允許使用超出 Pod 的資源限制的 CPU 或記憶體資源。

<!--
By far, most of the _namespaced_ sysctls are not necessarily considered _safe_.
The following sysctls are supported in the _safe_ set:
-->
至今為止，大多數 _有名稱空間的_ sysctl 引數不一定被認為是 _安全_ 的。
以下幾種 sysctl 引數是 _安全的_：

- `kernel.shm_rmid_forced`
- `net.ipv4.ip_local_port_range`
- `net.ipv4.tcp_syncookies`
- `net.ipv4.ping_group_range` （從 Kubernetes 1.18 開始）
- `net.ipv4.ip_unprivileged_port_start` （從 Kubernetes 1.22 開始）。

<!--
The example `net.ipv4.tcp_syncookies` is not namespaced on Linux kernel version 4.4 or lower.
-->
{{< note >}}
示例中的 `net.ipv4.tcp_syncookies` 在Linux 核心 4.4 或更低的版本中是無名稱空間的。
{{< /note >}}

<!--
This list will be extended in future Kubernetes versions when the kubelet
supports better isolation mechanisms.
-->
在未來的 Kubernetes 版本中，若 kubelet 支援更好的隔離機制，則上述列表中將會
列出更多 _安全的_ sysctl 引數。

<!--
All _safe_ sysctls are enabled by default.
-->
所有 _安全的_ sysctl 引數都預設啟用。

<!--
All _unsafe_ sysctls are disabled by default and must be allowed manually by the
cluster admin on a per-node basis. Pods with disabled unsafe sysctls will be
scheduled, but will fail to launch.
-->
所有 _非安全的_ sysctl 引數都預設禁用，且必須由叢集管理員在每個節點上手動開啟。
那些設定了不安全 sysctl 引數的 Pod 仍會被排程，但無法正常啟動。

<!--
With the warning above in mind, the cluster admin can allow certain _unsafe_
sysctls for very special situations like e.g. high-performance or real-time
application tuning. _Unsafe_ sysctls are enabled on a node-by-node basis with a
flag of the kubelet, e.g.:
-->
參考上述警告，叢集管理員只有在一些非常特殊的情況下（如：高可用或實時應用調整），
才可以啟用特定的 _非安全的_ sysctl 引數。
如需啟用 _非安全的_ sysctl 引數，請你在每個節點上分別設定 kubelet 命令列引數，例如：

```shell
kubelet --allowed-unsafe-sysctls \
  'kernel.msg*,net.core.somaxconn' ...
```

<!--
For {{< glossary_tooltip term_id="minikube" >}}, this can be done via the `extra-config` flag:
-->
如果你使用 {{< glossary_tooltip term_id="minikube" >}}，可以透過 `extra-config` 引數來配置：

```shell
minikube start --extra-config="kubelet.allowed-unsafe-sysctls=kernel.msg*,net.core.somaxconn"...
```
<!--
Only _namespaced_ sysctls can be enabled this way.
-->
只有 _有名稱空間的_ sysctl 引數可以透過該方式啟用。

<!--
## Setting Sysctls for a Pod

A number of sysctls are _namespaced_ in today's Linux kernels. This means that
they can be set independently for each pod on a node. Only namespaced sysctls
are configurable via the pod securityContext within Kubernetes.
-->
## 設定 Pod 的 Sysctl 引數

目前，在 Linux 核心中，有許多的 sysctl 引數都是 _有名稱空間的_ 。 
這就意味著可以為節點上的每個 Pod 分別去設定它們的 sysctl 引數。 
在 Kubernetes 中，只有那些有名稱空間的 sysctl 引數可以透過 Pod 的 securityContext 對其進行配置。

<!--
The following sysctls are known to be namespaced. This list could change
in future versions of the Linux kernel.
-->
以下列出有名稱空間的 sysctl 引數，在未來的 Linux 核心版本中，此列表可能會發生變化。

- `kernel.shm*`,
- `kernel.msg*`,
- `kernel.sem`,
- `fs.mqueue.*`,
- `net.*`（核心中可以在容器命名空間裡被更改的網路配置項相關引數）。然而也有一些特例
  （例如，`net.netfilter.nf_conntrack_max` 和 `net.netfilter.nf_conntrack_expect_max`
  可以在容器命名空間裡被更改，但它們是非名稱空間的）。

<!--
Sysctls with no namespace are called _node-level_ sysctls. If you need to set
them, you must manually configure them on each node's operating system, or by
using a DaemonSet with privileged containers.
-->
沒有名稱空間的 sysctl 引數稱為 _節點級別的_ sysctl 引數。
如果需要對其進行設定，則必須在每個節點的作業系統上手動地去配置它們，
或者透過在 DaemonSet 中執行特權模式容器來配置。

<!--
Use the pod securityContext to configure namespaced sysctls. The securityContext
applies to all containers in the same pod.
-->
可使用 Pod 的 securityContext 來配置有名稱空間的 sysctl 引數，
securityContext 應用於同一個 Pod 中的所有容器。

<!--
This example uses the pod securityContext to set a safe sysctl
`kernel.shm_rmid_forced` and two unsafe sysctls `net.core.somaxconn` and
`kernel.msgmax` There is no distinction between _safe_ and _unsafe_ sysctls in
the specification.
-->
此示例中，使用 Pod SecurityContext 來對一個安全的 sysctl 引數
`kernel.shm_rmid_forced` 以及兩個非安全的 sysctl 引數
`net.core.somaxconn` 和 `kernel.msgmax` 進行設定。
在 Pod 規約中對 _安全的_ 和 _非安全的_ sysctl 引數不做區分。

<!--
Only modify sysctl parameters after you understand their effects, to avoid
destabilizing your operating system.
-->
{{< warning >}}
為了避免破壞作業系統的穩定性，請你在瞭解變更後果之後再修改 sysctl 引數。
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
<!--
Due to their nature of being _unsafe_, the use of _unsafe_ sysctls
is at-your-own-risk and can lead to severe problems like wrong behavior of
containers, resource shortage or complete breakage of a node.
-->
{{< warning >}}
由於 _非安全的_ sysctl 引數其本身具有不穩定性，在使用 _非安全的_ sysctl 引數
時可能會導致一些嚴重問題，如容器的錯誤行為、機器資源不足或節點被完全破壞，
使用者需自行承擔風險。
{{< /warning >}}

<!--
It is good practice to consider nodes with special sysctl settings as
_tainted_ within a cluster, and only schedule pods onto them which need those
sysctl settings. It is suggested to use the Kubernetes [_taints and toleration_
feature](/docs/reference/generated/kubectl/kubectl-commands/#taint) to implement this.
-->
最佳實踐方案是將叢集中具有特殊 sysctl 設定的節點視為 _有汙點的_，並且只調度
需要使用到特殊 sysctl 設定的 Pod 到這些節點上。
建議使用 Kubernetes 的
[汙點和容忍度特性](/docs/reference/generated/kubectl/kubectl-commands/#taint) 來實現它。

<!--
A pod with the _unsafe_ sysctls will fail to launch on any node which has not
enabled those two _unsafe_ sysctls explicitly. As with _node-level_ sysctls it
is recommended to use
[_taints and toleration_ feature](/docs/reference/generated/kubectl/kubectl-commands/#taint) or
[taints on nodes](/docs/concepts/configuration/taint-and-toleration/)
to schedule those pods onto the right nodes.
-->
設定了 _非安全的_ sysctl 引數的 Pod 在禁用了這兩種 _非安全的_ sysctl 引數配置
的節點上啟動都會失敗。與 _節點級別的_ sysctl 一樣，建議開啟
[汙點和容忍度特性](/docs/reference/generated/kubectl/kubectl-commands/#taint) 或
[為節點配置汙點](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)
以便將 Pod 排程到正確的節點之上。

## PodSecurityPolicy

{{< feature-state for_k8s_version="v1.21" state="deprecated" >}}

<!--
You can further control which sysctls can be set in pods by specifying lists of
sysctls or sysctl patterns in the `forbiddenSysctls` and/or
`allowedUnsafeSysctls` fields of the PodSecurityPolicy. A sysctl pattern ends
with a `*` character, such as `kernel.*`. A `*` character on its own matches
all sysctls.
-->
你可以透過在 PodSecurityPolicy 的 `forbiddenSysctls` 和/或 `allowedUnsafeSysctls`
欄位中，指定 sysctl 或填寫 sysctl 匹配模式來進一步為 Pod 設定 sysctl 引數。
sysctl 引數匹配模式以 `*` 字元結尾，如 `kernel.*`。 
單獨的 `*`  字元匹配所有 sysctl 引數。

<!--
By default, all safe sysctls are allowed.
-->
所有 _安全的_ sysctl 引數都預設啟用。

<!--
Both `forbiddenSysctls` and `allowedUnsafeSysctls` are lists of plain sysctl names
or sysctl patterns (which end with `*`). The string `*` matches all sysctls.
-->
`forbiddenSysctls` 和 `allowedUnsafeSysctls` 的值都是字串列表型別，
可以新增 sysctl 引數名稱，也可以新增 sysctl 引數匹配模式（以`*`結尾）。 
只填寫 `*` 則匹配所有的 sysctl 引數。

<!--
The `forbiddenSysctls` field excludes specific sysctls. You can forbid a
combination of safe and unsafe sysctls in the list. To forbid setting any
sysctls, use `*` on its own.
-->
`forbiddenSysctls` 欄位用於禁用特定的 sysctl 引數。
你可以在列表中禁用安全和非安全的 sysctl 引數的組合。 
要禁用所有的 sysctl 引數，請設定為 `*`。

<!--
If you specify any unsafe sysctl in the `allowedUnsafeSysctls` field and it is
not present in the `forbiddenSysctls` field, that sysctl can be used in Pods
using this PodSecurityPolicy. To allow all unsafe sysctls in the
PodSecurityPolicy to be set, use `*` on its own.
-->
如果要在 `allowedUnsafeSysctls` 欄位中指定一個非安全的 sysctl 引數，
並且它在 `forbiddenSysctls` 欄位中未被禁用，則可以在 Pod 中透過
PodSecurityPolicy 啟用該 sysctl 引數。
若要在 PodSecurityPolicy 中開啟所有非安全的 sysctl 引數，
請設 `allowedUnsafeSysctls` 欄位值為 `*`。

<!--
Do not configure these two fields such that there is overlap, meaning that a
given sysctl is both allowed and forbidden.
-->
`allowedUnsafeSysctls` 與 `forbiddenSysctls` 兩欄位的配置不能重疊，
否則這就意味著存在某個 sysctl 引數既被啟用又被禁用。

<!--
If you whitelist unsafe sysctls via the `allowedUnsafeSysctls` field
in a PodSecurityPolicy, any pod using such a sysctl will fail to start
if the sysctl is not whitelisted via the `--allowed-unsafe-sysctls` kubelet
flag as well on that node.
--->
{{< warning >}}
如果你透過 PodSecurityPolicy 中的 `allowedUnsafeSysctls` 欄位將非安全的 sysctl
引數列入白名單，但該 sysctl 引數未透過 kubelet 命令列引數
`--allowed-unsafe-sysctls` 在節點上將其列入白名單，則設定了這個 sysctl
引數的 Pod 將會啟動失敗。
{{< /warning >}}

<!--
This example allows unsafe sysctls prefixed with `kernel.msg` to be set and
disallows setting of the `kernel.shm_rmid_forced` sysctl.
-->
以下示例設定啟用了以 `kernel.msg` 為字首的非安全的 sysctl 引數，同時禁用了
sysctl 引數 `kernel.shm_rmid_forced`。

```yaml
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: sysctl-psp
spec:
  allowedUnsafeSysctls:
  - kernel.msg*
  forbiddenSysctls:
  - kernel.shm_rmid_forced
 ...
```

