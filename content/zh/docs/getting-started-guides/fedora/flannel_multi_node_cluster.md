---
reviewers:
- dchen1107
- erictune
- thockin
title: Fedora （多节点）
---

<!--
---
reviewers:
- dchen1107
- erictune
- thockin
title: Fedora (Multi Node)
---
-->

{{< toc >}}

<!--
This document describes how to deploy Kubernetes on multiple hosts to set up a multi-node cluster and networking with flannel. Follow fedora [getting started guide](/docs/getting-started-guides/fedora/fedora_manual_config/) to setup 1 master (fed-master) and 2 or more nodes. Make sure that all nodes have different names (fed-node1, fed-node2 and so on) and labels (fed-node1-label, fed-node2-label, and so on) to avoid any conflict. Also make sure that the Kubernetes master host is running etcd, kube-controller-manager, kube-scheduler, and kube-apiserver services, and the nodes are running docker, kube-proxy and kubelet services. Now install flannel on Kubernetes nodes. Flannel on each node configures an overlay network that docker uses. Flannel runs on each node to setup a unique class-C container network.
-->
本文档描述了如何在多个主机上部署 Kubernetes 来建立一个多节点集群和 flannel 网络。遵循 fedora 入门指南设置 1 个主节点 （fed-master）
 和 2 个或更多节点。确保所有节点具有不同的名称（fed-node1、fed-node2 等等）和标签（fed-node1-label、fed-node2-label 等等），以避免
任何冲突。还要确保 Kubernetes 主节点主机正在运行 etcd、kube-controller-manager、kube-scheduler 和 kube-apiserver 服务，节点正在
 运行 docker、kube-proxy 和 kubelet 服务。现在在 Kubernetes 节点上安装 flannel。每个节点上的 flannel 配置 docker 使用的 overlay  网络。
 Flannel 在每个节点上运行，以设置一个惟一的 class-C 容器网络。

<!--
## Prerequisites
-->

## 前提条件

<!--
You need 2 or more machines with Fedora installed.
-->
您需要安装 Fedora 的两台或更多机器。

<!--
## Master Setup
-->

## 主节点设置

<!--
**Perform following commands on the Kubernetes master**

* Configure flannel by creating a `flannel-config.json` in your current directory on fed-master. Flannel provides udp and vxlan among other overlay networking backend options. In this guide, we choose kernel based vxlan backend. The contents of the json are:
-->

**在 Kubernetes 主节点上执行以下命令**

* 在您当前的目录上的 fed-master 中通过创建一个 `flannel-config.json` 来配置 flannel。Flannel 在其他 overlay 网络后端选项中提供 udp 和 vxlan 。在本指南中，我们选择基于内核的 vxlan 后端 json 的内容为:

```json
{
    "Network": "18.16.0.0/16",
    "SubnetLen": 24,
    "Backend": {
        "Type": "vxlan",
        "VNI": 1
     }
}
```

{{< note >}}

<!--
Choose an IP range that is *NOT* part of the public IP address range.
-->
选择一个不在公共 IP 地址范围内的 IP 范围。

{{< /note >}}

<!--
Add the configuration to the etcd server on fed-master.
-->
将配置添加到 fed-master 上的 etcd 服务器。

```shell
etcdctl set /coreos.com/network/config < flannel-config.json
```

<!--
* Verify that the key exists in the etcd server on fed-master.
-->

* 验证 fed-master 上的 etcd 服务器中是否存在该密钥。

```shell
etcdctl get /coreos.com/network/config
```

<!--
## Node Setup
-->

## 节点设置

<!--
**Perform following commands on all Kubernetes nodes**
-->

**在所有 Kubernetes 节点上执行以下命令**

<!--
Install the flannel package
-->

安装 flannel 包

```shell
# dnf -y install flannel
```

<!--
Edit the flannel configuration file /etc/sysconfig/flanneld as follows:
-->

编辑 flannel 配置文件 /etc/sysconfig/flanneld，如下所示：

<!--
# Flanneld configuration options

# etcd url location.  Point this to the server where etcd runs

# etcd config key.  This is the configuration key that flannel queries
# For address range assignment

# Any additional options that you want to pass
-->

