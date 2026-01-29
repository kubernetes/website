---
title: 升級 kubeadm 叢集
content_type: task
weight: 30
---
<!--
reviewers:
- sig-cluster-lifecycle
title: Upgrading kubeadm clusters
content_type: task
weight: 30
-->

<!-- overview -->

<!--
This page explains how to upgrade a Kubernetes cluster created with kubeadm from version
{{< skew currentVersionAddMinor -1 >}}.x to version {{< skew currentVersion >}}.x, and from version
{{< skew currentVersion >}}.x to {{< skew currentVersion >}}.y (where `y > x`). Skipping MINOR versions
when upgrading is unsupported. For more details, please visit [Version Skew Policy](/releases/version-skew-policy/).
-->
本頁介紹如何將 `kubeadm` 創建的 Kubernetes 叢集從 {{< skew currentVersionAddMinor -1 >}}.x 版本
升級到 {{< skew currentVersion >}}.x 版本以及從 {{< skew currentVersion >}}.x
升級到 {{< skew currentVersion >}}.y（其中 `y > x`）。略過次版本號的升級是
不被支持的。更多詳情請訪問[版本偏差策略](/zh-cn/releases/version-skew-policy/)。

<!--
To see information about upgrading clusters created using older versions of kubeadm,
please refer to following pages instead:
-->
要查看 kubeadm 創建的有關舊版本叢集升級的資訊，請參考以下頁面：

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
The Kubernetes project recommends upgrading to the latest patch releases promptly, and
to ensure that you are running a supported minor release of Kubernetes.
Following this recommendation helps you to stay secure.
-->
Kubernetes 項目建議立即升級到最新的補丁版本，並確保你運行的是受支持的 Kubernetes 次要版本。
遵循此建議可幫助你保持安全。

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
- 務必備份所有重要組件，例如儲存在資料庫中應用層面的狀態。
  `kubeadm upgrade` 不會影響你的工作負載，只會涉及 Kubernetes 內部的組件，但備份終究是好的。
