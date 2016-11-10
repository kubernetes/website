---
assignees:
- caesarxuchao
- erictune

---

Ubuntu 16.04 introduced the [Canonical Distribution of Kubernetes](https://jujucharms.com/canonical-kubernetes/), a pure upstream distribution of Kubernetes designed for production usage. Out of the box it comes with the following components on 12 machines:

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
- Etcd (distributed key value store)
     - Three unit cluster for reliability.
- Elastic stack
     - Two units for ElasticSearch
     - One units for a Kibana dashboard
     - Beats on every Kubernetes and Etcd units:
          - Filebeat for forwarding logs to ElasticSearch
          - Topbeat for inserting server monitoring data to ElasticSearch


The Juju Kubernetes work is curated by a dedicated team of community members,
let us know how we are doing. If you find any problems please open an
[issue on our tracker](https://github.com/juju-solutions/bundle-canonical-kubernetes)
so we can find them.

* TOC
{:toc}

## Prerequisites

- A working [Juju client](https://jujucharms.com/docs/2.0/getting-started-general); this does not have to be a Linux machine, it can also be Windows or OSX.
- A [supported cloud](#cloud-compatibility).

### On Ubuntu

On your local Ubuntu system:  

```shell
sudo add-apt-repository ppa:juju/stable
sudo apt-get update
sudo apt-get install juju
```

If you are using another distro/platform - please consult the
[getting started guide](https://jujucharms.com/docs/2.0/getting-started-general)
to install the Juju dependencies for your platform. 

### Configure Juju to your favorite cloud provider

Deployment of the cluster is [supported on a wide variety of public clouds](#cloud-compatibility), private OpenStack clouds, or raw bare metal clusters.  

After deciding which cloud to deploy to, follow the [cloud setup page](https://jujucharms.com/docs/devel/getting-started-general#2.-choose-a-cloud) to configure deploying to that cloud. 

Load your [cloud credentials](https://jujucharms.com/docs/2.0/credentials) for each 
cloud provider you would like to use. 

In this example

```shell
juju add-credential aws 
credential name: my_credentials
select auth-type [userpass, oauth, etc]: userpass
enter username: jorge
enter password: *******
```

You can also just auto load credentials for popular clouds with the `juju autoload-credentials` command, which will auto import your credentials from the default files and environment variables for each cloud. 

Next we need to bootstrap a controller to manage the cluster. You need to define the cloud you want to bootstrap on, the region, and then any name for your controller node:   

```shell
juju update-clouds # This command ensures all the latest regions are up to date on your client
juju bootstrap aws/us-east-2 
```
or, another example, this time on Azure: 

```shell
juju bootstrap azure/centralus 
```

You will need a controller node for each cloud or region you are deploying to. See the [controller documentation](https://jujucharms.com/docs/2.0/controllers) for more information.

Note that each controller can host multiple Kubernetes clusters in a given cloud or region. 

## Launch a Kubernetes cluster

The following command will deploy the intial 12-node starter cluster. The speed of execution is very dependent of the performance of the cloud you're deploying to, but 

```shell
juju deploy canonical-kubernetes
```

After this command executes we need to wait for the cloud to return back instances and for all the automated deployment tasks to execute. 

## Monitor deployment

The `juju status` command provides information about each unit in the cluster. We recommend using the `watch -c juju status --color` command to get a real-time view of the cluster as it deploys. When all the states are green and "Idle", the cluster is ready to go. 
   

```shell
$ juju status
MODEL    CONTROLLER  CLOUD/REGION     VERSION
default  example_cluster_2     azure/centralus  2.0

APP         VERSION  STATUS  EXPOSED  ORIGIN      CHARM       REV  OS
etcd                 active  false    jujucharms  etcd        3    ubuntu
kubernetes           active  true     jujucharms  kubernetes  5    ubuntu

RELATION      PROVIDES    CONSUMES    TYPE
cluster       etcd        etcd        peer
etcd          etcd        kubernetes  regular
certificates  kubernetes  kubernetes  peer

UNIT          WORKLOAD  AGENT  MACHINE  PORTS     PUBLIC-ADDRESS  MESSAGE
etcd/0        active    idle   0        2379/tcp  13.67.217.11    (leader) cluster is healthy
kubernetes/0  active    idle   1        8088/tcp  13.67.219.76    Kubernetes running.
kubernetes/1  active    idle   2        6443/tcp  13.67.219.182   (master) Kubernetes running.

MACHINE  STATE    DNS            INS-ID     SERIES  AZ
0        started  13.67.217.11   machine-0  xenial  
1        started  13.67.219.76   machine-1  xenial  
2        started  13.67.219.182  machine-2  xenial 
```

## Interacting with the cluster

After the cluster is deployed you may assume control over the cluster from any kubernetes-master, or kubernetes-worker node.

First we need to download the credentials and client application to your local workstation:

Create the kubectl config directory.

```shell
mkdir -p ~/.kube
```
Copy the kubeconfig file to the default location.

```shell
juju scp kubernetes-master/0:config ~/.kube/config
```

Fetch a binary for the architecture you have deployed. If your client is a
different architecture you will need to get the appropriate `kubectl` binary
through other means.

```shell
juju scp kubernetes-master/0:kubectl ./kubectl
```

Query the cluster.

```shell
./kubectl cluster-info
Kubernetes master is running at https://52.15.104.227:443
Heapster is running at https://52.15.104.227:443/api/v1/proxy/namespaces/kube-system/services/heapster
KubeDNS is running at https://52.15.104.227:443/api/v1/proxy/namespaces/kube-system/services/kube-dns
Grafana is running at https://52.15.104.227:443/api/v1/proxy/namespaces/kube-system/services/monitoring-grafana
InfluxDB is running at https://52.15.104.227:443/api/v1/proxy/namespaces/kube-system/services/monitoring-influxdb
```

Congratulations, you've now set up a Kubernetes cluster!  

## Scale up cluster

Want larger Kubernetes nodes? It is easy to request different sizes of cloud
resources from Juju by using **constraints**. You can increase the amount of
CPU or memory (RAM) in any of the systems requested by Juju. This allows you
to fine tune th Kubernetes cluster to fit your workload. Use flags on the
bootstrap command or as a separate `juju constraints` command. Look to the
[Juju documentation for machine](https://jujucharms.com/docs/2.0/charms-constraints)
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
You can also ask for specific instance types or other machine-specific constraints. See the [constraints documentation](https://jujucharms.com/docs/stable/reference-constraints) for more information. Here are some examples, note that generic constraints such as `cores` and `mem` are more portable between clouds. 

```shell
juju add-unit kubernetes-worker --constraints="instance-type=c4.large" 
juju add-unit kubernetes-worker --constraints="cores=4,mem=32G" 
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

## More Info

We stand up Kubernetes with open-source operations, or operations as code, known as charms. These charms are assembled from layers which keeps the code smaller and more focused on the operations of just Kubernetes and its components.

The Kubernetes layer and bundles can be found in the `kubernetes`
project on github.com:  

 - [Bundle location](https://github.com/kubernetes/kubernetes/tree/master/cluster/juju/bundles)
 - [Kubernetes charm layer location](https://github.com/kubernetes/kubernetes/tree/master/cluster/juju/layers/kubernetes)
 - [Canonical Kubernetes home](https://jujucharms.com/canonical-kubernetes/)

Feature requests, bug reports, pull requests or any feedback would be much appreciated. 

### Cloud compatibility

This deployment methodology is continually tested on the following clouds:

[Amazon Web Service](https://jujucharms.com/docs/2.0/help-aws),
[Microsoft Azure](https://jujucharms.com/docs/2.0/help-azure),
[Google Compute Engine](https://jujucharms.com/docs/2.0/help-google),
[Joyent](https://jujucharms.com/docs/2.0/help-joyent),
[Rackspace](https://jujucharms.com/docs/2.0/help-rackspace), any
[OpenStack cloud](https://jujucharms.com/docs/2.0/clouds#specifying-additional-clouds),
and
[Vmware vSphere](https://jujucharms.com/docs/2.0/config-vmware).

## Support Level


IaaS Provider        | Config. Mgmt | OS     | Networking  | Docs                                              | Conforms | Support Level
-------------------- | ------------ | ------ | ----------  | ---------------------------------------------     | ---------| ----------------------------
Amazon Web Services (AWS)   | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/juju)                                   |          | [Community](https://github.com/juju-solutions/bundle-kubernetes-core) ( [@mbruzek](https://github.com/mbruzek), [@chuckbutler](https://github.com/chuckbutler) )
OpenStack                   | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/juju)                                   |          | [Community](https://github.com/juju-solutions/bundle-kubernetes-core) ( [@mbruzek](https://github.com/mbruzek), [@chuckbutler](https://github.com/chuckbutler) )
Microsoft Azure             | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/juju)                                   |          | [Community](https://github.com/juju-solutions/bundle-kubernetes-core) ( [@mbruzek](https://github.com/mbruzek), [@chuckbutler](https://github.com/chuckbutler) )
Google Compute Engine (GCE) | Juju         | Ubuntu | flannel     | [docs](/docs/getting-started-guides/juju)                                   |          | [Community](https://github.com/juju-solutions/bundle-kubernetes-core) ( [@mbruzek](https://github.com/mbruzek), [@chuckbutler](https://github.com/chuckbutler) )

For support level information on all solutions, see the [Table of solutions](/docs/getting-started-guides/#table-of-solutions) chart.
