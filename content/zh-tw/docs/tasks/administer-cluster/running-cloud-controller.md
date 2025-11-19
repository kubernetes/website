---
title: Kubernetes 雲管理控制器
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
由於雲驅動的開發和發佈的步調與 Kubernetes 項目不同，將服務提供商專用代碼抽象到
`{{< glossary_tooltip text="cloud-controller-manager" term_id="cloud-controller-manager" >}}`
二進制中有助於雲服務廠商在 Kubernetes 核心代碼之外獨立進行開發。

<!--
The `cloud-controller-manager` can be linked to any cloud provider that satisfies
[cloudprovider.Interface](https://github.com/kubernetes/cloud-provider/blob/master/cloud.go). 
For backwards compatibility, the
[cloud-controller-manager](https://github.com/kubernetes/kubernetes/tree/master/cmd/cloud-controller-manager)
provided in the core Kubernetes project uses the same cloud libraries as `kube-controller-manager`.
Cloud providers already supported in Kubernetes core are expected to use the in-tree
cloud-controller-manager to transition out of Kubernetes core.
-->
`cloud-controller-manager` 可以被鏈接到任何滿足
[cloudprovider.Interface](https://github.com/kubernetes/cloud-provider/blob/master/cloud.go)
約束的雲服務提供商。爲了兼容舊版本，Kubernetes 核心項目中提供的
[cloud-controller-manager](https://github.com/kubernetes/kubernetes/tree/master/cmd/cloud-controller-manager)
使用和 `kube-controller-manager` 相同的雲服務類庫。
已經在 Kubernetes 核心項目中支持的雲服務提供商預計將通過使用 in-tree 的 cloud-controller-manager
過渡爲非 Kubernetes 核心代碼。

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

每個雲服務都有一套各自的需求用於系統平臺的集成，這不應與運行
`kube-controller-manager` 的需求有太大差異。作爲經驗法則，你需要：

* 雲服務認證/授權：你的雲服務可能需要使用令牌或者 IAM 規則以允許對其 API 的訪問
* kubernetes 認證/授權：cloud-controller-manager 可能需要 RBAC 規則以訪問 kubernetes apiserver
* 高可用：類似於 kube-controller-manager，你可能希望通過主節點選舉（默認開啓）設定一個高可用的雲管理控制器。

<!--
### Running cloud-controller-manager

Successfully running cloud-controller-manager requires some changes to your cluster configuration.
-->
### 運行雲管理控制器

你需要對叢集設定做適當的修改以成功地運行雲管理控制器：

<!--
* `kubelet`, `kube-apiserver`, and `kube-controller-manager` must be set according to the
  user's usage of external CCM. If the user has an external CCM (not the internal cloud
  controller loops in the Kubernetes Controller Manager), then `--cloud-provider=external`
  must be specified. Otherwise, it should not be specified.
-->
* `kubelet`、`kube-apiserver` 和 `kube-controller-manager` 必須根據使用者對外部 CCM 的使用進行設置。
  如果使用者有一個外部的 CCM（不是 Kubernetes 控制器管理器中的內部雲控制器迴路），
  那麼必須添加 `--cloud-provider=external` 參數。否則，不應添加此參數。

<!--
Keep in mind that setting up your cluster to use cloud controller manager will
change your cluster behaviour in a few ways:
-->
請記住，設置叢集使用雲管理控制器將用多種方式更改叢集行爲：

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
* 指定了 `--cloud-provider=external` 的組件將被添加一個 `node.cloudprovider.kubernetes.io/uninitialized`
  的污點，導致其在初始化過程中不可調度（`NoSchedule`）。
  這將標記該節點在能夠正常調度前，需要外部的控制器進行二次初始化。
  請注意，如果雲管理控制器不可用，叢集中的新節點會一直處於不可調度的狀態。
  這個污點很重要，因爲調度器可能需要關於節點的雲服務特定的信息，比如他們的區域或類型
  （高端 CPU、GPU 支持、內存較大、臨時實例等）。

<!--
* cloud information about nodes in the cluster will no longer be retrieved using
  local metadata, but instead all API calls to retrieve node information will go
  through cloud controller manager. This may mean you can restrict access to your
  cloud API on the kubelets for better security. For larger clusters you may want
  to consider if cloud controller manager will hit rate limits since it is now
  responsible for almost all API calls to your cloud from within the cluster.
-->
* 叢集中節點的雲服務信息將不再能夠從本地元數據中獲取，取而代之的是所有獲取節點信息的
  API 調用都將通過雲管理控制器。這意味着你可以通過限制到 kubelet 雲服務 API 的訪問來提升安全性。
  在更大的叢集中你可能需要考慮雲管理控制器是否會遇到速率限制，
  因爲它現在負責叢集中幾乎所有到雲服務的 API 調用。

<!--
Cloud controller manager can implement:

* node controller - responsible for updating kubernetes nodes using cloud APIs
  and deleting kubernetes nodes that were deleted on your cloud.
* service controller - responsible for loadbalancers on your cloud against
  services of type LoadBalancer.
* route controller - responsible for setting up network routes on your cloud
* any other features you would like to implement if you are running an out-of-tree provider.
-->
雲管理控制器可以實現：

* 節點控制器 - 負責使用雲服務 API 更新 kubernetes 節點並刪除在雲服務上已經刪除的 kubernetes 節點。
* 服務控制器 - 負責在雲服務上爲類型爲 LoadBalancer 的 service 提供負載均衡器。
* 路由控制器 - 負責在雲服務上設定網路路由。
* 如果你使用的是 out-of-tree 提供商，請按需實現其餘任意特性。

<!--
## Examples

If you are using a cloud that is currently supported in Kubernetes core and would
like to adopt cloud controller manager, see the
[cloud controller manager in kubernetes core](https://github.com/kubernetes/kubernetes/tree/master/cmd/cloud-controller-manager).

For cloud controller managers not in Kubernetes core, you can find the respective
projects in repos maintained by cloud vendors or sig leads.
-->
## 示例

如果當前 Kubernetes 內核支持你使用的雲服務，並且想要採用雲管理控制器，請參見
[kubernetes 內核中的雲管理控制器](https://github.com/kubernetes/kubernetes/tree/master/cmd/cloud-controller-manager)。

對於不在 Kubernetes 核心代碼庫中的雲管理控制器，你可以在雲服務廠商或 SIG 領導者的源中找到對應的項目。

* [DigitalOcean](https://github.com/digitalocean/digitalocean-cloud-controller-manager)
* [keepalived](https://github.com/munnerz/keepalived-cloud-provider)
* [Oracle Cloud Infrastructure](https://github.com/oracle/oci-cloud-controller-manager)
* [Rancher](https://github.com/rancher/rancher-cloud-controller-manager)

<!--
For providers already in Kubernetes core, you can run the in-tree cloud controller
manager as a Daemonset in your cluster, use the following as a guideline:
-->
對於已經存在於 Kubernetes 內核中的提供商，你可以在叢集中將 in-tree 雲管理控制器作爲守護進程運行。請使用如下指南：

{{% code_sample file="admin/cloud/ccm-example.yaml" %}}

<!--
## Limitations

Running cloud controller manager comes with a few possible limitations. Although
these limitations are being addressed in upcoming releases, it's important that
you are aware of these limitations for production workloads.
-->
## 限制

運行雲管理控制器會有一些可能的限制。雖然以後的版本將處理這些限制，但是知道這些生產負載的限制很重要。

<!--
### Support for Volumes

Cloud controller manager does not implement any of the volume controllers found
in `kube-controller-manager` as the volume integrations also require coordination
with kubelets. As we evolve CSI (container storage interface) and add stronger
support for flex volume plugins, necessary support will be added to cloud
controller manager so that clouds can fully integrate with volumes. Learn more
about out-of-tree CSI volume plugins [here](https://github.com/kubernetes/features/issues/178).
-->
### 對 Volume 的支持

雲管理控制器未實現 `kube-controller-manager` 中的任何 volume 控制器，
因爲和 volume 的集成還需要與 kubelet 協作。由於我們引入了 CSI (容器存儲接口，
container storage interface) 並對彈性 volume 插件添加了更強大的支持，
雲管理控制器將添加必要的支持，以使雲服務同 volume 更好的集成。
請在[這裏](https://github.com/kubernetes/features/issues/178)瞭解更多關於
out-of-tree CSI volume 插件的信息。

<!--
### Scalability

The cloud-controller-manager queries your cloud provider's APIs to retrieve
information for all nodes. For very large clusters, consider possible
bottlenecks such as resource requirements and API rate limiting.
-->
### 可擴展性

通過雲管理控制器查詢你的雲提供商的 API 以檢索所有節點的信息。
對於非常大的叢集，請考慮可能的瓶頸，例如資源需求和 API 速率限制。

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
### 雞和蛋的問題

雲管理控制器的目標是將雲服務特性的開發從 Kubernetes 核心項目中解耦。
不幸的是，Kubernetes 項目的許多方面都假設雲服務提供商的特性同項目緊密結合。
因此，這種新架構的採用可能導致某些場景下，當一個請求需要從雲服務提供商獲取信息時，
在該請求沒有完成的情況下雲管理控制器不能返回那些信息。

<!--
A good example of this is the TLS bootstrapping feature in the Kubelet.
Currently, TLS bootstrapping assumes that the Kubelet has the ability to ask the cloud provider
(or a local metadata service) for all its address types (private, public, etc)
but cloud controller manager cannot set a node's address types without being
initialized in the first place which requires that the kubelet has TLS certificates
to communicate with the apiserver.

As this initiative evolves, changes will be made to address these issues in upcoming releases.
-->
Kubelet 中的 TLS 引導特性是一個很好的例子。
目前，TLS 引導認爲 kubelet 有能力從雲提供商（或本地元數據服務）獲取所有的地址類型（私有、公用等），
但在被初始化之前，雲管理控制器不能設置節點地址類型，而這需要 kubelet 擁有
TLS 證書以和 API 伺服器通信。

隨着整個動議的演進，將來的發行版中將作出改變來解決這些問題。

## {{% heading "whatsnext" %}}

<!--
To build and develop your own cloud controller manager, read
the [Developing Cloud Controller Manager](/docs/tasks/administer-cluster/developing-cloud-controller-manager.md) doc.
-->
要構建和開發你自己的雲管理控制器，請閱讀
[開發雲管理控制器](/zh-cn/docs/tasks/administer-cluster/developing-cloud-controller-manager/)
文檔。
