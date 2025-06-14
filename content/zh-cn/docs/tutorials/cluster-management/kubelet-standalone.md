---
title: 以独立模式运行 kubelet
content_type: tutorial
weight: 10
---
<!--
title: Running Kubelet in Standalone Mode
content_type: tutorial
weight: 10
-->

<!-- overview -->

<!--
This tutorial shows you how to run a standalone kubelet instance.

You may have different motivations for running a standalone kubelet.
This tutorial is aimed at introducing you to Kubernetes, even if you don't have
much experience with it. You can follow this tutorial and learn about node setup,
basic (static) Pods, and how Kubernetes manages containers.
-->
本教程将向你展示如何运行一个独立的 kubelet 实例。

你可能会有不同的动机来运行一个独立的 kubelet。
本教程旨在向你介绍 Kubernetes，即使你对此并没有太多经验也没有关系。
你可以跟随本教程学习节点设置、基本（静态）Pod 以及 Kubernetes 如何管理容器。

<!--
Once you have followed this tutorial, you could try using a cluster that has a
{{< glossary_tooltip text="control plane" term_id="control-plane" >}} to manage pods
and nodes, and other types of objects. For example,
[Hello, minikube](/docs/tutorials/hello-minikube/).

You can also run the kubelet in standalone mode to suit production use cases, such as
to run the control plane for a highly available, resiliently deployed cluster. This
tutorial does not cover the details you need for running a resilient control plane.
-->
你学习完本教程后，就可以尝试使用带一个{{< glossary_tooltip text="控制平面" term_id="control-plane" >}}的集群来管理
Pod、节点和其他类别的对象。例如，[你好，Minikube](/zh-cn/docs/tutorials/hello-minikube/)。

你还可以以独立模式运行 kubelet 来满足生产场景要求，例如为高可用、弹性部署的集群运行控制平面。
本教程不涵盖运行弹性控制平面所需的细节。

## {{% heading "objectives" %}}

<!--
* Install `cri-o`, and `kubelet` on a Linux system and run them as `systemd` services.
* Launch a Pod running `nginx` that listens to requests on TCP port 80 on the Pod's IP address.
* Learn how the different components of the solution interact among themselves.
-->
* 在 Linux 系统上安装 `cri-o` 和 `kubelet`，并将其作为 `systemd` 服务运行。
* 启动一个运行 `nginx` 的 Pod，监听针对此 Pod 的 IP 地址的 TCP 80 端口的请求。
* 学习此方案中不同组件之间如何交互。

{{< caution >}}
<!--
The kubelet configuration used for this tutorial is insecure by design and should
_not_ be used in a production environment.
-->
本教程中所使用的 kubelet 配置在设计上是不安全的，**不**得用于生产环境中。
{{< /caution >}}

## {{% heading "prerequisites" %}}

<!--
* Admin (`root`) access to a Linux system that uses `systemd` and `iptables`
  (or nftables with `iptables` emulation).
