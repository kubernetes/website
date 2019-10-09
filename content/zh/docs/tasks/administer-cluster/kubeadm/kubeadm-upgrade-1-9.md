---
reviewers:
- pipejakob
- luxas
- roberthbailey
- jbeda
title: 将 kubeadm 集群在 v1.8 版本到 v1.9 版本之间升级/降级 
content_template: templates/task
---

<!--

---
reviewers:
- pipejakob
- luxas
- roberthbailey
- jbeda
title: Upgrading/downgrading kubeadm clusters between v1.8 to v1.9
content_template: templates/task
---

--->

{{% capture overview %}}

<!--

This guide is for upgrading `kubeadm` clusters from version 1.8.x to 1.9.x, as well as 1.8.x to 1.8.y and 1.9.x to 1.9.y where `y > x`.
See also [upgrading kubeadm clusters from 1.7 to 1.8](/docs/tasks/administer-cluster/kubeadm-upgrade-1-8/) if you're on a 1.7 cluster currently.

--->
本文主要描述如何将 `kubeadm` 集群从 1.8.x 版本升级到 1.9.x 版本，包括从 1.8.x 版本升级到 1.8.y 版本，和从版本 1.9.x 版本到 1.9.y 版本（`y > x`）。
如果您目前安装的是集群是 1.7 版本，也可以查看[ kubeadm clusters 集群从 1.7 版本升级到 1.8 版本](/docs/tasks/administer-cluster/kubeadm-upgrade-1-8/)
{{% /capture %}}

{{% capture prerequisites %}}
<!--

Before proceeding:

- You need to have a functional `kubeadm` Kubernetes cluster running version 1.8.0 or higher in order to use the process described here. Swap also needs to be disabled.
- Make sure you read the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.9.md) carefully.
- `kubeadm upgrade` now allows you to upgrade etcd. `kubeadm upgrade` will also upgrade of etcd to 3.1.10 as part of upgrading from v1.8 to v1.9 by default. This is due to the fact that etcd 3.1.10 is the officially validated etcd version for Kubernetes v1.9. The upgrade is handled automatically by kubeadm for you.
- Note that `kubeadm upgrade` will not touch any of your workloads, only Kubernetes-internal components. As a best-practice you should back up what's important to you. For example, any app-level state, such as a database an app might depend on (like MySQL or MongoDB) must be backed up beforehand.

--->
升级之前：

- 您需要先安装一个版本为 1.8.0 或更高版本的 `kubeadm` Kubernetes 集群。另外还需要禁用节点的交换分区。
- 一定要认真阅读[发布说明](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.9.md)
- `kubeadm upgrade` 可以更新 etcd。默认情况下，从 Kubernetes 1.8 版本升级到 1.9 版本时，`kubeadm upgrade` 也会升级 etcd 到 3.1.10 版本。这是由于 etcd3.1.10 是官方验证的 etcd 版本对于 kubernetes1.9。kubeadm 为您提供了自动化的升级过程。
- 请注意，`kubeadm upgrade`命令 不会触及任何工作负载，只有 kubernetes 内部组件。作为最佳实践，您应当备份，因为备份相当的重要。例如，任何应用程序级别的状态（如应用程序可能依赖的数据库，如 mysql 或 mongoDB）必须预先备份。
{{< caution >}}
<!--

All the containers will get restarted after the upgrade, due to container spec hash value gets changed.

--->
**注意:** 由于容器的具体哈希值改变了，所有的容器在升级之后会重新启动。

{{< /caution >}}

<!--

Also, note that only one minor version upgrade is supported. For example, you can only upgrade from 1.8 to 1.9, not from 1.7 to 1.9.

--->
同时，也要注意只有小范围的升级是支持的。例如，您只可以从 1.8 版本升级到 1.9 版本，但是不能从 1.7 版本升级到 1.9 版本。


{{% /capture %}}

{{% capture steps %}}
<!--

## Upgrading your control plane

