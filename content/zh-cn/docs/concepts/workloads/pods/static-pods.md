---
title: "静态 Pod"
content_type: concept
weight: 150
---
<!--
title: "Static Pods"
content_type: concept
weight: 150
-->

<!-- overview -->

<!--
_Static Pods_ are managed directly by the kubelet daemon on a specific node,
without the {{< glossary_tooltip text="API server" term_id="kube-apiserver" >}}
observing them.
Unlike Pods that are managed by the control plane (for example, a
{{< glossary_tooltip text="Deployment" term_id="deployment" >}}),
the kubelet watches each static Pod and restarts it if it fails.
-->
**静态 Pod（Static Pod）** 由特定节点上的 kubelet 守护进程直接管理，
而不是由 {{< glossary_tooltip text="API 服务器" term_id="kube-apiserver" >}}观察和管理。
与由控制平面管理的 Pod（例如由
{{< glossary_tooltip text="Deployment" term_id="deployment" >}} 管理的 Pod）不同，
kubelet 会监视每个静态 Pod，并在其失败时自动重启。

<!--
Static Pods are always bound to one {{< glossary_tooltip text="kubelet" term_id="kubelet" >}} on a specific node.
-->
静态 Pod 总是绑定到特定节点上的某个 {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}。

<!--
The main use for static Pods is to run a self-hosted control plane: in other words,
using the kubelet to supervise the individual
[control plane components](/docs/concepts/overview/components/#control-plane-components).
For example, [kubeadm](/docs/reference/setup-tools/kubeadm/) uses static Pods to run
`kube-apiserver`, `kube-controller-manager`, `kube-scheduler`, and `etcd` on control plane nodes.
-->
静态 Pod 的主要用途是运行自托管控制平面：
换言之，使用 kubelet 来监管各个
[控制平面组件](/zh-cn/docs/concepts/overview/components/#control-plane-components)。
例如，[kubeadm](/zh-cn/docs/reference/setup-tools/kubeadm/)
就使用静态 Pod 在控制平面节点上运行
`kube-apiserver`、`kube-controller-manager`、`kube-scheduler` 和 `etcd`。

{{< note >}}
<!--
If your cluster runs control plane components as Pods, they are likely
static Pods. You can recognize their mirror Pods in the `kube-system` namespace
by the `kubernetes.io/config.mirror` annotation.
-->
如果你的集群将控制平面组件作为 Pod 运行，那么它们很可能就是静态 Pod。
你可以通过查看 `kube-system` 名字空间中的镜像 Pod（mirror Pod）来识别它们；
这些 Pod 带有 `kubernetes.io/config.mirror` 注解。
{{< /note >}}

<!-- body -->

<!--
## Mirror Pods {#mirror-pods}
-->
## 镜像 Pod   {#mirror-pods}

<!--
The kubelet automatically tries to create a
{{< glossary_tooltip text="mirror Pod" term_id="mirror-pod" >}}
on the Kubernetes API server for each static Pod.
This means that the Pods running on a node are visible on the API server,
but cannot be controlled from there.
The Pod names will be suffixed with the node hostname with a leading hyphen.
-->
kubelet 会自动尝试为每个静态 Pod 在 Kubernetes API 服务器上创建一个
{{< glossary_tooltip text="镜像 Pod" term_id="mirror-pod" >}}。
这意味着运行在某个节点上的这些 Pod 在 API 服务器中是可见的，
但你不能通过 API 服务器直接控制它们。
这些 Pod 的名称会在静态 Pod 原始名称后附加节点主机名，并以连字符作为前缀。

<!--
The kubelet propagates {{< glossary_tooltip text="labels" term_id="label" >}}
from the static Pod to the mirror Pod. You can use those labels as normal via
{{< glossary_tooltip text="selectors" term_id="selector" >}}.
-->
kubelet 会把静态 Pod 上的 {{< glossary_tooltip text="标签" term_id="label" >}}
传播到镜像 Pod。你可以像平常一样通过
{{< glossary_tooltip text="选择算符" term_id="selector" >}}来使用这些标签。

<!--
If you try to use `kubectl` to delete the mirror Pod from the API server,
the kubelet _does not_ remove the static Pod. The kubelet will recreate
the mirror Pod.
-->
如果你尝试使用 `kubectl` 从 API 服务器中删除镜像 Pod，
kubelet **不会**删除对应的静态 Pod。
kubelet 只会重新创建这个镜像 Pod。

<!--
## Limitations {#limitations}
-->
## 限制   {#limitations}

<!--
The spec of a static Pod cannot refer to other API objects,
such as {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}},
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}, or
{{< glossary_tooltip text="Secret" term_id="secret" >}}.
-->
静态 Pod 的规约不能引用其他 API 对象，
例如 {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}}、
{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} 或
{{< glossary_tooltip text="Secret" term_id="secret" >}}。

<!--
Static Pods do not support [ephemeral containers](/docs/concepts/workloads/pods/ephemeral-containers/).
-->
静态 Pod 不支持[临时容器](/zh-cn/docs/concepts/workloads/pods/ephemeral-containers/)。

<!--
## Static Pods vs DaemonSets {#static-pods-vs-daemonsets}
-->
## 静态 Pod 与 DaemonSet   {#static-pods-vs-daemonsets}

<!-- Source: tasks/configure-pod-container/static-pod/ -->
<!--
If you are running clustered Kubernetes and are using static Pods to run a Pod
on every node, you should probably be using a
{{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}} instead.
-->
如果你运行的是一个集群化 Kubernetes，并且使用静态 Pod 在每个节点上运行某个 Pod，
那么你很可能应该改用
{{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}。

<!--
Static Pods are not managed by the control plane, so they cannot be rolled out,
rolled back, or scaled using standard Kubernetes mechanisms. DaemonSets provide
these capabilities and are the recommended approach for running node-level workloads.
-->
静态 Pod 不受控制平面管理，因此不能使用 Kubernetes 的标准机制来进行发布、回滚或扩缩容。
DaemonSet 提供了这些能力，也是运行节点级工作负载的推荐方式。

<!--
Static Pods are started by the kubelet before the API server is available, which
makes them suitable for bootstrapping control plane components. DaemonSets require
a running control plane.
-->
静态 Pod 会在 API 服务器可用之前由 kubelet 启动，
因此它们适合用于引导控制平面组件。DaemonSet 则依赖于一个已经运行中的控制平面。

## {{% heading "whatsnext" %}}

<!--
- Learn how to [create static Pods](/docs/tasks/configure-pod-container/static-pod/).
- Learn about [Kubernetes components](/docs/concepts/overview/components/) and how the control plane uses static Pods.
- Learn about [DaemonSets](/docs/concepts/workloads/controllers/daemonset/) as an alternative to static Pods.
-->
- 了解如何[创建静态 Pod](/zh-cn/docs/tasks/configure-pod-container/static-pod/)。
- 了解 [Kubernetes 组件](/zh-cn/docs/concepts/overview/components/)，以及控制平面如何使用静态 Pod。
- 了解可作为静态 Pod 替代方案的 [DaemonSet](/zh-cn/docs/concepts/workloads/controllers/daemonset/)。
