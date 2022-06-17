---
title: 升級 Windows 節點
min-kubernetes-server-version: 1.17
content_type: task
weight: 40
---
<!--
title: Upgrading Windows nodes
min-kubernetes-server-version: 1.17
content_type: task
weight: 40
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

<!--
This page explains how to upgrade a Windows node [created with kubeadm](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes).
-->
本頁解釋如何升級[用 kubeadm 建立的](/zh-cn/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes)
Windows 節點。

## {{% heading "prerequisites" %}}
 
{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
* Familiarize yourself with [the process for upgrading the rest of your kubeadm
cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade). You will want to
upgrade the control plane nodes before upgrading your Windows nodes.
-->
* 熟悉[更新 kubeadm 叢集中的其餘元件](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade)。
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
    # replace {{< param "fullversion" >}} with your desired version
    curl.exe -Lo C:\k\kubeadm.exe https://dl.k8s.io/{{< param "fullversion" >}}/bin/windows/amd64/kubeadm.exe
    ```
-->
1. 在 Windows 節點上升級 kubeadm：

   ```powershell
   # 將 {{< param "fullversion" >}} 替換為你希望的版本
   curl.exe -Lo C:\k\kubeadm.exe https://dl.k8s.io/{{< param "fullversion" >}}/bin/windows/amd64/kubeadm.exe
   ```

<!--
### Drain the node

1.  From a machine with access to the Kubernetes API,
    prepare the node for maintenance by marking it unschedulable and evicting the workloads:

    ```shell
    # replace <node-to-drain> with the name of your node you are draining
    kubectl drain <node-to-drain> -ignore-daemonsets
    ```

    You should see output similar to this:

    ```
    node/ip-172-31-85-18 cordoned
    node/ip-172-31-85-18 drained
    ```
-->
### 騰空節點   {#drain-the-node}

1. 在一個能訪問到 Kubernetes API 的機器上，將 Windows 節點標記為不可排程並
   驅逐其上的所有負載，以便準備節點維護操作：

   ```shell
   # 將 <要騰空的節點> 替換為你要騰空的節點的名稱
   kubectl drain <要騰空的節點> -ignore-daemonsets
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
### 升級 kubelet 配置   {#upgrade-the-kubelet-configuration}

1. 在 Windows 節點上，執行下面的命令來同步新的 kubelet 配置：

   ```powershell
   kubeadm upgrade node
   ```

<!--
### Upgrade kubelet

1.  From the Windows node, upgrade and restart the kubelet:

    ```powershell
    stop-service kubelet
    curl.exe -Lo C:\k\kubelet.exe https://dl.k8s.io/{{< param "fullversion" >}}/bin/windows/amd64/kubelet.exe
    restart-service kubelet
    ```
-->
### 升級 kubelet   {#upgrade-kubelet}

1. 在 Windows 節點上升級並重啟 kubelet：

   ```powershell
   stop-service kubelet
   curl.exe -Lo C:\k\kubelet.exe https://dl.k8s.io/{{< param "fullversion" >}}/bin/windows/amd64/kubelet.exe
   restart-service kubelet
   ```

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

1. 從一臺能夠訪問到 Kubernetes API 的機器上，透過將節點標記為可排程，使之
   重新上線：

   ```shell
   # 將 <要騰空的節點> 替換為你的節點名稱
   kubectl uncordon <要騰空的節點>
   ```

<!--
### Upgrade kube-proxy

1. From a machine with access to the Kubernetes API, run the following,
again replacing {{< param "fullversion" >}} with your desired version:

    ```shell
    curl -L https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/kube-proxy.yml | sed 's/VERSION/{{< param "fullversion" >}}/g' | kubectl apply -f -
    ```
-->
### 升級 kube-proxy   {#upgrade-kube-proxy}

1. 在一臺可訪問 Kubernetes API 的機器上和，將 {{< param "fullversion" >}} 替換成你
   期望的版本後再次執行下面的命令：

   ```shell
   curl -L https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/kube-proxy.yml | sed 's/VERSION/{{< param "fullversion" >}}/g' | kubectl apply -f -
    ```

