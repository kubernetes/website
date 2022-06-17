---
title: 配置 cgroup 驅動
content_type: task
weight: 10
---
<!-- 
title: Configuring a cgroup driver
content_type: task
weight: 10
-->

<!-- overview -->

<!-- 
This page explains how to configure the kubelet cgroup driver to match the container
runtime cgroup driver for kubeadm clusters.
-->
本頁闡述如何配置 kubelet 的 cgroup 驅動以匹配 kubeadm 叢集中的容器執行時的 cgroup 驅動。

## {{% heading "prerequisites" %}}

<!-- 
You should be familiar with the Kubernetes
[container runtime requirements](/docs/setup/production-environment/container-runtimes).
-->
你應該熟悉 Kubernetes 的[容器執行時需求](/zh-cn/docs/setup/production-environment/container-runtimes)。

<!-- steps -->

<!-- 
## Configuring the container runtime cgroup driver
-->
## 配置容器執行時 cgroup 驅動 {#configuring-the-container-runtime-cgroup-driver}

<!-- 
The [Container runtimes](/docs/setup/production-environment/container-runtimes) page
explains that the `systemd` driver is recommended for kubeadm based setups instead
of the `cgroupfs` driver, because kubeadm manages the kubelet as a systemd service.
-->
[容器執行時](/zh-cn/docs/setup/production-environment/container-runtimes)頁面提到：
由於 kubeadm 把 kubelet 視為一個系統服務來管理，所以對基於 kubeadm 的安裝，
我們推薦使用 `systemd` 驅動，不推薦 `cgroupfs` 驅動。

<!-- 
The page also provides details on how to setup a number of different container runtimes with the
`systemd` driver by default.
-->
此頁還詳述瞭如何安裝若干不同的容器執行時，並將 `systemd` 設為其預設驅動。

<!-- 
## Configuring the kubelet cgroup driver
-->
## 配置 kubelet 的 cgroup 驅動

<!-- 
kubeadm allows you to pass a `KubeletConfiguration` structure during `kubeadm init`.
This `KubeletConfiguration` can include the `cgroupDriver` field which controls the cgroup
driver of the kubelet.
-->
kubeadm 支援在執行 `kubeadm init` 時，傳遞一個 `KubeletConfiguration` 結構體。
`KubeletConfiguration` 包含 `cgroupDriver` 欄位，可用於控制 kubelet 的 cgroup 驅動。

<!-- 
In v1.22, if the user is not setting the `cgroupDriver` field under `KubeletConfiguration`,
`kubeadm init` will default it to `systemd`.
-->

{{< note >}}
在版本 1.22 中，如果使用者沒有在 `KubeletConfiguration` 中設定 `cgroupDriver` 欄位，
`kubeadm init` 會將它設定為預設值 `systemd`。
{{< /note >}}

<!-- 
A minimal example of configuring the field explicitly:
-->
這是一個最小化的示例，其中顯式的配置了此欄位：

```yaml
# kubeadm-config.yaml
kind: ClusterConfiguration
apiVersion: kubeadm.k8s.io/v1beta3
kubernetesVersion: v1.21.0
---
kind: KubeletConfiguration
apiVersion: kubelet.config.k8s.io/v1beta1
cgroupDriver: systemd
```

<!-- 
Such a configuration file can then be passed to the kubeadm command:
-->
這樣一個配置檔案就可以傳遞給 kubeadm 命令了：

```shell
kubeadm init --config kubeadm-config.yaml
```

<!-- 
Kubeadm uses the same `KubeletConfiguration` for all nodes in the cluster.
The `KubeletConfiguration` is stored in a [ConfigMap](/docs/concepts/configuration/configmap)
object under the `kube-system` namespace.

Executing the sub commands `init`, `join` and `upgrade` would result in kubeadm
writing the `KubeletConfiguration` as a file under `/var/lib/kubelet/config.yaml`
and passing it to the local node kubelet.
-->
{{< note >}}
Kubeadm 對叢集所有的節點，使用相同的 `KubeletConfiguration`。
`KubeletConfiguration` 存放於 `kube-system` 名稱空間下的某個 
[ConfigMap](/zh-cn/docs/concepts/configuration/configmap) 物件中。

執行 `init`、`join` 和 `upgrade` 等子命令會促使 kubeadm 
將 `KubeletConfiguration` 寫入到檔案 `/var/lib/kubelet/config.yaml` 中，
繼而把它傳遞給本地節點的 kubelet。

{{< /note >}}

<!-- 
## Using the `cgroupfs` driver
-->
# 使用 `cgroupfs` 驅動

