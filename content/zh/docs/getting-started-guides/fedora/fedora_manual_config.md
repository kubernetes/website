---
reviewers:
- aveshagarwal
- eparis
- thockin
title: Fedora (单节点)
---

<!--
---
reviewers:
- aveshagarwal
- eparis
- thockin
title: Fedora (Single Node)
---
-->

{{< toc >}}

<!--
## Prerequisites
-->

## 前提条件

<!--
1. You need 2 or more machines with Fedora installed. These can be either bare metal machines or virtual machines.

## Instructions

This is a getting started guide for Fedora.  It is a manual configuration so you understand all the underlying packages / services / ports, etc...

This guide will only get ONE node (previously minion) working.  Multiple nodes require a functional [networking configuration](/docs/concepts/cluster-administration/networking/) done outside of Kubernetes.  Although the additional Kubernetes configuration requirements should be obvious.

The Kubernetes package provides a few services: kube-apiserver, kube-scheduler, kube-controller-manager, kubelet, kube-proxy.  These services are managed by systemd and the configuration resides in a central location: `/etc/kubernetes`.  We will break the services up between the hosts.  The first host, fed-master, will be the Kubernetes master.  This host will run the kube-apiserver, kube-controller-manager, and kube-scheduler.  In addition, the master will also run _etcd_ (not needed if _etcd_ runs on a different host but this guide assumes that _etcd_ and Kubernetes master run on the same host).  The remaining host, fed-node will be the node and run kubelet, proxy and docker.
-->

1. 您需要两台或更多机器安装 Fedora。这些机器可以是裸机，也可以是虚拟机。

## 说明

这是 Fedora 的入门指南。配置手工打造，因而需要了解所有底层软件包/服务/端口等等。

本指南只能使一个节点（以前的 minion）工作。多个节点需要在 Kubernetes 之外完成功能性网络配置。尽管额外的 Kubernetes 配置需求是显而易见的。

Kubernetes 包提供了一些服务：kube-apiserver、kube-scheduler、kube-control -manager、kubelet、kube-proxy。这些服务由 systemd 管理，配置位于中心位置：`/etc/kubernetes`。
我们将打破主机之间的服务。第一个主机，fed-master，将是 Kubernetes 主节点。该主节点将运行 kube-apiserver、kube-control-manager 和 kube-scheduler。
此外，主服务器还将运行 *etcd* (如果 *etcd* 运行在不同的主机上就不需要了，但是本指南假设 *etcd* 和 Kubernetes 主服务器在同一主机上运行)。剩下的主机，fed-node 将是节点并运行 kubelet、proxy 和 docker。


<!--
**System Information:**

Hosts:

```conf
fed-master = 192.168.121.9
fed-node = 192.168.121.65
```

-->

**系统信息：**

主机:

```conf
fed-master = 192.168.121.9
fed-node = 192.168.121.65
```

<!--
**Prepare the hosts:**

* Install Kubernetes on all hosts - fed-{master,node}.  This will also pull in docker. Also install etcd on fed-master.  This guide has been tested with Kubernetes-0.18 and beyond.
* Running on AWS EC2 with RHEL 7.2, you need to enable "extras" repository for yum by editing `/etc/yum.repos.d/redhat-rhui.repo` and changing the `enable=0` to `enable=1` for extras.
-->

**准备主机：**

* 在所有主机（fed-{master，node}）上安装 Kubernetes 。这同时也会安装 docker。接着在 fed-master 上安装 etcd。本指南已经通过 Kubernetes-0.18 及更高版本的测试。
* 在使用 RHEL 7.2 的 AWS EC2 上运行时，您需要通过编辑 `/etc/yum.repos.d/redhat-rhui.repo` 和更改 `enable=0to` 为 `enable=1` 来为 yum 启用 “extras” 仓库。

```shell
dnf -y install kubernetes
```

<!--
* Install etcd
-->

* 安装 etcd

```shell
dnf -y install etcd
```
<!--
* Add master and node to `/etc/hosts` on all machines (not needed if hostnames already in DNS). Make sure that communication works between fed-master and fed-node by using a utility such as ping.
-->

* 将主机和节点添加到所有机器上的 `/etc/hosts` (如果主机名已经在 DNS 中，则不需要)。通过使用 ping 等实用程序，确保 fed-master 和 fed-node 之间的通信工作正常。


```shell
echo "192.168.121.9    fed-master
192.168.121.65    fed-node" >> /etc/hosts
```

<!--
* Edit `/etc/kubernetes/config` (which should be the same on all hosts) to set
the name of the master server:

```shell
# Comma separated list of nodes in the etcd cluster
KUBE_MASTER="--master=http://fed-master:8080"
```
-->

* 编辑 `/etc/kubernetes/config` （在所有主机上应该是相同的）来设置主服务器的名称:

```shell
# 逗号分隔的 etcd 群集中的节点列表 
KUBE_MASTER="--master=http://fed-master:8080"
```

<!--
* Disable the firewall on both the master and node, as Docker does not play well with other firewall rule managers.  Please note that iptables.service does not exist on the default Fedora Server install.
-->

* 禁用主节点和子节点上的防火墙，因为 Docker 与其他防火墙规则管理器不兼容。请注意，默认的 Fedora Server 安装中不存在 iptables.service。

```shell
systemctl mask firewalld.service
systemctl stop firewalld.service

systemctl disable iptables.service
systemctl stop iptables.service
```

<!--
**Configure the Kubernetes services on the master.**

* Edit `/etc/kubernetes/apiserver` to appear as such.  The service-cluster-ip-range IP addresses must be an unused block of addresses, not used anywhere else.  They do not need to be routed or assigned to anything.
-->