* Access to the Internet to download the components needed for the tutorial, such as:
  * A {{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
    that implements the Kubernetes {{< glossary_tooltip term_id="cri" text="(CRI)">}}.
  * Network plugins (these are often known as
    {{< glossary_tooltip text="Container Networking Interface (CNI)" term_id="cni" >}})
  * Required CLI tools: `curl`, `tar`, `jq`.
-->
* 对使用 `systemd` 和 `iptables`（或使用 `iptables` 仿真的 nftables）的 Linux
  系统具有管理员（`root`）访问权限。
* 有权限访问互联网以下载本教程所需的组件，例如：
  * 实现 Kubernetes {{< glossary_tooltip term_id="cri" text="CRI">}}
    的{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}。
  * 网络插件（通常称为 {{< glossary_tooltip text="容器网络接口（CNI）" term_id="cni" >}}）。
  * 必需的 CLI 工具：`curl`、`tar`、`jq`。

<!-- lessoncontent -->

<!--
## Prepare the system

### Swap configuration

By default, kubelet fails to start if swap memory is detected on a node.
This means that swap should either be disabled or tolerated by kubelet.
-->
## 准备好系统   {#prepare-the-system}

### 配置内存交换   {#swap-configuration}

默认情况下，如果在节点上检测到内存交换，kubelet 将启动失败。
这意味着内存交换应该被禁用或被 kubelet 容忍。

{{< note >}}
<!--
If you configure the kubelet to tolerate swap, the kubelet still configures Pods (and the
containers in those Pods) not to use swap space. To find out how Pods can actually
use the available swap, you can read more about
[swap memory management](/docs/concepts/architecture/nodes/#swap-memory) on Linux nodes.
-->
如果你配置 kubelet 为容忍内存交换，则 kubelet 仍会配置 Pod（以及这些 Pod 中的容器）不使用交换空间。
要了解 Pod 实际上可以如何使用可用的交换，你可以进一步阅读 Linux
节点上[交换内存管理](/zh-cn/docs/concepts/architecture/nodes/#swap-memory)。
{{< /note >}}

<!--
If you have swap memory enabled, either disable it or add `failSwapOn: false` to the
kubelet configuration file.

To check if swap is enabled:
-->
如果你启用了交换内存，则禁用它或在 kubelet 配置文件中添加 `failSwapOn: false`。

要检查交换内存是否被启用：

```shell
sudo swapon --show
```

<!--
If there is no output from the command, then swap memory is already disabled.

To disable swap temporarily:
-->
如果此命令没有输出，则交换内存已被禁用。

临时禁用交换内存：

```shell
sudo swapoff -a
```

<!--
To make this change persistent across reboots:

Make sure swap is disabled in either `/etc/fstab` or `systemd.swap`, depending how it was
configured on your system.

### Enable IPv4 packet forwarding

To check if IPv4 packet forwarding is enabled:
-->
要使此变更持续到重启之后：

确保在 `/etc/fstab` 或 `systemd.swap` 中禁用交换内存，具体取决于它在你的系统上是如何配置的。

### 启用 IPv4 数据包转发   {#enable-ipv4-packet-forwarding}

检查 IPv4 数据包转发是否被启用：

```shell
cat /proc/sys/net/ipv4/ip_forward
```

<!--
If the output is `1`, it is already enabled. If the output is `0`, then follow next steps.

To enable IPv4 packet forwarding, create a configuration file that sets the
`net.ipv4.ip_forward` parameter to `1`:
-->
如果输出为 `1`，则 IPv4 数据包转发已被启用。如果输出为 `0`，按照以下步骤操作。

要启用 IPv4 数据包转发，创建一个配置文件，将 `net.ipv4.ip_forward` 参数设置为 `1`：

```shell
sudo tee /etc/sysctl.d/k8s.conf <<EOF
net.ipv4.ip_forward = 1
EOF
```

<!--
Apply the changes to the system:
-->
将变更应用到系统：

```shell
sudo sysctl --system
```

<!--
The output is similar to:
-->
输出类似于：

```
...
* Applying /etc/sysctl.d/k8s.conf ...
net.ipv4.ip_forward = 1
* Applying /etc/sysctl.conf ...
```

<!--
## Download, install, and configure the components
-->
## 下载、安装和配置组件   {#download-install-and-configure-the-components}

{{% thirdparty-content %}}

<!--
### Install a container runtime {#container-runtime}

Download the latest available versions of the required packages (recommended).

This tutorial suggests installing the [CRI-O container runtime](https://github.com/cri-o/cri-o)
(external link).
-->
### 安装容器运行时   {#container-runtime}

下载所需软件包的最新可用版本（推荐）。

本教程建议安装 [CRI-O 容器运行时](https://github.com/cri-o/cri-o)（外部链接）。

<!--
There are several [ways to install](https://github.com/cri-o/cri-o/blob/main/install.md)
the CRI-O container runtime, depending on your particular Linux distribution. Although
CRI-O recommends using either `deb` or `rpm` packages, this tutorial uses the
_static binary bundle_ script of the
[CRI-O Packaging project](https://github.com/cri-o/packaging/blob/main/README.md),
both to streamline the overall process, and to remain distribution agnostic.
-->
根据你安装的特定 Linux 发行版，有几种[安装容器运行时的方式](https://github.com/cri-o/cri-o/blob/main/install.md)。
尽管 CRI-O 推荐使用 `deb` 或 `rpm` 包，但本教程使用
[CRI-O Packaging 项目](https://github.com/cri-o/packaging/blob/main/README.md)中的**静态二进制包**脚本，
以简化整个安装过程，并保持与 Linux 发行版无关。

<!--
The script installs and configures additional required software, such as
[`cni-plugins`](https://github.com/containernetworking/cni), for container
networking, and [`crun`](https://github.com/containers/crun) and
[`runc`](https://github.com/opencontainers/runc), for running containers.

The script will automatically detect your system's processor architecture
(`amd64` or `arm64`) and select and install the latest versions of the software packages.
-->
此脚本安装并配置更多必需的软件，例如容器联网所用的 [`cni-plugins`](https://github.com/containernetworking/cni)
以及运行容器所用的 [`crun`](https://github.com/containers/crun) 和 [`runc`](https://github.com/opencontainers/runc)。

此脚本将自动检测系统的处理器架构（`amd64` 或 `arm64`），并选择和安装最新版本的软件包。

<!--
### Set up CRI-O {#cri-o-setup}

Visit the [releases](https://github.com/cri-o/cri-o/releases) page (external link).

Download the static binary bundle script:
-->
### 设置 CRI-O   {#cri-o-setup}

查阅[发布版本](https://github.com/cri-o/cri-o/releases)页面（外部链接）。

下载静态二进制包脚本：

```shell
curl https://raw.githubusercontent.com/cri-o/packaging/main/get > crio-install
```

<!--
Run the installer script:
-->
运行安装器脚本：

```shell
sudo bash crio-install
```

<!--
Enable and start the `crio` service:
-->
启用并启动 `crio` 服务：

```shell
sudo systemctl daemon-reload
sudo systemctl enable --now crio.service
```

<!--
Quick test:
-->
快速测试：

```shell
sudo systemctl is-active crio.service
```

<!--
The output is similar to:
-->
输出类似于：

```
active
```

<!--
Detailed service check:
-->
详细的服务检查：

```shell
sudo journalctl -f -u crio.service
```

<!--
### Install network plugins

The `cri-o` installer installs and configures the `cni-plugins` package. You can
verify the installation running the following command:
-->
### 安装网络插件   {#install-network-plugins}

`cri-o` 安装器安装并配置 `cni-plugins` 包。你可以通过运行以下命令来验证安装包：

```shell
/opt/cni/bin/bridge --version
```

<!--
The output is similar to:
-->
输出类似于：

```
CNI bridge plugin v1.5.1
CNI protocol versions supported: 0.1.0, 0.2.0, 0.3.0, 0.3.1, 0.4.0, 1.0.0
```

<!--
To check the default configuration:
-->
检查默认配置：

```shell
cat /etc/cni/net.d/11-crio-ipv4-bridge.conflist
```

<!--
The output is similar to:
-->
输出类似于：

```json
{
  "cniVersion": "1.0.0",
  "name": "crio",
  "plugins": [
    {
      "type": "bridge",
      "bridge": "cni0",
      "isGateway": true,
      "ipMasq": true,
      "hairpinMode": true,
      "ipam": {
        "type": "host-local",
        "routes": [
            { "dst": "0.0.0.0/0" }
        ],
        "ranges": [
            [{ "subnet": "10.85.0.0/16" }]
        ]
      }
    }
  ]
}
```

{{< note >}}
<!--
Make sure that the default `subnet` range (`10.85.0.0/16`) does not overlap with
any of your active networks. If there is an overlap, you can edit the file and change it
accordingly. Restart the service after the change.
-->
确保默认的 `subnet` 范围（`10.85.0.0/16`）不会与你已经在使用的任一网络地址重叠。
如果出现重叠，你可以编辑此文件并进行相应的更改。更改后重启服务。
{{< /note >}}

<!--
### Download and set up the kubelet

Download the [latest stable release](/releases/download/) of the kubelet.
-->
### 下载并设置 kubelet   {#download-and-set-up-the-kubelet}

下载 kubelet 的[最新稳定版本](/zh-cn/releases/download/)。

{{< tabs name="download_kubelet" >}}
{{< tab name="x86-64" codelang="bash" >}}
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubelet"
{{< /tab >}}
{{< tab name="ARM64" codelang="bash" >}}
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/arm64/kubelet"
{{< /tab >}}
{{< /tabs >}}

<!--
Configure:
-->
配置：

```shell
sudo mkdir -p /etc/kubernetes/manifests
```

<!--
```shell
sudo tee /etc/kubernetes/kubelet.yaml <<EOF
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
authentication:
  webhook:
    enabled: false # Do NOT use in production clusters!
authorization:
  mode: AlwaysAllow # Do NOT use in production clusters!
enableServer: false
logging:
  format: text
address: 127.0.0.1 # Restrict access to localhost
readOnlyPort: 10255 # Do NOT use in production clusters!
staticPodPath: /etc/kubernetes/manifests
containerRuntimeEndpoint: unix:///var/run/crio/crio.sock
EOF
```
-->
```shell
sudo tee /etc/kubernetes/kubelet.yaml <<EOF
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
authentication:
  webhook:
    enabled: false # 请勿在生产集群中使用！
authorization:
  mode: AlwaysAllow # 请勿在生产集群中使用！
enableServer: false
logging:
  format: text
address: 127.0.0.1 # 限制对 localhost 的访问
readOnlyPort: 10255 # 请勿在生产集群中使用！
staticPodPath: /etc/kubernetes/manifests
containerRuntimeEndpoint: unix:///var/run/crio/crio.sock
EOF
```

{{< note >}}
<!--
Because you are not setting up a production cluster, you are using plain HTTP
(`readOnlyPort: 10255`) for unauthenticated queries to the kubelet's API.

The _authentication webhook_ is disabled and _authorization mode_ is set to `AlwaysAllow`
for the purpose of this tutorial. You can learn more about
[authorization modes](/docs/reference/access-authn-authz/authorization/#authorization-modules)
and [webhook authentication](/docs/reference/access-authn-authz/webhook/) to properly
configure kubelet in standalone mode in your environment.

See [Ports and Protocols](/docs/reference/networking/ports-and-protocols/) to
understand which ports Kubernetes components use.
-->
由于你搭建的不是一个生产集群，所以你可以使用明文
HTTP（`readOnlyPort: 10255`）对 kubelet API 进行不做身份认证的查询。

为了顺利完成本次教学，**身份认证 Webhook** 被禁用，**鉴权模式**被设置为 `AlwaysAllow`。
你可以进一步了解[鉴权模式](/zh-cn/docs/reference/access-authn-authz/authorization/#authorization-modules)和
[Webhook 身份认证](/zh-cn/docs/reference/access-authn-authz/webhook/)，
以正确地配置 kubelet 在你的环境中以独立模式运行。

参阅[端口和协议](/zh-cn/docs/reference/networking/ports-and-protocols/)以了解 Kubernetes 组件使用的端口。
{{< /note >}}

<!--
Install:
-->
安装：

```shell
chmod +x kubelet
sudo cp kubelet /usr/bin/
```

<!--
Create a `systemd` service unit file:
-->
创建 `systemd` 服务单元文件：

```shell
sudo tee /etc/systemd/system/kubelet.service <<EOF
[Unit]
Description=Kubelet

[Service]
ExecStart=/usr/bin/kubelet \
 --config=/etc/kubernetes/kubelet.yaml
Restart=always

[Install]
WantedBy=multi-user.target
EOF
```

<!--
The command line argument `--kubeconfig` has been intentionally omitted in the
service configuration file. This argument sets the path to a
[kubeconfig](/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
file that specifies how to connect to the API server, enabling API server mode.
Omitting it, enables standalone mode.

Enable and start the `kubelet` service:
-->
服务配置文件中故意省略了命令行参数 `--kubeconfig`。此参数设置
[kubeconfig](/zh-cn/docs/concepts/configuration/organize-cluster-access-kubeconfig/)
文件的路径，指定如何连接到 API 服务器，以启用 API 服务器模式。省略此参数将启用独立模式。

启用并启动 `kubelet` 服务：

```shell
sudo systemctl daemon-reload
sudo systemctl enable --now kubelet.service
```

<!--
Quick test:
-->
快速测试：

```shell
sudo systemctl is-active kubelet.service
```

<!--
The output is similar to:
-->
输出类似于：

```
active
```

<!--
Detailed service check:
-->
详细的服务检查：

```shell
sudo journalctl -u kubelet.service
```

<!--
Check the kubelet's API `/healthz` endpoint:
-->
检查 kubelet 的 API `/healthz` 端点：

```shell
curl http://localhost:10255/healthz?verbose
```

<!--
The output is similar to:
-->
输出类似于：

```
[+]ping ok
[+]log ok
[+]syncloop ok
healthz check passed
```

<!--
Query the kubelet's API `/pods` endpoint:
-->
查询 kubelet 的 API `/pods` 端点：

```shell
curl http://localhost:10255/pods | jq '.'
```

<!--
The output is similar to:
-->
输出类似于：

```json
{
  "kind": "PodList",
  "apiVersion": "v1",
  "metadata": {},
  "items": null
}
```

<!--
## Run a Pod in the kubelet

In standalone mode, you can run Pods using Pod manifests. The manifests can either
be on the local filesystem, or fetched via HTTP from a configuration source.

Create a manifest for a Pod:
-->
## 在 kubelet 中运行 Pod   {#run-a-pod-in-the-kubelet}

在独立模式下，你可以使用 Pod 清单运行 Pod。这些清单可以放在本地文件系统上，或通过 HTTP 从配置源获取。

为 Pod 创建一个清单：

```shell
cat <<EOF > static-web.yaml
apiVersion: v1
kind: Pod
metadata:
  name: static-web
spec:
  containers:
    - name: web
      image: nginx
      ports:
        - name: web
          containerPort: 80
          protocol: TCP
EOF
```

<!--
Copy the `static-web.yaml` manifest file to the `/etc/kubernetes/manifests` directory.
-->
将 `static-web.yaml` 清单文件复制到 `/etc/kubernetes/manifests` 目录。

```shell
sudo cp static-web.yaml /etc/kubernetes/manifests/
```

<!--
### Find out information about the kubelet and the Pod {#find-out-information}

The Pod networking plugin creates a network bridge (`cni0`) and a pair of `veth` interfaces
for each Pod (one of the pair is inside the newly made Pod, and the other is at the host level).

Query the kubelet's API endpoint at `http://localhost:10255/pods`:
-->
### 查找 kubelet 和 Pod 的信息   {#find-out-information}

Pod 网络插件为每个 Pod 创建一个网络桥（`cni0`）和一对 `veth` 接口
（这对接口的其中一个接口在新创建的 Pod 内，另一个接口在主机层面）。

查询 kubelet 的 API 端点 `http://localhost:10255/pods`：

```shell
curl http://localhost:10255/pods | jq '.'
```

<!--
To obtain the IP address of the `static-web` Pod:
-->
要获取 `static-web` Pod 的 IP 地址：

```shell
curl http://localhost:10255/pods | jq '.items[].status.podIP'
```

<!--
The output is similar to:
-->
输出类似于：

```
"10.85.0.4"
```

<!--
Connect to the `nginx` server Pod on `http://<IP>:<Port>` (port 80 is the default), in this case:
-->
连接到 `nginx` 服务器 Pod，地址为 `http://<IP>:<Port>`（端口 80 是默认端口），在本例中为：

```shell
curl http://10.85.0.4
```

<!--
The output is similar to:
-->
输出类似于：

```html
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
...
```

<!--
## Where to look for more details

If you need to diagnose a problem getting this tutorial to work, you can look
within the following directories for monitoring and troubleshooting:
-->
## 了解更多细节   {#where-to-look-for-more-details}

如果你需要排查在学习本教程时遇到的问题，你可以在以下目录中查找监控和故障排查资料：

```
/var/lib/cni
/var/lib/containers
/var/lib/kubelet

/var/log/containers
/var/log/pods
```

<!--
## Clean up

### kubelet
-->
## 清理   {#clean-up}

### kubelet

```shell
sudo systemctl disable --now kubelet.service
sudo systemctl daemon-reload
sudo rm /etc/systemd/system/kubelet.service
sudo rm /usr/bin/kubelet
sudo rm -rf /etc/kubernetes
sudo rm -rf /var/lib/kubelet
sudo rm -rf /var/log/containers
sudo rm -rf /var/log/pods
```

<!--
### Container Runtime
-->
### 容器运行时   {#container-runtime}

```shell
sudo systemctl disable --now crio.service
sudo systemctl daemon-reload
sudo rm -rf /usr/local/bin
sudo rm -rf /usr/local/lib
sudo rm -rf /usr/local/share
sudo rm -rf /usr/libexec/crio
sudo rm -rf /etc/crio
sudo rm -rf /etc/containers
```

<!--
### Network Plugins
-->
### 网络插件   {#network-plugins}

```shell
sudo rm -rf /opt/cni
sudo rm -rf /etc/cni
sudo rm -rf /var/lib/cni
```

<!--
## Conclusion

This page covered the basic aspects of deploying a kubelet in standalone mode.
You are now ready to deploy Pods and test additional functionality.

Notice that in standalone mode the kubelet does *not* support fetching Pod
configurations from the control plane (because there is no control plane connection).

You also cannot use a {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}} or a
{{< glossary_tooltip text="Secret" term_id="secret" >}} to configure the containers
in a static Pod.
-->
## 结论   {#conclusion}

本页涵盖了以独立模式部署 kubelet 的各个基本方面。你现在可以部署 Pod 并测试更多功能。

请注意，在独立模式下，kubelet **不**支持从控制平面获取 Pod 配置（因为没有控制平面连接）。

你还不能使用 {{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}
或 {{< glossary_tooltip text="Secret" term_id="secret" >}} 来配置静态 Pod 中的容器。

## {{% heading "whatsnext" %}}

<!--
* Follow [Hello, minikube](/docs/tutorials/hello-minikube/) to learn about running Kubernetes
  _with_ a control plane. The minikube tool helps you set up a practice cluster on your own computer.
* Learn more about [Network Plugins](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
* Learn more about [Container Runtimes](/docs/setup/production-environment/container-runtimes/)
* Learn more about [kubelet](/docs/reference/command-line-tools-reference/kubelet/)
* Learn more about [static Pods](/docs/tasks/configure-pod-container/static-pod/)
-->
* 跟随[你好，Minikube](/zh-cn/docs/tutorials/hello-minikube/)
  学习如何在**有**控制平面的情况下运行 Kubernetes。minikube 工具帮助你在自己的计算机上搭建一个练习集群。
* 进一步了解[网络插件](/zh-cn/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
* 进一步了解[容器运行时](/zh-cn/docs/setup/production-environment/container-runtimes/)
* 进一步了解 [kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/)
* 进一步了解[静态 Pod](/zh-cn/docs/tasks/configure-pod-container/static-pod/)
