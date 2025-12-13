---
title: 升級叢集
content_type: task
weight: 350
---
<!--
title: Upgrade A Cluster
content_type: task
weight: 350
-->

<!-- overview -->
<!--
This page provides an overview of the steps you should follow to upgrade a
Kubernetes cluster.

The Kubernetes project recommends upgrading to the latest patch releases promptly, and
to ensure that you are running a supported minor release of Kubernetes.
Following this recommendation helps you to stay secure.

The way that you upgrade a cluster depends on how you initially deployed it
and on any subsequent changes.

At a high level, the steps you perform are:
-->
本頁概述升級 Kubernetes 叢集的步驟。

Kubernetes 項目建議及時升級到最新的補丁版本，並確保使用受支持的 Kubernetes 版本。
遵循這一建議有助於保障安全。

升級叢集的方式取決於你最初部署它的方式、以及後續更改它的方式。

從高層規劃的角度看，要執行的步驟是：

<!--
- Upgrade the {{< glossary_tooltip text="control plane" term_id="control-plane" >}}
- Upgrade the nodes in your cluster
- Upgrade clients such as {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}
- Adjust manifests and other resources based on the API changes that accompany the
  new Kubernetes version
-->
- 升級{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}
- 升級叢集中的節點
- 升級 {{< glossary_tooltip text="kubectl" term_id="kubectl" >}} 之類的客戶端
- 根據新 Kubernetes 版本帶來的 API 變化，調整清單檔案和其他資源

## {{% heading "prerequisites" %}}

<!--
You must have an existing cluster. This page is about upgrading from Kubernetes
{{< skew currentVersionAddMinor -1 >}} to Kubernetes {{< skew currentVersion >}}. If your cluster
is not currently running Kubernetes {{< skew currentVersionAddMinor -1 >}} then please check
the documentation for the version of Kubernetes that you plan to upgrade to.
-->
你必須有一個叢集。
本頁內容涉及從 Kubernetes {{< skew currentVersionAddMinor -1 >}}
升級到 Kubernetes {{< skew currentVersion >}}。
如果你的叢集未運行 Kubernetes {{< skew currentVersionAddMinor -1 >}}，
那請參考目標 Kubernetes 版本的文檔。

<!--
## Upgrade approaches
-->
## 升級方法 {#upgrade-approaches}

### kubeadm {#upgrade-kubeadm}

