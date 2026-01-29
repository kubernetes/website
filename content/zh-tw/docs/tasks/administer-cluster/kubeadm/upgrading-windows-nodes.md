---
title: 升級 Windows 節點
min-kubernetes-server-version: 1.17
content_type: task
weight: 41
---
<!--
title: Upgrading Windows nodes
min-kubernetes-server-version: 1.17
content_type: task
weight: 41
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

<!--
This page explains how to upgrade a Windows node created with kubeadm.
-->
本頁解釋如何升級用 kubeadm 創建的 Windows 節點。

## {{% heading "prerequisites" %}}
 
{{< include "task-tutorial-prereqs-node-upgrade.md" >}} {{< version-check >}}

<!--
* Familiarize yourself with [the process for upgrading the rest of your kubeadm
cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade). You will want to
upgrade the control plane nodes before upgrading your Windows nodes.
-->
* 熟悉[更新 kubeadm 叢集中的其餘組件](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade)。
  在升級你的 Windows 節點之前你會想要升級控制面節點。

<!-- steps -->
<!--
## Upgrading worker nodes

### Upgrade kubeadm
-->
## 升級工作節點   {#upgrading-worker-nodes}

### 升級 kubeadm    {#upgrade-kubeadm}

<!--
1.  From the Windows node, upgrade kubeadm:

    ```powershell
    # replace {{< skew currentPatchVersion >}} with your desired version
    curl.exe -Lo <path-to-kubeadm.exe>  "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubeadm.exe"
    ```
-->
1. 在 Windows 節點上升級 kubeadm：

   ```powershell
   # 將 {{< skew currentPatchVersion >}} 替換爲你希望的版本
   curl.exe -Lo <kubeadm.exe 路徑>  "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubeadm.exe"
   ```

<!--
### Drain the node

1.  From a machine with access to the Kubernetes API,
    prepare the node for maintenance by marking it unschedulable and evicting the workloads:

    ```shell
    # replace <node-to-drain> with the name of your node you are draining
    kubectl drain <node-to-drain> --ignore-daemonsets
    ```

    You should see output similar to this:

    ```
    node/ip-172-31-85-18 cordoned
    node/ip-172-31-85-18 drained
    ```
-->
### 騰空節點   {#drain-the-node}

1. 在一個能訪問到 Kubernetes API 的機器上，將 Windows 節點標記爲不可調度並
   驅逐其上的所有負載，以便準備節點維護操作：

   ```shell
   # 將 <要騰空的節點> 替換爲你要騰空的節點的名稱
   kubectl drain <要騰空的節點> --ignore-daemonsets
   ```

   你應該會看到類似下面的輸出：

   ```
   node/ip-172-31-85-18 cordoned
   node/ip-172-31-85-18 drained
   ```

<!--
### Upgrade the kubelet configuration

1.  From the Windows node, call the following command to sync new kubelet configuration:

    ```powershell
    kubeadm upgrade node
    ```
-->
### 升級 kubelet 設定   {#upgrade-the-kubelet-configuration}

1. 在 Windows 節點上，執行下面的命令來同步新的 kubelet 設定：

   ```powershell
   kubeadm upgrade node
   ```

<!--
### Upgrade kubelet and kube-proxy

1.  From the Windows node, upgrade and restart the kubelet:

    ```powershell
    stop-service kubelet
    curl.exe -Lo <path-to-kubelet.exe> "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubelet.exe"
    restart-service kubelet
    ```
-->
### 升級 kubelet 和 kube-proxy   {#upgrade-kubelet-and-kube-proxy}

1. 在 Windows 節點上升級並重啓 kubelet：

   ```powershell
   stop-service kubelet
   curl.exe -Lo <kubelet.exe 路徑> "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kubelet.exe"
   restart-service kubelet
   ```

<!--
2. From the Windows node, upgrade and restart the kube-proxy.

    ```powershell
    stop-service kube-proxy
    curl.exe -Lo <path-to-kube-proxy.exe> "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kube-proxy.exe"
    restart-service kube-proxy
    ```
-->
2. 在 Windows 節點上升級並重啓 kube-proxy：

   ```powershell
   stop-service kube-proxy
   curl.exe -Lo <kube-proxy.exe 路徑> "https://dl.k8s.io/v{{< skew currentPatchVersion >}}/bin/windows/amd64/kube-proxy.exe"
   restart-service kube-proxy
   ```

{{< note >}}
<!--
If you are running kube-proxy in a HostProcess container within a Pod, and not as a Windows Service,
you can upgrade kube-proxy by applying a newer version of your kube-proxy manifests.
-->
如果你是在 Pod 內的 HostProcess 容器中運行 kube-proxy，而不是作爲 Windows 服務，
你可以通過應用更新版本的 kube-proxy 清單檔案來升級 kube-proxy。
{{< /note >}}

<!--
### Uncordon the node

1.  From a machine with access to the Kubernetes API,
bring the node back online by marking it schedulable:

    ```shell
    # replace <node-to-drain> with the name of your node
    kubectl uncordon <node-to-drain>
    ```
-->
### 對節點執行 uncordon 操作   {#uncordon-the-node}

1. 從一臺能夠訪問到 Kubernetes API 的機器上，通過將節點標記爲可調度，使之
   重新上線：

   ```shell
   # 將 <要騰空的節點> 替換爲你的節點名稱
   kubectl uncordon <要騰空的節點>
   ```

## {{% heading "whatsnext" %}}

<!--
* See how to [Upgrade Linux nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes/).
-->

* 查看如何[升級 Linux 節點](/zh-cn/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes/)。