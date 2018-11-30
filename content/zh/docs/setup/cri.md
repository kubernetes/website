---
reviewers:
- vincepri
- bart0sh
title: 安装 CRI
content_template: templates/concept
weight: 100
---

<!--
---
reviewers:
- vincepri
- bart0sh
title: CRI installation
content_template: templates/concept
weight: 100
---
-->

{{% capture overview %}}

从 v1.6.0 开始，Kubernetes 默认启动了 CRI，容器运行时接口。此页面包含各种运行时的安装说明。
此页面包含各种运行时的安装说明。

<!--
Since v1.6.0, Kubernetes has enabled the use of CRI, Container Runtime Interface, by default.
This page contains installation instruction for various runtimes.
-->

{{% /capture %}}

{{% capture body %}}

请以根用户在操作系统上执行以下命令。
您可以对每个主机进行 SSH 之后执行“sudo -i”从而成为根用户。

<!--
Please proceed with executing the following commands based on your OS as root.
You may become the root user by executing `sudo -i` after SSH-ing to each host.
-->

## Docker

<!--
## Docker
-->

在每台机器上，安装 Docker

<!--
On each of your machines, install Docker.
-->

建议使用版本 18.06，但已知 1.11，1.12，1.13 和 17.03 也可以使用。

<!--
Version 18.06 is recommended, but 1.11, 1.12, 1.13 and 17.03 are known to work as well.
-->

在 Kubernetes 发行说明中跟踪最新的经过验证的Docker版本。

<!--
Keep track of the latest verified Docker version in the Kubernetes release notes.
-->

使用以下命令在系统上安装 Docker：

<!--
Use the following commands to install Docker on your system:
-->

{{< tabs name="tab-cri-docker-installation" >}}
{{< tab name="Ubuntu 16.04" codelang="bash" >}}

# 从 Ubuntu 的存储库安装 Docker：
apt-get update
apt-get install -y docker.io

<!--
# Install Docker from Ubuntu's repositories:
apt-get update
apt-get install -y docker.io
-->

# 或者从 Docker 的 Ubuntu 或 Debian 镜像仓库中安装 Docker CE 18.06：

<!--
# or install Docker CE 18.06 from Docker's repositories for Ubuntu or Debian:
-->

## 安装软件依赖。
apt-get update && apt-get install apt-transport-https ca-certificates curl software-properties-common

<!--
## Install prerequisites.
apt-get update && apt-get install apt-transport-https ca-certificates curl software-properties-common
-->

## 下载 GPG 密钥。
url -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -

<!--
## Download GPG key.
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
-->

## 添加 docker apt 镜像仓库。
add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

<!--
## Add docker apt repository.
add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
-->

## 安装 docker。
apt-get update && apt-get install docker-ce=18.06.0~ce~3-0~ubuntu

<!--
## Install docker.
apt-get update && apt-get install docker-ce=18.06.0~ce~3-0~ubuntu
-->

# 设置守护进程。
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

<!--
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

# 重启 docker。
ystemctl daemon-reload
systemctl restart docker

<!--
# Restart docker.
systemctl daemon-reload
systemctl restart docker
-->

{{< /tab >}}
{{< tab name="CentOS/RHEL 7.4+" codelang="bash" >}}

# 从 CentOs 镜像仓库安装 Docker：
yum install -y docker

<!--
# Install Docker from CentOS/RHEL repository:
yum install -y docker
-->

# 或从 Docker 的 Centos 存储库安装 Docker CE 18.06：

<!--
# or install Docker CE 18.06 from Docker's CentOS repositories:
-->

## 安装软件依赖。
yum install yum-utils device-mapper-persistent-data lvm2

<!--
## Install prerequisites.
yum install yum-utils device-mapper-persistent-data lvm2
-->

## 添加 docker 镜像仓库。
m-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

<!--
## Add docker repository.
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo
-->

## 安装 docker。
yum update && yum install docker-ce-18.06.1.ce

<!--
## Install docker.
yum update && yum install docker-ce-18.06.1.ce
-->

## 创建 /etc/docker 目录。
mkdir /etc/docker

<!--
## Create /etc/docker directory.
mkdir /etc/docker
-->

# 设置守护进程。
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

<!--
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

# 重启 docker。
systemctl daemon-reload
systemctl restart docker

<!--
# Restart docker.
systemctl daemon-reload
systemctl restart docker
-->

{{< /tab >}}
{{< /tabs >}}