```shell
# Flanneld 配置选项

# etcd url 位置，将此指向 etcd 运行的服务器
FLANNEL_ETCD="http://fed-master:2379"

# etcd 配置的关键。这是 flannel 查询的配置键
# 用于地址范围分配
FLANNEL_ETCD_KEY="/coreos.com/network"

# 您想要传递的任何附加选项
FLANNEL_OPTIONS=""
```

{{< note >}}

<!--
By default, flannel uses the interface for the default route. If you have multiple interfaces and would like to use an interface other than the default route one, you could add "-iface=" to FLANNEL_OPTIONS. For additional options, run `flanneld --help` on command line.
-->
默认情况下，flannel 使用默认路由的接口。如果您有多个接口并且想要使用默认路由 1 以外的接口，则可以将 "-iface=" 添加到 FLANNEL_OPTIONS。有关其他选项，请在命令行上运行 `flanneld --help`。

{{< /note >}}

<!--
Enable the flannel service.
-->
启用 flannel 服务。

```shell
systemctl enable flanneld
```

<!--
If docker is not running, then starting flannel service is enough and skip the next step.
-->
如果 docker 没有运行，那么启动 flannel 服务就足够了，跳过下一步。

```shell
systemctl start flanneld
```

<!--
If docker is already running, then stop docker, delete docker bridge (docker0), start flanneld and restart docker as follows. Another alternative is to just reboot the system (`systemctl reboot`).
-->
如果 docker 已经运行，则停止 docker，删除 docker bridge（docker0），启动 flanneld 并重新启动 docker，如下所示。另一种方法是重启系统（systemctl reboot）。

```shell
systemctl stop docker
ip link delete docker0
systemctl start flanneld
systemctl start docker
```

<!--
## Test the cluster and flannel configuration
-->

## 测试群集和 flannel 配置

<!--
Now check the interfaces on the nodes. Notice there is now a flannel.1 interface, and the ip addresses of docker0 and flannel.1 interfaces are in the same network. You will notice that docker0 is assigned a subnet (18.16.29.0/24 as shown below) on each Kubernetes node out of the IP range configured above. A working output should look like this:
-->
现在检查节点上的接口。请注意，现在有一个 flannel.1 接口，docker0 和 flannel.1 接口的 ip 地址在同一个网络中。您会注意到 docker0 在上面配置的 IP 范围之外的每个 Kubernetes 节点上分配了一个子网（18.16.29.0/24，如下所示）。工作输出应如下所示：


```shell
# ip -4 a|grep inet
    inet 127.0.0.1/8 scope host lo
    inet 192.168.122.77/24 brd 192.168.122.255 scope global dynamic eth0
    inet 18.16.29.0/16 scope global flannel.1
    inet 18.16.29.1/24 scope global docker0
```

<!--
From any node in the cluster, check the cluster members by issuing a query to etcd server via curl (only partial output is shown using `grep -E "\{|\}|key|value"`). If you set up a 1 master and 3 nodes cluster, you should see one block for each node showing the subnets they have been assigned. You can associate those subnets to each node by the MAC address (VtepMAC) and IP address (Public IP) that is listed in the output.
-->
从集群中的任何节点，通过 curl 向 etcd 服务器发出查询来检查集群成员(仅显示部分输出 `grep -E "\{|\}|key|value`)。如果您设置了 1 个主节点和 3 个节点集群，您应该会看到每个节点都有一个块，显示分配给它们的子网。您可以通过输出中列出的 MAC 地址（VtepMAC）和 IP 地址(公共 IP) 将这些子网关联到每个节点。

```shell
curl -s http://fed-master:2379/v2/keys/coreos.com/network/subnets | python -mjson.tool
```

