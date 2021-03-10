---
title: 容器运行时
content_type: concept
weight: 20
---
<!--
reviewers:
- vincepri
- bart0sh
title: Container runtimes
content_type: concept
weight: 10
-->

<!-- overview -->

<!-- 
You need to install a
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
into each node in the cluster so that Pods can run there. This page outlines
what is involved and describes related tasks for setting up nodes.
 -->
你需要在集群内每个节点上安装一个{{< glossary_tooltip text="容器运行时" term_id="container-runtime" >}}
以使 Pod 可以运行在上面。本文概述了所涉及的内容并描述了与节点设置相关的任务。

<!-- body -->

<!-- 
This page lists details for using several common container runtimes with
Kubernetes, on Linux:
 -->
本文列出了在 Linux 上结合 Kubernetes 使用的几种通用容器运行时的详细信息： 

- [containerd](#containerd)
- [CRI-O](#cri-o)
- [Docker](#docker)

<!-- 
{{< note >}}
For other operating systems, look for documentation specific to your platform.
{{< /note >}}
 -->
提示：对于其他操作系统，请查阅特定于你所使用平台的相关文档。

<!--
## Cgroup drivers
-->
## Cgroup 驱动程序

<!--
Control groups are used to constrain resources that are allocated to processes.

When [systemd](https://www.freedesktop.org/wiki/Software/systemd/) is chosen as the init
system for a Linux distribution, the init process generates and consumes a root control group
(`cgroup`) and acts as a cgroup manager.
Systemd has a tight integration with cgroups and allocates a cgroup per systemd unit. It's possible
to configure your container runtime and the kubelet to use `cgroupfs`. Using `cgroupfs` alongside
systemd means that there will be two different cgroup managers.
-->
控制组用来约束分配给进程的资源。

当某个 Linux 系统发行版使用 [systemd](https://www.freedesktop.org/wiki/Software/systemd/) 作为其初始化系统时，初始化进程会生成并使用一个 root 控制组 (`cgroup`), 并充当 cgroup 管理器。
Systemd 与 cgroup 集成紧密，并将为每个 systemd 单元分配一个 cgroup。
你也可以配置容器运行时和 kubelet 使用 `cgroupfs`。
连同 systemd 一起使用 `cgroupfs` 意味着将有两个不同的 cgroup 管理器。

<!--
A single cgroup manager simplifies the view of what resources are being allocated
and will by default have a more consistent view of the available and in-use resources.
When there are two cgroup managers on a system, you end up with two views of those resources.
In the field, people have reported cases where nodes that are configured to use `cgroupfs`
for the kubelet and Docker, but `systemd` for the rest of the processes, become unstable under
resource pressure.
-->
单个 cgroup 管理器将简化分配资源的视图，并且默认情况下将对可用资源和使用中的资源具有更一致的视图。
当有两个管理器共存于一个系统中时，最终将对这些资源产生两种视图。
在此领域人们已经报告过一些案例，某些节点配置让 kubelet 和 docker 使用 `cgroupfs`，而节点上运行的其余进程则使用 systemd; 这类节点在资源压力下会变得不稳定。

<!--
Changing the settings such that your container runtime and kubelet use `systemd` as the cgroup driver
stabilized the system. To configure this for Docker, set `native.cgroupdriver=systemd`.
-->
更改设置，令容器运行时和 kubelet 使用 `systemd` 作为 cgroup 驱动，以此使系统更为稳定。
对于 Docker, 设置 `native.cgroupdriver=systemd` 选项。

<!--
{{< caution >}}
Changing the cgroup driver of a Node that has joined a cluster is strongly *not* recommended.  
If the kubelet has created Pods using the semantics of one cgroup driver, changing the container
runtime to another cgroup driver can cause errors when trying to re-create the Pod sandbox
for such existing Pods. Restarting the kubelet may not solve such errors.

If you have automation that makes it feasible, replace the node with another using the updated
configuration, or reinstall it using automation.
{{< /caution >}}
-->
注意：非常 *不* 建议更改已加入集群的节点的 cgroup 驱动。
如果 kubelet 已经使用某 cgroup 驱动的语义创建了 pod，更改运行时以使用别的 cgroup 驱动，当为现有 Pods 重新创建 PodSandbox 时会产生错误。重启 kubelet 也可能无法解决此类问题。
如果你有切实可行的自动化方案，使用其他已更新配置的节点来替换该节点，或者使用自动化方案来重新安装。

<!-- 
## Container runtimes
 -->
## 容器运行时

{{% thirdparty-content %}}

### containerd

<!--
This section contains the necessary steps to use `containerd` as CRI runtime.

Use the following commands to install Containerd on your system:

Install and configure prerequisites:

```shell
cat <<EOF | sudo tee /etc/modules-load.d/containerd.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# Setup required sysctl params, these persist across reboots.
cat <<EOF | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system
```
-->
本节包含使用 `containerd` 作为 CRI 运行时的必要步骤。

使用以下命令在系统上安装容器：

安装和配置的先决条件：

```shell
cat <<EOF | sudo tee /etc/modules-load.d/containerd.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# 设置必需的 sysctl 参数，这些参数在重新启动后仍然存在。
cat <<EOF | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

# Apply sysctl params without reboot
sudo sysctl --system
```

<!--
Install containerd:
-->
安装 containerd:

{{< tabs name="tab-cri-containerd-installation" >}}
{{% tab name="Ubuntu 16.04" %}}

<!--
```shell
# (Install containerd)
## Set up the repository
### Install packages to allow apt to use a repository over HTTPS
sudo apt-get update && sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
```

```shell
## Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key --keyring /etc/apt/trusted.gpg.d/docker.gpg add -
```

```shell
## Add Docker apt repository.
sudo add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable"
```

```shell
## Install containerd
sudo apt-get update && sudo apt-get install -y containerd.io
```

```shell
# Configure containerd
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
```

```shell
# Restart containerd
sudo systemctl restart containerd
```
-->
```shell
# (安装 containerd)
## (设置仓库)
### (安装软件包以允许 apt 通过 HTTPS 使用存储库)
sudo apt-get update && sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
```

```shell
## 安装 Docker 的官方 GPG 密钥
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key --keyring /etc/apt/trusted.gpg.d/docker.gpg add -
```

```shell
## 新增 Docker apt 仓库。
sudo add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable"
```

```shell
## 安装 containerd
sudo apt-get update && sudo apt-get install -y containerd.io
```

```shell
# 配置 containerd
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
```

```shell
# 重启 containerd
sudo systemctl restart containerd
```
{{< /tab >}}
{{% tab name="Ubuntu 18.04/20.04" %}}

<!--
```shell
# (Install containerd)
sudo apt-get update && sudo apt-get install -y containerd
```

```shell
# Configure containerd
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
```

```shell
# Restart containerd
sudo systemctl restart containerd
```
-->
```shell
# 安装 containerd
sudo apt-get update && sudo apt-get install -y containerd
```

```shell
# 配置 containerd
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
```

```shell
# 重启 containerd
sudo systemctl restart containerd
```
{{% /tab %}}
{{% tab name="Debian 9+" %}}

<!--
```shell
# (Install containerd)
## Set up the repository
### Install packages to allow apt to use a repository over HTTPS
sudo apt-get update && sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
```

```shell
## Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key --keyring /etc/apt/trusted.gpg.d/docker.gpg add -
```

```shell
## Add Docker apt repository.
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/debian \
   $(lsb_release -cs) \
   stable"
```
-->
```shell
# 安装 containerd
## 配置仓库
### 安装软件包以使 apt 能够使用 HTTPS 访问仓库
sudo apt-get update && sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
```

```shell
## 添加 Docker 的官方 GPG 密钥
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key --keyring /etc/apt/trusted.gpg.d/docker.gpg add -
```

```shell
## 添加 Docker apt 仓库
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/debian \
   $(lsb_release -cs) \
   stable"
```

<!--
```shell
## Install containerd
sudo apt-get update && sudo apt-get install -y containerd.io
```

```shell
# Set default containerd configuration
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
```

```shell
# Restart containerd
sudo systemctl restart containerd
```
-->
```shell
## 安装 containerd
sudo apt-get update && sudo apt-get install -y containerd.io
```

```shell
# 设置 containerd 的默认配置
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
```

```shell
# 重启 containerd
sudo systemctl restart containerd
```
{{% /tab %}}
{{% tab name="CentOS/RHEL 7.4+" %}}

<!--
```shell
# (Install containerd)
## Set up the repository
### Install required packages
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```

```shell
## Add docker repository
sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```

```shell
## Install containerd
sudo yum update -y && sudo yum install -y containerd.io
```

```shell
## Configure containerd
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
```

```shell
# Restart containerd
sudo systemctl restart containerd
```
-->
```shell
# 安装 containerd
## 设置仓库
### 安装所需包
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```

```shell
### 添加 Docker 仓库
sudo yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```

```shell
## 安装 containerd
sudo yum update -y && sudo yum install -y containerd.io
```

```shell
# 配置 containerd
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml
```

```shell
# 重启 containerd
sudo systemctl restart containerd
```
{{% /tab %}}
{{% tab name="Windows (PowerShell)" %}}
<!-- 
```powershell
# (Install containerd)
# download containerd
cmd /c curl -OL https://github.com/containerd/containerd/releases/download/v1.4.1/containerd-1.4.1-windows-amd64.tar.gz
cmd /c tar xvf .\containerd-1.4.1-windows-amd64.tar.gz
```

```powershell
# extract and configure
Copy-Item -Path ".\bin\" -Destination "$Env:ProgramFiles\containerd" -Recurse -Force
cd $Env:ProgramFiles\containerd\
.\containerd.exe config default | Out-File config.toml -Encoding ascii

# review the configuration. depending on setup you may want to adjust:
# - the sandbox_image (kubernetes pause image)
# - cni bin_dir and conf_dir locations
Get-Content config.toml
```

```powershell
# start containerd
.\containerd.exe --register-service
Start-Service containerd
```
 -->
```powershell
# 安装 containerd 
# 下载 containerd
cmd /c curl -OL https://github.com/containerd/containerd/releases/download/v1.4.1/containerd-1.4.1-windows-amd64.tar.gz
cmd /c tar xvf .\containerd-1.4.1-windows-amd64.tar.gz
```

```powershell
# 解压并配置
Copy-Item -Path ".\bin\" -Destination "$Env:ProgramFiles\containerd" -Recurse -Force
cd $Env:ProgramFiles\containerd\
.\containerd.exe config default | Out-File config.toml -Encoding ascii

# 检查配置文件，基于你可能想要调整的设置：
# - sandbox_image (kubernetes pause 镜像)
# - CNI 的 bin_dir 和 conf_dir 路径
Get-Content config.toml
```

```powershell
# 启动 containerd
.\containerd.exe --register-service
Start-Service containerd
```
{{% /tab %}}
{{< /tabs >}}

#### systemd {#containerd-systemd}

<!-- 
To use the `systemd` cgroup driver in `/etc/containerd/config.toml` with `runc`, set

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

When using kubeadm, manually configure the
[cgroup driver for kubelet](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#configure-cgroup-driver-used-by-kubelet-on-control-plane-node).
-->
结合 `runc` 使用 `systemd` cgroup 驱动，在 `/etc/containerd/config.toml` 中设置 

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

当使用 kubeadm 时，请手动配置
[kubelet 的 cgroup 驱动](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#configure-cgroup-driver-used-by-kubelet-on-control-plane-node).

### CRI-O

<!--
This section contains the necessary steps to install CRI-O as a container runtime.

Use the following commands to install CRI-O on your system:

{{< note >}}
The CRI-O major and minor versions must match the Kubernetes major and minor versions.
For more information, see the [CRI-O compatibility matrix](https://github.com/cri-o/cri-o).
{{< /note >}}

Install and configure prerequisites:

```shell

# Create the .conf file to load the modules at bootup
cat <<EOF | sudo tee /etc/modules-load.d/crio.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# Set up required sysctl params, these persist across reboots.
cat <<EOF | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

sudo sysctl --system
```
-->
本节包含安装 CRI-O 作为容器运行时的必要步骤。

使用以下命令在系统中安装 CRI-O：

提示：CRI-O 的主要以及次要版本必须与 Kubernetes 的主要和次要版本相匹配。
更多信息请查阅 [CRI-O 兼容性列表](https://github.com/cri-o/cri-o).

安装以及配置的先决条件：

```shell

# 创建 .conf 文件，以便在系统启动时加载内核模块
cat <<EOF | sudo tee /etc/modules-load.d/crio.conf
overlay
br_netfilter
EOF

sudo modprobe overlay
sudo modprobe br_netfilter

# 设置必需的 sysctl 参数，这些参数在重新启动后仍然存在。
cat <<EOF | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

sudo sysctl --system
```

{{< tabs name="tab-cri-cri-o-installation" >}}
{{% tab name="Debian" %}}

<!-- 
To install CRI-O on the following operating systems, set the environment variable `OS`
to the appropriate value from the following table:

| Operating system | `$OS`             |
|------------------|-------------------|
| Debian Unstable  | `Debian_Unstable` |
| Debian Testing   | `Debian_Testing`  |

<br />
Then, set `$VERSION` to the CRI-O version that matches your Kubernetes version.
For instance, if you want to install CRI-O 1.18, set `VERSION=1.18`.
You can pin your installation to a specific release.
To install version 1.18.3, set `VERSION=1.18:1.18.3`.
<br />

Then run
 -->
在下列操作系统上安装 CRI-O, 使用下表中合适的值设置环境变量 `OS`:

| 操作系统         | `$OS`             |
|-----------------|-------------------|
| Debian Unstable | `Debian_Unstable` |
| Debian Testing  | `Debian_Testing`  |

<br />
然后，将 `$VERSION` 设置为与你的 Kubernetes 相匹配的 CRI-O 版本。
例如，如果你要安装 CRI-O 1.18, 请设置 `VERSION=1.18`.
你也可以安装一个特定的发行版本。
例如要安装 1.18.3 版本，设置 `VERSION=1.18:1.18.3`.
<br />

然后执行
```shell
cat <<EOF | sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
deb https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/ /
EOF
cat <<EOF | sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable:cri-o:$VERSION.list
deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable:/cri-o:/$VERSION/$OS/ /
EOF

curl -L https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable:cri-o:$VERSION/$OS/Release.key | sudo apt-key add --keyring /etc/apt/trusted.gpg.d/libcontainers.gpg -
curl -L https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/Release.key | sudo apt-key add --keyring /etc/apt/trusted.gpg.d/libcontainers.gpg -

sudo apt-get update
sudo apt-get install cri-o cri-o-runc
```

{{% /tab %}}

{{% tab name="Ubuntu" %}}

<!-- 
To install on the following operating systems, set the environment variable `OS` to the appropriate field in the following table:

| Operating system | `$OS`           |
|------------------|-----------------|
| Ubuntu 20.04     | `xUbuntu_20.04` |
| Ubuntu 19.10     | `xUbuntu_19.10` |
| Ubuntu 19.04     | `xUbuntu_19.04` |
| Ubuntu 18.04     | `xUbuntu_18.04` |

<br />
Then, set `$VERSION` to the CRI-O version that matches your Kubernetes version.
For instance, if you want to install CRI-O 1.18, set `VERSION=1.18`.
You can pin your installation to a specific release.
To install version 1.18.3, set `VERSION=1.18:1.18.3`.
<br />

Then run
-->
在下列操作系统上安装 CRI-O, 使用下表中合适的值设置环境变量 `OS`:

| 操作系统      | `$OS`           |
|--------------|-----------------|
| Ubuntu 20.04 | `xUbuntu_20.04` |
| Ubuntu 19.10 | `xUbuntu_19.10` |
| Ubuntu 19.04 | `xUbuntu_19.04` |
| Ubuntu 18.04 | `xUbuntu_18.04` |

<br />
然后，将 `$VERSION` 设置为与你的 Kubernetes 相匹配的 CRI-O 版本。
例如，如果你要安装 CRI-O 1.18, 请设置 `VERSION=1.18`.
你也可以安装一个特定的发行版本。
例如要安装 1.18.3 版本，设置 `VERSION=1.18:1.18.3`.
<br />

然后执行

```shell
cat <<EOF | sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
deb https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/ /
EOF
cat <<EOF | sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable:cri-o:$VERSION.list
deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable:/cri-o:/$VERSION/$OS/ /
EOF

curl -L https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/Release.key | sudo apt-key add --keyring /etc/apt/trusted.gpg.d/libcontainers.gpg
curl -L https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable:cri-o:$VERSION/$OS/Release.key | sudo apt-key add --keyring /etc/apt/trusted.gpg.d/libcontainers-cri-o.gpg -

sudo apt-get update
sudo apt-get install cri-o cri-o-runc
```
 
{{% /tab %}}

{{% tab name="CentOS" %}}

<!-- 
To install on the following operating systems, set the environment variable `OS` to the appropriate field in the following table:

| Operating system | `$OS`             |
|------------------|-------------------|
| Centos 8         | `CentOS_8`        |
| Centos 8 Stream  | `CentOS_8_Stream` |
| Centos 7         | `CentOS_7`        |

<br />
Then, set `$VERSION` to the CRI-O version that matches your Kubernetes version.
For instance, if you want to install CRI-O 1.18, set `VERSION=1.18`.
You can pin your installation to a specific release.
To install version 1.18.3, set `VERSION=1.18:1.18.3`.
<br />

Then run
-->
在下列操作系统上安装 CRI-O, 使用下表中合适的值设置环境变量 `OS`:

| 操作系统         | `$OS`             |
|-----------------|-------------------|
| Centos 8        | `CentOS_8`        |
| Centos 8 Stream | `CentOS_8_Stream` |
| Centos 7        | `CentOS_7`        |

<br />
然后，将 `$VERSION` 设置为与你的 Kubernetes 相匹配的 CRI-O 版本。
例如，如果你要安装 CRI-O 1.18, 请设置 `VERSION=1.18`.
你也可以安装一个特定的发行版本。
例如要安装 1.18.3 版本，设置 `VERSION=1.18:1.18.3`.
<br />

然后执行

```shell
sudo curl -L -o /etc/yum.repos.d/devel:kubic:libcontainers:stable.repo https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/devel:kubic:libcontainers:stable.repo
sudo curl -L -o /etc/yum.repos.d/devel:kubic:libcontainers:stable:cri-o:$VERSION.repo https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable:cri-o:$VERSION/$OS/devel:kubic:libcontainers:stable:cri-o:$VERSION.repo
sudo yum install cri-o
```

{{% /tab %}}

{{% tab name="openSUSE Tumbleweed" %}}

```shell
sudo zypper install cri-o
```
{{% /tab %}}
{{% tab name="Fedora" %}}

<!-- 
Set `$VERSION` to the CRI-O version that matches your Kubernetes version.
For instance, if you want to install CRI-O 1.18, `VERSION=1.18`.

You can find available versions with:
```shell
sudo dnf module list cri-o
```
CRI-O does not support pinning to specific releases on Fedora.

Then run
```shell
sudo dnf module enable cri-o:$VERSION
sudo dnf install cri-o
```
-->
将 `$VERSION` 设置为与你的 Kubernetes 相匹配的 CRI-O 版本。
例如，如果要安装 CRI-O 1.18，请设置 `VERSION=1.18`。
你可以用下列命令查找可用的版本：

```shell
sudo dnf module list cri-o
```
CRI-O 不支持在 Fedora 上固定到特定的版本。

然后执行
```shell
sudo dnf module enable cri-o:$VERSION
sudo dnf install cri-o
```

{{% /tab %}}
{{< /tabs >}}

<!-- 
Start CRI-O:

```shell
sudo systemctl daemon-reload
sudo systemctl start crio
```

Refer to the [CRI-O installation guide](https://github.com/kubernetes-sigs/cri-o#getting-started)
for more information.
 -->
启动 CRI-O:

```shell
sudo systemctl daemon-reload
sudo systemctl start crio
```

更多信息请参阅 [CRI-O 安装指南](https://github.com/kubernetes-sigs/cri-o#getting-started)。

### Docker

<!-- 
On each of your nodes, install Docker CE.

The Kubernetes release notes list which versions of Docker are compatible
with that version of Kubernetes.

Use the following commands to install Docker on your system:
 -->
在你的所有节点上安装 Docker CE.

Kubernetes 发布说明中列出了 Docker 的哪些版本与该版本的 Kubernetes 相兼容。

在你的操作系统上使用如下命令安装 Docker:

{{< tabs name="tab-cri-docker-installation" >}}
{{% tab name="Ubuntu 16.04+" %}}

<!--
```shell
# (Install Docker CE)
## Set up the repository:
### Install packages to allow apt to use a repository over HTTPS
sudo apt-get update && sudo apt-get install -y \
  apt-transport-https ca-certificates curl software-properties-common gnupg2
```

```shell
# Add Docker's official GPG key:
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add --keyring /etc/apt/trusted.gpg.d/docker.gpg -
```
-->

```shell
# (安装 Docker CE)
## 设置仓库:
### 安装软件包以允许 apt 通过 HTTPS 使用存储库
sudo apt-get update && sudo apt-get install -y \
  apt-transport-https ca-certificates curl software-properties-common gnupg2
```

```shell
### 新增 Docker 的 官方 GPG 秘钥:
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add --keyring /etc/apt/trusted.gpg.d/docker.gpg -
```

<!--
```shell
# Add the Docker apt repository:
sudo add-apt-repository \
  "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) \
  stable"
```

```shell
# Install Docker CE
sudo apt-get update && sudo apt-get install -y \
  containerd.io=1.2.13-2 \
  docker-ce=5:19.03.11~3-0~ubuntu-$(lsb_release -cs) \
  docker-ce-cli=5:19.03.11~3-0~ubuntu-$(lsb_release -cs)
```

```shell
# Set up the Docker daemon
cat <<EOF | sudo tee /etc/docker/daemon.json
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2"
}
EOF
```

```shell
# Create /etc/systemd/system/docker.service.d
sudo mkdir -p /etc/systemd/system/docker.service.d
```
-->
```shell
### 添加 Docker apt 仓库:
sudo add-apt-repository \
  "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) \
  stable"
```

```shell
## 安装 Docker CE
sudo apt-get update && sudo apt-get install -y \
  containerd.io=1.2.13-2 \
  docker-ce=5:19.03.11~3-0~ubuntu-$(lsb_release -cs) \
  docker-ce-cli=5:19.03.11~3-0~ubuntu-$(lsb_release -cs)
```

```shell
# 设置 Docker daemon
cat <<EOF | sudo tee /etc/docker/daemon.json
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2"
}
EOF
```

```shell
# Create /etc/systemd/system/docker.service.d
sudo mkdir -p /etc/systemd/system/docker.service.d
```
<!--
# Restart docker.
systemctl daemon-reload
systemctl restart docker
-->
```shell
# 重启 docker.
sudo systemctl daemon-reload
sudo systemctl restart docker
```
{{% /tab %}}
{{% tab name="CentOS/RHEL 7.4+" %}}

<!--
```shell
# (Install Docker CE)
## Set up the repository
### Install required packages
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```

```shell
## Add the Docker repository
sudo yum-config-manager --add-repo \
  https://download.docker.com/linux/centos/docker-ce.repo
```

```shell
# Install Docker CE
sudo yum update -y && sudo yum install -y \
  containerd.io-1.2.13 \
  docker-ce-19.03.11 \
  docker-ce-cli-19.03.11
```

```shell
## Create /etc/docker
sudo mkdir /etc/docker
```

```shell
# Set up the Docker daemon
cat <<EOF | sudo tee /etc/docker/daemon.json
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.override_kernel_check=true"
  ]
}
EOF
```

```shell
# Create /etc/systemd/system/docker.service.d
sudo mkdir -p /etc/systemd/system/docker.service.d
```
-->
```shell
# (安装 Docker CE)
## 设置仓库
### 安装所需包
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```

```shell
### 新增 Docker 仓库
sudo yum-config-manager --add-repo \
  https://download.docker.com/linux/centos/docker-ce.repo
```

```shell
## 安装 Docker CE
sudo yum update -y && sudo yum install -y \
  containerd.io-1.2.13 \
  docker-ce-19.03.11 \
  docker-ce-cli-19.03.11
```

```shell
## 创建 /etc/docker 目录
sudo mkdir /etc/docker
```

```shell
# 设置 Docker daemon
cat <<EOF | sudo tee /etc/docker/daemon.json
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.override_kernel_check=true"
  ]
}
EOF
```

```shell
# Create /etc/systemd/system/docker.service.d
sudo mkdir -p /etc/systemd/system/docker.service.d
```
<!--
# Restart Docker
systemctl daemon-reload
systemctl restart docker
-->
```shell
# 重启 Docker
sudo systemctl daemon-reload
sudo systemctl restart docker
```
{{% /tab %}}
{{% /tabs %}}

<!--
If you want the `docker` service to start on boot, run the following command:
-->
如果你想开机即启动 `docker` 服务，执行以下命令：

```shell
sudo systemctl enable docker
```

<!--
Refer to the [official Docker installation guides](https://docs.docker.com/engine/installation/)
for more information.
-->
请参阅[官方 Docker 安装指南](https://docs.docker.com/engine/installation/)
获取更多的信息。
