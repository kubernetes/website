---
layout: blog
title: '完成 Kubernetes 史上最大規模遷移'
date: 2024-05-20
slug: completing-cloud-provider-migration
author: >
  Andrew Sy Kim (Google),
  Michelle Au (Google),
  Walter Fender (Google),
  Michael McCune (Red Hat)
translator: >
  Xin Li (DaoCloud)
---

<!--
layout: blog
title: 'Completing the largest migration in Kubernetes history'
date: 2024-05-20
slug: completing-cloud-provider-migration
author: >
  Andrew Sy Kim (Google),
  Michelle Au (Google),
  Walter Fender (Google),
  Michael McCune (Red Hat)
-->

<!--
Since as early as Kubernetes v1.7, the Kubernetes project has pursued the ambitious goal of removing built-in cloud provider integrations ([KEP-2395](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2395-removing-in-tree-cloud-providers/README.md)).
While these integrations were instrumental in Kubernetes' early development and growth, their removal was driven by two key factors:
the growing complexity of maintaining native support for every cloud provider across millions of lines of Go code, and the desire to establish
Kubernetes as a truly vendor-neutral platform.
-->
早自 Kubernetes v1.7 起，Kubernetes 項目就開始追求取消集成內置雲驅動
（[KEP-2395](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2395-removing-in-tree-cloud-providers/README.md)）。
雖然這些集成對於 Kubernetes 的早期發展和增長髮揮了重要作用，但它們的移除是由兩個關鍵因素驅動的：
爲各雲啓動維護數百萬行 Go 代碼的原生支持所帶來的日趨增長的複雜度，以及將 Kubernetes 打造爲真正的供應商中立平臺的願景。

<!--
After many releases, we're thrilled to announce that all cloud provider integrations have been successfully migrated from the core Kubernetes repository to external plugins.
In addition to achieving our initial objectives, we've also significantly streamlined Kubernetes by removing roughly 1.5 million lines of code and reducing the binary sizes of core components by approximately 40%.
-->
歷經很多發佈版本之後，我們很高興地宣佈所有云驅動集成組件已被成功地從核心 Kubernetes 倉庫遷移到外部插件中。
除了實現我們最初的目標之外，我們還通過刪除大約 150 萬行代碼，將核心組件的可執行文件大小減少了大約 40%，
極大簡化了 Kubernetes。

<!--
This migration was a complex and long-running effort due to the numerous impacted components and the critical code paths that relied on the built-in integrations for the
five initial cloud providers: Google Cloud, AWS, Azure, OpenStack, and vSphere. To successfully complete this migration, we had to build four new subsystems from the ground up:
-->
由於受影響的組件衆多，而且關鍵代碼路徑依賴於五個初始雲驅動（Google Cloud、AWS、Azure、OpenStack 和 vSphere）
的內置集成，因此此次遷移是一項複雜且耗時的工作。
爲了成功完成此遷移，我們必須從頭開始構建四個新的子系統：

