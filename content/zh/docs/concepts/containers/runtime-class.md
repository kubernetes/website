---
reviewers:
- tallclair
- dchen1107
title: Runtime Class
content_template: templates/concept
weight: 20
---

<!-- ---
reviewers:
- tallclair
- dchen1107
title: Runtime Class
content_template: templates/concept
weight: 20
--- -->

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

<!-- This page describes the RuntimeClass resource and runtime selection mechanism. -->
本页面讨论的是 RuntimeClass 资源和运行时选择的机制问题。

{{% /capture %}}

{{< toc >}}

{{% capture body %}}

<!-- ## Runtime Class -->
## RuntimeClass

<!-- RuntimeClass is an alpha feature for selecting the container runtime configuration to use to run a
pod's containers. -->
RuntimeClass 是一个 alpha 功能，用来选择容器运行时，运行 pod 的容器。

<!-- ### Set Up -->
### 设置

<!-- As an early alpha feature, there are some additional setup steps that must be taken in order to use
the RuntimeClass feature: -->
作为一个 alpha 功能，必须要完成以下设置步骤才能使用 RuntimeClass 功能：

<!-- 1. Enable the RuntimeClass feature gate (on apiservers & kubelets, requires version 1.12+)
2. Install the RuntimeClass CRD
3. Configure the CRI implementation on nodes (runtime dependent)
4. Create the corresponding RuntimeClass resources -->

1. 开启 RuntimeClass 功能门（feature gate） (在 apiservers 和 kubelets 上，需要版本号 1.12 以上)
2. 安装 RuntimeClass CRD
3. 在节点上配置 CRI 实现（运行时依赖）
4. 创建相应的 RuntimeClass 资源


<!-- #### 1. Enable the RuntimeClass feature gate -->
#### 1. 开启 RuntimeClass 功能门

<!-- See [Feature Gates](/docs/reference/command-line-tools-reference/feature-gates/) for an explanation
of enabling feature gates. The `RuntimeClass` feature gate must be enabled on apiservers _and_
kubelets. -->

参见[功能门](/docs/reference/command-line-tools-reference/feature-gates/)，了解如何开启功能门。
`RuntimeClass` 功能门必须要在 apiservers _和_ kubelets 上同时开启，才能使用。

<!-- #### 2. Install the RuntimeClass CRD -->
#### 2. 安装 RuntimeClass CRD

<!-- The RuntimeClass [CustomResourceDefinition][/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/] (CRD) can be found in the addons directory of the
Kubernetes git repo: -->

RuntimeClass [CustomResourceDefinition][/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/] (CRD)
可以在 Kubernetes git 仓库下的 addons 路径下找到：

https://github.com/kubernetes/kubernetes/tree/release-1.12/cluster/addons/runtimeclass/runtimeclass_crd.yaml

<!-- Install the CRD with `kubectl apply -f runtimeclass_crd.yaml`. -->
安装 CRD 只需要 `kubectl apply -f runtimeclass_crd.yaml` 一条命令。

[CustomResourceDefinition][/docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/]

<!-- #### 3. Configure the CRI implementation on nodes -->
#### 3. 在节点上配置 CRI 实现

<!-- The configurations to select between with RuntimeClass are CRI implementation dependent. See the
corresponding documentation for your CRI implementation for how to configure. As this is an alpha
feature, not all CRIs support multiple RuntimeClasses yet. -->

和 RuntimeClass 的相关配置都和 CRI 的实现有关。参见 CRI 实现的相关文档，了解如何进行配置。
由于这是 alpha 功能，并不是所有的 CRI 都能支持多个 RuntimeClass。

{{< note >}}
<!-- **Note:** RuntimeClass currently assumes a homogeneous node configuration across the cluster
(which means that all nodes are configured the same way with respect to container runtimes). Any heterogeneity (varying configurations) must be
managed independently of RuntimeClass through scheduling features (see [Assigning Pods to
Nodes](/docs/concepts/configuration/assign-pod-node/)). -->

