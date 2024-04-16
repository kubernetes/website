---
title: 将 Docker Engine 节点从 dockershim 迁移到 cri-dockerd
weight: 20
content_type: task 
---

<!--
title: "Migrate Docker Engine nodes from dockershim to cri-dockerd"
weight: 20
content_type: task 
-->

{{% thirdparty-content %}}

<!--
This page shows you how to migrate your Docker Engine nodes to use `cri-dockerd`
instead of dockershim. You should follow these steps in these scenarios:

 * You want to switch away from dockershim and still use Docker Engine to run
    containers in Kubernetes.
 * You want to upgrade to Kubernetes v{{< skew currentVersion >}} and your
    existing cluster relies on dockershim, in which case you must migrate 
    from dockershim and `cri-dockerd` is one of your options.

To learn more about the removal of dockershim, read the [FAQ page](/dockershim).
-->
本页面为你展示如何迁移你的 Docker Engine 节点，使之使用 `cri-dockerd` 而不是 dockershim。
在以下场景中，你可以遵从这里的步骤执行操作：

* 你期望不再使用 dockershim，但仍然使用 Docker Engine 来在 Kubernetes 中运行容器。
* 你希望升级到 Kubernetes v{{< skew currentVersion >}} 且你的现有集群依赖于 dockershim，
  因此你必须放弃 dockershim，而 `cri-dockerd` 是你的一种选项。

要进一步了解 dockershim 的移除，请阅读 [FAQ 页面](/zh-cn/dockershim)。

<!--
## What is cri-dockerd? {#what-is-cri-dockerd}

In Kubernetes 1.23 and earlier, you could use Docker Engine with Kubernetes,
relying on a built-in component of Kubernetes named _dockershim_.
The dockershim component was removed in the Kubernetes 1.24 release; however,
a third-party replacement, `cri-dockerd`, is available. The `cri-dockerd` adapter
lets you use Docker Engine through the {{<glossary_tooltip term_id="cri" text="Container Runtime Interface">}}.
-->
## cri-dockerd 是什么？ {#what-is-cri-dockerd}

在 Kubernetes v1.24 及更早版本中，你可以在 Kubernetes 中使用 Docker Engine，
依赖于一个称作 _dockershim_ 的内置 Kubernetes 组件。
dockershim 组件在 Kubernetes v1.24 发行版本中已被移除；不过，一种来自第三方的替代品，
`cri-dockerd` 是可供使用的。`cri-dockerd` 适配器允许你通过
{{<glossary_tooltip term_id="cri" text="容器运行时接口（Container Runtime Interface，CRI）">}}
来使用 Docker Engine。

{{<note>}}
<!--
If you already use `cri-dockerd`, you aren't affected by the dockershim removal.
Before you begin, [Check whether your nodes use the dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/).
-->
如果你已经在使用 `cri-dockerd`，那么你不会被 dockershim 的移除影响到。
在开始之前，[检查你的节点是否在使用 dockershim](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/)。
{{</note>}}

<!--
If you want to migrate to `cri-dockerd` so that you can continue using Docker
Engine as your container runtime, you should do the following for each affected
node: 

1.  Install `cri-dockerd`.
1.  Cordon and drain the node.
1.  Configure the kubelet to use `cri-dockerd`. 
1.  Restart the kubelet.
1.  Verify that the node is healthy.
-->
如果你想要迁移到 `cri-dockerd` 以便继续使用 Docker Engine 作为你的容器运行时，
你需要在所有被影响的节点上执行以下操作：

1. 安装 `cri-dockerd`；
1. 隔离（Cordon）并腾空（Drain）该节点；
1. 配置 kubelet 使用 `cri-dockerd`；
1. 重新启动 kubelet；
1. 验证节点处于健康状态。

<!--
Test the migration on non-critical nodes first.

You should perform the following steps for each node that you want to migrate
to `cri-dockerd`.
-->
首先在非关键节点上测试这一迁移过程。

你应该针对所有希望迁移到 `cri-dockerd` 的节点执行以下步骤。

## {{% heading "prerequisites" %}}

<!--
*   [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/usage/install)
    installed and started on each node.
