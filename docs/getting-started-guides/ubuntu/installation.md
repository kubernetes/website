---
reviewers:
- caesarxuchao
- erictune
title: Setting up Kubernetes with Juju
---

{% capture overview %}
Ubuntu 16.04 introduced the [Canonical Distribution of Kubernetes](https://www.ubuntu.com/cloud/kubernetes), a pure upstream distribution of Kubernetes designed for production usage. This page shows you how to deploy a cluster.
{% endcapture %}

{% capture prerequisites %}
- A working [Juju client](https://jujucharms.com/docs/2.3/reference-install); this does not have to be a Linux machine, it can also be Windows or OSX.
- A [supported cloud](#cloud-compatibility).
  - Bare Metal deployments are supported via [MAAS](http://maas.io). Refer to the [MAAS documentation](http://maas.io/docs/) for configuration instructions.
  - OpenStack deployments are currently only tested on Icehouse and newer.
- One of the following:
  - Network access to the following domains
    - *.jujucharms.com
    - gcr.io
    - github.com
    - Access to an Ubuntu mirror (public or private)
  - Offline deployment prepared with [these](https://github.com/juju-solutions/bundle-canonical-kubernetes/wiki/Running-CDK-in-a-restricted-environment) instructions.
{% endcapture %}


{% capture steps %}
## Deployment overview
Out of the box the deployment comes with the following components on 9 machines:

- Kubernetes (automated deployment, operations, and scaling)
     - Four node Kubernetes cluster with one master and three worker nodes.
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
VMware vSphere              | Juju         | Ubuntu | flannel, calico     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core)
Bare Metal (MAAS)           | Juju         | Ubuntu | flannel, calico     | [docs](/docs/getting-started-guides/ubuntu)                                   |          | [Commercial](https://ubuntu.com/cloud/kubernetes), [Community](https://github.com/juju-solutions/bundle-kubernetes-core)


For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.

## Installation options

You can launch a cluster in one of two ways: [conjure-up](#conjure-up) or [juju deploy](#juju-deploy). Conjure-up is just a convenience wrapper over juju and simplifies the installation. As such, it is the preferred method of install.

Deployment of the cluster is [supported on a wide variety of public clouds](#cloud-compatibility), private OpenStack clouds, or raw bare metal clusters. Bare metal deployments are supported via [MAAS](http://maas.io/).

## Conjure-up
To install Kubernetes with conjure-up, you need only to run the following commands and then follow the prompts:

```
sudo snap install conjure-up --classic
conjure-up kubernetes
```
## Juju deploy

### Configure Juju to use your cloud provider

After deciding which cloud to deploy to, follow the [cloud setup page](https://jujucharms.com/docs/devel/getting-started) to configure deploying to that cloud.

Load your [cloud credentials](https://jujucharms.com/docs/2.3/credentials) for each
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
juju bootstrap azure/westus2
```

If you receive this error, it is likely that the default Azure VM size (Standard D1 v2 [1 vcpu, 3.5 GB memory]) is not available in the Azure location:
```
ERROR failed to bootstrap model: instance provisioning failed (Failed)
```


You will need a controller node for each cloud or region you are deploying to. See the [controller documentation](https://jujucharms.com/docs/2.3/controllers) for more information.

Note that each controller can host multiple Kubernetes clusters in a given cloud or region.

### Launch a Kubernetes cluster

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
Model                         Controller          Cloud/Region   Version  SLA
conjure-canonical-kubern-f48  conjure-up-aws-650  aws/us-east-2  2.3.2    unsupported

App                    Version  Status  Scale  Charm                  Store       Rev  OS      Notes
easyrsa                3.0.1    active      1  easyrsa                jujucharms   27  ubuntu  
etcd                   2.3.8    active      3  etcd                   jujucharms   63  ubuntu  
flannel                0.9.1    active      4  flannel                jujucharms   40  ubuntu  
kubeapi-load-balancer  1.10.3   active      1  kubeapi-load-balancer  jujucharms   43  ubuntu  exposed
kubernetes-master      1.9.3    active      1  kubernetes-master      jujucharms   13  ubuntu  
kubernetes-worker      1.9.3    active      3  kubernetes-worker      jujucharms   81  ubuntu  exposed

Unit                      Workload  Agent  Machine  Public address  Ports           Message
easyrsa/0*                active    idle   3        18.219.190.99                   Certificate Authority connected.
etcd/0                    active    idle   5        18.219.56.23    2379/tcp        Healthy with 3 known peers
etcd/1*                   active    idle   0        18.219.212.151  2379/tcp        Healthy with 3 known peers
etcd/2                    active    idle   6        13.59.240.210   2379/tcp        Healthy with 3 known peers
kubeapi-load-balancer/0*  active    idle   1        18.222.61.65    443/tcp         Loadbalancer ready.
kubernetes-master/0*      active    idle   4        18.219.105.220  6443/tcp        Kubernetes master running.
  flannel/3               active    idle            18.219.105.220                  Flannel subnet 10.1.78.1/24
kubernetes-worker/0       active    idle   2        18.219.221.98   80/tcp,443/tcp  Kubernetes worker running.
  flannel/1               active    idle            18.219.221.98                   Flannel subnet 10.1.38.1/24
kubernetes-worker/1*      active    idle   7        18.219.249.103  80/tcp,443/tcp  Kubernetes worker running.
  flannel/2               active    idle            18.219.249.103                  Flannel subnet 10.1.68.1/24
kubernetes-worker/2       active    idle   8        52.15.89.16     80/tcp,443/tcp  Kubernetes worker running.
  flannel/0*              active    idle            52.15.89.16                     Flannel subnet 10.1.73.1/24

Machine  State    DNS             Inst id              Series  AZ          Message
0        started  18.219.212.151  i-065eab4eabc691b25  xenial  us-east-2a  running
1        started  18.222.61.65    i-0b332955f028d6281  xenial  us-east-2b  running
2        started  18.219.221.98   i-0879ef1ed95b569bc  xenial  us-east-2a  running
3        started  18.219.190.99   i-08a7b364fc008fc85  xenial  us-east-2c  running
4        started  18.219.105.220  i-0f92d3420b01085af  xenial  us-east-2a  running
5        started  18.219.56.23    i-0271f6448cebae352  xenial  us-east-2c  running
6        started  13.59.240.210   i-0789ef5837e0669b3  xenial  us-east-2b  running
7        started  18.219.249.103  i-02f110b0ab042f7ac  xenial  us-east-2b  running
8        started  52.15.89.16     i-086852bf1bee63d4e  xenial  us-east-2c  running

Relation provider                    Requirer                             Interface         Type         Message
easyrsa:client                       etcd:certificates                    tls-certificates  regular      
easyrsa:client                       kubeapi-load-balancer:certificates   tls-certificates  regular      
easyrsa:client                       kubernetes-master:certificates       tls-certificates  regular      
easyrsa:client                       kubernetes-worker:certificates       tls-certificates  regular      
etcd:cluster                         etcd:cluster                         etcd              peer         
etcd:db                              flannel:etcd                         etcd              regular      
etcd:db                              kubernetes-master:etcd               etcd              regular      
kubeapi-load-balancer:loadbalancer   kubernetes-master:loadbalancer       public-address    regular      
kubeapi-load-balancer:website        kubernetes-worker:kube-api-endpoint  http              regular      
kubernetes-master:cni                flannel:cni                          kubernetes-cni    subordinate  
kubernetes-master:kube-api-endpoint  kubeapi-load-balancer:apiserver      http              regular      
kubernetes-master:kube-control       kubernetes-worker:kube-control       kube-control      regular      
kubernetes-worker:cni                flannel:cni                          kubernetes-cni    subordinate  
```

## Interacting with the cluster

After the cluster is deployed you may assume control over the cluster from any kubernetes-master, or kubernetes-worker node.

If you didn't use conjure-up, you will first need to download the credentials and client application to your local workstation:

Create the kubectl config directory.

```
mkdir -p ~/.kube
```
Copy the kubeconfig file to the default location.

```
juju scp kubernetes-master/0:/home/ubuntu/config ~/.kube/config
```

The next step is to install the kubectl client on your local machine. The recommended way to do this on Ubuntu is using the kubectl snap ([https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-with-snap-on-ubuntu](https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-with-snap-on-ubuntu)).

The following command should be run on the machine you wish to use to control the kubernetes cluster: 

```
sudo snap install kubectl --classic
```

This will install and deploy the kubectl binary. You may need to restart your terminal as your $PATH may have been updated.

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
[Juju documentation for machine](https://jujucharms.com/docs/2.3/charms-constraints)
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

If you used conjure-up to create your cluster, you can tear it down with `conjure-down`. If you used juju directly, you can tear it down by destroying the Juju model or the controller. Use the `juju switch` command to get the current controller name:

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
