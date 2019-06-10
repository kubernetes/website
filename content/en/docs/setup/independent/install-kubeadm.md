---
title: Installing kubeadm
content_template: templates/task
weight: 20
card:
  name: setup
  weight: 20
  title: Install the kubeadm setup tool
---

{{% capture overview %}}

<img src="https://raw.githubusercontent.com/cncf/artwork/master/projects/kubernetes/certified-kubernetes/versionless/color/certified-kubernetes-color.png" align="right" width="150px">This page shows how to install the `kubeadm` toolbox.
For information how to create a cluster with kubeadm once you have performed this installation process,
see the [Using kubeadm to Create a Cluster](/docs/setup/independent/create-cluster-kubeadm/) page.

{{% /capture %}}

{{% capture prerequisites %}}

* One or more machines running one of:
  - Ubuntu 16.04+
  - Debian 9
  - CentOS 7
  - RHEL 7
  - Fedora 25/26 (best-effort)
  - HypriotOS v1.0.1+
  - Container Linux (tested with 1800.6.0)
* 2 GB or more of RAM per machine (any less will leave little room for your apps)
* 2 CPUs or more
* Full network connectivity between all machines in the cluster (public or private network is fine)
* Unique hostname, MAC address, and product_uuid for every node. See [here](#verify-the-mac-address-and-product-uuid-are-unique-for-every-node) for more details.
* Certain ports are open on your machines. See [here](#check-required-ports) for more details.
* Swap disabled. You **MUST** disable swap in order for the kubelet to work properly.

{{% /capture %}}

{{% capture steps %}}

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

| Protocol | Direction | Port Range | Purpose                 | Used By                   |
|----------|-----------|------------|-------------------------|---------------------------|
| TCP      | Inbound   | 6443*      | Kubernetes API server   | All                       |
| TCP      | Inbound   | 2379-2380  | etcd server client API  | kube-apiserver, etcd      |
| TCP      | Inbound   | 10250      | Kubelet API             | Self, Control plane       |
| TCP      | Inbound   | 10251      | kube-scheduler          | Self                      |
| TCP      | Inbound   | 10252      | kube-controller-manager | Self                      |

### Worker node(s)

| Protocol | Direction | Port Range  | Purpose               | Used By                 |
|----------|-----------|-------------|-----------------------|-------------------------|
| TCP      | Inbound   | 10250       | Kubelet API           | Self, Control plane     |
| TCP      | Inbound   | 30000-32767 | NodePort Services**   | All                     |

** Default port range for [NodePort Services](/docs/concepts/services-networking/service/).

Any port numbers marked with * are overridable, so you will need to ensure any
custom ports you provide are also open.

Although etcd ports are included in master nodes, you can also host your own
etcd cluster externally or on custom ports.

The pod network plugin you use (see below) may also require certain ports to be
open. Since this differs with each pod network plugin, please see the
documentation for the plugins about what port(s) those need.

## Installing runtime {#installing-runtime}

Since v1.6.0, Kubernetes has enabled the use of CRI, Container Runtime Interface, by default.

Since v1.14.0, kubeadm will try to automatically detect the container runtime on Linux nodes
by scanning through a list of well known domain sockets. The detectable runtimes and the
socket paths, that are used, can be found in the table below.

| Runtime    | Domain Socket                    |
|------------|----------------------------------|
| Docker     | /var/run/docker.sock             |
| containerd | /run/containerd/containerd.sock  |
| CRI-O      | /var/run/crio/crio.sock          |

If both Docker and containerd are detected together, Docker takes precedence. This is
needed, because Docker 18.09 ships with containerd and both are detectable.
If any other two or more runtimes are detected, kubeadm will exit with an appropriate
error message.

On non-Linux nodes the container runtime used by default is Docker.

If the container runtime of choice is Docker, it is used through the built-in
`dockershim` CRI implementation inside of the `kubelet`.

Other CRI-based runtimes include:

- [containerd](https://github.com/containerd/cri) (CRI plugin built into containerd)
- [cri-o](https://github.com/kubernetes-incubator/cri-o)
- [frakti](https://github.com/kubernetes/frakti)

Refer to the [CRI installation instructions](/docs/setup/cri) for more information.

## Installing kubeadm, kubelet and kubectl

You will install these packages on all of your machines:

* `kubeadm`: the command to bootstrap the cluster.

* `kubelet`: the component that runs on all of the machines in your cluster
    and does things like starting pods and containers.

* `kubectl`: the command line util to talk to your cluster.

kubeadm **will not** install or manage `kubelet` or `kubectl` for you, so you will
need to ensure they match the version of the Kubernetes control plane you want
kubeadm to install for you. If you do not, there is a risk of a version skew occurring that
can lead to unexpected, buggy behaviour. However, _one_ minor version skew between the
kubelet and the control plane is supported, but the kubelet version may never exceed the API
server version. For example, kubelets running 1.7.0 should be fully compatible with a 1.8.0 API server,
but not vice versa.

{{< warning >}}
These instructions exclude all Kubernetes packages from any system upgrades.
This is because kubeadm and Kubernetes require
[special attention to upgrade](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-1-14/).
{{</ warning >}}

For more information on version skews, see:

* Kubernetes [version and version-skew policy](/docs/setup/version-skew-policy/)
* Kubeadm-specific [version skew policy](/docs/setup/independent/create-cluster-kubeadm/#version-skew-policy)

{{< tabs name="k8s_install" >}}
{{% tab name="Ubuntu, Debian or HypriotOS" %}}
```bash
apt-get update && apt-get install -y apt-transport-https curl
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
deb https://apt.kubernetes.io/ kubernetes-xenial main
EOF
apt-get update
apt-get install -y kubelet kubeadm kubectl
apt-mark hold kubelet kubeadm kubectl
```
{{% /tab %}}
{{% tab name="CentOS, RHEL or Fedora" %}}
```bash
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
exclude=kube*
EOF

# Set SELinux in permissive mode (effectively disabling it)
setenforce 0
sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config

yum install -y kubelet kubeadm kubectl --disableexcludes=kubernetes

systemctl enable --now kubelet
```

  **Note:**

  - Setting SELinux in permissive mode by running `setenforce 0` and `sed ...` effectively disables it.
    This is required to allow containers to access the host filesystem, which is needed by pod networks for example.
    You have to do this until SELinux support is improved in the kubelet.
  - Some users on RHEL/CentOS 7 have reported issues with traffic being routed incorrectly due to iptables being bypassed. You should ensure
    `net.bridge.bridge-nf-call-iptables` is set to 1 in your `sysctl` config, e.g.

    ```bash
    cat <<EOF >  /etc/sysctl.d/k8s.conf
    net.bridge.bridge-nf-call-ip6tables = 1
    net.bridge.bridge-nf-call-iptables = 1
    EOF
    sysctl --system
    ```
  - Make sure that the `br_netfilter` module is loaded before this step. This can be done by running `lsmod | grep br_netfilter`. To load it explicitly call `modprobe br_netfilter`.
{{% /tab %}}
{{% tab name="Container Linux" %}}
Install CNI plugins (required for most pod network):

```bash
CNI_VERSION="v0.6.0"
mkdir -p /opt/cni/bin
curl -L "https://github.com/containernetworking/plugins/releases/download/${CNI_VERSION}/cni-plugins-amd64-${CNI_VERSION}.tgz" | tar -C /opt/cni/bin -xz
```

Install crictl (required for kubeadm / Kubelet Container Runtime Interface (CRI))

```bash
CRICTL_VERSION="v1.11.1"
mkdir -p /opt/bin
curl -L "https://github.com/kubernetes-incubator/cri-tools/releases/download/${CRICTL_VERSION}/crictl-${CRICTL_VERSION}-linux-amd64.tar.gz" | tar -C /opt/bin -xz
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
systemctl enable --now kubelet
```
{{% /tab %}}
{{< /tabs >}}


The kubelet is now restarting every few seconds, as it waits in a crashloop for
kubeadm to tell it what to do.

## Configure cgroup driver used by kubelet on Master Node

When using Docker, kubeadm will automatically detect the cgroup driver for the kubelet
and set it in the `/var/lib/kubelet/kubeadm-flags.env` file during runtime.

If you are using a different CRI, you have to modify the file
`/etc/default/kubelet` with your `cgroup-driver` value, like so:

```bash
KUBELET_EXTRA_ARGS=--cgroup-driver=<value>
```

This file will be used by `kubeadm init` and `kubeadm join` to source extra
user defined arguments for the kubelet.

Please mind, that you **only** have to do that if the cgroup driver of your CRI
is not `cgroupfs`, because that is the default value in the kubelet already.

Restarting the kubelet is required:

```bash
systemctl daemon-reload
systemctl restart kubelet
```

## Troubleshooting

If you are running into difficulties with kubeadm, please consult our [troubleshooting docs](/docs/setup/independent/troubleshooting-kubeadm/).

{{% capture whatsnext %}}

* [Using kubeadm to Create a Cluster](/docs/setup/independent/create-cluster-kubeadm/)

{{% /capture %}}
