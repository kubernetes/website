---
title: Installing kubeadm
---

{% capture overview %}

<img src="https://raw.githubusercontent.com/cncf/artwork/master/kubernetes/certified-kubernetes/versionless/color/certified-kubernetes-color.png" align="right" width="150px">This page shows how to install the `kubeadm` toolbox.
For information how to create a cluster with kubeadm once you have performed this installation process,
see the [Using kubeadm to Create a Cluster](/docs/setup/independent/create-cluster-kubeadm/) page.

{% endcapture %}

{% capture prerequisites %}

* One or more machines running one of:
  - Ubuntu 16.04+
  - Debian 9
  - CentOS 7
  - RHEL 7
  - Fedora 25/26 (best-effort)
  - HypriotOS v1.0.1+
  - Container Linux (tested with 1576.4.0)
* 2 GB or more of RAM per machine (any less will leave little room for your apps)
* 2 CPUs or more 
* Full network connectivity between all machines in the cluster (public or private network is fine)
* Unique hostname, MAC address, and product_uuid for every node. See [here](https://kubernetes.io/docs/setup/independent/install-kubeadm/#verify-the-mac-address-and-product_uuid-are-unique-for-every-node) for more details.
* Certain ports are open on your machines. See [here](/docs/setup/independent/install-kubeadm/#check-required-ports) for more details.
* Swap disabled. You **MUST** disable swap in order for the kubelet to work properly. 

{% endcapture %}

{% capture steps %}

## Verify the MAC address and product_uuid are unique for every node

* You can get the MAC address of the network interfaces using the command `ip link` or `ifconfig -a`
* The product_uuid can be checked by using the command `sudo cat /sys/class/dmi/id/product_uuid`

It is very likely that hardware devices will have unique addresses, although some virtual machines may have
identical values. Kubernetes uses these values to uniquely identify the nodes in the cluster.
If these values are not unique to each node, the installation process
may [fail](https://github.com/kubernetes/kubeadm/issues/31).

## Check network adapters

If you have more than one network adapter, and your Kubernetes components are not reachable on the default
route, we recommend you add IP route(s) so Kubernetes cluster addresses go via the appropriate adapter.

## Check required ports

### Master node(s)

| Protocol | Direction | Port Range | Purpose                 |
|----------|-----------|------------|-------------------------|
| TCP      | Inbound   | 6443*      | Kubernetes API server   |
| TCP      | Inbound   | 2379-2380  | etcd server client API  |
| TCP      | Inbound   | 10250      | Kubelet API             |
| TCP      | Inbound   | 10251      | kube-scheduler          |
| TCP      | Inbound   | 10252      | kube-controller-manager |
| TCP      | Inbound   | 10255      | Read-only Kubelet API   |

### Worker node(s)

| Protocol | Direction | Port Range  | Purpose               |
|----------|-----------|-------------|-----------------------|
| TCP      | Inbound   | 10250       | Kubelet API           |
| TCP      | Inbound   | 10255       | Read-only Kubelet API |
| TCP      | Inbound   | 30000-32767 | NodePort Services**   |

** Default port range for [NodePort Services](/docs/concepts/services-networking/service/).

Any port numbers marked with * are overridable, so you will need to ensure any
custom ports you provide are also open.

Although etcd ports are included in master nodes, you can also host your own
etcd cluster externally or on custom ports.

The pod network plugin you use (see below) may also require certain ports to be
open. Since this differs with each pod network plugin, please see the
documentation for the plugins about what port(s) those need.

## Installing Docker

On each of your machines, install Docker.
Version v1.12 is recommended, but v1.11, v1.13 and 17.03 are known to work as well.
Versions 17.06+ _might work_, but have not yet been tested and verified by the Kubernetes node team.

Please proceed with executing the following commands based on your OS as root. You may become the root user by executing `sudo -i` after SSH-ing to each host.

If you already have the required versions of the Docker installed, you can move on to next section.
If not, you can use the following commands to install Docker on your system:

{% capture docker_ubuntu %}

Install Docker from Ubuntu's repositories:

```bash
apt-get update
apt-get install -y docker.io
```

or install Docker CE 17.03 from Docker's repositories for Ubuntu or Debian:

```bash
apt-get update
apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
add-apt-repository \
   "deb https://download.docker.com/linux/$(. /etc/os-release; echo "$ID") \
   $(lsb_release -cs) \
   stable"
apt-get update && apt-get install -y docker-ce=$(apt-cache madison docker-ce | grep 17.03 | head -1 | awk '{print $3}')
```

{% endcapture %}

{% capture docker_centos %}

Install Docker using your operating system's bundled package:

```bash
yum install -y docker
systemctl enable docker && systemctl start docker
```

{% endcapture %}

{% capture docker_coreos %}

Enable and start Docker:

```bash
systemctl enable docker && systemctl start docker
```

{% endcapture %}

{% assign tab_set_name = "docker_install" %}
{% assign tab_names = "Ubuntu, Debian or HypriotOS;CentOS, RHEL or Fedora; Container Linux" | split: ';' | compact %}
{% assign tab_contents = site.emptyArray | push: docker_ubuntu | push: docker_centos | push: docker_coreos %}

{% include tabs.md %}

Refer to the [official Docker installation guides](https://docs.docker.com/engine/installation/)
for more information.

## Installing kubeadm, kubelet and kubectl

You will install these packages on all of your machines:

* `kubeadm`: the command to bootstrap the cluster.

* `kubelet`: the component that runs on all of the machines in your cluster
    and does things like starting pods and containers.

* `kubectl`: the command line util to talk to your cluster.

kubeadm **will not** install or manage `kubelet` or `kubectl` for you, so you will 
need to ensure they match the version of the Kubernetes control panel you want 
kubeadm to install for you. If you do not, there is a risk of a version skew occurring that
can lead to unexpected, buggy behaviour. However, _one_ minor version skew between the 
kubelet and the control plane is supported, but the kubelet version may never exceed the API
server version. For example, kubelets running 1.7.0 should be fully compatible with a 1.8.0 API server,
but not vice versa.

For more information on version skews, please read our 
[version skew policy](/docs/setup/independent/create-cluster-kubeadm/#version-skew-policy).

{% capture ubuntu %}

```bash
apt-get update && apt-get install -y apt-transport-https
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb http://apt.kubernetes.io/ kubernetes-xenial main
EOF
apt-get update
apt-get install -y kubelet kubeadm kubectl
```

{% endcapture %}

{% capture centos %}

```bash
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-\$basearch
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
setenforce 0
yum install -y kubelet kubeadm kubectl
systemctl enable kubelet && systemctl start kubelet
```

  **Note:**

  - Disabling SELinux by running `setenforce 0` is required to allow containers to access the host filesystem, which is required by pod networks for example.
    You have to do this until SELinux support is improved in the kubelet.
  - Some users on RHEL/CentOS 7 have reported issues with traffic being routed incorrectly due to iptables being bypassed. You should ensure
    `net.bridge.bridge-nf-call-iptables` is set to 1 in your `sysctl` config, e.g.
  
    ``` bash
    cat <<EOF >  /etc/sysctl.d/k8s.conf
    net.bridge.bridge-nf-call-ip6tables = 1
    net.bridge.bridge-nf-call-iptables = 1
    EOF
    sysctl --system
    ```

{% endcapture %}

{% capture coreos %}

Install CNI plugins (required for most pod network):

```bash
CNI_VERSION="v0.6.0"
mkdir -p /opt/cni/bin
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_VERSION}/cni-plugins-amd64-${CNI_VERSION}.tgz" | tar -C /opt/cni/bin -xz
```

Install `kubeadm`, `kubelet`, `kubectl` and add a `kubelet` systemd service:

```bash
RELEASE="$(curl -sSL https://dl.k8s.io/release/stable.txt)"

mkdir -p /opt/bin
cd /opt/bin
curl -L --remote-name-all https://storage.googleapis.com/kubernetes-release/release/${RELEASE}/bin/linux/amd64/{kubeadm,kubelet,kubectl}
chmod +x {kubeadm,kubelet,kubectl}

curl -sSL "https://raw.githubusercontent.com/kubernetes/kubernetes/${RELEASE}/build/debs/kubelet.service" | sed "s:/usr/bin:/opt/bin:g" > /etc/systemd/system/kubelet.service
mkdir -p /etc/systemd/system/kubelet.service.d
curl -sSL "https://raw.githubusercontent.com/kubernetes/kubernetes/${RELEASE}/build/debs/10-kubeadm.conf" | sed "s:/usr/bin:/opt/bin:g" > /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
```

Enable and start `kubelet`:

```bash
systemctl enable kubelet && systemctl start kubelet
```

{% endcapture %}

{% assign tab_set_name = "k8s_install" %}
{% assign tab_names = "Ubuntu, Debian or HypriotOS;CentOS, RHEL or Fedora;Container Linux" | split: ';' | compact %}
{% assign tab_contents = site.emptyArray | push: ubuntu | push: centos | push: coreos %}

{% include tabs.md %}

The kubelet is now restarting every few seconds, as it waits in a crashloop for
kubeadm to tell it what to do.

## Configure cgroup driver used by kubelet on Master Node

Make sure that the cgroup driver used by kubelet is the same as the one used by Docker. Verify that your Docker cgroup driver matches the kubelet config:

```bash
docker info | grep -i cgroup
cat /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
```

If the Docker cgroup driver and the kubelet config don't match, change the kubelet config to match the Docker cgroup driver. The
flag you need to change is `--cgroup-driver`. If it's already set, you can update like so:

```bash
sed -i "s/cgroup-driver=systemd/cgroup-driver=cgroupfs/g" /etc/systemd/system/kubelet.service.d/10-kubeadm.conf
```

Otherwise, you will need to open the systemd file and add the flag to an existing environment line.

Then restart kubelet:

```bash
systemctl daemon-reload
systemctl restart kubelet
```

## Troubleshooting

If you are running into difficulties with kubeadm, please consult our [troubleshooting docs](/docs/setup/independent/troubleshooting-kubeadm/).

{% capture whatsnext %}

* [Using kubeadm to Create a Cluster](/docs/setup/independent/create-cluster-kubeadm/)

{% endcapture %}

{% endcapture %}

{% include templates/task.md %}
