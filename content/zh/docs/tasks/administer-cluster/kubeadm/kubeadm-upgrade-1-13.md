---
reviewers:
- sig-cluster-lifecycle
title: 将 kubeadm 集群从 v1.12 升级到 v1.13
content_template: templates/task
---
<!--
---
reviewers:
- sig-cluster-lifecycle
title: Upgrading kubeadm clusters from v1.12 to v1.13
content_template: templates/task
---
-->

{{% capture overview %}}

<!--
This page explains how to upgrade a Kubernetes cluster created with `kubeadm` from version 1.12.x to version 1.13.x, and from version 1.13.x to 1.13.y, where `y > x`.
-->
本页介绍了如何将 `kubeadm` 创建的 Kubernetes 集群从 1.12.x 版本升级到 1.13.x 版本，以及从版本 1.13.x 升级到 1.13.y ，其中 `y > x`。

{{% /capture %}}

{{% capture prerequisites %}}

<!--
- You need to have a `kubeadm` Kubernetes cluster running version 1.12.0 or later.
  [Swap must be disabled][swap].
  The cluster should use a static control plane and etcd pods.
- Make sure you read the [release notes](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.13.md) carefully.
- Make sure to back up any important components, such as app-level state stored in a database.
  `kubeadm upgrade` does not touch your workloads, only components internal to Kubernetes, but backups are always a best practice.
-->
- 您需要有一个由 `kubeadm` 创建并运行着 1.12.0 或更高版本的 Kubernetes 集群。
  [Swap 必须被禁用][swap]. 
  集群应使用静态的控制平面和 etcd pod。
- 请务必认真阅读[发行说明](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG-1.13.md)。
- 请务必备份所有重要组件，例如存储在数据库中应用层面的状态。
  `kubeadm upgrade` 不会触及您的工作负载，只会触及 Kubernetes 内部的组件，但备份终究是好的。


<!--
[swap]: https://serverfault.com/questions/684771/best-way-to-disable-swap-in-linux
### Additional information
-->
[swap]: https://serverfault.com/questions/684771/best-way-to-disable-swap-in-linux
### 附加信息

<!--
- All containers are restarted after upgrade, because the container spec hash value is changed.
- You can upgrade only from one minor version to the next minor version.
  That is, you cannot skip versions when you upgrade.
  For example, you can upgrade only from 1.10 to 1.11, not from 1.9 to 1.11.
-->
### 附加信息

- 升级后重新启动所有容器，因为容器 spec 的哈希值已更改。
- 您只能从一个次版本升级到下一个次版本。
  也就是说，升级时无法跳过版本。
  例如，您只能从 1.10 升级到 1.11，而不能从 1.9 升级到 1.11。

