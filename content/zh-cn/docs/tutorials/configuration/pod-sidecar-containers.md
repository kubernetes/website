---
title: 使用边车（Sidecar）容器
content_type: tutorial
weight: 40
min-kubernetes-server-version: 1.29
---
<!--
title: Adopting Sidecar Containers
content_type: tutorial
weight: 40
min-kubernetes-server-version: 1.29
-->

<!-- overview -->

<!--
This section is relevant for people adopting a new built-in
[sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/) feature for their workloads.

Sidecar container is not a new concept as posted in the
[blog post](/blog/2015/06/the-distributed-system-toolkit-patterns/).
Kubernetes allows running multiple containers in a Pod to implement this concept.
However, running a sidecar container as a regular container
has a lot of limitations being fixed with the new built-in sidecar containers support.
-->
本文适用于使用新的内置[边车容器](/docs/concepts/workloads/pods/sidecar-containers/)特性的用户。

边车容器并不是一个新概念，正如在[博客文章](/blog/2015/06/the-distributed-system-toolkit-patterns/)中所提到的那样。
Kubernetes 允许在一个 Pod 中运行多个容器来实现这一概念。然而，作为一个普通容器运行边车容器存在许多限制，
这些限制通过新的内置边车容器支持得到了解决。

{{< feature-state feature_gate_name="SidecarContainers" >}}

## {{% heading "objectives" %}}

<!--
- Understand the need for sidecar containers
- Be able to troubleshoot issues with the sidecar containers
- Understand options to universally "inject" sidecar containers to any workload
-->
- 理解边车容器的需求
- 能够排查边车容器的问题
- 了解如何"注入"边车容器到任意的工作负载中

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- lessoncontent -->

<!--
## Sidecar containers overview

Sidecar containers are secondary containers that run along with the main
application container within the same {{< glossary_tooltip text="Pod" term_id="pod" >}}.
These containers are used to enhance or to extend the functionality of the primary _app
container_ by providing additional services, or functionalities such as logging, monitoring,
security, or data synchronization, without directly altering the primary application code.
You can read more in the [Sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/)
concept page.
-->
## 边车容器概述

边车容器是与主应用程序容器在同一 {{< glossary_tooltip text="Pod" term_id="pod" >}}
内一起运行的辅助容器。这些容器通过提供额外的服务或功能（如日志记录、监控、安全或数据同步）来增强或扩展主**应用容器**的功能，
而无需直接修改主应用程序代码。你可以在[边车容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)概念页面中阅读更多相关内容。

