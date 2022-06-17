---
title: 容器執行時類（Runtime Class）
content_type: concept
weight: 20
---
<!--
reviewers:
- tallclair
- dchen1107
title: Runtime Class
content_type: concept
weight: 20
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.20" state="stable" >}}

<!-- 
This page describes the RuntimeClass resource and runtime selection mechanism.

RuntimeClass is a feature for selecting the container runtime configuration. The container runtime
configuration is used to run a Pod's containers.
-->
本頁面描述了 RuntimeClass 資源和執行時的選擇機制。

RuntimeClass 是一個用於選擇容器執行時配置的特性，容器執行時配置用於執行 Pod 中的容器。

<!-- body -->

<!-- 
## Motivation

You can set a different RuntimeClass between different Pods to provide a balance of
performance versus security. For example, if part of your workload deserves a high
level of information security assurance, you might choose to schedule those Pods so
that they run in a container runtime that uses hardware virtualization. You'd then
benefit from the extra isolation of the alternative runtime, at the expense of some
additional overhead.
-->
## 動機   {#motivation}

你可以在不同的 Pod 設定不同的 RuntimeClass，以提供效能與安全性之間的平衡。
例如，如果你的部分工作負載需要高級別的資訊保安保證，你可以決定在排程這些 Pod
時儘量使它們在使用硬體虛擬化的容器執行時中執行。
這樣，你將從這些不同執行時所提供的額外隔離中獲益，代價是一些額外的開銷。

<!--
You can also use RuntimeClass to run different Pods with the same container runtime
but with different settings.
-->
你還可以使用 RuntimeClass 執行具有相同容器執行時但具有不同設定的 Pod。

<!-- 
## Setup
-->

## 設定  {#setup}

<!--
1. Configure the CRI implementation on nodes (runtime dependent)
2. Create the corresponding RuntimeClass resources
-->
1. 在節點上配置 CRI 的實現（取決於所選用的執行時）
2. 建立相應的 RuntimeClass 資源

<!--
### 1. Configure the CRI implementation on nodes
-->
### 1. 在節點上配置 CRI 實現

