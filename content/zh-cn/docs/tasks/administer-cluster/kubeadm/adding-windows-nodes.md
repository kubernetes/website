---
title: 添加 Windows 工作节点
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
本页介绍如何将 Linux 工作节点添加到 kubeadm 集群。

## {{% heading "prerequisites" %}}

<!--
* A running [Windows Server 2022](https://www.microsoft.com/cloud-platform/windows-server-pricing)
(or higher) instance with administrative access.
* A running kubeadm cluster created by `kubeadm init` and following the steps
in the document [Creating a cluster with kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/).
-->
* 一个正在运行的 [Windows Server 2022](https://www.microsoft.com/cloud-platform/windows-server-pricing)
  （或更高版本）实例，且具备管理权限。
* 一个正在运行的、由 `kubeadm init` 命令创建的集群，且集群的创建遵循
  [使用 kubeadm 创建集群](/zh-cn/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)
  文档中所给的步骤。

<!-- steps -->

<!--
## Adding Windows worker nodes
-->
## 添加 Windows 工作节点   {#adding-windows-worker-nodes}

{{< note >}}
<!--
To facilitate the addition of Windows worker nodes to a cluster, PowerShell scripts from the repository
https://sigs.k8s.io/sig-windows-tools are used.
-->
为了方便将 Windows 工作节点添加到集群，下面会用到代码仓库
https://sigs.k8s.io/sig-windows-tools 里的 PowerShell 脚本。
{{< /note >}}

<!--
Do the following for each machine:

1. Open a PowerShell session on the machine.
1. Make sure you are Administrator or a privileged user.

Then proceed with the steps outlined below.

### Install containerd
-->
对每台机器执行以下操作：

1. 在机器上打开一个 PowerShell 会话。
1. 确保你是管理员或具有特权的用户。

然后继续执行下面的步骤。

### 安装 Containerd   {#install-containerd}

{{% thirdparty-content %}}

<!--
To install containerd, first run the following command:
-->
要安装 Containerd，首先运行以下命令：

  ```PowerShell
  curl.exe -LO https://raw.githubusercontent.com/kubernetes-sigs/sig-windows-tools/master/hostprocess/Install-Containerd.ps1
  ``````

<!--
Then run the following command, but first replace `CONTAINERD_VERSION` with a recent release
from the [containerd repository](https://github.com/containerd/containerd/releases).
The version must not have a `v` prefix. For example, use `1.7.22` instead of `v1.7.22`:
-->
然后运行以下命令，但要首先将 `CONTAINERD_VERSION` 替换为
[Containerd 仓库](https://github.com/containerd/containerd/releases) 中的最新发布版本。
版本号不能带有前缀 `v` 。例如，使用 `1.7.22` 而不是 `v1.7.22`：

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
* 根据需要调整 `Install-Containerd.ps1` 的所有其他参数，例如 `netAdapterName`。
* 如果你的机器不支持 Hyper-V，且无法托管 Hyper-V 的隔离容器，
  请设置 `skipHypervisorSupportCheck`。
* 如果你要更改 `Install-Containerd.ps1` 中的可选参数 `CNIBinPath` 和/或
  `CNIConfigPath`，则需要配置已安装的 Windows CNI 插件，使之与这里的值匹配。

<!--
### Install kubeadm and kubelet

Run the following commands to install kubeadm and the kubelet:
-->
### 安装 kubeadm 和 kubelet   {#install-kubeadm-and-kubelet}

运行以下命令安装 kubeadm 和 kubelet：

  ```PowerShell
  curl.exe -LO https://raw.githubusercontent.com/kubernetes-sigs/sig-windows-tools/master/hostprocess/PrepareNode.ps1
  .\PrepareNode.ps1 -KubernetesVersion v{{< skew currentVersion >}}
  ```

<!--
* Adjust the parameter `KubernetesVersion` of `PrepareNode.ps1` if needed.

### Run `kubeadm join`

Run the command that was output by `kubeadm init`. For example:
-->
* 根据需要调整 `PrepareNode.ps1` 中的参数 `KubernetesVersion`。

### 运行 `kubeadm join`   {#run-kubeadm-join}

运行 `kubeadm init` 所输出的命令。例如：

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
要为 `<control-plane-host>:<control-plane-port>` 指定一个 IPv6 元组，
IPv6 地址必须用方括号括起来，例如：`[2001:db8::101]:2073`。
{{< /note >}}

<!--
If you do not have the token, you can get it by running the following command on the control plane node:
-->
如果你没有令牌，可以在控制平面节点上运行以下命令来获取：

<!--
# Run this on a control plane node
-->
```bash
# 在控制平面节点上运行此命令
sudo kubeadm token list
```

<!--
The output is similar to this:
-->
命令输出同以下内容类似：

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
默认情况下，节点加入令牌会在 24 小时后过期。当前令牌过期后，如果想把节点加入集群，
可以在控制平面节点上运行以下命令来创建新令牌：

<!--
# Run this on a control plane node
-->
```bash
# 在控制平面节点上运行此命令
sudo kubeadm token create
```

<!--
The output is similar to this:
-->
命令输出同以下内容类似：

```console
5didvk.d09sbcov8ph2amjw
```

<!--
If you don't have the value of `--discovery-token-ca-cert-hash`, you can get it by running the
following commands on the control plane node:
-->
如果你没有 `--discovery-token-ca-cert-hash` 的具体值，可以在控制平面节点上运行以下命令来获取：

```bash
sudo cat /etc/kubernetes/pki/ca.crt | openssl x509 -pubkey  | openssl rsa -pubin -outform der 2>/dev/null | \
   openssl dgst -sha256 -hex | sed 's/^.* //'
```

<!--
The output is similar to:
-->
命令输出同以下内容类似：

```console
8cb2de97839780a412b93877f8507ad6c94f73add17d5d7058e91741c9d5ec78
```

<!--
The output of the `kubeadm join` command should look something like:
-->
`kubeadm join` 命令的输出应该同以下内容类似：

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
几秒钟后，你应该在 `kubectl get nodes` 的输出中看到该节点。
（例如，可以在控制平面节点上运行 `kubectl`）。

### 网络配置   {#network-configuration}

在混合了 Linux 和 Windows 节点的集群中，CNI 设置所需的步骤不仅仅是对清单文件运行
`kubectl apply`。此外，运行在控制平面节点上的 CNI 插件必须能够支持在 Windows 工作节点上
运行的 CNI 插件。

{{% thirdparty-content %}}

<!--
Only a few CNI plugins currently support Windows. Below you can find individual setup instructions for them:
* [Flannel](https://sigs.k8s.io/sig-windows-tools/guides/flannel.md)
* [Calico](https://docs.tigera.io/calico/latest/getting-started/kubernetes/windows-calico/)

### Install kubectl for Windows (optional) {#install-kubectl}

See [Install and Set Up kubectl on Windows](/docs/tasks/tools/install-kubectl-windows/).
-->
目前只有少数 CNI 插件支持 Windows。以下是它们各自的设置说明：
* [Flannel](https://sigs.k8s.io/sig-windows-tools/guides/flannel.md)
* [Calico](https://docs.tigera.io/calico/latest/getting-started/kubernetes/windows-calico/)

### 在 Windows 上安装 kubectl （可选）   {#install-kubectl}

参见 [在 Windows 上安装和设置 kubectl](/zh-cn/docs/tasks/tools/install-kubectl-windows/)。

## {{% heading "whatsnext" %}}

<!--
* See how to [add Linux worker nodes](/docs/tasks/administer-cluster/kubeadm/adding-linux-nodes/).
-->
参见如何 [添加 Linux 工作节点](/zh-cn/docs/tasks/administer-cluster/kubeadm/adding-linux-nodes/)。
