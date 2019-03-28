---
reviewers:
- jamiehannaford
- luxas
- timothysc
- jbeda
title: 将 kubeadm 高可用集群从 v1.11 升级到 v1.12
content_template: templates/task
---

<!--
---
reviewers:
- jamiehannaford
- luxas
- timothysc
- jbeda
title: Upgrading kubeadm HA clusters from v1.11 to v1.12x
content_template: templates/task
---
-->

{{% capture overview %}}

<!--
This page explains how to upgrade a highly available (HA) Kubernetes cluster created with `kubeadm` from version 1.11.x to version 1.12.x. In addition to upgrading, you must also follow the instructions in [Creating HA clusters with kubeadm](/docs/setup/independent/high-availability/).
-->
本页介绍了如何将基于 kubeadm 创建的 Kubernetes HA 集群从 1.11.x 版本升级到 1.12.x 版本。除了升级，您还必须遵守[使用 kubeadm 创建 HA 集群](/docs/setup/independent/high-availability/) 的相关说明。

{{% /capture %}}

{{% capture prerequisites %}}

<!--
Before proceeding:
-->
在继续之前：

<!--
- You need to have a `kubeadm` HA cluster running version 1.11 or higher.
- Make sure you read the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.12.md) carefully.
- Make sure to back up any important components, such as app-level state stored in a database. `kubeadm upgrade` does not touch your workloads, only components internal to Kubernetes, but backups are always a best practice.
- Check the prerequisites for [Upgrading/downgrading kubeadm clusters between v1.11 to v1.12](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-12/).
-->

- 您需要一个 1.11 或更高版本的 kubeadm 高可用集群。
- 请务必仔细阅读[发行说明](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.12.md)。
- 确保备份所有重要组件，比如存储在数据库中的应用程序级状态。`kubeadm upgrade` 不涉及您的工作负载，只涉及 Kubernetes 内部的组件，但备份始终是最佳实践。
- 检查[在 v1.11 到 v1.12 之间升级/降级 kubeadm 集群](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-12/) 的条件。

{{< note >}}

<!--
All commands on any control plane or etcd node should be run as root.
-->
任何控制平面或 etcd 节点上的所有命令都应以 root 身份运行。

{{< /note >}}

{{% /capture %}}

{{% capture steps %}}

<!--
## Prepare for both methods

Upgrade `kubeadm` to the version that matches the version of Kubernetes that you are upgrading to:
-->

## 准备两种方法

升级 `kubeadm` 到与要升级到的 Kubernetes 版本匹配的版本：

```shell
apt-mark unhold kubeadm && \
apt-get update && apt-get install -y kubeadm && \
apt-mark hold kubeadm
```

<!--
Check prerequisites and determine the upgrade versions:
-->
检查条件并确定升级版本：

```shell
kubeadm upgrade plan
```

<!--
You should see something like the following:
-->
您应该看到如下内容：

    Upgrade to the latest stable version:

    COMPONENT            CURRENT   AVAILABLE
    API Server           v1.11.3   v1.12.0
    Controller Manager   v1.11.3   v1.12.0
    Scheduler            v1.11.3   v1.12.0
    Kube Proxy           v1.11.3   v1.12.0
    CoreDNS              1.1.3     1.2.2
    Etcd                 3.2.18    3.2.24

<!--
## Stacked control plane nodes

### Upgrade the first control plane node

Modify `configmap/kubeadm-config` for this control plane node:
-->

## 叠加控制平面节点

### 升级第一个控制平面节点

为该控制平面节点修改 `configmap/kubeadm-config` 文件：

```shell
kubectl get configmap -n kube-system kubeadm-config -o yaml > kubeadm-config-cm.yaml
```

<!--
Open the file in an editor and replace the following values:
-->
在编辑器中打开文件并替换以下值：

<!--
    This should be set to the local node's IP address.
    This should be updated to the local node's IP address.
    This should be updated to the local node's IP address.
    This should be updated to the local node's IP address.
    This should be updated to the local node's IP address.       
-->

<!--
    This should be updated to include the hostname and IP address pairs for each control plane node in the cluster. For example:
-->


- `api.advertiseAddress`

    应将其设置为本地节点的 IP 地址。

- `etcd.local.extraArgs.advertise-client-urls`

    此值应该更新为本地节点的 IP 地址。

- `etcd.local.extraArgs.initial-advertise-peer-urls`

    此值应该更新为本地节点的 IP 地址。

- `etcd.local.extraArgs.listen-client-urls`

    此值应该更新为本地节点的 IP 地址。

- `etcd.local.extraArgs.listen-peer-urls`

    此值应该更新为本地节点的 IP 地址。

