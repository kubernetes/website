---
title: 升級 kubeadm 叢集
content_type: task
weight: 20
---
<!--
reviewers:
- sig-cluster-lifecycle
title: Upgrading kubeadm clusters
content_type: task
weight: 20
-->

<!-- overview -->

<!--
This page explains how to upgrade a Kubernetes cluster created with kubeadm from version
{{< skew currentVersionAddMinor -1 >}}.x to version {{< skew currentVersion >}}.x, and from version
{{< skew currentVersion >}}.x to {{< skew currentVersion >}}.y (where `y > x`). Skipping MINOR versions
when upgrading is unsupported. For more details, please visit [Version Skew Policy](https://kubernetes.io/releases/version-skew-policy/).
-->
本頁介紹如何將 `kubeadm` 建立的 Kubernetes 叢集從 {{< skew currentVersionAddMinor -1 >}}.x 版本
升級到 {{< skew currentVersion >}}.x 版本以及從 {{< skew currentVersion >}}.x
升級到 {{< skew currentVersion >}}.y（其中 `y > x`）。略過次版本號的升級是
不被支援的。更多詳情請訪問[版本傾斜政策](https://kubernetes.io/releases/version-skew-policy/)。

<!--
To see information about upgrading clusters created using older versions of kubeadm,
please refer to following pages instead:
-->
要檢視 kubeadm 建立的有關舊版本叢集升級的資訊，請參考以下頁面：

<!--
- [Upgrading a kubeadm cluster from {{< skew currentVersionAddMinor -2 >}} to {{< skew currentVersionAddMinor -1 >}}](https://v{{< skew currentVersionAddMinor -1 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Upgrading a kubeadm cluster from {{< skew currentVersionAddMinor -3 >}} to {{< skew currentVersionAddMinor -2 >}}](https://v{{< skew currentVersionAddMinor -2 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Upgrading a kubeadm cluster from {{< skew currentVersionAddMinor -4 >}} to {{< skew currentVersionAddMinor -3 >}}](https://v{{< skew currentVersionAddMinor -3 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Upgrading a kubeadm cluster from {{< skew currentVersionAddMinor -5 >}} to {{< skew currentVersionAddMinor -4 >}}](https://v{{< skew currentVersionAddMinor -4 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
-->
- [將 kubeadm 叢集從 {{< skew currentVersionAddMinor -2 >}} 升級到 {{< skew currentVersionAddMinor -1 >}}](https://v{{< skew currentVersionAddMinor -1 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [將 kubeadm 叢集從 {{< skew currentVersionAddMinor -3 >}} 升級到 {{< skew currentVersionAddMinor -2 >}}](https://v{{< skew currentVersionAddMinor -2 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [將 kubeadm 叢集從 {{< skew currentVersionAddMinor -4 >}} 升級到 {{< skew currentVersionAddMinor -3 >}}](https://v{{< skew currentVersionAddMinor -3 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [將 kubeadm 叢集從 {{< skew currentVersionAddMinor -5 >}} 升級到 {{< skew currentVersionAddMinor -4 >}}](https://v{{< skew currentVersionAddMinor -4 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)

<!--
The upgrade workflow at high level is the following:
-->
升級工作的基本流程如下：

<!--
1. Upgrade a primary control plane node.
1. Upgrade additional control plane nodes.
1. Upgrade worker nodes.
-->
1. 升級主控制平面節點
1. 升級其他控制平面節點
1. 升級工作節點

## {{% heading "prerequisites" %}}

<!--
- Make sure you read the [release notes](https://git.k8s.io/kubernetes/CHANGELOG) carefully.
- The cluster should use a static control plane and etcd pods or external etcd.
- Make sure to back up any important components, such as app-level state stored in a database.
  `kubeadm upgrade` does not touch your workloads, only components internal to Kubernetes, but backups are always a best practice.
- [Swap must be disabled](https://serverfault.com/questions/684771/best-way-to-disable-swap-in-linux).
-->
- 務必仔細認真閱讀[發行說明](https://git.k8s.io/kubernetes/CHANGELOG)。
- 叢集應使用靜態的控制平面和 etcd Pod 或者外部 etcd。
- 務必備份所有重要元件，例如儲存在資料庫中應用層面的狀態。
  `kubeadm upgrade` 不會影響你的工作負載，只會涉及 Kubernetes 內部的元件，但備份終究是好的。
- [必須禁用交換分割槽](https://serverfault.com/questions/684771/best-way-to-disable-swap-in-linux)。

<!--
### Additional information
-->
### 附加資訊   {#additional-information}

<!--
- The instructions below outline when to drain each node during the upgrade process.
If you are performing a **minor** version upgrade for any kubelet, you **must**
first drain the node (or nodes) that you are upgrading. In the case of control plane nodes,
they could be running CoreDNS Pods or other critical workloads. For more information see
[Draining nodes](/docs/tasks/administer-cluster/safely-drain-node/).
- All containers are restarted after upgrade, because the container spec hash value is changed.
-->
- 下述說明了在升級過程中何時騰空每個節點。如果你正在對任何 kubelet 進行小版本升級，
  你需要先騰空待升級的節點（或多個節點）。對於控制面節點，其上可能執行著 CoreDNS Pods
  或者其它非常重要的負載。更多資訊見[騰空節點](/zh-cn/docs/tasks/administer-cluster/safely-drain-node/)。
- 升級後，因為容器規約的雜湊值已更改，所有容器都會被重新啟動。

<!--
- To verify that the kubelet service has successfully restarted after the kubelet has been upgraded,
you can execute `systemctl status kubelet` or view the service logs with `journalctl -xeu kubelet`.
- Usage of the `--config` flag of `kubeadm upgrade` with
[kubeadm configuration API types](/docs/reference/config-api/kubeadm-config.v1beta3)
with the purpose of reconfiguring the cluster is not recommended and can have unexpected results. Follow the steps in
[Reconfiguring a kubeadm cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure) instead.
-->
- 要驗證 kubelet 服務在升級後是否成功重啟，可以執行 `systemctl status kubelet`
  或 `journalctl -xeu kubelet` 檢視服務日誌。
- 不建議使用 `kubeadm upgrade` 的 `--config` 引數和 [kubeadm 配置 API 型別](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta3)
  來重新配置叢集，這樣會產生意想不到的結果。請按照[重新配置 kubeadm 叢集](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure)
  中的步驟來進行。

<!-- steps -->

<!--
## Determine which version to upgrade to
-->
## 確定要升級到哪個版本   {#determine-which-version-to-upgrade-to}

<!--
Find the latest patch release for Kubernetes {{< skew currentVersion >}} using the OS package manager:
-->
使用作業系統的包管理器找到最新的補丁版本 Kubernetes {{< skew currentVersion >}}：

{{< tabs name="k8s_install_versions" >}}
{{% tab name="Ubuntu、Debian 或 HypriotOS" %}}
```shell
apt update
apt-cache madison kubeadm
# 在列表中查詢最新的 {{< skew currentVersion >}} 版本
# 它看起來應該是 {{< skew currentVersion >}}.x-00，其中 x 是最新的補丁版本
```
{{% /tab %}}
{{% tab name="CentOS、RHEL 或 Fedora" %}}
```shell
yum list --showduplicates kubeadm --disableexcludes=kubernetes
# 在列表中查詢最新的 {{< skew currentVersion >}} 版本
# 它看起來應該是 {{< skew currentVersion >}}.x-0，其中 x 是最新的補丁版本
```
{{% /tab %}}
{{< /tabs >}}

<!--
## Upgrading control plane nodes
-->
## 升級控制平面節點  {#upgrading-control-plane-nodes}

<!--
The upgrade procedure on control plane nodes should be executed one node at a time.
Pick a control plane node that you wish to upgrade first. It must have the `/etc/kubernetes/admin.conf` file.
-->
控制面節點上的升級過程應該每次處理一個節點。
首先選擇一個要先行升級的控制面節點。該節點上必須擁有
`/etc/kubernetes/admin.conf` 檔案。

<!--
### Call "kubeadm upgrade"
-->
### 執行 “kubeadm upgrade”   {#call-kubeadm-upgrade}

<!--
**For the first control plane node**
-->
**對於第一個控制面節點**

<!--
- Upgrade kubeadm:
-->
- 升級 kubeadm：

  {{< tabs name="k8s_install_kubeadm_first_cp" >}}
  {{% tab name="Ubuntu、Debian 或 HypriotOS" %}}
  ```shell
  # 用最新的補丁版本號替換 {{< skew currentVersion >}}.x-00 中的 x
  apt-mark unhold kubeadm && \
  apt-get update && apt-get install -y kubeadm={{< skew currentVersion >}}.x-00 && \
  apt-mark hold kubeadm
  ```
  {{% /tab %}}
  {{% tab name="CentOS、RHEL 或 Fedora" %}}
  ```shell
  # 用最新的補丁版本號替換 {{< skew currentVersion >}}.x-0 中的 x
  yum install -y kubeadm-{{< skew currentVersion >}}.x-0 --disableexcludes=kubernetes
  ```
  {{% /tab %}}
  {{< /tabs >}}
  <br />

<!--
- Verify that the download works and has the expected version:
-->
- 驗證下載操作正常，並且 kubeadm 版本正確：

  ```shell
  kubeadm version
  ```

<!--
- Verify the upgrade plan:
-->
- 驗證升級計劃：

  ```shell
  kubeadm upgrade plan
  ```

  <!--
  This command checks that your cluster can be upgraded, and fetches the versions you can upgrade to.
  It also shows a table with the component config version states.
  -->
  此命令檢查你的叢集是否可被升級，並取回你要升級的目標版本。
  命令也會顯示一個包含元件配置版本狀態的表格。

  {{< note >}}
  <!--
  `kubeadm upgrade` also automatically renews the certificates that it manages on this node.
  To opt-out of certificate renewal the flag `--certificate-renewal=false` can be used.
  For more information see the [certificate management guide](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs).
  -->
  `kubeadm upgrade` 也會自動對 kubeadm 在節點上所管理的證書執行續約操作。
  如果需要略過證書續約操作，可以使用標誌 `--certificate-renewal=false`。
  更多的資訊，可參閱[證書管理指南](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs)。
  {{</ note >}}

  {{< note >}}
  <!--
  If `kubeadm upgrade plan` shows any component configs that require manual upgrade, users must provide
  a config file with replacement configs to `kubeadm upgrade apply` via the `--config` command line flag.
  Failing to do so will cause `kubeadm upgrade apply` to exit with an error and not perform an upgrade.
  -->
  如果 `kubeadm upgrade plan` 給出任何需要手動升級的元件配置，使用者必須
  透過 `--config` 命令列標誌向 `kubeadm upgrade apply` 命令提供替代的配置檔案。
  如果不這樣做，`kubeadm upgrade apply` 會出錯並退出，不再執行升級操作。
  {{</ note >}}

<!--
- Choose a version to upgrade to, and run the appropriate command. For example:
-->
- 選擇要升級到的目標版本，執行合適的命令。例如：

  <!--
  ```shell
  # replace x with the patch version you picked for this upgrade
  sudo kubeadm upgrade apply v{{< skew currentVersion >}}.x
  ```
  -->
  ```shell
  # 將 x 替換為你為此次升級所選擇的補丁版本號
  sudo kubeadm upgrade apply v{{< skew currentVersion >}}.x
  ```

  <!--
  Once the command finishes you should see:
  -->
  一旦該命令結束，你應該會看到：

  ```console
  [upgrade/successful] SUCCESS! Your cluster was upgraded to "v{{< skew currentVersion >}}.x". Enjoy!

  [upgrade/kubelet] Now that your control plane is upgraded, please proceed with upgrading your kubelets if you haven't already done so.
  ```

<!--
- Manually upgrade your CNI provider plugin.
-->
- 手動升級你的 CNI 驅動外掛。

  <!--
  Your Container Network Interface (CNI) provider may have its own upgrade instructions to follow.
  Check the [addons](/docs/concepts/cluster-administration/addons/) page to
  find your CNI provider and see whether additional upgrade steps are required.
  -->
  你的容器網路介面（CNI）驅動應該提供了程式自身的升級說明。
  參閱[外掛](/zh-cn/docs/concepts/cluster-administration/addons/)頁面查詢你的 CNI 驅動，
  並檢視是否需要其他升級步驟。

  <!--
  This step is not required on additional control plane nodes if the CNI provider runs as a DaemonSet.
  -->
  如果 CNI 驅動作為 DaemonSet 執行，則在其他控制平面節點上不需要此步驟。

<!--
**For the other control plane nodes**
-->
**對於其它控制面節點**

<!--
Same as the first control plane node but use:
-->
與第一個控制面節點相同，但是使用：

```shell
sudo kubeadm upgrade node
```

<!--
instead of:
-->
而不是：

```shell
sudo kubeadm upgrade apply
```

<!--
Also calling `kubeadm upgrade plan` and upgrading the CNI provider plugin is no longer needed.
-->
此外，不需要執行 `kubeadm upgrade plan` 和更新 CNI 驅動外掛的操作。

<!--
### Drain the node
-->
### 騰空節點   {#drain-the-node}

<!--
- Prepare the node for maintenance by marking it unschedulable and evicting the workloads:
-->
- 透過將節點標記為不可排程並騰空節點為節點作升級準備：

  <!--
  ```shell
  # replace <node-to-drain> with the name of your node you are draining
  kubectl drain <node-to-drain> --ignore-daemonsets
  ```
  -->
  ```shell
  # 將 <node-to-drain> 替換為你要騰空的控制面節點名稱
  kubectl drain <node-to-drain> --ignore-daemonsets
  ```

<!--
### Upgrade kubelet and kubectl
-->
### 升級 kubelet 和 kubectl   {#upgrade-kubelet-and-kubectl}

<!--
- Upgrade the kubelet and kubectl:
-->
- 升級 kubelet 和 kubectl：

  {{< tabs name="k8s_install_kubelet" >}}
  {{% tab name="Ubuntu、Debian 或 HypriotOS" %}}
  ```shell
  # 用最新的補丁版本替換 {{< skew currentVersion >}}.x-00 中的 x
  apt-mark unhold kubelet kubectl && \
  apt-get update && apt-get install -y kubelet={{< skew currentVersion >}}.x-00 kubectl={{< skew currentVersion >}}.x-00 && \
  apt-mark hold kubelet kubectl
  ```
  {{% /tab %}}
  {{% tab name="CentOS、RHEL 或 Fedora" %}}
  ```shell
  # 用最新的補丁版本號替換 {{< skew currentVersion >}}.x-00 中的 x
  yum install -y kubelet-{{< skew currentVersion >}}.x-0 kubectl-{{< skew currentVersion >}}.x-0 --disableexcludes=kubernetes
  ```
  {{% /tab %}}
  {{< /tabs >}}
  <br />

<!--
- Restart the kubelet:
-->
- 重啟 kubelet：

  ```shell
  sudo systemctl daemon-reload
  sudo systemctl restart kubelet
  ```

<!--
### Uncordon the node
-->
### 解除節點的保護   {#uncordon-the-node}

<!--
- Bring the node back online by marking it schedulable:
-->
- 透過將節點標記為可排程，讓其重新上線：

  <!--
  ```shell
  # replace <node-to-drain> with the name of your node
  kubectl uncordon <node-to-drain>
  ```
  -->
  ```shell
  # 將 <node-to-drain> 替換為你的節點名稱
  kubectl uncordon <node-to-drain>
  ```

<!--
## Upgrade worker nodes
-->
## 升級工作節點   {#upgrade-worker-nodes}

<!--
The upgrade procedure on worker nodes should be executed one node at a time or few nodes at a time,
without compromising the minimum required capacity for running your workloads.
-->
工作節點上的升級過程應該一次執行一個節點，或者一次執行幾個節點，
以不影響執行工作負載所需的最小容量。

<!--
### Upgrade kubeadm
-->
### 升級 kubeadm   {#upgrade-kubeadm}

<!--
- Upgrade kubeadm:
-->
- 升級 kubeadm：

  {{< tabs name="k8s_install_kubeadm_worker_nodes" >}}
  {{% tab name="Ubuntu、Debian 或 HypriotOS" %}}
  ```shell
  # 將 {{< skew currentVersion >}}.x-00 中的 x 替換為最新的補丁版本號
  apt-mark unhold kubeadm && \
  apt-get update && apt-get install -y kubeadm={{< skew currentVersion >}}.x-00 && \
  apt-mark hold kubeadm
  ```
  {{% /tab %}}
  {{% tab name="CentOS、RHEL 或 Fedora" %}}
  ```shell
  # 用最新的補丁版本替換 {{< skew currentVersion >}}.x-00 中的 x
  yum install -y kubeadm-{{< skew currentVersion >}}.x-0 --disableexcludes=kubernetes
  ```
  {{% /tab %}}
  {{< /tabs >}}

<!--
### Call "kubeadm upgrade"
-->
### 執行 "kubeadm upgrade"   {#call-kubeadm-upgrade-1}

<!--
- For worker nodes this upgrades the local kubelet configuration:
-->
- 對於工作節點，下面的命令會升級本地的 kubelet 配置：

  ```shell
  sudo kubeadm upgrade node
  ```

<!--
### Drain the node
-->
### 騰空節點   {#drain-the-node-1}

<!--
- Prepare the node for maintenance by marking it unschedulable and evicting the workloads:
-->
- 將節點標記為不可排程並驅逐所有負載，準備節點的維護：

  <!--
  ```shell
  # replace <node-to-drain> with the name of your node you are draining
  kubectl drain <node-to-drain> --ignore-daemonsets
  ```
  -->
  ```shell
  # 將 <node-to-drain> 替換為你正在騰空的節點的名稱
  kubectl drain <node-to-drain> --ignore-daemonsets
  ```

<!--
### Upgrade kubelet and kubectl
-->
### 升級 kubelet 和 kubectl   {#upgrade-kubelet-and-kubectl-1}

<!--
- Upgrade the kubelet and kubectl:
-->
- 升級 kubelet 和 kubectl：

  {{< tabs name="k8s_kubelet_and_kubectl" >}}
  {{% tab name="Ubuntu、Debian 或 HypriotOS" %}}

  ```shell
  # 將 {{< skew currentVersion >}}.x-00 中的 x 替換為最新的補丁版本
  apt-mark unhold kubelet kubectl && \
  apt-get update && apt-get install -y kubelet={{< skew currentVersion >}}.x-00 kubectl={{< skew currentVersion >}}.x-00 && \
  apt-mark hold kubelet kubectl
  ```

  {{% /tab %}}
  {{% tab name="CentOS, RHEL or Fedora" %}}

  ```shell
  # 將 {{< skew currentVersion >}}.x-0 x 替換為最新的補丁版本
  yum install -y kubelet-{{< skew currentVersion >}}.x-0 kubectl-{{< skew currentVersion >}}.x-0 --disableexcludes=kubernetes
  ```

  {{% /tab %}}
  {{< /tabs >}}
  <br />

<!--
- Restart the kubelet:
-->
- 重啟 kubelet：

  ```shell
  sudo systemctl daemon-reload
  sudo systemctl restart kubelet
  ```

<!--
### Uncordon the node
-->
### 取消對節點的保護   {#uncordon-the-node-1}

<!--
- Bring the node back online by marking it schedulable:
-->
- 透過將節點標記為可排程，讓節點重新上線:

  <!--
  ```shell
  # replace <node-to-drain> with the name of your node
  kubectl uncordon <node-to-drain>
  ```
  -->
  ```shell
  # 將 <node-to-drain> 替換為當前節點的名稱
  kubectl uncordon <node-to-drain>
  ```

<!--
## Verify the status of the cluster
-->
## 驗證叢集的狀態   {#verify-the-status-of-the-cluster}

<!--
After the kubelet is upgraded on all nodes verify that all nodes are available again by running
the following command from anywhere kubectl can access the cluster:
-->
在所有節點上升級 kubelet 後，透過從 kubectl 可以訪問叢集的任何位置執行以下命令，
驗證所有節點是否再次可用：

```shell
kubectl get nodes
```

<!--
The `STATUS` column should show `Ready` for all your nodes, and the version number should be updated.
-->
`STATUS` 應顯示所有節點為 `Ready` 狀態，並且版本號已經被更新。

<!--
## Recovering from a failure state
-->
## 從故障狀態恢復   {#recovering-from-a-failure-state}

<!--
If `kubeadm upgrade` fails and does not roll back, for example because of an unexpected shutdown during execution, you can run `kubeadm upgrade` again.
This command is idempotent and eventually makes sure that the actual state is the desired state you declare.
-->
如果 `kubeadm upgrade` 失敗並且沒有回滾，例如由於執行期間節點意外關閉，
你可以再次執行 `kubeadm upgrade`。
此命令是冪等的，並最終確保實際狀態是你宣告的期望狀態。

<!--
To recover from a bad state, you can also run `kubeadm upgrade apply --force` without changing the version that your cluster is running.
-->
要從故障狀態恢復，你還可以執行 `kubeadm upgrade apply --force` 而無需更改叢集正在執行的版本。

<!--
During upgrade kubeadm writes the following backup folders under `/etc/kubernetes/tmp`:
-->
在升級期間，kubeadm 向 `/etc/kubernetes/tmp` 目錄下的如下備份資料夾寫入資料：

- `kubeadm-backup-etcd-<date>-<time>`
- `kubeadm-backup-manifests-<date>-<time>`

<!--
`kubeadm-backup-etcd` contains a backup of the local etcd member data for this control plane Node.
In case of an etcd upgrade failure and if the automatic rollback does not work, the contents of this folder
can be manually restored in `/var/lib/etcd`. In case external etcd is used this backup folder will be empty.
-->
`kubeadm-backup-etcd` 包含當前控制面節點本地 etcd 成員資料的備份。
如果 etcd 升級失敗並且自動回滾也無法修復，則可以將此資料夾中的內容複製到
`/var/lib/etcd` 進行手工修復。如果使用的是外部的 etcd，則此備份資料夾為空。

<!--
`kubeadm-backup-manifests` contains a backup of the static Pod manifest files for this control plane Node.
In case of a upgrade failure and if the automatic rollback does not work, the contents of this folder can be
manually restored in `/etc/kubernetes/manifests`. If for some reason there is no difference between a pre-upgrade
and post-upgrade manifest file for a certain component, a backup file for it will not be written.
-->
`kubeadm-backup-manifests` 包含當前控制面節點的靜態 Pod 清單檔案的備份版本。
如果升級失敗並且無法自動回滾，則此資料夾中的內容可以複製到
`/etc/kubernetes/manifests` 目錄實現手工恢復。
如果由於某些原因，在升級前後某個元件的清單未發生變化，則 kubeadm 也不會為之
生成備份版本。

<!--
## How it works
-->
## 工作原理   {#how-it-works}

<!--
`kubeadm upgrade apply` does the following:
-->
`kubeadm upgrade apply` 做了以下工作：

<!--
- Checks that your cluster is in an upgradeable state:
  - The API server is reachable
  - All nodes are in the `Ready` state
  - The control plane is healthy
- Enforces the version skew policies.
- Makes sure the control plane images are available or available to pull to the machine.
- Generates replacements and/or uses user supplied overwrites if component configs require version upgrades.
- Upgrades the control plane components or rollbacks if any of them fails to come up.
- Applies the new `CoreDNS` and `kube-proxy` manifests and makes sure that all necessary RBAC rules are created.
- Creates new certificate and key files of the API server and backs up old files if they're about to expire in 180 days.
-->
- 檢查你的叢集是否處於可升級狀態:
  - API 伺服器是可訪問的
  - 所有節點處於 `Ready` 狀態
  - 控制面是健康的
- 強制執行版本偏差策略。
- 確保控制面的映象是可用的或可拉取到伺服器上。
- 如果元件配置要求版本升級，則生成替代配置與/或使用使用者提供的覆蓋版本配置。
- 升級控制面元件或回滾（如果其中任何一個元件無法啟動）。
- 應用新的 `CoreDNS` 和 `kube-proxy` 清單，並強制建立所有必需的 RBAC 規則。
- 如果舊檔案在 180 天后過期，將建立 API 伺服器的新證書和金鑰檔案並備份舊檔案。

<!--
`kubeadm upgrade node` does the following on additional control plane nodes:
-->
`kubeadm upgrade node` 在其他控制平節點上執行以下操作：

<!--
- Fetches the kubeadm `ClusterConfiguration` from the cluster.
- Optionally backups the kube-apiserver certificate.
- Upgrades the static Pod manifests for the control plane components.
- Upgrades the kubelet configuration for this node.
-->
- 從叢集中獲取 kubeadm `ClusterConfiguration`。
- （可選操作）備份 kube-apiserver 證書。
- 升級控制平面元件的靜態 Pod 清單。
- 為本節點升級 kubelet 配置

<!--
`kubeadm upgrade node` does the following on worker nodes:
-->
`kubeadm upgrade node` 在工作節點上完成以下工作：

<!--
- Fetches the kubeadm `ClusterConfiguration` from the cluster.
- Upgrades the kubelet configuration for this node.
-->
- 從叢集取回 kubeadm `ClusterConfiguration`。
- 為本節點升級 kubelet 配置。