**在主服务器上配置 Kubernetes 服务。**

* 编辑 `/etc/kubernetes/apiserver`，包含以下内容。`service-cluster-ip-range` 的 IP 地址必须是未使用的地址块，同时也不能在其他任何地方使用。它们不需要路由或分配给任何东西。

<!--
```shell
# The address on the local server to listen to.
KUBE_API_ADDRESS="--address=0.0.0.0"

# Comma separated list of nodes in the etcd cluster
KUBE_ETCD_SERVERS="--etcd-servers=http://127.0.0.1:2379"

# Address range to use for services
KUBE_SERVICE_ADDRESSES="--service-cluster-ip-range=10.254.0.0/16"

# Add your own!
KUBE_API_ARGS=""
```
-->

```shell
# 本地服务器上所要监听的地址。
KUBE_API_ADDRESS="--address=0.0.0.0"

# 逗号在 ETCD 集群分离节点列表 
KUBE_ETCD_SERVERS="--etcd-servers=http://127.0.0.1:2379"

# 地址范围内使用的服务 
KUBE_SERVICE_ADDRESSES="--service-cluster-ip-range=10.254.0.0/16"

# 添加你自己的!
KUBE_API_ARGS=""
```

<!--
* Edit `/etc/etcd/etcd.conf` to let etcd listen on all available IPs instead of 127.0.0.1. If you have not done this, you might see an error such as "connection refused".
-->

* 编辑 `/etc/etcd/etcd.conf` 让 etcd 监听所有可用的 IP 地址，而不仅仅是 127.0.0.1。如果没有这样做，您可能会看到一个错误，例如 "connection refused"。

```shell
ETCD_LISTEN_CLIENT_URLS="http://0.0.0.0:2379"
```

<!--
* Start the appropriate services on master:
-->

* 在主节点上启动适当的服务:

```shell
for SERVICES in etcd kube-apiserver kube-controller-manager kube-scheduler; do
    systemctl restart $SERVICES
    systemctl enable $SERVICES
    systemctl status $SERVICES
done
```

<!--
**Configure the Kubernetes services on the node.**

***We need to configure the kubelet on the node.***

* Edit `/etc/kubernetes/kubelet` to appear as such:
-->

**在节点上配置 Kubernetes 服务**

***我们需要在节点上配置 kubelet。***

* 编辑 `/etc/kubernetes/kubelet`，加入以下内容：


<!--
```shell
###
# Kubernetes kubelet (node) config

# The address for the info server to serve on (set to 0.0.0.0 or "" for all interfaces)
KUBELET_ADDRESS="--address=0.0.0.0"

# You may leave this blank to use the actual hostname
KUBELET_HOSTNAME="--hostname-override=fed-node"

# location of the api-server
KUBELET_ARGS="--cgroup-driver=systemd --kubeconfig=/etc/kubernetes/master-kubeconfig.yaml"

```
-->


```shell
###
# Kubernetes kubelet（节点）的配置

# info 服务器要服务的地址(设置为 0.0.0.0 或 "" 用于所有接口)
KUBELET_ADDRESS="--address=0.0.0.0"

# 可以留空，使用实际主机名
KUBELET_HOSTNAME="--hostname-override=fed-node"

# api-server 的位置 
KUBELET_ARGS="--cgroup-driver=systemd --kubeconfig=/etc/kubernetes/master-kubeconfig.yaml"

```

<!--
* Edit `/etc/kubernetes/master-kubeconfig.yaml` to contain the following information:
-->

* 编辑 `/etc/kubernetes/master-kubeconfig.yaml` 文件，添加以下信息：

```yaml
kind: Config
clusters:
- name: local
  cluster:
    server: http://fed-master:8080
users:
- name: kubelet
contexts:
- context:
    cluster: local
    user: kubelet
  name: kubelet-context
current-context: kubelet-context
```

<!--
* Start the appropriate services on the node (fed-node).
-->

* 在节点（fed-node）上启动适当的服务。

```shell
for SERVICES in kube-proxy kubelet docker; do 
    systemctl restart $SERVICES
    systemctl enable $SERVICES
    systemctl status $SERVICES 
done
```

<!--
* Check to make sure now the cluster can see the fed-node on fed-master, and its status changes to _Ready_.
-->
* 检查以确保集群在 fed-master 上可以看到 fed-node，并且它的状态更改为 _Ready_。

```shell
kubectl get nodes
NAME            STATUS      AGE      VERSION
fed-node        Ready       4h
```

<!--
* Deletion of nodes:

To delete _fed-node_ from your Kubernetes cluster, one should run the following on fed-master (Please do not do it, it is just for information):
-->

* 删除节点：

要从 Kubernetes 集群中删除 _fed-node_，应该在 fed-master 上运行以下命令（这只是演示用）：


```shell
kubectl delete -f ./node.json
```

<!--
*You should be finished!*

**The cluster should be running! Launch a test pod.**

## Support Level
-->

*到此为止！*

**集群应该正在运行！创建测试 pod。**

## 支持级别

<!--
IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level

-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
Bare-metal           | custom       | Fedora | _none_      | [docs](/docs/getting-started-guides/fedora/fedora_manual_config)            |          | Project

For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.
-->

IaaS 供应商          | 配置管理      | 操作系统| 网络         | 文档                                              | 合规     | 支持级别

-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
Bare-metal           | custom       | Fedora | _none_      | [文档](/docs/getting-started-guides/fedora/fedora_manual_config)            |          | 项目

有关所有解决方案的支持级别信息，请参见[解决方案表](/docs/getting-started-guides/#table-of-solutions)。


