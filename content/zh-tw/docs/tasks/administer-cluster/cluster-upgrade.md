---
title: 升級叢集
content_type: task
---
<!-- 
---
title: Upgrade A Cluster
content_type: task
---
-->

<!-- overview -->
<!-- 
This page provides an overview of the steps you should follow to upgrade a
Kubernetes cluster.

The way that you upgrade a cluster depends on how you initially deployed it
and on any subsequent changes.

At a high level, the steps you perform are:
-->
本頁概述升級 Kubernetes 叢集的步驟。

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
{{< skew prevMinorVersion >}} to Kubernetes {{< skew latestVersion >}}. If your cluster
is not currently running Kubernetes {{< skew prevMinorVersion >}} then please check
the documentation for the version of Kubernetes that you plan to upgrade to.
-->
你必須有一個叢集。
本頁內容涉及從 Kubernetes {{< skew prevMinorVersion >}} 
升級到 Kubernetes {{< skew latestVersion >}}。
如果你的叢集未執行 Kubernetes {{< skew prevMinorVersion >}}，
那請參考目標 Kubernetes 版本的文件。

<!-- ## Upgrade approaches -->
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
那麼升級叢集的詳細資訊，請參閱
[升級 kubeadm 叢集](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)。

升級叢集之後，要記得
[安裝最新版本的 `kubectl`](/zh-cn/docs/tasks/tools/).

<!-- ### Manual deployments -->
### 手動部署 {#manual-deployments}

<!-- 
These steps do not account for third-party extensions such as network and storage
plugins.

You should manually update the control plane following this sequence:
-->
{{< caution >}}
這些步驟不考慮第三方擴充套件，例如網路和儲存外掛。
{{< /caution >}}

你應該跟隨下面操作順序，手動更新控制平面：

<!-- 
- etcd (all instances)
- kube-apiserver (all control plane hosts)
- kube-controller-manager
- kube-scheduler
- cloud controller manager, if you use one
-->
- etcd (所有例項)
- kube-apiserver (所有控制平面的宿主機)
- kube-controller-manager
- kube-scheduler
- cloud controller manager, 在你用到時

<!-- 
At this point you should
[install the latest version of `kubectl`](/docs/tasks/tools/).

For each node in your cluster, [drain](/docs/tasks/administer-cluster/safely-drain-node/)
that node and then either replace it with a new node that uses the {{< skew latestVersion >}}
kubelet, or upgrade the {{< skew latestVersion >}}
kubelet on that node and bring the node back into service.
-->
現在，你應該
[安裝最新版本的 `kubectl`](/zh-cn/docs/tasks/tools/).

對於叢集中的每個節點，
[排空](/zh-cn/docs/tasks/administer-cluster/safely-drain-node/)
節點，然後，或者用一個運行了 {{< skew latestVersion >}} kubelet 的新節點替換它；
或者升級此節點的 kubelet，並使節點恢復服務。

<!-- 
### Other deployments {#upgrade-other}

Refer to the documentation for your cluster deployment tool to learn the recommended set
up steps for maintenance.

## Post-upgrade tasks

### Switch your cluster's storage API version
-->
### 其他部署方式 {#upgrade-other}

參閱你的叢集部署工具對應的文件，瞭解用於維護的推薦設定步驟。

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
物件序列化到 etcd，是為了提供叢集中活動 Kubernetes 資源的內部表示法，
這些物件都使用特定版本的 API 編寫。

當底層的 API 更改時，這些物件可能需要用新 API 重寫。
如果不能做到這一點，會導致再也不能用 Kubernetes API 伺服器解碼、使用該物件。

對於每個受影響的物件，用最新支援的 API 獲取它，然後再用最新支援的 API 寫回來。

<!-- 
### Update manifests

Upgrading to a new Kubernetes version can provide new APIs.

You can use `kubectl convert` command to convert manifests between different API versions.
For example:
-->
### 更新清單 {#update-manifests}

升級到新版本 Kubernetes 就可以提供新的 API。

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
在新的清單檔案中，`kind` 被設定為 Pod（未變），
但 `apiVersion` 則被修訂了。