- `etcd.local.extraArgs.initial-cluster`

    应更新此项以包含群集中每个控制平面节点的主机名和 IP 地址对。例如：

        "ip-172-31-92-42=https://172.31.92.42:2380,ip-172-31-89-186=https://172.31.89.186:2380,ip-172-31-90-42=https://172.31.90.42:2380"

<!--
You must also pass an additional argument (`initial-cluster-state: existing`) to etcd.local.extraArgs.
-->
您还必须将另一个参数（`initial-cluster-state: existing`）传递给 etcd.local.extraArgs。

```shell
kubectl apply -f kubeadm-config-cm.yaml --force
```

<!--
Start the upgrade:
-->
开始升级：

```shell
kubeadm upgrade apply v<YOUR-CHOSEN-VERSION-HERE>
```

<!--
You should see something like the following:
-->
您应该看到如下内容：

    [upgrade/successful] SUCCESS! Your cluster was upgraded to "v1.12.0". Enjoy!

<!--
The `kubeadm-config` ConfigMap is now updated from `v1alpha2` version to `v1alpha3`.

### Upgrading additional control plane nodes

Each additional control plane node requires modifications that are different from the first control plane node. Run:
-->

`kubeadm-config` ConfigMap 现在从 `v1alpha2` 版本更新为 `v1alpha3`。

## 升级其他控制平面节点

每个额外的控制平面节点都需要与第一个控制平面节点做不同的修改。运行：

```shell
kubectl get configmap -n kube-system kubeadm-config -o yaml > kubeadm-config-cm.yaml
```

<!--
Open the file in an editor and replace the following values for `ClusterConfiguration`:
-->
在编辑器中打开文件并为 `ClusterConfiguration` 替换以下值：

<!--
    This should be updated to the local node's IP address.
    This should be updated to the local node's IP address.
    This should be updated to the local node's IP address.
    This should be updated to the local node's IP address.
-->


- `etcd.local.extraArgs.advertise-client-urls`

    这应该更新为本地节点的 IP 地址。

- `etcd.local.extraArgs.initial-advertise-peer-urls`

   这应该更新为本地节点的 IP 地址。

- `etcd.local.extraArgs.listen-client-urls`

    这应该更新为本地节点的 IP 地址。

- `etcd.local.extraArgs.listen-peer-urls`

   这应该更新为本地节点的 IP 地址。

<!--
You must also modify the `ClusterStatus` to add a mapping for the current host under apiEndpoints.

Add an annotation for the cri-socket to the current node, for example to use docker:
-->
您还必须修改 `ClusterStatus`， 为 apiEndpoints 下的当前主机添加映射。

将 cri-socket 的注解添加到当前节点，例如使用 docker：

```shell
kubectl annotate node <nodename> kubeadm.alpha.kubernetes.io/cri-socket=/var/run/dockershim.sock
```

<!--
Apply the modified kubeadm-config on the node:
-->
在节点上应用修改后的 kubeadm-config：

```shell
kubectl apply -f kubeadm-config-cm.yaml --force
```

<!--
Start the upgrade:
-->
开始升级：

```shell
kubeadm upgrade apply v<YOUR-CHOSEN-VERSION-HERE>
```

<!--
You should see something like the following:
-->
您应该看到如下内容：

    [upgrade/successful] SUCCESS! Your cluster was upgraded to "v1.12.0". Enjoy!

<!--
## External etcd

### Upgrade each control plane

Get a copy of the kubeadm config used to create this cluster. The config should be the same for every node. The config must exist on every control plane node before the upgrade begins.
-->

## 外部 etcd

### 升级每个控制平面

获取用于创建集群的 kubeadm 配置的副本。所有节点的配置应该相同。在升级开始之前，配置必须存在于每个控制平面节点上。

<!--
# on each control plane node
-->

```
# 在每个控制平面节点上
kubectl get configmap -n kube-system kubeadm-config -o jsonpath={.data.MasterConfiguration} > kubeadm-config.yaml
```

<!--
Open the file in an editor and set `api.advertiseAddress` to the local node's IP address.

Now run the upgrade on each control plane node one at a time.
-->
在编辑器中打开文件并设置 `api.advertiseAddress` 为本地节点的 IP 地址。

现在，在每个控制平面节点上分别执行升级命令。

```
kubeadm upgrade apply v1.12.0 --config kubeadm-config.yaml
```

<!--
### Upgrade etcd

Kubernetes v1.11 to v1.12 only changed the patch version of etcd from v3.2.18 to v3.2.24. This is a rolling upgrade with no downtime, because you can run both versions in the same cluster.

On the first host, modify the etcd manifest:
-->

### 升级 etcd

