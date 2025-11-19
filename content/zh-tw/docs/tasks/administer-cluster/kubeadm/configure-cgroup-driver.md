---
title: 配置 cgroup 驅動
content_type: task
weight: 50
---
<!-- 
title: Configuring a cgroup driver
content_type: task
weight: 50
-->

<!-- overview -->

<!-- 
This page explains how to configure the kubelet's cgroup driver to match the container
runtime cgroup driver for kubeadm clusters.
-->
本頁闡述如何配置 kubelet 的 cgroup 驅動以匹配 kubeadm 集羣中的容器運行時的 cgroup 驅動。

## {{% heading "prerequisites" %}}

<!-- 
You should be familiar with the Kubernetes
[container runtime requirements](/docs/setup/production-environment/container-runtimes).
-->
你應該熟悉 Kubernetes 的[容器運行時需求](/zh-cn/docs/setup/production-environment/container-runtimes)。

<!-- steps -->

<!-- 
## Configuring the container runtime cgroup driver
-->
## 配置容器運行時 cgroup 驅動 {#configuring-the-container-runtime-cgroup-driver}

<!-- 
The [Container runtimes](/docs/setup/production-environment/container-runtimes) page
explains that the `systemd` driver is recommended for kubeadm based setups instead
of the kubelet's [default](/docs/reference/config-api/kubelet-config.v1beta1) `cgroupfs` driver,
because kubeadm manages the kubelet as a
[systemd service](/docs/setup/production-environment/tools/kubeadm/kubelet-integration).
-->
[容器運行時](/zh-cn/docs/setup/production-environment/container-runtimes)頁面提到，
由於 kubeadm 把 kubelet 視爲一個
[系統服務](/zh-cn/docs/setup/production-environment/tools/kubeadm/kubelet-integration)來管理，
所以對基於 kubeadm 的安裝， 我們推薦使用 `systemd` 驅動，
不推薦 kubelet [默認](/zh-cn/docs/reference/config-api/kubelet-config.v1beta1)的 `cgroupfs` 驅動。

<!-- 
The page also provides details on how to set up a number of different container runtimes with the
`systemd` driver by default.
-->
此頁還詳述瞭如何安裝若干不同的容器運行時，並將 `systemd` 設爲其默認驅動。

<!-- 
## Configuring the kubelet cgroup driver
-->
## 配置 kubelet 的 cgroup 驅動   {#configuring-the-kubelet-cgroup-driver}

<!-- 
kubeadm allows you to pass a `KubeletConfiguration` structure during `kubeadm init`.
This `KubeletConfiguration` can include the `cgroupDriver` field which controls the cgroup
driver of the kubelet.
-->
kubeadm 支持在執行 `kubeadm init` 時，傳遞一個 `KubeletConfiguration` 結構體。
`KubeletConfiguration` 包含 `cgroupDriver` 字段，可用於控制 kubelet 的 cgroup 驅動。

<!-- 
In v1.22 and later, if the user does not set the `cgroupDriver` field under `KubeletConfiguration`,
kubeadm defaults it to `systemd`.

