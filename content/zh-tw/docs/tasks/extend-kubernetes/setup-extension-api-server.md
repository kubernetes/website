---
title: 安裝一個擴展的 API server
content_type: task
weight: 15
---

<!--
title: Setup an extension API server
reviewers:
- lavalamp
- cheftako
- chenopis
content_type: task
weight: 15
-->

<!-- overview -->

<!--
Setting up an extension API server to work the aggregation layer allows the Kubernetes apiserver to be extended with additional APIs, which are not part of the core Kubernetes APIs.
-->
安裝擴展的 API 伺服器來使用聚合層以讓 Kubernetes API 伺服器使用
其它 API 進行擴展，
這些 API 不是核心 Kubernetes API 的一部分。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
* You must [configure the aggregation layer](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/) and enable the apiserver flags.
-->
* 你必須[設定聚合層](/zh-cn/docs/tasks/extend-kubernetes/configure-aggregation-layer/)
  並且啓用 API 伺服器的相關參數。

<!-- steps -->

<!--
## Set up an extension api-server to work with the aggregation layer

The following steps describe how to set up an extension-apiserver *at a high level*. These steps apply regardless if you're using YAML configs or using APIs. An attempt is made to specifically identify any differences between the two. For a concrete example of how they can be implemented using YAML configs, you can look at the [sample-apiserver](https://github.com/kubernetes/sample-apiserver/blob/master/README.md) in the Kubernetes repo.

