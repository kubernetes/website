---
reviewers:
- tallclair
- dchen1107
title: 容器运行时类(Runtime Class)
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.14" state="beta" >}}

<!-- 
This page describes the RuntimeClass resource and runtime selection mechanism.
-->
本页面描述了 RuntimeClass 资源和运行时的选择机制。

<!--
RuntimeClass is a feature for selecting the container runtime configuration. The container runtime
configuration is used to run a Pod's containers.
-->
RuntimeClass 是一个用于选择容器运行时配置的特性，容器运行时配置用于运行 Pod 中的容器。

{{% /capture %}}


{{% capture body %}}

<!-- 
## Motivation
 -->
## 动机

<!--
You can set a different RuntimeClass between different Pods to provide a balance of
performance versus security. For example, if part of your workload deserves a high
level of information security assurance, you might choose to schedule those Pods so
that they run in a container runtime that uses hardware virtualization. You'd then
benefit from the extra isolation of the alternative runtime, at the expense of some
additional overhead.
-->
您可以在不同的 pod 之间设置不同的 RuntimeClass，以提供性能与安全性之间的平衡。
例如，如果您的部分工作负载需要高级别的信息安全保证，那么您可以选择性地调度这些 pod，
使它们在使用硬件虚拟化的容器运行时中运行。
然后，您将从可选运行时的额外隔离中获益，代价是一些额外的开销。

<!--
You can also use RuntimeClass to run different Pods with the same container runtime
but with different settings.
-->
您还可以使用 RuntimeClass 运行具有相同容器运行时但具有不同设置的pod。

<!-- 
## Setup
-->
## 设置

<!--
Ensure the RuntimeClass feature gate is enabled (it is by default). See [Feature
Gates](/docs/reference/command-line-tools-reference/feature-gates/) for an explanation of enabling
feature gates. The `RuntimeClass` feature gate must be enabled on apiservers _and_ kubelets.
-->
确保 RuntimeClass 特性开关处于开启状态（默认为开启状态）。
关于特性开关的详细介绍，请查阅
[Feature Gates](/docs/reference/command-line-tools-reference/feature-gates/)。
`RuntimeClass` 特性开关必须在 apiserver 和 kubelet 同时开启。

<!--
1. Configure the CRI implementation on nodes (runtime dependent)
2. Create the corresponding RuntimeClass resources
-->

1. 在节点上配置 CRI 的实现（取决于所选用的运行时）
2. 创建相应的 RuntimeClass 资源

<!--
### 1. Configure the CRI implementation on nodes
-->
### 1. 在节点上配置 CRI 实现

