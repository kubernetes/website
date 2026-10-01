---
title: 高级 Pod 配置
api_metadata:
- apiVersion: "v1"
  kind: "Pod"
content_type: concept
weight: 180
---
<!--
title: Advanced Pod Configuration
api_metadata:
- apiVersion: "v1"
  kind: "Pod"
content_type: concept
weight: 180
-->

<!-- overview -->

<!--
This page covers advanced Pod configuration topics including [PriorityClasses](#priorityclasses), [RuntimeClasses](#runtimeclasses),
[security context](#security-context) within Pods, and introduces aspects of [scheduling](/docs/concepts/scheduling-eviction/#scheduling).
-->
本页涵盖高级 Pod 配置主题，包括 [PriorityClass](#priorityclasses)、[RuntimeClass](#runtimeclasses)、
Pod 内的[安全上下文](#security-context)，并介绍[调度](/zh-cn/docs/concepts/scheduling-eviction/#scheduling)相关内容。

<!-- body -->

<!--
## PriorityClasses
-->
## PriorityClass   {#priorityclasses}

<!--
_PriorityClasses_ allow you to set the importance of Pods relative to other Pods.
If you assign a priority class to a Pod, Kubernetes sets the `.spec.priority` field for that Pod
based on the PriorityClass you specified (you cannot set `.spec.priority` directly).
If or when a Pod cannot be scheduled, and the problem is due to a lack of resources, the {{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
tries to {{< glossary_tooltip text="preempt" term_id="preemption" >}} lower priority
Pods, in order to make scheduling of the higher priority Pod possible.
-->
**PriorityClass** 允许你设置 Pod 相对于其他 Pod 的重要性。
如果你为 Pod 分配了优先级类，Kubernetes 会根据你所指定的 PriorityClass 为该 Pod 设置 `.spec.priority` 字段
（你不能直接设置 `.spec.priority`）。如果 Pod 无法被调度，且原因是资源不足，
{{< glossary_tooltip term_id="kube-scheduler" text="kube-scheduler" >}}
会尝试{{< glossary_tooltip text="抢占" term_id="preemption" >}}较低优先级的 Pod，
以使较高优先级的 Pod 能够被调度。

<!--
A PriorityClass is a cluster-scoped API object that maps a priority class name to an integer priority value. Higher numbers indicate higher priority.
-->
PriorityClass 是一个集群级别的 API 对象，它将优先级类名称映射到一个整数优先级值。数值越大，优先级越高。

<!--
### Defining a PriorityClass
-->
### 定义 PriorityClass   {#defining-a-priorityclass}

```yaml
apiVersion: scheduling.k8s.io/v1
kind: PriorityClass
metadata:
  name: high-priority
value: 10000
globalDefault: false
description: "Priority class for high-priority workloads"
```

<!--
### Specify pod priority using a PriorityClass
-->
### 使用 PriorityClass 指定 Pod 优先级   {#specify-pod-priority-using-a-priorityclass}

{{< highlight yaml "hl_lines=9" >}}
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
  priorityClassName: high-priority
{{< /highlight >}}

<!--
### Built-in PriorityClasses

Kubernetes provides two built-in PriorityClasses:
- `system-cluster-critical`: For system components that are critical to the cluster
- `system-node-critical`: For system components that are critical to individual nodes. This is the highest priority that Pods can have in Kubernetes.
-->
### 内置 PriorityClass   {#built-in-priorityclasses}

Kubernetes 提供两个内置的 PriorityClass：

- `system-cluster-critical`：用于对集群至关重要的系统组件。
- `system-node-critical`：用于对单个节点至关重要的系统组件。这是 Kubernetes 中 Pod 可以具有的最高优先级。

<!--
For more information, see [Pod Priority and Preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/).
-->
更多信息请参阅 [Pod 优先级与抢占](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)。

<!--
## RuntimeClasses

A _RuntimeClass_ allows you to specify the low-level container runtime for a Pod. It is useful when you want to specify different container runtimes for different kinds of Pod, such as when you need different isolation levels or runtime features.
-->
## RuntimeClass   {#runtimeclasses}

**RuntimeClass** 允许你为 Pod 指定底层的容器运行时。当你需要为不同类型的 Pod 指定不同的容器运行时，
例如需要不同的隔离级别或运行时特性时，这一机制非常有用。

<!--
### Example Pod {#runtimeclass-pod-example}
-->
### 示例 Pod   {#runtimeclass-pod-example}

{{< highlight yaml "hl_lines=6" >}}
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: myclass
  containers:
  - name: mycontainer
    image: nginx
{{< /highlight >}}

<!--
A [RuntimeClass](/docs/concepts/containers/runtime-class/) is a cluster-scoped object that represents a container runtime that is available on some or all of your node.
-->
[RuntimeClass](/zh-cn/docs/concepts/containers/runtime-class/) 是一个集群级别的对象，
表示在某些或所有节点上可用的容器运行时。

<!--
The cluster administrator installs and configures the concrete runtimes backing the RuntimeClass.

They might set up that special container runtime configuration on all nodes, or perhaps just on some of them.

For more information, see the [RuntimeClass](/docs/concepts/containers/runtime-class/) documentation.
-->
集群管理员负责安装和配置支撑 RuntimeClass 的具体运行时。

他们可以在所有节点上设置这种特殊的容器运行时配置，也可以只在部分节点上设置。

更多信息请参阅 [RuntimeClass](/zh-cn/docs/concepts/containers/runtime-class/) 文档。

<!--
## Pod and container level security context configuration {#security-context}

The `Security context` field in the Pod specification provides granular control over security settings for Pods and containers.
-->
## Pod 和容器级别的安全上下文配置   {#security-context}

Pod 规约中的 `Security context` 字段提供了对 Pod 和容器安全设置的精细化控制。

<!--
### Pod-wide `securityContext` {#pod-level-security-context}

Some aspects of security apply to the whole Pod; for other aspects,
you might want to set a default, without any container-level overrides.

Here's an example of using `securityContext` at the Pod level:
-->
### Pod 范围的 `securityContext`   {#pod-level-security-context}

安全设置的某些方面适用于整个 Pod；对于其他方面，
你可能希望设置一个默认值，而不允许容器级别的覆盖。

以下是在 Pod 层面使用 `securityContext` 的示例：

<!--
#### Example Pod {#pod-level-security-context-example}
-->
#### 示例 Pod   {#pod-level-security-context-example}

<!--
apiVersion: v1
kind: Pod
metadata:
  name: security-context-demo
spec:
  securityContext:  # This applies to the entire Pod
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
  containers:
  - name: sec-ctx-demo
    image: registry.k8s.io/e2e-test-images/agnhost:2.45
    command: ["sh", "-c", "sleep 1h"]
-->
{{< highlight yaml "hl_lines=5-9" >}}
apiVersion: v1
kind: Pod
metadata:
  name: security-context-demo
spec:
  securityContext:  # 此项应用到整个 Pod
    runAsUser: 1000
    runAsGroup: 3000
    fsGroup: 2000
  containers:
  - name: sec-ctx-demo
    image: registry.k8s.io/e2e-test-images/agnhost:2.45
    command: ["sh", "-c", "sleep 1h"]
{{< /highlight >}}

<!--
### Container-level security context {#container-level-security-context}

You can specify the security context just for a specific container.
Here's an example:
-->
### 容器级别的安全上下文   {#container-level-security-context}

你可以仅为特定容器指定安全上下文。以下是一个示例：

<!--
#### Example Pod {#container-level-security-context-example}
-->
#### 示例 Pod   {#container-level-security-context-example}

{{< highlight yaml "hl_lines=9-17" >}}
apiVersion: v1
kind: Pod
metadata:
  name: security-context-demo-2
spec:
  containers:
  - name: sec-ctx-demo-2
    image: gcr.io/google-samples/node-hello:1.0
    securityContext:
      allowPrivilegeEscalation: false
      runAsNonRoot: true
      runAsUser: 1000
      capabilities:
        drop:
        - ALL
      seccompProfile:
        type: RuntimeDefault
{{< /highlight >}}

<!--
### Security context options

- **User and Group IDs**: Control which user/group the container runs as
- **Capabilities**: Add or drop Linux capabilities
- **Seccomp Profiles**: Set security computing profiles
- **SELinux Options**: Configure SELinux context
- **AppArmor**: Configure AppArmor profiles for additional access control
- **Windows Options**: Configure Windows-specific security settings
-->
### 安全上下文选项   {#security-context-options}

- **用户和组 ID**：控制容器以哪个用户/组身份运行。
- **Capabilities**：添加或删除 Linux 权能。
- **Seccomp Profile**：设置安全计算配置文件。
- **SELinux 选项**：配置 SELinux 上下文。
- **AppArmor**：配置 AppArmor 配置文件以实现额外的访问控制。
- **Windows 选项**：配置 Windows 特定的安全设置。

{{< caution >}}
<!--
You can also use the Pod `securityContext` to allow
[_privileged mode_](/docs/concepts/security/linux-kernel-security-constraints/#privileged-containers)
in Linux containers. Privileged mode overrides many of the other security settings in the `securityContext`.
Avoid using this setting unless you can't grant the equivalent permissions by using other fields in the `securityContext`.
You can run Windows containers in a similarly
privileged mode by setting the `windowsOptions.hostProcess` flag on the
Pod-level security context. For details and instructions, see
[Create a Windows HostProcess Pod](/docs/tasks/configure-pod-container/create-hostprocess-pod/).
-->
你也可以使用 Pod 的 `securityContext` 来允许 Linux
容器进入[**特权模式**](/zh-cn/docs/concepts/security/linux-kernel-security-constraints/#privileged-containers)。
特权模式会覆盖 `securityContext` 中的许多其他安全设置。
除非无法通过 `securityContext` 中的其他字段授予等效权限，否则应避免使用此设置。
你可以通过在 Pod 级别的安全上下文中设置 `windowsOptions.hostProcess` 标志，
以类似的特权模式运行 Windows 容器。有关详细信息和操作说明，
参阅[创建 Windows HostProcess Pod](/zh-cn/docs/tasks/configure-pod-container/create-hostprocess-pod/)。
{{< /caution >}}

<!--
For more information, see [Configure a Security Context for a Pod or Container](/docs/tasks/configure-pod-container/security-context/).
-->
更多信息请参阅[为 Pod 或容器配置安全上下文](/zh-cn/docs/tasks/configure-pod-container/security-context/)。

<!--
## Influencing Pod scheduling decisions {#scheduling}

Kubernetes provides several mechanisms to control which nodes your Pods are scheduled on.
-->
## 影响 Pod 调度决策   {#scheduling}

Kubernetes 提供了多种机制来控制 Pod 被调度到哪些节点上。

<!--
### Node selectors

The simplest form of node selection constraint:
-->
### 节点选择算符   {#node-selectors}

最简单的节点选择约束形式：

{{< highlight yaml "hl_lines=9-11" >}}
apiVersion: v1
kind: Pod
metadata:
  name: nginx
spec:
  containers:
  - name: nginx
    image: nginx
  nodeSelector:
    disktype: ssd
{{< /highlight >}}

<!--
### Node affinity

Node affinity allows you to specify rules that constrain which nodes your Pod can be scheduled on. Here's an example of a Pod that prefers running on nodes labelled as being on a particular continent, selecting based on the value of [`topology.kubernetes.io/zone`](/docs/reference/labels-annotations-taints/#topologykubernetesiozone) label.
-->
### 节点亲和性   {#node-affinity}

节点亲和性允许你指定规则，限制 Pod 可以被调度到哪些节点上。以下示例中的 Pod 倾向于运行在带有特定大洲标签的节点上，
选择基于 [`topology.kubernetes.io/zone`](/zh-cn/docs/reference/labels-annotations-taints/#topologykubernetesiozone) 标签的值。

{{< highlight yaml "hl_lines=6-15" >}}
apiVersion: v1
kind: Pod
metadata:
  name: with-node-affinity
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: topology.kubernetes.io/zone
            operator: In
            values:
            - antarctica-east1
            - antarctica-west1
  containers:
  - name: with-node-affinity
    image: registry.k8s.io/pause:3.8
{{< /highlight >}}

<!--
### Pod affinity and anti-affinity

In addition to node affinity, you can also constrain which nodes a Pod can be scheduled on based on the labels of _other Pods_ that are already running on nodes. Pod affinity allows you to specify rules about where a Pod should be placed relative to other Pods.
-->
### Pod 亲和性与反亲和性   {#pod-affinity-and-anti-affinity}

除了节点亲和性之外，你还可以基于节点上**已运行的其他 Pod** 的标签来限制 Pod 可以被调度到哪些节点。
Pod 亲和性允许你指定规则，说明 Pod 应相对于其他 Pod 放置在何处。

{{< highlight yaml "hl_lines=6-15" >}}
apiVersion: v1
kind: Pod
metadata:
  name: with-pod-affinity
spec:
  affinity:
    podAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
      - labelSelector:
          matchExpressions:
          - key: app
            operator: In
            values:
            - database
        topologyKey: topology.kubernetes.io/zone
  containers:
  - name: with-pod-affinity
    image: registry.k8s.io/pause:3.8
{{< /highlight >}}

<!--
### Tolerations

_Tolerations_ allow Pods to be scheduled on nodes with matching taints:
-->
### 容忍度   {#tolerations}

**容忍度（Toleration）** 允许 Pod 被调度到带有匹配污点的节点上：

{{< highlight yaml "hl_lines=9-13" >}}
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: myapp
    image: nginx
  tolerations:
  - key: "key"
    operator: "Equal"
    value: "value"
    effect: "NoSchedule"
{{< /highlight >}}

<!--
For more information, see [Assign Pods to Nodes](/docs/concepts/scheduling-eviction/assign-pod-node/).
-->
更多信息请参阅[将 Pod 指派到节点](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)。

<!--
## Pod overhead

Pod overhead allows you to account for the resources consumed by the Pod infrastructure on top of the container requests and limits.
-->
## Pod 开销   {#pod-overhead}

Pod 开销允许你在容器请求和限制之外，考虑 Pod 基础设施所消耗的资源。

{{< highlight yaml "hl_lines=7-10" >}}
---
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  name: kvisor-runtime
handler: kvisor-runtime
overhead:
  podFixed:
    memory: "2Gi"
    cpu: "500m"
---
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: kvisor-runtime
  containers:
  - name: myapp
    image: nginx
    resources:
      requests:
        memory: "64Mi"
        cpu: "250m"
      limits:
        memory: "128Mi"
        cpu: "500m"
{{< /highlight >}}


## {{% heading "whatsnext" %}}

<!--
* Read about [Pod Priority and Preemption](/docs/concepts/scheduling-eviction/pod-priority-preemption/)
* Read about [RuntimeClasses](/docs/concepts/containers/runtime-class/)
* Explore [Configure a Security Context for a Pod or Container](/docs/tasks/configure-pod-container/security-context/)
* Learn how Kubernetes [assigns Pods to Nodes](/docs/concepts/scheduling-eviction/assign-pod-node/)
* [Pod Overhead](/docs/concepts/scheduling-eviction/pod-overhead/)
-->
* 阅读 [Pod 优先级与抢占](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)。
* 阅读 [RuntimeClass](/zh-cn/docs/concepts/containers/runtime-class/)。
* 探索[为 Pod 或容器配置安全上下文](/zh-cn/docs/tasks/configure-pod-container/security-context/)。
* 了解 Kubernetes 如何[将 Pod 指派到节点](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)。
* [Pod 开销](/zh-cn/docs/concepts/scheduling-eviction/pod-overhead/)。