<!--
1. **Cloud controller manager** ([KEP-2392](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2392-cloud-controller-manager/README.md))
1. **API server network proxy** ([KEP-1281](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1281-network-proxy))
1. **kubelet credential provider plugins** ([KEP-2133](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2133-kubelet-credential-providers))
1. **Storage migration to use [CSI](https://github.com/container-storage-interface/spec?tab=readme-ov-file#container-storage-interface-csi-specification-)** ([KEP-625](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/625-csi-migration/README.md))
-->
1. **雲控制器管理器（Cloud controller manager）**（[KEP-2392](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2392-cloud-controller-manager/README.md)）
1. **API 伺服器網路代理**（[KEP-1281](https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1281-network-proxy)）
1. **kubelet 憑證提供程序插件**（[KEP-2133](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2133-kubelet-credential-providers)）
1. **存儲遷移以使用 [CSI](https://github.com/container-storage-interface/spec?tab=readme-ov-file#container-storage-interface-csi-specification-)**（[KEP-625](https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/625-csi-migration/README.md)）

<!--
Each subsystem was critical to achieve full feature parity with built-in capabilities and required several releases to bring each subsystem to GA-level maturity with a safe and
reliable migration path. More on each subsystem below.
-->
就與內置功能實現完全的特性等價而言，每個子系統都至關重要，
並且需要迭代多個版本才能使每個子系統達到 GA 級別並具有安全可靠的遷移路徑。
下面詳細介紹每個子系統。

<!--
### Cloud controller manager

The cloud controller manager was the first external component introduced in this effort, replacing functionality within the kube-controller-manager and kubelet that directly interacted with cloud APIs.
This essential component is responsible for initializing nodes by applying metadata labels that indicate the cloud region and zone a Node is running on, as well as IP addresses that are only known to the cloud provider.
Additionally, it runs the service controller, which is responsible for provisioning cloud load balancers for Services of type LoadBalancer.
-->
### 雲控制器管理器

雲控制器管理器是這項工作中引入的第一個外部組件，取代了 kube-controller-manager 和 kubelet 中直接與雲 API 交互的功能。
這個基本組件負責通過施加元數據標籤來初始化節點。所施加的元數據標籤標示節點運行所在的雲區域和可用區，
以及只有雲驅動知道的 IP 地址。
此外，它還運行服務控制器，該控制器負責爲 LoadBalancer 類型的 Service 設定雲負載均衡器。

![Kubernetes 組件](/images/docs/components-of-kubernetes.svg)

<!--
To learn more, read [Cloud Controller Manager](/docs/concepts/architecture/cloud-controller/) in the Kubernetes documentation.
-->
要進一步瞭解相關信息，請閱讀 Kubernetes 文檔中的[雲控制器管理器](/zh-cn/docs/concepts/architecture/cloud-controller/)。

<!--
### API server network proxy

The API Server Network Proxy project, initiated in 2018 in collaboration with SIG API Machinery, aimed to replace the SSH tunneler functionality within the kube-apiserver.
This tunneler had been used to securely proxy traffic between the Kubernetes control plane and nodes, but it heavily relied on provider-specific implementation details embedded in the kube-apiserver to establish these SSH tunnels.
-->
### API 伺服器網路代理

API 伺服器網路代理項目於 2018 年與 SIG API Machinery 合作啓動，旨在取代 kube-apiserver 中的 SSH 隧道功能。
該隧道器原用於安全地代理 Kubernetes 控制平面和節點之間的流量，但它重度依賴於
kube-apiserver 中所嵌入的、特定於提供商的實現細節來建立這些 SSH 隧道。

<!--
Now, the API Server Network Proxy is a GA-level extension point within the kube-apiserver. It offers a generic proxying mechanism that can route traffic from the API server to nodes through a secure proxy,
eliminating the need for the API server to have any knowledge of the specific cloud provider it is running on. This project also introduced the Konnectivity project, which has seen growing adoption in production environments.
-->
現在，API 伺服器網路代理成爲 kube-apiserver 中 GA 級別的擴展點。
提供了一種通用代理機制，可以通過一個安全的代理將流量從 API 伺服器路由到節點，
從而使 API 伺服器無需瞭解其運行所在的特定雲驅動。
此項目還引入了 Konnectivity 項目，該項目在生產環境中的採用越來越多。

<!--
You can learn more about the API Server Network Proxy from its [README](https://github.com/kubernetes-sigs/apiserver-network-proxy#readme).
-->
你可以在其 [README](https://github.com/kubernetes-sigs/apiserver-network-proxy#readme)
中瞭解有關 API 伺服器網路代理的更多信息。

<!--
### Credential provider plugins for the kubelet

The Kubelet credential provider plugin was developed to replace the kubelet's built-in functionality for dynamically fetching credentials for image registries hosted on Google Cloud, AWS, or Azure.
The legacy capability was convenient as it allowed the kubelet to seamlessly retrieve short-lived tokens for pulling images from GCR, ECR, or ACR. However, like other areas of Kubernetes, supporting
this required the kubelet to have specific knowledge of different cloud environments and APIs.
-->
### kubelet 的憑據提供程序插件

kubelet 憑據提供程序插件的開發是爲了取代 kubelet 的內置功能，用於動態獲取用於託管在
Google Cloud、AWS 或 Azure 上的映像檔倉庫的憑據。
原來所實現的功能很方便，因爲它允許 kubelet 無縫地獲取短期令牌以從 GCR、ECR 或 ACR 拉取映像檔
然而，與 Kubernetes 的其他領域一樣，支持這一點需要 kubelet 具有不同雲環境和 API 的特定知識。

<!--
Introduced in 2019, the credential provider plugin mechanism offers a generic extension point for the kubelet to execute plugin binaries that dynamically provide credentials for images hosted on various clouds.
This extensibility expands the kubelet's capabilities to fetch short-lived tokens beyond the initial three cloud providers.
-->
憑據驅動插件機制於 2019 年推出，爲 kubelet 提供了一個通用擴展點用於執行插件的可執行文件，
進而爲訪問各種雲上託管的映像檔動態提供憑據。
可擴展性擴展了 kubelet 獲取短期令牌的能力，且不受限於最初的三個雲驅動。

<!--
To learn more, read [kubelet credential provider for authenticated image pulls](/docs/concepts/containers/images/#kubelet-credential-provider).
-->
要了解更多信息，請閱讀[用於認證映像檔拉取的 kubelet 憑據提供程序](/zh-cn/docs/concepts/containers/images/#kubelet-credential-provider)。

<!--
### Storage plugin migration from in-tree to CSI

The Container Storage Interface (CSI) is a control plane standard for managing block and file storage systems in Kubernetes and other container orchestrators that went GA in 1.13.
It was designed to replace the in-tree volume plugins built directly into Kubernetes with drivers that can run as Pods within the Kubernetes cluster.
These drivers communicate with kube-controller-manager storage controllers via the Kubernetes API, and with kubelet through a local gRPC endpoint.
Now there are over 100 CSI drivers available across all major cloud and storage vendors, making stateful workloads in Kubernetes a reality.
-->
### 存儲插件從樹內遷移到 CSI

容器存儲接口（Container Storage Interface，CSI）是一種控制平面標準，用於管理 Kubernetes
和其他容器編排系統中的塊和文件存儲系統，已在 1.13 中進入正式發佈狀態。
它的設計目標是用可在 Kubernetes 叢集中 Pod 內運行的驅動程序替換直接內置於 Kubernetes 中的樹內卷插件。
這些驅動程序通過 Kubernetes API 與 kube-controller-manager 存儲控制器通信，並通過本地 gRPC 端點與 kubelet 進行通信。
現在，所有主要雲和存儲供應商一起提供了 100 多個 CSI 驅動，使 Kubernetes 中運行有狀態工作負載成爲現實。

<!--
However, a major challenge remained on how to handle all the existing users of in-tree volume APIs. To retain API backwards compatibility,
we built an API translation layer into our controllers that will convert the in-tree volume API into the equivalent CSI API. This allowed us to redirect all storage operations to the CSI driver,
paving the way for us to remove the code for the built-in volume plugins without removing the API.
-->
然而，如何處理樹內卷 API 的所有現有使用者仍然是一個重大挑戰。
爲了保持 API 向後兼容性，我們在控制器中構建了一個 API 轉換層，把樹內卷 API 轉換爲等效的 CSI API。
這使我們能夠將所有存儲操作重定向到 CSI 驅動程序，爲我們在不刪除 API 的情況下刪除內置卷插件的代碼鋪平了道路。

<!--
You can learn more about In-tree Storage migration in [Kubernetes In-Tree to CSI Volume Migration Moves to Beta](https://kubernetes.io/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/).
-->
你可以在 [Kubernetes 樹內捲到 CSI 卷的遷移進入 Beta 階段](https://kubernetes.io/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/)。

<!--
## What's next?

This migration has been the primary focus for SIG Cloud Provider over the past few years. With this significant milestone achieved, we will be shifting our efforts towards exploring new
and innovative ways for Kubernetes to better integrate with cloud providers, leveraging the external subsystems we've built over the years. This includes making Kubernetes smarter in
hybrid environments where nodes in the cluster can run on both public and private clouds, as well as providing better tools and frameworks for developers of external providers to simplify and streamline their integration efforts.
-->
## 下一步是什麼？

過去幾年，這一遷移工程一直是 SIG Cloud Provider 的主要關注點。
隨着這一重要里程碑的實現，我們將把努力轉向探索新的創新方法，讓 Kubernetes 更好地與雲驅動集成，利用我們多年來構建的外部子系統。
這包括使 Kubernetes 在混合環境中變得更加智能，其叢集中的節點可以運行在公共雲和私有云上，
以及爲外部驅動的開發人員提供更好的工具和框架，以簡化他們的集成工作，提高效率。

<!--
With all the new features, tools, and frameworks being planned, SIG Cloud Provider is not forgetting about the other side of the equation: testing. Another area of focus for the SIG's future activities is the improvement of
cloud controller testing to include more providers. The ultimate goal of this effort being to create a testing framework that will include as many providers as possible so that we give the Kubernetes community the highest
levels of confidence about their Kubernetes environments.
-->
在規劃所有這些新特性、工具和框架的同時，SIG Cloud Provider 並沒有忘記另一項同樣重要的工作：測試。
SIG 未來活動的另一個重點領域是改進雲控制器測試以涵蓋更多的驅動。
這項工作的最終目標是創建一個包含儘可能多驅動的測試框架，以便我們讓 Kubernetes 社區對其 Kubernetes 環境充滿信心。

<!--
If you're using a version of Kubernetes older than v1.29 and haven't migrated to an external cloud provider yet, we recommend checking out our previous blog post [Kubernetes 1.29: Cloud Provider Integrations Are Now Separate Components](/blog/2023/12/14/cloud-provider-integration-changes/).
It provides detailed information on the changes we've made and offers guidance on how to migrate to an external provider.
Starting in v1.31, in-tree cloud providers will be permanently disabled and removed from core Kubernetes components.
-->
如果你使用的 Kubernetes 版本早於 v1.29 並且尚未遷移到外部雲驅動，我們建議你查閱我們之前的博客文章
[Kubernetes 1.29：雲驅動集成現在是單獨的組件](/zh-cn/blog/2023/12/14/cloud-provider-integration-changes/)。
該博客包含與我們所作的變更相關的詳細信息，並提供了有關如何遷移到外部驅動的指導。
從 v1.31 開始，樹內雲驅動將被永久禁用並從核心 Kubernetes 組件中刪除。

<!--
If you’re interested in contributing, come join our [bi-weekly SIG meetings](https://github.com/kubernetes/community/tree/master/sig-cloud-provider#meetings)!
-->
如果你有興趣做出貢獻，請參加我們的[每兩週一次的 SIG 會議](https://github.com/kubernetes/community/tree/master/sig-cloud-provider#meetings)!
