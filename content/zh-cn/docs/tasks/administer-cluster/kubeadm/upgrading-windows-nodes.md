---
title: 升级 Windows 节点
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
本页解释如何升级[用 kubeadm 创建的](/zh/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes)
Windows 节点。

## {{% heading "prerequisites" %}}
 
{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!--
* Familiarize yourself with [the process for upgrading the rest of your kubeadm
cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade). You will want to
upgrade the control plane nodes before upgrading your Windows nodes.
-->
* 熟悉[更新 kubeadm 集群中的其余组件](/zh/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade)。
  在升级你的 Windows 节点之前你会想要升级控制面节点。

<!-- steps -->
<!--
## Upgrading worker nodes

### Upgrade kubeadm
-->
## 升级工作节点   {#upgrading-worker-nodes}

### 升级 kubeadm    {#upgrade-kubeadm}

<!--
1.  From the Windows node, upgrade kubeadm:

    ```powershell
    # replace {{< param "fullversion" >}} with your desired version
    curl.exe -Lo C:\k\kubeadm.exe https://dl.k8s.io/{{< param "fullversion" >}}/bin/windows/amd64/kubeadm.exe
    ```
-->
1. 在 Windows 节点上升级 kubeadm：

   ```powershell
   # 将 {{< param "fullversion" >}} 替换为你希望的版本
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
### 腾空节点   {#drain-the-node}

1. 在一个能访问到 Kubernetes API 的机器上，将 Windows 节点标记为不可调度并
   驱逐其上的所有负载，以便准备节点维护操作：

   ```shell
   # 将 <要腾空的节点> 替换为你要腾空的节点的名称
   kubectl drain <要腾空的节点> -ignore-daemonsets
   ```

   你应该会看到类似下面的输出：

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
### 升级 kubelet 配置   {#upgrade-the-kubelet-configuration}

1. 在 Windows 节点上，执行下面的命令来同步新的 kubelet 配置：

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
### 升级 kubelet   {#upgrade-kubelet}

1. 在 Windows 节点上升级并重启 kubelet：

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
### 对节点执行 uncordon 操作   {#uncordon-the-node}

1. 从一台能够访问到 Kubernetes API 的机器上，通过将节点标记为可调度，使之
   重新上线：

   ```shell
   # 将 <要腾空的节点> 替换为你的节点名称
   kubectl uncordon <要腾空的节点>
   ```

<!--
### Upgrade kube-proxy

1. From a machine with access to the Kubernetes API, run the following,
again replacing {{< param "fullversion" >}} with your desired version:

    ```shell
    curl -L https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/kube-proxy.yml | sed 's/VERSION/{{< param "fullversion" >}}/g' | kubectl apply -f -
    ```
-->
### 升级 kube-proxy   {#upgrade-kube-proxy}

1. 在一台可访问 Kubernetes API 的机器上和，将 {{< param "fullversion" >}} 替换成你
   期望的版本后再次执行下面的命令：

   ```shell
   curl -L https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/kube-proxy.yml | sed 's/VERSION/{{< param "fullversion" >}}/g' | kubectl apply -f -
    ```

