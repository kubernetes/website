---
title: 升级 kubeadm 集群
content_type: task
weight: 20
---
<!--
reviewers:
- sig-cluster-lifecycle
title: Upgrading kubeadm clusters
content_type: task
weight: 20
min-kubernetes-server-version: 1.18
-->

<!-- overview -->

<!--
This page explains how to upgrade a Kubernetes cluster created with kubeadm from version
{{< skew latestVersionAddMinor -1 >}}.x to version {{< skew latestVersion >}}.x, and from version
{{< skew latestVersion >}}.x to {{< skew latestVersion >}}.y (where `y > x`). Skipping MINOR versions
when upgrading is unsupported.
-->
本页介绍如何将 `kubeadm` 创建的 Kubernetes 集群从 {{< skew latestVersionAddMinor -1 >}}.x 版本
升级到 {{< skew latestVersion >}}.x 版本以及从 {{< skew latestVersion >}}.x
升级到 {{< skew latestVersion >}}.y（其中 `y > x`）。略过次版本号的升级是
不被支持的。

<!--
To see information about upgrading clusters created using older versions of kubeadm,
please refer to following pages instead:
-->
要查看 kubeadm 创建的有关旧版本集群升级的信息，请参考以下页面：

<!--
- [Upgrading kubeadm cluster from 1.17 to 1.18](https://v1-18.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Upgrading kubeadm cluster from 1.16 to 1.17](https://v1-17.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Upgrading kubeadm cluster from 1.15 to 1.16](https://v1-16.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Upgrading kubeadm cluster from 1.14 to 1.15](https://v1-15.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-15/)
- [Upgrading kubeadm cluster from 1.13 to 1.14](https://v1-15.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-14/)
-->
- [将 kubeadm 集群从 1.17 升级到 1.18](https://v1-18.docs.kubernetes.io/zh/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [将 kubeadm 集群从 1.16 升级到 1.17](https://v1-17.docs.kubernetes.io/zh/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [将 kubeadm 集群从 1.15 升级到 1.16](https://v1-16.docs.kubernetes.io/zh/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [将 kubeadm 集群从 1.14 升级到 1.15](https://v1-15.docs.kubernetes.io/zh/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-15/)
- [将 kubeadm 集群从 1.13 升级到 1.14](https://v1-15.docs.kubernetes.io/zh/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-14/)

<!--
The upgrade workflow at high level is the following:

1. Upgrade a primary control plane node.
1. Upgrade additional control plane nodes.
1. Upgrade worker nodes.
-->
升级工作的基本流程如下：

1. 升级主控制平面节点
1. 升级其他控制平面节点
1. 升级工作节点

## {{% heading "prerequisites" %}}

<!--
- Make sure you read the [release notes]({{< latest-release-notes >}}) carefully.
- The cluster should use a static control plane and etcd pods or external etcd.
- Make sure to back up any important components, such as app-level state stored in a database.
  `kubeadm upgrade` does not touch your workloads, only components internal to Kubernetes, but backups are always a best practice.
-->
- 务必仔细认真阅读[发行说明]({{< latest-release-notes >}})。
- 集群应使用静态的控制平面和 etcd Pod 或者外部 etcd。
- 务必备份所有重要组件，例如存储在数据库中应用层面的状态。
  `kubeadm upgrade` 不会影响你的工作负载，只会涉及 Kubernetes 内部的组件，但备份终究是好的。
- [必须禁用交换分区](https://serverfault.com/questions/684771/best-way-to-disable-swap-in-linux)。

<!--
### Additional information

- [Draining nodes](/docs/tasks/administer-cluster/safely-drain-node/) before kubelet MINOR version
  upgrades is required. In the case of control plane nodes, they could be running CoreDNS Pods or other critical workloads.
- All containers are restarted after upgrade, because the container spec hash value is changed.
-->
### 附加信息

- 在对 kubelet 作次版本升版时需要[腾空节点](/zh/docs/tasks/administer-cluster/safely-drain-node/)。
  对于控制面节点，其上可能运行着 CoreDNS Pods 或者其它非常重要的负载。
- 升级后，因为容器规约的哈希值已更改，所有容器都会被重新启动。

<!-- steps -->

<!--
## Determine which version to upgrade to

Find the latest stable {{< skew latestVersion >}} version using the OS package manager:
-->
## 确定要升级到哪个版本

使用操作系统的包管理器找到最新的稳定 {{< skew latestVersion >}}：

{{< tabs name="k8s_install_versions" >}}
{{% tab name="Ubuntu、Debian 或 HypriotOS" %}}
```
apt update
apt-cache policy kubeadm
# 在列表中查找最新的 {{< skew latestVersion >}} 版本
# 它看起来应该是 {{< skew latestVersion >}}.x-00，其中 x 是最新的补丁版本
```
{{% /tab %}}
{{% tab name="CentOS、RHEL 或 Fedora" %}}
```
yum list --showduplicates kubeadm --disableexcludes=kubernetes
# 在列表中查找最新的 {{< skew latestVersion >}} 版本
# 它看起来应该是 {{< skew latestVersion >}}.x-0，其中 x 是最新的补丁版本
```
{{% /tab %}}
{{< /tabs >}}

<!--
## Upgrade the control plane node

The upgrade procedure on control plane nodes should be executed one node at a time.
Pick a control plane node that you wish to upgrade first. It must have the `/etc/kubernetes/admin.conf` file.

### Call "kubeadm upgrade"
-->
## 升级控制平面节点

控制面节点上的升级过程应该每次处理一个节点。
首先选择一个要先行升级的控制面节点。该节点上必须拥有
`/etc/kubernetes/admin.conf` 文件。

### 执行 "kubeadm upgrade"

<!--
**Upgrade the first control plane node**
-->

**升级第一个控制面节点**

<!--
- Upgrade kubeadm:
-->
- 升级 kubeadm：

{{< tabs name="k8s_install_kubeadm_first_cp" >}}
{{% tab name="Ubuntu、Debian 或 HypriotOS" %}}
```shell
# 用最新的补丁版本号替换 {{< skew latestVersion >}}.x-00 中的 x
apt-mark unhold kubeadm && \
apt-get update && apt-get install -y kubeadm={{< skew latestVersion >}}.x-00 && \
apt-mark hold kubeadm
-
# 从 apt-get 1.1 版本起，你也可以使用下面的方法
apt-get update && \
apt-get install -y --allow-change-held-packages kubeadm={{< skew latestVersion >}}.x-00
```
{{% /tab %}}
{{% tab name="CentOS、RHEL 或 Fedora" %}}
```shell
# 用最新的补丁版本号替换 {{< skew latestVersion >}}.x-0 中的 x
yum install -y kubeadm-{{< skew latestVersion >}}.x-0 --disableexcludes=kubernetes
```
{{% /tab %}}
{{< /tabs >}}

<!--
- Verify that the download works and has the expected version:
-->
- 验证下载操作正常，并且 kubeadm 版本正确：

  ```shell
  kubeadm version
  ```

<!--
- Verify the upgrade plan:
-->
- 验证升级计划：

  ```shell
  kubeadm upgrade plan
  ```

  <!--
  This command checks that your cluster can be upgraded, and fetches the versions you can upgrade to.
  It also shows a table with the component config version states.
  -->
  此命令检查你的集群是否可被升级，并取回你要升级的目标版本。
  命令也会显示一个包含组件配置版本状态的表格。

  {{< note >}}
  <!--
  `kubeadm upgrade` also automatically renews the certificates that it manages on this node.
  To opt-out of certificate renewal the flag `--certificate-renewal=false` can be used.
  For more information see the [certificate management guide](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs).
  -->
  `kubeadm upgrade` 也会自动对 kubeadm 在节点上所管理的证书执行续约操作。
  如果需要略过证书续约操作，可以使用标志 `--certificate-renewal=false`。
  更多的信息，可参阅[证书管理指南](/zh/docs/tasks/administer-cluster/kubeadm/kubeadm-certs)。
  {{</ note >}}

  {{< note >}}
  <!--
  If `kubeadm upgrade plan` shows any component configs that require manual upgrade, users must provide
  a config file with replacement configs to `kubeadm upgrade apply` via the `--config` command line flag.
  Failing to do so will cause `kubeadm upgrade apply` to exit with an error and not perform an upgrade.
  -->
  如果 `kubeadm upgrade plan` 给出任何需要手动升级的组件配置，用户必须
  通过 `--config` 命令行标志向 `kubeadm upgrade apply` 命令提供替代的配置文件。
  如果不这样做，`kubeadm upgrade apply` 会出错并退出，不再执行升级操作。
  {{</ note >}}

<!--
- Choose a version to upgrade to, and run the appropriate command. For example:

  ```shell
  # replace x with the patch version you picked for this upgrade
  sudo kubeadm upgrade apply v{{< skew latestVersion >}}.x
  ```
-->
选择要升级到的目标版本，运行合适的命令。例如：

  ```shell
  # 将 x 替换为你为此次升级所选择的补丁版本号
  sudo kubeadm upgrade apply v{{< skew latestVersion >}}.x
  ```

  <!--
  Once the command finishes you should see:
  -->
  一旦该命令结束，你应该会看到：

  ```
  [upgrade/successful] SUCCESS! Your cluster was upgraded to "v{{< skew latestVersion >}}.x". Enjoy!

  [upgrade/kubelet] Now that your control plane is upgraded, please proceed with upgrading your kubelets if you haven't already done so.
  ```

<!--
- Manually upgrade your CNI provider plugin.

  Your Container Network Interface (CNI) provider may have its own upgrade instructions to follow.
  Check the [addons](/docs/concepts/cluster-administration/addons/) page to
  find your CNI provider and see whether additional upgrade steps are required.

  This step is not required on additional control plane nodes if the CNI provider runs as a DaemonSet.
-->
- 手动升级你的 CNI 驱动插件。

  你的容器网络接口（CNI）驱动应该提供了程序自身的升级说明。
  参阅[插件](/zh/docs/concepts/cluster-administration/addons/)页面查找你的 CNI 驱动，
  并查看是否需要其他升级步骤。

  如果 CNI 驱动作为 DaemonSet 运行，则在其他控制平面节点上不需要此步骤。

<!--
**For the other control plane nodes**
-->
**对于其它控制面节点**

<!--
Same as the first control plane node but use:
-->
与第一个控制面节点相同，但是使用：

```
sudo kubeadm upgrade node
```

<!--
instead of:
-->
而不是：

```
sudo kubeadm upgrade apply
```

<!--
Also calling `kubeadm upgrade plan` and upgrading the CNI provider plugin is no longer needed.
-->
此外，不需要执行 `kubeadm upgrade plan` 和更新 CNI 驱动插件的操作。

<!--
### Drain the node

-  Prepare the node for maintenance by marking it unschedulable and evicting the workloads:

    ```shell
    # replace <node-to-drain> with the name of your node you are draining
    kubectl drain <node-to-drain> --ignore-daemonsets
    ```
-->
### 腾空节点

- 通过将节点标记为不可调度并腾空节点为节点作升级准备：

  ```shell
  # 将 <node-to-drain> 替换为你要腾空的控制面节点名称
  kubectl drain <node-to-drain> --ignore-daemonsets
  ```

<!--
### Upgrade kubelet and kubectl

-  Upgrade the kubelet and kubectl
-->
### 升级 kubelet 和 kubectl

- 升级 kubelet 和 kubectl

  {{< tabs name="k8s_install_kubelet" >}}
  {{% tab name="Ubuntu、Debian 或 HypriotOS" %}}

  <pre>
  # 用最新的补丁版本替换 {{< skew latestVersion >}}.x-00 中的 x
  apt-mark unhold kubelet kubectl && \
  apt-get update && apt-get install -y kubelet={{< skew latestVersion >}}.x-00 kubectl={{< skew latestVersion >}}.x-00 && \
  apt-mark hold kubelet kubectl
  - 
  # 从 apt-get 的 1.1 版本开始，你也可以使用下面的方法：
  apt-get update && \
  apt-get install -y --allow-change-held-packages kubelet={{< skew latestVersion >}}.x-00 kubectl={{< skew latestVersion >}}.x-00
  </pre>
  {{% /tab %}}
  {{% tab name="CentOS、RHEL 或 Fedora" %}}
 
  <pre> 
  # 用最新的补丁版本号替换 {{< skew latestVersion >}}.x-00 中的 x
  yum install -y kubelet-{{< skew latestVersion >}}.x-0 kubectl-{{< skew latestVersion >}}.x-0 --disableexcludes=kubernetes
  </pre>
  {{% /tab %}}
  {{< /tabs >}}

<!--
- Restart the kubelet
-->
- 重启 kubelet

  ```shell
  sudo systemctl daemon-reload
  sudo systemctl restart kubelet
  ```

<!--
### Uncordon the node

- Bring the node back online by marking it schedulable:

  ```shell
  # replace <node-to-drain> with the name of your node
  kubectl uncordon <node-to-drain>

-->
### 解除节点的保护

- 通过将节点标记为可调度，让其重新上线：

  ```shell
  # 将 <node-to-drain> 替换为你的节点名称
  kubectl uncordon <node-to-drain>
  ```

<!--
## Upgrade worker nodes

The upgrade procedure on worker nodes should be executed one node at a time or few nodes at a time,
without compromising the minimum required capacity for running your workloads.
-->
## 升级工作节点

工作节点上的升级过程应该一次执行一个节点，或者一次执行几个节点，
以不影响运行工作负载所需的最小容量。

<!--
### Upgrade kubeadm
-->
### 升级 kubeadm

<!--
- Upgrade kubeadm:
-->
- 升级 kubeadm：

  {{< tabs name="k8s_install_kubeadm_worker_nodes" >}}
  {{% tab name="Ubuntu、Debian 或 HypriotOS" %}}
  
  ```shell
  # 将 {{< skew latestVersion >}}.x-00 中的 x 替换为最新的补丁版本号
  apt-mark unhold kubeadm && \
  apt-get update && apt-get install -y kubeadm={{< skew latestVersion >}}.x-00 && \
  apt-mark hold kubeadm
  - 
  # 从 apt-get 的 1.1 版本开始，你也可以使用下面的方法：
  apt-get update && \
  apt-get install -y --allow-change-held-packages kubeadm={{< skew latestVersion >}}.x-00
  ```
  {{% /tab %}}
  {{% tab name="CentOS、RHEL 或 Fedora" %}}
  
  ```shell
  # 用最新的补丁版本替换 {{< skew latestVersion >}}.x-00 中的 x
  yum install -y kubeadm-{{< skew latestVersion >}}.x-0 --disableexcludes=kubernetes
  ```
  {{% /tab %}}
  {{< /tabs >}}

<!--
### Call "kubeadm upgrade"

-  For worker nodes this upgrades the local kubelet configuration:
-->
### 执行 "kubeadm upgrade"

- 对于工作节点，下面的命令会升级本地的 kubelet 配置：

  ```shell
  sudo kubeadm upgrade node
  ```

<!--
### Drain the node

- Prepare the node for maintenance by marking it unschedulable and evicting the workloads:

  ```shell
  # replace <node-to-drain> with the name of your node you are draining
  kubectl drain <node-to-drain> --ignore-daemonsets
  ```
-->
### 腾空节点

- 将节点标记为不可调度并驱逐所有负载，准备节点的维护：

  ```shell
  # 将 <node-to-drain> 替换为你正在腾空的节点的名称
  kubectl drain <node-to-drain> --ignore-daemonsets
  ```

<!--
### Upgrade kubelet and kubectl
-->
### 升级 kubelet 和 kubectl

<!--
-  Upgrade the kubelet and kubectl:
-->
- 升级 kubelet 和 kubectl：

  {{< tabs name="k8s_kubelet_and_kubectl" >}}
  {{% tab name="Ubuntu、Debian 或 HypriotOS" %}}
  
  ```shell
  # 将 {{< skew latestVersion >}}.x-00 中的 x 替换为最新的补丁版本
  apt-mark unhold kubelet kubectl && \
  apt-get update && apt-get install -y kubelet={{< skew latestVersion >}}.x-00 kubectl={{< skew latestVersion >}}.x-00 && \
  apt-mark hold kubelet kubectl
  
  # 从 apt-get 的 1.1 版本开始，你也可以使用下面的方法：
  
  apt-get update && \
  apt-get install -y --allow-change-held-packages kubelet={{< skew latestVersion >}}.x-00 kubectl={{< skew latestVersion >}}.x-00
  ```
  
  {{% /tab %}}
  {{% tab name="CentOS, RHEL or Fedora" %}}
  
  ```shell
  # 将 {{< skew latestVersion >}}.x-0 x 替换为最新的补丁版本
  yum install -y kubelet-{{< skew latestVersion >}}.x-0 kubectl-{{< skew latestVersion >}}.x-0 --disableexcludes=kubernetes
  ```
  {{% /tab %}}
  {{< /tabs >}}

<!--
- Restart the kubelet

    ```shell
    sudo systemctl daemon-reload
    sudo systemctl restart kubelet
    ```
-->
- 重启 kubelet

  ```shell
  sudo systemctl daemon-reload
  sudo systemctl restart kubelet
  ```
<!--
### Uncordon the node
-->
### 取消对节点的保护

<!--
-  Bring the node back online by marking it schedulable:

    ```shell
    # replace <node-to-drain> with the name of your node
    kubectl uncordon <node-to-drain>
    ```
-->
- 通过将节点标记为可调度，让节点重新上线:

  ```shell
  # 将 <node-to-drain> 替换为当前节点的名称
  kubectl uncordon <node-to-drain>
  ```

<!--
## Verify the status of the cluster

After the kubelet is upgraded on all nodes verify that all nodes are available again by running the following command
from anywhere kubectl can access the cluster:

```shell
kubectl get nodes
```
-->
## 验证集群的状态

在所有节点上升级 kubelet 后，通过从 kubectl 可以访问集群的任何位置运行以下命令，
验证所有节点是否再次可用：

```shell
kubectl get nodes
```

<!--
The `STATUS` column should show `Ready` for all your nodes, and the version number should be updated.
-->
`STATUS` 应显示所有节点为 `Ready` 状态，并且版本号已经被更新。 

<!--
## Recovering from a failure state

If `kubeadm upgrade` fails and does not roll back, for example because of an unexpected shutdown during execution, you can run `kubeadm upgrade` again.
This command is idempotent and eventually makes sure that the actual state is the desired state you declare.

To recover from a bad state, you can also run `kubeadm upgrade--force` without changing the version that your cluster is running.
-->
## 从故障状态恢复

如果 `kubeadm upgrade` 失败并且没有回滚，例如由于执行期间节点意外关闭，
你可以再次运行 `kubeadm upgrade`。
此命令是幂等的，并最终确保实际状态是你声明的期望状态。
要从故障状态恢复，你还可以运行 `kubeadm upgrade --force` 而无需更改集群正在运行的版本。

<!--
During upgrade kubeadm writes the following backup folders under `/etc/kubernetes/tmp`:
- `kubeadm-backup-etcd-<date>-<time>`
- `kubeadm-backup-manifests-<date>-<time>`

`kubeadm-backup-etcd` contains a backup of the local etcd member data for this control-plane Node.
In case of an etcd upgrade failure and if the automatic rollback does not work, the contents of this folder
can be manually restored in `/var/lib/etcd`. In case external etcd is used this backup folder will be empty.

`kubeadm-backup-manifests` contains a backup of the static Pod manifest files for this control-plane Node.
In case of a upgrade failure and if the automatic rollback does not work, the contents of this folder can be
manually restored in `/etc/kubernetes/manifests`. If for some reason there is no difference between a pre-upgrade
and post-upgrade manifest file for a certain component, a backup file for it will not be written.
-->
在升级期间，kubeadm 向 `/etc/kubernetes/tmp` 目录下的如下备份文件夹写入数据：

- `kubeadm-backup-etcd-<date>-<time>`
- `kubeadm-backup-manifests-<date>-<time>`

`kubeadm-backup-etcd` 包含当前控制面节点本地 etcd 成员数据的备份。
如果 etcd 升级失败并且自动回滚也无法修复，则可以将此文件夹中的内容复制到
`/var/lib/etcd` 进行手工修复。如果使用的是外部的 etcd，则此备份文件夹为空。

`kubeadm-backup-manifests` 包含当前控制面节点的静态 Pod 清单文件的备份版本。
如果升级失败并且无法自动回滚，则此文件夹中的内容可以复制到
`/etc/kubernetes/manifests` 目录实现手工恢复。
如果由于某些原因，在升级前后某个组件的清单未发生变化，则 kubeadm 也不会为之
生成备份版本。

<!--
## How it works

`kubeadm upgrade apply` does the following:

- Checks that your cluster is in an upgradeable state:
  - The API server is reachable
  - All nodes are in the `Ready` state
  - The control plane is healthy
- Enforces the version skew policies.
- Makes sure the control plane images are available or available to pull to the machine.
- Generates replacements and/or uses user supplied overwrites if component configs require version upgrades.
- Upgrades the control plane components or rollbacks if any of them fails to come up.
- Applies the new `kube-dns` and `kube-proxy` manifests and makes sure that all necessary RBAC rules are created.
- Creates new certificate and key files of the API server and backs up old files if they're about to expire in 180 days.
-->
## 工作原理

`kubeadm upgrade apply` 做了以下工作：

- 检查你的集群是否处于可升级状态:
  - API 服务器是可访问的
  - 所有节点处于 `Ready` 状态
  - 控制面是健康的
- 强制执行版本偏差策略。
- 确保控制面的镜像是可用的或可拉取到服务器上。
- 如果组件配置要求版本升级，则生成替代配置与/或使用用户提供的覆盖版本配置。
- 升级控制面组件或回滚（如果其中任何一个组件无法启动）。
- 应用新的 `kube-dns` 和 `kube-proxy` 清单，并强制创建所有必需的 RBAC 规则。
- 如果旧文件在 180 天后过期，将创建 API 服务器的新证书和密钥文件并备份旧文件。

<!--
`kubeadm upgrade node` does the following on additional control plane nodes:

- Fetches the kubeadm `ClusterConfiguration` from the cluster.
- Optionally backups the kube-apiserver certificate.
- Upgrades the static Pod manifests for the control plane components.
- Upgrades the kubelet configuration for this node.
-->
`kubeadm upgrade node` 在其他控制平节点上执行以下操作：

- 从集群中获取 kubeadm `ClusterConfiguration`。
- （可选操作）备份 kube-apiserver 证书。
- 升级控制平面组件的静态 Pod 清单。
- 为本节点升级 kubelet 配置

<!--
`kubeadm upgrade node` does the following on worker nodes:

- Fetches the kubeadm `ClusterConfiguration` from the cluster.
- Upgrades the kubelet configuration for this node.
-->
`kubeadm upgrade node` 在工作节点上完成以下工作：

- 从集群取回 kubeadm `ClusterConfiguration`。 
- 为本节点升级 kubelet 配置。

