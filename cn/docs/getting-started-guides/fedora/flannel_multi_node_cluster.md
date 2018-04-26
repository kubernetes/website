---
approvers:
- dchen1107
- erictune
- thockin
cn-approvers:
- lichuqiang
title: Fedora（多节点）
---
<!--
---
approvers:
- dchen1107
- erictune
- thockin
title: Fedora (Multi Node)
---
-->

* TOC
{:toc}

<!--
This document describes how to deploy Kubernetes on multiple hosts to set up a multi-node cluster and networking with flannel. Follow fedora [getting started guide](/docs/getting-started-guides/fedora/fedora_manual_config/) to setup 1 master (fed-master) and 2 or more nodes. Make sure that all nodes have different names (fed-node1, fed-node2 and so on) and labels (fed-node1-label, fed-node2-label, and so on) to avoid any conflict. Also make sure that the Kubernetes master host is running etcd, kube-controller-manager, kube-scheduler, and kube-apiserver services, and the nodes are running docker, kube-proxy and kubelet services. Now install flannel on Kubernetes nodes. Flannel on each node configures an overlay network that docker uses. Flannel runs on each node to setup a unique class-C container network.
-->
本文档介绍了如何在多台主机上部署 Kubernetes，来创建一个多节点集群，并使用 Flannel 组网。 请按照 fedora
[入门指南](/docs/getting-started-guides/fedora/fedora_manual_config/) 来设置 1 个 master
(fed-master) 以及 2 个或更多的 node。 确保所有的 node 有不同的名称（fed-node1、 fed-node2 等等）以及标签（fed-node1-label、 fed-node2-label 等等）来避免冲突。您还需要确保 Kubernetes master 主机运行着 etcd、
kube-controller-manager、 kube-scheduler 和 kube-apiserver 服务，同时 node 主机运行着 docker、
kube-proxy 和 kubelet 服务。 之后可以在 Kubernetes node 上安装 flannel。 每个 node 上的 Flannel 配置了一个
docker 使用的 overlay 网络。 Flannel 在每个 node 上运行，以建立一个唯一的 C 类容器网络。

<!--
## Prerequisites

You need 2 or more machines with Fedora installed.
-->
## 前提

您需要 2 台或更多安装了 Fedora 的机器。 这些机器可以是裸金属机或虚拟机。

<!--
## Master Setup

**Perform following commands on the Kubernetes master**

* Configure flannel by creating a `flannel-config.json` in your current directory on fed-master. Flannel provides udp and vxlan among other overlay networking backend options. In this guide, we choose kernel based vxlan backend. The contents of the json are:
-->
## Master 设置

**在 Kubernetes master 上执行以下命令**

* 通过在您的 fed-master 当前目录下创建一个 `flannel-config.json` 文件来配置 flannel。
Flannel 提供了 overlay 网络后端选项中的 udp 和 vxlan 类型。 在本指南中，我们选择基于 kernel 的 vxlan 后端。
json 文件的内容为：

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

<!--
**NOTE:** Choose an IP range that is *NOT* part of the public IP address range.

Add the configuration to the etcd server on fed-master.
-->
**注意：** 选择的 IP 地址范围*不能*是公共 IP 地址范围的一部分。

将该配置加入到 fed-master 上的 etcd 服务器中。

```shell
etcdctl set /coreos.com/network/config < flannel-config.json
```

<!--
* Verify that the key exists in the etcd server on fed-master.
-->
* 验证关键字存在于 fed-master 上的 etcd 服务器中。

```shell
etcdctl get /coreos.com/network/config
```

<!--
## Node Setup

**Perform following commands on all Kubernetes nodes**

Install the flannel package
-->
## Node 设置

**在所有 Kubernetes node 上执行以下命令**

安装 flannel 包

```shell
# dnf -y install flannel
```

<!--
Edit the flannel configuration file /etc/sysconfig/flanneld as follows:
-->
编辑 flannel 配置文件 /etc/sysconfig/flanneld 为如下形式：

<!--
```shell
# Flanneld configuration options

# etcd url location.  Point this to the server where etcd runs
FLANNEL_ETCD="http://fed-master:2379"

# etcd config key.  This is the configuration key that flannel queries
# For address range assignment
FLANNEL_ETCD_KEY="/coreos.com/network"

# Any additional options that you want to pass
FLANNEL_OPTIONS=""
```
-->
```shell
# Flanneld 配置选项

# etcd url 位置。 将该配置指向 etcd 运行的服务器
FLANNEL_ETCD="http://fed-master:2379"

# etcd 配置关键字。 该关键字用于 flannel 查询
# 地址范围分配
FLANNEL_ETCD_KEY="/coreos.com/network"

# 您希望传入的任何其他选项
FLANNEL_OPTIONS=""
```

<!--
**Note:** By default, flannel uses the interface for the default route. If you have multiple interfaces and would like to use an interface other than the default route one, you could add "-iface=" to FLANNEL_OPTIONS. For additional options, run `flanneld --help` on command line.

Enable the flannel service.
-->
**注意：** 默认情况下，flannel 使用网络接口作为默认路由。 如果您拥有多个网络接口，并希望使用其中一个网络接口，
而不是默认路由的那一个，您可以添加 "-iface=" 参数到 FLANNEL_OPTIONS 中。 想了解附加选项的信息，
可以在命令行中运行 `flanneld --help`。

