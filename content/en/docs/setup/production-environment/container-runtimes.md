---
reviewers:
- vincepri
- bart0sh
title: Container runtimes
content_template: templates/concept
weight: 10
---
{{% capture overview %}}
{{< feature-state for_k8s_version="v1.6" state="stable" >}}
To run containers in Pods, Kubernetes uses a container runtime. Here are
the installation instructions for various runtimes.

{{% /capture %}}

{{% capture body %}}


{{< caution >}}
A flaw was found in the way runc handled system file descriptors when running containers.
A malicious container could use this flaw to overwrite contents of the runc binary and
consequently run arbitrary commands on the container host system.

Please refer to this link for more information about this issue
[cve-2019-5736 : runc vulnerability ] (https://access.redhat.com/security/cve/cve-2019-5736)
{{< /caution >}}

### Applicability

{{< note >}}
This document is written for users installing CRI onto Linux. For other operating
systems, look for documentation specific to your platform.
{{< /note >}}

You should execute all the commands in this guide as `root`. For example, prefix commands
with `sudo `, or become `root` and run the commands as that user.

### Cgroup drivers

When systemd is chosen as the init system for a Linux distribution, the init process generates
and consumes a root control group (`cgroup`) and acts as a cgroup manager. Systemd has a tight
integration with cgroups and will allocate cgroups per process. It's possible to configure your
container runtime and the kubelet to use `cgroupfs`. Using `cgroupfs` alongside systemd means
that there will be two different cgroup managers.

Control groups are used to constrain resources that are allocated to processes.
A single cgroup manager will simplify the view of what resources are being allocated
and will by default have a more consistent view of the available and in-use resources. When we have
two managers we end up with two views of those resources. We have seen cases in the field
where nodes that are configured to use `cgroupfs` for the kubelet and Docker, and `systemd`
for the rest of the processes running on the node becomes unstable under resource pressure.

Changing the settings such that your container runtime and kubelet use `systemd` as the cgroup driver
stabilized the system. Please note the `native.cgroupdriver=systemd` option in the Docker setup below.

{{< caution >}}
Changing the cgroup driver of a Node that has joined a cluster is highly unrecommended.
If the kubelet has created Pods using the semantics of one cgroup driver, changing the container
runtime to another cgroup driver can cause errors when trying to re-create the PodSandbox
for such existing Pods. Restarting the kubelet may not solve such errors. The recommendation
is to drain the Node from its workloads, remove it from the cluster and re-join it.
{{< /caution >}}

## Docker

On each of your machines, install Docker.
Version 19.03.8 is recommended, but 1.13.1, 17.03, 17.06, 17.09, 18.06 and 18.09 are known to work as well.
Keep track of the latest verified Docker version in the Kubernetes release notes.

Use the following commands to install Docker on your system:

{{< tabs name="tab-cri-docker-installation" >}}
{{< tab name="Ubuntu 16.04+" codelang="bash" >}}
# Install Docker CE
## Set up the repository:
### Install packages to allow apt to use a repository over HTTPS
apt-get update && apt-get install -y \
  apt-transport-https ca-certificates curl software-properties-common gnupg2

### Add Docker’s official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -

### Add Docker apt repository.
add-apt-repository \
  "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) \
  stable"

## Install Docker CE.
apt-get update && apt-get install -y \
  containerd.io=1.2.13-1 \
  docker-ce=5:19.03.8~3-0~ubuntu-$(lsb_release -cs) \
  docker-ce-cli=5:19.03.8~3-0~ubuntu-$(lsb_release -cs)

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

# Restart docker.
systemctl daemon-reload
systemctl restart docker
{{< /tab >}}
{{< tab name="CentOS/RHEL 7.4+" codelang="bash" >}}

# Install Docker CE
## Set up the repository
### Install required packages.
yum install -y yum-utils device-mapper-persistent-data lvm2

### Add Docker repository.
yum-config-manager --add-repo \
  https://download.docker.com/linux/centos/docker-ce.repo

## Install Docker CE.
yum update -y && yum install -y \
  containerd.io-1.2.13 \
  docker-ce-19.03.8 \
  docker-ce-cli-19.03.8

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

# Restart Docker
systemctl daemon-reload
systemctl restart docker
{{< /tab >}}
{{< /tabs >}}

Refer to the [official Docker installation guides](https://docs.docker.com/engine/installation/)
for more information.

## CRI-O

This section contains the necessary steps to install `CRI-O` as CRI runtime.

Use the following commands to install CRI-O on your system:

{{< note >}}
The CRI-O major and minor versions must match the Kubernetes major and minor versions.
For more information, see the [CRI-O compatiblity matrix](https://github.com/cri-o/cri-o).
{{< /note >}}

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

{{< tabs name="tab-cri-cri-o-installation" >}}
{{< tab name="Debian" codelang="bash" >}}
# Debian Unstable/Sid
echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/Debian_Unstable/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/Debian_Unstable/Release.key -O- | sudo apt-key add -

# Debian Testing
echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/Debian_Testing/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/Debian_Testing/Release.key -O- | sudo apt-key add -

# Debian 10
echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/Debian_10/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/Debian_10/Release.key -O- | sudo apt-key add -

# Raspbian 10
echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/Raspbian_10/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/Raspbian_10/Release.key -O- | sudo apt-key add -

# Install CRI-O
sudo apt-get install cri-o-1.17
{{< /tab >}}

{{< tab name="Ubuntu 18.04, 19.04 and 19.10" codelang="bash" >}}
# Setup repository
. /etc/os-release
sudo sh -c "echo 'deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/x${NAME}_${VERSION_ID}/ /' > /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list"
wget -nv https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable/x${NAME}_${VERSION_ID}/Release.key -O- | sudo apt-key add -
sudo apt-get update

# Install CRI-O
sudo apt-get install cri-o-1.17
{{< /tab >}}

{{< tab name="CentOS/RHEL 7.4+" codelang="bash" >}}
# Install prerequisites
yum-config-manager --add-repo=https://cbs.centos.org/repos/paas7-crio-115-release/x86_64/os/

# Install CRI-O
yum install --nogpgcheck -y cri-o
{{< /tab >}}

{{< tab name="openSUSE Tumbleweed" codelang="bash" >}}
sudo zypper install cri-o
{{< /tab >}}
{{< /tabs >}}

### Start CRI-O

```
systemctl daemon-reload
systemctl start crio
```

Refer to the [CRI-O installation guide](https://github.com/kubernetes-sigs/cri-o#getting-started)
for more information.

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

### Install containerd

{{< tabs name="tab-cri-containerd-installation" >}}
{{< tab name="Ubuntu 16.04" codelang="bash" >}}
# Install containerd
## Set up the repository
### Install packages to allow apt to use a repository over HTTPS
apt-get update && apt-get install -y apt-transport-https ca-certificates curl software-properties-common

### Add Docker’s official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -

### Add Docker apt repository.
add-apt-repository \
    "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) \
    stable"

## Install containerd
apt-get update && apt-get install -y containerd.io

# Configure containerd
mkdir -p /etc/containerd
containerd config default > /etc/containerd/config.toml

# Restart containerd
systemctl restart containerd
{{< /tab >}}
{{< tab name="CentOS/RHEL 7.4+" codelang="bash" >}}
# Install containerd
## Set up the repository
### Install required packages
yum install -y yum-utils device-mapper-persistent-data lvm2

### Add docker repository
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

## Install containerd
yum update -y && yum install -y containerd.io

# Configure containerd
mkdir -p /etc/containerd
containerd config default > /etc/containerd/config.toml

# Restart containerd
systemctl restart containerd
{{< /tab >}}
{{< /tabs >}}

### systemd

To use the `systemd` cgroup driver, set `plugins.cri.systemd_cgroup = true` in `/etc/containerd/config.toml`.
When using kubeadm, manually configure the
[cgroup driver for kubelet](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#configure-cgroup-driver-used-by-kubelet-on-control-plane-node)

## Other CRI runtimes: frakti

Refer to the [Frakti QuickStart guide](https://github.com/kubernetes/frakti#quickstart) for more information.

{{% /capture %}}
