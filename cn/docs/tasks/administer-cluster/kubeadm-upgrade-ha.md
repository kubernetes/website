---
reviewers:
- jamiehannaford 
- luxas
- timothysc 
- jbeda
title: 将 kubeadm HA 集群从 1.9.x 升级到 1.9.y
cn-approvers:
- chentao1596
---
<!--
---
reviewers:
- jamiehannaford 
- luxas
- timothysc 
- jbeda
title: Upgrading kubeadm HA clusters from 1.9.x to 1.9.y
---
-->

{% capture overview %}

<!--
This guide is for upgrading `kubeadm` HA clusters from version 1.9.x to 1.9.y where `y > x`. The term "`kubeadm` HA clusters" refers to clusters of more than one master node created with `kubeadm`. To set up an HA cluster for Kubernetes version 1.9.x `kubeadm` requires additional manual steps. See [Creating HA clusters with kubeadm](/docs/setup/independent/high-availability/) for instructions on how to do this. The upgrade procedure described here targets clusters created following those very instructions. See [Upgrading/downgrading kubeadm clusters between v1.8 to v1.9](/docs/tasks/administer-cluster/kubeadm-upgrade-1-9/) for more instructions on how to create an HA cluster with `kubeadm`.
-->
本指南用于将 `kubeadm` HA 集群从版本 1.9.x 升级到 1.9.y，其中`y > x`。术语 "`kubeadm` HA clusters" 是指由 `kubeadm` 创建的包含多于一个 master 节点的集群。要为 Kubernetes 1.9.x 版本设置 HA 集群，`kubeadm` 需要额外的手动步骤。有关如何执行此操作的说明，请参阅 [使用 kubeadm 创建 HA 集群](/docs/setup/independent/high-availability/)。此处描述的升级过程的目标是按照这些说明创建的集群。请参阅 [在 v1.8 到 v1.9 之间升级/降级 kubeadm 集群](/docs/tasks/administer-cluster/kubeadm-upgrade-1-9/) 以获取有关如何使用 `kubeadm` 创建 HA 集群的更多说明。

{% endcapture %}

{% capture prerequisites %}

<!--
Before proceeding:
-->
在进行前：

<!--
- You need to have a functional `kubeadm` HA cluster running version 1.9.0 or higher in order to use the process described here.
- Make sure you read the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.9.md) carefully.
- Note that `kubeadm upgrade` will not touch any of your workloads, only Kubernetes-internal components. As a best-practice you should back up anything important to you. For example, any application-level state, such as a database and application might depend on (like MySQL or MongoDB) should be backed up beforehand.
- Read [Upgrading/downgrading kubeadm clusters between v1.8 to v1.9](/docs/tasks/administer-cluster/kubeadm-upgrade-1-9/) to learn about the relevant prerequisites.
-->
- 为了使用这里的描述过程，您需要有一个运行 1.9.0 或者更高版本的 `kubeadm` HA 集群。
- 确保您仔细阅读 [发布说明](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.9.md)。
- 请注意，`kubeadm upgrade` 不会触及任何您的工作负载，只有 Kubernetes 内部组件。作为一种最佳做法，您应该备份对您而言重要的任何内容。例如，应该预先备份任何应用级别的状态，如应用可能依赖的数据库（如 MySQL 或 MongoDB）。
- 阅读 [在 v1.8 到 v1.9 之间升级/降级 kubeadm 集群](/docs/tasks/administer-cluster/kubeadm-upgrade-1-9/) 以了解相关的先决条件。

{% endcapture %}

{% capture steps %}

<!--
## Preparation
-->
## 准备工作

<!--
Some preparation is needed prior to starting the upgrade. First download the version of `kubeadm` that matches the version of Kubernetes that you are upgrading to:
-->
开始升级之前需要做一些准备工作。首先下载与您要升级到的 Kubernetes 版本相匹配的 `kubeadm` 的版本：

<!--
```shell
# Use the latest stable release or manually specify a
# released Kubernetes version
export VERSION=$(curl -sSL https://dl.k8s.io/release/stable.txt) 
export ARCH=amd64 # or: arm, arm64, ppc64le, s390x
curl -sSL https://dl.k8s.io/release/${VERSION}/bin/linux/${ARCH}/kubeadm > /tmp/kubeadm
chmod a+rx /tmp/kubeadm
```
-->
```shell
# 使用最新的稳定版
# 或者手动指定已经发布的版本
export VERSION=$(curl -sSL https://dl.k8s.io/release/stable.txt) 
export ARCH=amd64 # 或者：arm、arm64、ppc64le、s390x
curl -sSL https://dl.k8s.io/release/${VERSION}/bin/linux/${ARCH}/kubeadm > /tmp/kubeadm
chmod a+rx /tmp/kubeadm
```