启用 flannel 服务。

```shell
systemctl enable flanneld
```

<!--
If docker is not running, then starting flannel service is enough and skip the next step.
-->
如果 docker 未在运行，那么启动 flannel 服务就足够了，跳过下一步。

```shell
systemctl start flanneld
```

<!--
If docker is already running, then stop docker, delete docker bridge (docker0), start flanneld and restart docker as follows. Another alternative is to just reboot the system (`systemctl reboot`).
-->
如果 docker 已经在运行，那么停止 docker，删除 docker 网桥（docker0），按照如下方式启动 flanneld 并重启 docker。
另外一种选择是重启系统（`systemctl reboot`）。

```shell
systemctl stop docker
ip link delete docker0
systemctl start flanneld
systemctl start docker
```


<!--
## **Test the cluster and flannel configuration**

Now check the interfaces on the nodes. Notice there is now a flannel.1 interface, and the ip addresses of docker0 and flannel.1 interfaces are in the same network. You will notice that docker0 is assigned a subnet (18.16.29.0/24 as shown below) on each Kubernetes node out of the IP range configured above. A working output should look like this:
-->
## **测试集群和 flannel 配置**

现在检查 node 上的网络接口。 注意现在有了一个 flannel.1 接口，且 docker0 和 flannel.1 接口的 ip
地址处于同一网络中。 您会注意到每个 Kubernetes node 上的 docker0 都被分配了一个处于上面配置的
IP 地址范围之外的子网（如下面展示的 18.16.29.0/24）。 正常的输出应如下所示：

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
从集群中的任一 node 上，通过 curl（使用 `grep -E "\{|\}|key|value"` 来输出部分结果）向 etcd 服务器发起查询，
来检查集群成员。 如果您设置了一个包含 1 个 master 和 3 个 node 的集群，您应当看到每个 node 对应一个信息块，
展示了它们被分配的子网。 您可以通过输出结果中列出的 MAC 地址（VtepMAC）和 IP 地址（公共 IP）将这些子网与每个
node 联系到一起。

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
在所有 node 上，检验 `/run/flannel/subnet.env` 文件。 该文件是由 flannel 自动生成的。

```shell
# cat /run/flannel/subnet.env
FLANNEL_SUBNET=18.16.29.1/24
FLANNEL_MTU=1450
FLANNEL_IPMASQ=false
```

<!--
At this point, we have etcd running on the Kubernetes master, and flannel / docker running on Kubernetes nodes. Next steps are for testing cross-host container communication which will confirm that docker and flannel are configured properly.

Issue the following commands on any 2 nodes:
-->
这个时候，我们已经使得 etcd 运行在 Kubernetes master上，同时 flannel/docker 运行在 Kubernetes node 上。
下面的步骤是为了测试跨主机容器通信，这将证实 docker 和 flannel 是否配置正确。

```shell
# docker run -it fedora:latest bash
bash-4.3# 
```

<!--
This will place you inside the container. Install iproute and iputils packages to install ip and ping utilities. Due to a [bug](https://bugzilla.redhat.com/show_bug.cgi?id=1142311), it is required to modify capabilities of ping binary to work around "Operation not permitted" error.
-->
上面的操作会使您处于容器中。 安装 iproute 和 iputils 包来安装 ip 和 ping 工具。 由于一个
[bug](https://bugzilla.redhat.com/show_bug.cgi?id=1142311)，您需要修改 ping 的二进制文件的权限来解决
"Operation not permitted" 错误。

```shell
bash-4.3# dnf -y install iproute iputils
bash-4.3# setcap cap_net_raw-ep /usr/bin/ping
```

<!--
Now note the IP address on the first node:
-->
现在注意第一个 node 上的 IP 地址：

```shell
bash-4.3# ip -4 a l eth0 | grep inet
    inet 18.16.29.4/24 scope global eth0
```

<!--
And also note the IP address on the other node:
-->
还要注意另一个 node 上的 IP 地址：

```shell
bash-4.3# ip a l eth0 | grep inet
    inet 18.16.90.4/24 scope global eth0
```
<!--
Now ping from the first node to the other node:
-->
现在从第一个 node 来 ping 另一个 node：

```shell
bash-4.3# ping 18.16.90.4
PING 18.16.90.4 (18.16.90.4) 56(84) bytes of data.
64 bytes from 18.16.90.4: icmp_seq=1 ttl=62 time=0.275 ms
64 bytes from 18.16.90.4: icmp_seq=2 ttl=62 time=0.372 ms
```

<!--
Now Kubernetes multi-node cluster is set up with overlay networking set up by flannel.
-->
现在使用由 flannel 创建的 overlay 网络的 Kubernetes 多节点集群已经创建完成了。

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
IaaS 提供商           | 配置管理      | 操作系统| 网络        | 文档                                               | 遵从     | 支持级别
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
裸金属                | 自定义        | Fedora | flannel     | [文档](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)      |          | 社区 ([@aveshagarwal](https://github.com/aveshagarwal))
libvirt              | 自定义        | Fedora | flannel     | [文档](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)      |          | 社区 ([@aveshagarwal](https://github.com/aveshagarwal))
KVM                  | 自定义        | Fedora | flannel     | [文档](/docs/getting-started-guides/fedora/flannel_multi_node_cluster/)      |          | 社区 ([@aveshagarwal](https://github.com/aveshagarwal))
