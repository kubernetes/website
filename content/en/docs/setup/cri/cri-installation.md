---
reviewers:
- vincepri
title: CRI installation
content_template: templates/concept
weight: 100
---
{{% capture overview %}}
Since v1.6.0, Kubernetes has enabled the use of CRI, Container Runtime Interface, by default.
This page contains installation instruction for various runtimes.

{{% /capture %}}

{{% capture body %}}

### Containerd

This section contains the necessary steps to use `containerd` as CRI with kubeadm.

#### Prerequisites

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

{{< tabs name="tab-cri-containerd-installation" >}}
{{< tab name="Ubuntu 16.04+" codelang="bash" >}}
apt-get install -y libseccomp2
{{< /tab >}}
{{< tab name="CentOS/RHEL 7.4+" codelang="bash" >}}
yum install -y libseccomp
{{< /tab >}}
{{< /tabs >}}

#### Install containerd

[Containerd releases](https://github.com/containerd/containerd/releases) are published regularly, the values below are hardcoded to the latest version available at the time of writing. Please check for newer versions and hashes [here](https://storage.googleapis.com/cri-containerd-release).
 
```shell
# Export required environment variables.
export CONTAINERD_VERSION="1.1.2"
export CONTAINERD_SHA256="d4ed54891e90a5d1a45e3e96464e2e8a4770cd380c21285ef5c9895c40549218"

# Download containerd tar.
wget https://storage.googleapis.com/cri-containerd-release/cri-containerd-${CONTAINERD_VERSION}.linux-amd64.tar.gz

# Check hash.
echo "${CONTAINERD_SHA256} cri-containerd-${CONTAINERD_VERSION}.linux-amd64.tar.gz" | sha256sum --check -

# Unpack.
tar --no-overwrite-dir -C / -xzf cri-containerd-${CONTAINERD_VERSION}.linux-amd64.tar.gz

# Start containerd.
systemctl start containerd
```

### Docker

{{< tabs name="tab-cri-docker-installation" >}}
{{< tab name="Ubuntu 16.04" codelang="bash" >}}
# Install prerequisites.
apt-get install apt-transport-https ca-certificates curl software-properties-common

# Download GPG key.
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -

# Add docker apt repository. 
add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

# Install docker.
apt-get update && apt-get install docker-ce=17.03.2~ce-0~ubuntu-xenial

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
# Install prerequisites.
yum install yum-utils device-mapper-persistent-data lvm2

# Add docker repository. 
yum-config-manager \
    --add-repo \
    https://download.docker.com/linux/centos/docker-ce.repo

# Install docker.
apt-get update && yum install docker-ce-17.03.2.ce

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

# Restart docker.
systemctl daemon-reload
systemctl restart docker
{{< /tab >}}
{{< /tabs >}}


{{% /capture %}}