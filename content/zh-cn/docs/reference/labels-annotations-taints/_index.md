---
title: 众所周知的标签、注解和污点
content_type: concept
weight: 40
no_list: true
---
<!--
title: Well-Known Labels, Annotations and Taints
content_type: concept
weight: 40
no_list: true
-->

<!-- overview -->
<!--
Kubernetes reserves all labels and annotations in the kubernetes.io and k8s.io namespaces.

This document serves both as a reference to the values and as a coordination point for assigning values.
-->
Kubernetes 将所有标签和注解保留在 kubernetes.io 和 k8s.io 名字空间中。

本文档既可作为值的参考，也可作为分配值的协调点。

<!-- body -->

<!--
## Labels, annotations and taints used on API objects

### app.kubernetes.io/component

Example: `app.kubernetes.io/component: "database"`

Used on: All Objects (typically used on [workload resources](/docs/reference/kubernetes-api/workload-resources/)).

The component within the architecture.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).
-->
## API 对象上使用的标签、注解和污点   {#labels-annotations-and-taints-used-on-api-objects}

### app.kubernetes.io/component {#app-kubernetes-io-component}

例子：`app.kubernetes.io/component: "database"`

用于：所有对象（通常用于[工作负载资源](/zh-cn/docs/reference/kubernetes-api/workload-resources/)）。

架构中的组件。

[推荐标签](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)之一。

<!--
### app.kubernetes.io/created-by (deprecated)

Example: `app.kubernetes.io/created-by: "controller-manager"`

Used on: All Objects (typically used on [workload resources](/docs/reference/kubernetes-api/workload-resources/)).

The controller/user who created this resource.
-->
### app.kubernetes.io/created-by（已弃用）  {#app-kubernetes-io-created-by}

示例：`app.kubernetes.io/created-by: "controller-manager"`

用于：所有对象（通常用于[工作负载资源](/zh-cn/docs/reference/kubernetes-api/workload-resources/)）。

创建此资源的控制器/用户。

{{< note >}}
<!--
Starting from v1.9, this label is deprecated.
-->
从 v1.9 开始，这个标签被弃用。
{{< /note >}}

<!--
### app.kubernetes.io/instance

Example: `app.kubernetes.io/instance: "mysql-abcxzy"`

Used on: All Objects (typically used on [workload resources](/docs/reference/kubernetes-api/workload-resources/)).

A unique name identifying the instance of an application. To assign a non-unique name, use [app.kubernetes.io/name](#app-kubernetes-io-name).

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).
-->
### app.kubernetes.io/instance {#app-kubernetes-io-instance}

示例：`app.kubernetes.io/instance: "mysql-abcxzy"`

用于：所有对象（通常用于[工作负载资源](/zh-cn/docs/reference/kubernetes-api/workload-resources/)）。

标识应用实例的唯一名称。要分配一个不唯一的名称，可使用 [app.kubernetes.io/name](#app-kubernetes-io-name)。

[推荐标签](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)之一。

<!--
### app.kubernetes.io/managed-by

Example: `app.kubernetes.io/managed-by: "helm"`

Used on: All Objects (typically used on [workload resources](/docs/reference/kubernetes-api/workload-resources/)).

The tool being used to manage the operation of an application.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).
-->
### app.kubernetes.io/managed-by {#app-kubernetes-io-manged-by}

示例：`app.kubernetes.io/managed-by: "helm"`

用于：所有对象（通常用于[工作负载资源](/zh-cn/docs/reference/kubernetes-api/workload-resources/)）。

用于管理应用操作的工具。

[推荐标签](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)之一。

<!--
### app.kubernetes.io/name

Example: `app.kubernetes.io/name: "mysql"`

Used on: All Objects (typically used on [workload resources](/docs/reference/kubernetes-api/workload-resources/)).

The name of the application.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).
-->
### app.kubernetes.io/name {#app-kubernetes-io-name}

示例：`app.kubernetes.io/name: "mysql"`

用于：所有对象（通常用于[工作负载资源](/zh-cn/docs/reference/kubernetes-api/workload-resources/)）。

应用的名称。

[推荐标签](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)之一。

<!--
### app.kubernetes.io/part-of

Example: `app.kubernetes.io/part-of: "wordpress"`

Used on: All Objects (typically used on [workload resources](/docs/reference/kubernetes-api/workload-resources/)).

The name of a higher-level application this one is part of.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).
-->
### app.kubernetes.io/part-of {#app-kubernetes-io-part-of}

示例：`app.kubernetes.io/part-of: "wordpress"`

用于：所有对象（通常用于[工作负载资源](/zh-cn/docs/reference/kubernetes-api/workload-resources/)）。

此应用所属的更高级别应用的名称。

[推荐标签](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)之一。

<!--
### app.kubernetes.io/version

Example: `app.kubernetes.io/version: "5.7.21"`

Used on: All Objects (typically used on [workload resources](/docs/reference/kubernetes-api/workload-resources/)).

The current version of the application.

Common forms of values include:

- [semantic version](https://semver.org/spec/v1.0.0.html)
- the Git [revision hash](https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection#_single_revisions) for the source code.

One of the [recommended labels](/docs/concepts/overview/working-with-objects/common-labels/#labels).
-->
### app.kubernetes.io/version {#app-kubernetes-io-version}

示例：`app.kubernetes.io/version: "5.7.21"`

用于：所有对象（通常用于[工作负载资源](/zh-cn/docs/reference/kubernetes-api/workload-resources/)）。

值的常见形式包括：

- [语义版本](https://semver.org/spec/v1.0.0.html)
- 针对源代码的 Git [修订哈希](https://git-scm.com/book/en/v2/Git-Tools-Revision-Selection#_single_revisions)。

[推荐标签](/zh-cn/docs/concepts/overview/working-with-objects/common-labels/#labels)之一。

<!--
### cluster-autoscaler.kubernetes.io/safe-to-evict

Example: `cluster-autoscaler.kubernetes.io/safe-to-evict: "true"`

Used on: Pod

When this annotation is set to `"true"`, the cluster autoscaler is allowed to evict a Pod
even if other rules would normally prevent that.
The cluster autoscaler never evicts Pods that have this annotation explicitly set to
`"false"`; you could set that on an important Pod that you want to keep running.
If this annotation is not set then the cluster autoscaler follows its Pod-level behavior.
-->
### cluster-autoscaler.kubernetes.io/safe-to-evict  {#cluster-autoscaler-safe-to-evict}

例子：`cluster-autoscaler.kubernetes.io/safe-to-evict: "true"`

用于：Pod

当这个注解设置为 `"true"` 时，即使其他规则通常会阻止驱逐操作，也会允许该集群自动扩缩器驱逐一个 Pod。
集群自动扩缩器从不驱逐将此注解显式设置为 `"false"` 的 Pod；你可以针对要保持运行的重要 Pod 设置此注解。
如果未设置此注解，则集群自动扩缩器将遵循其 Pod 级别的行为。

<!--
### config.kubernetes.io/local-config

Example: `config.kubernetes.io/local-config: "true"`

Used on: All objects

This annotation is used in manifests to mark an object as local configuration that should not be submitted to the Kubernetes API.
A value of "true" for this annotation declares that the object is only consumed by client-side tooling and should not be submitted to the API server.
A value of "false" can be used to declare that the object should be submitted to the API server even when it would otherwise be assumed to be local.
This annotation is part of the Kubernetes Resource Model (KRM) Functions Specification, which is used by Kustomize and similar third-party tools. For example, Kustomize removes objects with this annotation from its final build output.
-->

### config.kubernetes.io/local-config {#config-kubernetes-io-local-config}

例子：`config.kubernetes.io/local-config: "true"`

用于：所有对象

该注解用于清单中的对象，表示某对象是本地配置，不应提交到 Kubernetes API。
对于这个注解，当值为 "true" 时，表示该对象仅被客户端工具使用，不应提交到 API 服务器。
当值为 "false"，可以用来声明该对象应提交到 API 服务器，即使它是本地对象。

该注解是 Kubernetes 资源模型 (KRM) 函数规范的一部分，被 Kustomize 和其他类似的第三方工具使用。
例如，Kustomize 会从其最终构建输出中删除带有此注解的对象。

<!--
### internal.config.kubernetes.io/* (reserved prefix) {#internal.config.kubernetes.io-reserved-wildcard}

Used on: All objects

This prefix is reserved for internal use by tools that act as orchestrators in accordance with the Kubernetes Resource Model (KRM) Functions Specification. Annotations with this prefix are internal to the orchestration process and are not persisted to the manifests on the filesystem. In other words, the orchestrator tool should set these annotations when reading files from the local filesystem and remove them when writing the output of functions back to the filesystem.
A KRM function **must not** modify annotations with this prefix, unless otherwise specified for a given annotation. This enables orchestrator tools to add additional internal annotations, without requiring changes to existing functions.
-->

### internal.config.kubernetes.io/* (保留的前缀) {#internal.config.kubernetes.io-reserved-wildcard}

用于：所有对象

该前缀被保留，供遵从 Kubernetes 资源模型 (KRM) 函数规范的编排工具内部使用。
带有该前缀的注解仅在编排过程中使用，不会持久化到文件系统。
换句话说，编排工具应从本地文件系统读取文件时设置这些注解，并在将函数输出写回文件系统时删除它们。

除非特定注解另有说明，KRM 函数不得修改带有此前缀的注解。
这使得编排工具可以添加额外的内部注解，而不需要更改现有函数。

<!--
### internal.config.kubernetes.io/path

Example: `internal.config.kubernetes.io/path: "relative/file/path.yaml"`

Used on: All objects

This annotation records the slash-delimited, OS-agnostic, relative path to the manifest file the object was loaded from. The path is relative to a fixed location on the filesystem, determined by the orchestrator tool.
This annotation is part of the Kubernetes Resource Model (KRM) Functions Specification, which is used by Kustomize and similar third-party tools.
A KRM Function **should not** modify this annotation on input objects unless it is modifying the referenced files. A KRM Function **may** include this annotation on objects it generates.
-->

### internal.config.kubernetes.io/path {#internal-config-kubernetes-io-path}

例子：`internal.config.kubernetes.io/path: "relative/file/path.yaml"`

用于：所有对象

此注解记录了加载对象清单文件的（斜线分隔、与操作系统无关）相对路径。
该路径相对于文件系统上由编排工具确定的固定位置。

该注解是 Kubernetes 资源模型 (KRM) 函数规范的一部分，被 Kustomize 和其他类似的第三方工具使用。

KRM 函数**不应**在输入对象上修改此注解，除非它正在修改引用的文件。
KRM 函数**可以**在它所生成的对象上包含这个注解。

<!--
### internal.config.kubernetes.io/index

Example: `internal.config.kubernetes.io/index: "2"`

Used on: All objects

This annotation records the zero-indexed position of the YAML document that contains the object within the manifest file the object was loaded from. Note that YAML documents are separated by three dashes (`---`) and can each contain one object. When this annotation is not specified, a value of 0 is implied.
This annotation is part of the Kubernetes Resource Model (KRM) Functions Specification, which is used by Kustomize and similar third-party tools.
A KRM Function **should not** modify this annotation on input objects unless it is modifying the referenced files. A KRM Function **may** include this annotation on objects it generates.
-->

### internal.config.kubernetes.io/index {#internal-config-kubernetes-io-index}

例子：`internal.config.kubernetes.io/index: "2"`

用于：所有对象

该注解记录了包含对象的 YAML 文档在加载对象的清单文件中的零索引位置。
请注意，YAML 文档由三个破折号 (---) 分隔，每个文档可以包含一个对象。
如果未指定此注解，则该值为 0。

该注解是 Kubernetes 资源模型 (KRM) 函数规范的一部分，被 Kustomize 和其他类似的第三方工具使用。

KRM 函数**不应**在输入对象上修改此注解，除非它正在修改引用的文件。
KRM 函数**可以**在它所生成的对象上包含这个注解。

<!-- 
### kubernetes.io/arch

Example: `kubernetes.io/arch: "amd64"`

Used on: Node

The Kubelet populates this with `runtime.GOARCH` as defined by Go. This can be handy if you are mixing arm and x86 nodes.
-->

### kubernetes.io/arch {#kubernetes-io-arch}

例子：`kubernetes.io/arch: "amd64"`

用于：Node

Kubelet 使用 Go 定义的 `runtime.GOARCH` 填充它。如果你混合使用 ARM 和 X86 节点，这会很方便。

<!--
### kubernetes.io/os

Example: `kubernetes.io/os: "linux"`

Used on: Node

The Kubelet populates this with `runtime.GOOS` as defined by Go. This can be handy if you are mixing operating systems in your cluster (for example: mixing Linux and Windows nodes).
-->
### kubernetes.io/os {#kubernetes-io-os}

例子：`kubernetes.io/os: "linux"`

用于：Node

Kubelet 使用 Go 定义的 `runtime.GOOS` 填充它。如果你在集群中混合使用操作系统（例如：混合 Linux 和 Windows 节点），这会很方便。

<!--
### kubernetes.io/metadata.name

Example: `kubernetes.io/metadata.name: "mynamespace"`

Used on: Namespaces

The Kubernetes API server (part of the {{< glossary_tooltip text="control plane" term_id="control-plane" >}})
sets this label on all namespaces. The label value is set
to the name of the namespace. You can't change this label's value.

This is useful if you want to target a specific namespace with a label
{{< glossary_tooltip text="selector" term_id="selector" >}}.
-->
### kubernetes.io/metadata.name {#kubernetes-io-metadata-name}

例子：`kubernetes.io/metadata.name: "mynamespace"`

用于：Namespace

Kubernetes API 服务器（{{<glossary_tooltip text="控制平面" term_id="control-plane" >}} 的一部分）在所有 Namespace 上设置此标签。
标签值被设置 Namespace 的名称。你无法更改此标签的值。

如果你想使用标签{{<glossary_tooltip text="选择算符" term_id="selector" >}}定位特定 Namespace，这很有用。

<!--
### kubernetes.io/limit-ranger

Example: `kubernetes.io/limit-ranger: "LimitRanger plugin set: cpu, memory request for container nginx; cpu, memory limit for container nginx"`

Used on: Pod
-->
### kubernetes.io/limit-ranger   {#kubernetes-io-limit-ranger}

例子：`kubernetes.io/limit-ranger: "LimitRanger plugin set: cpu, memory request for container nginx; cpu, memory limit for container nginx"`

用于：Pod

<!--
Kubernetes by default doesn't provide any resource limit, that means unless you explicitly define limits,
your container can consume unlimited CPU and memory.
You can define a default request or default limit for pods. You do this by creating a LimitRange in the relevant namespace.
Pods deployed after you define a LimitRange will have these limits applied to them.
The annotation `kubernetes.io/limit-ranger` records that resource defaults were specified for the Pod,
and they were applied successfully.
For more details, read about [LimitRanges](/docs/concepts/policy/limit-range).
-->
Kubernetes 默认不提供任何资源限制，这意味着除非你明确定义限制，否则你的容器将可以无限消耗 CPU 和内存。
你可以为 Pod 定义默认请求或默认限制。为此，你可以在相关命名空间中创建一个 LimitRange。
在你定义 LimitRange 后部署的 Pod 将受到这些限制。
注解 `kubernetes.io/limit-ranger` 记录了为 Pod 指定的资源默认值，以及成功应用这些默认值。
有关更多详细信息，请阅读 [LimitRanges](/zh-cn/docs/concepts/policy/limit-range)。

<!--
### beta.kubernetes.io/arch (deprecated)

This label has been deprecated. Please use `kubernetes.io/arch` instead.

### beta.kubernetes.io/os (deprecated)

This label has been deprecated. Please use `kubernetes.io/os` instead.
-->
### beta.kubernetes.io/arch (已弃用) {#beta-kubernetes-io-arch}

此标签已被弃用。请改用 `kubernetes.io/arch`。

### beta.kubernetes.io/os (已弃用) {#beta-kubernetes-io-os}

此标签已被弃用。请改用 `kubernetes.io/os`。

<!--
### kube-aggregator.kubernetes.io/automanaged {#kube-aggregator-kubernetesio-automanaged}

Example: `kube-aggregator.kubernetes.io/automanaged: "onstart"`

Used on: APIService

The `kube-apiserver` sets this label on any APIService object that the API server has created automatically. The label marks how the control plane should manage that APIService. You should not add, modify, or remove this label by yourself.
-->
### kube-aggregator.kubernetes.io/automanaged {#kube-aggregator-kubernetesio-automanaged}

例子：`kube-aggregator.kubernetes.io/automanaged: "onstart"`

用于：APIService

`kube-apiserver` 会在由 API 服务器自动创建的所有 APIService 对象上设置这个标签。
该标签标记了控制平面应如何管理该 APIService。你不应自行添加、修改或删除此标签。

{{< note >}}
<!--
Automanaged APIService objects are deleted by kube-apiserver when it has no built-in or custom resource API corresponding to the API group/version of the APIService.
-->
当自动托管的 APIService 对象没有内置或自定义资源 API 对应于该 APIService 的 API 组/版本时，
它将被 kube-apiserver 删除。
{{< /note >}}

<!--
There are two possible values:

- `onstart`: The APIService should be reconciled when an API server starts up, but not otherwise.
- `true`: The API server should reconcile this APIService continuously.
-->
有两个可能的值：

- `onstart`：API 服务器应在启动时协调 APIService，但在其他时间不会进行协调。
- `true`：API 服务器应持续协调此 APIService。

<!--
### service.alpha.kubernetes.io/tolerate-unready-endpoints (deprecated)

Used on: StatefulSet

This annotation on a Service denotes if the Endpoints controller should go ahead and create Endpoints for unready Pods.
Endpoints of these Services retain their DNS records and continue receiving
traffic for the Service from the moment the kubelet starts all containers in the pod
and marks it _Running_, til the kubelet stops all containers and deletes the pod from
the API server.
-->
### service.alpha.kubernetes.io/tolerate-unready-endpoints（已弃用）   {#service-alpha-kubernetes-io-tolerate-unready-endpoints-deprecated}

用于：StatefulSet

Service 上的这个注解表示 Endpoints 控制器是否应该继续为未准备好的 Pod 创建 Endpoints。
这些 Service 的 Endpoints 保留其 DNS 记录，并从 kubelet 启动 Pod 中的所有容器并将其标记为
**Running** 的那一刻起继续接收 Service 的流量，直到 kubelet 停止所有容器并从 API 服务器删除 Pod 为止。

<!--
### kubernetes.io/hostname {#kubernetesiohostname}

Example: `kubernetes.io/hostname: "ip-172-20-114-199.ec2.internal"`

Used on: Node

The Kubelet populates this label with the hostname. Note that the hostname can be changed from the "actual" hostname by passing the `--hostname-override` flag to the `kubelet`.

This label is also used as part of the topology hierarchy.  See [topology.kubernetes.io/zone](#topologykubernetesiozone) for more information.
-->
### kubernetes.io/hostname {#kubernetesiohostname}

例子：`kubernetes.io/hostname: "ip-172-20-114-199.ec2.internal"`

用于：Node

Kubelet 使用主机名填充此标签。请注意，可以通过将 `--hostname-override` 标志传递给 `kubelet` 来替代“实际”主机名。

此标签也用作拓扑层次结构的一部分。有关详细信息，请参阅 [topology.kubernetes.io/zone](#topologykubernetesiozone)。

<!--
### kubernetes.io/change-cause {#change-cause}

Example: `kubernetes.io/change-cause: "kubectl edit --record deployment foo"`

Used on: All Objects

This annotation is a best guess at why something was changed.

It is populated when adding `--record` to a `kubectl` command that may change an object.
-->
### kubernetes.io/change-cause {#change-cause}

例子：`kubernetes.io/change-cause: "kubectl edit --record deployment foo"`

用于：所有对象

此注解是对某些事物发生变更的原因的最佳猜测。

将 `--record` 添加到可能会更改对象的 `kubectl` 命令时会填充它。

<!--
### kubernetes.io/description {#description}

Example: `kubernetes.io/description: "Description of K8s object."`

Used on: All Objects

This annotation is used for describing specific behaviour of given object.
-->
### kubernetes.io/description {#description}

例子：`kubernetes.io/description: "Description of K8s object."`

用于：所有对象

此注解用于描述给定对象的特定行为。

<!--
### kubernetes.io/enforce-mountable-secrets {#enforce-mountable-secrets}

Example: `kubernetes.io/enforce-mountable-secrets: "true"`

Used on: ServiceAccount

The value for this annotation must be **true** to take effect. This annotation indicates that pods running as this service account may only reference Secret API objects specified in the service account's `secrets` field.
-->
### kubernetes.io/enforce-mountable-secrets {#enforce-mountable-secrets}

例子：`kubernetes.io/enforce-mountable-secrets: "true"`

用于：ServiceAccount

此注解的值必须为 **true** 才能生效。此注解表示作为此服务帐户运行的 Pod
只能引用在服务帐户的 `secrets` 字段中指定的 Secret API 对象。

<!--
### node.kubernetes.io/exclude-from-external-load-balancer

Example: `node.kubernetes.io/exclude-from-external-load-balancer`

Used on: Node

Kubernetes automatically enables the `ServiceNodeExclusion` feature gate on the clusters it creates. With this feature gate enabled on a cluster,
you can add labels to particular worker nodes to exclude them from the list of backend servers.
The following command can be used to exclude a worker node from the list of backend servers in a backend set-
`kubectl label nodes <node-name> node.kubernetes.io/exclude-from-external-load-balancers=true`
-->
### node.kubernetes.io/exclude-from-external-load-balancer   {#exclude-from-external-load-balancer}

例子：`node.kubernetes.io/exclude-from-external-load-balancer`

用于：Node

Kubernetes 自动在其创建的集群上启用 `ServiceNodeExclusion` 特性门控。
在一个集群上启用此特性门控后，你可以添加标签到特定的 Worker 节点，将这些节点从后端服务器列表排除在外。
以下命令可用于从后端集的后端服务器列表中排除一个 Worker 节点：

`kubectl label nodes <node-name> node.kubernetes.io/exclude-from-external-load-balancers=true`

<!--
### controller.kubernetes.io/pod-deletion-cost {#pod-deletion-cost}

Example: `controller.kubernetes.io/pod-deletion-cost: "10"`

Used on: Pod

This annotation is used to set [Pod Deletion Cost](/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost)
which allows users to influence ReplicaSet downscaling order. The annotation parses into an `int32` type.
-->
### controller.kubernetes.io/pod-deletion-cost {#pod-deletion-cost}

例子：`controller.kubernetes.io/pod-deletion-cost: "10"`

用于：Pod

该注解用于设置
[Pod 删除成本](/zh-cn/docs/concepts/workloads/controllers/replicaset/#pod-deletion-cost)允许用户影响
ReplicaSet 缩减顺序。注解解析为 `int32` 类型。

<!--
### cluster-autoscaler.kubernetes.io/enable-ds-eviction

Example: `cluster-autoscaler.kubernetes.io/enable-ds-eviction: "true"`

Used on: Pod

This annotation controls whether a DaemonSet pod should be evicted by a ClusterAutoscaler.
This annotation needs to be specified on DaemonSet pods in a DaemonSet manifest.
When this annotation is set to `"true"`, the ClusterAutoscaler is allowed to evict a DaemonSet Pod,
even if other rules would normally prevent that. To disallow the ClusterAutoscaler from evicting DaemonSet pods,
you can set this annotation to `"false"` for important DaemonSet pods.
If this annotation is not set, then the Cluster Autoscaler follows its overall behaviour (i.e evict the DaemonSets based on its configuration).
-->
### cluster-autoscaler.kubernetes.io/enable-ds-eviction {#enable-ds-eviction}

例子：`cluster-autoscaler.kubernetes.io/enable-ds-eviction: "true"`

用于：Pod

该注解控制 DaemonSet Pod 是否应由 ClusterAutoscaler 驱逐。
该注解需要在 DaemonSet 清单中的 DaemonSet Pod 上指定。
当该注解设为 `"true"` 时，即使其他规则通常会阻止驱逐，也将允许 ClusterAutoscaler 驱逐 DaemonSet Pod。
要取消允许 ClusterAutoscaler 驱逐 DaemonSet Pod，你可以为重要的 DaemonSet Pod 将该注解设为 `"false"`。
如果未设置该注解，则 Cluster Autoscaler 将遵循其整体行为（即根据其配置驱逐 DaemonSet）。

{{< note >}}
<!--
This annotation only impacts DaemonSet pods.
-->
该注解仅影响 DaemonSet Pod。
{{< /note >}}

<!-- 
### kubernetes.io/ingress-bandwidth
-->
### kubernetes.io/ingress-bandwidth {#ingerss-bandwidth}

{{< note >}}
<!--
Ingress traffic shaping annotation is an experimental feature.
If you want to enable traffic shaping support, you must add the `bandwidth` plugin to your CNI configuration file (default `/etc/cni/net.d`) and
ensure that the binary is included in your CNI bin dir (default `/opt/cni/bin`).
-->
入站流量控制注解是一项实验性功能。
如果要启用流量控制支持，必须将 `bandwidth` 插件添加到 CNI 配置文件（默认为 `/etc/cni/net.d`）
并确保二进制文件包含在你的 CNI bin 目录中（默认为 `/opt/cni/bin`）。
{{< /note >}}

<!--
Example: `kubernetes.io/ingress-bandwidth: 10M`

Used on: Pod

You can apply quality-of-service traffic shaping to a pod and effectively limit its available bandwidth.
Ingress traffic (to the pod) is handled by shaping queued packets to effectively handle data.
To limit the bandwidth on a pod, write an object definition JSON file and specify the data traffic
speed using `kubernetes.io/ingress-bandwidth` annotation. The unit used for specifying ingress
rate is bits per second, as a [Quantity](/docs/reference/kubernetes-api/common-definitions/quantity/).
For example, `10M` means 10 megabits per second.
-->
示例：`kubernetes.io/ingress-bandwidth: 10M`

用于：Pod

你可以对 Pod 应用服务质量流量控制并有效限制其可用带宽。
入站流量（到 Pod）通过控制排队的数据包来处理，以有效地处理数据。
要限制 Pod 的带宽，请编写对象定义 JSON 文件并使用 `kubernetes.io/ingress-bandwidth`
注解指定数据流量速度。用于指定入站的速率单位是每秒，
作为[量纲（Quantity）](/zh-cn/docs/reference/kubernetes-api/common-definitions/quantity/)。
例如，`10M` 表示每秒 10 兆比特。

<!-- 
### kubernetes.io/egress-bandwidth
-->
### kubernetes.io/egress-bandwidth {#egress-bandwidth}

{{< note >}}
<!--
Egress traffic shaping annotation is an experimental feature.
If you want to enable traffic shaping support, you must add the `bandwidth` plugin to your CNI configuration file (default `/etc/cni/net.d`) and
ensure that the binary is included in your CNI bin dir (default `/opt/cni/bin`).
-->
出站流量控制注解是一项实验性功能。
如果要启用流量控制支持，必须将 `bandwidth` 插件添加到 CNI 配置文件（默认为 `/etc/cni/net.d`）
并确保二进制文件包含在你的 CNI bin 目录中（默认为 `/opt/cni/bin`）。
{{< /note >}}

<!--
Example: `kubernetes.io/egress-bandwidth: 10M`

Used on: Pod

Egress traffic (from the pod) is handled by policing, which simply drops packets in excess of the configured rate.
The limits you place on a pod do not affect the bandwidth of other pods.
To limit the bandwidth on a pod, write an object definition JSON file and specify the data traffic
speed using `kubernetes.io/egress-bandwidth` annotation. The unit used for specifying egress
rate is bits per second, as a [Quantity](/docs/reference/kubernetes-api/common-definitions/quantity/).
For example, `10M` means 10 megabits per second.
-->
示例：`kubernetes.io/egress-bandwidth: 10M`

用于：Pod

出站流量（来自 pod）由策略控制，策略只是丢弃超过配置速率的数据包。
你为一个 Pod 所设置的限制不会影响其他 Pod 的带宽。
要限制 Pod 的带宽，请编写对象定义 JSON 文件并使用 `kubernetes.io/egress-bandwidth` 注解指定数据流量速度。
用于指定出站的速率单位是每秒比特数，
以[量纲（Quantity）](/zh-cn/docs/reference/kubernetes-api/common-definitions/quantity/)的形式给出。
例如，`10M` 表示每秒 10 兆比特。

<!--
### beta.kubernetes.io/instance-type (deprecated)
-->
### beta.kubernetes.io/instance-type (已弃用) {#beta-kubernetes-io-instance-type}

{{< note >}}
<!--
Starting in v1.17, this label is deprecated in favor of [node.kubernetes.io/instance-type](#nodekubernetesioinstance-type).
-->
从 v1.17 开始，此标签已弃用，取而代之的是 [node.kubernetes.io/instance-type](#nodekubernetesioinstance-type)。
{{< /note >}}

<!--
### node.kubernetes.io/instance-type {#nodekubernetesioinstance-type}

Example: `node.kubernetes.io/instance-type: "m3.medium"`

Used on: Node

The Kubelet populates this with the instance type as defined by the `cloudprovider`.
This will be set only if you are using a `cloudprovider`. This setting is handy
if you want to target certain workloads to certain instance types, but typically you want
to rely on the Kubernetes scheduler to perform resource-based scheduling. You should aim to schedule based on properties rather than on instance types (for example: require a GPU, instead of requiring a `g2.2xlarge`).
-->
### node.kubernetes.io/instance-type {#nodekubernetesioinstance-type}

例子：`node.kubernetes.io/instance-type: "m3.medium"`

用于：Node

Kubelet 使用 `cloudprovider` 定义的实例类型填充它。
仅当你使用 `cloudprovider` 时才会设置此项。如果你希望将某些工作负载定位到某些实例类型，则此设置非常方便，
但通常你希望依靠 Kubernetes 调度程序来执行基于资源的调度。
你应该基于属性而不是实例类型来调度（例如：需要 GPU，而不是需要 `g2.2xlarge`）。

<!--
### failure-domain.beta.kubernetes.io/region (deprecated) {#failure-domainbetakubernetesioregion}

See [topology.kubernetes.io/region](#topologykubernetesioregion).
-->
### failure-domain.beta.kubernetes.io/region (已弃用) {#failure-domainbetakubernetesioregion}

请参阅 [topology.kubernetes.io/region](#topologykubernetesioregion)。

{{< note >}}
<!--
Starting in v1.17, this label is deprecated in favor of [topology.kubernetes.io/region](#topologykubernetesioregion).
-->
从 v1.17 开始，此标签已弃用，取而代之的是 [topology.kubernetes.io/region](#topologykubernetesioregion)。
{{</note>}}

<!--
### failure-domain.beta.kubernetes.io/zone (deprecated) {#failure-domainbetakubernetesiozone}

See [topology.kubernetes.io/zone](#topologykubernetesiozone).
-->
### failure-domain.beta.kubernetes.io/zone (已弃用) {#failure-domainbetakubernetesiozone}

请参阅 [topology.kubernetes.io/zone](#topologykubernetesiozone)。

{{< note >}}
<!--
Starting in v1.17, this label is deprecated in favor of [topology.kubernetes.io/zone](#topologykubernetesiozone). 
-->
从 v1.17 开始，此标签已弃用，取而代之的是 [topology.kubernetes.io/zone](#topologykubernetesiozone)。
{{</note>}}

### pv.kubernetes.io/bind-completed {#pv-kubernetesiobind-completed}

<!--
Example: `pv.kubernetes.io/bind-completed: "yes"`

Used on: PersistentVolumeClaim

When this annotation is set on a PersistentVolumeClaim (PVC), that indicates that the lifecycle
of the PVC has passed through initial binding setup. When present, that information changes
how the control plane interprets the state of PVC objects.
The value of this annotation does not matter to Kubernetes.
-->
例子：`pv.kubernetes.io/bind-completed: "yes"`

用于：PersistentVolumeClaim

当在 PersistentVolumeClaim (PVC) 上设置此注解时，表示 PVC 的生命周期已通过初始绑定设置。
当存在此注解时，该信息会改变控制平面解释 PVC 对象状态的方式。此注解的值对 Kubernetes 无关紧要。

### pv.kubernetes.io/bound-by-controller {#pv-kubernetesioboundby-controller}

<!--
Example: `pv.kubernetes.io/bound-by-controller: "yes"`

Used on: PersistentVolume, PersistentVolumeClaim

If this annotation is set on a PersistentVolume or PersistentVolumeClaim, it indicates that a storage binding
(PersistentVolume → PersistentVolumeClaim, or PersistentVolumeClaim → PersistentVolume) was installed
by the {{< glossary_tooltip text="controller" term_id="controller" >}}.
If the annotation isn't set, and there is a storage binding in place, the absence of that annotation means that
the binding was done manually. The value of this annotation does not matter.
-->
例子：`pv.kubernetes.io/bound-by-controller: "yes"`

用于：PersistentVolume、PersistentVolumeClaim

如果此注解设置在 PersistentVolume 或 PersistentVolumeClaim 上，则表示存储绑定
（PersistentVolume → PersistentVolumeClaim，或 PersistentVolumeClaim → PersistentVolume）
已由{{< glossary_tooltip text="控制器" term_id="controller" >}}配置完毕。
如果未设置此注解，且存在存储绑定，则缺少该注解意味着绑定是手动完成的。此注解的值无关紧要。

### pv.kubernetes.io/provisioned-by {#pv-kubernetesiodynamically-provisioned}

<!--
Example: `pv.kubernetes.io/provisioned-by: "kubernetes.io/rbd"`

Used on: PersistentVolume

This annotation is added to a PersistentVolume(PV) that has been dynamically provisioned by Kubernetes.
Its value is the name of volume plugin that created the volume. It serves both user (to show where a PV
comes from) and Kubernetes (to recognize dynamically provisioned PVs in its decisions).
-->
例子：`pv.kubernetes.io/provisioned-by: "kubernetes.io/rbd"`

用于：PersistentVolume

此注解被添加到已由 Kubernetes 动态制备的 PersistentVolume (PV)。
它的值是创建卷的卷插件的名称。它同时服务于用户（显示 PV 的来源）和 Kubernetes（识别其决策中动态制备的 PV）。

### pv.kubernetes.io/migrated-to {#pv-kubernetesio-migratedto}

<!--
Example: `pv.kubernetes.io/migrated-to: pd.csi.storage.gke.io`

Used on: PersistentVolume, PersistentVolumeClaim

It is added to a PersistentVolume(PV) and PersistentVolumeClaim(PVC) that is supposed to be
dynamically provisioned/deleted by its corresponding CSI driver through the `CSIMigration` feature gate.
When this annotation is set, the Kubernetes components will "stand-down" and the `external-provisioner`
will act on the objects.
-->
例子：`pv.kubernetes.io/migrated-to: pd.csi.storage.gke.io`

用于：PersistentVolume、PersistentVolumeClaim

它被添加到 PersistentVolume (PV) 和 PersistentVolumeClaim (PVC)，应该由其相应的 CSI
驱动程序通过 `CSIMigration` 特性门控动态制备/删除。设置此注解后，Kubernetes 组件将“停止”，
而 `external-provisioner` 将作用于对象。

<!--
### statefulset.kubernetes.io/pod-name {#statefulsetkubernetesiopod-name}

Example:

`statefulset.kubernetes.io/pod-name: "mystatefulset-7"`

When a StatefulSet controller creates a Pod for the StatefulSet, the control plane
sets this label on that Pod. The value of the label is the name of the Pod being created.

See [Pod Name Label](/docs/concepts/workloads/controllers/statefulset/#pod-name-label) in the
StatefulSet topic for more details.
-->
### statefulset.kubernetes.io/pod-name {#statefulsetkubernetesiopod-name}

例子：`statefulset.kubernetes.io/pod-name: "mystatefulset-7"`

当 StatefulSet 控制器为 StatefulSet 创建 Pod 时，控制平面会在该 Pod 上设置此标签。标签的值是正在创建的 Pod 的名称。

有关详细信息，请参阅 StatefulSet 主题中的 [Pod 名称标签](/zh-cn/docs/concepts/workloads/controllers/statefulset/#pod-name-label)。

<!--
### scheduler.alpha.kubernetes.io/node-selector {#schedulerkubernetesnode-selector}

Example: `scheduler.alpha.kubernetes.io/node-selector: "name-of-node-selector"`

Used on: Namespace

The [PodNodeSelector](/docs/reference/access-authn-authz/admission-controllers/#podnodeselector) uses this annotation key to assign node selectors to pods in namespaces.
-->
### scheduler.alpha.kubernetes.io/node-selector {#schedulerkubernetesnode-selector}

例子：`scheduler.alpha.kubernetes.io/node-selector: "name-of-node-selector"`

用于：Namespace

[PodNodeSelector](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#podnodeselector) 
使用此注解键为名字空间中的 Pod 设置节点选择算符。

<!--
### topology.kubernetes.io/region {#topologykubernetesioregion}

Example:

`topology.kubernetes.io/region: "us-east-1"`

See [topology.kubernetes.io/zone](#topologykubernetesiozone).
-->
### topology.kubernetes.io/region {#topologykubernetesioregion}

例子：`topology.kubernetes.io/region: "us-east-1"`

请参阅 [topology.kubernetes.io/zone](#topologykubernetesiozone)。

<!--
### topology.kubernetes.io/zone {#topologykubernetesiozone}

Example:

`topology.kubernetes.io/zone: "us-east-1c"`

Used on: Node, PersistentVolume

On Node: The `kubelet` or the external `cloud-controller-manager` populates this with the information as provided by the `cloudprovider`.  This will be set only if you are using a `cloudprovider`. However, you should consider setting this on nodes if it makes sense in your topology.

On PersistentVolume: topology-aware volume provisioners will automatically set node affinity constraints on `PersistentVolumes`.
-->
### topology.kubernetes.io/zone {#topologykubernetesiozone}

例子：`topology.kubernetes.io/zone: "us-east-1c"`

用于：Node、PersistentVolume

在 Node 上：`kubelet` 或外部 `cloud-controller-manager` 使用 `cloudprovider` 提供的信息填充它。
仅当你使用 `cloudprovider` 时才会设置此项。
但是，如果它在你的拓扑中有意义，你应该考虑在 Node 上设置它。

在 PersistentVolume 上：拓扑感知卷配置器将自动在 `PersistentVolume` 上设置 Node 亲和性约束。

<!--
A zone represents a logical failure domain.  It is common for Kubernetes clusters to span multiple zones for increased availability.  While the exact definition of a zone is left to infrastructure implementations, common properties of a zone include very low network latency within a zone, no-cost network traffic within a zone, and failure independence from other zones.  For example, nodes within a zone might share a network switch, but nodes in different zones should not.

A region represents a larger domain, made up of one or more zones.  It is uncommon for Kubernetes clusters to span multiple regions,  While the exact definition of a zone or region is left to infrastructure implementations, common properties of a region include higher network latency between them than within them, non-zero cost for network traffic between them, and failure independence from other zones or regions.  For example, nodes within a region might share power infrastructure (e.g. a UPS or generator), but nodes in different regions typically would not.
-->
一个 Zone 代表一个逻辑故障域。Kubernetes 集群通常跨越多个 Zone 以提高可用性。虽然 Zone 的确切定义留给基础设施实现，
但 Zone 的常见属性包括 Zone 内非常低的网络延迟、Zone 内的免费网络流量以及与其他 Zone 的故障独立性。
例如，一个 Zone 内的 Node 可能共享一个网络交换机，但不同 Zone 中的 Node 无法共享交换机。

一个 Region 代表一个更大的域，由一个或多个 Zone 组成。Kubernetes 集群跨多个 Region 并不常见，
虽然 Zone 或 Region 的确切定义留给基础设施实现，
但 Region 的共同属性包括它们之间的网络延迟比它们内部更高，它们之间的网络流量成本非零，
以及与其他 Zone 或 Region 的故障独立性。
例如，一个 Region 内的 Node 可能共享电力基础设施（例如 UPS 或发电机），但不同 Region 的 Node 通常不会共享电力基础设施。

<!--
Kubernetes makes a few assumptions about the structure of zones and regions:
1) regions and zones are hierarchical: zones are strict subsets of regions and no zone can be in 2 regions
2) zone names are unique across regions; for example region "africa-east-1" might be comprised of zones "africa-east-1a" and "africa-east-1b"
-->
Kubernetes 对 Zone 和 Region 的结构做了一些假设：

1. Zone 和 Region 是分层的：Zone 是 Region 的严格子集，没有 Zone 可以在两个 Region 中；

2. Zone 名称跨 Region 是唯一的；例如，Region “africa-east-1” 可能由 Zone “africa-east-1a”
   和 “africa-east-1b” 组成。

<!--
It should be safe to assume that topology labels do not change.  Even though labels are strictly mutable, consumers of them can assume that a given node is not going to be moved between zones without being destroyed and recreated.
-->
你可以大胆假设拓扑标签不会改变。尽管严格地讲标签是可变的，
但节点的用户可以假设给定节点只能通过销毁和重新创建才能完成 Zone 间移动。

<!--
Kubernetes can use this information in various ways.  For example, the scheduler automatically tries to spread the Pods in a ReplicaSet across nodes in a single-zone cluster (to reduce the impact of node failures, see [kubernetes.io/hostname](#kubernetesiohostname)). With multiple-zone clusters, this spreading behavior also applies to zones (to reduce the impact of zone failures). This is achieved via _SelectorSpreadPriority_.
-->
Kubernetes 可以通过多种方式使用这些信息。例如，调度程序会自动尝试将 ReplicaSet 中的 Pod
分布在单 Zone 集群中的多个节点上（以便减少节点故障的影响，请参阅 [kubernetes.io/hostname](#kubernetesiohostname)）。
对于多 Zone 集群，这种分布行为也适用于 Zone（以减少 Zone 故障的影响）。
Zone 级别的 Pod 分布是通过 **SelectorSpreadPriority** 实现的。

<!--
_SelectorSpreadPriority_ is a best effort placement. If the zones in your cluster are heterogeneous (for example: different numbers of nodes, different types of nodes, or different pod resource requirements), this placement might prevent equal spreading of your Pods across zones. If desired, you can use homogenous zones (same number and types of nodes) to reduce the probability of unequal spreading.
-->
**SelectorSpreadPriority** 是一个尽力而为的放置机制。如果集群中的 Zone 是异构的
（例如：节点数量不同、节点类型不同或 Pod 资源需求有别等），这种放置机制可能会让你的
Pod 无法实现跨 Zone 均匀分布。
如果需要，你可以使用同质 Zone（节点数量和类型均相同）来减少不均匀分布的可能性。

<!--
The scheduler (through the _VolumeZonePredicate_ predicate) also will ensure that Pods, that claim a given volume, are only placed into the same zone as that volume. Volumes cannot be attached across zones.
-->
调度程序还将（通过 **VolumeZonePredicate** 条件）确保申领给定卷的 Pod 仅被放置在与该卷相同的 Zone 中。
卷不能跨 Zone 挂接。

<!--
If `PersistentVolumeLabel` does not support automatic labeling of your PersistentVolumes, you should consider
adding the labels manually (or adding support for `PersistentVolumeLabel`). With `PersistentVolumeLabel`, the scheduler prevents Pods from mounting volumes in a different zone. If your infrastructure doesn't have this constraint, you don't need to add the zone labels to the volumes at all.
-->
你应该考虑手动添加标签（或添加对 `PersistentVolumeLabel` 的支持）。
基于 `PersistentVolumeLabel`，调度程序可以防止 Pod 挂载来自其他 Zone 的卷。
如果你的基础架构没有此限制，则不需要将 Zone 标签添加到卷上。

<!--
### volume.beta.kubernetes.io/storage-provisioner (deprecated)

Example: `volume.beta.kubernetes.io/storage-provisioner: "k8s.io/minikube-hostpath"`

Used on: PersistentVolumeClaim

This annotation has been deprecated.
-->
### volume.beta.kubernetes.io/storage-provisioner (已弃用) {#volume-beta-kubernetes-io-storage-provisioner}

例子：`volume.beta.kubernetes.io/storage-provisioner: "k8s.io/minikube-hostpath"`

用于：PersistentVolumeClaim

此注解已被弃用。

<!--
### volume.beta.kubernetes.io/storage-class (deprecated)

Example: `volume.beta.kubernetes.io/storage-class: "example-class"`

Used on: PersistentVolume, PersistentVolumeClaim
-->
### volume.beta.kubernetes.io/storage-class（已弃用）   {#volume-beta-storage-class}

例子：`volume.beta.kubernetes.io/storage-class: "example-class"`

用于：PersistentVolume、PersistentVolumeClaim

<!--
This annotation can be used for PersistentVolume(PV) or PersistentVolumeClaim(PVC) to specify the name of [StorageClass](/docs/concepts/storage/storage-classes/). When both `storageClassName` attribute and `volume.beta.kubernetes.io/storage-class` annotation are specified, the annotation `volume.beta.kubernetes.io/storage-class` takes precedence over the `storageClassName` attribute.

This annotation has been deprecated. Instead, set the [`storageClassName` field](/docs/concepts/storage/persistent-volumes/#class)
for the PersistentVolumeClaim or PersistentVolume.
-->
此注解可以为 PersistentVolume (PV) 或 PersistentVolumeClaim (PVC) 指定
[StorageClass](/zh-cn/docs/concepts/storage/storage-classes/)。
当 `storageClassName` 属性和 `volume.beta.kubernetes.io/storage-class` 注解均被指定时，
注解 `volume.beta.kubernetes.io/storage-class` 将优先于 `storageClassName` 属性。

此注解已被弃用。作为替代方案，你应该为 PersistentVolumeClaim 或 PersistentVolume 设置
[`storageClassName` 字段](/zh-cn/docs/concepts/storage/persistent-volumes/#class)。

<!--
### volume.beta.kubernetes.io/mount-options (deprecated) {#mount-options}

Example : `volume.beta.kubernetes.io/mount-options: "ro,soft"`

Used on: PersistentVolume

A Kubernetes administrator can specify additional [mount options](/docs/concepts/storage/persistent-volumes/#mount-options) for when a PersistentVolume is mounted on a node.

This annotation has been deprecated.
-->
### volume.beta.kubernetes.io/mount-options（已弃用） {#mount-options}

例子：`volume.beta.kubernetes.io/mount-options: "ro,soft"`

用于：PersistentVolume

针对 PersistentVolume 挂载到一个节点上的情形，
Kubernetes 管理员可以指定更多的[挂载选项](/zh-cn/docs/concepts/storage/persistent-volumes/#mount-options)。

该注解已弃用。

<!--
### volume.kubernetes.io/storage-provisioner

Used on: PersistentVolumeClaim

This annotation will be added to dynamic provisioning required PVC.
-->
### volume.kubernetes.io/storage-provisioner {#volume-kubernetes-io-storage-provisioner}

用于：PersistentVolumeClaim

此注解将被添加到根据需要动态制备的 PVC 上。

<!--
### volume.kubernetes.io/selected-node

Used on: PersistentVolumeClaim

This annotation is added to a PVC that is triggered by a scheduler to be dynamically provisioned. Its value is the name of the selected node.
-->
### volume.kubernetes.io/selected-node   {#selected-node}

用于：PersistentVolumeClaim

此注解被添加到调度程序所触发的 PVC 上，对应的 PVC 需要被动态制备。注解值是选定节点的名称。

<!--
### volumes.kubernetes.io/controller-managed-attach-detach

Used on: Node

If a node has set the annotation `volumes.kubernetes.io/controller-managed-attach-detach`
on itself, then its storage attach and detach operations are being managed
by the _volume attach/detach_
{{< glossary_tooltip text="controller" term_id="controller" >}} running within the
{{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}.

The value of the annotation isn't important; if this annotation exists on a node,
then storage attaches and detaches are controller managed.
-->
### volumes.kubernetes.io/controller-managed-attach-detach   {#controller-managed-attach-detach}

用于：Node

如果节点已在其自身上设置了注解 `volumes.kubernetes.io/controller-managed-attach-detach`，
那么它的存储挂接和解除挂接的操作是交由运行在
{{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}
中的**卷挂接/解除挂接**{{< glossary_tooltip text="控制器" term_id="controller" >}}来管理的。

注解的值并不重要；如果节点上存在该注解，则由控制器管理存储挂接和解除挂接的操作。

<!--
### node.kubernetes.io/windows-build {#nodekubernetesiowindows-build}

Example: `node.kubernetes.io/windows-build: "10.0.17763"`

Used on: Node

When the kubelet is running on Microsoft Windows, it automatically labels its node to record the version of Windows Server in use.

The label's value is in the format "MajorVersion.MinorVersion.BuildNumber".
-->
### node.kubernetes.io/windows-build {#nodekubernetesiowindows-build}

例子：`node.kubernetes.io/windows-build: "10.0.17763"`

用于：Node

当 kubelet 在 Microsoft Windows 上运行时，它会自动标记其所在节点以记录所使用的 Windows Server 的版本。

标签的值采用 “MajorVersion.MinorVersion.BuildNumber” 格式。

<!--
### service.kubernetes.io/headless {#servicekubernetesioheadless}

Example: `service.kubernetes.io/headless: ""`

Used on: Service

The control plane adds this label to an Endpoints object when the owning Service is headless.
-->
### service.kubernetes.io/headless {#servicekubernetesioheadless}

例子：`service.kubernetes.io/headless: ""`

用于：Service

当拥有的 Service 是无头类型时，控制平面将此标签添加到 Endpoints 对象。

<!--
### kubernetes.io/service-name {#kubernetesioservice-name}

Example: `kubernetes.io/service-name: "my-website"`

Used on: EndpointSlice

Kubernetes associates [EndpointSlices](/docs/concepts/services-networking/endpoint-slices/) with
[Services](/docs/concepts/services-networking/service/) using this label.

This label records the {{< glossary_tooltip term_id="name" text="name">}} of the
Service that the EndpointSlice is backing. All EndpointSlices should have this label set to
the name of their associated Service.
-->
### kubernetes.io/service-name {#kubernetesioservice-name}

例子：`kubernetes.io/service-name: "my-website"`

用于：EndpointSlice

Kubernetes 使用这个标签将
[EndpointSlices](/zh-cn/docs/concepts/services-networking/endpoint-slices/)
与[服务](/zh-cn/docs/concepts/services-networking/service/)关联。

这个标签记录了 EndpointSlice 后备服务的{{< glossary_tooltip term_id="name" text="名称">}}。
所有 EndpointSlice 都应将此标签设置为其关联服务的名称。

<!--
### kubernetes.io/service-account.name

Example: `kubernetes.io/service-account.name: "sa-name"`

Used on: Secret

This annotation records the {{< glossary_tooltip term_id="name" text="name">}} of the
ServiceAccount that the token (stored in the Secret of type `kubernetes.io/service-account-token`) represents.
-->
### kubernetes.io/service-account.name {#service-account-name}

示例：`kubernetes.io/service-account.name: "sa-name"`

用于：Secret

这个注解记录了令牌（存储在 `kubernetes.io/service-account-token` 类型的 Secret 中）所代表的
ServiceAccount 的{{<glossary_tooltip term_id="name" text="名称">}}。

<!-- 
### kubernetes.io/service-account.uid

Example: `kubernetes.io/service-account.uid: da68f9c6-9d26-11e7-b84e-002dc52800da`

Used on: Secret

This annotation records the {{< glossary_tooltip term_id="uid" text="unique ID" >}} of the
ServiceAccount that the token (stored in the Secret of type `kubernetes.io/service-account-token`) represents.
-->
### kubernetes.io/service-account.uid {#service-account-uid}

示例：`kubernetes.io/service-account.uid: da68f9c6-9d26-11e7-b84e-002dc52800da`

用于：Secret

该注解记录了令牌（存储在 `kubernetes.io/service-account-token` 类型的 Secret 中）所代表的
ServiceAccount 的{{<glossary_tooltip term_id="uid" text="唯一 ID" >}}。

<!--
### kubernetes.io/legacy-token-last-used

Example: `kubernetes.io/legacy-token-last-used: 2022-10-24`

Used on: Secret

The control plane only adds this label for Secrets that have the type `kubernetes.io/service-account-token`.
The value of this label records the date (ISO 8601 format, UTC time zone) when the control plane last saw
a request where the client authenticated using the service account token.

If a legacy token was last used before the cluster gained the feature (added in Kubernetes v1.26), then
the label isn't set.
-->
### kubernetes.io/legacy-token-last-used

例子：`kubernetes.io/legacy-token-last-used: 2022-10-24`

用于：Secret

控制面仅为 `kubernetes.io/service-account-token` 类型的 Secret 添加此标签。
该标签的值记录着控制面最近一次接到客户端使用服务帐户令牌进行身份验证请求的日期（ISO 8601
格式，UTC 时区）

如果上一次使用老的令牌的时间在集群获得此特性（添加于 Kubernetes v1.26）之前，则不会设置此标签。

<!--
### endpointslice.kubernetes.io/managed-by {#endpointslicekubernetesiomanaged-by}

Example: `endpointslice.kubernetes.io/managed-by: "controller"`

Used on: EndpointSlices

The label is used to indicate the controller or entity that manages an EndpointSlice. This label aims to enable different EndpointSlice objects to be managed by different controllers or entities within the same cluster.
-->
### endpointslice.kubernetes.io/managed-by {#endpointslicekubernetesiomanaged-by}

例子：`endpointslice.kubernetes.io/managed-by: "controller"`

用于：EndpointSlice

用于标示管理 EndpointSlice 的控制器或实体。该标签旨在使不同的 EndpointSlice
对象能够由同一集群内的不同控制器或实体管理。

<!--
### endpointslice.kubernetes.io/skip-mirror {#endpointslicekubernetesioskip-mirror}

Example: `endpointslice.kubernetes.io/skip-mirror: "true"`

Used on: Endpoints

The label can be set to `"true"` on an Endpoints resource to indicate that the EndpointSliceMirroring controller should not mirror this resource with EndpointSlices.
-->
### endpointslice.kubernetes.io/skip-mirror {#endpointslicekubernetesioskip-mirror}

例子：`endpointslice.kubernetes.io/skip-mirror: "true"`

用于：Endpoints

可以在 Endpoints 资源上将此标签设置为 `"true"`，以指示 EndpointSliceMirroring
控制器不应使用 EndpointSlice 镜像此 Endpoints 资源。

<!--
### service.kubernetes.io/service-proxy-name {#servicekubernetesioservice-proxy-name}

Example: `service.kubernetes.io/service-proxy-name: "foo-bar"`

Used on: Service

The kube-proxy has this label for custom proxy, which delegates service control to custom proxy.
-->
### service.kubernetes.io/service-proxy-name {#servicekubernetesioservice-proxy-name}

例子：`service.kubernetes.io/service-proxy-name: "foo-bar"`

用于：Service

kube-proxy 自定义代理会使用这个标签，它将服务控制委托给自定义代理。

<!--
### experimental.windows.kubernetes.io/isolation-type (deprecated) {#experimental-windows-kubernetes-io-isolation-type}

Example: `experimental.windows.kubernetes.io/isolation-type: "hyperv"`

Used on: Pod

The annotation is used to run Windows containers with Hyper-V isolation. To use Hyper-V isolation feature and create a Hyper-V isolated container, the kubelet should be started with feature gates HyperVContainer=true and the Pod should include the annotation `experimental.windows.kubernetes.io/isolation-type: hyperv`.
-->
### experimental.windows.kubernetes.io/isolation-type (已弃用) {#experimental-windows-kubernetes-io-isolation-type}

例子：`experimental.windows.kubernetes.io/isolation-type: "hyperv"`

用于：Pod

注解用于运行具有 Hyper-V 隔离的 Windows 容器。要使用 Hyper-V 隔离功能并创建 Hyper-V
隔离容器，kubelet 启动时应该需要设置特性门控 HyperVContainer=true。

{{< note >}}
<!--
You can only set this annotation on Pods that have a single container.
Starting from v1.20, this annotation is deprecated. Experimental Hyper-V support was removed in 1.21.
-->
你只能在具有单个容器的 Pod 上设置此注解。
从 v1.20 开始，此注解已弃用。1.21 中删除了实验性 Hyper-V 支持。
{{</note>}}

<!--
### ingressclass.kubernetes.io/is-default-class

Example: `ingressclass.kubernetes.io/is-default-class: "true"`

Used on: IngressClass

When a single IngressClass resource has this annotation set to `"true"`, new Ingress resource without a class specified will be assigned this default class.
-->
### ingressclass.kubernetes.io/is-default-class {#ingressclass-kubernetes-io-is-default-class}

例子：`ingressclass.kubernetes.io/is-default-class: "true"`

用于：IngressClass

当单个 IngressClass 资源将此注解设置为 `"true"`时，新的未指定 Ingress 类的 Ingress
资源将被设置为此默认类。

<!--
### kubernetes.io/ingress.class (deprecated)
-->
### kubernetes.io/ingress.class (已弃用) {#kubernetes-io-ingress-class}

{{< note >}}
<!--
Starting in v1.18, this annotation is deprecated in favor of `spec.ingressClassName`.
-->
从 v1.18 开始，不推荐使用此注解以鼓励使用 `spec.ingressClassName`。
{{</note>}}

<!--
### ingressclass.kubernetes.io/is-default-class

Example: `ingressclass.kubernetes.io/is-default-class: "true"`

Used on: IngressClass

When a single IngressClass resource has this annotation set to `"true"`, new Ingress resource without a class specified will be assigned this default class.
-->
### storageclass.kubernetes.io/is-default-class {#storageclass-kubernetes-io-is-default-class}

例子：`ingressclass.kubernetes.io/is-default-class: "true"`

用于：StorageClass

当单个 StorageClass 资源将此注解设置为 `"true"` 时，新的未指定存储类的 PersistentVolumeClaim
资源将被设置为此默认类。

<!--
### alpha.kubernetes.io/provided-node-ip

Example: `alpha.kubernetes.io/provided-node-ip: "10.0.0.1"`

Used on: Node

The kubelet can set this annotation on a Node to denote its configured IPv4 address.

When kubelet is started with the `--cloud-provider` flag set to any value (includes both external and legacy in-tree cloud providers), it sets this annotation on the Node to denote an IP address set from the command line flag (`--node-ip`). This IP is verified with the cloud provider as valid by the cloud-controller-manager.
-->
### alpha.kubernetes.io/provided-node-ip {#alpha-kubernetes-io-provided-node-ip}

例子：`alpha.kubernetes.io/provided-node-ip: "10.0.0.1"`

用于：Node

kubelet 可以在 Node 上设置此注解来表示其配置的 IPv4 地址。

如果 kubelet 被启动时 `--cloud-provider` 标志设置为任一云驱动（包括外部云驱动和传统树内云驱动）
kubelet 会在 Node 上设置此注解以表示从命令行标志（`--node-ip`）设置的 IP 地址。
云控制器管理器通过云驱动验证此 IP 是否有效。

<!--
### batch.kubernetes.io/job-completion-index

Example: `batch.kubernetes.io/job-completion-index: "3"`

Used on: Pod

The Job controller in the kube-controller-manager sets this annotation for Pods
created with Indexed [completion mode](/docs/concepts/workloads/controllers/job/#completion-mode).
-->
### batch.kubernetes.io/job-completion-index {#batch-kubernetes-io-job-completion-index}

例子：`batch.kubernetes.io/job-completion-index: "3"`

用于：Pod

kube-controller-manager 中的 Job 控制器为使用 Indexed
[完成模式](/zh-cn/docs/concepts/workloads/controllers/job/#completion-mode)创建的 Pod
设置此注解。

<!--
### kubectl.kubernetes.io/default-container

Example: `kubectl.kubernetes.io/default-container: "front-end-app"`

The value of the annotation is the container name that is default for this Pod. For example, `kubectl logs` or `kubectl exec` without `-c` or `--container` flag will use this default container.
-->
### kubectl.kubernetes.io/default-container {#kubectl-kubernetes-io-default-container}

例子：`kubectl.kubernetes.io/default-container: "front-end-app"`

此注解的值是此 Pod 的默认容器名称。例如，未指定 `-c` 或 `--container` 标志时执行
`kubectl logs` 或 `kubectl exec` 命令将使用此默认容器。

<!--
### kubectl.kubernetes.io/default-logs-container (deprecated)

Example: `kubectl.kubernetes.io/default-logs-container: "front-end-app"`

The value of the annotation is the container name that is the default logging container for this Pod. For example, `kubectl logs` without `-c` or `--container` flag will use this default container.
-->
### kubectl.kubernetes.io/default-logs-container（已弃用）   {#default-logs-container}

例子：`kubectl.kubernetes.io/default-logs-container: "front-end-app"`

此注解的值是针对此 Pod 的默认日志记录容器的名称。例如，不带 `-c` 或 `--container`
标志的 `kubectl logs` 将使用此默认容器。

{{< note >}}
<!--
This annotation is deprecated. You should use the [`kubectl.kubernetes.io/default-container`](#kubectl-kubernetes-io-default-container) annotation instead.
Kubernetes versions 1.25 and newer ignore this annotation.
-->
此注解已被弃用。取而代之的是使用
[`kubectl.kubernetes.io/default-container`](#kubectl-kubernetes-io-default-container) 注解。
Kubernetes v1.25 及更高版本将忽略此注解。
{{< /note >}}

<!--
### endpoints.kubernetes.io/over-capacity

Example: `endpoints.kubernetes.io/over-capacity:truncated`

Used on: Endpoints

The {{< glossary_tooltip text="control plane" term_id="control-plane" >}} adds this annotation to an [Endpoints](/docs/concepts/services-networking/service/#endpoints) object if the associated {{< glossary_tooltip term_id="service" >}} has more than 1000 backing endpoints. The annotation indicates that the Endpoints object is over capacity and the number of endpoints has been truncated to 1000.

If the number of backend endpoints falls below 1000, the control plane removes this annotation.
-->
### endpoints.kubernetes.io/over-capacity {#endpoints-kubernetes-io-over-capacity}

例子：`endpoints.kubernetes.io/over-capacity:truncated`

用于：Endpoints

如果关联的 {{< glossary_tooltip term_id="service" >}} 有超过 1000 个后备端点，
则{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}将此注解添加到
[Endpoints](/zh-cn/docs/concepts/services-networking/service/#endpoints) 对象。
此注解表示 Endpoints 对象已超出容量，并且已将 Endpoints 数截断为 1000。

如果后端端点的数量低于 1000，则控制平面将移除此注解。

<!--
### batch.kubernetes.io/job-tracking (deprecated) {#batch-kubernetes-io-job-tracking}

Example: `batch.kubernetes.io/job-tracking: ""`

Used on: Jobs

The presence of this annotation on a Job indicates that the control plane is
[tracking the Job status using finalizers](/docs/concepts/workloads/controllers/job/#job-tracking-with-finalizers).
The control plane uses this annotation to safely transition to tracking Jobs
using finalizers, while the feature is in development.
You should **not** manually add or remove this annotation.
-->
### batch.kubernetes.io/job-tracking (已弃用) {#batch-kubernetes-io-job-tracking}

例子：`batch.kubernetes.io/job-tracking: ""`

用于：Job

Job 上存在此注解表明控制平面正在[使用 Finalizer 追踪 Job](/zh-cn/docs/concepts/workloads/controllers/job/#job-tracking-with-finalizers)。
控制平面使用此注解来安全地转换为使用 Finalizer 追踪 Job，而此特性正在开发中。
你 **不** 可以手动添加或删除此注解。

{{< note >}}
<!--
Starting from Kubernetes 1.26, this annotation is deprecated.
Kubernetes 1.27 and newer will ignore this annotation and always track Jobs
using finalizers.
-->
从 Kubernetes 1.26 开始，该注解被弃用。
Kubernetes 1.27 及以上版本将忽略此注解，并始终使用 Finalizer 追踪 Job。
{{< /note >}}

<!--
### scheduler.alpha.kubernetes.io/defaultTolerations {#scheduleralphakubernetesio-defaulttolerations}

Example: `scheduler.alpha.kubernetes.io/defaultTolerations: '[{"operator": "Equal", "value": "value1", "effect": "NoSchedule", "key": "dedicated-node"}]'`

Used on: Namespace

This annotation requires the [PodTolerationRestriction](/docs/reference/access-authn-authz/admission-controllers/#podtolerationrestriction) admission controller to be enabled. This annotation key allows assigning tolerations to a namespace and any new pods created in this namespace would get these tolerations added.
-->
### scheduler.alpha.kubernetes.io/defaultTolerations {#scheduleralphakubernetesio-defaulttolerations}

例子：`scheduler.alpha.kubernetes.io/defaultTolerations: '[{"operator": "Equal", "value": "value1", "effect": "NoSchedule", "key": "dedicated-node"}]'`

用于：Namespace

此注解需要启用
[PodTolerationRestriction](/zh-cn/docs/reference/access-authn-authz/admission-controllers/#podtolerationrestriction)
准入控制器。此注解键允许为某个命名空间分配容忍度，在这个命名空间中创建的所有新 Pod 都会被添加这些容忍度。

<!--
### scheduler.alpha.kubernetes.io/preferAvoidPods (deprecated) {#scheduleralphakubernetesio-preferavoidpods}

Used on: Nodes

This annotation requires the [NodePreferAvoidPods scheduling plugin](/docs/reference/scheduling/config/#scheduling-plugins)
to be enabled. The plugin is deprecated since Kubernetes 1.22.
Use [Taints and Tolerations](/docs/concepts/scheduling-eviction/taint-and-toleration/) instead.

**The taints listed below are always used on Nodes**
-->
### scheduler.alpha.kubernetes.io/preferAvoidPods（已弃用） {#scheduleralphakubernetesio-preferavoidpods}

用于：Node

此注解需要启用 [NodePreferAvoidPods 调度插件](/zh-cn/docs/reference/scheduling/config/#scheduling-plugins)。
该插件自 Kubernetes 1.22 起已被弃用。
请改用[污点和容忍度](/zh-cn/docs/concepts/scheduling-eviction/taint-and-toleration/)。

**下面列出的污点总是在 Node 上使用**

<!--
### node.kubernetes.io/not-ready

Example: `node.kubernetes.io/not-ready: "NoExecute"`

The node controller detects whether a node is ready by monitoring its health and adds or removes this taint accordingly.

### node.kubernetes.io/unreachable

Example: `node.kubernetes.io/unreachable: "NoExecute"`

The node controller adds the taint to a node corresponding to the [NodeCondition](/docs/concepts/architecture/nodes/#condition) `Ready` being `Unknown`.
-->
### node.kubernetes.io/not-ready {#node-kubernetes-io-not-ready}

例子：`node.kubernetes.io/not-ready: "NoExecute"`

Node 控制器通过监控 Node 的健康状况来检测 Node 是否准备就绪，并相应地添加或删除此污点。

### node.kubernetes.io/unreachable {#node-kubernetes-io-unreachable}

例子：`node.kubernetes.io/unreachable: "NoExecute"`

Node 控制器将此污点添加到对应[节点状况](/zh-cn/docs/concepts/architecture/nodes/#condition)`Ready`
为 `Unknown` 的 Node 上。

<!--
### node.kubernetes.io/unschedulable

Example: `node.kubernetes.io/unschedulable: "NoSchedule"`

The taint will be added to a node when initializing the node to avoid race condition.
-->
### node.kubernetes.io/unschedulable {#node-kubernetes-io-unschedulable}

例子：`node.kubernetes.io/unschedulable: "NoSchedule"`

在初始化 Node 期间，为避免竞争条件，此污点将被添加到 Node 上。

<!--
### node.kubernetes.io/memory-pressure

Example: `node.kubernetes.io/memory-pressure: "NoSchedule"`

The kubelet detects memory pressure based on `memory.available` and `allocatableMemory.available` observed on a Node. The observed values are then compared to the corresponding thresholds that can be set on the kubelet to determine if the Node condition and taint should be added/removed.
-->
### node.kubernetes.io/memory-pressure {#node-kubernetes-io-memory-pressure}

例子：`node.kubernetes.io/memory-pressure: "NoSchedule"`

kubelet 根据在 Node 上观察到的 `memory.available` 和 `allocatableMemory.available` 检测内存压力。
然后将观察到的值与可以在 kubelet 上设置的相应阈值进行比较，以确定是否应添加/删除 Node 状况和污点。

<!--
### node.kubernetes.io/disk-pressure

Example: `node.kubernetes.io/disk-pressure :"NoSchedule"`

The kubelet detects disk pressure based on `imagefs.available`, `imagefs.inodesFree`, `nodefs.available` and `nodefs.inodesFree`(Linux only) observed on a Node. The observed values are then compared to the corresponding thresholds that can be set on the kubelet to determine if the Node condition and taint should be added/removed.
-->
### node.kubernetes.io/disk-pressure {#node-kubernetes-io-disk-pressure}

例子：`node.kubernetes.io/disk-pressure :"NoSchedule"`

kubelet 根据在 Node 上观察到的 `imagefs.available`、`imagefs.inodesFree`、`nodefs.available`
和 `nodefs.inodesFree`（仅限 Linux ）检测磁盘压力。
然后将观察到的值与可以在 kubelet 上设置的相应阈值进行比较，以确定是否应添加/删除 Node 状况和污点。

<!--
### node.kubernetes.io/network-unavailable

Example: `node.kubernetes.io/network-unavailable: "NoSchedule"`

This is initially set by the kubelet when the cloud provider used indicates a requirement for additional network configuration. Only when the route on the cloud is configured properly will the taint be removed by the cloud provider.
-->
### node.kubernetes.io/network-unavailable {#node-kubernetes-io-network-unavailable}

例子：`node.kubernetes.io/network-unavailable: "NoSchedule"`

当使用的云驱动指示需要额外的网络配置时，此注解最初由 kubelet 设置。
只有云上的路由被正确地配置了，此污点才会被云驱动移除

<!--
### node.kubernetes.io/pid-pressure

Example: `node.kubernetes.io/pid-pressure: "NoSchedule"`

The kubelet checks D-value of the size of `/proc/sys/kernel/pid_max` and the PIDs consumed by Kubernetes on a node to get the number of available PIDs that referred to as the `pid.available` metric. The metric is then compared to the corresponding threshold that can be set on the kubelet to determine if the node condition and taint should be added/removed.
-->
### node.kubernetes.io/pid-pressure {#node-kubernetes-io-pid-pressure}

例子：`node.kubernetes.io/pid-pressure: "NoSchedule"`

kubelet 检查 `/proc/sys/kernel/pid_max` 大小的 D 值和 Kubernetes 在 Node 上消耗的 PID，
以获取可用 PID 数量，并将其作为 `pid.available` 指标值。
然后该指标与在 kubelet 上设置的相应阈值进行比较，以确定是否应该添加/删除 Node 状况和污点。

### node.kubernetes.io/out-of-service {#out-of-service}
<!--
Example: `node.kubernetes.io/out-of-service:NoExecute`

A user can manually add the taint to a Node marking it out-of-service. If the `NodeOutOfServiceVolumeDetach`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled on
`kube-controller-manager`, and a Node is marked out-of-service with this taint, the pods on the node will be forcefully deleted if there are no matching tolerations on it and volume detach operations for the pods terminating on the node will happen immediately. This allows the Pods on the out-of-service node to recover quickly on a different node.
-->
例子：`node.kubernetes.io/out-of-service:NoExecute`

用户可以手动将污点添加到节点，将其标记为停止服务。
如果 `kube-controller-manager` 上启用了 `NodeOutOfServiceVolumeDetach`
[特性门控](/zh-cn/docs/reference/command-line-tools-reference/feature-gates/)，
并且一个节点被这个污点标记为停止服务，如果节点上的 Pod 没有对应的容忍度，
这类 Pod 将被强制删除，并且，针对在节点上被终止 Pod 的卷分离操作将被立即执行。

{{< caution >}}
<!--
Refer to
[Non-graceful node shutdown](/docs/concepts/architecture/nodes/#non-graceful-node-shutdown)
for further details about when and how to use this taint.
-->
有关何时以及如何使用此污点的更多详细信息，请参阅[非正常节点关闭](/zh-cn/docs/concepts/architecture/nodes/#non-graceful-node-shutdown)。
{{< /caution >}}

<!--
### node.cloudprovider.kubernetes.io/uninitialized

Example: `node.cloudprovider.kubernetes.io/uninitialized: "NoSchedule"`

Sets this taint on a node to mark it as unusable, when kubelet is started with the "external" cloud provider, until a controller from the cloud-controller-manager initializes this node, and then removes the taint.
-->
### node.cloudprovider.kubernetes.io/uninitialized {#node-cloudprovider-kubernetes-io-shutdown}

例子：`node.cloudprovider.kubernetes.io/uninitialized: "NoSchedule"`

在使用“外部”云驱动启动 kubelet 时，在 Node 上设置此污点以将其标记为不可用，直到来自
cloud-controller-manager 的控制器初始化此 Node，然后移除污点。

<!--
### node.cloudprovider.kubernetes.io/shutdown

Example: `node.cloudprovider.kubernetes.io/shutdown: "NoSchedule"`

If a Node is in a cloud provider specified shutdown state, the Node gets tainted accordingly with `node.cloudprovider.kubernetes.io/shutdown` and the taint effect of `NoSchedule`.
-->
### node.cloudprovider.kubernetes.io/shutdown {#node-cloudprovider-kubernetes-io-shutdown}

例子：`node.cloudprovider.kubernetes.io/shutdown: "NoSchedule"`

如果 Node 处于云驱动所指定的关闭状态，则 Node 会相应地被设置污点，对应的污点和效果为
`node.cloudprovider.kubernetes.io/shutdown` 和 `NoSchedule`。

<!--
### pod-security.kubernetes.io/enforce

Example: `pod-security.kubernetes.io/enforce: "baseline"`

Used on: Namespace

Value **must** be one of `privileged`, `baseline`, or `restricted` which correspond to
[Pod Security Standard](/docs/concepts/security/pod-security-standards) levels. Specifically,
the `enforce` label _prohibits_ the creation of any Pod in the labeled Namespace which does not meet
the requirements outlined in the indicated level.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/enforce {#pod-security-kubernetes-io-enforce}

例子：`pod-security.kubernetes.io/enforce: "baseline"`

用于：Namespace

值**必须**是 `privileged`、`baseline` 或 `restricted` 之一，它们对应于
[Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards) 级别。
特别地，`enforce` 标签 **禁止** 在带标签的 Namespace 中创建任何不符合指示级别要求的 Pod。

请请参阅[在名字空间级别实施 Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission)了解更多信息。

<!--
### pod-security.kubernetes.io/enforce-version

Example: `pod-security.kubernetes.io/enforce-version: "{{< skew currentVersion >}}"`

Used on: Namespace

Value **must** be `latest` or a valid Kubernetes version in the format `v<MAJOR>.<MINOR>`.
This determines the version of the [Pod Security Standard](/docs/concepts/security/pod-security-standards)
policies to apply when validating a submitted Pod.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/enforce-version {#pod-security-kubernetes-io-enforce-version}

例子：`pod-security.kubernetes.io/enforce-version: "{{< skew currentVersion >}}"`

用于：Namespace

值**必须**是 `latest` 或格式为 `v<MAJOR>.<MINOR>` 的有效 Kubernetes 版本。
此注解决定了在验证提交的 Pod 时要应用的
[Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards)策略的版本。

请参阅[在名字空间级别实施 Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission)了解更多信息。

<!--
### pod-security.kubernetes.io/audit

Example: `pod-security.kubernetes.io/audit: "baseline"`

Used on: Namespace

Value **must** be one of `privileged`, `baseline`, or `restricted` which correspond to
[Pod Security Standard](/docs/concepts/security/pod-security-standards) levels. Specifically,
the `audit` label does not prevent the creation of a Pod in the labeled Namespace which does not meet
the requirements outlined in the indicated level, but adds an audit annotation to that Pod.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/audit {#pod-security-kubernetes-io-audit}

例子：`pod-security.kubernetes.io/audit: "baseline"`

用于：Namespace

值**必须**是与 [Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards) 级别相对应的
`privileged`、`baseline` 或 `restricted` 之一。
具体来说，`audit` 标签不会阻止在带标签的 Namespace 中创建不符合指示级别要求的 Pod，
但会向该 Pod 添加审计注解。

请参阅[在名字空间级别实施 Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission)了解更多信息。

<!--
### pod-security.kubernetes.io/audit-version

Example: `pod-security.kubernetes.io/audit-version: "{{< skew currentVersion >}}"`

Used on: Namespace

Value **must** be `latest` or a valid Kubernetes version in the format `v<MAJOR>.<MINOR>`.
This determines the version of the [Pod Security Standard](/docs/concepts/security/pod-security-standards)
policies to apply when validating a submitted Pod.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/audit-version {#pod-security-kubernetes-io-audit-version}

例子：`pod-security.kubernetes.io/audit-version: "{{< skew currentVersion >}}"`

用于：Namespace

值**必须**是 `latest` 或格式为 `v<MAJOR>.<MINOR>` 的有效 Kubernetes 版本。
此注解决定了在验证提交的 Pod 时要应用的
[Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards)策略的版本。

请参阅[在名字空间级别实施 Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission)了解更多信息。

<!--
### pod-security.kubernetes.io/warn

Example: `pod-security.kubernetes.io/warn: "baseline"`

Used on: Namespace

Value **must** be one of `privileged`, `baseline`, or `restricted` which correspond to
[Pod Security Standard](/docs/concepts/security/pod-security-standards) levels. Specifically,
the `warn` label does not prevent the creation of a Pod in the labeled Namespace which does not meet the
requirements outlined in the indicated level, but returns a warning to the user after doing so.
Note that warnings are also displayed when creating or updating objects that contain Pod templates,
such as Deployments, Jobs, StatefulSets, etc.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/warn {#pod-security-kubernetes-io-warn}

例子：`pod-security.kubernetes.io/warn: "baseline"`

用于：Namespace

值**必须**是与 [Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards)级别相对应的
`privileged`、`baseline` 或 `restricted` 之一。特别地，
`warn` 标签不会阻止在带标签的 Namespace 中创建不符合指示级别概述要求的 Pod，但会在这样做后向用户返回警告。
请注意，在创建或更新包含 Pod 模板的对象时也会显示警告，例如 Deployment、Jobs、StatefulSets 等。

请参阅[在名字空间级别实施 Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission)了解更多信息。

<!--
### pod-security.kubernetes.io/warn-version

Example: `pod-security.kubernetes.io/warn-version: "{{< skew currentVersion >}}"`

Used on: Namespace

Value **must** be `latest` or a valid Kubernetes version in the format `v<MAJOR>.<MINOR>`.
This determines the version of the [Pod Security Standard](/docs/concepts/security/pod-security-standards)
policies to apply when validating a submitted Pod. Note that warnings are also displayed when creating
or updating objects that contain Pod templates, such as Deployments, Jobs, StatefulSets, etc.

See [Enforcing Pod Security at the Namespace Level](/docs/concepts/security/pod-security-admission)
for more information.
-->
### pod-security.kubernetes.io/warn-version {#pod-security-kubernetes-io-warn-version}

例子：`pod-security.kubernetes.io/warn-version: "{{< skew currentVersion >}}"`

用于：Namespace

值**必须**是 `latest` 或格式为 `v<MAJOR>.<MINOR>` 的有效 Kubernetes 版本。
此注解决定了在验证提交的 Pod 时要应用的 [Pod 安全标准](/zh-cn/docs/concepts/security/pod-security-standards)策略的版本。
请注意，在创建或更新包含 Pod 模板的对象时也会显示警告，
例如 Deployment、Jobs、StatefulSets 等。

请参阅[在名字空间级别实施 Pod 安全性](/zh-cn/docs/concepts/security/pod-security-admission)了解更多信息。

### rbac.authorization.kubernetes.io/autoupdate

<!--
Example: `rbac.authorization.kubernetes.io/autoupdate: "false"`

Used on: ClusterRole, ClusterRoleBinding, Role, RoleBinding
-->
例子：`rbac.authorization.kubernetes.io/autoupdate: "false"`

用于：ClusterRole、ClusterRoleBinding、Role、RoleBinding

<!--
When this annotation is set to `"true"` on default RBAC objects created by the kube-apiserver, they are automatically updated at server start to add missing permissions and subjects (extra permissions and subjects are left in place). To prevent autoupdating a particular role or rolebinding, set this annotation to `"false"`.
If you create your own RBAC objects and set this annotation to `"false"`, `kubectl auth reconcile`
(which allows reconciling arbitrary RBAC objects in a {{< glossary_tooltip text="manifest" term_id="manifest" >}}) respects this annotation and does not automatically add missing permissions and
subjects.
-->
当在 kube-apiserver 创建的默认 RBAC 对象上将此注解设置为 `"true"` 时，
这些对象会在服务器启动时自动更新以添加缺少的权限和主体（额外的权限和主体留在原处）。
要防止自动更新特定的 Role 或 RoleBinding，请将此注解设置为 `"false"`。
如果你创建自己的 RBAC 对象并将此注解设置为 `"false"`，则 `kubectl auth reconcile`
（允许协调在{{< glossary_tooltip text="清单" term_id="manifest" >}}中给出的任意 RBAC 对象）
尊重此注解并且不会自动添加缺少的权限和主体。

<!--
### kubernetes.io/psp (deprecated) {#kubernetes-io-psp}

Example: `kubernetes.io/psp: restricted`

Used on: Pod

This annotation was only relevant if you were using [PodSecurityPolicies](/docs/concepts/security/pod-security-policy/).
Kubernetes v{{< skew currentVersion >}} does not support the PodSecurityPolicy API.

When the PodSecurityPolicy admission controller admitted a Pod, the admission controller
modified the Pod to have this annotation.
The value of the annotation was the name of the PodSecurityPolicy that was used for validation.
-->
### kubernetes.io/psp（已弃用） {#kubernetes-io-psp}

例如：`kubernetes.io/psp: restricted`

用于：Pod

这个注解只在你使用 [PodSecurityPolicies](/zh-cn/docs/concepts/security/pod-security-policy/) 时才有意义。
Kubernetes v{{< skew currentVersion >}} 不支持 PodSecurityPolicy API。

当 PodSecurityPolicy 准入控制器接受一个 Pod 时，会修改该 Pod，并给这个 Pod 添加此注解。
注解的值是用来对 Pod 进行验证检查的 PodSecurityPolicy 的名称。

<!--
### seccomp.security.alpha.kubernetes.io/pod (deprecated) {#seccomp-security-alpha-kubernetes-io-pod}

This annotation has been deprecated since Kubernetes v1.19 and will become non-functional in a future release.
please use the corresponding pod or container `securityContext.seccompProfile` field instead.
To specify security settings for a Pod, include the `securityContext` field in the Pod specification.
The [`securityContext`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context) field within a Pod's `.spec` defines pod-level security attributes.
When you [specify the security context for a Pod](/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod),
the settings you specify apply to all containers in that Pod.
-->
### seccomp.security.alpha.kubernetes.io/pod (已弃用) {#seccomp-security-alpha-kubernetes-io-pod}

此注解自 Kubernetes v1.19 起已被弃用，将在未来的版本中失效。
请使用对应 Pod 或容器的 `securityContext.seccompProfile` 字段替代。
要为 Pod 指定安全设置，请在 Pod 规范中包含 `securityContext` 字段。
Pod 的 `.spec` 中的 [`securityContext`](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#security-context)
字段定义了 Pod 级别的安全属性。
你[为 Pod 设置安全上下文](/zh-cn/docs/tasks/configure-pod-container/security-context/#set-the-security-context-for-a-pod) 时，
你所给出的设置适用于该 Pod 中的所有容器。

<!--
### container.seccomp.security.alpha.kubernetes.io/[NAME] (deprecated) {#container-seccomp-security-alpha-kubernetes-io}

This annotation has been deprecated since Kubernetes v1.19 and will become non-functional in a future release.
please use the corresponding pod or container `securityContext.seccompProfile` field instead.
The tutorial [Restrict a Container's Syscalls with seccomp](/docs/tutorials/security/seccomp/) takes
you through the steps you follow to apply a seccomp profile to a Pod or to one of
its containers. That tutorial covers the supported mechanism for configuring seccomp in Kubernetes,
based on setting `securityContext` within the Pod's `.spec`.
-->
### container.seccomp.security.alpha.kubernetes.io/[NAME] （已弃用）{#container-seccomp-security-alpha-kubernetes-io}

此注解自 Kubernetes v1.19 起已被弃用，将在未来的版本中失效。
请使用对应 Pod 或容器的 `securityContext.seccompProfile` 字段替代。
教程[使用 seccomp 限制容器的系统调用](/zh-cn/docs/tutorials/security/seccomp/)将引导你完成将
seccomp 配置文件应用于 Pod 或其容器的步骤。
该教程介绍了在 Kubernetes 中配置 seccomp 的支持机制，基于在 Pod 的 `.spec` 中设置 `securityContext`。

### snapshot.storage.kubernetes.io/allow-volume-mode-change {#allow-volume-mode-change}
<!--
Example: `snapshot.storage.kubernetes.io/allow-volume-mode-change: "true"`

Used on: VolumeSnapshotContent
-->
例子：`snapshot.storage.kubernetes.io/allow-volume-mode-change: "true"`

用于：VolumeSnapshotContent

<!--
Value can either be `true` or `false`.
This determines whether a user can modify the mode of the source volume when a
{{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}} is being
created from a VolumeSnapshot.

Refer to [Converting the volume mode of a Snapshot](/docs/concepts/storage/volume-snapshots/#convert-volume-mode)
and the [Kubernetes CSI Developer Documentation](https://kubernetes-csi.github.io/docs/) for more information.
-->
值可以是 `true` 或者 `false`。取值决定了当从 VolumeSnapshot 创建
{{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}
时，用户是否可以修改源卷的模式。

更多信息请参阅[转换快照的卷模式](/zh-cn/docs/concepts/storage/volume-snapshots/#convert-volume-mode)和
[Kubernetes CSI 开发者文档](https://kubernetes-csi.github.io/docs/)。

<!--
### scheduler.alpha.kubernetes.io/critical-pod (deprecated)

Example: `scheduler.alpha.kubernetes.io/critical-pod: ""`

Used on: Pod

This annotation lets Kubernetes control plane know about a pod being a critical pod so that the descheduler will not remove this pod.
-->
### scheduler.alpha.kubernetes.io/critical-pod（已弃用）{#scheduler-alpha-kubernetes-io-critical-pod}

例子：`scheduler.alpha.kubernetes.io/critical-pod: ""`

用于：Pod

此注解让 Kubernetes 控制平面知晓某个 Pod 是一个关键的 Pod，这样 descheduler
将不会移除该 Pod。

{{< note >}}
<!--
Starting in v1.16, this annotation was removed in favor of [Pod Priority](/docs/concepts/scheduling-eviction/pod-priority-preemption/).
-->
从 v1.16 开始，此注解被移除，取而代之的是 [Pod 优先级](/zh-cn/docs/concepts/scheduling-eviction/pod-priority-preemption/)。
{{< /note >}}

<!--
## Annotations used for audit

- [`authorization.k8s.io/decision`](/docs/reference/labels-annotations-taints/audit-annotations/#authorization-k8s-io-decision)
- [`authorization.k8s.io/reason`](/docs/reference/labels-annotations-taints/audit-annotations/#authorization-k8s-io-reason)
- [`insecure-sha1.invalid-cert.kubernetes.io/$hostname`](/docs/reference/labels-annotations-taints/audit-annotations/#insecure-sha1-invalid-cert-kubernetes-io-hostname)
- [`missing-san.invalid-cert.kubernetes.io/$hostname`](/docs/reference/labels-annotations-taints/audit-annotations/#missing-san-invalid-cert-kubernetes-io-hostname)
- [`pod-security.kubernetes.io/audit-violations`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-audit-violations)
- [`pod-security.kubernetes.io/enforce-policy`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-enforce-policy)
- [`pod-security.kubernetes.io/exempt`](/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-exempt)

See more details on the [Audit Annotations](/docs/reference/labels-annotations-taints/audit-annotations/) page.
-->
## 用于审计的注解    {#annonations-used-for-audit}

<!-- sorted by annotation -->

- [`authorization.k8s.io/decision`](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#authorization-k8s-io-decision)
- [`authorization.k8s.io/reason`](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#authorization-k8s-io-reason)
- [`insecure-sha1.invalid-cert.kubernetes.io/$hostname`](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#insecure-sha1-invalid-cert-kubernetes-io-hostname)
- [`missing-san.invalid-cert.kubernetes.io/$hostname`](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#missing-san-invalid-cert-kubernetes-io-hostname)
- [`pod-security.kubernetes.io/audit-violations`](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-audit-violations)
- [`pod-security.kubernetes.io/enforce-policy`](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-enforce-policy)
- [`pod-security.kubernetes.io/exempt`](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/#pod-security-kubernetes-io-exempt)

在[审计注解](/zh-cn/docs/reference/labels-annotations-taints/audit-annotations/)页面上查看更多详细信息。

## kubeadm  {#kubeadm}

### kubeadm.alpha.kubernetes.io/cri-socket  {#cri-socket}

<!--
Example: `kubeadm.alpha.kubernetes.io/cri-socket: unix:///run/containerd/container.sock`

Used on: Node
-->
例子：`kubeadm.alpha.kubernetes.io/cri-socket: unix:///run/containerd/container.sock`

用于：Node

<!--
Annotation that kubeadm uses to preserve the CRI socket information given to kubeadm at `init`/`join` time for later use.
kubeadm annotates the Node object with this information. The annotation remains "alpha", since ideally this should
be a field in KubeletConfiguration instead.
-->
kubeadm 用来保存 `init`/`join` 时提供给 kubeadm 以后使用的 CRI 套接字信息的注解。
kubeadm 使用此信息为 Node 对象设置注解。
此注解仍然是 “alpha” 阶段，因为理论上这应该是 KubeletConfiguration 中的一个字段。

### kubeadm.kubernetes.io/etcd.advertise-client-urls  {#etcd-advertise-client-urls}

<!--
Example: `kubeadm.kubernetes.io/etcd.advertise-client-urls: https://172.17.0.18:2379`
Used on: Pod
-->
例子：`kubeadm.kubernetes.io/etcd.advertise-client-urls: https://172.17.0.18:2379`

用于：Pod

<!--
Annotation that kubeadm places on locally managed etcd pods to keep track of a list of URLs where etcd clients
should connect to. This is used mainly for etcd cluster health check purposes.
-->
kubeadm 为本地管理的 etcd Pod 设置的注解，用来跟踪 etcd 客户端应连接到的 URL 列表。
这主要用于 etcd 集群健康检查目的。

### kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint {#kube-apiserver-advertise-address-endpoint}

<!--
Example: `kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint: https://172.17.0.18:6443`

Used on: Pod
-->
例子：`kubeadm.kubernetes.io/kube-apiserver.advertise-address.endpoint: https://172.17.0.18:6443`

用于：Pod

<!--
Annotation that kubeadm places on locally managed kube-apiserver pods to keep track of the exposed advertise
address/port endpoint for that API server instance.
-->
kubeadm 为本地管理的 kube-apiserver Pod 设置的注解，用以跟踪该 API 服务器实例的公开宣告地址/端口端点。

### kubeadm.kubernetes.io/component-config.hash {#component-config-hash}

<!--
Used on: ConfigMap

Example: `kubeadm.kubernetes.io/component-config.hash: 2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae`
-->
例子：`kubeadm.kubernetes.io/component-config.hash: 2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae`

用于：ConfigMap

<!--
Annotation that kubeadm places on ConfigMaps that it manages for configuring components. It contains a hash (SHA-256)
used to determine if the user has applied settings different from the kubeadm defaults for a particular component.
-->
kubeadm 为它所管理的 ConfigMaps 设置的注解，用于配置组件。它包含一个哈希（SHA-256）值，
用于确定用户是否应用了不同于特定组件的 kubeadm 默认设置的设置。

### node-role.kubernetes.io/control-plane

<!--
Used on: Node

Label that kubeadm applies on the control plane nodes that it manages.
-->
用于：Node

kubeadm 在其管理的控制平面节点上应用的标签。

### node-role.kubernetes.io/control-plane {#node-role-kubernetes-io-control-plane-taint}

<!--
Used on: Node

Example: `node-role.kubernetes.io/control-plane:NoSchedule`
-->
用于：Node

例子：`node-role.kubernetes.io/control-plane:NoSchedule`

<!--
Taint that kubeadm applies on control plane nodes to allow only critical workloads to schedule on them.
-->
kubeadm 应用在控制平面节点上的污点，仅允许在其上调度关键工作负载。

<!--
### node-role.kubernetes.io/master (deprecated) {#node-role-kubernetes-io-master-taint}

Used on: Node

Example: `node-role.kubernetes.io/master:NoSchedule`

Taint that kubeadm previously applied on control plane nodes to allow only critical workloads to schedule on them.
Replaced by [`node-role.kubernetes.io/control-plane`](#node-role-kubernetes-io-control-plane-taint); kubeadm
no longer sets or uses this deprecated taint.
-->
### node-role.kubernetes.io/master（已弃用） {#node-role-kubernetes-io-master-taint}

用于：Node

例子：`node-role.kubernetes.io/master:NoSchedule`

kubeadm 先前应用在控制平面节点上的污点，仅允许在其上调度关键工作负载。
替换为 [`node-role.kubernetes.io/control-plane`](#node-role-kubernetes-io-control-plane-taint)；
kubeadm 不再设置或使用这个废弃的污点。