<!--
The concept of sidecar containers is not new and there are multiple implementations of this concept.
As well as sidecar containers that you, the person defining the Pod, want to run, you can also find
that some {{< glossary_tooltip text="addons" term_id="addons" >}} modify Pods - before the Pods
start running - so that there are extra sidecar containers. The mechanisms to _inject_ those extra
sidecars are often [mutating webhooks](/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook).
For example, a service mesh addon might inject a sidecar that configures mutual TLS and encryption
in transit between different Pods.
-->
边车容器的概念并不新鲜，有许多不同的实现方式。除了你（定义 Pod 的人）希望运行的边车容器外，
一些{{< glossary_tooltip text="插件" term_id="addons" >}}也会在 Pod 开始运行之前对其进行修改，
以添加额外的边车容器。这些额外边车容器的**注入**机制通常是[变更 Webhook（Mutating Webhook）](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#mutatingadmissionwebhook)。
例如，服务网格插件可能会注入一个配置双向 TLS（Mutual TLS）和传输中加密的边车容器。

<!--
While the concept of sidecar containers is not new,
the native implementation of this feature in Kubernetes, however, is new. And as with every new feature,
adopting this feature may present certain challenges.

This tutorial explores challenges and solutions that can be experienced by end users as well as
by authors of sidecar containers.
-->
虽然边车容器的概念并不新鲜，但 Kubernetes 对这一特性的原生实现却是新的。
与每一项新特性一样，采用这一特性可能会带来某些挑战。

本教程探讨了终端用户和边车容器作者可能遇到的挑战及其解决方案。

<!--
## Benefits of a built-in sidecar container

Using Kubernetes' native support for sidecar containers provides several benefits:

1. You can configure a native sidecar container to start ahead of
   {{< glossary_tooltip text="init containers" term_id="init-container" >}}.
1. The built-in sidecar containers can be authored to guarantee that they are terminated last.
   Sidecar containers are terminated with a `SIGTERM` signal once all the regular containers
   are completed and terminated. If the sidecar container isn’t gracefully shut down, a
   `SIGKILL` signal will be used to terminate it.
1. With Jobs, when Pod's `restartPolicy: OnFailure` or `restartPolicy: Never`,
   native sidecar containers do not block Pod completion. With legacy sidecar containers,
   special care is needed to handle this situation.
1. Also, with Jobs, built-in sidecar containers would keep being restarted once they are done,
   even if regular containers would not with Pod's `restartPolicy: Never`.

See [differences from init containers](/docs/concepts/workloads/pods/sidecar-containers/#differences-from-application-containers)
to learn more about it.
-->
## 内置边车容器的优势

使用 Kubernetes 对边车容器的原生支持可以带来以下几个好处：

1. 你可以配置原生边车容器在 {{< glossary_tooltip text="Init 容器" term_id="init-container" >}}之前启动。
2. 内置边车容器可以编写为确保它们最后终止。一旦所有常规容器完成并终止，边车容器将接收到 `SIGTERM` 信号。
   如果边车容器未能体面关闭，系统将使用 `SIGKILL` 信号终止它。
3. 在 Job 中，当 Pod 配置 `restartPolicy: OnFailure` 或 `restartPolicy: Never` 时，
   原生边车容器不会阻止 Pod 完成。而对于传统边车容器，需要特别处理这种情况。
4. 同样在 Job 中，即使 Pod 的 `restartPolicy: Never` 时常规容器不会重启，
   内置边车容器仍会在完成后继续重启。

更多详情请参见[与 Init 容器的区别](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/#differences-from-application-containers)。

<!--
## Adopting built-in sidecar containers

The `SidecarContainers` [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
is in beta state starting from Kubernetes version 1.29 and is enabled by default.
Some clusters may have this feature disabled or have software installed that is incompatible with the feature.

When this happens, the Pod may be rejected or the sidecar containers may block Pod startup,
rendering the Pod useless. This condition is easy to detect as the Pod simply gets stuck on
initialization. However, it is often unclear what caused the problem.

Here are the considerations and troubleshooting steps that one can take while adopting sidecar containers for their workload.
-->
## 采用内置边车容器

从 Kubernetes 1.29 版本开始，`SidecarContainers`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)处于 Beta 阶段，
并默认启用。某些集群可能禁用了此特性，或者安装了与该特性不兼容的软件。

当这种情况发生时，Pod 可能会被拒绝，或者边车容器可能阻止 Pod 启动，导致 Pod 无法使用。
这种情况下很容易检测到问题，因为 Pod 会卡在初始化阶段。然而，通常不清楚是什么原因导致了问题。

以下是在使用边车容器处理工作负载时可以考虑的因素和排查步骤。

<!--
### Ensure the feature gate is enabled

As a very first step, make sure that both API server and Nodes are at Kubernetes version v1.29 or
later. The feature will break on clusters where Nodes are running earlier versions where it is not enabled.
-->
### 确保特性门控已启用

首先，确保 API 服务器和节点都在 Kubernetes v1.29 及更高版本上运行。
如果节点运行的是早期版本且未启用该特性，集群中的该特性将无法正常工作。

<!--
title="Note" color="info"
-->
{{< alert title="注意" color="info" >}}

<!--
The feature can be enabled on nodes with the version 1.28. The behavior of built-in sidecar
container termination was different in version 1.28, and it is not recommended to adjust
the behavior of a sidecar to that behavior. However, if the only concern is the startup order, the
above statement can be changed to Nodes running version 1.28 with the feature gate enabled.
-->
此特性可以在 1.28 版本的节点上启用。然而，内置边车容器的终止行为在 1.28 版本中有所不同，
不建议将边车的行为调整为 1.28 中的行为。但是，如果唯一的关注点是启动顺序，
上述陈述可以改为：运行 1.28 版本并启用了特性门控的节点。

{{< /alert >}}

<!--
You should ensure that the feature gate is enabled for the API server(s) within the control plane
**and** for all nodes.

One of the ways to check the feature gate enablement is to run a command like this:

- For API Server:
-->
你应该确保控制平面内的 API 服务器**和**所有节点都启用了特性门控。

一种检查特性门控是否启用的方法是运行如下命令：

- 对于 API 服务器：

  ```shell
  kubectl get --raw /metrics | grep kubernetes_feature_enabled | grep SidecarContainers
  ```

<!--
- For the individual node:
-->
- 对于单个节点：

  ```shell
  kubectl get --raw /api/v1/nodes/<node-name>/proxy/metrics | grep kubernetes_feature_enabled | grep SidecarContainers
  ```

<!--
If you see something like this:
-->
如果你看到类似这样的内容：

```
kubernetes_feature_enabled{name="SidecarContainers",stage="BETA"} 1
```

<!--
it means that the feature is enabled.
-->
表示该特性已启用。

<!--
### Check for 3rd party tooling and mutating webhooks

If you experience issues when validating the feature, it may be an indication that one of the
3rd party tools or mutating webhooks are broken.

When the `SidecarContainers` feature gate is enabled, Pods gain a new field in their API.
Some tools or mutating webhooks might have been built with an earlier version of Kubernetes API.

If tools pass unknown fields as-is using various patching strategies to mutate a Pod object,
this will not be a problem. However, there are tools that will strip out unknown fields;
if you have those, they must be recompiled with the v1.28+ version of Kubernetes API client code.

The way to check this is to use the `kubectl describe pod` command with your Pod that has passed through
mutating admission. If any tools stripped out the new field (`restartPolicy:Always`),
you will not see it in the command output.

If you hit an issue like this, please advise the author of the tools or the webhooks
use one of the patching strategies for modifying objects instead of a full object update.
-->
### 检查第三方工具和变更 Webhook

如果你在验证特性时遇到问题，这可能表明某个第三方工具或变更 Webhook 出现了问题。

当 `SidecarContainers` 特性门控启用后，Pod 在其 API 中会新增一个字段。
某些工具或变更 Webhook 可能是基于早期版本的 Kubernetes API 构建的。

如果工具使用各种修补策略将未知字段原样传递，这不会有问题。然而，有些工具会删除未知字段；
如果你使用的是这些工具，必须使用 v1.28+ 版本的 Kubernetes API 客户端代码重新编译它们。

检查这一点的方法是使用 `kubectl describe pod` 命令查看已通过变更准入的 Pod。
如果任何工具删除了新字段（如 `restartPolicy: Always`），你将不会在命令输出中看到它。

如果你遇到了此类问题，请告知工具或 Webhook 的作者使用修补策略来修改对象，而不是进行完整的对象更新。

<!--
title="Note" color="info"
-->
{{< alert  title="注意" color="info" >}}

<!--
Mutating webhook may update Pods based on some conditions.
Thus, sidecar containers may work for some Pods and fail for others.
-->
变更 Webhook 可能会根据某些条件更新 Pod。
因此，边车容器可能对某些 Pod 有效，但对其他 Pod 无效。

{{< /alert >}}

<!--
### Automatic injection of sidecars

If you are using software that injects sidecars automatically,
there are a few possible strategies you may follow to
ensure that native sidecar containers can be used.
All strategies are generally options you may choose to decide whether
the Pod the sidecar will be injected to will land on a Node supporting the feature or not.

As an example, you can follow [this conversation in Istio community](https://github.com/istio/istio/issues/48794).
The discussion explores the options listed below.
-->
### 边车的自动注入

如果你使用的是自动注入边车的软件，可以采取几种策略来确保能够使用原生边车容器。
所有这些策略通常都是你可以选择的选项，以决定注入边车的 Pod 是否会落在支持该特性的节点上。

例如，可以参考 [Istio 社区中的这次讨论](https://github.com/istio/istio/issues/48794)。
讨论中探讨了以下选项：

<!--
1. Mark Pods that land to nodes supporting sidecars. You can use node labels
   and node affinity to mark nodes supporting sidecar containers and Pods landing on those nodes.
-->
1. 标记支持边车的节点上的 Pod。你可以使用节点标签和节点亲和性来标记支持边车容器的节点以及落在这些节点上的 Pod。
<!--
1. Check Nodes compatibility on injection. During sidecar injection, you may use
   the following strategies to check node compatibility:
   - query node version and assume the feature gate is enabled on the version 1.29+
   - query node prometheus metrics and check feature enablement status
   - assume the nodes are running with a [supported version skew](/releases/version-skew-policy/#supported-version-skew)
     from the API server
   - there may be other custom ways to detect nodes compatibility.
-->
2. 注入时检查节点兼容性。在边车注入过程中，可以使用以下策略来检查节点兼容性：
   - 查询节点版本并假设版本 1.29+ 上启用了特性门控。
   - 查询节点 Prometheus 指标并检查特性启用状态。
   - 假设节点与 API 服务器的版本差异在[支持的版本范围](/zh-cn/releases/version-skew-policy/#supported-version-skew)内。
   - 可能还有其他自定义方法来检测节点兼容性。
<!--
1. Develop a universal sidecar injector. The idea of a universal sidecar injector is to
   inject a sidecar container as a regular container as well as a native sidecar container.
   And have a runtime logic to decide which one will work. The universal sidecar injector
   is wasteful, as it will account for requests twice, but may be considered as a workable
   solution for special cases.
-->
3. 开发通用边车注入器（Sidecar Injector）。通用边车注入器的想法是在注入一个普通容器的同时注入一个原生边车容器，并在运行时决定哪个容器会生效。
   通用边车注入器虽然浪费资源（因为它会两次计算请求量），但在某些特殊情况下可以视为可行的解决方案。
   <!--
   - One way would be on start of a native sidecar container
     detect the node version and exit immediately if the version does not support the sidecar feature.
   - Consider a runtime feature detection design:
     - Define an empty dir so containers can communicate with each other
     - Inject an init container, let's call it `NativeSidecar` with `restartPolicy=Always`.
     - `NativeSidecar` must write a file to an empty directory indicating the first run and exit
       immediately with exit code `0`.
   -->
   - 一种方法是在原生边车容器启动时检测节点版本，如果不支持边车特性则立即退出。
   - 考虑运行时特性检测设计：
     - 定义一个空目录（Empty Dir）以便容器之间通信。
     - 注入一个 Init 容器，我们称之为 `NativeSidecar`，并设置 `restartPolicy=Always`。
     - `NativeSidecar` 必须在空目录中写入一个文件，表示首次运行并立即退出，退出码为 `0`。
     <!--
     - `NativeSidecar` on restart (when native sidecars are supported) checks that file already
       exists in the empty dir and changes it - indicating that the built-in sidecar containers
       are supported and running.
     - Inject regular container, let's call it `OldWaySidecar`.
     - `OldWaySidecar` on start checks the presence of a file in an empty dir.
     - If the file indicates that the `NativeSidecar` is NOT running, it assumes that the sidecar
       feature is not supported and works assuming it is the sidecar.
     - If the file indicates that the `NativeSidecar` is running, it either does nothing and sleeps
       forever (in the case when Pod’s `restartPolicy=Always`) or exits immediately with exit code `0`
       (in the case when Pod’s `restartPolicy!=Always`).
     -->
     - `NativeSidecar` 在重启时（当支持原生边车时）检查空目录中是否已存在该文件，并进行更改 —— 表示已支持原生边车容器并正在运行。
     - 注入一个普通容器，我们称之为 `OldWaySidecar`。
     - `OldWaySidecar` 启动时检查空目录中是否存在文件。
     - 如果文件表示 `NativeSidecar` 未运行，则假设边特性不支持，并按边车的方式工作。
     - 如果文件表示 `NativeSidecar` 正在运行，则根据 Pod 的 `restartPolicy` 决定行为：
     - 如果 Pod 的 `restartPolicy=Always`，则不做任何操作并永远休眠。
     - 如果 Pod 的 `restartPolicy!=Always`，则立即退出，退出码为 `0`。

## {{% heading "whatsnext" %}}

<!--
- Learn more about [sidecar containers](/docs/concepts/workloads/pods/sidecar-containers/).
-->
- 了解有关[边车容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)的更多信息。
