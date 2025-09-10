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
Seccomp 表示安全计算（Secure Computing）模式，自 2.6.12 版本以来，一直是 Linux 内核的一个特性。
它可以用来沙箱化进程的权限，限制进程从用户态到内核态的调用。
Kubernetes 能使你自动将加载到{{< glossary_tooltip text="节点" term_id="node" >}}上的
seccomp 配置文件应用到你的 Pod 和容器。

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
有四种方式可以为 {{< glossary_tooltip text="Pod" term_id="pod" >}} 指定 seccomp 配置文件：

- 为整个 Pod 使用
  [`spec.securityContext.seccompProfile`](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)
- 为单个容器使用
  [`spec.containers[*].securityContext.seccompProfile`](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-1)
- 为（可重启/边车）Init 容器使用
  [`spec.initContainers[*].securityContext.seccompProfile`](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context-1)
- 为[临时容器](/zh-cn/docs/concepts/workloads/pods/ephemeral-containers)使用
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
上面的示例中的 Pod 以 `Unconfined` 运行，而 `ephemeral-container` 和
`init-container` 独立设置了 `RuntimeDefault`。
如果临时容器或 Init 容器没有明确设置 `securityContext.seccompProfile` 字段，
则此值将从 Pod 继承。同样的机制也适用于运行 `Localhost` 配置文件 `my-profile.json` 的容器。

一般来说，（临时）容器的字段优先级高于 Pod 层级的值，而未设置 seccomp 字段的容器则从 Pod 继承配置。

{{< note >}}
<!--
It is not possible to apply a seccomp profile to a Pod or container running with
`privileged: true` set in the container's `securityContext`. Privileged
containers always run as `Unconfined`.
-->
你不可以将 seccomp 配置文件应用到在容器的 `securityContext` 中设置了 `privileged: true` 的
Pod 或容器。特权容器始终以 `Unconfined` 运行。
{{< /note >}}

<!--
The following values are possible for the `seccompProfile.type`:

`Unconfined`
: The workload runs without any seccomp restrictions.
-->
对于 `seccompProfile.type`，可以使用以下值：

`Unconfined`
: 工作负载在没有任何 seccomp 限制的情况下运行。

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
: 由{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}定义的默认
  seccomp 配置文件被应用。这个默认的配置文件旨在提供一套强大的安全默认值，同时保持工作负载的功能不受影响。
  不同的容器运行时及其版本之间的默认配置文件可能会有所不同，
  例如在比较 {{< glossary_tooltip text="CRI-O" term_id="cri-o" >}} 和
  {{< glossary_tooltip text="containerd" term_id="containerd" >}} 的默认配置文件时就会发现不同。

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
: `localhostProfile` 将被应用，这一配置必须位于节点磁盘上（在 Linux 上是 `/var/lib/kubelet/seccomp`）。
  在创建容器时，{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}会验证 seccomp
  配置文件的可用性。如果此配置文件不存在，则容器创建将失败，并报错 `CreateContainerError`。

<!--
### `Localhost` profiles

Seccomp profiles are JSON files following the scheme defined by the
[OCI runtime specification](https://github.com/opencontainers/runtime-spec/blob/f329913/config-linux.md#seccomp).
A profile basically defines actions based on matched syscalls, but also allows
to pass specific values as arguments to syscalls. For example:
-->
### `Localhost` 配置文件   {#localhost-profiles}

Seccomp 配置文件是遵循
[OCI 运行时规范](https://github.com/opencontainers/runtime-spec/blob/f329913/config-linux.md#seccomp)定义的
JSON 文件。配置文件主要根据所匹配的系统调用来定义操作，但也允许将特定值作为参数传递给系统调用。例如：

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
上述配置文件中的 `defaultAction` 被定义为 `SCMP_ACT_ERRNO`，并可回退至 `syscalls` 中所定义的操作。
此错误通过 `defaultErrnoRet` 字段被定义为代码 `38`。

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
: 返回指定的错误码。

`SCMP_ACT_ALLOW`
: 允许执行系统调用。

`SCMP_ACT_KILL_PROCESS`
: 杀死进程。

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
: 仅杀死线程。

`SCMP_ACT_TRAP`
: 发送 `SIGSYS` 信号。

`SCMP_ACT_NOTIFY` 和 `SECCOMP_RET_USER_NOTIF`
: 通知用户空间。

`SCMP_ACT_TRACE`
: 使用指定的值通知跟踪进程。

`SCMP_ACT_LOG`
: 在将操作记录到 syslog 或 auditd 之后，允许执行系统调用。

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
`SCMP_ACT_NOTIFY` 或 `SECCOMP_RET_USER_NOTIF` 这类操作可能不被支持，
具体取决于所使用的容器运行时、OCI 运行时或 Linux 内核版本。也可能存在其他限制，
例如 `SCMP_ACT_NOTIFY` 不能用作 `defaultAction` 或用于某些系统调用（如 `write`）。
所有这些限制由 OCI 运行时
（[runc](https://github.com/opencontainers/runc)、[crun](https://github.com/containers/crun)）
或 [libseccomp](https://github.com/seccomp/libseccomp) 所定义。

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
`syscalls` JSON 数组包含对象列表，每个对象通过系统调用的 `names` 引用系统调用。
例如，`SCMP_ACT_ALLOW` 操作可用于创建包含如上例所示的系统调用的白名单。
也可以使用 `SCMP_ACT_ERRNO` 操作定义另一个列表，但会有不同的返回值（`errnoRet`）。

你还可以指定传递给某些系统调用的参数（`args`）。有关这些高级用例的细节，请参见
[OCI 运行时规范](https://github.com/opencontainers/runtime-spec/blob/f329913/config-linux.md#seccomp)
和 [Seccomp Linux 内核文档](https://www.kernel.org/doc/Documentation/prctl/seccomp_filter.txt)。

<!--
## Further reading

- [Restrict a Container's Syscalls with seccomp](/docs/tutorials/security/seccomp/)
- [Pod Security Standards](/docs/concepts/security/pod-security-standards/)
-->
## 进一步阅读   {#further-reading}

- [使用 seccomp 限制容器的系统调用](/zh-cn/docs/tutorials/security/seccomp/)
- [Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards/)
