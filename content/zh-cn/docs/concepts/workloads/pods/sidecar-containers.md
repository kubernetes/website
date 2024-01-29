---
title: 边车容器
content_type: concept
weight: 50
---
<!--
title: Sidecar Containers
content_type: concept
weight: 50
-->

<!-- overview -->
{{< feature-state for_k8s_version="v1.28" state="alpha" >}}

<!--
Sidecar containers are the secondary containers that run along with the main
application container within the same {{< glossary_tooltip text="Pod" term_id="pod" >}}.
These containers are used to enhance or to extend the functionality of the main application
container by providing additional services, or functionality such as logging, monitoring,
security, or data synchronization, without directly altering the primary application code.
-->
边车容器是与主应用容器在同一个 {{< glossary_tooltip text="Pod" term_id="pod" >}} 中运行的辅助容器。
这些容器通过提供额外的服务或功能（如日志记录、监控、安全性或数据同步）来增强或扩展主应用容器的功能，
而无需直接修改主应用代码。

<!-- body -->

<!--
## Enabling sidecar containers

Starting with Kubernetes 1.28, a
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) named
`SidecarContainers` allows you to specify a `restartPolicy` for containers listed in a
Pod's `initContainers` field. These restartable _sidecar_ containers are independent with
other [init containers](/docs/concepts/workloads/pods/init-containers/) and main
application container within the same pod. These can be started, stopped, or restarted
without effecting the main application container and other init containers.
-->
## 启用边车容器   {#enabling-sidecar-containers}

从 Kubernetes 1.28 开始，一个名为 `SidecarContainers`
的[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)允许你为
Pod 的 `initContainers` 字段中列出的容器指定 `restartPolicy`。这些可重启的**边车**容器与同一
Pod 内的其他 [Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)及主应用容器相互独立。
边车容器可以在不影响主应用容器和其他 Init 容器的情况下启动、停止或重启。

<!--
## Sidecar containers and Pod lifecycle

If an init container is created with its `restartPolicy` set to `Always`, it will
start and remain running during the entire life of the Pod. This can be helpful for
running supporting services separated from the main application containers.
-->
## 边车容器和 Pod 生命周期   {#sidecar-containers-and-pod-lifecyle}

如果创建 Init 容器时将 `restartPolicy` 设置为 `Always`，
则它将在整个 Pod 的生命周期内启动并持续运行。这对于运行与主应用容器分离的支持服务非常有帮助。

<!--
If a `readinessProbe` is specified for this init container, its result will be used
to determine the `ready` state of the Pod.

Since these containers are defined as init containers, they benefit from the same
ordering and sequential guarantees as other init containers, allowing them to
be mixed with other init containers into complex Pod initialization flows.
-->
如果为此 Init 容器指定了 `readinessProbe`，其结果将用于确定 Pod 的 `ready` 状态。

由于这些容器被定义为 Init 容器，所以它们享有与其他 Init 容器相同的顺序和按序执行保证，
可以将它们与其他 Init 容器混合在一起，形成复杂的 Pod 初始化流程。

<!--
Compared to regular init containers, sidecars defined within `initContainers` continue to
run after they have started. This is important when there is more than one entry inside
`.spec.initContainers` for a Pod. After a sidecar-style init container is running (the kubelet
has set the `started` status for that init container to true), the kubelet then starts the
next init container from the ordered `.spec.initContainers` list.
That status either becomes true because there is a process running in the
container and no startup probe defined, or as a result of its `startupProbe` succeeding.
-->
与常规 Init 容器相比，在 `initContainers` 中定义的边车容器在启动后继续运行。
当 Pod 的 `.spec.initContainers` 中有多个条目时，这一点非常重要。
在边车风格的 Init 容器运行后（kubelet 将该 Init 容器的 `started` 状态设置为 true），
kubelet 启动 `.spec.initContainers` 这一有序列表中的下一个 Init 容器。
该状态要么因为容器中有一个正在运行的进程且没有定义启动探针而变为 true，
要么是其 `startupProbe` 成功而返回的结果。

<!--
Here's an example of a Deployment with two containers, one of which is a sidecar:
-->
以下是一个具有两个容器的 Deployment 示例，其中一个是边车：

{{% code_sample language="yaml" file="application/deployment-sidecar.yaml" %}}

<!--
This feature is also useful for running Jobs with sidecars, as the sidecar
container will not prevent the Job from completing after the main container
has finished.

Here's an example of a Job with two containers, one of which is a sidecar:
-->
此特性也适用于带有边车的 Job，因为边车容器在主容器完成后不会阻止 Job 的完成。

以下是一个具有两个容器的 Job 示例，其中一个是边车：

{{% code_sample language="yaml" file="application/job/job-sidecar.yaml" %}}

