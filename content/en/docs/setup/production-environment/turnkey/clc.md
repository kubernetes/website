---
title: Running Kubernetes on CenturyLink Cloud
---


These scripts handle the creation, deletion and expansion of Kubernetes clusters on CenturyLink Cloud.

You can accomplish all these tasks with a single command. We have made the Ansible playbooks used to perform these tasks available [here](https://github.com/CenturyLinkCloud/adm-kubernetes-on-clc/blob/master/ansible/README.md).

## Find Help

If you run into any problems or want help with anything, we are here to help. Reach out to use via any of the following ways:

- Submit a github issue
- Send an email to Kubernetes AT ctl DOT io
- Visit [http://info.ctl.io/kubernetes](http://info.ctl.io/kubernetes)

## Clusters of VMs or Physical Servers, your choice.

- We support Kubernetes clusters on both Virtual Machines or Physical Servers. If you want to use physical servers for the worker nodes (minions), simple use the --minion_type=bareMetal flag.
- For more information on physical servers, visit: [https://www.ctl.io/bare-metal/](https://www.ctl.io/bare-metal/)
- Physical serves are only available in the VA1 and GB3 data centers.
- VMs are available in all 13 of our public cloud locations

## Requirements

The requirements to run this script are:

- A linux administrative host (tested on ubuntu and macOS)
- python 2 (tested on 2.7.11)
  - pip (installed with python as of 2.7.9)
- git
- A CenturyLink Cloud account with rights to create new hosts
- An active VPN connection to the CenturyLink Cloud from your linux host

## Script Installation

After you have all the requirements met, please follow these instructions to install this script.

1) Clone this repository and cd into it.

```shell
git clone https://github.com/CenturyLinkCloud/adm-kubernetes-on-clc
```

2) Install all requirements, including

  * Ansible
  * CenturyLink Cloud SDK
  * Ansible Modules

```shell
sudo pip install -r ansible/requirements.txt
```

3) Create the credentials file from the template and use it to set your ENV variables

```shell
cp ansible/credentials.sh.template ansible/credentials.sh
vi ansible/credentials.sh
source ansible/credentials.sh

```

