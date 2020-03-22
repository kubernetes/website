---
reviewers:
- sig-cluster-lifecycle
title: 升级 kubeadm 集群
content_template: templates/task
---
<!--
---
reviewers:
- sig-cluster-lifecycle
title: Upgrading kubeadm clusters
content_template: templates/task
---
-->

{{% capture overview %}}

<!--
This page explains how to upgrade a Kubernetes cluster created with kubeadm from version
1.16.x to version 1.17.x, and from version 1.17.x to 1.17.y (where `y > x`).
-->
本页介绍了如何将 `kubeadm` 创建的 Kubernetes 集群从 1.16.x 版本升级到 1.17.x 版本，以及从版本 1.17.x 升级到 1.17.y ，其中 `y > x`。

<!--
To see information about upgrading clusters created using older versions of kubeadm,
please refer to following pages instead:
-->
要查看 kubeadm 创建的有关旧版本集群升级的信息，请参考以下页面：

<!--
- [Upgrading kubeadm cluster from 1.15 to 1.16](https://v1-16.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Upgrading kubeadm cluster from 1.14 to 1.15](https://v1-15.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-15/)
- [Upgrading kubeadm cluster from 1.13 to 1.14](https://v1-15.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-14/)
-->
- [将 kubeadm 集群从 1.15 升级到 1.16](https://v1-16.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [将 kubeadm 集群从 1.14 升级到 1.15](https://v1-15.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-15/)
- [将 kubeadm 集群从 1.13 升级到 1.14](https://v1-15.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-14/)

<!--
The upgrade workflow at high level is the following:

1. Upgrade the primary control plane node.
1. Upgrade additional control plane nodes.
1. Upgrade worker nodes.
-->
高版本升级工作流如下：

1. 升级主控制平面节点。
1. 升级其他控制平面节点。
1. 升级工作节点。

{{% /capture %}}

{{% capture prerequisites %}}

<!--
- You need to have a kubeadm Kubernetes cluster running version 1.16.0 or later.
- [Swap must be disabled](https://serverfault.com/questions/684771/best-way-to-disable-swap-in-linux).
- The cluster should use a static control plane and etcd pods or external etcd.
- Make sure you read the [release notes]({{< latest-release-notes >}}) carefully.
- Make sure to back up any important components, such as app-level state stored in a database.
  `kubeadm upgrade` does not touch your workloads, only components internal to Kubernetes, but backups are always a best practice.
-->
- 您需要有一个由 `kubeadm` 创建并运行着 1.16.0 或更高版本的 Kubernetes 集群。
- [禁用 Swap](https://serverfault.com/questions/684771/best-way-to-disable-swap-in-linux)。
- 集群应使用静态的控制平面和 etcd pod 或者 外部 etcd。
- 务必仔细认真阅读[发行说明]({{< latest-release-notes >}})。
- 务必备份所有重要组件，例如存储在数据库中应用层面的状态。
  `kubeadm upgrade` 不会影响您的工作负载，只会涉及 Kubernetes 内部的组件，但备份终究是好的。

<!--
### Additional information
-->
### 附加信息

<!--
- All containers are restarted after upgrade, because the container spec hash value is changed.
- You only can upgrade from one MINOR version to the next MINOR version,
  or between PATCH versions of the same MINOR. That is, you cannot skip MINOR versions when you upgrade.
  For example, you can upgrade from 1.y to 1.y+1, but not from 1.y to 1.y+2.
-->
- 升级后，因为容器 spec 哈希值已更改，所以所有容器都会重新启动。
- 您只能从一个次版本升级到下一个次版本，或者同样次版本的补丁版。也就是说，升级时无法跳过版本。
  例如，您只能从 1.y 升级到 1.y+1，而不能从 from 1.y 升级到 1.y+2。

{{% /capture %}}

{{% capture steps %}}

<!--
## Determine which version to upgrade to
-->
## 确定要升级到哪个版本

<!--
1.  Find the latest stable 1.17 version:

    {{< tabs name="k8s_install_versions" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    apt update
    apt-cache policy kubeadm
    # find the latest 1.17 version in the list
    # it should look like 1.17.x-00, where x is the latest patch
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    yum list --showduplicates kubeadm --disableexcludes=kubernetes
    # find the latest 1.17 version in the list
    # it should look like 1.17.x-0, where x is the latest patch
    {{% /tab %}}
    {{< /tabs >}}
-->
1.  找到最新的稳定版 1.17:

    {{< tabs name="k8s_install_versions" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    apt update
    apt-cache policy kubeadm
    # 在列表中查找最新的 1.17 版本
    # 它看起来应该是 1.17.x-00 ，其中 x 是最新的补丁
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    yum list --showduplicates kubeadm --disableexcludes=kubernetes
    # 在列表中查找最新的 1.17 版本
    # 它看起来应该是 1.17.x-0 ，其中 x 是最新的补丁
    {{% /tab %}}
    {{< /tabs >}}

<!--
## Upgrade the first control plane node
-->
## 升级第一个控制平面节点

<!--
1.  On your first control plane node, upgrade kubeadm:

    {{< tabs name="k8s_install_kubeadm_first_cp" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # replace x in 1.17.x-00 with the latest patch version
    apt-mark unhold kubeadm && \
    apt-get update && apt-get install -y kubeadm=1.17.x-00 && \
    apt-mark hold kubeadm
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    # replace x in 1.17.x-0 with the latest patch version
    yum install -y kubeadm-1.17.x-0 --disableexcludes=kubernetes
    {{% /tab %}}
    {{< /tabs >}}
-->
1.  在第一个控制平面节点上，升级 kubeadm :

    {{< tabs name="k8s_install_kubeadm_first_cp" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # 用最新的修补程序版本替换 1.17.x-00 中的 x
    apt-mark unhold kubeadm && \
    apt-get update && apt-get install -y kubeadm=1.17.x-00 && \
    apt-mark hold kubeadm
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    # 用最新的修补程序版本替换 1.17.x-0 中的 x
    yum install -y kubeadm-1.17.x-0 --disableexcludes=kubernetes
    {{% /tab %}}
    {{< /tabs >}}

<!--
1.  Verify that the download works and has the expected version:

    ```shell
    kubeadm version
    ```
-->
1.  验证 kubeadm 版本：

    ```shell
    kubeadm version
    ```

<!--
1.  Drain the control plane node:
-->
1.  腾空控制平面节点：

    ```shell
    kubectl drain $CP_NODE --ignore-daemonsets
    ```

<!--
1.  On the control plane node, run:
-->
1.  在主节点上，运行:

    ```shell
    sudo kubeadm upgrade plan
    ```

    <!--
    You should see output similar to this:
    -->
    您应该可以看到与下面类似的输出：

    ```shell
    [preflight] Running pre-flight checks.
    [upgrade] Making sure the cluster is healthy:
    [upgrade/config] Making sure the configuration is correct:
    [upgrade/config] Reading configuration from the cluster...
    [upgrade/config] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
    [upgrade] Fetching available versions to upgrade to
    [upgrade/versions] Cluster version: v1.16.0
    [upgrade/versions] kubeadm version: v1.17.0

    Components that must be upgraded manually after you have upgraded the control plane with 'kubeadm upgrade apply':
    COMPONENT   CURRENT       AVAILABLE
    Kubelet     1 x v1.16.0   v1.17.0

    Upgrade to the latest version in the v1.13 series:

    COMPONENT            CURRENT   AVAILABLE
    API Server           v1.16.0   v1.17.0
    Controller Manager   v1.16.0   v1.17.0
    Scheduler            v1.16.0   v1.17.0
    Kube Proxy           v1.16.0   v1.17.0
    CoreDNS              1.6.2     1.6.5
    Etcd                 3.3.15    3.4.3-0

    You can now apply the upgrade by executing the following command:

            kubeadm upgrade apply v1.17.0

    _____________________________________________________________________
    ```

    <!--
    This command checks that your cluster can be upgraded, and fetches the versions you can upgrade to.
    -->
    此命令检查您的集群是否可以升级，并可以获取到升级的版本。

<!--
1.  Choose a version to upgrade to, and run the appropriate command. For example:
-->
1.  选择要升级到的版本，然后运行相应的命令。例如:

    ```shell
    sudo kubeadm upgrade apply v1.17.x
    ```

    <!--
    - Replace `x` with the patch version you picked for this ugprade.
    -->
    - 将 `x` 替换为您为此升级选择的修补程序版本。

    <!--
    You should see output similar to this:
    -->
    您应该可以看见与下面类似的输出：

    ```shell
    [preflight] Running pre-flight checks.
    [upgrade] Making sure the cluster is healthy:
    [upgrade/config] Making sure the configuration is correct:
    [upgrade/config] Reading configuration from the cluster...
    [upgrade/config] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
    [upgrade/version] You have chosen to change the cluster version to "v1.17.0"
    [upgrade/versions] Cluster version: v1.16.0
    [upgrade/versions] kubeadm version: v1.17.0
    [upgrade/confirm] Are you sure you want to proceed with the upgrade? [y/N]: y
    [upgrade/prepull] Will prepull images for components [kube-apiserver kube-controller-manager kube-scheduler etcd]
    [upgrade/prepull] Prepulling image for component etcd.
    [upgrade/prepull] Prepulling image for component kube-scheduler.
    [upgrade/prepull] Prepulling image for component kube-apiserver.
    [upgrade/prepull] Prepulling image for component kube-controller-manager.
    [apiclient] Found 0 Pods for label selector k8s-app=upgrade-prepull-etcd
    [apiclient] Found 0 Pods for label selector k8s-app=upgrade-prepull-kube-scheduler
    [apiclient] Found 0 Pods for label selector k8s-app=upgrade-prepull-kube-controller-manager
    [apiclient] Found 0 Pods for label selector k8s-app=upgrade-prepull-kube-apiserver
    [apiclient] Found 1 Pods for label selector k8s-app=upgrade-prepull-etcd
    [apiclient] Found 1 Pods for label selector k8s-app=upgrade-prepull-kube-controller-manager
    [apiclient] Found 1 Pods for label selector k8s-app=upgrade-prepull-kube-scheduler
    [apiclient] Found 1 Pods for label selector k8s-app=upgrade-prepull-kube-apiserver
    [upgrade/prepull] Prepulled image for component etcd.
    [upgrade/prepull] Prepulled image for component kube-apiserver.
    [upgrade/prepull] Prepulled image for component kube-scheduler.
    [upgrade/prepull] Prepulled image for component kube-controller-manager.
    [upgrade/prepull] Successfully prepulled the images for all the control plane components
    [upgrade/apply] Upgrading your Static Pod-hosted control plane to version "v1.17.0"...
    Static pod: kube-apiserver-myhost hash: 6436b0d8ee0136c9d9752971dda40400
    Static pod: kube-controller-manager-myhost hash: 8ee730c1a5607a87f35abb2183bf03f2
    Static pod: kube-scheduler-myhost hash: 4b52d75cab61380f07c0c5a69fb371d4
    [upgrade/etcd] Upgrading to TLS for etcd
    Static pod: etcd-myhost hash: 877025e7dd7adae8a04ee20ca4ecb239
    [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/etcd.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests-2019-03-14-20-52-44/etcd.yaml"
    [upgrade/staticpods] Waiting for the kubelet to restart the component
    [upgrade/staticpods] This might take a minute or longer depending on the component/version gap (timeout 5m0s)
    Static pod: etcd-myhost hash: 877025e7dd7adae8a04ee20ca4ecb239
    Static pod: etcd-myhost hash: 877025e7dd7adae8a04ee20ca4ecb239
    Static pod: etcd-myhost hash: 64a28f011070816f4beb07a9c96d73b6
    [apiclient] Found 1 Pods for label selector component=etcd
    [upgrade/staticpods] Component "etcd" upgraded successfully!
    [upgrade/etcd] Waiting for etcd to become available
    [upgrade/staticpods] Writing new Static Pod manifests to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests043818770"
    [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/kube-apiserver.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests-2019-03-14-20-52-44/kube-apiserver.yaml"
    [upgrade/staticpods] Waiting for the kubelet to restart the component
    [upgrade/staticpods] This might take a minute or longer depending on the component/version gap (timeout 5m0s)
    Static pod: kube-apiserver-myhost hash: 6436b0d8ee0136c9d9752971dda40400
    Static pod: kube-apiserver-myhost hash: 6436b0d8ee0136c9d9752971dda40400
    Static pod: kube-apiserver-myhost hash: 6436b0d8ee0136c9d9752971dda40400
    Static pod: kube-apiserver-myhost hash: b8a6533e241a8c6dab84d32bb708b8a1
    [apiclient] Found 1 Pods for label selector component=kube-apiserver
    [upgrade/staticpods] Component "kube-apiserver" upgraded successfully!
    [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/kube-controller-manager.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests-2019-03-14-20-52-44/kube-controller-manager.yaml"
    [upgrade/staticpods] Waiting for the kubelet to restart the component
    [upgrade/staticpods] This might take a minute or longer depending on the component/version gap (timeout 5m0s)
    Static pod: kube-controller-manager-myhost hash: 8ee730c1a5607a87f35abb2183bf03f2
    Static pod: kube-controller-manager-myhost hash: 6f77d441d2488efd9fc2d9a9987ad30b
    [apiclient] Found 1 Pods for label selector component=kube-controller-manager
    [upgrade/staticpods] Component "kube-controller-manager" upgraded successfully!
    [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/kube-scheduler.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests-2019-03-14-20-52-44/kube-scheduler.yaml"
    [upgrade/staticpods] Waiting for the kubelet to restart the component
    [upgrade/staticpods] This might take a minute or longer depending on the component/version gap (timeout 5m0s)
    Static pod: kube-scheduler-myhost hash: 4b52d75cab61380f07c0c5a69fb371d4
    Static pod: kube-scheduler-myhost hash: a24773c92bb69c3748fcce5e540b7574
    [apiclient] Found 1 Pods for label selector component=kube-scheduler
    [upgrade/staticpods] Component "kube-scheduler" upgraded successfully!
    [upload-config] storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
    [kubelet] Creating a ConfigMap "kubelet-config-1.17" in namespace kube-system with the configuration for the kubelets in the cluster
    [kubelet-start] Downloading configuration for the kubelet from the "kubelet-config-1.17" ConfigMap in the kube-system namespace
    [kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
    [bootstrap-token] configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
    [bootstrap-token] configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
    [bootstrap-token] configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
    [addons] Applied essential addon: CoreDNS
    [addons] Applied essential addon: kube-proxy

    [upgrade/successful] SUCCESS! Your cluster was upgraded to "v1.17.0". Enjoy!

    [upgrade/kubelet] Now that your control plane is upgraded, please proceed with upgrading your kubelets if you haven't already done so.
    ```

<!--
1.  Manually upgrade your CNI provider plugin.
-->
1.  手动升级你的 CNI 供应商插件。

    <!--
    Your Container Network Interface (CNI) provider may have its own upgrade instructions to follow.
    Check the [addons](/docs/concepts/cluster-administration/addons/) page to
    find your CNI provider and see whether additional upgrade steps are required.
    -->
    您的容器网络接口（CNI）应该提供了程序自身的升级说明。
    检查[插件](/docs/concepts/cluster-administration/addons/)页面查找您 CNI 所提供的程序，并查看是否需要其他升级步骤。

    <!--
    This step is not required on additional control plane nodes if the CNI provider runs as a DaemonSet.
    -->
    如果 CNI 提供程序作为 DaemonSet 运行，则在其他控制平面节点上不需要此步骤。

<!--
1.  Uncordon the control plane node
-->
1.  取消对控制面节点的保护

    ```shell
    kubectl uncordon $CP_NODE
    ``` 

<!--
1.  Upgrade the kubelet and kubectl on the control plane node:
-->
1.  升级控制平面节点上的 kubelet 和 kubectl ：
    {{< tabs name="k8s_install_kubelet" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # 用最新的修补程序版本替换 1.17.x-00 中的 x
    apt-mark unhold kubelet kubectl && \
    apt-get update && apt-get install -y kubelet=1.17.x-00 kubectl=1.17.x-00 && \
    apt-mark hold kubelet kubectl
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    # 用最新的修补程序版本替换 1.17.x-00 中的 x
    yum install -y kubelet-1.17.x-0 kubectl-1.17.x-0 --disableexcludes=kubernetes
    {{% /tab %}}
    {{< /tabs >}}


<!--
1. Restart the kubelet
-->
1. 重启 kubelet

    ```shell
    sudo systemctl restart kubelet
    ```

<!--
## Upgrade additional control plane nodes
-->
## 升级其他控制平面节点

<!--
1.  Same as the first control plane node but use:
-->
1.  与第一个控制平面节点相同，但使用：

```
sudo kubeadm upgrade node experimental-control-plane
```

而不是：

```
sudo kubeadm upgrade apply
```

<!--
Also `sudo kubeadm upgrade plan` is not needed.
-->
也不需要 `sudo kubeadm upgrade plan` 。

<!--
## Upgrade worker nodes
-->
## 升级工作节点

<!--
The upgrade procedure on worker nodes should be executed one node at a time or few nodes at a time,
without compromising the minimum required capacity for running your workloads.
-->
工作节点上的升级过程应该一次执行一个节点，或者一次执行几个节点，以不影响运行工作负载所需的最小容量。

<!--
### Upgrade kubeadm
-->
### 升级 kubeadm

<!--
1.  Upgrade kubeadm on all worker nodes:

    {{< tabs name="k8s_install_kubeadm_worker_nodes" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # replace x in 1.17.x-00 with the latest patch version
    apt-mark unhold kubeadm && \
    apt-get update && apt-get install -y kubeadm=1.17.x-00 && \
    apt-mark hold kubeadm
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    # replace x in 1.17.x-0 with the latest patch version
    yum install -y kubeadm-1.17.x-0 --disableexcludes=kubernetes
    {{% /tab %}}
    {{< /tabs >}}
-->
1.  在所有工作节点升级 kubeadm :

    {{< tabs name="k8s_install_kubeadm_worker_nodes" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # 用最新的修补程序版本替换 1.17.x-00 中的 x
    apt-mark unhold kubeadm && \
    apt-get update && apt-get install -y kubeadm=1.17.x-00 && \
    apt-mark hold kubeadm
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    # 用最新的修补程序版本替换 1.17.x-00 中的 x
    yum install -y kubeadm-1.17.x-0 --disableexcludes=kubernetes
    {{% /tab %}}
    {{< /tabs >}}

<!--
### Cordon the node
-->
### 保护节点

<!--
1.  Prepare the node for maintenance by marking it unschedulable and evicting the workloads. Run:

    ```shell
    kubectl drain $NODE --ignore-daemonsets
    ```

    You should see output similar to this:

    ```shell
    node/ip-172-31-85-18 cordoned
    WARNING: ignoring DaemonSet-managed Pods: kube-system/kube-proxy-dj7d7, kube-system/weave-net-z65qx
    node/ip-172-31-85-18 drained
    ```
-->
1.  通过将节点标记为不可调度并逐出工作负载，为维护做好准备。运行：

    ```shell
    kubectl drain $NODE --ignore-daemonsets
    ```

    <!--
    You should see output similar to this:
    -->
    您应该可以看见与下面类似的输出：

    ```shell
    node/ip-172-31-85-18 cordoned
    WARNING: ignoring DaemonSet-managed Pods: kube-system/kube-proxy-dj7d7, kube-system/weave-net-z65qx
    node/ip-172-31-85-18 drained
    ```

<!--
### Upgrade the kubelet config
-->
### 升级 kubelet 配置

<!--
1.  Upgrade the kubelet config:

    ```shell
    sudo kubeadm upgrade node config --kubelet-version v1.14.x
    ```

    Replace `x` with the patch version you picked for this ugprade.
-->
1.  升级 kubelet 配置:

    ```shell
    sudo kubeadm upgrade node config --kubelet-version v1.14.x
    ```

    <!--
    Replace `x` with the patch version you picked for this ugprade.
    -->
    用最新的修补程序版本替换 1.14.x-00 中的 x


<!--
### Upgrade kubelet and kubectl
-->
### 升级 kubelet 与 kubectl

<!--
1.  Upgrade the Kubernetes package version by running the Linux package manager for your distribution:

    {{< tabs name="k8s_kubelet_and_kubectl" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # replace x in 1.17.x-00 with the latest patch version
    apt-mark unhold kubelet kubectl && \
    apt-get update && apt-get install -y kubelet=1.17.x-00 kubectl=1.17.x-00 && \
    apt-mark hold kubelet kubectl
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    # replace x in 1.17.x-0 with the latest patch version
    yum install -y kubelet-1.17.x-0 kubectl-1.17.x-0 --disableexcludes=kubernetes
    {{% /tab %}}
    {{< /tabs >}}
-->
1.  通过运行适用于您的 Linux 发行版包管理器升级 Kubernetes 软件包版本： 

    {{< tabs name="k8s_kubelet_and_kubectl" >}}
    {{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # 用最新的修补程序版本替换 1.17.x-00 中的 xs
    apt-mark unhold kubelet kubectl && \
    apt-get update && apt-get install -y kubelet=1.17.x-00 kubectl=1.17.x-00 && \
    apt-mark hold kubelet kubectl
    {{% /tab %}}
    {{% tab name="CentOS, RHEL or Fedora" %}}
    # 用最新的修补程序版本替换 1.17.x-00 中的 x
    yum install -y kubelet-1.17.x-0 kubectl-1.17.x-0 --disableexcludes=kubernetes
    {{% /tab %}}
    {{< /tabs >}}

<!--
1. Restart the kubelet

    ```shell
    sudo systemctl restart kubelet
    ```
-->
1.  重启 kubelet

    ```shell
    sudo systemctl restart kubelet
    ```

<!--
### Uncordon the node
-->
### 取消对节点的保护

<!--
1.  Bring the node back online by marking it schedulable:

    ```shell
    kubectl uncordon $NODE
    ```
-->
1.  通过将节点标记为可调度，让节点重新上线:

    ```shell
    kubectl uncordon $NODE
    ```

<!--
## Verify the status of the cluster

After the kubelet is upgraded on all nodes verify that all nodes are available again by running the following command from anywhere kubectl can access the cluster:

```shell
kubectl get nodes
```
-->
## 验证集群的状态

在所有节点上升级 kubelet 后，通过从 kubectl 可以访问集群的任何位置运行以下命令，验证所有节点是否再次可用：

```shell
kubectl get nodes
```

<!--
The `STATUS` column should show `Ready` for all your nodes, and the version number should be updated.
-->
`STATUS` 应显示所有节点为 `Ready` 状态，并且版本号已经被更新。 

{{% /capture %}}

<!--
## Recovering from a failure state

If `kubeadm upgrade` fails and does not roll back, for example because of an unexpected shutdown during execution, you can run `kubeadm upgrade` again.
This command is idempotent and eventually makes sure that the actual state is the desired state you declare.

To recover from a bad state, you can also run `kubeadm upgrade --force` without changing the version that your cluster is running.
-->
## 从故障状态恢复

如果 `kubeadm upgrade` 失败并且没有回滚，例如由于执行期间意外关闭，您可以再次运行 `kubeadm upgrade`。
此命令是幂等的，并最终确保实际状态是您声明的所需状态。
要从故障状态恢复，您还可以运行 `kubeadm upgrade --force` 而不去更改集群正在运行的版本。

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
## 它是怎么工作的

`kubeadm upgrade apply` 做了以下工作：

- 检查您的集群是否处于可升级状态:
  - API 服务器是可访问的
  - 所有节点处于 `Ready` 状态
  - 控制平面是健康的
- 强制执行版本 skew 策略。
- 确保控制平面的镜像是可用的或可拉取到服务器上。
- 升级控制平面组件或回滚（如果其中任何一个组件无法启动）。
- 应用新的 `kube-dns` 和 `kube-proxy` 清单，并强制创建所有必需的 RBAC 规则。
- 如果旧文件在 180 天后过期，将创建 API 服务器的新证书和密钥文件并备份旧文件。

<!--
`kubeadm upgrade node experimental-control-plane` does the following on additional control plane nodes:
- Fetches the kubeadm `ClusterConfiguration` from the cluster.
- Optionally backups the kube-apiserver certificate.
- Upgrades the static Pod manifests for the control plane components.
-->
`kubeadm upgrade node experimental-control-plane` 在其他控制平面节点上执行以下操作：
- 从集群中获取 kubeadm `ClusterConfiguration`。
- 可选地备份 kube-apiserver 证书。
- 升级控制平面组件的静态 Pod 清单。
