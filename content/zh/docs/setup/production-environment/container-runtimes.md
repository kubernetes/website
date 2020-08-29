---
reviewers:
- vincepri
- bart0sh
title: 容器运行时
content_type: concept
weight: 10
---
<!--
---
reviewers:
- vincepri
- bart0sh
title: Container runtimes
content_type: concept
weight: 10
---
-->
<!-- overview -->
{{< feature-state for_k8s_version="v1.6" state="stable" >}}
<!--
To run containers in Pods, Kubernetes uses a container runtime. Here are
the installation instructions for various runtimes.
-->
Kubernetes 使用容器运行时来实现在 pod 中运行容器。
这是各种运行时的安装说明。



<!-- body -->

{{< caution >}}
<!--
A flaw was found in the way runc handled system file descriptors when running containers.
A malicious container could use this flaw to overwrite contents of the runc binary and
consequently run arbitrary commands on the container host system.

Please refer to this link for more information about this issue
[cve-2019-5736 : runc vulnerability ] (https://access.redhat.com/security/cve/cve-2019-5736)
-->
我们发现 runc 在运行容器，处理系统文件描述符时存在一个漏洞。
恶意容器可以利用此漏洞覆盖 runc 二进制文件的内容，并以此在主机系统的容器上运行任意的命令。

请参考此链接以获取有关此问题的更多信息 [cve-2019-5736 : runc vulnerability ](https://access.redhat.com/security/cve/cve-2019-5736)
{{< /caution >}}

<!--
### Applicability
-->
### 适用性

{{< note >}}
<!--
This document is written for users installing CRI onto Linux. For other operating
systems, look for documentation specific to your platform
-->
本文档是为在 Linux 上安装 CRI 的用户编写的。
对于其他操作系统，请查找特定于您平台的文档。
{{< /note >}}

<!--
You should execute all the commands in this guide as `root`. For example, prefix commands
with `sudo `, or become `root` and run the commands as that user.
-->
您应该以 `root` 身份执行本指南中的所有命令。
例如，使用 `sudo` 前缀命令，或者成为 `root` 并以该用户身份运行命令。

<!--
### Cgroup drivers
-->
### Cgroup 驱动程序

<!--
When systemd is chosen as the init system for a Linux distribution, the init process generates
and consumes a root control group (`cgroup`) and acts as a cgroup manager. Systemd has a tight
integration with cgroups and will allocate cgroups per process. It's possible to configure your
container runtime and the kubelet to use `cgroupfs`. Using `cgroupfs` alongside systemd means
that there will then be two different cgroup managers.
-->
当某个 Linux 系统发行版使用 systemd 作为其初始化系统时，初始化进程会生成并使用一个 root 控制组 （`cgroup`），并充当 cgroup 管理器。
systemd 与 cgroup 集成紧密，并将为每个进程分配 cgroup。
您也可以配置容器运行时和 kubelet 使用 `cgroupfs`。
连同 systemd 一起使用 `cgroupfs` 意味着将有两个不同的 cgroup 管理器。

<!--
Control groups are used to constrain resources that are allocated to processes.
A single cgroup manager will simplify the view of what resources are being allocated
and will by default have a more consistent view of the available and in-use resources. When we have
two managers we end up with two views of those resources. We have seen cases in the field
where nodes that are configured to use `cgroupfs` for the kubelet and Docker, and `systemd`
for the rest of the processes running on the node becomes unstable under resource pressure.
-->
控制组用来约束分配给进程的资源。
单个 cgroup 管理器将简化分配资源的视图，并且默认情况下将对可用资源和使用中的资源具有更一致的视图。
当有两个管理器时，最终将对这些资源产生两种视图。
在此领域我们已经看到案例，某些节点配置让 kubelet 和 docker 使用 `cgroupfs`，而节点上运行的其余进程则使用 systemd；这类节点在资源压力下会变得不稳定。

<!--
Changing the settings such that your container runtime and kubelet use `systemd` as the cgroup driver
stabilized the system. Please note the `native.cgroupdriver=systemd` option in the Docker setup below.
-->
更改设置，令容器运行时和 kubelet 使用 `systemd` 作为 cgroup 驱动，以此使系统更为稳定。
请注意在 docker  下设置 `native.cgroupdriver=systemd` 选项。

{{< caution >}}
<!--
Changing the cgroup driver of a Node that has joined a cluster is highly unrecommended.
If the kubelet has created Pods using the semantics of one cgroup driver, changing the container
runtime to another cgroup driver can cause errors when trying to re-create the PodSandbox
for such existing Pods. Restarting the kubelet may not solve such errors. The recommendation
is to drain the Node from its workloads, remove it from the cluster and re-join it.
-->
强烈建议不要更改已加入集群的节点的 cgroup 驱动。
如果 kubelet 已经使用某 cgroup 驱动的语义创建了 pod，尝试更改运行时以使用别的 cgroup 驱动，为现有 Pods 重新创建 PodSandbox 时会产生错误。
重启 kubelet 也可能无法解决此类问题。
推荐将工作负载逐出节点，之后将节点从集群中删除并重新加入。
{{< /caution >}}

<!--
## Docker

On each of your machines, install Docker.
Version 19.03.4 is recommended, but 1.13.1, 17.03, 17.06, 17.09, 18.06 and 18.09 are known to work as well.
Keep track of the latest verified Docker version in the Kubernetes release notes.

Use the following commands to install Docker on your system:
-->
## Docker

在您的每台机器上安装 Docker。
推荐安装 19.03.4 版本，但是 1.13.1、17.03、17.06、17.09、18.06 和 18.09 版本也是可以的。
请跟踪 Kubernetes 发行说明中经过验证的 Docker 最新版本变化。

使用以下命令在您的系统上安装 Docker：

{{< tabs name="tab-cri-docker-installation" >}}
{{% tab name="Ubuntu 16.04+" %}}

<!--
# Install Docker CE
## Set up the repository:
### Install packages to allow apt to use a repository over HTTPS
apt-get update && apt-get install \
  apt-transport-https ca-certificates curl software-properties-common

### Add Docker’s official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
-->

```shell
# 安装 Docker CE
## 设置仓库
### 安装软件包以允许 apt 通过 HTTPS 使用存储库
apt-get update && apt-get install \
  apt-transport-https ca-certificates curl software-properties-common
```

```shell
### 新增 Docker 的 官方 GPG 秘钥
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
```
<!--
### Add Docker apt repository.
add-apt-repository \
  "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) \
  stable"

## Install Docker CE.
apt-get update && apt-get install \
  containerd.io=1.2.10-3 \
  docker-ce=5:19.03.4~3-0~ubuntu-$(lsb_release -cs) \
  docker-ce-cli=5:19.03.4~3-0~ubuntu-$(lsb_release -cs)

# Setup daemon.
cat > /etc/docker/daemon.json <<EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2"
}
EOF

mkdir -p /etc/systemd/system/docker.service.d
-->
```shell
### 添加 Docker apt 仓库
add-apt-repository \
  "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) \
  stable"
```

```shell
## 安装 Docker CE
apt-get update && apt-get install -y\
  containerd.io=1.2.13-2 \
  docker-ce=5:19.03.11~3-0~ubuntu-$(lsb_release -cs) \
  docker-ce-cli=5:19.03.11~3-0~ubuntu-$(lsb_release -cs)
```

```shell
# 设置 daemon
cat > /etc/docker/daemon.json <<EOF
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
mkdir -p /etc/systemd/system/docker.service.d
```
<!--
# Restart docker.
systemctl daemon-reload
systemctl restart docker
-->
```shell
# 重启 docker.
systemctl daemon-reload
systemctl restart docker
```
{{% /tab %}}
{{% tab name="CentOS/RHEL 7.4+" %}}

<!--
# Install Docker CE
## Set up the repository
### Install required packages.
yum install yum-utils device-mapper-persistent-data lvm2

### Add Docker repository.
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

## Install Docker CE.
yum update && yum install \
  containerd.io-1.2.10 \
  docker-ce-19.03.4 \
  docker-ce-cli-19.03.4

## Create /etc/docker directory.
mkdir /etc/docker

# Setup daemon.
cat > /etc/docker/daemon.json <<EOF
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

mkdir -p /etc/systemd/system/docker.service.d
-->
```shell
# 安装 Docker CE
## 设置仓库
### 安装所需包
yum install yum-utils device-mapper-persistent-data lvm2
```

```shell
### 新增 Docker 仓库。
yum-config-manager \
  --add-repo \
  https://download.docker.com/linux/centos/docker-ce.repo
```

```shell
## 安装 Docker CE.
yum update && yum install docker-ce-18.06.2.ce
```

```shell
## 创建 /etc/docker 目录。
mkdir /etc/docker
```

```shell
# 设置 daemon。
cat > /etc/docker/daemon.json <<EOF
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
mkdir -p /etc/systemd/system/docker.service.d
```
<!--
# Restart Docker
systemctl daemon-reload
systemctl restart docker
-->
```shell
# 重启 Docker
systemctl daemon-reload
systemctl restart docker
```
{{% /tab %}}
{{% /tabs %}}

<!--
If you want the docker service to start on boot, run the following command:

```shell
sudo systemctl enable docker
```
-->

如果你想开机即启动 docker 服务，执行以下命令：

```shell
sudo systemctl enable docker
```

<!--
Refer to the [official Docker installation guides](https://docs.docker.com/engine/installation/)
for more information.
-->

请参阅[官方 Docker 安装指南](https://docs.docker.com/engine/installation/)
来获取更多的信息。

<!--
## CRI-O

This section contains the necessary steps to install `CRI-O` as CRI runtime.

Use the following commands to install CRI-O on your system:

### Prerequisites

```shell
modprobe overlay
modprobe br_netfilter

# Setup required sysctl params, these persist across reboots.
cat > /etc/sysctl.d/99-kubernetes-cri.conf <<EOF
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

sysctl --system
```
-->
## CRI-O

本节包含安装 `CRI-O` 作为 CRI 运行时的必要步骤。

使用以下命令在系统中安装 CRI-O：

### 准备环境

```shell
modprobe overlay
modprobe br_netfilter

# 设置必需的sysctl参数，这些参数在重新启动后仍然存在。
cat > /etc/sysctl.d/99-kubernetes-cri.conf <<EOF
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

sysctl --system
```

{{< tabs name="tab-cri-cri-o-installation" >}}
{{% tab name="Debian" %}}

<!--
```shell
# Debian Unstable/Sid
echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/Debian_Unstable/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/Debian_Unstable/Release.key -O- | sudo apt-key add -
```
-->

```shell
# Debian Unstable/Sid
echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/Debian_Unstable/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/Debian_Unstable/Release.key -O- | sudo apt-key add -
```

<!--
```shell
# Debian Testing
echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/Debian_Testing/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/Debian_Testing/Release.key -O- | sudo apt-key add -
```
-->

```shell
# Debian Testing
echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/Debian_Testing/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/Debian_Testing/Release.key -O- | sudo apt-key add -
```

<!--
```shell
# Debian 10
echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/Debian_10/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/Debian_10/Release.key -O- | sudo apt-key add -
```
-->

```shell
# Debian 10
echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/Debian_10/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/Debian_10/Release.key -O- | sudo apt-key add -
```

<!--
```shell
# Raspbian 10
echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/Raspbian_10/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/Raspbian_10/Release.key -O- | sudo apt-key add -
```
-->

```shell
# Raspbian 10
echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/Raspbian_10/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/Raspbian_10/Release.key -O- | sudo apt-key add -
```

<!--
and then install CRI-O:
```shell
sudo apt-get install cri-o-1.17
```
-->

随后安装 CRI-O:

```shell
sudo apt-get install cri-o-1.17
```

{{% /tab %}}

{{% tab name="Ubuntu 18.04, 19.04 and 19.10" %}}

<!--
```shell
# Configure package repository
. /etc/os-release
sudo sh -c "echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/x${NAME}_${VERSION_ID}/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list"
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/x${NAME}_${VERSION_ID}/Release.key -O- | sudo apt-key add -
sudo apt-get update
```
-->

```shell
# 配置仓库
. /etc/os-release
sudo sh -c "echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/x${NAME}_${VERSION_ID}/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list"
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/x${NAME}_${VERSION_ID}/Release.key -O- | sudo apt-key add -
sudo apt-get update
```

<!--
```shell
# Install CRI-O
sudo apt-get install cri-o-1.17
```
-->

```shell
# 安装 CRI-O
sudo apt-get install cri-o-1.17
```
{{% /tab %}}

{{% tab name="Ubuntu 16.04" %}}

<!--
# Install prerequisites
apt-get update
apt-get install software-properties-common

add-apt-repository ppa:projectatomic/ppa
apt-get update

# Install CRI-O
apt-get install cri-o-1.15
-->
```shell
# 安装必备软件
apt-get update
apt-get install software-properties-common

add-apt-repository ppa:projectatomic/ppa
apt-get update

# 安装 CRI-O
apt-get install cri-o-1.15
```
{{% /tab %}}
{{% tab name="CentOS/RHEL 7.4+" codelang="bash" %}}

<!--
# Install prerequisites
yum-config-manager --add-repo=https://cbs.centos.org/repos/paas7-crio-115-release/x86_64/os/

# Install CRI-O
yum install --nogpgcheck cri-o
-->

```shell
# 安装必备软件
yum-config-manager --add-repo=https://cbs.centos.org/repos/paas7-crio-115-release/x86_64/os/
```

```shell
# 安装 CRI-O
yum install --nogpgcheck cri-o
```

{{% /tab %}}

{{% tab name="openSUSE Tumbleweed" %}}

```shell
sudo zypper install cri-o
```
{{% /tab %}}

{{< /tabs >}}

<!--
### Start CRI-O

```
systemctl daemon-reload
systemctl start crio
```

Refer to the [CRI-O installation guide](https://github.com/kubernetes-sigs/cri-o#getting-started)
for more information.
-->
### 启动 CRI-O

```
systemctl start crio
```

请参阅 [CRI-O 安装指南](https://github.com/kubernetes-sigs/cri-o#getting-started)
来获取更多的信息。

<!--
## Containerd

This section contains the necessary steps to use `containerd` as CRI runtime.

Use the following commands to install Containerd on your system:

### Prerequisites

```shell
cat > /etc/modules-load.d/containerd.conf <<EOF
overlay
br_netfilter
EOF

modprobe overlay
modprobe br_netfilter

# Setup required sysctl params, these persist across reboots.
cat > /etc/sysctl.d/99-kubernetes-cri.conf <<EOF
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

sysctl --system
```
-->
## containerd

本节包含使用 `containerd` 作为 CRI 运行时的必要步骤。

使用以下命令在系统上安装容器：

### 准备环境

```shell
cat > /etc/modules-load.d/containerd.conf <<EOF
overlay
br_netfilter
EOF

modprobe overlay
modprobe br_netfilter

# 设置必需的sysctl参数，这些参数在重新启动后仍然存在。
cat > /etc/sysctl.d/99-kubernetes-cri.conf <<EOF
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

sysctl --system
```

<!--
### Install containerd
-->
### 安装 containerd

{{< tabs name="tab-cri-containerd-installation" >}}
{{% tab name="Ubuntu 16.04" %}}
<!--
```shell
# Install containerd
## Set up the repository
### Install packages to allow apt to use a repository over HTTPS
apt-get update && apt-get install -y apt-transport-https ca-certificates curl software-properties-common
```

```shell
### Add Docker’s official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
```

```shell
### Add Docker apt repository.
add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable"
```

```shell
## Install containerd
apt-get update && apt-get install -y containerd.io
```

```shell
# Configure containerd
mkdir -p /etc/containerd
containerd config default > /etc/containerd/config.toml
```
-->

```shell
# 安装 containerd
## 设置仓库
### 安装软件包以允许 apt 通过 HTTPS 使用存储库
apt-get update && apt-get install -y apt-transport-https ca-certificates curl software-properties-common
```

```shell
### 安装 Docker 的官方 GPG 密钥
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
```

```shell
### 新增 Docker apt 仓库。
add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable"
```

```shell
## 安装 containerd
apt-get update && apt-get install -y containerd.io
```

```shell
# 配置 containerd
mkdir -p /etc/containerd
containerd config default > /etc/containerd/config.toml
```

<!--
```shell
# Restart containerd
systemctl restart containerd
```
-->
```shell
# 重启 containerd
systemctl restart containerd
```
{{< /tab >}}
{{% tab name="CentOS/RHEL 7.4+" %}}
<!--
```shell
# Install containerd
## Set up the repository
### Install required packages
yum install yum-utils device-mapper-persistent-data lvm2
```

```shell
### Add docker repository
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```

```shell
## Install containerd
yum update && yum install containerd.io
```

```shell
# Configure containerd
mkdir -p /etc/containerd
containerd config default > /etc/containerd/config.toml
```
-->

```shell
# 安装 containerd
## 设置仓库
### 安装所需包
yum install yum-utils device-mapper-persistent-data lvm2
```

```shell
### 新增 Docker 仓库
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
```

```shell
## 安装 containerd
yum update && yum install containerd.io
```

```shell
# 配置 containerd
mkdir -p /etc/containerd
containerd config default > /etc/containerd/config.toml
```
<!--
```shell
# Restart containerd
systemctl restart containerd
```
-->

```shell
# 重启 containerd
systemctl restart containerd
```
{{% /tab %}}
{{< /tabs >}}

<!--
```shell
### systemd

To use the `systemd` cgroup driver, set `plugins.cri.systemd_cgroup = true` in `/etc/containerd/config.toml`.
When using kubeadm, manually configure the
[cgroup driver for kubelet](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#configure-cgroup-driver-used-by-kubelet-on-master-node)

## Other CRI runtimes: frakti

Refer to the [Frakti QuickStart guide](https://github.com/kubernetes/frakti#quickstart) for more information.
```
-->
### systemd

使用 `systemd` cgroup 驱动，在 `/etc/containerd/config.toml` 中设置 `plugins.cri.systemd_cgroup = true`。
当使用 kubeadm 时，请手动配置
[kubelet 的 cgroup 驱动](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#configure-cgroup-driver-used-by-kubelet-on-master-node)

## 其他的 CRI 运行时：frakti

请参阅 [Frakti 快速开始指南](https://github.com/kubernetes/frakti#quickstart) 来获取更多的信息。