-->
## 升级控制面板
<!--

Execute these commands on your master node:

1. Install the most recent version of `kubeadm` using `curl` like so:

-->
在您的 master 节点上执行这些命令：

1. 使用 `curl` 命令进行安装最新的版本的 `kubeadm` ，例如：
```shell
export VERSION=$(curl -sSL https://dl.k8s.io/release/stable.txt) # or manually specify a released Kubernetes version
export ARCH=amd64 # or: arm, arm64, ppc64le, s390x
curl -sSL https://dl.k8s.io/release/${VERSION}/bin/linux/${ARCH}/kubeadm > /usr/bin/kubeadm
chmod a+rx /usr/bin/kubeadm
```

{{< caution >}}
<!--

Upgrading the `kubeadm` package on your system prior to upgrading the control plane causes a failed upgrade. 
Even though `kubeadm` ships in the Kubernetes repositories, it's important to install `kubeadm` manually. The kubeadm 
team is working on fixing this limitation. 

--->
**注意:** 在您的系统上升级控制面板之前升级 `kubeadm` 包会导致升级失败。
尽管 `kubeadm` ships 在 kubernetes 仓库中，手动安装 `kubeadm` 是重要的。kubeadm 团队在努力解决这种手动安装的限制。
{{< /caution >}}
<!--

Verify that this download of kubeadm works and has the expected version:

--->
验证 kubeadm 下载工作是否正常，并是否有达到预期的版本：
```shell
kubeadm version
```
<!--

2. On the master node, run the following:

--->
2. 在master节点上运行如下命令：
```shell
kubeadm upgrade plan
```
<!--

You should see output similar to this:

--->
可以得到类型的结果：
<!--

```shell
[preflight] Running pre-flight checks
[upgrade] Making sure the cluster is healthy:
[upgrade/health] Checking API Server health: Healthy
[upgrade/health] Checking Node health: All Nodes are healthy
[upgrade/health] Checking Static Pod manifests exists on disk: All manifests exist on disk
[upgrade/config] Making sure the configuration is correct:
[upgrade/config] Reading configuration from the cluster...
[upgrade/config] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -o yaml'
[upgrade] Fetching available versions to upgrade to:
[upgrade/versions] Cluster version: v1.8.1
[upgrade/versions] kubeadm version: v1.9.0
[upgrade/versions] Latest stable version: v1.9.0
[upgrade/versions] Latest version in the v1.8 series: v1.8.6

Components that must be upgraded manually after you've upgraded the control plane with 'kubeadm upgrade apply':

COMPONENT   CURRENT      AVAILABLE
Kubelet     1 x v1.8.1   v1.8.6

Upgrade to the latest version in the v1.8 series:

COMPONENT            CURRENT   AVAILABLE
API Server           v1.8.1    v1.8.6
Controller Manager   v1.8.1    v1.8.6
Scheduler            v1.8.1    v1.8.6
Kube Proxy           v1.8.1    v1.8.6
Kube DNS             1.14.4    1.14.5

You can now apply the upgrade by executing the following command:

    kubeadm upgrade apply v1.8.6

    _____________________________________________________________________

    Components that must be upgraded manually after you've upgraded the control plane with 'kubeadm upgrade apply':

    COMPONENT   CURRENT      AVAILABLE
    Kubelet     1 x v1.8.1   v1.9.0

    Upgrade to the latest stable version:

    COMPONENT            CURRENT   AVAILABLE
    API Server           v1.8.1    v1.9.0
    Controller Manager   v1.8.1    v1.9.0
    Scheduler            v1.8.1    v1.9.0
    Kube Proxy           v1.8.1    v1.9.0
    Kube DNS             1.14.5    1.14.7

    You can now apply the upgrade by executing the following command:

        kubeadm upgrade apply v1.9.0

        Note: Before you do can perform this upgrade, you have to update kubeadm to v1.9.0

_____________________________________________________________________
```
         
