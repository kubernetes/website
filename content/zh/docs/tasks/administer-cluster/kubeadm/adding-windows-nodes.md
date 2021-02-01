---
title: 添加 Windows 节点
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
你可以使用 Kubernetes 来混合运行 Linux 和 Windows 节点，这样你就可以
混合使用运行于 Linux 上的 Pod 和运行于 Windows 上的 Pod。
本页面展示如何将 Windows 节点注册到你的集群。

## {{% heading "prerequisites" %}}

{{< version-check >}}

<!--
* Obtain a [Windows Server 2019 license](https://www.microsoft.com/en-us/cloud-platform/windows-server-pricing)
(or higher) in order to configure the Windows node that hosts Windows containers.
If you are using VXLAN/Overlay networking you must have also have [KB4489899](https://support.microsoft.com/help/4489899) installed.

* A Linux-based Kubernetes kubeadm cluster in which you have access to the control plane (see [Creating a single control-plane cluster with kubeadm](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/)).
-->
* 获取 [Windows Server 2019 或更高版本的授权](https://www.microsoft.com/en-us/cloud-platform/windows-server-pricing)
  以便配置托管 Windows 容器的 Windows 节点。
  如果你在使用 VXLAN/覆盖（Overlay）联网设施，则你还必须安装 [KB4489899](https://support.microsoft.com/help/4489899)。

* 一个利用 kubeadm 创建的基于 Linux 的 Kubernetes 集群；你能访问该集群的控制面
  （参见[使用 kubeadm 创建一个单控制面的集群](/zh/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/))。

## {{% heading "objectives" %}}

<!--
* Register a Windows node to the cluster
* Configure networking so Pods and Services on Linux and Windows can communicate with each other
-->
* 将一个 Windows 节点注册到集群上
* 配置网络，以便 Linux 和 Windows 上的 Pod 和 Service 之间能够相互通信。

<!-- lessoncontent -->

<!--
## Getting Started: Adding a Windows Node to Your Cluster

### Networking Configuration

Once you have a Linux-based Kubernetes control-plane node you are ready to choose a networking solution. This guide illustrates using Flannel in VXLAN mode for simplicity.
-->
## 开始行动：向你的集群添加一个 Windows 节点

### 联网配置   {#networking-configuration}

一旦你有了一个基于 Linux 的 Kubernetes 控制面节点，你就可以为其选择联网方案。
出于简单考虑，本指南展示如何使用 VXLAN 模式的 Flannel。

<!--
#### Configuring Flannel

1. Prepare Kubernetes control plane for Flannel

    Some minor preparation is recommended on the Kubernetes control plane in our cluster. It is recommended to enable bridged IPv4 traffic to iptables chains when using Flannel. The following command must be run on all Linux nodes:

    ```bash
    sudo sysctl net.bridge.bridge-nf-call-iptables=1
    ```
-->
#### 配置 Flannel  {#configuring-flannel}

1. 为 Flannel 准备 Kubernetes 的控制面

   在我们的集群中，建议对 Kubernetes 的控制面进行少许准备处理。
   建议在使用 Flannel 时为 iptables 链启用桥接方式的 IPv4 流处理，
   必须在所有 Linux 节点上执行如下命令：

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
2. 下载并配置 Linux 版本的 Flannel

   下载最新的 Flannel 清单文件：

   ```bash
   wget https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml
   ```

   修改 Flannel 清单中的 `net-conf.json` 部分，将 VNI 设置为 4096，并将 Port 设置为 4789。
   结果看起来像下面这样：

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
   在 Linux 节点上 VNI 必须设置为 4096，端口必须设置为 4789，这样才能令其与 Windows 上的
   Flannel 互操作。关于这些字段的详细说明，请参见
   [VXLAN 文档](https://github.com/coreos/flannel/blob/master/Documentation/backends.md#vxlan)。
   {{< /note >}}

   {{< note >}}
   如要使用 L2Bridge/Host-gateway 模式，则可将 `Type` 值设置为
   `"host-gw"`，并忽略 `VNI` 和 `Port` 的设置。
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
3. 应用 Flannel 清单并验证

   首先应用 Flannel 配置：

   ```bash
   kubectl apply -f kube-flannel.yml
   ```

   几分钟之后，如果 Flannel Pod 网络被正确部署，你应该会看到所有 Pods 都处于运行中状态。

   ```bash
   kubectl get pods -n kube-system
   ```

   输出中应该包含处于运行中状态的 Linux Flannel DaemonSet：

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
4. 添加 Windows Flannel 和 kube-proxy DaemonSet

   现在你可以添加 Windows 兼容版本的 Flannel 和 kube-proxy。为了确保你能获得兼容
   版本的 kube-proxy，你需要替换镜像中的标签。
   下面的例子中展示的是针对 Kubernetes {{< param "fullversion" >}} 版本的用法，
   不过你应该根据你自己的集群部署调整其中的版本号。

   ```bash
   curl -L https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/kube-proxy.yml | sed 's/VERSION/{{< param "fullversion" >}}/g' | kubectl apply -f -
   kubectl apply -f https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/flannel-overlay.yml
   ```

   {{< note >}}
   如果你在使用 host-gateway 模式，则应该使用
   https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/flannel-host-gw.yml
   这一清单。
   {{< /note >}}

   {{< note >}}
   如果你在 Windows 节点上使用的不是以太网（即，"Ethernet0 2"）接口，你需要
   修改 `flannel-host-gw.yml` 或 `flannel-overlay.yml` 文件中的下面这行：

   ```powershell
   wins cli process run --path /k/flannel/setup.exe --args "--mode=overlay --interface=Ethernet"
   ```

   在其中根据情况设置要使用的网络接口。

   ```bash
   # Example
   curl -L https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/flannel-overlay.yml | sed 's/Ethernet/Ethernet0 2/g' | kubectl apply -f -
   ```
   {{< /note >}}

<!--
### Joining a Windows worker node

You must install the `Containers` feature and install Docker. Instructions
to do so are available at [Install Docker Engine - Enterprise on Windows Servers](https://docs.mirantis.com/docker-enterprise/v3.1/dockeree-products/docker-engine-enterprise/dee-windows.html).

All code snippets in Windows sections are to be run in a PowerShell environment
with elevated permissions (Administrator) on the Windows worker node.
-->
### 加入 Windows 工作节点   {joining-a-windows-worker-node}

你必须安装 `Containers` 功能特性并安装 Docker 工具。相关的指令可以在
[Install Docker Engine - Enterprise on Windows Servers](https://hub.docker.com/editions/enterprise/docker-ee-server-windows)
处找到。

Windows 节的所有代码片段都需要在 PowerShell 环境中执行，并且要求在
Windows 工作节点上具有提升的权限（Administrator）。

<!--
1. Install wins, kubelet, and kubeadm.
-->
1. 安装 wins、kubelet 和 kubeadm

   ```PowerShell
   curl.exe -LO https://github.com/kubernetes-sigs/sig-windows-tools/releases/latest/download/PrepareNode.ps1
   .\PrepareNode.ps1 -KubernetesVersion {{< param "fullversion" >}}
   ```

<!--
1. Run `kubeadm` to join the node

    Use the command that was given to you when you ran `kubeadm init` on a control plane host.
    If you no longer have this command, or the token has expired, you can run `kubeadm token create -print-join-command`
    (on a control plane host) to generate a new token and join command.
-->
2. 运行 `kubeadm` 添加节点

   当你在控制面主机上运行 `kubeadm init` 时，输出了一个命令。现在运行这个命令。
   如果你找不到这个命令，或者命令中对应的令牌已经过期，你可以（在一个控制面主机上）运行
   `kubeadm token create --print-join-command` 来生成新的令牌和 join 命令。

<!--
#### Verifying your installation

You should now be able to view the Windows node in your cluster by running:
-->
#### 检查你的安装   {#verifying-your-installation}

你现在应该能够通过运行下面的命令来查看集群中的 Windows 节点了：

```bash
kubectl get nodes -o wide
```

<!--
If your new node is in the `NotReady` state it is likely because the flannel image is still downloading.
You can check the progress as before by checking on the flannel pods in the `kube-system` namespace:
-->
如果你的新节点处于 `NotReady` 状态，很可能的原因是系统仍在下载 Flannel 镜像。
你可以像之前一样，通过检查 `kube-system` 名字空间中的 Flannel Pods 来了解
安装进度。

```shell
kubectl -n kube-system get pods -l app=flannel
```

<!--
Once the flannel Pod is running, your node should enter the `Ready` state and then be available to handle workloads.
-->
一旦 Flannel Pod 运行起来，你的节点就应该能进入 `Ready` 状态并可
用来处理负载。

## {{% heading "whatsnext" %}}

<!--
- [Upgrading Windows kubeadm nodes](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes)
-->
- [升级 kubeadm 安装的 Windows 节点](/zh/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes)