<!--
By default, this feature is not available in Kubernetes. To avail this feature, you
need to enable the [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
named `SidecarContainers`.
-->
Kubernetes 默认不提供此特性。要使用此特性，你需要启用名为 `SidecarContainers`
的[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)。

<!--
## Differences from regular containers

Sidecar containers run alongside regular containers in the same pod. However, they do not
execute the primary application logic; instead, they provide supporting functionality to
the main application.
-->
## 与常规容器的区别   {#differences-from-regular-containers}

边车容器与同一 Pod 中的常规容器并行运行。不过边车容器不执行主应用逻辑，而是为主应用提供支持功能。

<!--
Sidecar containers have their own independent lifecycles. They can be started, stopped,
and restarted independently of regular containers. This means you can update, scale, or
maintain sidecar containers without affecting the primary application.

Sidecar containers share the same network and storage namespaces with the primary
container This co-location allows them to interact closely and share resources.
-->
边车容器具有独立的生命周期。它们可以独立于常规容器启动、停止和重启。
这意味着你可以更新、扩展或维护边车容器，而不影响主应用。

边车容器与主容器共享相同的网络和存储命名空间。这种共存使它们能够紧密交互并共享资源。

<!--
## Differences from init containers

Sidecar containers work alongside the main container, extending its functionality and
providing additional services.
-->
## 与 Init 容器的区别   {#differences-from-init-containers}

边车容器与主容器并行工作，扩展其功能并提供附加服务。

<!--
Sidecar containers run concurrently with the main application container. They are active
throughout the lifecycle of the pod and can be started and stopped independently of the
main container. Unlike [init containers](/docs/concepts/workloads/pods/init-containers/),
sidecar containers support [probes](/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe) to control their lifecycle.
-->
边车容器与主应用容器同时运行。它们在整个 Pod 的生命周期中都处于活动状态，并且可以独立于主容器启动和停止。
与 [Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)不同，
边车容器支持[探针](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe)来控制其生命周期。

<!--
These containers can interact directly with the main application containers, sharing
the same network namespace, filesystem, and environment variables. They work closely
together to provide additional functionality.

## Resource sharing within containers
-->
这些边车容器可以直接与主应用容器进行交互，共享相同的网络命名空间、文件系统和环境变量。
所有这些容器紧密合作，提供额外的功能。

## 容器内的资源共享   {#resource-sharing-within-containers}

{{< comment >}}
<!--
This section is also present in the [init containers](/docs/concepts/workloads/pods/init-containers/) page.
If you're editing this section, change both places.
-->
这部分内容也出现在 [Init 容器](/zh-cn/docs/concepts/workloads/pods/init-containers/)页面上。
如果你正在编辑这部分内容，请同时修改两处。
{{< /comment >}}

<!--
Given the order of execution for init, sidecar and app containers, the following rules
for resource usage apply:
-->
假如执行顺序为 Init 容器、边车容器和应用容器，则关于资源用量适用以下规则：

<!--
* The highest of any particular resource request or limit defined on all init
  containers is the *effective init request/limit*. If any resource has no
  resource limit specified this is considered as the highest limit.
* The Pod's *effective request/limit* for a resource is the sum of
[pod overhead](/docs/concepts/scheduling-eviction/pod-overhead/) and the higher of:
  * the sum of all non-init containers(app and sidecar containers) request/limit for a
  resource
  * the effective init request/limit for a resource
* Scheduling is done based on effective requests/limits, which means
  init containers can reserve resources for initialization that are not used
  during the life of the Pod.
* The QoS (quality of service) tier of the Pod's *effective QoS tier* is the
  QoS tier for all init, sidecar and app containers alike.
-->
* 所有 Init 容器上定义的任何特定资源的 limit 或 request 的最大值，作为
  Pod **有效初始 request/limit**。
  如果任何资源没有指定资源限制，则被视为最高限制。
* Pod 对资源的 **有效 limit/request** 是如下两者中的较大者：
  * 所有应用容器对某个资源的 limit/request 之和
  * Init 容器中对某个资源的有效 limit/request
* 系统基于有效的 limit/request 完成调度，这意味着 Init 容器能够为初始化过程预留资源，
  而这些资源在 Pod 的生命周期中不再被使用。
* Pod 的 **有效 QoS 级别**，对于 Init 容器和应用容器而言是相同的。

<!--
Quota and limits are applied based on the effective Pod request and
limit.

Pod level control groups (cgroups) are based on the effective Pod request and
limit, the same as the scheduler.
-->
配额和限制适用于 Pod 的有效请求和限制值。

Pod 级别的 cgroup 是基于 Pod 的有效请求和限制值，与调度器相同。

## {{% heading "whatsnext" %}}

<!--
* Read a blog post on [native sidecar containers](/blog/2023/08/25/native-sidecar-containers/).
* Read about [creating a Pod that has an init container](/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container).
* Learn about the [types of probes](/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe): liveness, readiness, startup probe.
* Learn about [pod overhead](/docs/concepts/scheduling-eviction/pod-overhead/).
-->
* 阅读关于[原生边车容器](/zh-cn/blog/2023/08/25/native-sidecar-containers/)的博文。
* 阅读[如何创建具有 Init 容器的 Pod](/zh-cn/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container)。
* 了解[探针类型](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe)：
  存活态探针、就绪态探针、启动探针。
* 了解 [Pod 开销](/zh-cn/docs/concepts/scheduling-eviction/pod-overhead/)。
