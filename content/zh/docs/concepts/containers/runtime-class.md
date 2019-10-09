---
title: 容器运行时类(Runtime Class)
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.14" state="beta" >}}

<!-- 
This page describes the RuntimeClass resource and runtime selection mechanism.
-->

这个文档主要说明了 RuntimeClass 资源和 kubernetes 指定容器运行时的功能。

{{< warning >}}
<!-- 
RuntimeClass includes *breaking* changes in the beta upgrade in v1.14. If you were using
RuntimeClass prior to v1.14, see [Upgrading RuntimeClass from Alpha to
Beta](#upgrading-runtimeclass-from-alpha-to-beta).
-->

Kubernetes1.14 的 β 版的升级包含了 RuntimeClass 的 *破坏性* 的变更。
如果用户在使用 Kubernetes1.14 以前的 RuntimeClass 版本，
请参考文档[从 RuntimeClass 的 α 版升级到β版](#upgrading-runtimeclass-from-alpha-to-beta)。
{{< /warning >}}

{{% /capture %}}


{{% capture body %}}

<!-- 
## Runtime Class

RuntimeClass is a feature for selecting the container runtime configuration. The container runtime
configuration is used to run a Pod's containers.
-->

## 关于RuntimeClass

RuntimeClass 是可以让用户选择容器运行时的功能。用户通过设定容器运行时可以选择 Pod 的容器运行在那种容器运行时之上。

<!-- 
## Motivation

You can set a different RuntimeClass between different Pods to provide a balance of
performance versus security. For example, if part of your workload deserves a high
level of information security assurance, you might choose to schedule those Pods so
that they run in a container runtime that uses hardware virtualization. You'd then
benefit from the extra isolation of the alternative runtime, at the expense of some
additional overhead.

You can also use RuntimeClass to run different Pods with the same container runtime
but with different settings.
-->
## 使用场景
用户可以为不同的 Pod 设定不同的 RuntimeClass ，以达到动态调整容器安全和容器性能间的平衡的目的。例如，
如果用户的一部分工作需要确保高安全性，那么可以选择调度Pod使用到硬件虚拟化的容器运行时。
受益于硬件虚拟化带来的附加的容器隔离特性的同时，也会带来性能上的额外开销。

用户也可以通过这种方式，为Pod提供不同设定的同一种容器运行时。

<!--
### Set Up

Ensure the RuntimeClass feature gate is enabled (it is by default). See [Feature
Gates](/docs/reference/command-line-tools-reference/feature-gates/) for an explanation of enabling
feature gates. The `RuntimeClass` feature gate must be enabled on apiservers _and_ kubelets.

1. Configure the CRI implementation on nodes (runtime dependent)
2. Create the corresponding RuntimeClass resources
-->

### 设定

首先要先确认 RuntimeClass 功能的 Feature Gate 被设定为开启(默认是有效状态)。设定 Feature Gate 为有效的文档请参考[Feature Gates](/docs/reference/command-line-tools-reference/feature-gates/)。
`RuntimeClass`的 Feature Gate 开启需要 ApiServer 和 kubelet 同时将相关配置开启。

1. 配置节点的 CRI。（依赖于容器运行时）
2. 创建相应的 RuntimeClass 资源。

<!--
#### 1. Configure the CRI implementation on nodes

The configurations available through RuntimeClass are Container Runtime Interface (CRI)
implementation dependent. See the corresponding documentation ([below](#cri-configuration)) for your
CRI implementation for how to configure.
-->
#### 1. 实现节点上的CRI设定。

通过 RuntimeClass 进行设定的有效化，依赖于 Container Runtime Interface (CRI) 组件。
在用户环境中，CRI 的设定方法请参考([见下面](#cri-configuration))文档。

{{< note >}}
<！--
RuntimeClass assumes a homogeneous node configuration across the cluster by default (which means
that all nodes are configured the same way with respect to container runtimes). To support
heterogenous node configurations, see [Scheduling](#scheduling) below.
--> 

默认情况下，RuntimeClass 被假设为所有节点上的配置均为一致。(这意味着所有的 Node 节点的容器运行时必须以相同的方式进行设定)。
要支持不同配置构节点配置，请参见下面的[Scheduling]（＃scheduling）。

{{< /note >}}

<!--
The configurations have a corresponding `handler` name, referenced by the RuntimeClass. The
handler must be a valid DNS 1123 label (alpha-numeric + `-` characters).
-->
配置需要具有相应的 `handler` 名称，被用于 RuntimeClass 的设定。
被定义的 Handler 名称必须是有效的 DNS-1123 标准。(只能使用英文字母，数字 和 `-`)。

<!--
#### 2. Create the corresponding RuntimeClass resources

The configurations setup in step 1 should each have an associated `handler` name, which identifies
the configuration. For each handler, create a corresponding RuntimeClass object.

The RuntimeClass resource currently only has 2 significant fields: the RuntimeClass name
(`metadata.name`) and the handler (`handler`). The object definition looks like this:
-->
#### 2. 创建对应的RuntimeClass资源

为了便于识别各个项目，安装配置的第一步需要每个项目有一个关联的 `handler` 名称。这样就可以为每个 `handler` 创建对应的 RuntimeClass 资源了。

所以当前 RuntimeClass 资源有两个重要的设定项。一个是 RuntimeClass 的名称( `metadata.name` )和 Handler (`handler`)。RuntimeClass 的资源定义可以参考下面的内容。

```yaml
apiVersion: node.k8s.io/v1beta1  # RuntimeClass is defined in the node.k8s.io API group
kind: RuntimeClass
metadata:
  name: myclass  # The name the RuntimeClass will be referenced by
  # RuntimeClass is a non-namespaced resource
handler: myconfiguration  # The name of the corresponding CRI configuration
```

{{< note >}}
<!--
It is recommended that RuntimeClass write operations (create/update/patch/delete) be
restricted to the cluster administrator. This is typically the default. See [Authorization
Overview](/docs/reference/access-authn-authz/authorization/) for more details.
-->
推荐只有集群管理员具有针对 RuntimeClass 的各项操作权限(create/update/patch/delete)。
这通常是默认值。具体内容可以[授权概况](/docs/reference/access-authn-authz/authorization/)文档了解详细信息。
{{< /note >}}

<!--
### Usage

Once RuntimeClasses are configured for the cluster, using them is very simple. Specify a
`runtimeClassName` in the Pod spec. For example:
-->
### 使用方法

一旦集群中的 RuntimeClass 的设定完成，接下来的使用就变得非常简单了。只需要设定 PodSpec 的 `runtimeClassName` 设定项。  
例如：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: myclass
  # ...
```

<!--
This will instruct the Kubelet to use the named RuntimeClass to run this pod. If the named
RuntimeClass does not exist, or the CRI cannot run the corresponding handler, the pod will enter the
`Failed` terminal [phase](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase). Look for a
corresponding [event](/docs/tasks/debug-application-cluster/debug-application-introspection/) for an
error message.

If no `runtimeClassName` is specified, the default RuntimeHandler will be used, which is equivalent
to the behavior when the RuntimeClass feature is disabled.
-->

这个设定将让Kubelet使用指定的 RuntimeClass 来运行 Pod。如果 RuntimeClass 不存在， 或者 CRI 不能执行相应的 Handler，Pod 将会变成`Failed`[状态](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)。
请参考对应的相关[事件](/docs/tasks/debug-application-cluster/debug-application-introspection/)文档，确定错误信息。

如果 `runtimeClassName` 没有被设定的情况下，将会使用默认的 RuntimeHandler，这里的运行效果和 RuntimeClass 功能被禁止的情况下是一样的。

<!--
### CRI Configuration

For more details on setting up CRI runtimes, see [CRI installation](/docs/setup/production-environment/container-runtimes/).
-->
### CRI的设定

CRI 运行时的相关设定详细内容请参考[CRI的安装](/docs/setup/cri/)。

<!--
#### dockershim

Kubernetes built-in dockershim CRI does not support runtime handlers.
-->
#### dockershim

Kubernetes 的内置 dockershim CRI 不支持容器运行时 handlers。

<!--
#### [containerd](https://containerd.io/)

Runtime handlers are configured through containerd's configuration at
`/etc/containerd/config.toml`. Valid handlers are configured under the runtimes section:
-->
#### [containerd](https://containerd.io/)

运行时 handler 可以通过 containerd 的配置文件 `/etc/containerd/config.toml` 进行设定。
有效的 handlers 被设定在 runtimes 部分的下一层级。

```
[plugins.cri.containerd.runtimes.${HANDLER_NAME}]
```

<!--
See containerd's config documentation for more details:
https://github.com/containerd/cri/blob/master/docs/config.md
-->
`containerd` 的具体设定请参考下面的文档信息。  
https://github.com/containerd/cri/blob/master/docs/config.md

#### [cri-o](https://cri-o.io/)

<!--
Runtime handlers are configured through cri-o's configuration at `/etc/crio/crio.conf`. Valid
handlers are configured under the [crio.runtime
table](https://github.com/kubernetes-sigs/cri-o/blob/master/docs/crio.conf.5.md#crioruntime-table):
-->
运行时处理程序通过cri-o的配置在 `/etc/crio/crio.conf` 中进行配置。 
有效的处理程序在[crio.runtime表](https://github.com/kubernetes-sigs/cri-o/blob/master/docs/crio.conf.5.md#crioruntime-table)下配置。

```
[crio.runtime.runtimes.${HANDLER_NAME}]
  runtime_path = "${PATH_TO_BINARY}"
```

<!--
See cri-o's config documentation for more details:
https://github.com/kubernetes-sigs/cri-o/blob/master/cmd/crio/config.go
-->
有关更多详细信息，请参见cri-o的配置文档：
https://github.com/kubernetes-sigs/cri-o/blob/master/cmd/crio/config.go

<!--
### Scheduling
-->

### 调度

{{< feature-state for_k8s_version="v1.16" state="beta" >}}

<!--
As of Kubernetes v1.16, RuntimeClass includes support for heterogenous clusters through its
`scheduling` fields. Through the use of these fields, you can ensure that pods running with this
RuntimeClass are scheduled to nodes that support it. To use the scheduling support, you must have
the RuntimeClass [admission controller][] enabled (the default, as of 1.16).

To ensure pods land on nodes supporting a specific RuntimeClass, that set of nodes should have a
common label which is then selected by the `runtimeclass.scheduling.nodeSelector` field. The
RuntimeClass's nodeSelector is merged with the pod's nodeSelector in admission, effectively taking
the intersection of the set of nodes selected by each. If there is a conflict, the pod will be
rejected.
-->

从Kubernetes v1.16开始，RuntimeClass 通过 `scheduling` 字段添加了对异构集群的支持。 
通过使用这些字段，可以确保将与此 RuntimeClass一 起运行的 Pod 调度到支持它的节点上。 
要使用计划支持，您必须启用 RuntimeClass [admission controller] []（默认值，自1.16开始）。

为了确保 Pod 被调度到支持特定 RuntimeClass 的节点上，
那组节点应该具有一个公共标签，然后由 `runtimeclass.scheduling.nodeSelector` 字段选择该标签。 
RuntimeClass 的 nodeSelector 在调度时与 Pod 的 nodeSelector 合并，有效地进行节点选择，并且调度到相应节点。 
如果有冲突，则将拒绝该 Pod 被调度。

<!--

If the supported nodes are tainted to prevent other RuntimeClass pods from running on the node, you
can add `tolerations` to the RuntimeClass. As with the `nodeSelector`, the tolerations are merged
with the pod's tolerations in admission, effectively taking the union of the set of nodes tolerated
by each.

To learn more about configuring the node selector and tolerations, see [Assigning Pods to
Nodes](/docs/concepts/configuration/assign-pod-node/).

[admission controller]: /docs/reference/access-authn-authz/admission-controllers/
-->

如果受支持的节点被污染以防止其他 RuntimeClass 容器在该节点上运行，则可以向RuntimeClass添加 `tolerations` 设定。
与 `nodeSelector` 一样，容忍度在接纳时与容器的容忍度合并，从而有效地吸收了每个容忍度的节点集的并集。

要了解有关配置节点选择器和容差的更多信息，请参阅[分配 Pod 到节点](/docs/concepts/configuration/assign-pod-node/)。

[准入控制器]: /docs/reference/access-authn-authz/admission-controllers/

<!--
### Pod Overhead
-->

### Pod 开销

{{< feature-state for_k8s_version="v1.16" state="alpha" >}}

<!--
As of Kubernetes v1.16, RuntimeClass includes support for specifying overhead associated with
running a pod, as part of the [`PodOverhead`](/docs/concepts/configuration/pod-overhead.md) feature.
To use `PodOverhead`, you must have the PodOverhead [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
enabled (it is off by default).


Pod overhead is defined in RuntimeClass through the `Overhead` fields. Through the use of these fields,
you can specify the overhead of running pods utilizing this RuntimeClass and ensure these overheads
are accounted for in Kubernetes.
-->

从 Kubernetes v1.16 开始，RuntimeClass 包含了对指定与运行 Pod 相关的开销的支持，
这是[`Pod 开销`](/docs/concepts/configuration/pod-overhead.md)功能的一部分。
要使用 `PodOverhead` ，您必须确保 PodOverhead [功能](/docs/reference/command-line-tools-reference/feature-gates/) 已启用（默认情况下处于关闭状态）。

Pod 的开销是在 RuntimeClass 中通过 `Overhead` 字段定义的。 通过使用这些字段，
您可以使用此 RuntimeClass 指定运行 Pod 的开销，并确保在Kubernetes中考虑了这些开销。

<!--
### Upgrading RuntimeClass from Alpha to Beta

The RuntimeClass Beta feature includes the following changes:

- The `node.k8s.io` API group and `runtimeclasses.node.k8s.io` resource have been migrated to a
  built-in API from a CustomResourceDefinition.
- The `spec` has been inlined in the RuntimeClass definition (i.e. there is no more
  RuntimeClassSpec).
- The `runtimeHandler` field has been renamed `handler`.
- The `handler` field is now required in all API versions. This means the `runtimeHandler` field in
  the Alpha API is also required.
- The `handler` field must be a valid DNS label ([RFC 1123](https://tools.ietf.org/html/rfc1123)),
  meaning it can no longer contain `.` characters (in all versions). Valid handlers match the
  following regular expression: `^[a-z0-9]([-a-z0-9]*[a-z0-9])?$`.
-->

### 将 RuntimeClass 从 Alpha 升级到 Beta

RuntimeClass Beta 功能包括以下更改：

- `node.k8s.io` API 组和 `runtimeclasses.node.k8s.io` 资源已从 `CustomResourceDefinition` 迁移到内置API。
- 已在 RuntimeClass 定义中内联了 `spec`（即不再有RuntimeClassSpec）。
- `runtimeHandler` 字段已重命名为 `handler`。
- 所有 API 版本中现在都需要 `handler` 字段。 这意味着 Alpha API 中的 `runtimeHandler` 字段也是必须设定项。
- `handler`字段必须是有效的DNS标签（[RFC 1123](https://tools.ietf.org/html/rfc1123))，这意味着它不再包含 `.` 字符（在所有版本中）。 
   有效的处理程序匹配以下正则表达式：`^ [a-z0-9]（[-a-z0-9] * [a-z0-9]）？$`。

<!--
**Action Required:** The following actions are required to upgrade from the alpha version of the
RuntimeClass feature to the beta version:

- RuntimeClass resources must be recreated *after* upgrading to v1.14, and the
  `runtimeclasses.node.k8s.io` CRD should be manually deleted:
  ```
  kubectl delete customresourcedefinitions.apiextensions.k8s.io runtimeclasses.node.k8s.io
  ```
- Alpha RuntimeClasses with an unspecified or empty `runtimeHandler` or those using a `.` character
  in the handler are no longer valid, and must be migrated to a valid handler configuration (see
  above).
-->

**需要采取的措施:** 要从 RuntimeClass 功能的 Alpha 版本升级到 Beta 版本，需要执行以下操作：

- 在升级到v1.14之后，必须重新创建 RuntimeClass 资源，并且应该手动删除 runtimeclasses.node.k8s.io 的 CRD：
  ```
  kubectl delete customresourcedefinitions.apiextensions.k8s.io runtimeclasses.node.k8s.io
  ```
- 在处理程序中具有未指定或为空的 `runtimeHandler` 字段或使用 `.` 字符的 Alpha RuntimeClass 不再有效，
  必须将其迁移到有效的处理程序配置中（请参见上文）。

<!--
### Further Reading

- [RuntimeClass Design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/runtime-class.md)
- [RuntimeClass Scheduling Design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/runtime-class-scheduling.md)
- Read about the [Pod Overhead](/docs/concepts/configuration/pod-overhead/) concept
- [PodOverhead Feature Design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/20190226-pod-overhead.md)
-->

### 进一步阅读

- [运行时类设计](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/runtime-class.md)
- [RuntimeClass 计划设计](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/runtime-class-scheduling.md)
- 了解有关 [Pod 开销](/docs/concepts/configuration/pod-overhead/) 概念
- [Pod 开销功能设计](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/20190226-pod-overhead.md)

{{% /capture %}}
