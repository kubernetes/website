---
approvers:
- caesarxuchao
- erictune
title: Setting up Kubernetes with Juju
---

{% capture overview %}
Ubuntu 16.04 introduced the [Canonical Distribution of Kubernetes](https://www.ubuntu.com/cloud/kubernetes), a pure upstream distribution of Kubernetes designed for production usage. This page shows you how to deploy a cluster.
{% endcapture %}

{% capture prerequisites %}
- A working [Juju client](https://jujucharms.com/docs/2.2/reference-install); this does not have to be a Linux machine, it can also be Windows or OSX.
- A [supported cloud](#cloud-compatibility).
  - Bare Metal deployments are supported via [MAAS](http://maas.io). Refer to the [MAAS documentation](http://maas.io/docs/) for configuration instructions.
  - OpenStack deployments are currently only tested on Icehouse and newer.
- Network access to the following domains
  - *.jujucharms.com
  - gcr.io
  - github.com
  - Access to an Ubuntu mirror (public or private)
{% endcapture %}


{% capture steps %}
## Deployment overview
Out of the box the deployment comes with the following components on 9 machines:

- Kubernetes (automated deployment, operations, and scaling)
     - Three node Kubernetes cluster with one master and two worker nodes.
     - TLS used for communication between units for security.
     - Flannel Software Defined Network (SDN) plugin
     - A load balancer for HA kubernetes-master (Experimental)
     - Optional Ingress Controller (on worker)
     - Optional Dashboard addon (on master) including Heapster for cluster monitoring
- EasyRSA
     - Performs the role of a certificate authority serving self signed certificates
       to the requesting units of the cluster.
- ETCD (distributed key value store)
     - Three unit cluster for reliability.

The Juju Kubernetes work is curated by the Big Software team at [Canonical Ltd](https://www.canonical.com/),
let us know how we are doing. If you find any problems please open an
[issue on our tracker](https://github.com/juju-solutions/bundle-canonical-kubernetes)
so we can find them.

## Support Level

IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
Amazon Web Services (AWS)   | Juju         | Ubuntu | flannel, calico*     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core)
OpenStack                   | Juju         | Ubuntu | flannel, calico     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core)
Microsoft Azure             | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core)
Google Compute Engine (GCE) | Juju         | Ubuntu | flannel, calico     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core)
Joyent                      | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core)
Rackspace                   | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core)
VMWare vSphere              | Juju         | Ubuntu | flannel, calico     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core)
Bare Metal (MAAS)           | Juju         | Ubuntu | flannel, calico     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core)


For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.

## Configure Juju to use your cloud provider