--->

  ```shell
 [preflight] Running pre-flight checks
 [upgrade] Making sure the cluster is healthy:
 [upgrade/health] Checking API Server health: Healthy
 [upgrade/health] Checking Node health: All Nodes are healthy
 [upgrade/health] Checking Static Pod manifests exists on disk: All manifests exist on disk
 [upgrade/config] Making sure the configuration is correct:
 [upgrade/config] Reading configuration from the cluster...
 [upgrade/config] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -o yaml'
 [upgrade] Fetching available versions to upgrade to:
 [upgrade/versions] Cluster version: v1.8.1
 [upgrade/versions] kubeadm version: v1.9.0
 [upgrade/versions] Latest stable version: v1.9.0
 [upgrade/versions] Latest version in the v1.8 series: v1.8.6

   在升级控制面板并使用 'kubeadm upgrade apply' 后，必须手动升级组件：
    COMPONENT   CURRENT      AVAILABLE
     Kubelet     1 x v1.8.1   v1.8.6

    升级到最新的 v1.8 系列的版本：
    COMPONENT            CURRENT   AVAILABLE
    API Server           v1.8.1    v1.8.6
    Controller Manager   v1.8.1    v1.8.6
    Scheduler            v1.8.1    v1.8.6
    Kube Proxy           v1.8.1    v1.8.6
    Kube DNS             1.14.4    1.14.5

    您可以通过以下的命令来进行升级：
      kubeadm upgrade apply v1.8.6

    _____________________________________________________________________

    在升级控制面板并使用 'kubeadm upgrade apply' 后，必须手动升级组件：
    COMPONENT   CURRENT      AVAILABLE
    Kubelet     1 x v1.8.1   v1.9.0

    升级到最新和稳定的版本：
    COMPONENT            CURRENT   AVAILABLE
    API Server           v1.8.1    v1.9.0
    Controller Manager   v1.8.1    v1.9.0
    Scheduler            v1.8.1    v1.9.0
    Kube Proxy           v1.8.1    v1.9.0
    Kube DNS             1.14.5    1.14.7

    您可以通过以下命令来进行升级：
    kubeadm upgrade apply v1.9.0

    请注意：在您执行升级之前，您必须升级 kubeadm 到 v1.9.0 版本
_____________________________________________________________________
```
                 
<!--

The `kubeadm upgrade plan` checks that your cluster is upgradeable and fetches the versions available to upgrade to in an user-friendly way.

To check CoreDNS version, include the `--feature-gates=CoreDNS=true` flag to verify the CoreDNS version which will be installed in place of kube-dns.

3. Pick a version to upgrade to and run. For example:

--->
`kubeadm upgrade plan` 命令检查您的集群是否处于可升级的状态并且获取可以以用户友好方式升级的版本。

检查 coreDNS 版本，包括 `--feature-gates=CoreDNS=true` 标志来验证存放 kube-dns 在某个位置的 coreDNS 版本。

3. 选择一个版本来进行升级和运行，例如：
```shell
kubeadm upgrade apply v1.9.0
```
<!--

You should see output similar to this:

--->
可以得到如下类似的输出：
```shell
[preflight] Running pre-flight checks.
[upgrade] Making sure the cluster is healthy:
[upgrade/config] Making sure the configuration is correct:
[upgrade/config] Reading configuration from the cluster...
[upgrade/config] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
[upgrade/version] You have chosen to upgrade to version "v1.9.0"
[upgrade/versions] Cluster version: v1.8.1
[upgrade/versions] kubeadm version: v1.9.0
[upgrade/confirm] Are you sure you want to proceed with the upgrade? [y/N]: y
[upgrade/prepull] Will prepull images for components [kube-apiserver kube-controller-manager kube-scheduler]
[upgrade/apply] Upgrading your Static Pod-hosted control plane to version "v1.9.0"...
[etcd] Wrote Static Pod manifest for a local etcd instance to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests802453804/etcd.yaml"
[upgrade/staticpods] Moved upgraded manifest to "/etc/kubernetes/manifests/etcd.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests502223003/etcd.yaml"
[upgrade/staticpods] Waiting for the kubelet to restart the component
[apiclient] Found 1 Pods for label selector component=etcd
[upgrade/staticpods] Component "etcd" upgraded successfully!
[upgrade/staticpods] Writing upgraded Static Pod manifests to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests802453804"
[controlplane] Wrote Static Pod manifest for component kube-apiserver to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests802453804/kube-apiserver.yaml"
[controlplane] Wrote Static Pod manifest for component kube-controller-manager to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests802453804/kube-controller-manager.yaml"
[controlplane] Wrote Static Pod manifest for component kube-scheduler to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests802453804/kube-scheduler.yaml"
[upgrade/staticpods] Moved upgraded manifest to "/etc/kubernetes/manifests/kube-apiserver.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests502223003/kube-apiserver.yaml"
[upgrade/staticpods] Waiting for the kubelet to restart the component
[apiclient] Found 1 Pods for label selector component=kube-apiserver
[upgrade/staticpods] Component "kube-apiserver" upgraded successfully!
[upgrade/staticpods] Moved upgraded manifest to "/etc/kubernetes/manifests/kube-controller-manager.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests502223003/kube-controller-manager.yaml"
[upgrade/staticpods] Waiting for the kubelet to restart the component
[apiclient] Found 1 Pods for label selector component=kube-controller-manager
[upgrade/staticpods] Component "kube-controller-manager" upgraded successfully!
[upgrade/staticpods] Moved upgraded manifest to "/etc/kubernetes/manifests/kube-scheduler.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests502223003/kube-scheduler.yaml"
[upgrade/staticpods] Waiting for the kubelet to restart the component
[apiclient] Found 1 Pods for label selector component=kube-scheduler
[upgrade/staticpods] Component "kube-scheduler" upgraded successfully!
[uploadconfig] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[bootstraptoken] Configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstraptoken] Configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstraptoken] Configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[addons] Applied essential addon: kube-dns
[addons] Applied essential addon: kube-proxy

[upgrade/successful] SUCCESS! Your cluster was upgraded to "v1.9.0". Enjoy!

[upgrade/kubelet] Now that your control plane is upgraded, please proceed with upgrading your kubelets in turn.
```
<!--

To upgrade the cluster with CoreDNS as the default internal DNS, invoke `kubeadm upgrade apply` with the `--feature-gates=CoreDNS=true` flag.
`kubeadm upgrade apply` does the following:

- Checks that your cluster is in an upgradeable state:
  - The API server is reachable,
  - All nodes are in the `Ready` state
  - The control plane is healthy
- Enforces the version skew policies.
- Makes sure the control plane images are available or available to pull to the machine.
- Upgrades the control plane components or rollbacks if any of them fails to come up.
- Applies the new `kube-dns` and `kube-proxy` manifests and enforces that all necessary RBAC rules are created.
- Creates new certificate and key files of apiserver and backs up old files if they're about to expire in 180 days.

--->
                       
升级具有默认内部的 DNS 的 coreDNS 集群，调用具有 `--feature-gates=CoreDNS=true` 标记的 `kubeadm upgrade apply`。
`kubeadm upgrade apply`按照如下进行：

- 检查集群是否处于可升级状态：
  -API服务器是否可达
  -所有的节点处于`Ready`状态
  -控制面板是健康的
- 强制执行版本倾斜策略
- 确保控制面板镜像可用或者可用于机器pull
- 升级控制面板组件或者回滚如果其中一个无法出现
- 应用新的`kube-dns`和`kube-proxy`清单并强制创建所必须的RBAC规则
- 创建API服务器新的证书和秘钥文件，并备份旧文件（如果它们即将在180天到期）
<!--