4) Grant your machine access to the CenturyLink Cloud network by using a VM inside the network or [ configuring a VPN connection to the CenturyLink Cloud network.](https://www.ctl.io/knowledge-base/network/how-to-configure-client-vpn/)


#### Script Installation Example: Ubuntu 14 Walkthrough

If you use an ubuntu 14, for your convenience we have provided a step by step
guide to install the requirements and install the script.

```shell
# system
apt-get update
apt-get install -y git python python-crypto
curl -O https://bootstrap.pypa.io/get-pip.py
python get-pip.py

# installing this repository
mkdir -p ~home/k8s-on-clc
cd ~home/k8s-on-clc
git clone https://github.com/CenturyLinkCloud/adm-kubernetes-on-clc.git
cd adm-kubernetes-on-clc/
pip install -r requirements.txt

# getting started
cd ansible
cp credentials.sh.template credentials.sh; vi credentials.sh
source credentials.sh
```



## Cluster Creation

To create a new Kubernetes cluster, simply run the ```kube-up.sh``` script. A complete
list of script options and some examples are listed below.

```shell
CLC_CLUSTER_NAME=[name of kubernetes cluster]
cd ./adm-kubernetes-on-clc
bash kube-up.sh -c="$CLC_CLUSTER_NAME"
```

It takes about 15 minutes to create the cluster. Once the script completes, it
will output some commands that will help you setup kubectl on your machine to
point to the new cluster.

When the cluster creation is complete, the configuration files for it are stored
locally on your administrative host, in the following directory

```shell
> CLC_CLUSTER_HOME=$HOME/.clc_kube/$CLC_CLUSTER_NAME/
```


#### Cluster Creation: Script Options

```shell
Usage: kube-up.sh [OPTIONS]
Create servers in the CenturyLinkCloud environment and initialize a Kubernetes cluster
Environment variables CLC_V2_API_USERNAME and CLC_V2_API_PASSWD must be set in
order to access the CenturyLinkCloud API

All options (both short and long form) require arguments, and must include "="
between option name and option value.

     -h (--help)                   display this help and exit
     -c= (--clc_cluster_name=)     set the name of the cluster, as used in CLC group names
     -t= (--minion_type=)          standard -> VM (default), bareMetal -> physical]
     -d= (--datacenter=)           VA1 (default)
     -m= (--minion_count=)         number of kubernetes minion nodes
     -mem= (--vm_memory=)          number of GB ram for each minion
     -cpu= (--vm_cpu=)             number of virtual cps for each minion node
     -phyid= (--server_conf_id=)   physical server configuration id, one of
                                      physical_server_20_core_conf_id
                                      physical_server_12_core_conf_id
                                      physical_server_4_core_conf_id (default)
     -etcd_separate_cluster=yes    create a separate cluster of three etcd nodes,
                                   otherwise run etcd on the master node
```

## Cluster Expansion

To expand an existing Kubernetes cluster, run the ```add-kube-node.sh```
script. A complete list of script options and some examples are listed [below](#cluster-expansion-script-options).
This script must be run from the same host that created the cluster (or a host
that has the cluster artifact files stored in ```~/.clc_kube/$cluster_name```).

```shell
cd ./adm-kubernetes-on-clc
bash add-kube-node.sh -c="name_of_kubernetes_cluster" -m=2
```

#### Cluster Expansion: Script Options

```shell
Usage: add-kube-node.sh [OPTIONS]
Create servers in the CenturyLinkCloud environment and add to an
existing CLC kubernetes cluster

Environment variables CLC_V2_API_USERNAME and CLC_V2_API_PASSWD must be set in
order to access the CenturyLinkCloud API

     -h (--help)                   display this help and exit
     -c= (--clc_cluster_name=)     set the name of the cluster, as used in CLC group names
     -m= (--minion_count=)         number of kubernetes minion nodes to add
```

## Cluster Deletion

There are two ways to delete an existing cluster:

1) Use our python script:

```shell
python delete_cluster.py --cluster=clc_cluster_name --datacenter=DC1
```

2) Use the CenturyLink Cloud UI. To delete a cluster, log into the CenturyLink
Cloud control portal and delete the parent server group that contains the
Kubernetes Cluster. We hope to add a scripted option to do this soon.

## Examples

Create a cluster with name of k8s_1, 1 master node and 3 worker minions (on physical machines), in VA1

```shell
bash kube-up.sh --clc_cluster_name=k8s_1 --minion_type=bareMetal --minion_count=3 --datacenter=VA1
```

Create a cluster with name of k8s_2, an ha etcd cluster on 3 VMs and 6 worker minions (on VMs), in VA1

```shell
bash kube-up.sh --clc_cluster_name=k8s_2 --minion_type=standard --minion_count=6 --datacenter=VA1 --etcd_separate_cluster=yes
```

Create a cluster with name of k8s_3, 1 master node, and 10 worker minions (on VMs) with higher mem/cpu, in UC1:

```shell
bash kube-up.sh --clc_cluster_name=k8s_3 --minion_type=standard --minion_count=10 --datacenter=VA1 -mem=6 -cpu=4
```



## Cluster Features and Architecture

We configure the Kubernetes cluster with the following features:

* KubeDNS: DNS resolution and service discovery
* Heapster/InfluxDB: For metric collection. Needed for Grafana and auto-scaling.
* Grafana: Kubernetes/Docker metric dashboard
* KubeUI: Simple web interface to view Kubernetes state
* Kube Dashboard: New web interface to interact with your cluster

We use the following to create the Kubernetes cluster:

* Kubernetes 1.1.7
* Ubuntu 14.04
* Flannel 0.5.4
* Docker 1.9.1-0~trusty
* Etcd 2.2.2

## Optional add-ons

