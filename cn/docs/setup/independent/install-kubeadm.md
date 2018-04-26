---
title: 安装 kubeadm
---

<!--
---
title: Installing kubeadm
---
-->

{% capture overview %}

<!-- This page shows how to use install kubeadm. -->
这一页展示如何安装kubeadm

{% endcapture %}

{% capture prerequisites %}

<!-- * One or more machines running Ubuntu 16.04+, CentOS 7 or HypriotOS v1.0.1+
* 1GB or more of RAM per machine (any less will leave little room for your apps)
* Full network connectivity between all machines in the cluster (public or private network is fine)
* Unique MAC address and product_uuid for every node
* Certain ports are open on your machines. See the section below for more details -->

* 一台或以上的机器运行 Ubuntu 16.04+, CentOS 7 或者 HypriotOS v1.0.1+
* 每台机器至少有1GB内存 (太少的话可能运行不了您的应用)
* 集群中有正常的网络链接(公网或者私网都可以)
* 每个节点有唯一的MAC地址和uuid
* 对应的端口需要开放，详细参考下节

{% endcapture %}

{% capture steps %}
<!--
## Check required ports

### Master node(s)

| Port Range | Purpose                          |
|:-----------|:---------------------------------|
| 6443*      | Kubernetes API server            |
| 2379-2380  | etcd server client API           |
| 10250      | Kubelet API                      |
| 10251      | kube-scheduler                   |
| 10252      | kube-controller-manager          |
| 10255      | Read-only Kubelet API (Heapster) |

### Worker node(s)

| Port Range  | Purpose                                                                                                                                                                                                                    |
|:------------|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 10250       | Kubelet API                                                                                                                                                                                                                |
| 10255       | Read-only Kubelet API (Heapster)                                                                                                                                                                                           |
| 30000-32767 | Default port range for [NodePort Services](/docs/concepts/services-networking/service). Typically, these ports would need to be exposed to external load-balancers, or other external consumers of the application itself. |

Any port numbers marked with * are overridable, so you will need to ensure any
custom ports you provide are also open.

Although etcd ports are included in master nodes, you can also host your own
etcd cluster externally on custom ports.

The pod network plugin you use (see below) may also require certain ports to be
open. Since this differs with each pod network plugin, please see the
documentation for the plugins about what port(s) those need.
-->

## 检查需要的端口

### 主节点

| 端口范围  | 用途                             |
|:----------|:---------------------------------|
| 6443*     | Kubernetes API server            |
| 2379-2380 | etcd server client API           |
| 10250     | Kubelet API                      |
| 10251     | kube-scheduler                   |
| 10252     | kube-controller-manager          |
| 10255     | Read-only Kubelet API (Heapster) |

### 从节点

| 端口范围    | 用途                                                                                                                                                   |
|:------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------|
| 10250       | Kubelet API                                                                                                                                            |
| 10255       | Read-only Kubelet API (Heapster)                                                                                                                       |
| 30000-32767 | Default port range for [NodePort Services](/docs/concepts/services-networking/service). 正常来说，这些端口需要开放给外部负载均衡设备或者其他客户应用。 |

任何标志*的端口号都可以更改，因此你必须根据要求保证开放任何需要的端口号。

虽然etcd 端口包含在主节点里，但是你也可以在集群外部部署你的etcd集群。

你使用的pod网络插件可能要求开放对应端口。因为不同网络插件要求不同，所有请先查阅对应的文档。

<!--
## Installing Docker

On each of your machines, install Docker.
Version 1.12 is recommended, but v1.10 and v1.11 are known to work as well.
Versions 1.13 and 17.03+ have not yet been tested and verified by the Kubernetes node team.
For installation instructions, see
[Install Docker](https://docs.docker.com/engine/installation/).

## Installing kubectl

On each of your machines,
[install kubectl](/docs/tasks/tools/install-kubectl/).
You only need kubectl on the master and/or your workstation, but it can be
useful to have on the other nodes as well.
-->


## 安装 Docker

每一台及其都必须安装Docker。
推荐使用1.12版本 , 不过v1.10 和 v1.11 也是可以使用的。
1.13 和 17.03 以上版本还没有经过kubernetes团队的测试。
安装过程清查看下列文档：
[Install Docker](https://docs.docker.com/engine/installation/).

## 安装 kubectl

在每台机器上
[install kubectl](/docs/tasks/tools/install-kubectl/).
kubectl只需要安装在主节点或者你的工作站，但是在其他节点上也是很有用的。

<!--
## Installing kubelet and kubeadm

You will install these packages on all of your machines:

* `kubelet`: the component that runs on all of the machines in your cluster
    and does things like starting pods and containers.

* `kubeadm`: the command to bootstrap the cluster.

**Note:** If you already have kubeadm installed, you should do a `apt-get update &&
apt-get upgrade` or `yum update` to get the latest version of kubeadm. See the
kubeadm release notes if you want to read about the different [kubeadm
releases](https://github.com/kubernetes/kubeadm/blob/master/CHANGELOG.md)

For each machine:

* SSH into the machine and become root if you are not already (for example,
  run `sudo -i`).

* If the machine is running Ubuntu or HypriotOS, run:

  ``` bash
  apt-get update && apt-get install -y apt-transport-https
  curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
  cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
  deb http://apt.kubernetes.io/ kubernetes-xenial main
  EOF
  apt-get update
  apt-get install -y kubelet kubeadm
  ```

* If the machine is running CentOS, run:

  ``` bash
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
  yum install -y kubelet kubeadm
  systemctl enable kubelet && systemctl start kubelet
  ```

  The kubelet is now restarting every few seconds, as it waits in a crashloop for
  kubeadm to tell it what to do.

  Note: Disabling SELinux by running `setenforce 0` is required to allow
  containers to access the host filesystem, which is required by pod networks for
  example. You have to do this until SELinux support is improved in the kubelet.
-->

## 安装 kubelet and kubeadm

在所有机器上安装下列包：

* `kubelet`: 运行在集群的所有机器上，负责启动pod和container相关的事情。

* `kubeadm`: 主要负责创建和管理集群。

**注意:** 如果你已经安装了kubeadm，可以使用`apt-get update &&
apt-get upgrade` 或者 `yum update` 来更新到最新版本的kubeadm. 如果想知道kubeadm
各个发行版本的确保，可以阅读这个文档(https://git.k8s.io/kubeadm/CHANGELOG.md)

在每台机器上：

* SSH登录到机器上并切换到root用户 (比如执行`sudo -i`)。

* 如果操作系统是 Ubuntu 或者 HypriotOS, 则运行下列命令:

  ``` bash
  apt-get update && apt-get install -y apt-transport-https
  curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key add -
  cat <<EOF >/etc/apt/sources.list.d/kubernetes.list
  deb http://apt.kubernetes.io/ kubernetes-xenial main
  EOF
  apt-get update
  apt-get install -y kubelet kubeadm
  ```

* 如果操作系统是CentOS, 则运行:

  ``` bash
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
  yum install -y kubelet kubeadm
  systemctl enable kubelet && systemctl start kubelet
  ```

  这样kubelet is now restarting every few seconds, as it waits in a crashloop for
  kubeadm to tell it what to do.

  注意: 容器可以正常访问主机的文件系统的前提是禁止SELinux,运行`setenforce 0` 就可以，
  这是pod的网络架构所需求的。除非kubelet支持SELinux.
{% endcapture %}

{% capture whatsnext %}

* [Using kubeadm to Create a Cluster](/docs/getting-started-guides/kubeadm/)

{% endcapture %}

{% include templates/task.md %}
