---
---

* TOC
{:toc}

## Getting started with OpenStack

Running Kubernetes with Openstack is an easy way to create Kubernetes cluster on the top of OpenStack. Heat OpenStack Orchestration
engine describes the infrastructure for Kubernetes cluster. CentoOS images are used for Kubernetes host machines.

## Prerequisites

1. Install latest version OpenStack clients

    heat >= 0.9.0

    swift >= 2.7.0

    glance >= 1.2.0

    nova >= 3.2.0

    ```
    sudo pip install -U --force python-heatclient
    sudo pip install -U --force python-swiftclient
    sudo pip install -U --force python-glanceclient
    sudo pip install -U --force python-novaclient
    ```
#### Note:
OpenStack CLI clients like python-PROJECTNAMEclient are going to be deprecated soon in favor of universal OpenStack CLI client.
More information you can find here: [deprecate-cli](https://specs.openstack.org/openstack/openstack-specs/specs/deprecate-cli.html)


2. Set proper values in configuration files

Project contains four files with configuration: config-default.sh, config-image.sh, openrc-default.sh and openrc-swift.sh

**config-default.sh** sets all parameters needed for heat template.
Additionally there is a flag CREATE_IMAGE which indicates if new image must be created.
If 'false' then image with IMAGE_ID will be used.

**config-image.sh** sets parameters needed to create new OpenStack image if flag CREATE_IMAGE=true.
Use CentOS 7 image for this purpose. You can get image here: [CentOS images](http://cloud.centos.org/centos/7/images/)

**openrc-default.sh openrs-swift.sh** those files contain credential variables for OpenStack clients.


## Setup

Setting up a cluster:

```sh
export KUBERNETES_PROVIDER=openstack
cd kubernetes
make clean
make quick-release
./cluster/kube-up.sh
```

Alternatively, you can download [Kubernetes release](https://github.com/kubernetes/kubernetes/releases) and extract the archive. To start your local cluster, open a shell and run:

```sh
cd kubernetes

export KUBERNETES_PROVIDER=openstack
./cluster/kube-up.sh
```

The `KUBERNETES_PROVIDER` environment variable tells all of the various cluster management scripts which variant to use.  If you forget to set this, the assumption is you are running on Google Compute Engine.

## Interacting with your Kubernetes cluster with Openstack

You can manage the nodes in your cluster with the Openstack WEB UI like Horizon or using heat or nova clients.

To get all necessary information about cluster execute commands in main kubernetes directory:

```
. cluster/openstack/config-default.sh
. cluster/openstack/openrc-default.sh
heat stack-show $STACK_NAME
```

You will get cluster status and IP addresses for your master and minion nodes.

## Authenticating with your master

Because you added public key to nodes you can easily ssh to them.

```
$ ssh minion@IP_ADDRESS
```

## Running containers

Your cluster is running, you can list the nodes in your cluster:

```console
$ ./cluster/kubectl.sh get nodes
NAME                            LABELS                                                 STATUS    AGE
kubernetesstack-node-tc9f2tfr   kubernetes.io/hostname=kubernetesstack-node-tc9f2tfr   Ready     21h
```

Before starting a container there will be no pods, services and replication controllers.

```console
$ ./cluster/kubectl.sh get pods
NAME        READY     STATUS    RESTARTS   AGE

$ ./cluster/kubectl.sh get services
NAME              CLUSTER_IP       EXTERNAL_IP       PORT(S)       SELECTOR               AGE

$ ./cluster/kubectl.sh get replicationcontrollers
CONTROLLER   CONTAINER(S)   IMAGE(S)   SELECTOR   REPLICAS
```

Now you are ready to create you first service and controller.