<!--
The configurations available through RuntimeClass are Container Runtime Interface (CRI)
implementation dependent. See the corresponding documentation ([below](#cri-configuration)) for your
CRI implementation for how to configure.
-->
RuntimeClass 的配置依赖于 运行时接口（CRI）的实现。
根据你使用的 CRI 实现，查阅相关的文档（[下方](#cri-configuration)）来了解如何配置。

{{< note >}}
<!--
RuntimeClass assumes a homogeneous node configuration across the cluster by default (which means
that all nodes are configured the same way with respect to container runtimes). To support
heterogenous node configurations, see [Scheduling](#scheduling) below.-->
RuntimeClass 假设集群中的节点配置是同构的（换言之，所有的节点在容器运行时方面的配置是相同的）。
如果需要支持异构节点，配置方法请参阅下面的 [调度](#scheduling)。
{{< /note >}}

<!--
The configurations have a corresponding `handler` name, referenced by the RuntimeClass. The
handler must be a valid DNS 1123 label (alpha-numeric + `-` characters).
-->
所有这些配置都具有相应的 `handler` 名，并被 RuntimeClass 引用。
handler 必须符合 DNS-1123 命名规范（字母、数字、或 `-`）。

<!--
### 2. Create the corresponding RuntimeClass resources
-->
### 2. 创建相应的 RuntimeClass 资源

<!--
The configurations setup in step 1 should each have an associated `handler` name, which identifies
the configuration. For each handler, create a corresponding RuntimeClass object.
-->
在上面步骤 1 中，每个配置都需要有一个用于标识配置的 `handler`。 
针对每个 handler 需要创建一个 RuntimeClass 对象。

<!--
The RuntimeClass resource currently only has 2 significant fields: the RuntimeClass name
(`metadata.name`) and the handler (`handler`). The object definition looks like this:
-->
RuntimeClass 资源当前只有两个重要的字段：RuntimeClass 名 (`metadata.name`) 和 handler (`handler`)。
对象定义如下所示：

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
Overview](/docs/reference/access-authn-authz/authorization/) for more details.-->建议将 RuntimeClass 写操作（create、update、patch 和 delete）限定于集群管理员使用。
通常这是默认配置。参阅[授权概述](/docs/reference/access-authn-authz/authorization/)了解更多信息。
{{< /note >}}

<!--
## Usage
-->
## 使用说明

<!--
Once RuntimeClasses are configured for the cluster, using them is very simple. Specify a
`runtimeClassName` in the Pod spec. For example:
-->
一旦完成集群中 RuntimeClasses 的配置，使用起来非常方便。
在 Pod spec 中指定 `runtimeClassName` 即可。例如:

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
-->
这一设置会告诉 Kubelet 使用所指的 RuntimeClass 来运行该 pod。
如果所指的 RuntimeClass 不存在或者 CRI 无法运行相应的 handler，那么 pod 将会进入 `Failed` 终止[阶段](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)。
你可以查看相应的[事件](/docs/tasks/debug-application-cluster/debug-application-introspection/)，获取出错信息。

<!--
If no `runtimeClassName` is specified, the default RuntimeHandler will be used, which is equivalent
to the behavior when the RuntimeClass feature is disabled.
-->
如果未指定 `runtimeClassName` ，则将使用默认的 RuntimeHandler，相当于禁用 RuntimeClass 功能特性。

<!-- 
### CRI Configuration
 -->
### CRI 配置

<!--
For more details on setting up CRI runtimes, see [CRI installation](/docs/setup/production-environment/container-runtimes/).
-->
关于如何安装 CRI 运行时，请查阅 [CRI 安装](/docs/setup/production-environment/container-runtimes/)。

#### dockershim

<!--
Kubernetes built-in dockershim CRI does not support runtime handlers.
-->
Kubernetes 内置 dockershim CRI 不支持配置运行时 handler。

#### [containerd](https://containerd.io/)

<!--
Runtime handlers are configured through containerd's configuration at
`/etc/containerd/config.toml`. Valid handlers are configured under the runtimes section:
-->
通过 containerd 的 `/etc/containerd/config.toml` 配置文件来配置运行时 handler。
handler 需要配置在 runtimes 块中： 

```
[plugins.cri.containerd.runtimes.${HANDLER_NAME}]
```

<!--
See containerd's config documentation for more details:
https://github.com/containerd/cri/blob/master/docs/config.md
-->
更详细信息，请查阅 containerd 配置文档：
https://github.com/containerd/cri/blob/master/docs/config.md

#### [cri-o](https://cri-o.io/)

<!--
Runtime handlers are configured through cri-o's configuration at `/etc/crio/crio.conf`. Valid
handlers are configured under the [crio.runtime
table](https://github.com/kubernetes-sigs/cri-o/blob/master/docs/crio.conf.5.md#crioruntime-table):
-->
通过 cri-o 的 `/etc/crio/crio.conf` 配置文件来配置运行时 handler。
handler 需要配置在 [crio.runtime 表](https://github.com/kubernetes-sigs/cri-o/blob/master/docs/crio.conf.5.md#crioruntime-table)
下方：

```
[crio.runtime.runtimes.${HANDLER_NAME}]
  runtime_path = "${PATH_TO_BINARY}"
```

<!--
See cri-o's config documentation for more details:
https://github.com/kubernetes-sigs/cri-o/blob/master/cmd/crio/config.go
-->
更详细信息，请查阅 containerd 配置文档：
https://github.com/kubernetes-sigs/cri-o/blob/master/cmd/crio/config.go

<!-- 
## Scheduling
 -->
## 调度

{{< feature-state for_k8s_version="v1.16" state="beta" >}}

<!--
As of Kubernetes v1.16, RuntimeClass includes support for heterogenous clusters through its
`scheduling` fields. Through the use of these fields, you can ensure that pods running with this
RuntimeClass are scheduled to nodes that support it. To use the scheduling support, you must have
the [RuntimeClass admission controller][] enabled (the default, as of 1.16).
-->
在 Kubernetes v1.16 版本里，RuntimeClass 特性引入了 `scheduling` 字段来支持异构集群。
通过该字段，可以确保 pod 被调度到支持指定运行时的节点上。
该调度支持，需要确保 [RuntimeClass admission controller][] 处于开启状态（1.16 版本默认开启）。

<!--
To ensure pods land on nodes supporting a specific RuntimeClass, that set of nodes should have a
common label which is then selected by the `runtimeclass.scheduling.nodeSelector` field. The
RuntimeClass's nodeSelector is merged with the pod's nodeSelector in admission, effectively taking
the intersection of the set of nodes selected by each. If there is a conflict, the pod will be
rejected.
-->
为了确保 pod 会被调度到支持指定运行时的 node 上，每个 node 需要设置一个通用的 label 用于被 
`runtimeclass.scheduling.nodeSelector` 挑选。在 admission 阶段，RuntimeClass 的 nodeSelector 将会于
pod 的 nodeSelector 合并，取二者的交集。如果有冲突，pod 将会被拒绝。

<!--
If the supported nodes are tainted to prevent other RuntimeClass pods from running on the node, you
can add `tolerations` to the RuntimeClass. As with the `nodeSelector`, the tolerations are merged
with the pod's tolerations in admission, effectively taking the union of the set of nodes tolerated
by each.
-->
如果 node 需要阻止某些需要特定 RuntimeClass 的 pod，可以在 `tolerations` 中指定。
与 `nodeSelector` 一样，tolerations 也在 admission 阶段与 pod 的 tolerations 合并，取二者的并集。

<!--
To learn more about configuring the node selector and tolerations, see [Assigning Pods to
Nodes](/docs/concepts/configuration/assign-pod-node/).
-->
更多有关 node selector 和 tolerations 的配置信息，请查阅 
[Assigning Pods to Nodes](/docs/concepts/configuration/assign-pod-node/)。

[RuntimeClass admission controller]: /docs/reference/access-authn-authz/admission-controllers/

<!-- 
### Pod Overhead
 -->
### Pod 开销

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

<!--
You can specify _overhead_ resources that are associated with running a Pod. Declaring overhead allows
the cluster (including the scheduler) to account for it when making decisions about Pods and resources.  
To use Pod overhead, you must have the PodOverhead [feature gate](/docs/reference/command-line-tools-reference/feature-gates/)
enabled (it is on by default).
-->
你可以指定与运行 Pod 相关的 _开销_ 资源。声明开销即允许集群（包括调度器）在决策 Pod 和资源时将其考虑在内。
若要使用 Pod 开销特性，你必须确保 PodOverhead [特性开关](/docs/reference/command-line-tools-reference/feature-gates/) 处于开启状态（默认为启用状态）。

<!--
Pod overhead is defined in RuntimeClass through the `Overhead` fields. Through the use of these fields,
you can specify the overhead of running pods utilizing this RuntimeClass and ensure these overheads
are accounted for in Kubernetes.
-->
Pod 开销通过 RuntimeClass 的 `overhead` 字段定义。通过使用这些字段，你可以指定使用该 RuntimeClass 运行 Pod 时的开销并确保 Kubernetes 将这些开销计算在内。

{{% /capture %}}
{{% capture whatsnext %}}

<!--
- [RuntimeClass Design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/runtime-class.md)
- [RuntimeClass Scheduling Design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/runtime-class-scheduling.md)
- Read about the [Pod Overhead](/docs/concepts/configuration/pod-overhead/) concept
- [PodOverhead Feature Design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/20190226-pod-overhead.md)
-->
- [RuntimeClass 设计](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/runtime-class.md)
- [RuntimeClass 调度设计](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/runtime-class-scheduling.md)
- 阅读关于 [Pod 开销](/docs/concepts/configuration/pod-overhead/) 的概念
- [PodOverhead 特性设计](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/20190226-pod-overhead.md)

{{% /capture %}}