**注意：** RuntimeClass 当前假设的是集群中的节点配置是同构的（换言之，所有的节点在容器运行时方面的配置是相同的）。
任何异构（不同的配置）必须要通过调度功能，在 RuntimeClass 之外单独管理
（参见 [在节点上分配 Pods](/docs/concepts/configuration/assign-pod-node/)）。

{{< /note >}}

<!-- The configurations have a corresponding `RuntimeHandler` name, referenced by the RuntimeClass. The
RuntimeHandler must be a valid DNS 1123 subdomain (alpha-numeric + `-` and `.` characters). -->

所有的配置都有相应的 `RuntimeHandler` 名，被 RuntimeClass 引用。
RuntimeHandler 的名字必须是合法的 DNS 1123 子域名 (alpha-numeric `+` `-` and `.` characters)

<!-- #### 4. Create the corresponding RuntimeClass resources -->
#### 4. 创建相应的 RuntimeClass 资源

<!-- The configurations setup in step 3 should each have an associated `RuntimeHandler` name, which
identifies the configuration. For each RuntimeHandler (and optionally the empty `""` handler),
create a corresponding RuntimeClass object. -->

步骤3中的配置设置应该有相应的 `RuntimeHandler` 名，用来标识配置。
对应每个 RuntimeHandler （或者空 `""` handler），创建相应的 RuntimeClass 对象。

<!-- The RuntimeClass resource currently only has 2 significant fields: the RuntimeClass name
(`metadata.name`) and the RuntimeHandler (`spec.runtimeHandler`). The object definition looks like this: -->

RuntimeClass 资源当前只有两个重要的域：RuntimeClass 名 (`metadata.name`)  和 RuntimeHandler (`spec.runtimeHandler`)。
对象定义如下所示：

```yaml
apiVersion: node.k8s.io/v1alpha1  # RuntimeClass is defined in the node.k8s.io API group
kind: RuntimeClass
metadata:
  name: myclass  # The name the RuntimeClass will be referenced by
  # RuntimeClass is a non-namespaced resource
spec:
  runtimeHandler: myconfiguration  # The name of the correpsonding CRI configuration
```


{{< note >}}

<!-- **Note:** It is recommended that RuntimeClass write operations (create/update/patch/delete) be
restricted to the cluster administrator. This is typically the default. See [Authorization
Overview](https://kubernetes.io/docs/reference/access-authn-authz/authorization/) for more details. -->

**注意：**：通常推荐的是 RuntimeClass 写操作 (create/update/patch/delete）应仅限于集群管理员使用。
这也是默认配置。更多细节，参见 [授权概览]（https://kubernetes.io/docs/reference/access-authn-authz/authorization/）。

{{< /note >}}

<!-- ### Usage -->
### 使用

<!-- Once RuntimeClasses are configured for the cluster, using them is very simple. Specify a
`runtimeClassName` in the Pod spec. For example: -->

一旦完成集群中 RuntimeClasses 的配置，使用起来非常简便。
在 Pod spec 中声明所需的 `runtimeClassName` 即可。例如:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: myclass
  # ...
```

<!-- This will instruct the Kubelet to use the named RuntimeClass to run this pod. If the named
RuntimeClass does not exist, or the CRI cannot run the corresponding handler, the pod will enter the
`Failed` terminal [phase](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase). Look for a
corresponding [event](/docs/tasks/debug-application-cluster/debug-application-introspection/) for an
error message. -->

这会告诉 Kubelet 使用命名的 RuntimeClass 来运行这个 pod。如果命名的 RuntimeClass 不存在，
或者 CRI 无法运行相应的 handler，那么 pod 将会进入 `Failed` 终端 [阶段](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)。
查看相应的 [事件](/docs/tasks/debug-application-cluster/debug-application-introspection/)，获取错误信息。

<!-- If no `runtimeClassName` is specified, the default RuntimeHandler will be used, which is equivalent
to the behavior when the RuntimeClass feature is disabled. -->

如果没有指明 `runtimeClassName`，将会使用默认的 RuntimeHandler，等效于 RuntimeClass 功能被禁用。

{{% /capture %}}