Kubernetes v1.11 至 v1.12 只将 etcd 的 patch 版本从 v3.2.18 更改为 v3.2.24。这是一个滚动升级，没有停机时间，因为您可以在同一个集群中运行两个版本。

在第一台主机上，修改 etcd 清单：

```shell
sed -i 's/3.2.18/3.2.24/' /etc/kubernetes/manifests/etcd.yaml
```

<!--
Wait for the etcd process to reconnect. There will be error warnings in the other etcd node logs. This is expected.

Repeat this step on the other etcd hosts.

## Next steps

### Manually upgrade your CNI provider

Your Container Network Interface (CNI) provider might have its own upgrade instructions to follow. Check the [addons](/docs/concepts/cluster-administration/addons/) page to find your CNI provider and see whether you need to take additional upgrade steps.

### Update kubelet and kubectl packages

Upgrade the kubelet and kubectl by running the following on each node:
-->

等待 etcd 进程重新连接。其他 etcd 节点日志中将出现错误警告。这是预料之中的。

在其他 etcd 主机上重复此步骤。

## 下一步

### 手动升级您的 CNI 提供商

您的容器网络接口（CNI）提供程序可能有自己的升级说明。检查[插件](/zh/docs/concepts/cluster-administration/addons/)页面找到您的 CNI 提供商，看看是否需要采取其他升级步骤。

### 更新 kubelet 和 kubectl 包

通过在每个节点上运行以下命令来升级 kubelet 和 kubectl：

<!--
# use your distro's package manager, e.g. 'apt-get' on Debian-based systems
# for the versions stick to kubeadm's output (see above)
-->

```shell
# 使用你的发行版软件包管理器，例如基于 Debian 系统上的 'apt-get' 
# 对于版本，基于 kubeadm 的输出来设置(参见上文)
apt-mark unhold kubelet kubectl && \
apt-get update && \
apt-get install kubelet=<NEW-K8S-VERSION> kubectl=<NEW-K8S-VERSION> && \
apt-mark hold kubelet kubectl && \
systemctl restart kubelet
```

<!--
In this example a _deb_-based system is assumed and `apt-get` is used for installing the upgraded software. On rpm-based systems the command is `yum install <PACKAGE>=<NEW-K8S-VERSION>` for all packages.

Verify that the new version of the kubelet is running:
-->
本例假设使用一个基于 _deb_ 的系统，并使用 `apt-get` 安装升级后的软件。在基于 rpm 的系统上，对于所有软件包都使用 `yum install <PACKAGE>=<NEW-K8S-VERSION>` 命令。

验证新版本的 `kubelet` 是否正在运行：

```shell
systemctl status kubelet
```

<!--
Verify that the upgraded node is available again by running the following command from wherever you run `kubectl`:
-->
无论当前路径在哪里，使用 `kubectl` 运行以下命令，再次验证已升级的节点是否可用：

```shell
kubectl get nodes
```

<!--
If the `STATUS` column shows `Ready` for the upgraded host, you can continue. You might need to repeat the command until the node shows `Ready`.
-->
如果对于升级后的主机其 `STATUS` 列显示 `Ready`，则可以继续；否则您可能需要重复该命令，直到节点显示 `Ready`。

<!--
## If something goes wrong

If the upgrade fails, see whether one of the following scenarios applies:

- If `kubeadm upgrade apply` failed to upgrade the cluster, it will try to perform a rollback. If this is the case on the first master, the cluster is probably still intact.

   You can run `kubeadm upgrade apply` again, because it is idempotent and should eventually make sure the actual state is the desired state you are declaring. You can run `kubeadm upgrade apply` to change a running cluster with `x.x.x -> x.x.x` with `--force` to recover from a bad state.

- If `kubeadm upgrade apply` on one of the secondary masters failed, the cluster is upgraded and working, but the secondary masters are in an undefined state. You need to investigate further and join the secondaries manually.
-->

## 如果出现问题

如果升级失败，请检查是否符合以下列出的可能场景：

- 如果 `kubeadm upgrade apply` 无法升级集群，它将尝试执行回滚。如果在第一个主控节点上就是这种情况，则集群可能仍然完好无损。

   您可以再次运行 `kubeadm upgrade apply`，因为它是幂等的，最终应该确保实际状态是您声明的期望状态。您可以运行 `kubeadm upgrade apply` 并设置参数 `--force` 请求"更新"正在运行的集群（从 `x.x.x --> x.x.x` ），尝试从错误状态中恢复。

- 如果其他节点上的 `kubeadm upgrade apply` 失败，则集群已经升级并运行，只是这些节点处于未定义的状态。您需要进一步调试并手动将其加入集群。

{{% /capture %}}