* Logging: We offer an integrated centralized logging ELK platform so that all
  Kubernetes and docker logs get sent to the ELK stack. To install the ELK stack
  and configure Kubernetes to send logs to it, follow [the log
  aggregation documentation](https://github.com/CenturyLinkCloud/adm-kubernetes-on-clc/blob/master/log_aggregration.md). Note: We don't install this by default as
  the footprint isn't trivial.

## Cluster management

The most widely used tool for managing a Kubernetes cluster is the command-line
utility ```kubectl```.  If you do not already have a copy of this binary on your
administrative machine, you may run the script ```install_kubectl.sh``` which will
download it and install it in ```/usr/bin/local```.

The script requires that the environment variable ```CLC_CLUSTER_NAME``` be defined. ```install_kubectl.sh``` also writes a configuration file which will embed the necessary
authentication certificates for the particular cluster.  The configuration file is
written to the  ```${CLC_CLUSTER_HOME}/kube``` directory


```shell
export KUBECONFIG=${CLC_CLUSTER_HOME}/kube/config
kubectl version
kubectl cluster-info
```

### Accessing the cluster programmatically 

It's possible to use the locally stored client certificates to access the apiserver. For example, you may want to use any of the [Kubernetes API client libraries](/docs/reference/using-api/client-libraries/) to program against your Kubernetes cluster in the programming language of your choice. 

To demonstrate how to use these locally stored certificates, we provide the following example of using ```curl``` to communicate to the master apiserver via https:

```shell
curl \
   --cacert ${CLC_CLUSTER_HOME}/pki/ca.crt  \
   --key ${CLC_CLUSTER_HOME}/pki/kubecfg.key \
   --cert ${CLC_CLUSTER_HOME}/pki/kubecfg.crt  https://${MASTER_IP}:6443
```

But please note, this *does not* work out of the box with the ```curl``` binary
distributed with macOS.

### Accessing the cluster with a browser

We install [the kubernetes dashboard](/docs/tasks/web-ui-dashboard/). When you
create a cluster, the script should output URLs for these interfaces like this:

kubernetes-dashboard is running at ```https://${MASTER_IP}:6443/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy```.

Note on Authentication to the UIs: 

The cluster is set up to use basic authentication for the user _admin_.
Hitting the url at ```https://${MASTER_IP}:6443``` will 
require accepting the self-signed certificate
from the apiserver, and then presenting the admin 
password written to file at: ```> _${CLC_CLUSTER_HOME}/kube/admin_password.txt_```


### Configuration files

Various configuration files are written into the home directory *CLC_CLUSTER_HOME* under ```.clc_kube/${CLC_CLUSTER_NAME}``` in several subdirectories. You can use these files
to access the cluster from machines other than where you created the cluster from.

* ```config/```: Ansible variable files containing parameters describing the master and minion hosts
* ```hosts/```: hosts files listing access information for the Ansible playbooks
* ```kube/```: ```kubectl``` configuration files, and the basic-authentication password for admin access to the Kubernetes API
* ```pki/```: public key infrastructure files enabling TLS communication in the cluster
* ```ssh/```: SSH keys for root access to the hosts


## ```kubectl``` usage examples

There are a great many features of _kubectl_.  Here are a few examples

List existing nodes, pods, services and more, in all namespaces, or in just one:

```shell
kubectl get nodes
kubectl get --all-namespaces pods
kubectl get --all-namespaces services
kubectl get --namespace=kube-system replicationcontrollers
```

The Kubernetes API server exposes services on web URLs, which are protected by requiring
client certificates.  If you run a kubectl proxy locally, ```kubectl``` will provide
the necessary certificates and serve locally over http.

```shell
kubectl proxy -p 8001
```

Then, you can access urls like ```http://127.0.0.1:8001/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy/``` without the need for client certificates in your browser.


## What Kubernetes features do not work on CenturyLink Cloud

These are the known items that don't work on CenturyLink cloud but do work on other cloud providers:

- At this time, there is no support services of the type [LoadBalancer](/docs/tasks/access-application-cluster/create-external-load-balancer/). We are actively working on this and hope to publish the changes sometime around April 2016.

- At this time, there is no support for persistent storage volumes provided by
  CenturyLink Cloud. However, customers can bring their own persistent storage
  offering. We ourselves use Gluster.


## Ansible Files

If you want more information about our Ansible files, please [read this file](https://github.com/CenturyLinkCloud/adm-kubernetes-on-clc/blob/master/ansible/README.md)

## Further reading

Please see the [Kubernetes docs](/docs/) for more details on administering
and using a Kubernetes cluster.