- [必須禁用交換分區](https://serverfault.com/questions/684771/best-way-to-disable-swap-in-linux)。

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
- The Kubernetes project recommends that you match your kubelet and kubeadm versions.
  You can instead use a version of kubelet that is older than kubeadm, provided it is within the
  range of supported versions.
  For more details, please visit [kubeadm's skew against the kubelet](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#kubeadm-s-skew-against-the-kubelet).
- All containers are restarted after upgrade, because the container spec hash value is changed.
-->
- 下述說明了在升級過程中何時騰空每個節點。如果你正在對任何 kubelet 進行小版本升級，
  你需要先騰空待升級的節點（或多個節點）。對於控制平面節點，其上可能運行着 CoreDNS Pod
  或者其他非常重要的負載。更多資訊見[騰空節點](/zh-cn/docs/tasks/administer-cluster/safely-drain-node/)。
- Kubernetes 項目推薦你使用版本匹配的 kubelet 和 kubeadm。
  但你也可以使用比 kubeadm 版本更低的 kubelet 版本，前提是該版本仍處於支持的版本範圍內。
  欲瞭解更多資訊，請訪問 [kubeadm 與 kubelet 的版本差異](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#kubeadm-s-skew-against-the-kubelet)。
- 升級後，因爲容器規約的哈希值已更改，所有容器都會被重新啓動。

<!--
- To verify that the kubelet service has successfully restarted after the kubelet has been upgraded,
  you can execute `systemctl status kubelet` or view the service logs with `journalctl -xeu kubelet`.
- `kubeadm upgrade` supports `--config` with a
  [`UpgradeConfiguration` API type](/docs/reference/config-api/kubeadm-config.v1beta4) which can
  be used to configure the upgrade process.
- `kubeadm upgrade` does not support reconfiguration of an existing cluster. Follow the steps in
  [Reconfiguring a kubeadm cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure) instead.
-->
- 要驗證 kubelet 服務在升級後是否成功重啓，可以執行 `systemctl status kubelet`
  或 `journalctl -xeu kubelet` 查看服務日誌。
- `kubeadm upgrade` 支持 `--config` 和
  [`UpgradeConfiguration` API 類型](/zh-cn/docs/reference/config-api/kubeadm-config.v1beta4)
  可用於設定升級過程。
- `kubeadm upgrade` 不支持重新設定現有叢集。
  請按照[重新設定 kubeadm 叢集](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure)中的步驟來進行。

<!--
### Considerations when upgrading etcd

Because the `kube-apiserver` static pod is running at all times (even if you
have drained the node), when you perform a kubeadm upgrade which includes an
etcd upgrade, in-flight requests to the server will stall while the new etcd
static pod is restarting. As a workaround, it is possible to actively stop the
`kube-apiserver` process a few seconds before starting the `kubeadm upgrade
apply` command. This permits to complete in-flight requests and close existing
connections, and minimizes the consequence of the etcd downtime. This can be
done as follows on control plane nodes:
-->
### 升級 etcd 時的注意事項   {#considerations-when-upgrading-etcd}

由於 `kube-apiserver` 靜態 Pod 始終在運行（即使你已經執行了騰空節點的操作），
因此當你執行包括 etcd 升級在內的 kubeadm 升級時，對伺服器正在進行的請求將停滯，
因爲要重新啓動新的 etcd 靜態 Pod。作爲一種解決方法，可以在運行 `kubeadm upgrade apply`
命令之前主動停止 `kube-apiserver` 進程幾秒鐘。這樣可以允許正在進行的請求完成處理並關閉現有連接，
並最大限度地減少 etcd 停機的後果。此操作可以在控制平面節點上按如下方式完成：

<!--
```shell
# trigger a graceful kube-apiserver shutdown
# wait a little bit to permit completing in-flight requests
# execute a kubeadm upgrade command
-->
```shell
killall -s SIGTERM kube-apiserver # 觸發 kube-apiserver 體面關閉
sleep 20 # 等待一下，以完成進行中的請求
kubeadm upgrade ... # 執行 kubeadm 升級命令
```

<!-- steps -->

<!--
## Changing the package repository

If you're using the community-owned package repositories (`pkgs.k8s.io`), you need to
enable the package repository for the desired Kubernetes minor release. This is explained in
[Changing the Kubernetes package repository](/docs/tasks/administer-cluster/kubeadm/change-package-repository/)
document.
-->
## 更改軟件包倉庫   {#changing-the-package-repository}

如果你正在使用社區版的軟件包倉庫（`pkgs.k8s.io`），
你需要啓用所需的 Kubernetes 小版本的軟件包倉庫。
這一點在[更改 Kubernetes 軟件包倉庫](/zh-cn/docs/tasks/administer-cluster/kubeadm/change-package-repository/)文檔中有詳細說明。

{{% legacy-repos-deprecation %}}

<!--
## Determine which version to upgrade to
-->
## 確定要升級到哪個版本   {#determine-which-version-to-upgrade-to}

<!--
Find the latest patch release for Kubernetes {{< skew currentVersion >}} using the OS package manager:
-->
使用操作系統的包管理器找到最新的補丁版本 Kubernetes {{< skew currentVersion >}}：

{{< tabs name="k8s_install_versions" >}}
{{% tab name="Ubuntu、Debian 或 HypriotOS" %}}

<!--
```shell
# Find the latest {{< skew currentVersion >}} version in the list.
# It should look like {{< skew currentVersion >}}.x-*, where x is the latest patch.
sudo apt update
sudo apt-cache madison kubeadm
```
-->
```shell
# 在列表中查找最新的 {{< skew currentVersion >}} 版本
# 它看起來應該是 {{< skew currentVersion >}}.x-*，其中 x 是最新的補丁版本
sudo apt update
sudo apt-cache madison kubeadm
```

{{% /tab %}}
{{% tab name="CentOS、RHEL 或 Fedora" %}}

<!--
For systems with DNF:
```shell
# Find the latest {{< skew currentVersion >}} version in the list.
# It should look like {{< skew currentVersion >}}.x-*, where x is the latest patch.
sudo yum list --showduplicates kubeadm --disableexcludes=kubernetes
```
-->
對於使用 DNF 的系統：
```shell
# 在列表中查找最新的 {{< skew currentVersion >}} 版本
# 它看起來應該是 {{< skew currentVersion >}}.x-*，其中 x 是最新的補丁版本
sudo yum list --showduplicates kubeadm --disableexcludes=kubernetes
```

<!--
For systems with DNF5:
```shell
# Find the latest {{< skew currentVersion >}} version in the list.
# It should look like {{< skew currentVersion >}}.x-*, where x is the latest patch.
sudo yum list --showduplicates kubeadm --setopt=disable_excludes=kubernetes
```
-->
對於使用 DNF5 的系統：
```shell
# 在列表中查找最新的 {{< skew currentVersion >}} 版本
# 它看起來應該是 {{< skew currentVersion >}}.x-*，其中 x 是最新的補丁版本
sudo yum list --showduplicates kubeadm --setopt=disable_excludes=kubernetes
```

{{% /tab %}}
{{< /tabs >}}

<!--
If you don't see the version you expect to upgrade to, [verify if the Kubernetes package repositories are used.](/docs/tasks/administer-cluster/kubeadm/change-package-repository/#verifying-if-the-kubernetes-package-repositories-are-used)
-->
如果你沒有看到預期要升級到的版本，
請[驗證是否使用了 Kubernetes 軟件包倉庫](/zh-cn/docs/tasks/administer-cluster/kubeadm/change-package-repository/#verifying-if-the-kubernetes-package-repositories-are-used)。

<!--
## Upgrading control plane nodes
-->
## 升級控制平面節點  {#upgrading-control-plane-nodes}

<!--
The upgrade procedure on control plane nodes should be executed one node at a time.
Pick a control plane node that you wish to upgrade first. It must have the `/etc/kubernetes/admin.conf` file.
-->
控制平面節點上的升級過程應該每次處理一個節點。
首先選擇一個要先行升級的控制平面節點。該節點上必須擁有
`/etc/kubernetes/admin.conf` 文件。

<!--
### Call "kubeadm upgrade"
-->
### 執行 “kubeadm upgrade”   {#call-kubeadm-upgrade}

<!--
**For the first control plane node**
-->
**對於第一個控制平面節點**

<!--
1. Upgrade kubeadm:
-->
1. 升級 kubeadm：

   {{< tabs name="k8s_install_kubeadm_first_cp" >}}
   {{% tab name="Ubuntu、Debian 或 HypriotOS" %}}

   <!--
   ```shell
   # replace x in {{< skew currentVersion >}}.x-* with the latest patch version
   sudo apt-mark unhold kubeadm && \
   sudo apt-get update && sudo apt-get install -y kubeadm='{{< skew currentVersion >}}.x-*' && \
   sudo apt-mark hold kubeadm
   ```
   -->
   ```shell
   # 用最新的補丁版本號替換 {{< skew currentVersion >}}.x-* 中的 x
   sudo apt-mark unhold kubeadm && \
   sudo apt-get update && sudo apt-get install -y kubeadm='{{< skew currentVersion >}}.x-*' && \
   sudo apt-mark hold kubeadm
   ```

   {{% /tab %}}
   {{% tab name="CentOS、RHEL 或 Fedora" %}}

   <!--
   For systems with DNF:
   ```shell
   # replace x in {{< skew currentVersion >}}.x-* with the latest patch version
   sudo yum install -y kubeadm-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
   ```
   -->
   對於使用 DNF 的系統：
   ```shell
   # 用最新的補丁版本號替換 {{< skew currentVersion >}}.x-* 中的 x
   sudo yum install -y kubeadm-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
   ```
   
   <!--
   For systems with DNF5:
   ```shell
   # replace x in {{< skew currentVersion >}}.x-* with the latest patch version
   sudo yum install -y kubeadm-'{{< skew currentVersion >}}.x-*' --setopt=disable_excludes=kubernetes
   ```
   -->
   對於使用 DNF5 的系統：
   ```shell
   # 用最新的補丁版本號替換 {{< skew currentVersion >}}.x-* 中的 x
   sudo yum install -y kubeadm-'{{< skew currentVersion >}}.x-*' --setopt=disable_excludes=kubernetes
   ```

   {{% /tab %}}
   {{< /tabs >}}

<!--
1. Verify that the download works and has the expected version:
-->
2. 驗證下載操作正常，並且 kubeadm 版本正確：

   ```shell
   kubeadm version
   ```

<!--
1. Verify the upgrade plan:
-->
3. 驗證升級計劃：

   ```shell
   sudo kubeadm upgrade plan
   ```

   <!--
   This command checks that your cluster can be upgraded, and fetches the versions you can upgrade to.
   It also shows a table with the component config version states.
   -->
   此命令檢查你的集羣是否可被升級，並取回你要升級的目標版本。
   命令也會顯示一個包含組件配置版本狀態的表格。

   {{< note >}}
   <!--
   `kubeadm upgrade` also automatically renews the certificates that it manages on this node.
   To opt-out of certificate renewal the flag `--certificate-renewal=false` can be used.
   For more information see the [certificate management guide](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs).
   -->
   `kubeadm upgrade` 也會自動對 kubeadm 在節點上所管理的證書執行續約操作。
   如果需要略過證書續約操作，可以使用標誌 `--certificate-renewal=false`。
   更多的信息，可參閱[證書管理指南](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs)。
   {{</ note >}}

<!--
1. Choose a version to upgrade to, and run the appropriate command. For example:
-->
4. 選擇要升級到的目標版本，運行合適的命令。例如：

   <!--
   ```shell
   # replace x with the patch version you picked for this upgrade
   sudo kubeadm upgrade apply v{{< skew currentVersion >}}.x
   ```
   -->
   ```shell
   # 將 x 替換爲你爲此次升級所選擇的補丁版本號
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

   {{< note >}}

   <!--
   For versions earlier than v1.28, kubeadm defaulted to a mode that upgrades the addons (including CoreDNS and kube-proxy)
   immediately during `kubeadm upgrade apply`, regardless of whether there are other control plane instances that have not
   been upgraded. This may cause compatibility problems. Since v1.28, kubeadm defaults to a mode that checks whether all
   the control plane instances have been upgraded before starting to upgrade the addons. You must perform control plane
   instances upgrade sequentially or at least ensure that the last control plane instance upgrade is not started until all
   the other control plane instances have been upgraded completely, and the addons upgrade will be performed after the last
   control plane instance is upgraded.
   -->
   對於 v1.28 之前的版本，kubeadm 默認採用這樣一種模式：在 `kubeadm upgrade apply`
   期間立即升級插件（包括 CoreDNS 和 kube-proxy），而不管是否還有其他尚未升級的控制平面實例。
   這可能會導致兼容性問題。從 v1.28 開始，kubeadm 默認採用這樣一種模式：
   在開始升級插件之前，先檢查是否已經升級所有的控制平面實例。
   你必須按順序執行控制平面實例的升級，或者至少確保在所有其他控制平面實例已完成升級之前不啓動最後一個控制平面實例的升級，
   並且在最後一個控制平面實例完成升級之後才執行插件的升級。
   {{</ note >}}

<!--
1. Manually upgrade your CNI provider plugin.
-->
5. 手動升級你的 CNI 驅動插件。

   <!--
   Your Container Network Interface (CNI) provider may have its own upgrade instructions to follow.
   Check the [addons](/docs/concepts/cluster-administration/addons/) page to
   find your CNI provider and see whether additional upgrade steps are required.
   -->
   你的容器網絡接口（CNI）驅動應該提供了程序自身的升級說明。
   參閱[插件](/zh-cn/docs/concepts/cluster-administration/addons/)頁面查找你的 CNI 驅動，
   並查看是否需要其他升級步驟。

   <!--
   This step is not required on additional control plane nodes if the CNI provider runs as a DaemonSet.
   -->
   如果 CNI 驅動作爲 DaemonSet 運行，則在其他控制平面節點上不需要此步驟。

<!--
**For the other control plane nodes**
-->
**對於其他控制平面節點**

<!--
Same as the first control plane node but use:
-->
與第一個控制平面節點相同，但是使用：

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
此外，不需要執行 `kubeadm upgrade plan` 和更新 CNI 驅動插件的操作。

<!--
### Drain the node
-->
### 騰空節點   {#drain-the-node}

<!--
Prepare the node for maintenance by marking it unschedulable and evicting the workloads:
-->
將節點標記爲不可調度並驅逐所有負載，準備節點的維護：

<!--
```shell
# replace <node-to-drain> with the name of your node you are draining
kubectl drain <node-to-drain> --ignore-daemonsets
```
-->
```shell
# 將 <node-to-drain> 替換爲你要騰空的控制平面節點名稱
kubectl drain <node-to-drain> --ignore-daemonsets
```

<!--
### Upgrade kubelet and kubectl
-->
### 升級 kubelet 和 kubectl   {#upgrade-kubelet-and-kubectl}

<!--
1. Upgrade the kubelet and kubectl:
-->
1. 升級 kubelet 和 kubectl：

   {{< tabs name="k8s_install_kubelet" >}}
   {{% tab name="Ubuntu、Debian 或 HypriotOS" %}}

   <!--
   ```shell
   # replace x in {{< skew currentVersion >}}.x-* with the latest patch version
   sudo apt-mark unhold kubelet kubectl && \
   sudo apt-get update && sudo apt-get install -y kubelet='{{< skew currentVersion >}}.x-*' kubectl='{{< skew currentVersion >}}.x-*' && \
   sudo apt-mark hold kubelet kubectl
   ```
   -->
   ```shell
   # 用最新的補丁版本替換 {{< skew currentVersion >}}.x-* 中的 x
   sudo apt-mark unhold kubelet kubectl && \
   sudo apt-get update && sudo apt-get install -y kubelet='{{< skew currentVersion >}}.x-*' kubectl='{{< skew currentVersion >}}.x-*' && \
   sudo apt-mark hold kubelet kubectl
   ```

   {{% /tab %}}
   {{% tab name="CentOS、RHEL 或 Fedora" %}}

   <!--
   For systems with DNF:
   ```shell
   # replace x in {{< skew currentVersion >}}.x-* with the latest patch version
   sudo yum install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
   ```
   -->
   對於使用 DNF 的系統：
   ```shell
   # 用最新的補丁版本號替換 {{< skew currentVersion >}}.x-* 中的 x
   sudo yum install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
   ```
   
   <!--
   For systems with DNF5:   
   ```shell
   # replace x in {{< skew currentVersion >}}.x-* with the latest patch version
   sudo yum install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --setopt=disable_excludes=kubernetes
   ```
   -->
   對於使用 DNF5 的系統：
   ```shell
   # 用最新的補丁版本號替換 {{< skew currentVersion >}}.x-* 中的 x
   sudo yum install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --setopt=disable_excludes=kubernetes
   ```

   {{% /tab %}}
   {{< /tabs >}}

<!--
1. Restart the kubelet:
-->
2. 重啓 kubelet：

   ```shell
   sudo systemctl daemon-reload
   sudo systemctl restart kubelet
   ```

<!--
### Uncordon the node
-->
### 解除節點的保護   {#uncordon-the-node}

<!--
Bring the node back online by marking it schedulable:
-->
通過將節點標記爲可調度，讓其重新上線：

<!--
```shell
# replace <node-to-uncordon> with the name of your node
kubectl uncordon <node-to-uncordon>
```
-->
```shell
# 將 <node-to-uncordon> 替換爲你的節點名稱
kubectl uncordon <node-to-uncordon>
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
以不影響運行工作負載所需的最小容量。

<!--
The following pages show how to upgrade Linux and Windows worker nodes:

* [Upgrade Linux nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes/)
* [Upgrade Windows nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/)
-->
以下內容演示如何升級 Linux 和 Windows 工作節點：

* [升級 Linux 節點](/zh-cn/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes/)
* [升級 Windows 節點](/zh-cn/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/)

<!--
## Verify the status of the cluster
-->
## 驗證集羣的狀態   {#verify-the-status-of-the-cluster}

<!--
After the kubelet is upgraded on all nodes verify that all nodes are available again by running
the following command from anywhere kubectl can access the cluster:
-->
在所有節點上升級 kubelet 後，通過從 kubectl 可以訪問集羣的任何位置運行以下命令，
驗證所有節點是否再次可用：

```shell
kubectl get nodes
```

<!--
The `STATUS` column should show `Ready` for all your nodes, and the version number should be updated.
-->
`STATUS` 應顯示所有節點爲 `Ready` 狀態，並且版本號已經被更新。

<!--
## Recovering from a failure state
-->
## 從故障狀態恢復   {#recovering-from-a-failure-state}

<!--
If `kubeadm upgrade` fails and does not roll back, for example because of an unexpected shutdown during execution, you can run `kubeadm upgrade` again.
This command is idempotent and eventually makes sure that the actual state is the desired state you declare.
-->
如果 `kubeadm upgrade` 失敗並且沒有回滾，例如由於執行期間節點意外關閉，
你可以再次運行 `kubeadm upgrade`。
此命令是冪等的，並最終確保實際狀態是你聲明的期望狀態。

<!--
To recover from a bad state, you can also run `sudo kubeadm upgrade apply --force` without changing the version that your cluster is running.
-->
要從故障狀態恢復，你還可以運行 `sudo kubeadm upgrade apply --force` 而無需更改集羣正在運行的版本。

<!--
During upgrade kubeadm writes the following backup folders under `/etc/kubernetes/tmp`:
-->
在升級期間，kubeadm 向 `/etc/kubernetes/tmp` 目錄下的如下備份文件夾寫入數據：

- `kubeadm-backup-etcd-<date>-<time>`
- `kubeadm-backup-manifests-<date>-<time>`

<!--
`kubeadm-backup-etcd` contains a backup of the local etcd member data for this control plane Node.
In case of an etcd upgrade failure and if the automatic rollback does not work, the contents of this folder
can be manually restored in `/var/lib/etcd`. In case external etcd is used this backup folder will be empty.
-->
`kubeadm-backup-etcd` 包含當前控制平面節點本地 etcd 成員數據的備份。
如果 etcd 升級失敗並且自動回滾也無法修復，則可以將此文件夾中的內容複製到
`/var/lib/etcd` 進行手工修復。如果使用的是外部的 etcd，則此備份文件夾爲空。

<!--
`kubeadm-backup-manifests` contains a backup of the static Pod manifest files for this control plane Node.
In case of a upgrade failure and if the automatic rollback does not work, the contents of this folder can be
manually restored in `/etc/kubernetes/manifests`. If for some reason there is no difference between a pre-upgrade
and post-upgrade manifest file for a certain component, a backup file for it will not be written.
-->
`kubeadm-backup-manifests` 包含當前控制平面節點的靜態 Pod 清單文件的備份版本。
如果升級失敗並且無法自動回滾，則此文件夾中的內容可以複製到
`/etc/kubernetes/manifests` 目錄實現手工恢復。
如果由於某些原因，在升級前後某個組件的清單未發生變化，則 kubeadm 也不會爲之生成備份版本。

{{< note >}}
<!--
After the cluster upgrade using kubeadm, the backup directory `/etc/kubernetes/tmp` will remain and
these backup files will need to be cleared manually.
-->
集羣通過 kubeadm 升級後，備份目錄 `/etc/kubernetes/tmp` 將保留，這些備份文件需要手動清理。
{{</ note >}}

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
- 檢查你的集羣是否處於可升級狀態:
  - API 伺服器是可訪問的
  - 所有節點處於 `Ready` 狀態
  - 控制平面是健康的
- 強制執行版本偏差策略。
- 確保控制平面的鏡像是可用的或可拉取到伺服器上。
- 如果組件配置要求版本升級，則生成替代配置與/或使用用戶提供的覆蓋版本配置。
- 升級控制平面組件或回滾（如果其中任何一個組件無法啓動）。
- 應用新的 `CoreDNS` 和 `kube-proxy` 清單，並強制創建所有必需的 RBAC 規則。
- 如果舊文件在 180 天后過期，將創建 API 伺服器的新證書和密鑰文件並備份舊文件。

<!--
`kubeadm upgrade node` does the following on additional control plane nodes:
-->
`kubeadm upgrade node` 在其他控制平面節點上執行以下操作：

<!--
- Fetches the kubeadm `ClusterConfiguration` from the cluster.
- Optionally backups the kube-apiserver certificate.
- Upgrades the static Pod manifests for the control plane components.
- Upgrades the kubelet configuration for this node.
-->
- 從集羣中獲取 kubeadm `ClusterConfiguration`。
- （可選操作）備份 kube-apiserver 證書。
- 升級控制平面組件的靜態 Pod 清單。
- 爲本節點升級 kubelet 配置

<!--
`kubeadm upgrade node` does the following on worker nodes:
-->
`kubeadm upgrade node` 在工作節點上完成以下工作：

<!--
- Fetches the kubeadm `ClusterConfiguration` from the cluster.
- Upgrades the kubelet configuration for this node.
-->
- 從集羣取回 kubeadm `ClusterConfiguration`。
- 爲本節點升級 kubelet 設定。
