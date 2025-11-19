---
title: 添加 Windows 工作節點
content_type: task
weight: 11
---
<!--
title: Adding Windows worker nodes
content_type: task
weight: 11
-->

<!-- overview -->

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

<!--
This page explains how to add Windows worker nodes to a kubeadm cluster.
-->
本頁介紹如何將 Linux 工作節點添加到 kubeadm 集羣。

## {{% heading "prerequisites" %}}

<!--
* A running [Windows Server 2022](https://www.microsoft.com/cloud-platform/windows-server-pricing)
(or higher) instance with administrative access.
* A running kubeadm cluster created by `kubeadm init` and following the steps
in the document [Creating a cluster with kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).
-->
* 一個正在運行的 [Windows Server 2022](https://www.microsoft.com/cloud-platform/windows-server-pricing)
  （或更高版本）實例，且具備管理權限。
* 一個正在運行的、由 `kubeadm init` 命令創建的集羣，且集羣的創建遵循
  [使用 kubeadm 創建集羣](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
  文檔中所給的步驟。

<!-- steps -->

<!--
## Adding Windows worker nodes
-->
## 添加 Windows 工作節點   {#adding-windows-worker-nodes}

{{< note >}}
<!--
To facilitate the addition of Windows worker nodes to a cluster, PowerShell scripts from the repository
https://sigs.k8s.io/sig-windows-tools are used.
-->
爲了方便將 Windows 工作節點添加到集羣，下面會用到代碼倉庫
https://sigs.k8s.io/sig-windows-tools 裏的 PowerShell 腳本。
{{< /note >}}

<!--
Do the following for each machine:

1. Open a PowerShell session on the machine.
1. Make sure you are Administrator or a privileged user.

Then proceed with the steps outlined below.

### Install containerd
-->
對每臺機器執行以下操作：

1. 在機器上打開一個 PowerShell 會話。
1. 確保你是管理員或具有特權的用戶。

然後繼續執行下面的步驟。

### 安裝 Containerd   {#install-containerd}

{{% thirdparty-content %}}

<!--
To install containerd, first run the following command:
-->
要安裝 Containerd，首先運行以下命令：

  ```PowerShell
  curl.exe -LO https://raw.githubusercontent.com/kubernetes-sigs/sig-windows-tools/master/hostprocess/Install-Containerd.ps1
  ``````

<!--
Then run the following command, but first replace `CONTAINERD_VERSION` with a recent release
from the [containerd repository](https://github.com/containerd/containerd/releases).
The version must not have a `v` prefix. For example, use `1.7.22` instead of `v1.7.22`:
-->
然後運行以下命令，但要首先將 `CONTAINERD_VERSION` 替換爲
[Containerd 倉庫](https://github.com/containerd/containerd/releases) 中的最新發布版本。
版本號不能帶有前綴 `v` 。例如，使用 `1.7.22` 而不是 `v1.7.22`：

  ```PowerShell
  .\Install-Containerd.ps1 -ContainerDVersion CONTAINERD_VERSION
  ```

<!--
* Adjust any other parameters for `Install-Containerd.ps1` such as `netAdapterName` as you need them.
* Set `skipHypervisorSupportCheck` if your machine does not support Hyper-V and cannot host Hyper-V isolated
containers.
* If you change the `Install-Containerd.ps1` optional parameters `CNIBinPath` and/or `CNIConfigPath` you will
need to configure the installed Windows CNI plugin with matching values.
-->
* 根據需要調整 `Install-Containerd.ps1` 的所有其他參數，例如 `netAdapterName`。
* 如果你的機器不支持 Hyper-V，且無法託管 Hyper-V 的隔離容器，
  請設置 `skipHypervisorSupportCheck`。
* 如果你要更改 `Install-Containerd.ps1` 中的可選參數 `CNIBinPath` 和/或
  `CNIConfigPath`，則需要配置已安裝的 Windows CNI 插件，使之與這裏的值匹配。

<!--
### Install kubeadm and kubelet

Run the following commands to install kubeadm and the kubelet:
-->
### 安裝 kubeadm 和 kubelet   {#install-kubeadm-and-kubelet}

運行以下命令安裝 kubeadm 和 kubelet：

  ```PowerShell
  curl.exe -LO https://raw.githubusercontent.com/kubernetes-sigs/sig-windows-tools/master/hostprocess/PrepareNode.ps1
  .\PrepareNode.ps1 -KubernetesVersion v{{< skew currentVersion >}}
  ```

<!--
* Adjust the parameter `KubernetesVersion` of `PrepareNode.ps1` if needed.

### Run `kubeadm join`

Run the command that was output by `kubeadm init`. For example:
-->
* 根據需要調整 `PrepareNode.ps1` 中的參數 `KubernetesVersion`。

### 運行 `kubeadm join`   {#run-kubeadm-join}

運行 `kubeadm init` 所輸出的命令。例如：

  ```bash
  kubeadm join --token <token> <control-plane-host>:<control-plane-port> --discovery-token-ca-cert-hash sha256:<hash>
  ```

<!--
#### Additional information about kubeadm join
-->
#### kubeadm join 的附加信息   {#additional-information-about-kubeadm-join}

{{< note >}}
<!--
To specify an IPv6 tuple for `<control-plane-host>:<control-plane-port>`, IPv6 address must be enclosed in square brackets, for example: `[2001:db8::101]:2073`.
-->
要爲 `<control-plane-host>:<control-plane-port>` 指定一個 IPv6 元組，
IPv6 地址必須用方括號括起來，例如：`[2001:db8::101]:2073`。
{{< /note >}}

<!--
If you do not have the token, you can get it by running the following command on the control plane node:
-->
如果你沒有令牌，可以在控制平面節點上運行以下命令來獲取：

<!--
# Run this on a control plane node
-->
```bash
# 在控制平面節點上運行此命令
sudo kubeadm token list
```

<!--
The output is similar to this:
-->
命令輸出同以下內容類似：

```console
TOKEN                    TTL  EXPIRES              USAGES           DESCRIPTION            EXTRA GROUPS
8ewj1p.9r9hcjoqgajrj4gi  23h  2018-06-12T02:51:28Z authentication,  The default bootstrap  system:
                                                   signing          token generated by     bootstrappers:
                                                                    'kubeadm init'.        kubeadm:
                                                                                           default-node-token
```

<!--
By default, node join tokens expire after 24 hours. If you are joining a node to the cluster after the
current token has expired, you can create a new token by running the following command on the
control plane node:
-->
默認情況下，節點加入令牌會在 24 小時後過期。當前令牌過期後，如果想把節點加入集羣，
可以在控制平面節點上運行以下命令來創建新令牌：

<!--
# Run this on a control plane node
-->
```bash
# 在控制平面節點上運行此命令
sudo kubeadm token create
```

<!--
The output is similar to this:
-->
命令輸出同以下內容類似：

```console
5didvk.d09sbcov8ph2amjw
```

<!--
If you don't have the value of `--discovery-token-ca-cert-hash`, you can get it by running the
following commands on the control plane node:
-->
如果你沒有 `--discovery-token-ca-cert-hash` 的具體值，可以在控制平面節點上運行以下命令來獲取：

```bash
sudo cat /etc/kubernetes/pki/ca.crt | openssl x509 -pubkey  | openssl rsa -pubin -outform der 2>/dev/null | \
   openssl dgst -sha256 -hex | sed 's/^.* //'
```

<!--
The output is similar to:
-->
命令輸出同以下內容類似：

```console
8cb2de97839780a412b93877f8507ad6c94f73add17d5d7058e91741c9d5ec78
```

<!--
The output of the `kubeadm join` command should look something like:
-->
`kubeadm join` 命令的輸出應該同以下內容類似：

```
[preflight] Running pre-flight checks

... (log output of join workflow) ...

Node join complete:
* Certificate signing request sent to control-plane and response
  received.
* Kubelet informed of new secure connection details.

Run 'kubectl get nodes' on control-plane to see this machine join.
```

<!--
A few seconds later, you should notice this node in the output from `kubectl get nodes`.
(for example, run `kubectl` on a  control plane node).

### Network configuration

CNI setup on clusters mixed with Linux and Windows nodes requires more steps than just
running `kubectl apply` on a manifest file. Additionally, the CNI plugin running on control
plane nodes must be prepared to support the CNI plugin running on Windows worker nodes.
-->
幾秒鐘後，你應該在 `kubectl get nodes` 的輸出中看到該節點。
（例如，可以在控制平面節點上運行 `kubectl`）。

### 網絡配置   {#network-configuration}

在混合了 Linux 和 Windows 節點的集羣中，CNI 設置所需的步驟不僅僅是對清單文件運行
`kubectl apply`。此外，運行在控制平面節點上的 CNI 插件必須能夠支持在 Windows 工作節點上
運行的 CNI 插件。

{{% thirdparty-content %}}

<!--
Only a few CNI plugins currently support Windows. Below you can find individual setup instructions for them:
* [Flannel](https://sigs.k8s.io/sig-windows-tools/guides/flannel.md)
* [Calico](https://docs.tigera.io/calico/latest/getting-started/kubernetes/windows-calico/)

### Install kubectl for Windows (optional) {#install-kubectl}

See [Install and Set Up kubectl on Windows](/docs/tasks/tools/install-kubectl-windows/).
-->
目前只有少數 CNI 插件支持 Windows。以下是它們各自的設置說明：
* [Flannel](https://sigs.k8s.io/sig-windows-tools/guides/flannel.md)
* [Calico](https://docs.tigera.io/calico/latest/getting-started/kubernetes/windows-calico/)

### 在 Windows 上安裝 kubectl （可選）   {#install-kubectl}

參見 [在 Windows 上安裝和設置 kubectl](/zh-cn/docs/tasks/tools/install-kubectl-windows/)。

## {{% heading "whatsnext" %}}

<!--
* See how to [add Linux worker nodes](/docs/tasks/administer-cluster/kubeadm/adding-linux-nodes/).
-->
參見如何 [添加 Linux 工作節點](/zh-cn/docs/tasks/administer-cluster/kubeadm/adding-linux-nodes/)。
