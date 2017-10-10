---
approvers:
- thockin
title: CentOS
---

* TOC
{:toc}

## 警告

本文档适用于Kubernetes 1.1.0，目前已经被[废弃](https://github.com/kubernetes/kubernetes.github.io/issues/1613)。相关内容请参阅最新版[指南](/docs/getting-started-guides/kubeadm/)。

## 前提条件

在CentOS上部署和配置Kubernetes，您需要在集群中拥有一台机器作为master节点，并拥有至少一台运行CentOS 7系统的主机作为集群节点（node）。

## 启动一个集群

本文档是一篇基于CentOS系统部署和配置Kubernetes的入门指南，内容涵盖一个手工的配置，以便于您了解所有的底层软件包、服务以及端口等信息。

Kubernetes由一系列服务构成，包括kube-apiserver、kube-scheduler、kube-controller-manager、kubelet以及kube-proxy等。这些服务由systemd管理，配置集中位于/etc/kubernetes。我们将在集群中的不同主机上部署不同的服务。其中，第一台主机，即centos-master，将被部署成为Kubernetes集群中的master节点。这台主机上将运行kube-apiserver、kube-controller-manager和kube-scheduler。 此外，master节点还将运行 _etcd_。集群中剩余的主机，即centos-minion-n节点，将运行kubelet、proxy、cadvisor和docker。

集群中的所有节点将运行flanneld来构建网络（networking overlay）。

**系统信息：**

主机：

请使用您真实环境中的信息替换以下配置中的各个主机IP

```conf
centos-master = 192.168.121.9
centos-minion-1 = 192.168.121.65
centos-minion-2 = 192.168.121.66
centos-minion-3 = 192.168.121.67
```

**配置主机环境：**

* 在集群所有节点上——centos-{master,minion-n}，创建包含以下配置信息的/etc/yum.repos.d/virt7-docker-common-release.repo文件。

```conf
[virt7-docker-common-release]
name=virt7-docker-common-release
baseurl=http://cbs.centos.org/repos/virt7-docker-common-release/x86_64/os/
gpgcheck=0
```

* 在集群所有节点上——centos-{master,minion-n}，安装Kubernetes、etcd和flanneld。这一过程也将同时在节点上安装docker和cadvisor。

```shell
yum -y install --enablerepo=virt7-docker-common-release kubernetes etcd flannel
```

* 将master节点和其他节点的主机名——IP映射添加到所有集群节点的/etc/hosts文件中（如果主机名已经在DNS中记录，则可略过此步）

```shell
echo "192.168.121.9    centos-master
192.168.121.65    centos-minion-1
192.168.121.66  centos-minion-2
192.168.121.67  centos-minion-3" >> /etc/hosts
```

* 编辑/etc/kubernetes/config文件以保证在集群所有主机上都包含以下内容：

```shell
# logging to stderr意为从systemd journal获取日志
KUBE_LOGTOSTDERR="--logtostderr=true"

# journal消息级别, 0代表debug
KUBE_LOG_LEVEL="--v=0"

# 是否允许集群运行privileged docker containers
KUBE_ALLOW_PRIV="--allow-privileged=false"

# 配置replication conrtoller和scheduler所需的kube-apiserver地址
KUBE_MASTER="--master=http://centos-master:8080"
```

* 由于docker与一些防火墙规则不兼容，需要在master节点及其他集群节点上禁用防火墙。在CentOS系统上，需要首先禁用SELinux，进而才能禁用防火墙。

```shell
setenforce 0
systemctl disable iptables-services firewalld
systemctl stop iptables-services firewalld
```

**配置master节点上的Kubernetes服务**

* 编辑/etc/etcd/etcd.conf文件内容如下：

```shell
# [member]
ETCD_NAME=default
ETCD_DATA_DIR="/var/lib/etcd/default.etcd"
ETCD_LISTEN_CLIENT_URLS="http://0.0.0.0:2379"

#[cluster]
ETCD_ADVERTISE_CLIENT_URLS="http://0.0.0.0:2379"
```

* 编辑/etc/kubernetes/apiserver文件内容如下：

```shell
# 本地服务器监听地址
KUBE_API_ADDRESS="--address=0.0.0.0"

# 本地服务器监听端口
KUBE_API_PORT="--port=8080"

# Kubelet监听端口
KUBELET_PORT="--kubelet-port=10250"

# 以逗号间隔的etcd集群中各个节点的地址
KUBE_ETCD_SERVERS="--etcd-servers=http://centos-master:2379"

# Kubernetes服务IP地址网段
KUBE_SERVICE_ADDRESSES="--service-cluster-ip-range=10.254.0.0/16"

# 请添加您需要的Kubernetes API Server启动参数
KUBE_API_ARGS=""
```

* 启动ETCD并保存master节点的网络设置（network overlay configuration）：
**警告** 请根据您的真实环境配置网络信息！在本文环境中，`172.30.0.0/16`网段是可用的。

```shell
systemctl start etcd
etcdctl mkdir /kube-centos/network
etcdctl mk /kube-centos/network/config "{ \"Network\": \"172.30.0.0/16\", \"SubnetLen\": 24, \"Backend\": { \"Type\": \"vxlan\" } }"
```

* 在master节点上配置/etc/sysconfig/flanneld文件使用flannel覆盖Docker网络 (需要在其他集群节点上完成相同配置，详见下文):

```shell
# Flanneld配置选项

# etcd url地址，指向运行etcd的服务器
FLANNEL_ETCD_ENDPOINTS="http://centos-master:2379"

# etcd配置秘钥，即flannel查询的配置秘钥
# 用于网段分配
FLANNEL_ETCD_PREFIX="/kube-centos/network"

# 其它需要的Flannel启动参数
#FLANNEL_OPTIONS=""
```

* 在master节点上启动相关服务：

```shell
for SERVICES in etcd kube-apiserver kube-controller-manager kube-scheduler flanneld; do
    systemctl restart $SERVICES
    systemctl enable $SERVICES
    systemctl status $SERVICES
done
```

**在集群其他节点上配置Kubernetes服务**

***我们需要在集群其他节点上配置kubelet，启动kubelet和proxy服务***

* 编辑/etc/kubernetes/kubelet文件内容如下：

```shell
# info server的服务地址
KUBELET_ADDRESS="--address=0.0.0.0"

# info server的监听端口
KUBELET_PORT="--port=10250"

# 本字段可以设置空值以使用真实的主机名
# 注意节点序号（n）
KUBELET_HOSTNAME="--hostname-override=centos-minion-n"

# api-server地址
KUBELET_API_SERVER="--api-servers=http://centos-master:8080"

# 添加您所需要的Kubelet参数
KUBELET_ARGS=""
```

* 在所有节点上配置/etc/sysconfig/flanneld文件设置使用flannel覆盖Docker网络：

```shell
# Flanneld配置选项

# etcd url地址，指向运行etcd的服务器
FLANNEL_ETCD_ENDPOINTS="http://centos-master:2379"

# etcd配置秘钥，即flannel查询的配置秘钥
# 用于网段分配
FLANNEL_ETCD_PREFIX="/kube-centos/network"

# 其他需要配置的选项
#FLANNEL_OPTIONS=""
```

* 在节点上启动相关服务（centos-minion-n）

```shell
for SERVICES in kube-proxy kubelet flanneld docker; do
    systemctl restart $SERVICES
    systemctl enable $SERVICES
    systemctl status $SERVICES
done
```
* 配置kubectl

```shell
kubectl config set-cluster default-cluster --server=http://centos-master:8080
kubectl config set-context default-context --cluster=default-cluster --user=default-admin
kubectl config use-context default-context
```

*至此，Kubernetes在CentOS集群中的部署已经完成 ！*

* 在centos-master节点上通过kubectl命令检查所有的Kubernetes节点已经到位

```shell
$ kubectl get nodes
NAME                   STATUS     AGE     VERSION
centos-minion-1        Ready      3d      v1.6.0+fff5156
centos-minion-2        Ready      3d      v1.6.0+fff5156   
centos-minion-3        Ready      3d      v1.6.0+fff5156
```

**现在，Kubernetes集群已经正常运行！可以创建测试pod验证集群了！**

## 支持级别


IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
Bare-metal           | custom       | CentOS | flannel     | [docs](/docs/getting-started-guides/centos/centos_manual_config)            |          | Community ([@coolsvap](https://github.com/coolsvap))

有关所有解决方案的支持级别信息，请参阅[解决方案列表](/docs/getting-started-guides/#table-of-solutions)。