{{< warning >}}
The command `join --experimental-control-plane` is known to fail on single node clusters created with kubeadm v1.12 and then upgraded to v1.13.x.
This will be fixed when graduating the `join --control-plane` workflow from alpha to beta.
A possible workaround is described [here](https://github.com/kubernetes/kubeadm/issues/1269#issuecomment-441116249).
{{</ warning >}}

{{% /capture %}}

{{% capture steps %}}

## Determine which version to upgrade to

1.  Find the latest stable 1.13 version:

    {{< tabs name="k8s_install_versions" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    apt update
    apt-cache policy kubeadm
    # find the latest 1.13 version in the list
    # it should look like 1.13.x-00, where x is the latest patch
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    yum list --showduplicates kubeadm --disableexcludes=kubernetes
    # find the latest 1.13 version in the list
    # it should look like 1.13.x-0, where x is the latest patch
    {{% /tab %}}
    {{< /tabs >}}

<!--
## Upgrade the control plane node

1.  On your control plane node, upgrade kubeadm:

    {{< tabs name="k8s_install_kubeadm" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # replace x in 1.13.x-00 with the latest patch version
    apt-mark unhold kubeadm && \
    apt-get update && apt-get install -y kubeadm=1.13.x-00 && \
    apt-mark hold kubeadm
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    # replace x in 1.13.x-0 with the latest patch version
    yum install -y kubeadm-1.13.x-0 --disableexcludes=kubernetes
    {{% /tab %}}
    {{< /tabs >}}

1.  Verify that the download works and has the expected version:

    ```shell
    kubeadm version
    ```
-->
## 升级控制平面

1.  在主节点上，升级 kubeadm：

    {{< tabs name="k8s_install_kubeadm" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # replace x in 1.13.x-00 with the latest patch version
    apt-mark unhold kubeadm && \
    apt-get update && apt-get install -y kubeadm=1.13.x-00 && \
    apt-mark hold kubeadm
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    # replace x in 1.13.x-0 with the latest patch version
    yum install -y kubeadm-1.13.x-0 --disableexcludes=kubernetes
    {{% /tab %}}
    {{< /tabs >}}

1.  验证下载是否有效并且是预期的版本

    ```shell
    kubeadm version
    ```

<!--
1.  On the master node, run:

    ```shell
    kubeadm upgrade plan
    ```

    You should see output similar to this:

-->
1.  在主节点上，运行：

    ```shell
    kubeadm upgrade plan
    ```

    您应该可以看到与下面类似的输出：

    ```shell
    [preflight] Running pre-flight checks.
    [upgrade] Making sure the cluster is healthy:
    [upgrade/config] Making sure the configuration is correct:
    [upgrade/config] Reading configuration from the cluster...
    [upgrade/config] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
    [upgrade] Fetching available versions to upgrade to
    [upgrade/versions] Cluster version: v1.12.2
    [upgrade/versions] kubeadm version: v1.13.0

    Components that must be upgraded manually after you have upgraded the control plane with 'kubeadm upgrade apply':
    COMPONENT   CURRENT       AVAILABLE
    Kubelet     2 x v1.12.2   v1.13.0

    Upgrade to the latest version in the v1.12 series:

    COMPONENT            CURRENT   AVAILABLE
    API Server           v1.12.2   v1.13.0
    Controller Manager   v1.12.2   v1.13.0
    Scheduler            v1.12.2   v1.13.0
    Kube Proxy           v1.12.2   v1.13.0
    CoreDNS              1.2.2     1.2.6
    Etcd                 3.2.24    3.2.24

    You can now apply the upgrade by executing the following command:

            kubeadm upgrade apply v1.13.0

    _____________________________________________________________________
    ```

<!--
    This command checks that your cluster can be upgraded, and fetches the versions you can upgrade to.

1.  Choose a version to upgrade to, and run the appropriate command. For example:
-->
    此命令检查您的集群是否可以升级，并可以获取到升级的版本。

1.  选择要升级到的版本，然后运行相应的命令。 例如：

    ```shell
    kubeadm upgrade apply v1.13.0
    ```

<!--
    You should see output similar to this:
-->
    您应该可以看见与下面类似的输出：

    <!-- TODO: output from stable -->

    ```shell
    [preflight] Running pre-flight checks.
    [upgrade] Making sure the cluster is healthy:
    [upgrade/config] Making sure the configuration is correct:
    [upgrade/config] Reading configuration from the cluster...
    [upgrade/config] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
    [upgrade/apply] Respecting the --cri-socket flag that is set with higher priority than the config file.
    [upgrade/version] You have chosen to change the cluster version to "v1.13.0"
    [upgrade/versions] Cluster version: v1.12.2
    [upgrade/versions] kubeadm version: v1.13.0
    [upgrade/confirm] Are you sure you want to proceed with the upgrade? [y/N]: y
    [upgrade/prepull] Will prepull images for components [kube-apiserver kube-controller-manager kube-scheduler etcd]
    [upgrade/prepull] Prepulling image for component etcd.
    [upgrade/prepull] Prepulling image for component kube-controller-manager.
    [upgrade/prepull] Prepulling image for component kube-scheduler.
    [upgrade/prepull] Prepulling image for component kube-apiserver.
    [apiclient] Found 0 Pods for label selector k8s-app=upgrade-prepull-kube-controller-manager
    [apiclient] Found 0 Pods for label selector k8s-app=upgrade-prepull-etcd
    [apiclient] Found 0 Pods for label selector k8s-app=upgrade-prepull-kube-scheduler
    [apiclient] Found 1 Pods for label selector k8s-app=upgrade-prepull-kube-apiserver
    [apiclient] Found 1 Pods for label selector k8s-app=upgrade-prepull-kube-controller-manager
    [apiclient] Found 1 Pods for label selector k8s-app=upgrade-prepull-etcd
    [apiclient] Found 1 Pods for label selector k8s-app=upgrade-prepull-kube-scheduler
    [upgrade/prepull] Prepulled image for component etcd.
    [upgrade/prepull] Prepulled image for component kube-apiserver.
    [upgrade/prepull] Prepulled image for component kube-scheduler.
    [upgrade/prepull] Prepulled image for component kube-controller-manager.
    [upgrade/prepull] Successfully prepulled the images for all the control plane components
    [upgrade/apply] Upgrading your Static Pod-hosted control plane to version "v1.13.0"...
    Static pod: kube-apiserver-ip-10-0-0-7 hash: 4af3463d6ace12615f1795e40811c1a1
    Static pod: kube-controller-manager-ip-10-0-0-7 hash: a640b0098f5bddc701786e007c96e220
    Static pod: kube-scheduler-ip-10-0-0-7 hash: ee7b1077c61516320f4273309e9b4690
    map[localhost:2379:3.2.24]
    [upgrade/staticpods] Writing new Static Pod manifests to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests969681047"
    [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/kube-apiserver.yaml" and backed up old manifest to     "/etc/kubernetes/tmp/kubeadm-backup-manifests-2018-11-20-18-30-42/kube-apiserver.yaml"
    [upgrade/staticpods] Waiting for the kubelet to restart the component
    [upgrade/staticpods] This might take a minute or longer depending on the component/version gap (timeout 5m0s)
    Static pod: kube-apiserver-ip-10-0-0-7 hash: 4af3463d6ace12615f1795e40811c1a1
    Static pod: kube-apiserver-ip-10-0-0-7 hash: bf5b045d2be93e73654f3eb7027a4ef8
    [apiclient] Found 1 Pods for label selector component=kube-apiserver
    [upgrade/staticpods] Component "kube-apiserver" upgraded successfully!
    [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/kube-controller-manager.yaml" and backed up old manifest to     "/etc/kubernetes/tmp/kubeadm-backup-manifests-2018-11-20-18-30-42/kube-controller-manager.yaml"
    [upgrade/staticpods] Waiting for the kubelet to restart the component
    [upgrade/staticpods] This might take a minute or longer depending on the component/version gap (timeout 5m0s)
    Static pod: kube-controller-manager-ip-10-0-0-7 hash: a640b0098f5bddc701786e007c96e220
    Static pod: kube-controller-manager-ip-10-0-0-7 hash: 1e0eea23b3d971460ac032c18ab7daac
    [apiclient] Found 1 Pods for label selector component=kube-controller-manager
    [upgrade/staticpods] Component "kube-controller-manager" upgraded successfully!
    [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/kube-scheduler.yaml" and backed up old manifest to     "/etc/kubernetes/tmp/kubeadm-backup-manifests-2018-11-20-18-30-42/kube-scheduler.yaml"
    [upgrade/staticpods] Waiting for the kubelet to restart the component
    [upgrade/staticpods] This might take a minute or longer depending on the component/version gap (timeout 5m0s)
    Static pod: kube-scheduler-ip-10-0-0-7 hash: ee7b1077c61516320f4273309e9b4690
    Static pod: kube-scheduler-ip-10-0-0-7 hash: 7f7d929b61a2cc5bcdf36609f75927ec
    [apiclient] Found 1 Pods for label selector component=kube-scheduler
    [upgrade/staticpods] Component "kube-scheduler" upgraded successfully!
    [uploadconfig] storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
    [kubelet] Creating a ConfigMap "kubelet-config-1.13" in namespace kube-system with the configuration for the kubelets in the cluster
    [kubelet] Downloading configuration for the kubelet from the "kubelet-config-1.13" ConfigMap in the kube-system namespace
    [kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
    [patchnode] Uploading the CRI Socket information "/var/run/dockershim.sock" to the Node API object "ip-10-0-0-7" as an annotation
    [bootstraptoken] configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
    [bootstraptoken] configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
    [bootstraptoken] configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
    [addons] Applied essential addon: CoreDNS
    [addons] Applied essential addon: kube-proxy

    [upgrade/successful] SUCCESS! Your cluster was upgraded to "v1.13.0". Enjoy!

    [upgrade/kubelet] Now that your control plane is upgraded, please proceed with upgrading your kubelets if you haven't already done so.
    ```

<!--
1.  Manually upgrade your Software Defined Network (SDN).

    Your Container Network Interface (CNI) provider may have its own upgrade instructions to follow.
    Check the [addons](/docs/concepts/cluster-administration/addons/) page to
    find your CNI provider and see whether additional upgrade steps are required.
-->
1.  手动升级软件定义网络（SDN）。

    您的容器网络接口（CNI）应该提供了程序自身的升级说明。
    检查 [addons](/docs/concepts/cluster-administration/addons/) 页面以
    查找您 CNI 所提供的程序，并查看是否需要其他升级步骤。

<!--
1.  Upgrade the kubelet on the control plane node:

    {{< tabs name="k8s_install_kubelet" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # replace x in 1.13.x-00 with the latest patch version
    apt-mark unhold kubelet && \
    apt-get update && apt-get install -y kubelet=1.13.x-00 && \
    apt-mark hold kubelet
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    # replace x in 1.13.x-0 with the latest patch version
    yum install -y kubelet-1.13.x-0 --disableexcludes=kubernetes
    {{% /tab %}}
    {{< /tabs >}}
-->
1.  升级控制平面节点上的 kubelet:

    {{< tabs name="k8s_install_kubelet" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # 将 1.13.x-00 中的 x 替换为最新的版本
    apt-mark unhold kubelet && \
    apt-get update && apt-get install -y kubelet=1.13.x-00 && \
    apt-mark hold kubelet
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    # 将 1.13.x-00 中的 x 替换为最新的版本
    yum install -y kubelet-1.13.x-0 --disableexcludes=kubernetes
    {{% /tab %}}
    {{< /tabs >}}

<!--
## Upgrade kubectl on all nodes

1.  Upgrade kubectl on all nodes:

    {{< tabs name="k8s_install_kubectl" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # replace x in 1.13.x-00 with the latest patch version
    apt-mark unhold kubectl && \
    apt-get update && apt-get install -y kubectl=1.13.x-00 && \
    apt-mark hold kubectl
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    # replace x in 1.13.x-0 with the latest patch version
    yum install -y kubectl-1.13.x-0 --disableexcludes=kubernetes
    {{% /tab %}}
    {{< /tabs >}}
-->
## 升级所有节点上的 kubectl

1.  升级所有节点上的 kubectl:

    {{< tabs name="k8s_install_kubectl" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # 将 1.13.x-00 中的 x 替换为最新的版本
    apt-mark unhold kubectl && \
    apt-get update && apt-get install -y kubectl=1.13.x-00 && \
    apt-mark hold kubectl
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    # 将 1.13.x-00 中的 x 替换为最新的版本
    yum install -y kubectl-1.13.x-0 --disableexcludes=kubernetes
    {{% /tab %}}
    {{< /tabs >}}

<!--
## Drain control plane and worker nodes

1.  Prepare each node for maintenance by marking it unschedulable and evicting the workloads. Run:
-->
## 清空控制平面和工作节点

1.  在维护前，将每个节点标记为不可调度并移除工作负载来做好准备。 运行：

    ```shell
    kubectl drain $NODE --ignore-daemonsets
    ```

<!--
    On the control plane node, you must add `--ignore-daemonsets`:
-->
    在控制平面节点上，必须添加 `--ignore-daemonsets`:

    ```shell
    kubectl drain ip-172-31-85-18
    node "ip-172-31-85-18" cordoned
    error: unable to drain node "ip-172-31-85-18", aborting command...

    There are pending nodes to be drained:
    ip-172-31-85-18
    error: DaemonSet-managed pods (use --ignore-daemonsets to ignore): calico-node-5798d, kube-proxy-thjp9
    ```

    ```
    kubectl drain ip-172-31-85-18 --ignore-daemonsets
    node "ip-172-31-85-18" already cordoned
    WARNING: Ignoring DaemonSet-managed pods: calico-node-5798d, kube-proxy-thjp9
    node "ip-172-31-85-18" drained
    ```

<!--
## Upgrade the kubelet config on worker nodes

1.  On each node except the control plane node, upgrade the kubelet config:
-->
## 在工作节点上更新 kubelet 配置

1.  在除控制平面节点的其它节点上，更新 kubelet 配置:

    ```shell
    kubeadm upgrade node config --kubelet-version v1.13.x
    ```

<!--
    Replace `x` with the patch version you picked for this ugprade.
-->
    将 `x` 替换为您本次将要升级到的版本号。


<!--
## Upgrade kubeadm and the kubelet on worker nodes

1.  Upgrade the Kubernetes package version on each `$NODE` node by running the Linux package manager for your distribution:

    {{< tabs name="k8s_kubelet_and_kubeadm" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # replace x in 1.13.x-00 with the latest patch version
    apt-mark unhold kubelet kubeadm
    apt-get update
    apt-get install -y kubelet=1.13.x-00 kubeadm=1.13.x-00
    apt-mark hold kubelet kubeadm
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    # replace x in 1.13.x-0 with the latest patch version
    yum install -y kubelet-1.13.x-0 kubeadm-1.13.x-0 --disableexcludes=kubernetes
    {{% /tab %}}
    {{< /tabs >}}
-->
## 在每个工作节点上升级 kubelet

1.  在每个 `$NODE` 节点上使用您的发行版对应的 Linux 包管理器:

    {{< tabs name="k8s_kubelet_and_kubeadm" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # # 将 1.13.x-00 中的 x 替换为最新的版本
    apt-mark unhold kubelet kubeadm
    apt-get update
    apt-get install -y kubelet=1.13.x-00 kubeadm=1.13.x-00
    apt-mark hold kubelet kubeadm
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    # # 将 1.13.x-00 中的 x 替换为最新的版本
    yum install -y kubelet-1.13.x-0 kubeadm-1.13.x-0 --disableexcludes=kubernetes
    {{% /tab %}}
    {{< /tabs >}}

<!--
## Restart the kubelet for all nodes

1.  Restart the kubelet process for all nodes:

    ```shell
    systemctl restart kubelet
    ```

1.  Verify that the new version of the `kubelet` is running on the node:

    ```shell
    systemctl status kubelet
    ```

1.  Bring the node back online by marking it schedulable:

    ```shell
    kubectl uncordon $NODE
    ```

1.  After the kubelet is upgraded on all nodes, verify that all nodes are available again by running the following command from anywhere kubectl can access the cluster:

    ```shell
    kubectl get nodes
    ```

    The `STATUS` column should show `Ready` for all your nodes, and the version number should be updated.
-->
## 重启所有节点上的 kubelet

1.  重启所有节点上的 kubelet 进程:

    ```shell
    systemctl restart kubelet
    ```

1.  验证节点上新版本的 `kubelet` 处于运行状态:

    ```shell
    systemctl status kubelet
    ```

1.  将节点状态标记为可调度:

    ```shell
    kubectl uncordon $NODE
    ```

1.  在所有节点上升级 kubelet 之后，通过从任何 kubectl 可以访问集群的位置运行以下命令来验证所有节点是否可用：

    ```shell
    kubectl get nodes
    ```

    您所有节点的 `STATUS` 列应为 `Ready`，并且版本信息应该是更新后的.

{{% /capture %}}

<!--
## Recovering from a failure state

If `kubeadm upgrade` fails and does not roll back, for example because of an unexpected shutdown during execution, you can run `kubeadm upgrade` again.
This command is idempotent and eventually makes sure that the actual state is the desired state you declare.

To recover from a bad state, you can also run `kubeadm upgrade --force` without changing the version that your cluster is running.
-->
## 从失败状态恢复

如果 `kubeadm upgrade` 失败且没有回滚，比如在运行过程中意外被关闭，您可以重新运行`kubeadm upgrade` 。
此命令是幂等的，并最终确保实际状态是您声明的所需状态。

要从错误状态恢复，您还可以运行 `kubeadm upgrade --force` 而无需更改群集正在运行的版本。

<!--
## How it works

`kubeadm upgrade apply` does the following:

- Checks that your cluster is in an upgradeable state:
  - The API server is reachable
  - All nodes are in the `Ready` state
  - The control plane is healthy
- Enforces the version skew policies.
- Makes sure the control plane images are available or available to pull to the machine.
- Upgrades the control plane components or rollbacks if any of them fails to come up.
- Applies the new `kube-dns` and `kube-proxy` manifests and makes sure that all necessary RBAC rules are created.
- Creates new certificate and key files of the API server and backs up old files if they're about to expire in 180 days.
-->
## 工作原理

`kubeadm upgrade apply` 指令做了如下操作:

- 检查您的集群是否处于可升级状态:
  - API 服务器可达
  - 所有节点在 `Ready` 状态
  - 控制平面状态为健康
- 执行版本 skew 策略。
- 确保控制平面图像可用或可被拉取到机器。
- 升级控制平面组件或回滚（如果其中任何一个组件无法启动）。
- 应用新的 `kube-dns` 和 `kube-proxy` 清单，并确保创建所有必需的 RBAC 规则。
- 创建 API 服务器的新证书和密钥文件，如果旧文件即将在 180 天后过期，则备份旧文件。