In Kubernetes v1.28, you can enable automatic detection of the
cgroup driver as an alpha feature.
See [systemd cgroup driver](/docs/setup/production-environment/container-runtimes/#systemd-cgroup-driver)
for more details.
-->

{{< note >}}
在版本 1.22 及更高版本中，如果用戶沒有在 `KubeletConfiguration` 中設置 `cgroupDriver` 字段，
`kubeadm` 會將它設置爲默認值 `systemd`。

在 Kubernetes v1.28 中，你可以以 Alpha 功能啓用 cgroup 驅動的自動檢測。
有關更多詳情，請查看 [systemd cgroup 驅動](/zh-cn/docs/setup/production-environment/container-runtimes/#systemd-cgroup-driver)。
{{< /note >}}

<!-- 
A minimal example of configuring the field explicitly:
-->
這是一個最小化的示例，其中顯式的配置了此字段：

```yaml
# kubeadm-config.yaml
kind: ClusterConfiguration
apiVersion: kubeadm.k8s.io/v1beta4
kubernetesVersion: v1.21.0
---
kind: KubeletConfiguration
apiVersion: kubelet.config.k8s.io/v1beta1
cgroupDriver: systemd
```

<!-- 
Such a configuration file can then be passed to the kubeadm command:
-->
這樣一個配置文件就可以傳遞給 kubeadm 命令了：

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
Kubeadm 對集羣所有的節點，使用相同的 `KubeletConfiguration`。
`KubeletConfiguration` 存放於 `kube-system` 命名空間下的某個 
[ConfigMap](/zh-cn/docs/concepts/configuration/configmap) 對象中。

執行 `init`、`join` 和 `upgrade` 等子命令會促使 kubeadm 
將 `KubeletConfiguration` 寫入到文件 `/var/lib/kubelet/config.yaml` 中，
繼而把它傳遞給本地節點的 kubelet。

<!--
On each node, kubeadm detects the CRI socket and stores its details into the `/var/lib/kubelet/instance-config.yaml` file.
When executing the `init`, `join`, or `upgrade` subcommands, 
kubeadm patches the `containerRuntimeEndpoint` value from this instance configuration into `/var/lib/kubelet/config.yaml`.
-->
在每個節點上，kubeadm 會檢測 CRI 套接字，並將其詳細信息存儲到
`/var/lib/kubelet/instance-config.yaml` 文件中。
當執行 `init`、`join` 或 `upgrade` 子命令時，
kubeadm 會將此實例配置中的 `containerRuntimeEndpoint` 值 patch 到
`/var/lib/kubelet/config.yaml` 中。

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
`KubeletConfiguration` 的 cgroup 驅動，你必須顯式聲明它的值。
此方法應對的場景爲：在將來某個版本的 kubeadm 中，你不想使用默認的 `systemd` 驅動。

<!-- 
See the below section on "[Modify the kubelet ConfigMap](#modify-the-kubelet-configmap)" for details on
how to be explicit about the value.

If you wish to configure a container runtime to use the `cgroupfs` driver,
you must refer to the documentation of the container runtime of your choice.
-->
參閱以下章節“[修改 kubelet 的 ConfigMap](#modify-the-kubelet-configmap) ”，瞭解顯式設置該值的方法。

如果你希望配置容器運行時來使用 `cgroupfs` 驅動，
則必須參考所選容器運行時的文檔。

<!-- 
## Migrating to the `systemd` driver
-->
## 遷移到 `systemd` 驅動

<!-- 
To change the cgroup driver of an existing kubeadm cluster from `cgroupfs` to `systemd` in-place,
a similar procedure to a kubelet upgrade is required. This must include both
steps outlined below.
-->
要將現有 kubeadm 集羣的 cgroup 驅動從 `cgroupfs` 就地升級爲 `systemd`，
需要執行一個與 kubelet 升級類似的過程。
該過程必須包含下面兩個步驟：

<!-- 
Alternatively, it is possible to replace the old nodes in the cluster with new ones
that use the `systemd` driver. This requires executing only the first step below
before joining the new nodes and ensuring the workloads can safely move to the new
nodes before deleting the old nodes.
-->
{{< note >}}
還有一種方法，可以用已配置了 `systemd` 的新節點替換掉集羣中的老節點。
按這種方法，在加入新節點、確保工作負載可以安全遷移到新節點、及至刪除舊節點這一系列操作之前，
只需執行以下第一個步驟。
{{< /note >}}

<!-- 
### Modify the kubelet ConfigMap
-->
### 修改 kubelet 的 ConfigMap  {#modify-the-kubelet-configmap}

<!-- 
- Call `kubectl edit cm kubelet-config -n kube-system`.
- Either modify the existing `cgroupDriver` value or add a new field that looks like this:
-->
- 運行 `kubectl edit cm kubelet-config -n kube-system`。
- 修改現有 `cgroupDriver` 的值，或者新增如下式樣的字段：

  ```yaml
  cgroupDriver: systemd
  ```
  <!-- 
  This field must be present under the `kubelet:` section of the ConfigMap.
  -->
  該字段必須出現在 ConfigMap 的 `kubelet:` 小節下。

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
對於集羣中的每一個節點：

- 執行命令 `kubectl drain <node-name> --ignore-daemonsets`，以
  [騰空節點](/zh-cn/docs/tasks/administer-cluster/safely-drain-node)
- 執行命令 `systemctl stop kubelet`，以停止 kubelet
- 停止容器運行時
- 修改容器運行時 cgroup 驅動爲 `systemd`
- 在文件 `/var/lib/kubelet/config.yaml` 中添加設置 `cgroupDriver: systemd`
- 啓動容器運行時
- 執行命令 `systemctl start kubelet`，以啓動 kubelet
- 執行命令 `kubectl uncordon <node-name>`，以
  [取消節點隔離](/zh-cn/docs/tasks/administer-cluster/safely-drain-node)

<!-- 
Execute these steps on nodes one at a time to ensure workloads
have sufficient time to schedule on different nodes.

Once the process is complete ensure that all nodes and workloads are healthy.
-->
在節點上依次執行上述步驟，確保工作負載有充足的時間被調度到其他節點。

流程完成後，確認所有節點和工作負載均健康如常。