<!-- 
To use `cgroupfs` and to prevent `kubeadm upgrade` from modifying the
`KubeletConfiguration` cgroup driver on existing setups, you must be explicit
about its value. This applies to a case where you do not wish future versions
of kubeadm to apply the `systemd` driver by default.
-->
如仍需使用 `cgroupfs` 且要防止 `kubeadm upgrade` 修改現有系統中
`KubeletConfiguration` 的 cgroup 驅動，你必須顯式宣告它的值。
此方法應對的場景為：在將來某個版本的 kubeadm 中，你不想使用預設的 `systemd` 驅動。

<!-- 
See the below section on "Modify the kubelet ConfigMap" for details on
how to be explicit about the value.

If you wish to configure a container runtime to use the `cgroupfs` driver,
you must refer to the documentation of the container runtime of your choice.
-->
參閱以下章節“修改 kubelet 的 ConfigMap”，瞭解顯式設定該值的方法。

如果你希望配置容器執行時來使用 `cgroupfs` 驅動，
則必須參考所選容器執行時的文件。

<!-- 
## Migrating to the `systemd` driver
-->
## 遷移到 `systemd` 驅動

<!-- 
To change the cgroup driver of an existing kubeadm cluster to `systemd` in-place,
a similar procedure to a kubelet upgrade is required. This must include both
steps outlined below.
-->
要將現有 kubeadm 叢集的 cgroup 驅動就地升級為 `systemd`，
需要執行一個與 kubelet 升級類似的過程。
該過程必須包含下面兩個步驟：

<!-- 
Alternatively, it is possible to replace the old nodes in the cluster with new ones
that use the `systemd` driver. This requires executing only the first step below
before joining the new nodes and ensuring the workloads can safely move to the new
nodes before deleting the old nodes.
-->
{{< note >}}
還有一種方法，可以用已配置了 `systemd` 的新節點替換掉叢集中的老節點。
按這種方法，在加入新節點、確保工作負載可以安全遷移到新節點、及至刪除舊節點這一系列操作之前，
只需執行以下第一個步驟。
{{< /note >}}

<!-- 
### Modify the kubelet ConfigMap
-->
### 修改 kubelet 的 ConfigMap

<!-- 
- Call `kubectl edit cm kubelet-config -n kube-system`.
- Either modify the existing `cgroupDriver` value or add a new field that looks like this:
-->
- 執行 `kubectl edit cm kubelet-config -n kube-system`。
- 修改現有 `cgroupDriver` 的值，或者新增如下式樣的欄位：

  ```yaml
  cgroupDriver: systemd
  ```
  <!-- 
  This field must be present under the `kubelet:` section of the ConfigMap.
  -->
  該欄位必須出現在 ConfigMap 的 `kubelet:` 小節下。

<!-- 
### Update the cgroup driver on all nodes
-->
### 更新所有節點的 cgroup 驅動

<!-- 
For each node in the cluster:

- [Drain the node](/docs/tasks/administer-cluster/safely-drain-node) using `kubectl drain <node-name> --ignore-daemonsets`
- Stop the kubelet using `systemctl stop kubelet`
- Stop the container runtime
- Modify the container runtime cgroup driver to `systemd`
- Set `cgroupDriver: systemd` in `/var/lib/kubelet/config.yaml`
- Start the container runtime
- Start the kubelet using `systemctl start kubelet`
- [Uncordon the node](/docs/tasks/administer-cluster/safely-drain-node) using `kubectl uncordon <node-name>`
-->
對於叢集中的每一個節點：

- 執行命令 `kubectl drain <node-name> --ignore-daemonsets`，以
  [騰空節點](/zh-cn/docs/tasks/administer-cluster/safely-drain-node)
- 執行命令 `systemctl stop kubelet`，以停止 kubelet
- 停止容器執行時
- 修改容器執行時 cgroup 驅動為 `systemd`
- 在檔案 `/var/lib/kubelet/config.yaml` 中新增設定 `cgroupDriver: systemd`
- 啟動容器執行時
- 執行命令 `systemctl start kubelet`，以啟動 kubelet
- 執行命令 `kubectl uncordon <node-name>`，以
  [取消節點隔離](/zh-cn/docs/tasks/administer-cluster/safely-drain-node)

<!-- 
Execute these steps on nodes one at a time to ensure workloads
have sufficient time to schedule on different nodes.

Once the process is complete ensure that all nodes and workloads are healthy.
-->
在節點上依次執行上述步驟，確保工作負載有充足的時間被排程到其他節點。

流程完成後，確認所有節點和工作負載均健康如常。
