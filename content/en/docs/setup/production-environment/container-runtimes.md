---
reviewers:
- vincepri
- bart0sh
title: Container runtimes
content_type: concept
weight: 20
---
<!-- overview -->

You need to install a
{{< glossary_tooltip text="container runtime" term_id="container-runtime" >}}
into each node in the cluster so that Pods can run there. This page outlines
what is involved and describes related tasks for setting up nodes.

<!-- body -->

This page lists details for using several common container runtimes with
Kubernetes, on Linux:

- [containerd](#containerd)
- [CRI-O](#cri-o)
- [Docker](#docker)

{{< note >}}
For other operating systems, look for documentation specific to your platform.
{{< /note >}}

## Cgroup drivers

Control groups are used to constrain resources that are allocated to processes.

When [systemd](https://www.freedesktop.org/wiki/Software/systemd/) is chosen as the init
system for a Linux distribution, the init process generates and consumes a root control group
(`cgroup`) and acts as a cgroup manager.
Systemd has a tight integration with cgroups and allocates a cgroup per systemd unit. It's possible
to configure your container runtime and the kubelet to use `cgroupfs`. Using `cgroupfs` alongside
systemd means that there will be two different cgroup managers.

A single cgroup manager simplifies the view of what resources are being allocated
and will by default have a more consistent view of the available and in-use resources.
When there are two cgroup managers on a system, you end up with two views of those resources.
In the field, people have reported cases where nodes that are configured to use `cgroupfs`
for the kubelet and Docker, but `systemd` for the rest of the processes, become unstable under
resource pressure.

Changing the settings such that your container runtime and kubelet use `systemd` as the cgroup driver
stabilized the system. To configure this for Docker, set `native.cgroupdriver=systemd`.

{{< caution >}}
Changing the cgroup driver of a Node that has joined a cluster is a sensitive operation.
If the kubelet has created Pods using the semantics of one cgroup driver, changing the container
runtime to another cgroup driver can cause errors when trying to re-create the Pod sandbox
for such existing Pods. Restarting the kubelet may not solve such errors.

If you have automation that makes it feasible, replace the node with another using the updated
configuration, or reinstall it using automation.
{{< /caution >}}

### Migrating to the `systemd` driver in kubeadm managed clusters

Follow this [Migration guide](/tasks/administer-cluster/kubeadm/configure-cgroup-driver)
if you wish to migrate to the `systemd` cgroup driver in existing kubeadm managed clusters.

## Container runtimes

{{% thirdparty-content %}}

### containerd

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

Install containerd:

{{< tabs name="tab-cri-containerd-installation" >}}
{{% tab name="Ubuntu 16.04" %}}

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
{{% /tab %}}
{{% tab name="Ubuntu 18.04/20.04" %}}

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
{{% /tab %}}
{{% tab name="Debian 9+" %}}

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
{{% /tab %}}
{{% tab name="CentOS/RHEL 7.4+" %}}

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
{{% /tab %}}
{{% tab name="Windows (PowerShell)" %}}
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
{{% /tab %}}
{{< /tabs >}}

#### systemd {#containerd-systemd}

To use the `systemd` cgroup driver in `/etc/containerd/config.toml` with `runc`, set

```
[plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc]
  ...
  [plugins."io.containerd.grpc.v1.cri".containerd.runtimes.runc.options]
    SystemdCgroup = true
```

When using kubeadm, manually configure the
[cgroup driver for kubelet](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#configure-cgroup-driver-used-by-kubelet-on-control-plane-node).

### CRI-O

This section contains the necessary steps to install CRI-O as a container runtime.

Use the following commands to install CRI-O on your system:

{{< note >}}
The CRI-O major and minor versions must match the Kubernetes major and minor versions.
For more information, see the [CRI-O compatibility matrix](https://github.com/cri-o/cri-o#compatibility-matrix-cri-o--kubernetes).
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

{{< tabs name="tab-cri-cri-o-installation" >}}
{{% tab name="Debian" %}}

To install CRI-O on the following operating systems, set the environment variable `OS`
to the appropriate value from the following table:

| Operating system | `$OS`             |
| ---------------- | ----------------- |
| Debian Unstable  | `Debian_Unstable` |
| Debian Testing   | `Debian_Testing`  |

<br />
Then, set `$VERSION` to the CRI-O version that matches your Kubernetes version.
For instance, if you want to install CRI-O 1.20, set `VERSION=1.20`.
You can pin your installation to a specific release.
To install version 1.20.0, set `VERSION=1.20:1.20.0`.
<br />

Then run
```shell
cat <<EOF | sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
deb https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/ /
EOF
cat <<EOF | sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable:cri-o:$VERSION.list
deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable:/cri-o:/$VERSION/$OS/ /
EOF

curl -L https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable:cri-o:$VERSION/$OS/Release.key | sudo apt-key --keyring /etc/apt/trusted.gpg.d/libcontainers.gpg add -
curl -L https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/Release.key | sudo apt-key --keyring /etc/apt/trusted.gpg.d/libcontainers.gpg add -

sudo apt-get update
sudo apt-get install cri-o cri-o-runc
```

{{% /tab %}}

{{% tab name="Ubuntu" %}}

To install on the following operating systems, set the environment variable `OS` to the appropriate field in the following table:

| Operating system | `$OS`             |
| ---------------- | ----------------- |
| Ubuntu 20.04     | `xUbuntu_20.04`   |
| Ubuntu 19.10     | `xUbuntu_19.10`   |
| Ubuntu 19.04     | `xUbuntu_19.04`   |
| Ubuntu 18.04     | `xUbuntu_18.04`   |

<br />
Then, set `$VERSION` to the CRI-O version that matches your Kubernetes version.
For instance, if you want to install CRI-O 1.20, set `VERSION=1.20`.
You can pin your installation to a specific release.
To install version 1.20.0, set `VERSION=1.20:1.20.0`.
<br />

Then run
```shell
cat <<EOF | sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable.list
deb https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/ /
EOF
cat <<EOF | sudo tee /etc/apt/sources.list.d/devel:kubic:libcontainers:stable:cri-o:$VERSION.list
deb http://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable:/cri-o:/$VERSION/$OS/ /
EOF

curl -L https://download.opensuse.org/repositories/devel:/kubic:/libcontainers:/stable/$OS/Release.key | sudo apt-key --keyring /etc/apt/trusted.gpg.d/libcontainers.gpg add -
curl -L https://download.opensuse.org/repositories/devel:kubic:libcontainers:stable:cri-o:$VERSION/$OS/Release.key | sudo apt-key --keyring /etc/apt/trusted.gpg.d/libcontainers-cri-o.gpg add -

sudo apt-get update
sudo apt-get install cri-o cri-o-runc
```
{{% /tab %}}

{{% tab name="CentOS" %}}

To install on the following operating systems, set the environment variable `OS` to the appropriate field in the following table:

| Operating system | `$OS`             |
| ---------------- | ----------------- |
| Centos 8         | `CentOS_8`        |
| Centos 8 Stream  | `CentOS_8_Stream` |
| Centos 7         | `CentOS_7`        |

<br />
Then, set `$VERSION` to the CRI-O version that matches your Kubernetes version.
For instance, if you want to install CRI-O 1.20, set `VERSION=1.20`.
You can pin your installation to a specific release.
To install version 1.20.0, set `VERSION=1.20:1.20.0`.
<br />

Then run
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

Set `$VERSION` to the CRI-O version that matches your Kubernetes version.
For instance, if you want to install CRI-O 1.20, `VERSION=1.20`.

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

{{% /tab %}}
{{< /tabs >}}

Start CRI-O:

```shell
sudo systemctl daemon-reload
sudo systemctl enable crio --now
```

Refer to the [CRI-O installation guide](https://github.com/cri-o/cri-o/blob/master/install.md)
for more information.


#### cgroup driver

CRI-O uses the systemd cgroup driver per default. To switch to the `cgroupfs`
cgroup driver, either edit `/etc/crio/crio.conf` or place a drop-in
configuration in `/etc/crio/crio.conf.d/02-cgroup-manager.conf`, for example:

```toml
[crio.runtime]
conmon_cgroup = "pod"
cgroup_manager = "cgroupfs"
```

Please also note the changed `conmon_cgroup`, which has to be set to the value
`pod` when using CRI-O with `cgroupfs`. It is generally necessary to keep the
cgroup driver configuration of the kubelet (usually done via kubeadm) and CRI-O
in sync.

### Docker

On each of your nodes, install Docker CE.

The Kubernetes release notes list which versions of Docker are compatible
with that version of Kubernetes.

Use the following commands to install Docker on your system:

{{< tabs name="tab-cri-docker-installation" >}}
{{% tab name="Ubuntu 16.04+" %}}

```shell
# (Install Docker CE)
## Set up the repository:
### Install packages to allow apt to use a repository over HTTPS
sudo apt-get update && sudo apt-get install -y \
  apt-transport-https ca-certificates curl software-properties-common gnupg2
```

```shell
# Add Docker's official GPG key:
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key --keyring /etc/apt/trusted.gpg.d/docker.gpg add -
```

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
  "storage-driver": "overlay2"
}
EOF
```

```shell
# Create /etc/systemd/system/docker.service.d
sudo mkdir -p /etc/systemd/system/docker.service.d
```

```shell
# Restart Docker
sudo systemctl daemon-reload
sudo systemctl restart docker
```
{{% /tab %}}
{{% tab name="CentOS/RHEL 7.4+" %}}

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

```shell
# Restart Docker
sudo systemctl daemon-reload
sudo systemctl restart docker
```
{{% /tab %}}
{{< /tabs >}}

If you want the `docker` service to start on boot, run the following command:

```shell
sudo systemctl enable docker
```

Refer to the [official Docker installation guides](https://docs.docker.com/engine/installation/)
for more information.
