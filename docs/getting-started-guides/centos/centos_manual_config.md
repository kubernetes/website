---
approvers:
- thockin
title: CentOS
---

* TOC
{:toc}

**Caution:** This guide was originally written for Kubernetes 1.1.0 and [is deprecated](https://github.com/kubernetes/website/issues/1613) and is replaced by [kubeadm](/docs/admin/kubeadm/).
{: .caution}

## Prerequisites

To configure Kubernetes with CentOS, you'll need a machine to act as a master, and one or more CentOS 7 hosts to act as cluster nodes.

## Starting a cluster

This is a getting started guide for CentOS.  It is a manual configuration so you understand all the underlying packages / services / ports, etc...

The Kubernetes package provides a few services: kube-apiserver, kube-scheduler, kube-controller-manager, kubelet, kube-proxy.  These services are managed by systemd and the configuration resides in a central location: /etc/kubernetes. We will break the services up between the hosts.  The first host, centos-master, will be the Kubernetes master.  This host will run the kube-apiserver, kube-controller-manager and kube-scheduler.  In addition, the master will also run _etcd_.  The remaining hosts, centos-minion-n will be the nodes and run kubelet, proxy, cadvisor and docker.

All of them run flanneld as networking overlay.

**System Information:**

Hosts:

Please replace host IP with your environment.

```conf
centos-master = 192.168.121.9
centos-minion-1 = 192.168.121.65
centos-minion-2 = 192.168.121.66
centos-minion-3 = 192.168.121.67
```

**Prepare the hosts:**

* Create a /etc/yum.repos.d/virt7-docker-common-release.repo on all hosts - centos-{master,minion-n} with following information.

```conf
[virt7-docker-common-release]
name=virt7-docker-common-release
baseurl=http://cbs.centos.org/repos/virt7-docker-common-release/x86_64/os/
gpgcheck=0
```

* Install Kubernetes, etcd and flannel on all hosts - centos-{master,minion-n}. This will also pull in docker and cadvisor.

```shell
yum -y install --enablerepo=virt7-docker-common-release kubernetes etcd flannel
```

* Add master and node to /etc/hosts on all machines (not needed if hostnames already in DNS)

```shell
echo "192.168.121.9    centos-master
192.168.121.65    centos-minion-1
192.168.121.66  centos-minion-2
192.168.121.67  centos-minion-3" >> /etc/hosts
```

* Edit /etc/kubernetes/config which will be the same on all hosts to contain:

```shell
# logging to stderr means we get it in the systemd journal
KUBE_LOGTOSTDERR="--logtostderr=true"

# journal message level, 0 is debug
KUBE_LOG_LEVEL="--v=0"

# Should this cluster be allowed to run privileged docker containers
KUBE_ALLOW_PRIV="--allow-privileged=false"

# How the replication controller and scheduler find the kube-apiserver
KUBE_MASTER="--master=http://centos-master:8080"
```

* Disable the firewall on the master and all the nodes, as docker does not play well with other firewall rule managers. CentOS won't let you disable the firewall as long as SELinux is enforcing, so that needs to be disabled first.
* If you disable SELinux, make sure you reboot your machine before continuing to more steps.

```shell
setenforce 0
systemctl disable iptables-services firewalld
systemctl stop iptables-services firewalld
```

**Configure the Kubernetes services on the master.**

* Edit /etc/etcd/etcd.conf to appear as such:

```shell
# [member]
ETCD_NAME=default
ETCD_DATA_DIR="/var/lib/etcd/default.etcd"
ETCD_LISTEN_CLIENT_URLS="http://0.0.0.0:2379"

#[cluster]
ETCD_ADVERTISE_CLIENT_URLS="http://0.0.0.0:2379"
```

* Edit /etc/kubernetes/apiserver to appear as such:

```shell
# The address on the local server to listen to.
KUBE_API_ADDRESS="--address=0.0.0.0"

# The port on the local server to listen on.
KUBE_API_PORT="--port=8080"

# Port kubelets listen on
KUBELET_PORT="--kubelet-port=10250"

# Comma separated list of nodes in the etcd cluster
KUBE_ETCD_SERVERS="--etcd-servers=http://centos-master:2379"

# Address range to use for services
KUBE_SERVICE_ADDRESSES="--service-cluster-ip-range=10.254.0.0/16"

# Add your own!
KUBE_API_ARGS=""
```

* Start ETCD and configure it to hold the network overlay configuration on master:
**Warning** This network must be unused in your network infrastructure! `172.30.0.0/16` is free in our network.

```shell
systemctl start etcd
etcdctl mkdir /kube-centos/network
etcdctl mk /kube-centos/network/config "{ \"Network\": \"172.30.0.0/16\", \"SubnetLen\": 24, \"Backend\": { \"Type\": \"vxlan\" } }"
```

* Configure flannel to overlay Docker network in /etc/sysconfig/flanneld on the master (also in the nodes as we'll see):

```shell
# Flanneld configuration options

# etcd url location.  Point this to the server where etcd runs
FLANNEL_ETCD_ENDPOINTS="http://centos-master:2379"

# etcd config key.  This is the configuration key that flannel queries
# For address range assignment
FLANNEL_ETCD_PREFIX="/kube-centos/network"

# Any additional options that you want to pass
#FLANNEL_OPTIONS=""
```

* Start the appropriate services on master:

```shell
for SERVICES in etcd kube-apiserver kube-controller-manager kube-scheduler flanneld; do
    systemctl restart $SERVICES
    systemctl enable $SERVICES
    systemctl status $SERVICES
done
```

**Configure the Kubernetes services on the nodes.**

***We need to configure the kubelet and start the kubelet and proxy***

* Edit /etc/kubernetes/kubelet to appear as such:

```shell
# The address for the info server to serve on
KUBELET_ADDRESS="--address=0.0.0.0"

# The port for the info server to serve on
KUBELET_PORT="--port=10250"

# You may leave this blank to use the actual hostname
# Check the node number!
KUBELET_HOSTNAME="--hostname-override=centos-minion-n"

# Location of the api-server
KUBELET_API_SERVER="--api-servers=http://centos-master:8080"

# Add your own!
KUBELET_ARGS=""
```

* Configure flannel to overlay Docker network in /etc/sysconfig/flanneld (in all the nodes)

```shell
# Flanneld configuration options

# etcd url location.  Point this to the server where etcd runs
FLANNEL_ETCD_ENDPOINTS="http://centos-master:2379"

# etcd config key.  This is the configuration key that flannel queries
# For address range assignment
FLANNEL_ETCD_PREFIX="/kube-centos/network"

# Any additional options that you want to pass
#FLANNEL_OPTIONS=""
```

* Start the appropriate services on node (centos-minion-n).

```shell
for SERVICES in kube-proxy kubelet flanneld docker; do
    systemctl restart $SERVICES
    systemctl enable $SERVICES
    systemctl status $SERVICES
done
```
* Configure kubectl

```shell
kubectl config set-cluster default-cluster --server=http://centos-master:8080
kubectl config set-context default-context --cluster=default-cluster --user=default-admin
kubectl config use-context default-context
```

*You should be finished!*

* Check to make sure the cluster can see the node (on centos-master)

```shell
$ kubectl get nodes
NAME                   STATUS     AGE     VERSION
centos-minion-1        Ready      3d      v1.6.0+fff5156
centos-minion-2        Ready      3d      v1.6.0+fff5156
centos-minion-3        Ready      3d      v1.6.0+fff5156
```

**The cluster should be running! Launch a test pod.**

## Support Level


IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
Bare-metal           | custom       | CentOS | flannel     | [docs](/docs/getting-started-guides/centos/centos_manual_config)            |          | Community ([@coolsvap](https://github.com/coolsvap))

For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.
