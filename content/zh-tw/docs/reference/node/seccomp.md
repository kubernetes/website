---
content_type: reference
title: Seccomp 和 Kubernetes
weight: 80
---
<!--
content_type: reference
title: Seccomp and Kubernetes
weight: 80
-->

<!-- overview -->

<!--
Seccomp stands for secure computing mode and has been a feature of the Linux
kernel since version 2.6.12. It can be used to sandbox the privileges of a
process, restricting the calls it is able to make from userspace into the
kernel. Kubernetes lets you automatically apply seccomp profiles loaded onto a
{{< glossary_tooltip text="node" term_id="node" >}} to your Pods and containers.
-->
Seccomp 表示安全計算（Secure Computing）模式，自 2.6.12 版本以來，一直是 Linux 內核的一個特性。
它可以用來沙箱化進程的權限，限制進程從使用者態到內核態的調用。
Kubernetes 能使你自動將加載到{{< glossary_tooltip text="節點" term_id="node" >}}上的
seccomp 設定文件應用到你的 Pod 和容器。

<!--
## Seccomp fields
-->
## Seccomp 字段   {#seccomp-fields}

{{< feature-state for_k8s_version="v1.19" state="stable" >}}

<!--
There are four ways to specify a seccomp profile for a
{{< glossary_tooltip text="pod" term_id="pod" >}}:

- for the whole Pod using [`spec.securityContext.seccompProfile`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)
- for a single container using [`spec.containers[*].securityContext.seccompProfile`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-1)
- for an (restartable / sidecar) init container using [`spec.initContainers[*].securityContext.seccompProfile`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-1)
- for an [ephemeral container](/docs/concepts/workloads/pods/ephemeral-containers) using [`spec.ephemeralContainers[*].securityContext.seccompProfile`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-2)
-->
有四種方式可以爲 {{< glossary_tooltip text="Pod" term_id="pod" >}} 指定 seccomp 設定文件：

- 爲整個 Pod 使用
  [`spec.securityContext.seccompProfile`](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)
- 爲單個容器使用
  [`spec.containers[*].securityContext.seccompProfile`](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-1)
- 爲（可重啓/邊車）Init 容器使用
  [`spec.initContainers[*].securityContext.seccompProfile`](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-1)
- 爲[臨時容器](/zh-cn/docs/concepts/workloads/pods/ephemeral-containers)使用
  [`spec.ephemeralContainers[*].securityContext.seccompProfile`](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-2)

{{% code_sample file="pods/security/seccomp/fields.yaml" %}}

<!--
The Pod in the example above runs as `Unconfined`, while the
`ephemeral-container` and `init-container` specifically defines
`RuntimeDefault`. If the ephemeral or init container would not have set the
`securityContext.seccompProfile` field explicitly, then the value would be
inherited from the Pod. The same applies to the container, which runs a
`Localhost` profile `my-profile.json`.

Generally speaking, fields from (ephemeral) containers have a higher priority
than the Pod level value, while containers which do not set the seccomp field
inherit the profile from the Pod.
-->
上面的示例中的 Pod 以 `Unconfined` 運行，而 `ephemeral-container` 和
`init-container` 獨立設置了 `RuntimeDefault`。
如果臨時容器或 Init 容器沒有明確設置 `securityContext.seccompProfile` 字段，
則此值將從 Pod 繼承。同樣的機制也適用於運行 `Localhost` 設定文件 `my-profile.json` 的容器。

一般來說，（臨時）容器的字段優先級高於 Pod 層級的值，而未設置 seccomp 字段的容器則從 Pod 繼承設定。

{{< note >}}
<!--
It is not possible to apply a seccomp profile to a Pod or container running with
`privileged: true` set in the container's `securityContext`. Privileged
containers always run as `Unconfined`.
-->
你不可以將 seccomp 設定文件應用到在容器的 `securityContext` 中設置了 `privileged: true` 的
Pod 或容器。特權容器始終以 `Unconfined` 運行。
{{< /note >}}

<!--
The following values are possible for the `seccompProfile.type`:

`Unconfined`
: The workload runs without any seccomp restrictions.
-->
對於 `seccompProfile.type`，可以使用以下值：

`Unconfined`
: 工作負載在沒有任何 seccomp 限制的情況下運行。

<!--
`RuntimeDefault`
: A default seccomp profile defined by the
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
is applied. The default profiles aim to provide a strong set of security
defaults while preserving the functionality of the workload. It is possible that
the default profiles differ between container runtimes and their release
versions, for example when comparing those from
{{< glossary_tooltip text="CRI-O" term_id="cri-o" >}} and
{{< glossary_tooltip text="containerd" term_id="containerd" >}}.
-->
`RuntimeDefault`
: 由{{< glossary_tooltip text="容器運行時" term_id="container-runtime" >}}定義的默認
  seccomp 設定文件被應用。這個默認的設定文件旨在提供一套強大的安全默認值，同時保持工作負載的功能不受影響。
  不同的容器運行時及其版本之間的默認設定文件可能會有所不同，
  例如在比較 {{< glossary_tooltip text="CRI-O" term_id="cri-o" >}} 和
  {{< glossary_tooltip text="containerd" term_id="containerd" >}} 的默認設定文件時就會發現不同。

<!--
`Localhost`
: The `localhostProfile` will be applied, which has to be available on the node
disk (on Linux it's `/var/lib/kubelet/seccomp`). The availability of the seccomp
profile is verified by the
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
on container creation. If the profile does not exist, then the container
creation will fail with a `CreateContainerError`.
-->
`Localhost`
: `localhostProfile` 將被應用，這一設定必須位於節點磁盤上（在 Linux 上是 `/var/lib/kubelet/seccomp`）。
  在創建容器時，{{< glossary_tooltip text="容器運行時" term_id="container-runtime" >}}會驗證 seccomp
  設定文件的可用性。如果此設定文件不存在，則容器創建將失敗，並報錯 `CreateContainerError`。

<!--
### `Localhost` profiles

Seccomp profiles are JSON files following the scheme defined by the
[OCI runtime specification](https://github.com/opencontainers/runtime-spec/blob/f329913/config-linux.md#seccomp).
A profile basically defines actions based on matched syscalls, but also allows
to pass specific values as arguments to syscalls. For example:
-->
### `Localhost` 設定文件   {#localhost-profiles}

Seccomp 設定文件是遵循
[OCI 運行時規範](https://github.com/opencontainers/runtime-spec/blob/f329913/config-linux.md#seccomp)定義的
JSON 文件。設定文件主要根據所匹配的系統調用來定義操作，但也允許將特定值作爲參數傳遞給系統調用。例如：

```json
{
  "defaultAction": "SCMP_ACT_ERRNO",
  "defaultErrnoRet": 38,
  "syscalls": [
    {
      "names": [
        "adjtimex",
        "alarm",
        "bind",
        "waitid",
        "waitpid",
        "write",
        "writev"
      ],
      "action": "SCMP_ACT_ALLOW"
    }
  ]
}
```

<!--
The `defaultAction` in the profile above is defined as `SCMP_ACT_ERRNO` and
will return as fallback to the actions defined in `syscalls`. The error is
defined as code `38` via the `defaultErrnoRet` field.
-->
上述設定文件中的 `defaultAction` 被定義爲 `SCMP_ACT_ERRNO`，並可回退至 `syscalls` 中所定義的操作。
此錯誤通過 `defaultErrnoRet` 字段被定義爲代碼 `38`。

<!--
The following actions are generally possible:

`SCMP_ACT_ERRNO`
: Return the specified error code.

`SCMP_ACT_ALLOW`
: Allow the syscall to be executed.

`SCMP_ACT_KILL_PROCESS`
: Kill the process.
-->
通常可以使用以下操作：

`SCMP_ACT_ERRNO`
: 返回指定的錯誤碼。

`SCMP_ACT_ALLOW`
: 允許執行系統調用。

`SCMP_ACT_KILL_PROCESS`
: 殺死進程。

<!--
`SCMP_ACT_KILL_THREAD` and `SCMP_ACT_KILL`
: Kill only the thread.

`SCMP_ACT_TRAP`
: Throw a `SIGSYS` signal.

`SCMP_ACT_NOTIFY` and `SECCOMP_RET_USER_NOTIF`.
: Notify the user space.

`SCMP_ACT_TRACE`
: Notify a tracing process with the specified value.

`SCMP_ACT_LOG`
: Allow the syscall to be executed after the action has been logged to syslog or
auditd.
-->
`SCMP_ACT_KILL_THREAD` 和 `SCMP_ACT_KILL`
: 僅殺死線程。

`SCMP_ACT_TRAP`
: 發送 `SIGSYS` 信號。

`SCMP_ACT_NOTIFY` 和 `SECCOMP_RET_USER_NOTIF`
: 通知使用者空間。

`SCMP_ACT_TRACE`
: 使用指定的值通知跟蹤進程。

`SCMP_ACT_LOG`
: 在將操作記錄到 syslog 或 auditd 之後，允許執行系統調用。

<!--
Some actions like `SCMP_ACT_NOTIFY` or `SECCOMP_RET_USER_NOTIF` may be not
supported depending on the container runtime, OCI runtime or Linux kernel
version being used. There may be also further limitations, for example that
`SCMP_ACT_NOTIFY` cannot be used as `defaultAction` or for certain syscalls like
`write`. All those limitations are defined by either the OCI runtime
([runc](https://github.com/opencontainers/runc),
[crun](https://github.com/containers/crun)) or
[libseccomp](https://github.com/seccomp/libseccomp).
-->
`SCMP_ACT_NOTIFY` 或 `SECCOMP_RET_USER_NOTIF` 這類操作可能不被支持，
具體取決於所使用的容器運行時、OCI 運行時或 Linux 內核版本。也可能存在其他限制，
例如 `SCMP_ACT_NOTIFY` 不能用作 `defaultAction` 或用於某些系統調用（如 `write`）。
所有這些限制由 OCI 運行時
（[runc](https://github.com/opencontainers/runc)、[crun](https://github.com/containers/crun)）
或 [libseccomp](https://github.com/seccomp/libseccomp) 所定義。

<!--
The `syscalls` JSON array contains a list of objects referencing syscalls by
their respective `names`. For example, the action `SCMP_ACT_ALLOW` can be used
to create a whitelist of allowed syscalls as outlined in the example above. It
would also be possible to define another list using the action `SCMP_ACT_ERRNO`
but a different return (`errnoRet`) value.

It is also possible to specify the arguments (`args`) passed to certain
syscalls. More information about those advanced use cases can be found in the
[OCI runtime spec](https://github.com/opencontainers/runtime-spec/blob/f329913/config-linux.md#seccomp)
and the [Seccomp Linux kernel documentation](https://www.kernel.org/doc/Documentation/prctl/seccomp_filter.txt).
-->
`syscalls` JSON 數組包含對象列表，每個對象通過系統調用的 `names` 引用系統調用。
例如，`SCMP_ACT_ALLOW` 操作可用於創建包含如上例所示的系統調用的白名單。
也可以使用 `SCMP_ACT_ERRNO` 操作定義另一個列表，但會有不同的返回值（`errnoRet`）。

你還可以指定傳遞給某些系統調用的參數（`args`）。有關這些高級用例的細節，請參見
[OCI 運行時規範](https://github.com/opencontainers/runtime-spec/blob/f329913/config-linux.md#seccomp)
和 [Seccomp Linux 內核文檔](https://www.kernel.org/doc/Documentation/prctl/seccomp_filter.txt)。

<!--
## Further reading

- [Restrict a Container's Syscalls with seccomp](/docs/tutorials/security/seccomp/)
- [Pod Security Standards](/docs/concepts/security/pod-security-standards/)
-->
## 進一步閱讀   {#further-reading}

- [使用 seccomp 限制容器的系統調用](/zh-cn/docs/tutorials/security/seccomp/)
- [Pod 安全標準](/zh-cn/docs/concepts/security/pod-security-standards/)
