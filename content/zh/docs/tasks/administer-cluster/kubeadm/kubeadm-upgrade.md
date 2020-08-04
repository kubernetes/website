---
reviewers:
- sig-cluster-lifecycle
title: 升级 kubeadm 集群
content_type: task
---
<!--
---
reviewers:
- sig-cluster-lifecycle
title: Upgrading kubeadm clusters
content_type: task
---
-->

<!-- overview -->

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
- [Upgrading kubeadm cluster from 1.16 to 1.17](https://v1-17.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Upgrading kubeadm cluster from 1.15 to 1.16](https://v1-16.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [Upgrading kubeadm cluster from 1.14 to 1.15](https://v1-15.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-15/)
- [Upgrading kubeadm cluster from 1.13 to 1.14](https://v1-15.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-14/)
-->
- [将 kubeadm 集群从 1.16 升级到 1.17](https://v1-17.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [将 kubeadm 集群从 1.15 升级到 1.16](https://v1-16.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [将 kubeadm 集群从 1.14 升级到 1.15](https://v1-15.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-15/)
- [将 kubeadm 集群从 1.13 升级到 1.14](https://v1-15.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-14/)

<!--
The upgrade workflow at high level is the following:

1. Upgrade the primary control plane node.
1. Upgrade additional control plane nodes.
1. Upgrade worker nodes.
-->
升级工作的基本流程如下：

1. 升级主控制平面节点。
1. 升级其他控制平面节点。
1. 升级工作节点。

## {{% heading "prerequisites" %}}

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

<!-- steps -->

<!--
## Determine which version to upgrade to
-->
## 确定要升级到哪个版本

<!--
Find the latest stable 1.18 version:

{{< tabs name="k8s_install_versions" >}}
{{% tab name="Ubuntu, Debian or HypriotOS" %}}
    apt update
    apt-cache policy kubeadm
    # find the latest 1.18 version in the list
    # it should look like 1.18.x-00, where x is the latest patch
{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}
    yum list --showduplicates kubeadm --disableexcludes=kubernetes
    # find the latest 1.18 version in the list
    # it should look like 1.18.x-0, where x is the latest patch
{{% /tab %}}
{{< /tabs >}}
-->
找到最新的稳定版 1.18：

{{< tabs name="k8s_install_versions" >}}
{{% tab name="Ubuntu, Debian or HypriotOS" %}}
    apt update
    apt-cache policy kubeadm
    # 在列表中查找最新的 1.18 版本
    # 它看起来应该是 1.18.x-00 ，其中 x 是最新的补丁
{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}
    yum list --showduplicates kubeadm --disableexcludes=kubernetes
    # 在列表中查找最新的 1.18 版本
    # 它看起来应该是 1.18.x-0 ，其中 x 是最新的补丁版本
{{% /tab %}}
{{< /tabs >}}

<!--
## Upgrade the control plane node

### Upgrade the first control plane node
-->
## 升级控制平面节点

### 升级第一个控制面节点

<!--
- On your first control plane node, upgrade kubeadm:

{{< tabs name="k8s_install_kubeadm_first_cp" >}}
{{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # replace x in 1.18.x-00 with the latest patch version
    apt-mark unhold kubeadm && \
    apt-get update && apt-get install -y kubeadm=1.18.x-00 && \
    apt-mark hold kubeadm
{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}
    # replace x in 1.18.x-0 with the latest patch version
    yum install -y kubeadm-1.18.x-0 -disableexcludes=kubernetes
{{% /tab %}}
{{< /tabs >}}
-->
-  在第一个控制平面节点上，升级 kubeadm :

{{< tabs name="k8s_install_kubeadm_first_cp" >}}
{{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # 用最新的修补程序版本替换 1.18.x-00 中的 x
    apt-mark unhold kubeadm && \
    apt-get update && apt-get install -y kubeadm=1.18.x-00 && \
    apt-mark hold kubeadm
{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}
    # 用最新的修补程序版本替换 1.18.x-0 中的 x
    yum install -y kubeadm-1.18.x-0 --disableexcludes=kubernetes
{{% /tab %}}
{{< /tabs >}}

<!--
- Verify that the download works and has the expected version:

  ```shell
  kubeadm version
  ```
-->
- 验证下载操作正常，并且 kubeadm 版本正确：

  ```shell
  kubeadm version
  ```

<!--
- Drain the control plane node:
  ```shell
  # replace <cp-node-name> with the name of your control plane node
  kubectl drain $CP_NODE -ignore-daemonsets
  ```
-->
- 腾空控制平面节点：

  ```shell
  # 将 <cp-node-name> 替换为你自己的控制面节点名称
  kubectl drain <cp-node-name> --ignore-daemonsets
  ```

<!--
- On the control plane node, run:
-->
- 在控制面节点上，运行:

  ```shell
  sudo kubeadm upgrade plan
  ```

  <!--
  You should see output similar to this:
  -->
  您应该可以看到与下面类似的输出：

  ```none
  [upgrade/config] Making sure the configuration is correct:
  [upgrade/config] Reading configuration from the cluster...
  [upgrade/config] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
  [preflight] Running pre-flight checks.
  [upgrade] Running cluster health checks
  [upgrade] Fetching available versions to upgrade to
  [upgrade/versions] Cluster version: v1.17.3
  [upgrade/versions] kubeadm version: v1.18.0
  [upgrade/versions] Latest stable version: v1.18.0
  [upgrade/versions] Latest version in the v1.17 series: v1.18.0

  Components that must be upgraded manually after you have upgraded the control plane with 'kubeadm upgrade apply':
  COMPONENT   CURRENT             AVAILABLE
  Kubelet     1 x v1.17.3   v1.18.0

  Upgrade to the latest version in the v1.17 series:

  COMPONENT            CURRENT   AVAILABLE
  API Server           v1.17.3   v1.18.0
  Controller Manager   v1.17.3   v1.18.0
  Scheduler            v1.17.3   v1.18.0
  Kube Proxy           v1.17.3   v1.18.0
  CoreDNS              1.6.5     1.6.7
  Etcd                 3.4.3     3.4.3-0

  You can now apply the upgrade by executing the following command:

      kubeadm upgrade apply v1.18.0

  _____________________________________________________________________
  ```

  <!--
  This command checks that your cluster can be upgraded, and fetches the versions you can upgrade to.
  -->
  此命令检查您的集群是否可以升级，并可以获取到升级的版本。

<!--
`kubeadm upgrade` also automatically renews the certificates that it manages on this node.
To opt-out of certificate renewal the flag `-certificate-renewal=false` can be used.
For more information see the [certificate management guide](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs).
-->

{{< note >}}
`kubeadm upgrade` 也会自动对它在此节点上管理的证书进行续约。
如果选择不对证书进行续约，可以使用标志 `--certificate-renewal=false`。
关于更多细节信息，可参见[证书管理指南](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs)。
{{</ note >}}

<!--
- Choose a version to upgrade to, and run the appropriate command. For example:

    ```shell
    # replace x with the patch version you picked for this upgrade
    sudo kubeadm upgrade apply v1.18.x
    ```
-->
- 选择要升级到的版本，然后运行相应的命令。例如:

  ```shell
  # 将 x 替换为你为此次升级所选的补丁版本号
  sudo kubeadm upgrade apply v1.18.x
  ```

  <!--
  You should see output similar to this:
  -->
  您应该可以看见与下面类似的输出：

  ```none
  [upgrade/config] Making sure the configuration is correct:
  [upgrade/config] Reading configuration from the cluster...
  [upgrade/config] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
  [preflight] Running pre-flight checks.
  [upgrade] Running cluster health checks
  [upgrade/version] You have chosen to change the cluster version to "v1.18.0"
  [upgrade/versions] Cluster version: v1.17.3
  [upgrade/versions] kubeadm version: v1.18.0
  [upgrade/confirm] Are you sure you want to proceed with the upgrade? [y/N]: y
  [upgrade/prepull] Will prepull images for components [kube-apiserver kube-controller-manager kube-scheduler etcd]
  [upgrade/prepull] Prepulling image for component etcd.
  [upgrade/prepull] Prepulling image for component kube-apiserver.
  [upgrade/prepull] Prepulling image for component kube-controller-manager.
  [upgrade/prepull] Prepulling image for component kube-scheduler.
  [apiclient] Found 1 Pods for label selector k8s-app=upgrade-prepull-kube-controller-manager
  [apiclient] Found 0 Pods for label selector k8s-app=upgrade-prepull-etcd
  [apiclient] Found 0 Pods for label selector k8s-app=upgrade-prepull-kube-scheduler
  [apiclient] Found 1 Pods for label selector k8s-app=upgrade-prepull-kube-apiserver
  [apiclient] Found 1 Pods for label selector k8s-app=upgrade-prepull-etcd
  [apiclient] Found 1 Pods for label selector k8s-app=upgrade-prepull-kube-scheduler
  [upgrade/prepull] Prepulled image for component etcd.
  [upgrade/prepull] Prepulled image for component kube-apiserver.
  [upgrade/prepull] Prepulled image for component kube-controller-manager.
  [upgrade/prepull] Prepulled image for component kube-scheduler.
  [upgrade/prepull] Successfully prepulled the images for all the control plane components
  [upgrade/apply] Upgrading your Static Pod-hosted control plane to version "v1.18.0"...
  Static pod: kube-apiserver-myhost hash: 2cc222e1a577b40a8c2832320db54b46
  Static pod: kube-controller-manager-myhost hash: f7ce4bc35cb6e646161578ac69910f18
  Static pod: kube-scheduler-myhost hash: e3025acd90e7465e66fa19c71b916366
  [upgrade/etcd] Upgrading to TLS for etcd
  [upgrade/etcd] Non fatal issue encountered during upgrade: the desired etcd version for this Kubernetes version "v1.18.0" is "3.4.3-0", but the current etcd version is "3.4.3". Won't downgrade etcd, instead just continue
  [upgrade/staticpods] Writing new Static Pod manifests to "/etc/kubernetes/tmp/kubeadm-upgraded-manifests308527012"
  W0308 18:48:14.535122    3082 manifests.go:225] the default kube-apiserver authorization-mode is "Node,RBAC"; using "Node,RBAC"
  [upgrade/staticpods] Preparing for "kube-apiserver" upgrade
  [upgrade/staticpods] Renewing apiserver certificate
  [upgrade/staticpods] Renewing apiserver-kubelet-client certificate
  [upgrade/staticpods] Renewing front-proxy-client certificate
  [upgrade/staticpods] Renewing apiserver-etcd-client certificate
  [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/kube-apiserver.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests-2020-03-08-18-48-14/kube-apiserver.yaml"
  [upgrade/staticpods] Waiting for the kubelet to restart the component
  [upgrade/staticpods] This might take a minute or longer depending on the component/version gap (timeout 5m0s)
  Static pod: kube-apiserver-myhost hash: 2cc222e1a577b40a8c2832320db54b46
  Static pod: kube-apiserver-myhost hash: 609429acb0d71dce6725836dd97d8bf4
  [apiclient] Found 1 Pods for label selector component=kube-apiserver
  [upgrade/staticpods] Component "kube-apiserver" upgraded successfully!
  [upgrade/staticpods] Preparing for "kube-controller-manager" upgrade
  [upgrade/staticpods] Renewing controller-manager.conf certificate
  [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/kube-controller-manager.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests-2020-03-08-18-48-14/kube-controller-manager.yaml"
  [upgrade/staticpods] Waiting for the kubelet to restart the component
  [upgrade/staticpods] This might take a minute or longer depending on the component/version gap (timeout 5m0s)
  Static pod: kube-controller-manager-myhost hash: f7ce4bc35cb6e646161578ac69910f18
  Static pod: kube-controller-manager-myhost hash: c7a1232ba2c5dc15641c392662fe5156
  [apiclient] Found 1 Pods for label selector component=kube-controller-manager
  [upgrade/staticpods] Component "kube-controller-manager" upgraded successfully!
  [upgrade/staticpods] Preparing for "kube-scheduler" upgrade
  [upgrade/staticpods] Renewing scheduler.conf certificate
  [upgrade/staticpods] Moved new manifest to "/etc/kubernetes/manifests/kube-scheduler.yaml" and backed up old manifest to "/etc/kubernetes/tmp/kubeadm-backup-manifests-2020-03-08-18-48-14/kube-scheduler.yaml"
  [upgrade/staticpods] Waiting for the kubelet to restart the component
  [upgrade/staticpods] This might take a minute or longer depending on the component/version gap (timeout 5m0s)
  Static pod: kube-scheduler-myhost hash: e3025acd90e7465e66fa19c71b916366
  Static pod: kube-scheduler-myhost hash: b1b721486ae0ac504c160dcdc457ab0d
  [apiclient] Found 1 Pods for label selector component=kube-scheduler
  [upgrade/staticpods] Component "kube-scheduler" upgraded successfully!
  [upload-config] Storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
  [kubelet] Creating a ConfigMap "kubelet-config-1.18" in namespace kube-system with the configuration for the kubelets in the cluster
  [kubelet-start] Downloading configuration for the kubelet from the "kubelet-config-1.18" ConfigMap in the kube-system namespace
  [kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
  [bootstrap-token] configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
  [bootstrap-token] configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
  [bootstrap-token] configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
  [addons] Applied essential addon: CoreDNS
  [addons] Applied essential addon: kube-proxy

  [upgrade/successful] SUCCESS! Your cluster was upgraded to "v1.18.0". Enjoy!

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

  您的容器网络接口（CNI）驱动应该提供了程序自身的升级说明。
  检查[插件](/docs/concepts/cluster-administration/addons/)页面查找您 CNI 所提供的程序，并查看是否需要其他升级步骤。

  如果 CNI 提供程序作为 DaemonSet 运行，则在其他控制平面节点上不需要此步骤。

<!--
- Uncordon the control plane node

    ```shell
    # replace <cp-node-name> with the name of your control plane node
    kubectl uncordon <cp-node-name>
    ```
-->
- 取消对控制面节点的保护

  ```shell
  # 将 <cp-node-name> 替换为你的控制面节点名称
  kubectl uncordon <cp-node-name>
  ```

<!--
### Upgrade additional control plane nodes

Same as the first control plane node but use:
-->
### 升级其他控制面节点

与第一个控制面节点类似，不过使用下面的命令：

```
sudo kubeadm upgrade node
```

<!-- instead of: -->
而不是：

```
sudo kubeadm upgrade apply
```

<!-- Also `sudo kubeadm upgrade plan` is not needed. -->
同时，也不需要执行 `sudo kubeadm upgrade plan`。

<!--
### Upgrade kubelet and kubectl
-->
### 升级 kubelet 和 kubectl

{{< tabs name="k8s_install_kubelet" >}}
{{% tab name="Ubuntu、Debian 或 HypriotOS" %}}
    # 用最新的补丁版本替换 1.18.x-00 中的 x
    apt-mark unhold kubelet kubectl && \
    apt-get update && apt-get install -y kubelet=1.18.x-00 kubectl=1.18.x-00 && \
    apt-mark hold kubelet kubectl
    -
    # 从 apt-get 的 1.1 版本开始，你也可以使用下面的方法：
    apt-get update && \
    apt-get install -y --allow-change-held-packages kubelet=1.18.x-00 kubectl=1.18.x-00
{{% /tab %}}
{{% tab name="CentOS、RHEL 或 Fedora" %}}
    # 用最新的补丁版本替换 1.18.x-00 中的 x
    yum install -y kubelet-1.18.x-0 kubectl-1.18.x-0 --disableexcludes=kubernetes
{{% /tab %}}
{{< /tabs >}}

<!--
Restart the kubelet
-->
重启 kubelet

```shell
sudo systemctl daemon-reload
sudo systemctl restart kubelet
```

<!--
## Upgrade worker nodes

The upgrade procedure on worker nodes should be executed one node at a time or few nodes at a time,
without compromising the minimum required capacity for running your workloads.
-->
## 升级工作节点

工作节点上的升级过程应该一次执行一个节点，或者一次执行几个节点，以不影响运行工作负载所需的最小容量。

<!--
### Upgrade kubeadm
-->
### 升级 kubeadm

<!--
- Upgrade kubeadm on all worker nodes:

{{< tabs name="k8s_install_kubeadm_worker_nodes" >}}
{{% tab name="Ubuntu, Debian or HypriotOS" %}}
    # replace x in 1.18.x-00 with the latest patch version
    apt-mark unhold kubeadm && \
    apt-get update && apt-get install -y kubeadm=1.18.x-00 && \
    apt-mark hold kubeadm
{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}
    # replace x in 1.18.x-0 with the latest patch version
    yum install -y kubeadm-1.18.x-0 -disableexcludes=kubernetes
{{% /tab %}}
{{< /tabs >}}
-->
- 在所有工作节点升级 kubeadm:

{{< tabs name="k8s_install_kubeadm_worker_nodes" >}}
{{% tab name="Ubuntu、Debian 或 HypriotOS" %}}
    # 将 1.18.x-00 中的 x 替换为最新的补丁版本
    apt-mark unhold kubeadm && \
    apt-get update && apt-get install -y kubeadm=1.18.x-00 && \
    apt-mark hold kubeadm
    -
    # 从 apt-get 的 1.1 版本开始，你也可以使用下面的方法：
    apt-get update && \
    apt-get install -y --allow-change-held-packages kubeadm=1.18.x-00
{{% /tab %}}
{{% tab name="CentOS、RHEL 或 Fedora" %}}
    # 用最新的补丁版本替换 1.18.x-00 中的 x
    yum install -y kubeadm-1.18.x-0 --disableexcludes=kubernetes
{{% /tab %}}
{{< /tabs >}}

<!--
### Cordon the node
-->
### 保护节点

<!--
1.  Prepare the node for maintenance by marking it unschedulable and evicting the workloads. Run:

    ```shell
    # replace <node-to-drain> with the name of your node you are draining
    kubectl drain <node-to-drain> --ignore-daemonsets

    You should see output similar to this:

    ```shell
    node/ip-172-31-85-18 cordoned
    WARNING: ignoring DaemonSet-managed Pods: kube-system/kube-proxy-dj7d7, kube-system/weave-net-z65qx
    node/ip-172-31-85-18 drained
    ```
-->
- 通过将节点标记为不可调度并逐出工作负载，为维护做好准备。运行：

  ```shell
  # 将 <node-to-drain> 替换为你正在腾空的节点的名称
  kubectl drain <node-to-drain> --ignore-daemonsets
  ```

  <!--
  You should see output similar to this:
  -->
  你应该可以看见与下面类似的输出：

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
    sudo kubeadm upgrade node
    ```
-->
- 升级 kubelet 配置:

  ```shell
  sudo kubeadm upgrade node
  ```

<!--
### Upgrade kubelet and kubectl
-->
### 升级 kubelet 与 kubectl

<!--
-  Upgrade the kubelet and kubectl on all worker nodes:
-->
- 在所有工作节点上升级 kubelet 和 kubectl： 

{{< tabs name="k8s_kubelet_and_kubectl" >}}
{{% tab name="Ubuntu、Debian 或 HypriotOS" %}}
    # 将 1.18.x-00 中的 x 替换为最新的补丁版本
    apt-mark unhold kubelet kubectl && \
    apt-get update && apt-get install -y kubelet=1.18.x-00 kubectl=1.18.x-00 && \
    apt-mark hold kubelet kubectl
    -
    # 从 apt-get 的 1.1 版本开始，你也可以使用下面的方法：
    apt-get update && \
    apt-get install -y --allow-change-held-packages kubelet=1.18.x-00 kubectl=1.18.x-00
{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}
    # 将 1.18.x-00 中的 x 替换为最新的补丁版本
    yum install -y kubelet-1.18.x-0 kubectl-1.18.x-0 --disableexcludes=kubernetes
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
- Upgrades the control plane components or rollbacks if any of them fails to come up.
- Applies the new `kube-dns` and `kube-proxy` manifests and makes sure that all necessary RBAC rules are created.
- Creates new certificate and key files of the API server and backs up old files if they're about to expire in 180 days.
-->
## 工作原理

`kubeadm upgrade apply` 做了以下工作：

- 检查您的集群是否处于可升级状态:
  - API 服务器是可访问的
  - 所有节点处于 `Ready` 状态
  - 控制面是健康的
- 强制执行版本 skew 策略。
- 确保控制面的镜像是可用的或可拉取到服务器上。
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
- 可选地备份 kube-apiserver 证书。
- 升级控制平面组件的静态 Pod 清单。
- 为本节点升级 kubelet 配置

<!--
`kubeadm upgrade node` does the following on worker nodes:

- Fetches the kubeadm `ClusterConfiguration` from the cluster.
- Upgrades the kubelet configuration for this node.
-->
`kubeadm upgrade node` 在工作节点上完成以下工作：

- 从集群取回 kubeadm `ClusterConfiguration`。 
- 为本节点升级 kubelet 配置

