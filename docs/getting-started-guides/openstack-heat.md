---
---

* TOC
{:toc}

## Getting started with OpenStack

This guide will take you through the steps of deploying Kubernetes to Openstack using `kube-up.sh`. The primary mechanisms for this are [OpenStack Heat](https://wiki.openstack.org/wiki/Heat) and the [SaltStack](https://github.com/kubernetes/kubernetes/tree/master/cluster/saltbase) distributed with Kubernetes.

The default OS is CentOS 7, this has not been tested on other operating systems.

This guide assumes you have access to a working OpenStack cluster with the following features:

- Nova
- Neutron
- Swift
- Glance
- Heat
- DNS resolution of instance names

By default this provider provisions 4 m1.medium instances. If you do not have resources available, please see the [Set additional configuration values](#set-additional-configuration-values) section for information on reducing the footprint of your cluster.

## Pre-Requisites
If you already have the required versions of the OpenStack CLI tools installed and configured, you can move on to the [Starting a cluster](#starting-a-cluster) section.

#### Install OpenStack CLI tools

```sh
sudo pip install -U --force 'python-openstackclient==2.4.0'
sudo pip install -U --force 'python-heatclient==1.1.0'
sudo pip install -U --force 'python-swiftclient==3.0.0'
sudo pip install -U --force 'python-glanceclient==2.0.0'
sudo pip install -U --force 'python-novaclient==3.4.0'
```

#### Configure Openstack CLI tools

Please talk to your local OpenStack administrator for an `openrc.sh` file.

Once you have that file, source it into your environment by typing

```sh
. ~/path/to/openrc.sh
```

This provider will consume the [correct variables](http://docs.openstack.org/user-guide/common/cli_set_environment_variables_using_openstack_rc.html) to talk to OpenStack and turn-up the Kubernetes cluster.

Otherwise, you must set the following appropriately:

```sh
export OS_USERNAME=username
export OS_PASSWORD=password
export OS_TENANT_NAME=projectName
export OS_AUTH_URL=https://identityHost:portNumber/v2.0
export OS_TENANT_ID=tenantIDString
export OS_REGION_NAME=regionName
```

#### Set additional configuration values

In addition, here are some commonly changed variables specific to this provider, with example values. Under most circumstances you will not have to change these. Please see the files in the next section for a full list of options.

```sh
export STACK_NAME=KubernetesStack
export NUMBER_OF_MINIONS=3
export MAX_NUMBER_OF_MINIONS=3
export MASTER_FLAVOR=m1.small
export MINION_FLAVOR=m1.small
export EXTERNAL_NETWORK=public
export DNS_SERVER=8.8.8.8
export IMAGE_URL_PATH=http://cloud.centos.org/centos/7/images
export IMAGE_FILE=CentOS-7-x86_64-GenericCloud-1510.qcow2
export SWIFT_SERVER_URL=http://192.168.123.100:8080
export ENABLE_PROXY=false
```

#### Manually overriding configuration values

If you do not have your environment variables set, or do not want them consumed, modify the variables in the following files under `cluster/openstack-heat`:

- **[config-default.sh](http://releases.k8s.io/{{page.githubbranch}}/cluster/openstack-heat/config-default.sh)** Sets all parameters needed for heat template.
- **[config-image.sh](http://releases.k8s.io/{{page.githubbranch}}/cluster/openstack-heat/config-image.sh)** Sets parameters needed to download and create new OpenStack image via glance.
- **[openrc-default.sh](http://releases.k8s.io/{{page.githubbranch}}/cluster/openstack-heat/openrc-default.sh)** Sets environment variables for communicating to OpenStack. These are consumed by the cli tools (heat, glance, swift, nova).
- **[openrc-swift.sh](http://releases.k8s.io/{{page.githubbranch}}/cluster/openstack-heat/openrc-swift.sh)** Some OpenStack setups require the use of seperate swift credentials. Put those credentials in this file.

Please see the contents of these files for documentation regarding each variable's function.

## Starting a cluster

Once Kubernetes version 1.3 is released, and you've installed the OpenStack CLI tools and have set your OpenStack environment variables, issue this command:

```sh
export KUBERNETES_PROVIDER=openstack-heat; curl -sS https://get.k8s.io | bash
```
Alternatively, you can download a [Kubernetes release](https://github.com/kubernetes/kubernetes/releases) of version 1.3 or higher and extract the archive. To start your cluster, open a shell and run:

```sh
cd kubernetes # Or whichever path you have extracted the release to
KUBERNETES_PROVIDER=openstack-heat ./cluster/kube-up.sh
```
Or, if you are working from a checkout of the Kubernetes code base, and want to build/test from source:

```sh
cd kubernetes # Or whatever your checkout root directory is called
make clean
make quick-release
KUBERNETES_PROVIDER=openstack-heat ./cluster/kube-up.sh
```

## Inspect your cluster

Once kube-up is finished, your cluster should be running:

```console
./cluster/kubectl.sh get cs
NAME                 STATUS    MESSAGE              ERROR
controller-manager   Healthy   ok
scheduler            Healthy   ok
etcd-1               Healthy   {"health": "true"}
etcd-0               Healthy   {"health": "true"}
```

You can also list the nodes in your cluster:

```console
./cluster/kubectl.sh get nodes
NAME                            STATUS    AGE
kubernetesstack-node-ojszyjtr   Ready     42m
kubernetesstack-node-tzotzcbp   Ready     46m
kubernetesstack-node-uah8pkju   Ready     47m
```
Being a new cluster, there will be no pods or replication controllers in the default namespace:

```console
./cluster/kubectl.sh get pods
./cluster/kubectl.sh get replicationcontrollers
```

You are now ready to create Kubernetes objects.

## Using your cluster

For a simple test, issue the following command:

```sh
./cluster/kubectl.sh run nginx --image=nginx --generator=run-pod/v1
```

Soon, you should have a running nginx pod:

```console
./cluster/kubectl.sh get pods
NAME      READY     STATUS    RESTARTS   AGE
nginx     1/1       Running   0          5m
```

Once the nginx pod is running, use the port-forward command to set up a proxy from your machine to the pod.

```sh
./cluster/kubectl.sh port-forward nginx 8888:80
```

You should now see nginx on [http://localhost:8888]().

For more complex examples please see the [examples directory](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/).

## Administering your cluster with Openstack

You can manage the nodes in your cluster using the OpenStack CLI Tools.

First, set your environment variables:

```sh
. cluster/openstack-heat/config-default.sh
. cluster/openstack-heat/openrc-default.sh
```

To get all information about your cluster, use heat:

```sh
heat stack-show $STACK_NAME
```

To see a list of nodes, use nova:

```sh
nova list --name=$STACK_NAME
```

See the [OpenStack CLI Reference](http://docs.openstack.org/cli-reference/) for more details.

## SSHing to your nodes

Your public key was added during the cluster turn-up, so you can easily ssh to them for troubleshooting purposes.

```sh
ssh minion@IP_ADDRESS
```

## Cluster deployment customization examples
You may find the need to modify environment variables to change the behaviour of kube-up. Here are some common scenarios:

#### Proxy configuration
If you are behind a proxy, and have your local environment variables setup, you can use these variables to setup your Kubernetes cluster:

```sh
ENABLE_PROXY=true KUBERNETES_PROVIDER=openstack-heat ./cluster/kube-up.sh
```

#### Setting different Swift URL
Some deployments differ from the default Swift URL:

```sh
 SWIFT_SERVER_URL="http://10.100.0.100:8080" KUBERNETES_PROVIDER=openstack-heat ./cluster/kube-up.sh
```

#### Public network name.
Sometimes the name of the public network differs from the default `public`:

```sh
EXTERNAL_NETWORK="network_external" KUBERNETES_PROVIDER=openstack-heat ./cluster/kube-up.sh
```

#### Spinning up additional clusters.
You may want to spin up another cluster within your OpenStack project. Use the `$STACK_NAME` variable to accomplish this.

```sh
STACK_NAME=k8s-cluster-2 KUBERNETES_PROVIDER=openstack-heat ./cluster/kube-up.sh
```

For more configuration examples, please browse the files mentioned in the [Configuration](#set-additional-configuration-values) section.


## Tearing down your cluster

To bring down your cluster, issue the following command:

```sh
KUBERNETES_PROVIDER=openstack-heat ./cluster/kube-down.sh
```
If you have changed the default `$STACK_NAME`, you must specify the name. Note that this will not remove any Cinder volumes created by Kubernetes.
