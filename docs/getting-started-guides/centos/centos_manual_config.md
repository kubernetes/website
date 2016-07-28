---
---

* TOC
{:toc}

## Prerequisites

You need two machines with CentOS installed on them.

## Starting a cluster

This is a getting started guide for CentOS.  It is a manual configuration so you understand all the underlying packages / services / ports, etc...

This guide will only get ONE node working.  Multiple nodes requires a functional [networking configuration](/docs/admin/networking) done outside of kubernetes.  Although the additional Kubernetes configuration requirements should be obvious.

The Kubernetes package provides a few services: kube-apiserver, kube-scheduler, kube-controller-manager, kubelet, kube-proxy.  These services are managed by systemd and the configuration resides in a central location: /etc/kubernetes. We will break the services up between the hosts.  The first host, centos-master, will be the Kubernetes master.  This host will run the kube-apiserver, kube-controller-manager, and kube-scheduler.  In addition, the master will also run _etcd_.  The remaining host, centos-minion will be the node and run kubelet, proxy, cadvisor and docker.

**System Information:**

Hosts:

Please replace host IP with your environment.

```conf
centos-master = 192.168.121.9
centos-minion = 192.168.121.65
```

**Prepare the hosts:**

* Create a /etc/yum.repos.d/virt7-docker-common-release.repo on all hosts - centos-{master,minion} with following information.

```conf
[virt7-docker-common-release]
name=virt7-docker-common-release
baseurl=http://cbs.centos.org/repos/virt7-docker-common-release/x86_64/os/
gpgcheck=0
```

* Install Kubernetes and etcd on all hosts - centos-{master,minion}. This will also pull in docker and cadvisor.

```shell
yum -y install --enablerepo=virt7-docker-common-release kubernetes etcd
```

* Add master and node to /etc/hosts on all machines (not needed if hostnames already in DNS)

```shell
echo "192.168.121.9	centos-master
192.168.121.65	centos-minion" >> /etc/hosts
```

* Edit /etc/kubernetes/config which will be the same on all hosts to contain:

```shell
# Comma separated list of nodes in the etcd cluster
KUBE_ETCD_SERVERS="--etcd-servers=http://centos-master:2379"

# logging to stderr means we get it in the systemd journal
KUBE_LOGTOSTDERR="--logtostderr=true"

# journal message level, 0 is debug
KUBE_LOG_LEVEL="--v=0"

# Should this cluster be allowed to run privileged docker containers
KUBE_ALLOW_PRIV="--allow-privileged=false"

# How the replication controller and scheduler find the kube-apiserver
KUBE_MASTER="--master=http://centos-master:8080"
```

* Disable the firewall on both the master and node, as docker does not play well with other firewall rule managers

```shell
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

# Address range to use for services
KUBE_SERVICE_ADDRESSES="--service-cluster-ip-range=10.254.0.0/16"

# Add your own!
KUBE_API_ARGS=""
```

* Start the appropriate services on master:

```shell
for SERVICES in etcd kube-apiserver kube-controller-manager kube-scheduler; do
	systemctl restart $SERVICES
	systemctl enable $SERVICES
	systemctl status $SERVICES
done
```

**Configure the Kubernetes services on the node.**

***We need to configure the kubelet and start the kubelet and proxy***

* Edit /etc/kubernetes/kubelet to appear as such:

```shell
# The address for the info server to serve on
KUBELET_ADDRESS="--address=0.0.0.0"

# The port for the info server to serve on
KUBELET_PORT="--port=10250"

# You may leave this blank to use the actual hostname
KUBELET_HOSTNAME="--hostname-override=centos-minion"

# Location of the api-server
KUBELET_API_SERVER="--api-servers=http://centos-master:8080"

# Add your own!
KUBELET_ARGS=""
```

* Start the appropriate services on node (centos-minion).

```shell
for SERVICES in kube-proxy kubelet docker; do
    systemctl restart $SERVICES
    systemctl enable $SERVICES
    systemctl status $SERVICES
done
```

*You should be finished!*

* Check to make sure the cluster can see the node (on centos-master)

```shell
$ kubectl get nodes
NAME                   LABELS            STATUS
centos-minion          <none>            Ready
```

**The cluster should be running! Launch a test pod.**

You should have a functional cluster, check out [101](/docs/user-guide/walkthrough/)!

## Support Level


IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
Bare-metal           | custom       | CentOS | _none_      | [docs](/docs/getting-started-guides/centos/centos_manual_config)            |          | Community ([@coolsvap](https://github.com/coolsvap))

For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.