```json
{
    "node": {
        "key": "/coreos.com/network/subnets",
            {
                "key": "/coreos.com/network/subnets/18.16.29.0-24",
                "value": "{\"PublicIP\":\"192.168.122.77\",\"BackendType\":\"vxlan\",\"BackendData\":{\"VtepMAC\":\"46:f1:d0:18:d0:65\"}}"
            },
            {
                "key": "/coreos.com/network/subnets/18.16.83.0-24",
                "value": "{\"PublicIP\":\"192.168.122.36\",\"BackendType\":\"vxlan\",\"BackendData\":{\"VtepMAC\":\"ca:38:78:fc:72:29\"}}"
            },
            {
                "key": "/coreos.com/network/subnets/18.16.90.0-24",
                "value": "{\"PublicIP\":\"192.168.122.127\",\"BackendType\":\"vxlan\",\"BackendData\":{\"VtepMAC\":\"92:e2:80:ba:2d:4d\"}}"
            }
    }
}
```

<!--
From all nodes, review the `/run/flannel/subnet.env` file.  This file was generated automatically by flannel.
-->
从所有节点，查看 `/run/flannel/subnet.env` 文件。这个文件是由 flannel 自动生成的。

```shell
# cat /run/flannel/subnet.env
FLANNEL_SUBNET=18.16.29.1/24
FLANNEL_MTU=1450
FLANNEL_IPMASQ=false
```

<!--
At this point, we have etcd running on the Kubernetes master, and flannel / docker running on Kubernetes nodes. Next steps are for testing cross-host container communication which will confirm that docker and flannel are configured properly.
-->
此时，我们在 Kubernetes 主节点上运行了 etcd，在 Kubernetes 节点上运行了 flannel / docker。接下来的步骤是测试跨主机容器通信，这将确认 docker 和 flannel 配置正确。

<!--
Issue the following commands on any 2 nodes:
-->
在任意两个节点上发出以下命令:

```shell
# docker run -it fedora:latest bash
bash-4.3# 
```

<!--
This will place you inside the container. Install iproute and iputils packages to install ip and ping utilities. Due to a [bug](https://bugzilla.redhat.com/show_bug.cgi?id=1142311), it is required to modify capabilities of ping binary to work around "Operation not permitted" error.
-->
您将会进入容器中。安装 iproute 和 iputils 包来安装 ip 和 ping 实用程序。由于一个[错误](https://bugzilla.redhat.com/show_bug.cgi?id=1142311)，需要修改 ping 二进制文件的功能来处理"操作不允许"错误。

```shell
bash-4.3# dnf -y install iproute iputils
bash-4.3# setcap cap_net_raw-ep /usr/bin/ping
```

<!--
Now note the IP address on the first node:
-->
现在记下第一个节点上的 IP 地址：

```shell
bash-4.3# ip -4 a l eth0 | grep inet
    inet 18.16.29.4/24 scope global eth0
```

<!--
And also note the IP address on the other node:
-->
还要注意另一个节点上的 IP 地址：

```shell
bash-4.3# ip a l eth0 | grep inet
    inet 18.16.90.4/24 scope global eth0
```

<!--
Now ping from the first node to the other node:
-->
现在从第一个节点 ping 到另一个节点：

```shell
bash-4.3# ping 18.16.90.4
PING 18.16.90.4 (18.16.90.4) 56(84) bytes of data.
64 bytes from 18.16.90.4: icmp_seq=1 ttl=62 time=0.275 ms
64 bytes from 18.16.90.4: icmp_seq=2 ttl=62 time=0.372 ms
```

<!--
Now Kubernetes multi-node cluster is set up with overlay networking set up by flannel.
-->
现在，Kubernetes 多节点集群通过 flannel 设置 overlay 网络。

<!--
## Support Level
-->

## 支持级别

<!--
IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
Bare-metal           | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)      |          | Community ([@aveshagarwal](https://github.com/aveshagarwal))
libvirt              | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)      |          | Community ([@aveshagarwal](https://github.com/aveshagarwal))
KVM                  | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)      |          | Community ([@aveshagarwal](https://github.com/aveshagarwal))
-->

IaaS 供应商           | 配置 管理    | 系统    | 网络        | 文档                                              | 标准 | 支持级别
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
Bare-metal           | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)      |          | Community ([@aveshagarwal](https://github.com/aveshagarwal))
libvirt              | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)      |          | Community ([@aveshagarwal](https://github.com/aveshagarwal))
KVM                  | custom       | Fedora | flannel     | [docs](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)      |          | Community ([@aveshagarwal](https://github.com/aveshagarwal))