Alternatively, you can use an existing 3rd party solution, such as [apiserver-builder](https://github.com/Kubernetes-incubator/apiserver-builder/blob/master/README.md), which should generate a skeleton and automate all of the following steps for you.
-->
## 安裝一個擴展的 API 伺服器來使用聚合層

以下步驟描述如何 *在一個高層次* 設置一個擴展的 apiserver。無論你使用的是 YAML 設定還是使用 API，這些步驟都適用。
目前我們正在嘗試區分出兩者的區別。有關使用 YAML 設定的具體示例，你可以在 Kubernetes 庫中查看
[sample-apiserver](https://github.com/kubernetes/sample-apiserver/blob/master/README.md)。

或者，你可以使用現有的第三方解決方案，例如
[apiserver-builder](https://github.com/Kubernetes-incubator/apiserver-builder/blob/master/README.md)，
它將生成框架並自動執行以下所有步驟。

<!--
1. Make sure the APIService API is enabled (check `-runtime-config`). It should be on by default, unless it's been deliberately turned off in your cluster.
1. You may need to make an RBAC rule allowing you to add APIService objects, or get your cluster administrator to make one. (Since API extensions affect the entire cluster, it is not recommended to do testing/development/debug of an API extension in a live cluster.)
1. Create the Kubernetes namespace you want to run your extension api-service in.
1. Create/get a CA cert to be used to sign the server cert the extension api-server uses for HTTPS.
1. Create a server cert/key for the api-server to use for HTTPS. This cert should be signed by the above CA. It should also have a CN of the Kube DNS name. This is derived from the Kubernetes service and be of the form `<service name>.<service name namespace>.svc`
1. Create a Kubernetes secret with the server cert/key in your namespace.
1. Create a Kubernetes deployment for the extension api-server and make sure you are loading the secret as a volume. It should contain a reference to a working image of your extension api-server. The deployment should also be in your namespace.
-->
1. 確保啓用了 APIService API（檢查 `--runtime-config`）。默認應該是啓用的，除非被特意關閉了。
2. 你可能需要制定一個 RBAC 規則，以允許你添加 APIService 對象，或讓你的叢集管理員創建一個。
  （由於 API 擴展會影響整個叢集，因此不建議在實時叢集中對 API 擴展進行測試/開發/調試）
3. 創建 Kubernetes 命名空間，擴展的 api-service 將運行在該命名空間中。
4. 創建（或獲取）用來簽署伺服器證書的 CA 證書，擴展 api-server 中將使用該證書做 HTTPS 連接。
5. 爲 api-server 創建一個服務端的證書（或祕鑰）以使用 HTTPS。這個證書應該由上述的 CA 簽署。
   同時應該還要有一個 Kube DNS 名稱的 CN，這是從 Kubernetes 服務派生而來的，
   格式爲 `<service name>.<service name namespace>.svc`。
6. 使用命名空間中的證書（或祕鑰）創建一個 Kubernetes secret。
7. 爲擴展 api-server 創建一個 Kubernetes Deployment，並確保以卷的方式掛載了 Secret。
   它應該包含對擴展 api-server 映像檔的引用。Deployment 也應該在同一個命名空間中。

<!--
1. Make sure that your extension-apiserver loads those certs from that volume and that they are used in the HTTPS handshake.
1. Create a Kubernetes service account in your namespace.
1. Create a Kubernetes cluster role for the operations you want to allow on your resources.
1. Create a Kubernetes cluster role binding from the service account in your namespace to the cluster role you created.
1. Create a Kubernetes cluster role binding from the service account in your namespace to the `system:auth-delegator` cluster role to delegate auth decisions to the Kubernetes core API server.
1. Create a Kubernetes role binding from the service account in your namespace to the `extension-apiserver-authentication-reader` role. This allows your extension api-server to access the `extension-apiserver-authentication` configmap.
-->
8.  確保你的擴展 apiserver 從該卷中加載了那些證書，並在 HTTPS 握手過程中使用它們。
9.  在你的命名空間中創建一個 Kubernetes 服務賬號。
10. 爲資源允許的操作創建 Kubernetes 叢集角色。
11. 用你命名空間中的服務賬號創建一個 Kubernetes 叢集角色綁定，綁定到你創建的角色上。
12. 用你命名空間中的服務賬號創建一個 Kubernetes 叢集角色綁定，綁定到 `system:auth-delegator`
    叢集角色，以將 auth 決策委派給 Kubernetes 核心 API 伺服器。
13. 以你命名空間中的服務賬號創建一個 Kubernetes 叢集角色綁定，綁定到
    `extension-apiserver-authentication-reader` 角色。
    這將讓你的擴展 api-server 能夠訪問 `extension-apiserver-authentication` configmap。

<!--
1. Create a Kubernetes apiservice. The CA cert above should be base64 encoded, stripped of new lines and used as the spec.caBundle in the apiservice. This should not be namespaced. If using the [kube-aggregator API](https://github.com/kubernetes/kube-aggregator/), only pass in the PEM encoded CA bundle because the base 64 encoding is done for you.
1. Use kubectl to get your resource. When run, kubectl should return "No resources found.". This message indicates that everything worked but you currently have no objects of that resource type created.
-->
14. 創建一個 Kubernetes apiservice。
    上述的 CA 證書應該使用 base64 編碼，剝離新行並用作 apiservice 中的 spec.caBundle。
    該資源不應放到任何名字空間。如果使用了
    [kube-aggregator API](https://github.com/kubernetes/kube-aggregator/)，那麼只需要傳入
    PEM 編碼的 CA 綁定，因爲 base 64 編碼已經完成了。
15. 使用 kubectl 來獲得你的資源。
    它應該返回 "找不到資源"。此消息表示一切正常，但你目前還沒有創建該資源類型的對象。

## {{% heading "whatsnext" %}}

<!--
* If you haven't already, [configure the aggregation layer](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/) and enable the apiserver flags.
* For a high level overview, see [Extending the Kubernetes API with the aggregation layer](/docs/concepts/api-extension/apiserver-aggregation).
* Learn how to [Extend the Kubernetes API Using Custom Resource Definitions](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/).
-->
* 如果你還未設定，請[設定聚合層](/zh-cn/docs/tasks/extend-kubernetes/configure-aggregation-layer/)
  並啓用 apiserver 的相關參數。
* 高級概述，請參閱[使用聚合層擴展 Kubernetes API](/zh-cn/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation)。
* 瞭解如何[使用 Custom Resource Definition 擴展 Kubernetes API](/zh-cn/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)。
