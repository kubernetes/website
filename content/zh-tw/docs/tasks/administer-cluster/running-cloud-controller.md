---
title: Kubernetes 雲管理控制器
content_type: concept
---
<!--
reviewers:
- luxas
- thockin
- wlan0
title: Kubernetes Cloud Controller Manager
content_type: concept
-->

<!-- overview -->

{{< feature-state state="beta" for_k8s_version="v1.11" >}}

<!--
Since cloud providers develop and release at a different pace compared to the Kubernetes project, abstracting the provider-specific code to the `{{< glossary_tooltip text="cloud-controller-manager" term_id="cloud-controller-manager" >}}` binary allows cloud vendors to evolve independently from the core Kubernetes code.
-->
由於雲驅動的開發和釋出的步調與 Kubernetes 專案不同，將服務提供商專用程式碼抽象到
`{{< glossary_tooltip text="cloud-controller-manager" term_id="cloud-controller-manager" >}}`
二進位制中有助於雲服務廠商在 Kubernetes 核心程式碼之外獨立進行開發。

<!--
The `cloud-controller-manager` can be linked to any cloud provider that satisfies [cloudprovider.Interface](https://github.com/kubernetes/cloud-provider/blob/master/cloud.go). For backwards compatibility, the [cloud-controller-manager](https://github.com/kubernetes/kubernetes/tree/master/cmd/cloud-controller-manager) provided in the core Kubernetes project uses the same cloud libraries as `kube-controller-manager`. Cloud providers already supported in Kubernetes core are expected to use the in-tree cloud-controller-manager to transition out of Kubernetes core.
-->
`cloud-controller-manager` 可以被連結到任何滿足
[cloudprovider.Interface](https://github.com/kubernetes/cloud-provider/blob/master/cloud.go)
約束的雲服務提供商。為了相容舊版本，Kubernetes 核心專案中提供的
[cloud-controller-manager](https://github.com/kubernetes/kubernetes/tree/master/cmd/cloud-controller-manager)
使用和 `kube-controller-manager` 相同的雲服務類庫。
已經在 Kubernetes 核心專案中支援的雲服務提供商預計將透過使用 in-tree 的 cloud-controller-manager
過渡為非 Kubernetes 核心程式碼。

<!-- body -->

<!--
## Administration

### Requirements

Every cloud has their own set of requirements for running their own cloud provider integration, it should not be too different from the requirements when running `kube-controller-manager`. As a general rule of thumb you'll need:

* cloud authentication/authorization: your cloud may require a token or IAM rules to allow access to their APIs
* kubernetes authentication/authorization: cloud-controller-manager may need RBAC rules set to speak to the kubernetes apiserver
* high availability: like kube-controller-manager, you may want a high available setup for cloud controller manager using leader election (on by default).
-->
## 管理

### 需求

每個雲服務都有一套各自的需求用於系統平臺的整合，這不應與執行
`kube-controller-manager` 的需求有太大差異。作為經驗法則，你需要：

* 雲服務認證/授權：你的雲服務可能需要使用令牌或者 IAM 規則以允許對其 API 的訪問
* kubernetes 認證/授權：cloud-controller-manager 可能需要 RBAC 規則以訪問 kubernetes apiserver
* 高可用：類似於 kube-controller-manager，你可能希望透過主節點選舉（預設開啟）配置一個高可用的雲管理控制器。

<!--
### Running cloud-controller-manager

Successfully running cloud-controller-manager requires some changes to your cluster configuration.
-->
### 運行雲管理控制器

你需要對叢集配置做適當的修改以成功地運行雲管理控制器：

<!--
* `kube-apiserver` and `kube-controller-manager` MUST NOT specify the `--cloud-provider` flag. This ensures that it does not run any cloud specific loops that would be run by cloud controller manager. In the future, this flag will be deprecated and removed.
* `kubelet` must run with `--cloud-provider=external`. This is to ensure that the kubelet is aware that it must be initialized by the cloud controller manager before it is scheduled any work.
-->
* 一定不要為 `kube-apiserver` 和 `kube-controller-manager` 指定 `--cloud-provider` 標誌。
  這將保證它們不會執行任何雲服務專用迴圈邏輯，這將會由雲管理控制器執行。未來這個標記將被廢棄並去除。
* `kubelet` 必須使用 `--cloud-provider=external` 執行。
  這是為了保證讓 kubelet 知道在執行任何任務前，它必須被雲管理控制器初始化。

<!--
Keep in mind that setting up your cluster to use cloud controller manager will change your cluster behaviour in a few ways:
-->
請記住，設定叢集使用雲管理控制器將用多種方式更改叢集行為：

<!--
* kubelets specifying `--cloud-provider=external` will add a taint `node.cloudprovider.kubernetes.io/uninitialized` with an effect `NoSchedule` during initialization. This marks the node as needing a second initialization from an external controller before it can be scheduled work. Note that in the event that cloud controller manager is not available, new nodes in the cluster will be left unschedulable. The taint is important since the scheduler may require cloud specific information about nodes such as their region or type (high cpu, gpu, high memory, spot instance, etc).
-->
* 指定了 `--cloud-provider=external` 的 kubelet 將被新增一個 `node.cloudprovider.kubernetes.io/uninitialized`
  的汙點，導致其在初始化過程中不可排程（`NoSchedule`）。
  這將標記該節點在能夠正常排程前，需要外部的控制器進行二次初始化。
  請注意，如果雲管理控制器不可用，叢集中的新節點會一直處於不可排程的狀態。
  這個汙點很重要，因為排程器可能需要關於節點的雲服務特定的資訊，比如他們的區域或型別
  （高階 CPU、GPU 支援、記憶體較大、臨時例項等）。

<!--
* cloud information about nodes in the cluster will no longer be retrieved using local metadata, but instead all API calls to retrieve node information will go through cloud controller manager. This may mean you can restrict access to your cloud API on the kubelets for better security. For larger clusters you may want to consider if cloud controller manager will hit rate limits since it is now responsible for almost all API calls to your cloud from within the cluster.
-->
* 叢集中節點的雲服務資訊將不再能夠從本地元資料中獲取，取而代之的是所有獲取節點資訊的
  API 呼叫都將透過雲管理控制器。這意味著你可以透過限制到 kubelet 雲服務 API 的訪問來提升安全性。
  在更大的叢集中你可能需要考慮雲管理控制器是否會遇到速率限制，
  因為它現在負責叢集中幾乎所有到雲服務的 API 呼叫。

<!--
Cloud controller manager can implement:

* node controller - responsible for updating kubernetes nodes using cloud APIs and deleting kubernetes nodes that were deleted on your cloud.
* service controller - responsible for loadbalancers on your cloud against services of type LoadBalancer.
* route controller - responsible for setting up network routes on your cloud
* any other features you would like to implement if you are running an out-of-tree provider.
-->
雲管理控制器可以實現：

* 節點控制器 - 負責使用雲服務 API 更新 kubernetes 節點並刪除在雲服務上已經刪除的 kubernetes 節點。
* 服務控制器 - 負責在雲服務上為型別為 LoadBalancer 的 service 提供負載均衡器。
* 路由控制器 - 負責在雲服務上配置網路路由。
* 如果你使用的是 out-of-tree 提供商，請按需實現其餘任意特性。

<!--
## Examples

If you are using a cloud that is currently supported in Kubernetes core and would like to adopt cloud controller manager, see the [cloud controller manager in kubernetes core](https://github.com/kubernetes/kubernetes/tree/master/cmd/cloud-controller-manager).

For cloud controller managers not in Kubernetes core, you can find the respective projects in repos maintained by cloud vendors or sig leads.
-->
## 示例

如果當前 Kubernetes 核心支援你使用的雲服務，並且想要採用雲管理控制器，請參見
[kubernetes 核心中的雲管理控制器](https://github.com/kubernetes/kubernetes/tree/master/cmd/cloud-controller-manager)。

對於不在 Kubernetes 核心程式碼庫中的雲管理控制器，你可以在雲服務廠商或 SIG 領導者的源中找到對應的專案。

* [DigitalOcean](https://github.com/digitalocean/digitalocean-cloud-controller-manager)
* [keepalived](https://github.com/munnerz/keepalived-cloud-provider)
* [Oracle Cloud Infrastructure](https://github.com/oracle/oci-cloud-controller-manager)
* [Rancher](https://github.com/rancher/rancher-cloud-controller-manager)

<!--
For providers already in Kubernetes core, you can run the in-tree cloud controller manager as a Daemonset in your cluster, use the following as a guideline:
-->
對於已經存在於 Kubernetes 核心中的提供商，你可以在叢集中將 in-tree 雲管理控制器作為守護程序執行。請使用如下指南：

{{< codenew file="admin/cloud/ccm-example.yaml" >}}

<!--
## Limitations

Running cloud controller manager comes with a few possible limitations. Although these limitations are being addressed in upcoming releases, it's important that you are aware of these limitations for production workloads.
-->
## 限制

運行雲管理控制器會有一些可能的限制。雖然以後的版本將處理這些限制，但是知道這些生產負載的限制很重要。

<!--
### Support for Volumes

Cloud controller manager does not implement any of the volume controllers found in `kube-controller-manager` as the volume integrations also require coordination with kubelets. As we evolve CSI (container storage interface) and add stronger support for flex volume plugins, necessary support will be added to cloud controller manager so that clouds can fully integrate with volumes. Learn more about out-of-tree CSI volume plugins [here](https://github.com/kubernetes/features/issues/178).
-->
### 對 Volume 的支援

雲管理控制器未實現 `kube-controller-manager` 中的任何 volume 控制器，因為和 volume 的整合還需要與 kubelet 協作。由於我們引入了 CSI (容器儲存介面，container storage interface) 並對彈性 volume 外掛添加了更強大的支援，雲管理控制器將新增必要的支援，以使雲服務同 volume 更好的整合。請在 [這裡](https://github.com/kubernetes/features/issues/178) 瞭解更多關於 out-of-tree CSI volume 外掛的資訊。

<!--
### Scalability

In the previous architecture for cloud providers, we relied on kubelets using a local metadata service to retrieve node information about itself. With this new architecture, we now fully rely on the cloud controller managers to retrieve information for all nodes. For very larger clusters, you should consider possible bottle necks such as resource requirements and API rate limiting.
-->
### 可擴充套件性

在以前為雲服務提供商提供的架構中，我們依賴 kubelet 的本地元資料服務來獲取關於它本身的節點資訊。透過這個新的架構，現在我們完全依賴雲管理控制器來獲取所有節點的資訊。對於非常大的叢集，你需要考慮可能的瓶頸，例如資源需求和 API 速率限制。

<!--
### Chicken and Egg

The goal of the cloud controller manager project is to decouple development of cloud features from the core Kubernetes project. Unfortunately, many aspects of the Kubernetes project has assumptions that cloud provider features are tightly integrated into the project. As a result, adopting this new architecture can create several situations where a request is being made for information from a cloud provider, but the cloud controller manager may not be able to return that information without the original request being complete.
-->
### 雞和蛋的問題

雲管理控制器的目標是將雲服務特性的開發從 Kubernetes 核心專案中解耦。
不幸的是，Kubernetes 專案的許多方面都假設雲服務提供商的特性同項目緊密結合。
因此，這種新架構的採用可能導致某些場景下，當一個請求需要從雲服務提供商獲取資訊時，
在該請求沒有完成的情況下雲管理控制器不能返回那些資訊。

<!--
A good example of this is the TLS bootstrapping feature in the Kubelet. Currently, TLS bootstrapping assumes that the Kubelet has the ability to ask the cloud provider (or a local metadata service) for all its address types (private, public, etc) but cloud controller manager cannot set a node's address types without being initialized in the first place which requires that the kubelet has TLS certificates to communicate with the apiserver.

As this initiative evolves, changes will be made to address these issues in upcoming releases.
-->
Kubelet 中的 TLS 引導特性是一個很好的例子。
目前，TLS 引導認為 kubelet 有能力從雲提供商（或本地元資料服務）獲取所有的地址型別（私有、公用等），
但在被初始化之前，雲管理控制器不能設定節點地址型別，而這需要 kubelet 擁有
TLS 證書以和 API 伺服器通訊。

隨著整個動議的演進，將來的發行版中將作出改變來解決這些問題。

## {{% heading "whatsnext" %}}

<!--
To build and develop your own cloud controller manager, read the [Developing Cloud Controller Manager](/docs/tasks/administer-cluster/developing-cloud-controller-manager.md) doc.
-->
要構建和開發你自己的雲管理控制器，請閱讀
[開發雲管理控制器](/zh-cn/docs/tasks/administer-cluster/developing-cloud-controller-manager/)
文件。

