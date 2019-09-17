---
reviewers:
- tallclair
- dchen1107
title: RuntimeClass
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

<!-- 
This page describes the RuntimeClass resource and runtime selection mechanism.
-->
本页面讨论了 RuntimeClass 资源和运行时的选择机制。

{{% /capture %}}

{{< toc >}}

{{% capture body %}}

## RuntimeClass

<!-- 
RuntimeClass is an alpha feature for selecting the container runtime configuration to use to run a
pod's containers.
-->
RuntimeClass 是一个 alpha 功能，用来选择运行 pod 中容器的容器运行时配置。

<!-- 
### Set Up
-->
### 设置

<!-- 
As an early alpha feature, there are some additional setup steps that must be taken in order to use
the RuntimeClass feature:
-->
作为一个处于早期状态的 alpha 特性，必须要完成以下步骤才能使用 RuntimeClass 功能：

<!--
1. Enable the RuntimeClass feature gate (on apiservers & kubelets, requires version 1.12+)
2. Install the RuntimeClass CRD
3. Configure the CRI implementation on nodes (runtime dependent)
4. Create the corresponding RuntimeClass resources
-->
1. 开启 RuntimeClass 特性门控（在 apiservers ＆ kubelets 上，需要 1.12 及以上版本）
2. 安装 RuntimeClass CRD
3. 在节点上配置 CRI 的实现（取决于所选的运行时）
4. 创建相应的 RuntimeClass 资源

<!--
#### 1. Enable the RuntimeClass feature gate
-->
#### 1. 开启 RuntimeClass 特性门控

<!--
See [Feature Gates](/docs/reference/command-line-tools-reference/feature-gates/) for an explanation
of enabling feature gates. The RuntimeClass feature gate must be enabled on apiservers _and_ kubelets.
-->
参见[特性门控](/docs/reference/command-line-tools-reference/feature-gates/)文档了解如何开启特定的特性门控。
`RuntimeClass` 特性门控必须在 apiservers _和_ kubelets 上同时开启，才能使用。

<!--
#### 2. Install the RuntimeClass CRD
-->
#### 2. 安装 RuntimeClass CRD

<!--
The RuntimeClass [CustomResourceDefinition][/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/] (CRD) can be found in the addons directory of the
Kubernetes git repo:
-->
可以在 Kubernetes git 仓库的 addons 目录中找到
RuntimeClass [CustomResourceDefinition (CRD)](/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/) 的定义：

https://github.com/kubernetes/kubernetes/tree/release-1.12/cluster/addons/runtimeclass/runtimeclass_crd.yaml

<!--
Install the CRD with `kubectl apply -f runtimeclass_crd.yaml`.
-->

使用 `kubectl apply -f runtimeclass_crd.yaml` 命令安装 CRD。

<!--
#### 3. Configure the CRI implementation on nodes
-->
#### 3. 在节点上配置 CRI 实现

<!--
The configurations to select between with RuntimeClass are CRI implementation dependent. See the
corresponding documentation for your CRI implementation for how to configure. As this is an alpha
feature, not all CRIs support multiple RuntimeClasses yet.
-->
各 RuntimeClass 所支持的配置选项取决于 CRI 的实现本身。
请参阅 CRI 实现的相应文档了解具体如何配置。
由于这是一个 alpha 特性功能，并非所有 CRI 都支持多个 RuntimeClass。

<!--
RuntimeClass currently assumes a homogeneous node configuration across the cluster
(which means that all nodes are configured the same way with respect to container runtimes). Any heterogeneity (varying configurations) must be
managed independently of RuntimeClass through scheduling features
(see [Assigning Pods to Nodes](/docs/concepts/configuration/assign-pod-node/)).
-->
{{< note >}}
RuntimeClass 当前假设的是集群中的节点配置是同构的（换言之，所有的节点在容器运行时方面的配置是相同的）。
任何异构性（不同的配置）必须通过调度功能在 RuntimeClass 之外单独管理（请参阅[在节点上分配 Pods](/docs/concepts/configuration/assign-pod-node/)）。
{{< /note >}}

<!--
The configurations have a corresponding `RuntimeHandler` name, referenced by the RuntimeClass. The
RuntimeHandler must be a valid DNS-1123 subdomain (alpha-numeric characters, `-`, or `.`).
-->
所有这些配置都具有相应的 `RuntimeHandler` 名，并被 RuntimeClass 引用。
RuntimeHandler 必须是有效的 DNS-1123 子域（字母数字字符、`-` 或 `.`）。

<!--
#### 4. Create the corresponding RuntimeClass resources
-->

#### 4. 创建相应的 RuntimeClass 资源

<!--
The configurations setup in step 3 should each have an associated `RuntimeHandler` name, which
identifies the configuration. For each RuntimeHandler (and optionally the empty `""` handler),
create a corresponding RuntimeClass object
.-->
步骤 3 中的配置设置应该有相应的 `RuntimeHandler` 名，用于标识配置。
对应每个 RuntimeHandler（以及 `""` 所代表的空处理程序），都创建相应的 RuntimeClass 对象。

<!--The RuntimeClass resource currently only has 2 significant fields: the RuntimeClass name
(`metadata.name`) and the RuntimeHandler (`spec.runtimeHandler`). The object definition looks like this:
-->
RuntimeClass 资源当前只有两个重要的字段：RuntimeClass 名 (`metadata.name`) 和 RuntimeHandler (`spec.runtimeHandler`)。
对象定义如下所示：

```yaml
apiVersion: node.k8s.io/v1alpha1  # 在 node.k8s.io API 中对 RuntimeClass 进行定义
kind: RuntimeClass
metadata:
  name: myclass  # 引用 RuntimeClass
  # RuntimeClass 是不属于任何名字空间的资源
spec:
  runtimeHandler: myconfiguration  # 给出 CRI 配置的名称
```

<!--
It is recommended that RuntimeClass write operations (create/update/patch/delete) be
restricted to the cluster administrator. This is typically the default. See [Authorization
Overview](/docs/reference/access-authn-authz/authorization/) for more details.
-->

{{< note >}}
建议将 RuntimeClass 写操作（create、update、patch 和 delete）限定于集群管理员使用。
通常这是默认配置。参阅[授权概述](/docs/reference/access-authn-authz/authorization/)了解更多信息。
{{< /note >}}

<!--
### Usage
Once RuntimeClasses are configured for the cluster, using them is very simple. Specify a
`runtimeClassName` in the Pod spec. For example:
-->

### 使用说明

一旦完成集群中 RuntimeClasses 的配置，使用起来非常简便。
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

<!--This will instruct the Kubelet to use the named RuntimeClass to run this pod. If the named
RuntimeClass does not exist, or the CRI cannot run the corresponding handler, the pod will enter the
`Failed` terminal [phase](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase). Look for a
corresponding [event](/docs/tasks/debug-application-cluster/debug-application-introspection/) for an
error message.-->

这一设置会告诉 Kubelet 使用所指的 RuntimeClass 来运行该 pod。
如果所指的 RuntimeClass 不存在或者 CRI 无法运行相应的 handler，那么 pod 将会进入 `Failed` 终止[阶段](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)。
你可以查看相应的[事件](/docs/tasks/debug-application-cluster/debug-application-introspection/)，获取出错信息。

<!--
If no `runtimeClassName` is specified, the default RuntimeHandler will be used, which is equivalent
to the behavior when the RuntimeClass feature is disabled.
-->
如果未指定 `runtimeClassName` ，则将使用默认的 RuntimeHandler，相当于禁用 RuntimeClass 功能特性。

{{% /capture %}}
