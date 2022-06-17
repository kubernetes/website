---
title: 新增 Windows 節點
min-kubernetes-server-version: 1.17
content_type: tutorial
weight: 30
---
<!--
reviewers:
- michmike
- patricklang
title: Adding Windows nodes
min-kubernetes-server-version: 1.17
content_type: tutorial
weight: 30
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

<!--
You can use Kubernetes to run a mixture of Linux and Windows nodes, so you can mix Pods that run on Linux on with Pods that run on Windows. This page shows how to register Windows nodes to your cluster.
-->
你可以使用 Kubernetes 來混合執行 Linux 和 Windows 節點，這樣你就可以
混合使用運行於 Linux 上的 Pod 和運行於 Windows 上的 Pod。
本頁面展示如何將 Windows 節點註冊到你的叢集。

## {{% heading "prerequisites" %}}
 {{< version-check >}}

<!--
* Obtain a [Windows Server 2019 license](https://www.microsoft.com/en-us/cloud-platform/windows-server-pricing)
(or higher) in order to configure the Windows node that hosts Windows containers.
If you are using VXLAN/Overlay networking you must have also have [KB4489899](https://support.microsoft.com/help/4489899) installed.

* A Linux-based Kubernetes kubeadm cluster in which you have access to the control plane (see [Creating a single control-plane cluster with kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)).
-->

* 獲取 [Windows Server 2019 或更高版本的授權](https://www.microsoft.com/en-us/cloud-platform/windows-server-pricing)
  以便配置託管 Windows 容器的 Windows 節點。
  如果你在使用 VXLAN/覆蓋（Overlay）聯網設施，則你還必須安裝 [KB4489899](https://support.microsoft.com/help/4489899)。

* 一個利用 kubeadm 建立的基於 Linux 的 Kubernetes 叢集；你能訪問該叢集的控制面
  （參見[使用 kubeadm 建立一個單控制面的叢集](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/))。

## {{% heading "objectives" %}}

<!--
* Register a Windows node to the cluster
* Configure networking so Pods and Services on Linux and Windows can communicate with each other
-->
* 將一個 Windows 節點註冊到叢集上
* 配置網路，以便 Linux 和 Windows 上的 Pod 和 Service 之間能夠相互通訊。

<!-- lessoncontent -->

<!--
## Getting Started: Adding a Windows Node to Your Cluster

### Networking Configuration

Once you have a Linux-based Kubernetes control-plane node you are ready to choose a networking solution. This guide illustrates using Flannel in VXLAN mode for simplicity.
-->
## 開始行動：向你的叢集新增一個 Windows 節點

### 聯網配置   {#networking-configuration}

一旦你有了一個基於 Linux 的 Kubernetes 控制面節點，你就可以為其選擇聯網方案。
出於簡單考慮，本指南展示如何使用 VXLAN 模式的 Flannel。

<!--
#### Configuring Flannel

1. Prepare Kubernetes control plane for Flannel

    Some minor preparation is recommended on the Kubernetes control plane in our cluster. It is recommended to enable bridged IPv4 traffic to iptables chains when using Flannel. The following command must be run on all Linux nodes:

    ```bash
    sudo sysctl net.bridge.bridge-nf-call-iptables=1
    ```
-->
#### 配置 Flannel  {#configuring-flannel}

1. 為 Flannel 準備 Kubernetes 的控制面

   在我們的叢集中，建議對 Kubernetes 的控制面進行少許準備處理。
   建議在使用 Flannel 時為 iptables 鏈啟用橋接方式的 IPv4 流處理，
   必須在所有 Linux 節點上執行如下命令：

   ```bash
   sudo sysctl net.bridge.bridge-nf-call-iptables=1
   ```

<!--
1. Download & configure Flannel for Linux

    Download the most recent Flannel manifest:

    ```bash
    wget https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
    ```

    Modify the `net-conf.json` section of the flannel manifest in order to set the VNI to 4096 and the Port to 4789. It should look as follows:

    ```json
    net-conf.json: |
        {
          "Network": "10.244.0.0/16",
          "Backend": {
            "Type": "vxlan",
            "VNI": 4096,
            "Port": 4789
          }
        }
    ```

    The VNI must be set to 4096 and port 4789 for Flannel on Linux to interoperate with Flannel on Windows. See the [VXLAN documentation](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan).
    for an explanation of these fields.

    To use L2Bridge/Host-gateway mode instead change the value of `Type` to `"host-gw"` and omit `VNI` and `Port`.
-->
2. 下載並配置 Linux 版本的 Flannel

   下載最新的 Flannel 清單檔案：

   ```bash
   wget https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
   ```

   修改 Flannel 清單中的 `net-conf.json` 部分，將 VNI 設定為 4096，並將 Port 設定為 4789。
   結果看起來像下面這樣：

   ```json
   net-conf.json: |
       {
         "Network": "10.244.0.0/16",
         "Backend": {
            "Type": "vxlan",
            "VNI": 4096,
            "Port": 4789
       }
   }
   ```

   {{< note >}}
   在 Linux 節點上 VNI 必須設定為 4096，埠必須設定為 4789，這樣才能令其與 Windows 上的
   Flannel 互操作。關於這些欄位的詳細說明，請參見
   [VXLAN 文件](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan)。
   {{< /note >}}

   {{< note >}}
   如要使用 L2Bridge/Host-gateway 模式，則可將 `Type` 值設定為
   `"host-gw"`，並忽略 `VNI` 和 `Port` 的設定。
   {{< /note >}}

<!--
1. Apply the Flannel manifest and validate

    Let's apply the Flannel configuration:

    ```bash
    kubectl apply -f kube-flannel.yml
    ```

    After a few minutes, you should see all the pods as running if the Flannel pod network was deployed.

    ```bash
    kubectl get pods -n kube-system
    ```

    The output should include the Linux flannel DaemonSet as running:

    ```
    NAMESPACE     NAME                                      READY        STATUS    RESTARTS   AGE
    ...
    kube-system   kube-flannel-ds-54954                     1/1          Running   0          1m
    ```
-->
3. 應用 Flannel 清單並驗證

   首先應用 Flannel 配置：

   ```bash
   kubectl apply -f kube-flannel.yml
   ```

   幾分鐘之後，如果 Flannel Pod 網路被正確部署，你應該會看到所有 Pods 都處於執行中狀態。

   ```bash
   kubectl get pods -n kube-system
   ```

   輸出中應該包含處於執行中狀態的 Linux Flannel DaemonSet：

   ```
   NAMESPACE     NAME                                      READY        STATUS    RESTARTS   AGE
   ...
   kube-system   kube-flannel-ds-54954                     1/1          Running   0          1m
   ```

<!--
1. Add Windows Flannel and kube-proxy DaemonSets

    Now you can add Windows-compatible versions of Flannel and kube-proxy. In order
    to ensure that you get a compatible version of kube-proxy, you'll need to substitute
    the tag of the image. The following example shows usage for Kubernetes {{< param "fullversion" >}},
    but you should adjust the version for your own deployment.

    ```bash
    curl -L https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/kube-proxy.yml | sed 's/VERSION/{{< param "fullversion" >}}/g' | kubectl apply -f -
    kubectl apply -f https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/flannel-overlay.yml
    ```

    If you're using host-gateway use https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/flannel-host-gw.yml instead

If you're using a different interface rather than Ethernet (i.e. "Ethernet0 2") on the Windows nodes, you have to modify the line:

```powershell
wins cli process run --path /k/flannel/setup.exe --args "--mode=overlay --interface=Ethernet"
```

in the `flannel-host-gw.yml` or `flannel-overlay.yml` file and specify your interface accordingly.

```bash
# Example
curl -L https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/flannel-overlay.yml | sed 's/Ethernet/Ethernet0 2/g' | kubectl apply -f -
```
-->    
4. 新增 Windows Flannel 和 kube-proxy DaemonSet

   現在你可以新增 Windows 相容版本的 Flannel 和 kube-proxy。為了確保你能獲得相容
   版本的 kube-proxy，你需要替換映象中的標籤。
   下面的例子中展示的是針對 Kubernetes {{< param "fullversion" >}} 版本的用法，
   不過你應該根據你自己的叢集部署調整其中的版本號。

   ```bash
   curl -L https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/kube-proxy.yml | sed 's/VERSION/{{< param "fullversion" >}}/g' | kubectl apply -f -
   kubectl apply -f https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/flannel-overlay.yml
   ```

   {{< note >}}
   如果你在使用 host-gateway 模式，則應該使用
   https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/flannel-host-gw.yml
   這一清單。
   {{< /note >}}

   {{< note >}}
   如果你在 Windows 節點上使用的不是乙太網（即，"Ethernet0 2"）介面，你需要
   修改 `flannel-host-gw.yml` 或 `flannel-overlay.yml` 檔案中的下面這行：

   ```powershell
   wins cli process run --path /k/flannel/setup.exe --args "--mode=overlay --interface=Ethernet"
   ```

   在其中根據情況設定要使用的網路介面。

   ```bash
   # Example
   curl -L https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/flannel-overlay.yml | sed 's/Ethernet/Ethernet0 2/g' | kubectl apply -f -
   ```
   {{< /note >}}

<!--
### Joining a Windows worker node
-->
### 加入 Windows 工作節點   {#joining-a-windows-worker-node}

{{< note >}}
<!--
All code snippets in Windows sections are to be run in a PowerShell environment
with elevated permissions (Administrator) on the Windows worker node.
-->
Windows 節的所有程式碼片段都需要在 PowerShell 環境中執行，並且要求在
Windows 工作節點上具有提升的許可權（Administrator）。
{{< /note >}}

{{< tabs name="tab-windows-kubeadm-runtime-installation" >}}

{{% tab name="CRI-containerD" %}}

<!--
#### Install containerD
-->
#### 安裝 containerD

```powershell
curl.exe -LO https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/Install-Containerd.ps1
.\Install-Containerd.ps1
```

{{< note >}}
<!--
To install a specific version of containerD specify the version with -ContainerDVersion.
-->
要安裝特定版本的 containerD，使用引數 -ContainerDVersion 指定版本。

```powershell
# Example
.\Install-Containerd.ps1 -ContainerDVersion 1.4.1
```
<!--
If you're using a different interface rather than Ethernet (i.e. "Ethernet0 2") on the Windows nodes, specify the name with `-netAdapterName`.
-->
如果你在 Windows 節點上使用了與 Ethernet 不同的介面（例如 "Ethernet0 2"），使用引數 `-netAdapterName` 指定名稱。

```powershell
# Example
.\Install-Containerd.ps1 -netAdapterName "Ethernet0 2"
```

{{< /note >}}

<!--
#### Install wins, kubelet, and kubeadm
-->
#### 安裝 wins、kubelet 和 kubeadm

```PowerShell
curl.exe -LO https://raw.githubusercontent.com/kubernetes-sigs/sig-windows-tools/master/kubeadm/scripts/PrepareNode.ps1
.\PrepareNode.ps1 -KubernetesVersion {{< param "fullversion" >}} -ContainerRuntime containerD
```
<!--
Install `crictl` from the [cri-tools project](https://github.com/kubernetes-sigs/cri-tools)
which is required so that kubeadm can talk to the CRI endpoint.
-->
從 [cri-tools](https://github.com/kubernetes-sigs/cri-tools) 專案安裝 `crtctl`。
`crictl` 是必需的，kubeadm 使用它與 CRI 端點通訊。

<!--
#### Run `kubeadm` to join the node

Use the command that was given to you when you ran `kubeadm init` on a control plane host.
If you no longer have this command, or the token has expired, you can run `kubeadm token create --print-join-command`
(on a control plane host) to generate a new token and join command.
-->
#### 執行 `kubeadm` 新增節點

 使用當你在控制面主機上執行 `kubeadm init` 時得到的命令。
 如果你找不到這個命令，或者命令中對應的令牌已經過期，你可以（在一個控制面主機上）執行
 `kubeadm token create --print-join-command` 來生成新的令牌和 join 命令。


{{% /tab %}}


{{% tab name="Docker Engine" %}}

<!--
#### Install Docker Engine

Install the `Containers` feature
-->

#### 安裝 Docker Engine

安裝 `Containers` 功能特性

```powershell
Install-WindowsFeature -Name containers
```

<!--
Install Docker
Instructions to do so are available at [Install Docker Engine - Enterprise on Windows Servers](https://docs.microsoft.com/en-us/virtualization/windowscontainers/quick-start/set-up-environment?tabs=Windows-Server#install-docker).
-->

安裝 Docker

操作指南在
[Install Docker Engine - Enterprise on Windows Servers](https://docs.microsoft.com/en-us/virtualization/windowscontainers/quick-start/set-up-environment?tabs=Windows-Server#install-docker)。

<!--
[Install cri-dockerd](https://github.com/Mirantis/cri-dockerd) which is required so that the kubelet
can communicate with Docker on a CRI compatible endpoint.
-->

[安裝 cri-dockerd](https://github.com/Mirantis/cri-dockerd)。kubelet 可以透過 cri-dockerd
在 CRI 相容的節點上與 Docker 通訊。
 
{{< note >}}
<!--
Docker Engine does not implement the [CRI](/docs/concepts/architecture/cri/)
which is a requirement for a container runtime to work with Kubernetes.
For that reason, an additional service [cri-dockerd](https://github.com/Mirantis/cri-dockerd)
has to be installed. cri-dockerd is a project based on the legacy built-in
Docker Engine support that was [removed](/dockershim) from the kubelet in version 1.24.
-->
Docker Engine 沒有實現 [CRI](/zh-cn/docs/concepts/architecture/cri/)，
而 CRI 是容器執行時能夠與 Kubernetes 一起工作的要求。
出於這個原因，必須安裝一個額外的服務 [cri-dockerd](https://github.com/Mirantis/cri-dockerd)。
cri-dockerd 是一個基於原來的內建 Docker Engine 支援的專案，
而這一支援在 1.24 版本的 kubelet 中[已被移除](/zh-cn/dockershim)。
{{< /note >}}

<!--
Install `crictl` from the [cri-tools project](https://github.com/kubernetes-sigs/cri-tools)
which is required so that kubeadm can talk to the CRI endpoint.
-->
從 [cri-tools](https://github.com/kubernetes-sigs/cri-tools) 專案安裝 `crictl`。
kubeadm 需要 `crictl` 才能與 CRI 端點通訊。

<!--
#### Install wins, kubelet, and kubeadm.
-->
#### 安裝 wins、kubelet 和 kubeadm

```PowerShell
curl.exe -LO https://raw.githubusercontent.com/kubernetes-sigs/sig-windows-tools/master/kubeadm/scripts/PrepareNode.ps1
.\PrepareNode.ps1 -KubernetesVersion {{< param "fullversion" >}}
```
<!--
# ### Run `kubeadm` to join the node

Use the command that was given to you when you ran `kubeadm init` on a control plane host.
If you no longer have this command, or the token has expired, you can run `kubeadm token create -print-join-command`
(on a control plane host) to generate a new token and join command.
-->
#### 執行 `kubeadm` 新增節點

當你在控制面主機上執行 `kubeadm init` 時，輸出了一個命令。現在執行這個命令。
如果你找不到這個命令，或者命令中對應的令牌已經過期，你可以（在一個控制面主機上）執行
`kubeadm token create --print-join-command` 來生成新的令牌和 join 命令。

{{% /tab %}}
{{< /tabs >}}

<!--
#### Verifying your installation

You should now be able to view the Windows node in your cluster by running:
-->
#### 檢查你的安裝   {#verifying-your-installation}

你現在應該能夠透過執行下面的命令來檢視叢集中的 Windows 節點了：

```bash
kubectl get nodes -o wide
```

<!--
If your new node is in the `NotReady` state it is likely because the flannel image is still downloading.
You can check the progress as before by checking on the flannel pods in the `kube-system` namespace:
-->
如果你的新節點處於 `NotReady` 狀態，很可能的原因是系統仍在下載 Flannel 映象。
你可以像之前一樣，透過檢查 `kube-system` 名字空間中的 Flannel Pods 來了解
安裝進度。

```shell
kubectl -n kube-system get pods -l app=flannel
```

<!--
Once the flannel Pod is running, your node should enter the `Ready` state and then be available to handle workloads.
-->
一旦 Flannel Pod 執行起來，你的節點就應該能進入 `Ready` 狀態並可
用來處理負載。

## {{% heading "whatsnext" %}}

<!--
- [Upgrading Windows kubeadm nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes)
-->
- [升級 kubeadm 安裝的 Windows 節點](/zh-cn/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes)