4. Manually upgrade your Software Defined Network (SDN).

   Your Container Network Interface (CNI) provider may have its own upgrade instructions to follow.
   Check the [addons](/docs/concepts/cluster-administration/addons/) page to find your CNI provider and see if there are additional      upgrade steps necessary.
                                            
--->

4. 手动升级定义网络（SDN）的软件

   容器网络接口（CNI）提供者具有升级说明指导。
   检查这个[插件](/docs/concepts/cluster-administration/addons/)页面来找到 CNI 提供者和查看是否需要额外的升级步骤。
                                                     
<!--

## Upgrading your master and node packages

--->

## 升级master和node包
<!--
For each host (referred to as `$HOST` below) in your cluster, upgrade `kubelet` by executing the following commands:

1. Prepare the host for maintenance, marking it unschedulable and evicting the workload:
--->
在集群中涉及 `$HOST` 的每个主机，执行如下命令来升级 `kubelet` ：

1. 准备主机维修，并标记为不可调度和驱逐工作负载：
```shell
kubectl drain $HOST --ignore-daemonsets
```
<!--

When running this command against the master host, this error is expected and can be safely ignored (since there are static pods running on the master):

--->
当在 master 主机上运行这个命令，这个错误是可以预料的并且可以忽略（因为静态的 pods 运行在 master 上）
```shell
node "master" already cordoned
error: pods not managed by ReplicationController, ReplicaSet, Job, DaemonSet or StatefulSet (use --force to override): etcd-kubeadm, kube-apiserver-kubeadm, kube-controller-manager-kubeadm, kube-scheduler-kubeadm
```
<!-- 

2. Upgrade the Kubernetes package versions on the `$HOST` node by using a Linux distribution-specific package manager:

If the host is running a Debian-based distro such as Ubuntu, run:

--->
2.  在 `$HOST` 节点上使用特定的包管理器升级 kubernetes 包版本：

如果主机运行 Debian-based 发行版如 ubuntu，运行如下：
```shell
apt-get update
apt-get upgrade
```
<!--

If the host is running CentOS or the like, run:

--->
如果主机运行centos或者类似，运行如下:
```shell
yum update
```
<!--
Now the new version of the `kubelet` should be running on the host. Verify this using the following command on `$HOST`:
--->
现在 `kubelet` 新的版本运行在主机上。在` $HOST` 上使用如下命令验证：
```shell
systemctl status kubelet
```
<!--

3. Bring the host back online by marking it schedulable:

--->
3. 通过标记可计划的将主机从新联机：
```shell
kubectl uncordon $HOST
```
<!--
4. After upgrading `kubelet` on each host in your cluster, verify that all nodes are available again by executing the following (from anywhere, for example, from outside the cluster):
--->
在所以主机升级 `kubelet` 后，通过从任意位置运行以下命令例如从集群外来验证所有节点是否可用：
```shell
kubectl get nodes
```
<!--
If the `STATUS` column of the above command shows `Ready` for all of your hosts, you are done.
--->
如果上面命令的 `STATUS` 列显示所有的主机的 `Ready`，就完成了。
<!--
## Recovering from a failure state
--->
## ##从坏的状态中恢复
<!--

If `kubeadm upgrade` somehow fails and fails to roll back, for example due to an unexpected shutdown during execution,
you can run `kubeadm upgrade` again as it is idempotent and should eventually make sure the actual state is the desired state you are declaring.
--->
如果 `kubeadm upgrade` 以某种方式失败了并无法回滚，原因有在执行过程中出现意外关机，可以再次运行 `kubeadm upgrade`，因为它是幂等的，并且最终确保实际状态是期待的状态。

<!--
You can use `kubeadm upgrade` to change a running cluster with `x.x.x -> x.x.x` with `--force`, which can be used to recover from a bad state.
--->

可以使用 `kubeadm upgrade` 来更改运行的集群并使用具有  `--force` 参数的 `x.x.x --> x.x.x`，这样可以恢复坏的状态。

{{% /capture %}}