*   A [network plugin](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/).
-->
* 安装了 [`cri-dockerd`](https://mirantis.github.io/cri-dockerd/usage/install)
  并且该服务已经在各节点上启动；
* 一个[网络插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)。

<!--
## Cordon and drain the node

1.  Cordon the node to stop new Pods scheduling on it:

    ```shell
    kubectl cordon <NODE_NAME>
    ```
    Replace `<NODE_NAME>` with the name of the node.
-->
## 隔离并腾空节点   {#cordon-and-drain-the-node}

1. 隔离节点，阻止新的 Pod 被调度到节点上：

   ```shell
   kubectl cordon <NODE_NAME>
   ```

   将 `<NODE_NAME>` 替换为节点名称。

<!--
1.  Drain the node to safely evict running Pods:
-->
2. 腾空节点以安全地逐出所有运行中的 Pod：

   ```shell
   kubectl drain <NODE_NAME> --ignore-daemonsets
   ```

<!--
## Configure the kubelet to use cri-dockerd

The following steps apply to clusters set up using the kubeadm tool. If you use
a different tool, you should modify the kubelet using the configuration
instructions for that tool.
-->
## 配置 kubelet 使用 cri-dockerd   {#configure-the-kubelet-to-use-cri-dockerd}

下面的步骤适用于用 kubeadm 工具安装的集群。如果你使用不同的工具，
你需要使用针对该工具的配置指令来修改 kubelet。

<!--
1.  Open `/var/lib/kubelet/kubeadm-flags.env` on each affected node.
1.  Modify the `--container-runtime-endpoint` flag to
    `unix:///var/run/cri-dockerd.sock`.
1.  Modify the `--container-runtime` flag to `remote`
    (unavailable in Kubernetes v1.27 and later).
-->
1. 在每个被影响的节点上，打开 `/var/lib/kubelet/kubeadm-flags.env` 文件；
1. 将 `--container-runtime-endpoint` 标志，将其设置为 `unix:///var/run/cri-dockerd.sock`。
1. 将 `--container-runtime` 标志修改为 `remote`（在 Kubernetes v1.27 及更高版本中不可用）。

<!--
The kubeadm tool stores the node's socket as an annotation on the `Node` object
in the control plane. To modify this socket for each affected node:  
-->
kubeadm 工具将节点上的套接字存储为控制面上 `Node` 对象的注解。
要为每个被影响的节点更改此套接字：

<!--
1.  Edit the YAML representation of the `Node` object:

    ```shell
    KUBECONFIG=/path/to/admin.conf kubectl edit no <NODE_NAME>
    ```
    Replace the following:
    
    *   `/path/to/admin.conf`: the path to the kubectl configuration file,
        `admin.conf`.
    *   `<NODE_NAME>`: the name of the node you want to modify.

1.  Change `kubeadm.alpha.kubernetes.io/cri-socket` from
    `/var/run/dockershim.sock` to `unix:///var/run/cri-dockerd.sock`.
1.  Save the changes. The `Node` object is updated on save.
-->
1. 编辑 `Node` 对象的 YAML 表示：

   ```shell
   KUBECONFIG=/path/to/admin.conf kubectl edit no <NODE_NAME>
   ```

   根据下面的说明执行替换：
    
   * `/path/to/admin.conf`：指向 kubectl 配置文件 `admin.conf` 的路径；
   * `<NODE_NAME>`：你要修改的节点的名称。

1. 将 `kubeadm.alpha.kubernetes.io/cri-socket` 标志从
   `/var/run/dockershim.sock` 更改为 `unix:///var/run/cri-dockerd.sock`；
1. 保存所作更改。保存时，`Node` 对象被更新。

<!--
## Restart the kubelet
-->
## 重启 kubelet    {#restart-the-kubelet}

```shell
systemctl restart kubelet
```

<!--
## Verify that the node is healthy

To check whether the node uses the `cri-dockerd` endpoint, follow the
instructions in [Find out which runtime you use](/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/).
The `--container-runtime-endpoint` flag for the kubelet should be `unix:///var/run/cri-dockerd.sock`.
-->
## 验证节点处于健康状态   {#verify-that-the-node-is-healthy}

要检查节点是否在使用 `cri-dockerd` 端点，
按照[找出你所使用的运行时](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/)页面所给的指令操作。
kubelet 的 `--container-runtime-endpoint` 标志取值应该是 `unix:///var/run/cri-dockerd.sock`。

<!--
## Uncordon the node

Uncordon the node to let Pods schedule on it: 
-->
## 解除节点隔离   {#uncordon-the-node}

```shell
kubectl uncordon <NODE_NAME>
```

## {{% heading "whatsnext" %}}

<!--
*   Read the [dockershim removal FAQ](/dockershim/).
*   [Learn how to migrate from Docker Engine with dockershim to containerd](/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd/).
-->
* 阅读 [移除 Dockershim 的常见问题](/zh-cn/dockershim)。
* [了解如何从基于 dockershim 的 Docker Engine 迁移到 containerd](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd/)。

