---
title: 將 Docker Engine 節點從 dockershim 遷移到 cri-dockerd
weight: 9
content_type: task 
---

<!--
title: "Migrate Docker Engine nodes from dockershim to cri-dockerd"
weight: 9
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
本頁面為你展示如何遷移你的 Docker Engine 節點，使之使用 `cri-dockerd` 而不是 dockershim。
在以下場景中，你可以遵從這裡的步驟執行操作：

* 你期望不再使用 dockershim，但仍然使用 Docker Engine 來在 Kubernetes 中執行容器。
* 你希望升級到 Kubernetes v{{< skew currentVersion >}} 且你的現有叢集依賴於 dockershim，
  因此你必須放棄 dockershim，而 `cri-dockerd` 是你的一種選項。

要進一步瞭解 dockershim 的移除，請閱讀 [FAQ 頁面](/zh-cn/dockershim)。

<!--
## What is cri-dockerd? {#what-is-cri-dockerd}

In Kubernetes 1.23 and earlier, you could use Docker Engine with Kubernetes,
relying on a built-in component of Kubernetes named _dockershim_.
The dockershim component was removed in the Kubernetes 1.24 release; however,
a third-party replacement, `cri-dockerd`, is available. The `cri-dockerd` adapter
lets you use Docker Engine through the {{<glossary_tooltip term_id="cri" text="Container Runtime Interface">}}.
-->
## cri-dockerd 是什麼？ {#what-is-cri-dockerd}

在 Kubernetes v1.24 及更早版本中，你可以在 Kubernetes 中使用 Docker Engine，
依賴於一個稱作 _dockershim_ 的內建 Kubernetes 元件。
dockershim 元件在 Kubernetes v1.24 發行版本中已被移除；不過，一種來自第三方的替代品，
`cri-dockerd` 是可供使用的。`cri-dockerd` 介面卡允許你透過
{{<glossary_tooltip term_id="cri" text="容器執行時介面（Container Runtime Interface，CRI）">}}
來使用 Docker Engine。

{{<note>}}
<!--
If you already use `cri-dockerd`, you aren't affected by the dockershim removal.
Before you begin, [Check whether your nodes use the dockershim](/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/).
-->
如果你已經在使用 `cri-dockerd`，那麼你不會被 dockershim 的移除影響到。
在開始之前，[檢查你的節點是否在使用 dockershim](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/)。
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
如果你想要遷移到 `cri-dockerd` 以便繼續使用 Docker Engine 作為你的容器執行時，
你需要在所有被影響的節點上執行以下操作：

1. 安裝 `cri-dockerd`；
1. 隔離（Cordon）並騰空（Drain）該節點；
1. 配置 kubelet 使用 `cri-dockerd`；
1. 重新啟動 kubelet；
1. 驗證節點處於健康狀態。

<!--
Test the migration on non-critical nodes first.

You should perform the following steps for each node that you want to migrate
to `cri-dockerd`.
-->
首先在非關鍵節點上測試這一遷移過程。

你應該針對所有希望遷移到 `cri-dockerd` 的節點執行以下步驟。

## {{% heading "prerequisites" %}}

<!--
*   [`cri-dockerd`](https://github.com/mirantis/cri-dockerd#build-and-install)
    installed and started on each node.
*   A [network plugin](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/).
-->
* 安裝了 [`cri-dockerd`](https://github.com/mirantis/cri-dockerd#build-and-install)
  並且該服務已經在各節點上啟動；
* 一個[網路外掛](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)。

<!--
## Cordon and drain the node

1.  Cordon the node to stop new Pods scheduling on it:

    ```shell
    kubectl cordon <NODE_NAME>
    ```
    Replace `<NODE_NAME>` with the name of the node.
-->
## 隔離並騰空節點   {#cordon-and-drain-the-node}

1. 隔離節點，阻止新的 Pod 被排程到節點上：

   ```shell
   kubectl cordon <NODE_NAME>
   ```

   將 `<NODE_NAME>` 替換為節點名稱。

<!--
1.  Drain the node to safely evict running Pods: 
-->
2. 騰空節點以安全地逐出所有執行中的 Pod：

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

下面的步驟適用於用 kubeadm 工具安裝的叢集。如果你使用不同的工具，
你需要使用針對該工具的配置指令來修改 kubelet。

<!--
1.  Open `/var/lib/kubelet/kubeadm-flags.env` on each affected node.
1.  Modify the `--container-runtime-endpoint` flag to
    `unix:///var/run/cri-dockerd.sock`.
-->
1. 在每個被影響的節點上，開啟 `/var/lib/kubelet/kubeadm-flags.env` 檔案；
1. 將 `--container-runtime-endpoint` 標誌，將其設定為 `unix:///var/run/cri-dockerd.sock`。

<!--
The kubeadm tool stores the node's socket as an annotation on the `Node` object
in the control plane. To modify this socket for each affected node:  
-->
kubeadm 工具將節點上的套接字儲存為控制面上 `Node` 物件的註解。
要為每個被影響的節點更改此套接字：

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
1. 編輯 `Node` 物件的 YAML 表示：

   ```shell
   KUBECONFIG=/path/to/admin.conf kubectl edit no <NODE_NAME>
   ```

   根據下面的說明執行替換：
    
   * `/path/to/admin.conf`：指向 kubectl 配置檔案 `admin.conf` 的路徑；
   * `<NODE_NAME>`：你要修改的節點的名稱。

1. 將 `kubeadm.alpha.kubernetes.io/cri-socket` 標誌從
   `/var/run/dockershim.sock` 更改為 `unix:///var/run/cri-dockerd.sock`；
1. 儲存所作更改。儲存時，`Node` 物件被更新


<!--
## Restart the kubelet
-->
## 重啟 kubelet    {#restart-the-kubelet}

```shell
systemctl restart kubelet
```

<!--
## Verify that the node is healthy

To check whether the node uses the `cri-dockerd` endpoint, follow the
instructions in [Find out which runtime you use](/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/).
The `--container-runtime-endpoint` flag for the kubelet should be `unix:///var/run/cri-dockerd.sock`.
-->
## 驗證節點處於健康狀態   {#verify-that-the-node-is-healthy}

要檢查節點是否在使用 `cri-dockerd` 端點，
按照[找出你所使用的執行時](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/find-out-runtime-you-use/)頁面所給的指令操作。
kubelet 的 `--container-runtime-endpoint` 標誌取值應該是 `unix:///var/run/cri-dockerd.sock`。

<!--
## Uncordon the node

Uncordon the node to let Pods schedule on it: 
-->
## 解除節點隔離   {#uncordon-the-node}

```shell
kubectl uncordon <NODE_NAME>
```

## {{% heading "whatsnext" %}}

<!--
*   Read the [dockershim removal FAQ](/dockershim/).
*   [Learn how to migrate from Docker Engine with dockershim to containerd](/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd/).
-->
* 閱讀 [dockershim 移除常見問題](/zh-cn/dockershim)。
* [瞭解如何從基於 dockershim 的 Docker Engine 遷移到 containerd](/zh-cn/docs/tasks/administer-cluster/migrating-from-dockershim/change-runtime-containerd/)。

