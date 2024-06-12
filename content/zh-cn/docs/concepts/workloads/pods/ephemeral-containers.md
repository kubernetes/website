---
title: 临时容器
content_type: concept
weight: 60
---

<!--
reviewers:
- verb
- yujuhong
title: Ephemeral Containers
content_type: concept
weight: 60
-->

<!-- overview -->

{{< feature-state state="stable" for_k8s_version="v1.25" >}}

<!--
This page provides an overview of ephemeral containers: a special type of container
that runs temporarily in an existing {{< glossary_tooltip term_id="pod" >}} to
accomplish user-initiated actions such as troubleshooting. You use ephemeral
containers to inspect services rather than to build applications.
-->
本页面概述了临时容器：一种特殊的容器，该容器在现有
{{< glossary_tooltip text="Pod" term_id="pod" >}}
中临时运行，以便完成用户发起的操作，例如故障排查。
你会使用临时容器来检查服务，而不是用它来构建应用程序。

<!-- body -->

<!--
## Understanding ephemeral containers

{{< glossary_tooltip text="Pods" term_id="pod" >}} are the fundamental building
block of Kubernetes applications. Since Pods are intended to be disposable and
replaceable, you cannot add a container to a Pod once it has been created.
Instead, you usually delete and replace Pods in a controlled fashion using
{{< glossary_tooltip text="deployments" term_id="deployment" >}}.
-->
## 了解临时容器   {#understanding-ephemeral-containers}

{{< glossary_tooltip text="Pod" term_id="pod" >}} 是 Kubernetes 应用程序的基本构建块。
由于 Pod 是一次性且可替换的，因此一旦 Pod 创建，就无法将容器加入到 Pod 中。
取而代之的是，通常使用 {{< glossary_tooltip text="Deployment" term_id="deployment" >}}
以受控的方式来删除并替换 Pod。

<!--
Sometimes it's necessary to inspect the state of an existing Pod, however, for
example to troubleshoot a hard-to-reproduce bug. In these cases you can run
an ephemeral container in an existing Pod to inspect its state and run
arbitrary commands.
-->
有时有必要检查现有 Pod 的状态。例如，对于难以复现的故障进行排查。
在这些场景中，可以在现有 Pod 中运行临时容器来检查其状态并运行任意命令。

<!--
### What is an ephemeral container?

Ephemeral containers differ from other containers in that they lack guarantees
for resources or execution, and they will never be automatically restarted, so
they are not appropriate for building applications.  Ephemeral containers are
described using the same `ContainerSpec` as regular containers, but many fields
are incompatible and disallowed for ephemeral containers.
-->
### 什么是临时容器？    {#what-is-an-ephemeral-container}

临时容器与其他容器的不同之处在于，它们缺少对资源或执行的保证，并且永远不会自动重启，
因此不适用于构建应用程序。
临时容器使用与常规容器相同的 `ContainerSpec` 节来描述，但许多字段是不兼容和不允许的。

<!--
- Ephemeral containers may not have ports, so fields such as `ports`,
  `livenessProbe`, `readinessProbe` are disallowed.
- Pod resource allocations are immutable, so setting `resources` is disallowed.
- For a complete list of allowed fields, see the [EphemeralContainer reference
  documentation](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ephemeralcontainer-v1-core).
-->
- 临时容器没有端口配置，因此像 `ports`、`livenessProbe`、`readinessProbe`
  这样的字段是不允许的。
- Pod 资源分配是不可变的，因此 `resources` 配置是不允许的。
- 有关允许字段的完整列表，请参见
  [EphemeralContainer 参考文档](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ephemeralcontainer-v1-core)。

<!--
Ephemeral containers are created using a special `ephemeralcontainers` handler
in the API rather than by adding them directly to `pod.spec`, so it's not
possible to add an ephemeral container using `kubectl edit`.
-->
临时容器是使用 API 中的一种特殊的 `ephemeralcontainers` 处理器进行创建的，
而不是直接添加到 `pod.spec` 段，因此无法使用 `kubectl edit` 来添加一个临时容器。

<!--
Like regular containers, you may not change or remove an ephemeral container
after you have added it to a Pod.
-->
与常规容器一样，将临时容器添加到 Pod 后，将不能更改或删除临时容器。

{{< note >}}
<!--
Ephemeral containers are not supported by [static pods](/docs/tasks/configure-pod-container/static-pod/).
-->
临时容器不被[静态 Pod](/zh-cn/docs/tasks/configure-pod-container/static-pod/) 支持。
{{< /note >}}

<!--
## Uses for ephemeral containers

Ephemeral containers are useful for interactive troubleshooting when `kubectl
exec` is insufficient because a container has crashed or a container image
doesn't include debugging utilities.
-->
## 临时容器的用途   {#uses-for-ephemeral-containers}

当由于容器崩溃或容器镜像不包含调试工具而导致 `kubectl exec` 无用时，
临时容器对于交互式故障排查很有用。

<!--
In particular, [distroless images](https://github.com/GoogleContainerTools/distroless)
enable you to deploy minimal container images that reduce attack surface
and exposure to bugs and vulnerabilities. Since distroless images do not include a
shell or any debugging utilities, it's difficult to troubleshoot distroless
images using `kubectl exec` alone.
-->
尤其是，[Distroless 镜像](https://github.com/GoogleContainerTools/distroless)
允许用户部署最小的容器镜像，从而减少攻击面并减少故障和漏洞的暴露。
由于 distroless 镜像不包含 Shell 或任何的调试工具，因此很难单独使用
`kubectl exec` 命令进行故障排查。

<!--
When using ephemeral containers, it's helpful to enable [process namespace
sharing](/docs/tasks/configure-pod-container/share-process-namespace/) so
you can view processes in other containers.
-->
使用临时容器时，
启用[进程名字空间共享](/zh-cn/docs/tasks/configure-pod-container/share-process-namespace/)很有帮助，
可以查看其他容器中的进程。

{{% heading "whatsnext" %}}

<!--
* Learn how to [debug pods using ephemeral containers](/docs/tasks/debug/debug-application/debug-running-pod/#ephemeral-container).
-->
* 了解如何[使用临时调试容器来进行调试](/zh-cn/docs/tasks/debug/debug-application/debug-running-pod/#ephemeral-container)