Deployment of the cluster is [supported on a wide variety of public clouds](#cloud-compatibility), private OpenStack clouds, or raw bare metal clusters. Bare metal deployments are supported via [MAAS](http://maas.io/).

After deciding which cloud to deploy to, follow the [cloud setup page](https://jujucharms.com/docs/devel/getting-started) to configure deploying to that cloud.

Load your [cloud credentials](https://jujucharms.com/docs/2.2/credentials) for each
cloud provider you would like to use.

In this example

```
juju add-credential aws
credential name: my_credentials
select auth-type [userpass, oauth, etc]: userpass
enter username: jorge
enter password: *******
```

You can also just auto load credentials for popular clouds with the `juju autoload-credentials` command, which will auto import your credentials from the default files and environment variables for each cloud.

Next we need to bootstrap a controller to manage the cluster. You need to define the cloud you want to bootstrap on, the region, and then any name for your controller node:   

```
juju update-clouds # This command ensures all the latest regions are up to date on your client
juju bootstrap aws/us-east-2
```
or, another example, this time on Azure:

```
juju bootstrap azure/centralus
```

You will need a controller node for each cloud or region you are deploying to. See the [controller documentation](https://jujucharms.com/docs/2.2/controllers) for more information.

Note that each controller can host multiple Kubernetes clusters in a given cloud or region.

## Launch a Kubernetes cluster

The following command will deploy the initial 9-node starter cluster. The speed of execution is very dependent of the performance of the cloud you're deploying to:

```
juju deploy canonical-kubernetes
```

After this command executes the cloud will then launch instances and begin the deployment process.

## Monitor deployment

The `juju status` command provides information about each unit in the cluster. Use the `watch -c juju status --color` command to get a real-time view of the cluster as it deploys. When all the states are green and "Idle", the cluster is ready to be used:

    juju status

Output:

```
Model    Controller     Cloud/Region   Version
default  aws-us-east-2  aws/us-east-2  2.0.1

App                    Version  Status       Scale  Charm                  Store       Rev  OS      Notes
easyrsa                3.0.1    active           1  easyrsa                jujucharms    3  ubuntu  
etcd                   3.1.2    active           3  etcd                   jujucharms   14  ubuntu  
flannel                0.6.1    maintenance      4  flannel                jujucharms    5  ubuntu  
kubeapi-load-balancer  1.10.0   active           1  kubeapi-load-balancer  jujucharms    3  ubuntu  exposed
kubernetes-master      1.6.1    active           1  kubernetes-master      jujucharms    6  ubuntu  
kubernetes-worker      1.6.1    active           3  kubernetes-worker      jujucharms    8  ubuntu  exposed
topbeat                         active           3  topbeat                jujucharms    5  ubuntu  

Unit                      Workload     Agent  Machine  Public address  Ports            Message
easyrsa/0*                active       idle   0        52.15.95.92                      Certificate Authority connected.
etcd/0                    active       idle   3        52.15.79.127    2379/tcp         Healthy with 3 known peers.
etcd/1*                   active       idle   4        52.15.111.66    2379/tcp         Healthy with 3 known peers. (leader)
etcd/2                    active       idle   5        52.15.144.25    2379/tcp         Healthy with 3 known peers.
kubeapi-load-balancer/0*  active       idle   7        52.15.84.179    443/tcp          Loadbalancer ready.
kubernetes-master/0*      active       idle   8        52.15.106.225   6443/tcp         Kubernetes master services ready.
  flannel/3               active       idle            52.15.106.225                    Flannel subnet 10.1.48.1/24
kubernetes-worker/0*      active       idle   9        52.15.153.246                    Kubernetes worker running.
  flannel/2               active       idle            52.15.153.246                    Flannel subnet 10.1.53.1/24
kubernetes-worker/1       active       idle   10       52.15.52.103                     Kubernetes worker running.
  flannel/0*              active       idle            52.15.52.103                     Flannel subnet 10.1.31.1/24
kubernetes-worker/2       active       idle   11       52.15.104.181                    Kubernetes worker running.
  flannel/1               active       idle            52.15.104.181                    Flannel subnet 10.1.83.1/24

Machine  State    DNS            Inst id              Series  AZ
0        started  52.15.95.92    i-06e66414008eca61c  xenial  us-east-2c
3        started  52.15.79.127   i-0038186d2c5103739  xenial  us-east-2b
4        started  52.15.111.66   i-0ac66c86a8ec93b18  xenial  us-east-2a
5        started  52.15.144.25   i-078cfe79313d598c9  xenial  us-east-2c
7        started  52.15.84.179   i-00fd70321a51b658b  xenial  us-east-2c
8        started  52.15.106.225  i-0109a5fc942c53ed7  xenial  us-east-2b
9        started  52.15.153.246  i-0ab63e34959cace8d  xenial  us-east-2b
10       started  52.15.52.103   i-0108a8cc0978954b5  xenial  us-east-2a
11       started  52.15.104.181  i-0f5562571c649f0f2  xenial  us-east-2c
```

## Interacting with the cluster

After the cluster is deployed you may assume control over the cluster from any kubernetes-master, or kubernetes-worker node.

First you need to download the credentials and client application to your local workstation:

Create the kubectl config directory.

```
mkdir -p ~/.kube
```
Copy the kubeconfig file to the default location.

```
juju scp kubernetes-master/0:config ~/.kube/config
```

Fetch a binary for the architecture you have deployed. If your client is a
different architecture you will need to get the appropriate `kubectl` binary
through other means. In this example we copy kubectl to `~/bin` for convenience,
by default this should be in your $PATH.

```
mkdir -p ~/bin
juju scp kubernetes-master/0:kubectl ~/bin/kubectl
```

Query the cluster:

    kubectl cluster-info

Output:

```
Kubernetes master is running at https://52.15.104.227:443
Heapster is running at https://52.15.104.227:443/api/v1/namespaces/kube-system/services/heapster/proxy
KubeDNS is running at https://52.15.104.227:443/api/v1/namespaces/kube-system/services/kube-dns/proxy
Grafana is running at https://52.15.104.227:443/api/v1/namespaces/kube-system/services/monitoring-grafana/proxy
InfluxDB is running at https://52.15.104.227:443/api/v1/namespaces/kube-system/services/monitoring-influxdb/proxy
```

Congratulations, you've now set up a Kubernetes cluster!  

## Scale up cluster

Want larger Kubernetes nodes? It is easy to request different sizes of cloud
resources from Juju by using **constraints**. You can increase the amount of
CPU or memory (RAM) in any of the systems requested by Juju. This allows you
to fine tune the Kubernetes cluster to fit your workload. Use flags on the
bootstrap command or as a separate `juju constraints` command. Look to the
[Juju documentation for machine](https://jujucharms.com/docs/2.2/charms-constraints)
details.

## Scale out cluster

Need more workers? We just add more units:    

```shell
juju add-unit kubernetes-worker
```

Or multiple units at one time:  

```shell
juju add-unit -n3 kubernetes-worker
```
You can also ask for specific instance types or other machine-specific constraints. See the [constraints documentation](https://jujucharms.com/docs/stable/reference-constraints) for more information. Here are some examples, note that generic constraints such as `cores` and `mem` are more portable between clouds. In this case we'll ask for a specific instance type from AWS:

```shell
juju set-constraints kubernetes-worker instance-type=c4.large
juju add-unit kubernetes-worker
```

You can also scale the etcd charm for more fault tolerant key/value storage:  

```shell
juju add-unit -n3 etcd
```
It is strongly recommended to run an odd number of units for quorum.

## Tear down cluster

If you want stop the servers you can destroy the Juju model or the
controller. Use the `juju switch` command to get the current controller name:  

```shell
juju switch
juju destroy-controller $controllername --destroy-all-models
```
This will shutdown and terminate all running instances on that cloud.
{% endcapture %}

{% capture discussion %}
## More Info

The Ubuntu Kubernetes deployment uses open-source operations, or operations as code, known as charms. These charms are assembled from layers which keeps the code smaller and more focused on the operations of just Kubernetes and its components.

The Kubernetes layer and bundles can be found in the `kubernetes`
project on github.com:  

 - [Bundle location](https://git.k8s.io/kubernetes/cluster/juju/bundles)
 - [Kubernetes charm layer location](https://git.k8s.io/kubernetes/cluster/juju/layers)
 - [Canonical Kubernetes home](https://jujucharms.com/kubernetes)
 - [Main issue tracker](https://github.com/juju-solutions/bundle-canonical-kubernetes)

Feature requests, bug reports, pull requests and feedback are appreciated.
{% endcapture %}

{% include templates/task.md %}