<!--
Copy this file to `/tmp` on your primary master if necessary. Run this command for checking prerequisites and determining the versions you will receive:
-->
如有必要，将该文件复制到您主 master 的 `/tmp` 下。运行此命令以检查先决条件并确定您将收到的版本：

```shell
/tmp/kubeadm upgrade plan
```

<!--
If the prerequisites are met you'll get a summary of the software versions kubeadm will upgrade to, like this:
-->
如果满足先决条件，您将获得 kubeadm 将升级到的软件版本的摘要，如下所示：

    Upgrade to the latest stable version:

    COMPONENT            CURRENT   AVAILABLE
    API Server           v1.9.0    v1.9.2
    Controller Manager   v1.9.0    v1.9.2
    Scheduler            v1.9.0    v1.9.2
    Kube Proxy           v1.9.0    v1.9.2
    Kube DNS             1.14.5    1.14.7
    Etcd                 3.2.7     3.1.11

<!--
**Caution:** Currently the only supported configuration for kubeadm HA clusters requires the use of an externally managed etcd cluster. Upgrading etcd is not supported as a part of the upgrade. If necessary you will have to upgrade the etcd cluster according to [etcd's upgrade instructions](/docs/tasks/administer-cluster/configure-upgrade-etcd/), which is beyond the scope of these instructions.
-->
**警告：** 目前，kubeadm HA 集群唯一受支持的配置需要使用外部管理的 etcd 集群。作为升级的一部分，不支持升级 etcd。如有必要，您将不得不根据 [etcd 升级说明](/docs/tasks/administer-cluster/configure-upgrade-etcd/) 升级 etcd 集群，这超出了这些说明的范围。
{: .caution}

<!--
## Upgrading your control plane
-->
## 升级您的控制平面

<!--
The following procedure must be applied on a single master node and repeated for each subsequent master node sequentially.
-->
以下过程必须应用于单个 master 节点，并对每个后续 master 节点顺序重复。

<!--
Before initiating the upgrade with `kubeadm` `configmap/kubeadm-config` needs to be modified for the current master host. Replace any hard reference to a master host name with the current master hosts' name:
-->
在使用 `kubeadm` `configmap/kubeadm-config` 启动升级之前，需要修改当前 master 主机。用当前 master 主机的名称替换对 master 主机名的任何硬件引用：

```shell
kubectl get configmap -n kube-system kubeadm-config -o yaml >/tmp/kubeadm-config-cm.yaml
sed -i 's/^\([ \t]*nodeName:\).*/\1 <CURRENT-MASTER-NAME>/' /tmp/kubeadm-config-cm.yaml
kubectl apply -f /tmp/kubeadm-config-cm.yaml --force
```

<!--
Now the upgrade process can start. Use the target version determined in the preparation step and run the following command (press “y” when prompted):
-->
现在升级过程可以开始了。使用准备步骤中确定的目标版本并运行以下命令（出现提示时按 “y” 键）：

```shell
/tmp/kubeadm upgrade apply v<YOUR-CHOSEN-VERSION-HERE>
```

<!--
If the operation was successful you’ll get a message like this:
-->
如果操作成功，您将得到如下消息：

    [upgrade/successful] SUCCESS! Your cluster was upgraded to "v1.9.2". Enjoy!

<!--
To upgrade the cluster with CoreDNS as the default internal DNS, invoke `kubeadm upgrade apply` with the `--feature-gates=CoreDNS=true` flag.
-->
要使用 CoreDNS 作为集群内部默认的 DNS 升级集群，请使用 `--feature-gates=CoreDNS=true` 标志调用 `kubeadm upgrade apply`。

<!--
Next, manually upgrade your CNI provider
-->
接下来，手动升级您的 CNI 提供商。

<!--
Your Container Network Interface (CNI) provider may have its own upgrade instructions to follow. Check the [addons](/docs/concepts/cluster-administration/addons/) page to find your CNI provider and see if there are additional upgrade steps necessary.
-->
您的容器网络接口（CNI）提供商可能有自己的升级说明。检查 [插件](/docs/concepts/cluster-administration/addons/) 页面找到您的 CNI 提供商，并查看是否需要额外的升级步骤。

<!--
**Note:** The `kubeadm upgrade apply` step has been known to fail when run initially on the secondary masters (timed out waiting for the restarted static pods to come up). It should succeed if retried after a minute or two.
-->
**注意：** `kubeadm upgrade apply` 在辅助的 master 上初始运行时，该步骤会失败（等待重新启动的静态 pod 出现超时）。如果在一两分钟后重试，它应该成功。
{: .note}

<!--
## Upgrade base software packages
-->
## 升级基础软件包

<!--
At this point all the static pod manifests in your cluster, for example API Server, Controller Manager, Scheduler, Kube Proxy have been upgraded, however the base software, for example `kubelet`, `kubectl`, `kubeadm` installed on your nodes’ OS are still of the old version. For upgrading the base software packages we will upgrade them and restart services on all nodes one by one:
-->
此时，所有您集群中的静态 pod，例如 API Server、Controller Manager、Scheduler、Kube Proxy ，已经升级，但是基础软件，例如安装在您 node 的 OS 上的 `kubelet`、`kubectl`、`kubeadm` 仍然是旧版本。为了升级基础软件包，我们将升级它们并在所有节点上逐一重启服务：

<!--
```shell
# use your distro's package manager, e.g. 'yum' on RH-based systems
# for the versions stick to kubeadm's output (see above)
yum install -y kubelet-<NEW-K8S-VERSION> kubectl-<NEW-K8S-VERSION> kubeadm-<NEW-K8S-VERSION> kubernetes-cni-<NEW-CNI-VERSION>
systemctl restart kubelet
```
-->
```shell
# 使用发行版的包管理器，例如：基于 RH 系统的 'yum'
# 具体版本号，请遵守 kubeadm 的输出（见上文）
yum install -y kubelet-<NEW-K8S-VERSION> kubectl-<NEW-K8S-VERSION> kubeadm-<NEW-K8S-VERSION> kubernetes-cni-<NEW-CNI-VERSION>
systemctl restart kubelet
```

<!--
In this example an _rpm_-based system is assumed and `yum` is used for installing the upgraded software. On _deb_-based systems it will be `apt-get update` and then `apt-get install <PACKAGE>=<NEW-K8S-VERSION>` for all packages.
-->
在这个例子中，是假设一个基于 _rpm_ 的系统，它使用 `yum` 安装升级后的软件。在基于 _deb_ 的系统上，它将是 `apt-get update`，然后使用 `apt-get install <PACKAGE>=<NEW-K8S-VERSION>` 安装所有软件包。

<!--
Now the new version of the `kubelet` should be running on the host. Verify this using the following command on the respective host:
-->
现在新版本 `kubelet` 应该在主机上运行。在相应的主机上使用以下命令验证它：

```shell
systemctl status kubelet
```

<!--
Verify that the upgraded node is available again by executing the following from wherever you run `kubectl` commands:
-->
从运行 `kubectl` 命令的任何位置执行以下命令，验证升级后的节点是否可用：

```shell
kubectl get nodes
```

<!--
If the `STATUS` column of the above command shows `Ready` for the upgraded host, you can continue (you may have to repeat this for a couple of time before the node gets `Ready`).
-->
如果上面命令输出结果的 `STATUS` 列显示升级后的主机是 `Ready`，则可以继续（在节点获得 `Ready` 之前，您可能需要重复此操作几次）。

<!--
## If something goes wrong
-->
## 如果出现问题

<!--
If the upgrade fails the situation afterwards depends on the phase in which things went wrong:
-->
如果升级失败，事后的情况取决于事情出错的阶段：

<!--
1. If `/tmp/kubeadm upgrade apply` failed to upgrade the cluster it will try to perform a rollback. Hence if that happened on the first master, chances are pretty good that the cluster is still intact.

   You can run `/tmp/kubeadm upgrade apply` again as it is idempotent and should eventually make sure the actual state is the desired state you are declaring. You can use `/tmp/kubeadm upgrade apply` to change a running cluster with `x.x.x --\> x.x.x` with `--force`, which can be used to recover from a bad state.
-->
1. 如果 `/tmp/kubeadm upgrade apply` 升级集群失败，它将尝试执行回滚。因此，如果这种情况发生在第一个 master 身上，那么集群仍然完好无损的可能性很大。

   您可以再次运行 `/tmp/kubeadm upgrade apply`，因为它是幂等的，最终应确保实际状态是您声明的所需状态。您可以使用参数 `--force` 运行 `/tmp/kubeadm upgrade apply` 命令更改运行的集群为 `x.x.x --> x.x.x`，它可用于从糟糕的状态中恢复过来。

<!--
2. If `/tmp/kubeadm upgrade apply` on one of the secondary masters failed you still have a working, upgraded cluster, but with the secondary masters in a somewhat undefined condition. You will have to find out what went wrong and join the secondaries manually. As mentioned above, sometimes upgrading one of the secondary masters fails waiting for the restarted static pods first, but succeeds when the operation is simply repeated after a little pause of one or two minutes. 
-->
2. 如果 `/tmp/kubeadm upgrade apply` 是在其中一个辅助 master 上失败，则仍然有一个正在工作的已经升级的集群，但辅助 master 的状态有些不确定。您将不得不找出哪里出了问题，并手动加入辅助 master。如上所述，有时升级其中一个辅助 master 时，首先等待重新启动的静态 pod 失败，但在一两分钟的暂停后简单地重复该操作时会成功。

{% endcapture %}

{% include templates/task.md %}