<!--
If your cluster was deployed using the `kubeadm` tool, refer to 
[Upgrading kubeadm clusters](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
for detailed information on how to upgrade the cluster.

Once you have upgraded the cluster, remember to
[install the latest version of `kubectl`](/docs/tasks/tools/).
-->
如果你的叢集是使用 `kubeadm` 安裝工具部署而來，
那麼升級叢集的詳細資訊，請參閱[升級 kubeadm 叢集](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)。

升級叢集之後，要記得[安裝最新版本的 `kubectl`](/zh-cn/docs/tasks/tools/)。

<!--
### Manual deployments
-->
### 手動部署 {#manual-deployments}

{{< caution >}}
<!--
These steps do not account for third-party extensions such as network and storage
plugins.
-->
這些步驟不考慮網路和儲存插件等第三方擴展。
{{< /caution >}}

<!--
You should manually update the control plane following this sequence:

- etcd (all instances)
- kube-apiserver (all control plane hosts)
- kube-controller-manager
- kube-scheduler
- cloud controller manager, if you use one
-->
你應該按照下面的操作順序，手動更新控制平面：

- etcd (所有實例)
- kube-apiserver (所有控制平面的宿主機)
- kube-controller-manager
- kube-scheduler
- cloud controller manager (在你用到時)

<!--
At this point you should
[install the latest version of `kubectl`](/docs/tasks/tools/).

For each node in your cluster, [drain](/docs/tasks/administer-cluster/safely-drain-node/)
that node and then either replace it with a new node that uses the {{< skew currentVersion >}}
kubelet, or upgrade the kubelet on that node and bring the node back into service.
-->
現在，你應該[安裝最新版本的 `kubectl`](/zh-cn/docs/tasks/tools/)。

對於叢集中的每個節點，
首先需要[騰空](/zh-cn/docs/tasks/administer-cluster/safely-drain-node/)節點，
然後使用一個運行了 kubelet {{< skew currentVersion >}} 版本的新節點替換它；
或者升級此節點的 kubelet，並使節點恢復服務。

{{< caution >}}
<!--
Draining nodes before upgrading kubelet ensures that pods are re-admitted and containers are
re-created, which may be necessary to resolve some security issues or other important bugs.
-->
在升級 kubelet 之前先進行節點排空，這樣可以確保 Pod 被重新准入並且容器被重新創建。
這一步驟對於解決某些安全問題或其他關鍵錯誤是非常必要的。
{{</ caution >}}

<!--
### Other deployments {#upgrade-other}

Refer to the documentation for your cluster deployment tool to learn the recommended set
up steps for maintenance.

## Post-upgrade tasks

### Switch your cluster's storage API version
-->
### 其他部署方式 {#upgrade-other}

參閱你的叢集部署工具對應的文檔，瞭解用於維護的推薦設置步驟。

## 升級後的任務 {#post-upgrade-tasks}

### 切換叢集的儲存 API 版本 {#switch-your-clusters-storage-api-version}

<!--
The objects that are serialized into etcd for a cluster's internal
representation of the Kubernetes resources active in the cluster are
written using a particular version of the API.

When the supported API changes, these objects may need to be rewritten
in the newer API. Failure to do this will eventually result in resources
that are no longer decodable or usable by the Kubernetes API server.

For each affected object, fetch it using the latest supported API and then
write it back also using the latest supported API.
-->
對象序列化到 etcd，是爲了提供叢集中活動 Kubernetes 資源的內部表示法，
這些對象都使用特定版本的 API 編寫。

當底層的 API 更改時，這些對象可能需要用新 API 重寫。
如果不能做到這一點，會導致再也不能用 Kubernetes API 伺服器解碼、使用該對象。

對於每個受影響的對象，請使用最新支持的 API 讀取它，然後使用所支持的最新 API 將其寫回。

<!--
### Update manifests

Upgrading to a new Kubernetes version can provide new APIs.

You can use `kubectl convert` command to convert manifests between different API versions.
For example:
-->
### 更新清單 {#update-manifests}

升級到新版本 Kubernetes 就可以獲取到新的 API。

你可以使用 `kubectl convert` 命令在不同 API 版本之間轉換清單。
例如：

```shell
kubectl convert -f pod.yaml --output-version v1
```

<!--
The `kubectl` tool replaces the contents of `pod.yaml` with a manifest that sets `kind` to
Pod (unchanged), but with a revised `apiVersion`.
-->
`kubectl` 替換了 `pod.yaml` 的內容，
在新的清單檔案中，`kind` 被設置爲 Pod（未變），
但 `apiVersion` 則被修訂了。

<!--
### Device Plugins

If your cluster is running device plugins and the node needs to be upgraded to a Kubernetes
release with a newer device plugin API version, device plugins must be upgraded to support
both version before the node is upgraded in order to guarantee that device allocations
continue to complete successfully during the upgrade.

Refer to [API compatibility](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#api-compatibility) and [Kubelet Device Manager API Versions](/docs/reference/node/device-plugin-api-versions/) for more details.
-->
### 設備插件   {#device-plugins}

如果你的叢集正在運行設備插件（Device Plugin）並且節點需要升級到具有更新的設備插件（Device Plugin）
API 版本的 Kubernetes 版本，則必須在升級節點之前升級設備插件以同時支持這兩個插件 API 版本，
以確保升級過程中設備分配能夠繼續成功完成。

有關詳細資訊，請參閱
[API 兼容性](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#api-compatibility)和
[kubelet 設備管理器 API 版本](/zh-cn/docs/reference/node/device-plugin-api-versions/)。