<!--
The configurations available through RuntimeClass are Container Runtime Interface (CRI)
implementation dependent. See the corresponding documentation ([below](#cri-configuration)) for your
CRI implementation for how to configure.
-->
RuntimeClass 的配置依賴於 執行時介面（CRI）的實現。
根據你使用的 CRI 實現，查閱相關的文件（[下方](#cri-configuration)）來了解如何配置。

<!--
RuntimeClass assumes a homogeneous node configuration across the cluster by default (which means
that all nodes are configured the same way with respect to container runtimes). To support
heterogenous node configurations, see [Scheduling](#scheduling) below.
-->
{{< note >}}
RuntimeClass 假設叢集中的節點配置是同構的（換言之，所有的節點在容器執行時方面的配置是相同的）。
如果需要支援異構節點，配置方法請參閱下面的 [排程](#scheduling)。
{{< /note >}}

<!--
The configurations have a corresponding `handler` name, referenced by the RuntimeClass. The
handler must be a valid [DNS label name](/docs/concepts/overview/working-with-objects/names/#dns-label-names).
-->
所有這些配置都具有相應的 `handler` 名，並被 RuntimeClass 引用。
handler 必須是有效的 [DNS 標籤名](/zh-cn/docs/concepts/overview/working-with-objects/names/#dns-label-names)。

<!--
### 2. Create the corresponding RuntimeClass resources

The configurations setup in step 1 should each have an associated `handler` name, which identifies
the configuration. For each handler, create a corresponding RuntimeClass object.
-->
### 2. 建立相應的 RuntimeClass 資源

在上面步驟 1 中，每個配置都需要有一個用於標識配置的 `handler`。 
針對每個 handler 需要建立一個 RuntimeClass 物件。

<!--
The RuntimeClass resource currently only has 2 significant fields: the RuntimeClass name
(`metadata.name`) and the handler (`handler`). The object definition looks like this:
-->
RuntimeClass 資源當前只有兩個重要的欄位：RuntimeClass 名 (`metadata.name`) 和 handler (`handler`)。
物件定義如下所示：

```yaml
# RuntimeClass 定義於 node.k8s.io API 組
apiVersion: node.k8s.io/v1
kind: RuntimeClass
metadata:
  # 用來引用 RuntimeClass 的名字
  # RuntimeClass 是一個叢集層面的資源
  name: myclass  
# 對應的 CRI 配置的名稱
handler: myconfiguration
```

<!--
It is recommended that RuntimeClass write operations (create/update/patch/delete) be
restricted to the cluster administrator. This is typically the default. See 
[Authorization Overview](/docs/reference/access-authn-authz/authorization/) for more details.
-->
{{< note >}}
建議將 RuntimeClass 寫操作（create、update、patch 和 delete）限定於叢集管理員使用。
通常這是預設配置。參閱[授權概述](/zh-cn/docs/reference/access-authn-authz/authorization/)瞭解更多資訊。
{{< /note >}}

<!--
## Usage

Once RuntimeClasses are configured for the cluster, you can specify a
`runtimeClassName` in the Pod spec to use it. For example:
-->
## 使用說明  {#usage}

一旦完成叢集中 RuntimeClasses 的配置，
你可以在 Pod spec 中指定 `runtimeClassName` 來使用它。例如:

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
This will instruct the kubelet to use the named RuntimeClass to run this pod. If the named
RuntimeClass does not exist, or the CRI cannot run the corresponding handler, the pod will enter the
`Failed` terminal [phase](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase). Look for a
corresponding [event](/docs/tasks/debug/debug-application/debug-running-pod/) for an
error message.
-->
這一設定會告訴 kubelet 使用所指的 RuntimeClass 來執行該 pod。
如果所指的 RuntimeClass 不存在或者 CRI 無法執行相應的 handler，
那麼 pod 將會進入 `Failed` 終止[階段](/zh-cn/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)。
你可以檢視相應的[事件](/zh-cn/docs/tasks/debug/debug-application/debug-running-pod/)，
獲取執行過程中的錯誤資訊。

<!--
If no `runtimeClassName` is specified, the default RuntimeHandler will be used, which is equivalent
to the behavior when the RuntimeClass feature is disabled.
-->
如果未指定 `runtimeClassName` ，則將使用預設的 RuntimeHandler，相當於禁用 RuntimeClass 功能特性。

<!-- 
### CRI Configuration

For more details on setting up CRI runtimes, see [CRI installation](/docs/setup/production-environment/container-runtimes/).
-->
### CRI 配置   {#cri-configuration}

關於如何安裝 CRI 執行時，請查閱
[CRI 安裝](/zh-cn/docs/setup/production-environment/container-runtimes/)。

#### {{< glossary_tooltip term_id="containerd" >}}

<!--
Runtime handlers are configured through containerd's configuration at
`/etc/containerd/config.toml`. Valid handlers are configured under the runtimes section:
-->
透過 containerd 的 `/etc/containerd/config.toml` 配置檔案來配置執行時 handler。
handler 需要配置在 runtimes 塊中： 

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.${HANDLER_NAME}]
```

<!--
See containerd's [config documentation](https://github.com/containerd/cri/blob/master/docs/config.md)
for more details:
-->
更詳細資訊，請查閱 containerd 的[配置指南](https://github.com/containerd/cri/blob/master/docs/config.md)

#### [cri-o](https://cri-o.io/)

<!--
Runtime handlers are configured through cri-o's configuration at `/etc/crio/crio.conf`. Valid
handlers are configured under the [crio.runtime
table](https://github.com/kubernetes-sigs/cri-o/blob/master/docs/crio.conf.5.md#crioruntime-table):
-->
透過 cri-o 的 `/etc/crio/crio.conf` 配置檔案來配置執行時 handler。
handler 需要配置在
[crio.runtime 表](https://github.com/kubernetes-sigs/cri-o/blob/master/docs/crio.conf.5.md#crioruntime-table)
下面：

```
[crio.runtime.runtimes.${HANDLER_NAME}]
  runtime_path = "${PATH_TO_BINARY}"
```

<!--
See CRI-O's [config documentation](https://github.com/cri-o/cri-o/blob/master/docs/crio.conf.5.md) for more details.
-->
更詳細資訊，請查閱 CRI-O [配置文件](https://github.com/cri-o/cri-o/blob/master/docs/crio.conf.5.md)。

<!-- 
## Scheduling
 -->
## 排程  {#scheduling}

{{< feature-state for_k8s_version="v1.16" state="beta" >}}

<!--
By specifying the `scheduling` field for a RuntimeClass, you can set constraints to
ensure that Pods running with this RuntimeClass are scheduled to nodes that support it.
If `scheduling` is not set, this RuntimeClass is assumed to be supported by all nodes.
-->

透過為 RuntimeClass 指定 `scheduling` 欄位，
你可以透過設定約束，確保執行該 RuntimeClass 的 Pod 被排程到支援該 RuntimeClass 的節點上。
如果未設定 `scheduling`，則假定所有節點均支援此 RuntimeClass 。

<!--
To ensure pods land on nodes supporting a specific RuntimeClass, that set of nodes should have a
common label which is then selected by the `runtimeclass.scheduling.nodeSelector` field. The
RuntimeClass's nodeSelector is merged with the pod's nodeSelector in admission, effectively taking
the intersection of the set of nodes selected by each. If there is a conflict, the pod will be
rejected.
-->
為了確保 pod 會被排程到支援指定執行時的 node 上，每個 node 需要設定一個通用的 label 用於被 
`runtimeclass.scheduling.nodeSelector` 挑選。在 admission 階段，RuntimeClass 的 nodeSelector 將會與
pod 的 nodeSelector 合併，取二者的交集。如果有衝突，pod 將會被拒絕。

<!--
If the supported nodes are tainted to prevent other RuntimeClass pods from running on the node, you
can add `tolerations` to the RuntimeClass. As with the `nodeSelector`, the tolerations are merged
with the pod's tolerations in admission, effectively taking the union of the set of nodes tolerated
by each.
-->
如果 node 需要阻止某些需要特定 RuntimeClass 的 pod，可以在 `tolerations` 中指定。
與 `nodeSelector` 一樣，tolerations 也在 admission 階段與 pod 的 tolerations 合併，取二者的並集。

<!--
To learn more about configuring the node selector and tolerations, see 
[Assigning Pods to Nodes](/docs/concepts/configuration/assign-pod-node/).
-->
更多有關 node selector 和 tolerations 的配置資訊，請查閱 
[將 Pod 分派到節點](/zh-cn/docs/concepts/scheduling-eviction/assign-pod-node/)。

<!-- 
### Pod Overhead
 -->
### Pod 開銷   {#pod-overhead}

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!--
You can specify _overhead_ resources that are associated with running a Pod. Declaring overhead allows
the cluster (including the scheduler) to account for it when making decisions about Pods and resources.  
-->
你可以指定與執行 Pod 相關的 _開銷_ 資源。宣告開銷即允許叢集（包括排程器）在決策 Pod 和資源時將其考慮在內。

<!--
Pod overhead is defined in RuntimeClass through the `overhead` field. Through the use of this field,
you can specify the overhead of running pods utilizing this RuntimeClass and ensure these overheads
are accounted for in Kubernetes.
-->
Pod 開銷透過 RuntimeClass 的 `overhead` 欄位定義。
透過使用這個欄位，你可以指定使用該 RuntimeClass 執行 Pod 時的開銷並確保 Kubernetes 將這些開銷計算在內。

## {{% heading "whatsnext" %}}

<!--
- [RuntimeClass Design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/585-runtime-class/README.md)
- [RuntimeClass Scheduling Design](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/585-runtime-class/README.md#runtimeclass-scheduling)
- Read about the [Pod Overhead](/docs/concepts/scheduling-eviction/pod-overhead/) concept
- [PodOverhead Feature Design](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/688-pod-overhead)
-->
- [RuntimeClass 設計](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/585-runtime-class/README.md)
- [RuntimeClass 排程設計](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/585-runtime-class/README.md#runtimeclass-scheduling)
- 閱讀關於 [Pod 開銷](/zh-cn/docs/concepts/scheduling-eviction/pod-overhead/) 的概念
- [PodOverhead 特性設計](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/688-pod-overhead)