请参阅 [Docker 官方安装指南](https://docs.docker.com/engine/installation/)
获取更多信息。

<!--
Refer to the [official Docker installation guides](https://docs.docker.com/engine/installation/)
for more information.
-->

## CRI-O

本节包含将“CRI-O”安装为 CRI 运行时所需的步骤。

<!--
## CRI-O

This section contains the necessary steps to install `CRI-O` as CRI runtime.
-->

使用以下命令在系统上安装 CRI-O：

<!--
Use the following commands to install CRI-O on your system:
-->

### 软件依赖

```shell
modprobe overlay
modprobe br_netfilter

<!--
### Prerequisites

```shell
modprobe overlay
modprobe br_netfilter
-->

# 设置需要 sysctl 参数，这些参数在重新引导时仍然存在。
cat > /etc/sysctl.d/99-kubernetes-cri.conf <<EOF
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

sysctl --system
```

<!--
# Setup required sysctl params, these persist across reboots.
cat > /etc/sysctl.d/99-kubernetes-cri.conf <<EOF
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

sysctl --system
```
-->

{{< tabs name="tab-cri-cri-o-installation" >}}
{{< tab name="Ubuntu 16.04" codelang="bash" >}}

# 安装软件依赖
apt-get update
apt-get install software-properties-common

add-apt-repository ppa:projectatomic/ppa
apt-get update

<!--
# Install prerequisites
apt-get update
apt-get install software-properties-common

add-apt-repository ppa:projectatomic/ppa
apt-get update
-->

# 安装 CRI-O
apt-get install cri-o-1.11

<!--
# Install CRI-O
apt-get install cri-o-1.11
-->

{{< /tab >}}
{{< tab name="CentOS/RHEL 7.4+" codelang="bash" >}}

# 安装软件依赖
yum-config-manager --add-repo=https://cbs.centos.org/repos/paas7-crio-311-candidate/x86_64/os/

<!--
# Install prerequisites
yum-config-manager --add-repo=https://cbs.centos.org/repos/paas7-crio-311-candidate/x86_64/os/
-->

# 安装 CRI-O
apt-get install cri-o-1.11

<!--
# Install CRI-O
yum install --nogpgcheck cri-o
-->

{{< /tab >}}
{{< /tabs >}}

### 启动 CRI-O

```
systemctl start crio
```

<!--
### Start CRI-O

```
systemctl start crio
```
-->

请参阅 [CRI-O 安装指南](https://github.com/kubernets-sigs/cri-o# get -started)
的更多的信息。

<!--
Refer to the [CRI-O installation guide](https://github.com/kubernetes-sigs/cri-o#getting-started)
for more information.
-->

## 容器

<!--
## containerd
-->

本节包含使用“容器运行时”作为 CRI 运行时所需的步骤。

<!--
This section contains the necessary steps to use `containerd` as CRI runtime.
-->

使用以下命令在系统上安装容器：

<!--
Use the following commands to install Containerd on your system:
-->

### 软件依赖

```shell
modprobe overlay
modprobe br_netfilter

<!--
### Prerequisites

```shell
modprobe overlay
modprobe br_netfilter
-->

# 设置需要 sysctl 参数，这些参数在重新引导时仍然存在。
cat > /etc/sysctl.d/99-kubernetes-cri.conf <<EOF
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

sysctl --system
```

<!--
# Setup required sysctl params, these persist across reboots.
cat > /etc/sysctl.d/99-kubernetes-cri.conf <<EOF
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

sysctl --system
```
-->

{{< tabs name="tab-cri-containerd-installation" >}}
{{< tab name="Ubuntu 16.04+" codelang="bash" >}}

apt-get install -y libseccomp2

{{< /tab >}}
{{< tab name="CentOS/RHEL 7.4+" codelang="bash" >}}

yum install -y libseccomp

{{< /tab >}}
{{< /tabs >}}

<!--
apt-get install -y libseccomp2
yum install -y libseccomp
-->

### 安装容器运行时

<!--
### Install containerd
-->

[容器运行时版本](https://github.com/containerd/containerd/release)定期发布，下面的值被硬编码为编写本文时可用的最新版本。请查看更新的版本和哈希[此处](https://storage.googleapis.com/cri-containerd.release)。

<!--
[Containerd releases](https://github.com/containerd/containerd/releases) are published regularly, the values below are hardcoded to the latest version available at the time of writing. Please check for newer versions and hashes [here](https://storage.googleapis.com/cri-containerd-release).
-->

```shell
# Export required environment variables.
export CONTAINERD_VERSION="1.1.2"
export CONTAINERD_SHA256="d4ed54891e90a5d1a45e3e96464e2e8a4770cd380c21285ef5c9895c40549218"

<!--
```shell
# Export required environment variables.
export CONTAINERD_VERSION="1.1.2"
export CONTAINERD_SHA256="d4ed54891e90a5d1a45e3e96464e2e8a4770cd380c21285ef5c9895c40549218"
-->

# 下载容器 tar 包。
wget https://storage.googleapis.com/cri-containerd-release/cri-containerd-${CONTAINERD_VERSION}.linux-amd64.tar.gz

<!--
# Download containerd tar.
wget https://storage.googleapis.com/cri-containerd-release/cri-containerd-${CONTAINERD_VERSION}.linux-amd64.tar.gz
-->

# 哈希校验和检查。
echo "${CONTAINERD_SHA256} cri-containerd-${CONTAINERD_VERSION}.linux-amd64.tar.gz" | sha256sum --check -

<!--
# Check hash.
echo "${CONTAINERD_SHA256} cri-containerd-${CONTAINERD_VERSION}.linux-amd64.tar.gz" | sha256sum --check -
-->

# 解压缩。
tar --no-overwrite-dir -C / -xzf cri-containerd-${CONTAINERD_VERSION}.linux-amd64.tar.gz

<!--
# Unpack.
tar --no-overwrite-dir -C / -xzf cri-containerd-${CONTAINERD_VERSION}.linux-amd64.tar.gz
-->

# 启动容器。
systemctl start containerd
```

<!--
# Start containerd.
systemctl start containerd
```
-->

## 其他 CRI 运行时：rktlet 和 frakti

<!--
## Other CRI runtimes: rktlet and frakti
-->

参考 [Frakti 快速入门指南](https://github.com/kubernetes/frakti# QuickStart)和 [Rktlet 入门指南](https://github.com/kubernets-incubator/rktlet/blob/master/docs/getting-startedguide.md)获取更多信息。

{{% /capture %}}

<!--
Refer to the [Frakti QuickStart guide](https://github.com/kubernetes/frakti#quickstart) and [Rktlet Getting Started guide](https://github.com/kubernetes-incubator/rktlet/blob/master/docs/getting-started-guide.md) for more information.
-->
