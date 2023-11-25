---
title: Kubernetes 云管理控制器
content_type: concept
weight: 110
---
<!--
reviewers:
- luxas
- thockin
- wlan0
title: Kubernetes Cloud Controller Manager
content_type: concept
weight: 110
-->

<!-- overview -->

{{< feature-state state="beta" for_k8s_version="v1.11" >}}

<!--
Since cloud providers develop and release at a different pace compared to the
Kubernetes project, abstracting the provider-specific code to the
`{{< glossary_tooltip text="cloud-controller-manager" term_id="cloud-controller-manager" >}}`
binary allows cloud vendors to evolve independently from the core Kubernetes code.
-->
由于云驱动的开发和发布的步调与 Kubernetes 项目不同，将服务提供商专用代码抽象到
`{{< glossary_tooltip text="cloud-controller-manager" term_id="cloud-controller-manager" >}}`
二进制中有助于云服务厂商在 Kubernetes 核心代码之外独立进行开发。

<!--
The `cloud-controller-manager` can be linked to any cloud provider that satisfies
[cloudprovider.Interface](https://github.com/kubernetes/cloud-provider/blob/master/cloud.go). 
For backwards compatibility, the
[cloud-controller-manager](https://github.com/kubernetes/kubernetes/tree/master/cmd/cloud-controller-manager)
provided in the core Kubernetes project uses the same cloud libraries as `kube-controller-manager`.
Cloud providers already supported in Kubernetes core are expected to use the in-tree
cloud-controller-manager to transition out of Kubernetes core.
-->
`cloud-controller-manager` 可以被链接到任何满足
[cloudprovider.Interface](https://github.com/kubernetes/cloud-provider/blob/master/cloud.go)
约束的云服务提供商。为了兼容旧版本，Kubernetes 核心项目中提供的
[cloud-controller-manager](https://github.com/kubernetes/kubernetes/tree/master/cmd/cloud-controller-manager)
使用和 `kube-controller-manager` 相同的云服务类库。
已经在 Kubernetes 核心项目中支持的云服务提供商预计将通过使用 in-tree 的 cloud-controller-manager
过渡为非 Kubernetes 核心代码。

<!-- body -->

<!--
## Administration

### Requirements

Every cloud has their own set of requirements for running their own cloud provider
integration, it should not be too different from the requirements when running
`kube-controller-manager`. As a general rule of thumb you'll need:

* cloud authentication/authorization: your cloud may require a token or IAM rules
  to allow access to their APIs
* kubernetes authentication/authorization: cloud-controller-manager may need RBAC
  rules set to speak to the kubernetes apiserver
* high availability: like kube-controller-manager, you may want a high available
  setup for cloud controller manager using leader election (on by default).
-->
## 管理

### 需求

每个云服务都有一套各自的需求用于系统平台的集成，这不应与运行
`kube-controller-manager` 的需求有太大差异。作为经验法则，你需要：

* 云服务认证/授权：你的云服务可能需要使用令牌或者 IAM 规则以允许对其 API 的访问
* kubernetes 认证/授权：cloud-controller-manager 可能需要 RBAC 规则以访问 kubernetes apiserver
* 高可用：类似于 kube-controller-manager，你可能希望通过主节点选举（默认开启）配置一个高可用的云管理控制器。

<!--
### Running cloud-controller-manager

Successfully running cloud-controller-manager requires some changes to your cluster configuration.
-->
### 运行云管理控制器

你需要对集群配置做适当的修改以成功地运行云管理控制器：

<!--
* `kubelet`, `kube-apiserver`, and `kube-controller-manager` must be set according to the
  user's usage of external CCM. If the user has an external CCM (not the internal cloud
  controller loops in the Kubernetes Controller Manager), then `--cloud-provider=external`
  must be specified. Otherwise, it should not be specified.
-->
* `kubelet`、`kube-apiserver` 和 `kube-controller-manager` 必须根据用户对外部 CCM 的使用进行设置。
  如果用户有一个外部的 CCM（不是 Kubernetes 控制器管理器中的内部云控制器回路），
  那么必须添加 `--cloud-provider=external` 参数。否则，不应添加此参数。

<!--
Keep in mind that setting up your cluster to use cloud controller manager will
change your cluster behaviour in a few ways:
-->
请记住，设置集群使用云管理控制器将用多种方式更改集群行为：

<!--
* Components that specify `--cloud-provider=external` will add a taint
  `node.cloudprovider.kubernetes.io/uninitialized` with an effect `NoSchedule`
  during initialization. This marks the node as needing a second initialization
  from an external controller before it can be scheduled work. Note that in the
  event that cloud controller manager is not available, new nodes in the cluster
  will be left unschedulable. The taint is important since the scheduler may
  require cloud specific information about nodes such as their region or type
  (high cpu, gpu, high memory, spot instance, etc).
-->
* 指定了 `--cloud-provider=external` 的组件将被添加一个 `node.cloudprovider.kubernetes.io/uninitialized`
  的污点，导致其在初始化过程中不可调度（`NoSchedule`）。
  这将标记该节点在能够正常调度前，需要外部的控制器进行二次初始化。
  请注意，如果云管理控制器不可用，集群中的新节点会一直处于不可调度的状态。
  这个污点很重要，因为调度器可能需要关于节点的云服务特定的信息，比如他们的区域或类型
  （高端 CPU、GPU 支持、内存较大、临时实例等）。

<!--
* cloud information about nodes in the cluster will no longer be retrieved using
  local metadata, but instead all API calls to retrieve node information will go
  through cloud controller manager. This may mean you can restrict access to your
  cloud API on the kubelets for better security. For larger clusters you may want
  to consider if cloud controller manager will hit rate limits since it is now
  responsible for almost all API calls to your cloud from within the cluster.
-->
* 集群中节点的云服务信息将不再能够从本地元数据中获取，取而代之的是所有获取节点信息的
  API 调用都将通过云管理控制器。这意味着你可以通过限制到 kubelet 云服务 API 的访问来提升安全性。
  在更大的集群中你可能需要考虑云管理控制器是否会遇到速率限制，
  因为它现在负责集群中几乎所有到云服务的 API 调用。

<!--
Cloud controller manager can implement:

* node controller - responsible for updating kubernetes nodes using cloud APIs
  and deleting kubernetes nodes that were deleted on your cloud.
* service controller - responsible for loadbalancers on your cloud against
  services of type LoadBalancer.
* route controller - responsible for setting up network routes on your cloud
* any other features you would like to implement if you are running an out-of-tree provider.
-->
云管理控制器可以实现：

* 节点控制器 - 负责使用云服务 API 更新 kubernetes 节点并删除在云服务上已经删除的 kubernetes 节点。
* 服务控制器 - 负责在云服务上为类型为 LoadBalancer 的 service 提供负载均衡器。
* 路由控制器 - 负责在云服务上配置网络路由。
* 如果你使用的是 out-of-tree 提供商，请按需实现其余任意特性。

<!--
## Examples

If you are using a cloud that is currently supported in Kubernetes core and would
like to adopt cloud controller manager, see the
[cloud controller manager in kubernetes core](https://github.com/kubernetes/kubernetes/tree/master/cmd/cloud-controller-manager).

For cloud controller managers not in Kubernetes core, you can find the respective
projects in repos maintained by cloud vendors or sig leads.
-->
## 示例

如果当前 Kubernetes 内核支持你使用的云服务，并且想要采用云管理控制器，请参见
[kubernetes 内核中的云管理控制器](https://github.com/kubernetes/kubernetes/tree/master/cmd/cloud-controller-manager)。

对于不在 Kubernetes 核心代码库中的云管理控制器，你可以在云服务厂商或 SIG 领导者的源中找到对应的项目。

* [DigitalOcean](https://github.com/digitalocean/digitalocean-cloud-controller-manager)
* [keepalived](https://github.com/munnerz/keepalived-cloud-provider)
* [Oracle Cloud Infrastructure](https://github.com/oracle/oci-cloud-controller-manager)
* [Rancher](https://github.com/rancher/rancher-cloud-controller-manager)

<!--
For providers already in Kubernetes core, you can run the in-tree cloud controller
manager as a Daemonset in your cluster, use the following as a guideline:
-->
对于已经存在于 Kubernetes 内核中的提供商，你可以在集群中将 in-tree 云管理控制器作为守护进程运行。请使用如下指南：

{{% code_sample file="admin/cloud/ccm-example.yaml" %}}

<!--
## Limitations

Running cloud controller manager comes with a few possible limitations. Although
these limitations are being addressed in upcoming releases, it's important that
you are aware of these limitations for production workloads.
-->
## 限制

运行云管理控制器会有一些可能的限制。虽然以后的版本将处理这些限制，但是知道这些生产负载的限制很重要。

<!--
### Support for Volumes

Cloud controller manager does not implement any of the volume controllers found
in `kube-controller-manager` as the volume integrations also require coordination
with kubelets. As we evolve CSI (container storage interface) and add stronger
support for flex volume plugins, necessary support will be added to cloud
controller manager so that clouds can fully integrate with volumes. Learn more
about out-of-tree CSI volume plugins [here](https://github.com/kubernetes/features/issues/178).
-->
### 对 Volume 的支持

云管理控制器未实现 `kube-controller-manager` 中的任何 volume 控制器，
因为和 volume 的集成还需要与 kubelet 协作。由于我们引入了 CSI (容器存储接口，
container storage interface) 并对弹性 volume 插件添加了更强大的支持，
云管理控制器将添加必要的支持，以使云服务同 volume 更好的集成。
请在[这里](https://github.com/kubernetes/features/issues/178)了解更多关于
out-of-tree CSI volume 插件的信息。

<!--
### Scalability

The cloud-controller-manager queries your cloud provider's APIs to retrieve
information for all nodes. For very large clusters, consider possible
bottlenecks such as resource requirements and API rate limiting.
-->
### 可扩展性

通过云管理控制器查询你的云提供商的 API 以检索所有节点的信息。
对于非常大的集群，请考虑可能的瓶颈，例如资源需求和 API 速率限制。

<!--
### Chicken and Egg

The goal of the cloud controller manager project is to decouple development
of cloud features from the core Kubernetes project. Unfortunately, many aspects
of the Kubernetes project has assumptions that cloud provider features are tightly
integrated into the project. As a result, adopting this new architecture can create
several situations where a request is being made for information from a cloud provider,
but the cloud controller manager may not be able to return that information without
the original request being complete.
-->
### 鸡和蛋的问题

云管理控制器的目标是将云服务特性的开发从 Kubernetes 核心项目中解耦。
不幸的是，Kubernetes 项目的许多方面都假设云服务提供商的特性同项目紧密结合。
因此，这种新架构的采用可能导致某些场景下，当一个请求需要从云服务提供商获取信息时，
在该请求没有完成的情况下云管理控制器不能返回那些信息。

<!--
A good example of this is the TLS bootstrapping feature in the Kubelet.
Currently, TLS bootstrapping assumes that the Kubelet has the ability to ask the cloud provider
(or a local metadata service) for all its address types (private, public, etc)
but cloud controller manager cannot set a node's address types without being
initialized in the first place which requires that the kubelet has TLS certificates
to communicate with the apiserver.

As this initiative evolves, changes will be made to address these issues in upcoming releases.
-->
Kubelet 中的 TLS 引导特性是一个很好的例子。
目前，TLS 引导认为 kubelet 有能力从云提供商（或本地元数据服务）获取所有的地址类型（私有、公用等），
但在被初始化之前，云管理控制器不能设置节点地址类型，而这需要 kubelet 拥有
TLS 证书以和 API 服务器通信。

随着整个动议的演进，将来的发行版中将作出改变来解决这些问题。

## {{% heading "whatsnext" %}}

<!--
To build and develop your own cloud controller manager, read
the [Developing Cloud Controller Manager](/docs/tasks/administer-cluster/developing-cloud-controller-manager.md) doc.
-->
要构建和开发你自己的云管理控制器，请阅读
[开发云管理控制器](/zh-cn/docs/tasks/administer-cluster/developing-cloud-controller-manager/)
文档。
