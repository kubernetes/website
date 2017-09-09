---
title: Installing kubeadm
---

{% capture overview %}

This page shows how to use install kubeadm.

{% endcapture %}

{% capture prerequisites %}

* One or more machines running Ubuntu 16.04+, Debian 9, CentOS 7, RHEL 7, Fedora 25/26 (best-effort) or HypriotOS v1.0.1+
* 1GB or more of RAM per machine (any less will leave little room for your apps)
* Full network connectivity between all machines in the cluster (public or private network is fine)
* Unique MAC address and product_uuid for every node
* Certain ports are open on your machines. See the section below for more details
* Swap disabled. You must disable swap in order for the kubelet to work properly.
* Set `/proc/sys/net/bridge/bridge-nf-call-iptables` to `1` by running `sysctl net.bridge.bridge-nf-call-iptables=1`
to pass bridged IPv4 traffic to iptables' chains. This is a requirement for CNI plugins to work, for more information
please see [here](https://kubernetes.io/docs/concepts/cluster-administration/network-plugins/#network-plugin-requirements).

{% endcapture %}

{% capture steps %}

## Verify the MAC address and product_uuid are unique for every node

* You can get the MAC address of the network interfaces using the command `ip link` or `ifconfig -a`
* The product_uuid can be checked by using the command `sudo cat /sys/class/dmi/id/product_uuid`

It is very likely that hardware devices will have unique addresses, although some virtual machines may have
identical values. Kubernetes uses these values to uniquely identify the nodes in the cluster.
If these values are not unique to each node, the installation processes
[can fail](https://github.com/kubernetes/kubeadm/issues/31).

## Check required ports

### Master node(s)

| Port Range | Purpose                         |
|------------|---------------------------------|
| 6443*      | Kubernetes API server           |
| 2379-2380  | etcd server client API          |
| 10250      | Kubelet API                     |
| 10251      | kube-scheduler                  |
| 10252      | kube-controller-manager         |
| 10255      | Read-only Kubelet API (Heapster)|

### Worker node(s)

| Port Range  | Purpose                         |
|-------------|---------------------------------|
| 10250       | Kubelet API                     |
| 10255       | Read-only Kubelet API (Heapster)|
| 30000-32767 | Default port range for [NodePort Services](/docs/concepts/services-networking/service/). Typically, these ports would need to be exposed to external load-balancers, or other external consumers of the application itself. |

Any port numbers marked with * are overridable, so you will need to ensure any
custom ports you provide are also open.

Although etcd ports are included in master nodes, you can also host your own
etcd cluster externally on custom ports.

The pod network plugin you use (see below) may also require certain ports to be
open. Since this differs with each pod network plugin, please see the
documentation for the plugins about what port(s) those need.

## Installing ebtables ethtool

If you see the following warnings while running `kubeadm init`

```
[preflight] WARNING: ebtables not found in system path                          
[preflight] WARNING: ethtool not found in system path                           
```

Then you may be missing ebtables and ethtool on your Linux machine. You can install them with the following commands: 

```
# For ubuntu/debian users, try 
apt install ebtables ethtool

# For CentOS/Fedora users, try 
yum install ebtables ethtool
```

## Installing Docker

On each of your machines, install Docker.
Version v1.12 is recommended, but v1.11, v1.13 and 17.03 are known to work as well.
Versions 17.06+ _might work_, but have not yet been tested and verified by the Kubernetes node team.

You can use the following commands to install Docker on your system:

{% capture docker_ubuntu %}

Install Docker from Ubuntu's repositories:

```bash
apt-get update
apt-get install -y docker.io
```

or install Docker CE 17.03 from Docker's repositories for Ubuntu or Debian:

```bash
apt-get update && apt-get install -y curl apt-transport-https
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | apt-key add -
cat <<EOF >/etc/apt/sources.list.d/docker.list
deb https://download.docker.com/linux/$(lsb_release -si | tr '[:upper:]' '[:lower:]') $(lsb_release -cs) stable
EOF
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

{% assign tab_set_name = "docker_install" %}
{% assign tab_names = "Ubuntu, Debian or HypriotOS;CentOS, RHEL or Fedora" | split: ';' | compact %}
{% assign tab_contents = site.emptyArray | push: docker_ubuntu | push: docker_centos %}

{% include tabs.md %}

## Installing kubeadm, kubelet and kubectl

You will install these packages on all of your machines:

* `kubeadm`: the command to bootstrap the cluster.

* `kubelet`: the component that runs on all of the machines in your cluster
    and does things like starting pods and containers.

* `kubectl`: the command line util to talk to your cluster.

kubeadm **will not** install or manage `kubelet` or `kubectl` for you, so you will 
need to ensure they match the version of the Kubernetes control panel you want 
kubeadm to install for you. If you do not, there is a risk of a version skew occurring that
can lead to unexpected, buggy behaviour.

Please proceed with executing the following commands based on your OS as `root`.
You may become the `root` user by executing `sudo -i` after SSH-ing to each host.

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
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg
        https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
setenforce 0
yum install -y kubelet kubeadm kubectl
systemctl enable kubelet && systemctl start kubelet
```

  **Note:**

  - Disabling SELinux by running `setenforce 0` is required to allow containers to access the host filesystem, which is required by pod networks for example. You have to do this until SELinux support is improved in the kubelet.
  - Some users on RHEL/CentOS 7 have reported issues with traffic being routed incorrectly due to iptables being bypassed. You should ensure `net.bridge.bridge-nf-call-iptables` is set to 1 in your `sysctl` config, e.g.
  
    ``` bash
    cat <<EOF >  /etc/sysctl.d/k8s.conf
    net.bridge.bridge-nf-call-ip6tables = 1
    net.bridge.bridge-nf-call-iptables = 1
    EOF
    sysctl --system
    ```

{% endcapture %}

{% assign tab_set_name = "k8s_install" %}
{% assign tab_names = "Ubuntu, Debian or HypriotOS;CentOS, RHEL or Fedora" | split: ';' | compact %}
{% assign tab_contents = site.emptyArray | push: ubuntu | push: centos %}

{% include tabs.md %}

The kubelet is now restarting every few seconds, as it waits in a crashloop for
kubeadm to tell it what to do.

{% endcapture %}

{% capture whatsnext %}

* [Using kubeadm to Create a
  Cluster](/docs/setup/independent/create-cluster-kubeadm/)

{% endcapture %}

{% include templates/task.md %}
